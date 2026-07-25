<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">Camera, Microphone, and USB Control</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-list bordered separator>
          <q-item-label header>Global enforcement</q-item-label>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="bluetooth_disabled" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Disable Bluetooth globally</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.bluetooth_global_disabled" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
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
            <q-item-section avatar><q-icon name="support_agent" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label>Allow camera during remote support</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.camera_remote_allow" @update:model-value="saveGlobals" />
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
            <q-item-section avatar><q-icon name="record_voice_over" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label>Allow microphone during remote support</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.mic_remote_allow" @update:model-value="saveGlobals" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section avatar><q-icon name="usb_off" color="negative" /></q-item-section>
            <q-item-section>
              <q-item-label>Disable USB storage globally</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="globals.usb_global_disabled" @update:model-value="saveGlobals" />
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

    <q-list bordered class="q-mb-md">
      <q-item-label header>Effective policy diagnostics</q-item-label>
      <q-item>
        <q-item-section>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-md-5">
              <q-select
                v-model="diagnosticsAgentId"
                :options="agentOptions"
                label="Target device"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="loadDiagnostics"
              />
            </div>
            <div class="col-auto">
              <q-btn
                outline
                color="primary"
                icon="rule"
                label="Apply now"
                :loading="applyingNow"
                :disable="!diagnosticsAgentId"
                @click="applyPeripheralNow"
              />
            </div>
            <div class="col-auto">
              <q-btn
                flat
                round
                color="primary"
                icon="refresh"
                :loading="loadingDiagnostics"
                :disable="!diagnosticsAgentId"
                @click="loadDiagnostics"
              />
            </div>
            <div class="col text-caption text-grey-7">
              Shows overlapping policies before a demo so you can cancel the one that would mask the test.
            </div>
          </div>

          <div v-if="diagnostics" class="row q-col-gutter-sm q-mt-sm">
            <div v-for="item in diagnosticsDeviceEntries" :key="item.type" class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center q-gutter-xs">
                    <q-icon :name="scheduleIcon(item.type)" />
                    <div class="text-weight-medium">{{ displayPeripheral(item.type) }}</div>
                    <q-space />
                    <q-chip dense :color="stateColor(item.data.state)" text-color="white">
                      {{ item.data.state }}
                    </q-chip>
                  </div>
                  <q-list dense>
                    <q-item v-for="src in item.data.sources" :key="`${src.type}-${src.id || src.label}`">
                      <q-item-section>
                        <q-item-label>{{ src.label }}</q-item-label>
                        <q-item-label caption>
                          {{ src.type }}<span v-if="src.window"> · {{ src.window }}</span><span v-if="src.detail"> · {{ src.detail }}</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="item.data.sources.length === 0">
                      <q-item-section class="text-grey">No active restrictions</q-item-section>
                    </q-item>
                  </q-list>
                  <q-banner v-for="msg in item.data.conflicts" :key="msg" dense rounded class="bg-amber-1 text-brown-9 q-mt-xs">
                    {{ msg }}
                  </q-banner>
                  <div v-for="msg in item.data.recommended_actions" :key="msg" class="text-caption text-primary q-mt-xs">
                    {{ msg }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

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
                {{ formatScheduleWindow(s) }} · {{ timeBasisLabel(s.time_basis) }}
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
          <q-select
            v-if="schedForm.scope === 'device_group'"
            v-model="schedForm.target_device_group_id"
            :options="siteOptions"
            label="Target device group"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="schedForm.scope === 'user'"
            v-model="schedForm.target_user_id"
            :options="userOptions"
            label="Target user"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="schedForm.scope === 'user_group'"
            v-model="schedForm.target_user_group_id"
            :options="userGroupOptions"
            label="Target user group"
            outlined
            dense
            emit-value
            map-options
          />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="schedForm.start_time"
                label="Start"
                outlined
                dense
                type="time"
                step="60"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="schedForm.end_time"
                label="End"
                outlined
                dense
                type="time"
                step="60"
              />
            </div>
          </div>
          <div class="row q-gutter-xs">
            <q-btn flat dense color="primary" icon="timer" label="Next 5 min" @click="setDemoWindow(5)" />
            <q-btn flat dense color="primary" icon="timer" label="Next 15 min" @click="setDemoWindow(15)" />
          </div>
          <q-option-group
            v-model="schedForm.time_basis"
            :options="timeBasisOptions"
            type="radio"
            dense
          />
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

    <div class="row items-center q-mt-lg q-mb-sm">
      <div class="text-subtitle2">Application privacy policies</div>
      <q-space />
      <q-btn flat dense color="primary" icon="add" label="New policy" @click="showPrivacyDialog()" />
    </div>
    <q-table
      :rows="appPrivacyPolicies"
      :columns="privacyColumns"
      dense
      row-key="id"
      :rows-per-page-options="[5, 10, 25]"
    >
      <template v-slot:body-cell-defaults="props">
        <q-td :props="props">
          <q-chip dense color="blue-grey" text-color="white" size="sm">Mic: {{ props.row.global_mic_default }}</q-chip>
          <q-chip dense color="blue-grey" text-color="white" size="sm">Camera: {{ props.row.global_cam_default }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-scope="props">
        <q-td :props="props">{{ displayScope(props.row) }}</q-td>
      </template>
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
            {{ props.value ? "Active" : "Disabled" }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" @click="showPrivacyDialog(props.row)" />
          <q-btn flat dense round icon="delete" color="negative" @click="deletePrivacyPolicy(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="privacyDialogOpen" persistent>
      <q-card style="min-width: 720px">
        <q-bar>
          {{ editingPrivacy ? "Edit" : "New" }} application privacy policy
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="privacyForm.name" label="Name" outlined dense />
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="privacyForm.global_mic_default"
                :options="privacyDefaultOptions"
                label="Default microphone access"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="privacyForm.global_cam_default"
                :options="privacyDefaultOptions"
                label="Default camera access"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
          </div>
          <q-select
            v-model="privacyForm.scope"
            :options="scopeOptions"
            label="Scope"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="privacyForm.scope === 'device'"
            v-model="privacyForm.target_agent_id"
            :options="agentOptions"
            label="Target device"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="privacyForm.scope === 'device_group'"
            v-model="privacyForm.target_device_group_id"
            :options="siteOptions"
            label="Target device group"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="privacyForm.scope === 'user'"
            v-model="privacyForm.target_user_id"
            :options="userOptions"
            label="Target user"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-if="privacyForm.scope === 'user_group'"
            v-model="privacyForm.target_user_group_id"
            :options="userGroupOptions"
            label="Target user group"
            outlined
            dense
            emit-value
            map-options
          />
          <q-input
            v-model="privacyAppPoliciesText"
            label="Per-app rules JSON"
            outlined
            dense
            type="textarea"
            rows="8"
          />
          <q-toggle v-model="privacyForm.enabled" label="Enabled" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="editingPrivacy ? 'Save' : 'Create'" @click="savePrivacyPolicy" :loading="savingPrivacy" />
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
const appPrivacyPolicies = ref<any[]>([]);
const agentOptions = ref<{ label: string; value: string }[]>([]);
const siteOptions = ref<{ label: string; value: number }[]>([]);
const userOptions = ref<{ label: string; value: number }[]>([]);
const userGroupOptions = ref<{ label: string; value: number }[]>([]);
const scheduleDialogOpen = ref(false);
const privacyDialogOpen = ref(false);
const editingPrivacy = ref<any>(null);
const savingSched = ref(false);
const savingPrivacy = ref(false);
const sendingAction = ref(false);
const diagnosticsAgentId = ref("");
const diagnostics = ref<any>(null);
const loadingDiagnostics = ref(false);
const applyingNow = ref(false);
const privacyAppPoliciesText = ref("[]");

const globals = ref<any>({
  bluetooth_global_disabled: false,
  camera_global_disabled: false,
  camera_block_on_non_compliance: false,
  camera_remote_allow: true,
  mic_global_disabled: false,
  mic_block_on_non_compliance: false,
  mic_remote_allow: true,
  usb_global_disabled: false,
  usb_block_on_non_compliance: false,
  usb_block_on_threat: false,
});
const actionForm = ref<any>({
  agent_id: "",
  device_type: "camera",
  enabled: false,
  reason: "",
});
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
  { label: "Device group", value: "device_group" },
  { label: "User", value: "user" },
  { label: "User group", value: "user_group" },
];
const timeBasisOptions = [
  {
    label: "Device local time (recommended for users and demos)",
    value: "device_local",
  },
  {
    label: "Server time (UTC, for centralized audit windows)",
    value: "server_utc",
  },
];
const privacyDefaultOptions = [
  { label: "User controlled", value: "user_controlled" },
  { label: "Force allow", value: "allow" },
  { label: "Force deny", value: "deny" },
];
const schedForm = ref<any>(defaultScheduleForm());
const privacyForm = ref<any>(defaultPrivacyForm());

const pendingRequests = computed(() => requests.value.filter((r) => r.status === "pending"));
const pendingCount = computed(() => pendingRequests.value.length);
const diagnosticsDeviceEntries = computed(() => {
  const devices = diagnostics.value?.devices || {};
  return ["camera", "mic", "usb"].map((type) => ({
    type,
    data: {
      state: devices[type]?.state || "unknown",
      sources: devices[type]?.sources || [],
      conflicts: devices[type]?.conflicts || [],
      recommended_actions: devices[type]?.recommended_actions || [],
    },
  }));
});

function defaultScheduleForm() {
  return {
    name: "",
    device_type: "camera",
    disabled_days: [],
    disabled_hours_start: 9,
    disabled_hours_end: 18,
    disabled_minutes_start: 9 * 60,
    disabled_minutes_end: 18 * 60,
    start_time: "09:00",
    end_time: "18:00",
    time_basis: "device_local",
    scope: "global",
    target_agent_id: "",
    target_device_group_id: null,
    target_user_id: null,
    target_user_group_id: null,
    enabled: true,
  };
}

function defaultPrivacyForm() {
  return {
    name: "",
    enabled: true,
    global_mic_default: "user_controlled",
    global_cam_default: "user_controlled",
    app_policies: [],
    scope: "global",
    target_agent_id: "",
    target_device_group_id: null,
    target_user_id: null,
    target_user_group_id: null,
  };
}

const privacyColumns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "defaults", label: "Defaults", field: "defaults", align: "left" as const },
  { name: "scope", label: "Scope", field: "scope", align: "left" as const },
  {
    name: "rules",
    label: "App rules",
    field: (row: any) => (Array.isArray(row.app_policies) ? row.app_policies.length : 0),
    align: "center" as const,
  },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

function scheduleIcon(t: string) {
  return { camera: "videocam", mic: "mic", usb: "usb" }[t] ?? "device_unknown";
}

function displayPeripheral(t: string) {
  return { camera: "Camera", mic: "Microphone", usb: "USB storage" }[t] ?? t;
}

function displayAgent(agentId: string) {
  return agentOptions.value.find((a) => a.value === agentId)?.label || agentId;
}

function optionLabel(options: { label: string; value: any }[], value: any, fallback: string) {
  return options.find((option) => String(option.value) === String(value))?.label || fallback;
}

function displayScope(row: any) {
  if (row.scope === "device") return displayAgent(row.target_agent_id);
  if (row.scope === "device_group") return optionLabel(siteOptions.value, row.target_device_group_id, `Device group #${row.target_device_group_id || "-"}`);
  if (row.scope === "user") return optionLabel(userOptions.value, row.target_user_id, `User #${row.target_user_id || "-"}`);
  if (row.scope === "user_group") return optionLabel(userGroupOptions.value, row.target_user_group_id, `User group #${row.target_user_group_id || "-"}`);
  return "All devices";
}

function displayDays(days: number[] | null | undefined) {
  if (!Array.isArray(days) || days.length === 0) return "Every day";
  return dayOptions.filter((d) => days.includes(d.value)).map((d) => d.label).join(", ");
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function minutesToTime(value: number | string | null | undefined) {
  const minutes = Number(value || 0);
  const safe = Math.max(0, Math.min(1439, Number.isFinite(minutes) ? minutes : 0));
  return `${pad2(Math.floor(safe / 60))}:${pad2(safe % 60)}`;
}

function timeToMinutes(value: string | null | undefined) {
  const [hRaw, mRaw] = String(value || "00:00").split(":");
  const hours = Math.max(0, Math.min(23, Number(hRaw) || 0));
  const minutes = Math.max(0, Math.min(59, Number(mRaw) || 0));
  return hours * 60 + minutes;
}

function formatScheduleWindow(row: any) {
  const start = row.disabled_minutes_start ?? (Number(row.disabled_hours_start || 0) * 60);
  const end = row.disabled_minutes_end ?? (Number(row.disabled_hours_end || 0) * 60);
  return `${minutesToTime(start)}-${minutesToTime(end)}`;
}

function timeBasisLabel(value: string) {
  return value === "server_utc" ? "server UTC" : "device local";
}

function stateColor(value: string) {
  if (value === "restricted") return "negative";
  if (value === "allowed_temporarily") return "warning";
  if (value === "allowed") return "positive";
  return "grey";
}

function setDemoWindow(minutes: number) {
  const now = new Date();
  const start = now.getHours() * 60 + now.getMinutes();
  const end = (start + minutes) % (24 * 60);
  schedForm.value.start_time = minutesToTime(start);
  schedForm.value.end_time = minutesToTime(end);
}

async function loadOptions() {
  try {
    const [agentsResp, sitesResp, usersResp, groupsResp] = await Promise.allSettled([
      axios.get("/agents/", { params: { detail: "false" } }),
      axios.get("/clients/sites/?leaf=true"),
      axios.get("/accounts/users/"),
      axios.get("/accounts/user-groups/"),
    ]);
    const agents = agentsResp.status === "fulfilled" ? agentsResp.value.data : [];
    const list = Array.isArray(agents) ? agents : agents?.agents ?? agents?.results ?? [];
    agentOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        label: `${agent.hostname || agent.agent_id} (${agent.agent_id})`,
        value: agent.agent_id,
      }));
    if (!diagnosticsAgentId.value && agentOptions.value.length > 0) {
      diagnosticsAgentId.value = agentOptions.value[0].value;
    }
    const sites = sitesResp.status === "fulfilled" ? sitesResp.value.data : [];
    const siteList = Array.isArray(sites) ? sites : sites?.results ?? [];
    siteOptions.value = siteList
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
        value: site.id,
      }));
    const users = usersResp.status === "fulfilled" ? usersResp.value.data : [];
    const userList = Array.isArray(users) ? users : users?.results ?? [];
    userOptions.value = userList
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        label: user.display_name || user.full_name || user.username || user.sam_account_name || user.email || `User #${user.id}`,
        value: user.id,
      }));
    const groups = groupsResp.status === "fulfilled" ? groupsResp.value.data : [];
    const groupList = Array.isArray(groups) ? groups : groups?.results ?? [];
    userGroupOptions.value = groupList
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        label: group.display_name || group.name || group.sam_account_name || `User group #${group.id}`,
        value: group.id,
      }));
  } catch {
    agentOptions.value = [];
    siteOptions.value = [];
    userOptions.value = [];
    userGroupOptions.value = [];
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
  await Promise.all([loadOptions(), loadGlobals()]);
  try { requests.value = (await axios.get("/security/peripheral-requests/")).data || []; } catch {}
  try { schedules.value = (await axios.get("/security/peripheral-schedules/")).data || []; } catch {}
  try { appPrivacyPolicies.value = (await axios.get("/appmanagement/app-privacy-policies/")).data || []; } catch {}
  if (diagnosticsAgentId.value) await loadDiagnostics();
}

