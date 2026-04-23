<template>
  <UIKitLayout>
    <div class="uk-dashboard">
      <!-- Page Title + Actions -->
      <div class="uk-page-header">
        <div class="uk-page-header__left">
          <h1 class="uk-page-title">Agents</h1>
          <span class="uk-page-subtitle">{{ filteredAgents.length }} devices managed</span>
        </div>
        <div class="uk-page-header__actions">
          <button class="uk-btn uk-btn--secondary" @click="showBulkWizard = true">
            <q-icon name="bolt" size="16px" />
            Bulk Actions
          </button>
          <button class="uk-btn uk-btn--primary">
            <q-icon name="add" size="16px" />
            Install Agent
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="uk-stats-row">
        <div
          v-for="stat in dashStats"
          :key="stat.label"
          :class="['uk-stat-card', `uk-stat-card--${stat.color}`]"
        >
          <div class="uk-stat-card__header">
            <q-icon :name="stat.icon" size="18px" class="uk-stat-card__icon" />
            <span class="uk-stat-card__label">{{ stat.label }}</span>
          </div>
          <div class="uk-stat-card__value">{{ stat.value }}</div>
          <div :class="['uk-stat-card__trend', stat.trendUp ? 'uk-stat-card__trend--up' : 'uk-stat-card__trend--down']">
            <q-icon :name="stat.trendUp ? 'trending_up' : 'trending_down'" size="12px" />
            {{ stat.trend }}
          </div>
        </div>
      </div>

      <!-- Tabs + Filters -->
      <div class="uk-table-toolbar">
        <div class="uk-table-toolbar__left">
          <!-- Tabs -->
          <div class="uk-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['uk-tab', { 'uk-tab--active': activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <q-icon :name="tab.icon" size="16px" />
              {{ tab.label }}
              <span v-if="tab.count !== undefined" :class="['uk-tab__badge', tab.badgeType ? `uk-tab__badge--${tab.badgeType}` : '']">
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>
        <div class="uk-table-toolbar__right">
          <!-- Filter -->
          <div class="uk-filter-group">
            <button :class="['uk-filter-btn', { 'uk-filter-btn--active': statusFilter !== 'all' }]" @click="cycleStatusFilter">
              <q-icon name="filter_list" size="16px" />
              <span>{{ statusFilterLabel }}</span>
            </button>
            <button :class="['uk-filter-btn', { 'uk-filter-btn--active': showColumnPicker }]" @click="showColumnPicker = !showColumnPicker">
              <q-icon name="view_column" size="16px" />
              <span>Columns</span>
            </button>
          </div>

          <!-- Search in table -->
          <div class="uk-table-search">
            <q-icon name="search" size="16px" class="uk-table-search__icon" />
            <input
              v-model="tableSearch"
              class="uk-table-search__input"
              placeholder="Filter agents..."
            />
          </div>
        </div>
      </div>

      <!-- Column Picker -->
      <transition name="uk-slide-down">
        <div v-if="showColumnPicker" class="uk-column-picker">
          <label
            v-for="col in allColumns"
            :key="col.id"
            class="uk-column-picker__item"
          >
            <input type="checkbox" v-model="col.visible" class="uk-checkbox" />
            <span>{{ col.label }}</span>
          </label>
        </div>
      </transition>

      <!-- Selected Actions Bar -->
      <transition name="uk-slide-down">
        <div v-if="selectedAgents.length > 0" class="uk-selection-bar">
          <div class="uk-selection-bar__info">
            <q-icon name="check_circle" size="16px" />
            <span><strong>{{ selectedAgents.length }}</strong> agents selected</span>
          </div>
          <div class="uk-selection-bar__actions">
            <button class="uk-btn uk-btn--ghost uk-btn--sm">Run Script</button>
            <button class="uk-btn uk-btn--ghost uk-btn--sm">Install Patch</button>
            <button class="uk-btn uk-btn--ghost uk-btn--sm">Reboot</button>
            <button class="uk-btn uk-btn--danger-ghost uk-btn--sm">Uninstall Agent</button>
          </div>
          <button class="uk-btn uk-btn--ghost uk-btn--sm" @click="selectedAgents = []">
            <q-icon name="close" size="14px" />
            Clear
          </button>
        </div>
      </transition>

      <!-- Data Table -->
      <div class="uk-table-container uk-scrollbar">
        <table class="uk-table">
          <thead>
            <tr>
              <th class="uk-table__th uk-table__th--checkbox">
                <input
                  type="checkbox"
                  class="uk-checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isPartiallySelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="uk-table__th uk-table__th--status"></th>
              <th
                v-for="col in visibleColumns"
                :key="col.id"
                :class="['uk-table__th', { 'uk-table__th--sorted': sortBy === col.id }]"
                @click="toggleSort(col.id)"
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
              <th class="uk-table__th uk-table__th--actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="agent in paginatedAgents"
              :key="agent.id"
              :class="['uk-table__row', { 'uk-table__row--selected': selectedAgents.includes(agent.id) }]"
              @click="selectAgent(agent)"
              @contextmenu.prevent="openContextMenu($event, agent)"
            >
              <td class="uk-table__td uk-table__td--checkbox" @click.stop>
                <input
                  type="checkbox"
                  class="uk-checkbox"
                  :checked="selectedAgents.includes(agent.id)"
                  @change="toggleAgent(agent.id)"
                />
              </td>
              <td class="uk-table__td uk-table__td--status">
                <span :class="['uk-status-dot', `uk-status-dot--${agent.status}`]"></span>
              </td>
              <td v-if="isColumnVisible('hostname')" class="uk-table__td uk-table__td--hostname">
                <div class="uk-agent-name">
                  <q-icon :name="getPlatformIcon(agent.platform)" size="16px" class="uk-agent-name__platform" />
                  <div>
                    <div class="uk-agent-name__host">{{ agent.hostname }}</div>
                    <div class="uk-agent-name__desc">{{ agent.description }}</div>
                  </div>
                </div>
              </td>
              <td v-if="isColumnVisible('client')" class="uk-table__td">
                <span class="uk-text-primary-val">{{ agent.clientName }}</span>
              </td>
              <td v-if="isColumnVisible('site')" class="uk-table__td">
                <span class="uk-text-secondary-val">{{ agent.siteName }}</span>
              </td>
              <td v-if="isColumnVisible('os')" class="uk-table__td">
                <span class="uk-text-secondary-val">{{ agent.os }}</span>
              </td>
              <td v-if="isColumnVisible('checks')" class="uk-table__td">
                <div class="uk-checks-cell">
                  <span v-if="agent.checksFailing > 0" class="uk-badge uk-badge--error">
                    {{ agent.checksFailing }} failing
                  </span>
                  <span v-if="agent.checksWarning > 0" class="uk-badge uk-badge--warning">
                    {{ agent.checksWarning }} warn
                  </span>
                  <span v-if="agent.checksFailing === 0 && agent.checksWarning === 0" class="uk-badge uk-badge--success">
                    {{ agent.checksPassing }} ok
                  </span>
                </div>
              </td>
              <td v-if="isColumnVisible('patches')" class="uk-table__td">
                <span v-if="agent.patchesPending > 0" class="uk-badge uk-badge--warning">
                  {{ agent.patchesPending }}
                </span>
                <span v-else class="uk-text-tertiary-val">-</span>
              </td>
              <td v-if="isColumnVisible('user')" class="uk-table__td">
                <span class="uk-text-secondary-val">{{ agent.loggedUser }}</span>
              </td>
              <td v-if="isColumnVisible('lastSeen')" class="uk-table__td">
                <span class="uk-text-secondary-val">{{ agent.lastSeen }}</span>
              </td>
              <td v-if="isColumnVisible('policy')" class="uk-table__td">
                <span :class="['uk-badge', `uk-badge--${getPolicyBadgeType(agent.policyStatus)}`]">
                  {{ agent.policyStatus }}
                </span>
              </td>
              <td class="uk-table__td uk-table__td--actions" @click.stop>
                <button class="uk-row-action-btn" @click.stop="openContextMenu($event, agent)">
                  <q-icon name="more_horiz" size="18px" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="uk-pagination">
        <div class="uk-pagination__info">
          Showing {{ paginationStart }}–{{ paginationEnd }} of {{ filteredAgents.length }} agents
        </div>
        <div class="uk-pagination__controls">
          <select v-model="pageSize" class="uk-pagination__select">
            <option :value="10">10 / page</option>
            <option :value="20">20 / page</option>
            <option :value="50">50 / page</option>
          </select>
          <button class="uk-pagination__btn" :disabled="currentPage === 1" @click="currentPage--">
            <q-icon name="chevron_left" size="18px" />
          </button>
          <span class="uk-pagination__page">{{ currentPage }} / {{ totalPages }}</span>
          <button class="uk-pagination__btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <q-icon name="chevron_right" size="18px" />
          </button>
        </div>
      </div>

      <!-- Context Menu -->
      <teleport to="body">
        <transition name="uk-fade">
          <div
            v-if="contextMenu.show"
            class="uk-context-menu uk-theme-dark"
            :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
            @click.stop
          >
            <div class="uk-context-menu__header">
              {{ contextMenu.agent?.hostname }}
            </div>
            <div class="uk-context-menu__group">
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="terminal" size="16px" />
                <span>Remote Terminal</span>
                <kbd class="uk-context-menu__shortcut">Ctrl+T</kbd>
              </button>
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="desktop_windows" size="16px" />
                <span>Remote Desktop</span>
                <kbd class="uk-context-menu__shortcut">Ctrl+R</kbd>
              </button>
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="send" size="16px" />
                <span>Run Script</span>
              </button>
            </div>
            <div class="uk-context-menu__divider"></div>
            <div class="uk-context-menu__group">
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="system_update" size="16px" />
                <span>Install Patches</span>
              </button>
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="rule" size="16px" />
                <span>Assign Policy</span>
              </button>
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="edit" size="16px" />
                <span>Edit Agent</span>
              </button>
            </div>
            <div class="uk-context-menu__divider"></div>
            <div class="uk-context-menu__group">
              <button class="uk-context-menu__item" @click="closeContextMenu">
                <q-icon name="restart_alt" size="16px" />
                <span>Reboot</span>
              </button>
              <button class="uk-context-menu__item uk-context-menu__item--danger" @click="closeContextMenu">
                <q-icon name="delete" size="16px" />
                <span>Uninstall Agent</span>
              </button>
            </div>
          </div>
        </transition>
        <div v-if="contextMenu.show" class="uk-context-menu__overlay" @click="closeContextMenu"></div>
      </teleport>

      <!-- Bulk Actions Wizard -->
      <teleport to="body">
        <transition name="uk-fade">
          <div v-if="showBulkWizard" class="uk-modal-overlay uk-theme-dark" @click.self="showBulkWizard = false">
            <div class="uk-modal uk-wizard">
              <div class="uk-wizard__header">
                <h2 class="uk-wizard__title">Bulk Actions</h2>
                <button class="uk-modal__close" @click="showBulkWizard = false">
                  <q-icon name="close" size="20px" />
                </button>
              </div>

              <!-- Steps indicator -->
              <div class="uk-wizard__steps">
                <div
                  v-for="(step, i) in wizardSteps"
                  :key="i"
                  :class="['uk-wizard__step', {
                    'uk-wizard__step--active': wizardStep === i,
                    'uk-wizard__step--completed': wizardStep > i
                  }]"
                >
                  <div class="uk-wizard__step-num">
                    <q-icon v-if="wizardStep > i" name="check" size="14px" />
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span class="uk-wizard__step-label">{{ step }}</span>
                  <div v-if="i < wizardSteps.length - 1" class="uk-wizard__step-line"></div>
                </div>
              </div>

              <!-- Step Content -->
              <div class="uk-wizard__content">
                <!-- Step 0: Target -->
                <div v-if="wizardStep === 0" class="uk-wizard__panel">
                  <h3 class="uk-wizard__panel-title">Select Targets</h3>
                  <p class="uk-wizard__panel-desc">Choose which agents this action will apply to.</p>
                  <div class="uk-wizard__options">
                    <label
                      v-for="opt in bulkTargetOptions"
                      :key="opt.id"
                      :class="['uk-wizard__option', { 'uk-wizard__option--selected': bulkTarget === opt.id }]"
                    >
                      <input type="radio" v-model="bulkTarget" :value="opt.id" class="uk-radio-hidden" />
                      <q-icon :name="opt.icon" size="20px" />
                      <div>
                        <div class="uk-wizard__option-title">{{ opt.label }}</div>
                        <div class="uk-wizard__option-desc">{{ opt.desc }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Step 1: Filter -->
                <div v-if="wizardStep === 1" class="uk-wizard__panel">
                  <h3 class="uk-wizard__panel-title">Apply Filters</h3>
                  <p class="uk-wizard__panel-desc">Narrow down the target set with filters.</p>
                  <div class="uk-form-group">
                    <label class="uk-form-label">Client</label>
                    <select class="uk-select">
                      <option>All Clients</option>
                      <option>Acme Corp</option>
                      <option>TechStart Inc</option>
                      <option>GlobalFinance</option>
                    </select>
                  </div>
                  <div class="uk-form-group">
                    <label class="uk-form-label">Platform</label>
                    <div class="uk-checkbox-group">
                      <label class="uk-checkbox-label"><input type="checkbox" checked class="uk-checkbox" /> Windows</label>
                      <label class="uk-checkbox-label"><input type="checkbox" checked class="uk-checkbox" /> Linux</label>
                      <label class="uk-checkbox-label"><input type="checkbox" checked class="uk-checkbox" /> macOS</label>
                    </div>
                  </div>
                  <div class="uk-form-group">
                    <label class="uk-form-label">Status</label>
                    <div class="uk-checkbox-group">
                      <label class="uk-checkbox-label"><input type="checkbox" checked class="uk-checkbox" /> Online</label>
                      <label class="uk-checkbox-label"><input type="checkbox" class="uk-checkbox" /> Offline</label>
                    </div>
                  </div>
                  <div class="uk-wizard__affected">
                    <q-icon name="info" size="16px" />
                    <span><strong>421</strong> agents will be affected</span>
                  </div>
                </div>

                <!-- Step 2: Action -->
                <div v-if="wizardStep === 2" class="uk-wizard__panel">
                  <h3 class="uk-wizard__panel-title">Choose Action</h3>
                  <p class="uk-wizard__panel-desc">Select the action to perform on targeted agents.</p>
                  <div class="uk-wizard__options uk-wizard__options--compact">
                    <label
                      v-for="act in bulkActions"
                      :key="act.id"
                      :class="['uk-wizard__option', { 'uk-wizard__option--selected': bulkAction === act.id, 'uk-wizard__option--danger': act.danger }]"
                    >
                      <input type="radio" v-model="bulkAction" :value="act.id" class="uk-radio-hidden" />
                      <q-icon :name="act.icon" size="18px" />
                      <div>
                        <div class="uk-wizard__option-title">{{ act.label }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Step 3: Confirm -->
                <div v-if="wizardStep === 3" class="uk-wizard__panel">
                  <h3 class="uk-wizard__panel-title">Confirm Action</h3>
                  <div class="uk-wizard__summary">
                    <div class="uk-wizard__summary-row">
                      <span class="uk-wizard__summary-label">Target</span>
                      <span class="uk-wizard__summary-value">{{ bulkTarget === 'all' ? 'All Agents' : bulkTarget === 'selected' ? 'Selected Agents' : 'Filtered Agents' }}</span>
                    </div>
                    <div class="uk-wizard__summary-row">
                      <span class="uk-wizard__summary-label">Affected Agents</span>
                      <span class="uk-wizard__summary-value uk-wizard__summary-value--highlight">421</span>
                    </div>
                    <div class="uk-wizard__summary-row">
                      <span class="uk-wizard__summary-label">Action</span>
                      <span class="uk-wizard__summary-value">{{ bulkActions.find(a => a.id === bulkAction)?.label || '-' }}</span>
                    </div>
                  </div>

                  <div v-if="isDangerousAction" class="uk-wizard__danger-confirm">
                    <div class="uk-wizard__danger-warning">
                      <q-icon name="warning" size="20px" />
                      <span>This is a destructive action. Type <strong>yes</strong> to confirm.</span>
                    </div>
                    <input
                      v-model="confirmInput"
                      class="uk-input uk-input--danger"
                      placeholder="Type 'yes' to confirm"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="uk-wizard__footer">
                <button
                  v-if="wizardStep > 0"
                  class="uk-btn uk-btn--secondary"
                  @click="wizardStep--"
                >
                  Back
                </button>
                <div style="flex: 1"></div>
                <button
                  v-if="wizardStep < 3"
                  class="uk-btn uk-btn--primary"
                  @click="wizardStep++"
                >
                  Continue
                </button>
                <button
                  v-else
                  :class="['uk-btn', isDangerousAction ? 'uk-btn--danger' : 'uk-btn--primary']"
                  :disabled="isDangerousAction && confirmInput !== 'yes'"
                  @click="executeBulkAction"
                >
                  {{ isDangerousAction ? 'Confirm & Execute' : 'Execute' }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Toast Notifications -->
      <teleport to="body">
        <transition-group name="uk-toast" tag="div" class="uk-toast-container uk-theme-dark">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="['uk-toast', `uk-toast--${toast.type}`]"
          >
            <q-icon :name="getToastIcon(toast.type)" size="18px" />
            <span class="uk-toast__message">{{ toast.message }}</span>
            <button class="uk-toast__close" @click="removeToast(toast.id)">
              <q-icon name="close" size="14px" />
            </button>
          </div>
        </transition-group>
      </teleport>
    </div>
  </UIKitLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import UIKitLayout from "../components/UIKitLayout.vue";
import {
  mockAgents,
  dashStats,
  type Agent,
} from "../mockData";
import "../tokens.css";

// ============================================================
// TABS
// ============================================================
const tabs = [
  { id: "all", label: "All", icon: "view_module", count: 468 },
  { id: "servers", label: "Servers", icon: "dns", count: 186 },
  { id: "workstations", label: "Workstations", icon: "laptop", count: 282 },
  { id: "online", label: "Online", icon: "check_circle", count: 421, badgeType: "success" },
  { id: "issues", label: "Issues", icon: "error_outline", count: 14, badgeType: "error" },
];
const activeTab = ref("all");

// ============================================================
// TABLE COLUMNS
// ============================================================
const allColumns = reactive([
  { id: "hostname", label: "Hostname", visible: true },
  { id: "path", label: "Path", visible: true },
  { id: "site", label: "Category", visible: true },
  { id: "os", label: "OS", visible: true },
  { id: "checks", label: "Checks", visible: true },
  { id: "patches", label: "Patches", visible: true },
  { id: "user", label: "Logged User", visible: true },
  { id: "lastSeen", label: "Last Seen", visible: true },
  { id: "policy", label: "Policy Status", visible: true },
]);

const visibleColumns = computed(() => allColumns.filter((c) => c.visible));
const showColumnPicker = ref(false);

function isColumnVisible(id: string): boolean {
  return allColumns.find((c) => c.id === id)?.visible ?? false;
}

// ============================================================
// SORTING
// ============================================================
const sortBy = ref("hostname");
const sortAsc = ref(true);

function toggleSort(colId: string) {
  if (sortBy.value === colId) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortBy.value = colId;
    sortAsc.value = true;
  }
}

// ============================================================
// FILTERING
// ============================================================
const tableSearch = ref("");
const statusFilter = ref("all");
const statusFilterLabel = computed(() => {
  const labels: Record<string, string> = { all: "Status: All", online: "Online", offline: "Offline", warning: "Warning", error: "Errors" };
  return labels[statusFilter.value] || "Status: All";
});

function cycleStatusFilter() {
  const filters = ["all", "online", "offline", "warning", "error"];
  const idx = filters.indexOf(statusFilter.value);
  statusFilter.value = filters[(idx + 1) % filters.length];
}

const filteredAgents = computed(() => {
  let agents = [...mockAgents];

  // Tab filter
  if (activeTab.value === "servers") agents = agents.filter((a) => a.monitoringType === "server");
  else if (activeTab.value === "workstations") agents = agents.filter((a) => a.monitoringType === "workstation");
  else if (activeTab.value === "online") agents = agents.filter((a) => a.status === "online");
  else if (activeTab.value === "issues") agents = agents.filter((a) => a.checksFailing > 0 || a.status === "error" || a.status === "overdue");

  // Status filter
  if (statusFilter.value !== "all") {
    agents = agents.filter((a) => a.status === statusFilter.value);
  }

  // Search
  if (tableSearch.value) {
    const q = tableSearch.value.toLowerCase();
    agents = agents.filter(
      (a) =>
        a.hostname.toLowerCase().includes(q) ||
        a.clientName.toLowerCase().includes(q) ||
        a.siteName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }

  // Sort
  agents.sort((a, b) => {
    const key = sortBy.value as keyof Agent;
    const aVal = String(a[key] ?? "");
    const bVal = String(b[key] ?? "");
    return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return agents;
});

// ============================================================
// PAGINATION
// ============================================================
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAgents.value.length / pageSize.value)));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, filteredAgents.value.length));
const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredAgents.value.slice(start, start + pageSize.value);
});

