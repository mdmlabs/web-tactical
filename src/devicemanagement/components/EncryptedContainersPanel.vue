<template>
  <q-card flat bordered class="q-mt-md">
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-subtitle2">{{ $t('devicemanagement.components.EncryptedContainersPanel.1fe1af') }}</div>
          <div class="text-caption text-grey">
            {{ $t('devicemanagement.components.EncryptedContainersPanel.504275') }}
          </div>
        </div>
        <div class="col-auto row q-gutter-sm">
          <q-btn flat dense icon="refresh" :label="$t('devicemanagement.components.EncryptedContainersPanel.56e3ba')" :loading="loading" @click="loadContainers" />
          <q-btn color="primary" icon="add" :label="$t('devicemanagement.components.EncryptedContainersPanel.29fab1')" @click="openCreateDialog" />
        </div>
      </div>

      <q-table
        class="q-mt-sm"
        :rows="containers"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        :rows-per-page-options="[10, 25, 50]"
        no-data-:label="$t('devicemanagement.components.EncryptedContainersPanel.40d6c4')"
      >
        <template #body-cell-state="props">
          <q-td :props="props">
            <q-chip dense :color="stateColor(props.row.state)" text-color="white" size="sm">
              {{ props.row.state }}
            </q-chip>
            <q-badge v-if="props.row.state === 'awaiting_user_password'" color="orange" class="q-ml-xs">
              awaiting setup
            </q-badge>
            <q-badge v-if="props.row.key_rotation_required" color="purple" class="q-ml-xs">
              rotate-on-mount
            </q-badge>
            <div v-if="props.row.last_error" class="text-caption text-negative" style="max-width:300px;white-space:pre-wrap">
              {{ props.row.last_error }}
            </div>
          </q-td>
        </template>
        <template #body-cell-policy="props">
          <q-td :props="props">
            <q-badge :color="props.row.password_owner === 'user' ? 'indigo' : 'grey'">
              {{ props.row.password_owner || 'admin' }}
            </q-badge>
            <q-badge v-if="props.row.tpm_bound" color="deep-purple" class="q-ml-xs">TPM</q-badge>
            <q-badge v-if="props.row.recovery_key_escrow_method === 'shamir_v1'" color="teal" class="q-ml-xs">
              Shamir
            </q-badge>
            <q-badge v-if="props.row.recovery_key_escrow_method === 'none'" color="negative" class="q-ml-xs">
              ZK
            </q-badge>
          </q-td>
        </template>
        <template #body-cell-size="props">
          <q-td :props="props">{{ props.row.size_gb }} GiB</q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="play_arrow" :disable="props.row.state === 'mounted'" @click="promptMount(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.25ee09') }}</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="stop" :disable="props.row.state !== 'mounted'" @click="doUnmount(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.ad9854') }}</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="autorenew" @click="promptRotate(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.c4a3a1') }}</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="key" @click="doBackupKey(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.4584b3') }}</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="healing" @click="promptRecover(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.fa0ca7') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat dense size="sm" icon="report_problem" color="orange"
              :disable="props.row.password_owner !== 'user' || props.row.recovery_key_escrow_method !== 'shamir_v1'"
              @click="openRecoveryDialog(props.row)">
              <q-tooltip>Initiate break-glass recovery (Shamir officers)</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="schedule"
              :color="props.row.auto_mount_enabled ? 'positive' : 'teal'"
              @click="promptAutoMount(props.row, !props.row.auto_mount_enabled)">
              <q-tooltip>
                {{ props.row.auto_mount_enabled
                    ? `${$t('devicemanagement.components.EncryptedContainersPanel.9d123a')} (${props.row.auto_mount_letter || '?'}:)`
                    : $t('devicemanagement.components.EncryptedContainersPanel.13af9a') }}
              </q-tooltip>
            </q-btn>
            <q-badge v-if="props.row.auto_mount_enabled"
                     color="positive" outline class="q-ml-xs"
                     :label="`auto ${props.row.auto_mount_letter || '?'}:`" />
            <q-btn flat dense size="sm" icon="scissor_cut" color="orange"
              :disable="props.row.state !== 'mounted'"
              @click="promptWipeFiles(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.957c9a') }}</q-tooltip>
            </q-btn>
            <!-- Phase-2 D: folder-pack / unpack -->
            <q-btn flat dense size="sm" icon="archive" color="indigo"
              :disable="props.row.state === 'mounted'"
              @click="promptFolderPack(props.row)">
              <q-tooltip>Pack folder → .lscfolder (container must be unmounted)</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="unarchive" color="indigo"
              :disable="props.row.state === 'mounted'"
              @click="promptFolderUnpack(props.row)">
              <q-tooltip>Unpack .lscfolder → directory (container must be unmounted)</q-tooltip>
            </q-btn>
            <!-- Phase-2 G: SSO mount -->
            <q-btn flat dense size="sm" icon="vpn_key"
              :color="props.row.sso_enabled ? 'positive' : 'grey'"
              @click="promptSsoEnroll(props.row)">
              <q-tooltip>
                {{ props.row.sso_enabled ? "Disable SSO mount" : "Enable SSO mount (store password server-side)" }}
              </q-tooltip>
            </q-btn>
            <q-btn v-if="props.row.sso_enabled"
              flat dense size="sm" icon="lock_open" color="teal"
              :disable="props.row.state === 'mounted'"
              @click="doSsoMount(props.row)">
              <q-tooltip>Mount via SSO (no password prompt)</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="delete" color="negative" @click="doDelete(props.row)">
              <q-tooltip>{{ $t('devicemanagement.components.EncryptedContainersPanel.746891') }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Usage report (Phase-3 spec #17) -->
    <q-card-section class="q-pt-none">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2">{{ $t('devicemanagement.components.EncryptedContainersPanel.0a6d6e') }}</div>
        <q-btn flat dense icon="refresh" :label="$t('devicemanagement.components.EncryptedContainersPanel.56e3ba')" @click="loadUsage" :loading="usageLoading" />
      </div>
      <q-table
        :rows="usageRows"
        :columns="usageColumns"
        dense row-key="agent_id"
        :rows-per-page-options="[10,25]">
        <template #no-data>
          <div class="text-grey q-pa-md text-center">
            {{ $t('devicemanagement.components.EncryptedContainersPanel.b5546b') }}
          </div>
        </template>
      </q-table>
      <div v-if="usageTotals" class="row q-gutter-md q-mt-sm text-caption text-grey-7">
        <div><b>{{ usageTotals.agents_with_activity }}</b> {{ $t('devicemanagement.components.EncryptedContainersPanel.4f4e1f') }}</div>
        <div><b>{{ usageTotals.transfers }}</b> {{ $t('devicemanagement.components.EncryptedContainersPanel.5b9642') }}</div>
        <div><b>{{ usageTotals.mounts }}</b> {{ $t('devicemanagement.components.EncryptedContainersPanel.f996ec') }} <b>{{ usageTotals.unmounts }}</b> unmounts</div>
        <div><b>{{ usageTotals.wipes }}</b> {{ $t('devicemanagement.components.EncryptedContainersPanel.2d2dd3') }} <b>{{ usageTotals.key_rotations }}</b> {{ $t('devicemanagement.components.EncryptedContainersPanel.642bed') }}</div>
      </div>
    </q-card-section>

    <!-- Wipe-files dialog -->
    <q-dialog v-model="wipeDialogOpen" persistent>
      <q-card style="min-width: 520px">
        <q-bar>
          Selective wipe — container #{{ wipeTarget?.id }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Only paths on drive <code>{{ wipeTarget?.mount_point || "?" }}:</code>
            will be accepted. Files outside the container are rejected server-side.
          </div>
          <q-input
            v-model="wipeRawList"
            type="textarea" rows="6" outlined dense
            :label="$t('devicemanagement.components.EncryptedContainersPanel.587c12')"
            :placeholder="`${wipeTarget?.mount_point || 'G'}:\\reports\\q1.docx\n${wipeTarget?.mount_point || 'G'}:\\archive\\2025\\*.pdf`" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.components.EncryptedContainersPanel.77dfd2')" v-close-popup />
          <q-btn color="negative" icon="delete_sweep" :label="$t('devicemanagement.components.EncryptedContainersPanel.41119f')"
            :loading="wipeLoading" :disable="!wipeRawList.trim()"
            @click="confirmWipeFiles" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create dialog -->
    <q-dialog v-model="createDialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar>
          <q-icon name="lock" class="q-mr-sm" /> {{ $t('devicemanagement.components.EncryptedContainersPanel.520125') }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="createForm.workspace_id"
            :options="workspaceOptions" emit-value map-options
            :label="$t('devicemanagement.components.EncryptedContainersPanel.04169f')"
            outlined dense
          />
          <AgentPicker
            v-model="createForm.agent_id"
            :options="agentOptions"
            :label="$t('devicemanagement.components.EncryptedContainersPanel.e91d15')" outlined dense
          />
          <q-input v-model="createForm.label" :label="$t('devicemanagement.components.EncryptedContainersPanel.4ac1c8')" outlined dense />
          <div class="row q-gutter-md">
            <q-input v-model.number="createForm.size_gb" :label="$t('devicemanagement.components.EncryptedContainersPanel.80b6eb')" type="number" outlined dense style="width:120px" />
            <q-select
              v-model="createForm.drive_letter"
              :options="driveLetterOptions"
              label="Drive"
              outlined dense emit-value map-options
              style="width: 110px"
            />
            <q-select
              v-model="createForm.algorithm"
              :options="[{label:'MKV-256 / CTR + CMAC (strongest)',value:'mkv256'},{label:'MKV-128 / CTR + CMAC',value:'mkv128'}]"
              emit-value map-options
              :label="$t('devicemanagement.components.EncryptedContainersPanel.0af149')" outlined dense class="col"
            />
          </div>
          <q-banner v-if="selectedWorkspaceIsUserManaged" rounded class="bg-indigo-1 text-indigo-9 q-pa-sm">
            <template #avatar><q-icon name="vpn_key" /></template>
            <div class="text-body2">
              This workspace is <b>user-managed</b>. The end-user will be
              prompted on the endpoint to set a password — do <b>not</b>
              enter one here. The container will be created in
              <code>awaiting_user_password</code> state; the orchestrator
              dispatches the init-password flow to the device.
            </div>
          </q-banner>
          <q-input
            v-else
            v-model="createForm.password"
            :label="$t('devicemanagement.components.EncryptedContainersPanel.7cc239')"
            outlined dense
            :type="showPassword ? 'text' : 'password'"
            :hint="$t('devicemanagement.components.EncryptedContainersPanel.07509c')"
          >
            <template #append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.components.EncryptedContainersPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.components.EncryptedContainersPanel.6e157c')" :loading="creating" @click="submitCreate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Recovery-key reveal dialog (one-time) -->
    <q-dialog v-model="keyRevealOpen" persistent>
      <q-card style="min-width: 520px">
        <q-bar>
          <q-icon name="vpn_key" class="q-mr-sm" /> {{ keyRevealTitle }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <div class="text-caption text-grey q-mb-sm">{{ keyRevealNotice }}</div>
          <q-input
            v-model="keyRevealValue"
            filled readonly type="textarea" rows="2"
            class="text-mono"
          />
          <q-btn flat dense icon="content_copy" :label="$t('devicemanagement.components.EncryptedContainersPanel.af74f7')" @click="copyRecoveryKey" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" :label="$t('devicemanagement.components.EncryptedContainersPanel.3e2255')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Phase-3.c — initiate break-glass recovery dialog -->
    <q-dialog v-model="recoveryDialogOpen" persistent>
      <q-card style="min-width:520px">
        <q-bar>
          <span>Initiate recovery — container #{{ recoveryTarget?.id }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            This opens a break-glass recovery request for
            <b>{{ recoveryTarget?.label || 'this container' }}</b>.
            The k-of-n escrow officers configured on the workspace will be
            asked to approve. The reason below is recorded in the audit
            trail.
          </div>
          <q-input
            v-model="recoveryReason"
            type="textarea" rows="4" outlined dense
            label="Reason for recovery"
            placeholder="e.g. user forgot password / officer audit" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="orange" icon="report_problem" label="Submit"
                 :disable="!recoveryReason.trim()" @click="submitRecoveryRequest" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import AgentPicker from "@/devicemanagement/components/AgentPicker.vue";
import { buildAgentOptions, type AgentOptionRich } from "@/devicemanagement/components/agentOptionHelpers";

interface WorkspaceOption { label: string; value: number }

const props = defineProps<{
  agentId?: string;
  workspaces: any[];
  agents: any[];
}>();

const $q = useQuasar();

const loading = ref(false);
const creating = ref(false);
const containers = ref<any[]>([]);
const createDialogOpen = ref(false);
const showPassword = ref(false);
const keyRevealOpen = ref(false);
const keyRevealTitle = ref("");
const keyRevealNotice = ref("");
const keyRevealValue = ref("");

const createForm = reactive({
  workspace_id: null as number | null,
  agent_id: "",
  label: "",
  drive_letter: "",
  size_gb: 10,
  algorithm: "mkv256",
  password: "",
});

const driveLetterOptions = [
  { label: "Auto", value: "" },
  ..."GHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
    label: `${letter}:`,
    value: `${letter}:`,
  })),
];

const columns = [
  { name: "label", label: "Label", field: "label", align: "left" as const },
  { name: "workspace_name", label: "Workspace", field: "workspace_name", align: "left" as const },
  { name: "agent_id", label: "Device", field: "agent_id", align: "left" as const,
    format: (val: string) => (props.agents.find((a: any) => a.agent_id === val)?.hostname || val) },
  { name: "size", label: "Size", field: "size_gb", align: "right" as const },
  { name: "state", label: "State", field: "state", align: "left" as const },
  { name: "policy", label: "Policy", field: "password_owner", align: "left" as const },
  { name: "drive_letter", label: "Drive", field: "drive_letter", align: "left" as const },
  { name: "vhdx_path", label: "VHDX path", field: "vhdx_path", align: "left" as const, classes: "text-caption" },
  { name: "actions", label: "Actions", field: "actions", align: "right" as const },
];

// Phase-3.c — initiate recovery dialog state
const recoveryDialogOpen = ref(false);
const recoveryTarget = ref<any>(null);
const recoveryReason = ref("");

function openRecoveryDialog(row: any) {
  recoveryTarget.value = row;
  recoveryReason.value = "";
  recoveryDialogOpen.value = true;
}

async function submitRecoveryRequest() {
  if (!recoveryTarget.value || !recoveryReason.value.trim()) return;
  try {
    await axios.post("/appmanagement/recovery-requests/", {
      container_id: recoveryTarget.value.id,
      reason: recoveryReason.value.trim(),
    });
    $q.notify({
      message: `Recovery request opened for container #${recoveryTarget.value.id}. Officers will be notified.`,
      color: "positive", icon: "check",
    });
    recoveryDialogOpen.value = false;
    recoveryTarget.value = null;
    recoveryReason.value = "";
  } catch (e: any) {
    $q.notify({
      color: "negative",
      message: e?.response?.data?.detail || e?.response?.data?.error || "Failed to open recovery request",
    });
  }
}

const workspaceOptions = computed<WorkspaceOption[]>(() =>
  (props.workspaces || []).map((w: any) => ({ label: w.name, value: w.id })),
);

// Phase-3.c — when the chosen workspace is user-managed, hide the password
// field in the create dialog and let the endpoint orchestrator drive the
// init-password flow.
const selectedWorkspaceIsUserManaged = computed<boolean>(() => {
  const ws = (props.workspaces || []).find((w: any) => w.id === createForm.workspace_id);
  return !!(ws && ws.password_owner === "user");
});

const agentOptions = computed<AgentOptionRich[]>(() => buildAgentOptions(props.agents));

function stateColor(state: string): string {
  return {
    mounted: "positive",
    unmounted: "grey",
    creating: "info",
    rotating: "info",
    recovering: "warning",
    error: "negative",
    pending: "secondary",
  }[state] || "secondary";
}

async function loadContainers() {
  loading.value = true;
  try {
    const params: any = {};
    if (props.agentId) params.agent_id = props.agentId;
    const { data } = await axios.get("/appmanagement/workspaces/containers/", { params });
    containers.value = data?.items || [];
  } catch (error: any) {
    $q.notify({ color: "negative", message: error?.response?.data?.detail || "Failed to load containers" });
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  Object.assign(createForm, {
    workspace_id: (props.workspaces?.[0]?.id) ?? null,
    agent_id: props.agentId || "",
    label: "",
    drive_letter: "",
    size_gb: 10,
    algorithm: "mkv256",
    password: "",
  });
  createDialogOpen.value = true;
}

function revealRecoveryKey(title: string, notice: string, key: string) {
  keyRevealTitle.value = title;
  keyRevealNotice.value = notice;
  keyRevealValue.value = key;
  keyRevealOpen.value = true;
}

async function copyRecoveryKey() {
  try {
    await navigator.clipboard.writeText(keyRevealValue.value);
    $q.notify({ color: "positive", message: "Recovery key copied" });
  } catch {
    $q.notify({ color: "warning", message: "Clipboard unavailable — copy manually" });
  }
}

async function submitCreate() {
  if (!createForm.workspace_id || !createForm.agent_id) {
    $q.notify({ color: "warning", message: "Workspace and device are required" });
    return;
  }
  if (!selectedWorkspaceIsUserManaged.value && !createForm.password) {
    $q.notify({ color: "warning", message: "Password is required for admin-managed workspaces" });
    return;
  }
  creating.value = true;
  try {
    // For user-managed workspaces, omit `password` entirely — backend
    // requires it to be absent and will create an awaiting-user-password
    // row instead of dispatching SC.exe create.
    const payload: any = { ...createForm };
    if (selectedWorkspaceIsUserManaged.value) delete payload.password;
    const { data } = await axios.post("/appmanagement/workspaces/containers/", payload, { timeout: 15 * 60 * 1000 });
    createDialogOpen.value = false;
    const where = data.container.drive_letter
      ? `mounted on ${data.container.drive_letter}`
      : "ready to mount";
    $q.notify({ color: "positive", icon: "check", message: `Container '${data.container.label}' created — ${where}` });
    if (data.recovery_key) {
      revealRecoveryKey(
        "Recovery key — save this offline",
        data.notice || "This key grants full access to the volume. Store it offline — it will not be shown again.",
        data.recovery_key,
      );
    }
    await loadContainers();
  } catch (error: any) {
    $q.notify({
      color: "negative",
      message: error?.response?.data?.detail || error?.message || "Create failed",
    });
  } finally {
    creating.value = false;
  }
}

async function doUnmount(row: any) {
  try {
    await axios.post(`/appmanagement/workspaces/containers/${row.id}/unmount/`, {}, { timeout: 5 * 60 * 1000 });
    $q.notify({ color: "positive", message: `Unmounted ${row.label}` });
    await loadContainers();
  } catch (error: any) {
    $q.notify({ color: "negative", message: error?.response?.data?.detail || "Unmount failed" });
  }
}

function promptMount(row: any) {
  // Phase-3.b — user-managed containers never ask the admin for a password.
  // The browser dispatches the orchestrator on the endpoint; the end-user
  // is prompted on their desktop for the password (and optional Windows
  // Hello). The two flows differ only by container state.
  if (row.password_owner === "user") {
    const isInitial = row.state === "awaiting_user_password";
    const title = isInitial
      ? `Trigger setup on the endpoint?`
      : `Trigger mount on the endpoint?`;
    const message = isInitial
      ? `The end-user on this device will be prompted in a desktop dialog to set a password for "${row.label}". Officer Shamir shares will be generated locally and escrowed back to the server. Continue?`
      : `The end-user on this device will be prompted for the container password${row.tpm_bound ? " (with Windows Hello if required by policy)" : ""}. Continue?`;
    $q.dialog({ title, message, ok: { label: "Dispatch", color: "primary" }, cancel: true })
      .onOk(async () => {
        try {
          const { data } = await axios.post(
            `/appmanagement/workspaces/containers/${row.id}/mount/`,
            {},
            { timeout: 30 * 1000 },
          );
          $q.notify({
            color: "positive",
            icon: "check",
            message: data?.notice || `Orchestrator dispatched for ${row.label}.`,
            timeout: 6000,
          });
          await loadContainers();
        } catch (error: any) {
          $q.notify({
            color: "negative",
            message: error?.response?.data?.detail || "Dispatch failed",
          });
        }
      });
    return;
  }
  // Legacy admin-managed flow.
  $q.dialog({
    title: `Mount ${row.label}`,
    message: "Enter the container password to unlock the MKV-encrypted volume:",
    prompt: { model: "", type: "password" },
    cancel: true,
  }).onOk(async (password: string) => {
    try {
      await axios.post(`/appmanagement/workspaces/containers/${row.id}/mount/`, { password }, { timeout: 5 * 60 * 1000 });
      $q.notify({ color: "positive", message: `Mounted ${row.label}` });
      await loadContainers();
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Mount failed" });
    }
  });
}

function promptRotate(row: any) {
  $q.dialog({
    title: `Rotate password for ${row.label}`,
    message: "Old password (current):",
    prompt: { model: "", type: "password" },
    cancel: true,
  }).onOk((oldPw: string) => {
    $q.dialog({
      title: "New password",
      message: "The new password to install. A fresh recovery key will be generated and escrowed.",
      prompt: { model: "", type: "password" },
      cancel: true,
    }).onOk(async (newPw: string) => {
      try {
        const { data } = await axios.post(
          `/appmanagement/workspaces/containers/${row.id}/rotate-key/`,
          { old_password: oldPw, new_password: newPw },
          { timeout: 5 * 60 * 1000 },
        );
        if (data.recovery_key) {
          revealRecoveryKey("New recovery key", data.notice || "Store this offline.", data.recovery_key);
        } else {
          $q.notify({ color: "positive", message: "Password rotated" });
        }
        await loadContainers();
      } catch (error: any) {
        $q.notify({ color: "negative", message: error?.response?.data?.detail || "Rotate failed" });
      }
    });
  });
}

async function doBackupKey(row: any) {
  $q.dialog({
    title: `Export recovery key — ${row.label}`,
    message: "This will display the escrowed recovery key (Base64). Action is audit-logged.",
    prompt: { model: "Audit backup", type: "text" },
    cancel: true,
  }).onOk(async (reason: string) => {
    try {
      const { data } = await axios.post(
        `/appmanagement/workspaces/containers/${row.id}/backup-key/`,
        { reason },
      );
      revealRecoveryKey(
        "Escrowed recovery key",
        data.notice || "Store this offline and never over email.",
        data.recovery_key,
      );
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Backup failed" });
    }
  });
}

function promptRecover(row: any) {
  $q.dialog({
    title: `Recover ${row.label}`,
    message: "Leave blank to use the escrowed recovery key, or paste an externally-saved 48-digit recovery password:",
    prompt: { model: "", type: "text" },
    cancel: true,
  }).onOk(async (manualKey: string) => {
    try {
      const body: any = {};
      if (manualKey && manualKey.trim()) body.recovery_key = manualKey.trim();
      await axios.post(`/appmanagement/workspaces/containers/${row.id}/recover/`, body, { timeout: 5 * 60 * 1000 });
      $q.notify({ color: "positive", message: `Recovered ${row.label}` });
      await loadContainers();
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Recover failed" });
    }
  });
}

async function doDelete(row: any) {
  $q.dialog({
    title: `Delete ${row.label}?`,
    message: "This will dismount and erase the VHDX on the endpoint, and drop the DB row. The escrowed recovery key will be destroyed. Continue?",
    ok: { color: "negative", label: "Delete" },
    cancel: true,
  }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/workspaces/containers/${row.id}/`);
      $q.notify({ color: "positive", message: "Container deleted" });
      await loadContainers();
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Delete failed" });
    }
  });
}

// ── Phase-3: auto-mount, selective wipe, usage report ───────────────────
const wipeDialogOpen = ref(false);
const wipeTarget = ref<any>(null);
const wipeRawList = ref("");
const wipeLoading = ref(false);

async function postAutoMount(row: any, enable: boolean, password: string, letter: string) {
  try {
    const { data } = await axios.post(
      `/appmanagement/workspaces/containers/${row.id}/auto-mount/setup/`,
      enable ? { enabled: true, password, letter } : { enabled: false },
    );
    $q.notify({
      message: data.ok ? `Auto-mount ${enable ? "enabled" : "disabled"}` : `Failed: ${data.raw || data.error || "unknown"}`,
      color: data.ok ? "positive" : "negative",
      timeout: 4000,
    });
    if (data.ok) {
      row.auto_mount_enabled = enable;
      row.auto_mount_letter = enable ? (letter || "") : "";
      await load();
    }
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed", color: "negative" });
  }
}

function promptAutoMount(row: any, enable: boolean) {
  if (!enable) {
    $q.dialog({
      title: "Disable auto-mount?",
      message: `Remove the auto-mount Scheduled Tasks for container #${row.id} and wipe the DPAPI-sealed password from the endpoint's registry?`,
      cancel: true,
      ok: { color: "warning", label: "Disable" },
    }).onOk(() => postAutoMount(row, false, "", ""));
    return;
  }
  // Enable: need password + letter
  const defaultLetter = (row.drive_letter || row.auto_mount_letter || "G").replace(/[:\\]/g, "").toUpperCase().slice(0, 1);
  $q.dialog({
    title: "Enable auto-mount",
    message: `Container #${row.id} will mount on every user logon and auto-unmount when the workstation locks. The password is DPAPI-sealed (LocalMachine scope) in the endpoint registry and never stored server-side.`,
    prompt: { model: "", type: "password", label: "Container password", isValid: (v: string) => v.length > 0 },
    cancel: true,
    ok: { color: "primary", label: "Next" },
  }).onOk((password: string) => {
    $q.dialog({
      title: "Drive letter",
      message: "Preferred drive letter the boot task will request. If already taken, the helper script falls back to the first free letter in D..Z.",
      prompt: { model: defaultLetter, type: "text", isValid: (v: string) => /^[D-Zd-z]$/.test((v || "").trim()) },
      cancel: true,
      ok: { color: "primary", label: "Enable" },
    }).onOk((letter: string) => {
      postAutoMount(row, true, password, letter.trim().toUpperCase());
    });
  });
}

function promptWipeFiles(row: any) {
  wipeTarget.value = row;
  wipeRawList.value = "";
  wipeDialogOpen.value = true;
}

async function confirmWipeFiles() {
  if (!wipeTarget.value) return;
  const files = wipeRawList.value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!files.length) return;
  wipeLoading.value = true;
  try {
    const { data } = await axios.post(
      `/appmanagement/workspaces/containers/${wipeTarget.value.id}/wipe-files/`,
      { files },
    );
    const reports = data.reports || [];
    const ok = reports.filter((r: any) => r.ok).length;
    $q.notify({
      message: `Wiped ${ok}/${reports.length} files (rejected: ${(data.rejected || []).length})`,
      color: ok === reports.length && reports.length ? "positive" : "warning",
    });
    wipeDialogOpen.value = false;
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Wipe failed",
      color: "negative",
    });
  } finally {
    wipeLoading.value = false;
  }
}

