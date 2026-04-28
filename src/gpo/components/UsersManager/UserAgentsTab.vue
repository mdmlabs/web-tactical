<template>
  <div>
    <div class="row items-center justify-end no-wrap q-gutter-x-sm q-mb-xs">
      <slot name="toolbar-extra" />
      <q-btn
        flat
        dense
        color="secondary"
        icon="download"
        label=""
        :disable="loading || agents.length === 0"
        :loading="exportAgentStatusLoading"
        title="Export agents status"
        @click="handleExportAgentStatus"
      />
      <q-btn
        flat
        dense
        color="primary"
        icon="add_circle_outline"
        label=""
        :disable="!hasTarget"
        :title="!hasTarget ? noTargetHint : ''"
        @click="$emit('add-agent')"
      />
    </div>

    <div v-if="!loading" class="q-mb-xs">
      <q-input
        v-model="search"
        dense
        outlined
        placeholder="Search agents..."
        clearable
        style="max-width: 320px"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div v-if="loading" class="text-center q-pa-sm">
      <q-spinner color="primary" />
    </div>
    <div v-else-if="agents.length === 0" class="text-grey-6 text-caption">
      No agents
    </div>
    <q-table
      v-else
      :rows="filteredAgents"
      :columns="columns"
      row-key="id"
      flat
      dense
      :pagination="pagination"
      :rows-per-page-options="[10, 20, 50, 100]"
      separator="horizontal"
      class="users-agents-table"
      no-data-label="No agents"
      @row-click="(_, row) => $emit('open-agent-dashboard', row.id)"
    >
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center no-wrap q-gutter-x-sm">
            <q-icon name="laptop" color="primary" size="18px" />
            <div class="col">
              <div class="text-weight-medium">
                {{ props.row.name || props.row.id }}
              </div>
              <div
                v-if="props.row.name !== props.row.id"
                class="text-caption text-grey-6"
              >
                {{ props.row.id }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            v-if="props.row.status"
            :color="getStatusColor(props.row.status)"
            :label="props.row.status"
            class="text-capitalize"
            rounded
          />
          <span v-else class="text-grey-5">—</span>
        </q-td>
      </template>

      <template #body-cell-last_boot="props">
        <q-td :props="props">
          {{ props.row.last_boot ? formatDate(props.row.last_boot) : "—" }}
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            v-if="!hideRemove"
            flat
            round
            dense
            icon="remove_circle_outline"
            size="sm"
            color="negative"
            :loading="removingAgentId === props.row.id"
            title="Remove agent"
            @click.stop="$emit('remove-agent', props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { QTableColumn } from "quasar";
import { formatDate } from "@/utils/format";
import { agentServiceClientWrapper } from "@/gpo/api/grpc-client";
import export_pb from "@/generated/common/export_pb";
import { notifyError, notifySuccess } from "@/utils/notify";

export interface AgentRow {
  id: string;
  name: string;
  status?: string;
  last_boot?: string;
}

const props = withDefaults(
  defineProps<{
    agents: AgentRow[];
    loading: boolean;
    hasTarget: boolean;
    removingAgentId?: string | null;
    noTargetHint?: string;
    hideRemove?: boolean;
  }>(),
  {
    noTargetHint: "Select target first (click badge in header)",
    hideRemove: false,
  },
);

defineEmits<{
  "add-agent": [];
  "remove-agent": [agentId: string];
  "open-agent-dashboard": [agentId: string];
}>();

const exportAgentStatusLoading = ref(false);

function exportMimeType(format: export_pb.ExportFormat | number | undefined): string {
  if (format === export_pb.ExportFormat.XLSX) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  return "text/csv";
}

function exportExtension(format: export_pb.ExportFormat | number | undefined): string {
  if (format === export_pb.ExportFormat.XLSX) return "xlsx";
  return "csv";
}

function downloadBlob(content: Uint8Array | string, fileName: string, mimeType: string) {
  const bytes =
    typeof content === "string"
      ? new Uint8Array(Array.from(atob(content), (c) => c.codePointAt(0) ?? 0))
      : new Uint8Array(content);
  const blob = new Blob([bytes.buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function handleExportAgentStatus() {
  const agentIds = (props.agents ?? []).map((a) => String(a.id || "").trim()).filter(Boolean);
  if (agentIds.length === 0) return;

  exportAgentStatusLoading.value = true;
  try {
    const res = await agentServiceClientWrapper.exportAgentStatusFor("agents", {
      agentIds,
    });
    const ext = exportExtension(res.exportFormat);
    const fallbackName = `agent_status_${agentIds.length}_agents.${ext}`;
    downloadBlob(
      res.content,
      res.fileName || fallbackName,
      exportMimeType(res.exportFormat),
    );
    notifySuccess(
      res.exportFormat === export_pb.ExportFormat.XLSX
        ? "Agents status exported as XLSX"
        : "Agents status exported as CSV",
    );
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to export agents status",
    );
  } finally {
    exportAgentStatusLoading.value = false;
  }
}

function getStatusColor(status: string): string {
  const s = (status ?? "").toLowerCase().trim();
  if (s === "online" || s === "active" || s === "connected") return "positive";
  if (s === "offline" || s === "disconnected") return "negative";
  return "grey";
}

const search = ref("");
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: "name",
  descending: false,
});

const columns = computed<QTableColumn<AgentRow>[]>(() => [
  {
    name: "name",
    label: "Name",
    field: (row) => row.name || row.id,
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
    sortable: true,
  },
  {
    name: "last_boot",
    label: "Last boot",
    field: "last_boot",
    align: "left",
    sortable: true,
  },
  {
    name: "actions",
    label: "",
    field: (row) => row.id,
    align: "right",
    sortable: false,
  },
]);

const filteredAgents = computed(() => {
  const q = (search.value ?? "").trim().toLowerCase();
  if (!q) return props.agents;
  return props.agents.filter((a) => {
    const id = (a.id ?? "").toLowerCase();
    const name = (a.name ?? "").toLowerCase();
    const status = (a.status ?? "").toLowerCase();
    return id.includes(q) || name.includes(q) || status.includes(q);
  });
});
</script>

<style scoped lang="sass">
.users-agents-table
  :deep(tbody tr)
    cursor: pointer
</style>
