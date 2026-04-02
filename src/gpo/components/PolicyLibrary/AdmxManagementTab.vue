<template>
  <q-scroll-area
    class="management-scroll-area"
    :style="{ height: 'calc(100vh - 200px)' }"
  >
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">Policy management</div>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Import ADMX Files</div>
          <div class="text-caption text-grey-7 q-mb-md">
            Upload a ZIP archive containing ADMX files (max 50MB)
          </div>
          <q-file
            v-model="admxZipFile"
            label="Select ZIP archive with ADMX files"
            accept=".zip,application/zip,application/x-zip-compressed"
            outlined
            dense
            :clearable="!admxZipUploading"
            :disable="admxZipUploading"
            :error="!!fileError"
            :error-message="fileError"
            :hint="admxZipFile ? formatFileSize(admxZipFile.size) : ''"
            class="q-mb-md"
            @update:model-value="handleFileChange"
          >
            <template v-slot:prepend>
              <q-icon name="archive" />
            </template>
          </q-file>

          <q-linear-progress
            v-if="admxZipUploading && uploadProgress > 0"
            :value="uploadProgress / 100"
            color="primary"
            size="8px"
            class="q-mb-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="`${uploadProgress}%`"
              />
            </div>
          </q-linear-progress>

          <div class="row q-gutter-sm">
            <q-btn
              color="primary"
              icon="cloud_upload"
              label="Import ADMX ZIP"
              :loading="admxZipUploading"
              :disable="!canUpload"
              @click="handleImportAdmxZip"
            />
            <q-btn
              v-if="admxZipUploading"
              flat
              color="negative"
              icon="cancel"
              label="Cancel"
              @click="handleCancelUpload"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1">Loaded ADMX Files</div>
            <q-btn
              icon="refresh"
              label="Refresh"
              color="primary"
              outline
              dense
              :loading="loadingAdmxFiles"
              @click="loadAdmxFilesList"
            />
          </div>
          <q-scroll-area class="admx-files-table-scroll" style="height: 550px">
            <q-table
              :rows="loadedAdmxFiles"
              :columns="admxFilesColumns"
              :loading="loadingAdmxFiles"
              row-key="file_hash"
              flat
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
              no-data-label="No ADMX files loaded"
            >
              <template v-slot:body-cell-file_name="props">
                <q-td :props="props">
                  <div class="text-weight-medium">
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-file_hash="props">
                <q-td :props="props">
                  <div
                    class="text-caption text-grey-7"
                    style="font-family: monospace"
                  >
                    {{ props.value }}
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-loaded_at_unix="props">
                <q-td :props="props">
                  {{ formatAdmxFileDate(props.value as number | string) }}
                </q-td>
              </template>
            </q-table>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { QTableColumn } from "quasar";
import { notifyError, notifySuccess } from "@/utils/notify";
import { admxServiceClientWrapper, AdmxUploadError } from "../../api/grpc-client";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const admxZipFile = ref<File | null>(null);
const admxZipUploading = ref(false);
const uploadProgress = ref(0);
const uploadAbortController = ref<AbortController | null>(null);
const fileError = ref("");

const canUpload = computed(() => {
  return admxZipFile.value && !fileError.value && !admxZipUploading.value;
});

interface LoadedAdmxFile {
  file_name: string;
  file_hash: string;
  loaded_at_unix: number | string;
}

const loadedAdmxFiles = ref<LoadedAdmxFile[]>([]);
const loadingAdmxFiles = ref(false);

const admxFilesColumns: QTableColumn[] = [
  {
    name: "file_name",
    required: true,
    label: "File Name",
    align: "left",
    field: "file_name",
    sortable: true,
  },
  {
    name: "file_hash",
    label: "Hash",
    align: "left",
    field: "file_hash",
    sortable: true,
  },
  {
    name: "loaded_at_unix",
    label: "Loaded At",
    align: "left",
    field: "loaded_at_unix",
    sortable: true,
  },
];

function handleFileChange(file: File | null) {
  fileError.value = "";
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".zip")) {
    fileError.value = "Please select a ZIP file";
    admxZipFile.value = null;
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    fileError.value = `File too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`;
    admxZipFile.value = null;
    return;
  }

  if (file.size === 0) {
    fileError.value = "File is empty";
    admxZipFile.value = null;
    return;
  }
}

async function handleImportAdmxZip() {
  if (!admxZipFile.value || !canUpload.value) return;
  uploadAbortController.value = new AbortController();
  admxZipUploading.value = true;
  uploadProgress.value = 0;

  try {
    const response = await admxServiceClientWrapper.importAdmxZip(
      admxZipFile.value,
      {
        signal: uploadAbortController.value.signal,
        maxFileSize: MAX_FILE_SIZE,
        onProgress: (progress) => {
          uploadProgress.value = Math.round(progress.percentage);
        },
      },
    );

    if (response.success) {
      notifySuccess(response.message || "ADMX files successfully imported");
      admxZipFile.value = null;
      uploadProgress.value = 0;
      fileError.value = "";
      await loadAdmxFilesList();
    } else {
      notifyError(response.message || "Failed to import ADMX files");
    }
  } catch (error) {
    handleUploadError(error);
  } finally {
    admxZipUploading.value = false;
    uploadAbortController.value = null;
  }
}

function handleCancelUpload() {
  uploadAbortController.value?.abort();
}

function handleUploadError(error: unknown) {
  if (error instanceof AdmxUploadError) {
    switch (error.code) {
      case "CANCELLED":
        break;
      case "FILE_TOO_LARGE":
        notifyError(error.message);
        fileError.value = error.message;
        break;
      case "INVALID_FORMAT":
        notifyError(error.message);
        fileError.value = error.message;
        break;
      case "UPLOAD_FAILED":
        notifyError(error.message);
        console.error("ADMX upload failed:", error);
        break;
    }
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error during upload";
    notifyError(errorMessage);
    console.error("ADMX ZIP import error:", error);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

async function loadAdmxFilesList() {
  loadingAdmxFiles.value = true;
  try {
    const response = await admxServiceClientWrapper.listAdmxFiles();
    const filesList =
      response.filesList || (response as { files?: unknown[] }).files || [];
    loadedAdmxFiles.value = filesList.map((file: unknown) => {
      const f = file as {
        fileName?: string;
        file_name?: string;
        fileHash?: string;
        file_hash?: string;
        loadedAtUnix?: number | string;
        loaded_at_unix?: number | string;
      };
      return {
        file_name: f.fileName || f.file_name || "",
        file_hash: f.fileHash || f.file_hash || "",
        loaded_at_unix: f.loadedAtUnix || f.loaded_at_unix || 0,
      };
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading ADMX files list";
    notifyError(errorMessage);
    console.error("Error loading ADMX files list:", error);
    loadedAdmxFiles.value = [];
  } finally {
    loadingAdmxFiles.value = false;
  }
}

function formatAdmxFileDate(timestamp: number | string): string {
  if (!timestamp) return "-";
  const date = new Date(
    typeof timestamp === "string"
      ? Number.parseInt(timestamp, 10) * 1000
      : timestamp * 1000,
  );
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

onMounted(() => {
  loadAdmxFilesList();
});
</script>
