<template>
  <div class="mdm-card" style="height: 100%">
    <div class="mdm-card__header">
      <span>Agent Locations</span>
      <q-btn
        flat
        dense
        round
        icon="open_in_full"
        size="sm"
        @click="$router.push({ name: 'AgentMap' })"
      >
        <q-tooltip>Full Map View</q-tooltip>
      </q-btn>
    </div>
    <div class="mdm-card__content" style="padding: 0; height: 350px">
      <DashboardMiniMap style="height: 100%" />
    </div>
  </div>
</template>

<script setup>
import DashboardMiniMap from "@/components/agents/DashboardMiniMap.vue";
</script>
