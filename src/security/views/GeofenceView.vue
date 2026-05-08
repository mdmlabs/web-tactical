<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('security.views.GeofenceView.ac206e') }}</div>
    <div class="text-caption text-grey q-mb-md">
      {{ $t('security.views.GeofenceView.de024c') }}
    </div>

    <div class="row q-gutter-md">
      <!-- Zone list -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2">Zones ({{ zones.length }})</div>
              <q-space />
              <q-btn color="primary" icon="add" round dense size="sm" @click="showCreateDialog" />
            </div>
            <q-list separator>
              <q-item
                v-for="zone in zones"
                :key="zone.id"
                clickable
                :active="selectedZone?.id === zone.id"
                active-class="bg-primary-1"
                @click="selectZone(zone)"
              >
                <q-item-section avatar>
                  <q-icon :name="zone.enabled ? 'location_on' : 'location_off'"
                    :color="zone.enabled ? 'primary' : 'grey'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ zone.name }}</q-item-label>
                  <q-item-label caption>
                    r={{ zone.radius_meters }}m ·
                    <span v-if="zone.disable_camera">📷</span>
                    <span v-if="zone.disable_mic">🎤</span>
                    <span v-if="zone.disable_usb">💾</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="delete" size="xs" color="negative"
                    @click.stop="deleteZone(zone.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="zones.length === 0">
                <q-item-section class="text-grey text-center">{{ $t('security.views.GeofenceView.601a2e') }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Zone details -->
        <q-card flat bordered class="q-mt-md" v-if="selectedZone">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ selectedZone.name }}</div>
            <q-list dense>
              <q-item>
                <q-item-section>{{ $t('security.views.GeofenceView.a23911') }}</q-item-section>
                <q-item-section side>{{ selectedZone.center_lat.toFixed(4) }}, {{ selectedZone.center_lon.toFixed(4) }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ $t('security.views.GeofenceView.e5aaea') }}</q-item-section>
                <q-item-section side>{{ selectedZone.radius_meters }}m</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ $t('security.views.GeofenceView.2c50b0') }}</q-item-section>
                <q-item-section side><q-icon :name="selectedZone.disable_camera ? 'check' : 'close'" :color="selectedZone.disable_camera ? 'negative' : 'grey'" /></q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ $t('security.views.GeofenceView.42ebb1') }}</q-item-section>
                <q-item-section side><q-icon :name="selectedZone.disable_mic ? 'check' : 'close'" :color="selectedZone.disable_mic ? 'negative' : 'grey'" /></q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ $t('security.views.GeofenceView.cbcd2c') }}</q-item-section>
                <q-item-section side><q-icon :name="selectedZone.disable_usb ? 'check' : 'close'" :color="selectedZone.disable_usb ? 'negative' : 'grey'" /></q-item-section>
              </q-item>
            </q-list>
            <div class="q-mt-sm row q-gutter-sm">
              <q-btn flat dense size="sm" icon="edit" :label="$t('security.views.GeofenceView.530164')" @click="showEditDialog(selectedZone)" />
              <q-toggle v-model="selectedZone.enabled" :label="$t('security.views.GeofenceView.df174a')"
                @update:model-value="toggleZone(selectedZone)" dense />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Map -->
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <div class="row items-center q-pa-sm q-gutter-sm">
              <div class="text-caption text-grey col">
                Click on the map to set zone center, then configure radius and restrictions.
                Latest known device locations are shown as markers.
              </div>
              <q-chip dense outline color="primary" icon="devices">
                Devices: {{ deviceLocations.length }}
              </q-chip>
              <q-btn
                flat
                dense
                round
                icon="refresh"
                :loading="loadingLocations"
                @click="loadLatestLocations"
              />
            </div>
            <GeofenceMap
              :zones="zones"
              :device-locations="deviceLocations"
              :selected-zone="selectedZone"
              @zone-click="selectZone"
              @map-click="onMapClick"
              style="height: 500px"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 440px">
        <q-bar>{{ editingZone ? 'Edit Zone' : 'New Geofence Zone' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" :label="$t('security.views.GeofenceView.b6edd8')" outlined dense />
          <div class="row q-gutter-sm">
            <q-input v-model.number="form.center_lat" :label="$t('security.views.GeofenceView.ced390')" outlined dense type="number" class="col" />
            <q-input v-model.number="form.center_lon" :label="$t('security.views.GeofenceView.6f9f01')" outlined dense type="number" class="col" />
          </div>
          <q-input v-model.number="form.radius_meters" :label="$t('security.views.GeofenceView.90357c')" outlined dense type="number" min="50" />
          <div class="text-caption text-grey">{{ $t('security.views.GeofenceView.7298a7') }}</div>
          <q-toggle v-model="form.disable_camera" :label="$t('security.views.GeofenceView.2c50b0')" />
          <q-toggle v-model="form.disable_mic" :label="$t('security.views.GeofenceView.47013d')" />
          <q-toggle v-model="form.disable_usb" :label="$t('security.views.GeofenceView.bd7b37')" />
          <q-toggle v-model="form.enable_camera_on_exit" :label="$t('security.views.GeofenceView.ddb763')" />
          <q-toggle v-model="form.enable_mic_on_exit" :label="$t('security.views.GeofenceView.7287ea')" />
          <q-toggle v-model="form.enabled" :label="$t('security.views.GeofenceView.f42430')" />
          <q-input v-model="form.description" :label="$t('security.views.GeofenceView.55f8eb')" outlined dense type="textarea" rows="2" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('security.views.GeofenceView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingZone ? 'Save' : 'Create'" @click="saveZone" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

// Lazy-load map to avoid SSR issues
const GeofenceMap = defineAsyncComponent(() =>
  import("@/security/components/GeofenceMapComponent.vue")
);

const $q = useQuasar();
const zones = ref<any[]>([]);
const deviceLocations = ref<any[]>([]);
const selectedZone = ref<any>(null);
const dialogOpen = ref(false);
const editingZone = ref<any>(null);
const saving = ref(false);
const loadingLocations = ref(false);
const form = ref<any>({
  name: "", center_lat: 0, center_lon: 0, radius_meters: 200,
  disable_camera: false, disable_mic: false, disable_usb: false,
  enable_camera_on_exit: true, enable_mic_on_exit: true,
  enabled: true, description: "",
});

async function loadZones() {
  try { zones.value = (await axios.get("/security/geofence/")).data; }
  catch { zones.value = []; }
}

async function loadLatestLocations() {
  loadingLocations.value = true;
  try {
    const data = (await axios.get("/devicemanagement/locations/latest/")).data;
    deviceLocations.value = Array.isArray(data) ? data : data ? [data] : [];
  } catch {
    deviceLocations.value = [];
  } finally {
    loadingLocations.value = false;
  }
}

function selectZone(zone: any) { selectedZone.value = zone; }

function onMapClick(lat: number, lon: number) {
  form.value.center_lat = lat;
  form.value.center_lon = lon;
  if (!dialogOpen.value) dialogOpen.value = true;
}

function showCreateDialog() {
  editingZone.value = null;
  form.value = { name: "", center_lat: 0, center_lon: 0, radius_meters: 200,
    disable_camera: false, disable_mic: false, disable_usb: false,
    enable_camera_on_exit: true, enable_mic_on_exit: true, enabled: true, description: "" };
  dialogOpen.value = true;
}

function showEditDialog(zone: any) {
  editingZone.value = zone;
  form.value = { ...zone };
  dialogOpen.value = true;
}

async function saveZone() {
  saving.value = true;
  try {
    if (editingZone.value) {
      await axios.put(`/security/geofence/${editingZone.value.id}/`, form.value);
    } else {
      await axios.post("/security/geofence/", form.value);
    }
    dialogOpen.value = false;
    $q.notify({ message: "Zone saved", color: "positive", icon: "check" });
    await loadZones();
  } finally { saving.value = false; }
}

async function deleteZone(id: number) {
  $q.dialog({ title: "Delete zone?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/security/geofence/${id}/`);
    selectedZone.value = null;
    await loadZones();
  });
}

async function toggleZone(zone: any) {
  await axios.put(`/security/geofence/${zone.id}/`, { ...zone });
}

onMounted(async () => {
  await Promise.all([loadZones(), loadLatestLocations()]);
});
</script>
