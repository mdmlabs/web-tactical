<template>
  <q-card flat bordered class="inventory-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">System inventory</div>
        <q-btn flat round dense icon="open_in_new" size="sm" color="primary" />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-inner-loading :showing="loading" />
      <div v-if="!loading" class="row q-col-gutter-lg">
        <div class="col">
          <div class="inv-label">Cores</div>
          <div class="inv-value">{{ hardware?.cpu?.cores ?? '—' }}</div>
        </div>
        <div class="col">
          <div class="inv-label">Memory</div>
          <div class="inv-value">{{ formatMemory(hardware?.ram?.total) }}</div>
        </div>
        <div class="col">
          <div class="inv-label">CPU</div>
          <div class="inv-value">{{ hardware?.cpu?.name ?? '—' }}</div>
        </div>
        <div class="col">
          <div class="inv-label">Host name</div>
          <div class="inv-value">{{ os?.hostname ?? '—' }}</div>
        </div>
        <div class="col">
          <div class="inv-label">Serial number</div>
          <div class="inv-value">{{ hardware?.board_serial ?? '—' }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { WazuhSyscollectorHardware, WazuhSyscollectorOS } from "@/types/wazuh";

defineProps<{
  hardware: WazuhSyscollectorHardware | null;
  os: WazuhSyscollectorOS | null;
  loading: boolean;
}>();

function formatMemory(totalKb: number | undefined): string {
  if (!totalKb) return "—";
  const gb = (totalKb / 1024 / 1024).toFixed(1);
  return `${gb}GB`;
}
</script>

<style scoped>
.inventory-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.inv-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.inv-value {
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-top: 4px;
  word-break: break-word;
}
</style>
