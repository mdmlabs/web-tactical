<template>
  <div class="nist-agent-selector">
    <q-select
      v-model="selectedAgent"
      :options="agentOptions"
      label="Explore agent"
      dense
      outlined
      emit-value
      map-options
      clearable
      use-input
      input-debounce="200"
      :loading="wazuhStore.agentsLoading"
      class="agent-select"
      @filter="filterAgents"
      @update:model-value="onAgentChange"
    >
      <template #prepend>
        <q-icon name="wifi_tethering" size="18px" />
      </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">No agents found</q-item-section>
        </q-item>
      </template>
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon
              :name="scope.opt.platform === 'windows' ? 'laptop_windows' : scope.opt.platform === 'darwin' ? 'laptop_mac' : 'computer'"
              size="18px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label caption>ID: {{ scope.opt.value }} &middot; {{ scope.opt.ip }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              :color="scope.opt.status === 'active' ? 'green' : 'grey'"
              :label="scope.opt.status"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWazuhStore } from "@/stores/wazuh";
import { useNist80053Store } from "@/stores/nist80053";

const wazuhStore = useWazuhStore();
const nistStore = useNist80053Store();

const selectedAgent = ref<string | null>(nistStore.selectedAgent?.id ?? null);

interface AgentOption {
  label: string;
  value: string;
  ip: string;
  platform: string;
  status: string;
}

const allAgentOptions = computed<AgentOption[]>(() =>
  wazuhStore.wazuhAgents
    .filter((a) => a.id !== "000")
    .map((a) => ({
      label: `${a.name} (${a.id})`,
      value: a.id,
      ip: a.ip ?? "",
      platform: a.os?.platform ?? "unknown",
      status: a.status,
    })),
);

const agentOptions = ref<AgentOption[]>([]);

function filterAgents(
  val: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    const needle = val.toLowerCase();
    if (!needle) {
      agentOptions.value = allAgentOptions.value;
    } else {
      agentOptions.value = allAgentOptions.value.filter(
        (o) =>
          o.label.toLowerCase().includes(needle) ||
          o.value.includes(needle) ||
          o.ip.includes(needle),
      );
    }
  });
}

function onAgentChange(agentId: string | null) {
  if (agentId === null) {
    nistStore.setSelectedAgent(null);
  } else {
    const agent = wazuhStore.wazuhAgents.find((a) => a.id === agentId);
    if (agent) {
      nistStore.setSelectedAgent({ id: agent.id, name: agent.name });
    }
  }
}

onMounted(async () => {
  if (!wazuhStore.wazuhAgents.length) {
    await wazuhStore.fetchAgents();
  }
  agentOptions.value = allAgentOptions.value;
});
</script>

<style scoped>
.nist-agent-selector {
  display: flex;
  align-items: center;
}

.agent-select {
  min-width: 280px;
  max-width: 380px;
}

.agent-select :deep(.q-field__control) {
  height: 36px;
  min-height: 36px;
  font-size: 13px;
}
</style>
