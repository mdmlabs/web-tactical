<template>
  <q-card flat bordered class="compliance-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">Compliance</div>
        <q-select
          v-model="selectedFramework"
          :options="computedFrameworkOptions"
          dense
          outlined
          emit-value
          map-options
          style="width: 130px"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-inner-loading :showing="loading" />
      <div v-if="!loading && topItems.length === 0" class="text-grey text-center q-py-md">
        No compliance data available
      </div>
      <div v-else-if="!loading" class="chart-body">
        <apexchart
          type="donut"
          height="200"
          :options="chartOptions"
          :series="chartSeries"
        />
        <div class="chart-legend">
          <div
            v-for="(item, idx) in topItems"
            :key="item.requirement"
            class="legend-item legend-item--clickable"
            @click="onItemClick(item)"
          >
            <span
              class="legend-dot"
              :style="{ background: colors[idx % colors.length] }"
            />
            <span class="legend-text">{{ item.requirement }} ({{ item.count }})</span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apexchart = VueApexCharts;

const props = withDefaults(
  defineProps<{
    data: { requirement: string; count: number }[];
    loading: boolean;
    frameworks?: { label: string; value: string }[];
  }>(),
  {
    frameworks: () => [{ label: "PCI DSS", value: "pci_dss" }],
  },
);

const emit = defineEmits<{
  "item-click": [payload: { requirement: string; framework: string }];
}>();

const selectedFramework = defineModel<string>("framework", { default: "pci_dss" });

const computedFrameworkOptions = computed(() => props.frameworks);

// Auto-select first available framework if current selection has no data
watch(
  () => props.frameworks,
  (fws) => {
    if (fws.length > 0 && !fws.find((f) => f.value === selectedFramework.value)) {
      selectedFramework.value = fws[0].value;
    }
  },
  { immediate: true },
);

const colors = ["#47c68e", "#00a9e5", "#fdbc40", "#ff645c", "#a481d4", "#006bb8"];

const topItems = computed(() => props.data.slice(0, 6));

const chartSeries = computed(() => topItems.value.map((d) => d.count));

const chartOptions = computed(() => ({
  chart: { type: "donut" as const },
  colors: colors.slice(0, topItems.value.length),
  labels: topItems.value.map((d) => d.requirement),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            fontSize: "13px",
            fontWeight: 600,
            formatter: () => {
              const total = topItems.value.reduce((s, d) => s + d.count, 0);
              return String(total);
            },
          },
        },
      },
    },
  },
  stroke: { width: 2, colors: ["#fff"] },
  tooltip: { enabled: true },
}));

function onItemClick(item: { requirement: string; count: number }) {
  emit("item-click", {
    requirement: item.requirement,
    framework: selectedFramework.value,
  });
}
</script>

<style scoped>
.compliance-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}

.chart-body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  white-space: nowrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item--clickable {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px;
  transition: background 0.15s;
}

.legend-item--clickable:hover {
  background: var(--mdm-bg-hover, rgba(0, 0, 0, 0.04));
}

.legend-item--clickable:hover .legend-text {
  color: var(--mdm-primary, #2563eb);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
