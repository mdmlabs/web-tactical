<template>
  <q-card class="q-dialog-plugin au-dialog">
    <!-- Header -->
    <div class="au-header">
      <h1 class="au-header__title">Agent Updates</h1>
      <button class="au-header__close" v-close-popup>
        <q-icon name="close" size="20px" />
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="au-loading">
      <q-spinner-dots size="40px" color="primary" />
      <div class="au-loading__text">Loading version data...</div>
    </div>

    <template v-if="versionInfo && !loading">
      <div class="au-layout">
        <!-- Sidebar -->
        <div class="au-sidebar">
          <!-- Distribution -->
          <div class="au-sidebar-block">
            <h2 class="au-sidebar-block__title">Distribution</h2>
            <div class="au-distrib">
              <div
                v-for="stat in versionStats"
                :key="stat.version"
                class="au-distrib__item"
                :class="{
                  'au-distrib__item--active': activeVersionFilter === stat.version,
                  'au-distrib__item--dimmed': activeVersionFilter && activeVersionFilter !== stat.version,
                }"
                @click="toggleVersionFilter(stat.version)"
              >
                <span class="au-distrib__dot" :style="{ backgroundColor: stat.color }"></span>
                <span class="au-distrib__version">{{ stat.version }}</span>
                <span class="au-distrib__count">{{ stat.count }} agent{{ stat.count !== 1 ? 's' : '' }}</span>
                <span v-if="stat.version === versionInfo.latest_version" class="au-distrib__badge">Latest</span>
              </div>
              <div v-if="versionStats.length === 0" class="au-distrib__empty">No agents found</div>
            </div>
            <div class="au-distrib__total">Total: {{ agents.length }} agents</div>
          </div>

          <!-- Target Version -->
          <div class="au-sidebar-block">
            <h2 class="au-sidebar-block__title">Target Version</h2>
            <div class="au-target">
              <label
                v-for="opt in versionOptions"
                :key="opt.value"
                class="au-target__option"
                :class="{ 'au-target__option--selected': selectedVersion && selectedVersion.value === opt.value }"
                @click="selectVersionOption(opt)"
              >
                <input
                  type="radio"
                  :checked="selectedVersion && selectedVersion.value === opt.value"
                  class="au-target__radio"
                  @click.stop
                />
                <span class="au-target__label">{{ opt.label }}</span>
                <span v-if="opt.isLatest" class="au-target__badge">Recommended</span>
              </label>
            </div>

            <!-- Summary -->
            <div v-if="selectedVersion && totalUpgradeableAgents > 0" class="au-target__summary au-target__summary--upgrade">
              <q-icon name="arrow_upward" size="14px" />
              {{ totalUpgradeableAgents }} agent{{ totalUpgradeableAgents !== 1 ? 's' : '' }} can be upgraded
            </div>
            <div v-if="selectedVersion && totalDowngradeableAgents > 0" class="au-target__summary au-target__summary--downgrade">
              <q-icon name="arrow_downward" size="14px" />
              {{ totalDowngradeableAgents }} agent{{ totalDowngradeableAgents !== 1 ? 's' : '' }} will downgrade
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="au-main">
          <!-- Devices header -->
          <div class="au-devices-header">
            <h2 class="au-devices-header__title">Devices</h2>
            <div class="au-devices-header__controls">
              <q-input
                v-model="searchFilter"
                dense
                outlined
                placeholder="Filter devices..."
                class="au-search"
                clearable
              >
                <template #prepend>
                  <q-icon name="search" size="xs" />
                </template>
              </q-input>
              <button
                v-if="filteredAgentsList.length > 0"
                class="au-select-all-btn"
                @click="toggleSelectAll(!selectAll)"
              >
                {{ selectAll ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
          </div>

          <!-- Empty -->
          <div v-if="filteredAgentsList.length === 0" class="au-devices-empty">
            <q-icon name="devices" size="48px" />
            <span>No devices match current filters</span>
          </div>

          <!-- Cards grid -->
          <div v-else class="au-cards-grid">
            <div
              v-for="agent in filteredAgentsList"
              :key="agent.agent_id"
              class="au-card"
              :class="{
                'au-card--selected': selectedAgents.includes(agent.agent_id),
                'au-card--same': getAgentOperationLabel(agent) === 'Same',
              }"
              @click="toggleAgentSelection(agent.agent_id)"
            >
              <div class="au-card__top">
                <div class="au-card__name">{{ agent.hostname }}</div>
                <q-checkbox
                  :model-value="selectedAgents.includes(agent.agent_id)"
                  dense
                  size="sm"
                  @update:model-value="toggleAgentSelection(agent.agent_id)"
                  @click.stop
                />
              </div>
              <div class="au-card__meta">
                <span class="au-card__version">{{ agent.version || 'N/A' }}</span>
                <span class="au-card__status" :class="agent.status === 'online' ? 'au-card__status--online' : 'au-card__status--offline'"></span>
                <span class="au-card__status-label">{{ agent.status === 'online' ? 'Online' : 'Offline' }}</span>
              </div>
              <div class="au-card__bottom">
                <span class="au-card__arch">{{ agent.goarch || 'x64' }}</span>
                <span
                  v-if="selectedVersion"
                  class="au-card__op"
                  :class="'au-card__op--' + getAgentOperationColor(agent)"
                >{{ getAgentOperationLabel(agent) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="au-footer">
        <button class="au-btn au-btn--ghost" @click="showUpdateMdm">
          <q-icon name="system_update_alt" size="16px" />
          Update MDM Agent
        </button>
        <div style="flex:1"></div>
        <q-btn flat label="Cancel" no-caps v-close-popup />
        <button
          class="au-btn au-btn--primary"
          :disabled="!canExecute"
          @click="executeUpdate"
        >
          {{ actionButtonLabel }}
        </button>
      </div>
    </template>
  </q-card>
</template>

<script>
import mixins from "@/mixins/mixins";
import { fetchAgentVersions, updateAgents } from "@/api/agents";
import UpdateMdmAgents from "@/components/modals/agents/UpdateMdmAgents.vue";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#64748B",
];

export default {
  name: "UpdateAgents",
  emits: ["close"],
  mixins: [mixins],
  data() {
    return {
      loading: true,
      versionInfo: null,
      selectedVersion: null,
      agents: [],
      selectedAgents: [],
      selectAll: false,
      searchFilter: "",
      activeVersionFilter: null,
    };
  },
  methods: {
    showUpdateMdm() {
      this.$q.dialog({
        component: UpdateMdmAgents,
      });
    },
    async getVersions() {
      this.loading = true;
      try {
        const data = await fetchAgentVersions();
        this.versionInfo = data;
        this.agents = data.agents || [];

        if (data.latest_version && this.versionOptions.length > 0) {
          const defaultOption = this.versionOptions.find(
            (opt) => opt.value === data.latest_version,
          );
          this.selectedVersion = defaultOption || this.versionOptions[0];
        } else if (this.versionOptions.length > 0) {
          this.selectedVersion = this.versionOptions[0];
        }
      } catch (error) {
        this.notifyError("Failed to fetch agent versions");
      } finally {
        this.loading = false;
      }
    },

    selectVersionOption(opt) {
      this.selectedVersion = opt;
      this.onVersionChange();
    },

    onVersionChange() {
      this.selectedAgents = [];
      this.selectAll = false;
    },

    toggleVersionFilter(version) {
      this.activeVersionFilter =
        this.activeVersionFilter === version ? null : version;
    },

    toggleSelectAll(value) {
      this.selectAll = value;
      if (value) {
        this.selectedAgents = this.filteredAgentsList.map((a) => a.agent_id);
      } else {
        this.selectedAgents = [];
      }
    },

    toggleAgentSelection(agentId) {
      const index = this.selectedAgents.indexOf(agentId);
      if (index === -1) {
        this.selectedAgents.push(agentId);
      } else {
        this.selectedAgents.splice(index, 1);
      }
      this.updateSelectAllState();
    },

    updateSelectAllState() {
      if (this.selectedAgents.length === 0) {
        this.selectAll = false;
      } else if (this.selectedAgents.length === this.filteredAgentsList.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },

    async executeUpdate() {
      if (!this.canExecute) return;

      const payload = {
        agent_ids: this.selectedAgents,
        target_version: this.selectedVersion.value,
        allow_downgrade: true,
      };

      this.$q.loading.show();
      try {
        const response = await updateAgents(payload);
        this.$q.loading.hide();
        this.$emit("close");

        const actionWord = this.hasOnlyDowngrades ? "rolled back" : "updated";
        this.notifySuccess(
          response.message ||
            `${response.count} agent(s) will be ${actionWord} to version ${response.target_version}`,
        );
      } catch (error) {
        this.$q.loading.hide();
        this.notifyError(
          error.response?.data?.error || "Failed to update agents",
        );
      }
    },

    compareVersions(v1, v2) {
      if (v1 === v2) return 0;
      if (!v1 || v1 === "unknown") return -1;
      if (!v2 || v2 === "unknown") return 1;

      const parts1 = v1.split(".").map(Number);
      const parts2 = v2.split(".").map(Number);

      for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
      }
      return 0;
    },

    getAgentOperationColor(agent) {
      if (!this.selectedVersion) return "neutral";
      const cmp = this.compareVersions(
        agent.version,
        this.selectedVersion.value,
      );
      if (cmp < 0) return "success";
      if (cmp > 0) return "warning";
      return "neutral";
    },

    getAgentOperationLabel(agent) {
      if (!this.selectedVersion) return "";
      const cmp = this.compareVersions(
        agent.version,
        this.selectedVersion.value,
      );
      if (cmp < 0) return "Upgrade";
      if (cmp > 0) return "Downgrade";
      return "Same";
    },
  },
  computed: {
    versionStats() {
      if (!this.versionInfo?.version_stats) return [];

      const stats = this.versionInfo.version_stats;
      return Object.entries(stats)
        .map(([version, count], i) => ({
          version,
          count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }))
        .sort((a, b) => this.compareVersions(b.version, a.version));
    },

    versionOptions() {
      if (!this.versionInfo) return [];

      const versions = this.versionInfo.available_versions || [];
      const stats = this.versionInfo.version_stats || {};
      const latest = this.versionInfo.latest_version;

      return versions
        .map((version) => ({
          label: version,
          value: version,
          count: stats[version] || 0,
          isLatest: version === latest,
        }))
        .sort((a, b) => this.compareVersions(b.value, a.value));
    },

    availableAgents() {
      let list = this.agents;

      // Filter by chart click
      if (this.activeVersionFilter) {
        list = list.filter((a) => a.version === this.activeVersionFilter);
      }

      return list;
    },

    totalUpgradeableAgents() {
      if (!this.selectedVersion) return 0;
      return this.agents.filter(
        (a) =>
          this.compareVersions(a.version, this.selectedVersion.value) < 0 ||
          a.version === "unknown",
      ).length;
    },

    totalDowngradeableAgents() {
      if (!this.selectedVersion) return 0;
      return this.agents.filter(
        (a) => this.compareVersions(a.version, this.selectedVersion.value) > 0,
      ).length;
    },

    filteredAgentsList() {
      let list = this.availableAgents;
      if (this.searchFilter) {
        const filter = this.searchFilter.toLowerCase();
        list = list.filter(
          (a) =>
            a.hostname.toLowerCase().includes(filter) ||
            a.client?.toLowerCase().includes(filter) ||
            a.site?.toLowerCase().includes(filter),
        );
      }
      return list;
    },

    hasOnlyDowngrades() {
      const upgradeCount = this.selectedAgents.filter((id) => {
        const agent = this.agents.find((a) => a.agent_id === id);
        return (
          agent &&
          this.compareVersions(agent.version, this.selectedVersion?.value) < 0
        );
      }).length;
      const downgradeCount = this.selectedAgents.filter((id) => {
        const agent = this.agents.find((a) => a.agent_id === id);
        return (
          agent &&
          this.compareVersions(agent.version, this.selectedVersion?.value) > 0
        );
      }).length;
      return upgradeCount === 0 && downgradeCount > 0;
    },

    canExecute() {
      return !!(this.selectedVersion && this.selectedAgents.length > 0);
    },

    actionButtonLabel() {
      if (this.selectedAgents.length === 0) return "Select Agents";
      if (this.hasOnlyDowngrades) {
        return `Rollback ${this.selectedAgents.length} Agent(s)`;
      }
      return `Update ${this.selectedAgents.length} Agent(s)`;
    },
  },
  mounted() {
    this.getVersions();
  },
};
</script>

<style scoped>
.au-dialog {
  width: 960px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 12px;
  overflow: hidden;
  color: var(--text-primary, #1a1a2e);
  font-family: inherit;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.au-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.au-header__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.au-header__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s;
}

.au-header__close:hover {
  color: var(--text-primary, #1a1a2e);
  background: var(--hover-bg, #f5f7fa);
}

/* ── Loading ── */
.au-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 24px;
}

.au-loading__text {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

/* ── Layout ── */
.au-layout {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Sidebar ── */
.au-sidebar {
  width: 280px;
  min-width: 280px;
  border-right: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.au-sidebar-block {
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.au-sidebar-block:last-child {
  border-bottom: none;
}

.au-sidebar-block__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 14px;
}

/* ── Distribution ── */
.au-distrib {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.au-distrib__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.au-distrib__item:hover {
  background: var(--hover-bg, #f5f7fa);
}

.au-distrib__item--active {
  background: var(--active-bg, #eef6fc);
}

.au-distrib__item--dimmed {
  opacity: 0.4;
}

.au-distrib__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.au-distrib__version {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.au-distrib__count {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
}

.au-distrib__badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--primary-badge-bg, rgba(16,137,211,0.1));
  color: var(--primary-color, #1089d3);
}

.au-distrib__empty {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  font-style: italic;
  padding: 8px 10px;
}

.au-distrib__total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

/* ── Target version ── */
.au-target {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.au-target__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.au-target__option:hover {
  background: var(--hover-bg, #f5f7fa);
}

.au-target__option--selected {
  background: var(--active-bg, #eef6fc);
}

.au-target__radio {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color, #1089d3);
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.au-target__label {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.au-target__badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--primary-badge-bg, rgba(16,137,211,0.1));
  color: var(--primary-color, #1089d3);
}

.au-target__summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 10px;
}

.au-target__summary--upgrade {
  background: rgba(16,185,129,0.08);
  color: #059669;
}

.au-target__summary--downgrade {
  background: rgba(245,158,11,0.08);
  color: #D97706;
}

/* ── Main ── */
.au-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.au-devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 12px;
}

.au-devices-header__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  white-space: nowrap;
}

.au-devices-header__controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.au-search {
  width: 200px;
}

.au-select-all-btn {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
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

/* ── Empty state ── */
.au-devices-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
}

/* ── Cards grid ── */
.au-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.au-card {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.au-card:hover {
  border-color: var(--border-hover, #d1d5db);
  background: var(--hover-bg, #f9fafb);
}

.au-card--selected {
  border-color: var(--primary-color, #1089d3);
  background: var(--active-bg, #eef6fc);
}

.au-card--same {
  opacity: 0.5;
}

.au-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.au-card__name {
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.au-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.au-card__version {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  font-family: monospace;
}

.au-card__status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.au-card__status--online {
  background: #059669;
  box-shadow: 0 0 6px rgba(5,150,105,0.4);
}

.au-card__status--offline {
  background: #9ca3af;
}

.au-card__status-label {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.au-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.au-card__arch {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
}

.au-card__op {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
}

.au-card__op--success {
  background: rgba(5,150,105,0.08);
  color: #059669;
}

.au-card__op--warning {
  background: rgba(217,119,6,0.08);
  color: #D97706;
}

.au-card__op--neutral {
  background: rgba(107,114,128,0.08);
  color: #6b7280;
}

/* ── Footer ── */
.au-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  flex-shrink: 0;
}

.au-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.au-btn--primary {
  background: var(--primary-color, #1089d3);
  color: #fff;
}

.au-btn--primary:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow: 0 2px 8px rgba(16,137,211,0.25);
}

.au-btn--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.au-btn--ghost {
  background: transparent;
  color: var(--text-secondary, #6b7280);
}

.au-btn--ghost:hover {
  background: var(--hover-bg, #f5f7fa);
  color: var(--primary-color, #1089d3);
}

/* ── Dark theme ── */
.body--dark .au-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
  --hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --primary-color: #3B9AE8;
  --primary-badge-bg: rgba(59,154,232,0.15);
  --border-hover: #3d3d4d;
}
</style>
