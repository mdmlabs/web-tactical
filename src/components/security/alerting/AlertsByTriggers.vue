<template>
  <div class="wz-alerts-page">
    <div class="wz-panel">
      <!-- Header -->
      <div class="wz-panel__header">
        <h2 class="wz-panel__title">Alerts by triggers</h2>
        <div class="wz-panel__actions">
          <button class="wz-btn wz-btn--outline" :disabled="selectedAlertIds.length === 0">View alert details</button>
          <button class="wz-btn wz-btn--outline" :disabled="selectedAlertIds.length === 0" @click="doAcknowledge">Acknowledge</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="wz-filter-bar">
        <div class="wz-search-wrap">
          <q-icon name="search" size="18px" class="wz-search-icon" />
          <input v-model="store.alertsSearch" class="wz-search-input" placeholder="Search" />
        </div>
        <select v-model="store.alertsSeverityFilter" class="wz-select">
          <option value="all">All severity levels</option>
          <option value="1">1 (Highest)</option>
          <option value="2">2 (High)</option>
          <option value="3">3 (Medium)</option>
          <option value="4">4 (Low)</option>
          <option value="5">5 (Lowest)</option>
        </select>
        <select v-model="store.alertsStatusFilter" class="wz-select">
          <option value="all">All alerts</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="error">Errors</option>
        </select>
      </div>

      <!-- Table -->
      <table class="wz-table">
        <thead>
          <tr>
            <th class="wz-table__check"><input type="checkbox" @change="toggleAllAlerts" /></th>
            <th>Alerts</th>
            <th>Active</th>
            <th>Acknowledged</th>
            <th>Errors</th>
            <th class="wz-table__sortable">Trigger name</th>
            <th class="wz-table__sortable">Trigger start ti...</th>
            <th>Trigger last updat...</th>
            <th>Severity</th>
            <th>Monitor name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.alertsLoading">
            <td colspan="10" class="wz-table__loading">
              <q-spinner size="24px" color="primary" />
            </td>
          </tr>
          <tr v-else-if="store.filteredAlerts.length === 0">
            <td colspan="10" class="wz-table__empty">
              <p>There are no existing alerts. Create a monitor to add triggers and actions. Once an alarm is triggered, the state will show in this table.</p>
              <button class="wz-btn wz-btn--primary" @click="goCreateMonitor">Create monitor</button>
            </td>
          </tr>
          <tr v-for="alert in store.filteredAlerts" :key="alert.id" v-else>
            <td class="wz-table__check">
              <input type="checkbox" :checked="selectedAlertIds.includes(alert.id)" @change="toggleAlert(alert.id)" />
            </td>
            <td>{{ alert.state }}</td>
            <td>{{ alert.state === 'active' ? '1' : '0' }}</td>
            <td>{{ alert.state === 'acknowledged' ? '1' : '0' }}</td>
            <td>{{ alert.state === 'error' ? '1' : '0' }}</td>
            <td>{{ alert.trigger_name }}</td>
            <td>{{ formatDate(alert.start_time) }}</td>
            <td>{{ formatDate(alert.last_notification_time) }}</td>
            <td>{{ severityLabel(alert.severity) }}</td>
            <td>{{ alert.monitor_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import { severityLabel } from "@/types/alerting";

const store = useAlertingStore();
const selectedAlertIds = ref<string[]>([]);

function toggleAlert(id: string) {
  const idx = selectedAlertIds.value.indexOf(id);
  if (idx >= 0) selectedAlertIds.value.splice(idx, 1);
  else selectedAlertIds.value.push(id);
}

function toggleAllAlerts(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  selectedAlertIds.value = checked ? store.filteredAlerts.map((a) => a.id) : [];
}

function doAcknowledge() {
  if (selectedAlertIds.value.length > 0) {
    store.acknowledgeAlerts(selectedAlertIds.value);
    selectedAlertIds.value = [];
  }
}

function goCreateMonitor() {
  store.openCreateMonitor();
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
</script>

<style scoped>
.wz-alerts-page { padding: 24px; }

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
}

.wz-panel__title {
  font-size: 20px;
  font-weight: 400;
  color: #1a1c21;
  margin: 0;
}

.wz-panel__actions { display: flex; gap: 8px; }

.wz-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px 12px;
}

.wz-search-wrap {
  flex: 1;
  position: relative;
}

.wz-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #69707d;
}

.wz-search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
}

.wz-search-input:focus { outline: none; border-color: #006bb4; }

.wz-select {
  padding: 8px 28px 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
  appearance: auto;
}

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
.wz-btn--outline:disabled { opacity: 0.5; cursor: default; }

.wz-btn--primary {
  background: #006bb4;
  color: #fff;
  border: 1px solid #006bb4;
}

.wz-btn--primary:hover { background: #005a9e; }

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

.wz-table__check { width: 32px; text-align: center; }
.wz-table__sortable { cursor: pointer; }

.wz-table__empty {
  text-align: center;
  padding: 40px 24px !important;
  color: #69707d;
}

.wz-table__empty p {
  margin-bottom: 16px;
  font-size: 14px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.wz-table__loading { text-align: center; padding: 40px !important; }

.body--dark .wz-panel { background: #1d1e24; border-color: #343741; }
.body--dark .wz-panel__title { color: #dfe5ef; }
.body--dark .wz-search-input { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-select { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-btn--outline { background: #25262b; border-color: #343741; color: #dfe5ef; }
</style>
