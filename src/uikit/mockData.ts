// Mock data for UEM Platform UI Kit
// Simulates real enterprise device management data

export interface Agent {
  id: string;
  hostname: string;
  clientName: string;
  siteName: string;
  os: string;
  osVersion: string;
  platform: "windows" | "linux" | "macos";
  status: "online" | "offline" | "warning" | "error" | "overdue";
  lastSeen: string;
  ipAddress: string;
  publicIp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  agentVersion: string;
  uptime: string;
  loggedUser: string;
  checksPassing: number;
  checksFailing: number;
  checksWarning: number;
  patchesPending: number;
  pendingActions: number;
  needsReboot: boolean;
  monitoringType: "server" | "workstation";
  description: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  totalRam: string;
  bootTime: string;
  policyStatus: "compliant" | "non-compliant" | "pending" | "unknown";
  tags: string[];
}

export interface Client {
  id: number;
  name: string;
  agentCount: number;
  sites: Site[];
}

export interface Site {
  id: number;
  name: string;
  clientId: number;
  agentCount: number;
}

export interface Policy {
  id: number;
  name: string;
  description: string;
  type: "patch" | "automation" | "alert" | "check";
  status: "active" | "inactive" | "draft";
  assignedAgents: number;
  lastModified: string;
}

export interface AlertItem {
  id: number;
  severity: "critical" | "warning" | "info";
  message: string;
  agent: string;
  timestamp: string;
  acknowledged: boolean;
}

