export interface AgentColumnDef {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
}

export const agentColumns: AgentColumnDef[] = [
  { id: "hostname", label: "Hostname", visible: true, sortable: true },
  { id: "client_name", label: "Client", visible: true, sortable: true },
  { id: "site_name", label: "Site", visible: true, sortable: true },
  { id: "operating_system", label: "OS", visible: true, sortable: true },
  { id: "checks", label: "Checks", visible: true },
  { id: "patches", label: "Patches", visible: true },
  { id: "logged_username", label: "Logged User", visible: true },
  { id: "last_seen", label: "Last Seen", visible: true, sortable: true },
  { id: "policy_status", label: "Policy Status", visible: true },
];
