import { ref, computed } from "vue";
import type { ResourceType, Resource } from "../types/resources";
import { RESOURCE_CATEGORIES } from "../types/resources";
import {
  fetchResources as apiFetchResources,
  fetchResourceCounts as apiFetchResourceCounts,
  deleteResource as apiDeleteResource,
  downloadResource as apiDownloadResource,
} from "@/api/resources";

const resources = ref<Resource[]>([]);
const totalCount = ref(0);
const categoryCounts = ref<Record<string, number>>({});

const currentCategory = ref<ResourceType>("script");
const searchQuery = ref("");
const selectedSegment = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

export function useResources() {
  const categories = computed(() => {
    return RESOURCE_CATEGORIES.map((cat) => ({
      ...cat,
      count: categoryCounts.value[cat.id] ?? 0,
    }));
  });

  const currentResources = computed(() => {
    return resources.value;
  });

  const currentCategoryInfo = computed(() => {
    return RESOURCE_CATEGORIES.find((c) => c.id === currentCategory.value);
  });

  async function refreshResources() {
    loading.value = true;
    error.value = null;

    try {
      const params: Record<string, unknown> = {
        type: currentCategory.value,
        page: pagination.value.page,
        per_page: pagination.value.rowsPerPage,
      };

      if (searchQuery.value) {
        params.search = searchQuery.value;
      }

      if (selectedSegment.value) {
        params.segment = selectedSegment.value;
      }

      const result = await apiFetchResources(params);
      if (result) {
        resources.value = result.results as Resource[];
        totalCount.value = result.count;
        pagination.value.rowsNumber = result.count;
      }
    } catch (e) {
      error.value = "Failed to load resources";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function refreshCounts() {
    try {
      const counts = await apiFetchResourceCounts();
      if (counts) {
        categoryCounts.value = counts;
      }
    } catch (e) {
      console.error(e);
    }
  }

  function setCategory(type: ResourceType) {
    currentCategory.value = type;
    searchQuery.value = "";
    pagination.value.page = 1;
    refreshResources();
  }

  function setSearch(query: string) {
    searchQuery.value = query;
    pagination.value.page = 1;
    refreshResources();
  }

  function setSegment(segment: string | null) {
    selectedSegment.value = segment;
    pagination.value.page = 1;
    refreshResources();
  }

  async function deleteResource(id: string) {
    try {
      await apiDeleteResource(id);
      await Promise.all([refreshResources(), refreshCounts()]);
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } };
      if (err.response?.status === 409) {
        throw new Error(
          "Cannot delete: this resource is referenced by one or more policies",
        );
      }
      throw e;
    }
  }

  async function handleDownload(resource: Resource) {
    try {
      const data = await apiDownloadResource(resource.id);
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = data.fileName || resource.fileName || resource.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed:", e);
      throw e;
    }
  }

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return date.toLocaleDateString();
    } else if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }

  return {
    // State
    currentCategory,
    searchQuery,
    selectedSegment,
    loading,
    error,
    pagination,

    // Computed
    categories,
    currentResources,
    currentCategoryInfo,

    // Methods
    setCategory,
    setSearch,
    setSegment,
    deleteResource,
    handleDownload,
    refreshResources,
    refreshCounts,
    formatRelativeTime,
  };
}
