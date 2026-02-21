<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="onShow"
  >
    <q-card class="target-dialog-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Select target</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey-7 q-mb-sm">
          Choose one node for a single target, or tick several for a combined
          target.
        </div>
        <div v-if="targetTreeLoading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>
        <q-scroll-area
          v-else-if="targetTreeNodes.length > 0"
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
        <div v-else class="text-grey-7 text-body2 q-pa-md">
          No clients/sites loaded.
        </div>
        <div
          v-if="targetTickedIds.length > 0"
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

defineProps<{
  modelValue: boolean;
}>();

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
  getTargetNodeIcon,
  onDialogShow,
  applyTargetSelection,
  currentTargetRef,
} = useTargetSelection();

function onShow() {
  onDialogShow();
}

function handleApply() {
  if (applyTargetSelection() && currentTargetRef.value) {
    emit("select", currentTargetRef.value);
    emit("update:modelValue", false);
  }
}
</script>

<style scoped lang="sass">
.target-dialog-card
  min-width: 400px
  max-width: 90vw

.target-tree
  :deep(.q-tree__node-header)
    border-radius: 4px
</style>
