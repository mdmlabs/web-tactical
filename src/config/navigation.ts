export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: string; // dialog name for useDialogRegistry
  children?: NavItem[];
  permission?: string; // permission key for role-based access
  badge?: () => number; // reactive badge count
  dividerBefore?: boolean;
}

export const navigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    route: "/",
  },
  {
    id: "agents",
    label: "Agents",
    icon: "devices",
    route: "/",
    children: [
      {
        id: "install",
        label: "Install Agent",
        icon: "add",
        action: "installAgent",
      },
      {
        id: "update",
        label: "Update Agents",
        icon: "system_update",
        route: "/updates",
      },
    ],
  },
  {
    id: "policies",
    label: "Policies",
    icon: "policy",
    route: "/policies",
  },
  {
    id: "gpo",
    label: "Windows GPO",
    icon: "admin_panel_settings",
    route: "/gpo",
  },
  {
    id: "resources",
    label: "Resources",
    icon: "folder",
    route: "/resources",
  },
  {
    id: "cywm",
    label: "CYWM",
    icon: "cloud_upload",
    dividerBefore: true,
    children: [
      {
        id: "cywm-files",
        label: "Files & Deploy",
        icon: "upload_file",
        route: "/cywm/files",
      },
      {
        id: "cywm-history",
        label: "Deploy History",
        icon: "history",
        route: "/cywm/history",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "bolt",
    dividerBefore: true,
    children: [
      {
        id: "bulk",
        label: "Bulk Actions",
        icon: "dynamic_feed",
        action: "bulkAction",
      },
      {
        id: "pending",
        label: "Pending Actions",
        icon: "pending_actions",
        action: "pendingActions",
      },
      {
        id: "reports",
        label: "Reports",
        icon: "assessment",
        action: "reportsManager",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    route: "/settings",
    children: [
      {
        id: "clients",
        label: "Clients",
        icon: "business",
        route: "/settings/clients",
      },
      {
        id: "users",
        label: "Users & Permissions",
        icon: "group",
        route: "/settings/users",
      },
      {
        id: "alerts",
        label: "Alerts",
        icon: "notifications",
        route: "/settings/alerts",
      },
      {
        id: "automation",
        label: "Automation",
        icon: "auto_fix_high",
        route: "/settings/automation",
      },
      {
        id: "global",
        label: "Global Settings",
        icon: "tune",
        route: "/settings/global",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: "build",
    children: [
      {
        id: "scripts",
        label: "Script Manager",
        icon: "code",
        action: "scriptManager",
      },
      {
        id: "audit",
        label: "Audit Log",
        icon: "history",
        action: "auditLog",
      },
      {
        id: "debug",
        label: "Debug Log",
        icon: "bug_report",
        action: "debugLog",
      },
      {
        id: "maintenance",
        label: "Server Maintenance",
        icon: "engineering",
        action: "serverMaintenance",
      },
    ],
  },
];