const usageLoading = ref(false);
const usageRows = ref<any[]>([]);
const usageTotals = ref<any>(null);
const usageColumns = [
  { name: "hostname", label: "Device", field: "hostname", align: "left" },
  { name: "last_user", label: "Last user", field: "last_user", align: "left" },
  { name: "containers", label: "Containers", field: "containers", align: "right" },
  { name: "disk_mb", label: "Disk MB", field: "disk_mb", align: "right" },
  { name: "transfers_total", label: "Transfers", field: "transfers_total", align: "right" },
  { name: "mounts", label: "Mounts", field: "mounts", align: "right" },
  { name: "unmounts", label: "Unmounts", field: "unmounts", align: "right" },
  { name: "wipes", label: "Wipes", field: "wipes", align: "right" },
  { name: "key_rotations", label: "Key rotations", field: "key_rotations", align: "right" },
  { name: "last_transfer_at", label: "Last transfer", field: "last_transfer_at", align: "left" },
];

async function loadUsage() {
  usageLoading.value = true;
  try {
    const { data } = await axios.get(
      "/appmanagement/workspaces/containers/usage-report/",
      { params: { days: 30 } },
    );
    usageRows.value = data.rows || [];
    usageTotals.value = data.totals || null;
  } catch (e: any) {
    usageRows.value = [];
    usageTotals.value = null;
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load usage",
      color: "negative",
    });
  } finally {
    usageLoading.value = false;
  }
}

