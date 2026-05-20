export const POLICY_STATUS_DRAFT = 0;
export const POLICY_STATUS_APPROVE = 1;
export const POLICY_STATUS_REJECTED = 2;
export const POLICY_STATUS_OBSOLETE = 3;

export const POLICY_STATUS_OPTIONS = [
  { value: POLICY_STATUS_DRAFT, label: "Draft" },
  { value: POLICY_STATUS_APPROVE, label: "Approve" },
  { value: POLICY_STATUS_REJECTED, label: "Rejected" },
  { value: POLICY_STATUS_OBSOLETE, label: "Obsolete" },
] as const;

const STATUS_LABEL_BY_VALUE: Record<number, string> = {
  [POLICY_STATUS_DRAFT]: "Draft",
  [POLICY_STATUS_APPROVE]: "Approve",
  [POLICY_STATUS_REJECTED]: "Rejected",
  [POLICY_STATUS_OBSOLETE]: "Obsolete",
};

const STATUS_COLOR_BY_VALUE: Record<number, string> = {
  [POLICY_STATUS_DRAFT]: "grey",
  [POLICY_STATUS_APPROVE]: "positive",
  [POLICY_STATUS_REJECTED]: "negative",
  [POLICY_STATUS_OBSOLETE]: "warning",
};

export function parsePolicyStatus(val: unknown): number | undefined {
  if (val === null || val === undefined) return undefined;
  if (typeof val === "number" && Number.isFinite(val)) {
    const n = Math.trunc(val);
    if (n in STATUS_LABEL_BY_VALUE) return n;
    return undefined;
  }
  if (typeof val !== "string") return undefined;
  const s = val.trim();
  if (!s) return undefined;
  const asNum = Number.parseInt(s, 10);
  if (Number.isFinite(asNum) && asNum in STATUS_LABEL_BY_VALUE) return asNum;
  const key = s.replace(/^POLICY_STATUS_/i, "").toLowerCase();
  const byName: Record<string, number> = {
    draft: POLICY_STATUS_DRAFT,
    approve: POLICY_STATUS_APPROVE,
    approved: POLICY_STATUS_APPROVE,
    rejected: POLICY_STATUS_REJECTED,
    obsolete: POLICY_STATUS_OBSOLETE,
  };
  return byName[key];
}

export function policyStatusLabel(status: number | undefined): string {
  if (status === undefined) return "—";
  return STATUS_LABEL_BY_VALUE[status] ?? String(status);
}

export function policyStatusColor(status: number | undefined): string {
  if (status === undefined) return "grey";
  return STATUS_COLOR_BY_VALUE[status] ?? "grey";
}
