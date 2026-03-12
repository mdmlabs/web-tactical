<template>
  <q-card style="min-width: 750px; max-width: 900px">
    <q-bar>
      Agent Version Management
      <q-space />
      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>

    <!-- Loading State -->
    <q-inner-loading :showing="loading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <template v-if="versionInfo && !loading">
      <!-- System Information Panel -->
      <q-card-section class="bg-grey-2">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">
          <q-icon name="info" class="q-mr-xs" />
          System Version Information
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-caption text-grey-7">Server Configured Version</div>
            <div class="text-body1">{{ versionInfo.current_version || 'Not set' }}</div>
          </div>
          <div class="col-6">
            <div class="text-caption text-grey-7">
              Latest Available
              <q-icon
                name="help_outline"
                size="xs"
                class="cursor-pointer"
              >
                <q-tooltip>
                  The recommended version from your repository.
                  This may be older than some agent versions if you tested newer builds.
                </q-tooltip>
              </q-icon>
            </div>
            <div class="text-body1">
              {{ versionInfo.latest_version || 'Not configured' }}
              <q-badge
                v-if="hasNewerAgents"
                color="orange"
                class="q-ml-sm"
              >
                Some agents have newer versions
              </q-badge>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Version Statistics -->
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">
          <q-icon name="analytics" class="q-mr-xs" />
          Agent Version Distribution
        </div>
        <q-markup-table flat bordered dense class="q-mb-md">
          <thead class="bg-grey-3">
            <tr>
              <th class="text-left">Version</th>
              <th class="text-center">Agents</th>
              <th class="text-center">Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in versionStats" :key="stat.version">
              <td class="text-left">
                <span class="text-weight-medium">{{ stat.version }}</span>
              </td>
              <td class="text-center">{{ stat.count }}</td>
              <td class="text-center">
                <q-badge
                  :color="getVersionStatusColor(stat.version)"
                  :label="getVersionStatusLabel(stat.version)"
                />
              </td>
              <td class="text-right">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  label="Select All"
                  @click="selectAgentsByVersion(stat.version)"
                  :disable="stat.version === selectedVersion?.value"
                />
              </td>
            </tr>
            <tr v-if="versionStats.length === 0">
              <td colspan="4" class="text-center text-grey">
                No agents found
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <!-- Target Version Selection -->
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-md">
          <q-icon name="update" class="q-mr-xs" />
          Select Target Version
        </div>

        <div class="row q-col-gutter-md items-start">
          <div class="col-6">
            <q-select
              square
              dense
              outlined
              v-model="selectedVersion"
              :options="filteredVersionOptions"
              label="Target Version"
              @update:model-value="onVersionChange"
              use-input
              input-debounce="0"
              @filter="filterVersions"
              @new-value="createVersionOption"
              new-value-mode="add-unique"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="edit" size="xs" />
              </template>
              <template v-slot:hint>
                Select from list or type custom version (e.g., 2.8.5)
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption v-if="scope.opt.count !== undefined">
                      {{ scope.opt.count }} agent(s) currently on this version
                    </q-item-label>
                    <q-item-label caption v-else class="text-italic">
                      Custom version
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      v-if="scope.opt.isLatest"
                      color="positive"
                      label="Recommended"
                    />
                    <q-badge
                      v-else-if="scope.opt.isNewer"
                      color="orange"
                      label="Newer"
                    />
                    <q-badge
                      v-else-if="scope.opt.isOlder"
                      color="grey"
                      label="Older"
                    />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <span>{{ scope.opt.label }}</span>
                <q-badge
                  v-if="scope.opt.isLatest"
                  color="positive"
                  class="q-ml-sm"
                  label="Recommended"
                />
                <q-badge
                  v-else-if="scope.opt.isOlder"
                  color="grey"
                  class="q-ml-sm"
                  label="Older"
                />
                <q-badge
                  v-else-if="scope.opt.isCustom"
                  color="purple"
                  class="q-ml-sm"
                  label="Custom"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Type to enter custom version
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-6">
            <div v-if="hasDowngradeAgents">
              <q-checkbox
                v-model="allowDowngrade"
                color="orange"
              >
                <span class="text-weight-medium">Allow version downgrade</span>
                <q-tooltip>
                  When enabled, agents with versions newer than {{ selectedVersion?.value }} will be included for rollback
                </q-tooltip>
              </q-checkbox>
              <div class="text-caption q-mt-xs q-ml-lg">
                <q-icon name="info" size="xs" />
                <span class="text-grey-7">
                  {{ totalUpgradeableAgents }} agent(s) for upgrade,
                </span>
                <span class="text-orange-9 text-weight-medium">
                  {{ totalDowngradeableAgents }} agent(s) for downgrade
                </span>
              </div>
            </div>
            <div v-else class="q-pa-sm bg-blue-1 rounded-borders">
              <div class="row items-center">
                <q-icon name="arrow_upward" color="positive" size="sm" class="q-mr-sm" />
                <div>
                  <div class="text-weight-medium text-positive">Upgrade Operation</div>
                  <div class="text-caption text-grey-7">
                    <span v-if="totalUpgradeableAgents > 0">
                      {{ totalUpgradeableAgents }} agent(s) available for upgrade to {{ selectedVersion?.value }}
                    </span>
                    <span v-else>
                      All agents are already on version {{ selectedVersion?.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Operation Preview -->
        <div
          v-if="selectedVersion && operationPreview.length > 0"
          class="q-mt-md q-pa-md rounded-borders"
          :class="previewBgClass"
        >
          <div class="text-weight-medium q-mb-sm">
            <q-icon :name="previewIcon" class="q-mr-xs" />
            Operation Preview
          </div>
          <div
            v-for="preview in operationPreview"
            :key="preview.type"
            class="row items-center q-mb-xs"
          >
            <q-icon
              :name="preview.icon"
              :color="preview.color"
              size="sm"
              class="q-mr-sm"
            />
            <span>{{ preview.text }}</span>
          </div>
        </div>

        <!-- Downgrade Warning -->
        <q-banner
          v-if="hasDowngradeAgents && !allowDowngrade && selectedVersion"
          class="bg-orange-1 text-orange-9 q-mt-md"
          rounded
        >
          <template v-slot:avatar>
            <q-icon name="warning" color="orange" />
          </template>
          <div class="text-weight-medium">Downgrade Required</div>
          <div class="text-caption">
            {{ downgradeAgentsCount }} agent(s) have version newer than {{ selectedVersion.value }}.
            Enable "Allow version downgrade" to include them.
          </div>
        </q-banner>
      </q-card-section>

      <q-separator />

      <!-- Agent Selection -->
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle1 text-weight-medium">
            <q-icon name="devices" class="q-mr-xs" />
            Select Agents
          </div>
          <q-space />
          <div class="text-caption text-grey-7">
            {{ selectedAgents.length }} of {{ availableAgents.length }} agents selected
          </div>
        </div>

        <div class="row items-center q-mb-sm q-gutter-sm">
          <q-checkbox
            v-model="selectAll"
            :indeterminate="isIndeterminate"
            label="Select All"
            @update:model-value="toggleSelectAll"
            :disable="availableAgents.length === 0"
          />
          <q-space />
          <q-input
            v-model="searchFilter"
            dense
            outlined
            placeholder="Filter agents..."
            style="width: 200px"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" size="xs" />
            </template>
          </q-input>
        </div>

        <q-separator class="q-mb-sm" />

        <div
          v-if="availableAgents.length === 0"
          class="text-center text-grey q-pa-lg"
        >
          <q-icon name="info" size="md" class="q-mb-sm" />
          <div>
            No agents available for this operation.
            <span v-if="!allowDowngrade && hasDowngradeAgents">
              Enable "Allow version downgrade" to see more agents.
            </span>
          </div>
        </div>

        <q-virtual-scroll
          v-else
          :items="filteredAgentsList"
          style="max-height: 300px"
          v-slot="{ item }"
        >
          <q-item
            :key="item.agent_id"
            dense
            clickable
            @click="toggleAgentSelection(item.agent_id)"
          >
            <q-item-section side>
              <q-checkbox
                :model-value="selectedAgents.includes(item.agent_id)"
                @update:model-value="toggleAgentSelection(item.agent_id)"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.hostname }}</q-item-label>
              <q-item-label caption>
                {{ item.client }} > {{ item.site }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                :color="getAgentOperationColor(item)"
                :label="getAgentOperationLabel(item)"
              />
            </q-item-section>
            <q-item-section side>
              <span class="text-caption">v{{ item.version }}</span>
            </q-item-section>
          </q-item>
        </q-virtual-scroll>
      </q-card-section>

      <q-separator />

      <!-- Action Buttons -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          :label="actionButtonLabel"
          :color="actionButtonColor"
          :disable="!canExecute"
          @click="executeUpdate"
        >
          <q-tooltip v-if="!canExecute && hasDowngradeAgents && !allowDowngrade">
            Enable "Allow version downgrade" to proceed with rollback
          </q-tooltip>
          <q-tooltip v-else-if="!canExecute && selectedAgents.length === 0">
            Select at least one agent
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </template>
  </q-card>
</template>

<script>
import mixins from "@/mixins/mixins";
import { fetchAgentVersions, updateAgents } from "@/api/agents";

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
      allowDowngrade: false,
      searchFilter: "",
      filteredVersionOptions: [],
    };
  },
  methods: {
    async getVersions() {
      this.loading = true;
      try {
        const data = await fetchAgentVersions();
        this.versionInfo = data;
        this.agents = data.agents || [];

        // Initialize filtered options with all available versions
        this.filteredVersionOptions = this.versionOptions;

        // Set default selected version to latest
        if (data.latest_version && this.versionOptions.length > 0) {
          const defaultOption = this.versionOptions.find(
            (opt) => opt.value === data.latest_version
          );
          if (defaultOption) {
            this.selectedVersion = defaultOption;
          } else {
            this.selectedVersion = this.versionOptions[0];
          }
        } else if (this.versionOptions.length > 0) {
          this.selectedVersion = this.versionOptions[0];
        }
      } catch (error) {
        this.notifyError("Failed to fetch agent versions");
      } finally {
        this.loading = false;
      }
    },

    filterVersions(val, update) {
      update(() => {
        if (val === '') {
          this.filteredVersionOptions = this.versionOptions;
        } else {
          const needle = val.toLowerCase();
          this.filteredVersionOptions = this.versionOptions.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },

    createVersionOption(val, done) {
      // Validate version format (basic semver check)
      const versionPattern = /^\d+\.\d+(\.\d+)?$/;
      if (!versionPattern.test(val)) {
        this.notifyError(`Invalid version format: ${val}. Expected format: X.Y or X.Y.Z`);
        done(null);
        return;
      }

      const newOption = {
        label: val,
        value: val,
        count: 0,
        isLatest: false,
        isNewer: false,
        isOlder: false,
        isCustom: true,
      };

      done(newOption, 'add-unique');
    },

    onVersionChange() {
      this.selectedAgents = [];
      this.selectAll = false;
      // Auto-enable downgrade when switching to a version that requires it
      if (this.hasDowngradeAgents) {
        this.allowDowngrade = true;
      } else {
        this.allowDowngrade = false;
      }
    },

    toggleSelectAll(value) {
      if (value) {
        this.selectedAgents = this.availableAgents.map((a) => a.agent_id);
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
      } else if (this.selectedAgents.length === this.availableAgents.length) {
        this.selectAll = true;
      }
    },

    selectAgentsByVersion(version) {
      const agentIds = this.availableAgents
        .filter((a) => a.version === version)
        .map((a) => a.agent_id);

      // Add to selection (don't replace)
      agentIds.forEach((id) => {
        if (!this.selectedAgents.includes(id)) {
          this.selectedAgents.push(id);
        }
      });
      this.updateSelectAllState();
    },

    async executeUpdate() {
      if (!this.canExecute) return;

      const payload = {
        agent_ids: this.selectedAgents,
        target_version: this.selectedVersion.value,
        allow_downgrade: true,
      };

      console.log('=== UpdateAgents payload ===', payload);

      this.$q.loading.show();
      try {
        const response = await updateAgents(payload);
        this.$q.loading.hide();
        this.$emit("close");

        const actionWord = this.hasOnlyDowngrades ? "rolled back" : "updated";
        this.notifySuccess(
          response.message ||
            `${response.count} agent(s) will be ${actionWord} to version ${response.target_version}`
        );
      } catch (error) {
        this.$q.loading.hide();
        this.notifyError(
          error.response?.data?.error || "Failed to update agents"
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

    getVersionStatusColor(version) {
      if (!this.versionInfo) return "grey";
      const latest = this.versionInfo.latest_version;

      if (version === latest) return "positive";
      if (this.compareVersions(version, latest) > 0) return "orange";
      return "grey";
    },

    getVersionStatusLabel(version) {
      if (!this.versionInfo) return "";
      const latest = this.versionInfo.latest_version;

      if (version === latest) return "Recommended";
      if (this.compareVersions(version, latest) > 0) return "Newer";
      return "Older";
    },

    getAgentOperationColor(agent) {
      if (!this.selectedVersion) return "grey";
      const cmp = this.compareVersions(agent.version, this.selectedVersion.value);
      if (cmp < 0) return "positive";
      if (cmp > 0) return "orange";
      return "grey";
    },

    getAgentOperationLabel(agent) {
      if (!this.selectedVersion) return "";
      const cmp = this.compareVersions(agent.version, this.selectedVersion.value);
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
        .map(([version, count]) => ({ version, count }))
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
          isNewer: this.compareVersions(version, latest) > 0,
          isOlder: this.compareVersions(version, latest) < 0,
        }))
        .sort((a, b) => this.compareVersions(b.value, a.value));
    },

    hasNewerAgents() {
      if (!this.versionInfo?.latest_version) return false;
      return this.agents.some(
        (a) => this.compareVersions(a.version, this.versionInfo.latest_version) > 0
      );
    },

    availableAgents() {
      if (!this.selectedVersion) return [];

      return this.agents.filter((agent) => {
        const cmp = this.compareVersions(agent.version, this.selectedVersion.value);

        // Always include agents that need upgrade
        if (cmp < 0 || agent.version === "unknown") return true;

        // Always include agents that need downgrade (allow_downgrade will be set automatically)
        if (cmp > 0) return true;

        return false;
      });
    },

    totalUpgradeableAgents() {
      if (!this.selectedVersion) return 0;
      return this.agents.filter(
        (a) => this.compareVersions(a.version, this.selectedVersion.value) < 0 || a.version === "unknown"
      ).length;
    },

    totalDowngradeableAgents() {
      if (!this.selectedVersion) return 0;
      return this.agents.filter(
        (a) => this.compareVersions(a.version, this.selectedVersion.value) > 0
      ).length;
    },

    filteredAgentsList() {
      if (!this.searchFilter) return this.availableAgents;

      const filter = this.searchFilter.toLowerCase();
      return this.availableAgents.filter(
        (a) =>
          a.hostname.toLowerCase().includes(filter) ||
          a.client?.toLowerCase().includes(filter) ||
          a.site?.toLowerCase().includes(filter)
      );
    },

    hasDowngradeAgents() {
      if (!this.selectedVersion) return false;

      return this.agents.some(
        (a) => this.compareVersions(a.version, this.selectedVersion.value) > 0
      );
    },

    downgradeAgentsCount() {
      if (!this.selectedVersion) return 0;

      return this.agents.filter(
        (a) => this.compareVersions(a.version, this.selectedVersion.value) > 0
      ).length;
    },

    upgradeAgentsCount() {
      if (!this.selectedVersion) return 0;

      return this.selectedAgents.filter((id) => {
        const agent = this.agents.find((a) => a.agent_id === id);
        return agent && this.compareVersions(agent.version, this.selectedVersion.value) < 0;
      }).length;
    },

    selectedDowngradeCount() {
      if (!this.selectedVersion) return 0;

      return this.selectedAgents.filter((id) => {
        const agent = this.agents.find((a) => a.agent_id === id);
        return agent && this.compareVersions(agent.version, this.selectedVersion.value) > 0;
      }).length;
    },

    hasOnlyDowngrades() {
      return this.upgradeAgentsCount === 0 && this.selectedDowngradeCount > 0;
    },

    operationPreview() {
      if (!this.selectedVersion || this.selectedAgents.length === 0) return [];

      const preview = [];
      const upgradeCount = this.upgradeAgentsCount;
      const downgradeCount = this.selectedDowngradeCount;

      if (upgradeCount > 0) {
        preview.push({
          type: "upgrade",
          icon: "arrow_upward",
          color: "positive",
          text: `${upgradeCount} agent(s) will be upgraded to v${this.selectedVersion.value}`,
        });
      }

      if (downgradeCount > 0) {
        preview.push({
          type: "downgrade",
          icon: "arrow_downward",
          color: "orange",
          text: `${downgradeCount} agent(s) will be rolled back to v${this.selectedVersion.value}`,
        });
      }

      return preview;
    },

    previewBgClass() {
      if (this.selectedDowngradeCount > 0 && this.upgradeAgentsCount > 0) {
        return "bg-blue-1";
      }
      if (this.selectedDowngradeCount > 0) {
        return "bg-orange-1";
      }
      return "bg-green-1";
    },

    previewIcon() {
      if (this.selectedDowngradeCount > 0 && this.upgradeAgentsCount > 0) {
        return "swap_vert";
      }
      if (this.selectedDowngradeCount > 0) {
        return "arrow_downward";
      }
      return "arrow_upward";
    },

    isIndeterminate() {
      return (
        this.selectedAgents.length > 0 &&
        this.selectedAgents.length < this.availableAgents.length
      );
    },

    canExecute() {
      if (!this.selectedVersion || this.selectedAgents.length === 0) return false;

      // Allow execution - allow_downgrade will be set automatically if needed
      return true;
    },

    actionButtonLabel() {
      if (this.selectedAgents.length === 0) return "Select Agents";

      if (this.hasOnlyDowngrades) {
        return `Rollback ${this.selectedAgents.length} Agent(s)`;
      }

      if (this.selectedDowngradeCount > 0) {
        return `Update ${this.selectedAgents.length} Agent(s)`;
      }

      return `Update ${this.selectedAgents.length} Agent(s)`;
    },

    actionButtonColor() {
      if (this.hasOnlyDowngrades) return "warning";
      if (this.selectedDowngradeCount > 0) return "primary";
      return "primary";
    },
  },
  mounted() {
    this.getVersions();
  },
};
</script>
