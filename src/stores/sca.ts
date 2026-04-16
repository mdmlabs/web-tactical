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

  // === Document inspection state ===
  const inspectedEvent = ref<SCAEvent | null>(null);
  const inspectedEventLoading = ref(false);
  const surroundingDocs = ref<{ newer: SCAEvent[]; older: SCAEvent[] }>({ newer: [], older: [] });
  const surroundingDocsLoading = ref(false);
  const singleDocument = ref<Record<string, unknown> | null>(null);
  const singleDocumentLoading = ref(false);
  const showDetailPanel = ref(false);
  const showSurroundingPanel = ref(false);
  const showSingleDocPanel = ref(false);

  // === Histogram state ===
  const eventsHistogramData = ref<
    { key: number; key_as_string: string; doc_count: number }[]
  >([]);
  const eventsHistogramLoading = ref(false);

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

  /** Navigate from Dashboard to Inventory tab with a specific policy pre-selected */
  function navigateToPolicyInventory(policyId: string) {
    selectedPolicyId.value = policyId;
    checks.value = [];
    inventorySearch.value = "";
    activeTab.value = "inventory";
    fetchChecks();
  }

  // === Shared query builder for events ===
  function buildEventsMusts(): Record<string, unknown>[] {
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

    return must;
  }

  // === Events: fetch from Wazuh Indexer ===
  async function fetchEvents() {
    eventsLoading.value = true;
    fetchEventsHistogram();
    try {
      const must = buildEventsMusts();

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

  // === Histogram: fetch 30-minute aggregation from Wazuh Indexer ===
  async function fetchEventsHistogram() {
    eventsHistogramLoading.value = true;
    try {
      const must = buildEventsMusts();

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: 0,
        aggs: {
          events_over_time: {
            date_histogram: {
              field: "@timestamp",
              fixed_interval: "30m",
              min_doc_count: 0,
              extended_bounds: {
                min: dateRangeQuery.value.from,
                max: dateRangeQuery.value.to,
              },
            },
          },
        },
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);

      const agg = resp.aggregations?.events_over_time as
        | {
            buckets: {
              key: number;
              key_as_string: string;
              doc_count: number;
            }[];
          }
        | undefined;

      eventsHistogramData.value = agg?.buckets ?? [];
    } catch (e) {
      console.error("[SCA] Histogram fetch error:", e);
    } finally {
      eventsHistogramLoading.value = false;
    }
  }

  // === Document inspection actions ===

  /** Open the "Inspect document details" panel for a given event */
  function inspectDocument(event: SCAEvent) {
    inspectedEvent.value = event;
    showDetailPanel.value = true;
    showSurroundingPanel.value = false;
    showSingleDocPanel.value = false;
  }

  /** Fetch full document from indexer and show single document view */
  async function viewSingleDocument(event: SCAEvent) {
    singleDocumentLoading.value = true;
    showSingleDocPanel.value = true;
    showDetailPanel.value = false;
    showSurroundingPanel.value = false;
    inspectedEvent.value = event;
    try {
      const resp = await wazuhIndexerApi.getDocument<Record<string, unknown>>(
        event._index,
        event._id,
      );
      singleDocument.value = {
        _index: resp._index,
        _id: resp._id,
        _source: resp._source,
      };
    } catch (e) {
      console.error("[SCA] Single document fetch error:", e);
      Notify.create({ type: "negative", message: "Failed to fetch document", timeout: 3000 });
      singleDocument.value = null;
    } finally {
      singleDocumentLoading.value = false;
    }
  }

  /** Fetch N documents before and after a given event by timestamp */
  async function viewSurroundingDocuments(event: SCAEvent, count = 5) {
    surroundingDocsLoading.value = true;
    showSurroundingPanel.value = true;
    showDetailPanel.value = false;
    showSingleDocPanel.value = false;
    inspectedEvent.value = event;
    try {
      const timestamp =
        (event._source["@timestamp"] as string) ??
        (event._source["timestamp"] as string);

      // Fetch newer documents (after the target event)
      const newerBody: OpenSearchQueryBody = {
        query: {
          bool: {
            must: [
              { range: { "@timestamp": { gt: timestamp } } },
            ],
            filter: [
              { term: { _index: event._index } },
            ],
          },
        },
        size: count,
        sort: [{ "@timestamp": { order: "asc" } }],
      };

      // Fetch older documents (before the target event)
      const olderBody: OpenSearchQueryBody = {
        query: {
          bool: {
            must: [
              { range: { "@timestamp": { lt: timestamp } } },
            ],
            filter: [
              { term: { _index: event._index } },
            ],
          },
        },
        size: count,
        sort: [{ "@timestamp": { order: "desc" } }],
      };

      const [newerResp, olderResp] = await Promise.all([
        wazuhIndexerApi.search<SCAEvent>(event._index, newerBody),
        wazuhIndexerApi.search<SCAEvent>(event._index, olderBody),
      ]);

      surroundingDocs.value = {
        newer: newerResp.hits.hits.map((h) => ({
          _id: h._id,
          _index: h._index,
          _source: h._source,
        })),
        older: olderResp.hits.hits.map((h) => ({
          _id: h._id,
          _index: h._index,
          _source: h._source,
        })),
      };
    } catch (e) {
      console.error("[SCA] Surrounding docs fetch error:", e);
      Notify.create({ type: "negative", message: "Failed to fetch surrounding documents", timeout: 3000 });
      surroundingDocs.value = { newer: [], older: [] };
    } finally {
      surroundingDocsLoading.value = false;
    }
  }

  /** Close all inspection panels */
  function closeInspection() {
    showDetailPanel.value = false;
    showSurroundingPanel.value = false;
    showSingleDocPanel.value = false;
    inspectedEvent.value = null;
    singleDocument.value = null;
    surroundingDocs.value = { newer: [], older: [] };
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
    eventsHistogramData,
    eventsHistogramLoading,

    // Document inspection state
    inspectedEvent,
    inspectedEventLoading,
    surroundingDocs,
    surroundingDocsLoading,
    singleDocument,
    singleDocumentLoading,
    showDetailPanel,
    showSurroundingPanel,
    showSingleDocPanel,

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
    navigateToPolicyInventory,
    fetchEvents,
    fetchEventsHistogram,
    addFilter,
    removeFilter,
    clearFilters,
    setEventsPage,
    setEventsRowsPerPage,
    setEventsDateRange,
    setEventsSearch,
    exportChecksCSV,

    // Document inspection actions
    inspectDocument,
    viewSingleDocument,
    viewSurroundingDocuments,
    closeInspection,
  };
});
