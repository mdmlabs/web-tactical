<template>
  <div class="resources-table-container">
    <!-- Loading State -->
    <div v-if="loading" class="table-loading">
      <q-skeleton type="QTable" :columns="5" :rows="5" />
    </div>

    <!-- Empty State -->
    <div v-else-if="resources.length === 0" class="table-empty">
      <q-icon :name="emptyIcon" size="64px" color="grey-5" />
      <h3 class="empty-title">No {{ categoryLabel }} yet</h3>
      <p class="empty-description">
        Upload your first {{ categorySingular }} to get started
      </p>
      <q-btn
        color="primary"
        :icon="'add'"
        :label="`Upload ${categorySingular}`"
        unelevated
        @click="$emit('create')"
      />
    </div>

    <!-- Table -->
    <q-table
      v-else
      flat
      :rows="resources"
      :columns="columns"
      row-key="id"
      v-model:pagination="paginationModel"
      :rows-per-page-options="[10, 20, 50]"
      class="resources-table"
      @request="onRequest"
    >
      <!-- Name Column -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props" class="name-cell">
          <div class="name-wrapper">
            <q-icon
              :name="getResourceIcon(props.row)"
              size="20px"
              class="resource-icon"
            />
            <div class="name-content">
              <div class="resource-name">{{ props.row.name }}</div>
              <div
                v-if="
                  props.row.fileName && props.row.fileName !== props.row.name
                "
                class="resource-filename"
              >
                {{ props.row.fileName }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- Description Column -->
      <template v-slot:body-cell-description="props">
        <q-td :props="props" class="description-cell">
          <span class="description-text">{{
            props.row.description || "-"
          }}</span>
        </q-td>
      </template>

      <!-- Segment Column -->
      <template v-slot:body-cell-segment="props">
        <q-td :props="props">
          <q-badge class="segment-badge">
            <q-icon name="public" size="12px" class="q-mr-xs" />
            {{ props.row.segment }}
          </q-badge>
        </q-td>
      </template>

      <!-- Language Column (Scripts) -->
      <template v-slot:body-cell-language="props">
        <q-td :props="props">
          <span class="language-text">{{ props.row.language }}</span>
        </q-td>
      </template>

      <!-- Version Column (Apps) -->
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          <span class="version-text">{{ props.row.version }}</span>
        </q-td>
      </template>

      <!-- Platform Column (Apps) -->
      <template v-slot:body-cell-platform="props">
        <q-td :props="props">
          <span class="platform-text">{{ props.row.platform }}</span>
        </q-td>
      </template>

      <!-- Size Column -->
      <template v-slot:body-cell-size="props">
        <q-td :props="props">
          <span class="size-text">{{ props.row.size }}</span>
        </q-td>
      </template>

      <!-- Dimensions Column (Images) -->
      <template v-slot:body-cell-dimensions="props">
        <q-td :props="props">
          <span class="dimensions-text">{{ props.row.dimensions }}</span>
        </q-td>
      </template>

      <!-- Expiry Date Column (Certificates) -->
      <template v-slot:body-cell-expiryDate="props">
        <q-td :props="props">
          <span
            :class="[
              'expiry-text',
              { 'expiry-warning': isExpiringSoon(props.row.expiryDate) },
            ]"
          >
            {{ formatDate(props.row.expiryDate) }}
          </span>
        </q-td>
      </template>

      <!-- Issued To Column (Certificates) -->
      <template v-slot:body-cell-issuedTo="props">
        <q-td :props="props">
          <span class="issued-to-text">{{ props.row.issuedTo }}</span>
        </q-td>
      </template>

      <!-- Extension Column -->
      <template v-slot:body-cell-extension="props">
        <q-td :props="props">
          <span class="extension-text">{{ props.row.extension }}</span>
        </q-td>
      </template>

      <!-- Created Column -->
      <template v-slot:body-cell-created="props">
        <q-td :props="props">
          <span class="created-text">{{
            formatRelativeTime(props.row.createdTime)
          }}</span>
        </q-td>
      </template>

      <!-- Actions Column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions-cell">
          <q-btn
            flat
            round
            dense
            icon="download"
            size="sm"
            @click="$emit('download', props.row)"
          >
            <q-tooltip>Download</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="more_vert" size="sm">
            <q-menu>
              <q-list dense style="min-width: 150px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$emit('edit', props.row)"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" size="sm" />
                  </q-item-section>
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$emit('download', props.row)"
                >
                  <q-item-section avatar>
                    <q-icon name="download" size="sm" />
                  </q-item-section>
                  <q-item-section>Download</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  @click="confirmDelete(props.row)"
                >
                  <q-item-section avatar>
                    <q-icon name="delete" size="sm" color="negative" />
                  </q-item-section>
                  <q-item-section class="text-negative">Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>

      <!-- Pagination -->
      <template v-slot:bottom="props">
        <div class="table-pagination">
          <span class="pagination-info">
            Showing
            {{
              props.pagination.page > 1
                ? (props.pagination.page - 1) * props.pagination.rowsPerPage + 1
                : 1
            }}
            -
            {{
              Math.min(
                props.pagination.page * props.pagination.rowsPerPage,
                props.pagination.rowsNumber || resources.length,
              )
            }}
            of {{ props.pagination.rowsNumber || resources.length }}
          </span>
          <div class="pagination-controls">
            <span class="page-label">Page</span>
            <q-input
              :model-value="props.pagination.page"
              type="number"
              dense
              outlined
              class="page-input"
              min="1"
              :max="props.pagesNumber"
              @update:model-value="goToPage($event, props)"
            />
            <span class="page-total">of {{ props.pagesNumber }}</span>
            <q-btn
              flat
              dense
              round
              icon="chevron_left"
              :disable="props.pagination.page <= 1"
              @click="props.prevPage"
            />
            <q-btn
              flat
              dense
              round
              icon="chevron_right"
              :disable="props.pagination.page >= props.pagesNumber"
              @click="props.nextPage"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import type { ResourceType, Resource } from "../types/resources";

