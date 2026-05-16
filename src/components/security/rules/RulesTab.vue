<template>
  <div class="rules-tab">
    <!-- Filters -->
    <div class="rules-filters">
      <q-input
        v-model="store.filters.search"
        dense
        outlined
        placeholder="Search rules..."
        clearable
        class="filter-search"
        @update:model-value="debouncedFetch"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        v-model="store.filters.level"
        :options="levelOptions"
        dense
        outlined
        emit-value
        map-options
        label="Severity"
        class="filter-select"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="store.filters.status"
        :options="statusOptions"
        dense
        outlined
        emit-value
        map-options
        label="Status"
        class="filter-select"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="store.filters.group"
        :options="groupOptions"
        dense
        outlined
        emit-value
        map-options
        label="Group"
        class="filter-select"
        clearable
        use-input
        input-debounce="200"
        @filter="filterGroups"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="store.filters.filename"
        :options="fileOptions"
        dense
        outlined
        emit-value
        map-options
        label="File"
        class="filter-select"
        clearable
        use-input
        input-debounce="200"
        @filter="filterFiles"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="requirementType"
        :options="requirementTypeOptions"
        dense
        outlined
        emit-value
        map-options
        label="Requirement"
        class="filter-select"
        clearable
        @update:model-value="onRequirementTypeChange"
      />

      <q-select
        v-if="requirementType"
        v-model="store.filters.requirement"
        :options="requirementValueOptions"
        dense
        outlined
        emit-value
        map-options
        label="Value"
        class="filter-select"
        clearable
        :loading="store.requirementLoading"
        use-input
        input-debounce="200"
        @filter="filterRequirements"
        @update:model-value="onFilterChange"
      />

      <q-btn
        flat
        no-caps
        dense
        icon="filter_alt_off"
        label="Reset"
        class="filter-reset-btn"
        @click="resetFilters"
      />
    </div>

    <!-- Table -->
    <q-table
      :rows="store.rules"
      :columns="columns"
      row-key="id"
      flat
      dense
      :loading="store.rulesLoading"
      :pagination="tablePagination"
      no-data-label="No rules found"
      class="rules-table"
      @request="onTableRequest"
    >
      <template #body-cell-level="props">
        <q-td :props="props">
          <span
            class="rules-level-badge"
            :class="'rules-level--' + levelClass(props.row.level)"
          >
            {{ props.row.level }}
          </span>
        </q-td>
      </template>

      <template #body-cell-id="props">
        <q-td :props="props">
          <span class="rules-id">{{ props.row.id }}</span>
        </q-td>
      </template>

      <template #body-cell-groups="props">
        <q-td :props="props">
          <q-chip
            v-for="g in (props.row.groups ?? []).slice(0, 3)"
            :key="g"
            dense
            size="sm"
            class="rules-chip"
            :label="g"
            clickable
            @click="filterByGroup(g)"
          />
          <span
            v-if="(props.row.groups ?? []).length > 3"
            class="text-caption"
            style="color: var(--mdm-text-muted)"
          >
            +{{ props.row.groups.length - 3 }}
          </span>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'enabled' ? 'positive' : 'grey'"
            :label="props.row.status"
          />
        </q-td>
      </template>

      <template #body-cell-filename="props">
        <q-td :props="props">
          <span class="rules-filename">{{ props.row.filename }}</span>
        </q-td>
      </template>

      <template #body-cell-compliance="props">
        <q-td :props="props">
          <template v-if="getComplianceTags(props.row).length">
            <q-chip
              v-for="tag in getComplianceTags(props.row).slice(0, 2)"
              :key="tag"
              dense
              size="sm"
              class="rules-chip rules-chip--compliance"
              :label="tag"
            />
            <span
              v-if="getComplianceTags(props.row).length > 2"
              class="text-caption"
              style="color: var(--mdm-text-muted)"
            >
              +{{ getComplianceTags(props.row).length - 2 }}
            </span>
          </template>
          <span v-else style="color: var(--mdm-text-muted)">—</span>
        </q-td>
      </template>

      <template #bottom>
        <div class="rules-pagination">
          <span class="rules-pagination__info">
            Showing {{ paginationStart }}–{{ paginationEnd }}
            of {{ store.totalRules }} rules
          </span>
          <q-pagination
            :model-value="store.currentPage"
            :max="store.totalPages"
            :max-pages="7"
            direction-links
            boundary-numbers
            @update:model-value="store.setPage"
          />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRulesStore } from "@/stores/rules";
import type { WazuhRule } from "@/types/wazuh";

const store = useRulesStore();

const requirementType = ref<string | null>(null);

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function debouncedFetch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.filters.offset = 0;
    store.fetchRules();
  }, 400);
}

