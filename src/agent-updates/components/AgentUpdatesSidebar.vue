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
          v-for="opt in versionOptions"
          :key="opt.value"
          class="au-distrib__item"
          :class="{ 'au-distrib__item--active': selectedVersion && selectedVersion.value === opt.value }"
          @click="$emit('select-version', opt)"
        >
          <span class="au-distrib__radio">
            <span v-if="selectedVersion && selectedVersion.value === opt.value" class="au-distrib__radio-dot"></span>
          </span>
          <span class="au-distrib__version">{{ opt.label }}</span>
          <span v-if="opt.isLatest" class="au-distrib__badge">Latest</span>
        </div>
        <div v-if="versionOptions.length === 0" class="au-distrib__empty">No versions available</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgentUpdatesSidebar",
  props: {
    versionOptions: { type: Array, default: () => [] },
    selectedVersion: { type: Object, default: null },
  },
  emits: ["select-version"],
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

.au-distrib__radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--radio-border, #d1d5db);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}

.au-distrib__item--active .au-distrib__radio {
  border-color: var(--primary-color, #1089d3);
}

.au-distrib__radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color, #1089d3);
}

.au-distrib__version {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
  flex: 1;
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
