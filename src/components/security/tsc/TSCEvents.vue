<template>
  <div class="tsc-events">
    <!-- Top bar with filters -->
    <div class="tsc-events-toolbar">
      <div class="tsc-events-filters">
        <!-- Default filter chips -->
        <q-chip
          size="sm"
          color="grey-3"
          text-color="grey-8"
          class="tsc-filter-chip"
        >
          manager.name: wazuh.manager
        </q-chip>
        <q-chip
          size="sm"
          color="grey-3"
          text-color="grey-8"
          class="tsc-filter-chip"
        >
          rule.tsc: exists
        </q-chip>
        <q-chip
          v-if="store.selectedAgent"
          size="sm"
          color="blue-2"
          text-color="blue-9"
          class="tsc-filter-chip"
        >
          agent.id: {{ store.selectedAgent.id }}
        </q-chip>
        <!-- User-added filters -->
        <q-chip
          v-for="filter in store.eventsFilters"
          :key="filter.id"
          removable
          size="sm"
          :color="filter.enabled ? 'primary' : 'grey-4'"
          :text-color="filter.enabled ? 'white' : 'grey-8'"
          class="tsc-filter-chip"
          @remove="store.removeFilter(filter.id)"
        >
          {{ filter.field }} {{ filter.operator }} {{ filter.value ?? '' }}
        </q-chip>

        <!-- Add filter button -->
        <q-btn flat dense no-caps size="sm" icon="add" label="Add filter" class="q-ml-xs">
          <q-popup-proxy>
            <q-card class="tsc-add-filter-card">
              <q-card-section class="q-pa-sm">
                <q-select
                  v-model="newFilterField"
                  :options="filterFieldOptions"
                  dense
                  outlined
                  label="Field"
                  class="q-mb-xs"
                />
                <q-select
                  v-model="newFilterOp"
                  :options="['is', 'is_not', 'exists', 'does_not_exist']"
                  dense
                  outlined
                  label="Operator"
                  class="q-mb-xs"
                />
                <q-input
                  v-if="newFilterOp === 'is' || newFilterOp === 'is_not'"
                  v-model="newFilterValue"
                  dense
                  outlined
                  label="Value"
                  class="q-mb-xs"
                />
                <q-btn
                  dense
                  no-caps
                  color="primary"
                  label="Apply"
                  class="full-width"
                  @click="applyFilter"
                />
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>

        <q-btn
          v-if="store.eventsFilters.length"
          flat
          dense
          no-caps
          label="Clear all"
          color="negative"
          size="sm"
          @click="store.clearFilters()"
        />
      </div>
      <q-input
        :model-value="store.eventsSearch"
        dense
        outlined
        placeholder="Search events..."
        clearable
        class="tsc-events-search"
        @update:model-value="onSearch"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Histogram -->
    <div class="tsc-events-histogram">
      <div v-if="store.eventsHistogramLoading" class="tsc-histogram-loading">
        <q-spinner-dots color="primary" size="24px" />
      </div>
      <apexchart
        v-else-if="histogramData.length"
        type="bar"
        height="120"
        :options="histogramOptions"
        :series="histogramSeries"
      />
      <div class="tsc-histogram-label">
        timestamp per 30 minutes
      </div>
    </div>

    <!-- Results info -->
    <div class="tsc-events-info">
      <span class="tsc-events-count">
        {{ store.eventsTotal.toLocaleString() }} hits
      </span>
      <span v-if="timeRange" class="tsc-events-time-range">
        {{ timeRange }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="store.eventsLoading" class="tsc-center">
      <q-spinner-dots color="primary" size="36px" />
    </div>

    <!-- Events table -->
    <div v-else class="tsc-events-table-wrap">
      <q-table
        :rows="tableRows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        dense
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
        class="tsc-events-table"
        @row-click="onRowClick"
      >
        <template #body-cell-timestamp="props">
          <q-td :props="props">
            <span class="tsc-ts">{{ formatTimestamp(props.row.timestamp) }}</span>
          </q-td>
        </template>
        <template #body-cell-tsc="props">
          <q-td :props="props">
            <q-badge
              v-for="criteria in normalizeArray(props.row.tsc)"
              :key="criteria"
              color="blue-2"
              text-color="blue-9"
              :label="criteria"
              class="q-mr-xs"
            />
          </q-td>
        </template>
        <template #body-cell-level="props">
          <q-td :props="props">
            <q-badge
              :color="levelColor(props.row.level)"
              :label="String(props.row.level)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Pagination -->
      <div class="tsc-events-pagination">
        <q-select
          :model-value="store.eventsPagination.rowsPerPage"
          :options="[10, 20, 50, 100]"
          dense
          outlined
          prefix="Rows:"
          class="tsc-rpp-select"
          @update:model-value="(v: number) => store.setEventsRowsPerPage(v)"
        />
        <q-pagination
          :model-value="store.eventsPagination.page"
          :max="Math.ceil(store.eventsTotal / store.eventsPagination.rowsPerPage) || 1"
          :max-pages="7"
          direction-links
          boundary-links
          @update:model-value="(v: number) => store.setEventsPage(v)"
        />
      </div>
    </div>

    <!-- Document detail drawer -->
    <TSCDocumentDrawer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useTscStore } from "@/stores/tsc";
import { TSC_KNOWN_FIELDS } from "@/types/tsc";
import type { TSCEvent } from "@/types/tsc";
import TSCDocumentDrawer from "./TSCDocumentDrawer.vue";

const apexchart = VueApexCharts;

const store = useTscStore();

