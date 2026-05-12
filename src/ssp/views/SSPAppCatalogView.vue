<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('ssp.views.SSPAppCatalogView.788bd0') }}</div>
    <div class="text-body2 text-grey q-mb-md">
      {{ $t('ssp.views.SSPAppCatalogView.25d640') }}
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
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
      <div class="col-12 col-md-3">
        <q-select
          v-model="categoryFilter"
          :options="catalogCategories"
          dense outlined
          label="Category"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="search"
          dense outlined :placeholder="$t('ssp.views.SSPAppCatalogView.b5ac67')" clearable
        >
          <template v-slot:prepend><q-icon name="search" /></template>
        </q-input>
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
          <div class="row items-center q-mb-sm">
            <q-avatar color="primary" text-color="white" :icon="app.source === 'external' ? 'open_in_new' : 'apps'" size="40px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2">{{ app.name }}</div>
              <div class="text-caption text-grey">{{ app.category || "General" }} · {{ app.source === 'external' ? 'External link' : 'Internal app' }}</div>
            </div>
          </div>
          <div class="text-caption text-grey ellipsis-2-lines">
            {{ app.description || "No description available." }}
          </div>
          <div class="text-caption text-grey q-mt-xs" v-if="app.version || app.latest_version || app.installed_version">
            Version: {{ app.installed_version || app.version || "not installed" }}
            <span v-if="app.latest_version"> · Latest: {{ app.latest_version }}</span>
          </div>
          <div class="row q-gutter-xs q-mt-sm">
            <q-chip v-if="app.installed" dense color="positive" text-color="white" icon="check">Installed</q-chip>
            <q-chip v-if="app.update_available" dense color="warning" text-color="dark" icon="system_update">Update</q-chip>
            <q-chip v-if="app.force_update_required" dense color="negative" text-color="white" icon="priority_high">Required</q-chip>
            <q-chip v-if="app.approval_required === false" dense color="info" text-color="white" icon="flash_on">Auto</q-chip>
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
            @click="requestInstall(app, 'install')"
          />
          <q-btn
            v-if="app.source !== 'external' && isActionIdle(app) && app.installed && app.update_available"
            flat dense color="primary" icon="system_update_alt"
            label="Update"
            @click="requestInstall(app, 'update')"
          />
          <q-btn
            v-if="app.source !== 'external' && isActionIdle(app) && app.installed"
            flat dense color="negative" icon="delete"
            label="Uninstall"
            @click="requestInstall(app, 'uninstall')"
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
      </q-table>
    </div>

    <q-dialog v-model="feedbackDialogOpen">
      <q-card style="min-width: 420px">
        <q-bar>
          Feedback
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-subtitle2">{{ feedbackTarget?.name }}</div>
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
const categoryFilter = ref("All");
const catalogCategoriesFromApi = ref<string[]>([]);
const feedbackDialogOpen = ref(false);
const feedbackTarget = ref<any | null>(null);
const feedbackRating = ref(5);
const feedbackComment = ref("");
const submittingFeedback = ref(false);

const filteredApps = computed(() => {
  if (!search.value) return apps.value;
  const q = search.value.toLowerCase();
  return apps.value.filter((a) =>
    a.name?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
  );
});

const requestColumns = [
  { name: "app_name", label: "App", field: "app_name", align: "left" as const },
  { name: "request_type", label: "Type", field: "request_type", align: "center" as const },
  { name: "device_name", label: "Device", field: "device_name", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left" as const },
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

function getAppStatus(app: any): string {
  const req = myRequests.value.find((r) =>
    (r.catalog_id && r.catalog_id === app.catalog_id)
    || (r.app_id === app.id && r.app_name === app.name)
  );
  if (!req) return "idle";
  return req.status === "approved" ? "installing" : req.status;
}

function isActionIdle(app: any): boolean {
  return !["pending", "approved", "installing"].includes(getAppStatus(app));
}

function statusColor(status: string) {
  return {
    pending: "warning",
    approved: "positive",
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

async function requestInstall(app: any, requestType = "install") {
  if (myDevices.value.length === 0) {
    $q.notify({ message: "Please enroll a device first before requesting apps.", color: "warning" });
    return;
  }

  const device = selectedDevice.value;
  if (!device || !device.agent_id) {
    $q.notify({ message: "Choose a managed device before requesting apps.", color: "warning" });
    return;
  }

  const actionLabels: Record<string, string> = {
    install: "Install",
    update: "Update",
    uninstall: "Uninstall",
  };
  const label = actionLabels[requestType] || "Install";

  $q.dialog({
    title: `${label} "${app.name}"?`,
    message: `Request ${label.toLowerCase()} of ${app.name} on your device "${device.device_name}".`,
    cancel: true,
    ok: { label: app.approval_required === false ? "Start" : "Request", color: requestType === "uninstall" ? "negative" : "primary" },
  }).onOk(async () => {
    try {
      await axios.post("/appmanagement/ssp/install-requests/", {
        app_id: app.id,
        catalog_id: app.catalog_id,
        app_name: app.name,
        device_id: device.id,
        device_name: device.device_name,
        agent_id: device.agent_id,
        request_type: requestType,
        status: "pending",
      });
      $q.notify({
        message: app.approval_required === false ? `${label} started.` : `${label} request submitted. IT will review and approve.`,
        color: "positive",
        icon: "check",
      });
      await loadMyRequests();
      await loadCatalog();
    } catch {
      $q.notify({ message: "Failed to submit request", color: "negative" });
    }
  });
}

function openFeedback(app: any) {
  feedbackTarget.value = app;
  feedbackRating.value = 5;
  feedbackComment.value = "";
  feedbackDialogOpen.value = true;
}

async function submitFeedback() {
  if (!feedbackTarget.value) return;
  submittingFeedback.value = true;
  try {
    await axios.post("/appmanagement/ssp/feedback/", {
      subject: feedbackTarget.value.name,
      type: "App Catalog",
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
