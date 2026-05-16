<template>
  <div class="rules-management">
    <div class="rules-header">
      <h1 class="rules-title">Rules Management</h1>
      <p class="rules-subtitle">
        Manage detection rules, view rule groups, and edit rule files.
      </p>
    </div>

    <q-tabs
      v-model="activeTab"
      class="rules-tabs"
      align="left"
      dense
      no-caps
      indicator-color="primary"
      active-color="primary"
    >
      <q-tab name="rules" icon="rule" label="Rules" />
      <q-tab name="files" icon="description" label="Rule Files" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated keep-alive class="rules-panels">
      <q-tab-panel name="rules" class="rules-tab-panel">
        <RulesTab />
      </q-tab-panel>
      <q-tab-panel name="files" class="rules-tab-panel">
        <RuleFilesTab />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RulesTab from "@/components/security/rules/RulesTab.vue";
import RuleFilesTab from "@/components/security/rules/RuleFilesTab.vue";

const activeTab = ref("rules");

function loadData() {
  // Called by SecurityLayout via ref
}

defineExpose({ loadData });
</script>

<style scoped>
.rules-management {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 12px;
}

.rules-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rules-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.rules-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--mdm-text-secondary, #6b7280);
}

.rules-tabs {
  background: var(--mdm-bg-card, #fff);
  border-radius: var(--mdm-radius, 6px) var(--mdm-radius, 6px) 0 0;
}

.rules-panels {
  background: var(--mdm-bg-card, #fff);
  border-radius: 0 0 var(--mdm-radius, 6px) var(--mdm-radius, 6px);
  min-height: 320px;
}
</style>
