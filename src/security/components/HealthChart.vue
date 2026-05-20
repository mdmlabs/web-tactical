<template>
  <q-card flat bordered class="health-chart-card">
    <q-card-section class="q-pb-sm">
      <div class="row items-center">
        <div>
          <div class="text-subtitle2">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-grey-7">
            {{ subtitle }}
          </div>
        </div>
        <q-space />
        <q-chip
          v-if="maxValue !== null && maxValue !== currentValue"
          dense
          :color="peakColor"
          text-color="white"
          size="sm"
        >
          Peak {{ maxValue.toFixed(1) }}%
          <span v-if="peakLabel">&nbsp;{{ peakLabel }}</span>
        </q-chip>
        <q-chip dense :color="statusColor" text-color="white" size="sm">
          {{ currentValue !== null ? `${currentValue.toFixed(1)}%` : "N/A" }}
        </q-chip>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div ref="chartEl" style="height: 120px" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps<{
  title: string;
  data: number[];      // array of percentage values
  labels?: string[];   // optional timestamp labels
  subtitle?: string;
  warnThreshold?: number;  // default 85
  critThreshold?: number;  // default 95
  color?: string;
}>();

const chartEl = ref<HTMLElement | null>(null);
let chart: any = null;

const warnAt = computed(() => props.warnThreshold ?? 85);
const critAt = computed(() => props.critThreshold ?? 95);

const currentValue = computed(() => {
  if (!props.data || props.data.length === 0) return null;
  return props.data[props.data.length - 1];
});

const maxValue = computed(() => {
  if (!props.data || props.data.length === 0) return null;
  return Math.max(...props.data);
});

const peakLabel = computed(() => {
  if (maxValue.value === null || !props.labels?.length) return "";
  const index = props.data.findIndex((value) => value === maxValue.value);
  return index >= 0 ? `at ${props.labels[index]}` : "";
});

const statusColor = computed(() => {
  const v = currentValue.value;
  if (v === null) return "grey";
  if (v >= critAt.value) return "negative";
  if (v >= warnAt.value) return "warning";
  return "positive";
});

const peakColor = computed(() => {
  const v = maxValue.value;
  if (v === null) return "grey";
  if (v >= critAt.value) return "negative";
  if (v >= warnAt.value) return "warning";
  return "positive";
});

const chartColor = computed(() => {
  const v = currentValue.value;
  if (v === null) return "#9E9E9E";
  if (v >= critAt.value) return "#F44336";
  if (v >= warnAt.value) return "#FF9800";
  return "#4CAF50";
});

async function initChart() {
  if (!chartEl.value) return;

  try {
    const ApexCharts = (await import("apexcharts")).default;

    const options = {
      chart: {
        type: "area",
        height: 120,
        sparkline: { enabled: true },
        animations: { enabled: false },
        toolbar: { show: false },
      },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.4,
          opacityTo: 0.05,
        },
      },
      series: [
        {
          name: props.title,
          data: props.data.length > 0 ? props.data : [0],
        },
      ],
      xaxis: {
        categories: props.labels || [],
        labels: { show: false },
        axisBorder: { show: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: { show: false },
      },
      colors: [chartColor.value],
      tooltip: {
        x: {
          formatter: (_val: unknown, opts: any) =>
            props.labels?.[opts.dataPointIndex] || "",
        },
        y: {
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
      },
      annotations: {
        yaxis: [
          {
            y: warnAt.value,
            borderColor: "#FF9800",
            strokeDashArray: 4,
          },
          {
            y: critAt.value,
            borderColor: "#F44336",
            strokeDashArray: 4,
          },
        ],
      },
    };

    chart = new ApexCharts(chartEl.value, options);
    chart.render();
  } catch (e) {
    console.warn("ApexCharts not available:", e);
  }
}

function updateChart() {
  if (!chart) return;
  chart.updateOptions({
    colors: [chartColor.value],
    xaxis: { categories: props.labels || [] },
  });
  chart.updateSeries([{ name: props.title, data: props.data }]);
}

onMounted(initChart);

watch(() => props.data, updateChart, { deep: true });
watch(() => props.labels, updateChart, { deep: true });
</script>

<style scoped>
.health-chart-card {
  border-radius: 8px;
}
</style>
