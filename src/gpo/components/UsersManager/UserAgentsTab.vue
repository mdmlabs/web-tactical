<template>
  <div>
    <div class="text-subtitle2 q-mb-md">Effective agents</div>
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" />
    </div>
    <div v-else-if="agents.length === 0" class="text-grey-6 text-caption">
      No agents
    </div>
    <q-list v-else bordered separator>
      <q-item v-for="agentId in agents" :key="agentId">
        <q-item-section avatar>
          <q-icon name="dns" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ agentId }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  agents: string[];
  loading: boolean;
}>();
</script>
