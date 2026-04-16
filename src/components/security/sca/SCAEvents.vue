<template>
  <div class="sca-events">
    <!-- No agent selected -->
    <div v-if="!scaStore.hasAgent" class="sca-no-agent">
      <q-icon name="wifi_tethering" size="64px" color="grey-5" />
      <h5 class="q-mt-md q-mb-sm">No agent is selected</h5>
      <p class="text-grey-7">
        You need to select an agent to see Security Configuration Assessment events.
      </p>
      <q-btn
        color="primary"
        label="Select agent"
        no-caps
        unelevated
        @click="$emit('select-agent')"
      />
    </div>

    <!-- Has agent: show events -->
    <div v-else class="sca-events-content">
      <!-- Search bar -->
      <div class="sca-events-controls">
        <q-input
          v-model="searchInput"
          dense
          outlined
          placeholder="Search..."
          class="sca-events-search"
          @keyup.enter="onSearch"
        >
          <template #prepend><q-icon name="search" size="18px" /></template>
        </q-input>
        <q-badge outline color="grey" label="DQL" class="q-ml-sm" />
        <q-select
          v-model="scaStore.eventsDateRange"
          :options="timeOptions"
          dense
          outlined
          emit-value
          map-options
          class="sca-time-select"
          @update:model-value="onDateRangeChange"
        />
        <q-btn flat dense no-caps label="Show dates" color="primary" class="q-ml-sm" />
        <q-btn
          outlined
          dense
          no-caps
          icon="refresh"
          label="Refresh"
          :loading="scaStore.eventsLoading"
          class="sca-refresh-btn"
          @click="scaStore.fetchEvents()"
        />
      </div>

      <!-- Filter pills -->
      <div class="sca-filter-bar">
        <q-chip
          v-if="scaStore.selectedAgentId"
          dense
          removable
          color="blue-1"
          text-color="blue-9"
          class="sca-filter-chip"
        >
          agent.id: {{ scaStore.selectedAgentId }}
        </q-chip>
        <q-chip
          dense
          color="blue-1"
          text-color="blue-9"
          class="sca-filter-chip"
        >
          rule.groups: sca
        </q-chip>
        <q-chip
          v-for="f in scaStore.eventsFilters"
          :key="f.id"
          dense
          removable
          color="blue-1"
          text-color="blue-9"
          class="sca-filter-chip"
          @remove="scaStore.removeFilter(f.id)"
        >
          {{ f.field }}: {{ f.value }}
        </q-chip>
        <q-btn flat dense no-caps size="sm" icon="add" label="Add filter" @click="showAddFilter = true" />
      </div>

      <!-- Histogram chart -->
      <q-card flat bordered class="sca-histogram-card q-mb-md">
        <q-card-section class="q-py-sm">
          <q-inner-loading :showing="scaStore.eventsHistogramLoading" />
          <apexchart
            v-if="!scaStore.eventsHistogramLoading && histogramSeries[0].data.length"
            type="bar"
            height="160"
            :options="histogramOptions"
            :series="histogramSeries"
          />
        </q-card-section>
      </q-card>

      <!-- Hits info bar -->
      <div class="sca-hits-bar q-mb-sm">
        <div class="sca-hits-summary">
          <span class="sca-hits-count">{{ scaStore.eventsTotal.toLocaleString() }}</span>
          <span class="sca-hits-label"> hits</span>
        </div>
        <div class="sca-hits-range text-caption text-grey">
          {{ formatDate(scaStore.dateRangeQuery.from) }} - {{ formatDate(scaStore.dateRangeQuery.to) }}
        </div>
      </div>

      <!-- Results -->
      <q-card flat bordered class="sca-events-card">
        <div v-if="!scaStore.eventsLoading && !scaStore.events.length" class="sca-no-results">
          <q-icon name="info_outline" size="20px" color="orange-8" class="q-mr-sm" />
          No results match your search criteria
        </div>

        <q-table
          v-else
          :rows="scaStore.events"
          :columns="eventColumns"
          row-key="_id"
          flat
          dense
          :loading="scaStore.eventsLoading"
          :pagination="tablePagination"
          @update:pagination="onPaginationChange"
          class="sca-events-table"
        >
          <template #body="props">
            <q-tr :props="props" @click="expandedRow = expandedRow === props.row._id ? null : props.row._id" class="cursor-pointer">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'actions'">
                  <q-btn
                    flat round dense
                    size="xs"
                    icon="search"
                    color="primary"
                    @click.stop="scaStore.inspectDocument(props.row)"
                  >
                    <q-tooltip>Inspect document details</q-tooltip>
                  </q-btn>
                </template>
                <template v-else-if="col.name === 'timestamp'">
                  {{ formatDate(getField(props.row._source, '@timestamp') || getField(props.row._source, 'timestamp')) }}
                </template>
                <template v-else-if="col.name === 'rule_description'">
                  {{ getField(props.row._source, 'rule.description') || '-' }}
                </template>
                <template v-else-if="col.name === 'data_title'">
                  {{ getField(props.row._source, 'data.sca.check.title') || getField(props.row._source, 'data.title') || '-' }}
                </template>
                <template v-else-if="col.name === 'data_file'">
                  {{ getField(props.row._source, 'data.sca.check.file') || '-' }}
                </template>
                <template v-else-if="col.name === 'data_result'">
                  <q-badge
                    v-if="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
                    :color="resultColor(getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result') || '')"
                    :label="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
                  />
                  <span v-else>-</span>
                </template>
                <template v-else-if="col.name === 'sca_policy'">
                  {{ getField(props.row._source, 'data.sca.policy') || '-' }}
                </template>
                <template v-else-if="col.name === 'agent_name'">
                  {{ getField(props.row._source, 'agent.name') || '-' }}
                </template>
                <template v-else-if="col.name === 'rule_level'">
                  {{ getField(props.row._source, 'rule.level') || '-' }}
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </q-tr>
            <!-- Expanded row: show raw JSON -->
            <q-tr v-if="expandedRow === props.row._id" :props="props">
              <q-td colspan="100%" class="sca-event-detail">
                <pre class="sca-event-json">{{ JSON.stringify(props.row._source, null, 2) }}</pre>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Add filter dialog -->
    <q-dialog v-model="showAddFilter">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-subtitle1">Add filter</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newFilterField" dense outlined label="Field" class="q-mb-sm" />
          <q-input v-model="newFilterValue" dense outlined label="Value" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="onAddFilter" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Inspect document details panel -->
    <SCAEventDetail
      v-if="scaStore.showDetailPanel && scaStore.inspectedEvent"
      :event="scaStore.inspectedEvent"
      @close="scaStore.closeInspection()"
      @view-surrounding="(ev) => scaStore.viewSurroundingDocuments(ev)"
      @view-single="(ev) => scaStore.viewSingleDocument(ev)"
      @add-filter="onAddFilterFromDetail"
    />

    <!-- View surrounding documents panel -->
    <SCASurroundingDocs
      :show="scaStore.showSurroundingPanel"
      :event="scaStore.inspectedEvent"
      :newer-docs="scaStore.surroundingDocs.newer"
      :older-docs="scaStore.surroundingDocs.older"
      :loading="scaStore.surroundingDocsLoading"
      :load-count="5"
      @close="scaStore.closeInspection()"
      @view-surrounding="(ev) => scaStore.viewSurroundingDocuments(ev)"
      @view-single="(ev) => scaStore.viewSingleDocument(ev)"
    />

    <!-- View single document panel -->
    <SCASingleDocument
      :show="scaStore.showSingleDocPanel"
      :event="scaStore.inspectedEvent"
      :document="scaStore.singleDocument"
      :loading="scaStore.singleDocumentLoading"
      @close="scaStore.closeInspection()"
      @view-surrounding="(ev) => { if (ev) scaStore.viewSurroundingDocuments(ev) }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useScaStore } from "@/stores/sca";
