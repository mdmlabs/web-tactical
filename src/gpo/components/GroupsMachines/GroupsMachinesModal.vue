<template>
  <div class="groups-manager-layout groups-machines-layout">
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
        <q-icon name="devices" size="sm" class="q-mr-sm" color="primary" />
        <q-toolbar-title>Groups Machines</q-toolbar-title>

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
        <CategoriesListPanel
          :nodes="filteredCategoryTree"
          :loading="categoriesLoading"
          :error="categoriesError"
          :selected-key="selectedCategoryIdKey"
          :search="categorySearch"
          @refresh="loadCategories"
          @create="openCreateCategoryDialog"
          @select="selectCategory"
          @update:search="categorySearch = $event"
        />

        <q-separator vertical />

        <CategoryDetailPanel
          :selected-category-id="selectedCategoryId"
          :selected-category="selectedCategory"
          :detail-tab="detailTab"
          :detail-loading="detailLoading"
          :action-loading="actionLoading"
          :category-agents="categoryAgents"
          :category-children="categoryChildren"
          :children-columns="childrenColumns"
          :category-applied-collections="categoryAppliedCollections"
          :category-applied-collections-loading="
            categoryAppliedCollectionsLoading
          "
          :collections-columns="collectionsColumns"
          @update:detail-tab="detailTab = $event"
          @edit="openEditCategoryDialog"
          @move="openMoveCategoryDialog"
          @delete="confirmDeleteCategory"
          @set-agents="openSetAgentsDialog"
          @add-agent="showAddAgentPanel = true"
          @remove-agent="removeAgentFromCategory"
          @open-agent-dashboard="goToAgentDashboard"
          @navigate-to-category="
            (row) => navigateToCategory(row as CategoryRow)
          "
          @apply-collection="showApplyCollectionDialog = true"
          @remove-collection-by-id="handleRemoveCollectionById"
          @open-collection-details="
            (row) => openCollectionDetailsDialog(row as CollectionType)
          "
        />
      </div>
    </div>

    <EditCategoryDialog
      v-model="showEditCategory"
      :loading="editLoading"
      :name="editCategoryForm.name"
      :description="editCategoryForm.description"
      @show="loadCategoryForEdit"
      @save="doUpdateCategory"
      @update:name="editCategoryForm.name = $event"
      @update:description="editCategoryForm.description = $event"
    />

    <MoveCategoryDialog
      v-model="showMoveCategory"
      :loading="moveLoading"
      :category-name="selectedCategory?.name ?? ''"
      :parent-options="moveParentOptions"
      :parent-id="moveCategoryForm.parentId"
      @move="doSetCategoryParent"
      @update:parent-id="moveCategoryForm.parentId = $event"
    />

    <SetAgentsDialog
      v-model="showSetAgents"
      :loading="setAgentsLoading"
      :agent-ids-text="setAgentsForm.agentIdsText"
      @show="prepareSetAgentsForm"
      @set="doSetCategoryAgents"
      @update:agent-ids-text="setAgentsForm.agentIdsText = $event"
    />

    <CreateCategoryDialog
      v-model="showCreateCategory"
      :loading="createCategoryLoading"
      :parent-options="parentCategoryOptions"
      @create="doCreateCategory"
      :name="createCategoryForm.name"
      :description="createCategoryForm.description"
      :parent-id="createCategoryForm.parentId"
      :max-agents="createCategoryForm.maxAgents"
      @update:name="createCategoryForm.name = $event"
      @update:description="createCategoryForm.description = $event"
      @update:parent-id="createCategoryForm.parentId = $event"
      @update:max-agents="createCategoryForm.maxAgents = $event"
    />

    <ApplyCollectionDialog
      v-model="showApplyCollectionDialog"
      :category-label="
        selectedCategory?.name ?? String(selectedCategoryId ?? '')
      "
      :loading="applyCollectionLoading"
      :applying="applyCollectionApplying"
      :options="applyCollectionOptions"
      :model-selected-id="applyCollectionSelectedId"
      @show="loadCollectionsForApply"
      @update:selected-id="applyCollectionSelectedId = $event"
      @apply="confirmApplyCollectionToCategory"
    />

    <RemoveCollectionDialog
      v-model="showRemoveCollectionDialog"
      :category-label="
        selectedCategory?.name ?? String(selectedCategoryId ?? '')
      "
      :options="removeCollectionOptions"
      :options-loading="removeCollectionOptionsLoading"
      :removing="removeCollectionRemoving"
      :model-selected-id="removeCollectionSelectedId"
      @show="prepareRemoveCollectionOptionsForCategory"
      @update:selected-id="removeCollectionSelectedId = $event"
      @remove="confirmRemoveCollectionFromCategory"
    />

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      @select="handleAddAgentSelect"
    />

    <CollectionDetailsDialog
      v-model="showCollectionDetailsDialog"
      :collection="selectedCollection"
      :policy-search-query="policySearchQuery"
      :category-agents="categoryAgents"
      :selected-category-id="selectedCategoryId"
      @update:policy-search-query="policySearchQuery = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import {
  agentCategoryClient,
  getSingleAgentIdFromTarget,
  policyAssignmentClient,
  collectionsClient,
  agentServiceClientWrapper,
  policyStateClient,
  createAgentTarget,
} from "@/gpo/api/grpc-client";
import operator_pb from "@/generated/operator_pb";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";
import { notifyError, notifySuccess } from "@/utils/notify";

