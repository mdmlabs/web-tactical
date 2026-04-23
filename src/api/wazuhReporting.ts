import { wazuhDashboardApi } from "@/api/wazuhDashboard";

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

export interface WazuhReportCommonBody {
  array?: unknown[];
  browserTimezone?: string;
  filters?: unknown[];
  time?: WazuhReportTimeRange;
  tables?: unknown[];
  searchBar?: string;
  indexPatternTitle?: string;
  apiId?: string;
  tab?: string;
  section?: string;
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

function buildBody(
  section: WazuhReportSection | null,
  agent: string | false,
  extra?: Partial<WazuhReportCommonBody>,
): Record<string, unknown> {
  const s = section ?? "general";
  return {
    array: [],
    browserTimezone: browserTz(),
    filters: [],
    time: defaultTimeRange(),
    tables: [],
    searchBar: "",
    section: s,
    tab: s,
    agents: agent,
    indexPatternTitle: "wazuh-alerts-*",
    apiId: "default",
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

export async function createModuleReport(
  section: WazuhReportSection,
  agent: string | false = false,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = buildBody(section, agent, extra);
  return wazuhDashboardApi.post<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/modules/${encodeURIComponent(section)}`,
    body,
  );
}

export async function createAgentReport(
  agentId: string,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = buildBody(null, agentId, extra);
  return wazuhDashboardApi.post<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/agents/${encodeURIComponent(agentId)}`,
    body,
  );
}

export async function createGroupReport(
  groupId: string,
  extra?: Partial<WazuhReportCommonBody>,
): Promise<WazuhReportCreateResponse> {
  const body = buildBody(null, false, extra);
  return wazuhDashboardApi.post<WazuhReportCreateResponse>(
    `${REPORTS_BASE}/groups/${encodeURIComponent(groupId)}`,
    body,
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
