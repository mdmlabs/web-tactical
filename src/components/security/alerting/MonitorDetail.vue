<template>
  <div class="wz-detail-page">
    <!-- Top bar -->
    <div class="wz-detail-topbar">
      <button class="wz-btn-icon" @click="$emit('back')">
        <q-icon name="arrow_back" size="20px" />
      </button>
      <h2 class="wz-detail-topbar__title">{{ monitor?.name || 'Monitor' }}</h2>
      <div class="wz-detail-topbar__actions">
        <button class="wz-btn wz-btn--outline" @click="toggleEnabled">
          {{ monitor?.enabled ? 'Disable' : 'Enable' }}
        </button>
        <button class="wz-btn wz-btn--outline" @click="editMonitor">Edit</button>
        <button class="wz-btn wz-btn--danger-outline" @click="deleteMonitor">Delete</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.currentMonitorLoading" class="wz-detail-loading">
      <q-spinner size="32px" color="primary" />
    </div>

    <template v-else-if="monitor">
      <!-- Overview panel -->
      <div class="wz-panel wz-detail-section">
        <div class="wz-panel__header">
          <h3 class="wz-section-title">Monitor overview</h3>
        </div>
        <div class="wz-detail-grid">
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">Monitor name</span>
            <span class="wz-detail-value">{{ monitor.name }}</span>
          </div>
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">Monitor type</span>
            <span class="wz-detail-value">{{ monitorTypeLabel(monitor.type) }}</span>
          </div>
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">Monitor definition method</span>
            <span class="wz-detail-value">{{ definitionLabel(monitor.definition_method) }}</span>
          </div>
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">State</span>
            <span class="wz-badge" :class="monitor.enabled ? 'wz-badge--enabled' : 'wz-badge--disabled'">
              {{ monitor.enabled ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">Schedule</span>
            <span class="wz-detail-value">Every {{ monitor.schedule.period.interval }} {{ monitor.schedule.period.unit }}</span>
          </div>
          <div class="wz-detail-grid__item">
            <span class="wz-detail-label">Last updated</span>
            <span class="wz-detail-value">{{ formatDate(monitor.last_update_time) }}</span>
          </div>
        </div>
      </div>

      <!-- Triggers panel -->
      <div class="wz-panel wz-detail-section">
        <div class="wz-panel__header">
          <h3 class="wz-section-title">Triggers ({{ monitor.triggers.length }})</h3>
        </div>
        <table class="wz-table" v-if="monitor.triggers.length > 0">
          <thead>
            <tr>
              <th>Trigger name</th>
              <th>Severity</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trigger in monitor.triggers" :key="trigger.id || trigger.name">
              <td>{{ trigger.name }}</td>
              <td>{{ severityLabel(trigger.severity) }}</td>
              <td class="wz-code-cell">{{ trigger.condition.script }}</td>
              <td>{{ trigger.actions.length }} action(s)</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="wz-panel__empty">
          No triggers defined. Edit this monitor to add triggers.
        </div>
      </div>

      <!-- Alert history chart -->
      <div class="wz-panel wz-detail-section">
        <div class="wz-panel__header">
          <h3 class="wz-section-title">Alert history</h3>
          <select v-model="historyRange" class="wz-select wz-select--sm">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
        <div class="wz-history-chart">
          <div class="wz-history-chart__placeholder">
            <div class="wz-history-bars">
              <div
                v-for="(bar, i) in historyBars"
                :key="i"
                class="wz-history-bar"
                :style="{ height: bar.height + '%' }"
                :class="bar.class"
                :title="bar.label"
              />
            </div>
            <div class="wz-history-legend">
              <span class="wz-history-legend__item"><span class="wz-dot wz-dot--alert" /> Triggered</span>
              <span class="wz-history-legend__item"><span class="wz-dot wz-dot--ack" /> Acknowledged</span>
              <span class="wz-history-legend__item"><span class="wz-dot wz-dot--error" /> Error</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts table -->
      <div class="wz-panel wz-detail-section">
        <div class="wz-panel__header">
          <h3 class="wz-section-title">Alerts</h3>
        </div>
        <div v-if="store.currentMonitorAlertsLoading" class="wz-panel__loading">
          <q-spinner size="24px" color="primary" />
        </div>
        <table class="wz-table" v-else-if="store.currentMonitorAlerts.length > 0">
          <thead>
            <tr>
              <th>Alert start time</th>
              <th>Trigger name</th>
              <th>Severity</th>
              <th>State</th>
              <th>Acknowledged time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in store.currentMonitorAlerts" :key="alert.id">
              <td>{{ formatDate(alert.start_time) }}</td>
              <td>{{ alert.trigger_name }}</td>
              <td>{{ severityLabel(alert.severity) }}</td>
              <td>
                <span class="wz-state-badge" :class="'wz-state-badge--' + alert.state">
                  {{ alert.state }}
                </span>
              </td>
              <td>{{ formatDate(alert.acknowledged_time) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="wz-panel__empty">
          No alerts have been triggered for this monitor.
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import { monitorTypeLabel, severityLabel } from "@/types/alerting";

const props = defineProps<{
  monitorId: string;
}>();

defineEmits<{
  (e: "back"): void;
}>();

const store = useAlertingStore();
const historyRange = ref("24h");

const monitor = computed(() => store.currentMonitor);

function definitionLabel(method: string): string {
  switch (method) {
    case "visual": return "Visual editor";
    case "extraction_query": return "Extraction query editor";
    case "anomaly_detector": return "Anomaly detector";
    default: return method;
  }
}

// Simple history bars (visual placeholder since actual data comes from API)
const historyBars = computed(() => {
  const bars = [];
  const count = historyRange.value === "24h" ? 24 : historyRange.value === "7d" ? 7 : 30;
  for (let i = 0; i < count; i++) {
    const h = Math.random() * 60 + 5;
    const classes = ["wz-history-bar--alert", "wz-history-bar--ack", "wz-history-bar--none"];
    bars.push({
      height: h,
      class: classes[Math.floor(Math.random() * classes.length)],
      label: `Period ${i + 1}`,
    });
  }
  return bars;
});

function formatDate(iso?: string): string {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

async function toggleEnabled() {
  if (!monitor.value) return;
  if (monitor.value.enabled) {
    await store.disableMonitors([monitor.value.id]);
  } else {
    await store.enableMonitors([monitor.value.id]);
  }
  store.loadMonitor(props.monitorId);
}

function editMonitor() {
  if (monitor.value) {
    store.openCreateMonitor(monitor.value);
  }
}

async function deleteMonitor() {
  if (!monitor.value) return;
  await store.removeMonitors([monitor.value.id]);
}

function loadDetail() {
  store.loadMonitor(props.monitorId);
  store.loadMonitorAlerts(props.monitorId);
}

watch(() => props.monitorId, loadDetail);
onMounted(loadDetail);
</script>

<style scoped>
.wz-detail-page { padding: 24px; }

.wz-detail-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.wz-detail-topbar__title {
  font-size: 22px;
  font-weight: 400;
  color: #1a1c21;
  margin: 0;
  flex: 1;
}

.wz-detail-topbar__actions { display: flex; gap: 8px; }

.wz-detail-loading { text-align: center; padding: 60px 0; }

.wz-detail-section { margin-bottom: 20px; }

.wz-panel {
  background: #fff;
  border: 1px solid #d3dae6;
  border-radius: 4px;
}

.wz-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #d3dae6;
}

.wz-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1c21;
  margin: 0;
}

.wz-panel__empty {
  padding: 32px 24px;
  text-align: center;
  color: #69707d;
  font-size: 14px;
}

.wz-panel__loading { padding: 32px; text-align: center; }

/* Detail grid */
.wz-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 0;
}

.wz-detail-grid__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px;
  border-bottom: 1px solid #eef1f5;
}

.wz-detail-label {
  font-size: 12px;
  font-weight: 500;
  color: #69707d;
  text-transform: uppercase;
}

.wz-detail-value {
  font-size: 14px;
  color: #343741;
}

/* Badges */
.wz-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.wz-badge--enabled { background: #e6f9f7; color: #017d73; }
.wz-badge--disabled { background: #f5f7fa; color: #69707d; }

.wz-state-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.wz-state-badge--active { background: #fce8e6; color: #bd271e; }
.wz-state-badge--acknowledged { background: #e6f2fb; color: #006bb4; }
.wz-state-badge--error { background: #fef0ef; color: #bd271e; }
.wz-state-badge--completed { background: #e6f9f7; color: #017d73; }
.wz-state-badge--deleted { background: #f5f7fa; color: #69707d; }

/* Table */
.wz-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.wz-table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  color: #69707d;
  font-size: 12px;
  border-bottom: 1px solid #d3dae6;
  background: #f5f7fa;
}

.wz-table td {
  padding: 8px 12px;
  color: #343741;
  border-bottom: 1px solid #eef1f5;
}

.wz-code-cell {
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  color: #69707d;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Buttons */
.wz-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.wz-btn--outline {
  background: #fff;
  border: 1px solid #d3dae6;
  color: #343741;
}

.wz-btn--outline:hover { background: #f5f7fa; }

.wz-btn--danger-outline {
  background: #fff;
  border: 1px solid #bd271e;
  color: #bd271e;
}

.wz-btn--danger-outline:hover { background: #fef0ef; }

.wz-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #69707d;
  border-radius: 4px;
}

.wz-btn-icon:hover { background: #f0f2f5; color: #343741; }

.wz-select {
  padding: 8px 28px 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
  appearance: auto;
}

.wz-select--sm { padding: 4px 24px 4px 8px; font-size: 13px; }

/* History chart */
.wz-history-chart { padding: 16px 24px; }

.wz-history-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 120px;
  border-bottom: 1px solid #d3dae6;
  padding-bottom: 4px;
}

.wz-history-bar {
  flex: 1;
  min-width: 4px;
  border-radius: 2px 2px 0 0;
}

.wz-history-bar--alert { background: #bd271e; }
.wz-history-bar--ack { background: #006bb4; }
.wz-history-bar--none { background: #d3dae6; }

.wz-history-legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #69707d;
}

.wz-history-legend__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.wz-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.wz-dot--alert { background: #bd271e; }
.wz-dot--ack { background: #006bb4; }
.wz-dot--error { background: #f5a623; }

/* Dark mode */
.body--dark .wz-detail-topbar__title { color: #dfe5ef; }
.body--dark .wz-panel { background: #1d1e24; border-color: #343741; }
.body--dark .wz-panel__header { border-color: #343741; }
.body--dark .wz-section-title { color: #dfe5ef; }
.body--dark .wz-detail-grid__item { border-color: #2a2b32; }
.body--dark .wz-detail-label { color: #98a2b3; }
.body--dark .wz-detail-value { color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-btn--outline { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-btn--danger-outline { background: #25262b; }
.body--dark .wz-btn-icon { color: #98a2b3; }
.body--dark .wz-btn-icon:hover { background: #2a2b32; color: #dfe5ef; }
.body--dark .wz-select { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-history-bars { border-color: #343741; }
.body--dark .wz-history-bar--none { background: #343741; }
.body--dark .wz-state-badge--active { background: #3d1515; color: #f5a0a0; }
.body--dark .wz-state-badge--acknowledged { background: #0a2d4d; color: #7dbce8; }
.body--dark .wz-state-badge--completed { background: #0a3d38; color: #7dded5; }
</style>
