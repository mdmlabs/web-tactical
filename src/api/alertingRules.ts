import { wazuhDashboardApi } from "@/api/wazuhDashboard";
import type {
  Monitor,
  AlertEntry,
  NotificationChannel,
  SmtpSender,
  SesSender,
  RecipientGroup,
  MonitorTrigger,
} from "@/types/alerting";

/**
 * Alerting API service.
 *
 * Calls the Wazuh Dashboard REST API (OpenSearch Dashboards Alerting plugin)
 * which internally communicates with the OpenSearch Alerting plugin.
 *
 * Wazuh Dashboard endpoints (proxied via /wazuh-dashboard):
 *   GET  /api/alerting/monitors           – list monitors
 *   POST /api/alerting/monitors           – create monitor
 *   GET  /api/alerting/monitors/<id>      – get monitor
 *   PUT  /api/alerting/monitors/<id>      – update monitor
 *   DELETE /api/alerting/monitors/<id>    – delete monitor
 *   GET  /api/alerting/monitors/alerts    – list alerts
 *   POST /api/alerting/monitors/<id>/_acknowledge/alerts – acknowledge
 *   GET  /api/alerting/destinations       – list destinations (channels)
 *   POST /api/alerting/destinations       – create destination
 */

// ============================
// Wazuh Dashboard response shapes
// ============================

interface DashboardMonitorItem {
  id: string;
  version: number;
  name: string;
  seqNo: number;
  primaryTerm: number;
  monitor: {
    type: string;
    schema_version: number;
    name: string;
    monitor_type: string;
    enabled: boolean;
    schedule: {
      period: {
        interval: number;
        unit: string;
      };
    };
    inputs: {
      search: {
        indices: string[];
        query: Record<string, unknown>;
      };
    }[];
    triggers: DashboardTrigger[];
    last_update_time: number;
    enabled_time?: number;
  };
}

interface DashboardTrigger {
  query_level_trigger?: DashboardTriggerContent;
  bucket_level_trigger?: DashboardTriggerContent;
  document_level_trigger?: DashboardTriggerContent;
  [key: string]: DashboardTriggerContent | undefined;
}

interface DashboardTriggerContent {
  id: string;
  name: string;
  severity: string;
  condition: {
    script: {
      source: string;
      lang: string;
    };
  };
  actions: {
    id: string;
    name: string;
    destination_id: string;
    message_template: {
      source: string;
      lang?: string;
    };
    throttle_enabled: boolean;
    throttle?: {
      value: number;
      unit: string;
    };
  }[];
}

interface DashboardMonitorsResp {
  ok: boolean;
  monitors: DashboardMonitorItem[];
  totalMonitors: number;
}

interface DashboardMonitorResp {
  ok: boolean;
  resp: string;
  id: string;
  version: number;
  seqNo: number;
  primaryTerm: number;
}

interface DashboardCreateResp {
  ok: boolean;
  resp: {
    _id: string;
    _version: number;
    _seq_no: number;
    _primary_term: number;
    monitor: DashboardMonitorItem["monitor"];
  };
}

interface DashboardAlert {
  id: string;
  version: number;
  monitor_id: string;
  monitor_name: string;
  trigger_id: string;
  trigger_name: string;
  state: string;
  severity: string;
  start_time: number;
  last_notification_time: number | null;
  end_time: number | null;
  acknowledged_time: number | null;
  error_message: string | null;
}

interface DashboardAlertsResp {
  ok: boolean;
  alerts: DashboardAlert[];
  totalAlerts: number;
}

interface DashboardCustomWebhook {
  url?: string;
  scheme?: string;
  host?: string;
  port?: number;
  path?: string;
  method?: string;
  header_params?: Record<string, string>;
  query_params?: Record<string, string>;
}

interface DashboardDestination {
  id: string;
  type: string;
  name: string;
  schema_version: number;
  seq_no: number;
  primary_term: number;
  last_update_time: number;
  slack?: { url: string };
  chime?: { url: string };
  custom_webhook?: DashboardCustomWebhook;
  email?: { email_account_id: string; recipients: string[] };
}

