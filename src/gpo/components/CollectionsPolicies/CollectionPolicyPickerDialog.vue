<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="collection-policy-picker-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Add policies to collection{{
            collectionName ? `: ${collectionName}` : ""
          }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <div class="col-3">
            <CategoryTree
              :categories="categories"
              :loading="loadingCategories"
              :error="errorCategories"
              :selected-category-id="selectedCategoryId"
              :search-query="categorySearchQuery"
              @update:selected-category-id="onSelectedCategoryIdUpdate"
              @update:search-query="categorySearchQuery = $event ?? ''"
              @retry="loadCategories()"
            />
          </div>

          <div class="col-4">
            <q-card
              flat
              bordered
              class="column"
              style="height: calc(100vh - 220px)"
            >
              <q-card-section class="policy-list-section">
                <div class="text-subtitle2 q-mb-sm">Policies</div>

                <q-select
                  v-model="selectedSupportedOs"
                  :options="supportedOsOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  dense
                  outlined
                  clearable
                  label="Supported OS"
                  placeholder="All operating systems"
                  class="q-mb-sm"
                  :loading="loadingSupportedOs"
                />

                <q-btn-toggle
                  v-model="policyViewMode"
                  no-caps
                  dense
                  spread
                  toggle-color="primary"
                  class="q-mb-sm"
                  :options="[
                    { label: 'By Category', value: 'byCategory' },
                    { label: 'All Policies', value: 'allPolicies' },
                  ]"
                />

                <template v-if="policyViewMode === 'byCategory'">
                  <div v-if="loadingPolicies" class="text-center q-pa-lg">
                    <q-spinner color="primary" size="2em" />
                    <div class="q-mt-sm">Loading...</div>
                  </div>
                  <div
                    v-else-if="errorPolicies"
                    class="text-center q-pa-lg text-negative"
                  >
                    <q-icon name="error" size="2em" />
                    <div class="q-mt-sm">{{ errorPolicies }}</div>
                    <q-btn
                      flat
                      dense
                      no-caps
                      label="Retry"
                      color="primary"
                      class="q-mt-sm"
                      @click="retryLoadPolicies"
                    />
                  </div>
                  <q-scroll-area
                    v-else-if="filteredGroupedPolicies.length > 0"
                    class="policy-list-scroll"
                    :style="{ height: 'calc(100vh - 390px)' }"
                  >
                    <div
                      v-for="group in filteredGroupedPolicies"
                      :key="group.scopeKey"
                      class="q-mb-md"
                    >
                      <div
                        class="text-caption text-weight-medium text-grey-7 q-mb-xs q-px-sm"
                      >
                        {{ group.scopeLabel }}
                      </div>
                      <q-list separator>
                        <q-item
                          v-for="policy in group.policies"
                          :key="policy.id"
                          clickable
                          v-ripple
                          :active="selectedPolicy?.id === policy.id"
                          class="policy-item"
                          @click="selectPolicy(policy)"
                        >
                          <q-item-section avatar>
                            <q-checkbox
                              :model-value="
                                selectedPolicies[policy.id] || false
                              "
                              @update:model-value="
                                togglePolicySelectionWithItem(policy)
                              "
                              @click.stop
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{
                              policy.displayName || policy.name
                            }}</q-item-label>
                            <q-item-label caption class="q-mt-xs">
                              <PolicyMetaChips
                                :version="policy.version"
                                :policy-status="policy.policyStatus"
                              />
                            </q-item-label>
                          </q-item-section>
                          <q-item-section
                            v-if="selectedPolicies[policy.id]"
                            side
                            class="q-pl-sm"
                          >
                            <q-toggle
                              :model-value="policyState[policy.id] !== false"
                              color="primary"
                              dense
                              :label="
                                policyState[policy.id] !== false ? 'On' : 'Off'
                              "
                              @update:model-value="
                                setPolicyState(policy.id, $event)
                              "
                              @click.stop
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div
                      v-if="selectedCount > 0"
                      class="q-pa-sm q-mt-sm bg-primary text-white rounded-borders"
                    >
                      <div class="text-caption">
                        Selected: {{ selectedCount }} policy(ies)
                      </div>
                    </div>
                  </q-scroll-area>
                  <div
                    v-else-if="selectedCategory"
                    class="text-center q-pa-lg text-grey-6"
                  >
                    <q-icon name="info" size="2em" />
                    <div class="q-mt-sm">No policies in category</div>
                  </div>
                  <div v-else class="text-center q-pa-lg text-grey-6">
                    <q-icon name="info" size="2em" />
                    <div class="q-mt-sm">Select a category</div>
                  </div>
                </template>

                <template v-else>
                  <q-input
                    v-model="allPoliciesSearch"
                    dense
                    outlined
                    clearable
                    placeholder="Search policies..."
                    :input-style="{ paddingLeft: '6px' }"
                    class="q-mb-sm"
                    @clear="allPoliciesSearch = ''"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" size="xs" />
                    </template>
                  </q-input>

                  <div v-if="loadingAllPolicies" class="text-center q-pa-lg">
                    <q-spinner color="primary" size="2em" />
                    <div class="q-mt-sm">Loading all policies...</div>
                  </div>
                  <q-scroll-area
                    v-else-if="filteredAllPoliciesGrouped.length > 0"
                    class="policy-list-scroll"
                    :style="{ height: 'calc(100vh - 430px)' }"
                  >
                    <div
                      v-for="group in filteredAllPoliciesGrouped"
                      :key="group.scopeKey"
                      class="q-mb-md"
                    >
                      <div
                        class="text-caption text-weight-medium text-grey-7 q-mb-xs q-px-sm"
                      >
                        {{ group.scopeLabel }}
                        <q-badge
                          :label="group.policies.length"
                          color="grey-5"
                          text-color="white"
                          rounded
                          class="q-ml-xs"
                        />
                      </div>
                      <q-list separator>
                        <q-item
                          v-for="policy in group.policies"
                          :key="policy.id"
                          clickable
                          v-ripple
                          :active="selectedPolicy?.id === policy.id"
                          class="policy-item"
                          @click="selectPolicy(policy)"
                        >
                          <q-item-section avatar>
                            <q-checkbox
                              :model-value="
                                selectedPolicies[policy.id] || false
                              "
                              @update:model-value="
                                togglePolicySelectionWithItem(policy)
                              "
                              @click.stop
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{
                              policy.displayName || policy.name
                            }}</q-item-label>
                            <q-item-label caption class="q-mt-xs">
                              <PolicyMetaChips
                                :version="policy.version"
                                :policy-status="policy.policyStatus"
                              />
                            </q-item-label>
                          </q-item-section>
                          <q-item-section
                            v-if="selectedPolicies[policy.id]"
                            side
                            class="q-pl-sm"
                          >
                            <q-toggle
                              :model-value="policyState[policy.id] !== false"
                              color="primary"
                              dense
                              :label="
                                policyState[policy.id] !== false ? 'On' : 'Off'
                              "
                              @update:model-value="
                                setPolicyState(policy.id, $event)
                              "
                              @click.stop
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div
                      v-if="selectedCount > 0"
                      class="q-pa-sm q-mt-sm bg-primary text-white rounded-borders"
                    >
                      <div class="text-caption">
                        Selected: {{ selectedCount }} policy(ies)
                      </div>
                    </div>
                  </q-scroll-area>
                  <div
                    v-else-if="allPoliciesLoaded"
                    class="text-center q-pa-lg text-grey-6"
                  >
                    <q-icon name="search_off" size="2em" />
                    <div class="q-mt-sm">No policies found</div>
                  </div>
                </template>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-5">
            <q-card
              v-if="selectedPolicy"
              flat
              bordered
              class="column policy-details-card"
              style="height: calc(100vh - 220px)"
            >
              <q-card-section class="q-pb-none">
                <q-tabs
                  v-model="settingsTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab
                    name="settings"
                    icon="settings"
                    label="Policy Settings"
                  />
                  <q-tab
                    name="description"
                    icon="description"
                    label="Description"
                  />
                </q-tabs>
                <q-separator class="q-mt-sm" />
              </q-card-section>
              <q-card-section class="col q-pt-none overflow-hidden">
                <q-scroll-area :style="{ height: 'calc(100vh - 320px)' }">
                  <q-tab-panels v-model="settingsTab" class="q-mt-md">
                    <q-tab-panel name="settings" class="q-pa-none">
                      <PolicyDetailsForm
                        :elements="policyDetailsElements"
                        :settings-values="policySettingsValues"
                        :loading="loadingPolicyDetails"
                        @update:field="updateSettingsField"
                      />
                    </q-tab-panel>
                    <q-tab-panel name="description" class="q-pa-none">
                      <div
                        v-if="loadingPolicyDetails"
                        class="text-center q-pa-lg"
                      >
                        <q-spinner color="primary" size="2em" />
                        <div class="q-mt-sm">Loading...</div>
                      </div>
                      <div v-else-if="selectedPolicy" class="q-pa-md">
                        <div class="text-h6 q-mb-md">
                          {{
                            selectedPolicy.displayName || selectedPolicy.name
                          }}
                        </div>
                        <div
                          v-if="
                            selectedPolicy.description &&
                            selectedPolicy.description.trim()
                          "
                          class="text-body2 text-grey-8 q-mb-md"
                          style="white-space: normal; line-height: 1.6"
                        >
                          {{ selectedPolicy.description }}
                        </div>
                        <div v-else class="text-grey-6 text-body2 q-mb-md">
                          No description
                        </div>
                        <div class="text-caption text-grey-6 q-mb-sm">
                          Scope: {{ scopeLabel(selectedPolicy.scope) }}
                        </div>
                        <div class="row items-center q-gutter-sm">
                          <span class="text-caption text-grey-6">Version:</span>
                          <span class="text-body2">
                            {{
                              selectedPolicy.version !== undefined
                                ? selectedPolicy.version
                                : "—"
                            }}
                          </span>
                        </div>
                        <div class="row items-center q-gutter-sm q-mt-xs">
                          <span class="text-caption text-grey-6">Status:</span>
                          <PolicyMetaChips
                            v-if="selectedPolicy.policyStatus !== undefined"
                            :policy-status="selectedPolicy.policyStatus"
                          />
                          <span v-else class="text-grey-5">—</span>
                        </div>
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-scroll-area>
              </q-card-section>
            </q-card>
            <q-card
              v-else
              flat
              bordered
              class="column"
              style="height: calc(100vh - 220px)"
            >
              <q-card-section>
                <div class="text-grey-6 text-body2">
                  Select a policy to view description and settings
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="applyProgressText" class="q-pt-none q-pb-xs">
        <q-banner dense rounded class="collection-progress-banner">
          <template #avatar>
            <q-spinner color="primary" size="20px" />
          </template>
          {{ applyProgressText }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="Save and close"
          :loading="applying"
          :disable="selectedCount === 0"
          @click="submitAddPolicies"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  policyCatalogClient,
  collectionsClient,
  type PolicyElementMetadata,
} from "../../api/grpc-client";
import { notifyError, notifySuccess } from "@/utils/notify";
import CategoryTree from "./CategoryTree.vue";
import PolicyDetailsForm from "./PolicyDetailsForm.vue";
import { usePolicyCategories } from "../../composables/usePolicyCategories";
import { usePolicySelection } from "../../composables/usePolicySelection";
import {
  normalizePoliciesList,
  parsePolicyGroupScopeLabel,
} from "../../api/policy-catalog-adapters";
import { getDefaultValueForElement } from "../../utils/policy-field-types";
import { fetchSupportedOsSelectOptions } from "../../utils/supportedOsBuildSelect";
import type { CategoryNode, PolicyItem } from "../../types/policy-catalog";
import PolicyMetaChips from "@/gpo/components/shared/PolicyMetaChips.vue";
import { policyMetaSearchText } from "@/gpo/utils/policy-meta";

