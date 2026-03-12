<template>
  <div class="policies-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Policies</h2>
      <p class="sidebar-description">
        Policies are the way to share configurations and apps across your devices.
        <a href="#" class="read-more-link" @click.prevent="openDocs">
          Read more <q-icon name="open_in_new" size="12px" />
        </a>
      </p>
    </div>

    <q-list class="platform-list">
      <q-item
        v-for="platform in platforms"
        :key="platform.id"
        clickable
        :disable="platform.disabled"
        :class="[
          'platform-item',
          { 'platform-item--active': platform.id === currentPlatform },
          { 'platform-item--disabled': platform.disabled }
        ]"
        @click="!platform.disabled && $emit('select', platform.id)"
      >
        <q-item-section avatar class="platform-icon-section">
          <q-icon :name="getPlatformIcon(platform.id)" size="20px" />
        </q-item-section>
        <q-item-section class="platform-label-section">
          {{ platform.label }} policies
        </q-item-section>
        <q-item-section side class="platform-count-section">
          <q-badge
            :label="platform.count"
            :class="[
              'platform-badge',
              { 'platform-badge--active': platform.id === currentPlatform }
            ]"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type { Platform } from '../types/policies';

interface PlatformWithCount {
  id: Platform;
  label: string;
  count: number;
  disabled: boolean;
}

defineProps<{
  platforms: PlatformWithCount[];
  currentPlatform: Platform;
}>();

defineEmits<{
  (e: 'select', platform: Platform): void;
}>();

function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'apple':
      return 'mdi-apple';
    case 'android':
      return 'mdi-android';
    case 'windows':
      return 'mdi-microsoft-windows';
    default:
      return 'devices';
  }
}

function openDocs() {
  window.open('https://docs.example.com/policies', '_blank');
}
</script>

<style scoped>
.policies-sidebar {
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
  color: var(--primary-color, #3b82f6);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.read-more-link:hover {
  text-decoration: underline;
}

.platform-list {
  padding: 12px 8px;
  flex: 1;
}

.platform-item {
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 12px 12px;
  min-height: 44px;
  transition: all 0.15s ease;
}

.platform-item:hover:not(.platform-item--disabled) {
  background: var(--hover-bg, #f5f7fa);
}

.platform-item--active {
  background: var(--active-bg, #eef6fc);
  border-left: 3px solid var(--primary-color, #3b82f6);
  padding-left: 9px;
}

.platform-item--active .platform-icon-section :deep(.q-icon),
.platform-item--active .platform-label-section {
  color: var(--primary-color, #3b82f6);
}

.platform-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.platform-icon-section {
  min-width: 32px;
}

.platform-icon-section :deep(.q-icon) {
  color: var(--text-secondary, #6b7280);
}

.platform-label-section {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
}

.platform-count-section {
  min-width: auto;
}

.platform-badge {
  background: var(--badge-bg, #e5e7eb);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.platform-badge--active {
  background: var(--primary-color, #3b82f6);
  color: white;
}

/* Dark theme */
.body--dark .policies-sidebar {
  --sidebar-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --badge-bg: #3d3d4d;
}
</style>