// ============================================================
// SELECTION
// ============================================================
const selectedAgents = ref<string[]>([]);
const isAllSelected = computed(() => selectedAgents.value.length === paginatedAgents.value.length && paginatedAgents.value.length > 0);
const isPartiallySelected = computed(() => selectedAgents.value.length > 0 && !isAllSelected.value);

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedAgents.value = [];
  } else {
    selectedAgents.value = paginatedAgents.value.map((a) => a.id);
  }
}

function toggleAgent(id: string) {
  const idx = selectedAgents.value.indexOf(id);
  if (idx >= 0) selectedAgents.value.splice(idx, 1);
  else selectedAgents.value.push(id);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectAgent(_agent: Agent) {
  // Navigate to detail view
}

// ============================================================
// CONTEXT MENU
// ============================================================
const contextMenu = reactive({
  show: false,
  x: 0,
  y: 0,
  agent: null as Agent | null,
});

function openContextMenu(event: MouseEvent, agent: Agent) {
  contextMenu.show = true;
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.agent = agent;
}

function closeContextMenu() {
  contextMenu.show = false;
}

// Close context menu on click outside
function handleGlobalClick() {
  if (contextMenu.show) closeContextMenu();
}

onMounted(() => {
  document.addEventListener("click", handleGlobalClick);
});
onUnmounted(() => {
  document.removeEventListener("click", handleGlobalClick);
});

// ============================================================
// HELPERS
// ============================================================
function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = { windows: "mdi-microsoft-windows", linux: "mdi-linux", macos: "mdi-apple" };
  return icons[platform] || "devices";
}

