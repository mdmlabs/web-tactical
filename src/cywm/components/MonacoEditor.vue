<template>
  <div ref="container" class="cywm-monaco"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    language?: string;
    readonly?: boolean;
  }>(),
  {
    language: "plaintext",
    readonly: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const $q = useQuasar();
const container = ref<HTMLElement | null>(null);
const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null);
const modelRef = shallowRef<monaco.editor.ITextModel | null>(null);
let suppressEmit = false;

function currentTheme(): string {
  return $q.dark.isActive ? "vs-dark" : "vs";
}

function createModelFor(value: string, language: string) {
  const model = monaco.editor.createModel(value, language);
  modelRef.value = model;
  return model;
}

function disposeModel() {
  if (modelRef.value) {
    modelRef.value.dispose();
    modelRef.value = null;
  }
}

onMounted(() => {
  if (!container.value) return;
  const model = createModelFor(props.modelValue, props.language);
  const editor = monaco.editor.create(container.value, {
    model,
    theme: currentTheme(),
    readOnly: props.readonly,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    tabSize: 2,
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
  });
  editorRef.value = editor;

  editor.onDidChangeModelContent(() => {
    if (suppressEmit) return;
    emit("update:modelValue", editor.getValue());
  });
});

watch(
  () => props.modelValue,
  (next) => {
    const editor = editorRef.value;
    if (!editor) return;
    if (editor.getValue() === next) return;
    suppressEmit = true;
    editor.setValue(next);
    suppressEmit = false;
  },
);

watch(
  () => props.language,
  (next) => {
    const model = modelRef.value;
    if (!model) return;
    monaco.editor.setModelLanguage(model, next);
  },
);

watch(
  () => props.readonly,
  (next) => {
    editorRef.value?.updateOptions({ readOnly: next });
  },
);

watch(
  () => $q.dark.isActive,
  () => {
    monaco.editor.setTheme(currentTheme());
  },
);

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.dispose();
    editorRef.value = null;
  }
  disposeModel();
});
</script>

<style scoped>
.cywm-monaco {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
