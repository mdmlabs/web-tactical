<template>
  <div class="au-devices">
    <!-- Header -->
    <div class="au-devices-header">
      <div class="au-devices-header__left">
        <q-input
          :model-value="searchFilter"
          outlined
          dense
          placeholder="Filter devices..."
          class="au-search-input"
          clearable
          @update:model-value="$emit('update:searchFilter', $event)"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="au-devices-header__right">
        <span class="au-devices-count">{{ selectedAgents.length }} of {{ agents.length }} selected</span>
        <button
          v-if="agents.length > 0"
          class="au-select-all-btn"
          @click="$emit('toggle-select-all')"
        >
          {{ allSelected ? 'Deselect All' : 'Select All' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="au-devices-loading">
      <q-skeleton type="QTable" :columns="3" :rows="4" />
    </div>

    <!-- Empty -->
    <div v-else-if="agents.length === 0" class="au-devices-empty">
      <q-icon name="devices" size="64px" color="grey-5" />
      <h3 class="au-devices-empty__title">No devices match current filters</h3>
      <p class="au-devices-empty__desc">Try adjusting the version filter or search query.</p>
    </div>

    <!-- Table -->
    <q-table
      v-else
      flat
      :rows="agents"
      :columns="columns"
      row-key="agent_id"
      :pagination="pagination"
      :rows-per-page-options="[10, 20, 50, 100]"
      class="au-table"
      @row-click="onRowClick"
    >
      <!-- Checkbox Column -->
      <template v-slot:body-cell-select="props">
        <q-td :props="props" class="select-cell">
          <q-checkbox
            :model-value="selectedAgents.includes(props.row.agent_id)"
            dense
            @update:model-value="$emit('toggle-agent', props.row.agent_id)"
            @click.stop
          />
        </q-td>
      </template>

      <!-- Hostname Column -->
      <template v-slot:body-cell-hostname="props">
        <q-td :props="props" class="hostname-cell">
          <div class="hostname-wrapper">
            <q-icon name="computer" size="20px" class="hostname-icon" />
            <span class="hostname-text">{{ props.row.hostname }}</span>
          </div>
        </q-td>
      </template>

      <!-- Version Column (Main mode) -->
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          <span class="version-text">{{ props.row.version || 'N/A' }}</span>
        </q-td>
      </template>

      <!-- Status Column -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="status-wrapper">
            <span
              class="status-dot"
              :class="props.row.status === 'online' ? 'status-dot--online' : 'status-dot--offline'"
            ></span>
            <span class="status-label">{{ props.row.status === 'online' ? 'Online' : 'Offline' }}</span>
          </div>
        </q-td>
      </template>

      <!-- MDM Version Column -->
      <template v-slot:body-cell-mdm_version="props">
        <q-td :props="props">
          <span class="version-text">{{ props.row.mdm_agent_version || 'N/A' }}</span>
        </q-td>
      </template>

      <!-- Architecture Column (Main mode) -->
      <template v-slot:body-cell-arch="props">
        <q-td :props="props">
          <span class="arch-text">{{ props.row.goarch || 'x64' }}</span>
        </q-td>
      </template>

      <!-- Actions Column (MDM mode) -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions-cell">
          <button
            class="au-table-btn au-table-btn--delete"
            :disabled="deletingAgents[props.row.agent_id]"
            @click.stop="$emit('delete-agent', props.row.agent_id)"
          >
            <q-spinner v-if="deletingAgents[props.row.agent_id]" size="14px" />
            <q-icon v-else name="delete_outline" size="14px" />
            Delete
          </button>
          <button
            class="au-table-btn au-table-btn--update"
            :disabled="isSameVersion(props.row) || updatingAgents[props.row.agent_id]"
            @click.stop="$emit('update-agent', props.row.agent_id)"
          >
            <q-spinner v-if="updatingAgents[props.row.agent_id]" size="14px" />
            <template v-else>
              <q-icon name="system_update" size="14px" class="update-icon" />
              Update
            </template>
          </button>
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
                props.pagination.rowsNumber || agents.length,
              )
            }}
            of {{ props.pagination.rowsNumber || agents.length }}
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

