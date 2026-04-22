<template>
  <div class="users-right-panel">
    <div
      v-if="!selectedId"
      class="column items-center justify-center full-height text-grey-6"
    >
      <q-icon name="person" size="3rem" class="q-mb-sm" />
      <div class="text-h6">Select a user</div>
      <div class="text-caption q-mt-xs">
        Click on a user in the list or create a new one
      </div>
    </div>

    <template v-else>
      <div class="users-detail-header q-px-sm q-py-sm row items-center">
        <q-space />
        <div v-if="user" class="row items-center no-wrap q-gutter-x-xs q-mr-sm">
          <q-icon
            :name="user.info?.isenabled !== false ? 'check_circle' : 'block'"
            :color="user.info?.isenabled !== false ? 'positive' : 'negative'"
            size="18px"
          >
            <q-tooltip>
              {{ user.info?.isenabled !== false ? "Enabled" : "Disabled" }}
            </q-tooltip>
          </q-icon>
          <q-icon
            :name="user.info?.passwordexpired ? 'warning' : 'check_circle'"
            :color="user.info?.passwordexpired ? 'orange' : 'grey'"
            size="18px"
          >
            <q-tooltip>
              {{
                user.info?.passwordexpired
                  ? "Password expired"
                  : "Password not expired"
              }}
            </q-tooltip>
          </q-icon>
        </div>
        <q-btn
          flat
          round
          dense
          icon="more_vert"
          color="primary"
          :loading="actionLoading"
          :disable="!hasTarget"
          :title="!hasTarget ? 'Select target first' : ''"
        >
          <q-menu>
            <q-list dense style="min-width: 200px">
              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('update')"
              >
                <q-item-section avatar>
                  <q-icon name="edit" color="primary" />
                </q-item-section>
                <q-item-section>Update</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('toggle-enable')"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="
                      user?.info?.isenabled !== false ? 'block' : 'check_circle'
                    "
                    :color="
                      user?.info?.isenabled !== false ? 'orange' : 'positive'
                    "
                  />
                </q-item-section>
                <q-item-section>
                  {{ user?.info?.isenabled !== false ? "Disable" : "Enable" }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('set-password')"
              >
                <q-item-section avatar>
                  <q-icon name="lock" />
                </q-item-section>
                <q-item-section>Set Password</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('unlock')"
              >
                <q-item-section avatar>
                  <q-icon name="lock_open" />
                </q-item-section>
                <q-item-section>Unlock</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('expire-password')"
              >
                <q-item-section avatar>
                  <q-icon name="password" />
                </q-item-section>
                <q-item-section>Expire Password</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('set-expiration')"
              >
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>
                <q-item-section>Account Expiration</q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('delete')"
              >
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="2em" />
      </div>

      <template v-else-if="user">
        <div class="users-detail-main">
          <div class="users-detail-summary q-px-sm q-py-sm">
            <div class="row q-col-gutter-sm summary-row">
              <div class="col-12 col-md-6 summary-col">
                <div class="system-info-summary summary-card">
                  <div class="text-caption text-grey-7 q-mb-xs">User</div>
                  <q-scroll-area class="summary-scroll">
                    <UserInfoTab
                      :user="user"
                      :agents-count="agents.length"
                      :applied-collections-count="appliedCollections.length"
                    />
                  </q-scroll-area>
                </div>
              </div>
              <div class="col-12 col-md-6 summary-col">
                <div class="system-info-summary summary-card">
                  <div class="row items-center q-mb-sm">
                    <div class="text-caption text-grey-7">Groups</div>
                    <q-space />
                    <q-btn
                      flat
                      dense
                      color="primary"
                      icon="group_add"
                      label=""
                      :disable="!hasTarget"
                      :title="
                        !hasTarget
                          ? 'Select target first (click badge in header)'
                          : ''
                      "
                      @click="$emit('add-to-group')"
                    />
                  </div>
                  <q-input
                    v-model="groupsSearch"
                    dense
                    outlined
                    clearable
                    placeholder="Search groups..."
                    class="q-mb-sm"
                    :disable="groupsLoading"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-scroll-area class="summary-scroll">
                    <UserGroupsTab
                      compact
                      scroll-in-parent
                      :groups="filteredGroupsForCard"
                      :loading="groupsLoading"
                      :has-target="hasTarget"
                      :searchable="false"
                      @add-to-group="$emit('add-to-group')"
                    />
                  </q-scroll-area>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="users-detail-sep" />

          <div class="users-detail-tabs-wrap q-pt-sm">
            <q-tabs
              :model-value="detailTab"
              dense
              inline-label
              class="text-grey gpo-detail-tabs users-detail-tabs"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
              no-caps
              @update:model-value="$emit('update:detailTab', $event)"
            >
              <q-tab name="agents" icon="dns" label="Agents">
                <q-badge
                  v-if="agents.length"
                  color="primary"
                  :label="agents.length"
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
                  v-if="appliedCollectionsLoading"
                  color="grey"
                  label="..."
                  floating
                  rounded
                />
                <q-badge
                  v-else-if="(appliedCollections?.length ?? 0) > 0"
                  color="primary"
                  :label="appliedCollections?.length ?? 0"
                  floating
                  rounded
                />
              </q-tab>
              <q-tab name="alerts" icon="warning" label="Alerts" />
              <q-tab
                name="connectivity"
                icon="network_check"
                label="Connectivity"
              />
            </q-tabs>
          </div>

          <q-separator class="users-detail-sep" />

          <q-scroll-area class="users-tab-scroll">
            <q-tab-panels :model-value="detailTab" class="users-tab-panels">
            <q-tab-panel name="agents" class="q-pa-md">
              <UserAgentsTab
                :agents="agents"
                :loading="agentsLoading"
                :has-target="hasTarget"
                :removing-agent-id="removingAgentId"
                @add-agent="$emit('add-agent')"
                @remove-agent="$emit('remove-agent', $event)"
                @open-agent-dashboard="$emit('open-agent-dashboard', $event)"
              />
            </q-tab-panel>
            <q-tab-panel name="collections" class="q-pa-md">
              <div class="q-mb-md">
                <div class="row items-center no-wrap q-gutter-x-sm">
                  <div
                    class="policy-collections-toolbar-group row items-center no-wrap"
                  >
                    <q-btn-toggle
                      v-model="viewMode"
                      dense
                      flat
                      no-caps
                      :options="[
                        {
                          value: 'collections',
                          icon: 'list_alt',
                          tooltip: 'Collections view',
                        },
                        {
                          value: 'policies',
                          icon: 'policy',
                          tooltip: 'Policy view',
                        },
                      ]"
                      toggle-color="primary"
                      color="grey-6"
                    />
                  </div>
                  <q-input
                    v-if="!appliedCollectionsLoading"
                    v-model="tabPolicySearchQuery"
                    dense
                    outlined
                    :placeholder="
                      viewMode === 'collections'
                        ? 'Search by collection...'
                        : 'Search by policy...'
                    "
                    clearable
                    class="col policy-collections-toolbar-search"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="secondary"
                    icon="download"
                    label=""
                    :disable="!appliedCollections.length"
                  >
                    <q-menu>
                      <q-list dense style="min-width: 120px">
                        <q-item
                          clickable
                          v-close-popup
                          @click="exportCollections('csv')"
                        >
                          <q-item-section avatar>
                            <q-icon name="table_chart" color="primary" />
                          </q-item-section>
                          <q-item-section>CSV</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="exportCollections('xlsx')"
                        >
                          <q-item-section avatar>
                            <q-icon name="description" color="green" />
                          </q-item-section>
                          <q-item-section>XLSX</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label=""
                    :disable="!canApplyCollection"
                    :title="
                      canApplyCollection
                        ? ''
                        : 'Select a single agent as target in the header'
                    "
                    @click="$emit('add-collection')"
                  />
                </div>
              </div>

              <div class="collections-tab-scroll">
                <div
                  v-if="appliedCollectionsLoading"
                  class="column items-center q-py-lg"
                >
                  <q-spinner color="primary" size="2em" />
                  <div class="text-caption text-grey-7 q-mt-sm">
                    Loading applied collections...
                  </div>
                </div>
                <template v-else-if="appliedCollections.length">
                  <template v-if="viewMode === 'collections'">
                    <div
                      v-if="filteredAppliedCollections.length === 0"
                      class="text-center text-grey-6 q-pa-md"
                    >
                      <q-icon name="search_off" size="md" class="q-mb-sm" />
                      <div>
                        No collections matching "{{
                          tabPolicySearchQuery ?? ""
                        }}"
                      </div>
                    </div>
                    <q-table
                      v-else
                      :rows="filteredAppliedCollections"
                      :columns="collectionsColumns"
                      row-key="id"
                      flat
                      bordered
                      :rows-per-page-options="[0]"
                      hide-pagination
                      class="collections-table"
                    >
                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td key="name" :props="props">
                            <div
                              class="cursor-pointer text-primary row items-center no-wrap"
                              @click="openCollectionDetailsDialog(props.row)"
                            >
                              <q-icon
                                name="visibility"
                                size="xs"
                                class="q-mr-xs"
                              />
                              <span class="text-weight-medium">{{
                                props.row.name || props.row.id
                              }}</span>
                            </div>
                          </q-td>
                          <q-td key="explainText" :props="props">
                            <div class="text-caption text-grey-7">
                              {{ props.row.explainText || "—" }}
                            </div>
                          </q-td>
                          <q-td key="policiesCount" :props="props">
                            <q-badge
                              v-if="props.row.policies?.length"
                              color="primary"
                              :label="props.row.policies.length"
                            />
                            <span v-else class="text-grey-5">0</span>
                          </q-td>
                          <q-td key="compliance" :props="props">
                            <ComplianceBar
                              v-if="props.row.compliance"
                              :assigned-and-applied="
                                props.row.compliance.assignedAndApplied
                              "
                              :assigned-not-applied="
                                props.row.compliance.assignedNotApplied
                              "
                              :not-assigned="props.row.compliance.notAssigned"
                              :loading="props.row.compliance.loading"
                            />
                            <span v-else class="text-grey-5">—</span>
                          </q-td>
                          <q-td key="actions" :props="props">
                            <q-btn
                              flat
                              round
                              dense
                              icon="delete"
                              color="negative"
                              size="sm"
                              :title="`Remove collection ${props.row.name || props.row.id}`"
                              @click="
                                $emit('remove-collection-by-id', props.row.id)
                              "
                            />
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </template>

                  <template v-else>
                    <div
                      v-if="policiesGrouped.length === 0"
                      class="text-center text-grey-6 q-pa-md"
                    >
                      <q-icon name="search_off" size="md" class="q-mb-sm" />
                      <div>
                        No policies found matching "{{
                          tabPolicySearchQuery ?? ""
                        }}"
                      </div>
                    </div>
                    <q-list v-else bordered separator class="rounded-borders">
                      <q-expansion-item
                        v-for="group in policiesGrouped"
                        :key="group.policyName"
                        expand-separator
                      >
                        <template v-slot:header>
                          <q-item-section avatar>
                            <q-icon name="policy" color="primary" />
                          </q-item-section>
                          <q-item-section>{{
                            group.policyName
                          }}</q-item-section>
                          <q-item-section side>
                            <q-badge
                              color="primary"
                              :label="group.collections.length"
                              :title="`In ${group.collections.length} collection(s)`"
                            />
                          </q-item-section>
                        </template>

                        <q-list separator class="q-ml-lg">
                          <q-item
                            v-for="col in group.collections"
                            :key="col.id"
                            dense
                            class="cursor-pointer"
                            @click="openCollectionDetailsDialog(col)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                name="collections_bookmark"
                                size="xs"
                                color="secondary"
                              />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label
                                class="text-primary text-weight-medium"
                              >
                                {{ col.name || col.id }}
                              </q-item-label>
                              <q-item-label
                                v-if="col.explainText"
                                caption
                                class="text-grey-6"
                              >
                                {{ col.explainText }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-expansion-item>
                    </q-list>
                  </template>
                </template>
                <div
                  v-else-if="!canApplyCollection"
                  class="text-grey-6 text-caption"
                >
                  Select a single agent as target (click the badge in the
                  header) to apply policy collections to this user.
                </div>
                <div v-else class="text-body2 text-grey-7">
                  Apply a policy collection to this user on the selected agent.
                  Use the button above to choose a collection. No collections
                  applied yet.
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="alerts" class="q-pa-md">
              <AgentAlertsTab
                v-if="alertsUserId"
                :user-id="alertsUserId"
                :active="detailTab === 'alerts'"
              />
              <div v-else class="text-grey-6 text-body2">
                User identifier is not available for alerts.
              </div>
            </q-tab-panel>
            <q-tab-panel name="connectivity" class="q-pa-md">
              <ConnectivityPoliciesTab
                v-if="connectivityUserTarget"
                :key="`conn-user-${alertsUserId}`"
                compact
                :fixed-target="connectivityUserTarget"
              />
              <div v-else class="text-grey-6 text-body2">
                User identifier is not available for connectivity policies.
              </div>
            </q-tab-panel>
            </q-tab-panels>
          </q-scroll-area>
        </div>
      </template>
    </template>

    <q-dialog v-model="showCollectionDetailsDialog" position="standard">
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-sm">
          <q-icon
            name="collections_bookmark"
            color="primary"
            size="sm"
            class="q-mr-sm"
          />
          <div class="text-h6">
            {{ selectedCollection?.name || selectedCollection?.id }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section
          v-if="selectedCollection?.explainText"
          class="q-pt-sm q-pb-sm"
        >
          <div class="text-caption text-grey-7">
            {{ selectedCollection.explainText }}
          </div>
        </q-card-section>

        <q-separator v-if="selectedCollection?.explainText" />

        <q-card-section class="q-pt-sm">
          <div class="row items-center q-mb-sm">
            <q-space />
            <q-input
              v-model="policySearchQuery"
              dense
              outlined
              placeholder="Search policies..."
              style="max-width: 250px"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="policies-list-container">
            <template v-if="filteredPolicies.length">
              <q-list bordered separator class="rounded-borders">
                <q-item
                  v-for="(p, index) in filteredPolicies"
                  :key="p.id"
                  class="policy-item"
                >
                  <q-item-section avatar>
                    <div class="text-caption text-grey-6">{{ index + 1 }}</div>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="policy" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ p.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side class="policy-compliance-section">
                    <div
                      v-if="p.compliance?.loading"
                      class="compliance-loading-mini"
                    >
                      <q-spinner size="xs" color="grey-6" />
                    </div>
                    <div
                      v-else-if="p.compliance && p.compliance.totalAgents > 0"
                      class="policy-compliance-wrapper"
                    >
                      <q-badge
                        :color="getPolicyStatusColor(p.compliance)"
                        :label="getPolicyStatusLabel(p.compliance)"
                        class="q-mb-xs"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[0, 8]"
                        >
                          <div class="policy-compliance-tooltip">
                            <div class="tooltip-row">
                              <span class="tooltip-icon success">✓</span>
                              <span
                                >Applied:
                                {{ p.compliance.appliedAgents }} agents</span
                              >
                            </div>
                            <div
                              v-if="p.compliance.pendingAgents > 0"
                              class="tooltip-row"
                            >
                              <span class="tooltip-icon pending">⏳</span>
                              <span
                                >Pending:
                                {{ p.compliance.pendingAgents }} agents</span
                              >
                            </div>
                            <div
                              v-if="p.compliance.notAssignedAgents > 0"
                              class="tooltip-row"
                            >
                              <span class="tooltip-icon error">✗</span>
                              <span
                                >Not Assigned:
                                {{ p.compliance.notAssignedAgents }}
                                agents</span
                              >
                            </div>
                          </div>
                        </q-tooltip>
                      </q-badge>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        {{ p.compliance.appliedAgents }}/{{
                          p.compliance.totalAgents
                        }}
                        agents
                      </div>
                    </div>
                    <div v-else class="text-caption text-grey-5">—</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
            <div
              v-else-if="(policySearchQuery ?? '').trim()"
              class="text-center text-grey-6 q-pa-md"
            >
              <q-icon name="search_off" size="md" class="q-mb-sm" />
              <div>
                No policies found matching "{{ policySearchQuery ?? "" }}"
              </div>
            </div>
            <div v-else class="text-center text-grey-6 q-pa-md">
              <q-icon name="info" size="md" class="q-mb-sm" />
              <div>No policies in this collection</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { UserWithIdInfo } from "@/generated/user_service_pb";
import type { GroupRow, AgentRow } from "@/gpo/composables/useUserActions";
import { exportPolicyCollections } from "@/utils/csv";
import { policyStateClient, createAgentTarget } from "@/gpo/api/grpc-client";
import ComplianceBar from "@/gpo/components/shared/ComplianceBar.vue";
import type { ConnectivityPolicyTarget } from "@/gpo/api/connectivity-policy";
import AgentAlertsTab from "@/gpo/components/AgentAlertsTab.vue";
import ConnectivityPoliciesTab from "@/gpo/components/ConnectivityPolicy/ConnectivityPoliciesTab.vue";
import UserInfoTab from "./UserInfoTab.vue";
import UserGroupsTab from "./UserGroupsTab.vue";
import UserAgentsTab from "./UserAgentsTab.vue";

const props = withDefaults(
  defineProps<{
    selectedId: string | null;
    user: UserWithIdInfo.AsObject | null;
    loading: boolean;
    hasTarget: boolean;
    actionLoading: boolean;
    detailTab: string;
    groups: GroupRow[];
    groupsLoading: boolean;
    agents: AgentRow[];
    agentsLoading: boolean;
    removingAgentId?: string | null;
    appliedCollections?: {
      id: number;
      name: string;
      explainText?: string;
      policies?: { id: number; name: string }[];
    }[];
    appliedCollectionsLoading?: boolean;
    canApplyCollection: boolean;
    canRemoveCollection: boolean;
  }>(),
  {
    appliedCollections: () => [],
    appliedCollectionsLoading: false,
    canRemoveCollection: false,
  },
);

const alertsUserId = computed(() => {
  const id = props.user?.userid || props.selectedId;
  return id && id !== "" ? id : null;
});

const groupsSearch = ref("");
const filteredGroupsForCard = computed(() => {
  const q = (groupsSearch.value ?? "").trim().toLowerCase();
  if (!q) return props.groups;
  return (props.groups ?? []).filter((g) => {
    const name = String(g.displayname || g.name || "").toLowerCase();
    const sam = String(g.samaccountname || "").toLowerCase();
    const desc = String(g.description || "").toLowerCase();
    return name.includes(q) || sam.includes(q) || desc.includes(q);
  });
});

const connectivityUserTarget = computed<ConnectivityPolicyTarget | null>(() =>
  alertsUserId.value ? { type: "user", userId: alertsUserId.value } : null,
);

defineEmits<{
  update: [];
  delete: [];
  "toggle-enable": [];
  "set-password": [];
  unlock: [];
  "expire-password": [];
  "set-expiration": [];
  "add-to-group": [];
  "add-agent": [];
  "remove-agent": [agentId: string];
  "add-collection": [];
  "remove-collection": [];
  "remove-collection-by-id": [collectionId: number];
  "update:detailTab": [value: string];
  "open-agent-dashboard": [agentId: string];
}>();

const collectionsColumns = [
  {
    name: "name",
    label: "Collection Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "explainText",
    label: "Description",
    field: "explainText",
    align: "left" as const,
    sortable: false,
  },
  {
    name: "policiesCount",
    label: "Policies",
    field: (row: { policies?: unknown[] }) => row.policies?.length || 0,
    align: "center" as const,
    sortable: true,
  },
  {
    name: "compliance",
    label: "Compliance",
    field: "compliance",
    align: "left" as const,
    sortable: false,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
    sortable: false,
  },
];

type CollectionType = {
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
};

type ViewMode = "collections" | "policies";
const viewMode = ref<ViewMode>("collections");
const tabPolicySearchQuery = ref("");

const policiesGrouped = computed(() => {
  const map = new Map<
    string,
    { policyName: string; collections: CollectionType[] }
  >();
  for (const col of props.appliedCollections) {
    for (const policy of col.policies ?? []) {
      if (!map.has(policy.name)) {
        map.set(policy.name, { policyName: policy.name, collections: [] });
      }
      map.get(policy.name)!.collections.push(col as CollectionType);
    }
  }

  const query = (tabPolicySearchQuery.value ?? "").toLowerCase().trim();
  let result = [...map.values()];
  if (query) {
    result = result.filter((p) => p.policyName.toLowerCase().includes(query));
  }
  result.sort((a, b) => b.collections.length - a.collections.length);
  return result;
});

const filteredAppliedCollections = computed(() => {
  const list = props.appliedCollections ?? [];
  const q = (tabPolicySearchQuery.value ?? "").toLowerCase().trim();
  if (!q) return list;
  return list.filter((row) => (row.name ?? "").toLowerCase().includes(q));
});

interface PolicyWithCompliance {
  id: number;
  name: string;
  compliance?: {
    appliedAgents: number;
    pendingAgents: number;
    notAssignedAgents: number;
    totalAgents: number;
    loading: boolean;
  };
}

const showCollectionDetailsDialog = ref(false);
const selectedCollection = ref<CollectionType | null>(null);
const policySearchQuery = ref("");
const policiesWithCompliance = ref<PolicyWithCompliance[]>([]);
const policyComplianceCache = new Map<
  string,
  {
    appliedAgents: number;
    pendingAgents: number;
    notAssignedAgents: number;
    totalAgents: number;
    timestamp: number;
  }
>();
const POLICY_COMPLIANCE_CACHE_TTL = 5 * 60 * 1000;

const filteredPolicies = computed(() => {
  if (!policiesWithCompliance.value.length) return [];
  const query = (policySearchQuery.value ?? "").toLowerCase().trim();
  if (!query) return policiesWithCompliance.value;

  return policiesWithCompliance.value.filter((p) =>
    p.name.toLowerCase().includes(query),
  );
});

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

async function calculatePolicyCompliance(
  userId: string,
  policyId: number,
  agentsForUser: AgentRow[],
): Promise<{
  appliedAgents: number;
  pendingAgents: number;
  notAssignedAgents: number;
  totalAgents: number;
}> {
  const totalAgents = agentsForUser.length;

  if (totalAgents === 0) {
    return {
      appliedAgents: 0,
      pendingAgents: 0,
      notAssignedAgents: 0,
      totalAgents: 0,
    };
  }

  const cacheKey = `${userId}_${policyId}_${totalAgents}`;
  const cached = policyComplianceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < POLICY_COMPLIANCE_CACHE_TTL) {
    return {
      appliedAgents: cached.appliedAgents,
      pendingAgents: cached.pendingAgents,
      notAssignedAgents: cached.notAssignedAgents,
      totalAgents: cached.totalAgents,
    };
  }

  try {
    const results = await mapWithConcurrency(
      agentsForUser,
      3,
      async (agent: AgentRow) => {
        try {
          const target = createAgentTarget(agent.id);
          if (!target) {
            return { isAssigned: false, isApplied: false };
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

          const policyIdStr = String(policyId);
          const policyHashVariant = `policy_${policyIdStr}`;

          const isAssigned = (assignmentsResponse.assignmentsList || []).some(
            (a) =>
              a.summary?.id === policyId ||
              String(a.summary?.id) === policyIdStr ||
              a.policyHash === policyHashVariant,
          );

          const isApplied = (effectivePoliciesResponse.policiesList || []).some(
            (p) =>
              p.summary?.id === policyId ||
              String(p.summary?.id) === policyIdStr ||
              p.policyHash === policyHashVariant,
          );

          return { isAssigned, isApplied };
        } catch {
          return { isAssigned: false, isApplied: false };
        }
      },
    );

    let appliedAgents = 0;
    let pendingAgents = 0;
    let notAssignedAgents = 0;

    for (const result of results) {
      if (result.isAssigned && result.isApplied) {
        appliedAgents++;
      } else if (result.isAssigned && !result.isApplied) {
        pendingAgents++;
      } else {
        notAssignedAgents++;
      }
    }

    const complianceResult = {
      appliedAgents,
      pendingAgents,
      notAssignedAgents,
      totalAgents,
    };
    policyComplianceCache.set(cacheKey, {
      ...complianceResult,
      timestamp: Date.now(),
    });
    return complianceResult;
  } catch (err) {
    console.error("Error calculating policy compliance:", err);
    return {
      appliedAgents: 0,
      pendingAgents: 0,
      notAssignedAgents: 0,
      totalAgents,
    };
  }
}

function getPolicyStatusColor(
  compliance: PolicyWithCompliance["compliance"],
): string {
  if (!compliance) return "grey";
  const { appliedAgents, pendingAgents, totalAgents } = compliance;

  if (appliedAgents === totalAgents) return "positive";
  if (appliedAgents > 0 || pendingAgents > 0) return "warning";
  return "negative";
}

function getPolicyStatusLabel(
  compliance: PolicyWithCompliance["compliance"],
): string {
  if (!compliance) return "Unknown";
  const { appliedAgents, pendingAgents, totalAgents } = compliance;

  if (appliedAgents === totalAgents) return "Applied";
  if (appliedAgents > 0 || pendingAgents > 0) return "Pending";
  return "Not Applied";
}

async function openCollectionDetailsDialog(collection: CollectionType) {
  selectedCollection.value = collection;
  policySearchQuery.value = "";
  showCollectionDetailsDialog.value = true;

  if (!collection.policies || !props.selectedId || !props.agents.length) {
    policiesWithCompliance.value =
      collection.policies?.map((p) => ({
        ...p,
        compliance: {
          appliedAgents: 0,
          pendingAgents: 0,
          notAssignedAgents: 0,
          totalAgents: 0,
          loading: false,
        },
      })) || [];
    return;
  }

  policiesWithCompliance.value = collection.policies.map((p) => ({
    ...p,
    compliance: {
      appliedAgents: 0,
      pendingAgents: 0,
      notAssignedAgents: 0,
      totalAgents: props.agents.length,
      loading: true,
    },
  }));

  await mapWithConcurrency(policiesWithCompliance.value, 3, async (policy) => {
    try {
      const result = await calculatePolicyCompliance(
        props.selectedId!,
        policy.id,
        props.agents,
      );
      policy.compliance = {
        appliedAgents: result.appliedAgents,
        pendingAgents: result.pendingAgents,
        notAssignedAgents: result.notAssignedAgents,
        totalAgents: result.totalAgents,
        loading: false,
      };
    } catch {
      if (policy.compliance) {
        policy.compliance.loading = false;
      }
    }
  });
}

function exportCollections(format: "csv" | "xlsx") {
  exportPolicyCollections(props.appliedCollections, format);
}
</script>

<style scoped lang="sass">
.users-right-panel
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.users-detail-header
  flex-shrink: 0

.users-detail-main
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.users-detail-summary
  flex-shrink: 0

.users-detail-sep
  flex-shrink: 0

.users-tab-scroll
  flex: 1 1 0%
  min-height: 0

.users-tab-panels
  flex: 1 1 0%
  min-height: 0
  overflow-y: auto
  overflow-x: hidden
  display: flex
  flex-direction: column

  :deep(.q-panel),
  :deep(.q-panel > div)
    height: auto
    min-height: 0

.users-detail-tabs-wrap
  flex-shrink: 0
  padding-left: 24px
  padding-right: 24px
  padding-bottom: 4px
  background-color: rgba(0, 0, 0, 0.04)

.body--dark .users-detail-tabs-wrap
  background-color: rgba(255, 255, 255, 0.07)

.users-detail-tabs
  background-color: transparent

.system-info-summary
  background: rgba(16, 137, 211, 0.02)
  border: 1px solid rgba(18, 177, 209, 0.18)
  border-radius: 10px
  padding: 8px 12px

.body--dark .system-info-summary
  background: rgba(18, 177, 209, 0.06)
  border: 1px solid rgba(18, 177, 209, 0.28)

.system-info-kv
  display: flex
  gap: 10px
  padding: 6px 0

.system-info-kv + .system-info-kv
  border-top: 1px dashed rgba(18, 177, 209, 0.18)

.system-info-k
  min-width: 120px
  color: rgba(0, 0, 0, 0.55)
  font-size: 12px
  line-height: 16px

.body--dark .system-info-k
  color: rgba(255, 255, 255, 0.65)

.system-info-v
  flex: 1
  min-width: 0
  color: rgba(0, 0, 0, 0.88)
  font-size: 13px
  line-height: 18px
  word-break: break-word

.body--dark .system-info-v
  color: rgba(255, 255, 255, 0.88)

.summary-row
  align-items: stretch

.summary-col
  display: flex

.summary-card
  width: 100%
  height: clamp(200px, 35vh, 360px)
  display: flex
  flex-direction: column
  overflow: hidden

.summary-scroll
  flex: 1
  min-height: 0

.policy-collections-toolbar-search
  min-width: 0
  max-width: 420px

.policy-collections-toolbar-group
  padding: 3px 6px
  border-radius: 8px
  background: rgba(0, 0, 0, 0.04)
  border: 1px solid rgba(0, 0, 0, 0.08)

.body--dark .policy-collections-toolbar-group
  background: rgba(255, 255, 255, 0.06)
  border-color: rgba(255, 255, 255, 0.1)

.collections-tab-scroll
  max-height: 50vh
  overflow-y: auto

.collections-table
  :deep(.q-table__top)
    padding: 0

  :deep(.q-table tbody td)
    font-size: 13px

  :deep(.q-table thead th)
    font-weight: 600

.policies-list-container
  max-height: 60vh
  overflow-y: auto
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px

.policy-item
  transition: background-color 0.2s

  &:hover
    background-color: rgba(0, 0, 0, 0.02)

.policy-compliance-section
  min-width: 150px
  max-width: 150px

.policy-compliance-wrapper
  display: flex
  flex-direction: column
  align-items: flex-end
  gap: 4px

.compliance-loading-mini
  display: flex
  align-items: center
  justify-content: flex-end

.policy-compliance-tooltip
  padding: 8px
  font-size: 12px

.tooltip-row
  display: flex
  align-items: center
  gap: 8px
  padding: 4px 0

.tooltip-icon
  font-size: 14px

  &.success
    color: #4caf50

  &.pending
    color: #ff9800

  &.error
    color: #f44336

.body--dark .policies-list-container
  border-color: rgba(255, 255, 255, 0.12)

.body--dark .policy-item:hover
  background-color: rgba(255, 255, 255, 0.06)

.text-mono
  font-family: monospace
</style>
