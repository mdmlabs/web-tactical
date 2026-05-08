<template>
  <div>
    <div class="row q-gutter-sm q-mb-md items-center">
      <q-input v-model="search" :label="$t('compliance.components.ComplianceDevicesPanel.668675')" dense outlined clearable style="min-width: 220px" />
      <q-select v-model="status" :options="statusOptions" :label="$t('compliance.components.ComplianceDevicesPanel.bae7d5')" dense outlined clearable emit-value map-options style="min-width: 140px" />
      <q-select v-model="accessState" :options="accessOptions" :label="$t('compliance.components.ComplianceDevicesPanel.2f81a2')" dense outlined clearable emit-value map-options style="min-width: 140px" />
      <q-select v-model="enrollmentFilter" :options="enrollmentOptions" :label="$t('compliance.components.ComplianceDevicesPanel.cbffa3')" dense outlined clearable emit-value map-options style="min-width: 140px" />
    </div>

    <q-table
      :rows="filteredRows"
      :columns="columns"
      dense
      row-key="agent_id"
      :loading="loading"
      :rows-per-page-options="[20, 50, 100]"
    >
      <template v-slot:body-cell-enrollment_type="props">
        <q-td :props="props">
          <q-chip dense :color="enrollmentColor(props.value)" text-color="white" size="sm">{{ props.value || "unknown" }}</q-chip>
        </q-td>
      </template>
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
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="visibility" size="sm" color="primary" @click="$emit('select-device', props.row.agent_id)" />
          <q-btn flat dense round icon="edit" size="sm" color="grey-7" @click="changeEnrollment(props.row)" :title="$t('compliance.components.ComplianceDevicesPanel.924ef2')" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="enrollmentDialogOpen" persistent>
      <q-card style="min-width: 380px">
        <q-bar><span>Set Enrollment Type — {{ enrollmentTarget?.agent_hostname }}</span><q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section>
          <q-select
            v-model="enrollmentType"
            :options="[{label:'Corporate Owned',value:'corporate'},{label:'BYOD (Personal)',value:'byod'},{label:'COPE',value:'cope'},{label:'Unknown',value:'unknown'}]"
            :label="$t('compliance.components.ComplianceDevicesPanel.7796ea')" outlined dense emit-value map-options
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('compliance.components.ComplianceDevicesPanel.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('compliance.components.ComplianceDevicesPanel.efc007')" @click="saveEnrollment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const props = defineProps<{
  rows: any[];
  loading: boolean;
}>();

defineEmits<{
  (e: "select-device", agentId: string): void;
}>();

const $q = useQuasar();
const enrollmentDialogOpen = ref(false);
const enrollmentTarget = ref<any | null>(null);
const enrollmentType = ref("unknown");

function changeEnrollment(row: any) {
  enrollmentTarget.value = row;
  enrollmentType.value = row.enrollment_type || "unknown";
  enrollmentDialogOpen.value = true;
}

async function saveEnrollment() {
  try {
    await axios.patch(`/compliance/enrollment/${enrollmentTarget.value.agent_id}/`, { enrollment_type: enrollmentType.value });
    enrollmentTarget.value.enrollment_type = enrollmentType.value;
    enrollmentDialogOpen.value = false;
    $q.notify({ message: "Enrollment type updated", color: "positive", icon: "check" });
  } catch {
    $q.notify({ message: "Failed to update enrollment type", color: "negative" });
  }
}

function enrollmentColor(t: string) {
  return { corporate: "indigo", byod: "teal", cope: "purple", unknown: "grey-6" }[t] ?? "grey-6";
}

const search = ref("");
const status = ref<string | null>(null);
const accessState = ref<string | null>(null);
const enrollmentFilter = ref<string | null>(null);

const enrollmentOptions = [
  { label: "Corporate", value: "corporate" },
  { label: "BYOD", value: "byod" },
  { label: "COPE", value: "cope" },
  { label: "Unknown", value: "unknown" },
];

const statusOptions = [
  { label: "Compliant", value: "compliant" },
  { label: "Non-Compliant", value: "non_compliant" },
  { label: "Pending", value: "pending" },
  { label: "Unknown", value: "unknown" },
  { label: "Stale", value: "stale" },
];
const accessOptions = [
  { label: "Allowed", value: "allowed" },
  { label: "Grace Period", value: "grace_period" },
  { label: "Blocked", value: "blocked" },
  { label: "Review", value: "review" },
  { label: "Quarantined", value: "quarantined" },
];

const columns = [
  { name: "agent_hostname", label: "Hostname", field: "agent_hostname", align: "left", sortable: true },
  { name: "site_name", label: "Site", field: "site_name", align: "left", sortable: true },
  { name: "level_name", label: "Level", field: "level_name", align: "left", sortable: true },
  { name: "enrollment_type", label: "Enrollment", field: "enrollment_type", align: "left", sortable: true },
  { name: "effective_status", label: "Status", field: "effective_status", align: "left", sortable: true },
  { name: "access_state", label: "Access", field: "access_state", align: "left", sortable: true },
  { name: "risk_score", label: "Risk", field: "risk_score", align: "center", sortable: true },
  { name: "failing_requirements_count", label: "Failing Req", field: "failing_requirements_count", align: "center", sortable: true },
  { name: "remediation_state", label: "Remediation", field: "remediation_state", align: "left", sortable: true },
  { name: "last_check_at", label: "Last Check", field: "last_check_at", align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const filteredRows = computed(() =>
  props.rows.filter((row) => {
    const matchesSearch = !search.value
      || row.agent_hostname?.toLowerCase().includes(search.value.toLowerCase())
      || row.agent_id?.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = !status.value || row.effective_status === status.value;
    const matchesAccess = !accessState.value || row.access_state === accessState.value;
    const matchesEnrollment = !enrollmentFilter.value || row.enrollment_type === enrollmentFilter.value;
    return matchesSearch && matchesStatus && matchesAccess && matchesEnrollment;
  })
);

function statusColor(statusValue: string) {
  return { compliant: "positive", non_compliant: "negative", pending: "warning", unknown: "grey", stale: "orange" }[statusValue] ?? "grey";
}

function accessColor(accessValue: string) {
  return { allowed: "positive", grace_period: "warning", blocked: "negative", review: "orange", quarantined: "negative" }[accessValue] ?? "grey";
}
</script>