watch(() => props.agentId, loadContainers);
onMounted(() => { loadContainers(); loadUsage(); });

// ── Phase-2 D: folder-pack / unpack ─────────────────────────────────────

function promptFolderPack(row: any) {
  $q.dialog({
    title: "Pack folder → .lscfolder",
    message: `Bundle a directory tree into a single sealed envelope. Uses container #${row.id}'s DEK.`,
    prompt: { model: "", type: "text", label: "Source directory (e.g. C:\\Reports)" },
    cancel: true, ok: { color: "primary", label: "Next" },
  }).onOk((source: string) => {
    const src = (source || "").trim();
    if (!src) return;
    $q.dialog({
      title: "Output path",
      prompt: { model: "C:\\LabMDM\\" + src.replace(/.*[\\/]/, "") + ".lscfolder", type: "text" },
      cancel: true, ok: { color: "primary", label: "Next" },
    }).onOk((output: string) => {
      const out = (output || "").trim();
      if (!out) return;
      $q.dialog({
        title: "Container password",
        prompt: { model: "", type: "password", isValid: (v: string) => v.length > 0 },
        cancel: true, ok: { color: "primary", label: "Pack" },
      }).onOk(async (password: string) => {
        try {
          const { data } = await axios.post(
            `/appmanagement/workspaces/containers/${row.id}/folder-pack/`,
            { source: src, output: out, password },
          );
          $q.notify({
            message: data.ok
              ? `Packed ${data.archive_bytes || 0} B → ${out}`
              : `Failed: ${data.raw || data.error || "unknown"}`,
            color: data.ok ? "positive" : "negative", timeout: 5000,
          });
        } catch (e: any) {
          $q.notify({ message: e?.response?.data?.error || e?.message || "Failed", color: "negative" });
        }
      });
    });
  });
}

