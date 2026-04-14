<template>
  <div class="fim-events">
    <FIMFilterBar @refresh="fimStore.fetchEvents()" />

    <!-- Indexer unavailable banner -->
    <q-banner v-if="!fimStore.indexerAvailable" class="bg-warning text-dark q-mx-md q-mt-md" rounded>
      <template #avatar><q-icon name="warning" color="dark" /></template>
      Wazuh Indexer is currently unavailable. Events data cannot be loaded.
      <template #action>
        <q-btn flat label="Retry" @click="fimStore.fetchEvents()" />
      </template>
    </q-banner>

    <!-- Sample data banner -->
    <q-banner class="sample-banner q-mx-md q-mt-md" rounded>
      <template #avatar><q-icon name="warning_amber" /></template>
      <span class="text-weight-bold">This dashboard contains sample data</span>
      <br />
      The data displayed may contain sample data.
    </q-banner>

    <!-- Events timeline chart -->
    <div class="timeline-section q-mx-md q-mt-md">
      <q-card flat bordered class="timeline-card">
        <div class="timeline-chart-wrap">
          <apexchart
            v-if="timelineSeries.length && timelineSeries[0].data.length"
            type="bar"
            height="150"
            :options="timelineOptions"
            :series="timelineSeries"
          />
          <div v-else class="chart-empty">
            <q-spinner-dots v-if="fimStore.eventsLoading" size="30px" color="primary" />
            <span v-else>No timeline data</span>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Hits count -->
    <div class="hits-row q-mx-md q-mt-sm">
      <span class="hits-count">{{ fimStore.eventsTotal }} hits</span>
      <span class="hits-range">
        {{ fimStore.dateRangeQuery.from ? formatDate(fimStore.dateRangeQuery.from) : '' }}
        -
        {{ fimStore.dateRangeQuery.to ? formatDate(fimStore.dateRangeQuery.to) : '' }}
      </span>
    </div>

    <!-- Table toolbar -->
    <div class="table-toolbar q-mx-md q-mt-sm">
      <q-btn flat dense no-caps icon="download" label="Export Formatted" class="toolbar-btn" @click="exportCsv" />
      <q-btn flat dense no-caps icon="restart_alt" label="Reset view" class="toolbar-btn" />
      <span class="text-caption text-grey q-ml-sm">{{ availableFieldsCount }} available fields</span>

      <!-- Column visibility -->
      <q-btn-dropdown flat dense no-caps label="Columns" class="toolbar-btn q-ml-sm">
        <q-list dense style="min-width: 220px">
          <q-item v-for="col in allColumns" :key="col.name" dense>
            <q-item-section>
              <q-checkbox
                :model-value="visibleColumns.includes(col.name)"
                :label="col.label"
                dense
                @update:model-value="toggleColumn(col.name)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown flat dense no-caps label="Density" class="toolbar-btn">
        <q-list dense style="min-width: 140px">
          <q-item clickable v-close-popup @click="density = 'compact'">
            <q-item-section>Compact</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="density = 'normal'">
            <q-item-section>Normal</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="density = 'comfortable'">
            <q-item-section>Comfortable</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <span class="text-caption text-grey q-ml-sm">1 fields sorted</span>

      <q-space />

      <q-btn flat dense no-caps icon="fullscreen" label="Full screen" class="toolbar-btn" />
    </div>

    <!-- Events table -->
    <div class="table-section q-mx-md q-mt-sm q-mb-md">
      <q-table
        :rows="fimStore.events"
        :columns="filteredColumns"
        row-key="_id"
        flat
        :dense="density === 'compact'"
        :loading="fimStore.eventsLoading"
        :pagination="tablePagination"
        :visible-columns="visibleColumns"
        class="events-table"
        separator="horizontal"
        @row-click="onRowClick"
        @request="onRequest"
      >
        <!-- Expand icon in first column -->
        <template #body-cell-expand="props">
          <q-td :props="props" auto-width>
            <q-icon name="chevron_right" size="18px" class="text-grey-6 cursor-pointer" />
          </q-td>
        </template>

        <!-- Timestamp -->
        <template #body-cell-timestamp="props">
          <q-td :props="props" class="cell-timestamp">
            {{ formatDate(props.row._source?.['@timestamp'] || props.row._source?.timestamp) }}
          </q-td>
        </template>

        <!-- Agent name -->
        <template #body-cell-agent_name="props">
          <q-td :props="props">{{ props.row._source?.agent?.name ?? '—' }}</q-td>
        </template>

        <!-- Syscheck path -->
        <template #body-cell-syscheck_path="props">
          <q-td :props="props" class="cell-path">{{ props.row._source?.syscheck?.path ?? '—' }}</q-td>
        </template>

        <!-- Syscheck event -->
        <template #body-cell-syscheck_event="props">
          <q-td :props="props">{{ props.row._source?.syscheck?.event ?? '—' }}</q-td>
        </template>

        <!-- Rule description -->
        <template #body-cell-rule_description="props">
          <q-td :props="props" class="cell-desc">{{ props.row._source?.rule?.description ?? '—' }}</q-td>
        </template>

        <!-- Rule level -->
        <template #body-cell-rule_level="props">
          <q-td :props="props">{{ props.row._source?.rule?.level ?? '—' }}</q-td>
        </template>

        <!-- Rule id -->
        <template #body-cell-rule_id="props">
          <q-td :props="props">
            <span class="text-primary">{{ props.row._source?.rule?.id ?? '—' }}</span>
          </q-td>
        </template>

        <!-- Pagination -->
        <template #bottom="scope">
          <div class="pagination-row">
            <span class="text-caption text-grey">
              Rows per page:
              <q-select
                :model-value="fimStore.eventsPagination.rowsPerPage"
                :options="[10, 15, 25, 50]"
                dense
                borderless
                emit-value
                style="display: inline-block; width: 60px"
                @update:model-value="fimStore.setEventsRowsPerPage($event)"
              />
            </span>
            <q-space />
            <q-btn flat dense round icon="chevron_left" :disable="scope.pagination.page <= 1" @click="fimStore.setEventsPage(fimStore.eventsPagination.page - 1)" />
            <span class="text-caption q-mx-sm">{{ fimStore.eventsPagination.page }}</span>
            <q-btn flat dense round icon="chevron_right" :disable="fimStore.events.length < fimStore.eventsPagination.rowsPerPage" @click="fimStore.setEventsPage(fimStore.eventsPagination.page + 1)" />
          </div>
        </template>
      </q-table>
    </div>

    <!-- Event detail panel -->
    <FIMEventDetail
      v-if="fimStore.selectedEvent"
      :event="fimStore.selectedEvent"
      @close="fimStore.selectedEvent = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFimStore } from "@/stores/fim";
