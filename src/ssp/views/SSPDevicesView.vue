<template>
  <q-page class="ssp-content-page">
    <div class="ssp-content-header">
      <div>
        <div class="ssp-content-title">My Enrolled Devices</div>
        <div class="ssp-content-sub">
          Register, manage and remove your organization devices.
        </div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Enroll new device"
        @click="showEnrollDialog"
        class="ssp-action-btn"
        unelevated
      />
    </div>

    <q-card flat bordered class="ssp-byod-card q-mb-lg">
      <q-card-section>
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">BYOD onboarding status</div>
            <div class="text-caption text-grey-7">
              Privacy acceptance, container-ready enrollment, app catalog
              access, compliance, and selective wipe are tracked here.
            </div>
          </div>
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-sm">
              <div
                v-for="step in byodSteps"
                :key="step.id"
                class="col-12 col-sm-6 col-lg-3"
              >
                <div class="ssp-byod-step">
                  <q-icon
                    :name="step.icon"
                    :color="step.done ? 'positive' : 'grey'"
                    size="22px"
                  />
                  <div>
                    <div class="text-weight-medium">{{ step.title }}</div>
                    <div class="text-caption text-grey-7">
                      {{ step.caption }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-gutter-sm q-mt-md">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Register BYOD device"
            @click="showEnrollDialog"
          />
          <q-btn
            flat
            color="primary"
            icon="apps"
            label="Open app catalog"
            @click="router.push('/ssp/apps')"
          />
          <q-btn
            flat
            color="primary"
            icon="verified_user"
            label="Review rights"
            @click="router.push('/ssp/rights')"
          />
        </div>
      </q-card-section>
    </q-card>

    <div v-if="loading" class="ssp-empty-state">
      <q-spinner size="40px" color="primary" />
      <div class="q-mt-md text-grey">Loading your devices...</div>
    </div>

    <div v-else-if="devices.length === 0" class="ssp-empty-card">
      <div class="ssp-empty-icon">
        <q-icon name="devices" size="48px" color="blue-3" />
      </div>
      <div class="ssp-empty-title">No enrolled devices yet</div>
      <div class="ssp-empty-sub">
        Add a device, download the one-file installer and run it as
        administrator.
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Enroll new device"
        @click="showEnrollDialog"
        unelevated
        class="q-mt-lg ssp-action-btn"
      />
    </div>

    <div v-else class="ssp-device-grid">
      <div v-for="device in devices" :key="device.id" class="ssp-device-card">
        <div class="ssp-device-card-header">
          <div class="ssp-device-icon-wrap">
            <q-icon
              :name="deviceIcon(device.device_type)"
              size="24px"
              color="white"
            />
          </div>
          <div class="col">
            <div class="ssp-device-name">{{ device.device_name }}</div>
            <div class="ssp-device-os">
              {{ device.os_info || "Unknown OS" }}
            </div>
          </div>
          <div
            :class="[
              'ssp-status-dot',
              device.managed
                ? 'ssp-status-dot--active'
                : 'ssp-status-dot--pending',
            ]"
          >
            <span>{{ device.managed ? "Managed" : "Pending installer" }}</span>
          </div>
        </div>

        <div class="ssp-device-meta">
          <div class="ssp-meta-row">
            <q-icon name="category" size="14px" class="ssp-meta-icon" />
            <span>{{ device.device_type || "PC / Workstation" }}</span>
          </div>
          <div class="ssp-meta-row" v-if="device.enrolled_at">
            <q-icon name="event" size="14px" class="ssp-meta-icon" />
            <span>Enrolled {{ formatDate(device.enrolled_at) }}</span>
          </div>
          <div class="ssp-meta-row" v-if="device.last_seen">
            <q-icon name="schedule" size="14px" class="ssp-meta-icon" />
            <span>Last seen {{ formatDate(device.last_seen) }}</span>
          </div>
          <div class="ssp-meta-row" v-if="device.serial_number">
            <q-icon name="qr_code" size="14px" class="ssp-meta-icon" />
            <span>S/N: {{ device.serial_number }}</span>
          </div>
          <div class="ssp-meta-row" v-if="device.site_name">
            <q-icon name="business" size="14px" class="ssp-meta-icon" />
            <span>Site: {{ device.site_name }}</span>
          </div>
          <div class="ssp-meta-row" v-if="device.agent_id">
            <q-icon name="verified" size="14px" class="ssp-meta-icon" />
            <span class="ellipsis">Agent: {{ device.agent_id }}</span>
          </div>
        </div>

        <div class="ssp-device-actions">
          <q-btn
            v-if="device.can_download_installer || !device.managed"
            flat
            dense
            size="sm"
            color="primary"
            icon="download"
            label="Installer"
            :loading="downloadingDeviceId === device.id"
            @click="openInstallerDialog(device)"
          />
          <q-btn
            flat
            dense
            size="sm"
            color="primary"
            icon="edit"
            label="Edit"
            @click="openEditDialog(device)"
          />
          <q-btn
            v-if="!device.managed"
            flat
            dense
            size="sm"
            color="secondary"
            icon="link"
            label="Link"
            @click="openClaimDialog(device)"
          />
          <q-btn
            v-if="device.managed"
            flat
            dense
            size="sm"
            color="secondary"
            icon="admin_panel_settings"
            label="Actions"
            @click="openActionsDialog(device)"
          />
          <q-btn
            flat
            dense
            size="sm"
            color="warning"
            icon="report_problem"
            label="Lost"
            @click="reportLost(device)"
          />
          <q-btn
            flat
            dense
            size="sm"
            color="negative"
            icon="remove_circle"
            label="Unenroll"
            @click="unenrollDevice(device)"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="enrollDialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar class="bg-primary text-white">
          <q-icon name="add_circle" class="q-mr-sm" />
          Enroll new device
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="enrollForm.device_name"
            label="Device name *"
            outlined
            dense
            placeholder="e.g. My Work Laptop"
          />
          <q-select
            v-model="enrollForm.device_type"
            :options="['Laptop', 'Desktop', 'Workstation', 'Tablet', 'Other']"
            label="Device type"
            outlined
            dense
          />
          <q-input
            v-model="enrollForm.os_info"
            label="Operating system"
            outlined
            dense
            placeholder="Windows 11"
          />
          <q-input
            v-model="enrollForm.serial_number"
            label="Serial number (optional)"
            outlined
            dense
          />
          <q-banner class="bg-blue-1 text-blue-10 rounded-borders">
            {{
              settings.privacy_terms ||
              "I accept the organization privacy and device management terms."
            }}
          </q-banner>
          <q-checkbox
            v-model="enrollForm.privacy_accepted"
            label="I accept the organization privacy and device management terms"
            color="primary"
          />
          <q-separator />
          <div>
            <div class="text-subtitle2 q-mb-sm">Windows installer bundle</div>
            <q-option-group
              v-model="enrollInstallerForm.goarch"
              :options="installerArchOptions"
              type="radio"
              inline
              dense
            />
            <q-checkbox
              v-model="enrollInstallerForm.install_mdm"
              label="Install Windows Policy Extension (MDM Agent)"
              color="primary"
              dense
              class="q-mt-sm"
            />
            <q-input
              v-if="enrollInstallerForm.install_mdm"
              v-model="enrollInstallerForm.mdm_master_url"
              label="Master URL"
              placeholder="Leave empty to use API URL"
              outlined
              dense
              class="q-mt-sm"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Enroll device"
            @click="enrollDevice"
            :loading="enrolling"
            :disable="!canEnroll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="installerDialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar class="bg-primary text-white">
          <q-icon name="download" class="q-mr-sm" />
          Download device installer
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-body2 text-grey-7">
            The bundle installs the Tactical/RMM agent first, then the Windows
            Policy Extension.
          </div>
          <div>
            <div class="text-subtitle2 q-mb-sm">Architecture</div>
            <q-option-group
              v-model="installerForm.goarch"
              :options="installerArchOptions"
              type="radio"
              inline
              dense
            />
          </div>
          <q-checkbox
            v-model="installerForm.install_mdm"
            label="Install Windows Policy Extension (MDM Agent)"
            color="primary"
            dense
          />
          <q-input
            v-if="installerForm.install_mdm"
            v-model="installerForm.mdm_master_url"
            label="Master URL"
            placeholder="Leave empty to use API URL"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            icon="download"
            label="Download installer"
            :loading="downloadingDeviceId === installerDevice?.id"
            @click="submitInstallerDownload"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar>
          Edit device
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="editForm.device_name"
            label="Device name"
            outlined
            dense
          />
          <q-select
            v-model="editForm.device_type"
            :options="['Laptop', 'Desktop', 'Workstation', 'Tablet', 'Other']"
            label="Device type"
            outlined
            dense
          />
          <q-input
            v-model="editForm.os_info"
            label="Operating system"
            outlined
            dense
          />
          <q-input
            v-model="editForm.serial_number"
            label="Serial number"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save"
            :loading="savingDevice"
            @click="saveDevice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="claimDialogOpen">
      <q-card style="min-width: 420px">
        <q-bar class="bg-primary text-white">
          <q-icon name="link" class="q-mr-sm" />
          Link managed agent
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-body2 text-grey-7">
            Use this if the agent is already visible in the admin console but
            was not linked automatically.
          </div>
          <q-input
            v-model="claimForm.agent_id"
            label="Agent ID"
            outlined
            dense
          />
          <q-input
            v-model="claimForm.hostname"
            label="Hostname"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Link"
            :loading="claiming"
            @click="claimDevice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="actionsDialogOpen" maximized>
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-icon name="admin_panel_settings" class="q-mr-sm" />
          Device self-service actions
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="selectedDevice">
          <div class="row items-start q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">
                    {{ selectedDevice.device_name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ selectedDevice.agent_id }}
                  </div>
                  <div class="q-mt-md q-gutter-sm">
                    <q-btn
                      color="warning"
                      icon="lock"
                      label="Lock device"
                      class="full-width"
                      :loading="actionSubmitting === 'lock'"
                      @click="runDeviceAction('lock')"
                    />
                    <q-btn
                      color="primary"
                      icon="password"
                      label="Reset device password"
                      class="full-width"
                      :loading="actionSubmitting === 'reset_password'"
                      @click="openPasswordAction"
                    />
                    <q-btn
                      color="negative"
                      icon="delete_sweep"
                      label="Clear organization data"
                      class="full-width"
                      :loading="actionSubmitting === 'clear_org_data'"
                      @click="runDeviceAction('clear_org_data')"
                    />
                    <q-btn
                      color="negative"
                      outline
                      icon="delete_forever"
                      label="Full wipe"
                      class="full-width"
                      :disable="!settings.allow_full_wipe"
                      :loading="actionSubmitting === 'wipe_full'"
                      @click="runDeviceAction('wipe_full')"
                    />
                    <q-btn
                      color="grey-8"
                      outline
                      icon="app_blocking"
                      label="Uninstall agent"
                      class="full-width"
                      :loading="actionSubmitting === 'uninstall_agent'"
                      @click="runDeviceAction('uninstall_agent')"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-8">
              <q-table
                :rows="deviceActions"
                :columns="actionColumns"
                row-key="id"
                dense
                flat
                bordered
                :loading="loadingActions"
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                      dense
                      :color="actionStatusColor(props.row.status)"
                      text-color="white"
                      >{{ props.row.status }}</q-chip
                    >
                  </q-td>
                </template>
                <template v-slot:body-cell-result="props">
                  <q-td :props="props">
                    <div class="text-caption ellipsis" style="max-width: 360px">
                      {{ stringify(props.row.result) }}
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="passwordDialogOpen" persistent>
      <q-card style="min-width: 420px">
        <q-bar>
          Reset device password
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="passwordAction.username"
            label="Windows username (optional)"
            outlined
            dense
          />
          <q-input
            v-model="passwordAction.password"
            label="New password"
            type="password"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Send"
            :disable="!passwordAction.password"
            :loading="actionSubmitting === 'reset_password'"
            @click="runPasswordAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";
