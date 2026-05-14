<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('ssp.views.SSPAppCatalogView.788bd0') }}</div>
    <div class="text-body2 text-grey q-mb-md">
      {{ $t('ssp.views.SSPAppCatalogView.25d640') }}
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-select
          v-model="selectedDeviceId"
          :options="deviceOptions"
          emit-value
          map-options
          dense outlined clearable
          label="Target device"
          :hint="deviceHint"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-select
          v-model="categoryFilter"
          :options="catalogCategories"
          dense outlined
          label="Category"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="search"
          dense outlined :placeholder="$t('ssp.views.SSPAppCatalogView.b5ac67')" clearable
        >
          <template v-slot:prepend><q-icon name="search" /></template>
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-select v-model="sortMode" :options="sortOptions" dense outlined label="Sort" emit-value map-options />
      </div>
      <div class="col-12 col-md-2 row q-gutter-xs">
        <q-btn dense outline color="primary" icon="download" label="Batch" :disable="selectedCatalogIds.length === 0" @click="requestSelected('install')" />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner size="40px" />
    </div>

    <div v-else-if="filteredApps.length === 0" class="text-center q-pa-xl text-grey">
      <q-icon name="apps" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">{{ $t('ssp.views.SSPAppCatalogView.5db432') }}</div>
      <div class="text-caption">{{ $t('ssp.views.SSPAppCatalogView.c30a79') }}</div>
    </div>

    <div v-else class="row q-gutter-md">
      <q-card
        v-for="app in filteredApps"
        :key="app.catalog_id || app.id"
        class="col-12 col-sm-5 col-md-3 app-card"
      >
        <q-card-section>
          <div class="row items-start q-mb-sm no-wrap">
            <q-avatar color="primary" text-color="white" :icon="app.source === 'external' ? 'open_in_new' : 'apps'" size="40px" class="q-mr-sm" />
            <div class="col">
              <div class="text-subtitle2">{{ app.name }}</div>
              <div class="text-caption text-grey">{{ app.category || "General" }} · {{ app.source === 'external' ? 'External link' : 'Internal app' }}</div>
            </div>
            <q-checkbox
              v-if="app.source !== 'external'"
              :model-value="selectedCatalogIds.includes(app.catalog_id)"
              dense
              @update:model-value="(v) => toggleSelectedCatalog(app, v)"
            />
          </div>
          <div class="text-caption text-grey ellipsis-2-lines">
            {{ app.description || "No description available." }}
          </div>
          <div class="text-caption text-grey q-mt-xs" v-if="app.version || app.latest_version || app.installed_version">
            Version: {{ app.installed_version || app.version || "not installed" }}
            <span v-if="app.latest_version"> · Latest: {{ app.latest_version }}</span>
          </div>
          <div v-if="app.average_rating || app.feedback_count" class="row items-center q-gutter-xs q-mt-xs text-caption text-grey">
            <q-rating :model-value="Number(app.average_rating || 0)" readonly size="16px" color="amber" />
            <span>{{ app.average_rating || 0 }}/5 · {{ app.feedback_count || 0 }} reviews</span>
          </div>
          <div class="row q-gutter-xs q-mt-sm">
            <q-chip v-if="app.installed" dense color="positive" text-color="white" icon="check">Installed</q-chip>
            <q-chip v-if="app.update_available" dense color="warning" text-color="dark" icon="system_update">Update</q-chip>
            <q-chip v-if="app.force_update_required" dense color="negative" text-color="white" icon="priority_high">Required</q-chip>
            <q-chip v-if="app.approval_required === false" dense color="info" text-color="white" icon="flash_on">Auto</q-chip>
            <q-chip v-if="app.license?.managed" dense :color="app.license.blocked ? 'negative' : 'secondary'" text-color="white" icon="verified_user">
              {{ app.license.seats_available }}/{{ app.license.seats_total }} seats
            </q-chip>
          </div>
          <div v-if="app.changelog && app.update_available" class="text-caption q-mt-xs">
            {{ app.changelog }}
          </div>
          <div v-if="app.request_count" class="text-caption text-grey q-mt-xs">
            Requests {{ app.request_count }} · Installed {{ app.installed_count || 0 }} · Failed {{ app.failed_count || 0 }}
          </div>
          <div class="text-caption text-grey q-mt-xs" v-if="app.retirement_date">
            Retirement: {{ app.retirement_date }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="q-gutter-xs">
          <q-btn
            v-if="app.source === 'external'"
            flat dense color="primary" icon="open_in_new"
            label="Open"
            :href="app.url"
            target="_blank"
          />
          <q-btn
            v-else-if="isActionIdle(app) && !app.installed"
            flat dense color="primary" icon="download"
            :label="$t('ssp.views.SSPAppCatalogView.7fb1c1')"
            :disable="app.license?.blocked"
            @click="openRequestDialog(app, 'install')"
          />
          <q-btn
            v-if="app.source !== 'external' && isActionIdle(app) && app.installed && app.update_available"
            flat dense color="primary" icon="system_update_alt"
            label="Update"
            @click="openRequestDialog(app, 'update')"
          />
          <q-btn
            v-if="app.source !== 'external' && isActionIdle(app) && app.installed"
            flat dense color="negative" icon="delete"
            label="Uninstall"
            @click="openRequestDialog(app, 'uninstall')"
          />
          <q-chip v-if="getAppStatus(app) === 'pending'" dense color="warning" text-color="dark" icon="hourglass_empty">
            {{ $t('ssp.views.SSPAppCatalogView.25d1b4') }}
          </q-chip>
          <q-chip v-if="getAppStatus(app) === 'installing'" dense color="info" text-color="white" icon="sync">
            {{ $t('ssp.views.SSPAppCatalogView.1106a2') }}
          </q-chip>
          <q-chip v-if="getAppStatus(app) === 'installed' && !app.installed" dense color="positive" text-color="white" icon="check">
            {{ $t('ssp.views.SSPAppCatalogView.7bb440') }}
          </q-chip>
          <q-space />
          <q-btn flat dense round color="secondary" icon="rate_review" @click="openFeedback(app)">
            <q-tooltip>Feedback</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- My Requests -->
    <div class="q-mt-xl" v-if="myRequests.length > 0">
      <div class="text-subtitle1 q-mb-sm">{{ $t('ssp.views.SSPAppCatalogView.0beafc') }}</div>
      <q-table :rows="myRequests" :columns="requestColumns" dense row-key="id"
        :rows-per-page-options="[10]">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="statusColor(props.value)" text-color="white" size="sm">
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat dense round color="secondary" icon="rate_review"
              :disable="!['installed', 'removed', 'failed'].includes(props.row.status)"
              @click="openFeedbackForRequest(props.row)"
            >
              <q-tooltip>Send install feedback</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="requestDialogOpen" persistent>
      <q-card style="min-width: 460px; max-width: 95vw">
        <q-bar>
          {{ requestActionLabel }} {{ requestTarget?.name }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-sm">
          <div v-if="selectedDevice" class="text-caption text-grey">
            Target: {{ selectedDevice.device_name }} · Agent {{ selectedDevice.agent_id }}
          </div>
          <q-banner v-if="requestTarget?.force_update_required && requestType === 'update'" dense class="bg-orange-1 text-dark">
            Critical update required. IT may force this update if it remains pending.
          </q-banner>
          <q-input v-model="requestJustification" outlined dense type="textarea" autogrow label="Business reason / note" />
          <q-input v-model="requestScheduledFor" outlined dense type="datetime-local" label="Run at" clearable />
          <div v-if="requestTarget?.changelog" class="text-caption">
            {{ requestTarget.changelog }}
          </div>
          <div v-if="requestTarget?.license?.managed" class="text-caption text-grey">
            License seats: {{ requestTarget.license.seats_available }}/{{ requestTarget.license.seats_total }} available
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="requestTarget?.approval_required === false ? 'Start' : 'Request'" :loading="submittingRequest" @click="submitRequestDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="feedbackDialogOpen">
      <q-card style="min-width: 420px">
        <q-bar>
          Feedback
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-subtitle2">{{ feedbackTarget?.name }}</div>
          <q-select v-model="feedbackType" :options="feedbackTypeOptions" outlined dense label="Type" />
          <q-rating v-model="feedbackRating" size="28px" color="amber" icon="star_border" icon-selected="star" />
          <q-input v-model="feedbackComment" type="textarea" outlined dense label="Comment" autogrow />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Send" :loading="submittingFeedback" @click="submitFeedback" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const $q = useQuasar();
const auth = useAuthStore();
const loading = ref(false);
const search = ref("");
const apps = ref<any[]>([]);
const myRequests = ref<any[]>([]);
const myDevices = ref<any[]>([]);
const selectedDeviceId = ref<number | null>(null);
const selectedCatalogIds = ref<string[]>([]);
const categoryFilter = ref("All");
const sortMode = ref("name");
const catalogCategoriesFromApi = ref<string[]>([]);
const requestDialogOpen = ref(false);
const requestTarget = ref<any | null>(null);
const requestType = ref("install");
const requestJustification = ref("");
const requestScheduledFor = ref("");
const submittingRequest = ref(false);
const feedbackDialogOpen = ref(false);
const feedbackTarget = ref<any | null>(null);
const feedbackRequest = ref<any | null>(null);
const feedbackType = ref("Review");
const feedbackRating = ref(5);
const feedbackComment = ref("");
const submittingFeedback = ref(false);

const filteredApps = computed(() => {
  let rows = apps.value;
  if (search.value) {
    const q = search.value.toLowerCase();
    rows = rows.filter((a) =>
      a.name?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
    );
  }
  return [...rows].sort((a, b) => {
    if (sortMode.value === "rating") return Number(b.average_rating || 0) - Number(a.average_rating || 0);
    if (sortMode.value === "popular") return Number(b.request_count || 0) - Number(a.request_count || 0);
    if (sortMode.value === "updates") return Number(!!b.update_available) - Number(!!a.update_available);
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
});

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Rating", value: "rating" },
  { label: "Popularity", value: "popular" },
  { label: "Updates", value: "updates" },
];

const feedbackTypeOptions = ["Review", "Install issue", "Crash report", "Request help", "Uninstall reason"];

const requestColumns = [
  { name: "app_name", label: "App", field: "app_name", align: "left" as const },
  { name: "request_type", label: "Type", field: "request_type", align: "center" as const },
  { name: "device_name", label: "Device", field: "device_name", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const catalogCategories = computed(() => {
  const values = (catalogCategoriesFromApi.value.length ? catalogCategoriesFromApi.value : apps.value.map((a) => a.category || "General"))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return ["All", ...Array.from(new Set(values))];
});

const deviceOptions = computed(() =>
  myDevices.value.map((d) => ({
    label: `${d.device_name}${d.agent_id ? "" : " (not managed yet)"}`,
    value: d.id,
    disable: !d.agent_id,
  }))
);

const selectedDevice = computed(() => myDevices.value.find((d) => d.id === selectedDeviceId.value));
const deviceHint = computed(() => {
  if (!myDevices.value.length) return "Enroll a device first";
  if (!selectedDeviceId.value) return "Choose which managed device should receive this app";
  if (!selectedDevice.value?.agent_id) return "This device needs the MDM agent installer first";
  return `Agent ${selectedDevice.value.agent_id}`;
});

const requestActionLabel = computed(() => {
  const labels: Record<string, string> = {
    install: "Install",
    update: "Update",
    uninstall: "Uninstall",
  };
  return labels[requestType.value] || "Request";
});

function getAppStatus(app: any): string {
  const req = myRequests.value.find((r) =>
    (r.catalog_id && r.catalog_id === app.catalog_id)
    || (r.app_id === app.id && r.app_name === app.name)
  );
  if (!req) return "idle";
  return req.status === "approved" ? "installing" : req.status;
}

function isActionIdle(app: any): boolean {
  return !["pending", "approved", "scheduled", "installing"].includes(getAppStatus(app));
}

function statusColor(status: string) {
  return {
    pending: "warning",
    approved: "positive",
    scheduled: "secondary",
    denied: "negative",
    installing: "info",
    installed: "positive",
    removed: "grey",
    failed: "negative",
  }[status] ?? "grey";
}

async function loadCatalog() {
  loading.value = true;
  try {
    const params: Record<string, any> = {};
    if (selectedDeviceId.value) params.device_id = selectedDeviceId.value;
    if (categoryFilter.value && categoryFilter.value !== "All") params.category = categoryFilter.value;
    const resp = await axios.get("/appmanagement/ssp/catalog/", { params });
    apps.value = resp.data?.items || [];
    catalogCategoriesFromApi.value = resp.data?.categories || [];
  } catch {
    apps.value = [];
    catalogCategoriesFromApi.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadMyRequests() {
  try {
    myRequests.value = (await axios.get("/appmanagement/ssp/install-requests/")).data || [];
  } catch {
    myRequests.value = [];
  }
}

async function loadMyDevices() {
  try {
    myDevices.value = (await axios.get("/appmanagement/ssp/devices/")).data || [];
    const managed = myDevices.value.find((d) => d.agent_id);
    if (!selectedDeviceId.value && managed) selectedDeviceId.value = managed.id;
  } catch {
    myDevices.value = [];
  }
}

function toggleSelectedCatalog(app: any, checked: boolean) {
  const id = String(app.catalog_id || "");
  if (!id) return;
  if (checked && !selectedCatalogIds.value.includes(id)) {
    selectedCatalogIds.value.push(id);
  } else if (!checked) {
    selectedCatalogIds.value = selectedCatalogIds.value.filter((item) => item !== id);
  }
}

function openRequestDialog(app: any, action = "install") {
  if (myDevices.value.length === 0) {
    $q.notify({ message: "Please enroll a device first before requesting apps.", color: "warning" });
    return;
  }
  const device = selectedDevice.value;
  if (!device || !device.agent_id) {
    $q.notify({ message: "Choose a managed device before requesting apps.", color: "warning" });
    return;
  }
  requestTarget.value = app;
  requestType.value = action;
  requestJustification.value = "";
  requestScheduledFor.value = "";
  requestDialogOpen.value = true;
}

async function submitRequest(app: any, action = "install") {
  const device = selectedDevice.value;
  if (!device || !device.agent_id) throw new Error("Choose a managed device before requesting apps.");
  await axios.post("/appmanagement/ssp/install-requests/", {
    app_id: app.id,
    catalog_id: app.catalog_id,
    app_name: app.name,
    device_id: device.id,
    device_name: device.device_name,
    agent_id: device.agent_id,
    request_type: action,
    status: "pending",
    user_justification: requestJustification.value,
    scheduled_for: requestScheduledFor.value || null,
  });
}

async function submitRequestDialog() {
  if (!requestTarget.value) return;
  submittingRequest.value = true;
  try {
    await submitRequest(requestTarget.value, requestType.value);
    const label = requestActionLabel.value;
    requestDialogOpen.value = false;
    $q.notify({
      message: requestTarget.value.approval_required === false ? `${label} started.` : `${label} request submitted. IT will review and approve.`,
      color: "positive",
      icon: "check",
    });
    await loadMyRequests();
    await loadCatalog();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to submit request", color: "negative" });
  } finally {
    submittingRequest.value = false;
  }
}

async function requestSelected(action = "install") {
  const selected = apps.value.filter((app) => selectedCatalogIds.value.includes(app.catalog_id));
  if (!selected.length) return;
  submittingRequest.value = true;
  try {
    let count = 0;
    for (const app of selected) {
      const itemAction = action === "install" && app.installed && app.update_available ? "update" : action;
      await submitRequest(app, itemAction);
      count += 1;
    }
    selectedCatalogIds.value = [];
    $q.notify({ message: `${count} request(s) submitted`, color: "positive", icon: "check" });
    await loadMyRequests();
    await loadCatalog();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Batch request failed", color: "negative" });
  } finally {
    submittingRequest.value = false;
  }
}

function openFeedback(app: any) {
  feedbackTarget.value = app;
  feedbackRequest.value = null;
  feedbackType.value = "Review";
  feedbackRating.value = 5;
  feedbackComment.value = "";
  feedbackDialogOpen.value = true;
}

function openFeedbackForRequest(row: any) {
  feedbackTarget.value = { name: row.app_name, catalog_id: row.catalog_id, id: row.app_id };
  feedbackRequest.value = row;
  feedbackType.value = row.status === "failed" ? "Install issue" : row.request_type === "uninstall" ? "Uninstall reason" : "Review";
  feedbackRating.value = row.status === "failed" ? 2 : 5;
  feedbackComment.value = "";
  feedbackDialogOpen.value = true;
}

async function submitFeedback() {
  if (!feedbackTarget.value) return;
  submittingFeedback.value = true;
  try {
    await axios.post("/appmanagement/ssp/feedback/", {
      request_id: feedbackRequest.value?.id || null,
      catalog_id: feedbackTarget.value.catalog_id,
      subject: feedbackTarget.value.name,
      type: feedbackType.value,
      rating: feedbackRating.value,
      message: feedbackComment.value,
    });
    feedbackDialogOpen.value = false;
    $q.notify({ message: "Feedback sent", color: "positive", icon: "check" });
  } catch {
    $q.notify({ message: "Failed to send feedback", color: "negative" });
  } finally {
    submittingFeedback.value = false;
  }
}

watch([selectedDeviceId, categoryFilter], () => {
  void loadCatalog();
});

onMounted(async () => {
  await loadMyDevices();
  await Promise.all([loadCatalog(), loadMyRequests()]);
});
</script>

<style scoped>
.app-card {
  transition: box-shadow 0.2s;
}
.app-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