const POLICY_SCOPE_NONE = 0;
const POLICY_SCOPE_USER = 1;
const POLICY_SCOPE_MACHINE = 2;
const POLICY_SCOPE_BOTH = 3;

function collectionScopeToFilter(scope: number): string {
  if (scope === POLICY_SCOPE_USER) return "user";
  if (scope === POLICY_SCOPE_MACHINE) return "computer";
  return "all";
}

interface PolicyDetailsElement {
  id: number;
  element_id: string;
  type: string;
  value_name?: string;
  value_type?: string;
  registry_key?: string;
  required?: boolean;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  display_name?: string;
  description?: string;
  presentation_type?: string;
  items?: Array<{
    id: number;
    name: string;
    display_name?: string;
    value_type?: string;
    value?: string;
  }>;
}

const props = defineProps<{
  modelValue: boolean;
  collectionId: number | null;
  collectionName?: string;
  collectionScope?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "done"): void;
}>();

const { loadingCategories, categories, errorCategories, loadCategories } =
  usePolicyCategories();

const {
  selectedPolicies,
  selectedCount,
  togglePolicySelection,
  clearSelection,
} = usePolicySelection();

const selectedPolicyItems = ref<Record<string, PolicyItem>>({});

const selectedCategoryId = ref<string | null>(null);
const categorySearchQuery = ref<string | null>("");
const selectedCategory = ref<{ id: string; categoryName: string } | null>(null);
const loadingPolicies = ref(false);
const errorPolicies = ref<string | null>(null);
const allPolicies = ref<PolicyItem[]>([]);
const selectedPolicy = ref<PolicyItem | null>(null);
const policyHashes = ref<Record<string, string>>({});
const policyState = ref<Record<string, boolean>>({});
const scopeFilter = computed(() =>
  collectionScopeToFilter(props.collectionScope ?? POLICY_SCOPE_NONE),
);
const applying = ref(false);
const applyProgressText = ref("");
const perPolicySettings = ref<Record<string, Record<string, unknown>>>({});
const perPolicyElements = ref<Record<string, PolicyDetailsElement[]>>({});

