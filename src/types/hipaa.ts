import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

// Re-export for convenience
export type { OpenSearchQueryBody, OpenSearchResponse };

// === HIPAA Filter System ===

export type HIPAAFilterOperator =
  | "is"
  | "is_not"
  | "exists"
  | "does_not_exist";

export interface HIPAAFilter {
  id: string;
  field: string;
  operator: HIPAAFilterOperator;
  value?: string;
  enabled: boolean;
  negated: boolean;
}

// === HIPAA Standard metadata ===

export interface HIPAAStandardMeta {
  id: string; // e.g. "164.308", "164.312"
  title: string;
  description: string;
  subStandards?: HIPAASubStandard[];
}

export interface HIPAASubStandard {
  id: string; // e.g. "164.312.a.1", "164.308.a.3"
  title: string;
  description: string;
}

// === HIPAA aggregated data ===

export interface HIPAAStandardCount {
  standard: string; // e.g. "164.312.a.1", "164.308.a.5"
  doc_count: number;
}

export interface HIPAAAgentCount {
  agent_name: string;
  agent_id: string;
  doc_count: number;
}

export interface HIPAATrendBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
  by_standard?: {
    buckets: { key: string; doc_count: number }[];
  };
}

// === HIPAA Event from Wazuh Indexer ===

export interface HIPAAEvent {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
}

// === Agent selection ===

export interface HIPAASelectedAgent {
  id: string;
  name: string;
}

// === Agent-specific dashboard aggregations ===

export interface HIPAARuleGroupCount {
  group: string;
  doc_count: number;
}

export interface HIPAARuleCount {
  rule_id: string;
  description: string;
  doc_count: number;
}

export interface HIPAARuleLevelCount {
  level: number;
  doc_count: number;
  percentage: number;
}

// === Dashboard aggregations ===

export interface HIPAADashboardAggs {
  topStandards: HIPAAStandardCount[];
  topAgents: HIPAAAgentCount[];
  trend: HIPAATrendBucket[];
  totalAlerts: number;
  // Agent-specific fields (populated when agent is selected)
  topRuleGroups?: HIPAARuleGroupCount[];
  topRules?: HIPAARuleCount[];
  ruleLevelDistribution?: HIPAARuleLevelCount[];
}

// === Controls matrix ===

export interface HIPAAControlsMatrixCell {
  subStandard: string;
  mainStandard: string;
  count: number;
}

export interface HIPAAControlsMatrixData {
  subStandards: string[];
  matrix: Map<string, Map<string, number>>; // subStandard -> mainStandard -> count
  subStandardTotals: Map<string, number>; // subStandard -> total count
}

// === Known HIPAA fields for filter dropdown ===

export const HIPAA_KNOWN_FIELDS: string[] = [
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
  "rule.hipaa",
  "rule.pci_dss",
  "rule.gdpr",
  "rule.nist_800_53",
  "decoder.name",
  "location",
  "full_log",
];
