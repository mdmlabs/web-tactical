<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Device control</div>
    <div class="text-caption text-grey-7 q-mb-lg">
      Only the remote actions included in Laborato MDM Light are available.
    </div>

    <q-card flat bordered style="max-width: 760px">
      <q-card-section>
        <AgentPicker
          v-model="agentId"
          :options="agentOptions"
          label="Target Windows device"
          outlined
          clearable
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-sm-4">
          <q-btn
            class="full-width"
            color="warning"
            icon="lock"
            label="Lock"
            :disable="!agentId"
            :loading="busyAction === 'lock'"
            @click="dispatch('lock')"
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-btn
            class="full-width"
            color="primary"
            icon="restart_alt"
            label="Reboot"
            :disable="!agentId"
            :loading="busyAction === 'reboot'"
            @click="dispatch('reboot')"
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-btn
            class="full-width"
            color="negative"
            icon="power_settings_new"
            label="Shutdown"
            :disable="!agentId"
            :loading="busyAction === 'shutdown'"
            @click="dispatch('shutdown')"
          />
        </div>
      </q-card-section>
      <q-card-section v-if="lastResult" class="bg-blue-grey-1">
        <q-icon
          :name="lastResult.ok ? 'check_circle' : 'error'"
          :color="lastResult.ok ? 'positive' : 'negative'"
          class="q-mr-sm"
        />
        {{ lastResult.message }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

import {
  agentRebootNow,
  agentShutdown,
  fetchAgents,
} from "@/api/agents";
import AgentPicker from "@/devicemanagement/components/AgentPicker.vue";
import {
  buildAgentOptions,
  type AgentOptionRich,
} from "@/devicemanagement/components/agentOptionHelpers";

type LightDeviceAction = "lock" | "reboot" | "shutdown";

const $q = useQuasar();
const agentId = ref("");
const agentOptions = ref<AgentOptionRich[]>([]);
const busyAction = ref<LightDeviceAction | "">("");
const lastResult = ref<{ ok: boolean; message: string } | null>(null);

async function loadAgents() {
  const data = await fetchAgents({ detail: "false" });
  const rows = Array.isArray(data) ? data : data?.agents || [];
  agentOptions.value = buildAgentOptions(rows);
}

function confirmAction(action: LightDeviceAction): Promise<boolean> {
  return new Promise((resolve) => {
    $q.dialog({
      title: `${action[0].toUpperCase()}${action.slice(1)} device?`,
      message: `Send the ${action} command to the selected Windows device?`,
      cancel: true,
      persistent: true,
      ok: { label: "Send command", color: action === "shutdown" ? "negative" : "primary" },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false))
      .onDismiss(() => resolve(false));
  });
}

async function dispatch(action: LightDeviceAction) {
  if (!agentId.value || !(await confirmAction(action))) return;
  busyAction.value = action;
  lastResult.value = null;
  try {
    if (action === "lock") {
      await axios.post("/devicemanagement/actions/", {
        agent_id: agentId.value,
        action_type: "lock",
        reason: "Laborato MDM Light device control",
        params: {},
      });
    } else if (action === "reboot") {
      await agentRebootNow(agentId.value);
    } else {
      await agentShutdown(agentId.value);
    }
    lastResult.value = {
      ok: true,
      message: `${action[0].toUpperCase()}${action.slice(1)} command accepted.`,
    };
  } catch (error: any) {
    lastResult.value = {
      ok: false,
      message:
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        `${action} command failed.`,
    };
  } finally {
    busyAction.value = "";
  }
}

onMounted(loadAgents);
</script>
