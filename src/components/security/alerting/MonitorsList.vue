<template>
  <div class="wz-monitors-page">
    <div class="wz-panel">
      <!-- Header -->
      <div class="wz-panel__header">
        <h2 class="wz-panel__title">Monitors</h2>
        <div class="wz-panel__actions">
          <div class="wz-dropdown" ref="actionsDropdownRef">
            <button
              class="wz-btn wz-btn--outline"
              :disabled="store.selectedMonitorIds.length === 0"
              @click="showActions = !showActions"
            >
              Actions
              <q-icon name="arrow_drop_down" size="18px" />
            </button>
            <div v-if="showActions" class="wz-dropdown__menu">
              <button class="wz-dropdown__item" @click="bulkAction('enable')">Enable</button>
              <button class="wz-dropdown__item" @click="bulkAction('disable')">Disable</button>
              <button class="wz-dropdown__item wz-dropdown__item--danger" @click="bulkAction('delete')">Delete</button>
            </div>
          </div>
          <button class="wz-btn wz-btn--primary" @click="store.openCreateMonitor()">+ Create monitor</button>
        </div>
      </div>

      <!-- Search & filter bar -->
      <div class="wz-filter-bar">
        <div class="wz-search-wrap">
          <q-icon name="search" size="18px" class="wz-search-icon" />
          <input v-model="store.monitorsSearch" class="wz-search-input" placeholder="Search" />
        </div>
        <select v-model="store.monitorsStateFilter" class="wz-select">
          <option value="all">All states</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <!-- Table -->
      <div class="wz-table-wrap">
        <table class="wz-table">
          <thead>
            <tr>
              <th class="wz-table__check"><input type="checkbox" @change="toggleAll" :checked="allChecked" /></th>
              <th class="wz-table__sortable" @click="sortBy('name')">
                Monitor name
                <q-icon v-if="sortField === 'name'" :name="sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'" size="12px" />
              </th>
              <th>State</th>
              <th>Type</th>
              <th>Latest alert</th>
              <th>Last notification time</th>
              <th>Active</th>
              <th>Acknowledged</th>
              <th>Errors</th>
              <th>Ignored</th>
              <th>Associations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="store.monitorsLoading">
              <td colspan="12" class="wz-table__loading">
                <q-spinner size="24px" color="primary" />
              </td>
            </tr>
            <tr v-else-if="paginatedMonitors.length === 0">
              <td colspan="12" class="wz-table__empty">
                <p>There are no existing monitors. Create a monitor to add triggers and actions.</p>
                <button class="wz-btn wz-btn--primary" @click="store.openCreateMonitor()">Create monitor</button>
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="monitor in paginatedMonitors"
                :key="monitor.id"
                class="wz-table__row"
              >
                <td class="wz-table__check">
                  <input
                    type="checkbox"
                    :checked="store.selectedMonitorIds.includes(monitor.id)"
                    @change="toggleMonitor(monitor.id)"
                  />
                </td>
                <td>
                  <a class="wz-link" @click.prevent="$emit('open-detail', monitor.id)">{{ monitor.name }}</a>
                </td>
                <td>
                  <span class="wz-badge" :class="monitor.enabled ? 'wz-badge--enabled' : 'wz-badge--disabled'">
                    {{ monitor.enabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </td>
                <td>{{ monitorTypeLabel(monitor.type) }}</td>
                <td>{{ monitor.latest_alert || '-' }}</td>
                <td>{{ formatDate(monitor.last_notification_time) }}</td>
                <td>{{ monitor.active_count }}</td>
                <td>{{ monitor.acknowledged_count }}</td>
                <td>{{ monitor.errors_count }}</td>
                <td>{{ monitor.ignored_count }}</td>
                <td>{{ monitor.associations_count }}</td>
                <td>
                  <button class="wz-btn-icon" title="Enable/Disable" @click="toggleEnabled(monitor)">
                    <q-icon :name="monitor.enabled ? 'pause_circle_outline' : 'play_circle_outline'" size="18px" />
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="wz-pagination" v-if="store.filteredMonitors.length > 0">
        <div class="wz-pagination__info">
          Rows per page:
          <select v-model.number="rowsPerPage" class="wz-pagination__select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="wz-pagination__controls">
          <span class="wz-pagination__range">{{ rangeLabel }}</span>
          <button class="wz-btn-icon" :disabled="currentPage === 1" @click="currentPage--">
            <q-icon name="chevron_left" size="20px" />
          </button>
          <button class="wz-btn-icon" :disabled="currentPage >= totalPages" @click="currentPage++">
            <q-icon name="chevron_right" size="20px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import { monitorTypeLabel } from "@/types/alerting";
import type { Monitor } from "@/types/alerting";

defineEmits<{
  (e: "open-detail", id: string): void;
}>();

const store = useAlertingStore();

// Dropdown
const actionsDropdownRef = ref<HTMLElement | null>(null);
const showActions = ref(false);

function onDocClick(e: MouseEvent) {
  if (actionsDropdownRef.value && !actionsDropdownRef.value.contains(e.target as Node)) {
    showActions.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocClick));
onUnmounted(() => document.removeEventListener("click", onDocClick));

// Sorting
const sortField = ref<"name" | "">("");
const sortDir = ref<"asc" | "desc">("asc");

function sortBy(field: "name") {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDir.value = "asc";
  }
}

const sortedMonitors = computed(() => {
  const list = [...store.filteredMonitors];
  if (sortField.value === "name") {
    list.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortDir.value === "asc" ? cmp : -cmp;
    });
  }
  return list;
});

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(20);

