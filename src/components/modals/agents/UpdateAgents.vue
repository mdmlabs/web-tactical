<template>
  <q-card style="min-width: 600px">
    <q-bar>
      Update Agents
      <q-space />
      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-separator />
    <q-banner class="bg-primary">
      <template v-slot:avatar>
        <q-icon name="info" />
      </template>
      If agent auto update is enabled in Global Settings, agents will
      automatically self update at 35 min past the hour, every hour. Use this
      tool to manually trigger an agent update cycle.
    </q-banner>

    <!-- Version Information -->
    <q-card-section v-if="versionInfo">
      <div class="row items-center q-mb-sm">
        <div class="col-auto text-weight-medium">Current Version:</div>
        <div class="col q-ml-sm">{{ versionInfo.current_version }}</div>
      </div>
      <div class="row items-center q-mb-sm" v-if="versionInfo.nexus_configured">
        <div class="col-auto text-weight-medium">Latest Available:</div>
        <div class="col q-ml-sm">
          {{ versionInfo.latest_version }}
          <q-badge
            v-if="versionInfo.nexus_version && versionInfo.nexus_version !== versionInfo.current_version"
            color="positive"
            class="q-ml-sm"
          >
            New version available
          </q-badge>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Version Selection -->
    <q-card-section>
      <div class="text-weight-medium q-mb-sm">Select Target Version</div>
      <q-select
        square
        dense
        options-dense
        outlined
        v-model="selectedVersion"
        :options="versionOptions"
        @update:model-value="onVersionChange"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption v-if="scope.opt.count">
                {{ scope.opt.count }} agent(s) on this version
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="scope.opt.isLatest">
              <q-badge color="positive">Latest</q-badge>
            </q-item-section>
            <q-item-section side v-else-if="scope.opt.isCurrent">
              <q-badge color="info">Current</q-badge>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Downgrade Warning -->
      <div
        v-if="isDowngrade"
        class="q-mt-md q-pa-md bg-warning text-dark rounded-borders"
      >
        <div class="row items-center">
          <q-icon name="warning" size="sm" class="q-mr-sm" />
          <div class="text-weight-medium">
            Warning: You are about to downgrade agents from a newer version
          </div>
        </div>
        <q-checkbox
          v-model="allowDowngrade"
          label="I understand and want to allow downgrade/rollback"
          class="q-mt-sm"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Agent Selection -->
    <q-card-section v-show="selectedVersion !== null">
      <div class="text-weight-medium q-mb-sm">Select Agents</div>
      <q-separator />
      <div class="row items-center q-mt-sm q-mb-sm">
        <q-checkbox
          v-model="selectAll"
          label="Select All"
          @update:model-value="selectAllAction"
        />
        <q-space />
        <q-btn
          v-show="group.length !== 0"
          :label="isDowngrade ? 'Rollback' : 'Update'"
          :color="isDowngrade ? 'warning' : 'primary'"
          @click="update"
          :disable="isDowngrade && !allowDowngrade"
        >
          <q-tooltip v-if="isDowngrade && !allowDowngrade">
            Enable "Allow downgrade" checkbox to proceed
          </q-tooltip>
        </q-btn>
      </div>
      <q-separator />
      <q-option-group
        v-model="group"
        :options="filteredAgentOptions"
        color="green"
        type="checkbox"
        style="max-height: 50vh; max-width: 100%"
        class="scroll q-mt-sm"
      />
      <div v-if="filteredAgentOptions.length === 0" class="text-grey q-mt-md">
        No agents available for
        {{ isDowngrade ? "rollback" : "update" }} to this version
      </div>
    </q-card-section>
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
      versionInfo: null,
      selectedVersion: null,
      agents: [],
      group: [],
      selectAll: false,
      allowDowngrade: false,
    };
  },
  methods: {
    selectAllAction() {
      this.selectAll
        ? (this.group = this.filteredAgentIds)
        : (this.group = []);
    },
    onVersionChange() {
      // Reset selection when version changes
      this.group = [];
      this.selectAll = false;
      this.allowDowngrade = false;
    },
    async getVersions() {
      this.$q.loading.show();
      try {
        const data = await fetchAgentVersions();
        this.versionInfo = data;
        this.agents = data.agents;

        // Set default selected version to latest
        if (data.latest_version) {
          const defaultOption = this.versionOptions.find(
            (opt) => opt.value === data.latest_version,
          );
          if (defaultOption) {
            this.selectedVersion = defaultOption;
          }
        } else if (this.versionOptions.length > 0) {
          this.selectedVersion = this.versionOptions[0];
        }

        this.$q.loading.hide();
      } catch (error) {
        this.$q.loading.hide();
        this.notifyError("Failed to fetch agent versions");
      }
    },
    async update() {
      if (!this.selectedVersion || this.group.length === 0) {
        this.notifyError("Please select version and agents");
        return;
      }

      if (this.isDowngrade && !this.allowDowngrade) {
        this.notifyError("Please enable downgrade checkbox to proceed");
        return;
      }

      const payload = {
        agent_ids: this.group,
        target_version: this.selectedVersion.value,
      };

      if (this.isDowngrade) {
        payload.allow_downgrade = true;
      }

      this.$q.loading.show();
      try {
        const response = await updateAgents(payload);
        this.$q.loading.hide();
        this.$emit("close");

        const action = this.isDowngrade ? "rollback" : "update";
        this.notifySuccess(
          response.message ||
            `${response.count} agent(s) will be ${action}ed to version ${response.target_version}`,
        );
      } catch (error) {
        this.$q.loading.hide();
        this.notifyError(
          error.response?.data?.error || "Failed to update agents",
        );
      }
    },
    compareVersions(v1, v2) {
      // Simple semver comparison
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
  },
  computed: {
    versionOptions() {
      if (!this.versionInfo) return [];

      const options = [];
      const versions = this.versionInfo.available_versions || [];
      const stats = this.versionInfo.version_stats || {};
      const latest = this.versionInfo.latest_version;
      const current = this.versionInfo.current_version;

      versions.forEach((version) => {
        options.push({
          label: version,
          value: version,
          count: stats[version] || 0,
          isLatest: version === latest,
          isCurrent: version === current,
        });
      });

      return options;
    },
    isDowngrade() {
      if (!this.selectedVersion || !this.versionInfo) return false;

      const targetVersion = this.selectedVersion.value;
      const currentVersion = this.versionInfo.current_version;

      // Simple version comparison (works for semver like 2.9.0)
      return this.compareVersions(targetVersion, currentVersion) < 0;
    },
    filteredAgentOptions() {
      if (!this.selectedVersion) return [];

      const targetVersion = this.selectedVersion.value;
      const filteredAgents = this.agents.filter((agent) => {
        if (this.allowDowngrade) {
          // For rollback: show all agents with different version
          return agent.version !== targetVersion;
        } else {
          // For upgrade: show only agents with older version
          return (
            this.compareVersions(agent.version, targetVersion) < 0 ||
            agent.version === "unknown"
          );
        }
      });

      return filteredAgents
        .map((agent) => ({
          label: `${agent.hostname} (${agent.client} > ${agent.site}) - v${agent.version}`,
          value: agent.agent_id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    filteredAgentIds() {
      return this.filteredAgentOptions.map((opt) => opt.value);
    },
  },
  mounted() {
    this.getVersions();
  },
};
</script>
