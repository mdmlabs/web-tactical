<template>
  <div class="multi-textbox">
    <div class="text-subtitle2 q-mb-xs" v-if="label">
      {{ label }}
    </div>
    <div class="text-caption text-grey-7 q-mb-sm" v-if="hint">
      {{ hint }}
    </div>

    <div
      v-if="items.length === 0"
      class="text-grey-6 text-body2 q-mb-sm"
      style="min-height: 40px; display: flex; align-items: center"
    >
      No items
    </div>

    <div v-else class="items-list q-mb-sm">
      <div v-for="(item, index) in items" :key="index" class="item-row q-mb-sm">
        <q-input
          :model-value="item"
          @update:model-value="updateItem(index, $event)"
          outlined
          dense
          :maxlength="maxlength"
          class="item-input"
        >
          <template v-slot:append>
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              size="sm"
              @click="removeItem(index)"
              class="q-ml-xs"
            />
          </template>
        </q-input>
      </div>
    </div>

    <q-btn
      flat
      dense
      icon="add"
      label="Add item"
      color="primary"
      size="sm"
      @click="addItem"
      class="add-button"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: string[];
  label?: string;
  hint?: string;
  maxlength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: "",
  hint: "",
  maxlength: undefined,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const items = ref<string[]>([...props.modelValue]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(items.value)) {
      items.value = [...newValue];
    }
  },
  { deep: true },
);

function updateItem(index: number, value: string | null) {
  items.value[index] = value || "";
  emit("update:modelValue", [...items.value]);
}

function removeItem(index: number) {
  items.value.splice(index, 1);
  emit("update:modelValue", [...items.value]);
}

function addItem() {
  items.value.push("");
  emit("update:modelValue", [...items.value]);
}
</script>

<style scoped lang="sass">
.multi-textbox
  width: 100%

.items-list
  width: 100%

.item-row
  display: flex
  align-items: center
  width: 100%

.item-input
  flex: 1

.add-button
  margin-top: 8px
</style>
