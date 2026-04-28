<!--
  Hub for the dashboards-server Reports plugin (saved-search / dashboard /
  visualization → CSV/PDF/PNG, scheduling, email delivery).

  Two tabs:
    - Reports     : history of generated instances (Feature 1)
    - Definitions : managed templates / schedules    (Feature 4)

  Creation goes through ReportDefinitionDialog; edit reuses the same
  component with `definitionId` prop set.
-->
<template>
  <div class="reporting-hub">
    <div class="rh-header">
      <div>
        <div class="rh-header__title">Reporting</div>
        <div class="rh-header__subtitle">
          Generated reports and the schedules that produce them
        </div>
      </div>
      <q-space />
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="New report"
        class="rh-new-btn"
        @click="openCreateDialog"
      />
    </div>

    <q-tabs
      v-model="tab"
      class="rh-tabs"
      align="left"
      no-caps
      dense
      indicator-color="primary"
      active-color="primary"
    >
      <q-tab name="reports" :label="`Reports (${instances.items.length})`" />
      <q-tab
        name="definitions"
        :label="`Definitions (${definitions.items.length})`"
      />
    </q-tabs>
    <q-separator class="rh-tabs-sep" />

    <q-tab-panels v-model="tab" animated keep-alive class="rh-panels">
      <q-tab-panel name="reports" class="rh-panel">
        <div class="rh-toolbar">
          <q-input
            v-model="reportsSearch"
            dense
            outlined
            placeholder="Search reports..."
            class="rh-search"
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
            :loading="instances.loading"
            @click="loadInstances"
          >
            <q-tooltip>Refresh</q-tooltip>
          </q-btn>
        </div>

        <q-banner
          v-if="instances.error"
          class="rh-banner bg-red-1 text-red-9 q-mb-md"
          dense
          rounded
        >
          <template #avatar>
            <q-icon name="error_outline" color="negative" />
          </template>
          Failed to load reports: {{ instances.error }}
        </q-banner>

        <div class="rh-card">
          <q-table
            :rows="filteredInstances"
            :columns="instanceColumns"
            row-key="id"
            flat
            dense
            :loading="instances.loading"
            v-model:pagination="instancePagination"
            class="rh-table"
            separator="horizontal"
            no-data-label="No reports have been generated yet"
          >
            <template #body-cell-reportName="props">
              <q-td :props="props">
                <router-link
                  :to="{
                    name: 'SecurityReportingInstanceDetails',
                    params: { id: props.row.id },
                  }"
                  class="rh-name-link"
                >
                  {{ props.row.reportName }}
                </router-link>
              </q-td>
            </template>

            <template #body-cell-format="props">
              <q-td :props="props">
                <span class="rh-format">{{ formatLabel(props.row.format) }}</span>
              </q-td>
            </template>

            <template #body-cell-createdTimeMs="props">
              <q-td :props="props">{{ formatDate(props.row.createdTimeMs) }}</q-td>
            </template>

            <template #body-cell-state="props">
              <q-td :props="props">
                <span
                  class="rh-state"
                  :class="`rh-state--${stateClass(props.row.state)}`"
                >
                  {{ props.row.state }}
                </span>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="download"
                  color="primary"
                  :loading="downloadingId === props.row.id"
                  :disable="!isDownloadable(props.row)"
                  @click="onDownload(props.row)"
                >
                  <q-tooltip>{{
                    isDownloadable(props.row) ? "Download" : "Not ready yet"
                  }}</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="definitions" class="rh-panel">
        <div class="rh-toolbar">
          <q-input
            v-model="definitionsSearch"
            dense
            outlined
            placeholder="Search definitions..."
            class="rh-search"
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
            :loading="definitions.loading"
            @click="loadDefinitions"
          >
            <q-tooltip>Refresh</q-tooltip>
          </q-btn>
        </div>

        <q-banner
          v-if="definitions.error"
          class="rh-banner bg-red-1 text-red-9 q-mb-md"
          dense
          rounded
        >
          <template #avatar>
            <q-icon name="error_outline" color="negative" />
          </template>
          Failed to load definitions: {{ definitions.error }}
        </q-banner>

        <div class="rh-card">
          <q-table
            :rows="filteredDefinitions"
            :columns="definitionColumns"
            row-key="id"
            flat
            dense
            :loading="definitions.loading"
            v-model:pagination="definitionPagination"
            class="rh-table"
            separator="horizontal"
            no-data-label="No report definitions yet — create one with “New report”"
          >
            <template #body-cell-name="props">
              <q-td :props="props">
                <router-link
                  :to="{
                    name: 'SecurityReportingDefinitionDetails',
                    params: { id: props.row.id },
                  }"
                  class="rh-name-link"
                >
                  {{ props.row.name }}
                </router-link>
              </q-td>
            </template>

            <template #body-cell-format="props">
              <q-td :props="props">
                <span class="rh-format">{{ formatLabel(props.row.format) }}</span>
              </q-td>
            </template>

            <template #body-cell-triggerType="props">
              <q-td :props="props">
                <span
                  class="rh-trigger"
                  :class="
                    props.row.triggerType === 'Schedule'
                      ? 'rh-trigger--schedule'
                      : 'rh-trigger--ondemand'
                  "
                >
                  {{ props.row.triggerType }}
                </span>
              </q-td>
            </template>

            <template #body-cell-enabled="props">
              <q-td :props="props">
                <q-toggle
                  v-if="props.row.triggerType === 'Schedule'"
                  :model-value="props.row.enabled"
                  size="sm"
                  color="primary"
                  :disable="busyDefinitionId === props.row.id"
                  @update:model-value="onToggle(props.row)"
                />
                <span v-else class="text-grey-6">—</span>
              </q-td>
            </template>

            <template #body-cell-lastUpdatedMs="props">
              <q-td :props="props">{{ formatDate(props.row.lastUpdatedMs) }}</q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="rh-actions-cell">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="play_arrow"
                  color="primary"
                  :loading="busyDefinitionId === props.row.id"
                  @click="onRunNow(props.row)"
                >
                  <q-tooltip>Run now</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="edit"
                  color="grey-8"
                  @click="openEditDialog(props.row.id)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="delete"
                  color="negative"
                  :loading="busyDefinitionId === props.row.id"
                  @click="onDelete(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { downloadReportInstance } from "@/api/reportingPlugin";