const policyViewMode = ref<"byCategory" | "allPolicies">("byCategory");
const allPoliciesRaw = ref<PolicyItem[]>([]);
const allPoliciesSearch = ref("");
const loadingAllPolicies = ref(false);
const allPoliciesLoaded = ref(false);
const lastAllPoliciesOsKey = ref<string | null>(null);

const selectedSupportedOs = ref<string | null>(null);
const supportedOsOptions = ref<Array<{ label: string; value: string }>>([]);
const loadingSupportedOs = ref(false);

const selectedPoliciesList = computed(() =>
  Object.values(selectedPolicyItems.value),
);

async function loadSupportedOsList() {
  loadingSupportedOs.value = true;
  try {
    supportedOsOptions.value = await fetchSupportedOsSelectOptions();
  } catch {
    notifyError("Error loading supported OS list");
    supportedOsOptions.value = [];
  } finally {
    loadingSupportedOs.value = false;
  }
}

function togglePolicySelectionWithItem(policy: PolicyItem) {
  const id = policy.id;
  const currentlySelected = !!selectedPolicies.value[id];
  togglePolicySelection(id);
  const nextSelected = !currentlySelected;
  if (nextSelected) {
    selectedPolicyItems.value = { ...selectedPolicyItems.value, [id]: policy };
    if (policyState.value[id] === undefined) {
      policyState.value = { ...policyState.value, [id]: true };
    }
  } else {
    const next = { ...selectedPolicyItems.value };
    delete next[id];
    selectedPolicyItems.value = next;
  }
}

