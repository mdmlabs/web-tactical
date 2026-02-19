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
                :disable="!currentUserGroupTarget"
                @click="loadGroups"
              />
              <!-- <q-btn
                flat
                dense
                round
                icon="gps_fixed"
                color="grey-7"
                title="Change target"
                @click="showTargetPanel = true"
              /> -->
            </div>

            <q-separator />

            <div class="q-px-md q-py-sm">
              <q-input
                v-model="groupSearch"
                dense
                outlined
                placeholder="Filter..."
                clearable
                :input-style="{ paddingLeft: '6px' }"
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="xs" />
                </template>
              </q-input>
            </div>

            <div
              v-if="!currentUserGroupTarget"
              class="column items-center justify-center q-pa-xl text-grey-6"
            >
              <q-icon name="gps_fixed" size="2rem" class="q-mb-sm" />
              <div class="text-caption text-center">Select target to view groups</div>
              <q-btn
                flat
                dense
                color="primary"
                label="Select target"
                class="q-mt-sm"
                @click="showTargetPanel = true"
              />
            </div>

            <div
              v-else-if="groupsLoading"
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
                :selected="selectedGroupSam"
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

    <q-dialog v-model="showTargetPanel" position="standard" @show="onTargetDialogShow">
      <q-card class="target-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Select target</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey-7 q-mb-sm">
            Choose one node for a single target, or tick several for a combined target (clients + sites + agents).
          </div>
          <div v-if="targetTreeLoading" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="2em" />
          </div>
          <q-scroll-area
            v-else-if="targetTreeNodes.length > 0"
            style="height: min(400px, 55vh)"
            class="rounded-borders"
          >
            <q-tree
              v-model:selected="targetSelectedId"
              v-model:ticked="targetTickedIds"
              :nodes="targetTreeNodes"
              node-key="id"
              tick-strategy="strict"
              selected-color="primary"
              class="target-tree"
            >
              <template v-slot:default-header="prop">
                <div class="row items-center full-width">
                  <q-icon
                    :name="getTargetNodeIcon(prop.node)"
                    class="q-mr-sm"
                    size="sm"
                  />
                  <span>{{ prop.node.label }}</span>
                </div>
              </template>
            </q-tree>
          </q-scroll-area>
          <div v-else class="text-grey-7 text-body2 q-pa-md">
            No clients/sites loaded. Check connection.
          </div>
          <div v-if="targetTickedIds.length > 0" class="q-mt-sm text-caption text-grey-7">
            Combined: {{ targetTickedIds.length }} item(s) selected
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="OK"
            :disable="!canApplyTarget"
            @click="applyTargetSelection"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { fetchClients } from "@/api/clients";
import { fetchAgents } from "@/api/agents";
import {
  userControlClient,
  createUserGroupTargetFromParams,
} from "@/gpo/api/grpc-client";
import type { UserGroupTarget } from "@/generated/user_service_pb";
import type { GroupInfo } from "@/generated/common/user_pb";

interface TargetTreeNode {
  id: string;
  label: string;
  children?: TargetTreeNode[];
  targetType?: "client" | "site" | "agent";
  clientId?: string;
  siteId?: string;
  agentId?: string;
}

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

defineEmits<{ close: [] }>();
const $q = useQuasar();

const showTargetPanel = ref(false);
const targetTreeNodes = ref<TargetTreeNode[]>([]);
const targetTreeLoading = ref(false);
const targetSelectedId = ref<string | null>(null);
const targetTickedIds = ref<string[]>([]);
const currentTargetRef = ref<{ target: UserGroupTarget; label: string } | null>(null);

const allGroups = ref<GroupRow[]>([]);
const groupsLoading = ref(false);
const groupsError = ref<string | null>(null);
const groupSearch = ref("");

const selectedGroupSam = ref<string | null>(null);
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


function extractOU(dn: string): string {
  const parts = dn.split(",");
  const ouParts = parts.filter((p) => p.trim().toUpperCase().startsWith("OU="));
  if (ouParts.length === 0) return "Default";
  return ouParts.map((p) => p.split("=")[1]).reverse().join(" / ");
}

const groupTree = computed<TreeNode[]>(() => {
  const categories: Record<string, TreeNode> = {};

  for (const g of allGroups.value) {
    const ou = g.distinguishedname ? extractOU(g.distinguishedname) : "Default";
    if (!categories[ou]) {
      categories[ou] = {
        id: `cat:${ou}`,
        label: ou,
        isCategory: true,
        children: [],
      };
    }
    categories[ou].children!.push({
      id: g.samaccountname || g.sid || g.name || "",
      label: g.displayname || g.name || g.samaccountname || "—",
      isCategory: false,
      samAccountName: g.samaccountname || "",
    });
  }

  return Object.values(categories).sort((a, b) => a.label.localeCompare(b.label));
});

