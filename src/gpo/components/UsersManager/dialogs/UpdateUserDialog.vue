<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 480px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Update User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-sm" style="max-height: 70vh; overflow: auto">
        <div class="text-caption text-grey-7 q-mb-sm">
          User: <strong>{{ userId }}</strong>
        </div>
        <q-input
          v-model="form.samAccountName"
          label="SAM Account Name"
          outlined
          dense
          class="q-mb-sm"
        />
        <q-input
          v-model="form.password"
          type="password"
          label="Password"
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
        <q-input v-model="form.employeeId" label="Employee ID" outlined dense />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Update"
          :loading="loading"
          @click="handleUpdate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { UserWithIdInfo } from "@/generated/user_service_pb";
import type { CreateUserParams } from "@/gpo/composables/useUserActions";

const props = defineProps<{
  modelValue: boolean;
  userId: string | null;
  user: UserWithIdInfo.AsObject | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  update: [params: Partial<CreateUserParams>];
}>();

const loading = ref(false);

const form = ref<Partial<CreateUserParams>>({
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
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.user) {
      const info = props.user.info;
      form.value = {
        samAccountName: info?.samaccountname ?? props.userId ?? "",
        password: "",
        displayName: info?.displayname ?? "",
        description: info?.description ?? "",
        enabled: info?.isenabled !== false,
        passwordNotRequired: false,
        userCannotChangePassword: false,
        smartcardLogonRequired: false,
        accountExpirationDate: "",
        name: info?.name || "",
        middleName: info?.middlename ?? "",
        surname: info?.surname ?? "",
        email: info?.email ?? "",
        homeDirectory: info?.homedirectory ?? "",
        scriptPath: info?.scriptpath ?? "",
        telephoneNumber: info?.telephonenumber ?? "",
        employeeId: info?.employeeid ?? "",
      };
    }
  },
);

function handleUpdate() {
  emit("update", { ...form.value });
}

defineExpose({ loading });
</script>
