<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-sm">{{ $t('winadvanced.components.KioskModePolicyPanel.c22e89') }}</div>
    <div class="text-caption text-grey q-mb-lg">
      {{ $t('winadvanced.components.KioskModePolicyPanel.47ac8c') }}
    </div>

    <div class="row q-gutter-md">
      <!-- Policy list -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2">Policies ({{ policies.length }})</div>
              <q-space />
              <q-btn color="primary" icon="add" round dense size="sm" @click="showCreate" />
            </div>
            <q-list separator dense>
              <q-item
                v-for="p in policies" :key="p.id"
                clickable :active="selectedPolicy?.id === p.id"
                active-class="bg-primary-1"
                @click="selectPolicy(p)"
              >
                <q-item-section>
                  <q-item-label>{{ p.name }}</q-item-label>
                  <q-item-label caption>
                    {{ p.app_type }} · {{ scopeLabel(p.scope) }} · {{ scopeTargetLabel(p) }}
                    {{ p.enabled ? '✓' : '✗' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="delete" size="xs" color="negative"
                    @click.stop="deletePolicy(p.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="policies.length === 0">
                <q-item-section class="text-grey text-center text-caption">{{ $t('winadvanced.components.KioskModePolicyPanel.c4b7a0') }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Editor -->
      <div class="col-12 col-md-8" v-if="selectedPolicy">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-md">{{ selectedPolicy.id ? 'Edit' : 'New' }} Kiosk Mode Policy</div>
            <q-form @submit.prevent="savePolicy" class="q-gutter-sm">

              <q-input v-model="form.name" :label="$t('winadvanced.components.KioskModePolicyPanel.7cf3cf')" outlined dense />
              <q-select
                v-model="form.scope"
                :options="scopeOptions"
                :label="$t('winadvanced.components.KioskModePolicyPanel.4651a3')"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="onScopeChange"
              />
              <q-select
                v-if="form.scope === 'device'"
                v-model="form.target_agent_id"
                :options="scopeAgentOptions"
                label="Target device"
                outlined
                dense
                emit-value
                map-options
                clearable
                use-input
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterScopeAgents"
              />
              <q-select
                v-else-if="form.scope === 'device_group' || form.scope === 'group'"
                v-model="form.target_device_group_id"
                :options="scopeDeviceGroupOptions"
                label="Target device group"
                outlined
                dense
                emit-value
                map-options
                clearable
                use-input
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterScopeDeviceGroups"
              />
              <q-select
                v-else-if="form.scope === 'user'"
                v-model="form.target_user_id"
                :options="scopeUserOptions"
                label="Target user"
                outlined
                dense
                emit-value
                map-options
                clearable
                use-input
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterScopeUsers"
              />
              <q-select
                v-else-if="form.scope === 'user_group'"
                v-model="form.target_user_group_id"
                :options="scopeUserGroupOptions"
                label="Target user group"
                outlined
                dense
                emit-value
                map-options
                clearable
                use-input
                hide-selected
                fill-input
                input-debounce="200"
                @filter="filterScopeUserGroups"
              />
              <q-input
                v-else
                label="Target"
                model-value="All Windows devices"
                outlined
                dense
                readonly
              />

              <!-- App type -->
              <q-banner class="bg-blue-1 rounded">
                <template v-slot:avatar><q-icon name="apps" color="primary" /></template>
                <strong>{{ $t('winadvanced.components.KioskModePolicyPanel.17cee8') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-select v-model="form.app_type" :options="appTypeOptions" :label="$t('winadvanced.components.KioskModePolicyPanel.16fcf1')" outlined dense emit-value map-options style="min-width:160px" />
                <q-input v-model="form.app_id" :label="$t('winadvanced.components.KioskModePolicyPanel.4e2dbe')" outlined dense class="col" />
                <q-input v-model="form.app_name" :label="$t('winadvanced.components.KioskModePolicyPanel.499b9c')" outlined dense class="col" />
              </div>

              <!-- Edge Kiosk URL -->
              <q-input v-if="form.app_type === 'edge_kiosk'" v-model="form.edge_kiosk_start_url"
                :label="$t('winadvanced.components.KioskModePolicyPanel.c4e175')" outlined dense
                placeholder="https://kiosk.example.com" />

              <q-input v-if="form.app_type === 'multi_app'" v-model="form.multi_app_list_text"
                label="Allowed apps"
                hint="One app per line: desktop|C:\\Windows\\System32\\notepad.exe|Notepad or store|Package!App|Name"
                type="textarea" autogrow outlined dense />

              <!-- Auto-login -->
              <q-banner class="bg-blue-1 q-mt-sm rounded">
                <template v-slot:avatar><q-icon name="person" color="primary" /></template>
                <strong>{{ $t('winadvanced.components.KioskModePolicyPanel.727cb3') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.auto_logon" :label="$t('winadvanced.components.KioskModePolicyPanel.4f16bf')" dense />
                <q-input v-if="form.auto_logon" v-model="form.auto_logon_username"
                  :label="$t('winadvanced.components.KioskModePolicyPanel.fbb709')" outlined dense style="min-width:200px" />
              </div>

              <!-- Shell / UI -->
              <q-banner class="bg-blue-1 q-mt-sm rounded">
                <template v-slot:avatar><q-icon name="monitor" color="primary" /></template>
                <strong>{{ $t('winadvanced.components.KioskModePolicyPanel.fc8f4f') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.allow_multi_window" :label="$t('winadvanced.components.KioskModePolicyPanel.925caf')" dense />
                <q-toggle v-model="form.show_taskbar" :label="$t('winadvanced.components.KioskModePolicyPanel.ef02c9')" dense />
                <q-toggle v-model="form.show_clock" :label="$t('winadvanced.components.KioskModePolicyPanel.035f53')" dense />
              </div>

              <!-- Restart behavior -->
              <q-banner class="bg-blue-1 q-mt-sm rounded">
                <template v-slot:avatar><q-icon name="restart_alt" color="primary" /></template>
                <strong>{{ $t('winadvanced.components.KioskModePolicyPanel.73e44c') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm items-center">
                <q-toggle v-model="form.restart_on_crash" :label="$t('winadvanced.components.KioskModePolicyPanel.a4f4eb')" dense />
                <q-input v-if="form.restart_on_crash" v-model.number="form.restart_delay_seconds"
                  :label="$t('winadvanced.components.KioskModePolicyPanel.c70184')" type="number" outlined dense style="width:150px" />
                <q-input v-if="form.restart_on_crash" v-model.number="form.max_restart_attempts"
                  :label="$t('winadvanced.components.KioskModePolicyPanel.f684fe')" type="number" outlined dense style="width:150px" />
              </div>

              <!-- Fallback -->
              <q-banner class="bg-blue-1 q-mt-sm rounded">
                <template v-slot:avatar><q-icon name="backup" color="primary" /></template>
                <strong>{{ $t('winadvanced.components.KioskModePolicyPanel.50f924') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-input v-model="form.fallback_app_id" :label="$t('winadvanced.components.KioskModePolicyPanel.5b63f8')" outlined dense class="col" />
                <q-input v-model="form.fallback_app_name" :label="$t('winadvanced.components.KioskModePolicyPanel.03df08')" outlined dense class="col" />
              </div>

              <q-toggle v-model="form.enabled" :label="$t('winadvanced.components.KioskModePolicyPanel.48ff2e')" dense color="positive" />

              <q-btn type="submit" color="primary" :label="$t('winadvanced.components.KioskModePolicyPanel.de525b')" :loading="saving" class="q-mt-sm" />
              <q-btn type="button" color="teal" :label="$t('winadvanced.components.KioskModePolicyPanel.281560')" :loading="deploying" @click="deployPolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
              <q-btn type="button" outline color="warning" icon="undo" label="Disable on devices" :loading="revoking" @click="revokePolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8" v-else>
        <q-banner class="bg-grey-1 rounded">
          <q-icon name="info" class="q-mr-sm" />{{ $t('winadvanced.components.KioskModePolicyPanel.b4fd64') }}
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const policies = ref<any[]>([]);
const selectedPolicy = ref<any>(null);
const saving = ref(false);
const deploying = ref(false);
const revoking = ref(false);

const defaultForm = () => ({
  name: "", description: "", scope: "global",
  app_type: "uwp", app_id: "", app_name: "",
  edge_kiosk_start_url: "",
  multi_app_list: [] as any[], multi_app_list_text: "",
  allow_multi_window: false, auto_logon: false, auto_logon_username: "",
  fallback_app_id: "", fallback_app_name: "",
  restart_on_crash: true, restart_delay_seconds: 30, max_restart_attempts: 5,
  target_agent_id: "",
  target_device_group_id: null as number | null,
  target_user_id: null as number | null,
  target_user_group_id: null as number | null,
  target_users: [] as string[], show_taskbar: false, show_clock: false,
  enabled: true,
});

const form = reactive(defaultForm());

const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Specific Device", value: "device" },
  { label: "Device Group", value: "device_group" },
  { label: "Specific User", value: "user" },
  { label: "User Group", value: "user_group" },
];

const scopeAgentAllOptions = ref<{ label: string; value: string }[]>([]);
const scopeDeviceGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeAgentNeedle = ref("");
const scopeDeviceGroupNeedle = ref("");
const scopeUserNeedle = ref("");
const scopeUserGroupNeedle = ref("");

function normalizeScope(scope: string) {
  return scope === "group" ? "device_group" : (scope || "global");
}

function filteredTargetOptions<T extends { label: string; value: string | number }>(
  rows: T[],
  needle: string,
): T[] {
  const q = String(needle || "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (row) =>
      String(row.label).toLowerCase().includes(q) ||
      String(row.value).toLowerCase().includes(q),
  );
}

const scopeAgentOptions = computed(() =>
  filteredTargetOptions(scopeAgentAllOptions.value, scopeAgentNeedle.value),
);
const scopeDeviceGroupOptions = computed(() =>
  filteredTargetOptions(
    scopeDeviceGroupAllOptions.value,
    scopeDeviceGroupNeedle.value,
  ),
);
const scopeUserOptions = computed(() =>
  filteredTargetOptions(scopeUserAllOptions.value, scopeUserNeedle.value),
);
const scopeUserGroupOptions = computed(() =>
  filteredTargetOptions(
    scopeUserGroupAllOptions.value,
    scopeUserGroupNeedle.value,
  ),
);

function filterScopeAgents(value: string, update: (fn: () => void) => void) {
  update(() => {
    scopeAgentNeedle.value = value || "";
  });
}

function filterScopeDeviceGroups(
  value: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    scopeDeviceGroupNeedle.value = value || "";
  });
}

function filterScopeUsers(value: string, update: (fn: () => void) => void) {
  update(() => {
    scopeUserNeedle.value = value || "";
  });
}

function filterScopeUserGroups(
  value: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    scopeUserGroupNeedle.value = value || "";
  });
}

function resetScopedTargets() {
  form.target_agent_id = "";
  form.target_device_group_id = null;
  form.target_user_id = null;
  form.target_user_group_id = null;
}

function onScopeChange(scope: string) {
  form.scope = normalizeScope(scope);
  resetScopedTargets();
}

function lookupTargetLabel<T extends { label: string; value: string | number }>(
  rows: T[],
  value: string | number | null | undefined,
  fallback: string,
) {
  if (value === null || value === undefined || value === "") return fallback;
  return rows.find((row) => String(row.value) === String(value))?.label || fallback;
}

function scopeLabel(scope: string) {
  const normalized = normalizeScope(scope);
  return scopeOptions.find((option) => option.value === normalized)?.label || "Global";
}

function scopeTargetLabel(row: any) {
  const scope = normalizeScope(row?.scope);
  if (scope === "device") {
    return lookupTargetLabel(scopeAgentAllOptions.value, row?.target_agent_id, row?.target_agent_id || "No device");
  }
  if (scope === "device_group") {
    return lookupTargetLabel(
      scopeDeviceGroupAllOptions.value,
      row?.target_device_group_id,
      row?.target_device_group_id ? `Device group #${row.target_device_group_id}` : "No group",
    );
  }
  if (scope === "user") {
    return lookupTargetLabel(
      scopeUserAllOptions.value,
      row?.target_user_id,
      row?.target_user_id ? `User #${row.target_user_id}` : "No user",
    );
  }
  if (scope === "user_group") {
    return lookupTargetLabel(
      scopeUserGroupAllOptions.value,
      row?.target_user_group_id,
      row?.target_user_group_id ? `User group #${row.target_user_group_id}` : "No user group",
    );
  }
  return "All Windows devices";
}

function normalizeScopedPayload(payload: any) {
  payload.scope = normalizeScope(payload.scope);
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  if (payload.scope !== "user") payload.target_user_id = null;
  if (payload.scope !== "user_group") payload.target_user_group_id = null;
  for (const key of [
    "target_device_group_id",
    "target_user_id",
    "target_user_group_id",
  ]) {
    if (payload[key] === "" || payload[key] === undefined) payload[key] = null;
  }
}

function scopedTargetError(row: any) {
  const scope = normalizeScope(row.scope);
  if (scope === "device" && !row.target_agent_id) return "Select a target device";
  if (scope === "device_group" && !row.target_device_group_id) return "Select a target device group";
  if (scope === "user" && !row.target_user_id) return "Select a target user";
  if (scope === "user_group" && !row.target_user_group_id) return "Select a target user group";
  return "";
}

async function loadScopeTargetOptions() {
  const [agentsResp, sitesResp, usersResp, groupsResp] =
    await Promise.allSettled([
      axios.get("/agents/", { params: { detail: "false" } }),
      axios.get("/clients/sites/?leaf=true"),
      axios.get("/accounts/users/"),
      axios.get("/accounts/user-groups/"),
    ]);

  if (agentsResp.status === "fulfilled") {
    const list = Array.isArray(agentsResp.value.data)
      ? agentsResp.value.data
      : (agentsResp.value.data?.results ?? []);
    scopeAgentAllOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        value: agent.agent_id,
        label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
      }));
  }

  if (sitesResp.status === "fulfilled") {
    const list = Array.isArray(sitesResp.value.data)
      ? sitesResp.value.data
      : (sitesResp.value.data?.results ?? []);
    scopeDeviceGroupAllOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors
          ? `${site.ancestors} / ${site.name}`
          : site.name || `Device group #${site.id}`,
      }));
  }

  if (usersResp.status === "fulfilled") {
    const list = Array.isArray(usersResp.value.data)
      ? usersResp.value.data
      : (usersResp.value.data?.results ?? []);
    scopeUserAllOptions.value = list
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        value: user.id,
        label:
          user.display_name ||
          user.full_name ||
          user.username ||
          user.sam_account_name ||
          user.email ||
          `User #${user.id}`,
      }));
  }

  if (groupsResp.status === "fulfilled") {
    const list = Array.isArray(groupsResp.value.data)
      ? groupsResp.value.data
      : (groupsResp.value.data?.results ?? []);
    scopeUserGroupAllOptions.value = list
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        value: group.id,
        label:
          group.display_name ||
          group.name ||
          group.sam_account_name ||
          `User group #${group.id}`,
      }));
  }
}

