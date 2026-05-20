<template>
  <div
    v-if="version !== undefined || policyStatus !== undefined"
    class="row items-center no-wrap q-gutter-xs"
    :class="alignEnd ? 'justify-end' : ''"
  >
    <span v-if="version !== undefined" class="text-caption text-grey-7">
      v{{ version }}
    </span>
    <q-badge
      v-if="policyStatus !== undefined"
      :color="policyStatusColor(policyStatus)"
      :label="policyStatusLabel(policyStatus)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  policyStatusColor,
  policyStatusLabel,
} from "@/gpo/utils/policy-status";

defineProps<{
  version?: number;
  policyStatus?: number;
  alignEnd?: boolean;
}>();
</script>
