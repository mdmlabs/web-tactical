<!--
  Create-a-report dialog. Owns both flows:

    On demand
      1. POST /api/reporting/reportDefinitions   — create the template
      2. POST /api/reporting/generateReport/{id} — render once
      3. parent reloads the instances list

    Schedule + email
      1. POST /api/reporting/reportDefinitions   — create with trigger=Schedule
         and delivery.configIds — the dashboards-server fires on cron and
         emails the rendered file via the chosen Notifications channel.

  Custom cron, header/footer, edit-mode and Dashboard / Visualization sources
  are deliberately out of scope here — they extend this same component in
  later features.
-->
<template>
  <q-dialog ref="dialogRef" persistent @hide="onHide">
    <q-card class="rd-dialog">
      <q-bar class="rd-dialog__bar">
        <span class="rd-dialog__title">{{ isEdit ? "Edit report" : "New report" }}</span>
        <q-space />
        <q-btn v-close-popup dense flat icon="close" :disable="busy">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-inner-loading :showing="loadingDefinition">
        <q-spinner-dots size="40px" color="primary" />
      </q-inner-loading>

      <q-card-section class="rd-dialog__body">
        <q-input
          v-model="form.name"
          outlined
          dense
          label="Name *"
          :rules="[(v: string) => !!v?.trim() || 'Required']"
          class="q-mb-md"
        />

        <q-input
          v-model="form.description"
          outlined
          dense
          label="Description"
          autogrow
          class="q-mb-md"
        />

        <div class="rd-section-label">Source</div>
        <q-select
          v-model="form.source"
          :options="sourceOptions"
          emit-value
          map-options
          outlined
          dense
          class="q-mb-md"
        >
          <template #after>
            <q-icon name="info" size="16px" class="rd-info-icon">
              <q-tooltip>Saved searches are managed in the dashboards module.</q-tooltip>
            </q-icon>
          </template>
        </q-select>

        <q-select
          v-if="form.source === 'Saved search'"
          v-model="form.savedSearchId"
          :options="savedSearchOptions"
          emit-value
          map-options
          outlined
          dense
          label="Saved search *"
          :loading="loadingSearches"
          :disable="loadingSearches"
          :rules="[(v: string) => !!v || 'Pick a saved search']"
          class="q-mb-md"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey-7"
                >No saved searches available. Create one in the dashboards
                module first.</q-item-section
              >
            </q-item>
          </template>
        </q-select>

        <div class="rd-row">
          <q-select
            v-model="form.timeRange"
            :options="timeRangeOptions"
            emit-value
            map-options
            outlined
            dense
            label="Time range"
            class="rd-row__col"
          />

          <q-select
            v-model="form.format"
            :options="formatOptions"
            emit-value
            map-options
            outlined
            dense
            label="Format"
            class="rd-row__col"
          />
        </div>

        <q-input
          v-model.number="form.limit"
          outlined
          dense
          type="number"
          label="Row limit"
          :min="1"
          :max="100000"
          hint="Maximum rows for CSV/XLSX exports."
          class="q-mb-md"
        />

        <div class="rd-section-label">Trigger</div>
        <q-option-group
          v-model="form.triggerType"
          :options="triggerOptions"
          color="primary"
          inline
          class="rd-trigger"
        />

        <div v-if="form.triggerType === 'Schedule'" class="rd-schedule">
          <q-select
            v-model="form.schedulePreset"
            :options="schedulePresetOptions"
            emit-value
            map-options
            outlined
            dense
            label="Frequency"
            class="q-mb-md"
          />

          <div class="rd-row">
            <q-input
              v-model="form.startTimeLocal"
              outlined
              dense
              type="datetime-local"
              :label="startTimeLabel"
              class="rd-row__col"
            />
            <q-select
              v-model="form.timezone"
              :options="timezoneOptions"
              outlined
              dense
              use-input
              input-debounce="200"
              label="Timezone"
              class="rd-row__col"
              @filter="onTimezoneFilter"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey-7">No matches</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="rd-section-label">Email delivery</div>
          <q-banner
            v-if="!loadingChannels && channels.length === 0"
            class="bg-amber-1 text-amber-9 q-mb-md"
            rounded
            dense
          >
            <template #avatar>
              <q-icon name="warning_amber" color="warning" />
            </template>
            No email channels configured. Ask your admin to create one in the
            dashboards module.
          </q-banner>

          <q-select
            v-model="form.recipientChannelIds"
            :options="channelOptions"
            emit-value
            map-options
            multiple
            use-chips
            outlined
            dense
            label="Recipients (email channels) *"
            :loading="loadingChannels"
            :disable="loadingChannels || channels.length === 0"
            class="q-mb-md"
          />

          <q-input
            v-model="form.emailSubject"
            outlined
            dense
            label="Email subject"
            :placeholder="defaultEmailSubject"
            class="q-mb-md"
          />

          <q-input
            v-model="form.emailBody"
            outlined
            dense
            type="textarea"
            autogrow
            label="Email body"
            :placeholder="defaultEmailBody"
          />
        </div>

        <q-banner v-if="errorMsg" class="bg-red-1 text-red-9 q-mt-md" rounded>
          <template #avatar>
            <q-icon name="error_outline" color="negative" />
          </template>
          {{ errorMsg }}
        </q-banner>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="rd-dialog__actions">
        <q-btn flat no-caps label="Cancel" :disable="busy" @click="onClose" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          :loading="busy"
          :disable="!canSubmit"
          :label="submitLabel"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useDialogPluginComponent } from "quasar";
