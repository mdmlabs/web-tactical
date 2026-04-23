import { wazuhDashboardApi } from "@/api/wazuhDashboard";

interface WazuhApiHost {
  id: string;
  manager?: string;
  cluster_info?: Record<string, unknown>;
}

// Endpoints the Wazuh dashboard plugin has exposed across 4.x versions.
// Order matters — try the most recent first.
const API_HOSTS_ENDPOINTS = [
  "/api/wazuh-api/hosts/apis",
  "/api/wazuh-utilities/hosts/apis",
  "/utils/api",
];

let cachedApiId: string | null = null;

// The Wazuh plugin's /reports/modules/* route resolves the Wazuh Manager
// Bearer token from the `wz-token` cookie (server-api-client.js → asScoped).
// That cookie is set by POST /api/login with {idHost}. Native OSD UI calls
// this on user login; our proxy-based caller must do it explicitly, otherwise
// report generation fails with "5029 - Reporting was aborted (status 401)".
// The plugin endpoint is idempotent: it reuses a still-valid wz-token.
const primePromises: Map<string, Promise<void>> = new Map();

async function primeWazuhSession(apiId: string): Promise<void> {
  let p = primePromises.get(apiId);
  if (!p) {
    p = wazuhDashboardApi
      .post("/api/login", { idHost: apiId })
      .then(
        () => undefined,
        (err) => {
          primePromises.delete(apiId);
          throw err;
        },
      );
    primePromises.set(apiId, p);
  }
  await p;
}

async function resolveApiId(): Promise<string> {
  if (cachedApiId) return cachedApiId;

  const fromEnv =
    (process.env.WAZUH_API_ID as string | undefined) ||
    (typeof window !== "undefined"
      ? (window._env_?.WAZUH_API_ID as string | undefined)
      : undefined);
  if (fromEnv) {
    cachedApiId = fromEnv;
    return fromEnv;
  }

  for (const url of API_HOSTS_ENDPOINTS) {
    try {
      const hosts = await wazuhDashboardApi.get<WazuhApiHost[]>(url);
      const first = Array.isArray(hosts) ? hosts[0] : null;
      if (first?.id) {
        cachedApiId = first.id;
        return first.id;
      }
    } catch {
      // try next endpoint
    }
  }

  return "default";
}

/**
 * Wrapper for the Wazuh Dashboard reporting API.
 *
 * All calls proxy through /wazuh-dashboard/* → Wazuh Dashboard (OSD) server,
 * where the Wazuh plugin's reporting routes are registered.
 *
 * Path base (`/reports`) mirrors the Wazuh plugin routes used by Wazuh's own UI.
 * If a deployment exposes them under `/utils/reports`, change REPORTS_BASE below.
 */
const REPORTS_BASE = "/reports";

export type WazuhReportSection =
  | "general"
  | "fim"
  | "pm"
  | "audit"
  | "oscap"
  | "ciscat"
  | "virustotal"
  | "pci"
  | "gdpr"
  | "hipaa"
  | "nist"
  | "tsc"
  | "mitre"
  | "sca"
  | "docker"
  | "office"
  | "github"
  | "aws"
  | "gcp"
  | "vuls"
  | "it-hygiene";

export interface WazuhReportTimeRange {
  from: string; // ISO-8601 (Wazuh validator rejects date-math like "now-24h")
  to: string;
}

export interface WazuhReportBoolQuery {
  bool: {
    must: unknown[];
    must_not: unknown[];
    filter: unknown[];
    should: unknown[];
  };
}

export interface WazuhReportCommonBody {
  array?: unknown[];
  browserTimezone?: string;
  filters?: unknown[];
  serverSideQuery?: WazuhReportBoolQuery;
  time?: WazuhReportTimeRange;
  tables?: unknown[];
  searchBar?: string;
  indexPatternTitle?: string;
  apiId?: string;
  tab?: string;
  section?: string;
}

function emptyBoolQuery(): WazuhReportBoolQuery {
  return { bool: { must: [], must_not: [], filter: [], should: [] } };
}

export interface WazuhReportListItem {
  name: string;
  size: number;
  date: string;
}

export interface WazuhReportListResponse {
  reports: WazuhReportListItem[];
}

export interface WazuhReportCreateResponse {
  success: boolean;
  message?: string;
  filename?: string;
  name?: string;
}

function browserTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function defaultTimeRange(): WazuhReportTimeRange {
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
  return { from: from.toISOString(), to: to.toISOString() };
}

