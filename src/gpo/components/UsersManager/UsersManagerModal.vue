<template>
  <div class="users-manager-layout">
    <div class="users-manager-header">
      <q-toolbar>
        <q-btn
          v-if="standalonePage"
          flat
          round
          dense
          icon="arrow_back"
          color="primary"
          @click="goBack"
        />
        <q-icon name="person" size="sm" class="q-mr-sm" color="primary" />
        <q-toolbar-title>Users Manager</q-toolbar-title>

        <q-btn-dropdown
          flat
          dense
          icon="file_download"
          color="primary"
          title="Export users"
          :loading="exportLoading"
          no-caps
        >
          <q-list dense>
            <q-item clickable v-close-popup @click="handleExportUsers('csv')">
              <q-item-section>Export CSV</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleExportUsers('xlsx')">
              <q-item-section>Export XLSX</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          v-if="!standalonePage"
          flat
          round
          dense
          icon="close"
          color="primary"
          @click="$emit('close')"
        />
      </q-toolbar>
    </div>

    <div class="users-manager-page">
      <div class="users-manager-body">
        <UsersListPanel
          :users="filteredUsers"
          :loading="usersLoading"
          :error="usersError"
          :selected-id="selectedUserId"
          :search="userSearch"
          :can-create="!!currentTarget"
          @select="selectUser"
          @refresh="loadUsers"
          @create="showCreateUser = true"
          @update:search="userSearch = $event"
        />

        <q-separator vertical />

        <UserDetailPanel
          :selected-id="selectedUserId"
          :user="userDetail"
          :loading="userDetailLoading"
          :has-target="!!currentTarget"
          :action-loading="actionLoading"
          :detail-tab="detailTab"
          :groups="userGroups"
          :groups-loading="userGroupsLoading"
          :agents="userAgents"
          :agents-loading="userAgentsLoading"
          :removing-agent-id="removingAgentId"
          :applied-collections="userAppliedCollections"
          :applied-collections-loading="userAppliedCollectionsLoading"
          @update="showUpdateUser = true"
          @delete="confirmDeleteUser(currentTarget!)"
          @toggle-enable="toggleEnableUser(currentTarget!)"
          @set-password="showSetPassword = true"
          @unlock="unlockUser(currentTarget!)"
          @expire-password="expirePassword(currentTarget!)"
          @set-expiration="showSetAccountExpiration = true"
          :can-apply-collection="canApplyCollection"
          :can-remove-collection="canRemoveCollection"
          @add-to-group="openAddToGroupDialog"
          @add-agent="showAddAgentPanel = true"
          @remove-agent="handleRemoveUserAgent"
          @add-collection="showApplyCollectionDialog = true"
          @remove-collection="showRemoveCollectionDialog = true"
          @remove-collection-by-id="handleRemoveCollectionById"
          @update:detail-tab="(val) => (detailTab = val)"
          @open-agent-dashboard="goToAgentDashboard"
        />
      </div>
    </div>

    <CreateUserDialog v-model="showCreateUser" @create="handleCreateUser" />

    <UpdateUserDialog
      v-model="showUpdateUser"
      :user-id="selectedUserId"
      :user="userDetail"
      @update="handleUpdateUser"
    />

    <SetPasswordDialog
      v-model="showSetPassword"
      :user-id="selectedUserId"
      @set="handleSetPassword"
    />

    <SetAccountExpirationDialog
      v-model="showSetAccountExpiration"
      :user-id="selectedUserId"
      @set="handleSetAccountExpiration"
    />

    <UserPickerDialog
      v-model="showAddToGroupDialog"
      title="Add user to group"
      :subtitle="`User: ${userDetail?.info?.samaccountname ?? selectedUserId ?? ''}`"
      confirm-label="Add"
      item-icon="groups"
      :options="addToGroupPickerOptions"
      :options-loading="addToGroupOptionsLoading"
      :loading="addToGroupLoading"
      @select="handleAddUserToGroupSelect"
    />

    <q-dialog
      v-model="showApplyCollectionDialog"
      position="standard"
      @show="loadCollectionsForApply"
    >
      <q-card class="apply-collection-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Apply collection to user</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            User:
            <strong>{{
              userDetail?.info?.samaccountname ?? selectedUserId
            }}</strong>
          </div>

          <q-input
            v-model="applyCollectionSearch"
            outlined
            dense
            clearable
            debounce="200"
            placeholder="Search collections..."
            class="q-mb-md"
            :disable="applyCollectionLoading"
            @update:model-value="applyCollectionSearch = String($event ?? '')"
            @clear="applyCollectionSearch = ''"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-table
            flat
            bordered
            dense
            :rows="applyCollectionFilteredRows"
            :columns="applyCollectionColumns"
            row-key="key"
            selection="single"
            v-model:selected="applyCollectionSelectedRows"
            hide-pagination
            :rows-per-page-options="[0]"
            :loading="applyCollectionLoading"
            @row-click="onApplyCollectionRowClick"
          >
            <template #no-data>
              <div class="full-width text-center text-grey-6 q-pa-md">
                {{
                  applyCollectionLoading
                    ? "Loading..."
                    : applyCollectionOptions.length === 0
                      ? "No collections available"
                      : !applyCollectionHasAvailable
                        ? "All collections already applied"
                        : "No collections found"
                }}
              </div>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Apply"
            :loading="applyCollectionApplying"
            :disable="applyCollectionSelectedId == null"
            @click="confirmApplyCollectionToUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showRemoveCollectionDialog"
      position="standard"
      @show="prepareRemoveCollectionOptions"
    >
      <q-card class="apply-collection-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Remove collection from user</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            User:
            <strong>{{
              userDetail?.info?.samaccountname ?? selectedUserId
            }}</strong>
          </div>
          <q-select
            v-model="removeCollectionSelectedId"
            :options="removeCollectionOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="Collection to remove *"
            outlined
            dense
            :disable="removeCollectionOptions.length === 0"
            clearable
            options-dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No applied collections to remove
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="negative"
            label="Remove"
            :loading="removeCollectionRemoving"
            :disable="removeCollectionSelectedId == null"
            @click="confirmRemoveCollectionFromUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      @select="handleAddAgentTargetSelect"
    />

    <SetUserAgentOptionsDialog
      v-model="showSetUserAgentOptions"
      :target-label="pendingAddAgentRef?.label"
      @confirm="handleSetUserAgentOptionsConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUserActions } from "@/gpo/composables/useUserActions";
