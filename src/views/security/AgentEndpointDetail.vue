<template>
  <div class="agent-endpoint-detail">
    <!-- ===== Top Bar ===== -->
    <div class="aed-topbar">
      <q-btn flat dense round icon="arrow_back" class="aed-back" @click="$router.push({ name: 'SecurityAgents' })" />

      <q-tabs
        v-model="tab"
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        class="aed-tabs"
      >
        <q-tab name="threat" label="Threat Hunting" />
        <q-tab name="fim" label="File Integrity Monitoring" />
        <q-tab name="config" label="Configuration Assessment" />
      </q-tabs>

      <q-space />

      <!-- Agent selector -->
      <q-select
        v-model="selectedAgentId"
        :options="agentOptions"
        dense
        outlined
        emit-value
        map-options
        class="aed-agent-select"
        @update:model-value="switchAgent"
      >
        <template #prepend><q-icon name="computer" size="18px" /></template>
      </q-select>

      <q-btn flat dense round icon="refresh" :loading="isLoading" class="q-ml-xs" @click="refreshAll">
        <q-tooltip>Refresh all data</q-tooltip>
      </q-btn>
      <q-btn flat dense round icon="push_pin" class="q-ml-xs" />
      <q-btn flat dense no-caps label="Stats" class="q-ml-xs" />
      <q-btn flat dense no-caps label="Configuration" class="q-ml-xs" />
    </div>

    <!-- Loading state -->
    <div v-if="!agent && agentsLoading" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
      <div class="q-mt-md text-grey">Loading agent data...</div>
    </div>

    <!-- Agent not found -->
    <q-banner v-else-if="!agent" class="bg-orange-1 q-mb-md" rounded>
      <template #avatar><q-icon name="warning" color="orange" /></template>
      Agent with ID "{{ agentId }}" not found.
    </q-banner>

    <template v-else>
      <!-- ===== Agent Info Bar (full width) ===== -->
      <div class="aed-info-bar">
        <div class="aed-info-field">
          <span class="aed-info-label">ID</span>
          <span class="aed-info-value">{{ agent.id }}</span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Status</span>
          <span class="aed-info-value">
            <span class="aed-status-dot" :class="'aed-status--' + agent.status" />
            {{ agent.status }}
          </span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">IP address</span>
          <span class="aed-info-value">{{ agent.ip }}</span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Version</span>
          <span class="aed-info-value">{{ agent.version }}</span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Group</span>
          <span class="aed-info-value">{{ agent.group?.join(', ') || '—' }}</span>
        </div>
        <div class="aed-info-field aed-info-field--wide">
          <span class="aed-info-label">Operating system</span>
          <span class="aed-info-value">
            <q-icon v-if="agent.os?.platform === 'windows'" name="desktop_windows" size="14px" class="q-mr-xs" />
            <q-icon v-else-if="agent.os?.platform === 'linux'" name="terminal" size="14px" class="q-mr-xs" />
            <q-icon v-else name="device_unknown" size="14px" class="q-mr-xs" />
            {{ agent.os?.name || '—' }} {{ agent.os?.version || '' }}
          </span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Cluster node</span>
          <span class="aed-info-value">{{ agent.node_name || '—' }}</span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Registration date</span>
          <span class="aed-info-value">{{ formatDate(agent.dateAdd) }}</span>
        </div>
        <div class="aed-info-field">
          <span class="aed-info-label">Last keep alive</span>
          <span class="aed-info-value">{{ formatDate(agent.lastKeepAlive) }}</span>
        </div>
      </div>

      <!-- ===== System Inventory (full width) ===== -->
      <div class="aed-inventory-bar">
        <div class="aed-inventory-title">System inventory</div>
        <div class="aed-inventory-fields">
          <div class="aed-inv-field">
            <span class="aed-inv-label">Cores</span>
            <span class="aed-inv-value">{{ hwCores }}</span>
          </div>
          <div class="aed-inv-field">
            <span class="aed-inv-label">Memory</span>
            <span class="aed-inv-value">{{ hwMemory }}</span>
          </div>
          <div class="aed-inv-field">
            <span class="aed-inv-label">CPU</span>
            <span class="aed-inv-value">{{ hwCpu }}</span>
          </div>
          <div class="aed-inv-field">
            <span class="aed-inv-label">Host name</span>
            <span class="aed-inv-value">{{ hwHostname }}</span>
          </div>
          <div class="aed-inv-field">
            <span class="aed-inv-label">Serial number</span>
            <span class="aed-inv-value">{{ hwSerial }}</span>
          </div>
        </div>
        <q-btn flat dense round icon="open_in_new" size="sm" class="aed-inventory-link" />
      </div>

      <!-- ===== 3-Column Row: Events | MITRE | Compliance ===== -->
      <div class="aed-charts-row">
        <!-- Events count evolution -->
        <div class="aed-card aed-card--events">
          <div class="aed-card-title">Events count evolution</div>
          <EventsEvolutionChart
            :hourly-data="wazuhStore.managerHourlyStats"
            :loading="wazuhStore.managerStatsLoading"
          />
        </div>
        <!-- MITRE ATT&CK -->
        <div class="aed-card aed-card--mitre">
          <div class="aed-card-header">
            <div class="aed-card-title">MITRE ATT&CK</div>
            <q-btn flat dense round icon="open_in_new" size="sm" />
          </div>
          <div class="aed-mitre-subtitle">Top Tactics</div>
          <div v-if="wazuhStore.rulesLoading" class="text-center q-pa-md">
            <q-spinner size="24px" color="primary" />
          </div>
          <div v-else class="aed-mitre-list">
            <div
              v-for="t in topTactics"
              :key="t.name"
              class="aed-mitre-item"
            >
              <span class="aed-mitre-name">{{ t.name }}</span>
              <span class="aed-mitre-count">{{ t.count }}</span>
            </div>
            <div v-if="topTactics.length === 0" class="text-grey q-pa-sm">No data</div>
          </div>
        </div>
        <!-- Compliance -->
        <div class="aed-card aed-card--compliance">
          <div class="aed-card-header">
            <div class="aed-card-title">Compliance</div>
            <q-badge color="blue-grey-2" text-color="blue-grey-9" label="PCI DSS" class="q-ml-sm" />
          </div>
          <ComplianceDonut
            :data="wazuhStore.pciDssRuleCounts"
            :loading="wazuhStore.rulesLoading"
          />
        </div>
      </div>

      <!-- ===== Tab Content ===== -->
      <q-tab-panels v-model="tab" animated class="aed-panels">
        <!-- ===== THREAT HUNTING TAB ===== -->
        <q-tab-panel name="threat" class="q-pa-none">
          <!-- Vulnerability Detection + SCA side-by-side -->
          <div class="aed-bottom-row">
            <!-- Vulnerability Detection -->
            <div class="aed-section-card">
              <div class="aed-section-header">
                <div class="aed-section-title">Vulnerability Detection</div>
                <q-btn flat dense round icon="open_in_new" size="sm" />
              </div>
              <div class="aed-vuln-layout">
                <!-- KPI cards (vertical stack on left) -->
                <div class="aed-vuln-kpis">
                  <div v-for="sev in vulnSeverities" :key="sev.key" class="aed-vuln-kpi" :class="'aed-vuln-kpi--' + sev.key">
                    <span class="aed-vuln-kpi__count">{{ sev.count }}</span>
                    <span class="aed-vuln-kpi__label">{{ sev.label }}</span>
                  </div>
                </div>
                <!-- Top 5 Packages (right) -->
                <div class="aed-vuln-packages">
                  <div class="aed-vuln-pkg-title">Top 5 Packages</div>
                  <q-table
                    :rows="topVulnPackages"
                    :columns="vulnPkgColumns"
                    flat
                    dense
                    :loading="wazuhStore.vulnerabilitiesLoading"
                    :pagination="{ rowsPerPage: 5 }"
                    no-data-label="No vulnerability data"
                    class="aed-inner-table"
                    hide-bottom
                  />
                </div>
              </div>
            </div>

            <!-- SCA: Latest scans -->
            <div class="aed-section-card">
              <div class="aed-section-header">
                <div class="aed-section-title">SCA: Latest scans</div>
                <q-btn flat dense round icon="open_in_new" size="sm" />
              </div>
              <!-- Policy badges -->
              <div v-if="wazuhStore.scaPolicies.length > 0" class="aed-sca-badges">
                <div v-for="p in wazuhStore.scaPolicies" :key="p.policy_id" class="aed-sca-badge-row">
                  <span class="aed-sca-policy-name">{{ p.name }}</span>
                  <q-badge color="blue-2" text-color="blue-9" :label="p.policy_id" class="q-ml-sm" />
                </div>
              </div>
              <q-table
                :rows="wazuhStore.scaPolicies"
                :columns="scaColumns"
                flat
                dense
                :loading="wazuhStore.scaLoading"
                :pagination="{ rowsPerPage: 5 }"
                no-data-label="No SCA policies found"
                class="aed-inner-table q-mt-sm"
              >
                <template #body-cell-score="props">
                  <q-td :props="props">{{ props.row.score }}%</q-td>
                </template>
              </q-table>
            </div>
          </div>

          <!-- FIM: Recent events (full width) -->
          <div class="aed-section-card">
            <div class="aed-section-header">
              <div class="aed-section-title">FIM: Recent events</div>
              <q-btn flat dense round icon="open_in_new" size="sm" />
            </div>
            <q-table
              :rows="sortedFimEntries"
              :columns="fimColumns"
              flat
              dense
              :loading="wazuhStore.syscheckLoading"
              :pagination="{ rowsPerPage: 15 }"
              no-data-label="No FIM events found"
              class="aed-inner-table"
            >
              <template #body-cell-level="props">
                <q-td :props="props">
                  <q-badge :color="levelColor(props.row.level)" :label="String(props.row.level ?? '')" />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-tab-panel>

        <!-- ===== FILE INTEGRITY MONITORING TAB ===== -->
        <q-tab-panel name="fim" class="q-pa-none">
          <div class="aed-section-card">
            <div class="row items-center q-mb-sm" style="gap: 12px">
              <div class="aed-section-title" style="margin-bottom: 0">File Integrity Monitoring</div>
              <q-input
                v-model="fimSearch"
                dense
                outlined
                placeholder="Search by path..."
                clearable
                class="aed-search"
              >
                <template #prepend><q-icon name="search" size="18px" /></template>
              </q-input>
            </div>
            <q-table
              :rows="filteredFimEntries"
              :columns="fimFullColumns"
              flat
              dense
              :loading="wazuhStore.syscheckLoading"
              :pagination="{ rowsPerPage: 20 }"
              no-data-label="No syscheck entries found"
              class="aed-inner-table"
            >
              <template #body-cell-level="props">
                <q-td :props="props">
                  <q-badge :color="levelColor(props.row.level)" :label="String(props.row.level ?? '')" />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-tab-panel>

        <!-- ===== CONFIGURATION ASSESSMENT TAB ===== -->
        <q-tab-panel name="config" class="q-pa-none">
          <div class="aed-section-card">
            <ScaTable
              :rows="wazuhStore.scaPolicies"
              :loading="wazuhStore.scaLoading"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWazuhStore } from "@/stores/wazuh";
