<template>
  <q-dialog :model-value="show" @update:model-value="$emit('close')" maximized>
    <q-card class="single-doc-card">
      <!-- Header -->
      <div class="single-doc-header">
        <div class="single-doc-header-left">
          <q-btn flat round dense icon="arrow_back" size="sm" @click="$emit('close')" />
          <q-icon name="explore" size="20px" color="primary" class="q-mx-sm" />
          <span class="single-doc-breadcrumb">Discover</span>
          <span class="single-doc-separator">|</span>
          <span class="single-doc-index">
            {{ event?._index }}#{{ event?._id?.substring(0, 12) }}
          </span>
        </div>
        <q-btn flat round dense icon="close" size="sm" @click="$emit('close')" />
      </div>

      <!-- Actions bar -->
      <div class="single-doc-actions">
        <q-btn
          flat dense no-caps size="sm"
          class="text-primary"
          @click="$emit('view-surrounding', event)"
        >
          View surrounding documents
          <q-icon name="open_in_new" size="14px" class="q-ml-xs" />
        </q-btn>
      </div>

      <q-inner-loading :showing="loading" />

      <!-- Document content -->
      <div v-if="!loading && document" class="single-doc-content">
        <doc-fields-table
          :source="documentSource"
          :index="documentIndex"
        />
      </div>

      <div v-if="!loading && !document" class="single-doc-empty">
        <q-icon name="info_outline" size="32px" color="orange" />
        <span class="q-ml-md">Document not found</span>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SCAEvent } from "@/stores/sca";
import DocFieldsTable from "./SCADocFieldsTable.vue";

const props = defineProps<{
  show: boolean;
  event: SCAEvent | null;
  document: Record<string, unknown> | null;
  loading: boolean;
}>();

defineEmits<{
  close: [];
  "view-surrounding": [event: SCAEvent | null];
}>();

const documentSource = computed(() => {
  if (!props.document) return {};
  return (props.document._source as Record<string, unknown>) ?? {};
});

const documentIndex = computed(() => {
  if (!props.document) return "";
  return (props.document._index as string) ?? "";
});
</script>

<style scoped>
.single-doc-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--mdm-bg, #f5f6fa);
}

.single-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.single-doc-header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.single-doc-breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-primary, #1976d2);
}

.single-doc-separator {
  color: var(--mdm-text-secondary, #666);
  margin: 0 8px;
}

.single-doc-index {
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
  font-family: "SF Mono", "Fira Code", monospace;
}

.single-doc-actions {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  gap: 8px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  background: var(--mdm-bg-card, #fff);
}

.single-doc-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.single-doc-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--mdm-text-secondary, #666);
  font-size: 16px;
}

/* Dark mode */
.body--dark .single-doc-card {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .single-doc-header,
.body--dark .single-doc-actions {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .single-doc-index {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
