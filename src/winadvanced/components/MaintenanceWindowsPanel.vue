<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-subtitle1">Maintenance Windows</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Add window" @click="showDialog()" />
    </div>
    <div class="text-caption text-grey q-mb-md">
      Define when patching, reboot, script and agent update actions are allowed.
    </div>

    <q-table :rows="windows" :columns="columns" dense row-key="id" :loading="loading">
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
            {{ props.value ? "Active" : "Disabled" }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-day_of_week="props">
        <q-td :props="props">{{ formatDays(props.value) }}</q-td>
      </template>
      <template v-slot:body-cell-scope="props">
        <q-td :props="props">
          {{ scopeLabel(props.row) }}
          <div class="text-caption text-grey">{{ targetLabel(props.row) }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-tasks="props">
        <q-td :props="props">
          <q-chip v-if="props.row.allow_patches" dense color="blue-grey" text-color="white" size="sm">Patches</q-chip>
          <q-chip v-if="props.row.allow_reboot" dense color="orange" text-color="white" size="sm">Reboot</q-chip>
          <q-chip v-if="props.row.allow_scripts" dense color="teal" text-color="white" size="sm">Scripts</q-chip>
          <q-chip v-if="props.row.allow_agent_update" dense color="purple" text-color="white" size="sm">Agent update</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="fact_check" size="sm" color="primary" @click="checkWindow(props.row)">
            <q-tooltip>Check active now</q-tooltip>
          </q-btn>
          <q-btn flat dense round icon="edit" size="sm" @click="showDialog(props.row)" />
          <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWindow(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <div class="row items-center q-mt-lg q-mb-sm">
      <div class="text-subtitle2">Maintenance Report</div>
      <q-space />
      <q-btn flat color="primary" icon="refresh" label="Refresh report" :loading="reportLoading" @click="loadReport" />
    </div>
    <q-table
      :rows="reportRows"
      :columns="reportColumns"
      dense
      row-key="agent_id"
      :loading="reportLoading"
      :rows-per-page-options="[5, 10, 25]"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            :color="props.value === 'active' ? 'positive' : props.value === 'scheduled' ? 'warning' : 'grey'"
            text-color="white"
          >
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-active_windows="props">
        <q-td :props="props">
          {{ props.value?.length ? props.value.join(", ") : "No active window" }}
        </q-td>
      </template>
      <template v-slot:body-cell-allowed="props">
        <q-td :props="props">
          <q-chip v-if="props.row.allow_patches" dense color="blue-grey" text-color="white" size="sm">Patches</q-chip>
          <q-chip v-if="props.row.allow_reboot" dense color="orange" text-color="white" size="sm">Reboot</q-chip>
          <q-chip v-if="props.row.allow_scripts" dense color="teal" text-color="white" size="sm">Scripts</q-chip>
          <q-chip v-if="props.row.allow_agent_update" dense color="purple" text-color="white" size="sm">Agent update</q-chip>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 640px">
        <q-bar>{{ editing ? "Edit" : "New" }} Maintenance Window<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Name" outlined dense />
          <q-input v-model="form.description" label="Description" outlined dense />
          <div>
            <div class="text-caption text-grey q-mb-xs">Days</div>
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
            <q-input v-model="form.start_time" label="Start time" outlined dense type="time" class="col" />
            <q-input v-model="form.end_time" label="End time" outlined dense type="time" class="col" />
          </div>
          <div class="text-caption text-grey">Allowed tasks</div>
          <div class="row q-gutter-md">
            <q-toggle v-model="form.allow_patches" label="Patches" />
            <q-toggle v-model="form.allow_reboot" label="Reboot" />
            <q-toggle v-model="form.allow_scripts" label="Scripts" />
            <q-toggle v-model="form.allow_agent_update" label="Agent update" />
          </div>
          <q-select
            v-model="form.scope"
            :options="scopeOptions"
            label="Scope"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="onScopeChange"
          />
          <q-select
            v-if="form.scope === 'device'"
            v-model="form.target_agent_id"
            :options="agentOptions"
            label="Target device"
            outlined
            dense
            emit-value
            map-options
            use-input
            fill-input
            input-debounce="0"
          />
          <q-select
            v-if="form.scope === 'device_group'"
            v-model="form.target_device_group_id"
            :options="siteOptions"
            label="Target device group"
            outlined
            dense
            emit-value
            map-options
            use-input
            fill-input
            input-debounce="0"
          />
          <q-toggle v-model="form.enabled" label="Enabled" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="editing ? 'Save' : 'Create'" @click="saveWindow" :loading="saving" :disable="!canSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const windows = ref<any[]>([]);
const reportRows = ref<any[]>([]);
const agentOptions = ref<{ label: string; value: string }[]>([]);
const siteOptions = ref<{ label: string; value: number }[]>([]);
const loading = ref(false);
const reportLoading = ref(false);
const dialogOpen = ref(false);
const editing = ref<any>(null);
const saving = ref(false);

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Specific Device", value: "device" },
  { label: "Device Group", value: "device_group" },
];

const defaultForm = () => ({
  name: "",
  description: "",
  day_of_week: [] as number[],
  start_time: "02:00",
  end_time: "06:00",
  allow_patches: true,
  allow_reboot: true,
  allow_scripts: true,
  allow_agent_update: true,
  scope: "global",
  target_agent_id: "",
  target_device_group_id: null as number | null,
  enabled: true,
});

const form = ref<any>(defaultForm());

const columns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "scope", label: "Scope", field: "scope", align: "left" as const },
  { name: "day_of_week", label: "Days", field: "day_of_week", align: "left" as const },
  { name: "start_time", label: "Start", field: "start_time", align: "center" as const },
  { name: "end_time", label: "End", field: "end_time", align: "center" as const },
  { name: "tasks", label: "Allowed Tasks", field: "tasks", align: "left" as const },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const reportColumns = [
  { name: "hostname", label: "Device", field: "hostname", align: "left" as const, sortable: true },
  { name: "site", label: "Group", field: "site", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const, sortable: true },
  { name: "windows_total", label: "Matched", field: "windows_total", align: "center" as const },
  { name: "active_windows", label: "Active windows", field: "active_windows", align: "left" as const },
  { name: "allowed", label: "Allowed now", field: "allowed", align: "left" as const },
  {
    name: "last_seen",
    label: "Last seen",
    field: "last_seen",
    align: "left" as const,
    format: (value: string) => (value ? new Date(value).toLocaleString() : "-"),
  },
];

const canSave = computed(() => {
  if (!form.value.name) return false;
  if (form.value.scope === "device") return !!form.value.target_agent_id;
  if (form.value.scope === "device_group") return !!form.value.target_device_group_id;
  return true;
});

function normalizeTime(value: string): string {
  if (!value) return "00:00:00";
  return value.length === 5 ? `${value}:00` : value;
}

function displayTime(value: string): string {
  if (!value) return "";
  return value.slice(0, 5);
}

function formatDays(days: number[]): string {
  if (!days || days.length === 0) return "Every day";
  return days.map((d) => dayNames[d]).join(", ");
}

function toggleDay(idx: number) {
  const i = form.value.day_of_week.indexOf(idx);
  if (i >= 0) form.value.day_of_week.splice(i, 1);
  else form.value.day_of_week.push(idx);
}

function scopeLabel(row: any) {
  return scopeOptions.find((option) => option.value === row.scope)?.label || "Global";
}

function targetLabel(row: any) {
  if (row.scope === "device") {
    return agentOptions.value.find((option) => option.value === row.target_agent_id)?.label || row.target_agent_id || "";
  }
  if (row.scope === "device_group") {
    return siteOptions.value.find((option) => option.value === row.target_device_group_id)?.label || `Device group #${row.target_device_group_id || "-"}`;
  }
  return "All matching Windows devices";
}

function onScopeChange(scope: string) {
  form.value.scope = scope || "global";
  if (form.value.scope !== "device") form.value.target_agent_id = "";
  if (form.value.scope !== "device_group") form.value.target_device_group_id = null;
}

async function loadOptions() {
  const [agentsResp, sitesResp] = await Promise.allSettled([
    axios.get("/agents/", { params: { detail: "false" } }),
    axios.get("/clients/sites/?leaf=true"),
  ]);
  if (agentsResp.status === "fulfilled") {
    const list = Array.isArray(agentsResp.value.data) ? agentsResp.value.data : (agentsResp.value.data?.results ?? []);
    agentOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        value: agent.agent_id,
        label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
      }));
  }
  if (sitesResp.status === "fulfilled") {
    const list = Array.isArray(sitesResp.value.data) ? sitesResp.value.data : (sitesResp.value.data?.results ?? []);
    siteOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
      }));
  }
}

