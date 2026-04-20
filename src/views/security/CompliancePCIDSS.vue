<template>
  <div class="pcidss-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="pcidss-header">
      <div class="pcidss-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="pcidss-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="controls" label="Controls" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="pcidss-header-right">
        <PCIDSSAgentSelector />

        <!-- Date range -->
        <q-select
          v-model="store.dateRange"
          :options="dateRangeOptions"
          emit-value
          map-options
          dense
          outlined
          class="pcidss-date-select"
          @update:model-value="store.setDateRange"
        />
      </div>
    </div>

    <!-- Requirement detail overlay -->
    <PCIDSSRequirementDetail
      v-if="store.selectedRequirement"
      @back="store.clearRequirementSelection()"
    />

    <!-- Tab panels (hidden when detail is shown) -->
    <q-tab-panels
      v-else
      v-model="activeTab"
      animated
      class="pcidss-panels"
    >
      <q-tab-panel name="dashboard" class="q-pa-none">
        <PCIDSSDashboard />
      </q-tab-panel>
      <q-tab-panel name="controls" class="q-pa-none">
        <PCIDSSControls />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <PCIDSSEvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePciDssStore } from "@/stores/pciDss";
import { useWazuhStore } from "@/stores/wazuh";
import PCIDSSAgentSelector from "@/components/security/pciDss/PCIDSSAgentSelector.vue";
import PCIDSSDashboard from "@/components/security/pciDss/PCIDSSDashboard.vue";
import PCIDSSControls from "@/components/security/pciDss/PCIDSSControls.vue";
import PCIDSSEvents from "@/components/security/pciDss/PCIDSSEvents.vue";
import PCIDSSRequirementDetail from "@/components/security/pciDss/PCIDSSRequirementDetail.vue";

const route = useRoute();
const store = usePciDssStore();
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
.pcidss-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.pcidss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.pcidss-tabs-wrap {
  display: flex;
  align-items: center;
}

.pcidss-tabs {
  font-size: 14px;
}

.pcidss-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.pcidss-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.pcidss-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pcidss-date-select {
  min-width: 160px;
}

.pcidss-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.pcidss-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .pcidss-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .pcidss-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
