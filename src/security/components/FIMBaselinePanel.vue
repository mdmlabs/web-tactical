<template>
  <div class="fim-baseline-panel q-pa-md">
    <div class="text-subtitle1 q-mb-md">{{ $t('security.components.FIMBaselinePanel.f51289') }}</div>
    <div class="text-caption text-grey q-mb-lg">
      A baseline captures the current hash state of all monitored files.
      Future changes are compared against this baseline to detect violations.
    </div>

    <div class="row q-gutter-md q-mb-lg">
      <!-- Baseline stats -->
      <q-card flat bordered class="col-12 col-sm-3">
        <q-card-section class="text-center">
          <q-icon name="insert_drive_file" size="2rem" color="primary" />
          <div class="text-h5 q-mt-sm">{{ baselineStats.file_count || 0 }}</div>
          <div class="text-caption text-grey">{{ $t('security.components.FIMBaselinePanel.bae12c') }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-sm-3">
        <q-card-section class="text-center">
          <q-icon name="warning" size="2rem" color="negative" />
          <div class="text-h5 q-mt-sm">{{ openViolations }}</div>
          <div class="text-caption text-grey">{{ $t('security.components.FIMBaselinePanel.8cb1e5') }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-sm-3">
        <q-card-section class="text-center">
          <q-icon name="schedule" size="2rem" color="grey" />
          <div class="text-caption q-mt-sm">{{ baselineStats.captured_at ? formatDate(baselineStats.captured_at) : 'Never' }}</div>
          <div class="text-caption text-grey">{{ $t('security.components.FIMBaselinePanel.f5e3bd') }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Actions -->
    <div class="row q-gutter-sm q-mb-lg">
      <q-input
        v-model="targetAgentId"
        :label="$t('security.components.FIMBaselinePanel.f6d44b')"
        outlined dense
        style="min-width: 260px"
      />
      <q-btn
        color="primary"
        icon="camera"
        :label="$t('security.components.FIMBaselinePanel.51ad67')"
        @click="captureBaseline"
        :loading="capturing"
      />
      <q-btn
        flat dense
        color="secondary"
        icon="refresh"
        :label="$t('security.components.FIMBaselinePanel.951446')"
        @click="loadStats"
      />
    </div>

    <!-- FIM Events table -->
    <div class="text-subtitle2 q-mb-sm">{{ $t('security.components.FIMBaselinePanel.099091') }}</div>
    <q-table
      :rows="fimEvents"
      :columns="columns"
      dense
      row-key="id"
      :loading="loadingEvents"
      :rows-per-page-options="[20, 50]"
    >
      <template v-slot:body-cell-event_type="props">
        <q-td :props="props">
          <q-chip dense :color="eventTypeColor(props.value)" text-color="white" size="sm">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-severity="props">
        <q-td :props="props">
          <q-chip dense :color="severityColor(props.value)" text-color="white" size="sm">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-remediated="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'negative'" text-color="white" size="sm">
            {{ props.value ? 'Resolved' : 'Open' }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn v-if="!props.row.remediated" flat dense round icon="check" size="sm"
            color="positive" @click="markRemediated(props.row.id)" :title="$t('security.components.FIMBaselinePanel.3fe93a')" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar, date } from "quasar";
import axios from "axios";

const $q = useQuasar();
const targetAgentId = ref("");
const capturing = ref(false);
const loadingEvents = ref(false);
const fimEvents = ref<any[]>([]);
const baselineStats = ref<any>({ file_count: 0, captured_at: null, violation_count: 0 });

const openViolations = computed(() => fimEvents.value.filter((e) => !e.remediated).length);

const columns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" as const, sortable: true },
  { name: "event_type", label: "Event", field: "event_type", align: "center" as const },
  { name: "file_path", label: "File Path", field: "file_path", align: "left" as const, classes: "ellipsis", style: "max-width:300px" },
  { name: "severity", label: "Severity", field: "severity", align: "center" as const },
  { name: "remediated", label: "Status", field: "remediated", align: "center" as const },
  { name: "occurred_at", label: "Occurred", field: "occurred_at", align: "left" as const, sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

function formatDate(d: string) {
  return date.formatDate(d, "DD MMM YYYY HH:mm");
}
function eventTypeColor(t: string) {
  return { created: "positive", modified: "warning", deleted: "negative", renamed: "info" }[t] ?? "grey";
}
function severityColor(s: string) {
  return { low: "info", medium: "warning", high: "orange", critical: "negative" }[s] ?? "grey";
}

async function loadStats() {
  try {
    baselineStats.value = { file_count: fimEvents.value.length, captured_at: new Date().toISOString() };
  } catch {}
}

async function loadEvents() {
  loadingEvents.value = true;
  try {
    const params: any = {};
    if (targetAgentId.value) params.agent_id = targetAgentId.value;
    fimEvents.value = (await axios.get("/security/fim/events/", { params })).data;
  } finally {
    loadingEvents.value = false;
  }
}

async function captureBaseline() {
  if (!targetAgentId.value) {
    $q.notify({ message: "Please enter an Agent ID to capture baseline", color: "warning" });
    return;
  }
  capturing.value = true;
  try {
    // Get FIM policies to find the policy ID
    const pols = (await axios.get("/security/fim/policies/")).data;
    if (pols.length === 0) {
      $q.notify({ message: "No FIM policies configured", color: "warning" });
      return;
    }
    // Deploy FIM policy to agent — agent will scan and build baseline
    await axios.post(`/security/fim/policies/${pols[0].id}/deploy/`, {
      agent_ids: [targetAgentId.value],
    });
    $q.notify({
      message: "Baseline capture initiated. Agent will scan all monitored paths.",
      color: "positive",
      icon: "camera",
    });
    await loadStats();
  } catch {
    $q.notify({ message: "Failed to initiate baseline capture", color: "negative" });
  } finally {
    capturing.value = false;
  }
}

async function markRemediated(id: number) {
  try {
    await axios.patch(`/security/fim/events/${id}/`, { remediated: true });
    $q.notify({ message: "Marked as resolved", color: "positive", icon: "check" });
    await loadEvents();
  } catch {}
}

onMounted(() => { loadEvents(); loadStats(); });
</script>
