<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 500px; max-width: 600px; max-height: 80vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Manage Child Groups</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div class="text-body2 text-grey-7 q-mb-md">
          Select groups that should be children of
          <strong>{{ parentGroupName }}</strong>
        </div>

        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Search groups..."
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="searchQuery">
            <q-icon
              name="close"
              class="cursor-pointer"
              @click="searchQuery = ''"
            />
          </template>
        </q-input>

        <div class="text-caption text-grey-6 q-mb-xs">
          Selected: {{ selectedGroupIds.length }} group(s)
        </div>

        <q-scroll-area style="height: 400px" class="bordered">
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
.bordered {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