import CategoriesListPanel from "./CategoriesListPanel.vue";
import CategoryDetailPanel from "./CategoryDetailPanel.vue";
import EditCategoryDialog from "./dialogs/EditCategoryDialog.vue";
import MoveCategoryDialog from "./dialogs/MoveCategoryDialog.vue";
import SetAgentsDialog from "./dialogs/SetAgentsDialog.vue";
import CreateCategoryDialog from "./dialogs/CreateCategoryDialog.vue";
import ApplyCollectionDialog from "./dialogs/ApplyCollectionDialog.vue";
import RemoveCollectionDialog from "./dialogs/RemoveCollectionDialog.vue";
import CollectionDetailsDialog from "./dialogs/CollectionDetailsDialog.vue";

interface CategoryRow {
  categoryId: number;
  name: string;
  description?: string;
}

interface TreeNode {
  id: string;
  label: string;
  isCategory?: boolean;
  children?: TreeNode[];
}

interface AgentRow {
  id: string;
  name: string;
}

type AgentNameById = Record<string, string | undefined>;

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

function goToAgentDashboard(agentId: string) {
  if (!agentId) return;
  router.push({
    name: "GPOManager",
    query: {
      tab: "dashboard",
      agent_id: agentId,
    },
  });
}

const categoriesLoading = ref(false);
const categoriesError = ref<string | null>(null);
const categorySearch = ref("");
const categoryTreeNodes = ref<TreeNode[]>([]);
const allCategoriesFlat = ref<CategoryRow[]>([]);

const selectedCategoryId = ref<number | null>(null);
const selectedCategoryIdKey = ref<string | null>(null);
const selectedCategory = ref<{ name: string; description?: string } | null>(
  null,
);
const detailTab = ref("agents");
const detailLoading = ref(false);

const categoryAgents = ref<AgentRow[]>([]);
const categoryChildren = ref<CategoryRow[]>([]);

const agentNameById = reactive<AgentNameById>({});
const agentNameInflight = new Map<string, Promise<string>>();

const categoryAgentsCache = new Map<number, Set<string>>();
const agentCategoryLookupCache = new Map<string, number[]>();
const complianceCache = new Map<string, { assignedAndApplied: number; assignedNotApplied: number; notAssigned: number; timestamp: number }>();
const COMPLIANCE_CACHE_TTL = 5 * 60 * 1000;

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length)) },
    async () => {
      while (i < items.length) {
        const idx = i;
        i += 1;
        results[idx] = await mapper(items[idx]);
      }
    },
  );

  await Promise.all(workers);
  return results;
}

async function resolveAgentName(agentId: string): Promise<string> {
  if (!agentId) return "";
  const cached = agentNameById[agentId];
  if (cached) return cached;

  const inflight = agentNameInflight.get(agentId);
  if (inflight) return inflight;

  const p = (async () => {
    try {
      const agent = await agentServiceClientWrapper.getAgent(agentId);
      const name =
        (agent as { hostName?: string; host_name?: string }).hostName ??
        (agent as { hostName?: string; host_name?: string }).host_name ??
        agentId;
      agentNameById[agentId] = name;
      return name;
    } catch {
      agentNameById[agentId] = agentId;
      return agentId;
    } finally {
      agentNameInflight.delete(agentId);
    }
  })();

  agentNameInflight.set(agentId, p);
  return p;
}

function formatCategoryLabel(categoryId: number): string {
  const row = allCategoriesFlat.value.find((c) => c.categoryId === categoryId);
  return row?.name || String(categoryId);
}

async function getAgentIdsForCategory(
  categoryId: number,
): Promise<Set<string>> {
  const cached = categoryAgentsCache.get(categoryId);
  if (cached) return cached;

  const res = await agentCategoryClient.getCategoryAgents(categoryId);
  const ids = new Set<string>(res.status === 0 ? (res.agentIdsList ?? []) : []);
  categoryAgentsCache.set(categoryId, ids);
  return ids;
}

