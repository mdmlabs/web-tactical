<template>
  <div class="nist-dashboard">
    <!-- Loading -->
    <div v-if="store.dashboardLoading" class="nist-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading NIST 800-53 dashboard...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="nist-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">Wazuh Indexer is not available.</p>
    </div>

    <!-- Dashboard content -->
    <template v-else-if="store.dashboardAggs">
      <!-- ======== GLOBAL VIEW (no agent selected) ======== -->
      <template v-if="!store.hasAgent">
        <div class="nist-grid-2">
          <!-- Top 10 Controls: Bar chart -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Top 10 NIST 800-53 controls</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topControls.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="bar"
                height="320"
                :options="topControlsChartOptions"
                :series="topControlsChartSeries"
              />
            </q-card-section>
          </q-card>

          <!-- Top 10 Agents: Donut chart -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Top 10 agents by alerts count</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topAgents.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="320"
                :options="topAgentsChartOptions"
                :series="topAgentsChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>

      <!-- ======== AGENT-SPECIFIC VIEW ======== -->
      <template v-else>
        <div class="nist-grid-3">
          <!-- Top 5 Rule Groups: Donut -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Top 5 rule groups</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topRuleGroups?.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="260"
                :options="ruleGroupsChartOptions"
                :series="ruleGroupsChartSeries"
              />
            </q-card-section>
          </q-card>

          <!-- Top 5 Rules: Donut -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Top 5 rules</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topRules?.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="260"
                :options="topRulesChartOptions"
                :series="topRulesChartSeries"
              />
            </q-card-section>
          </q-card>

          <!-- Top 5 NIST Controls: Donut -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Top 5 NIST 800-53 controls</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topControls.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="260"
                :options="topControlsDonutOptions"
                :series="topControlsDonutSeries"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="nist-grid-2">
          <!-- NIST Controls: Bar chart -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">NIST 800-53 controls</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <apexchart
                v-if="store.dashboardAggs.topControls.length"
                type="bar"
                height="260"
                :options="nistControlsBarOptions"
                :series="nistControlsBarSeries"
              />
              <div v-else class="text-grey text-center q-pa-md">No data available</div>
            </q-card-section>
          </q-card>

          <!-- Rule Level Distribution: Donut -->
          <q-card flat bordered class="nist-card">
            <q-card-section class="nist-card-header">
              <div class="nist-card__title">Rule level distribution</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.ruleLevelDistribution?.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="260"
                :options="ruleLevelChartOptions"
                :series="ruleLevelChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>

      <!-- Trend chart (always shown) -->
      <q-card flat bordered class="nist-card nist-card--full">
        <q-card-section class="nist-card-header">
          <div class="nist-card__title">Alerts trend over time</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-if="!trendChartData.length" class="text-grey text-center q-pa-md">
            No trend data available
          </div>
          <apexchart
            v-else
            type="area"
            height="220"
            :options="trendChartOptions"
            :series="trendChartSeries"
          />
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useNist80053Store } from "@/stores/nist80053";

const apexchart = VueApexCharts;
const store = useNist80053Store();

const chartColors = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#ca8a04",
  "#16a34a", "#0891b2", "#6366f1", "#e11d48", "#059669",
];

// === Shared chart theme ===
const baseChartOptions = {
  chart: {
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  theme: { mode: "light" as const },
  colors: chartColors,
};

// === GLOBAL VIEW Charts ===

// Top 10 Controls - Bar chart
const topControlsChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "bar" as const },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "60%", borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: store.dashboardAggs?.topControls.map((r) => r.control) ?? [],
    labels: { style: { fontSize: "11px" } },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  tooltip: { y: { formatter: (val: number) => val.toLocaleString() } },
}));

const topControlsChartSeries = computed(() => [
  {
    name: "Alerts",
    data: store.dashboardAggs?.topControls.map((r) => r.doc_count) ?? [],
  },
]);

// Top 10 Agents - Donut chart
const topAgentsChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels: store.dashboardAggs?.topAgents.map((a) => a.agent_name) ?? [],
  legend: { position: "right" as const, fontSize: "12px" },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: { donut: { size: "55%" } },
  },
}));

