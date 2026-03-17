<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="apply-collection-target-card" style="min-width: 480px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ isRemoveMode ? "Remove collection" : "Apply collection"
          }}{{ collectionName ? `: ${collectionName}` : "" }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          Select one target or tick several (Client / Site / Agent) for combined
          target.
        </div>
        <div v-if="treeLoading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>
        <q-scroll-area
          v-else-if="treeNodes.length > 0"
          :style="{ height: 'min(400px, 50vh)' }"
          class="rounded-borders"
        >
          <q-tree
            v-model:selected="selectedNodeId"
            v-model:ticked="tickedNodeIds"
            :nodes="treeNodes"
            node-key="id"
            tick-strategy="strict"
            selected-color="primary"
            class="target-tree"
            @lazy-load="onLazyLoad"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center full-width">
                <q-icon
                  :name="getNodeIcon(prop.node)"
                  class="q-mr-sm"
                  size="sm"
                />
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
          </q-tree>
        </q-scroll-area>
        <div v-else class="text-grey-7 text-body2 q-pa-md">
          No clients/sites loaded. Check connection.
        </div>
        <div
          v-if="tickedNodeIds.length > 0"
          class="q-mt-sm text-caption text-grey-7"
        >
          Combined target: {{ tickedNodeIds.length }} item(s) selected
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn
          :unelevated="!isRemoveMode"
          :flat="isRemoveMode"
          :color="isRemoveMode ? 'negative' : 'primary'"
          :label="isRemoveMode ? 'Remove' : 'Apply'"
          :loading="applying"
          :disable="!canSubmit"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { fetchClients } from "@/api/clients";
import { fetchAgents } from "@/api/agents";
import {
  policyAssignmentClient,
  collectionsClient,
  policyCatalogClient,
  userClient,
  userControlClient,
} from "@/gpo/api/grpc-client";
import type {
  PolicyTargetType,
  PolicyTargetParams,
} from "@/gpo/api/grpc-client";
import { notifyError, notifySuccess } from "@/utils/notify";

export interface TargetSelection {
  targetType: "client" | "site" | "agent" | "user";
  clientId?: string;
  siteId?: string;
  agentId?: string;
  userId?: string;
  label?: string;
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  lazy?: boolean;
  tickable?: boolean;
  targetType?: "client" | "site" | "agent" | "user";
  clientId?: string;
  siteId?: string;
  agentId?: string;
  userId?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    collectionId: number;
    collectionName?: string;
    mode?: "apply" | "remove";
  }>(),
  {
    collectionName: "",
    mode: "apply",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "applied"): void;
  (e: "removed"): void;
}>();

const isRemoveMode = computed(() => props.mode === "remove");

const treeLoading = ref(true);
const applying = ref(false);
const selectedNodeId = ref<string | null>(null);
const tickedNodeIds = ref<string[]>([]);
const treeNodes = ref<TreeNode[]>([]);
const agentsBySiteKey = ref<
  Map<string, Array<{ agent_id: string; hostname: string }>>
>(new Map());

const sidToUserIdMap = ref<Map<string, string>>(new Map());

const selectedTarget = computed((): TargetSelection | null => {
  const id = selectedNodeId.value;
  if (!id) return null;
  const node = findNodeById(treeNodes.value, id);
  if (!node || !node.targetType) return null;
  return {
    targetType: node.targetType,
    clientId: node.clientId,
    siteId: node.siteId,
    agentId: node.agentId,
    userId: node.userId,
    label: node.label,
  };
});

function buildCombinedFromTicked(): {
  targetType: "combined";
  targetParams: { clientIds: string[]; siteIds: string[]; agentIds: string[] };
  label: string;
} | null {
  if (tickedNodeIds.value.length === 0) return null;
  const clientIds: string[] = [];
  const siteIds: string[] = [];
  const agentIds: string[] = [];
  const labels: string[] = [];
  for (const id of tickedNodeIds.value) {
    const node = findNodeById(treeNodes.value, id);
    if (!node || !node.targetType) continue;
    if (node.targetType === "user") continue;
    if (node.targetType === "client" && node.clientId) {
      clientIds.push(node.clientId);
      labels.push(node.label);
    } else if (node.targetType === "site" && node.siteId) {
      siteIds.push(node.siteId);
      labels.push(node.label);
    } else if (node.targetType === "agent" && node.agentId) {
      agentIds.push(node.agentId);
      labels.push(node.label);
    }
  }
  if (clientIds.length === 0 && siteIds.length === 0 && agentIds.length === 0) {
    return null;
  }
  return {
    targetType: "combined",
    targetParams: { clientIds, siteIds, agentIds },
    label: labels.join(", ") || "Combined",
  };
}

