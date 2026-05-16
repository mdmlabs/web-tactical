<template>
  <div class="files-tab">
    <!-- Toolbar -->
    <div class="files-toolbar">
      <q-input
        v-model="fileSearch"
        dense
        outlined
        placeholder="Search files..."
        clearable
        class="files-search"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        v-model="statusFilter"
        :options="statusOptions"
        dense
        outlined
        emit-value
        map-options
        label="Status"
        class="files-status-filter"
      />

      <q-space />

      <q-btn
        icon="refresh"
        flat
        round
        dense
        size="sm"
        :loading="store.ruleFilesLoading"
        @click="store.fetchRuleFiles()"
      >
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </div>

    <!-- Files table -->
    <q-table
      :rows="filteredFiles"
      :columns="fileColumns"
      row-key="filename"
      flat
      dense
      :loading="store.ruleFilesLoading"
      :pagination="filePagination"
      no-data-label="No rule files found"
      class="files-table"
    >
      <template #body-cell-filename="props">
        <q-td :props="props">
          <span class="files-name">
            <q-icon name="description" size="14px" class="q-mr-xs" />
            {{ props.row.filename }}
          </span>
        </q-td>
      </template>

      <template #body-cell-relative_dirname="props">
        <q-td :props="props">
          <span class="files-path">{{ props.row.relative_dirname }}</span>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'enabled' ? 'positive' : 'grey'"
            :label="props.row.status"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            icon="edit"
            size="sm"
            @click="openEditor(props.row.filename)"
          >
            <q-tooltip>Edit file</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            icon="delete"
            size="sm"
            color="negative"
            :disable="!isUserFile(props.row.relative_dirname)"
            @click="confirmDelete(props.row.filename)"
          >
            <q-tooltip>
              {{ isUserFile(props.row.relative_dirname) ? "Delete file" : "Cannot delete built-in rule files" }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Editor Dialog -->
    <q-dialog v-model="editorOpen" maximized persistent>
      <q-card class="editor-dialog">
        <q-card-section class="editor-header">
          <div class="editor-header__left">
            <q-icon name="description" size="20px" />
            <span class="editor-header__filename">{{ store.editingFilename }}</span>
          </div>
          <div class="editor-header__right">
            <q-btn
              no-caps
              outline
              color="primary"
              icon="save"
              label="Save"
              :loading="saving"
              :disable="!editorContent"
              @click="onSave"
            />
            <q-btn flat icon="close" round dense @click="closeEditor" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="editor-body">
          <div v-if="store.fileContentLoading" class="editor-loading">
            <q-spinner size="32px" color="primary" />
            <span>Loading file content...</span>
          </div>
          <div v-else ref="editorEl" class="editor-monaco" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete confirmation -->
    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">Delete Rule File</div>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete
          <strong>{{ deletingFilename }}</strong>?
          This action cannot be undone.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn
            unelevated
            no-caps
            color="negative"
            label="Delete"
            :loading="deleting"
            @click="onDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";
import { useRulesStore } from "@/stores/rules";

const store = useRulesStore();
const $q = useQuasar();

const fileSearch = ref("");
const statusFilter = ref("all");
const filePagination = ref({ rowsPerPage: 25 });

const editorOpen = ref(false);
const editorEl = ref<HTMLDivElement | null>(null);
const editorContent = ref("");
const saving = ref(false);

const deleteDialogOpen = ref(false);
const deletingFilename = ref<string | null>(null);
const deleting = ref(false);

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

const fileColumns = [
  {
    name: "filename",
    label: "Filename",
    field: "filename",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "relative_dirname",
    label: "Path",
    field: "relative_dirname",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center" as const,
    sortable: true,
    style: "width: 100px",
  },
  {
    name: "actions",
    label: "Actions",
    field: () => "",
    align: "center" as const,
    style: "width: 100px",
  },
];

const filteredFiles = computed(() => {
  let files = store.ruleFiles;

  if (statusFilter.value !== "all") {
    files = files.filter((f) => f.status === statusFilter.value);
  }

  if (fileSearch.value) {
    const q = fileSearch.value.toLowerCase();
    files = files.filter(
      (f) =>
        f.filename.toLowerCase().includes(q) ||
        f.relative_dirname.toLowerCase().includes(q),
    );
  }

  return files;
});

function isUserFile(relativeDirname: string): boolean {
  return relativeDirname.includes("etc/rules");
}

async function openEditor(filename: string) {
  editorOpen.value = true;
  await store.fetchFileContent(filename);
  await nextTick();
  initEditor();
}

function closeEditor() {
  editorOpen.value = false;
  destroyEditor();
  store.editingFilename = null;
  store.fileContent = null;
}

function initEditor() {
  if (!editorEl.value || store.fileContentLoading) return;
  destroyEditor();

  const content = store.fileContent ?? "";
  editorContent.value = content;
  const model = monaco.editor.createModel(content, "xml");
  const theme = $q.dark.isActive ? "vs-dark" : "vs-light";
  editor = monaco.editor.create(editorEl.value, {
    automaticLayout: true,
    model,
    theme,
    minimap: { enabled: false },
    fontSize: 13,
    tabSize: 2,
    readOnly: false,
  });

  editor.onDidChangeModelContent(() => {
    editorContent.value = editor?.getValue() ?? "";
  });
}

function destroyEditor() {
  if (editor) {
    editor.getModel()?.dispose();
    editor.dispose();
    editor = null;
  }
}

async function onSave() {
  if (!store.editingFilename || !editor) return;
  saving.value = true;
  const content = editor.getValue();
  await store.saveFileContent(store.editingFilename, content);
  saving.value = false;
}

function confirmDelete(filename: string) {
  deletingFilename.value = filename;
  deleteDialogOpen.value = true;
}

async function onDelete() {
  if (!deletingFilename.value) return;
  deleting.value = true;
  await store.deleteFile(deletingFilename.value);
  deleting.value = false;
  deleteDialogOpen.value = false;
  deletingFilename.value = null;
}

// Watch for file content load finishing to initialize editor
watch(
  () => store.fileContentLoading,
  async (loading) => {
    if (!loading && editorOpen.value) {
      await nextTick();
      initEditor();
    }
  },
);

watch(
  () => $q.dark.isActive,
  (dark) => {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs-light");
  },
);

onMounted(() => {
  if (!store.ruleFiles.length) {
    store.fetchRuleFiles();
  }
});

onBeforeUnmount(() => {
  destroyEditor();
});
</script>

<style scoped>
.files-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.files-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.files-search {
  flex: 1;
  max-width: 300px;
}

.files-status-filter {
  width: 140px;
}

.files-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 10px 16px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.files-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.files-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

.files-name {
  display: inline-flex;
  align-items: center;
  font-family: monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

.files-path {
  font-family: monospace;
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
}

/* Editor Dialog */
.editor-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.editor-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-header__filename {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
}

.editor-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-body {
  flex: 1;
  padding: 0;
  position: relative;
  min-height: 0;
}

.editor-monaco {
  position: absolute;
  inset: 0;
}

.editor-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 13px;
}
</style>
