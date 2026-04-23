<template>
  <div class="fim-dashboard">
    <FIMFilterBar @refresh="fimStore.fetchDashboardAggs()" />

    <!-- Indexer unavailable banner -->
    <q-banner v-if="!fimStore.indexerAvailable" class="bg-warning text-dark q-mx-md q-mt-md" rounded>
      <template #avatar><q-icon name="warning" color="dark" /></template>
      MDM-Lab Indexer is currently unavailable. Dashboard data cannot be loaded.
      <template #action>
        <q-btn flat label="Retry" @click="fimStore.fetchDashboardAggs()" />
      </template>
    </q-banner>

    <!-- Loading skeleton -->
    <div v-if="fimStore.dashboardLoading" class="dashboard-loading q-pa-md">
      <div class="charts-row">
        <q-card v-for="i in 3" :key="i" flat bordered class="chart-card">
          <q-skeleton height="200px" />
        </q-card>
      </div>
      <div class="charts-row q-mt-md">
        <q-card v-for="i in 3" :key="i + 3" flat bordered class="chart-card">
          <q-skeleton height="200px" />
        </q-card>
      </div>
    </div>

    <!-- Dashboard content -->
    <div v-else class="dashboard-content q-pa-md">
      <!-- Top row: Most active users, Actions, Events timeline -->
      <div class="charts-row">
        <!-- Most active users -->
        <q-card flat bordered class="chart-card">
          <div class="chart-title">Most active users</div>
          <div class="chart-body">
            <apexchart
              v-if="usersChartSeries.length"
              type="donut"
              height="180"
              :options="usersChartOptions"
              :series="usersChartSeries"
            />
            <div v-else class="chart-empty">No data</div>
            <div class="chart-legend">
              <div v-for="(item, idx) in aggs.activeUsers" :key="item.name" class="legend-item">
                <span class="legend-dot" :style="{ background: donutColors[idx % donutColors.length] }" />
                <span class="legend-text">{{ truncate(item.name, 20) }} ({{ formatPercent(item.count, userTotal) }})</span>
              </div>
            </div>
          </div>
        </q-card>

        <!-- Actions -->
        <q-card flat bordered class="chart-card">
          <div class="chart-title">Actions</div>
          <div class="chart-body">
            <apexchart
              v-if="actionsChartSeries.length"
              type="donut"
              height="180"
              :options="actionsChartOptions"
              :series="actionsChartSeries"
            />
            <div v-else class="chart-empty">No data</div>
            <div class="chart-legend">
              <div v-for="(item, idx) in aggs.actions" :key="item.event" class="legend-item">
                <span class="legend-dot" :style="{ background: actionColors[item.event] ?? donutColors[idx] }" />
                <span class="legend-text">{{ item.event }} ({{ formatPercent(item.count, actionTotal) }})</span>
              </div>
            </div>
          </div>
        </q-card>

        <!-- Events timeline -->
        <q-card flat bordered class="chart-card chart-card--wide">
          <div class="chart-title">Events</div>
          <div class="chart-body-full">
            <apexchart
              v-if="timelineSeries.length"
              type="bar"
              height="200"
              :options="timelineChartOptions"
              :series="timelineSeries"
            />
            <div v-else class="chart-empty">No data</div>
          </div>
        </q-card>
      </div>

      <!-- Bottom row: Files added, modified, deleted -->
      <div class="charts-row q-mt-md">
        <q-card flat bordered class="chart-card">
          <div class="chart-title">Files added</div>
          <div class="chart-body">
            <apexchart
              v-if="filesAddedSeries.length"
              type="donut"
              height="180"
              :options="filesAddedOptions"
              :series="filesAddedSeries"
            />
            <div v-else class="chart-empty">No data</div>
            <div class="chart-legend">
              <div v-for="(item, idx) in aggs.filesAdded" :key="item.path" class="legend-item">
                <span class="legend-dot" :style="{ background: donutColors[idx % donutColors.length] }" />
                <span class="legend-text">{{ truncate(item.path, 25) }}</span>
              </div>
            </div>
          </div>
        </q-card>

        <q-card flat bordered class="chart-card">
          <div class="chart-title">Files modified</div>
          <div class="chart-body">
            <apexchart
              v-if="filesModifiedSeries.length"
              type="donut"
              height="180"
              :options="filesModifiedOptions"
              :series="filesModifiedSeries"
            />
            <div v-else class="chart-empty">No data</div>
            <div class="chart-legend">
              <div v-for="(item, idx) in aggs.filesModified" :key="item.path" class="legend-item">
                <span class="legend-dot" :style="{ background: donutColors[idx % donutColors.length] }" />
                <span class="legend-text">{{ truncate(item.path, 25) }}</span>
              </div>
            </div>
          </div>
        </q-card>

        <q-card flat bordered class="chart-card">
          <div class="chart-title">Files deleted</div>
          <div class="chart-body">
            <apexchart
              v-if="filesDeletedSeries.length"
              type="donut"
              height="180"
              :options="filesDeletedOptions"
              :series="filesDeletedSeries"
            />
            <div v-else class="chart-empty">No data</div>
            <div class="chart-legend">
              <div v-for="(item, idx) in aggs.filesDeleted" :key="item.path" class="legend-item">
                <span class="legend-dot" :style="{ background: donutColors[idx % donutColors.length] }" />
                <span class="legend-text">{{ truncate(item.path, 25) }}</span>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFimStore } from "@/stores/fim";
