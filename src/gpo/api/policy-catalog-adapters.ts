import type { CategoryNode, PolicyItem } from "../types/policy-catalog";

function str(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return "";
  return String(val);
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

export function normalizePoliciesList(response: unknown): PolicyItem[] {
  const list =
    (response as { policiesList?: unknown[] }).policiesList ??
    (response as { policies?: unknown[] }).policies ??
    [];

  const policies: PolicyItem[] = [];
  for (const p of list) {
    if (!p || typeof p !== "object") continue;
    const item = p as {
      id?: number;
      name?: string;
      display_name?: string;
      displayName?: string;
      explain_text?: string;
      explainText?: string;
      scope?: number;
      hash?: string;
      state?: boolean;
    };
    const name = str(item.name);
    const displayName = item.display_name ?? item.displayName ?? name;
    const explainText = item.explain_text ?? item.explainText;
    const isLocKey =
      explainText &&
      (String(explainText).endsWith("_Help") ||
        String(explainText).endsWith("_Explain") ||
        String(explainText).includes("_Help_") ||
        String(explainText).includes("_Explain_"));
    const description =
      explainText && String(explainText).trim() && !isLocKey
        ? String(explainText).trim()
        : undefined;
    const scope =
      item.scope !== undefined && item.scope !== null
        ? num(item.scope, POLICY_SCOPE_NONE)
        : POLICY_SCOPE_NONE;
    const hash =
      typeof item.hash === "string" && item.hash.trim()
        ? item.hash.trim()
        : undefined;
    const state = typeof item.state === "boolean" ? item.state : undefined;

    policies.push({
      id: String(item.id ?? ""),
      name,
      displayName,
      description,
      scope,
      hash,
      state,
    });
  }
  return policies;
}
