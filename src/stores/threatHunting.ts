import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import type { OpenSearchQueryBody } from "@/types/fim";

// === Types ===

export interface ThreatHuntingEvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

export type ThreatHuntingFilterOperator = "is" | "is_not" | "exists" | "does_not_exist";

export interface ThreatHuntingFilter {
  id: string;
  field: string;
  operator: ThreatHuntingFilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

interface DashboardMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  authFailure: number;
  authSuccess: number;
}

interface HistogramBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
}

interface TermBucket {
  key: string | number;
  doc_count: number;
}

interface TimeBucketWithSub {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_sub: { buckets: TermBucket[] };
}

export interface DashboardAggs {
  metrics: DashboardMetrics;
  alertLevelEvolution: TimeBucketWithSub[];
  mitreTactics: TermBucket[];
  topAgentsEvolution: TimeBucketWithSub[];
}

export const THREAT_HUNTING_KNOWN_FIELDS: string[] = [
  "@timestamp",
  "rule.level",
  "rule.id",
  "rule.description",
  "rule.groups",
  "rule.mitre.tactic",
  "rule.mitre.technique",
  "rule.mitre.id",
  "rule.pci_dss",
  "rule.gdpr",
  "rule.hipaa",
  "rule.nist_800_53",
  "agent.id",
  "agent.name",
  "agent.ip",
  "manager.name",
  "decoder.name",
  "location",
  "full_log",
];

