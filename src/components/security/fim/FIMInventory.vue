<template>
  <div class="fim-inventory">
    <!-- No agent selected prompt -->
    <div v-if="!fimStore.hasAgent" class="no-agent-prompt">
      <q-icon name="sensors" size="64px" color="grey-5" />
      <h3 class="prompt-title">No agent is selected</h3>
      <p class="prompt-text">You need to select an agent to see Integrity Monitoring inventory.</p>
      <q-btn
        unelevated
        color="primary"
        label="Select agent"
        class="select-agent-btn"
        @click="showExploreAgent = true"
      />
    </div>

    <!-- Explore agent dialog -->
    <FIMExploreAgent
      v-if="showExploreAgent"
      @close="showExploreAgent = false"
      @select="showExploreAgent = false"
    />

    <template v-else>
      <!-- Sub-tabs: Files / Windows Registry -->
      <div class="inventory-header">
        <div class="inventory-tabs">
          <div
            :class="['inv-tab', { 'inv-tab--active': fimStore.inventorySubTab === 'files' }]"
            @click="fimStore.inventorySubTab = 'files'"
          >
            Files ({{ fimStore.inventoryTotalFiles }})
          </div>
          <div
            :class="['inv-tab', { 'inv-tab--active': fimStore.inventorySubTab === 'registry' }]"
            @click="fimStore.inventorySubTab = 'registry'"
          >
            Windows Registry ({{ fimStore.inventoryTotalRegistry }})
          </div>
        </div>
      </div>

      <!-- Files/Registry table header -->
      <div class="table-header">
        <span class="table-title">
          {{ fimStore.inventorySubTab === 'files' ? 'Files' : 'Registry' }}
          ({{ fimStore.inventorySubTab === 'files' ? fimStore.inventoryTotalFiles : fimStore.inventoryTotalRegistry }})
        </span>
        <div class="table-actions">
          <q-btn flat dense no-caps icon="refresh" label="Refresh" class="action-btn" :loading="fimStore.inventoryLoading" @click="fimStore.fetchInventory()" />
          <q-btn-dropdown flat dense no-caps icon="download" label="Export formatted" class="action-btn">
            <q-list dense style="min-width: 160px">
              <q-item clickable v-close-popup @click="exportAs('csv')">
                <q-item-section avatar><q-icon name="description" size="sm" /></q-item-section>
                <q-item-section>CSV</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportAs('json')">
                <q-item-section avatar><q-icon name="data_object" size="sm" /></q-item-section>
                <q-item-section>JSON</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportAs('cef')">
                <q-item-section avatar><q-icon name="security" size="sm" /></q-item-section>
                <q-item-section>CEF</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat round dense icon="settings" size="sm" />
        </div>
      </div>

      <!-- Search bar -->
      <div class="search-bar">
        <q-input
          v-model="searchText"
          dense
          outlined
          placeholder="Search"
          class="search-input"
          clearable
        />
        <q-btn flat dense no-caps label="WQL" class="wql-btn" />
      </div>

      <!-- Files table -->
      <q-table
        v-if="fimStore.inventorySubTab === 'files'"
        :rows="filteredFiles"
        :columns="fileColumns"
        row-key="file"
        flat
        dense
        :loading="fimStore.inventoryLoading"
        :pagination="filePagination"
        class="inventory-table"
        separator="horizontal"
        @row-click="onFileRowClick"
      >
        <template #body-cell-file="props">
          <q-td :props="props" class="cell-file">{{ props.row.file }}</q-td>
        </template>
        <template #body-cell-mtime="props">
          <q-td :props="props">{{ formatDate(props.row.mtime) }}</q-td>
        </template>
        <template #body-cell-size="props">
          <q-td :props="props">{{ props.row.size ?? '—' }}</q-td>
        </template>
      </q-table>

      <!-- Registry table -->
      <q-table
        v-else
        :rows="filteredRegistry"
        :columns="registryColumns"
        row-key="file"
        flat
        dense
        :loading="fimStore.inventoryLoading"
        :pagination="registryPagination"
        class="inventory-table"
        separator="horizontal"
        @row-click="onFileRowClick"
      >
        <template #body-cell-file="props">
          <q-td :props="props" class="cell-file">{{ props.row.file }}</q-td>
        </template>
        <template #body-cell-mtime="props">
          <q-td :props="props">{{ formatDate(props.row.mtime) }}</q-td>
        </template>
      </q-table>
    </template>

    <!-- File Detail dialog -->
    <FIMFileDetail
      v-if="fimStore.selectedFile"
      :entry="fimStore.selectedFile"
      @close="fimStore.selectedFile = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFimStore } from "@/stores/fim";
import FIMFileDetail from "./FIMFileDetail.vue";
import FIMExploreAgent from "./FIMExploreAgent.vue";
import type { WazuhSyscheckEntry } from "@/types/wazuh";

const fimStore = useFimStore();
const searchText = ref("");
const showExploreAgent = ref(false);

