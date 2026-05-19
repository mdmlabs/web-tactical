<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('appmanagement.views.LicenseTrackingView.44b2ea') }}</div>
    <div class="text-caption text-grey q-mb-md">
      {{ $t('appmanagement.views.LicenseTrackingView.5a4d75') }}
    </div>

    <div class="row q-gutter-sm q-mb-md items-center">
      <q-btn color="primary" icon="add" :label="$t('appmanagement.views.LicenseTrackingView.695b21')" @click="showDialog()" />
      <q-input v-model="search" dense outlined :placeholder="$t('appmanagement.views.LicenseTrackingView.6d7a30')" clearable style="min-width:200px">
        <template v-slot:prepend><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row items-center justify-between q-col-gutter-sm">
          <div>
            <div class="text-subtitle2">Inventory history and compliance evidence</div>
            <div class="text-caption text-grey">Historical snapshots, deltas, stale endpoints, duplicate keys, CMDB/SIEM exports.</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn outline color="primary" icon="refresh" label="Load evidence" :loading="loadingInventory" @click="loadInventoryEvidence" />
            <q-btn outline color="primary" icon="table_view" label="CSV" @click="downloadInventoryExport('csv')" />
            <q-btn outline color="secondary" icon="hub" label="CMDB" @click="downloadInventoryExport('cmdb')" />
            <q-btn outline color="secondary" icon="security" label="SIEM" @click="downloadInventoryExport('siem')" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-md-4">
            <q-select
              v-model="selectedInventoryAgentId"
              :options="agentOptions"
              label="Device for real-time inventory"
              emit-value
              map-options
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn color="primary" icon="sync" label="Refresh device inventory" class="full-width" :disable="!selectedInventoryAgentId" :loading="refreshingInventory" @click="refreshSelectedInventory" />
          </div>
          <div class="col-12 col-md-5">
            <div class="row q-gutter-xs">
              <q-chip dense color="primary" text-color="white">Snapshots {{ inventorySummary.snapshots || 0 }}</q-chip>
              <q-chip dense color="info" text-color="white">Assets {{ inventorySummary.latest_assets || 0 }}</q-chip>
              <q-chip dense :color="Object.keys(duplicateLicenseKeys).length ? 'negative' : 'positive'" text-color="white">
                Duplicate keys {{ Object.keys(duplicateLicenseKeys).length }}
              </q-chip>
              <q-chip dense :color="(inventorySummary.risk_devices || []).length ? 'warning' : 'positive'" text-color="white">
                At risk {{ (inventorySummary.risk_devices || []).length }}
              </q-chip>
              <q-chip dense :color="(inventorySummary.stale_agents || []).length ? 'warning' : 'positive'" text-color="white">
                No recent data {{ (inventorySummary.stale_agents || []).length }}
              </q-chip>
            </div>
          </div>
        </div>
        <q-table
          class="q-mt-md"
          :rows="inventorySnapshots"
          :columns="inventoryColumns"
          dense
          flat
          row-key="id"
          :loading="loadingInventory"
          :rows-per-page-options="[5, 10, 25]"
        >
          <template v-slot:body-cell-delta="props">
            <q-td :props="props">
              +{{ props.row.metadata?.delta_added || 0 }} / -{{ props.row.metadata?.delta_removed || 0 }}
            </q-td>
          </template>
          <template v-slot:body-cell-risk="props">
            <q-td :props="props">
              <q-chip dense size="sm" :color="props.row.metadata?.risk_status === 'at_risk' ? 'warning' : 'positive'" text-color="white">
                {{ props.row.metadata?.risk_status || 'ok' }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-table :rows="filteredLicenses" :columns="columns" dense row-key="id" :loading="loading">
      <template v-slot:body-cell-seats_used="props">
        <q-td :props="props">
          <div class="row items-center q-gutter-xs">
            <q-linear-progress
              :value="props.row.seats_total > 0 ? (props.value / props.row.seats_total) : 0"
              :color="props.row.over_limit ? 'negative' : 'positive'"
              style="width:60px"
            />
            <span :class="props.row.over_limit ? 'text-negative' : ''">
              {{ props.value }} / {{ props.row.seats_total }}
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-compliance_status="props">
        <q-td :props="props">
          <q-chip dense size="sm" :color="licenseStatusColor(props.value)" text-color="white">
            {{ props.value || 'unknown' }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-installations="props">
        <q-td :props="props">
          <div class="row items-center q-gutter-xs justify-center">
            <q-icon name="devices" />
            <span>{{ props.row.installations?.length || 0 }}</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-expiry_date="props">
        <q-td :props="props">
          <span :class="isExpiringSoon(props.value) ? 'text-warning text-weight-bold' : ''">
            {{ props.value || '—' }}
          </span>
          <q-chip v-if="isExpired(props.value)" dense color="negative" text-color="white" size="sm" class="q-ml-xs">{{ $t('appmanagement.views.LicenseTrackingView.a689a9') }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" size="sm" @click="showDialog(props.row)" />
          <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteLicense(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- SSP Install Requests (admin view) -->
    <div class="q-mt-xl">
      <div class="text-subtitle1 q-mb-sm">{{ $t('appmanagement.views.LicenseTrackingView.7b9865') }}</div>
      <q-table :rows="installRequests" :columns="requestColumns" dense row-key="id" :loading="loadingReqs">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="reqStatusColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" v-if="props.row.status === 'pending'">
            <q-btn flat dense size="sm" color="positive" icon="check" :label="$t('appmanagement.views.LicenseTrackingView.7b2c7f')"
              @click="reviewRequest(props.row.id, 'approved')" />
            <q-btn flat dense size="sm" color="negative" icon="close" :label="$t('appmanagement.views.LicenseTrackingView.53577b')"
              @click="reviewRequest(props.row.id, 'denied')" />
          </q-td>
          <q-td :props="props" v-else />
        </template>
      </q-table>
    </div>

    <!-- License Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 500px">
        <q-bar>{{ editing ? 'Edit License' : 'Add License' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" :label="$t('appmanagement.views.LicenseTrackingView.67d446')" outlined dense />
          <q-input v-model="form.product_name" :label="$t('appmanagement.views.LicenseTrackingView.25f591')" outlined dense />
          <q-input v-model="form.vendor" :label="$t('appmanagement.views.LicenseTrackingView.d96159')" outlined dense />
          <div class="row q-gutter-md">
            <q-input v-model.number="form.seats_total" :label="$t('appmanagement.views.LicenseTrackingView.dbad01')" outlined dense type="number" min="1" class="col" />
            <q-select v-model="form.license_type"
              :options="[{label:'Perpetual',value:'perpetual'},{label:'Subscription',value:'subscription'},{label:'OEM',value:'oem'},{label:'Freeware',value:'freeware'}]"
              :label="$t('appmanagement.views.LicenseTrackingView.3deb74')" outlined dense emit-value map-options class="col" />
          </div>
          <q-input v-model="form.expiry_date" :label="$t('appmanagement.views.LicenseTrackingView.aa767c')" outlined dense />
          <q-input v-model.number="form.cost_per_seat" :label="$t('appmanagement.views.LicenseTrackingView.894e86')" outlined dense type="number" min="0" />
          <q-input v-model="form.notes" :label="$t('appmanagement.views.LicenseTrackingView.704400')" outlined dense type="textarea" rows="2" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('appmanagement.views.LicenseTrackingView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editing ? 'Save' : 'Add'" @click="saveLicense" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const licenses = ref<any[]>([]);
const installRequests = ref<any[]>([]);
const loading = ref(false);
const loadingReqs = ref(false);
const dialogOpen = ref(false);
const editing = ref<any>(null);
const saving = ref(false);
const search = ref("");
const loadingInventory = ref(false);
const refreshingInventory = ref(false);
const inventorySnapshots = ref<any[]>([]);
const inventorySummary = ref<any>({});
const duplicateLicenseKeys = ref<Record<string, string[]>>({});
const agentOptions = ref<any[]>([]);
const selectedInventoryAgentId = ref("");

const form = ref<any>({ name: "", product_name: "", vendor: "", seats_total: 1, license_type: "perpetual", expiry_date: "", cost_per_seat: null, notes: "" });

const filteredLicenses = computed(() => {
  if (!search.value) return licenses.value;
  const q = search.value.toLowerCase();
  return licenses.value.filter((l) => l.name?.toLowerCase().includes(q) || l.vendor?.toLowerCase().includes(q));
});

const columns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "vendor", label: "Vendor", field: "vendor", align: "left" as const },
  { name: "license_type", label: "Type", field: "license_type", align: "center" as const },
  { name: "compliance_status", label: "Status", field: "compliance_status", align: "center" as const },
  { name: "seats_used", label: "Seats Used", field: "seats_used", align: "center" as const },
  { name: "seats_available", label: "Available", field: "seats_available", align: "center" as const },
  { name: "installations", label: "Devices", field: "installations", align: "center" as const },
  { name: "expiry_date", label: "Expires", field: "expiry_date", align: "center" as const },
  { name: "cost_per_seat", label: "$/Seat", field: "cost_per_seat", align: "right" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const requestColumns = [
  { name: "app_name", label: "App", field: "app_name", align: "left" as const },
  { name: "request_type", label: "Type", field: "request_type", align: "center" as const },
  { name: "device_name", label: "Device", field: "device_name", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left" as const },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];
const inventoryColumns = [
  { name: "created_at", label: "Snapshot", field: "created_at", align: "left" as const, sortable: true },
  { name: "hostname", label: "Device", field: "hostname", align: "left" as const, sortable: true },
  { name: "total", label: "Apps", field: (row: any) => row.metadata?.total || 0, align: "center" as const, sortable: true },
  { name: "delta", label: "Delta", field: "delta", align: "center" as const },
  { name: "source", label: "Source", field: "source", align: "left" as const },
  { name: "risk", label: "Risk", field: "risk", align: "center" as const },
];

function isExpiringSoon(date: string): boolean {
  if (!date) return false;
  const exp = new Date(date);
  const now = new Date();
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff < 30;
}
function isExpired(date: string): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}
function reqStatusColor(s: string) {
  return {
    pending: "warning",
    approved: "positive",
    installing: "info",
    denied: "negative",
    installed: "positive",
    removed: "grey",
    failed: "negative",
  }[s] ?? "grey";
}

function licenseStatusColor(status: string) {
  return {
    compliant: "positive",
    freeware: "blue-grey",
    expiring_soon: "warning",
    over_limit: "negative",
    expired: "negative",
  }[status] ?? "grey";
}

async function load() {
  loading.value = true;
  try {
    // Note: SoftwareLicense model needs a GET endpoint
    const resp = await axios.get("/appmanagement/licenses/");
    licenses.value = resp.data || [];
  } catch { licenses.value = []; }
  finally { loading.value = false; }
}

async function loadInventoryEvidence() {
  loadingInventory.value = true;
  try {
    const resp = await axios.get("/software/inventory-snapshots/");
    inventorySnapshots.value = resp.data?.results || [];
    inventorySummary.value = resp.data?.summary || {};
    duplicateLicenseKeys.value = resp.data?.duplicate_license_keys || {};
    const agents = (await axios.get("/appmanagement/app-inventory/")).data?.agents || [];
    agentOptions.value = agents.map((a: any) => ({ label: `${a.hostname} (${a.agent_id})`, value: a.agent_id }));
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load inventory evidence", color: "negative" });
  } finally {
    loadingInventory.value = false;
  }
}

async function refreshSelectedInventory() {
  if (!selectedInventoryAgentId.value) return;
  refreshingInventory.value = true;
  try {
    await axios.post("/appmanagement/app-inventory/", { agent_id: selectedInventoryAgentId.value });
    $q.notify({ message: "Inventory refresh requested and snapshot recorded", color: "positive", icon: "check" });
    await loadInventoryEvidence();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Inventory refresh failed", color: "negative" });
  } finally {
    refreshingInventory.value = false;
  }
}

async function downloadInventoryExport(format: "csv" | "cmdb" | "siem") {
  const resp = await axios.get(`/software/inventory-snapshots/?format=${format}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(resp.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = format === "siem" ? "software-inventory-siem.ndjson" : format === "cmdb" ? "software-inventory-cmdb.json" : "software-inventory.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

async function loadRequests() {
  loadingReqs.value = true;
  try { installRequests.value = (await axios.get("/appmanagement/ssp/install-requests/admin/")).data || []; }
  catch { installRequests.value = []; }
  finally { loadingReqs.value = false; }
}

function showDialog(item?: any) {
  editing.value = item || null;
  form.value = item ? { ...item } : { name: "", product_name: "", vendor: "", seats_total: 1, license_type: "perpetual", expiry_date: "", cost_per_seat: null, notes: "" };
  dialogOpen.value = true;
}

async function saveLicense() {
  saving.value = true;
  try {
    if (editing.value) {
      await axios.put(`/appmanagement/licenses/${editing.value.id}/`, form.value);
    } else {
      await axios.post("/appmanagement/licenses/", form.value);
    }
    dialogOpen.value = false;
    $q.notify({ message: "License saved", color: "positive", icon: "check" });
    await load();
  } finally { saving.value = false; }
}

async function deleteLicense(id: number) {
  $q.dialog({ title: "Delete license?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/appmanagement/licenses/${id}/`);
    await load();
  });
}

async function reviewRequest(id: number, status: string) {
  await axios.patch(`/appmanagement/ssp/install-requests/${id}/`, { status });
  $q.notify({ message: `Request ${status}`, color: status === "approved" ? "positive" : "negative", icon: "check" });
  await loadRequests();
}

onMounted(() => { load(); loadRequests(); loadInventoryEvidence(); });
</script>
