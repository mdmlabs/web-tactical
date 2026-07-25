<template>
  <div class="security-agents">
    <!-- Unavailable banner -->
    <q-banner
      v-if="!wazuhStore.isAvailable"
      class="bg-warning text-dark q-mb-md"
      rounded
    >
      <template #avatar>
        <q-icon name="warning" color="dark" />
      </template>
      Security API is currently unavailable. Showing managed devices only.
      <template #action>
        <q-btn flat label="Retry" @click="loadData" />
      </template>
    </q-banner>

    <!-- ===== TOP: 3 Donut Charts ===== -->
    <div class="charts-row">
      <!-- Agents by Status -->
      <q-card flat bordered class="chart-card">
        <div class="chart-title">AGENTS BY STATUS</div>
        <div class="chart-body">
          <apexchart
            type="donut"
            height="180"
            :options="statusChartOptions"
            :series="statusChartSeries"
          />
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #00a9e5" />
              <span>Active ({{ statusCounts.active }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #ff645c" />
              <span>Disconnected ({{ statusCounts.disconnected }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #fdbc40" />
              <span>Pending ({{ statusCounts.pending }})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #a3a7b0" />
              <span>Never connected ({{ statusCounts.never_connected }})</span>
            </div>
          </div>
        </div>
      </q-card>

      <!-- Top 5 OS -->
      <q-card flat bordered class="chart-card">
        <div class="chart-title">TOP 5 OS</div>
        <div class="chart-body">
          <apexchart
            type="donut"
            height="180"
            :options="osChartOptions"
            :series="osChartSeries"
          />
          <div class="chart-legend">
            <div
              v-for="(item, idx) in osDistribution"
              :key="item.name"
              class="legend-item"
            >
              <span
                class="legend-dot"
                :style="{ background: osColors[idx % osColors.length] }"
              />
              <span>{{ item.name }} ({{ item.count }})</span>
            </div>
          </div>
        </div>
      </q-card>

      <!-- Top 5 Groups -->
      <q-card flat bordered class="chart-card">
        <div class="chart-title">TOP 5 GROUPS</div>
        <div class="chart-body">
          <apexchart
            type="donut"
            height="180"
            :options="groupChartOptions"
            :series="groupChartSeries"
          />
          <div class="chart-legend">
            <div
              v-for="(item, idx) in groupDistribution"
              :key="item.name"
              class="legend-item"
            >
              <span
                class="legend-dot"
                :style="{ background: groupColors[idx % groupColors.length] }"
              />
              <span>{{ item.name }} ({{ item.count }})</span>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- ===== BOTTOM: Agents Table ===== -->
    <q-card flat bordered class="agents-card">
      <!-- Table header bar -->
      <div class="agents-header">
        <div class="agents-header-left">
          <span class="agents-count">Agents ({{ wazuhAgentsFiltered.length }})</span>
        </div>
        <div class="agents-header-right">
          <q-btn
            flat
            no-caps
            dense
            icon="refresh"
            label="Refresh"
            class="action-btn"
            :loading="wazuhStore.agentsLoading"
            @click="loadData"
          />
          <q-btn
            flat
            no-caps
            dense
            icon="file_download"
            label="Export"
            class="action-btn"
            @click="exportOpen = true"
          >
            <q-tooltip>Export as CSV / XLSX / PDF</q-tooltip>
          </q-btn>
          <q-btn-dropdown
            flat
            no-caps
            dense
            label="More"
            class="action-btn"
          >
            <q-list dense>
              <q-item clickable v-close-popup @click="filterText = ''">
                <q-item-section>Clear filters</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat round dense icon="settings" size="sm" />
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <q-input
          v-model="filterText"
          dense
          outlined
          placeholder="Filter agents... e.g. os.platform=windows"
          class="filter-input"
          clearable
        />
        <q-btn flat dense no-caps label="WQL" class="wql-btn" />
      </div>

      <!-- Table -->
      <q-table
        :rows="wazuhAgentsFiltered"
        :columns="columns"
        row-key="id"
        flat
        dense
        :loading="wazuhStore.agentsLoading"
        :pagination="pagination"
        class="agents-table"
        @row-click="onRowClick"
        separator="horizontal"
      >
        <!-- ID -->
        <template #body-cell-id="props">
          <q-td :props="props" class="text-body2">
            {{ props.row.id }}
          </q-td>
        </template>

        <!-- Name -->
        <template #body-cell-name="props">
          <q-td :props="props">
            <span class="text-body2">{{ props.row.name }}</span>
          </q-td>
        </template>

        <!-- Group(s) -->
        <template #body-cell-group="props">
          <q-td :props="props">
            <span class="text-body2">{{ (props.row.group ?? []).join(', ') }}</span>
          </q-td>
        </template>

        <!-- Operating system with icon -->
        <template #body-cell-os="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-icon
                :name="osIcon(props.row.os?.platform)"
                size="18px"
                class="q-mr-sm os-icon"
              />
              <span class="text-body2">
                {{ props.row.os?.name ?? 'Unknown' }}
                {{ props.row.os?.version ? props.row.os.version : '' }}
              </span>
            </div>
          </q-td>
        </template>

        <!-- Cluster node -->
        <template #body-cell-node_name="props">
          <q-td :props="props" class="text-body2">
            {{ props.row.node_name ?? '—' }}
          </q-td>
        </template>

        <!-- Version -->
        <template #body-cell-version="props">
          <q-td :props="props" class="text-body2">
            {{ formatVersion(props.row.version) }}
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <span
                class="status-dot"
                :class="'status-' + props.row.status"
              />
              <span class="text-body2 q-ml-sm">{{ props.row.status }}</span>
              <q-icon
                name="info_outline"
                size="14px"
                class="q-ml-xs text-grey-5 cursor-pointer"
              >
                <q-tooltip>
                  Last keepalive: {{ props.row.lastKeepAlive ? new Date(props.row.lastKeepAlive).toLocaleString() : '—' }}
                </q-tooltip>
              </q-icon>
            </div>
          </q-td>
        </template>

        <!-- Actions -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              size="sm"
              icon="visibility"
              @click.stop="viewAgent(props.row)"
            >
              <q-tooltip>View details</q-tooltip>
            </q-btn>
            <q-btn flat round dense size="sm" icon="more_horiz">
              <q-menu>
                <q-list dense>
                  <q-item clickable v-close-popup @click="viewAgent(props.row)">
                    <q-item-section avatar>
                      <q-icon name="visibility" size="sm" />
                    </q-item-section>
                    <q-item-section>View details</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <AgentsExportModal
      v-model="exportOpen"
      :filtered-agents="wazuhAgentsFiltered"
      :all-agents="wazuhAgentsNoManager"
      :filter-text="filterText"
      :charts="exportCharts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWazuhStore } from "@/stores/wazuh";
import VueApexCharts from "vue3-apexcharts";
import type { WazuhAgent } from "@/types/wazuh";
import AgentsExportModal from "@/components/security/reporting/AgentsExportModal.vue";
import type { AgentsExportCharts } from "@/utils/agentsExport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

const router = useRouter();
const wazuhStore = useWazuhStore();

const filterText = ref("");
const pagination = ref({ rowsPerPage: 10 });
const exportOpen = ref(false);

// =====================
// Table columns (Wazuh-style)
// =====================
const columns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true, style: "width: 60px" },
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "ip", label: "IP address", field: "ip", align: "left" as const, sortable: true },
  { name: "group", label: "Group(s)", field: "group", align: "left" as const },
  { name: "os", label: "Operating system", field: "os", align: "left" as const, sortable: true },
  { name: "node_name", label: "Cluster node", field: "node_name", align: "left" as const, sortable: true },
  { name: "version", label: "Version", field: "version", align: "left" as const, sortable: true },
  { name: "status", label: "Status", field: "status", align: "left" as const, sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];

// =====================
// Agents (Wazuh only, skip manager id=000)
// =====================
const wazuhAgentsNoManager = computed(() =>
  wazuhStore.wazuhAgents.filter((a) => a.id !== "000"),
);

const wazuhAgentsFiltered = computed(() => {
  if (!filterText.value) return wazuhAgentsNoManager.value;

  const f = filterText.value.toLowerCase().trim();

  // Simple WQL-like: key=value
  const eqMatch = f.match(/^([a-z_.]+)\s*=\s*(.+)$/);
  if (eqMatch) {
    const key = eqMatch[1];
    const val = eqMatch[2].trim();
    return wazuhAgentsNoManager.value.filter((a) => {
      if (key === "os.platform") return a.os?.platform?.toLowerCase() === val;
      if (key === "os.name") return a.os?.name?.toLowerCase().includes(val);
      if (key === "status") return a.status === val;
      if (key === "name") return a.name.toLowerCase().includes(val);
      if (key === "ip") return a.ip.includes(val);
      if (key === "group") return (a.group ?? []).some((g) => g.toLowerCase().includes(val));
      return true;
    });
  }

  // Freetext
  return wazuhAgentsNoManager.value.filter(
    (a) =>
      a.name.toLowerCase().includes(f) ||
      a.ip.includes(f) ||
      a.status.includes(f) ||
      (a.os?.name ?? "").toLowerCase().includes(f),
  );
});

// =====================
// Donut 1: Agents by Status
// =====================
const statusCounts = computed(() => {
  const agents = wazuhAgentsNoManager.value;
  return {
    active: agents.filter((a) => a.status === "active").length,
    disconnected: agents.filter((a) => a.status === "disconnected").length,
    pending: agents.filter((a) => a.status === "pending").length,
    never_connected: agents.filter((a) => a.status === "never_connected").length,
  };
});

const statusChartSeries = computed(() => [
  statusCounts.value.active,
  statusCounts.value.disconnected,
  statusCounts.value.pending,
  statusCounts.value.never_connected,
]);

const statusChartOptions = computed(() => ({
  chart: { type: "donut" as const },
  colors: ["#00a9e5", "#ff645c", "#fdbc40", "#a3a7b0"],
  labels: ["Active", "Disconnected", "Pending", "Never connected"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            fontSize: "13px",
            fontWeight: 600,
            formatter: () => String(wazuhAgentsNoManager.value.length),
          },
        },
      },
    },
  },
  stroke: { width: 2, colors: ["#fff"] },
  tooltip: { enabled: true },
}));