interface DashboardDestinationsResp {
  ok: boolean;
  destinations: DashboardDestination[];
  totalDestinations: number;
}

// ============================
// Transform helpers
// ============================

function normalizeTrigger(raw: DashboardTrigger): MonitorTrigger {
  const content =
    raw.query_level_trigger ||
    raw.bucket_level_trigger ||
    raw.document_level_trigger ||
    Object.values(raw).find((v) => v && typeof v === "object" && "name" in v);

  if (!content) {
    return { name: "unknown", severity: "3", condition: { script: "" }, actions: [] };
  }

  return {
    id: content.id,
    name: content.name,
    severity: content.severity,
    condition: {
      script: content.condition?.script?.source ?? "",
    },
    actions: (content.actions || []).map((a) => ({
      id: a.id,
      name: a.name,
      destination_id: a.destination_id,
      message_template: a.message_template?.source ?? "",
      throttle_enabled: a.throttle_enabled ?? false,
      throttle: a.throttle,
    })),
  };
}

function msToISO(ms: number | null | undefined): string | undefined {
  if (!ms) return undefined;
  return new Date(ms).toISOString();
}

function monitorFromDashboard(item: DashboardMonitorItem): Monitor {
  const src = item.monitor;
  return {
    id: item.id,
    name: src.name || item.name,
    enabled: src.enabled,
    type: mapMonitorType(src.monitor_type),
    monitor_type: src.monitor_type || "query_level_monitor",
    definition_method: "visual",
    schedule: {
      period: {
        interval: src.schedule?.period?.interval ?? 10,
        unit: (src.schedule?.period?.unit?.toLowerCase() ?? "minutes") as Monitor["schedule"]["period"]["unit"],
      },
    },
    inputs: (src.inputs || []).map((inp) => ({
      search: {
        indices: inp.search?.indices || [],
        query: inp.search?.query || {},
      },
    })),
    triggers: (src.triggers || []).map(normalizeTrigger),
    last_update_time: msToISO(src.last_update_time) || new Date().toISOString(),
    enabled_time: msToISO(src.enabled_time),
    active_count: 0,
    acknowledged_count: 0,
    errors_count: 0,
    ignored_count: 0,
    associations_count: 0,
    version: item.version,
  };
}

function mapMonitorType(osType: string): Monitor["type"] {
  switch (osType) {
    case "query_level_monitor": return "per_query";
    case "bucket_level_monitor": return "per_bucket";
    case "cluster_metrics_monitor": return "per_cluster_metrics";
    case "doc_level_monitor": return "per_document";
    default: return "per_query";
  }
}

function alertFromDashboard(raw: DashboardAlert): AlertEntry {
  return {
    id: raw.id,
    monitor_id: raw.monitor_id,
    monitor_name: raw.monitor_name || "",
    trigger_id: raw.trigger_id,
    trigger_name: raw.trigger_name || "",
    state: (raw.state?.toLowerCase() || "active") as AlertEntry["state"],
    severity: raw.severity || "3",
    start_time: msToISO(raw.start_time) || new Date().toISOString(),
    last_notification_time: msToISO(raw.last_notification_time),
    end_time: msToISO(raw.end_time),
    acknowledged_time: msToISO(raw.acknowledged_time),
    error_message: raw.error_message || undefined,
  };
}

function buildWebhookUrl(w: DashboardCustomWebhook): string {
  if (w.url) return w.url;
  if (w.host) {
    const scheme = (w.scheme || "https").toLowerCase();
    const port = w.port ? `:${w.port}` : "";
    const path = w.path || "";
    return `${scheme}://${w.host}${port}${path}`;
  }
  return "";
}

function isTelegramWebhook(url: string): boolean {
  return /^https?:\/\/api\.telegram\.org\/bot[^/]+\/sendMessage/i.test(url);
}

