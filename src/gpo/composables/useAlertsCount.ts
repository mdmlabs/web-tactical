import { ref, watch } from "vue";
import { alertsClient } from "@/gpo/api/grpc-client";

type AlertsScope =
  | { agentId: string }
  | { userId: string }
  | { groupId: string }
  | { agentCategoryId: number };

function buildKey(scope: AlertsScope | null): string | null {
  if (!scope) return null;
  if ("agentId" in scope) return `a:${scope.agentId}`;
  if ("userId" in scope) return `u:${scope.userId}`;
  if ("groupId" in scope) return `g:${scope.groupId}`;
  return `c:${scope.agentCategoryId}`;
}

export function useAlertsCount(scope: () => AlertsScope | null) {
  const count = ref(0);
  const loading = ref(false);
  const loadedForKey = ref<string | null>(null);

  async function reload(): Promise<void> {
    const s = scope();
    const key = buildKey(s);
    if (!s || !key) {
      count.value = 0;
      loading.value = false;
      loadedForKey.value = null;
      return;
    }

    loading.value = true;
    try {
      const req: Parameters<typeof alertsClient.listAlerts>[0] = {};
      if ("agentId" in s) req.agentId = s.agentId;
      else if ("userId" in s) req.userId = s.userId;
      else if ("groupId" in s) req.groupId = s.groupId;
      else req.agentCategoryId = s.agentCategoryId;

      const resp = await alertsClient.listAlerts(req);
      const responseObj = resp as unknown as {
        itemsList?: unknown[];
        items?: unknown[];
      };
      const items = responseObj.itemsList ?? responseObj.items ?? [];
      count.value = items.length;
      loadedForKey.value = key;
    } catch {
      count.value = 0;
      loadedForKey.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => buildKey(scope()),
    (key) => {
      count.value = 0;
      loading.value = Boolean(key);
      loadedForKey.value = null;
      void reload();
    },
    { immediate: true },
  );

  return {
    count,
    loading,
    loadedForKey,
    reload,
  };
}

