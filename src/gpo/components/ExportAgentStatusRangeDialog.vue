<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="export-agent-status-range-card">
      <q-card-section class="text-h6">Export agent status</q-card-section>
      <q-card-section class="q-pt-none q-gutter-md">
        <p class="text-body2 text-grey-8 q-mb-none">
          Limit the export to events in a period, or leave the default
        </p>
        <q-option-group
          v-model="mode"
          type="radio"
          color="primary"
          :options="modeOptions"
        />
        <div v-if="mode === 'range'" class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="fromYmd"
              type="date"
              outlined
              dense
              label="From"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input v-model="toYmd" type="date" outlined dense label="To" />
          </div>
        </div>
        <div v-if="mode === 'range'" class="text-caption text-grey-7">
          From = start of day, To = end of day (your local timezone).
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          @click="$emit('update:modelValue', false)"
        />
        <q-btn
          unelevated
          label="Export"
          color="primary"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { notifyError } from "@/utils/notify";

export type ExportAgentStatusRangePayload = {
  fromUtc?: Date;
  toUtc?: Date;
};

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [payload: ExportAgentStatusRangePayload];
}>();

const mode = ref<"all" | "range">("all");
const fromYmd = ref("");
const toYmd = ref("");

const modeOptions = [
  { label: "All available (no date filter)", value: "all" },
  { label: "Date range…", value: "range" },
];

function parseLocalYmd(ymd: string, endOfDay: boolean): Date {
  const parts = ymd.split("-").map((x) => Number.parseInt(x, 10));
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    y === undefined ||
    m === undefined ||
    d === undefined
  ) {
    return new Date(Number.NaN);
  }
  return endOfDay
    ? new Date(y, m - 1, d, 23, 59, 59, 999)
    : new Date(y, m - 1, d, 0, 0, 0, 0);
}

function resetForm(): void {
  mode.value = "all";
  fromYmd.value = "";
  toYmd.value = "";
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm();
    }
  },
);

function submit(): void {
  if (mode.value === "all") {
    emit("confirm", {});
    emit("update:modelValue", false);
    return;
  }
  const fromS = (fromYmd.value ?? "").trim();
  const toS = (toYmd.value ?? "").trim();
  if (!fromS || !toS) {
    notifyError("Select both From and To dates.");
    return;
  }
  const from = parseLocalYmd(fromS, false);
  const to = parseLocalYmd(toS, true);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    notifyError("Invalid date.");
    return;
  }
  if (from.getTime() > to.getTime()) {
    notifyError("From must be on or before To.");
    return;
  }
  emit("confirm", { fromUtc: from, toUtc: to });
  emit("update:modelValue", false);
}
</script>

<style scoped>
.export-agent-status-range-card {
  min-width: 360px;
  max-width: min(96vw, 480px);
}
</style>
