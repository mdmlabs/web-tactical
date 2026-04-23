<template>
  <div class="row q-col-gutter-md">
    <!-- Alert Levels Donut -->
    <div class="col-12 col-md-4">
      <div class="mdm-chart">
        <div class="mdm-chart__title">Alert Levels</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 24px">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              v-for="(segment, i) in alertSegments"
              :key="i"
              cx="70" cy="70" r="55"
              fill="none"
              :stroke="segment.color"
              stroke-width="20"
              :stroke-dasharray="`${segment.arc} ${totalCircumference - segment.arc}`"
              :stroke-dashoffset="segment.offset"
              :transform="'rotate(-90 70 70)'"
            />
            <text x="70" y="65" text-anchor="middle" font-size="22" font-weight="700" :fill="'var(--mdm-text-primary, #1a1a1a)'">
              {{ totalAlerts }}
            </text>
            <text x="70" y="82" text-anchor="middle" font-size="10" :fill="'var(--mdm-text-secondary, #666)'">
              Total
            </text>
          </svg>
          <div>
            <div v-for="level in alertLevels" :key="level.label" class="row items-center q-mb-xs">
              <span class="mdm-chart__legend-dot" :style="{ background: level.color }"></span>
              <span class="text-caption" style="color: var(--mdm-text-secondary)">{{ level.label }} ({{ level.count }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent Status Bar Chart -->
    <div class="col-12 col-md-4">
      <div class="mdm-chart">
        <div class="mdm-chart__title">Agent Status</div>
        <div class="q-mt-sm">
          <div v-for="item in agentStatusData" :key="item.label" class="q-mb-sm">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-caption" style="color: var(--mdm-text-secondary)">{{ item.label }}</span>
              <span class="text-caption text-weight-bold" style="color: var(--mdm-text-primary)">{{ item.count }}</span>
            </div>
            <div style="background: var(--mdm-border-light, #f0f0f0); border-radius: 4px; height: 8px; overflow: hidden">
              <div
                :style="{
                  width: maxAgentStatus > 0 ? (item.count / maxAgentStatus * 100) + '%' : '0%',
                  height: '100%',
                  background: item.color,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Agents by Events -->
    <div class="col-12 col-md-4">
      <div class="mdm-chart">
        <div class="mdm-chart__title">Top Agents by Events</div>
        <div class="q-mt-sm">
          <div v-for="(agent, i) in topAgentsByChecks" :key="i" class="q-mb-sm">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-caption" style="color: var(--mdm-text-secondary); max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ agent.hostname }}</span>
              <span class="text-caption text-weight-bold" style="color: var(--mdm-text-primary)">{{ agent.events }}</span>
            </div>
            <div style="background: var(--mdm-border-light, #f0f0f0); border-radius: 4px; height: 6px; overflow: hidden">
              <div
                :style="{
                  width: maxEvents > 0 ? (agent.events / maxEvents * 100) + '%' : '0%',
                  height: '100%',
                  background: 'var(--mdm-primary, #2563eb)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const agents = computed(() => store.state.agents || []);

const totalCircumference = 2 * Math.PI * 55;

// Compute alert levels from real agent check data
const alertLevels = computed(() => {
  const all = agents.value;
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;
  let info = 0;

  all.forEach((a) => {
    if (a.checks) {
      critical += parseInt(a.checks.failing || 0);
      high += parseInt(a.checks.warning || 0);
      medium += parseInt(a.checks.info || 0);
    }
    if (a.has_patches_pending) high++;
    if (a.status === "overdue") low++;
    info += a.pending_actions_count || 0;
  });

  return [
    { label: "Critical", count: critical, color: "#dc2626" },
    { label: "High", count: high, color: "#ea580c" },
    { label: "Medium", count: medium, color: "#ca8a04" },
    { label: "Low", count: low, color: "#2563eb" },
    { label: "Info", count: info, color: "#6b7280" },
  ];
});

const totalAlerts = computed(() =>
  alertLevels.value.reduce((sum, l) => sum + l.count, 0),
);

const alertSegments = computed(() => {
  const segments = [];
  let offset = 0;
  alertLevels.value.forEach((level) => {
    if (level.count === 0) return;
    const arc = totalAlerts.value > 0
      ? (level.count / totalAlerts.value) * totalCircumference
      : 0;
    segments.push({
      color: level.color,
      arc,
      offset: -offset,
    });
    offset += arc;
  });
  return segments;
});

// Agent status from real data
const agentStatusData = computed(() => {
  const all = agents.value;
  const online = all.filter((a) => a.status === "online").length;
  const offline = all.filter((a) => a.status === "offline").length;
  const overdue = all.filter((a) => a.status === "overdue").length;
  return [
    { label: "Online", count: online, color: "#16a34a" },
    { label: "Offline", count: offline, color: "#dc2626" },
    { label: "Overdue", count: overdue, color: "#ca8a04" },
  ];
});

const maxAgentStatus = computed(() =>
  Math.max(...agentStatusData.value.map((d) => d.count), 1),
);

// Top agents by check events
const topAgentsByChecks = computed(() => {
  return [...agents.value]
    .map((a) => ({
      hostname: a.hostname,
      events:
        (parseInt(a.checks?.total || 0)) +
        (a.pending_actions_count || 0),
    }))
    .sort((a, b) => b.events - a.events)
    .slice(0, 5);
});

const maxEvents = computed(() =>
  Math.max(...topAgentsByChecks.value.map((a) => a.events), 1),
);
</script>

<style scoped>
.mdm-chart__legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}
</style>
