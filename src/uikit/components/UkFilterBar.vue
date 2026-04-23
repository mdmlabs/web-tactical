<template>
  <div class="uk-table-toolbar">
    <div class="uk-table-toolbar__left">
      <div v-if="filters && filters.length" class="uk-filter-group">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="[
            'uk-filter-btn',
            { 'uk-filter-btn--active': filter.active },
          ]"
          @click="$emit('filter', filter.id)"
        >
          <q-icon v-if="filter.icon" :name="filter.icon" size="16px" />
          <span>{{ filter.label }}</span>
        </button>
      </div>
    </div>
    <div class="uk-table-toolbar__right">
      <slot name="actions" />
      <div class="uk-table-search">
        <q-icon name="search" size="16px" class="uk-table-search__icon" />
        <input
          :value="search"
          class="uk-table-search__input"
          :placeholder="searchPlaceholder"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface FilterItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

withDefaults(
  defineProps<{
    filters?: FilterItem[];
    search?: string;
    searchPlaceholder?: string;
  }>(),
  {
    filters: () => [],
    search: "",
    searchPlaceholder: "Filter...",
  },
);

defineEmits<{
  "update:search": [value: string];
  filter: [id: string];
}>();
</script>

<style scoped>
.uk-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--uk-space-4);
  margin-bottom: var(--uk-space-3);
  flex-wrap: wrap;
}

.uk-table-toolbar__left,
.uk-table-toolbar__right {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

.uk-filter-group {
  display: flex;
  gap: 2px;
}

.uk-filter-btn {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-1) var(--uk-space-3);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-filter-btn:hover {
  border-color: var(--uk-border-strong);
  color: var(--uk-text-primary);
}

.uk-filter-btn--active {
  border-color: var(--uk-primary);
  background: var(--uk-primary-soft);
  color: var(--uk-primary-text);
}

.uk-table-search {
  position: relative;
}

.uk-table-search__icon {
  position: absolute;
  left: var(--uk-space-2);
  top: 50%;
  transform: translateY(-50%);
  color: var(--uk-text-tertiary);
  pointer-events: none;
}

.uk-table-search__input {
  width: 200px;
  height: 30px;
  padding: 0 var(--uk-space-2) 0 30px;
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  transition: all var(--uk-transition-base);
}

.uk-table-search__input::placeholder {
  color: var(--uk-text-tertiary);
}

.uk-table-search__input:focus {
  border-color: var(--uk-border-focus);
  width: 280px;
}
</style>
