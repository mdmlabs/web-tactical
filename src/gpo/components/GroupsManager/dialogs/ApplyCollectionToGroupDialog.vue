<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="apply-collection-card" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Apply collection to group</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          Group: <strong>{{ groupSam }}</strong>
        </div>
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="Search collections..."
          class="q-mb-md"
          :disable="optionsLoading"
          @update:model-value="search = String($event ?? '')"
          @clear="search = ''"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          flat
          bordered
          dense
          :rows="filteredRows"
          :columns="columns"
          row-key="key"
          selection="single"
          v-model:selected="selectedRows"
          hide-pagination
          :rows-per-page-options="[0]"
          :loading="optionsLoading"
          @row-click="onRowClick"
        >
          <template #no-data>
            <div class="full-width text-center text-grey-6 q-pa-md">
              {{
                optionsLoading
                  ? "Loading..."
                  : options.length === 0
                    ? "No collections available"
                    : "No collections found"
              }}
            </div>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Apply"
          :loading="loading"
          :disable="selectedId == null"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    groupSam: string;
    options: { id: number; label: string }[];
    optionsLoading: boolean;
    loading?: boolean;
  }>(),
  { loading: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  apply: [collectionId: number];
}>();

const selectedId = ref<number | null>(null);
const search = ref("");
const selectedRows = ref<{ key: string; id: number; label: string }[]>([]);

const columns = [
  { name: "label", label: "Collection", field: "label", align: "left" as const },
];

const rows = computed(() =>
  (props.options ?? []).map((o) => ({ key: String(o.id), id: o.id, label: o.label })),
);

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) => (r.label ?? "").toLowerCase().includes(q));
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedId.value = null;
      search.value = "";
      selectedRows.value = [];
    }
  },
  { immediate: true },
);

function onRowClick(_evt: unknown, row: { key: string; id: number; label: string }) {
  selectedRows.value = [row];
  selectedId.value = row.id;
}

function submit() {
  if (selectedId.value != null) {
    emit("apply", selectedId.value);
  }
}
</script>
