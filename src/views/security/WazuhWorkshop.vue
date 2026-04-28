<template>
  <div class="workshop-shell">
    <div class="workshop-header">
      <h1 class="workshop-title">Workshop</h1>
      <p class="workshop-subtitle">
        Author rules, decoders, active response scripts and SCA policies in
        one place. Test before you ship.
      </p>
    </div>

    <q-tabs
      v-model="activeTab"
      class="workshop-tabs"
      align="left"
      dense
      no-caps
      indicator-color="primary"
      active-color="primary"
    >
      <q-tab name="rules" icon="rule" label="Rules &amp; Decoders" />
      <q-tab name="active-response" icon="bolt" label="Active Response" />
      <q-tab name="scripts" icon="terminal" label="Scripts" />
      <q-tab name="sca" icon="fact_check" label="SCA Policies" />
      <q-tab name="history" icon="history" label="History" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated keep-alive class="workshop-panels">
      <q-tab-panel name="rules" class="workshop-tab-panel">
        <RulesDecodersTab />
      </q-tab-panel>
      <q-tab-panel name="active-response" class="workshop-tab-panel">
        <ActiveResponseTab />
      </q-tab-panel>
      <q-tab-panel name="scripts" class="workshop-tab-panel">
        <ScriptsTab />
      </q-tab-panel>
      <q-tab-panel name="sca" class="workshop-tab-panel">
        <ScaPoliciesTab />
      </q-tab-panel>
      <q-tab-panel name="history" class="workshop-tab-panel">
        <HistoryTab />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RulesDecodersTab from "@/components/security/workshop/RulesDecodersTab.vue";
import ActiveResponseTab from "@/components/security/workshop/ActiveResponseTab.vue";
import ScriptsTab from "@/components/security/workshop/ScriptsTab.vue";
import ScaPoliciesTab from "@/components/security/workshop/ScaPoliciesTab.vue";
import HistoryTab from "@/components/security/workshop/HistoryTab.vue";

const activeTab = ref("rules");
</script>

<style scoped>
.workshop-shell {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 12px;
}

.workshop-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.workshop-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.workshop-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--mdm-text-secondary, #6b7280);
}

.workshop-tabs {
  background: var(--mdm-bg-card, #fff);
  border-radius: var(--mdm-radius, 6px) var(--mdm-radius, 6px) 0 0;
}

.workshop-panels {
  background: var(--mdm-bg-card, #fff);
  border-radius: 0 0 var(--mdm-radius, 6px) var(--mdm-radius, 6px);
  min-height: 320px;
}
</style>