const topAgentsChartSeries = computed(
  () => store.dashboardAggs?.topAgents.map((a) => a.doc_count) ?? [],
);

// === AGENT-SPECIFIC VIEW Charts ===

// Top 5 Rule Groups - Donut
const ruleGroupsChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels: store.dashboardAggs?.topRuleGroups?.map((g) => g.group) ?? [],
  legend: { position: "right" as const, fontSize: "11px" },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "50%" } } },
}));

const ruleGroupsChartSeries = computed(
  () => store.dashboardAggs?.topRuleGroups?.map((g) => g.doc_count) ?? [],
);

// Top 5 Rules - Donut
const topRulesChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels:
    store.dashboardAggs?.topRules?.map(
      (r) => r.description.length > 25 ? r.description.substring(0, 25) + "..." : r.description,
    ) ?? [],
  legend: { position: "right" as const, fontSize: "11px" },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "50%" } } },
}));

const topRulesChartSeries = computed(
  () => store.dashboardAggs?.topRules?.map((r) => r.doc_count) ?? [],
);

// Top 5 NIST Controls (agent view) - Donut
const topControlsDonutOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels: store.dashboardAggs?.topControls.map((r) => r.control) ?? [],
  legend: { position: "right" as const, fontSize: "11px" },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "50%" } } },
}));

const topControlsDonutSeries = computed(
  () => store.dashboardAggs?.topControls.map((r) => r.doc_count) ?? [],
);

// NIST Controls bar chart (agent view, bottom left)
const nistControlsBarOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "bar" as const },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: store.dashboardAggs?.topControls.map((r) => r.control) ?? [],
    title: { text: "NIST 800-53 Controls" },
    labels: { style: { fontSize: "11px" } },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  legend: { position: "top" as const, fontSize: "11px" },
}));

const nistControlsBarSeries = computed(() => [
  {
    name: "Alerts",
    data: store.dashboardAggs?.topControls.map((r) => r.doc_count) ?? [],
  },
]);

// Rule Level Distribution - Donut
const ruleLevelChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels:
    store.dashboardAggs?.ruleLevelDistribution?.map(
      (l) => `${l.level}`,
    ) ?? [],
  legend: { position: "right" as const, fontSize: "11px" },
  dataLabels: {
    enabled: true,
    formatter: (_val: number, opts: { seriesIndex: number }) => {
      const dist = store.dashboardAggs?.ruleLevelDistribution;
      if (!dist) return "";
      const item = dist[opts.seriesIndex];
      return item ? `${item.level} (${item.percentage}%)` : "";
    },
  },
  plotOptions: { pie: { donut: { size: "50%" } } },
}));

const ruleLevelChartSeries = computed(
  () =>
    store.dashboardAggs?.ruleLevelDistribution?.map((l) => l.doc_count) ?? [],
);

// === Trend chart (always shown) ===
const trendChartData = computed(() => store.dashboardAggs?.trend ?? []);

const trendChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: {
    ...baseChartOptions.chart,
    type: "area" as const,
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth" as const, width: 2 },
  fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
  xaxis: {
    type: "datetime" as const,
    labels: {
      datetimeUTC: false,
      style: { fontSize: "10px" },
    },
    title: { text: "timestamp per 30 minutes" },
  },
  yaxis: {
    title: { text: "Count" },
    labels: { style: { fontSize: "11px" } },
  },
  tooltip: {
    x: { format: "MMM dd, HH:mm" },
    y: { formatter: (val: number) => val.toLocaleString() },
  },
}));

const trendChartSeries = computed(() => [
  {
    name: "Alerts",
    data: trendChartData.value.map((b) => ({
      x: b.key,
      y: b.doc_count,
    })),
  },
]);
</script>

<style scoped>
.nist-dashboard {
  padding: 20px;
  min-height: 400px;
}

.nist-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.nist-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.nist-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.nist-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.nist-card--full {
  margin-bottom: 16px;
}

.nist-card-header {
  padding-bottom: 4px;
}

.nist-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

@media (max-width: 1024px) {
  .nist-grid-3 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .nist-grid-2,
  .nist-grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Dark mode */
.body--dark .nist-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .nist-card__title {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
