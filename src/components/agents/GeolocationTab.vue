<template>
  <div v-if="!selectedAgent" class="q-pa-sm">No agent selected</div>
  <div v-else-if="loading && !geo" class="q-pa-md flex flex-center">
    <q-circular-progress
      indeterminate
      size="50px"
      color="primary"
      class="q-ma-md"
    />
  </div>
  <div v-else-if="!geo && !showFailure" class="q-pa-md text-center text-grey-6">
    <q-icon name="mdi-map-marker-off" size="3em" class="q-mb-sm" />
    <div>Geolocation is not available for this agent</div>
  </div>
  <div v-else-if="showFailure" class="q-pa-md">
    <q-banner class="bg-warning text-dark q-mb-md rounded-borders">
      <template #avatar>
        <q-icon name="warning" color="dark" />
      </template>
      <div>
        Geolocation data could not be retrieved for this device
        <span v-if="agentHostname" class="text-weight-bold">({{ agentHostname }})</span>.
      </div>
      <template #action>
        <q-btn
          flat
          no-caps
          label="Check Again"
          color="dark"
          :loading="loading"
          @click="handleCheckAgain"
        />
        <q-btn
          flat
          no-caps
          label="Stop"
          color="negative"
          :loading="stopLogging"
          @click="handleStop"
        />
      </template>
    </q-banner>
  </div>
  <div v-else class="q-pa-sm">
    <q-bar dense style="background-color: transparent">
      <q-btn dense flat size="md" icon="refresh" @click="loadAll" />
      <span class="text-subtitle2 text-bold q-ml-sm">Geolocation</span>
      <q-space />
      <span class="text-caption text-grey-7">
        Source: {{ geo.source }} | Updated:
        {{ formatDateTime(geo.created_at) }}
      </span>
    </q-bar>
    <q-separator class="q-mt-sm" />

    <!-- Mini map -->
    <div class="geo-mini-map q-mt-sm">
      <l-map
        ref="miniMapRef"
        :zoom="13"
        :center="currentCenter"
        :use-global-leaflet="false"
        style="height: 100%; width: 100%"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          layer-type="base"
          name="OpenStreetMap"
        />
        <l-marker :lat-lng="currentCenter">
          <l-icon
            :icon-url="markerIcon"
            :icon-size="[25, 41]"
            :icon-anchor="[12, 41]"
            :popup-anchor="[1, -34]"
          />
          <l-popup>
            <div>
              <strong>Current Position</strong><br />
              Lat: {{ geo.latitude }}<br />
              Lon: {{ geo.longitude }}<br />
              Accuracy: {{ geo.accuracy }} m<br />
              Altitude: {{ geo.altitude || "N/A" }} m
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- History section -->
    <div class="q-mt-md">
      <div class="row items-center q-mb-sm">
        <span class="text-subtitle2 text-bold">Location History</span>
        <q-space />
        <q-select
          v-model="historyDays"
          :options="dayOptions"
          dense
          outlined
          emit-value
          map-options
          style="width: 130px"
          class="q-mr-sm"
          label="Period"
        />
        <q-select
          v-model="historyLimit"
          :options="limitOptions"
          dense
          outlined
          emit-value
          map-options
          style="width: 120px"
          label="Limit"
        />
      </div>

      <q-table
        dense
        flat
        bordered
        :rows="history"
        :columns="historyColumns"
        row-key="id"
        :loading="historyLoading"
        :rows-per-page-options="[10, 25, 50, 100]"
        no-data-label="No location history"
      >
        <template v-slot:body-cell-coordinates="props">
          <q-td :props="props">
            {{ props.row.latitude }}, {{ props.row.longitude }}
          </q-td>
        </template>
        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.created_at) }}
          </q-td>
        </template>
      </q-table>
    </div>
    <q-inner-loading :showing="loading" color="primary" />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { date, Notify } from "quasar";
import { fetchAgent, fetchAgentGeolocationHistory } from "@/api/agents";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";

const MARKER_BLUE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41"><path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#1089d3"/><circle cx="12.5" cy="12.5" r="6" fill="#fff"/></svg>',
  );

