<template>
  <q-page class="security-layout">
    <!-- Top bar -->
    <div class="sec-topbar">
      <div class="sec-topbar__left">
        <q-icon name="shield" size="20px" class="sec-topbar__icon" />
        <span class="sec-topbar__badge">{{ currentPageLabel }}</span>
      </div>
      <div class="sec-topbar__right">
        <GenerateReportButton v-if="showReportBtn" />
        <q-btn v-if="showRefreshBtn" flat no-caps icon="refresh" label="Refresh" class="sec-refresh-btn" @click="onRefresh" />
      </div>
    </div>

    <!-- Page content -->
    <div class="sec-content">
      <router-view ref="childView" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useWazuhStore } from "@/stores/wazuh";
import GenerateReportButton from "@/components/security/reporting/GenerateReportButton.vue";

const route = useRoute();
const childView = ref();
const wazuhStore = useWazuhStore();

const labelMap: Record<string, string> = {
  SecurityAgents: "Agents",
  AgentSecurityDetail: "Agents",
  AgentEndpointDetail: "Agent Detail",
  ITHygiene: "IT Hygiene",
  SecurityAlerts: "Alerting",
  SecurityGroups: "Groups",
  SecurityGroupDetail: "Groups",
  SecurityDiscover: "Discover",
  SecurityFIM: "File Integrity Monitoring",
  ThreatHunting: "Threat Hunting",
  SecuritySCA: "Configuration Assessment",
  ComplianceHub: "Compliance",
  VulnerabilityDetection: "Vulnerability Detection",
  SecurityReports: "My Reports",
  SecurityReporting: "Reporting",
  Workshop: "Workshop",
  DetectionCases: "Detection Cases",
  AgentCompliance: "Agent Compliance",
};

const currentPageLabel = computed(() => {
  const name = route.name as string;
  if (name === "ComplianceHub") {
    return "Compliance";
  }
  return labelMap[name] ?? "Security";
});

function onRefresh() {
  if (childView.value?.loadData) {
    childView.value.loadData();
  }
}

const showRefreshBtn = ref(false);

// Agents page provides its own Discover-style export dialog inside the page;
// suppress the generic Wazuh PDF report button there to avoid duplicate entry
// points.
const showReportBtn = computed(
  () =>
    route.name !== "SecurityReports" &&
    route.name !== "SecurityReporting" &&
    route.name !== "SecurityAgents",
);

watch(
  () => route.name,
  async () => {
    showRefreshBtn.value = false;
    await nextTick();
    showRefreshBtn.value = typeof childView.value?.loadData === "function";
  },
  { immediate: true },
);

onMounted(async () => {
  if (!wazuhStore.wazuhAgents.length) {
    await wazuhStore.fetchAgents();
  }
});
</script>

<style scoped>
.security-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.sec-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  min-height: 48px;
}

.sec-topbar__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sec-topbar__icon {
  color: var(--mdm-primary, #2563eb);
}

.sec-topbar__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  background: var(--mdm-primary, #2563eb);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
}

.sec-topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sec-topbar__right > :deep(.gen-report-btn) {
  min-height: 32px;
}

.sec-refresh-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
}

.sec-content {
  flex: 1;
  overflow-y: auto;
  background: var(--mdm-bg, #f5f5f5);
}
</style>

<style>
.body--dark .sec-topbar {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .sec-content {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .sec-refresh-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}
</style>
