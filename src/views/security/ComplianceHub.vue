<template>
  <div class="compliance-hub">
    <!-- ===== Header (like IT Hygiene) ===== -->
    <div class="ch-header">
      <div class="ch-header-left">
        <q-badge color="blue-grey-8" text-color="white" label="Compliance" class="ch-badge" />
      </div>
      <div class="ch-tabs">
        <div
          v-for="t in frameworkTabs"
          :key="t.id"
          class="ch-tab"
          :class="{ 'ch-tab--active': activeFramework === t.id }"
          @click="switchFramework(t.id)"
        >
          {{ t.label }}
        </div>
      </div>
      <q-space />
      <q-btn flat dense no-caps icon="refresh" label="Refresh" @click="onRefresh" />
    </div>

    <!-- ===== Active framework content ===== -->
    <div class="ch-content">
      <component :is="activeComponent" ref="childComp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CompliancePCIDSS from "@/views/security/CompliancePCIDSS.vue";
import ComplianceGDPR from "@/views/security/ComplianceGDPR.vue";
import ComplianceHIPAA from "@/views/security/ComplianceHIPAA.vue";
import ComplianceNIST80053 from "@/views/security/ComplianceNIST80053.vue";
import ComplianceTSC from "@/views/security/ComplianceTSC.vue";
import SCAView from "@/views/security/SCAView.vue";

const route = useRoute();
const router = useRouter();
const childComp = ref();

const frameworkTabs = [
  { id: "sca", label: "SCA" },
  { id: "pci-dss", label: "PCI DSS" },
  { id: "gdpr", label: "GDPR" },
  { id: "hipaa", label: "HIPAA" },
  { id: "nist80053", label: "NIST 800-53" },
  { id: "tsc", label: "TSC / SOC 2" },
];

const frameworkMap: Record<string, Component> = {
  sca: SCAView,
  "pci-dss": CompliancePCIDSS,
  gdpr: ComplianceGDPR,
  hipaa: ComplianceHIPAA,
  nist80053: ComplianceNIST80053,
  tsc: ComplianceTSC,
};

const activeFramework = computed(() => {
  const fw = (route.params.framework as string) || "sca";
  return frameworkMap[fw] ? fw : "sca";
});

const activeComponent = computed(() => {
  return frameworkMap[activeFramework.value] ?? SCAView;
});

function switchFramework(fw: string) {
  if (fw === activeFramework.value) return;
  router.replace({ name: "ComplianceHub", params: { framework: fw } });
}

function onRefresh() {
  if (childComp.value?.loadData) {
    childComp.value.loadData();
  }
}

function loadData() {
  onRefresh();
}

defineExpose({ loadData });
</script>

<style scoped>
.compliance-hub {
  padding: 0;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* ===== Header ===== */
.ch-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e8ecf0);
}

.ch-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.ch-badge {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 4px;
}

.ch-tabs {
  display: flex;
  gap: 0;
}

.ch-tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #666);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ch-tab:hover {
  color: var(--mdm-text-primary, #1a1a1a);
}

.ch-tab--active {
  color: var(--mdm-primary, #006bb4);
  border-bottom-color: var(--mdm-primary, #006bb4);
  font-weight: 600;
}

.ch-content {
  flex: 1;
}
</style>

<style>
/* ===== Dark mode ===== */
.body--dark .ch-header {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ch-tab--active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}
</style>