function getPolicyBadgeType(status: string): string {
  const map: Record<string, string> = { compliant: "success", "non-compliant": "error", pending: "warning", unknown: "neutral" };
  return map[status] || "neutral";
}

// ============================================================
// BULK WIZARD
// ============================================================
const showBulkWizard = ref(false);
const wizardStep = ref(0);
const bulkTarget = ref("all");
const bulkAction = ref("script");
const confirmInput = ref("");
const wizardSteps = ["Target", "Filter", "Action", "Confirm"];

const bulkTargetOptions = [
  { id: "all", label: "All Agents", desc: "Apply to every managed agent", icon: "select_all" },
  { id: "selected", label: "Selected Agents", desc: "Only the currently selected agents", icon: "check_circle" },
  { id: "filtered", label: "Custom Filter", desc: "Define a filter to narrow targets", icon: "filter_list" },
];

const bulkActions = [
  { id: "script", label: "Run Script", icon: "code", danger: false },
  { id: "patch", label: "Install Patches", icon: "system_update", danger: false },
  { id: "reboot", label: "Reboot", icon: "restart_alt", danger: true },
  { id: "policy", label: "Assign Policy", icon: "rule", danger: false },
  { id: "uninstall", label: "Uninstall Agent", icon: "delete", danger: true },
];

