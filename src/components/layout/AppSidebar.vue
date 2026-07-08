<template>
  <aside :class="['uk-sidebar', { 'uk-sidebar--collapsed': collapsed }]">
    <div class="uk-sidebar__brand">
      <div class="uk-sidebar__logo">
        <img
          :src="bcyLogo"
          :alt="`${t('branding.systemName')} logo`"
          class="uk-sidebar__logo-img"
        />
      </div>
      <transition name="uk-fade">
        <span v-if="!collapsed" class="uk-sidebar__brand-text">
          {{ t("branding.systemTitle") }}
          <q-tooltip>{{ t("branding.systemTitle") }}</q-tooltip>
        </span>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="uk-sidebar__nav uk-scrollbar">
      <template v-for="item in navigation" :key="item.id">
        <div v-if="item.dividerBefore" class="uk-sidebar__divider"></div>
        <div
          :class="[
            'uk-sidebar__item',
            {
              'uk-sidebar__item--active': isActive(item),
              'uk-sidebar__item--has-children': item.children?.length,
            },
          ]"
          @click="handleItemClick(item)"
        >
          <q-icon :name="item.icon" size="20px" class="uk-sidebar__item-icon" />
          <transition name="uk-fade">
            <span v-if="!collapsed" class="uk-sidebar__item-label">{{
              t(item.label)
            }}</span>
          </transition>
          <transition name="uk-fade">
            <q-icon
              v-if="!collapsed && item.children?.length"
              :name="
                expandedSections.has(item.id) ? 'expand_less' : 'expand_more'
              "
              size="16px"
              class="uk-sidebar__expand-icon"
            />
          </transition>
          <q-tooltip
            v-if="collapsed"
            anchor="center right"
            self="center left"
            :offset="[8, 0]"
          >
            {{ t(item.label) }}
          </q-tooltip>
        </div>

        <!-- Child items -->
        <transition name="uk-slide-down">
          <div
            v-if="
              !collapsed &&
              item.children?.length &&
              expandedSections.has(item.id)
            "
            class="uk-sidebar__children"
          >
            <div
              v-for="child in item.children"
              :key="child.id"
              class="uk-sidebar__item uk-sidebar__item--child"
              @click.stop="handleItemClick(child)"
            >
              <q-icon
                :name="child.icon"
                size="18px"
                class="uk-sidebar__item-icon"
              />
              <span class="uk-sidebar__item-label">{{ t(child.label) }}</span>
            </div>
          </div>
        </transition>
      </template>
    </nav>

    <!-- Sidebar Footer -->
    <div class="uk-sidebar__footer">
      <div class="uk-sidebar__item" @click="$emit('toggle')">
        <q-icon
          :name="collapsed ? 'chevron_right' : 'chevron_left'"
          size="20px"
          class="uk-sidebar__item-icon"
        />
        <transition name="uk-fade">
          <span v-if="!collapsed" class="uk-sidebar__item-label">{{
            t("Collapse")
          }}</span>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { navigation, type NavItem } from "@/config/navigation";
import { useDialogRegistry } from "@/composables/useDialogRegistry";
import bcyLogo from "@/assets/agent-icon.png";

const props = defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { openDialog } = useDialogRegistry();
const expandedSections = ref(new Set<string>());

function isActive(item: NavItem): boolean {
  if (item.route && item.route === route.path) return true;
  if (item.children?.some((c) => c.route && c.route === route.path))
    return true;
  return false;
}

function handleItemClick(item: NavItem) {
  if (item.children?.length && !props.collapsed) {
    // Toggle expand/collapse
    if (expandedSections.value.has(item.id)) {
      expandedSections.value.delete(item.id);
    } else {
      expandedSections.value.add(item.id);
    }
    // If the parent also has a route, navigate to it
    if (item.route) {
      router.push(item.route);
    }
    return;
  }

  if (item.action) {
    openDialog(item.action);
    return;
  }

  if (item.route) {
    router.push(item.route);
  }
}
</script>

<style scoped>
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 2px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.88);
}

.uk-sidebar__logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.uk-sidebar__brand-text {
  font-size: var(--uk-text-lg);
  font-weight: 700;
  letter-spacing: 0;
  color: var(--uk-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uk-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--uk-space-2);
}

.uk-sidebar__divider {
  height: 1px;
  background: var(--uk-border-default);
  margin: var(--uk-space-2) var(--uk-space-3);
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

.uk-sidebar__item--child {
  padding-left: var(--uk-space-8);
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

.uk-sidebar__expand-icon {
  color: var(--uk-text-tertiary);
  flex-shrink: 0;
}

.uk-sidebar__children {
  overflow: hidden;
}

.uk-sidebar__footer {
  padding: var(--uk-space-2);
  border-top: 1px solid var(--uk-border-default);
  flex-shrink: 0;
}

/* Transitions */
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
  transition: all 0.2s ease;
}

.uk-slide-down-enter-from,
.uk-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
