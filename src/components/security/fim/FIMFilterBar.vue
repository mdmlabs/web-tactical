<template>
  <div class="fim-filter-bar">
    <!-- Search + DQL -->
    <div class="filter-row">
      <q-input
        v-model="localSearch"
        dense
        outlined
        placeholder="Search"
        class="filter-search"
        clearable
        @update:model-value="onSearchUpdate"
        @keydown.enter="onSearchSubmit"
      >
        <template #append>
          <q-btn flat dense no-caps label="DQL" class="dql-btn" size="sm" />
        </template>
      </q-input>

      <!-- Date range picker -->
      <q-select
        v-model="localDatePreset"
        :options="datePresetOptions"
        dense
        outlined
        emit-value
        map-options
        class="date-select"
        @update:model-value="onDateChange"
      >
        <template #prepend>
          <q-icon name="event" size="18px" />
        </template>
      </q-select>

      <q-btn flat dense no-caps label="Show dates" class="show-dates-btn" @click="showDateRange = !showDateRange" />

      <q-space />

      <q-btn
        flat
        dense
        no-caps
        icon="refresh"
        label="Refresh"
        class="refresh-btn"
        @click="$emit('refresh')"
      />
    </div>

    <!-- Custom date range (expandable) -->
    <div v-if="showDateRange" class="date-range-row">
      <q-input v-model="customFrom" dense outlined type="datetime-local" label="From" class="date-input" />
      <q-input v-model="customTo" dense outlined type="datetime-local" label="To" class="date-input" />
      <q-btn flat dense no-caps label="Apply" color="primary" @click="applyCustomRange" />
    </div>

    <!-- Filter chips row -->
    <div class="chips-row">
      <!-- Existing filter chips -->
      <template v-for="filter in fimStore.filters" :key="filter.id">
        <q-chip
          :class="['filter-chip', { 'filter-chip--disabled': !filter.enabled, 'filter-chip--negated': filter.negated }]"
          removable
          dense
          :outline="!filter.enabled"
          @remove="fimStore.removeFilter(filter.id)"
        >
          <span class="chip-label">
            <template v-if="filter.negated">NOT </template>
            {{ filter.field }}: {{ formatFilterValue(filter) }}
          </span>
          <q-icon v-if="filter.pinned" name="push_pin" size="12px" class="q-ml-xs" />

          <!-- Chip context menu -->
          <q-menu context-menu>
            <q-list dense style="min-width: 180px">
              <q-item clickable v-close-popup @click="fimStore.toggleFilter(filter.id)">
                <q-item-section avatar><q-icon :name="filter.enabled ? 'visibility_off' : 'visibility'" size="sm" /></q-item-section>
                <q-item-section>{{ filter.enabled ? 'Disable' : 'Enable' }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="fimStore.pinFilter(filter.id)">
                <q-item-section avatar><q-icon name="push_pin" size="sm" /></q-item-section>
                <q-item-section>{{ filter.pinned ? 'Unpin' : 'Pin' }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="fimStore.toggleFilterNegation(filter.id)">
                <q-item-section avatar><q-icon name="swap_horiz" size="sm" /></q-item-section>
                <q-item-section>{{ filter.negated ? 'Include' : 'Exclude' }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="fimStore.removeFilter(filter.id)">
                <q-item-section avatar><q-icon name="delete" size="sm" color="negative" /></q-item-section>
                <q-item-section class="text-negative">Remove</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-chip>
      </template>

      <!-- Bulk filter actions -->
      <q-btn
        v-if="fimStore.filters.length > 0"
        flat
        dense
        round
        icon="filter_list"
        size="sm"
        class="bulk-filter-btn"
      >
        <q-menu>
          <q-list dense style="min-width: 200px">
            <q-item-label header class="text-weight-bold">Filters</q-item-label>
            <q-item clickable v-close-popup @click="fimStore.enableAllFilters()">
              <q-item-section avatar><q-icon name="visibility" size="sm" /></q-item-section>
              <q-item-section>Enable all</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="fimStore.disableAllFilters()">
              <q-item-section avatar><q-icon name="visibility_off" size="sm" /></q-item-section>
              <q-item-section>Disable all</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="fimStore.pinAllFilters()">
              <q-item-section avatar><q-icon name="push_pin" size="sm" /></q-item-section>
              <q-item-section>Pin all</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="fimStore.unpinAllFilters()">
              <q-item-section avatar><q-icon name="push_pin" size="sm" /></q-item-section>
              <q-item-section>Unpin all</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="fimStore.invertInclusion()">
              <q-item-section avatar><q-icon name="swap_horiz" size="sm" /></q-item-section>
              <q-item-section>Invert inclusion</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="fimStore.invertEnabled()">
              <q-item-section avatar><q-icon name="swap_vert" size="sm" /></q-item-section>
              <q-item-section>Invert enabled/disabled</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="fimStore.clearFilters()">
              <q-item-section avatar><q-icon name="delete_sweep" size="sm" color="negative" /></q-item-section>
              <q-item-section class="text-negative">Remove all</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <!-- Add filter button -->
      <q-btn
        flat
        dense
        no-caps
        icon="add_circle_outline"
        label="Add filter"
        class="add-filter-btn"
        @click="showAddFilter = true"
      />
    </div>

    <!-- Add filter dialog -->
    <q-dialog v-model="showAddFilter">
      <q-card class="add-filter-card">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6">Edit filter</div>
          <q-space />
          <q-btn flat dense no-caps label="Edit as Query DSL" class="text-primary" size="sm" />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-7">
              <div class="text-primary text-weight-medium q-mb-xs">Field</div>
              <q-select
                v-model="newFilter.field"
                :options="filteredFieldOptions"
                dense
                outlined
                use-input
                input-debounce="100"
                emit-value
                map-options
                label="Select a field first"
                @filter="filterFieldOptions"
              />
            </div>
            <div class="col-5">
              <div class="text-weight-medium q-mb-xs">Operator</div>
              <q-select
                v-model="newFilter.operator"
                :options="operatorOptions"
                dense
                outlined
                emit-value
                map-options
                :disable="!newFilter.field"
                :label="newFilter.field ? 'Select operator' : 'Waiting'"
              />
            </div>
          </div>

          <div v-if="newFilter.operator && !['exists', 'does_not_exist'].includes(newFilter.operator)" class="q-mt-md">
            <div class="text-weight-medium q-mb-xs">Value</div>
            <q-input
              v-model="newFilter.value"
              dense
              outlined
              placeholder="Enter value"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn
            unelevated
            no-caps
            label="Save"
            color="primary"
            :disable="!canSaveFilter"
            @click="saveFilter"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFimStore } from "@/stores/fim";
import { FIM_KNOWN_FIELDS } from "@/types/fim";
import type { FIMFilter, FIMFilterOperator } from "@/types/fim";

defineEmits<{ refresh: [] }>();

const fimStore = useFimStore();

const localSearch = ref(fimStore.searchQuery);
const localDatePreset = ref(fimStore.dateRange.preset ?? "24h");
const showDateRange = ref(false);
const customFrom = ref("");
const customTo = ref("");
const showAddFilter = ref(false);

const newFilter = ref({
  field: "",
  operator: "" as FIMFilterOperator | "",
  value: "",
});

const datePresetOptions = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const operatorOptions = [
  { label: "is", value: "is" },
  { label: "is not", value: "is_not" },
  { label: "exists", value: "exists" },
  { label: "does not exist", value: "does_not_exist" },
  { label: "is one of", value: "is_one_of" },
  { label: "is not one of", value: "is_not_one_of" },
];

const allFieldOptions = FIM_KNOWN_FIELDS.map((f) => ({ label: f, value: f }));
const filteredFieldOptions = ref(allFieldOptions);

function filterFieldOptions(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    if (!needle) {
      filteredFieldOptions.value = allFieldOptions;
    } else {
      filteredFieldOptions.value = allFieldOptions.filter((o) =>
        o.label.toLowerCase().includes(needle),
      );
    }
  });
}

