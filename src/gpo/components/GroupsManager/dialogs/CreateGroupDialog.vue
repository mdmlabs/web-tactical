<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create Group</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="form.samGroupName"
          label="Group Name *"
          outlined
          dense
          class="q-mb-sm"
          autofocus
        />
        <q-select
          v-model="form.parentId"
          :options="parentGroupOptions"
          option-value="groupId"
          option-label="label"
          emit-value
          map-options
          label="Parent Group"
          outlined
          dense
          clearable
          class="q-mb-sm"
          :disable="parentGroupOptions.length === 0"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No groups available
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="form.description"
          label="Description"
          outlined
          dense
          type="textarea"
          rows="2"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Create"
          :loading="loading"
          :disable="!form.samGroupName.trim()"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    loading?: boolean;
    parentGroupOptions: { groupId: string; label: string }[];
    initialParentId?: string | null;
  }>(),
  { loading: false, initialParentId: null },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  create: [payload: { samGroupName: string; description: string; parentId: string | null }];
}>();

const form = ref({
  samGroupName: "",
  description: "",
  parentId: null as string | null,
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = {
        samGroupName: "",
        description: "",
        parentId: props.initialParentId ?? null,
      };
    }
  },
  { immediate: true },
);

function submit() {
  emit("create", {
    samGroupName: form.value.samGroupName.trim(),
    description: form.value.description.trim() || "",
    parentId: form.value.parentId,
  });
}
</script>