export default {
  name: "GeolocationTab",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
  },
  setup() {
    const store = useStore();
    const selectedAgent = computed(() => store.state.selectedRow);

    const geo = ref(null);
    const loading = ref(false);
    const history = ref([]);
    const historyLoading = ref(false);
    const miniMapRef = ref(null);
    const markerIcon = MARKER_BLUE;

    const historyDays = ref(7);
    const historyLimit = ref(100);

    // Failure handling
    const showFailure = ref(false);
    const agentHostname = ref("");
    const stopLogging = ref(false);

    let isMounted = true;

    const dayOptions = [
      { label: "1 day", value: 1 },
      { label: "3 days", value: 3 },
      { label: "7 days", value: 7 },
      { label: "30 days", value: 30 },
    ];

    const limitOptions = [
      { label: "50", value: 50 },
      { label: "100", value: 100 },
      { label: "200", value: 200 },
      { label: "500", value: 500 },
    ];

    const historyColumns = [
      {
        name: "coordinates",
        label: "Coordinates",
        field: "latitude",
        align: "left",
      },
      {
        name: "accuracy",
        label: "Accuracy (m)",
        field: "accuracy",
        align: "left",
      },
      {
        name: "altitude",
        label: "Altitude (m)",
        field: "altitude",
        align: "left",
      },
      {
        name: "source",
        label: "Source",
        field: "source",
        align: "left",
      },
      {
        name: "created_at",
        label: "Date",
        field: "created_at",
        align: "left",
        sortable: true,
      },
    ];

    const currentCenter = computed(() => {
      if (!geo.value) return [50, 30];
      return [
        parseFloat(geo.value.latitude),
        parseFloat(geo.value.longitude),
      ];
    });

    function formatDateTime(isoString) {
      if (!isoString) return "N/A";
      return date.formatDate(isoString, "YYYY-MM-DD HH:mm:ss");
    }

    async function loadGeolocation() {
      if (!selectedAgent.value || !isMounted) return;
      const currentAgentId = selectedAgent.value;

      try {
        loading.value = true;
        showFailure.value = false;
        const agentData = await fetchAgent(currentAgentId);
        if (!isMounted || selectedAgent.value !== currentAgentId) return;

        if (agentData) {
          agentHostname.value = agentData.hostname || currentAgentId;
        }

        if (agentData && agentData.last_geolocation) {
          geo.value = agentData.last_geolocation;
          showFailure.value = false;
        } else {
          geo.value = null;
          showFailure.value = true;
        }
      } catch (e) {
        console.error("Error loading geolocation:", e);
        if (isMounted) {
          geo.value = null;
          showFailure.value = true;
        }
      } finally {
        if (isMounted) loading.value = false;
      }
    }

    async function loadHistory() {
      if (!selectedAgent.value || !isMounted) return;
      const currentAgentId = selectedAgent.value;

      try {
        historyLoading.value = true;
        const data = await fetchAgentGeolocationHistory(currentAgentId, {
          days: historyDays.value,
          limit: historyLimit.value,
        });
        if (!isMounted || selectedAgent.value !== currentAgentId) return;
        history.value = data || [];
      } catch (e) {
        console.error("Error loading geolocation history:", e);
        if (isMounted) history.value = [];
      } finally {
        if (isMounted) historyLoading.value = false;
      }
    }

    async function loadAll() {
      await loadGeolocation();
      if (geo.value) {
        await loadHistory();
      }
    }

    function handleCheckAgain() {
      showFailure.value = false;
      loadAll();
    }

    async function handleStop() {
      stopLogging.value = true;
      try {
        await axios.patch("/logs/audit/", {
          action: "geolocation_check_stopped",
          message: `Administrator stopped geolocation check for device: ${agentHostname.value || selectedAgent.value}. Geolocation unavailable.`,
        });
      } catch (e) {
        console.error("Failed to write audit log:", e);
      } finally {
        stopLogging.value = false;
        showFailure.value = false;
        Notify.create({
          type: "info",
          message: `Geolocation check stopped for ${agentHostname.value}. Event logged.`,
          timeout: 3000,
        });
      }
    }

    watch(selectedAgent, (newVal) => {
      if (newVal && isMounted) {
        showFailure.value = false;
        loadAll();
      }
    });

    watch([historyDays, historyLimit], () => {
      if (selectedAgent.value && isMounted) loadHistory();
    });

    onMounted(() => {
      isMounted = true;
      if (selectedAgent.value) loadAll();
    });

    onBeforeUnmount(() => {
      isMounted = false;
    });

    return {
      selectedAgent,
      geo,
      loading,
      history,
      historyLoading,
      miniMapRef,
      markerIcon,
      historyDays,
      historyLimit,
      dayOptions,
      limitOptions,
      historyColumns,
      currentCenter,
      showFailure,
      agentHostname,
      stopLogging,
      formatDateTime,
      loadAll,
      handleCheckAgain,
      handleStop,
    };
  },
};
</script>

<style scoped>
.geo-mini-map {
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
</style>
