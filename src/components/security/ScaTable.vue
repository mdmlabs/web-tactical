<template>
  <q-card flat bordered class="sca-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">SCA: Latest scans</div>
        <q-btn flat round dense icon="open_in_new" size="sm" color="primary" />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-table
        :rows="rows"
        :columns="columns"
        flat
        dense
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No SCA policies found"
      >
        <template #body-cell-score="props">
          <q-td :props="props">
            <div class="row items-center no-wrap" style="gap: 8px">
              <q-linear-progress
                :value="props.row.score / 100"
                :color="props.row.score >= 80 ? 'green' : props.row.score >= 50 ? 'orange' : 'red'"
                rounded
                style="width: 100px"
              />
              <span class="text-body2">{{ props.row.score }}%</span>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { WazuhSCAPolicy } from "@/types/wazuh";

defineProps<{
  rows: WazuhSCAPolicy[];
  loading: boolean;
}>();

const columns = [
  { name: "name", label: "Policy", field: "name", align: "left" as const },
  { name: "score", label: "Score", field: "score", align: "left" as const, sortable: true },
  { name: "pass", label: "Pass", field: "pass", align: "center" as const },
  { name: "fail", label: "Fail", field: "fail", align: "center" as const },
  { name: "invalid", label: "Invalid", field: "invalid", align: "center" as const },
  { name: "total_checks", label: "Total", field: "total_checks", align: "center" as const },
  { name: "end_scan", label: "Last Scan", field: "end_scan", align: "left" as const },
];
</script>

<style scoped>
.sca-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  box-shadow: var(--mdm-shadow);
}
</style>