import type { CreateUserParams } from "@/gpo/composables/useUserActions";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import {
  createAgentTarget,
  createGlobalTarget,
  createUserGroupTargetForAgents,
  userControlClient,
  getAgentIdsFromTarget,
  policyAssignmentClient,
  collectionsClient,
  policyStateClient,
  type Target,
} from "@/gpo/api/grpc-client";
import export_pb from "@/generated/common/export_pb";
import operator_pb from "@/generated/operator_pb";
import { notifyError, notifySuccess } from "@/utils/notify";

import UsersListPanel from "./UsersListPanel.vue";
import UserDetailPanel from "./UserDetailPanel.vue";
import CreateUserDialog from "./dialogs/CreateUserDialog.vue";
import UpdateUserDialog from "./dialogs/UpdateUserDialog.vue";
import SetPasswordDialog from "./dialogs/SetPasswordDialog.vue";
import SetAccountExpirationDialog from "./dialogs/SetAccountExpirationDialog.vue";
import SetUserAgentOptionsDialog from "./dialogs/SetUserAgentOptionsDialog.vue";
import type { SetUserAgentOptions } from "./dialogs/SetUserAgentOptionsDialog.vue";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";
import UserPickerDialog from "@/gpo/components/shared/UserPickerDialog.vue";

const props = withDefaults(
  defineProps<{ open?: boolean; standalonePage?: boolean }>(),
  { open: false, standalonePage: false },
);
defineEmits<{ close: [] }>();
const router = useRouter();
const $q = useQuasar();

function goBack() {
  router.push({ path: "/gpo", query: { tab: "dashboard" } });
}

