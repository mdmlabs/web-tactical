<template>
  <q-drawer
    :model-value="store.showDetailPanel"
    side="right"
    :width="520"
    bordered
    overlay
    class="tsc-doc-drawer"
    @update:model-value="onDrawerToggle"
  >
    <div v-if="store.inspectedEvent" class="tsc-doc-content">
      <!-- Header -->
      <div class="tsc-doc-header">
        <span class="tsc-doc-title">Document Details</span>
        <div class="tsc-doc-actions">
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            label="View surrounding documents"
            icon="swap_vert"
            :loading="store.surroundingEventsLoading"
            @click="store.fetchSurroundingEvents()"
          />
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            label="View single document"
            icon="code"
            @click="store.showRawJson = !store.showRawJson"
          />
          <q-btn flat round dense icon="close" size="sm" @click="store.closeInspection()" />
        </div>
      </div>

      <q-separator />

      <!-- Tab navigation: Table / JSON -->
      <q-tabs
        v-model="viewTab"
        dense
        no-caps
        inline-label
        indicator-color="primary"
        active-color="primary"
        class="tsc-doc-tabs"
      >
        <q-tab name="table" label="Table" />
        <q-tab name="json" label="JSON" />
      </q-tabs>

      <q-separator />

      <!-- Raw JSON view -->
      <div v-if="viewTab === 'json'" class="tsc-doc-json">
        <pre class="tsc-json-pre">{{ formattedJson }}</pre>
      </div>

      <!-- Table view -->
      <div v-else class="tsc-doc-table-wrap">
        <q-list dense separator class="tsc-doc-field-list">
          <q-item
            v-for="([key, value], idx) in flatEntries"
            :key="idx"
            class="tsc-doc-field-item"
          >
            <q-item-section side class="tsc-doc-field-num">
              {{ idx + 1 }}
            </q-item-section>
            <q-item-section class="tsc-doc-field-key">
              {{ key }}
            </q-item-section>
            <q-item-section class="tsc-doc-field-value">
              {{ formatValue(value) }}
              <q-btn
                v-if="typeof value === 'string' && value.length > 0"
                flat
                round
                dense
                icon="content_copy"
                size="xs"
                class="tsc-doc-copy-btn"
                @click.stop="copyToClipboard(String(value))"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Surrounding documents section -->
      <template v-if="store.surroundingEvents.length > 0">
        <q-separator />
        <div class="tsc-doc-surrounding">
          <div class="tsc-doc-surrounding-title">Surrounding Documents</div>
          <q-list dense separator>
            <q-item
              v-for="(evt, idx) in store.surroundingEvents"
              :key="idx"
              clickable
              :class="{ 'tsc-surrounding-current': evt._id === store.inspectedEvent?._id }"
              @click="store.inspectDocument(evt)"
            >
              <q-item-section>
                <q-item-label class="tsc-surrounding-ts">
                  {{ formatTimestamp(getEventTs(evt)) }}
                </q-item-label>
                <q-item-label caption>
                  {{ getEventAgent(evt) }} - {{ getEventDesc(evt) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="evt._id === store.inspectedEvent?._id ? 'primary' : 'grey-4'"
                  :text-color="evt._id === store.inspectedEvent?._id ? 'white' : 'grey-8'"
                  :label="getEventLevel(evt)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { copyToClipboard } from "quasar";
import { useTscStore } from "@/stores/tsc";
import type { TSCEvent } from "@/types/tsc";

const store = useTscStore();
const viewTab = ref<"table" | "json">("table");

function onDrawerToggle(val: boolean) {
  if (!val) store.closeInspection();
}

// Flatten the event source for table display
const flatEntries = computed<[string, unknown][]>(() => {
  if (!store.inspectedEvent) return [];
  const src = store.inspectedEvent._source as Record<string, unknown>;
  const flat: Record<string, unknown> = {};

  // Add meta fields
  flat["@timestamp"] = src["@timestamp"] ?? src["timestamp"];
  flat["_index"] = store.inspectedEvent._index;

  // Flatten nested objects
  flattenObject(src, "", flat);

  return Object.entries(flat);
});

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  result: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (key === "@timestamp" && !prefix) continue; // already added
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value as Record<string, unknown>, fullKey, result);
    } else {
      result[fullKey] = value;
    }
  }
}

const formattedJson = computed(() => {
  if (!store.inspectedEvent) return "";
  return JSON.stringify(
    {
      _id: store.inspectedEvent._id,
      _index: store.inspectedEvent._index,
      _source: store.inspectedEvent._source,
    },
    null,
    2,
  );
});

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "-";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function formatTimestamp(ts: string): string {
  if (!ts) return "-";
  try {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " @ " +
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
      })
    );
  } catch {
    return ts;
  }
}

function getEventTs(evt: TSCEvent): string {
  const src = evt._source as Record<string, unknown>;
  return (src["@timestamp"] as string) ?? (src["timestamp"] as string) ?? "";
}

function getEventAgent(evt: TSCEvent): string {
  const src = evt._source as Record<string, unknown>;
  const agent = src.agent as Record<string, unknown> | undefined;
  return (agent?.name as string) ?? "";
}

function getEventDesc(evt: TSCEvent): string {
  const src = evt._source as Record<string, unknown>;
  const rule = src.rule as Record<string, unknown> | undefined;
  return (rule?.description as string) ?? "";
}

function getEventLevel(evt: TSCEvent): string {
  const src = evt._source as Record<string, unknown>;
  const rule = src.rule as Record<string, unknown> | undefined;
  return String(rule?.level ?? "");
}
</script>

<style scoped>
.tsc-doc-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tsc-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.tsc-doc-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.tsc-doc-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tsc-doc-tabs {
  padding: 0 16px;
}

.tsc-doc-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 36px;
}

/* Table view */
.tsc-doc-table-wrap {
  flex: 1;
  overflow-y: auto;
}

.tsc-doc-field-item {
  min-height: 32px;
  align-items: flex-start;
}

.tsc-doc-field-num {
  font-size: 11px;
  color: var(--mdm-text-secondary, #888);
  min-width: 28px;
  max-width: 28px;
}

.tsc-doc-field-key {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  min-width: 160px;
  max-width: 200px;
  word-break: break-all;
}

.tsc-doc-field-value {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  word-break: break-all;
  position: relative;
}

.tsc-doc-copy-btn {
  opacity: 0;
  transition: opacity 0.15s;
  position: absolute;
  right: 0;
  top: 0;
}

.tsc-doc-field-item:hover .tsc-doc-copy-btn {
  opacity: 0.7;
}

/* JSON view */
.tsc-doc-json {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.tsc-json-pre {
  font-size: 11px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 0;
}

/* Surrounding documents */
.tsc-doc-surrounding {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
}

.tsc-doc-surrounding-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 4px 16px 8px;
}

.tsc-surrounding-ts {
  font-size: 11px;
  font-family: monospace;
}

.tsc-surrounding-current {
  background: rgba(37, 99, 235, 0.08);
}

/* Dark mode */
.body--dark .tsc-doc-title,
.body--dark .tsc-doc-field-key,
.body--dark .tsc-doc-surrounding-title,
.body--dark .tsc-json-pre {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
