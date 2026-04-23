import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Notify } from "quasar";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import {
  fetchMonitors,
  fetchMonitor,
  createMonitor as apiCreateMonitor,
  updateMonitor as apiUpdateMonitor,
  deleteMonitor as apiDeleteMonitor,
  enableMonitor as apiEnableMonitor,
  disableMonitor as apiDisableMonitor,
  fetchAlerts,
  acknowledgeAlerts as apiAcknowledgeAlerts,
  fetchChannels,
  createChannel as apiCreateChannel,
  deleteChannel as apiDeleteChannel,
  testChannel as apiTestChannel,
  fetchSmtpSenders,
  createSmtpSender as apiCreateSmtpSender,
  deleteSmtpSender as apiDeleteSmtpSender,
  fetchSesSenders,
  createSesSender as apiCreateSesSender,
  deleteSesSender as apiDeleteSesSender,
  fetchRecipientGroups,
  createRecipientGroup as apiCreateRecipientGroup,
  deleteRecipientGroup as apiDeleteRecipientGroup,
} from "@/api/alertingRules";
import type {
  Monitor,
  AlertEntry,
  AlertState,
  NotificationChannel,
  SmtpSender,
  SesSender,
  RecipientGroup,
  AlertQueryTestResult,
} from "@/types/alerting";
import type { OpenSearchQueryBody } from "@/types/fim";

