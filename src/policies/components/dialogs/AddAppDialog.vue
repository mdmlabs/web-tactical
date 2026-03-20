<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="add-app-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Add App</span>
        <q-btn icon="close" flat round dense @click="close" />
      </div>

      <q-separator />

      <!-- Tabs -->
      <div class="tabs-container">
        <q-tabs
          v-model="activeTab"
          dense
          class="app-tabs"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
        >
          <!-- <q-tab name="store" label="Microsoft Store" disable />
          <q-tab name="applivery" label="Applivery" disable /> -->
          <q-tab name="resource" label="Resource" />
        </q-tabs>
        <!-- <span class="use-package-link">Use a resource package</span> -->
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <p class="content-description">
          Select or upload your own MSI, MSIX or APPX resources
        </p>

        <!-- Resource Selection -->
        <div v-if="!showUpload" class="resource-selection">
          <q-select
            v-model="selectedResource"
            :options="appResources"
            option-label="name"
            option-value="id"
            outlined
            dense
            placeholder="Select a resource"
            class="resource-select"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption
                    >{{ scope.opt.version }} (.{{
                      scope.opt.extension
                    }})</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
          </q-select>

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
            resource-type="app"
            @file-selected="onUploadFileSelected"
          />
          
          <q-input
            v-model="uploadName"
            outlined
            dense
            label="Name"
            placeholder="Enter app name"
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

        <!-- Installation Settings (shown when resource is selected or uploading) -->
        <template v-if="selectedResource || (showUpload && uploadFile)">
          <q-separator class="q-my-lg" />

          <div class="settings-section">
            <h4 class="section-title">Installation settings</h4>

            <div class="settings-grid">
              <q-checkbox v-model="silentInstall" label="Silent install" />
              <q-checkbox v-model="runAsUser" label="Run as user" />
            </div>

            <q-input
              v-model="installArguments"
              outlined
              dense
              label="Arguments"
              placeholder="Installation arguments"
              class="q-mt-md"
            />

            <q-input
              v-model.number="timeout"
              outlined
              dense
              label="Timeout (seconds)"
              type="number"
              class="q-mt-md"
              style="max-width: 200px"
            />
          </div>

          <q-separator class="q-my-lg" />

          <!-- Verification Method -->
          <div class="verification-section">
            <h4 class="section-title">Verification method</h4>

            <q-option-group
              v-model="verificationMethod"
              :options="verificationOptions"
              type="radio"
              inline
              class="verification-options"
            />

            <!-- Registry fields -->
            <template v-if="verificationMethod === 'registry'">
              <q-input
                v-model="registryPath"
                outlined
                dense
                label="Path"
                placeholder="HKLM\SOFTWARE\Google\Chrome"
                class="q-mt-md"
              />
              <q-input
                v-model="registryKey"
                outlined
                dense
                label="Key (optional)"
                placeholder="Version"
                class="q-mt-md"
              />
            </template>

            <!-- File exists field -->
            <template v-if="verificationMethod === 'file_exists'">
              <q-input
                v-model="filePath"
                outlined
                dense
                label="Path to file"
                placeholder="C:\Program Files\App\app.exe"
                class="q-mt-md"
              />
            </template>

            <!-- Script selection -->
            <template v-if="verificationMethod === 'script'">
              <q-select
                v-model="verificationScript"
                :options="scriptResources"
                option-label="name"
                option-value="id"
                outlined
                dense
                placeholder="Select a script"
                class="q-mt-md"
                emit-value
                map-options
              />
            </template>
          </div>
        </template>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          :label="showUpload ? 'Upload and Add' : 'Select'"
          :disable="!canAdd || uploading"
          :loading="uploading"
          @click="addApp"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import type { PolicyApp, VerificationMethod } from "../../types/policies";
import { fetchResourceList } from "@/api/resources";
import { useResourceUpload } from "@/resources/composables/useResourceUpload";
import ResourceFileUpload from "@/resources/components/ResourceFileUpload.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "add", app: PolicyApp): void;
}>();

const $q = useQuasar();

// Upload state
const showUpload = ref(false);
const uploadFile = ref<File | null>(null);
const uploadName = ref("");
const { uploading, uploadProgress, uploadPhase, uploadResource } =
  useResourceUpload();

// Form state
const activeTab = ref("resource");
const selectedResource = ref<number | null>(null);
const silentInstall = ref(true);
const runAsUser = ref(false);
const installArguments = ref("");
const timeout = ref(900);
const verificationMethod = ref<VerificationMethod>("registry");
const registryPath = ref("");
const registryKey = ref("");
const filePath = ref("");
const verificationScript = ref<number | null>(null);

