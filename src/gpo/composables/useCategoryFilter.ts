import { type Ref, computed } from "vue";
import { refDebounced } from "@vueuse/shared";
import type { CategoryNode } from "../types/policy-catalog";

const DEBOUNCE_MS = 300;

function filterTree<T extends { children?: T[] }>(
  nodes: T[],
  predicate: (node: T) => boolean,
): T[] {
  return nodes.reduce((acc, node) => {
    const childrenMatch = node.children?.length
      ? filterTree(node.children, predicate)
      : [];

    if (predicate(node)) {
      acc.push(node);
    } else if (childrenMatch.length > 0) {
      acc.push({ ...node, children: childrenMatch } as T);
    }
    return acc;
  }, [] as T[]);
}

export function useCategoryFilter(
  categories: Ref<CategoryNode[]>,
  searchQuery: Ref<string | null | undefined>,
) {
  const debouncedQuery = refDebounced(searchQuery, DEBOUNCE_MS);

  const filteredCategories = computed(() => {
    const query = (debouncedQuery.value ?? "").trim().toLowerCase();
    if (!query) return categories.value;

    return filterTree(
      categories.value,
      (node) =>
        (node.label?.toLowerCase().includes(query) ?? false) ||
        (node.categoryName?.toLowerCase().includes(query) ?? false),
    );
  });

  return { filteredCategories };
}