function parseTelegramWebhook(w: DashboardCustomWebhook): { bot_token: string; chat_id: string } | null {
  const url = buildWebhookUrl(w);
  if (!isTelegramWebhook(url)) return null;
  const match = url.match(/\/bot([^/]+)\/sendMessage/i);
  const bot_token = match ? match[1] : "";
  const chat_id =
    w.query_params?.chat_id ||
    (() => {
      try {
        const u = new URL(url);
        return u.searchParams.get("chat_id") || "";
      } catch {
        return "";
      }
    })();
  return { bot_token, chat_id };
}

function destinationToChannel(d: DashboardDestination): NotificationChannel {
  // Detect Telegram (UI alias) before generic webhook.
  let configType: NotificationChannel["config_type"] = d.type as NotificationChannel["config_type"];
  let config: NotificationChannel["config"] = {};

  if (d.slack) {
    configType = "slack";
    config = { slack: d.slack };
  } else if (d.chime) {
    configType = "chime";
    config = { chime: d.chime };
  } else if (d.custom_webhook) {
    const tg = parseTelegramWebhook(d.custom_webhook);
    if (tg) {
      configType = "telegram";
      config = {
        telegram: tg,
        webhook: {
          url: buildWebhookUrl(d.custom_webhook),
          method: d.custom_webhook.method || "POST",
          header_params: d.custom_webhook.header_params,
          query_params: d.custom_webhook.query_params,
        },
      };
    } else {
      configType = "webhook";
      config = {
        webhook: {
          url: buildWebhookUrl(d.custom_webhook),
          method: d.custom_webhook.method || "POST",
          header_params: d.custom_webhook.header_params,
          query_params: d.custom_webhook.query_params,
        },
      };
    }
  } else if (d.email) {
    configType = "email";
    config = { email: d.email };
  }

  return {
    config_id: d.id,
    name: d.name,
    description: "",
    config_type: configType,
    is_enabled: true,
    config,
    created_time_ms: d.last_update_time || 0,
    last_updated_time_ms: d.last_update_time || 0,
  };
}

// ============================
// Monitors API
// ============================

export async function fetchMonitors(): Promise<Monitor[]> {
  const resp = await wazuhDashboardApi.get<DashboardMonitorsResp>(
    "/api/alerting/monitors",
    {
      from: 0,
      size: 1000,
      search: "",
      sortField: "name",
      sortDirection: "desc",
      state: "all",
    },
  );

  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error for monitors list");
  }

  return (resp.monitors || []).map(monitorFromDashboard);
}

export async function fetchMonitor(id: string): Promise<Monitor> {
  const resp = await wazuhDashboardApi.get<DashboardMonitorResp>(
    `/api/alerting/monitors/${encodeURIComponent(id)}`,
  );

  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error for monitor detail");
  }

  const monitorData = typeof resp.resp === "string" ? JSON.parse(resp.resp) : resp.resp;

  return {
    id: resp.id,
    name: monitorData.name || "",
    enabled: monitorData.enabled ?? true,
    type: mapMonitorType(monitorData.monitor_type || "query_level_monitor"),
    monitor_type: monitorData.monitor_type || "query_level_monitor",
    definition_method: "visual",
    schedule: {
      period: {
        interval: monitorData.schedule?.period?.interval ?? 10,
        unit: (monitorData.schedule?.period?.unit?.toLowerCase() ?? "minutes") as Monitor["schedule"]["period"]["unit"],
      },
    },
    inputs: (monitorData.inputs || []).map((inp: Record<string, unknown>) => {
      const search = inp.search as { indices?: string[]; query?: Record<string, unknown> } | undefined;
      return {
        search: {
          indices: search?.indices || [],
          query: search?.query || {},
        },
      };
    }),
    triggers: (monitorData.triggers || []).map(normalizeTrigger),
    last_update_time: msToISO(monitorData.last_update_time) || new Date().toISOString(),
    enabled_time: msToISO(monitorData.enabled_time),
    active_count: 0,
    acknowledged_count: 0,
    errors_count: 0,
    ignored_count: 0,
    associations_count: 0,
    version: resp.version,
  };
}

