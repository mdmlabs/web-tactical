import axios, { type AxiosInstance } from "axios";

/**
 * Client for the Wazuh Dashboard REST API (OpenSearch Dashboards).
 *
 * Dev:  /wazuh-dashboard/api/alerting/...  →  Vite proxy (injects Basic Auth)  →  OSD :5601
 * Prod: <PROD_URL>/wazuh-dashboard/api/alerting/...  →  nginx (injects Basic Auth)  →  OSD :5601
 *
 * Authentication is handled by the proxy layer (Vite dev proxy or nginx),
 * which injects Basic Auth credentials before forwarding to OSD.
 *
 * The Wazuh Dashboard wraps the underlying OpenSearch Alerting plugin
 * and exposes a simplified REST API with query-param based filtering.
 */
class WazuhDashboardClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.NODE_ENV === "production"
        ? `${window._env_?.PROD_URL ?? ""}/wazuh-dashboard`
        : "/wazuh-dashboard";

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
    });

    // Add osd-xsrf header for mutations (required by OpenSearch Dashboards).
    // Auth is handled by the proxy layer (Vite dev proxy or nginx).
    this.client.interceptors.request.use((config) => {
      if (config.method && config.method !== "get") {
        config.headers["osd-xsrf"] = "true";
      }
      return config;
    });
  }

  async get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await this.client.get<T>(path, { params });
    return data;
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.client.post<T>(path, body);
    return data;
  }

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.client.put<T>(path, body);
    return data;
  }

  async delete<T = unknown>(path: string): Promise<T> {
    const { data } = await this.client.delete<T>(path);
    return data;
  }
}

export const wazuhDashboardApi = new WazuhDashboardClient();
