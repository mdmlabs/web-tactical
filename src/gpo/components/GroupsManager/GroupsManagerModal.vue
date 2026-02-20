<template>
  <q-layout view="hHh lpR fFf" class="groups-manager-layout">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-icon name="group" size="sm" class="q-mr-sm" />
        <q-toolbar-title>Groups Manager</q-toolbar-title>

        <q-badge
          v-if="targetLabel"
          :label="targetLabel"
          class="q-mr-md target-badge cursor-pointer"
          color="white"
          text-color="primary"
          @click="showTargetPanel = true"
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
      <q-page class="groups-manager-page">
        <div class="groups-manager-body">
          <div class="groups-left-panel">
            <div class="groups-left-header row items-center q-px-md q-py-sm">
              <div class="text-subtitle1 text-weight-medium">Groups</div>
              <q-space />
              <q-btn
                flat
                dense
                round
                icon="add"
                color="primary"
                title="Create group"
                :disable="!currentUserGroupTarget"
                @click="openCreateGroupDialog"
              />
              <q-btn
                flat
                dense
                round
                icon="refresh"
                color="grey-7"
                title="Refresh"
                :loading="groupsLoading"
                @click="loadGroups"
              />
            </div>

            <q-separator />

            <div class="q-px-md q-py-sm">
              <q-input
                v-model="groupSearch"
                dense
                outlined
                placeholder="Search..."
                clearable
                :input-style="{ paddingLeft: '6px' }"
                @clear="groupSearch = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="xs" />
                </template>
              </q-input>
            </div>

            <div
              v-if="groupsLoading"
              class="column items-center justify-center q-pa-xl"
            >
              <q-spinner color="primary" size="2em" />
              <div class="q-mt-sm text-caption">Loading groups...</div>
            </div>

            <div
              v-else-if="groupsError"
              class="column items-center justify-center q-pa-lg text-negative"
            >
              <q-icon name="error" size="2rem" class="q-mb-sm" />
              <div class="text-caption">{{ groupsError }}</div>
              <q-btn flat dense color="primary" label="Retry" class="q-mt-sm" @click="loadGroups" />
            </div>

            <q-scroll-area
              v-else-if="filteredGroupTree.length > 0"
              class="groups-tree-scroll"
            >
              <q-tree
                :nodes="filteredGroupTree"
                node-key="id"
                :selected="selectedGroupId"
                default-expand-all
                class="groups-tree q-pa-sm"
                @update:selected="selectGroup"
              >
                <template v-slot:default-header="prop">
                  <div class="row items-center full-width groups-tree-item">
                    <q-icon
                      :name="prop.node.isCategory ? 'folder' : 'group'"
                      :color="prop.node.isCategory ? 'warning' : 'primary'"
                      size="xs"
                      class="q-mr-xs"
                    />
                    <div class="col ellipsis text-body2">{{ prop.node.label }}</div>
                    <q-badge
                      v-if="prop.node.isCategory && prop.node.children?.length"
                      color="grey-4"
                      text-color="grey-8"
                      :label="prop.node.children.length"
                      class="q-ml-xs"
                    />
                  </div>
                </template>
              </q-tree>
            </q-scroll-area>

            <div
              v-else
              class="column items-center justify-center q-pa-xl text-grey-6"
            >
              <q-icon name="search_off" size="2rem" class="q-mb-sm" />
              <div class="text-caption">{{ groupSearch ? 'No groups match the filter' : 'No groups found' }}</div>
            </div>
          </div>

          <q-separator vertical />

          <div class="groups-right-panel">
            <div
              v-if="!selectedGroupSam"
              class="column items-center justify-center full-height text-grey-6"
            >
              <q-icon name="group" size="3rem" class="q-mb-md" />
              <div class="text-h6">Select a group</div>
              <div class="text-caption q-mt-xs">Click on a group in the tree to see its details</div>
            </div>

            <template v-else>
              <div class="groups-detail-header q-px-lg q-py-md row items-center">
                <div>
                  <div class="text-h6 text-weight-medium">
                    {{ selectedGroup?.displayname || selectedGroup?.name || selectedGroupSam }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ selectedGroup?.distinguishedname || selectedGroupSam }}
                  </div>
                </div>
                <q-space />
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete"
                  label="Delete Group"
                  :loading="deleteLoading"
                  @click="confirmDeleteGroup"
                />
              </div>

              <q-separator />

              <div class="row q-gutter-sm q-px-lg q-py-md">
                <q-card flat bordered class="col-auto">
                  <q-card-section class="q-pa-sm text-center" style="min-width: 120px">
                    <div class="text-caption text-grey-6">SAM Name</div>
                    <div class="text-body2 text-weight-medium">{{ selectedGroup?.samaccountname || '—' }}</div>
                  </q-card-section>
                </q-card>
                <q-card flat bordered class="col-auto">
                  <q-card-section class="q-pa-sm text-center" style="min-width: 120px">
                    <div class="text-caption text-grey-6">SID</div>
                    <div class="text-body2 text-weight-medium text-mono" style="font-size:11px">{{ selectedGroup?.sid || '—' }}</div>
                  </q-card-section>
                </q-card>
                <q-card flat bordered class="col">
                  <q-card-section class="q-pa-sm">
                    <div class="text-caption text-grey-6">Description</div>
                    <div class="text-body2">{{ selectedGroup?.description || '—' }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <q-separator />

              <q-tabs
                v-model="detailTab"
                dense
                inline-label
                class="text-grey bg-grey-1"
                active-color="primary"
                indicator-color="primary"
                align="left"
                narrow-indicator
                no-caps
              >
                <q-tab name="members" icon="people" label="Members">
                  <q-badge
                    v-if="groupUsers.length"
                    color="primary"
                    :label="groupUsers.length"
                    floating
                    rounded
                  />
                </q-tab>
                <q-tab name="children" icon="account_tree" label="Child Groups">
                  <q-badge
                    v-if="groupChildren.length"
                    color="primary"
                    :label="groupChildren.length"
                    floating
                    rounded
                  />
                </q-tab>
                <q-tab name="parents" icon="call_merge" label="Parent Groups">
                  <q-badge
                    v-if="groupParents.length"
                    color="primary"
                    :label="groupParents.length"
                    floating
                    rounded
                  />
                </q-tab>
                <q-tab name="agents" icon="dns" label="Agents">
                  <q-badge
                    v-if="groupAgents.length"
                    color="primary"
                    :label="groupAgents.length"
                    floating
                    rounded
                  />
                </q-tab>
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="detailTab" class="groups-tab-panels">
                <q-tab-panel name="members" class="q-pa-md">
                  <div class="row items-center q-mb-md">
                    <div class="text-subtitle2">Group Members</div>
                    <q-space />
                    <q-btn
                      flat dense color="primary" icon="person_add"
                      label="Add User"
                      :disable="!selectedGroupSam"
                      @click="openAddUserToGroupDialog"
                    />
                  </div>

                  <div v-if="detailLoading" class="text-center q-pa-md">
                    <q-spinner color="primary" />
                  </div>
                  <q-table
                    v-else
                    :rows="groupUsers"
                    :columns="usersColumns"
                    row-key="samaccountname"
                    flat
                    bordered
                    dense
                    :rows-per-page-options="[15, 30, 50, 0]"
                    :no-data-label="'No members in this group'"
                  >
                    <template v-slot:body-cell-actions="cellProps">
                      <q-td :props="cellProps">
                        <q-btn
                          flat round dense icon="person_remove" size="xs"
                          color="negative"
                          title="Remove from group"
                          @click="removeUserFromGroup(cellProps.row)"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="children" class="q-pa-md">
                  <div class="text-subtitle2 q-mb-md">Child Groups</div>
                  <div v-if="detailLoading" class="text-center q-pa-md">
                    <q-spinner color="primary" />
                  </div>
                  <q-table
                    v-else
                    :rows="groupChildren"
                    :columns="groupsSubColumns"
                    row-key="samaccountname"
                    flat
                    bordered
                    dense
                    :rows-per-page-options="[15, 30, 50, 0]"
                    :no-data-label="'No child groups'"
                  >
                    <template v-slot:body-cell-name="cellProps">
                      <q-td :props="cellProps">
                        <span
                          class="text-primary cursor-pointer"
                          @click="navigateToGroup(cellProps.row)"
                        >{{ cellProps.value }}</span>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="parents" class="q-pa-md">
                  <div class="text-subtitle2 q-mb-md">Parent Groups</div>
                  <div v-if="detailLoading" class="text-center q-pa-md">
                    <q-spinner color="primary" />
                  </div>
                  <q-table
                    v-else
                    :rows="groupParents"
                    :columns="groupsSubColumns"
                    row-key="samaccountname"
                    flat
                    bordered
                    dense
                    :rows-per-page-options="[15, 30, 50, 0]"
                    :no-data-label="'No parent groups'"
                  >
                    <template v-slot:body-cell-name="cellProps">
                      <q-td :props="cellProps">
                        <span
                          class="text-primary cursor-pointer"
                          @click="navigateToGroup(cellProps.row)"
                        >{{ cellProps.value }}</span>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="agents" class="q-pa-md">
                  <div class="text-subtitle2 q-mb-md">Agents linked to this group</div>
                  <div v-if="detailLoading" class="text-center q-pa-md">
                    <q-spinner color="primary" />
                  </div>
                  <div v-else-if="groupAgents.length === 0" class="text-grey-6 text-caption">
                    No agents linked
                  </div>
                  <q-list v-else bordered separator>
                    <q-item v-for="agentId in groupAgents" :key="agentId">
                      <q-item-section avatar>
                        <q-icon name="dns" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ agentId }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="showCreateGroup">
      <q-card style="min-width: 380px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="createGroupForm.samGroupName"
            label="Group Name *"
            outlined
            dense
            class="q-mb-sm"
            autofocus
          />
          <q-input
            v-model="createGroupForm.description"
            label="Description"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Create"
            :loading="createGroupLoading"
            :disable="!createGroupForm.samGroupName.trim()"
            @click="doCreateGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddUser">
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add User to Group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Group: <strong>{{ selectedGroupSam }}</strong>
          </div>
          <q-input
            v-model="addUserForm.samAccountName"
            label="SAM Account Name *"
            outlined
            dense
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Add"
            :loading="addUserLoading"
            :disable="!addUserForm.samAccountName.trim()"
            @click="doAddUserToGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <TargetSelectionDialog
      v-model="showTargetPanel"
      @select="handleTargetSelect"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { userControlClient } from "@/gpo/api/grpc-client";
