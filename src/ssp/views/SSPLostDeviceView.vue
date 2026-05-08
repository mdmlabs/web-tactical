<template>
  <q-page class="q-pa-md ssp-lost-device-page">
    <div class="text-h6 q-mb-md text-negative">
      <q-icon name="report_problem" class="q-mr-sm" />
      {{ $t('ssp.views.SSPLostDeviceView.8a456c') }}
    </div>

    <q-banner class="bg-warning text-dark rounded-borders q-mb-lg">
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      <strong>{{ $t('ssp.views.SSPLostDeviceView.18dd7e') }}</strong> If your device has been lost or stolen, use the buttons below
      to immediately lock it or wipe organization data. This action cannot be undone.
    </q-banner>

    <!-- Device selector -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">{{ $t('ssp.views.SSPLostDeviceView.87a475') }}</div>
        <q-select
          v-model="selectedDevice"
          :options="deviceOptions"
          :label="$t('ssp.views.SSPLostDeviceView.199d75')"
          outlined
          dense
          emit-value
          map-options
          style="max-width: 480px"
        />
        <div class="q-mt-sm" v-if="selectedDevice">
          <div class="text-caption text-grey">
            Agent ID: {{ selectedDevice.agent_id || "Not registered with agent" }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Action buttons -->
    <div class="row q-gutter-md q-mb-lg" v-if="selectedDevice">
      <q-card class="col-12 col-sm-5 action-card">
        <q-card-section class="text-center">
          <q-icon name="lock" size="48px" color="warning" />
          <div class="text-h6 q-mt-sm">{{ $t('ssp.views.SSPLostDeviceView.7bdbd3') }}</div>
          <div class="text-caption text-grey q-mt-xs">
            Immediately lock the screen. Organization data remains intact.
            The device will require password to unlock.
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="warning"
            icon="lock"
            :label="$t('ssp.views.SSPLostDeviceView.4a0ccb')"
            @click="performAction('lock')"
            :loading="actionLoading === 'lock'"
            :disable="!selectedDevice?.agent_id"
          />
        </q-card-actions>
      </q-card>

      <q-card class="col-12 col-sm-5 action-card" v-if="selectedDevice?.agent_id">
        <q-card-section class="text-center">
          <q-icon name="password" size="48px" color="primary" />
          <div class="text-h6 q-mt-sm">Reset Device Password</div>
          <div class="text-caption text-grey q-mt-xs">
            Open the managed-device action panel to set a new local password through the audited agent channel.
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="primary"
            icon="password"
            label="Open reset"
            @click="router.push('/ssp/devices')"
          />
        </q-card-actions>
      </q-card>

      <!-- Emergency Geo-Lock (func #689) -->
      <q-card class="col-12 col-sm-5 action-card" v-if="selectedDevice?.agent_id">
        <q-card-section class="text-center">
          <q-icon name="location_on" size="48px" color="deep-orange" />
          <div class="text-h6 q-mt-sm">{{ $t('ssp.views.SSPLostDeviceView.170965') }}</div>
          <div class="text-caption text-grey q-mt-xs">
            {{ $t('ssp.views.SSPLostDeviceView.a4eb6b') }}
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="deep-orange"
            icon="lock_location"
            :label="$t('ssp.views.SSPLostDeviceView.184627')"
            @click="performAction('geolockmode')"
            :loading="actionLoading === 'geolockmode'"
          />
        </q-card-actions>
      </q-card>

      <q-card class="col-12 col-sm-5 action-card">
        <q-card-section class="text-center">
          <q-icon name="delete_sweep" size="48px" color="negative" />
          <div class="text-h6 q-mt-sm">{{ $t('ssp.views.SSPLostDeviceView.eabea8') }}</div>
          <div class="text-caption text-grey q-mt-xs">
            Remove all organization data, apps, and container data from the device.
            Personal data is preserved.
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="negative"
            icon="delete_sweep"
            :label="$t('ssp.views.SSPLostDeviceView.510d6b')"
            @click="performAction('wipe_selective')"
            :loading="actionLoading === 'wipe_selective'"
            :disable="!selectedDevice?.agent_id"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Report form -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">{{ $t('ssp.views.SSPLostDeviceView.fe10ee') }}</div>
        <q-form @submit="submitReport" class="q-gutter-md">
          <q-select
            v-model="reportForm.incident_type"
            :options="[
              { label: 'Lost (misplaced)', value: 'lost' },
              { label: 'Stolen', value: 'stolen' },
              { label: 'Left unattended', value: 'unattended' },
            ]"
            :label="$t('ssp.views.SSPLostDeviceView.289ae5')"
            outlined
            dense
            emit-value
            map-options
          />
          <q-input
            v-model="reportForm.description"
            :label="$t('ssp.views.SSPLostDeviceView.87d769')"
            outlined
            type="textarea"
            rows="4"
            :placeholder="$t('ssp.views.SSPLostDeviceView.ca8cf3')"
          />
          <q-input
            v-model="reportForm.contact_number"
            :label="$t('ssp.views.SSPLostDeviceView.4a2def')"
            outlined
            dense
          />
          <div class="row q-gutter-sm">
            <q-btn type="submit" color="negative" icon="send" :label="$t('ssp.views.SSPLostDeviceView.1ca000')" :loading="submitting" />
            <q-btn flat :label="$t('ssp.views.SSPLostDeviceView.77dfd2')" @click="$router.push('/ssp/devices')" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Action result -->
    <q-banner
      v-if="actionResult"
      :class="actionResult.success ? 'bg-positive' : 'bg-negative'"
      class="text-white rounded-borders q-mt-md"
    >
      <template v-slot:avatar>
        <q-icon :name="actionResult.success ? 'check_circle' : 'error'" />
      </template>
      {{ actionResult.message }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const devices = ref<any[]>([]);
const selectedDevice = ref<any>(null);
const actionLoading = ref<string | null>(null);
const submitting = ref(false);
const actionResult = ref<{ success: boolean; message: string } | null>(null);

const reportForm = ref({
  incident_type: "lost",
  description: "",
  contact_number: "",
});

const deviceOptions = computed(() =>
  devices.value.map((d) => ({
    label: `${d.device_name} (${d.os_info || "Unknown OS"})`,
    value: d,
  }))
);

async function loadDevices() {
  try {
    devices.value = (await axios.get("/appmanagement/ssp/devices/")).data;
    // Pre-select device from query params if provided
    const deviceId = route.query.device_id;
    if (deviceId) {
      selectedDevice.value = devices.value.find((d) => String(d.id) === String(deviceId)) || null;
    }
  } catch {
    devices.value = [];
  }
}

async function performAction(actionType: string) {
  if (!selectedDevice.value?.agent_id) {
    $q.notify({ message: "This device has no registered agent. Please contact IT.", color: "warning" });
    return;
  }

  const confirmed = await new Promise<boolean>((resolve) => {
    $q.dialog({
      title: actionType === "lock" ? "Lock Device?" : "Wipe Organization Data?",
      message:
        actionType === "lock"
          ? "This will immediately lock your device remotely."
          : "This will remove ALL organization data from your device. Are you sure?",
      cancel: true,
      ok: { label: "Confirm", color: actionType === "lock" ? "warning" : "negative" },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });

  if (!confirmed) return;

  actionLoading.value = actionType;
  actionResult.value = null;

  try {
    await axios.post(`/appmanagement/ssp/devices/${selectedDevice.value.id}/actions/`, {
      action_type: actionType,
      reason: `SSP: Device reported as ${reportForm.value.incident_type}`,
      details: {
        incident_type: reportForm.value.incident_type,
        description: reportForm.value.description,
        contact_number: reportForm.value.contact_number,
      },
    });
    actionResult.value = {
      success: true,
      message:
        actionType === "lock"
          ? "Lock command sent successfully. Your device will be locked shortly."
          : "Wipe command sent. Organization data will be removed from your device.",
    };
  } catch (e: any) {
    actionResult.value = {
      success: false,
      message: "Failed to send command. Please contact your IT administrator.",
    };
  } finally {
    actionLoading.value = null;
  }
}

async function submitReport() {
  submitting.value = true;
  try {
    if (!selectedDevice.value?.id) {
      $q.notify({ message: "Select a device first.", color: "warning" });
      return;
    }

    await axios.post(`/appmanagement/ssp/devices/${selectedDevice.value.id}/actions/`, {
      action_type: "report_lost",
      reason: `Device ${reportForm.value.incident_type} reported from SSP`,
      details: {
        incident_type: reportForm.value.incident_type,
        description: reportForm.value.description,
        contact_number: reportForm.value.contact_number,
        lock: !!selectedDevice.value?.agent_id,
      },
    });

    try {
      await axios.post("/security/incidents/", {
        agent_id: selectedDevice.value?.agent_id || "unknown",
        incident_type: "other",
        severity: reportForm.value.incident_type === "stolen" ? "high" : "medium",
        title: `Device ${reportForm.value.incident_type} reported by SSP user`,
        description: `${reportForm.value.description}\nContact: ${reportForm.value.contact_number}`,
        status: "open",
      });
    } catch {
      // SSP action audit is the source of truth; security incident creation is best effort for SSP-only users.
    }

    $q.notify({
      message: "Report submitted successfully. IT team will contact you.",
      color: "positive",
      icon: "check",
    });
    router.push("/ssp/devices");
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Failed to submit report. Please try again.", color: "negative" });
  } finally {
    submitting.value = false;
  }
}

onMounted(loadDevices);
</script>

<style scoped>
.action-card {
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s;
}
.action-card:hover {
  border-color: rgba(0, 0, 0, 0.2);
}
.ssp-lost-device-page {
  min-height: calc(100vh - 100px);
  padding-bottom: 96px;
}
</style>
