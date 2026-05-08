<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="text-subtitle1">{{ $t('security.components.RemediationPanel.7130ec') }}</div>
      <q-space />
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
                :label="$t('security.components.RemediationPanel.b8d3d8')"
                @click="resolveIncident(props.row.id)"
                v-if="props.row.stage !== 'resolved'" />
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
const loading = ref(false);
const loadingInc = ref(false);
const wfDialogOpen = ref(false);
const savingWf = ref(false);

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

function stageColor(s: string) {
  return { detected: "warning", acting: "primary", escalated: "negative", verifying: "orange", resolved: "positive", failed: "negative" }[s] ?? "grey";
}

async function load() {
  loading.value = true;
  try { workflows.value = (await axios.get("/security/remediation/workflows/")).data || []; } catch { workflows.value = []; }
  finally { loading.value = false; }
  loadingInc.value = true;
  try { incidents.value = (await axios.get("/security/remediation/incidents/")).data || []; } catch { incidents.value = []; }
  finally { loadingInc.value = false; }
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

async function resolveIncident(id: number) {
  await axios.patch(`/security/remediation/incidents/${id}/`, { stage: "resolved" });
  $q.notify({ message: "Marked as resolved", color: "positive", icon: "check" });
  await load();
}

onMounted(load);
</script>
