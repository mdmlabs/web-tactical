<template>
  <div class="th-dashboard">
    <!-- Loading -->
    <div v-if="store.dashboardLoading" class="th-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading Threat Hunting dashboard...</p>
    </div>

    <!-- Indexer unavailable -->
    <div v-else-if="!store.indexerAvailable" class="th-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">MDM-Lab Indexer is not available.</p>
    </div>

    <!-- Dashboard content -->
    <template v-else-if="store.dashboardAggs">
      <!-- Metric cards -->
      <div class="th-metrics">
        <q-card flat bordered class="th-metric-card">
          <q-card-section class="th-metric-inner">
            <div class="th-metric-value">{{ formatNum(store.dashboardAggs.metrics.totalAlerts) }}</div>
            <div class="th-metric-label">Total alerts</div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="th-metric-card th-metric-card--critical">
          <q-card-section class="th-metric-inner">
            <div class="th-metric-value">{{ formatNum(store.dashboardAggs.metrics.criticalAlerts) }}</div>
            <div class="th-metric-label">Level 12 or above</div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="th-metric-card th-metric-card--fail">
          <q-card-section class="th-metric-inner">
            <div class="th-metric-value">{{ formatNum(store.dashboardAggs.metrics.authFailure) }}</div>
            <div class="th-metric-label">Authentication failure</div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="th-metric-card th-metric-card--success">
          <q-card-section class="th-metric-inner">
            <div class="th-metric-value">{{ formatNum(store.dashboardAggs.metrics.authSuccess) }}</div>
            <div class="th-metric-label">Authentication success</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Charts row 1: Alert level evolution + MITRE ATT&CK -->
      <div class="th-grid-2">
        <!-- Top 10 Alert level evolution -->
        <q-card flat bordered class="th-card">
          <q-card-section class="th-card-header">
            <div class="th-card__title">Top 10 Alert level evolution</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div v-if="!alertLevelSeries.length" class="text-grey text-center q-pa-md">
              No data available
            </div>
            <apexchart
              v-else
              type="line"
              height="300"
              :options="alertLevelOptions"
              :series="alertLevelSeries"
            />
          </q-card-section>
        </q-card>

        <!-- Top 10 MITRE ATT&CK -->
        <q-card flat bordered class="th-card">
          <q-card-section class="th-card-header">
            <div class="th-card__title">Top 10 MITRE ATT&CK</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div v-if="!store.dashboardAggs.mitreTactics.length" class="text-grey text-center q-pa-md">
              No data available
            </div>
            <apexchart
              v-else
              type="bar"
              height="300"
              :options="mitreChartOptions"
              :series="mitreChartSeries"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Chart row 2: Alerts evolution - Top 5 agents -->
      <q-card flat bordered class="th-card th-card--full">
        <q-card-section class="th-card-header">
          <div class="th-card__title">Alerts evolution - Top 5 agents</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-if="!topAgentsSeries.length" class="text-grey text-center q-pa-md">
            No data available
          </div>
          <apexchart
            v-else
            type="line"
            height="260"
            :options="topAgentsOptions"
            :series="topAgentsSeries"
          />
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useThreatHuntingStore } from "@/stores/threatHunting";

const apexchart = VueApexCharts;
const store = useThreatHuntingStore();

const chartColors = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#ca8a04",
  "#16a34a", "#0891b2", "#6366f1", "#e11d48", "#059669",
];

