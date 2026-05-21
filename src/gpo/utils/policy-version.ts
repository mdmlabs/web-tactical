import { parsePolicyStatus } from "./policy-status";
import { parsePolicyVersion } from "./policy-meta";

export interface PolicyVersionRow {
  version: number;
  policyHash: string;
  name: string;
  displayName: string;
  scope?: number;
  policyStatus?: number;
  registryKey: string;
  valueName: string;
  explainText: string;
}

function str(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" && Number.isFinite(val)) return `${val}`;
  if (typeof val === "boolean") return val ? "true" : "false";
  return "";
}

function scopeNum(val: unknown): number | undefined {
  if (val === null || val === undefined) return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function getDescriptor(
  entry: Record<string, unknown>,
): Record<string, unknown> {
  const policy = entry.policy;
  if (policy && typeof policy === "object") {
    return policy as Record<string, unknown>;
  }
  return {};
}

function mapVersionEntry(raw: unknown): PolicyVersionRow | null {
  if (!raw || typeof raw !== "object") return null;
  const entry = raw as Record<string, unknown>;
  const descriptor = getDescriptor(entry);

  const version = parsePolicyVersion(entry.version ?? descriptor.version);
  if (version === undefined) return null;

  const hash = str(
    entry.policyHash ??
      entry.policy_hash ??
      descriptor.policyHash ??
      descriptor.policy_hash,
  ).trim();

  const name = str(descriptor.name ?? descriptor.policyName);
  const displayName =
    str(descriptor.displayName ?? descriptor.display_name) || name;

  return {
    version,
    policyHash: hash,
    name,
    displayName,
    scope: scopeNum(descriptor.scope),
    policyStatus: parsePolicyStatus(
      descriptor.policyStatus ?? descriptor.policy_status,
    ),
    registryKey: str(descriptor.registryKey ?? descriptor.registry_key),
    valueName: str(descriptor.valueName ?? descriptor.value_name),
    explainText: str(descriptor.explainText ?? descriptor.explain_text),
  };
}

export function mapPolicyVersionsResponse(
  response: unknown,
): PolicyVersionRow[] {
  if (!response || typeof response !== "object") return [];
  const obj = response as Record<string, unknown>;
  const list = obj.versionsList ?? obj.versions;
  if (!Array.isArray(list)) return [];

  const rows = list
    .map(mapVersionEntry)
    .filter((row): row is PolicyVersionRow => row !== null);

  rows.sort((a, b) => b.version - a.version);
  return rows;
}
