<template>
  <div class="groups-manager-layout">
    <div class="groups-manager-header">
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
        <q-icon name="group" size="sm" class="q-mr-sm" color="primary" />
        <q-toolbar-title>Groups Manager</q-toolbar-title>

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

    <div class="groups-manager-page">
      <div class="groups-manager-body">
        <GroupsListPanel
          :tree-nodes="filteredGroupTree"
          :loading="groupsLoading"
          :error="groupsError"
          :selected-id="selectedGroupId"
          :search="groupSearch"
          @select="selectGroup"
          @refresh="loadGroups"
          @create="openCreateGroupDialog"
          @update:search="groupSearch = $event"
        />

        <q-separator vertical />

        <GroupDetailPanel
          :selected-group-sam="selectedGroupSam"
          :selected-group-id="selectedGroupId"
          :group="selectedGroup"
          :detail-tab="detailTab"
          :detail-loading="detailLoading"
          :delete-loading="deleteLoading"
          :group-users="groupUsers"
          :group-children="groupChildren"
          :group-parents="groupParents"
          :group-agents="groupAgents"
          :removing-agent-id="removingAgentId"
          :group-applied-collections="groupAppliedCollections"
          :group-applied-collections-loading="groupAppliedCollectionsLoading"
          :can-remove-collection="canRemoveGroupCollection"
          @delete="confirmDeleteGroup"
          @update:detail-tab="(val) => (detailTab = val)"
          @add-user="openAddUserToGroupDialog"
          @remove-user="removeUserFromGroup"
          @navigate-to-group="navigateToGroup"
          @add-agent="showAddAgentPanel = true"
          @remove-agent="handleRemoveGroupAgent"
          @apply-collection="showApplyCollectionDialog = true"
          @remove-collection="showRemoveCollectionDialog = true"
        />
      </div>
    </div>

    <CreateGroupDialog
      v-model="showCreateGroup"
      :loading="createGroupLoading"
      :parent-group-options="parentGroupOptions"
      :initial-parent-id="selectedGroupId"
      @create="handleCreateGroup"
    />

    <AddUserToGroupDialog
      v-model="showAddUser"
      :group-sam="selectedGroupSam ?? ''"
      :options="addUserOptions"
      :options-loading="addUserOptionsLoading"
      :loading="addUserLoading"
      @add="handleAddUserToGroup"
    />

    <ApplyCollectionToGroupDialog
      v-model="showApplyCollectionDialog"
      :group-sam="selectedGroupSam ?? ''"
      :options="applyCollectionOptions"
      :options-loading="applyCollectionLoading"
      :loading="applyCollectionApplying"
      @apply="handleApplyCollectionToGroup"
    />

    <RemoveCollectionFromGroupDialog
      v-model="showRemoveCollectionDialog"
      :group-sam="selectedGroupSam ?? ''"
      :options="removeCollectionOptions"
      :loading="removeCollectionRemoving"
      @remove="handleRemoveCollectionFromGroup"
    />

    <TargetSelectionDialog
      v-model="showTargetPanel"
      @select="handleTargetSelect"
    />

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      @select="handleAddAgentToGroupSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import operator_pb from "@/generated/operator_pb";
import {
  createAgentTarget,
  createGroupTarget,
  userControlClient,
  createGlobalTarget,
  policyAssignmentClient,
  collectionsClient,
} from "@/gpo/api/grpc-client";
import type { Target } from "@/gpo/api/grpc-client";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";
import { notifyError, notifySuccess } from "@/utils/notify";

import GroupsListPanel from "./GroupsListPanel.vue";
import GroupDetailPanel from "./GroupDetailPanel.vue";
import CreateGroupDialog from "./dialogs/CreateGroupDialog.vue";
import AddUserToGroupDialog from "./dialogs/AddUserToGroupDialog.vue";
import ApplyCollectionToGroupDialog from "./dialogs/ApplyCollectionToGroupDialog.vue";
import RemoveCollectionFromGroupDialog from "./dialogs/RemoveCollectionFromGroupDialog.vue";

interface GroupRow {
  name?: string;
  displayname?: string;
  distinguishedname?: string;
  samaccountname?: string;
  description?: string;
  sid?: string;
}

interface TreeNode {
  id: string;
  label: string;
  isCategory: boolean;
  children?: TreeNode[];
  samAccountName?: string;
}

interface GroupRowWithId extends GroupRow {
  groupId: string;
}

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

const showTargetPanel = ref(false);
const showAddAgentPanel = ref(false);
const currentTargetRef = ref<TargetRef | null>(null);
const currentTarget = ref<Target>(createGlobalTarget());
const targetLabel = ref("Global");

