import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { userControlClient, agentServiceClientWrapper } from "@/gpo/api/grpc-client";
import type { Target } from "@/gpo/api/grpc-client";
import type { UserWithIdInfo } from "@/generated/user_service_pb";
import type { GroupInfo } from "@/generated/common/user_pb";

export interface CreateUserParams {
  samAccountName: string;
  password?: string;
  displayName?: string;
  description?: string;
  enabled?: boolean;
  passwordNotRequired?: boolean;
  userCannotChangePassword?: boolean;
  smartcardLogonRequired?: boolean;
  accountExpirationDate?: string;
  name?: string;
  middleName?: string;
  surname?: string;
  email?: string;
  homeDirectory?: string;
  scriptPath?: string;
  telephoneNumber?: string;
  employeeId?: string;
  maxAgents?: number;
  maxPolicies?: number;
}

export interface GroupRow {
  name?: string;
  displayname?: string;
  samaccountname?: string;
  description?: string;
}

export interface AgentRow {
  id: string;
  name: string;
  status?: string;
  last_seen?: string;
  last_boot?: string;
}

type RawAgentListItem = {
  agent_id?: string;
  agentId?: string;
  host_name?: string;
  hostName?: string;
  is_online?: boolean;
  isOnline?: boolean;
  last_heartbeat_unix?: number | string;
  lastHeartbeatUnix?: number | string;
};

function unixSecondsToIso(value: number | string | undefined): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const ts =
    typeof value === "string" ? Number.parseInt(value, 10) : Number(value);
  if (!Number.isFinite(ts) || ts <= 0) return undefined;
  return new Date(ts * 1000).toISOString();
}

function normalizeAgentFromListItem(a: RawAgentListItem): AgentRow | null {
  const id = (a.agent_id ?? a.agentId ?? "").trim();
  if (!id) return null;

  const name = (a.host_name ?? a.hostName ?? "").trim() || id;
  const isOnline = a.is_online ?? a.isOnline;
  const lastSeenIso = unixSecondsToIso(a.last_heartbeat_unix ?? a.lastHeartbeatUnix);
  let status: string | undefined;
  if (isOnline !== undefined) status = isOnline ? "online" : "offline";

  return {
    id,
    name,
    status,
    last_seen: lastSeenIso,
  };
}

type AgentDetailsLike = {
  nodeInfo?: {
    lastboottime?: { seconds?: number | string };
    lastBootTime?: { seconds?: number | string };
  };
};

function secondsToIso(value: number | string | undefined): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const s = typeof value === "string" ? Number.parseInt(value, 10) : Number(value);
  if (!Number.isFinite(s) || s <= 0) return undefined;
  return new Date(s * 1000).toISOString();
}

function extractLastBootIso(details: unknown): string | undefined {
  const d = details as AgentDetailsLike | null;
  const sec =
    d?.nodeInfo?.lastboottime?.seconds ??
    d?.nodeInfo?.lastBootTime?.seconds ??
    undefined;
  return secondsToIso(sec);
}

const bootTimeCache = new Map<string, { value?: string; ts: number }>();
const BOOT_CACHE_TTL = 5 * 60 * 1000;

