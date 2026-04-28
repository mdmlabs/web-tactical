<template>
  <div class="ar-tab">
    <div class="ar-grid">
      <!-- Manual trigger -->
      <q-card flat bordered class="ar-card">
        <q-card-section>
          <div class="ar-card-title">
            <q-icon name="bolt" />
            <span>Manual trigger</span>
          </div>
          <p class="ar-card-hint">
            Fire an active-response command on selected agents. Useful for
            verifying that the AR script is on disk and executable.
          </p>

          <q-select
            v-model="selectedAgents"
            :options="agentOptions"
            label="Target agents"
            multiple
            outlined
            dense
            use-chips
            emit-value
            map-options
            :loading="agentsLoading"
            class="ar-input"
          />

          <q-input
            v-model="command"
            label="Command name"
            outlined
            dense
            hint="As declared in &lt;command&gt; section of ossec.conf"
            class="ar-input"
          />

          <div class="ar-quick-chips">
            <q-chip
              v-for="cmd in commandSuggestions"
              :key="cmd"
              clickable
              :color="command === cmd ? 'primary' : undefined"
              :text-color="command === cmd ? 'white' : undefined"
              dense
              @click="command = cmd"
            >
              {{ cmd }}
            </q-chip>
          </div>

          <q-input
            v-model="argsRaw"
            label="Arguments (comma-separated)"
            outlined
            dense
            class="ar-input"
            hint="Examples for firewall-drop: 1.2.3.4 — for host-deny: hostname"
          />

          <div class="ar-actions">
            <q-btn
              no-caps
              unelevated
              color="primary"
              icon="play_arrow"
              label="Trigger"
              :loading="triggering"
              :disable="!command || selectedAgents.length === 0"
              @click="onTrigger"
            />
            <q-btn
              v-if="logPolling"
              no-caps
              flat
              color="warning"
              icon="stop_circle"
              label="Stop log poll"
              @click="stopPolling"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- AR log -->
      <q-card flat bordered class="ar-card">
        <q-card-section class="ar-log-card">
          <div class="ar-card-title">
            <q-icon name="article" />
            <span>active-responses.log</span>
            <q-space />
            <q-btn
              flat
              dense
              icon="refresh"
              :loading="logLoading"
              @click="refreshLog"
            >
              <q-tooltip>Refresh now</q-tooltip>
            </q-btn>
          </div>
          <p class="ar-card-hint">
            Last {{ logLines }} lines. Auto-refreshes for 30 s after every
            trigger.
          </p>
          <div class="ar-log-shell">
            <pre v-if="log" class="ar-log">{{ log }}</pre>
            <div v-else class="ar-log-empty">
              {{ logLoading ? "Loading…" : "No log loaded yet." }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import { notifyError, notifySuccess } from "@/utils/notify";

const wazuhStore = useWazuhStore();

const selectedAgents = ref<string[]>([]);
const command = ref("");
const argsRaw = ref("");
const triggering = ref(false);

const commandSuggestions = [
  "firewall-drop",
  "host-deny",
  "restart-wazuh",
  "disable-account",
  "win_route-null",
];

const agentsLoading = computed(() => wazuhStore.agentsLoading);

const agentOptions = computed(() =>
  wazuhStore.wazuhAgents
    .filter((a) => a.id !== "000")
    .map((a) => ({
      label: `${a.name} (#${a.id}) — ${a.status}`,
      value: a.id,
    })),
);

async function onTrigger() {
  if (selectedAgents.value.length === 0 || !command.value) return;
  triggering.value = true;
  try {
    const args = argsRaw.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await wazuhApi.runActiveResponse(
      selectedAgents.value,
      command.value,
      args,
    );
    notifySuccess(
      `Triggered ${command.value} on ${selectedAgents.value.length} agent(s)`,
    );
    startPolling();
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message ?? "Trigger failed";
    notifyError(`AR trigger failed: ${msg}`, 5000);
  } finally {
    triggering.value = false;
  }
}

// === AR log polling ===

const log = ref("");
const logLines = 200;
const logLoading = ref(false);
const logPolling = ref(false);
let pollHandle: ReturnType<typeof setInterval> | null = null;
let pollUntil = 0;

async function refreshLog() {
  logLoading.value = true;
  try {
    const targetAgent = selectedAgents.value[0] ?? "";
    log.value = await wazuhApi.getActiveResponseLog(targetAgent, logLines);
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message ?? "Read log failed";
    notifyError(`Could not read AR log: ${msg}`, 4000);
  } finally {
    logLoading.value = false;
  }
}

function startPolling() {
  pollUntil = Date.now() + 30_000;
  if (pollHandle) clearInterval(pollHandle);
  logPolling.value = true;
  // Immediate refresh, then every 2s.
  refreshLog();
  pollHandle = setInterval(() => {
    if (Date.now() > pollUntil) {
      stopPolling();
      return;
    }
    refreshLog();
  }, 2000);
}

function stopPolling() {
  if (pollHandle) {
    clearInterval(pollHandle);
    pollHandle = null;
  }
  logPolling.value = false;
}

onMounted(async () => {
  if (!wazuhStore.wazuhAgents.length) {
    try {
      await wazuhStore.fetchAgents();
    } catch {
      // store surfaces its own errors
    }
  }
});

onBeforeUnmount(() => {
  stopPolling();
});
</script>

<style scoped>
.ar-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1100px) {
  .ar-grid {
    grid-template-columns: 1fr;
  }
}

.ar-card {
  border-radius: var(--mdm-radius, 6px);
}

.ar-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.ar-card-hint {
  margin: 4px 0 12px;
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
}

.ar-input {
  margin-bottom: 8px;
}

.ar-quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 0 8px;
}

.ar-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.ar-log-card {
  display: flex;
  flex-direction: column;
}

.ar-log-shell {
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  background: var(--mdm-bg, #f9fafb);
  flex: 1;
  min-height: 240px;
  max-height: 420px;
  overflow: auto;
}

.ar-log {
  margin: 0;
  padding: 10px 12px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.ar-log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 13px;
}
</style>
