<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="cywm-scope cywm-agent-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Deploy: {{ filename }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="cywm-agent-dialog__label">Target agents:</div>

        <q-option-group
          v-model="mode"
          :options="modeOptions"
          type="radio"
          dense
          class="q-mb-md"
        />

        <template v-if="mode === 'specific'">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Search agents..."
            debounce="300"
            class="q-mb-sm"
            clearable
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div v-if="loading" class="cywm-agent-dialog__loading">
            <q-spinner-dots color="primary" size="24px" />
            <span>Loading agents...</span>
          </div>

          <div
            v-else-if="loadError"
            class="cywm-agent-dialog__error"
          >
            <span>Failed to load agents: {{ loadError }}</span>
            <q-btn
              flat
              dense
              no-caps
              size="sm"
              label="Retry"
              color="primary"
              @click="loadAgents"
            />
          </div>

          <div
            v-else-if="filteredAgents.length === 0 && windowsAgents.length === 0"
            class="cywm-agent-dialog__empty"
          >
            No Windows agents found
          </div>

          <div
            v-else-if="filteredAgents.length === 0"
            class="cywm-agent-dialog__empty"
          >
            No agents match "{{ searchQuery }}"
          </div>

          <q-list v-else dense class="cywm-agent-dialog__list">
            <q-item
              v-for="agent in filteredAgents"
              :key="agent.agent_id"
              tag="label"
              clickable
              dense
            >
              <q-item-section side>
                <q-checkbox
                  v-model="selectedIds"
                  :val="agent.agent_id"
                  dense
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="cywm-agent-dialog__hostname">
                  {{ agent.hostname }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="statusColor(agent.status)"
                  :label="agent.status"
                  dense
                />
              </q-item-section>
              <q-item-section side class="cywm-agent-dialog__site">
                {{ agent.site?.name ?? "" }}
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-if="offlineSelectedCount > 0"
            class="cywm-agent-dialog__warning"
          >
            <q-icon name="warning" color="warning" size="16px" />
            {{ offlineSelectedCount }} of the selected agents are offline.
            Deploy to offline agents will fail with timeout.
          </div>

          <div class="cywm-agent-dialog__count">
            Selected: {{ selectedIds.length }} agent(s)
          </div>
        </template>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat no-caps label="Cancel" v-close-popup />
        <q-btn
          unelevated
          no-caps
          label="Deploy"
          color="primary"
          icon-right="rocket_launch"
          :disable="mode === 'specific' && selectedIds.length === 0"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import { fetchAgents } from "@/api/agents";
import type { DeployRequest } from "@/cywm/types";

interface AgentEntry {
  agent_id: string;
  hostname: string;
  status: string;
  plat: string;
  site?: { id: number; name: string };
}

defineProps<{
  filename: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } =
  useDialogPluginComponent();

const mode = ref<"all" | "specific">("all");
const selectedIds = ref<string[]>([]);
const searchQuery = ref("");
const loading = ref(false);
const loadError = ref<string | null>(null);
const windowsAgents = ref<AgentEntry[]>([]);

const modeOptions = [
  { label: "All Windows agents", value: "all" },
  { label: "Select specific agents", value: "specific" },
];

function statusOrder(status: string): number {
  if (status === "online") return 0;
  if (status === "overdue") return 1;
  return 2;
}

function statusColor(status: string): string {
  if (status === "online") return "positive";
  if (status === "overdue") return "warning";
  return "grey";
}

const filteredAgents = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return windowsAgents.value;
  return windowsAgents.value.filter((a) =>
    a.hostname.toLowerCase().includes(q),
  );
});

const offlineSelectedCount = computed(() => {
  const ids = new Set(selectedIds.value);
  return windowsAgents.value.filter(
    (a) => ids.has(a.agent_id) && a.status !== "online",
  ).length;
});

async function loadAgents() {
  loading.value = true;
  loadError.value = null;
  try {
    const data = await fetchAgents();
    const agents = (data ?? []) as AgentEntry[];
    windowsAgents.value = agents
      .filter((a) => a.plat === "windows")
      .sort((a, b) => {
        const ord = statusOrder(a.status) - statusOrder(b.status);
        if (ord !== 0) return ord;
        return a.hostname.localeCompare(b.hostname);
      });
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

function onConfirm() {
  const body: DeployRequest = {};
  if (mode.value === "specific") {
    body.agent_ids = [...selectedIds.value];
  }
  onDialogOK(body);
}

onMounted(loadAgents);
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.cywm-agent-dialog {
  min-width: 560px;
  max-width: 680px;
}

.cywm-agent-dialog__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--cywm-text-secondary);
  margin-bottom: 8px;
}

.cywm-agent-dialog__list {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
}

.cywm-agent-dialog__hostname {
  font-family: var(--cywm-mono);
  font-size: 13px;
}

.cywm-agent-dialog__site {
  font-size: 12px;
  color: var(--cywm-text-secondary);
  min-width: 100px;
}

.cywm-agent-dialog__count {
  font-size: 12px;
  color: var(--cywm-text-secondary);
  margin-top: 8px;
}

.cywm-agent-dialog__warning {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--cywm-warning);
  margin-top: 8px;
}

.cywm-agent-dialog__loading,
.cywm-agent-dialog__error,
.cywm-agent-dialog__empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 13px;
  color: var(--cywm-text-secondary);
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
  justify-content: center;
}

.cywm-agent-dialog__error {
  color: var(--cywm-danger);
}
</style>