async function findAgentCategories(agentId: string): Promise<number[]> {
  const cached = agentCategoryLookupCache.get(agentId);
  if (cached) return cached;

  const categoryIds = (allCategoriesFlat.value ?? []).map((c) => c.categoryId);
  if (categoryIds.length === 0) {
    agentCategoryLookupCache.set(agentId, []);
    return [];
  }

  const hits: number[] = [];
  await mapWithConcurrency(categoryIds, 10, async (categoryId) => {
    try {
      const ids = await getAgentIdsForCategory(categoryId);
      if (ids.has(agentId)) hits.push(categoryId);
    } catch {
      // игнор
    }
    return true;
  });

  agentCategoryLookupCache.set(agentId, hits);
  return hits;
}

async function calculateCollectionCompliance(
  categoryId: number,
  collectionPolicies: { id: number; name: string }[],
): Promise<{ assignedAndApplied: number; assignedNotApplied: number; notAssigned: number }> {
  if (!collectionPolicies || collectionPolicies.length === 0) {
    return { assignedAndApplied: 0, assignedNotApplied: 0, notAssigned: 0 };
  }

  const cacheKey = `${categoryId}_${collectionPolicies.map((p) => p.id).join(",")}`;
  const cached = complianceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < COMPLIANCE_CACHE_TTL) {
    return {
      assignedAndApplied: cached.assignedAndApplied,
      assignedNotApplied: cached.assignedNotApplied,
      notAssigned: cached.notAssigned
    };
  }

  try {
    const agentsRes = await agentCategoryClient.getCategoryAgents(categoryId);
    if (agentsRes.status !== 0 || !agentsRes.agentIdsList?.length) {
      return { assignedAndApplied: 0, assignedNotApplied: 0, notAssigned: collectionPolicies.length };
    }

    const agentIds = agentsRes.agentIdsList;

    const results = await mapWithConcurrency(
      agentIds,
      3,
      async (agentId: string) => {
        try {
          const target = createAgentTarget(agentId);
          if (!target) {
            return {
              assignments: [],
              effectivePolicies: [],
            };
          }

          const [assignmentsResponse, effectivePoliciesResponse] = await Promise.all([
            policyStateClient.getAssignments(target, "en-US").catch(() => ({ assignmentsList: [] })),
            policyStateClient.getEffectivePolicies(target, "en-US").catch(() => ({ policiesList: [] })),
          ]);

          return {
            assignments: assignmentsResponse.assignmentsList || [],
            effectivePolicies: effectivePoliciesResponse.policiesList || [],
          };
        } catch {
          return {
            assignments: [],
            effectivePolicies: [],
          };
        }
      },
    );

    const assignedPolicyHashes = new Set<string>();
    const effectivePolicyHashes = new Set<string>();

    for (const result of results) {
      for (const assignment of result.assignments) {
        if (assignment.summary?.id) {
          const policyId = String(assignment.summary.id);
          assignedPolicyHashes.add(policyId);
          assignedPolicyHashes.add(`policy_${policyId}`);
        }
        if (assignment.policyHash) {
          assignedPolicyHashes.add(assignment.policyHash);
        }
      }

      for (const policy of result.effectivePolicies) {
        if (policy.summary?.id) {
          const policyId = String(policy.summary.id);
          effectivePolicyHashes.add(policyId);
          effectivePolicyHashes.add(`policy_${policyId}`);
        }
        if (policy.policyHash) {
          effectivePolicyHashes.add(policy.policyHash);
        }
      }
    }

    let assignedAndApplied = 0;
    let assignedNotApplied = 0;
    let notAssigned = 0;

    for (const policy of collectionPolicies) {
      const policyIdStr = String(policy.id);
      const policyHash = `policy_${policyIdStr}`;

      const isAssigned = assignedPolicyHashes.has(policyIdStr) ||
                        assignedPolicyHashes.has(policyHash);
      const isApplied = effectivePolicyHashes.has(policyIdStr) ||
                       effectivePolicyHashes.has(policyHash);

      if (isAssigned && isApplied) {
        assignedAndApplied++;
      } else if (isAssigned && !isApplied) {
        assignedNotApplied++;
      } else {
        notAssigned++;
      }
    }

    const result = { assignedAndApplied, assignedNotApplied, notAssigned };
    complianceCache.set(cacheKey, { ...result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error("Error calculating compliance:", err);
    return { assignedAndApplied: 0, assignedNotApplied: 0, notAssigned: collectionPolicies.length };
  }
}

const deleteLoading = ref(false);
const editLoading = ref(false);
const moveLoading = ref(false);

const actionLoading = computed(
  () => deleteLoading.value || editLoading.value || moveLoading.value,
);

const showEditCategory = ref(false);
const showMoveCategory = ref(false);
const editCategoryForm = ref<{ name: string; description: string }>({
  name: "",
  description: "",
});
const moveCategoryForm = ref<{ parentId: number | null }>({ parentId: null });

const showCreateCategory = ref(false);
const createCategoryLoading = ref(false);
const createCategoryForm = ref<{
  name: string;
  description: string;
  parentId: number | null;
  maxAgents: number | null;
}>({
  name: "",
  description: "",
  parentId: null,
  maxAgents: 0,
});

function collectCategoriesFromTree(
  nodes: TreeNode[],
  list: CategoryRow[],
): void {
  for (const n of nodes) {
    const id = Number(n.id);
    if (!Number.isNaN(id)) {
      const row = allCategoriesFlat.value.find((c) => c.categoryId === id);
      if (row) list.push(row);
    }
    if (n.children?.length) {
      collectCategoriesFromTree(n.children, list);
    }
  }
}

const parentCategoryOptions = computed(() => {
  const list: CategoryRow[] = [];
  collectCategoriesFromTree(categoryTreeNodes.value, list);
  return list.map((c) => ({
    categoryId: c.categoryId,
    label: c.name || String(c.categoryId),
  }));
});

function collectCategoryIdAndDescendants(
  nodeId: number,
  nodes: TreeNode[],
  out: Set<number>,
): void {
  for (const n of nodes) {
    const id = Number(n.id);
    if (Number.isNaN(id)) continue;
    if (id === nodeId) {
      out.add(id);
      (n.children ?? []).forEach((ch) => {
        const cid = Number(ch.id);
        if (!Number.isNaN(cid)) {
          out.add(cid);
          collectCategoryIdAndDescendants(cid, ch.children ?? [], out);
        }
      });
      return;
    }
    if (n.children?.length) {
      collectCategoryIdAndDescendants(nodeId, n.children, out);
    }
  }
}

const moveParentOptions = computed(() => {
  const list: CategoryRow[] = [];
  collectCategoriesFromTree(categoryTreeNodes.value, list);
  const currentId = selectedCategoryId.value;
  if (currentId == null) {
    return list.map((c) => ({
      categoryId: c.categoryId,
      label: c.name || String(c.categoryId),
    }));
  }
  const exclude = new Set<number>([currentId]);
  collectCategoryIdAndDescendants(currentId, categoryTreeNodes.value, exclude);
  return list
    .filter((c) => !exclude.has(c.categoryId))
    .map((c) => ({
      categoryId: c.categoryId,
      label: c.name || String(c.categoryId),
    }));
});

const showAddAgentPanel = ref(false);
const showSetAgents = ref(false);
const setAgentsLoading = ref(false);
const setAgentsForm = ref<{ agentIdsText: string }>({ agentIdsText: "" });

const showApplyCollectionDialog = ref(false);
const applyCollectionLoading = ref(false);
const applyCollectionApplying = ref(false);
const applyCollectionSelectedId = ref<number | null>(null);
const applyCollectionOptions = ref<{ id: number; label: string }[]>([]);

const categoryAppliedCollections = ref<
  {
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
  }[]
>([]);
const categoryAppliedCollectionsLoading = ref(false);

const showRemoveCollectionDialog = ref(false);
const removeCollectionSelectedId = ref<number | null>(null);
const removeCollectionOptions = ref<{ id: number; label: string }[]>([]);
const removeCollectionOptionsLoading = ref(false);
const removeCollectionRemoving = ref(false);

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

const showCollectionDetailsDialog = ref(false);
const selectedCollection = ref<CollectionType | null>(null);
const policySearchQuery = ref("");

function openCollectionDetailsDialog(collection: CollectionType) {
  selectedCollection.value = collection;
  policySearchQuery.value = "";
  showCollectionDetailsDialog.value = true;
}

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

const childrenColumns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
  },
];

