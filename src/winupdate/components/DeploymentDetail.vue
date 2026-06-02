<template>
  <div class="winupdate-detail">
    <!-- Loading skeleton -->
    <div v-if="loading && !detail" class="winupdate-detail__loading">
      <q-spinner color="primary" size="32px" />
    </div>

    <template v-else-if="detail">
      <!-- Header stats -->
      <div class="winupdate-detail-header">
        <div class="winupdate-detail-header__title">
          Deployment #{{ detail.id }}
          <UkBadge
            :variant="statusVariant(detail.status)"
            class="q-ml-sm"
          >{{ detail.status }}</UkBadge>
          <q-spinner
            v-if="detail.status !== 'completed'"
            size="16px"
            color="primary"
            class="q-ml-sm"
          />
        </div>
        <div class="winupdate-detail-header__meta">
          Created by <strong>{{ detail.created_by }}</strong>
          on {{ formatDate(detail.created_at) }}
        </div>
      </div>

      <div class="winupdate-stats-row">
        <div class="winupdate-stat">
          <div class="winupdate-stat__value">{{ detail.total_agents }}</div>
          <div class="winupdate-stat__label">Total</div>
        </div>
        <div class="winupdate-stat">
          <div class="winupdate-stat__value winupdate-stat__value--blue">
            {{ detail.dispatched_count }}
          </div>
          <div class="winupdate-stat__label">Dispatched</div>
        </div>
        <div class="winupdate-stat">
          <div
            class="winupdate-stat__value"
            :class="detail.failed_count > 0 ? 'winupdate-stat__value--red' : ''"
          >
            {{ detail.failed_count }}
          </div>
          <div class="winupdate-stat__label">Failed</div>
        </div>
        <div class="winupdate-stat">
          <div class="winupdate-stat__value winupdate-stat__value--green">
            {{ installedCount }}
          </div>
          <div class="winupdate-stat__label">Installed</div>
        </div>
      </div>

      <!-- Agents table -->
      <q-table
        :rows="detail.agents"
        :columns="agentColumns"
        row-key="id"
        dense
        flat
        class="winupdate-table"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <UkBadge :variant="agentStatusVariant(props.value)">
              {{ props.value }}
            </UkBadge>
          </q-td>
        </template>

        <template #body-cell-logs="props">
          <q-td :props="props" auto-width>
            <q-btn
              v-if="props.row.history_id"
              flat
              dense
              no-caps
              size="sm"
              icon="terminal"
              label="View logs"
              @click="openLogs(props.row)"
            />
            <span v-else class="text-grey-5">—</span>
          </q-td>
        </template>
      </q-table>
    </template>

    <div v-else class="winupdate-detail__error">
      Failed to load deployment details.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import {
  fetchDeploymentDetail,
  type DeploymentDetail,
  type DeploymentAgent,
  type DeploymentStatus,
  type AgentPatchStatus,
} from "@/api/winupdatePatches";
import UkBadge from "@/uikit/components/UkBadge.vue";
import AgentLogsModal from "@/winupdate/components/AgentLogsModal.vue";

const props = defineProps<{ deploymentId: number }>();

const $q = useQuasar();

const detail = ref<DeploymentDetail | null>(null);
const loading = ref(false);
let pollTimer: ReturnType<typeof setTimeout> | null = null;

const installedCount = computed(
  () => detail.value?.agents.filter((a) => a.status === "installed").length ?? 0,
);

const agentColumns = [
  {
    name: "hostname",
    label: "Hostname",
    field: "agent__hostname",
    sortable: true,
    align: "left" as const,
  },
  {
    name: "agent_id",
    label: "Agent ID",
    field: "agent__agent_id",
    sortable: true,
    align: "left" as const,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    sortable: true,
    align: "left" as const,
  },
  {
    name: "updated_at",
    label: "Updated at",
    field: "updated_at",
    sortable: true,
    align: "left" as const,
    format: (v: string) => (v ? new Date(v).toLocaleString() : "—"),
  },
  {
    name: "logs",
    label: "Logs",
    field: "history_id",
    align: "left" as const,
  },
];

type BadgeVariant = "neutral" | "primary" | "info" | "warning" | "success" | "error";

function statusVariant(status: DeploymentStatus): BadgeVariant {
  if (status === "completed") return "success";
  if (status === "running") return "primary";
  return "neutral";
}

function agentStatusVariant(status: AgentPatchStatus): BadgeVariant {
  switch (status) {
    case "installed":
      return "success";
    case "dispatched":
      return "info";
    case "downloading":
      return "warning";
    case "installing":
      return "warning";
    case "nats_failed":
    case "script_failed":
      return "error";
    default:
      return "neutral";
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

async function loadDetail() {
  loading.value = true;
  try {
    detail.value = await fetchDeploymentDetail(props.deploymentId);
  } catch {
    // ignore; error handled in template
  } finally {
    loading.value = false;
  }
}

function schedulePoll() {
  if (detail.value?.status === "completed") return;
  pollTimer = setTimeout(async () => {
    await loadDetail();
    schedulePoll();
  }, 3000);
}

function openLogs(agent: DeploymentAgent) {
  $q.dialog({
    component: AgentLogsModal,
    componentProps: {
      agentId: agent.agent__agent_id,
      historyId: agent.history_id,
      hostname: agent.agent__hostname,
    },
  });
}

onMounted(async () => {
  await loadDetail();
  schedulePoll();
});

onUnmounted(() => {
  if (pollTimer !== null) clearTimeout(pollTimer);
});
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.winupdate-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.winupdate-detail__loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.winupdate-detail__error {
  color: var(--cywm-danger);
  padding: 16px;
}

.winupdate-detail-header {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 6px;
  padding: 16px 20px;

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--cywm-text-primary);
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  &__meta {
    font-size: 13px;
    color: var(--cywm-text-secondary);
  }
}

.winupdate-stats-row {
  display: flex;
  gap: 12px;
}

.winupdate-stat {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 6px;
  padding: 14px 20px;
  min-width: 100px;

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: var(--cywm-text-primary);
    line-height: 1;

    &--blue { color: var(--cywm-accent); }
    &--green { color: var(--cywm-success); }
    &--red { color: var(--cywm-danger); }
  }

  &__label {
    font-size: 12px;
    color: var(--cywm-text-secondary);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.winupdate-table {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 6px;
}
</style>
