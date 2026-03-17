import type { Policy, Device, DeviceGroup } from "../types/policies";

export const mockPolicies: Policy[] = [
  {
    id: "1",
    name: "eyble3",
    platform: "windows",
    version: 2,
    segment: "Global",
    deviceCount: 0,
    summary: "1 app",
    created: "2026-02-28T10:00:00Z",
    updated: "2026-02-28T18:00:00Z",
    apps: [
      {
        id: "app-1",
        resourceId: "res-1",
        name: "Google Chrome",
        version: "122.0.6261.69",
        silentInstall: true,
        arguments: "/silent /install",
        timeout: 900,
        runAsUser: false,
        verification: {
          method: "registry",
          registryPath: "HKLM\\SOFTWARE\\Google\\Chrome",
          registryKey: "Version",
        },
      },
    ],
    scripts: [],
    resources: [],
    applicationControl: { tokens: [] },
    assignedDevices: [],
  },
  {
    id: "2",
    name: "test",
    platform: "windows",
    version: 3,
    segment: "Global",
    deviceCount: 0,
    summary: "",
    created: "2026-02-28T09:00:00Z",
    updated: "2026-02-28T17:00:00Z",
    apps: [],
    scripts: [],
    resources: [],
    applicationControl: { tokens: [] },
    assignedDevices: [],
  },
  {
    id: "3",
    name: "test2",
    platform: "windows",
    version: 1,
    segment: "Global",
    deviceCount: 0,
    summary: "Empty",
    created: "2026-02-28T08:00:00Z",
    updated: "2026-02-28T08:00:00Z",
    apps: [],
    scripts: [],
    resources: [],
    assignedDevices: [],
  },
];

export const mockDevices: Device[] = [
  {
    id: "dev-1",
    name: "DESKTOP-ABC123",
    segment: "Global",
    battery: 85,
    employee: "John Doe",
    policiesCount: 2,
    updated: "2026-02-28T16:30:00Z",
  },
  {
    id: "dev-2",
    name: "LAPTOP-XYZ789",
    segment: "Europe",
    battery: 45,
    employee: "Jane Smith",
    policiesCount: 1,
    updated: "2026-02-28T14:20:00Z",
  },
  {
    id: "dev-3",
    name: "WORKSTATION-001",
    segment: "North America",
    battery: 100,
    employee: "Mike Johnson",
    policiesCount: 3,
    updated: "2026-02-28T12:00:00Z",
  },
  {
    id: "dev-4",
    name: "PC-ENGINEERING",
    segment: "Development",
    battery: 72,
    employee: "Sarah Williams",
    policiesCount: 5,
    updated: "2026-02-28T10:45:00Z",
  },
  {
    id: "dev-5",
    name: "LAPTOP-SALES-02",
    segment: "Global",
    battery: 33,
    employee: "Tom Brown",
    policiesCount: 2,
    updated: "2026-02-27T18:00:00Z",
  },
];

export const mockDeviceGroups: DeviceGroup[] = [
  { id: "grp-1", name: "All devices", deviceCount: 150 },
  { id: "grp-2", name: "Client", deviceCount: 45 },
  { id: "grp-3", name: "Suite", deviceCount: 30 },
  { id: "grp-4", name: "Engineering", deviceCount: 25 },
  { id: "grp-5", name: "Sales", deviceCount: 35 },
  { id: "grp-6", name: "Marketing", deviceCount: 15 },
];

export const mockAppResources = [
  {
    id: "app-res-1",
    name: "Google Chrome",
    version: "122.0.6261.69",
    extension: "msi",
  },
  {
    id: "app-res-2",
    name: "Mozilla Firefox",
    version: "123.0",
    extension: "msi",
  },
  {
    id: "app-res-3",
    name: "Visual Studio Code",
    version: "1.87.0",
    extension: "exe",
  },
  { id: "app-res-4", name: "7-Zip", version: "23.01", extension: "msi" },
  { id: "app-res-5", name: "Notepad++", version: "8.6.2", extension: "exe" },
];

export const mockScriptResources = [
  { id: "script-res-1", name: "Cleanup Temp Files", language: "PowerShell" },
  { id: "script-res-2", name: "Install Updates", language: "PowerShell" },
  { id: "script-res-3", name: "Check Disk Space", language: "Batch" },
  { id: "script-res-4", name: "Configure Firewall", language: "PowerShell" },
];

export const mockBookResources = [
  { id: "book-res-1", name: "Employee Handbook 2026", extension: "pdf" },
  { id: "book-res-2", name: "Security Guidelines", extension: "pdf" },
  { id: "book-res-3", name: "IT Policy Manual", extension: "epub" },
];

export const mockImageResources = [
  { id: "img-res-1", name: "Company Logo", extension: "png" },
  { id: "img-res-2", name: "Desktop Wallpaper", extension: "jpg" },
];

export const mockCertificateResources = [
  { id: "cert-res-1", name: "Root CA Certificate", extension: "cer" },
  { id: "cert-res-2", name: "VPN Certificate", extension: "pfx" },
];

export function generatePolicyId(): string {
  return `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? "1 second ago" : `${diffMinutes} minutes ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }
  return date.toLocaleDateString();
}
