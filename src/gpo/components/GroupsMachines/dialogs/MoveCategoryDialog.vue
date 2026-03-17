<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Move to Category</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          New parent for «{{ categoryName }}»
        </div>
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
                >No parent (root)</q-item-section
              >
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Move"
          :loading="loading"
          @click="$emit('move')"
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
  categoryName: string;
  parentOptions: unknown[];
  parentId: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  move: [];
  "update:parentId": [value: number | null];
}>();

const parentIdModel = computed({
  get: () => props.parentId,
  set: (v) => emit("update:parentId", v),
});
</script>
