<template>
  <div class="agent-security-detail">
    <q-btn
      flat
      icon="arrow_back"
      label="Back to Agents"
      class="q-mb-md"
      @click="$router.push({ name: 'SecurityAgents' })"
    />

    <!-- Agent Info Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ agent?.hostname ?? hostname }}</div>
        <div class="text-caption text-grey">Agent Security Details</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">Tactical Status</div>
            <q-badge
              v-if="agent"
              :color="agent.status === 'online' ? 'green' : 'red'"
              :label="agent.status"
            />
            <span v-else>—</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">MDM-Lab Status</div>
            <q-badge
              v-if="agent?.wazuh_status"
              :color="agent.wazuh_status === 'active' ? 'green' : 'red'"
              :label="agent.wazuh_status"
            />
            <span v-else>Not synced</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">MDM-Lab Agent ID</div>
            <span>{{ agent?.wazuh_agent_id ?? "—" }}</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">OS</div>
            <span>{{ agent?.operating_system ?? "—" }}</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">Site</div>
            <span>{{ agent?.site_name ?? "—" }}</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">Client</div>
            <span>{{ agent?.client_name ?? "—" }}</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">MDM-Lab Version</div>
            <span>{{ agent?.wazuh_version ?? "—" }}</span>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey">MDM-Lab Groups</div>
            <template v-if="agent?.wazuh_groups?.length">
              <q-chip
                v-for="g in agent.wazuh_groups"
                :key="g"
                dense
                size="sm"
                :label="g"
                class="q-mr-xs"
              />
            </template>
            <span v-else>—</span>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabs -->
    <q-card v-if="agent?.wazuh_agent_id">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        no-caps
      >
        <q-tab name="vulnerabilities" icon="bug_report" label="Vulnerabilities" />
        <q-tab name="fim" icon="insert_drive_file" label="FIM (Syscheck)" />
        <q-tab name="sca" icon="verified_user" label="SCA" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Vulnerabilities -->
        <q-tab-panel name="vulnerabilities">
          <q-table
            :rows="wazuhStore.vulnerabilities"
            :columns="vulnColumns"
            flat
            dense
            :loading="wazuhStore.vulnerabilitiesLoading"
            :pagination="{ rowsPerPage: 15 }"
            no-data-label="No vulnerabilities found"
          >
            <template #body-cell-severity="props">
              <q-td :props="props">
                <q-badge
                  :color="severityColor(props.row.severity)"
                  :label="props.row.severity"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- FIM -->
        <q-tab-panel name="fim">
          <q-table
            :rows="wazuhStore.syscheckEntries"
            :columns="fimColumns"
            flat
            dense
            :loading="wazuhStore.syscheckLoading"
            :pagination="{ rowsPerPage: 15 }"
            no-data-label="No syscheck entries found"
          />
        </q-tab-panel>

        <!-- SCA -->
        <q-tab-panel name="sca">
          <q-table
            :rows="wazuhStore.scaPolicies"
            :columns="scaColumns"
            flat
            dense
            :loading="wazuhStore.scaLoading"
            :pagination="{ rowsPerPage: 15 }"
            no-data-label="No SCA policies found"
          >
            <template #body-cell-score="props">
              <q-td :props="props">
                <q-linear-progress
                  :value="props.row.score / 100"
                  :color="props.row.score >= 80 ? 'green' : props.row.score >= 50 ? 'orange' : 'red'"
                  rounded
                  style="max-width: 120px"
                  class="q-mr-sm"
                />
                <span>{{ props.row.score }}%</span>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-banner v-else class="bg-blue-1 q-mt-md" rounded>
      <template #avatar>
        <q-icon name="info" color="blue" />
      </template>
      This agent is not synced with MDM-Lab. Security detail tabs require an MDM-Lab agent match.
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useWazuhStore } from "@/stores/wazuh";

const props = defineProps<{ hostname?: string }>();
const route = useRoute();
const wazuhStore = useWazuhStore();

const tab = ref("vulnerabilities");
const hostname = computed(() => (props.hostname ?? route.params.hostname) as string);

const agent = computed(() => {
  return (
    wazuhStore.selectedAgent ??
    wazuhStore.mergedAgents.find(
      (a) => a.hostname.toLowerCase() === hostname.value?.toLowerCase(),
    ) ??
    null
  );
});

const vulnColumns = [
  { name: "cve", label: "CVE", field: "cve", align: "left" as const, sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "center" as const, sortable: true },
  { name: "name", label: "Package", field: "name", align: "left" as const },
  { name: "version", label: "Version", field: "version", align: "left" as const },
  { name: "title", label: "Title", field: "title", align: "left" as const },
  { name: "detection_time", label: "Detected", field: "detection_time", align: "left" as const, sortable: true },
];

const fimColumns = [
  { name: "file", label: "File", field: "file", align: "left" as const, sortable: true },
  { name: "type", label: "Type", field: "type", align: "center" as const },
  { name: "date", label: "Date", field: "date", align: "left" as const, sortable: true },
  { name: "size", label: "Size", field: "size", align: "right" as const },
  { name: "uname", label: "User", field: "uname", align: "left" as const },
];

const scaColumns = [
  { name: "name", label: "Policy", field: "name", align: "left" as const },
  { name: "score", label: "Score", field: "score", align: "left" as const, sortable: true },
  { name: "pass", label: "Pass", field: "pass", align: "center" as const },
  { name: "fail", label: "Fail", field: "fail", align: "center" as const },
  { name: "total_checks", label: "Total", field: "total_checks", align: "center" as const },
  { name: "end_scan", label: "Last Scan", field: "end_scan", align: "left" as const },
];

function severityColor(severity: string): string {
  const s = (severity ?? "").toLowerCase();
  if (s === "critical") return "red";
  if (s === "high") return "deep-orange";
  if (s === "medium") return "orange";
  if (s === "low") return "blue";
  return "grey";
}

function loadTabData() {
  const agentId = agent.value?.wazuh_agent_id;
  if (!agentId) return;

  switch (tab.value) {
    case "vulnerabilities":
      wazuhStore.fetchVulnerabilities(agentId);
      break;
    case "fim":
      wazuhStore.fetchSyscheck(agentId);
      break;
    case "sca":
      wazuhStore.fetchSCA(agentId);
      break;
  }
}

watch(tab, () => loadTabData());

onMounted(() => {
  if (agent.value?.wazuh_agent_id) {
    loadTabData();
  }
});
</script>

<style scoped>
.agent-security-detail {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}
</style>
