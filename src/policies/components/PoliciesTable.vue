<template>
  <div class="policies-table-container">
    <q-table
      :rows="policies"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="internalPagination"
      @update:pagination="onPaginationUpdate"
      flat
      class="policies-table"
      :rows-per-page-options="[10, 20, 50]"
    >
      <!-- Custom header -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-model="selectAll" dense />
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="table-header"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width></q-th>
        </q-tr>
      </template>

      <!-- Custom body -->
      <template v-slot:body="props">
        <q-tr :props="props" class="table-row clickable" @click="onRowClick(props.row)">
          <q-td auto-width @click.stop>
            <q-checkbox v-model="selectedIds" :val="props.row.id" dense />
          </q-td>

          <!-- Name with icon -->
          <q-td key="name" :props="props" class="name-cell">
            <div class="name-content">
              <div class="policy-icon">
                <q-icon name="mdi-shield-check" size="24px" color="primary" />
              </div>
              <div class="name-info">
                <span class="policy-name">{{ props.row.name }}</span>
                <span class="policy-version">v{{ props.row.version }}</span>
              </div>
            </div>
          </q-td>

          <!-- Summary -->
          <q-td key="summary" :props="props" class="summary-cell">
            <div class="summary-content">
              <q-icon
                v-if="props.row.apps.length > 0"
                name="mdi-monitor"
                size="16px"
                class="summary-icon"
              />
              <span :class="{ 'empty-summary': props.row.summary === 'Empty' }">
                {{ props.row.summary || 'Empty' }}
              </span>
            </div>
          </q-td>

          <!-- Segment -->
          <q-td key="segment" :props="props">
            <q-chip
              dense
              outline
              color="grey-7"
              size="sm"
              icon="public"
              class="segment-chip"
            >
              {{ props.row.segment }}
            </q-chip>
          </q-td>

          <!-- Device count -->
          <q-td key="deviceCount" :props="props" class="device-count-cell">
            {{ props.row.deviceCount }}
          </q-td>

          <!-- Updated -->
          <q-td key="updated" :props="props" class="date-cell">
            {{ formatDate(props.row.updated) }}
          </q-td>

          <!-- Created -->
          <q-td key="created" :props="props" class="date-cell">
            {{ formatDate(props.row.created) }}
          </q-td>

          <!-- Actions -->
          <q-td auto-width @click.stop>
            <q-btn flat round dense icon="more_vert" size="sm">
              <q-menu>
                <q-list dense style="min-width: 150px">
                  <q-item clickable v-close-popup @click="$emit('edit', props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" size="sm" />
                    </q-item-section>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="$emit('duplicate', props.row)">
                    <q-item-section avatar>
                      <q-icon name="content_copy" size="sm" />
                    </q-item-section>
                    <q-item-section>Duplicate</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="$emit('delete', props.row)" class="text-negative">
                    <q-item-section avatar>
                      <q-icon name="delete" size="sm" color="negative" />
                    </q-item-section>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <!-- Empty state -->
      <template v-slot:no-data>
        <div class="empty-state">
          <div class="empty-icon">
            <q-icon name="mdi-shield-off-outline" size="64px" color="grey-5" />
          </div>
          <p class="empty-title">No policies found</p>
          <p class="empty-description">Create a policy to get started</p>
          <q-btn
            color="primary"
            unelevated
            @click="$emit('create')"
            class="empty-btn"
          >
            <q-icon name="add" size="18px" class="q-mr-xs" />
            Create Policy
          </q-btn>
        </div>
      </template>

      <!-- Pagination -->
      <template v-slot:bottom="scope">
        <div class="pagination-container">
          <span class="pagination-info">
            Showing {{ scope.pagination.page === 1 ? 1 : ((scope.pagination.page - 1) * scope.pagination.rowsPerPage) + 1 }}
            - {{ Math.min(scope.pagination.page * scope.pagination.rowsPerPage, policies.length) }}
            of {{ policies.length }}
          </span>
          <div class="pagination-controls">
            <span class="pagination-label">Page</span>
            <q-input
              :model-value="scope.pagination.page"
              @update:model-value="val => onPageChange(Number(val), scope)"
              type="number"
              dense
              outlined
              class="page-input"
              min="1"
              :max="scope.pagesNumber"
            />
            <span class="pagination-label">of {{ scope.pagesNumber }}</span>
            <q-btn
              flat
              dense
              round
              icon="chevron_left"
              :disable="scope.pagination.page === 1"
              @click="scope.prevPage"
            />
            <q-btn
              flat
              dense
              round
              icon="chevron_right"
              :disable="scope.pagination.page >= scope.pagesNumber"
              @click="scope.nextPage"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Policy } from '../types/policies';
