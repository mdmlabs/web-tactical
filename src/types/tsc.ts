import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

// Re-export for convenience
export type { OpenSearchQueryBody, OpenSearchResponse };

// === TSC Filter System ===

export type TSCFilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist";

export interface TSCFilter {
  id: string;
  field: string;
  operator: TSCFilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

// === TSC Criteria metadata ===

export interface TSCPrincipleMeta {
  id: string; // e.g. "Security", "Availability"
  title: string;
  description: string;
  criteria?: TSCCriteriaMeta[];
}

export interface TSCCriteriaMeta {
  id: string; // e.g. "CC6.1", "A1.2", "PI1.3"
  title: string;
  description: string;
}

// === TSC aggregated data ===

export interface TSCCriteriaCount {
  criteria: string; // e.g. "CC6.1", "A1.2"
  doc_count: number;
}

export interface TSCAgentCount {
  agent_name: string;
  agent_id: string;
  doc_count: number;
}

export interface TSCTrendBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_criteria?: {
    buckets: { key: string; doc_count: number }[];
  };
}

// === TSC Event from Wazuh Indexer ===

export interface TSCEvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

// === Agent selection ===

export interface TSCSelectedAgent {
  id: string;
  name: string;
}

// === Agent-specific dashboard aggregations ===

export interface TSCRuleGroupCount {
  group: string;
  doc_count: number;
}

export interface TSCRuleCount {
  rule_id: string;
  description: string;
  doc_count: number;
}

export interface TSCRuleLevelCount {
  level: number;
  doc_count: number;
  percentage: number;
}

// === Dashboard aggregations ===

export interface TSCDashboardAggs {
  topCriteria: TSCCriteriaCount[];
  topAgents: TSCAgentCount[];
  trend: TSCTrendBucket[];
  totalAlerts: number;
  // Agent-specific fields (populated when agent is selected)
  topRuleGroups?: TSCRuleGroupCount[];
  topRules?: TSCRuleCount[];
  ruleLevelDistribution?: TSCRuleLevelCount[];
}

// === Controls matrix ===

export interface TSCControlsMatrixCell {
  criteria: string;
  principle: string;
  count: number;
}

export interface TSCControlsMatrixData {
  criteria: string[];
  matrix: Map<string, Map<string, number>>; // criteria -> principle -> count
  criteriaTotals: Map<string, number>; // criteria -> total count
}

// === Known TSC fields for filter dropdown ===

export const TSC_KNOWN_FIELDS: string[] = [
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
  "rule.tsc",
  "rule.pci_dss",
  "rule.gdpr",
  "rule.hipaa",
  "rule.nist_800_53",
  "decoder.name",
  "location",
  "full_log",
];
