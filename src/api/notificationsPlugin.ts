import { wazuhDashboardApi } from "@/api/wazuhDashboard";

/**
 * Thin client over the OpenSearch Notifications plugin
 * (`/api/_plugins/_notifications/configs`). The Reports plugin needs a
 * channel id (`config_id`) in `delivery.configIds` to email a generated
 * report. Channels themselves are configured in the dashboards module —
 * here we only enumerate them.
 *
 * Versions of the plugin disagree on response shape: some return
 * `{ config_list: [...] }`, others return `{ items: [...] }` or a flat
 * array. `listEmailChannels()` normalizes all three.
 */

export type NotificationConfigType =
  | "email"
  | "slack"
  | "chime"
  | "webhook"
  | "ses_account"
  | "smtp_account"
  | "email_group";

export interface NotificationChannel {
  config_id: string;
  name: string;
  description?: string;
  config_type: NotificationConfigType | string;
  is_enabled: boolean;
}

interface RawConfigItem {
  config_id?: string;
  _id?: string;
  config?: {
    name?: string;
    description?: string;
    config_type?: string;
    is_enabled?: boolean;
    feature_list?: string[];
  };
  name?: string;
  description?: string;
  config_type?: string;
  is_enabled?: boolean;
}

interface RawListResponse {
  config_list?: RawConfigItem[];
  items?: RawConfigItem[];
  total_hits?: number;
}

function parseChannel(raw: RawConfigItem): NotificationChannel | null {
  const id = raw.config_id ?? raw._id;
  if (!id) return null;
  const cfg = raw.config ?? {};
  const name = cfg.name ?? raw.name ?? id;
  const configType = cfg.config_type ?? raw.config_type ?? "";
  return {
    config_id: id,
    name,
    description: cfg.description ?? raw.description,
    config_type: configType,
    is_enabled: cfg.is_enabled ?? raw.is_enabled ?? true,
  };
}

function normalize(data: unknown): RawConfigItem[] {
  if (Array.isArray(data)) return data as RawConfigItem[];
  if (data && typeof data === "object") {
    const obj = data as RawListResponse;
    if (Array.isArray(obj.config_list)) return obj.config_list;
    if (Array.isArray(obj.items)) return obj.items;
  }
  return [];
}

export async function listEmailChannels(): Promise<NotificationChannel[]> {
  const data = await wazuhDashboardApi.get<unknown>(
    "/api/_plugins/_notifications/configs",
    { config_type: "email" },
  );
  return normalize(data)
    .map(parseChannel)
    .filter((c): c is NotificationChannel => c !== null && c.is_enabled);
}
