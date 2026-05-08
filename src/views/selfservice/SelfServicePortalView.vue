<template>
  <q-page class="ssp-page">
    <div class="ssp-container">
      <!-- Header -->
      <div class="ssp-header">
        <div class="ssp-header-content">
          <div class="row items-center q-gutter-md">
            <q-icon name="self_improvement" size="36px" color="white" />
            <div>
              <div class="ssp-header-title">Self-Service Portal</div>
              <div class="ssp-header-subtitle">{{ store.selectedOrganization }}</div>
            </div>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-chip
              :color="store.currentRole === 'admin' ? 'orange' : 'light-blue'"
              text-color="white"
              icon="person"
              dense
            >
              {{ store.currentRole === 'admin' ? 'Administrator' : 'User' }}
            </q-chip>
            <q-btn-dropdown flat dense color="white" :label="store.currentRole" no-caps>
              <q-list dense>
                <q-item clickable v-close-popup @click="store.currentRole = 'user'">
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>User</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="store.currentRole = 'admin'">
                  <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
                  <q-item-section>Admin</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </div>

      <!-- Tabs navigation -->
      <q-tabs
        v-model="activeTab"
        dense
        class="ssp-tabs"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="dashboard" icon="dashboard" label="Dashboard" />
        <q-tab name="apps" icon="apps" label="App Catalog" />
        <q-tab name="devices" icon="devices" label="Devices" />
        <q-tab name="rights" icon="vpn_key" label="Rights" />
        <q-tab name="profile" icon="person" label="Profile" />
        <q-tab v-if="store.isAdmin" name="identity" icon="fingerprint" label="Identity & Params" />
        <q-tab v-if="store.isAdmin" name="admin" icon="settings" label="Admin Config" />
        <q-tab v-if="store.isAdmin" name="approvals" icon="approval" label="Approvals">
          <q-badge v-if="store.pendingApprovals.length > 0" color="red" floating>
            {{ store.pendingApprovals.length }}
          </q-badge>
        </q-tab>
      </q-tabs>

      <!-- Tab panels -->
      <q-tab-panels v-model="activeTab" animated class="ssp-panels">
        <q-tab-panel name="dashboard">
          <SspDashboard />
        </q-tab-panel>
        <q-tab-panel name="apps">
          <SspAppCatalog />
        </q-tab-panel>
        <q-tab-panel name="devices">
          <SspDeviceManagement />
        </q-tab-panel>
        <q-tab-panel name="rights">
          <SspRightsManagement />
        </q-tab-panel>
        <q-tab-panel name="profile">
          <SspProfileSettings />
        </q-tab-panel>
        <q-tab-panel v-if="store.isAdmin" name="identity">
          <SspIdentityParams />
        </q-tab-panel>
        <q-tab-panel v-if="store.isAdmin" name="admin">
          <SspAdminConfig />
        </q-tab-panel>
        <q-tab-panel v-if="store.isAdmin" name="approvals">
          <SspApprovalQueue />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSelfServiceStore } from "@/stores/selfService";
import SspDashboard from "./SspDashboard.vue";
import SspAppCatalog from "./SspAppCatalog.vue";
import SspDeviceManagement from "./SspDeviceManagement.vue";
import SspRightsManagement from "./SspRightsManagement.vue";
import SspProfileSettings from "./SspProfileSettings.vue";
import SspIdentityParams from "./SspIdentityParams.vue";
import SspAdminConfig from "./SspAdminConfig.vue";
import SspApprovalQueue from "./SspApprovalQueue.vue";

const store = useSelfServiceStore();
const activeTab = ref("dashboard");

// Reset to dashboard when switching roles if on admin-only tab
watch(() => store.currentRole, (newRole) => {
  if (newRole === "user" && ["identity", "admin", "approvals"].includes(activeTab.value)) {
    activeTab.value = "dashboard";
  }
});
</script>

<style scoped>
.ssp-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.ssp-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.ssp-header {
  background: linear-gradient(135deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
  padding: 20px 24px;
  color: white;
}

.ssp-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ssp-header-title {
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.ssp-header-subtitle {
  font-size: 13px;
  opacity: 0.85;
}

.ssp-tabs {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.ssp-panels {
  background: transparent;
  min-height: calc(100vh - 220px);
}

.ssp-panels :deep(.q-tab-panel) {
  padding: 16px;
}

.body--dark .ssp-page {
  background: #1a1a2e;
}

.body--dark .ssp-header {
  background: linear-gradient(135deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%);
}

.body--dark .ssp-tabs {
  background: #1e1e2e;
  border-bottom-color: #333;
}
</style>