import type { UserGroupTarget } from "@/generated/user_service_pb";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";

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

const props = defineProps<{ open?: boolean }>();
defineEmits<{ close: [] }>();
const $q = useQuasar();

const showTargetPanel = ref(false);
const currentTargetRef = ref<TargetRef | null>(null);
const currentTarget = ref<UserGroupTarget | null>(null);
const targetLabel = ref("Select target");

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

const deleteLoading = ref(false);

const showCreateGroup = ref(false);
const createGroupLoading = ref(false);
const createGroupForm = ref({ samGroupName: "", description: "" });

const showAddUser = ref(false);
const addUserLoading = ref(false);
const addUserForm = ref({ samAccountName: "" });


const usersColumns = [
  { name: "displayname", label: "Display Name", field: "displayname", align: "left" as const, sortable: true },
  { name: "samaccountname", label: "SAM Name", field: "samaccountname", align: "left" as const, sortable: true },
  { name: "sid", label: "SID", field: "sid", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "center" as const, style: "width: 48px" },
];

const groupsSubColumns = [
  { name: "name", label: "Name", field: (r: GroupRow) => r.displayname || r.name || r.samaccountname, align: "left" as const, sortable: true },
  { name: "samaccountname", label: "SAM Name", field: "samaccountname", align: "left" as const },
  { name: "description", label: "Description", field: "description", align: "left" as const },
];


