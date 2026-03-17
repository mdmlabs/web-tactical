<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="create-policy-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Create policy</span>
        <div class="header-right">
          <q-chip dense outline color="grey-7" size="sm" icon="public">
            Global
          </q-chip>
          <q-btn icon="close" flat round dense @click="close" />
        </div>
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <!-- Platform Selection -->
        <div class="form-section">
          <label class="form-label">Platform</label>
          <div class="platform-selector">
            <button
              v-for="platform in platforms"
              :key="platform.id"
              :class="[
                'platform-option',
                { 'platform-option--active': selectedPlatform === platform.id },
                { 'platform-option--disabled': platform.disabled },
              ]"
              :disabled="platform.disabled"
              @click="!platform.disabled && (selectedPlatform = platform.id)"
            >
              <q-icon :name="platform.icon" size="20px" />
              <span>{{ platform.label }}</span>
            </button>
          </div>
        </div>

        <!-- Name Input -->
        <div class="form-section">
          <label class="form-label">Name</label>
          <p class="form-hint">Give a name to this policy</p>
          <q-input
            v-model="policyName"
            outlined
            dense
            placeholder="Enter policy name"
            :rules="[(val) => !!val || 'Name is required']"
            class="name-input"
          />
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          label="Create"
          :disable="!canCreate"
          @click="create"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Platform } from "../../types/policies";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "create", data: { name: string; platform: Platform }): void;
}>();

const policyName = ref("");
const selectedPlatform = ref<Platform>("windows");

const platforms = [
  {
    id: "apple" as Platform,
    label: "Apple",
    icon: "mdi-apple",
    disabled: true,
  },
  {
    id: "android" as Platform,
    label: "Android",
    icon: "mdi-android",
    disabled: true,
  },
  {
    id: "windows" as Platform,
    label: "Windows",
    icon: "mdi-microsoft-windows",
    disabled: false,
  },
];

const canCreate = computed(() => policyName.value.trim().length > 0);

// Reset form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      policyName.value = "";
      selectedPlatform.value = "windows";
    }
  },
);

function close() {
  emit("update:modelValue", false);
}

function create() {
  if (canCreate.value) {
    emit("create", {
      name: policyName.value.trim(),
      platform: selectedPlatform.value,
    });
    close();
  }
}
</script>

<style scoped>
.create-policy-dialog {
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

.dialog-content {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin-bottom: 4px;
}

.form-hint {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 12px 0;
}

.platform-selector {
  display: flex;
  gap: 0;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}

.platform-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--option-bg, #ffffff);
  border: none;
  border-right: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.platform-option:last-child {
  border-right: none;
}

.platform-option:hover:not(.platform-option--disabled) {
  background: var(--hover-bg, #f5f7fa);
}

.platform-option--active {
  background: var(--active-bg, #3b82f6) !important;
  color: white !important;
}

.platform-option--active :deep(.q-icon) {
  color: white !important;
}

.platform-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--disabled-bg, #f9fafb);
}

.name-input {
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
.body--dark .create-policy-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
  --option-bg: #1e1e2d;
  --hover-bg: #2a2a3d;
  --disabled-bg: #1a1a2a;
}
</style>
