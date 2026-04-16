import { ConnectivityPolicyServiceClient } from "@/generated/operator/Connectivity_policy_serviceServiceClientPb";
import {
  ConnectivityPolicy,
  ConnectivityTargetType,
  CreateConnectivityPolicyRequest,
  DeleteConnectivityPolicyRequest,
  GetConnectivityPolicyRequest,
  ListConnectivityPoliciesRequest,
  SetConnectivityPolicyEnabledRequest,
  UpdateConnectivityPolicyRequest,
} from "@/generated/operator/connectivity_policy_service_pb";
import { createGrpcMetadata, getGrpcUrl } from "@/gpo/api/grpc-client";

export type ConnectivityTargetKind =
  | "agent"
  | "agentCategory"
  | "user"
  | "userGroup";

export interface ConnectivityPolicyTarget {
  type: ConnectivityTargetKind;
  agentId?: string;
  categoryId?: number;
  userId?: string;
  userGroupId?: string;
}

export interface ConnectivityPolicyRecord extends ConnectivityPolicyTarget {
  id: number;
  intervalSeconds: number;
  graceSeconds: number;
  isEnabled: boolean;
  severity: number;
}

export interface ConnectivityPolicyListFilter {
  target?: Partial<ConnectivityPolicyTarget>;
  enabledOnly?: boolean;
}

export interface ConnectivityPolicyInput extends ConnectivityPolicyTarget {
  intervalSeconds: number;
  graceSeconds: number;
  isEnabled: boolean;
  severity: number;
}

const connectivityPolicyServiceClient = new ConnectivityPolicyServiceClient(
  getGrpcUrl(),
  null,
  {},
);

function normalizeTargetType(raw: unknown): ConnectivityTargetKind | null {
  if (raw === ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_AGENT) {
    return "agent";
  }
  if (raw === ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_AGENT_CATEGORY) {
    return "agentCategory";
  }
  if (raw === ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_USER) {
    return "user";
  }
  if (raw === ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_USER_GROUP) {
    return "userGroup";
  }

  const normalized =
    typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
  const upperCased = normalized.trim().toUpperCase();
  if (!upperCased) return null;
  if (upperCased.includes("AGENT_CATEGORY")) return "agentCategory";
  if (upperCased.includes("USER_GROUP")) return "userGroup";
  if (upperCased.endsWith("AGENT")) return "agent";
  if (upperCased.endsWith("USER")) return "user";
  return null;
}

function toTargetEnum(type: ConnectivityTargetKind): ConnectivityTargetType {
  switch (type) {
    case "agent":
      return ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_AGENT;
    case "agentCategory":
      return ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_AGENT_CATEGORY;
    case "user":
      return ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_USER;
    case "userGroup":
      return ConnectivityTargetType.CONNECTIVITY_TARGET_TYPE_USER_GROUP;
  }
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.trunc(parsed);
}

