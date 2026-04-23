<template>
  <span :class="['uk-status-dot', `uk-status-dot--${status}`]"></span>
</template>

<script setup lang="ts">
defineProps<{
  status: "online" | "offline" | "warning" | "error";
}>();
</script>
