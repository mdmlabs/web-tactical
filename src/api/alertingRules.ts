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
 *   GET  /api/alerting/alerts              – list alerts
 *   POST /api/alerting/monitors/<id>/_acknowledge/alerts – acknowledge
 *
 * Notification channels are served by the Notifications plugin (the legacy
 * /api/alerting/destinations endpoint is deprecated in OSD 2.x — list returns
 * 400 and create echoes only _id metadata, so channels showed up as
 * "undefined" and disappeared on reload):
 *   GET    /api/notifications/get_configs
 *   POST   /api/notifications/create_config
 *   PUT    /api/notifications/update_config/<id>
 *   DELETE /api/notifications/delete_configs?config_id_list=<id>
 *   POST   /api/notifications/test_message/<id>
 *
 * Telegram remains a UI-only alias persisted as a custom webhook
 * (URL https://api.telegram.org/bot<token>/sendMessage?chat_id=<id>,
 * Content-Type: application/json), detected on read by URL pattern.
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

// OpenSearch Notifications plugin (channels) shapes
interface NotificationsWebhook {
  url: string;
  method?: string;
  header_params?: Record<string, string>;
}

interface NotificationsConfigBody {
  name: string;
  description?: string;
  config_type: string;
  is_enabled: boolean;
  slack?: { url: string };
  chime?: { url: string };
  webhook?: NotificationsWebhook;
  email?: {
    email_account_id: string;
    recipient_list?: { recipient: string }[];
    email_group_id_list?: string[];
  };
  sns?: { topic_arn: string; role_arn?: string };
  microsoft_teams?: { url: string };
}

interface NotificationsConfigItem {
  config_id: string;
  last_updated_time_ms: number;
  created_time_ms: number;
  config: NotificationsConfigBody;
}

interface NotificationsListResp {
  total_hits: number;
  config_list: NotificationsConfigItem[];
}

interface NotificationsCreateResp {
  config_id: string;
}

const CHANNEL_CONFIG_TYPES = [
  "slack",
  "email",
  "webhook",
  "chime",
  "sns",
  "ses",
  "microsoft_teams",
] as const;

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

function isTelegramWebhook(url: string): boolean {
  return /^https?:\/\/api\.telegram\.org\/bot[^/]+\/sendMessage/i.test(url);
}

function parseTelegramFromUrl(url: string): { bot_token: string; chat_id: string } | null {
  if (!isTelegramWebhook(url)) return null;
  const match = url.match(/\/bot([^/]+)\/sendMessage/i);
  const bot_token = match ? match[1] : "";
  let chat_id = "";
  try {
    chat_id = new URL(url).searchParams.get("chat_id") || "";
  } catch {
    /* fall through */
  }
  return { bot_token, chat_id };
}

function splitUrlAndQuery(url: string): { base: string; query_params: Record<string, string> } {
  if (!url) return { base: "", query_params: {} };
  try {
    const u = new URL(url);
    const query_params: Record<string, string> = {};
    u.searchParams.forEach((v, k) => {
      query_params[k] = v;
    });
    u.search = "";
    const base = u.toString().replace(/\?$/, "");
    return { base, query_params };
  } catch {
    return { base: url, query_params: {} };
  }
}

function appendQueryToUrl(url: string, params?: Record<string, string>): string {
  if (!url) return "";
  if (!params || Object.keys(params).length === 0) return url;
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
  }
}

