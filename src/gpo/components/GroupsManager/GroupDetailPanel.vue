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
          color="negative"
          icon="delete"
          label=""
          :loading="deleteLoading"
          @click="$emit('delete')"
        />
      </div>

      <q-separator />

      <div class="row q-gutter-sm q-px-lg q-py-md">
        <q-card flat bordered class="col-auto">
          <q-card-section class="q-pa-sm text-center" style="min-width: 120px">
            <div class="text-caption text-grey-6">SAM Name</div>
            <div class="text-body2 text-weight-medium">
              {{ group?.samaccountname || "—" }}
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="col-auto">
          <q-card-section class="q-pa-sm text-center" style="min-width: 120px">
            <div class="text-caption text-grey-6">SID</div>
            <div
              class="text-body2 text-weight-medium text-mono"
              style="font-size: 11px"
            >
              {{ group?.sid || "—" }}
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="col">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-6">Description</div>
            <div class="text-body2">
              {{ group?.description || "—" }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-separator />

      <q-tabs
        :model-value="detailTab"
        dense
        inline-label
        class="text-grey bg-grey-1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        no-caps
        @update:model-value="(v: string) => $emit('update:detailTab', v)"
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

      <q-tab-panels :model-value="detailTab" class="groups-tab-panels">
        <q-tab-panel name="members" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Group Members</div>
            <q-space />
            <q-btn
              flat
              dense
              color="primary"
              icon="person_add"
              label=""
              :disable="!selectedGroupSam"
              @click="$emit('add-user')"
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
                  @click="$emit('remove-user', cellProps.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="children" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Child Groups</div>
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
            :no-data-label="'No child groups'"
          >
            <template v-slot:body-cell-name="cellProps">
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
                  @click="$emit('navigate-to-group', cellProps.row)"
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
              label=""
              :disable="!selectedGroupId"
              title="Select a group first"
              @click="$emit('add-agent')"
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
            <q-item
              v-for="agent in groupAgents"
              :key="agent.id"
              class="row items-center cursor-pointer"
              clickable
              @click="$emit('open-agent-dashboard', agent.id)"
            >
              <q-item-section avatar>
                <q-icon name="laptop" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ agent.name }}</q-item-label>
                <q-item-label
                  v-if="agent.name !== agent.id"
                  caption
                  class="text-grey-6"
                >
                  {{ agent.id }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="remove_circle_outline"
                  size="sm"
                  color="negative"
                  :loading="removingAgentId === agent.id"
                  title="Remove agent"
                  @click.stop="$emit('remove-agent', agent.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="collections" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Policy collections for this group</div>
            <q-space />
            <q-btn
              flat
              dense
              color="secondary"
              icon="download"
              label=""
              :disable="!groupAppliedCollections.length"
              class="q-mr-sm"
            >
              <q-menu>
                <q-list dense style="min-width: 120px">
                  <q-item clickable v-close-popup @click="exportCollections('csv')">
                    <q-item-section avatar>
                      <q-icon name="table_chart" color="primary" />
                    </q-item-section>
                    <q-item-section>CSV</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="exportCollections('xlsx')">
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
                <q-table
                  :rows="groupAppliedCollections"
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
                          <q-icon name="visibility" size="xs" class="q-mr-xs" />
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
                          :assigned-and-applied="props.row.compliance.assignedAndApplied"
                          :assigned-not-applied="props.row.compliance.assignedNotApplied"
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
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this group so that its policies
                apply to all members. Use the button above to choose a
                collection. No collections applied yet.
              </div>
            </template>
          </div>
        </q-tab-panel>
      </q-tab-panels>
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
                    <div v-if="p.compliance?.loading" class="compliance-loading-mini">
                      <q-spinner size="xs" color="grey-6" />
                    </div>
                    <div v-else-if="p.compliance && p.compliance.totalAgents > 0" class="policy-compliance-wrapper">
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
                              <span>Applied: {{ p.compliance.appliedAgents }} agents</span>
                            </div>
                            <div v-if="p.compliance.pendingAgents > 0" class="tooltip-row">
                              <span class="tooltip-icon pending">⏳</span>
                              <span>Pending: {{ p.compliance.pendingAgents }} agents</span>
                            </div>
                            <div v-if="p.compliance.notAssignedAgents > 0" class="tooltip-row">
                              <span class="tooltip-icon error">✗</span>
                              <span>Not Assigned: {{ p.compliance.notAssignedAgents }} agents</span>
                            </div>
                          </div>
                        </q-tooltip>
                      </q-badge>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        {{ p.compliance.appliedAgents }}/{{ p.compliance.totalAgents }} agents
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
import { ref, computed } from "vue";
import ComplianceBar from "@/gpo/components/shared/ComplianceBar.vue";
import { exportPolicyCollections } from "@/utils/csv";
import {
  policyStateClient,
  createAgentTarget,
} from "@/gpo/api/grpc-client";

export interface GroupRow {
  name?: string;
  displayname?: string;
  distinguishedname?: string;
  samaccountname?: string;
  description?: string;
  sid?: string;
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

export interface AgentRow {
  id: string;
  name: string;
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

const showCollectionDetailsDialog = ref(false);
const selectedCollection = ref<AppliedCollection | null>(null);
const policySearchQuery = ref("");
const policiesWithCompliance = ref<PolicyWithCompliance[]>([]);
const policyComplianceCache = new Map<string, { appliedAgents: number; pendingAgents: number; notAssignedAgents: number; totalAgents: number; timestamp: number }>();
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
): Promise<{ appliedAgents: number; pendingAgents: number; notAssignedAgents: number; totalAgents: number }> {
  const totalAgents = agentsInGroup.length;

  if (totalAgents === 0) {
    return { appliedAgents: 0, pendingAgents: 0, notAssignedAgents: 0, totalAgents: 0 };
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

          const [assignmentsResponse, effectivePoliciesResponse] = await Promise.all([
            policyStateClient.getAssignments(target, "en-US").catch(() => ({ assignmentsList: [] })),
            policyStateClient.getEffectivePolicies(target, "en-US").catch(() => ({ policiesList: [] })),
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

    const complianceResult = { appliedAgents, pendingAgents, notAssignedAgents, totalAgents };
    policyComplianceCache.set(cacheKey, { ...complianceResult, timestamp: Date.now() });
    return complianceResult;
  } catch (err) {
    console.error("Error calculating policy compliance:", err);
    return { appliedAgents: 0, pendingAgents: 0, notAssignedAgents: 0, totalAgents };
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

function getPolicyStatusColor(compliance: PolicyWithCompliance["compliance"]): string {
  if (!compliance) return "grey";
  const { appliedAgents, pendingAgents, totalAgents } = compliance;

  if (appliedAgents === totalAgents) return "positive";
  if (appliedAgents > 0 || pendingAgents > 0) return "warning";
  return "negative";
}

function getPolicyStatusLabel(compliance: PolicyWithCompliance["compliance"]): string {
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

  if (!collection.policies || !props.selectedGroupId || !props.groupAgents.length) {
    policiesWithCompliance.value = collection.policies?.map(p => ({
      ...p,
      compliance: {
        appliedAgents: 0,
        pendingAgents: 0,
        notAssignedAgents: 0,
        totalAgents: 0,
        loading: false,
      }
    })) || [];
    return;
  }

  policiesWithCompliance.value = collection.policies.map(p => ({
    ...p,
    compliance: {
      appliedAgents: 0,
      pendingAgents: 0,
      notAssignedAgents: 0,
      totalAgents: props.groupAgents.length,
      loading: true,
    }
  }));

  await mapWithConcurrency(
    policiesWithCompliance.value,
    3,
    async (policy) => {
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
    },
  );
}

defineEmits<{
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

.groups-tab-panels
  flex: 1
  overflow: auto

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

.text-mono
  font-family: monospace
</style>