async function loadDiagnostics() {
  if (!diagnosticsAgentId.value) return;
  loadingDiagnostics.value = true;
  try {
    const { data } = await axios.get(`/security/peripheral/effective/${diagnosticsAgentId.value}/`);
    diagnostics.value = data;
  } finally {
    loadingDiagnostics.value = false;
  }
}

async function applyPeripheralNow() {
  if (!diagnosticsAgentId.value) return;
  applyingNow.value = true;
  try {
    await axios.post("/security/peripheral/apply-now/", {
      agent_id: diagnosticsAgentId.value,
      wait: true,
      timeout: 45,
    });
    $q.notify({ message: "Agent re-evaluated peripheral policies", color: "positive", icon: "rule" });
    await loadDiagnostics();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.detail || "Failed to apply peripheral policies", color: "negative" });
  } finally {
    applyingNow.value = false;
  }
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

function normalizeScopedPayload(form: any) {
  const payload = { ...form };
  if ("start_time" in payload || "end_time" in payload) {
    const start = timeToMinutes(payload.start_time || minutesToTime(payload.disabled_minutes_start));
    const end = timeToMinutes(payload.end_time || minutesToTime(payload.disabled_minutes_end));
    payload.disabled_minutes_start = start;
    payload.disabled_minutes_end = end;
    payload.disabled_hours_start = Math.floor(start / 60);
    payload.disabled_hours_end = Math.floor(end / 60);
    delete payload.start_time;
    delete payload.end_time;
  }
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  if (payload.scope !== "user") payload.target_user_id = null;
  if (payload.scope !== "user_group") payload.target_user_group_id = null;
  for (const key of ["target_device_group_id", "target_user_id", "target_user_group_id"]) {
    if (payload[key] === "" || payload[key] === undefined) payload[key] = null;
  }
  return payload;
}

