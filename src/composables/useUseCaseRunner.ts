import { reactive, ref } from "vue";

import { wazuhApi } from "@/api/wazuh";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import { runScript } from "@/api/agents";
import type {
  UseCaseManifest,
  UseCaseRunMode,
  UseCaseRunStep,
  UseCaseRunStepStatus,
} from "@/types/wazuhOps";

/**
 * Drives the end-to-end execution of a Use Case manifest:
 *   resolve assets → push manager files → push agent files → restart →
 *   demo attack → verify by Indexer.
 *
 * State (steps[], succeeded, finished_at) is reactive so a Timeline
 * component can render progress without polling.
 */

const ALERTS_INDEX = "wazuh-alerts-*";

export interface UseCaseRunnerHooks {
  /**
   * Resolves a manifest content_ref to a string. Allows the caller
   * (UI layer) to load files via dynamic import or fetch — the engine
   * stays decoupled from the asset storage backend.
   */
  resolveAsset: (contentRef: string) => Promise<string>;
}

interface RunStepDef {
  id: string;
  label: string;
  run: () => Promise<unknown>;
  skipIf?: () => boolean;
}

export function useUseCaseRunner(hooks: UseCaseRunnerHooks) {
  const steps = reactive<UseCaseRunStep[]>([]);
  const running = ref(false);
  const succeeded = ref<boolean | null>(null);
  const startedAt = ref<string | null>(null);
  const finishedAt = ref<string | null>(null);

  function setStep(id: string, status: UseCaseRunStepStatus, patch: Partial<UseCaseRunStep> = {}) {
    const step = steps.find((s) => s.id === id);
    if (!step) return;
    step.status = status;
    if (status === "running" && !step.started_at) {
      step.started_at = new Date().toISOString();
    }
    if (status === "ok" || status === "failed" || status === "skipped") {
      step.finished_at = new Date().toISOString();
    }
    Object.assign(step, patch);
  }

  function reset(manifest: UseCaseManifest, mode: UseCaseRunMode) {
    steps.splice(0, steps.length);
    succeeded.value = null;
    startedAt.value = null;
    finishedAt.value = null;

    steps.push({ id: "resolve", label: "Resolve manifest assets", status: "pending" });
    if (manifest.files.some((f) => f.target === "manager")) {
      steps.push({
        id: "manager-files",
        label: "Push manager files",
        status: "pending",
      });
    }
    if (manifest.files.some((f) => f.target !== "manager")) {
      steps.push({
        id: "agent-files",
        label: "Push agent files",
        status: "pending",
      });
    }
    if (manifest.restart.length) {
      steps.push({
        id: "restart",
        label: `Restart targets (${manifest.restart.length})`,
        status: "pending",
      });
    }
    if (mode === "deploy_and_demo" && manifest.demo_attack) {
      steps.push({ id: "demo", label: "Run demo attack", status: "pending" });
    }
    if (mode === "deploy_and_demo" && manifest.verification) {
      steps.push({ id: "verify", label: "Verify alert in Indexer", status: "pending" });
    }
  }

  async function runStep(def: RunStepDef) {
    if (def.skipIf?.()) {
      setStep(def.id, "skipped");
      return;
    }
    setStep(def.id, "running");
    try {
      const details = await def.run();
      setStep(def.id, "ok", { details });
    } catch (err: unknown) {
      const error = (err as Error)?.message ?? String(err);
      setStep(def.id, "failed", { error });
      throw err;
    }
  }

  async function execute(manifest: UseCaseManifest, mode: UseCaseRunMode) {
    reset(manifest, mode);
    running.value = true;
    succeeded.value = null;
    startedAt.value = new Date().toISOString();

    // === Resolve ===
    const resolved: Record<string, string> = {};
    try {
      await runStep({
        id: "resolve",
        label: "Resolve",
        run: async () => {
          for (const f of manifest.files) {
            if (resolved[f.content_ref] === undefined) {
              resolved[f.content_ref] = await hooks.resolveAsset(f.content_ref);
            }
          }
          return { resolved: Object.keys(resolved).length };
        },
      });
    } catch {
      finalize(false);
      return;
    }

    // === Manager files ===
    const managerFiles = manifest.files.filter((f) => f.target === "manager");
    if (managerFiles.length) {
      try {
        await runStep({
          id: "manager-files",
          label: "Manager files",
          run: async () => {
            const results: Record<string, string> = {};
            for (const f of managerFiles) {
              const content = resolved[f.content_ref];
              const ct = f.path.endsWith(".xml") || f.path.endsWith(".conf")
                ? "application/xml"
                : "application/octet-stream";
              await wazuhApi.putManagerFile(f.path, content, { contentType: ct });
              results[f.path] = "saved";
            }
            return results;
          },
        });
      } catch {
        finalize(false);
        return;
      }
    }

    // === Agent files (currently surfaced as TODO — full path requires
    // FileAsset upload + delivery wiring in TRMM). ===
    const agentFiles = manifest.files.filter((f) => f.target !== "manager");
    if (agentFiles.length) {
      setStep("agent-files", "running");
      setStep("agent-files", "skipped", {
        details: {
          message:
            "Agent file delivery requires a TRMM file asset upload step. Pre-upload the assets and wire delivery, or push files via Workshop > Scripts (Push as AR).",
          files: agentFiles.map((f) => f.path),
        },
      });
    }

    // === Restart ===
    if (manifest.restart.length) {
      try {
        await runStep({
          id: "restart",
          label: "Restart",
          run: async () => {
            const summary: { target: string; ok: boolean; error?: string }[] = [];
            for (const t of manifest.restart) {
              try {
                if (t === "manager") {
                  await wazuhApi.restartManager();
                  summary.push({ target: "manager", ok: true });
                } else if ("agent_id" in t) {
                  await wazuhApi.restartAgent(t.agent_id);
                  summary.push({ target: `agent:${t.agent_id}`, ok: true });
                } else if ("agent_group" in t) {
                  await wazuhApi.restartAgentsByGroup(t.agent_group);
                  summary.push({ target: `group:${t.agent_group}`, ok: true });
                }
              } catch (e: unknown) {
                summary.push({
                  target: JSON.stringify(t),
                  ok: false,
                  error: (e as Error)?.message ?? String(e),
                });
              }
            }
            const failed = summary.filter((s) => !s.ok);
            if (failed.length) {
              throw new Error(
                `Restart failed for ${failed.length} target(s): ${failed
                  .map((f) => f.target)
                  .join(", ")}`,
              );
            }
            return summary;
          },
        });
      } catch {
        finalize(false);
        return;
      }
    }

    // === Demo attack ===
    let demoStartedAt = 0;
    if (mode === "deploy_and_demo" && manifest.demo_attack) {
      const atk = manifest.demo_attack;
      try {
        await runStep({
          id: "demo",
          label: "Demo attack",
          run: async () => {
            demoStartedAt = Date.now();
            // Resolve target — for agent_group we fan out to first
            // active agent of the group (caller can override via UI).
            const targetAgentId = await resolveTargetAgentId(atk.target_selector);
            const payload = {
              script: atk.trmm_script_id,
              args: atk.params,
              timeout: 120,
            };
            const r = await runScript(targetAgentId, payload);
            return { agent_id: targetAgentId, response: r };
          },
        });
      } catch {
        finalize(false);
        return;
      }
    }

    // === Verify ===
    if (mode === "deploy_and_demo" && manifest.verification) {
      const v = manifest.verification;
      try {
        await runStep({
          id: "verify",
          label: "Verify",
          run: async () => {
            const since = demoStartedAt
              ? new Date(demoStartedAt - 5_000).toISOString()
              : new Date(Date.now() - 60_000).toISOString();
            const deadline = Date.now() + v.wait_timeout_sec * 1000;
            while (Date.now() < deadline) {
              const hits = await searchAlerts(v.rule_id, since);
              if (hits.length > 0) {
                return {
                  matched: true,
                  count: hits.length,
                  first_hit: hits[0],
                };
              }
              await sleep(3000);
            }
            throw new Error(
              `Timed out after ${v.wait_timeout_sec}s waiting for rule ${v.rule_id}.`,
            );
          },
        });
      } catch {
        finalize(false);
        return;
      }
    }

    finalize(true);
  }

  function finalize(ok: boolean) {
    running.value = false;
    succeeded.value = ok;
    finishedAt.value = new Date().toISOString();
  }

  return {
    steps,
    running,
    succeeded,
    startedAt,
    finishedAt,
    execute,
  };
}

// === helpers ===

async function resolveTargetAgentId(
  selector: { type: string; agent_id?: string; group_id?: string },
): Promise<string> {
  if (selector.type === "agent" && selector.agent_id) {
    return selector.agent_id;
  }
  if (selector.type === "agent_group" && selector.group_id) {
    const r = await wazuhApi.getGroupAgents(selector.group_id, { status: "active" });
    const first = r.data.affected_items.find((a) => a.id !== "000");
    if (!first) throw new Error(`Group ${selector.group_id} has no active agents`);
    return first.id;
  }
  throw new Error("Invalid target_selector — need agent_id or active agent in group");
}

async function searchAlerts(ruleId: number, sinceIso: string) {
  const body = {
    size: 5,
    sort: [{ "@timestamp": { order: "desc" as const } }],
    query: {
      bool: {
        filter: [
          { term: { "rule.id": String(ruleId) } },
          { range: { "@timestamp": { gte: sinceIso } } },
        ],
      },
    },
  };
  const resp = await wazuhIndexerApi.search<Record<string, unknown>>(
    ALERTS_INDEX,
    body,
  );
  return resp.hits?.hits ?? [];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