import VueApexCharts from "vue3-apexcharts";
import FIMFilterBar from "./FIMFilterBar.vue";
import FIMEventDetail from "./FIMEventDetail.vue";
import type { FIMEvent } from "@/types/fim";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;
const fimStore = useFimStore();

const density = ref<"compact" | "normal" | "comfortable">("normal");
const availableFieldsCount = ref(1021);

const allColumns = [
  { name: "expand", label: "", field: "" },
  { name: "timestamp", label: "timestamp", field: "timestamp", align: "left" as const, sortable: true },
  { name: "agent_name", label: "agent.name", field: "agent_name", align: "left" as const, sortable: true },
  { name: "syscheck_path", label: "syscheck.path", field: "syscheck_path", align: "left" as const, sortable: true },
  { name: "syscheck_event", label: "syscheck.event", field: "syscheck_event", align: "left" as const, sortable: true },
  { name: "rule_description", label: "rule.description", field: "rule_description", align: "left" as const, sortable: true },
  { name: "rule_level", label: "rule.level", field: "rule_level", align: "left" as const, sortable: true },
  { name: "rule_id", label: "rule.id", field: "rule_id", align: "left" as const, sortable: true },
];

const visibleColumns = ref([
  "expand",
  "timestamp",
  "agent_name",
  "syscheck_path",
  "syscheck_event",
  "rule_description",
  "rule_level",
  "rule_id",
]);

