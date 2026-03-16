export type Platform = "windows" | "apple" | "android";
export type Scope = "primary_user" | "all_users" | "system";
export type VerificationMethod = "registry" | "file_exists" | "script";
export type ResourceType = "book" | "certificate" | "image";

export interface VerificationConfig {
  method: VerificationMethod;
  registryPath?: string;
  registryKey?: string;
  filePath?: string;
  scriptId?: string;
}

export interface PolicyApp {
  id: string;
  resourceId: string;
  name: string;
  version: string;
  silentInstall: boolean;
  arguments: string;
  timeout: number;
  runAsUser: boolean;
  verification: VerificationConfig;
}

export interface PolicyScript {
  id: string;
  resourceId: string;
  name: string;
  timeout: number;
  runAsUser: boolean;
}

export interface PolicyResource {
  id: string;
  resourceId: string;
  name: string;
  type: ResourceType;
  scope: Scope;
  locations: string[];
}

export interface ApplicationControlConfig {
  tokens: string[];
}

export interface Policy {
  id: string;
  name: string;
  platform: Platform;
  version: number;
  segment: string;
  deviceCount: number;
  summary: string;
  created: string;
  updated: string;
  apps: PolicyApp[];
  scripts: PolicyScript[];
  resources: PolicyResource[];
  applicationControl?: ApplicationControlConfig;
  assignedDevices: number[];
}

export interface PolicyListResponse {
  count: number;
  results: Policy[];
}

export interface CreatePolicyRequest {
  name: string;
  platform: string;
}

export interface UpdatePolicyRequest {
  name?: string;
  platform?: string;
  segment?: string;
  apps?: PolicyApp[];
  scripts?: PolicyScript[];
  resources?: PolicyResource[];
  applicationControl?: ApplicationControlConfig;
  assignedDevices?: number[];
}

export interface AssignDevicesRequest {
  deviceIds: number[];
}

export interface UnassignDeviceRequest {
  deviceId: number;
}

export interface Device {
  id: number;
  name: string;
  segment: string;
  battery: number;
  employee: string;
  policiesCount: number;
  updated: string;
}

export interface DeviceGroup {
  id: string;
  name: string;
  deviceCount: number;
}

export interface PolicyCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
}

export const PLATFORMS: { id: Platform; label: string; icon: string; disabled: boolean }[] = [
  { id: "apple", label: "Apple", icon: "mdi-apple", disabled: true },
  { id: "android", label: "Android", icon: "mdi-android", disabled: true },
  { id: "windows", label: "Windows", icon: "mdi-microsoft-windows", disabled: false },
];

export const SEGMENTS = ["Global", "Europe", "North America", "Asia Pacific", "Development", "Production"];

export const SCOPES: { value: Scope; label: string }[] = [
  { value: "primary_user", label: "Primary user" },
  { value: "all_users", label: "All users" },
  { value: "system", label: "System" },
];

export const VERIFICATION_METHODS: { value: VerificationMethod; label: string }[] = [
  { value: "registry", label: "Registry" },
  { value: "file_exists", label: "File exists" },
  { value: "script", label: "Script" },
];
