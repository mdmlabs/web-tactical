<!--
  Phase-3.c — WorkspaceGeofenceEditor.vue

  Interactive Leaflet polygon editor for the
  ``OrganizationWorkspace.geofence_polygons`` field. Operators draw one or
  more named polygons on a map; each polygon is stored as
  ``{name, polygon: [[lat, lng], ...]}`` matching the backend schema in
  ``appmanagement/geofence.py``.

  v-model contract:
  ----------------
    v-model="value"   → array of {name, polygon} objects (geofence_polygons)
    enforcement       → "off" | "audit" | "enforce"  (geofence_enforcement)

  The component emits ``update:modelValue`` with the new polygon list when
  the user finalises a draw or deletes a polygon. ``enforcement`` is shown
  as a select right above the map for convenience but emitted via
  ``update:enforcement``.
-->
<template>
  <div class="workspace-geofence-editor">
    <div class="row q-gutter-md items-end q-mb-sm">
      <q-select
        :model-value="enforcement"
        :options="enforcementOptions"
        emit-value map-options outlined dense
        label="Geofence enforcement"
        style="min-width: 220px"
        @update:model-value="$emit('update:enforcement', $event)"
        :hint="enforcementHint" />
      <q-input
        v-model="newPolyName"
        outlined dense label="New polygon name"
        :hint="`Press 'Start polygon' then click on the map to add vertices.`"
        style="min-width: 240px" />
      <q-btn
        :disable="drawing || !newPolyName.trim()"
        color="primary" icon="edit" label="Start polygon"
        @click="startDrawing" />
      <q-btn
        v-if="drawing"
        color="positive" icon="check"
        :label="`Finish (${currentVertices.length} pts)`"
        :disable="currentVertices.length < 3"
        @click="finishDrawing" />
      <q-btn
        v-if="drawing"
        flat color="negative" icon="close" label="Cancel"
        @click="cancelDrawing" />
    </div>

    <div class="text-caption text-grey-7 q-mb-xs">
      Click on the map to place vertices for the active polygon.
      Existing polygons are listed below — click <q-icon name="delete" /> to remove.
    </div>

    <div ref="mapContainer" class="geofence-map" />

    <q-list v-if="value.length" bordered dense class="q-mt-sm">
      <q-item v-for="(p, i) in value" :key="i" class="q-px-sm">
        <q-item-section>
          <q-item-label>{{ p.name || `Polygon ${i + 1}` }}</q-item-label>
          <q-item-label caption>
            {{ (p.polygon || []).length }} vertices
            · centroid {{ centroidStr(p.polygon || []) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round dense icon="delete" color="negative" @click="removePolygon(i)" />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="text-caption text-grey-6 q-mt-sm">
      No polygons configured — geofence is "allow anywhere" regardless of
      enforcement mode.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import type {
  Map as LeafletMap, Polygon as LeafletPolygon, Polyline as LeafletPolyline,
  CircleMarker, LatLngTuple, TileLayer,
} from "leaflet";

interface PolygonEntry {
  name: string;
  polygon: [number, number][]; // [[lat, lng], ...]
}

const props = defineProps<{
  modelValue: PolygonEntry[];
  enforcement: "off" | "audit" | "enforce";
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: PolygonEntry[]): void;
  (e: "update:enforcement", value: "off" | "audit" | "enforce"): void;
}>();

// Local mirror so we can render without depending on parent reactivity loops.
const value = computed<PolygonEntry[]>(() => Array.isArray(props.modelValue) ? props.modelValue : []);

const enforcementOptions = [
  { label: "Off — no geofence check", value: "off" },
  { label: "Audit — log violations only", value: "audit" },
  { label: "Enforce — refuse mount when outside", value: "enforce" },
];
const enforcementHint = computed(() => {
  switch (props.enforcement) {
    case "off":     return "Mounts are allowed anywhere.";
    case "audit":   return "Mounts are allowed; outside-fence attempts are logged.";
    case "enforce": return "Mounts outside the fence are refused (fail-closed when location unknown).";
  }
  return "";
});

const mapContainer = ref<HTMLElement | null>(null);
let map: LeafletMap | null = null;
let tileLayer: TileLayer | null = null;
let savedLayers: LeafletPolygon[] = [];
let liveLine: LeafletPolyline | null = null;
let liveDots: CircleMarker[] = [];
let L: any = null;
let resizeObserver: ResizeObserver | null = null;

const drawing = ref(false);
const newPolyName = ref("");
const currentVertices = ref<LatLngTuple[]>([]);

onMounted(async () => {
  if (!mapContainer.value) return;
  L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");

  map = L.map(mapContainer.value, {
    center: [55.751244, 37.618423],   // Moscow default
    zoom: 11,
    zoomControl: true,
    attributionControl: false,
  });
  tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  });
  tileLayer.addTo(map);

  resizeObserver = new ResizeObserver(() => invalidateMapSize());
  resizeObserver.observe(mapContainer.value);
  invalidateMapSize();
  invalidateMapSize(150);
  invalidateMapSize(400);

  redrawSaved();
  if (value.value.length) fitToPolygons();

  map.on("click", (ev: any) => {
    if (!drawing.value || !map) return;
    const ll: LatLngTuple = [ev.latlng.lat, ev.latlng.lng];
    currentVertices.value = [...currentVertices.value, ll];
    refreshLiveLayers();
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map) { map.remove(); map = null; }
});

