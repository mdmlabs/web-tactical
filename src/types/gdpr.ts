import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

// Re-export for convenience
export type { OpenSearchQueryBody, OpenSearchResponse };

// === GDPR Filter System ===

export type GDPRFilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist";

export interface GDPRFilter {
  id: string;
  field: string;
  operator: GDPRFilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

// === GDPR Article metadata ===

export interface GDPRArticleMeta {
  id: string; // e.g. "5", "32", "33"
  title: string;
  description: string;
  subArticles?: GDPRSubArticle[];
}

export interface GDPRSubArticle {
  id: string; // e.g. "5.1.a", "32.1", "33.2"
  title: string;
  description: string;
}

// === GDPR aggregated data ===

export interface GDPRArticleCount {
  article: string; // e.g. "32.1", "5.1.f"
  doc_count: number;
}

export interface GDPRAgentCount {
  agent_name: string;
  agent_id: string;
  doc_count: number;
}

export interface GDPRTrendBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_article?: {
    buckets: { key: string; doc_count: number }[];
  };
}

// === GDPR Event from Wazuh Indexer ===

export interface GDPREvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

// === Agent selection ===

export interface GDPRSelectedAgent {
  id: string;
  name: string;
}

// === Agent-specific dashboard aggregations ===

export interface GDPRRuleGroupCount {
  group: string;
  doc_count: number;
}

export interface GDPRRuleCount {
  rule_id: string;
  description: string;
  doc_count: number;
}

export interface GDPRRuleLevelCount {
  level: number;
  doc_count: number;
  percentage: number;
}

// === Dashboard aggregations ===

export interface GDPRDashboardAggs {
  topArticles: GDPRArticleCount[];
  topAgents: GDPRAgentCount[];
  trend: GDPRTrendBucket[];
  totalAlerts: number;
  // Agent-specific fields (populated when agent is selected)
  topRuleGroups?: GDPRRuleGroupCount[];
  topRules?: GDPRRuleCount[];
  ruleLevelDistribution?: GDPRRuleLevelCount[];
}

// === Controls matrix ===

export interface GDPRControlsMatrixCell {
  subArticle: string;
  mainArticle: string;
  count: number;
}

export interface GDPRControlsMatrixData {
  subArticles: string[];
  matrix: Map<string, Map<string, number>>; // subArticle -> mainArticle -> count
  subArticleTotals: Map<string, number>; // subArticle -> total count
}

// === Known GDPR fields for filter dropdown ===

export const GDPR_KNOWN_FIELDS: string[] = [
  "@timestamp",
  "timestamp",
  "agent.id",
  "agent.name",
  "agent.ip",
  "manager.name",
  "rule.id",
  "rule.level",
  "rule.description",
  "rule.groups",
  "rule.gdpr",
  "rule.pci_dss",
  "rule.hipaa",
  "rule.nist_800_53",
  "decoder.name",
  "location",
  "full_log",
];
