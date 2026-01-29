import * as grpcWeb from "grpc-web";
import {
  AgentServiceClient,
  CollectionsControlServiceClient,
  UserServiceClient,
  AdmxServiceClient,
  PolicyCatalogServiceClient,
  PolicyAssignmentServiceClient,
  PolicyStateServiceClient,
} from "@/generated/OperatorServiceClientPb";

import operator_pb from "@/generated/operator_pb";

import type * as operator_pb_types from "@/generated/operator_pb";
import { useAuthStore } from "@/stores/auth";

if (!operator_pb) {
  throw new Error("operator_pb module failed to load");
}

// interface WindowWithEnv extends Window {
//   _env_?: {
//     GRPC_URL?: string;
//   };
// }

interface WindowWithEnv {
  _env_?: {
    GRPC_URL?: string;
  };
}

function getGrpcUrl(): string {
  if (import.meta.env.DEV) {
    return "/api/grpc";
  }

  const viteEnv = import.meta.env.VITE_GRPC_URL;
  const windowEnv = (globalThis.window as WindowWithEnv)?._env_?.GRPC_URL;
  const fallback = "https://mesh-stage.rmadm.org:5000";

  const grpcUrl = viteEnv || windowEnv || fallback;

  return grpcUrl.replace(/\/$/, "");
}

export function createGrpcMetadata(): grpcWeb.Metadata {
  const authStore = useAuthStore();
  const metadata: grpcWeb.Metadata = {};

  if (authStore.token) {
    metadata["authorization"] = `Bearer ${authStore.token}`;
  }

  return metadata;
}

function createClient<
  T extends new (
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: unknown },
  ) => InstanceType<T>,
>(ClientClass: T, options?: { [index: string]: unknown }): InstanceType<T> {
  const url = getGrpcUrl();
  const clientOptions = {
    ...options,
  };

  return new ClientClass(url, null, clientOptions);
}

const agentServiceClient = createClient(AgentServiceClient);
const collectionsControlServiceClient = createClient(
  CollectionsControlServiceClient,
);
const userServiceClient = createClient(UserServiceClient);
const admxServiceClient = createClient(AdmxServiceClient);
const policyCatalogServiceClient = createClient(PolicyCatalogServiceClient);
const policyAssignmentServiceClient = createClient(
  PolicyAssignmentServiceClient,
);
const policyStateServiceClient = createClient(PolicyStateServiceClient);

