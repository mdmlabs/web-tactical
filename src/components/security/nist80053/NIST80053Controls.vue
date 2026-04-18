<template>
  <div class="nist-controls">
    <!-- Loading -->
    <div v-if="store.controlsLoading" class="nist-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading NIST 800-53 controls...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="nist-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">Wazuh Indexer is not available.</p>
    </div>

    <template v-else>
      <!-- Header with search and hide toggle -->
      <div class="nist-controls-header">
        <span class="nist-controls-title">NIST 800-53</span>
        <div class="nist-controls-right-header">
          <span class="nist-controls-subtitle">Controls</span>
          <q-toggle
            v-model="store.controlsHideNoAlerts"
            label="Hide controls with no alerts"
            dense
            class="nist-controls-toggle"
          />
        </div>
      </div>

      <!-- Matrix layout -->
      <div class="nist-matrix-layout">
        <!-- Left sidebar: control families -->
        <div class="nist-matrix-sidebar">
          <q-input
            v-model="store.controlsSearch"
            dense
            outlined
            placeholder="Filter controls..."
            clearable
            class="q-mb-sm"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>

          <div class="nist-main-families">
            <div
              v-for="family in mainFamilies"
              :key="family.id"
              class="nist-main-family-item"
              :class="{ 'nist-main-family-item--active': expandedFamily === family.id }"
              @click="expandedFamily = expandedFamily === family.id ? null : family.id"
            >
              <q-badge
                :color="family.totalCount > 0 ? 'pink-8' : 'grey-5'"
                :label="family.totalCount.toLocaleString()"
                class="nist-main-family-badge"
              />
              <span class="nist-main-family-label">{{ family.id }}</span>
            </div>
          </div>
        </div>

        <!-- Right content: controls grid -->
        <div class="nist-matrix-content">
          <div v-if="!filteredControls.length" class="text-grey text-center q-pa-lg">
            No controls found matching your criteria.
          </div>
          <div v-else class="nist-controls-grid">
            <div
              v-for="ctrl in filteredControls"
              :key="ctrl.id"
              class="nist-control-cell"
              @click="store.selectControl(ctrl.id)"
            >
              <div class="nist-control-id">{{ ctrl.id }}</div>
              <div class="nist-control-title">{{ ctrl.title }}</div>
              <q-badge
                v-if="ctrl.count > 0"
                color="pink-8"
                :label="ctrl.count.toLocaleString()"
                class="nist-control-badge"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useNist80053Store } from "@/stores/nist80053";
import {
  NIST_800_53_CONTROLS,
  lookupNIST80053Control,
  getControlFamily,
} from "@/constants/nist80053Requirements";

const store = useNist80053Store();
const expandedFamily = ref<string | null>(null);

interface MainFamily {
  id: string;
  title: string;
  totalCount: number;
}

interface ControlItem {
  id: string;
  title: string;
  count: number;
  familyId: string;
}

// Build a map of control -> count from store data
const countMap = computed(() => {
  const map = new Map<string, number>();
  for (const rc of store.controlCounts) {
    map.set(rc.control, rc.doc_count);
  }
  return map;
});

// Main families with totals
const mainFamilies = computed<MainFamily[]>(() => {
  return NIST_800_53_CONTROLS.map((family) => {
    // Sum counts for all controls belonging to this family
    let totalCount = 0;
    for (const [key, count] of countMap.value) {
      if (getControlFamily(key) === family.id) {
        totalCount += count;
      }
    }
    return {
      id: family.id,
      title: family.title,
      totalCount,
    };
  }).filter((family) => {
    if (store.controlsHideNoAlerts && family.totalCount === 0) return false;
    return true;
  });
});

// Build all controls across all families
const allControls = computed<ControlItem[]>(() => {
  const ctrls: ControlItem[] = [];
  const q = store.controlsSearch.trim().toLowerCase();

  for (const family of NIST_800_53_CONTROLS) {
    if (!family.controls) continue;
    for (const ctrl of family.controls) {
      const count = countMap.value.get(ctrl.id) ?? 0;

      // Apply hide no alerts filter
      if (store.controlsHideNoAlerts && count === 0) continue;

      // Apply search filter
      if (q) {
        const matchesId = ctrl.id.toLowerCase().includes(q);
        const matchesTitle = ctrl.title.toLowerCase().includes(q);
        const matchesParent = family.id.toLowerCase().includes(q) || family.title.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesParent) continue;
      }

      ctrls.push({
        id: ctrl.id,
        title: ctrl.title,
        count,
        familyId: family.id,
      });
    }
  }

  // Also add any controls from indexer that aren't in the constants
  for (const [key, count] of countMap.value) {
    if (key.includes("-") && !ctrls.find((c) => c.id === key)) {
      const familyId = getControlFamily(key);
      if (store.controlsHideNoAlerts && count === 0) continue;
      if (q) {
        const lookup = lookupNIST80053Control(key);
        const matchesId = key.toLowerCase().includes(q);
        const matchesTitle = (lookup?.title ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle) continue;
      }
      ctrls.push({
        id: key,
        title: lookupNIST80053Control(key)?.title ?? `Control ${key}`,
        count,
        familyId,
      });
    }
  }

  // Sort by count descending
  ctrls.sort((a, b) => b.count - a.count);
  return ctrls;
});

const filteredControls = computed<ControlItem[]>(() => {
  if (expandedFamily.value) {
    return allControls.value.filter((c) => c.familyId === expandedFamily.value);
  }
  return allControls.value;
});
</script>

<style scoped>
.nist-controls {
  padding: 20px;
  min-height: 400px;
}

.nist-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.nist-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.nist-controls-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.nist-controls-right-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nist-controls-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.nist-controls-toggle {
  font-size: 13px;
}

/* Matrix layout */
.nist-matrix-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  min-height: 400px;
}

/* Left sidebar */
.nist-matrix-sidebar {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 12px;
}

.nist-main-families {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nist-main-family-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.nist-main-family-item:hover {
  background: rgba(37, 99, 235, 0.06);
}

.nist-main-family-item--active {
  background: rgba(37, 99, 235, 0.1);
}

.nist-main-family-badge {
  min-width: 40px;
  justify-content: center;
}

.nist-main-family-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Right content grid */
.nist-matrix-content {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.nist-controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.nist-control-cell {
  position: relative;
  padding: 12px;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
}

.nist-control-cell:hover {
  border-color: var(--mdm-primary, #2563eb);
  background: rgba(37, 99, 235, 0.03);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.nist-control-id {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.nist-control-title {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nist-control-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 900px) {
  .nist-matrix-layout {
    grid-template-columns: 1fr;
  }

  .nist-main-families {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .nist-controls-title,
.body--dark .nist-controls-subtitle,
.body--dark .nist-main-family-label,
.body--dark .nist-control-id {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .nist-matrix-sidebar,
.body--dark .nist-matrix-content {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .nist-control-cell {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .nist-control-cell:hover {
  background: rgba(37, 99, 235, 0.1);
}
</style>
