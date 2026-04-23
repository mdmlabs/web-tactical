<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
    size?: "sm" | "md";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
  },
);

const classes = computed(() => [
  "uk-btn",
  `uk-btn--${props.variant}`,
  props.size === "sm" ? "uk-btn--sm" : "",
]);
</script>