<script>
export default {
  name: "AgentUpdatesDevices",
  props: {
    agents: { type: Array, default: () => [] },
    selectedAgents: { type: Array, default: () => [] },
    selectedVersion: { type: Object, default: null },
    searchFilter: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    allSelected: { type: Boolean, default: false },
    mode: { type: String, default: "main" },
    updatingAgents: { type: Object, default: () => ({}) },
    deletingAgents: { type: Object, default: () => ({}) },
  },
  emits: ["toggle-agent", "toggle-select-all", "update:searchFilter", "update-agent", "delete-agent"],
  data() {
    return {
      pagination: {
        sortBy: "hostname",
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: null,
      },
    };
  },
  computed: {
    columns() {
      const baseColumns = [
        {
          name: "select",
          label: "",
          field: "select",
          align: "left",
          sortable: false,
        },
        {
          name: "hostname",
          label: "HOSTNAME",
          field: "hostname",
          align: "left",
          sortable: true,
        },
      ];

      // Main mode: show version and arch columns
      if (this.mode === "main") {
        return [
          ...baseColumns,
          {
            name: "version",
            label: "VERSION",
            field: "version",
            align: "left",
            sortable: true,
          },
          {
            name: "status",
            label: "STATUS",
            field: "status",
            align: "left",
            sortable: true,
          },
          {
            name: "arch",
            label: "ARCH",
            field: "goarch",
            align: "left",
            sortable: true,
          },
        ];
      }

      // MDM mode: show status, mdm version and actions columns
      return [
        ...baseColumns,
        {
          name: "status",
          label: "STATUS",
          field: "status",
          align: "left",
          sortable: true,
        },
        {
          name: "mdm_version",
          label: "MDM VERSION",
          field: "mdm_agent_version",
          align: "left",
          sortable: true,
        },
        {
          name: "actions",
          label: "ACTIONS",
          field: "actions",
          align: "right",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    onRowClick(evt, row) {
      this.$emit("toggle-agent", row.agent_id);
    },
    isSameVersion(agent) {
      if (!this.selectedVersion) return false;
      // For MDM mode, compare mdm_agent_version
      if (this.mode === "mdm") {
        return agent.mdm_agent_version === this.selectedVersion.value;
      }
      return agent.version === this.selectedVersion.value;
    },
    goToPage(page, props) {
      if (page && typeof page === "number") {
        this.pagination = { ...props.pagination, page };
      }
    },
  },
};
</script>

<style scoped>
.au-devices {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--content-bg, #ffffff);
}

/* -- Header -- */
.au-devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 12px;
  flex-wrap: wrap;
}

.au-devices-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.au-devices-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.au-search-input {
  min-width: 200px;
  max-width: 280px;
}

.au-search-input :deep(.q-field__control) {
  background: var(--input-bg, #ffffff);
}

.au-devices-count {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
}

.au-select-all-btn {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #d1d5db);
  background: transparent;
  color: var(--text-primary, #1a1a2e);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.au-select-all-btn:hover {
  border-color: var(--primary-color, #1089d3);
  color: var(--primary-color, #1089d3);
}

/* -- States -- */
.au-devices-loading {
  flex: 1;
  padding: 24px;
}

.au-devices-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.au-devices-empty__title {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.au-devices-empty__desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

/* -- Table -- */
.au-table {
  flex: 1;
}

.au-table :deep(.q-table__top) {
  display: none;
}

.au-table :deep(thead th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--table-header-bg, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.au-table :deep(tbody td) {
  font-size: 14px;
  color: var(--text-primary, #1a1a2e);
  border-bottom: 1px solid var(--border-color, #f3f4f6);
}

.au-table :deep(tbody tr) {
  cursor: pointer;
}

.au-table :deep(tbody tr:hover) {
  background: var(--row-hover-bg, #f9fafb);
}

.select-cell {
  width: 48px;
}

.hostname-cell {
  max-width: 300px;
}

.hostname-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hostname-icon {
  color: var(--text-secondary, #6b7280);
}

.hostname-text {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.version-text {
  font-family: monospace;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot--online {
  background: #059669;
  box-shadow: 0 0 6px rgba(5, 150, 105, 0.4);
}

.status-dot--offline {
  background: #9ca3af;
}

.status-label {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.arch-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
}

.actions-cell {
  white-space: nowrap;
}

.au-table-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--border-color, #e5e7eb);
  background: transparent;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.au-table-btn--delete:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

.au-table-btn--update {
  color: var(--text-primary, #1a1a2e);
  margin-left: 8px;
}

.au-table-btn--update:hover:not(:disabled) {
  border-color: var(--primary-color, #1089d3);
  color: var(--primary-color, #1089d3);
}

.au-table-btn--update .update-icon {
  transition: transform 0.4s ease;
}

.au-table-btn--update:hover:not(:disabled) .update-icon {
  transform: rotate(180deg);
}

.au-table-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* -- Pagination -- */
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

/* -- Dark theme -- */
.body--dark .au-devices {
  --content-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --input-bg: #2a2a3d;
  --row-hover-bg: #2a2a3d;
  --table-header-bg: #1e1e2d;
  --primary-color: #3b9ae8;
}
</style>
