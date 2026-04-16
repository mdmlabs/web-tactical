<template>
  <div class="doc-fields">
    <q-tabs v-model="viewTab" dense no-caps inline-label class="doc-fields-tabs">
      <q-tab name="table" label="Table" />
      <q-tab name="json" label="JSON" />
    </q-tabs>

    <div v-if="viewTab === 'table'" class="doc-fields-table-wrap">
      <table class="doc-fields-table">
        <thead>
          <tr>
            <th style="width: 30px"></th>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="index">
            <td class="type-col"><q-badge label="t" color="blue-grey" outline dense /></td>
            <td class="field-col">_index</td>
            <td class="value-col">{{ index }}</td>
          </tr>
          <tr v-for="row in flattenedFields" :key="row.field">
            <td class="type-col">
              <q-badge :label="row.type" :color="row.type === 't' ? 'blue-grey' : 'teal'" outline dense />
            </td>
            <td class="field-col">{{ row.field }}</td>
            <td class="value-col">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="doc-fields-json">
      <pre>{{ JSON.stringify(source, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  source: Record<string, unknown>;
  index?: string;
}>();

const viewTab = ref("table");

interface FlatField {
  type: string;
  field: string;
  value: string;
}

const flattenedFields = computed<FlatField[]>(() => {
  const result: FlatField[] = [];

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

  flatten(props.source, "");
  return result;
});
</script>

<style scoped>
.doc-fields {
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: var(--mdm-radius, 6px);
  overflow: hidden;
  background: var(--mdm-bg-card, #fff);
}

.doc-fields-tabs {
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.doc-fields-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 32px;
  font-size: 12px;
}

.doc-fields-table-wrap {
  max-height: 400px;
  overflow-y: auto;
}

.doc-fields-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.doc-fields-table th {
  text-align: left;
  padding: 4px 8px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  position: sticky;
  top: 0;
}

.doc-fields-table td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.type-col {
  text-align: center;
  width: 30px;
}

.field-col {
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  white-space: nowrap;
}

.value-col {
  color: var(--mdm-text-primary, #1a1a1a);
  word-break: break-all;
}

.doc-fields-json {
  max-height: 400px;
  overflow-y: auto;
}

.doc-fields-json pre {
  margin: 0;
  padding: 12px;
  font-size: 11px;
  font-family: "SF Mono", "Fira Code", monospace;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Dark mode */
.body--dark .doc-fields {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .doc-fields-table th {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .field-col,
.body--dark .value-col {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
