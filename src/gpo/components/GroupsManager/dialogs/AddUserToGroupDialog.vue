<template>
  <q-dialog
    :model-value="modelValue"
    position="top"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 360px; margin-top: 60px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add User to Group</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          Group: <strong>{{ groupSam }}</strong>
        </div>
        <q-select
          v-model="selectedSam"
          :options="displayOptions"
          option-value="samAccountName"
          option-label="label"
          emit-value
          map-options
          label="User *"
          outlined
          dense
          use-input
          input-debounce="200"
          :loading="optionsLoading"
          :disable="optionsLoading"
          clearable
          menu-anchor="bottom left"
          menu-self="top left"
          popup-content-style="max-height: 220px; overflow-y: auto;"
          @filter="onFilter"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{
                  optionsLoading
                    ? "Loading..."
                    : displayOptions.length === 0
                      ? "No users available"
                      : "No match"
                }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Add"
          :loading="loading"
          :disable="!selectedSam"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

export interface AddUserOption {
  id: string;
  label: string;
  samAccountName: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    groupSam: string;
    options: AddUserOption[];
    optionsLoading: boolean;
    loading?: boolean;
  }>(),
  { loading: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  add: [samAccountName: string];
}>();

const selectedSam = ref("");
const displayOptions = ref<AddUserOption[]>([]);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedSam.value = "";
      displayOptions.value = [...props.options];
    }
  },
  { immediate: true },
);

watch(
  () => props.options,
  (opts) => {
    displayOptions.value = [...opts];
  },
  { deep: true },
);

function onFilter(val: string, update: (cb: () => void) => void) {
  update(() => {
    if (!val || !val.trim()) {
      displayOptions.value = [...props.options];
    } else {
      const lower = val.toLowerCase();
      displayOptions.value = props.options.filter(
        (o) =>
          o.label.toLowerCase().includes(lower) ||
          o.samAccountName.toLowerCase().includes(lower),
      );
    }
  });
}

function submit() {
  if (selectedSam.value) {
    emit("add", selectedSam.value.trim());
  }
}
</script>
