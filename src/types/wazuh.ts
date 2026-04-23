// === Wazuh API Response wrappers ===
export interface WazuhResponse<T> {
  data: T;
  message: string;
  error: number; // 0 = success
}

export interface WazuhListResponse<T> {
  data: {
    affected_items: T[];
    total_affected_items: number;
    total_failed_items: number;
    failed_items: unknown[];
  };
  message: string;
  error: number;
}

// === Authentication ===
export interface WazuhAuthResponse {
  data: {
    token: string;
  };
  error: number;
}

// === Wazuh Agent ===
export type WazuhAgentStatus =
  | "active"
  | "disconnected"
  | "pending"
  | "never_connected";

export interface WazuhAgentOS {
  arch: string;
  name: string;
  platform: string;
  version: string;
  major?: string;
  minor?: string;
  build?: string;
  uname?: string;
}

export interface WazuhAgent {
  id: string;
  name: string;
  ip: string;
  status: WazuhAgentStatus;
  status_code?: number;
  version: string;
  manager?: string;
  node_name?: string;
  dateAdd: string;
  lastKeepAlive: string;
  group: string[];
  group_config_status?: "synced" | "not synced";
  mergedSum?: string;
  configSum?: string;
  registerIP?: string;
  os: WazuhAgentOS;
}

// === Alerts ===
export interface WazuhAlertRule {
  id: string;
  level: number;
  description: string;
  groups: string[];
  mitre?: {
    id: string[];
    tactic: string[];
    technique: string[];
  };
  pci_dss?: string[];
  hipaa?: string[];
  nist_800_53?: string[];
  gdpr?: string[];
}

export interface WazuhAlert {
  _id: string;
  _source: {
    timestamp: string;
    rule: WazuhAlertRule;
    agent: {
      id: string;
      name: string;
      ip: string;
    };
    manager: { name: string };
    data: Record<string, unknown>;
    decoder: { name: string };
    location: string;
    full_log?: string;
  };
}

// === Wazuh Rule ===
export interface WazuhRule {
  id: number;
  level: number;
  description: string;
  groups: string[];
  filename: string;
  status: string;
  details?: Record<string, unknown>;
  pci_dss?: string[];
  gdpr?: string[];
  hipaa?: string[];
  nist_800_53?: string[];
  mitre?: {
    id: string[];
    tactic: string[];
    technique: string[];
  };
}

// === Merged Agent (Tactical + Wazuh) ===
export interface MergedAgent {
  // Tactical RMM data
  tactical_agent_id: string;
  hostname: string;
  site_name: string;
  client_name: string;
  status: string;
  plat: string;
  operating_system: string;
  last_seen: string;

  // Wazuh data (null if not found)
  wazuh_agent_id: string | null;
  wazuh_status: WazuhAgentStatus | null;
  wazuh_last_keep_alive: string | null;
  wazuh_groups: string[] | null;
  wazuh_version: string | null;

  // Computed
  is_synced: boolean;
  security_alerts_count: number;
  critical_alerts_count: number;
}

// === Dashboard Summary ===
export interface WazuhSecuritySummary {
  total_agents: number;
  active_agents: number;
  disconnected_agents: number;
  synced_with_tactical: number;
  not_synced: number;

  alerts_today: number;
  critical_alerts_today: number;
  high_alerts_today: number;
  medium_alerts_today: number;

  top_rules: { rule_id: string; description: string; count: number }[];
  top_mitre_tactics: { tactic: string; count: number }[];
  alerts_by_hour: { hour: string; count: number }[];
}

// === Vulnerability ===
export interface WazuhVulnerability {
  cve: string;
  name: string;
  version: string;
  architecture?: string;
  severity: string;
  cvss2_score?: number;
  cvss3_score?: number;
  detection_time: string;
  title?: string;
  published?: string;
  updated?: string;
  external_references?: string[];
  condition?: string;
  status?: string;
}

// === Syscheck (FIM) ===

// === Wazuh Group ===
export interface WazuhGroup {
  name: string;
  count: number;
  mergedSum?: string;
  configSum?: string;
}

export interface WazuhGroupFile {
  filename: string;
  hash: string;
}