const appTypeOptions = [
  { label: "UWP / MSIX App", value: "uwp" },
  { label: "Classic Win32 App", value: "classic" },
  { label: "Multi-app Assigned Access", value: "multi_app" },
  { label: "Microsoft Edge Kiosk", value: "edge_kiosk" },
];

function formatMultiAppList(apps: any[] = []) {
  return apps.map((app: any) => {
    const type = app.app_type || app.appType || (String(app.app_id || app.appId || "").includes("\\") ? "desktop" : "store");
    const id = app.app_id || app.appId || app.id || "";
    const name = app.name || app.label || id;
    return `${type}|${id}|${name}`;
  }).join("\n");
}

function parseMultiAppList(text: string) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 2) {
        return { app_type: parts[0] || "desktop", app_id: parts[1] || "", name: parts.slice(2).join("|") || parts[1] || "" };
      }
      const id = parts[0] || "";
      return { app_type: id.includes("\\") || id.toLowerCase().endsWith(".exe") ? "desktop" : "store", app_id: id, name: id };
    })
    .filter((app) => app.app_id);
}

async function loadPolicies() {
  try {
    policies.value = (await axios.get("/winadvanced/kiosk-policies/")).data;
  } catch {
    $q.notify({ message: "Failed to load policies", color: "negative" });
  }
}

