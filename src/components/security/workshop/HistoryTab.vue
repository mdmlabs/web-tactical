<template>
  <div class="hist-tab">
    <q-banner class="hist-banner" rounded>
      <template #avatar><q-icon name="info" /></template>
      Snapshots are stored in this browser only. A TRMM-side history table
      lands as part of the backend integration.
    </q-banner>

    <div class="hist-grid">
      <!-- List + filters -->
      <q-card flat bordered class="hist-card">
        <q-card-section>
          <div class="hist-header">
            <q-icon name="history" />
            <span>Snapshots</span>
            <q-space />
            <q-btn
              flat
              dense
              color="negative"
              icon="delete_sweep"
              :disable="!snapshots.length"
              @click="confirmClear"
            >
              <q-tooltip>Clear local history</q-tooltip>
            </q-btn>
          </div>

          <div class="hist-filters">
            <q-input
              v-model="search"
              dense
              outlined
              placeholder="Filter by path"
              clearable
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
            <q-select
              v-model="typeFilter"
              :options="typeOptions"
              dense
              outlined
              emit-value
              map-options
              label="Type"
              clearable
            />
          </div>

          <q-list dense separator class="snap-list">
            <q-item
              v-for="snap in filtered"
              :key="snap.id"
              clickable
              :active="primary === snap.id || compareTo === snap.id"
              :class="{
                'snap-primary': primary === snap.id,
                'snap-compare': compareTo === snap.id,
              }"
              @click="onPickPrimary(snap.id)"
            >
              <q-item-section>
                <q-item-label class="snap-path">{{ snap.path }}</q-item-label>
                <q-item-label caption>
                  {{ formatTime(snap.created_at) }} · {{ snap.artifact_type }}
                  <span v-if="snap.group_id">· group {{ snap.group_id }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  icon="compare_arrows"
                  :color="compareTo === snap.id ? 'primary' : undefined"
                  @click.stop="onPickCompare(snap.id)"
                >
                  <q-tooltip>Pick as compare-against</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="!filtered.length">
              <q-item-section class="text-grey">No snapshots.</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Diff / preview / revert -->
      <q-card flat bordered class="hist-card">
        <q-card-section>
          <div class="hist-header">
            <q-icon :name="compareTo ? 'difference' : 'description'" />
            <span>{{ compareTo ? "Diff" : "Preview" }}</span>
            <q-space />
            <q-btn
              v-if="primaryRecord && primaryRecord.artifact_type === 'manager_file'"
              no-caps
              outline
              color="primary"
              icon="restore"
              label="Revert manager file"
              :loading="reverting"
              @click="revertSelected"
            />
            <q-btn
              v-if="primaryRecord && primaryRecord.artifact_type !== 'manager_file' && primaryRecord.group_id"
              no-caps
              outline
              color="primary"
              icon="restore"
              label="Revert group file"
              :loading="reverting"
              @click="revertSelected"
            />
          </div>
          <div class="diff-shell">
            <div ref="editorEl" class="diff-host" />
            <div v-if="!primary" class="diff-empty">
              Pick a snapshot from the list to preview, or click the
              compare icon on a second snapshot to diff.
            </div>
          </div>
          <div v-if="primaryRecord" class="snap-meta">
            <span class="meta-pill">{{ primaryRecord.path }}</span>
            <span class="meta-pill">{{ formatTime(primaryRecord.created_at) }}</span>
            <span class="meta-pill">{{ primaryRecord.artifact_type }}</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";

import { wazuhApi } from "@/api/wazuh";
import {
  useWorkshopHistory,
  type WorkshopSnapshot,
} from "@/composables/useWorkshopHistory";
import { notifyError, notifySuccess } from "@/utils/notify";

const $q = useQuasar();
const { snapshots, deleteSnapshot, clearAll } = useWorkshopHistory();

const search = ref("");
const typeFilter = ref<string | null>(null);
const primary = ref<string | null>(null);
const compareTo = ref<string | null>(null);
const reverting = ref(false);

const typeOptions = [
  { label: "Manager file", value: "manager_file" },
  { label: "Group file", value: "group_file" },
  { label: "SCA policy", value: "sca_policy" },
  { label: "TRMM script", value: "trmm_script" },
];

const filtered = computed(() => {
  const q = search.value?.toLowerCase().trim() ?? "";
  return snapshots.value.filter((s) => {
    if (typeFilter.value && s.artifact_type !== typeFilter.value) return false;
    if (q && !s.path.toLowerCase().includes(q)) return false;
    return true;
  });
});

const primaryRecord = computed<WorkshopSnapshot | undefined>(() =>
  primary.value ? snapshots.value.find((s) => s.id === primary.value) : undefined,
);

const compareRecord = computed<WorkshopSnapshot | undefined>(() =>
  compareTo.value ? snapshots.value.find((s) => s.id === compareTo.value) : undefined,
);

function onPickPrimary(id: string) {
  if (compareTo.value === id) compareTo.value = null;
  primary.value = id;
}

function onPickCompare(id: string) {
  if (primary.value === id) primary.value = null;
  compareTo.value = compareTo.value === id ? null : id;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function confirmClear() {
  $q.dialog({
    title: "Clear local history?",
    message:
      "This drops every snapshot stored in this browser. Saved files on the manager are not touched.",
    cancel: true,
    persistent: true,
    ok: { label: "Clear", color: "negative", noCaps: true },
  }).onOk(() => {
    clearAll();
    primary.value = null;
    compareTo.value = null;
  });
}

async function revertSelected() {
  const snap = primaryRecord.value;
  if (!snap) return;
  $q.dialog({
    title: "Revert to this snapshot?",
    message: `Re-uploads ${snap.path} with the snapshot content. The current live file will be overwritten.`,
    cancel: true,
    persistent: true,
    ok: { label: "Revert", color: "primary", noCaps: true },
  }).onOk(async () => {
    reverting.value = true;
    try {
      if (snap.artifact_type === "manager_file") {
        await wazuhApi.putManagerFile(snap.path, snap.content);
      } else if (snap.group_id) {
        await wazuhApi.putGroupFile(snap.group_id, snap.path, snap.content);
      } else {
        notifyError("Cannot revert: snapshot lacks a group id or path target.");
        return;
      }
      notifySuccess(`Reverted ${snap.path}`);
    } catch (e: unknown) {
      notifyError(`Revert failed: ${(e as Error).message ?? e}`);
    } finally {
      reverting.value = false;
    }
  });
}

// === Diff / preview Monaco ===

const editorEl = ref<HTMLDivElement | null>(null);
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
let plainEditor: monaco.editor.IStandaloneCodeEditor | null = null;

function disposeEditors() {
  diffEditor?.getModel()?.original?.dispose();
  diffEditor?.getModel()?.modified?.dispose();
  diffEditor?.dispose();
  diffEditor = null;
  plainEditor?.getModel()?.dispose();
  plainEditor?.dispose();
  plainEditor = null;
}

function inferLang(path: string): string {
  if (path.endsWith(".xml") || path.endsWith(".conf")) return "xml";
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  if (path.endsWith(".json")) return "json";
  return "plaintext";
}

function rebuildEditor() {
  if (!editorEl.value) return;
  disposeEditors();
  const theme = $q.dark.isActive ? "vs-dark" : "vs-light";
  const cur = primaryRecord.value;
  const cmp = compareRecord.value;
  if (!cur) return;

  if (cmp) {
    const lang = inferLang(cur.path);
    const original = monaco.editor.createModel(cmp.content, lang);
    const modified = monaco.editor.createModel(cur.content, lang);
    diffEditor = monaco.editor.createDiffEditor(editorEl.value, {
      automaticLayout: true,
      readOnly: true,
      renderSideBySide: true,
      minimap: { enabled: false },
      fontSize: 12,
      theme,
    });
    diffEditor.setModel({ original, modified });
  } else {
    const lang = inferLang(cur.path);
    const model = monaco.editor.createModel(cur.content, lang);
    plainEditor = monaco.editor.create(editorEl.value, {
      automaticLayout: true,
      readOnly: true,
      model,
      minimap: { enabled: false },
      fontSize: 12,
      theme,
    });
  }
}

watch([primary, compareTo], rebuildEditor, { flush: "post" });
watch(
  () => $q.dark.isActive,
  (dark) => {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs-light");
  },
);

onBeforeUnmount(() => {
  disposeEditors();
});

// suppress unused-import warning when revert path is not taken
void deleteSnapshot;
</script>

<style scoped>
.hist-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 540px;
}

.hist-banner {
  background: var(--mdm-bg, #f9fafb);
  font-size: 12px;
}

.hist-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 12px;
  flex: 1;
}

@media (max-width: 1100px) {
  .hist-grid {
    grid-template-columns: 1fr;
  }
}

.hist-card {
  border-radius: var(--mdm-radius, 6px);
  display: flex;
  flex-direction: column;
}

.hist-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 8px;
}

.hist-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.snap-list {
  max-height: 480px;
  overflow: auto;
}

.snap-path {
  font-family: monospace;
  font-size: 12px;
}

.snap-primary {
  background: rgba(37, 99, 235, 0.08);
}

.snap-compare {
  background: rgba(217, 119, 6, 0.08);
}

.diff-shell {
  position: relative;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  height: 420px;
  overflow: hidden;
}

.diff-host {
  position: absolute;
  inset: 0;
}

.diff-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 13px;
  pointer-events: none;
  background: var(--mdm-bg-card, #fff);
  text-align: center;
  padding: 0 24px;
}

.snap-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.meta-pill {
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 999px;
  color: var(--mdm-text-secondary, #6b7280);
  background: var(--mdm-bg, #f9fafb);
}
</style>
