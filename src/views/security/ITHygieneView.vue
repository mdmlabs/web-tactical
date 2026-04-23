<template>
  <div class="it-hygiene">
    <!-- ===== Header ===== -->
    <div class="ih-header">
      <div class="ih-header-left">
        <q-badge color="blue-grey-8" text-color="white" label="IT Hygiene" class="ih-badge" />
      </div>
      <div class="ih-tabs">
        <div
          v-for="t in mainTabs"
          :key="t.id"
          class="ih-tab"
          :class="{ 'ih-tab--active': activeTab === t.id }"
          @click="activeTab = t.id"
        >
          {{ t.label }}
        </div>
      </div>
      <q-space />
      <q-btn flat dense no-caps icon="refresh" label="Refresh" :loading="wazuhStore.itHygieneLoading" @click="refreshAll" />
    </div>

    <!-- ===== Search / Filter Bar ===== -->
    <div class="ih-filter-bar">
      <q-icon name="search" size="18px" class="q-mr-sm text-grey-6" />
      <q-input
        v-model="searchText"
        dense
        borderless
        placeholder="Search"
        class="ih-search-input"
        clearable
      />
      <!-- Active filter chips -->
      <q-chip
        v-for="(f, idx) in activeFilters"
        :key="idx"
        removable
        dense
        color="blue-grey-2"
        text-color="blue-grey-9"
        :label="f"
        @remove="removeFilter(idx)"
        class="q-ml-sm"
      />
      <q-btn flat dense no-caps icon="add" label="Add filter" color="grey-7" class="q-ml-sm" @click="addFilterPrompt" />
    </div>

    <!-- ===== Loading ===== -->
    <div v-if="wazuhStore.itHygieneLoading || wazuhStore.agentsLoading" class="ih-loading">
      <q-spinner-dots size="40px" color="primary" />
      <span>Loading syscollector data...</span>
    </div>

    <!-- ===== Dashboard Tab Content ===== -->
    <div v-else-if="activeTab === 'dashboard'" class="ih-content">
      <!-- Row 1: OS families | Package types | Top 5 endpoints by memory -->
      <div class="ih-row ih-row--3col">
        <!-- Operating system families -->
        <div class="ih-widget">
          <div class="ih-widget-title">Operating system families</div>
          <q-table
            :rows="osFamilies"
            :columns="osFamilyColumns"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 0 }"
            class="ih-widget-table"
            @row-click="(_e: Event, row: { platform: string }) => addFilter('os.platform: ' + row.platform)"
          />
        </div>

        <!-- Package types -->
        <div class="ih-widget">
          <div class="ih-widget-title">Package types</div>
          <apexchart
            v-if="pkgTypeSeries.length > 0"
            type="bar"
            height="220"
            :options="pkgTypeOptions"
            :series="pkgTypeSeries"
          />
          <div v-else class="ih-widget-empty">No data</div>
        </div>

        <!-- Top 5 endpoints by memory -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 endpoints by me...</div>
          <q-table
            :rows="topEndpointsByMemory"
            :columns="endpointMemColumns"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 5 }"
            class="ih-widget-table"
          />
        </div>
      </div>

      <!-- Row 2: 4 tables side by side -->
      <div class="ih-row ih-row--4col">
        <!-- Top 5 installed packages -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 installed packages</div>
          <q-table
            :rows="topPackages"
            :columns="topCountColumns('Package')"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 5 }"
            class="ih-widget-table"
            @row-click="(_e: Event, row: { name: string }) => addFilter('package.name: ' + row.name)"
          />
        </div>

        <!-- Top 5 running processes -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 running processes</div>
          <q-table
            :rows="topProcesses"
            :columns="topCountColumns('Process')"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 5 }"
            class="ih-widget-table"
            @row-click="(_e: Event, row: { name: string }) => addFilter('process.name: ' + row.name)"
          />
        </div>

        <!-- Top 5 operating systems -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 operating systems</div>
          <q-table
            :rows="topOSNames"
            :columns="topCountColumns('OS')"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 5 }"
            class="ih-widget-table"
            @row-click="(_e: Event, row: { name: string }) => addFilter('os.name: ' + row.name)"
          />
        </div>

        <!-- Top 5 host CPUs -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 host CPUs</div>
          <q-table
            :rows="topCPUs"
            :columns="topCountColumns('CPU')"
            flat dense hide-bottom
            :pagination="{ rowsPerPage: 5 }"
            class="ih-widget-table"
          />
        </div>
      </div>

      <!-- Row 3: Destination ports | Source ports | Processes start time -->
      <div class="ih-row ih-row--3col">
        <!-- Top 5 destination ports -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 destination ports</div>
          <apexchart
            v-if="destPortSeries.length > 0"
            type="bar"
            height="220"
            :options="destPortOptions"
            :series="destPortSeries"
          />
          <div v-else class="ih-widget-empty">No data</div>
        </div>

        <!-- Top 5 source ports -->
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 source ports</div>
          <apexchart
            v-if="srcPortSeries.length > 0"
            type="bar"
            height="220"
            :options="srcPortOptions"
            :series="srcPortSeries"
          />
          <div v-else class="ih-widget-empty">No data</div>
        </div>

        <!-- Processes start time -->
        <div class="ih-widget">
          <div class="ih-widget-title">Processes start time</div>
          <apexchart
            v-if="procStartTimeSeries[0]?.data?.length > 0"
            type="area"
            height="220"
            :options="procStartTimeOptions"
            :series="procStartTimeSeries"
          />
          <div v-else class="ih-widget-empty">No data</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="ih-footer">This dashboard contains live data from MDM-Lab API</div>
    </div>

    <!-- ===== SYSTEM TAB ===== -->
    <div v-else-if="activeTab === 'system'" class="ih-content">
      <div class="ih-row ih-row--3col">
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 platforms</div>
          <apexchart type="bar" height="220" :options="sysPlatformOptions" :series="sysPlatformSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 operating systems</div>
          <apexchart type="bar" height="220" :options="sysOSOptions" :series="sysOSSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Architecture</div>
          <apexchart type="bar" height="220" :options="sysArchOptions" :series="sysArchSeries" />
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygieneOSList.length }} hits</span>
          <q-space />
          <q-input v-model="systemSearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredSystemRows" :columns="systemColumns" row-key="agent_id" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>

    <!-- ===== SOFTWARE TAB ===== -->
    <div v-else-if="activeTab === 'software'" class="ih-content">
      <div class="ih-row ih-row--2col">
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 vendors</div>
          <apexchart type="bar" height="220" :options="softVendorOptions" :series="softVendorSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Package types</div>
          <apexchart type="bar" height="220" :options="softFormatOptions" :series="softFormatSeries" />
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygienePackages.length }} hits</span>
          <q-space />
          <q-input v-model="softwareSearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredSoftwareRows" :columns="softwareColumns" row-key="_uid" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>

    <!-- ===== PROCESSES TAB ===== -->
    <div v-else-if="activeTab === 'processes'" class="ih-content">
      <div class="ih-row ih-row--2col">
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 processes</div>
          <apexchart type="bar" height="220" :options="procTopOptions" :series="procTopSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Process states</div>
          <apexchart type="bar" height="220" :options="procStateOptions" :series="procStateSeries" />
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygieneProcesses.length }} hits</span>
          <q-space />
          <q-input v-model="processSearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredProcessRows" :columns="processColumns" row-key="_uid" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>

    <!-- ===== NETWORK TAB ===== -->
    <div v-else-if="activeTab === 'network'" class="ih-content">
      <div class="ih-row ih-row--2col">
        <div class="ih-widget">
          <div class="ih-widget-title">Network types</div>
          <apexchart type="bar" height="220" :options="netTypeOptions" :series="netTypeSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 interface names</div>
          <apexchart type="bar" height="220" :options="netIfaceOptions" :series="netIfaceSeries" />
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygieneNetiface.length }} hits</span>
          <q-space />
          <q-input v-model="networkSearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredNetworkRows" :columns="networkColumns" row-key="_uid" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>

    <!-- ===== IDENTITY TAB ===== -->
    <div v-else-if="activeTab === 'identity'" class="ih-content">
      <div class="ih-row ih-row--3col">
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 users</div>
          <apexchart type="bar" height="220" :options="idUsersOptions" :series="idUsersSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 user groups</div>
          <apexchart type="bar" height="220" :options="idGroupsOptions" :series="idGroupsSeries" />
        </div>
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 process states</div>
          <apexchart type="bar" height="220" :options="idStatesOptions" :series="idStatesSeries" />
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygieneProcesses.length }} processes</span>
          <q-space />
          <q-input v-model="identitySearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredIdentityRows" :columns="identityColumns" row-key="_uid" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>

    <!-- ===== SERVICES TAB ===== -->
    <div v-else-if="activeTab === 'services'" class="ih-content">
      <div class="ih-row ih-row--2col">
        <div class="ih-widget">
          <div class="ih-widget-title">Top 5 listening ports</div>
          <apexchart type="bar" height="220" :options="svcTopOptions" :series="svcTopSeries" />
        </div>
        <div class="ih-widget ih-widget--stat">
          <div class="ih-widget-title">Unique listening ports</div>
          <div class="ih-big-number">{{ uniquePortsCount }}</div>
        </div>
      </div>
      <div class="ih-table-wrap">
        <div class="ih-table-toolbar">
          <span class="ih-table-hits">{{ wazuhStore.itHygienePorts.length }} hits</span>
          <q-space />
          <q-input v-model="servicesSearch" dense outlined placeholder="Search..." clearable class="ih-table-search">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-table :rows="filteredServicesRows" :columns="servicesColumns" row-key="_uid" flat dense :pagination="tablePagination" class="ih-table" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useWazuhStore } from "@/stores/wazuh";
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;

