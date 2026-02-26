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
            <q-btn
              flat
              dense
              color="primary"
              label="Retry"
              class="q-mt-sm"
              @click="loadGroups"
            />
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
                  <div class="col ellipsis text-body2">
                    {{ prop.node.label }}
                  </div>
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
            <div class="text-caption">
              {{
                groupSearch ? "No groups match the filter" : "No groups found"
              }}
            </div>
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
            <div class="text-caption q-mt-xs">
              Click on a group in the tree to see its details
            </div>
          </div>

          <template v-else>
            <div class="groups-detail-header q-px-lg q-py-md row items-center">
              <div>
                <div class="text-h6 text-weight-medium">
                  {{
                    selectedGroup?.displayname ||
                    selectedGroup?.name ||
                    selectedGroupSam
                  }}
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
                <q-card-section
                  class="q-pa-sm text-center"
                  style="min-width: 120px"
                >
                  <div class="text-caption text-grey-6">SAM Name</div>
                  <div class="text-body2 text-weight-medium">
                    {{ selectedGroup?.samaccountname || "—" }}
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col-auto">
                <q-card-section
                  class="q-pa-sm text-center"
                  style="min-width: 120px"
                >
                  <div class="text-caption text-grey-6">SID</div>
                  <div
                    class="text-body2 text-weight-medium text-mono"
                    style="font-size: 11px"
                  >
                    {{ selectedGroup?.sid || "—" }}
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey-6">Description</div>
                  <div class="text-body2">
                    {{ selectedGroup?.description || "—" }}
                  </div>
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
              <q-tab
                name="collections"
                icon="collections_bookmark"
                label="Policy collections"
              >
                <q-badge
                  v-if="groupAppliedCollectionsLoading"
                  color="grey"
                  label="..."
                  floating
                  rounded
                />
                <q-badge
                  v-else-if="groupAppliedCollections.length > 0"
                  color="primary"
                  :label="groupAppliedCollections.length"
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
                    flat
                    dense
                    color="primary"
                    icon="person_add"
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
                        flat
                        round
                        dense
                        icon="person_remove"
                        size="xs"
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
                        >{{ cellProps.value }}</span
                      >
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
                        >{{ cellProps.value }}</span
                      >
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="agents" class="q-pa-md">
                <div class="row items-center q-mb-md">
                  <div class="text-subtitle2">Agents linked to this group</div>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label="Add agent"
                    :disable="!selectedGroupId"
                    title="Select a group first"
                    @click="showAddAgentPanel = true"
                  />
                </div>
                <div v-if="detailLoading" class="text-center q-pa-md">
                  <q-spinner color="primary" />
                </div>
                <div
                  v-else-if="groupAgents.length === 0"
                  class="text-grey-6 text-caption"
                >
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

              <q-tab-panel name="collections" class="q-pa-md">
                <div class="row items-center q-mb-md">
                  <div class="text-subtitle2">
                    Policy collections for this group
                  </div>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label="Apply collection"
                    :disable="!selectedGroupId"
                    @click="showApplyCollectionDialog = true"
                  />
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="remove_circle_outline"
                    label="Remove collection"
                    :disable="!canRemoveGroupCollection"
                    title="Remove an applied collection from this group"
                    @click="showRemoveCollectionDialog = true"
                  />
                </div>
                <div class="collections-tab-scroll">
                  <div
                    v-if="!selectedGroupId"
                    class="text-grey-6 text-caption"
                  >
                    Select a group to apply policy collections.
                  </div>
                  <template v-else>
                    <div
                      v-if="groupAppliedCollectionsLoading"
                      class="column items-center q-py-lg"
                    >
                      <q-spinner color="primary" size="2em" />
                      <div class="text-caption text-grey-7 q-mt-sm">
                        Loading applied collections...
                      </div>
                    </div>
                    <template v-else-if="groupAppliedCollections.length">
                      <div class="text-caption text-grey-7 q-mb-sm">
                        Applied collections:
                      </div>
                      <div class="applied-collections-list">
                        <div
                          v-for="c in groupAppliedCollections"
                          :key="c.id"
                          class="applied-collection-block"
                        >
                          <div class="text-weight-medium">
                            {{ c.name || c.id }}
                          </div>
                          <div
                            v-if="c.explainText"
                            class="text-caption text-grey-7 q-mt-xs"
                          >
                            {{ c.explainText }}
                          </div>
                          <template v-if="c.policies?.length">
                            <div class="text-caption text-grey-7 q-mt-sm">
                              Policies in collection:
                            </div>
                            <ul
                              class="q-pl-md q-mt-xs q-mb-none text-caption text-grey-8"
                            >
                              <li
                                v-for="p in c.policies"
                                :key="p.id"
                                class="q-py-xs"
                              >
                                {{ p.name }}
                              </li>
                            </ul>
                          </template>
                        </div>
                      </div>
                    </template>
                    <div v-else class="text-body2 text-grey-7">
                      Apply a policy collection to this group so that its
                      policies apply to all members. Use the button above to
                      choose a collection. No collections applied yet.
                    </div>
                  </template>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </div>
      </div>
    </div>

    <q-dialog v-model="showCreateGroup">
      <q-card style="min-width: 360px; margin-bottom: 250px">
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
          <q-select
            v-model="createGroupForm.parentId"
            :options="parentGroupOptions"
            option-value="groupId"
            option-label="label"
            emit-value
            map-options
            label="Parent Group"
            outlined
            dense
            clearable
            class="q-mb-sm"
            :disable="parentGroupOptions.length === 0"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >No groups available</q-item-section
                >
              </q-item>
            </template>
          </q-select>
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

    <q-dialog v-model="showAddUser" position="top">
      <q-card style="min-width: 360px; margin-top: 60px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add User to Group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Group: <strong>{{ selectedGroupSam }}</strong>
          </div>
          <q-select
            v-model="addUserForm.samAccountName"
            :options="addUserOptions"
            option-value="samAccountName"
            option-label="label"
            emit-value
            map-options
            label="User *"
            outlined
            dense
            use-input
            input-debounce="200"
            :loading="addUserOptionsLoading"
            :disable="addUserOptionsLoading"
            clearable
            menu-anchor="bottom left"
            menu-self="top left"
            popup-content-style="max-height: 220px; overflow-y: auto;"
            @filter="filterAddUserOptions"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{
                    addUserOptionsLoading
                      ? "Loading..."
                      : addUserOptions.length === 0
                        ? "No users available"
                        : "No match"
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
            label="Add"
            :loading="addUserLoading"
            :disable="!addUserForm.samAccountName"
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
          <div class="text-h6">Apply collection to group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Group: <strong>{{ selectedGroupSam }}</strong>
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
            @click="confirmApplyCollectionToGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showRemoveCollectionDialog"
      position="standard"
      @show="prepareRemoveCollectionOptionsForGroup"
    >
      <q-card class="apply-collection-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Remove collection from group</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Group: <strong>{{ selectedGroupSam }}</strong>
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
            @click="confirmRemoveCollectionFromGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <TargetSelectionDialog
      v-model="showTargetPanel"
      @select="handleTargetSelect"
    />

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      agents-only
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
  userControlClient,
  createGlobalTarget,
  policyAssignmentClient,
  collectionsClient,
} from "@/gpo/api/grpc-client";
import type { Target } from "@/gpo/api/grpc-client";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";
import { notifyError, notifySuccess } from "@/utils/notify";

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

