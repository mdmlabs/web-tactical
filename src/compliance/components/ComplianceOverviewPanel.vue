<template>
  <div>
    <div class="row q-gutter-md">
      <q-card class="col-12 col-sm-5 col-md-2" v-for="(count, status) in summary" :key="status">
        <q-card-section class="text-center">
          <q-icon :name="statusIcon(status)" :color="statusColor(status)" size="2rem" />
          <div class="text-h4 q-mt-sm">{{ count }}</div>
          <div class="text-caption text-grey">{{ statusLabel(status) }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-sm-5 col-md-2">
        <q-card-section class="text-center">
          <q-icon name="devices" color="primary" size="2rem" />
          <div class="text-h4 q-mt-sm">{{ deviceSummary?.total_devices ?? 0 }}</div>
          <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceOverviewPanel.6346c5') }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-sm-5 col-md-2">
        <q-card-section class="text-center">
          <q-icon name="block" color="negative" size="2rem" />
          <div class="text-h4 q-mt-sm">{{ deviceSummary?.access_counts?.blocked ?? 0 }}</div>
          <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceOverviewPanel.a72525') }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-lg">
      <div class="text-subtitle1 q-mb-sm">{{ $t('compliance.components.ComplianceOverviewPanel.96ff2f') }}</div>
      <q-table
        :rows="nonCompliantChecks"
        :columns="columns"
        dense
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  summary: Record<string, number>;
  nonCompliantChecks: any[];
  deviceSummary?: {
    total_devices?: number;
    access_counts?: Record<string, number>;
  } | null;
}>();

const columns = [
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left", sortable: true },
  { name: "agent_hostname", label: "Hostname", field: "agent_hostname", align: "left", sortable: true },
  { name: "check_type", label: "Check Type", field: "check_type", align: "left", sortable: true },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "checked_at", label: "Checked At", field: "checked_at", align: "left", sortable: true },
];

function statusIcon(s: string) {
  return { compliant: "check_circle", non_compliant: "cancel", pending: "hourglass_empty", unknown: "help" }[s] ?? "circle";
}
function statusColor(s: string) {
  return { compliant: "positive", non_compliant: "negative", pending: "warning", unknown: "grey" }[s] ?? "grey";
}
function statusLabel(s: string) {
  return { compliant: "Compliant", non_compliant: "Non-Compliant", pending: "Pending", unknown: "Unknown" }[s] ?? s;
}
</script>
