<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Link user to target</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div v-if="targetLabel" class="text-caption text-grey-7 q-mb-sm">
          Target: <strong>{{ targetLabel }}</strong>
        </div>
        <q-input
          v-model="form.password"
          type="password"
          label="Password (optional)"
          outlined
          dense
          autofocus
          class="q-mb-sm"
        />
        <div class="row q-gutter-sm">
          <q-checkbox
            v-model="form.passwordNotRequired"
            label="Password not required"
          />
          <q-checkbox
            v-model="form.userCannotChangePassword"
            label="User cannot change password"
          />
          <q-checkbox
            v-model="form.smartcardLogonRequired"
            label="Smartcard logon required"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Link"
          :loading="loading"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

export interface SetUserAgentOptions {
  password?: string;
  passwordNotRequired: boolean;
  userCannotChangePassword: boolean;
  smartcardLogonRequired: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    targetLabel?: string;
  }>(),
  { targetLabel: "" },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [options: SetUserAgentOptions];
}>();

const loading = ref(false);
const form = ref<SetUserAgentOptions>({
  password: "",
  passwordNotRequired: false,
  userCannotChangePassword: false,
  smartcardLogonRequired: false,
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      form.value = {
        password: "",
        passwordNotRequired: false,
        userCannotChangePassword: false,
        smartcardLogonRequired: false,
      };
    }
  },
);

function handleConfirm() {
  const opts: SetUserAgentOptions = {
    password: form.value.password?.trim() || undefined,
    passwordNotRequired: form.value.passwordNotRequired,
    userCannotChangePassword: form.value.userCannotChangePassword,
    smartcardLogonRequired: form.value.smartcardLogonRequired,
  };
  emit("confirm", opts);
  emit("update:modelValue", false);
}

defineExpose({ loading });
</script>
