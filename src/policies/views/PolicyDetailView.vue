<template>
  <div class="policy-detail-page">
    <div class="policy-detail-layout">
      <!-- Sidebar -->
      <div class="detail-sidebar">
        <!-- Back link -->
        <router-link to="/policies" class="back-link">
          <q-icon name="chevron_left" size="20px" />
          <span>Policies</span>
        </router-link>

        <!-- Policy info -->
        <div class="policy-info" v-if="policy">
          <div class="policy-icon">
            <q-icon name="mdi-shield-check" size="28px" color="primary" />
          </div>
          <div class="policy-name-section">
            <div class="policy-name-row">
              <span v-if="!isEditingName" class="policy-name">{{
                policy.name
              }}</span>
              <q-input
                v-else
                v-model="editedName"
                dense
                outlined
                class="name-input"
                @keyup.enter="saveName"
                @keyup.escape="cancelEditName"
                autofocus
              />
              <q-btn
                v-if="!isEditingName"
                flat
                round
                dense
                icon="edit"
                size="sm"
                @click="startEditName"
              />
            </div>
            <span class="policy-meta"
              >v{{ policy.version }} - Updated
              {{ formatDate(policy.updated) }}</span
            >
          </div>
        </div>

        <!-- Segment -->
        <div class="segment-section" v-if="policy">
          <label class="section-label">Segment</label>
          <q-select
            v-model="policy.segment"
            :options="segments"
            outlined
            dense
            class="segment-select"
          >
            <template v-slot:prepend>
              <q-icon name="public" size="18px" />
            </template>
          </q-select>
        </div>

        <!-- Save button -->
        <q-btn
          :disable="!hasChanges"
          :color="hasChanges ? 'primary' : 'grey'"
          unelevated
          class="save-btn"
          @click="saveChanges"
        >
          {{ hasChanges ? "Save changes" : "No changes" }}
        </q-btn>

        <!-- Navigation -->
        <q-list class="nav-list">
          <q-item
            v-for="item in navItems"
            :key="item.id"
            clickable
            :class="[
              'nav-item',
              { 'nav-item--active': activeSection === item.id },
            ]"
            @click="setActiveSection(item.id)"
          >
            <q-item-section avatar class="nav-icon">
              <q-icon :name="item.icon" size="20px" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
            <q-item-section v-if="item.count !== undefined" side>
              <q-badge
                :label="item.count"
                :class="[
                  'nav-badge',
                  { 'nav-badge--active': activeSection === item.id },
                ]"
              />
            </q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item
            clickable
            class="nav-item add-config-item"
            @click="showAddConfigMenu = true"
          >
            <q-item-section avatar class="nav-icon">
              <q-icon name="add" size="20px" />
            </q-item-section>
            <q-item-section>Add configuration</q-item-section>
            <q-menu v-model="showAddConfigMenu">
              <q-list dense style="min-width: 180px">
                <q-item
                  clickable
                  v-close-popup
                  @click="showAddAppDialog = true"
                >
                  <q-item-section avatar>
                    <q-icon name="apps" size="sm" />
                  </q-item-section>
                  <q-item-section>Add App</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="showAddScriptDialog = true"
                >
                  <q-item-section avatar>
                    <q-icon name="code" size="sm" />
                  </q-item-section>
                  <q-item-section>Add Script</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="showAddResourceDialog = true"
                >
                  <q-item-section avatar>
                    <q-icon name="folder" size="sm" />
                  </q-item-section>
                  <q-item-section>Add Resource</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
        </q-list>
      </div>

      <!-- Main Content -->
      <div class="detail-content" v-if="policy">
        <!-- ===== SUMMARY SECTION ===== -->
        <template v-if="activeSection === 'summary'">
          <!-- Summary Cards Row -->
          <div class="summary-row">
            <PolicySectionCard
              title="App"
              :count="appCount"
              empty-text="No apps added yet"
              @view="setActiveSection('apps')"
            />
            <PolicySectionCard
              title="Scripts"
              :count="scriptCount"
              empty-text="No scripts added yet"
              @view="setActiveSection('scripts')"
            />
            <PolicySectionCard
              title="Resources"
              :count="resourceCount"
              empty-text="No resources added yet"
              @view="setActiveSection('resources')"
            />
          </div>

          <!-- Application Control Card -->
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-shield-lock" size="24px" color="grey-7" />
                <span class="config-card__title">Application Control</span>
              </div>
              <q-btn
                flat
                dense
                color="primary"
                label="View"
                class="view-btn"
                @click="setActiveSection('app-control')"
              />
            </div>
            <div class="config-card__body">
              <div class="token-section">
                <label class="token-label">Tokens*</label>
                <q-input
                  v-model="applicationControlToken"
                  outlined
                  dense
                  placeholder="Id"
                  class="token-input"
                />
              </div>
            </div>
          </div>

          <!-- Assigned Devices -->
          <AssignedDevicesTable
            :devices="assignedDevices"
            @assign="showAssignDeviceDialog = true"
            @unassign="unassignDevice"
            @refresh="loadPolicy"
            @view-jobs="showDeliveryJobsDialog = true"
          />
        </template>

        <!-- ===== APPS SECTION ===== -->
        <template v-if="activeSection === 'apps'">
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-apps" size="24px" color="primary" />
                <span class="config-card__title">Apps</span>
                <q-badge
                  v-if="appCount > 0"
                  :label="appCount"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
              <q-btn
                unelevated
                color="primary"
                class="add-item-btn"
                @click="showAddAppDialog = true"
              >
                <q-icon name="add" size="18px" class="q-mr-xs" />
                Add App
              </q-btn>
            </div>

            <q-table
              v-if="policy.apps.length > 0"
              :rows="policy.apps"
              :columns="appColumns"
              row-key="id"
              flat
              class="config-table"
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
            >
              <template v-slot:body-cell-verification="props">
                <q-td :props="props">
                  <q-chip dense outline size="sm" color="grey-7">
                    {{ props.row.verification.method }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-silentInstall="props">
                <q-td :props="props">
                  <q-icon
                    :name="props.row.silentInstall ? 'check_circle' : 'cancel'"
                    :color="props.row.silentInstall ? 'positive' : 'grey-5'"
                    size="20px"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-timeout="props">
                <q-td :props="props"> {{ props.row.timeout }}s </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="confirmRemoveApp(props.row.id, props.row.name)"
                  >
                    <q-tooltip>Remove app</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>

            <div v-else class="config-card__empty">
              <q-icon name="mdi-package-variant" size="48px" color="grey-4" />
              <p class="config-card__empty-text">No apps added yet</p>
              <p class="config-card__empty-hint">
                Click "Add App" to add an application to this policy
              </p>
            </div>
          </div>
        </template>

        <!-- ===== SCRIPTS SECTION ===== -->
        <template v-if="activeSection === 'scripts'">
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-code-brackets" size="24px" color="primary" />
                <span class="config-card__title">Scripts</span>
                <q-badge
                  v-if="scriptCount > 0"
                  :label="scriptCount"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
              <q-btn
                unelevated
                color="primary"
                class="add-item-btn"
                @click="showAddScriptDialog = true"
              >
                <q-icon name="add" size="18px" class="q-mr-xs" />
                Add Script
              </q-btn>
            </div>

            <q-table
              v-if="policy.scripts.length > 0"
              :rows="policy.scripts"
              :columns="scriptColumns"
              row-key="id"
              flat
              class="config-table"
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
            >
              <template v-slot:body-cell-timeout="props">
                <q-td :props="props"> {{ props.row.timeout }}s </q-td>
              </template>
              <template v-slot:body-cell-runAsUser="props">
                <q-td :props="props">
                  <q-icon
                    :name="props.row.runAsUser ? 'check_circle' : 'cancel'"
                    :color="props.row.runAsUser ? 'positive' : 'grey-5'"
                    size="20px"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="confirmRemoveScript(props.row.id, props.row.name)"
                  >
                    <q-tooltip>Remove script</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>

            <div v-else class="config-card__empty">
              <q-icon
                name="mdi-script-text-outline"
                size="48px"
                color="grey-4"
              />
              <p class="config-card__empty-text">No scripts added yet</p>
              <p class="config-card__empty-hint">
                Click "Add Script" to add a script to this policy
              </p>
            </div>
          </div>
        </template>

        <!-- ===== RESOURCES SECTION ===== -->
        <template v-if="activeSection === 'resources'">
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-folder-outline" size="24px" color="primary" />
                <span class="config-card__title">Resources</span>
                <q-badge
                  v-if="resourceCount > 0"
                  :label="resourceCount"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
              <q-btn
                unelevated
                color="primary"
                class="add-item-btn"
                @click="showAddResourceDialog = true"
              >
                <q-icon name="add" size="18px" class="q-mr-xs" />
                Add Resource
              </q-btn>
            </div>

            <q-table
              v-if="policy.resources.length > 0"
              :rows="policy.resources"
              :columns="resourceColumns"
              row-key="id"
              flat
              class="config-table"
              :pagination="{ rowsPerPage: 0 }"
              hide-pagination
            >
              <template v-slot:body-cell-type="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    outline
                    size="sm"
                    :color="getResourceTypeColor(props.row.type)"
                  >
                    {{ props.row.type }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-scope="props">
                <q-td :props="props">
                  <q-chip dense outline size="sm" color="grey-7">
                    {{ formatScope(props.row.scope) }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-locations="props">
                <q-td :props="props">
                  <div class="locations-cell">
                    <span v-for="(loc, i) in (props.row.locations as string[])" :key="i" class="location-path">
                      {{ loc }}{{ i < (props.row.locations as string[]).length - 1 ? ', ' : '' }}
                    </span>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" auto-width>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="confirmRemoveResource(props.row.id, props.row.name)"
                  >
                    <q-tooltip>Remove resource</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>

            <div v-else class="config-card__empty">
              <q-icon
                name="mdi-file-document-outline"
                size="48px"
                color="grey-4"
              />
              <p class="config-card__empty-text">No resources added yet</p>
              <p class="config-card__empty-hint">
                Click "Add Resource" to add a resource to this policy
              </p>
            </div>
          </div>
        </template>

        <!-- ===== APPLICATION CONTROL SECTION ===== -->
        <template v-if="activeSection === 'app-control'">
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-shield-lock" size="24px" color="grey-7" />
                <span class="config-card__title">Application Control</span>
              </div>
            </div>
            <div class="config-card__body">
              <div class="token-section">
                <label class="token-label">Tokens*</label>
                <q-input
                  v-model="applicationControlToken"
                  outlined
                  dense
                  placeholder="Id"
                  class="token-input"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- ===== AGENT SECTION ===== -->
        <template v-if="activeSection === 'agent'">
          <div class="config-card">
            <div class="config-card__header">
              <div class="config-card__title-row">
                <q-icon name="mdi-broadcast" size="24px" color="grey-7" />
                <span class="config-card__title">Agent Settings</span>
              </div>
            </div>
            <div class="config-card__empty">
              <q-icon name="mdi-broadcast" size="48px" color="grey-4" />
              <p class="config-card__empty-text">Agent configuration</p>
              <p class="config-card__empty-hint">
                Agent settings will be available here
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- Loading state -->
      <div v-else class="loading-state">
        <q-spinner-dots size="40px" color="primary" />
        <p>Loading policy...</p>
      </div>
    </div>

    <!-- Dialogs -->
    <AddAppDialog v-model="showAddAppDialog" @add="handleAddApp" />

    <AddScriptDialog v-model="showAddScriptDialog" @add="handleAddScript" />

    <AddResourceDialog
      v-model="showAddResourceDialog"
      @add="handleAddResource"
    />

    <AssignDeviceDialog
      v-model="showAssignDeviceDialog"
      @deploy="handleDeployDevices"
    />

    <!-- Delivery Jobs Dialog -->
    <DeliveryJobsDialog v-model="showDeliveryJobsDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import PolicySectionCard from "../components/PolicySectionCard.vue";
import AssignedDevicesTable from "../components/AssignedDevicesTable.vue";
import AddAppDialog from "../components/dialogs/AddAppDialog.vue";
import AddScriptDialog from "../components/dialogs/AddScriptDialog.vue";
import AddResourceDialog from "../components/dialogs/AddResourceDialog.vue";
import AssignDeviceDialog from "../components/dialogs/AssignDeviceDialog.vue";
import DeliveryJobsDialog from "../components/dialogs/DeliveryJobsDialog.vue";
import { usePolicyDetail } from "../composables/usePolicyDetail";
import { SEGMENTS } from "../types/policies";
import type {
  PolicyApp,
  PolicyScript,
  PolicyResource,
  Scope,
} from "../types/policies";
import { formatRelativeTime } from "../mocks/policiesMockData";

const route = useRoute();
const $q = useQuasar();

const policyId = route.params.id as string;

const {
  policy,
  hasChanges,
  activeSection,
  assignedDevices,
  appCount,
  scriptCount,
  resourceCount,
  saveChanges: savePolicy,
  updateName,
  addApp,
  removeApp,
  addScript,
  removeScript,
  addResource,
  removeResource,
  // assignDevices,  // TODO: will be re-enabled later
  deployToDevices,
  unassignDevice: removeDevice,
  setActiveSection,
  loadPolicy,
} = usePolicyDetail(policyId);

// Local state
const isEditingName = ref(false);
const editedName = ref("");
const showAddConfigMenu = ref(false);
const showAddAppDialog = ref(false);
const showAddScriptDialog = ref(false);
const showAddResourceDialog = ref(false);
const showAssignDeviceDialog = ref(false);
const showDeliveryJobsDialog = ref(false);
const applicationControlToken = ref("");

const segments = SEGMENTS;

// Navigation items
const navItems = computed(() => [
  { id: "summary", label: "Summary", icon: "mdi-check-circle-outline" },
  { id: "apps", label: "Apps", icon: "mdi-apps", count: appCount.value },
  {
    id: "scripts",
    label: "Scripts",
    icon: "mdi-code-brackets",
    count: scriptCount.value,
  },
  {
    id: "resources",
    label: "Resources",
    icon: "mdi-folder-outline",
    count: resourceCount.value,
  },
  { id: "agent", label: "Agent", icon: "mdi-broadcast" },
  {
    id: "app-control",
    label: "Application Control",
    icon: "mdi-shield-lock-outline",
    count: policy.value?.applicationControl?.tokens.length ?? 0,
  },
]);

function formatDate(dateString: string): string {
  return formatRelativeTime(dateString);
}

// Table column definitions
const appColumns = [
  { name: "name", label: "NAME", field: "name", align: "left" as const },
  {
    name: "version",
    label: "VERSION",
    field: "version",
    align: "left" as const,
  },
  {
    name: "silentInstall",
    label: "SILENT",
    field: "silentInstall",
    align: "center" as const,
  },
  {
    name: "timeout",
    label: "TIMEOUT",
    field: "timeout",
    align: "left" as const,
  },
  {
    name: "verification",
    label: "VERIFICATION",
    field: "verification",
    align: "left" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const scriptColumns = [
  { name: "name", label: "NAME", field: "name", align: "left" as const },
  {
    name: "timeout",
    label: "TIMEOUT",
    field: "timeout",
    align: "left" as const,
  },
  {
    name: "runAsUser",
    label: "RUN AS USER",
    field: "runAsUser",
    align: "center" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const resourceColumns = [
  { name: "name", label: "NAME", field: "name", align: "left" as const },
  { name: "type", label: "TYPE", field: "type", align: "left" as const },
  { name: "scope", label: "SCOPE", field: "scope", align: "left" as const },
  {
    name: "locations",
    label: "LOCATIONS",
    field: "locations",
    align: "left" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

function getResourceTypeColor(type: string): string {
  switch (type) {
    case "book":
      return "blue-7";
    case "certificate":
      return "orange-7";
    case "image":
      return "green-7";
    default:
      return "grey-7";
  }
}

function formatScope(scope: Scope): string {
  switch (scope) {
    case "primary_user":
      return "Primary user";
    case "all_users":
      return "All users";
    case "system":
      return "System";
    default:
      return scope;
  }
}

function startEditName() {
  if (policy.value) {
    editedName.value = policy.value.name;
    isEditingName.value = true;
  }
}

function saveName() {
  if (editedName.value.trim()) {
    updateName(editedName.value.trim());
    isEditingName.value = false;
  }
}

function cancelEditName() {
  isEditingName.value = false;
}

function saveChanges() {
  savePolicy();
  $q.notify({
    message: "Policy saved successfully",
    color: "positive",
    position: "top",
    icon: "check_circle",
  });
}

function confirmRemoveApp(appId: string, appName: string) {
  $q.dialog({
    title: "Remove App",
    message: `Are you sure you want to remove "${appName}" from this policy?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeApp(appId);
    $q.notify({
      message: `App "${appName}" removed`,
      color: "info",
      position: "top",
    });
  });
}

function confirmRemoveScript(scriptId: string, scriptName: string) {
  $q.dialog({
    title: "Remove Script",
    message: `Are you sure you want to remove "${scriptName}" from this policy?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeScript(scriptId);
    $q.notify({
      message: `Script "${scriptName}" removed`,
      color: "info",
      position: "top",
    });
  });
}

function confirmRemoveResource(resourceId: string, resourceName: string) {
  $q.dialog({
    title: "Remove Resource",
    message: `Are you sure you want to remove "${resourceName}" from this policy?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeResource(resourceId);
    $q.notify({
      message: `Resource "${resourceName}" removed`,
      color: "info",
      position: "top",
    });
  });
}

function handleAddApp(app: PolicyApp) {
  addApp(app);
  $q.notify({
    message: `App "${app.name}" added to policy`,
    color: "positive",
    position: "top",
  });
}

function handleAddScript(script: PolicyScript) {
  addScript(script);
  $q.notify({
    message: `Script "${script.name}" added to policy`,
    color: "positive",
    position: "top",
  });
}

function handleAddResource(resource: PolicyResource) {
  addResource(resource);
  $q.notify({
    message: `Resource "${resource.name}" added to policy`,
    color: "positive",
    position: "top",
  });
}

// TODO: handleAssignDevices - will be re-enabled later
// async function handleAssignDevices(deviceIds: number[]) {
//   try {
//     await assignDevices(deviceIds);
//     $q.notify({
//       message: `${deviceIds.length} device(s) assigned to policy`,
//       color: "positive",
//       position: "top",
//     });
//   } catch (err) {
//     $q.notify({
//       message: "Failed to assign devices",
//       color: "negative",
//       position: "top",
//     });
//   }
// }

async function handleDeployDevices(deviceIds: number[]) {
  try {
    const result = await deployToDevices(deviceIds);

    if (result) {
      // Show success notification with delivery jobs count
      $q.notify({
        message: `Deployed to ${result.deviceCount} devices, ${result.deliveryJobsCreated.length} delivery jobs created`,
        color: "positive",
        position: "top",
        icon: "send",
        actions: result.deliveryJobsCreated.length > 0
          ? [
              {
                label: "View Jobs",
                color: "white",
                handler: () => {
                  // Navigate to delivery jobs page
                  // router.push('/files/delivery');
                },
              },
            ]
          : [],
      });
    }
  } catch (err) {
    $q.notify({
      message: "Failed to deploy policy",
      color: "negative",
      position: "top",
    });
  }
}

function unassignDevice(deviceId: number) {
  removeDevice(deviceId);
  $q.notify({
    message: "Device removed from policy",
    color: "info",
    position: "top",
  });
}
</script>

<style scoped>
.policy-detail-page {
  height: 100%;
  background: var(--page-bg, #f5f7fa);
}

.policy-detail-layout {
  display: flex;
  height: 100%;
}

/* Sidebar */
.detail-sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--sidebar-bg, #ffffff);
  border-right: 1px solid var(--border-color, #e8e8e8);
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--primary-color, #3b82f6);
}

.policy-info {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.policy-icon {
  width: 48px;
  height: 48px;
  background: var(--icon-bg, #eef2ff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.policy-name-section {
  flex: 1;
  min-width: 0;
}

.policy-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.policy-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.name-input {
  flex: 1;
}

.policy-meta {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  display: block;
  margin-top: 2px;
}

.segment-section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 8px;
}

.segment-select {
  width: 100%;
}

.save-btn {
  width: 100%;
  margin-bottom: 20px;
  text-transform: none;
  font-weight: 600;
}

.nav-list {
  flex: 1;
  padding: 0;
}

.nav-item {
  border-radius: 8px;
  margin-bottom: 2px;
  min-height: 40px;
}

.nav-item:hover {
  background: var(--hover-bg, #f5f7fa);
}

.nav-item--active {
  background: var(--active-bg, #eef6fc);
}

.nav-item--active .nav-icon :deep(.q-icon) {
  color: var(--primary-color, #3b82f6);
}

.nav-icon {
  min-width: 32px;
}

.nav-badge {
  background: var(--badge-bg, #e5e7eb);
  color: var(--text-secondary, #6b7280);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
}

.nav-badge--active {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.add-config-item {
  color: var(--text-secondary, #6b7280);
}

/* Main Content */
.detail-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* Config card (reusable section block) */
.config-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
}

.config-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.config-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.config-card__body {
  padding: 20px;
}

.config-card__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 8px;
}

.config-card__empty-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  margin: 0;
}

.config-card__empty-hint {
  font-size: 13px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

.add-item-btn {
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
}

.view-btn {
  text-transform: none;
  font-weight: 600;
}

/* Config tables */
.config-table {
  box-shadow: none;
}

.config-table :deep(th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-table :deep(td) {
  font-size: 14px;
  color: var(--text-primary, #1a1a2e);
}

.locations-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location-path {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.token-section {
  max-width: 300px;
}

.token-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
  margin-bottom: 8px;
}

.token-input {
  width: 100%;
}

/* Loading state */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary, #6b7280);
}

/* Dark theme */
.body--dark .policy-detail-page {
  --page-bg: #121218;
  --sidebar-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --hover-bg: #2a2a3d;
  --active-bg: #1a3a5c;
  --icon-bg: #2a2a3d;
  --card-bg: #1e1e2d;
  --badge-bg: #3d3d4d;
}

/* Responsive */
@media (max-width: 1200px) {
  .summary-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .policy-detail-layout {
    flex-direction: column;
  }

  .detail-sidebar {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .summary-row {
    grid-template-columns: 1fr;
  }
}
</style>
