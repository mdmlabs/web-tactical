import { ref } from "vue";
import { useCywmStore } from "@/stores/cywm";
import type { ConfigFile, DeployRecord, DeployStatus } from "@/cywm/types";

interface DeployStep {
  ts: string;
  text: string;
}

function nowHHMMSS(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function buildSteps(file: ConfigFile, willFail: boolean): DeployStep[] {
  const isManager = file.target === "manager";
  const isShared = file.category === "shared";
  const steps: DeployStep[] = [];

  steps.push({ ts: nowHHMMSS(), text: "Validating syntax..." });

  if (willFail) {
    steps.push({
      ts: nowHHMMSS(),
      text:
        isManager && file.category !== "active-response"
          ? `FAILED: /var/ossec/bin/wazuh-control configtest reported error in ${file.filename}.`
          : `FAILED: file ${file.filename} could not be processed.`,
    });
    steps.push({
      ts: nowHHMMSS(),
      text: "Aborting deploy. Configuration NOT changed.",
    });
    return steps;
  }

  steps.push({ ts: nowHHMMSS(), text: "ok" });

  if (isManager) {
    steps.push({ ts: nowHHMMSS(), text: "Backing up current version... ok" });
    const dest = isShared
      ? `/var/ossec/etc/shared/${file.filename}`
      : file.category === "rules"
        ? `/var/ossec/etc/rules/${file.filename}`
        : file.category === "decoders"
          ? `/var/ossec/etc/decoders/${file.filename}`
          : `/var/ossec/etc/${file.filename}`;
    steps.push({ ts: nowHHMMSS(), text: `Uploading to ${dest}... ok` });
    steps.push({
      ts: nowHHMMSS(),
      text: "Setting permissions (ossec:ossec, 0640)... ok",
    });
    if (isShared) {
      steps.push({
        ts: nowHHMMSS(),
        text: "Group config will auto-sync to agents (no restart needed).",
      });
    } else {
      steps.push({ ts: nowHHMMSS(), text: "Restarting wazuh-manager... ok" });
    }
  } else {
    steps.push({
      ts: nowHHMMSS(),
      text: "Connecting to agent WIN11-DEMO... ok",
    });
    steps.push({
      ts: nowHHMMSS(),
      text: `Transferring file ${file.filename} (${file.content.length} bytes)... ok`,
    });
    steps.push({ ts: nowHHMMSS(), text: "Setting ACL via icacls... ok" });
  }

  steps.push({ ts: nowHHMMSS(), text: "Deploy completed successfully." });
  return steps;
}

function formatLog(steps: DeployStep[]): string {
  return steps.map((s) => `[${s.ts}] ${s.text}`).join("\n");
}

export function useDeploy() {
  const store = useCywmStore();
  const isDeploying = ref(false);
  const liveLog = ref<string>("");
  const finalRecord = ref<DeployRecord | null>(null);

  async function runDeploy(file: ConfigFile): Promise<DeployRecord> {
    isDeploying.value = true;
    liveLog.value = "";
    finalRecord.value = null;

    // 10% шанс ошибки, чтобы продемонстрировать failure-флоу
    const willFail = Math.random() < 0.1;
    const steps = buildSteps(file, willFail);
    const startedAt = Date.now();

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 250 + Math.random() * 350));
      liveLog.value += `[${step.ts}] ${step.text}\n`;
    }

    const status: DeployStatus = willFail ? "failed" : "success";
    const durationMs = Date.now() - startedAt;
    const record = store.recordDeployResult(
      file,
      status,
      durationMs,
      formatLog(steps),
    );

    finalRecord.value = record;
    isDeploying.value = false;
    return record;
  }

  return {
    isDeploying,
    liveLog,
    finalRecord,
    runDeploy,
  };
}
