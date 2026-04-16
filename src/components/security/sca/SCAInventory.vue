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
          <template #body="props">
            <q-tr :props="props" class="sca-check-row" @click="toggleRowExpand(props.row.id)">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'result'">
                  <q-badge
                    :color="resultColor(props.row.result)"
                    :label="props.row.result"
                  />
                </template>
                <template v-else-if="col.name === 'title'">
                  <div class="sca-title-cell">
                    <div class="sca-check-title">
                      <q-icon
                        :name="expandedRows.has(props.row.id) ? 'expand_more' : 'chevron_right'"
                        size="18px"
                        class="sca-expand-icon"
                      />
                      {{ props.row.title }}
                    </div>
                    <div v-if="props.row.description" class="sca-check-desc text-caption text-grey">
                      {{ props.row.description }}
                    </div>
                  </div>
                </template>
                <template v-else>{{ col.value }}</template>
              </q-td>
            </q-tr>

            <!-- Expanded detail row -->
            <q-tr v-if="expandedRows.has(props.row.id)" class="sca-detail-row">
              <q-td colspan="100%" class="sca-detail-td">
                <div class="sca-check-detail">
                  <!-- Target info -->
                  <div v-if="getTarget(props.row)" class="sca-detail-section">
                    <div class="sca-detail-label">{{ getTargetType(props.row) }}:</div>
                    <div class="sca-detail-value sca-detail-mono">{{ getTarget(props.row) }}</div>
                  </div>

                  <!-- Rationale -->
                  <div v-if="props.row.rationale" class="sca-detail-section">
                    <div class="sca-detail-label">Rationale</div>
                    <div class="sca-detail-value">{{ props.row.rationale }}</div>
                  </div>

                  <!-- Remediation -->
                  <div v-if="props.row.remediation" class="sca-detail-section">
                    <div class="sca-detail-label">Remediation</div>
                    <div class="sca-detail-value">{{ props.row.remediation }}</div>
                  </div>

                  <!-- Description -->
                  <div v-if="props.row.description" class="sca-detail-section">
                    <div class="sca-detail-label">Description</div>
                    <div class="sca-detail-value">{{ props.row.description }}</div>
                  </div>

                  <!-- Checks (condition + rules) -->
                  <div v-if="props.row.rules?.length" class="sca-detail-section">
                    <div class="sca-detail-label">Checks (Condition: {{ props.row.condition || 'all' }})</div>
                    <ul class="sca-rules-list">
                      <li v-for="(rule, idx) in props.row.rules" :key="idx">
                        {{ rule.rule }}
                      </li>
                    </ul>
                  </div>

                  <!-- Compliance -->
                  <div v-if="props.row.compliance?.length" class="sca-detail-section">
                    <div class="sca-detail-label">Compliance</div>
                    <div class="sca-compliance-list">
                      <div v-for="(c, idx) in props.row.compliance" :key="idx" class="sca-compliance-item">
                        <strong>{{ c.key }}:</strong> {{ c.value }}
                      </div>
                    </div>
                  </div>

                  <!-- Reason (for not applicable) -->
                  <div v-if="props.row.reason" class="sca-detail-section">
                    <div class="sca-detail-label">Reason</div>
                    <div class="sca-detail-value">{{ props.row.reason }}</div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useScaStore } from "@/stores/sca";
import type { WazuhSCAPolicy, WazuhSCACheck } from "@/types/wazuh";

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

const expandedRows = reactive(new Set<number>());

function toggleRowExpand(id: number) {
  if (expandedRows.has(id)) {
    expandedRows.delete(id);
  } else {
    expandedRows.add(id);
  }
}

function getTarget(row: WazuhSCACheck): string {
  return row.registry || row.file || row.directory || row.process || row.command || "";
}

function getTargetType(row: WazuhSCACheck): string {
  if (row.registry) return "Registry";
  if (row.file) return "File";
  if (row.directory) return "Directory";
  if (row.process) return "Process";
  if (row.command) return "Command";
  return "Target";
}

watch(() => scaStore.selectedPolicyId, (v) => {
  selectedPolicy.value = v;
  expandedRows.clear();
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
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.sca-expand-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--mdm-text-secondary, #666);
  transition: transform 0.15s ease;
}

.sca-check-desc {
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 480px;
  padding-left: 22px;
}

.sca-check-row {
  cursor: pointer;
}

.sca-check-row:hover td {
  background: var(--mdm-bg-hover, #f0f4ff);
}

/* Expanded detail row */
.sca-detail-row {
  background: none;
}

.sca-detail-td {
  padding: 0 !important;
  border-bottom: 2px solid var(--mdm-border-light, #e0e4ea);
}

.sca-check-detail {
  padding: 16px 24px 20px 24px;
  background: var(--mdm-bg-subtle, #f8f9fc);
  border-top: 1px solid var(--mdm-border-light, #e0e4ea);
}

.sca-detail-section {
  margin-bottom: 14px;
}

.sca-detail-section:last-child {
  margin-bottom: 0;
}

.sca-detail-label {
  font-weight: 600;
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.sca-detail-value {
  font-size: 13px;
  line-height: 1.5;
  color: var(--mdm-text-secondary, #444);
  white-space: pre-wrap;
  word-break: break-word;
}

.sca-detail-mono {
  font-family: monospace;
  font-size: 12px;
  background: var(--mdm-bg-code, #eef1f6);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.sca-rules-list {
  margin: 4px 0 0 8px;
  padding: 0 0 0 16px;
  list-style: disc;
}

.sca-rules-list li {
  font-family: monospace;
  font-size: 12px;
  margin-bottom: 4px;
  line-height: 1.5;
  color: var(--mdm-text-secondary, #444);
  word-break: break-all;
}

.sca-compliance-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sca-compliance-item {
  font-size: 13px;
  color: var(--mdm-text-secondary, #444);
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

  .sca-check-detail {
    padding: 12px 16px;
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

.body--dark .sca-check-row:hover td {
  background: var(--mdm-bg-hover, #1e293b);
}

.body--dark .sca-check-detail {
  background: var(--mdm-bg-subtle, #0d1421);
  border-top-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-detail-td {
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-detail-label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-detail-value,
.body--dark .sca-rules-list li,
.body--dark .sca-compliance-item {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .sca-detail-mono {
  background: var(--mdm-bg-code, #1a2332);
}

.body--dark .sca-expand-icon {
  color: var(--mdm-text-secondary, #94a3b8);
}
</style>
