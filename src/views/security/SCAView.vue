<template>
  <div class="sca-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="sca-header">
      <div class="sca-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="sca-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="inventory" label="Inventory" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="sca-header-right">
        <SCAAgentSelector />
      </div>
    </div>

    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated class="sca-panels">
      <q-tab-panel name="dashboard" class="q-pa-none">
        <SCADashboard @select-agent="showAgentDialog = true" />
      </q-tab-panel>
      <q-tab-panel name="inventory" class="q-pa-none">
        <SCAInventory @select-agent="showAgentDialog = true" />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <SCAEvents @select-agent="showAgentDialog = true" />
      </q-tab-panel>
    </q-tab-panels>

    <!-- Agent selection dialog -->
    <q-dialog v-model="showAgentDialog">
      <q-card class="sca-agent-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Select agent</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="agentSearch"
            dense
            outlined
            placeholder="Search by name, ID, or IP..."
            clearable
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-spinner-dots v-if="wazuhStore.agentsLoading" color="primary" size="32px" class="q-my-md full-width text-center" />
          <q-list v-else-if="dialogAgents.length" separator class="sca-agent-dialog__list">
            <q-item
              v-for="agent in dialogAgents"
              :key="agent.id"
              clickable
              v-close-popup
              @click="onDialogAgentSelect(agent.id)"
            >
              <q-item-section avatar>
                <q-icon
                  :name="agent.os?.platform === 'windows' ? 'laptop_windows' : agent.os?.platform === 'darwin' ? 'laptop_mac' : 'computer'"
                  size="20px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ agent.name }}</q-item-label>
                <q-item-label caption>ID: {{ agent.id }} &middot; {{ agent.ip }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="agent.status === 'active' ? 'green' : 'grey'"
                  :label="agent.status"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey text-center q-pa-md">No agents found</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useScaStore } from "@/stores/sca";
import { useWazuhStore } from "@/stores/wazuh";
import SCAAgentSelector from "@/components/security/sca/SCAAgentSelector.vue";
import SCADashboard from "@/components/security/sca/SCADashboard.vue";
import SCAInventory from "@/components/security/sca/SCAInventory.vue";
import SCAEvents from "@/components/security/sca/SCAEvents.vue";

const scaStore = useScaStore();
const wazuhStore = useWazuhStore();
const activeTab = ref(scaStore.activeTab);

// Agent selection dialog
const showAgentDialog = ref(false);
const agentSearch = ref("");

const dialogAgents = computed(() => {
  const agents = wazuhStore.wazuhAgents.filter((a) => a.id !== "000");
  const needle = agentSearch.value.trim().toLowerCase();
  if (!needle) return agents;
  return agents.filter(
    (a) =>
      a.name.toLowerCase().includes(needle) ||
      a.id.includes(needle) ||
      a.ip.includes(needle),
  );
});

function onDialogAgentSelect(agentId: string) {
  scaStore.setAgent(agentId);
}

function onTabChange(tab: string) {
  scaStore.setActiveTab(tab as "dashboard" | "inventory" | "events");
}

/** Called by SecurityLayout on refresh button click */
function loadData() {
  scaStore.refreshActiveTab();
}

/** Called by SecurityLayout when user opens the Generate Report dropdown */
function getReportContext() {
  const agentId = scaStore.selectedAgentId;
  const { from, to } = scaStore.dateRangeQuery;
  return {
    scope: "sca",
    name: agentId
      ? `SCA report – agent ${agentId}`
      : "SCA report",
    sourceType: "HEALTH" as const,
    filters: {
      agent_ids: agentId ? [agentId] : [],
      date_from: from ? from.slice(0, 10) : undefined,
      date_to: to ? to.slice(0, 10) : undefined,
    },
  };
}

defineExpose({ loadData, getReportContext });

onMounted(async () => {
  if (!wazuhStore.wazuhAgents.length) {
    await wazuhStore.fetchAgents();
  }
  scaStore.refreshActiveTab();
});
</script>

<style scoped>
.sca-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.sca-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.sca-tabs-wrap {
  display: flex;
  align-items: center;
}

.sca-tabs {
  font-size: 14px;
}

.sca-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.sca-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.sca-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sca-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.sca-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .sca-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-panels {
  background: var(--mdm-bg, #0b0e14);
}

.sca-agent-dialog {
  min-width: 420px;
  max-width: 560px;
  width: 100%;
}

.sca-agent-dialog__list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
