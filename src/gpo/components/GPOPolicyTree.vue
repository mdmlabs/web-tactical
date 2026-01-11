<template>
  <div class="gpo-policy-tree">
    <div class="tree-container">
      <q-tree
        :nodes="treeNodes"
        node-key="id"
        :expanded="expandedNodes"
        @update:expanded="expandedNodes = $event"
        default-expand-all
      >
        <template v-slot:default-header="prop">
          <div class="row items-center full-width">
            <q-icon
              :name="getNodeIcon(prop.node)"
              :color="getNodeColor(prop.node)"
              size="20px"
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-weight-medium">{{ prop.node.label }}</div>
              <div v-if="prop.node.path" class="text-caption text-grey-6">
                {{ prop.node.path }}
              </div>
            </div>
            <q-btn
              v-if="prop.node.type === 'policy'"
              flat
              dense
              round
              icon="edit"
              size="sm"
              @click.stop="onEditPolicy(prop.node)"
              class="q-mr-xs"
            />
            <q-btn
              v-if="prop.node.type === 'policy'"
              flat
              dense
              round
              icon="delete"
              size="sm"
              color="negative"
              @click.stop="onDeletePolicy(prop.node)"
            />
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { QTree } from "quasar";
import type { GPOPolicyTree, GPOPolicy } from "../types/gpo";

interface TreeNode {
  id: string;
  label: string;
  path?: string;
  type: "domain" | "ou" | "site" | "policy";
  children?: TreeNode[];
  policy?: GPOPolicy;
}

interface Props {
  tree: GPOPolicyTree | null;
}

interface Emits {
  (e: "edit-policy", policy: GPOPolicy): void;
  (e: "delete-policy", policy: GPOPolicy): void;
  (e: "select-node", node: TreeNode): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const expandedNodes = ref<string[]>([]);

const treeNodes = computed<TreeNode[]>(() => {
  if (!props.tree) {
    console.log("[GPOPolicyTree] Tree is null");
    return [];
  }

  console.log("[GPOPolicyTree] Converting tree:", props.tree);

  const convertNode = (node: GPOPolicyTree): TreeNode => {
    const treeNode: TreeNode = {
      id: node.id,
      label: node.name,
      path: node.path,
      type: node.path?.includes("CN=Policies") ? "policy" : "ou",
      children: [],
    };

    if (node.children && node.children.length > 0) {
      treeNode.children = node.children.map(convertNode);
    }

    if (node.policies && node.policies.length > 0) {
      const policyNodes = node.policies.map((policy) => ({
        id: policy.id,
        label: policy.displayName || policy.name,
        path: policy.path,
        type: "policy" as const,
        policy: policy,
      }));
      treeNode.children = [...(treeNode.children || []), ...policyNodes];
    }

    return treeNode;
  };

  const result = [convertNode(props.tree)];
  console.log("[GPOPolicyTree] Converted tree nodes:", result);
  return result;
});

const getNodeIcon = (node: TreeNode): string => {
  switch (node.type) {
    case "domain":
      return "domain";
    case "ou":
      return "folder";
    case "site":
      return "location_on";
    case "policy":
      return "settings"; // Используем стандартную иконку вместо "policy"
    default:
      return "folder";
  }
};

const getNodeColor = (node: TreeNode): string => {
  switch (node.type) {
    case "domain":
      return "primary";
    case "ou":
      return "blue-grey";
    case "site":
      return "orange";
    case "policy":
      return "green";
    default:
      return "grey";
  }
};

const onEditPolicy = (node: TreeNode) => {
  if (node.policy) {
    emit("edit-policy", node.policy);
  }
};

const onDeletePolicy = (node: TreeNode) => {
  if (node.policy) {
    emit("delete-policy", node.policy);
  }
};
</script>

<style scoped lang="sass">
.gpo-policy-tree
  padding: 16px
  height: 100%
  display: flex
  flex-direction: column

.tree-container
  flex: 1
  overflow-y: auto
  overflow-x: hidden
  max-height: 600px
  min-height: 300px
</style>
