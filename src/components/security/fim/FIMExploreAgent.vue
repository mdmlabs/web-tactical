<template>
  <q-dialog v-model="open" @hide="$emit('close')">
    <q-card class="explore-agent-card">
      <q-card-section class="explore-header">
        <div class="explore-title">Explore agent</div>
        <q-btn flat round dense icon="close" @click="open = false" />
      </q-card-section>

      <!-- Search bar -->
      <q-card-section class="explore-search-section">
        <div class="explore-search-row">
          <q-input
            v-model="searchText"
            dense
            outlined
            placeholder="Search"
            class="explore-search-input"
            clearable
          />
          <q-btn flat dense no-caps label="WQL" class="wql-btn" />
        </div>
      </q-card-section>

      <q-card-section class="explore-table-section">
        <q-table
          :rows="filteredAgents"
          :columns="columns"
          row-key="id"
          flat
          dense
          :pagination="pagination"
          separator="horizontal"
          class="explore-table"
          @row-click="onRowClick"
        >
          <!-- ID with sort indicator -->
          <template #body-cell-id="props">
            <q-td :props="props" class="cell-id">{{ props.row.id }}</q-td>
          </template>

          <!-- Name -->
          <template #body-cell-name="props">
            <q-td :props="props">{{ props.row.name }}</q-td>
          </template>

          <!-- Group -->
          <template #body-cell-group="props">
            <q-td :props="props">
              <template v-if="props.row.group?.length">
                <q-badge
                  v-for="g in props.row.group.slice(0, 1)"
                  :key="g"
                  outline
                  color="grey-7"
                  :label="g"
                  class="group-badge"
                />
                <q-badge
                  v-if="props.row.group.length > 1"
                  outline
                  color="grey-7"
                  :label="`+${props.row.group.length - 1} more`"
                  class="group-badge"
                />
              </template>
              <span v-else class="text-grey-5">-</span>
            </q-td>
          </template>

          <!-- Version -->
          <template #body-cell-version="props">
            <q-td :props="props">{{ props.row.version || '-' }}</q-td>
          </template>

          <!-- Operating system -->
          <template #body-cell-os="props">
            <q-td :props="props">
              <div v-if="props.row.os?.name" class="os-cell">
                <q-icon :name="osIcon(props.row.os)" size="16px" class="q-mr-xs" />
                {{ props.row.os.name }}
                {{ props.row.os.version ? props.row.os.version : '' }}
              </div>
              <span v-else class="text-grey-5">-</span>
            </q-td>
          </template>

          <!-- Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <div class="status-cell">
                <span :class="['status-dot', `status-dot--${props.row.status}`]" />
                <span>{{ props.row.status }}</span>
                <q-icon name="info_outline" size="14px" color="grey-5" class="q-ml-xs" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWazuhStore } from "@/stores/wazuh";
import { useFimStore } from "@/stores/fim";
import type { WazuhAgent, WazuhAgentOS } from "@/types/wazuh";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select", agentId: string): void;
}>();

const wazuhStore = useWazuhStore();
const fimStore = useFimStore();

const open = ref(true);
const searchText = ref("");
const pagination = ref({ rowsPerPage: 0 }); // show all

const columns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true },
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "group", label: "Group", field: "group", align: "left" as const },
  { name: "version", label: "Version", field: "version", align: "left" as const, sortable: true },
  { name: "os", label: "Operating system", field: "os", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "left" as const, sortable: true },
];

const agents = computed(() =>
  wazuhStore.wazuhAgents.filter((a) => a.id !== "000"),
);

const filteredAgents = computed(() => {
  if (!searchText.value) return agents.value;
  const needle = searchText.value.toLowerCase();
  return agents.value.filter(
    (a) =>
      a.id.includes(needle) ||
      a.name.toLowerCase().includes(needle) ||
      a.ip?.toLowerCase().includes(needle) ||
      a.group?.some((g) => g.toLowerCase().includes(needle)) ||
      a.os?.name?.toLowerCase().includes(needle) ||
      a.status?.toLowerCase().includes(needle),
  );
});

function osIcon(os?: WazuhAgentOS): string {
  if (!os?.platform) return "computer";
  const p = os.platform.toLowerCase();
  if (p.includes("windows") || p === "win32") return "laptop_windows";
  if (p.includes("darwin") || p === "macos") return "laptop_mac";
  if (p.includes("linux") || p.includes("amazon") || p.includes("ubuntu") || p.includes("centos") || p.includes("debian"))
    return "computer";
  return "computer";
}

function onRowClick(_: Event, row: WazuhAgent) {
  fimStore.setAgent(row.id);
  emit("select", row.id);
  open.value = false;
}

onMounted(async () => {
  if (!wazuhStore.wazuhAgents.length) {
    await wazuhStore.fetchAgents();
  }
});
</script>

<style scoped>
.explore-agent-card {
  width: 900px;
  max-width: 95vw;
  max-height: 85vh;
  border-radius: 8px;
}

.explore-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.explore-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--mdm-text-primary, #1a1a1a);
}

.explore-search-section {
  padding: 0 24px 12px;
}

.explore-search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.explore-search-input {
  flex: 1;
}

.explore-search-input :deep(.q-field__control) {
  height: 36px;
  min-height: 36px;
  font-size: 13px;
}

.wql-btn {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
  font-size: 13px;
}

.explore-table-section {
  padding: 0;
  overflow: auto;
}

.explore-table {
  background: transparent;
}

.explore-table :deep(.q-table th) {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 16px;
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
  white-space: nowrap;
}

.explore-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 14px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.explore-table :deep(tbody tr) {
  cursor: pointer;
}

.explore-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.04);
}

.cell-id {
  font-weight: 500;
}

.group-badge {
  font-size: 11px;
  padding: 2px 8px;
  margin-right: 4px;
  border-radius: 4px;
}

.os-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot--active {
  background-color: #47c68e;
}

.status-dot--disconnected {
  background-color: #ff645c;
}

.status-dot--pending {
  background-color: #fdbc40;
}

.status-dot--never_connected {
  background-color: #999;
}

/* Dark mode */
.body--dark .explore-agent-card {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .explore-title {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .explore-table :deep(.q-table th) {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .explore-table :deep(.q-table td) {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}
</style>