// API data
const appResources = ref<Array<{ id: number; name: string; version: string; extension?: string }>>([]);
const scriptResources = ref<Array<{ id: number; name: string; language?: string }>>([]); 
const loading = ref(false);

const verificationOptions = [
  { value: "registry", label: "Registry" },
  { value: "file_exists", label: "File exists" },
  { value: "script", label: "Script" },
];

const canAdd = computed(() => selectedResource.value !== null || (showUpload.value && uploadFile.value && uploadName.value));

const selectedResourceData = computed(() => 
  appResources.value.find(r => r.id === selectedResource.value)
);

// Reset upload form
function resetUpload() {
  showUpload.value = false;
  uploadFile.value = null;
  uploadName.value = "";
}

// Handle file selected for upload
function onUploadFileSelected(file: File) {
  if (!uploadName.value) {
    uploadName.value = file.name.replace(/\.[^/.]+$/, "");
  }
}

// Upload and add app
async function uploadAndAddApp() {
  if (!uploadFile.value || !uploadName.value) return;
  
  try {
    const uploadedResource = await uploadResource(uploadFile.value, {
      name: uploadName.value,
      resource_type: "app",
      description: "",
      version: "1.0.0",
      platform: "Windows",
    });
    
    // Add the uploaded resource as an app
    const app: PolicyApp = {
      id: `app-${Date.now()}`,
      resourceId: uploadedResource.id as number,
      name: uploadName.value,
      version: "1.0.0",
      silentInstall: silentInstall.value,
      arguments: installArguments.value,
      timeout: timeout.value,
      runAsUser: runAsUser.value,
      verification: {
        method: verificationMethod.value,
        registryPath: verificationMethod.value === "registry" ? registryPath.value : undefined,
        registryKey: verificationMethod.value === "registry" ? registryKey.value : undefined,
        filePath: verificationMethod.value === "file_exists" ? filePath.value : undefined,
        scriptId: verificationMethod.value === "script" ? verificationScript.value || undefined : undefined,
      },
    };
    
    emit("add", app);
    close();
    
    $q.notify({
      message: `App "${uploadName.value}" uploaded and added successfully`,
      color: "positive",
      position: "top",
      icon: "check_circle",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to upload app";
    $q.notify({
      message: msg,
      color: "negative",
      position: "top",
      icon: "error",
    });
  }
}

// Load resources from API
async function loadResources() {
  loading.value = true;
  try {
    const [appsData, scriptsData] = await Promise.all([
      fetchResourceList("app"),
      fetchResourceList("script"),
    ]);
    appResources.value = Array.isArray(appsData) ? appsData : (appsData?.results ?? []);
    scriptResources.value = Array.isArray(scriptsData) ? scriptsData : (scriptsData?.results ?? []);
  } catch (error) {
    console.error("Failed to load resources:", error);
    $q.notify({
      message: "Failed to load resources",
      color: "negative",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
}

// Reset form when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm();
    loadResources();
  }
});

function resetForm() {
  activeTab.value = "resource";
  selectedResource.value = null;
  silentInstall.value = true;
  runAsUser.value = false;
  installArguments.value = "";
  timeout.value = 900;
  verificationMethod.value = "registry";
  registryPath.value = "";
  registryKey.value = "";
  filePath.value = "";
  verificationScript.value = null;
  resetUpload();
}

function close() {
  emit("update:modelValue", false);
}

function addApp() {
  if (showUpload.value && uploadFile.value) {
    uploadAndAddApp();
    return;
  }
  
  if (!canAdd.value || !selectedResourceData.value) return;

  const app: PolicyApp = {
    id: `app-${Date.now()}`,
    resourceId: selectedResource.value!,
    name: selectedResourceData.value.name,
    version: selectedResourceData.value.version,
    silentInstall: silentInstall.value,
    arguments: installArguments.value,
    timeout: timeout.value,
    runAsUser: runAsUser.value,
    verification: {
      method: verificationMethod.value,
      registryPath:
        verificationMethod.value === "registry"
          ? registryPath.value
          : undefined,
      registryKey:
        verificationMethod.value === "registry" ? registryKey.value : undefined,
      filePath:
        verificationMethod.value === "file_exists" ? filePath.value : undefined,
      scriptId:
        verificationMethod.value === "script"
          ? verificationScript.value || undefined
          : undefined,
    },
  };

  emit("add", app);
  close();
}
</script>

<style scoped>
.add-app-dialog {
  width: 100%;
  max-width: 650px;
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

.tabs-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.app-tabs {
  flex: 1;
}

.app-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
}

.use-package-link {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
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

.settings-section,
.verification-section {
  margin-top: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 16px 0;
}

.settings-grid {
  display: flex;
  gap: 24px;
}

.verification-options {
  margin-bottom: 8px;
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
.body--dark .add-app-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
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
</style>