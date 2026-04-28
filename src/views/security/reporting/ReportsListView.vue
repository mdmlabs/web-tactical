<template>
  <div class="reports-list">
    <!-- Header -->
    <div class="rl-header">
      <div>
        <div class="rl-header__title">Reporting ({{ reports.length }})</div>
        <div class="rl-header__subtitle">
          Generated reports are stored on the server
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rl-toolbar">
      <q-input
        v-model="searchText"
        dense
        outlined
        placeholder="Search reports..."
        class="rl-search"
        clearable
      >
        <template #prepend><q-icon name="search" size="18px" /></template>
      </q-input>
      <q-space />
      <q-btn
        flat
        dense
        icon="refresh"
        color="grey-7"
        :loading="loading"
        @click="loadReports"
      >
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </div>

    <!-- Reports Table -->
    <div class="rl-card">
      <q-table
        :rows="filteredReports"
        :columns="columns"
        row-key="name"
        flat
        dense
        :loading="loading"
        :pagination="pagination"
        @update:pagination="pagination = $event"
        class="rl-table"
        separator="horizontal"
        no-data-label="No reports have been generated yet"
      >
        <!-- File -->
        <template #body-cell-name="props">
          <q-td :props="props">
            <a
              :href="downloadUrl(props.row.name)"
              :download="displayName(props.row.name)"
              target="_blank"
              rel="noopener"
              class="rl-name-link"
            >
              {{ displayName(props.row.name) }}
            </a>
          </q-td>
        </template>

        <!-- Size -->
        <template #body-cell-size="props">
          <q-td :props="props">
            {{ formatSize(props.row.size) }}
          </q-td>
        </template>

        <!-- Created -->
        <template #body-cell-date="props">
          <q-td :props="props">
            {{ formatDate(props.row.date) }}
          </q-td>
        </template>

        <!-- Actions -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              size="sm"
              icon="download"
              color="primary"
              :href="downloadUrl(props.row.name)"
              :download="displayName(props.row.name)"
              target="_blank"
              rel="noopener"
            >
              <q-tooltip>Download</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              size="sm"
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row.name)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Delete Confirm Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Delete Report</div></q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to delete <strong>"{{ displayName(reportToDelete) }}"</strong>?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancel" />
          <q-btn
            flat
            label="Delete"
            color="negative"
            :loading="deleting"
            @click="doDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { notifyError, notifySuccess } from "@/utils/notify";
import {
  deleteReport,
  extractWazuhError,
  listReports,
  reportDownloadUrl,
  type WazuhReportListItem,
} from "@/api/wazuhReporting";

const reports = ref<WazuhReportListItem[]>([]);
const loading = ref(false);
const searchText = ref("");
const pagination = ref({ rowsPerPage: 20, page: 1 });

const columns = [
  {
    name: "name",
    label: "File",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "size",
    label: "Size",
    field: "size",
    align: "right" as const,
    sortable: true,
    style: "width: 120px",
  },
  {
    name: "date",
    label: "Created",
    field: "date",
    align: "left" as const,
    sortable: true,
    style: "width: 200px",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
    style: "width: 120px",
  },
];

const filteredReports = computed(() => {
  if (!searchText.value) return reports.value;
  const q = searchText.value.toLowerCase();
  return reports.value.filter((r) => displayName(r.name).toLowerCase().includes(q));
});

function downloadUrl(name: string) {
  return reportDownloadUrl(name);
}

function displayName(name: string): string {
  return name ? name.replace(/^wazuh-/i, "") : name;
}

function formatSize(bytes: number): string {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatDate(d: string): string {
  if (!d) return "—";
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleString();
}

// expose for parent layout refresh button
defineExpose({ loadData: loadReports });

async function loadReports() {
  loading.value = true;
  try {
    reports.value = await listReports();
  } catch (err) {
    notifyError(`Failed to load reports: ${extractWazuhError(err)}`);
  } finally {
    loading.value = false;
  }
}

const showDeleteDialog = ref(false);
const reportToDelete = ref("");
const deleting = ref(false);

function confirmDelete(name: string) {
  reportToDelete.value = name;
  showDeleteDialog.value = true;
}

async function doDelete() {
  if (!reportToDelete.value) return;
  deleting.value = true;
  try {
    await deleteReport(reportToDelete.value);
    notifySuccess(`Deleted ${displayName(reportToDelete.value)}`);
    reports.value = reports.value.filter((r) => r.name !== reportToDelete.value);
    showDeleteDialog.value = false;
    reportToDelete.value = "";
  } catch (err) {
    notifyError(`Failed to delete report: ${extractWazuhError(err)}`);
  } finally {
    deleting.value = false;
  }
}

onMounted(() => loadReports());
</script>

<style scoped>
.reports-list {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

.rl-header {
  margin-bottom: 12px;
}

.rl-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.rl-header__subtitle {
  font-size: 13px;
  color: var(--mdm-text-secondary, #69707d);
  margin-top: 2px;
}

.rl-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rl-search {
  width: 300px;
}

.rl-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  overflow: hidden;
}

.rl-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 10px 14px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.rl-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 14px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.rl-name-link {
  color: var(--mdm-primary, #2563eb);
  text-decoration: none;
  font-weight: 600;
}

.rl-name-link:hover {
  text-decoration: underline;
}
</style>

<style>
.body--dark .rl-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .rl-table .q-table th {
  background: var(--mdm-bg-sidebar, #0f1729);
}
</style>