function promptFolderUnpack(row: any) {
  $q.dialog({
    title: "Unpack .lscfolder archive",
    prompt: { model: "", type: "text", label: "Archive path (e.g. C:\\LabMDM\\Reports.lscfolder)" },
    cancel: true, ok: { color: "primary", label: "Next" },
  }).onOk((archive: string) => {
    const arch = (archive || "").trim();
    if (!arch) return;
    $q.dialog({
      title: "Destination directory",
      prompt: { model: "C:\\Restore", type: "text" },
      cancel: true, ok: { color: "primary", label: "Next" },
    }).onOk((dest: string) => {
      const d = (dest || "").trim();
      if (!d) return;
      $q.dialog({
        title: "Container password",
        prompt: { model: "", type: "password", isValid: (v: string) => v.length > 0 },
        cancel: true, ok: { color: "primary", label: "Unpack" },
      }).onOk(async (password: string) => {
        try {
          const { data } = await axios.post(
            `/appmanagement/workspaces/containers/${row.id}/folder-unpack/`,
            { archive: arch, dest: d, password },
          );
          $q.notify({
            message: data.ok
              ? `Unpacked ${data.file_count || 0} files → ${d}`
              : `Failed: ${data.raw || data.error || "unknown"}`,
            color: data.ok ? "positive" : "negative", timeout: 5000,
          });
        } catch (e: any) {
          $q.notify({ message: e?.response?.data?.error || e?.message || "Failed", color: "negative" });
        }
      });
    });
  });
}

