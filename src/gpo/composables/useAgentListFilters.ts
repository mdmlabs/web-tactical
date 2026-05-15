import { computed, reactive, ref, watch } from "vue";
import {
  agentServiceClientWrapper,
  type ListAgentsFilters,
} from "@/gpo/api/grpc-client";
import { buildHumanOperatingSystemDisplay } from "@/gpo/utils/supportedOsHumanLabel";
import { notifyError } from "@/utils/notify";

export type AgentListFilterField = "manufacturer" | "model" | "minimalOsVersion";

export interface AgentListFilters {
  manufacturer: string;
  model: string;
  minimalOsVersion: string;
}

export function emptyAgentListFilters(): AgentListFilters {
  return { manufacturer: "", model: "", minimalOsVersion: "" };
}

export function useAgentListFilters(options?: {
  onFiltersChange?: () => void | Promise<void>;
}) {
  const filters = reactive<AgentListFilters>(emptyAgentListFilters());
  const draft = reactive<AgentListFilters>(emptyAgentListFilters());
  const showDialog = ref(false);
  const optionsLoading = ref(false);
  const manufacturerCatalog = ref<Array<{ name: string; models: string[] }>>([]);
  const manufacturerOptions = ref<Array<{ label: string; value: string }>>([]);

  const hasActiveFilters = computed(
    () =>
      !!filters.manufacturer.trim() ||
      !!filters.model.trim() ||
      !!filters.minimalOsVersion.trim(),
  );

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.manufacturer.trim()) count += 1;
    if (filters.model.trim()) count += 1;
    if (filters.minimalOsVersion.trim()) count += 1;
    return count;
  });

  const minimalOsLabel = computed(() => {
    const value = filters.minimalOsVersion.trim();
    if (!value) return "";
    return buildHumanOperatingSystemDisplay(value);
  });

  const modelOptionsForDraft = computed(() => {
    const mfr = draft.manufacturer.trim();
    if (!mfr) return [];
    const entry = manufacturerCatalog.value.find((m) => m.name === mfr);
    return (entry?.models ?? []).map((model) => ({ label: model, value: model }));
  });

  watch(
    () => draft.manufacturer,
    (mfr) => {
      const models =
        manufacturerCatalog.value.find((m) => m.name === mfr.trim())?.models ??
        [];
      if (draft.model && !models.includes(draft.model)) {
        draft.model = "";
      }
    },
  );

  function buildFilters(): ListAgentsFilters | undefined {
    const manufacturer = filters.manufacturer.trim();
    const model = filters.model.trim();
    const minimalOsVersion = filters.minimalOsVersion.trim();
    if (!manufacturer && !model && !minimalOsVersion) return undefined;
    return {
      manufacturer: manufacturer || undefined,
      model: model || undefined,
      minimalOsVersion: minimalOsVersion || undefined,
    };
  }

  async function loadFilterOptions(): Promise<void> {
    optionsLoading.value = true;
    try {
      const mfrRes = await agentServiceClientWrapper.getUniqueManufacturers();
      const raw = mfrRes as {
        manufacturersList?: Array<{
          name?: string;
          modelsList?: string[];
          models?: string[];
        }>;
        manufacturers?: Array<{
          name?: string;
          modelsList?: string[];
          models?: string[];
        }>;
      };
      const list = raw.manufacturersList ?? raw.manufacturers ?? [];
      const catalog: Array<{ name: string; models: string[] }> = [];
      for (const item of list) {
        const name = String(item?.name ?? "").trim();
        if (!name) continue;
        const models = (item.modelsList ?? item.models ?? [])
          .map((m) => String(m ?? "").trim())
          .filter(Boolean);
        catalog.push({ name, models });
      }
      catalog.sort((a, b) => a.name.localeCompare(b.name));
      manufacturerCatalog.value = catalog;
      manufacturerOptions.value = catalog.map((m) => ({
        label: m.name,
        value: m.name,
      }));
    } catch (e) {
      const msg = (e as { message?: string })?.message || String(e);
      notifyError(`Failed to load filter options: ${msg}`);
    } finally {
      optionsLoading.value = false;
    }
  }

  function openDialog(): void {
    Object.assign(draft, filters);
    showDialog.value = true;
    if (!manufacturerCatalog.value.length) {
      void loadFilterOptions();
    }
  }

  function resetDraft(): void {
    Object.assign(draft, emptyAgentListFilters());
  }

  async function apply(): Promise<void> {
    Object.assign(filters, draft);
    showDialog.value = false;
    await options?.onFiltersChange?.();
  }

  async function clearField(field: AgentListFilterField): Promise<void> {
    filters[field] = "";
    if (field === "manufacturer") {
      filters.model = "";
    }
    await options?.onFiltersChange?.();
  }

  return {
    filters,
    draft,
    showDialog,
    optionsLoading,
    manufacturerOptions,
    modelOptionsForDraft,
    hasActiveFilters,
    activeFiltersCount,
    minimalOsLabel,
    buildFilters,
    loadFilterOptions,
    openDialog,
    resetDraft,
    apply,
    clearField,
  };
}
