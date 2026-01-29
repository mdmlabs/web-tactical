<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="['modern-header', { 'dark-theme': darkMode }]">
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
          icon="menu"
          class="toolbar-icon-btn"
          @click="toggleFileBarDrawer"
        >
          <q-tooltip>Open Menu</q-tooltip>
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
            <q-chip dense square class="version-chip">
              v1.0.1
            </q-chip>

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

        <!-- Dark Mode Toggle -->
        <label class="theme-switch q-mr-md">
          <input
            :checked="!darkMode"
            type="checkbox"
            @change="handleThemeChange"
          />
          <span class="slider">
            <div class="star star_1"></div>
            <div class="star star_2"></div>
            <div class="star star_3"></div>
            <svg viewBox="0 0 16 16" class="cloud_1 cloud">
              <path
                transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                fill="#fff"
                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
              ></path>
            </svg>
          </span>
        </label>

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
        <q-chip clickable class="devices-chip">
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
        </q-chip>

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

    <q-page-container>
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


.theme-switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 1.5em;
  border-radius: 30px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1a1a2e;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-switch .slider:before {
  position: absolute;
  content: "";
  height: 0.7em;
  width: 0.7em;
  border-radius: 50%;
  left: 0.5em;
  bottom: 0.3em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  background: #fff;
  mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  -webkit-mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(255, 255, 255, 0.4);
}


.theme-switch input:checked + .slider {
  background-color: #0099ff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switch input:checked + .slider:before {
  transform: translateX(1.8em);
  mask: none;
  -webkit-mask: none;
  background: radial-gradient(circle, #ffcf48 0%, #ffcf48 100%);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.3) inset,
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 12px rgba(255, 207, 72, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.theme-switch input:checked ~ .slider .star {
  opacity: 0;
}

.theme-switch input:checked ~ .slider .cloud {
  opacity: 1;
}


.theme-switch .star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 6px;
  height: 6px;
  transition: all 0.4s;
  box-shadow:
    0 0 3px rgba(255, 255, 255, 0.8),
    0 0 6px rgba(255, 255, 255, 0.4);
}

.theme-switch .star_1 {
  left: 1.5em;
  top: 0.3em;
}

.theme-switch .star_2 {
  left: 2.3em;
  top: 0.5em;
}

.theme-switch .star_3 {
  left: 1.9em;
  top: 0.9em;
}

.theme-switch .cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}


.body--dark .theme-switch {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
}


.body--light .theme-switch,
.theme-switch {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
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
import axios from "axios";

// webtermn
// import { checkWebTermPerms, openWebTerminal } from "@/api/core";

// ui imports
import AlertsIcon from "@/components/AlertsIcon.vue";
import UserPreferences from "@/components/modals/coresettings/UserPreferences.vue";
import ResetPass from "@/components/accounts/ResetPass.vue";
import FileBar from "@/components/FileBar.vue";

const store = useStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const {
  serverCount,
  serverOfflineCount,
  workstationCount,
  workstationOfflineCount,
  daysUntilCertExpires,
} = storeToRefs(useDashboardStore());

const { displayName } = storeToRefs(useAuthStore());

const darkMode = computed({
  get: () => {
    return $q.dark.isActive;
  },
  set: async (value) => {
    // изначально устанавливаем тему локально для мгновенного отклика
    $q.dark.set(value);
    // затем сохраняем на сервере
    try {
      await axios.patch("/accounts/users/ui/", { dark_mode: value });
    } catch (error) {
      // в случае ерора откатываем изменение
      $q.dark.set(!value);
      console.error("Failed to save dark mode preference:", error);
    }
  },
});

function handleThemeChange(event: Event) {
  const target = event.target as HTMLInputElement;
  darkMode.value = !target.checked;
}

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
  store.commit("SET_FILEBAR_DRAWER", !store.state.fileBarDrawerOpen);
}
</script>
