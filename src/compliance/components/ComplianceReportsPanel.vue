<template>
  <div>
    <!-- KPI bar -->
    <div class="row q-gutter-md q-mb-md">
      <q-card class="col-12 col-sm-3">
        <q-card-section class="text-center">
          <div class="text-h5">{{ summary?.device_summary?.total_devices ?? 0 }}</div>
          <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceReportsPanel.f8920b') }}</div>
        </q-card-section>
      </q-card>
      <q-card
        v-for="(count, status) in summary?.device_summary?.status_counts || {}"
        :key="status"
        class="col-12 col-sm-3"
      >
        <q-card-section class="text-center">
          <q-icon :name="statusIcon(status)" :color="statusColor(status)" size="1.4rem" class="q-mb-xs" />
          <div class="text-h5">{{ count }}</div>
          <div class="text-caption text-grey">{{ statusLabel(status) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Trend chart + top failing -->
    <div class="row q-gutter-md q-mb-md">
      <q-card class="col-12 col-md-7" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.components.ComplianceReportsPanel.fdb68b') }}</div>
          <div v-if="trendRows.length === 0" class="text-caption text-grey text-center q-pa-md">
            {{ $t('compliance.components.ComplianceReportsPanel.b820c1') }}
          </div>
          <div v-else class="trend-chart">
            <div
              v-for="row in trendRows"
              :key="row.date + row.status"
              class="trend-bar-wrap"
              :title="`${row.date} | ${row.status}: ${row.count}`"
            >
              <div
                class="trend-bar"
                :style="`height: ${barHeight(row.count)}px; background: ${trendColor(row.status)}`"
              />
              <div class="trend-label text-caption">{{ row.date.slice(5) }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.components.ComplianceReportsPanel.414fc7') }}</div>
          <q-list dense separator>
            <q-item v-for="item in summary?.top_failing_requirements || []" :key="item.requirement">
              <q-item-section>{{ item.requirement }}</q-item-section>
              <q-item-section side>
                <q-badge color="negative">{{ item.count }}</q-badge>
              </q-item-section>
            </q-item>
            <q-item v-if="!(summary?.top_failing_requirements?.length)">
              <q-item-section class="text-grey text-caption">{{ $t('compliance.components.ComplianceReportsPanel.5736c2') }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Device snapshot table -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.components.ComplianceReportsPanel.791c26') }}</div>
        <q-table
          :rows="summary?.device_rows || []"
          :columns="deviceColumns"
          dense
          row-key="agent_id"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template v-slot:body-cell-effective_status="props">
            <q-td :props="props">
              <q-chip dense :color="statusColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-access_state="props">
            <q-td :props="props">
              <q-chip dense :color="accessColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ summary: any }>();

const deviceColumns = [
  { name: "agent_hostname", label: "Hostname", field: "agent_hostname", align: "left", sortable: true },
  { name: "effective_status", label: "Status", field: "effective_status", align: "left", sortable: true },
  { name: "access_state", label: "Access", field: "access_state", align: "left", sortable: true },
  { name: "risk_score", label: "Risk", field: "risk_score", align: "center", sortable: true },
  { name: "site__name", label: "Site", field: "site__name", align: "left", sortable: true },
  { name: "level__name", label: "Level", field: "level__name", align: "left", sortable: true },
];

const trendRows = computed(() => {
  const raw: any[] = props.summary?.trend || [];
  const last30 = raw.slice(-90);
  return last30;
});

const maxCount = computed(() => Math.max(1, ...trendRows.value.map((r) => r.count)));

function barHeight(count: number) {
  return Math.max(4, Math.round((count / maxCount.value) * 80));
}

function trendColor(status: string) {
  return { compliant: "#21ba45", non_compliant: "#db2828", pending: "#f2711c", unknown: "#9e9e9e", stale: "#ff9800" }[status] ?? "#9e9e9e";
}

function statusIcon(s: string) {
  return { compliant: "check_circle", non_compliant: "cancel", pending: "hourglass_empty", unknown: "help", stale: "access_time" }[s] ?? "circle";
}
function statusColor(s: string) {
  return { compliant: "positive", non_compliant: "negative", pending: "warning", unknown: "grey", stale: "orange" }[s] ?? "grey";
}
function statusLabel(s: string) {
  return { compliant: "Compliant", non_compliant: "Non-Compliant", pending: "Pending", unknown: "Unknown", stale: "Stale" }[s] ?? s;
}
function accessColor(s: string) {
  return { allowed: "positive", grace_period: "warning", blocked: "negative", quarantined: "negative", review: "orange" }[s] ?? "grey";
}
</script>

<style scoped>
.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 100px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.trend-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 18px;
}
.trend-bar {
  width: 14px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
}
.trend-label {
  font-size: 9px;
  color: #666;
  transform: rotate(-45deg);
  white-space: nowrap;
  margin-top: 2px;
}
</style>