type ApiCategoryTreeNode = {
  categoryId: number;
  name: string;
  description: string;
  childrenList?: ApiCategoryTreeNode[];
};

function mapCategoryTreeNodeToTreeNode(
  node: ApiCategoryTreeNode,
  flatList: CategoryRow[],
): TreeNode {
  const id = node.categoryId;
  flatList.push({
    categoryId: id,
    name: node.name || "",
    description: node.description || "",
  });
  const children = (node.childrenList || []).map((child) =>
    mapCategoryTreeNodeToTreeNode(child, flatList),
  );
  return {
    id: String(id),
    label: node.name || String(id),
    isCategory: true,
    children: children.length > 0 ? children : undefined,
  };
}

function filterCategoryTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const lower = q.toLowerCase();
  const result: TreeNode[] = [];
  for (const n of nodes) {
    const matches = n.label.toLowerCase().includes(lower);
    const filteredChildren = n.children?.length
      ? filterCategoryTree(n.children, q)
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

const filteredCategoryTree = computed<TreeNode[]>(() => {
  const q = categorySearch.value.trim();
  const baseTree = q
    ? filterCategoryTree(categoryTreeNodes.value, q)
    : categoryTreeNodes.value;

  if (baseTree.length === 0) return [];

  return [
    {
      id: "__root__",
      label: "All Categories",
      isCategory: true,
      children: baseTree,
    },
  ];
});

async function loadCategories() {
  categoriesLoading.value = true;
  categoriesError.value = null;
  try {
    const res = await agentCategoryClient.getCategoryTree();
    if (res.status !== 0) {
      categoriesError.value = res.errorMessage ?? "Failed to load categories";
      return;
    }
    const roots = res.rootsList ?? [];
    const flatList: CategoryRow[] = [];
    categoryTreeNodes.value = (roots as ApiCategoryTreeNode[]).map((node) =>
      mapCategoryTreeNodeToTreeNode(node, flatList),
    );
    allCategoriesFlat.value = flatList;
  } catch (err) {
    categoriesError.value =
      err instanceof Error ? err.message : "Failed to load categories";
  } finally {
    categoriesLoading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!props.standalonePage && isOpen) loadCategories();
  },
  { immediate: true },
);

