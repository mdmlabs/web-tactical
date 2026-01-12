<template>
  <q-drawer
    v-model="drawerOpen"
    :width="280"
    :breakpoint="1024"
    bordered
    class="filebar-drawer"
    :overlay="overlayMode"
  >
    <div class="filebar-drawer-content">
      <div class="filebar-drawer-header">
        <div class="filebar-drawer-title">
          <span style="padding: 0 12px">Menu</span>
        </div>
        <q-btn
          flat
          dense
          round
          icon="close"
          size="sm"
          @click="closeDrawer"
          class="close-btn"
        />
      </div>

      <q-scroll-area class="filebar-menu-scroll">
        <q-list class="filebar-menu-list">
          <q-expansion-item
            icon="folder"
            label="File"
            default-opened
            class="filebar-menu-section"
          >
            <q-list>
              <q-expansion-item
                icon="add_circle_outline"
                label="Add"
                class="filebar-menu-subsection"
              >
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    @click="handleMenuAction('addClient')"
                    class="filebar-menu-item"
                  >
                    <q-item-section avatar>
                      <q-icon name="business" />
                    </q-item-section>
                    <q-item-section>Client</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    @click="handleMenuAction('addSite')"
                    class="filebar-menu-item"
                  >
                    <q-item-section avatar>
                      <q-icon name="business_center" />
                    </q-item-section>
                    <q-item-section>Site</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('auditLog')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="history" />
                </q-item-section>
                <q-item-section>Audit Log</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('debugLog')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="bug_report" />
                </q-item-section>
                <q-item-section>Debug Log</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="visibility"
            label="View"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('pendingActions')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="pending_actions" />
                </q-item-section>
                <q-item-section>Pending Actions</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="dns"
            label="Agents"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('installAgent')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="download" />
                </q-item-section>
                <q-item-section>Install Agent</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('deployments')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="cloud_download" />
                </q-item-section>
                <q-item-section>Manage Deployments</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('updateAgents')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="system_update" />
                </q-item-section>
                <q-item-section>Update Agents</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="settings"
            label="Settings"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('clientsManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>
                <q-item-section>Clients Manager</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('scriptManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="code" />
                </q-item-section>
                <q-item-section>Script Manager</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('automationManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="auto_awesome" />
                </q-item-section>
                <q-item-section>Automation Manager</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('alertsManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="notifications" />
                </q-item-section>
                <q-item-section>Alerts Manager</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('permissionsManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="admin_panel_settings" />
                </q-item-section>
                <q-item-section>Permissions Manager</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('adminManager')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="manage_accounts" />
                </q-item-section>
                <q-item-section>User Administration</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('globalSettings')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="tune" />
                </q-item-section>
                <q-item-section>Global Settings</q-item-section>
              </q-item>
              <q-item
                v-if="!hosted"
                clickable
                v-ripple
                @click="handleMenuAction('codeSign')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="verified" />
                </q-item-section>
                <q-item-section>Code Signing</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="navigateToGPO"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="policy" />
                </q-item-section>
                <q-item-section>Policy Manager</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="build"
            label="Tools"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('bulkCommand')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="terminal" />
                </q-item-section>
                <q-item-section>Bulk Command</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('bulkScript')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="article" />
                </q-item-section>
                <q-item-section>Bulk Script</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('bulkPatch')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="update" />
                </q-item-section>
                <q-item-section>Bulk Patch Management</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('bulkSoftware')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="apps" />
                </q-item-section>
                <q-item-section>Bulk Software</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('serverMaintenance')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="construction" />
                </q-item-section>
                <q-item-section>Server Maintenance</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('clearCache')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="cleaning_services" />
                </q-item-section>
                <q-item-section>Clear Cache</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('recoverAgents')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="restart_alt" />
                </q-item-section>
                <q-item-section>Recover All Agents</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- <q-expansion-item
            v-if="!hosted"
            icon="help"
            label="Help"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpDocs')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="menu_book" />
                </q-item-section>
                <q-item-section>Documentation</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpGithub')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="code" />
                </q-item-section>
                <q-item-section>GitHub Repo</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpBug')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="bug_report" />
                </q-item-section>
                <q-item-section>Bug Report</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpFeature')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="lightbulb" />
                </q-item-section>
                <q-item-section>Feature Request</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpDiscord')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="chat" />
                </q-item-section>
                <q-item-section>Join Discord</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item> -->
        </q-list>
      </q-scroll-area>
    </div>

    <q-dialog v-model="showEditCoreSettingsModal">
      <EditCoreSettings @close="showEditCoreSettingsModal = false" />
    </q-dialog>
    <q-dialog v-model="showInstallAgent">
      <InstallAgent @close="showInstallAgent = false" />
    </q-dialog>
    <q-dialog
      v-model="showUpdateAgentsModal"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <UpdateAgents @close="showUpdateAgentsModal = false" />
    </q-dialog>
    <q-dialog v-model="showAdminManager">
      <AdminManager @close="showAdminManager = false" />
    </q-dialog>
    <q-dialog v-model="showServerMaintenance">
      <ServerMaintenance @close="showServerMaintenance = false" />
    </q-dialog>
    <q-dialog v-model="showCodeSign">
      <CodeSign @close="showCodeSign = false" />
    </q-dialog>
  </q-drawer>
</template>

<script>
import mixins from "@/mixins/mixins";
import DialogWrapper from "@/components/ui/DialogWrapper.vue";
import DebugLog from "@/components/logs/DebugLog.vue";
import PendingActions from "@/components/logs/PendingActions.vue";
import ClientsManager from "@/components/clients/ClientsManager.vue";
import ClientsForm from "@/components/clients/ClientsForm.vue";
import SitesForm from "@/components/clients/SitesForm.vue";
import UpdateAgents from "@/components/modals/agents/UpdateAgents.vue";
import ScriptManager from "@/components/scripts/ScriptManager.vue";
import EditCoreSettings from "@/components/modals/coresettings/EditCoreSettings.vue";
import AlertsManager from "@/components/AlertsManager.vue";
import AutomationManager from "@/components/automation/AutomationManager.vue";
import AdminManager from "@/components/AdminManager.vue";
import InstallAgent from "@/components/modals/agents/InstallAgent.vue";
import AuditManager from "@/components/logs/AuditManager.vue";
import BulkAction from "@/components/modals/agents/BulkAction.vue";
import DeploymentTable from "@/components/clients/DeploymentTable.vue";
import ServerMaintenance from "@/components/modals/core/ServerMaintenance.vue";
import CodeSign from "@/components/modals/coresettings/CodeSign.vue";
import PermissionsManager from "@/components/accounts/PermissionsManager.vue";

export default {
  name: "FileBar",
  mixins: [mixins],
  components: {
    UpdateAgents,
    EditCoreSettings,
    InstallAgent,
    AdminManager,
    ServerMaintenance,
    CodeSign,
  },
  data() {
    return {
      showServerMaintenance: false,
      showUpdateAgentsModal: false,
      showEditCoreSettingsModal: false,
      showAdminManager: false,
      showInstallAgent: false,
      showCodeSign: false,
    };
  },
  computed: {
    hosted() {
      return this.$store.state.hosted;
    },
    drawerOpen: {
      get() {
        return this.$store.state.fileBarDrawerOpen;
      },
      set(val) {
        this.$store.commit("SET_FILEBAR_DRAWER", val);
      },
    },
    overlayMode() {
      return this.$q.screen.width < 1024;
    },
  },
  methods: {
    closeDrawer() {
      this.drawerOpen = false;
    },
    handleMenuAction(action) {
      // клозим дравер на мобилках после выбора действия
      if (this.overlayMode) {
        this.closeDrawer();
      }

      switch (action) {
        case "addClient":
          this.showAddClientModal();
          break;
        case "addSite":
          this.showAddSiteModal();
          break;
        case "auditLog":
          this.showAuditManager();
          break;
        case "debugLog":
          this.showDebugLog();
          break;
        case "pendingActions":
          this.showPendingActions();
          break;
        case "installAgent":
          this.showInstallAgent = true;
          break;
        case "deployments":
          this.showDeployments();
          break;
        case "updateAgents":
          this.showUpdateAgentsModal = true;
          break;
        case "clientsManager":
          this.showClientsManager();
          break;
        case "scriptManager":
          this.showScriptManager();
          break;
        case "automationManager":
          this.showAutomationManager();
          break;
        case "alertsManager":
          this.showAlertsManager();
          break;
        case "permissionsManager":
          this.showPermissionsManager();
          break;
        case "adminManager":
          this.showAdminManager = true;
          break;
        case "globalSettings":
          this.showEditCoreSettingsModal = true;
          break;
        case "codeSign":
          this.showCodeSign = true;
          break;
        case "bulkCommand":
          this.showBulkAction("command");
          break;
        case "bulkScript":
          this.showBulkAction("script");
          break;
        case "bulkPatch":
          this.showBulkAction("patch");
          break;
        case "bulkSoftware":
          this.showBulkAction("software");
          break;
        case "serverMaintenance":
          this.showServerMaintenance = true;
          break;
        case "clearCache":
          this.clearCache();
          break;
        case "recoverAgents":
          this.bulkRecoverAgents();
          break;
        case "helpDocs":
          this.openHelp("docs");
          break;
        case "helpGithub":
          this.openHelp("github");
          break;
        case "helpBug":
          this.openHelp("bug");
          break;
        case "helpFeature":
          this.openHelp("feature");
          break;
        case "helpDiscord":
          this.openHelp("discord");
          break;
      }
    },
    navigateToGPO() {
      // клозим дравер на мобилках после выбора действия
      if (this.overlayMode) {
        this.closeDrawer();
      }
      this.$router.push("/gpo");
    },
    clearCache() {
      this.$axios
        .get("/core/clearcache/")
        .then((r) => this.notifySuccess(r.data));
    },
    bulkRecoverAgents() {
      this.$q
        .dialog({
          title: "Bulk Recover All Agents?",
          message:
            "This will restart the Tactical and Mesh Agent services on all agents",
          cancel: true,
        })
        .onOk(() => {
          this.$axios
            .get("/agents/bulkrecovery/")
            .then((r) => this.notifySuccess(r.data));
        });
    },
    openHelp(mode) {
      let url;
      switch (mode) {
        case "github":
          url = "https://github.com/amidaware/tacticalrmm/";
          break;
        case "docs":
          url = "https://docs.tacticalrmm.com";
          break;
        case "bug":
          url =
            "https://github.com/amidaware/tacticalrmm/issues/new?template=bug_report.md";
          break;
        case "feature":
          url =
            "https://github.com/amidaware/tacticalrmm/issues/new?template=feature_request.md";
          break;
        case "discord":
          url = "https://discord.gg/upGTkWp";
          break;
      }
      window.open(url, "_blank");
    },
    showAutomationManager() {
      this.$q.dialog({
        component: AutomationManager,
      });
    },
    showAlertsManager() {
      this.$q.dialog({
        component: AlertsManager,
      });
    },
    showClientsManager() {
      this.$q
        .dialog({
          component: ClientsManager,
        })
        .onDismiss(() => this.$store.dispatch("refreshDashboard", true));
    },
    showAddClientModal() {
      this.$q
        .dialog({
          component: ClientsForm,
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    showAddSiteModal() {
      this.$q
        .dialog({
          component: SitesForm,
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    showPermissionsManager() {
      this.$q.dialog({
        component: PermissionsManager,
      });
    },
    showAuditManager() {
      this.$q.dialog({
        component: DialogWrapper,
        componentProps: {
          vuecomponent: AuditManager,
          noCard: true,
          componentProps: {
            modal: true,
          },
          dialogProps: {
            maximized: true,
            ["transition-show"]: "slide-up",
            ["transition-hide"]: "slide-down",
          },
        },
      });
    },
    showScriptManager() {
      this.$q.dialog({
        component: ScriptManager,
      });
    },
    showBulkAction(mode) {
      this.$q.dialog({
        component: BulkAction,
        componentProps: {
          mode: mode,
        },
      });
    },
    showDebugLog() {
      this.$q.dialog({
        component: DialogWrapper,
        componentProps: {
          vuecomponent: DebugLog,
          noCard: true,
          componentProps: {
            modal: true,
          },
          dialogProps: {
            maximized: true,
            ["transition-show"]: "slide-up",
            ["transition-hide"]: "slide-down",
          },
        },
      });
    },
    showPendingActions() {
      this.$q.dialog({
        component: PendingActions,
      });
    },
    showDeployments() {
      this.$q.dialog({
        component: DeploymentTable,
      });
    },
    showReportsManager() {
      this.$q.dialog({
        component: ReportsManager,
      });
    },
  },
};
</script>

<style scoped>
.filebar-drawer {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(244, 247, 251, 0.98) 100%
  );
  backdrop-filter: blur(10px);
}

.filebar-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filebar-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(
    135deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filebar-drawer-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.filebar-menu-scroll {
  flex: 1;
  height: calc(100vh - 80px);
}

.filebar-menu-list {
  padding: 8px;
}

.filebar-menu-section {
  margin-bottom: 4px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(18, 177, 209, 0.1);
}

.filebar-menu-section :deep(.q-item) {
  border-radius: 8px;
}

.filebar-menu-section :deep(.q-expansion-item__container) {
  border-radius: 8px;
}

.filebar-menu-section :deep(.q-expansion-item__content) {
  background: rgba(255, 255, 255, 0.3);
}

.filebar-menu-item {
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.filebar-menu-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.1) 0%,
    rgba(18, 177, 209, 0.15) 100%
  );
  transform: translateX(4px);
}

.filebar-menu-item :deep(.q-item-section) {
  color: #333;
  font-weight: 500;
}

.filebar-menu-item :deep(.q-icon) {
  color: rgb(16, 137, 211);
}

.filebar-menu-subsection {
  margin-left: 8px;
}

.filebar-menu-subsection :deep(.q-expansion-item__content) {
  background: rgba(255, 255, 255, 0.2);
}

.body--dark .filebar-drawer {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.98) 0%,
    rgba(40, 45, 55, 0.98) 100%
  );
}

.body--dark .filebar-drawer-header {
  background: linear-gradient(135deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%);
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 8px;
}

.body--dark .filebar-menu-section {
  background: rgba(50, 55, 60, 0.5);
  border: 1px solid rgba(18, 177, 209, 0.3);
}

.body--dark .filebar-menu-section :deep(.q-expansion-item__content) {
  background: rgba(40, 45, 50, 0.3);
}

.body--dark .filebar-menu-item :deep(.q-item-section) {
  color: #e0e0e0;
}

.body--dark .filebar-menu-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.2) 0%,
    rgba(18, 177, 209, 0.25) 100%
  );
}

.body--dark .filebar-menu-item :deep(.q-icon) {
  color: #12b1d1;
}

.body--dark .filebar-menu-subsection :deep(.q-expansion-item__content) {
  background: rgba(35, 40, 45, 0.2);
}
</style>
