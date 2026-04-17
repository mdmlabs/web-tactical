<template>
  <div class="groups-right-panel">
    <div
      v-if="selectedCategoryId == null"
      class="column items-center justify-center full-height text-grey-6"
    >
      <q-icon name="devices" size="3rem" class="q-mb-md" />
      <div class="text-h6">Select a category</div>
      <div class="text-caption q-mt-xs">
        Click on a category in the tree to see its details
      </div>
    </div>

    <template v-else>
      <div class="groups-detail-header q-px-lg q-py-md row items-center">
        <div>
          <div class="text-h6 text-weight-medium">
            {{ selectedCategory?.name ?? "—" }}
          </div>
          <div
            v-if="selectedCategory?.description"
            class="text-caption text-grey-6"
          >
            {{ selectedCategory.description }}
          </div>
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="more_vert"
          color="primary"
          :loading="actionLoading"
        >
          <q-menu>
            <q-list dense style="min-width: 200px">
              <q-item clickable v-close-popup @click="$emit('edit')">
                <q-item-section avatar>
                  <q-icon name="edit" color="primary" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="$emit('move')">
                <q-item-section avatar>
                  <q-icon name="drive_file_move" color="secondary" />
                </q-item-section>
                <q-item-section>Move to</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="$emit('delete')">
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative"
                  >Delete Category</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <q-separator />

      <q-tabs
        :model-value="detailTab"
        dense
        inline-label
        class="text-grey gpo-detail-tabs"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        no-caps
        @update:model-value="$emit('update:detailTab', String($event))"
      >
        <q-tab name="agents" icon="dns" label="Agents">
          <q-badge
            v-if="(categoryAgents?.length ?? 0) > 0"
            color="primary"
            :label="categoryAgents.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="children" icon="account_tree" label="Child Categories">
          <q-badge
            v-if="(categoryChildren?.length ?? 0) > 0"
            color="primary"
            :label="categoryChildren.length"
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
            v-if="categoryAppliedCollectionsLoading"
            color="grey"
            label="..."
            floating
            rounded
          />
          <q-badge
            v-else-if="(categoryAppliedCollections?.length ?? 0) > 0"
            color="primary"
            :label="categoryAppliedCollections.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="alerts" icon="warning" label="Alerts" />
        <q-tab name="connectivity" icon="network_check" label="Connectivity" />
      </q-tabs>

      <q-separator />

      <q-tab-panels :model-value="detailTab" class="groups-tab-panels">
        <q-tab-panel name="agents" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Agents in this category</div>
            <q-space />
            <q-btn
              flat
              dense
              color="secondary"
              icon="open_in_new"
              label=""
              :disable="selectedCategoryId == null"
              title="Replace the entire list of agents"
              class="q-mr-sm"
              @click="$emit('set-agents')"
            />
            <q-btn
              flat
              dense
              color="primary"
              icon="add_circle_outline"
              label=""
              :disable="selectedCategoryId == null"
              title="Select a category first"
              @click="$emit('add-agent')"
            />
          </div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <div
            v-else-if="(categoryAgents?.length ?? 0) === 0"
            class="text-grey-6 text-caption"
          >
            No agents in this category
          </div>
          <q-list v-else bordered separator>
            <q-item
              v-for="agent in categoryAgents"
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
                  size="xs"
                  color="negative"
                  title="Remove from category"
                  @click.stop="$emit('remove-agent', agent.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="children" class="q-pa-md">
          <div class="text-subtitle2 q-mb-md">Child Categories</div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <q-table
            v-else
            :rows="categoryChildren"
            :columns="childrenColumns"
            row-key="categoryId"
            flat
            bordered
            dense
            :rows-per-page-options="[15, 30, 50, 0]"
            :no-data-label="'No child categories'"
          >
            <template v-slot:body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-category', cellProps.row)"
                  >{{ cellProps.value }}</span
                >
              </q-td>
            </template>
          </q-table>
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
                v-if="
                  viewMode === 'policies' && !categoryAppliedCollectionsLoading
                "
                v-model="policySearchQuery"
                dense
                outlined
                placeholder="Search by policy..."
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
                :disable="!categoryAppliedCollections.length"
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
                :disable="selectedCategoryId == null"
                @click="$emit('apply-collection')"
              />
            </div>
          </div>

          <div class="collections-tab-scroll">
            <div
              v-if="selectedCategoryId == null"
              class="text-grey-6 text-caption"
            >
              Select a category to apply policy collections.
            </div>
            <template v-else>
              <div
                v-if="categoryAppliedCollectionsLoading"
                class="column items-center q-py-lg"
              >
                <q-spinner color="primary" size="2em" />
                <div class="text-caption text-grey-7 q-mt-sm">
                  Loading applied collections...
                </div>
              </div>
              <template
                v-else-if="(categoryAppliedCollections?.length ?? 0) > 0"
              >
                <template v-if="viewMode === 'collections'">
                  <q-table
                    :rows="categoryAppliedCollections"
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
                            @click="$emit('open-collection-details', props.row)"
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
                      No policies found matching "{{ policySearchQuery ?? "" }}"
                    </div>
                  </div>
                  <q-list v-else bordered separator class="rounded-borders">
                    <q-expansion-item
                      v-for="group in policiesGrouped"
                      :key="group.policyName"
                      expand-separator
                      icon="policy"
                      :label="group.policyName"
                      header-class="text-weight-medium"
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
                          @click="$emit('open-collection-details', col)"
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
                          <q-item-section side>
                            <ComplianceBar
                              v-if="col.compliance"
                              :assigned-and-applied="
                                col.compliance.assignedAndApplied
                              "
                              :assigned-not-applied="
                                col.compliance.assignedNotApplied
                              "
                              :not-assigned="col.compliance.notAssigned"
                              :loading="col.compliance.loading"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-expansion-item>
                  </q-list>
                </template>
              </template>
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this category so that its policies
                apply to all machines. Use the button above to choose a
                collection. No collections applied yet.
              </div>
            </template>
          </div>
        </q-tab-panel>

        <q-tab-panel name="alerts" class="q-pa-md">
          <AgentAlertsTab
            v-if="selectedCategoryId != null"
            :agent-category-id="selectedCategoryId"
            :active="detailTab === 'alerts'"
          />
        </q-tab-panel>

        <q-tab-panel name="connectivity" class="q-pa-md">
          <ConnectivityPoliciesTab
            v-if="connectivityCategoryTarget"
            :key="`conn-cat-${selectedCategoryId}`"
            compact
            :fixed-target="connectivityCategoryTarget"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { QTableColumn } from "quasar";
