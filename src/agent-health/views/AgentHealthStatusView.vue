<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h6">Agent Health & Modules</div>
      <q-space />
      <q-btn
        flat dense round icon="refresh" :loading="loading"
        @click="loadAll(true)"
      >
        <q-tooltip>Probe all online agents (live, bypasses 30s cache)</q-tooltip>
      </q-btn>
      <q-btn-toggle
        v-model="filter"
        :options="filterOptions"
        dense unelevated
        toggle-color="primary"
        class="q-ml-sm"
      />
    </div>

    <div class="row q-gutter-md q-mb-md">
      <q-card class="health-summary-card bg-positive text-white">
        <q-card-section>
          <div class="text-h4">{{ stats.healthy }}</div>
          <div>Fully healthy</div>
        </q-card-section>
      </q-card>
      <q-card class="health-summary-card bg-warning text-white">
        <q-card-section>
          <div class="text-h4">{{ stats.partial }}</div>
          <div>Partial (some modules missing)</div>
        </q-card-section>
      </q-card>
      <q-card class="health-summary-card bg-negative text-white">
        <q-card-section>
          <div class="text-h4">{{ stats.broken }}</div>
          <div>Broken (3+ modules missing)</div>
        </q-card-section>
      </q-card>
      <q-card class="health-summary-card bg-grey-7 text-white">
        <q-card-section>
          <div class="text-h4">{{ stats.offline }}</div>
          <div>Offline</div>
        </q-card-section>
      </q-card>
    </div>

    <q-table
      :rows="filteredRows"
      :columns="columns"
      row-key="agent_id"
      flat bordered
      :loading="loading"
      :pagination="{ rowsPerPage: 25, sortBy: 'percent', descending: false }"
    >
      <template v-slot:body-cell-hostname="props">
        <q-td :props="props">
          <q-icon
            :name="props.row.online ? 'circle' : 'radio_button_unchecked'"
            :color="props.row.online ? 'positive' : 'grey'"
            size="10px" class="q-mr-xs"
          />
          <strong>{{ props.row.hostname }}</strong>
          <div class="text-caption text-grey">{{ props.row.agent_id.substring(0, 12) }}...</div>
        </q-td>
      </template>

      <template v-slot:body-cell-percent="props">
        <q-td :props="props">
          <q-linear-progress
            :value="props.row.completeness.percent / 100"
            :color="percentColor(props.row.completeness.percent)"
            size="22px"
            rounded
          >
            <div class="absolute-full flex flex-center">
              <span class="text-white text-caption text-weight-bold">
                {{ props.row.completeness.percent }}% ({{ props.row.completeness.ok }}/{{ props.row.completeness.expected }})
              </span>
            </div>
          </q-linear-progress>
        </q-td>
      </template>

      <template v-slot:body-cell-modules="props">
        <q-td :props="props" class="modules-cell">
          <q-chip
            v-for="key in MODULE_ORDER" :key="key"
            :color="moduleColor((props.row.modules[key] || {}).state || 'n/a')"
            text-color="white"
            :icon="moduleIcon((props.row.modules[key] || {}).state || 'n/a')"
            size="sm"
            dense
            class="module-chip"
          >
            {{ shortName(key) }}
            <q-tooltip class="bg-dark">
              <div class="text-weight-bold">{{ MODULE_LABELS[key] }}</div>
              <div>State: {{ (props.row.modules[key] || {}).state || "n/a" }}</div>
              <pre style="font-size:10px; margin:0">{{ JSON.stringify((props.row.modules[key] || {}).raw, null, 2) }}</pre>
            </q-tooltip>
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat dense round icon="refresh"
            :disable="!props.row.online"
            @click="probeOne(props.row.agent_id)"
          >
            <q-tooltip>Probe this agent live</q-tooltip>
          </q-btn>
          <q-btn
            v-if="props.row.completeness.percent < 100 && props.row.online"
            flat dense round icon="healing" color="primary"
            @click="reinstallSC(props.row.agent_id)"
          >
            <q-tooltip>Re-install SecureContainer + Dokany on this agent</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <div v-if="lastRefresh" class="text-caption text-grey q-mt-sm">
      Last refresh: {{ lastRefresh.toLocaleTimeString() }}.
      Auto-refresh every 30 seconds.
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import {
  fetchAgentModuleStatus,
  fetchAgentModuleStatusBulk,
  MODULE_ORDER,
  MODULE_LABELS,
  moduleColor,
  moduleIcon,
} from "@/api/agentHealth";
import type { AgentModuleStatus } from "@/api/agentHealth";