export const policyCatalogClient = {
  async listPoliciesGroupedByScope(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.ListPoliciesGroupedByScopeResponse.AsObject> {
    if (!operator_pb.ListPoliciesGroupedByScopeRequest) {
      throw new Error(
        "ListPoliciesGroupedByScopeRequest class is not available in operator_pb",
      );
    }
    const request = new operator_pb.ListPoliciesGroupedByScopeRequest();
    request.setLangCode(langCode);

    const response =
      await policyCatalogServiceClient.listPoliciesGroupedByScope(
        request,
        createGrpcMetadata(),
      );

    return response.toObject();
  },

  async getCategoryTree(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetCategoryTreeResponse.AsObject> {
    const request = new operator_pb.GetCategoryTreeRequest();
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getCategoryTree(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async listPolicies(
    admxFileHash: string,
  ): Promise<operator_pb_types.ListPoliciesResponse.AsObject> {
    const request = new operator_pb.ListPoliciesRequest();
    request.setAdmxFileHash(admxFileHash);

    const response = await policyCatalogServiceClient.listPolicies(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPolicy(
    policyHash: string,
  ): Promise<operator_pb_types.PolicyDescriptor.AsObject> {
    const request = new operator_pb.GetPolicyRequest();
    request.setPolicyHash(policyHash);

    const response = await policyCatalogServiceClient.getPolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPolicyDetails(
    policyId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.PolicyDetails.AsObject> {
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode(langCode);

    try {
      const response = await policyCatalogServiceClient.getPolicyDetails(
        request,
        createGrpcMetadata(),
      );

      return response.toObject();
    } catch (error) {
      throw error;
    }
  },

  async getPoliciesByCategory(
    category: string,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesByCategoryResponse.AsObject> {
    const request = new operator_pb.GetPoliciesByCategoryRequest();
    request.setCategory(category);
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getPoliciesByCategory(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPoliciesByAdmx(
    admxFile: string,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesByAdmxResponse.AsObject> {
    const request = new operator_pb.GetPoliciesByAdmxRequest();
    request.setAdmxFile(admxFile);
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getPoliciesByAdmx(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export const agentServiceClientWrapper = {
  async listAgents(): Promise<operator_pb_types.ListAgentsResponse.AsObject> {
    if (!operator_pb.ListAgentsRequest) {
      throw new Error(
        "ListAgentsRequest class is not available in operator_pb",
      );
    }
    const request = new operator_pb.ListAgentsRequest();

    const response = await agentServiceClient.listAgents(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getAgent(
    agentId: string,
  ): Promise<operator_pb_types.AgentDetails.AsObject> {
    const request = new operator_pb.GetAgentRequest();
    request.setAgentId(agentId);

    const response = await agentServiceClient.getAgent(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export function createGlobalTarget(): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const globalTarget = new operator_pb.GlobalTarget();
  target.setGlobal(globalTarget);
  return target;
}

export function createAgentTarget(agentId: string): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const agentTarget = new operator_pb.AgentTarget();
  agentTarget.setAgentId(agentId);
  target.setAgent(agentTarget);
  return target;
}

export function createUserTarget(
  agentId: string,
  userSid: string,
): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const userTarget = new operator_pb.UserTarget();
  userTarget.setAgentId(agentId);
  userTarget.setUserSid(userSid);
  target.setUser(userTarget);
  return target;
}

function createPolicyElementItemSelection(
  itemId: string,
  itemValue: unknown,
): operator_pb.PolicyElementItemSelection | null {
  if (itemValue === null || itemValue === undefined) {
    return null;
  }

  const itemSelection = new operator_pb.PolicyElementItemSelection();
  itemSelection.setIdName(itemId);

  if (typeof itemValue === "object" && !Array.isArray(itemValue)) {
    const childs: operator_pb.PolicyElementItemSelection[] = [];

    for (const [childId, childValue] of Object.entries(
      itemValue as Record<string, unknown>,
    )) {
      const childSelection = createPolicyElementItemSelection(
        childId,
        childValue,
      );
      if (childSelection) {
        childs.push(childSelection);
      }
    }

    if (childs.length > 0) {
      itemSelection.setChildsList(childs);
    }

    itemSelection.setValue("");
  } else {
    let stringValue: string;
    if (typeof itemValue === "boolean") {
      stringValue = itemValue ? "1" : "0";
    } else if (typeof itemValue === "number") {
      stringValue = String(itemValue);
    } else if (Array.isArray(itemValue)) {
      stringValue = itemValue
        .map((item) => String(item))
        .filter((item) => item !== "")
        .join(",");
    } else {
      stringValue = String(itemValue);
    }
    itemSelection.setValue(stringValue);
  }

  return itemSelection;
}

export function createPolicySelection(
  settings: Record<string, unknown>,
): operator_pb.PolicySelection {
  const selection = new operator_pb.PolicySelection();
  const elements: operator_pb.PolicyElementSelection[] = [];
  const listKeys: string[] = [];
  const settingsKeys = Object.keys(settings);
  if (settingsKeys.length === 0) {
    selection.setValue("1");
    return selection;
  }

  for (const [elementId, value] of Object.entries(settings)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      const arrayKeys = value
        .map((item) => {
          if (item === null || item === undefined) return null;
          return String(item);
        })
        .filter((key): key is string => key !== null);
      listKeys.push(...arrayKeys);
      continue;
    }

    const elementSelection = new operator_pb.PolicyElementSelection();
    elementSelection.setIdName(elementId);

    if (typeof value === "object" && !Array.isArray(value)) {
      const childs: operator_pb.PolicyElementItemSelection[] = [];

      for (const [itemId, itemValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        const itemSelection = createPolicyElementItemSelection(
          itemId,
          itemValue,
        );
        if (itemSelection) {
          childs.push(itemSelection);
        }
      }

      if (childs.length > 0) {
        elementSelection.setChildsList(childs);
      }

      elementSelection.setValue("");
    } else {
      let stringValue: string;
      if (typeof value === "boolean") {
        stringValue = value ? "1" : "0";
      } else if (typeof value === "number") {
        stringValue = String(value);
      } else {
        stringValue = String(value);
      }
      elementSelection.setValue(stringValue);
    }

    elements.push(elementSelection);
  }

  if (elements.length > 0) {
    selection.setElementsList(elements);
  }
  if (listKeys.length > 0) {
    selection.setListKeysList(listKeys);
  }

  if (
    elements.length === 0 &&
    listKeys.length === 0 &&
    settingsKeys.length > 0
  ) {
    selection.setValue("1");
  }

  return selection;
}

export const policyAssignmentClient = {
  async assignPolicy(
    policyHash: string,
    targetType: "global" | "agent" | "user",
    targetParams: { agentId?: string; userSid?: string } = {},
    selection?: Record<string, unknown> | operator_pb_types.PolicySelection,
  ): Promise<operator_pb_types.AssignPolicyResponse.AsObject> {
    const request = new operator_pb.AssignPolicyRequest();
    request.setPolicyHash(policyHash);

    let target: operator_pb.PolicyTarget;
    switch (targetType) {
      case "global":
        target = createGlobalTarget();
        break;
      case "agent":
        if (!targetParams.agentId) {
          throw new Error("agentId обязателен для типа 'agent'");
        }
        target = createAgentTarget(targetParams.agentId);
        break;
      case "user":
        if (!targetParams.agentId || !targetParams.userSid) {
          throw new Error("agentId и userSid обязательны для типа 'user'");
        }
        target = createUserTarget(targetParams.agentId, targetParams.userSid);
        break;
      default:
        throw new Error(`Неизвестный тип цели: ${targetType}`);
    }

    request.setTarget(target);

    if (selection) {
      let policySelection: operator_pb.PolicySelection;
      if (selection instanceof operator_pb.PolicySelection) {
        policySelection = selection;
      } else {
        policySelection = createPolicySelection(selection);
      }
      request.setSelection(policySelection);
    }

    const response = await policyAssignmentServiceClient.assignPolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async removePolicy(
    policyHash: string,
    targetType: "global" | "agent" | "user",
    targetParams: { agentId?: string; userSid?: string } = {},
  ): Promise<operator_pb_types.RemovePolicyResponse.AsObject> {
    const request = new operator_pb.RemovePolicyRequest();
    request.setPolicyHash(policyHash);

    let target: operator_pb.PolicyTarget;
    switch (targetType) {
      case "global":
        target = createGlobalTarget();
        break;
      case "agent":
        if (!targetParams.agentId) {
          throw new Error("agentId обязателен для типа 'agent'");
        }
        target = createAgentTarget(targetParams.agentId);
        break;
      case "user":
        if (!targetParams.agentId || !targetParams.userSid) {
          throw new Error("agentId и userSid обязательны для типа 'user'");
        }
        target = createUserTarget(targetParams.agentId, targetParams.userSid);
        break;
      default:
        throw new Error(`Неизвестный тип цели: ${targetType}`);
    }

    request.setTarget(target);

    const response = await policyAssignmentServiceClient.removePolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async assignPolicyCollection(
    collectionId: number,
    targetType: "global" | "agent" | "user",
    targetParams: { agentId?: string; userSid?: string } = {},
    selection?: Record<string, unknown> | operator_pb_types.PolicySelection,
  ): Promise<operator_pb_types.AssignPolicyCollectionResponse.AsObject> {
    const request = new operator_pb.AssignPolicyCollectionRequest();

    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }
    request.setCollectionId(collectionIdNum);

    let target: operator_pb.PolicyTarget;
    switch (targetType) {
      case "global":
        target = createGlobalTarget();
        break;
      case "agent":
        if (!targetParams.agentId) {
          throw new Error("agentId обязателен для типа 'agent'");
        }
        target = createAgentTarget(targetParams.agentId);
        break;
      case "user":
        if (!targetParams.agentId || !targetParams.userSid) {
          throw new Error("agentId и userSid обязательны для типа 'user'");
        }
        target = createUserTarget(targetParams.agentId, targetParams.userSid);
        break;
      default:
        throw new Error(`Неизвестный тип цели: ${targetType}`);
    }

    request.setTarget(target);

    if (selection) {
      let policySelection: operator_pb.PolicySelection;
      if (selection instanceof operator_pb.PolicySelection) {
        policySelection = selection;
      } else {
        policySelection = createPolicySelection(selection);
      }
      request.setSelection(policySelection);
    }

    const response = await policyAssignmentServiceClient.assignPolicyCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async removePolicyCollection(
    collectionId: number,
    targetType: "global" | "agent" | "user",
    targetParams: { agentId?: string; userSid?: string } = {},
  ): Promise<operator_pb_types.RemovePolicyCollectionResponse.AsObject> {
    const request = new operator_pb.RemovePolicyCollectionRequest();

    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }
    request.setCollectionId(collectionIdNum);

    let target: operator_pb.PolicyTarget;
    switch (targetType) {
      case "global":
        target = createGlobalTarget();
        break;
      case "agent":
        if (!targetParams.agentId) {
          throw new Error("agentId обязателен для типа 'agent'");
        }
        target = createAgentTarget(targetParams.agentId);
        break;
      case "user":
        if (!targetParams.agentId || !targetParams.userSid) {
          throw new Error("agentId и userSid обязательны для типа 'user'");
        }
        target = createUserTarget(targetParams.agentId, targetParams.userSid);
        break;
      default:
        throw new Error(`Неизвестный тип цели: ${targetType}`);
    }

    request.setTarget(target);

    const response = await policyAssignmentServiceClient.removePolicyCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export const policyStateClient = {
  async getEffectivePolicies(
    target: operator_pb_types.PolicyTarget,
  ): Promise<operator_pb_types.GetEffectivePoliciesResponse.AsObject> {
    const request = new operator_pb.GetEffectivePoliciesRequest();
    request.setTarget(target);

    const response = await policyStateServiceClient.getEffectivePolicies(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getAssignments(
    target: operator_pb_types.PolicyTarget,
  ): Promise<operator_pb_types.GetAssignmentsResponse.AsObject> {
    const request = new operator_pb.GetAssignmentsRequest();
    request.setTarget(target);

    const response = await policyStateServiceClient.getAssignments(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
  maxFileSize?: number;
}

export class AdmxUploadError extends Error {
  constructor(
    message: string,
    public code:
      | "FILE_TOO_LARGE"
      | "INVALID_FORMAT"
      | "UPLOAD_FAILED"
      | "CANCELLED",
  ) {
    super(message);
    this.name = "AdmxUploadError";
  }
}

export const admxServiceClientWrapper = {
  async importAdmxZip(
    zipFile: File | Uint8Array | ArrayBuffer,
    options: UploadOptions = {},
  ): Promise<operator_pb_types.ImportAdmxResponse.AsObject> {
    const { onProgress, signal, maxFileSize = 50 * 1024 * 1024 } = options;

    if (zipFile instanceof File) {
      if (zipFile.size > maxFileSize) {
        throw new AdmxUploadError(
          `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`,
          "FILE_TOO_LARGE",
        );
      }

      if (
        zipFile.type &&
        zipFile.type !== "application/zip" &&
        zipFile.type !== "application/x-zip-compressed"
      ) {
        throw new AdmxUploadError(
          "Invalid file type. Expected ZIP archive",
          "INVALID_FORMAT",
        );
      }
    }
    if (signal?.aborted) {
      throw new AdmxUploadError("Upload cancelled", "CANCELLED");
    }

    let zipContent: Uint8Array;
    if (zipFile instanceof File) {
      const arrayBuffer = await zipFile.arrayBuffer();
      zipContent = new Uint8Array(arrayBuffer);
    } else if (zipFile instanceof ArrayBuffer) {
      zipContent = new Uint8Array(zipFile);
    } else {
      zipContent = zipFile;
    }

    const totalSize = zipContent.length;
    const request = new operator_pb.ImportAdmxZipRequest();
    request.setZipContent(zipContent);

    onProgress?.({ loaded: totalSize * 0.5, total: totalSize, percentage: 50 });
    const abortListener = () => {
      throw new AdmxUploadError("Upload cancelled by user", "CANCELLED");
    };
    signal?.addEventListener("abort", abortListener);

    try {
      const response = await admxServiceClient.importAdmxZip(
        request,
        createGrpcMetadata(),
      );

      onProgress?.({
        loaded: totalSize,
        total: totalSize,
        percentage: 100,
      });
      return response.toObject();
    } catch (error) {
      if (signal?.aborted) {
        throw new AdmxUploadError("Upload cancelled", "CANCELLED");
      }
      throw new AdmxUploadError(
        error instanceof Error ? error.message : "Upload failed",
        "UPLOAD_FAILED",
      );
    } finally {
      signal?.removeEventListener("abort", abortListener);
    }
  },

  async listAdmxFiles(): Promise<operator_pb_types.ListAdmxFilesResponse.AsObject> {
    const request = new operator_pb.ListAdmxFilesRequest();

    const response = await admxServiceClient.listAdmxFiles(
      request,
      createGrpcMetadata(),
    );
    return response.toObject();
  },
};

export const collectionsClient = {
  async getAllCollections(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetAllCollectionsResponse.AsObject> {
    const request = new operator_pb.GetAllCollectionsRequest();
    request.setLangCode(langCode);

    const response = await collectionsControlServiceClient.getAllCollections(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getCollectionById(
    collectionId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.CollectionDetailsResponse.AsObject> {
    const request = new operator_pb.GetCollectionByIdRequest();
    request.setCollectionId(collectionId);
    request.setLangCode(langCode);

    const response = await collectionsControlServiceClient.getCollectionById(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async createCollection(
    name: string,
    explainText: string = "",
    translations: Array<{
      langCode: string;
      name: string;
      explainText: string;
    }> = [],
  ): Promise<operator_pb_types.CollectionDetailsResponse.AsObject> {
    const request = new operator_pb.CreateCollectionRequest();
    request.setName(name);
    request.setExplainText(explainText);

    const translationsList = translations.map((trans) => {
      const translation = new operator_pb.CollectionTranslation();
      translation.setLangCode(trans.langCode);
      translation.setName(trans.name);
      translation.setExplainText(trans.explainText);
      return translation;
    });

    request.setTranslationsList(translationsList);

    const response = await collectionsControlServiceClient.createCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async createCollectionsPolicies(
    collectionId: number,
    policyHashes: string[],
  ): Promise<operator_pb_types.CreateCollectionsPoliciesResponse.AsObject> {
    if (!collectionId || collectionId <= 0) {
      throw new Error(
        "Invalid collection ID: collection ID must be a positive number",
      );
    }

    if (!Array.isArray(policyHashes) || policyHashes.length === 0) {
      throw new Error(
        "Invalid policy hashes: policy hashes must be a non-empty array",
      );
    }

    const invalidHashes = policyHashes.filter(
      (h) => typeof h !== "string" || !h.trim(),
    );
    if (invalidHashes.length > 0) {
      throw new Error(
        `Invalid policy hashes: all hashes must be non-empty strings. Invalid: ${invalidHashes.join(
          ", ",
        )}`,
      );
    }

    const request = new operator_pb.CreateCollectionsPoliciesRequest();
    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }
    request.setCollectionId(collectionIdNum);

    const setValue = request.getCollectionId();
    if (setValue !== collectionIdNum) {
      throw new Error(
        `Collection ID mismatch: set ${collectionIdNum}, got ${setValue}`,
      );
    }

    const validPolicyHashes = policyHashes
      .map((h) => (typeof h === "string" ? h.trim() : String(h)))
      .filter((h) => h.length > 0);

    if (validPolicyHashes.length === 0) {
      throw new Error("No valid policy hashes after filtering");
    }

    request.clearPolicyHashesList?.();

    type CreateCollectionsPoliciesRequestLike = {
      addPolicyHashes?: (h: string) => void;
      addPolicyHash?: (h: string) => void;
      setPolicyHashesList?: (list: string[]) => void;
      getPolicyHashesList?: () => string[];
      getPolicyHashList?: () => string[];
    };

    const reqLike = request as unknown as CreateCollectionsPoliciesRequestLike;

    for (const hash of validPolicyHashes) {
      if (typeof reqLike.addPolicyHashes === "function") {
        reqLike.addPolicyHashes(hash);
      } else if (typeof reqLike.addPolicyHash === "function") {
        reqLike.addPolicyHash(hash);
      } else {
        reqLike.setPolicyHashesList?.(validPolicyHashes);
        break;
      }
    }

    const checkHashes =
      (typeof reqLike.getPolicyHashesList === "function" &&
        reqLike.getPolicyHashesList()) ||
      (typeof reqLike.getPolicyHashList === "function" &&
        reqLike.getPolicyHashList()) ||
      reqLike.getPolicyHashesList?.();

    if (!checkHashes || checkHashes.length === 0) {
      throw new Error("Failed to set policy hashes in request");
    }

    if (checkHashes.length !== validPolicyHashes.length) {
      throw new Error(
        `Policy hashes count mismatch: expected ${validPolicyHashes.length}, got ${checkHashes.length}`,
      );
    }

    try {
      const response =
        await collectionsControlServiceClient.createCollectionsPolicies(
          request,
          createGrpcMetadata(),
        );

      return response.toObject();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Exception was thrown by handler")) {
          throw new Error(
            "Server error: Could not add policies to collection. " +
              `Collection ID: ${collectionIdNum}, ` +
              `Policy hashes: ${validPolicyHashes.join(", ")}. ` +
              "The collection or policies may not exist, or policy hashes may be incorrect.",
          );
        }
      }
      throw error;
    }
  },

  async deleteCollection(
    collectionId: number,
  ): Promise<operator_pb_types.DeleteCollectionResponse.AsObject> {
    const request = new operator_pb.DeleteCollectionRequest();
    request.setCollectionId(collectionId);

    const response = await collectionsControlServiceClient.deleteCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPoliciesInCollection(
    collectionId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesInCollectionResponse.AsObject> {
    const request = new operator_pb.GetPoliciesInCollectionRequest();
    request.setCollectionId(collectionId);
    request.setLangCode(langCode);

    const response =
      await collectionsControlServiceClient.getPoliciesInCollection(
        request,
        createGrpcMetadata(),
      );

    return response.toObject();
  },
};

export {
  agentServiceClient,
  collectionsControlServiceClient,
  userServiceClient,
  admxServiceClient,
  policyCatalogServiceClient,
  policyAssignmentServiceClient,
  policyStateServiceClient,
};

export { default as operator_pb } from "@/generated/operator_pb";
