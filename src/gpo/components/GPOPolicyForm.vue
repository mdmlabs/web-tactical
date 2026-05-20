<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card :style="isEdit ? 'min-width: 640px; max-width: 90vw' : 'min-width: 500px'">
      <q-card-section>
        <div class="text-h6">
          {{ isEdit && props.policy?.id ? "Edit policy" : "Create policy" }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="formLoading" class="text-center q-pa-lg">
          <q-spinner color="primary" size="2.5em" />
          <div class="q-mt-sm text-caption">Loading policy descriptor...</div>
        </div>

        <q-form v-else @submit="onSubmit" class="q-gutter-md">
          <template v-if="isEdit">
            <q-input
              v-model="editForm.hash"
              label="Hash"
              outlined
              dense
              readonly
              hint="Policy identifier (not editable)"
            />

            <q-input
              v-model="editForm.name"
              label="Name"
              outlined
              dense
            />

            <q-input
              v-model="editForm.displayName"
              label="Display name"
              outlined
              dense
            />

            <q-input
              v-model="editForm.explainText"
              label="Explain text"
              type="textarea"
              outlined
              dense
              rows="3"
            />

            <q-select
              v-model="editForm.scope"
              :options="scopeOptions"
              label="Scope"
              emit-value
              map-options
              outlined
              dense
            />

            <q-select
              v-model="editForm.policyStatus"
              :options="policyStatusOptions"
              label="Status"
              emit-value
              map-options
              outlined
              dense
            />

            <q-input
              v-model="editForm.registryKey"
              label="Registry key"
              outlined
              dense
            />

            <q-input
              v-model="editForm.valueName"
              label="Value name"
              outlined
              dense
            />

            <q-input
              v-model="editForm.enabledValue"
              label="Enabled value"
              outlined
              dense
            />

            <q-input
              v-model="editForm.disabledValue"
              label="Disabled value"
              outlined
              dense
            />

            <q-input
              v-model="editForm.supportedOnRef"
              label="Supported on ref"
              outlined
              dense
            />

            <q-input
              v-model="editForm.parentCategoryRef"
              label="Parent category ref"
              outlined
              dense
            />

            <q-input
              v-model="editForm.presentationRef"
              label="Presentation ref"
              outlined
              dense
            />

            <q-input
              v-model="editForm.clientExtension"
              label="Client extension"
              outlined
              dense
            />
          </template>

          <template v-else>
            <q-input
              v-model="createForm.name"
              label="Policy Name *"
              :rules="[(val) => !!val || 'Required field']"
              outlined
              dense
            />

            <q-input
              v-model="createForm.displayName"
              label="Display Name"
              outlined
              dense
            />

            <q-input
              v-model="createForm.description"
              label="Description"
              type="textarea"
              outlined
              dense
              rows="3"
            />

            <q-input
              v-model="createForm.path"
              label="Path (optional)"
              outlined
              dense
              hint="Path in Active Directory"
            />
          </template>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Save"
          color="primary"
          :disable="formLoading"
          :loading="isLoading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { policyCatalogClient } from "../api/grpc-client";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import {
  POLICY_STATUS_DRAFT,
  POLICY_STATUS_OPTIONS,
} from "../utils/policy-status";
import {
  POLICY_SCOPE_OPTIONS,
  descriptorToEditForm,
  editFormToUpdateRequest,
  mergeDetailsIntoEditForm,
  type PolicyEditFormData,
} from "../utils/policy-descriptor";

interface Props {
  modelValue: boolean;
  policy?: GPOPolicy;
  isLoading?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", data: CreateGPOPolicyRequest | UpdateGPOPolicyRequest): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<Emits>();

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isEdit = computed(() => !!props.policy && !!props.policy.id);

const policyStatusOptions = POLICY_STATUS_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));

const scopeOptions = POLICY_SCOPE_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));

const formLoading = ref(false);

const emptyEditForm = (): PolicyEditFormData => ({
  hash: "",
  name: "",
  displayName: "",
  explainText: "",
  scope: 0,
  registryKey: "",
  valueName: "",
  enabledValue: "",
  disabledValue: "",
  supportedOnRef: "",
  parentCategoryRef: "",
  presentationRef: "",
  clientExtension: "",
  policyStatus: POLICY_STATUS_DRAFT,
});

const editForm = ref<PolicyEditFormData>(emptyEditForm());

const createForm = ref<CreateGPOPolicyRequest>({
  name: "",
  displayName: "",
  description: "",
  path: "",
});

function extractHashFromDetails(response: unknown): string | null {
  const policy = (response as { policy?: Record<string, unknown> })?.policy;
  if (!policy) return null;
  const hash = policy.hash ?? policy.policy_hash ?? policy.policyHash;
  return typeof hash === "string" && hash.trim() ? hash.trim() : null;
}

async function resolvePolicyHash(policy: GPOPolicy): Promise<string> {
  if (policy.hash?.trim()) return policy.hash.trim();
  const idNum = Number.parseInt(policy.id, 10);
  if (Number.isNaN(idNum)) {
    throw new Error("Invalid policy id");
  }
  const details = await policyCatalogClient.getPolicyDetails(idNum, "en-US");
  const hash = extractHashFromDetails(details);
  if (!hash) throw new Error("Policy hash not found");
  return hash;
}

async function loadPolicyDescriptor(policy: GPOPolicy): Promise<void> {
  formLoading.value = true;
  try {
    const hash = await resolvePolicyHash(policy);
    const descriptor = (await policyCatalogClient.getPolicy(
      hash,
    )) as Record<string, unknown>;

    let form = descriptorToEditForm(descriptor, hash, {
      displayName: policy.displayName,
      explainText: policy.description ?? "",
      policyStatus: policy.policyStatus,
      scope: policy.scope,
    });

    const idNum = Number.parseInt(policy.id, 10);
    if (!Number.isNaN(idNum)) {
      try {
        const details = (await policyCatalogClient.getPolicyDetails(
          idNum,
          "en-US",
        )) as Record<string, unknown>;
        form = mergeDetailsIntoEditForm(form, details);
      } catch {
        //игнор
      }
    }

    editForm.value = form;
  } finally {
    formLoading.value = false;
  }
}

watch(
  () => [props.policy, props.modelValue] as const,
  ([policy, open]) => {
    if (!open) return;
    if (policy?.id) {
      void loadPolicyDescriptor(policy);
      return;
    }
    createForm.value = {
      name: "",
      displayName: "",
      description: "",
      path: "",
    };
    editForm.value = emptyEditForm();
  },
);

const onSubmit = () => {
  if (isEdit.value) {
    if (!editForm.value.hash) return;
    emit("submit", editFormToUpdateRequest(editForm.value));
    return;
  }
  emit("submit", { ...createForm.value });
};
</script>
