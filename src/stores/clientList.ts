import { defineStore } from "pinia";
import { ref, computed } from "vue";

const STORAGE_KEY = "mdm-hidden-clients";

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set();
}

function saveToStorage(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export const useClientListStore = defineStore("clientList", () => {
  const hiddenIds = ref<Set<string>>(loadFromStorage());
  const showHiddenMode = ref(false);

  const hiddenCount = computed(() => hiddenIds.value.size);

  function isHidden(raw: string): boolean {
    return hiddenIds.value.has(raw);
  }

  function hideClient(raw: string) {
    hiddenIds.value = new Set([...hiddenIds.value, raw]);
    saveToStorage(hiddenIds.value);
  }

  function showClient(raw: string) {
    const next = new Set(hiddenIds.value);
    next.delete(raw);
    hiddenIds.value = next;
    saveToStorage(hiddenIds.value);
  }

  function showAll() {
    hiddenIds.value = new Set();
    saveToStorage(hiddenIds.value);
  }

  function hideMultiple(raws: string[]) {
    hiddenIds.value = new Set([...hiddenIds.value, ...raws]);
    saveToStorage(hiddenIds.value);
  }

  function toggleShowHidden() {
    showHiddenMode.value = !showHiddenMode.value;
  }

  return {
    hiddenIds,
    hiddenCount,
    showHiddenMode,
    isHidden,
    hideClient,
    showClient,
    showAll,
    hideMultiple,
    toggleShowHidden,
  };
});
