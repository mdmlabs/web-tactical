import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

// Re-export for convenience
export type { OpenSearchQueryBody, OpenSearchResponse };

// === PCI DSS Filter System ===

export type PCIDSSFilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist";

export interface PCIDSSFilter {
  id: string;
  field: string;
  operator: PCIDSSFilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

// === PCI DSS Requirement metadata ===

export interface PCIDSSRequirementMeta {
  id: string; // e.g. "1", "2", "10", "11"
  title: string;
  description: string;
  subRequirements?: PCIDSSSubRequirement[];
}

export interface PCIDSSSubRequirement {
  id: string; // e.g. "1.1", "2.2", "10.2.5"
  title: string;
  description: string;
}

// === PCI DSS aggregated data ===

export interface PCIDSSRequirementCount {
  requirement: string; // e.g. "11.5", "2.2"
  doc_count: number;
}

export interface PCIDSSAgentCount {
  agent_name: string;
  agent_id: string;
  doc_count: number;
}

export interface PCIDSSTrendBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_requirement?: {
    buckets: { key: string; doc_count: number }[];
  };
}

// === PCI DSS Event from Wazuh Indexer ===

export interface PCIDSSEvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

// === Agent selection ===

export interface PCIDSSSelectedAgent {
  id: string;
  name: string;
}

// === Agent-specific dashboard aggregations ===

export interface PCIDSSRuleGroupCount {
  group: string;
  doc_count: number;
}

export interface PCIDSSRuleCount {
  rule_id: string;
  description: string;
  doc_count: number;
}

export interface PCIDSSRuleLevelCount {
  level: number;
  doc_count: number;
  percentage: number;
}

// === Dashboard aggregations ===

export interface PCIDSSDashboardAggs {
  topRequirements: PCIDSSRequirementCount[];
  topAgents: PCIDSSAgentCount[];
  trend: PCIDSSTrendBucket[];
  totalAlerts: number;
  // Agent-specific fields (populated when agent is selected)
  topRuleGroups?: PCIDSSRuleGroupCount[];
  topRules?: PCIDSSRuleCount[];
  ruleLevelDistribution?: PCIDSSRuleLevelCount[];
}

// === Controls matrix ===

export interface PCIDSSControlsMatrixCell {
  subReq: string;
  mainReq: string;
  count: number;
}

export interface PCIDSSControlsMatrixData {
  subRequirements: string[];
  matrix: Map<string, Map<string, number>>; // subReq -> mainReq -> count
  subReqTotals: Map<string, number>; // subReq -> total count
}

// === Known PCI DSS fields for filter dropdown ===

export const PCIDSS_KNOWN_FIELDS: string[] = [
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
  "rule.pci_dss",
  "rule.gdpr",
  "rule.hipaa",
  "rule.nist_800_53",
  "decoder.name",
  "location",
  "full_log",
];