// =====================
// Donut 2: Top 5 OS
// =====================
const osColors = ["#00a9e5", "#47c68e", "#fdbc40", "#ff645c", "#a481d4"];

const osDistribution = computed(() => {
  const map = new Map<string, number>();
  for (const a of wazuhAgentsNoManager.value) {
    const platform = a.os?.platform ?? "unknown";
    map.set(platform, (map.get(platform) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
});

const osChartSeries = computed(() => osDistribution.value.map((d) => d.count));
const osChartOptions = computed(() => ({
  chart: { type: "donut" as const },
  colors: osColors.slice(0, osDistribution.value.length),
  labels: osDistribution.value.map((d) => d.name),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            fontSize: "13px",
            fontWeight: 600,
            formatter: () => String(wazuhAgentsNoManager.value.length),
          },
        },
      },
    },
  },
  stroke: { width: 2, colors: ["#fff"] },
  tooltip: { enabled: true },
}));

// =====================
// Donut 3: Top 5 Groups
// =====================
const groupColors = ["#47c68e", "#00a9e5", "#fdbc40", "#ff645c", "#a481d4"];

const groupDistribution = computed(() => {
  const map = new Map<string, number>();
  for (const a of wazuhAgentsNoManager.value) {
    for (const g of a.group ?? []) {
      map.set(g, (map.get(g) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
});

const groupChartSeries = computed(() => groupDistribution.value.map((d) => d.count));
const groupChartOptions = computed(() => ({
  chart: { type: "donut" as const },
  colors: groupColors.slice(0, groupDistribution.value.length),
  labels: groupDistribution.value.map((d) => d.name),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            fontSize: "13px",
            fontWeight: 600,
            formatter: () => {
              const total = groupDistribution.value.reduce((s, d) => s + d.count, 0);
              return String(total);
            },
          },
        },
      },
    },
  },
  stroke: { width: 2, colors: ["#fff"] },
  tooltip: { enabled: true },
}));

