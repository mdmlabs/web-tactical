import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import type { OpenSearchQueryBody } from "@/types/fim";
import type { SavedSearchAttributes } from "@/types/savedSearch";

/** Shape of a single hit coming back from the indexer */
export interface DiscoverHit {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

/** Bucket returned by a date_histogram aggregation */
interface HistogramBucket {
  key_as_string: string;
  key: number;
  doc_count: number;
}

/** Known alert fields shown in the sidebar by default */
export const DISCOVER_KNOWN_FIELDS: string[] = [
  "@timestamp",
  "rule.level",
  "rule.id",
  "rule.description",
  "rule.groups",
  "rule.mitre.tactic",
  "rule.mitre.technique",
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

/** Map display index names (ossec-*) to actual backend index names (wazuh-*) */
export const INDEX_PATTERN_MAP: Record<string, string> = {
  "ossec-alerts-*": "wazuh-alerts-*",
  "ossec-archives-*": "wazuh-archives-*",
};

export function resolveBackendIndex(displayPattern: string): string {
  return INDEX_PATTERN_MAP[displayPattern] ?? displayPattern;
}

export type DiscoverTimePreset = "15m" | "1h" | "24h" | "7d" | "30d";

const PRESET_MS: Record<DiscoverTimePreset, number> = {
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

/** Build a bool query mirroring the Discover view for arbitrary inputs. */
export function buildDiscoverQuery(
  queryString: string,
  preset: DiscoverTimePreset,
  now: Date = new Date(),
): { query: Record<string, unknown>; from: string; to: string } {
  const to = now.toISOString();
  const from = new Date(now.getTime() - PRESET_MS[preset]).toISOString();

  const must: Record<string, unknown>[] = [
    { range: { "@timestamp": { gte: from, lte: to } } },
  ];
  if (queryString.trim()) {
    must.push({
      query_string: { query: queryString.trim(), default_operator: "AND" },
    });
  }
  return { query: { bool: { must } }, from, to };
}

export const useDiscoverStore = defineStore("discover", () => {
  // === State ===
  const indexPattern = ref("ossec-alerts-*");
  const searchQuery = ref("");
  const timeRange = ref<DiscoverTimePreset>("24h");
  const selectedFields = ref<string[]>(["rule.level", "rule.id", "rule.description", "@timestamp"]);

  const hits = ref<DiscoverHit[]>([]);
  const totalHits = ref(0);
  const loading = ref(false);

  const histogramBuckets = ref<{ timestamp: string; count: number }[]>([]);
  const histogramLoading = ref(false);

  const indexerAvailable = ref(true);
  const errorMessage = ref<string | null>(null);

  const pagination = ref({ page: 1, rowsPerPage: 100 });

  // === Computed ===
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
    const ms = presetMs[timeRange.value] ?? presetMs["24h"];
    const from = new Date(now.getTime() - ms).toISOString();
    return { from, to };
  });

  /** Histogram interval adapts to selected time range */
  const histogramInterval = computed(() => {
    switch (timeRange.value) {
      case "15m": return "1m";
      case "1h": return "5m";
      case "24h": return "30m";
      case "7d": return "3h";
      case "30d": return "12h";
      default: return "30m";
    }
  });

  const baseQuery = computed(() => {
    const must: Record<string, unknown>[] = [
      {
        range: {
          "@timestamp": {
            gte: dateRangeQuery.value.from,
            lte: dateRangeQuery.value.to,
          },
        },
      },
    ];

    if (searchQuery.value.trim()) {
      must.push({
        query_string: {
          query: searchQuery.value.trim(),
          default_operator: "AND",
        },
      });
    }

    return { bool: { must } };
  });

  // === Actions ===
  async function fetchEvents() {
    loading.value = true;
    errorMessage.value = null;

    try {
      const from = (pagination.value.page - 1) * pagination.value.rowsPerPage;

      const body: OpenSearchQueryBody = {
        query: baseQuery.value,
        size: pagination.value.rowsPerPage,
        from,
        sort: [{ "@timestamp": { order: "desc" } }] as Record<string, unknown>[],
        _source: true,
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

      const apiIndex = INDEX_PATTERN_MAP[indexPattern.value] ?? indexPattern.value;

      const resp = await wazuhIndexerApi.search<DiscoverHit>(
        apiIndex,
        body,
      );

      hits.value = resp.hits.hits.map((h) => ({
        _id: h._id,
        _index: h._index,
        _source: h._source as unknown as Record<string, unknown>,
      }));
      totalHits.value = resp.hits.total.value;

      // Parse histogram aggregation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs = resp.aggregations as any;
      histogramBuckets.value = (aggs?.events_over_time?.buckets ?? []).map(
        (b: HistogramBucket) => ({
          timestamp: b.key_as_string,
          count: b.doc_count,
        }),
      );

      indexerAvailable.value = true;
    } catch (e: unknown) {
      indexerAvailable.value = false;

      if (isAxiosError(e) && e.response?.status === 401) {
        errorMessage.value = "Authentication failed. Check MDM-Lab Indexer credentials.";
      } else if (isAxiosError(e) && e.response?.status === 404) {
        errorMessage.value = `Index pattern "${indexPattern.value}" not found. Ensure OSSEC alerts are being indexed.`;
      } else if (isAxiosError(e) && !e.response) {
        errorMessage.value = "MDM-Lab Indexer is unreachable. Check connection settings.";
      } else {
        errorMessage.value = "Failed to fetch events from MDM-Lab Indexer.";
      }

      console.error("[Discover] Fetch events error:", e);
      Notify.create({
        type: "negative",
        message: errorMessage.value,
        timeout: 4000,
      });
    } finally {
      loading.value = false;
    }
  }

  function search() {
    pagination.value.page = 1;
    fetchEvents();
  }

  function setPage(page: number) {
    pagination.value.page = page;
    fetchEvents();
  }

  function setTimeRange(range: DiscoverTimePreset) {
    timeRange.value = range;
    search();
  }

  function setIndexPattern(pattern: string) {
    indexPattern.value = pattern;
    search();
  }

  /** Apply a Saved Search to the current view and re-run the search. */
  function applySavedSearch(attrs: SavedSearchAttributes) {
    indexPattern.value = attrs.indexPattern;
    searchQuery.value = attrs.query;
    timeRange.value = attrs.timeRange;
    if (attrs.columns.length > 0) selectedFields.value = [...attrs.columns];
    search();
  }

  /**
   * Reset filters to defaults. Called on Discover view entry so a previously
   * opened Saved Search from a prior navigation doesn't silently persist.
   */
  function resetDefaults() {
    indexPattern.value = "ossec-alerts-*";
    searchQuery.value = "";
    timeRange.value = "24h";
    selectedFields.value = ["rule.level", "rule.id", "rule.description", "@timestamp"];
    pagination.value.page = 1;
  }

  function toggleField(field: string) {
    const idx = selectedFields.value.indexOf(field);
    if (idx >= 0) {
      selectedFields.value.splice(idx, 1);
    } else {
      selectedFields.value.push(field);
    }
  }

  return {
    // State
    indexPattern,
    searchQuery,
    timeRange,
    selectedFields,
    hits,
    totalHits,
    loading,
    histogramBuckets,
    histogramLoading,
    indexerAvailable,
    errorMessage,
    pagination,

    // Computed
    dateRangeQuery,
    histogramInterval,

    // Actions
    fetchEvents,
    search,
    setPage,
    setTimeRange,
    setIndexPattern,
    toggleField,
    applySavedSearch,
    resetDefaults,
  };
});

/** Type guard for Axios errors */
function isAxiosError(e: unknown): e is { response?: { status: number }; message: string } {
  return typeof e === "object" && e !== null && "message" in e;
}
