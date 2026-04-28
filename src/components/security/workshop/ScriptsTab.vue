<template>
  <div class="scripts-tab">
    <!-- Pinned test agent strip -->
    <q-card flat bordered class="pin-card">
      <q-card-section class="pin-section">
        <q-icon name="push_pin" class="pin-icon" />
        <div class="pin-text">
          <strong>Pinned test agent</strong>
          <span v-if="pinnedAgentLabel" class="pin-label">{{ pinnedAgentLabel }}</span>
          <span v-else class="pin-empty">none — pick one to run scripts in one click</span>
        </div>
        <q-space />
        <q-select
          v-model="pinnedAgentId"
          :options="agentOptions"
          :loading="agentsLoading"
          dense
          outlined
          emit-value
          map-options
          clearable
          use-input
          input-debounce="200"
          label="Pin an agent"
          class="pin-select"
          @filter="filterAgents"
        />
      </q-card-section>
    </q-card>

    <div class="scripts-grid">
      <!-- Scripts list -->
      <q-card flat bordered class="list-card">
        <q-card-section>
          <div class="list-header">
            <q-input
              v-model="search"
              dense
              outlined
              placeholder="Search scripts"
              clearable
              class="list-search"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <q-list dense separator class="script-list">
            <q-item
              v-for="s in filteredScripts"
              :key="s.id"
              clickable
              :active="selected?.id === s.id"
              active-class="active-script"
              @click="selectScript(s)"
            >
              <q-item-section>
                <q-item-label class="script-name">{{ s.name }}</q-item-label>
                <q-item-label caption>
                  {{ s.shell }} · {{ s.script_type }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!filteredScripts.length && !scriptsLoading">
              <q-item-section class="text-grey">No scripts.</q-item-section>
            </q-item>
            <q-item v-if="scriptsLoading">
              <q-item-section><q-spinner /></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Selected script viewer + actions -->
      <q-card flat bordered class="detail-card">
        <q-card-section v-if="selected">
          <div class="detail-header">
            <div class="detail-title">{{ selected.name }}</div>
            <q-space />
            <q-btn
              flat
              no-caps
              icon="edit"
              label="Edit"
              :disable="!selected"
              @click="openEditModal"
            />
            <q-btn
              no-caps
              unelevated
              color="primary"
              icon="play_arrow"
              label="Run on pinned agent"
              :loading="runLoading"
              :disable="!selected || !pinnedAgentId || !selected.script_body"
              @click="onRun"
            />
            <q-btn
              no-caps
              flat
              icon="upload_file"
              label="Push as AR"
              :disable="!selected"
              @click="onPushAsAr"
            >
              <q-tooltip>
                Deploy this script to /var/ossec/active-response/bin on agents.
              </q-tooltip>
            </q-btn>
          </div>
          <div class="detail-meta">
            <span class="meta-pill">{{ selected.shell }}</span>
            <span class="meta-pill">timeout: {{ selected.default_timeout }} s</span>
            <span v-if="selected.args?.length" class="meta-pill">
              args: {{ selected.args.join(", ") }}
            </span>
          </div>

          <div class="editor-shell">
            <div ref="editorEl" class="editor-host" />
            <div v-if="!selected.script_body && !contentLoading" class="editor-empty">
              Body not loaded yet — click Edit to view full script.
            </div>
          </div>

          <!-- Output console -->
          <div class="output-console">
            <div class="output-header">
              <q-icon name="terminal" />
              <span>Output</span>
              <q-space />
              <span v-if="lastRun" class="output-meta">
                exit {{ lastRun.retcode }} · {{ lastRun.execution_time || "—" }}s
              </span>
              <q-btn
                v-if="lastRun"
                dense
                flat
                icon="cleaning_services"
                @click="lastRun = null"
              >
                <q-tooltip>Clear output</q-tooltip>
              </q-btn>
            </div>
            <div v-if="lastRun" class="output-body">
              <div v-if="lastRun.stdout" class="output-section">
                <span class="output-label">stdout</span>
                <pre class="output-pre">{{ lastRun.stdout }}</pre>
              </div>
              <div v-if="lastRun.stderr" class="output-section">
                <span class="output-label output-label-err">stderr</span>
                <pre class="output-pre output-pre-err">{{ lastRun.stderr }}</pre>
              </div>
            </div>
            <div v-else class="output-empty">
              {{
                runLoading
                  ? "Running on pinned agent…"
                  : "Run a script to see stdout / stderr / exit code."
              }}
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else class="detail-empty">
          <q-icon name="terminal" size="36px" />
          <p>Select a script to inspect, run, or push.</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStorage } from "@vueuse/core";
