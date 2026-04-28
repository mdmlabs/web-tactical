<template>
  <div class="rd-tab">
    <!-- Toolbar -->
    <div class="rd-toolbar">
      <q-input
        v-model="path"
        dense
        outlined
        label="Manager file path"
        class="rd-path-input"
        hint="Relative to /var/ossec, e.g. etc/rules/local_rules.xml"
        :disable="loading"
        @keyup.enter="loadFile"
      >
        <template #append>
          <q-btn
            flat
            dense
            icon="folder_open"
            :loading="loading"
            :disable="!path"
            @click="loadFile"
          >
            <q-tooltip>Load file</q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <div class="rd-quick-chips">
        <q-chip
          v-for="preset in presetPaths"
          :key="preset.path"
          clickable
          :color="path === preset.path ? 'primary' : undefined"
          :text-color="path === preset.path ? 'white' : undefined"
          dense
          @click="pickPreset(preset.path)"
        >
          {{ preset.label }}
        </q-chip>
      </div>

      <q-space />

      <q-btn
        no-caps
        outline
        color="primary"
        icon="save"
        label="Save"
        :loading="saving"
        :disable="!path || !content || readOnly"
        @click="onSave(false)"
      />
      <q-btn
        no-caps
        unelevated
        color="primary"
        icon="restart_alt"
        label="Save &amp; Restart manager"
        :loading="saving"
        :disable="!path || !content || readOnly"
        @click="onSave(true)"
      />
    </div>

    <!-- Editor -->
    <div class="rd-editor-shell">
      <div ref="editorEl" class="rd-editor" />
      <div v-if="!content && !loading" class="rd-editor-empty">
        Pick a path above and press Load to start editing.
      </div>
    </div>

    <!-- Logtest -->
    <q-expansion-item
      v-model="logtestOpen"
      icon="science"
      label="Logtest — paste a log line, see what fires"
      header-class="rd-logtest-header"
      class="rd-logtest"
      expand-separator
      default-opened
    >
      <div class="rd-logtest-body">
        <div class="rd-logtest-form">
          <q-input
            v-model="logtest.log"
            type="textarea"
            outlined
            dense
            label="Log line(s)"
            autogrow
            class="rd-logtest-input"
            :input-style="{ fontFamily: 'monospace', fontSize: '12px' }"
          />
          <div class="rd-logtest-row">
            <q-input
              v-model="logtest.location"
              outlined
              dense
              label="Location"
              hint="e.g. /var/log/auth.log"
              class="rd-logtest-loc"
            />
            <q-select
              v-model="logtest.logFormat"
              outlined
              dense
              label="Log format"
              :options="logFormatOptions"
              class="rd-logtest-fmt"
              emit-value
              map-options
            />
            <q-btn
              no-caps
              unelevated
              color="primary"
              icon="play_arrow"
              label="Test"
              :loading="testing"
              :disable="!logtest.log.trim()"
              @click="runTest"
            />
            <q-btn
              v-if="logtest.token"
              flat
              no-caps
              icon="cleaning_services"
              label="Clear session"
              @click="logtest.token = undefined"
            >
              <q-tooltip>Drop the logtest session token (decoder context).</q-tooltip>
            </q-btn>
          </div>
        </div>

        <div class="rd-logtest-result">
          <div v-if="testResult" class="rd-result-card">
            <div class="rd-result-row">
              <span class="rd-result-label">Decoder</span>
              <span class="rd-result-value">
                {{ testResult.output?.decoder?.name ?? "—" }}
                <span v-if="testResult.output?.decoder?.parent" class="rd-result-meta">
                  (parent: {{ testResult.output.decoder.parent }})
                </span>
              </span>
            </div>
            <div class="rd-result-row">
              <span class="rd-result-label">Rule</span>
              <span class="rd-result-value">
                <template v-if="testResult.output?.rule">
                  <strong>#{{ testResult.output.rule.id }}</strong>
                  &nbsp;level {{ testResult.output.rule.level }}
                  &nbsp;— {{ testResult.output.rule.description }}
                </template>
                <template v-else>No rule matched</template>
              </span>
            </div>
            <details class="rd-result-details">
              <summary>Raw response</summary>
              <pre class="rd-result-raw">{{ formattedResult }}</pre>
            </details>
          </div>
          <div v-else-if="testing" class="rd-result-empty">Running…</div>
          <div v-else class="rd-result-empty">Run a test to see the decoder/rule that matched.</div>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";

import { wazuhApi } from "@/api/wazuh";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { LogtestResult } from "@/types/wazuhOps";
import { useWorkshopHistory } from "@/composables/useWorkshopHistory";

const history = useWorkshopHistory();

const $q = useQuasar();

const presetPaths = [
  { label: "Local rules", path: "etc/rules/local_rules.xml" },
  { label: "Local decoder", path: "etc/decoders/local_decoder.xml" },
  { label: "ossec.conf", path: "etc/ossec.conf" },
  { label: "CDB lists dir", path: "etc/lists/" },
];

const logFormatOptions = [
  { label: "syslog", value: "syslog" },
  { label: "json", value: "json" },
  { label: "snort-full", value: "snort-full" },
  { label: "squid", value: "squid" },
  { label: "audit", value: "audit" },
  { label: "multi-line", value: "multi-line" },
  { label: "eventchannel (Windows)", value: "eventchannel" },
  { label: "command", value: "command" },
  { label: "full_command", value: "full_command" },
];

const path = ref(presetPaths[0].path);
const content = ref("");
const loading = ref(false);
const saving = ref(false);
const readOnly = ref(false);

const editorEl = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