function setPolicyState(policyId: string, enabled: boolean) {
  policyState.value = { ...policyState.value, [policyId]: enabled };
}
const settingsTab = ref<"settings" | "description">("settings");
const loadingPolicyDetails = ref(false);
const policyDetailsElements = ref<PolicyDetailsElement[]>([]);
const policySettingsValues = ref<Record<string, unknown>>({});

function onSelectedCategoryIdUpdate(categoryId: string | null) {
  selectedCategoryId.value = categoryId;
  if (!categoryId) {
    selectedCategory.value = null;
    allPolicies.value = [];
    selectedPolicy.value = null;
    return;
  }
  const category = findCategory(categories.value, categoryId);
  if (!category) return;
  selectedCategory.value = {
    id: category.id,
    categoryName: category.categoryName,
  };
  loadPoliciesByCategory(category.categoryName);
}

function findCategory(nodes: CategoryNode[], id: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findCategory(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function retryLoadPolicies() {
  errorPolicies.value = null;
  if (selectedCategory.value) {
    loadPoliciesByCategory(selectedCategory.value.categoryName);
  }
}

function updateSettingsField(key: string, value: unknown) {
  policySettingsValues.value[key] = value;
  const policyId = selectedPolicy.value?.id;
  if (policyId) {
    if (!perPolicySettings.value[policyId]) {
      perPolicySettings.value[policyId] = {};
    }
    perPolicySettings.value[policyId] = {
      ...perPolicySettings.value[policyId],
      [key]: value,
    };
  }
}

function scopeLabel(scope: number): string {
  switch (scope) {
    case POLICY_SCOPE_USER:
      return "User";
    case POLICY_SCOPE_MACHINE:
      return "Computer";
    case POLICY_SCOPE_BOTH:
      return "User & Computer";
    case POLICY_SCOPE_NONE:
    default:
      return "None";
  }
}


function filterPoliciesByCollectionScope(list: PolicyItem[]): PolicyItem[] {
  const filter = scopeFilter.value;
  if (filter === "all") return list;
  return list.filter((p) => {
    if (filter === "user") {
      return p.scope === POLICY_SCOPE_USER || p.scope === POLICY_SCOPE_BOTH;
    }
    if (filter === "computer") {
      return (
        p.scope === POLICY_SCOPE_MACHINE || p.scope === POLICY_SCOPE_BOTH
      );
    }
    return true;
  });
}

const filteredGroupedPolicies = computed(() => {
  let list = filterPoliciesByCollectionScope(allPolicies.value);

  const groups: {
    scopeKey: string;
    scopeLabel: string;
    policies: PolicyItem[];
  }[] = [];
  const byScope: Record<number, PolicyItem[]> = {
    [POLICY_SCOPE_USER]: [],
    [POLICY_SCOPE_MACHINE]: [],
    [POLICY_SCOPE_BOTH]: [],
    [POLICY_SCOPE_NONE]: [],
  };
  for (const p of list) {
    const scope = p.scope in byScope ? p.scope : POLICY_SCOPE_NONE;
    if (!byScope[scope]) byScope[scope] = [];
    byScope[scope].push(p);
  }
  const order = [
    POLICY_SCOPE_USER,
    POLICY_SCOPE_MACHINE,
    POLICY_SCOPE_BOTH,
    POLICY_SCOPE_NONE,
  ];
  for (const scope of order) {
    const policies = byScope[scope] || [];
    if (policies.length === 0) continue;
    groups.push({
      scopeKey: String(scope),
      scopeLabel: scopeLabel(scope),
      policies,
    });
  }
  return groups;
});

async function loadAllPolicies() {
  const osKey = selectedSupportedOs.value ?? "";
  if (allPoliciesLoaded.value && lastAllPoliciesOsKey.value === osKey) return;
  loadingAllPolicies.value = true;
  try {
    let items: PolicyItem[] = [];
    if (selectedSupportedOs.value) {
      const response = await policyCatalogClient.getPoliciesBySupportedOs(
        selectedSupportedOs.value,
        "en-US",
      );
      items = normalizePoliciesList(response);
    } else {
      const response =
        await policyCatalogClient.listPoliciesGroupedByScope("en-US");
      const responseObj = response as {
        groupsList?: unknown[];
        groups?: unknown[];
      };
      const groupsList = responseObj.groupsList || responseObj.groups || [];
      for (const group of groupsList) {
        if (!group || typeof group !== "object") continue;
        const g = group as {
          scope?: string;
          policiesList?: unknown[];
          policies?: unknown[];
        };
        const groupScope = parsePolicyGroupScopeLabel(g.scope);
        const policiesList = g.policiesList || g.policies || [];
        items.push(...normalizePoliciesList({ policiesList }, groupScope));
      }
    }
    allPoliciesRaw.value = items;
    allPoliciesLoaded.value = true;
    lastAllPoliciesOsKey.value = osKey;
  } catch {
    notifyError("Error loading all policies");
  } finally {
    loadingAllPolicies.value = false;
  }
}

const filteredAllPoliciesGrouped = computed(() => {
  const query = allPoliciesSearch.value.trim().toLowerCase();
  let list = filterPoliciesByCollectionScope(allPoliciesRaw.value);
  if (query) {
    list = list.filter(
      (p) =>
        (p.displayName || "").toLowerCase().includes(query) ||
        (p.name || "").toLowerCase().includes(query) ||
        policyMetaSearchText(p).includes(query),
    );
  }
  const byScope: Record<number, PolicyItem[]> = {};
  for (const p of list) {
    const key = p.scope ?? POLICY_SCOPE_NONE;
    if (!byScope[key]) byScope[key] = [];
    byScope[key].push(p);
  }
  const order = [
    POLICY_SCOPE_USER,
    POLICY_SCOPE_MACHINE,
    POLICY_SCOPE_BOTH,
    POLICY_SCOPE_NONE,
  ];
  const groups: {
    scopeKey: string;
    scopeLabel: string;
    policies: PolicyItem[];
  }[] = [];
  for (const scope of order) {
    const policies = byScope[scope];
    if (policies && policies.length > 0) {
      groups.push({
        scopeKey: String(scope),
        scopeLabel: scopeLabel(scope),
        policies,
      });
    }
  }
  return groups;
});

watch(policyViewMode, (mode) => {
  if (mode === "allPolicies") {
    void loadAllPolicies();
  }
  selectedPolicy.value = null;
});

watch(selectedSupportedOs, () => {
  if (!props.modelValue) return;
  allPoliciesLoaded.value = false;
  if (policyViewMode.value === "allPolicies") {
    void loadAllPolicies();
  }
  if (policyViewMode.value === "byCategory" && selectedCategory.value) {
    void loadPoliciesByCategory(selectedCategory.value.categoryName);
  }
});

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      clearSelection();
      selectedPolicyItems.value = {};
      policyHashes.value = {};
      selectedPolicy.value = null;
      selectedCategoryId.value = null;
      categorySearchQuery.value = "";
      selectedCategory.value = null;
      errorPolicies.value = null;
      settingsTab.value = "settings";
      policyDetailsElements.value = [];
      policySettingsValues.value = {};
      perPolicySettings.value = {};
      perPolicyElements.value = {};
      loadingPolicyDetails.value = false;
      policyViewMode.value = "byCategory";
      allPoliciesRaw.value = [];
      allPoliciesSearch.value = "";
      allPoliciesLoaded.value = false;
      lastAllPoliciesOsKey.value = null;
      selectedSupportedOs.value = null;
      policyState.value = {};
      void loadCategories();
      void loadSupportedOsList();
    }
  },
);

