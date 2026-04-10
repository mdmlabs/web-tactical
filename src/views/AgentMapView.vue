<template>
  <q-page class="agent-map-page">
    <AgentMap />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import AgentMap from "@/components/agents/AgentMap.vue";

export default defineComponent({
  name: "AgentMapView",
  components: {
    AgentMap,
  },
});
</script>

<style scoped>
.agent-map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 52px);
}
</style>
