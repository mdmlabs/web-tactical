<template>
  <teleport to="body">
    <transition-group name="uk-toast" tag="div" class="uk-toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['uk-toast', `uk-toast--${toast.type}`]"
      >
        <q-icon :name="getIcon(toast.type)" size="18px" />
        <span class="uk-toast__message">{{ toast.message }}</span>
        <button class="uk-toast__close" @click="remove(toast.id)">
          <q-icon name="close" size="14px" />
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

function getIcon(type: string): string {
  const icons: Record<string, string> = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };
  return icons[type] || "info";
}

function add(type: Toast["type"], message: string) {
  const id = ++toastId;
  toasts.value.push({ id, type, message });
  setTimeout(() => remove(id), 5000);
}

function remove(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

defineExpose({ add, remove });
</script>

<script lang="ts">
import { ref as _ref, type Ref } from "vue";

// Composable for using toast from any component
const globalToastRef: Ref<{ add: (type: "success" | "error" | "warning" | "info", message: string) => void } | null> = _ref(null);

export function useToast() {
  function addToast(type: "success" | "error" | "warning" | "info", message: string) {
    globalToastRef.value?.add(type, message);
  }

  return {
    setRef: (ref: typeof globalToastRef.value) => { globalToastRef.value = ref; },
    addToast,
    notifySuccess: (msg: string) => addToast("success", msg),
    notifyError: (msg: string) => addToast("error", msg),
    notifyWarning: (msg: string) => addToast("warning", msg),
    notifyInfo: (msg: string) => addToast("info", msg),
  };
}
</script>

<style scoped>
.uk-toast-container {
  position: fixed;
  top: var(--uk-space-4);
  right: var(--uk-space-4);
  z-index: var(--uk-z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-2);
  pointer-events: none;
}

.uk-toast {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-3) var(--uk-space-4);
  border-radius: var(--uk-radius-md);
  background: var(--uk-bg-elevated);
  border: 1px solid var(--uk-border-default);
  box-shadow: var(--uk-shadow-lg);
  font-size: var(--uk-text-sm);
  min-width: 280px;
  max-width: 420px;
  pointer-events: auto;
}

.uk-toast--success { border-left: 3px solid var(--uk-success); color: var(--uk-success-text); }
.uk-toast--error { border-left: 3px solid var(--uk-error); color: var(--uk-error-text); }
.uk-toast--warning { border-left: 3px solid var(--uk-warning); color: var(--uk-warning-text); }
.uk-toast--info { border-left: 3px solid var(--uk-info); color: var(--uk-info-text); }

.uk-toast__message {
  flex: 1;
  color: var(--uk-text-primary);
}

.uk-toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-tertiary);
  cursor: pointer;
}

.uk-toast__close:hover {
  background: var(--uk-bg-hover);
}

.uk-toast-enter-active { animation: uk-toast-in 0.3s ease-out; }
.uk-toast-leave-active { animation: uk-toast-out 0.2s ease-in; }

@keyframes uk-toast-in {
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes uk-toast-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100px); }
}
</style>
