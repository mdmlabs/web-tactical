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
 *
 * Notification channels are served by the Notifications plugin (the legacy
 * /api/alerting/destinations endpoint is deprecated in OSD 2.x and returns
 * 400/empty on this build):
 *   GET    /api/notifications/get_configs
 *   POST   /api/notifications/create_config
 *   PUT    /api/notifications/update_config/<id>
 *   DELETE /api/notifications/delete_configs?config_id_list=<id>
 *   POST   /api/notifications/test_message/<id>
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
interface NotificationsConfigBody {
  name: string;
  description?: string;
  config_type: string;
  is_enabled: boolean;
  slack?: { url: string };
  chime?: { url: string };
  webhook?: { url: string; method?: string; header_params?: Record<string, string> };
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

function notificationConfigToChannel(item: NotificationsConfigItem): NotificationChannel {
  const cfg = item.config || ({} as NotificationsConfigBody);
  const sub: Record<string, unknown> = {};
  if (cfg.slack) sub.slack = cfg.slack;
  if (cfg.chime) sub.chime = cfg.chime;
  if (cfg.webhook) sub.webhook = cfg.webhook;
  if (cfg.email) sub.email = cfg.email;
  if (cfg.sns) sub.sns = cfg.sns;
  if (cfg.microsoft_teams) sub.microsoft_teams = cfg.microsoft_teams;
  return {
    config_id: item.config_id,
    name: cfg.name || "",
    description: cfg.description || "",
    config_type: (cfg.config_type || "") as NotificationChannel["config_type"],
    is_enabled: cfg.is_enabled !== false,
    config: sub,
    created_time_ms: item.created_time_ms || item.last_updated_time_ms || 0,
    last_updated_time_ms: item.last_updated_time_ms || 0,
  };
}

function buildNotificationConfig(ch: Partial<NotificationChannel>): NotificationsConfigBody {
  const type = ch.config_type || "slack";
  const sub = (ch.config || {}) as Record<string, unknown>;
  const body: NotificationsConfigBody = {
    name: ch.name || "Untitled Channel",
    description: ch.description || "",
    config_type: type,
    is_enabled: ch.is_enabled !== false,
  };
  if (type === "slack" && sub.slack) {
    body.slack = sub.slack as { url: string };
  } else if (type === "chime" && sub.chime) {
    body.chime = sub.chime as { url: string };
  } else if (type === "webhook" && sub.webhook) {
    const w = sub.webhook as { url: string; method?: string; header_params?: Record<string, string> };
    body.webhook = {
      url: w.url,
      ...(w.method ? { method: w.method } : {}),
      ...(w.header_params ? { header_params: w.header_params } : {}),
    };
  } else if (type === "email" && sub.email) {
    const e = sub.email as {
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
  } else if (type === "sns" && sub.sns) {
    const s = sub.sns as { topic_arn: string; role_arn?: string };
    body.sns = { topic_arn: s.topic_arn, ...(s.role_arn ? { role_arn: s.role_arn } : {}) };
  }
  return body;
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
