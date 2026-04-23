<template>
  <div :class="['uk-stat-card', `uk-stat-card--${color}`]">
    <div class="uk-stat-card__header">
      <q-icon :name="icon" size="18px" class="uk-stat-card__icon" />
      <span class="uk-stat-card__label">{{ label }}</span>
    </div>
    <div class="uk-stat-card__value">{{ value }}</div>
    <div
      v-if="trend"
      :class="[
        'uk-stat-card__trend',
        trendUp ? 'uk-stat-card__trend--up' : 'uk-stat-card__trend--down',
      ]"
    >
      <q-icon :name="trendUp ? 'trending_up' : 'trending_down'" size="12px" />
      {{ trend }}
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    icon: string;
    color?: string;
    trend?: string;
    trendUp?: boolean;
  }>(),
  {
    color: "primary",
    trend: undefined,
    trendUp: true,
  },
);
</script>

<style scoped>
.uk-stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--uk-space-3);
  margin-bottom: var(--uk-space-6);
}

.uk-stat-card {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  transition: all var(--uk-transition-base);
}

.uk-stat-card:hover {
  border-color: var(--uk-border-strong);
  box-shadow: var(--uk-shadow-sm);
}

.uk-stat-card__header {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  margin-bottom: var(--uk-space-2);
}

.uk-stat-card__icon {
  color: var(--uk-text-tertiary);
}

.uk-stat-card--primary .uk-stat-card__icon { color: var(--uk-primary); }
.uk-stat-card--success .uk-stat-card__icon { color: var(--uk-success); }
.uk-stat-card--warning .uk-stat-card__icon { color: var(--uk-warning); }
.uk-stat-card--error .uk-stat-card__icon { color: var(--uk-error); }
.uk-stat-card--info .uk-stat-card__icon { color: var(--uk-info); }

.uk-stat-card__label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-secondary);
}

.uk-stat-card__value {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
  letter-spacing: -0.02em;
}

.uk-stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--uk-text-xs);
  margin-top: var(--uk-space-1);
}

.uk-stat-card__trend--up { color: var(--uk-success-text); }
.uk-stat-card__trend--down { color: var(--uk-warning-text); }
</style>
