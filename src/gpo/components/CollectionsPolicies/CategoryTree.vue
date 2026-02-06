<template>
  <q-card flat bordered class="column" style="height: calc(100vh - 220px)">
    <q-card-section>
      <div class="text-subtitle2 q-mb-md">Categories</div>
      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner color="primary" size="2em" />
        <div class="q-mt-sm">Loading...</div>
      </div>
      <EmptyState
        v-else-if="error"
        icon="error"
        :message="error"
        error
        retry-label="Retry"
        @retry="$emit('retry')"
      />
      <q-scroll-area
        v-else-if="categories.length > 0"
        :style="{ height: 'calc(100vh - 300px)' }"
      >
        <q-tree
          :nodes="categories"
          node-key="id"
          :selected="selectedCategoryId"
          default-expand-all
          class="category-tree"
          @update:selected="$emit('update:selectedCategoryId', $event)"
        >
          <template v-slot:default-header="prop">
            <div class="row items-center full-width">
              <q-icon :name="prop.node.icon || 'folder'" class="q-mr-sm" />
              <div class="col">{{ prop.node.label }}</div>
            </div>
          </template>
        </q-tree>
      </q-scroll-area>
      <EmptyState
        v-else
        icon="info"
        message="No categories"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import type { CategoryNode } from "../types/policy-catalog";

defineProps<{
  categories: CategoryNode[];
  loading: boolean;
  error?: string | null;
  selectedCategoryId: string | null;
}>();

defineEmits<{
  (e: "update:selectedCategoryId", value: string | null): void;
  (e: "retry"): void;
}>();
</script>

<style scoped lang="sass">
.category-tree
  .q-tree__node-header
    padding: 4px 0
</style>