function goToAgentDashboard(agentId: string) {
  if (!agentId) return;
  router.push({
    name: "GPOManager",
    query: {
      tab: "dashboard",
      agent_id: agentId,
    },
  });
}

const currentTarget = ref<Target>(createGlobalTarget());
const targetLabel = ref("Global");

const showCreateUser = ref(false);
const showUpdateUser = ref(false);
const showSetPassword = ref(false);
const showSetAccountExpiration = ref(false);
const showAddToGroupDialog = ref(false);
const showAddAgentPanel = ref(false);
const showSetUserAgentOptions = ref(false);
const removingAgentId = ref<string | null>(null);
const pendingAddAgentRef = ref<TargetRef | null>(null);
const showApplyCollectionDialog = ref(false);

const exportLoading = ref(false);

const addToGroupOptions = ref<{ sam: string; label: string }[]>([]);
const applyCollectionLoading = ref(false);
const applyCollectionApplying = ref(false);
const applyCollectionSelectedId = ref<number | null>(null);
const applyCollectionOptions = ref<{ id: number; label: string }[]>([]);
const applyCollectionSearch = ref("");
const applyCollectionSelectedRows = ref<
  { key: string; id: number; label: string }[]
>([]);

const applyCollectionColumns = [
  {
    name: "label",
    label: "Collection",
    field: "label",
    align: "left" as const,
  },
];

const appliedCollectionIds = computed(
  () => new Set((userAppliedCollections.value ?? []).map((c) => c.id)),
);

const applyCollectionRows = computed(() =>
  (applyCollectionOptions.value ?? [])
    .filter((c) => !appliedCollectionIds.value.has(c.id))
    .map((c) => ({ key: String(c.id), id: c.id, label: c.label })),
);

const applyCollectionHasAvailable = computed(
  () => applyCollectionRows.value.length > 0,
);

const applyCollectionFilteredRows = computed(() => {
  const q = applyCollectionSearch.value.trim().toLowerCase();
  if (!q) return applyCollectionRows.value;
  return applyCollectionRows.value.filter((r) =>
    (r.label ?? "").toLowerCase().includes(q),
  );
});

const userAppliedCollections = ref<
  {
    id: number;
    name: string;
    explainText?: string;
    policies?: { id: number; name: string }[];
    compliance?: {
      assignedAndApplied: number;
      assignedNotApplied: number;
      notAssigned: number;
      loading: boolean;
    };
  }[]
>([]);
const userAppliedCollectionsLoading = ref(false);
const complianceCache = new Map<
  string,
  {
    assignedAndApplied: number;
    assignedNotApplied: number;
    notAssigned: number;
    timestamp: number;
  }
>();
const COMPLIANCE_CACHE_TTL = 5 * 60 * 1000;

const canApplyCollection = computed(
  () =>
    !!selectedUserId.value &&
    !!(userDetail.value?.info?.samaccountname ?? selectedUserId.value) &&
    getAgentIdsFromTarget(currentTarget.value).length > 0,
);

const canRemoveCollection = computed(
  () =>
    canApplyCollection.value && (userAppliedCollections.value?.length ?? 0) > 0,
);

const showRemoveCollectionDialog = ref(false);
const removeCollectionSelectedId = ref<number | null>(null);
const removeCollectionOptions = ref<{ id: number; label: string }[]>([]);
const removeCollectionRemoving = ref(false);
const addToGroupSelectedSam = ref<string | null>(null);
const addToGroupOptionsLoading = ref(false);
const addToGroupLoading = ref(false);

const addToGroupPickerOptions = computed(() =>
  addToGroupOptions.value.map((g) => ({
    id: g.sam,
    label: g.label,
    samAccountName: g.sam,
  })),
);

const {
  usersLoading,
  usersError,
  userSearch,
  selectedUserId,
  userDetail,
  userDetailLoading,
  detailTab,
  userGroups,
  userGroupsLoading,
  userAgents,
  userAgentsLoading,
  actionLoading,
  filteredUsers,
  loadUsers,
  selectUser,
  createUser,
  updateUser,
  toggleEnableUser,
  setPassword,
  unlockUser,
  expirePassword,
  setAccountExpiration,
  confirmDeleteUser,
  loadUserGroups,
  loadUserAgents,
} = useUserActions();

