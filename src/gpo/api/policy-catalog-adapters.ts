import type { CategoryNode, PolicyItem } from "../types/policy-catalog";

function str(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return Number.isFinite(val) ? `${val}` : "";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "bigint") return `${val}`;
  return "";
}

function num(val: unknown, fallback: number): number {
  if (val === null || val === undefined) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeCategoryTree(response: unknown): CategoryNode[] {
  const list =
    (response as { categoriesList?: unknown[] }).categoriesList ??
    (response as { categories?: unknown[] }).categories ??
    [];

  function convert(cat: unknown): CategoryNode | null {
    if (!cat || typeof cat !== "object") return null;
    const c = cat as {
      id?: number;
      categoryName?: string;
      category_name?: string;
      displayName?: string;
      display_name?: string;
      childsList?: unknown[];
      childs?: unknown[];
    };
    const categoryName = c.categoryName ?? c.category_name ?? "";
    const displayName = c.displayName ?? c.display_name ?? categoryName;
    const id = `category-${c.id ?? ""}`;
    const childs = c.childsList ?? c.childs ?? [];
    return {
      id,
      label: displayName,
      icon: "folder",
      categoryName,
      children: Array.isArray(childs)
        ? childs
            .map((ch) => convert(ch))
            .filter((n): n is CategoryNode => n !== null)
        : [],
    };
  }

  return list
    .map((c) => convert(c))
    .filter((n): n is CategoryNode => n !== null);
}

const POLICY_SCOPE_NONE = 0;
const POLICY_SCOPE_USER = 1;
const POLICY_SCOPE_MACHINE = 2;
const POLICY_SCOPE_BOTH = 3;

export function parsePolicyGroupScopeLabel(scopeStr: unknown): number {
  if (scopeStr === null || scopeStr === undefined) {
    return POLICY_SCOPE_NONE;
  }
  if (typeof scopeStr === "number" && Number.isFinite(scopeStr)) {
    const n = Math.trunc(scopeStr);
    if (n >= POLICY_SCOPE_NONE && n <= POLICY_SCOPE_BOTH) return n;
    return POLICY_SCOPE_NONE;
  }
  if (typeof scopeStr !== "string") {
    return POLICY_SCOPE_NONE;
  }
  const s = scopeStr.trim().toLowerCase();
  if (!s) return POLICY_SCOPE_NONE;
  if (s === "user" || s.endsWith("_user")) return POLICY_SCOPE_USER;
  if (
    s === "machine" ||
    s === "computer" ||
    s.endsWith("_machine")
  ) {
    return POLICY_SCOPE_MACHINE;
  }
  if (s === "both" || s.endsWith("_both")) return POLICY_SCOPE_BOTH;
  if (s === "none" || s.endsWith("_none")) return POLICY_SCOPE_NONE;
  const parsed = Number.parseInt(s, 10);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= POLICY_SCOPE_BOTH) {
    return parsed;
  }
  return POLICY_SCOPE_NONE;
}

function policyExplainToDescription(explainRaw: unknown): string | undefined {
  if (explainRaw === null || explainRaw === undefined) return undefined;
  if (typeof explainRaw !== "string") return undefined;
  const trimmed = explainRaw.trim();
  if (!trimmed) return undefined;
  const isLocKey =
    trimmed.endsWith("_Help") ||
    trimmed.endsWith("_Explain") ||
    trimmed.includes("_Help_") ||
    trimmed.includes("_Explain_");
  return isLocKey ? undefined : trimmed;
}

function trimNonEmpty(val: unknown): string | undefined {
  if (typeof val !== "string" || !val.trim()) return undefined;
  return val.trim();
}

function normalizePolicySummary(
  p: unknown,
  scopeFromGroup?: number,
): PolicyItem | null {
  if (!p || typeof p !== "object") return null;
  const item = p as {
    id?: number;
    name?: string;
    display_name?: string;
    displayName?: string;
    explain_text?: string;
    explainText?: string;
    scope?: number;
    hash?: string;
    policy_hash?: string;
    policyHash?: string;
    state?: boolean;
    supported_on_ref?: string;
    supportedOnRef?: string;
  };
  const name = str(item.name);
  const explainText = item.explain_text ?? item.explainText;
  const displayName = item.display_name ?? item.displayName ?? name;
  const description = policyExplainToDescription(explainText);
  let scope = POLICY_SCOPE_NONE;
  if (scopeFromGroup !== undefined) {
    scope = scopeFromGroup;
  } else if (item.scope !== undefined && item.scope !== null) {
    scope = num(item.scope, POLICY_SCOPE_NONE);
  }
  const rawHash = item.hash ?? item.policy_hash ?? item.policyHash;
  const hash = trimNonEmpty(rawHash);
  const state = typeof item.state === "boolean" ? item.state : undefined;
  const supportedOnRef = trimNonEmpty(
    item.supported_on_ref ?? item.supportedOnRef,
  );

  return {
    id: String(item.id ?? ""),
    name,
    displayName,
    description,
    scope,
    hash,
    state,
    supportedOnRef,
  };
}

export function normalizePoliciesList(
  response: unknown,
  scopeFromGroup?: number,
): PolicyItem[] {
  const list =
    (response as { policiesList?: unknown[] }).policiesList ??
    (response as { policies?: unknown[] }).policies ??
    [];

  const policies: PolicyItem[] = [];
  for (const p of list) {
    const row = normalizePolicySummary(p, scopeFromGroup);
    if (row) policies.push(row);
  }
  return policies;
}