const isDangerousAction = computed(() => {
  return bulkActions.find((a) => a.id === bulkAction.value)?.danger ?? false;
});

function executeBulkAction() {
  showBulkWizard.value = false;
  wizardStep.value = 0;
  confirmInput.value = "";
  addToast("success", "Bulk action queued successfully for 421 agents.");
}

// ============================================================
// TOASTS
// ============================================================
interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

function addToast(type: Toast["type"], message: string) {
  const id = ++toastId;
  toasts.value.push({ id, type, message });
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function getToastIcon(type: string): string {
  const icons: Record<string, string> = { success: "check_circle", error: "error", warning: "warning", info: "info" };
  return icons[type] || "info";
}

// Show welcome toast
onMounted(() => {
  setTimeout(() => addToast("info", "UI Kit loaded. Explore the components below."), 500);
});
</script>

<style scoped>
/* ============================================================
   PAGE HEADER
   ============================================================ */
.uk-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--uk-space-6);
}

.uk-page-header__left {
  display: flex;
  align-items: baseline;
  gap: var(--uk-space-3);
}

.uk-page-title {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.uk-page-subtitle {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-page-header__actions {
  display: flex;
  gap: var(--uk-space-2);
}

/* ============================================================
   BUTTONS
   ============================================================ */
.uk-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-2) var(--uk-space-4);
  border-radius: var(--uk-radius-md);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  border: none;
  transition: all var(--uk-transition-fast);
  white-space: nowrap;
}