export async function createMonitor(payload: Partial<Monitor>): Promise<Monitor> {
  const body = buildMonitorPayload(payload);
  const resp = await wazuhDashboardApi.post<DashboardCreateResp>(
    "/api/alerting/monitors",
    body,
  );

  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error creating monitor");
  }

  const created = resp.resp;
  return {
    id: created._id,
    name: payload.name || "",
    enabled: payload.enabled !== false,
    type: payload.type || "per_query",
    monitor_type: payload.monitor_type || "query_level_monitor",
    definition_method: payload.definition_method || "visual",
    schedule: payload.schedule || { period: { interval: 10, unit: "minutes" } },
    inputs: payload.inputs || [],
    triggers: payload.triggers || [],
    last_update_time: new Date().toISOString(),
    active_count: 0,
    acknowledged_count: 0,
    errors_count: 0,
    ignored_count: 0,
    associations_count: 0,
    version: created._version,
  };
}

export async function updateMonitor(id: string, payload: Partial<Monitor>): Promise<Monitor> {
  const body = buildMonitorPayload(payload);
  const resp = await wazuhDashboardApi.put<DashboardCreateResp>(
    `/api/alerting/monitors/${encodeURIComponent(id)}`,
    body,
  );

  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error updating monitor");
  }

  return {
    id,
    name: payload.name || "",
    enabled: payload.enabled !== false,
    type: payload.type || "per_query",
    monitor_type: payload.monitor_type || "query_level_monitor",
    definition_method: payload.definition_method || "visual",
    schedule: payload.schedule || { period: { interval: 10, unit: "minutes" } },
    inputs: payload.inputs || [],
    triggers: payload.triggers || [],
    last_update_time: new Date().toISOString(),
    active_count: 0,
    acknowledged_count: 0,
    errors_count: 0,
    ignored_count: 0,
    associations_count: 0,
    version: resp.resp?._version || (payload as Monitor).version || 0,
  };
}

export async function deleteMonitor(id: string): Promise<void> {
  const resp = await wazuhDashboardApi.delete<{ ok: boolean }>(
    `/api/alerting/monitors/${encodeURIComponent(id)}`,
  );
  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error deleting monitor");
  }
}

export async function enableMonitor(id: string): Promise<Monitor> {
  const current = await fetchMonitor(id);
  return updateMonitor(id, { ...current, enabled: true });
}

export async function disableMonitor(id: string): Promise<Monitor> {
  const current = await fetchMonitor(id);
  return updateMonitor(id, { ...current, enabled: false });
}

function buildMonitorPayload(m: Partial<Monitor>): Record<string, unknown> {
  const monitorType = m.monitor_type ||
    (m.type === "per_query" ? "query_level_monitor"
      : m.type === "per_bucket" ? "bucket_level_monitor"
        : m.type === "per_cluster_metrics" ? "cluster_metrics_monitor"
          : m.type === "per_document" ? "doc_level_monitor"
            : "query_level_monitor");

  const triggerKey = monitorType === "bucket_level_monitor" ? "bucket_level_trigger"
    : monitorType === "doc_level_monitor" ? "document_level_trigger"
      : "query_level_trigger";

  return {
    type: "monitor",
    name: m.name || "Untitled Monitor",
    monitor_type: monitorType,
    enabled: m.enabled !== false,
    schedule: {
      period: {
        interval: m.schedule?.period?.interval ?? 10,
        unit: (m.schedule?.period?.unit ?? "MINUTES").toUpperCase(),
      },
    },
    inputs: (m.inputs || []).map((inp) => ({
      search: {
        indices: inp.search.indices,
        query: inp.search.query,
      },
    })),
    triggers: (m.triggers || []).map((t) => ({
      [triggerKey]: {
        name: t.name,
        severity: t.severity || "3",
        condition: {
          script: {
            source: t.condition?.script || "ctx.results[0].hits.total.value > 0",
            lang: "painless",
          },
        },
        actions: (t.actions || []).map((a) => ({
          name: a.name,
          destination_id: a.destination_id,
          message_template: {
            source: a.message_template || "Monitor {{ctx.monitor.name}} triggered!",
            lang: "mustache",
          },
          throttle_enabled: a.throttle_enabled || false,
          ...(a.throttle ? { throttle: a.throttle } : {}),
        })),
      },
    })),
  };
}

