import { ref } from "vue";
import {
  policyCatalogClient,
  type UpdatePoliciesByHashParams,
} from "./grpc-client";
import type {
  GPOPolicy,
  GPOPolicyTree,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import {
  adaptPoliciesFromGroups,
  adaptCategoryTreeToPolicyTree,
} from "./grpc-adapters";

function extractHashFromPolicyDetails(response: unknown): string | null {
  const policy = (response as { policy?: Record<string, unknown> })?.policy;
  if (!policy || typeof policy !== "object") return null;
  const hash = policy.hash ?? policy.policy_hash ?? policy.policyHash;
  return typeof hash === "string" && hash.trim() ? hash.trim() : null;
}

type UpdatePoliciesByHashOptionalField = Exclude<
  keyof UpdatePoliciesByHashParams,
  "hash"
>;

function pickDefinedOptionalFields(
  fields: Partial<
    Pick<UpdatePoliciesByHashParams, UpdatePoliciesByHashOptionalField>
  >,
): Partial<
  Pick<UpdatePoliciesByHashParams, UpdatePoliciesByHashOptionalField>
> {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as Partial<
    Pick<UpdatePoliciesByHashParams, UpdatePoliciesByHashOptionalField>
  >;
}

function buildUpdatePoliciesByHashParams(
  hash: string,
  data: UpdateGPOPolicyRequest,
): UpdatePoliciesByHashParams {
  const optionalFields: Partial<
    Pick<UpdatePoliciesByHashParams, UpdatePoliciesByHashOptionalField>
  > = {
    name: data.name,
    displayName: data.displayName,
    explainText: data.explainText ?? data.description,
    scope: data.scope,
    registryKey: data.registryKey,
    valueName: data.valueName,
    enabledValue: data.enabledValue,
    disabledValue: data.disabledValue,
    supportedOnRef: data.supportedOnRef,
    parentCategoryRef: data.parentCategoryRef,
    presentationRef: data.presentationRef,
    clientExtension: data.clientExtension,
  };

  return { hash, ...pickDefinedOptionalFields(optionalFields) };
}

async function resolvePolicyHash(
  policyId: string,
  inlineHash?: string,
): Promise<string> {
  if (inlineHash?.trim()) return inlineHash.trim();
  const idNum = Number.parseInt(policyId, 10);
  if (Number.isNaN(idNum)) {
    throw new Error("Invalid policy id");
  }
  const details = await policyCatalogClient.getPolicyDetails(idNum, "en-US");
  const hash = extractHashFromPolicyDetails(details);
  if (!hash) {
    throw new Error("Policy hash not found");
  }
  return hash;
}

export function useGPOPolicies() {
  const policies = ref<GPOPolicy[]>([]);
  const isLoading = ref(false);
  const isError = ref(false);
  const errorMessage = ref<string | null>(null);

  async function fetchPolicies(langCode = "en-US") {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      const response =
        await policyCatalogClient.listPoliciesGroupedByScope(langCode);

      const responseObj = response as {
        groupsList?: unknown[];
        groups?: unknown[];
      };

      const groupsList = responseObj.groupsList || responseObj.groups || [];

      policies.value = adaptPoliciesFromGroups({
        groups: groupsList,
      });
    } catch (error) {
      console.error("[GPO] Ошибка загрузки политик:", error);
      const errorDetails =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null
            ? JSON.stringify(error)
            : String(error);
      isError.value = true;
      errorMessage.value = `Не удалось загрузить политики: ${errorDetails}`;
    } finally {
      isLoading.value = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function createPolicy(_data: CreateGPOPolicyRequest): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      // TODO: Реализовать создание политики через gRPC
      // Пока что просто перезагружаем список
      await fetchPolicies();
    } catch (error) {
      console.error("[GPO] Ошибка создания политики:", error);
      isError.value = true;
      errorMessage.value =
        error instanceof Error ? error.message : "Не удалось создать политику";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePolicy(
    policyId: string,
    data: UpdateGPOPolicyRequest,
  ): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      const hash = await resolvePolicyHash(policyId, data.hash);
      const params = buildUpdatePoliciesByHashParams(hash, data);
      const hasDescriptorFields = Object.keys(params).length > 1;
      const hasStatusUpdate = data.policyStatus !== undefined;

      if (!hasDescriptorFields && !hasStatusUpdate) {
        throw new Error("Nothing to update");
      }

      if (hasDescriptorFields) {
        const response = await policyCatalogClient.updatePoliciesByHash(params);
        if (!response.success) {
          throw new Error("Update rejected by server");
        }
      }

      if (hasStatusUpdate) {
        const statusResponse = await policyCatalogClient.updateStatusPolicies(
          hash,
          data.policyStatus!,
        );
        if (!statusResponse.success) {
          throw new Error("Status update rejected by server");
        }
      }

      await fetchPolicies();
    } catch (error) {
      console.error("[GPO] Ошибка обновления политики:", error);
      isError.value = true;
      errorMessage.value =
        error instanceof Error ? error.message : "Не удалось обновить политику";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePolicyStatus(
    policyId: string,
    policyStatus: number,
    hash?: string,
  ): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      const resolvedHash = await resolvePolicyHash(policyId, hash);
      const response = await policyCatalogClient.updateStatusPolicies(
        resolvedHash,
        policyStatus,
      );
      if (!response.success) {
        throw new Error("Status update rejected by server");
      }
      await fetchPolicies();
    } catch (error) {
      console.error("[GPO] Ошибка обновления статуса политики:", error);
      isError.value = true;
      errorMessage.value =
        error instanceof Error
          ? error.message
          : "Не удалось обновить статус политики";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function deletePolicy(_policyId: string): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      // TODO: Реализовать удаление политики через gRPC
      // Пока что просто перезагружаем список
      await fetchPolicies();
    } catch (error) {
      console.error("[GPO] Ошибка удаления политики:", error);
      isError.value = true;
      errorMessage.value =
        error instanceof Error ? error.message : "Не удалось удалить политику";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function clonePolicy(
    policyId: string,
    newName?: string,
  ): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      // TODO: Реализовать клонирование политики через gRPC
      void policyId;
      void newName;
      await fetchPolicies();
    } catch (error) {
      console.error("[GPO] Ошибка клонирования политики:", error);
      isError.value = true;
      errorMessage.value =
        error instanceof Error
          ? error.message
          : "Не удалось клонировать политику";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    policies,
    isLoading,
    isError,
    errorMessage,
    fetchPolicies,
    createPolicy,
    updatePolicy,
    updatePolicyStatus,
    deletePolicy,
    clonePolicy,
  };
}

export function useGPOPolicyTree() {
  const tree = ref<GPOPolicyTree | null>(null);
  const isLoading = ref(false);
  const isError = ref(false);
  const errorMessage = ref<string | null>(null);

  async function fetchPolicyTree(langCode = "en-US") {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      const response = await policyCatalogClient.getCategoryTree(langCode);
      const responseObj = response as {
        langCode?: string;
        lang_code?: string;
        categoriesList?: unknown[];
        categories?: unknown[];
      };

      tree.value = adaptCategoryTreeToPolicyTree({
        lang_code: responseObj.langCode || responseObj.lang_code || "en-US",
        categories: responseObj.categoriesList || responseObj.categories || [],
      });
    } catch (error) {
      console.error("[GPO] Ошибка загрузки дерева политик:", error);
      const errorDetails =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null
            ? JSON.stringify(error)
            : String(error);
      isError.value = true;
      errorMessage.value = `Не удалось загрузить дерево политик: ${errorDetails}`;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tree,
    isLoading,
    isError,
    errorMessage,
    fetchPolicyTree,
  };
}
