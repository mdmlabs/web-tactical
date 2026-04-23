<template>
  <teleport to="body">
    <transition name="uk-fade">
      <div
        v-if="modelValue !== undefined"
        class="uk-modal-overlay"
        @click.self="$emit('update:modelValue', undefined)"
      >
        <div class="uk-modal uk-wizard">
          <div class="uk-wizard__header">
            <h2 class="uk-wizard__title">{{ title }}</h2>
            <button class="uk-modal__close" @click="$emit('update:modelValue', undefined)">
              <q-icon name="close" size="20px" />
            </button>
          </div>

          <!-- Steps indicator -->
          <div class="uk-wizard__steps">
            <div
              v-for="(step, i) in steps"
              :key="i"
              :class="[
                'uk-wizard__step',
                {
                  'uk-wizard__step--active': currentStep === i,
                  'uk-wizard__step--completed': currentStep > i,
                },
              ]"
            >
              <div class="uk-wizard__step-num">
                <q-icon v-if="currentStep > i" name="check" size="14px" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="uk-wizard__step-label">{{ step }}</span>
              <div
                v-if="i < steps.length - 1"
                class="uk-wizard__step-line"
              ></div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="uk-wizard__content">
            <slot :name="`step-${currentStep}`" />
          </div>

          <!-- Footer -->
          <div class="uk-wizard__footer">
            <button
              v-if="currentStep > 0"
              class="uk-btn uk-btn--secondary"
              @click="$emit('back')"
            >
              Back
            </button>
            <div style="flex: 1"></div>
            <slot name="footer">
              <button
                v-if="currentStep < steps.length - 1"
                class="uk-btn uk-btn--primary"
                @click="$emit('next')"
              >
                Continue
              </button>
              <button
                v-else
                class="uk-btn uk-btn--primary"
                @click="$emit('execute')"
              >
                <slot name="executeLabel">Execute</slot>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: number;
  steps: string[];
  currentStep: number;
  title: string;
}>();

defineEmits<{
  "update:modelValue": [value: number | undefined];
  next: [];
  back: [];
  execute: [];
}>();
</script>

<style scoped>
.uk-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--uk-z-modal);
}

.uk-modal {
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-xl);
  box-shadow: var(--uk-shadow-lg);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: uk-modal-appear 0.2s ease-out;
}

@keyframes uk-modal-appear {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.uk-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--uk-radius-sm);
  background: transparent;
  color: var(--uk-text-tertiary);
  cursor: pointer;
  transition: all var(--uk-transition-fast);
}

.uk-modal__close:hover {
  background: var(--uk-bg-hover);
  color: var(--uk-text-primary);
}

.uk-wizard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--uk-space-5) var(--uk-space-6);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-wizard__title {
  font-size: var(--uk-text-lg);
  font-weight: 600;
  color: var(--uk-text-primary);
  margin: 0;
}

.uk-wizard__steps {
  display: flex;
  align-items: center;
  padding: var(--uk-space-4) var(--uk-space-6);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-wizard__step {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  flex: 1;
}

.uk-wizard__step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--uk-text-xs);
  font-weight: 600;
  background: var(--uk-bg-overlay);
  color: var(--uk-text-tertiary);
  flex-shrink: 0;
  transition: all var(--uk-transition-base);
}

.uk-wizard__step--active .uk-wizard__step-num {
  background: var(--uk-primary);
  color: #fff;
}

.uk-wizard__step--completed .uk-wizard__step-num {
  background: var(--uk-success);
  color: #fff;
}

.uk-wizard__step-label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  color: var(--uk-text-tertiary);
  white-space: nowrap;
}

.uk-wizard__step--active .uk-wizard__step-label {
  color: var(--uk-text-primary);
}

.uk-wizard__step--completed .uk-wizard__step-label {
  color: var(--uk-success-text);
}

.uk-wizard__step-line {
  flex: 1;
  height: 1px;
  background: var(--uk-border-default);
  margin: 0 var(--uk-space-2);
}

.uk-wizard__step--completed .uk-wizard__step-line {
  background: var(--uk-success);
}

.uk-wizard__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--uk-space-6);
}

.uk-wizard__footer {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-4) var(--uk-space-6);
  border-top: 1px solid var(--uk-border-default);
}
</style>
