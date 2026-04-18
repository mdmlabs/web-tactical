<template>
  <div class="tsc-controls">
    <!-- Loading -->
    <div v-if="store.controlsLoading" class="tsc-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading TSC criteria...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="tsc-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">Wazuh Indexer is not available.</p>
    </div>

    <template v-else>
      <!-- Header with search and hide toggle -->
      <div class="tsc-controls-header">
        <span class="tsc-controls-title">TSC / SOC 2</span>
        <div class="tsc-controls-right-header">
          <span class="tsc-controls-subtitle">Criteria</span>
          <q-toggle
            v-model="store.controlsHideNoAlerts"
            label="Hide criteria with no alerts"
            dense
            class="tsc-controls-toggle"
          />
        </div>
      </div>

      <!-- Matrix layout -->
      <div class="tsc-matrix-layout">
        <!-- Left sidebar: principles -->
        <div class="tsc-matrix-sidebar">
          <q-input
            v-model="store.controlsSearch"
            dense
            outlined
            placeholder="Filter criteria..."
            clearable
            class="q-mb-sm"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>

          <div class="tsc-main-reqs">
            <div
              v-for="principle in principleItems"
              :key="principle.id"
              class="tsc-main-req-item"
              :class="{ 'tsc-main-req-item--active': expandedPrinciple === principle.id }"
              @click="expandedPrinciple = expandedPrinciple === principle.id ? null : principle.id"
            >
              <q-badge
                :color="principle.totalCount > 0 ? 'pink-8' : 'grey-5'"
                :label="principle.totalCount.toLocaleString()"
                class="tsc-main-req-badge"
              />
              <span class="tsc-main-req-label">{{ principle.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right content: criteria grid -->
        <div class="tsc-matrix-content">
          <div v-if="!filteredCriteriaItems.length" class="text-grey text-center q-pa-lg">
            No criteria found matching your criteria.
          </div>
          <div v-else class="tsc-subreqs-grid">
            <div
              v-for="item in filteredCriteriaItems"
              :key="item.id"
              class="tsc-subreq-cell"
              @click="store.selectCriteria(item.id)"
            >
              <div class="tsc-subreq-id">{{ item.id }}</div>
              <div class="tsc-subreq-title">{{ item.title }}</div>
              <q-badge
                v-if="item.count > 0"
                color="pink-8"
                :label="item.count.toLocaleString()"
                class="tsc-subreq-badge"
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
import { useTscStore } from "@/stores/tsc";
import {
  TSC_PRINCIPLES,
  lookupTSCCriteria,
  getTSCPrinciple,
} from "@/constants/tscRequirements";

const store = useTscStore();
const expandedPrinciple = ref<string | null>(null);

interface PrincipleItem {
  id: string;
  label: string;
  totalCount: number;
}

interface CriteriaItem {
  id: string;
  title: string;
  count: number;
  principleId: string;
}

// Build a map of criteria -> count from store data
const countMap = computed(() => {
  const map = new Map<string, number>();
  for (const rc of store.criteriaCounts) {
    map.set(rc.criteria, rc.doc_count);
  }
  return map;
});

// Principles with totals
const principleItems = computed<PrincipleItem[]>(() => {
  return TSC_PRINCIPLES.map((principle) => {
    let totalCount = 0;
    if (principle.criteria) {
      for (const c of principle.criteria) {
        totalCount += countMap.value.get(c.id) ?? 0;
      }
    }
    // Also count any criteria from indexer not in constants but matching this principle
    for (const [key, count] of countMap.value) {
      const principleName = getTSCPrinciple(key);
      if (principleName === principle.id) {
        const inConstants = principle.criteria?.some((c) => c.id === key);
        if (!inConstants) {
          totalCount += count;
        }
      }
    }
    return {
      id: principle.id,
      label: principle.id,
      totalCount,
    };
  }).filter((p) => {
    if (store.controlsHideNoAlerts && p.totalCount === 0) return false;
    return true;
  });
});

// Build all criteria items across all principles
const allCriteriaItems = computed<CriteriaItem[]>(() => {
  const items: CriteriaItem[] = [];
  const q = store.controlsSearch.trim().toLowerCase();

  for (const principle of TSC_PRINCIPLES) {
    if (!principle.criteria) continue;
    for (const c of principle.criteria) {
      const count = countMap.value.get(c.id) ?? 0;

      // Apply hide no alerts filter
      if (store.controlsHideNoAlerts && count === 0) continue;

      // Apply search filter
      if (q) {
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesPrinciple = principle.id.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesPrinciple) continue;
      }

      items.push({
        id: c.id,
        title: c.title,
        count,
        principleId: principle.id,
      });
    }
  }

  // Also add any criteria from indexer that aren't in the constants
  for (const [key, count] of countMap.value) {
    if (!items.find((i) => i.id === key)) {
      const principleId = getTSCPrinciple(key);
      if (store.controlsHideNoAlerts && count === 0) continue;
      if (q) {
        const lookup = lookupTSCCriteria(key);
        const matchesId = key.toLowerCase().includes(q);
        const matchesTitle = (lookup?.title ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle) continue;
      }
      items.push({
        id: key,
        title: lookupTSCCriteria(key)?.title ?? `Criteria ${key}`,
        count,
        principleId,
      });
    }
  }

  // Sort by count descending
  items.sort((a, b) => b.count - a.count);
  return items;
});

const filteredCriteriaItems = computed<CriteriaItem[]>(() => {
  if (expandedPrinciple.value) {
    return allCriteriaItems.value.filter((i) => i.principleId === expandedPrinciple.value);
  }
  return allCriteriaItems.value;
});
</script>

<style scoped>
.tsc-controls {
  padding: 20px;
  min-height: 400px;
}

.tsc-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.tsc-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.tsc-controls-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.tsc-controls-right-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tsc-controls-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.tsc-controls-toggle {
  font-size: 13px;
}

/* Matrix layout */
.tsc-matrix-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  min-height: 400px;
}

/* Left sidebar */
.tsc-matrix-sidebar {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 12px;
}

.tsc-main-reqs {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tsc-main-req-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.tsc-main-req-item:hover {
  background: rgba(37, 99, 235, 0.06);
}

.tsc-main-req-item--active {
  background: rgba(37, 99, 235, 0.1);
}

.tsc-main-req-badge {
  min-width: 40px;
  justify-content: center;
}

.tsc-main-req-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Right content grid */
.tsc-matrix-content {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.tsc-subreqs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.tsc-subreq-cell {
  position: relative;
  padding: 12px;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
}

.tsc-subreq-cell:hover {
  border-color: var(--mdm-primary, #2563eb);
  background: rgba(37, 99, 235, 0.03);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.tsc-subreq-id {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.tsc-subreq-title {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tsc-subreq-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 900px) {
  .tsc-matrix-layout {
    grid-template-columns: 1fr;
  }

  .tsc-main-reqs {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .tsc-controls-title,
.body--dark .tsc-controls-subtitle,
.body--dark .tsc-main-req-label,
.body--dark .tsc-subreq-id {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .tsc-matrix-sidebar,
.body--dark .tsc-matrix-content {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .tsc-subreq-cell {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .tsc-subreq-cell:hover {
  background: rgba(37, 99, 235, 0.1);
}
</style>
