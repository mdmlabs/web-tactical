<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create Category</div>
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
          autofocus
        />
        <q-select
          v-model="parentIdModel"
          :options="parentOptions"
          option-value="categoryId"
          option-label="label"
          emit-value
          map-options
          label="Parent Category"
          outlined
          dense
          clearable
          class="q-mb-sm"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >No parent (root category)</q-item-section
              >
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="descriptionModel"
          label="Description"
          outlined
          dense
          type="textarea"
          rows="2"
        />
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Limits</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input
              v-model.number="maxAgentsModel"
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
          label="Create"
          :loading="loading"
          :disable="!nameModel.trim()"
          @click="$emit('create')"
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
  parentOptions: unknown[];
  name: string;
  description: string;
  parentId: number | null;
  maxAgents: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  create: [];
  "update:name": [value: string];
  "update:description": [value: string];
  "update:parentId": [value: number | null];
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

const parentIdModel = computed({
  get: () => props.parentId,
  set: (v) => emit("update:parentId", v),
});

const maxAgentsModel = computed({
  get: () => props.maxAgents,
  set: (v) => emit("update:maxAgents", v),
});
</script>
