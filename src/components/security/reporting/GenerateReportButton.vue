<template>
  <q-btn
    flat
    no-caps
    :icon="loading ? undefined : 'picture_as_pdf'"
    :loading="loading"
    label="Generate Report"
    class="gen-report-btn"
    @click="onGenerate"
  >
    <template #loading>
      <q-spinner-dots />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notifyError, notifySuccess } from "@/utils/notify";
import {
  createAgentReport,
  createGroupReport,
  createModuleReport,
  extractWazuhError,
  type WazuhReportSection,
} from "@/api/wazuhReporting";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

type Scope =
  | { kind: "module"; section: WazuhReportSection }
  | { kind: "agent"; agentId: string }
  | { kind: "group"; groupId: string };

const ROUTE_TO_SECTION: Record<string, WazuhReportSection> = {
  SecurityAgents: "general",
  SecurityAlerts: "general",
  SecurityDiscover: "general",
  ITHygiene: "general",
  SecurityFIM: "fim",
  ThreatHunting: "general",
  VulnerabilityDetection: "vuls",
  SecurityGroups: "general",
};

const COMPLIANCE_FRAMEWORKS: Record<string, WazuhReportSection> = {
  pci: "pci",
  "pci-dss": "pci",
  gdpr: "gdpr",
  hipaa: "hipaa",
  nist: "nist",
  nist80053: "nist",
  tsc: "tsc",
  sca: "sca",
};

const scope = computed<Scope>(() => {
  const name = route.name as string;

  if (name === "SecurityGroupDetail") {
    const gid = String(route.params.groupName ?? "");
    if (gid) return { kind: "group", groupId: gid };
  }

  if (name === "AgentEndpointDetail") {
    const aid = String(route.params.agentId ?? "");
    if (aid) return { kind: "agent", agentId: aid };
  }
  if (name === "AgentSecurityDetail") {
    const hostname = String(route.params.hostname ?? "");
    if (hostname) return { kind: "agent", agentId: hostname };
  }

  if (name === "ComplianceHub") {
    const fw = String(route.params.framework ?? "").toLowerCase();
    const section = COMPLIANCE_FRAMEWORKS[fw];
    if (section) return { kind: "module", section };
    return { kind: "module", section: "general" };
  }

  const section = ROUTE_TO_SECTION[name] ?? "general";
  return { kind: "module", section };
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
        ? `Report generated: ${name}`
        : "Report generated. Opening My Reports…",
    );
    router.push({ name: "SecurityReports" });
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
