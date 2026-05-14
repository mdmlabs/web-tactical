<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">Camera, Microphone, and USB Control</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-list bordered separator>
          <q-item-label header>Global enforcement</q-item-label>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="videocam_off" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Disable camera globally</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.camera_global_disabled" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="mic_off" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Mute microphone globally</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.mic_global_disabled" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="usb" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Block USB storage on non-compliance</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.usb_block_on_non_compliance" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="gpp_bad" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Block USB storage on malware detection</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.usb_block_on_threat" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="policy" color="warning" /></q-item-section>
            <q-item-section>
              <q-item-label>Block camera on non-compliance</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.camera_block_on_non_compliance" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="policy" color="warning" /></q-item-section>
            <q-item-section>
              <q-item-label>Mute microphone on non-compliance</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.mic_block_on_non_compliance" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-6">
        <q-list bordered>
          <q-item-label header>Manual action</q-item-label>
          <q-item>
            <q-item-section class="q-gutter-sm">
              <q-select
                v-model="actionForm.agent_id"
                :options="agentOptions"
                label="Target device"
                outlined
                dense
                emit-value
                map-options
              />
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select
                    v-model="actionForm.device_type"
                    :options="deviceTypeOptionsWithUsb"
                    label="Peripheral"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-6">
                  <q-select
                    v-model="actionForm.enabled"
                    :options="actionOptions"
                    label="Action"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
              </div>
              <q-input v-model="actionForm.reason" label="Reason" outlined dense />
              <q-btn
                color="primary"
                icon="send"
                label="Send command"
                :loading="sendingAction"
                :disable="!actionForm.agent_id"
                @click="sendAction"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="text-subtitle2 q-mb-sm">
          Pending temporary access
          <q-badge color="warning" :label="pendingCount" class="q-ml-sm" />
        </div>
        <q-list bordered separator>
          <q-item v-for="req in pendingRequests" :key="req.id">
            <q-item-section avatar>
              <q-icon :name="scheduleIcon(req.device_type)" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ displayPeripheral(req.device_type) }} access</q-item-label>
              <q-item-label caption>
                {{ displayAgent(req.agent_id) }} · {{ req.duration_minutes }} min
              </q-item-label>
              <q-item-label caption v-if="req.reason">Reason: {{ req.reason }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row q-gutter-xs">
                <q-btn flat dense size="sm" color="positive" icon="check" @click="approve(req.id)" title="Approve" />
                <q-btn flat dense size="sm" color="negative" icon="close" @click="deny(req.id)" title="Deny" />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="pendingRequests.length === 0">
            <q-item-section class="text-grey text-center">No pending requests</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-6">
        <div class="text-subtitle2 q-mb-sm">
          Time-based schedules
          <q-btn flat dense icon="add" size="sm" color="primary" @click="showScheduleDialog()" class="q-ml-sm" />
        </div>
        <q-list bordered separator dense>
          <q-item v-for="s in schedules" :key="s.id">
            <q-item-section avatar>
              <q-icon :name="scheduleIcon(s.device_type)" :color="s.enabled ? 'primary' : 'grey'" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ s.name }}</q-item-label>
              <q-item-label caption>
                {{ displayPeripheral(s.device_type) }} · {{ displayScope(s) }} ·
                {{ s.disabled_hours_start }}:00-{{ s.disabled_hours_end }}:00
              </q-item-label>
              <q-item-label caption>{{ displayDays(s.disabled_days) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat dense round icon="delete" size="xs" color="negative" @click="deleteSchedule(s.id)" />
            </q-item-section>
          </q-item>
          <q-item v-if="schedules.length === 0">
            <q-item-section class="text-grey text-center">No schedules configured</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <q-dialog v-model="scheduleDialogOpen" persistent>
      <q-card style="min-width: 520px">
        <q-bar>
          New peripheral schedule
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="schedForm.name" label="Schedule name" outlined dense />
          <q-select
            v-model="schedForm.device_type"
            :options="deviceTypeOptionsWithUsb"
            label="Peripheral"
            outlined
            dense
            emit-value
            map-options
          />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model="schedForm.scope"
                :options="scopeOptions"
                label="Scope"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="schedForm.target_agent_id"
                :options="agentOptions"
                label="Target device"
                outlined
                dense
                emit-value
                map-options
                :disable="schedForm.scope !== 'device'"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model.number="schedForm.disabled_hours_start"
                :options="hours"
                label="Start"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-6">
              <q-select
                v-model.number="schedForm.disabled_hours_end"
                :options="hours"
                label="End"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
          </div>
          <q-select
            v-model="schedForm.disabled_days"
            :options="dayOptions"
            label="Days"
            multiple
            use-chips
            outlined
            dense
            emit-value
            map-options
          />
          <q-toggle v-model="schedForm.enabled" label="Enabled" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Create" @click="createSchedule" :loading="savingSched" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const requests = ref<any[]>([]);
const schedules = ref<any[]>([]);
const agentOptions = ref<{ label: string; value: string }[]>([]);
const scheduleDialogOpen = ref(false);
const savingSched = ref(false);
const sendingAction = ref(false);

const globals = ref<any>({
  camera_global_disabled: false,
  camera_block_on_non_compliance: false,
  mic_global_disabled: false,
  mic_block_on_non_compliance: false,
  usb_block_on_non_compliance: false,
  usb_block_on_threat: false,
});
const actionForm = ref<any>({
  agent_id: "",
  device_type: "camera",
  enabled: false,
  reason: "",
});
const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i.toString().padStart(2, "0")}:00`,
  value: i,
}));
const dayOptions = [
  { label: "Mon", value: 0 },
  { label: "Tue", value: 1 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 3 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 5 },
  { label: "Sun", value: 6 },
];
const deviceTypeOptions = [
  { label: "Camera", value: "camera" },
  { label: "Microphone", value: "mic" },
];
const deviceTypeOptionsWithUsb = [
  ...deviceTypeOptions,
  { label: "USB storage", value: "usb" },
];
const actionOptions = [
  { label: "Enable", value: true },
  { label: "Disable", value: false },
];
const scopeOptions = [
  { label: "All devices", value: "global" },
  { label: "Specific device", value: "device" },
];
const schedForm = ref<any>(defaultScheduleForm());

const pendingRequests = computed(() => requests.value.filter((r) => r.status === "pending"));
const pendingCount = computed(() => pendingRequests.value.length);

function defaultScheduleForm() {
  return {
    name: "",
    device_type: "camera",
    disabled_days: [],
    disabled_hours_start: 9,
    disabled_hours_end: 18,
    scope: "global",
    target_agent_id: "",
    enabled: true,
  };
}

function scheduleIcon(t: string) {
  return { camera: "videocam", mic: "mic", usb: "usb" }[t] ?? "device_unknown";
}

function displayPeripheral(t: string) {
  return { camera: "Camera", mic: "Microphone", usb: "USB storage" }[t] ?? t;
}

function displayAgent(agentId: string) {
  return agentOptions.value.find((a) => a.value === agentId)?.label || agentId;
}

function displayScope(row: any) {
  return row.scope === "device" ? displayAgent(row.target_agent_id) : "All devices";
}

function displayDays(days: number[] | null | undefined) {
  if (!Array.isArray(days) || days.length === 0) return "Every day";
  return dayOptions.filter((d) => days.includes(d.value)).map((d) => d.label).join(", ");
}

async function loadAgents() {
  try {
    const response = await axios.get("/agents/", { params: { detail: "false" } });
    const list = Array.isArray(response.data) ? response.data : response.data?.agents ?? [];
    agentOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        label: `${agent.hostname || agent.agent_id} (${agent.agent_id})`,
        value: agent.agent_id,
      }));
  } catch {
    agentOptions.value = [];
  }
}

async function loadGlobals() {
  try {
    const { data } = await axios.get("/security/peripheral/globals/");
    globals.value = { ...globals.value, ...(data || {}) };
  } catch {
    /* keep defaults */
  }
}

async function saveGlobals() {
  try {
    const { data } = await axios.put("/security/peripheral/globals/", globals.value);
    globals.value = { ...globals.value, ...(data || {}) };
    $q.notify({ message: "Peripheral settings saved", color: "positive", icon: "check" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.detail || "Failed to save settings", color: "negative" });
    await loadGlobals();
  }
}

async function load() {
  await Promise.all([loadAgents(), loadGlobals()]);
  try { requests.value = (await axios.get("/security/peripheral-requests/")).data || []; } catch {}
  try { schedules.value = (await axios.get("/security/peripheral-schedules/")).data || []; } catch {}
}

async function sendAction() {
  if (!actionForm.value.agent_id) return;
  sendingAction.value = true;
  try {
    await axios.post("/security/peripheral/actions/", actionForm.value);
    $q.notify({ message: "Command sent", color: "positive", icon: "send" });
  } finally {
    sendingAction.value = false;
  }
}

async function approve(id: number) {
  await axios.patch(`/security/peripheral-requests/${id}/`, { status: "approved" });
  $q.notify({ message: "Request approved", color: "positive", icon: "check" });
  await load();
}

async function deny(id: number) {
  await axios.patch(`/security/peripheral-requests/${id}/`, { status: "denied" });
  $q.notify({ message: "Request denied", color: "negative", icon: "close" });
  await load();
}

function showScheduleDialog() {
  schedForm.value = defaultScheduleForm();
  scheduleDialogOpen.value = true;
}

async function createSchedule() {
  savingSched.value = true;
  try {
    const payload = { ...schedForm.value };
    if (payload.scope !== "device") payload.target_agent_id = "";
    await axios.post("/security/peripheral-schedules/", payload);
    scheduleDialogOpen.value = false;
    $q.notify({ message: "Schedule created", color: "positive", icon: "check" });
    await load();
  } finally { savingSched.value = false; }
}

async function deleteSchedule(id: number) {
  await axios.delete(`/security/peripheral-schedules/${id}/`);
  await load();
}

onMounted(load);
</script>
