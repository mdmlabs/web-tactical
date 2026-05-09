/**
 * Agent module-status API client.
 *
 * Wraps the Phase-7 endpoints introduced 2026-04-25:
 *   GET /agents/<agent_id>/modules-status/[?refresh=1]
 *   GET /agents/modules-status/bulk/
 *
 * The bulk endpoint returns whatever is in the 30-second cache for each
 * agent (zero-counts for agents that haven't been probed yet). The single
 * endpoint always probes live unless the cache is fresh and ?refresh=1 is
 * not passed.
 */
import axios from "axios";

export type ModuleState = "ok" | "partial" | "missing" | "n/a";

export interface ModuleEntry {
  state: ModuleState;
  raw: Record<string, any>;
}

export interface AgentModuleStatus {
  agent_id: string;
  hostname: string;
  online: boolean;
  version?: string;
  monitoring_type?: string;
  os?: { name: string; version: string; arch: string };
  modules: Record<string, ModuleEntry>;
  completeness: { ok: number; installed: number; expected: number; percent: number };
  fresh?: boolean;
  from_cache?: boolean;
  error?: string;
  skipped?: string;
}

export interface BulkResponse {
  agents: AgentModuleStatus[];
  count: number;
}

const baseUrl = "/agents";

export async function fetchAgentModuleStatus(
  agentId: string,
  refresh = false,
): Promise<AgentModuleStatus> {
  const url = `${baseUrl}/${agentId}/modules-status/${refresh ? "?refresh=1" : ""}`;
  const r = await axios.get<AgentModuleStatus>(url);
  return r.data;
}

export async function fetchAgentModuleStatusBulk(): Promise<BulkResponse> {
  const r = await axios.get<BulkResponse>(`${baseUrl}/modules-status/bulk/`);
  return r.data;
}

/** Friendly module display names for the UI. */
export const MODULE_LABELS: Record<string, string> = {
  rmadm: "Lab MDM Agent",
  mesh_agent: "Mesh (Remote Desktop)",
  securecontainer: "SecureContainer (DLP)",
  dokany: "Dokany Driver",
  laborato_guard: "DLP Guard",
  wazuh: "Cyber Secure",
  mdm_dotnet: "MDM .NET Agent",
};

/** Order in which the chips should render in the table. */
export const MODULE_ORDER: string[] = [
  "rmadm",
  "mesh_agent",
  "securecontainer",
  "dokany",
  "laborato_guard",
  "wazuh",
  "mdm_dotnet",
];

/** Quasar color name for each state. */
export function moduleColor(state: ModuleState): string {
  switch (state) {
    case "ok": return "positive";
    case "partial": return "warning";
    case "missing": return "negative";
    default: return "grey";
  }
}

/** Material icon name for each state. */
export function moduleIcon(state: ModuleState): string {
  switch (state) {
    case "ok": return "check_circle";
    case "partial": return "warning";
    case "missing": return "cancel";
    default: return "help";
  }
}
