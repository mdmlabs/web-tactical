<template>
  <q-card flat bordered class="events-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">Events count evolution</div>
        <q-select
          v-model="timeRange"
          :options="timeOptions"
          dense
          outlined
          emit-value
          map-options
          style="width: 160px"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-inner-loading :showing="loading" />
      <apexchart
        v-if="!loading"
        type="bar"
        height="220"
        :options="chartOptions"
        :series="chartSeries"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

const props = defineProps<{
  hourlyData: number[];
  loading: boolean;
}>();

const timeRange = ref("24h");
const timeOptions = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 12 hours", value: "12h" },
];

const chartSeries = computed(() => {
  const data = props.hourlyData.length ? props.hourlyData : new Array(24).fill(0);
  const sliceCount = timeRange.value === "12h" ? 12 : 24;
  return [{ name: "Events", data: data.slice(0, sliceCount) }];
});

const chartOptions = computed(() => {
  const count = timeRange.value === "12h" ? 12 : 24;
  const categories = Array.from({ length: count }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  return {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#2563eb"],
    plotOptions: {
      bar: { borderRadius: 2, columnWidth: "60%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "10px", colors: "#69707d" },
        rotate: -45,
        rotateAlways: count > 12,
      },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", colors: "#69707d" } },
    },
    grid: {
      borderColor: "#edf0f5",
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (val: number) => String(Math.round(val)) },
    },
  };
});
</script>

<style scoped>
.events-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}
</style>