// ============================================================
// MOCK AGENTS
// ============================================================
export const mockAgents: Agent[] = [
  {
    id: "AGT-001",
    hostname: "PROD-DC01",
    clientName: "Acme Corp",
    siteName: "New York HQ",
    os: "Windows Server 2022",
    osVersion: "21H2",
    platform: "windows",
    status: "online",
    lastSeen: "2 min ago",
    ipAddress: "10.0.1.10",
    publicIp: "203.0.113.1",
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    agentVersion: "2.8.1",
    uptime: "45d 12h 33m",
    loggedUser: "SYSTEM",
    checksPassing: 12,
    checksFailing: 0,
    checksWarning: 1,
    patchesPending: 3,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "server",
    description: "Primary Domain Controller",
    serialNumber: "SN-DC01-2024",
    manufacturer: "Dell",
    model: "PowerEdge R740",
    totalRam: "64 GB",
    bootTime: "2024-02-05 03:22:15",
    policyStatus: "compliant",
    tags: ["production", "critical", "ad"],
  },
  {
    id: "AGT-002",
    hostname: "PROD-SQL01",
    clientName: "Acme Corp",
    siteName: "New York HQ",
    os: "Windows Server 2022",
    osVersion: "21H2",
    platform: "windows",
    status: "warning",
    lastSeen: "5 min ago",
    ipAddress: "10.0.1.20",
    publicIp: "203.0.113.1",
    cpuUsage: 78,
    memoryUsage: 89,
    diskUsage: 72,
    agentVersion: "2.8.1",
    uptime: "12d 8h 15m",
    loggedUser: "SYSTEM",
    checksPassing: 10,
    checksFailing: 2,
    checksWarning: 3,
    patchesPending: 7,
    pendingActions: 2,
    needsReboot: true,
    monitoringType: "server",
    description: "SQL Database Server",
    serialNumber: "SN-SQL01-2024",
    manufacturer: "Dell",
    model: "PowerEdge R750",
    totalRam: "128 GB",
    bootTime: "2024-03-10 14:05:22",
    policyStatus: "non-compliant",
    tags: ["production", "critical", "database"],
  },
  {
    id: "AGT-003",
    hostname: "WS-JSMITH01",
    clientName: "Acme Corp",
    siteName: "New York HQ",
    os: "Windows 11 Pro",
    osVersion: "23H2",
    platform: "windows",
    status: "online",
    lastSeen: "1 min ago",
    ipAddress: "10.0.2.101",
    publicIp: "203.0.113.2",
    cpuUsage: 12,
    memoryUsage: 45,
    diskUsage: 55,
    agentVersion: "2.8.1",
    uptime: "3d 2h 10m",
    loggedUser: "jsmith",
    checksPassing: 8,
    checksFailing: 0,
    checksWarning: 0,
    patchesPending: 1,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "workstation",
    description: "John Smith - Marketing",
    serialNumber: "SN-WS101-2024",
    manufacturer: "Lenovo",
    model: "ThinkPad X1 Carbon",
    totalRam: "16 GB",
    bootTime: "2024-03-19 08:15:00",
    policyStatus: "compliant",
    tags: ["workstation", "marketing"],
  },
  {
    id: "AGT-004",
    hostname: "LNX-WEB01",
    clientName: "Acme Corp",
    siteName: "AWS US-East",
    os: "Ubuntu 22.04 LTS",
    osVersion: "22.04",
    platform: "linux",
    status: "online",
    lastSeen: "30 sec ago",
    ipAddress: "172.31.1.50",
    publicIp: "54.210.33.44",
    cpuUsage: 34,
    memoryUsage: 52,
    diskUsage: 38,
    agentVersion: "2.8.0",
    uptime: "90d 5h 22m",
    loggedUser: "root",
    checksPassing: 15,
    checksFailing: 0,
    checksWarning: 0,
    patchesPending: 0,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "server",
    description: "Web Application Server",
    serialNumber: "i-0abcdef1234567890",
    manufacturer: "AWS",
    model: "t3.xlarge",
    totalRam: "16 GB",
    bootTime: "2023-12-21 02:00:00",
    policyStatus: "compliant",
    tags: ["production", "web", "aws"],
  },
  {
    id: "AGT-005",
    hostname: "PROD-FS01",
    clientName: "TechStart Inc",
    siteName: "San Francisco",
    os: "Windows Server 2019",
    osVersion: "1809",
    platform: "windows",
    status: "offline",
    lastSeen: "3 hours ago",
    ipAddress: "10.10.1.30",
    publicIp: "198.51.100.5",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 88,
    agentVersion: "2.7.5",
    uptime: "-",
    loggedUser: "-",
    checksPassing: 0,
    checksFailing: 6,
    checksWarning: 0,
    patchesPending: 15,
    pendingActions: 4,
    needsReboot: true,
    monitoringType: "server",
    description: "File Server (Primary)",
    serialNumber: "SN-FS01-2023",
    manufacturer: "HP",
    model: "ProLiant DL380",
    totalRam: "32 GB",
    bootTime: "-",
    policyStatus: "unknown",
    tags: ["production", "fileserver"],
  },
  {
    id: "AGT-006",
    hostname: "MAC-DESIGN01",
    clientName: "TechStart Inc",
    siteName: "San Francisco",
    os: "macOS Sonoma",
    osVersion: "14.3",
    platform: "macos",
    status: "online",
    lastSeen: "1 min ago",
    ipAddress: "10.10.2.50",
    publicIp: "198.51.100.6",
    cpuUsage: 55,
    memoryUsage: 72,
    diskUsage: 65,
    agentVersion: "2.8.1",
    uptime: "7d 14h 30m",
    loggedUser: "adesigner",
    checksPassing: 6,
    checksFailing: 0,
    checksWarning: 1,
    patchesPending: 2,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "workstation",
    description: "Design Team - Alex",
    serialNumber: "C02XL1234",
    manufacturer: "Apple",
    model: "MacBook Pro 16",
    totalRam: "32 GB",
    bootTime: "2024-03-14 10:20:00",
    policyStatus: "compliant",
    tags: ["workstation", "design", "mac"],
  },
  {
    id: "AGT-007",
    hostname: "PROD-EXCH01",
    clientName: "GlobalFinance",
    siteName: "London Office",
    os: "Windows Server 2022",
    osVersion: "21H2",
    platform: "windows",
    status: "error",
    lastSeen: "15 min ago",
    ipAddress: "10.20.1.15",
    publicIp: "185.3.45.67",
    cpuUsage: 95,
    memoryUsage: 92,
    diskUsage: 87,
    agentVersion: "2.8.1",
    uptime: "2d 5h 10m",
    loggedUser: "SYSTEM",
    checksPassing: 5,
    checksFailing: 4,
    checksWarning: 2,
    patchesPending: 12,
    pendingActions: 3,
    needsReboot: true,
    monitoringType: "server",
    description: "Exchange Server",
    serialNumber: "SN-EXCH01-2024",
    manufacturer: "Dell",
    model: "PowerEdge R650",
    totalRam: "96 GB",
    bootTime: "2024-03-20 04:30:00",
    policyStatus: "non-compliant",
    tags: ["production", "critical", "exchange", "email"],
  },
  {
    id: "AGT-008",
    hostname: "WS-ANALYST05",
    clientName: "GlobalFinance",
    siteName: "London Office",
    os: "Windows 11 Enterprise",
    osVersion: "23H2",
    platform: "windows",
    status: "online",
    lastSeen: "2 min ago",
    ipAddress: "10.20.2.205",
    publicIp: "185.3.45.68",
    cpuUsage: 8,
    memoryUsage: 38,
    diskUsage: 42,
    agentVersion: "2.8.1",
    uptime: "1d 6h 45m",
    loggedUser: "mwilson",
    checksPassing: 8,
    checksFailing: 0,
    checksWarning: 0,
    patchesPending: 0,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "workstation",
    description: "Data Analyst - M. Wilson",
    serialNumber: "SN-WS205-2024",
    manufacturer: "Dell",
    model: "Latitude 7440",
    totalRam: "32 GB",
    bootTime: "2024-03-21 07:00:00",
    policyStatus: "compliant",
    tags: ["workstation", "finance"],
  },
  {
    id: "AGT-009",
    hostname: "LNX-DOCKER01",
    clientName: "Acme Corp",
    siteName: "AWS US-East",
    os: "CentOS Stream 9",
    osVersion: "9",
    platform: "linux",
    status: "online",
    lastSeen: "45 sec ago",
    ipAddress: "172.31.2.10",
    publicIp: "54.210.33.50",
    cpuUsage: 42,
    memoryUsage: 61,
    diskUsage: 55,
    agentVersion: "2.8.1",
    uptime: "180d 3h 12m",
    loggedUser: "root",
    checksPassing: 14,
    checksFailing: 0,
    checksWarning: 0,
    patchesPending: 0,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "server",
    description: "Docker Container Host",
    serialNumber: "i-0fedcba9876543210",
    manufacturer: "AWS",
    model: "m5.2xlarge",
    totalRam: "32 GB",
    bootTime: "2023-09-22 00:00:00",
    policyStatus: "compliant",
    tags: ["production", "docker", "aws"],
  },
  {
    id: "AGT-010",
    hostname: "PROD-BACKUP01",
    clientName: "TechStart Inc",
    siteName: "Austin DC",
    os: "Windows Server 2022",
    osVersion: "21H2",
    platform: "windows",
    status: "overdue",
    lastSeen: "2 days ago",
    ipAddress: "10.30.1.40",
    publicIp: "192.0.2.10",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 94,
    agentVersion: "2.6.0",
    uptime: "-",
    loggedUser: "-",
    checksPassing: 0,
    checksFailing: 8,
    checksWarning: 0,
    patchesPending: 22,
    pendingActions: 6,
    needsReboot: true,
    monitoringType: "server",
    description: "Backup Server",
    serialNumber: "SN-BK01-2023",
    manufacturer: "Supermicro",
    model: "SuperServer E300",
    totalRam: "64 GB",
    bootTime: "-",
    policyStatus: "non-compliant",
    tags: ["production", "backup", "critical"],
  },
  {
    id: "AGT-011",
    hostname: "WS-KLEE02",
    clientName: "Acme Corp",
    siteName: "Chicago Branch",
    os: "Windows 10 Pro",
    osVersion: "22H2",
    platform: "windows",
    status: "online",
    lastSeen: "3 min ago",
    ipAddress: "10.5.2.15",
    publicIp: "203.0.113.10",
    cpuUsage: 18,
    memoryUsage: 52,
    diskUsage: 60,
    agentVersion: "2.8.1",
    uptime: "5d 8h 20m",
    loggedUser: "klee",
    checksPassing: 7,
    checksFailing: 1,
    checksWarning: 0,
    patchesPending: 4,
    pendingActions: 1,
    needsReboot: false,
    monitoringType: "workstation",
    description: "K. Lee - Engineering",
    serialNumber: "SN-WS015-2024",
    manufacturer: "HP",
    model: "EliteBook 840 G10",
    totalRam: "16 GB",
    bootTime: "2024-03-17 09:10:00",
    policyStatus: "compliant",
    tags: ["workstation", "engineering"],
  },
  {
    id: "AGT-012",
    hostname: "LNX-MONITOR01",
    clientName: "GlobalFinance",
    siteName: "Frankfurt DC",
    os: "Debian 12",
    osVersion: "12.4",
    platform: "linux",
    status: "online",
    lastSeen: "20 sec ago",
    ipAddress: "10.40.1.5",
    publicIp: "91.108.22.33",
    cpuUsage: 15,
    memoryUsage: 30,
    diskUsage: 28,
    agentVersion: "2.8.1",
    uptime: "210d 18h 45m",
    loggedUser: "monitoring",
    checksPassing: 20,
    checksFailing: 0,
    checksWarning: 0,
    patchesPending: 0,
    pendingActions: 0,
    needsReboot: false,
    monitoringType: "server",
    description: "Monitoring Infrastructure",
    serialNumber: "SRV-MON-2023",
    manufacturer: "Hetzner",
    model: "AX101",
    totalRam: "128 GB",
    bootTime: "2023-08-24 01:00:00",
    policyStatus: "compliant",
    tags: ["production", "monitoring", "infrastructure"],
  },
];

