<template>
  <div class="ossec-config-view">
    <div class="ossec-config-view__header">
      <div class="ossec-config-view__title-row">
        <h1 class="ossec-config-view__title">Manager Configuration</h1>
        <span class="ossec-config-view__subtitle">ossec.conf</span>
      </div>
      <div class="ossec-config-view__actions">
        <q-btn
          flat
          no-caps
          icon="refresh"
          label="Reload"
          class="ossec-config-view__btn"
          :loading="store.loading"
          :disable="store.saving || store.restarting"
          @click="loadData"
        />
        <q-btn
          flat
          no-caps
          icon="undo"
          label="Discard"
          class="ossec-config-view__btn"
          :disable="!store.isModified || store.saving || store.restarting"
          @click="store.resetChanges()"
        />
        <q-btn
          flat
          no-caps
          icon="save"
          label="Save"
          class="ossec-config-view__btn ossec-config-view__btn--primary"
          :loading="store.saving"
          :disable="!store.isModified || store.restarting"
          @click="onSave"
        />
        <q-btn
          unelevated
          no-caps
          icon="restart_alt"
          label="Restart Manager"
          color="primary"
          class="ossec-config-view__btn-restart"
          :loading="store.restarting"
          :disable="store.saving"
          @click="onRestart"
        />
      </div>
    </div>

    <!-- Error banner -->
    <q-banner
      v-if="store.error"
      class="ossec-config-view__error"
      inline-actions
      rounded
    >
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ store.error }}
      <template #action>
        <q-btn flat no-caps label="Dismiss" @click="store.error = null" />
      </template>
    </q-banner>

    <!-- Restarting overlay -->
    <q-banner
      v-if="store.restarting"
      class="ossec-config-view__restart-banner"
      rounded
    >
      <template #avatar>
        <q-spinner-dots color="primary" size="24px" />
      </template>
      Restarting Wazuh Manager... Please wait.
    </q-banner>

    <!-- Modified indicator -->
    <div v-if="store.isModified" class="ossec-config-view__modified">
      Unsaved changes
    </div>

    <!-- Monaco editor -->
    <div class="ossec-config-view__editor-wrap">
      <div v-if="store.loading" class="ossec-config-view__loader">
        <q-spinner-dots size="40px" color="primary" />
        <span>Loading configuration...</span>
      </div>
      <MonacoEditor
        v-else
        v-model="store.configXml"
        language="xml"
        :readonly="store.saving || store.restarting"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import { useOssecConfigStore } from "@/stores/ossecConfig";
import MonacoEditor from "@/cywm/components/MonacoEditor.vue";

const $q = useQuasar();
const store = useOssecConfigStore();

async function loadData() {
  await store.loadConfig();
}

async function onSave() {
  try {
    await store.saveConfig();
    $q.notify({ type: "positive", message: "Configuration saved" });
  } catch {
    // Error is already in store.error
  }
}

async function onRestart() {
  $q.dialog({
    title: "Restart Manager",
    message:
      "This will restart Wazuh Manager to apply configuration changes. " +
      "The manager will be temporarily unavailable. Continue?",
    ok: { label: "Restart", color: "primary", unelevated: true },
    cancel: { label: "Cancel", flat: true },
  }).onOk(async () => {
    try {
      await store.restartManager();
      $q.notify({
        type: "positive",
        message: "Wazuh Manager restarted successfully.",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Restart failed";
      $q.notify({ type: "negative", message: msg });
    }
  });
}

onMounted(() => {
  if (!store.configXml) {
    loadData();
  }
});

defineExpose({ loadData });
</script>

<style scoped>
.ossec-config-view {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 12px;
  height: calc(100vh - 48px);
}

.ossec-config-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.ossec-config-view__title-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.ossec-config-view__title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.ossec-config-view__subtitle {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #6b7280);
  background: var(--mdm-bg, #f5f5f5);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}

.ossec-config-view__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ossec-config-view__btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
}

.ossec-config-view__btn--primary {
  color: var(--mdm-primary, #2563eb);
  border-color: var(--mdm-primary, #2563eb);
}

.ossec-config-view__btn-restart {
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--mdm-radius, 6px);
}

.ossec-config-view__error {
  background: var(--q-negative, #c10015);
  color: #fff;
}

.ossec-config-view__restart-banner {
  background: var(--mdm-bg, #f5f5f5);
  border: 1px solid var(--mdm-border, #e5e5e5);
}

.ossec-config-view__modified {
  font-size: 12px;
  font-weight: 500;
  color: var(--q-warning, #f2c037);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ossec-config-view__editor-wrap {
  flex: 1;
  min-height: 0;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  overflow: hidden;
  position: relative;
}

.ossec-config-view__loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  min-height: 400px;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 14px;
}
</style>

<style>
.body--dark .ossec-config-view__title {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .ossec-config-view__subtitle {
  background: var(--mdm-bg-card, #111827);
  color: var(--mdm-text-secondary, #9ca3af);
}

.body--dark .ossec-config-view__btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ossec-config-view__editor-wrap {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ossec-config-view__restart-banner {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