async function loadPoliciesByCategory(categoryName: string) {
  loadingPolicies.value = true;
  errorPolicies.value = null;
  allPolicies.value = [];
  selectedPolicy.value = null;
  try {
    const [categoryResponse, byOsResponse] = await Promise.all([
      policyCatalogClient.getPoliciesByCategory(categoryName, "en-US"),
      selectedSupportedOs.value
        ? policyCatalogClient.getPoliciesBySupportedOs(
            selectedSupportedOs.value,
            "en-US",
          )
        : Promise.resolve(null),
    ]);
    let policies = normalizePoliciesList(categoryResponse);
    if (byOsResponse) {
      const allowed = new Set(
        normalizePoliciesList(byOsResponse).map((p) => p.id),
      );
      policies = policies.filter((p) => allowed.has(p.id));
    }
    allPolicies.value = policies;
  } catch {
    errorPolicies.value = "Error loading policies";
    notifyError("Error loading policies");
  } finally {
    loadingPolicies.value = false;
  }
}

function getDefaultValue(element: PolicyDetailsElement): unknown {
  return getDefaultValueForElement(element);
}

function selectPolicy(policy: PolicyItem) {
  selectedPolicy.value = policy;
  loadPolicyDetails(policy);
}

function ensureString(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && "value" in val) {
    const v = (val as { value: unknown }).value;
    return typeof v === "string" ? v : "";
  }
  return String(val);
}

