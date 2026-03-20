<template>
  <div class="assigned-devices">
    <div class="section-header">
      <h3 class="section-title">Assigned devices</h3>
      <div class="header-actions">
        <q-btn
          flat
          dense
          color="primary"
          label="View Jobs"
          class="view-btn"
          @click="$emit('view-jobs')"
        />
        <q-btn
          flat
          dense
          color="primary"
          label="View"
          class="view-btn"
          @click="$emit('view-all')"
        />
      </div>
    </div>

    <!-- Toolbar -->
    <div class="devices-toolbar">
      <div class="toolbar-left">
        <q-btn
          unelevated
          color="primary"
          class="assign-btn"
          @click="$emit('assign')"
        >
          <q-icon name="add" size="18px" class="q-mr-xs" />
          Assign to device
        </q-btn>

        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search"
          class="search-input"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn outline dense class="filter-btn">
          <q-icon name="filter_list" size="18px" class="q-mr-xs" />
          Filter
        </q-btn>
      </div>

      <div class="toolbar-right">
        <q-btn flat dense class="action-btn" @click="$emit('refresh')">
          <q-icon name="refresh" size="18px" class="q-mr-xs" />
          Refresh
        </q-btn>
        <q-btn flat dense class="action-btn">
          <q-icon name="tune" size="18px" class="q-mr-xs" />
          Options
        </q-btn>
      </div>
    </div>

    <!-- Table -->
    <q-table
      :rows="filteredDevices"
      :columns="columns"
      row-key="id"
      flat
      class="devices-table"
      :pagination="{ rowsPerPage: 10 }"
      hide-pagination
    >
      <!-- Device name -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <span class="device-name">{{ props.row.name }}</span>
        </q-td>
      </template>

      <!-- Status -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="getStatusColor(props.row.status)"
            :label="props.row.status || 'Unknown'"
          />
        </q-td>
      </template>

      <!-- Battery (hidden until API provides data) -->
      <!-- <template v-slot:body-cell-battery="props">
        <q-td :props="props">
          <div class="battery-cell">
            <q-icon
              :name="getBatteryIcon(props.row.battery)"
              :color="getBatteryColor(props.row.battery)"
              size="18px"
            />
            <span>{{ props.row.battery }}%</span>
          </div>
        </q-td>
      </template> -->

      <!-- Actions -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn
            flat
            round
            dense
            icon="close"
            size="sm"
            color="grey"
            @click.stop="$emit('unassign', props.row.id)"
          >
            <q-tooltip>Remove assignment</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Empty state -->
      <template v-slot:no-data>
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <path
                d="M10 30 Q20 10 30 20 Q40 30 50 20 Q60 10 70 30"
                stroke="#d1d5db"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <p class="empty-text">Nothing here</p>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Device } from "../types/policies";
import { fetchDeliveryJobs, type DeliveryJob, type DeliveryResultStatus } from "@/api/fileDelivery";
// import { formatRelativeTime } from '../mocks/policiesMockData';

const props = defineProps<{
  devices: Device[];
}>();

defineEmits<{
  (e: "assign"): void;
  (e: "unassign", deviceId: number): void;
  (e: "refresh"): void;
  (e: "view-all"): void;
  (e: "view-jobs"): void;
}>();

const searchQuery = ref("");
const deliveryJobs = ref<DeliveryJob[]>([]);
const loadingJobs = ref(false);

// Fetch delivery jobs when devices change
watch(() => props.devices, async (newDevices) => {
  if (newDevices.length > 0) {
    await loadDeliveryJobs();
  }
}, { immediate: true });

async function loadDeliveryJobs() {
  loadingJobs.value = true;
  try {
    deliveryJobs.value = await fetchDeliveryJobs();
  } catch (err) {
    console.error("[AssignedDevicesTable] failed to load delivery jobs:", err);
  } finally {
    loadingJobs.value = false;
  }
}

// Get device status from delivery jobs
function getDeviceStatus(deviceId: number): string {
  // Find all jobs targeting this device
  const deviceJobs = deliveryJobs.value.filter(job => 
    job.targetAgents?.includes(deviceId)
  );
  
  if (deviceJobs.length === 0) return "";
  
  // Get the most recent job
  const latestJob = deviceJobs.sort((a, b) => 
    new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  )[0];
  
  return latestJob.status;
}

// Get device delivery result status (more detailed)
function getDeviceDeliveryResultStatus(deviceId: number): DeliveryResultStatus | null {
  const deviceJobs = deliveryJobs.value.filter(job => 
    job.targetAgents?.includes(deviceId)
  );
  
  if (deviceJobs.length === 0) return null;
  
  // Find the most recent job with results
  const latestJob = deviceJobs.sort((a, b) => 
    new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  )[0];
  
  // If job is completed or failed, check individual result status
  if (latestJob.status === "completed" || latestJob.status === "failed") {
    // Return success if any succeeded, failed if all failed
    if (latestJob.resultsSummary.success > 0) return "success";
    if (latestJob.resultsSummary.failed > 0) return "failed";
  }
  
  return latestJob.status as DeliveryResultStatus;
}

const filteredDevices = computed(() => {
  let devices = props.devices;
  
  // Add status from delivery jobs
  devices = devices.map(device => ({
    ...device,
    status: getDeviceStatus(device.id) || getDeviceDeliveryResultStatus(device.id) || undefined,
  }));
  
  if (!searchQuery.value) return devices;
  const query = searchQuery.value.toLowerCase();
  return devices.filter(
    (d) =>
      d.name.toLowerCase().includes(query) ||
      d.employee.toLowerCase().includes(query),
  );
});

const columns = [
  { name: "name", label: "DEVICE", field: "name", align: "left" as const },
  { name: "status", label: "STATUS", field: "status", align: "center" as const },
  // { name: 'battery', label: 'BATTERY', field: 'battery', align: 'left' as const },
  // { name: 'employee', label: 'DEVICE EMPLOYEE', field: 'employee', align: 'left' as const },
  // { name: 'policiesCount', label: 'POLICIES', field: 'policiesCount', align: 'left' as const },
  // { name: 'updated', label: 'UPDATED', field: 'updated', align: 'left' as const, format: (val: string) => formatRelativeTime(val) },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

// function getBatteryIcon(level: number): string {
//   if (level > 80) return 'mdi-battery';
//   if (level > 60) return 'mdi-battery-70';
//   if (level > 40) return 'mdi-battery-50';
//   if (level > 20) return 'mdi-battery-30';
//   return 'mdi-battery-10';
// }

// function getBatteryColor(level: number): string {
//   if (level > 50) return 'positive';
//   if (level > 20) return 'warning';
//   return 'negative';
// }

function getStatusColor(status: string | undefined): string {
  if (!status) return "grey";
  const colors: Record<string, string> = {
    pending: "grey",
    in_progress: "blue",
    downloading: "blue",
    installing: "blue",
    verifying: "blue",
    completed: "positive",
    failed: "negative",
    success: "positive",
    error: "negative",
  };
  return colors[status] || "grey";
}
</script>

<style scoped>
.assigned-devices {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn {
  text-transform: none;
  font-weight: 600;
}

.devices-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.assign-btn {
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
}

.search-input {
  min-width: 200px;
  max-width: 280px;
}

.filter-btn {
  text-transform: none;
  font-weight: 500;
  border-color: var(--border-color, #d1d5db);
  padding: 8px 16px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  padding: 8px 12px;
}

.devices-table {
  box-shadow: none;
}

.devices-table :deep(th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-name {
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.battery-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

/* Dark theme */
.body--dark .assigned-devices {
  --card-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}
</style>