const wazuhStore = useWazuhStore();

// === Tabs ===
const mainTabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "system", label: "System" },
  { id: "software", label: "Software" },
  { id: "processes", label: "Processes" },
  { id: "network", label: "Network" },
  { id: "identity", label: "Identity" },
  { id: "services", label: "Services" },
];
const activeTab = ref("dashboard");

// === Search & Filters ===
const searchText = ref("");
const activeFilters = ref<string[]>([]);
const systemSearch = ref("");
const softwareSearch = ref("");
const processSearch = ref("");
const networkSearch = ref("");
const identitySearch = ref("");
const servicesSearch = ref("");
const tablePagination = ref({ rowsPerPage: 20 });

function addFilter(filter: string) {
  if (!activeFilters.value.includes(filter)) {
    activeFilters.value.push(filter);
  }
}

function removeFilter(idx: number) {
  activeFilters.value.splice(idx, 1);
}

function addFilterPrompt() {
  if (searchText.value?.trim()) {
    addFilter(searchText.value.trim());
    searchText.value = "";
  }
}

// === Helpers ===
function topN(map: Map<string, number>, n = 5) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

const barColors = ["#6dccb1", "#79aad9", "#e7664c", "#d6bf57", "#b9a888", "#54b399"];

function hBarOptions(categories: string[], colors = barColors) {
  return {
    chart: { type: "bar" as const, toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 3 } },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { style: { fontSize: "11px" } } },
    yaxis: { labels: { style: { fontSize: "11px" }, maxWidth: 140 } },
    colors,
    grid: { borderColor: "#e8ecf0", strokeDashArray: 3 },
    tooltip: { theme: "dark" },
  };
}