function selectPolicy(p: any) {
  selectedPolicy.value = p;
  Object.assign(form, defaultForm(), p, { scope: normalizeScope(p.scope) });
  form.multi_app_list_text = formatMultiAppList(p.multi_app_list || []);
}

function showCreate() {
  selectedPolicy.value = { id: null };
  Object.assign(form, defaultForm());
}

async function savePolicy() {
  saving.value = true;
  try {
    const payload = { ...form };
    payload.multi_app_list = parseMultiAppList(form.multi_app_list_text);
    delete (payload as any).multi_app_list_text;
    normalizeScopedPayload(payload);
    const targetError = scopedTargetError(payload);
    if (targetError) {
      $q.notify({ message: targetError, color: "warning", icon: "warning" });
      return;
    }
    if (payload.app_type === "multi_app" && !payload.app_id && payload.multi_app_list.length > 0) {
      payload.app_id = payload.multi_app_list[0].app_id;
      payload.app_name = payload.multi_app_list[0].name || payload.app_name;
    }
    if (selectedPolicy.value?.id) {
      await axios.put(`/winadvanced/kiosk-policies/${selectedPolicy.value.id}/`, payload);
    } else {
      const resp = await axios.post("/winadvanced/kiosk-policies/", payload);
      selectedPolicy.value = resp.data;
    }
    await loadPolicies();
    $q.notify({ message: "Policy saved", color: "positive", icon: "check" });
  } catch (error: any) {
    const responseData = error?.response?.data || {};
    const firstFieldError = Object.values(responseData)
      .flatMap((value: any) => (Array.isArray(value) ? value : [value]))
      .find(Boolean);
    const detail = responseData.detail ||
      responseData.non_field_errors?.[0] ||
      firstFieldError;
    $q.notify({ message: detail ? `Save failed: ${detail}` : "Save failed", color: "negative" });
  } finally {
    saving.value = false;
  }
}

