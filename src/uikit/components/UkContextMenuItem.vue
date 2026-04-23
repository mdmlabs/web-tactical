<template>
  <button
    :class="[
      'uk-context-menu__item',
      { 'uk-context-menu__item--danger': danger },
    ]"
    @click="$emit('click')"
  >
    <q-icon v-if="icon" :name="icon" size="16px" />
    <span><slot /></span>
    <kbd v-if="shortcut" class="uk-context-menu__shortcut">{{ shortcut }}</kbd>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    shortcut?: string;
    danger?: boolean;
  }>(),
  {
    icon: undefined,
    shortcut: undefined,
    danger: false,
  },
);

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.uk-context-menu__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  width: 100%;
  padding: var(--uk-space-2) var(--uk-space-3);
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  cursor: pointer;
  text-align: left;
  transition: background var(--uk-transition-fast);
}

.uk-context-menu__item:hover {
  background: var(--uk-bg-hover);
}

.uk-context-menu__item--danger {
  color: var(--uk-error-text);
}

.uk-context-menu__item--danger:hover {
  background: var(--uk-error-soft);
}

.uk-context-menu__shortcut {
  margin-left: auto;
  font-size: 10px;
  color: var(--uk-text-tertiary);
  border: 1px solid var(--uk-border-default);
  border-radius: 3px;
  padding: 0 4px;
  font-family: var(--uk-font-family);
}
</style>
