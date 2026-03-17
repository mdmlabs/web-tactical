import { ref, computed, watch } from "vue";
import { fetchAgents } from "@/api/agents";
import {
  agentCategoryClient,
  createUserGroupTargetFromParams,
  type Target,
} from "@/gpo/api/grpc-client";

export interface AgentPanelItem {
  agentId: string;
  label: string;
}

export const GLOBAL_TARGET_NODE_ID = "target-global";
export const UNGROUPED_AGENTS_NODE_ID = "target-ungrouped-agents";

export interface TargetTreeNode {
  id: string;
  label: string;
  children?: TargetTreeNode[];
  targetType?: "global" | "agent" | "agentCategory" | "ungroupedAgents";
  clientId?: string;
  siteId?: string;
  agentId?: string;
  categoryId?: number;
}

export interface TargetRef {
  target: Target;
  label: string;
}

function getStringValue(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return "";
}

function getTargetNodeIcon(node: TargetTreeNode): string {
  if (node.targetType === "global") return "public";
  if (node.targetType === "agentCategory") return "category";
  if (node.targetType === "ungroupedAgents") return "person_off";
  if (node.targetType === "agent") return "computer";
  return "folder";
}

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

function collectAgentNodes(nodes: TargetTreeNode[]): TargetTreeNode[] {
  const result: TargetTreeNode[] = [];
  for (const n of nodes) {
    if (n.targetType === "agent") result.push(n);
    if (n.children?.length) result.push(...collectAgentNodes(n.children));
  }
  return result;
}

type AgentCategoryTreeNode = {
  categoryId: number;
  name: string;
  description?: string;
  childrenList?: AgentCategoryTreeNode[];
};

function mapAgentCategoryTreeNodeToTargetNode(
  node: AgentCategoryTreeNode,
): TargetTreeNode {
  const id = node.categoryId;
  const subCategoryNodes = (node.childrenList ?? []).map((child) =>
    mapAgentCategoryTreeNodeToTargetNode(child),
  );
  return {
    id: `agent-category-${id}`,
    label: node.name || String(id),
    targetType: "agentCategory",
    categoryId: id,
    children: subCategoryNodes.length > 0 ? subCategoryNodes : undefined,
  };
}

