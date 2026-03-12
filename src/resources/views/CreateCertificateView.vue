<template>
  <div class="create-resource-page">
    <q-card class="create-card">
      <q-card-section class="card-header">
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <h2 class="card-title">Upload Certificate</h2>
      </q-card-section>

      <q-separator />

      <q-card-section class="card-content">
        <q-form @submit.prevent="handleSubmit" class="create-form">
          <!-- File Upload -->
          <div class="form-section">
            <label class="form-label">Certificate File <span class="required">*</span></label>
            <ResourceFileUpload
              v-model="formData.file"
              resource-type="certificate"
              @file-selected="onFileSelected"
            />
          </div>

          <!-- Name -->
          <div class="form-section">
            <label class="form-label">Name <span class="required">*</span></label>
            <q-input
              v-model="formData.name"
              outlined
              dense
              placeholder="Enter certificate name"
              :rules="[val => !!val || 'Name is required']"
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

          <!-- Segment -->
          <div class="form-section">
            <label class="form-label">Segment <span class="required">*</span></label>
            <q-select
              v-model="formData.segment"
              :options="segmentOptions"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <!-- Password -->
          <div class="form-section">
            <label class="form-label">Password</label>
            <q-input
              v-model="formData.password"
              outlined
              dense
              :type="showPassword ? 'text' : 'password'"
              placeholder="Certificate password (if protected)"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            <div class="form-hint">Required for password-protected certificates (P12, PFX)</div>
          </div>

          <!-- Issued To -->
          <div class="form-section">
            <label class="form-label">Issued To <span class="required">*</span></label>
            <q-input
              v-model="formData.issuedTo"
              outlined
              dense
              placeholder="e.g., *.company.com or Internal Services"
              :rules="[val => !!val || 'Issued To is required']"
            />
          </div>

          <!-- Expiry Date -->
          <div class="form-section">
            <label class="form-label">Expiry Date <span class="required">*</span></label>
            <q-input
              v-model="formData.expiryDate"
              outlined
              dense
              type="date"
              :rules="[val => !!val || 'Expiry date is required']"
            />
          </div>

          <!-- Actions -->
          <div v-if="uploading" class="upload-progress-section">
            <q-linear-progress :value="uploadProgress / 100" color="primary" rounded size="8px" />
            <div class="upload-phase-text">
              {{ uploadPhase === 'hashing' ? 'Computing file hash...' : uploadPhase === 'uploading' ? `Uploading... ${uploadProgress}%` : uploadPhase === 'confirming' ? 'Finalizing...' : '' }}
            </div>
          </div>

          <div class="form-actions">
            <q-btn flat label="Cancel" @click="goBack" />
            <q-btn
              color="primary"
              label="Upload Certificate"
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import ResourceFileUpload from '../components/ResourceFileUpload.vue';
import { SEGMENTS } from '../types/resources';
import { useResourceUpload } from '../composables/useResourceUpload';

const router = useRouter();
const $q = useQuasar();

const submitting = ref(false);
const showPassword = ref(false);
const { uploading, uploadProgress, uploadPhase, uploadResource } = useResourceUpload();

const formData = ref({
  file: null as File | null,
  name: '',
  description: '',
  segment: 'Global',
  password: '',
  issuedTo: '',
  expiryDate: '',
});

const segmentOptions = SEGMENTS.map(s => ({ label: s, value: s }));

const isFormValid = computed(() => {
  return formData.value.file && formData.value.name && formData.value.segment && 
         formData.value.issuedTo && formData.value.expiryDate;
});

function onFileSelected(file: File) {
  if (!formData.value.name) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    formData.value.name = nameWithoutExt;
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  submitting.value = true;

  try {
    await uploadResource(formData.value.file!, {
      name: formData.value.name,
      resource_type: 'certificate',
      segment: formData.value.segment,
      description: formData.value.description,
      issued_to: formData.value.issuedTo,
      expiry_date: formData.value.expiryDate,
      password: formData.value.password || undefined,
    });

    $q.notify({
      message: `Certificate "${formData.value.name}" uploaded successfully`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    });

    router.push({ name: 'Resources' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to upload certificate';
    $q.notify({
      message: msg,
      color: 'negative',
      position: 'top',
      icon: 'error',
    });
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push({ name: 'Resources' });
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
