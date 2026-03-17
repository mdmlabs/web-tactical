<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Category</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="nameModel"
          label="Category Name *"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="descriptionModel"
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
          label="Save"
          :loading="loading"
          :disable="!nameModel.trim()"
          @click="$emit('save')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
  name: string;
  description: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  show: [];
  save: [];
  "update:name": [value: string];
  "update:description": [value: string];
}>();

const nameModel = computed({
  get: () => props.name,
  set: (v) => emit("update:name", v),
});

const descriptionModel = computed({
  get: () => props.description,
  set: (v) => emit("update:description", v),
});
</script>
