<template>
  <div class="fields-sidebar">
    <div class="sidebar-header">
      <q-icon name="filter_list" size="16px" class="q-mr-xs" />
      <span class="sidebar-title">Selected fields</span>
    </div>
    <div v-if="selectedFields.length" class="field-list">
      <div
        v-for="field in selectedFields"
        :key="field"
        class="field-item field-selected"
      >
        <span>{{ field }}</span>
      </div>
    </div>
    <div v-else class="text-caption text-grey q-pa-sm">No fields selected</div>

    <q-separator class="q-my-sm" />

    <div class="sidebar-header">
      <span class="sidebar-title">Available fields</span>
    </div>
    <q-input
      v-model="fieldSearch"
      dense
      outlined
      placeholder="Filter fields"
      class="q-mb-xs q-px-xs"
      clearable
      size="sm"
    />
    <div class="field-list">
      <div
        v-for="field in filteredAvailableFields"
        :key="field.name"
        class="field-item"
        @click="$emit('toggle-field', field.name)"
      >
        <q-icon :name="field.icon" size="14px" class="q-mr-xs field-type-icon" />
        <span>{{ field.name }}</span>
        <q-badge
          v-if="field.count"
          :label="String(field.count)"
          color="grey-4"
          text-color="grey-8"
          class="q-ml-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { WazuhRule } from "@/types/wazuh";

const props = defineProps<{
  rules: WazuhRule[];
  selectedFields: string[];
}>();

defineEmits<{
  (e: "toggle-field", field: string): void;
}>();

const fieldSearch = ref("");

const availableFields = computed(() => {
  const fields = [
    { name: "level", icon: "tag", count: props.rules.length },
    { name: "id", icon: "tag", count: props.rules.length },
    { name: "description", icon: "text_fields", count: props.rules.length },
    { name: "groups", icon: "folder", count: props.rules.filter((r) => r.groups?.length).length },
    { name: "mitre.tactic", icon: "security", count: props.rules.filter((r) => r.mitre?.tactic?.length).length },
    { name: "mitre.technique", icon: "security", count: props.rules.filter((r) => r.mitre?.technique?.length).length },
    { name: "pci_dss", icon: "verified_user", count: props.rules.filter((r) => r.pci_dss?.length).length },
    { name: "gdpr", icon: "verified_user", count: props.rules.filter((r) => r.gdpr?.length).length },
    { name: "filename", icon: "insert_drive_file", count: props.rules.filter((r) => r.filename).length },
    { name: "status", icon: "circle", count: props.rules.length },
  ];
  return fields;
});

const filteredAvailableFields = computed(() => {
  if (!fieldSearch.value) return availableFields.value;
  const q = fieldSearch.value.toLowerCase();
  return availableFields.value.filter((f) => f.name.includes(q));
});
</script>

<style scoped>
.fields-sidebar {
  border-right: 1px solid var(--mdm-border-light, #f0f0f0);
  height: 100%;
  overflow-y: auto;
  font-size: 13px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sidebar-title {
  color: var(--mdm-text-secondary, #666);
}

.field-list {
  max-height: 400px;
  overflow-y: auto;
}

.field-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: var(--mdm-radius-sm, 4px);
  transition: background 0.15s;
}

.field-item:hover {
  background: rgba(37, 99, 235, 0.04);
}

.field-selected {
  background: rgba(37, 99, 235, 0.08);
  font-weight: 500;
}

.field-type-icon {
  color: var(--mdm-text-muted, #999);
}
</style>
