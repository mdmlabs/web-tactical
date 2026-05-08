<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">{{ $t('security.components.PeripheralRequestsPanel.1c9966') }}</div>
    <div class="text-caption text-grey q-mb-md">
      {{ $t('security.components.PeripheralRequestsPanel.29f337') }}
    </div>

    <div class="row q-gutter-md">
      <!-- Pending requests -->
      <div class="col-12 col-md-6">
        <div class="text-subtitle2 q-mb-sm">
          {{ $t('security.components.PeripheralRequestsPanel.45daa0') }}
          <q-badge color="warning" :label="pendingCount" class="q-ml-sm" />
        </div>
        <q-list bordered separator>
          <q-item v-for="req in pendingRequests" :key="req.id">
            <q-item-section avatar>
              <q-icon :name="req.device_type === 'camera' ? 'videocam' : 'mic'" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ req.device_type === 'camera' ? 'Camera' : 'Microphone' }} access</q-item-label>
              <q-item-label caption>
                Agent: {{ req.agent_id }} · {{ req.duration_minutes }} min
              </q-item-label>
              <q-item-label caption v-if="req.reason">Reason: {{ req.reason }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row q-gutter-xs">
                <q-btn flat dense size="sm" color="positive" icon="check" @click="approve(req.id)" :title="$t('security.components.PeripheralRequestsPanel.7b2c7f')" />
                <q-btn flat dense size="sm" color="negative" icon="close" @click="deny(req.id)" :title="$t('security.components.PeripheralRequestsPanel.53577b')" />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="pendingRequests.length === 0">
            <q-item-section class="text-grey text-center">{{ $t('security.components.PeripheralRequestsPanel.883e6a') }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Peripheral Schedules -->
      <div class="col-12 col-md-5">
        <div class="text-subtitle2 q-mb-sm">
          {{ $t('security.components.PeripheralRequestsPanel.ca26f4') }}
          <q-btn flat dense icon="add" size="sm" color="primary" @click="showScheduleDialog()" class="q-ml-sm" />
        </div>
        <q-list bordered separator dense>
          <q-item v-for="s in schedules" :key="s.id">
            <q-item-section avatar>
              <q-icon :name="scheduleIcon(s.device_type)" :color="s.enabled ? 'primary' : 'grey'" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ s.name }}</q-item-label>
              <q-item-label caption>
                {{ s.device_type }} · {{ s.disabled_hours_start }}:00-{{ s.disabled_hours_end }}:00
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat dense round icon="delete" size="xs" color="negative"
                @click="deleteSchedule(s.id)" />
            </q-item-section>
          </q-item>
          <q-item v-if="schedules.length === 0">
            <q-item-section class="text-grey text-center">{{ $t('security.components.PeripheralRequestsPanel.7c8d39') }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Schedule Dialog -->
    <q-dialog v-model="scheduleDialogOpen" persistent>
      <q-card style="min-width: 440px">
        <q-bar>{{ $t('security.components.PeripheralRequestsPanel.8ea2aa') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="schedForm.name" :label="$t('security.components.PeripheralRequestsPanel.d145bb')" outlined dense />
          <q-select v-model="schedForm.device_type"
            :options="[{label:'Camera',value:'camera'},{label:'Microphone',value:'mic'},{label:'USB',value:'usb'}]"
            :label="$t('security.components.PeripheralRequestsPanel.20d5df')" outlined dense emit-value map-options />
          <div class="row q-gutter-md">
            <q-select v-model.number="schedForm.disabled_hours_start"
              :options="hours" :label="$t('security.components.PeripheralRequestsPanel.892ead')" outlined dense emit-value map-options class="col" />
            <q-select v-model.number="schedForm.disabled_hours_end"
              :options="hours" :label="$t('security.components.PeripheralRequestsPanel.3135a9')" outlined dense emit-value map-options class="col" />
          </div>
          <q-toggle v-model="schedForm.enabled" :label="$t('security.components.PeripheralRequestsPanel.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('security.components.PeripheralRequestsPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('security.components.PeripheralRequestsPanel.6e157c')" @click="createSchedule" :loading="savingSched" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const requests = ref<any[]>([]);
const schedules = ref<any[]>([]);
const scheduleDialogOpen = ref(false);
const savingSched = ref(false);

const hours = Array.from({ length: 24 }, (_, i) => ({ label: `${i.toString().padStart(2, "0")}:00`, value: i }));
const schedForm = ref<any>({ name: "", device_type: "camera", disabled_hours_start: 9, disabled_hours_end: 18, enabled: true });

const pendingRequests = computed(() => requests.value.filter((r) => r.status === "pending"));
const pendingCount = computed(() => pendingRequests.value.length);

function scheduleIcon(t: string) {
  return { camera: "videocam", mic: "mic", usb: "usb" }[t] ?? "device_unknown";
}

async function load() {
  try { requests.value = (await axios.get("/security/peripheral-requests/")).data || []; } catch {}
  try { schedules.value = (await axios.get("/security/peripheral-schedules/")).data || []; } catch {}
}

async function approve(id: number) {
  await axios.patch(`/security/peripheral-requests/${id}/`, { status: "approved" });
  $q.notify({ message: "Request approved", color: "positive", icon: "check" });
  await load();
}

async function deny(id: number) {
  await axios.patch(`/security/peripheral-requests/${id}/`, { status: "denied" });
  $q.notify({ message: "Request denied", color: "negative", icon: "close" });
  await load();
}

function showScheduleDialog() {
  schedForm.value = { name: "", device_type: "camera", disabled_hours_start: 9, disabled_hours_end: 18, enabled: true };
  scheduleDialogOpen.value = true;
}

async function createSchedule() {
  savingSched.value = true;
  try {
    await axios.post("/security/peripheral-schedules/", schedForm.value);
    scheduleDialogOpen.value = false;
    $q.notify({ message: "Schedule created", color: "positive", icon: "check" });
    await load();
  } finally { savingSched.value = false; }
}

async function deleteSchedule(id: number) {
  await axios.delete(`/security/peripheral-schedules/${id}/`);
  await load();
}

onMounted(load);
</script>
