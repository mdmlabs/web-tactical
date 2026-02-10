<template>
  <div class="policy-element">
    <div class="text-subtitle2 q-mb-xs">
      {{ fieldLabel }}
    </div>
    <div v-if="element.description" class="text-caption text-grey-7 q-mb-sm">
      {{ element.description }}
    </div>

    <q-toggle
      v-if="isCheckboxType(element)"
      :model-value="(modelValue as boolean) ?? false"
      @update:model-value="emit('update:modelValue', $event)"
      color="primary"
    />

    <q-input
      v-else-if="isTextType(element) && !isMultitextType(element)"
      :model-value="String(modelValue ?? '')"
      @update:model-value="emit('update:modelValue', $event)"
      :maxlength="maxLength"
      type="text"
      outlined
      dense
    />

    <q-input
      v-else-if="isMultitextType(element)"
      :model-value="String(modelValue ?? '')"
      @update:model-value="emit('update:modelValue', $event)"
      :maxlength="maxLength"
      type="textarea"
      :rows="3"
      outlined
      dense
    />

    <q-input
      v-else-if="isNumericType(element)"
      :model-value="safeNumber(modelValue, minValue)"
      @update:model-value="emit('update:modelValue', $event)"
      type="number"
      :min="minValue != null && Number.isFinite(Number(minValue)) ? Number(minValue) : undefined"
      :max="maxValue != null && Number.isFinite(Number(maxValue)) ? Number(maxValue) : undefined"
      :step="isDecimalNumeric(element) ? 0.01 : 1"
      outlined
      dense
    />

    <q-select
      v-else-if="isDropdownListType(element)"
      :model-value="modelValue ?? null"
      @update:model-value="emit('update:modelValue', $event)"
      :options="element.items || []"
      option-label="display_name"
      option-value="id"
      :hint="selectHint"
      outlined
      dense
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ optionLabel(scope.opt) }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <MultiTextBox
      v-else-if="isListboxEmptyType(element)"
      :model-value="(modelValue as string[]) || []"
      @update:model-value="emit('update:modelValue', $event)"
      :hint="selectHint"
      :maxlength="maxLength"
    />

    <q-select
      v-else-if="isMultiSelectType(element)"
      :model-value="(modelValue as unknown[]) ?? []"
      @update:model-value="emit('update:modelValue', $event)"
      :options="element.items || []"
      option-label="display_name"
      option-value="id"
      multiple
      use-chips
      use-input
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add"
      :hint="selectHint"
      outlined
      dense
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ optionLabel(scope.opt) }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-input
      v-else
      :model-value="String(modelValue ?? '')"
      @update:model-value="emit('update:modelValue', $event)"
      outlined
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MultiTextBox from "@/components/ui/MultiTextBox.vue";
import { getElementKey, isCheckboxType, isDecimalNumeric, isDropdownListType, isListboxEmptyType, isMultiSelectType, isMultitextType, isNumericType, isTextType, PolicyElementLike } from "@/gpo/utils/policy-field-types";



const props = defineProps<{
  element: PolicyElementLike & { description?: string; items?: Array<{ id: number; name: string; display_name?: string; displayName?: string }> };
  modelValue: unknown;
}>();

const emit = defineEmits<{ "update:modelValue": [value: unknown] }>();

const fieldLabel = computed(() =>
  (props.element as { display_name?: string; displayName?: string }).display_name ??
  (props.element as { display_name?: string; displayName?: string }).displayName ??
  getElementKey(props.element),
);

const maxLength = computed((): number | undefined => {
  const raw = props.element.maxLength ?? props.element.max_length;
  if (raw == null) return undefined;
  const n = typeof raw === "object" ? undefined : Number(raw);
  return n != null && Number.isFinite(n) ? n : undefined;
});
const minValue = computed(() => props.element.minValue ?? props.element.min_value);
const maxValue = computed(() => props.element.maxValue ?? props.element.max_value);
const valueType = computed(() => props.element.valueType ?? (props.element as { value_type?: string }).value_type);

const selectHint = computed(() =>
  valueType.value ? `Value type: ${valueType.value}` : "",
);

function optionLabel(opt: { display_name?: string; displayName?: string; name?: string; id?: number }): string {
  return opt.display_name ?? opt.displayName ?? opt.name ?? `Value ${opt.id ?? ""}`;
}

function safeNumber(val: unknown, fallback: number | undefined): number {
  if (val === null || val === undefined) return fallback ?? 0;
  const n = Number(val);
  return Number.isFinite(n) ? n : (fallback ?? 0);
}
</script>
