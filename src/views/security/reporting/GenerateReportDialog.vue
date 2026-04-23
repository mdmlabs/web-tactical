<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 460px">
      <q-bar>
        Generate Report
        <q-space />
        <q-btn v-close-popup dense flat icon="close">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-subtitle2 q-mb-xs">Scope</div>
        <div class="row q-gutter-sm text-body2">
          <q-chip
            v-if="ctx.kind === 'module'"
            dense
            color="primary"
            text-color="white"
            :label="`Module: ${ctx.section}`"
          />
          <q-chip
            v-else-if="ctx.kind === 'agent'"
            dense
            color="primary"
            text-color="white"
            :label="`Agent: ${ctx.agentId}`"
          />
          <q-chip
            v-else-if="ctx.kind === 'group'"
            dense
            color="primary"
            text-color="white"
            :label="`Group: ${ctx.groupId}`"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="timeFrom"
          outlined
          dense
          label="Time from"
          class="q-mb-sm"
          hint="e.g. now-24h, now-7d, or ISO-8601"
        />
        <q-input
          v-model="timeTo"
          outlined
          dense
          label="Time to"
          hint="e.g. now, or ISO-8601"
        />
      </q-card-section>

      <q-card-section v-if="lastReport" class="q-pt-none">
        <q-banner class="bg-green-1 text-green-9 q-mb-sm" rounded>
          <template #avatar>
            <q-icon name="check_circle" />
          </template>
          Report generated:
          <a
            :href="downloadUrl(lastReport)"
            target="_blank"
            rel="noopener"
            class="text-primary"
            >{{ lastReport }}</a
          >
          <template #action>
            <q-btn
              flat
              dense
              no-caps
              label="View all reports"
              color="primary"
              @click="goToReports"
            />
          </template>
        </q-banner>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup dense flat label="Close" />
        <q-btn
          :loading="loading"
          dense
          flat
          label="Generate"
          color="primary"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDialogPluginComponent } from "quasar";
import { notifyError, notifySuccess } from "@/utils/notify";
import {
  createAgentReport,
  createGroupReport,
  createModuleReport,
  extractWazuhError,
  reportDownloadUrl,
  type WazuhReportSection,
} from "@/api/wazuhReporting";

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const route = useRoute();
const router = useRouter();

function goToReports() {
  onDialogOK();
  router.push({ name: "SecurityReports" });
}

type Ctx =
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
  gdpr: "gdpr",
  hipaa: "hipaa",
  nist: "nist",
  tsc: "tsc",
  sca: "sca",
};

const ctx = computed<Ctx>(() => {
  const name = route.name as string;

  // Group detail page — POST /reports/groups/:groupName
  if (name === "SecurityGroupDetail") {
    const gid = String(route.params.groupName ?? "");
    if (gid) return { kind: "group", groupId: gid };
  }

  // Agent-scoped pages — POST /reports/agents/:agentId
  if (name === "AgentEndpointDetail") {
    const aid = String(route.params.agentId ?? "");
    if (aid) return { kind: "agent", agentId: aid };
  }
  if (name === "AgentSecurityDetail") {
    const hostname = String(route.params.hostname ?? "");
    if (hostname) return { kind: "agent", agentId: hostname };
  }

  // Compliance hub — section depends on :framework
  if (name === "ComplianceHub") {
    const fw = String(route.params.framework ?? "").toLowerCase();
    const section = COMPLIANCE_FRAMEWORKS[fw];
    if (section) return { kind: "module", section };
    return { kind: "module", section: "general" };
  }

  // Module-scoped security pages
  const section = ROUTE_TO_SECTION[name] ?? "general";
  return { kind: "module", section };
});

const timeFrom = ref("now-24h");
const timeTo = ref("now");
const loading = ref(false);
const lastReport = ref<string | null>(null);

function downloadUrl(name: string) {
  return reportDownloadUrl(name);
}

function toIso(v: string): string {
  // Accept either ISO-8601 or simple now/now-<n><unit> date-math.
  const s = v.trim();
  const now = Date.now();
  if (s === "now") return new Date(now).toISOString();
  const m = s.match(/^now-(\d+)([smhdwMy])$/);
  if (m) {
    const n = Number(m[1]);
    const unit = m[2];
    const mult: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
      w: 7 * 86_400_000,
      M: 30 * 86_400_000,
      y: 365 * 86_400_000,
    };
    return new Date(now - n * mult[unit]).toISOString();
  }
  // Otherwise assume it is already a valid ISO-8601 string.
  return new Date(s).toISOString();
}

async function submit() {
  loading.value = true;
  lastReport.value = null;
  try {
    const time = { from: toIso(timeFrom.value), to: toIso(timeTo.value) };
    let resp;
    const c = ctx.value;
    if (c.kind === "agent") {
      resp = await createAgentReport(c.agentId, { time });
    } else if (c.kind === "group") {
      resp = await createGroupReport(c.groupId, { time });
    } else {
      resp = await createModuleReport(c.section, false, { time });
    }
    const name = resp?.filename ?? resp?.name ?? null;
    lastReport.value = name;
    notifySuccess(name ? `Report generated: ${name}` : "Report generated");
  } catch (err) {
    notifyError(`Failed to generate report: ${extractWazuhError(err)}`);
  } finally {
    loading.value = false;
  }
}
</script>