import AgentAlertsTab from "@/gpo/components/AgentAlertsTab.vue";
import ConnectivityPoliciesTab from "@/gpo/components/ConnectivityPolicy/ConnectivityPoliciesTab.vue";
import ComplianceBar from "@/gpo/components/shared/ComplianceBar.vue";
import type { ConnectivityPolicyTarget } from "@/gpo/api/connectivity-policy";
import { exportPolicyCollections } from "@/utils/csv";

interface PolicyCollection {
  id: number;
  name?: string;
  explainText?: string;
  policies?: Array<{ name: string }>;
  compliance?: {
    assignedAndApplied: number;
    assignedNotApplied: number;
    notAssigned: number;
    loading: boolean;
  };
}

const props = defineProps<{
  selectedCategoryId: number | null;
  selectedCategory: { name: string; description?: string } | null;
  detailTab: string;
  detailLoading: boolean;
  actionLoading: boolean;
  categoryAgents: Array<{ id: string; name: string }>;
  categoryChildren: unknown[];
  childrenColumns: QTableColumn[];
  categoryAppliedCollections: PolicyCollection[];
  categoryAppliedCollectionsLoading: boolean;
  collectionsColumns: QTableColumn[];
}>();

const connectivityCategoryTarget = computed<ConnectivityPolicyTarget | null>(
  () =>
    props.selectedCategoryId == null
      ? null
      : { type: "agentCategory", categoryId: props.selectedCategoryId },
);

defineEmits<{
  edit: [];
  move: [];
  delete: [];
  "update:detailTab": [value: string];
  "add-agent": [];
  "set-agents": [];
  "remove-agent": [agentId: string];
  "open-agent-dashboard": [agentId: string];
  "navigate-to-category": [row: unknown];
  "apply-collection": [];
  "remove-collection-by-id": [collectionId: number];
  "open-collection-details": [row: unknown];
}>();

type ViewMode = "collections" | "policies";
const viewMode = ref<ViewMode>("collections");
const policySearchQuery = ref("");

const policiesGrouped = computed(() => {
  const map = new Map<
    string,
    { policyName: string; collections: PolicyCollection[] }
  >();
  for (const col of props.categoryAppliedCollections) {
    for (const policy of col.policies ?? []) {
      if (!map.has(policy.name)) {
        map.set(policy.name, { policyName: policy.name, collections: [] });
      }
      map.get(policy.name)!.collections.push(col);
    }
  }

  const query = (policySearchQuery.value ?? "").toLowerCase().trim();
  let result = [...map.values()];
  if (query) {
    result = result.filter((p) => p.policyName.toLowerCase().includes(query));
  }
  result.sort((a, b) => b.collections.length - a.collections.length);
  return result;
});

function exportCollections(format: "csv" | "xlsx") {
  exportPolicyCollections(props.categoryAppliedCollections, format);
}
</script>

<style scoped lang="sass">
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
</style>