function downloadBlob(
  content: Uint8Array | string,
  fileName: string,
  mimeType: string,
) {
  const bytes =
    typeof content === "string"
      ? new Uint8Array(Array.from(atob(content), (c) => c.codePointAt(0) ?? 0))
      : new Uint8Array(content);
  const blob = new Blob([bytes.buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function handleExportUsers(format: "csv" | "xlsx") {
  exportLoading.value = true;
  try {
    const exportFormat =
      format === "xlsx"
        ? export_pb.ExportFormat.XLSX
        : export_pb.ExportFormat.CSV;
    const res = await userControlClient.exportAllUsers(exportFormat);
    const mimeType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
    const fallbackName = `users_export.${format}`;
    downloadBlob(res.content, res.fileName || fallbackName, mimeType);
    notifySuccess(`Users exported as ${format.toUpperCase()}`);
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Failed to export users");
  } finally {
    exportLoading.value = false;
  }
}

async function handleCreateUser(params: CreateUserParams) {
  if (!currentTarget.value) return;
  const success = await createUser(currentTarget.value, params);
  if (success) {
    showCreateUser.value = false;
  }
}

async function handleUpdateUser(params: Partial<CreateUserParams>) {
  if (!currentTarget.value || !selectedUserId.value) return;
  const success = await updateUser(
    currentTarget.value,
    selectedUserId.value,
    params,
  );
  if (success) {
    showUpdateUser.value = false;
  }
}

async function handleSetPassword(password: string) {
  if (!currentTarget.value) return;
  const success = await setPassword(currentTarget.value, password);
  if (success) {
    showSetPassword.value = false;
  }
}

async function handleSetAccountExpiration(value: string | undefined) {
  if (!currentTarget.value) return;
  const success = await setAccountExpiration(currentTarget.value, value);
  if (success) {
    showSetAccountExpiration.value = false;
  }
}

function openAddToGroupDialog() {
  addToGroupSelectedSam.value = null;
  showAddToGroupDialog.value = true;
  void loadAddToGroupOptions();
}

async function loadAddToGroupOptions() {
  addToGroupOptionsLoading.value = true;
  addToGroupOptions.value = [];
  try {
    const res = await userControlClient.getAllGroups();
    const list = res.groupsList ?? [];
    const alreadyIn = new Set(
      userGroups.value.map((g) => (g.samaccountname ?? "").toLowerCase()),
    );
    const options: { sam: string; label: string }[] = [];
    for (const g of list) {
      const rec = g as { groupId?: string; info?: Record<string, string> };
      const info = rec.info ?? {};
      const sam = (info.samaccountname ?? rec.groupId ?? "").trim();
      if (!sam || alreadyIn.has(sam.toLowerCase())) continue;
      const label = info.displayname ?? info.name ?? info.samaccountname ?? sam;
      options.push({ sam, label });
    }
    addToGroupOptions.value = options;
  } catch {
    addToGroupOptions.value = [];
  } finally {
    addToGroupOptionsLoading.value = false;
  }
}

async function doAddUserToGroup() {
  const target = currentTarget.value;
  const sam = addToGroupSelectedSam.value?.trim();
  const userSam =
    userDetail.value?.info?.samaccountname ?? selectedUserId.value;
  if (!target || !sam || !userSam) return;
  addToGroupLoading.value = true;
  try {
    const res = await userControlClient.addUserToGroup(target, sam, userSam);
    if (res.status === 0) {
      $q.notify({ type: "positive", message: "User added to group" });
      showAddToGroupDialog.value = false;
      addToGroupSelectedSam.value = null;
      await loadUserGroups();
    } else {
      $q.notify({
        type: "negative",
        message: res.errorMessage ?? "Failed to add user to group",
      });
    }
  } catch (err) {
    $q.notify({
      type: "negative",
      message:
        err instanceof Error ? err.message : "Failed to add user to group",
    });
  } finally {
    addToGroupLoading.value = false;
  }
}

function handleAddUserToGroupSelect(sam: string) {
  addToGroupSelectedSam.value = sam;
  void doAddUserToGroup();
}

function handleAddAgentTargetSelect(ref: TargetRef) {
  const userId =
    selectedUserId.value ??
    userDetail.value?.info?.samaccountname ??
    userDetail.value?.userid;
  if (!userId) return;
  showAddAgentPanel.value = false;
  pendingAddAgentRef.value = ref;
  showSetUserAgentOptions.value = true;
}

async function handleSetUserAgentOptionsConfirm(options: SetUserAgentOptions) {
  const ref = pendingAddAgentRef.value;
  const userId =
    selectedUserId.value ??
    userDetail.value?.info?.samaccountname ??
    userDetail.value?.userid;
  if (!ref || !userId) return;
  pendingAddAgentRef.value = null;
  try {
    const res = await userControlClient.setUserAgent(ref.target, userId, {
      password: options.password,
      passwordNotRequired: options.passwordNotRequired,
      userCannotChangePassword: options.userCannotChangePassword,
      smartcardLogonRequired: options.smartcardLogonRequired,
    });
    if (res.status === 0) {
      $q.notify({ type: "positive", message: "User linked to target" });
      await loadUserAgents();
    } else {
      $q.notify({
        type: "negative",
        message: res.errorMessage ?? "Failed to link user to target",
      });
    }
  } catch (err) {
    $q.notify({
      type: "negative",
      message:
        err instanceof Error ? err.message : "Failed to link user to target",
    });
  }
}

async function handleRemoveUserAgent(agentId: string) {
  const userId =
    selectedUserId.value ??
    userDetail.value?.info?.samaccountname ??
    userDetail.value?.userid;
  if (!userId) return;

  const agent = (userAgents.value ?? []).find((a) => a.id === agentId);
  const agentLabel =
    agent?.name && agent.name !== agentId
      ? `${agent.name} (${agentId})`
      : agentId;

  $q.dialog({
    title: "Remove agent",
    message: `Do you really want to unlink agent «${agentLabel}» from this user?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    removingAgentId.value = agentId;
    try {
      const target = createAgentTarget(agentId);
      const res = await userControlClient.removeUserAgent(target, userId);
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "Agent unlinked from user" });
        await loadUserAgents();
      } else {
        $q.notify({
          type: "negative",
          message: res.errorMessage ?? "Failed to unlink agent from user",
        });
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message:
          err instanceof Error
            ? err.message
            : "Failed to unlink agent from user",
      });
    } finally {
      removingAgentId.value = null;
    }
  });
}

function isUserScope(raw: unknown): boolean {
  if (raw === undefined || raw === null) return false;
  if (typeof raw === "number") {
    const n = Math.floor(raw);
    return (
      n === operator_pb.PolicyScope.POLICY_SCOPE_USER ||
      n === operator_pb.PolicyScope.POLICY_SCOPE_BOTH
    );
  }
  const s = String(raw).toUpperCase();
  return s === "USER" || s === "1" || s === "BOTH" || s === "3";
}

async function loadCollectionsForApply() {
  applyCollectionLoading.value = true;
  applyCollectionSelectedId.value = null;
  applyCollectionOptions.value = [];
  applyCollectionSearch.value = "";
  applyCollectionSelectedRows.value = [];
  try {
    const response = await collectionsClient.getAllCollections("en-US");
    const list =
      (
        response as {
          collectionsList?: Array<{
            id?: number | string;
            name?: string;
            scope?: number | string;
          }>;
        }
      ).collectionsList ??
      (
        response as {
          collections?: Array<{
            id?: number | string;
            name?: string;
            scope?: number | string;
          }>;
        }
      ).collections ??
      [];
    applyCollectionOptions.value = list
      .map((c) => {
        const rawId = c.id;
        let id = 0;
        if (rawId !== undefined && rawId !== null) {
          id =
            typeof rawId === "string"
              ? Number.parseInt(rawId, 10) || 0
              : Number(rawId);
        }
        return {
          id,
          label: (c.name as string) || String(rawId ?? ""),
          scope: c.scope,
        };
      })
      .filter(
        (o) => o.id > 0 && isUserScope(o.scope as number | string | undefined),
      )
      .map((o) => ({
        id: o.id,
        label: o.label,
      }));
  } catch {
    applyCollectionOptions.value = [];
  } finally {
    applyCollectionLoading.value = false;
  }
}

function onApplyCollectionRowClick(
  _evt: unknown,
  row: { key: string; id: number; label: string },
) {
  applyCollectionSelectedRows.value = [row];
  applyCollectionSelectedId.value = row.id;
}

function confirmApplyCollectionToUser() {
  const collectionId = applyCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    applyCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Apply collection",
    message: `Do you really want to apply the collection«${collectionLabel}»?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    doApplyCollectionToUser();
  });
}

async function doApplyCollectionToUser() {
  const agentIds = getAgentIdsFromTarget(currentTarget.value);
  const userId = selectedUserId.value ?? userDetail.value?.userid;
  const userLabel = userDetail.value?.info?.samaccountname ?? userId;
  const collectionId = applyCollectionSelectedId.value;
  if (agentIds.length === 0 || !userId || collectionId == null) return;
  applyCollectionApplying.value = true;
  try {
    for (const agentId of agentIds) {
      await policyAssignmentClient.assignPolicyCollection(
        collectionId,
        "user",
        {
          agentId,
          userId,
        },
      );
    }
    notifySuccess(
      `Collection applied to user "${userLabel}" on ${agentIds.length} agent(s)`,
    );
    showApplyCollectionDialog.value = false;
    await loadUserAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to apply collection",
    );
  } finally {
    applyCollectionApplying.value = false;
  }
}

function prepareRemoveCollectionOptions() {
  removeCollectionSelectedId.value = null;
  removeCollectionOptions.value = (userAppliedCollections.value ?? []).map(
    (c) => ({ id: c.id, label: c.name || String(c.id) }),
  );
}

function confirmRemoveCollectionFromUser() {
  const collectionId = removeCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    removeCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Remove collection",
    message: `Do you really want to delete the collection«${collectionLabel}»?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(() => {
    doRemoveCollectionFromUser();
  });
}

async function doRemoveCollectionFromUser() {
  const agentIds = getAgentIdsFromTarget(currentTarget.value);
  const userId = selectedUserId.value ?? userDetail.value?.userid;
  const userLabel = userDetail.value?.info?.samaccountname ?? userId;
  const collectionId = removeCollectionSelectedId.value;
  if (agentIds.length === 0 || !userId || collectionId == null) return;
  removeCollectionRemoving.value = true;
  try {
    for (const agentId of agentIds) {
      await policyAssignmentClient.removePolicyCollection(
        collectionId,
        "user",
        { agentId, userId },
      );
    }
    notifySuccess(
      `Collection removed from user "${userLabel}" on ${agentIds.length} agent(s)`,
    );
    showRemoveCollectionDialog.value = false;
    await loadUserAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to remove collection",
    );
  } finally {
    removeCollectionRemoving.value = false;
  }
}

function handleRemoveCollectionById(collectionId: number) {
  const collection = userAppliedCollections.value.find(
    (c) => c.id === collectionId,
  );
  const collectionLabel = collection?.name ?? String(collectionId);

  $q.dialog({
    title: "Remove collection",
    message: `Do you really want to remove the collection «${collectionLabel}» from this user?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    const agentIds = getAgentIdsFromTarget(currentTarget.value);
    const userId = selectedUserId.value ?? userDetail.value?.userid;
    const userLabel = userDetail.value?.info?.samaccountname ?? userId;

    if (agentIds.length === 0 || !userId) return;

    actionLoading.value = true;
    try {
      for (const agentId of agentIds) {
        await policyAssignmentClient.removePolicyCollection(
          collectionId,
          "user",
          { agentId, userId },
        );
      }
      notifySuccess(
        `Collection removed from user "${userLabel}" on ${agentIds.length} agent(s)`,
      );
      await loadUserAppliedCollections();
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "Failed to remove collection",
      );
    } finally {
      actionLoading.value = false;
    }
  });
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function calculateCollectionCompliance(
  userId: string,
  collectionPolicies: { id: number; name: string }[],
  agentsForUser: { id: string; name: string }[],
): Promise<{
  assignedAndApplied: number;
  assignedNotApplied: number;
  notAssigned: number;
}> {
  if (!collectionPolicies || collectionPolicies.length === 0) {
    return { assignedAndApplied: 0, assignedNotApplied: 0, notAssigned: 0 };
  }

  if (!agentsForUser || agentsForUser.length === 0) {
    return {
      assignedAndApplied: 0,
      assignedNotApplied: 0,
      notAssigned: collectionPolicies.length,
    };
  }

  const cacheKey = `${userId}_${collectionPolicies.map((p) => p.id).join(",")}_${agentsForUser.length}`;
  const cached = complianceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < COMPLIANCE_CACHE_TTL) {
    return {
      assignedAndApplied: cached.assignedAndApplied,
      assignedNotApplied: cached.assignedNotApplied,
      notAssigned: cached.notAssigned,
    };
  }

  try {
    const results = await mapWithConcurrency(
      agentsForUser,
      3,
      async (agent) => {
        try {
          const target = createAgentTarget(agent.id);
          if (!target) {
            return {
              assignments: [],
              effectivePolicies: [],
            };
          }

          const [assignmentsResponse, effectivePoliciesResponse] =
            await Promise.all([
              policyStateClient
                .getAssignments(target, "en-US")
                .catch(() => ({ assignmentsList: [] })),
              policyStateClient
                .getEffectivePolicies(target, "en-US")
                .catch(() => ({ policiesList: [] })),
            ]);

          return {
            assignments: assignmentsResponse.assignmentsList || [],
            effectivePolicies: effectivePoliciesResponse.policiesList || [],
          };
        } catch {
          return {
            assignments: [],
            effectivePolicies: [],
          };
        }
      },
    );

    const assignedPolicyHashes = new Set<string>();
    const effectivePolicyHashes = new Set<string>();

    for (const result of results) {
      for (const assignment of result.assignments) {
        if (assignment.summary?.id) {
          const policyId = String(assignment.summary.id);
          assignedPolicyHashes.add(policyId);
          assignedPolicyHashes.add(`policy_${policyId}`);
        }
        if (assignment.policyHash) {
          assignedPolicyHashes.add(assignment.policyHash);
        }
      }

      for (const policy of result.effectivePolicies) {
        if (policy.summary?.id) {
          const policyId = String(policy.summary.id);
          effectivePolicyHashes.add(policyId);
          effectivePolicyHashes.add(`policy_${policyId}`);
        }
        if (policy.policyHash) {
          effectivePolicyHashes.add(policy.policyHash);
        }
      }
    }

    let assignedAndApplied = 0;
    let assignedNotApplied = 0;
    let notAssigned = 0;

    for (const policy of collectionPolicies) {
      const policyIdStr = String(policy.id);
      const policyHash = `policy_${policyIdStr}`;

      const isAssigned =
        assignedPolicyHashes.has(policyIdStr) ||
        assignedPolicyHashes.has(policyHash);
      const isApplied =
        effectivePolicyHashes.has(policyIdStr) ||
        effectivePolicyHashes.has(policyHash);

      if (isAssigned && isApplied) {
        assignedAndApplied++;
      } else if (isAssigned && !isApplied) {
        assignedNotApplied++;
      } else {
        notAssigned++;
      }
    }

    const complianceResult = {
      assignedAndApplied,
      assignedNotApplied,
      notAssigned,
    };
    complianceCache.set(cacheKey, {
      ...complianceResult,
      timestamp: Date.now(),
    });
    return complianceResult;
  } catch (err) {
    console.error("Error calculating collection compliance:", err);
    return {
      assignedAndApplied: 0,
      assignedNotApplied: 0,
      notAssigned: collectionPolicies.length,
    };
  }
}

