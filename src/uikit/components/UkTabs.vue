<template>
  <div class="uk-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['uk-tab', { 'uk-tab--active': modelValue === tab.id }]"
      @click="$emit('update:modelValue', tab.id)"
    >
      <q-icon v-if="tab.icon" :name="tab.icon" size="16px" />
      {{ tab.label }}
      <span
        v-if="tab.count !== undefined"
        :class="[
          'uk-tab__badge',
          tab.badgeType ? `uk-tab__badge--${tab.badgeType}` : '',
        ]"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  badgeType?: string;
}

defineProps<{
  tabs: TabItem[];
  modelValue: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.uk-tabs {
  display: flex;
  gap: 2px;
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  padding: 2px;
}

.uk-tab {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-1) var(--uk-space-3);
  border-radius: var(--uk-radius-sm);
  border: none;
  background: transparent;
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  white-space: nowrap;
}

.uk-tab:hover {
  color: var(--uk-text-primary);
  background: var(--uk-bg-hover);
}

.uk-tab--active {
  background: var(--uk-bg-active);
  color: var(--uk-primary);
}

.uk-tab__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-bg-overlay);
  color: var(--uk-text-secondary);
}

.uk-tab__badge--success { background: var(--uk-success-soft); color: var(--uk-success-text); }
.uk-tab__badge--error { background: var(--uk-error-soft); color: var(--uk-error-text); }
.uk-tab__badge--warning { background: var(--uk-warning-soft); color: var(--uk-warning-text); }
</style>
