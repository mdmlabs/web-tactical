import { ref, computed } from "vue";
import { fetchClients } from "@/api/clients";
import { fetchAgents } from "@/api/agents";
import {
  createUserGroupTargetFromParams,
  type Target,
} from "@/gpo/api/grpc-client";

export const GLOBAL_TARGET_NODE_ID = "target-global";

export interface TargetTreeNode {
  id: string;
  label: string;
  children?: TargetTreeNode[];
  targetType?: "global" | "client" | "site" | "agent";
  clientId?: string;
  siteId?: string;
  agentId?: string;
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
  if (node.targetType === "client") return "business";
  if (node.targetType === "site") return "location_on";
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

function buildAgentsBySiteMap(agents: Array<Record<string, unknown>>) {
  const agentsBySite = new Map<string, Array<{ agent_id: string; hostname: string }>>();
  for (const a of agents) {
    const clientVal = getStringValue(a.client) || getStringValue(a.client_name);
    const siteVal = getStringValue(a.site) || getStringValue(a.site_name);
    const key = `${clientVal}::${siteVal}`;
    if (!agentsBySite.has(key)) agentsBySite.set(key, []);
    const agentId = getStringValue(a.agent_id) || getStringValue(a.id);
    const hostname = getStringValue(a.hostname) || "—";
    agentsBySite.get(key)!.push({ agent_id: agentId, hostname });
  }
  return agentsBySite;
}

function buildSiteNode(
  site: { id: number; name: string },
  clientId: string,
  clientName: string,
  agentsBySite: Map<string, Array<{ agent_id: string; hostname: string }>>,
): TargetTreeNode {
  const siteId = String(site.id);
  const siteKey = `${clientName}::${site.name}`;
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
}

function buildClientNode(
  client: { id: number; name: string; sites?: Array<{ id: number; name: string }> },
  agentsBySite: Map<string, Array<{ agent_id: string; hostname: string }>>,
): TargetTreeNode {
  const clientId = String(client.id);
  const sites = client.sites ?? [];
  const siteNodes = sites.map((site) =>
    buildSiteNode(site, clientId, client.name, agentsBySite),
  );
  return {
    id: `client-${clientId}`,
    label: client.name,
    targetType: "client" as const,
    clientId,
    children: siteNodes.length > 0 ? siteNodes : undefined,
  };
}

export function useTargetSelection() {
  const targetTreeNodes = ref<TargetTreeNode[]>([]);
  const targetTreeLoading = ref(false);
  const targetSelectedId = ref<string | null>(null);
  const targetTickedIds = ref<string[]>([]);
  const currentTargetRef = ref<TargetRef | null>(null);

  const currentTarget = computed(() => currentTargetRef.value?.target ?? null);
  const targetLabel = computed(
    () => currentTargetRef.value?.label ?? "Select target",
  );

  const canApplyTarget = computed(() => {
    if (targetTickedIds.value.length > 0) return true;
    return targetSelectedId.value != null;
  });

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
      } else if (rawAgents && typeof rawAgents === "object" && "results" in rawAgents) {
        agents = ((rawAgents as { results: unknown[] }).results || []) as Array<Record<string, unknown>>;
      }
      const agentsBySite = buildAgentsBySiteMap(agents);
      const clientNodes = clients.map((client) =>
        buildClientNode(client, agentsBySite),
      );
      const globalNode: TargetTreeNode = {
        id: GLOBAL_TARGET_NODE_ID,
        label: "Global",
        targetType: "global",
      };
      targetTreeNodes.value = [globalNode, ...clientNodes];
    } catch (e) {
      console.error("Load target tree failed:", e);
    } finally {
      targetTreeLoading.value = false;
    }
  }

  function buildTargetFromSingleNode(): TargetRef | null {
    const id = targetSelectedId.value;
    console.log("[TargetSelection] buildTargetFromSingleNode - selectedId:", id);
    if (!id) return null;
    const node = findTargetNodeById(targetTreeNodes.value, id);
    if (!node?.targetType) return null;
    let result: TargetRef | null = null;
    if (node.targetType === "global") {
      result = {
        target: createUserGroupTargetFromParams("global"),
        label: "Global",
      };
    } else if (node.targetType === "client" && node.clientId) {
      result = {
        target: createUserGroupTargetFromParams("client", {
          clientId: node.clientId,
        }),
        label: `Client: ${node.label}`,
      };
    } else if (node.targetType === "site" && node.siteId) {
      result = {
        target: createUserGroupTargetFromParams("site", { siteId: node.siteId }),
        label: `Site: ${node.label}`,
      };
    } else if (node.targetType === "agent" && node.agentId) {
      result = {
        target: createUserGroupTargetFromParams("agent", {
          agentId: node.agentId,
        }),
        label: `Agent: ${node.label}`,
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

  function buildCombinedTargetFromTicked(): TargetRef | null {
    const ids = targetTickedIds.value;
    console.log("[TargetSelection] buildCombinedTargetFromTicked - tickedIds:", ids);
    if (ids.length === 0) return null;
    if (ids.length === 1 && ids[0] === GLOBAL_TARGET_NODE_ID) {
      return {
        target: createUserGroupTargetFromParams("global"),
        label: "Global",
      };
    }
    const clientIds: string[] = [];
    const siteIds: string[] = [];
    const agentIds: string[] = [];
    const labels: string[] = [];
    for (const id of ids) {
      if (id === GLOBAL_TARGET_NODE_ID) continue;
      const node = findTargetNodeById(targetTreeNodes.value, id);
      if (!node?.targetType) continue;
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

  function applyTargetSelection(): boolean {
    console.log("[TargetSelection] applyTargetSelection called");
    const combined = buildCombinedTargetFromTicked();
    if (combined) {
      console.log("[TargetSelection] Applied COMBINED target:", combined.label);
      currentTargetRef.value = combined;
      return true;
    }
    const single = buildTargetFromSingleNode();
    if (single) {
      console.log("[TargetSelection] Applied SINGLE target:", single.label);
      currentTargetRef.value = single;
      return true;
    }
    console.log("[TargetSelection] No target applied");
    return false;
  }

  function resetSelection() {
    targetSelectedId.value = null;
    targetTickedIds.value = [];
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
    getTargetNodeIcon,
    findTargetNodeById,
    loadTargetTree,
    buildTargetFromSingleNode,
    buildCombinedTargetFromTicked,
    applyTargetSelection,
    resetSelection,
    onDialogShow,
  };
}
