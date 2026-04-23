<template>
  <teleport to="body">
    <transition name="uk-fade">
      <div v-if="show" class="uk-context-menu__overlay" @click="$emit('close')"></div>
    </transition>
    <transition name="uk-context-appear">
      <div
        v-if="show"
        class="uk-context-menu"
        :style="{ top: y + 'px', left: x + 'px' }"
        @click.stop
      >
        <div v-if="title" class="uk-context-menu__header">{{ title }}</div>
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  x: number;
  y: number;
  title?: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.uk-context-menu {
  position: fixed;
  z-index: var(--uk-z-dropdown);
  min-width: 200px;
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  box-shadow: var(--uk-shadow-lg);
  padding: var(--uk-space-1);
  animation: uk-context-appear 0.12s ease-out;
}

@keyframes uk-context-appear {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.uk-context-menu__overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--uk-z-dropdown) - 1);
}

.uk-context-menu__header {
  padding: var(--uk-space-2) var(--uk-space-3);
  font-size: var(--uk-text-xs);
  font-weight: 600;
  color: var(--uk-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