import { findSavedSearches, type SavedObject } from "@/api/savedObjects";
import {
  listEmailChannels,
  type NotificationChannel,
} from "@/api/notificationsPlugin";
import { useReportDefinitionsStore } from "@/stores/reportDefinitions";
import { extractWazuhError } from "@/api/wazuhReporting";
import { notifyError, notifySuccess } from "@/utils/notify";
import type {
  ReportDefinitionPayload,
  ReportDelivery,
  ReportFormat,
  ReportSource,
  ReportTrigger,
  ReportTriggerType,
} from "@/types/reportDefinition";

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<{
  /** When set, the dialog opens in edit mode for the given definition. */
  definitionId?: string;
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const store = useReportDefinitionsStore();

const isEdit = computed(() => Boolean(props.definitionId));

type SchedulePreset = "hourly" | "daily9" | "weeklyMon9" | "monthly1st9";

interface FormState {
  name: string;
  description: string;
  source: ReportSource;
  savedSearchId: string | null;
  timeRange: string;
  format: ReportFormat;
  limit: number;
  triggerType: ReportTriggerType;
  schedulePreset: SchedulePreset;
  startTimeLocal: string;
  timezone: string;
  recipientChannelIds: string[];
  emailSubject: string;
  emailBody: string;
}

const localTimezone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
})();

const form = reactive<FormState>({
  name: "",
  description: "",
  source: "Saved search",
  savedSearchId: null,
  timeRange: "PT24H",
  format: "csv",
  limit: 10000,
  triggerType: "On demand",
  schedulePreset: "daily9",
  startTimeLocal: defaultStartLocal(),
  timezone: localTimezone,
  recipientChannelIds: [],
  emailSubject: "",
  emailBody: "",
});

const busy = ref(false);
const loadingSearches = ref(false);
const loadingChannels = ref(false);
const loadingDefinition = ref(false);
const errorMsg = ref<string | null>(null);
const savedSearches = ref<SavedObject[]>([]);
const channels = ref<NotificationChannel[]>([]);

const sourceOptions = [
  { label: "Saved search", value: "Saved search" },
  // Dashboard / Visualization arrive in Feature 5.
];

const timeRangeOptions = [
  { label: "Last 15 minutes", value: "PT15M" },
  { label: "Last 1 hour", value: "PT1H" },
  { label: "Last 24 hours", value: "PT24H" },
  { label: "Last 7 days", value: "P7D" },
  { label: "Last 30 days", value: "P30D" },
];