.uk-btn--primary {
  background: var(--uk-primary);
  color: #FFFFFF;
}

.uk-btn--primary:hover {
  background: var(--uk-primary-hover);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.uk-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.uk-btn--secondary {
  background: var(--uk-bg-elevated);
  color: var(--uk-text-primary);
  border: 1px solid var(--uk-border-default);
}

.uk-btn--secondary:hover {
  background: var(--uk-bg-overlay);
  border-color: var(--uk-border-strong);
}

.uk-btn--ghost {
  background: transparent;
  color: var(--uk-text-secondary);
}

.uk-btn--ghost:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

.uk-btn--danger {
  background: var(--uk-error);
  color: #FFFFFF;
}

.uk-btn--danger:hover {
  background: #DC2626;
}

.uk-btn--danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.uk-btn--danger-ghost {
  background: transparent;
  color: var(--uk-error-text);
}

.uk-btn--danger-ghost:hover {
  background: var(--uk-error-soft);
}

.uk-btn--sm {
  padding: var(--uk-space-1) var(--uk-space-3);
  font-size: var(--uk-text-xs);
}

/* ============================================================
   STAT CARDS
   ============================================================ */
.uk-stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--uk-space-3);
  margin-bottom: var(--uk-space-6);
}

.uk-stat-card {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  transition: all var(--uk-transition-base);
}

