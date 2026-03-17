import axios from "axios";
import type {
  Policy,
  PolicyApp,
  PolicyScript,
  PolicyResource,
  Device,
  DeviceGroup,
  CreatePolicyRequest,
  PolicyListResponse,
} from "@/policies/types/policies";

const baseUrl = "/policies";

// Helper to convert snake_case API response to camelCase
function mapPolicyFromApi(data: Record<string, unknown>): Policy {
  return {
    id: String(data.id),
    name: String(data.name),
    platform: data.platform as "windows" | "apple" | "android",
    version: Number(data.version),
    segment: String(data.segment),
    deviceCount: Number(data.device_count),
    summary: String(data.summary),
    created: String(data.created),
    updated: String(data.updated),
    apps: Array.isArray(data.apps)
      ? data.apps.map((app: Record<string, unknown>) => ({
          id: String(app.id),
          resourceId: Number(app.resource_id),
          name: String(app.name),
          version: String(app.version),
          silentInstall: Boolean(app.silent_install),
          arguments: String(app.arguments || ""),
          timeout: Number(app.timeout),
          runAsUser: Boolean(app.run_as_user),
          verification: app.verification as PolicyApp["verification"],
        }))
      : [],
    scripts: Array.isArray(data.scripts)
      ? data.scripts.map((script: Record<string, unknown>) => ({
          id: String(script.id),
          resourceId: Number(script.resource_id),
          name: String(script.name),
          timeout: Number(script.timeout),
          runAsUser: Boolean(script.run_as_user),
        }))
      : [],
    resources: Array.isArray(data.resources)
      ? data.resources.map((res: Record<string, unknown>) => ({
          id: String(res.id),
          resourceId: Number(res.resource_id),
          name: String(res.name),
          type: res.type as "book" | "certificate" | "image",
          scope: res.scope as "primary_user" | "all_users" | "system",
          locations: Array.isArray(res.locations) ? res.locations : [],
        }))
      : [],
    applicationControl: data.application_control
      ? {
          tokens: Array.isArray((data.application_control as Record<string, unknown>).tokens)
            ? (data.application_control as Record<string, unknown>).tokens as string[]
            : [],
        }
      : { tokens: [] },
    assignedDevices: Array.isArray(data.assigned_devices)
      ? data.assigned_devices.map(Number)
      : [],
  };
}

// Helper to convert camelCase to snake_case for API requests
function mapPolicyToApi(policy: Partial<Policy>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  if (policy.name !== undefined) mapped.name = policy.name;
  if (policy.platform !== undefined) mapped.platform = policy.platform;
  if (policy.segment !== undefined) mapped.segment = policy.segment;
  if (policy.apps !== undefined) {
    mapped.apps = policy.apps.map((app) => ({
      id: app.id.startsWith('app-') ? undefined : app.id,
      resource_id: app.resourceId,
      name: app.name,
      version: app.version,
      silent_install: app.silentInstall,
      arguments: app.arguments,
      timeout: app.timeout,
      run_as_user: app.runAsUser,
      verification: app.verification,
    }));
  }
  if (policy.scripts !== undefined) {
    mapped.scripts = policy.scripts.map((script) => ({
      id: script.id.startsWith('script-') ? undefined : script.id,
      resource_id: script.resourceId,
      name: script.name,
      timeout: script.timeout,
      run_as_user: script.runAsUser,
    }));
  }
  if (policy.resources !== undefined) {
    mapped.resources = policy.resources.map((res) => ({
      id: res.id.startsWith('resource-') ? undefined : res.id,
      resource_id: res.resourceId,
      name: res.name,
      type: res.type,
      scope: res.scope,
      locations: res.locations,
    }));
  }
  if (policy.applicationControl !== undefined) {
    mapped.application_control = {
      tokens: policy.applicationControl.tokens,
    };
  }
  if (policy.assignedDevices !== undefined) {
    mapped.assigned_devices = policy.assignedDevices;
  }

  return mapped;
}

