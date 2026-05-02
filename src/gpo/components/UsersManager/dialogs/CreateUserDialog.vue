<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 480px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section
        class="q-pt-sm"
        style="max-height: 70vh; overflow: auto"
      >
        <q-input
          v-model="form.samAccountName"
          label="SAM Account Name *"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.password"
          type="password"
          label="Password *"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.displayName"
          label="Display Name"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.description"
          label="Description"
          outlined
          dense
          class="q-mb-sm"
        />
        <div class="row q-gutter-sm q-mb-sm">
          <q-checkbox v-model="form.enabled" label="Enabled" />
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
        <q-input
          v-model="form.accountExpirationDate"
          label="Account expiration"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 text-grey-7 q-mb-sm">
          Supported local attributes
        </div>
        <q-input
          v-model="form.name"
          label="Name"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.middleName"
          label="Middle Name"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.surname"
          label="Surname"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.email"
          label="Email"
          outlined
          dense
          type="email"
          class="q-mb-sm"
        />
        <q-input
          v-model="form.telephoneNumber"
          label="Telephone"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.homeDirectory"
          label="Home Directory"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.scriptPath"
          label="Script Path"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.employeeId"
          label="Employee ID"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Limits</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              v-model.number="form.maxAgents"
              label="Max agents"
              type="number"
              outlined
              dense
              :min="0"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="form.maxPolicies"
              label="Max policies"
              type="number"
              outlined
              dense
              :min="0"
            />
          </div>
        </div>
        <OsVersionSelect
          v-model="minimalOsModel"
          label="Minimal OS version"
          class="q-mt-sm"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Create"
          :loading="loading"
          :disable="!canSubmit"
          @click="handleCreate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { CreateUserParams } from "@/gpo/composables/useUserActions";
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  create: [params: CreateUserParams];
}>();

const loading = ref(false);

const form = ref<CreateUserParams & { name?: string; middleName?: string }>({
  samAccountName: "",
  password: "",
  displayName: "",
  description: "",
  enabled: true,
  passwordNotRequired: false,
  userCannotChangePassword: false,
  smartcardLogonRequired: false,
  accountExpirationDate: "",
  name: "",
  middleName: "",
  surname: "",
  email: "",
  homeDirectory: "",
  scriptPath: "",
  telephoneNumber: "",
  employeeId: "",
  maxAgents: undefined,
  maxPolicies: undefined,
  minimalOsVersion: "",
});

const minimalOsModel = computed({
  get: () => form.value.minimalOsVersion ?? "",
  set: (v: string) => {
    form.value.minimalOsVersion = v;
  },
});

const canSubmit = computed(
  () =>
    form.value.samAccountName.trim() !== "" &&
    (form.value.password ?? "").trim() !== "",
);

function resetForm() {
  form.value = {
    samAccountName: "",
    password: "",
    displayName: "",
    description: "",
    enabled: true,
    passwordNotRequired: false,
    userCannotChangePassword: false,
    smartcardLogonRequired: false,
    accountExpirationDate: "",
    name: "",
    middleName: "",
    surname: "",
    email: "",
    homeDirectory: "",
    scriptPath: "",
    telephoneNumber: "",
    employeeId: "",
    maxAgents: undefined,
    maxPolicies: undefined,
    minimalOsVersion: "",
  };
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);

function handleCreate() {
  emit("create", { ...form.value });
}

defineExpose({ loading });
</script>
