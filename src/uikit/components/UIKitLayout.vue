<template>
  <div :class="['uk-layout', themeClass]">
    <!-- Sidebar -->
    <aside :class="['uk-sidebar', { 'uk-sidebar--collapsed': sidebarCollapsed }]">
      <div class="uk-sidebar__brand">
        <div class="uk-sidebar__logo">
          <q-icon name="shield" size="24px" />
        </div>
        <transition name="uk-fade">
          <span v-if="!sidebarCollapsed" class="uk-sidebar__brand-text">MDM-labs</span>
        </transition>
      </div>

      <!-- Navigation -->
      <nav class="uk-sidebar__nav uk-scrollbar">
        <div
          v-for="item in navItems"
          :key="item.id"
          :class="['uk-sidebar__item', { 'uk-sidebar__item--active': activeNav === item.id }]"
          @click="activeNav = item.id"
        >
          <q-icon :name="item.icon" size="20px" class="uk-sidebar__item-icon" />
          <transition name="uk-fade">
            <span v-if="!sidebarCollapsed" class="uk-sidebar__item-label">{{ item.label }}</span>
          </transition>
          <transition name="uk-fade">
            <span
              v-if="!sidebarCollapsed && item.badge"
              :class="['uk-sidebar__badge', item.badgeColor === 'error' ? 'uk-sidebar__badge--error' : '']"
            >
              {{ item.badge }}
            </span>
          </transition>
          <q-tooltip v-if="sidebarCollapsed" anchor="center right" self="center left" :offset="[8, 0]">
            {{ item.label }}
            <span v-if="item.badge"> ({{ item.badge }})</span>
          </q-tooltip>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="uk-sidebar__footer">
        <div
          class="uk-sidebar__item"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <q-icon :name="sidebarCollapsed ? 'chevron_right' : 'chevron_left'" size="20px" class="uk-sidebar__item-icon" />
          <transition name="uk-fade">
            <span v-if="!sidebarCollapsed" class="uk-sidebar__item-label">Collapse</span>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="uk-main">
      <!-- Header -->
      <header class="uk-header">
        <div class="uk-header__left">
          <!-- Breadcrumbs -->
          <nav class="uk-breadcrumbs">
            <span
              v-for="(crumb, i) in breadcrumbs"
              :key="i"
              class="uk-breadcrumbs__item"
            >
              <span
                :class="['uk-breadcrumbs__link', { 'uk-breadcrumbs__link--current': i === breadcrumbs.length - 1 }]"
              >
                {{ crumb }}
              </span>
              <q-icon v-if="i < breadcrumbs.length - 1" name="chevron_right" size="14px" class="uk-breadcrumbs__sep" />
            </span>
          </nav>
        </div>

        <div class="uk-header__center">
          <!-- Global Search -->
          <div class="uk-search">
            <q-icon name="search" size="18px" class="uk-search__icon" />
            <input
              v-model="searchQuery"
              type="text"
              class="uk-search__input"
              placeholder="Search agents, policies, scripts..."
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            <div class="uk-search__shortcut">
              <kbd>/</kbd>
            </div>

            <!-- Search Results Dropdown -->
            <transition name="uk-slide-down">
              <div v-if="searchFocused && searchQuery.length > 0" class="uk-search__dropdown">
                <div class="uk-search__section">
                  <div class="uk-search__section-title">Agents</div>
                  <div
                    v-for="result in filteredSearchResults.agents"
                    :key="result.id"
                    class="uk-search__result"
                  >
                    <q-icon name="dns" size="16px" />
                    <span>{{ result.hostname }}</span>
                    <span class="uk-search__result-meta">{{ result.clientName }}</span>
                  </div>
                </div>
                <div v-if="filteredSearchResults.policies.length" class="uk-search__section">
                  <div class="uk-search__section-title">Policies</div>
                  <div
                    v-for="policy in filteredSearchResults.policies"
                    :key="policy.id"
                    class="uk-search__result"
                  >
                    <q-icon name="rule" size="16px" />
                    <span>{{ policy.name }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="uk-header__right">
          <!-- Theme Toggle -->
          <button class="uk-header__icon-btn" @click="toggleTheme" :title="isDark ? 'Switch to Light' : 'Switch to Dark'">
            <q-icon :name="isDark ? 'light_mode' : 'dark_mode'" size="18px" />
          </button>

          <!-- Alerts -->
          <button class="uk-header__icon-btn uk-header__icon-btn--alerts">
            <q-icon name="notifications" size="18px" />
            <span class="uk-header__alert-dot"></span>
          </button>

          <!-- User -->
          <div class="uk-header__user">
            <div class="uk-header__avatar">
              <q-icon name="person" size="16px" />
            </div>
            <span class="uk-header__username">admin</span>
            <q-icon name="expand_more" size="16px" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="uk-content uk-scrollbar">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { navItems, mockAgents, mockPolicies } from "../mockData";

const sidebarCollapsed = ref(false);
const activeNav = ref("agents");
const searchQuery = ref("");
const searchFocused = ref(false);
const isDark = ref(true);

const themeClass = computed(() => (isDark.value ? "uk-theme-dark" : "uk-theme-light"));

const breadcrumbs = computed(() => {
  const map: Record<string, string[]> = {
    dashboard: ["Dashboard"],
    agents: ["Agents", "All Agents"],
    policies: ["Settings", "Policies"],
    automation: ["Automation"],
    scripts: ["Scripts"],
    resources: ["Resources"],
    alerts: ["Monitoring", "Alerts"],
    logs: ["System", "Audit Logs"],
    reports: ["Analytics", "Reports"],
    settings: ["Settings"],
  };
  return map[activeNav.value] || ["Dashboard"];
});

const filteredSearchResults = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return {
    agents: mockAgents.filter(
      (a) =>
        a.hostname.toLowerCase().includes(q) ||
        a.clientName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    ).slice(0, 5),
    policies: mockPolicies.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 3),
  };
});