const canSaveFilter = computed(() => {
  if (!newFilter.value.field || !newFilter.value.operator) return false;
  if (
    newFilter.value.operator !== "exists" &&
    newFilter.value.operator !== "does_not_exist" &&
    !newFilter.value.value
  )
    return false;
  return true;
});

function saveFilter() {
  fimStore.addFilter({
    field: newFilter.value.field,
    operator: newFilter.value.operator as FIMFilterOperator,
    value: newFilter.value.value || undefined,
    enabled: true,
    pinned: false,
    negated: false,
  });
  newFilter.value = { field: "", operator: "", value: "" };
  showAddFilter.value = false;
}

function onSearchUpdate(val: string | number | null) {
  fimStore.setSearchQuery(String(val ?? ""));
}

function onSearchSubmit() {
  fimStore.refreshActiveTab();
}

function onDateChange(preset: string) {
  fimStore.setDateRange({ type: "preset", preset: preset as "15m" | "1h" | "24h" | "7d" | "30d" });
}

function applyCustomRange() {
  if (customFrom.value && customTo.value) {
    fimStore.setDateRange({
      type: "custom",
      from: new Date(customFrom.value).toISOString(),
      to: new Date(customTo.value).toISOString(),
    });
    showDateRange.value = false;
  }
}

function formatFilterValue(filter: FIMFilter): string {
  if (filter.operator === "exists") return "exists";
  if (filter.operator === "does_not_exist") return "does not exist";
  return filter.value ?? filter.values?.join(", ") ?? "";
}
</script>

<style scoped>
.fim-filter-bar {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

.filter-search {
  flex: 1;
  max-width: 500px;
}

.filter-search :deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  font-size: 13px;
}

.dql-btn {
  color: var(--mdm-primary, #2563eb);
  font-weight: 600;
  font-size: 12px;
}

.date-select {
  width: 180px;
}

.date-select :deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  font-size: 13px;
}

.show-dates-btn {
  color: var(--mdm-primary, #2563eb);
  font-size: 13px;
  font-weight: 500;
}

.refresh-btn {
  color: var(--mdm-primary, #2563eb);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
}

.date-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 8px;
}

.date-input {
  width: 220px;
}

.date-input :deep(.q-field__control) {
  height: 34px;
  min-height: 34px;
  font-size: 13px;
}

.chips-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 16px 8px;
  min-height: 32px;
}

.filter-chip {
  font-size: 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border: 1px solid var(--mdm-border, #e5e5e5);
}

.filter-chip--disabled {
  opacity: 0.5;
}

.filter-chip--negated {
  text-decoration: line-through;
}

.chip-label {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-filter-btn {
  color: var(--mdm-primary, #2563eb);
  font-size: 12px;
  font-weight: 500;
}

.bulk-filter-btn {
  color: var(--mdm-text-secondary, #666);
}

.add-filter-card {
  min-width: 500px;
  max-width: 600px;
}

/* Dark mode */
.body--dark .fim-filter-bar {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .filter-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .refresh-btn {
  border-color: var(--mdm-border, #1e293b);
}
</style>