async function deployPolicy() {
  if (!selectedPolicy.value?.id) return;
  deploying.value = true;
  try {
    const resp = await axios.post(`/winadvanced/kiosk-policies/${selectedPolicy.value.id}/deploy/`, { wait: true, timeout: 180 });
    $q.notify({ message: `Deploy completed on ${resp.data.agents_triggered ?? 0} device(s)`, color: "positive", icon: "send" });
  } catch {
    $q.notify({ message: "Deploy failed", color: "negative" });
  } finally {
    deploying.value = false;
  }
}

async function revokePolicy() {
  if (!selectedPolicy.value?.id) return;
  $q.dialog({
    title: "Disable kiosk on devices?",
    message: "This sends a rollback command to endpoints and disables this policy record. It does not delete the policy.",
    cancel: true,
    ok: { color: "warning", label: "Disable" },
  }).onOk(async () => {
    revoking.value = true;
    try {
      const resp = await axios.post("/winadvanced/policies/revoke/", {
        kind: "kiosk",
        id: selectedPolicy.value.id,
        disable_record: true,
        wait: true,
        timeout: 180,
      });
      $q.notify({
        message: `Kiosk disable sent to ${resp.data.agents_triggered ?? 0} device(s)`,
        color: "warning",
        icon: "undo",
      });
      await loadPolicies();
    } catch {
      $q.notify({ message: "Kiosk revoke failed", color: "negative" });
    } finally {
      revoking.value = false;
    }
  });
}

async function deletePolicy(id: number) {
  await $q.dialog({
    title: "Revoke and delete kiosk policy?",
    message: "This first disables kiosk mode on endpoints, then removes the policy record from the server.",
    cancel: true,
    ok: { color: "negative", label: "Revoke and delete" },
  });
  const resp = await axios.post("/winadvanced/policies/revoke/", {
    kind: "kiosk",
    id,
    disable_record: true,
    delete_policy: true,
    wait: true,
    timeout: 180,
  });
  const errors = (resp.data?.results || []).filter((r: any) => r.error);
  $q.notify({
    message: errors.length
      ? `Policy deleted, but ${errors.length} device rollback(s) reported errors`
      : `Kiosk policy revoked and deleted on ${resp.data.agents_triggered ?? 0} device(s)`,
    color: errors.length ? "warning" : "positive",
    icon: errors.length ? "warning" : "delete",
  });
  if (selectedPolicy.value?.id === id) selectedPolicy.value = null;
  await loadPolicies();
}

onMounted(async () => {
  await Promise.allSettled([loadPolicies(), loadScopeTargetOptions()]);
});
</script>
