<template>
  <div>
    <q-bar>
      <span class="text-caption">
        TRMM Agent Status:
        <q-badge :color="statusColor" :label="status" />
      </span>
      <q-space />
      <q-btn
        class="q-mr-md"
        color="primary"
        size="sm"
        label="Restart Connection"
        icon="refresh"
        @click="restartMeshService"
      />
      <q-btn
        :color="dash_negative_color"
        size="sm"
        label="Recover Connection"
        icon="fas fa-first-aid"
        @click="repairMeshCentral"
      />
      <q-space />
    </q-bar>
    <div class="q-video" :style="{ height: `${$q.screen.height - 26}px` }">
      <iframe
        v-show="control"
        :src="control"
        allow="clipboard-read; clipboard-write"
        allowfullscreen
        frameborder="0"
      ></iframe>
      <div
        v-if="sasBlocked"
        class="sas-blocker"
        title="Ctrl+Alt+Del is disabled while kiosk lockdown is active"
      >
        Secure attention disabled
      </div>
    </div>
  </div>
</template>

<script>
// composition imports
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useMeta, useQuasar } from "quasar";
import { fetchAgentMeshCentralURLs, sendAgentRecoverMesh } from "@/api/agents";
import { fetchDashboardInfo } from "@/api/core";
import { notifySuccess } from "@/utils/notify";

export default {
  name: "TakeControl",
  setup() {
    // vue lifecycle hooks
    onMounted(() => {
      dashInfo();
      getDashInfo();
      getMeshURLs();
    });

    // quasar setup
    const $q = useQuasar();
    const store = useStore();
    const dash_positive_color = computed(() => store.state.dash_positive_color);
    const dash_negative_color = computed(() => store.state.dash_negative_color);
    const dash_warning_color = computed(() => store.state.dash_warning_color);

    // vue router
    const { params } = useRoute();

    // take control setup
    const control = ref("");
    const status = ref(null);
    const sasBlocked = ref(false);

    const statusColor = computed(() => {
      switch (status.value) {
        case "online":
          return dash_positive_color.value;
        case "offline":
          return dash_warning_color.value;
        default:
          return dash_negative_color.value;
      }
    });

    // TODO refactor this so we're not calling the api twice
    const dashInfo = () => {
      store.dispatch("getDashInfo", false);
    };

    async function getMeshURLs() {
      $q.loading.show();
      try {
        const data = await fetchAgentMeshCentralURLs(params.agent_id);
        control.value = data.control;
        status.value = data.status;
        sasBlocked.value = Boolean(data.sas_blocked);
        useMeta({
          title: `${data.hostname} - ${data.client} - ${data.site} | Take Control`,
        });
      } catch (e) {
        console.error(e);
      }
      $q.loading.hide();
    }

    async function getDashInfo() {
      const { dark_mode, loading_bar_color } = await fetchDashboardInfo();
      $q.dark.set(dark_mode);
      $q.loadingBar.setDefaults({ color: loading_bar_color });
    }

    async function repairMeshCentral() {
      control.value = "";
      $q.loading.show({ message: "Attempting to repair Mesh Agent" });
      try {
        const data = await sendAgentRecoverMesh(params.agent_id);
        await getMeshURLs();
        setTimeout(() => {
          notifySuccess(data);
        }, 500);
      } catch (e) {
        console.error(e);
      }
      $q.loading.hide();
    }

    async function restartMeshService() {
      control.value = "";
      $q.loading.show({ message: "Restarting Mesh Agent" });
      try {
        await sendAgentRecoverMesh(params.agent_id);
        await getMeshURLs();
        setTimeout(() => {
          notifySuccess("Mesh agent connection was restarted");
        }, 500);
      } catch (e) {
        console.error(e);
      }

      $q.loading.hide();
    }

    return {
      // reactive data
      control,
      status,
      sasBlocked,
      statusColor,
      dash_negative_color,

      // methods
      repairMeshCentral,
      restartMeshService,
    };
  },
};
</script>

<style scoped>
.sas-blocker {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 190px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  border-top: 1px solid #bdbdbd;
  border-right: 1px solid #bdbdbd;
  color: #616161;
  font-size: 12px;
  font-weight: 600;
  user-select: none;
}
</style>
