<template>
  <div ref="container" class="cywm-monaco"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from "vue";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";
import YAML from "yaml";

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
let validateTimer: ReturnType<typeof setTimeout> | null = null;

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

function validateYaml(content: string) {
  const model = modelRef.value;
  if (!model || props.language !== "yaml") {
    if (model) monaco.editor.setModelMarkers(model, "yaml", []);
    return;
  }

  try {
    YAML.parse(content, { strict: true });
    monaco.editor.setModelMarkers(model, "yaml", []);
  } catch (e: unknown) {
    const markers: monaco.editor.IMarkerData[] = [];
    if (e instanceof YAML.YAMLParseError) {
      const pos = e.linePos;
      const startLine = pos?.[0]?.line ?? 1;
      const startCol = pos?.[0]?.col ?? 1;
      const endLine = pos?.[1]?.line ?? startLine;
      const endCol = pos?.[1]?.col ?? startCol;
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: e.message.split("\n")[0],
        startLineNumber: startLine,
        startColumn: startCol,
        endLineNumber: endLine,
        endColumn: endCol,
      });
    } else if (e instanceof Error) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: e.message,
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      });
    }
    monaco.editor.setModelMarkers(model, "yaml", markers);
  }
}

function scheduleValidation(content: string) {
  if (validateTimer) clearTimeout(validateTimer);
  validateTimer = setTimeout(() => validateYaml(content), 300);
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
    const value = editor.getValue();
    emit("update:modelValue", value);
    scheduleValidation(value);
  });

  // Initial validation
  if (props.language === "yaml" && props.modelValue) {
    scheduleValidation(props.modelValue);
  }
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
    if (next === "yaml") {
      scheduleValidation(editorRef.value?.getValue() ?? "");
    } else {
      monaco.editor.setModelMarkers(model, "yaml", []);
    }
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
  if (validateTimer) clearTimeout(validateTimer);
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
