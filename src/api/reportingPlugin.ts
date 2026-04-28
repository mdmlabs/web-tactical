import { wazuhDashboardApi } from "@/api/wazuhDashboard";
import type { ReportInstance, ReportInstanceDetails } from "@/types/reportInstance";
import type {
  ReportDefinitionPayload,
  ReportDefinitionSummary,
} from "@/types/reportDefinition";

const REPORTS_PATH = "/api/reporting/reports";
const DEFINITIONS_PATH = "/api/reporting/reportDefinitions";
// Wazuh Dashboard 2.x uses the *singular* path for create — POST to the
// plural form returns 404. GET/PUT/DELETE remain on the plural path.
const DEFINITION_CREATE_PATH = "/api/reporting/reportDefinition";
const GENERATE_PATH = "/api/reporting/generateReport";
// OSD's dashboard renderer reads this query param to know it should produce
// a PDF/PNG for an existing instance instead of a fresh on-demand render.
const VISUAL_REPORT_PARAM = "visualReportId";

type RawHit = {
  _id?: string;
  _source?: {
    query_url?: string;
    state?: string;
    last_updated?: number | string;
    time_created?: number | string;
    time_from?: number | string;
    time_to?: number | string;
    report_definition_id?: string;
    report_definition?: {
      report_params?: {
        report_name?: string;
        report_source?: string;
        core_params?: {
          report_format?: string;
          excel?: boolean;
        };
      };
    };
  } & Record<string, unknown>;
} & Record<string, unknown>;

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.length > 0) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

// The OSD reports plugin (`GET /api/reporting/reports`) returns each instance
// as `{ _id, _source: { state, last_updated, time_created, query_url,
// report_definition: { report_params: { report_name, report_source,
// core_params: { report_format } } } } }` — *not* a flat object. Reading flat
// keys yields only the id, which is why the table renders rows but every
// other column is "(unnamed)" / "—".
function parseReportInstance(hit: RawHit): ReportInstance | null {
  const id = asString(hit._id) ?? asString(hit.id) ?? asString(hit.reportId);
  if (!id) return null;
  const source = hit._source ?? {};
  const def = source.report_definition ?? {};
  const params = def.report_params ?? {};
  const core = params.core_params ?? {};

  const created = asNumber(source.time_created) ?? 0;
  const updated = asNumber(source.last_updated) ?? created;
  const rawFormat = asString(core.report_format) ?? "";
  // OSD stores XLSX as `report_format=csv` + `excel=true`.
  const format = (core.excel ? "xlsx" : rawFormat).toLowerCase();

  return {
    id,
    reportDefinitionId: asString(source.report_definition_id),
    reportName: asString(params.report_name) ?? "(unnamed)",
    reportSource: asString(params.report_source) ?? "—",
    format,
    state: asString(source.state) ?? "—",
    createdTimeMs: created,
    lastUpdatedTimeMs: updated,
    beginTimeMs: asNumber(source.time_from),
    endTimeMs: asNumber(source.time_to),
    queryUrl: asString(source.query_url),
  };
}

function normalizeListResponse(data: unknown): RawHit[] {
  if (Array.isArray(data)) return data as RawHit[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as RawHit[];
    if (Array.isArray(obj.reports)) return obj.reports as RawHit[];
    if (Array.isArray(obj.items)) return obj.items as RawHit[];
  }
  return [];
}

export async function listReportInstances(): Promise<ReportInstance[]> {
  const data = await wazuhDashboardApi.get<unknown>(REPORTS_PATH);
  return normalizeListResponse(data)
    .map(parseReportInstance)
    .filter((r): r is ReportInstance => r !== null)
    .sort((a, b) => b.lastUpdatedTimeMs - a.lastUpdatedTimeMs);
}

