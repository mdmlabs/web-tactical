<template>
  <div class="discover-view">
    <!-- Error banner (only when indexer is unreachable) -->
    <q-banner v-if="discoverStore.errorMessage" class="bg-red-1 q-mb-md" rounded dense>
      <template #avatar><q-icon name="error_outline" color="red" size="sm" /></template>
      {{ discoverStore.errorMessage }}
      <template #action>
        <q-btn flat dense label="Retry" color="red" @click="discoverStore.search()" />
      </template>
    </q-banner>

    <!-- Top controls -->
    <div class="controls-bar q-mb-md">
      <q-select
        v-model="discoverStore.indexPattern"
        :options="indexPatternOptions"
        dense
        outlined
        emit-value
        map-options
        class="index-select"
        @update:model-value="discoverStore.setIndexPattern($event)"
      />
      <q-input
        v-model="discoverStore.searchQuery"
        dense
        outlined
        placeholder="Search... e.g. rule.level:>=10, agent.name:server01, rule.groups:syscheck"
        class="search-input"
        clearable
        @keyup.enter="discoverStore.search()"
        @clear="discoverStore.search()"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-select
        v-model="discoverStore.timeRange"
        :options="timeOptions"
        dense
        outlined
        emit-value
        map-options
        class="time-select"
        @update:model-value="discoverStore.setTimeRange($event)"
      />
      <q-btn
        flat
        dense
        icon="refresh"
        :loading="discoverStore.loading"
        @click="discoverStore.search()"
      >
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
      <q-btn
        flat
        dense
        no-caps
        icon="add_alert"
        label="Create Alert"
        @click="createAlertFromSearch"
      >
        <q-tooltip>Create alert rule from this search</q-tooltip>
      </q-btn>
    </div>

    <!-- Saved Search + Export bar -->
    <div class="saved-bar q-mb-md">
      <DiscoverSavedSearchBar />
      <q-space />
      <q-btn
        flat
        dense
        no-caps
        icon="file_download"
        label="Export"
        class="export-btn"
        @click="exportOpen = true"
      >
        <q-tooltip>Export as CSV / XLSX from a Saved Search or the current view</q-tooltip>
      </q-btn>
    </div>

    <DiscoverExportModal v-model="exportOpen" />

    <!-- Histogram -->
    <DiscoverHistogram
      :buckets="discoverStore.histogramBuckets"
      :total-hits="discoverStore.totalHits"
      :loading="discoverStore.loading"
      :interval-label="intervalLabel"
      class="q-mb-md"
    />

    <!-- Main content: sidebar + table -->
    <div class="row no-wrap discover-main">
      <!-- Fields sidebar -->
      <div class="col-auto sidebar-col">
        <DiscoverFieldsSidebar
          :hits="discoverStore.hits"
          :selected-fields="discoverStore.selectedFields"
          @toggle-field="discoverStore.toggleField"
        />
      </div>

      <!-- Events table -->
      <div class="col">
        <DiscoverEventsTable
          :hits="discoverStore.hits"
          :selected-fields="discoverStore.selectedFields"
          :loading="discoverStore.loading"
          :total="discoverStore.totalHits"
          :page="discoverStore.pagination.page"
          :rows-per-page="discoverStore.pagination.rowsPerPage"
          @update:page="discoverStore.setPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDiscoverStore } from "@/stores/discover";
import { useAlertingStore } from "@/stores/alerting";
import DiscoverHistogram from "@/components/security/DiscoverHistogram.vue";
import DiscoverFieldsSidebar from "@/components/security/DiscoverFieldsSidebar.vue";
import DiscoverEventsTable from "@/components/security/DiscoverEventsTable.vue";
import DiscoverSavedSearchBar from "@/components/security/DiscoverSavedSearchBar.vue";
import DiscoverExportModal from "@/components/security/reporting/DiscoverExportModal.vue";

const discoverStore = useDiscoverStore();
const alertingStore = useAlertingStore();
const router = useRouter();
const exportOpen = ref(false);

const indexPatternOptions = [
  { label: "ossec-alerts-*", value: "ossec-alerts-*" },
  { label: "ossec-archives-*", value: "ossec-archives-*" },
];

const timeOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const intervalLabel = computed(() => {
  const map: Record<string, string> = {
    "1m": "timestamp per 1 minute",
    "5m": "timestamp per 5 minutes",
    "30m": "timestamp per 30 minutes",
    "3h": "timestamp per 3 hours",
    "12h": "timestamp per 12 hours",
  };
  return map[discoverStore.histogramInterval] ?? "timestamp per 30 minutes";
});

function loadData() {
  discoverStore.search();
}

function createAlertFromSearch() {
  router.push({ name: "SecurityAlerts" }).then(() => {
    alertingStore.openCreateMonitor();
  });
}

defineExpose({ loadData });

onMounted(() => {
  discoverStore.fetchEvents();
});
</script>

<style scoped>
.discover-view {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

.controls-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.saved-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  min-height: 32px;
  padding: 0 12px;
}

.body--dark .export-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}

.index-select {
  width: 180px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
}

.time-select {
  width: 180px;
  flex-shrink: 0;
}

.discover-main {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  overflow: hidden;
  box-shadow: var(--mdm-shadow);
}

.sidebar-col {
  width: 240px;
  min-width: 200px;
  max-width: 300px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-right: 1px solid var(--mdm-border-light, #f0f0f0);
}

@media (max-width: 768px) {
  .controls-bar {
    flex-wrap: wrap;
  }

  .index-select,
  .time-select {
    width: 100%;
  }

  .discover-main {
    flex-direction: column;
  }

  .sidebar-col {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  }
}
</style>
