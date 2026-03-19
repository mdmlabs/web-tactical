<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="add-resource-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Add Resource</span>
        <div class="header-right">
          <!-- <q-chip dense outline color="grey-7" size="sm" icon="public">
            Global
          </q-chip> -->
          <q-btn icon="close" flat round dense @click="close" />
        </div>
      </div>

      <q-separator />

      <!-- Resource Type Tabs -->
      <div class="type-tabs">
        <q-tabs
          v-model="resourceType"
          dense
          class="resource-tabs"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
        >
          <q-tab name="book" label="Book" />
          <q-tab name="certificate" label="Certificate" />
          <q-tab name="image" label="Image" />
        </q-tabs>
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <p class="content-description">
          {{ typeDescription }}
        </p>

        <!-- Resource Selection -->
        <div v-if="!showUpload" class="resource-selection">
          <q-select
            v-model="selectedResource"
            :options="currentResources"
            option-label="name"
            option-value="id"
            outlined
            dense
            placeholder="Select a resource"
            class="resource-select"
            emit-value
            map-options
          />

          <span class="or-text">or</span>

          <q-btn
            outline
            color="primary"
            label="Upload new resource"
            class="upload-btn"
            @click="showUpload = true"
          />
        </div>

        <!-- Upload New Resource -->
        <div v-else class="upload-section">
          <ResourceFileUpload
            v-model="uploadFile"
            :resource-type="resourceType"
            @file-selected="onUploadFileSelected"
          />

          <q-input
            v-model="uploadName"
            outlined
            dense
            label="Name"
            placeholder="Enter resource name"
            class="q-mt-md"
            :rules="[(val) => !!val || 'Name is required']"
          />

          <q-btn
            flat
            label="Cancel upload"
            color="grey-7"
            class="q-mt-sm"
            @click="resetUpload"
          />

          <!-- Upload Progress -->
          <div v-if="uploading" class="upload-progress q-mt-md">
            <q-linear-progress
              :value="uploadProgress / 100"
              color="primary"
              rounded
              size="8px"
            />
            <div class="upload-phase-text">
              {{ uploadPhase === 'hashing' ? 'Computing file hash...' : uploadPhase === 'uploading' ? `Uploading... ${uploadProgress}%` : uploadPhase === 'confirming' ? 'Finalizing...' : '' }}
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <!-- Location (shown when resource is selected or uploading) -->
        <template v-if="selectedResource || (showUpload && uploadFile)">
          <label class="section-label">Location</label>
          <p class="section-hint">Path where the file will be saved</p>
          <q-input
            v-model="location"
            outlined
            type="textarea"
            placeholder="Add location"
            class="location-input"
            autogrow
          />
        </template>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          :label="showUpload ? 'Upload and Save' : 'Save'"
          :disable="!canAdd || uploading"
          :loading="uploading"
          @click="addResource"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { PolicyResource, ResourceType } from '../../types/policies';
import { fetchResourceList } from '@/api/resources';
import { useResourceUpload } from '@/resources/composables/useResourceUpload';
import ResourceFileUpload from '@/resources/components/ResourceFileUpload.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "add", resource: PolicyResource): void;
}>();

const $q = useQuasar();

// Upload state
const showUpload = ref(false);
const uploadFile = ref<File | null>(null);
const uploadName = ref('');
const { uploading, uploadProgress, uploadPhase, uploadResource } =
  useResourceUpload();

// Form state
const resourceType = ref<ResourceType>('book');
const selectedResource = ref<number | null>(null);
const location = ref('');

// API data
const bookResources = ref<Array<{ id: number; name: string }>>([]);
const imageResources = ref<Array<{ id: number; name: string }>>([]);
const certificateResources = ref<Array<{ id: number; name: string }>>([]); 
const loading = ref(false);

const typeDescriptions: Record<ResourceType, string> = {
  book: "Select or upload your own PDF or EPUB resources",
  certificate: "Select or upload your own certificate files",
  image: "Select or upload your own image resources",
};

const typeDescription = computed(() => typeDescriptions[resourceType.value]);