import VueApexCharts from "vue3-apexcharts";
import FIMFilterBar from "./FIMFilterBar.vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

const fimStore = useFimStore();

const donutColors = ["#006699", "#00a9e5", "#47c68e", "#fdbc40", "#ff645c", "#a481d4", "#6ec6ff", "#ffcc80"];
const actionColors: Record<string, string> = {
  added: "#47c68e",
  modified: "#fdbc40",
  deleted: "#ff645c",
};

const emptyAggs = {
  activeUsers: [],
  actions: [],
  eventsTimeline: [],
  filesAdded: [],
  filesModified: [],
  filesDeleted: [],
};

const aggs = computed(() => fimStore.dashboardAggs ?? emptyAggs);

// === Most active users ===
const userTotal = computed(() => aggs.value.activeUsers.reduce((s, u) => s + u.count, 0));
const usersChartSeries = computed(() => aggs.value.activeUsers.map((u) => u.count));
const usersChartOptions = computed(() => makeDonutOptions(
  aggs.value.activeUsers.map((u) => u.name),
  donutColors.slice(0, aggs.value.activeUsers.length),
));

// === Actions ===
const actionTotal = computed(() => aggs.value.actions.reduce((s, a) => s + a.count, 0));
const actionsChartSeries = computed(() => aggs.value.actions.map((a) => a.count));
const actionsChartOptions = computed(() => makeDonutOptions(
  aggs.value.actions.map((a) => a.event),
  aggs.value.actions.map((a) => actionColors[a.event] ?? "#a3a7b0"),
));

// === Timeline ===
const timelineSeries = computed(() => {
  const tl = aggs.value.eventsTimeline;
  if (!tl.length) return [];
  return [
    { name: "added", data: tl.map((b) => b.added) },
    { name: "modified", data: tl.map((b) => b.modified) },
    { name: "deleted", data: tl.map((b) => b.deleted) },
  ];
});

const timelineChartOptions = computed(() => ({
  chart: { type: "bar" as const, stacked: true, toolbar: { show: false }, fontFamily: "inherit" },
  colors: ["#47c68e", "#fdbc40", "#ff645c"],
  plotOptions: { bar: { columnWidth: "70%", borderRadius: 2 } },
  xaxis: {
    categories: aggs.value.eventsTimeline.map((b) => {
      const d = new Date(b.timestamp);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }),
    labels: { style: { fontSize: "10px", colors: "#999" }, rotate: -45, rotateAlways: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { fontSize: "11px", colors: "#999" } } },
  grid: { borderColor: "#f0f0f0", strokeDashArray: 4 },
  legend: { position: "top" as const, fontSize: "12px", markers: { size: 8, shape: "circle" as const } },
  tooltip: { shared: true, intersect: false },
  dataLabels: { enabled: false },
}));

// === Files added/modified/deleted ===
const filesAddedSeries = computed(() => aggs.value.filesAdded.map((f) => f.count));
const filesAddedOptions = computed(() => makeDonutOptions(
  aggs.value.filesAdded.map((f) => f.path),
  donutColors.slice(0, aggs.value.filesAdded.length),
));

const filesModifiedSeries = computed(() => aggs.value.filesModified.map((f) => f.count));
const filesModifiedOptions = computed(() => makeDonutOptions(
  aggs.value.filesModified.map((f) => f.path),
  donutColors.slice(0, aggs.value.filesModified.length),
));

const filesDeletedSeries = computed(() => aggs.value.filesDeleted.map((f) => f.count));
const filesDeletedOptions = computed(() => makeDonutOptions(
  aggs.value.filesDeleted.map((f) => f.path),
  donutColors.slice(0, aggs.value.filesDeleted.length),
));

// === Helpers ===
function makeDonutOptions(labels: string[], colors: string[]) {
  return {
    chart: { type: "donut" as const, fontFamily: "inherit" },
    colors,
    labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: { show: false },
        },
      },
    },
    stroke: { width: 2, colors: ["#fff"] },
    tooltip: { enabled: true },
  };
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.substring(0, len) + "..." : str;
}

function formatPercent(count: number, total: number): string {
  if (!total) return "0%";
  return ((count / total) * 100).toFixed(2) + "%";
}
</script>

<style scoped>
.fim-dashboard {
  min-height: 100%;
}

.dashboard-loading,
.dashboard-content {
  padding: 16px;
}

.charts-row {
  display: flex;
  gap: 16px;
}

.chart-card {
  flex: 1;
  min-width: 0;
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow-sm);
}

.chart-card--wide {
  flex: 1.5;
}

.chart-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 14px 16px 0;
}

.chart-body {
  display: flex;
  align-items: center;
  padding: 8px 16px 16px;
  gap: 8px;
}

.chart-body-full {
  padding: 8px 16px 16px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--mdm-text-primary, #1a1a1a);
  min-width: 0;
  overflow: hidden;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 100%;
  color: var(--mdm-text-muted, #999);
  font-size: 13px;
}

/* Responsive */
@media (max-width: 960px) {
  .charts-row {
    flex-direction: column;
  }
  .chart-body {
    flex-direction: column;
    align-items: center;
  }
}

/* Dark mode */
.body--dark .chart-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
