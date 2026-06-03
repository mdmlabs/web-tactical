<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="modern-header">
      <!-- Banners -->
      <q-banner v-if="needRefresh" inline-actions class="refresh-banner">
        <div class="row items-center justify-center q-gutter-md">
          <q-icon name="info" size="sm" />
          <span>You are viewing an outdated version of this page.</span>
          <q-btn
            unelevated
            dense
            icon="refresh"
            label="Refresh"
            class="gradient-button-small"
            @click="store.dispatch('reload')"
          />
        </div>
      </q-banner>

      <q-banner
        v-if="!hosted && tokenExpired"
        inline-actions
        class="warning-banner"
      >
        <div class="text-center">
          <q-icon size="lg" name="warning" class="q-mb-sm" />
          <div class="text-body2">
            Your license is currently inactive, usually due to a payment issue.
          </div>
          <div class="text-caption q-mt-sm">
            To restore access, please update your payment method. If you need
            help, contact
            <a
              href="https://support.amidaware.com"
              target="_blank"
              rel="noopener"
              class="support-link"
              >support team</a
            >
          </div>
          <q-btn
            unelevated
            dense
            icon="refresh"
            label="Refresh"
            class="gradient-button-small q-mt-md"
            @click="store.dispatch('reload')"
          />
        </div>
      </q-banner>

      <q-toolbar class="modern-toolbar">
        <q-btn
          flat
          dense
          round
          :icon="
            $q.screen.width < 1024
              ? 'menu'
              : store.state.sidebarCollapsed
                ? 'menu_open'
                : 'menu'
          "
          class="toolbar-icon-btn"
          @click="toggleFileBarDrawer"
        >
          <q-tooltip>{{
            $q.screen.width < 1024
              ? "Open Menu"
              : store.state.sidebarCollapsed
                ? "Open menu"
                : "Close menu"
          }}</q-tooltip>
        </q-btn>
        <!-- Dashboard/Back Button -->
        <q-btn
          v-if="route.name === 'Dashboard'"
          flat
          dense
          round
          icon="refresh"
          class="toolbar-icon-btn"
          @click="store.dispatch('refreshDashboard')"
        >
          <q-tooltip>Refresh Dashboard</q-tooltip>
        </q-btn>
        <q-btn
          v-else
          flat
          dense
          round
          icon="dashboard"
          class="toolbar-icon-btn"
          @click="router.push({ name: 'Dashboard' })"
        >
          <q-tooltip>Back to Dashboard</q-tooltip>
        </q-btn>

        <!-- Logo & Title -->
        <q-toolbar-title class="toolbar-title">
          <div class="row items-center q-gutter-sm">
            <span class="logo-text">MDM-labs</span>
            <q-chip dense square class="version-chip"> v1.0.1 </q-chip>

            <!-- Update Available -->
            <q-chip
              v-if="updateAvailable"
              dense
              clickable
              class="update-chip"
              icon="update"
            >
              <a :href="latestReleaseURL" target="_blank" class="update-link">
                v{{ latestTRMMVersion }} available
              </a>
            </q-chip>

            <!-- SSL Warning -->
            <q-chip
              v-if="daysUntilCertExpires <= 15"
              dense
              class="ssl-warning-chip"
              icon="warning"
            >
              SSL expires in {{ daysUntilCertExpires }} days
            </q-chip>
          </div>
        </q-toolbar-title>

        <q-space />

        <LanguageSwitcher contrast class="q-mr-sm" />

        <!-- Web Terminal -->
        <!-- <q-btn
          v-if="!hosted"
          flat
          dense
          round
          icon="terminal"
          class="toolbar-icon-btn q-mr-sm"
          @click="openWebTerm"
        >
          <q-tooltip>Web Terminal</q-tooltip>
        </q-btn> -->

        <!-- Devices Counter -->
        <!-- <q-chip clickable class="devices-chip">
          <q-avatar size="32px" icon="devices" class="chip-avatar" />
          <span class="text-weight-medium">
            {{ serverCount + workstationCount }}
          </span>
          <q-tooltip>Agent Count</q-tooltip>

          <q-menu class="modern-menu">
            <q-list dense class="q-pa-sm">
              <q-item-label header class="text-weight-bold">
                <q-icon name="dns" size="sm" class="q-mr-xs" />
                Servers
              </q-item-label>
              <q-item class="menu-item">
                <q-item-section avatar>
                  <q-chip dense square color="primary" text-color="white">
                    {{ serverCount }}
                  </q-chip>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Total</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="menu-item">
                <q-item-section avatar>
                  <q-chip dense square color="negative" text-color="white">
                    {{ serverOfflineCount }}
                  </q-chip>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Offline</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-sm" />

              <q-item-label header class="text-weight-bold">
                <q-icon name="computer" size="sm" class="q-mr-xs" />
                Workstations
              </q-item-label>
              <q-item class="menu-item">
                <q-item-section avatar>
                  <q-chip dense square color="primary" text-color="white">
                    {{ workstationCount }}
                  </q-chip>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Total</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="menu-item">
                <q-item-section avatar>
                  <q-chip dense square color="negative" text-color="white">
                    {{ workstationOfflineCount }}
                  </q-chip>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Offline</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-chip> -->

        <!-- Documentation -->
        <q-btn
          flat
          dense
          round
          icon="menu_book"
          class="toolbar-icon-btn"
          @click="openDocumentation"
        >
          <q-tooltip>Documentation</q-tooltip>
        </q-btn>

        <!-- Alerts Icon -->
        <AlertsIcon class="q-mx-sm" />

        <!-- User Menu -->
        <q-btn-dropdown flat no-caps stretch class="user-dropdown">
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar
                size="32px"
                color="primary"
                text-color="white"
                class="q-mr-sm"
              >
                <q-icon name="person" />
              </q-avatar>
              <div class="text-weight-medium">{{ displayName || "" }}</div>
            </div>
          </template>

          <q-list class="modern-menu">
            <q-item
              clickable
              v-ripple
              @click="showUserPreferences"
              v-close-popup
              class="menu-item"
            >
              <q-item-section avatar>
                <q-icon name="settings" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Preferences</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable class="menu-item">
              <q-item-section avatar>
                <q-icon name="account_circle" color="primary" />
              </q-item-section>
              <q-item-section>Account</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start" class="modern-menu">
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    @click="resetPassword"
                    v-close-popup
                    class="menu-item"
                  >
                    <q-item-section avatar>
                      <q-icon name="lock_reset" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Reset Password</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>

            <q-separator class="q-my-sm" />

            <q-item to="/expired" exact class="menu-item logout-item">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <FileBar />

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Modern Header */
.modern-header {
  background: linear-gradient(
    135deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  box-shadow: rgba(133, 189, 215, 0.4) 0px 10px 30px -10px;
}

/* Toolbar */
.modern-toolbar {
  backdrop-filter: blur(10px);
  padding: 8px 16px;
}

/* Logo & Title */
.toolbar-title {
  font-size: 18px;
}

.logo-text {
  font-weight: 700;
  font-size: 22px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.version-chip {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  font-size: 11px;
}

/* Update & Warning Chips */
.update-chip {
  background: #ffd54f;
  color: #000;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.update-link {
  color: #000;
  text-decoration: none;
}

.ssl-warning-chip {
  background: #ff5252;
  color: white;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Toolbar Buttons */
.toolbar-icon-btn {
  color: white;
  transition: all 0.2s ease;
}

.toolbar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Devices Chip */
.devices-chip {
  background: rgba(255, 255, 255, 0.95);
  color: #1089d3;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

.devices-chip:hover {
  transform: scale(1.05);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.chip-avatar {
  background: linear-gradient(
    135deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white !important;
}

.chip-avatar :deep(.q-icon) {
  color: white !important;
}

/* User Dropdown */
.user-dropdown {
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Modern Menu */
.modern-menu {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(244, 247, 251, 0.98) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(18, 177, 209, 0.2);
  border-radius: 5px;
  box-shadow: rgba(133, 189, 215, 0.3) 0px 10px 30px -5px;
  min-width: 200px;
}

.menu-item {
  border-radius: 8px;
  margin: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.1) 0%,
    rgba(18, 177, 209, 0.15) 100%
  );
}

.logout-item:hover {
  background: rgba(255, 82, 82, 0.1);
}

/* Banners */
.refresh-banner {
  background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
  color: white;
  border: none;
}

.warning-banner {
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
  color: #000;
  border: none;
}

.gradient-button-small {
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 16px;
  transition: all 0.2s ease;
}

.gradient-button-small:hover {
  transform: scale(1.05);
  box-shadow: rgba(133, 189, 215, 0.5) 0px 8px 16px -4px;
}

.support-link {
  color: #1089d3;
  font-weight: 600;
  text-decoration: none;
}

.support-link:hover {
  text-decoration: underline;
}

/* Dark Theme */
.body--dark .modern-header,
.modern-header.dark-theme {
  background: linear-gradient(
    135deg,
    rgb(25, 35, 45) 0%,
    rgb(30, 40, 50) 100%
  ) !important;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 30px -10px;
}

.body--dark .modern-menu {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.98) 0%,
    rgba(40, 45, 55, 0.98) 100%
  );
  border: 1px solid rgba(18, 177, 209, 0.3);
  border-radius: 5px;
}

.body--dark .devices-chip {
  background: rgba(50, 55, 60, 0.95);
  color: #12b1d1;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.body--dark .devices-chip:hover {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.6),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.body--dark .chip-avatar {
  background: linear-gradient(135deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%);
}

.body--dark .gradient-button-small {
  background: linear-gradient(45deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%);
}
</style>

<style>
.main-page-container {
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.q-tooltip {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.95) 0%,
    rgba(18, 177, 209, 0.95) 100%
  ) !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 12px !important;
  padding: 8px 12px !important;
  border-radius: 8px !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

.body--dark .q-tooltip {
  background: linear-gradient(
    135deg,
    rgba(25, 35, 45, 0.95) 0%,
    rgba(30, 40, 50, 0.95) 100%
  ) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
}
</style>

<script setup lang="ts">
// composition imports
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useDashboardStore } from "@/stores/dashboard";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

// webtermn
// import { checkWebTermPerms, openWebTerminal } from "@/api/core";

// ui imports
import AlertsIcon from "@/components/AlertsIcon.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import UserPreferences from "@/components/modals/coresettings/UserPreferences.vue";
import ResetPass from "@/components/accounts/ResetPass.vue";
import FileBar from "@/components/FileBar.vue";
import { useDomI18n } from "@/utils/dom-i18n";

const store = useStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

useDomI18n({
  root: () => document.querySelector(".modern-header"),
});
useDomI18n({
  root: () => document.querySelector(".filebar-drawer"),
});
useDomI18n({
  root: () => document.querySelector(".main-page-container"),
  debounceMs: 120,
});

const {
  // serverCount,
  // serverOfflineCount,
  // workstationCount,
  // workstationOfflineCount,
  daysUntilCertExpires,
} = storeToRefs(useDashboardStore());

const { displayName } = storeToRefs(useAuthStore());

const currentTRMMVersion = computed(() => store.state.currentTRMMVersion);
const latestTRMMVersion = computed(() => store.state.latestTRMMVersion);
const needRefresh = computed(() => store.state.needrefresh);
const hosted = computed(() => store.state.hosted);
const tokenExpired = computed(() => store.state.tokenExpired);
// const dash_warning_color = computed(() => store.state.dash_warning_color);
// const dash_negative_color = computed(() => store.state.dash_negative_color);

const latestReleaseURL = computed(() => {
  return latestTRMMVersion.value
    ? `https://github.com/amidaware/tacticalrmm/releases/tag/v${latestTRMMVersion.value}`
    : "";
});

function showUserPreferences() {
  $q.dialog({
    component: UserPreferences,
  }).onOk(() => store.dispatch("getDashInfo"));
}

function resetPassword() {
  $q.dialog({
    component: ResetPass,
  });
}

const DEFAULT_DOCS_PATH = "/docs/en/01-home/";
const FALLBACK_DOCS_URL = "https://app.bcycp.vn/docs/en/01-home/";

interface WindowWithDocsEnv extends Window {
  _env_?: {
    DOCS_URL?: string;
    APP_HOST?: string;
  };
}

function joinOriginAndDocsPath(origin: string, path: string): string {
  const o = origin.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${o}${p}`;
}

function docsUrlFromRuntimeEnv(
  env: WindowWithDocsEnv["_env_"] | undefined,
): string | undefined {
  if (!env) return FALLBACK_DOCS_URL;

  let explicit = env.DOCS_URL?.trim();
  if (explicit?.includes("${APP_HOST}")) {
    const host = env.APP_HOST?.trim();
    if (host) explicit = explicit.split("${APP_HOST}").join(host);
  }
  if (explicit) return explicit;

  const host = env.APP_HOST?.trim();
  if (!host) return FALLBACK_DOCS_URL;
  if (/^https?:\/\//i.test(host)) {
    return joinOriginAndDocsPath(host, DEFAULT_DOCS_PATH);
  }
  return joinOriginAndDocsPath(`https://${host}`, DEFAULT_DOCS_PATH);
}

function getDocsUrl(): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return docsUrlFromRuntimeEnv(
      (globalThis.window as WindowWithDocsEnv)._env_,
    );
  }
  return docsUrlFromRuntimeEnv({
    DOCS_URL: process.env.DEV_DOCS_URL,
    APP_HOST: process.env.APP_HOST,
  });
}