const currentResources = computed(() => {
  switch (resourceType.value) {
    case 'book':
      return bookResources.value;
    case 'certificate':
      return certificateResources.value;
    case 'image':
      return imageResources.value;
    default:
      return [];
  }
});

const selectedResourceData = computed(() =>
  currentResources.value.find((r) => r.id === selectedResource.value),
);

const canAdd = computed(() => selectedResource.value !== null || (showUpload.value && uploadFile.value && uploadName.value));

// Reset upload form
function resetUpload() {
  showUpload.value = false;
  uploadFile.value = null;
  uploadName.value = '';
}

// Handle file selected for upload
function onUploadFileSelected(file: File) {
  if (!uploadName.value) {
    uploadName.value = file.name.replace(/\.[^/.]+$/, '');
  }
}

// Upload and add resource
async function uploadAndAddResource() {
  if (!uploadFile.value || !uploadName.value) return;

  try {
    const uploadedResource = await uploadResource(uploadFile.value, {
      name: uploadName.value,
      resource_type: resourceType.value,
      description: '',
    });

    // Add the uploaded resource
    const resource: PolicyResource = {
      id: `resource-${Date.now()}`,
      resourceId: uploadedResource.id as number,
      name: uploadName.value,
      type: resourceType.value,
      locations: location.value ? [location.value] : [],
    };

    emit('add', resource);
    close();

    $q.notify({
      message: `${resourceType.value === 'book' ? 'Book' : resourceType.value === 'certificate' ? 'Certificate' : 'Image'} "${uploadName.value}" uploaded and added successfully`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to upload resource';
    $q.notify({
      message: msg,
      color: 'negative',
      position: 'top',
      icon: 'error',
    });
  }
}

// Load resources from API
async function loadResources() {
  loading.value = true;
  try {
    const [booksData, imagesData, certificatesData] = await Promise.all([
      fetchResourceList('book'),
      fetchResourceList('image'),
      fetchResourceList('certificate'),
    ]);
    bookResources.value = Array.isArray(booksData) ? booksData : (booksData?.results ?? []);
    imageResources.value = Array.isArray(imagesData) ? imagesData : (imagesData?.results ?? []);
    certificateResources.value = Array.isArray(certificatesData) ? certificatesData : (certificatesData?.results ?? []);
  } catch (error) {
    console.error('Failed to load resources:', error);
    $q.notify({
      message: 'Failed to load resources',
      color: 'negative',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
}

// Reset resource selection when type changes
watch(resourceType, () => {
  selectedResource.value = null;
});

// Reset form when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm();
    loadResources();
  }
});

function resetForm() {
  resourceType.value = "book";
  selectedResource.value = null;
  location.value = "";
  resetUpload();
}

function close() {
  emit("update:modelValue", false);
}

function addResource() {
  if (showUpload.value && uploadFile.value) {
    uploadAndAddResource();
    return;
  }

  if (!canAdd.value || !selectedResourceData.value) return;

  const resource: PolicyResource = {
    id: `resource-${Date.now()}`,
    resourceId: selectedResource.value!,
    name: selectedResourceData.value.name,
    type: resourceType.value,
    locations: location.value ? [location.value] : [],
  };

  emit("add", resource);
  close();
}
</script>

<style scoped>
.add-resource-dialog {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-tabs {
  padding: 0 20px;
}

.resource-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
}

.dialog-content {
  padding: 24px;
}

.content-description {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 20px 0;
}

.resource-selection {
  display: flex;
  align-items: center;
  gap: 16px;
}

.resource-select {
  flex: 1;
}

.or-text {
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
}

.upload-btn {
  text-transform: none;
  font-weight: 600;
}

.upload-section {
  margin-top: 16px;
}

.upload-progress {
  margin-top: 16px;
}

.upload-phase-text {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin-top: 8px;
  text-align: center;
}

.location-section {
  margin-top: 0;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin-bottom: 8px;
}

.section-hint {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 12px 0;
}

.location-input {
  width: 100%;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  padding: 8px 24px;
  min-width: 100px;
}

/* Dark theme */
.body--dark .add-resource-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
}
</style>
