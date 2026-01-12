import { ref } from "vue";
import {
  policyCatalogClient,
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
      console.log("[GPO] Загрузка политик через gRPC...");

      console.log("[GPO] Отправка запроса listPoliciesGroupedByScope...");
      const response = await policyCatalogClient.listPoliciesGroupedByScope(
        langCode,
      );

      console.log("[GPO] Получен ответ:", response);

      const responseObj = response as { groupsList?: unknown[]; groups?: unknown[] };

      console.log("[GPO] Обработанный объект ответа:", responseObj);

      // toObject() возвращает camelCase: groupsList вместо groups
      const groupsList = responseObj.groupsList || responseObj.groups || [];

      policies.value = adaptPoliciesFromGroups({
        groups: groupsList,
      });

      console.log(`[GPO] ✅ Загружено политик: ${policies.value.length}`);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function updatePolicy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _policyId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: UpdateGPOPolicyRequest,
  ): Promise<void> {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = null;

    try {
      // TODO: Реализовать обновление политики через gRPC
      // Пока что просто перезагружаем список
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
      console.log("[GPO] Загрузка дерева политик через gRPC...");

      console.log("[GPO] Отправка запроса getCategoryTree...");
      const response = await policyCatalogClient.getCategoryTree(langCode);

      console.log("[GPO] Получен ответ:", response);

      const responseObj = response as {
        langCode?: string;
        lang_code?: string;
        categoriesList?: unknown[];
        categories?: unknown[];
      };

      console.log("[GPO] Обработанный объект ответа:", responseObj);

      tree.value = adaptCategoryTreeToPolicyTree({
        lang_code: responseObj.langCode || responseObj.lang_code || "en-US",
        categories: responseObj.categoriesList || responseObj.categories || [],
      });

      console.log("[GPO] ✅ Дерево политик загружено успешно");
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
