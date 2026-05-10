<template>
  <q-page class="ssp-rights-page">
    <div class="row items-start justify-between q-mb-md q-col-gutter-md">
      <div>
        <div class="text-h6">My Rights and Policies</div>
        <div class="text-caption text-grey-7">
          Access, policy status, and self-service requests for your account.
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="visibility"
          label="Privacy visualization"
          @click="privacyDialogOpen = true"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Request access"
          @click="openRequestDialog()"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner size="40px" />
    </div>

    <div v-else class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 q-mb-sm">Account</div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="person"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Username</q-item-label>
                    <q-item-label>{{ profile.username }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="email"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Email</q-item-label>
                    <q-item-label>{{ profile.email || "-" }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="badge"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Role</q-item-label>
                    <q-item-label>{{
                      profileDetails.role || profile.user_type || "User"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="devices"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Devices</q-item-label>
                    <q-item-label
                      >{{ devices.length }} enrolled,
                      {{ managedDeviceCount }} managed</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle1">Security</div>
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="lock_reset"
                  label="Change password"
                  @click="showChangePwDialog = true"
                />
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="check_circle" color="positive"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Status</q-item-label>
                    <q-item-label>
                      <q-chip
                        dense
                        :color="profile.is_active ? 'positive' : 'negative'"
                        text-color="white"
                        size="sm"
                      >
                        {{ profile.is_active ? "Active" : "Inactive" }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="login"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Last login</q-item-label>
                    <q-item-label>{{
                      profile.last_login
                        ? formatDate(profile.last_login)
                        : "Never"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar
                    ><q-icon name="groups"
                  /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Groups</q-item-label>
                    <q-item-label>{{ groupLabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <div class="text-subtitle1">Applied Rights and Policies</div>
              <div class="text-caption text-grey-7">
                Policies currently associated with your account and managed
                devices.
              </div>
            </div>
            <q-input
              v-model="policySearch"
              dense
              outlined
              clearable
              placeholder="Search policies"
              style="width: 260px"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="row items-center q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-4">
              <q-select
                v-model="policyCategoryFilter"
                :options="policyCategoryOptions"
                dense
                outlined
                emit-value
                map-options
                label="Policy category"
              />
            </div>
            <div class="col-12 col-md-auto">
              <q-btn
                outline
                color="primary"
                icon="policy"
                label="Add policy request"
                @click="openPolicyRequest"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="policy in filteredPolicies"
              :key="policy.id || policy.name"
              class="col-12 col-md-6"
            >
              <q-item dense class="policy-row">
                <q-item-section avatar>
                  <q-icon
                    :name="policy.icon || 'policy'"
                    :color="
                      policy.color || (policy.enforced ? 'primary' : 'grey')
                    "
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ policy.name }}</q-item-label>
                  <q-item-label caption>{{ policy.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    dense
                    :color="policy.enforced ? 'primary' : 'grey'"
                    text-color="white"
                    size="sm"
                  >
                    {{ policy.enforced ? "Enforced" : "Advisory" }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </div>
            <div
              v-if="!filteredPolicies.length"
              class="col-12 text-grey-7 q-pa-sm"
            >
              No matching policies.
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 q-mb-xs">
            Privacy and Device Management Visibility
          </div>
          <div class="text-caption text-grey-7 q-mb-md">
            What organization management can request for your enrolled devices
            and account.
          </div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="item in privacyCapabilities"
              :key="item.id"
              class="col-12 col-md-6"
            >
              <q-item dense class="policy-row">
                <q-item-section avatar>
                  <q-icon
                    :name="item.icon"
                    :color="item.enabled ? item.color : 'grey'"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption>{{ item.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    dense
                    :color="item.enabled ? item.color : 'grey'"
                    text-color="white"
                    size="sm"
                  >
                    {{ item.enabled ? item.status : "Disabled" }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </div>
          </div>
          <div v-if="settings.privacy_terms" class="privacy-terms q-mt-md">
            {{ settings.privacy_terms }}
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <div class="text-subtitle1">Access and Policy Requests</div>
              <div class="text-caption text-grey-7">
                Create requests for new rights, policy exceptions, applications,
                network access, or workspace access.
              </div>
            </div>
            <q-btn
              flat
              color="primary"
              icon="refresh"
              label="Refresh"
              @click="loadRights"
            />
          </div>
          <q-table
            :rows="rights"
            :columns="rightColumns"
            row-key="id"
            dense
            flat
            bordered
            :loading="loadingRights"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  dense
                  :color="rightStatusColor(props.row.status)"
                  text-color="white"
                  >{{ props.row.status }}</q-chip
                >
              </q-td>
            </template>
            <template v-slot:body-cell-target="props">
              <q-td :props="props">
                <div>{{ props.row.device_name || "Account" }}</div>
                <div
                  v-if="props.row.target_agent_id"
                  class="text-caption text-grey-7"
                >
                  {{ props.row.target_agent_id }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  size="sm"
                  :disable="props.row.status !== 'pending'"
                  @click="openRequestDialog(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="cancel"
                  size="sm"
                  color="negative"
                  :disable="props.row.status !== 'pending'"
                  @click="cancelRight(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="privacyDialogOpen">
      <q-card style="min-width: 680px; max-width: 920px">
        <q-bar>
          <q-icon name="visibility" class="q-mr-sm" />
          Privacy visualization
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <div class="text-body2 text-grey-7 q-mb-md">
            This view maps what the organization can see or request for your
            account, enrolled devices, and corporate data.
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="item in privacyCapabilities"
              :key="`viz-${item.id}`"
              class="col-12 col-md-6"
            >
              <q-card flat bordered class="privacy-visual-card">
                <q-card-section>
                  <div class="row items-start q-col-gutter-sm">
                    <div class="col-auto">
                      <q-icon
                        :name="item.icon"
                        :color="item.enabled ? item.color : 'grey'"
                        size="32px"
                      />
                    </div>
                    <div class="col">
                      <div class="text-subtitle2">{{ item.title }}</div>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        {{ item.description }}
                      </div>
                      <q-chip
                        dense
                        class="q-mt-sm"
                        :color="item.enabled ? item.color : 'grey'"
                        text-color="white"
                        size="sm"
                      >
                        {{ item.enabled ? item.status : "Disabled" }}
                      </q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <q-banner
            v-if="settings.privacy_terms"
            class="bg-blue-1 text-blue-10 rounded-borders q-mt-md"
          >
            {{ settings.privacy_terms }}
          </q-banner>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="requestDialogOpen" persistent>
      <q-card style="min-width: 540px">
        <q-bar>
          {{ editingRight ? "Edit request" : "Request access or policy" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model.trim="rightForm.title"
            label="Title"
            outlined
            dense
          />
          <q-select
            v-model="rightForm.category"
            :options="rightCategoryOptions"
            label="Category"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-model="rightForm.target_device_id"
            :options="deviceOptions"
            label="Target device (optional)"
            outlined
            dense
            emit-value
            map-options
            clearable
          />
          <q-input
            v-model="rightForm.description"
            label="Requested right or policy"
            outlined
            dense
            type="textarea"
            rows="3"
          />
          <q-input
            v-model="rightForm.justification"
            label="Business justification"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save"
            :loading="savingRight"
            :disable="!rightForm.title"
            @click="saveRight"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showChangePwDialog" persistent>
      <q-card style="min-width: 380px">
        <q-bar class="bg-primary text-white">
          <q-icon name="lock_reset" class="q-mr-sm" />
          Change Password
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="pwForm.current"
            label="Current password"
            outlined
            dense
            type="password"
          />
          <q-input
            v-model="pwForm.newPw"
            label="New password"
            outlined
            dense
            type="password"
            :rules="[(v) => v.length >= 8 || 'At least 8 characters']"
          />
          <q-input
            v-model="pwForm.confirm"
            label="Confirm password"
            outlined
            dense
            type="password"
            :rules="[(v) => v === pwForm.newPw || 'Passwords do not match']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Change Password"
            @click="changePassword"
            :loading="changingPw"
            :disable="!pwForm.newPw || pwForm.newPw !== pwForm.confirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();

const loading = ref(false);
const loadingRights = ref(false);
const profile = ref<any>({});
const profileDetails = ref<any>({});
const devices = ref<any[]>([]);
const appliedPolicies = ref<any[]>([]);
const rights = ref<any[]>([]);
const settings = ref<any>({});
const policySearch = ref("");
const policyCategoryFilter = ref("all");
const requestDialogOpen = ref(false);
const privacyDialogOpen = ref(false);
const editingRight = ref<any | null>(null);
const savingRight = ref(false);
const showChangePwDialog = ref(false);
const changingPw = ref(false);
const pwForm = ref({ current: "", newPw: "", confirm: "" });
const rightForm = ref({
  title: "",
  category: "system_access",
  description: "",
  justification: "",
  target_device_id: null as number | null,
});

const rightCategoryOptions = [
  { label: "System access", value: "system_access" },
  { label: "Compliance policy", value: "compliance_policy" },
  { label: "Application", value: "application" },
  { label: "Network", value: "network" },
  { label: "Workspace", value: "workspace" },
  { label: "Other", value: "other" },
];
const policyCategoryOptions = [
  { label: "All policies", value: "all" },
  { label: "Compliance policy", value: "compliance_policy" },
  { label: "Application", value: "application" },
  { label: "Network", value: "network" },
  { label: "Workspace", value: "workspace" },
  { label: "System access", value: "system_access" },
  { label: "Other", value: "other" },
];

const rightColumns = [
  {
    name: "title",
    label: "Request",
    field: "title",
    align: "left",
    sortable: true,
  },
  {
    name: "category",
    label: "Category",
    field: "category",
    align: "left",
    sortable: true,
  },
  { name: "target", label: "Target", field: "target", align: "left" },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
    sortable: true,
  },
  {
    name: "requested_at",
    label: "Requested",
    field: "requested_at",
    align: "left",
    sortable: true,
  },
  {
    name: "admin_notes",
    label: "Admin notes",
    field: "admin_notes",
    align: "left",
  },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const managedDeviceCount = computed(
  () => devices.value.filter((d) => d.managed || d.agent_id).length,
);
const groupLabel = computed(
  () =>
    (profile.value.user_groups || [])
      .map((g: any) => g.name || `Group #${g}`)
      .join(", ") || "None",
);
const deviceOptions = computed(() =>
  devices.value.map((d) => ({
    label: `${d.device_name}${d.agent_id ? ` (${d.agent_id})` : ""}`,
    value: d.id,
  })),
);
const filteredPolicies = computed(() => {
  const q = policySearch.value.trim().toLowerCase();
  const category = policyCategoryFilter.value;
  return appliedPolicies.value.filter(
    (p) =>
      (category === "all" ||
        [p.category, p.type, p.policy_type]
          .map((v) => String(v || "").toLowerCase())
          .includes(category)) &&
      (!q ||
        String(p.name || "")
          .toLowerCase()
          .includes(q) ||
        String(p.description || "")
          .toLowerCase()
          .includes(q)),
  );
});
const privacyCapabilities = computed(() => [
  {
    id: "inventory",
    title: "Device inventory and compliance status",
    description:
      "Hostname, operating system, enrollment status, policy status, and last check-in are visible for managed devices.",
    icon: "devices",
    color: "primary",
    enabled: devices.value.length > 0,
    status: "Visible",
  },
  {
    id: "lock",
    title: "Lock and reset local password",
    description:
      "A managed linked device can receive safe lock and password reset commands through the audited SSP action channel.",
    icon: "lock",
    color: "warning",
    enabled: managedDeviceCount.value > 0,
    status: "Audited",
  },
  {
    id: "org-data",
    title: "Selective organization data removal",
    description:
      "Unenroll and clear organization data remove managed policies, apps, and corporate container data without enabling full personal wipe.",
    icon: "delete_sweep",
    color: "negative",
    enabled: managedDeviceCount.value > 0,
    status: "Selective",
  },
  {
    id: "full-wipe",
    title: "Full device wipe",
    description:
      "Full wipe is only available when an administrator explicitly enables it in SSP portal settings.",
    icon: "delete_forever",
    color: "negative",
    enabled: Boolean(settings.value.allow_full_wipe),
    status: "Allowed",
  },
]);

function formatDate(d?: string) {
  if (!d) return "";
  return date.formatDate(d, "DD MMM YYYY HH:mm");
}

function rightStatusColor(status: string) {
  return (
    {
      pending: "warning",
      approved: "positive",
      denied: "negative",
      revoked: "grey",
      cancelled: "grey",
    }[status] || "grey"
  );
}

async function loadProfileAndDevices() {
  const [userResp, devicesResp] = await Promise.all([
    axios.get("/appmanagement/ssp/me/"),
    axios.get("/appmanagement/ssp/devices/"),
  ]);
  profile.value = userResp.data?.user || {};
  profileDetails.value = userResp.data?.profile || {};
  appliedPolicies.value = userResp.data?.applied_policies || [];
  devices.value = devicesResp.data || userResp.data?.devices || [];
}

async function loadSettings() {
  try {
    settings.value =
      (await axios.get("/appmanagement/ssp/settings/")).data || {};
  } catch {
    settings.value = {};
  }
}

async function loadRights() {
  loadingRights.value = true;
  try {
    rights.value = (await axios.get("/appmanagement/ssp/rights/")).data || [];
  } catch (e: any) {
    rights.value = [];
    $q.notify({
      message: e?.response?.data?.error || "Failed to load requests",
      color: "negative",
    });
  } finally {
    loadingRights.value = false;
  }
}

async function loadAll() {
  loading.value = true;
  try {
    await Promise.all([loadProfileAndDevices(), loadRights(), loadSettings()]);
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to load rights",
      color: "negative",
    });
  } finally {
    loading.value = false;
  }
}

function openRequestDialog(row?: any) {
  editingRight.value = row || null;
  rightForm.value = row
    ? {
        title: row.title || "",
        category: row.category || "system_access",
        description: row.description || "",
        justification: row.justification || "",
        target_device_id: row.target_device || null,
      }
    : {
        title: "",
        category: "system_access",
        description: "",
        justification: "",
        target_device_id: null,
      };
  requestDialogOpen.value = true;
}

function openPolicyRequest() {
  openRequestDialog({
    title: "New personal policy request",
    category:
      policyCategoryFilter.value === "all"
        ? "compliance_policy"
        : policyCategoryFilter.value,
    description: "",
    justification: "",
    target_device: null,
  });
  editingRight.value = null;
}

async function saveRight() {
  savingRight.value = true;
  try {
    const payload = {
      title: rightForm.value.title,
      category: rightForm.value.category,
      description: rightForm.value.description,
      justification: rightForm.value.justification,
      target_device_id: rightForm.value.target_device_id,
    };
    if (editingRight.value?.id) {
      await axios.patch(
        `/appmanagement/ssp/rights/${editingRight.value.id}/`,
        payload,
      );
    } else {
      await axios.post("/appmanagement/ssp/rights/", payload);
    }
    requestDialogOpen.value = false;
    $q.notify({ message: "Request saved", color: "positive", icon: "check" });
    await loadRights();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to save request",
      color: "negative",
    });
  } finally {
    savingRight.value = false;
  }
}

function cancelRight(row: any) {
  $q.dialog({
    title: "Cancel request?",
    message: `Cancel "${row.title}"?`,
    cancel: true,
    ok: { label: "Cancel request", color: "negative" },
  }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/rights/${row.id}/`);
      $q.notify({ message: "Request cancelled", color: "positive" });
      await loadRights();
    } catch (e: any) {
      $q.notify({
        message: e?.response?.data?.error || "Failed to cancel request",
        color: "negative",
      });
    }
  });
}

async function changePassword() {
  changingPw.value = true;
  try {
    await axios.put("/accounts/resetpw/", {
      old_password: pwForm.value.current,
      password: pwForm.value.newPw,
    });
    $q.notify({
      message: "Password changed successfully",
      color: "positive",
      icon: "check",
    });
    showChangePwDialog.value = false;
    pwForm.value = { current: "", newPw: "", confirm: "" };
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to change password",
      color: "negative",
    });
  } finally {
    changingPw.value = false;
  }
}

onMounted(loadAll);
</script>

<style scoped>
.ssp-rights-page {
  background: #f8fafc;
  min-height: calc(100vh - 100px);
  padding: 28px 32px;
}
.policy-row {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}
.privacy-terms {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
  padding: 10px;
  white-space: pre-wrap;
}
.privacy-visual-card {
  height: 100%;
}
</style>