const deleteLoading = ref(false);

const showCreateGroup = ref(false);
const createGroupLoading = ref(false);
const createGroupForm = ref<{
  samGroupName: string;
  description: string;
  parentId: string | null;
}>({
  samGroupName: "",
  description: "",
  parentId: null,
});

const parentGroupOptions = computed(() =>
  allGroups.value.map((g) => ({
    groupId: g.groupId,
    label: g.displayname || g.samaccountname || g.groupId,
  })),
);

const showAddUser = ref(false);
const addUserLoading = ref(false);
const addUserForm = ref({ samAccountName: "" });
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

const usersColumns = [
  {
    name: "displayname",
    label: "Display Name",
    field: "displayname",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "samaccountname",
    label: "SAM Name",
    field: "samaccountname",
    align: "left" as const,
    sortable: true,
  },
  { name: "sid", label: "SID", field: "sid", align: "left" as const },
  {
    name: "actions",
    label: "",
    field: "actions",
    align: "center" as const,
    style: "width: 48px",
  },
];

const groupsSubColumns = [
  {
    name: "name",
    label: "Name",
    field: (r: GroupRow) => r.displayname || r.name || r.samaccountname,
    align: "left" as const,
    sortable: true,
  },
  {
    name: "samaccountname",
    label: "SAM Name",
    field: "samaccountname",
    align: "left" as const,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
  },
];

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
      notifySuccess("Agent linked to group");
      await loadGroupDetails(groupId);
    } else {
      notifyError(res.errorMessage ?? "Failed to link agent to group");
    }
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to link agent to group",
    );
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
  createGroupForm.value = {
    samGroupName: "",
    description: "",
    parentId: selectedGroupId.value ?? null,
  };
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
      createGroupForm.value.parentId || undefined,
    );
    if (res.status === 0) {
      $q.notify({
        type: "positive",
        message: `Group "${createGroupForm.value.samGroupName}" created`,
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

const addUserOptionsFilter = ref("");
const addUserOptionsAll = ref<
  { id: string; label: string; samAccountName: string }[]
>([]);

function filterAddUserOptions(val: string, update: (cb: () => void) => void) {
  addUserOptionsFilter.value = val ?? "";
  update(() => {
    if (!val || !val.trim()) {
      addUserOptions.value = [...addUserOptionsAll.value];
    } else {
      const lower = val.toLowerCase();
      addUserOptions.value = addUserOptionsAll.value.filter(
        (o) =>
          o.label.toLowerCase().includes(lower) ||
          o.samAccountName.toLowerCase().includes(lower),
      );
    }
  });
}

async function openAddUserToGroupDialog() {
  addUserForm.value = { samAccountName: "" };
  addUserOptions.value = [];
  addUserOptionsAll.value = [];
  addUserOptionsFilter.value = "";
  showAddUser.value = true;
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
    addUserOptionsAll.value = options;
    addUserOptions.value = options;
  } catch {
    addUserOptions.value = [];
  } finally {
    addUserOptionsLoading.value = false;
  }
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

function confirmApplyCollectionToGroup() {
  const collectionId = applyCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    applyCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Apply collections",
    message: `Do you really want to apply the collection«${collectionLabel}»?`,
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

function confirmRemoveCollectionFromGroup() {
  const collectionId = removeCollectionSelectedId.value;
  if (collectionId == null) return;
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

.collections-tab-scroll
  max-height: 50vh
  overflow-y: auto

.applied-collections-list
  display: flex
  flex-direction: column
  gap: 12px

.applied-collection-block
  padding: 12px
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px
  background: rgba(0, 0, 0, 0.02)

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
