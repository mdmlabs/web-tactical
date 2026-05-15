export type FileTarget = "manager" | "windows-agent";

export type FileCategory =
  | "rules"
  | "decoders"
  | "ossec-snippets"
  | "shared"
  | "active-response";

export type DeployStatus = "success" | "failed" | "running";

export interface ConfigFile {
  id: string;
  target: FileTarget;
  category: FileCategory;
  filename: string;
  content: string;
  contentSaved: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DeployRecord {
  id: string;
  startedAt: string;
  target: string;
  filename: string;
  category: FileCategory;
  user: string;
  status: DeployStatus;
  durationMs: number;
  wazuhGroup: string | null;
  log: string;
}

export interface FileTemplate {
  id: string;
  label: string;
  target: FileTarget;
  category: FileCategory;
  filenameSuggestion: string;
  content: string;
}

export interface ListDeploysParams {
  search?: string;
  target?: string;
  status?: DeployStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}

export interface CreateFilePayload {
  target: FileTarget;
  category: FileCategory;
  filename: string;
  content: string;
}

export interface DeployRequest {
  agent_ids?: string[];
  group?: string;
}

export const CATEGORY_LABELS: Record<FileCategory, string> = {
  rules: "rules",
  decoders: "decoders",
  "ossec-snippets": "ossec-snippets",
  shared: "shared",
  "active-response": "active-response",
};

export const TARGET_LABELS: Record<FileTarget, string> = {
  manager: "Manager",
  "windows-agent": "Windows agent",
};

export function categoryToLanguage(
  category: FileCategory,
  filename: string,
): string {
  if (category === "active-response") {
    if (filename.endsWith(".ps1")) return "powershell";
    if (filename.endsWith(".cmd") || filename.endsWith(".bat")) return "bat";
    if (filename.endsWith(".py")) return "python";
    return "plaintext";
  }
  if (category === "shared") {
    if (filename.endsWith(".yml") || filename.endsWith(".yaml")) return "yaml";
  }
  return "xml";
}
