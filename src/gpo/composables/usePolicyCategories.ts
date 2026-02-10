import { ref, type Ref } from "vue";
import { policyCatalogClient } from "../api/grpc-client";
import { notifyError } from "@/utils/notify";
import type { CategoryNode } from "../types/policy-catalog";
import { normalizeCategoryTree } from "../api/policy-catalog-adapters";


export function usePolicyCategories() {
  const loadingCategories = ref(false);
  const categories: Ref<CategoryNode[]> = ref([]);
  const errorCategories = ref<string | null>(null);

  async function loadCategories(locale = "en-US") {
    loadingCategories.value = true;
    errorCategories.value = null;
    try {
      const response = await policyCatalogClient.getCategoryTree(locale);
      categories.value = normalizeCategoryTree(response);
    } catch {
      errorCategories.value = "Error loading categories";
      notifyError("Error loading categories");
    } finally {
      loadingCategories.value = false;
    }
  }

  return {
    loadingCategories,
    categories,
    errorCategories,
    loadCategories,
  };
}