// ============================================================
// MOCK CLIENTS & SITES
// ============================================================
export const mockClients: Client[] = [
  {
    id: 1,
    name: "Acme Corp",
    agentCount: 156,
    sites: [
      { id: 1, name: "New York HQ", clientId: 1, agentCount: 85 },
      { id: 2, name: "AWS US-East", clientId: 1, agentCount: 42 },
      { id: 3, name: "Chicago Branch", clientId: 1, agentCount: 29 },
    ],
  },
  {
    id: 2,
    name: "TechStart Inc",
    agentCount: 78,
    sites: [
      { id: 4, name: "San Francisco", clientId: 2, agentCount: 45 },
      { id: 5, name: "Austin DC", clientId: 2, agentCount: 33 },
    ],
  },
  {
    id: 3,
    name: "GlobalFinance",
    agentCount: 234,
    sites: [
      { id: 6, name: "London Office", clientId: 3, agentCount: 120 },
      { id: 7, name: "Frankfurt DC", clientId: 3, agentCount: 68 },
      { id: 8, name: "Singapore Branch", clientId: 3, agentCount: 46 },
    ],
  },
];

// ============================================================
// MOCK POLICIES
// ============================================================
export const mockPolicies: Policy[] = [
  { id: 1, name: "Windows Updates - Monthly", description: "Install approved Windows patches on the 2nd Tuesday", type: "patch", status: "active", assignedAgents: 312, lastModified: "2024-03-15" },
  { id: 2, name: "Disk Space Alert", description: "Alert when disk usage exceeds 85%", type: "alert", status: "active", assignedAgents: 468, lastModified: "2024-03-10" },
  { id: 3, name: "Daily Health Check", description: "Run health check script daily at 6 AM", type: "check", status: "active", assignedAgents: 468, lastModified: "2024-02-28" },
  { id: 4, name: "Software Audit - Weekly", description: "Collect installed software inventory weekly", type: "automation", status: "active", assignedAgents: 468, lastModified: "2024-03-01" },
  { id: 5, name: "Linux Security Updates", description: "Auto-install security patches on Linux servers", type: "patch", status: "active", assignedAgents: 85, lastModified: "2024-03-18" },
  { id: 6, name: "Reboot Pending Alert", description: "Alert when reboot has been pending for > 7 days", type: "alert", status: "draft", assignedAgents: 0, lastModified: "2024-03-20" },
];

