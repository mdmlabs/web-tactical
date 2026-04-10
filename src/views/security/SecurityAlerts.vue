<template>
  <div class="security-alerts">
    <!-- Filters -->
    <div class="mdm-card q-mb-md">
      <div class="mdm-card__header">
        <span>Alert Rules</span>
        <q-btn
          icon="refresh"
          flat
          round
          dense
          size="sm"
          @click="loadRules"
          :loading="wazuhStore.rulesLoading"
        >
          <q-tooltip>Refresh</q-tooltip>
        </q-btn>
      </div>
      <div class="filter-row q-pa-md">
        <q-select
          v-model="levelFilter"
          :options="levelOptions"
          dense
          outlined
          emit-value
          map-options
          label="Severity"
          class="filter-select"
        />
        <q-input
          v-model="searchQuery"
          dense
          outlined
          placeholder="Search rules..."
          clearable
          class="filter-search"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Rules table -->
      <q-table
        :rows="filteredRules"
        :columns="columns"
        row-key="id"
        flat
        dense
        :loading="wazuhStore.rulesLoading"
        :pagination="pagination"
        no-data-label="No rules found"
        class="sec-table"
      >
        <template #body-cell-level="props">
          <q-td :props="props">
            <span class="sec-level-badge" :class="'sec-level--' + levelClass(props.row.level)">
              {{ levelLabel(props.row.level) }} ({{ props.row.level }})
            </span>
          </q-td>
        </template>

        <template #body-cell-groups="props">
          <q-td :props="props">
            <q-chip
              v-for="g in (props.row.groups ?? []).slice(0, 3)"
              :key="g"
              dense
              size="sm"
              class="sec-chip"
              :label="g"
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

        <template #body-cell-mitre="props">
          <q-td :props="props">
            <template v-if="props.row.mitre?.tactic?.length">
              <q-chip
                v-for="t in props.row.mitre.tactic.slice(0, 2)"
                :key="t"
                dense
                size="sm"
                class="sec-chip sec-chip--mitre"
                :label="t"
              />
            </template>
            <span v-else style="color: var(--mdm-text-muted)">—</span>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWazuhStore } from "@/stores/wazuh";

const wazuhStore = useWazuhStore();

const searchQuery = ref("");
const levelFilter = ref("all");
const pagination = ref({ rowsPerPage: 25 });

const levelOptions = [
  { label: "All Levels", value: "all" },
  { label: "Critical (12-15)", value: "critical" },
  { label: "High (10-11)", value: "high" },
  { label: "Medium (7-9)", value: "medium" },
  { label: "Low (0-6)", value: "low" },
];

const columns = [
  { name: "level", label: "Level", field: "level", align: "center" as const, sortable: true },
  { name: "id", label: "Rule ID", field: "id", align: "left" as const, sortable: true },
  { name: "description", label: "Description", field: "description", align: "left" as const, sortable: true },
  { name: "groups", label: "Groups", field: "groups", align: "left" as const },
  { name: "mitre", label: "MITRE ATT&CK", field: "mitre", align: "left" as const },
];

const filteredRules = computed(() => {
  let rules = wazuhStore.rules;

  switch (levelFilter.value) {
    case "critical":
      rules = rules.filter((r) => r.level >= 12);
      break;
    case "high":
      rules = rules.filter((r) => r.level >= 10 && r.level <= 11);
      break;
    case "medium":
      rules = rules.filter((r) => r.level >= 7 && r.level <= 9);
      break;
    case "low":
      rules = rules.filter((r) => r.level <= 6);
      break;
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    rules = rules.filter(
      (r) =>
        r.description?.toLowerCase().includes(q) ||
        String(r.id).includes(q) ||
        (r.groups ?? []).some((g) => g.toLowerCase().includes(q)),
    );
  }

  return rules;
});

function levelLabel(level: number): string {
  if (level >= 12) return "Critical";
  if (level >= 10) return "High";
  if (level >= 7) return "Medium";
  if (level >= 4) return "Low-Medium";
  return "Low";
}

function levelClass(level: number): string {
  if (level >= 12) return "critical";
  if (level >= 10) return "high";
  if (level >= 7) return "medium";
  return "low";
}

async function loadRules() {
  await wazuhStore.fetchRules({ limit: 500, sort: "-level" });
}

onMounted(() => {
  loadRules();
});
</script>

<style scoped>
.security-alerts {
  padding: 16px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.filter-select {
  width: 200px;
  flex-shrink: 0;
}

.filter-search {
  flex: 1;
  max-width: 400px;
}

.sec-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 10px 16px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.sec-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sec-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.02);
}

.sec-level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.sec-level--critical { background: var(--mdm-danger, #dc2626); }
.sec-level--high { background: #ea580c; }
.sec-level--medium { background: var(--mdm-warning, #ca8a04); }
.sec-level--low { background: var(--mdm-info, #2563eb); }

.sec-chip {
  background: rgba(37, 99, 235, 0.08);
  color: var(--mdm-primary, #2563eb);
  font-size: 11px;
  margin-right: 4px;
}

.sec-chip--mitre {
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
}
</style>