import VueApexCharts from "vue3-apexcharts";
import SCAEventDetail from "./SCAEventDetail.vue";
import SCASurroundingDocs from "./SCASurroundingDocs.vue";
import SCASingleDocument from "./SCASingleDocument.vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

defineEmits<{ (e: "select-agent"): void }>();

const scaStore = useScaStore();

const searchInput = ref(scaStore.eventsSearch);
const expandedRow = ref<string | null>(null);
const showAddFilter = ref(false);
const newFilterField = ref("rule.level");
const newFilterValue = ref("");

const timeOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

// === Histogram chart config ===
const histogramSeries = computed(() => [
  {
    name: "Count",
    data: scaStore.eventsHistogramData.map((b) => b.doc_count),
  },
]);

const histogramOptions = computed(() => {
  const buckets = scaStore.eventsHistogramData;
  const categories = buckets.map((b) => {
    const d = new Date(b.key);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  const tickAmount = Math.min(categories.length, 12);

  return {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#54b399"],
    plotOptions: {
      bar: { borderRadius: 1, columnWidth: "80%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      tickAmount,
      labels: {
        style: { fontSize: "10px", colors: "#69707d" },
        rotate: 0,
        hideOverlappingLabels: true,
      },
      title: {
        text: "timestamp per 30 minutes",
        style: { fontSize: "12px", color: "#69707d", fontWeight: 400 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Count",
        style: { fontSize: "12px", color: "#69707d", fontWeight: 400 },
      },
      labels: { style: { fontSize: "10px", colors: "#69707d" } },
    },
    grid: {
      borderColor: "#edf0f5",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: { formatter: (val: number) => String(val) },
    },
  };
});

const eventColumns = [
  { name: "actions", label: "", field: () => "", align: "center" as const, style: "width: 40px" },
  { name: "timestamp", label: "Time", field: () => "", align: "left" as const, sortable: false, style: "width: 180px" },
  { name: "data_title", label: "data.sca.check.title", field: () => "", align: "left" as const },
  { name: "data_file", label: "data.sca.check.file", field: () => "", align: "left" as const },
  { name: "data_result", label: "data.sca.check.result", field: () => "", align: "center" as const, style: "width: 120px" },
  { name: "sca_policy", label: "data.sca.policy", field: () => "", align: "left" as const },
];

const tablePagination = ref({
  page: scaStore.eventsPagination.page,
  rowsPerPage: scaStore.eventsPagination.rowsPerPage,
  rowsNumber: scaStore.eventsTotal,
  sortBy: null as string | null,
  descending: false,
});

function onPaginationChange(p: { page: number; rowsPerPage: number }) {
  tablePagination.value = { ...tablePagination.value, ...p };
  if (p.rowsPerPage !== scaStore.eventsPagination.rowsPerPage) {
    scaStore.setEventsRowsPerPage(p.rowsPerPage);
  } else if (p.page !== scaStore.eventsPagination.page) {
    scaStore.setEventsPage(p.page);
  }
}

function onSearch() {
  scaStore.setEventsSearch(searchInput.value);
}

function onDateRangeChange(range: string) {
  scaStore.setEventsDateRange(range);
}

function onAddFilter() {
  if (newFilterField.value && newFilterValue.value) {
    scaStore.addFilter({
      field: newFilterField.value,
      operator: "is",
      value: newFilterValue.value,
      enabled: true,
      negated: false,
    });
  }
}

function onAddFilterFromDetail(field: string, value: string) {
  scaStore.addFilter({
    field,
    operator: "is",
    value,
    enabled: true,
    negated: false,
  });
}

function getField(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }
  return current != null ? String(current) : "";
}

function resultColor(result: string): string {
  switch (result?.toLowerCase()) {
    case "passed": return "green";
    case "failed": return "red";
    default: return "grey";
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " @ " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.sca-events {
  padding: 20px;
  min-height: 400px;
}

.sca-no-agent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.sca-no-agent h5 {
  font-size: 20px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-events-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sca-events-search {
  flex: 1;
}

.sca-time-select {
  min-width: 170px;
}

.sca-refresh-btn {
  border-color: var(--mdm-border, #e5e5e5);
}

.sca-filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.sca-filter-chip {
  font-size: 12px;
}

.sca-histogram-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sca-hits-bar {
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sca-hits-count {
  font-size: 20px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-hits-label {
  font-size: 20px;
  font-weight: 400;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-hits-range {
  margin-top: 2px;
}

.sca-events-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.sca-no-results {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #fff8e1;
  border-left: 4px solid #f9a825;
  margin: 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #5d4037;
}

.sca-events-table :deep(.q-table__bottom) {
  border-top: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sca-event-detail {
  background: var(--mdm-bg-sidebar, #fafafa);
  padding: 0;
}

.sca-event-json {
  margin: 0;
  padding: 12px 16px;
  font-size: 12px;
  line-height: 1.5;
  max-height: 400px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .sca-events-controls {
    flex-wrap: wrap;
  }

  .sca-time-select {
    width: 100%;
  }
}

/* Dark mode */
.body--dark .sca-no-agent h5 {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-events-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-histogram-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-hits-count,
.body--dark .sca-hits-label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-hits-bar {
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-no-results {
  background: #3e2723;
  color: #ffcc80;
  border-left-color: #ff8f00;
}

.body--dark .sca-event-detail {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .sca-event-json {
  color: var(--mdm-text-secondary, #a0aec0);
}
</style>