.uk-stat-card:hover {
  border-color: var(--uk-border-strong);
  box-shadow: var(--uk-shadow-sm);
}

.uk-stat-card__header {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  margin-bottom: var(--uk-space-2);
}

.uk-stat-card__icon {
  color: var(--uk-text-tertiary);
}

.uk-stat-card--primary .uk-stat-card__icon { color: var(--uk-primary); }
.uk-stat-card--success .uk-stat-card__icon { color: var(--uk-success); }
.uk-stat-card--warning .uk-stat-card__icon { color: var(--uk-warning); }
.uk-stat-card--error .uk-stat-card__icon { color: var(--uk-error); }
.uk-stat-card--info .uk-stat-card__icon { color: var(--uk-info); }

.uk-stat-card__label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-secondary);
}

.uk-stat-card__value {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
  letter-spacing: -0.02em;
}

.uk-stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--uk-text-xs);
  margin-top: var(--uk-space-1);
}

.uk-stat-card__trend--up { color: var(--uk-success-text); }
.uk-stat-card__trend--down { color: var(--uk-warning-text); }

/* ============================================================
   TABLE TOOLBAR
   ============================================================ */
.uk-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--uk-space-4);
  margin-bottom: var(--uk-space-3);
  flex-wrap: wrap;
}

.uk-table-toolbar__left,
.uk-table-toolbar__right {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

/* TABS */
.uk-tabs {
  display: flex;
  gap: 2px;
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  padding: 2px;
}

.uk-tab {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-1) var(--uk-space-3);
  border-radius: var(--uk-radius-sm);
  border: none;
  background: transparent;
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  white-space: nowrap;
}

.uk-tab:hover {
  color: var(--uk-text-primary);
  background: var(--uk-bg-hover);
}

.uk-tab--active {
  background: var(--uk-bg-active);
  color: var(--uk-primary);
}

.uk-tab__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-bg-overlay);
  color: var(--uk-text-secondary);
}

.uk-tab__badge--success { background: var(--uk-success-soft); color: var(--uk-success-text); }
.uk-tab__badge--error { background: var(--uk-error-soft); color: var(--uk-error-text); }

/* FILTERS */
.uk-filter-group {
  display: flex;
  gap: 2px;
}

.uk-filter-btn {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-1) var(--uk-space-3);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-filter-btn:hover {
  border-color: var(--uk-border-strong);
  color: var(--uk-text-primary);
}

.uk-filter-btn--active {
  border-color: var(--uk-primary);
  background: var(--uk-primary-soft);
  color: var(--uk-primary-text);
}

/* TABLE SEARCH */
.uk-table-search {
  position: relative;
}

.uk-table-search__icon {
  position: absolute;
  left: var(--uk-space-2);
  top: 50%;
  transform: translateY(-50%);
  color: var(--uk-text-tertiary);
  pointer-events: none;
}

.uk-table-search__input {
  width: 200px;
  height: 30px;
  padding: 0 var(--uk-space-2) 0 30px;
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  transition: all var(--uk-transition-base);
}

.uk-table-search__input::placeholder {
  color: var(--uk-text-tertiary);
}

.uk-table-search__input:focus {
  border-color: var(--uk-border-focus);
  width: 280px;
}

/* ============================================================
   COLUMN PICKER
   ============================================================ */
.uk-column-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--uk-space-2);
  padding: var(--uk-space-3);
  margin-bottom: var(--uk-space-3);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
}

.uk-column-picker__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-1) var(--uk-space-2);
  border-radius: var(--uk-radius-sm);
  cursor: pointer;
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  transition: background var(--uk-transition-fast);
}

.uk-column-picker__item:hover {
  background: var(--uk-bg-hover);
}

/* ============================================================
   SELECTION BAR
   ============================================================ */
.uk-selection-bar {
  display: flex;
  align-items: center;
  gap: var(--uk-space-4);
  padding: var(--uk-space-2) var(--uk-space-4);
  margin-bottom: var(--uk-space-3);
  background: var(--uk-primary-soft);
  border: 1px solid var(--uk-primary);
  border-radius: var(--uk-radius-md);
}

.uk-selection-bar__info {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  font-size: var(--uk-text-sm);
  color: var(--uk-primary-text);
}

.uk-selection-bar__actions {
  display: flex;
  gap: var(--uk-space-1);
  flex: 1;
}

/* ============================================================
   DATA TABLE
   ============================================================ */
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
.uk-table__th--status,
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

.uk-table__td--checkbox,
.uk-table__td--status {
  width: 36px;
}

