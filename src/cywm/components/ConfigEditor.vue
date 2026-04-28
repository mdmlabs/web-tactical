<template>
  <div class="cywm-editor">
    <div class="cywm-editor__toolbar">
      <div class="cywm-editor__path">
        <span class="cywm-editor__target">{{ targetLabel }}</span>
        <span class="cywm-editor__sep"> / {{ file.category }} / </span>
        <span class="cywm-editor__filename">
          {{ file.filename }}
          <span v-if="modified" class="cywm-editor__modified">●</span>
        </span>
      </div>
      <div class="cywm-editor__actions">
        <q-btn
          flat
          dense
          no-caps
          size="sm"
          icon="restart_alt"
          label="Reload"
          :disable="!modified"
          @click="$emit('reload')"
        />
        <q-btn
          flat
          dense
          no-caps
          size="sm"
          icon="delete"
          label="Delete"
          color="negative"
          @click="$emit('delete')"
        />
        <q-btn
          flat
          dense
          no-caps
          size="sm"
          icon="save"
          label="Save"
          :disable="!modified"
          @click="$emit('save')"
        />
        <q-btn
          unelevated
          dense
          no-caps
          size="sm"
          icon="rocket_launch"
          label="Save & Deploy"
          color="primary"
          @click="$emit('deploy')"
        />
      </div>
    </div>
    <div class="cywm-editor__body">
      <MonacoEditor
        :model-value="modelValue"
        :language="language"
        @update:model-value="(v) => $emit('update:modelValue', v)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MonacoEditor from "./MonacoEditor.vue";
import { categoryToLanguage, type ConfigFile } from "@/cywm/types";

const props = defineProps<{
  file: ConfigFile;
  modelValue: string;
  modified: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  save: [];
  deploy: [];
  reload: [];
  delete: [];
}>();

const language = computed(() =>
  categoryToLanguage(props.file.category, props.file.filename),
);

const targetLabel = computed(() =>
  props.file.target === "manager" ? "Manager" : "Windows agent",
);
</script>

<style lang="scss" scoped>
.cywm-editor {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.cywm-editor__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  border-bottom: 1px solid var(--cywm-border);
  background: var(--cywm-bg-table-header);
  gap: 12px;
  flex-shrink: 0;
}

.cywm-editor__path {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cywm-editor__target {
  color: var(--cywm-accent);
  font-weight: 500;
}

.cywm-editor__sep {
  color: var(--cywm-text-secondary);
}

.cywm-editor__filename {
  color: var(--cywm-text-primary);
  font-weight: 500;
  font-family: var(--cywm-mono);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cywm-editor__modified {
  color: var(--cywm-warning);
  font-size: 14px;
}

.cywm-editor__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.cywm-editor__body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
</style>
