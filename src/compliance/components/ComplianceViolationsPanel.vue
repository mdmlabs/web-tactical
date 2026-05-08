<template>
  <div>
    <div class="row items-center q-mb-sm q-gutter-sm">
      <q-select
        v-model="statusFilter"
        :options="[{label:'Open',value:'open'},{label:'Acknowledged',value:'acknowledged'},{label:'Resolved',value:'resolved'}]"
        :label="$t('compliance.components.ComplianceViolationsPanel.bae7d5')" dense outlined clearable emit-value map-options style="min-width:140px"
      />
      <q-select
        v-model="severityFilter"
        :options="[{label:'Critical',value:'critical'},{label:'High',value:'high'},{label:'Medium',value:'medium'},{label:'Low',value:'low'}]"
        :label="$t('compliance.components.ComplianceViolationsPanel.de314f')" dense outlined clearable emit-value map-options style="min-width:140px"
      />
      <q-input v-model="searchFilter" :label="$t('compliance.components.ComplianceViolationsPanel.13bd9f')" dense outlined clearable style="min-width:200px" />
    </div>

    <q-table
      :rows="filteredRows"
      :columns="columns"
      dense
      row-key="id"
      :loading="loading"
      :rows-per-page-options="[20, 50, 100]"
    >
      <template v-slot:body-cell-severity="props">
        <q-td :props="props">
          <q-chip dense :color="severityColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip dense :color="statusColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-evidence="props">
        <q-td :props="props">
          <q-btn flat dense size="xs" icon="info" @click="showEvidence(props.row)" color="grey-7" />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="visibility" size="sm" color="primary" @click="$emit('select-device', props.row.agent_id)" :title="$t('compliance.components.ComplianceViolationsPanel.339011')" />
          <q-btn
            v-if="props.row.status === 'open'"
            flat dense round icon="check" size="sm" color="positive"
            @click="acknowledge(props.row)"
            :title="$t('compliance.components.ComplianceViolationsPanel.16e998')"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Evidence dialog -->
    <q-dialog v-model="evidenceOpen">
      <q-card style="min-width: 480px">
        <q-bar><span>{{ $t('compliance.components.ComplianceViolationsPanel.37a2b8') }}</span><q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section v-if="selectedViolation">
          <div class="text-subtitle2 q-mb-sm">{{ selectedViolation.requirement_name }} — {{ selectedViolation.agent_hostname }}</div>
          <q-separator class="q-mb-sm" />
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.ComplianceViolationsPanel.6ac87f') }}</div>
          <pre class="text-caption q-mb-sm" style="overflow:auto">{{ JSON.stringify(selectedViolation.expected_value, null, 2) }}</pre>
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.ComplianceViolationsPanel.2e159b') }}</div>
          <pre class="text-caption q-mb-sm" style="overflow:auto">{{ JSON.stringify(selectedViolation.observed_value, null, 2) }}</pre>
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.ComplianceViolationsPanel.7ea014') }}</div>
          <pre class="text-caption" style="overflow:auto">{{ JSON.stringify(selectedViolation.evidence, null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const props = defineProps<{
  rows: any[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "select-device", agentId: string): void;
  (e: "acknowledged"): void;
}>();

const $q = useQuasar();
const statusFilter = ref<string | null>("open");
const severityFilter = ref<string | null>(null);
const searchFilter = ref("");
const evidenceOpen = ref(false);
const selectedViolation = ref<any | null>(null);

const filteredRows = computed(() =>
  props.rows.filter((row) => {
    if (statusFilter.value && row.status !== statusFilter.value) return false;
    if (severityFilter.value && row.severity !== severityFilter.value) return false;
    if (searchFilter.value && !row.agent_hostname?.toLowerCase().includes(searchFilter.value.toLowerCase())) return false;
    return true;
  })
);

const columns = [
  { name: "agent_hostname", label: "Hostname", field: "agent_hostname", align: "left", sortable: true },
  { name: "level_name", label: "Level", field: "level_name", align: "left", sortable: true },
  { name: "requirement_name", label: "Requirement", field: "requirement_name", align: "left", sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "left", sortable: true },
  { name: "source_key", label: "Signal", field: "source_key", align: "left", sortable: true },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "evidence", label: "Evidence", field: "evidence", align: "center" },
  { name: "last_seen_at", label: "Last Seen", field: "last_seen_at", align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

function severityColor(severity: string) {
  return { low: "grey-7", medium: "primary", high: "warning", critical: "negative" }[severity] ?? "primary";
}
function statusColor(status: string) {
  return { open: "negative", acknowledged: "orange", resolved: "positive" }[status] ?? "grey";
}

function showEvidence(row: any) {
  selectedViolation.value = row;
  evidenceOpen.value = true;
}

async function acknowledge(row: any) {
  try {
    await axios.post(`/compliance/violations/${row.id}/acknowledge/`);
    row.status = "acknowledged";
    $q.notify({ message: "Violation acknowledged", color: "positive", icon: "check" });
    emit("acknowledged");
  } catch (err: any) {
    $q.notify({ message: "Failed to acknowledge", color: "negative" });
  }
}
</script>