// ============================================================
// MOCK ALERTS
// ============================================================
export const mockAlerts: AlertItem[] = [
  { id: 1, severity: "critical", message: "Exchange Server: CPU usage at 95% for 15 minutes", agent: "PROD-EXCH01", timestamp: "5 min ago", acknowledged: false },
  { id: 2, severity: "critical", message: "Backup Server unreachable for 48 hours", agent: "PROD-BACKUP01", timestamp: "2 hours ago", acknowledged: false },
  { id: 3, severity: "warning", message: "SQL Server: Memory usage exceeds 85%", agent: "PROD-SQL01", timestamp: "20 min ago", acknowledged: false },
  { id: 4, severity: "warning", message: "Disk space on C: drive at 88%", agent: "PROD-FS01", timestamp: "1 hour ago", acknowledged: true },
  { id: 5, severity: "warning", message: "12 patches pending installation for > 14 days", agent: "PROD-EXCH01", timestamp: "3 hours ago", acknowledged: false },
  { id: 6, severity: "info", message: "Agent version 2.8.1 available for update", agent: "PROD-BACKUP01", timestamp: "1 day ago", acknowledged: true },
  { id: 7, severity: "info", message: "Scheduled maintenance window starts in 24 hours", agent: "-", timestamp: "6 hours ago", acknowledged: true },
];

