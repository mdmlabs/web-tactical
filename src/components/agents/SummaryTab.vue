<template>
  <div v-if="!selectedAgent" class="q-pa-sm">No agent selected</div>
  <div v-else-if="!summary && loading" class="q-pa-md flex flex-center">
    <q-circular-progress
      indeterminate
      size="50px"
      color="primary"
      class="q-ma-md"
    />
  </div>
  <div v-else-if="!summary && !loading" class="q-pa-sm text-center text-grey-6">
    <q-icon name="info" size="2em" class="q-mb-sm" />
    <div>No data available. Try refreshing.</div>
  </div>
  <div v-else-if="summary" class="q-pa-sm">
    <q-bar dense style="background-color: transparent">
      <q-btn
        dense
        flat
        size="md"
        class="q-mr-sm"
        icon="refresh"
        @click="refreshSummary"
      />
      <q-icon
        v-if="summary.status === 'overdue'"
        name="fas fa-signal"
        size="1.2em"
        :color="dash_negative_color"
        class="q-mr-sm"
      >
        <q-tooltip>Agent overdue</q-tooltip>
      </q-icon>
      <q-icon
        v-else-if="summary.status === 'offline'"
        name="fas fa-signal"
        size="1.2em"
        :color="dash_warning_color"
        class="q-mr-sm"
      >
        <q-tooltip>{{ store.getters.formatDate(summary.last_seen) }}</q-tooltip>
      </q-icon>
      <q-icon
        v-else
        name="fas fa-signal"
        size="1.2em"
        :color="dash_positive_color"
        class="q-mr-sm"
      >
        <q-tooltip>{{ store.getters.formatDate(summary.last_seen) }}</q-tooltip>
      </q-icon>
      <b>{{ summary.hostname }}</b>
      <span v-if="summary.maintenance_mode">
        &bull; <q-badge color="green"> Maintenance Mode </q-badge>
      </span>
      &bull; {{ summary.operating_system }} &bull; Agent v{{ summary.version }}
      <q-space />
      <q-btn
        dense
        flat
        label="Popout"
        icon="open_in_new"
        size="md"
        no-caps
        class="q-mr-sm"
        @click="openAgentWindow(selectedAgent)"
      />
      <q-btn
        dense
        flat
        label="Take Control"
        icon="computer"
        size="md"
        no-caps
        class="q-mr-sm"
        @click="runTakeControl(selectedAgent)"
      />
      <q-btn-dropdown dense flat size="md" no-caps label="Actions">
        <AgentActionMenu :agent="summary" />
      </q-btn-dropdown>
    </q-bar>
    <q-separator class="q-mt-sm" />
    <div class="row">
      <div class="col-4">
        <!-- left -->
        <span class="text-subtitle2 text-bold">Hardware Details</span>
        <q-list dense>
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-desktop" />
            </q-item-section>
            <q-item-section>{{ summary.make_model }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-microchip" />
            </q-item-section>
            <q-item-section>{{ cpu }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-memory" />
            </q-item-section>
            <q-item-section>{{ summary.total_ram }} GB RAM</q-item-section>
          </q-item>

          <!-- physical disks -->
          <q-item v-for="(disk, i) in summary.physical_disks" :key="disk + i">
            <q-item-section avatar>
              <q-icon name="far fa-hdd" />
            </q-item-section>
            <q-item-section>{{ disk }}</q-item-section>
          </q-item>
          <!-- graphics -->
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-tv" />
            </q-item-section>
            <q-item-section>{{ summary.graphics }}</q-item-section>
          </q-item>
          <!-- serial -->
          <q-item v-if="serial_number">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-barcode" />
            </q-item-section>
            <q-item-section>{{ serial_number }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-globe-americas" />
            </q-item-section>
            <q-item-section>Public IP: {{ summary.public_ip }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="fas fa-network-wired" />
            </q-item-section>
            <q-item-section>LAN IP: {{ summary.local_ips }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-2">
        <span class="text-subtitle2 text-bold">Checks Status</span>
        <br />
        <div v-if="summary.checks.total !== 0">
          <q-chip v-if="summary.checks.passing" square size="lg">
            <q-avatar
              size="lg"
              square
              icon="done"
              :color="dash_positive_color"
              text-color="white"
            />
            <small>{{ summary.checks.passing }} checks passing</small>
          </q-chip>
          <q-chip v-if="summary.checks.failing" square size="lg">
            <q-avatar
              size="lg"
              square
              icon="cancel"
              :color="dash_negative_color"
              text-color="white"
            />
            <small>{{ summary.checks.failing }} checks failing</small>
          </q-chip>
          <q-chip v-if="summary.checks.warning" square size="lg">
            <q-avatar
              size="lg"
              square
              icon="warning"
              :color="dash_warning_color"
              text-color="white"
            />
            <small>{{ summary.checks.warning }} checks warning</small>
          </q-chip>
          <q-chip v-if="summary.checks.info" square size="lg">
            <q-avatar
              size="lg"
              square
              icon="info"
              :color="dash_info_color"
              text-color="white"
            />
            <small>{{ summary.checks.info }} checks info</small>
          </q-chip>
          <span
            v-if="
              summary.checks.total !== 0 &&
              summary.checks.passing === 0 &&
              summary.checks.failing === 0 &&
              summary.checks.warning === 0 &&
              summary.checks.info === 0
            "
            >{{ summary.checks.total }} checks awaiting first
            synchronization</span
          >
        </div>
        <div v-else>No checks</div>

        <span
          v-if="customFields.length > 0"
          class="text-subtitle2 text-bold block q-mt-xl"
          >Custom Fields</span
        >
        <q-list dense>
          <q-item v-for="(field, i) in customFields" :key="field + i">
            <q-item-section thumbnail>
              <q-icon name="fas fa-user" size="xs" />
            </q-item-section>
            <q-item-section>{{ field.name }}: {{ field.value }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-1"></div>
      <!-- right -->
      <div class="col-3">
        <span class="text-subtitle2 text-bold">Disks</span>
        <div v-for="disk in disks" :key="disk.device">
          <span>{{ disk.device }} ({{ disk.fstype }})</span>
          <q-linear-progress
            rounded
            size="15px"
            :value="disk.percent / 100"
            :color="diskBarColor(disk.percent)"
            class="q-mt-sm"
          />
          <span>{{ disk.free }} free of {{ disk.total }}</span>
          <q-separator />
        </div>
      </div>
      <div class="col-2"></div>
    </div>
    <q-inner-loading :showing="loading" color="primary" />
  </div>
</template>

<script>
// composition imports
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import {
  fetchAgent,
  refreshAgentWMI,
  runTakeControl,
  openAgentWindow,
} from "@/api/agents";
import { notifySuccess } from "@/utils/notify";
import { fetchCustomFields } from "@/api/core";

// ui imports
import AgentActionMenu from "@/components/agents/AgentActionMenu.vue";

export default {
  name: "SummaryTab",
  components: {
    AgentActionMenu,
  },
  setup() {
    // vuex setup
    const store = useStore();
    const selectedAgent = computed(() => store.state.selectedRow);
    const refreshSummaryTab = computed(() => store.state.refreshSummaryTab);
    const dash_info_color = computed(() => store.state.dash_info_color);
    const dash_positive_color = computed(() => store.state.dash_positive_color);
    const dash_negative_color = computed(() => store.state.dash_negative_color);
    const dash_warning_color = computed(() => store.state.dash_warning_color);

    // summary tab logic
    const summary = ref(null);
    const customFieldsDefinitions = ref(null);
    const loading = ref(false);
    let isMounted = true;

    const serial_number = computed(() => {
      if (summary.value.plat === "windows") {
        return summary.value.wmi_detail.bios?.[0]?.[0]?.SerialNumber;
      } else {
        return summary.value.wmi_detail.serialnumber;
      }
    });

    const cpu = computed(() => {
      if (summary.value.cpu_model?.length > 1) {
        return `${summary.value.cpu_model.length}x ${summary.value.cpu_model[0]}`;
      }
      return summary.value.cpu_model[0];
    });

    function diskBarColor(percent) {
      if (percent < 80) {
        return dash_positive_color.value;
      } else if (percent >= 80 && percent < 95) {
        return dash_warning_color.value;
      } else {
        return dash_negative_color.value;
      }
    }

    const disks = computed(() => {
      if (!summary.value.disks) {
        return [];
      }

      const entries = Object.entries(summary.value.disks);
      const ret = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let [k, v] of entries) {
        ret.push(v);
      }
      return ret;
    });

    const customFields = computed(() => {
      if (!summary.value.custom_fields) {
        return [];
      }
      if (!customFieldsDefinitions.value) {
        return [];
      }
      const ret = [];
      for (const customField of summary.value.custom_fields) {
        const definition = customFieldsDefinitions.value.find(
          (def) => def.id === customField.field,
        );
        if (
          definition &&
          !definition.hide_in_summary &&
          customField.value?.length > 0
        ) {
          ret.push({
            name: definition.name,
            value: customField.value,
          });
        }
      }

      return ret;
    });

    async function getSummary() {
      if (!selectedAgent.value || !isMounted) {
        return;
      }

      const currentAgentId = selectedAgent.value;

      try {
        loading.value = true;
        const agentData = await fetchAgent(currentAgentId);

        // проверяем, что компонент все еще смонтирован и селектаджент не изменился
        if (
          !isMounted ||
          !selectedAgent.value ||
          selectedAgent.value !== currentAgentId
        ) {
          loading.value = false;
          return;
        }

        // чекаем что полученные данные соответствуют выбранному агенту
        if (agentData && agentData.id !== currentAgentId) {
          loading.value = false;
          return;
        }

        // инстайлим данные только если все проверки пройдены
        if (agentData && isMounted && selectedAgent.value === currentAgentId) {
          summary.value = agentData;

          // грузим кастомфилды только если компонент все еще активен
          if (isMounted && selectedAgent.value === currentAgentId) {
            try {
              const customFields = await fetchCustomFields();
              if (isMounted && selectedAgent.value === currentAgentId) {
                customFieldsDefinitions.value = customFields;
              }
            } catch (error) {
              console.error("Error fetching custom fields:", error);
            }
          }

          // финальная проверка
          if (isMounted && selectedAgent.value === currentAgentId) {
            store.commit("setRefreshSummaryTab", false);
            if (summary.value?.plat) {
              store.commit("setAgentPlatform", summary.value.plat);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        // при ероре сбрасываем лоадинг и очищаем саймори
        if (isMounted) {
          summary.value = null;
        }
      } finally {
        if (isMounted) {
          loading.value = false;
        }
      }
    }

    async function refreshSummary() {
      if (!selectedAgent.value || !isMounted) {
        return;
      }

      const currentAgentId = selectedAgent.value;

      try {
        loading.value = true;
        const agentData = await fetchAgent(currentAgentId);

        if (
          !isMounted ||
          !selectedAgent.value ||
          selectedAgent.value !== currentAgentId
        ) {
          return;
        }

        summary.value = agentData;

        const result = await refreshAgentWMI(currentAgentId);

        // проверяем на всякий случай перед вызовом гетсаймори
        if (isMounted && selectedAgent.value === currentAgentId) {
          await getSummary();
          notifySuccess(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted && selectedAgent.value === currentAgentId) {
          loading.value = false;
        }
      }
    }

    watch(selectedAgent, (newValue) => {
      if (newValue && isMounted) {
        getSummary();
      }
    });

    watch(refreshSummaryTab, (newValue) => {
      if (newValue && selectedAgent.value && isMounted) {
        getSummary();
      }

      if (isMounted) {
        store.commit("setRefreshSummaryTab", false);
      }
    });

    onMounted(() => {
      isMounted = true;
      if (selectedAgent.value) getSummary();
    });

    onBeforeUnmount(() => {
      isMounted = false;
    });

    return {
      // reactive data
      summary,
      customFields,
      loading,
      selectedAgent,
      disks,
      dash_info_color,
      dash_positive_color,
      dash_warning_color,
      dash_negative_color,
      serial_number,
      cpu,
      store,

      // methods
      getSummary,
      refreshSummary,
      diskBarColor,
      runTakeControl,
      openAgentWindow,
    };
  },
};
</script>
