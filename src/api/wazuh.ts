import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { getBaseUrl } from "@/boot/axios";

import type {
  WazuhListResponse,
  WazuhAgent,
  WazuhAuthResponse,
  WazuhRule,
  WazuhVulnerability,
  WazuhSyscheckEntry,
  WazuhSCAPolicy,
  WazuhGroup,
  WazuhGroupFile,
  WazuhSyscollectorHardware,
  WazuhSyscollectorOS,
  WazuhSyscollectorPackage,
  WazuhSyscollectorProcess,
  WazuhSyscollectorNetiface,
  WazuhSyscollectorNetaddr,
  WazuhSyscollectorPort,
} from "@/types/wazuh";

class WazuhApiClient {
  private client: AxiosInstance;
  private tokenGetter: (() => string | null) | null = null;
  private ensureAuthFn: (() => Promise<void>) | null = null;
  private onAuthFailFn: (() => Promise<void>) | null = null;

  constructor() {
    const baseURL =
      process.env.NODE_ENV === "production"
        ? `${window._env_?.PROD_URL ?? ""}/api/wazuh`
        : `${getBaseUrl()}/api/wazuh`;

    this.client = axios.create({
      baseURL,
      timeout: 30000,
    });

    // Interceptor: inject Wazuh JWT token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // /authenticate doesn't need JWT (Nginx injects Basic Auth)
        if (config.url?.includes("/security/user/authenticate")) {
          return config;
        }

        if (this.ensureAuthFn) {
          await this.ensureAuthFn();
        }

        const token = this.tokenGetter?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    );

