<template>
  <div class="au-sidebar">
    <div class="au-sidebar-header">
      <h2 class="au-sidebar-title">Agent Updates</h2>
      <p class="au-sidebar-desc">
        Manage agent version updates across your fleet.
      </p>
    </div>

    <!-- Distribution -->
    <div class="au-sidebar-block">
      <h3 class="au-sidebar-block__title">Distribution</h3>
      <div class="au-distrib">
        <div
          v-for="stat in versionStats"
          :key="stat.version"
          class="au-distrib__item"
          :class="{
            'au-distrib__item--active': activeVersionFilter === stat.version,
            'au-distrib__item--dimmed': activeVersionFilter && activeVersionFilter !== stat.version,
          }"
          @click="$emit('filter-version', stat.version)"
        >
          <span class="au-distrib__dot" :style="{ backgroundColor: stat.color }"></span>
          <span class="au-distrib__version">{{ stat.version }}</span>
          <span class="au-distrib__count">{{ stat.count }} agent{{ stat.count !== 1 ? 's' : '' }}</span>
          <span v-if="stat.version === latestVersion" class="au-distrib__badge">Latest</span>
        </div>
        <div v-if="versionStats.length === 0" class="au-distrib__empty">No agents found</div>
      </div>
      <div class="au-distrib__total">Total: {{ totalAgents }} agents</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgentUpdatesSidebar",
  props: {
    versionStats: { type: Array, default: () => [] },
    activeVersionFilter: { type: String, default: null },
    latestVersion: { type: String, default: null },
    totalAgents: { type: Number, default: 0 },
  },
  emits: ["filter-version"],
};
</script>

<style scoped>
.au-sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--sidebar-bg, #ffffff);
  border-right: 1px solid var(--border-color, #e8e8e8);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.au-sidebar-header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border-color, #e8e8e8);
}

.au-sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 8px 0;
}

.au-sidebar-desc {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  line-height: 1.5;
}

/* ── Block ── */
.au-sidebar-block {
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #e8e8e8);
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
  color: var(--text-primary, #1a1a2e);
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
  border-top: 1px solid var(--border-color, #e8e8e8);
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

/* ── Dark theme ── */
.body--dark .au-sidebar {
  --sidebar-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --primary-badge-bg: rgba(59,154,232,0.15);
  --primary-color: #3B9AE8;
}
</style>
