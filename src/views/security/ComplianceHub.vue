<template>
  <component :is="activeComponent" ref="childComp" />
</template>

<script setup lang="ts">
import { type Component, computed, ref } from "vue";
import { useRoute } from "vue-router";
import CompliancePCIDSS from "@/views/security/CompliancePCIDSS.vue";
import ComplianceGDPR from "@/views/security/ComplianceGDPR.vue";
import ComplianceHIPAA from "@/views/security/ComplianceHIPAA.vue";
import ComplianceNIST80053 from "@/views/security/ComplianceNIST80053.vue";
import ComplianceTSC from "@/views/security/ComplianceTSC.vue";

const route = useRoute();
const childComp = ref();

const frameworkMap: Record<string, Component> = {
  "pci-dss": CompliancePCIDSS,
  gdpr: ComplianceGDPR,
  hipaa: ComplianceHIPAA,
  nist80053: ComplianceNIST80053,
  tsc: ComplianceTSC,
};

const activeComponent = computed(() => {
  const fw = (route.params.framework as string) || "pci-dss";
  return frameworkMap[fw] ?? CompliancePCIDSS;
});

function loadData() {
  if (childComp.value?.loadData) {
    childComp.value.loadData();
  }
}

defineExpose({ loadData });
</script>
