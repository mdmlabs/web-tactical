<template>
  <q-card flat bordered class="mitre-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">MITRE ATT&amp;CK</div>
        <q-btn flat round dense icon="open_in_new" size="sm" color="primary" />
      </div>
      <div class="text-subtitle2 text-grey q-mt-xs">Top Tactics</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-inner-loading :showing="loading" />
      <div v-if="!loading && tactics.length === 0" class="text-grey text-center q-py-md">
        No MITRE data available
      </div>
      <q-list v-else dense separator>
        <q-item v-for="item in topTactics" :key="item.tactic" class="q-px-none">
          <q-item-section>
            <q-item-label class="tactic-name">{{ item.tactic }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary" :label="String(item.count)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  tactics: { tactic: string; count: number }[];
  loading: boolean;
}>();

const topTactics = computed(() => props.tactics.slice(0, 10));
</script>

<style scoped>
.mitre-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.tactic-name {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  font-weight: 500;
}
</style>
