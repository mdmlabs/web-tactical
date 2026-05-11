<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-subtitle1">{{ $t('winadvanced.components.MaintenanceWindowsPanel.5e81f7') }}</div>
      <q-space />
      <q-btn color="primary" icon="add" :label="$t('winadvanced.components.MaintenanceWindowsPanel.cc9745')" @click="showDialog()" />
    </div>
    <div class="text-caption text-grey q-mb-md">
      {{ $t('winadvanced.components.MaintenanceWindowsPanel.76e0e4') }}
    </div>

    <q-table :rows="windows" :columns="columns" dense row-key="id" :loading="loading">
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
            {{ props.value ? 'Active' : 'Disabled' }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-day_of_week="props">
        <q-td :props="props">{{ formatDays(props.value) }}</q-td>
      </template>
      <template v-slot:body-cell-tasks="props">
        <q-td :props="props">
          <q-chip v-if="props.row.allow_patches" dense color="blue-grey" text-color="white" size="sm">{{ $t('winadvanced.components.MaintenanceWindowsPanel.144198') }}</q-chip>
          <q-chip v-if="props.row.allow_reboot" dense color="orange" text-color="white" size="sm">{{ $t('winadvanced.components.MaintenanceWindowsPanel.c71166') }}</q-chip>
          <q-chip v-if="props.row.allow_scripts" dense color="teal" text-color="white" size="sm">{{ $t('winadvanced.components.MaintenanceWindowsPanel.381e32') }}</q-chip>
          <q-chip v-if="props.row.allow_agent_update" dense color="purple" text-color="white" size="sm">{{ $t('winadvanced.components.MaintenanceWindowsPanel.5ce2e6') }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" size="sm" @click="showDialog(props.row)" />
          <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWindow(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 540px">
        <q-bar>{{ editing ? 'Edit' : 'New' }} Maintenance Window<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" :label="$t('winadvanced.components.MaintenanceWindowsPanel.d145bb')" outlined dense />
          <div>
            <div class="text-caption text-grey q-mb-xs">{{ $t('winadvanced.components.MaintenanceWindowsPanel.709d8b') }}</div>
            <div class="row q-gutter-xs">
              <q-chip
                v-for="(day, idx) in dayNames"
                :key="idx"
                clickable
                :color="form.day_of_week.includes(idx) ? 'primary' : 'grey-3'"
                :text-color="form.day_of_week.includes(idx) ? 'white' : 'dark'"
                @click="toggleDay(idx)"
              >{{ day }}</q-chip>
            </div>
          </div>
          <div class="row q-gutter-md">
            <q-input v-model="form.start_time" :label="$t('winadvanced.components.MaintenanceWindowsPanel.41c107')" outlined dense type="time" class="col" />
            <q-input v-model="form.end_time" :label="$t('winadvanced.components.MaintenanceWindowsPanel.4c640e')" outlined dense type="time" class="col" />
          </div>
          <div class="text-caption text-grey">{{ $t('winadvanced.components.MaintenanceWindowsPanel.6030eb') }}</div>
          <div class="row q-gutter-md">
            <q-toggle v-model="form.allow_patches" :label="$t('winadvanced.components.MaintenanceWindowsPanel.144198')" />
            <q-toggle v-model="form.allow_reboot" :label="$t('winadvanced.components.MaintenanceWindowsPanel.c71166')" />
            <q-toggle v-model="form.allow_scripts" :label="$t('winadvanced.components.MaintenanceWindowsPanel.381e32')" />
            <q-toggle v-model="form.allow_agent_update" :label="$t('winadvanced.components.MaintenanceWindowsPanel.12eb2b')" />
          </div>
          <q-select
            v-model="form.scope"
            :options="[{label:'Global',value:'global'},{label:'Specific Device',value:'device'}]"
            :label="$t('winadvanced.components.MaintenanceWindowsPanel.4651a3')" outlined dense emit-value map-options
          />
          <q-input v-if="form.scope === 'device'" v-model="form.target_agent_id"
            :label="$t('winadvanced.components.MaintenanceWindowsPanel.ad08b5')" outlined dense />
          <q-toggle v-model="form.enabled" :label="$t('winadvanced.components.MaintenanceWindowsPanel.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('winadvanced.components.MaintenanceWindowsPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editing ? 'Save' : 'Create'"
            @click="saveWindow" :loading="saving" :disable="!form.name" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const windows = ref<any[]>([]);
const loading = ref(false);
const dialogOpen = ref(false);
const editing = ref<any>(null);
const saving = ref(false);

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const form = ref<any>({
  name: "", day_of_week: [], start_time: "02:00", end_time: "06:00",
  allow_patches: true, allow_reboot: true, allow_scripts: true, allow_agent_update: true,
  scope: "global", target_agent_id: "", enabled: true,
});

const columns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "day_of_week", label: "Days", field: "day_of_week", align: "left" as const },
  { name: "start_time", label: "Start", field: "start_time", align: "center" as const },
  { name: "end_time", label: "End", field: "end_time", align: "center" as const },
  { name: "tasks", label: "Allowed Tasks", field: "tasks", align: "left" as const },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

function formatDays(days: number[]): string {
  if (!days || days.length === 0) return "Every day";
  return days.map((d) => dayNames[d]).join(", ");
}

function toggleDay(idx: number) {
  const i = form.value.day_of_week.indexOf(idx);
  if (i >= 0) form.value.day_of_week.splice(i, 1);
  else form.value.day_of_week.push(idx);
}

async function load() {
  loading.value = true;
  try { windows.value = (await axios.get("/winadvanced/maintenance-windows/")).data; }
  catch { windows.value = []; }
  finally { loading.value = false; }
}

function showDialog(item?: any) {
  editing.value = item || null;
  form.value = item
    ? { ...item }
    : { name: "", day_of_week: [], start_time: "02:00", end_time: "06:00",
        allow_patches: true, allow_reboot: true, allow_scripts: true, allow_agent_update: true,
        scope: "global", target_agent_id: "", enabled: true };
  dialogOpen.value = true;
}

async function saveWindow() {
  saving.value = true;
  try {
    const payload = { ...form.value, start_time: form.value.start_time + ":00", end_time: form.value.end_time + ":00" };
    if (editing.value) {
      await axios.put(`/winadvanced/maintenance-windows/${editing.value.id}/`, payload);
    } else {
      await axios.post("/winadvanced/maintenance-windows/", payload);
    }
    dialogOpen.value = false;
    $q.notify({ message: "Window saved", color: "positive", icon: "check" });
    await load();
  } finally { saving.value = false; }
}

async function deleteWindow(id: number) {
  $q.dialog({ title: "Delete window?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/winadvanced/maintenance-windows/${id}/`);
    await load();
  });
}

onMounted(load);
</script>
