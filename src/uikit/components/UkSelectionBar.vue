<template>
  <transition name="uk-slide-down">
    <div v-if="count > 0" class="uk-selection-bar">
      <div class="uk-selection-bar__info">
        <q-icon name="check_circle" size="16px" />
        <span><strong>{{ count }}</strong> {{ count === 1 ? 'item' : 'items' }} selected</span>
      </div>
      <div class="uk-selection-bar__actions">
        <slot name="actions" />
      </div>
      <button class="uk-btn uk-btn--ghost uk-btn--sm" @click="$emit('clear')">
        <q-icon name="close" size="14px" />
        Clear
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  count: number;
}>();

defineEmits<{
  clear: [];
}>();
</script>

<style scoped>
.uk-selection-bar {
  display: flex;
  align-items: center;
  gap: var(--uk-space-4);
  padding: var(--uk-space-2) var(--uk-space-4);
  margin-bottom: var(--uk-space-3);
  background: var(--uk-primary-soft);
  border: 1px solid var(--uk-primary);
  border-radius: var(--uk-radius-md);
}

.uk-selection-bar__info {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  font-size: var(--uk-text-sm);
  color: var(--uk-primary-text);
}

.uk-selection-bar__actions {
  display: flex;
  gap: var(--uk-space-1);
  flex: 1;
}
</style>
