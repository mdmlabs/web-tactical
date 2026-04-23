<template>
  <div class="uk-table-container uk-scrollbar">
    <table class="uk-table">
      <thead>
        <tr>
          <th v-if="selectable" class="uk-table__th uk-table__th--checkbox">
            <input
              type="checkbox"
              class="uk-checkbox"
              :checked="isAllSelected"
              :indeterminate="isPartiallySelected"
              @change="$emit('selectAll')"
            />
          </th>
          <th
            v-for="col in visibleColumns"
            :key="col.id"
            :class="[
              'uk-table__th',
              { 'uk-table__th--sorted': sortBy === col.id },
            ]"
            @click="col.sortable !== false && $emit('sort', col.id)"
          >
            <div class="uk-table__th-content">
              {{ col.label }}
              <q-icon
                v-if="sortBy === col.id"
                :name="sortAsc ? 'arrow_upward' : 'arrow_downward'"
                size="12px"
                class="uk-table__sort-icon"
              />
            </div>
          </th>
          <th v-if="$slots.rowActions" class="uk-table__th uk-table__th--actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="rowKey ? row[rowKey] : index"
          :class="[
            'uk-table__row',
            { 'uk-table__row--selected': selectedRows.includes(rowKey ? row[rowKey] : index) },
          ]"
          @click="$emit('rowClick', row)"
          @contextmenu.prevent="$emit('contextmenu', $event, row)"
        >
          <td v-if="selectable" class="uk-table__td uk-table__td--checkbox" @click.stop>
            <input
              type="checkbox"
              class="uk-checkbox"
              :checked="selectedRows.includes(rowKey ? row[rowKey] : index)"
              @change="$emit('select', rowKey ? row[rowKey] : index)"
            />
          </td>
          <td
            v-for="col in visibleColumns"
            :key="col.id"
            class="uk-table__td"
          >
            <slot :name="`cell-${col.id}`" :row="row" :value="row[col.id]">
              {{ row[col.id] }}
            </slot>
          </td>
          <td v-if="$slots.rowActions" class="uk-table__td uk-table__td--actions" @click.stop>
            <slot name="rowActions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface Column {
  id: string;
  label: string;
  visible?: boolean;
  sortable?: boolean;
}

const props = withDefaults(
  defineProps<{
    columns: Column[];
    rows: Record<string, unknown>[];
    rowKey?: string;
    sortBy?: string;
    sortAsc?: boolean;
    selectedRows?: (string | number)[];
    selectable?: boolean;
    loading?: boolean;
  }>(),
  {
    rowKey: "id",
    sortBy: "",
    sortAsc: true,
    selectedRows: () => [],
    selectable: false,
    loading: false,
  },
);

defineEmits<{
  sort: [colId: string];
  select: [key: string | number];
  selectAll: [];
  rowClick: [row: Record<string, unknown>];
  contextmenu: [event: MouseEvent, row: Record<string, unknown>];
}>();

const visibleColumns = computed(() =>
  props.columns.filter((c) => c.visible !== false),
);

const isAllSelected = computed(
  () =>
    props.selectedRows.length === props.rows.length && props.rows.length > 0,
);
const isPartiallySelected = computed(
  () => props.selectedRows.length > 0 && !isAllSelected.value,
);
</script>

<style scoped>
.uk-table-container {
  overflow-x: auto;
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  background: var(--uk-bg-surface);
}

.uk-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--uk-text-sm);
}

.uk-table__th {
  padding: var(--uk-space-2) var(--uk-space-3);
  text-align: left;
  font-size: var(--uk-text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-tertiary);
  background: var(--uk-table-header-bg);
  border-bottom: 1px solid var(--uk-border-default);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  position: sticky;
  top: 0;
  z-index: 1;
}

.uk-table__th:hover {
  color: var(--uk-text-secondary);
}

.uk-table__th--sorted {
  color: var(--uk-primary-text);
}

.uk-table__th--checkbox,
.uk-table__th--actions {
  width: 36px;
  cursor: default;
}

.uk-table__th-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.uk-table__sort-icon {
  color: var(--uk-primary);
}

.uk-table__row {
  border-bottom: 1px solid var(--uk-border-subtle);
  transition: background var(--uk-transition-fast);
  cursor: pointer;
}

.uk-table__row:hover {
  background: var(--uk-table-row-hover);
}

.uk-table__row--selected {
  background: var(--uk-table-row-selected);
}

.uk-table__td {
  padding: var(--uk-space-2) var(--uk-space-3);
  white-space: nowrap;
  vertical-align: middle;
}

.uk-table__td--checkbox {
  width: 36px;
}

.uk-table__td--actions {
  width: 36px;
  text-align: center;
}
</style>