// ============================
// Alerts API
// ============================

export async function fetchAlerts(params?: {
  monitor_id?: string;
}): Promise<AlertEntry[]> {
  const queryParams: Record<string, unknown> = {
    from: 0,
    size: 1000,
    sortField: "start_time",
    sortDirection: "desc",
  };
  if (params?.monitor_id) {
    queryParams.monitorId = params.monitor_id;
  }

  const resp = await wazuhDashboardApi.get<DashboardAlertsResp>(
    "/api/alerting/monitors/alerts",
    queryParams,
  );

  if (!resp.ok) {
    throw new Error("MDM-Lab Dashboard returned error for alerts");
  }

  return (resp.alerts || []).map(alertFromDashboard);
}

export async function acknowledgeAlerts(alertIds: string[], monitorId: string): Promise<void> {
  await wazuhDashboardApi.post(
    `/api/alerting/monitors/${encodeURIComponent(monitorId)}/_acknowledge/alerts`,
    { alerts: alertIds },
  );
}

// ============================
// Destinations API (notification channels)
// ============================

export async function fetchChannels(): Promise<NotificationChannel[]> {
  try {
    const resp = await wazuhDashboardApi.get<DashboardDestinationsResp>(
      "/api/alerting/destinations",
      { from: 0, size: 200 },
    );
    if (!resp.ok) return [];
    return (resp.destinations || []).map(destinationToChannel);
  } catch {
    return [];
  }
}

export async function createChannel(payload: Partial<NotificationChannel>): Promise<NotificationChannel> {
  const body = buildDestinationPayload(payload);
  const resp = await wazuhDashboardApi.post<{ ok: boolean; resp: DashboardDestination }>(
    "/api/alerting/destinations",
    body,
  );
  return destinationToChannel(resp.resp || { ...body, id: "new" } as unknown as DashboardDestination);
}

export async function updateChannel(id: string, payload: Partial<NotificationChannel>): Promise<NotificationChannel> {
  const body = buildDestinationPayload(payload);
  const resp = await wazuhDashboardApi.put<{ ok: boolean; resp: DashboardDestination }>(
    `/api/alerting/destinations/${encodeURIComponent(id)}`,
    body,
  );
  return destinationToChannel(resp.resp || { ...body, id } as unknown as DashboardDestination);
}

export async function deleteChannel(id: string): Promise<void> {
  await wazuhDashboardApi.delete(`/api/alerting/destinations/${encodeURIComponent(id)}`);
}

export async function testChannel(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await wazuhDashboardApi.post(`/api/alerting/destinations/${encodeURIComponent(id)}/test`);
    return { success: true, message: "Test message sent" };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Test failed";
    return { success: false, message: msg };
  }
}

function normalizeWebhook(w: NonNullable<NotificationChannel["config"]["webhook"]>): DashboardCustomWebhook {
  const out: DashboardCustomWebhook = {};
  if (w.url) out.url = w.url;
  out.method = (w.method || "POST").toUpperCase();
  if (w.header_params && Object.keys(w.header_params).length > 0) {
    out.header_params = { ...w.header_params };
  }
  if (w.query_params && Object.keys(w.query_params).length > 0) {
    out.query_params = { ...w.query_params };
  }
  return out;
}

function buildTelegramWebhook(tg: { bot_token: string; chat_id: string }): DashboardCustomWebhook {
  const url = `https://api.telegram.org/bot${tg.bot_token}/sendMessage`;
  const out: DashboardCustomWebhook = {
    url,
    method: "POST",
    header_params: { "Content-Type": "application/json" },
  };
  if (tg.chat_id) {
    out.query_params = { chat_id: tg.chat_id };
  }
  return out;
}

