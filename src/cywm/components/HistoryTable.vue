<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    bordered
    dense
    :loading="loading"
    :pagination="pagination"
    :rows-per-page-options="[10, 25, 50]"
    @update:pagination="(p) => $emit('update:pagination', p)"
    class="cywm-history-table"
  >
    <template #body-cell-startedAt="rowProps">
      <q-td :props="rowProps" class="cywm-history-table__mono">
        {{ formatTime(rowProps.row.startedAt) }}
      </q-td>
    </template>

    <template #body-cell-filename="rowProps">
      <q-td :props="rowProps" class="cywm-history-table__mono">
        {{ rowProps.row.filename }}
      </q-td>
    </template>

    <template #body-cell-status="rowProps">
      <q-td :props="rowProps">
        <span
          :class="[
            'cywm-badge',
            rowProps.row.status === 'success'
              ? 'cywm-badge--success'
              : rowProps.row.status === 'failed'
                ? 'cywm-badge--danger'
                : 'cywm-badge--warning',
          ]"
        >
          <span class="cywm-badge__dot"></span>
          {{ rowProps.row.status }}
        </span>
      </q-td>
    </template>

    <template #body-cell-duration="rowProps">
      <q-td :props="rowProps" class="cywm-history-table__mono">
        {{ (rowProps.row.durationMs / 1000).toFixed(1) }}s
      </q-td>
    </template>

    <template #body-cell-actions="rowProps">
      <q-td :props="rowProps">
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="visibility"
          color="primary"
          @click="$emit('view-log', rowProps.row)"
        >
          <q-tooltip>View log</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { DeployRecord } from "@/cywm/types";

defineProps<{
  rows: DeployRecord[];
  loading: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber?: number;
    sortBy?: string;
    descending?: boolean;
  };
}>();

defineEmits<{
  "update:pagination": [pagination: object];
  "view-log": [row: DeployRecord];
}>();

const columns: QTableProps["columns"] = [
  {
    name: "startedAt",
    label: "Time",
    field: "startedAt",
    align: "left",
    sortable: true,
  },
  { name: "target", label: "Target", field: "target", align: "left" },
  { name: "filename", label: "File", field: "filename", align: "left" },
  { name: "category", label: "Category", field: "category", align: "left" },
  { name: "user", label: "By", field: "user", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  {
    name: "duration",
    label: "Duration",
    field: "durationMs",
    align: "left",
    sortable: true,
  },
  { name: "actions", label: "", field: "id", align: "center" },
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(
    d.getFullYear(),
  ).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
</script>

<style lang="scss" scoped>
.cywm-history-table {
  background: var(--cywm-bg-card);
  border-color: var(--cywm-border);
}

.cywm-history-table__mono {
  font-family: var(--cywm-mono);
  font-size: 12px;
}

.cywm-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: capitalize;
}

.cywm-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.cywm-badge--success {
  background: #e6f7ee;
  color: var(--cywm-success);
}

.cywm-badge--success .cywm-badge__dot {
  background: var(--cywm-success);
}

.cywm-badge--danger {
  background: #fde8e6;
  color: var(--cywm-danger);
}

.cywm-badge--danger .cywm-badge__dot {
  background: var(--cywm-danger);
}

.cywm-badge--warning {
  background: #fdf3e0;
  color: var(--cywm-warning);
}

.cywm-badge--warning .cywm-badge__dot {
  background: var(--cywm-warning);
}
</style>
