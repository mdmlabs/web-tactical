import { watch } from "vue";
import { useStorage } from "@vueuse/core";
import { Dark } from "quasar";

/**
 * Theme toggle composable. Wraps Quasar Dark.set() with UIKit theme class.
 */
export function useTheme() {
  const isDark = useStorage("theme-dark", true);

  watch(
    isDark,
    (v) => {
      Dark.set(v);
      document.documentElement.classList.toggle("uk-theme-dark", v);
      document.documentElement.classList.toggle("uk-theme-light", !v);
    },
    { immediate: true },
  );

  function toggle() {
    isDark.value = !isDark.value;
  }

  return { isDark, toggle };
}