// Wazuh reporting body schema (verified against plugin source on 4.14.4):
// - `section`: top-level key in summary-tables-definitions — only "overview"
//   (module reports) or "agents" (agent reports) are valid. "general" throws
//   "Cannot read properties of undefined (reading 'general')".
// - `tab`: WAZUH_MODULES key — "general", "fim", "pci", "gdpr", etc. Drives
//   the report title/header.
// - `filters`: Kibana filter array (may be empty). Transformed by
//   sanitizeKibanaFilters to a human-readable string for the PDF header.
// - `serverSideQuery`: OpenSearch bool-query passed to base-query.js. Must
//   have shape {bool: {must, must_not, filter, should}} or report generation
//   throws "Cannot read properties of undefined (reading 'bool')".
// - `array`, `tables`: pre-rendered visualizations / tables from OSD. The
//   native UI fills these from Kibana's render engine; a headless caller
//   produces a minimal text/table-only report.
async function buildBody(
  section: "overview" | "agents",
  tab: WazuhReportSection | null,
  agent: string | false,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<Record<string, unknown>> {
  const apiId = await resolveApiId();
  await primeWazuhSession(apiId);
  return {
    array: [],
    browserTimezone: browserTz(),
    filters: [],
    serverSideQuery: emptyBoolQuery(),
    time: defaultTimeRange(),
    tables: [],
    searchBar: "",
    section,
    tab: tab ?? "general",
    agents: agent,
    indexPatternTitle: "wazuh-alerts-*",
    apiId,
    ...extra,
  };
}

export async function listReports(): Promise<WazuhReportListItem[]> {
  const data = await wazuhDashboardApi.get<
    WazuhReportListResponse | { data: WazuhReportListItem[] } | WazuhReportListItem[]
  >(REPORTS_BASE);
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as WazuhReportListResponse).reports)) {
    return (data as WazuhReportListResponse).reports;
  }
  return (data as { data: WazuhReportListItem[] }).data ?? [];
}

// The wz-token cookie expires (default Wazuh JWT ~15 min). If a report fires
// after expiry, the Wazuh plugin wraps the Manager's 401 as
// "5029 - Reporting was aborted (Request failed with status code 401)".
// Detect that signature, drop the cached prime, re-login, retry once.
function isExpiredWzTokenError(err: unknown): boolean {
  const e = err as { response?: { data?: { message?: string } } };
  const msg = e?.response?.data?.message;
  return typeof msg === "string" && msg.includes("5029") && msg.includes("401");
}

async function postReport<T>(path: string, body: Record<string, unknown>, apiId: string): Promise<T> {
  try {
    return await wazuhDashboardApi.post<T>(path, body);
  } catch (err) {
    if (!isExpiredWzTokenError(err)) throw err;
    primePromises.delete(apiId);
    await primeWazuhSession(apiId);
    return await wazuhDashboardApi.post<T>(path, body);
  }
}

export async function createModuleReport(
  tab: WazuhReportSection,
  agent: string | false = false,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = await buildBody("overview", tab, agent, extra);
  return postReport<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/modules/${encodeURIComponent(tab)}`,
    body,
    body.apiId as string,
  );
}

export async function createAgentReport(
  agentId: string,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = await buildBody("agents", null, agentId, extra);
  return postReport<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/agents/${encodeURIComponent(agentId)}`,
    body,
    body.apiId as string,
  );
}

export async function createGroupReport(
  groupId: string,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = await buildBody("agents", null, false, extra);
  return postReport<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/groups/${encodeURIComponent(groupId)}`,
    body,
    body.apiId as string,
  );
}

export function reportDownloadUrl(name: string): string {
  const base =
    typeof window !== "undefined" && window._env_?.PROD_URL
      ? `${window._env_.PROD_URL}/wazuh-dashboard`
      : "/wazuh-dashboard";
  return `${base}${REPORTS_BASE}/${encodeURIComponent(name)}`;
}

export async function deleteReport(name: string): Promise<void> {
  await wazuhDashboardApi.delete(
    `${REPORTS_BASE}/${encodeURIComponent(name)}`,
  );
}

/**
 * Extract a human-readable error message from a failed Wazuh reporting request.
 * The Wazuh plugin returns a body like { message: "...", statusCode: 400 }.
 */
export function extractWazuhError(err: unknown): string {
  const e = err as {
    response?: { status?: number; data?: { message?: string; error?: string } };
    message?: string;
  };
  const d = e.response?.data;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  if (e.response?.status) return `HTTP ${e.response.status}`;
  return e.message ?? String(err);
}