function notificationConfigToChannel(item: NotificationsConfigItem): NotificationChannel {
  const cfg = item.config || ({} as NotificationsConfigBody);
  let configType: NotificationChannel["config_type"] = (cfg.config_type || "") as NotificationChannel["config_type"];
  let config: NotificationChannel["config"] = {};

  if (cfg.slack) {
    configType = "slack";
    config = { slack: cfg.slack };
  } else if (cfg.chime) {
    configType = "chime";
    config = { chime: cfg.chime };
  } else if (cfg.webhook) {
    const tg = parseTelegramFromUrl(cfg.webhook.url || "");
    if (tg) {
      configType = "telegram";
      config = {
        telegram: tg,
        webhook: {
          url: cfg.webhook.url,
          method: cfg.webhook.method || "POST",
          header_params: cfg.webhook.header_params,
        },
      };
    } else {
      const { base, query_params } = splitUrlAndQuery(cfg.webhook.url || "");
      configType = "webhook";
      config = {
        webhook: {
          url: base,
          method: cfg.webhook.method || "POST",
          header_params: cfg.webhook.header_params,
          ...(Object.keys(query_params).length > 0 ? { query_params } : {}),
        },
      };
    }
  } else if (cfg.email) {
    configType = "email";
    config = {
      email: {
        email_account_id: cfg.email.email_account_id,
        recipients: (cfg.email.recipient_list || []).map((r) => r.recipient),
      },
    };
  } else if (cfg.sns) {
    configType = "sns";
    config = { sns: cfg.sns };
  }

  return {
    config_id: item.config_id,
    name: cfg.name || "",
    description: cfg.description || "",
    config_type: configType,
    is_enabled: cfg.is_enabled !== false,
    config,
    created_time_ms: item.created_time_ms || item.last_updated_time_ms || 0,
    last_updated_time_ms: item.last_updated_time_ms || 0,
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
    queryParams.monitorIds = params.monitor_id;
  }

  const resp = await wazuhDashboardApi.get<DashboardAlertsResp>(
    "/api/alerting/alerts",
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
// Notification channels API (Notifications plugin)
// ============================

function getConfigsPath(): string {
  const params = new URLSearchParams();
  params.set("from_index", "0");
  params.set("max_items", "200");
  params.set("sort_field", "name");
  params.set("sort_order", "asc");
  for (const t of CHANNEL_CONFIG_TYPES) params.append("config_type", t);
  return `/api/notifications/get_configs?${params.toString()}`;
}

export async function fetchChannels(): Promise<NotificationChannel[]> {
  try {
    const resp = await wazuhDashboardApi.get<NotificationsListResp>(getConfigsPath());
    return (resp.config_list || []).map(notificationConfigToChannel);
  } catch (e) {
    console.error("[Alerting] Failed to load channels:", e);
    return [];
  }
}

export async function createChannel(payload: Partial<NotificationChannel>): Promise<NotificationChannel> {
  const config = buildNotificationConfig(payload);
  const resp = await wazuhDashboardApi.post<NotificationsCreateResp>(
    "/api/notifications/create_config",
    { config },
  );
  const now = Date.now();
  return notificationConfigToChannel({
    config_id: resp.config_id,
    config,
    created_time_ms: now,
    last_updated_time_ms: now,
  });
}

export async function updateChannel(
  id: string,
  payload: Partial<NotificationChannel>,
): Promise<NotificationChannel> {
  const config = buildNotificationConfig(payload);
  await wazuhDashboardApi.put<NotificationsCreateResp>(
    `/api/notifications/update_config/${encodeURIComponent(id)}`,
    { config },
  );
  const now = Date.now();
  return notificationConfigToChannel({
    config_id: id,
    config,
    created_time_ms: now,
    last_updated_time_ms: now,
  });
}

export async function deleteChannel(id: string): Promise<void> {
  await wazuhDashboardApi.delete(
    `/api/notifications/delete_configs?config_id_list=${encodeURIComponent(id)}`,
  );
}

export async function testChannel(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await wazuhDashboardApi.post<{
      status_list?: { delivery_status?: { status_code?: string; status_text?: string } }[];
    }>(`/api/notifications/test_message/${encodeURIComponent(id)}`);
    const status = resp.status_list?.[0]?.delivery_status;
    const code = status?.status_code ?? "200";
    const ok = String(code).startsWith("2");
    return { success: ok, message: status?.status_text || (ok ? "Test message sent" : "Test failed") };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Test failed";
    return { success: false, message: msg };
  }
}

function buildWebhookFromUi(
  w: NonNullable<NotificationChannel["config"]["webhook"]>,
): NotificationsWebhook {
  return {
    url: appendQueryToUrl(w.url || "", w.query_params),
    method: (w.method || "POST").toUpperCase(),
    ...(w.header_params && Object.keys(w.header_params).length > 0
      ? { header_params: { ...w.header_params } }
      : {}),
  };
}

function buildTelegramWebhook(tg: { bot_token: string; chat_id: string }): NotificationsWebhook {
  const baseUrl = `https://api.telegram.org/bot${tg.bot_token}/sendMessage`;
  const url = tg.chat_id ? appendQueryToUrl(baseUrl, { chat_id: tg.chat_id }) : baseUrl;
  return {
    url,
    method: "POST",
    header_params: { "Content-Type": "application/json" },
  };
}

function buildNotificationConfig(ch: Partial<NotificationChannel>): NotificationsConfigBody {
  const uiType = ch.config_type || "slack";
  // Telegram is a UI alias persisted as a webhook config on the OpenSearch side.
  const backendType = uiType === "telegram" ? "webhook" : uiType;

  const body: NotificationsConfigBody = {
    name: ch.name || "Untitled Channel",
    description: ch.description || "",
    config_type: backendType,
    is_enabled: ch.is_enabled !== false,
  };

  const config = (ch.config || {}) as NotificationChannel["config"];
  if (uiType === "slack" && config.slack) {
    body.slack = config.slack;
  } else if (uiType === "chime" && config.chime) {
    body.chime = config.chime;
  } else if (uiType === "webhook" && config.webhook) {
    body.webhook = buildWebhookFromUi(config.webhook);
  } else if (uiType === "telegram" && config.telegram) {
    body.webhook = buildTelegramWebhook(config.telegram);
  } else if (uiType === "email" && config.email) {
    const e = config.email as {
      email_account_id?: string;
      sender_id?: string;
      recipients?: string[];
      recipient_list?: { recipient: string }[];
      email_group_id_list?: string[];
    };
    body.email = {
      email_account_id: e.email_account_id || e.sender_id || "",
      recipient_list:
        e.recipient_list ?? (e.recipients || []).map((r) => ({ recipient: r })),
      email_group_id_list: e.email_group_id_list || [],
    };
  } else if (uiType === "sns" && config.sns) {
    const s = config.sns as { topic_arn: string; role_arn?: string };
    body.sns = { topic_arn: s.topic_arn, ...(s.role_arn ? { role_arn: s.role_arn } : {}) };
  }
  return body;
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