async function loadUserAppliedCollections() {
  const userId = selectedUserId.value;
  if (!userId) {
    userAppliedCollections.value = [];
    return;
  }
  userAppliedCollectionsLoading.value = true;
  userAppliedCollections.value = [];
  try {
    const response = await collectionsClient.getAppliedCollectionsByUser(
      userId,
      "en-US",
    );
    type CollectionItem = {
      id?: number;
      name?: string;
      explainText?: string;
      explain_text?: string;
      policiesList?: Array<{
        id?: number;
        name?: string;
        displayName?: string;
        display_name?: string;
      }>;
      policies?: Array<{
        id?: number;
        name?: string;
        displayName?: string;
        display_name?: string;
      }>;
    };
    const list =
      (response as { collectionsList?: CollectionItem[] }).collectionsList ??
      (response as { collections?: CollectionItem[] }).collections ??
      [];
    const mappedCollections = list.map((c) => {
      const rawPolicies = c.policiesList ?? c.policies ?? [];
      return {
        id: c.id ?? 0,
        name: c.name ?? String(c.id ?? ""),
        explainText:
          (c.explainText ?? c.explain_text ?? "").trim() || undefined,
        policies: rawPolicies.map((p) => ({
          id: p.id ?? 0,
          name: p.displayName ?? p.display_name ?? p.name ?? String(p.id ?? ""),
        })),
        compliance: {
          assignedAndApplied: 0,
          assignedNotApplied: 0,
          notAssigned: 0,
          loading: true,
        },
      };
    });

    userAppliedCollections.value = mappedCollections;

    if (userAgents.value && userAgents.value.length > 0) {
      await mapWithConcurrency(mappedCollections, 3, async (collection) => {
        try {
          const result = await calculateCollectionCompliance(
            userId,
            collection.policies || [],
            userAgents.value,
          );
          collection.compliance = {
            assignedAndApplied: result.assignedAndApplied,
            assignedNotApplied: result.assignedNotApplied,
            notAssigned: result.notAssigned,
            loading: false,
          };
        } catch {
          if (collection.compliance) {
            collection.compliance.loading = false;
          }
        }
      });
    } else {
      for (const collection of mappedCollections) {
        if (collection.compliance) {
          collection.compliance.loading = false;
          collection.compliance.notAssigned = collection.policies?.length || 0;
        }
      }
    }
  } catch {
    userAppliedCollections.value = [];
  } finally {
    userAppliedCollectionsLoading.value = false;
  }
}

