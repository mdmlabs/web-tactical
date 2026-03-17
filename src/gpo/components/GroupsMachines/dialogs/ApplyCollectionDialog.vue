<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="$emit('show')"
  >
    <q-card class="apply-collection-card" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Apply collection to category</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          Category: <strong>{{ categoryLabel }}</strong>
        </div>
        <q-select
          v-model="selectedId"
          :options="options"
          option-value="id"
          option-label="label"
          emit-value
          map-options
          label="Collection *"
          outlined
          dense
          :loading="loading"
          :disable="loading"
          clearable
          options-dense
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ loading ? "Loading..." : "No collections available" }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Apply"
          :loading="applying"
          :disable="selectedId == null"
          @click="$emit('apply', selectedId as number)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
  categoryLabel: string;
  loading: boolean;
  applying: boolean;
  options: Array<{ id: number; label: string }>;
  modelSelectedId: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  show: [];
  "update:selectedId": [value: number | null];
  apply: [collectionId: number];
}>();

const selectedId = computed({
  get: () => props.modelSelectedId,
  set: (v) => emit("update:selectedId", v),
});
</script>
