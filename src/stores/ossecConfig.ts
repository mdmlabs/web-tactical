import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";

export const useOssecConfigStore = defineStore("ossecConfig", () => {
  const wazuhStore = useWazuhStore();

  const configXml = ref("");
  const originalXml = ref("");
  const loading = ref(false);
  const saving = ref(false);
  const restarting = ref(false);
  const error = ref<string | null>(null);

  const isModified = computed(() => configXml.value !== originalXml.value);

  function ensureApi() {
    wazuhStore._registerApi();
  }

  async function loadConfig() {
    ensureApi();
    loading.value = true;
    error.value = null;
    try {
      const resp = await wazuhApi.getManagerConfiguration({ raw: true });
      configXml.value = extractContent(resp);
      originalXml.value = configXml.value;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : "Failed to load ossec.conf";
    } finally {
      loading.value = false;
    }
  }

  async function saveConfig() {
    ensureApi();
    saving.value = true;
    error.value = null;
    try {
      validateXml(configXml.value);
      await wazuhApi.putManagerConfiguration(configXml.value);
      originalXml.value = configXml.value;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to save config";
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function restartManager() {
    ensureApi();
    restarting.value = true;
    try {
      await wazuhApi.restartManager();
      await pollManagerStatus();
    } catch {
      // Manager restart often kills the connection before responding
      await pollManagerStatus();
    } finally {
      restarting.value = false;
    }
  }

  async function saveAndRestart() {
    await saveConfig();
    await restartManager();
  }

  async function pollManagerStatus(
    maxAttempts = 10,
    intervalMs = 3000,
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      try {
        await wazuhApi.getManagerStatus();
        return;
      } catch {
        // Still restarting
      }
    }
    throw new Error("Manager did not recover after restart");
  }

  function resetChanges() {
    configXml.value = originalXml.value;
    error.value = null;
  }

  return {
    configXml,
    originalXml,
    loading,
    saving,
    restarting,
    error,
    isModified,
    loadConfig,
    saveConfig,
    saveAndRestart,
    restartManager,
    resetChanges,
  };
});

function extractContent(resp: unknown): string {
  if (typeof resp === "string") return resp;
  if (resp && typeof resp === "object") {
    const r = resp as Record<string, unknown>;
    if (typeof r.data === "string") return r.data;
    // Standard Wazuh envelope: { data: { affected_items: [...] } }
    const data = r.data as Record<string, unknown> | undefined;
    if (data?.affected_items && Array.isArray(data.affected_items)) {
      const item = data.affected_items[0];
      return typeof item === "string" ? item : JSON.stringify(item, null, 2);
    }
  }
  return JSON.stringify(resp, null, 2);
}

function validateXml(xml: string): void {
  // ossec.conf has multiple <ossec_config> root blocks — that's valid for
  // Wazuh but not for strict single-root XML. Wrap in a dummy root to parse.
  const wrapped = `<__root__>${xml}</__root__>`;
  const parser = new DOMParser();
  const doc = parser.parseFromString(wrapped, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(`Invalid XML: ${parseError.textContent}`);
  }
  if (!doc.querySelector("ossec_config")) {
    throw new Error("No <ossec_config> block found");
  }
}
