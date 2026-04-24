<template>
  <div class="wazuh-embed">
    <iframe
      :src="dashboardUrl"
      class="wazuh-iframe"
      frameborder="0"
      allow="clipboard-read; clipboard-write"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const dashboardUrl = computed(() => {
  const base =
    typeof window !== "undefined" && window._env_?.PROD_URL
      ? window._env_.PROD_URL
      : "";
  return `${base}/wazuh-dashboard/app/wazuh`;
});
</script>

<style scoped>
.wazuh-embed {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
}

.wazuh-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