const $q = useQuasar();
const rows = ref<AgentModuleStatus[]>([]);
const loading = ref(false);
const lastRefresh = ref<Date | null>(null);
const filter = ref<"all" | "issues" | "online">("all");

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Issues only", value: "issues" },
  { label: "Online only", value: "online" },
];

const columns = [
  { name: "hostname", label: "Hostname", field: "hostname", align: "left" as const, sortable: true },
  { name: "version", label: "Agent ver.", field: "version", align: "left" as const, sortable: true },
  { name: "percent", label: "Completeness", field: (r: AgentModuleStatus) => r.completeness.percent, align: "center" as const, sortable: true, style: "width: 240px" },
  { name: "modules", label: "Modules", field: "modules", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const, style: "width: 90px" },
];

const stats = computed(() => {
  let healthy = 0, partial = 0, broken = 0, offline = 0;
  for (const r of rows.value) {
    if (!r.online) { offline++; continue; }
    const pct = r.completeness.percent;
    if (pct === 100) healthy++;
    else if (pct >= 60) partial++;
    else broken++;
  }
  return { healthy, partial, broken, offline };
});

const filteredRows = computed(() => {
  if (filter.value === "issues") {
    return rows.value.filter((r) => r.online && r.completeness.percent < 100);
  }
  if (filter.value === "online") {
    return rows.value.filter((r) => r.online);
  }
  return rows.value;
});

function percentColor(pct: number): string {
  if (pct === 100) return "positive";
  if (pct >= 60) return "warning";
  return "negative";
}

function shortName(key: string): string {
  switch (key) {
    case "rmadm": return "rmadm";
    case "mesh_agent": return "mesh";
    case "securecontainer": return "SC";
    case "dokany": return "dokan";
    case "laborato_guard": return "guard";
    case "wazuh": return "cyber-secure";
    case "mdm_dotnet": return "MDM";
    default: return key;
  }
}

async function loadAll(refresh = false) {
  loading.value = true;
  try {
    // First show whatever is cached so the table populates instantly
    const bulk = await fetchAgentModuleStatusBulk();
    rows.value = bulk.agents;
    lastRefresh.value = new Date();

    if (refresh) {
      // Then probe each online agent in parallel for fresh data
      const probes = bulk.agents
        .filter((a) => a.online)
        .map((a) => fetchAgentModuleStatus(a.agent_id, true).catch((e) => null));
      const fresh = await Promise.all(probes);
      for (const f of fresh) {
        if (!f) continue;
        const idx = rows.value.findIndex((r) => r.agent_id === f.agent_id);
        if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...f };
      }
      lastRefresh.value = new Date();
    }
  } catch (e: any) {
    $q.notify({ type: "negative", message: `Load failed: ${e.message || e}` });
  } finally {
    loading.value = false;
  }
}

async function probeOne(agentId: string) {
  try {
    const fresh = await fetchAgentModuleStatus(agentId, true);
    const idx = rows.value.findIndex((r) => r.agent_id === agentId);
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...fresh };
    $q.notify({ type: "positive", message: `Probed ${fresh.hostname}` });
  } catch (e: any) {
    $q.notify({ type: "negative", message: `Probe failed: ${e.message || e}` });
  }
}

async function reinstallSC(agentId: string) {
  try {
    await axios.post("/appmanagement/securecontainer/install/", { agent_id: agentId, force: false });
    $q.notify({ type: "positive", message: "Re-install dispatched. Probe again in ~30s.", timeout: 5000 });
  } catch (e: any) {
    $q.notify({ type: "negative", message: `Re-install failed: ${e.message || e}` });
  }
}

let timer: any = null;
onMounted(() => {
  loadAll(false);
  timer = setInterval(() => loadAll(false), 30000);
});
onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

<style scoped>
.health-summary-card {
  min-width: 180px;
}
.modules-cell {
  white-space: normal;
  min-width: 540px;
}
.module-chip {
  margin: 2px;
}
</style>