export const useAlertingStore = defineStore("alerting", () => {
  // === Top-level tab ===
  const activeTab = ref<"alerts" | "monitors" | "destinations">("alerts");

  // === Monitors ===
  const monitors = ref<Monitor[]>([]);
  const monitorsLoading = ref(false);
  const monitorsSearch = ref("");
  const monitorsStateFilter = ref("all");
  const selectedMonitorIds = ref<string[]>([]);

  const filteredMonitors = computed(() => {
    let result = monitors.value;
    if (monitorsStateFilter.value !== "all") {
      const enabled = monitorsStateFilter.value === "enabled";
      result = result.filter((m) => m.enabled === enabled);
    }
    if (monitorsSearch.value.trim()) {
      const q = monitorsSearch.value.toLowerCase().trim();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  });

  // Current monitor detail
  const currentMonitor = ref<Monitor | null>(null);
  const currentMonitorLoading = ref(false);
  const currentMonitorAlerts = ref<AlertEntry[]>([]);
  const currentMonitorAlertsLoading = ref(false);

  // === Alerts ===
  const alerts = ref<AlertEntry[]>([]);
  const alertsLoading = ref(false);
  const alertsSearch = ref("");
  const alertsSeverityFilter = ref("all");
  const alertsStatusFilter = ref<"all" | AlertState>("all");
  const selectedAlertIds = ref<string[]>([]);

  const filteredAlerts = computed(() => {
    let result = alerts.value;
    if (alertsStatusFilter.value !== "all") {
      result = result.filter((a) => a.state === alertsStatusFilter.value);
    }
    if (alertsSeverityFilter.value !== "all") {
      result = result.filter((a) => a.severity === alertsSeverityFilter.value);
    }
    if (alertsSearch.value.trim()) {
      const q = alertsSearch.value.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.trigger_name.toLowerCase().includes(q) ||
          a.monitor_name.toLowerCase().includes(q),
      );
    }
    return result;
  });

  // === Notification Channels ===
  const channels = ref<NotificationChannel[]>([]);
  const channelsLoading = ref(false);

  // === Email Senders ===
  const smtpSenders = ref<SmtpSender[]>([]);
  const smtpSendersLoading = ref(false);
  const sesSenders = ref<SesSender[]>([]);
  const sesSendersLoading = ref(false);

  // === Recipient Groups ===
  const recipientGroups = ref<RecipientGroup[]>([]);
  const recipientGroupsLoading = ref(false);

  // === Query test ===
  const queryTestLoading = ref(false);
  const queryTestResult = ref<AlertQueryTestResult | null>(null);

  // === Create monitor wizard ===
  const showCreateMonitor = ref(false);
  const editingMonitor = ref<Monitor | null>(null);

  // ========== ACTIONS ==========

  // --- Monitors ---
  async function loadMonitors() {
    monitorsLoading.value = true;
    try {
      monitors.value = await fetchMonitors();
    } catch (e) {
      console.error("[Alerting] Failed to load monitors:", e);
      Notify.create({ type: "negative", message: "Failed to load monitors", timeout: 3000 });
    } finally {
      monitorsLoading.value = false;
    }
  }

  async function loadMonitor(id: string) {
    currentMonitorLoading.value = true;
    try {
      currentMonitor.value = await fetchMonitor(id);
    } catch (e) {
      console.error("[Alerting] Failed to load monitor:", e);
      Notify.create({ type: "negative", message: "Failed to load monitor details", timeout: 3000 });
    } finally {
      currentMonitorLoading.value = false;
    }
  }

  async function createMonitor(payload: Partial<Monitor>) {
    const created = await apiCreateMonitor(payload);
    monitors.value.unshift(created);
    Notify.create({ type: "positive", message: `Monitor "${created.name}" created`, timeout: 3000 });
    return created;
  }

  async function updateMonitor(id: string, payload: Partial<Monitor>) {
    const updated = await apiUpdateMonitor(id, payload);
    const idx = monitors.value.findIndex((m) => m.id === id);
    if (idx >= 0) monitors.value[idx] = updated;
    if (currentMonitor.value?.id === id) currentMonitor.value = updated;
    Notify.create({ type: "positive", message: `Monitor "${updated.name}" updated`, timeout: 3000 });
    return updated;
  }

  async function removeMonitors(ids: string[]) {
    for (const id of ids) {
      await apiDeleteMonitor(id);
    }
    monitors.value = monitors.value.filter((m) => !ids.includes(m.id));
    selectedMonitorIds.value = [];
    Notify.create({ type: "positive", message: `${ids.length} monitor(s) deleted`, timeout: 3000 });
  }

  async function enableMonitors(ids: string[]) {
    for (const id of ids) {
      const updated = await apiEnableMonitor(id);
      const idx = monitors.value.findIndex((m) => m.id === id);
      if (idx >= 0) monitors.value[idx] = updated;
    }
    selectedMonitorIds.value = [];
    Notify.create({ type: "positive", message: `${ids.length} monitor(s) enabled`, timeout: 3000 });
  }

  async function disableMonitors(ids: string[]) {
    for (const id of ids) {
      const updated = await apiDisableMonitor(id);
      const idx = monitors.value.findIndex((m) => m.id === id);
      if (idx >= 0) monitors.value[idx] = updated;
    }
    selectedMonitorIds.value = [];
    Notify.create({ type: "positive", message: `${ids.length} monitor(s) disabled`, timeout: 3000 });
  }

  // --- Alerts ---
  async function loadAlerts() {
    alertsLoading.value = true;
    try {
      alerts.value = await fetchAlerts();
    } catch (e) {
      console.error("[Alerting] Failed to load alerts:", e);
      alerts.value = [];
    } finally {
      alertsLoading.value = false;
    }
  }

  async function loadMonitorAlerts(monitorId: string) {
    currentMonitorAlertsLoading.value = true;
    try {
      currentMonitorAlerts.value = await fetchAlerts({ monitor_id: monitorId });
    } catch {
      currentMonitorAlerts.value = [];
    } finally {
      currentMonitorAlertsLoading.value = false;
    }
  }

  async function acknowledgeAlerts(ids: string[]) {
    try {
      // Group alert IDs by monitor_id (OpenSearch requires per-monitor acknowledge)
      const byMonitor = new Map<string, string[]>();
      for (const id of ids) {
        const alert = alerts.value.find((a) => a.id === id);
        if (alert) {
          const list = byMonitor.get(alert.monitor_id) || [];
          list.push(id);
          byMonitor.set(alert.monitor_id, list);
        }
      }
      for (const [monitorId, alertIds] of byMonitor) {
        await apiAcknowledgeAlerts(alertIds, monitorId);
      }
      for (const id of ids) {
        const alert = alerts.value.find((a) => a.id === id);
        if (alert) alert.state = "acknowledged";
      }
      selectedAlertIds.value = [];
      Notify.create({ type: "positive", message: `${ids.length} alert(s) acknowledged`, timeout: 3000 });
    } catch (e) {
      console.error("[Alerting] Failed to acknowledge alerts:", e);
      Notify.create({ type: "negative", message: "Failed to acknowledge alerts", timeout: 3000 });
    }
  }

  // --- Channels ---
  async function loadChannels() {
    channelsLoading.value = true;
    try {
      channels.value = await fetchChannels();
    } catch {
      channels.value = [];
    } finally {
      channelsLoading.value = false;
    }
  }

  async function createChannel(payload: Partial<NotificationChannel>) {
    const created = await apiCreateChannel(payload);
    channels.value.unshift(created);
    Notify.create({ type: "positive", message: `Channel "${created.name}" created`, timeout: 3000 });
    return created;
  }

  async function removeChannel(id: string) {
    await apiDeleteChannel(id);
    channels.value = channels.value.filter((c) => c.config_id !== id);
    Notify.create({ type: "positive", message: "Channel deleted", timeout: 3000 });
  }

  async function sendTestMessage(id: string) {
    try {
      const resp = await apiTestChannel(id);
      Notify.create({
        type: resp.success ? "positive" : "warning",
        message: resp.success ? "Test message sent successfully" : resp.message,
        timeout: 3000,
      });
    } catch (e) {
      Notify.create({ type: "negative", message: "Failed to send test message", timeout: 3000 });
    }
  }

  // --- SMTP / SES Senders ---
  async function loadSmtpSenders() {
    smtpSendersLoading.value = true;
    try {
      smtpSenders.value = await fetchSmtpSenders();
    } catch {
      smtpSenders.value = [];
    } finally {
      smtpSendersLoading.value = false;
    }
  }

  async function createSmtpSender(payload: Partial<SmtpSender>) {
    const created = await apiCreateSmtpSender(payload);
    smtpSenders.value.unshift(created);
    Notify.create({ type: "positive", message: "SMTP sender created", timeout: 3000 });
    return created;
  }

  async function removeSmtpSender(id: string) {
    await apiDeleteSmtpSender(id);
    smtpSenders.value = smtpSenders.value.filter((s) => s.config_id !== id);
  }

  async function loadSesSenders() {
    sesSendersLoading.value = true;
    try {
      sesSenders.value = await fetchSesSenders();
    } catch {
      sesSenders.value = [];
    } finally {
      sesSendersLoading.value = false;
    }
  }

  async function createSesSender(payload: Partial<SesSender>) {
    const created = await apiCreateSesSender(payload);
    sesSenders.value.unshift(created);
    Notify.create({ type: "positive", message: "SES sender created", timeout: 3000 });
    return created;
  }

  async function removeSesSender(id: string) {
    await apiDeleteSesSender(id);
    sesSenders.value = sesSenders.value.filter((s) => s.config_id !== id);
  }

  // --- Recipient Groups ---
  async function loadRecipientGroups() {
    recipientGroupsLoading.value = true;
    try {
      recipientGroups.value = await fetchRecipientGroups();
    } catch {
      recipientGroups.value = [];
    } finally {
      recipientGroupsLoading.value = false;
    }
  }

  async function createRecipientGroup(payload: Partial<RecipientGroup>) {
    const created = await apiCreateRecipientGroup(payload);
    recipientGroups.value.unshift(created);
    Notify.create({ type: "positive", message: "Recipient group created", timeout: 3000 });
    return created;
  }

  async function removeRecipientGroup(id: string) {
    await apiDeleteRecipientGroup(id);
    recipientGroups.value = recipientGroups.value.filter((g) => g.config_id !== id);
  }

  // --- Query test ---
  async function testQuery(
    indexPattern: string,
    query: string,
  ): Promise<AlertQueryTestResult> {
    queryTestLoading.value = true;
    queryTestResult.value = null;
    try {
      const must: Record<string, unknown>[] = [];
      if (query.trim()) {
        must.push({ query_string: { query: query.trim(), default_operator: "AND" } });
      }
      const body = {
        query: must.length > 0 ? { bool: { must } } : { match_all: {} },
        size: 0,
        track_total_hits: true,
      } as OpenSearchQueryBody;
      const indexMap: Record<string, string> = {
        "ossec-alerts-*": "wazuh-alerts-*",
        "ossec-archives-*": "wazuh-archives-*",
      };
      const apiIndex = indexMap[indexPattern] ?? indexPattern;
      const resp = await wazuhIndexerApi.search(apiIndex, body);
      const result: AlertQueryTestResult = { success: true, count: resp.hits.total.value };
      queryTestResult.value = result;
      return result;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Query validation failed";
      const result: AlertQueryTestResult = { success: false, count: 0, error: msg };
      queryTestResult.value = result;
      return result;
    } finally {
      queryTestLoading.value = false;
    }
  }

  // --- Navigation ---
  function setActiveTab(tab: "alerts" | "monitors" | "destinations") {
    activeTab.value = tab;
    switch (tab) {
      case "alerts": loadAlerts(); break;
      case "monitors": loadMonitors(); break;
      case "destinations": loadChannels(); loadSmtpSenders(); loadSesSenders(); loadRecipientGroups(); break;
    }
  }

  function refreshActiveTab() {
    setActiveTab(activeTab.value);
  }

  function openCreateMonitor(prefill?: Partial<Monitor>) {
    editingMonitor.value = prefill ? (prefill as Monitor) : null;
    showCreateMonitor.value = true;
  }

  function closeCreateMonitor() {
    showCreateMonitor.value = false;
    editingMonitor.value = null;
  }

  return {
    activeTab,
    monitors, monitorsLoading, monitorsSearch, monitorsStateFilter,
    selectedMonitorIds, filteredMonitors,
    currentMonitor, currentMonitorLoading,
    currentMonitorAlerts, currentMonitorAlertsLoading,
    alerts, alertsLoading, alertsSearch, alertsSeverityFilter, alertsStatusFilter,
    selectedAlertIds, filteredAlerts,
    channels, channelsLoading,
    smtpSenders, smtpSendersLoading, sesSenders, sesSendersLoading,
    recipientGroups, recipientGroupsLoading,
    queryTestLoading, queryTestResult,
    showCreateMonitor, editingMonitor,

    loadMonitors, loadMonitor, createMonitor, updateMonitor,
    removeMonitors, enableMonitors, disableMonitors,
    loadAlerts, loadMonitorAlerts, acknowledgeAlerts,
    loadChannels, createChannel, removeChannel, sendTestMessage,
    loadSmtpSenders, createSmtpSender, removeSmtpSender,
    loadSesSenders, createSesSender, removeSesSender,
    loadRecipientGroups, createRecipientGroup, removeRecipientGroup,
    testQuery,
    setActiveTab, refreshActiveTab,
    openCreateMonitor, closeCreateMonitor,
  };
});
