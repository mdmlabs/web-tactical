import axios from "axios";
import type {
  ConfigFile,
  CreateFilePayload,
  DeployRecord,
  DeployRequest,
  ListDeploysParams,
} from "@/cywm/types";

const BASE = "/api/cywm";

// ── snake_case → camelCase mappers ──────────────────────────────────

function mapFile(d: Record<string, unknown>): ConfigFile {
  return {
    id: String(d.id),
    target: d.target as ConfigFile["target"],
    category: d.category as ConfigFile["category"],
    filename: String(d.filename),
    content: String(d.content),
    contentSaved: String(d.content_saved),
    updatedAt: String(d.updated_at),
    updatedBy: String(d.updated_by),
  };
}

function sanitizeTarget(raw: string): string {
  return raw.replace(/\bWazuh\b/gi, "MDM Security");
}

function mapDeploy(d: Record<string, unknown>): DeployRecord {
  return {
    id: String(d.id),
    startedAt: String(d.started_at),
    target: sanitizeTarget(String(d.target)),
    filename: String(d.filename),
    category: d.category as DeployRecord["category"],
    user: String(d.user),
    status: d.status as DeployRecord["status"],
    durationMs: Number(d.duration_ms ?? 0),
    wazuhGroup: d.wazuh_group != null ? String(d.wazuh_group) : null,
    log: String(d.log ?? ""),
  };
}

// ── Files ────────────────────────────────────────────────────────────

export async function listFiles(): Promise<ConfigFile[]> {
  const { data } = await axios.get(`${BASE}/files/`);
  return (data as Record<string, unknown>[]).map(mapFile);
}

export async function getFile(id: string): Promise<ConfigFile> {
  const { data } = await axios.get(`${BASE}/files/${id}/`);
  return mapFile(data as Record<string, unknown>);
}

export async function createFile(
  payload: CreateFilePayload,
): Promise<ConfigFile> {
  const { data } = await axios.post(`${BASE}/files/`, payload);
  return mapFile(data as Record<string, unknown>);
}

export async function uploadFile(form: FormData): Promise<ConfigFile> {
  const { data } = await axios.post(`${BASE}/files/upload/`, form);
  return mapFile(data as Record<string, unknown>);
}

export async function saveFileContent(
  id: string,
  content: string,
): Promise<ConfigFile> {
  const { data } = await axios.put(`${BASE}/files/${id}/`, { content });
  return mapFile(data as Record<string, unknown>);
}

export async function deleteFile(
  id: string,
): Promise<{ id: string; deletedAt: string }> {
  const { data } = await axios.delete(`${BASE}/files/${id}/`);
  return {
    id: String(data.id),
    deletedAt: String(data.deleted_at),
  };
}

// ── Deploy ───────────────────────────────────────────────────────────

export async function deployFile(
  id: string,
  body?: DeployRequest,
): Promise<{ deployId: string }> {
  const { data } = await axios.post(`${BASE}/files/${id}/deploy/`, body ?? {});
  return { deployId: String(data.deploy_id) };
}

export async function getDeployStatus(
  deployId: string,
): Promise<DeployRecord> {
  const { data } = await axios.get(`${BASE}/deploys/${deployId}/`);
  return mapDeploy(data as Record<string, unknown>);
}

export async function listDeploys(
  params: ListDeploysParams = {},
): Promise<{ items: DeployRecord[]; total: number }> {
  // Convert camelCase params to snake_case query params
  const query: Record<string, string | number> = {};
  if (params.search) query.search = params.search;
  if (params.target) query.target = params.target;
  if (params.status) query.status = params.status;
  if (params.dateFrom) query.date_from = params.dateFrom;
  if (params.dateTo) query.date_to = params.dateTo;
  if (params.page) query.page = params.page;
  if (params.perPage) query.per_page = params.perPage;

  const { data } = await axios.get(`${BASE}/deploys/`, { params: query });
  return {
    items: (data.items as Record<string, unknown>[]).map(mapDeploy),
    total: Number(data.total),
  };
}

export async function getDeployLog(
  deployId: string,
): Promise<{ log: string }> {
  const { data } = await axios.get(`${BASE}/deploys/${deployId}/log/`);
  return { log: String(data.log) };
}

// ── Restart (Phase 3 stubs) ──────────────────────────────────────────

export async function restartManager(): Promise<{ ok: boolean; log: string }> {
  const { data } = await axios.post(`${BASE}/manager/restart/`);
  return { ok: Boolean(data.ok), log: String(data.log) };
}

export async function restartAgent(
  agentId: string,
): Promise<{ ok: boolean; log: string }> {
  const { data } = await axios.post(`${BASE}/agents/${agentId}/restart/`);
  return { ok: Boolean(data.ok), log: String(data.log) };
}
