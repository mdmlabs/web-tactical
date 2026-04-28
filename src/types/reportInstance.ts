/**
 * A single generated report stored on the dashboards server's
 * OpenSearch Dashboards Reports plugin (`/api/reporting/reports`).
 *
 * Field naming across plugin versions is inconsistent — `lastUpdatedTimeMs`
 * vs `last_updated`, `reportName` vs `report_name` — so the type below is
 * the normalized shape produced by `parseReportInstance()`. The raw response
 * is parsed defensively to absorb both conventions.
 */
export type ReportInstanceState = "Pending" | "Created" | "Shared" | "Error";

export type ReportInstanceFormat = "csv" | "pdf" | "png" | "xlsx";

export type ReportInstanceSource =
  | "Saved search"
  | "Dashboard"
  | "Visualization"
  | "Notebook";

export interface ReportInstance {
  id: string;
  reportDefinitionId?: string;
  reportName: string;
  reportSource: ReportInstanceSource | string;
  format: ReportInstanceFormat | string;
  state: ReportInstanceState | string;
  createdTimeMs: number;
  lastUpdatedTimeMs: number;
  beginTimeMs?: number;
  endTimeMs?: number;
  /** OSD dashboard URL used to re-render PDF/PNG instances client-side. */
  queryUrl?: string;
}

/**
 * Full per-instance payload returned by `GET /api/reporting/reports/{id}`.
 * Carries the same fields as a list row plus everything needed to render the
 * Report details page (record limit, lookback, header/footer, source ids).
 */
export interface ReportInstanceDetails extends ReportInstance {
  description: string;
  recordLimit?: number;
  /** ISO-8601 duration string, e.g. "PT24H". */
  timeDuration?: string;
  reportFormat: string;
  header: string;
  footer: string;
  triggerType: string;
  baseUrl?: string;
  savedSearchId?: string;
  dashboardId?: string;
  visualizationId?: string;
}