import { useRouter } from "vue-router";
import axios from "axios";

const $q = useQuasar();
const router = useRouter();

const devices = ref<any[]>([]);
const settings = ref<any>({});
const loading = ref(false);
const enrollDialogOpen = ref(false);
const enrolling = ref(false);
const downloadingDeviceId = ref<number | null>(null);
const claimDialogOpen = ref(false);
const claiming = ref(false);
const selectedClaimDevice = ref<any | null>(null);
const claimForm = ref({ agent_id: "", hostname: "" });
const editDialogOpen = ref(false);
const savingDevice = ref(false);
const editingDevice = ref<any | null>(null);
const editForm = ref({
  device_name: "",
  device_type: "Laptop",
  os_info: "",
  serial_number: "",
});
const actionsDialogOpen = ref(false);
const selectedDevice = ref<any | null>(null);
const deviceActions = ref<any[]>([]);
const loadingActions = ref(false);
const actionSubmitting = ref("");
const passwordDialogOpen = ref(false);
const passwordAction = ref({ username: "", password: "" });

const enrollForm = ref({
  device_name: "",
  device_type: "Laptop",
  os_info: "",
  serial_number: "",
  privacy_accepted: false,
});
const defaultInstallerForm = () => ({
  goarch: "amd64",
  install_mdm: true,
  mdm_master_url: "",
});
const enrollInstallerForm = ref(defaultInstallerForm());
const installerDialogOpen = ref(false);
const installerDevice = ref<any | null>(null);
const installerForm = ref(defaultInstallerForm());

