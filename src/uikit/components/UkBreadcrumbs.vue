<template>
  <nav class="uk-breadcrumbs">
    <span
      v-for="(item, i) in items"
      :key="i"
      class="uk-breadcrumbs__item"
    >
      <router-link
        v-if="item.to && i < items.length - 1"
        :to="item.to"
        class="uk-breadcrumbs__link"
      >
        {{ item.label }}
      </router-link>
      <span
        v-else
        :class="[
          'uk-breadcrumbs__link',
          { 'uk-breadcrumbs__link--current': i === items.length - 1 },
        ]"
      >
        {{ item.label }}
      </span>
      <q-icon
        v-if="i < items.length - 1"
        name="chevron_right"
        size="14px"
        class="uk-breadcrumbs__sep"
      />
    </span>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  to?: string;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<style scoped>
.uk-breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
}

.uk-breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
}

.uk-breadcrumbs__link {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  cursor: pointer;
  transition: color var(--uk-transition-fast);
  text-decoration: none;
}

.uk-breadcrumbs__link:hover {
  color: var(--uk-text-primary);
}

.uk-breadcrumbs__link--current {
  color: var(--uk-text-primary);
  font-weight: 500;
  cursor: default;
}

.uk-breadcrumbs__sep {
  color: var(--uk-text-tertiary);
}
</style>
