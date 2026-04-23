<template>
  <div class="uk-pagination">
    <div class="uk-pagination__info">
      Showing {{ start }}–{{ end }} of {{ total }}
    </div>
    <div class="uk-pagination__controls">
      <select :value="pageSize" class="uk-pagination__select" @change="onPageSizeChange">
        <option :value="10">10 / page</option>
        <option :value="20">20 / page</option>
        <option :value="50">50 / page</option>
        <option :value="100">100 / page</option>
      </select>
      <button
        class="uk-pagination__btn"
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <q-icon name="chevron_left" size="18px" />
      </button>
      <span class="uk-pagination__page">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="uk-pagination__btn"
        :disabled="currentPage === totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <q-icon name="chevron_right" size="18px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  total: number;
  pageSize: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
}>();

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
);
const start = computed(() => (props.currentPage - 1) * props.pageSize + 1);
const end = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.total),
);

function onPageSizeChange(e: Event) {
  const value = Number((e.target as HTMLSelectElement).value);
  emit("update:pageSize", value);
  emit("update:currentPage", 1);
}
</script>

<style scoped>
.uk-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--uk-space-3) 0;
  margin-top: var(--uk-space-3);
}

.uk-pagination__info {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-pagination__controls {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

.uk-pagination__select {
  padding: var(--uk-space-1) var(--uk-space-2);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  cursor: pointer;
}

.uk-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-sm);
  background: var(--uk-bg-surface);
  color: var(--uk-text-secondary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-pagination__btn:hover:not(:disabled) {
  border-color: var(--uk-border-strong);
  color: var(--uk-text-primary);
}

.uk-pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.uk-pagination__page {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  min-width: 50px;
  text-align: center;
}
</style>