const installerArchOptions = [
  { label: "x64", value: "amd64" },
  { label: "ARM64", value: "arm64" },
];

const actionColumns = [
  {
    name: "action_type",
    label: "Action",
    field: "action_type",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
    sortable: true,
  },
  { name: "reason", label: "Reason", field: "reason", align: "left" },
  {
    name: "requested_at",
    label: "Requested",
    field: "requested_at",
    align: "left",
    sortable: true,
  },
  { name: "result", label: "Result", field: "result", align: "left" },
];

const canEnroll = computed(() => {
  if (!enrollForm.value.device_name) return false;
  if (settings.value.require_privacy_acceptance === false) return true;
  return !!enrollForm.value.privacy_accepted;
});
const acceptedPrivacyCount = computed(
  () =>
    devices.value.filter((d) => d.privacy_accepted_at || d.privacy_accepted)
      .length,
);
const byodSteps = computed(() => [
  {
    id: "privacy",
    title: "Privacy accepted",
    caption: acceptedPrivacyCount.value
      ? `${acceptedPrivacyCount.value} device(s)`
      : "Required before enrollment",
    icon: "privacy_tip",
    done:
      acceptedPrivacyCount.value > 0 ||
      settings.value.require_privacy_acceptance === false,
  },
  {
    id: "agent",
    title: "Agent linked",
    caption: managedDeviceCountLabel.value,
    icon: "verified",
    done: devices.value.some((d) => d.managed || d.agent_id),
  },
  {
    id: "apps",
    title: "Apps available",
    caption: "Catalog and install requests",
    icon: "apps",
    done: devices.value.length > 0,
  },
  {
    id: "wipe",
    title: "Selective wipe",
    caption: "Organization data only",
    icon: "delete_sweep",
    done: devices.value.some((d) => d.managed || d.agent_id),
  },
]);
const managedDeviceCountLabel = computed(() => {
  const managed = devices.value.filter((d) => d.managed || d.agent_id).length;
  return managed
    ? `${managed} managed device(s)`
    : "Run installer to link agent";
});

