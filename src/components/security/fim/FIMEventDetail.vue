<template>
  <q-dialog :model-value="!!event" @update:model-value="$emit('close')" position="right" maximized>
    <q-card class="event-detail-card">
      <!-- Header -->
      <div class="detail-header">
        <span class="detail-title">Document Details</span>
        <div class="detail-links">
          <q-btn flat dense no-caps size="sm" class="text-primary">
            View surrounding documents
            <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
          </q-btn>
          <q-btn flat dense no-caps size="sm" class="text-primary">
            View single document
            <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
          </q-btn>
        </div>
        <q-btn flat round dense icon="close" size="sm" @click="$emit('close')" />
      </div>

      <!-- Tabs: Table / JSON -->
      <q-tabs v-model="viewTab" dense no-caps inline-label class="detail-tabs">
        <q-tab name="table" label="Table" />
        <q-tab name="json" label="JSON" />
      </q-tabs>

      <!-- Table view -->
      <div v-if="viewTab === 'table'" class="table-view">
        <q-table
          :rows="flattenedFields"
          :columns="fieldColumns"
          row-key="field"
          flat
          dense
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          separator="horizontal"
          class="fields-table"
        >
          <template #body-cell-type="props">
            <q-td :props="props">
              <q-badge :label="props.row.type" :color="props.row.type === 't' ? 'blue-grey' : 'teal'" outline dense />
            </q-td>
          </template>
          <template #body-cell-field="props">
            <q-td :props="props" class="field-name">{{ props.row.field }}</q-td>
          </template>
          <template #body-cell-value="props">
            <q-td :props="props" class="field-value">
              <span v-if="isLink(props.row.value)" class="text-primary cursor-pointer">{{ props.row.value }}</span>
              <span v-else>{{ props.row.value }}</span>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- JSON view -->
      <div v-else class="json-view">
        <div class="json-toolbar">
          <q-btn flat dense no-caps icon="content_copy" label="Copy" size="sm" @click="copyJson" />
        </div>
        <pre class="json-content">{{ formattedJson }}</pre>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Notify } from "quasar";
import type { FIMEvent } from "@/types/fim";

const props = defineProps<{ event: FIMEvent }>();
defineEmits<{ close: [] }>();

const viewTab = ref("table");

const fieldColumns = [
  { name: "type", label: "", field: "type", align: "center" as const, style: "width: 30px" },
  { name: "field", label: "Field", field: "field", align: "left" as const },
  { name: "value", label: "Value", field: "value", align: "left" as const },
];

interface FlatField {
  type: string;
  field: string;
  value: string;
}

const flattenedFields = computed<FlatField[]>(() => {
  const source = props.event._source;
  const result: FlatField[] = [];

  if (props.event._index) {
    result.push({ type: "t", field: "_index", value: props.event._index });
  }

  function flatten(obj: Record<string, unknown>, prefix: string) {
    for (const [key, val] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === "object" && !Array.isArray(val)) {
        flatten(val as Record<string, unknown>, fullKey);
      } else if (Array.isArray(val)) {
        result.push({
          type: typeof val[0] === "number" ? "#" : "t",
          field: fullKey,
          value: val.join(", "),
        });
      } else {
        result.push({
          type: typeof val === "number" ? "#" : "t",
          field: fullKey,
          value: String(val ?? ""),
        });
      }
    }
  }

  flatten(source as unknown as Record<string, unknown>, "");
  return result;
});

const formattedJson = computed(() => {
  return JSON.stringify(props.event._source, null, 2);
});

function isLink(val: string): boolean {
  return /^\d{3}$/.test(val) || val === props.event._source?.agent?.id;
}

function copyJson() {
  navigator.clipboard.writeText(formattedJson.value).then(() => {
    Notify.create({ type: "positive", message: "JSON copied to clipboard", timeout: 1500 });
  });
}
</script>

<style scoped>
.event-detail-card {
  width: 700px;
  max-width: 90vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--mdm-bg-card, #fff);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  position: sticky;
  top: 0;
  background: var(--mdm-bg-card, #fff);
  z-index: 1;
}

.detail-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.detail-links {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.detail-tabs {
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.detail-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 40px;
}

/* Table view */
.table-view {
  flex: 1;
  overflow-y: auto;
}

.fields-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  padding: 6px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
}

.fields-table :deep(.q-table td) {
  font-size: 13px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.field-name {
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  word-break: break-all;
}

.field-value {
  color: var(--mdm-text-primary, #1a1a1a);
  word-break: break-all;
  max-width: 400px;
}

/* JSON view */
.json-view {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.json-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.json-content {
  padding: 16px 20px;
  font-size: 12px;
  font-family: "SF Mono", "Fira Code", monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 0;
}

/* Dark mode */
.body--dark .event-detail-card {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .detail-header {
  background: var(--mdm-bg-card, #111827);
}
</style>
