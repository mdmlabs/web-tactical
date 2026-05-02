<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="$emit('show')"
  >
    <q-card style="min-width: 360px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create Site</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="nameModel"
          label="Site Name *"
          outlined
          dense
          autofocus
          class="q-mb-sm"
        />
        <q-select
          v-model="parentModel"
          :options="parentOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          label="Parent Site"
          outlined
          dense
          clearable
          class="q-mb-sm"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No parent (root site)</q-item-section>
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
          class="q-mb-sm"
        />
        <q-input
          v-model.number="maxAgentsModel"
          label="Max Agents"
          type="number"
          outlined
          dense
          class="q-mb-sm"
          :min="0"
        />
        <OsVersionSelect
          v-model="osVersionModel"
        />
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
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
  name: string;
  description: string;
  parentId: number | null;
  maxAgents: number;
  osVersion: string;
  parentOptions: { label: string; value: number }[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update:name": [value: string];
  "update:description": [value: string];
  "update:parentId": [value: number | null];
  "update:maxAgents": [value: number];
  "update:osVersion": [value: string];
  show: [];
  create: [];
}>();

const nameModel = computed({
  get: () => props.name,
  set: (v) => emit("update:name", v),
});

const descriptionModel = computed({
  get: () => props.description,
  set: (v) => emit("update:description", v),
});

const parentModel = computed({
  get: () => props.parentId,
  set: (v) => emit("update:parentId", v),
});

const maxAgentsModel = computed({
  get: () => props.maxAgents,
  set: (v) => emit("update:maxAgents", v),
});

const osVersionModel = computed({
  get: () => props.osVersion,
  set: (v) => emit("update:osVersion", v ?? ""),
});
</script>