import { extractWazuhError } from "@/api/wazuhReporting";
import { useReportInstancesStore } from "@/stores/reportInstances";
import { useReportDefinitionsStore } from "@/stores/reportDefinitions";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { ReportInstance } from "@/types/reportInstance";
import type { ReportDefinitionSummary } from "@/types/reportDefinition";
import ReportDefinitionDialog from "@/components/security/reporting/ReportDefinitionDialog.vue";

const $q = useQuasar();
const instances = useReportInstancesStore();
const definitions = useReportDefinitionsStore();

const tab = ref<"reports" | "definitions">("reports");
const reportsSearch = ref("");
const definitionsSearch = ref("");
const instancePagination = ref({ rowsPerPage: 20, page: 1 });
const definitionPagination = ref({ rowsPerPage: 20, page: 1 });
const busyDefinitionId = ref<string | null>(null);
const downloadingId = ref<string | null>(null);

const instanceColumns = [
  {
    name: "reportName",
    label: "Name",
    field: "reportName",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "reportSource",
    label: "Source",
    field: "reportSource",
    align: "left" as const,
    sortable: true,
    style: "width: 160px",
  },
  {
    name: "format",
    label: "Type",
    field: "format",
    align: "left" as const,
    sortable: true,
    style: "width: 90px",
  },
  {
    name: "createdTimeMs",
    label: "Creation time",
    field: "createdTimeMs",
    align: "left" as const,
    sortable: true,
    style: "width: 200px",
  },
  {
    name: "state",
    label: "State",
    field: "state",
    align: "left" as const,
    sortable: true,
    style: "width: 110px",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
    style: "width: 90px",
  },
];

const definitionColumns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "source",
    label: "Source",
    field: "source",
    align: "left" as const,
    sortable: true,
    style: "width: 160px",
  },
  {
    name: "format",
    label: "Type",
    field: "format",
    align: "left" as const,
    sortable: true,
    style: "width: 90px",
  },
  {
    name: "triggerType",
    label: "Trigger",
    field: "triggerType",
    align: "left" as const,
    sortable: true,
    style: "width: 130px",
  },
  {
    name: "enabled",
    label: "Active",
    field: "enabled",
    align: "left" as const,
    sortable: true,
    style: "width: 90px",
  },
  {
    name: "lastUpdatedMs",
    label: "Last updated",
    field: "lastUpdatedMs",
    align: "left" as const,
    sortable: true,
    style: "width: 200px",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
    style: "width: 140px",
  },
];

const filteredInstances = computed(() => {
  if (!reportsSearch.value) return instances.items;
  const q = reportsSearch.value.toLowerCase();
  return instances.items.filter((r) => r.reportName.toLowerCase().includes(q));
});

const filteredDefinitions = computed(() => {
  if (!definitionsSearch.value) return definitions.items;
  const q = definitionsSearch.value.toLowerCase();
  return definitions.items.filter((d) => d.name.toLowerCase().includes(q));
});

async function onDownload(row: ReportInstance) {
  if (!isDownloadable(row) || downloadingId.value) return;
  downloadingId.value = row.id;
  try {
    await downloadReportInstance(row);
  } catch (err) {
    notifyError(`Download failed: ${extractWazuhError(err)}`);
  } finally {
    downloadingId.value = null;
  }
}

function formatLabel(format: string): string {
  return format ? format.toUpperCase() : "—";
}

