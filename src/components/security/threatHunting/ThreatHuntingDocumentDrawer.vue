<template>
  <q-drawer
    :model-value="store.showDetailPanel"
    side="right"
    :width="520"
    bordered
    overlay
    class="th-doc-drawer"
    @update:model-value="onDrawerToggle"
  >
    <div v-if="store.inspectedEvent" class="th-doc-content">
      <!-- Header -->
      <div class="th-doc-header">
        <span class="th-doc-title">Document Details</span>
        <div class="th-doc-actions">
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
        class="th-doc-tabs"
      >
        <q-tab name="table" label="Table" />
        <q-tab name="json" label="JSON" />
      </q-tabs>

      <q-separator />

      <!-- Raw JSON view -->
      <div v-if="viewTab === 'json'" class="th-doc-json">
        <pre class="th-json-pre">{{ formattedJson }}</pre>
      </div>

      <!-- Table view -->
      <div v-else class="th-doc-table-wrap">
        <q-list dense separator class="th-doc-field-list">
          <q-item
            v-for="([key, value], idx) in flatEntries"
            :key="idx"
            class="th-doc-field-item"
          >
            <q-item-section side class="th-doc-field-num">
              {{ idx + 1 }}
            </q-item-section>
            <q-item-section class="th-doc-field-key">
              {{ key }}
            </q-item-section>
            <q-item-section class="th-doc-field-value">
              {{ formatValue(value) }}
              <q-btn
                v-if="typeof value === 'string' && value.length > 0"
                flat
                round
                dense
                icon="content_copy"
                size="xs"
                class="th-doc-copy-btn"
                @click.stop="copyToClipboard(String(value))"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Surrounding documents section -->
      <template v-if="store.surroundingEvents.length > 0">
        <q-separator />
        <div class="th-doc-surrounding">
          <div class="th-doc-surrounding-title">Surrounding Documents</div>
          <q-list dense separator>
            <q-item
              v-for="(evt, idx) in store.surroundingEvents"
              :key="idx"
              clickable
              :class="{ 'th-surrounding-current': evt._id === store.inspectedEvent?._id }"
              @click="store.inspectDocument(evt)"
            >
              <q-item-section>
                <q-item-label class="th-surrounding-ts">
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
import { useThreatHuntingStore } from "@/stores/threatHunting";
import type { ThreatHuntingEvent } from "@/stores/threatHunting";

const store = useThreatHuntingStore();
const viewTab = ref<"table" | "json">("table");

function onDrawerToggle(val: boolean) {
  if (!val) store.closeInspection();
}

// Flatten the event source for table display
const flatEntries = computed<[string, unknown][]>(() => {
  if (!store.inspectedEvent) return [];
  const src = store.inspectedEvent._source;
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

function getEventTs(evt: ThreatHuntingEvent): string {
  return (evt._source["@timestamp"] as string) ?? (evt._source["timestamp"] as string) ?? "";
}

function getEventAgent(evt: ThreatHuntingEvent): string {
  const agent = evt._source.agent as Record<string, unknown> | undefined;
  return (agent?.name as string) ?? "";
}

function getEventDesc(evt: ThreatHuntingEvent): string {
  const rule = evt._source.rule as Record<string, unknown> | undefined;
  return (rule?.description as string) ?? "";
}

function getEventLevel(evt: ThreatHuntingEvent): string {
  const rule = evt._source.rule as Record<string, unknown> | undefined;
  return String(rule?.level ?? "");
}
</script>

<style scoped>
.th-doc-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.th-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.th-doc-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.th-doc-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.th-doc-tabs {
  padding: 0 16px;
}

.th-doc-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 36px;
}

/* Table view */
.th-doc-table-wrap {
  flex: 1;
  overflow-y: auto;
}

.th-doc-field-item {
  min-height: 32px;
  align-items: flex-start;
}

.th-doc-field-num {
  font-size: 11px;
  color: var(--mdm-text-secondary, #888);
  min-width: 28px;
  max-width: 28px;
}

.th-doc-field-key {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  min-width: 160px;
  max-width: 200px;
  word-break: break-all;
}

.th-doc-field-value {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  word-break: break-all;
  position: relative;
}

.th-doc-copy-btn {
  opacity: 0;
  transition: opacity 0.15s;
  position: absolute;
  right: 0;
  top: 0;
}

.th-doc-field-item:hover .th-doc-copy-btn {
  opacity: 0.7;
}

/* JSON view */
.th-doc-json {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.th-json-pre {
  font-size: 11px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 0;
}

/* Surrounding documents */
.th-doc-surrounding {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
}

.th-doc-surrounding-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 4px 16px 8px;
}

.th-surrounding-ts {
  font-size: 11px;
  font-family: monospace;
}

.th-surrounding-current {
  background: rgba(37, 99, 235, 0.08);
}

/* Dark mode */
.body--dark .th-doc-title,
.body--dark .th-doc-field-key,
.body--dark .th-doc-surrounding-title,
.body--dark .th-json-pre {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
