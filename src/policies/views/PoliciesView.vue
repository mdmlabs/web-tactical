<template>
  <div class="policies-page">
    <div class="policies-layout">
      <!-- Sidebar -->
      <PoliciesSidebar
        :platforms="platformsWithCount"
        :current-platform="selectedPlatform"
        @select="setPlatform"
      />

      <!-- Main Content -->
      <div class="policies-content">
        <!-- Header -->
        <div class="policies-header">
          <div class="header-left">
            <!-- Segment Selector -->
            <q-select
              v-model="selectedSegmentLocal"
              :options="segmentOptions"
              outlined
              dense
              class="segment-select"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="public" size="18px" />
              </template>
            </q-select>

            <!-- Create Button -->
            <q-btn
              color="primary"
              unelevated
              class="create-btn"
              @click="showCreateDialog = true"
            >
              <q-icon name="add" size="18px" class="q-mr-xs" />
              Create Policy
            </q-btn>

            <!-- Search -->
            <q-input
              v-model="searchQueryLocal"
              outlined
              dense
              placeholder="Search"
              class="search-input"
              clearable
              @update:model-value="(v) => debounceSearch(typeof v === 'number' ? String(v) : v)"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Filter Button -->
            <q-btn
              outline
              dense
              class="filter-btn"
              @click="showFilterDialog = true"
            >
              <q-icon name="filter_list" size="18px" class="q-mr-xs" />
              Filter
            </q-btn>
          </div>

          <div class="header-right">
            <!-- Refresh Button -->
            <q-btn flat dense class="action-btn" @click="() => refreshPolicies()">
              <q-icon name="refresh" size="18px" class="q-mr-xs" />
              Refresh
            </q-btn>

            <!-- Options Menu -->
            <q-btn flat dense class="action-btn">
              <q-icon name="tune" size="18px" class="q-mr-xs" />
              Options
              <q-menu>
                <q-list dense style="min-width: 180px">
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="view_column" size="sm" />
                    </q-item-section>
                    <q-item-section>Column Settings</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="file_download" size="sm" />
                    </q-item-section>
                    <q-item-section>Export Data</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <!-- Table -->
        <PoliciesTable
          :policies="policies"
          :loading="loading"
          :pagination="pagination"
          @select="navigateToPolicy"
          @edit="navigateToPolicy"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
          @create="showCreateDialog = true"
          @update:pagination="pagination = $event"
        />
      </div>
    </div>

    <!-- Create Policy Dialog -->
    <CreatePolicyDialog
      v-model="showCreateDialog"
      @create="handleCreatePolicy"
    />

    <!-- Filter Dialog -->
    <q-dialog v-model="showFilterDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Filter Policies</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="filterSegment"
            :options="segmentFilterOptions"
            label="Segment"
            outlined
            dense
            emit-value
            map-options
            clearable
          />

          <q-input
            v-model="filterDateFrom"
            type="date"
            label="Created From"
            outlined
            dense
            class="q-mt-md"
          />

          <q-input
            v-model="filterDateTo"
            type="date"
            label="Created To"
            outlined
            dense
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Clear" @click="clearFilters" v-close-popup />
          <q-btn color="primary" label="Apply" @click="applyFilters" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import PoliciesSidebar from '../components/PoliciesSidebar.vue';
import PoliciesTable from '../components/PoliciesTable.vue';
import CreatePolicyDialog from '../components/dialogs/CreatePolicyDialog.vue';
import { usePolicies } from '../composables/usePolicies';
import { SEGMENTS } from '../types/policies';
import type { Policy, Platform } from '../types/policies';

const router = useRouter();
const $q = useQuasar();

const {
  policies,
  loading,
  selectedPlatform,
  platformCounts,
  setSearch,
  setSegment,
  setPlatform,
  createPolicy,
  deletePolicy,
  refreshPolicies,
} = usePolicies();

// Local state for form inputs
const searchQueryLocal = ref('');
const selectedSegmentLocal = ref<string | null>('Global');
const showCreateDialog = ref(false);
const showFilterDialog = ref(false);
const filterSegment = ref<string | null>(null);
const filterDateFrom = ref('');
const filterDateTo = ref('');

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});

// Platforms with counts
const platformsWithCount = computed(() => [
  { id: 'apple' as Platform, label: 'Apple', count: platformCounts.value.apple, disabled: true },
  { id: 'android' as Platform, label: 'Android', count: platformCounts.value.android, disabled: true },
  { id: 'windows' as Platform, label: 'Windows', count: platformCounts.value.windows, disabled: false },
]);

