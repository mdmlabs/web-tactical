<template>
  <div class="gdpr-controls">
    <!-- Loading -->
    <div v-if="store.controlsLoading" class="gdpr-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading GDPR articles...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="gdpr-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">MDM-Lab Indexer is not available.</p>
    </div>

    <template v-else>
      <!-- Header with search and hide toggle -->
      <div class="gdpr-controls-header">
        <span class="gdpr-controls-title">GDPR</span>
        <div class="gdpr-controls-right-header">
          <span class="gdpr-controls-subtitle">Articles</span>
          <q-toggle
            v-model="store.controlsHideNoAlerts"
            label="Hide articles with no alerts"
            dense
            class="gdpr-controls-toggle"
          />
        </div>
      </div>

      <!-- Matrix layout -->
      <div class="gdpr-matrix-layout">
        <!-- Left sidebar: main articles -->
        <div class="gdpr-matrix-sidebar">
          <q-input
            v-model="store.controlsSearch"
            dense
            outlined
            placeholder="Filter articles..."
            clearable
            class="q-mb-sm"
          >
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>

          <div class="gdpr-main-articles">
            <div
              v-for="article in mainArticles"
              :key="article.id"
              class="gdpr-main-article-item"
              :class="{ 'gdpr-main-article-item--active': expandedArticle === article.id }"
              @click="expandedArticle = expandedArticle === article.id ? null : article.id"
            >
              <q-badge
                :color="article.totalCount > 0 ? 'pink-8' : 'grey-5'"
                :label="article.totalCount.toLocaleString()"
                class="gdpr-main-article-badge"
              />
              <span class="gdpr-main-article-label">Article {{ article.id }}</span>
            </div>
          </div>
        </div>

        <!-- Right content: sub-articles grid -->
        <div class="gdpr-matrix-content">
          <div v-if="!filteredSubArticles.length" class="text-grey text-center q-pa-lg">
            No articles found matching your criteria.
          </div>
          <div v-else class="gdpr-subarticles-grid">
            <div
              v-for="sub in filteredSubArticles"
              :key="sub.id"
              class="gdpr-subarticle-cell"
              @click="store.selectArticle(sub.id)"
            >
              <div class="gdpr-subarticle-id">{{ sub.id }}</div>
              <div class="gdpr-subarticle-title">{{ sub.title }}</div>
              <q-badge
                v-if="sub.count > 0"
                color="pink-8"
                :label="sub.count.toLocaleString()"
                class="gdpr-subarticle-badge"
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
import { useGdprStore } from "@/stores/gdpr";
import {
  GDPR_ARTICLES,
  lookupGDPRArticle,
} from "@/constants/gdprRequirements";

const store = useGdprStore();
const expandedArticle = ref<string | null>(null);

interface MainArticle {
  id: string;
  title: string;
  totalCount: number;
}

interface SubArticle {
  id: string;
  title: string;
  count: number;
  parentId: string;
}

// Build a map of article -> count from store data
const countMap = computed(() => {
  const map = new Map<string, number>();
  for (const rc of store.articleCounts) {
    map.set(rc.article, rc.doc_count);
  }
  return map;
});

// Main articles with totals
const mainArticles = computed<MainArticle[]>(() => {
  return GDPR_ARTICLES.map((article) => {
    // Sum counts for all sub-articles belonging to this parent
    let totalCount = 0;
    for (const [key, count] of countMap.value) {
      if (key.split(".")[0] === article.id) {
        totalCount += count;
      }
    }
    return {
      id: article.id,
      title: article.title,
      totalCount,
    };
  }).filter((article) => {
    if (store.controlsHideNoAlerts && article.totalCount === 0) return false;
    return true;
  });
});

// Build all sub-articles across all articles
const allSubArticles = computed<SubArticle[]>(() => {
  const subs: SubArticle[] = [];
  const q = store.controlsSearch.trim().toLowerCase();

  for (const article of GDPR_ARTICLES) {
    if (!article.subArticles) continue;
    for (const sub of article.subArticles) {
      const count = countMap.value.get(sub.id) ?? 0;

      // Apply hide no alerts filter
      if (store.controlsHideNoAlerts && count === 0) continue;

      // Apply search filter
      if (q) {
        const matchesId = sub.id.toLowerCase().includes(q);
        const matchesTitle = sub.title.toLowerCase().includes(q);
        const matchesParent = article.id.includes(q) || article.title.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesParent) continue;
      }

      subs.push({
        id: sub.id,
        title: sub.title,
        count,
        parentId: article.id,
      });
    }
  }

  // Also add any sub-articles from indexer that aren't in the constants
  for (const [key, count] of countMap.value) {
    if (key.includes(".") && !subs.find((s) => s.id === key)) {
      const parentId = key.split(".")[0];
      if (store.controlsHideNoAlerts && count === 0) continue;
      if (q) {
        const lookup = lookupGDPRArticle(key);
        const matchesId = key.toLowerCase().includes(q);
        const matchesTitle = (lookup?.title ?? "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle) continue;
      }
      subs.push({
        id: key,
        title: lookupGDPRArticle(key)?.title ?? `Article ${key}`,
        count,
        parentId,
      });
    }
  }

  // Sort by count descending
  subs.sort((a, b) => b.count - a.count);
  return subs;
});

const filteredSubArticles = computed<SubArticle[]>(() => {
  if (expandedArticle.value) {
    return allSubArticles.value.filter((s) => s.parentId === expandedArticle.value);
  }
  return allSubArticles.value;
});
</script>

<style scoped>
.gdpr-controls {
  padding: 20px;
  min-height: 400px;
}

.gdpr-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.gdpr-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.gdpr-controls-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.gdpr-controls-right-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gdpr-controls-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.gdpr-controls-toggle {
  font-size: 13px;
}

/* Matrix layout */
.gdpr-matrix-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  min-height: 400px;
}

/* Left sidebar */
.gdpr-matrix-sidebar {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 12px;
}

.gdpr-main-articles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gdpr-main-article-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.gdpr-main-article-item:hover {
  background: rgba(37, 99, 235, 0.06);
}

.gdpr-main-article-item--active {
  background: rgba(37, 99, 235, 0.1);
}

.gdpr-main-article-badge {
  min-width: 40px;
  justify-content: center;
}

.gdpr-main-article-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Right content grid */
.gdpr-matrix-content {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius-lg, 8px);
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.gdpr-subarticles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.gdpr-subarticle-cell {
  position: relative;
  padding: 12px;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 60px;
}

.gdpr-subarticle-cell:hover {
  border-color: var(--mdm-primary, #2563eb);
  background: rgba(37, 99, 235, 0.03);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.gdpr-subarticle-id {
  font-size: 13px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.gdpr-subarticle-title {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gdpr-subarticle-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 900px) {
  .gdpr-matrix-layout {
    grid-template-columns: 1fr;
  }

  .gdpr-main-articles {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .gdpr-controls-title,
.body--dark .gdpr-controls-subtitle,
.body--dark .gdpr-main-article-label,
.body--dark .gdpr-subarticle-id {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .gdpr-matrix-sidebar,
.body--dark .gdpr-matrix-content {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .gdpr-subarticle-cell {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .gdpr-subarticle-cell:hover {
  background: rgba(37, 99, 235, 0.1);
}
</style>
