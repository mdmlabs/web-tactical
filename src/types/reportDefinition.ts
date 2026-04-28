/**
 * Types mirroring the OpenSearch Dashboards Reports plugin schema for the
 * `reportDefinitions` API. Field naming follows the wire format (snake_case)
 * because we POST these objects verbatim to the plugin.
 *
 * See `/api/reporting/reportDefinitions` in the dashboards-server.
 */

export type ReportFormat = "csv" | "pdf" | "png" | "xlsx";

export type ReportSource = "Saved search" | "Dashboard" | "Visualization";

export type ReportTriggerType = "On demand" | "Schedule";

export type ScheduleType = "Recurring" | "Cron based";

export type ScheduleUnit = "MINUTES" | "HOURS" | "DAYS" | "WEEKS" | "MONTHS";

/** ISO-8601 duration string, e.g. "PT24H", "PT15M", "P7D". */
export type IsoDuration = string;

export interface ReportCoreParams {
  base_url?: string;
  saved_search_id?: string;
  dashboard_id?: string;
  visualization_id?: string;
  report_format: ReportFormat;
  /** ISO-8601 duration; the lookback window used when the report renders. */
  time_duration: IsoDuration;
  limit?: number;
  /** When report_format = csv and excel = true, the plugin produces XLSX. */
  excel?: boolean;
  origin?: string;
}

export interface ReportParams {
  report_name: string;
  report_source: ReportSource;
  description?: string;
  core_params: ReportCoreParams;
}

export interface ReportTriggerOnDemand {
  trigger_type: "On demand";
}

export interface ScheduleRecurring {
  schedule_type: "Recurring";
  schedule: {
    interval: {
      period: number;
      unit: ScheduleUnit;
      start_time: number;
    };
  };
}

export interface ScheduleCron {
  schedule_type: "Cron based";
  schedule: {
    cron: {
      expression: string;
      timezone: string;
    };
  };
}

export interface ReportTriggerSchedule {
  trigger_type: "Schedule";
  trigger_params: {
    enabled: boolean;
    enabled_time: number;
  } & (ScheduleRecurring | ScheduleCron);
}

export type ReportTrigger = ReportTriggerOnDemand | ReportTriggerSchedule;

export interface ReportDelivery {
  configIds: string[];
  title: string;
  textDescription: string;
  htmlDescription?: string;
}

export interface ReportDefinitionPayload {
  report_params: ReportParams;
  trigger: ReportTrigger;
  delivery?: ReportDelivery;
  time_created?: number;
  last_updated?: number;
}

/** Summary projection used by list views / pickers. */
export interface ReportDefinitionSummary {
  id: string;
  name: string;
  source: ReportSource | string;
  format: ReportFormat | string;
  triggerType: ReportTriggerType | string;
  enabled: boolean;
  lastUpdatedMs: number;
}
