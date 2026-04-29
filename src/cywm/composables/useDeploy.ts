import { ref, onUnmounted } from "vue";
import {
  deployFile,
  getDeployStatus,
  saveFileContent,
} from "@/cywm/api/cywm";
import { useCywmStore } from "@/stores/cywm";
import type { ConfigFile, DeployRecord, DeployRequest } from "@/cywm/types";

const POLL_INTERVAL_MS = 1500;

export function useDeploy() {
  const store = useCywmStore();
  const isDeploying = ref(false);
  const liveLog = ref<string>("");
  const finalRecord = ref<DeployRecord | null>(null);

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function stopPolling(): void {
    if (pollTimer !== null) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  async function runDeploy(
    file: ConfigFile,
    body?: DeployRequest,
  ): Promise<DeployRecord> {
    isDeploying.value = true;
    liveLog.value = "";
    finalRecord.value = null;

    // Save first if content has been modified
    if (store.isModified && store.selectedFile?.id === file.id) {
      const saved = await saveFileContent(file.id, store.editorContent);
      // Update the store with the saved version
      const idx = store.files.findIndex((f) => f.id === file.id);
      if (idx !== -1) store.files[idx] = saved;
      store.editorContent = saved.content;
    }

    // Initiate the deploy
    const { deployId } = await deployFile(file.id, body);
    liveLog.value = "Starting deploy...\n";

    // Poll until status is no longer "running"
    const record = await new Promise<DeployRecord>((resolve, reject) => {
      pollTimer = setInterval(async () => {
        try {
          const status = await getDeployStatus(deployId);
          if (status.log) {
            liveLog.value = status.log;
          }
          if (status.status !== "running") {
            stopPolling();
            resolve(status);
          }
        } catch (err) {
          stopPolling();
          reject(err);
        }
      }, POLL_INTERVAL_MS);
    });

    finalRecord.value = record;
    isDeploying.value = false;

    // Refresh deploy history in store
    await store.fetchHistory();

    return record;
  }

  onUnmounted(stopPolling);

  return {
    isDeploying,
    liveLog,
    finalRecord,
    runDeploy,
  };
}
