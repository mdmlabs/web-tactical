<template>
  <div class="cywm-scope cywm-page">
    <div class="cywm-topbar">
      <div class="cywm-breadcrumb">
        <span class="cywm-breadcrumb__link">CYWM</span>
        <span class="cywm-breadcrumb__sep">/</span>
        <span>Files &amp; Deploy</span>
      </div>
      <div class="cywm-topbar__spacer"></div>
      <div class="cywm-topbar__meta">
        Wazuh manager:&nbsp;<strong>v4.14.4</strong>
      </div>
      <div class="cywm-topbar__status">
        <span class="cywm-dot cywm-dot--ok"></span> API connected (mock)
      </div>
    </div>

    <div class="cywm-page__body">
      <div class="cywm-page-header">
        <div>
          <h1 class="cywm-title">
            Files
            <span class="cywm-title__count">({{ store.files.length }})</span>
          </h1>
          <div class="cywm-subtitle">
            Manage Wazuh manager and Windows agent configuration files. Deploy
            without SSH/RDP.
          </div>
        </div>
        <div class="cywm-page-actions">
          <q-btn
            flat
            no-caps
            dense
            icon="upload_file"
            label="Upload file"
            color="primary"
            @click="openUploadModal"
          />
          <q-btn
            flat
            no-caps
            dense
            icon="add"
            label="New file"
            color="primary"
            @click="openCreateModal()"
          />
        </div>
      </div>

      <div class="cywm-layout">
        <div class="cywm-layout__tree">
          <FileTree
            :files="store.files"
            :active-id="store.selectedFileId"
            :modified-ids="modifiedIds"
            @select="onSelect"
            @quick-create="
              (target, category) => openCreateModal(target, category)
            "
          />
        </div>
        <div class="cywm-layout__editor">
          <ConfigEditor
            v-if="store.selectedFile"
            :file="store.selectedFile"
            :model-value="store.editorContent"
            :modified="store.isModified"
            @update:model-value="store.setEditorContent"
            @save="onSave"
            @deploy="onDeploy"
            @reload="onReload"
            @delete="onDelete"
          />
          <div v-else class="cywm-empty">
            <q-icon name="folder_open" size="40px" />
            <div class="cywm-empty__text">
              Select a file from the tree to start editing
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useCywmStore } from "@/stores/cywm";
import FileTree from "@/cywm/components/FileTree.vue";
import ConfigEditor from "@/cywm/components/ConfigEditor.vue";
import UploadFileModal from "@/cywm/components/UploadFileModal.vue";
import CreateFileModal from "@/cywm/components/CreateFileModal.vue";
import DeployLogModal from "@/cywm/components/DeployLogModal.vue";
import { notifySuccess, notifyError, notifyInfo } from "@/utils/notify";
import type { ConfigFile, FileCategory, FileTarget } from "@/cywm/types";

const $q = useQuasar();
const store = useCywmStore();

const modifiedIds = computed<Set<string>>(() => {
  const set = new Set<string>();
  if (store.isModified && store.selectedFileId) {
    set.add(store.selectedFileId);
  }
  return set;
});

onMounted(async () => {
  if (store.files.length === 0) {
    await store.fetchFiles();
  }
});

function onSelect(id: string) {
  if (store.isModified) {
    $q.dialog({
      title: "Unsaved changes",
      message:
        "You have unsaved changes. Discard them and switch to another file?",
      ok: { label: "Discard", color: "negative", flat: true },
      cancel: { label: "Stay", flat: true },
      persistent: true,
    }).onOk(() => store.selectFile(id));
    return;
  }
  store.selectFile(id);
}

async function onSave() {
  try {
    await store.saveCurrentFile();
    notifySuccess("File saved");
  } catch (e) {
    notifyError(e instanceof Error ? e.message : String(e));
  }
}

function onDeploy() {
  const file = store.selectedFile;
  if (!file) return;
  $q.dialog({
    component: DeployLogModal,
    componentProps: { file },
  });
}

function onReload() {
  store.reloadEditor();
  notifyInfo("Reverted to last saved version");
}

function onDelete() {
  const file = store.selectedFile;
  if (!file) return;
  $q.dialog({
    title: "Delete file",
    message: `Delete <strong>${file.filename}</strong>? It will be soft-deleted (recoverable for 30 days).`,
    html: true,
    ok: { label: "Delete", color: "negative" },
    cancel: { label: "Cancel", flat: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await store.deleteCurrentFile();
      notifySuccess(`Deleted ${file.filename}`);
    } catch (e) {
      notifyError(e instanceof Error ? e.message : String(e));
    }
  });
}

function openUploadModal() {
  $q.dialog({
    component: UploadFileModal,
  }).onOk((created: ConfigFile) => {
    store.selectFile(created.id);
  });
}

function openCreateModal(target?: FileTarget, category?: FileCategory) {
  $q.dialog({
    component: CreateFileModal,
    componentProps: {
      initialTarget: target,
      initialCategory: category,
    },
  }).onOk((created: ConfigFile) => {
    store.selectFile(created.id);
  });
}
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.cywm-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--cywm-bg-page);
  color: var(--cywm-text-primary);
  font-family: var(--cywm-sans);
  font-size: 14px;
}

.cywm-topbar {
  background: var(--cywm-bg-card);
  border-bottom: 1px solid var(--cywm-border);
  padding: 0 24px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  flex-shrink: 0;
}

.cywm-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--cywm-text-secondary);
}

.cywm-breadcrumb__link {
  color: var(--cywm-accent);
  cursor: pointer;
}

.cywm-breadcrumb__sep {
  color: var(--cywm-text-muted);
}

.cywm-topbar__spacer {
  flex: 1;
}

.cywm-topbar__meta {
  font-size: 12px;
  color: var(--cywm-text-secondary);

  strong {
    color: var(--cywm-text-primary);
  }
}

.cywm-topbar__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--cywm-text-secondary);
}

.cywm-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cywm-text-muted);
}

.cywm-dot--ok {
  background: var(--cywm-success);
}

.cywm-page__body {
  flex: 1;
  padding: 16px 24px 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cywm-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.cywm-page-actions {
  display: flex;
  gap: 4px;
}

.cywm-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--cywm-text-primary);
}

.cywm-title__count {
  color: var(--cywm-text-secondary);
  font-weight: 500;
}

.cywm-subtitle {
  color: var(--cywm-text-secondary);
  font-size: 13px;
  margin-top: 4px;
}

.cywm-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  min-height: 0;
}

.cywm-layout__tree {
  min-height: 0;
}

.cywm-layout__editor {
  min-height: 0;
}

.cywm-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--cywm-text-muted);
  background: var(--cywm-bg-card);
  border: 1px dashed var(--cywm-border-strong);
  border-radius: 4px;
}

.cywm-empty__text {
  font-size: 14px;
}
</style>
