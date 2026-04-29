<template>
  <div class="cywm-scope cywm-page">
    <div class="cywm-topbar">
      <div class="cywm-breadcrumb">
        <span class="cywm-breadcrumb__link">CYWM</span>
        <span class="cywm-breadcrumb__sep">/</span>
        <span>Deploy History</span>
      </div>
      <div class="cywm-topbar__spacer"></div>
      <div class="cywm-topbar__meta">
        Wazuh manager:&nbsp;<strong>v4.14.4</strong>
      </div>
      <div class="cywm-topbar__status">
        <span class="cywm-dot cywm-dot--ok"></span> API connected
      </div>
    </div>

    <div class="cywm-page__body">
      <div class="cywm-page-header">
        <div>
          <h1 class="cywm-title">
            Deploy History
            <span class="cywm-title__count">({{ store.historyTotal }})</span>
          </h1>
          <div class="cywm-subtitle">
            From here you can list and check all configuration deployments
            performed via CYWM Console.
          </div>
        </div>
      </div>

      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Search by file, target, or user..."
        bg-color="white"
        class="cywm-history-search"
        debounce="300"
        @update:model-value="onSearchChange"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <HistoryTable
        :rows="store.deployHistory"
        :loading="store.historyLoading"
        :pagination="pagination"
        @update:pagination="onPaginationChange"
        @view-log="onViewLog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useCywmStore } from "@/stores/cywm";
import HistoryTable from "@/cywm/components/HistoryTable.vue";
import DeployLogModal from "@/cywm/components/DeployLogModal.vue";
import type { DeployRecord } from "@/cywm/types";

const $q = useQuasar();
const store = useCywmStore();

const search = ref<string>(store.historyFilters.search ?? "");

const pagination = computed(() => ({
  page: store.historyFilters.page ?? 1,
  rowsPerPage: store.historyFilters.perPage ?? 10,
  rowsNumber: store.historyTotal,
}));

onMounted(async () => {
  await store.fetchHistory();
});

async function onSearchChange(value: string | number | null) {
  const v =
    typeof value === "string" ? value : value === null ? "" : String(value);
  store.setHistoryFilters({ search: v, page: 1 });
  await store.fetchHistory();
}

async function onPaginationChange(p: { page: number; rowsPerPage: number }) {
  store.setHistoryFilters({ page: p.page, perPage: p.rowsPerPage });
  await store.fetchHistory();
}

function onViewLog(row: DeployRecord) {
  $q.dialog({
    component: DeployLogModal,
    componentProps: {
      existingRecord: row,
    },
  });
}
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.cywm-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--cywm-bg-page);
  color: var(--cywm-text-primary);
  font-family: var(--cywm-sans);
  font-size: 14px;
}

.cywm-topbar {
  background: var(--cywm-bg-card);
  border-bottom: 1px solid var(--cywm-border);
  padding: 0 24px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  flex-shrink: 0;
}

.cywm-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--cywm-text-secondary);
}

.cywm-breadcrumb__link {
  color: var(--cywm-accent);
  cursor: pointer;
}

.cywm-breadcrumb__sep {
  color: var(--cywm-text-muted);
}

.cywm-topbar__spacer {
  flex: 1;
}

.cywm-topbar__meta {
  font-size: 12px;
  color: var(--cywm-text-secondary);

  strong {
    color: var(--cywm-text-primary);
  }
}

.cywm-topbar__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--cywm-text-secondary);
}

.cywm-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cywm-text-muted);
}

.cywm-dot--ok {
  background: var(--cywm-success);
}

.cywm-page__body {
  flex: 1;
  padding: 16px 24px 24px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cywm-page-header {
  flex-shrink: 0;
}

.cywm-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--cywm-text-primary);
}

.cywm-title__count {
  color: var(--cywm-text-secondary);
  font-weight: 500;
}

.cywm-subtitle {
  color: var(--cywm-text-secondary);
  font-size: 13px;
  margin-top: 4px;
}

.cywm-history-search {
  max-width: 100%;
  flex-shrink: 0;
}
</style>