function vBarOptions(categories: string[], colors = barColors) {
  return {
    chart: { type: "bar" as const, toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 3, distributed: true } },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { style: { fontSize: "11px" } } },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    colors,
    legend: { show: true, position: "right" as const, fontSize: "11px" },
    grid: { borderColor: "#e8ecf0", strokeDashArray: 3 },
    tooltip: { theme: "dark" },
  };
}

function topCountColumns(label: string) {
  return [
    { name: "name", label, field: "name", align: "left" as const, sortable: true },
    { name: "count", label: "Count", field: "count", align: "right" as const, sortable: true },
  ];
}

function formatMemory(bytes: number | undefined): string {
  if (!bytes) return "—";
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)}GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${bytes}B`;
}

// ==================================
// DASHBOARD TAB
// ==================================

// Operating system families
const osFamilies = computed(() => {
  const map = new Map<string, number>();
  for (const o of wazuhStore.itHygieneOSList) {
    const k = o.os_platform || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map, 10).map(([platform, count]) => ({ platform, count }));
});
const osFamilyColumns = [
  { name: "platform", label: "Platform", field: "platform", align: "left" as const, sortable: true },
  { name: "count", label: "Count", field: "count", align: "right" as const, sortable: true },
];

// Package types (bar chart with distributed colors like Wazuh)
const pkgTypeData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePackages) {
    const k = p.format || "Others";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map, 6);
});
const pkgTypeOptions = computed(() =>
  vBarOptions(pkgTypeData.value.map(([k]) => k)),
);
const pkgTypeSeries = computed(() => [{
  name: "Count",
  data: pkgTypeData.value.map(([, v]) => v),
}]);

// Top 5 endpoints by memory
const topEndpointsByMemory = computed(() => {
  return wazuhStore.itHygieneHardwareList
    .filter((h) => h.ram?.total)
    .sort((a, b) => (b.ram?.total ?? 0) - (a.ram?.total ?? 0))
    .slice(0, 5)
    .map((h) => ({
      agent: h.agent_name,
      totalMemory: formatMemory(h.ram?.total),
      usage: h.ram?.usage != null ? `${h.ram.usage}%` : "—",
    }));
});
const endpointMemColumns = [
  { name: "agent", label: "Agent", field: "agent", align: "left" as const },
  { name: "totalMemory", label: "Total memory", field: "totalMemory", align: "right" as const },
  { name: "usage", label: "Usage", field: "usage", align: "right" as const },
];

// Top 5 installed packages
const topPackages = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePackages) {
    const k = p.name || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map).map(([name, count]) => ({ name, count }));
});

// Top 5 running processes
const topProcesses = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) {
    const k = p.name || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map).map(([name, count]) => ({ name, count }));
});

// Top 5 operating systems
const topOSNames = computed(() => {
  const map = new Map<string, number>();
  for (const o of wazuhStore.itHygieneOSList) {
    const k = o.os_name || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map).map(([name, count]) => ({ name, count }));
});

// Top 5 host CPUs
const topCPUs = computed(() => {
  const map = new Map<string, number>();
  for (const h of wazuhStore.itHygieneHardwareList) {
    const k = h.cpu?.name || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return topN(map).map(([name, count]) => ({ name, count }));
});

// Top 5 destination ports (horizontal bar)
const destPortData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePorts) {
    const port = p.local?.port ?? "?";
    map.set(String(port), (map.get(String(port)) ?? 0) + 1);
  }
  return topN(map);
});
const destPortOptions = computed(() => hBarOptions(destPortData.value.map(([k]) => k)));
const destPortSeries = computed(() => [{ name: "Count", data: destPortData.value.map(([, v]) => v) }]);

// Top 5 source ports (horizontal bar)
const srcPortData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePorts) {
    const port = p.remote?.port ?? p.local?.port ?? "?";
    map.set(String(port), (map.get(String(port)) ?? 0) + 1);
  }
  return topN(map);
});
const srcPortOptions = computed(() => hBarOptions(srcPortData.value.map(([k]) => k)));
const srcPortSeries = computed(() => [{ name: "Count", data: srcPortData.value.map(([, v]) => v) }]);

// Processes start time (area chart)
const procStartTimeSeries = computed(() => {
  const buckets = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) {
    if (!p.start_time) continue;
    try {
      const d = new Date(p.start_time * 1000);
      const day = d.toISOString().slice(0, 10);
      buckets.set(day, (buckets.get(day) ?? 0) + 1);
    } catch {
      // skip invalid
    }
  }
  const sorted = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  return [{ name: "Processes", data: sorted.map(([x, y]) => ({ x, y })) }];
});
const procStartTimeOptions = computed(() => ({
  chart: { type: "area" as const, toolbar: { show: false }, fontFamily: "inherit", sparkline: { enabled: false } },
  stroke: { curve: "smooth" as const, width: 2 },
  colors: ["#54b399"],
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: { type: "category" as const, labels: { style: { fontSize: "10px" }, rotate: -45, rotateAlways: true } },
  yaxis: { labels: { style: { fontSize: "11px" } } },
  dataLabels: { enabled: false },
  grid: { borderColor: "#e8ecf0", strokeDashArray: 3 },
  tooltip: { theme: "dark" },
}));

// ==================================
// SYSTEM TAB
// ==================================
const sysPlatformData = computed(() => {
  const map = new Map<string, number>();
  for (const o of wazuhStore.itHygieneOSList) map.set(o.os_platform || "Unknown", (map.get(o.os_platform || "Unknown") ?? 0) + 1);
  return topN(map);
});
const sysPlatformOptions = computed(() => hBarOptions(sysPlatformData.value.map(([k]) => k)));
const sysPlatformSeries = computed(() => [{ name: "Count", data: sysPlatformData.value.map(([, v]) => v) }]);

const sysOSData = computed(() => {
  const map = new Map<string, number>();
  for (const o of wazuhStore.itHygieneOSList) map.set(o.os_name || "Unknown", (map.get(o.os_name || "Unknown") ?? 0) + 1);
  return topN(map);
});
const sysOSOptions = computed(() => hBarOptions(sysOSData.value.map(([k]) => k)));
const sysOSSeries = computed(() => [{ name: "Count", data: sysOSData.value.map(([, v]) => v) }]);

const sysArchData = computed(() => {
  const map = new Map<string, number>();
  for (const o of wazuhStore.itHygieneOSList) map.set(o.architecture || "Unknown", (map.get(o.architecture || "Unknown") ?? 0) + 1);
  return topN(map);
});
const sysArchOptions = computed(() => vBarOptions(sysArchData.value.map(([k]) => k)));
const sysArchSeries = computed(() => [{ name: "Count", data: sysArchData.value.map(([, v]) => v) }]);

const systemColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "os_platform", label: "Platform", field: "os_platform", align: "left" as const, sortable: true },
  { name: "os_name", label: "OS Name", field: "os_name", align: "left" as const, sortable: true },
  { name: "os_version", label: "OS Version", field: "os_version", align: "left" as const, sortable: true },
  { name: "release", label: "Kernel Release", field: "release", align: "left" as const, sortable: true },
  { name: "architecture", label: "Architecture", field: "architecture", align: "left" as const, sortable: true },
];
const filteredSystemRows = computed(() => {
  const q = systemSearch.value?.toLowerCase() ?? "";
  if (!q) return wazuhStore.itHygieneOSList;
  return wazuhStore.itHygieneOSList.filter((r) =>
    r.agent_name?.toLowerCase().includes(q) || r.os_name?.toLowerCase().includes(q) || r.os_platform?.toLowerCase().includes(q));
});

// ==================================
// SOFTWARE TAB
// ==================================
const softVendorData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePackages) map.set(p.vendor || "Unknown", (map.get(p.vendor || "Unknown") ?? 0) + 1);
  return topN(map);
});
const softVendorOptions = computed(() => hBarOptions(softVendorData.value.map(([k]) => k)));
const softVendorSeries = computed(() => [{ name: "Packages", data: softVendorData.value.map(([, v]) => v) }]);

const softFormatData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePackages) map.set(p.format || "Unknown", (map.get(p.format || "Unknown") ?? 0) + 1);
  return topN(map);
});
const softFormatOptions = computed(() => vBarOptions(softFormatData.value.map(([k]) => k)));
const softFormatSeries = computed(() => [{ name: "Packages", data: softFormatData.value.map(([, v]) => v) }]);

const softwareColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "name", label: "Package", field: "name", align: "left" as const, sortable: true },
  { name: "version", label: "Version", field: "version", align: "left" as const, sortable: true },
  { name: "vendor", label: "Vendor", field: "vendor", align: "left" as const, sortable: true },
  { name: "architecture", label: "Arch", field: "architecture", align: "left" as const, sortable: true },
  { name: "format", label: "Format", field: "format", align: "left" as const, sortable: true },
];
const filteredSoftwareRows = computed(() => {
  const q = softwareSearch.value?.toLowerCase() ?? "";
  const rows = wazuhStore.itHygienePackages.map((p, i) => ({ ...p, _uid: `pkg-${i}` }));
  if (!q) return rows;
  return rows.filter((r) => r.agent_name?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q) || r.vendor?.toLowerCase().includes(q));
});

// ==================================
// PROCESSES TAB
// ==================================
const procTopData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) map.set(p.name || "Unknown", (map.get(p.name || "Unknown") ?? 0) + 1);
  return topN(map);
});
const procTopOptions = computed(() => hBarOptions(procTopData.value.map(([k]) => k)));
const procTopSeries = computed(() => [{ name: "Count", data: procTopData.value.map(([, v]) => v) }]);

const procStateData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) map.set(p.state || "Unknown", (map.get(p.state || "Unknown") ?? 0) + 1);
  return topN(map, 10);
});
const procStateOptions = computed(() => vBarOptions(procStateData.value.map(([k]) => k)));
const procStateSeries = computed(() => [{ name: "Count", data: procStateData.value.map(([, v]) => v) }]);

const processColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "name", label: "Process", field: "name", align: "left" as const, sortable: true },
  { name: "pid", label: "PID", field: "pid", align: "left" as const, sortable: true },
  { name: "state", label: "State", field: "state", align: "left" as const, sortable: true },
  { name: "euser", label: "User", field: "euser", align: "left" as const, sortable: true },
  { name: "cmd", label: "Command", field: "cmd", align: "left" as const, sortable: true },
];
const filteredProcessRows = computed(() => {
  const q = processSearch.value?.toLowerCase() ?? "";
  const rows = wazuhStore.itHygieneProcesses.map((p, i) => ({ ...p, _uid: `proc-${i}` }));
  if (!q) return rows;
  return rows.filter((r) => r.agent_name?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q) || r.cmd?.toLowerCase().includes(q));
});

// ==================================
// NETWORK TAB
// ==================================
const netTypeData = computed(() => {
  const map = new Map<string, number>();
  for (const n of wazuhStore.itHygieneNetaddr) map.set(n.proto || "Unknown", (map.get(n.proto || "Unknown") ?? 0) + 1);
  return topN(map);
});
const netTypeOptions = computed(() => vBarOptions(netTypeData.value.map(([k]) => k)));
const netTypeSeries = computed(() => [{ name: "Count", data: netTypeData.value.map(([, v]) => v) }]);

const netIfaceData = computed(() => {
  const map = new Map<string, number>();
  for (const n of wazuhStore.itHygieneNetiface) map.set(n.name || "Unknown", (map.get(n.name || "Unknown") ?? 0) + 1);
  return topN(map);
});
const netIfaceOptions = computed(() => hBarOptions(netIfaceData.value.map(([k]) => k)));
const netIfaceSeries = computed(() => [{ name: "Count", data: netIfaceData.value.map(([, v]) => v) }]);

const networkColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "name", label: "Interface", field: "name", align: "left" as const, sortable: true },
  { name: "type", label: "Type", field: "type", align: "left" as const, sortable: true },
  { name: "state", label: "State", field: "state", align: "left" as const, sortable: true },
  { name: "mac", label: "MAC", field: "mac", align: "left" as const, sortable: true },
  { name: "mtu", label: "MTU", field: "mtu", align: "left" as const, sortable: true },
];
const filteredNetworkRows = computed(() => {
  const q = networkSearch.value?.toLowerCase() ?? "";
  const rows = wazuhStore.itHygieneNetiface.map((n, i) => ({ ...n, _uid: `net-${i}` }));
  if (!q) return rows;
  return rows.filter((r) => r.agent_name?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q) || r.mac?.toLowerCase().includes(q));
});

// ==================================
// IDENTITY TAB
// ==================================
const idUsersData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) map.set(p.euser || "Unknown", (map.get(p.euser || "Unknown") ?? 0) + 1);
  return topN(map);
});
const idUsersOptions = computed(() => hBarOptions(idUsersData.value.map(([k]) => k)));
const idUsersSeries = computed(() => [{ name: "Processes", data: idUsersData.value.map(([, v]) => v) }]);

const idGroupsData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) map.set(p.egroup || "Unknown", (map.get(p.egroup || "Unknown") ?? 0) + 1);
  return topN(map);
});
const idGroupsOptions = computed(() => hBarOptions(idGroupsData.value.map(([k]) => k)));
const idGroupsSeries = computed(() => [{ name: "Processes", data: idGroupsData.value.map(([, v]) => v) }]);

const idStatesData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygieneProcesses) map.set(p.state || "Unknown", (map.get(p.state || "Unknown") ?? 0) + 1);
  return topN(map);
});
const idStatesOptions = computed(() => vBarOptions(idStatesData.value.map(([k]) => k)));
const idStatesSeries = computed(() => [{ name: "Count", data: idStatesData.value.map(([, v]) => v) }]);

const identityColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "name", label: "Process", field: "name", align: "left" as const, sortable: true },
  { name: "euser", label: "User", field: "euser", align: "left" as const, sortable: true },
  { name: "egroup", label: "Group", field: "egroup", align: "left" as const, sortable: true },
  { name: "ruser", label: "Real User", field: "ruser", align: "left" as const, sortable: true },
  { name: "rgroup", label: "Real Group", field: "rgroup", align: "left" as const, sortable: true },
];
const filteredIdentityRows = computed(() => {
  const q = identitySearch.value?.toLowerCase() ?? "";
  const rows = wazuhStore.itHygieneProcesses.map((p, i) => ({ ...p, _uid: `id-${i}` }));
  if (!q) return rows;
  return rows.filter((r) => r.agent_name?.toLowerCase().includes(q) || r.euser?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q));
});

// ==================================
// SERVICES TAB
// ==================================
const svcTopData = computed(() => {
  const map = new Map<string, number>();
  for (const p of wazuhStore.itHygienePorts) map.set(`${p.local?.port ?? "?"}/${p.protocol ?? "tcp"}`, (map.get(`${p.local?.port ?? "?"}/${p.protocol ?? "tcp"}`) ?? 0) + 1);
  return topN(map);
});
const svcTopOptions = computed(() => hBarOptions(svcTopData.value.map(([k]) => k)));
const svcTopSeries = computed(() => [{ name: "Count", data: svcTopData.value.map(([, v]) => v) }]);

const uniquePortsCount = computed(() => {
  const set = new Set(wazuhStore.itHygienePorts.map((p) => `${p.local?.port}/${p.protocol}`));
  return set.size;
});

const servicesColumns = [
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const, sortable: true },
  { name: "local_ip", label: "Local IP", field: (row: Record<string, unknown>) => (row.local as Record<string, unknown>)?.ip ?? "", align: "left" as const },
  { name: "local_port", label: "Local Port", field: (row: Record<string, unknown>) => (row.local as Record<string, unknown>)?.port ?? "", align: "left" as const },
  { name: "protocol", label: "Protocol", field: "protocol", align: "left" as const, sortable: true },
  { name: "state", label: "State", field: "state", align: "left" as const, sortable: true },
  { name: "process", label: "Process", field: "process", align: "left" as const, sortable: true },
];
const filteredServicesRows = computed(() => {
  const q = servicesSearch.value?.toLowerCase() ?? "";
  const rows = wazuhStore.itHygienePorts.map((p, i) => ({ ...p, _uid: `svc-${i}` }));
  if (!q) return rows;
  return rows.filter((r) => r.agent_name?.toLowerCase().includes(q) || r.process?.toLowerCase().includes(q) || String(r.local?.port).includes(q));
});

// ==================================
// DATA LOADING
// ==================================
async function loadAllDashboardData() {
  if (!wazuhStore.wazuhAgents.length) await wazuhStore.fetchAgents();
  // Load all in parallel for dashboard tab
  await Promise.allSettled([
    wazuhStore.fetchITHygieneSystem(),
    wazuhStore.fetchITHygieneSoftware(),
    wazuhStore.fetchITHygieneProcesses(),
    wazuhStore.fetchITHygieneNetwork(),
  ]);
}

async function loadTabData() {
  if (!wazuhStore.wazuhAgents.length) await wazuhStore.fetchAgents();
  switch (activeTab.value) {
    case "dashboard":
      await loadAllDashboardData();
      break;
    case "system":
      if (!wazuhStore.itHygieneOSList.length) await wazuhStore.fetchITHygieneSystem();
      break;
    case "software":
      if (!wazuhStore.itHygienePackages.length) await wazuhStore.fetchITHygieneSoftware();
      break;
    case "processes":
    case "identity":
      if (!wazuhStore.itHygieneProcesses.length) await wazuhStore.fetchITHygieneProcesses();
      break;
    case "network":
    case "services":
      if (!wazuhStore.itHygieneNetiface.length) await wazuhStore.fetchITHygieneNetwork();
      break;
  }
}

async function refreshAll() {
  // Force reload all
  await loadAllDashboardData();
}

watch(activeTab, () => loadTabData());
onMounted(() => loadTabData());

defineExpose({ refreshAll });
</script>

<style scoped>
.it-hygiene {
  padding: 0;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* ===== Header ===== */
.ih-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e8ecf0);
}

.ih-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.ih-badge {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 4px;
}

.ih-tabs {
  display: flex;
  gap: 0;
}

.ih-tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--mdm-text-secondary, #666);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ih-tab:hover {
  color: var(--mdm-text-primary, #1a1a1a);
}

.ih-tab--active {
  color: var(--mdm-primary, #006bb4);
  border-bottom-color: var(--mdm-primary, #006bb4);
  font-weight: 600;
}

/* ===== Filter Bar ===== */
.ih-filter-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e8ecf0);
  flex-wrap: wrap;
  gap: 4px;
}

.ih-search-input {
  flex: 1;
  min-width: 120px;
  max-width: 300px;
}

/* ===== Loading ===== */
.ih-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--mdm-text-secondary, #666);
  font-size: 14px;
}

/* ===== Content ===== */
.ih-content {
  padding: 16px;
}

/* ===== Widget Rows ===== */
.ih-row {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}

.ih-row--2col { grid-template-columns: 1fr 1fr; }
.ih-row--3col { grid-template-columns: 1fr 1fr 1fr; }
.ih-row--4col { grid-template-columns: 1fr 1fr 1fr 1fr; }

/* ===== Widget ===== */
.ih-widget {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 8px;
  padding: 16px;
}

.ih-widget--stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ih-widget-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 12px;
}

.ih-widget-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: #b0b8c4;
  font-size: 13px;
}

.ih-big-number {
  font-size: 42px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* ===== Widget Tables ===== */
.ih-widget-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 6px 10px;
  background: transparent;
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.ih-widget-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 6px 10px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.ih-widget-table :deep(tbody tr) {
  cursor: pointer;
}

.ih-widget-table :deep(tbody tr:hover) {
  background: rgba(0, 107, 180, 0.04);
}

/* ===== Data Tables ===== */
.ih-table-wrap {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

.ih-table-toolbar {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.ih-table-hits {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
}

.ih-table-search {
  width: 260px;
}

.ih-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.ih-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 8px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Footer ===== */
.ih-footer {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: var(--mdm-text-secondary, #999);
  font-style: italic;
}

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .ih-row--4col { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 960px) {
  .ih-row--3col { grid-template-columns: 1fr; }
  .ih-row--4col { grid-template-columns: 1fr; }
  .ih-row--2col { grid-template-columns: 1fr; }
}
</style>

<style>
/* ===== Dark mode ===== */
.body--dark .ih-header {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ih-filter-bar {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ih-tab--active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}

.body--dark .ih-widget {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ih-table-wrap {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .ih-table :deep(.q-table th) {
  background: var(--mdm-bg-sidebar, #0f1729);
}
</style>