.uk-table__td--actions {
  width: 36px;
  text-align: center;
}

/* Agent Name Cell */
.uk-agent-name {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

.uk-agent-name__platform {
  color: var(--uk-text-tertiary);
  flex-shrink: 0;
}

.uk-agent-name__host {
  font-weight: 600;
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
}

.uk-agent-name__desc {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
}

/* Cell values */
.uk-text-primary-val { color: var(--uk-text-primary); }
.uk-text-secondary-val { color: var(--uk-text-secondary); }
.uk-text-tertiary-val { color: var(--uk-text-tertiary); }

.uk-checks-cell {
  display: flex;
  gap: 4px;
}

/* Row action button */
.uk-row-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-tertiary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-row-action-btn:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

/* ============================================================
   CHECKBOX
   ============================================================ */
.uk-checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--uk-border-strong);
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all var(--uk-transition-fast);
  flex-shrink: 0;
}

.uk-checkbox:hover {
  border-color: var(--uk-primary);
}

.uk-checkbox:checked {
  background: var(--uk-primary);
  border-color: var(--uk-primary);
}

.uk-checkbox:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.uk-checkbox:indeterminate {
  background: var(--uk-primary);
  border-color: var(--uk-primary);
}

.uk-checkbox:indeterminate::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 6px;
  width: 8px;
  height: 2px;
  background: #fff;
}

/* ============================================================
   PAGINATION
   ============================================================ */
.uk-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--uk-space-3) 0;
  margin-top: var(--uk-space-3);
}

.uk-pagination__info {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-pagination__controls {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

.uk-pagination__select {
  padding: var(--uk-space-1) var(--uk-space-2);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  cursor: pointer;
}

.uk-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-sm);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-pagination__btn:hover:not(:disabled) {
  border-color: var(--uk-border-strong);
  color: var(--uk-text-primary);
}

.uk-pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.uk-pagination__page {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  min-width: 50px;
  text-align: center;
}

/* ============================================================
   CONTEXT MENU
   ============================================================ */
.uk-context-menu {
  position: fixed;
  z-index: var(--uk-z-dropdown);
  min-width: 200px;
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  box-shadow: var(--uk-shadow-lg);
  padding: var(--uk-space-1);
  animation: uk-context-appear 0.12s ease-out;
}

@keyframes uk-context-appear {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.uk-context-menu__overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--uk-z-dropdown) - 1);
}

.uk-context-menu__header {
  padding: var(--uk-space-2) var(--uk-space-3);
  font-size: var(--uk-text-xs);
  font-weight: 600;
  color: var(--uk-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.uk-context-menu__group {
  padding: 2px 0;
}

.uk-context-menu__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  width: 100%;
  padding: var(--uk-space-2) var(--uk-space-3);
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  cursor: pointer;
  text-align: left;
  transition: background var(--uk-transition-fast);
}

.uk-context-menu__item:hover {
  background: var(--uk-bg-hover);
}

.uk-context-menu__item--danger {
  color: var(--uk-error-text);
}

.uk-context-menu__item--danger:hover {
  background: var(--uk-error-soft);
}

.uk-context-menu__shortcut {
  margin-left: auto;
  font-size: 10px;
  color: var(--uk-text-tertiary);
  border: 1px solid var(--uk-border-default);
  border-radius: 3px;
  padding: 0 4px;
  font-family: var(--uk-font-family);
}

.uk-context-menu__divider {
  height: 1px;
  background: var(--uk-border-default);
  margin: var(--uk-space-1) var(--uk-space-2);
}

/* ============================================================
   MODAL & WIZARD
   ============================================================ */
.uk-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--uk-z-modal);
}

.uk-modal {
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-xl);
  box-shadow: var(--uk-shadow-lg);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: uk-modal-appear 0.2s ease-out;
}

@keyframes uk-modal-appear {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.uk-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-tertiary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-modal__close:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

/* Wizard specific */
.uk-wizard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--uk-space-5) var(--uk-space-6);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-wizard__title {
  font-size: var(--uk-text-lg);
  font-weight: 600;
  color: var(--uk-text-primary);
  margin: 0;
}

.uk-wizard__steps {
  display: flex;
  align-items: center;
  padding: var(--uk-space-4) var(--uk-space-6);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-wizard__step {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  flex: 1;
}

.uk-wizard__step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--uk-text-xs);
  font-weight: 600;
  background: var(--uk-bg-overlay);
  color: var(--uk-text-tertiary);
  flex-shrink: 0;
  transition: all var(--uk-transition-base);
}

.uk-wizard__step--active .uk-wizard__step-num {
  background: var(--uk-primary);
  color: #fff;
}

.uk-wizard__step--completed .uk-wizard__step-num {
  background: var(--uk-success);
  color: #fff;
}

.uk-wizard__step-label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  color: var(--uk-text-tertiary);
  white-space: nowrap;
}

.uk-wizard__step--active .uk-wizard__step-label {
  color: var(--uk-text-primary);
}

.uk-wizard__step--completed .uk-wizard__step-label {
  color: var(--uk-success-text);
}

.uk-wizard__step-line {
  flex: 1;
  height: 1px;
  background: var(--uk-border-default);
  margin: 0 var(--uk-space-2);
}

