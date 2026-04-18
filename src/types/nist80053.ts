import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

// Re-export for convenience
export type { OpenSearchQueryBody, OpenSearchResponse };

// === NIST 800-53 Filter System ===

export type NIST80053FilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist";

export interface NIST80053Filter {
  id: string;
  field: string;
  operator: NIST80053FilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

// === NIST 800-53 Control metadata ===

export interface NIST80053ControlFamilyMeta {
  id: string; // e.g. "AC", "AU", "SI"
  title: string;
  description: string;
  controls?: NIST80053ControlMeta[];
}

export interface NIST80053ControlMeta {
  id: string; // e.g. "AC-2", "AU-6", "SI-4"
  title: string;
  description: string;
}

// === NIST 800-53 aggregated data ===

export interface NIST80053ControlCount {
  control: string; // e.g. "AC-2", "AU-6", "SI-4"
  doc_count: number;
}

export interface NIST80053AgentCount {
  agent_name: string;
  agent_id: string;
  doc_count: number;
}

export interface NIST80053TrendBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_control?: {
    buckets: { key: string; doc_count: number }[];
  };
}

// === NIST 800-53 Event from Wazuh Indexer ===

export interface NIST80053Event {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

// === Agent selection ===

export interface NIST80053SelectedAgent {
  id: string;
  name: string;
}

// === Agent-specific dashboard aggregations ===

export interface NIST80053RuleGroupCount {
  group: string;
  doc_count: number;
}

export interface NIST80053RuleCount {
  rule_id: string;
  description: string;
  doc_count: number;
}

export interface NIST80053RuleLevelCount {
  level: number;
  doc_count: number;
  percentage: number;
}

// === Dashboard aggregations ===

export interface NIST80053DashboardAggs {
  topControls: NIST80053ControlCount[];
  topAgents: NIST80053AgentCount[];
  trend: NIST80053TrendBucket[];
  totalAlerts: number;
  // Agent-specific fields (populated when agent is selected)
  topRuleGroups?: NIST80053RuleGroupCount[];
  topRules?: NIST80053RuleCount[];
  ruleLevelDistribution?: NIST80053RuleLevelCount[];
}

// === Controls matrix ===

export interface NIST80053ControlsMatrixCell {
  control: string;
  family: string;
  count: number;
}

export interface NIST80053ControlsMatrixData {
  controls: string[];
  matrix: Map<string, Map<string, number>>; // control -> family -> count
  controlTotals: Map<string, number>; // control -> total count
}

// === Known NIST 800-53 fields for filter dropdown ===

export const NIST_800_53_KNOWN_FIELDS: string[] = [
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
  "rule.nist_800_53",
  "rule.pci_dss",
  "rule.gdpr",
  "rule.hipaa",
  "decoder.name",
  "location",
  "full_log",
];
