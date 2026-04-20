<template>
  <div class="nist-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="nist-header">
      <div class="nist-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="nist-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="controls" label="Controls" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="nist-header-right">
        <NIST80053AgentSelector />

        <!-- Date range -->
        <q-select
          v-model="store.dateRange"
          :options="dateRangeOptions"
          emit-value
          map-options
          dense
          outlined
          class="nist-date-select"
          @update:model-value="store.setDateRange"
        />
      </div>
    </div>

    <!-- Control detail overlay -->
    <NIST80053Detail
      v-if="store.selectedControl"
      @back="store.clearControlSelection()"
    />

    <!-- Tab panels (hidden when detail is shown) -->
    <q-tab-panels
      v-else
      v-model="activeTab"
      animated
      class="nist-panels"
    >
      <q-tab-panel name="dashboard" class="q-pa-none">
        <NIST80053Dashboard />
      </q-tab-panel>
      <q-tab-panel name="controls" class="q-pa-none">
        <NIST80053Controls />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <NIST80053Events />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNist80053Store } from "@/stores/nist80053";
import { useWazuhStore } from "@/stores/wazuh";
import NIST80053AgentSelector from "@/components/security/nist80053/NIST80053AgentSelector.vue";
import NIST80053Dashboard from "@/components/security/nist80053/NIST80053Dashboard.vue";
import NIST80053Controls from "@/components/security/nist80053/NIST80053Controls.vue";
import NIST80053Events from "@/components/security/nist80053/NIST80053Events.vue";
import NIST80053Detail from "@/components/security/nist80053/NIST80053Detail.vue";

const route = useRoute();
const store = useNist80053Store();
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
.nist-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.nist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.nist-tabs-wrap {
  display: flex;
  align-items: center;
}

.nist-tabs {
  font-size: 14px;
}

.nist-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.nist-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.nist-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nist-date-select {
  min-width: 160px;
}

.nist-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.nist-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .nist-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .nist-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