watch(
  selectedUserId,
  (id) => {
    if (id) loadUserAppliedCollections();
    else userAppliedCollections.value = [];
  },
  { immediate: true },
);

watch(
  [userAgentsLoading, userAgents, selectedUserId],
  ([loading, agents, userId]) => {
    if (!userId || loading || !Array.isArray(agents)) return;
    if (agents.length >= 1) {
      const agentIds = agents.map((a) => a.id);
      const agentNames = agents.map((a) => a.name);
      currentTarget.value = createUserGroupTargetForAgents(agentIds);
      targetLabel.value = agentNames.join(", ");

      if (userAppliedCollections.value.length > 0) {
        loadUserAppliedCollections();
      }
    } else {
      currentTarget.value = createGlobalTarget();
      targetLabel.value = "Global";
    }
  },
);

watch(
  () => props.open,
  (isOpen) => {
    if (!props.standalonePage && isOpen) loadUsers();
  },
  { immediate: true },
);

onMounted(() => {
  if (props.standalonePage) loadUsers();
});
</script>

<style scoped lang="sass">
.users-manager-layout
  height: 100%
  flex: 1 1 0%
  min-height: 0
  overflow: hidden
  background: #fff
  display: flex
  flex-direction: column

.users-manager-header
  flex-shrink: 0
  background-color: transparent
  color: black
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)

.users-manager-page
  flex: 1
  min-height: 0
  overflow: hidden

.users-manager-body
  display: flex
  height: 100%
  min-height: 0
  overflow: hidden

.body--dark .users-manager-layout
  background: rgba(30, 30, 30, 0.98)

.body--dark .users-manager-header
  color: rgba(255, 255, 255, 0.87)
  border-bottom-color: rgba(255, 255, 255, 0.12)

.target-badge
  padding: 6px 10px
</style>
