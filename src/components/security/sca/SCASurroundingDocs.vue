<template>
  <q-dialog :model-value="show" @update:model-value="$emit('close')" maximized>
    <q-card class="surrounding-card">
      <!-- Header -->
      <div class="surrounding-header">
        <div class="surrounding-header-left">
          <q-btn flat round dense icon="arrow_back" size="sm" @click="$emit('close')" />
          <q-icon name="explore" size="20px" color="primary" class="q-mx-sm" />
          <span class="surrounding-breadcrumb">Discover</span>
          <span class="surrounding-separator">|</span>
          <span class="surrounding-context">
            Context of {{ event?._id?.substring(0, 12) }}
          </span>
        </div>
        <q-btn flat round dense icon="close" size="sm" @click="$emit('close')" />
      </div>

      <!-- Controls -->
      <div class="surrounding-controls">
        <q-btn
          outlined dense no-caps size="sm"
          icon="arrow_upward"
          :label="`Load ${loadCount} newer documents`"
          :loading="loading"
          @click="$emit('load-more', 'newer')"
        />
        <q-space />
        <q-btn
          outlined dense no-caps size="sm"
          icon="filter_list"
          label="Add filter"
        />
      </div>

      <!-- Loading -->
      <q-inner-loading :showing="loading" />

      <!-- Document list -->
      <div v-if="!loading" class="surrounding-docs">
        <!-- Newer documents (in reverse chronological order) -->
        <div
          v-for="doc in newerDocs"
          :key="doc._id"
          class="surrounding-doc-row newer-row"
          :class="{ 'expanded': expandedId === doc._id }"
          @click="toggleExpand(doc._id)"
        >
          <div class="doc-row-summary">
            <span class="doc-timestamp">{{ formatTimestamp(doc._source) }}</span>
            <span class="doc-source-preview">{{ getSourcePreview(doc) }}</span>
          </div>
          <div v-if="expandedId === doc._id" class="doc-row-detail">
            <div class="expanded-header">
              <q-icon name="expand_more" size="16px" />
              <span>Expanded document</span>
              <q-space />
              <q-btn
                flat dense no-caps size="xs"
                label="View surrounding documents"
                class="text-primary"
                @click.stop="$emit('view-surrounding', doc)"
              />
              <q-btn
                flat dense no-caps size="xs"
                label="View single document"
                class="text-primary"
                @click.stop="$emit('view-single', doc)"
              />
            </div>
            <doc-fields-table :source="doc._source" :index="doc._index" />
          </div>
        </div>

        <!-- Anchor (target) document -->
        <div
          v-if="event"
          class="surrounding-doc-row anchor-row"
          :class="{ 'expanded': expandedId === event._id }"
          @click="toggleExpand(event._id)"
        >
          <div class="doc-row-summary">
            <span class="doc-timestamp">{{ formatTimestamp(event._source) }}</span>
            <span class="doc-source-preview anchor-text">{{ getSourcePreview(event) }}</span>
          </div>
          <div v-if="expandedId === event._id" class="doc-row-detail">
            <div class="expanded-header">
              <q-icon name="expand_more" size="16px" />
              <span>Expanded document</span>
            </div>
            <doc-fields-table :source="event._source" :index="event._index" />
          </div>
        </div>

        <!-- Older documents -->
        <div
          v-for="doc in olderDocs"
          :key="doc._id"
          class="surrounding-doc-row older-row"
          :class="{ 'expanded': expandedId === doc._id }"
          @click="toggleExpand(doc._id)"
        >
          <div class="doc-row-summary">
            <span class="doc-timestamp">{{ formatTimestamp(doc._source) }}</span>
            <span class="doc-source-preview">{{ getSourcePreview(doc) }}</span>
          </div>
          <div v-if="expandedId === doc._id" class="doc-row-detail">
            <div class="expanded-header">
              <q-icon name="expand_more" size="16px" />
              <span>Expanded document</span>
              <q-space />
              <q-btn
                flat dense no-caps size="xs"
                label="View surrounding documents"
                class="text-primary"
                @click.stop="$emit('view-surrounding', doc)"
              />
              <q-btn
                flat dense no-caps size="xs"
                label="View single document"
                class="text-primary"
                @click.stop="$emit('view-single', doc)"
              />
            </div>
            <doc-fields-table :source="doc._source" :index="doc._index" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SCAEvent } from "@/stores/sca";
import DocFieldsTable from "./SCADocFieldsTable.vue";

defineProps<{
  show: boolean;
  event: SCAEvent | null;
  newerDocs: SCAEvent[];
  olderDocs: SCAEvent[];
  loading: boolean;
  loadCount?: number;
}>();

defineEmits<{
  close: [];
  "load-more": [direction: "newer" | "older"];
  "view-surrounding": [event: SCAEvent];
  "view-single": [event: SCAEvent];
}>();

const expandedId = ref<string | null>(null);

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

function formatTimestamp(source: Record<string, unknown>): string {
  const ts = (source["@timestamp"] as string) ?? (source["timestamp"] as string);
  if (!ts) return "-";
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " @ " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
      hour12: false,
    });
  } catch {
    return ts;
  }
}

function getSourcePreview(doc: SCAEvent): string {
  const src = doc._source;
  const parts: string[] = [];

  const agentName = getNestedField(src, "agent.name");
  const agentId = getNestedField(src, "agent.id");
  if (agentName) parts.push(`agent: ${agentName}`);
  else if (agentId) parts.push(`agent.id: ${agentId}`);

  const ruleDesc = getNestedField(src, "rule.description");
  if (ruleDesc) parts.push(String(ruleDesc));

  const scaTitle = getNestedField(src, "data.sca.check.title");
  if (scaTitle) parts.push(String(scaTitle));

  return parts.join(" | ") || JSON.stringify(src).substring(0, 120);
}

function getNestedField(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
</script>

<style scoped>
.surrounding-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--mdm-bg, #f5f6fa);
}

.surrounding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.surrounding-header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.surrounding-breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-primary, #1976d2);
}

.surrounding-separator {
  color: var(--mdm-text-secondary, #666);
  margin: 0 8px;
}

.surrounding-context {
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
}

.surrounding-controls {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 8px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  background: var(--mdm-bg-card, #fff);
}

.surrounding-docs {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.surrounding-doc-row {
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  cursor: pointer;
  transition: background 0.15s;
}

.surrounding-doc-row:hover {
  background: var(--mdm-bg-hover, #f9f9fb);
}

.doc-row-summary {
  display: flex;
  gap: 16px;
  padding: 8px 20px;
  font-size: 13px;
  line-height: 1.5;
  align-items: flex-start;
}

.doc-timestamp {
  white-space: nowrap;
  color: var(--mdm-text-secondary, #666);
  min-width: 200px;
  flex-shrink: 0;
}

.doc-source-preview {
  color: var(--mdm-text-primary, #1a1a1a);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anchor-row {
  background: #e3f2fd;
  border-left: 4px solid var(--mdm-primary, #1976d2);
}

.anchor-row:hover {
  background: #bbdefb;
}

.anchor-text {
  font-weight: 600;
}

.doc-row-detail {
  padding: 0 20px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
}

.expanded-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  margin-bottom: 8px;
}

/* Dark mode */
.body--dark .surrounding-card {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .surrounding-header,
.body--dark .surrounding-controls {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .surrounding-context {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .anchor-row {
  background: #0d47a1;
  border-left-color: #42a5f5;
}

.body--dark .anchor-row:hover {
  background: #1565c0;
}

.body--dark .doc-row-detail {
  background: var(--mdm-bg, #0b0e14);
}
</style>
