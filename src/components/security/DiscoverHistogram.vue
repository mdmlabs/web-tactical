<template>
  <q-card flat bordered class="histogram-card">
    <q-card-section class="q-py-sm">
      <div class="row items-center justify-between">
        <span class="hits-label">{{ totalHits.toLocaleString() }} hits</span>
        <span class="text-caption text-grey">{{ intervalLabel }}</span>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-inner-loading :showing="loading" />
      <apexchart
        v-if="!loading"
        type="bar"
        height="160"
        :options="chartOptions"
        :series="chartSeries"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

const props = defineProps<{
  buckets: { timestamp: string; count: number }[];
  totalHits: number;
  loading: boolean;
  intervalLabel: string;
}>();

const chartSeries = computed(() => {
  if (!props.buckets.length) {
    return [{ name: "Hits", data: new Array(24).fill(0) }];
  }
  return [{ name: "Hits", data: props.buckets.map((b) => b.count) }];
});

const chartOptions = computed(() => {
  let categories: string[];
  if (props.buckets.length) {
    categories = props.buckets.map((b) => {
      try {
        const d = new Date(b.timestamp);
        return d.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return b.timestamp;
      }
    });
  } else {
    categories = Array.from({ length: 24 }, (_, i) => {
      const h = String(i).padStart(2, "0");
      return `${h}:00`;
    });
  }

  return {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: ["#54b399"],
    plotOptions: {
      bar: { borderRadius: 1, columnWidth: "80%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "10px", colors: "#69707d" },
        rotate: -45,
        rotateAlways: categories.length > 30,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "10px", colors: "#69707d" } },
    },
    grid: {
      borderColor: "#edf0f5",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} events` },
    },
  };
});
</script>

<style scoped>
.histogram-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.hits-label {
  font-size: 20px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}
</style>
