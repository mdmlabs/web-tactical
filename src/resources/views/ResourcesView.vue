<template>
  <div class="resources-page">
    <div class="resources-layout">
      <!-- Sidebar -->
      <ResourcesSidebar
        :categories="categories"
        :current-category="currentCategory"
        @select="setCategory"
      />

      <!-- Main Content -->
      <div class="resources-content">
        <!-- Header -->
        <div class="resources-header">
          <div class="header-left">
            <!-- Create Button -->
            <q-btn
              v-if="currentCategory !== 'all'"
              color="primary"
              unelevated
              class="create-btn"
              @click="navigateToCreate"
            >
              <q-icon name="add" size="18px" class="q-mr-xs" />
              {{ currentCategoryInfo?.createLabel || "Create" }}
            </q-btn>

            <!-- Create Button with Dropdown for 'All' -->
            <q-btn
              v-else
              color="primary"
              unelevated
              class="create-btn"
            >
              <q-icon name="add" size="18px" class="q-mr-xs" />
              Create Resource
              <q-menu>
                <q-list dense style="min-width: 180px">
                  <q-item clickable v-close-popup @click="navigateToCreateType('script')">
                    <q-item-section avatar>
                      <q-icon name="code" size="sm" />
                    </q-item-section>
                    <q-item-section>Create Script</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="navigateToCreateType('app')">
                    <q-item-section avatar>
                      <q-icon name="apps" size="sm" />
                    </q-item-section>
                    <q-item-section>Create App</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="navigateToCreateType('book')">
                    <q-item-section avatar>
                      <q-icon name="menu_book" size="sm" />
                    </q-item-section>
                    <q-item-section>Upload Book</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="navigateToCreateType('image')">
                    <q-item-section avatar>
                      <q-icon name="image" size="sm" />
                    </q-item-section>
                    <q-item-section>Upload Image</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="navigateToCreateType('certificate')">
                    <q-item-section avatar>
                      <q-icon name="vpn_key" size="sm" />
                    </q-item-section>
                    <q-item-section>Upload Certificate</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Search -->
            <q-input
              v-model="searchQueryLocal"
              outlined
              dense
              placeholder="Search"
              class="search-input"
              clearable
              @update:model-value="debounceSearch"
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
            <q-btn flat round dense icon="refresh" @click="refreshResources">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>

            <!-- Options Menu -->
            <q-btn flat round dense icon="tune">
              <q-tooltip>Options</q-tooltip>
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
        <ResourcesTable
          :resources="currentResources"
          :resource-type="currentCategory"
          :loading="loading"
          :pagination="pagination"
          @create="navigateToCreate"
          @edit="handleEdit"
          @delete="handleDelete"
          @download="handleDownload"
          @update:pagination="handlePaginationUpdate"
          @request="onTableRequest"
        />
      </div>
    </div>

    <!-- Filter Dialog -->
    <q-dialog v-model="showFilterDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Filter Resources</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="filterDateFrom"
            type="date"
            label="Created From"
            outlined
            dense
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
          <q-btn
            color="primary"
            label="Apply"
            @click="applyFilters"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ResourcesSidebar from "../components/ResourcesSidebar.vue";
import ResourcesTable from "../components/ResourcesTable.vue";
import { useResources } from "../composables/useResources";
import type { ResourceType, Resource } from "../types/resources";

const router = useRouter();
const $q = useQuasar();

const {
  currentCategory,
  loading,
  categories,
  currentResources,
  currentCategoryInfo,
  pagination,
  setCategory,
  setSearch,
  deleteResource,
  handleDownload: composableDownload,
  refreshResources,
  refreshCounts,
} = useResources();

// Local state for form inputs
const searchQueryLocal = ref("");
const showFilterDialog = ref(false);
const filterDateFrom = ref("");
const filterDateTo = ref("");

onMounted(() => {
  refreshResources();
  refreshCounts();
});

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>;
function debounceSearch(value: string | number | null) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    setSearch(String(value || ""));
  }, 300);
}

// Navigate to create page
function navigateToCreate() {
  const routeMap: Record<ResourceType, string> = {
    all: "",
    script: "CreateScript",
    app: "CreateApp",
    book: "CreateBook",
    image: "CreateImage",
    certificate: "CreateCertificate",
  };
  const route = routeMap[currentCategory.value];
  if (route) {
    router.push({ name: route });
  }
}

// Navigate to create page for specific type (used in 'all' category dropdown)
function navigateToCreateType(type: ResourceType) {
  const routeMap: Record<ResourceType, string> = {
    all: "",
    script: "CreateScript",
    app: "CreateApp",
    book: "CreateBook",
    image: "CreateImage",
    certificate: "CreateCertificate",
  };
  const route = routeMap[type];
  if (route) {
    router.push({ name: route });
  }
}

// Handle edit
function handleEdit(resource: Resource) {
  $q.notify({
    message: `Edit functionality for "${resource.name}" coming soon`,
    color: "info",
    position: "top",
  });
}

// Handle delete
async function handleDelete(resource: Resource) {
  try {
    await deleteResource(resource.id);
    $q.notify({
      message: `"${resource.name}" has been deleted`,
      color: "positive",
      position: "top",
      icon: "check_circle",
    });
  } catch (e: unknown) {
    const err = e as Error;
    $q.notify({
      message: err.message || "Failed to delete resource",
      color: "negative",
      position: "top",
      icon: "error",
    });
  }
}

// Handle download
async function handleDownload(resource: Resource) {
  try {
    await composableDownload(resource);
  } catch (e) {
    $q.notify({
      message: `Failed to download "${resource.name}"`,
      color: "negative",
      position: "top",
      icon: "error",
    });
  }
}

// Handle pagination update
function handlePaginationUpdate(newPagination: { page: number; rowsPerPage: number; rowsNumber?: number }) {
  pagination.value = {
    page: newPagination.page,
    rowsPerPage: newPagination.rowsPerPage,
    rowsNumber: newPagination.rowsNumber ?? pagination.value.rowsNumber,
  };
}

// Handle table request (server-side pagination/sorting)
function onTableRequest(requestProps: {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy?: string;
    descending?: boolean;
  };
}) {
  pagination.value.page = requestProps.pagination.page;
  pagination.value.rowsPerPage = requestProps.pagination.rowsPerPage;
  refreshResources();
}

// Filter functions
function clearFilters() {
  filterDateFrom.value = "";
  filterDateTo.value = "";
}

function applyFilters() {
  // Date filters would be applied to the composable in a full implementation
}
</script>

<style scoped>
.resources-page {
  height: 100%;
  background: var(--page-bg, #f5f7fa);
}

.resources-layout {
  display: flex;
  height: 100%;
}

.resources-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--content-bg, #ffffff);
}

.resources-header {
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
  min-width: 160px;
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
}

/* Dark theme */
.body--dark .resources-page {
  --page-bg: #121218;
  --content-bg: #1e1e2d;
  --border-color: #2d2d3a;
  --input-bg: #2a2a3d;
}

/* Responsive */
@media (max-width: 1024px) {
  .resources-layout {
    flex-direction: column;
  }

  .resources-layout :deep(.resources-sidebar) {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }

  .resources-layout :deep(.category-list) {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
  }

  .resources-layout :deep(.category-item) {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .resources-layout :deep(.sidebar-header) {
    display: none;
  }
}

@media (max-width: 768px) {
  .resources-header {
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
