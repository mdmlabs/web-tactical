<template>
  <q-card flat bordered class="column" style="height: calc(100vh - 220px)">
    <q-card-section>
      <div class="text-subtitle2 q-mb-md">Categories</div>
      <template v-if="!loading && !error && categories.length > 0">
        <q-input
          :model-value="searchQuery ?? ''"
          dense
          outlined
          placeholder="Search by group..."
          clearable
          class="q-mb-md"
          :input-style="{ paddingLeft: '8px' }"
          @update:model-value="handleSearchInput"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="xs" />
          </template>
        </q-input>
        <q-select
          :model-value="scopeFilter"
          :options="scopeFilterOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          class="q-mb-md category-tree-scope-select"
          @update:model-value="$emit('update:scopeFilter', $event)"
        />
      </template>
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
        v-else-if="filteredCategories.length > 0"
        :style="{ height: scrollAreaHeight }"
      >
        <q-tree
          :nodes="filteredCategories"
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
        v-else-if="categories.length > 0"
        icon="search_off"
        message="No groups match the search"
      />
      <EmptyState
        v-else
        icon="info"
        message="No categories"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useCategoryFilter } from "../../composables/useCategoryFilter";
import type { CategoryNode } from "../../types/policy-catalog";

const props = withDefaults(
  defineProps<{
    categories: CategoryNode[];
    loading: boolean;
    error?: string | null;
    selectedCategoryId: string | null;
    scopeFilter: string;
    scopeFilterOptions: { label: string; value: string }[];
    searchQuery?: string | null;
  }>(),
  { searchQuery: "" },
);

const emit = defineEmits<{
  (e: "update:selectedCategoryId", value: string | null): void;
  (e: "update:scopeFilter", value: string): void;
  (e: "update:searchQuery", value: string | null): void;
  (e: "retry"): void;
}>();

function handleSearchInput(value: string | number | null | undefined) {
  emit("update:searchQuery", value == null ? null : String(value));
}

const { filteredCategories } = useCategoryFilter(
  toRef(props, "categories"),
  toRef(props, "searchQuery"),
);

const scrollAreaHeight = computed(() =>
  (props.searchQuery ?? "").trim()
    ? "calc(100vh - 380px)"
    : "calc(100vh - 340px)",
);
</script>

<style scoped lang="sass">
.category-tree-scope-select
  width: 100%

.category-tree
  .q-tree__node-header
    padding: 4px 0
</style>