function formatDate(ms: number): string {
  if (!ms) return "—";
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

// "Shared" / "Created" / "Success" → ok, "Pending" → busy, "Error" → bad
function stateClass(state: string): "ok" | "busy" | "bad" | "neutral" {
  const s = (state || "").toLowerCase();
  if (s === "shared" || s === "created" || s === "success") return "ok";
  if (s === "pending" || s === "executing") return "busy";
  if (s === "error" || s === "failed") return "bad";
  return "neutral";
}

function isDownloadable(row: ReportInstance): boolean {
  return stateClass(row.state) === "ok";
}

async function loadInstances() {
  await instances.reload();
}

async function loadDefinitions() {
  await definitions.reload();
}

async function loadAll() {
  await Promise.all([loadInstances(), loadDefinitions()]);
}

function openCreateDialog() {
  $q.dialog({ component: ReportDefinitionDialog }).onOk(() => {
    void loadAll();
  });
}

function openEditDialog(id: string) {
  $q.dialog({
    component: ReportDefinitionDialog,
    componentProps: { definitionId: id },
  }).onOk(() => {
    void loadAll();
  });
}

async function onRunNow(row: ReportDefinitionSummary) {
  busyDefinitionId.value = row.id;
  try {
    await definitions.runNow(row.id);
    notifySuccess(`Generating "${row.name}"...`);
    // The new instance lands asynchronously; reload after a short delay
    // to give the dashboards-server time to flush it.
    setTimeout(() => void loadInstances(), 1500);
  } catch (err) {
    notifyError(`Run failed: ${extractWazuhError(err)}`);
  } finally {
    busyDefinitionId.value = null;
  }
}

function onDelete(row: ReportDefinitionSummary) {
  $q.dialog({
    title: "Delete definition",
    message: `Delete "${row.name}"? Generated reports remain available.`,
    cancel: true,
    persistent: true,
    ok: { color: "negative", label: "Delete", noCaps: true },
  }).onOk(async () => {
    busyDefinitionId.value = row.id;
    try {
      await definitions.remove(row.id);
      notifySuccess("Definition deleted");
    } catch (err) {
      notifyError(`Delete failed: ${extractWazuhError(err)}`);
    } finally {
      busyDefinitionId.value = null;
    }
  });
}

async function onToggle(row: ReportDefinitionSummary) {
  busyDefinitionId.value = row.id;
  try {
    await definitions.toggleEnabled(row.id);
    notifySuccess(row.enabled ? "Schedule disabled" : "Schedule enabled");
  } catch (err) {
    notifyError(`Toggle failed: ${extractWazuhError(err)}`);
  } finally {
    busyDefinitionId.value = null;
  }
}

defineExpose({ loadAll });

onMounted(() => loadAll());
</script>

<style scoped>
.reporting-hub {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

.rh-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.rh-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.rh-header__subtitle {
  font-size: 13px;
  color: var(--mdm-text-secondary, #69707d);
  margin-top: 2px;
}

.rh-tabs {
  background: transparent;
  margin-bottom: 0;
}

.rh-tabs :deep(.q-tab) {
  font-size: 13px;
  font-weight: 600;
  min-height: 36px;
  padding: 0 14px;
}

.rh-tabs-sep {
  margin-bottom: 12px;
}

.rh-panels {
  background: transparent;
}

.rh-panel {
  padding: 0;
}

.rh-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rh-search {
  width: 300px;
}

.rh-new-btn {
  font-weight: 600;
  border-radius: var(--mdm-radius, 6px);
}

.rh-banner {
  border-radius: var(--mdm-radius, 6px);
}

.rh-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  overflow: hidden;
}

.rh-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 10px 14px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.rh-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 14px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.rh-name-link {
  color: var(--mdm-primary, #2563eb);
  text-decoration: none;
  font-weight: 600;
}

.rh-name-link:hover {
  text-decoration: underline;
}

.rh-name-link--disabled {
  color: var(--mdm-text-secondary, #69707d);
  cursor: not-allowed;
  pointer-events: none;
}

.rh-format {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  background: var(--mdm-bg-sidebar, #fafbfc);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: var(--mdm-radius-sm, 4px);
}

.rh-trigger {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  border-radius: 999px;
}

.rh-trigger--schedule {
  color: #1d4ed8;
  background: rgba(29, 78, 216, 0.12);
}

.rh-trigger--ondemand {
  color: var(--mdm-text-secondary, #69707d);
  background: var(--mdm-bg-sidebar, #fafbfc);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
}

.rh-state {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.rh-state--ok {
  color: var(--mdm-success, #16a34a);
  background: rgba(22, 163, 74, 0.12);
}

.rh-state--busy {
  color: var(--mdm-warning, #ca8a04);
  background: rgba(202, 138, 4, 0.12);
}

.rh-state--bad {
  color: var(--mdm-danger, #dc2626);
  background: rgba(220, 38, 38, 0.12);
}

.rh-state--neutral {
  color: var(--mdm-text-secondary, #69707d);
  background: var(--mdm-bg-sidebar, #fafbfc);
}

.rh-actions-cell {
  white-space: nowrap;
}
</style>

<style>
.body--dark .rh-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .rh-table .q-table th {
  background: var(--mdm-bg-sidebar, #0f1729);
}

.body--dark .rh-format,
.body--dark .rh-trigger--ondemand {
  background: var(--mdm-bg-sidebar, #0f1729);
  border-color: var(--mdm-border, #1e293b);
}
</style>
