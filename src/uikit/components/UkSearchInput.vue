<template>
  <div class="uk-search" :class="{ 'uk-search--focused': focused }">
    <q-icon name="search" size="18px" class="uk-search__icon" />
    <input
      ref="inputRef"
      v-model="query"
      type="text"
      class="uk-search__input"
      :placeholder="placeholder"
      @focus="focused = true"
      @blur="onBlur"
      @input="$emit('update:modelValue', query)"
    />
    <div class="uk-search__shortcut">
      <kbd>/</kbd>
    </div>

    <!-- Search Results Dropdown -->
    <transition name="uk-slide-down">
      <div v-if="focused && query.length > 0 && $slots.results" class="uk-search__dropdown">
        <slot name="results" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Search agents, policies, scripts...",
  },
);

defineEmits<{
  "update:modelValue": [value: string];
}>();

const query = ref("");
const focused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

function onBlur() {
  // Delay to allow click on dropdown results
  setTimeout(() => {
    focused.value = false;
  }, 200);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
    e.preventDefault();
    inputRef.value?.focus();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped>
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
</style>
