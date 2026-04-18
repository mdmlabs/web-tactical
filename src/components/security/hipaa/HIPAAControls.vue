<template>
  <div class="hipaa-controls">
    <!-- Loading -->
    <div v-if="store.controlsLoading" class="hipaa-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading HIPAA standards...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="hipaa-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">Wazuh Indexer is not available.</p>
    </div>

    <template v-else>
      <!-- Header with search and hide toggle -->
      <div class="hipaa-controls-header">
        <span class="hipaa-controls-title">HIPAA</span>
        <div class="hipaa-controls-right-header">
          <span class="hipaa-controls-subtitle">Standards</span>
          <q-toggle
            v-model="store.controlsHideNoAlerts"
            label="Hide standards with no alerts"
            dense
            class="hipaa-controls-toggle"
          />
        </div>
      </div>

      <!-- Matrix layout -->
      <div class="hipaa-matrix-layout">
        <!-- Left sidebar: main standards -->
        <div class="hipaa-matrix-sidebar">
          <q-input
            v-model="store.controlsSearch"
            dense
            outlined
            placeholder="Filter standards..."
            clearable
            class="q-mb-sm"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>

          <div class="hipaa-main-standards">
            <div
              v-for="standard in mainStandards"
              :key="standard.id"
              class="hipaa-main-standard-item"
              :class="{ 'hipaa-main-standard-item--active': expandedStandard === standard.id }"
              @click="expandedStandard = expandedStandard === standard.id ? null : standard.id"
            >
              <q-badge
                :color="standard.totalCount > 0 ? 'pink-8' : 'grey-5'"
                :label="standard.totalCount.toLocaleString()"
                class="hipaa-main-standard-badge"
              />
              <span class="hipaa-main-standard-label">{{ standard.id }}</span>
            </div>
          </div>
        </div>

        <!-- Right content: sub-standards grid -->
        <div class="hipaa-matrix-content">
          <div v-if="!filteredSubStandards.length" class="text-grey text-center q-pa-lg">
            No standards found matching your criteria.
          </div>
          <div v-else class="hipaa-substandards-grid">
            <div
              v-for="sub in filteredSubStandards"
              :key="sub.id"
              class="hipaa-substandard-cell"
              @click="store.selectStandard(sub.id)"
            >
              <div class="hipaa-substandard-id">{{ sub.id }}</div>
              <div class="hipaa-substandard-title">{{ sub.title }}</div>
              <q-badge
                v-if="sub.count > 0"
                color="pink-8"
                :label="sub.count.toLocaleString()"
                class="hipaa-substandard-badge"
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
import { useHipaaStore } from "@/stores/hipaa";
import {
  HIPAA_STANDARDS,
  lookupHIPAAStandard,
  getParentStandardId,
} from "@/constants/hipaaRequirements";

const store = useHipaaStore();
const expandedStandard = ref<string | null>(null);

interface MainStandard {
  id: string;
  title: string;
  totalCount: number;
}

interface SubStandard {
  id: string;
  title: string;
  count: number;
  parentId: string;
}

// Build a map of standard -> count from store data
const countMap = computed(() => {
  const map = new Map<string, number>();
  for (const rc of store.standardCounts) {
    map.set(rc.standard, rc.doc_count);
  }
  return map;
});

// Main standards with totals
const mainStandards = computed<MainStandard[]>(() => {
  return HIPAA_STANDARDS.map((standard) => {
    // Sum counts for all sub-standards belonging to this parent
    let totalCount = 0;
    for (const [key, count] of countMap.value) {
      if (getParentStandardId(key) === standard.id) {
        totalCount += count;
      }
    }
    return {
      id: standard.id,
      title: standard.title,
      totalCount,
    };
  }).filter((standard) => {
    if (store.controlsHideNoAlerts && standard.totalCount === 0) return false;
    return true;
  });
});

// Build all sub-standards across all standards
const allSubStandards = computed<SubStandard[]>(() => {
  const subs: SubStandard[] = [];
  const q = store.controlsSearch.trim().toLowerCase();

  for (const standard of HIPAA_STANDARDS) {
    if (!standard.subStandards) continue;
    for (const sub of standard.subStandards) {
      const count = countMap.value.get(sub.id) ?? 0;

      // Apply hide no alerts filter
      if (store.controlsHideNoAlerts && count === 0) continue;

      // Apply search filter
      if (q) {
        const matchesId = sub.id.toLowerCase().includes(q);
        const matchesTitle = sub.title.toLowerCase().includes(q);
        const matchesParent = standard.id.includes(q) || standard.title.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesParent) continue;
      }

      subs.push({
        id: sub.id,
        title: sub.title,
        count,
        parentId: standard.id,
      });
    }
  }

  // Also add any sub-standards from indexer that aren't in the constants
  for (const [key, count] of countMap.value) {
    if (key.split(".").length > 2 && !subs.find((s) => s.id === key)) {
      const parentId = getParentStandardId(key);
      if (store.controlsHideNoAlerts && count === 0) continue;
      if (q) {
        const lookup = lookupHIPAAStandard(key);
        const matchesId = key.toLowerCase().includes(q);
        const matchesTitle = (lookup?.title ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle) continue;
      }
      subs.push({
        id: key,
        title: lookupHIPAAStandard(key)?.title ?? `Standard ${key}`,
        count,
        parentId,
      });
    }
  }

  // Sort by count descending
  subs.sort((a, b) => b.count - a.count);
  return subs;
});

const filteredSubStandards = computed<SubStandard[]>(() => {
  if (expandedStandard.value) {
    return allSubStandards.value.filter((s) => s.parentId === expandedStandard.value);
  }
  return allSubStandards.value;
});
</script>

<style scoped>
.hipaa-controls {
  padding: 20px;
  min-height: 400px;
}

.hipaa-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.hipaa-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.hipaa-controls-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.hipaa-controls-right-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hipaa-controls-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.hipaa-controls-toggle {
  font-size: 13px;
}

/* Matrix layout */
.hipaa-matrix-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  min-height: 400px;
}

/* Left sidebar */
.hipaa-matrix-sidebar {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 12px;
}

.hipaa-main-standards {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hipaa-main-standard-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.hipaa-main-standard-item:hover {
  background: rgba(37, 99, 235, 0.06);
}

.hipaa-main-standard-item--active {
  background: rgba(37, 99, 235, 0.1);
}

.hipaa-main-standard-badge {
  min-width: 40px;
  justify-content: center;
}

.hipaa-main-standard-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Right content grid */
.hipaa-matrix-content {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.hipaa-substandards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.hipaa-substandard-cell {
  position: relative;
  padding: 12px;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
}

.hipaa-substandard-cell:hover {
  border-color: var(--mdm-primary, #2563eb);
  background: rgba(37, 99, 235, 0.03);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.hipaa-substandard-id {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.hipaa-substandard-title {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hipaa-substandard-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 900px) {
  .hipaa-matrix-layout {
    grid-template-columns: 1fr;
  }

  .hipaa-main-standards {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .hipaa-controls-title,
.body--dark .hipaa-controls-subtitle,
.body--dark .hipaa-main-standard-label,
.body--dark .hipaa-substandard-id {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .hipaa-matrix-sidebar,
.body--dark .hipaa-matrix-content {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .hipaa-substandard-cell {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .hipaa-substandard-cell:hover {
  background: rgba(37, 99, 235, 0.1);
}
</style>
