<template>
  <div ref="mapEl" style="width:100%; height:100%" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getTileConfig, pinIcon } from "@/utils/map-tiles";

const props = defineProps<{
  zones: any[];
  deviceLocations?: any[];
  selectedZone?: any;
}>();

const emit = defineEmits<{
  (e: "zone-click", zone: any): void;
  (e: "map-click", lat: number, lon: number): void;
}>();

const mapEl = ref<HTMLElement | null>(null);
let map: any = null;
let circles: any[] = [];
let markers: any[] = [];

async function initMap() {
  if (!mapEl.value) return;
  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");

  map = L.map(mapEl.value, { attributionControl: false }).setView([55.75, 37.62], 5);
  const _tile = getTileConfig();
  let tileLayer = L.tileLayer(_tile.url, {
    subdomains: _tile.subdomains,
    attribution: "",
    maxZoom: _tile.maxZoom,
  }).addTo(map);
  const { locale } = useI18n();
  watch(locale, () => {
    tileLayer.remove();
    const t = getTileConfig();
    tileLayer = L.tileLayer(t.url, {
      subdomains: t.subdomains,
      attribution: "",
      maxZoom: t.maxZoom,
    }).addTo(map);
  });

  // Click to create new zone
  map.on("click", (e: any) => {
    emit("map-click", e.latlng.lat, e.latlng.lng);
  });

  renderMapData(L);
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadius = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderZones(L: any) {
  circles.forEach((c) => c.remove());
  circles = [];
  for (const zone of props.zones) {
    const color = zone.enabled ? "#1976D2" : "#9E9E9E";
    const circle = L.circle([zone.center_lat, zone.center_lon], {
      color,
      fillColor: color,
      fillOpacity: 0.15,
      radius: zone.radius_meters,
    })
      .addTo(map)
      .bindPopup(`<b>${zone.name}</b><br>Radius: ${zone.radius_meters}m`);
    circle.on("click", () => emit("zone-click", zone));
    circles.push(circle);
  }
}

function renderDeviceLocations(L: any) {
  markers.forEach((marker) => marker.remove());
  markers = [];

  const validLocations = (props.deviceLocations || []).filter((location) => {
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0;
  });

  for (const location of validLocations) {
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);
    const selectedZone = props.selectedZone;
    const isInsideSelectedZone = Boolean(
      selectedZone &&
      haversineMeters(lat, lon, selectedZone.center_lat, selectedZone.center_lon) <= selectedZone.radius_meters
    );

    const marker = L.marker([lat, lon], { icon: pinIcon(L) }).addTo(map);
    marker.bindPopup(
      [
        `<b>${location.agent_id || "Unknown device"}</b>`,
        `Lat: ${lat.toFixed(6)}`,
        `Lon: ${lon.toFixed(6)}`,
        location.accuracy ? `Accuracy: +/- ${Number(location.accuracy).toFixed(0)} m` : "",
        location.recorded_at ? `Updated: ${new Date(location.recorded_at).toLocaleString()}` : "",
        isInsideSelectedZone ? `<span style="color:#2E7D32"><b>Inside selected zone</b></span>` : "",
      ].filter(Boolean).join("<br>")
    );
    markers.push(marker);
  }
}

function fitMapToData(L: any) {
  if (!map) return;

  const points: [number, number][] = [];

  for (const zone of props.zones) {
    if (Number.isFinite(Number(zone.center_lat)) && Number.isFinite(Number(zone.center_lon))) {
      points.push([Number(zone.center_lat), Number(zone.center_lon)]);
    }
  }

  for (const location of props.deviceLocations || []) {
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
      points.push([lat, lon]);
    }
  }

  if (points.length === 1) {
    map.setView(points[0], 12);
    return;
  }

  if (points.length > 1) {
    map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
  }
}

function renderMapData(L: any) {
  renderZones(L);
  renderDeviceLocations(L);
  fitMapToData(L);
}

onMounted(initMap);
onUnmounted(() => { if (map) { map.remove(); map = null; } });

watch(
  () => [props.zones, props.deviceLocations, props.selectedZone],
  async () => {
    if (!map) return;
    const L = await import("leaflet");
    renderMapData(L);
  },
  { deep: true }
);
</script>
