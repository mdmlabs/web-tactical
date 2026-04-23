// === Wazuh Alerting Module Types (OpenSearch Alerting Plugin) ===

// --- Monitor ---

export type MonitorType =
  | "per_query"
  | "per_bucket"
  | "per_cluster_metrics"
  | "per_document"
  | "composite";

export type MonitorDefiningMethod = "visual" | "extraction_query" | "anomaly_detector";

export type ScheduleUnit = "minutes" | "hours" | "days";

export interface MonitorSchedule {
  period: {
    interval: number;
    unit: ScheduleUnit;
  };
}

export interface MonitorTrigger {
  id?: string;
  name: string;
  severity: string; // "1"-"5"
  condition: {
    script: string;
  };
  actions: TriggerAction[];
}

export interface TriggerAction {
  id?: string;
  name: string;
  destination_id: string;
  message_template: string;
  throttle_enabled: boolean;
  throttle?: {
    value: number;
    unit: string;
  };
}

export interface Monitor {
  id: string;
  name: string;
  enabled: boolean;
  type: MonitorType;
  monitor_type: string;
  definition_method: MonitorDefiningMethod;
  schedule: MonitorSchedule;
  inputs: MonitorInput[];
  triggers: MonitorTrigger[];
  last_update_time: string;
  enabled_time?: string;
  active_count: number;
  acknowledged_count: number;
  errors_count: number;
  ignored_count: number;
  latest_alert?: string;
  last_notification_time?: string;
  associations_count: number;
  version: number;
}

export interface MonitorInput {
  search: {
    indices: string[];
    query: Record<string, unknown>;
  };
}

// --- Alert ---

export type AlertState = "active" | "acknowledged" | "error" | "completed" | "deleted";

export interface AlertEntry {
  id: string;
  monitor_id: string;
  monitor_name: string;
  trigger_id: string;
  trigger_name: string;
  state: AlertState;
  severity: string;
  start_time: string;
  last_notification_time?: string;
  end_time?: string;
  acknowledged_time?: string;
  error_message?: string;
}

// --- Notification Channels ---

export type ChannelType = "slack" | "email" | "webhook" | "chime" | "sns" | "ses" | "pagerduty";

export interface NotificationChannel {
  config_id: string;
  name: string;
  description: string;
  config_type: ChannelType;
  is_enabled: boolean;
  config: Record<string, unknown>;
  created_time_ms: number;
  last_updated_time_ms: number;
}

// --- Email Senders ---

export type EncryptionMethod = "none" | "starttls" | "ssl";

export interface SmtpSender {
  config_id: string;
  name: string;
  from_address: string;
  host: string;
  port: number;
  method: EncryptionMethod;
}

export interface SesSender {
  config_id: string;
  name: string;
  from_address: string;
  aws_region: string;
  role_arn: string;
}

// --- Recipient Groups ---

export interface RecipientGroup {
  config_id: string;
  name: string;
  description: string;
  email_group: {
    recipient: { recipient: string }[];
  };
}

// --- Query test ---

export interface AlertQueryTestResult {
  success: boolean;
  count: number;
  error?: string;
}

// --- UI Constants ---

export const MONITOR_TYPE_OPTIONS: {
  value: MonitorType;
  label: string;
  description: string;
}[] = [
  {
    value: "per_query",
    label: "Per query monitor",
    description:
      "Per query monitors run a query and generate alerts based on trigger criteria that match query results.",
  },
  {
    value: "per_bucket",
    label: "Per bucket monitor",
    description:
      "Per bucket monitors run a query that evaluates trigger criteria based on aggregated values in the dataset.",
  },
  {
    value: "per_cluster_metrics",
    label: "Per cluster metrics monitor",
    description:
      "Per cluster metrics monitors run API requests to monitor the cluster's health.",
  },
  {
    value: "per_document",
    label: "Per document monitor",
    description:
      "Per document monitors run queries that return individual documents matching the trigger conditions.",
  },
  {
    value: "composite",
    label: "Composite monitor",
    description:
      "Composite monitors chain the outputs of different monitor types and focus trigger conditions to reduce alert noise and generate finer results.",
  },
];

export const DEFINING_METHOD_OPTIONS: {
  value: MonitorDefiningMethod;
  label: string;
}[] = [
  { value: "visual", label: "Visual editor" },
  { value: "extraction_query", label: "Extraction query editor" },
  { value: "anomaly_detector", label: "Anomaly detector" },
];

export const SEVERITY_OPTIONS: { label: string; value: string }[] = [
  { label: "1 (Highest)", value: "1" },
  { label: "2 (High)", value: "2" },
  { label: "3 (Medium)", value: "3" },
  { label: "4 (Low)", value: "4" },
  { label: "5 (Lowest)", value: "5" },
];

export function severityLabel(sev: string): string {
  switch (sev) {
    case "1": return "1 (Highest)";
    case "2": return "2 (High)";
    case "3": return "3 (Medium)";
    case "4": return "4 (Low)";
    case "5": return "5 (Lowest)";
    default: return sev;
  }
}

export function monitorTypeLabel(type: MonitorType | string): string {
  switch (type) {
    case "per_query": return "Per query";
    case "per_bucket": return "Per bucket";
    case "per_cluster_metrics": return "Per cluster metrics";
    case "per_document": return "Per document";
    case "composite": return "Composite";
    default: return String(type);
  }
}
