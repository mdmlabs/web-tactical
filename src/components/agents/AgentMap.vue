<template>
  <div class="agent-map-container">
    <div class="row items-center q-px-md q-py-sm q-gutter-sm">
      <span class="text-subtitle1 text-weight-bold">Agent Map</span>
      <q-space />

      <!-- Site/Category filter -->
      <q-select
        v-model="selectedSiteId"
        :options="siteOptions"
        dense
        outlined
        emit-value
        map-options
        clearable
        label="Category"
        style="min-width: 200px"
        @update:model-value="applyFilter"
      />

      <!-- Create new category -->
      <q-btn
        dense
        flat
        icon="add"
        label="New Category"
        no-caps
        color="primary"
        @click="showCreateSite"
      />

      <q-btn
        dense
        flat
        icon="refresh"
        label="Refresh"
        no-caps
        color="primary"
        :loading="loading"
        @click="loadData"
      />
    </div>
    <q-separator />

    <div v-if="loading && allAgents.length === 0" class="flex flex-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <div
      v-else-if="!loading && filteredAgents.length === 0"
      class="flex flex-center q-pa-xl text-grey-6"
    >
      <div class="text-center">
        <q-icon name="mdi-map-marker-off" size="3em" class="q-mb-sm" />
        <div>No agents with geolocation data</div>
      </div>
    </div>

    <div v-else class="map-wrapper">
      <l-map
        ref="mapRef"
        :zoom="4"
        :center="[50, 30]"
        :use-global-leaflet="false"
        style="height: 100%; width: 100%"
        @ready="onMapReady"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          layer-type="base"
          name="OpenStreetMap"
        />
        <l-marker
          v-for="agent in filteredAgents"
          :key="agent.agent_id"
          :lat-lng="getLatLng(agent)"
        >
          <l-icon
            :icon-url="getMarkerIcon(agent.status)"
            :icon-size="[25, 41]"
            :icon-anchor="[12, 41]"
            :popup-anchor="[1, -34]"
          />
          <l-popup :options="{ maxWidth: 300 }">
            <div class="agent-popup">
              <div class="text-weight-bold q-mb-xs">{{ agent.hostname }}</div>
              <div class="q-mb-xs">
                <span class="popup-label">Platform:</span>
                {{ platformLabel(agent.plat) }}
              </div>
              <div class="q-mb-xs">
                <span class="popup-label">Type:</span>
                {{ agent.monitoring_type }}
              </div>
              <div class="q-mb-xs">
                <span class="popup-label">Status:</span>
                <span
                  :style="{ color: agent.status === 'online' ? '#059669' : '#ef4444' }"
                >
                  {{ agent.status }}
                </span>
              </div>
              <div class="q-mb-xs">
                <span class="popup-label">Source:</span>
                {{ agent.last_geolocation.source }}
              </div>
              <div class="q-mb-xs">
                <span class="popup-label">Coords:</span>
                {{ agent.last_geolocation.latitude }},
                {{ agent.last_geolocation.longitude }}
              </div>
              <div class="q-mb-sm">
                <span class="popup-label">Updated:</span>
                {{ formatDateTime(agent.last_geolocation.created_at) }}
              </div>
              <a
                :href="`/#/agents/${agent.agent_id}`"
                class="popup-link"
              >
                View Agent Details
              </a>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- Geolocation failure dialog: Check Again / Stop -->
    <q-dialog v-model="showFailureDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="2em" class="q-mr-sm" />
          <span class="text-h6">Geolocation Unavailable</span>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-sm">
            Geolocation data could not be retrieved for the following
            {{ failedAgents.length }} device(s):
          </div>
          <q-list dense bordered separator class="rounded-borders" style="max-height: 200px; overflow: auto">
            <q-item v-for="agent in failedAgents" :key="agent.agent_id">
              <q-item-section avatar>
                <q-icon
                  :name="agent.status === 'online' ? 'wifi' : 'wifi_off'"
                  :color="agent.status === 'online' ? 'positive' : 'grey'"
                  size="sm"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ agent.hostname }}</q-item-label>
                <q-item-label caption>
                  {{ agent.site_name || '' }} | {{ agent.status }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Stop"
            color="negative"
            no-caps
            @click="handleStop"
            :loading="stopLogging"
          />
          <q-btn
            flat
            label="Check Again"
            color="primary"
            no-caps
            @click="handleCheckAgain"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { date, Notify, useQuasar } from "quasar";
import { fetchAgentsGeolocation, fetchAgents } from "@/api/agents";
import { fetchSitesFlat } from "@/api/clients";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import SitesForm from "@/components/clients/SitesForm.vue";

const MARKER_GREEN =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41"><path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#059669"/><circle cx="12.5" cy="12.5" r="6" fill="#fff"/></svg>',
  );

const MARKER_RED =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41"><path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#ef4444"/><circle cx="12.5" cy="12.5" r="6" fill="#fff"/></svg>',
  );

