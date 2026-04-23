<template>
  <q-btn
    flat
    no-caps
    :icon="loading ? undefined : 'picture_as_pdf'"
    :loading="loading"
    :label="`Generate Report · ${scopeLabel}`"
    class="gen-report-btn"
    @click="onGenerate"
  >
    <template #loading>
      <q-spinner-dots />
    </template>
    <q-tooltip anchor="bottom middle" self="top middle">
      {{ scopeTooltip }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { notifyError, notifySuccess } from "@/utils/notify";
import { useWazuhStore } from "@/stores/wazuh";
import {
  createAgentReport,
  createGroupReport,
  createModuleReport,
  extractWazuhError,
  type WazuhReportSection,
} from "@/api/wazuhReporting";

const route = useRoute();
const wazuhStore = useWazuhStore();
const loading = ref(false);

// Resolve a route-provided identifier (TacticalRMM agent_id or hostname) to
// the corresponding Wazuh agent id (e.g. "007"). Wazuh's /reports/agents/{id}
// endpoint rejects anything else. Falls back to the raw identifier so the
// error surfaces clearly if the agent isn't synced with Wazuh.
function resolveWazuhAgentId(routeId: string): string {
  const lower = routeId.toLowerCase();
  const byId = wazuhStore.mergedAgents.find(
    (a) => a.tactical_agent_id === routeId,
  );
  if (byId?.wazuh_agent_id) return byId.wazuh_agent_id;
  const byHost = wazuhStore.mergedAgents.find(
    (a) => (a.hostname || "").toLowerCase() === lower,
  );
  if (byHost?.wazuh_agent_id) return byHost.wazuh_agent_id;
  const direct = wazuhStore.wazuhAgents.find((a) => a.id === routeId);
  if (direct) return direct.id;
  return routeId;
}

type Scope =
  | { kind: "module"; section: WazuhReportSection; label: string }
  | { kind: "agent"; agentId: string; label: string }
  | { kind: "group"; groupId: string; label: string };

// Maps each security route to the Wazuh reporting module (`tab` in the
// plugin's WAZUH_MODULES). Only tabs that the plugin actually knows about
// are listed; the remaining overview dashboards fall back to "general".
const ROUTE_TO_SECTION: Record<
  string,
  { section: WazuhReportSection; label: string }
> = {
  SecurityAgents: { section: "general", label: "Overview · Agents" },
  SecurityAlerts: { section: "general", label: "Overview · Alerts" },
  SecurityDiscover: { section: "general", label: "Overview · Discover" },
  SecurityGroups: { section: "general", label: "Overview · Groups" },
  ITHygiene: { section: "general", label: "Overview · IT Hygiene" },
  ThreatHunting: { section: "general", label: "Overview · Threat Hunting" },
  SecurityFIM: { section: "fim", label: "File Integrity Monitoring" },
  VulnerabilityDetection: { section: "vuls", label: "Vulnerabilities" },
};

const COMPLIANCE_FRAMEWORKS: Record<
  string,
  { section: WazuhReportSection; label: string }
> = {
  sca: { section: "sca", label: "SCA" },
  pci: { section: "pci", label: "PCI DSS" },
  "pci-dss": { section: "pci", label: "PCI DSS" },
  gdpr: { section: "gdpr", label: "GDPR" },
  hipaa: { section: "hipaa", label: "HIPAA" },
  nist: { section: "nist", label: "NIST 800-53" },
  nist80053: { section: "nist", label: "NIST 800-53" },
  tsc: { section: "tsc", label: "TSC / SOC 2" },
};

const scope = computed<Scope>(() => {
  const name = route.name as string;

  if (name === "SecurityGroupDetail") {
    const gid = String(route.params.groupName ?? "");
    if (gid) return { kind: "group", groupId: gid, label: `Group · ${gid}` };
  }

  if (name === "AgentEndpointDetail") {
    const aid = String(route.params.agentId ?? "");
    if (aid) {
      const wazuhId = resolveWazuhAgentId(aid);
      return { kind: "agent", agentId: wazuhId, label: `Agent · ${wazuhId}` };
    }
  }
  if (name === "AgentSecurityDetail") {
    const hostname = String(route.params.hostname ?? "");
    if (hostname) {
      const wazuhId = resolveWazuhAgentId(hostname);
      return { kind: "agent", agentId: wazuhId, label: `Agent · ${wazuhId}` };
    }
  }

  if (name === "ComplianceHub") {
    const fw = String(route.params.framework ?? "sca").toLowerCase();
    const entry = COMPLIANCE_FRAMEWORKS[fw];
    if (entry) return { kind: "module", section: entry.section, label: entry.label };
  }

  const entry = ROUTE_TO_SECTION[name];
  if (entry) return { kind: "module", section: entry.section, label: entry.label };
  return { kind: "module", section: "general", label: "Overview" };
});

const scopeLabel = computed(() => scope.value.label);
const scopeTooltip = computed(() => {
  const s = scope.value;
  if (s.kind === "agent") return `Wazuh agent report for ${s.agentId}`;
  if (s.kind === "group") return `Wazuh group report for ${s.groupId}`;
  return `Wazuh module report: ${s.section}`;
});

async function onGenerate() {
  loading.value = true;
  try {
    const s = scope.value;
    let resp;
    if (s.kind === "agent") {
      resp = await createAgentReport(s.agentId);
    } else if (s.kind === "group") {
      resp = await createGroupReport(s.groupId);
    } else {
      resp = await createModuleReport(s.section);
    }
    const name = resp?.filename ?? resp?.name ?? null;
    notifySuccess(
      name
        ? `${s.label} report generated: ${name}. Open Security → Reports to download.`
        : `${s.label} report generated. Open Security → Reports to download.`,
    );
  } catch (err) {
    notifyError(`Failed to generate report: ${extractWazuhError(err)}`);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.gen-report-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  min-height: 32px;
  padding: 0 12px;
}

.body--dark .gen-report-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}
</style>
