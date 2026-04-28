<template>
  <div class="cywm-tree">
    <div class="cywm-tree__header">
      <span>Configuration files</span>
      <span class="cywm-tree__count">{{ totalCount }} items</span>
    </div>
    <div class="cywm-tree__search">
      <q-input
        v-model="filter"
        dense
        outlined
        placeholder="Filter files..."
        bg-color="white"
      >
        <template #prepend>
          <q-icon name="search" size="16px" />
        </template>
      </q-input>
    </div>
    <div class="cywm-tree__body">
      <template v-for="group in groups" :key="group.key">
        <div class="cywm-tree__group">
          <span>{{ group.label }}</span>
          <q-icon
            name="add"
            size="16px"
            class="cywm-tree__add"
            @click.stop="$emit('quick-create', group.target, group.category)"
          />
        </div>
        <div v-if="group.files.length === 0" class="cywm-tree__empty">
          (empty)
        </div>
        <FileTreeRow
          v-for="file in group.files"
          :key="file.id"
          :file="file"
          :active="file.id === activeId"
          :modified="modifiedIds.has(file.id)"
          @select="(id) => $emit('select', id)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { useFileTree } from "@/cywm/composables/useFileTree";
import FileTreeRow from "./FileTreeRow.vue";
import type { ConfigFile, FileCategory, FileTarget } from "@/cywm/types";

const props = defineProps<{
  files: ConfigFile[];
  activeId: string | null;
  modifiedIds: Set<string>;
}>();

defineEmits<{
  select: [id: string];
  "quick-create": [target: FileTarget, category: FileCategory];
}>();

const filter = ref("");
const filesRef = toRef(props, "files");
const { groups, totalCount } = useFileTree(filesRef, filter);
</script>

<style lang="scss" scoped>
.cywm-tree {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.cywm-tree__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid var(--cywm-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--cywm-text-primary);
}

.cywm-tree__count {
  font-size: 11px;
  color: var(--cywm-text-secondary);
  font-weight: 400;
}

.cywm-tree__search {
  padding: 8px 12px;
  border-bottom: 1px solid var(--cywm-border);
}

.cywm-tree__body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.cywm-tree__group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--cywm-text-secondary);
  font-weight: 600;
}

.cywm-tree__add {
  cursor: pointer;
  color: var(--cywm-text-muted);
  border-radius: 3px;
  padding: 1px;

  &:hover {
    color: var(--cywm-accent);
    background: var(--cywm-accent-light);
  }
}

.cywm-tree__empty {
  padding: 4px 24px;
  font-size: 12px;
  color: var(--cywm-text-muted);
  font-style: italic;
}
</style>
