import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import type { OpenSearchQueryBody } from "@/types/fim";

interface ComplianceRequirement {
  requirement: string;
  count: number;
}

type FrameworkKey = "pci_dss" | "gdpr" | "hipaa" | "nist_800_53" | "tsc";

const FRAMEWORK_LABELS: Record<FrameworkKey, string> = {
  pci_dss: "PCI DSS",
  gdpr: "GDPR",
  hipaa: "HIPAA",
  nist_800_53: "NIST 800-53",
  tsc: "TSC",
};

export const useAgentComplianceStore = defineStore("agentCompliance", () => {
  const complianceData = ref<Record<FrameworkKey, ComplianceRequirement[]>>({
    pci_dss: [],
    gdpr: [],
    hipaa: [],
    nist_800_53: [],
    tsc: [],
  });
  const loading = ref(false);

  const availableFrameworks = computed(() => {
    const keys = Object.keys(complianceData.value) as FrameworkKey[];
    return keys
      .filter((k) => complianceData.value[k].length > 0)
      .map((k) => ({ label: FRAMEWORK_LABELS[k], value: k }));
  });

  function getDataForFramework(framework: string): ComplianceRequirement[] {
    return complianceData.value[framework as FrameworkKey] ?? [];
  }

  async function fetchComplianceForAgent(agentId: string): Promise<void> {
    loading.value = true;
    try {
      const body: OpenSearchQueryBody = {
        query: {
          bool: {
            must: [
              { term: { "agent.id": agentId } },
              {
                range: {
                  "@timestamp": { gte: "now-24h", lte: "now" },
                },
              },
            ],
            should: [
              { exists: { field: "rule.pci_dss" } },
              { exists: { field: "rule.gdpr" } },
              { exists: { field: "rule.hipaa" } },
              { exists: { field: "rule.nist_800_53" } },
              { exists: { field: "rule.tsc" } },
            ],
            minimum_should_match: 1,
          },
        },
        size: 0,
        aggs: {
          pci_dss: { terms: { field: "rule.pci_dss", size: 10 } },
          gdpr: { terms: { field: "rule.gdpr", size: 10 } },
          hipaa: { terms: { field: "rule.hipaa", size: 10 } },
          nist_800_53: { terms: { field: "rule.nist_800_53", size: 10 } },
          tsc: { terms: { field: "rule.tsc", size: 10 } },
        },
      };

      const resp = await wazuhIndexerApi.search("wazuh-alerts-*", body);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggs = resp.aggregations as any;

      const parseAgg = (key: string): ComplianceRequirement[] => {
        const buckets = aggs?.[key]?.buckets ?? [];
        return buckets.map((b: { key: string; doc_count: number }) => ({
          requirement: b.key,
          count: b.doc_count,
        }));
      };

      complianceData.value = {
        pci_dss: parseAgg("pci_dss"),
        gdpr: parseAgg("gdpr"),
        hipaa: parseAgg("hipaa"),
        nist_800_53: parseAgg("nist_800_53"),
        tsc: parseAgg("tsc"),
      };
    } catch (e) {
      console.error("[AgentCompliance] Failed to fetch compliance data:", e);
      complianceData.value = {
        pci_dss: [],
        gdpr: [],
        hipaa: [],
        nist_800_53: [],
        tsc: [],
      };
    } finally {
      loading.value = false;
    }
  }

  function $reset() {
    complianceData.value = {
      pci_dss: [],
      gdpr: [],
      hipaa: [],
      nist_800_53: [],
      tsc: [],
    };
    loading.value = false;
  }

  return {
    complianceData,
    loading,
    availableFrameworks,
    getDataForFramework,
    fetchComplianceForAgent,
    $reset,
  };
});
