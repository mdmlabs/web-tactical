<template>
  <div class="ac-shell">
    <div class="ac-header">
      <h1 class="ac-title">Agent Compliance</h1>
      <p class="ac-subtitle">
        SCA policy results per agent. Use the buttons on each failed check
        to fix-and-re-scan and watch the closure indicator move.
      </p>
    </div>

    <!-- Agent / group selector -->
    <q-card flat bordered class="ac-card">
      <q-card-section class="ac-toolbar">
        <q-select
          v-model="selectedAgentId"
          :options="agentOptions"
          :loading="agentsLoading"
          dense
          outlined
          emit-value
          map-options
          label="Agent"
          use-input
          input-debounce="200"
          class="ac-toolbar-item"
          @filter="filterAgents"
          @update:model-value="onAgentSelected"
        />
        <q-btn
          flat
          dense
          icon="refresh"
          :loading="policiesLoading"
          :disable="!selectedAgentId"
          @click="loadPolicies"
        >
          <q-tooltip>Reload policies</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          icon="rotate_right"
          :loading="rescanning"
          :disable="!selectedAgentId"
          @click="rescanAgent"
        >
          <q-tooltip>Trigger SCA re-scan on agent</q-tooltip>
        </q-btn>
        <q-space />

        <div v-if="selectedAgentId" class="ac-progress">
          <span class="ac-progress-label">
            Closed
            <strong>{{ totalPass }}</strong> /
            <strong>{{ totalChecks }}</strong>
          </span>
          <q-linear-progress
            :value="totalChecks ? totalPass / totalChecks : 0"
            color="positive"
            track-color="grey-3"
            size="10px"
            class="ac-progress-bar"
          />
        </div>

        <q-btn
          v-if="selectedAgentId"
          no-caps
          outline
          color="primary"
          icon="auto_awesome"
          label="Apply baseline (bulk)"
          :disable="!hasFailedWithRemediation"
          @click="onBulkApply"
        />
      </q-card-section>
    </q-card>

    <!-- Policies & checks -->
    <q-card flat bordered class="ac-card">
      <q-card-section v-if="!selectedAgentId" class="ac-empty">
        <q-icon name="verified" size="32px" />
        <p>Pick an agent to load SCA policies.</p>
      </q-card-section>
      <q-card-section v-else>
        <q-list separator>
          <q-expansion-item
            v-for="p in policies"
            :key="p.policy_id"
            switch-toggle-side
            :default-opened="policies.length === 1"
            @show="loadChecks(p.policy_id)"
          >
            <template #header>
              <q-item-section>
                <q-item-label>{{ p.name }}</q-item-label>
                <q-item-label caption>
                  pass {{ p.pass }} · fail {{ p.fail }} · score {{ p.score }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-linear-progress
                  :value="p.total_checks ? p.pass / p.total_checks : 0"
                  color="primary"
                  track-color="grey-3"
                  size="6px"
                  class="ac-policy-bar"
                />
              </q-item-section>
            </template>
            <q-card flat>
              <q-card-section>
                <q-table
                  :pagination="paginationFor(p.policy_id)"
                  :rows="checksByPolicy[p.policy_id] ?? []"
                  :columns="checkColumns"
                  :loading="checksLoading[p.policy_id]"
                  row-key="id"
                  flat
                  dense
                  :rows-per-page-options="[10, 25, 50]"
                  binary-state-sort
                  @update:pagination="(v) => (pagination[p.policy_id] = v)"
                >
                  <template #body-cell-result="{ row }">
                    <q-td>
                      <q-chip
                        v-if="row.result === 'passed'"
                        color="positive"
                        text-color="white"
                        dense
                      >
                        passed
                      </q-chip>
                      <q-chip
                        v-else-if="row.result === 'failed'"
                        color="negative"
                        text-color="white"
                        dense
                      >
                        failed
                      </q-chip>
                      <q-chip v-else dense>{{ row.result }}</q-chip>
                    </q-td>
                  </template>
                  <template #body-cell-actions="{ row }">
                    <q-td>
                      <q-btn
                        v-if="row.result === 'failed'"
                        flat
                        dense
                        no-caps
                        icon="play_arrow"
                        :label="actionLabel(p.policy_id, row.id)"
                        :disable="!hasRemediation(p.policy_id, row.id)"
                        :loading="actionLoading[`${p.policy_id}:${row.id}`]"
                        @click="onFix(p.policy_id, row)"
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        icon="rotate_right"
                        label="Re-scan"
                        :loading="rescanning"
                        @click="rescanAgent"
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-item v-if="!policies.length && !policiesLoading">
            <q-item-section class="text-grey">
              No SCA policies for this agent yet.
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";

import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import { runScript } from "@/api/agents";
import { notifyError, notifyInfo, notifySuccess } from "@/utils/notify";
import remediationsRegistry from "@/config/sca-remediations.json";
import type {
  ScaRemediation,
  ScaRemediationRegistry,
} from "@/types/wazuhOps";
import type { WazuhSCAPolicy, WazuhSCACheck } from "@/types/wazuh";

const $q = useQuasar();
const wazuhStore = useWazuhStore();

// remediations.json includes a `_comment` key for human readers; strip
// it before treating the file as a registry.
const registry: ScaRemediationRegistry = Object.fromEntries(
  Object.entries(remediationsRegistry as Record<string, unknown>).filter(
    ([k]) => k !== "_comment",
  ),
) as ScaRemediationRegistry;

const selectedAgentId = ref<string | null>(null);
const policies = ref<WazuhSCAPolicy[]>([]);
const policiesLoading = ref(false);
const rescanning = ref(false);

const checksByPolicy = reactive<Record<string, WazuhSCACheck[]>>({});
const checksLoading = reactive<Record<string, boolean>>({});
const pagination = reactive<Record<string, { rowsPerPage: number }>>({});
function paginationFor(policyId: string) {
  return pagination[policyId] ?? { rowsPerPage: 10 };
}

const actionLoading = reactive<Record<string, boolean>>({});

const agentOptions = ref<{ label: string; value: string }[]>([]);
const allAgentOptions = ref<{ label: string; value: string }[]>([]);
const agentsLoading = computed(() => wazuhStore.agentsLoading);

const checkColumns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true },
  { name: "title", label: "Title", field: "title", align: "left" as const },
  { name: "result", label: "Result", field: "result", align: "left" as const, sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const totalChecks = computed(() =>
  policies.value.reduce((acc, p) => acc + (p.total_checks ?? 0), 0),
);
const totalPass = computed(() =>
  policies.value.reduce((acc, p) => acc + (p.pass ?? 0), 0),
);

const hasFailedWithRemediation = computed(() => {
  for (const p of policies.value) {
    const checks = checksByPolicy[p.policy_id] ?? [];
    if (
      checks.some(
        (c) =>
          c.result === "failed" &&
          hasRemediation(p.policy_id, c.id),
      )
    ) {
      return true;
    }
  }
  return false;
});

function hasRemediation(policyId: string, checkId: number): boolean {
  return Boolean(registry[policyId]?.[String(checkId)]);
}

function getRemediation(policyId: string, checkId: number): ScaRemediation | undefined {
  return registry[policyId]?.[String(checkId)];
}

function actionLabel(policyId: string, checkId: number): string {
  const r = getRemediation(policyId, checkId);
  if (!r) return "No fix mapped";
  switch (r.type) {
    case "trmm_script":
      return "Run fix script";
    case "use_case":
      return "Deploy use case";
    case "file_delivery":
      return "Push fix file";
    default:
      return "Run fix";
  }
}

async function loadAgents() {
  if (!wazuhStore.wazuhAgents.length) {
    try {
      await wazuhStore.fetchAgents();
    } catch {
      // store handles errors
    }
  }
  allAgentOptions.value = wazuhStore.wazuhAgents
    .filter((a) => a.id !== "000")
    .map((a) => ({
      label: `${a.name} (#${a.id}) — ${a.status}`,
      value: a.id,
    }));
  agentOptions.value = allAgentOptions.value;
}

function filterAgents(input: string, doneFn: (cb: () => void) => void) {
  doneFn(() => {
    const q = input?.toLowerCase().trim() ?? "";
    agentOptions.value = q
      ? allAgentOptions.value.filter((o) => o.label.toLowerCase().includes(q))
      : allAgentOptions.value;
  });
}

async function onAgentSelected(id: string | null) {
  if (!id) return;
  await loadPolicies();
}

async function loadPolicies() {
  if (!selectedAgentId.value) return;
  policiesLoading.value = true;
  try {
    const r = await wazuhApi.getSCA(selectedAgentId.value);
    policies.value = r.data.affected_items;
  } catch (e: unknown) {
    notifyError(`Could not load SCA policies: ${(e as Error).message ?? e}`);
  } finally {
    policiesLoading.value = false;
  }
}

async function loadChecks(policyId: string) {
  if (!selectedAgentId.value || checksByPolicy[policyId]) return;
  checksLoading[policyId] = true;
  try {
    const r = await wazuhApi.getSCAChecks(selectedAgentId.value, policyId);
    checksByPolicy[policyId] = r.data.affected_items;
  } catch (e: unknown) {
    notifyError(`Could not load checks: ${(e as Error).message ?? e}`);
  } finally {
    checksLoading[policyId] = false;
  }
}

async function rescanAgent() {
  if (!selectedAgentId.value) return;
  rescanning.value = true;
  try {
    await wazuhApi.requestSCAScan(selectedAgentId.value);
    notifySuccess(
      "Re-scan requested — refresh in 60-120s once the agent reports back.",
    );
  } catch (e: unknown) {
    notifyError(`Re-scan failed: ${(e as Error).message ?? e}`);
  } finally {
    rescanning.value = false;
  }
}

async function onFix(policyId: string, check: WazuhSCACheck) {
  const r = getRemediation(policyId, check.id);
  if (!r || !selectedAgentId.value) return;
  const tacticalAgentId = lookupTacticalAgent(selectedAgentId.value);
  const key = `${policyId}:${check.id}`;
  actionLoading[key] = true;
  try {
    if (r.type === "trmm_script" && r.script_id) {
      if (!tacticalAgentId) {
        notifyError("Cannot run fix: this Wazuh agent has no Laborato MDM mapping.");
        return;
      }
      await runScript(tacticalAgentId, { script: r.script_id, args: [], timeout: 120 });
      notifySuccess(`Fix script #${r.script_id} dispatched`);
    } else if (r.type === "use_case" && r.use_case_id) {
      $q.dialog({
        title: "Use Case Runner",
        message: `Open Detection Cases and deploy "${r.use_case_id}" to fix this check.`,
        ok: { label: "Open", color: "primary" },
        cancel: true,
      }).onOk(() => {
        location.assign("/security/use-cases");
      });
    } else if (r.type === "file_delivery") {
      notifyInfo(
        "File delivery fix requires the upcoming FileAsset upload integration.",
        4000,
      );
    } else {
      notifyError("Remediation entry is incomplete (missing script_id / use_case_id).");
    }
  } catch (e: unknown) {
    notifyError(`Fix dispatch failed: ${(e as Error).message ?? e}`);
  } finally {
    actionLoading[key] = false;
  }
}

function lookupTacticalAgent(wazuhAgentId: string): string | null {
  const merged = wazuhStore.mergedAgents.find(
    (m) => m.wazuh_agent_id === wazuhAgentId,
  );
  return merged?.tactical_agent_id ?? null;
}

async function onBulkApply() {
  $q.dialog({
    title: "Apply baseline?",
    message:
      "Run every mapped fix for failed checks on this agent. Each fix is dispatched as a TRMM task.",
    cancel: true,
    persistent: true,
    ok: { label: "Apply", color: "primary", noCaps: true },
  }).onOk(async () => {
    let dispatched = 0;
    let skipped = 0;
    for (const p of policies.value) {
      const checks = checksByPolicy[p.policy_id] ?? [];
      for (const c of checks) {
        if (c.result !== "failed") continue;
        const r = getRemediation(p.policy_id, c.id);
        if (!r) {
          skipped += 1;
          continue;
        }
        if (r.type === "trmm_script" && r.script_id) {
          const tacticalId = selectedAgentId.value
            ? lookupTacticalAgent(selectedAgentId.value)
            : null;
          if (!tacticalId) {
            skipped += 1;
            continue;
          }
          try {
            await runScript(tacticalId, {
              script: r.script_id,
              args: [],
              timeout: 120,
            });
            dispatched += 1;
          } catch {
            skipped += 1;
          }
        } else {
          skipped += 1;
        }
      }
    }
    notifySuccess(`Bulk apply: ${dispatched} dispatched, ${skipped} skipped`);
  });
}

onMounted(loadAgents);
</script>

<style scoped>
.ac-shell {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 12px;
}

.ac-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ac-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.ac-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--mdm-text-secondary, #6b7280);
}

.ac-card {
  border-radius: var(--mdm-radius, 6px);
}

.ac-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ac-toolbar-item {
  flex: 1 1 280px;
  min-width: 220px;
  max-width: 480px;
}

.ac-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
}

.ac-progress-label {
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
}

.ac-progress-bar {
  width: 220px;
}

.ac-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--mdm-text-secondary, #6b7280);
  padding: 60px 16px;
}

.ac-policy-bar {
  width: 100px;
}
</style>
