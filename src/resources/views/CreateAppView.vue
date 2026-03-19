<template>
  <div class="create-resource-page">
    <q-card class="create-card">
      <q-card-section class="card-header">
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <h2 class="card-title">Create App</h2>
      </q-card-section>

      <q-separator />

      <q-card-section class="card-content">
        <q-form @submit.prevent="handleSubmit" class="create-form">
          <!-- File Upload -->
          <div class="form-section">
            <label class="form-label"
              >Application File <span class="required">*</span></label
            >
            <ResourceFileUpload
              v-model="formData.file"
              resource-type="app"
              @file-selected="onFileSelected"
            />
          </div>

          <!-- Name -->
          <div class="form-section">
            <label class="form-label"
              >Name <span class="required">*</span></label
            >
            <q-input
              v-model="formData.name"
              outlined
              dense
              placeholder="Enter application name"
              :rules="[(val) => !!val || 'Name is required']"
            />
          </div>

          <!-- Description -->
          <div class="form-section">
            <label class="form-label">Description</label>
            <q-input
              v-model="formData.description"
              outlined
              dense
              type="textarea"
              rows="3"
              placeholder="Enter description (optional)"
            />
          </div>

          <!-- Version -->
          <div class="form-section">
            <label class="form-label"
              >Version <span class="required">*</span></label
            >
            <q-input
              v-model="formData.version"
              outlined
              dense
              placeholder="e.g., 1.0.0"
              :rules="[(val) => !!val || 'Version is required']"
            />
          </div>

          <!-- Platform -->
          <div class="form-section">
            <label class="form-label"
              >Platform <span class="required">*</span></label
            >
            <q-select
              v-model="formData.platform"
              :options="platformOptions"
              outlined
              dense
            />
          </div>

          <!-- Actions -->
          <div v-if="uploading" class="upload-progress-section">
            <q-linear-progress
              :value="uploadProgress / 100"
              color="primary"
              rounded
              size="8px"
            />
            <div class="upload-phase-text">
              {{
                uploadPhase === "hashing"
                  ? "Computing file hash..."
                  : uploadPhase === "uploading"
                    ? `Uploading... ${uploadProgress}%`
                    : uploadPhase === "confirming"
                      ? "Finalizing..."
                      : ""
              }}
            </div>
          </div>

          <div class="form-actions">
            <q-btn flat label="Cancel" @click="goBack" />
            <q-btn
              color="primary"
              label="Create App"
              type="submit"
              :loading="submitting"
              :disable="!isFormValid"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ResourceFileUpload from "../components/ResourceFileUpload.vue";
import { APP_PLATFORMS } from "../types/resources";
import type { AppPlatform } from "../types/resources";
import { useResourceUpload } from "../composables/useResourceUpload";

const router = useRouter();
const $q = useQuasar();

const submitting = ref(false);
const { uploading, uploadProgress, uploadPhase, uploadResource } =
  useResourceUpload();

const formData = ref({
  file: null as File | null,
  name: "",
  description: "",
  version: "",
  platform: "Windows" as AppPlatform,
});
const platformOptions = APP_PLATFORMS;

const isFormValid = computed(() => {
  return (
    formData.value.file &&
    formData.value.name &&
    formData.value.version &&
    formData.value.platform
  );
});

function onFileSelected(file: File) {
  if (!formData.value.name) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    formData.value.name = nameWithoutExt;
  }

  // Auto-detect platform from extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (ext === "dmg" || ext === "pkg") {
    formData.value.platform = "macOS";
  } else if (ext === "deb" || ext === "rpm" || ext === "appimage") {
    formData.value.platform = "Linux";
  } else if (ext === "exe" || ext === "msi") {
    formData.value.platform = "Windows";
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  submitting.value = true;

  try {
    await uploadResource(formData.value.file!, {
      name: formData.value.name,
      resource_type: "app",
      description: formData.value.description,
      version: formData.value.version,
      platform: formData.value.platform,
    });

    $q.notify({
      message: `App "${formData.value.name}" created successfully`,
      color: "positive",
      position: "top",
      icon: "check_circle",
    });

    router.push({ name: "Resources" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create app";
    $q.notify({
      message: msg,
      color: "negative",
      position: "top",
      icon: "error",
    });
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push({ name: "Resources" });
}
</script>

<style scoped>
.create-resource-page {
  min-height: 100%;
  padding: 24px;
  background: var(--page-bg, #f5f7fa);
}

.create-card {
  max-width: 640px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.card-content {
  padding: 24px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.required {
  color: var(--error-color, #ef4444);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.body--dark .create-resource-page {
  --page-bg: #121218;
}

.body--dark .create-card {
  background: #1e1e2d;
}

.body--dark .card-title,
.body--dark .form-label {
  --text-primary: #e4e6eb;
}

.body--dark .form-actions {
  --border-color: #2d2d3a;
}
</style>