const allGroups = ref<GroupRowWithId[]>([]);
const groupTreeNodes = ref<TreeNode[]>([]);
const groupsLoading = ref(false);
const groupsError = ref<string | null>(null);
const groupSearch = ref("");

const selectedGroupSam = ref<string | null>(null);
const selectedGroupId = ref<string | null>(null);
const selectedGroup = ref<GroupRow | null>(null);
const detailTab = ref("members");
const detailLoading = ref(false);

const groupUsers = ref<GroupRow[]>([]);
const groupChildren = ref<GroupRow[]>([]);
const groupParents = ref<GroupRow[]>([]);
const groupAgents = ref<string[]>([]);
const removingAgentId = ref<string | null>(null);

const deleteLoading = ref(false);

const showCreateGroup = ref(false);
const createGroupLoading = ref(false);

const parentGroupOptions = computed(() =>
  allGroups.value.map((g) => ({
    groupId: g.groupId,
    label: g.displayname || g.samaccountname || g.groupId,
  })),
);

const showAddUser = ref(false);
const addUserLoading = ref(false);
const addUserOptions = ref<
  { id: string; label: string; samAccountName: string }[]
>([]);
const addUserOptionsLoading = ref(false);

const showApplyCollectionDialog = ref(false);
const applyCollectionLoading = ref(false);
const applyCollectionApplying = ref(false);
const applyCollectionSelectedId = ref<number | null>(null);
const applyCollectionOptions = ref<{ id: number; label: string }[]>([]);

const groupAppliedCollections = ref<
  {
    id: number;
    name: string;
    explainText?: string;
    policies?: { id: number; name: string }[];
  }[]
>([]);
const groupAppliedCollectionsLoading = ref(false);

const canRemoveGroupCollection = computed(
  () =>
    !!selectedGroupId.value &&
    (groupAppliedCollections.value?.length ?? 0) > 0,
);

const showRemoveCollectionDialog = ref(false);
const removeCollectionSelectedId = ref<number | null>(null);
const removeCollectionOptions = ref<{ id: number; label: string }[]>([]);
const removeCollectionRemoving = ref(false);

type ApiGroupTreeNode = {
  groupid: string;
  info?: {
    name?: string;
    displayname?: string;
    distinguishedname?: string;
    samaccountname?: string;
    description?: string;
    sid?: string;
  };
  childrenList?: ApiGroupTreeNode[];
};

function mapGroupTreeNodeToTreeNode(
  node: ApiGroupTreeNode,
  flatList: GroupRowWithId[],
): TreeNode {
  const groupId = node.groupid || "";
  const info = node.info;
  const label =
    info?.displayname || info?.name || info?.samaccountname || groupId || "—";
  const samAccountName = info?.samaccountname || groupId;
  flatList.push({
    groupId,
    name: info?.name || "",
    displayname: info?.displayname || "",
    distinguishedname: info?.distinguishedname || "",
    samaccountname: info?.samaccountname || "",
    description: info?.description || "",
    sid: info?.sid || "",
  });
  const children = (node.childrenList || []).map((child) =>
    mapGroupTreeNodeToTreeNode(child, flatList),
  );
  return {
    id: groupId,
    label,
    isCategory: false,
    samAccountName,
    children: children.length > 0 ? children : undefined,
  };
}

function filterGroupTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const lower = q.toLowerCase();
  const result: TreeNode[] = [];
  for (const n of nodes) {
    const matches =
      n.label.toLowerCase().includes(lower) ||
      (n.samAccountName || "").toLowerCase().includes(lower);
    const filteredChildren = n.children?.length
      ? filterGroupTree(n.children, q)
      : [];
    const childMatches = filteredChildren.length > 0;
    if (matches || childMatches) {
      result.push({
        ...n,
        children: filteredChildren.length > 0 ? filteredChildren : n.children,
      });
    }
  }
  return result;
}

const filteredGroupTree = computed<TreeNode[]>(() => {
  const q = groupSearch.value.trim();
  if (!q) return groupTreeNodes.value;
  return filterGroupTree(groupTreeNodes.value, q);
});

const currentUserGroupTarget = computed(() => currentTarget.value);

function handleTargetSelect(ref: TargetRef) {
  currentTargetRef.value = ref;
  currentTarget.value = ref.target;
  targetLabel.value = ref.label;
  onTargetChange();
}

function resetTarget() {
  currentTargetRef.value = null;
  currentTarget.value = createGlobalTarget();
  targetLabel.value = "Global";
}