const filteredGroupTree = computed<TreeNode[]>(() => {
  const q = groupSearch.value.trim().toLowerCase();
  if (!q) return groupTree.value;

  const result: TreeNode[] = [];
  for (const cat of groupTree.value) {
    const matched = (cat.children || []).filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        (n.samAccountName || "").toLowerCase().includes(q),
    );
    if (matched.length > 0) {
      result.push({ ...cat, children: matched });
    }
  }
  return result;
});

const currentUserGroupTarget = computed(() => currentTargetRef.value?.target ?? null);
const targetLabel = computed(() => currentTargetRef.value?.label ?? "");

function findTargetNodeById(
  nodes: TargetTreeNode[],
  id: string,
): TargetTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const found = findTargetNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getTargetNodeIcon(node: TargetTreeNode): string {
  if (node.targetType === "client") return "business";
  if (node.targetType === "site") return "location_on";
  if (node.targetType === "agent") return "computer";
  return "folder";
}

async function loadTargetTree() {
  targetTreeLoading.value = true;
  targetTreeNodes.value = [];
  try {
    const [clientsData, agentsData] = await Promise.all([
      fetchClients(),
      fetchAgents({ detail: false }).catch(() => null),
    ]);
    const clients = Array.isArray(clientsData) ? clientsData : [];
    const rawAgents = agentsData ?? [];
    let agents: Array<Record<string, unknown>> = [];
    if (Array.isArray(rawAgents)) {
      agents = rawAgents as Array<Record<string, unknown>>;
    } else if (Array.isArray((rawAgents as { results?: unknown[] }).results)) {
      agents = (rawAgents as { results: Array<Record<string, unknown>> })
        .results;
    }
    const agentsBySite = new Map<
      string,
      Array<{ agent_id: string; hostname: string }>
    >();
    for (const a of agents) {
      const clientName = a.client ?? a.client_name;
      const siteName = a.site ?? a.site_name;
      const key = `${String(clientName)}::${String(siteName)}`;
      if (!agentsBySite.has(key)) agentsBySite.set(key, []);
      agentsBySite.get(key)!.push({
        agent_id: String(a.agent_id ?? a.id ?? ""),
        hostname: String(a.hostname ?? "—"),
      });
    }
    const nodes: TargetTreeNode[] = clients.map(
      (client: { id: number; name: string; sites?: Array<{ id: number; name: string }> }) => {
        const clientId = String(client.id);
        const sites = client.sites ?? [];
        const siteNodes: TargetTreeNode[] = sites.map(
          (site: { id: number; name: string }) => {
            const siteId = String(site.id);
            const siteKey = `${client.name}::${site.name}`;
            const siteAgents = agentsBySite.get(siteKey) ?? [];
            const agentNodes: TargetTreeNode[] = siteAgents.map((ag) => ({
              id: `agent-${ag.agent_id}`,
              label: ag.hostname,
              targetType: "agent" as const,
              clientId,
              siteId,
              agentId: ag.agent_id,
              children: [],
            }));
            return {
              id: `site-${siteId}`,
              label: site.name + (siteAgents.length ? ` (${siteAgents.length})` : ""),
              targetType: "site" as const,
              clientId,
              siteId,
              children: agentNodes.length > 0 ? agentNodes : undefined,
            };
          },
        );
        return {
          id: `client-${clientId}`,
          label: client.name,
          targetType: "client" as const,
          clientId,
          children: siteNodes.length > 0 ? siteNodes : undefined,
        };
      },
    );
    targetTreeNodes.value = nodes;
  } catch (e) {
    console.error("Load target tree failed:", e);
  } finally {
    targetTreeLoading.value = false;
  }
}

function onTargetDialogShow() {
  targetSelectedId.value = null;
  targetTickedIds.value = [];
  loadTargetTree();
}

const canApplyTarget = computed(() => {
  if (targetTickedIds.value.length > 0) return true;
  return targetSelectedId.value != null;
});

function buildTargetFromSingleNode(): { target: UserGroupTarget; label: string } | null {
  const id = targetSelectedId.value;
  if (!id) return null;
  const node = findTargetNodeById(targetTreeNodes.value, id);
  if (!node || !node.targetType) return null;
  let target: UserGroupTarget;
  let label: string;
  if (node.targetType === "client" && node.clientId) {
    target = createUserGroupTargetFromParams("client", { clientId: node.clientId });
    label = `Client: ${node.label}`;
  } else if (node.targetType === "site" && node.siteId) {
    target = createUserGroupTargetFromParams("site", { siteId: node.siteId });
    label = `Site: ${node.label}`;
  } else if (node.targetType === "agent" && node.agentId) {
    target = createUserGroupTargetFromParams("agent", { agentId: node.agentId });
    label = `Agent: ${node.label}`;
  } else {
    return null;
  }
  return { target, label };
}

