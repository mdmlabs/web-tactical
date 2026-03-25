<template>
  <div class="uk-settings">
    <div class="uk-page-header">
      <div class="uk-page-header__left">
        <h1 class="uk-page-title">Settings</h1>
      </div>
    </div>

    <div class="uk-settings__layout">
      <aside class="uk-settings__sidebar">
        <div v-for="group in settingsGroups" :key="group.label" class="uk-settings__group">
          <div class="uk-settings__group-title">{{ group.label }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.route"
            :to="item.route"
            :class="[
              'uk-sidebar__item',
              { 'uk-sidebar__item--active': $route.path === item.route },
            ]"
          >
            <q-icon :name="item.icon" size="18px" class="uk-sidebar__item-icon" />
            <span class="uk-sidebar__item-label">{{ item.label }}</span>
          </router-link>
        </div>
      </aside>

      <div class="uk-settings__content">
        <router-view />
        <div v-if="$route.path === '/settings'" class="uk-settings__empty">
          <q-icon name="settings" size="48px" color="grey-6" />
          <p>Select a settings category from the sidebar.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const settingsGroups = [
  {
    label: "Organization",
    items: [
      { label: "Clients", icon: "business", route: "/settings/clients" },
      { label: "Users & Permissions", icon: "group", route: "/settings/users" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Alerts", icon: "notifications", route: "/settings/alerts" },
      { label: "Automation", icon: "auto_fix_high", route: "/settings/automation" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Global Settings", icon: "tune", route: "/settings/global" },
    ],
  },
];
</script>

<style scoped>
.uk-settings__layout {
  display: flex;
  gap: var(--uk-space-6);
  min-height: 0;
  flex: 1;
}

.uk-settings__sidebar {
  width: 220px;
  flex-shrink: 0;
}

.uk-settings__group {
  margin-bottom: var(--uk-space-4);
}

.uk-settings__group-title {
  font-size: var(--uk-text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-tertiary);
  padding: var(--uk-space-1) var(--uk-space-3);
  margin-bottom: var(--uk-space-1);
}

.uk-settings__content {
  flex: 1;
  min-width: 0;
}

.uk-settings__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--uk-text-tertiary);
  font-size: var(--uk-text-sm);
}

.uk-page-title {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
  margin: 0;
}

.uk-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--uk-space-6);
}

/* Sidebar items */
.uk-sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--uk-space-3);
  padding: var(--uk-space-2) var(--uk-space-3);
  border-radius: var(--uk-radius-md);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
  color: var(--uk-text-secondary);
  text-decoration: none;
  margin-bottom: 2px;
}

.uk-sidebar__item:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

.uk-sidebar__item--active {
  background: var(--uk-bg-active);
  color: var(--uk-primary);
}

.uk-sidebar__item-icon {
  flex-shrink: 0;
}

.uk-sidebar__item-label {
  font-size: var(--uk-text-sm);
  font-weight: 500;
}
</style>
