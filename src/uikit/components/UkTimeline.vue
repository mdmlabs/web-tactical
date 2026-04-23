<template>
  <div class="uk-timeline">
    <div
      v-for="event in events"
      :key="event.action + event.time"
      class="uk-timeline__item"
    >
      <div :class="['uk-timeline__dot', `uk-timeline__dot--${event.type}`]"></div>
      <div class="uk-timeline__content">
        <div class="uk-timeline__header">
          <span class="uk-timeline__action">{{ event.action }}</span>
          <span class="uk-timeline__time">{{ event.time }}</span>
        </div>
        <div class="uk-timeline__detail">{{ event.detail }}</div>
        <div v-if="event.user" class="uk-timeline__user">by {{ event.user }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TimelineEvent {
  action: string;
  detail: string;
  type: string;
  time: string;
  user?: string;
}

defineProps<{
  events: TimelineEvent[];
}>();
</script>

<style scoped>
.uk-timeline {
  position: relative;
  padding-left: var(--uk-space-6);
}

.uk-timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--uk-border-default);
}

.uk-timeline__item {
  position: relative;
  padding-bottom: var(--uk-space-5);
}

.uk-timeline__item:last-child {
  padding-bottom: 0;
}

.uk-timeline__dot {
  position: absolute;
  left: calc(-1 * var(--uk-space-6) + 3px);
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--uk-text-tertiary);
  border: 2px solid var(--uk-bg-base);
  z-index: 1;
}

.uk-timeline__dot--success { background: var(--uk-success); }
.uk-timeline__dot--warning { background: var(--uk-warning); }
.uk-timeline__dot--error { background: var(--uk-error); }
.uk-timeline__dot--info { background: var(--uk-info); }

.uk-timeline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--uk-space-1);
}

.uk-timeline__action {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

.uk-timeline__time {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
}

.uk-timeline__detail {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-timeline__user {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: 4px;
}
</style>
