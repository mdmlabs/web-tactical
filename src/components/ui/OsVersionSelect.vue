<template>
  <div class="os-version-select-field">
    <q-input
      outlined
      dense
      readonly
      :label="label"
      :model-value="displayText"
      class="cursor-pointer os-version-select-field__display"
      @click="openDialog"
    >
      <template #prepend>
        <q-icon name="memory" />
      </template>
      <template #append>
        <div class="row items-center no-wrap">
          <q-btn
            v-if="hasValue"
            type="button"
            icon="close"
            flat
            round
            dense
            @click.stop="clearSelection"
          >
            <q-tooltip>Clear</q-tooltip>
          </q-btn>
        </div>
      </template>
    </q-input>

    <OsVersionPickerDialog
      v-model="pickerOpen"
      :title="'Select OS version'"
      :options="catalogOptions"
      :options-loading="loading"
      :selected-value="props.modelValue"
      @confirm="onPicked"
    />
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, watch } from "vue";
import OsVersionPickerDialog from "./OsVersionPickerDialog.vue";
import { fetchSupportedOsSelectOptions } from "@/gpo/utils/supportedOsBuildSelect";

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined;
    label?: string;
    hint?: string | null;
  }>(),
  { label: "OS version", hint: null },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();


const pickerOpen = ref(false);
const loading = ref(false);
const catalogOptions = ref<Array<{ label: string; value: string }>>([]);


const hasValue = computed(() => !!(props.modelValue ?? "").trim());

const displayText = computed(() => {
  const mv = (props.modelValue ?? "").trim();
  if (!mv) return "";
  const hit = catalogOptions.value.find((o) => o.value === mv);
  return hit ? hit.label : `${mv} (custom)`;
});

async function ensureCatalogLoaded(): Promise<void> {
  if (catalogOptions.value.length || loading.value) return;
  loading.value = true;
  try {
    catalogOptions.value = await fetchSupportedOsSelectOptions();
  } catch {
    catalogOptions.value = [];
  } finally {
    loading.value = false;
  }
}

async function openDialog(): Promise<void> {
  pickerOpen.value = true;
  await ensureCatalogLoaded();
}

function onPicked(value: string): void {
  emit("update:modelValue", value);
}

function clearSelection(): void {
  emit("update:modelValue", "");
}

const hasMv = (v: string | null | undefined) => !!(v ?? "").trim();

onMounted(() => {
  if (hasMv(props.modelValue)) void ensureCatalogLoaded();
});

watch(
  () => props.modelValue,
  (v) => {
    if (hasMv(v) && catalogOptions.value.length === 0) {
      void ensureCatalogLoaded();
    }
  },
);
</script>

<style scoped lang="sass">
.os-version-select-field__display
  &:deep(.q-field__native)
    cursor: pointer
    color: inherit
</style>