export const useThreatHuntingStore = defineStore("threatHunting", () => {
  // === Core state ===
  const activeTab = ref<"dashboard" | "events">("dashboard");
  const dateRange = ref<string>("24h");
  const indexerAvailable = ref(true);

  // === Dashboard state ===
  const dashboardAggs = ref<DashboardAggs | null>(null);
  const dashboardLoading = ref(false);

  // === Events state ===
  const events = ref<ThreatHuntingEvent[]>([]);
  const eventsTotal = ref(0);
  const eventsLoading = ref(false);
  const eventsPagination = ref({ page: 1, rowsPerPage: 20 });
  const eventsSearch = ref("");
  const eventsFilters = ref<ThreatHuntingFilter[]>([]);
  const eventsHistogramData = ref<HistogramBucket[]>([]);
  const eventsHistogramLoading = ref(false);

  // === Document inspection state ===
  const inspectedEvent = ref<ThreatHuntingEvent | null>(null);
  const showDetailPanel = ref(false);
  const surroundingEvents = ref<ThreatHuntingEvent[]>([]);
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

  const histogramInterval = computed(() => {
    switch (dateRange.value) {
      case "15m": return "1m";
      case "1h": return "5m";
      case "24h": return "30m";
      case "7d": return "3h";
      case "30d": return "12h";
      default: return "30m";
    }
  });

  // === Shared query builder ===
  function buildBaseMusts(): Record<string, unknown>[] {
    return [
      {
        range: {
          "@timestamp": {
            gte: dateRangeQuery.value.from,
            lte: dateRangeQuery.value.to,
          },
        },
      },
    ];
  }

  function buildEventsMusts(): Record<string, unknown>[] {
    const must = buildBaseMusts();

    for (const f of eventsFilters.value) {
      if (!f.enabled) continue;
      const clause = filterToClause(f);
      if (clause) must.push(clause);
    }

    if (eventsSearch.value.trim()) {
      must.push({
        query_string: {
          query: eventsSearch.value.trim(),
          default_operator: "AND",
        },
      });
    }

    return must;
  }

  // === Actions ===
  function setActiveTab(tab: "dashboard" | "events") {
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
      case "events":
        fetchEvents();
        break;
    }
  }

  // === Dashboard fetch ===
  async function fetchDashboard() {
    dashboardLoading.value = true;
    try {
      const must = buildBaseMusts();

      const body: OpenSearchQueryBody = {
        query: { bool: { must } },
        size: 0,
        aggs: {
          // Metric: critical alerts (level >= 12)
          critical_alerts: {
            filter: { range: { "rule.level": { gte: 12 } } },
          },
          // Metric: auth failure
          auth_failure: {
            filter: {
              bool: {
                should: [
                  { match_phrase: { "rule.groups": "authentication_failed" } },
                  { match_phrase: { "rule.groups": "authentication_failures" } },
                  { match_phrase: { "rule.description": "authentication failure" } },
                ],
                minimum_should_match: 1,
              },
            },
          },
          // Metric: auth success
          auth_success: {
            filter: {
              bool: {
                should: [
                  { match_phrase: { "rule.groups": "authentication_success" } },
                  { match_phrase: { "rule.description": "authentication success" } },
                  { match_phrase: { "rule.description": "Logon Success" } },
                ],
                minimum_should_match: 1,
              },
            },
          },
          // Top 10 Alert level evolution
          alert_level_evolution: {
            date_histogram: {
              field: "@timestamp",
              fixed_interval: histogramInterval.value,
              min_doc_count: 0,
              extended_bounds: {
                min: dateRangeQuery.value.from,
                max: dateRangeQuery.value.to,
              },
            },
            aggs: {
              by_sub: {
                terms: { field: "rule.level", size: 10 },
              },
            },
          },
          // Top 10 MITRE ATT&CK tactics
          mitre_tactics: {
            terms: { field: "rule.mitre.tactic", size: 10 },
          },
          // Top 5 agents evolution
          top_agents_evolution: {
            date_histogram: {
              field: "@timestamp",
              fixed_interval: histogramInterval.value,
              min_doc_count: 0,
              extended_bounds: {
                min: dateRangeQuery.value.from,
                max: dateRangeQuery.value.to,
              },
            },
            aggs: {
              by_sub: {
                terms: { field: "agent.name", size: 5 },
              },
            },
          },
        },
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs = resp.aggregations as any;

      dashboardAggs.value = {
        metrics: {
          totalAlerts: resp.hits.total.value,
          criticalAlerts: aggs?.critical_alerts?.doc_count ?? 0,
          authFailure: aggs?.auth_failure?.doc_count ?? 0,
          authSuccess: aggs?.auth_success?.doc_count ?? 0,
        },
        alertLevelEvolution: aggs?.alert_level_evolution?.buckets ?? [],
        mitreTactics: aggs?.mitre_tactics?.buckets ?? [],
        topAgentsEvolution: aggs?.top_agents_evolution?.buckets ?? [],
      };

      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[ThreatHunting] Dashboard fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load Threat Hunting dashboard data",
        timeout: 3000,
      });
    } finally {
      dashboardLoading.value = false;
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

      const resp = await wazuhIndexerApi.search<ThreatHuntingEvent>(
        "wazuh-alerts-*",
        body,
      );

      events.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source as unknown as Record<string, unknown>,
      }));
      eventsTotal.value = resp.hits.total.value;
      indexerAvailable.value = true;
    } catch (e) {
      indexerAvailable.value = false;
      console.error("[ThreatHunting] Events fetch error:", e);
      Notify.create({
        type: "negative",
        message: "Failed to load Threat Hunting events",
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
              fixed_interval: histogramInterval.value,
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
      console.error("[ThreatHunting] Histogram fetch error:", e);
    } finally {
      eventsHistogramLoading.value = false;
    }
  }

  // === Document inspection ===
  function inspectDocument(event: ThreatHuntingEvent) {
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
      const src = inspectedEvent.value._source;
      const ts = (src["@timestamp"] as string) ?? (src["timestamp"] as string);
      if (!ts) return;

      const [beforeResp, afterResp] = await Promise.all([
        wazuhIndexerApi.search<ThreatHuntingEvent>("wazuh-alerts-*", {
          query: {
            bool: {
              must: [{ range: { "@timestamp": { lt: ts } } }],
            },
          },
          size: 5,
          sort: [{ "@timestamp": { order: "desc" } }],
        }),
        wazuhIndexerApi.search<ThreatHuntingEvent>("wazuh-alerts-*", {
          query: {
            bool: {
              must: [{ range: { "@timestamp": { gt: ts } } }],
            },
          },
          size: 5,
          sort: [{ "@timestamp": { order: "asc" } }],
        }),
      ]);

      const before = (beforeResp.hits.hits ?? [])
        .map((h) => ({
          _id: h._id,
          _index: h._index,
          _source: h._source as unknown as Record<string, unknown>,
        }))
        .reverse();
      const after = (afterResp.hits.hits ?? []).map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source as unknown as Record<string, unknown>,
      }));

      surroundingEvents.value = [...before, inspectedEvent.value, ...after];
    } catch (e) {
      console.error("[ThreatHunting] Surrounding events fetch error:", e);
    } finally {
      surroundingEventsLoading.value = false;
    }
  }

  // === Filter helpers ===
  function filterToClause(f: ThreatHuntingFilter): Record<string, unknown> | null {
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

  function addFilter(filter: Omit<ThreatHuntingFilter, "id">) {
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

  return {
    // State
    activeTab,
    dateRange,
    indexerAvailable,
    dashboardAggs,
    dashboardLoading,
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

    // Computed
    dateRangeQuery,
    histogramInterval,

    // Actions
    setActiveTab,
    setDateRange,
    refreshActiveTab,
    fetchDashboard,
    fetchEvents,
    fetchEventsHistogram,
    inspectDocument,
    closeInspection,
    fetchSurroundingEvents,
    addFilter,
    removeFilter,
    clearFilters,
    setEventsPage,
    setEventsRowsPerPage,
    setEventsSearch,
  };
});
