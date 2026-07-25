<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6">Secure Container</div>
        <div class="text-caption text-grey-7">
          Create, mount, resize, change passwords, recover access, and monitor
          encrypted Windows containers.
        </div>
      </div>
      <q-btn
        v-if="workspaces.length === 0"
        color="primary"
        icon="add_moderator"
        label="Create Light baseline"
        :loading="creatingBaseline"
        @click="createBaselineWorkspace"
      />
    </div>

    <q-banner
      v-if="workspaces.length === 0"
      rounded
      class="bg-blue-1 text-blue-10 q-mb-md"
    >
      Create the default Light workspace policy first. It enables encrypted
      storage and blocks unwrapped export, clipboard transfer, and removable
      media by default.
    </q-banner>

    <EncryptedContainersPanel
      :workspaces="workspaces"
      :agents="agents"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

import { fetchAgents } from "@/api/agents";
import EncryptedContainersPanel from "@/devicemanagement/components/EncryptedContainersPanel.vue";

const $q = useQuasar();
const workspaces = ref<any[]>([]);
const agents = ref<any[]>([]);
const creatingBaseline = ref(false);

async function load() {
  const [workspaceResponse, agentResponse] = await Promise.all([
    axios.get("/appmanagement/workspaces/"),
    fetchAgents({ detail: "false" }),
  ]);
  workspaces.value = Array.isArray(workspaceResponse.data)
    ? workspaceResponse.data
    : workspaceResponse.data?.items || [];
  agents.value = Array.isArray(agentResponse)
    ? agentResponse
    : agentResponse?.agents || [];
}

async function createBaselineWorkspace() {
  creatingBaseline.value = true;
  try {
    await axios.post("/appmanagement/workspaces/", {
      name: "Laborato MDM Light",
      workspace_type: "organization",
      encrypt_storage: true,
      allow_personal_apps: false,
      export_behavior: "block",
      clipboard_behavior: "block",
      usb_policy: "block",
      default_label: "internal",
    });
    await load();
    $q.notify({
      color: "positive",
      icon: "check",
      message: "Laborato MDM Light container baseline created.",
    });
  } catch (error: any) {
    $q.notify({
      color: "negative",
      message:
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create the baseline workspace.",
    });
  } finally {
    creatingBaseline.value = false;
  }
}

onMounted(async () => {
  try {
    await load();
  } catch (error: any) {
    $q.notify({
      color: "negative",
      message: error?.response?.data?.detail || "Failed to load container data.",
    });
  }
});
</script>
