<template>
  <div class="alerting-view">
    <!-- Tabs: Alerts / Monitors / Destinations -->
    <div class="wz-tabs-bar">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="wz-tab-btn"
        :class="{ 'wz-tab-btn--active': activeTab === tab.value }"
        @click="onTabChange(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content -->
    <div class="wz-tab-content">
      <AlertsByTriggers v-if="activeTab === 'alerts'" />
      <MonitorsList
        v-else-if="activeTab === 'monitors' && !showDetail"
        @open-detail="openMonitorDetail"
      />
      <MonitorDetail
        v-else-if="activeTab === 'monitors' && showDetail"
        :monitor-id="detailMonitorId"
        @back="closeDetail"
      />
      <NotificationsPanel v-else-if="activeTab === 'destinations'" />
    </div>

    <!-- Create monitor wizard (full-page overlay) -->
    <MonitorCreateWizard
      v-if="store.showCreateMonitor"
      :editing="store.editingMonitor"
      @close="store.closeCreateMonitor()"
      @created="onMonitorCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import AlertsByTriggers from "@/components/security/alerting/AlertsByTriggers.vue";
import MonitorsList from "@/components/security/alerting/MonitorsList.vue";
import MonitorDetail from "@/components/security/alerting/MonitorDetail.vue";
import MonitorCreateWizard from "@/components/security/alerting/MonitorCreateWizard.vue";
import NotificationsPanel from "@/components/security/alerting/NotificationsPanel.vue";

const store = useAlertingStore();
const activeTab = ref(store.activeTab);
const showDetail = ref(false);
const detailMonitorId = ref("");

const tabs = [
  { label: "Alerts", value: "alerts" as const },
  { label: "Monitors", value: "monitors" as const },
  { label: "Destinations", value: "destinations" as const },
];

function onTabChange(tab: "alerts" | "monitors" | "destinations") {
  activeTab.value = tab;
  showDetail.value = false;
  store.setActiveTab(tab);
}

function onMonitorCreated() {
  store.closeCreateMonitor();
  activeTab.value = "monitors";
  store.loadMonitors();
}

function openMonitorDetail(id: string) {
  detailMonitorId.value = id;
  showDetail.value = true;
}

function closeDetail() {
  showDetail.value = false;
}

function loadData() {
  store.refreshActiveTab();
}

defineExpose({ loadData });

onMounted(() => {
  store.loadAlerts();
  store.loadMonitors();
});
</script>

<style scoped>
.alerting-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.wz-tabs-bar {
  display: flex;
  gap: 0;
  padding: 0 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid #d3dae6;
}

.wz-tab-btn {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #69707d;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.wz-tab-btn:hover {
  color: #343741;
}

.wz-tab-btn--active {
  color: #006bb4;
  border-bottom-color: #006bb4;
  font-weight: 600;
}

.wz-tab-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}

.body--dark .wz-tabs-bar {
  background: var(--mdm-bg-card, #1d1e24);
  border-bottom-color: #343741;
}

.body--dark .wz-tab-btn { color: #98a2b3; }
.body--dark .wz-tab-btn:hover { color: #dfe5ef; }
.body--dark .wz-tab-btn--active { color: #36a2ef; border-bottom-color: #36a2ef; }
.body--dark .wz-tab-content { background: #141519; }
</style>
