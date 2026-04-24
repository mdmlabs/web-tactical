<template>
  <q-dialog v-model="open" persistent>
    <q-card class="export-dialog">
      <q-card-section class="row items-center">
        <div class="text-h6">Export Discover Report</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="running" />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <!-- Source -->
        <q-select
          v-model="sourceId"
          :options="sourceOptions"
          emit-value
          map-options
          outlined
          dense
          label="Report Source"
          hint="Current Discover view or a previously saved search."
          class="q-mb-md"
        />

        <!-- Time range override -->
        <q-select
          v-model="timeRange"
          :options="timeOptions"
          emit-value
          map-options
          outlined
          dense
          label="Time range"
          hint="Override the saved time window (e.g. export last 7 days from a 24h search)."
          class="q-mb-md"
        />

        <!-- Format -->
        <q-select
          v-model="format"
          :options="formatOptions"
          emit-value
          map-options
          outlined
          dense
          label="Format"
          class="q-mb-md"
        />

        <!-- Row cap -->
        <q-input
          v-model.number="maxRows"
          outlined
          dense
          type="number"
          label="Max rows"
          hint="Uses search_after pagination; 10 000 is the recommended safe cap."
          :rules="[(v: number) => v > 0 || 'Must be positive']"
          class="q-mb-md"
        />

        <!-- Preview -->
        <div class="summary">
          <div class="summary-row">
            <span class="summary-key">Query:</span>
            <code>{{ effectiveQuery || "(empty)" }}</code>
          </div>
          <div class="summary-row">
            <span class="summary-key">Index:</span>
            <span>{{ effectiveIndex }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Columns:</span>
            <span>{{ effectiveFields.join(", ") || "(none selected)" }}</span>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="running" class="q-mt-md">
          <q-linear-progress
            :value="progress.total > 0 ? progress.fetched / progress.total : 0"
            color="primary"
            size="md"
          />
          <div class="text-caption q-mt-xs">
            Fetched {{ progress.fetched.toLocaleString() }} of
            {{ progress.total.toLocaleString() }} hits
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right">
        <q-btn flat no-caps label="Cancel" :disable="running" @click="onCancel" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          :loading="running"
          :disable="!canExport"
          label="Generate"
          @click="onGenerate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDiscoverStore, buildDiscoverQuery, resolveBackendIndex } from "@/stores/discover";
import { useSavedSearchesStore } from "@/stores/savedSearches";
import { exportDiscover, type ExportFormat, type ExportProgress } from "@/utils/discoverExport";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { SavedSearchTimePreset } from "@/types/savedSearch";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const discover = useDiscoverStore();
const saved = useSavedSearchesStore();

/** `__current__` = use the live Discover state; otherwise a SavedSearch id. */
const CURRENT_VIEW_ID = "__current__";
const sourceId = ref<string>(CURRENT_VIEW_ID);

const timeRange = ref<SavedSearchTimePreset>(discover.timeRange);
const format = ref<ExportFormat>("csv");
const maxRows = ref<number>(10000);

const running = ref(false);
const progress = ref<ExportProgress>({ fetched: 0, total: 0 });
const abortCtrl = ref<AbortController | null>(null);

const timeOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const formatOptions = [
  { label: "CSV", value: "csv" },
  { label: "XLSX", value: "xlsx" },
  { label: "PDF (with histogram)", value: "pdf" },
];

/** Default histogram granularity for each preset — matches the Discover view. */
const HISTOGRAM_INTERVAL: Record<SavedSearchTimePreset, string> = {
  "15m": "1m",
  "1h": "5m",
  "24h": "30m",
  "7d": "3h",
  "30d": "12h",
};

const sourceOptions = computed(() => [
  { label: "Current Discover view", value: CURRENT_VIEW_ID },
  ...saved.items.map((s) => ({
    label: s.attributes.title,
    value: s.id,
  })),
]);

const activeSource = computed(() =>
  sourceId.value === CURRENT_VIEW_ID
    ? null
    : saved.items.find((s) => s.id === sourceId.value) ?? null,
);

const effectiveQuery = computed(() =>
  activeSource.value?.attributes.query ?? discover.searchQuery,
);
const effectiveIndex = computed(() =>
  activeSource.value?.attributes.indexPattern ?? discover.indexPattern,
);
const effectiveFields = computed(() => {
  const fromSaved = activeSource.value?.attributes.columns;
  if (fromSaved && fromSaved.length > 0) return fromSaved;
  return [...discover.selectedFields];
});

const canExport = computed(
  () => !running.value && effectiveFields.value.length > 0 && maxRows.value > 0,
);

// When the dialog opens, reset to sensible defaults based on current state
watch(open, (v) => {
  if (!v) return;
  void saved.reload();
  sourceId.value = saved.active?.id ?? CURRENT_VIEW_ID;
  timeRange.value = (saved.active?.attributes.timeRange ?? discover.timeRange);
  format.value = "csv";
  maxRows.value = 10000;
  progress.value = { fetched: 0, total: 0 };
});

// When the source changes while the dialog is open, sync time range default
watch(sourceId, (id) => {
  const s = id === CURRENT_VIEW_ID
    ? null
    : saved.items.find((i) => i.id === id) ?? null;
  if (s) timeRange.value = s.attributes.timeRange;
});

function onCancel() {
  if (running.value) {
    abortCtrl.value?.abort();
    return;
  }
  open.value = false;
}

async function onGenerate() {
  if (!canExport.value) return;
  running.value = true;
  progress.value = { fetched: 0, total: 0 };
  abortCtrl.value = new AbortController();

  try {
    const { query, from, to } = buildDiscoverQuery(
      effectiveQuery.value,
      timeRange.value,
    );
    const filenameBase = activeSource.value
      ? `${slug(activeSource.value.attributes.title)}-${timeRange.value}`
      : `discover-${timeRange.value}`;

    const rows = await exportDiscover({
      indexPattern: resolveBackendIndex(effectiveIndex.value),
      query,
      fields: effectiveFields.value,
      maxRows: Math.min(maxRows.value, 1_000_000),
      format: format.value,
      filename: `${filenameBase}-${new Date().toISOString().slice(0, 19).replaceAll(":", "-")}`,
      onProgress: (p) => (progress.value = p),
      signal: abortCtrl.value.signal,
      histogramInterval: HISTOGRAM_INTERVAL[timeRange.value],
      histogramBounds: { gte: from, lte: to },
      pdfMeta:
        format.value === "pdf"
          ? {
              title: activeSource.value?.attributes.title ?? "Current Discover view",
              queryString: effectiveQuery.value,
              timeRange: timeRange.value,
              indexPattern: effectiveIndex.value,
            }
          : undefined,
    });
    notifySuccess(`Exported ${rows.toLocaleString()} rows`);
    open.value = false;
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      notifyError("Export cancelled");
    } else {
      notifyError(`Export failed: ${(e as Error).message}`);
    }
  } finally {
    running.value = false;
    abortCtrl.value = null;
  }
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "report";
}
</script>

<style scoped>
.export-dialog {
  min-width: 520px;
  max-width: 620px;
}

.summary {
  background: var(--mdm-bg-sidebar, #fafafa);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: var(--mdm-radius, 6px);
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.5;
}

.summary-row {
  word-break: break-all;
}

.summary-key {
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  margin-right: 6px;
}

.summary code {
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