type ApiGroupTreeNode = {
  groupid: string;
  info?: { name?: string; displayname?: string; distinguishedname?: string; samaccountname?: string; description?: string; sid?: string };
  childrenList?: ApiGroupTreeNode[];
};

function mapGroupTreeNodeToTreeNode(node: ApiGroupTreeNode, flatList: GroupRowWithId[]): TreeNode {
  const groupId = node.groupid || "";
  const info = node.info;
  const label = info?.displayname || info?.name || info?.samaccountname || groupId || "—";
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
  const children = (node.childrenList || []).map((child) => mapGroupTreeNodeToTreeNode(child, flatList));
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
    const matches = n.label.toLowerCase().includes(lower) || (n.samAccountName || "").toLowerCase().includes(lower);
    const filteredChildren = n.children?.length ? filterGroupTree(n.children, q) : [];
    const childMatches = filteredChildren.length > 0;
    if (matches || childMatches) {
      result.push({ ...n, children: filteredChildren.length > 0 ? filteredChildren : n.children });
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
    groupTreeNodes.value = roots.map((node: ApiGroupTreeNode) => mapGroupTreeNodeToTreeNode(node, flatList));
    allGroups.value = flatList;
  } catch (err) {
    groupsError.value = err instanceof Error ? err.message : "Failed to load groups";
  } finally {
    groupsLoading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) loadGroups();
  },
  { immediate: true },
);

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
    selectedGroup.value = allGroups.value.find((g) => g.groupId === groupId) || (row as GroupRow);
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
    const [usersRes, childrenRes, parentsRes, agentsRes] = await Promise.allSettled([
      userControlClient.getGroupUsers(groupId),
      userControlClient.getGroupChildGroups(groupId),
      userControlClient.getGroupParentGroups(groupId),
      userControlClient.getGroupAgents(groupId),
    ]);

    if (usersRes.status === "fulfilled") {
      const list = usersRes.value.usersList || [];
      groupUsers.value = list.map((u: { userid?: string; info?: Record<string, unknown> }) => {
        const info = (u.info ?? u) as Record<string, unknown>;
        return {
          name: String(info.name ?? ""),
          displayname: String(info.displayname ?? ""),
          samaccountname: String(info.samaccountname ?? ""),
          sid: String(info.sid ?? ""),
          description: String(info.description ?? ""),
        };
      });
    }
    if (childrenRes.status === "fulfilled") {
      const list = childrenRes.value.groupsList || [];
      groupChildren.value = list.map((item: { info?: Record<string, unknown> }) => toGroupRow(item.info ?? item));
    }
    if (parentsRes.status === "fulfilled") {
      const list = parentsRes.value.groupsList || [];
      groupParents.value = list.map((item: { info?: Record<string, unknown> }) => toGroupRow(item.info ?? item));
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
    $q.notify({ type: "positive", message: `Group "${selectedGroupSam.value}" deleted` });
    selectedGroupSam.value = null;
    selectedGroupId.value = null;
    selectedGroup.value = null;
    await loadGroups();
  } catch (err) {
    $q.notify({ type: "negative", message: err instanceof Error ? err.message : "Delete failed" });
  } finally {
    deleteLoading.value = false;
  }
}

