import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  listFiles as apiListFiles,
  saveFileContent as apiSaveFileContent,
  createFile as apiCreateFile,
  uploadFile as apiUploadFile,
  deleteFile as apiDeleteFile,
  listDeploys as apiListDeploys,
  getDeployLog as apiGetDeployLog,
} from "@/cywm/api/cywm";
import type {
  ConfigFile,
  CreateFilePayload,
  DeployRecord,
  ListDeploysParams,
} from "@/cywm/types";

export const useCywmStore = defineStore("cywm", () => {
  // === Files ===
  const files = ref<ConfigFile[]>([]);
  const filesLoading = ref(false);
  const filesError = ref<string | null>(null);

  const selectedFileId = ref<string | null>(null);

  // Editor buffer — отдельно от files[].content, чтобы modified-флаг был чистым
  const editorContent = ref<string>("");

  const selectedFile = computed<ConfigFile | null>(() => {
    if (!selectedFileId.value) return null;
    return files.value.find((f) => f.id === selectedFileId.value) ?? null;
  });

  const isModified = computed<boolean>(() => {
    const file = selectedFile.value;
    if (!file) return false;
    return editorContent.value !== file.contentSaved;
  });

  // === Deploy history ===
  const deployHistory = ref<DeployRecord[]>([]);
  const historyTotal = ref(0);
  const historyLoading = ref(false);
  const historyError = ref<string | null>(null);
  const historyFilters = ref<ListDeploysParams>({
    search: "",
    page: 1,
    perPage: 10,
  });

  // === Actions: files ===
  async function fetchFiles(): Promise<void> {
    filesLoading.value = true;
    filesError.value = null;
    try {
      files.value = await apiListFiles();
    } catch (e) {
      filesError.value = e instanceof Error ? e.message : String(e);
    } finally {
      filesLoading.value = false;
    }
  }

  function selectFile(id: string | null): void {
    selectedFileId.value = id;
    if (id === null) {
      editorContent.value = "";
      return;
    }
    const file = files.value.find((f) => f.id === id);
    editorContent.value = file ? file.content : "";
  }

  function setEditorContent(value: string): void {
    editorContent.value = value;
  }

  async function saveCurrentFile(): Promise<void> {
    const file = selectedFile.value;
    if (!file) return;
    const updated = await apiSaveFileContent(file.id, editorContent.value);
    const idx = files.value.findIndex((f) => f.id === file.id);
    if (idx !== -1) files.value[idx] = updated;
    editorContent.value = updated.content;
  }

  async function createFile(payload: CreateFilePayload): Promise<ConfigFile> {
    const created = await apiCreateFile(payload);
    files.value.push(created);
    return created;
  }

  async function uploadFile(form: FormData): Promise<ConfigFile> {
    const created = await apiUploadFile(form);
    files.value.push(created);
    return created;
  }

  async function deleteCurrentFile(): Promise<void> {
    const file = selectedFile.value;
    if (!file) return;
    await apiDeleteFile(file.id);
    files.value = files.value.filter((f) => f.id !== file.id);
    selectFile(null);
  }

  function reloadEditor(): void {
    const file = selectedFile.value;
    if (!file) return;
    editorContent.value = file.contentSaved;
  }

  // === Actions: history ===
  async function fetchHistory(): Promise<void> {
    historyLoading.value = true;
    historyError.value = null;
    try {
      const { items, total } = await apiListDeploys(historyFilters.value);
      deployHistory.value = items;
      historyTotal.value = total;
    } catch (e) {
      historyError.value = e instanceof Error ? e.message : String(e);
    } finally {
      historyLoading.value = false;
    }
  }

  function setHistoryFilters(patch: Partial<ListDeploysParams>): void {
    historyFilters.value = { ...historyFilters.value, ...patch };
  }

  async function fetchDeployLog(deployId: string): Promise<string> {
    const { log } = await apiGetDeployLog(deployId);
    return log;
  }

  return {
    // state
    files,
    filesLoading,
    filesError,
    selectedFileId,
    editorContent,
    deployHistory,
    historyTotal,
    historyLoading,
    historyError,
    historyFilters,
    // getters
    selectedFile,
    isModified,
    // actions
    fetchFiles,
    selectFile,
    setEditorContent,
    saveCurrentFile,
    createFile,
    uploadFile,
    deleteCurrentFile,
    reloadEditor,
    fetchHistory,
    setHistoryFilters,
    fetchDeployLog,
  };
});
