<template>
  <div class="groups-left-panel">
    <div class="groups-left-header row items-center q-px-md q-py-sm">
      <div class="text-subtitle1 text-weight-medium">Categories</div>
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
        @update:model-value="$emit('update:search', String($event ?? ''))"
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
        class="groups-tree q-pa-sm"
        @update:selected="$emit('select', $event)"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center full-width groups-tree-item">
            <q-icon
              :name="prop.node.id === '__root__' ? 'folder' : 'laptop'"
              :color="prop.node.id === '__root__' ? 'warning' : 'primary'"
              size="xs"
              class="q-mr-xs"
            />
            <div class="col ellipsis text-body2">
              {{ prop.node.label }}
            </div>
            <q-badge
              v-if="prop.node.children?.length"
              color="grey-4"
              text-color="grey-8"
              :label="prop.node.children.length"
              class="q-ml-xs"
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
import type { QTreeNode } from "quasar";

defineProps<{
  nodes: QTreeNode[];
  loading: boolean;
  error: string | null;
  selectedKey: string | null;
  search: string;
}>();

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
  width: 380px
  min-width: 280px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0, 0, 0, 0.08)
  overflow: hidden

.groups-left-header
  flex-shrink: 0

.groups-tree-scroll
  flex: 1 1 0
  min-height: 0
  overflow: hidden

.groups-tree .q-tree__node--selected > .q-tree__node-header
  background: rgba(25, 118, 210, 0.1)
  border-radius: 4px

.groups-tree-item
  padding: 1px 0
</style>