// =====================
// Donut data for the PDF exporter — mirror the on-screen donuts.
// =====================
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const exportCharts = computed<AgentsExportCharts>(() => ({
  status: [
    { label: "Active", value: statusCounts.value.active, color: hexToRgb("#00a9e5") },
    { label: "Disconnected", value: statusCounts.value.disconnected, color: hexToRgb("#ff645c") },
    { label: "Pending", value: statusCounts.value.pending, color: hexToRgb("#fdbc40") },
    { label: "Never connected", value: statusCounts.value.never_connected, color: hexToRgb("#a3a7b0") },
  ],
  os: osDistribution.value.map((d, i) => ({
    label: d.name,
    value: d.count,
    color: hexToRgb(osColors[i % osColors.length]),
  })),
  groups: groupDistribution.value.map((d, i) => ({
    label: d.name,
    value: d.count,
    color: hexToRgb(groupColors[i % groupColors.length]),
  })),
}));

// =====================
// Helpers
// =====================
function osIcon(platform: string | undefined): string {
  if (!platform) return "computer";
  if (platform === "windows") return "laptop_windows";
  if (platform === "darwin") return "laptop_mac";
  return "computer";
}

function formatVersion(version: string | undefined): string {
  if (!version) return "—";
  return version.replace("Wazuh ", "");
}