function openCreateGroupDialog() {
  createGroupForm.value = { samGroupName: "", description: "" };
  showCreateGroup.value = true;
}

async function doCreateGroup() {
  const target = currentUserGroupTarget.value;
  if (!target) return;
  createGroupLoading.value = true;
  try {
    const res = await userControlClient.createGroup(
      target,
      createGroupForm.value.samGroupName.trim(),
      createGroupForm.value.description.trim() || undefined,
    );
    if (res.status === 0) {
      $q.notify({ type: "positive", message: `Group "${createGroupForm.value.samGroupName}" created` });
      showCreateGroup.value = false;
      await loadGroups();
    } else {
      $q.notify({ type: "negative", message: res.errorMessage || "Create failed" });
    }
  } catch (err) {
    $q.notify({ type: "negative", message: err instanceof Error ? err.message : "Create failed" });
  } finally {
    createGroupLoading.value = false;
  }
}

function openAddUserToGroupDialog() {
  addUserForm.value = { samAccountName: "" };
  showAddUser.value = true;
}

async function doAddUserToGroup() {
  const target = currentUserGroupTarget.value;
  if (!target || !selectedGroupSam.value) return;
  addUserLoading.value = true;
  try {
    const res = await userControlClient.addUserToGroup(
      target,
      selectedGroupSam.value,
      addUserForm.value.samAccountName.trim(),
    );
    if (res.status === 0) {
      $q.notify({ type: "positive", message: "User added to group" });
      showAddUser.value = false;
      if (selectedGroupId.value) loadGroupDetails(selectedGroupId.value);
    } else {
      $q.notify({ type: "negative", message: res.errorMessage || "Failed to add user" });
    }
  } catch (err) {
    $q.notify({ type: "negative", message: err instanceof Error ? err.message : "Failed to add user" });
  } finally {
    addUserLoading.value = false;
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
        $q.notify({ type: "negative", message: res.errorMessage || "Failed to remove user" });
      }
    } catch (err) {
      $q.notify({ type: "negative", message: err instanceof Error ? err.message : "Failed to remove user" });
    }
  });
}

</script>

<style scoped lang="sass">
.groups-manager-layout
  height: 100vh
  background: #fff

.groups-manager-page
  height: calc(100vh - 50px)

.groups-manager-body
  display: flex
  height: 100%
  overflow: hidden

.groups-left-panel
  width: 300px
  min-width: 240px
  max-width: 360px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0,0,0,.12)

.groups-left-header
  flex-shrink: 0

.groups-tree-scroll
  flex: 1 1 0
  height: 0

.groups-right-panel
  flex: 1
  display: flex
  flex-direction: column
  overflow: hidden

.groups-detail-header
  flex-shrink: 0

.groups-tab-panels
  flex: 1
  overflow: auto

.groups-tree
  .q-tree__node--selected > .q-tree__node-header
    background: rgba(25, 118, 210, .1)
    border-radius: 4px

.groups-tree-item
  padding: 1px 0

.groups-agent-select
  min-width: 220px
  max-width: 320px

.text-mono
  font-family: monospace

.target-badge
  padding: 6px 10px
</style>
