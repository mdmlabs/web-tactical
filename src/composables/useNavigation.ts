import { ref } from "vue";
import { useStorage } from "@vueuse/core";

/**
 * Manages sidebar state. Replaces Vuex sidebarCollapsed + fileBarDrawerOpen.
 */
export function useNavigation() {
  const collapsed = useStorage("sidebar-collapsed", true);
  const mobileOpen = ref(false);
  const activeItem = ref<string | null>(null);

  function toggle() {
    collapsed.value = !collapsed.value;
  }

  function openMobile() {
    mobileOpen.value = true;
  }

  function closeMobile() {
    mobileOpen.value = false;
  }

  return {
    collapsed,
    mobileOpen,
    activeItem,
    toggle,
    openMobile,
    closeMobile,
  };
}