function viewAgent(agent: WazuhAgent) {
  router.push({ name: "AgentEndpointDetail", params: { agentId: agent.id } });
}

function onRowClick(_: Event, row: WazuhAgent) {
  viewAgent(row);
}

async function loadData() {
  await wazuhStore.fetchAgents();
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.security-agents {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* ===== Charts Row ===== */
.charts-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-card {
  flex: 1;
  min-width: 0;
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow-sm);
}

.chart-title {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--mdm-text-secondary, #666);
  padding: 14px 16px 0;
  text-transform: uppercase;
}

.chart-body {
  display: flex;
  align-items: center;
  padding: 8px 16px 16px;
  gap: 8px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  white-space: nowrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ===== Agents Card ===== */
.agents-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  overflow: hidden;
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.agents-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.agents-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agents-count {
  font-size: 18px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.agents-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  color: var(--mdm-primary, #2563eb);
  font-size: 13px;
  font-weight: 500;
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.filter-input {
  flex: 1;
}

.filter-input :deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  font-size: 13px;
}

.wql-btn {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
  font-size: 13px;
}

/* ===== Table ===== */
.agents-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.agents-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.agents-table :deep(tbody tr) {
  cursor: pointer;
}

.agents-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

/* Status dot */
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.status-active {
  background: var(--mdm-success, #16a34a);
}

.status-disconnected {
  background: var(--mdm-danger, #dc2626);
}

.status-pending {
  background: var(--mdm-warning, #ca8a04);
}

.status-never_connected {
  background: #9ca3af;
}

/* OS icon */
.os-icon {
  color: var(--mdm-text-secondary, #666);
}

/* Responsive */
@media (max-width: 960px) {
  .charts-row {
    flex-direction: column;
  }

  .chart-body {
    flex-direction: column;
    align-items: center;
  }

  .agents-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
