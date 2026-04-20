<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="emit('show')"
  >
    <q-card class="edit-category-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Category</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="edit-category-card__body q-pt-sm">
        <q-input
          v-model="nameModel"
          label="Category Name *"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model.number="maxAgentsModel"
          label="Max agents"
          type="number"
          outlined
          dense
          class="q-mb-sm"
          :min="0"
          hint="Maximum agents allowed in this machine group"
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
  maxAgents: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  show: [];
  save: [];
  "update:name": [value: string];
  "update:description": [value: string];
  "update:maxAgents": [value: number | null];
}>();

const nameModel = computed({
  get: () => props.name,
  set: (v) => emit("update:name", v),
});

const descriptionModel = computed({
  get: () => props.description,
  set: (v) => emit("update:description", v),
});

const maxAgentsModel = computed({
  get: () => props.maxAgents,
  set: (v) => emit("update:maxAgents", v),
});
</script>

<style scoped lang="sass">
.edit-category-card
  min-width: 360px
  max-width: 480px
  max-height: min(90vh, 640px)
  display: flex
  flex-direction: column

.edit-category-card__body
  overflow-y: auto
  flex: 1 1 auto
  min-height: 0
</style>
