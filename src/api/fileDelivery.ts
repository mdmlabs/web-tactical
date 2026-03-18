import axios from "axios";

const baseUrl = "/files/deliver";

export type DeliveryJobStatus = "pending" | "in_progress" | "completed" | "failed";
export type DeliveryTargetType = "agents" | "site" | "client";
export type DeliveryResultStatus =
  | "pending"
  | "downloading"
  | "installing"
  | "verifying"
  | "success"
  | "failed";

export interface DeliveryJobSummary {
  total: number;
  pending: number;
  success: number;
  failed: number;
}

export interface DeliveryJob {
  id: number;
  fileAsset: number;
  fileAssetName: string;
  name: string;
  status: DeliveryJobStatus;
  targetType: DeliveryTargetType;
  targetAgents: number[] | null;
  targetSite: number | null;
  targetClient: number | null;
  createdBy: number;
  createdByUsername: string;
  createdTime: string;
  resultsSummary: DeliveryJobSummary;
}

export interface DeliveryResult {
  id: number;
  job: number;
  agent: number;
  agentHostname: string;
  agentIdStr?: string;
  status: DeliveryResultStatus;
  exitCode: number | null;
  stdout: string | null;
  stderr: string | null;
  verificationPassed: boolean | null;
  errorMessage: string | null;
  createdTime: string;
  updatedTime: string;
}

export interface DeliveryJobDetails extends DeliveryJob {
  results: DeliveryResult[];
}

export interface CreateDeliveryJobRequest {
  fileAsset: number;
  name: string;
  targetType: DeliveryTargetType;
  targetAgents?: number[];
  targetSite?: number;
  targetClient?: number;
}

/**
 * Create a new file delivery job
 * Delivers a single file asset to specified agents/site/client
 */
export async function createDeliveryJob(
  request: CreateDeliveryJobRequest,
): Promise<DeliveryJob> {
  const payload: Record<string, unknown> = {
    file_asset: request.fileAsset,
    name: request.name,
    target_type: request.targetType,
  };

  if (request.targetType === "agents" && request.targetAgents) {
    payload.target_agents = request.targetAgents;
  } else if (request.targetType === "site" && request.targetSite) {
    payload.target_site = request.targetSite;
  } else if (request.targetType === "client" && request.targetClient) {
    payload.target_client = request.targetClient;
  }

  const { data } = await axios.post(`${baseUrl}/`, payload);
  return mapDeliveryJobFromApi(data);
}

/**
 * Get delivery job details with results
 */
export async function fetchDeliveryJob(jobId: number): Promise<DeliveryJobDetails> {
  const { data } = await axios.get(`${baseUrl}/${jobId}/`);
  return {
    ...mapDeliveryJobFromApi(data),
    results: (data.results || []).map(mapDeliveryResultFromApi),
  };
}

/**
 * List all delivery jobs
 */
export async function fetchDeliveryJobs(): Promise<DeliveryJob[]> {
  const { data } = await axios.get(`${baseUrl}/`);
  return (data || []).map(mapDeliveryJobFromApi);
}

/**
 * Retry failed deliveries for a job
 * Resets all failed results to pending status
 */
export async function retryFailedDeliveries(jobId: number): Promise<DeliveryJob> {
  const { data } = await axios.post(`${baseUrl}/${jobId}/retry/`, {});
  return mapDeliveryJobFromApi(data);
}

// Helper functions to map API responses from snake_case to camelCase
function mapDeliveryJobFromApi(data: Record<string, unknown>): DeliveryJob {
  return {
    id: Number(data.id),
    fileAsset: Number(data.file_asset),
    fileAssetName: String(data.file_asset_name || ""),
    name: String(data.name || ""),
    status: data.status as DeliveryJobStatus,
    targetType: data.target_type as DeliveryTargetType,
    targetAgents: data.target_agents ? (data.target_agents as number[]) : null,
    targetSite: data.target_site ? Number(data.target_site) : null,
    targetClient: data.target_client ? Number(data.target_client) : null,
    createdBy: Number(data.created_by),
    createdByUsername: String(data.created_by_username || ""),
    createdTime: String(data.created_time || ""),
    resultsSummary: data.results_summary
      ? {
          total: Number((data.results_summary as Record<string, unknown>).total || 0),
          pending: Number((data.results_summary as Record<string, unknown>).pending || 0),
          success: Number((data.results_summary as Record<string, unknown>).success || 0),
          failed: Number((data.results_summary as Record<string, unknown>).failed || 0),
        }
      : { total: 0, pending: 0, success: 0, failed: 0 },
  };
}

function mapDeliveryResultFromApi(data: Record<string, unknown>): DeliveryResult {
  return {
    id: Number(data.id),
    job: Number(data.job),
    agent: Number(data.agent),
    agentHostname: String(data.agent_hostname || ""),
    agentIdStr: data.agent_id_str ? String(data.agent_id_str) : undefined,
    status: data.status as DeliveryResultStatus,
    exitCode: data.exit_code !== null && data.exit_code !== undefined ? Number(data.exit_code) : null,
    stdout: data.stdout ? String(data.stdout) : null,
    stderr: data.stderr ? String(data.stderr) : null,
    verificationPassed:
      data.verification_passed !== null && data.verification_passed !== undefined
        ? Boolean(data.verification_passed)
        : null,
    errorMessage: data.error_message ? String(data.error_message) : null,
    createdTime: String(data.created_time || ""),
    updatedTime: String(data.updated_time || ""),
  };
}