async function handleAddAgentToGroupSelect(ref: TargetRef) {
  const groupId = selectedGroupId.value;
  if (!groupId) return;
  showAddAgentPanel.value = false;
  try {
    const res = await userControlClient.setGroupAgent(ref.target, groupId);
    if (res.status === 0) {
      notifySuccess("Target linked to group");
      await loadGroupDetails(groupId);
    } else {
      notifyError(res.errorMessage ?? "Failed to link target to group");
    }
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to link target to group",
    );
  }
}

async function handleRemoveGroupAgent(agentId: string) {
  const groupId = selectedGroupId.value;
  if (!groupId) return;
  removingAgentId.value = agentId;
  try {
    const target = createAgentTarget(agentId);
    const res = await userControlClient.removeGroupAgent(target, groupId);
    if (res.status === 0) {
      notifySuccess("Agent unlinked from group");
      await loadGroupDetails(groupId);
    } else {
      notifyError(res.errorMessage ?? "Failed to unlink agent from group");
    }
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to unlink agent from group",
    );
  } finally {
    removingAgentId.value = null;
  }
}

function onTargetChange() {
  selectedGroupSam.value = null;
  selectedGroupId.value = null;
  selectedGroup.value = null;
  allGroups.value = [];
  groupTreeNodes.value = [];
  groupUsers.value = [];
  groupChildren.value = [];
  groupParents.value = [];
  groupAgents.value = [];
  loadGroups();
}

async function loadGroups() {
  groupsLoading.value = true;
  groupsError.value = null;
  try {
    const res = await userControlClient.getGroupTree();
    const roots = res.rootsList ?? [];
    const flatList: GroupRowWithId[] = [];
    groupTreeNodes.value = roots.map((node: ApiGroupTreeNode) =>
      mapGroupTreeNodeToTreeNode(node, flatList),
    );
    allGroups.value = flatList;
  } catch (err) {
    groupsError.value =
      err instanceof Error ? err.message : "Failed to load groups";
  } finally {
    groupsLoading.value = false;
  }
}

watch(
  selectedGroupId,
  (id) => {
    if (id) loadGroupAppliedCollections();
    else groupAppliedCollections.value = [];
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (!props.standalonePage && isOpen) loadGroups();
  },
  { immediate: true },
);

watch(showApplyCollectionDialog, (open) => {
  if (open) loadCollectionsForApply();
});

watch(showRemoveCollectionDialog, (open) => {
  if (open) prepareRemoveCollectionOptionsForGroup();
});

watch(showAddUser, (open) => {
  if (open) loadAddUserOptions();
});

onMounted(() => {
  if (props.standalonePage) loadGroups();
});

function selectGroup(nodeId: string | null) {
  if (!nodeId) return;
  const found = allGroups.value.find((g) => g.groupId === nodeId);
  if (!found) return;

  selectedGroupId.value = found.groupId;
  selectedGroupSam.value = found.samaccountname || found.groupId;
  selectedGroup.value = found;
  detailTab.value = "members";
  loadGroupDetails(found.groupId);
}

function navigateToGroup(row: GroupRow | GroupRowWithId) {
  const withId = row as GroupRowWithId;
  const groupId = withId.groupId ?? withId.samaccountname;
  if (groupId) {
    selectedGroupId.value = groupId;
    selectedGroupSam.value = withId.samaccountname || groupId;
    selectedGroup.value =
      allGroups.value.find((g) => g.groupId === groupId) || (row as GroupRow);
    loadGroupDetails(groupId);
  }
}

async function loadGroupDetails(groupId: string) {
  detailLoading.value = true;
  groupUsers.value = [];
  groupChildren.value = [];
  groupParents.value = [];
  groupAgents.value = [];

  const toGroupRow = (g: Record<string, unknown>): GroupRow => ({
    name: (g.name as string) || "",
    displayname: (g.displayname as string) || "",
    distinguishedname: (g.distinguishedname as string) || "",
    samaccountname: (g.samaccountname as string) || "",
    description: (g.description as string) || "",
    sid: (g.sid as string) || "",
  });

  try {
    const [usersRes, childrenRes, parentsRes, agentsRes] =
      await Promise.allSettled([
        userControlClient.getGroupUsers(groupId),
        userControlClient.getGroupChildGroups(groupId),
        userControlClient.getGroupParentGroups(groupId),
        userControlClient.getGroupAgents(groupId),
      ]);

    if (usersRes.status === "fulfilled") {
      const list = usersRes.value.usersList || [];
      groupUsers.value = list.map(
        (u: { userid?: string; info?: Record<string, unknown> }) => {
          const info = (u.info ?? u) as Record<string, unknown>;
          return {
            name: String(info.name ?? ""),
            displayname: String(info.displayname ?? ""),
            samaccountname: String(info.samaccountname ?? ""),
            sid: String(info.sid ?? ""),
            description: String(info.description ?? ""),
          };
        },
      );
    }
    if (childrenRes.status === "fulfilled") {
      const list = childrenRes.value.groupsList || [];
      groupChildren.value = list.map(
        (item: { info?: Record<string, unknown> }) =>
          toGroupRow(item.info ?? item),
      );
    }
    if (parentsRes.status === "fulfilled") {
      const list = parentsRes.value.groupsList || [];
      groupParents.value = list.map(
        (item: { info?: Record<string, unknown> }) =>
          toGroupRow(item.info ?? item),
      );
    }
    if (agentsRes.status === "fulfilled") {
      groupAgents.value = agentsRes.value.agentIdsList || [];
    }
  } finally {
    detailLoading.value = false;
  }
}

