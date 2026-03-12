<template>
  <div class="resources-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Resources</h2>
      <p class="sidebar-description">
        Resources can be a variety of file types, used in devices and policies.
        <a href="#" class="read-more-link" @click.prevent="openDocs">Read more <q-icon name="open_in_new" size="12px" /></a>
      </p>
    </div>

    <q-list class="category-list">
      <q-item
        v-for="category in categories"
        :key="category.id"
        clickable
        :class="['category-item', { 'category-item--active': category.id === currentCategory }]"
        @click="$emit('select', category.id)"
      >
        <q-item-section avatar class="category-icon-section">
          <q-icon :name="category.icon" size="20px" />
        </q-item-section>
        <q-item-section class="category-label-section">
          {{ category.label }}
        </q-item-section>
        <q-item-section side class="category-count-section">
          <q-badge
            :label="category.count"
            :class="['category-badge', { 'category-badge--active': category.id === currentCategory }]"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type { ResourceType } from '../types/resources';

interface CategoryWithCount {
  id: ResourceType;
  label: string;
  icon: string;
  count: number;
}

defineProps<{
  categories: CategoryWithCount[];
  currentCategory: ResourceType;
}>();

defineEmits<{
  (e: 'select', category: ResourceType): void;
}>();

function openDocs() {
  window.open('https://docs.example.com/resources', '_blank');
}
</script>

<style scoped>
.resources-sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--sidebar-bg, #ffffff);
  border-right: 1px solid var(--border-color, #e8e8e8);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border-color, #e8e8e8);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 8px 0;
}

.sidebar-description {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  line-height: 1.5;
}

.read-more-link {
  color: var(--primary-color, #1089d3);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.read-more-link:hover {
  text-decoration: underline;
}

.category-list {
  padding: 12px 8px;
  flex: 1;
}

.category-item {
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 12px 12px;
  min-height: 44px;
  transition: all 0.15s ease;
}

.category-item:hover {
  background: var(--hover-bg, #f5f7fa);
}

.category-item--active {
  background: var(--active-bg, #eef6fc);
  border-left: 3px solid var(--primary-color, #1089d3);
  padding-left: 9px;
}

.category-item--active .category-icon-section :deep(.q-icon),
.category-item--active .category-label-section {
  color: var(--primary-color, #1089d3);
}

.category-icon-section {
  min-width: 32px;
}

.category-icon-section :deep(.q-icon) {
  color: var(--text-secondary, #6b7280);
}

.category-label-section {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.category-count-section {
  min-width: auto;
}

.category-badge {
  background: var(--badge-bg, #e5e7eb);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.category-badge--active {
  background: var(--primary-color, #1089d3);
  color: white;
}

/* Dark theme */
.body--dark .resources-sidebar {
  --sidebar-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --badge-bg: #3d3d4d;
}
</style>
