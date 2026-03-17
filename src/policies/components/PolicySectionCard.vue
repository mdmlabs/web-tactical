<template>
  <div class="section-card">
    <div class="card-header">
      <div class="card-title">
        <span>{{ title }}</span>
        <span class="card-count">({{ count }})</span>
      </div>
      <q-btn
        flat
        dense
        color="primary"
        label="View"
        class="view-btn"
        @click="$emit('view')"
      />
    </div>

    <div class="card-content">
      <template v-if="count === 0">
        <p class="empty-text">{{ emptyText }}</p>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  count: number;
  emptyText?: string;
}>();

defineEmits<{
  (e: "view"): void;
}>();
</script>

<style scoped>
.section-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.card-count {
  color: var(--text-secondary, #6b7280);
  font-weight: 400;
  margin-left: 4px;
}

.view-btn {
  text-transform: none;
  font-weight: 600;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
  text-align: center;
}

/* Dark theme */
.body--dark .section-card {
  --card-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}
</style>