function toggleTheme() {
  isDark.value = !isDark.value;
}
</script>

<style scoped>
/* ============================================================
   LAYOUT
   ============================================================ */
.uk-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: var(--uk-font-family);
  background: var(--uk-bg-base);
  color: var(--uk-text-primary);
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.uk-sidebar {
  width: var(--uk-sidebar-width);
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--uk-bg-surface);
  border-right: 1px solid var(--uk-border-default);
  transition: width var(--uk-transition-slow);
  flex-shrink: 0;
  z-index: var(--uk-z-sidebar);
}

.uk-sidebar--collapsed {
  width: var(--uk-sidebar-collapsed);
}

.uk-sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--uk-space-3);
  padding: var(--uk-space-4);
  height: var(--uk-header-height);
  border-bottom: 1px solid var(--uk-border-default);
  flex-shrink: 0;
}

.uk-sidebar__logo {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--uk-primary);
  flex-shrink: 0;
}

.uk-sidebar__brand-text {
  font-size: var(--uk-text-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--uk-text-primary);
  white-space: nowrap;
}

.uk-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--uk-space-2);
}

.uk-sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-3);
  padding: var(--uk-space-2) var(--uk-space-3);
  border-radius: var(--uk-radius-md);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  color: var(--uk-text-secondary);
  margin-bottom: 2px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.uk-sidebar__item:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

.uk-sidebar__item--active {
  background: var(--uk-bg-active);
  color: var(--uk-primary);
}

.uk-sidebar__item--active .uk-sidebar__item-icon {
  color: var(--uk-primary);
}

.uk-sidebar__item-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.uk-sidebar__item-label {
  font-size: var(--uk-text-base);
  font-weight: 500;
  flex: 1;
}

.uk-sidebar__badge {
  font-size: var(--uk-text-xs);
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-primary-soft);
  color: var(--uk-primary-text);
}

.uk-sidebar__badge--error {
  background: var(--uk-error-soft);
  color: var(--uk-error-text);
}

.uk-sidebar__footer {
  padding: var(--uk-space-2);
  border-top: 1px solid var(--uk-border-default);
  flex-shrink: 0;
}

/* ============================================================
   MAIN
   ============================================================ */
.uk-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* ============================================================
   HEADER
   ============================================================ */
