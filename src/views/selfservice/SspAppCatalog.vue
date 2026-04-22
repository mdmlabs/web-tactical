<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Application Catalog</div>
      <div class="row q-gutter-sm">
        <q-input v-model="search" placeholder="Search apps..." dense outlined clearable style="min-width: 200px">
          <template v-slot:prepend><q-icon name="search" /></template>
        </q-input>
        <q-select v-model="categoryFilter" :options="['All', ...categories]" dense outlined label="Category" style="min-width: 150px" />
      </div>
    </div>

    <!-- Forced Update Warnings -->
    <q-banner v-if="outdatedInstallations.length > 0" class="bg-orange-1 q-mb-md" rounded>
      <template v-slot:avatar><q-icon name="warning" color="orange" /></template>
      <strong>Forced Update Required:</strong> You have {{ outdatedInstallations.length }} app(s) with outdated versions that must be updated.
    </q-banner>

    <!-- App grid -->
    <div class="row q-col-gutter-md">
      <div v-for="app in filteredApps" :key="app.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="app-card full-height">
          <!-- Blacklisted overlay (admin only) -->
          <q-badge v-if="app.blacklisted" color="negative" floating label="BLACKLISTED" />
          <q-badge v-if="app.licenseStatus === 'expired'" color="red" floating style="top: 28px" label="LICENSE EXPIRED" />
          <q-badge v-else-if="app.licenseStatus === 'warning'" color="orange" floating style="top: 28px" label="LICENSE WARNING" />

          <q-card-section class="text-center q-pb-none">
            <q-icon :name="app.icon" size="48px" :color="app.blacklisted ? 'grey' : 'primary'" />
            <div class="text-subtitle1 text-weight-bold q-mt-sm">{{ app.name }}</div>
            <div class="text-caption text-grey">{{ app.category }}</div>
            <div class="row justify-center q-mt-xs">
              <q-rating v-model="app.rating" size="xs" color="orange" readonly />
              <span class="text-caption q-ml-xs">({{ app.rating }})</span>
            </div>
          </q-card-section>

          <q-card-section class="text-caption q-pt-sm">
            {{ app.description }}
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row items-center text-caption text-grey">
              <span>v{{ app.version }}</span>
              <q-icon v-if="app.version !== app.latestVersion" name="arrow_forward" size="xs" class="q-mx-xs" color="warning" />
              <span v-if="app.version !== app.latestVersion" class="text-warning">v{{ app.latestVersion }}</span>
              <q-space />
              <q-chip v-if="app.requiresApproval" dense size="sm" color="orange-2" text-color="orange-9">Approval</q-chip>
            </div>
            <!-- Deprecation warning -->
            <div v-if="app.deprecationDate" class="text-caption text-negative q-mt-xs">
              <q-icon name="event" size="xs" /> Removal: {{ app.deprecationDate }}
              <span v-if="daysUntil(app.deprecationDate) <= 7"> ({{ daysUntil(app.deprecationDate) }}d left!)</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="justify-center">
            <template v-if="!app.blacklisted">
              <q-btn
                v-if="!getInstallation(app.id)"
                flat
                dense
                color="primary"
                label="Install"
                icon="download"
                @click="installApp(app)"
              />
              <template v-else>
                <q-badge :color="getStatusColor(getInstallation(app.id)!.status)" class="q-mr-sm">
                  {{ getInstallation(app.id)!.status }}
                </q-badge>
                <q-btn
                  v-if="getInstallation(app.id)!.status === 'installed' && app.version !== app.latestVersion"
                  flat dense color="warning" label="Update" icon="update" size="sm"
                  @click="updateApp(app)"
                />
                <q-btn
                  v-if="getInstallation(app.id)!.status === 'installed'"
                  flat dense color="negative" icon="delete" size="sm"
                  @click="uninstall(getInstallation(app.id)!)"
                >
                  <q-tooltip>Uninstall</q-tooltip>
                </q-btn>
              </template>
            </template>
            <span v-else class="text-grey text-caption">Blocked by administrator</span>

            <!-- Admin actions -->
            <template v-if="store.isAdmin">
              <q-separator vertical class="q-mx-xs" />
              <q-btn flat dense :icon="app.blacklisted ? 'lock_open' : 'block'" :color="app.blacklisted ? 'positive' : 'negative'" size="sm" @click="store.toggleBlacklist(app.id)">
                <q-tooltip>{{ app.blacklisted ? 'Unblock' : 'Block' }}</q-tooltip>
              </q-btn>
              <q-btn flat dense icon="event" color="purple" size="sm" @click="setDeprecation(app)">
                <q-tooltip>Set Deprecation</q-tooltip>
              </q-btn>
            </template>
          </q-card-actions>

          <!-- Patches section -->
          <q-expansion-item v-if="app.patches.length > 0" dense icon="update" label="Patches" class="text-caption">
            <q-list dense separator>
              <q-item v-for="patch in app.patches" :key="patch.id">
                <q-item-section avatar>
                  <q-icon :name="patch.critical ? 'priority_high' : 'update'" :color="patch.critical ? 'negative' : 'grey'" size="xs" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>v{{ patch.version }}</q-item-label>
                  <q-item-label caption>{{ patch.description }} ({{ patch.releaseDate }})</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="q-mt-xl">
      <div class="text-h6 q-mb-md">Installation Inventory</div>
      <q-table
        flat
        bordered
        :rows="store.installations"
        :columns="inventoryColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">{{ props.row.status }}</q-badge>
            <q-spinner-dots v-if="props.row.status === 'installing'" color="primary" size="xs" class="q-ml-xs" />
          </q-td>
        </template>
        <template v-slot:body-cell-license="props">
          <q-td :props="props">
            <q-badge :color="getLicenseColor(props.row.appId)">{{ getLicenseStatus(props.row.appId) }}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="props.row.status === 'installed'" flat dense icon="delete" color="negative" size="sm" @click="uninstall(props.row)">
              <q-tooltip>Uninstall</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Install dialog -->
    <q-dialog v-model="showInstallDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Install {{ installTarget?.name }}</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="installDevice" :options="deviceOptions" label="Select Device" outlined dense emit-value map-options />
          <div v-if="installTarget?.requiresApproval" class="text-caption text-orange q-mt-sm">
            <q-icon name="info" /> This application requires administrator approval before installation.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showInstallDialog = false" />
          <q-btn color="primary" :label="installTarget?.requiresApproval ? 'Request Install' : 'Install'" @click="confirmInstall" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Deprecation date dialog -->
    <q-dialog v-model="showDeprecationDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Set Deprecation Date</div>
          <div class="text-caption text-grey">App: {{ deprecationTarget?.name }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="deprecationDate" type="date" outlined dense label="Deprecation Date" />
          <div class="text-caption text-grey q-mt-sm">
            Users will be notified 7 days before this date. The app will be automatically removed on this date.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Remove Date" color="negative" @click="clearDeprecation" />
          <q-btn flat label="Cancel" @click="showDeprecationDialog = false" />
          <q-btn color="primary" label="Set Date" @click="confirmDeprecation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore, type SspApp, type SspInstallation } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const search = ref("");
const categoryFilter = ref("All");
const showInstallDialog = ref(false);
const showDeprecationDialog = ref(false);
const installTarget = ref<SspApp | null>(null);
const installDevice = ref("");
const deprecationTarget = ref<SspApp | null>(null);
const deprecationDate = ref("");

const categories = computed(() => [...new Set(store.apps.map((a) => a.category))]);

const filteredApps = computed(() => {
  let result = store.visibleApps;
  if (categoryFilter.value && categoryFilter.value !== "All") {
    result = result.filter((a) => a.category === categoryFilter.value);
  }
  if (search.value) {
    const q = search.value.toLowerCase();
    result = result.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }
  return result;
});

const deviceOptions = computed(() => store.devices.map((d) => ({ label: d.name, value: d.id })));

const outdatedInstallations = computed(() =>
  store.installations.filter((inst) => {
    if (inst.status !== "installed") return false;
    const app = store.apps.find((a) => a.id === inst.appId);
    return app && app.version !== app.latestVersion;
  }),
);

const inventoryColumns = [
  { name: "appName", label: "Application", field: "appName", align: "left" as const, sortable: true },
  { name: "deviceName", label: "Device", field: "deviceName", align: "left" as const, sortable: true },
  { name: "version", label: "Version", field: "version", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const, sortable: true },
  { name: "license", label: "License", field: "license", align: "center" as const },
  { name: "requestedAt", label: "Requested", field: "requestedAt", align: "left" as const, sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];

function getInstallation(appId: string) {
  return store.installations.find((i) => i.appId === appId && i.status !== "rejected");
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: "orange", approved: "info", installing: "info", installed: "positive", failed: "negative", rejected: "negative",
  };
  return map[status] || "grey";
}

function getLicenseStatus(appId: string) {
  const app = store.apps.find((a) => a.id === appId);
  return app?.licenseStatus?.toUpperCase() || "N/A";
}

function getLicenseColor(appId: string) {
  const app = store.apps.find((a) => a.id === appId);
  if (!app) return "grey";
  return app.licenseStatus === "ok" ? "positive" : app.licenseStatus === "warning" ? "warning" : "negative";
}

function daysUntil(date: string | null) {
  if (!date) return 999;
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function installApp(app: SspApp) {
  if (store.devices.length === 0) {
    $q.notify({ type: "negative", message: "Please add a device first before installing apps" });
    return;
  }
  installTarget.value = app;
  installDevice.value = store.devices[0].id;
  showInstallDialog.value = true;
}

function confirmInstall() {
  if (!installDevice.value) {
    $q.notify({ type: "negative", message: "Please select a device" });
    return;
  }
  store.requestInstall(installTarget.value!.id, installDevice.value);
  showInstallDialog.value = false;
  const msg = installTarget.value!.requiresApproval
    ? "Installation request submitted for approval"
    : "Installation started";
  $q.notify({ type: "positive", message: msg });
}

function updateApp(app: SspApp) {
  const inst = getInstallation(app.id);
  if (inst) {
    store.updateAppVersion(inst.id, app.latestVersion);
    $q.notify({ type: "positive", message: `Updating ${app.name} to v${app.latestVersion}` });
  }
}

function uninstall(inst: SspInstallation) {
  $q.dialog({
    title: "Uninstall Application",
    message: `Are you sure you want to uninstall ${inst.appName} from ${inst.deviceName}?`,
    cancel: true,
  }).onOk(() => {
    store.uninstallApp(inst.id);
    $q.notify({ type: "positive", message: `${inst.appName} uninstalled successfully` });
  });
}

function setDeprecation(app: SspApp) {
  deprecationTarget.value = app;
  deprecationDate.value = app.deprecationDate || "";
  showDeprecationDialog.value = true;
}

function confirmDeprecation() {
  if (!deprecationDate.value) {
    $q.notify({ type: "negative", message: "Please select a date" });
    return;
  }
  store.setDeprecationDate(deprecationTarget.value!.id, deprecationDate.value);
  showDeprecationDialog.value = false;
  $q.notify({ type: "positive", message: `Deprecation date set to ${deprecationDate.value}` });
}

function clearDeprecation() {
  store.setDeprecationDate(deprecationTarget.value!.id, null);
  showDeprecationDialog.value = false;
  $q.notify({ type: "positive", message: "Deprecation date removed" });
}
</script>

<style scoped>
.app-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>
