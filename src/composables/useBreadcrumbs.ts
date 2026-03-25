import { computed, reactive } from "vue";
import { useRoute, type RouteLocationMatched } from "vue-router";

export interface BreadcrumbEntry {
  label: string;
  to?: string;
}

/**
 * Reads route.matched chain for breadcrumb generation.
 * Supports dynamic labels via setBreadcrumbLabel(key, value).
 */
export function useBreadcrumbs() {
  const route = useRoute();
  const dynamicLabels = reactive<Record<string, string>>({});

  const breadcrumbs = computed<BreadcrumbEntry[]>(() => {
    return route.matched
      .filter((r: RouteLocationMatched) => r.meta.breadcrumb)
      .map((r: RouteLocationMatched) => {
        let label = r.meta.breadcrumb as string;

        // Replace dynamic params like :hostname with actual route params
        if (label.startsWith(":")) {
          const key = label.slice(1);
          label = dynamicLabels[key] || (route.params[key] as string) || label;
        }

        return {
          label,
          to: r.path === route.path ? undefined : r.path,
        };
      });
  });

  function setBreadcrumbLabel(key: string, value: string) {
    dynamicLabels[key] = value;
  }

  return { breadcrumbs, setBreadcrumbLabel };
}
