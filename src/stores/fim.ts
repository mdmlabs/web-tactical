import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import type {
  FIMFilter,
  FIMDateRange,
  FIMDashboardAggs,
  FIMEvent,
  OpenSearchQueryBody,
} from "@/types/fim";
import type { WazuhSyscheckEntry } from "@/types/wazuh";

export const useFimStore = defineStore("fim", () => {
  // === Core state ===
  const selectedAgentId = ref<string | null>(null);
  const activeTab = ref<"dashboard" | "inventory" | "events">("dashboard");
  const filters = ref<FIMFilter[]>([]);
  const dateRange = ref<FIMDateRange>({ type: "preset", preset: "24h" });
  const searchQuery = ref("");

  // === Dashboard state ===
  const dashboardAggs = ref<FIMDashboardAggs | null>(null);
  const dashboardLoading = ref(false);

  // === Inventory state ===
  const inventoryFiles = ref<WazuhSyscheckEntry[]>([]);
  const inventoryRegistryEntries = ref<WazuhSyscheckEntry[]>([]);
  const inventoryLoading = ref(false);
  const inventorySubTab = ref<"files" | "registry">("files");
  const inventorySearch = ref("");
  const inventoryTotalFiles = ref(0);
  const inventoryTotalRegistry = ref(0);
  const selectedFile = ref<WazuhSyscheckEntry | null>(null);

  // === Events state ===
  const events = ref<FIMEvent[]>([]);
  const eventsTotal = ref(0);
  const eventsLoading = ref(false);
  const eventsTimeline = ref<
    { timestamp: string; count: number }[]
  >([]);
  const eventsPagination = ref({ page: 1, rowsPerPage: 15 });
  const selectedEvent = ref<FIMEvent | null>(null);

  // === Indexer availability ===
  const indexerAvailable = ref(true);

  // === Getters ===
  const hasAgent = computed(() => !!selectedAgentId.value);

  const dateRangeQuery = computed(() => {
    const now = new Date();
    const to = now.toISOString();

    if (dateRange.value.type === "custom" && dateRange.value.from && dateRange.value.to) {
      return { from: dateRange.value.from, to: dateRange.value.to };
    }

    const presetMs: Record<string, number> = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    const ms = presetMs[dateRange.value.preset ?? "24h"] ?? presetMs["24h"];
    const from = new Date(now.getTime() - ms).toISOString();
    return { from, to };
  });

  const baseQuery = computed(() => {
    const must: Record<string, unknown>[] = [
      { match: { "rule.groups": "syscheck" } },
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

    // Apply enabled, non-negated filters
    for (const f of filters.value) {
      if (!f.enabled) continue;
      const clause = filterToClause(f);
      if (clause) must.push(clause);
    }

    if (searchQuery.value.trim()) {
      must.push({ query_string: { query: searchQuery.value.trim() } });
    }

    return { bool: { must } };
  });

  // === Helpers ===
  function filterToClause(f: FIMFilter): Record<string, unknown> | null {
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
      case "is_one_of":
        clause = { terms: { [f.field]: f.values ?? [] } };
        break;
      case "is_not_one_of":
        clause = { bool: { must_not: [{ terms: { [f.field]: f.values ?? [] } }] } };
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

  // === Actions ===
  function setAgent(agentId: string | null) {
    selectedAgentId.value = agentId;
    refreshActiveTab();
  }

  function setActiveTab(tab: "dashboard" | "inventory" | "events") {
    activeTab.value = tab;
  }

  function setDateRange(range: FIMDateRange) {
    dateRange.value = range;
    if (activeTab.value === "dashboard") fetchDashboardAggs();
    if (activeTab.value === "events") fetchEvents();
  }

  function setSearchQuery(q: string) {
    searchQuery.value = q;
  }

  function refreshActiveTab() {
    switch (activeTab.value) {
      case "dashboard":
        fetchDashboardAggs();
        break;
      case "inventory":
        if (selectedAgentId.value) fetchInventory();
        break;
      case "events":
        fetchEvents();
        break;
    }
  }

  // === Filter management ===
  function addFilter(filter: Omit<FIMFilter, "id">) {
    filters.value.push({ ...filter, id: generateId() });
    refreshActiveTab();
  }

  function removeFilter(id: string) {
    filters.value = filters.value.filter((f) => f.id !== id);
    refreshActiveTab();
  }

  function toggleFilter(id: string) {
    const f = filters.value.find((f) => f.id === id);
    if (f) {
      f.enabled = !f.enabled;
      refreshActiveTab();
    }
  }

  function toggleFilterNegation(id: string) {
    const f = filters.value.find((f) => f.id === id);
    if (f) {
      f.negated = !f.negated;
      refreshActiveTab();
    }
  }

  function pinFilter(id: string) {
    const f = filters.value.find((f) => f.id === id);
    if (f) f.pinned = !f.pinned;
  }

  function clearFilters() {
    filters.value = [];
    refreshActiveTab();
  }

  function enableAllFilters() {
    filters.value.forEach((f) => (f.enabled = true));
    refreshActiveTab();
  }

  function disableAllFilters() {
    filters.value.forEach((f) => (f.enabled = false));
    refreshActiveTab();
  }

  function pinAllFilters() {
    filters.value.forEach((f) => (f.pinned = true));
  }

  function unpinAllFilters() {
    filters.value.forEach((f) => (f.pinned = false));
  }

  function invertInclusion() {
    filters.value.forEach((f) => (f.negated = !f.negated));
    refreshActiveTab();
  }

  function invertEnabled() {
    filters.value.forEach((f) => (f.enabled = !f.enabled));
    refreshActiveTab();
  }

  // === Dashboard fetch ===
  async function fetchDashboardAggs() {
    dashboardLoading.value = true;
    try {
      const body: OpenSearchQueryBody = {
        query: baseQuery.value,
        size: 0,
        aggs: {
          active_users: {
            terms: { field: "syscheck.uname", size: 10 },
          },
          actions: {
            terms: { field: "syscheck.event", size: 10 },
          },
          events_timeline: {
            date_histogram: {
              field: "@timestamp",
              fixed_interval: "30m",
              min_doc_count: 0,
              extended_bounds: {
                min: dateRangeQuery.value.from,
                max: dateRangeQuery.value.to,
              },
            },
            aggs: {
              by_event: {
                terms: { field: "syscheck.event", size: 5 },
              },
            },
          },
          files_added: {
            filter: { term: { "syscheck.event": "added" } },
            aggs: {
              top_paths: { terms: { field: "syscheck.path", size: 5 } },
            },
          },
          files_modified: {
            filter: { term: { "syscheck.event": "modified" } },
            aggs: {
              top_paths: { terms: { field: "syscheck.path", size: 5 } },
            },
          },
          files_deleted: {
            filter: { term: { "syscheck.event": "deleted" } },
            aggs: {
              top_paths: { terms: { field: "syscheck.path", size: 5 } },
            },
          },
        },
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);
      const aggs = resp.aggregations as Record<string, unknown> | undefined;
      if (!aggs) {
        dashboardAggs.value = null;
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = aggs as any;

      dashboardAggs.value = {
        activeUsers: (a.active_users?.buckets ?? []).map(
          (b: { key: string; doc_count: number }) => ({
            name: b.key,
            count: b.doc_count,
          }),
        ),
        actions: (a.actions?.buckets ?? []).map(
          (b: { key: string; doc_count: number }) => ({
            event: b.key,
            count: b.doc_count,
          }),
        ),
        eventsTimeline: (a.events_timeline?.buckets ?? []).map(
          (b: {
            key_as_string: string;
            by_event: { buckets: { key: string; doc_count: number }[] };
          }) => {
            const events: Record<string, number> = { added: 0, modified: 0, deleted: 0 };
            for (const eb of b.by_event?.buckets ?? []) {
              events[eb.key] = eb.doc_count;
            }
            return {
              timestamp: b.key_as_string,
              added: events.added,
              modified: events.modified,
              deleted: events.deleted,
            };
          },
        ),
        filesAdded: (a.files_added?.top_paths?.buckets ?? []).map(
          (b: { key: string; doc_count: number }) => ({
            path: b.key,
            count: b.doc_count,
          }),
        ),
        filesModified: (a.files_modified?.top_paths?.buckets ?? []).map(
          (b: { key: string; doc_count: number }) => ({
            path: b.key,
            count: b.doc_count,
          }),
        ),
        filesDeleted: (a.files_deleted?.top_paths?.buckets ?? []).map(
          (b: { key: string; doc_count: number }) => ({
            path: b.key,
            count: b.doc_count,
          }),
        ),
      };

      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("FIM Dashboard fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load FIM Dashboard data from Indexer",
        timeout: 3000,
      });
    } finally {
      dashboardLoading.value = false;
    }
  }

  // === Inventory fetch ===
  async function fetchInventory() {
    if (!selectedAgentId.value) return;
    inventoryLoading.value = true;
    try {
      const wazuhStore = useWazuhStore();
      wazuhStore._registerApi();

      // Fetch files
      const filesResp = await wazuhApi.getSyscheck(selectedAgentId.value, {
        type: "file",
        limit: 500,
        offset: 0,
      });
      inventoryFiles.value = filesResp.data?.affected_items ?? [];
      inventoryTotalFiles.value =
        filesResp.data?.total_affected_items ?? inventoryFiles.value.length;

      // Fetch registry
      const regResp = await wazuhApi.getSyscheck(selectedAgentId.value, {
        type: "registry_key",
        limit: 500,
        offset: 0,
      });
      inventoryRegistryEntries.value = regResp.data?.affected_items ?? [];
      inventoryTotalRegistry.value =
        regResp.data?.total_affected_items ?? inventoryRegistryEntries.value.length;
    } catch (e) {
      console.error("FIM Inventory fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load FIM Inventory data",
        timeout: 3000,
      });
    } finally {
      inventoryLoading.value = false;
    }
  }

  // === Events fetch ===
  async function fetchEvents() {
    eventsLoading.value = true;
    try {
      const from =
        (eventsPagination.value.page - 1) * eventsPagination.value.rowsPerPage;

      const body: OpenSearchQueryBody = {
        query: baseQuery.value,
        size: eventsPagination.value.rowsPerPage,
        from,
        sort: [{ "@timestamp": { order: "desc" } }] as Record<string, unknown>[],
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

      const resp = await wazuhIndexerApi.search<FIMEvent>("wazuh-alerts-*", body);

      events.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source,
      }));
      eventsTotal.value = resp.hits.total.value;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs = resp.aggregations as any;
      eventsTimeline.value = (aggs?.events_over_time?.buckets ?? []).map(
        (b: { key_as_string: string; doc_count: number }) => ({
          timestamp: b.key_as_string,
          count: b.doc_count,
        }),
      );

      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("FIM Events fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load FIM Events from Indexer",
        timeout: 3000,
      });
    } finally {
      eventsLoading.value = false;
    }
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

  return {
    // State
    selectedAgentId,
    activeTab,
    filters,
    dateRange,
    searchQuery,
    dashboardAggs,
    dashboardLoading,
    inventoryFiles,
    inventoryRegistryEntries,
    inventoryLoading,
    inventorySubTab,
    inventorySearch,
    inventoryTotalFiles,
    inventoryTotalRegistry,
    selectedFile,
    events,
    eventsTotal,
    eventsLoading,
    eventsTimeline,
    eventsPagination,
    selectedEvent,
    indexerAvailable,

    // Getters
    hasAgent,
    dateRangeQuery,
    baseQuery,

    // Actions
    setAgent,
    setActiveTab,
    setDateRange,
    setSearchQuery,
    refreshActiveTab,
    addFilter,
    removeFilter,
    toggleFilter,
    toggleFilterNegation,
    pinFilter,
    clearFilters,
    enableAllFilters,
    disableAllFilters,
    pinAllFilters,
    unpinAllFilters,
    invertInclusion,
    invertEnabled,
    fetchDashboardAggs,
    fetchInventory,
    fetchEvents,
    setEventsPage,
    setEventsRowsPerPage,
  };
});
