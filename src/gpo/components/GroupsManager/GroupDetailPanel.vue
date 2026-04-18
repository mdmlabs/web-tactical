<template>
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
            {{ group?.displayname || group?.name || selectedGroupSam }}
          </div>
          <div class="text-caption text-grey-6">
            {{ group?.distinguishedname || selectedGroupSam }}
          </div>
        </div>
        <q-space />
        <q-btn
          flat
          dense
          color="primary"
          icon="edit"
          label=""
          title="Edit group"
          @click="$emit('edit')"
        />
        <q-btn
          flat
          dense
          color="negative"
          icon="delete"
          label=""
          :loading="deleteLoading"
          @click="$emit('delete')"
        />
      </div>

      <q-separator />

      <div class="groups-detail-main">
        <div v-if="detailLoading" class="flex flex-center q-pa-xl groups-detail-summary">
          <q-spinner color="primary" size="2em" />
        </div>
        <div v-else class="groups-detail-summary q-px-lg q-py-md">
          <div class="row q-col-gutter-md summary-row">
            <div class="col-12 col-md-6 summary-col">
              <div class="system-info-summary summary-card">
                <div class="text-caption text-grey-7 q-mb-xs">Group</div>
                <q-scroll-area class="summary-scroll">
                  <div class="system-info-kv">
                    <div class="system-info-k">SAM name</div>
                    <div class="system-info-v">
                      {{ group?.samaccountname || "—" }}
                    </div>
                  </div>
                  <div class="system-info-kv">
                    <div class="system-info-k">SID</div>
                    <div class="system-info-v text-mono" style="font-size: 11px">
                      {{ group?.sid || "—" }}
                    </div>
                  </div>
                  <div class="system-info-kv">
                    <div class="system-info-k">Description</div>
                    <div class="system-info-v">
                      {{ group?.description || "—" }}
                    </div>
                  </div>
                  <div class="system-info-kv">
                    <div class="system-info-k">Distinguished name</div>
                    <div class="system-info-v">
                      {{ group?.distinguishedname || "—" }}
                    </div>
                  </div>
                  <div class="system-info-kv">
                    <div class="system-info-k">Users (in group / max)</div>
                    <div class="system-info-v">
                      {{ usersQuotaLine }}
                    </div>
                  </div>
                  <div class="system-info-kv">
                    <div class="system-info-k">Agents (linked / max)</div>
                    <div class="system-info-v">
                      {{ agentsQuotaLine }}
                    </div>
                  </div>
                </q-scroll-area>
              </div>
            </div>
            <div class="col-12 col-md-6 summary-col">
              <div
                class="system-info-summary summary-card summary-card--members"
              >
                <div class="row items-center q-mb-sm flex-shrink-0">
                  <div class="text-caption text-grey-7">Members</div>
                  <q-badge
                    v-if="groupUsers.length"
                    class="q-ml-xs"
                    color="primary"
                    :label="groupUsers.length"
                    rounded
                  />
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="person_add"
                    label=""
                    size="sm"
                    :disable="!selectedGroupSam"
                    @click="$emit('add-user')"
                  />
                </div>
                <q-input
                  v-model="membersSearch"
                  dense
                  outlined
                  clearable
                  placeholder="Search members..."
                  class="q-mb-sm flex-shrink-0 summary-members-search"
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <div class="summary-members-body">
                  <q-table
                    :rows="filteredGroupUsersForCard"
                    :columns="usersColumns"
                    row-key="samaccountname"
                    flat
                    dense
                    bordered
                    class="summary-members-table"
                    :rows-per-page-options="[15, 30, 50, 0]"
                    :pagination="membersTabPagination"
                    :no-data-label="membersTableNoDataLabel"
                  >
                    <template #body-cell-actions="cellProps">
                      <q-td :props="cellProps">
                        <q-btn
                          flat
                          round
                          dense
                          icon="person_remove"
                          size="xs"
                          color="negative"
                          title="Remove from group"
                          @click="$emit('remove-user', cellProps.row)"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator class="groups-detail-sep" />

        <div class="groups-detail-tabs-wrap q-pt-sm">
          <q-tabs
            :model-value="detailTab"
            dense
            inline-label
            class="text-grey gpo-detail-tabs groups-detail-tabs"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
            @update:model-value="(v: string) => $emit('update:detailTab', v)"
          >
            <q-tab name="children" icon="account_tree" label="Child groups">
              <q-badge
                v-if="groupChildren.length"
                color="primary"
                :label="groupChildren.length"
                floating
                rounded
              />
            </q-tab>
            <q-tab name="parents" icon="call_merge" label="Parent groups">
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
            <q-tab name="alerts" icon="warning" label="Alerts" />
            <q-tab name="connectivity" icon="network_check" label="Connectivity" />
          </q-tabs>
        </div>

        <q-separator class="groups-detail-sep" />

        <q-tab-panels :model-value="detailTab" class="groups-tab-panels">
        <q-tab-panel name="children" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Child groups</div>
            <q-space />
            <q-btn
              color="primary"
              icon="add_circle_outline"
              label=""
              size="sm"
              outline
              dense
              @click="$emit('manage-child-groups')"
            />
          </div>
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
            :pagination="relationPaginationChildren"
            :no-data-label="'No child groups'"
          >
            <template #body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-group', cellProps.row)"
                  >{{ cellProps.value }}</span
                >
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="parents" class="q-pa-md">
          <div class="text-subtitle2 q-mb-md">Parent groups</div>
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
            :pagination="relationPaginationParents"
            :no-data-label="'No parent groups'"
          >
            <template #body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-group', cellProps.row)"
                  >{{ cellProps.value }}</span
                >
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="agents" class="q-pa-md">
          <UserAgentsTab
            no-target-hint="Select a group first"
            :agents="groupAgents"
            :loading="detailLoading"
            :has-target="!!selectedGroupId"
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
                v-if="!groupAppliedCollectionsLoading"
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
                :disable="!groupAppliedCollections.length"
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
                :disable="!selectedGroupId"
                @click="$emit('apply-collection')"
              />
            </div>
          </div>

          <div class="collections-tab-scroll">
            <div v-if="!selectedGroupId" class="text-grey-6 text-caption">
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
                <template v-if="viewMode === 'collections'">
                  <div
                    v-if="filteredGroupAppliedCollections.length === 0"
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
                    :rows="filteredGroupAppliedCollections"
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
                        <q-item-section>{{ group.policyName }}</q-item-section>
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
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this group so that its policies
                apply to all members. Use the button above to choose a
                collection. No collections applied yet.
              </div>
            </template>
          </div>
        </q-tab-panel>

        <q-tab-panel name="alerts" class="q-pa-md">
          <AgentAlertsTab
            v-if="selectedGroupId"
            :group-id="selectedGroupId"
            :active="detailTab === 'alerts'"
          />
          <div v-else class="text-grey-6 text-body2">
            Group identifier is not available for alerts.
          </div>
        </q-tab-panel>

        <q-tab-panel name="connectivity" class="q-pa-md">
          <ConnectivityPoliciesTab
            v-if="connectivityGroupTarget"
            :key="`conn-group-${selectedGroupId}`"
            compact
            :fixed-target="connectivityGroupTarget"
          />
          <div v-else class="text-grey-6 text-body2">
            Group identifier is not available for connectivity policies.
          </div>
        </q-tab-panel>
      </q-tab-panels>
      </div>
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
              v-else-if="policySearchQuery"
              class="text-center text-grey-6 q-pa-md"
            >
              <q-icon name="search_off" size="md" class="q-mb-sm" />
              <div>No policies found matching "{{ policySearchQuery }}"</div>
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
import { ref, computed, watch } from "vue";
import type { ConnectivityPolicyTarget } from "@/gpo/api/connectivity-policy";
import AgentAlertsTab from "@/gpo/components/AgentAlertsTab.vue";
import ConnectivityPoliciesTab from "@/gpo/components/ConnectivityPolicy/ConnectivityPoliciesTab.vue";
import ComplianceBar from "@/gpo/components/shared/ComplianceBar.vue";
import UserAgentsTab from "@/gpo/components/UsersManager/UserAgentsTab.vue";
import type { AgentRow } from "@/gpo/composables/useUserActions";
import { exportPolicyCollections } from "@/utils/csv";
import { policyStateClient, createAgentTarget } from "@/gpo/api/grpc-client";

