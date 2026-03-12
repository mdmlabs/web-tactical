<template>
  <div
    class="file-upload-area"
    :class="{ 'file-upload-area--dragover': isDragOver, 'file-upload-area--has-file': file }"
    @dragenter.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="acceptedExtensions"
      class="file-input-hidden"
      @change="handleFileSelect"
    />

    <template v-if="!file">
      <q-icon name="cloud_upload" size="48px" class="upload-icon" />
      <div class="upload-text">
        <span class="upload-primary">Drag and drop your file here</span>
        <span class="upload-secondary">or click to browse</span>
      </div>
      <div class="upload-hint">
        Supported formats: {{ supportedFormats }}
      </div>
      <div v-if="validationError" class="upload-error">{{ validationError }}</div>
    </template>

    <template v-else>
      <div class="file-preview">
        <q-icon :name="fileIcon" size="40px" class="file-icon" />
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="remove-file-btn"
          @click.stop="removeFile"
        >
          <q-tooltip>Remove file</q-tooltip>
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ResourceType } from '../types/resources';
import { ALLOWED_EXTENSIONS, RESOURCE_SIZE_LIMITS } from '../types/resources';

const props = defineProps<{
  resourceType: ResourceType;
  modelValue?: File | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void;
  (e: 'file-selected', file: File): void;
  (e: 'file-invalid', message: string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const validationError = ref<string | null>(null);
const file = computed(() => props.modelValue);

const acceptedExtensions = computed(() => {
  const exts = ALLOWED_EXTENSIONS[props.resourceType] || [];
  return exts.map(ext => `.${ext}`).join(',');
});

const supportedFormats = computed(() => {
  const exts = ALLOWED_EXTENSIONS[props.resourceType] || [];
  return exts.map(ext => ext.toUpperCase()).join(', ');
});

const fileIcon = computed(() => {
  if (!file.value) return 'insert_drive_file';
  const ext = file.value.name.split('.').pop()?.toLowerCase() || '';
  
  const iconMap: Record<string, string> = {
    pdf: 'picture_as_pdf',
    ps1: 'code',
    py: 'code',
    sh: 'code',
    bat: 'code',
    js: 'code',
    exe: 'settings_applications',
    msi: 'inventory_2',
    dmg: 'inventory_2',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image',
    p12: 'vpn_key',
    pfx: 'vpn_key',
    cer: 'vpn_key',
    crt: 'vpn_key',
    epub: 'menu_book',
  };
  
  return iconMap[ext] || 'insert_drive_file';
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectFile(input.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectFile(event.dataTransfer.files[0]);
  }
}

function selectFile(selectedFile: File) {
  validationError.value = null;

  // Validate extension
  const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
  const allowedExts = ALLOWED_EXTENSIONS[props.resourceType] || [];
  
  if (!allowedExts.includes(ext)) {
    const msg = `Extension .${ext} is not allowed. Supported: ${allowedExts.map(e => `.${e}`).join(', ')}`;
    validationError.value = msg;
    emit('file-invalid', msg);
    return;
  }

  // Validate file size
  const sizeLimit = RESOURCE_SIZE_LIMITS[props.resourceType];
  if (sizeLimit && selectedFile.size > sizeLimit) {
    const msg = `File too large. Maximum size: ${formatFileSize(sizeLimit)}`;
    validationError.value = msg;
    emit('file-invalid', msg);
    return;
  }
  
  emit('update:modelValue', selectedFile);
  emit('file-selected', selectedFile);
}

function removeFile() {
  emit('update:modelValue', null);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.file-upload-area {
  border: 2px dashed var(--border-color, #d1d5db);
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--upload-bg, #fafafa);
}

.file-upload-area:hover {
  border-color: var(--primary-color, #1089d3);
  background: var(--upload-hover-bg, #f0f7ff);
}

.file-upload-area--dragover {
  border-color: var(--primary-color, #1089d3);
  background: var(--upload-hover-bg, #f0f7ff);
  border-style: solid;
}

.file-upload-area--has-file {
  border-style: solid;
  border-color: var(--success-color, #10b981);
  background: var(--success-bg, #f0fdf4);
}

.file-input-hidden {
  display: none;
}

.upload-icon {
  color: var(--text-secondary, #9ca3af);
  margin-bottom: 12px;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.upload-primary {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.upload-secondary {
  font-size: 14px;
  color: var(--primary-color, #1089d3);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-secondary, #9ca3af);
}

.upload-error {
  font-size: 12px;
  color: var(--error-color, #ef4444);
  margin-top: 4px;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.file-icon {
  color: var(--success-color, #10b981);
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.remove-file-btn {
  color: var(--text-secondary, #6b7280);
}

.remove-file-btn:hover {
  color: var(--error-color, #ef4444);
}

/* Dark theme */
.body--dark .file-upload-area {
  --border-color: #3d3d4d;
  --upload-bg: #1e1e2d;
  --upload-hover-bg: #1a3a5c;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --success-bg: #1a3d2e;
}
</style>