import EventsEvolutionChart from "@/components/security/EventsEvolutionChart.vue";
import ComplianceDonut from "@/components/security/ComplianceDonut.vue";
import ScaTable from "@/components/security/ScaTable.vue";

const route = useRoute();
const router = useRouter();
const wazuhStore = useWazuhStore();

const agentId = computed(() => route.params.agentId as string);
const selectedAgentId = ref("");
const tab = ref("threat");
const fimSearch = ref("");

const agentsLoading = computed(() => wazuhStore.agentsLoading);

const agent = computed(() =>
  wazuhStore.wazuhAgents.find((a) => a.id === agentId.value) ?? null,
);

// Agent selector options (show name + id like Wazuh)
const agentOptions = computed(() =>
  wazuhStore.wazuhAgents
    .filter((a) => a.id !== "000")
    .map((a) => ({ label: `${a.name} (${a.id})`, value: a.id })),
);

function switchAgent(newId: string) {
  router.push({ name: "AgentEndpointDetail", params: { agentId: newId } });
}

function refreshAll() {
  if (agentId.value) {
    wazuhStore.fetchAgentDetail(agentId.value);
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    return `${month} ${day}, ${year} @ ${h}:${m}:${s}.${ms}`;
  } catch {
    return dateStr;
  }
}

