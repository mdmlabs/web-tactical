<template>
  <div class="create-resource-page">
    <q-card class="create-card">
      <q-card-section class="card-header">
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <h2 class="card-title">Create Script</h2>
      </q-card-section>

      <q-separator />

      <q-card-section class="card-content">
        <q-form @submit.prevent="handleSubmit" class="create-form">
          <!-- File Upload -->
          <div class="form-section">
            <label class="form-label"
              >Script File <span class="required">*</span></label
            >
            <ResourceFileUpload
              v-model="formData.file"
              resource-type="script"
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
              placeholder="Enter script name"
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

          <!-- Language -->
          <div class="form-section">
            <label class="form-label"
              >Language <span class="required">*</span></label
            >
            <q-select
              v-model="formData.language"
              :options="languageOptions"
              outlined
              dense
            />
            <div class="form-hint">
              Auto-detected from file extension when available
            </div>
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
              label="Create Script"
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
import {
  SCRIPT_LANGUAGES,
  SCRIPT_EXTENSIONS,
} from "../types/resources";
import type { ScriptLanguage } from "../types/resources";
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
  language: "PowerShell" as ScriptLanguage,
});
const languageOptions = SCRIPT_LANGUAGES;

const isFormValid = computed(() => {
  return (
    formData.value.file &&
    formData.value.name &&
    formData.value.language
  );
});

function onFileSelected(file: File) {
  // Auto-fill name from filename
  if (!formData.value.name) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    formData.value.name = nameWithoutExt;
  }

  // Auto-detect language from extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (SCRIPT_EXTENSIONS[ext]) {
    formData.value.language = SCRIPT_EXTENSIONS[ext];
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  submitting.value = true;

  try {
    await uploadResource(formData.value.file!, {
      name: formData.value.name,
      resource_type: "script",
      description: formData.value.description,
      language: formData.value.language,
    });

    $q.notify({
      message: `Script "${formData.value.name}" created successfully`,
      color: "positive",
      position: "top",
      icon: "check_circle",
    });

    router.push({ name: "Resources" });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to create script";
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

.form-hint {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

/* Dark theme */
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

.body--dark .form-hint {
  --text-secondary: #9ca3af;
}

.body--dark .form-actions {
  --border-color: #2d2d3a;
}
</style>
