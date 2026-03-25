<template>
  <div class="au-page">
    <div class="au-layout">
      <!-- Sidebar -->
      <AgentUpdatesSidebar
        :version-stats="currentVersionStats"
        :active-version-filter="activeVersionFilter"
        :latest-version="currentLatestVersion"
        :total-agents="currentAgents.length"
        @filter-version="toggleVersionFilter"
      />

      <!-- Main content -->
      <div class="au-content">
        <!-- Tabs + Action bar -->
        <div class="au-action-bar">
          <div class="au-action-bar__left">
            <q-tabs
              v-model="activeTab"
              dense
              no-caps
              class="au-tabs"
              active-color="primary"
              indicator-color="primary"
            >
              <q-tab name="main" label="Main Agent" />
              <q-tab name="mdm" label="MDM Agent" />
            </q-tabs>
          </div>

          <div class="au-action-bar__right">
            <!-- Main Agent: bulk update button -->
            <q-btn
              v-if="activeTab === 'main'"
              color="primary"
              unelevated
              class="au-update-btn"
              :disable="!canExecute"
              @click="executeMainUpdate"
            >
              <q-icon name="system_update" size="18px" class="q-mr-xs" />
              {{ mainActionLabel }}
            </q-btn>

            <q-btn flat round dense icon="refresh" @click="refreshData">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Devices grid -->
        <AgentUpdatesDevices
          :agents="currentFilteredAgents"
          :selected-agents="selectedAgents"
          :selected-version="currentSelectedVersion"
          :search-filter="searchFilter"
          :loading="currentLoading"
          :all-selected="selectAll"
          :mode="activeTab"
          :selected-arch="mdmArch"
          :updating-agents="mdmUpdatingAgents"
          :deleting-agents="mdmDeletingAgents"
          @toggle-agent="toggleAgentSelection"
          @toggle-select-all="toggleSelectAll(!selectAll)"
          @update:search-filter="searchFilter = $event"
          @update:selected-arch="mdmArch = $event"
          @update-agent="handleMdmUpdate"
          @delete-agent="handleMdmDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/mixins";