function confirmDeleteGroup() {
  $q.dialog({
    title: "Delete Group",
    message: `Are you sure you want to delete group "${selectedGroupSam.value}"?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(doDeleteGroup);
}

async function doDeleteGroup() {
  const target = currentUserGroupTarget.value;
  if (!target || !selectedGroupSam.value) return;
  deleteLoading.value = true;
  try {
    await userControlClient.deleteGroup(target, selectedGroupSam.value);
    $q.notify({
      type: "positive",
      message: `Group "${selectedGroupSam.value}" deleted`,
    });
    selectedGroupSam.value = null;
    selectedGroupId.value = null;
    selectedGroup.value = null;
    await loadGroups();
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err instanceof Error ? err.message : "Delete failed",
    });
  } finally {
    deleteLoading.value = false;
  }
}

function openCreateGroupDialog() {
  showCreateGroup.value = true;
}

async function handleCreateGroup(payload: {
  samGroupName: string;
  description: string;
  parentId: string | null;
}) {
  const target = currentUserGroupTarget.value;
  if (!target) return;
  createGroupLoading.value = true;
  try {
    const res = await userControlClient.createGroup(
      target,
      payload.samGroupName.trim(),
      payload.description.trim() || undefined,
      payload.parentId || undefined,
    );
    if (res.status === 0) {
      $q.notify({
        type: "positive",
        message: `Group "${payload.samGroupName}" created`,
      });
      showCreateGroup.value = false;
      await loadGroups();
    } else {
      $q.notify({
        type: "negative",
        message: res.errorMessage || "Create failed",
      });
    }
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err instanceof Error ? err.message : "Create failed",
    });
  } finally {
    createGroupLoading.value = false;
  }
}

async function loadAddUserOptions() {
  addUserOptions.value = [];
  addUserOptionsLoading.value = true;
  try {
    const res = await userControlClient.getAllUsers();
    const list = res.usersList ?? [];
    const alreadyInGroup = new Set(
      groupUsers.value.map((u) => (u.samaccountname ?? "").toLowerCase()),
    );
    const options: { id: string; label: string; samAccountName: string }[] = [];
    for (const u of list) {
      const rec = u as {
        info?: Record<string, string>;
        userid?: string;
        userId?: string;
      };
      const info = rec.info ?? {};
      const uid = rec.userid ?? rec.userId ?? "";
      const sam = (info.samaccountname ?? uid).trim();
      if (!sam || alreadyInGroup.has(sam.toLowerCase())) continue;
      const label =
        (info.displayname ?? info.name ?? info.samaccountname ?? uid ?? sam) ||
        sam;
      options.push({ id: uid || sam, label, samAccountName: sam });
    }
    addUserOptions.value = options;
  } catch {
    addUserOptions.value = [];
  } finally {
    addUserOptionsLoading.value = false;
  }
}

function openAddUserToGroupDialog() {
  showAddUser.value = true;
}

async function handleAddUserToGroup(samAccountName: string) {
  if (!selectedGroupSam.value) return;
  const target = selectedGroupId.value
    ? createGroupTarget(selectedGroupId.value)
    : currentUserGroupTarget.value;
  if (!target) return;
  addUserLoading.value = true;
  try {
    const res = await userControlClient.addUserToGroup(
      target,
      selectedGroupSam.value,
      samAccountName.trim(),
    );
    if (res.status === 0) {
      $q.notify({ type: "positive", message: "User added to group" });
      showAddUser.value = false;
      if (selectedGroupId.value) loadGroupDetails(selectedGroupId.value);
    } else {
      $q.notify({
        type: "negative",
        message: res.errorMessage || "Failed to add user",
      });
    }
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err instanceof Error ? err.message : "Failed to add user",
    });
  } finally {
    addUserLoading.value = false;
  }
}

function isUserScope(raw: unknown): boolean {
  if (raw === undefined || raw === null) {
    return false;
  }
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

function handleApplyCollectionToGroup(collectionId: number) {
  applyCollectionSelectedId.value = collectionId;
  const collectionLabel =
    applyCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Apply collections",
    message: `Do you really want to apply the collection «${collectionLabel}»?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    doApplyCollectionToGroup();
  });
}

