<template>
  <div>
    <!-- No results message -->
    <div v-if="!loading && hits.length === 0" class="no-results q-pa-lg text-center">
      <q-icon name="search_off" size="48px" color="grey-5" class="q-mb-sm" />
      <div class="text-h6 text-grey-7">0 hits</div>
      <div class="text-body2 text-grey-6">
        No events found for the selected time range and query. Try adjusting
        your search criteria or expanding the time range.
      </div>
    </div>

    <!-- Results table -->
    <q-table
      v-else
      :rows="tableRows"
      :columns="tableColumns"
      row-key="_id"
      flat
      dense
      :loading="loading"
      :pagination="tablePagination"
      class="discover-table"
      separator="horizontal"
      hide-pagination
    >
      <template #body="props">
        <q-tr :props="props" class="cursor-pointer" @click="props.expand = !props.expand">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === '_expand'">
              <q-icon :name="props.expand ? 'expand_less' : 'expand_more'" size="sm" />
            </template>
            <template v-else-if="col.name === 'rule.level'">
              <q-badge :color="levelColor(col.value)" :label="String(col.value ?? '')" />
            </template>
            <template v-else-if="col.name === '@timestamp'">
              <span class="text-caption">{{ formatTimestamp(col.value) }}</span>
            </template>
            <template v-else-if="Array.isArray(col.value)">
              <q-chip
                v-for="(item, idx) in col.value.slice(0, 3)"
                :key="idx"
                dense
                size="sm"
                color="blue-grey-2"
                text-color="blue-grey-9"
                :label="String(item)"
                class="q-mr-xs"
              />
              <span v-if="col.value.length > 3" class="text-caption text-grey">
                +{{ col.value.length - 3 }}
              </span>
            </template>
            <template v-else>
              {{ col.value ?? '---' }}
            </template>
          </q-td>
        </q-tr>
        <!-- Expanded row: full _source JSON -->
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%" class="expanded-row">
            <div class="expanded-content">
              <div class="row q-col-gutter-md">
                <div
                  v-for="(value, key) in flattenSource(props.row._source)"
                  :key="key"
                  class="col-12 col-md-6"
                >
                  <div class="expanded-field">
                    <span class="field-key">{{ key }}:</span>
                    <span>{{ formatValue(value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Pagination -->
    <div v-if="hits.length > 0" class="row items-center justify-between q-pa-sm pagination-bar">
      <span class="text-caption text-grey-7">
        Showing {{ rangeStart }}&#8211;{{ rangeEnd }} of {{ total.toLocaleString() }} hits
      </span>
      <q-pagination
        :model-value="page"
        :max="totalPages"
        :max-pages="7"
        direction-links
        boundary-links
        color="primary"
        size="sm"
        @update:model-value="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { DiscoverHit } from "@/stores/discover";

const props = defineProps<{
  hits: DiscoverHit[];
  selectedFields: string[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
}>();

defineEmits<{
  (e: "update:page", page: number): void;
}>();

const tablePagination = ref({ rowsPerPage: 0 }); // disable built-in pagination

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.rowsPerPage)),
);
const rangeStart = computed(() =>
  props.total === 0 ? 0 : (props.page - 1) * props.rowsPerPage + 1,
);
const rangeEnd = computed(() =>
  Math.min(props.page * props.rowsPerPage, props.total),
);

/** Build dynamic columns from selected fields */
const tableColumns = computed(() => {
  const cols = [
    { name: "_expand", label: "", field: "", style: "width: 40px" },
  ];
  for (const f of props.selectedFields) {
    cols.push({
      name: f,
      label: fieldLabel(f),
      field: f,
      style: f === "@timestamp" ? "width: 180px" : "",
    });
  }
  return cols;
});

/** Build table rows by extracting nested fields from _source */
const tableRows = computed(() =>
  props.hits.map((hit) => {
    const row: Record<string, unknown> = { _id: hit._id, _source: hit._source };
    for (const f of props.selectedFields) {
      row[f] = getNestedValue(hit._source, f);
    }
    return row;
  }),
);

/** Resolve a dotted field path from a nested object */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Human-readable column header from field path */
function fieldLabel(field: string): string {
  const map: Record<string, string> = {
    "@timestamp": "Timestamp",
    "rule.level": "Level",
    "rule.id": "Rule ID",
    "rule.description": "Description",
    "rule.groups": "Groups",
    "rule.mitre.tactic": "MITRE Tactic",
    "rule.mitre.technique": "MITRE Technique",
    "agent.id": "Agent ID",
    "agent.name": "Agent",
    "agent.ip": "Agent IP",
    "manager.name": "Manager",
    "decoder.name": "Decoder",
    "location": "Location",
  };
  return map[field] ?? field;
}

function levelColor(level: unknown): string {
  const n = Number(level);
  if (isNaN(n)) return "grey";
  if (n >= 12) return "red";
  if (n >= 10) return "deep-orange";
  if (n >= 7) return "orange";
  if (n >= 4) return "blue";
  return "grey";
}

function formatTimestamp(val: unknown): string {
  if (!val) return "---";
  try {
    const d = new Date(String(val));
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return String(val);
  }
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "---";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

/** Flatten nested _source object into dot-notation key/value pairs */
function flattenSource(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenSource(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}
</script>

<style scoped>
.discover-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.discover-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 8px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.expanded-row {
  background: var(--mdm-bg-sidebar, #fafafa);
  padding: 16px !important;
}

.expanded-content {
  font-size: 13px;
}

.expanded-field {
  margin-bottom: 6px;
  word-break: break-all;
}

.field-key {
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  margin-right: 6px;
}

.no-results {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pagination-bar {
  border-top: 1px solid var(--mdm-border-light, #f0f0f0);
  background: var(--mdm-bg-sidebar, #fafafa);
}
</style>