// ===== System Inventory computed =====
const hwCores = computed(() => {
  const hw = wazuhStore.syscollectorHardware;
  return hw?.cpu?.cores ?? "—";
});

const hwMemory = computed(() => {
  const hw = wazuhStore.syscollectorHardware;
  if (!hw?.ram?.total) return "—";
  const bytes = hw.ram.total;
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
});

const hwCpu = computed(() => {
  const hw = wazuhStore.syscollectorHardware;
  return hw?.cpu?.name ?? "—";
});

const hwHostname = computed(() => {
  const os = wazuhStore.syscollectorOS;
  return os?.hostname ?? "—";
});

const hwSerial = computed(() => {
  const hw = wazuhStore.syscollectorHardware;
  return hw?.board_serial ?? "—";
});

// ===== MITRE Top Tactics =====
const topTactics = computed(() => {
  const tactics = wazuhStore.mitreRuleTacticCounts;
  if (!tactics || !Array.isArray(tactics)) return [];
  return tactics
    .slice(0, 5)
    .map((t) => ({ name: t.tactic, count: t.count }));
});

// ===== Vulnerability KPI =====
const vulnSeverities = computed(() => {
  const vulns = wazuhStore.vulnerabilities;
  const countBySev = (sev: string) => vulns.filter((v) => (v.severity || "").toLowerCase() === sev).length;
  return [
    { key: "critical", label: "Critical", count: countBySev("critical") },
    { key: "high", label: "High", count: countBySev("high") },
    { key: "medium", label: "Medium", count: countBySev("medium") },
    { key: "low", label: "Low", count: countBySev("low") },
  ];
});

