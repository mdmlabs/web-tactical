<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="apply-collection-card" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Remove collection from group</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          Group: <strong>{{ groupSam }}</strong>
        </div>
        <q-select
          v-model="selectedId"
          :options="options"
          option-value="id"
          option-label="label"
          emit-value
          map-options
          label="Collection to remove *"
          outlined
          dense
          :disable="options.length === 0"
          clearable
          options-dense
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No applied collections to remove
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="negative"
          label="Remove"
          :loading="loading"
          :disable="selectedId == null"
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
    groupSam: string;
    options: { id: number; label: string }[];
    loading?: boolean;
  }>(),
  { loading: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  remove: [collectionId: number];
}>();

const selectedId = ref<number | null>(null);

watch(
  () => props.modelValue,
  (open) => {
    if (open) selectedId.value = null;
  },
  { immediate: true },
);

function submit() {
  if (selectedId.value != null) {
    emit("remove", selectedId.value);
  }
}
</script>