function coercePositivePolicyElementId(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.trunc(raw);
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function readPolicyElementRecordId(el: Record<string, unknown>): number {
  const fromFields = [
    el.id,
    el.policyElementId,
    el.policyDetailsElementId,
    el.policy_details_element_id,
  ];
  for (const v of fromFields) {
    const n = coercePositivePolicyElementId(v);
    if (n > 0) return n;
  }
  return 0;
}

function buildPresentationMap(presentationList: unknown[]): Map<
  string,
  {
    type: string;
    text?: string;
    default_value?: string;
    presentationNumericId?: number;
  }
> {
  const map = new Map<
    string,
    {
      type: string;
      text?: string;
      default_value?: string;
      presentationNumericId?: number;
    }
  >();
  for (const presEl of presentationList) {
    if (!presEl || typeof presEl !== "object") continue;
    const p = presEl as {
      id?: number;
      refId?: string;
      ref_id?: string;
      type?: string;
      text?: string | { value?: string };
      defaultValue?: string;
      default_value?: string;
    };
    const refId = p.refId ?? p.ref_id ?? "";
    if (refId.length === 0) continue;
    const text =
      typeof p.text === "string"
        ? p.text
        : (p.text as { value?: string })?.value;
    const defaultVal = p.defaultValue ?? p.default_value;
    const presentationNumericId = coercePositivePolicyElementId(p.id);
    map.set(refId, {
      type: p.type ?? "",
      text,
      default_value: typeof defaultVal === "string" ? defaultVal : undefined,
      presentationNumericId:
        presentationNumericId > 0 ? presentationNumericId : undefined,
    });
  }
  return map;
}

function mapPresentationTypeToFinal(pt: string, currentType: string): string {
  if (pt === "dropdownlist" || pt === "dropdown_list" || pt === "dropdown") {
    return "enum";
  }
  if (pt === "textbox" || pt === "text_box" || pt === "text") return "TEXT";
  if (pt === "checkbox" || pt === "check_box") return "CHECKBOX";
  if (pt === "decimaltextbox" || pt === "decimal_textbox") return "NUMERIC";
  if (pt === "listbox" || pt === "list_box" || pt === "list") return "LIST";
  if (pt === "multitextbox" || pt === "multi_textbox" || pt === "multitext") {
    return "multiTextBox";
  }
  return currentType ?? "";
}

function buildPolicyElements(
  policyElements: unknown[],
  presentationMap: Map<
    string,
    {
      type: string;
      text?: string;
      default_value?: string;
      presentationNumericId?: number;
    }
  >,
): PolicyDetailsElement[] {
  const elements: PolicyDetailsElement[] = [];
  for (const el of policyElements) {
    if (!el || typeof el !== "object") continue;
    const elem = el as {
      id?: number;
      elementId?: string;
      element_id?: string;
      type?: string;
      valueName?: string;
      value_name?: string;
      valueType?: string;
      value_type?: string;
      registryKey?: string;
      registry_key?: string;
      required?: boolean;
      maxLength?: number;
      max_length?: number;
      minValue?: number;
      min_value?: number;
      maxValue?: number;
      max_value?: number;
      itemsList?: unknown[];
      items?: unknown[];
    };
    const elemRec = el as Record<string, unknown>;
    const elementId = elem.elementId ?? elem.element_id ?? "";
    const presentationEl = presentationMap.get(elementId);
    if (!presentationEl) continue;
    const displayName = presentationEl.text ?? elementId;
    const presentationType = presentationEl.type ?? "";
    const finalType = mapPresentationTypeToFinal(
      presentationType.toLowerCase(),
      elem.type ?? "",
    );
    const rawItems = elem.itemsList ?? elem.items ?? [];
    const items = Array.isArray(rawItems)
      ? rawItems
          .filter(
            (item): item is Record<string, unknown> =>
              item != null && typeof item === "object",
          )
          .map((item) => {
            const itemId = (item.id as number) ?? 0;
            const itemValue = ensureString(item.value);
            const itemName = ensureString(item.name ?? itemValue);
            const itemDisplayName =
              ensureString(
                item.displayName ?? item.display_name ?? item.text ?? itemValue,
              ) || itemName;
            const itemValueType = (item.valueType ??
              item.value_type ??
              "") as string;
            return {
              id: itemId,
              name: itemName,
              display_name: itemDisplayName || `Value ${itemId}`,
              value_type: itemValueType,
              value: itemValue,
            };
          })
      : [];
    const idFromPolicyElement = readPolicyElementRecordId(elemRec);
    const idFromPresentation =
      presentationEl.presentationNumericId &&
      presentationEl.presentationNumericId > 0
        ? presentationEl.presentationNumericId
        : 0;
    const resolvedElementId =
      idFromPolicyElement > 0 ? idFromPolicyElement : idFromPresentation;
    elements.push({
      id: resolvedElementId,
      element_id: elementId,
      type: finalType,
      value_name: (elem.valueName ?? elem.value_name) as string | undefined,
      value_type: (elem.valueType ?? elem.value_type) as string | undefined,
      registry_key: (elem.registryKey ?? elem.registry_key) as
        | string
        | undefined,
      required: elem.required as boolean | undefined,
      max_length: (elem.maxLength ?? elem.max_length) as number | undefined,
      min_value: (elem.minValue ?? elem.min_value) as number | undefined,
      max_value: (elem.maxValue ?? elem.max_value) as number | undefined,
      display_name: displayName,
      presentation_type: presentationType,
      items,
    });
  }
  return elements;
}

async function loadPolicyDetails(policy: PolicyItem) {
  loadingPolicyDetails.value = true;
  policyDetailsElements.value = [];
  policySettingsValues.value = {};
  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      loadingPolicyDetails.value = false;
      return;
    }
    const response = await policyCatalogClient.getPolicyDetails(
      policyId,
      "en-US",
    );
    const hash = extractHashFromPolicyDetails(response);
    if (hash) {
      policyHashes.value[policy.id] = hash;
    }
    const resp = response as Record<string, unknown>;
    const presentation = resp.presentation as
      | Record<string, unknown>
      | undefined;
    const presentationList = (presentation?.elementsList ??
      presentation?.elements ??
      []) as unknown[];
    const policyElements = (resp.policyElementsList ??
      resp.policy_elements ??
      []) as unknown[];

    const presentationMap = buildPresentationMap(presentationList);
    const elements = buildPolicyElements(policyElements, presentationMap);
    policyDetailsElements.value = elements;
    perPolicyElements.value[policy.id] = elements;

    const saved = perPolicySettings.value[policy.id];
    if (saved) {
      policySettingsValues.value = { ...saved };
    } else {
      const values: Record<string, unknown> = {};
      for (const element of elements) {
        const presentationEl = presentationMap.get(element.element_id);
        values[element.element_id] =
          presentationEl?.default_value ?? getDefaultValue(element);
      }
      policySettingsValues.value = values;
      perPolicySettings.value[policy.id] = { ...values };
    }
  } catch {
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
  } finally {
    loadingPolicyDetails.value = false;
  }
}

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function extractHashFromPolicyLike(policy: unknown): string | null {
  if (!policy || typeof policy !== "object") return null;
  const p = policy as Record<string, unknown> & {
    getHash?: () => unknown;
    toObject?: () => unknown;
  };
  try {
    const getterHash = readTrimmedString(p.getHash?.());
    if (getterHash) return getterHash;
  } catch {}
  try {
    const obj = p.toObject?.();
    if (obj && typeof obj === "object") {
      const hash = extractHashFromPolicyLike(obj);
      if (hash) return hash;
    }
  } catch {}
  return (
    readTrimmedString(p.hash) ??
    readTrimmedString(p.policy_hash) ??
    readTrimmedString(p.policyHash)
  );
}

