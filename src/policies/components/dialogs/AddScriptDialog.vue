<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="add-script-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Add Script</span>
        <q-btn icon="close" flat round dense @click="close" />
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <p class="content-description">
          Select or upload a script to add to this policy
        </p>

        <!-- Script Selection -->
        <div v-if="!showUpload" class="script-selection">
          <q-select
            v-model="selectedScript"
            :options="scriptResources"
            option-label="name"
            option-value="id"
            outlined
            dense
            placeholder="Select a script"
            class="script-select"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.language }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <span class="or-text">or</span>

          <q-btn
            outline
            color="primary"
            label="Upload new script"
            class="upload-btn"
            @click="showUpload = true"
          />
        </div>

        <!-- Upload New Script -->
        <div v-else class="upload-section">
          <ResourceFileUpload
            v-model="uploadFile"
            resource-type="script"
            @file-selected="onUploadFileSelected"
          />
          
          <q-input
            v-model="uploadName"
            outlined
            dense
            label="Name"
            placeholder="Enter script name"
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

        <!-- Execution Settings (shown when script is selected or uploading) -->
        <template v-if="selectedScript || (showUpload && uploadFile)">
          <q-separator class="q-my-lg" />

          <div class="settings-section">
            <h4 class="section-title">Execution settings</h4>

            <q-input
              v-model.number="timeout"
              outlined
              dense
              label="Timeout (seconds)"
              type="number"
              style="max-width: 200px"
            />

            <q-checkbox
              v-model="runAsUser"
              label="Run as user"
              class="q-mt-md"
            />
          </div>
        </template>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          :label="showUpload ? 'Upload and Add' : 'Add'"
          :disable="!canAdd || uploading"
          :loading="uploading"
          @click="addScript"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { PolicyScript } from '../../types/policies';
import { fetchResourceList } from '@/api/resources';
import { useResourceUpload } from '@/resources/composables/useResourceUpload';
import ResourceFileUpload from '@/resources/components/ResourceFileUpload.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "add", script: PolicyScript): void;
}>();

const $q = useQuasar();

// Upload state
const showUpload = ref(false);
const uploadFile = ref<File | null>(null);
const uploadName = ref('');
const { uploading, uploadProgress, uploadPhase, uploadResource } =
  useResourceUpload();

// Form state
const selectedScript = ref<number | null>(null);
const timeout = ref(300);
const runAsUser = ref(false);

// API data
const scriptResources = ref<Array<{ id: number; name: string; language?: string }>>([]);
const loading = ref(false);

const canAdd = computed(() => selectedScript.value !== null || (showUpload.value && uploadFile.value && uploadName.value));

const selectedScriptData = computed(() => 
  scriptResources.value.find(s => s.id === selectedScript.value)
);

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

// Upload and add script
async function uploadAndAddScript() {
  if (!uploadFile.value || !uploadName.value) return;
  
  try {
    const uploadedResource = await uploadResource(uploadFile.value, {
      name: uploadName.value,
      resource_type: 'script',
      description: '',
      language: 'PowerShell',
    });
    
    // Add the uploaded resource as a script
    const script: PolicyScript = {
      id: `script-${Date.now()}`,
      resourceId: uploadedResource.id as number,
      name: uploadName.value,
      timeout: timeout.value,
      runAsUser: runAsUser.value,
    };
    
    emit('add', script);
    close();
    
    $q.notify({
      message: `Script "${uploadName.value}" uploaded and added successfully`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to upload script';
    $q.notify({
      message: msg,
      color: 'negative',
      position: 'top',
      icon: 'error',
    });
  }
}

// Load scripts from API
async function loadScripts() {
  loading.value = true;
  try {
    const data = await fetchResourceList('script');
    scriptResources.value = Array.isArray(data) ? data : (data?.results ?? []);
  } catch (error) {
    console.error('Failed to load scripts:', error);
    $q.notify({
      message: 'Failed to load scripts',
      color: 'negative',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
}

// Reset form when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm();
    loadScripts();
  }
});

function resetForm() {
  selectedScript.value = null;
  timeout.value = 300;
  runAsUser.value = false;
  resetUpload();
}

function close() {
  emit("update:modelValue", false);
}

function addScript() {
  if (showUpload.value && uploadFile.value) {
    uploadAndAddScript();
    return;
  }
  
  if (!canAdd.value || !selectedScriptData.value) return;

  const script: PolicyScript = {
    id: `script-${Date.now()}`,
    resourceId: selectedScript.value!,
    name: selectedScriptData.value.name,
    timeout: timeout.value,
    runAsUser: runAsUser.value,
  };

  emit("add", script);
  close();
}
</script>

<style scoped>
.add-script-dialog {
  width: 100%;
  max-width: 550px;
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

.dialog-content {
  padding: 24px;
}

.content-description {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 20px 0;
}

.script-selection {
  display: flex;
  align-items: center;
  gap: 16px;
}

.script-select {
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

.settings-section {
  margin-top: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 16px 0;
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
.body--dark .add-script-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
}
</style>
