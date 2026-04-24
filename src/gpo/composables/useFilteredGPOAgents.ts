import { ref } from "vue";
import { agentServiceClientWrapper } from "@/gpo/api/grpc-client";
import { fetchAgents as fetchTacticalAgents } from "@/api/agents";

/**
 * Composable для получения GPO агентов с учетом ограничений роли пользователя.
 * 
 * Логика:
 * 1. Загружаем Tactical агенты (уже отфильтрованные бэкендом по can_view_clients/can_view_sites)
 * 2. Извлекаем их agent_id
 * 3. Используем этот список как whitelist для фильтрации GPO агентов
 * 
 * Это гарантирует, что пользователь увидит только те GPO агенты,
 * которые соответствуют его роли.
 */
export function useFilteredGPOAgents() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Получить отфильтрованные GPO агенты на основе роли пользователя
   * @returns Список GPO агентов, доступных текущему пользователю
   */
  async function getFilteredGPOAgents() {
    isLoading.value = true;
    error.value = null;

    try {
      // 1. Получаем Tactical агенты (уже отфильтрованные бэкендом)
      const tacticalAgents = await fetchTacticalAgents({ detail: false });
      
      // 2. Извлекаем agent_id как whitelist
      const allowedAgentIds = Array.isArray(tacticalAgents)
        ? tacticalAgents.map((agent: { agent_id?: string }) => String(agent.agent_id))
        : [];

      // 3. Получаем GPO агенты с фильтрацией
      const response = await agentServiceClientWrapper.listAgents(
        allowedAgentIds.length > 0 ? allowedAgentIds : undefined
      );

      return response.agentsList || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      error.value = `Failed to load filtered GPO agents: ${message}`;
      console.error("[GPO] Error loading filtered agents:", err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    getFilteredGPOAgents,
  };
}
