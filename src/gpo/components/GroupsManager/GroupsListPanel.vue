<template>
  <div class="groups-left-panel">
    <div class="groups-left-header row items-center q-px-md q-py-sm">
      <div class="text-subtitle1 text-weight-medium">Groups</div>
      <q-space />
      <q-btn
        flat
        dense
        round
        icon="add"
        color="primary"
        title="Create group"
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

    <div
      v-if="loading"
      class="column items-center justify-center q-pa-xl"
    >
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm text-caption">Loading groups...</div>
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
      v-else-if="treeNodes.length > 0"
      class="groups-tree-scroll"
    >
      <q-tree
        :nodes="treeNodes"
        node-key="id"
        :selected="selectedId"
        default-expand-all
        class="groups-tree q-pa-sm"
        @update:selected="(id: string | null) => $emit('select', id)"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center full-width groups-tree-item">
            <q-icon
              :name="prop.node.isCategory ? 'folder' : 'group'"
              :color="prop.node.isCategory ? 'warning' : 'primary'"
              size="xs"
              class="q-mr-xs"
            />
            <div class="col ellipsis text-body2">
              {{ prop.node.label }}
            </div>
            <q-badge
              v-if="prop.node.isCategory && prop.node.children?.length"
              color="grey-4"
              text-color="grey-8"
              :label="prop.node.children.length"
              class="q-ml-xs"
            />
          </div>
        </template>
      </q-tree>
    </q-scroll-area>

    <div
      v-else
      class="column items-center justify-center q-pa-xl text-grey-6"
    >
      <q-icon name="search_off" size="2rem" class="q-mb-sm" />
      <div class="text-caption">
        {{ search ? "No groups match the filter" : "No groups found" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface GroupsTreeNode {
  id: string;
  label: string;
  isCategory: boolean;
  children?: GroupsTreeNode[];
  samAccountName?: string;
}

defineProps<{
  treeNodes: GroupsTreeNode[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  search: string;
}>();

defineEmits<{
  select: [nodeId: string | null];
  refresh: [];
  create: [];
  "update:search": [value: string];
}>();
</script>

<style scoped lang="sass">
.groups-left-panel
  width: 350px
  min-width: 240px
  max-width: 360px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0,0,0,.12)

.groups-left-header
  flex-shrink: 0

.groups-tree-scroll
  flex: 1 1 0
  height: 0

.groups-tree
  :deep(.q-tree__node--selected > .q-tree__node-header)
    background: rgba(25, 118, 210, .1)
    border-radius: 4px

.groups-tree-item
  padding: 1px 0
</style>