function pickPreset(p: string) {
  path.value = p;
  // Don't auto-load — operator should confirm.
}

async function loadFile() {
  if (!path.value) return;
  loading.value = true;
  try {
    const raw = await wazuhApi.getManagerFile(path.value);
    content.value = raw;
    if (editor) {
      const lang = inferLanguage(path.value);
      editor.setValue(raw);
      const model = editor.getModel();
      if (model) monaco.editor.setModelLanguage(model, lang);
    }
    notifySuccess(`Loaded ${path.value}`);
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message ?? "Load failed";
    notifyError(`Failed to load file: ${msg}`, 5000);
  } finally {
    loading.value = false;
  }
}

async function onSave(restartAfter: boolean) {
  if (!editor) return;
  const newContent = editor.getValue();
  $q.dialog({
    title: "Save manager file?",
    message: restartAfter
      ? `Save ${path.value} and restart the manager. Existing analysis sessions will reload.`
      : `Save ${path.value}. The manager will keep running with the previous ruleset until you restart it.`,
    cancel: true,
    persistent: true,
    ok: { label: "Save", color: "primary", noCaps: true },
  }).onOk(async () => {
    saving.value = true;
    try {
      await wazuhApi.putManagerFile(path.value, newContent, {
        contentType: inferContentType(path.value),
      });
      content.value = newContent;
      history.recordSnapshot({
        artifact_type: "manager_file",
        path: path.value,
        content: newContent,
      });
      notifySuccess(`Saved ${path.value}`);
      if (restartAfter) {
        try {
          await wazuhApi.restartManager();
          notifySuccess("Manager restart requested");
        } catch (e: unknown) {
          const msg = (e as { message?: string })?.message ?? "Restart failed";
          notifyError(`Manager restart failed: ${msg}`, 5000);
        }
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? "Save failed";
      notifyError(`Save failed: ${msg}`, 5000);
    } finally {
      saving.value = false;
    }
  });
}

function inferLanguage(p: string): string {
  if (p.endsWith(".xml") || p.endsWith(".conf")) return "xml";
  if (p.endsWith(".yml") || p.endsWith(".yaml")) return "yaml";
  if (p.endsWith(".json")) return "json";
  return "plaintext";
}

function inferContentType(p: string): string {
  if (p.endsWith(".xml") || p.endsWith(".conf")) return "application/xml";
  return "application/octet-stream";
}

// === Logtest ===

const logtestOpen = ref(true);
const testing = ref(false);
const testResult = ref<LogtestResult | null>(null);

const logtest = ref<{
  log: string;
  location: string;
  logFormat: string;
  token?: string;
}>({
  log: "",
  location: "/var/log/auth.log",
  logFormat: "syslog",
  token: undefined,
});

const formattedResult = computed(() =>
  testResult.value ? JSON.stringify(testResult.value, null, 2) : "",
);

async function runTest() {
  testing.value = true;
  try {
    const res = await wazuhApi.runLogtest(
      logtest.value.log,
      logtest.value.location,
      logtest.value.logFormat,
      logtest.value.token,
    );
    testResult.value = res;
    if (res?.token) logtest.value.token = res.token;
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message ?? "Logtest failed";
    notifyError(`Logtest failed: ${msg}`, 5000);
  } finally {
    testing.value = false;
  }
}

// === Editor lifecycle ===

onMounted(() => {
  if (!editorEl.value) return;
  const lang = inferLanguage(path.value);
  const model = monaco.editor.createModel(content.value, lang);
  const theme = $q.dark.isActive ? "vs-dark" : "vs-light";
  editor = monaco.editor.create(editorEl.value, {
    automaticLayout: true,
    model,
    theme,
    minimap: { enabled: false },
    fontSize: 13,
    tabSize: 2,
  });
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
.rd-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 480px;
}

.rd-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.rd-path-input {
  flex: 1 1 320px;
  min-width: 240px;
}

.rd-quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.rd-editor-shell {
  position: relative;
  flex: 1;
  min-height: 320px;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  overflow: hidden;
}

.rd-editor {
  position: absolute;
  inset: 0;
}

.rd-editor-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 13px;
  pointer-events: none;
  background: var(--mdm-bg-card, #fff);
}

.rd-logtest {
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  background: var(--mdm-bg-card, #fff);
}

.rd-logtest-header {
  font-weight: 600;
}

.rd-logtest-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 12px 16px 16px;
}

@media (max-width: 1100px) {
  .rd-logtest-body {
    grid-template-columns: 1fr;
  }
}

.rd-logtest-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rd-logtest-input :deep(textarea) {
  min-height: 96px;
}

.rd-logtest-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.rd-logtest-loc {
  flex: 1 1 200px;
  min-width: 180px;
}

.rd-logtest-fmt {
  flex: 0 0 200px;
}

.rd-logtest-result {
  display: flex;
}

.rd-result-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  background: var(--mdm-bg, #f9fafb);
}

.rd-result-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  align-items: baseline;
}

.rd-result-label {
  flex: 0 0 84px;
  color: var(--mdm-text-secondary, #6b7280);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
}

.rd-result-value {
  flex: 1;
  font-family: monospace;
  word-break: break-word;
}

.rd-result-meta {
  color: var(--mdm-text-secondary, #6b7280);
  font-style: italic;
  margin-left: 4px;
}

.rd-result-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 13px;
  padding: 20px;
}

.rd-result-details {
  margin-top: 4px;
  font-size: 12px;
}

.rd-result-raw {
  margin: 6px 0 0;
  padding: 8px;
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 4px;
  max-height: 240px;
  overflow: auto;
  font-size: 11px;
  line-height: 1.4;
}
</style>