import * as monaco from "monaco-editor";

import { fetchScripts, downloadScript, testScript } from "@/api/scripts";
import { fetchAgents as fetchTrmmAgents } from "@/api/agents";
import { notifyError, notifySuccess, notifyInfo } from "@/utils/notify";
import ScriptFormModal from "@/components/scripts/ScriptFormModal.vue";

const $q = useQuasar();

interface ScriptListItem {
  id: number;
  name: string;
  description?: string;
  shell: string;
  script_type: string;
  default_timeout: number;
  args: string[];
  category?: string;
  script_body?: string;
}

const scripts = ref<ScriptListItem[]>([]);
const scriptsLoading = ref(false);
const search = ref("");
const selected = ref<ScriptListItem | null>(null);
const contentLoading = ref(false);

const agentOptions = ref<{ label: string; value: string }[]>([]);
const allAgentOptions = ref<{ label: string; value: string }[]>([]);
const agentsLoading = ref(false);

const pinnedAgentId = useStorage<string | null>(
  "workshop.pinnedTestAgent",
  null,
);

const lastRun = ref<{
  execution_time?: string | number;
  retcode?: number | string;
  stdout?: string;
  stderr?: string;
} | null>(null);
const runLoading = ref(false);

const filteredScripts = computed(() => {
  const q = search.value?.toLowerCase().trim() ?? "";
  if (!q) return scripts.value;
  return scripts.value.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.shell.toLowerCase().includes(q) ||
      (s.category ?? "").toLowerCase().includes(q),
  );
});

const pinnedAgentLabel = computed(() => {
  if (!pinnedAgentId.value) return "";
  const found = allAgentOptions.value.find((o) => o.value === pinnedAgentId.value);
  return found?.label ?? pinnedAgentId.value;
});

async function loadScripts() {
  scriptsLoading.value = true;
  try {
    const data = await fetchScripts();
    scripts.value = (data ?? []) as ScriptListItem[];
  } catch (e: unknown) {
    notifyError(`Failed to load scripts: ${(e as Error).message ?? e}`);
  } finally {
    scriptsLoading.value = false;
  }
}

async function loadAgents() {
  agentsLoading.value = true;
  try {
    const data = await fetchTrmmAgents();
    const list = Array.isArray(data) ? data : data?.results ?? [];
    allAgentOptions.value = list.map((a: Record<string, unknown>) => ({
      label: `${a.hostname ?? a.agent_id} (${a.client ?? ""}/${a.site ?? ""})`,
      value: String(a.agent_id ?? a.id),
    }));
    agentOptions.value = allAgentOptions.value;
  } catch (e: unknown) {
    notifyError(`Failed to load agents: ${(e as Error).message ?? e}`);
  } finally {
    agentsLoading.value = false;
  }
}

function filterAgents(input: string, doneFn: (cb: () => void) => void) {
  doneFn(() => {
    const q = input?.toLowerCase().trim() ?? "";
    agentOptions.value = q
      ? allAgentOptions.value.filter((o) => o.label.toLowerCase().includes(q))
      : allAgentOptions.value;
  });
}

async function selectScript(s: ScriptListItem) {
  selected.value = s;
  if (s.script_body !== undefined) {
    setEditorContent(s.script_body, shellToMonacoLang(s.shell));
    return;
  }
  contentLoading.value = true;
  try {
    const r = await downloadScript(s.id);
    s.script_body = r?.code ?? "";
    setEditorContent(s.script_body ?? "", shellToMonacoLang(s.shell));
  } catch (e: unknown) {
    notifyError(`Failed to download script body: ${(e as Error).message ?? e}`);
  } finally {
    contentLoading.value = false;
  }
}

async function onRun() {
  if (!selected.value || !pinnedAgentId.value) return;
  runLoading.value = true;
  lastRun.value = null;
  try {
    const payload = {
      code: selected.value.script_body ?? "",
      timeout: selected.value.default_timeout ?? 90,
      args: selected.value.args ?? [],
      shell: selected.value.shell,
      run_as_user: false,
      env_vars: [],
    };
    const r = await testScript(pinnedAgentId.value, payload);
    lastRun.value = r;
    notifySuccess("Script run completed");
  } catch (e: unknown) {
    notifyError(`Script run failed: ${(e as Error).message ?? e}`);
  } finally {
    runLoading.value = false;
  }
}