const formatOptions = [
  { label: "CSV", value: "csv" as ReportFormat },
  { label: "XLSX", value: "xlsx" as ReportFormat },
  { label: "PDF", value: "pdf" as ReportFormat },
];

const triggerOptions = [
  { label: "On demand", value: "On demand" as ReportTriggerType },
  { label: "Schedule", value: "Schedule" as ReportTriggerType },
];

const schedulePresetOptions: { label: string; value: SchedulePreset }[] = [
  { label: "Hourly", value: "hourly" },
  { label: "Daily — 09:00", value: "daily9" },
  { label: "Weekly — Monday 09:00", value: "weeklyMon9" },
  { label: "Monthly — 1st at 09:00", value: "monthly1st9" },
];

const allTimezones: string[] = (() => {
  const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] };
  if (typeof intl.supportedValuesOf === "function") {
    try {
      return intl.supportedValuesOf("timeZone");
    } catch {
      // fall through
    }
  }
  return ["UTC", "America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Singapore"];
})();
const timezoneOptions = ref<string[]>(allTimezones);

function onTimezoneFilter(needle: string, update: (cb: () => void) => void) {
  update(() => {
    if (!needle) {
      timezoneOptions.value = allTimezones;
      return;
    }
    const q = needle.toLowerCase();
    timezoneOptions.value = allTimezones.filter((tz) =>
      tz.toLowerCase().includes(q),
    );
  });
}

const savedSearchOptions = computed(() =>
  savedSearches.value.map((s) => ({
    label: (s.attributes?.title as string) || s.id,
    value: s.id,
  })),
);

const channelOptions = computed(() =>
  channels.value.map((c) => ({
    label: c.description ? `${c.name} — ${c.description}` : c.name,
    value: c.config_id,
  })),
);

const startTimeLabel = computed(() =>
  form.schedulePreset === "hourly" || form.schedulePreset === "daily9"
    ? "First run"
    : "Active from",
);

const submitLabel = computed(() => {
  if (isEdit.value) return "Save changes";
  return form.triggerType === "On demand" ? "Generate report" : "Save schedule";
});

const defaultEmailSubject = computed(() =>
  form.name.trim() ? `Report: ${form.name.trim()}` : "Your scheduled report",
);

const defaultEmailBody = computed(
  () =>
    form.description.trim() ||
    "Your scheduled report is attached.",
);

const canSubmit = computed(() => {
  if (busy.value) return false;
  if (!form.name.trim()) return false;
  if (form.source === "Saved search" && !form.savedSearchId) return false;
  if (form.triggerType === "Schedule") {
    if (form.recipientChannelIds.length === 0) return false;
    if (!form.startTimeLocal) return false;
    if (!form.timezone) return false;
  }
  return true;
});

