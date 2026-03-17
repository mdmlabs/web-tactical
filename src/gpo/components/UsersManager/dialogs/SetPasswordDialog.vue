<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 360px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Set Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          User: <strong>{{ userId }}</strong>
        </div>
        <q-input
          v-model="password"
          type="password"
          label="New password *"
          outlined
          dense
          autofocus
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Set"
          :loading="loading"
          :disable="!password.trim()"
          @click="handleSet"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  userId: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  set: [password: string];
}>();

const loading = ref(false);
const password = ref("");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) password.value = "";
  },
);

function handleSet() {
  emit("set", password.value);
}

defineExpose({ loading });
</script>
