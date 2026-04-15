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
          <template #body-cell-timestamp="props">
            <q-td :props="props">
              {{ formatDate(getField(props.row._source, '@timestamp') || getField(props.row._source, 'timestamp')) }}
            </q-td>
          </template>
          <template #body-cell-rule_description="props">
            <q-td :props="props">
              {{ getField(props.row._source, 'rule.description') || '-' }}
            </q-td>
          </template>
          <template #body-cell-data_title="props">
            <q-td :props="props">
              {{ getField(props.row._source, 'data.sca.check.title') || getField(props.row._source, 'data.title') || '-' }}
            </q-td>
          </template>
          <template #body-cell-data_result="props">
            <q-td :props="props">
              <q-badge
                v-if="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
                :color="resultColor(getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result') || '')"
                :label="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
              />
              <span v-else>-</span>
            </q-td>
          </template>
          <template #body-cell-agent_name="props">
            <q-td :props="props">
              {{ getField(props.row._source, 'agent.name') || '-' }}
            </q-td>
          </template>
          <template #body-cell-rule_level="props">
            <q-td :props="props">
              {{ getField(props.row._source, 'rule.level') || '-' }}
            </q-td>
          </template>
          <template #body="props">
            <q-tr :props="props" @click="expandedRow = expandedRow === props.row._id ? null : props.row._id" class="cursor-pointer">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <!-- Use slot rendering from above, but we need to inline here for the row click -->
                <template v-if="col.name === 'timestamp'">
                  {{ formatDate(getField(props.row._source, '@timestamp') || getField(props.row._source, 'timestamp')) }}
                </template>
                <template v-else-if="col.name === 'rule_description'">
                  {{ getField(props.row._source, 'rule.description') || '-' }}
                </template>
                <template v-else-if="col.name === 'data_title'">
                  {{ getField(props.row._source, 'data.sca.check.title') || getField(props.row._source, 'data.title') || '-' }}
                </template>
                <template v-else-if="col.name === 'data_result'">
                  <q-badge
                    v-if="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
                    :color="resultColor(getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result') || '')"
                    :label="getField(props.row._source, 'data.sca.check.result') || getField(props.row._source, 'data.result')"
                  />
                  <span v-else>-</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useScaStore } from "@/stores/sca";

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

const eventColumns = [
  { name: "timestamp", label: "Time", field: () => "", align: "left" as const, sortable: false, style: "width: 180px" },
  { name: "rule_description", label: "Rule description", field: () => "", align: "left" as const },
  { name: "data_title", label: "SCA check title", field: () => "", align: "left" as const },
  { name: "data_result", label: "Result", field: () => "", align: "center" as const, style: "width: 100px" },
  { name: "agent_name", label: "Agent", field: () => "", align: "left" as const, style: "width: 140px" },
  { name: "rule_level", label: "Level", field: () => "", align: "center" as const, style: "width: 70px" },
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
