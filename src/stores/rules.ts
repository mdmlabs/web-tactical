import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wazuhApi } from "@/api/wazuh";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { WazuhRule, WazuhRuleFile } from "@/types/wazuh";
import { useWazuhStore } from "@/stores/wazuh";

export const useRulesStore = defineStore("rules", () => {
  // === State ===
  const rules = ref<WazuhRule[]>([]);
  const totalRules = ref(0);
  const rulesLoading = ref(false);

  const ruleGroups = ref<string[]>([]);
  const ruleGroupsLoading = ref(false);

  const ruleFiles = ref<WazuhRuleFile[]>([]);
  const ruleFilesLoading = ref(false);

  const requirementValues = ref<string[]>([]);
  const requirementLoading = ref(false);

  const fileContent = ref<string | null>(null);
  const fileContentLoading = ref(false);
  const editingFilename = ref<string | null>(null);

  // Filter state
  const filters = ref<{
    search: string;
    group: string | null;
    level: string;
    status: string;
    filename: string | null;
    requirement: string | null;
    requirementType: string | null;
    sort: string;
    offset: number;
    limit: number;
  }>({
    search: "",
    group: null,
    level: "all",
    status: "all",
    filename: null,
    requirement: null,
    requirementType: null,
    sort: "-level",
    offset: 0,
    limit: 50,
  });

  // === Getters ===
  const totalPages = computed(() =>
    Math.ceil(totalRules.value / filters.value.limit),
  );

  const currentPage = computed(() =>
    Math.floor(filters.value.offset / filters.value.limit) + 1,
  );

  // === Actions ===

  function _ensureAuth() {
    const wazuhStore = useWazuhStore();
    wazuhStore._registerApi();
  }

  async function fetchRules(): Promise<void> {
    rulesLoading.value = true;
    try {
      _ensureAuth();
      const params: Record<string, unknown> = {
        limit: filters.value.limit,
        offset: filters.value.offset,
        sort: filters.value.sort,
      };

      if (filters.value.search) {
        params.search = filters.value.search;
      }
      if (filters.value.group) {
        params.group = filters.value.group;
      }
      if (filters.value.status && filters.value.status !== "all") {
        params.status = filters.value.status;
      }
      if (filters.value.filename) {
        params.filename = filters.value.filename;
      }
      if (filters.value.level && filters.value.level !== "all") {
        switch (filters.value.level) {
          case "critical":
            params.level = "12-15";
            break;
          case "high":
            params.level = "10-11";
            break;
          case "medium":
            params.level = "7-9";
            break;
          case "low":
            params.level = "0-6";
            break;
          default:
            if (/^\d+-\d+$/.test(filters.value.level)) {
              params.level = filters.value.level;
            }
        }
      }
      if (filters.value.requirement && filters.value.requirementType) {
        params[filters.value.requirementType] = filters.value.requirement;
      }

      const response = await wazuhApi.getRules(params);
      rules.value = response.data.affected_items;
      totalRules.value = response.data.total_affected_items;
    } catch (e) {
      notifyError("Failed to fetch rules");
      console.error("[Rules] Fetch error:", e);
    } finally {
      rulesLoading.value = false;
    }
  }

  async function fetchRuleGroups(): Promise<void> {
    ruleGroupsLoading.value = true;
    try {
      _ensureAuth();
      const response = await wazuhApi.getRuleGroups();
      ruleGroups.value = response.data.affected_items;
    } catch (e) {
      notifyError("Failed to fetch rule groups");
      console.error("[Rules] Groups error:", e);
    } finally {
      ruleGroupsLoading.value = false;
    }
  }

  async function fetchRuleFiles(): Promise<void> {
    ruleFilesLoading.value = true;
    try {
      _ensureAuth();
      const response = await wazuhApi.getRuleFiles();
      ruleFiles.value = response.data.affected_items;
    } catch (e) {
      notifyError("Failed to fetch rule files");
      console.error("[Rules] Files error:", e);
    } finally {
      ruleFilesLoading.value = false;
    }
  }

  async function fetchRequirementValues(
    requirement: string,
  ): Promise<void> {
    requirementLoading.value = true;
    try {
      _ensureAuth();
      const response = await wazuhApi.getRuleRequirement(requirement);
      requirementValues.value = response.data.affected_items;
    } catch (e) {
      notifyError(`Failed to fetch ${requirement} values`);
      console.error("[Rules] Requirement error:", e);
    } finally {
      requirementLoading.value = false;
    }
  }

  async function fetchFileContent(filename: string): Promise<void> {
    fileContentLoading.value = true;
    fileContent.value = null;
    editingFilename.value = filename;
    try {
      _ensureAuth();
      const content = await wazuhApi.getRuleFileContent(filename);
      fileContent.value = content;
    } catch (e) {
      notifyError(`Failed to load file: ${filename}`);
      console.error("[Rules] File content error:", e);
    } finally {
      fileContentLoading.value = false;
    }
  }

  async function saveFileContent(
    filename: string,
    content: string,
  ): Promise<boolean> {
    try {
      _ensureAuth();
      await wazuhApi.putRuleFile(filename, content);
      notifySuccess(`Rule file "${filename}" saved successfully`);
      fileContent.value = content;
      return true;
    } catch (e) {
      notifyError(`Failed to save rule file "${filename}"`);
      console.error("[Rules] Save file error:", e);
      return false;
    }
  }

  async function deleteFile(filename: string): Promise<boolean> {
    try {
      _ensureAuth();
      await wazuhApi.deleteRuleFile(filename);
      notifySuccess(`Rule file "${filename}" deleted`);
      await fetchRuleFiles();
      return true;
    } catch (e) {
      notifyError(`Failed to delete rule file "${filename}"`);
      console.error("[Rules] Delete file error:", e);
      return false;
    }
  }

  function setPage(page: number): void {
    filters.value.offset = (page - 1) * filters.value.limit;
    fetchRules();
  }

  function setSort(field: string): void {
    if (filters.value.sort === `+${field}`) {
      filters.value.sort = `-${field}`;
    } else {
      filters.value.sort = `+${field}`;
    }
    filters.value.offset = 0;
    fetchRules();
  }

  function resetFilters(): void {
    filters.value = {
      search: "",
      group: null,
      level: "all",
      status: "all",
      filename: null,
      requirement: null,
      requirementType: null,
      sort: "-level",
      offset: 0,
      limit: 50,
    };
  }

  return {
    // State
    rules,
    totalRules,
    rulesLoading,
    ruleGroups,
    ruleGroupsLoading,
    ruleFiles,
    ruleFilesLoading,
    requirementValues,
    requirementLoading,
    fileContent,
    fileContentLoading,
    editingFilename,
    filters,

    // Getters
    totalPages,
    currentPage,

    // Actions
    fetchRules,
    fetchRuleGroups,
    fetchRuleFiles,
    fetchRequirementValues,
    fetchFileContent,
    saveFileContent,
    deleteFile,
    setPage,
    setSort,
    resetFilters,
  };
});
