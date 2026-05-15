<template>
  <q-dialog v-model="open" persistent>
    <q-card style="min-width: 400px; max-width: 95vw">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none q-gutter-sm">
        <q-select
          v-model="draft.manufacturer"
          :options="manufacturerOptions"
          label="Manufacturer"
          dense
          outlined
          clearable
          emit-value
          map-options
          :loading="optionsLoading"
          :disable="optionsLoading"
        />
        <q-select
          v-model="draft.model"
          :options="modelOptions"
          label="Model"
          dense
          outlined
          clearable
          emit-value
          map-options
          :disable="!draft.manufacturer"
          :loading="optionsLoading"
        />
        <OsVersionSelect
          v-model="draft.minimalOsVersion"
          label="Minimum OS version"
        />
      </q-card-section>
      <q-card-actions align="between">
        <q-btn
          flat
          label="Clear all"
          color="negative"
          :disable="optionsLoading"
          @click="emit('clear-all')"
        />
        <div>
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Apply"
            color="primary"
            :loading="applyLoading"
            @click="emit('apply')"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";
import type { AgentListFilters } from "@/gpo/composables/useAgentListFilters";

withDefaults(
  defineProps<{
    title?: string;
    manufacturerOptions: Array<{ label: string; value: string }>;
    modelOptions: Array<{ label: string; value: string }>;
    optionsLoading?: boolean;
    applyLoading?: boolean;
  }>(),
  { title: "Filter" },
);

const open = defineModel<boolean>({ required: true });
const draft = defineModel<AgentListFilters>("draft", { required: true });

const emit = defineEmits<{
  apply: [];
  "clear-all": [];
}>();
</script>
