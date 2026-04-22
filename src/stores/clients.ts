import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { fetchAgents } from "@/api/agents";
import { useClientListStore } from "@/stores/clientList";

interface TreeNode {
  label: string;
  color?: string;
  icon?: string;
  raw?: string;
  id?: number | string;
  site?: Record<string, unknown>;
  agent?: {
    agent_id: string;
    hostname: string;
    status: string;
  [key: string]: unknown;
  };
  children?: TreeNode[];
  [key: string]: unknown;
}

interface AgentData {
  agent_id: string;
  hostname: string;
  status: string;
  site_id?: number;
  site?: number;
  [key: string]: unknown;
}

interface SiteApiData {
  id: number;
  name: string;
  maintenance_mode: boolean;
  agent_count: number;
  children?: SiteApiData[];
  failing_checks?: {
    error?: number;
    warning?: number;
  };
  [key: string]: unknown;
}

export const useClientsStore = defineStore("clients", () => {
  const tree = ref<unknown[]>([]);
  const treeReady = ref(false);
  const selectedTree = ref("");
  const clientTreeSort = ref("alphafail");
  const clientTreeSplitter = ref(20);

  const clientsTree = computed(() => tree.value);

  const filteredTree = computed(() => {
    const clStore = useClientListStore();
    if (clStore.showHiddenMode) {
      return (tree.value as TreeNode[]).filter((node) =>
        clStore.isHidden(node.raw || ""),
      );
    }
    return (tree.value as TreeNode[]).filter(
      (node) => !clStore.isHidden(node.raw || ""),
    );
  });

  const allClientsSelected = computed(() => !selectedTree.value);

  async function loadTree() {
    try {
      const [treeResponse, agentsData] = await Promise.all([
        axios.get("/api/v3/tree/"),
        fetchAgents({ detail: false }),
      ]);

      const data = treeResponse.data;
      if (data.length === 0) {
        treeReady.value = true;
        return;
      }

      // Group agents by site_id
      const agentsBySite = new Map<number, AgentData[]>();
      if (Array.isArray(agentsData)) {
        for (const agent of agentsData as AgentData[]) {
          const siteId = agent.site_id || agent.site;
          if (siteId !== undefined) {
            const siteIdNum =
              typeof siteId === "number" ? siteId : Number(siteId);
            if (!agentsBySite.has(siteIdNum)) {
              agentsBySite.set(siteIdNum, []);
            }
            agentsBySite.get(siteIdNum)!.push(agent);
          }
        }
      }

      function buildSiteNodes(
        sites: SiteApiData[],
        agentsBySite: Map<number, AgentData[]>,
      ): TreeNode[] {
        const nodes: TreeNode[] = [];
        for (const site of sites) {
          let childNodes: TreeNode[] = [];
          if (site.children && site.children.length > 0) {
            childNodes = buildSiteNodes(site.children, agentsBySite);
          }

          // Add agents as children
          const siteAgents = agentsBySite.get(site.id) || [];
          const agentNodes: TreeNode[] = siteAgents.map((agent) => ({
            label: agent.hostname,
            id: `agent-${agent.agent_id}`,
            raw: `Agent|${agent.agent_id}`,
            icon: "computer",
            agent: agent,
            color: agent.status === "online" ? "positive" : "grey",
          }));

          // Combine child sites and agents
          const allChildren = [...childNodes, ...agentNodes];

          const siteNode: TreeNode = {
            label: site.name,
            id: site.id,
            master_id: site.master_id,
            raw: `Site|${site.id}`,
            header: allChildren.length > 0 ? "root" : "generic",
            icon:
              childNodes.length > 0 ? "corporate_fare" : "location_on",
            selectable: true,
            site: site,
            children: allChildren.length > 0 ? allChildren : undefined,
          };

          if (site.maintenance_mode) {
            siteNode.color = "green";
          } else if (site.failing_checks?.error) {
            siteNode.color = "negative";
          } else if (site.failing_checks?.warning) {
            siteNode.color = "warning";
          }

          nodes.push(siteNode);
        }
        return nodes;
      }

      const output = buildSiteNodes(data, agentsBySite);

      const sorted = output.sort((a: TreeNode, b: TreeNode) =>
        a.label.localeCompare(b.label),
      );

      if (clientTreeSort.value === "alphafail") {
        const failing = sorted.filter(
          (i: TreeNode) => i.color === "negative" || i.color === "warning",
        );
        const ok = sorted.filter(
          (i: TreeNode) => i.color !== "negative" && i.color !== "warning",
        );
        tree.value = [...failing, ...ok];
      } else {
        tree.value = sorted;
      }

      treeReady.value = true;
    } catch {
      treeReady.value = true;
    }
  }

  function setSelectedTree(val: string) {
    selectedTree.value = val;
  }

  async function setSplitter(val: number) {
    try {
      await axios.patch("/accounts/users/ui/", {
        client_tree_splitter: Math.trunc(val),
      });
      clientTreeSplitter.value = val;
    } catch {
      // ignore
    }
  }

  return {
    tree,
    treeReady,
    selectedTree,
    clientTreeSort,
    clientTreeSplitter,
    clientsTree,
    filteredTree,
    allClientsSelected,
    loadTree,
    setSelectedTree,
    setSplitter,
  };
});
