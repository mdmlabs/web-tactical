import { defineStore } from "pinia";
import { ref, computed } from "vue";

// ---- Types ----
export interface SspDevice {
  id: string;
  name: string;
  type: "laptop" | "desktop" | "mobile" | "tablet";
  serialNumber: string;
  status: "active" | "inactive";
  addedAt: string;
}

export interface SspRight {
  id: string;
  system: string;
  accessLevel: "read" | "write" | "admin";
  grantedAt: string;
  privacyConcern: boolean;
}

export interface SspApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  rating: number;
  version: string;
  latestVersion: string;
  requiresApproval: boolean;
  licenseStatus: "ok" | "warning" | "expired";
  blacklisted: boolean;
  deprecationDate: string | null;
  patches: SspPatch[];
}

export interface SspPatch {
  id: string;
  version: string;
  description: string;
  releaseDate: string;
  critical: boolean;
}

export interface SspInstallation {
  id: string;
  appId: string;
  appName: string;
  deviceId: string;
  deviceName: string;
  status: "pending" | "approved" | "installing" | "installed" | "failed" | "rejected";
  requestedAt: string;
  version: string;
  forcedUpdate: boolean;
}

export interface SspApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  appId: string;
  appName: string;
  deviceId: string;
  deviceName: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export interface SspDbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface SspConfigProfile {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface SspOrgParam {
  id: string;
  key: string;
  value: string;
}

export const useSelfServiceStore = defineStore("selfService", () => {
  // ---- Auth / Role ----
  const currentRole = ref<"admin" | "user">("user");
  const currentUser = ref({
    id: "user-1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 555-0123",
    position: "Software Engineer",
  });

  // ---- Identity & Parameters (admin) ----
  const selectedOrganization = ref("Acme Corp");
  const organizations = ref(["Acme Corp", "Globex Inc", "Initech", "Umbrella Corp"]);
  const orgParams = ref<SspOrgParam[]>([
    { id: "p1", key: "max_devices_per_user", value: "5" },
    { id: "p2", key: "auto_approve_apps", value: "false" },
    { id: "p3", key: "session_timeout_minutes", value: "30" },
  ]);

  // ---- Devices ----
  const devices = ref<SspDevice[]>([
    { id: "d1", name: "MacBook Pro 16", type: "laptop", serialNumber: "SN-MB-001", status: "active", addedAt: "2025-06-15" },
    { id: "d2", name: "iPhone 15 Pro", type: "mobile", serialNumber: "SN-IP-002", status: "active", addedAt: "2025-08-20" },
    { id: "d3", name: "Dell Monitor WS", type: "desktop", serialNumber: "SN-DL-003", status: "inactive", addedAt: "2025-03-10" },
  ]);

  // ---- Rights ----
  const rights = ref<SspRight[]>([
    { id: "r1", system: "CRM System", accessLevel: "write", grantedAt: "2025-04-01", privacyConcern: false },
    { id: "r2", system: "HR Portal", accessLevel: "read", grantedAt: "2025-05-15", privacyConcern: true },
    { id: "r3", system: "Code Repository", accessLevel: "admin", grantedAt: "2025-02-20", privacyConcern: false },
    { id: "r4", system: "File Server", accessLevel: "write", grantedAt: "2025-07-10", privacyConcern: true },
  ]);
  const availableRights = ref([
    "CRM System", "HR Portal", "Code Repository", "File Server",
    "Email System", "VPN Access", "Cloud Storage", "Analytics Dashboard",
    "Admin Console", "Billing System",
  ]);

  // ---- Apps Catalog ----
  const apps = ref<SspApp[]>([
    {
      id: "a1", name: "Slack", icon: "chat", description: "Team messaging and collaboration platform",
      category: "Communication", rating: 4.5, version: "4.35.0", latestVersion: "4.36.1",
      requiresApproval: false, licenseStatus: "ok", blacklisted: false, deprecationDate: null,
      patches: [
        { id: "pt1", version: "4.35.1", description: "Security hotfix", releaseDate: "2026-03-01", critical: true },
        { id: "pt2", version: "4.36.0", description: "Performance improvements", releaseDate: "2026-03-15", critical: false },
      ],
    },
    {
      id: "a2", name: "VS Code", icon: "code", description: "Lightweight code editor with extensions support",
      category: "Development", rating: 4.8, version: "1.90.0", latestVersion: "1.90.0",
      requiresApproval: false, licenseStatus: "ok", blacklisted: false, deprecationDate: null,
      patches: [],
    },
    {
      id: "a3", name: "Figma", icon: "brush", description: "Design and prototyping tool for teams",
      category: "Design", rating: 4.6, version: "116.0", latestVersion: "118.0",
      requiresApproval: true, licenseStatus: "warning", blacklisted: false, deprecationDate: null,
      patches: [
        { id: "pt3", version: "117.0", description: "Bug fixes and stability", releaseDate: "2026-02-20", critical: false },
        { id: "pt4", version: "118.0", description: "New auto-layout features", releaseDate: "2026-04-01", critical: false },
      ],
    },
    {
      id: "a4", name: "Jira", icon: "assignment", description: "Project management and issue tracking",
      category: "Productivity", rating: 3.9, version: "9.12.0", latestVersion: "9.14.0",
      requiresApproval: true, licenseStatus: "expired", blacklisted: false, deprecationDate: "2026-06-30",
      patches: [
        { id: "pt5", version: "9.13.0", description: "Critical security update", releaseDate: "2026-01-15", critical: true },
        { id: "pt6", version: "9.14.0", description: "New dashboard features", releaseDate: "2026-03-20", critical: false },
      ],
    },
    {
      id: "a5", name: "Zoom", icon: "videocam", description: "Video conferencing and online meetings",
      category: "Communication", rating: 4.2, version: "5.17.0", latestVersion: "5.17.0",
      requiresApproval: false, licenseStatus: "ok", blacklisted: false, deprecationDate: null,
      patches: [],
    },
    {
      id: "a6", name: "Legacy CRM Tool", icon: "inventory", description: "Old CRM system scheduled for removal",
      category: "Productivity", rating: 2.5, version: "3.1.0", latestVersion: "3.1.0",
      requiresApproval: false, licenseStatus: "expired", blacklisted: false, deprecationDate: "2026-05-01",
      patches: [],
    },
    {
      id: "a7", name: "Unauthorized P2P", icon: "block", description: "P2P file sharing (blocked by admin)",
      category: "Utility", rating: 1.0, version: "2.0.0", latestVersion: "2.0.0",
      requiresApproval: false, licenseStatus: "ok", blacklisted: true, deprecationDate: null,
      patches: [],
    },
    {
      id: "a8", name: "Docker Desktop", icon: "cloud_queue", description: "Container management platform",
      category: "Development", rating: 4.4, version: "4.28.0", latestVersion: "4.30.0",
      requiresApproval: true, licenseStatus: "ok", blacklisted: false, deprecationDate: null,
      patches: [
        { id: "pt7", version: "4.29.0", description: "Kubernetes update", releaseDate: "2026-02-10", critical: false },
        { id: "pt8", version: "4.30.0", description: "Security patches", releaseDate: "2026-04-05", critical: true },
      ],
    },
  ]);

  // ---- Installations ----
  const installations = ref<SspInstallation[]>([
    { id: "i1", appId: "a1", appName: "Slack", deviceId: "d1", deviceName: "MacBook Pro 16", status: "installed", requestedAt: "2025-06-20", version: "4.35.0", forcedUpdate: false },
    { id: "i2", appId: "a2", appName: "VS Code", deviceId: "d1", deviceName: "MacBook Pro 16", status: "installed", requestedAt: "2025-06-20", version: "1.90.0", forcedUpdate: false },
    { id: "i3", appId: "a3", appName: "Figma", deviceId: "d1", deviceName: "MacBook Pro 16", status: "pending", requestedAt: "2026-04-20", version: "116.0", forcedUpdate: false },
    { id: "i4", appId: "a5", appName: "Zoom", deviceId: "d2", deviceName: "iPhone 15 Pro", status: "installed", requestedAt: "2025-09-01", version: "5.17.0", forcedUpdate: false },
  ]);

  // ---- Approval Queue (admin) ----
  const approvalQueue = ref<SspApprovalRequest[]>([
    { id: "aq1", userId: "user-2", userName: "Jane Smith", appId: "a3", appName: "Figma", deviceId: "d1", deviceName: "MacBook Pro 16", requestedAt: "2026-04-20", status: "pending", reason: "Need for design work on Project X" },
    { id: "aq2", userId: "user-3", userName: "Bob Wilson", appId: "a8", appName: "Docker Desktop", deviceId: "d3", deviceName: "Dell Workstation", requestedAt: "2026-04-18", status: "pending", reason: "Required for containerized development" },
    { id: "aq3", userId: "user-1", userName: "John Doe", appId: "a4", appName: "Jira", deviceId: "d1", deviceName: "MacBook Pro 16", requestedAt: "2026-04-15", status: "approved", reason: "Project management needs" },
  ]);

  // ---- Admin DB Config ----
  const dbConfig = ref<SspDbConfig>({
    host: "db.company.local",
    port: 5432,
    database: "selfservice_db",
    username: "ssp_admin",
    password: "",
  });

  // ---- Admin Config Profiles ----
  const configProfiles = ref<SspConfigProfile[]>([
    { id: "cp1", name: "Production", description: "Production environment configuration", active: true },
    { id: "cp2", name: "Staging", description: "Staging environment for testing", active: false },
    { id: "cp3", name: "Development", description: "Local development setup", active: false },
  ]);

  // ---- Self-service module toggle ----
  const selfServiceEnabled = ref(true);

  // ---- Computed ----
  const isAdmin = computed(() => currentRole.value === "admin");

  const visibleApps = computed(() => {
    if (currentRole.value === "admin") return apps.value;
    return apps.value.filter((a) => !a.blacklisted);
  });

  const pendingApprovals = computed(() =>
    approvalQueue.value.filter((a) => a.status === "pending"),
  );

  const installedAppsForUser = computed(() =>
    installations.value.filter((i) => i.status === "installed"),
  );

  const appsNeedingUpdate = computed(() =>
    apps.value.filter((a) => a.version !== a.latestVersion && !a.blacklisted),
  );

  const deprecatingApps = computed(() =>
    apps.value.filter((a) => a.deprecationDate !== null),
  );

  // ---- Actions ----
  function addDevice(device: Omit<SspDevice, "id" | "addedAt" | "status">) {
    devices.value.push({
      ...device,
      id: "d" + Date.now(),
      status: "active",
      addedAt: new Date().toISOString().split("T")[0],
    });
  }

  function updateDevice(id: string, updates: Partial<SspDevice>) {
    const idx = devices.value.findIndex((d) => d.id === id);
    if (idx !== -1) devices.value[idx] = { ...devices.value[idx], ...updates };
  }

  function removeDevice(id: string) {
    devices.value = devices.value.filter((d) => d.id !== id);
    installations.value = installations.value.filter((i) => i.deviceId !== id);
  }

  function addRight(right: Omit<SspRight, "id" | "grantedAt">) {
    rights.value.push({
      ...right,
      id: "r" + Date.now(),
      grantedAt: new Date().toISOString().split("T")[0],
    });
  }

  function updateRight(id: string, updates: Partial<SspRight>) {
    const idx = rights.value.findIndex((r) => r.id === id);
    if (idx !== -1) rights.value[idx] = { ...rights.value[idx], ...updates };
  }

  function requestInstall(appId: string, deviceId: string) {
    const app = apps.value.find((a) => a.id === appId);
    const device = devices.value.find((d) => d.id === deviceId);
    if (!app || !device) return;

    const installId = "i" + Date.now();
    const status = app.requiresApproval ? "pending" : "installing";

    installations.value.push({
      id: installId,
      appId,
      appName: app.name,
      deviceId,
      deviceName: device.name,
      status,
      requestedAt: new Date().toISOString().split("T")[0],
      version: app.version,
      forcedUpdate: false,
    });

    if (app.requiresApproval) {
      approvalQueue.value.push({
        id: "aq" + Date.now(),
        userId: currentUser.value.id,
        userName: currentUser.value.name,
        appId,
        appName: app.name,
        deviceId,
        deviceName: device.name,
        requestedAt: new Date().toISOString().split("T")[0],
        status: "pending",
        reason: "Self-service installation request",
      });
    } else {
      // Simulate auto-install
      setTimeout(() => {
        const inst = installations.value.find((i) => i.id === installId);
        if (inst) inst.status = "installed";
      }, 2000);
    }
  }

  function approveRequest(requestId: string) {
    const req = approvalQueue.value.find((r) => r.id === requestId);
    if (!req) return;
    req.status = "approved";

    const inst = installations.value.find(
      (i) => i.appId === req.appId && i.deviceId === req.deviceId && i.status === "pending",
    );
    if (inst) {
      inst.status = "installing";
      setTimeout(() => {
        inst.status = "installed";
      }, 2000);
    }
  }

  function rejectRequest(requestId: string) {
    const req = approvalQueue.value.find((r) => r.id === requestId);
    if (!req) return;
    req.status = "rejected";

    const inst = installations.value.find(
      (i) => i.appId === req.appId && i.deviceId === req.deviceId && i.status === "pending",
    );
    if (inst) inst.status = "rejected";
  }

  function uninstallApp(installationId: string) {
    installations.value = installations.value.filter((i) => i.id !== installationId);
  }

  function updateAppVersion(installationId: string, newVersion: string) {
    const inst = installations.value.find((i) => i.id === installationId);
    if (inst) {
      inst.status = "installing";
      inst.version = newVersion;
      setTimeout(() => {
        inst.status = "installed";
      }, 2000);
    }
  }

  function toggleBlacklist(appId: string) {
    const app = apps.value.find((a) => a.id === appId);
    if (app) app.blacklisted = !app.blacklisted;
  }

  function setDeprecationDate(appId: string, date: string | null) {
    const app = apps.value.find((a) => a.id === appId);
    if (app) app.deprecationDate = date;
  }

  function addOrgParam(key: string, value: string) {
    orgParams.value.push({ id: "p" + Date.now(), key, value });
  }

  function updateOrgParam(id: string, key: string, value: string) {
    const idx = orgParams.value.findIndex((p) => p.id === id);
    if (idx !== -1) {
      orgParams.value[idx].key = key;
      orgParams.value[idx].value = value;
    }
  }

  function removeOrgParam(id: string) {
    orgParams.value = orgParams.value.filter((p) => p.id !== id);
  }

  function addConfigProfile(profile: Omit<SspConfigProfile, "id">) {
    configProfiles.value.push({ ...profile, id: "cp" + Date.now() });
  }

  function updateConfigProfile(id: string, updates: Partial<SspConfigProfile>) {
    const idx = configProfiles.value.findIndex((p) => p.id === id);
    if (idx !== -1) configProfiles.value[idx] = { ...configProfiles.value[idx], ...updates };
  }

  function removeConfigProfile(id: string) {
    configProfiles.value = configProfiles.value.filter((p) => p.id !== id);
  }

  return {
    // State
    currentRole,
    currentUser,
    selectedOrganization,
    organizations,
    orgParams,
    devices,
    rights,
    availableRights,
    apps,
    installations,
    approvalQueue,
    dbConfig,
    configProfiles,
    selfServiceEnabled,
    // Computed
    isAdmin,
    visibleApps,
    pendingApprovals,
    installedAppsForUser,
    appsNeedingUpdate,
    deprecatingApps,
    // Actions
    addDevice,
    updateDevice,
    removeDevice,
    addRight,
    updateRight,
    requestInstall,
    approveRequest,
    rejectRequest,
    uninstallApp,
    updateAppVersion,
    toggleBlacklist,
    setDeprecationDate,
    addOrgParam,
    updateOrgParam,
    removeOrgParam,
    addConfigProfile,
    updateConfigProfile,
    removeConfigProfile,
  };
});