// ── Phase-2 G: SSO mount enrol + mount-sso ──────────────────────────────

function promptSsoEnroll(row: any) {
  if (row.sso_enabled) {
    $q.dialog({
      title: "Disable SSO mount?",
      message: `Remove the server-stored password for container #${row.id}? Users will have to type the password again to mount.`,
      cancel: true, ok: { color: "warning", label: "Disable" },
    }).onOk(async () => {
      try {
        const { data } = await axios.post(
          `/appmanagement/workspaces/containers/${row.id}/sso-enroll/`, { disable: true });
        $q.notify({ message: "SSO disabled", color: "positive" });
        row.sso_enabled = data.sso_enabled ?? false;
        await loadContainers();
      } catch (e: any) {
        $q.notify({ message: e?.response?.data?.error || e?.message, color: "negative" });
      }
    });
    return;
  }
  $q.dialog({
    title: "Enable SSO mount",
    message: `The container password will be stored server-side, MKV256-sealed, and used by authenticated users to mount container #${row.id} without a prompt.`,
    prompt: { model: "", type: "password", label: "Current container password", isValid: (v: string) => v.length > 0 },
    cancel: true, ok: { color: "primary", label: "Enable" },
  }).onOk(async (password: string) => {
    try {
      const { data } = await axios.post(
        `/appmanagement/workspaces/containers/${row.id}/sso-enroll/`, { password });
      $q.notify({ message: "SSO enabled — Mount-SSO button available", color: "positive" });
      row.sso_enabled = data.sso_enabled ?? true;
      await loadContainers();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message, color: "negative" });
    }
  });
}

async function doSsoMount(row: any) {
  try {
    const { data } = await axios.post(
      `/appmanagement/workspaces/containers/${row.id}/mount-sso/`, {});
    if (data.ready) {
      $q.notify({ message: `Mounted via SSO at ${data.letter}`, color: "positive" });
      await loadContainers();
    } else {
      $q.notify({
        message: data.error || data.raw || "Mount failed",
        color: "negative", timeout: 5000,
      });
    }
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message, color: "negative" });
  }
}
</script>
