<template>
  <div class="gdpr-dashboard">
    <!-- Loading -->
    <div v-if="store.dashboardLoading" class="gdpr-center">
      <q-spinner-dots color="primary" size="48px" />
      <p class="q-mt-md text-grey-7">Loading GDPR dashboard...</p>
    </div>

    <!-- No data -->
    <div v-else-if="!store.indexerAvailable" class="gdpr-center">
      <q-icon name="cloud_off" size="48px" color="grey-5" />
      <p class="q-mt-md text-grey-7">Wazuh Indexer is not available.</p>
    </div>

    <!-- Dashboard content -->
    <template v-else-if="store.dashboardAggs">
      <!-- ======== GLOBAL VIEW (no agent selected) ======== -->
      <template v-if="!store.hasAgent">
        <div class="gdpr-grid-2">
          <!-- Top 10 Articles: Bar chart -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Top 10 GDPR articles</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topArticles.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="bar"
                height="320"
                :options="topArticlesChartOptions"
                :series="topArticlesChartSeries"
              />
            </q-card-section>
          </q-card>

          <!-- Top 10 Agents: Donut chart -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Top 10 agents by alerts count</div>
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
        <div class="gdpr-grid-3">
          <!-- Top 5 Rule Groups: Donut -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Top 5 rule groups</div>
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
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Top 5 rules</div>
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

          <!-- Top 5 GDPR Articles: Donut -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Top 5 GDPR articles</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div v-if="!store.dashboardAggs.topArticles.length" class="text-grey text-center q-pa-md">
                No data available
              </div>
              <apexchart
                v-else
                type="donut"
                height="260"
                :options="topArticlesDonutOptions"
                :series="topArticlesDonutSeries"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="gdpr-grid-2">
          <!-- GDPR Articles: Bar chart -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">GDPR articles</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <apexchart
                v-if="store.dashboardAggs.topArticles.length"
                type="bar"
                height="260"
                :options="gdprArticlesBarOptions"
                :series="gdprArticlesBarSeries"
              />
              <div v-else class="text-grey text-center q-pa-md">No data available</div>
            </q-card-section>
          </q-card>

          <!-- Rule Level Distribution: Donut -->
          <q-card flat bordered class="gdpr-card">
            <q-card-section class="gdpr-card-header">
              <div class="gdpr-card__title">Rule level distribution</div>
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
      <q-card flat bordered class="gdpr-card gdpr-card--full">
        <q-card-section class="gdpr-card-header">
          <div class="gdpr-card__title">Alerts trend over time</div>
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
import { useGdprStore } from "@/stores/gdpr";

const apexchart = VueApexCharts;
const store = useGdprStore();

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

// Top 10 Articles - Bar chart
const topArticlesChartOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "bar" as const },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "60%", borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: store.dashboardAggs?.topArticles.map((r) => r.article) ?? [],
    labels: { style: { fontSize: "11px" } },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  tooltip: { y: { formatter: (val: number) => val.toLocaleString() } },
}));

const topArticlesChartSeries = computed(() => [
  {
    name: "Alerts",
    data: store.dashboardAggs?.topArticles.map((r) => r.doc_count) ?? [],
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

// Top 5 GDPR Articles (agent view) - Donut
const topArticlesDonutOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "donut" as const },
  labels: store.dashboardAggs?.topArticles.map((r) => r.article) ?? [],
  legend: { position: "right" as const, fontSize: "11px" },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "50%" } } },
}));

const topArticlesDonutSeries = computed(
  () => store.dashboardAggs?.topArticles.map((r) => r.doc_count) ?? [],
);

// GDPR Articles bar chart (agent view, bottom left)
const gdprArticlesBarOptions = computed(() => ({
  ...baseChartOptions,
  chart: { ...baseChartOptions.chart, type: "bar" as const },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: store.dashboardAggs?.topArticles.map((r) => r.article) ?? [],
    title: { text: "GDPR Articles" },
    labels: { style: { fontSize: "11px" } },
  },
  yaxis: { title: { text: "Count" }, labels: { style: { fontSize: "11px" } } },
  legend: { position: "top" as const, fontSize: "11px" },
}));

const gdprArticlesBarSeries = computed(() => [
  {
    name: "Alerts",
    data: store.dashboardAggs?.topArticles.map((r) => r.doc_count) ?? [],
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
.gdpr-dashboard {
  padding: 20px;
  min-height: 400px;
}

.gdpr-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.gdpr-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.gdpr-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.gdpr-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.gdpr-card--full {
  margin-bottom: 16px;
}

.gdpr-card-header {
  padding-bottom: 4px;
}

.gdpr-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

@media (max-width: 1024px) {
  .gdpr-grid-3 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .gdpr-grid-2,
  .gdpr-grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Dark mode */
.body--dark .gdpr-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .gdpr-card__title {
  color: var(--mdm-text-primary, #e8ecf4);
}
</style>
