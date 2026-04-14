<template>
  <div class="agent-map-container">
    <div class="row items-center q-px-md q-py-sm q-gutter-sm">
      <span class="text-subtitle1 text-weight-bold">Agent Map</span>
      <q-space />

      <!-- Filter mode selector -->
      <q-btn-toggle
        v-model="filterMode"
        dense
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        :options="filterModeOptions"
        @update:model-value="onFilterModeChange"
      />

      <!-- Site/Category filter (shown in 'all' and 'site' modes) -->
      <q-select
        v-if="filterMode === 'all' || filterMode === 'site'"
        v-model="selectedSiteId"
        :options="siteOptions"
        dense
        outlined
        emit-value
        map-options
        clearable
        :label="filterMode === 'site' ? 'Site' : 'Category'"
        style="min-width: 200px"
        @update:model-value="onGroupFilterChange"
      />

      <!-- User Group filter -->
      <q-select
        v-if="filterMode === 'userGroup'"
        v-model="selectedUserGroupId"
        :options="userGroupOptions"
        dense
        outlined
        emit-value
        map-options
        clearable
        label="User Group"
        style="min-width: 200px"
        @update:model-value="onGroupFilterChange"
      />

      <!-- User filter -->
      <q-select
        v-if="filterMode === 'user'"
        v-model="selectedUserId"
        :options="userOptions"
        dense
        outlined
        emit-value
        map-options
        clearable
        label="User"
        style="min-width: 200px"
        @update:model-value="onGroupFilterChange"
      />

      <!-- Create new category -->
      <q-btn
        v-if="filterMode === 'all' || filterMode === 'site'"
        dense
        flat
        icon="add"
        label="New Category"
        no-caps
        color="primary"
        @click="showCreateSite"
      />

      <!-- Create new user group -->
      <q-btn
        v-if="filterMode === 'userGroup'"
        dense
        flat
        icon="add"
        label="New User Group"
        no-caps
        color="primary"
        @click="showCreateUserGroup"
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

    <!-- Warning banner for agents without geolocation (grouped mode) -->
    <q-banner
      v-if="!loading && agentsWithoutGeo.length > 0"
      class="bg-warning text-white q-mx-md q-mt-sm"
      rounded
      dense
    >
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      Geolocation unavailable for {{ agentsWithoutGeo.length }} device(s)
      <q-btn
        flat
        dense
        no-caps
        label="Show"
        class="q-ml-sm"
        @click="showWithoutGeoExpanded = !showWithoutGeoExpanded"
      />
      <q-btn
        flat
        dense
        no-caps
        label="Check Again"
        class="q-ml-xs"
        @click="loadData"
      />
      <q-btn
        flat
        dense
        no-caps
        label="Stop"
        class="q-ml-xs"
        @click="handleBannerStop"
        :loading="stopLogging"
      />
      <q-slide-transition>
        <div v-if="showWithoutGeoExpanded" class="q-mt-sm">
          <q-list dense dark separator class="rounded-borders" style="max-height: 150px; overflow: auto">
            <q-item v-for="agent in agentsWithoutGeo" :key="agent.agent_id" dense>
              <q-item-section>
                <q-item-label>{{ agent.hostname }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-slide-transition>
    </q-banner>

    <div v-if="loading && displayAgents.length === 0" class="flex flex-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <div
      v-else-if="!loading && displayAgents.length === 0"
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
          v-for="agent in displayAgents"
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

    <!-- Geolocation failure dialog: Check Again / Stop (legacy "all" mode) -->
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

    <!-- Create User Group dialog -->
    <q-dialog v-model="showUserGroupDialog">
      <q-card style="min-width: 400px">
        <q-bar>
          Adding User Group
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form @submit="submitCreateUserGroup">
          <q-card-section>
            <q-input
              :rules="[(val) => !!val || 'Name is required']"
              outlined
              dense
              v-model="newUserGroupName"
              label="Name"
              autofocus
            />
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="newUserGroupSites"
              :options="siteOptions"
              dense
              outlined
              emit-value
              map-options
              multiple
              clearable
              label="Sites"
              hint="Select sites to associate with this group"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn dense flat push label="Cancel" v-close-popup />
            <q-btn
              :loading="creatingUserGroup"
              dense
              flat
              push
              label="Save"
              color="primary"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { date, Notify, useQuasar } from "quasar";
import {
  fetchAgentsGeolocation,
  fetchAgents,
  fetchGeolocationBySite,
  fetchGeolocationByUserGroup,
  fetchGeolocationByUser,
} from "@/api/agents";
import { fetchSitesFlat } from "@/api/clients";
import { fetchUsers, fetchUserGroups, saveUserGroup } from "@/api/accounts";
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

const FILTER_MODES = [
  { label: "All", value: "all" },
  { label: "Site", value: "site" },
  { label: "User Group", value: "userGroup" },
  { label: "User", value: "user" },
];

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
    // All agents (including those without geo) for failure detection (legacy "all" mode)
    const allAgentsRaw = ref([]);
    const loading = ref(false);
    const mapRef = ref(null);

    // Filter mode: 'all' | 'site' | 'userGroup' | 'user'
    const filterMode = ref("all");
    const filterModeOptions = FILTER_MODES;

    // Site filter
    const sites = ref([]);
    const selectedSiteId = ref(null);

    // User Group filter
    const userGroups = ref([]);
    const selectedUserGroupId = ref(null);

    // User filter
    const users = ref([]);
    const selectedUserId = ref(null);

    // Agents without geolocation (from grouped endpoints)
    const agentsWithoutGeo = ref([]);
    const showWithoutGeoExpanded = ref(false);

    // Failure dialog (legacy "all" mode)
    const showFailureDialog = ref(false);
    const failedAgents = ref([]);
    const stopLogging = ref(false);

    // Create User Group dialog
    const showUserGroupDialog = ref(false);
    const newUserGroupName = ref("");
    const newUserGroupSites = ref([]);
    const creatingUserGroup = ref(false);

    const siteOptions = computed(() => {
      return sites.value.map((s) => ({
        label: s.name,
        value: s.id,
      }));
    });

    const userGroupOptions = computed(() => {
      return userGroups.value.map((g) => ({
        label: g.name,
        value: g.id,
      }));
    });

    const userOptions = computed(() => {
      return users.value.map((u) => ({
        label: u.username,
        value: u.id,
      }));
    });

    // In "all" mode, client-side filter by site; in grouped modes, allAgents is already filtered by API
    const displayAgents = computed(() => {
      if (filterMode.value === "all") {
        if (!selectedSiteId.value) return allAgents.value;
        return allAgents.value.filter(
          (a) => a.site === selectedSiteId.value || a.site_id === selectedSiteId.value,
        );
      }
      return allAgents.value;
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
      if (!mapRef.value || displayAgents.value.length === 0) return;
      const map = mapRef.value.leafletObject;
      if (!map) return;

      const bounds = displayAgents.value.map((a) => getLatLng(a));
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    function scheduleFitBounds() {
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

    async function loadUserGroups() {
      try {
        const data = await fetchUserGroups();
        userGroups.value = data || [];
      } catch (e) {
        console.error("Failed to load user groups:", e);
        userGroups.value = [];
        Notify.create({
          type: "negative",
          message: "Failed to load user groups.",
          timeout: 3000,
        });
      }
    }

    async function loadUsers() {
      try {
        const data = await fetchUsers();
        users.value = data || [];
      } catch (e) {
        console.error("Failed to load users:", e);
        users.value = [];
        Notify.create({
          type: "negative",
          message: "Failed to load users.",
          timeout: 3000,
        });
      }
    }

    function detectFailedAgents(geoAgents, rawAgents) {
      const geoIds = new Set(geoAgents.map((a) => a.agent_id));

      let targetAgents = rawAgents;
      if (selectedSiteId.value) {
        targetAgents = rawAgents.filter(
          (a) => a.site === selectedSiteId.value || a.site_id === selectedSiteId.value,
        );
      }

      return targetAgents.filter((a) => !geoIds.has(a.agent_id));
    }

    async function loadDataAll() {
      const [geoData, rawData] = await Promise.all([
        fetchAgentsGeolocation(),
        fetchAgents({ detail: false }),
      ]);

      allAgents.value = geoData || [];
      allAgentsRaw.value = rawData || [];
      agentsWithoutGeo.value = [];

      const failed = detectFailedAgents(allAgents.value, allAgentsRaw.value);
      if (failed.length > 0) {
        failedAgents.value = failed;
        showFailureDialog.value = true;
      }
    }

    async function loadDataGrouped(fetchFn, id) {
      if (!id) {
        allAgents.value = [];
        agentsWithoutGeo.value = [];
        return;
      }
      const response = await fetchFn(id);
      allAgents.value = response.agents_with_geolocation || [];
      agentsWithoutGeo.value = response.agents_without_geolocation || [];
    }

    async function loadData() {
      loading.value = true;
      agentsWithoutGeo.value = [];
      showWithoutGeoExpanded.value = false;
      try {
        if (filterMode.value === "all") {
          await loadDataAll();
        } else if (filterMode.value === "site") {
          await loadDataGrouped(fetchGeolocationBySite, selectedSiteId.value);
        } else if (filterMode.value === "userGroup") {
          await loadDataGrouped(fetchGeolocationByUserGroup, selectedUserGroupId.value);
        } else if (filterMode.value === "user") {
          await loadDataGrouped(fetchGeolocationByUser, selectedUserId.value);
        }

        await nextTick();
        setTimeout(fitBounds, 300);
      } catch (e) {
        console.error("Failed to load agents geolocation:", e);
      } finally {
        loading.value = false;
      }
    }

    function onFilterModeChange() {
      // Reset selections when switching modes
      selectedSiteId.value = null;
      selectedUserGroupId.value = null;
      selectedUserId.value = null;
      agentsWithoutGeo.value = [];
      showWithoutGeoExpanded.value = false;
      allAgents.value = [];

      if (filterMode.value === "all") {
        loadData();
      } else if (filterMode.value === "userGroup" && userGroups.value.length === 0) {
        loadUserGroups();
      } else if (filterMode.value === "user" && users.value.length === 0) {
        loadUsers();
      }
      // For grouped modes, data loads when user selects an item from dropdown
    }

    function onGroupFilterChange() {
      loadData();
    }

    function handleCheckAgain() {
      showFailureDialog.value = false;
      loadData();
    }

    async function handleStop() {
      stopLogging.value = true;
      try {
        const failedHostnames = failedAgents.value.map((a) => a.hostname);
        await axios.patch("/logs/audit/", {
          action: "geolocation_check_stopped",
          message: `Administrator stopped geolocation check. ${failedAgents.value.length} device(s) without geolocation: ${failedHostnames.join(", ")}`,
        });
      } catch (e) {
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

    async function handleBannerStop() {
      stopLogging.value = true;
      try {
        const failedHostnames = agentsWithoutGeo.value.map((a) => a.hostname);
        await axios.patch("/logs/audit/", {
          action: "geolocation_check_stopped",
          message: `Administrator stopped geolocation check. ${agentsWithoutGeo.value.length} device(s) without geolocation: ${failedHostnames.join(", ")}`,
        });
      } catch (e) {
        console.error("Failed to write audit log:", e);
      } finally {
        stopLogging.value = false;
        agentsWithoutGeo.value = [];
        showWithoutGeoExpanded.value = false;
        Notify.create({
          type: "info",
          message: "Geolocation check stopped. Devices without geolocation logged.",
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

    async function showCreateUserGroup() {
      newUserGroupName.value = "";
      newUserGroupSites.value = [];
      showUserGroupDialog.value = true;
    }

    async function submitCreateUserGroup() {
      creatingUserGroup.value = true;
      try {
        const group = await saveUserGroup({
          name: newUserGroupName.value,
          sites: newUserGroupSites.value,
        });
        showUserGroupDialog.value = false;
        await loadUserGroups();

        Notify.create({
          type: "positive",
          message: "User group created.",
          timeout: 3000,
        });

        // Auto-select the new group and load its geolocation
        selectedUserGroupId.value = group.id;
        try {
          await loadData();
        } catch (e) {
          Notify.create({
            type: "warning",
            message: "User group created, but geolocation is unavailable.",
            timeout: 4000,
          });
        }
      } catch (e) {
        console.error("Failed to create user group:", e);
        Notify.create({
          type: "negative",
          message: "Failed to create user group.",
          timeout: 3000,
        });
      } finally {
        creatingUserGroup.value = false;
      }
    }

    function onMapReady() {
      setTimeout(fitBounds, 300);
    }

    watch(displayAgents, () => {
      scheduleFitBounds();
    });

    onMounted(() => {
      loadSites();
      loadData();
    });

    return {
      allAgents,
      displayAgents,
      loading,
      mapRef,
      filterMode,
      filterModeOptions,
      sites,
      siteOptions,
      selectedSiteId,
      userGroups,
      userGroupOptions,
      selectedUserGroupId,
      users,
      userOptions,
      selectedUserId,
      agentsWithoutGeo,
      showWithoutGeoExpanded,
      showFailureDialog,
      failedAgents,
      stopLogging,
      showUserGroupDialog,
      newUserGroupName,
      newUserGroupSites,
      creatingUserGroup,
      getLatLng,
      getMarkerIcon,
      platformLabel,
      formatDateTime,
      loadData,
      onFilterModeChange,
      onGroupFilterChange,
      handleCheckAgain,
      handleStop,
      handleBannerStop,
      showCreateSite,
      showCreateUserGroup,
      submitCreateUserGroup,
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
