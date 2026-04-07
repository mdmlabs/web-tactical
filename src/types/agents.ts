export type AgentPlatformType = "windows" | "linux" | "darwin";
export type AgentTab = "mixed" | "server" | "workstation";

export interface AgentGeolocation {
  id: number;
  agent: number;
  latitude: string;
  longitude: string;
  accuracy: string;
  altitude: string;
  source: string;
  created_at: string;
}

export interface AgentWithGeolocation {
  agent_id: string;
  hostname: string;
  plat: AgentPlatformType;
  monitoring_type: AgentTab;
  status: string;
  last_geolocation: AgentGeolocation;
}

export interface Agent {
  id: number;
  agent_id: string;
  hostname: string;
  client: string;
  site: string;
  plat: AgentPlatformType;
  monitoring_type: AgentTab;
  last_geolocation: AgentGeolocation | null;
}
