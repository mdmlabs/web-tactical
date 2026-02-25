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

        <q-badge
          v-if="targetLabel"
          :label="targetLabel"
          class="target-badge cursor-pointer"
          color="primary"
          text-color="white"
          @click="showTargetPanel = true"
        />
        <q-btn
          v-if="currentTargetRef"
          flat
          round
          dense
          icon="close"
          size="xs"
          color="primary"
          class="q-mr-md"
          title="Reset to Global"
          @click.stop="resetTarget"
        />

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
            @add-to-group="openAddToGroupDialog"
            @add-agent="showAddAgentPanel = true"
            @add-collection="showApplyCollectionDialog = true"
            @update:detail-tab="(val) => detailTab = val"
          />
        </div>
    </div>

    <CreateUserDialog
      v-model="showCreateUser"
      @create="handleCreateUser"
    />

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

    <TargetSelectionDialog
      v-model="showTargetPanel"
      @select="handleTargetSelect"
    />

    <q-dialog v-model="showAddToGroupDialog" position="standard" @show="loadAddToGroupOptions">
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add user to group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div v-if="userDetail?.info?.samaccountname" class="text-caption text-grey-7 q-mb-sm">
            User: <strong>{{ userDetail.info.samaccountname }}</strong>
          </div>
          <q-select
            v-model="addToGroupSelectedSam"
            :options="addToGroupOptions"
            option-value="sam"
            option-label="label"
            emit-value
            map-options
            label="Group *"
            outlined
            dense
            :loading="addToGroupOptionsLoading"
            :disable="addToGroupOptionsLoading"
            clearable
            options-dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ addToGroupOptionsLoading ? "Loading…" : "No groups available or user already in all" }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Add"
            :loading="addToGroupLoading"
            :disable="!addToGroupSelectedSam"
            @click="doAddUserToGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
            User: <strong>{{ userDetail?.info?.samaccountname ?? selectedUserId }}</strong>
          </div>
          <q-select
            v-model="applyCollectionSelectedId"
            :options="applyCollectionOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="Collection *"
            outlined
            dense
            :loading="applyCollectionLoading"
            :disable="applyCollectionLoading"
            clearable
            options-dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{
                    applyCollectionLoading
                      ? "Loading..."
                      : "No collections available"
                  }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Apply"
            :loading="applyCollectionApplying"
            :disable="!applyCollectionSelectedId"
            @click="doApplyCollectionToUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      agents-only
      @select="handleAddAgentTargetSelect"
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
  createGlobalTarget,
  userControlClient,
  getSingleAgentIdFromTarget,
  policyAssignmentClient,
  collectionsClient,
  type Target,
} from "@/gpo/api/grpc-client";
import operator_pb from "@/generated/operator_pb";
import { notifyError, notifySuccess } from "@/utils/notify";

import UsersListPanel from "./UsersListPanel.vue";
import UserDetailPanel from "./UserDetailPanel.vue";
import CreateUserDialog from "./dialogs/CreateUserDialog.vue";
import UpdateUserDialog from "./dialogs/UpdateUserDialog.vue";
import SetPasswordDialog from "./dialogs/SetPasswordDialog.vue";
import SetAccountExpirationDialog from "./dialogs/SetAccountExpirationDialog.vue";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";

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

const currentTargetRef = ref<TargetRef | null>(null);
const currentTarget = ref<Target>(createGlobalTarget());
const targetLabel = ref("Global");

const showTargetPanel = ref(false);
const showCreateUser = ref(false);
const showUpdateUser = ref(false);
const showSetPassword = ref(false);
const showSetAccountExpiration = ref(false);
const showAddToGroupDialog = ref(false);
const showAddAgentPanel = ref(false);
const showApplyCollectionDialog = ref(false);

const addToGroupOptions = ref<{ sam: string; label: string }[]>([]);
const applyCollectionLoading = ref(false);
const applyCollectionApplying = ref(false);
const applyCollectionSelectedId = ref<number | null>(null);
const applyCollectionOptions = ref<{ id: number; label: string }[]>([]);

const userAppliedCollections = ref<{ id: number; name: string }[]>([]);
const userAppliedCollectionsLoading = ref(false);

const canApplyCollection = computed(
  () =>
    !!selectedUserId.value &&
    !!(userDetail.value?.info?.samaccountname ?? selectedUserId.value) &&
    !!getSingleAgentIdFromTarget(currentTarget.value),
);
const addToGroupSelectedSam = ref<string | null>(null);
const addToGroupOptionsLoading = ref(false);
const addToGroupLoading = ref(false);

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

function handleTargetSelect(ref: TargetRef) {
  currentTargetRef.value = ref;
  currentTarget.value = ref.target;
  targetLabel.value = ref.label;
}

function resetTarget() {
  currentTargetRef.value = null;
  currentTarget.value = createGlobalTarget();
  targetLabel.value = "Global";
  selectedUserId.value = null;
  userDetail.value = null;
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
  const success = await updateUser(currentTarget.value, selectedUserId.value, params);
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
      const label =
        info.displayname ?? info.name ?? info.samaccountname ?? sam;
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
  const userSam = userDetail.value?.info?.samaccountname ?? selectedUserId.value;
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
      message: err instanceof Error ? err.message : "Failed to add user to group",
    });
  } finally {
    addToGroupLoading.value = false;
  }
}

async function handleAddAgentTargetSelect(ref: TargetRef) {
  const userId = selectedUserId.value ?? userDetail.value?.info?.samaccountname ?? userDetail.value?.userid;
  if (!userId) return;
  showAddAgentPanel.value = false;
  try {
    const res = await userControlClient.setUserAgent(ref.target, userId);
    if (res.status === 0) {
      $q.notify({ type: "positive", message: "Agent linked to user" });
      await loadUserAgents();
    } else {
      $q.notify({
        type: "negative",
        message: res.errorMessage ?? "Failed to link agent",
      });
    }
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err instanceof Error ? err.message : "Failed to link agent",
    });
  }
}

function isUserScope(raw: unknown): boolean {
  if (raw === undefined || raw === null) return false;
  if (typeof raw === "number") {
    const n = Math.floor(raw);
    return n === operator_pb.PolicyScope.POLICY_SCOPE_USER;
  }
  const s = String(raw).toUpperCase();
  return s === "USER" || s === "1";
}

async function loadCollectionsForApply() {
  applyCollectionLoading.value = true;
  applyCollectionSelectedId.value = null;
  applyCollectionOptions.value = [];
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

async function doApplyCollectionToUser() {
  const agentId = getSingleAgentIdFromTarget(currentTarget.value);
  const userId = selectedUserId.value ?? userDetail.value?.userid;
  const userLabel = userDetail.value?.info?.samaccountname ?? userId;
  const collectionId = applyCollectionSelectedId.value;
  if (!agentId || !userId || collectionId == null) return;
  applyCollectionApplying.value = true;
  try {
    await policyAssignmentClient.assignPolicyCollection(collectionId, "user", {
      agentId,
      userId,
    });
    notifySuccess(
      `Collection applied to user "${userLabel}" on agent`,
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
    const list =
      (
        response as {
          collectionsList?: Array<{ id?: number; name?: string }>;
        }
      ).collectionsList ??
      (
        response as {
          collections?: Array<{ id?: number; name?: string }>;
        }
      ).collections ??
      [];
    userAppliedCollections.value = list.map((c) => ({
      id: c.id ?? 0,
      name: c.name ?? String(c.id ?? ""),
    }));
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
  overflow: hidden

.target-badge
  padding: 6px 10px
</style>