// ============================================================
// NAVIGATION ITEMS
// ============================================================
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
  children?: NavItem[];
  route?: string;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", route: "/uikit" },
  { id: "agents", label: "Agents", icon: "dns", badge: 468, route: "/uikit" },
  { id: "policies", label: "Policies", icon: "rule", route: "/uikit" },
  { id: "automation", label: "Automation", icon: "smart_toy", route: "/uikit" },
  { id: "scripts", label: "Scripts", icon: "code", route: "/uikit" },
  { id: "resources", label: "Resources", icon: "folder", route: "/uikit/resources" },
  { id: "alerts", label: "Alerts", icon: "warning_amber", badge: 5, badgeColor: "error", route: "/uikit" },
  { id: "logs", label: "Audit Logs", icon: "history", route: "/uikit" },
  { id: "reports", label: "Reports", icon: "assessment", route: "/uikit" },
  { id: "settings", label: "Settings", icon: "settings", route: "/uikit" },
];

// ============================================================
// DASHBOARD STATS
// ============================================================
export interface DashStat {
  label: string;
  value: number | string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

export const dashStats: DashStat[] = [
  { label: "Total Agents", value: 468, icon: "devices", trend: "+12 this week", trendUp: true, color: "primary" },
  { label: "Online", value: 421, icon: "check_circle", trend: "90% uptime", trendUp: true, color: "success" },
  { label: "Alerts", value: 5, icon: "warning", trend: "+2 new", trendUp: false, color: "warning" },
  { label: "Critical", value: 2, icon: "error", trend: "requires attention", trendUp: false, color: "error" },
  { label: "Patches Pending", value: 64, icon: "system_update", trend: "-8 since yesterday", trendUp: true, color: "info" },
  { label: "Compliant", value: "89%", icon: "verified", trend: "+2% vs last week", trendUp: true, color: "success" },
];