async function load() {
  loading.value = true;
  try {
    windows.value = (await axios.get("/winadvanced/maintenance-windows/")).data;
  } catch {
    windows.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadReport() {
  reportLoading.value = true;
  try {
    reportRows.value = (await axios.get("/winadvanced/maintenance-windows/report/")).data;
  } catch {
    reportRows.value = [];
  } finally {
    reportLoading.value = false;
  }
}

function showDialog(item?: any) {
  editing.value = item || null;
  form.value = item
    ? { ...defaultForm(), ...item, start_time: displayTime(item.start_time), end_time: displayTime(item.end_time) }
    : defaultForm();
  dialogOpen.value = true;
}

function buildPayload() {
  const payload = {
    ...form.value,
    start_time: normalizeTime(form.value.start_time),
    end_time: normalizeTime(form.value.end_time),
  };
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  return payload;
}

async function saveWindow() {
  saving.value = true;
  try {
    const payload = buildPayload();
    if (editing.value) {
      await axios.put(`/winadvanced/maintenance-windows/${editing.value.id}/`, payload);
    } else {
      await axios.post("/winadvanced/maintenance-windows/", payload);
    }
    dialogOpen.value = false;
    $q.notify({ message: "Window saved", color: "positive", icon: "check" });
    await Promise.all([load(), loadReport()]);
  } finally {
    saving.value = false;
  }
}

async function checkWindow(row: any) {
  const resp = await axios.post(`/winadvanced/maintenance-windows/${row.id}/active/`);
  $q.notify({
    message: `${row.name}: ${resp.data?.active ? "active now" : "not active now"}`,
    color: resp.data?.active ? "positive" : "warning",
    icon: "fact_check",
  });
}

async function deleteWindow(id: number) {
  $q.dialog({ title: "Delete window?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/winadvanced/maintenance-windows/${id}/`);
    await Promise.all([load(), loadReport()]);
  });
}

onMounted(async () => {
  await loadOptions();
  await Promise.all([load(), loadReport()]);
});
</script>
