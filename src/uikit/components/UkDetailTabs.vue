<template>
  <div class="uk-detail-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['uk-detail-tab', { 'uk-detail-tab--active': modelValue === tab.id }]"
      @click="$emit('update:modelValue', tab.id)"
    >
      <q-icon v-if="tab.icon" :name="tab.icon" size="16px" />
      {{ tab.label }}
      <span
        v-if="tab.badge"
        :class="[
          'uk-detail-tab__badge',
          tab.badgeType ? `uk-detail-tab__badge--${tab.badgeType}` : '',
        ]"
      >
        {{ tab.badge }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface DetailTabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number | string;
  badgeType?: string;
}

defineProps<{
  tabs: DetailTabItem[];
  modelValue: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.uk-detail-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--uk-border-default);
  margin-bottom: var(--uk-space-5);
}

.uk-detail-tab {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-3) var(--uk-space-4);
  border: none;
  background: transparent;
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--uk-transition-fast);
}

.uk-detail-tab:hover {
  color: var(--uk-text-primary);
}

.uk-detail-tab--active {
  color: var(--uk-primary);
  border-bottom-color: var(--uk-primary);
}

.uk-detail-tab__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-bg-overlay);
  color: var(--uk-text-secondary);
}

.uk-detail-tab__badge--error { background: var(--uk-error-soft); color: var(--uk-error-text); }
.uk-detail-tab__badge--warning { background: var(--uk-warning-soft); color: var(--uk-warning-text); }
</style>
