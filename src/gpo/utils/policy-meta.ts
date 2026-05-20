import type { GPOPolicy } from "../types/gpo";
import type { PolicyItem } from "../types/policy-catalog";
import {
  parsePolicyStatus,
  policyStatusLabel,
} from "./policy-status";

export interface PolicyMeta {
  policyStatus?: number;
  version?: number;
}

export interface CollectionPolicyItem {
  id: number;
  name: string;
  policyStatus?: number;
  version?: number;
}

export function parsePolicyVersion(val: unknown): number | undefined {
  if (val === null || val === undefined) return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

export function extractPolicyMetaFromRecord(
  record: Record<string, unknown> | undefined,
): PolicyMeta {
  if (!record) return {};
  return {
    policyStatus: parsePolicyStatus(
      record.policy_status ?? record.policyStatus,
    ),
    version: parsePolicyVersion(record.version),
  };
}

export function mapRawCollectionPolicy(p: unknown): CollectionPolicyItem | null {
  if (!p || typeof p !== "object") return null;
  const item = p as Record<string, unknown>;
  const idRaw = item.id;
  const id = Number(idRaw);
  const name = String(
    item.displayName ?? item.display_name ?? item.name ?? idRaw ?? "",
  ).trim();
  const { policyStatus, version } = extractPolicyMetaFromRecord(item);
  return {
    id: Number.isFinite(id) ? Math.trunc(id) : 0,
    name,
    policyStatus,
    version,
  };
}

export function policyMetaSearchText(meta: PolicyMeta): string {
  const parts: string[] = [];
  if (meta.version !== undefined) parts.push(String(meta.version));
  if (meta.policyStatus !== undefined) {
    parts.push(policyStatusLabel(meta.policyStatus));
  }
  return parts.join(" ").toLowerCase();
}


export function policyItemToGpoPolicyRow(p: PolicyItem): GPOPolicy {
  return {
    id: p.id,
    name: p.name,
    displayName: p.displayName,
    path: `CN={${p.id}},CN=Policies,CN=System`,
    enabled: true,
    description: p.description,
    scope: p.scope,
    hash: p.hash,
    policyStatus: p.policyStatus,
    version: p.version,
  };
}
