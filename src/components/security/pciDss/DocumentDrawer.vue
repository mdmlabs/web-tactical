<template>
  <q-drawer
    :model-value="store.showDetailPanel"
    side="right"
    :width="520"
    bordered
    overlay
    class="pcidss-doc-drawer"
    @update:model-value="onDrawerToggle"
  >
    <div v-if="store.inspectedEvent" class="pcidss-doc-content">
      <!-- Header -->
      <div class="pcidss-doc-header">
        <span class="pcidss-doc-title">Document Details</span>
        <div class="pcidss-doc-actions">
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
        class="pcidss-doc-tabs"
      >
        <q-tab name="table" label="Table" />
        <q-tab name="json" label="JSON" />
      </q-tabs>

      <q-separator />

      <!-- Raw JSON view -->
      <div v-if="viewTab === 'json'" class="pcidss-doc-json">
        <pre class="pcidss-json-pre">{{ formattedJson }}</pre>
      </div>

      <!-- Table view -->
      <div v-else class="pcidss-doc-table-wrap">
        <q-list dense separator class="pcidss-doc-field-list">
          <q-item
            v-for="([key, value], idx) in flatEntries"
            :key="idx"
            class="pcidss-doc-field-item"
          >
            <q-item-section side class="pcidss-doc-field-num">
              {{ idx + 1 }}
            </q-item-section>
            <q-item-section class="pcidss-doc-field-key">
              {{ key }}
            </q-item-section>
            <q-item-section class="pcidss-doc-field-value">
              {{ formatValue(value) }}
              <q-btn
                v-if="typeof value === 'string' && value.length > 0"
                flat
                round
                dense
                icon="content_copy"
                size="xs"
                class="pcidss-doc-copy-btn"
                @click.stop="copyToClipboard(String(value))"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Surrounding documents section -->
      <template v-if="store.surroundingEvents.length > 0">
        <q-separator />
        <div class="pcidss-doc-surrounding">
          <div class="pcidss-doc-surrounding-title">Surrounding Documents</div>
          <q-list dense separator>
            <q-item
              v-for="(evt, idx) in store.surroundingEvents"
              :key="idx"
              clickable
              :class="{ 'pcidss-surrounding-current': evt._id === store.inspectedEvent?._id }"
              @click="store.inspectDocument(evt)"
            >
              <q-item-section>
                <q-item-label class="pcidss-surrounding-ts">
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
import { usePciDssStore } from "@/stores/pciDss";
import type { PCIDSSEvent } from "@/types/pciDss";

const store = usePciDssStore();
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

function getEventTs(evt: PCIDSSEvent): string {
  const src = evt._source as Record<string, unknown>;
  return (src["@timestamp"] as string) ?? (src["timestamp"] as string) ?? "";
}

function getEventAgent(evt: PCIDSSEvent): string {
  const src = evt._source as Record<string, unknown>;
  const agent = src.agent as Record<string, unknown> | undefined;
  return (agent?.name as string) ?? "";
}

function getEventDesc(evt: PCIDSSEvent): string {
  const src = evt._source as Record<string, unknown>;
  const rule = src.rule as Record<string, unknown> | undefined;
  return (rule?.description as string) ?? "";
}

function getEventLevel(evt: PCIDSSEvent): string {
  const src = evt._source as Record<string, unknown>;
  const rule = src.rule as Record<string, unknown> | undefined;
  return String(rule?.level ?? "");
}
</script>

<style scoped>
.pcidss-doc-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pcidss-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.pcidss-doc-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-doc-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pcidss-doc-tabs {
  padding: 0 16px;
}

.pcidss-doc-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 36px;
}

/* Table view */
.pcidss-doc-table-wrap {
  flex: 1;
  overflow-y: auto;
}

.pcidss-doc-field-item {
  min-height: 32px;
  align-items: flex-start;
}

.pcidss-doc-field-num {
  font-size: 11px;
  color: var(--mdm-text-secondary, #888);
  min-width: 28px;
  max-width: 28px;
}

.pcidss-doc-field-key {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  min-width: 160px;
  max-width: 200px;
  word-break: break-all;
}

.pcidss-doc-field-value {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  word-break: break-all;
  position: relative;
}

.pcidss-doc-copy-btn {
  opacity: 0;
  transition: opacity 0.15s;
  position: absolute;
  right: 0;
  top: 0;
}

.pcidss-doc-field-item:hover .pcidss-doc-copy-btn {
  opacity: 0.7;
}

/* JSON view */
.pcidss-doc-json {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.pcidss-json-pre {
  font-size: 11px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 0;
}

/* Surrounding documents */
.pcidss-doc-surrounding {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
}

.pcidss-doc-surrounding-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 4px 16px 8px;
}

.pcidss-surrounding-ts {
  font-size: 11px;
  font-family: monospace;
}

.pcidss-surrounding-current {
  background: rgba(37, 99, 235, 0.08);
}

/* Dark mode */
.body--dark .pcidss-doc-title,
.body--dark .pcidss-doc-field-key,
.body--dark .pcidss-doc-surrounding-title,
.body--dark .pcidss-json-pre {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