function extractHashFromPolicyDetails(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown> & {
    getPolicy?: () => unknown;
    toObject?: () => unknown;
  };

  try {
    const getterPolicyHash = extractHashFromPolicyLike(r.getPolicy?.());
    if (getterPolicyHash) return getterPolicyHash;
  } catch {}

  const direct = extractHashFromPolicyLike(r);
  if (direct) return direct;

  try {
    const obj = r.toObject?.();
    if (obj && obj !== response) {
      const hash = extractHashFromPolicyDetails(obj);
      if (hash) return hash;
    }
  } catch {}

  const candidates = [
    r.policy,
    r.policyDetails,
    r.details,
    Array.isArray(r.policyList) ? r.policyList[0] : undefined,
    Array.isArray(r.policiesList) ? r.policiesList[0] : undefined,
    Array.isArray(r.policies) ? r.policies[0] : undefined,
  ];

  for (const candidate of candidates) {
    const hash = extractHashFromPolicyLike(candidate);
    if (hash) return hash;
    if (candidate && typeof candidate === "object") {
      const nested = extractHashFromPolicyDetails(candidate);
      if (nested) return nested;
    }
  }

  return null;
}

async function getHashForPolicy(policyId: string): Promise<string | null> {
  if (policyHashes.value[policyId]) return policyHashes.value[policyId];
  const idNum = Number.parseInt(policyId, 10);
  if (Number.isNaN(idNum)) return null;
  try {
    const response = await policyCatalogClient.getPolicyDetails(idNum, "en-US");
    const hash = extractHashFromPolicyDetails(response);
    if (hash) policyHashes.value[policyId] = hash;
    return hash;
  } catch {
    return null;
  }
}

