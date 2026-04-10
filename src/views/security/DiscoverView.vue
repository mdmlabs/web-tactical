<template>
  <div class="discover-view">
    <!-- Info banner -->
    <q-banner class="bg-blue-1 q-mb-md" rounded dense>
      <template #avatar><q-icon name="info" color="blue" size="sm" /></template>
      Showing rules catalog via Wazuh Manager API. For real-time event data, connect to Wazuh Indexer.
    </q-banner>

    <!-- Top controls -->
    <div class="controls-bar q-mb-md">
      <q-select
        v-model="indexPattern"
        :options="indexPatternOptions"
        dense
        outlined
        emit-value
        map-options
        class="index-select"
      />
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="Search... e.g. level>=10, groups:syscheck"
        class="search-input"
        clearable
        @keyup.enter="loadData"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-select
        v-model="timeRange"
        :options="timeOptions"
        dense
        outlined
        emit-value
        map-options
        class="time-select"
      />
      <q-btn
        flat
        dense
        icon="refresh"
        :loading="wazuhStore.rulesLoading"
        @click="loadData"
      >
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </div>

    <!-- Histogram -->
    <DiscoverHistogram
      :hourly-data="wazuhStore.managerHourlyStats"
      :loading="wazuhStore.managerStatsLoading"
      class="q-mb-md"
    />

    <!-- Main content: sidebar + table -->
    <div class="row no-wrap discover-main">
      <!-- Fields sidebar -->
      <div class="col-auto sidebar-col">
        <DiscoverFieldsSidebar
          :rules="filteredRules"
          :selected-fields="selectedFields"
          @toggle-field="toggleField"
        />
      </div>

      <!-- Events table -->
      <div class="col">
        <DiscoverEventsTable
          :rows="filteredRules"
          :loading="wazuhStore.rulesLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWazuhStore } from "@/stores/wazuh";
import DiscoverHistogram from "@/components/security/DiscoverHistogram.vue";
import DiscoverFieldsSidebar from "@/components/security/DiscoverFieldsSidebar.vue";
import DiscoverEventsTable from "@/components/security/DiscoverEventsTable.vue";

const wazuhStore = useWazuhStore();

const indexPattern = ref("wazuh-alerts-*");
const indexPatternOptions = [
  { label: "wazuh-alerts-*", value: "wazuh-alerts-*" },
  { label: "wazuh-archives-*", value: "wazuh-archives-*" },
];

const searchQuery = ref("");
const timeRange = ref("24h");
const timeOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const selectedFields = ref<string[]>(["level", "description", "groups"]);

function toggleField(field: string) {
  const idx = selectedFields.value.indexOf(field);
  if (idx >= 0) {
    selectedFields.value.splice(idx, 1);
  } else {
    selectedFields.value.push(field);
  }
}

// Filter rules based on search query
const filteredRules = computed(() => {
  let rules = wazuhStore.rules;
  if (!searchQuery.value) return rules;

  const q = searchQuery.value.trim();

  // Parse simple filters: level>=N, level=N, groups:value
  const levelGteMatch = q.match(/^level\s*>=\s*(\d+)$/i);
  if (levelGteMatch) {
    const minLevel = parseInt(levelGteMatch[1]);
    return rules.filter((r) => r.level >= minLevel);
  }

  const levelEqMatch = q.match(/^level\s*=\s*(\d+)$/i);
  if (levelEqMatch) {
    const level = parseInt(levelEqMatch[1]);
    return rules.filter((r) => r.level === level);
  }

  const groupMatch = q.match(/^groups?\s*[:=]\s*(.+)$/i);
  if (groupMatch) {
    const group = groupMatch[1].trim().toLowerCase();
    return rules.filter((r) =>
      (r.groups ?? []).some((g) => g.toLowerCase().includes(group)),
    );
  }

  const mitreMatch = q.match(/^mitre\.tactic\s*[:=]\s*(.+)$/i);
  if (mitreMatch) {
    const tactic = mitreMatch[1].trim().toLowerCase();
    return rules.filter((r) =>
      (r.mitre?.tactic ?? []).some((t) => t.toLowerCase().includes(tactic)),
    );
  }

  // Freetext search
  const lower = q.toLowerCase();
  return rules.filter(
    (r) =>
      r.description?.toLowerCase().includes(lower) ||
      String(r.id).includes(lower) ||
      (r.groups ?? []).some((g) => g.toLowerCase().includes(lower)),
  );
});

async function loadData() {
  await Promise.allSettled([
    wazuhStore.fetchRules({ limit: 500, sort: "-level" }),
    wazuhStore.fetchManagerStatsHourly(),
  ]);
}

onMounted(() => {
  loadData();
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
