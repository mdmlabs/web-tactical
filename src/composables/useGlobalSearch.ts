import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import axios from "axios";

interface SearchResultAgent {
  agent_id: string;
  hostname: string;
  ancestors?: string;
}

interface SearchResultPolicy {
  id: number;
  name: string;
}

interface GroupedResults {
  agents: SearchResultAgent[];
  policies: SearchResultPolicy[];
  scripts: Array<{ id: number; name: string }>;
  resources: Array<{ id: number; name: string }>;
}

/**
 * Debounced global search across agents, policies, scripts, resources.
 */
export function useGlobalSearch() {
  const query = ref("");
  const results = ref<GroupedResults>({
    agents: [],
    policies: [],
    scripts: [],
    resources: [],
  });
  const loading = ref(false);

  async function search() {
    const q = query.value.trim();
    if (!q || q.length < 2) {
      results.value = { agents: [], policies: [], scripts: [], resources: [] };
      return;
    }

    loading.value = true;
    try {
      const [agentsRes] = await Promise.allSettled([
        axios.get(`/agents/?detail=false`),
      ]);

      if (agentsRes.status === "fulfilled") {
        const agentData = agentsRes.value.data as Array<{
          agent_id: string;
          hostname: string;
          ancestors?: string;
        }>;
        const ql = q.toLowerCase();
        results.value.agents = agentData
          .filter(
            (a) =>
              a.hostname.toLowerCase().includes(ql) ||
              (a.ancestors && a.ancestors.toLowerCase().includes(ql)),
          )
          .slice(0, 8)
          .map((a) => ({
            agent_id: a.agent_id,
            hostname: a.hostname,
            ancestors: a.ancestors,
          }));
      }
    } catch {
      // search is best-effort
    } finally {
      loading.value = false;
    }
  }

  const debouncedSearch = useDebounceFn(search, 300);

  watch(query, () => {
    debouncedSearch();
  });

  return { query, results, loading };
}
