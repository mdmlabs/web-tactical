<template>
  <div class="threat-hunting-view">
    <!-- Header bar with tabs and time range -->
    <div class="th-header">
      <div class="th-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="th-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="th-header-right">
        <q-select
          :model-value="store.dateRange"
          :options="timeRangeOptions"
          dense
          outlined
          emit-value
          map-options
          class="th-time-select"
          @update:model-value="store.setDateRange"
        />
      </div>
    </div>

    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated class="th-panels">
      <q-tab-panel name="dashboard" class="q-pa-none">
        <ThreatHuntingDashboard />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <ThreatHuntingEvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useThreatHuntingStore } from "@/stores/threatHunting";
import ThreatHuntingDashboard from "@/components/security/threatHunting/ThreatHuntingDashboard.vue";
import ThreatHuntingEvents from "@/components/security/threatHunting/ThreatHuntingEvents.vue";

const store = useThreatHuntingStore();
const activeTab = ref(store.activeTab);

const timeRangeOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

function onTabChange(tab: string) {
  store.setActiveTab(tab as "dashboard" | "events");
}

/** Called by SecurityLayout on refresh button click */
function loadData() {
  store.refreshActiveTab();
}

defineExpose({ loadData });

onMounted(() => {
  store.refreshActiveTab();
});
</script>

<style scoped>
.threat-hunting-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.th-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.th-tabs-wrap {
  display: flex;
  align-items: center;
}

.th-tabs {
  font-size: 14px;
}

.th-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.th-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.th-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.th-time-select {
  min-width: 160px;
}

.th-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.th-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .th-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .th-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