const filteredColumns = computed(() =>
  allColumns.filter((c) => visibleColumns.value.includes(c.name)),
);

const tablePagination = ref({
  page: 1,
  rowsPerPage: fimStore.eventsPagination.rowsPerPage,
  rowsNumber: fimStore.eventsTotal,
});

function toggleColumn(name: string) {
  const idx = visibleColumns.value.indexOf(name);
  if (idx >= 0) {
    visibleColumns.value.splice(idx, 1);
  } else {
    visibleColumns.value.push(name);
  }
}

// === Timeline chart ===
const timelineSeries = computed(() => {
  const tl = fimStore.eventsTimeline;
  if (!tl.length) return [];
  return [{ name: "Events", data: tl.map((b) => b.count) }];
});

const timelineOptions = computed(() => ({
  chart: { type: "bar" as const, toolbar: { show: false }, fontFamily: "inherit", sparkline: { enabled: false } },
  colors: ["#47c68e"],
  plotOptions: { bar: { columnWidth: "80%", borderRadius: 1 } },
  xaxis: {
    categories: fimStore.eventsTimeline.map((b) => {
      const d = new Date(b.timestamp);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }),
    labels: { style: { fontSize: "10px", colors: "#999" }, rotate: 0 },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { fontSize: "10px", colors: "#999" } },
  },
  grid: { borderColor: "#f0f0f0", strokeDashArray: 4 },
  tooltip: {
    y: { title: { formatter: () => "Count:" } },
  },
  dataLabels: { enabled: false },
}));

function onRowClick(_: Event, row: FIMEvent) {
  fimStore.selectedEvent = row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onRequest(props: any) {
  fimStore.setEventsPage(props.pagination.page);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch {
    return dateStr;
  }
}

function exportCsv() {
  const rows = fimStore.events;
  const header = "timestamp,agent.name,syscheck.path,syscheck.event,rule.description,rule.level,rule.id\n";
  const csv = rows
    .map((r) =>
      [
        r._source["@timestamp"] ?? "",
        r._source.agent?.name ?? "",
        r._source.syscheck?.path ?? "",
        r._source.syscheck?.event ?? "",
        r._source.rule?.description ?? "",
        r._source.rule?.level ?? "",
        r._source.rule?.id ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([header + csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fim-events.csv";
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.fim-events {
  min-height: 100%;
}

.sample-banner {
  background: #fff8e1;
  border: 1px solid #ffe082;
  color: #5d4037;
}

/* Timeline */
.timeline-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
}

.timeline-chart-wrap {
  padding: 12px 16px;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: var(--mdm-text-muted, #999);
  font-size: 13px;
}

/* Hits row */
.hits-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.hits-count {
  font-size: 16px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.hits-range {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
}

/* Toolbar */
.table-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.toolbar-btn {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
}

/* Events table */
.events-table {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
}

.events-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  padding: 8px 10px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
  white-space: nowrap;
}

.events-table :deep(.q-table td) {
  font-size: 12px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 8px 10px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.events-table :deep(tbody tr) {
  cursor: pointer;
}

.events-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

.cell-timestamp {
  white-space: nowrap;
  font-size: 11px;
}

.cell-path {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-desc {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Pagination */
.pagination-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
}

/* Dark mode */
.body--dark .timeline-card,
.body--dark .events-table {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sample-banner {
  background: rgba(255, 248, 225, 0.1);
  border-color: rgba(255, 224, 130, 0.2);
  color: #ffe082;
}
</style>