import { formatRelativeTime } from '../mocks/policiesMockData';

interface Props {
  policies: Policy[];
  loading?: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pagination: () => ({ page: 1, rowsPerPage: 20 }),
});

const emit = defineEmits<{
  (e: 'select', policy: Policy): void;
  (e: 'edit', policy: Policy): void;
  (e: 'delete', policy: Policy): void;
  (e: 'duplicate', policy: Policy): void;
  (e: 'create'): void;
  (e: 'update:pagination', pagination: { page: number; rowsPerPage: number }): void;
}>();

const selectAll = ref(false);
const selectedIds = ref<string[]>([]);

function onRowClick(policy: Policy) {
  emit('select', policy);
}

const internalPagination = ref({
  page: props.pagination.page,
  rowsPerPage: props.pagination.rowsPerPage,
  rowsNumber: props.policies.length,
});

watch(() => props.pagination, (newVal) => {
  internalPagination.value.page = newVal.page;
  internalPagination.value.rowsPerPage = newVal.rowsPerPage;
}, { deep: true });

watch(() => props.policies.length, (newLen) => {
  internalPagination.value.rowsNumber = newLen;
});

const columns = [
  {
    name: 'name',
    label: 'NAME',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'summary',
    label: 'SUMMARY',
    field: 'summary',
    align: 'left' as const,
  },
  {
    name: 'segment',
    label: 'SEGMENT',
    field: 'segment',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'deviceCount',
    label: '# DEVICES',
    field: 'deviceCount',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'updated',
    label: 'UPDATED',
    field: 'updated',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'created',
    label: 'CREATED',
    field: 'created',
    align: 'left' as const,
    sortable: true,
  },
];

function formatDate(dateString: string): string {
  return formatRelativeTime(dateString);
}

function onPaginationUpdate(newPagination: { page: number; rowsPerPage: number; rowsNumber: number }) {
  internalPagination.value = newPagination;
  emit('update:pagination', {
    page: newPagination.page,
    rowsPerPage: newPagination.rowsPerPage,
  });
}

function onPageChange(page: number, scope: { pagination: { rowsPerPage: number } }) {
  const newPagination = {
    ...internalPagination.value,
    page,
  };
  internalPagination.value = newPagination;
  emit('update:pagination', {
    page,
    rowsPerPage: scope.pagination.rowsPerPage,
  });
}

// Handle select all
watch(selectAll, (val) => {
  if (val) {
    selectedIds.value = props.policies.map(p => p.id);
  } else {
    selectedIds.value = [];
  }
});
</script>

<style scoped>
.policies-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.policies-table {
  flex: 1;
}

.policies-table :deep(.q-table__top),
.policies-table :deep(.q-table__bottom) {
  border: none;
}

.table-header {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.table-row:hover {
  background: var(--hover-bg, #f9fafb);
}

.name-cell {
  min-width: 250px;
}

.name-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.policy-icon {
  width: 40px;
  height: 40px;
  background: var(--icon-bg, #eef2ff);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name-info {
  display: flex;
  flex-direction: column;
}

.policy-name {
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  font-size: 14px;
}

.policy-version {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.summary-cell {
  min-width: 120px;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-icon {
  color: var(--text-secondary, #6b7280);
}

.empty-summary {
  color: var(--text-muted, #9ca3af);
  font-style: italic;
}

.segment-chip {
  font-size: 12px;
}

.device-count-cell {
  min-width: 80px;
}

.date-cell {
  color: var(--text-secondary, #6b7280);
  font-size: 13px;
  min-width: 100px;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 24px 0;
}

.empty-btn {
  text-transform: none;
  font-weight: 600;
}

/* Pagination */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.pagination-info {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-label {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.page-input {
  width: 60px;
}

.page-input :deep(.q-field__control) {
  height: 32px;
}

/* Dark theme */
.body--dark .policies-table-container {
  --hover-bg: #2a2a3d;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border-color: #2d2d3a;
  --icon-bg: #2a2a3d;
}
</style>
