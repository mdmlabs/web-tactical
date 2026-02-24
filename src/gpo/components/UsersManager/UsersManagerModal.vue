<template>
  <q-layout view="hHh lpR fFf" class="users-manager-layout">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-icon name="person" size="sm" class="q-mr-sm" />
        <q-toolbar-title>Users Manager</q-toolbar-title>

        <q-badge
          v-if="targetLabel"
          :label="targetLabel"
          class="target-badge cursor-pointer"
          color="white"
          text-color="primary"
          @click="showTargetPanel = true"
        />
        <q-btn
          v-if="currentTarget"
          flat
          round
          dense
          icon="close"
          size="xs"
          color="white"
          class="q-mr-md"
          title="Reset target"
          @click.stop="resetTarget"
        />

        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          @click="$emit('close')"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="users-manager-page">
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
            @update="showUpdateUser = true"
            @delete="confirmDeleteUser(currentTarget!)"
            @toggle-enable="toggleEnableUser(currentTarget!)"
            @set-password="showSetPassword = true"
            @unlock="unlockUser(currentTarget!)"
            @expire-password="expirePassword(currentTarget!)"
            @set-expiration="showSetAccountExpiration = true"
            @update:detail-tab="(val) => detailTab = val"
          />
        </div>
      </q-page>
    </q-page-container>

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
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserActions } from "@/gpo/composables/useUserActions";
import type { CreateUserParams } from "@/gpo/composables/useUserActions";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import type { Target } from "@/gpo/api/grpc-client";

import UsersListPanel from "./UsersListPanel.vue";
import UserDetailPanel from "./UserDetailPanel.vue";
import CreateUserDialog from "./dialogs/CreateUserDialog.vue";
import UpdateUserDialog from "./dialogs/UpdateUserDialog.vue";
import SetPasswordDialog from "./dialogs/SetPasswordDialog.vue";
import SetAccountExpirationDialog from "./dialogs/SetAccountExpirationDialog.vue";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";

const props = defineProps<{ open?: boolean }>();
defineEmits<{ close: [] }>();

const currentTargetRef = ref<TargetRef | null>(null);
const currentTarget = ref<Target | null>(null);
const targetLabel = ref("Select target");

const showTargetPanel = ref(false);
const showCreateUser = ref(false);
const showUpdateUser = ref(false);
const showSetPassword = ref(false);
const showSetAccountExpiration = ref(false);

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
} = useUserActions();

function handleTargetSelect(ref: TargetRef) {
  currentTargetRef.value = ref;
  currentTarget.value = ref.target;
  targetLabel.value = ref.label;
}

function resetTarget() {
  currentTargetRef.value = null;
  currentTarget.value = null;
  targetLabel.value = "Select target";
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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) loadUsers();
  },
  { immediate: true },
);
</script>

<style scoped lang="sass">
.users-manager-layout
  height: 100vh
  background: #fff

.users-manager-page
  height: calc(100vh - 50px)

.users-manager-body
  display: flex
  height: 100%
  overflow: hidden

.target-badge
  padding: 6px 10px
</style>