// Filter form state
const newFilterField = ref("");
const newFilterOp = ref("is");
const newFilterValue = ref("");
const filterFieldOptions = TSC_KNOWN_FIELDS;

function applyFilter() {
  if (!newFilterField.value) return;
  store.addFilter({
    field: newFilterField.value,
    operator: newFilterOp.value as "is" | "is_not" | "exists" | "does_not_exist",
    value: newFilterValue.value || undefined,
    enabled: true,
    negated: false,
  });
  newFilterField.value = "";
  newFilterOp.value = "is";
  newFilterValue.value = "";
}

const columns = [
  { name: "timestamp", label: "Time", field: "timestamp", align: "left" as const, sortable: true },
  { name: "agent_name", label: "name", field: "agent_name", align: "left" as const },
  { name: "tsc", label: "rule.tsc", field: "tsc", align: "left" as const },
  { name: "description", label: "rule.description", field: "description", align: "left" as const },
  { name: "level", label: "rule.level", field: "level", align: "center" as const },
  { name: "rule_id", label: "rule.id", field: "rule_id", align: "center" as const },
];

interface TableRow {
  _id: string;
  timestamp: string;
  agent_name: string;
  tsc: string | string[];
  description: string;
  level: number;
  rule_id: string;
  _event: TSCEvent;
}

const tableRows = computed<TableRow[]>(() =>
  store.events.map((e) => {
    const src = e._source as Record<string, unknown>;
    const rule = src.rule as Record<string, unknown> | undefined;
    const agent = src.agent as Record<string, unknown> | undefined;
    return {
      _id: e._id,
      timestamp: (src["@timestamp"] as string) ?? (src["timestamp"] as string) ?? "",
      agent_name: (agent?.name as string) ?? "",
      tsc: (rule?.tsc as string | string[]) ?? "",
      description: (rule?.description as string) ?? "",
      level: (rule?.level as number) ?? 0,
      rule_id: String(rule?.id ?? ""),
      _event: e,
    };
  }),
);

const histogramData = computed(() => store.eventsHistogramData);

// Time range display
const timeRange = computed(() => {
  if (!tableRows.value.length) return "";
  const timestamps = tableRows.value.map((r) => r.timestamp).filter(Boolean);
  if (timestamps.length < 2) return "";
  const sorted = timestamps.sort();
  return `${formatTimestamp(sorted[0])} - ${formatTimestamp(sorted[sorted.length - 1])}`;
});

// Histogram chart
const histogramOptions = computed(() => ({
  chart: {
    type: "bar" as const,
    toolbar: { show: false },
    fontFamily: "inherit",
    sparkline: { enabled: false },
  },
  plotOptions: {
    bar: { columnWidth: "90%", borderRadius: 1 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    type: "datetime" as const,
    labels: {
      datetimeUTC: false,
      style: { fontSize: "9px" },
      datetimeFormatter: { hour: "HH:mm" },
    },
  },
  yaxis: { show: true, labels: { style: { fontSize: "10px" } } },
  colors: ["#16a34a"],
  tooltip: {
    x: { format: "MMM dd, HH:mm" },
    y: { formatter: (val: number) => val.toLocaleString() },
  },
  grid: { padding: { left: 8, right: 8 } },
}));

const histogramSeries = computed(() => [
  {
    name: "Events",
    data: histogramData.value.map((b) => ({
      x: b.key,
      y: b.doc_count,
    })),
  },
]);

function normalizeArray(val: string | string[]): string[] {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (val) return [val];
  return [];
}

function formatTimestamp(ts: string): string {
  if (!ts) return "-";
  try {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " @ " +
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
      })
    );
  } catch {
    return ts;
  }
}

function levelColor(level: number): string {
  if (level >= 12) return "red";
  if (level >= 7) return "orange";
  if (level >= 4) return "amber";
  return "grey";
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function onSearch(val: string | number | null) {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.setEventsSearch(String(val ?? ""));
  }, 400);
}

function onRowClick(_evt: Event, row: TableRow) {
  store.inspectDocument(row._event);
}
</script>

<style scoped>
.tsc-events {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.tsc-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.tsc-events-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  gap: 12px;
  flex-wrap: wrap;
}

.tsc-events-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.tsc-filter-chip {
  font-size: 12px;
}

.tsc-events-search {
  min-width: 240px;
  max-width: 320px;
}

.tsc-add-filter-card {
  min-width: 280px;
}

/* Histogram */
.tsc-events-histogram {
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.tsc-histogram-loading {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.tsc-histogram-label {
  text-align: center;
  font-size: 11px;
  color: var(--mdm-text-secondary, #888);
  margin-top: 2px;
}

/* Info bar */
.tsc-events-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.tsc-events-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.tsc-events-time-range {
  font-size: 11px;
  color: var(--mdm-text-secondary, #888);
}

/* Table */
.tsc-events-table-wrap {
  flex: 1;
  padding: 0 16px 16px;
}

.tsc-events-table {
  margin-top: 8px;
}

.tsc-events-table :deep(.q-table__top) {
  padding: 0;
}

.tsc-events-table :deep(tbody tr) {
  cursor: pointer;
}

.tsc-events-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.04);
}

.tsc-ts {
  font-size: 12px;
  font-family: monospace;
  white-space: nowrap;
}

/* Pagination */
.tsc-events-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 12px 0;
}

.tsc-rpp-select {
  max-width: 120px;
}

/* Dark mode */
.body--dark .tsc-events-toolbar,
.body--dark .tsc-events-histogram,
.body--dark .tsc-events-info {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .tsc-events-count {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
