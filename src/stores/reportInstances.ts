import { defineStore } from "pinia";
import { listReportInstances } from "@/api/reportingPlugin";
import { extractWazuhError } from "@/api/wazuhReporting";
import type { ReportInstance } from "@/types/reportInstance";

interface State {
  items: ReportInstance[];
  loading: boolean;
  error: string | null;
}

export const useReportInstancesStore = defineStore("reportInstances", {
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
        this.items = await listReportInstances();
      } catch (err) {
        this.error = extractWazuhError(err);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
