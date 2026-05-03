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
  WazuhSCACheck,
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
import type { LogtestResult } from "@/types/wazuhOps";

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

  async getSCAChecks(agentId: string, policyId: string, params?: Record<string, unknown>) {
    const { data } = await this.client.get<WazuhListResponse<WazuhSCACheck>>(
      `/sca/${agentId}/checks/${policyId}`,
      { params: { limit: 500, ...params } },
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

  async putGroupConfiguration(groupId: string, xmlContent: string) {
    const { data } = await this.client.put(
      `/groups/${groupId}/configuration`,
      xmlContent,
      {
        headers: { "Content-Type": "application/xml" },
      },
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

  // === Manager files (Workshop: rules / decoders / cdb-lists / etc) ===
  async getManagerFile(path: string): Promise<string> {
    const { data } = await this.client.get("/manager/files", {
      params: { path, raw: true },
      responseType: "text",
      transformResponse: [(d: string) => d],
    });
    if (typeof data === "string") {
      // Some versions still wrap raw text in JSON envelope
      const trimmed = data.trimStart();
      if (trimmed.startsWith("{")) {
        try {
          const parsed = JSON.parse(data);
          if (parsed?.data?.affected_items?.[0] !== undefined) {
            const item = parsed.data.affected_items[0];
            return typeof item === "string"
              ? item
              : JSON.stringify(item, null, 2);
          }
          if (typeof parsed?.data === "string") return parsed.data;
        } catch {
          // raw text starting with { — leave as-is
        }
      }
      return data;
    }
    return JSON.stringify(data, null, 2);
  }

  async putManagerFile(
    path: string,
    content: string,
    options?: { overwrite?: boolean; contentType?: string },
  ): Promise<void> {
    const overwrite = options?.overwrite ?? true;
    await this.client.put("/manager/files", content, {
      params: { path, overwrite },
      headers: {
        "Content-Type": options?.contentType ?? "application/octet-stream",
      },
      transformRequest: [(d: string) => d],
    });
  }

  async deleteManagerFile(path: string): Promise<void> {
    await this.client.delete("/manager/files", { params: { path } });
  }

  // === Group files ===
  async getGroupFile(groupId: string, filename: string): Promise<string> {
    return this.getGroupFileContent(groupId, filename);
  }

  async putGroupFile(
    groupId: string,
    filename: string,
    content: string,
    options?: { contentType?: string },
  ): Promise<void> {
    // Default to XML for agent.conf-style files, octet-stream otherwise.
    const contentType =
      options?.contentType ??
      (filename.toLowerCase().endsWith(".xml")
        ? "application/xml"
        : "application/octet-stream");
    await this.client.put(
      `/groups/${groupId}/files/${filename}`,
      content,
      {
        headers: { "Content-Type": contentType },
        transformRequest: [(d: string) => d],
      },
    );
  }

  // === Restart ===
  async restartManager(): Promise<void> {
    await this.client.put("/manager/restart");
  }

  async restartAgent(agentId: string): Promise<void> {
    await this.client.put(`/agents/${agentId}/restart`);
  }

  async restartAgentsByGroup(groupId: string): Promise<void> {
    await this.client.put(`/agents/group/${groupId}/restart`);
  }

  // === Logtest (Wazuh ruleset testing) ===
  async runLogtest(
    log: string,
    location: string,
    logFormat: string,
    token?: string,
  ): Promise<LogtestResult> {
    const body: Record<string, unknown> = {
      log,
      location,
      log_format: logFormat,
    };
    if (token) body.token = token;
    const { data } = await this.client.put<{ data: LogtestResult }>(
      "/logtest",
      body,
      { headers: { "Content-Type": "application/json" } },
    );
    // Wazuh wraps response in { data: { token, output, messages, ... } }
    return data?.data ?? (data as unknown as LogtestResult);
  }

  // === Active Response manual trigger ===
  async runActiveResponse(
    agentIds: string[],
    command: string,
    args: string[] = [],
    alert?: Record<string, unknown>,
  ): Promise<void> {
    const body: Record<string, unknown> = { command, arguments: args };
    if (alert) body.alert = alert;
    await this.client.put("/active-response", body, {
      params: { agents_list: agentIds.join(",") },
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Reads /var/ossec/logs/active-responses.log via /manager/files and
   * returns the last `lines` lines. The Wazuh /manager/files endpoint
   * does not support tailing, so we trim client-side.
   */
  async getActiveResponseLog(
    _agentId: string,
    lines = 100,
  ): Promise<string> {
    // _agentId is reserved for future per-agent log tailing once a
    // matching backend endpoint exists; today the file lives on the
    // manager and is shared.
    const raw = await this.getManagerFile("logs/active-responses.log");
    if (!raw) return "";
    const all = raw.split(/\r?\n/);
    return all.slice(-lines).join("\n");
  }

  // === SCA on-demand ===
  /**
   * Wazuh 4.x has no native force-scan SCA endpoint; restarting the
   * agent triggers a fresh scan within ~60-120s. Callers that need a
   * faster path should run a TRMM script invoking
   * `wazuh-control reload` and bypass this method.
   */
  async requestSCAScan(agentId: string): Promise<void> {
    await this.restartAgent(agentId);
  }
}

export const wazuhApi = new WazuhApiClient();
