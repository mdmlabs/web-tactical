<template>
  <q-btn-dropdown
    flat
    no-caps
    icon="description"
    label="Generate Report"
    class="gen-report-btn"
    :disable="disable"
    split
    @click="onQuickClick"
  >
    <q-list>
      <q-item clickable v-close-popup @click="onCreateReport">
        <q-item-section avatar>
          <q-icon name="note_add" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Create new report…</q-item-label>
          <q-item-label caption>Pre-fills current filters</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="onOpenReportsManager">
        <q-item-section avatar>
          <q-icon name="folder_open" />
        </q-item-section>
        <q-item-section>
          <q-item-label>My reports</q-item-label>
          <q-item-label caption>Browse, download, manage</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import ReportForm from "@/reports/components/ReportForm.vue";
import ReportsManager from "@/reports/components/ReportsManager.vue";

export interface ReportContextFilters {
  site_id?: number | string | null;
  agent_ids?: (string | number)[];
  date_from?: string | null;
  date_to?: string | null;
}

export interface ReportContext {
  scope: string;
  name?: string;
  sourceType?: "HEALTH" | "APPLIED_POLICIES";
  filters?: ReportContextFilters;
}

const props = withDefaults(
  defineProps<{
    context?: ReportContext | null;
    contextProvider?: () => ReportContext | null;
    disable?: boolean;
  }>(),
  { context: null, contextProvider: undefined, disable: false },
);

const $q = useQuasar();

function resolveContext(): ReportContext {
  const ctx = props.contextProvider ? props.contextProvider() : props.context;
  return ctx ?? { scope: "report", filters: {} };
}

function onQuickClick() {
  onCreateReport();
}

function onCreateReport() {
  const ctx = resolveContext();
  $q.dialog({
    component: ReportForm,
    componentProps: {
      initialName: ctx.name ?? defaultName(ctx.scope),
      initialSourceType: ctx.sourceType ?? "HEALTH",
      initialFilters: ctx.filters ?? {},
    },
  });
}

function onOpenReportsManager() {
  $q.dialog({
    component: ReportsManager,
  });
}

function defaultName(scope: string) {
  const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  const label = scope.charAt(0).toUpperCase() + scope.slice(1);
  return `${label} report – ${stamp}`;
}
</script>

<style scoped>
.gen-report-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
}

.body--dark .gen-report-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}
</style>