export default {
  name: "AgentMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
  },
  setup() {
    const $q = useQuasar();

    // All agents with geo data from API
    const allAgents = ref([]);
    // All agents (including those without geo) for failure detection
    const allAgentsRaw = ref([]);
    const loading = ref(false);
    const mapRef = ref(null);

    // Site filter
    const sites = ref([]);
    const selectedSiteId = ref(null);

    // Failure dialog
    const showFailureDialog = ref(false);
    const failedAgents = ref([]);
    const stopLogging = ref(false);

    const siteOptions = computed(() => {
      return sites.value.map((s) => ({
        label: s.name,
        value: s.id,
      }));
    });

    const filteredAgents = computed(() => {
      if (!selectedSiteId.value) return allAgents.value;
      return allAgents.value.filter(
        (a) => a.site === selectedSiteId.value || a.site_id === selectedSiteId.value,
      );
    });

    function getLatLng(agent) {
      return [
        parseFloat(agent.last_geolocation.latitude),
        parseFloat(agent.last_geolocation.longitude),
      ];
    }

    function getMarkerIcon(status) {
      return status === "online" ? MARKER_GREEN : MARKER_RED;
    }

    function platformLabel(plat) {
      const labels = { windows: "Windows", linux: "Linux", darwin: "macOS" };
      return labels[plat] || plat;
    }

    function formatDateTime(isoString) {
      if (!isoString) return "N/A";
      return date.formatDate(isoString, "YYYY-MM-DD HH:mm:ss");
    }

    function fitBounds() {
      if (!mapRef.value || filteredAgents.value.length === 0) return;
      const map = mapRef.value.leafletObject;
      if (!map) return;

      const bounds = filteredAgents.value.map((a) => getLatLng(a));
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    function applyFilter() {
      nextTick(() => setTimeout(fitBounds, 300));
    }

    async function loadSites() {
      try {
        const data = await fetchSitesFlat();
        sites.value = data || [];
      } catch (e) {
        console.error("Failed to load sites:", e);
      }
    }

    function detectFailedAgents(geoAgents, rawAgents) {
      const geoIds = new Set(geoAgents.map((a) => a.agent_id));

      // Agents that exist but have no geolocation data
      let targetAgents = rawAgents;
      if (selectedSiteId.value) {
        targetAgents = rawAgents.filter(
          (a) => a.site === selectedSiteId.value || a.site_id === selectedSiteId.value,
        );
      }

      return targetAgents.filter((a) => !geoIds.has(a.agent_id));
    }

    async function loadData() {
      loading.value = true;
      try {
        const [geoData, rawData] = await Promise.all([
          fetchAgentsGeolocation(),
          fetchAgents({ detail: false }),
        ]);

        allAgents.value = geoData || [];
        allAgentsRaw.value = rawData || [];

        const failed = detectFailedAgents(allAgents.value, allAgentsRaw.value);
        if (failed.length > 0) {
          failedAgents.value = failed;
          showFailureDialog.value = true;
        }

        await nextTick();
        setTimeout(fitBounds, 300);
      } catch (e) {
        console.error("Failed to load agents geolocation:", e);
      } finally {
        loading.value = false;
      }
    }

    function handleCheckAgain() {
      showFailureDialog.value = false;
      loadData();
    }

    async function handleStop() {
      stopLogging.value = true;
      try {
        const failedHostnames = failedAgents.value.map((a) => a.hostname);
        await axios.post("/logs/audit/", {
          action: "geolocation_check_stopped",
          message: `Administrator stopped geolocation check. ${failedAgents.value.length} device(s) without geolocation: ${failedHostnames.join(", ")}`,
        });
      } catch (e) {
        // Audit log is best-effort; don't block the user
        console.error("Failed to write audit log:", e);
      } finally {
        stopLogging.value = false;
        showFailureDialog.value = false;
        Notify.create({
          type: "info",
          message: `Geolocation check stopped. ${failedAgents.value.length} device(s) logged as unavailable.`,
          timeout: 3000,
        });
      }
    }

    function showCreateSite() {
      $q.dialog({
        component: SitesForm,
      }).onOk(() => {
        loadSites();
        Notify.create({
          type: "positive",
          message: "Category created. Select it from the filter to view its agents.",
          timeout: 3000,
        });
      });
    }

    function onMapReady() {
      setTimeout(fitBounds, 300);
    }

    watch(filteredAgents, () => {
      nextTick(() => setTimeout(fitBounds, 300));
    });

    onMounted(() => {
      loadSites();
      loadData();
    });

    return {
      allAgents,
      filteredAgents,
      loading,
      mapRef,
      sites,
      siteOptions,
      selectedSiteId,
      showFailureDialog,
      failedAgents,
      stopLogging,
      getLatLng,
      getMarkerIcon,
      platformLabel,
      formatDateTime,
      loadData,
      applyFilter,
      handleCheckAgain,
      handleStop,
      showCreateSite,
      onMapReady,
    };
  },
};
</script>

<style scoped>
.agent-map-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-wrapper {
  flex: 1;
  min-height: 400px;
}

.agent-popup {
  font-size: 13px;
  line-height: 1.5;
}

.popup-label {
  font-weight: 600;
  color: #666;
}

.popup-link {
  color: #1089d3;
  text-decoration: none;
  font-weight: 600;
}

.popup-link:hover {
  text-decoration: underline;
}
</style>
