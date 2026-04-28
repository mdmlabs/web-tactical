<template>
  <div class="sca-tab">
    <div class="sca-grid">
      <!-- Editor side -->
      <q-card flat bordered class="sca-card">
        <q-card-section>
          <div class="sca-header">
            <q-icon name="fact_check" class="sca-header-icon" />
            <span>SCA YAML editor</span>
          </div>

          <div class="sca-row">
            <q-select
              v-model="groupId"
              :options="groupOptions"
              label="Group"
              outlined
              dense
              emit-value
              map-options
              :loading="groupsLoading"
              class="sca-row-item"
              @update:model-value="onGroupChange"
            />
            <q-select
              v-model="filename"
              :options="fileOptions"
              :loading="filesLoading"
              :disable="!groupId"
              label="File"
              outlined
              dense
              clearable
              use-input
              new-value-mode="add-unique"
              hide-dropdown-icon
              class="sca-row-item"
              @new-value="onNewFile"
              @update:model-value="loadFile"
            />
            <q-btn
              flat
              dense
              icon="folder_open"
              :loading="contentLoading"
              :disable="!groupId || !filename"
              @click="loadFile()"
            >
              <q-tooltip>Load file content</q-tooltip>
            </q-btn>
          </div>

          <div class="editor-shell">
            <div ref="editorEl" class="editor-host" />
          </div>

          <div class="sca-actions">
            <q-btn
              no-caps
              outline
              color="primary"
              icon="save"
              label="Save"
              :loading="saving"
              :disable="!groupId || !filename || !content"
              @click="onSave(false)"
            />
            <q-btn
              no-caps
              unelevated
              color="primary"
              icon="rocket_launch"
              label="Push &amp; scan"
              :loading="saving || rescanning"
              :disable="!groupId || !filename || !content || !targetAgentId"
              @click="onSave(true)"
            />
            <q-space />
            <q-select
              v-model="targetAgentId"
              :options="agentOptions"
              :loading="agentsLoading"
              label="Target agent for re-scan"
              outlined
              dense
              emit-value
              map-options
              clearable
              class="sca-target"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Results side -->
      <q-card flat bordered class="sca-card">
        <q-card-section>
          <div class="sca-header">
            <q-icon name="rule_folder" class="sca-header-icon" />
            <span>Results on target</span>
            <q-space />
            <q-btn
              flat
              dense
              icon="refresh"
              :loading="resultsLoading"
              :disable="!targetAgentId"
              @click="refreshResults"
            >
              <q-tooltip>Refresh results</q-tooltip>
            </q-btn>
          </div>

          <q-list dense separator class="sca-policy-list">
            <q-item v-if="!targetAgentId" class="text-grey">
              <q-item-section>Pick a target agent to see SCA policies.</q-item-section>
            </q-item>
            <q-item v-else-if="!policies.length && !resultsLoading">
              <q-item-section>No SCA results yet.</q-item-section>
            </q-item>
            <q-item v-for="p in policies" :key="p.policy_id">
              <q-item-section>
                <q-item-label>{{ p.name }}</q-item-label>
                <q-item-label caption>
                  pass {{ p.pass }} · fail {{ p.fail }} · score
                  {{ p.score }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-linear-progress
                  :value="p.total_checks ? p.pass / p.total_checks : 0"
                  size="6px"
                  color="primary"
                  track-color="grey-3"
                  class="policy-bar"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";

import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { WazuhGroupFile, WazuhSCAPolicy } from "@/types/wazuh";
import { useWorkshopHistory } from "@/composables/useWorkshopHistory";

const history = useWorkshopHistory();

const $q = useQuasar();
const wazuhStore = useWazuhStore();

const groupId = ref<string | null>(null);
const filename = ref<string | null>(null);
const content = ref("");
const filesLoading = ref(false);
const contentLoading = ref(false);
const saving = ref(false);
const rescanning = ref(false);

const targetAgentId = ref<string | null>(null);
const policies = ref<WazuhSCAPolicy[]>([]);
const resultsLoading = ref(false);

const fileOptions = ref<string[]>([]);

const groupsLoading = computed(() => wazuhStore.groupsLoading);
const agentsLoading = computed(() => wazuhStore.agentsLoading);

const groupOptions = computed(() =>
  wazuhStore.groups.map((g) => ({ label: g.name, value: g.name })),
);

const agentOptions = computed(() =>
  wazuhStore.wazuhAgents
    .filter((a) => a.id !== "000")
    .map((a) => ({
      label: `${a.name} (#${a.id})`,
      value: a.id,
    })),
);

async function onGroupChange() {
  filename.value = null;
  fileOptions.value = [];
  if (!groupId.value) return;
  filesLoading.value = true;
  try {
    const data = await wazuhApi.getGroupFiles(groupId.value);
    fileOptions.value = data.data.affected_items
      .map((f: WazuhGroupFile) => f.filename)
      .filter((n) => /\.(ya?ml|conf|xml)$/i.test(n));
  } catch (e: unknown) {
    notifyError(`Group files load failed: ${(e as Error).message ?? e}`);
  } finally {
    filesLoading.value = false;
  }
}

function onNewFile(val: string, doneFn: (item?: string) => void) {
  // Allow operator to type a new YAML filename to be created on save.
  const trimmed = val.trim();
  if (!trimmed) return;
  doneFn(trimmed);
}

async function loadFile() {
  if (!groupId.value || !filename.value) return;
  contentLoading.value = true;
  try {
    const raw = await wazuhApi.getGroupFile(groupId.value, filename.value);
    content.value = raw;
    if (editor) {
      const lang = inferLanguage(filename.value);
      editor.setValue(raw);
      const model = editor.getModel();
      if (model) monaco.editor.setModelLanguage(model, lang);
    }
  } catch (e: unknown) {
    notifyError(`Load failed: ${(e as Error).message ?? e}`);
  } finally {
    contentLoading.value = false;
  }
}

async function onSave(rescan: boolean) {
  if (!editor || !groupId.value || !filename.value) return;
  const newContent = editor.getValue();
  saving.value = true;
  try {
    await wazuhApi.putGroupFile(groupId.value, filename.value, newContent);
    content.value = newContent;
    const inferredType = filename.value.toLowerCase().endsWith(".yml") || filename.value.toLowerCase().endsWith(".yaml")
      ? "sca_policy"
      : "group_file";
    history.recordSnapshot({
      artifact_type: inferredType,
      path: filename.value,
      group_id: groupId.value,
      content: newContent,
    });
    notifySuccess(`Saved to group ${groupId.value}`);
    if (rescan && targetAgentId.value) {
      await triggerRescan();
    }
  } catch (e: unknown) {
    notifyError(`Save failed: ${(e as Error).message ?? e}`);
  } finally {
    saving.value = false;
  }
}

async function triggerRescan() {
  if (!targetAgentId.value) return;
  rescanning.value = true;
  try {
    await wazuhApi.requestSCAScan(targetAgentId.value);
    notifySuccess(
      "Re-scan requested — results will refresh once the agent completes its scan.",
    );
    // Poll for fresh policy data — modest cadence so we don't hammer the API.
    pollResults();
  } catch (e: unknown) {
    notifyError(`Re-scan failed: ${(e as Error).message ?? e}`);
  } finally {
    rescanning.value = false;
  }
}

async function refreshResults() {
  if (!targetAgentId.value) return;
  resultsLoading.value = true;
  try {
    const r = await wazuhApi.getSCA(targetAgentId.value);
    policies.value = r.data.affected_items;
  } catch (e: unknown) {
    notifyError(`Results load failed: ${(e as Error).message ?? e}`);
  } finally {
    resultsLoading.value = false;
  }
}

let pollHandle: ReturnType<typeof setInterval> | null = null;
function pollResults() {
  if (pollHandle) clearInterval(pollHandle);
  let elapsed = 0;
  const intervalMs = 5000;
  const maxMs = 180_000;
  refreshResults();
  pollHandle = setInterval(() => {
    elapsed += intervalMs;
    if (elapsed >= maxMs) {
      clearInterval(pollHandle as ReturnType<typeof setInterval>);
      pollHandle = null;
      return;
    }
    refreshResults();
  }, intervalMs);
}

watch(targetAgentId, (id) => {
  if (id) refreshResults();
  else policies.value = [];
});

function inferLanguage(p: string): string {
  if (p.endsWith(".yml") || p.endsWith(".yaml")) return "yaml";
  if (p.endsWith(".xml") || p.endsWith(".conf")) return "xml";
  return "plaintext";
}

// === Editor lifecycle ===

const editorEl = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(async () => {
  if (editorEl.value) {
    const model = monaco.editor.createModel("", "yaml");
    editor = monaco.editor.create(editorEl.value, {
      automaticLayout: true,
      model,
      minimap: { enabled: false },
      fontSize: 13,
      tabSize: 2,
      theme: $q.dark.isActive ? "vs-dark" : "vs-light",
    });
  }
  if (!wazuhStore.groups.length) {
    try {
      await wazuhStore.fetchGroups();
    } catch {
      // store surfaces own errors
    }
  }
  if (!wazuhStore.wazuhAgents.length) {
    try {
      await wazuhStore.fetchAgents();
    } catch {
      // store surfaces own errors
    }
  }
});

watch(
  () => $q.dark.isActive,
  (dark) => {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs-light");
  },
);

onBeforeUnmount(() => {
  if (pollHandle) clearInterval(pollHandle);
  editor?.getModel()?.dispose();
  editor?.dispose();
  editor = null;
});
</script>

<style scoped>
.sca-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 540px;
}

.sca-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
}

@media (max-width: 1100px) {
  .sca-grid {
    grid-template-columns: 1fr;
  }
}

.sca-card {
  border-radius: var(--mdm-radius, 6px);
  display: flex;
  flex-direction: column;
}

.sca-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-header-icon {
  color: var(--mdm-primary, #2563eb);
}

.sca-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin: 12px 0;
}

.sca-row-item {
  flex: 1 1 200px;
  min-width: 160px;
}

.editor-shell {
  position: relative;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  height: 320px;
  overflow: hidden;
}

.editor-host {
  position: absolute;
  inset: 0;
}

.sca-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.sca-target {
  flex: 0 0 280px;
  max-width: 280px;
}

.sca-policy-list {
  margin-top: 12px;
  max-height: 400px;
  overflow: auto;
}

.policy-bar {
  width: 96px;
}
</style>