// Top 5 vuln packages
const topVulnPackages = computed(() => {
  const map = new Map<string, number>();
  for (const v of wazuhStore.vulnerabilities) {
    const name = v.name || "Unknown";
    map.set(name, (map.get(name) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
});

const vulnPkgColumns = [
  { name: "name", label: "Package", field: "name", align: "left" as const },
  { name: "count", label: "Count", field: "count", align: "right" as const, sortable: true },
];

// ===== SCA columns =====
const scaColumns = [
  { name: "name", label: "Policy", field: "name", align: "left" as const },
  { name: "end_scan", label: "End scan", field: "end_scan", align: "left" as const },
  { name: "pass", label: "Passed", field: "pass", align: "center" as const },
  { name: "fail", label: "Failed", field: "fail", align: "center" as const },
  { name: "invalid", label: "Not a...", field: "invalid", align: "center" as const },
  { name: "score", label: "Score", field: "score", align: "right" as const, sortable: true },
];

// ===== FIM columns (Recent events - Threat Hunting tab) =====
const fimColumns = [
  { name: "date", label: "Time", field: "date", align: "left" as const, sortable: true },
  { name: "file", label: "Path", field: "file", align: "left" as const },
  { name: "type", label: "Action", field: "type", align: "center" as const },
  { name: "ruleDescription", label: "Rule description", field: "ruleDescription", align: "left" as const },
  { name: "level", label: "Rule Lev...", field: "level", align: "center" as const },
  { name: "ruleId", label: "Rule Id", field: "ruleId", align: "center" as const },
];

// FIM full columns (FIM tab)
const fimFullColumns = [
  { name: "date", label: "Time", field: "date", align: "left" as const, sortable: true },
  { name: "file", label: "Path", field: "file", align: "left" as const },
  { name: "type", label: "Action", field: "type", align: "center" as const },
  { name: "ruleDescription", label: "Rule description", field: "ruleDescription", align: "left" as const },
  { name: "level", label: "Rule Level", field: "level", align: "center" as const },
  { name: "ruleId", label: "Rule Id", field: "ruleId", align: "center" as const },
  { name: "size", label: "Size", field: "size", align: "right" as const },
  { name: "uname", label: "User", field: "uname", align: "left" as const },
];

// Sorted FIM entries (newest first)
const sortedFimEntries = computed(() =>
  [...wazuhStore.syscheckEntries].sort((a, b) => {
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    return db - da;
  }),
);

// Filtered FIM for FIM tab
const filteredFimEntries = computed(() => {
  let entries = sortedFimEntries.value;
  if (fimSearch.value) {
    const q = fimSearch.value.toLowerCase();
    entries = entries.filter((e) => (e.file || "").toLowerCase().includes(q));
  }
  return entries;
});

function levelColor(level: number | undefined): string {
  if (!level) return "grey";
  if (level >= 12) return "red";
  if (level >= 10) return "deep-orange";
  if (level >= 7) return "orange";
  if (level >= 4) return "blue";
  return "grey";
}

// Watch route param changes for agent switching
watch(agentId, (newId) => {
  if (newId) {
    selectedAgentId.value = newId;
    wazuhStore.fetchAgentDetail(newId);
  }
});

onMounted(async () => {
  if (wazuhStore.wazuhAgents.length === 0) {
    await wazuhStore.fetchAgents();
  }
  selectedAgentId.value = agentId.value;
  if (agentId.value) {
    wazuhStore.fetchAgentDetail(agentId.value);
  }
});
</script>

<style scoped>
.agent-endpoint-detail {
  padding: 0;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* ===== Top Bar ===== */
.aed-topbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e8ecf0);
}

.aed-back {
  color: var(--mdm-text-secondary, #69707d);
}

.aed-tabs {
  flex: 1;
  min-width: 0;
}

.aed-agent-select {
  width: 260px;
  flex-shrink: 0;
}

/* ===== Agent Info Bar (full width horizontal) ===== */
.aed-info-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0;
  padding: 12px 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e8ecf0);
}

.aed-info-field {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  border-right: 1px solid var(--mdm-border-light, #e8ecf0);
  min-width: 0;
}

.aed-info-field:last-child {
  border-right: none;
}

.aed-info-field--wide {
  flex: 1;
  min-width: 200px;
}

.aed-info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.aed-info-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.aed-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.aed-status--active { background: #22c55e; }
.aed-status--disconnected { background: #ef4444; }
.aed-status--never_connected { background: #9ca3af; }
.aed-status--pending { background: #f59e0b; }

/* ===== System Inventory Bar (full width horizontal) ===== */
.aed-inventory-bar {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin: 16px 16px 0;
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  position: relative;
}

.aed-inventory-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-right: 32px;
  white-space: nowrap;
}

.aed-inventory-fields {
  display: flex;
  flex: 1;
  justify-content: space-around;
  gap: 24px;
}

.aed-inv-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.aed-inv-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #69707d);
  margin-bottom: 2px;
}

.aed-inv-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.aed-inventory-link {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--mdm-text-secondary, #69707d);
}

/* ===== 3-Column Charts Row ===== */
.aed-charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
}

.aed-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  padding: 16px;
}

.aed-card--events {
  grid-column: span 1;
}

.aed-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.aed-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 8px;
}

.aed-card-header .aed-card-title {
  margin-bottom: 0;
}

/* MITRE list */
.aed-mitre-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 8px;
}

