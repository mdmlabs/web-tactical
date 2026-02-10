<template>
  <div class="empty-state text-center q-pa-lg" :class="error ? 'text-negative' : 'text-grey-6'">
    <q-icon :name="icon" size="2em" />
    <div class="q-mt-sm">{{ message }}</div>
    <slot name="action">
      <q-btn
        v-if="error && retryLabel"
        flat
        :label="retryLabel"
        class="q-mt-md"
        @click="$emit('retry')"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  message: string;
  error?: boolean;
  retryLabel?: string;
}>();

defineEmits<{ retry: [] }>();
</script>

<style scoped lang="sass">
.empty-state
  min-height: 80px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
</style>