const $q = useQuasar();

const props = defineProps<{
  resources: Resource[];
  resourceType: ResourceType;
  loading?: boolean;
  pagination: {
    page: number;
    rowsPerPage: number;
    rowsNumber?: number;
  };
}>();

const emit = defineEmits<{
  (e: "create"): void;
  (e: "edit", resource: Resource): void;
  (e: "delete", resource: Resource): void;
  (e: "download", resource: Resource): void;
  (e: "update:pagination", pagination: typeof props.pagination): void;
  (e: "request", params: { pagination: typeof props.pagination }): void;
}>();

const paginationModel = computed({
  get: () => props.pagination,
  set: (val) => emit("update:pagination", val),
});

function onRequest(requestProps: { pagination: typeof props.pagination }) {
  emit("request", requestProps);
}

const categoryLabel = computed(() => {
  const labels: Record<ResourceType, string> = {
    script: "Scripts",
    app: "Apps",
    book: "Books",
    image: "Images",
    certificate: "Certificates",
  };
  return labels[props.resourceType];
});

const categorySingular = computed(() => {
  const labels: Record<ResourceType, string> = {
    script: "Script",
    app: "App",
    book: "Book",
    image: "Image",
    certificate: "Certificate",
  };
  return labels[props.resourceType];
});

const emptyIcon = computed(() => {
  const icons: Record<ResourceType, string> = {
    script: "code",
    app: "apps",
    book: "menu_book",
    image: "image",
    certificate: "vpn_key",
  };
  return icons[props.resourceType];
});

