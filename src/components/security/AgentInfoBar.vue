<template>
  <q-card flat bordered class="agent-info-bar">
    <q-card-section class="row items-center q-col-gutter-md q-py-sm">
      <div class="info-item">
        <div class="info-label">ID</div>
        <div class="info-value">{{ agent.id }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">
          <span class="status-dot" :class="'status-' + agent.status" />
          <span class="q-ml-xs">{{ agent.status }}</span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">IP address</div>
        <div class="info-value">{{ agent.ip }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Version</div>
        <div class="info-value">{{ formatVersion(agent.version) }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Group</div>
        <div class="info-value">
          <q-chip
            v-for="g in agent.group ?? []"
            :key="g"
            dense
            size="sm"
            :label="g"
            class="q-mr-xs"
          />
          <span v-if="!agent.group?.length">—</span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Operating system</div>
        <div class="info-value">
          <q-icon :name="osIcon(agent.os?.platform)" size="18px" class="q-mr-xs os-icon" />
          {{ agent.os?.name ?? 'Unknown' }} {{ agent.os?.version ?? '' }}
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Cluster node</div>
        <div class="info-value">{{ agent.node_name ?? '—' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Registration date</div>
        <div class="info-value">{{ formatDate(agent.dateAdd) }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Last keep alive</div>
        <div class="info-value">{{ formatDate(agent.lastKeepAlive) }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { WazuhAgent } from "@/types/wazuh";

defineProps<{ agent: WazuhAgent }>();

function osIcon(platform: string | undefined): string {
  if (!platform) return "computer";
  if (platform === "windows") return "laptop_windows";
  if (platform === "darwin") return "laptop_mac";
  return "computer";
}

function formatVersion(version: string | undefined): string {
  if (!version) return "—";
  return version.replace("Wazuh ", "");
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr === "9999-12-31T23:59:59+00:00") return "—";
  return new Date(dateStr).toLocaleString();
}
</script>

<style scoped>
.agent-info-bar {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.info-item {
  padding: 4px 16px;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.info-value {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-active { background: var(--mdm-success, #16a34a); }
.status-disconnected { background: var(--mdm-danger, #dc2626); }
.status-pending { background: var(--mdm-warning, #ca8a04); }
.status-never_connected { background: #9ca3af; }
.os-icon { color: var(--mdm-text-secondary, #666); }
</style>