const totalPages = computed(() => Math.max(1, Math.ceil(sortedMonitors.value.length / rowsPerPage.value)));

const paginatedMonitors = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return sortedMonitors.value.slice(start, start + rowsPerPage.value);
});

const rangeLabel = computed(() => {
  const total = sortedMonitors.value.length;
  if (total === 0) return "0 of 0";
  const start = (currentPage.value - 1) * rowsPerPage.value + 1;
  const end = Math.min(currentPage.value * rowsPerPage.value, total);
  return `${start}-${end} of ${total}`;
});

// Select all
const allChecked = computed(() => {
  return paginatedMonitors.value.length > 0 && paginatedMonitors.value.every((m) => store.selectedMonitorIds.includes(m.id));
});

function toggleAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  if (checked) {
    const ids = paginatedMonitors.value.map((m) => m.id);
    store.selectedMonitorIds = [...new Set([...store.selectedMonitorIds, ...ids])];
  } else {
    const pageIds = new Set(paginatedMonitors.value.map((m) => m.id));
    store.selectedMonitorIds = store.selectedMonitorIds.filter((id) => !pageIds.has(id));
  }
}

function toggleMonitor(id: string) {
  const idx = store.selectedMonitorIds.indexOf(id);
  if (idx >= 0) store.selectedMonitorIds.splice(idx, 1);
  else store.selectedMonitorIds.push(id);
}

// Bulk actions
async function bulkAction(action: "enable" | "disable" | "delete") {
  showActions.value = false;
  const ids = [...store.selectedMonitorIds];
  if (ids.length === 0) return;
  if (action === "enable") await store.enableMonitors(ids);
  else if (action === "disable") await store.disableMonitors(ids);
  else if (action === "delete") await store.removeMonitors(ids);
}

// Toggle individual monitor
async function toggleEnabled(monitor: Monitor) {
  if (monitor.enabled) {
    await store.disableMonitors([monitor.id]);
  } else {
    await store.enableMonitors([monitor.id]);
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
</script>

<style scoped>
.wz-monitors-page { padding: 24px; }

.wz-panel {
  background: #fff;
  border: 1px solid #d3dae6;
  border-radius: 4px;
}

.wz-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.wz-panel__title {
  font-size: 20px;
  font-weight: 400;
  color: #1a1c21;
  margin: 0;
}

.wz-panel__actions { display: flex; gap: 8px; align-items: center; }

/* Filter bar */
.wz-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px 12px;
}

.wz-search-wrap { flex: 1; position: relative; }

.wz-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #69707d;
}

