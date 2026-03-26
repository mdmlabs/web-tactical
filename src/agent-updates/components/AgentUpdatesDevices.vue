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
        <!-- MDM: arch selector + selection counter + select all -->
        <template v-if="mode === 'mdm'">
          <span
            v-for="opt in archOptions"
            :key="opt.value"
            class="au-arch-tag"
            :class="{ 'au-arch-tag--active': selectedArch === opt.value }"
            @click="$emit('update:selectedArch', opt.value)"
          >{{ opt.label }}</span>
          <span class="au-devices-count">{{ selectedAgents.length }} of {{ agents.length }} selected</span>
          <button
            v-if="agents.length > 0"
            class="au-select-all-btn"
            @click="$emit('toggle-select-all')"
          >
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
        </template>
        <!-- Main: selection counter + select all -->
        <template v-else>
          <span class="au-devices-count">{{ selectedAgents.length }} of {{ agents.length }} selected</span>
          <button
            v-if="agents.length > 0"
            class="au-select-all-btn"
            @click="$emit('toggle-select-all')"
          >
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
        </template>
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

    <!-- Cards grid -->
    <div v-else class="au-cards-scroll">
      <div class="au-cards-grid">
        <!-- Main Agent card -->
        <template v-if="mode === 'main'">
          <div
            v-for="agent in agents"
            :key="agent.agent_id"
            class="au-card"
            :class="{
              'au-card--selected': selectedAgents.includes(agent.agent_id),
              'au-card--same': getOperationLabel(agent) === 'Same',
            }"
            @click="$emit('toggle-agent', agent.agent_id)"
          >
            <div class="au-card__top">
              <div class="au-card__name">{{ agent.hostname }}</div>
              <q-checkbox
                :model-value="selectedAgents.includes(agent.agent_id)"
                dense
                size="sm"
                @update:model-value="$emit('toggle-agent', agent.agent_id)"
                @click.stop
              />
            </div>
            <div class="au-card__meta">
              <span class="au-card__version">{{ agent.version || 'N/A' }}</span>
              <span
                class="au-card__status"
                :class="agent.status === 'online' ? 'au-card__status--online' : 'au-card__status--offline'"
              ></span>
              <span class="au-card__status-label">{{ agent.status === 'online' ? 'Online' : 'Offline' }}</span>
            </div>
            <div class="au-card__bottom">
              <span class="au-card__arch">{{ agent.goarch || 'x64' }}</span>
              <span
                v-if="selectedVersion"
                class="au-card__op"
                :class="'au-card__op--' + getOperationColor(agent)"
              >{{ getOperationLabel(agent) }}</span>
            </div>
          </div>
        </template>

        <!-- MDM Agent card -->
        <template v-else>
          <div
            v-for="agent in agents"
            :key="agent.agent_id"
            class="au-card"
            :class="{
              'au-card--selected': selectedAgents.includes(agent.agent_id),
              'au-card--same': selectedVersion && agent.version === selectedVersion.value,
            }"
            @click="$emit('toggle-agent', agent.agent_id)"
          >
            <div class="au-card__top">
              <div class="au-card__name">{{ agent.hostname }}</div>
              <q-checkbox
                :model-value="selectedAgents.includes(agent.agent_id)"
                dense
                size="sm"
                @update:model-value="$emit('toggle-agent', agent.agent_id)"
                @click.stop
              />
            </div>
            <div class="au-card__meta">
              <span class="au-card__version">{{ agent.version || 'N/A' }}</span>
              <span
                class="au-card__status"
                :class="agent.status === 'online' ? 'au-card__status--online' : 'au-card__status--offline'"
              ></span>
              <span class="au-card__status-label">{{ agent.status === 'online' ? 'Online' : 'Offline' }}</span>
            </div>
            <div class="au-card__bottom">
              <span class="au-card__arch-inline">{{ selectedArch }}</span>
              <span
                v-if="selectedVersion"
                class="au-card__op"
                :class="'au-card__op--' + getOperationColor(agent)"
              >{{ getOperationLabel(agent) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
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
    selectedArch: { type: String, default: "x64" },
    updatingAgents: { type: Object, default: () => ({}) },
    deletingAgents: { type: Object, default: () => ({}) },
  },
  emits: ["toggle-agent", "toggle-select-all", "update:searchFilter", "update:selectedArch", "update-agent", "delete-agent"],
  data() {
    return {
      archOptions: [
        { label: "x64", value: "x64" },
        { label: "ARM64", value: "arm64" },
      ],
    };
  },
  methods: {
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
    getOperationColor(agent) {
      if (!this.selectedVersion) return "neutral";
      const cmp = this.compareVersions(agent.version, this.selectedVersion.value);
      if (cmp < 0) return "success";
      if (cmp > 0) return "warning";
      return "neutral";
    },
    getOperationLabel(agent) {
      if (!this.selectedVersion) return "";
      const cmp = this.compareVersions(agent.version, this.selectedVersion.value);
      if (cmp < 0) return "Upgrade";
      if (cmp > 0) return "Downgrade";
      return "Same";
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

/* ── Header ── */
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

/* ── Arch tags ── */
.au-arch-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--badge-bg, #f3f4f6);
  color: var(--text-secondary, #6b7280);
}

.au-arch-tag:hover {
  color: var(--text-primary, #1a1a2e);
}

.au-arch-tag--active {
  background: var(--primary-color, #1089d3);
  color: #fff;
}

/* ── States ── */
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

/* ── Cards ── */
.au-cards-scroll {
  flex: 1;
  overflow-y: auto;
}

.au-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px 24px;
}

@media (min-width: 1200px) {
  .au-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
  background: var(--row-hover-bg, #f9fafb);
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
  color: var(--text-primary, #1a1a2e);
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

.au-card__arch-inline {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
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

/* ── Per-agent delete button (MDM) ── */
.au-card-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
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

.au-card-delete-btn:hover:not(:disabled) {
  border-color: #EF4444;
  color: #EF4444;
}

.au-card-delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Per-agent update button (MDM) ── */
.au-card-update-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--border-color, #e5e7eb);
  background: transparent;
  color: var(--text-primary, #1a1a2e);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  margin-left: auto;
}

.au-card-update-btn:hover:not(:disabled) {
  border-color: var(--primary-color, #1089d3);
  color: var(--primary-color, #1089d3);
}

.au-card-update-btn__icon {
  transition: transform 0.4s ease;
}

.au-card-update-btn:hover:not(:disabled) .au-card-update-btn__icon {
  transform: rotate(180deg);
}

.au-card-update-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Dark theme ── */
.body--dark .au-devices {
  --content-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --input-bg: #2a2a3d;
  --row-hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --border-hover: #3d3d4d;
  --primary-color: #3B9AE8;
  --badge-bg: #3d3d4d;
}
</style>
