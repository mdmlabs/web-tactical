<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="$emit('show')"
  >
    <q-card style="min-width: 400px; margin-bottom: 250px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Set all agents</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          One agent ID per line. This replaces the current list.
        </div>
        <q-input
          v-model="agentIdsTextModel"
          outlined
          dense
          type="textarea"
          rows="6"
          placeholder="agent-id-1&#10;agent-id-2"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Set agents"
          :loading="loading"
          @click="$emit('set')"
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
  agentIdsText: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  show: [];
  set: [];
  "update:agentIdsText": [value: string];
}>();

const agentIdsTextModel = computed({
  get: () => props.agentIdsText,
  set: (v) => emit("update:agentIdsText", v),
});
</script>