.wz-search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
}

.wz-search-input:focus { outline: none; border-color: #006bb4; }

.wz-select {
  padding: 8px 28px 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
  appearance: auto;
}

/* Buttons */
.wz-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wz-btn--outline {
  background: #fff;
  border: 1px solid #d3dae6;
  color: #343741;
}

.wz-btn--outline:hover { background: #f5f7fa; }
.wz-btn--outline:disabled { opacity: 0.5; cursor: default; }

.wz-btn--primary {
  background: #006bb4;
  color: #fff;
  border: 1px solid #006bb4;
}

.wz-btn--primary:hover { background: #005a9e; }

.wz-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #69707d;
  border-radius: 4px;
}

.wz-btn-icon:hover { background: #f0f2f5; color: #343741; }
.wz-btn-icon:disabled { opacity: 0.4; cursor: default; }

/* Dropdown */
.wz-dropdown { position: relative; }

.wz-dropdown__menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 140px;
  z-index: 20;
}

.wz-dropdown__item {
  display: block;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #343741;
}

.wz-dropdown__item:hover { background: #f5f7fa; }
.wz-dropdown__item--danger { color: #bd271e; }
.wz-dropdown__item--danger:hover { background: #fef0ef; }

/* Table */
.wz-table-wrap { overflow-x: auto; }

.wz-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.wz-table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  color: #69707d;
  font-size: 12px;
  border-bottom: 1px solid #d3dae6;
  background: #f5f7fa;
  white-space: nowrap;
}

.wz-table td {
  padding: 8px 12px;
  color: #343741;
  border-bottom: 1px solid #eef1f5;
}

.wz-table__check { width: 32px; text-align: center; }
.wz-table__sortable { cursor: pointer; user-select: none; }

.wz-table__row:hover { background: #f5f7fa; }

.wz-table__empty {
  text-align: center;
  padding: 40px 24px !important;
  color: #69707d;
}

.wz-table__empty p {
  margin-bottom: 16px;
  font-size: 14px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.wz-table__loading { text-align: center; padding: 40px !important; }

/* Link */
.wz-link {
  color: #006bb4;
  cursor: pointer;
  text-decoration: none;
}

.wz-link:hover { text-decoration: underline; }

/* Badge */
.wz-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.wz-badge--enabled { background: #e6f9f7; color: #017d73; }
.wz-badge--disabled { background: #f5f7fa; color: #69707d; }

/* Pagination */
.wz-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 24px;
  gap: 16px;
  border-top: 1px solid #d3dae6;
  font-size: 13px;
  color: #69707d;
}

.wz-pagination__info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wz-pagination__select {
  padding: 2px 6px;
  border: 1px solid #d3dae6;
  border-radius: 3px;
  font-size: 13px;
  background: #fff;
}

.wz-pagination__controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wz-pagination__range { white-space: nowrap; }

/* Dark mode */
.body--dark .wz-panel { background: #1d1e24; border-color: #343741; }
.body--dark .wz-panel__title { color: #dfe5ef; }
.body--dark .wz-search-input { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-select { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-table__row:hover { background: #25262b; }
.body--dark .wz-btn--outline { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-btn-icon { color: #98a2b3; }
.body--dark .wz-btn-icon:hover { background: #2a2b32; color: #dfe5ef; }
.body--dark .wz-dropdown__menu { background: #25262b; border-color: #343741; }
.body--dark .wz-dropdown__item { color: #dfe5ef; }
.body--dark .wz-dropdown__item:hover { background: #2a2b32; }
.body--dark .wz-link { color: #36a2ef; }
.body--dark .wz-badge--enabled { background: #0a3d38; color: #7dded5; }
.body--dark .wz-badge--disabled { background: #2a2b32; color: #98a2b3; }
.body--dark .wz-pagination { border-color: #343741; color: #98a2b3; }
.body--dark .wz-pagination__select { background: #25262b; border-color: #343741; color: #dfe5ef; }
</style>
