<template>
  <q-page>
    <q-breadcrumbs class="q-pa-md q-pb-sm" separator="›" active-color="primary">
      <q-breadcrumbs-el
        label="Dashboard"
        icon="dashboard"
        to="/"
        class="cursor-pointer"
      />
      <q-breadcrumbs-el
        v-if="agentHostname"
        :label="agentHostname"
        icon="computer"
      />
    </q-breadcrumbs>

    <q-separator />

    <SubTableTabs
      :style="{ height: `${tabHeight + 38}px` }"
      :activeTabs="[
        'summary',
        'checks',
        'tasks',
        'patches',
        'software',
        'history',
        'notes',
        'assets',
        'debug',
        'audit',
      ]"
    />
  </q-page>
</template>

<script>
// composition imports
import { defineComponent, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { fetchAgent } from "@/api/agents";

// ui imports
import SubTableTabs from "@/components/SubTableTabs.vue";

export default defineComponent({
  name: "AgentView",
  components: {
    SubTableTabs,
  },
  provide() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      refreshDashboard: () => {}, // noop
    };
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const $q = useQuasar();

    const tabHeight = ref($q.screen.height - 309 - 50 - 36);
    const agentHostname = ref("");

    const agentId = computed(() => route.params.agent_id);

    async function loadAgentInfo() {
      const currentAgentId = agentId.value;
      if (!currentAgentId) return;
      try {
        const agentData = await fetchAgent(currentAgentId);
        if (agentData && agentId.value === currentAgentId) {
          agentHostname.value = agentData.hostname;
        }
      } catch (error) {
        console.error("Error loading agent info:", error);
      }
    }

    function initializeAgent(agent_id) {
      if (agent_id) {
        store.commit("setActiveRow", agent_id);
        store.state.tabHeight = `${tabHeight.value}px`;
        loadAgentInfo();
      }
    }

    initializeAgent(agentId.value);

    // watch for route change
    watch(
      () => route.params.agent_id,
      (newAgentId) => {
        initializeAgent(newAgentId);
      },
    );

    return {
      tabHeight,
      agentHostname,
    };
  },
});
</script>
