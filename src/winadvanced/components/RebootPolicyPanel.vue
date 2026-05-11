<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-subtitle1">{{ $t('winadvanced.components.RebootPolicyPanel.6af4f5') }}</div>
      <q-space />
      <q-btn color="primary" icon="add" :label="$t('winadvanced.components.RebootPolicyPanel.d5d435')" @click="showDialog()" />
    </div>
    <div class="text-caption text-grey q-mb-md">
      Reboot policies prevent automatic reboots during working hours.
      Agents respect these policies before restarting for updates.
    </div>

    <q-table :rows="policies" :columns="columns" dense row-key="id" :loading="loading">
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
            {{ props.value ? 'Active' : 'Off' }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-hours="props">
        <q-td :props="props">
          {{ props.row.work_hours_start }}:00 – {{ props.row.work_hours_end }}:00
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="fact_check" size="sm" color="primary" @click="previewPolicy(props.row)">
            <q-tooltip>Preview reboot decision</q-tooltip>
          </q-btn>
          <q-btn flat dense round icon="undo" size="sm" color="warning" @click="cancelPending(props.row)">
            <q-tooltip>Cancel pending reboot</q-tooltip>
          </q-btn>
          <q-btn flat dense round icon="edit" size="sm" @click="showDialog(props.row)" />
          <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deletePolicy(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar>{{ editing ? 'Edit' : 'New' }} Reboot Policy<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" :label="$t('winadvanced.components.RebootPolicyPanel.709a23')" outlined dense />
          <div class="text-caption text-grey">{{ $t('winadvanced.components.RebootPolicyPanel.326f81') }}</div>
          <div class="row q-gutter-md">
            <q-select v-model.number="form.work_hours_start"
              :options="hours" :label="$t('winadvanced.components.RebootPolicyPanel.f33073')" outlined dense emit-value map-options class="col" />
            <q-select v-model.number="form.work_hours_end"
              :options="hours" :label="$t('winadvanced.components.RebootPolicyPanel.f4f6ef')" outlined dense emit-value map-options class="col" />
          </div>
          <q-input v-model.number="form.max_defer_days" :label="$t('winadvanced.components.RebootPolicyPanel.1cb8db')" outlined dense type="number" min="0" />
          <q-input v-model.number="form.notify_min_before" :label="$t('winadvanced.components.RebootPolicyPanel.4e7af0')" outlined dense type="number" min="0" />
          <q-select
            v-model="form.scope"
            :options="[{label:'Global',value:'global'},{label:'Specific Device',value:'device'}]"
            :label="$t('winadvanced.components.RebootPolicyPanel.4651a3')" outlined dense emit-value map-options
          />
          <q-input v-if="form.scope === 'device'" v-model="form.target_agent_id"
            :label="$t('winadvanced.components.RebootPolicyPanel.ad08b5')" outlined dense />
          <q-toggle v-model="form.enabled" :label="$t('winadvanced.components.RebootPolicyPanel.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('winadvanced.components.RebootPolicyPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editing ? 'Save' : 'Create'"
            @click="savePolicy" :loading="saving" />
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
const policies = ref<any[]>([]);
const loading = ref(false);
const dialogOpen = ref(false);
const editing = ref<any>(null);
const saving = ref(false);

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i.toString().padStart(2, "0")}:00`,
  value: i,
}));

const form = ref<any>({
  name: "Default Reboot Policy", work_hours_start: 9, work_hours_end: 18,
  max_defer_days: 7, notify_min_before: 15, scope: "global", target_agent_id: "", enabled: false,
});

const columns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "hours", label: "Work Hours", field: "hours", align: "center" as const },
  { name: "max_defer_days", label: "Max Defer (days)", field: "max_defer_days", align: "center" as const },
  { name: "scope", label: "Scope", field: "scope", align: "center" as const },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

async function load() {
  loading.value = true;
  try { policies.value = (await axios.get("/winadvanced/reboot-policy/")).data; }
  catch { policies.value = []; }
  finally { loading.value = false; }
}

function showDialog(item?: any) {
  editing.value = item || null;
  form.value = item ? { ...item } : {
    name: "Default Reboot Policy", work_hours_start: 9, work_hours_end: 18,
    max_defer_days: 7, notify_min_before: 15, scope: "global", target_agent_id: "", enabled: false,
  };
  dialogOpen.value = true;
}

async function savePolicy() {
  saving.value = true;
  try {
    if (editing.value) {
      await axios.put(`/winadvanced/reboot-policy/${editing.value.id}/`, form.value);
    } else {
      await axios.post("/winadvanced/reboot-policy/", form.value);
    }
    dialogOpen.value = false;
    $q.notify({ message: "Policy saved", color: "positive", icon: "check" });
    await load();
  } finally { saving.value = false; }
}

async function deletePolicy(id: number) {
  $q.dialog({ title: "Delete policy?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/winadvanced/reboot-policy/${id}/`);
    await load();
  });
}

async function previewPolicy(row: any) {
  try {
    const body: any = { dry_run: true, wait: true, timeout: 60 };
    if (row.target_agent_id) body.agent_ids = [row.target_agent_id];
    const resp = await axios.post(`/winadvanced/reboot-policy/${row.id}/test/`, body);
    const first = resp.data?.results?.[0]?.result || "Preview completed";
    $q.notify({ message: first, color: "info", icon: "fact_check" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.detail || "Preview failed", color: "negative" });
  }
}

async function cancelPending(row: any) {
  try {
    const body: any = { wait: true, timeout: 60 };
    if (row.target_agent_id) body.agent_ids = [row.target_agent_id];
    const resp = await axios.post("/winadvanced/reboot-policy/cancel/", body);
    const first = resp.data?.results?.[0]?.result || "Cancel completed";
    $q.notify({ message: first, color: "positive", icon: "undo" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.detail || "Cancel failed", color: "negative" });
  }
}

onMounted(load);
</script>
