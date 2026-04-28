import { defineStore } from "pinia";
import {
  createReportDefinition,
  deleteReportDefinition,
  generateReport,
  getReportDefinition,
  listReportDefinitions,
  updateReportDefinition,
} from "@/api/reportingPlugin";
import { extractWazuhError } from "@/api/wazuhReporting";
import type {
  ReportDefinitionPayload,
  ReportDefinitionSummary,
} from "@/types/reportDefinition";

interface State {
  items: ReportDefinitionSummary[];
  loading: boolean;
  error: string | null;
}

export const useReportDefinitionsStore = defineStore("reportDefinitions", {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async reload() {
      this.loading = true;
      this.error = null;
      try {
        this.items = await listReportDefinitions();
      } catch (err) {
        this.error = extractWazuhError(err);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    async fetch(id: string): Promise<ReportDefinitionPayload | null> {
      try {
        return await getReportDefinition(id);
      } catch (err) {
        this.error = extractWazuhError(err);
        return null;
      }
    },
    async create(payload: ReportDefinitionPayload): Promise<string> {
      const id = await createReportDefinition(payload);
      void this.reload();
      return id;
    },
    async update(id: string, payload: ReportDefinitionPayload): Promise<void> {
      await updateReportDefinition(id, payload);
      void this.reload();
    },
    async remove(id: string): Promise<void> {
      await deleteReportDefinition(id);
      this.items = this.items.filter((d) => d.id !== id);
    },
    async runNow(id: string): Promise<void> {
      await generateReport(id);
    },
    async toggleEnabled(id: string): Promise<void> {
      const payload = await getReportDefinition(id);
      if (!payload) throw new Error("Definition not found");
      if (payload.trigger.trigger_type !== "Schedule") {
        throw new Error("Only scheduled definitions can be toggled");
      }
      const next: ReportDefinitionPayload = {
        ...payload,
        trigger: {
          ...payload.trigger,
          trigger_params: {
            ...payload.trigger.trigger_params,
            enabled: !payload.trigger.trigger_params.enabled,
          },
        },
      };
      await updateReportDefinition(id, next);
      void this.reload();
    },
  },
});