.uk-wizard__step--completed + .uk-wizard__step .uk-wizard__step-line,
.uk-wizard__step--completed .uk-wizard__step-line {
  background: var(--uk-success);
}

.uk-wizard__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--uk-space-6);
}

.uk-wizard__panel-title {
  font-size: var(--uk-text-lg);
  font-weight: 600;
  color: var(--uk-text-primary);
  margin: 0 0 var(--uk-space-1);
}

.uk-wizard__panel-desc {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  margin: 0 0 var(--uk-space-5);
}

/* Wizard Options */
.uk-wizard__options {
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-2);
}

.uk-wizard__options--compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.uk-wizard__option {
  display: flex;
  align-items: center;
  gap: var(--uk-space-3);
  padding: var(--uk-space-3) var(--uk-space-4);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  color: var(--uk-text-secondary);
}

.uk-wizard__option:hover {
  border-color: var(--uk-border-strong);
}

.uk-wizard__option--selected {
  border-color: var(--uk-primary);
  background: var(--uk-primary-soft);
  color: var(--uk-text-primary);
}

.uk-wizard__option--danger.uk-wizard__option--selected {
  border-color: var(--uk-error);
  background: var(--uk-error-soft);
}

.uk-wizard__option-title {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

.uk-wizard__option-desc {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: 2px;
}

.uk-radio-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Wizard Affected */
.uk-wizard__affected {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-3);
  background: var(--uk-info-soft);
  border-radius: var(--uk-radius-md);
  color: var(--uk-info-text);
  font-size: var(--uk-text-sm);
  margin-top: var(--uk-space-4);
}

/* Wizard Summary */
.uk-wizard__summary {
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-3);
  padding: var(--uk-space-4);
  background: var(--uk-bg-elevated);
  border-radius: var(--uk-radius-md);
  margin-bottom: var(--uk-space-4);
}

.uk-wizard__summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uk-wizard__summary-label {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-wizard__summary-value {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

.uk-wizard__summary-value--highlight {
  font-weight: 700;
  color: var(--uk-primary-text);
}

/* Danger Confirm */
.uk-wizard__danger-confirm {
  margin-top: var(--uk-space-4);
}

.uk-wizard__danger-warning {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-3);
  background: var(--uk-error-soft);
  border-radius: var(--uk-radius-md);
  color: var(--uk-error-text);
  font-size: var(--uk-text-sm);
  margin-bottom: var(--uk-space-3);
}

.uk-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--uk-space-3);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-elevated);
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  transition: all var(--uk-transition-base);
}

.uk-input:focus {
  border-color: var(--uk-border-focus);
  box-shadow: 0 0 0 3px var(--uk-primary-soft);
}

.uk-input--danger:focus {
  border-color: var(--uk-error);
  box-shadow: 0 0 0 3px var(--uk-error-soft);
}

/* Wizard Footer */
.uk-wizard__footer {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-4) var(--uk-space-6);
  border-top: 1px solid var(--uk-border-default);
}

/* ============================================================
   FORM ELEMENTS
   ============================================================ */
.uk-form-group {
  margin-bottom: var(--uk-space-4);
}

.uk-form-label {
  display: block;
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
  margin-bottom: var(--uk-space-2);
}

.uk-select {
  width: 100%;
  height: 36px;
  padding: 0 var(--uk-space-3);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-elevated);
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  cursor: pointer;
}

.uk-select:focus {
  border-color: var(--uk-border-focus);
}

.uk-checkbox-group {
  display: flex;
  gap: var(--uk-space-4);
}

.uk-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  cursor: pointer;
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
.uk-toast-container {
  position: fixed;
  top: var(--uk-space-4);
  right: var(--uk-space-4);
  z-index: var(--uk-z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-2);
  pointer-events: none;
}

.uk-toast {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-3) var(--uk-space-4);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  box-shadow: var(--uk-shadow-lg);
  font-size: var(--uk-text-sm);
  min-width: 280px;
  max-width: 420px;
  pointer-events: auto;
}

.uk-toast--success { border-left: 3px solid var(--uk-success); color: var(--uk-success-text); }
.uk-toast--error { border-left: 3px solid var(--uk-error); color: var(--uk-error-text); }
.uk-toast--warning { border-left: 3px solid var(--uk-warning); color: var(--uk-warning-text); }
.uk-toast--info { border-left: 3px solid var(--uk-info); color: var(--uk-info-text); }

.uk-toast__message {
  flex: 1;
  color: var(--uk-text-primary);
}

.uk-toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-tertiary);
  cursor: pointer;
}

.uk-toast__close:hover {
  background: var(--uk-bg-hover);
}

/* Toast Animation */
.uk-toast-enter-active { animation: uk-toast-in 0.3s ease-out; }
.uk-toast-leave-active { animation: uk-toast-out 0.2s ease-in; }

@keyframes uk-toast-in {
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes uk-toast-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100px); }
}

/* ============================================================
   TRANSITIONS
   ============================================================ */
.uk-slide-down-enter-active,
.uk-slide-down-leave-active {
  transition: all 0.2s ease;
}

.uk-slide-down-enter-from,
.uk-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.uk-fade-enter-active,
.uk-fade-leave-active {
  transition: opacity 0.15s ease;
}

.uk-fade-enter-from,
.uk-fade-leave-to {
  opacity: 0;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1400px) {
  .uk-stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .uk-stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
