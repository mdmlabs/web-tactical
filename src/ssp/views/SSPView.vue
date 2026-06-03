<template>
  <q-layout view="hHh lpR fFf" class="ssp-layout">
    <!-- Header -->
    <q-header class="ssp-header">
      <q-toolbar class="ssp-toolbar">
        <!-- Brand -->
        <div class="ssp-brand">
          <div class="ssp-brand-icon">
            <q-icon name="shield" size="20px" color="white" />
          </div>
          <span class="ssp-brand-name">{{
            $t("ssp.views.SSPView.96fa52")
          }}</span>
        </div>

        <q-space />

        <LanguageSwitcher contrast class="ssp-language-switcher" />

        <q-btn
          flat
          dense
          round
          icon="support_agent"
          class="ssp-header-btn"
          @click="router.push('/ssp/info')"
        >
          <q-tooltip>Contact support</q-tooltip>
        </q-btn>

        <!-- User info -->
        <div class="ssp-user row items-center q-gutter-sm">
          <div class="ssp-avatar">{{ initials }}</div>
          <div class="ssp-user-info column">
            <span class="ssp-user-name">{{ auth.displayName }}</span>
            <span class="ssp-user-role">{{
              $t("ssp.views.SSPView.079711")
            }}</span>
          </div>
          <q-btn
            flat
            dense
            round
            icon="logout"
            class="ssp-logout-btn"
            @click="logout"
          >
            <q-tooltip>{{ $t("ssp.views.SSPView.e43d61") }}</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>

      <!-- Tab Navigation -->
      <div class="ssp-nav">
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          custom
          v-slot="{ isActive, navigate }"
        >
          <button
            :class="[
              'ssp-nav-item',
              { 'ssp-nav-item--active': isActive },
              { 'ssp-nav-item--danger': tab.danger },
            ]"
            @click="navigate"
          >
            <q-icon :name="tab.icon" size="18px" class="ssp-nav-icon" />
            <span class="ssp-nav-label">{{ tab.label }}</span>
          </button>
        </router-link>
      </div>
    </q-header>

    <q-page-container class="ssp-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useDomI18n } from "@/utils/dom-i18n";

const auth = useAuthStore();
const router = useRouter();
useDomI18n({
  root: () => document.querySelector(".ssp-layout"),
});

const initials = computed(() => {
  const name = auth.displayName || "";
  return (
    name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
});

const tabs = [
  { to: "/ssp/devices", icon: "devices", label: "My Devices", danger: false },
  { to: "/ssp/apps", icon: "apps", label: "App Catalog", danger: false },
  {
    to: "/ssp/rights",
    icon: "verified_user",
    label: "My Rights",
    danger: false,
  },
  { to: "/ssp/password", icon: "lock", label: "Password", danger: false },
  { to: "/ssp/profile", icon: "person", label: "My Profile", danger: false },
  { to: "/ssp/info", icon: "menu_book", label: "Info Portal", danger: false },
  {
    to: "/ssp/lost-device",
    icon: "report_problem",
    label: "Report Lost Device",
    danger: true,
  },
];

async function logout() {
  await auth.logout();
  router.push({ name: "Login" });
}
</script>

<style scoped>
/* ─── Header ─── */
.ssp-header {
  background: #0f172a !important;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06) !important;
}

.ssp-toolbar {
  padding: 0 24px;
  height: 56px;
  min-height: 56px;
}

/* ─── Brand ─── */
.ssp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ssp-brand-icon {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.35);
  flex-shrink: 0;
}

.ssp-brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

/* ─── User ─── */
.ssp-user {
  display: flex;
  align-items: center;
}

.ssp-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.ssp-user-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.2;
}

.ssp-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
}

.ssp-user-role {
  font-size: 11px;
  color: #64748b;
}

.ssp-logout-btn {
  color: #64748b !important;
  margin-left: 4px;
}

.ssp-logout-btn:hover {
  color: #94a3b8 !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

.ssp-header-btn {
  color: #cbd5e1 !important;
  margin-right: 12px;
}

.ssp-language-switcher {
  margin-right: 12px;
}

.ssp-header-btn:hover {
  color: #f8fafc !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

/* ─── Tab Navigation ─── */
.ssp-nav {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
  scrollbar-width: none;
}

.ssp-nav::-webkit-scrollbar {
  display: none;
}

.ssp-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;
  border-radius: 6px 6px 0 0;
}

.ssp-nav-item:hover {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
}

.ssp-nav-item--active {
  color: #f8fafc !important;
  border-bottom-color: #2563eb !important;
}

.ssp-nav-icon {
  color: inherit;
  flex-shrink: 0;
}

/* Danger tab (Report Lost Device) */
.ssp-nav-item--danger {
  color: #f87171;
}

.ssp-nav-item--danger:hover {
  color: #fca5a5;
  background: rgba(220, 38, 38, 0.08);
}

.ssp-nav-item--danger.ssp-nav-item--active {
  color: #fca5a5 !important;
  border-bottom-color: #dc2626 !important;
}

/* ─── Page container ─── */
.ssp-page-container {
  background: #f8fafc;
  box-sizing: border-box;
  height: 100vh;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto !important;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
</style>

<style>
.ssp-layout {
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.ssp-layout .q-page-container {
  overflow-y: auto !important;
}
</style>
