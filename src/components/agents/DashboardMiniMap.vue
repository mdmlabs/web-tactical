<template>
  <q-card
    flat
    bordered
    class="dashboard-mini-map cursor-pointer"
    @click="$router.push({ name: 'AgentMap' })"
  >
    <q-card-section class="q-py-sm q-px-md">
      <div class="row items-center no-wrap">
        <div class="text-subtitle1 text-weight-bold col">Agent Locations</div>
        <q-icon name="mdi-map-marker-radius" size="1.2em" color="grey-5" />
      </div>
    </q-card-section>
    <div class="mini-map-body">
      <div
        v-if="loading && agents.length === 0"
        class="flex flex-center"
        style="height: 100%"
      >
        <q-spinner size="30px" color="primary" />
      </div>
      <div
        v-else-if="agents.length === 0"
        class="flex flex-center text-grey-5"
        style="height: 100%"
      >
        <div class="text-center">
          <q-icon name="mdi-map-marker-off" size="2.5em" />
          <div class="text-caption q-mt-xs">No geolocation data</div>
        </div>
      </div>
      <l-map
        v-else
        ref="mapRef"
        :zoom="3"
        :center="[50, 30]"
        :use-global-leaflet="false"
        :zoom-control="false"
        :dragging="false"
        :scroll-wheel-zoom="false"
        :double-click-zoom="false"
        :touch-zoom="false"
        :box-zoom="false"
        :keyboard="false"
        :attribution-control="false"
        style="height: 100%; width: 100%"
        @ready="onMapReady"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        />
        <l-circle-marker
          v-for="agent in agents"
          :key="agent.agent_id"
          :lat-lng="getLatLng(agent)"
          :radius="7"
          :color="agent.status === 'online' ? '#059669' : '#ef4444'"
          :fill-color="agent.status === 'online' ? '#059669' : '#ef4444'"
          :fill-opacity="0.8"
          :weight="2"
        />
      </l-map>
      <!-- legend -->
      <div v-if="agents.length > 0" class="map-legend">
        <span class="legend-item">
          <span class="legend-dot legend-dot--online"></span> Online
        </span>
        <span class="legend-item q-ml-md">
          <span class="legend-dot legend-dot--offline"></span> Offline
        </span>
      </div>
    </div>
  </q-card>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { fetchAgentsGeolocation } from "@/api/agents";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LCircleMarker,
} from "@vue-leaflet/vue-leaflet";

export default {
  name: "DashboardMiniMap",
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
  },
  setup() {
    const agents = ref([]);
    const loading = ref(false);
    const mapRef = ref(null);

    function getLatLng(agent) {
      return [
        parseFloat(agent.last_geolocation.latitude),
        parseFloat(agent.last_geolocation.longitude),
      ];
    }

    function fitBounds() {
      if (!mapRef.value || agents.value.length === 0) return;
      const map = mapRef.value.leafletObject;
      if (!map) return;

      const bounds = agents.value.map((a) => getLatLng(a));
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
      }
    }

    async function loadData() {
      loading.value = true;
      try {
        const data = await fetchAgentsGeolocation();
        agents.value = data || [];
        await nextTick();
        setTimeout(fitBounds, 300);
      } catch (e) {
        console.error("Failed to load agents geolocation:", e);
      } finally {
        loading.value = false;
      }
    }

    function onMapReady() {
      setTimeout(fitBounds, 300);
    }

    onMounted(() => {
      loadData();
    });

    return {
      agents,
      loading,
      mapRef,
      getLatLng,
      onMapReady,
    };
  },
};
</script>

<style scoped>
.dashboard-mini-map {
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-mini-map:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.mini-map-body {
  flex: 1;
  min-height: 60px;
  position: relative;
}

.map-legend {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.legend-item {
  display: inline-flex;
  align-items: center;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.legend-dot--online {
  background: #059669;
}

.legend-dot--offline {
  background: #ef4444;
}
</style>