// `GET /api/reporting/reports/{id}` returns the converted source directly
// (no `_id`/`_source` envelope), so we accept either shape defensively.
export async function getReportInstanceDetails(
  id: string,
): Promise<ReportInstanceDetails | null> {
  const data = await wazuhDashboardApi.get<Record<string, unknown>>(
    `${REPORTS_PATH}/${encodeURIComponent(id)}`,
  );
  if (!data || typeof data !== "object") return null;
  const source =
    typeof (data as { _source?: unknown })._source === "object" &&
    (data as { _source?: unknown })._source !== null
      ? ((data as { _source: Record<string, unknown> })._source)
      : (data as Record<string, unknown>);
  const def =
    (source.report_definition as Record<string, unknown> | undefined) ?? {};
  const params =
    (def.report_params as Record<string, unknown> | undefined) ?? {};
  const core =
    (params.core_params as Record<string, unknown> | undefined) ?? {};
  const trigger =
    (def.trigger as Record<string, unknown> | undefined) ?? {};

  const created = asNumber(source.time_created) ?? 0;
  const updated = asNumber(source.last_updated) ?? created;
  const reportFormat = asString(core.report_format) ?? "";
  const format = (core.excel ? "xlsx" : reportFormat).toLowerCase();

  return {
    id,
    reportDefinitionId: asString(source.report_definition_id),
    reportName: asString(params.report_name) ?? "(unnamed)",
    description: asString(params.description) ?? "",
    reportSource: asString(params.report_source) ?? "—",
    format,
    reportFormat,
    state: asString(source.state) ?? "—",
    createdTimeMs: created,
    lastUpdatedTimeMs: updated,
    beginTimeMs: asNumber(source.time_from),
    endTimeMs: asNumber(source.time_to),
    queryUrl: asString(source.query_url),
    recordLimit: asNumber(core.limit),
    timeDuration: asString(core.time_duration),
    header: asString(core.header) ?? "",
    footer: asString(core.footer) ?? "",
    triggerType: asString(trigger.trigger_type) ?? "On demand",
    baseUrl: asString(core.base_url),
    savedSearchId: asString(core.saved_search_id),
    dashboardId: asString(core.dashboard_id),
    visualizationId: asString(core.visualization_id),
  };
}

// ---------------------------------------------------------------------------
// Report Definitions (the "templates" the plugin uses to render an instance).
// ---------------------------------------------------------------------------

interface DefinitionListHit {
  _id?: string;
  _source?: {
    report_definition?: ReportDefinitionPayload;
  } & Partial<ReportDefinitionPayload>;
}

interface DefinitionListResponse {
  data?: DefinitionListHit[] | { hits?: { hits?: DefinitionListHit[] } };
  hits?: { hits?: DefinitionListHit[] };
}

function summarizeDefinition(
  id: string,
  payload: ReportDefinitionPayload,
): ReportDefinitionSummary {
  const triggerType = payload.trigger?.trigger_type ?? "On demand";
  const enabled =
    payload.trigger?.trigger_type === "Schedule"
      ? Boolean(payload.trigger.trigger_params?.enabled)
      : true;
  const format =
    payload.report_params?.core_params?.report_format ??
    (payload.report_params?.core_params?.excel ? "xlsx" : "csv");
  return {
    id,
    name: payload.report_params?.report_name ?? "(unnamed)",
    source: payload.report_params?.report_source ?? "—",
    format: payload.report_params?.core_params?.excel ? "xlsx" : format,
    triggerType,
    enabled,
    lastUpdatedMs: payload.last_updated ?? payload.time_created ?? 0,
  };
}

export async function listReportDefinitions(): Promise<ReportDefinitionSummary[]> {
  // Wazuh Dashboard 2.x exposes the list at GET /api/reporting/reportDefinitions
  // (no `/_search`). Response shape: { data: [{ _id, _source: { report_definition: {...} } }] }.
  const data = await wazuhDashboardApi.get<DefinitionListResponse>(DEFINITIONS_PATH);
  const hits: DefinitionListHit[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data && "hits" in data.data ? data.data.hits?.hits : undefined) ??
      data?.hits?.hits ??
      [];
  return hits
    .map((hit) => {
      const id = hit._id;
      const payload =
        hit._source?.report_definition ??
        (hit._source as ReportDefinitionPayload | undefined);
      if (!id || !payload) return null;
      return summarizeDefinition(id, payload);
    })
    .filter((r): r is ReportDefinitionSummary => r !== null)
    .sort((a, b) => b.lastUpdatedMs - a.lastUpdatedMs);
}

interface DefinitionGetResponse {
  report_definition?: ReportDefinitionPayload;
  reportDefinition?: ReportDefinitionPayload;
  data?: ReportDefinitionPayload;
}

export async function getReportDefinition(
  id: string,
): Promise<ReportDefinitionPayload | null> {
  const data = await wazuhDashboardApi.get<DefinitionGetResponse>(
    `${DEFINITIONS_PATH}/${encodeURIComponent(id)}`,
  );
  return data?.report_definition ?? data?.reportDefinition ?? data?.data ?? null;
}

interface DefinitionMutateResponse {
  scheduler_response?: {
    reportDefinitionId?: string;
    reportDefinition?: { _id?: string };
  };
  schedulerResponse?: {
    reportDefinitionId?: string;
    reportDefinition?: { _id?: string };
  };
  reportDefinition?: { _id?: string };
  reportDefinitionId?: string;
  _id?: string;
}

function pickDefinitionId(resp: DefinitionMutateResponse): string | undefined {
  return (
    resp?.scheduler_response?.reportDefinitionId ??
    resp?.scheduler_response?.reportDefinition?._id ??
    resp?.schedulerResponse?.reportDefinitionId ??
    resp?.schedulerResponse?.reportDefinition?._id ??
    resp?.reportDefinitionId ??
    resp?.reportDefinition?._id ??
    resp?._id
  );
}