onMounted(() => {
  if (props.standalonePage) loadCategories();
});

function isMachineScope(raw: unknown): boolean {
  if (raw === undefined || raw === null) return false;
  if (typeof raw === "number") {
    const n = Math.floor(raw);
    return (
      n === operator_pb.PolicyScope.POLICY_SCOPE_MACHINE ||
      n === operator_pb.PolicyScope.POLICY_SCOPE_BOTH
    );
  }
  const s = String(raw).toUpperCase();
  return s === "MACHINE" || s === "BOTH" || s === "2" || s === "3";
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
        (o) =>
          o.id > 0 && isMachineScope(o.scope as number | string | undefined),
      )
      .map((o) => ({ id: o.id, label: o.label }));
  } catch {
    applyCollectionOptions.value = [];
  } finally {
    applyCollectionLoading.value = false;
  }
}

function confirmApplyCollectionToCategory() {
  const collectionId = applyCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    applyCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Apply collection",
    message: `Do you really want to apply the collection «${collectionLabel}» to this category?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    doApplyCollectionToCategory();
  });
}

async function doApplyCollectionToCategory() {
  const categoryId = selectedCategoryId.value;
  const collectionId = applyCollectionSelectedId.value;
  if (categoryId == null || collectionId == null) return;
  applyCollectionApplying.value = true;
  try {
    await policyAssignmentClient.assignPolicyCollection(
      collectionId,
      "agentCategory",
      { categoryId },
    );
    notifySuccess(
      `Collection applied to category "${selectedCategory.value?.name ?? categoryId}"`,
    );
    showApplyCollectionDialog.value = false;
    complianceCache.clear();
    await loadCategoryAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to apply collection",
    );
  } finally {
    applyCollectionApplying.value = false;
  }
}

function prepareRemoveCollectionOptionsForCategory() {
  removeCollectionSelectedId.value = null;
  removeCollectionOptionsLoading.value = false;
  removeCollectionOptions.value = (categoryAppliedCollections.value ?? []).map(
    (c) => ({
      id: c.id,
      label: c.name || String(c.id),
    }),
  );
}

function confirmRemoveCollectionFromCategory() {
  const collectionId = removeCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    removeCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Remove collection",
    message: `Do you really want to remove the collection «${collectionLabel}» from this category?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(() => {
    doRemoveCollectionFromCategory();
  });
}

async function doRemoveCollectionFromCategory() {
  const categoryId = selectedCategoryId.value;
  const collectionId = removeCollectionSelectedId.value;
  const categoryLabel = selectedCategory.value?.name ?? categoryId;
  if (categoryId == null || collectionId == null) return;
  removeCollectionRemoving.value = true;
  try {
    await policyAssignmentClient.removePolicyCollection(
      collectionId,
      "agentCategory",
      { categoryId },
    );
    notifySuccess(`Collection removed from category "${categoryLabel}"`);
    showRemoveCollectionDialog.value = false;
    complianceCache.clear();
    await loadCategoryAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to remove collection",
    );
  } finally {
    removeCollectionRemoving.value = false;
  }
}