function policyLabel(p: PolicyItem): string {
  return p.displayName || p.name || p.id;
}

async function resolvePolicyHash(p: PolicyItem): Promise<string | null> {
  const inline =
    typeof p.hash === "string" && p.hash.trim() ? p.hash.trim() : null;
  if (inline) return inline;
  return await getHashForPolicy(p.id);
}

async function buildPoliciesWithStatePayload(list: PolicyItem[]): Promise<{
  policiesWithState: Array<{
    hash: string;
    state: boolean;
    selection?: Record<string, unknown>;
    elementsMetadata?: PolicyElementMetadata[];
  }>;
  skipped: string[];
}> {
  const policiesWithState: Array<{
    hash: string;
    state: boolean;
    selection?: Record<string, unknown>;
    elementsMetadata?: PolicyElementMetadata[];
  }> = [];
  const skipped: string[] = [];

  const resolvedPolicies = await Promise.all(
    list.map(async (policy) => ({
      policy,
      hash: await resolvePolicyHash(policy),
    })),
  );

  for (const { policy, hash } of resolvedPolicies) {
    const id = policy.id;
    if (!hash) {
      skipped.push(policyLabel(policy));
      continue;
    }

    const savedSettings = perPolicySettings.value[id];
    const savedElements = perPolicyElements.value[id];
    const elementsMetadata: PolicyElementMetadata[] | undefined =
      savedElements?.map((el) => ({
        id: el.id,
        element_id: el.element_id,
        type: el.type,
        items: el.items,
      }));

    policiesWithState.push({
      hash,
      state: policyState.value[id] !== false,
      selection:
        savedSettings && Object.keys(savedSettings).length > 0
          ? savedSettings
          : undefined,
      elementsMetadata,
    });
  }

  return { policiesWithState, skipped };
}

async function submitAddPolicies() {
  const collectionId = props.collectionId;
  if (collectionId == null || collectionId <= 0) {
    notifyError("Collection not selected");
    return;
  }
  const list = selectedPoliciesList.value;
  if (list.length === 0) {
    notifyError("Select at least one policy");
    return;
  }

  applying.value = true;
  applyProgressText.value = "Resolving selected policy identifiers...";
  try {
    const { policiesWithState, skipped } =
      await buildPoliciesWithStatePayload(list);
    if (policiesWithState.length === 0) {
      notifyError(
        skipped.length > 0
          ? `Could not get policy hashes for: ${skipped.slice(0, 3).join(", ")}${skipped.length > 3 ? ", ..." : ""}`
          : "Could not get policy hashes for selected policies.",
      );
      return;
    }
    applyProgressText.value = "Saving policies to collection...";
    await collectionsClient.createCollectionsPolicies(
      collectionId,
      policiesWithState,
    );
    notifySuccess(
      policiesWithState.length === 1
        ? "Policy added to collection"
        : `${policiesWithState.length} policies added to collection`,
    );
    if (skipped.length > 0) {
      notifyError(
        `Skipped ${skipped.length} policy(ies) without hash: ${skipped.slice(0, 3).join(", ")}${skipped.length > 3 ? ", ..." : ""}`,
      );
    }
    emit("done");
    emit("update:modelValue", false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error adding policies";
    notifyError(msg);
  } finally {
    applying.value = false;
    applyProgressText.value = "";
  }
}
</script>

<style scoped lang="sass">
.collection-policy-picker-card
  display: flex
  flex-direction: column
  min-height: 80vh

.category-tree
  .q-tree__node-header
    padding: 4px 0

.policy-list-scroll
  min-height: 200px

.collection-progress-banner
  background: rgba(25, 118, 210, 0.08)
  color: #1f2a44
</style>