// Segment options
const segmentOptions = computed(() => [
  { label: 'Global', value: 'Global' },
  ...SEGMENTS.filter(s => s !== 'Global').map(s => ({ label: s, value: s })),
]);

const segmentFilterOptions = computed(() => [
  { label: 'All Segments', value: null },
  ...SEGMENTS.map(s => ({ label: s, value: s })),
]);

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>;
function debounceSearch(value: string | null) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    setSearch(value || '');
  }, 300);
}

// Watch segment changes
watch(selectedSegmentLocal, (newVal) => {
  setSegment(newVal);
});

// Load policies on mount
onMounted(() => {
  // Sync segment from local state to composable
  setSegment(selectedSegmentLocal.value);
  void refreshPolicies();
});

// Navigate to policy detail
function navigateToPolicy(policy: Policy) {
  router.push({ name: 'PolicyDetail', params: { id: policy.id } });
}

async function handleCreatePolicy(data: { name: string; platform: Platform }) {
  try {
    const newPolicy: Policy = await createPolicy(data.name, data.platform);
    if (!newPolicy?.id) {
      throw new Error('Policy created but no id returned from server');
    }
    showCreateDialog.value = false;
    $q.notify({
      message: `Policy "${newPolicy.name}" created successfully`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    });
    void router.push({ name: 'PolicyDetail', params: { id: newPolicy.id } });
  } catch (err) {
    console.error('[handleCreatePolicy] error:', err);
    $q.notify({
      message: 'Failed to create policy. Please try again.',
      color: 'negative',
      position: 'top',
      icon: 'error',
    });
  }
}

// Handle delete
function handleDelete(policy: Policy) {
  $q.dialog({
    title: 'Delete Policy',
    message: `Are you sure you want to delete "${policy.name}"? This action cannot be undone.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deletePolicy(policy.id);
      $q.notify({
        message: `Policy "${policy.name}" has been deleted`,
        color: 'positive',
        position: 'top',
        icon: 'check_circle',
      });
    } catch {
      $q.notify({
        message: 'Failed to delete policy. Please try again.',
        color: 'negative',
        position: 'top',
        icon: 'error',
      });
    }
  });
}

// Handle duplicate
async function handleDuplicate(policy: Policy) {
  try {
    const duplicated: Policy = await createPolicy(`${policy.name} (Copy)`, policy.platform);
    $q.notify({
      message: `Policy duplicated as "${duplicated.name}"`,
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    });
  } catch {
    $q.notify({
      message: 'Failed to duplicate policy. Please try again.',
      color: 'negative',
      position: 'top',
      icon: 'error',
    });
  }
}

// Filter functions
function clearFilters() {
  filterSegment.value = null;
  filterDateFrom.value = '';
  filterDateTo.value = '';
}

function applyFilters() {
  if (filterSegment.value) {
    selectedSegmentLocal.value = filterSegment.value;
  }
}
</script>

<style scoped>
.policies-page {
  height: 100%;
  background: var(--page-bg, #f5f7fa);
}

.policies-layout {
  display: flex;
  height: 100%;
}

.policies-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--content-bg, #ffffff);
}

.policies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.segment-select {
  min-width: 140px;
}

.segment-select :deep(.q-field__control) {
  background: var(--input-bg, #ffffff);
}

.create-btn {
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
}

.search-input {
  min-width: 200px;
  max-width: 280px;
}

.search-input :deep(.q-field__control) {
  background: var(--input-bg, #ffffff);
}

.filter-btn {
  text-transform: none;
  font-weight: 500;
  border-color: var(--border-color, #d1d5db);
  padding: 8px 16px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  padding: 8px 12px;
}

/* Dark theme */
.body--dark .policies-page {
  --page-bg: #121218;
  --content-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --input-bg: #2a2a3d;
}

/* Responsive */
@media (max-width: 1024px) {
  .policies-layout {
    flex-direction: column;
  }

  .policies-layout :deep(.policies-sidebar) {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .policies-layout :deep(.platform-list) {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
  }

  .policies-layout :deep(.platform-item) {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .policies-layout :deep(.sidebar-header) {
    display: none;
  }
}

@media (max-width: 768px) {
  .policies-header {
    padding: 12px 16px;
  }

  .header-left {
    width: 100%;
  }

  .segment-select,
  .search-input {
    flex: 1;
    min-width: 140px;
  }

  .create-btn {
    flex: 1;
  }
}
</style>