function deviceIcon(type?: string): string {
  const t = (type || "").toLowerCase();
  if (t.includes("laptop")) return "laptop";
  if (t.includes("server")) return "dns";
  if (t.includes("phone") || t.includes("mobile")) return "smartphone";
  if (t.includes("tablet")) return "tablet_mac";
  return "computer";
}

function formatDate(d?: string) {
  if (!d) return "";
  return date.formatDate(d, "DD MMM YYYY HH:mm");
}

function stringify(value: any) {
  if (!value) return "";
  try {
    return typeof value === "string" ? value : JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function actionStatusColor(status: string) {
  return (
    {
      queued: "grey",
      sent: "info",
      succeeded: "positive",
      failed: "negative",
      cancelled: "grey",
    }[status] || "grey"
  );
}

async function loadSettings() {
  try {
    settings.value =
      (await axios.get("/appmanagement/ssp/settings/")).data || {};
  } catch {
    settings.value = {};
  }
}

async function loadDevices() {
  loading.value = true;
  try {
    devices.value = (await axios.get("/appmanagement/ssp/devices/")).data;
  } catch {
    devices.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadDeviceActions(deviceId?: number) {
  if (!deviceId) return;
  loadingActions.value = true;
  try {
    deviceActions.value =
      (await axios.get(`/appmanagement/ssp/devices/${deviceId}/actions/`))
        .data || [];
  } catch {
    deviceActions.value = [];
  } finally {
    loadingActions.value = false;
  }
}

function showEnrollDialog() {
  enrollForm.value = {
    device_name: "",
    device_type: "Laptop",
    os_info: "",
    serial_number: "",
    privacy_accepted: false,
  };
  enrollInstallerForm.value = defaultInstallerForm();
  enrollDialogOpen.value = true;
}

function saveBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

async function blobErrorMessage(blob: Blob) {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return parsed?.error || parsed?.detail || text;
  } catch {
    return "Installer generation failed";
  }
}

function installerPayload(form: ReturnType<typeof defaultInstallerForm>) {
  return {
    install_cyber_secure: true,
    goarch: form.goarch,
    install_mdm: form.install_mdm,
    mdm_arch: form.goarch === "arm64" ? "arm64" : "x64",
    mdm_master_url: form.mdm_master_url,
  };
}

function openInstallerDialog(device: any) {
  installerDevice.value = device;
  installerForm.value = defaultInstallerForm();
  installerDialogOpen.value = true;
}

async function submitInstallerDownload() {
  if (!installerDevice.value) return;
  await downloadInstaller(
    installerDevice.value,
    installerPayload(installerForm.value),
  );
  installerDialogOpen.value = false;
}

async function downloadInstaller(device: any, payload = installerPayload(defaultInstallerForm())) {
  downloadingDeviceId.value = device.id;
  try {
    const resp = await axios.post(
      `/appmanagement/ssp/devices/${device.id}/installer/`,
      payload,
      { responseType: "blob" },
    );
    const disposition = String(resp.headers?.["content-disposition"] || "");
    const match = disposition.match(/filename="?([^"]+)"?/i);
    saveBlob(
      resp.data,
      match?.[1] || `labmdm-${device.device_name || "device"}-installer.exe`,
    );
    $q.notify({
      message:
        "Installer downloaded. Run it as Administrator on the target device.",
      color: "positive",
      icon: "download",
    });
    await loadDevices();
  } catch (e: any) {
    const message =
      e?.response?.data instanceof Blob
        ? await blobErrorMessage(e.response.data)
        : e?.response?.data?.error;
    $q.notify({
      message: message || "Installer generation failed",
      color: "negative",
    });
  } finally {
    downloadingDeviceId.value = null;
  }
}

async function enrollDevice() {
  enrolling.value = true;
  try {
    const resp = await axios.post(
      "/appmanagement/ssp/devices/",
      enrollForm.value,
    );
    enrollDialogOpen.value = false;
    $q.notify({
      message: "Device enrolled. Downloading installer...",
      color: "positive",
      icon: "check",
    });
    await loadDevices();
    await downloadInstaller(resp.data, installerPayload(enrollInstallerForm.value));
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Enrollment failed",
      color: "negative",
    });
  } finally {
    enrolling.value = false;
  }
}

