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
        <SCADashboard />
      </q-tab-panel>
      <q-tab-panel name="inventory" class="q-pa-none">
        <SCAInventory />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <SCAEvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScaStore } from "@/stores/sca";
import SCAAgentSelector from "@/components/security/sca/SCAAgentSelector.vue";
import SCADashboard from "@/components/security/sca/SCADashboard.vue";
import SCAInventory from "@/components/security/sca/SCAInventory.vue";
import SCAEvents from "@/components/security/sca/SCAEvents.vue";

const scaStore = useScaStore();
const activeTab = ref(scaStore.activeTab);

function onTabChange(tab: string) {
  scaStore.setActiveTab(tab as "dashboard" | "inventory" | "events");
}

/** Called by SecurityLayout on refresh button click */
function loadData() {
  scaStore.refreshActiveTab();
}

defineExpose({ loadData });

onMounted(() => {
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
</style>