function defaultStartLocal(): string {
  // Round up to the next minute for a stable default that won't fire
  // immediately or in the past.
  const d = new Date(Date.now() + 60_000);
  d.setSeconds(0, 0);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function startTimeMs(): number {
  const local = form.startTimeLocal;
  if (!local) return Date.now();
  const ms = new Date(local).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

async function loadSavedSearches() {
  loadingSearches.value = true;
  try {
    savedSearches.value = await findSavedSearches();
  } catch (err) {
    notifyError(`Failed to load saved searches: ${extractWazuhError(err)}`);
    savedSearches.value = [];
  } finally {
    loadingSearches.value = false;
  }
}

async function loadChannels() {
  loadingChannels.value = true;
  try {
    channels.value = await listEmailChannels();
  } catch (err) {
    notifyError(`Failed to load email channels: ${extractWazuhError(err)}`);
    channels.value = [];
  } finally {
    loadingChannels.value = false;
  }
}

function buildTrigger(): ReportTrigger {
  if (form.triggerType === "On demand") {
    return { trigger_type: "On demand" };
  }
  const enabledTime = startTimeMs();
  const tz = form.timezone || "UTC";
  switch (form.schedulePreset) {
    case "hourly":
      return {
        trigger_type: "Schedule",
        trigger_params: {
          enabled: true,
          enabled_time: enabledTime,
          schedule_type: "Recurring",
          schedule: {
            interval: { period: 1, unit: "HOURS", start_time: enabledTime },
          },
        },
      };
    case "daily9":
      return {
        trigger_type: "Schedule",
        trigger_params: {
          enabled: true,
          enabled_time: enabledTime,
          schedule_type: "Recurring",
          schedule: {
            interval: { period: 1, unit: "DAYS", start_time: enabledTime },
          },
        },
      };
    case "weeklyMon9":
      // Quartz cron — sec min hour dom mon dow
      return {
        trigger_type: "Schedule",
        trigger_params: {
          enabled: true,
          enabled_time: enabledTime,
          schedule_type: "Cron based",
          schedule: {
            cron: { expression: "0 0 9 ? * MON", timezone: tz },
          },
        },
      };
    case "monthly1st9":
    default:
      return {
        trigger_type: "Schedule",
        trigger_params: {
          enabled: true,
          enabled_time: enabledTime,
          schedule_type: "Cron based",
          schedule: {
            cron: { expression: "0 0 9 1 * ?", timezone: tz },
          },
        },
      };
  }
}

// When the user picks "Daily — 09:00", snap the start time to the next 09:00
// in their local timezone so the recurring fire actually lands at 09:00.
// Skip in edit-mode prefill — the existing start time should be preserved.
watch(
  () => form.schedulePreset,
  (preset) => {
    if (preset !== "daily9") return;
    if (props.definitionId) return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    const pad = (n: number) => n.toString().padStart(2, "0");
    form.startTimeLocal =
      `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}` +
      `T${pad(next.getHours())}:${pad(next.getMinutes())}`;
  },
);

// The dashboards-server validator requires `delivery` to be present with at
// least `delivery.configIds: []` even for on-demand reports — omitting the
// object yields 400 "expected value of type [array] but got [undefined]".
function buildDelivery(): ReportDelivery {
  if (form.triggerType !== "Schedule") {
    return { configIds: [], title: "", textDescription: "", htmlDescription: "" };
  }
  const subject = form.emailSubject.trim() || defaultEmailSubject.value;
  const body = form.emailBody.trim() || defaultEmailBody.value;
  return {
    configIds: [...form.recipientChannelIds],
    title: subject,
    textDescription: body,
    htmlDescription: `<p>${body.replace(/\n/g, "<br/>")}</p>`,
  };
}

// The dashboards-server requires `core_params.base_url` — it's the in-app
// path the headless renderer opens to capture the report. For a saved search
// it's `/app/discover#/view/{id}`; the plugin reads this string verbatim, so
// the leading `/app/` and the `#/view/` segment must be present.
function buildBaseUrl(): string {
  if (form.source === "Saved search" && form.savedSearchId) {
    return `/app/discover#/view/${form.savedSearchId}`;
  }
  return "";
}

function buildPayload(): ReportDefinitionPayload {
  const wantXlsx = form.format === "xlsx";
  return {
    report_params: {
      report_name: form.name.trim(),
      report_source: form.source,
      description: form.description.trim() || undefined,
      core_params: {
        base_url: buildBaseUrl(),
        saved_search_id: form.savedSearchId ?? undefined,
        report_format: wantXlsx ? "csv" : form.format,
        time_duration: form.timeRange,
        limit: form.limit,
        excel: wantXlsx ? true : undefined,
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    },
    trigger: buildTrigger(),
    delivery: buildDelivery(),
  };
}

async function onSubmit() {
  if (!canSubmit.value) return;
  busy.value = true;
  errorMsg.value = null;
  try {
    const payload = buildPayload();
    if (props.definitionId) {
      await store.update(props.definitionId, payload);
      notifySuccess("Changes saved");
      onDialogOK({
        definitionId: props.definitionId,
        triggerType: form.triggerType,
      });
      return;
    }
    const id = await store.create(payload);
    if (form.triggerType === "On demand") {
      await store.runNow(id);
      notifySuccess("Report generated");
    } else {
      notifySuccess("Schedule saved");
    }
    onDialogOK({ definitionId: id, triggerType: form.triggerType });
  } catch (err) {
    errorMsg.value = extractWazuhError(err);
  } finally {
    busy.value = false;
  }
}

function msToLocalInput(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return defaultStartLocal();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function detectSchedulePreset(payload: ReportDefinitionPayload): SchedulePreset {
  if (payload.trigger.trigger_type !== "Schedule") return "daily9";
  const params = payload.trigger.trigger_params;
  if (params.schedule_type === "Recurring") {
    const i = params.schedule.interval;
    if (i.unit === "HOURS" && i.period === 1) return "hourly";
    if (i.unit === "DAYS" && i.period === 1) return "daily9";
    return "daily9";
  }
  const expr = params.schedule.cron.expression.trim();
  if (expr === "0 0 9 ? * MON") return "weeklyMon9";
  if (expr === "0 0 9 1 * ?") return "monthly1st9";
  return "daily9";
}

function prefillFromPayload(payload: ReportDefinitionPayload) {
  const params = payload.report_params;
  const core = params.core_params;
  form.name = params.report_name;
  form.description = params.description ?? "";
  form.source = params.report_source;
  form.savedSearchId = core.saved_search_id ?? null;
  form.timeRange = core.time_duration;
  form.format = core.excel ? "xlsx" : core.report_format;
  form.limit = core.limit ?? 10000;
  form.triggerType = payload.trigger.trigger_type;

  if (payload.trigger.trigger_type === "Schedule") {
    const params = payload.trigger.trigger_params;
    form.schedulePreset = detectSchedulePreset(payload);
    const startMs =
      params.schedule_type === "Recurring"
        ? params.schedule.interval.start_time
        : params.enabled_time;
    form.startTimeLocal = msToLocalInput(startMs);
    if (params.schedule_type === "Cron based") {
      form.timezone = params.schedule.cron.timezone || localTimezone;
    }
    const delivery = payload.delivery;
    if (delivery) {
      form.recipientChannelIds = [...delivery.configIds];
      form.emailSubject = delivery.title ?? "";
      form.emailBody = delivery.textDescription ?? "";
    }
  }
}

async function loadExistingDefinition(id: string) {
  loadingDefinition.value = true;
  try {
    const payload = await store.fetch(id);
    if (!payload) {
      errorMsg.value = "Definition not found";
      return;
    }
    prefillFromPayload(payload);
  } catch (err) {
    errorMsg.value = extractWazuhError(err);
  } finally {
    loadingDefinition.value = false;
  }
}

function onClose() {
  if (busy.value) return;
  onDialogCancel();
}

function onHide() {
  onDialogHide();
}

onMounted(() => {
  void loadSavedSearches();
  void loadChannels();
  if (props.definitionId) {
    void loadExistingDefinition(props.definitionId);
  }
});
</script>

<style scoped>
.rd-dialog {
  min-width: 540px;
  max-width: 640px;
}

.rd-dialog__bar {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.rd-dialog__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.rd-dialog__body {
  padding: 18px 20px 12px;
}

.rd-dialog__actions {
  padding: 12px 16px;
}

.rd-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--mdm-text-secondary, #69707d);
  margin: 4px 0 6px;
}

.rd-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.rd-row__col {
  flex: 1 1 0;
}

.rd-trigger {
  margin-left: -8px;
  margin-bottom: 4px;
}

.rd-schedule {
  margin-top: 8px;
  padding: 12px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: var(--mdm-radius, 6px);
}

.rd-info-icon {
  color: var(--mdm-text-secondary, #69707d);
}
</style>

<style>
.body--dark .rd-dialog__bar {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .rd-schedule {
  background: var(--mdm-bg-sidebar, #0f1729);
  border-color: var(--mdm-border, #1e293b);
}
</style>
