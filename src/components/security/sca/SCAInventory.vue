<template>
  <div class="sca-inventory">
    <!-- No agent selected -->
    <div v-if="!scaStore.hasAgent" class="sca-no-agent">
      <q-icon name="wifi_tethering" size="64px" color="grey-5" />
      <h5 class="q-mt-md q-mb-sm">No agent is selected</h5>
      <p class="text-grey-7">
        You need to select an agent to see Security Configuration Assessment inventory.
      </p>
      <q-btn
        color="primary"
        label="Select agent"
        no-caps
        unelevated
        @click="$emit('select-agent')"
      />
    </div>

    <!-- Has agent: show policy table + checks -->
    <div v-else class="sca-inventory-content">
      <!-- Policies summary table -->
      <q-card flat bordered class="sca-inv-card q-mb-md">
        <q-table
          :rows="scaStore.policies"
          :columns="policyColumns"
          row-key="policy_id"
          flat
          dense
          :loading="scaStore.dashboardLoading"
          :pagination="policyPagination"
          @update:pagination="(p: typeof policyPagination) => policyPagination = p"
          class="sca-policy-table"
          @row-click="onPolicyClick"
        >
          <template #body-cell-score="props">
            <q-td :props="props">
              <span :style="{ color: scoreColor(props.row.score) }">
                {{ props.row.score }}%
              </span>
            </q-td>
          </template>
          <template #body-cell-end_scan="props">
            <q-td :props="props">
              {{ formatDate(props.row.end_scan) }}
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Checks detail section -->
      <q-card v-if="scaStore.selectedPolicyId" flat bordered class="sca-inv-card">
        <q-card-section class="sca-checks-header">
          <div class="sca-checks-title">
            <span class="text-subtitle1 text-weight-medium">
              Checks ({{ scaStore.checksTotal }})
            </span>
            <q-select
              v-model="selectedPolicy"
              :options="scaStore.policyOptions"
              dense
              outlined
              emit-value
              map-options
              class="sca-policy-select"
              @update:model-value="onPolicySelect"
            />
          </div>
          <div class="sca-checks-actions">
            <q-input
              v-model="scaStore.inventorySearch"
              dense
              outlined
              placeholder="Search..."
              clearable
              class="sca-check-search"
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-btn
              flat
              dense
              no-caps
              icon="refresh"
              label="Refresh"
              :loading="scaStore.inventoryLoading"
              @click="scaStore.fetchChecks()"
            />
            <q-btn
              flat
              dense
              no-caps
              icon="download"
              label="Export formatted"
              @click="scaStore.exportChecksCSV()"
            />
          </div>
        </q-card-section>
        <q-separator />

        <!-- Search bar with WQL label -->
        <q-card-section class="q-py-sm">
          <div class="sca-wql-bar">
            <q-input
              v-model="scaStore.inventorySearch"
              dense
              outlined
              placeholder="Search..."
              clearable
              class="sca-wql-input"
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-badge outline color="grey" label="WQL" class="q-ml-sm" />
          </div>
        </q-card-section>

        <!-- Checks table -->
        <q-table
          :rows="scaStore.filteredChecks"
          :columns="checkColumns"
          row-key="id"
          flat
          dense
          :loading="scaStore.inventoryLoading"
          :pagination="checksPagination"
          @update:pagination="(p: typeof checksPagination) => checksPagination = p"
          class="sca-checks-table"
        >
          <template #body-cell-result="props">
            <q-td :props="props">
              <q-badge
                :color="resultColor(props.row.result)"
                :label="props.row.result"
              />
            </q-td>
          </template>
          <template #body-cell-title="props">
            <q-td :props="props" class="sca-title-cell">
              <div class="sca-check-title">{{ props.row.title }}</div>
              <div v-if="props.row.description" class="sca-check-desc text-caption text-grey">
                {{ props.row.description }}
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useScaStore } from "@/stores/sca";
import type { WazuhSCAPolicy } from "@/types/wazuh";

defineEmits<{ (e: "select-agent"): void }>();

const scaStore = useScaStore();

const selectedPolicy = ref<string | null>(scaStore.selectedPolicyId);

const policyPagination = ref({
  rowsPerPage: 15,
  page: 1,
  sortBy: null as string | null,
  descending: false,
});

const checksPagination = ref({
  rowsPerPage: 15,
  page: 1,
  sortBy: null as string | null,
  descending: false,
});

const policyColumns = [
  { name: "name", label: "Policy", field: "name", align: "left" as const, sortable: true },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
    style: "max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap",
  },
  { name: "end_scan", label: "End scan", field: "end_scan", align: "left" as const, sortable: true },
  { name: "pass", label: "Passed", field: "pass", align: "center" as const, sortable: true },
  { name: "fail", label: "Failed", field: "fail", align: "center" as const, sortable: true },
  { name: "invalid", label: "Not applicable", field: "invalid", align: "center" as const, sortable: true },
  { name: "score", label: "Score", field: "score", align: "center" as const, sortable: true },
];

const checkColumns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true, style: "width: 80px" },
  { name: "title", label: "Title", field: "title", align: "left" as const, sortable: true },
  {
    name: "compliance",
    label: "Target",
    field: (row: { file?: string; directory?: string; registry?: string; process?: string; command?: string }) =>
      row.file || row.directory || row.registry || row.process || row.command || "-",
    align: "left" as const,
    style: "max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap",
  },
  { name: "result", label: "Result", field: "result", align: "center" as const, sortable: true },
];

watch(() => scaStore.selectedPolicyId, (v) => {
  selectedPolicy.value = v;
});

function onPolicyClick(_evt: Event, row: WazuhSCAPolicy) {
  scaStore.selectPolicy(row.policy_id);
}

function onPolicySelect(policyId: string) {
  scaStore.selectPolicy(policyId);
}

function scoreColor(score: number): string {
  if (score >= 75) return "#4caf50";
  if (score >= 50) return "#ff9800";
  return "#f44336";
}

function resultColor(result: string): string {
  switch (result?.toLowerCase()) {
    case "passed": return "green";
    case "failed": return "red";
    default: return "grey";
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " @ " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.sca-inventory {
  padding: 20px;
  min-height: 400px;
}

.sca-no-agent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.sca-no-agent h5 {
  font-size: 20px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-inv-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.sca-policy-table :deep(tr) {
  cursor: pointer;
}

.sca-policy-table :deep(tr:hover td) {
  background: var(--mdm-bg-hover, #f0f4ff);
}

.sca-checks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.sca-checks-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sca-policy-select {
  min-width: 260px;
}

.sca-checks-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sca-check-search {
  min-width: 200px;
}

.sca-wql-bar {
  display: flex;
  align-items: center;
}

.sca-wql-input {
  flex: 1;
}

.sca-title-cell {
  max-width: 500px;
}

.sca-check-title {
  font-weight: 500;
}

.sca-check-desc {
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 480px;
}

.sca-checks-table :deep(.q-table__bottom) {
  border-top: 1px solid var(--mdm-border-light, #f0f0f0);
}

@media (max-width: 768px) {
  .sca-checks-header {
    flex-direction: column;
    align-items: stretch;
  }

  .sca-checks-actions {
    flex-wrap: wrap;
  }
}

/* Dark mode */
.body--dark .sca-no-agent h5 {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-inv-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-policy-table :deep(tr:hover td) {
  background: var(--mdm-bg-hover, #1e293b);
}
</style>
