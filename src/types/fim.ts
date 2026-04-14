// === FIM Filter System ===

export type FIMFilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist"
  | "is_one_of"
  | "is_not_one_of";

export interface FIMFilter {
  id: string;
  field: string;
  operator: FIMFilterOperator;
  value?: string;
  values?: string[];
  enabled: boolean;
  pinned: boolean;
  negated: boolean;
}

export interface FIMDateRange {
  type: "preset" | "custom";
  preset?: "15m" | "1h" | "24h" | "7d" | "30d";
  from?: string;
  to?: string;
}

// === FIM Dashboard Aggregations ===

export interface FIMDashboardAggs {
  activeUsers: { name: string; count: number }[];
  actions: { event: string; count: number }[];
  eventsTimeline: {
    timestamp: string;
    added: number;
    modified: number;
    deleted: number;
  }[];
  filesAdded: { path: string; count: number }[];
  filesModified: { path: string; count: number }[];
  filesDeleted: { path: string; count: number }[];
}

// === FIM Event (from Wazuh Indexer) ===

export interface FIMEventSource {
  "@timestamp": string;
  timestamp: string;
  agent: {
    id: string;
    name: string;
    ip: string;
  };
  manager: {
    name: string;
  };
  rule: {
    id: string;
    description: string;
    level: number;
    groups: string[];
    firedtimes?: number;
    gdpr?: string[];
    gpg13?: string;
    hipaa?: string[];
    nist_800_53?: string[];
    pci_dss?: string[];
  };
  syscheck: {
    path: string;
    event: string;
    uname?: string;
    uid?: string;
    gid?: string;
    gname?: string;
    size_after?: string;
    size_before?: string;
    md5_after?: string;
    md5_before?: string;
    sha1_after?: string;
    sha1_before?: string;
    sha256_after?: string;
    sha256_before?: string;
    perm_after?: string;
    perm_before?: string;
    mtime_after?: string;
    mtime_before?: string;
    inode_after?: number;
    attrs_after?: number;
    diff?: string;
    changed_attributes?: string[];
    mode?: string;
  };
  decoder: {
    name: string;
  };
  full_log?: string;
  id: string;
  input: {
    type: string;
  };
  location: string;
  _index?: string;
  [key: string]: unknown;
}

export interface FIMEvent {
  _id: string;
  _index: string;
  _source: FIMEventSource;
}

// === OpenSearch Query/Response types ===

export interface OpenSearchQueryBody {
  query?: Record<string, unknown>;
  aggs?: Record<string, unknown>;
  size?: number;
  from?: number;
  sort?: Record<string, unknown>[];
  _source?: string[] | boolean;
}

export interface OpenSearchHitsTotal {
  value: number;
  relation: "eq" | "gte";
}

export interface OpenSearchResponse<T = FIMEvent> {
  hits: {
    total: OpenSearchHitsTotal;
    max_score: number | null;
    hits: T[];
  };
  aggregations?: Record<string, unknown>;
  _shards?: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  timed_out: boolean;
  took: number;
}

// === Known FIM fields for filter dropdown ===

export const FIM_KNOWN_FIELDS: string[] = [
  "@timestamp",
  "agent.id",
  "agent.name",
  "agent.ip",
  "manager.name",
  "rule.id",
  "rule.level",
  "rule.description",
  "rule.groups",
  "rule.gdpr",
  "rule.hipaa",
  "rule.nist_800_53",
  "rule.pci_dss",
  "syscheck.path",
  "syscheck.event",
  "syscheck.uname",
  "syscheck.uid",
  "syscheck.gid",
  "syscheck.gname",
  "syscheck.md5_after",
  "syscheck.sha1_after",
  "syscheck.sha256_after",
  "syscheck.size_after",
  "syscheck.perm_after",
  "syscheck.mtime_after",
  "syscheck.diff",
  "syscheck.mode",
  "syscheck.changed_attributes",
  "decoder.name",
  "location",
  "full_log",
];
