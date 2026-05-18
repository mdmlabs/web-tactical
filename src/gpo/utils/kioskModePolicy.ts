export type KioskModeStatus = "on" | "off";

export interface KioskModeInfo {
  status: KioskModeStatus;
  assigned: boolean;
  applied: boolean;
  displayName?: string;
  policyHash?: string;
}

const KIOSK_POLICY_NAME = "SetKioskModeApp";
const KIOSK_POLICY_ID = "12134";

function getSummary(record: Record<string, unknown>): Record<string, unknown> | null {
  const summary = record.summary ?? record.Summary;
  if (summary && typeof summary === "object") {
    return summary as Record<string, unknown>;
  }
  return null;
}

function getStringField(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val).trim();
    }
  }
  return "";
}

export function isKioskModeAssignment(
  assignment: Record<string, unknown>,
): boolean {
  const summary = getSummary(assignment);
  if (!summary) return false;

  const name = getStringField(summary, "name", "Name");
  if (name === KIOSK_POLICY_NAME) return true;

  const id = getStringField(summary, "id", "Id");
  if (id === KIOSK_POLICY_ID) return true;

  const displayName = getStringField(
    summary,
    "displayName",
    "display_name",
    "DisplayName",
  ).toLowerCase();
  return (
    displayName.includes("kiosk mode") ||
    displayName.includes("custom shell")
  );
}

export function getAssignmentOverrideString(
  assignment: Record<string, unknown>,
): string {
  const override = assignment.override ?? assignment.Override;
  if (override === undefined || override === null) return "";

  if (typeof override === "string") return override.trim();

  if (typeof override === "object") {
    const obj = override as Record<string, unknown>;
    return getStringField(obj, "stringValue", "string_value", "value");
  }

  return String(override).trim();
}

export function isKioskAssignmentApplied(
  assignment: Record<string, unknown>,
): boolean {
  const overrideValue = getAssignmentOverrideString(assignment);
  if (!overrideValue) return true;
  return overrideValue.toLowerCase() !== "notapplied";
}

export function resolveKioskModeFromAssignments(
  assignments: Array<Record<string, unknown>> | null | undefined,
): KioskModeInfo {
  const list = assignments ?? [];
  const kioskAssignment = list.find((a) => isKioskModeAssignment(a));

  if (!kioskAssignment) {
    return { status: "off", assigned: false, applied: false };
  }

  const applied = isKioskAssignmentApplied(kioskAssignment);
  const summary = getSummary(kioskAssignment);

  return {
    status: applied ? "on" : "off",
    assigned: true,
    applied,
    displayName: summary
      ? getStringField(
          summary,
          "displayName",
          "display_name",
          "name",
          "Name",
        )
      : undefined,
    policyHash: getStringField(
      kioskAssignment,
      "policyHash",
      "policy_hash",
    ),
  };
}
