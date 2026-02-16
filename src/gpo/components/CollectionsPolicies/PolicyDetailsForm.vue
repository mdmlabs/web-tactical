<template>
  <div v-if="loading" class="text-center q-pa-lg">
    <q-spinner color="primary" size="2em" />
    <div class="q-mt-sm">Loading settings...</div>
  </div>
  <EmptyState
    v-else-if="elements.length === 0"
    icon="info"
    message="No additional settings"
  />
  <div v-else class="policy-settings-form">
    <q-form>
      <div
        v-for="element in elements"
        :key="getElementKey(element)"
        class="q-mb-md"
      >
        <PolicyFieldRenderer
          :element="element"
          :model-value="settingsValues[getElementKey(element)]"
          @update:model-value="updateField(getElementKey(element), $event)"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import PolicyFieldRenderer from "./PolicyFieldRenderer.vue";
import { getElementKey } from "../../utils/policy-field-types";
import type { PolicyElementLike } from "../../utils/policy-field-types";

defineProps<{
  elements: (PolicyElementLike & {
    description?: string;
    items?: Array<{
      id: number;
      name: string;
      display_name?: string;
      displayName?: string;
    }>;
  })[];
  settingsValues: Record<string, unknown>;
  loading?: boolean;
}>();

const emit = defineEmits<{ "update:field": [key: string, value: unknown] }>();

function updateField(key: string, value: unknown) {
  emit("update:field", key, value);
}
</script>