function validateScopedTarget(form: any) {
  if (form.scope === "device" && !form.target_agent_id) return "Select a target device";
  if (form.scope === "device_group" && !form.target_device_group_id) return "Select a target device group";
  if (form.scope === "user" && !form.target_user_id) return "Select a target user";
  if (form.scope === "user_group" && !form.target_user_group_id) return "Select a target user group";
  return "";
}

async function createSchedule() {
  const error = validateScopedTarget(schedForm.value);
  if (error) {
    $q.notify({ message: error, color: "warning" });
    return;
  }
  savingSched.value = true;
  try {
    const payload = normalizeScopedPayload(schedForm.value);
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

function showPrivacyDialog(row?: any) {
  editingPrivacy.value = row || null;
  privacyForm.value = row ? { ...defaultPrivacyForm(), ...row } : defaultPrivacyForm();
  privacyAppPoliciesText.value = JSON.stringify(privacyForm.value.app_policies || [], null, 2);
  privacyDialogOpen.value = true;
}

async function savePrivacyPolicy() {
  const error = validateScopedTarget(privacyForm.value);
  if (error) {
    $q.notify({ message: error, color: "warning" });
    return;
  }
  let appPolicies: any[] = [];
  try {
    const parsed = JSON.parse(privacyAppPoliciesText.value || "[]");
    appPolicies = Array.isArray(parsed) ? parsed : [];
  } catch {
    $q.notify({ message: "Per-app rules must be valid JSON array", color: "warning" });
    return;
  }
  savingPrivacy.value = true;
  try {
    const payload = normalizeScopedPayload({ ...privacyForm.value, app_policies: appPolicies });
    if (editingPrivacy.value?.id) {
      await axios.put(`/appmanagement/app-privacy-policies/${editingPrivacy.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/app-privacy-policies/", payload);
    }
    privacyDialogOpen.value = false;
    $q.notify({ message: "Application privacy policy saved", color: "positive", icon: "check" });
    await load();
  } finally {
    savingPrivacy.value = false;
  }
}

function deletePrivacyPolicy(id: number) {
  $q.dialog({ title: "Delete application privacy policy?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/appmanagement/app-privacy-policies/${id}/`);
    await load();
  });
}

onMounted(load);
</script>
