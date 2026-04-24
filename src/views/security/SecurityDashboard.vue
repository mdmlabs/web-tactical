<template>
  <div class="sec-overview">
    <!-- Row 1: Agents Summary + Last 24h Alerts -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Agents Summary -->
      <div class="col-12 col-md-5">
        <div class="sec-card">
          <div class="sec-card__title">AGENTS SUMMARY</div>
          <div class="sec-card__body">
            <div class="agents-summary">
              <div class="agents-total">
                <span class="agents-total__number">{{ totalAgents }}</span>
              </div>
              <div class="agents-legend">
                <div class="agents-legend__item">
                  <span class="legend-square legend-square--active" />
                  <span class="legend-dot legend-dot--active" />
                  <span>Active</span>
                  <span class="legend-count">({{ statusCounts.active }})</span>
                </div>
                <div class="agents-legend__item">
                  <span class="legend-square legend-square--disconnected" />
                  <span class="legend-dot legend-dot--disconnected" />
                  <span>Disconnected</span>
                  <span class="legend-count">({{ statusCounts.disconnected }})</span>
                </div>
                <div class="agents-legend__item">
                  <span class="legend-square legend-square--never" />
                  <span class="legend-dot legend-dot--never" />
                  <span>Never connected</span>
                  <span class="legend-count">({{ statusCounts.never_connected }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Last 24 Hours Alerts -->
      <div class="col-12 col-md-7">
        <div class="sec-card">
          <div class="sec-card__title">LAST 24 HOURS ALERTS</div>
          <div class="sec-card__body">
            <div class="alerts-grid">
              <div class="alert-col">
                <div class="alert-label">Critical severity</div>
                <div class="alert-value alert-value--critical">{{ alertCounts.critical.toLocaleString() }}</div>
                <div class="alert-sublabel">Rule level 15 or higher</div>
              </div>
              <div class="alert-col">
                <div class="alert-label">High severity</div>
                <div class="alert-value alert-value--high">{{ alertCounts.high.toLocaleString() }}</div>
                <div class="alert-sublabel">Rule level 12 to 14</div>
              </div>
              <div class="alert-col">
                <div class="alert-label">Medium severity</div>
                <div class="alert-value alert-value--medium">{{ alertCounts.medium.toLocaleString() }}</div>
                <div class="alert-sublabel">Rule level 7 to 11</div>
              </div>
              <div class="alert-col">
                <div class="alert-label">Low severity</div>
                <div class="alert-value alert-value--low">{{ alertCounts.low.toLocaleString() }}</div>
                <div class="alert-sublabel">Rule level 0 to 6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: Endpoint Security -->
    <div class="sec-section-label">ENDPOINT SECURITY</div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-md-3">
        <div class="sec-module-card" @click="navigateTo('SecurityAlerts')">
          <q-icon name="settings_suggest" size="36px" class="sec-module-icon" />
          <div class="sec-module-info">
            <div class="sec-module-name">Configuration Assessment</div>
            <div class="sec-module-desc">Scan your assets as part of a configuration assessment audit.</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="sec-module-card" @click="navigateTo('SecurityAlerts')">
          <q-icon name="bug_report" size="36px" class="sec-module-icon" />
          <div class="sec-module-info">
            <div class="sec-module-name">Malware Detection</div>
            <div class="sec-module-desc">Check indicators of compromise using file integrity monitoring.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3: Threat Intelligence -->
    <div class="sec-section-label">THREAT INTELLIGENCE</div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-md-3">
        <div class="sec-module-card" @click="navigateTo('SecurityDiscover')">
          <q-icon name="explore" size="36px" class="sec-module-icon" />
          <div class="sec-module-info">
            <div class="sec-module-name">Threat Hunting</div>
            <div class="sec-module-desc">Browse through your security alerts, visualize and collect data.</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="sec-module-card" @click="navigateTo('SecurityAgents')">
          <q-icon name="verified_user" size="36px" class="sec-module-icon" />
          <div class="sec-module-info">
            <div class="sec-module-name">Vulnerability Detection</div>
            <div class="sec-module-desc">Discover what applications in your environment are affected.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <q-inner-loading :showing="wazuhStore.agentsLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useWazuhStore } from "@/stores/wazuh";

const store = useStore();
const router = useRouter();
const wazuhStore = useWazuhStore();

const totalAgents = computed(() => {
  const agents = wazuhStore.wazuhAgents.filter((a) => a.id !== "000");
  return agents.length || wazuhStore.summary?.total_agents || 0;
});

const statusCounts = computed(() => {
  const agents = wazuhStore.wazuhAgents.filter((a) => a.id !== "000");
  return {
    active: agents.filter((a) => a.status === "active").length,
    disconnected: agents.filter((a) => a.status === "disconnected").length,
    pending: agents.filter((a) => a.status === "pending").length,
    never_connected: agents.filter((a) => a.status === "never_connected").length,
  };
});

const alertCounts = computed(() => {
  const rules = wazuhStore.rules;
  return {
    critical: rules.filter((r) => r.level >= 15).length,
    high: rules.filter((r) => r.level >= 12 && r.level <= 14).length,
    medium: rules.filter((r) => r.level >= 7 && r.level <= 11).length,
    low: rules.filter((r) => r.level >= 0 && r.level <= 6).length,
  };
});

function navigateTo(name: string) {
  router.push({ name });
}

async function loadData() {
  await wazuhStore.fetchAgents();

  const tacticalAgents = store.state.agents ?? [];
  wazuhStore.mergeAgents(tacticalAgents);
  wazuhStore.buildSummary();

  wazuhStore.fetchRules({ limit: 500, sort: "-level" });
}

defineExpose({ loadData });

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.sec-overview {
  padding: 20px;
  max-width: 1800px;
}

/* ===== Cards ===== */
.sec-card {
  background: var(--mdm-bg-card, #fff);
  border-radius: var(--mdm-radius-lg, 8px);
  border: 1px solid var(--mdm-border, #e5e5e5);
  box-shadow: var(--mdm-shadow-sm);
  height: 100%;
}

.sec-card__title {
  padding: 16px 20px 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
}

.sec-card__body {
  padding: 16px 20px 20px;
}

/* ===== Agents Summary ===== */
.agents-summary {
  display: flex;
  align-items: center;
  gap: 32px;
}

.agents-total__number {
  font-size: 64px;
  font-weight: 800;
  color: var(--mdm-text-primary, #1a1a1a);
  line-height: 1;
}

.agents-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agents-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
}

.legend-square {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-square--active { background: var(--mdm-success, #16a34a); }
.legend-square--disconnected { background: var(--mdm-danger, #dc2626); }
.legend-square--never { background: #6b7280; }

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot--active { background: var(--mdm-success, #16a34a); }
.legend-dot--disconnected { background: var(--mdm-danger, #dc2626); }
.legend-dot--never { background: #6b7280; }

.legend-count {
  color: var(--mdm-text-secondary, #666);
  font-weight: 500;
}

/* ===== Alerts Grid ===== */
.alerts-grid {
  display: flex;
  gap: 0;
}

.alert-col {
  flex: 1;
  text-align: center;
  padding: 0 12px;
  border-right: 1px solid var(--mdm-border-light, #f0f0f0);
}

.alert-col:last-child {
  border-right: none;
}

.alert-label {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  margin-bottom: 8px;
}

.alert-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.alert-value--critical { color: var(--mdm-danger, #dc2626); }
.alert-value--high { color: #ea580c; }
.alert-value--medium { color: var(--mdm-primary, #2563eb); }
.alert-value--low { color: var(--mdm-success, #16a34a); }

.alert-sublabel {
  font-size: 11px;
  color: var(--mdm-text-muted, #999);
}

/* ===== Section Label ===== */
.sec-section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  margin-bottom: 12px;
}

/* ===== Module Cards ===== */
.sec-module-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: var(--mdm-bg-card, #fff);
  border-radius: var(--mdm-radius-lg, 8px);
  border: 1px solid var(--mdm-border, #e5e5e5);
  box-shadow: var(--mdm-shadow-sm);
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  height: 100%;
}

.sec-module-card:hover {
  box-shadow: var(--mdm-shadow-md);
  border-color: var(--mdm-primary, #2563eb);
}

.sec-module-icon {
  color: var(--mdm-text-secondary, #666);
  flex-shrink: 0;
  margin-top: 2px;
}

.sec-module-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.sec-module-desc {
  font-size: 12px;
  color: var(--mdm-text-muted, #999);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .agents-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .alerts-grid {
    flex-wrap: wrap;
  }

  .alert-col {
    flex: 0 0 50%;
    margin-bottom: 16px;
    border-right: none;
  }

  .alert-value {
    font-size: 32px;
  }
}
</style>