function handleRemoveCollectionById(collectionId: number) {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  const collection = categoryAppliedCollections.value.find(
    (c) => c.id === collectionId,
  );
  const collectionLabel = collection?.name || String(collectionId);
  $q.dialog({
    title: "Remove collection",
    message: `Do you really want to remove the collection «${collectionLabel}» from this category?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    try {
      await policyAssignmentClient.removePolicyCollection(
        collectionId,
        "agentCategory",
        { categoryId },
      );
      notifySuccess(
        `Collection removed from category "${selectedCategory.value?.name ?? categoryId}"`,
      );
      complianceCache.clear();
      await loadCategoryAppliedCollections();
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "Failed to remove collection",
      );
    }
  });
}

async function loadCategoryAppliedCollections() {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) {
    categoryAppliedCollections.value = [];
    return;
  }
  categoryAppliedCollectionsLoading.value = true;
  categoryAppliedCollections.value = [];
  try {
    const response =
      await collectionsClient.getAppliedCollectionsByAgentCategory(
      categoryId,
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
    const raw =
      (response as { collectionsList?: CollectionItem[] }).collectionsList ??
      (response as { collections?: CollectionItem[] }).collections;
    const list = Array.isArray(raw) ? raw : [];
    categoryAppliedCollections.value = list.map((c) => {
      const rawPolicies = c.policiesList ?? c.policies ?? [];
      return {
        id: c.id ?? 0,
        name: c.name ?? String(c.id ?? ""),
        explainText:
          (c.explainText ?? c.explain_text ?? "").trim() || undefined,
        policies: rawPolicies.map((p) => ({
          id: p.id ?? 0,
          name: p.displayName ?? p.display_name ?? p.name ?? String(p.id ?? ""),
        })),
        compliance: {
          assignedAndApplied: 0,
          assignedNotApplied: 0,
          notAssigned: 0,
          loading: true,
        },
      };
    });

    await mapWithConcurrency(
      categoryAppliedCollections.value,
      3,
      async (collection) => {
        try {
          const result = await calculateCollectionCompliance(
            categoryId,
            collection.policies || [],
          );
          collection.compliance = {
            assignedAndApplied: result.assignedAndApplied,
            assignedNotApplied: result.assignedNotApplied,
            notAssigned: result.notAssigned,
            loading: false,
          };
        } catch (err) {
          console.error(
            `Failed to calculate compliance for collection ${collection.id}:`,
            err,
          );
          collection.compliance = {
            assignedAndApplied: 0,
            assignedNotApplied: 0,
            notAssigned: collection.policies?.length || 0,
            loading: false,
          };
        }
        return true;
      },
    );
  } catch {
    categoryAppliedCollections.value = [];
  } finally {
    categoryAppliedCollectionsLoading.value = false;
  }
}

function selectCategory(nodeId: string | null) {
  if (!nodeId || nodeId === "__root__") {
    selectedCategoryId.value = null;
    selectedCategoryIdKey.value = null;
    selectedCategory.value = null;
    return;
  }

  if (selectedCategoryIdKey.value === nodeId) {
    selectedCategoryId.value = null;
    selectedCategoryIdKey.value = null;
    selectedCategory.value = null;
    return;
  }

  const id = Number(nodeId);
  if (Number.isNaN(id)) return;
  const found = allCategoriesFlat.value.find((c) => c.categoryId === id);
  if (!found) return;

  selectedCategoryId.value = found.categoryId;
  selectedCategoryIdKey.value = nodeId;
  selectedCategory.value = {
    name: found.name,
    description: found.description,
  };
  detailTab.value = "agents";
  loadCategoryDetails(found.categoryId);
}

function navigateToCategory(row: CategoryRow) {
  selectedCategoryId.value = row.categoryId;
  selectedCategoryIdKey.value = String(row.categoryId);
  selectedCategory.value = {
    name: row.name,
    description: row.description,
  };
  loadCategoryDetails(row.categoryId);
}

async function loadCategoryDetails(categoryId: number) {
  detailLoading.value = true;
  categoryAgents.value = [];
  categoryChildren.value = [];

  try {
    const [agentsRes, childrenRes] = await Promise.allSettled([
      agentCategoryClient.getCategoryAgents(categoryId),
      agentCategoryClient.getCategoryChildren(categoryId),
    ]);

    if (agentsRes.status === "fulfilled") {
      const r = agentsRes.value;
      if (r.status === 0) {
        const agentIds = r.agentIdsList ?? [];
        const agentsWithNames = await mapWithConcurrency(
          agentIds,
          10,
          async (id: string) => {
            const name = await resolveAgentName(id);
            return { id, name };
          },
        );
        categoryAgents.value = agentsWithNames;
      }
    }
    if (childrenRes.status === "fulfilled") {
      const r = childrenRes.value;
      if (r.status === 0) {
        const list = r.categoriesList ?? [];
        categoryChildren.value = list.map(
          (c: {
            categoryId: number;
            info?: { name?: string; description?: { value?: string } };
          }) => ({
            categoryId: c.categoryId,
            name: c.info?.name ?? String(c.categoryId),
            description: c.info?.description?.value ?? "",
          }),
        );
      }
    }
  } finally {
    detailLoading.value = false;
    loadCategoryAppliedCollections();
  }
}

function confirmDeleteCategory() {
  if (selectedCategoryId.value == null) return;
  $q.dialog({
    title: "Delete Category",
    message: `Are you sure you want to delete category "${selectedCategory.value?.name ?? selectedCategoryId.value}"?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(doDeleteCategory);
}

async function doDeleteCategory() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  deleteLoading.value = true;
  try {
    const res = await agentCategoryClient.deleteCategory(id);
    if (res.status === 0) {
      notifySuccess("Category deleted");
      selectedCategoryId.value = null;
      selectedCategoryIdKey.value = null;
      selectedCategory.value = null;
      await loadCategories();
    } else {
      notifyError(res.errorMessage ?? "Delete failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Delete failed");
  } finally {
    deleteLoading.value = false;
  }
}

function openCreateCategoryDialog() {
  createCategoryForm.value = {
    name: "",
    description: "",
    parentId: selectedCategoryId.value ?? null,
    maxAgents: 0,
  };
  showCreateCategory.value = true;
}

async function loadCategoryForEdit() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  editLoading.value = true;
  try {
    const res = await agentCategoryClient.getCategory(id);
    if (res.status === 0 && res.category?.info) {
      const info = res.category.info;
      editCategoryForm.value = {
        name: info.name ?? selectedCategory.value?.name ?? "",
        description:
          info.description?.value ?? selectedCategory.value?.description ?? "",
      };
    }
  } finally {
    editLoading.value = false;
  }
}

function openEditCategoryDialog() {
  if (selectedCategoryId.value != null && selectedCategory.value) {
    editCategoryForm.value = {
      name: selectedCategory.value.name,
      description: selectedCategory.value.description ?? "",
    };
  }
  showEditCategory.value = true;
}

async function doUpdateCategory() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  editLoading.value = true;
  try {
    const res = await agentCategoryClient.updateCategory({
      categoryId: id,
      name: editCategoryForm.value.name.trim(),
      description: editCategoryForm.value.description.trim() || undefined,
    });
    if (res.status === 0) {
      notifySuccess("Category updated");
      showEditCategory.value = false;
      selectedCategory.value = {
        name: editCategoryForm.value.name,
        description: editCategoryForm.value.description || undefined,
      };
      await loadCategories();
      await loadCategoryDetails(id);
    } else {
      notifyError(res.errorMessage ?? "Update failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Update failed");
  } finally {
    editLoading.value = false;
  }
}

function openMoveCategoryDialog() {
  moveCategoryForm.value = {
    parentId: null,
  };
  showMoveCategory.value = true;
}

async function doSetCategoryParent() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  moveLoading.value = true;
  try {
    const res = await agentCategoryClient.setCategoryParent({
      categoryId: id,
      parentId: moveCategoryForm.value.parentId ?? null,
    });
    if (res.status === 0) {
      notifySuccess("Category moved");
      showMoveCategory.value = false;
      await loadCategories();
      selectedCategoryIdKey.value = String(id);
      await loadCategoryDetails(id);
    } else {
      notifyError(res.errorMessage ?? "Move failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Move failed");
  } finally {
    moveLoading.value = false;
  }
}

async function doCreateCategory() {
  createCategoryLoading.value = true;
  try {
    const res = await agentCategoryClient.createCategory({
      name: createCategoryForm.value.name.trim(),
      description: createCategoryForm.value.description.trim() || undefined,
      parentId: createCategoryForm.value.parentId ?? undefined,
      maxAgents: createCategoryForm.value.maxAgents ?? 0,
    });
    if (res.status === 0) {
      notifySuccess(`Category "${createCategoryForm.value.name}" created`);
      showCreateCategory.value = false;
      await loadCategories();
    } else {
      notifyError(res.errorMessage ?? "Create failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Create failed");
  } finally {
    createCategoryLoading.value = false;
  }
}

async function handleAddAgentSelect(ref: TargetRef) {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  showAddAgentPanel.value = false;
  const agentId = getSingleAgentIdFromTarget(ref.target);
  if (!agentId) {
    notifyError("Please select an agent (device) in the tree");
    return;
  }

  const agentName = await resolveAgentName(agentId);
  const agentLabel =
    agentName && agentName !== agentId ? `${agentName} (${agentId})` : agentId;

  const existingCategoryIds = (await findAgentCategories(agentId)).filter(
    (id) => id !== categoryId,
  );
  if (existingCategoryIds.length > 0) {
    const firstOtherId = existingCategoryIds[0];
    const otherLabel = formatCategoryLabel(firstOtherId);
    const targetLabel = selectedCategory.value?.name ?? String(categoryId);

    $q.dialog({
      title: "The agent is already in a different group",
      message:
        `Agent "${agentLabel}" is already a member of the "${otherLabel}" group. ` +
        `If you add it to the "${targetLabel}" group, policy conflicts may occur.\n\n` +
        "Continue adding?",
      cancel: { label: "Reject", flat: true },
      ok: { label: "Add", color: "primary" },
      persistent: true,
    }).onOk(() => {
      void (async () => {
        try {
          const res = await agentCategoryClient.addAgentToCategory({
            categoryId,
            agentId,
          });
          if (res.status === 0) {
            notifySuccess("Agent added to category");
            agentCategoryLookupCache.delete(agentId);
            categoryAgentsCache.delete(categoryId);
            await loadCategoryDetails(categoryId);
          } else {
            notifyError(res.errorMessage ?? "Failed to add agent");
          }
        } catch (err) {
          notifyError(
            err instanceof Error
              ? err.message
              : "Failed to add agent to category",
          );
        }
      })();
    });
    return;
  }

  try {
    const res = await agentCategoryClient.addAgentToCategory({
      categoryId,
      agentId,
    });
    if (res.status === 0) {
      notifySuccess("Agent added to category");
      agentCategoryLookupCache.delete(agentId);
      categoryAgentsCache.delete(categoryId);
      await loadCategoryDetails(categoryId);
    } else {
      notifyError(res.errorMessage ?? "Failed to add agent");
    }
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to add agent to category",
    );
  }
}

async function removeAgentFromCategory(agentId: string) {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;

  const agent = (categoryAgents.value ?? []).find((a) => a.id === agentId);
  const agentLabel =
    agent?.name && agent.name !== agentId
      ? `${agent.name} (${agentId})`
      : agentId;

  $q.dialog({
    title: "Remove agent",
    message: `Do you really want to remove agent «${agentLabel}» from this category?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    try {
      const res = await agentCategoryClient.removeAgentFromCategory({
        categoryId,
        agentId,
      });
      if (res.status === 0) {
        notifySuccess("Agent removed from category");
        await loadCategoryDetails(categoryId);
      } else {
        notifyError(res.errorMessage ?? "Failed to remove agent");
      }
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "Failed to remove agent",
      );
    }
  });
}

function prepareSetAgentsForm() {
  setAgentsForm.value = {
    agentIdsText: categoryAgents.value.join("\n"),
  };
}

function openSetAgentsDialog() {
  showSetAgents.value = true;
}

async function doSetCategoryAgents() {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  const agentIds = setAgentsForm.value.agentIdsText
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  setAgentsLoading.value = true;
  try {
    const res = await agentCategoryClient.setCategoryAgents({
      categoryId,
      agentIds,
    });
    if (res.status === 0) {
      notifySuccess("Agents list updated");
      showSetAgents.value = false;
      await loadCategoryDetails(categoryId);
    } else {
      notifyError(res.errorMessage ?? "Failed to set agents");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Failed to set agents");
  } finally {
    setAgentsLoading.value = false;
  }
}
</script>

<style scoped lang="sass">
.groups-machines-layout
  height: 100%
  display: flex
  flex-direction: column

.groups-manager-page
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.groups-manager-body
  flex: 1
  min-height: 0
  display: flex
  overflow: hidden

.groups-left-panel
  height: 100%
  min-height: 0
  width: 380px
  min-width: 280px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0, 0, 0, 0.08)
  overflow: hidden

.groups-left-header
  flex-shrink: 0

.groups-tree-scroll
  flex: 1 1 0
  min-height: 0
  overflow: hidden

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

.groups-tree .q-tree__node--selected > .q-tree__node-header
  background: rgba(25, 118, 210, 0.1)
  border-radius: 4px

.groups-tree-item
  padding: 1px 0

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

.body--dark .groups-left-panel
  border-right-color: rgba(255, 255, 255, 0.12)

.body--dark .policies-list-container
  border-color: rgba(255, 255, 255, 0.12)

.body--dark .policy-item:hover
  background-color: rgba(255, 255, 255, 0.06)

.body--dark .groups-tree .q-tree__node--selected > .q-tree__node-header
  background: rgba(25, 118, 210, 0.25)
</style>
