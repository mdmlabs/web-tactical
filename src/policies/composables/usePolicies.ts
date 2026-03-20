import { ref, computed } from "vue";
import type { Policy, Platform, PolicyListResponse } from "../types/policies";
import {
  fetchPolicies as fetchPoliciesApi,
  createPolicy as createPolicyApi,
  deletePolicy as deletePolicyApi,
  updatePolicy as updatePolicyApi,
} from "@/api/policies";

const policies = ref<Policy[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedSegment = ref<string | null>(null);
const selectedPlatform = ref<Platform>("windows");
const totalCount = ref(0);

export function usePolicies() {
  const filteredPolicies = computed(() => {
    // Backend already filters, but we do client-side for reactive updates
    let result = policies.value;

    // Filter by platform
    result = result.filter((p) => p.platform === selectedPlatform.value);

    // Filter by segment
    if (selectedSegment.value) {
      result = result.filter((p) => p.segment === selectedSegment.value);
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.summary.toLowerCase().includes(query),
      );
    }

    return result;
  });

  const platformCounts = computed(() => ({
    // apple: policies.value.filter((p) => p.platform === "apple").length,
    // android: policies.value.filter((p) => p.platform === "android").length,
    windows: policies.value.filter((p) => p.platform === "windows").length,
  }));

  function setSearch(query: string) {
    searchQuery.value = query;
  }

  function setSegment(segment: string | null) {
    selectedSegment.value = segment;
  }

  function setPlatform(platform: Platform) {
    selectedPlatform.value = platform;
  }

  async function createPolicy(
    name: string,
    platform: Platform = "windows",
  ): Promise<Policy> {
    const newPolicy = await createPolicyApi({ name, platform });
    if (!newPolicy?.id || newPolicy.id === "undefined") {
      throw new Error("Server returned invalid policy: missing id");
    }
    policies.value.unshift(newPolicy);
    totalCount.value++;
    return newPolicy;
  }

  async function deletePolicy(id: string): Promise<void> {
    await deletePolicyApi(id);
    const index = policies.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      policies.value.splice(index, 1);
      totalCount.value--;
    }
  }

  function getPolicy(id: string): Policy | undefined {
    return policies.value.find((p) => p.id === id);
  }

  async function updatePolicy(
    id: string,
    updates: Partial<Policy>,
  ): Promise<void> {
    const updatedPolicy = await updatePolicyApi(id, updates);
    const index = policies.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      policies.value[index] = updatedPolicy;
    }
  }

  async function refreshPolicies(
    params: {
      platform?: string;
      segment?: string;
      search?: string;
      page?: number;
      per_page?: number;
    } = {},
  ): Promise<void> {
    loading.value = true;
    try {
      const response: PolicyListResponse = await fetchPoliciesApi({
        platform: selectedPlatform.value,
        segment: selectedSegment.value || undefined,
        search: searchQuery.value || undefined,
        ...params,
      });
      policies.value = response.results;
      totalCount.value = response.count;
    } catch (error) {
      console.error("[usePolicies] Failed to fetch policies:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    policies: filteredPolicies,
    allPolicies: policies,
    loading,
    searchQuery,
    selectedSegment,
    selectedPlatform,
    platformCounts,
    totalCount,
    setSearch,
    setSegment,
    setPlatform,
    createPolicy,
    deletePolicy,
    getPolicy,
    updatePolicy,
    refreshPolicies,
  };
}
