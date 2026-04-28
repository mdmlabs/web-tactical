import { fixtureFiles, fixtureHistory } from "@/cywm/data/fixtures";
import type {
  ConfigFile,
  CreateFilePayload,
  DeployRecord,
  DeployStatus,
  ListDeploysParams,
} from "@/cywm/types";

const STORAGE_FILES_KEY = "cywm.files";
const STORAGE_HISTORY_KEY = "cywm.history";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(): number {
  return 200 + Math.random() * 300;
}

function readLs<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLs(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof Error && e.name === "QuotaExceededError") {
      console.error("[cywm] localStorage quota exceeded:", e);
    } else {
      console.error("[cywm] localStorage write failed:", e);
    }
  }
}

function loadFiles(): ConfigFile[] {
  const stored = readLs<ConfigFile[] | null>(STORAGE_FILES_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  const seeded = structuredClone(fixtureFiles);
  writeLs(STORAGE_FILES_KEY, seeded);
  return seeded;
}

function saveFiles(files: ConfigFile[]): void {
  writeLs(STORAGE_FILES_KEY, files);
}

function loadHistory(): DeployRecord[] {
  const stored = readLs<DeployRecord[] | null>(STORAGE_HISTORY_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  const seeded = structuredClone(fixtureHistory);
  writeLs(STORAGE_HISTORY_KEY, seeded);
  return seeded;
}

function saveHistory(history: DeployRecord[]): void {
  writeLs(STORAGE_HISTORY_KEY, history);
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function listFiles(): Promise<ConfigFile[]> {
  await sleep(jitter());
  return loadFiles();
}

export async function getFile(id: string): Promise<ConfigFile> {
  await sleep(jitter());
  const file = loadFiles().find((f) => f.id === id);
  if (!file) throw new Error(`File not found: ${id}`);
  return file;
}

export async function createFile(
  payload: CreateFilePayload,
): Promise<ConfigFile> {
  await sleep(jitter());
  const files = loadFiles();
  const exists = files.some(
    (f) => f.target === payload.target && f.filename === payload.filename,
  );
  if (exists) {
    throw new Error(`File already exists: ${payload.filename}`);
  }
  const newFile: ConfigFile = {
    id: uid("f"),
    target: payload.target,
    category: payload.category,
    filename: payload.filename,
    content: payload.content,
    contentSaved: payload.content,
    updatedAt: new Date().toISOString(),
    updatedBy: "admin",
  };
  files.push(newFile);
  saveFiles(files);
  return newFile;
}

export async function uploadFile(form: FormData): Promise<ConfigFile> {
  await sleep(jitter());
  const target = form.get("target") as ConfigFile["target"];
  const category = form.get("category") as ConfigFile["category"];
  const file = form.get("file") as File | null;
  if (!file) throw new Error("No file in form data");
  const content = await file.text();
  return createFile({
    target,
    category,
    filename: file.name,
    content,
  });
}

export async function saveFileContent(
  id: string,
  content: string,
): Promise<ConfigFile> {
  await sleep(jitter());
  const files = loadFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error(`File not found: ${id}`);
  files[idx] = {
    ...files[idx],
    content,
    contentSaved: content,
    updatedAt: new Date().toISOString(),
    updatedBy: "admin",
  };
  saveFiles(files);
  return files[idx];
}

export async function deleteFile(
  id: string,
): Promise<{ id: string; deletedAt: string }> {
  await sleep(jitter());
  const files = loadFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error(`File not found: ${id}`);
  files.splice(idx, 1);
  saveFiles(files);
  return { id, deletedAt: new Date().toISOString() };
}

export async function deployFile(id: string): Promise<{ deployId: string }> {
  await sleep(jitter());
  const file = loadFiles().find((f) => f.id === id);
  if (!file) throw new Error(`File not found: ${id}`);
  return { deployId: uid("d") };
}

export async function getDeployStatus(deployId: string): Promise<DeployRecord> {
  await sleep(jitter());
  const history = loadHistory();
  const record = history.find((d) => d.id === deployId);
  if (!record) throw new Error(`Deploy not found: ${deployId}`);
  return record;
}

export async function listDeploys(
  params: ListDeploysParams = {},
): Promise<{ items: DeployRecord[]; total: number }> {
  await sleep(jitter());
  let items = loadHistory();

  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (d) =>
        d.filename.toLowerCase().includes(q) ||
        d.target.toLowerCase().includes(q) ||
        d.user.toLowerCase().includes(q),
    );
  }
  if (params.target) {
    items = items.filter((d) => d.target === params.target);
  }
  if (params.status) {
    items = items.filter((d) => d.status === params.status);
  }

  const total = items.length;
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 10;
  const start = (page - 1) * perPage;
  const paged = items.slice(start, start + perPage);

  return { items: paged, total };
}

export async function getDeployLog(deployId: string): Promise<{ log: string }> {
  await sleep(jitter());
  const record = loadHistory().find((d) => d.id === deployId);
  if (!record) throw new Error(`Deploy not found: ${deployId}`);
  return { log: record.log };
}

export function appendDeployRecord(record: DeployRecord): void {
  const history = loadHistory();
  history.unshift(record);
  saveHistory(history);
}

export function makeDeployRecord(
  file: ConfigFile,
  status: DeployStatus,
  durationMs: number,
  log: string,
): DeployRecord {
  const targetLabel =
    file.target === "manager"
      ? file.category === "shared"
        ? `${file.filename.split("/")[0]} group`
        : "Wazuh manager"
      : "WIN11-DEMO (009)";
  const filenameOnly =
    file.category === "shared"
      ? (file.filename.split("/").pop() ?? file.filename)
      : file.filename;
  return {
    id: uid("d"),
    startedAt: new Date().toISOString(),
    target: targetLabel,
    filename: filenameOnly,
    category: file.category,
    user: "admin",
    status,
    durationMs,
    log,
  };
}

export async function restartManager(): Promise<{ ok: boolean; log: string }> {
  await sleep(800);
  return {
    ok: true,
    log: "[mock] systemctl restart wazuh-manager → ok",
  };
}

export async function restartAgent(
  agentId: string,
): Promise<{ ok: boolean; log: string }> {
  await sleep(800);
  return {
    ok: true,
    log: `[mock] restart agent ${agentId} → ok`,
  };
}
