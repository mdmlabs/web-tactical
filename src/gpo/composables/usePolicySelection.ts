import { ref, computed } from "vue";

export function usePolicySelection() {
  const selectedPolicies = ref<Record<string, boolean>>({});

  const selectedCount = computed(
    () => Object.values(selectedPolicies.value).filter(Boolean).length,
  );

  function togglePolicySelection(policyId: string) {
    selectedPolicies.value[policyId] = !selectedPolicies.value[policyId];
  }

  function clearSelection() {
    selectedPolicies.value = {};
  }

  return {
    selectedPolicies,
    selectedCount,
    togglePolicySelection,
    clearSelection,
  };
}
