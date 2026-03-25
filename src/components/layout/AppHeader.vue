<template>
  <header class="uk-header">
    <div class="uk-header__left">
      <UkBreadcrumbs :items="breadcrumbs" />
    </div>

    <div class="uk-header__center">
      <UkSearchInput
        v-model="globalSearch.query.value"
        placeholder="Search agents, policies, scripts..."
      >
        <template #results>
          <div
            v-if="globalSearch.results.value.agents.length"
            class="uk-search__section"
          >
            <div class="uk-search__section-title">Agents</div>
            <div
              v-for="agent in globalSearch.results.value.agents"
              :key="agent.agent_id"
              class="uk-search__result"
              @mousedown="navigateToAgent(agent.agent_id)"
            >
              <q-icon name="dns" size="16px" />
              <span>{{ agent.hostname }}</span>
              <span class="uk-search__result-meta">{{
                agent.clientName
              }}</span>
            </div>
          </div>
        </template>
      </UkSearchInput>
    </div>

    <div class="uk-header__right">
      <!-- Theme Toggle -->
      <button
        class="uk-header__icon-btn"
        :title="theme.isDark.value ? 'Switch to Light' : 'Switch to Dark'"
        @click="theme.toggle()"
      >
        <q-icon
          :name="theme.isDark.value ? 'light_mode' : 'dark_mode'"
          size="18px"
        />
      </button>

      <!-- Alerts -->
      <AlertsIcon />

      <!-- User Menu -->
      <div class="uk-header__user" @click="showUserMenu = !showUserMenu">
        <div class="uk-header__avatar">
          <q-icon name="person" size="16px" />
        </div>
        <span class="uk-header__username">{{ username }}</span>
        <q-icon name="expand_more" size="16px" />
        <q-menu v-model="showUserMenu">
          <q-list dense style="min-width: 150px">
            <q-item clickable @click="openUserPreferences">
              <q-item-section>Preferences</q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-item-section class="text-red">Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { UkBreadcrumbs, UkSearchInput } from "@/uikit";
import AlertsIcon from "@/components/AlertsIcon.vue";
import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
import { useGlobalSearch } from "@/composables/useGlobalSearch";
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const { breadcrumbs } = useBreadcrumbs();
const globalSearch = useGlobalSearch();
const theme = useTheme();

const showUserMenu = ref(false);
const username = computed(() => auth.username || "admin");

function navigateToAgent(agentId: string) {
  router.push({ name: "Agent", params: { agent_id: agentId } });
}

function openUserPreferences() {
  showUserMenu.value = false;
  // TODO: open preferences dialog
}

function logout() {
  showUserMenu.value = false;
  auth.logout();
  router.push({ name: "Login" });
}
</script>

<style scoped>
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

/* Search section styles (used in dropdown) */
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
</style>