async function doApplyCollectionToGroup() {
  const groupId = selectedGroupId.value;
  const collectionId = applyCollectionSelectedId.value;
  if (!groupId || collectionId == null) return;
  applyCollectionApplying.value = true;
  try {
    await policyAssignmentClient.assignPolicyCollection(collectionId, "group", {
      groupId,
    });
    notifySuccess(
      `Collection applied to group "${selectedGroupSam.value ?? groupId}"`,
    );
    showApplyCollectionDialog.value = false;
    await loadGroupAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to apply collection",
    );
  } finally {
    applyCollectionApplying.value = false;
  }
}

function prepareRemoveCollectionOptionsForGroup() {
  removeCollectionSelectedId.value = null;
  removeCollectionOptions.value = (groupAppliedCollections.value ?? []).map(
    (c) => ({ id: c.id, label: c.name || String(c.id) }),
  );
}

function handleRemoveCollectionFromGroup(collectionId: number) {
  removeCollectionSelectedId.value = collectionId;
  const collectionLabel =
    removeCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Remove collections",
    message: `Do you really want to delete the collection «${collectionLabel}»?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(() => {
    doRemoveCollectionFromGroup();
  });
}

async function doRemoveCollectionFromGroup() {
  const groupId = selectedGroupId.value;
  const collectionId = removeCollectionSelectedId.value;
  const groupLabel = selectedGroupSam.value ?? groupId;
  if (!groupId || collectionId == null) return;
  removeCollectionRemoving.value = true;
  try {
    await policyAssignmentClient.removePolicyCollection(collectionId, "group", {
      groupId,
    });
    notifySuccess(`Collection removed from group "${groupLabel}"`);
    showRemoveCollectionDialog.value = false;
    await loadGroupAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to remove collection",
    );
  } finally {
    removeCollectionRemoving.value = false;
  }
}

async function loadGroupAppliedCollections() {
  const groupId = selectedGroupId.value;
  if (!groupId) {
    groupAppliedCollections.value = [];
    return;
  }
  groupAppliedCollectionsLoading.value = true;
  groupAppliedCollections.value = [];
  try {
    const response = await collectionsClient.getAppliedCollectionsByGroup(
      groupId,
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
    groupAppliedCollections.value = list.map((c) => {
      const rawPolicies = c.policiesList ?? c.policies ?? [];
      return {
        id: c.id ?? 0,
        name: c.name ?? String(c.id ?? ""),
        explainText: (c.explainText ?? c.explain_text ?? "").trim() || undefined,
        policies: rawPolicies.map((p) => ({
          id: p.id ?? 0,
          name:
            p.displayName ?? p.display_name ?? p.name ?? String(p.id ?? ""),
        })),
      };
    });
  } catch {
    groupAppliedCollections.value = [];
  } finally {
    groupAppliedCollectionsLoading.value = false;
  }
}

async function removeUserFromGroup(user: GroupRow) {
  const target = currentUserGroupTarget.value;
  if (!target || !selectedGroupSam.value) return;
  $q.dialog({
    title: "Remove User",
    message: `Remove "${user.displayname || user.samaccountname}" from group "${selectedGroupSam.value}"?`,
    cancel: true,
  }).onOk(async () => {
    try {
      const res = await userControlClient.removeUserFromGroup(
        target,
        selectedGroupSam.value!,
        user.samaccountname || "",
      );
      if (res.status === 0 && selectedGroupId.value) {
        $q.notify({ type: "positive", message: "User removed from group" });
        loadGroupDetails(selectedGroupId.value);
      } else {
        $q.notify({
          type: "negative",
          message: res.errorMessage || "Failed to remove user",
        });
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed to remove user",
      });
    }
  });
}
</script>

<style scoped lang="sass">
.groups-manager-layout
  height: 100%
  background: #fff
  display: flex
  flex-direction: column

.groups-manager-header
  flex-shrink: 0
  background-color: transparent
  color: black
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)

.groups-manager-page
  flex: 1
  min-height: 0
  overflow: hidden

.groups-manager-body
  display: flex
  height: 100%
  overflow: hidden

.target-badge
  padding: 6px 10px
</style>