const levelOptions = [
  { label: "All Levels", value: "all" },
  { label: "Critical (12-15)", value: "critical" },
  { label: "High (10-11)", value: "high" },
  { label: "Medium (7-9)", value: "medium" },
  { label: "Low (0-6)", value: "low" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

const requirementTypeOptions = [
  { label: "PCI DSS", value: "pci_dss" },
  { label: "GDPR", value: "gdpr" },
  { label: "HIPAA", value: "hipaa" },
  { label: "NIST 800-53", value: "nist_800_53" },
  { label: "GPG13", value: "gpg13" },
  { label: "TSC", value: "tsc" },
];

const columns = [
  {
    name: "level",
    label: "Level",
    field: "level",
    align: "center" as const,
    sortable: true,
    style: "width: 70px",
  },
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left" as const,
    sortable: true,
    style: "width: 80px",
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "groups",
    label: "Groups",
    field: "groups",
    align: "left" as const,
    style: "max-width: 240px",
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center" as const,
    sortable: true,
    style: "width: 90px",
  },
  {
    name: "filename",
    label: "File",
    field: "filename",
    align: "left" as const,
    sortable: true,
    style: "width: 180px",
  },
  {
    name: "compliance",
    label: "Compliance",
    field: () => "",
    align: "left" as const,
    style: "max-width: 200px",
  },
];

const tablePagination = computed(() => ({
  rowsPerPage: store.filters.limit,
  rowsNumber: store.totalRules,
  page: store.currentPage,
  sortBy: store.filters.sort.replace(/^[+-]/, ""),
  descending: store.filters.sort.startsWith("-"),
}));

const paginationStart = computed(
  () => store.filters.offset + 1,
);
const paginationEnd = computed(() =>
  Math.min(store.filters.offset + store.filters.limit, store.totalRules),
);

// Group / File filter options (with search)
const groupOptions = ref<{ label: string; value: string }[]>([]);
const fileOptions = ref<{ label: string; value: string }[]>([]);
const requirementValueOptions = ref<{ label: string; value: string }[]>([]);

function filterGroups(
  val: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    const q = val.toLowerCase();
    groupOptions.value = store.ruleGroups
      .filter((g) => g.toLowerCase().includes(q))
      .map((g) => ({ label: g, value: g }));
  });
}

function filterFiles(
  val: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    const q = val.toLowerCase();
    fileOptions.value = store.ruleFiles
      .filter((f) => f.filename.toLowerCase().includes(q))
      .map((f) => ({ label: f.filename, value: f.filename }));
  });
}

function filterRequirements(
  val: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    const q = val.toLowerCase();
    requirementValueOptions.value = store.requirementValues
      .filter((v) => v.toLowerCase().includes(q))
      .map((v) => ({ label: v, value: v }));
  });
}

function onFilterChange() {
  store.filters.offset = 0;
  store.fetchRules();
}

async function onRequirementTypeChange(val: string | null) {
  store.filters.requirementType = val;
  store.filters.requirement = null;
  if (val) {
    await store.fetchRequirementValues(val);
    requirementValueOptions.value = store.requirementValues.map((v) => ({
      label: v,
      value: v,
    }));
  } else {
    store.requirementValues = [];
    requirementValueOptions.value = [];
    store.filters.offset = 0;
    store.fetchRules();
  }
}

function filterByGroup(group: string) {
  store.filters.group = group;
  store.filters.offset = 0;
  store.fetchRules();
}

function resetFilters() {
  requirementType.value = null;
  store.resetFilters();
  store.fetchRules();
}

function onTableRequest(props: {
  pagination: { sortBy: string; descending: boolean; page: number; rowsPerPage: number };
}) {
  const { sortBy, descending, page, rowsPerPage } = props.pagination;
  store.filters.limit = rowsPerPage;
  store.filters.offset = (page - 1) * rowsPerPage;
  store.filters.sort = `${descending ? "-" : "+"}${sortBy}`;
  store.fetchRules();
}

function levelClass(level: number): string {
  if (level >= 12) return "critical";
  if (level >= 10) return "high";
  if (level >= 7) return "medium";
  return "low";
}

function getComplianceTags(rule: WazuhRule): string[] {
  const tags: string[] = [];
  if (rule.pci_dss?.length) tags.push(...rule.pci_dss.slice(0, 1).map((v) => `PCI:${v}`));
  if (rule.gdpr?.length) tags.push(...rule.gdpr.slice(0, 1).map((v) => `GDPR:${v}`));
  if (rule.hipaa?.length) tags.push(...rule.hipaa.slice(0, 1).map((v) => `HIPAA:${v}`));
  if (rule.nist_800_53?.length) tags.push(...rule.nist_800_53.slice(0, 1).map((v) => `NIST:${v}`));
  if (rule.tsc?.length) tags.push(...rule.tsc.slice(0, 1).map((v) => `TSC:${v}`));
  return tags;
}

onMounted(async () => {
  await Promise.all([
    store.fetchRules(),
    store.fetchRuleGroups(),
    store.fetchRuleFiles(),
  ]);
});
</script>

<style scoped>
.rules-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rules-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.filter-search {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.filter-select {
  width: 160px;
  flex-shrink: 0;
}

.filter-reset-btn {
  color: var(--mdm-text-secondary, #6b7280);
  font-size: 12px;
}

.rules-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 10px 16px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.rules-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.rules-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

.rules-level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.rules-level--critical {
  background: var(--mdm-danger, #dc2626);
}
.rules-level--high {
  background: #ea580c;
}
.rules-level--medium {
  background: var(--mdm-warning, #ca8a04);
}
.rules-level--low {
  background: var(--mdm-info, #2563eb);
}

.rules-id {
  font-family: monospace;
  font-weight: 600;
  color: var(--mdm-primary, #2563eb);
}

.rules-filename {
  font-family: monospace;
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
}

.rules-chip {
  background: rgba(37, 99, 235, 0.08);
  color: var(--mdm-primary, #2563eb);
  font-size: 11px;
  margin-right: 4px;
}

.rules-chip--compliance {
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
}

.rules-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
}

.rules-pagination__info {
  font-size: 12px;
  color: var(--mdm-text-secondary, #6b7280);
}
</style>