const baseChartOptions = {
  chart: {
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  theme: { mode: "light" as const },
  colors: chartColors,
};

function formatNum(n: number): string {
  return n.toLocaleString();
}

// === Alert level evolution (line chart, multi-series by rule.level) ===
const alertLevelSeries = computed(() => {
  const buckets = store.dashboardAggs?.alertLevelEvolution ?? [];
  if (!buckets.length) return [];

  // Collect all levels across buckets
  const levelSet = new Set<string | number>();
  for (const b of buckets) {
    for (const sub of b.by_sub?.buckets ?? []) {
      levelSet.add(sub.key);
    }
  }
  const levels = [...levelSet].sort((a, b) => Number(a) - Number(b));

  return levels.map((level) => ({
    name: `Level ${level}`,
    data: buckets.map((b) => ({
      x: b.key,
      y: b.by_sub?.buckets?.find((s) => s.key === level)?.doc_count ?? 0,
    })),
  }));
});

const alertLevelOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "line" as const, zoom: { enabled: false } },
  stroke: { width: 2, curve: "smooth" as const },
  dataLabels: { enabled: false },
  xaxis: {
    type: "datetime" as const,
    labels: { datetimeUTC: false, style: { fontSize: "10px" } },
    title: { text: "timestamp per " + store.histogramInterval },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  tooltip: {
    x: { format: "MMM dd, HH:mm" },
    y: { formatter: (val: number) => val.toLocaleString() },
  },
  legend: { position: "top" as const, fontSize: "11px" },
}));

// === MITRE ATT&CK (horizontal bar chart) ===
const mitreChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "bar" as const },
  plotOptions: {
    bar: { horizontal: true, barHeight: "60%", borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    labels: { style: { fontSize: "11px" } },
    title: { text: "Count" },
  },
  yaxis: {
    labels: {
      style: { fontSize: "11px" },
      maxWidth: 180,
    },
  },
  tooltip: { y: { formatter: (val: number) => val.toLocaleString() } },
}));

const mitreChartSeries = computed(() => {
  const tactics = store.dashboardAggs?.mitreTactics ?? [];
  return [
    {
      name: "Alerts",
      data: tactics.map((t) => ({
        x: String(t.key),
        y: t.doc_count,
      })),
    },
  ];
});

// === Top 5 agents evolution (line chart, multi-series by agent.name) ===
const topAgentsSeries = computed(() => {
  const buckets = store.dashboardAggs?.topAgentsEvolution ?? [];
  if (!buckets.length) return [];

  const agentSet = new Set<string | number>();
  for (const b of buckets) {
    for (const sub of b.by_sub?.buckets ?? []) {
      agentSet.add(sub.key);
    }
  }
  const agents = [...agentSet];

  return agents.map((agent) => ({
    name: String(agent),
    data: buckets.map((b) => ({
      x: b.key,
      y: b.by_sub?.buckets?.find((s) => s.key === agent)?.doc_count ?? 0,
    })),
  }));
});

const topAgentsOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "line" as const, zoom: { enabled: false } },
  stroke: { width: 2, curve: "smooth" as const },
  dataLabels: { enabled: false },
  xaxis: {
    type: "datetime" as const,
    labels: { datetimeUTC: false, style: { fontSize: "10px" } },
    title: { text: "timestamp per " + store.histogramInterval },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  tooltip: {
    x: { format: "MMM dd, HH:mm" },
    y: { formatter: (val: number) => val.toLocaleString() },
  },
  legend: { position: "top" as const, fontSize: "11px" },
}));
</script>

<style scoped>
.th-dashboard {
  padding: 20px;
  min-height: 400px;
}

.th-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

/* Metric cards */
.th-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.th-metric-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.th-metric-inner {
  text-align: center;
  padding: 16px;
}

.th-metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.th-metric-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #888);
  margin-top: 4px;
}

.th-metric-card--critical .th-metric-value { color: #dc2626; }
.th-metric-card--fail .th-metric-value { color: #ea580c; }
.th-metric-card--success .th-metric-value { color: #16a34a; }

/* Chart grids */
.th-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.th-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.th-card--full {
  margin-bottom: 16px;
}

.th-card-header {
  padding-bottom: 4px;
}

.th-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

@media (max-width: 1024px) {
  .th-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .th-grid-2 {
    grid-template-columns: 1fr;
  }
  .th-metrics {
    grid-template-columns: 1fr;
  }
}

/* Dark mode */
.body--dark .th-card,
.body--dark .th-metric-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .th-card__title,
.body--dark .th-metric-value {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .th-metric-card--critical .th-metric-value { color: #f87171; }
.body--dark .th-metric-card--fail .th-metric-value { color: #fb923c; }
.body--dark .th-metric-card--success .th-metric-value { color: #4ade80; }
</style>
