<template>
  <div
    :class="['cywm-tree-row', { 'cywm-tree-row--active': active }]"
    @click="$emit('select', file.id)"
  >
    <q-icon name="description" size="14px" class="cywm-tree-row__icon" />
    <span class="cywm-tree-row__name">{{ file.filename }}</span>
    <span v-if="modified" class="cywm-tree-row__dot" title="Unsaved changes">
      ●
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ConfigFile } from "@/cywm/types";

defineProps<{
  file: ConfigFile;
  active: boolean;
  modified: boolean;
}>();

defineEmits<{
  select: [id: string];
}>();
</script>

<style lang="scss" scoped>
.cywm-tree-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px 24px;
  cursor: pointer;
  font-size: 13px;
  color: var(--cywm-text-primary);
  border-left: 2px solid transparent;
  user-select: none;

  &:hover {
    background: var(--cywm-bg-hover);
  }
}

.cywm-tree-row--active {
  background: var(--cywm-accent-light);
  border-left-color: var(--cywm-accent);
  color: var(--cywm-accent);
  font-weight: 500;
}

.cywm-tree-row__icon {
  flex-shrink: 0;
  color: var(--cywm-text-secondary);
}

.cywm-tree-row--active .cywm-tree-row__icon {
  color: var(--cywm-accent);
}

.cywm-tree-row__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cywm-tree-row__dot {
  color: var(--cywm-warning);
  font-size: 12px;
  flex-shrink: 0;
}
</style>