// List policies with filtering
export async function fetchPolicies(params: {
  platform?: string;
  segment?: string;
  search?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<PolicyListResponse> {
  const { data } = await axios.get(`${baseUrl}/`, { params });
  return {
    count: data.count,
    results: data.results.map(mapPolicyFromApi),
  };
}

// Get single policy with all nested data
export async function fetchPolicy(id: string): Promise<Policy> {
  const { data } = await axios.get(`${baseUrl}/${id}/`);
  return mapPolicyFromApi(data);
}

// Create new policy
export async function createPolicy(
  payload: CreatePolicyRequest,
): Promise<Policy> {
  const { data } = await axios.post(`${baseUrl}/`, payload);
  console.log('[policies.ts] createPolicy response:', data);
  return mapPolicyFromApi(data);
}

// Update policy (full save)
export async function updatePolicy(
  id: string,
  payload: Partial<Policy>,
): Promise<Policy> {
  const apiPayload = mapPolicyToApi(payload);
  const { data } = await axios.put(`${baseUrl}/${id}/`, apiPayload);
  return mapPolicyFromApi(data);
}

// Delete policy
export async function deletePolicy(id: string): Promise<void> {
  await axios.delete(`${baseUrl}/${id}/`);
}

// Add app to policy
export async function addPolicyApp(
  policyId: string,
  payload: {
    resourceId: number;
    silentInstall?: boolean;
    arguments?: string;
    timeout?: number;
    runAsUser?: boolean;
    verification?: PolicyApp["verification"];
  },
): Promise<PolicyApp> {
  const apiPayload = {
    resource_id: payload.resourceId,
    silent_install: payload.silentInstall,
    arguments: payload.arguments,
    timeout: payload.timeout,
    run_as_user: payload.runAsUser,
    verification: payload.verification,
  };
  const { data } = await axios.post(`${baseUrl}/${policyId}/apps/`, apiPayload);
  return {
    id: String(data.id),
    resourceId: Number(data.resource_id),
    name: String(data.name),
    version: String(data.version),
    silentInstall: Boolean(data.silent_install),
    arguments: String(data.arguments || ""),
    timeout: Number(data.timeout),
    runAsUser: Boolean(data.run_as_user),
    verification: data.verification as PolicyApp["verification"],
  };
}

// Remove app from policy
export async function removePolicyApp(
  policyId: string,
  appId: string,
): Promise<void> {
  await axios.delete(`${baseUrl}/${policyId}/apps/${appId}/`);
}

// Add script to policy
export async function addPolicyScript(
  policyId: string,
  payload: {
    resourceId: number;
    timeout?: number;
    runAsUser?: boolean;
  },
): Promise<PolicyScript> {
  const apiPayload = {
    resource_id: payload.resourceId,
    timeout: payload.timeout,
    run_as_user: payload.runAsUser,
  };
  const { data } = await axios.post(
    `${baseUrl}/${policyId}/scripts/`,
    apiPayload,
  );
  return {
    id: String(data.id),
    resourceId: Number(data.resource_id),
    name: String(data.name),
    timeout: Number(data.timeout),
    runAsUser: Boolean(data.run_as_user),
  };
}

// Remove script from policy
export async function removePolicyScript(
  policyId: string,
  scriptId: string,
): Promise<void> {
  await axios.delete(`${baseUrl}/${policyId}/scripts/${scriptId}/`);
}

// Add resource to policy
export async function addPolicyResource(
  policyId: string,
  payload: {
    resourceId: number;
    type: "book" | "certificate" | "image";
    scope: "primary_user" | "all_users" | "system";
    locations: string[];
  },
): Promise<PolicyResource> {
  const apiPayload = {
    resource_id: payload.resourceId,
    type: payload.type,
    scope: payload.scope,
    locations: payload.locations,
  };
  const { data } = await axios.post(
    `${baseUrl}/${policyId}/resources/`,
    apiPayload,
  );
  return {
    id: String(data.id),
    resourceId: Number(data.resource_id),
    name: String(data.name),
    type: data.type as "book" | "certificate" | "image",
    scope: data.scope as "primary_user" | "all_users" | "system",
    locations: Array.isArray(data.locations) ? data.locations : [],
  };
}

// Remove resource from policy
export async function removePolicyResource(
  policyId: string,
  resourceId: string,
): Promise<void> {
  await axios.delete(`${baseUrl}/${policyId}/resources/${resourceId}/`);
}

// Assign devices to policy
export async function assignDevices(
  policyId: string,
  deviceIds: number[],
): Promise<{ assignedDevices: number[]; deviceCount: number }> {
  const { data } = await axios.post(`${baseUrl}/${policyId}/assign/`, {
    device_ids: deviceIds,
  });
  return {
    assignedDevices: Array.isArray(data.assigned_devices)
      ? data.assigned_devices.map(Number)
      : [],
    deviceCount: Number(data.device_count),
  };
}

// List devices available for assignment
export async function fetchDevices(): Promise<Device[]> {
  const { data } = await axios.get("/agents/", { params: { detail: false } });
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list.map((d: Record<string, unknown>) => ({
    id: Number(d.id),
    name: String(d.hostname),
    segment: String(d.client),
    battery: 0,
    employee: String(d.agent_id ?? ''),
    policiesCount: 0,
    updated: '',
  }));
}

// List device groups
export async function fetchDeviceGroups(): Promise<DeviceGroup[]> {
  const { data } = await axios.get("/device-groups/");
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list.map((g: Record<string, unknown>) => ({
    id: String(g.id),
    name: String(g.name),
    deviceCount: Number(g.device_count),
  }));
}

// Unassign device from policy
export async function unassignDevice(
  policyId: string,
  deviceId: number,
): Promise<{ assignedDevices: number[]; deviceCount: number }> {
  const { data } = await axios.post(`${baseUrl}/${policyId}/unassign/`, {
    device_id: deviceId,
  });
  return {
    assignedDevices: Array.isArray(data.assigned_devices)
      ? data.assigned_devices.map(Number)
      : [],
    deviceCount: Number(data.device_count),
  };
}

// Deploy policy to devices - assigns devices and creates delivery jobs for all resources
export async function deployPolicy(
  policyId: string,
  deviceIds: number[],
): Promise<{
  assignedDevices: number[];
  deviceCount: number;
  deliveryJobsCreated: number[];
}> {
  const { data } = await axios.post(`${baseUrl}/${policyId}/deploy/`, {
    device_ids: deviceIds,
  });
  return {
    assignedDevices: Array.isArray(data.assigned_devices)
      ? data.assigned_devices.map(Number)
      : [],
    deviceCount: Number(data.device_count),
    deliveryJobsCreated: Array.isArray(data.delivery_jobs_created)
      ? data.delivery_jobs_created.map(Number)
      : [],
  };
}