.aed-mitre-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.aed-mitre-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.aed-mitre-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.aed-mitre-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--mdm-primary, #2563eb);
  min-width: 40px;
  text-align: right;
}

/* ===== Tab Panels ===== */
.aed-panels {
  background: transparent;
  padding: 0 16px;
}

/* ===== Bottom Row (Vuln + SCA side by side) ===== */
.aed-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* ===== Section Cards ===== */
.aed-section-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.aed-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.aed-section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.aed-section-header .aed-section-title {
  margin-bottom: 0;
}

/* ===== Vulnerability Layout: KPIs left + Table right ===== */
.aed-vuln-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
}

.aed-vuln-kpis {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.aed-vuln-kpi {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 6px;
  border-left: 4px solid transparent;
  background: var(--mdm-bg, #f9fafb);
}

.aed-vuln-kpi__count {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.aed-vuln-kpi__label {
  font-size: 14px;
  font-weight: 600;
}

.aed-vuln-kpi--critical { border-left-color: #dc2626; }
.aed-vuln-kpi--critical .aed-vuln-kpi__count { color: #dc2626; }
.aed-vuln-kpi--critical .aed-vuln-kpi__label { color: #dc2626; }

.aed-vuln-kpi--high { border-left-color: #ea580c; }
.aed-vuln-kpi--high .aed-vuln-kpi__count { color: #ea580c; }
.aed-vuln-kpi--high .aed-vuln-kpi__label { color: #ea580c; }

.aed-vuln-kpi--medium { border-left-color: #ca8a04; }
.aed-vuln-kpi--medium .aed-vuln-kpi__count { color: #ca8a04; }
.aed-vuln-kpi--medium .aed-vuln-kpi__label { color: #ca8a04; }

.aed-vuln-kpi--low { border-left-color: #2563eb; }
.aed-vuln-kpi--low .aed-vuln-kpi__count { color: #2563eb; }
.aed-vuln-kpi--low .aed-vuln-kpi__label { color: #2563eb; }

.aed-vuln-packages {
  min-width: 0;
}

.aed-vuln-pkg-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 8px;
}

/* ===== SCA badges ===== */
.aed-sca-badges {
  margin-bottom: 8px;
}

.aed-sca-badge-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.aed-sca-policy-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-primary, #2563eb);
}

/* ===== Inner tables ===== */
.aed-inner-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.aed-inner-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 8px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

/* ===== Search ===== */
.aed-search {
  width: 300px;
}

/* ===== Responsive ===== */
@media (max-width: 1100px) {
  .aed-charts-row {
    grid-template-columns: 1fr;
  }
  .aed-bottom-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .aed-topbar {
    flex-wrap: wrap;
  }
  .aed-agent-select {
    width: 100%;
  }
  .aed-info-bar {
    flex-direction: column;
    gap: 8px;
  }
  .aed-info-field {
    border-right: none;
    padding: 4px 0;
  }
  .aed-vuln-layout {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* ===== Dark mode ===== */
.body--dark .aed-topbar {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-info-bar {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-info-field {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-inventory-bar {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-section-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .aed-vuln-kpi {
  background: rgba(255, 255, 255, 0.03);
}

.body--dark .aed-inner-table .q-table th {
  background: var(--mdm-bg-sidebar, #0f1729);
}
</style>
