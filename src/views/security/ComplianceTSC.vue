<template>
  <div class="tsc-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="tsc-header">
      <div class="tsc-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="tsc-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="controls" label="Controls" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="tsc-header-right">
        <TSCAgentSelector />

        <!-- Date range -->
        <q-select
          v-model="store.dateRange"
          :options="dateRangeOptions"
          emit-value
          map-options
          dense
          outlined
          class="tsc-date-select"
          @update:model-value="store.setDateRange"
        />
      </div>
    </div>

    <!-- Criteria detail overlay -->
    <TSCRequirementDetail
      v-if="store.selectedCriteria"
      @back="store.clearCriteriaSelection()"
    />

    <!-- Tab panels (hidden when detail is shown) -->
    <q-tab-panels
      v-else
      v-model="activeTab"
      animated
      class="tsc-panels"
    >
      <q-tab-panel name="dashboard" class="q-pa-none">
        <TSCDashboard />
      </q-tab-panel>
      <q-tab-panel name="controls" class="q-pa-none">
        <TSCControls />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <TSCEvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTscStore } from "@/stores/tsc";
import { useWazuhStore } from "@/stores/wazuh";
import TSCAgentSelector from "@/components/security/tsc/TSCAgentSelector.vue";
import TSCDashboard from "@/components/security/tsc/TSCDashboard.vue";
import TSCControls from "@/components/security/tsc/TSCControls.vue";
import TSCEvents from "@/components/security/tsc/TSCEvents.vue";
import TSCRequirementDetail from "@/components/security/tsc/TSCRequirementDetail.vue";

const route = useRoute();
const store = useTscStore();
const wazuhStore = useWazuhStore();
const activeTab = ref(store.activeTab);

const dateRangeOptions = [
  { label: "Last 15 min", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

function onTabChange(tab: string) {
  store.setActiveTab(tab as "dashboard" | "controls" | "events");
}

/** Called by SecurityLayout on refresh button click */
function loadData() {
  store.refreshActiveTab();
}

defineExpose({ loadData });

onMounted(async () => {
  // Pre-select agent from query param if navigated from Agent Detail
  const queryAgentId = route.query.agentId as string | undefined;
  if (queryAgentId) {
    if (!wazuhStore.wazuhAgents.length) {
      await wazuhStore.fetchAgents();
    }
    const agent = wazuhStore.wazuhAgents.find((a) => a.id === queryAgentId);
    if (agent) {
      store.setSelectedAgent({ id: agent.id, name: agent.name });
    }
  }

  store.fetchAgentsList();
  store.refreshActiveTab();
});
</script>

<style scoped>
.tsc-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.tsc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.tsc-tabs-wrap {
  display: flex;
  align-items: center;
}

.tsc-tabs {
  font-size: 14px;
}

.tsc-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.tsc-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.tsc-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tsc-date-select {
  min-width: 160px;
}

.tsc-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.tsc-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .tsc-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .tsc-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
