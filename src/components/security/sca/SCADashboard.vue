<template>
  <div class="sca-dashboard">
    <!-- No agent selected -->
    <div v-if="!scaStore.hasAgent" class="sca-no-agent">
      <q-icon name="wifi_tethering" size="64px" color="grey-5" />
      <h5 class="q-mt-md q-mb-sm">No agent is selected</h5>
      <p class="text-grey-7">
        You need to select an agent to see Security Configuration Assessment inventory.
      </p>
      <q-btn
        color="primary"
        label="Select agent"
        no-caps
        unelevated
        @click="$emit('select-agent')"
      />
    </div>

    <!-- Loading -->
    <div v-else-if="scaStore.dashboardLoading" class="sca-loading">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading SCA policies...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!scaStore.policies.length" class="sca-no-data">
      <q-icon name="info_outline" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">No SCA policies found for this agent.</p>
    </div>

    <!-- Policy cards -->
    <div v-else class="sca-policies">
      <div class="sca-policies-header">
        <span class="text-subtitle1 text-weight-medium">
          SCA Policies ({{ scaStore.policies.length }})
        </span>
      </div>
      <q-card
        v-for="policy in scaStore.policies"
        :key="policy.policy_id"
        flat
        bordered
        class="sca-policy-card"
      >
        <q-card-section class="sca-policy-card__body">
          <div class="sca-policy-card__left">
            <!-- Donut chart -->
            <div class="sca-donut">
              <svg viewBox="0 0 36 36" class="sca-donut__svg">
                <circle
                  cx="18" cy="18" r="15.91549431"
                  fill="none"
                  stroke="#e8e8e8"
                  stroke-width="3"
                />
                <circle
                  cx="18" cy="18" r="15.91549431"
                  fill="none"
                  :stroke="scoreColor(policy.score)"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${policy.score} ${100 - policy.score}`"
                  stroke-dashoffset="25"
                />
              </svg>
              <div class="sca-donut__label">{{ policy.score }}%</div>
            </div>
            <div class="sca-donut__legend">
              <div class="sca-legend-item">
                <span class="sca-legend-dot sca-legend-dot--passed"></span>
                Passed ({{ policy.pass }})
              </div>
              <div class="sca-legend-item">
                <span class="sca-legend-dot sca-legend-dot--failed"></span>
                Failed ({{ policy.fail }})
              </div>
              <div class="sca-legend-item">
                <span class="sca-legend-dot sca-legend-dot--na"></span>
                Not applicable ({{ policy.invalid }})
              </div>
            </div>
          </div>
          <div class="sca-policy-card__right">
            <div class="sca-policy-name">{{ policy.name }}</div>
            <div class="sca-policy-stats">
              <div class="sca-stat">
                <span class="sca-stat__label">Passed</span>
                <span class="sca-stat__value">{{ policy.pass }}</span>
              </div>
              <div class="sca-stat">
                <span class="sca-stat__label">Failed</span>
                <span class="sca-stat__value">{{ policy.fail }}</span>
              </div>
              <div class="sca-stat">
                <span class="sca-stat__label">Not applicable</span>
                <span class="sca-stat__value">{{ policy.invalid }}</span>
              </div>
              <div class="sca-stat">
                <span class="sca-stat__label">Score</span>
                <span class="sca-stat__value">{{ policy.score }}%</span>
              </div>
              <div class="sca-stat">
                <span class="sca-stat__label">End scan</span>
                <span class="sca-stat__value">{{ formatDate(policy.end_scan) }}</span>
              </div>
            </div>
            <div class="sca-policy-actions">
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                icon="inventory_2"
                label="View Inventory"
                @click="onViewInventory(policy.policy_id)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScaStore } from "@/stores/sca";

defineEmits<{ (e: "select-agent"): void }>();

const scaStore = useScaStore();

function onViewInventory(policyId: string) {
  scaStore.navigateToPolicyInventory(policyId);
}

function scoreColor(score: number): string {
  if (score >= 75) return "#4caf50";
  if (score >= 50) return "#ff9800";
  return "#f44336";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " @ " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.sca-dashboard {
  padding: 20px;
  min-height: 400px;
}

.sca-no-agent,
.sca-loading,
.sca-no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.sca-no-agent h5 {
  font-size: 20px;
  font-weight: 500;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-policies-header {
  margin-bottom: 16px;
}

.sca-policy-card {
  margin-bottom: 16px;
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.sca-policy-card__body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.sca-policy-card__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
  gap: 12px;
}

.sca-donut {
  position: relative;
  width: 100px;
  height: 100px;
}

.sca-donut__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.sca-donut__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-donut__legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
}

.sca-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sca-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sca-legend-dot--passed { background: #4caf50; }
.sca-legend-dot--failed { background: #f44336; }
.sca-legend-dot--na { background: #9e9e9e; }

.sca-policy-card__right {
  flex: 1;
}

.sca-policy-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 16px;
}

.sca-policy-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.sca-policy-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.sca-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sca-stat__label {
  font-size: 12px;
  color: var(--mdm-text-secondary, #888);
  font-weight: 500;
}

.sca-stat__value {
  font-size: 20px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

@media (max-width: 768px) {
  .sca-policy-card__body {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .sca-policy-stats {
    justify-content: center;
  }
}

/* Dark mode */
.body--dark .sca-no-agent h5,
.body--dark .sca-policy-name,
.body--dark .sca-stat__value,
.body--dark .sca-donut__label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-policy-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
