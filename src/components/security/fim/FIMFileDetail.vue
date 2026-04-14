<template>
  <q-dialog :model-value="!!entry" @update:model-value="$emit('close')" position="right" maximized>
    <q-card class="file-detail-card">
      <!-- Header -->
      <div class="detail-header">
        <span class="detail-path">{{ entry.file }}</span>
        <q-btn flat round dense icon="close" size="sm" @click="$emit('close')" />
      </div>

      <!-- Details section -->
      <div class="detail-section">
        <div class="section-title" @click="detailsExpanded = !detailsExpanded">
          <q-icon :name="detailsExpanded ? 'expand_more' : 'chevron_right'" size="20px" />
          <span>Details</span>
        </div>

        <div v-if="detailsExpanded" class="detail-grid">
          <div class="detail-item">
            <div class="detail-icon"><q-icon name="schedule" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">Last analysis</div>
              <div class="detail-value">{{ formatDate(entry.date) }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="schedule" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">Last modified</div>
              <div class="detail-value">{{ formatDate(entry.mtime) }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="person" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">User</div>
              <div class="detail-value">{{ entry.uname ?? '—' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="badge" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">User ID</div>
              <div class="detail-value">{{ entry.uid ?? '—' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="storage" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">Size</div>
              <div class="detail-value">{{ formatSize(entry.size) }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="check" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">MD5</div>
              <div class="detail-value hash-value">{{ entry.md5 ?? '—' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="check" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">SHA1</div>
              <div class="detail-value hash-value">{{ entry.sha1 ?? '—' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="check" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">SHA256</div>
              <div class="detail-value hash-value">{{ entry.sha256 ?? '—' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><q-icon name="lock" size="18px" color="primary" /></div>
            <div>
              <div class="detail-label">Permissions</div>
              <div class="detail-value">{{ entry.perm ?? '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent events section -->
      <div class="detail-section">
        <div class="section-title" @click="eventsExpanded = !eventsExpanded">
          <q-icon :name="eventsExpanded ? 'expand_more' : 'chevron_right'" size="20px" />
          <span>Recent events</span>
          <q-icon name="open_in_new" size="16px" class="q-ml-xs text-grey-5 cursor-pointer" />
        </div>

        <div v-if="eventsExpanded" class="events-section">
          <div class="events-filter-row">
            <q-input v-model="eventSearch" dense outlined placeholder="Search" class="event-search" clearable>
              <template #append>
                <q-btn flat dense no-caps label="DQL" size="sm" class="dql-btn" />
              </template>
            </q-input>
            <q-select
              :model-value="'24h'"
              :options="[{ label: 'Last 24 hours', value: '24h' }]"
              dense
              outlined
              emit-value
              map-options
              class="event-date"
            >
              <template #prepend>
                <q-icon name="event" size="16px" />
              </template>
            </q-select>
            <q-btn flat dense no-caps label="Show dates" class="text-primary" size="sm" />
            <q-space />
            <q-btn flat dense no-caps icon="refresh" label="Refresh" class="refresh-btn" size="sm" />
          </div>

          <div class="events-chips-row">
            <q-btn flat dense no-caps icon="add_circle_outline" label="Add filter" class="text-primary" size="sm" />
          </div>

          <div class="events-empty">
            <q-icon name="info" size="18px" color="primary" class="q-mr-sm" />
            No results match your search criteria
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { WazuhSyscheckEntry } from "@/types/wazuh";

defineProps<{ entry: WazuhSyscheckEntry }>();
defineEmits<{ close: [] }>();

const detailsExpanded = ref(true);
const eventsExpanded = ref(true);
const eventSearch = ref("");

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch {
    return dateStr;
  }
}

function formatSize(size?: number | string): string {
  if (size == null) return "—";
  const bytes = typeof size === "string" ? parseInt(size, 10) : size;
  if (isNaN(bytes)) return String(size);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>

<style scoped>
.file-detail-card {
  width: 600px;
  max-width: 90vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--mdm-bg-card, #fff);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  position: sticky;
  top: 0;
  background: var(--mdm-bg-card, #fff);
  z-index: 1;
}

.detail-path {
  font-size: 15px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  word-break: break-all;
}

/* Sections */
.detail-section {
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  cursor: pointer;
  user-select: none;
}

.section-title:hover {
  background: rgba(37, 99, 235, 0.02);
}

/* Detail grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 0 20px 20px;
}

.detail-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.detail-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #666);
  margin-bottom: 2px;
}

.detail-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
  word-break: break-all;
}

.hash-value {
  font-size: 11px;
  font-family: monospace;
}

/* Events section */
.events-section {
  padding: 0 20px 20px;
}

.events-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.event-search {
  flex: 1;
}

.event-search :deep(.q-field__control) {
  height: 30px;
  min-height: 30px;
  font-size: 12px;
}

.event-date {
  width: 150px;
}

.event-date :deep(.q-field__control) {
  height: 30px;
  min-height: 30px;
  font-size: 12px;
}

.dql-btn {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
}

.refresh-btn {
  color: var(--mdm-primary, #2563eb);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 4px;
  font-weight: 500;
}

.events-chips-row {
  margin-bottom: 8px;
}

.events-empty {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-left: 3px solid var(--mdm-primary, #2563eb);
  border-radius: 4px;
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
}

/* Dark mode */
.body--dark .file-detail-card {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .detail-header {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .events-empty {
  background: rgba(255, 255, 255, 0.03);
}
</style>
