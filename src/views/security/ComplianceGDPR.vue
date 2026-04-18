<template>
  <div class="gdpr-view">
    <!-- Header bar with tabs and agent selector -->
    <div class="gdpr-header">
      <div class="gdpr-tabs-wrap">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          indicator-color="primary"
          active-color="primary"
          class="gdpr-tabs"
          @update:model-value="onTabChange"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="controls" label="Controls" />
          <q-tab name="events" label="Events" />
        </q-tabs>
      </div>
      <div class="gdpr-header-right">
        <GDPRAgentSelector />

        <!-- Date range -->
        <q-select
          v-model="store.dateRange"
          :options="dateRangeOptions"
          emit-value
          map-options
          dense
          outlined
          class="gdpr-date-select"
          @update:model-value="store.setDateRange"
        />
      </div>
    </div>

    <!-- Article detail overlay -->
    <GDPRRequirementDetail
      v-if="store.selectedArticle"
      @back="store.clearArticleSelection()"
    />

    <!-- Tab panels (hidden when detail is shown) -->
    <q-tab-panels
      v-else
      v-model="activeTab"
      animated
      class="gdpr-panels"
    >
      <q-tab-panel name="dashboard" class="q-pa-none">
        <GDPRDashboard />
      </q-tab-panel>
      <q-tab-panel name="controls" class="q-pa-none">
        <GDPRControls />
      </q-tab-panel>
      <q-tab-panel name="events" class="q-pa-none">
        <GDPREvents />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGdprStore } from "@/stores/gdpr";
import GDPRAgentSelector from "@/components/security/gdpr/GDPRAgentSelector.vue";
import GDPRDashboard from "@/components/security/gdpr/GDPRDashboard.vue";
import GDPRControls from "@/components/security/gdpr/GDPRControls.vue";
import GDPREvents from "@/components/security/gdpr/GDPREvents.vue";
import GDPRRequirementDetail from "@/components/security/gdpr/GDPRRequirementDetail.vue";

const store = useGdprStore();
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

onMounted(() => {
  store.fetchAgentsList();
  store.refreshActiveTab();
});
</script>

<style scoped>
.gdpr-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.gdpr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 44px;
}

.gdpr-tabs-wrap {
  display: flex;
  align-items: center;
}

.gdpr-tabs {
  font-size: 14px;
}

.gdpr-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 44px;
  padding: 0 16px;
}

.gdpr-tabs :deep(.q-tab--active) {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.gdpr-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gdpr-date-select {
  min-width: 160px;
}

.gdpr-panels {
  flex: 1;
  min-height: 0;
  background: var(--mdm-bg, #f5f5f5);
}

.gdpr-panels :deep(.q-tab-panel) {
  padding: 0;
}

/* Dark mode */
.body--dark .gdpr-header {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .gdpr-panels {
  background: var(--mdm-bg, #0b0e14);
}
</style>
