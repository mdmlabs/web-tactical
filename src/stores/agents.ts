/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useClientsStore } from "./clients";
import { derivePolicyAgentStatus } from "@/gpo/utils/policy-agent-status";

export const useAgentsStore = defineStore("agents", () => {
  const agents = ref<any[]>([]);
  const agentTableLoading = ref(false);
  const selectedRow = ref<string | null>(null);
  const agentPlatform = ref("windows");
  const defaultAgentTblTab = ref<string | null>(null);

  const onlineCount = computed(
    () => agents.value.filter((a) => a.status === "online").length,
  );
  const offlineCount = computed(
    () => agents.value.filter((a) => a.status !== "online").length,
  );
  const agentsByType = computed(() => {
    return (type: string) => {
      if (type === "mixed") return agents.value;
      return agents.value.filter((a) => a.monitoring_type === type);
    };
  });

  async function loadAgents() {
    agentTableLoading.value = true;
    const clientsStore = useClientsStore();

    let params = "";
    if (
      defaultAgentTblTab.value &&
      defaultAgentTblTab.value !== "mixed" &&
      defaultAgentTblTab.value !== "null"
    ) {
      params += `?monitoring_type=${defaultAgentTblTab.value}`;
    }

    if (
      clientsStore.selectedTree &&
      clientsStore.selectedTree.includes("Site")
    ) {
      const sep = params ? "&" : "?";
      params += `${sep}site=${clientsStore.selectedTree.split("|")[1]}`;
    }

    try {
      const { data } = await axios.get(`/agents/${params}`);

      // Try to enrich with GPO policy status
      try {
        const { agentServiceClientWrapper } = await import(
          "@/gpo/api/grpc-client"
        );

        const policyAgentsMapById = new Map();
        const policyAgentsMapByHostname = new Map();

        try {
          const allowedAgentIds = data.map((agent: any) =>
            String(agent.agent_id),
          );
          const response =
            await agentServiceClientWrapper.listAgents(allowedAgentIds);

          let grpcAgents: any[] = [];
          if (response && typeof response === "object") {
            if (response.agentsList && Array.isArray(response.agentsList)) {
              grpcAgents = response.agentsList;
            } else if (typeof response.getAgentsList === "function") {
              const agentsList = response.getAgentsList();
              grpcAgents = agentsList.map((agent: any) => {
                if (agent && typeof agent.toObject === "function") {
                  return agent.toObject({
                    longs: String,
                    enums: String,
                    bytes: String,
                    defaults: true,
                  });
                }
                return {
                  agentId: agent?.getAgentId?.(),
                  hostName: agent?.getHostName?.(),
                  isOnline: agent?.getIsOnline?.(),
                  lastHeartbeatUnix: agent?.getLastHeartbeatUnix?.(),
                };
              });
            } else if (typeof response.toObject === "function") {
              const obj = response.toObject({
                longs: String,
                enums: String,
                bytes: String,
                defaults: true,
                arrays: true,
                objects: true,
                oneofs: true,
              });
              grpcAgents = obj.agentsList || obj.agents || [];
            } else if (response.agents && Array.isArray(response.agents)) {
              grpcAgents = response.agents;
            }
          }

          grpcAgents.forEach((agent: any) => {
            const agentId = agent.agentId || agent.agent_id || "";
            const hostName = agent.hostName || agent.host_name || "";
            if (agentId) {
              const isOnline =
                agent.isOnline !== undefined
                  ? agent.isOnline
                  : (agent.is_online ?? false);
              const lastHeartbeatUnix =
                agent.lastHeartbeatUnix !== undefined
                  ? agent.lastHeartbeatUnix
                  : (agent.last_heartbeat_unix ?? null);

              const policyAgentData = { isOnline, lastHeartbeatUnix };
              policyAgentsMapById.set(agentId, policyAgentData);
              if (hostName) {
                policyAgentsMapByHostname.set(
                  hostName.toLowerCase(),
                  policyAgentData,
                );
              }
            }
          });
        } catch (grpcError) {
          console.error("Failed to load Windows Policy agents:", grpcError);
        }

        data.forEach((agent: any) => {
          let policyAgent =
            policyAgentsMapById.get(agent.agent_id) ||
            policyAgentsMapById.get(String(agent.agent_id));

          if (!policyAgent && agent.hostname) {
            policyAgent = policyAgentsMapByHostname.get(
              agent.hostname.toLowerCase(),
            );
          }

          if (policyAgent) {
            agent.windows_policy_status = derivePolicyAgentStatus(
              policyAgent.isOnline,
              policyAgent.lastHeartbeatUnix,
            );
            agent.windows_policy_last_seen = policyAgent.lastHeartbeatUnix
              ? new Date(
                  (typeof policyAgent.lastHeartbeatUnix === "string"
                    ? Number.parseInt(policyAgent.lastHeartbeatUnix, 10)
                    : policyAgent.lastHeartbeatUnix) * 1000,
                ).toISOString()
              : null;
          } else {
            agent.windows_policy_status = null;
            agent.windows_policy_last_seen = null;
          }
        });
      } catch {
        data.forEach((agent: any) => {
          agent.windows_policy_status = null;
          agent.windows_policy_last_seen = null;
        });
      }

      agents.value = data;
    } catch (e) {
      console.error(e);
    }

    agentTableLoading.value = false;
  }

  function setActiveRow(agentId: string | null) {
    selectedRow.value = agentId;
  }

  function setAgentPlatform(platform: string) {
    agentPlatform.value = platform;
  }

  function refreshDashboard(clearTreeSelected = false) {
    const clientsStore = useClientsStore();
    if (clearTreeSelected || !clientsStore.selectedTree) {
      clientsStore.setSelectedTree("");
    }
    if (clearTreeSelected) {
      selectedRow.value = null;
    }
    loadAgents();
    clientsStore.loadTree();
  }

  return {
    agents,
    agentTableLoading,
    selectedRow,
    agentPlatform,
    defaultAgentTblTab,
    onlineCount,
    offlineCount,
    agentsByType,
    loadAgents,
    setActiveRow,
    setAgentPlatform,
    refreshDashboard,
  };
});
