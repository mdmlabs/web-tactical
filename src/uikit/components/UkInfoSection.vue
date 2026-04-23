<template>
  <div class="uk-info-section">
    <h3 class="uk-info-section__title">{{ title }}</h3>
    <div class="uk-info-list">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped>
.uk-info-section {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
}

.uk-info-section__title {
  font-size: var(--uk-text-sm);
  font-weight: 600;
  color: var(--uk-text-primary);
  margin: 0 0 var(--uk-space-4);
  padding-bottom: var(--uk-space-2);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-info-list {
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-3);
}
</style>
