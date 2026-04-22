<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="slide-up"
    transition-hide="slide-down"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="manage-child-groups-dialog">
      <q-card-section class="manage-child-groups-dialog__header">
        <div class="row items-center no-wrap">
          <q-icon name="account_tree" size="28px" color="primary" class="q-mr-sm" />
          <div class="col">
            <div class="text-h6">Manage Child Groups</div>
            <div class="text-caption text-grey-7 ellipsis">
              Select groups that should be children of <strong>{{ parentGroupName }}</strong>
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="manage-child-groups-dialog__body">

        <q-input
          v-model="searchQuery"
          outlined
          dense
          clearable
          placeholder="Search groups..."
          class="q-mb-md"
          @update:model-value="searchQuery = String($event ?? '')"
          @clear="searchQuery = ''"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="text-caption text-grey-6 q-mb-xs">
          Selected: {{ selectedGroupIds.length }} group(s)
        </div>

        <q-scroll-area
          class="manage-child-groups-dialog__list bordered"
          style="height: 350px"
        >
          <q-list>
            <q-item
              v-for="group in filteredGroups"
              :key="group.groupId"
              tag="label"
              clickable
              :disable="group.groupId === parentGroupId"
            >
              <q-item-section side>
                <q-checkbox
                  :model-value="selectedGroupIds.includes(group.groupId)"
                  :disable="group.groupId === parentGroupId"
                  @update:model-value="toggleGroup(group.groupId)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ group.label }}</q-item-label>
                <q-item-label caption v-if="group.groupId === parentGroupId">
                  Cannot add group to itself
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="filteredGroups.length === 0">
              <q-item-section class="text-grey-6 text-center">
                No groups found
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Save"
          :loading="loading"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    loading?: boolean;
    parentGroupId: string;
    parentGroupName: string;
    availableGroups: { groupId: string; label: string }[];
    initialSelectedIds: string[];
  }>(),
  {
    loading: false,
    initialSelectedIds: () => [],
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [groupIds: string[]];
}>();

const searchQuery = ref("");
const selectedGroupIds = ref<string[]>([]);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedGroupIds.value = [...props.initialSelectedIds];
      searchQuery.value = "";
    }
  },
  { immediate: true },
);

const filteredGroups = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.availableGroups;

  return props.availableGroups.filter((group) =>
    group.label.toLowerCase().includes(query),
  );
});

function toggleGroup(groupId: string) {
  const index = selectedGroupIds.value.indexOf(groupId);
  if (index > -1) {
    selectedGroupIds.value.splice(index, 1);
  } else {
    selectedGroupIds.value.push(groupId);
  }
}

function submit() {
  emit("save", selectedGroupIds.value);
}
</script>

<style scoped>
.manage-child-groups-dialog {
  width: min(700px, 60vw);
  max-width: 60vw;
  max-height: min(780px, 88vh);
  display: flex;
  flex-direction: column;
}

.manage-child-groups-dialog__header {
  padding: 14px 16px;
}

.manage-child-groups-dialog__body {
  padding: 16px;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.manage-child-groups-dialog__list {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

.bordered {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.body--dark .bordered {
  border-color: rgba(255, 255, 255, 0.12);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
