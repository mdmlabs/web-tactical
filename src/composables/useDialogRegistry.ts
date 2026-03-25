import { markRaw, type Component } from "vue";
import { useQuasar } from "quasar";

type DialogFactory = () => Promise<{ default: Component }>;

const registry = new Map<string, DialogFactory>();

// Agents
registry.set(
  "editAgent",
  () => import("@/components/modals/agents/EditAgent.vue"),
);
registry.set(
  "installAgent",
  () => import("@/components/modals/agents/InstallAgent.vue"),
);
registry.set(
  "updateAgents",
  () => import("@/components/modals/agents/UpdateAgents.vue"),
);
registry.set(
  "updateMdmAgents",
  () => import("@/components/modals/agents/UpdateMdmAgents.vue"),
);
registry.set(
  "bulkAction",
  () => import("@/components/modals/agents/BulkAction.vue"),
);
registry.set(
  "runScript",
  () => import("@/components/modals/agents/RunScript.vue"),
);
registry.set(
  "sendCommand",
  () => import("@/components/modals/agents/SendCommand.vue"),
);
registry.set(
  "agentRecovery",
  () => import("@/components/modals/agents/AgentRecovery.vue"),
);
registry.set(
  "rebootLater",
  () => import("@/components/modals/agents/RebootLater.vue"),
);
registry.set(
  "agentDownload",
  () => import("@/components/modals/agents/AgentDownload.vue"),
);

// Alerts
registry.set(
  "alertTemplateAdd",
  () => import("@/components/modals/alerts/AlertTemplateAdd.vue"),
);
registry.set(
  "alertsOverview",
  () => import("@/components/modals/alerts/AlertsOverview.vue"),
);

// Core / Settings
registry.set(
  "serverMaintenance",
  () => import("@/components/modals/core/ServerMaintenance.vue"),
);

// Logs
registry.set("auditLog", () => import("@/components/logs/AuditManager.vue"));
registry.set("debugLog", () => import("@/components/logs/DebugLog.vue"));
registry.set(
  "pendingActions",
  () => import("@/components/logs/PendingActions.vue"),
);

// Scripts
registry.set(
  "scriptManager",
  () => import("@/components/scripts/ScriptManager.vue"),
);

// Admin
registry.set(
  "adminManager",
  () => import("@/components/AdminManager.vue"),
);
registry.set(
  "alertsManager",
  () => import("@/components/AlertsManager.vue"),
);

// Reports
registry.set(
  "reportsManager",
  () => import("@/reports/components/ReportsManager.vue"),
);

/**
 * Lazy dialog loading composable. Replaces FileBar.vue switch statement.
 */
export function useDialogRegistry() {
  const $q = useQuasar();

  async function openDialog(
    name: string,
    props?: Record<string, unknown>,
  ): Promise<void> {
    const factory = registry.get(name);
    if (!factory) {
      console.warn(`Dialog "${name}" not found in registry.`);
      return;
    }

    const module = await factory();
    $q.dialog({
      component: markRaw(module.default),
      componentProps: props,
    });
  }

  return { openDialog };
}
