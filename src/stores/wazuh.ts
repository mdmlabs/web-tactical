import { defineStore } from "pinia";
import { wazuhApi } from "@/api/wazuh";
import { Notify } from "quasar";

import type {
  WazuhAgent,
  MergedAgent,
  WazuhRule,
  WazuhSecuritySummary,
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

interface WazuhState {
  // Auth
  token: string | null;
  tokenExpiresAt: number | null;
  isAuthenticating: boolean;
  _authPromise: Promise<void> | null;

  // Agents
  wazuhAgents: WazuhAgent[];
  mergedAgents: MergedAgent[];
  selectedAgent: MergedAgent | null;
  agentsLoading: boolean;

  // Rules
  rules: WazuhRule[];
  rulesLoading: boolean;

  // Summary
  summary: WazuhSecuritySummary | null;
  summaryLoading: boolean;

  // Agent details
  vulnerabilities: WazuhVulnerability[];
  vulnerabilitiesLoading: boolean;
  syscheckEntries: WazuhSyscheckEntry[];
  syscheckLoading: boolean;
  scaPolicies: WazuhSCAPolicy[];
  scaLoading: boolean;

  // Groups
  groups: WazuhGroup[];
  groupsLoading: boolean;
  selectedGroupName: string | null;
  groupAgents: WazuhAgent[];
  groupAgentsLoading: boolean;
  groupConfig: unknown;
  groupConfigLoading: boolean;
  groupFiles: WazuhGroupFile[];
  groupFilesLoading: boolean;
  groupFileContent: string | null;
  groupFileContentLoading: boolean;

  // Syscollector (agent detail)
  syscollectorHardware: WazuhSyscollectorHardware | null;
  syscollectorOS: WazuhSyscollectorOS | null;
  syscollectorLoading: boolean;

  // IT Hygiene (all agents syscollector)
  itHygieneOSList: (WazuhSyscollectorOS & { agent_id: string; agent_name: string })[];
  itHygieneHardwareList: (WazuhSyscollectorHardware & { agent_id: string; agent_name: string })[];
  itHygienePackages: (WazuhSyscollectorPackage & { agent_id: string; agent_name: string })[];
  itHygieneProcesses: (WazuhSyscollectorProcess & { agent_id: string; agent_name: string })[];
  itHygieneNetiface: (WazuhSyscollectorNetiface & { agent_id: string; agent_name: string })[];
  itHygieneNetaddr: (WazuhSyscollectorNetaddr & { agent_id: string; agent_name: string })[];
  itHygienePorts: (WazuhSyscollectorPort & { agent_id: string; agent_name: string })[];
  itHygieneLoading: boolean;

  // Manager hourly stats
  managerHourlyStats: number[];
  managerStatsLoading: boolean;

  // Errors
  error: string | null;
  isAvailable: boolean;
}

export const useWazuhStore = defineStore("wazuh", {
  state: (): WazuhState => ({
    token: null,
    tokenExpiresAt: null,
    isAuthenticating: false,
    _authPromise: null as Promise<void> | null,

    wazuhAgents: [],
    mergedAgents: [],
    selectedAgent: null,
    agentsLoading: false,

    rules: [],
    rulesLoading: false,

    summary: null,
    summaryLoading: false,

    vulnerabilities: [],
    vulnerabilitiesLoading: false,
    syscheckEntries: [],
    syscheckLoading: false,
    scaPolicies: [],
    scaLoading: false,

    groups: [],
    groupsLoading: false,
    selectedGroupName: null,
    groupAgents: [],
    groupAgentsLoading: false,
    groupConfig: null,
    groupConfigLoading: false,
    groupFiles: [],
    groupFilesLoading: false,
    groupFileContent: null,
    groupFileContentLoading: false,

    syscollectorHardware: null,
    syscollectorOS: null,
    syscollectorLoading: false,

    itHygieneOSList: [],
    itHygieneHardwareList: [],
    itHygienePackages: [],
    itHygieneProcesses: [],
    itHygieneNetiface: [],
    itHygieneNetaddr: [],
    itHygienePorts: [],
    itHygieneLoading: false,

    managerHourlyStats: [],
    managerStatsLoading: false,

    error: null,
    isAvailable: true,
  }),

  getters: {
    isAuthenticated: (state) =>
      state.token !== null &&
      state.tokenExpiresAt !== null &&
      Date.now() < state.tokenExpiresAt,

    activeWazuhAgents: (state) =>
      state.wazuhAgents.filter((a) => a.status === "active"),

    syncedAgents: (state) => state.mergedAgents.filter((a) => a.is_synced),
    unsyncedAgents: (state) => state.mergedAgents.filter((a) => !a.is_synced),

    mitreRuleTacticCounts: (state) => {
      const map = new Map<string, number>();
      for (const rule of state.rules) {
        if (rule.mitre?.tactic) {
          for (const tactic of rule.mitre.tactic) {
            map.set(tactic, (map.get(tactic) ?? 0) + 1);
          }
        }
      }
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([tactic, count]) => ({ tactic, count }));
    },

    pciDssRuleCounts: (state) => {
      const map = new Map<string, number>();
      for (const rule of state.rules) {
        if (rule.pci_dss) {
          for (const req of rule.pci_dss) {
            map.set(req, (map.get(req) ?? 0) + 1);
          }
        }
      }
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([requirement, count]) => ({ requirement, count }));
    },
  },

  actions: {
    _registerApi() {
      wazuhApi.registerAuthCallbacks({
        getToken: () => this.token,
        ensureAuth: () => this.ensureAuth(),
        onAuthFail: async () => {
          await this.authenticate();
        },
      });
    },

    async authenticate(): Promise<void> {
      if (this.isAuthenticating) {
        if (this._authPromise) {
          await this._authPromise;
        }
        return;
      }
      this.isAuthenticating = true;
      this.error = null;

      this._authPromise = (async () => {
        try {
          const token = await wazuhApi.authenticate();
          this.token = token;
          this.tokenExpiresAt = Date.now() + 900 * 1000; // 15 min
          this.isAvailable = true;
        } catch (e) {
          this.error = "Failed to authenticate with MDM-Lab API";
          this.isAvailable = false;
          console.error("[Wazuh] Auth error:", e);
        } finally {
          this.isAuthenticating = false;
          this._authPromise = null;
        }
      })();

      await this._authPromise;
    },

    async ensureAuth(): Promise<void> {
      if (!this.token || !this.tokenExpiresAt) {
        await this.authenticate();
        return;
      }

      // Refresh if < 60s until expiration
      const timeLeft = this.tokenExpiresAt - Date.now();
      if (timeLeft < 60_000) {
        await this.authenticate();
      }
    },

    async fetchAgents(): Promise<void> {
      this.agentsLoading = true;
      this.error = null;

      try {
        this._registerApi();
        const response = await wazuhApi.getAgents();
        this.wazuhAgents = response.data.affected_items;
      } catch (e) {
        this.error = "Failed to fetch MDM-Lab agents";
        this._notifyError("Failed to fetch MDM-Lab agents");
        console.error("[Wazuh] Fetch agents error:", e);
      } finally {
        this.agentsLoading = false;
      }
    },

    mergeAgents(tacticalAgents: TacticalAgentLike[]): void {
      const wazuhMap = new Map<string, WazuhAgent>();
      for (const wa of this.wazuhAgents) {
        if (wa.id === "000") continue; // skip manager
        wazuhMap.set(wa.name.toLowerCase(), wa);
      }

      this.mergedAgents = tacticalAgents.map((ta) => {
        const wazuh =
          wazuhMap.get((ta.hostname || "").toLowerCase()) ?? null;

        return {
          tactical_agent_id: ta.agent_id,
          hostname: ta.hostname,
          site_name: ta.site_name ?? ta.site ?? "",
          client_name: ta.client_name ?? ta.client ?? "",
          status: ta.status,
          plat: ta.plat ?? "",
          operating_system: ta.operating_system ?? "",
          last_seen: ta.last_seen ?? "",

          wazuh_agent_id: wazuh?.id ?? null,
          wazuh_status: wazuh?.status ?? null,
          wazuh_last_keep_alive: wazuh?.lastKeepAlive ?? null,
          wazuh_groups: wazuh?.group ?? null,
          wazuh_version: wazuh?.version ?? null,

          is_synced: wazuh !== null,
          security_alerts_count: 0,
          critical_alerts_count: 0,
        };
      });
    },

    async fetchRules(params?: Record<string, unknown>): Promise<void> {
      this.rulesLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getRules(params);
        this.rules = response.data.affected_items;
      } catch (e) {
        this._notifyError("Failed to fetch MDM-Lab rules");
        console.error("[Wazuh] Rules error:", e);
      } finally {
        this.rulesLoading = false;
      }
    },

    async fetchVulnerabilities(agentId: string): Promise<void> {
      this.vulnerabilitiesLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getVulnerabilities(agentId);
        this.vulnerabilities = response.data.affected_items;
      } catch (e) {
        console.error("[Wazuh] Vulnerabilities error:", e);
      } finally {
        this.vulnerabilitiesLoading = false;
      }
    },

    async fetchSyscheck(agentId: string): Promise<void> {
      this.syscheckLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getSyscheck(agentId);
        this.syscheckEntries = response.data.affected_items;
      } catch (e) {
        console.error("[Wazuh] Syscheck error:", e);
      } finally {
        this.syscheckLoading = false;
      }
    },

    async fetchSCA(agentId: string): Promise<void> {
      this.scaLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getSCA(agentId);
        this.scaPolicies = response.data.affected_items;
      } catch (e) {
        console.error("[Wazuh] SCA error:", e);
      } finally {
        this.scaLoading = false;
      }
    },

    async buildSummary(): Promise<void> {
      this.summaryLoading = true;
      try {
        const total = this.wazuhAgents.filter((a) => a.id !== "000").length;
        const active = this.wazuhAgents.filter(
          (a) => a.id !== "000" && a.status === "active",
        ).length;
        const disconnected = this.wazuhAgents.filter(
          (a) => a.id !== "000" && a.status === "disconnected",
        ).length;

        const synced = this.mergedAgents.filter((a) => a.is_synced).length;
        const notSynced = this.mergedAgents.filter((a) => !a.is_synced).length;

        this.summary = {
          total_agents: total,
          active_agents: active,
          disconnected_agents: disconnected,
          synced_with_tactical: synced,
          not_synced: notSynced,
          alerts_today: 0,
          critical_alerts_today: 0,
          high_alerts_today: 0,
          medium_alerts_today: 0,
          top_rules: [],
          top_mitre_tactics: [],
          alerts_by_hour: [],
        };
      } finally {
        this.summaryLoading = false;
      }
    },

    selectAgent(agent: MergedAgent | null): void {
      this.selectedAgent = agent;
    },

    // ========== Groups ==========
    async fetchGroups(): Promise<void> {
      this.groupsLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getGroups();
        this.groups = response.data.affected_items;
      } catch (e) {
        this._notifyError("Failed to fetch MDM-Lab groups");
        console.error("[Wazuh] Groups error:", e);
      } finally {
        this.groupsLoading = false;
      }
    },

    async createGroup(groupId: string): Promise<boolean> {
      try {
        this._registerApi();
        await wazuhApi.createGroup(groupId);
        Notify.create({
          color: "positive",
          message: `Group "${groupId}" created successfully`,
          timeout: 2000,
        });
        await this.fetchGroups();
        return true;
      } catch (e) {
        this._notifyError(`Failed to create group "${groupId}"`);
        console.error("[Wazuh] Create group error:", e);
        return false;
      }
    },

    async deleteGroup(groupId: string): Promise<boolean> {
      try {
        this._registerApi();
        await wazuhApi.deleteGroup(groupId);
        Notify.create({
          color: "positive",
          message: `Group "${groupId}" deleted successfully`,
          timeout: 2000,
        });
        if (this.selectedGroupName === groupId) {
          this.selectedGroupName = null;
          this.groupAgents = [];
          this.groupConfig = null;
        }
        await this.fetchGroups();
        return true;
      } catch (e) {
        this._notifyError(`Failed to delete group "${groupId}"`);
        console.error("[Wazuh] Delete group error:", e);
        return false;
      }
    },

    async fetchGroupAgents(groupId: string): Promise<void> {
      this.groupAgentsLoading = true;
      this.selectedGroupName = groupId;
      try {
        this._registerApi();
        const response = await wazuhApi.getGroupAgents(groupId);
        this.groupAgents = response.data.affected_items;
      } catch (e) {
        this._notifyError(`Failed to fetch agents for group "${groupId}"`);
        console.error("[Wazuh] Group agents error:", e);
      } finally {
        this.groupAgentsLoading = false;
      }
    },

    async fetchGroupConfig(groupId: string): Promise<void> {
      this.groupConfigLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getGroupConfiguration(groupId);
        this.groupConfig = response.data;
      } catch (e) {
        this.groupConfig = null;
        console.error("[Wazuh] Group config error:", e);
      } finally {
        this.groupConfigLoading = false;
      }
    },

    async addAgentToGroup(
      agentId: string,
      groupId: string,
    ): Promise<boolean> {
      try {
        this._registerApi();
        await wazuhApi.addAgentToGroup(agentId, groupId);
        Notify.create({
          color: "positive",
          message: `Agent ${agentId} added to group "${groupId}"`,
          timeout: 2000,
        });
        // Refresh group agents and agent list
        await Promise.all([
          this.fetchGroupAgents(groupId),
          this.fetchAgents(),
        ]);
        return true;
      } catch (e) {
        this._notifyError(
          `Failed to add agent ${agentId} to group "${groupId}"`,
        );
        console.error("[Wazuh] Add agent to group error:", e);
        return false;
      }
    },

    async removeAgentFromGroup(
      agentId: string,
      groupId: string,
    ): Promise<boolean> {
      try {
        this._registerApi();
        await wazuhApi.removeAgentFromGroup(agentId, groupId);
        Notify.create({
          color: "positive",
          message: `Agent ${agentId} removed from group "${groupId}"`,
          timeout: 2000,
        });
        await Promise.all([
          this.fetchGroupAgents(groupId),
          this.fetchAgents(),
        ]);
        return true;
      } catch (e) {
        this._notifyError(
          `Failed to remove agent ${agentId} from group "${groupId}"`,
        );
        console.error("[Wazuh] Remove agent from group error:", e);
        return false;
      }
    },

    async saveGroupConfig(groupId: string, xmlContent: string): Promise<boolean> {
      try {
        this._registerApi();
        await wazuhApi.putGroupConfiguration(groupId, xmlContent);
        Notify.create({
          type: "positive",
          message: `Configuration for group "${groupId}" saved successfully`,
        });
        return true;
      } catch (e) {
        this._notifyError(`Failed to save configuration for group "${groupId}"`);
        console.error("[Wazuh] Save group config error:", e);
        return false;
      }
    },

    async fetchGroupFiles(groupId: string): Promise<void> {
      this.groupFilesLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getGroupFiles(groupId);
        this.groupFiles = response.data.affected_items;
      } catch (e) {
        this._notifyError(`Failed to fetch files for group "${groupId}"`);
        console.error("[Wazuh] Group files error:", e);
      } finally {
        this.groupFilesLoading = false;
      }
    },

    async fetchGroupFileContent(groupId: string, filename: string): Promise<void> {
      this.groupFileContentLoading = true;
      this.groupFileContent = null;
      try {
        this._registerApi();
        const content = await wazuhApi.getGroupFileContent(groupId, filename);
        this.groupFileContent = content || null;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[Wazuh] Group file content error:", e);
        // Re-throw so the component can catch and display contextual error
        throw new Error(`Failed to fetch file content for "${filename}": ${msg}`);
      } finally {
        this.groupFileContentLoading = false;
      }
    },

    // ========== Syscollector ==========
    async fetchSyscollector(agentId: string): Promise<void> {
      this.syscollectorLoading = true;
      this.syscollectorHardware = null;
      this.syscollectorOS = null;
      try {
        this._registerApi();
        const [hwRes, osRes] = await Promise.allSettled([
          wazuhApi.getSyscollectorHardware(agentId),
          wazuhApi.getSyscollectorOS(agentId),
        ]);
        if (hwRes.status === "fulfilled") {
          this.syscollectorHardware =
            hwRes.value.data.affected_items[0] ?? null;
        }
        if (osRes.status === "fulfilled") {
          this.syscollectorOS = osRes.value.data.affected_items[0] ?? null;
        }
      } catch (e) {
        console.error("[Wazuh] Syscollector error:", e);
      } finally {
        this.syscollectorLoading = false;
      }
    },

    // ========== Manager Stats ==========
    async fetchManagerStatsHourly(): Promise<void> {
      this.managerStatsLoading = true;
      try {
        this._registerApi();
        const response = await wazuhApi.getManagerStatsHourly();
        this.managerHourlyStats = response.data?.averages ?? [];
      } catch (e) {
        console.error("[Wazuh] Manager stats hourly error:", e);
      } finally {
        this.managerStatsLoading = false;
      }
    },

    // ========== Agent Detail (orchestrator) ==========
    async fetchAgentDetail(agentId: string): Promise<void> {
      this._registerApi();
      await Promise.allSettled([
        this.fetchSyscollector(agentId),
        this.fetchVulnerabilities(agentId),
        this.fetchSyscheck(agentId),
        this.fetchSCA(agentId),
        this.fetchManagerStatsHourly(),
        this.fetchRules({ limit: 500 }),
      ]);
    },

    // ========== IT Hygiene (all agents syscollector) ==========
    async fetchITHygieneSystem(): Promise<void> {
      this.itHygieneLoading = true;
      this.itHygieneOSList = [];
      this.itHygieneHardwareList = [];
      try {
        this._registerApi();
        const agents = this.wazuhAgents.filter((a) => a.id !== "000" && a.status === "active");
        const results = await Promise.allSettled(
          agents.map(async (agent) => {
            const [osRes, hwRes] = await Promise.allSettled([
              wazuhApi.getSyscollectorOS(agent.id),
              wazuhApi.getSyscollectorHardware(agent.id),
            ]);
            const osItem = osRes.status === "fulfilled" ? osRes.value.data.affected_items[0] : null;
            const hwItem = hwRes.status === "fulfilled" ? hwRes.value.data.affected_items[0] : null;
            return { agent, osItem, hwItem };
          }),
        );
        for (const r of results) {
          if (r.status !== "fulfilled") continue;
          const { agent, osItem, hwItem } = r.value;
          if (osItem) this.itHygieneOSList.push({ ...osItem, agent_id: agent.id, agent_name: agent.name });
          if (hwItem) this.itHygieneHardwareList.push({ ...hwItem, agent_id: agent.id, agent_name: agent.name });
        }
      } catch (e) {
        console.error("[Wazuh] IT Hygiene System error:", e);
      } finally {
        this.itHygieneLoading = false;
      }
    },

    async fetchITHygieneSoftware(): Promise<void> {
      this.itHygieneLoading = true;
      this.itHygienePackages = [];
      try {
        this._registerApi();
        const agents = this.wazuhAgents.filter((a) => a.id !== "000" && a.status === "active");
        const results = await Promise.allSettled(
          agents.map(async (agent) => {
            const res = await wazuhApi.getSyscollectorPackages(agent.id);
            return { agent, items: res.data.affected_items };
          }),
        );
        for (const r of results) {
          if (r.status !== "fulfilled") continue;
          const { agent, items } = r.value;
          for (const item of items) {
            this.itHygienePackages.push({ ...item, agent_id: agent.id, agent_name: agent.name });
          }
        }
      } catch (e) {
        console.error("[Wazuh] IT Hygiene Software error:", e);
      } finally {
        this.itHygieneLoading = false;
      }
    },

    async fetchITHygieneProcesses(): Promise<void> {
      this.itHygieneLoading = true;
      this.itHygieneProcesses = [];
      try {
        this._registerApi();
        const agents = this.wazuhAgents.filter((a) => a.id !== "000" && a.status === "active");
        const results = await Promise.allSettled(
          agents.map(async (agent) => {
            const res = await wazuhApi.getSyscollectorProcesses(agent.id);
            return { agent, items: res.data.affected_items };
          }),
        );
        for (const r of results) {
          if (r.status !== "fulfilled") continue;
          const { agent, items } = r.value;
          for (const item of items) {
            this.itHygieneProcesses.push({ ...item, agent_id: agent.id, agent_name: agent.name });
          }
        }
      } catch (e) {
        console.error("[Wazuh] IT Hygiene Processes error:", e);
      } finally {
        this.itHygieneLoading = false;
      }
    },

    async fetchITHygieneNetwork(): Promise<void> {
      this.itHygieneLoading = true;
      this.itHygieneNetiface = [];
      this.itHygieneNetaddr = [];
      this.itHygienePorts = [];
      try {
        this._registerApi();
        const agents = this.wazuhAgents.filter((a) => a.id !== "000" && a.status === "active");
        const results = await Promise.allSettled(
          agents.map(async (agent) => {
            const [ifRes, addrRes, portRes] = await Promise.allSettled([
              wazuhApi.getSyscollectorNetiface(agent.id),
              wazuhApi.getSyscollectorNetaddr(agent.id),
              wazuhApi.getSyscollectorPorts(agent.id),
            ]);
            return {
              agent,
              ifaces: ifRes.status === "fulfilled" ? ifRes.value.data.affected_items : [],
              addrs: addrRes.status === "fulfilled" ? addrRes.value.data.affected_items : [],
              ports: portRes.status === "fulfilled" ? portRes.value.data.affected_items : [],
            };
          }),
        );
        for (const r of results) {
          if (r.status !== "fulfilled") continue;
          const { agent, ifaces, addrs, ports } = r.value;
          for (const item of ifaces) this.itHygieneNetiface.push({ ...item, agent_id: agent.id, agent_name: agent.name });
          for (const item of addrs) this.itHygieneNetaddr.push({ ...item, agent_id: agent.id, agent_name: agent.name });
          for (const item of ports) this.itHygienePorts.push({ ...item, agent_id: agent.id, agent_name: agent.name });
        }
      } catch (e) {
        console.error("[Wazuh] IT Hygiene Network error:", e);
      } finally {
        this.itHygieneLoading = false;
      }
    },

    _notifyError(message: string): void {
      Notify.create({
        color: "negative",
        message,
        timeout: 3000,
      });
    },
  },
});

/** Minimal shape of a Tactical agent for merge purposes */
interface TacticalAgentLike {
  agent_id: string;
  hostname: string;
  site_name?: string;
  site?: string;
  client_name?: string;
  client?: string;
  status: string;
  plat?: string;
  operating_system?: string;
  last_seen?: string;
}
