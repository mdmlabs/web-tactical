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
          <q-chip dense outline color="grey-7" size="sm" icon="public">
            Global
          </q-chip>
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
        <div class="resource-selection">
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
          />
        </div>

        <q-separator class="q-my-lg" />

        <!-- Scope Selection -->
        <div class="scope-section">
          <label class="section-label">Scope</label>
          <q-btn-toggle
            v-model="scope"
            toggle-color="primary"
            :options="scopeOptions"
            unelevated
            class="scope-toggle"
          />
        </div>

        <q-separator class="q-my-lg" />

        <!-- Location -->
        <div class="location-section">
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
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          label="Save"
          :disable="!canAdd"
          @click="addResource"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { PolicyResource, ResourceType, Scope } from "../../types/policies";
import {
  mockBookResources,
  mockImageResources,
  mockCertificateResources,
} from "../../mocks/policiesMockData";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "add", resource: PolicyResource): void;
}>();

// Form state
const resourceType = ref<ResourceType>("book");
const selectedResource = ref<string | null>(null);
const scope = ref<Scope>("primary_user");
const location = ref("");

const scopeOptions = [
  { value: "primary_user", label: "Primary user" },
  { value: "all_users", label: "All users" },
  { value: "system", label: "System" },
];

const typeDescriptions: Record<ResourceType, string> = {
  book: "Select or upload your own PDF or EPUB resources",
  certificate: "Select or upload your own certificate files",
  image: "Select or upload your own image resources",
};

const typeDescription = computed(() => typeDescriptions[resourceType.value]);

const currentResources = computed(() => {
  switch (resourceType.value) {
    case "book":
      return mockBookResources;
    case "certificate":
      return mockCertificateResources;
    case "image":
      return mockImageResources;
    default:
      return [];
  }
});

const selectedResourceData = computed(() =>
  currentResources.value.find((r) => r.id === selectedResource.value),
);

const canAdd = computed(() => selectedResource.value !== null);

// Reset resource selection when type changes
watch(resourceType, () => {
  selectedResource.value = null;
});

// Reset form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);

function resetForm() {
  resourceType.value = "book";
  selectedResource.value = null;
  scope.value = "primary_user";
  location.value = "";
}

function close() {
  emit("update:modelValue", false);
}

function addResource() {
  if (!canAdd.value || !selectedResourceData.value) return;

  const resource: PolicyResource = {
    id: `resource-${Date.now()}`,
    resourceId: selectedResource.value!,
    name: selectedResourceData.value.name,
    type: resourceType.value,
    scope: scope.value,
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

.scope-section,
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

.scope-toggle {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
}

.scope-toggle :deep(.q-btn) {
  text-transform: none;
  font-weight: 500;
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
