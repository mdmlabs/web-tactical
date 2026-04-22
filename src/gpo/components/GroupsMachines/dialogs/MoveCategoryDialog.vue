<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="slide-up"
    transition-hide="slide-down"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="move-category-dialog">
      <q-card-section class="move-category-dialog__header">
        <div class="row items-center no-wrap">
          <q-icon name="drive_file_move" size="28px" color="primary" class="q-mr-sm" />
          <div class="col">
            <div class="text-h6">Move to Category</div>
            <div class="text-caption text-grey-7 ellipsis">
              New parent for «{{ categoryName }}»
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="move-category-dialog__body">
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="Search categories..."
          class="q-mb-md"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          class="move-category-dialog__table"
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
              No categories found
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Move"
          :loading="loading"
          :disable="selectedRows.length === 0"
          @click="$emit('move')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type ParentOption = { categoryId: number; label: string };
type Row = { key: string; categoryId: number | null; label: string };

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
  categoryName: string;
  parentOptions: ParentOption[];
  parentId: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  move: [];
  "update:parentId": [value: number | null];
}>();

const parentIdModel = computed({
  get: () => props.parentId,
  set: (v) => emit("update:parentId", v),
});

const search = ref("");
const selectedRows = ref<Row[]>([]);

const columns = [
  { name: "label", label: "Category", field: "label", align: "left" as const },
];

const rows = computed<Row[]>(() => [
  { key: "root", categoryId: null, label: "No parent (root)" },
  ...props.parentOptions.map((o) => ({
    key: String(o.categoryId),
    categoryId: o.categoryId,
    label: o.label,
  })),
]);

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
    const key = props.parentId == null ? "root" : String(props.parentId);
    const row = rows.value.find((r) => r.key === key);
    selectedRows.value = row ? [row] : [];
  },
);

function onRowClick(_evt: unknown, row: Row) {
  selectedRows.value = [row];
  parentIdModel.value = row.categoryId;
}
</script>

<style scoped>
.move-category-dialog {
  width: min(520px, 50vw);
  max-width: 50vw;
  max-height: min(520px, 92vh);
  display: flex;
  flex-direction: column;
}

.move-category-dialog__header {
  padding: 14px 16px;
}

.move-category-dialog__body {
  padding: 16px;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.move-category-dialog__table {
  flex: 1 1 auto;
  min-height: 0;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
