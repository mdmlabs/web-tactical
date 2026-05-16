<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="text-subtitle1">{{ $t('security.components.RemediationPanel.7130ec') }}</div>
      <q-space />
      <q-btn flat dense round icon="refresh" :loading="loading || loadingInc || loadingAudit" @click="load">
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
      <q-btn color="primary" icon="add" :label="$t('security.components.RemediationPanel.c1418c')" @click="showWorkflowDialog()" />
    </div>
    <div class="text-caption text-grey q-mb-md">
      {{ $t('security.components.RemediationPanel.a5f2ca') }}
    </div>

    <div class="row q-gutter-md">
      <!-- Workflows -->
      <div class="col-12 col-md-5">
        <div class="text-subtitle2 q-mb-sm">{{ $t('security.components.RemediationPanel.825ce9') }}</div>
        <q-table :rows="workflows" :columns="wfColumns" dense row-key="id" :loading="loading">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white" size="sm">
                {{ props.value ? 'On' : 'Off' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="delete" size="xs" color="negative"
                @click="deleteWorkflow(props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Active Incidents -->
      <div class="col-12 col-md-6">
        <div class="text-subtitle2 q-mb-sm">{{ $t('security.components.RemediationPanel.7e3d73') }}</div>
        <q-table :rows="incidents" :columns="incColumns" dense row-key="id" :loading="loadingInc">
          <template v-slot:body-cell-stage="props">
            <q-td :props="props">
              <q-chip dense :color="stageColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense size="sm" color="positive" icon="check"
                @click="remediationAction(props.row, 'resolve')"
                v-if="props.row.stage !== 'resolved'" />
              <q-btn flat dense round size="sm" color="primary" icon="play_arrow"
                :loading="actionLoading === actionKey(props.row, 'run_action')"
                @click="remediationAction(props.row, 'run_action')">
                <q-tooltip>Run remediation action</q-tooltip>
              </q-btn>
              <q-btn flat dense round size="sm" color="secondary" icon="person"
                :loading="actionLoading === actionKey(props.row, 'request_user_action')"
                @click="promptRemediationAction(props.row, 'request_user_action')">
                <q-tooltip>Request user action</q-tooltip>
              </q-btn>
              <q-btn flat dense round size="sm" color="warning" icon="priority_high"
                :loading="actionLoading === actionKey(props.row, 'escalate')"
                @click="promptRemediationAction(props.row, 'escalate')">
                <q-tooltip>Escalate</q-tooltip>
              </q-btn>
              <q-btn flat dense round size="sm" color="positive" icon="fact_check"
                :loading="actionLoading === actionKey(props.row, 'verify')"
                @click="remediationAction(props.row, 'verify')">
                <q-tooltip>Verify remediation</q-tooltip>
              </q-btn>
              <q-btn flat dense round size="sm" color="negative" icon="close"
                :loading="actionLoading === actionKey(props.row, 'fail')"
                @click="promptRemediationAction(props.row, 'fail')">
                <q-tooltip>Mark failed</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="col-12">
        <div class="text-subtitle2 q-mb-sm">Remediation audit</div>
        <q-table :rows="auditEvents" :columns="auditColumns" dense row-key="id" :loading="loadingAudit" :rows-per-page-options="[10,25,50]">
          <template v-slot:body-cell-stage="props">
            <q-td :props="props">
              <q-chip dense :color="stageColor(props.value)" text-color="white" size="sm">{{ props.value || props.row.status }}</q-chip>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Workflow Dialog -->
    <q-dialog v-model="wfDialogOpen" persistent>
      <q-card style="min-width: 480px">
        <q-bar>{{ $t('security.components.RemediationPanel.a76ef6') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="wfForm.name" :label="$t('security.components.RemediationPanel.d145bb')" outlined dense />
          <q-select v-model="wfForm.trigger_type"
            :options="triggerOptions" :label="$t('security.components.RemediationPanel.d3f06a')" outlined dense emit-value map-options />
          <q-select v-model="wfForm.auto_action"
            :options="actionOptions" :label="$t('security.components.RemediationPanel.fa887c')" outlined dense emit-value map-options />
          <q-input v-model="wfForm.action_target" :label="$t('security.components.RemediationPanel.540c73')" outlined dense />
          <div class="row q-gutter-md">
            <q-input v-model.number="wfForm.escalate_after_minutes" :label="$t('security.components.RemediationPanel.0b34b2')" outlined dense type="number" class="col" />
            <q-input v-model.number="wfForm.verify_after_minutes" :label="$t('security.components.RemediationPanel.779c88')" outlined dense type="number" class="col" />
          </div>
          <q-toggle v-model="wfForm.enabled" :label="$t('security.components.RemediationPanel.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('security.components.RemediationPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('security.components.RemediationPanel.6e157c')" @click="createWorkflow" :loading="savingWf" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const workflows = ref<any[]>([]);
const incidents = ref<any[]>([]);
const auditEvents = ref<any[]>([]);
const loading = ref(false);
const loadingInc = ref(false);
const loadingAudit = ref(false);
const wfDialogOpen = ref(false);
const savingWf = ref(false);
const actionLoading = ref("");

const wfForm = ref<any>({
  name: "", trigger_type: "compliance_fail", auto_action: "notify_only",
  action_target: "", escalate_after_minutes: 60, verify_after_minutes: 30, enabled: true,
});

const triggerOptions = [
  { label: "Compliance Failure", value: "compliance_fail" },
  { label: "Health Critical", value: "health_critical" },
  { label: "FIM Violation", value: "fim_violation" },
  { label: "Malware Detected", value: "malware" },
];
const actionOptions = [
  { label: "Notify Only", value: "notify_only" },
  { label: "Restart Service", value: "restart_service" },
  { label: "Run Script", value: "run_script" },
  { label: "Lock Device", value: "lock_device" },
  { label: "Selective Wipe", value: "wipe_selective" },
  { label: "Request User Action", value: "request_user_action" },
];

const wfColumns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "trigger_type", label: "Trigger", field: "trigger_type", align: "left" as const },
  { name: "auto_action", label: "Action", field: "auto_action", align: "left" as const },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];
const incColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" as const },
  { name: "stage", label: "Stage", field: "stage", align: "center" as const },
  { name: "description", label: "Description", field: "description", align: "left" as const, classes: "ellipsis", style: "max-width:200px" },
  { name: "created_at", label: "Started", field: "created_at", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];
const auditColumns = [
  { name: "event_type", label: "Type", field: "event_type", align: "left" as const },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" as const },
  { name: "action", label: "Action", field: "action", align: "left" as const },
  { name: "stage", label: "Stage", field: "stage", align: "center" as const },
  { name: "actor", label: "Actor", field: "actor", align: "left" as const },
  { name: "title", label: "Title", field: "title", align: "left" as const, classes: "ellipsis", style: "max-width:260px" },
  { name: "created_at", label: "Time", field: "created_at", align: "left" as const },
];

function stageColor(s: string) {
  return { detected: "warning", acting: "primary", user_action: "secondary", escalated: "negative", verifying: "orange", resolved: "positive", failed: "negative", open: "warning" }[s] ?? "grey";
}

async function load() {
  loading.value = true;
  try { workflows.value = (await axios.get("/security/remediation/workflows/")).data || []; } catch { workflows.value = []; }
  finally { loading.value = false; }
  loadingInc.value = true;
  try { incidents.value = (await axios.get("/security/remediation/incidents/")).data || []; } catch { incidents.value = []; }
  finally { loadingInc.value = false; }
  loadingAudit.value = true;
  try {
    const data = (await axios.get("/security/remediation/audit/")).data || {};
    auditEvents.value = data.events || [];
  } catch { auditEvents.value = []; }
  finally { loadingAudit.value = false; }
}

function showWorkflowDialog() {
  wfForm.value = { name: "", trigger_type: "compliance_fail", auto_action: "notify_only", action_target: "", escalate_after_minutes: 60, verify_after_minutes: 30, enabled: true };
  wfDialogOpen.value = true;
}

async function createWorkflow() {
  savingWf.value = true;
  try {
    await axios.post("/security/remediation/workflows/", wfForm.value);
    wfDialogOpen.value = false;
    $q.notify({ message: "Workflow created", color: "positive", icon: "check" });
    await load();
  } finally { savingWf.value = false; }
}

async function deleteWorkflow(id: number) {
  await axios.delete(`/security/remediation/workflows/${id}/`);
  await load();
}

function actionKey(row: any, action: string) {
  return `${row.id}:${action}`;
}

function promptRemediationAction(row: any, action: string) {
  const titles: Record<string, string> = {
    request_user_action: "Request user action",
    escalate: "Escalate remediation",
    fail: "Mark remediation failed",
  };
  $q.dialog({
    title: titles[action] || "Remediation action",
    prompt: { model: "", type: "textarea", label: "Note" },
    cancel: true,
  }).onOk((note) => remediationAction(row, action, note));
}

async function remediationAction(row: any, action: string, note = "") {
  actionLoading.value = actionKey(row, action);
  try {
    const response = await axios.post(`/security/remediation/incidents/${row.id}/action/`, { action, note });
    const ok = response.data?.ok !== false;
    $q.notify({ message: `Remediation ${action} saved`, color: ok ? "positive" : "warning", icon: ok ? "check" : "warning" });
    await load();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || `Remediation ${action} failed`, color: "negative" });
    await load();
  } finally {
    actionLoading.value = "";
  }
}

onMounted(load);
</script>