export interface GroupRow {
  name?: string;
  displayname?: string;
  distinguishedname?: string;
  samaccountname?: string;
  description?: string;
  sid?: string;
  maxUsers?: number;
  maxAgents?: number;
}

export interface AppliedCollection {
  id: number;
  name: string;
  explainText?: string;
  policies?: { id: number; name: string }[];
}

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

const membersTabPagination = ref({ page: 1, rowsPerPage: 15 });
const relationPaginationChildren = ref({ page: 1, rowsPerPage: 15 });
const relationPaginationParents = ref({ page: 1, rowsPerPage: 15 });

const showCollectionDetailsDialog = ref(false);
const selectedCollection = ref<AppliedCollection | null>(null);
const policySearchQuery = ref("");
const policiesWithCompliance = ref<PolicyWithCompliance[]>([]);

type ViewMode = "collections" | "policies";
const viewMode = ref<ViewMode>("collections");
const tabPolicySearchQuery = ref("");

const policiesGrouped = computed(() => {
  const map = new Map<
    string,
    { policyName: string; collections: AppliedCollection[] }
  >();
  for (const col of props.groupAppliedCollections) {
    for (const policy of col.policies ?? []) {
      if (!map.has(policy.name)) {
        map.set(policy.name, { policyName: policy.name, collections: [] });
      }
      map.get(policy.name)!.collections.push(col);
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

const filteredGroupAppliedCollections = computed(() => {
  const list = props.groupAppliedCollections ?? [];
  const q = (tabPolicySearchQuery.value ?? "").toLowerCase().trim();
  if (!q) return list;
  return list.filter((row) =>
    (row.name ?? "").toLowerCase().includes(q),
  );
});

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

const props = defineProps<{
  selectedGroupSam: string | null;
  selectedGroupId: string | null;
  group: GroupRow | null;
  detailTab: string;
  detailLoading: boolean;
  deleteLoading: boolean;
  groupUsers: GroupRow[];
  groupChildren: GroupRow[];
  groupParents: GroupRow[];
  groupAgents: AgentRow[];
  removingAgentId?: string | null;
  groupAppliedCollections: AppliedCollection[];
  groupAppliedCollectionsLoading: boolean;
  canRemoveCollection: boolean;
}>();

const membersSearch = ref("");

const filteredGroupUsersForCard = computed(() => {
  const list = props.groupUsers ?? [];
  const q = (membersSearch.value ?? "").trim().toLowerCase();
  if (!q) return list;
  return list.filter((u: GroupRow) => {
    const display = (u.displayname ?? "").toLowerCase();
    const sam = (u.samaccountname ?? "").toLowerCase();
    const sid = (u.sid ?? "").toLowerCase();
    const desc = (u.description ?? "").toLowerCase();
    return (
      display.includes(q) ||
      sam.includes(q) ||
      sid.includes(q) ||
      desc.includes(q)
    );
  });
});

const membersTableNoDataLabel = computed(() => {
  if ((props.groupUsers?.length ?? 0) === 0) {
    return "No members in this group";
  }
  if (filteredGroupUsersForCard.value.length === 0) {
    return "No matching members";
  }
  return "No members in this group";
});

watch(
  () => props.selectedGroupSam,
  () => {
    membersSearch.value = "";
  },
);

watch(membersSearch, () => {
  membersTabPagination.value = {
    ...membersTabPagination.value,
    page: 1,
  };
});

function formatCountVsLimit(
  count: number,
  max: number | undefined | null,
): string {
  const c = Number.isFinite(count) ? count : 0;
  if (max === undefined || max === null || Number.isNaN(Number(max))) {
    return String(c);
  }
  return `${c} / ${max}`;
}

const usersQuotaLine = computed(() =>
  formatCountVsLimit(props.groupUsers?.length ?? 0, props.group?.maxUsers),
);

const agentsQuotaLine = computed(() =>
  formatCountVsLimit(props.groupAgents?.length ?? 0, props.group?.maxAgents),
);

const connectivityGroupTarget = computed<ConnectivityPolicyTarget | null>(() =>
  props.selectedGroupId
    ? { type: "userGroup", userGroupId: props.selectedGroupId }
    : null,
);

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
  groupId: string,
  policyId: number,
  agentsInGroup: AgentRow[],
): Promise<{
  appliedAgents: number;
  pendingAgents: number;
  notAssignedAgents: number;
  totalAgents: number;
}> {
  const totalAgents = agentsInGroup.length;

  if (totalAgents === 0) {
    return {
      appliedAgents: 0,
      pendingAgents: 0,
      notAssignedAgents: 0,
      totalAgents: 0,
    };
  }

  const cacheKey = `${groupId}_${policyId}_${totalAgents}`;
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
      agentsInGroup,
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

const filteredPolicies = computed(() => {
  if (!policiesWithCompliance.value.length) return [];
  if (!policySearchQuery.value) return policiesWithCompliance.value;

  const query = policySearchQuery.value.toLowerCase();
  return policiesWithCompliance.value.filter((p) =>
    p.name.toLowerCase().includes(query),
  );
});

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

async function openCollectionDetailsDialog(collection: AppliedCollection) {
  selectedCollection.value = collection;
  policySearchQuery.value = "";
  showCollectionDetailsDialog.value = true;

  if (
    !collection.policies ||
    !props.selectedGroupId ||
    !props.groupAgents.length
  ) {
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
      totalAgents: props.groupAgents.length,
      loading: true,
    },
  }));

  await mapWithConcurrency(policiesWithCompliance.value, 3, async (policy) => {
    try {
      const result = await calculatePolicyCompliance(
        props.selectedGroupId!,
        policy.id,
        props.groupAgents,
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

defineEmits<{
  edit: [];
  delete: [];
  "update:detailTab": [value: string];
  "add-user": [];
  "remove-user": [user: GroupRow];
  "navigate-to-group": [row: GroupRow];
  "add-agent": [];
  "remove-agent": [agentId: string];
  "apply-collection": [];
  "remove-collection": [];
  "remove-collection-by-id": [collectionId: number];
  "open-agent-dashboard": [agentId: string];
  "manage-child-groups": [];
}>();

function exportCollections(format: "csv" | "xlsx") {
  exportPolicyCollections(props.groupAppliedCollections, format);
}
</script>

<style scoped lang="sass">
.groups-right-panel
  flex: 1
  display: flex
  flex-direction: column
  overflow: hidden

.groups-detail-header
  flex-shrink: 0

.groups-detail-main
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.groups-detail-summary
  flex-shrink: 0

.groups-detail-sep
  flex-shrink: 0

.groups-detail-tabs-wrap
  flex-shrink: 0
  padding-left: 24px
  padding-right: 24px
  padding-bottom: 4px
  background-color: rgba(0, 0, 0, 0.04)

.body--dark .groups-detail-tabs-wrap
  background-color: rgba(255, 255, 255, 0.07)

.groups-detail-tabs
  background-color: transparent

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

.summary-card--members
  min-height: 0

.summary-members-search
  min-width: 0

.summary-members-body
  flex: 1 1 0
  min-height: 0
  min-width: 0
  overflow: auto
  -webkit-overflow-scrolling: touch

.summary-members-table
  :deep(.q-table__bottom)
    padding: 4px 8px
  :deep(.q-table thead th)
    font-size: 12px
  :deep(.q-table tbody td)
    font-size: 12px

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

.system-info-summary
  background: rgba(16, 137, 211, 0.02)
  border: 1px solid rgba(18, 177, 209, 0.18)
  border-radius: 10px
  padding: 8px 12px

.body--dark .system-info-summary
  background: rgba(18, 177, 209, 0.06)
  border: 1px solid rgba(18, 177, 209, 0.28)

.groups-tab-panels
  flex: 1 1 0%
  min-height: 0
  overflow: hidden
  display: flex
  flex-direction: column

  :deep(.q-panel)
    flex: 1 1 0%
    min-height: 0
    overflow: auto

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
