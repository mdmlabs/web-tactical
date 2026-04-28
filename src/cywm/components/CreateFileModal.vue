<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 520px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create new configuration file</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-select
          v-model="templateId"
          :options="templateOptions"
          label="Template"
          outlined
          dense
          emit-value
          map-options
          @update:model-value="onTemplateChange"
        />
        <q-input
          v-model="filename"
          label="Filename"
          outlined
          dense
          :hint="filenameHint"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="Create"
          :disable="!canSubmit"
          :loading="loading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useCywmStore } from "@/stores/cywm";
import { fileTemplates } from "@/cywm/data/fixtures";
import { notifySuccess, notifyError } from "@/utils/notify";
import type { FileCategory, FileTarget } from "@/cywm/types";

const props = defineProps<{
  initialTarget?: FileTarget;
  initialCategory?: FileCategory;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const store = useCywmStore();

const templateOptions = fileTemplates.map((t) => ({
  label: `${t.label} (${t.target} / ${t.category})`,
  value: t.id,
}));

const templateId = ref<string>(fileTemplates[0].id);
const filename = ref<string>("");
const loading = ref(false);

const currentTemplate = computed(
  () =>
    fileTemplates.find((t) => t.id === templateId.value) ?? fileTemplates[0],
);

const filenameHint = computed(
  () => `Suggested: ${currentTemplate.value.filenameSuggestion}`,
);

const canSubmit = computed(() => filename.value.trim().length > 0);

function onTemplateChange() {
  filename.value = currentTemplate.value.filenameSuggestion;
}

onMounted(() => {
  // Если переданы initialTarget/Category — выбрать первый шаблон, подходящий под них
  if (props.initialTarget && props.initialCategory) {
    const match = fileTemplates.find(
      (t) =>
        t.target === props.initialTarget &&
        t.category === props.initialCategory,
    );
    if (match) {
      templateId.value = match.id;
    }
  }
  filename.value = currentTemplate.value.filenameSuggestion;
});

async function onSubmit() {
  loading.value = true;
  try {
    const tpl = currentTemplate.value;
    const created = await store.createFile({
      target: tpl.target,
      category: tpl.category,
      filename: filename.value.trim(),
      content: tpl.content,
    });
    notifySuccess(`Created ${created.filename}`);
    onDialogOK(created);
  } catch (e) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    loading.value = false;
  }
}
</script>
