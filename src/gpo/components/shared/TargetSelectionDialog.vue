<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="onShow"
  >
    <q-card class="target-dialog-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ agentsOnly ? 'Select agent' : 'Select target' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div v-if="!agentsOnly" class="text-caption text-grey-7 q-mb-sm">
          Choose one node for a single target, or tick several for a combined
          target.
        </div>
        <div v-else class="text-caption text-grey-7 q-mb-sm">
          Choose an agent.
        </div>
        <div v-if="targetTreeLoading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>
        <q-scroll-area
          v-else-if="agentsOnly && agentNodesOnly.length > 0"
          style="height: min(400px, 55vh)"
          class="rounded-borders"
        >
          <q-list bordered separator>
            <q-item
              v-for="node in agentNodesOnly"
              :key="node.id"
              v-ripple
              clickable
              :active="targetSelectedId === node.id"
              active-class="bg-primary-1"
              @click="selectAgent(node.id)"
            >
              <q-item-section avatar>
                <q-icon name="dns" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ node.label }}</q-item-label>
                <q-item-label v-if="node.agentId" caption>{{ node.agentId }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-scroll-area
          v-else-if="!agentsOnly && targetTreeNodes.length > 0"
          style="height: min(400px, 55vh)"
          class="rounded-borders"
        >
          <q-tree
            v-model:selected="targetSelectedId"
            v-model:ticked="targetTickedIds"
            :nodes="targetTreeNodes"
            node-key="id"
            tick-strategy="strict"
            selected-color="primary"
            class="target-tree"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center full-width">
                <q-icon
                  :name="getTargetNodeIcon(prop.node)"
                  class="q-mr-sm"
                  size="sm"
                />
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
          </q-tree>
        </q-scroll-area>
        <div
          v-else-if="agentsOnly && !targetTreeLoading"
          class="text-grey-7 text-body2 q-pa-md"
        >
          No agents loaded.
        </div>
        <div
          v-else-if="!agentsOnly"
          class="text-grey-7 text-body2 q-pa-md"
        >
          No clients/sites loaded.
        </div>
        <div
          v-if="!agentsOnly && targetTickedIds.length > 0"
          class="q-mt-sm text-caption text-grey-7"
        >
          Combined: {{ targetTickedIds.length }} item(s) selected
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="OK"
          :disable="!canApplyTarget"
          @click="handleApply"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useTargetSelection } from "@/gpo/composables/useTargetSelection";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";

const props = withDefaults(
  defineProps<{ modelValue: boolean; agentsOnly?: boolean }>(),
  { agentsOnly: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [ref: TargetRef];
}>();

const {
  targetTreeNodes,
  targetTreeLoading,
  targetSelectedId,
  targetTickedIds,
  canApplyTarget,
  agentNodesOnly,
  getTargetNodeIcon,
  onDialogShow,
  applyTargetSelection,
  buildTargetFromSingleNode,
  currentTargetRef,
} = useTargetSelection();

function onShow() {
  onDialogShow();
  if (props.agentsOnly) {
    targetTickedIds.value = [];
  }
}

function selectAgent(id: string) {
  targetSelectedId.value = id;
}

function handleApply() {
  if (props.agentsOnly) {
    const ref = buildTargetFromSingleNode();
    if (ref && ref.target) {
      currentTargetRef.value = ref;
      emit("select", ref);
      emit("update:modelValue", false);
    }
    return;
  }
  if (applyTargetSelection() && currentTargetRef.value) {
    emit("select", currentTargetRef.value);
    emit("update:modelValue", false);
  }
}
</script>

<style scoped lang="sass">
.target-dialog-card
  min-width: 500px
  max-width: 90vw

.target-tree
  :deep(.q-tree__node-header)
    border-radius: 4px
</style>
