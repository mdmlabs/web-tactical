<template>
  <q-dialog v-model="open" persistent>
    <q-card class="export-dialog">
      <q-card-section class="row items-center">
        <div class="text-h6">Export Agent Report</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="running" />
      </q-card-section>
      <q-separator />

      <q-card-section>
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

        <q-input
          v-model.number="maxFimRows"
          outlined
          dense
          type="number"
          label="Max FIM rows"
          hint="Caps the FIM Recent events table; charts and other panels are unaffected."
          :rules="[(v: number) => v > 0 || 'Must be positive']"
          class="q-mb-md"
        />

        <div class="summary">
          <div class="summary-row">
            <span class="summary-key">Agent:</span>
            <span>{{ data.agent.name }} ({{ data.agent.id }})</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Compliance:</span>
            <span>{{ data.complianceFrameworkLabel }} — {{ data.complianceItems.length }} requirements</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Vulnerabilities:</span>
            <span>{{ data.vulnerabilities.length.toLocaleString() }} loaded</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">SCA policies:</span>
            <span>{{ data.scaPolicies.length }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">FIM events:</span>
            <span>{{ data.fimEntries.length.toLocaleString() }} loaded · {{ effectiveFimRows.toLocaleString() }} will be exported</span>
          </div>
          <div class="summary-row">
            <span class="summary-key">Includes:</span>
            <span>System inventory, hourly events chart, MITRE tactics, compliance donut, vulnerability KPIs, top packages, SCA scans, FIM events</span>
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
  exportAgentDetail,
  type AgentDetailExportData,
  type AgentDetailExportFormat,
} from "@/utils/agentDetailExport";
import { notifyError, notifySuccess } from "@/utils/notify";

const props = defineProps<{
  modelValue: boolean;
  data: AgentDetailExportData;
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const format = ref<AgentDetailExportFormat>("pdf");
const maxFimRows = ref<number>(500);
const running = ref(false);

const formatOptions = [
  { label: "PDF (with charts)", value: "pdf" as AgentDetailExportFormat },
  { label: "XLSX (multi-sheet)", value: "xlsx" as AgentDetailExportFormat },
  { label: "CSV (sectioned)", value: "csv" as AgentDetailExportFormat },
];

const effectiveFimRows = computed(() =>
  Math.min(maxFimRows.value || 0, props.data.fimEntries.length),
);

const canExport = computed(
  () => !running.value && (maxFimRows.value || 0) > 0,
);

watch(open, (v) => {
  if (!v) return;
  format.value = "pdf";
  maxFimRows.value = 500;
});

function onCancel() {
  if (running.value) return;
  open.value = false;
}

async function onGenerate() {
  if (!canExport.value) return;
  running.value = true;
  try {
    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-");
    const slug = (props.data.agent.name || props.data.agent.id || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const rows = await exportAgentDetail({
      data: props.data,
      format: format.value,
      filename: `agent-${slug}-${props.data.agent.id}-${stamp}`,
      maxFimRows: maxFimRows.value,
    });
    notifySuccess(
      format.value === "pdf"
        ? "Agent report exported"
        : `Agent report exported (${rows.toLocaleString()} FIM rows)`,
    );
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
  word-break: break-word;
}

.summary-key {
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  margin-right: 6px;
}
</style>
