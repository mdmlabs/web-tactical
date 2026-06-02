import axios from "axios";

const base = "/winupdate/patches";

export interface UploadedPatch {
  filename: string;
  build_id: string;
  arch: string;
  url: string;
}

export interface PatchUploadError {
  filename: string;
  error: string;
}

export interface UploadPatchesResponse {
  uploaded: UploadedPatch[];
  errors: PatchUploadError[];
}

export interface ApplyPatchPayload {
  agent_ids?: string[];
  site_ids?: number[];
}

export interface ApplyPatchResponse {
  deployment_id: number;
  total_agents: number;
}

export type DeploymentStatus = "pending" | "running" | "completed";

export type AgentPatchStatus =
  | "pending"
  | "dispatched"
  | "nats_failed"
  | "downloading"
  | "installing"
  | "installed"
  | "script_failed";

export interface DeploymentRecord {
  id: number;
  created_at: string;
  created_by: string;
  status: DeploymentStatus;
  total_agents: number;
  dispatched_count: number;
  failed_count: number;
}

export interface DeploymentAgent {
  id: number;
  status: AgentPatchStatus;
  updated_at: string;
  history_id: number;
  agent__agent_id: string;
  agent__hostname: string;
}

export interface DeploymentDetail extends DeploymentRecord {
  agents: DeploymentAgent[];
}

export async function uploadPatches(
  files: File[],
  buildIds: string[],
  archs: string[],
  onProgress?: (percent: number) => void,
): Promise<UploadPatchesResponse> {
  const form = new FormData();
  files.forEach((f, i) => {
    form.append("files[]", f);
    form.append("build_ids[]", buildIds[i]);
    form.append("archs[]", archs[i]);
  });
  const { data } = await axios.post<UploadPatchesResponse>(
    `${base}/upload/`,
    form,
    {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    },
  );
  return data;
}

export async function applyPatch(
  payload: ApplyPatchPayload,
): Promise<ApplyPatchResponse> {
  const { data } = await axios.post<ApplyPatchResponse>(
    `${base}/apply/`,
    payload,
  );
  return data;
}

export async function fetchDeployments(): Promise<DeploymentRecord[]> {
  const { data } = await axios.get<DeploymentRecord[]>(
    `${base}/deployments/`,
  );
  return data;
}

export async function fetchDeploymentDetail(
  id: number,
): Promise<DeploymentDetail> {
  const { data } = await axios.get<DeploymentDetail>(
    `${base}/deployments/${id}/`,
  );
  return data;
}

export async function fetchAgentHistoryItem(
  agentId: string,
  historyId: number,
) {
  const { data } = await axios.get(`/agents/${agentId}/history/`);
  const list = Array.isArray(data) ? data : (data?.results ?? []);
  const item = list.find((h: { id: number }) => h.id === historyId);
  if (!item) throw new Error(`History item ${historyId} not found`);
  return item;
}
