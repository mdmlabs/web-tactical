<template>
  <div class="device-map-wrapper">
    <div ref="mapContainer" class="device-map" />
    <div v-if="props.locations.length === 0" class="device-map-empty">
      <q-icon name="location_off" size="48px" color="grey-5" />
      <div class="text-grey-6 q-mt-sm">{{ $t('devicemanagement.components.DeviceMap.5bf26e') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { Map as LeafletMap, Marker, TileLayer } from "leaflet";
import { getTileConfig, pinIcon } from "@/utils/map-tiles";
import { useI18n } from "vue-i18n";

interface LocationEntry {
  agent_id: string;
  latitude: number | string;
  longitude: number | string;
  accuracy?: number;
  source?: string;
  recorded_at?: string;
}

const props = defineProps<{ locations: LocationEntry[] }>();

const mapContainer = ref<HTMLElement | null>(null);
let map: LeafletMap | null = null;
let tileLayer: TileLayer | null = null;
const { locale } = useI18n();
const markers = ref<Marker[]>([]);

async function initMap() {
  if (!mapContainer.value || map) return;

  // Dynamic import so Leaflet CSS is only loaded when map is used
  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");

  // Fix default marker icon path (Webpack/Vite issue with Leaflet)
  // @ts-expect-error Leaflet typings hide the private icon URL hook.
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });

  map = L.map(mapContainer.value, {
    center: [20, 0],
    zoom: 2,
    scrollWheelZoom: true,
    attributionControl: false,
  });

  const _tile = getTileConfig();
  tileLayer = L.tileLayer(_tile.url, {
    subdomains: _tile.subdomains,
    attribution: "",
    maxZoom: _tile.maxZoom,
  }).addTo(map);

  updateMarkers();
}

async function updateMarkers() {
  if (!map) return;
  const L = await import("leaflet");

  // Remove old markers
  markers.value.forEach((m) => m.remove());
  markers.value = [];

  const validLocations = props.locations.filter((loc) => {
    const lat = parseFloat(String(loc.latitude));
    const lng = parseFloat(String(loc.longitude));
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  });

  if (validLocations.length === 0) return;

  const latLngs: [number, number][] = [];

  for (const loc of validLocations) {
    const lat = parseFloat(String(loc.latitude));
    const lng = parseFloat(String(loc.longitude));
    latLngs.push([lat, lng]);

    const popupContent = `
      <div style="min-width:180px">
        <strong>${loc.agent_id}</strong><br/>
        <span style="color:#666">Lat:</span> ${lat.toFixed(6)}<br/>
        <span style="color:#666">Lon:</span> ${lng.toFixed(6)}<br/>
        ${loc.accuracy ? `<span style="color:#666">Accuracy:</span> ±${loc.accuracy}m<br/>` : ""}
        ${loc.source ? `<span style="color:#666">Source:</span> ${loc.source}<br/>` : ""}
        ${
          loc.recorded_at
            ? `<span style="color:#666">Updated:</span> ${new Date(loc.recorded_at).toLocaleString()}`
            : ""
        }
      </div>
    `;

    const marker = L.marker([lat, lng], { icon: pinIcon(L) })
      .addTo(map!)
      .bindPopup(popupContent);

    markers.value.push(marker);
  }

  // Fit map to show all markers
  if (latLngs.length === 1) {
    map.setView(latLngs[0], 12);
  } else if (latLngs.length > 1) {
    map.fitBounds(L.latLngBounds(latLngs), { padding: [20, 20] });
  }
}

onMounted(async () => {
  await nextTick();
  await initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

watch(
  () => props.locations,
  async () => {
    if (!map) {
      await initMap();
    } else {
      await updateMarkers();
    }
  },
  { deep: true }
);

// Swap tile layer when the UI language changes.
watch(locale, async () => {
  if (!map || !tileLayer) return;
  const L = await import("leaflet");
  tileLayer.remove();
  const _tile = getTileConfig();
  tileLayer = L.tileLayer(_tile.url, {
    subdomains: _tile.subdomains,
    attribution: "",
    maxZoom: _tile.maxZoom,
  }).addTo(map);
});
</script>

<style scoped>
.device-map-wrapper {
  position: relative;
  width: 100%;
  height: 480px;
}
.device-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 0;
}
.device-map-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  pointer-events: none;
}
</style>
