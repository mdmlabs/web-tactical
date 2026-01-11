import * as grpcWeb from "grpc-web";
import {
  AgentServiceClient,
  UserServiceClient,
  AdmxServiceClient,
  PolicyCatalogServiceClient,
  PolicyAssignmentServiceClient,
  PolicyStateServiceClient,
} from "@/generated/OperatorServiceClientPb";
// Импортируем protobuf модуль (ES6 модули)
// Используем default import для прямого доступа к namespace
import operator_pb from "@/generated/operator_pb";
// Импортируем типы для использования в типах возвращаемых значений
import type * as operator_pb_types from "@/generated/operator_pb";
import { useAuthStore } from "@/stores/auth";

// Проверка загрузки operator_pb перед использованием
if (!operator_pb) {
  throw new Error("operator_pb module failed to load");
}

// Отладочное логирование (можно удалить после проверки)
// Проверка dev режима (работает и в Node.js и в браузере)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const isDev =
  typeof process !== "undefined" && process.env?.NODE_ENV === "development";
const isDebug =
  isDev ||
  (globalThis.window !== undefined &&
    (globalThis.window as { __DEBUG__?: boolean }).__DEBUG__);
if (isDebug) {
  console.log("[grpc-client] operator_pb loaded:", {
    hasListAgentsRequest: operator_pb.ListAgentsRequest !== undefined,
    hasGetAgentRequest: operator_pb.GetAgentRequest !== undefined,
    hasListPoliciesGroupedByScopeRequest:
      operator_pb.ListPoliciesGroupedByScopeRequest !== undefined,
    namespaceKeys: Object.keys(operator_pb).slice(0, 10), // первые 10 ключей для проверки
    totalKeys: Object.keys(operator_pb).length,
  });
}

/**
 * Получает URL для gRPC-Web запросов
 */
function getGrpcUrl(): string {
  // Используем специальный URL для gRPC сервера
  // Можно переопределить через переменную окружения GRPC_URL
  if (process.env.NODE_ENV === "production") {
    // В продакшене можно использовать переменную окружения или конфигурацию
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grpcUrl =
      process.env.GRPC_URL || (globalThis.window as any)?._env_?.GRPC_URL;
    if (grpcUrl) {
      return grpcUrl.replace(/\/$/, "");
    }
  }

  // В режиме разработки используем указанный gRPC сервер
  const devGrpcUrl = process.env.DEV_GRPC_URL || "https://95.142.43.25:5000";

  // Если используется прокси, можно проксировать gRPC запросы через /api/grpc
  const useProxy = process.env.USE_PROXY !== "false";
  if (useProxy && globalThis.window !== undefined) {
    // Настраиваем прокси для gRPC через Vite (добавлено в quasar.config.js)
    return "/api/grpc";
  }

  return devGrpcUrl.replace(/\/$/, "");
}

/**
 * Создаёт метаданные с токеном аутентификации
 */
export function createGrpcMetadata(): grpcWeb.Metadata {
  const authStore = useAuthStore();
  const metadata: grpcWeb.Metadata = {};

  if (authStore.token) {
    metadata["authorization"] = `Bearer ${authStore.token}`;
  }

  return metadata;
}

/**
 * Создаёт экземпляр клиента с настройками по умолчанию
 */
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

if (isDebug) {
  console.log("[grpc-client] Creating gRPC clients...");
  console.log(
    "[grpc-client] AgentServiceClient available:",
    AgentServiceClient !== undefined,
  );
}

const agentServiceClient = createClient(AgentServiceClient);
const userServiceClient = createClient(UserServiceClient);
const admxServiceClient = createClient(AdmxServiceClient);
const policyCatalogServiceClient = createClient(PolicyCatalogServiceClient);
const policyAssignmentServiceClient = createClient(
  PolicyAssignmentServiceClient,
);
const policyStateServiceClient = createClient(PolicyStateServiceClient);

if (isDebug) {
  console.log("[grpc-client] All gRPC clients created successfully");
}

export const policyCatalogClient = {
  async listPoliciesGroupedByScope(
    langCode: string = "ru-RU",
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
    langCode: string = "ru-RU",
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
    langCode: string = "ru-RU",
  ): Promise<operator_pb_types.PolicyDetails.AsObject> {
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getPolicyDetails(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPoliciesByCategory(
    category: string,
    langCode: string = "ru-RU",
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
    langCode: string = "ru-RU",
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

export const policyAssignmentClient = {
  async assignPolicy(
    policyHash: string,
    target: operator_pb_types.PolicyTarget,
    selection?: operator_pb_types.PolicySelection,
  ): Promise<operator_pb_types.AssignPolicyResponse.AsObject> {
    const request = new operator_pb.AssignPolicyRequest();
    request.setPolicyHash(policyHash);
    request.setTarget(target);
    if (selection) {
      request.setSelection(selection);
    }

    const response = await policyAssignmentServiceClient.assignPolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async removePolicy(
    policyHash: string,
    target: operator_pb_types.PolicyTarget,
  ): Promise<operator_pb_types.RemovePolicyResponse.AsObject> {
    const request = new operator_pb.RemovePolicyRequest();
    request.setPolicyHash(policyHash);
    request.setTarget(target);

    const response = await policyAssignmentServiceClient.removePolicy(
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

export {
  agentServiceClient,
  userServiceClient,
  admxServiceClient,
  policyCatalogServiceClient,
  policyAssignmentServiceClient,
  policyStateServiceClient,
};

export * as operator_pb from "@/generated/operator_pb";