function openEditModal() {
  if (!selected.value) return;
  $q.dialog({
    component: ScriptFormModal,
    componentProps: {
      script: selected.value,
      readonly: false,
    },
  }).onOk(() => {
    // refresh list and re-select to pull updated body
    loadScripts().then(() => {
      const found = scripts.value.find((s) => s.id === selected.value?.id);
      if (found) {
        selected.value = found;
        // body needs re-download
        selected.value.script_body = undefined;
        selectScript(found);
      }
    });
  });
}

function onPushAsAr() {
  notifyInfo(
    "Push-as-AR will create a file delivery job to /var/ossec/active-response/bin. Wiring lands with the file-asset upload integration.",
    5000,
  );
}

// === Monaco editor (read-only preview) ===

const editorEl = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

function shellToMonacoLang(shell: string): string {
  switch (shell) {
    case "powershell":
      return "powershell";
    case "python":
      return "python";
    case "shell":
    case "nushell":
      return "shell";
    case "cmd":
      return "bat";
    case "deno":
      return "typescript";
    default:
      return "plaintext";
  }
}

function setEditorContent(text: string, lang: string) {
  if (!editor) return;
  const model = editor.getModel();
  if (model) {
    monaco.editor.setModelLanguage(model, lang);
    editor.setValue(text);
  }
}

onMounted(async () => {
  if (editorEl.value) {
    editor = monaco.editor.create(editorEl.value, {
      automaticLayout: true,
      readOnly: true,
      minimap: { enabled: false },
      fontSize: 13,
      tabSize: 2,
      theme: $q.dark.isActive ? "vs-dark" : "vs-light",
    });
  }
  await Promise.all([loadScripts(), loadAgents()]);
});

watch(
  () => $q.dark.isActive,
  (dark) => {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs-light");
  },
);

onBeforeUnmount(() => {
  editor?.getModel()?.dispose();
  editor?.dispose();
  editor = null;
});
</script>

<style scoped>
.scripts-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 540px;
}

.pin-card {
  border-radius: var(--mdm-radius, 6px);
}

.pin-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pin-icon {
  color: var(--mdm-primary, #2563eb);
}

.pin-text {
  display: flex;
  flex-direction: column;
}

.pin-label {
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
  font-family: monospace;
}

.pin-empty {
  font-size: 12px;
  color: var(--mdm-text-secondary, #9ca3af);
}

.pin-select {
  flex: 0 0 320px;
  max-width: 320px;
}

.scripts-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
  align-items: stretch;
  flex: 1;
}

@media (max-width: 900px) {
  .scripts-grid {
    grid-template-columns: 1fr;
  }
}

.list-card,
.detail-card {
  border-radius: var(--mdm-radius, 6px);
  display: flex;
  flex-direction: column;
}

.list-header {
  margin-bottom: 8px;
}

.list-search :deep(.q-field__control) {
  background: var(--mdm-bg, #f9fafb);
}

.script-list {
  max-height: 480px;
  overflow: auto;
}

.script-name {
  font-size: 13px;
}

.active-script {
  background: var(--mdm-primary-soft, rgba(37, 99, 235, 0.1));
}

.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--mdm-text-secondary, #6b7280);
  min-height: 320px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 12px;
}

.meta-pill {
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 999px;
  color: var(--mdm-text-secondary, #6b7280);
  background: var(--mdm-bg, #f9fafb);
}

.editor-shell {
  position: relative;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  overflow: hidden;
  height: 280px;
}

.editor-host {
  position: absolute;
  inset: 0;
}

.editor-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--mdm-text-secondary, #6b7280);
  pointer-events: none;
  background: var(--mdm-bg-card, #fff);
}

.output-console {
  margin-top: 12px;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  background: var(--mdm-bg, #f9fafb);
}

.output-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #6b7280);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.output-meta {
  font-family: monospace;
  font-size: 11px;
}

.output-body {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.output-label {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--mdm-text-secondary, #6b7280);
}

.output-label-err {
  color: var(--mdm-danger, #dc2626);
}

.output-pre {
  margin: 0;
  padding: 8px 10px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
}

.output-pre-err {
  border-color: var(--mdm-danger-soft, #fecaca);
  color: var(--mdm-danger, #b91c1c);
}

.output-empty {
  padding: 20px 10px;
  text-align: center;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 12px;
}
</style>
