import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

interface TreeNode {
  label: string;
  color?: string;
  [key: string]: unknown;
}

interface SiteApiData {
  id: number;
  name: string;
  maintenance_mode: boolean;
  agent_count: number;
  children?: SiteApiData[];
  failing_checks?: {
    error?: boolean;
    warning?: boolean;
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
  const allClientsSelected = computed(() => !selectedTree.value);

  async function loadTree() {
    try {
      const { data } = await axios.get("/api/v3/tree/");

      if (data.length === 0) {
        treeReady.value = true;
        return;
      }

      function buildSiteNodes(sites: SiteApiData[]): TreeNode[] {
        const nodes: TreeNode[] = [];
        for (const site of sites) {
          let childNodes: TreeNode[] = [];
          if (site.children && site.children.length > 0) {
            childNodes = buildSiteNodes(site.children);
          }

          const siteNode: Record<string, unknown> = {
            label: site.name,
            id: site.id,
            raw: `Site|${site.id}`,
            header: childNodes.length > 0 ? "root" : "generic",
            icon: childNodes.length > 0 ? "corporate_fare" : "business_center",
            selectable: true,
            site: site,
          };

          if (childNodes.length > 0) {
            siteNode.children = childNodes;
          }

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

      const output = buildSiteNodes(data);

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
    allClientsSelected,
    loadTree,
    setSelectedTree,
    setSplitter,
  };
});
