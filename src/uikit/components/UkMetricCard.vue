<template>
  <div class="uk-metric-card">
    <div class="uk-metric-card__label">{{ label }}</div>
    <div v-if="$slots.default" class="uk-metric-card__value">
      <slot />
    </div>
    <div v-else class="uk-metric-card__value">
      <span :class="['uk-metric-card__number', colorClass]">{{ value }}</span>
    </div>
    <div v-if="barValue !== undefined" class="uk-metric-card__bar">
      <div
        class="uk-metric-card__bar-fill"
        :style="{ width: barValue + '%', background: barColor || getMetricColor(barValue) }"
      ></div>
    </div>
    <div v-if="sub" class="uk-metric-card__sub">{{ sub }}</div>
    <slot name="sub" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value?: string | number;
    barValue?: number;
    barColor?: string;
    sub?: string;
    colorClass?: string;
  }>(),
  {
    value: undefined,
    barValue: undefined,
    barColor: undefined,
    sub: undefined,
    colorClass: undefined,
  },
);

function getMetricColor(value: number): string {
  if (value > 85) return "var(--uk-error)";
  if (value > 65) return "var(--uk-warning)";
  return "var(--uk-success)";
}
</script>

<style scoped>
.uk-metric-card {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
}

.uk-metric-card__label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-tertiary);
  margin-bottom: var(--uk-space-2);
}

.uk-metric-card__value {
  margin-bottom: var(--uk-space-2);
}

.uk-metric-card__number {
  font-size: var(--uk-text-xl);
  font-weight: 700;
  color: var(--uk-text-primary);
}

.uk-metric-card__bar {
  height: 4px;
  border-radius: 2px;
  background: var(--uk-bg-overlay);
  overflow: hidden;
}

.uk-metric-card__bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.uk-metric-card__sub {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: var(--uk-space-1);
}
</style>