    // Interceptor: handle 401 (token expired)
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (
          error.response?.status === 401 &&
          this.onAuthFailFn &&
          !config._authRetry
        ) {
          config._authRetry = true;
          await this.onAuthFailFn();

          // Retry original request with new token
          const token = this.tokenGetter?.();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return this.client.request(config);
        }
        return Promise.reject(error);
      },
    );
  }

  /** Register store callbacks for auth management */
  registerAuthCallbacks(callbacks: {
    getToken: () => string | null;
    ensureAuth: () => Promise<void>;
    onAuthFail: () => Promise<void>;
  }) {
    this.tokenGetter = callbacks.getToken;
    this.ensureAuthFn = callbacks.ensureAuth;
    this.onAuthFailFn = callbacks.onAuthFail;
  }

  // === Auth ===
  async authenticate(): Promise<string> {
    const { data } = await this.client.post<WazuhAuthResponse>(
      "/security/user/authenticate",
    );
    return data.data.token;
  }

  // === Agents ===
  async getAgents(params?: Record<string, unknown>) {
    const { data } = await this.client.get<WazuhListResponse<WazuhAgent>>(
      "/agents",
      { params: { limit: 500, ...params } },
    );
    return data;
  }

  async getAgent(agentId: string) {
    const { data } = await this.client.get<WazuhListResponse<WazuhAgent>>(
      "/agents",
      { params: { agents_list: agentId } },
    );
    return data;
  }

  // === Rules ===
  async getRules(params?: Record<string, unknown>) {
    const { data } = await this.client.get<WazuhListResponse<WazuhRule>>(
      "/rules",
      { params },
    );
    return data;
  }

  // === Manager ===
  async getManagerStats() {
    const { data } = await this.client.get("/manager/stats");
    return data;
  }

  async getManagerStatus() {
    const { data } = await this.client.get("/manager/status");
    return data;
  }

  async getManagerInfo() {
    const { data } = await this.client.get("/");
    return data;
  }

  // === Agent security data ===
  async getVulnerabilities(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhVulnerability>
    >(`/vulnerability/${agentId}`, { params });
    return data;
  }

  async getSyscheck(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscheckEntry>
    >(`/syscheck/${agentId}`, { params });
    return data;
  }

  async getSCA(agentId: string) {
    const { data } = await this.client.get<WazuhListResponse<WazuhSCAPolicy>>(
      `/sca/${agentId}`,
    );
    return data;
  }

  async getRootcheck(agentId: string) {
    const { data } = await this.client.get(`/rootcheck/${agentId}`);
    return data;
  }

  // === Groups ===
  async getGroups(params?: Record<string, unknown>) {
    const { data } = await this.client.get<WazuhListResponse<WazuhGroup>>(
      "/groups",
      { params: { limit: 500, ...params } },
    );
    return data;
  }

  async createGroup(groupId: string) {
    const { data } = await this.client.post("/groups", {
      group_id: groupId,
    });
    return data;
  }

  async deleteGroup(groupIds: string) {
    const { data } = await this.client.delete("/groups", {
      params: { groups_list: groupIds },
    });
    return data;
  }

  async getGroupAgents(groupId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<WazuhListResponse<WazuhAgent>>(
      `/groups/${groupId}/agents`,
      { params: { limit: 500, ...params } },
    );
    return data;
  }

  async getGroupConfiguration(groupId: string) {
    const { data } = await this.client.get(
      `/groups/${groupId}/configuration`,
    );
    return data;
  }

  async putGroupConfiguration(groupId: string, body: unknown) {
    const { data } = await this.client.put(
      `/groups/${groupId}/configuration`,
      body,
    );
    return data;
  }

  async addAgentToGroup(agentId: string, groupId: string) {
    const { data } = await this.client.put(
      `/agents/${agentId}/group/${groupId}`,
    );
    return data;
  }

  async removeAgentFromGroup(agentId: string, groupId: string) {
    const { data } = await this.client.delete(
      `/agents/${agentId}/group/${groupId}`,
    );
    return data;
  }

  async getGroupFiles(groupId: string) {
    const { data } = await this.client.get<WazuhListResponse<WazuhGroupFile>>(
      `/groups/${groupId}/files`,
      { params: { limit: 500 } },
    );
    return data;
  }

  async getGroupFileContent(groupId: string, filename: string): Promise<string> {
    // Wazuh 4.9+ merged the /files/{filename}/xml and /json endpoints into
    // GET /groups/{group_id}/files/{filename}?raw=true
    // which returns the raw file content as plain text.
    const { data } = await this.client.get(
      `/groups/${groupId}/files/${filename}`,
      {
        params: { raw: true },
        responseType: "text",
        transformResponse: [(d: string) => d],
      },
    );
    // Response is plain text content of the file
    if (typeof data === "string") {
      // Some Wazuh versions may still wrap in JSON even with raw=true
      if (data.trimStart().startsWith("{")) {
        try {
          const parsed = JSON.parse(data);
          if (parsed?.data?.affected_items?.[0] !== undefined) {
            const item = parsed.data.affected_items[0];
            return typeof item === "string" ? item : JSON.stringify(item, null, 2);
          }
          if (typeof parsed?.data === "string") return parsed.data;
        } catch {
          // Not JSON, return as-is (raw text)
        }
      }
      return data;
    }
    return JSON.stringify(data, null, 2);
  }

  // === Syscollector ===
  async getSyscollectorHardware(agentId: string) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorHardware>
    >(`/syscollector/${agentId}/hardware`);
    return data;
  }

  async getSyscollectorOS(agentId: string) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorOS>
    >(`/syscollector/${agentId}/os`);
    return data;
  }

  async getSyscollectorPackages(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorPackage>
    >(`/syscollector/${agentId}/packages`, { params: { limit: 500, ...params } });
    return data;
  }

  async getSyscollectorProcesses(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorProcess>
    >(`/syscollector/${agentId}/processes`, { params: { limit: 500, ...params } });
    return data;
  }

  async getSyscollectorNetiface(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorNetiface>
    >(`/syscollector/${agentId}/netiface`, { params: { limit: 500, ...params } });
    return data;
  }

  async getSyscollectorNetaddr(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorNetaddr>
    >(`/syscollector/${agentId}/netaddr`, { params: { limit: 500, ...params } });
    return data;
  }

  async getSyscollectorPorts(agentId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<
      WazuhListResponse<WazuhSyscollectorPort>
    >(`/syscollector/${agentId}/ports`, { params: { limit: 500, ...params } });
    return data;
  }

  // === Manager Stats ===
  async getManagerStatsHourly() {
    const { data } = await this.client.get("/manager/stats/hourly");
    return data;
  }
}

export const wazuhApi = new WazuhApiClient();
