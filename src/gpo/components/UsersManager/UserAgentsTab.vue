<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="text-subtitle2">Effective agents</div>
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        icon="add_circle_outline"
        label=""
        :disable="!hasTarget"
        :title="!hasTarget ? 'Select target first (click badge in header)' : ''"
        @click="$emit('add-agent')"
      />
    </div>
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" />
    </div>
    <div v-else-if="agents.length === 0" class="text-grey-6 text-caption">
      No agents
    </div>
    <q-list v-else bordered separator>
      <q-item
        v-for="agent in agents"
        :key="agent.id"
        class="row items-center cursor-pointer"
        clickable
        @click="$emit('open-agent-dashboard', agent.id)"
      >
        <q-item-section avatar>
          <q-icon name="laptop" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ agent.name }}</q-item-label>
          <q-item-label v-if="agent.name !== agent.id" caption class="text-grey-6">
            {{ agent.id }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            dense
            icon="remove_circle_outline"
            size="sm"
            color="negative"
            :loading="removingAgentId === agent.id"
            title="Remove agent"
            @click.stop="$emit('remove-agent', agent.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
export interface AgentRow {
  id: string;
  name: string;
}

defineProps<{
  agents: AgentRow[];
  loading: boolean;
  hasTarget: boolean;
  removingAgentId?: string | null;
}>();

defineEmits<{
  "add-agent": [];
  "remove-agent": [agentId: string];
  "open-agent-dashboard": [agentId: string];
}>();
</script>
