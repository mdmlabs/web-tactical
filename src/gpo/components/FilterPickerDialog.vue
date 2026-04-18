<template>
  <q-dialog :model-value="modelValue" @update:model-value="emitModelValue">
    <q-card style="min-width: 900px; max-width: 95vw">
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn flat dense icon="close" @click="emitModelValue(false)" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-md">
        <q-input
          v-model="filter"
          dense
          clearable
          autofocus
          debounce="250"
          :placeholder="placeholder"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table
          :rows="rows"
          :columns="columns"
          :row-key="rowKey"
          :filter="filter"
          :pagination="{ rowsPerPage: 25 }"
          dense
          flat
          bordered
          virtual-scroll
          :rows-per-page-options="[25, 50, 100]"
          @row-click="(_, row) => emitSelect(row)"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Close" @click="emitModelValue(false)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { QTableColumn } from "quasar";

type RowKey = string | ((row: unknown) => string);

const props = defineProps<{
  modelValue: boolean;
  title: string;
  rows: unknown[];
  columns: QTableColumn[];
  rowKey: RowKey;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "select", row: unknown): void;
}>();

const filter = ref("");

watch(
  () => props.modelValue,
  (open) => {
    if (open) filter.value = "";
  },
);

function emitModelValue(v: boolean) {
  emit("update:modelValue", v);
}

function emitSelect(row: unknown) {
  emit("select", row);
  emit("update:modelValue", false);
}
</script>

