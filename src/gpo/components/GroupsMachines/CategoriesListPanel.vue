<template>
  <div class="groups-left-panel">
    <div class="groups-left-header row items-center q-px-md q-py-sm">
      <div class="row items-center no-wrap q-gutter-x-sm">
        <div class="text-subtitle1 text-weight-medium">Categories</div>
        <q-badge
          v-if="!loading && !error && (nodes?.length ?? 0) > 0"
          color="grey-3"
          text-color="grey-8"
          :label="categoryNodesCount"
          rounded
          class="groups-count-badge"
        />
      </div>
      <q-space />
      <q-btn
        flat
        dense
        round
        icon="add"
        color="primary"
        title="Create category"
        @click="$emit('create')"
      />
      <q-btn
        flat
        dense
        round
        icon="refresh"
        color="grey-7"
        title="Refresh"
        :loading="loading"
        @click="$emit('refresh')"
      />
    </div>

    <q-separator />

    <div class="q-px-md q-py-sm">
      <q-input
        :model-value="search"
        dense
        outlined
        placeholder="Search..."
        clearable
        :input-style="{ paddingLeft: '6px' }"
        @update:model-value="(val) => $emit('update:search', String(val ?? ''))"
        @clear="$emit('update:search', '')"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="xs" />
        </template>
      </q-input>
    </div>

    <div v-if="loading" class="column items-center justify-center q-pa-xl">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm text-caption">Loading categories...</div>
    </div>

    <div
      v-else-if="error"
      class="column items-center justify-center q-pa-lg text-negative"
    >
      <q-icon name="error" size="2rem" class="q-mb-sm" />
      <div class="text-caption">{{ error }}</div>
      <q-btn
        flat
        dense
        color="primary"
        label="Retry"
        class="q-mt-sm"
        @click="$emit('refresh')"
      />
    </div>

    <q-scroll-area
      v-else-if="(nodes?.length ?? 0) > 0"
      class="groups-tree-scroll"
    >
      <q-tree
        :nodes="nodes"
        node-key="id"
        :selected="selectedKey"
        default-expand-all
        dense
        class="groups-tree"
        @update:selected="$emit('select', $event)"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center no-wrap col groups-tree-item">
            <div class="groups-tree-avatar-wrap">
              <div
                class="groups-tree-avatar"
                :class="{
                  'groups-tree-avatar--all-root': prop.node.id === '__root__',
                  'groups-tree-avatar--category':
                    prop.node.isCategory !== false &&
                    prop.node.id !== '__root__',
                }"
              >
                <q-icon
                  :name="
                    prop.node.id === '__root__'
                      ? 'devices'
                      : prop.node.isCategory !== false
                        ? 'laptop'
                        : 'devices'
                  "
                  size="16px"
                  class="groups-tree-avatar-icon"
                  :color="prop.node.id === '__root__' ? 'warning' : undefined"
                />
              </div>
            </div>
            <div class="col groups-tree-label-col">
              <div class="groups-tree-label ellipsis">
                {{ prop.node.label }}
              </div>
            </div>
            <q-badge
              v-if="prop.node.isCategory && prop.node.children?.length"
              color="grey-3"
              text-color="grey-8"
              :label="prop.node.children.length"
              rounded
              class="groups-count-badge q-ml-xs flex-shrink-0"
            />
          </div>
        </template>
      </q-tree>
    </q-scroll-area>

    <div v-else class="column items-center justify-center q-pa-xl text-grey-6">
      <q-icon name="folder_off" size="2rem" class="q-mb-sm" />
      <div class="text-caption">
        {{ search ? "No categories match the filter" : "No categories found" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { QTreeNode } from "quasar";

const props = defineProps<{
  nodes: QTreeNode[];
  loading: boolean;
  error: string | null;
  selectedKey: string | null;
  search: string;
}>();

function countCategoriesExcludingRoot(nodes: QTreeNode[]): number {
  let n = 0;
  for (const node of nodes) {
    if (node.id !== "__root__") {
      n += 1;
    }
    if (node.children?.length) {
      n += countCategoriesExcludingRoot(node.children);
    }
  }
  return n;
}

const categoryNodesCount = computed(() =>
  countCategoriesExcludingRoot(props.nodes ?? []),
);

defineEmits<{
  refresh: [];
  create: [];
  select: [nodeId: string | null];
  "update:search": [value: string];
}>();
</script>

<style scoped lang="sass">
.groups-left-panel
  height: 100%
  min-height: 0
  width: 200px
  min-width: 240px
  max-width: 360px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0, 0, 0, 0.12)
  overflow: hidden

.groups-left-header
  flex-shrink: 0

.groups-count-badge
  font-weight: 600
  font-size: 11px
  padding: 2px 8px
  letter-spacing: 0.02em

.groups-tree-scroll
  flex: 1 1 0
  min-height: 0
  overflow: hidden

.groups-tree
  padding: 4px 0

.groups-tree :deep(.q-tree__node-header-content)
  min-width: 0

.groups-tree :deep(.q-tree__node-header)
  margin-top: 0
  padding: 2px 4px
  border-radius: 6px
  transition: background-color 0.15s ease, box-shadow 0.15s ease

.groups-tree :deep(.q-tree__node-header.q-tree__node--selected)
  background: rgba(25, 118, 210, 0.08)
  box-shadow: inset 3px 0 0 rgb(25, 118, 210)

.groups-tree :deep(.q-tree__node-header:not(.q-tree__node--selected):hover)
  background: rgba(0, 0, 0, 0.04)

.groups-tree-item
  min-width: 0
  min-height: 28px

.groups-tree-avatar-wrap
  flex-shrink: 0
  margin-right: 8px

.groups-tree-avatar
  width: 28px
  height: 28px
  border-radius: 6px
  display: flex
  align-items: center
  justify-content: center
  color: #0d47a1
  background: #e3f2fd
  border: 1px solid rgb(144, 202, 249)

.groups-tree-avatar-icon
  opacity: 0.9

.groups-tree-avatar--category
  color: #424242
  background: #f5f5f5
  border-color: #e0e0e0

.groups-tree-avatar--all-root
  background: #fff8e1
  border: 1px solid rgb(255, 193, 7)

.groups-tree-label-col
  min-width: 0

.groups-tree-label
  font-size: 13px
  font-weight: 600
  line-height: 1.25

.body--dark .groups-left-panel
  border-right-color: rgba(255, 255, 255, 0.12)

.body--dark .groups-tree :deep(.q-tree__node-header:not(.q-tree__node--selected):hover)
  background: rgba(255, 255, 255, 0.06)

.body--dark .groups-tree :deep(.q-tree__node-header.q-tree__node--selected)
  background: rgba(25, 118, 210, 0.22)
  box-shadow: inset 3px 0 0 rgb(100, 181, 246)

.body--dark .groups-tree-avatar
  color: #e3f2fd
  background: #1565c0
  border: 1px solid rgb(66, 165, 245)

.body--dark .groups-tree-avatar-icon
  opacity: 0.95

.body--dark .groups-tree-avatar--category
  color: #eeeeee
  background: #424242
  border-color: #616161

.body--dark .groups-tree-avatar--all-root
  background: rgba(255, 193, 7, 0.12)
  border: 1px solid rgba(255, 183, 77, 0.45)

.body--dark .groups-count-badge
  background: rgba(255, 255, 255, 0.12) !important
</style>