function openEditDialog(device: any) {
  editingDevice.value = device;
  editForm.value = {
    device_name: device.device_name || "",
    device_type: device.device_type || "Laptop",
    os_info: device.os_info || "",
    serial_number: device.serial_number || "",
  };
  editDialogOpen.value = true;
}

async function saveDevice() {
  if (!editingDevice.value) return;
  savingDevice.value = true;
  try {
    await axios.put(
      `/appmanagement/ssp/devices/${editingDevice.value.id}/`,
      editForm.value,
    );
    editDialogOpen.value = false;
    $q.notify({ message: "Device updated", color: "positive", icon: "check" });
    await loadDevices();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to update device",
      color: "negative",
    });
  } finally {
    savingDevice.value = false;
  }
}

function openClaimDialog(device: any) {
  selectedClaimDevice.value = device;
  claimForm.value = {
    agent_id: device.agent_id || "",
    hostname: device.device_name || "",
  };
  claimDialogOpen.value = true;
}

async function claimDevice() {
  if (!selectedClaimDevice.value) return;
  claiming.value = true;
  try {
    await axios.post(
      `/appmanagement/ssp/devices/${selectedClaimDevice.value.id}/claim/`,
      claimForm.value,
    );
    claimDialogOpen.value = false;
    $q.notify({
      message: "Device linked to managed agent",
      color: "positive",
      icon: "link",
    });
    await loadDevices();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to link device",
      color: "negative",
    });
  } finally {
    claiming.value = false;
  }
}