const canSubmit = computed(() => {
  if (tickedNodeIds.value.length > 0) return true;
  return selectedTarget.value != null;
});

function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getNodeIcon(node: TreeNode): string {
  if (node.targetType === "client") return "business";
  if (node.targetType === "site") return "location_on";
  if (node.targetType === "agent") return "computer";
  if (node.targetType === "user") return "person";
  return "folder";
}

function onLazyLoad(details: {
  node: TreeNode;
  key: string;
  done: (children: TreeNode[]) => void;
  fail: () => void;
}) {
  const { node, done, fail } = details;
  if (node.targetType !== "agent" || !node.agentId) {
    done([]);
    return;
  }
  userClient
    .listUsersForAgent(node.agentId)
    .then((users) => {
      const map = sidToUserIdMap.value;
      const userNodes: TreeNode[] = (users ?? [])
        .filter((u) => u.sid)
        .map((u) => {
          const sid = String(u.sid);
          const userId = map.get(sid) ?? sid;
          return {
            id: `user-${node.agentId}-${sid}`,
            label: u.name ?? u.sid ?? "—",
            targetType: "user" as const,
            agentId: node.agentId!,
            userId,
          };
        });
      done(userNodes);
    })
    .catch(() => fail());
}

async function loadTree() {
  treeLoading.value = true;
  treeNodes.value = [];
  agentsBySiteKey.value = new Map();
  sidToUserIdMap.value = new Map();
  try {
    const [clientsData, agentsData, allUsersRes] = await Promise.all([
      fetchClients(),
      fetchAgents({ detail: false }).catch(() => null),
      userControlClient.getAllUsers().catch(() => ({ usersList: [] })),
    ]);
    const allUsersList =
      allUsersRes?.usersList ??
      (allUsersRes as { users?: Array<{ userid?: string; info?: { sid?: string } }> })
        ?.users ??
      [];
    const map = new Map<string, string>();
    for (const u of allUsersList) {
      const rec = u as { userid?: string; userId?: string; info?: { sid?: string } };
      const uid = rec.userid ?? rec.userId ?? "";
      const sid = rec.info?.sid ?? "";
      if (sid && uid) map.set(sid, uid);
    }
    sidToUserIdMap.value = map;
    const clients = Array.isArray(clientsData) ? clientsData : [];
    const rawAgents = agentsData ?? [];
    let agents: Array<Record<string, unknown>> = [];
    if (Array.isArray(rawAgents)) {
      agents = rawAgents as Array<Record<string, unknown>>;
    } else if (Array.isArray((rawAgents as { results?: unknown[] }).results)) {
      agents = (rawAgents as { results: Array<Record<string, unknown>> })
        .results;
    }

    const agentsBySite = new Map<
      string,
      Array<{ agent_id: string; hostname: string }>
    >();
    for (const a of agents) {
      const clientName = a.client ?? a.client_name;
      const siteName = a.site ?? a.site_name;
      const key = `${String(clientName)}::${String(siteName)}`;
      if (!agentsBySite.has(key)) agentsBySite.set(key, []);
      agentsBySite.get(key)!.push({
        agent_id: String(a.agent_id ?? a.id ?? ""),
        hostname: String(a.hostname ?? "—"),
      });
    }
    agentsBySiteKey.value = agentsBySite;

    const nodes: TreeNode[] = clients.map(
      (client: {
        id: number;
        name: string;
        sites?: Array<{ id: number; name: string }>;
      }) => {
        const clientId = String(client.id);
        const sites = client.sites ?? [];
        const siteNodes: TreeNode[] = sites.map(
          (site: { id: number; name: string }) => {
            const siteId = String(site.id);
            const siteKey = `${client.name}::${site.name}`;
            const siteAgents = agentsBySite.get(siteKey) ?? [];
            const agentNodes: TreeNode[] = siteAgents.map((ag) => ({
              id: `agent-${ag.agent_id}`,
              label: ag.hostname,
              targetType: "agent" as const,
              clientId,
              siteId,
              agentId: ag.agent_id,
              lazy: true,
              tickable: true,
              children: [],
            }));
            const siteLabel =
              site.name + (siteAgents.length ? ` (${siteAgents.length})` : "");
            return {
              id: `site-${siteId}`,
              label: siteLabel,
              targetType: "site" as const,
              clientId,
              siteId,
              tickable: true,
              children: agentNodes.length > 0 ? agentNodes : undefined,
            };
          },
        );
        return {
          id: `client-${clientId}`,
          label: client.name,
          targetType: "client" as const,
          clientId,
          tickable: true,
          children: siteNodes.length > 0 ? siteNodes : undefined,
        };
      },
    );
    treeNodes.value = nodes;
  } catch (e) {
    console.error("Load target tree failed:", e);
    notifyError("Failed to load clients/sites");
  } finally {
    treeLoading.value = false;
  }
}

