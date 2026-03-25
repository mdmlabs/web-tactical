import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

interface TreeNode {
  label: string;
  color?: string;
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
      const { data } = await axios.get("/clients/");

      if (data.length === 0) {
        treeReady.value = true;
        return;
      }

      const output: TreeNode[] = [];
      for (const client of data) {
        const childSites: TreeNode[] = [];
        for (const site of client.sites) {
          const siteNode: Record<string, unknown> = {
            label: site.name,
            id: site.id,
            raw: `Site|${site.id}`,
            header: "generic",
            icon: "business_center",
            selectable: true,
            site: site,
          };

          if (site.maintenance_mode) {
            siteNode.color = "green";
          } else if (site.failing_checks.error) {
            siteNode.color = "negative";
          } else if (site.failing_checks.warning) {
            siteNode.color = "warning";
          }

          childSites.push(siteNode);
        }

        const clientNode: Record<string, unknown> = {
          label: client.name,
          id: client.id,
          raw: `Client|${client.id}`,
          header: "root",
          icon: "corporate_fare",
          children: childSites,
          client: client,
        };

        if (client.maintenance_mode) clientNode.color = "green";
        else if (client.failing_checks.error) {
          clientNode.color = "negative";
        } else if (client.failing_checks.warning) {
          clientNode.color = "warning";
        }

        output.push(clientNode);
      }

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
