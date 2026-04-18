import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import { wazuhApi } from "@/api/wazuh";
import { useWazuhStore } from "@/stores/wazuh";
import type {
  PCIDSSFilter,
  PCIDSSEvent,
  PCIDSSDashboardAggs,
  PCIDSSRequirementCount,
  PCIDSSTrendBucket,
  PCIDSSSelectedAgent,
  PCIDSSRuleGroupCount,
  PCIDSSRuleCount,
  PCIDSSRuleLevelCount,
  OpenSearchQueryBody,
} from "@/types/pciDss";
import type { WazuhSCACheck, WazuhAgent } from "@/types/wazuh";

export const usePciDssStore = defineStore("pciDss", () => {
  // === Core state ===
  const activeTab = ref<"dashboard" | "controls" | "events">("dashboard");
  const selectedRequirement = ref<string | null>(null);
  const dateRange = ref<string>("24h");
  const indexerAvailable = ref(true);

  // === Global agent selection ===
  const selectedAgent = ref<PCIDSSSelectedAgent | null>(null);
  const agentsList = ref<WazuhAgent[]>([]);
  const agentsListLoading = ref(false);

  // === Dashboard state ===
  const dashboardAggs = ref<PCIDSSDashboardAggs | null>(null);
  const dashboardLoading = ref(false);

  // === Controls state ===
  const requirementCounts = ref<PCIDSSRequirementCount[]>([]);
  const controlsLoading = ref(false);
  const controlsSearch = ref("");
  const controlsHideNoAlerts = ref(false);

  // === Requirement detail state ===
  const detailEvents = ref<PCIDSSEvent[]>([]);
  const detailEventsTotal = ref(0);
  const detailEventsLoading = ref(false);
  const detailEventsPagination = ref({ page: 1, rowsPerPage: 20 });
  const detailSCAChecks = ref<WazuhSCACheck[]>([]);
  const detailSCALoading = ref(false);
  const detailSubTab = ref<"events" | "sca">("events");

  // === Events state ===
  const events = ref<PCIDSSEvent[]>([]);
  const eventsTotal = ref(0);
  const eventsLoading = ref(false);
  const eventsPagination = ref({ page: 1, rowsPerPage: 20 });
  const eventsSearch = ref("");
  const eventsFilters = ref<PCIDSSFilter[]>([]);
  const eventsHistogramData = ref<
    { key: number; key_as_string: string; doc_count: number }[]
  >([]);
  const eventsHistogramLoading = ref(false);

  // === Document inspection state ===
  const inspectedEvent = ref<PCIDSSEvent | null>(null);
  const showDetailPanel = ref(false);
  const surroundingEvents = ref<PCIDSSEvent[]>([]);
  const surroundingEventsLoading = ref(false);
  const showRawJson = ref(false);

  // === Getters ===
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
    const ms = presetMs[dateRange.value] ?? presetMs["24h"];
    const from = new Date(now.getTime() - ms).toISOString();
    return { from, to };
  });

  const groupedRequirementCounts = computed(() => {
    const map = new Map<string, number>();
    for (const rc of requirementCounts.value) {
      const parentId = rc.requirement.split(".")[0];
      map.set(parentId, (map.get(parentId) ?? 0) + rc.doc_count);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([requirement, doc_count]) => ({ requirement, doc_count }));
  });

  const filteredRequirementCounts = computed(() => {
    const q = controlsSearch.value.trim().toLowerCase();
    if (!q) return requirementCounts.value;
    return requirementCounts.value.filter((r) =>
      r.requirement.toLowerCase().includes(q),
    );
  });

  const hasAgent = computed(() => selectedAgent.value !== null);

  // === Shared query builder ===
  function buildBaseMusts(): Record<string, unknown>[] {
    const must: Record<string, unknown>[] = [
      { exists: { field: "rule.pci_dss" } },
      {
        range: {
          "@timestamp": {
            gte: dateRangeQuery.value.from,
            lte: dateRangeQuery.value.to,
          },
        },
      },
    ];
    // Add agent filter if selected
    if (selectedAgent.value) {
      must.push({ match: { "agent.id": selectedAgent.value.id } });
    }
    return must;
  }

  function buildEventsMusts(): Record<string, unknown>[] {
    const must = buildBaseMusts();

    if (selectedRequirement.value) {
      must.push({ match: { "rule.pci_dss": selectedRequirement.value } });
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

  // === Actions ===
  function setActiveTab(tab: "dashboard" | "controls" | "events") {
    activeTab.value = tab;
    refreshActiveTab();
  }

  function setDateRange(range: string) {
    dateRange.value = range;
    refreshActiveTab();
  }

  function refreshActiveTab() {
    switch (activeTab.value) {
      case "dashboard":
        fetchDashboard();
        break;
      case "controls":
        fetchRequirementCounts();
        break;
      case "events":
        fetchEvents();
        break;
    }
  }

  // === Agent selection ===
  async function fetchAgentsList() {
    agentsListLoading.value = true;
    try {
      const wazuhStore = useWazuhStore();
      wazuhStore._registerApi();
      const response = await wazuhApi.getAgents({ limit: 1000 });
      agentsList.value = response.data.affected_items.filter(
        (a) => a.id !== "000",
      );
    } catch (e) {
      console.error("[PCI DSS] Failed to fetch agents list:", e);
    } finally {
      agentsListLoading.value = false;
    }
  }

  function setSelectedAgent(agent: PCIDSSSelectedAgent | null) {
    selectedAgent.value = agent;
    // Reset state and reload all tabs
    refreshActiveTab();
  }

  function selectRequirement(reqId: string | null) {
    selectedRequirement.value = reqId;
    detailEvents.value = [];
    detailEventsTotal.value = 0;
    detailEventsPagination.value.page = 1;
    detailSCAChecks.value = [];
    detailSubTab.value = "events";
    if (reqId) {
      fetchDetailEvents();
      fetchDetailSCA();
    }
  }

  function clearRequirementSelection() {
    selectedRequirement.value = null;
    detailEvents.value = [];
    detailSCAChecks.value = [];
  }

  // === Dashboard fetch ===
  async function fetchDashboard() {
    dashboardLoading.value = true;
    try {
      const must = buildBaseMusts();
      const agentId = selectedAgent.value?.id ?? null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs: Record<string, any> = {
        top_requirements: {
          terms: { field: "rule.pci_dss", size: agentId ? 5 : 10 },
        },
        trend: {
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
            by_requirement: {
              terms: { field: "rule.pci_dss", size: 5 },
            },
          },
        },
      };

      if (!agentId) {
        // Global view: add top agents
        aggs.top_agents = {
          terms: { field: "agent.name", size: 10 },
          aggs: {
            agent_id: { terms: { field: "agent.id", size: 1 } },
          },
        };
      } else {
        // Agent-specific view: add rule groups, top rules, rule level distribution
        aggs.top_rule_groups = {
          terms: { field: "rule.groups", size: 5 },
        };
        aggs.top_rules = {
          terms: { field: "rule.id", size: 5 },
          aggs: {
            rule_desc: {
              terms: { field: "rule.description.keyword", size: 1 },
            },
            rule_desc_fallback: {
              terms: { field: "rule.description", size: 1 },
            },
          },
        };
        aggs.rule_level_dist = {
          terms: { field: "rule.level", size: 20 },
        };
      }

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: 0,
        aggs,
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const respAggs = resp.aggregations as any;

      const topRequirements: PCIDSSRequirementCount[] = (
        respAggs?.top_requirements?.buckets ?? []
      ).map((b: { key: string; doc_count: number }) => ({
        requirement: b.key,
        doc_count: b.doc_count,
      }));

      const trend: PCIDSSTrendBucket[] = (
        respAggs?.trend?.buckets ?? []
      ).map(
        (b: {
          key: number;
          key_as_string: string;
          doc_count: number;
          by_requirement: { buckets: { key: string; doc_count: number }[] };
        }) => ({
          key: b.key,
          key_as_string: b.key_as_string,
          doc_count: b.doc_count,
          by_requirement: b.by_requirement,
        }),
      );

      const result: PCIDSSDashboardAggs = {
        topRequirements,
        topAgents: [],
        trend,
        totalAlerts: resp.hits.total.value,
      };

      if (!agentId) {
        // Global view: parse top agents
        result.topAgents = (respAggs?.top_agents?.buckets ?? []).map(
          (b: {
            key: string;
            doc_count: number;
            agent_id: { buckets: { key: string }[] };
          }) => ({
            agent_name: b.key,
            agent_id: b.agent_id?.buckets?.[0]?.key ?? "",
            doc_count: b.doc_count,
          }),
        );
      } else {
        // Agent-specific view
        result.topRuleGroups = (
          respAggs?.top_rule_groups?.buckets ?? []
        ).map((b: { key: string; doc_count: number }) => ({
          group: b.key,
          doc_count: b.doc_count,
        })) as PCIDSSRuleGroupCount[];

        result.topRules = (respAggs?.top_rules?.buckets ?? []).map(
          (b: {
            key: string;
            doc_count: number;
            rule_desc: { buckets: { key: string }[] };
            rule_desc_fallback: { buckets: { key: string }[] };
          }) => ({
            rule_id: String(b.key),
            description:
              b.rule_desc?.buckets?.[0]?.key ??
              b.rule_desc_fallback?.buckets?.[0]?.key ??
              `Rule ${b.key}`,
            doc_count: b.doc_count,
          }),
        ) as PCIDSSRuleCount[];

        const levelBuckets = respAggs?.rule_level_dist?.buckets ?? [];
        const totalLevelCount = levelBuckets.reduce(
          (sum: number, b: { doc_count: number }) => sum + b.doc_count,
          0,
        );
        result.ruleLevelDistribution = levelBuckets.map(
          (b: { key: number; doc_count: number }) => ({
            level: b.key,
            doc_count: b.doc_count,
            percentage:
              totalLevelCount > 0
                ? Math.round((b.doc_count / totalLevelCount) * 10000) / 100
                : 0,
          }),
        ) as PCIDSSRuleLevelCount[];
      }

      dashboardAggs.value = result;
      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[PCI DSS] Dashboard fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load PCI DSS dashboard data",
        timeout: 3000,
      });
    } finally {
      dashboardLoading.value = false;
    }
  }

  // === Controls: fetch all requirement counts ===
  async function fetchRequirementCounts() {
    controlsLoading.value = true;
    try {
      const must = buildBaseMusts();

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: 0,
        aggs: {
          all_requirements: {
            terms: { field: "rule.pci_dss", size: 200 },
          },
        },
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs = resp.aggregations as any;

      requirementCounts.value = (
        aggs?.all_requirements?.buckets ?? []
      ).map((b: { key: string; doc_count: number }) => ({
        requirement: b.key,
        doc_count: b.doc_count,
      }));

      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[PCI DSS] Controls fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load PCI DSS requirements",
        timeout: 3000,
      });
    } finally {
      controlsLoading.value = false;
    }
  }

  // === Events: fetch ===
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

      const resp = await wazuhIndexerApi.search<PCIDSSEvent>(
        "wazuh-alerts-*",
        body,
      );

      events.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source,
      }));
      eventsTotal.value = resp.hits.total.value;
      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[PCI DSS] Events fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load PCI DSS events",
        timeout: 3000,
      });
    } finally {
      eventsLoading.value = false;
    }
  }

  // === Events histogram ===
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const agg = resp.aggregations?.events_over_time as any;
      eventsHistogramData.value = agg?.buckets ?? [];
    } catch (e) {
      console.error("[PCI DSS] Histogram fetch error:", e);
    } finally {
      eventsHistogramLoading.value = false;
    }
  }

  // === Requirement detail: events ===
  async function fetchDetailEvents() {
    if (!selectedRequirement.value) return;
    detailEventsLoading.value = true;
    try {
      const must: Record<string, unknown>[] = [
        { match: { "rule.pci_dss": selectedRequirement.value } },
        {
          range: {
            "@timestamp": {
              gte: dateRangeQuery.value.from,
              lte: dateRangeQuery.value.to,
            },
          },
        },
      ];

      if (selectedAgent.value) {
        must.push({ match: { "agent.id": selectedAgent.value.id } });
      }

      const from =
        (detailEventsPagination.value.page - 1) *
        detailEventsPagination.value.rowsPerPage;

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: detailEventsPagination.value.rowsPerPage,
        from,
        sort: [{ "@timestamp": { order: "desc" } }],
      };

      const resp = await wazuhIndexerApi.search<PCIDSSEvent>(
        "wazuh-alerts-*",
        body,
      );

      detailEvents.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source,
      }));
      detailEventsTotal.value = resp.hits.total.value;
    } catch (e) {
      console.error("[PCI DSS] Detail events fetch error:", e);
    } finally {
      detailEventsLoading.value = false;
    }
  }

  // === Requirement detail: SCA checks ===
  async function fetchDetailSCA() {
    if (!selectedRequirement.value) return;
    detailSCALoading.value = true;
    try {
      const wazuhStore = useWazuhStore();
      wazuhStore._registerApi();

      let agents: WazuhAgent[];
      if (selectedAgent.value) {
        // Only fetch SCA for selected agent
        agents = agentsList.value.filter(
          (a) => a.id === selectedAgent.value!.id && a.status === "active",
        );
      } else {
        agents = wazuhStore.wazuhAgents.filter(
          (a) => a.id !== "000" && a.status === "active",
        );
      }

      const allChecks: WazuhSCACheck[] = [];

      const results = await Promise.allSettled(
        agents.map(async (agent) => {
          const policiesResp = await wazuhApi.getSCA(agent.id);
          const policies = policiesResp.data.affected_items;
          const agentChecks: WazuhSCACheck[] = [];

          for (const policy of policies) {
            const checksResp = await wazuhApi.getSCAChecks(
              agent.id,
              policy.policy_id,
            );
            for (const check of checksResp.data.affected_items) {
              if (check.compliance) {
                const hasPciMatch = check.compliance.some(
                  (c) =>
                    c.key === "pci_dss" &&
                    c.value === selectedRequirement.value,
                );
                if (hasPciMatch) {
                  agentChecks.push(check);
                }
              }
            }
          }
          return agentChecks;
        }),
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          allChecks.push(...r.value);
        }
      }

      detailSCAChecks.value = allChecks;
    } catch (e) {
      console.error("[PCI DSS] SCA checks fetch error:", e);
    } finally {
      detailSCALoading.value = false;
    }
  }

  // === Document inspection ===
  function inspectDocument(event: PCIDSSEvent) {
    inspectedEvent.value = event;
    showDetailPanel.value = true;
    showRawJson.value = false;
    surroundingEvents.value = [];
  }

  function closeInspection() {
    showDetailPanel.value = false;
    inspectedEvent.value = null;
    surroundingEvents.value = [];
    showRawJson.value = false;
  }

  async function fetchSurroundingEvents() {
    if (!inspectedEvent.value) return;
    surroundingEventsLoading.value = true;
    try {
      const src = inspectedEvent.value._source as Record<string, unknown>;
      const ts = (src["@timestamp"] as string) ?? (src["timestamp"] as string);
      if (!ts) return;

      const must: Record<string, unknown>[] = [
        { exists: { field: "rule.pci_dss" } },
      ];

      if (selectedAgent.value) {
        must.push({ match: { "agent.id": selectedAgent.value.id } });
      }

      // Fetch 5 before and 5 after
      const [beforeResp, afterResp] = await Promise.all([
        wazuhIndexerApi.search<PCIDSSEvent>("wazuh-alerts-*", {
          query: {
            bool: {
              must: [
                ...must,
                { range: { "@timestamp": { lt: ts } } },
              ],
            },
          },
          size: 5,
          sort: [{ "@timestamp": { order: "desc" } }],
        }),
        wazuhIndexerApi.search<PCIDSSEvent>("wazuh-alerts-*", {
          query: {
            bool: {
              must: [
                ...must,
                { range: { "@timestamp": { gt: ts } } },
              ],
            },
          },
          size: 5,
          sort: [{ "@timestamp": { order: "asc" } }],
        }),
      ]);

      const before = (beforeResp.hits.hits ?? [])
        .map((h) => ({ _id: h._id, _index: h._index, _source: h._source }))
        .reverse();
      const after = (afterResp.hits.hits ?? []).map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source,
      }));

      surroundingEvents.value = [...before, inspectedEvent.value, ...after];
    } catch (e) {
      console.error("[PCI DSS] Surrounding events fetch error:", e);
    } finally {
      surroundingEventsLoading.value = false;
    }
  }

  // === Filter helpers ===
  function filterToClause(f: PCIDSSFilter): Record<string, unknown> | null {
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

  function addFilter(filter: Omit<PCIDSSFilter, "id">) {
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

  function setEventsSearch(q: string) {
    eventsSearch.value = q;
    eventsPagination.value.page = 1;
    fetchEvents();
  }

  function setDetailEventsPage(page: number) {
    detailEventsPagination.value.page = page;
    fetchDetailEvents();
  }

  // === Export data as JSON ===
  function exportDashboardJSON(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        dateRange: dateRange.value,
        selectedAgent: selectedAgent.value,
        dashboard: dashboardAggs.value,
        requirementCounts: requirementCounts.value,
      },
      null,
      2,
    );
  }

  return {
    // State
    activeTab,
    selectedRequirement,
    dateRange,
    indexerAvailable,
    selectedAgent,
    agentsList,
    agentsListLoading,
    dashboardAggs,
    dashboardLoading,
    requirementCounts,
    controlsLoading,
    controlsSearch,
    controlsHideNoAlerts,
    detailEvents,
    detailEventsTotal,
    detailEventsLoading,
    detailEventsPagination,
    detailSCAChecks,
    detailSCALoading,
    detailSubTab,
    events,
    eventsTotal,
    eventsLoading,
    eventsPagination,
    eventsSearch,
    eventsFilters,
    eventsHistogramData,
    eventsHistogramLoading,
    inspectedEvent,
    showDetailPanel,
    surroundingEvents,
    surroundingEventsLoading,
    showRawJson,

    // Getters
    dateRangeQuery,
    groupedRequirementCounts,
    filteredRequirementCounts,
    hasAgent,

    // Actions
    setActiveTab,
    setDateRange,
    refreshActiveTab,
    fetchAgentsList,
    setSelectedAgent,
    selectRequirement,
    clearRequirementSelection,
    fetchDashboard,
    fetchRequirementCounts,
    fetchEvents,
    fetchEventsHistogram,
    fetchDetailEvents,
    fetchDetailSCA,
    addFilter,
    removeFilter,
    clearFilters,
    setEventsPage,
    setEventsRowsPerPage,
    setEventsSearch,
    setDetailEventsPage,
    inspectDocument,
    closeInspection,
    fetchSurroundingEvents,
    exportDashboardJSON,
  };
});
