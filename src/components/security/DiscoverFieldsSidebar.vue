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
        @click="$emit('toggle-field', field)"
      >
        <q-icon name="check" size="14px" color="primary" class="q-mr-xs" />
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
          v-if="field.count > 0"
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
import { DISCOVER_KNOWN_FIELDS, type DiscoverHit } from "@/stores/discover";

const props = defineProps<{
  hits: DiscoverHit[];
  selectedFields: string[];
}>();

defineEmits<{
  (e: "toggle-field", field: string): void;
}>();

const fieldSearch = ref("");

/** Get all field paths present in current hits, merged with known fields */
const availableFields = computed(() => {
  // Count occurrences of each field in current results
  const fieldCounts = new Map<string, number>();

  // Always include known fields
  for (const f of DISCOVER_KNOWN_FIELDS) {
    fieldCounts.set(f, 0);
  }

  // Walk current hits to discover fields and count them
  for (const hit of props.hits) {
    const flat = flattenObject(hit._source);
    for (const key of Object.keys(flat)) {
      fieldCounts.set(key, (fieldCounts.get(key) ?? 0) + 1);
    }
  }

  // Remove already-selected fields from available list
  const selectedSet = new Set(props.selectedFields);

  return [...fieldCounts.entries()]
    .filter(([name]) => !selectedSet.has(name))
    .sort((a, b) => {
      // Sort fields with hits first, then alphabetically
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .map(([name, count]) => ({
      name,
      count,
      icon: fieldIcon(name),
    }));
});

const filteredAvailableFields = computed(() => {
  if (!fieldSearch.value) return availableFields.value;
  const q = fieldSearch.value.toLowerCase();
  return availableFields.value.filter((f) => f.name.toLowerCase().includes(q));
});

function fieldIcon(name: string): string {
  if (name.includes("timestamp") || name === "@timestamp") return "schedule";
  if (name.startsWith("rule.")) return "gavel";
  if (name.startsWith("agent.")) return "devices";
  if (name.startsWith("manager.")) return "dns";
  if (name.startsWith("syscheck.")) return "folder_open";
  if (name.includes("mitre")) return "security";
  if (name.includes("pci") || name.includes("gdpr") || name.includes("hipaa") || name.includes("nist")) return "verified_user";
  return "tag";
}

/** Flatten a nested object into dot-notation keys */
function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}
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