function openActionsDialog(device: any) {
  selectedDevice.value = device;
  deviceActions.value = [];
  actionsDialogOpen.value = true;
  loadDeviceActions(device.id);
}

async function runDeviceAction(
  actionType: string,
  details: Record<string, any> = {},
) {
  if (!selectedDevice.value) return;
  const dangerous = [
    "wipe_selective",
    "wipe_full",
    "clear_org_data",
    "uninstall_agent",
  ].includes(actionType);
  $q.dialog({
    title: `Run ${actionType.replace(/_/g, " ")}?`,
    message: dangerous
      ? "This command changes or removes organization data on the device."
      : "The command will be sent to the managed agent.",
    cancel: true,
    ok: { color: dangerous ? "negative" : "primary", label: "Confirm" },
  }).onOk(async () => {
    actionSubmitting.value = actionType;
    try {
      await axios.post(
        `/appmanagement/ssp/devices/${selectedDevice.value.id}/actions/`,
        {
          action_type: actionType,
          reason: "Requested from Self-Service Portal",
          details,
        },
      );
      $q.notify({
        message: "Command recorded and sent",
        color: "positive",
        icon: "check",
      });
      await loadDeviceActions(selectedDevice.value.id);
      await loadDevices();
    } catch (e: any) {
      $q.notify({
        message: e?.response?.data?.error || "Command failed",
        color: "negative",
      });
    } finally {
      actionSubmitting.value = "";
    }
  });
}

function openPasswordAction() {
  passwordAction.value = { username: "", password: "" };
  passwordDialogOpen.value = true;
}

async function runPasswordAction() {
  passwordDialogOpen.value = false;
  await runDeviceAction("reset_password", { ...passwordAction.value });
}

function reportLost(device: any) {
  router.push({
    name: "SSPLostDevice",
    query: { device_id: device.id, agent_id: device.agent_id },
  });
}

function unenrollDevice(device: any) {
  $q.dialog({
    title: `Unenroll "${device.device_name}"?`,
    message: device.managed
      ? "This will remove the device from your account and request selective deletion of organization data."
      : "This will remove the pending enrollment record from your account.",
    cancel: true,
    ok: { label: "Unenroll", color: "negative" },
  }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/devices/${device.id}/`);
      $q.notify({
        message: "Device unenrolled",
        color: "positive",
        icon: "check",
      });
      await loadDevices();
    } catch (e: any) {
      $q.notify({
        message: e?.response?.data?.error || "Failed to unenroll",
        color: "negative",
      });
    }
  });
}

onMounted(async () => {
  await Promise.all([loadSettings(), loadDevices()]);
});
</script>

<style scoped>
.ssp-content-page {
  background: #f8fafc;
  padding: 28px 32px;
  min-height: calc(100vh - 100px);
}
.ssp-content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.ssp-content-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}
.ssp-content-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}
.ssp-action-btn {
  border-radius: 8px !important;
  font-weight: 600 !important;
}
.ssp-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
}
.ssp-byod-card {
  background: #fff;
  border-radius: 8px;
}
.ssp-byod-step {
  align-items: flex-start;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  min-height: 76px;
  padding: 12px;
}
.ssp-empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  max-width: 420px;
  margin: 0 auto;
}
.ssp-empty-icon {
  width: 80px;
  height: 80px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.ssp-empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.ssp-empty-sub {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}
.ssp-device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.ssp-device-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
.ssp-device-card:hover {
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
}
.ssp-device-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.ssp-device-icon-wrap {
  width: 44px;
  height: 44px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ssp-device-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}
.ssp-device-os {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
}
.ssp-status-dot {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.ssp-status-dot--active {
  background: #d1fae5;
  color: #065f46;
}
.ssp-status-dot--active::before,
.ssp-status-dot--pending::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ssp-status-dot--active::before {
  background: #059669;
}
.ssp-status-dot--pending {
  background: #fef3c7;
  color: #92400e;
}
.ssp-status-dot--pending::before {
  background: #f59e0b;
}
.ssp-device-meta {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ssp-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748b;
}
.ssp-meta-icon {
  color: #94a3b8;
  flex-shrink: 0;
}
.ssp-device-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  padding: 8px 12px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}
</style>
