<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 480px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Upload configuration file</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-select
          v-model="target"
          :options="targetOptions"
          label="Target"
          outlined
          dense
          emit-value
          map-options
        />
        <q-select
          v-model="category"
          :options="categoryOptions"
          label="Category"
          outlined
          dense
          emit-value
          map-options
        />
        <q-file
          v-model="file"
          label="File"
          outlined
          dense
          accept=".xml,.cmd,.ps1,.py,.bat,.txt"
          :max-file-size="1024 * 1024"
          @rejected="onFileRejected"
        >
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <div class="cywm-modal__hint">
          Max size: 1MB &middot; XML, CMD, PS1, PY, BAT
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="Upload"
          :disable="!canSubmit"
          :loading="loading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useCywmStore } from "@/stores/cywm";
import { notifySuccess, notifyError } from "@/utils/notify";
import type { FileCategory, FileTarget } from "@/cywm/types";

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const store = useCywmStore();
const target = ref<FileTarget>("manager");
const category = ref<FileCategory>("rules");
const file = ref<File | null>(null);
const loading = ref(false);

const targetOptions = [
  { label: "Wazuh manager", value: "manager" },
  { label: "Windows agent", value: "windows-agent" },
];

const categoryOptions = computed(() => {
  if (target.value === "windows-agent") {
    return [{ label: "active-response", value: "active-response" }];
  }
  return [
    { label: "rules", value: "rules" },
    { label: "decoders", value: "decoders" },
    { label: "ossec-snippets", value: "ossec-snippets" },
    { label: "shared (group/agent.conf)", value: "shared" },
  ];
});

const canSubmit = computed(() => !!file.value);

function onFileRejected() {
  notifyError("File too large (max 1MB) or unsupported type");
}

async function onSubmit() {
  if (!file.value) return;
  loading.value = true;
  try {
    const form = new FormData();
    form.set("target", target.value);
    form.set("category", category.value);
    form.set("file", file.value);
    const created = await store.uploadFile(form);
    notifySuccess(`Uploaded ${created.filename}`);
    onDialogOK(created);
  } catch (e) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.cywm-modal__hint {
  font-size: 12px;
  color: #69707d;
  margin-top: -8px;
}
</style>
