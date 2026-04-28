<template>
  <q-dialog v-model="open" persistent>
    <q-card class="export-dialog">
      <q-card-section class="row items-center">
        <div class="text-h6">Export Agents Report</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="running" />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <!-- Source -->
        <q-select
          v-model="scope"
          :options="scopeOptions"
          emit-value
          map-options
          outlined
          dense
          label="Report Source"
          hint="Current view honours the active filter; All agents exports the full inventory."
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
          hint="Hard cap applied after sorting; agents inventory is rarely large enough to hit this."
          :rules="[(v: number) => v > 0 || 'Must be positive']"
          class="q-mb-md"
        />

        <!-- Preview -->
        <div class="summary">
          <div class="summary-row">
            <span class="summary-key">Filter:</span>
            <code>{{ filterText || "(none)" }}</code>
          </div>
          <div class="summary-row">
            <span class="summary-key">Source:</span>
            <span>{{ scopeLabel }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Rows to export:</span>
            <span>{{ rowsToExport.toLocaleString() }} of {{ totalAvailable.toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Columns:</span>
            <span>{{ columnList }}</span>
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
import {
  exportAgents,
  AGENTS_EXPORT_COLUMNS,
  type AgentsExportFormat,
} from "@/utils/agentsExport";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { WazuhAgent } from "@/types/wazuh";

const props = defineProps<{
  modelValue: boolean;
  /** Agents matching the current page filter. */
  filteredAgents: WazuhAgent[];
  /** Full inventory shown on the page (filter-independent). */
  allAgents: WazuhAgent[];
  /** Free-text filter currently in the toolbar — surfaced in the summary. */
  filterText: string;
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

type Scope = "current" | "all";
const scope = ref<Scope>("current");
const format = ref<AgentsExportFormat>("csv");
const maxRows = ref<number>(10000);
const running = ref(false);

const scopeOptions = [
  { label: "Current view (filtered)", value: "current" as Scope },
  { label: "All agents", value: "all" as Scope },
];

const formatOptions = [
  { label: "CSV", value: "csv" as AgentsExportFormat },
  { label: "XLSX", value: "xlsx" as AgentsExportFormat },
  { label: "PDF", value: "pdf" as AgentsExportFormat },
];

const sourceList = computed(() =>
  scope.value === "current" ? props.filteredAgents : props.allAgents,
);

const totalAvailable = computed(() => sourceList.value.length);
const rowsToExport = computed(() =>
  Math.min(totalAvailable.value, Math.max(0, maxRows.value || 0)),
);
const scopeLabel = computed(
  () =>
    scopeOptions.find((o) => o.value === scope.value)?.label ?? "Current view",
);
const columnList = computed(() => AGENTS_EXPORT_COLUMNS.join(", "));

const canExport = computed(
  () => !running.value && rowsToExport.value > 0 && maxRows.value > 0,
);

watch(open, (v) => {
  if (!v) return;
  // Reset to defaults each time the dialog opens.
  scope.value = "current";
  format.value = "csv";
  maxRows.value = 10000;
});

function onCancel() {
  if (running.value) return;
  open.value = false;
}

async function onGenerate() {
  if (!canExport.value) return;
  running.value = true;
  try {
    const slice = sourceList.value.slice(0, rowsToExport.value);
    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-");
    const rows = await exportAgents({
      agents: slice,
      format: format.value,
      filename: `agents-${scope.value}-${stamp}`,
      pdfMeta:
        format.value === "pdf"
          ? {
              title: scopeLabel.value,
              filterText: props.filterText,
              totalAgents: totalAvailable.value,
              exportedAgents: slice.length,
            }
          : undefined,
    });
    notifySuccess(`Exported ${rows.toLocaleString()} agents`);
    open.value = false;
  } catch (e) {
    notifyError(`Export failed: ${(e as Error).message}`);
  } finally {
    running.value = false;
  }
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