export async function createReportDefinition(
  payload: ReportDefinitionPayload,
): Promise<string> {
  const now = Date.now();
  const body: ReportDefinitionPayload = {
    ...payload,
    time_created: payload.time_created ?? now,
    last_updated: payload.last_updated ?? now,
  };
  const resp = await wazuhDashboardApi.post<DefinitionMutateResponse>(
    DEFINITION_CREATE_PATH,
    body,
  );
  const id = pickDefinitionId(resp);
  if (!id) {
    throw new Error("Server did not return a report definition id");
  }
  return id;
}

export async function updateReportDefinition(
  id: string,
  payload: ReportDefinitionPayload,
): Promise<void> {
  const body: ReportDefinitionPayload = {
    ...payload,
    last_updated: Date.now(),
  };
  await wazuhDashboardApi.put(
    `${DEFINITIONS_PATH}/${encodeURIComponent(id)}`,
    body,
  );
}

export async function deleteReportDefinition(id: string): Promise<void> {
  await wazuhDashboardApi.delete(
    `${DEFINITIONS_PATH}/${encodeURIComponent(id)}`,
  );
}

/**
 * Trigger a one-off render of a definition. The plugin produces a new
 * report instance synchronously and returns its data inline. We don't
 * consume the inline payload — we rely on the instance landing in
 * `listReportInstances()` and let the user download it from there.
 *
 * Wazuh Dashboard 2.x requires `timezone` and `dateFormat` query params
 * (used to format date columns inside CSV/PDF). Omitting either yields a
 * 400 from the plugin's request validator.
 */
export async function generateReport(definitionId: string): Promise<void> {
  await wazuhDashboardApi.post(
    `${GENERATE_PATH}/${encodeURIComponent(definitionId)}?${generateReportParams().toString()}`,
  );
}

interface InstanceFetchResponse {
  data?: string;
  filename?: string;
  queryUrl?: string;
}

// `generateReport` GET requires all four of these as non-empty strings; the
// OSD validator returns 400 if any are missing. Use the same set the POST
// path already uses.
function generateReportParams(): URLSearchParams {
  let timezone = "UTC";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    // keep UTC fallback
  }
  return new URLSearchParams({
    timezone,
    dateFormat: "YYYY-MM-DD HH:mm:ss",
    csvSeparator: ",",
    allowLeadingWildcards: "true",
  });
}

function wazuhDashboardOrigin(): string {
  return typeof window !== "undefined" && window._env_?.PROD_URL
    ? `${window._env_.PROD_URL}/wazuh-dashboard`
    : "/wazuh-dashboard";
}

function extensionOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i + 1).toLowerCase();
}

function triggerBrowserDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadDataPayload(
  data: string,
  filename: string,
  fileFormat: string,
): Promise<void> {
  // OSD ships XLSX as a `data:` URL string; CSV ships as raw text.
  if (fileFormat === "xlsx") {
    const resp = await fetch(data);
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    try {
      triggerBrowserDownload(url, filename);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return;
  }
  const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    triggerBrowserDownload(url, filename);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Download a previously generated report instance.
 *
 * The OSD reporting plugin's `GET /api/reporting/generateReport/{id}` returns
 * JSON, not a file: `{data, filename}` for CSV/XLSX, `{queryUrl}` for
 * PDF/PNG. So a plain `<a href>` cannot be used. CSV/XLSX → blob download;
 * PDF/PNG → open the dashboard URL with `?visualReportId=<id>`, which tells
 * OSD's renderer to produce the visual artifact in a new tab.
 */
export async function downloadReportInstance(
  instance: ReportInstance,
): Promise<void> {
  const resp = await wazuhDashboardApi.get<InstanceFetchResponse>(
    `${GENERATE_PATH}/${encodeURIComponent(instance.id)}?${generateReportParams().toString()}`,
  );
  const filename = resp.filename ?? `report-${instance.id}`;
  const fmt = extensionOf(filename) || instance.format;

  if (fmt === "csv" || fmt === "xlsx") {
    if (!resp.data) {
      throw new Error("Report payload is empty");
    }
    await downloadDataPayload(resp.data, filename, fmt);
    return;
  }

  const queryUrl = resp.queryUrl ?? instance.queryUrl;
  if (!queryUrl) {
    throw new Error("Report has no renderable URL");
  }
  const sep = queryUrl.includes("?") ? "&" : "?";
  const target = `${wazuhDashboardOrigin()}${queryUrl}${sep}${VISUAL_REPORT_PARAM}=${encodeURIComponent(instance.id)}`;
  const link = document.createElement("a");
  link.href = target;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
}
