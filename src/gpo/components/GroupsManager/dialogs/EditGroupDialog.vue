<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Group</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="form.newSamGroupName"
          label="Group name (SAM) *"
          outlined
          dense
          class="q-mb-sm"
          autofocus
        />
        <q-input
          v-model="form.description"
          label="Description"
          outlined
          dense
          type="textarea"
          rows="2"
        />
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Limits</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              v-model.number="form.maxUsers"
              label="Max users"
              type="number"
              outlined
              dense
              :min="0"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="form.maxAgents"
              label="Max agents"
              type="number"
              outlined
              dense
              :min="0"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Save"
          :loading="loading"
          :disable="!form.newSamGroupName.trim()"
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
    initialSamGroupName: string;
    initialDescription?: string;
    initialMaxUsers?: number;
    initialMaxAgents?: number;
  }>(),
  {
    loading: false,
    initialDescription: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [
    payload: {
      newSamGroupName: string;
      description: string;
      maxUsers?: number;
      maxAgents?: number;
    },
  ];
}>();

const form = ref({
  newSamGroupName: "",
  description: "",
  maxUsers: null as number | null,
  maxAgents: null as number | null,
});

function resetForm() {
  form.value = {
    newSamGroupName: props.initialSamGroupName,
    description: props.initialDescription ?? "",
    maxUsers: props.initialMaxUsers ?? null,
    maxAgents: props.initialMaxAgents ?? null,
  };
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm();
  },
  { immediate: true },
);

watch(
  () => [props.initialMaxUsers, props.initialMaxAgents] as const,
  ([nextUsers, nextAgents]) => {
    if (!props.modelValue) return;
    if (form.value.maxUsers === null && nextUsers != null) {
      form.value.maxUsers = nextUsers;
    }
    if (form.value.maxAgents === null && nextAgents != null) {
      form.value.maxAgents = nextAgents;
    }
  },
  { immediate: true },
);

function submit() {
  const maxUsers = form.value.maxUsers;
  const maxAgents = form.value.maxAgents;
  emit("save", {
    newSamGroupName: form.value.newSamGroupName.trim(),
    description: form.value.description.trim(),
    maxUsers:
      maxUsers === null || maxUsers === undefined || Number.isNaN(maxUsers)
        ? undefined
        : maxUsers,
    maxAgents:
      maxAgents === null || maxAgents === undefined || Number.isNaN(maxAgents)
        ? undefined
        : maxAgents,
  });
}
</script>