function toRequiredUInt(value: unknown, fieldName: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative number`);
  }
  return Math.trunc(parsed);
}

function extractString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return "";
}

function applyTarget<
  T extends {
    setTargetType?: (value: ConnectivityTargetType) => unknown;
    setAgentId?: (value: string) => unknown;
    setAgentCategoryId?: (value: number) => unknown;
    setUserId?: (value: string) => unknown;
    setUserGroupId?: (value: string) => unknown;
  },
>(message: T, target: Partial<ConnectivityPolicyTarget>): void {
  const normalizedType = target.type;
  if (!normalizedType) return;

  message.setTargetType?.(toTargetEnum(normalizedType));

  if (normalizedType === "agent") {
    if (!target.agentId) throw new Error("agentId is required");
    message.setAgentId?.(target.agentId);
    return;
  }

  if (normalizedType === "agentCategory") {
    const categoryId = toOptionalNumber(target.categoryId);
    if (categoryId == null) throw new Error("categoryId is required");
    message.setAgentCategoryId?.(categoryId);
    return;
  }

  if (normalizedType === "user") {
    if (!target.userId) throw new Error("userId is required");
    message.setUserId?.(target.userId);
    return;
  }

  if (!target.userGroupId) throw new Error("userGroupId is required");
  message.setUserGroupId?.(target.userGroupId);
}

function buildPolicyMessage(
  input: ConnectivityPolicyInput,
  id?: number,
): ConnectivityPolicy {
  const item = new ConnectivityPolicy();
  if (id != null) item.setId(id);
  applyTarget(item, input);
  item.setIntervalSeconds(
    toRequiredUInt(input.intervalSeconds, "intervalSeconds"),
  );
  item.setGraceSeconds(toRequiredUInt(input.graceSeconds, "graceSeconds"));
  item.setIsEnabled(Boolean(input.isEnabled));
  item.setSeverity(toRequiredUInt(input.severity, "severity"));
  return item;
}

function normalizePolicy(
  raw: Record<string, unknown>,
): ConnectivityPolicyRecord {
  const targetType = normalizeTargetType(raw.targetType ?? raw.target_type);
  if (!targetType) {
    throw new Error("Unknown connectivity target type");
  }

  return {
    id: toOptionalNumber(raw.id) ?? 0,
    type: targetType,
    agentId: extractString(raw, "agentId", "agent_id") || undefined,
    categoryId:
      toOptionalNumber(raw.agentCategoryId ?? raw.agent_category_id) ??
      undefined,
    userId: extractString(raw, "userId", "user_id") || undefined,
    userGroupId:
      extractString(raw, "userGroupId", "user_group_id") || undefined,
    intervalSeconds:
      toOptionalNumber(raw.intervalSeconds ?? raw.interval_seconds) ?? 0,
    graceSeconds: toOptionalNumber(raw.graceSeconds ?? raw.grace_seconds) ?? 0,
    isEnabled: Boolean(raw.isEnabled ?? raw.is_enabled),
    severity: toOptionalNumber(raw.severity) ?? 0,
  };
}

export const connectivityPolicyClient = {
  ConnectivityTargetType,

  async getPolicy(id: number): Promise<ConnectivityPolicyRecord> {
    const request = new GetConnectivityPolicyRequest();
    request.setId(id);
    const response =
      await connectivityPolicyServiceClient.getConnectivityPolicy(
        request,
        createGrpcMetadata(),
      );
    return normalizePolicy(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async listPolicies(
    filter: ConnectivityPolicyListFilter = {},
  ): Promise<ConnectivityPolicyRecord[]> {
    const request = new ListConnectivityPoliciesRequest();
    if (filter.target?.type) {
      applyTarget(request, filter.target);
    }
    if (filter.enabledOnly != null) {
      request.setEnabledOnly(filter.enabledOnly);
    }

    const response =
      await connectivityPolicyServiceClient.listConnectivityPolicies(
        request,
        createGrpcMetadata(),
      );
    const responseObj = response.toObject() as unknown as {
      itemsList?: Array<Record<string, unknown>>;
      items?: Array<Record<string, unknown>>;
    };
    const items = responseObj.itemsList ?? responseObj.items ?? [];
    return items.map((item) => normalizePolicy(item));
  },

  async createPolicy(
    input: ConnectivityPolicyInput,
  ): Promise<ConnectivityPolicyRecord> {
    const request = new CreateConnectivityPolicyRequest();
    request.setItem(buildPolicyMessage(input));
    const response =
      await connectivityPolicyServiceClient.createConnectivityPolicy(
        request,
        createGrpcMetadata(),
      );
    return normalizePolicy(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async updatePolicy(
    id: number,
    input: ConnectivityPolicyInput,
  ): Promise<void> {
    const request = new UpdateConnectivityPolicyRequest();
    request.setItem(buildPolicyMessage(input, id));
    await connectivityPolicyServiceClient.updateConnectivityPolicy(
      request,
      createGrpcMetadata(),
    );
  },

  async deletePolicy(id: number): Promise<void> {
    const request = new DeleteConnectivityPolicyRequest();
    request.setId(id);
    await connectivityPolicyServiceClient.deleteConnectivityPolicy(
      request,
      createGrpcMetadata(),
    );
  },

  async setPolicyEnabled(id: number, isEnabled: boolean): Promise<void> {
    const request = new SetConnectivityPolicyEnabledRequest();
    request.setId(id);
    request.setIsEnabled(isEnabled);
    await connectivityPolicyServiceClient.setConnectivityPolicyEnabled(
      request,
      createGrpcMetadata(),
    );
  },
};
