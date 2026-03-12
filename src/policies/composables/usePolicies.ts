import { ref, computed } from "vue";
import type { Policy, Platform } from "../types/policies";
import { mockPolicies, generatePolicyId } from "../mocks/policiesMockData";

const policies = ref<Policy[]>([...mockPolicies]);
const loading = ref(false);
const searchQuery = ref("");
const selectedSegment = ref<string | null>(null);
const selectedPlatform = ref<Platform>("windows");

export function usePolicies() {
  const filteredPolicies = computed(() => {
    let result = policies.value;

    // Filter by platform
    result = result.filter(p => p.platform === selectedPlatform.value);

    // Filter by segment
    if (selectedSegment.value) {
      result = result.filter(p => p.segment === selectedSegment.value);
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const platformCounts = computed(() => ({
    apple: policies.value.filter(p => p.platform === "apple").length,
    android: policies.value.filter(p => p.platform === "android").length,
    windows: policies.value.filter(p => p.platform === "windows").length,
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

  function createPolicy(name: string, platform: Platform = "windows"): Policy {
    const now = new Date().toISOString();
    const newPolicy: Policy = {
      id: generatePolicyId(),
      name,
      platform,
      version: 1,
      segment: "Global",
      deviceCount: 0,
      summary: "Empty",
      created: now,
      updated: now,
      apps: [],
      scripts: [],
      resources: [],
      assignedDevices: [],
    };
    policies.value.unshift(newPolicy);
    return newPolicy;
  }

  function deletePolicy(id: string) {
    const index = policies.value.findIndex(p => p.id === id);
    if (index !== -1) {
      policies.value.splice(index, 1);
    }
  }

  function getPolicy(id: string): Policy | undefined {
    return policies.value.find(p => p.id === id);
  }

  function updatePolicy(id: string, updates: Partial<Policy>) {
    const index = policies.value.findIndex(p => p.id === id);
    if (index !== -1) {
      policies.value[index] = {
        ...policies.value[index],
        ...updates,
        updated: new Date().toISOString(),
      };
    }
  }

  function refreshPolicies() {
    loading.value = true;
    // Simulate API call
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  return {
    policies: filteredPolicies,
    allPolicies: policies,
    loading,
    searchQuery,
    selectedSegment,
    selectedPlatform,
    platformCounts,
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
