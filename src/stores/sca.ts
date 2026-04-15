import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import type { WazuhSCAPolicy, WazuhSCACheck } from "@/types/wazuh";
import type { OpenSearchQueryBody } from "@/types/fim";

export interface SCAFilter {
  id: string;
  field: string;
  operator: "is" | "is_not" | "exists" | "does_not_exist";
  value?: string;
  enabled: boolean;
  negated: boolean;
}

export interface SCAEvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

export const useScaStore = defineStore("sca", () => {
  // === Core state ===
  const selectedAgentId = ref<string | null>(null);
  const activeTab = ref<"dashboard" | "inventory" | "events">("dashboard");

  // === Dashboard state ===
  const policies = ref<WazuhSCAPolicy[]>([]);
  const dashboardLoading = ref(false);

  // === Inventory state ===
  const selectedPolicyId = ref<string | null>(null);
  const checks = ref<WazuhSCACheck[]>([]);
  const checksTotal = ref(0);
  const inventoryLoading = ref(false);
  const inventorySearch = ref("");

  // === Events state ===
  const events = ref<SCAEvent[]>([]);
  const eventsTotal = ref(0);
  const eventsLoading = ref(false);
  const eventsPagination = ref({ page: 1, rowsPerPage: 15 });
  const eventsSearch = ref("");
  const eventsDateRange = ref<string>("24h");
  const eventsFilters = ref<SCAFilter[]>([]);
  const indexerAvailable = ref(true);

  // === Getters ===
  const hasAgent = computed(() => !!selectedAgentId.value);

  const policyOptions = computed(() =>
    policies.value.map((p) => ({
      label: p.name,
      value: p.policy_id,
    })),
  );

  const filteredChecks = computed(() => {
    if (!inventorySearch.value.trim()) return checks.value;
    const q = inventorySearch.value.trim().toLowerCase();
    return checks.value.filter(
      (c) =>
        String(c.id).includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.result?.toLowerCase().includes(q),
    );
  });

  const dateRangeQuery = computed(() => {
    const now = new Date();
    const to = now.toISOString();
    const presetMs: Record<string, number> = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    const ms = presetMs[eventsDateRange.value] ?? presetMs["24h"];
    const from = new Date(now.getTime() - ms).toISOString();
    return { from, to };
  });

  // === Actions ===
  function setAgent(agentId: string | null) {
    selectedAgentId.value = agentId;
    selectedPolicyId.value = null;
    checks.value = [];
    policies.value = [];
    events.value = [];
    if (agentId) {
      refreshActiveTab();
    }
  }

  function setActiveTab(tab: "dashboard" | "inventory" | "events") {
    activeTab.value = tab;
    refreshActiveTab();
  }

  function refreshActiveTab() {
    switch (activeTab.value) {
      case "dashboard":
        fetchPolicies();
        break;
      case "inventory":
        if (selectedAgentId.value) fetchPolicies().then(() => {
          if (!selectedPolicyId.value && policies.value.length) {
            selectedPolicyId.value = policies.value[0].policy_id;
          }
          if (selectedPolicyId.value) fetchChecks();
        });
        break;
      case "events":
        fetchEvents();
        break;
    }
  }

  // === Dashboard: fetch SCA policies ===
  async function fetchPolicies() {
    if (!selectedAgentId.value) return;
    dashboardLoading.value = true;
    try {
      const wazuhStore = useWazuhStore();
      wazuhStore._registerApi();
      const response = await wazuhApi.getSCA(selectedAgentId.value);
      policies.value = response.data.affected_items;
    } catch (e) {
      console.error("[SCA] Policies fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load SCA policies",
        timeout: 3000,
      });
    } finally {
      dashboardLoading.value = false;
    }
  }

  // === Inventory: fetch SCA checks ===
  async function fetchChecks() {
    if (!selectedAgentId.value || !selectedPolicyId.value) return;
    inventoryLoading.value = true;
    try {
      const wazuhStore = useWazuhStore();
      wazuhStore._registerApi();
      const response = await wazuhApi.getSCAChecks(
        selectedAgentId.value,
        selectedPolicyId.value,
      );
      checks.value = response.data.affected_items;
      checksTotal.value = response.data.total_affected_items;
    } catch (e) {
      console.error("[SCA] Checks fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load SCA checks",
        timeout: 3000,
      });
    } finally {
      inventoryLoading.value = false;
    }
  }

  function selectPolicy(policyId: string) {
    selectedPolicyId.value = policyId;
    checks.value = [];
    inventorySearch.value = "";
    fetchChecks();
  }

  // === Events: fetch from Wazuh Indexer ===
  async function fetchEvents() {
    eventsLoading.value = true;
    try {
      const must: Record<string, unknown>[] = [
        { match: { "rule.groups": "sca" } },
        {
          range: {
            "@timestamp": {
              gte: dateRangeQuery.value.from,
              lte: dateRangeQuery.value.to,
            },
          },
        },
      ];

      if (selectedAgentId.value) {
        must.push({ match: { "agent.id": selectedAgentId.value } });
      }

      for (const f of eventsFilters.value) {
        if (!f.enabled) continue;
        const clause = filterToClause(f);
        if (clause) must.push(clause);
      }

      if (eventsSearch.value.trim()) {
        must.push({ query_string: { query: eventsSearch.value.trim() } });
      }

      const from =
        (eventsPagination.value.page - 1) * eventsPagination.value.rowsPerPage;

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: eventsPagination.value.rowsPerPage,
        from,
        sort: [{ "@timestamp": { order: "desc" } }],
      };

      const resp = await wazuhIndexerApi.search<SCAEvent>("wazuh-alerts-*", body);

      events.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source,
      }));
      eventsTotal.value = resp.hits.total.value;
      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[SCA] Events fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load SCA events from Indexer",
        timeout: 3000,
      });
    } finally {
      eventsLoading.value = false;
    }
  }

  function filterToClause(f: SCAFilter): Record<string, unknown> | null {
    let clause: Record<string, unknown> | null = null;
    switch (f.operator) {
      case "is":
        clause = { match: { [f.field]: f.value } };
        break;
      case "is_not":
        clause = { bool: { must_not: [{ match: { [f.field]: f.value } }] } };
        break;
      case "exists":
        clause = { exists: { field: f.field } };
        break;
      case "does_not_exist":
        clause = { bool: { must_not: [{ exists: { field: f.field } }] } };
        break;
    }
    if (clause && f.negated) {
      clause = { bool: { must_not: [clause] } };
    }
    return clause;
  }

  function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  function addFilter(filter: Omit<SCAFilter, "id">) {
    eventsFilters.value.push({ ...filter, id: generateId() });
    fetchEvents();
  }

  function removeFilter(id: string) {
    eventsFilters.value = eventsFilters.value.filter((f) => f.id !== id);
    fetchEvents();
  }

  function clearFilters() {
    eventsFilters.value = [];
    fetchEvents();
  }

  function setEventsPage(page: number) {
    eventsPagination.value.page = page;
    fetchEvents();
  }

  function setEventsRowsPerPage(rpp: number) {
    eventsPagination.value.rowsPerPage = rpp;
    eventsPagination.value.page = 1;
    fetchEvents();
  }

  function setEventsDateRange(range: string) {
    eventsDateRange.value = range;
    eventsPagination.value.page = 1;
    fetchEvents();
  }

  function setEventsSearch(q: string) {
    eventsSearch.value = q;
    eventsPagination.value.page = 1;
    fetchEvents();
  }

  // === Export inventory data ===
  function exportChecksCSV() {
    const rows = filteredChecks.value;
    if (!rows.length) return;

    const policy = policies.value.find((p) => p.policy_id === selectedPolicyId.value);
    const header = ["ID", "Title", "Description", "Result", "Remediation"];
    const csvRows = [
      header.join(","),
      ...rows.map((c) =>
        [
          c.id,
          `"${(c.title ?? "").replace(/"/g, '""')}"`,
          `"${(c.description ?? "").replace(/"/g, '""')}"`,
          c.result,
          `"${(c.remediation ?? "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sca-checks-${policy?.name ?? selectedPolicyId.value}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    // State
    selectedAgentId,
    activeTab,
    policies,
    dashboardLoading,
    selectedPolicyId,
    checks,
    checksTotal,
    inventoryLoading,
    inventorySearch,
    events,
    eventsTotal,
    eventsLoading,
    eventsPagination,
    eventsSearch,
    eventsDateRange,
    eventsFilters,
    indexerAvailable,

    // Getters
    hasAgent,
    policyOptions,
    filteredChecks,
    dateRangeQuery,

    // Actions
    setAgent,
    setActiveTab,
    refreshActiveTab,
    fetchPolicies,
    fetchChecks,
    selectPolicy,
    fetchEvents,
    addFilter,
    removeFilter,
    clearFilters,
    setEventsPage,
    setEventsRowsPerPage,
    setEventsDateRange,
    setEventsSearch,
    exportChecksCSV,
  };
});