function openDocumentation() {
  const documentationUrl = getDocsUrl();

  if (!documentationUrl) {
    $q.notify({
      type: "negative",
      message: "Documentation URL is not set",
      timeout: 2500,
    });
    return;
  }

  window.open(documentationUrl, "_blank", "noopener,noreferrer");
}

// async function openWebTerm() {
//   try {
//     const { message, status } = await checkWebTermPerms();
//     if (status === 412) {
//       notifyError(message);
//     } else {
//       openWebTerminal();
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

const updateAvailable = computed(() => {
  if (
    latestTRMMVersion.value === "error" ||
    hosted.value ||
    currentTRMMVersion.value?.includes("-dev")
  )
    return false;
  return currentTRMMVersion.value !== latestTRMMVersion.value;
});

const poll = ref<NodeJS.Timeout | null>(null);

function livePoll() {
  poll.value = setInterval(
    () => {
      store.dispatch("checkVer");
      store.dispatch("getDashInfo", false);
    },
    60 * 4 * 1000,
  );
}

onMounted(() => {
  store.dispatch("getDashInfo");
  store.dispatch("checkVer");
  livePoll();
});

onBeforeUnmount(() => {
  if (poll.value) {
    clearInterval(poll.value);
  }
});

function toggleFileBarDrawer() {
  if (window.innerWidth < 1024) {
    store.commit("SET_FILEBAR_DRAWER", !store.state.fileBarDrawerOpen);
  } else {
    store.commit("SET_SIDEBAR_COLLAPSED", !store.state.sidebarCollapsed);
  }
}
</script>
