<template>
  <div class="fim-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="fim-header">
      <div class="fim-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="fim-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="inventory" label="Inventory" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="fim-header-right">
        <FIMAgentSelector />
      </div>
    </div>

    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated class="fim-panels">
      <q-tab-panel name="dashboard" class="q-pa-none">
        <FIMDashboard />
      </q-tab-panel>
      <q-tab-panel name="inventory" class="q-pa-none">
        <FIMInventory />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <FIMEvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFimStore } from "@/stores/fim";
import FIMAgentSelector from "@/components/security/fim/FIMAgentSelector.vue";
import FIMDashboard from "@/components/security/fim/FIMDashboard.vue";
import FIMInventory from "@/components/security/fim/FIMInventory.vue";
import FIMEvents from "@/components/security/fim/FIMEvents.vue";

const fimStore = useFimStore();
const activeTab = ref(fimStore.activeTab);

function onTabChange(tab: string) {
  fimStore.setActiveTab(tab as "dashboard" | "inventory" | "events");
}

/** Called by SecurityLayout on refresh button click */
function loadData() {
  fimStore.refreshActiveTab();
}

defineExpose({ loadData });

onMounted(() => {
  fimStore.refreshActiveTab();
});
</script>

<style scoped>
.fim-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.fim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.fim-tabs-wrap {
  display: flex;
  align-items: center;
}

.fim-tabs {
  font-size: 14px;
}

.fim-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.fim-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.fim-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fim-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.fim-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .fim-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .fim-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
