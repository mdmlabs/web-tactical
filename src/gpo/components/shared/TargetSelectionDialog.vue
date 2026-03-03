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
          Choose Global or a category; optionally pick an agent on the right.
        </div>
        <div v-else class="text-caption text-grey-7 q-mb-sm">
          Choose an agent.
        </div>
        <div v-if="targetTreeLoading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>
        <template v-else-if="!agentsOnly && targetTreeNodes.length > 0">
          <div class="target-dialog-columns row">
            <q-scroll-area class="target-dialog-tree col" style="height: min(400px, 55vh)">
              <q-tree
                v-model:selected="targetSelectedId"
                :nodes="targetTreeNodes"
                node-key="id"
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
            <div class="target-dialog-agents col">
              <div v-if="selectedCategoryId != null || selectedUngroupedAgents" class="column full-height">
                <div class="text-subtitle2 q-mb-sm">
                  {{ selectedUngroupedAgents ? "All agents" : "Agents" }}
                </div>
                <div v-if="agentsPanelLoading" class="flex flex-center q-pa-md">
                  <q-spinner color="primary" size="1.5em" />
                </div>
                <template v-else-if="agentsPanelList.length > 0">
                  <q-scroll-area style="height: min(360px, 50vh)" class="rounded-borders">
                    <template v-if="!selectedUngroupedAgents && agentsOthers.length > 0">
                      <div v-if="agentsInCategory.length > 0" class="q-px-sm q-pt-sm">
                        <div class="text-caption text-grey-7 q-mb-xs">In category</div>
                        <q-list bordered separator dense>
                          <q-item
                            v-for="item in agentsInCategory"
                            :key="item.agentId"
                            v-ripple
                            clickable
                            :active="selectedAgentInPanel === item.agentId"
                            active-class="bg-primary-1"
                            @click="selectAgentInPanel(selectedAgentInPanel === item.agentId ? null : item.agentId)"
                          >
                            <q-item-section avatar>
                              <q-icon name="computer" color="primary" size="sm" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                              <q-item-label caption>{{ item.agentId }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <div class="q-px-sm q-pt-sm">
                        <div class="text-caption text-grey-7 q-mb-xs">Other agents</div>
                        <q-list bordered separator dense>
                          <q-item
                            v-for="item in agentsOthers"
                            :key="item.agentId"
                            v-ripple
                            clickable
                            :active="selectedAgentInPanel === item.agentId"
                            active-class="bg-primary-1"
                            @click="selectAgentInPanel(selectedAgentInPanel === item.agentId ? null : item.agentId)"
                          >
                            <q-item-section avatar>
                              <q-icon name="computer" color="primary" size="sm" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ item.label }}</q-item-label>
                              <q-item-label caption>{{ item.agentId }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </template>
                    <q-list v-else bordered separator dense>
                      <q-item
                        v-for="item in agentsPanelList"
                        :key="item.agentId"
                        v-ripple
                        clickable
                        :active="selectedAgentInPanel === item.agentId"
                        active-class="bg-primary-1"
                        @click="selectAgentInPanel(selectedAgentInPanel === item.agentId ? null : item.agentId)"
                      >
                        <q-item-section avatar>
                          <q-icon name="computer" color="primary" size="sm" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ item.label }}</q-item-label>
                          <q-item-label caption>{{ item.agentId }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                  <div v-if="!selectedUngroupedAgents" class="q-pt-xs">
                    <q-btn
                      flat
                      dense
                      color="primary"
                      icon="add_circle_outline"
                      label="Show all agents to add"
                      @click="loadAllAgents(true)"
                    />
                  </div>
                </template>
                <div
                  v-else
                  class="column items-center q-pa-md"
                >
                  <span class="text-grey-7 text-body2 q-mb-sm">
                    {{ selectedUngroupedAgents ? "No agents loaded." : "No agents in this category." }}
                  </span>
                  <q-btn
                    v-if="!selectedUngroupedAgents"
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label="Show all agents to add"
                    @click="loadAllAgents(true)"
                  />
                </div>
              </div>
              <div v-else class="text-grey-7 text-body2 q-pa-md">
                Select a category or "All agents" to see agents.
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="agentsOnly">
          <div v-if="agentsPanelLoading" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="2em" />
          </div>
          <q-scroll-area
            v-else-if="agentsPanelList.length > 0"
            style="height: min(400px, 55vh)"
            class="rounded-borders"
          >
            <q-list bordered separator>
              <q-item
                v-for="item in agentsPanelList"
                :key="item.agentId"
                v-ripple
                clickable
                :active="selectedAgentInPanel === item.agentId"
                active-class="bg-primary-1"
                @click="selectAgentInPanel(selectedAgentInPanel === item.agentId ? null : item.agentId)"
              >
                <q-item-section avatar>
                  <q-icon name="computer" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption>{{ item.agentId }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
          <div
            v-else
            class="text-grey-7 text-body2 q-pa-md"
          >
            No agents loaded.
          </div>
        </template>
        <div
          v-else-if="!agentsOnly && !targetTreeLoading"
          class="text-grey-7 text-body2 q-pa-md"
        >
          No categories loaded.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="OK"
          :disable="!canApplyInDialog"
          @click="handleApply"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
  canApplyTarget,
  getTargetNodeIcon,
  onDialogShow,
  applyTargetSelection,
  buildTargetForApply,
  currentTargetRef,
  selectedCategoryId,
  selectedUngroupedAgents,
  agentsPanelList,
  agentsPanelLoading,
  agentsInCategoryIds,
  selectedAgentInPanel,
  loadAllAgents,
  selectAgentInPanel,
} = useTargetSelection();

const agentsInCategory = computed(() =>
  agentsPanelList.value.filter((a) => agentsInCategoryIds.value.has(a.agentId)),
);
const agentsOthers = computed(() =>
  agentsPanelList.value.filter((a) => !agentsInCategoryIds.value.has(a.agentId)),
);

const canApplyInDialog = computed(() =>
  props.agentsOnly ? selectedAgentInPanel.value != null : canApplyTarget.value,
);

function onShow() {
  onDialogShow();
  if (props.agentsOnly) {
    loadAllAgents();
  }
}

function handleApply() {
  if (props.agentsOnly) {
    const ref = buildTargetForApply();
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
  min-width: 960px
  max-width: 90vw

.target-dialog-columns
  gap: 16px

.target-dialog-tree
  min-width: 220px
  max-width: 50%

.target-dialog-agents
  min-width: 240px
  border-left: 1px solid rgba(0, 0, 0, 0.12)
  padding-left: 12px

.target-tree
  :deep(.q-tree__node-header)
    border-radius: 4px
</style>
