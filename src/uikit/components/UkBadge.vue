<template>
  <span :class="classes"><slot /></span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "success" | "warning" | "error" | "info" | "neutral" | "primary";
  }>(),
  {
    variant: "neutral",
  },
);

const classes = computed(() => ["uk-badge", `uk-badge--${props.variant}`]);
</script>