export function useUserActions() {
  const $q = useQuasar();

  const allUsers = ref<UserWithIdInfo.AsObject[]>([]);
  const usersLoading = ref(false);
  const usersError = ref<string | null>(null);
  const userSearch = ref("");

  const selectedUserId = ref<string | null>(null);
  const userDetail = ref<UserWithIdInfo.AsObject | null>(null);
  const userDetailLoading = ref(false);
  const detailTab = ref("agents");

  const userGroups = ref<GroupRow[]>([]);
  const userGroupsLoading = ref(false);
  const userAgents = ref<AgentRow[]>([]);
  const userAgentsLoading = ref(false);

  const actionLoading = ref(false);

  const filteredUsers = computed(() => {
    const q = userSearch.value.trim().toLowerCase();
    if (!q) return allUsers.value;
    return allUsers.value.filter(
      (u) =>
        (u.userid || "").toLowerCase().includes(q) ||
        (u.info?.samaccountname || "").toLowerCase().includes(q) ||
        (u.info?.displayname || "").toLowerCase().includes(q) ||
        (u.info?.name || "").toLowerCase().includes(q),
    );
  });

  async function loadUsers() {
    usersLoading.value = true;
    usersError.value = null;
    try {
      const res = await userControlClient.getAllUsers();
      const list =
        res.usersList ??
        (res as { users?: UserWithIdInfo.AsObject[] }).users ??
        [];
      allUsers.value = Array.isArray(list) ? list : [];
    } catch (err) {
      usersError.value =
        err instanceof Error ? err.message : "Failed to load users";
    } finally {
      usersLoading.value = false;
    }
  }

  function selectUser(u: UserWithIdInfo.AsObject) {
    selectedUserId.value = u.userid;
    userDetail.value = null;
    userGroups.value = [];
    userAgents.value = [];
    loadUserDetail();
  }

  async function loadUserDetail() {
    if (!selectedUserId.value) return;
    userDetailLoading.value = true;
    userDetail.value = null;
    try {
      const res = await userControlClient.getUser(
        null as unknown as Target,
        selectedUserId.value,
      );
      if (res.user) {
        const userId = selectedUserId.value;
        userDetail.value = {
          userid: res.user.userid || userId || "",
          info: res.user.info,
        };
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed to load user",
      });
    } finally {
      userDetailLoading.value = false;
    }
    loadUserGroups();
    loadUserAgents();
  }

  async function loadUserGroups() {
    if (!selectedUserId.value) return;
    userGroupsLoading.value = true;
    userGroups.value = [];
    try {
      const res = await userControlClient.getUserGroups(
        null as unknown as Target,
        selectedUserId.value,
      );
      const list = res.groupsList ?? [];
      userGroups.value = list.map((item: { info?: GroupInfo.AsObject }) => {
        const g = item.info;
        return {
          name: g?.name || "",
          displayname: g?.displayname || "",
          samaccountname: g?.samaccountname || "",
          description: g?.description || "",
        };
      });
    } catch {
      // игнор
    } finally {
      userGroupsLoading.value = false;
    }
  }

  async function loadUserAgents() {
    if (!selectedUserId.value) return;
    userAgentsLoading.value = true;
    userAgents.value = [];
    try {
      const res = await userControlClient.getUserAgents(
        null as unknown as Target,
        selectedUserId.value,
      );
      const agentIds = res.agentIdsList ?? [];

      if (agentIds.length === 0) {
        userAgents.value = [];
        return;
      }

      try {
        const listRes = await agentServiceClientWrapper.listAgents(agentIds);
        const agents = (listRes as { agentsList?: RawAgentListItem[] }).agentsList ?? [];

        const byId = new Map<string, AgentRow>();
        for (const a of agents) {
          const normalized = normalizeAgentFromListItem(a);
          if (!normalized) continue;
          byId.set(normalized.id, normalized);
        }

        userAgents.value = agentIds.map((id) => byId.get(id) ?? { id, name: id });

        const now = Date.now();
        const idsToFetch = agentIds.filter((id) => {
          const cached = bootTimeCache.get(id);
          return !(cached && now - cached.ts < BOOT_CACHE_TTL);
        });

        const mapWithConcurrency = async <T, R>(
          items: T[],
          concurrency: number,
          fn: (item: T) => Promise<R>,
        ): Promise<R[]> => {
          const results: R[] = [];
          for (let i = 0; i < items.length; i += concurrency) {
            const batch = items.slice(i, i + concurrency);
            const batchResults = await Promise.all(batch.map(fn));
            results.push(...batchResults);
          }
          return results;
        };

        await mapWithConcurrency(idsToFetch, 3, async (id) => {
          try {
            const details = await agentServiceClientWrapper.getAgent(id);
            const iso = extractLastBootIso(details);
            bootTimeCache.set(id, { value: iso, ts: Date.now() });
          } catch {
            bootTimeCache.set(id, { value: undefined, ts: Date.now() });
          }
        });

        userAgents.value = userAgents.value.map((row) => {
          const cached = bootTimeCache.get(row.id);
          return cached?.value ? { ...row, last_boot: cached.value } : row;
        });
        return;
      } catch {
        //игнор
      }

      const agentsWithNames = await Promise.all(
        agentIds.map(async (id) => {
          try {
            const agent = await agentServiceClientWrapper.getAgent(id);
            const name =
              (agent as { hostName?: string; host_name?: string }).hostName ??
              (agent as { hostName?: string; host_name?: string }).host_name ??
              id;
            const status =
              (agent as { status?: string }).status ??
              (agent as { is_online?: boolean; isOnline?: boolean }).is_online ??
              (agent as { is_online?: boolean; isOnline?: boolean }).isOnline ??
              undefined;
            const lastSeen =
              (agent as { last_seen?: string }).last_seen ??
              (agent as { lastSeen?: string }).lastSeen ??
              undefined;
            return {
              id,
              name: (name ?? id).trim() || id,
              status: typeof status === "string" ? status : undefined,
              last_seen: typeof lastSeen === "string" ? lastSeen : undefined,
            };
          } catch {
            return { id, name: id };
          }
        }),
      );

      userAgents.value = agentsWithNames;
    } catch {
      // игнор
    } finally {
      userAgentsLoading.value = false;
    }
  }

  watch(detailTab, () => {
    if (detailTab.value === "groups" && selectedUserId.value) loadUserGroups();
    if (detailTab.value === "agents" && selectedUserId.value) loadUserAgents();
  });

  async function createUser(
    target: Target,
    params: CreateUserParams,
  ): Promise<boolean> {
    try {
      const res = await userControlClient.createUser(target, {
        samAccountName: params.samAccountName.trim(),
        password: params.password?.trim(),
        displayName: params.displayName?.trim() || "",
        description: params.description?.trim() || "",
        enabled: params.enabled,
        passwordNotRequired: params.passwordNotRequired ?? false,
        userCannotChangePassword: params.userCannotChangePassword ?? false,
        smartcardLogonRequired: params.smartcardLogonRequired ?? false,
        accountExpirationDate: params.accountExpirationDate?.trim() || "",
        name: params.name?.trim() || "",
        middleName: params.middleName?.trim() || "",
        surname: params.surname?.trim() || "",
        email: params.email?.trim() || "",
        homeDirectory: params.homeDirectory?.trim() || "",
        scriptPath: params.scriptPath?.trim() || "",
        telephoneNumber: params.telephoneNumber?.trim() || "",
        employeeId: params.employeeId?.trim() || "",
        maxAgents: params.maxAgents,
        maxPolicies: params.maxPolicies,
      });
      if (res.status === 0) {
        $q.notify({
          type: "positive",
          message: `User "${params.samAccountName}" created`,
        });
        await loadUsers();
        return true;
      } else {
        $q.notify({
          type: "negative",
          message: res.errorMessage || "Create failed",
        });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Create failed",
      });
      return false;
    }
  }

  async function updateUser(
    target: Target,
    userId: string,
    params: Partial<CreateUserParams>,
  ): Promise<boolean> {
    const payload = {
      samAccountName: params.samAccountName?.trim() || userId,
      password: params.password?.trim() || undefined,
      displayName: params.displayName?.trim() || "",
      description: params.description?.trim() || "",
      enabled: params.enabled,
      passwordNotRequired: params.passwordNotRequired ?? false,
      userCannotChangePassword: params.userCannotChangePassword ?? false,
      smartcardLogonRequired: params.smartcardLogonRequired ?? false,
      accountExpirationDate: params.accountExpirationDate?.trim() || "",
      name: params.name?.trim() || "",
      middleName: params.middleName?.trim() || "",
      surname: params.surname?.trim() || "",
      email: params.email?.trim() || "",
      homeDirectory: params.homeDirectory?.trim() || "",
      scriptPath: params.scriptPath?.trim() || "",
      telephoneNumber: params.telephoneNumber?.trim() || "",
      employeeId: params.employeeId?.trim() || "",
      maxAgents: params.maxAgents,
      maxPolicies: params.maxPolicies,
    };
    const samId =
      userDetail.value?.info?.samaccountname ?? userId;
    try {
      const res = await userControlClient.updateUser(
        target,
        samId,
        payload,
        userId,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "User updated" });
        loadUserDetail();
        loadUsers();
        return true;
      } else {
        $q.notify({
          type: "negative",
          message: res.errorMessage || "Update failed",
        });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Update failed",
      });
      return false;
    }
  }

  async function deleteUser(target: Target): Promise<boolean> {
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    actionLoading.value = true;
    try {
      const res = await userControlClient.deleteUser(
        target,
        samId,
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "User deleted" });
        selectedUserId.value = null;
        userDetail.value = null;
        await loadUsers();
        return true;
      } else {
        $q.notify({
          type: "negative",
          message: res.errorMessage || "Delete failed",
        });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Delete failed",
      });
      return false;
    } finally {
      actionLoading.value = false;
    }
  }

  async function toggleEnableUser(target: Target): Promise<boolean> {
    if (!target) {
      $q.notify({
        type: "warning",
        message: "Select target first (click the badge in the header)",
      });
      return false;
    }
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    const wasEnabled = userDetail.value?.info?.isenabled !== false;
    const newEnabled = !wasEnabled;
    actionLoading.value = true;
    try {
      const res = await userControlClient.enableUser(
        target,
        samId,
        newEnabled,
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({
          type: "positive",
          message: newEnabled ? "User enabled" : "User disabled",
        });
        if (userDetail.value?.info) {
          (userDetail.value.info as { isenabled?: boolean }).isenabled =
            newEnabled;
        }
        await loadUserDetail();
        await loadUsers();
        return true;
      } else {
        $q.notify({ type: "negative", message: res.errorMessage || "Failed" });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed",
      });
      return false;
    } finally {
      actionLoading.value = false;
    }
  }

  async function setPassword(
    target: Target,
    password: string,
  ): Promise<boolean> {
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    try {
      const res = await userControlClient.setUserPassword(
        target,
        samId,
        password.trim(),
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "Password set" });
        return true;
      } else {
        $q.notify({ type: "negative", message: res.errorMessage || "Failed" });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed",
      });
      return false;
    }
  }

  async function unlockUser(target: Target): Promise<boolean> {
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    actionLoading.value = true;
    try {
      const res = await userControlClient.unlockUser(
        target,
        samId,
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "User unlocked" });
        loadUserDetail();
        return true;
      } else {
        $q.notify({ type: "negative", message: res.errorMessage || "Failed" });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed",
      });
      return false;
    } finally {
      actionLoading.value = false;
    }
  }

  async function expirePassword(target: Target): Promise<boolean> {
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    actionLoading.value = true;
    try {
      const res = await userControlClient.expireUserPassword(
        target,
        samId,
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "Password expired" });
        loadUserDetail();
        return true;
      } else {
        $q.notify({ type: "negative", message: res.errorMessage || "Failed" });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed",
      });
      return false;
    } finally {
      actionLoading.value = false;
    }
  }

  async function setAccountExpiration(
    target: Target,
    expirationValue: string | undefined,
  ): Promise<boolean> {
    if (!selectedUserId.value) return false;
    const samId =
      userDetail.value?.info?.samaccountname ?? selectedUserId.value;
    try {
      const res = await userControlClient.setUserAccountExpiration(
        target,
        samId,
        expirationValue,
        selectedUserId.value,
      );
      if (res.status === 0) {
        $q.notify({ type: "positive", message: "Account expiration set" });
        loadUserDetail();
        return true;
      } else {
        $q.notify({ type: "negative", message: res.errorMessage || "Failed" });
        return false;
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: err instanceof Error ? err.message : "Failed",
      });
      return false;
    }
  }

  function confirmDeleteUser(target: Target) {
    $q.dialog({
      title: "Delete User",
      message: `Are you sure you want to delete user "${selectedUserId.value}"?`,
      cancel: true,
      persistent: true,
      color: "negative",
    }).onOk(() => deleteUser(target));
  }

  return {
    allUsers,
    usersLoading,
    usersError,
    userSearch,
    selectedUserId,
    userDetail,
    userDetailLoading,
    detailTab,
    userGroups,
    userGroupsLoading,
    userAgents,
    userAgentsLoading,
    actionLoading,
    filteredUsers,
    loadUsers,
    selectUser,
    loadUserDetail,
    loadUserGroups,
    loadUserAgents,
    createUser,
    updateUser,
    deleteUser,
    toggleEnableUser,
    setPassword,
    unlockUser,
    expirePassword,
    setAccountExpiration,
    confirmDeleteUser,
  };
}