function buildDestinationPayload(ch: Partial<NotificationChannel>): Record<string, unknown> {
  const uiType = ch.config_type || "slack";
  // Telegram is a UI alias persisted as custom_webhook on the OpenSearch side.
  const dashboardType = uiType === "telegram" || uiType === "webhook" ? "custom_webhook" : uiType;

  const base: Record<string, unknown> = {
    type: dashboardType,
    name: ch.name || "Untitled Destination",
  };

  const config = ch.config || {};
  if (uiType === "slack" && config.slack) {
    base.slack = config.slack;
  } else if (uiType === "chime" && config.chime) {
    base.chime = config.chime;
  } else if (uiType === "webhook" && config.webhook) {
    base.custom_webhook = normalizeWebhook(config.webhook);
  } else if (uiType === "telegram" && config.telegram) {
    base.custom_webhook = buildTelegramWebhook(config.telegram);
  } else if (uiType === "email" && config.email) {
    base.email = config.email;
  }
  return base;
}

// ============================
// Email Senders and Recipient Groups
// ============================

export async function fetchSmtpSenders(): Promise<SmtpSender[]> {
  try {
    const resp = await wazuhDashboardApi.get<{
      ok: boolean;
      email_accounts: { id: string; name: string; email: string; host: string; port: number; method: string }[];
    }>("/api/alerting/destinations/email_accounts", { from: 0, size: 200 });
    if (!resp.ok) return [];
    return (resp.email_accounts || []).map((acct) => ({
      config_id: acct.id,
      name: acct.name,
      from_address: acct.email,
      host: acct.host,
      port: acct.port,
      method: (acct.method?.toLowerCase() || "none") as SmtpSender["method"],
    }));
  } catch {
    return [];
  }
}

export async function createSmtpSender(payload: Partial<SmtpSender>): Promise<SmtpSender> {
  const body = {
    name: payload.name,
    email: payload.from_address,
    host: payload.host,
    port: payload.port || 587,
    method: (payload.method || "starttls").toUpperCase(),
  };
  const resp = await wazuhDashboardApi.post<{ ok: boolean; resp: { _id: string } }>(
    "/api/alerting/destinations/email_accounts",
    body,
  );
  return {
    config_id: resp.resp?._id || "",
    name: payload.name || "",
    from_address: payload.from_address || "",
    host: payload.host || "",
    port: payload.port || 587,
    method: payload.method || "starttls",
  };
}

export async function deleteSmtpSender(id: string): Promise<void> {
  await wazuhDashboardApi.delete(`/api/alerting/destinations/email_accounts/${encodeURIComponent(id)}`);
}

export async function fetchSesSenders(): Promise<SesSender[]> {
  return [];
}

export async function createSesSender(payload: Partial<SesSender>): Promise<SesSender> {
  return {
    config_id: Date.now().toString(),
    name: payload.name || "",
    from_address: payload.from_address || "",
    aws_region: payload.aws_region || "",
    role_arn: payload.role_arn || "",
  };
}

export async function deleteSesSender(id: string): Promise<void> {
  void id;
}

export async function fetchRecipientGroups(): Promise<RecipientGroup[]> {
  try {
    const resp = await wazuhDashboardApi.get<{
      ok: boolean;
      email_groups: { id: string; name: string; emails: { email: string }[] }[];
    }>("/api/alerting/destinations/email_groups", { from: 0, size: 200 });
    if (!resp.ok) return [];
    return (resp.email_groups || []).map((grp) => ({
      config_id: grp.id,
      name: grp.name,
      description: "",
      email_group: {
        recipient: (grp.emails || []).map((e) => ({ recipient: e.email })),
      },
    }));
  } catch {
    return [];
  }
}

export async function createRecipientGroup(payload: Partial<RecipientGroup>): Promise<RecipientGroup> {
  const body = {
    name: payload.name,
    emails: (payload.email_group?.recipient || []).map((r) => ({ email: r.recipient })),
  };
  const resp = await wazuhDashboardApi.post<{ ok: boolean; resp: { _id: string } }>(
    "/api/alerting/destinations/email_groups",
    body,
  );
  return {
    config_id: resp.resp?._id || "",
    name: payload.name || "",
    description: payload.description || "",
    email_group: payload.email_group || { recipient: [] },
  };
}

export async function deleteRecipientGroup(id: string): Promise<void> {
  await wazuhDashboardApi.delete(`/api/alerting/destinations/email_groups/${encodeURIComponent(id)}`);
}