export interface WazuhGroupConfig {
  // Group shared configuration (agent.conf XML content)
  filters?: Record<string, unknown>;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

// === Syscheck (FIM) ===
export interface WazuhSyscheckEntry {
  file: string;
  type: string;
  date: string;
  size?: number;
  perm?: string;
  uid?: string;
  gid?: string;
  uname?: string;
  gname?: string;
  md5?: string;
  sha1?: string;
  sha256?: string;
  mtime?: string;
  inode?: number;
  attributes?: number;
}

// === SCA ===
export interface WazuhSCAPolicy {
  policy_id: string;
  name: string;
  description: string;
  references: string;
  hash_file: string;
  total_checks: number;
  pass: number;
  fail: number;
  invalid: number;
  score: number;
  start_scan: string;
  end_scan: string;
}

export interface WazuhSCACheck {
  id: number;
  policy_id: string;
  title: string;
  description?: string;
  rationale?: string;
  remediation?: string;
  compliance?: { key: string; value: string }[];
  rules?: { type: string; rule: string }[];
  condition?: string;
  command?: string;
  file?: string;
  directory?: string;
  process?: string;
  registry?: string;
  result: "passed" | "failed" | "not applicable" | string;
  reason?: string;
}

// === Syscollector ===
export interface WazuhSyscollectorHardware {
  cpu: { cores: number; mhz: number; name: string };
  ram: { total: number; free: number; usage: number };
  board_serial: string;
  scan: { id: number; time: string };
}

export interface WazuhSyscollectorOS {
  hostname: string;
  os_name: string;
  os_version: string;
  os_platform: string;
  architecture: string;
  os_major: string;
  os_minor: string;
  os_build: string;
  sysname: string;
  release: string;
  version: string;
  scan: { id: number; time: string };
}

// === Syscollector: Packages ===
export interface WazuhSyscollectorPackage {
  scan: { id: number; time: string };
  name: string;
  version: string;
  vendor?: string;
  architecture?: string;
  format?: string;
  description?: string;
  size?: number;
  priority?: string;
  section?: string;
  install_time?: string;
  multiarch?: string;
  source?: string;
  agent_id?: string;
}

// === Syscollector: Processes ===
export interface WazuhSyscollectorProcess {
  scan: { id: number; time: string };
  pid: number;
  name: string;
  state: string;
  ppid?: number;
  cmd?: string;
  argvs?: string;
  euser?: string;
  egroup?: string;
  fgroup?: string;
  ruser?: string;
  rgroup?: string;
  suser?: string;
  sgroup?: string;
  nlwp?: number;
  priority?: number;
  nice?: number;
  size?: number;
  vm_size?: number;
  resident?: number;
  share?: number;
  start_time?: number;
  pgrp?: number;
  session?: number;
  tgid?: number;
  tty?: number;
  processor?: number;
  agent_id?: string;
}

// === Syscollector: Network interfaces ===
export interface WazuhSyscollectorNetiface {
  scan: { id: number; time: string };
  name: string;
  type?: string;
  state?: string;
  mac?: string;
  mtu?: number;
  tx: { packets?: number; bytes?: number; errors?: number; dropped?: number };
  rx: { packets?: number; bytes?: number; errors?: number; dropped?: number };
  agent_id?: string;
}

// === Syscollector: Network addresses ===
export interface WazuhSyscollectorNetaddr {
  scan: { id: number; time: string };
  iface: string;
  proto: string;
  address: string;
  netmask?: string;
  broadcast?: string;
  agent_id?: string;
}

// === Syscollector: Ports ===
export interface WazuhSyscollectorPort {
  scan: { id: number; time: string };
  local: { ip: string; port: number };
  remote?: { ip: string; port: number };
  state?: string;
  protocol?: string;
  pid?: number;
  process?: string;
  agent_id?: string;
}

// === Manager Stats ===
export interface WazuhManagerHourlyStat {
  averages: number[];
  interactions: number;
}

// === Error mapping ===
export const WAZUH_ERROR_MESSAGES: Record<number, string> = {
  401: "MDM-Lab authentication error. Check server configuration.",
  403: "Insufficient permissions for MDM-Lab API.",
  404: "Resource not found in MDM-Lab.",
  500: "Internal MDM-Lab Server error.",
};
