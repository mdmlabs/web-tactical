<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="slide-up"
    transition-hide="slide-down"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
    @show="onShow"
  >
    <q-card class="os-version-picker-dialog">
      <q-card-section class="os-version-picker-dialog__header">
        <div class="row items-center no-wrap">
          <q-icon name="memory" size="28px" color="primary" class="q-mr-sm" />
          <div class="col">
            <div class="text-h6">{{ title }}</div>
            <div v-if="subtitle" class="text-caption text-grey-7 ellipsis">
              {{ subtitle }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="os-version-picker-dialog__body">
        <q-input
          :model-value="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="Search by readable name or technical code…"
          class="q-mb-md"
          @update:model-value="onSearchUpdate"
          @clear="onSearchUpdate('')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="os-version-picker-dialog__table-wrap">
          <div v-if="optionsLoading" class="os-version-picker-dialog__empty">
            <q-spinner-dots color="primary" size="34px" />
            <div class="text-body2 text-grey-7 q-mt-sm">Loading catalog…</div>
          </div>

          <div
            v-else-if="filteredRows.length === 0"
            class="os-version-picker-dialog__empty"
          >
            <q-icon name="search_off" size="42px" color="grey-4" />
            <div class="text-body2 text-grey-6 q-mt-sm">
              {{ search.trim() ? "No matches" : "No OS entries" }}
            </div>
          </div>

          <q-markup-table v-else flat dense bordered separator="horizontal">
            <thead>
              <tr>
                <th scope="col" class="text-left">Operating system</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in filteredRows"
                :key="row.value"
                class="os-version-picker-dialog__row"
                :class="{
                  'os-version-picker-dialog__row--active':
                    selected?.value === row.value,
                }"
                @click="selected = row"
              >
                <td class="os-version-picker-dialog__os-cell">
                  {{ row.label }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <q-separator class="q-mt-md" />

        <q-input
          v-model="customValue"
          outlined
          dense
          clearable
          placeholder="e.g. SUPPORTED_Windows_10_0_RS6 — not listed above"
          class="text-mono"
        >
          <template #prepend>
            <q-icon name="edit_note" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="OK"
          :disable="!canApply"
          @click="apply"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

export interface OsVersionRow {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    options: OsVersionRow[];
    optionsLoading: boolean;
    selectedValue?: string | null | undefined;
  }>(),
  {
    title: "Select OS version",
    subtitle: "",
    selectedValue: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [value: string];
}>();

const search = ref("");
const selected = ref<OsVersionRow | null>(null);
const customValue = ref("");

function onShow() {
  search.value = "";
  const mv = (props.selectedValue ?? "").trim();
  if (!mv) {
    selected.value = null;
    customValue.value = "";
    return;
  }
  const match = props.options.find((r) => r.value === mv);
  if (match) {
    selected.value = match;
    customValue.value = "";
  } else {
    selected.value = null;
    customValue.value = mv;
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) onShow();
  },
);

watch(
  () => props.options,
  () => {
    if (!props.modelValue) return;
    onShow();
  },
);

watch(
  () => props.selectedValue,
  () => {
    if (props.modelValue) onShow();
  },
);

function onSearchUpdate(val: unknown) {
  search.value = String(val ?? "");
}

const filteredRows = computed(() => {
  const s = search.value.trim().toLowerCase();
  if (!s) return props.options;
  return props.options.filter((r) => {
    const lbl = r.label?.toLowerCase() ?? "";
    const v = r.value?.toLowerCase() ?? "";
    return lbl.includes(s) || v.includes(s);
  });
});

const trimmedCustom = computed(() => customValue.value.trim());

const canApply = computed(() => !!selected.value || !!trimmedCustom.value);

function apply() {
  if (trimmedCustom.value) {
    emit("confirm", trimmedCustom.value);
  } else if (selected.value) {
    emit("confirm", selected.value.value);
  }
  emit("update:modelValue", false);
}
</script>

<style scoped>
.os-version-picker-dialog {
  width: min(680px, 92vw);
  max-width: 92vw;
  max-height: min(760px, 90vh);
  display: flex;
  flex-direction: column;
}

.os-version-picker-dialog__header {
  padding: 14px 16px;
}

.os-version-picker-dialog__body {
  padding: 16px;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.os-version-picker-dialog__table-wrap {
  flex: 1 1 auto;
  min-height: 0;
  max-height: min(340px, 38vh);
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
}

.os-version-picker-dialog__empty {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.os-version-picker-dialog__row {
  cursor: pointer;
}

.os-version-picker-dialog__row:hover {
  background: rgba(0, 0, 0, 0.04);
}

.os-version-picker-dialog__row--active {
  background: rgba(33, 150, 243, 0.12);
}

.os-version-picker-dialog thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(243, 244, 246, 0.98);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

.os-version-picker-dialog__os-cell {
  font-size: 0.813rem;
  line-height: 1.35;
  white-space: normal;
  vertical-align: top;
}
</style>