const filePagination = ref({ rowsPerPage: 15 });
const registryPagination = ref({ rowsPerPage: 15 });

const fileColumns = [
  { name: "file", label: "File", field: "file", align: "left" as const, sortable: true },
  { name: "mtime", label: "Last modified", field: "mtime", align: "left" as const, sortable: true },
  { name: "uname", label: "User", field: "uname", align: "left" as const, sortable: true },
  { name: "uid", label: "User ID", field: "uid", align: "left" as const, sortable: true },
  { name: "size", label: "Size", field: "size", align: "right" as const, sortable: true },
];

const registryColumns = [
  { name: "file", label: "Registry", field: "file", align: "left" as const, sortable: true },
  { name: "mtime", label: "Last modified", field: "mtime", align: "left" as const, sortable: true },
];

const filteredFiles = computed(() => {
  if (!searchText.value) return fimStore.inventoryFiles;
  const needle = searchText.value.toLowerCase();
  return fimStore.inventoryFiles.filter(
    (f) =>
      f.file?.toLowerCase().includes(needle) ||
      f.uname?.toLowerCase().includes(needle) ||
      f.uid?.toLowerCase().includes(needle),
  );
});

const filteredRegistry = computed(() => {
  if (!searchText.value) return fimStore.inventoryRegistryEntries;
  const needle = searchText.value.toLowerCase();
  return fimStore.inventoryRegistryEntries.filter(
    (f) => f.file?.toLowerCase().includes(needle),
  );
});

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch {
    return dateStr;
  }
}

function onFileRowClick(_: Event, row: WazuhSyscheckEntry) {
  fimStore.selectedFile = row;
}

function exportAs(format: "csv" | "json" | "cef") {
  const rows = fimStore.inventorySubTab === "files" ? filteredFiles.value : filteredRegistry.value;
  const isFiles = fimStore.inventorySubTab === "files";
  const baseName = `fim-inventory-${fimStore.inventorySubTab}`;

  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case "json": {
      const data = rows.map((r) =>
        isFiles
          ? { file: r.file, mtime: r.mtime ?? null, uname: r.uname ?? null, uid: r.uid ?? null, size: r.size ?? null }
          : { file: r.file, mtime: r.mtime ?? null },
      );
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
      extension = "json";
      break;
    }
    case "cef": {
      content = rows
        .map((r) => {
          const ext = isFiles
            ? `fname=${escapeCefValue(r.file)} fileModificationTime=${escapeCefValue(r.mtime ?? "")} suser=${escapeCefValue(r.uname ?? "")} suid=${escapeCefValue(r.uid ?? "")} fsize=${r.size ?? 0}`
            : `fname=${escapeCefValue(r.file)} fileModificationTime=${escapeCefValue(r.mtime ?? "")}`;
          return `CEF:0|Wazuh|Wazuh|4.x|550|File integrity monitoring - inventory|3|${ext}`;
        })
        .join("\n");
      mimeType = "text/plain";
      extension = "cef";
      break;
    }
    default: {
      const header = isFiles ? "File,Last modified,User,User ID,Size\n" : "Registry,Last modified\n";
      const csv = rows
        .map((r) =>
          isFiles
            ? [r.file, r.mtime ?? "", r.uname ?? "", r.uid ?? "", r.size ?? ""]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(",")
            : [r.file, r.mtime ?? ""]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(","),
        )
        .join("\n");
      content = header + csv;
      mimeType = "text/csv";
      extension = "csv";
      break;
    }
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCefValue(val: string): string {
  return val.replace(/\\/g, "\\\\").replace(/=/g, "\\=").replace(/\n/g, "\\n");
}
</script>

<style scoped>
.fim-inventory {
  min-height: 100%;
}

.no-agent-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.prompt-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 16px 0 8px;
}

.prompt-text {
  font-size: 14px;
  color: var(--mdm-text-secondary, #666);
  max-width: 400px;
  margin-bottom: 20px;
}

.select-agent-btn {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 6px;
  text-transform: none;
}

/* Sub-tabs */
.inventory-header {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  padding: 0 16px;
}

.inventory-tabs {
  display: flex;
  gap: 0;
}

.inv-tab {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #666);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.inv-tab:hover {
  color: var(--mdm-primary, #2563eb);
}

.inv-tab--active {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
  border-bottom-color: var(--mdm-primary, #2563eb);
}

/* Table header */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  color: var(--mdm-primary, #2563eb);
  font-size: 13px;
  font-weight: 500;
}

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.search-input {
  flex: 1;
}

.search-input :deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  font-size: 13px;
}

.wql-btn {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
  font-size: 13px;
}

/* Table */
.inventory-table {
  background: var(--mdm-bg-card, #fff);
}

.inventory-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.inventory-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.inventory-table :deep(tbody tr) {
  cursor: pointer;
}

.inventory-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

.cell-file {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dark mode */
.body--dark .inventory-header,
.body--dark .table-header,
.body--dark .search-bar,
.body--dark .inventory-table {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .inv-tab {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .no-agent-prompt .prompt-title {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
