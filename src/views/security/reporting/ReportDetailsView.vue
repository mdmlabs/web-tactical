<!--
  Report details / Definition details, mirroring the Wazuh-Dashboard
  Reporting plugin's "Report details" page. Routes:

    /security/reporting/reports/:id      → instance (kind="report")
    /security/reporting/definitions/:id  → definition (kind="definition")

  The two kinds share the same layout — only their data sources differ.
-->
<template>
  <div class="rd-page">
    <div class="rd-header">
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        label="Back to Reporting"
        class="rd-back-btn"
        @click="onBack"
      />
    </div>

    <h1 class="rd-title">{{ kindLabel }} details</h1>

    <q-banner
      v-if="error"
      class="bg-red-1 text-red-9 q-mb-md"
      dense
      rounded
    >
      <template #avatar>
        <q-icon name="error_outline" color="negative" />
      </template>
      Failed to load: {{ error }}
    </q-banner>

    <q-card flat bordered class="rd-card">
      <q-inner-loading :showing="loading">
        <q-spinner-dots size="40px" color="primary" />
      </q-inner-loading>

      <q-card-section v-if="header" class="rd-card__header">
        <div class="rd-name">{{ header.name }}</div>
      </q-card-section>

      <q-separator v-if="header" />

      <q-card-section class="rd-card__body">
        <div class="rd-section-title">Report Settings</div>

        <div class="rd-grid">
          <div class="rd-cell">
            <div class="rd-label">Name</div>
            <div class="rd-value">{{ header?.name ?? "—" }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Description</div>
            <div class="rd-value">{{ header?.description || "—" }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Created</div>
            <div class="rd-value">{{ formatDate(header?.createdMs) }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Last updated</div>
            <div class="rd-value">{{ formatDate(header?.updatedMs) }}</div>
          </div>

          <div class="rd-cell">
            <div class="rd-label">Source</div>
            <div class="rd-value">
              <a
                v-if="header?.sourceUrl"
                :href="header.sourceUrl"
                target="_blank"
                rel="noopener"
                class="rd-link"
              >
                {{ header?.source ?? "—" }}
                <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
              </a>
              <template v-else>{{ header?.source ?? "—" }}</template>
            </div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Record limit</div>
            <div class="rd-value">{{ header?.recordLimit ?? "—" }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Time period</div>
            <div class="rd-value">{{ header?.timePeriod ?? "—" }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">File format</div>
            <div class="rd-value">
              <a
                v-if="canDownload"
                href="#"
                class="rd-link"
                @click.prevent="onDownload"
              >
                {{ formatLabel(header?.format) }}
                <q-spinner v-if="downloading" size="12px" class="q-ml-xs" />
                <q-icon v-else name="download" size="14px" class="q-ml-xs" />
              </a>
              <template v-else>{{ formatLabel(header?.format) }}</template>
            </div>
          </div>

          <div class="rd-cell">
            <div class="rd-label">{{ kind === "report" ? "State" : "Status" }}</div>
            <div class="rd-value">{{ header?.state ?? "—" }}</div>
          </div>
          <div class="rd-cell" />
          <div class="rd-cell" />
          <div class="rd-cell" />

          <div class="rd-cell">
            <div class="rd-label">Report header</div>
            <div class="rd-value">{{ header?.reportHeader || "—" }}</div>
          </div>
          <div class="rd-cell">
            <div class="rd-label">Report footer</div>
            <div class="rd-value">{{ header?.reportFooter || "—" }}</div>
          </div>
          <div class="rd-cell" />
          <div class="rd-cell" />

          <div class="rd-cell">
            <div class="rd-label">Report trigger</div>
            <div class="rd-value">{{ header?.trigger ?? "—" }}</div>
          </div>
          <div class="rd-cell rd-cell--span-3">
            <div v-if="header?.scheduleDetails" class="rd-label">
              Schedule
            </div>
            <div v-if="header?.scheduleDetails" class="rd-value">
              {{ header.scheduleDetails }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  downloadReportInstance,
  getReportDefinition,
  getReportInstanceDetails,
} from "@/api/reportingPlugin";
import { extractWazuhError } from "@/api/wazuhReporting";
import { notifyError } from "@/utils/notify";
import type { ReportDefinitionPayload } from "@/types/reportDefinition";
import type { ReportInstanceDetails } from "@/types/reportInstance";

const props = defineProps<{
  /** "report" for an instance, "definition" for a template. */
  kind: "report" | "definition";
}>();

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const downloading = ref(false);
const instance = ref<ReportInstanceDetails | null>(null);
const definition = ref<ReportDefinitionPayload | null>(null);

const kindLabel = computed(() =>
  props.kind === "report" ? "Report" : "Report definition",
);

interface DetailHeader {
  name: string;
  description: string;
  createdMs: number;
  updatedMs: number;
  source: string;
  sourceUrl?: string;
  recordLimit?: number;
  timePeriod: string;
  format: string;
  state: string;
  reportHeader: string;
  reportFooter: string;
  trigger: string;
  scheduleDetails?: string;
}

function buildSourceUrl(
  source: string,
  ids: { savedSearchId?: string; dashboardId?: string; visualizationId?: string },
): string | undefined {
  // Open the underlying OSD object in a new tab via the same dashboard
  // proxy the rest of the app uses.
  const base =
    typeof window !== "undefined" && window._env_?.PROD_URL
      ? `${window._env_.PROD_URL}/wazuh-dashboard`
      : "/wazuh-dashboard";
  if (source === "Saved search" && ids.savedSearchId) {
    return `${base}/app/data-explorer/discover#/view/${encodeURIComponent(ids.savedSearchId)}`;
  }
  if (source === "Dashboard" && ids.dashboardId) {
    return `${base}/app/dashboards#/view/${encodeURIComponent(ids.dashboardId)}`;
  }
  if (source === "Visualization" && ids.visualizationId) {
    return `${base}/app/visualize#/edit/${encodeURIComponent(ids.visualizationId)}`;
  }
  return undefined;
}

const header = computed<DetailHeader | null>(() => {
  if (props.kind === "report") {
    const i = instance.value;
    if (!i) return null;
    return {
      name: i.reportName,
      description: i.description,
      createdMs: i.createdTimeMs,
      updatedMs: i.lastUpdatedTimeMs,
      source: i.reportSource,
      sourceUrl: buildSourceUrl(i.reportSource, {
        savedSearchId: i.savedSearchId,
        dashboardId: i.dashboardId,
        visualizationId: i.visualizationId,
      }),
      recordLimit: i.recordLimit,
      timePeriod: formatTimePeriod(i.beginTimeMs, i.endTimeMs),
      format: i.format,
      state: i.state,
      reportHeader: i.header,
      reportFooter: i.footer,
      trigger: i.triggerType,
    };
  }
  const d = definition.value;
  if (!d) return null;
  const trigger = d.trigger?.trigger_type ?? "On demand";
  const enabled =
    d.trigger?.trigger_type === "Schedule"
      ? Boolean(d.trigger.trigger_params?.enabled)
      : true;
  return {
    name: d.report_params?.report_name ?? "(unnamed)",
    description: d.report_params?.description ?? "",
    createdMs: d.time_created ?? 0,
    updatedMs: d.last_updated ?? 0,
    source: d.report_params?.report_source ?? "—",
    sourceUrl: buildSourceUrl(d.report_params?.report_source ?? "", {
      savedSearchId: d.report_params?.core_params?.saved_search_id,
      dashboardId: d.report_params?.core_params?.dashboard_id,
      visualizationId: d.report_params?.core_params?.visualization_id,
    }),
    recordLimit: d.report_params?.core_params?.limit,
    timePeriod: d.report_params?.core_params?.time_duration ?? "—",
    format: d.report_params?.core_params?.excel
      ? "xlsx"
      : d.report_params?.core_params?.report_format ?? "",
    state: enabled ? "Active" : "Disabled",
    reportHeader: "",
    reportFooter: "",
    trigger,
    scheduleDetails: describeSchedule(d.trigger),
  };
});

const canDownload = computed(() => {
  if (props.kind !== "report") return false;
  const s = (instance.value?.state || "").toLowerCase();
  return s === "shared" || s === "created" || s === "success";
});

function formatLabel(format?: string): string {
  return format ? format.toUpperCase() : "—";
}

function formatDate(ms?: number): string {
  if (!ms) return "—";
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function formatTimePeriod(from?: number, to?: number): string {
  const fromStr = from ? new Date(from).toLocaleString() : "—";
  const toStr = to ? new Date(to).toLocaleString() : "—";
  return `${fromStr} → ${toStr}`;
}

function describeSchedule(
  trigger: ReportDefinitionPayload["trigger"] | undefined,
): string | undefined {
  if (!trigger || trigger.trigger_type !== "Schedule") return undefined;
  const tp = trigger.trigger_params;
  if (!tp) return undefined;
  if (tp.schedule_type === "Recurring") {
    const i = tp.schedule.interval;
    return `Every ${i.period} ${i.unit.toLowerCase()}, starting ${formatDate(i.start_time)}`;
  }
  if (tp.schedule_type === "Cron based") {
    const c = tp.schedule.cron;
    return `Cron: ${c.expression} (${c.timezone})`;
  }
  return undefined;
}

async function load() {
  const id = String(route.params.id || "");
  if (!id) {
    error.value = "Missing id";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    if (props.kind === "report") {
      instance.value = await getReportInstanceDetails(id);
      if (!instance.value) error.value = "Report not found";
    } else {
      definition.value = await getReportDefinition(id);
      if (!definition.value) error.value = "Definition not found";
    }
  } catch (err) {
    error.value = extractWazuhError(err);
  } finally {
    loading.value = false;
  }
}

async function onDownload() {
  if (!instance.value || downloading.value) return;
  downloading.value = true;
  try {
    await downloadReportInstance(instance.value);
  } catch (err) {
    notifyError(`Download failed: ${extractWazuhError(err)}`);
  } finally {
    downloading.value = false;
  }
}

function onBack() {
  router.push({ name: "SecurityReporting" });
}

watch(() => route.params.id, load);
onMounted(load);
</script>

<style scoped>
.rd-page {
  padding: 16px 24px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

.rd-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.rd-back-btn {
  font-weight: 600;
  color: var(--mdm-text-secondary, #69707d);
}

.rd-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 4px 0 16px;
}

.rd-card {
  background: var(--mdm-bg-card, #fff);
  border-radius: 10px;
  border-color: var(--mdm-border-light, #e8ecf0);
  position: relative;
}

.rd-card__header {
  padding: 16px 20px 12px;
}

.rd-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.rd-card__body {
  padding: 20px;
}

.rd-section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 18px;
}

.rd-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px 28px;
}

.rd-cell--span-3 {
  grid-column: span 3;
}

.rd-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.rd-value {
  font-size: 13px;
  color: var(--mdm-text-secondary, #4b5563);
  word-break: break-word;
}

.rd-link {
  color: var(--mdm-primary, #2563eb);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.rd-link:hover {
  text-decoration: underline;
}
</style>

<style>
.body--dark .rd-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