.uk-header {
  height: var(--uk-header-height);
  display: flex;
  align-items: center;
  gap: var(--uk-space-4);
  padding: 0 var(--uk-space-4);
  border-bottom: 1px solid var(--uk-border-default);
  background: var(--uk-bg-surface);
  flex-shrink: 0;
  z-index: var(--uk-z-header);
}

.uk-header__left {
  display: flex;
  align-items: center;
}

.uk-header__center {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
}

.uk-header__right {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
}

/* Breadcrumbs */
.uk-breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
}

.uk-breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
}

.uk-breadcrumbs__link {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  cursor: pointer;
  transition: color var(--uk-transition-fast);
}

.uk-breadcrumbs__link:hover {
  color: var(--uk-text-primary);
}

.uk-breadcrumbs__link--current {
  color: var(--uk-text-primary);
  font-weight: 500;
  cursor: default;
}

.uk-breadcrumbs__sep {
  color: var(--uk-text-tertiary);
}

/* Search */
.uk-search {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.uk-search__icon {
  position: absolute;
  left: var(--uk-space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--uk-text-tertiary);
  pointer-events: none;
}

.uk-search__input {
  width: 100%;
  height: 32px;
  padding: 0 var(--uk-space-10) 0 36px;
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-md);
  color: var(--uk-text-primary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  outline: none;
  transition: all var(--uk-transition-base);
}

.uk-search__input::placeholder {
  color: var(--uk-text-tertiary);
}

.uk-search__input:focus {
  border-color: var(--uk-border-focus);
  box-shadow: 0 0 0 3px var(--uk-primary-soft);
}

.uk-search__shortcut {
  position: absolute;
  right: var(--uk-space-3);
  top: 50%;
  transform: translateY(-50%);
}

.uk-search__shortcut kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--uk-radius-sm);
  border: 1px solid var(--uk-border-default);
  background: var(--uk-bg-overlay);
  color: var(--uk-text-tertiary);
  font-size: 10px;
  font-family: var(--uk-font-family);
}

/* Search Dropdown */
.uk-search__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
  box-shadow: var(--uk-shadow-lg);
  padding: var(--uk-space-2);
  z-index: var(--uk-z-dropdown);
  max-height: 400px;
  overflow-y: auto;
}

.uk-search__section {
  margin-bottom: var(--uk-space-2);
}

.uk-search__section:last-child {
  margin-bottom: 0;
}

.uk-search__section-title {
  font-size: var(--uk-text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--uk-text-tertiary);
  padding: var(--uk-space-1) var(--uk-space-2);
}

.uk-search__result {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-2);
  border-radius: var(--uk-radius-sm);
  cursor: pointer;
  font-size: var(--uk-text-sm);
  color: var(--uk-text-primary);
  transition: background var(--uk-transition-fast);
}

.uk-search__result:hover {
  background: var(--uk-bg-hover);
}

.uk-search__result-meta {
  margin-left: auto;
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
}

/* Header Icon Button */
.uk-header__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--uk-radius-md);
  background: transparent;
  color: var(--uk-text-secondary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  position: relative;
}

.uk-header__icon-btn:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

.uk-header__icon-btn--alerts .uk-header__alert-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--uk-error);
  border: 1.5px solid var(--uk-bg-surface);
}

/* User */
.uk-header__user {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-1) var(--uk-space-2);
  border-radius: var(--uk-radius-md);
  cursor: pointer;
  transition: background var(--uk-transition-fast);
}

.uk-header__user:hover {
  background: var(--uk-bg-hover);
}

.uk-header__avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--uk-text-inverse);
}

.uk-header__username {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

/* ============================================================
   CONTENT
   ============================================================ */
.uk-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--uk-space-6);
}

/* ============================================================
   TRANSITIONS
   ============================================================ */
.uk-fade-enter-active,
.uk-fade-leave-active {
  transition: opacity var(--uk-transition-base);
}

.uk-fade-enter-from,
.uk-fade-leave-to {
  opacity: 0;
}

.uk-slide-down-enter-active,
.uk-slide-down-leave-active {
  transition: all var(--uk-transition-base);
}

.uk-slide-down-enter-from,
.uk-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