export function useTargetSelection() {
  const targetTreeNodes = ref<TargetTreeNode[]>([]);
  const targetTreeLoading = ref(false);
  const targetSelectedId = ref<string | null>(null);
  const targetTickedIds = ref<string[]>([]);
  const currentTargetRef = ref<TargetRef | null>(null);

  const agentIdToHostnameMap = ref<Map<string, string>>(new Map());
  const agentsPanelList = ref<AgentPanelItem[]>([]);
  const agentsPanelLoading = ref(false);
  const agentsInCategoryIds = ref<Set<string>>(new Set());
  const selectedAgentInPanel = ref<string | null>(null);

  const currentTarget = computed(() => currentTargetRef.value?.target ?? null);
  const targetLabel = computed(
    () => currentTargetRef.value?.label ?? "Select target",
  );

  const selectedCategoryId = computed(() => {
    const id = targetSelectedId.value;
    if (!id) return null;
    const node = findTargetNodeById(targetTreeNodes.value, id);
    return node?.targetType === "agentCategory" && node.categoryId != null
      ? node.categoryId
      : null;
  });

  const selectedUngroupedAgents = computed(
    () => targetSelectedId.value === UNGROUPED_AGENTS_NODE_ID,
  );

  const canApplyTarget = computed(() => {
    if (selectedAgentInPanel.value != null) return true;
    const id = targetSelectedId.value;
    if (id == null) return false;
    if (id === UNGROUPED_AGENTS_NODE_ID) return false;
    return true;
  });

  const agentNodesOnly = computed(() =>
    collectAgentNodes(targetTreeNodes.value),
  );

  async function loadAgentsForCategory(categoryId: number) {
    agentsPanelLoading.value = true;
    selectedAgentInPanel.value = null;
    agentsPanelList.value = [];
    try {
      const r = await agentCategoryClient.getAgentsInSubtree(categoryId);
      const agentIds = r.agentIdsList ?? [];
      const hostnameMap = agentIdToHostnameMap.value;

      if (agentIds.length > 0) {
        agentsPanelList.value = agentIds.map((agentId) => ({
          agentId,
          label: hostnameMap.get(agentId) || agentId,
        }));
        agentsInCategoryIds.value = new Set(agentIds);
      } else {
        agentsInCategoryIds.value = new Set();
      }
    } finally {
      agentsPanelLoading.value = false;
    }
  }

  function loadAgentsNotInAnyGroup() {
    loadAllAgents(false);
  }

  function loadAgentsForSelectedCategory() {
    if (selectedUngroupedAgents.value) {
      loadAgentsNotInAnyGroup();
      return;
    }
    const catId = selectedCategoryId.value;
    if (catId == null) {
      agentsPanelList.value = [];
      selectedAgentInPanel.value = null;
      agentsInCategoryIds.value = new Set();
    } else {
      loadAgentsForCategory(catId);
    }
  }

  async function loadAllAgents(mergeWithCurrent = false) {
    agentsPanelLoading.value = true;
    if (!mergeWithCurrent) {
      selectedAgentInPanel.value = null;
      agentsPanelList.value = [];
      agentsInCategoryIds.value = new Set();
    }
    try {
      const raw = await fetchAgents({ detail: false }).catch(() => null);
      let list: Array<Record<string, unknown>> = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && typeof raw === "object" && "results" in raw) {
        list = ((raw as { results: unknown[] }).results || []) as Array<
          Record<string, unknown>
        >;
      }
      const newItems: AgentPanelItem[] = list.map((a) => {
        const agentId = getStringValue(a.agent_id) || getStringValue(a.id);
        const label = getStringValue(a.hostname) || agentId;
        return { agentId, label };
      });

      if (mergeWithCurrent && agentsPanelList.value.length > 0) {
        const existingIds = new Set(
          agentsPanelList.value.map((a) => a.agentId),
        );
        const toAdd = newItems.filter((a) => !existingIds.has(a.agentId));
        agentsPanelList.value = [...agentsPanelList.value, ...toAdd];
      } else {
        agentsPanelList.value = newItems;
      }
    } finally {
      agentsPanelLoading.value = false;
    }
  }

  watch(targetSelectedId, () => {
    loadAgentsForSelectedCategory();
  });

  function selectAgentInPanel(agentId: string | null) {
    selectedAgentInPanel.value = agentId;
  }

  async function loadTargetTree() {
    targetTreeLoading.value = true;
    targetTreeNodes.value = [];
    try {
      const [agentsData, categoriesData] = await Promise.all([
        fetchAgents({ detail: false }).catch(() => null),
        agentCategoryClient.getCategoryTree().catch(() => null),
      ]);
      const rawAgents = agentsData ?? [];
      let agents: Array<Record<string, unknown>> = [];
      if (Array.isArray(rawAgents)) {
        agents = rawAgents as Array<Record<string, unknown>>;
      } else if (
        rawAgents &&
        typeof rawAgents === "object" &&
        "results" in rawAgents
      ) {
        agents = ((rawAgents as { results: unknown[] }).results || []) as Array<
          Record<string, unknown>
        >;
      }

      const map = new Map<string, string>();
      for (const a of agents) {
        const agentId = getStringValue(a.agent_id) || getStringValue(a.id);
        const hostname = getStringValue(a.hostname);
        if (agentId && hostname) map.set(agentId, hostname);
      }
      agentIdToHostnameMap.value = map;

      let categoryRootNode: TargetTreeNode | null = null;
      if (categoriesData && typeof categoriesData === "object") {
        const roots =
          (categoriesData as { rootsList?: AgentCategoryTreeNode[] })
            .rootsList ?? [];
        if (Array.isArray(roots) && roots.length > 0) {
          const categoryChildren = roots.map((r) =>
            mapAgentCategoryTreeNodeToTargetNode(r),
          );
          categoryRootNode = {
            id: "agent-categories-root",
            label: "Agent categories",
            children: categoryChildren,
          };
        }
      }
      const globalNode: TargetTreeNode = {
        id: GLOBAL_TARGET_NODE_ID,
        label: "Global",
        targetType: "global",
      };
      const ungroupedNode: TargetTreeNode = {
        id: UNGROUPED_AGENTS_NODE_ID,
        label: "All agents",
        targetType: "ungroupedAgents",
      };
      targetTreeNodes.value = [
        globalNode,
        ...(categoryRootNode ? [categoryRootNode] : []),
        ungroupedNode,
      ];
    } catch (e) {
      console.error("Load target tree failed:", e);
    } finally {
      targetTreeLoading.value = false;
    }
  }

  function buildTargetFromSingleNode(): TargetRef | null {
    const id = targetSelectedId.value;
    console.log(
      "[TargetSelection] buildTargetFromSingleNode - selectedId:",
      id,
    );
    if (!id) return null;
    const node = findTargetNodeById(targetTreeNodes.value, id);
    if (!node?.targetType) return null;
    let result: TargetRef | null = null;
    if (node.targetType === "global") {
      result = {
        target: createUserGroupTargetFromParams("global"),
        label: "Global",
      };
    } else if (node.targetType === "agent" && node.agentId) {
      result = {
        target: createUserGroupTargetFromParams("agent", {
          agentId: node.agentId,
        }),
        label: `Agent: ${node.label}`,
      };
    } else if (
      node.targetType === "agentCategory" &&
      node.categoryId !== undefined &&
      node.categoryId !== null
    ) {
      result = {
        target: createUserGroupTargetFromParams("agentCategory", {
          categoryId: node.categoryId,
        }),
        label: `Agent category: ${node.label}`,
      };
    }
    if (result) {
      console.log("[TargetSelection] Single target built:", {
        type: node.targetType,
        node,
        targetObject: result.target.toObject(),
      });
    }
    return result;
  }

  function collectCombinedParts(ids: string[]): {
    clientIds: string[];
    siteIds: string[];
    agentIds: string[];
    labels: string[];
    hasAgentCategory: boolean;
  } {
    const clientIds: string[] = [];
    const siteIds: string[] = [];
    const agentIds: string[] = [];
    const labels: string[] = [];
    let hasAgentCategory = false;
    for (const id of ids) {
      if (id === GLOBAL_TARGET_NODE_ID) continue;
      const node = findTargetNodeById(targetTreeNodes.value, id);
      if (!node?.targetType) continue;
      if (node.targetType === "agent" && node.agentId) {
        agentIds.push(node.agentId);
        labels.push(node.label);
      } else if (node.targetType === "agentCategory") {
        hasAgentCategory = true;
      }
    }
    return { clientIds, siteIds, agentIds, labels, hasAgentCategory };
  }

  function buildCombinedTargetFromTicked(): TargetRef | null {
    const ids = targetTickedIds.value;
    console.log(
      "[TargetSelection] buildCombinedTargetFromTicked - tickedIds:",
      ids,
    );
    if (ids.length === 0) return null;
    if (ids.length === 1 && ids[0] === GLOBAL_TARGET_NODE_ID) {
      return {
        target: createUserGroupTargetFromParams("global"),
        label: "Global",
      };
    }
    const { clientIds, siteIds, agentIds, labels, hasAgentCategory } =
      collectCombinedParts(ids);
    if (hasAgentCategory) {
      console.warn(
        "[TargetSelection] agentCategory nodes в комбинированной цели сейчас не поддерживаются и будут проигнорированы",
      );
    }
    if (clientIds.length === 0 && siteIds.length === 0 && agentIds.length === 0)
      return null;
    const target = createUserGroupTargetFromParams("combined", {
      clientIds,
      siteIds,
      agentIds,
    });
    console.log("[TargetSelection] Combined target built:", {
      clientIds,
      siteIds,
      agentIds,
      targetObject: target.toObject(),
    });
    return {
      target,
      label: labels.length ? `Combined: ${labels.join(", ")}` : "Combined",
    };
  }

  function buildTargetForApply(): TargetRef | null {
    const agentId = selectedAgentInPanel.value;
    if (agentId) {
      const item = agentsPanelList.value.find((a) => a.agentId === agentId);
      return {
        target: createUserGroupTargetFromParams("agent", { agentId }),
        label: item ? `Agent: ${item.label}` : `Agent: ${agentId}`,
      };
    }
    return buildTargetFromSingleNode();
  }

  function applyTargetSelection(): boolean {
    const ref = buildTargetForApply();
    if (ref) {
      currentTargetRef.value = ref;
      return true;
    }
    return false;
  }

  function resetSelection() {
    targetSelectedId.value = null;
    targetTickedIds.value = [];
    selectedAgentInPanel.value = null;
    agentsPanelList.value = [];
    agentsInCategoryIds.value = new Set();
  }

  function onDialogShow() {
    resetSelection();
    loadTargetTree();
  }

  return {
    targetTreeNodes,
    targetTreeLoading,
    targetSelectedId,
    targetTickedIds,
    currentTargetRef,
    currentTarget,
    targetLabel,
    canApplyTarget,
    agentNodesOnly,
    getTargetNodeIcon,
    findTargetNodeById,
    loadTargetTree,
    buildTargetFromSingleNode,
    buildTargetForApply,
    buildCombinedTargetFromTicked,
    applyTargetSelection,
    resetSelection,
    onDialogShow,
    agentIdToHostnameMap,
    agentsPanelList,
    agentsPanelLoading,
    agentsInCategoryIds,
    selectedAgentInPanel,
    selectedCategoryId,
    selectedUngroupedAgents,
    loadAgentsForCategory,
    loadAgentsForSelectedCategory,
    loadAgentsNotInAnyGroup,
    loadAllAgents,
    selectAgentInPanel,
  };
}