function buildCombinedTargetFromTicked(): { target: UserGroupTarget; label: string } | null {
  const ids = targetTickedIds.value;
  if (ids.length === 0) return null;
  const clientIds: string[] = [];
  const siteIds: string[] = [];
  const agentIds: string[] = [];
  const labels: string[] = [];
  for (const id of ids) {
    const node = findTargetNodeById(targetTreeNodes.value, id);
    if (!node || !node.targetType) continue;
    if (node.targetType === "client" && node.clientId) {
      clientIds.push(node.clientId);
      labels.push(node.label);
    } else if (node.targetType === "site" && node.siteId) {
      siteIds.push(node.siteId);
      labels.push(node.label);
    } else if (node.targetType === "agent" && node.agentId) {
      agentIds.push(node.agentId);
      labels.push(node.label);
    }
  }
  if (clientIds.length === 0 && siteIds.length === 0 && agentIds.length === 0) {
    return null;
  }
  const target = createUserGroupTargetFromParams("combined", {
    clientIds,
    siteIds,
    agentIds,
  });
  return {
    target,
    label: labels.length ? `Combined: ${labels.join(", ")}` : "Combined",
  };
}

function applyTargetSelection() {
  const combined = buildCombinedTargetFromTicked();
  if (combined) {
    currentTargetRef.value = combined;
    showTargetPanel.value = false;
    onTargetChange();
    return;
  }
  const single = buildTargetFromSingleNode();
  if (single) {
    currentTargetRef.value = single;
    showTargetPanel.value = false;
    onTargetChange();
  }
}

function onTargetChange() {
  selectedGroupSam.value = null;
  selectedGroup.value = null;
  allGroups.value = [];
  groupUsers.value = [];
  groupChildren.value = [];
  groupParents.value = [];
  groupAgents.value = [];
  if (currentUserGroupTarget.value) loadGroups();
}


async function loadGroups() {
  const target = currentUserGroupTarget.value;
  if (!target) return;
  groupsLoading.value = true;
  groupsError.value = null;
  try {
    const res = await userControlClient.getAllGroups(target);
    allGroups.value = (res.groupsList || []).map((g: GroupInfo.AsObject) => ({
      name: g.name || "",
      displayname: g.displayname || "",
      distinguishedname: g.distinguishedname || "",
      samaccountname: g.samaccountname || "",
      description: g.description || "",
      sid: g.sid || "",
    }));
  } catch (err) {
    groupsError.value = err instanceof Error ? err.message : "Failed to load groups";
  } finally {
    groupsLoading.value = false;
  }
}

function selectGroup(nodeId: string | null) {
  if (!nodeId) return;
  const flat = allGroups.value;
  const found = flat.find((g) => g.samaccountname === nodeId || g.sid === nodeId || g.name === nodeId);
  if (!found) return;

  selectedGroupSam.value = found.samaccountname || nodeId;
  selectedGroup.value = found;
  detailTab.value = "members";
  loadGroupDetails(selectedGroupSam.value);
}

function navigateToGroup(row: GroupRow) {
  if (row.samaccountname) {
    selectedGroupSam.value = row.samaccountname;
    selectedGroup.value = allGroups.value.find((g) => g.samaccountname === row.samaccountname) || row;
    loadGroupDetails(row.samaccountname);
  }
}

async function loadGroupDetails(samGroupName: string) {
  const target = currentUserGroupTarget.value;
  if (!target) return;
  detailLoading.value = true;
  groupUsers.value = [];
  groupChildren.value = [];
  groupParents.value = [];
  groupAgents.value = [];

  const toGroupRow = (g: GroupInfo.AsObject): GroupRow => ({
    name: g.name || "",
    displayname: g.displayname || "",
    distinguishedname: g.distinguishedname || "",
    samaccountname: g.samaccountname || "",
    description: g.description || "",
    sid: g.sid || "",
  });

  try {
    const [usersRes, childrenRes, parentsRes, agentsRes] = await Promise.allSettled([
      userControlClient.getGroupUsers(target, samGroupName),
      userControlClient.getGroupChildGroups(target, samGroupName),
      userControlClient.getGroupParentGroups(target, samGroupName),
      userControlClient.getGroupAgents(target, samGroupName),
    ]);

    if (usersRes.status === "fulfilled") {
      groupUsers.value = (usersRes.value.usersList || []).map((u) => ({
        name: u.name || "",
        displayname: u.displayname || "",
        samaccountname: u.samaccountname || "",
        sid: u.sid || "",
        description: u.description || "",
      }));
    }
    if (childrenRes.status === "fulfilled") {
      groupChildren.value = (childrenRes.value.groupsList || []).map(toGroupRow);
    }
    if (parentsRes.status === "fulfilled") {
      groupParents.value = (parentsRes.value.groupsList || []).map(toGroupRow);
    }
    if (agentsRes.status === "fulfilled") {
      groupAgents.value = agentsRes.value.agentIdsList || [];
    }
  } finally {
    detailLoading.value = false;
  }
}

watch(detailTab, () => {
  if (selectedGroupSam.value) {
    loadGroupDetails(selectedGroupSam.value);
  }
});

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
      loadGroupDetails(selectedGroupSam.value);
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
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "User removed from group" });
        loadGroupDetails(selectedGroupSam.value!);
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

.target-dialog-card
  min-width: 400px
  max-width: 90vw

.target-tree
  :deep(.q-tree__node-header)
    border-radius: 4px
</style>