watch(() => props.modelValue, () => {
  redrawSaved();
  if (!drawing.value && value.value.length) fitToPolygons();
  invalidateMapSize();
}, { deep: true });

function invalidateMapSize(delayMs = 0) {
  const run = () => {
    nextTick(() => {
      requestAnimationFrame(() => {
        if (!map) return;
        map.invalidateSize({ pan: false });
      });
    });
  };
  if (delayMs > 0) window.setTimeout(run, delayMs);
  else run();
}

async function redrawSaved() {
  if (!map || !L) return;
  for (const layer of savedLayers) layer.remove();
  savedLayers = [];
  for (const entry of value.value) {
    if (!entry?.polygon || entry.polygon.length < 3) continue;
    const poly = L.polygon(entry.polygon as any, {
      color: "#1976d2",
      weight: 2,
      fillOpacity: 0.15,
    }).addTo(map);
    poly.bindTooltip(entry.name || "polygon");
    savedLayers.push(poly);
  }
}

async function refreshLiveLayers() {
  if (!map || !L) return;
  if (liveLine) { liveLine.remove(); liveLine = null; }
  for (const d of liveDots) d.remove();
  liveDots = [];
  if (currentVertices.value.length === 0) return;
  liveLine = L.polyline(currentVertices.value as any, {
    color: "#d32f2f", weight: 2, dashArray: "4,4",
  }).addTo(map);
  for (const v of currentVertices.value) {
    const d = L.circleMarker(v as any, {
      radius: 4, color: "#d32f2f", fillColor: "#d32f2f", fillOpacity: 1,
    }).addTo(map);
    liveDots.push(d);
  }
}

function startDrawing() {
  if (!newPolyName.value.trim()) return;
  drawing.value = true;
  currentVertices.value = [];
  invalidateMapSize();
  refreshLiveLayers();
}

async function finishDrawing() {
  if (currentVertices.value.length < 3) return;
  const next = [...value.value, {
    name: newPolyName.value.trim(),
    polygon: currentVertices.value.slice() as [number, number][],
  }];
  emit("update:modelValue", next);
  drawing.value = false;
  currentVertices.value = [];
  newPolyName.value = "";
  await refreshLiveLayers();
  await redrawSaved();
}

async function cancelDrawing() {
  drawing.value = false;
  currentVertices.value = [];
  await refreshLiveLayers();
}

function removePolygon(idx: number) {
  const next = value.value.slice();
  next.splice(idx, 1);
  emit("update:modelValue", next);
}

function fitToPolygons() {
  if (!map || !L) return;
  const all: LatLngTuple[] = [];
  for (const p of value.value) for (const v of p.polygon || []) all.push([v[0], v[1]]);
  if (all.length === 0) return;
  const bounds = L.latLngBounds(all);
  if (bounds && map.fitBounds) map.fitBounds(bounds, { padding: [16, 16] });
  invalidateMapSize();
}

function centroidStr(poly: number[][]): string {
  if (!poly?.length) return "—";
  let lat = 0, lng = 0;
  for (const v of poly) { lat += v[0]; lng += v[1]; }
  lat /= poly.length; lng /= poly.length;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
</script>

<style scoped>
.workspace-geofence-editor {
  min-width: 0;
}

.geofence-map {
  height: min(48vh, 420px);
  min-height: 360px;
  width: 100%;
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #eef1f4;
  overflow: hidden;
}
</style>
