<template>
  <div class="pcidss-controls">
    <!-- Loading -->
    <div v-if="store.controlsLoading" class="pcidss-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading PCI DSS requirements...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="pcidss-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">MDM-Lab Indexer is not available.</p>
    </div>

    <template v-else>
      <!-- Header with search and hide toggle -->
      <div class="pcidss-controls-header">
        <span class="pcidss-controls-title">PCI DSS</span>
        <div class="pcidss-controls-right-header">
          <span class="pcidss-controls-subtitle">Requirements</span>
          <q-toggle
            v-model="store.controlsHideNoAlerts"
            label="Hide requirements with no alerts"
            dense
            class="pcidss-controls-toggle"
          />
        </div>
      </div>

      <!-- Matrix layout -->
      <div class="pcidss-matrix-layout">
        <!-- Left sidebar: main requirements -->
        <div class="pcidss-matrix-sidebar">
          <q-input
            v-model="store.controlsSearch"
            dense
            outlined
            placeholder="Filter requirements..."
            clearable
            class="q-mb-sm"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>

          <div class="pcidss-main-reqs">
            <div
              v-for="req in mainRequirements"
              :key="req.id"
              class="pcidss-main-req-item"
              :class="{ 'pcidss-main-req-item--active': expandedReq === req.id }"
              @click="expandedReq = expandedReq === req.id ? null : req.id"
            >
              <q-badge
                :color="req.totalCount > 0 ? 'pink-8' : 'grey-5'"
                :label="req.totalCount.toLocaleString()"
                class="pcidss-main-req-badge"
              />
              <span class="pcidss-main-req-label">Requirement {{ req.id }}</span>
            </div>
          </div>
        </div>

        <!-- Right content: sub-requirements grid -->
        <div class="pcidss-matrix-content">
          <div v-if="!filteredSubRequirements.length" class="text-grey text-center q-pa-lg">
            No requirements found matching your criteria.
          </div>
          <div v-else class="pcidss-subreqs-grid">
            <div
              v-for="sub in filteredSubRequirements"
              :key="sub.id"
              class="pcidss-subreq-cell"
              @click="store.selectRequirement(sub.id)"
            >
              <div class="pcidss-subreq-id">{{ sub.id }}</div>
              <div class="pcidss-subreq-title">{{ sub.title }}</div>
              <q-badge
                v-if="sub.count > 0"
                color="pink-8"
                :label="sub.count.toLocaleString()"
                class="pcidss-subreq-badge"
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
import { usePciDssStore } from "@/stores/pciDss";
import {
  PCI_DSS_REQUIREMENTS,
  lookupPCIDSSRequirement,
} from "@/constants/pciDssRequirements";

const store = usePciDssStore();
const expandedReq = ref<string | null>(null);

interface MainReq {
  id: string;
  title: string;
  totalCount: number;
}

interface SubReq {
  id: string;
  title: string;
  count: number;
  parentId: string;
}

// Build a map of requirement -> count from store data
const countMap = computed(() => {
  const map = new Map<string, number>();
  for (const rc of store.requirementCounts) {
    map.set(rc.requirement, rc.doc_count);
  }
  return map;
});

// Main requirements with totals
const mainRequirements = computed<MainReq[]>(() => {
  return PCI_DSS_REQUIREMENTS.map((req) => {
    // Sum counts for all sub-requirements belonging to this parent
    let totalCount = 0;
    for (const [key, count] of countMap.value) {
      if (key.split(".")[0] === req.id) {
        totalCount += count;
      }
    }
    return {
      id: req.id,
      title: req.title,
      totalCount,
    };
  }).filter((req) => {
    if (store.controlsHideNoAlerts && req.totalCount === 0) return false;
    return true;
  });
});

// Build all sub-requirements across all requirements
const allSubRequirements = computed<SubReq[]>(() => {
  const subs: SubReq[] = [];
  const q = store.controlsSearch.trim().toLowerCase();

  for (const req of PCI_DSS_REQUIREMENTS) {
    if (!req.subRequirements) continue;
    for (const sub of req.subRequirements) {
      const count = countMap.value.get(sub.id) ?? 0;

      // Apply hide no alerts filter
      if (store.controlsHideNoAlerts && count === 0) continue;

      // Apply search filter
      if (q) {
        const matchesId = sub.id.toLowerCase().includes(q);
        const matchesTitle = sub.title.toLowerCase().includes(q);
        const matchesParent = req.id.includes(q) || req.title.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesParent) continue;
      }

      subs.push({
        id: sub.id,
        title: sub.title,
        count,
        parentId: req.id,
      });
    }
  }

  // Also add any sub-requirements from indexer that aren't in the constants
  for (const [key, count] of countMap.value) {
    if (key.includes(".") && !subs.find((s) => s.id === key)) {
      const parentId = key.split(".")[0];
      if (store.controlsHideNoAlerts && count === 0) continue;
      if (q) {
        const lookup = lookupPCIDSSRequirement(key);
        const matchesId = key.toLowerCase().includes(q);
        const matchesTitle = (lookup?.title ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle) continue;
      }
      subs.push({
        id: key,
        title: lookupPCIDSSRequirement(key)?.title ?? `Requirement ${key}`,
        count,
        parentId,
      });
    }
  }

  // Sort by count descending
  subs.sort((a, b) => b.count - a.count);
  return subs;
});

const filteredSubRequirements = computed<SubReq[]>(() => {
  if (expandedReq.value) {
    return allSubRequirements.value.filter((s) => s.parentId === expandedReq.value);
  }
  return allSubRequirements.value;
});
</script>

<style scoped>
.pcidss-controls {
  padding: 20px;
  min-height: 400px;
}

.pcidss-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.pcidss-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.pcidss-controls-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-controls-right-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pcidss-controls-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-controls-toggle {
  font-size: 13px;
}

/* Matrix layout */
.pcidss-matrix-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  min-height: 400px;
}

/* Left sidebar */
.pcidss-matrix-sidebar {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 12px;
}

.pcidss-main-reqs {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pcidss-main-req-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.pcidss-main-req-item:hover {
  background: rgba(37, 99, 235, 0.06);
}

.pcidss-main-req-item--active {
  background: rgba(37, 99, 235, 0.1);
}

.pcidss-main-req-badge {
  min-width: 40px;
  justify-content: center;
}

.pcidss-main-req-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Right content grid */
.pcidss-matrix-content {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.pcidss-subreqs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.pcidss-subreq-cell {
  position: relative;
  padding: 12px;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
}

.pcidss-subreq-cell:hover {
  border-color: var(--mdm-primary, #2563eb);
  background: rgba(37, 99, 235, 0.03);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.pcidss-subreq-id {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.pcidss-subreq-title {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pcidss-subreq-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 900px) {
  .pcidss-matrix-layout {
    grid-template-columns: 1fr;
  }

  .pcidss-main-reqs {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .pcidss-controls-title,
.body--dark .pcidss-controls-subtitle,
.body--dark .pcidss-main-req-label,
.body--dark .pcidss-subreq-id {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .pcidss-matrix-sidebar,
.body--dark .pcidss-matrix-content {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .pcidss-subreq-cell {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .pcidss-subreq-cell:hover {
  background: rgba(37, 99, 235, 0.1);
}
</style>