const columns = computed(() => {
  const baseColumns = [
    {
      name: "name",
      label: "NAME",
      field: "name",
      align: "left" as const,
      sortable: true,
    },
    {
      name: "description",
      label: "DESCRIPTION",
      field: "description",
      align: "left" as const,
    },
    {
      name: "segment",
      label: "SEGMENT",
      field: "segment",
      align: "left" as const,
      sortable: true,
    },
  ];

  const typeSpecificColumns: Record<ResourceType, typeof baseColumns> = {
    script: [
      {
        name: "language",
        label: "LANGUAGE",
        field: "language",
        align: "left" as const,
        sortable: true,
      },
      {
        name: "extension",
        label: "EXTENSION",
        field: "extension",
        align: "left" as const,
      },
    ],
    app: [
      {
        name: "version",
        label: "VERSION",
        field: "version",
        align: "left" as const,
      },
      {
        name: "platform",
        label: "PLATFORM",
        field: "platform",
        align: "left" as const,
        sortable: true,
      },
    ],
    book: [
      { name: "size", label: "SIZE", field: "size", align: "left" as const },
      {
        name: "extension",
        label: "EXTENSION",
        field: "extension",
        align: "left" as const,
      },
    ],
    image: [
      { name: "size", label: "SIZE", field: "size", align: "left" as const },
      {
        name: "dimensions",
        label: "DIMENSIONS",
        field: "dimensions",
        align: "left" as const,
      },
      {
        name: "extension",
        label: "EXTENSION",
        field: "extension",
        align: "left" as const,
      },
    ],
    certificate: [
      {
        name: "expiryDate",
        label: "EXPIRY DATE",
        field: "expiryDate",
        align: "left" as const,
        sortable: true,
      },
      {
        name: "issuedTo",
        label: "ISSUED TO",
        field: "issuedTo",
        align: "left" as const,
      },
    ],
  };

  const createdColumn = {
    name: "created",
    label: "CREATED",
    field: "createdTime",
    align: "left" as const,
    sortable: true,
  };
  const actionsColumn = {
    name: "actions",
    label: "",
    field: "actions",
    align: "right" as const,
  };

  return [
    ...baseColumns,
    ...typeSpecificColumns[props.resourceType],
    createdColumn,
    actionsColumn,
  ];
});

function getResourceIcon(resource: Resource): string {
  const icons: Record<ResourceType, string> = {
    script: "code",
    app: "apps",
    book: "description",
    image: "image",
    certificate: "vpn_key",
  };
  return icons[resource.type];
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString();
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function isExpiringSoon(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays < 30;
}

function confirmDelete(resource: Resource) {
  $q.dialog({
    title: "Delete Resource",
    message: `Are you sure you want to delete "${resource.name}"? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: {
      label: "Delete",
      color: "negative",
      flat: true,
    },
    cancel: {
      label: "Cancel",
      flat: true,
    },
  }).onOk(() => {
    emit("delete", resource);
  });
}

function goToPage(
  page: number | string | null,
  tableProps: { pagination: typeof props.pagination },
) {
  if (page && typeof page === "number") {
    emit("update:pagination", { ...tableProps.pagination, page });
  }
}
</script>

<style scoped>
.resources-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.table-loading,
.table-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.empty-title {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.empty-description {
  margin: 0 0 24px;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.resources-table {
  flex: 1;
}

.resources-table :deep(.q-table__top) {
  display: none;
}

.resources-table :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--table-header-bg, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.resources-table :deep(tbody td) {
  font-size: 14px;
  color: var(--text-primary, #1a1a2e);
  border-bottom: 1px solid var(--border-color, #f3f4f6);
}

.resources-table :deep(tbody tr:hover) {
  background: var(--row-hover-bg, #f9fafb);
}

.name-cell {
  max-width: 300px;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.resource-icon {
  color: var(--text-secondary, #6b7280);
}

.name-content {
  min-width: 0;
}

.resource-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-filename {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description-cell {
  max-width: 200px;
}

.description-text {
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.segment-badge {
  background: var(--badge-bg, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
}

.language-text,
.version-text,
.platform-text,
.size-text,
.dimensions-text,
.issued-to-text,
.extension-text {
  color: var(--text-primary, #1a1a2e);
}

.created-text {
  color: var(--text-secondary, #6b7280);
}

.expiry-text {
  color: var(--text-primary, #1a1a2e);
}

.expiry-warning {
  color: var(--warning-color, #f59e0b);
  font-weight: 500;
}

.actions-cell {
  white-space: nowrap;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.page-label,
.page-total {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.page-input {
  width: 50px;
}

.page-input :deep(.q-field__control) {
  height: 28px;
}

.page-input :deep(input) {
  text-align: center;
  font-size: 13px;
}

/* Dark theme */
.body--dark .resources-table-container {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
  --table-header-bg: #1e1e2d;
  --row-hover-bg: #2a2a3d;
  --badge-bg: #3d3d4d;
}
</style>
