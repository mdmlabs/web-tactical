<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="delivery-jobs-dialog">
      <!-- Header -->
      <q-bar class="dialog-bar">
        <span class="dialog-title">Delivery Jobs</span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <!-- Content -->
      <q-card-section class="dialog-content">
        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <q-spinner-dots size="40px" color="primary" />
          <p>Loading delivery jobs...</p>
        </div>

        <!-- Jobs Table -->
        <q-table
          v-else
          :rows="jobs"
          :columns="columns"
          row-key="id"
          flat
          class="jobs-table"
          :pagination="{ rowsPerPage: 10 }"
          hide-pagination
        >
          <!-- Status -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="props.row.status"
              />
            </q-td>
          </template>

          <!-- Progress -->
          <template v-slot:body-cell-progress="props">
            <q-td :props="props">
              <div class="progress-cell">
                <q-linear-progress
                  :value="getProgressValue(props.row)"
                  :color="getProgressColor(props.row.status)"
                  size="20px"
                  class="progress-bar"
                >
                  <div class="absolute-full flex flex-center">
                    <span class="progress-text">
                      {{ props.row.resultsSummary.success }}/{{ props.row.resultsSummary.total }}
                    </span>
                  </div>
                </q-linear-progress>
              </div>
            </q-td>
          </template>

          <!-- Target Type -->
          <template v-slot:body-cell-target="props">
            <q-td :props="props">
              <q-chip dense outline size="sm" :icon="getTargetIcon(props.row.targetType)">
                {{ props.row.targetType }}
              </q-chip>
            </q-td>
          </template>

          <!-- Actions -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" auto-width>
              <q-btn
                flat
                round
                dense
                icon="visibility"
                size="sm"
                color="primary"
                @click="viewJobDetails(props.row)"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.resultsSummary.failed > 0"
                flat
                round
                dense
                icon="refresh"
                size="sm"
                color="warning"
                @click="retryJob(props.row)"
              >
                <q-tooltip>Retry Failed</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <!-- Empty state -->
          <template v-slot:no-data>
            <div class="empty-state">
              <q-icon name="inventory" size="48px" color="grey-4" />
              <p class="empty-text">No delivery jobs yet</p>
              <p class="empty-hint">Deploy policy to devices to create delivery jobs</p>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Close" @click="close" class="action-btn" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchDeliveryJobs, retryFailedDeliveries, type DeliveryJob } from "@/api/fileDelivery";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const loading = ref(false);
const jobs = ref<DeliveryJob[]>([]);

const columns = [
  { name: "id", label: "ID", field: "id", align: "left" as const },
  { name: "name", label: "NAME", field: "name", align: "left" as const },
  { name: "fileAssetName", label: "FILE", field: "fileAssetName", align: "left" as const },
  { name: "status", label: "STATUS", field: "status", align: "center" as const },
  { name: "progress", label: "PROGRESS", field: "progress", align: "center" as const },
  { name: "target", label: "TARGET", field: "target", align: "left" as const },
  { name: "createdTime", label: "CREATED", field: "createdTime", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

// Load jobs when dialog opens
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await loadJobs();
    }
  }
);

async function loadJobs() {
  loading.value = true;
  try {
    jobs.value = await fetchDeliveryJobs();
  } catch (err) {
    console.error("[DeliveryJobsDialog] failed to load jobs:", err);
  } finally {
    loading.value = false;
  }
}

async function retryJob(job: DeliveryJob) {
  try {
    await retryFailedDeliveries(job.id);
    await loadJobs();
  } catch (err) {
    console.error("[DeliveryJobsDialog] retry failed:", err);
  }
}

function viewJobDetails(job: DeliveryJob) {
  // TODO: Open job details dialog or navigate to job details page
  console.log("View job details:", job);
}

function close() {
  emit("update:modelValue", false);
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "grey",
    in_progress: "blue",
    completed: "positive",
    failed: "negative",
  };
  return colors[status] || "grey";
}

function getProgressColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "grey",
    in_progress: "blue",
    completed: "positive",
    failed: "warning",
  };
  return colors[status] || "grey";
}

function getProgressValue(job: DeliveryJob): number {
  if (job.resultsSummary.total === 0) return 0;
  return job.resultsSummary.success / job.resultsSummary.total;
}

function getTargetIcon(targetType: string): string {
  const icons: Record<string, string> = {
    agents: "devices",
    site: "domain",
    client: "business",
  };
  return icons[targetType] || "devices";
}
</script>

<style scoped>
.delivery-jobs-dialog {
  width: 900px;
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 8px;
}

.dialog-bar {
  background: var(--primary-color, #1976d2);
  color: white;
  padding: 12px 16px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
}

.dialog-content {
  padding: 16px;
  min-height: 300px;
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
  color: var(--text-secondary, #6b7280);
}

.jobs-table {
  box-shadow: none;
}

.jobs-table :deep(th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-cell {
  min-width: 120px;
}

.progress-bar {
  border-radius: 4px;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 8px;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  margin: 0;
}

.empty-hint {
  font-size: 13px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

.dialog-actions {
  padding: 16px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  padding: 8px 24px;
}

/* Dark theme */
.body--dark .delivery-jobs-dialog {
  --border-color: #2d2d3a;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}
</style>