async function onSubmit() {
  if (!props.collectionId) return;
  const combined = buildCombinedFromTicked();
  let targetType: PolicyTargetType;
  let targetParams: PolicyTargetParams;
  let label: string;

  if (combined) {
    targetType = "combined";
    targetParams = combined.targetParams;
    label = combined.label;
  } else {
    const target = selectedTarget.value;
    if (!target) {
      notifyError("Select a target or tick nodes for combined target");
      return;
    }
    targetType = target.targetType;
    label = target.label ?? target.targetType;
    targetParams = {};
    if (target.targetType === "client" && target.clientId) {
      targetParams.clientId = target.clientId;
    } else if (target.targetType === "site" && target.siteId) {
      targetParams.siteId = target.siteId;
    } else if (target.targetType === "agent" && target.agentId) {
      targetParams.agentId = target.agentId;
    } else if (
      target.targetType === "user" &&
      target.agentId &&
      target.userId
    ) {
      targetType = "user";
      targetParams.agentId = target.agentId;
      targetParams.userId = target.userId;
    } else {
      notifyError("Invalid target selection");
      return;
    }
  }

  applying.value = true;
  try {
    if (isRemoveMode.value) {
      await policyAssignmentClient.removePolicyCollection(
        props.collectionId,
        targetType,
        targetParams,
      );
      notifySuccess(`Collection removed from: ${label}`);
      emit("removed");
    } else {
      const collectionResp = await collectionsClient.getCollectionById(
        props.collectionId,
        "en-US",
      );
      const coll =
        collectionResp.collection ??
        (
          collectionResp as {
            collection?: { policiesList?: unknown[]; policies?: unknown[] };
          }
        ).collection;
      const policiesList =
        (coll as { policiesList?: unknown[]; policies?: unknown[] })
          .policiesList ??
        (coll as { policiesList?: unknown[]; policies?: unknown[] }).policies ??
        [];
      if (policiesList.length === 0) {
        notifyError("Collection has no policies");
        return;
      }

      const policyHashes: string[] = [];
      for (const p of policiesList as Array<{ id?: number; hash?: string }>) {
        const policyId = p.id;
        if (policyId == null) continue;
        let hash = p.hash;
        if (!hash) {
          try {
            const details = await policyCatalogClient.getPolicyDetails(
              Number(policyId),
              "en-US",
            );
            const policyObj = (details as { policy?: { hash?: string } })
              .policy;
            hash = policyObj?.hash ?? "";
          } catch {
            continue;
          }
        }
        if (hash) policyHashes.push(hash);
      }

      if (policyHashes.length === 0) {
        notifyError("Could not resolve policy hashes for collection");
        return;
      }

      for (const policyHash of policyHashes) {
        await policyAssignmentClient.assignPolicy(
          policyHash,
          targetType,
          targetParams,
        );
      }

      notifySuccess(
        `Collection applied to: ${label} (${policyHashes.length} policy/policies)`,
      );
      emit("applied");
    }
    emit("update:modelValue", false);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    notifyError(
      isRemoveMode.value ? `Remove failed: ${msg}` : `Apply failed: ${msg}`,
    );
  } finally {
    applying.value = false;
  }
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      selectedNodeId.value = null;
      tickedNodeIds.value = [];
      loadTree();
    }
  },
);
</script>

<style scoped lang="sass">
.apply-collection-target-card
  max-width: 90vw

.target-tree
  :deep(.q-tree__node-header)
    border-radius: 4px
</style>
