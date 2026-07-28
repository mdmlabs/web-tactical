<template>
  <q-page class="light-admin q-pa-md">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Administration</div>
        <div class="text-body2 text-grey-7">
          Deploy Windows agents, remove managed endpoints, and administer portal users.
        </div>
      </div>
      <q-space />
      <q-btn
        flat
        round
        icon="refresh"
        :loading="loadingAgents"
        @click="loadAgents"
      >
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </div>

    <q-tabs
      v-model="activeTab"
      align="left"
      dense
      no-caps
      active-color="primary"
      indicator-color="primary"
      class="bg-white text-grey-8 rounded-borders q-mb-md"
      @update:model-value="updateRouteTab"
    >
      <q-tab name="agents" icon="devices" label="Agent installation and removal" />
      <q-tab name="users" icon="manage_accounts" label="User administration" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated class="bg-transparent">
      <q-tab-panel name="agents" class="q-pa-none">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center q-col-gutter-md">
            <div class="col-12 col-md">
              <div class="text-h6">Install a Windows agent</div>
              <div class="text-body2 text-grey-7">
                Generate a one-file installer, copy it to the Windows computer,
                and run it once as Administrator. The installer enrolls the
                device and installs the Laborato policy extension.
              </div>
            </div>
            <div class="col-12 col-md-auto">
              <q-btn
                color="primary"
                unelevated
                icon="download"
                label="Generate Windows installer"
                no-caps
                @click="installerOpen = true"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-lg text-body2">
            <div class="col-12 col-md-4">
              <div class="text-weight-bold">1. Select destination</div>
              Choose the site, workstation type, x64 or ARM64 architecture, and token lifetime.
            </div>
            <div class="col-12 col-md-4">
              <div class="text-weight-bold">2. Download and run</div>
              Run the generated EXE with local administrator rights on the target device.
            </div>
            <div class="col-12 col-md-4">
              <div class="text-weight-bold">3. Verify enrollment</div>
              The computer appears below and on Dashboard when the service connects.
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div>
              <div class="text-h6">Managed Windows agents</div>
              <div class="text-caption text-grey-7">
                Removing the policy extension keeps the monitoring agent.
                Removing the device agent uninstalls both components and deletes the portal record.
              </div>
            </div>
            <q-space />
            <q-badge color="primary" :label="`${windowsAgents.length} devices`" />
          </q-card-section>

          <q-table
            flat
            :rows="windowsAgents"
            :columns="columns"
            row-key="agent_id"
            :loading="loadingAgents"
            :pagination="{ rowsPerPage: 0 }"
            hide-pagination
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.status === 'online' ? 'positive' : 'warning'"
                  :label="props.row.status || 'unknown'"
                />
              </q-td>
            </template>
            <template #body-cell-policy="props">
              <q-td :props="props">
                <q-badge
                  v-if="props.row.mdm_agent_version"
                  color="teal"
                  :label="props.row.mdm_agent_version"
                />
                <span v-else class="text-grey-6">Not installed</span>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn
                  flat
                  dense
                  no-caps
                  color="orange-9"
                  icon="extension_off"
                  label="Remove policy extension"
                  :disable="!props.row.mdm_agent_version"
                  :loading="removingPolicy[props.row.agent_id]"
                  @click="confirmRemovePolicy(props.row)"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  color="negative"
                  icon="delete_forever"
                  label="Remove device agent"
                  :loading="removingAgent[props.row.agent_id]"
                  @click="confirmRemoveAgent(props.row)"
                />
              </q-td>
            </template>
            <template #no-data>
              <div class="full-width row flex-center q-pa-xl text-grey-7">
                No Windows agents are enrolled yet. Generate an installer to add the first device.
              </div>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="users" class="q-pa-none">
        <AdminManager embedded />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="installerOpen">
      <InstallAgent />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import AdminManager from "@/components/AdminManager.vue";
import InstallAgent from "@/components/modals/agents/InstallAgent.vue";
import { deleteMdmAgents, removeAgent } from "@/api/agents";
import { useAgentsStore } from "@/stores/agents";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const agentsStore = useAgentsStore();

const activeTab = ref(route.query.tab === "users" ? "users" : "agents");
const installerOpen = ref(false);
const loadingAgents = ref(false);
const removingPolicy = reactive<Record<string, boolean>>({});
const removingAgent = reactive<Record<string, boolean>>({});

const columns = [
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "hostname", label: "Hostname", field: "hostname", align: "left", sortable: true },
  { name: "site", label: "Site", field: "site_name", align: "left", sortable: true },
  { name: "architecture", label: "Architecture", field: "goarch", align: "left", sortable: true },
  { name: "agent", label: "Device agent", field: "version", align: "left", sortable: true },
  { name: "policy", label: "Policy extension", field: "mdm_agent_version", align: "left", sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "right" },
] as const;

const windowsAgents = computed(() =>
  agentsStore.agents.filter((agent: any) => agent.plat === "windows"),
);

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = tab === "users" ? "users" : "agents";
  },
);

function updateRouteTab(tab: string) {
  router.replace({ path: "/settings", query: { tab } });
}

async function loadAgents() {
  loadingAgents.value = true;
  try {
    await agentsStore.loadAgents();
  } finally {
    loadingAgents.value = false;
  }
}

function confirmRemovePolicy(agent: any) {
  $q.dialog({
    title: "Remove policy extension",
    message: `Uninstall the Laborato policy extension from ${agent.hostname}? The device agent and portal record will remain.`,
    cancel: true,
    persistent: true,
    ok: { label: "Remove extension", color: "orange-9", noCaps: true },
  }).onOk(async () => {
    removingPolicy[agent.agent_id] = true;
    try {
      const response = await deleteMdmAgents({ agent_id: agent.agent_id });
      agent.mdm_agent_version = null;
      $q.notify({
        type: "positive",
        message: response.message || "Policy extension removal started",
      });
    } catch (error: any) {
      $q.notify({
        type: "negative",
        message: error?.response?.data?.detail || error?.response?.data?.error || "Unable to remove policy extension",
      });
    } finally {
      removingPolicy[agent.agent_id] = false;
    }
  });
}

function confirmRemoveAgent(agent: any) {
  $q.dialog({
    title: `Remove ${agent.hostname}`,
    message: "Type REMOVE to uninstall the managed agent and delete this device from the portal.",
    prompt: {
      model: "",
      type: "text",
      isValid: (value: string) => value.trim().toUpperCase() === "REMOVE",
    },
    cancel: true,
    persistent: true,
    ok: { label: "Remove device agent", color: "negative", noCaps: true },
  }).onOk(async () => {
    removingAgent[agent.agent_id] = true;
    try {
      const response = await removeAgent(agent.agent_id);
      agentsStore.agents = agentsStore.agents.filter(
        (row: any) => row.agent_id !== agent.agent_id,
      );
      $q.notify({ type: "positive", message: response || "Agent removal started" });
    } catch (error: any) {
      $q.notify({
        type: "negative",
        message: error?.response?.data?.detail || error?.response?.data?.error || "Unable to remove device agent",
      });
    } finally {
      removingAgent[agent.agent_id] = false;
    }
  });
}

onMounted(loadAgents);
</script>

<style scoped>
.light-admin {
  background: #f5f8fa;
}

.rounded-borders {
  border: 1px solid #e2e8ee;
}
</style>
