<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">
          {{ isEdit && props.policy?.id ? "Редактировать политику" : "Создать политику" }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Имя политики *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            outlined
            dense
          />

          <q-input
            v-model="form.displayName"
            label="Отображаемое имя"
            outlined
            dense
          />

          <q-input
            v-model="form.description"
            label="Описание"
            type="textarea"
            outlined
            dense
            rows="3"
          />

          <q-input
            v-model="form.path"
            label="Путь (опционально)"
            outlined
            dense
            hint="Путь в Active Directory"
          />

          <q-toggle v-if="isEdit" v-model="form.enabled" label="Включена" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn
          flat
          label="Сохранить"
          color="primary"
          @click="onSubmit"
          :loading="isLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";

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

const form = ref<CreateGPOPolicyRequest & { enabled?: boolean }>({
  name: "",
  displayName: "",
  description: "",
  path: "",
  enabled: true,
});

watch(
  () => props.policy,
  (policy) => {
    if (policy) {
      form.value = {
        name: policy.name,
        displayName: policy.displayName,
        description: policy.description || "",
        path: policy.path,
        enabled: policy.enabled,
      };
    } else {
      form.value = {
        name: "",
        displayName: "",
        description: "",
        path: "",
        enabled: true,
      };
    }
  },
  { immediate: true },
);

const onSubmit = () => {
  if (isEdit.value && props.policy) {
    const updateData: UpdateGPOPolicyRequest = {
      displayName: form.value.displayName,
      description: form.value.description,
      enabled: form.value.enabled,
    };
    emit("submit", updateData);
  } else {
    const createData: CreateGPOPolicyRequest = {
      name: form.value.name,
      displayName: form.value.displayName,
      description: form.value.description,
      path: form.value.path,
    };
    emit("submit", createData);
  }
};
</script>
