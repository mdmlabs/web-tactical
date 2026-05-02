<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
    @show="$emit('show')"
  >
    <q-card class="apply-collection-card" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Apply collection to category</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          Category: <strong>{{ categoryLabel }}</strong>
        </div>
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="Search collections..."
          class="q-mb-md"
          :disable="loading"
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
          :loading="loading"
          @row-click="onRowClick"
        >
          <template #no-data>
            <div class="full-width text-center text-grey-6 q-pa-md">
              {{
                loading
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
          :loading="applying"
          :disable="selectedId == null"
          @click="$emit('apply', selectedId as number)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  categoryLabel: string;
  loading: boolean;
  applying: boolean;
  options: Array<{ id: number; label: string }>;
  modelSelectedId: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  show: [];
  "update:selectedId": [value: number | null];
  apply: [collectionId: number];
}>();

const selectedId = computed({
  get: () => props.modelSelectedId,
  set: (v) => emit("update:selectedId", v),
});

const search = ref("");
const selectedRows = ref<{ key: string; id: number; label: string }[]>([]);

const columns = [
  {
    name: "label",
    label: "Collection",
    field: "label",
    align: "left" as const,
  },
];

const rows = computed(() =>
  (props.options ?? []).map((o) => ({
    key: String(o.id),
    id: o.id,
    label: o.label,
  })),
);

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) => (r.label ?? "").toLowerCase().includes(q));
});

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    search.value = "";
    const currentId = selectedId.value;
    const key = currentId == null ? "" : String(currentId);
    const row = rows.value.find((r) => r.key === key);
    selectedRows.value = row ? [row] : [];
  },
);

function onRowClick(
  _evt: unknown,
  row: { key: string; id: number; label: string },
) {
  selectedRows.value = [row];
  selectedId.value = row.id;
}
</script>
