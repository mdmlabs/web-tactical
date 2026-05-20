import type { UpdateGPOPolicyRequest } from "../types/gpo";
import { parsePolicyStatus } from "./policy-status";

export const POLICY_SCOPE_OPTIONS = [
  { value: 0, label: "None" },
  { value: 1, label: "User" },
  { value: 2, label: "Machine (Computer)" },
  { value: 3, label: "Both" },
] as const;

export interface PolicyEditFormData {
  hash: string;
  name: string;
  displayName: string;
  explainText: string;
  scope: number;
  registryKey: string;
  valueName: string;
  enabledValue: string;
  disabledValue: string;
  supportedOnRef: string;
  parentCategoryRef: string;
  presentationRef: string;
  clientExtension: string;
  policyStatus: number;
}

function str(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" && Number.isFinite(val)) return `${val}`;
  return String(val);
}

function scopeNum(val: unknown, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function unwrapStringValue(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const v = (val as { value?: string }).value;
    return typeof v === "string" ? v : "";
  }
  return "";
}


export function descriptorToEditForm(
  descriptor: Record<string, unknown>,
  hash: string,
  overrides?: Partial<PolicyEditFormData>,
): PolicyEditFormData {
  const name = str(descriptor.name ?? descriptor.policyName);
  const explainText = str(
    descriptor.explain_text ?? descriptor.explainText ?? "",
  );
  const policyStatus =
    parsePolicyStatus(
      descriptor.policy_status ?? descriptor.policyStatus,
    ) ?? 0;

  return {
    hash,
    name,
    displayName: str(overrides?.displayName ?? descriptor.display_name ?? descriptor.displayName ?? name),
    explainText: overrides?.explainText ?? explainText,
    scope: scopeNum(descriptor.scope, overrides?.scope ?? 0),
    registryKey: str(descriptor.registry_key ?? descriptor.registryKey),
    valueName: str(descriptor.value_name ?? descriptor.valueName),
    enabledValue: str(descriptor.enabled_value ?? descriptor.enabledValue),
    disabledValue: str(descriptor.disabled_value ?? descriptor.disabledValue),
    supportedOnRef: str(
      descriptor.supported_on_ref ?? descriptor.supportedOnRef,
    ),
    parentCategoryRef: str(
      descriptor.parent_category ??
        descriptor.parent_category_ref ??
        descriptor.parentCategoryRef,
    ),
    presentationRef: str(
      descriptor.presentation_ref ?? descriptor.presentationRef,
    ),
    clientExtension: str(
      overrides?.clientExtension ??
        descriptor.client_extension ??
        descriptor.clientExtension,
    ),
    policyStatus: overrides?.policyStatus ?? policyStatus,
  };
}


export function mergeDetailsIntoEditForm(
  form: PolicyEditFormData,
  details: Record<string, unknown>,
): PolicyEditFormData {
  const policy = details.policy as Record<string, unknown> | undefined;
  if (!policy) return form;

  const displayName = str(
    policy.display_name ?? policy.displayName ?? form.displayName,
  );
  const explainFromDetails = str(
    policy.explain_text ?? policy.explainText,
  );

  return {
    ...form,
    hash: str(policy.hash ?? policy.policy_hash ?? form.hash) || form.hash,
    name: str(policy.name) || form.name,
    displayName: displayName || form.displayName,
    explainText: explainFromDetails || form.explainText,
    scope: scopeNum(policy.scope, form.scope),
    policyStatus:
      parsePolicyStatus(policy.policy_status ?? policy.policyStatus) ??
      form.policyStatus,
    clientExtension:
      unwrapStringValue(policy.client_extension ?? policy.clientExtension) ||
      form.clientExtension,
    supportedOnRef:
      str(policy.supported_on_ref ?? policy.supportedOnRef) ||
      form.supportedOnRef,
    parentCategoryRef:
      str(policy.parent_category_ref ?? policy.parentCategoryRef) ||
      form.parentCategoryRef,
  };
}

export function editFormToUpdateRequest(
  form: PolicyEditFormData,
): UpdateGPOPolicyRequest {
  return {
    hash: form.hash,
    name: form.name,
    displayName: form.displayName,
    explainText: form.explainText,
    scope: form.scope,
    registryKey: form.registryKey,
    valueName: form.valueName,
    enabledValue: form.enabledValue,
    disabledValue: form.disabledValue,
    supportedOnRef: form.supportedOnRef,
    parentCategoryRef: form.parentCategoryRef,
    presentationRef: form.presentationRef,
    clientExtension: form.clientExtension,
    policyStatus: form.policyStatus,
  };
}