import {
  fetchAgentVersions,
  updateAgents,
  fetchMdmVersions,
  updateMdmAgents,
  deleteMdmAgents,
} from "@/api/agents";
import { useAgentsStore } from "@/stores/agents";
import AgentUpdatesSidebar from "../components/AgentUpdatesSidebar.vue";
import AgentUpdatesDevices from "../components/AgentUpdatesDevices.vue";

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
  name: "AgentUpdatesView",
  mixins: [mixins],
  components: {
    AgentUpdatesSidebar,
    AgentUpdatesDevices,
  },
  data() {
    return {
      activeTab: "main",
      searchFilter: "",
      activeVersionFilter: null,

      // Main Agent state
      mainLoading: true,
      mainVersionInfo: null,
      mainSelectedVersion: null,
      mainAgents: [],
      selectedAgents: [],
      selectAll: false,

      // MDM Agent state
      mdmLoading: true,
      mdmVersionsData: null,
      mdmSelectedVersion: null,
      mdmArch: "x64",
      mdmUpdatingAgents: {},
      mdmDeletingAgents: {},
    };
  },
  computed: {
    // ── Active tab data ──
    currentLoading() {
      return this.activeTab === "main" ? this.mainLoading : this.mdmLoading;
    },

    currentAgents() {
      if (this.activeTab === "main") return this.mainAgents;
      const store = useAgentsStore();
      return store.agents.filter((a) => a.plat === "windows");
    },

    currentSelectedVersion() {
      return this.activeTab === "main"
        ? this.mainSelectedVersion
        : this.mdmSelectedVersion;
    },

    currentLatestVersion() {
      if (this.activeTab === "main") {
        return this.mainVersionInfo?.latest_version || null;
      }
      if (this.mdmVersionsData?.versions?.length > 0) {
        return this.mdmVersionsData.versions[0];
      }
      return null;
    },

    // ── Version stats (sidebar) ──
    currentVersionStats() {
      if (this.activeTab === "main") {
        return this.mainVersionStats;
      }
      return this.mdmVersionStats;
    },

    mainVersionStats() {
      if (!this.mainVersionInfo?.version_stats) return [];
      const stats = this.mainVersionInfo.version_stats;
      return Object.entries(stats)
        .map(([version, count], i) => ({
          version,
          count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }))
        .sort((a, b) => this.compareVersions(b.version, a.version));
    },

    mdmVersionStats() {
      const counts = {};
      this.currentAgents.forEach((a) => {
        const v = a.version || "unknown";
        counts[v] = (counts[v] || 0) + 1;
      });
      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([version, count], i) => ({
          version,
          count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }));
    },

    // ── Filtered agents ──
    currentFilteredAgents() {
      let list = this.currentAgents;

      if (this.activeVersionFilter) {
        list = list.filter((a) => (a.version || "unknown") === this.activeVersionFilter);
      }

      if (this.searchFilter) {
        const q = this.searchFilter.toLowerCase();
        list = list.filter(
          (a) =>
            a.hostname?.toLowerCase().includes(q) ||
            a.client?.toLowerCase().includes(q) ||
            a.client_name?.toLowerCase().includes(q) ||
            a.site?.toLowerCase().includes(q) ||
            a.site_name?.toLowerCase().includes(q),
        );
      }

      return list;
    },

    // ── Main Agent computed ──
    mainVersionOptions() {
      if (!this.mainVersionInfo) return [];
      const versions = this.mainVersionInfo.available_versions || [];
      const stats = this.mainVersionInfo.version_stats || {};
      const latest = this.mainVersionInfo.latest_version;
      return versions
        .map((version) => ({
          label: version,
          value: version,
          count: stats[version] || 0,
          isLatest: version === latest,
        }))
        .sort((a, b) => this.compareVersions(b.value, a.value));
    },

    hasOnlyDowngrades() {
      if (!this.mainSelectedVersion) return false;
      const upgradeCount = this.selectedAgents.filter((id) => {
        const agent = this.mainAgents.find((a) => a.agent_id === id);
        return (
          agent &&
          this.compareVersions(agent.version, this.mainSelectedVersion.value) < 0
        );
      }).length;
      const downgradeCount = this.selectedAgents.filter((id) => {
        const agent = this.mainAgents.find((a) => a.agent_id === id);
        return (
          agent &&
          this.compareVersions(agent.version, this.mainSelectedVersion.value) > 0
        );
      }).length;
      return upgradeCount === 0 && downgradeCount > 0;
    },

    canExecute() {
      return !!(this.mainSelectedVersion && this.selectedAgents.length > 0);
    },

    mainActionLabel() {
      if (this.selectedAgents.length === 0) return "Update Agents";
      if (this.hasOnlyDowngrades) {
        return `Rollback ${this.selectedAgents.length} Agent(s)`;
      }
      return `Update ${this.selectedAgents.length} Agent(s)`;
    },
  },
  watch: {
    activeTab() {
      // Reset shared state on tab switch
      this.searchFilter = "";
      this.activeVersionFilter = null;
      this.selectedAgents = [];
      this.selectAll = false;
    },
  },
  methods: {
    // ── Shared ──
    toggleVersionFilter(version) {
      this.activeVersionFilter =
        this.activeVersionFilter === version ? null : version;
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

    refreshData() {
      if (this.activeTab === "main") {
        this.loadMainVersions();
      } else {
        this.loadMdmVersions();
      }
    },

    // ── Main Agent ──
    async loadMainVersions() {
      this.mainLoading = true;
      try {
        const data = await fetchAgentVersions();
        this.mainVersionInfo = data;
        this.mainAgents = data.agents || [];

        if (data.latest_version && this.mainVersionOptions.length > 0) {
          const defaultOption = this.mainVersionOptions.find(
            (opt) => opt.value === data.latest_version,
          );
          this.mainSelectedVersion = defaultOption || this.mainVersionOptions[0];
        } else if (this.mainVersionOptions.length > 0) {
          this.mainSelectedVersion = this.mainVersionOptions[0];
        }
      } catch (error) {
        this.notifyError("Failed to fetch agent versions");
      } finally {
        this.mainLoading = false;
      }
    },

    toggleSelectAll(value) {
      this.selectAll = value;
      if (value) {
        this.selectedAgents = this.currentFilteredAgents.map((a) => a.agent_id);
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
      // Update select all state
      if (this.selectedAgents.length === 0) {
        this.selectAll = false;
      } else if (this.selectedAgents.length === this.currentFilteredAgents.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },

    async executeMainUpdate() {
      if (!this.canExecute) return;

      const payload = {
        agent_ids: this.selectedAgents,
        target_version: this.mainSelectedVersion.value,
        allow_downgrade: true,
      };

      this.$q.loading.show();
      try {
        const response = await updateAgents(payload);
        this.$q.loading.hide();

        const actionWord = this.hasOnlyDowngrades ? "rolled back" : "updated";
        this.notifySuccess(
          response.message ||
            `${response.count} agent(s) will be ${actionWord} to version ${response.target_version}`,
        );

        this.selectedAgents = [];
        this.selectAll = false;
        await this.loadMainVersions();
      } catch (error) {
        this.$q.loading.hide();
        this.notifyError(
          error.response?.data?.error || "Failed to update agents",
        );
      }
    },

    // ── MDM Agent ──
    async loadMdmVersions() {
      this.mdmLoading = true;
      try {
        const data = await fetchMdmVersions();
        this.mdmVersionsData = data;
        if (data.versions && data.versions.length > 0) {
          this.mdmSelectedVersion = { value: data.versions[0], label: data.versions[0] };
        }
      } catch (error) {
        this.notifyError("Failed to fetch MDM versions");
      } finally {
        this.mdmLoading = false;
      }
    },

    async handleMdmUpdate(agentId) {
      if (!this.mdmSelectedVersion) {
        this.notifyError("No target version available");
        return;
      }
      this.$set(this.mdmUpdatingAgents, agentId, true);
      try {
        const response = await updateMdmAgents({
          agent_ids: [agentId],
          version: this.mdmSelectedVersion.value,
          arch: this.mdmArch,
        });
        this.notifySuccess(response.message || "MDM agent update started");
      } catch (error) {
        this.notifyError(
          error.response?.data?.error ||
            error.response?.data ||
            "Failed to start MDM update",
        );
      } finally {
        this.$set(this.mdmUpdatingAgents, agentId, false);
      }
    },

    handleMdmDelete(agentId) {
      const agent = this.currentAgents.find((a) => a.agent_id === agentId);
      const hostname = agent ? agent.hostname : agentId;

      this.$q.dialog({
        title: "Delete MDM Agent",
        message: `Are you sure you want to uninstall MDM agent from ${hostname}? This will remove LaboratoMDM Agent and its data from the machine.`,
        cancel: true,
        persistent: true,
        ok: { label: "Delete", color: "negative" },
      }).onOk(async () => {
        this.$set(this.mdmDeletingAgents, agentId, true);
        try {
          const response = await deleteMdmAgents({
            agent_ids: [agentId],
          });
          this.notifySuccess(response.message || "MDM agent deletion started");
        } catch (error) {
          this.notifyError(
            error.response?.data?.error ||
              error.response?.data ||
              "Failed to start MDM deletion",
          );
        } finally {
          this.$set(this.mdmDeletingAgents, agentId, false);
        }
      });
    },
  },
  mounted() {
    this.loadMainVersions();
    this.loadMdmVersions();
  },
};
</script>

<style scoped>
.au-page {
  height: 100%;
  background: var(--page-bg, #f5f7fa);
}

.au-layout {
  display: flex;
  height: 100%;
}

.au-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--content-bg, #ffffff);
}

/* ── Action bar ── */
.au-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 12px;
  min-height: 48px;
}

.au-action-bar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.au-action-bar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.au-tabs {
  border-bottom: none;
}

.au-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  min-height: 48px;
}

.au-update-btn {
  font-weight: 600;
  text-transform: none;
  padding: 6px 16px;
  font-size: 13px;
}

/* ── Dark theme ── */
.body--dark .au-page {
  --page-bg: #121218;
  --content-bg: #1e1e2d;
  --border-color: #2d2d3a;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .au-layout {
    flex-direction: column;
  }

  .au-layout :deep(.au-sidebar) {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    max-height: 300px;
  }

  .au-layout :deep(.au-sidebar-header) {
    display: none;
  }

  .au-layout :deep(.au-sidebar-block) {
    display: inline-flex;
    flex-direction: column;
    width: 50%;
    vertical-align: top;
  }
}
</style>
