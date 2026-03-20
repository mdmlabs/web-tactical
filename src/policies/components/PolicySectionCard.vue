<template>
  <div class="section-card">
    <div class="card-header">
      <div class="card-title">
        <span>{{ title }}</span>
        <span class="card-count">({{ count }})</span>
      </div>
      <q-btn
        flat
        dense
        color="primary"
        label="View"
        class="view-btn"
        @click="$emit('view')"
      />
    </div>

    <div class="card-content">
      <template v-if="count === 0">
        <p class="empty-text">{{ emptyText }}</p>
      </template>
      <template v-else-if="items && items.length > 0">
        <div class="preview-list">
          <div
            v-for="(item, index) in displayedItems"
            :key="index"
            class="preview-item"
          >
            <q-icon :name="getItemIcon(item)" size="18px" class="preview-icon" />
            <span class="preview-name">{{ getItemName(item) }}</span>
          </div>
          <div v-if="remainingCount > 0" class="preview-more">
            <q-btn
              flat
              dense
              color="primary"
              size="sm"
              :label="`+${remainingCount} more`"
              @click="$emit('view')"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface PreviewItem {
  name: string;
  type?: string;
  icon?: string;
}

const props = defineProps<{
  title: string;
  count: number;
  emptyText?: string;
  items?: PreviewItem[];
}>();

defineEmits<{
  (e: "view"): void;
}>();

const displayedItems = computed(() => {
  return props.items?.slice(0, 3) || [];
});

const remainingCount = computed(() => {
  return Math.max(0, (props.count || 0) - 3);
});

function getItemIcon(item: PreviewItem): string {
  if (item.icon) return item.icon;
  // Default icons based on type
  const typeIcons: Record<string, string> = {
    script: "code",
    app: "apps",
    book: "menu_book",
    image: "image",
    certificate: "vpn_key",
  };
  return typeIcons[item.type || ""] || "folder";
}

function getItemName(item: PreviewItem): string {
  return item.name || "Unnamed";
}
</script>

<style scoped>
.section-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.card-count {
  color: var(--text-secondary, #6b7280);
  font-weight: 400;
  margin-left: 4px;
}

.view-btn {
  text-transform: none;
  font-weight: 600;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
  text-align: center;
}

.preview-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--item-bg, #f9fafb);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e5e7eb);
}

.preview-icon {
  color: var(--text-secondary, #6b7280);
  flex-shrink: 0;
}

.preview-name {
  font-size: 13px;
  color: var(--text-primary, #1a1a2e);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-more {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

/* Dark theme */
.body--dark .section-card {
  --card-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --item-bg: #2a2a3d;
}
</style>
