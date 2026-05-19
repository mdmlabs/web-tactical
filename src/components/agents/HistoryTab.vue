<template>
  <div v-if="!selectedAgent" class="q-pa-sm">No agent selected</div>
  <div v-else>
    <q-table
      :table-class="{
        'table-bgcolor': !$q.dark.isActive,
        'table-bgcolor-dark': $q.dark.isActive,
      }"
      :rows="history"
      :columns="columns"
      :pagination="{ sortBy: 'time', descending: true, rowsPerPage: 0 }"
      :style="{ 'max-height': tabHeight }"
      :loading="loading"
      :rows-per-page-options="[0]"
      :filter="filter"
      virtual-scroll
      dense
      binary-state-sort
      v-model:expanded="expandedRows"
    >
      <template v-slot:top>
        <q-btn dense flat push @click="getHistory" icon="refresh" />
        <q-space />
        <q-input
          v-model="filter"
          outlined
          label="Search"
          dense
          clearable
          class="q-pr-sm"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-btn-dropdown dense color="primary" icon-right="archive" no-caps label="Export">
          <q-list dense>
            <q-item clickable v-close-popup @click="exportHistoryReport('csv')">
              <q-item-section>Export CSV</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportHistoryReport('pdf')">
              <q-item-section>Export PDF</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:body-cell-output="props">
        <q-td :props="props">
          <span
            style="cursor: pointer; text-decoration: underline"
            class="text-primary"
            @click="
              props.row.type === 'cmd_run'
                ? showCommandOutput(props.row.command, props.row.results)
                : showScriptOutput(props.row.script_results)
            "
            >Output
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-time="props">
        <q-td :props="props">
          {{ formatDate(props.row.time) }}
        </q-td>
      </template>

      <template v-slot:body-cell-alerts="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            size="sm"
            :icon="isExpanded(props.row) ? 'expand_less' : 'expand_more'"
            :loading="alertsLoading[props.row.time]"
            @click="toggleAlerts(props.row)"
          >
            <q-tooltip>Show related alerts</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:expand="props">
        <q-tr v-if="isExpanded(props.row)" :props="props">
          <q-td colspan="6" class="q-pa-none">
            <div class="q-pa-sm" style="background: var(--q-primary-bg, #f5f5f5)">
              <div class="text-caption text-grey-7 q-mb-xs">
                Alerts around {{ formatDate(props.row.time) }} (&plusmn;30 min)
              </div>
              <div v-if="alertsLoading[props.row.time]" class="q-pa-sm text-caption text-grey">
                <q-spinner size="xs" class="q-mr-xs" /> Loading alerts...
              </div>
              <div v-else-if="!relatedAlerts[props.row.time]?.length" class="q-pa-sm text-caption text-grey">
                No alerts found in this time window
              </div>
              <q-table
                v-else
                :rows="relatedAlerts[props.row.time]"
                :columns="alertColumns"
                dense
                flat
                bordered
                :rows-per-page-options="[5]"
                row-key="id"
                class="related-alerts-table"
              >
                <template v-slot:body-cell-severity="ap">
                  <q-td :props="ap">
                    <q-badge :color="alertSeverityColor(ap.row.severity)" outline>
                      {{ alertSeverityLabel(ap.row.severity) }}
                    </q-badge>
                  </q-td>
                </template>
                <template v-slot:body-cell-status="ap">
                  <q-td :props="ap">
                    <div class="row items-center q-gutter-xs">
                      <q-badge :color="alertStatusColor(ap.row.status)">
                        {{ alertStatusLabel(ap.row.status) }}
                      </q-badge>
                      <span v-if="ap.row.takenBy" class="text-caption text-grey-7">
                        ({{ ap.row.takenBy }})
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-alertActions="ap">
                  <q-td :props="ap">
                    <q-btn
                      v-if="ap.row.status === alertStatusOpen"
                      flat
                      dense
                      size="sm"
                      color="primary"
                      icon="front_hand"
                      label="Take"
                      @click="takeAlert(ap.row, props.row.time)"
                    >
                      <q-tooltip>Take alert (assign to me)</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
// composition imports
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useQuasar, Notify } from "quasar";
import { formatTableColumnText, truncateText } from "@/utils/format";
import { fetchAgentHistory } from "@/api/agents";
import { alertsClient } from "@/gpo/api/grpc-client";
import { formatDate as formatDateUtil } from "@/utils/format";
import { exportHistory } from "@/utils/historyExport";
import { useAuthStore } from "@/stores/auth";

// ui imports
import ScriptOutput from "@/components/checks/ScriptOutput.vue";
import PreDialog from "@/components/ui/PreDialog.vue";

// static data
const columns = [
  {
    name: "time",
    label: "Time",
    field: "time",
    align: "left",
    sortable: true,
  },
  {
    name: "type",
    label: "Action",
    field: "type",
    align: "left",
    sortable: true,
    format: (val) => formatTableColumnText(val),
  },
  {
    name: "command",
    label: "Script/Command",
    field: (row) => (row.type === "script_run" ? row.script_name : row.command),
    align: "left",
    sortable: true,
    format: (val) => truncateText(val, 30),
  },
  {
    name: "username",
    label: "Initiated By",
    field: "username",
    align: "left",
    sortable: true,
  },
  {
    name: "output",
    label: "Output",
    field: "output",
    align: "left",
    sortable: true,
  },
  {
    name: "alerts",
    label: "Alerts",
    field: "alerts",
    align: "center",
  },
];

const alertColumns = [
  { name: "severity", label: "Severity", field: "severity", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "title", label: "Alert", field: "title", align: "left" },
  { name: "message", label: "Message", field: "message", align: "left", classes: "ellipsis", style: "max-width: 260px" },
  { name: "occurredAt", label: "Last Occurred", field: "lastOccurredAt", align: "left" },
  { name: "alertActions", label: "", field: "alertActions", align: "center" },
];

const alertStatusOpen = alertsClient.AlertStatus.ALERT_STATUS_OPEN;

function alertSeverityLabel(severity) {
  if (severity <= 1) return "Low";
  if (severity === 2) return "Medium";
  return "High";
}

function alertSeverityColor(severity) {
  if (severity <= 1) return "grey-7";
  if (severity === 2) return "orange-8";
  return "negative";
}

function alertStatusLabel(status) {
  switch (status) {
    case alertsClient.AlertStatus.ALERT_STATUS_OPEN:
      return "Open";
    case alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED:
      return "Taken";
    case alertsClient.AlertStatus.ALERT_STATUS_RESOLVED:
      return "Resolved";
    case alertsClient.AlertStatus.ALERT_STATUS_CLOSED:
      return "Closed";
    default:
      return "Unknown";
  }
}

function alertStatusColor(status) {
  switch (status) {
    case alertsClient.AlertStatus.ALERT_STATUS_OPEN:
      return "negative";
    case alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED:
      return "warning";
    case alertsClient.AlertStatus.ALERT_STATUS_RESOLVED:
      return "positive";
    case alertsClient.AlertStatus.ALERT_STATUS_CLOSED:
      return "grey";
    default:
      return "grey-7";
  }
}

export default {
  name: "HistoryTab",
  components: {},
  setup() {
    const $q = useQuasar();
    const authStore = useAuthStore();

    const store = useStore();
    const selectedAgent = computed(() => store.state.selectedRow);
    const tabHeight = computed(() => store.state.tabHeight);
    const formatDate = computed(() => store.getters.formatDate);

    // setup main history functionality
    const history = ref([]);
    const loading = ref(false);
    const filter = ref("");

    // Related alerts state
    const expandedRows = ref([]);
    const relatedAlerts = reactive({});
    const alertsLoading = reactive({});

    // Client-side tracking of who took each alert: alertId → username
    const takenByMap = reactive({});

    async function getHistory() {
      loading.value = true;
      history.value = await fetchAgentHistory(selectedAgent.value);
      loading.value = false;
    }

    function isExpanded(row) {
      return expandedRows.value.some(
        (r) => r.time === row.time && r.type === row.type,
      );
    }

    async function toggleAlerts(row) {
      const key = row.time;
      const isCurrentlyExpanded = isExpanded(row);

      if (isCurrentlyExpanded) {
        expandedRows.value = expandedRows.value.filter(
          (r) => !(r.time === row.time && r.type === row.type),
        );
        return;
      }

      expandedRows.value.push(row);

      if (relatedAlerts[key]) return; // already loaded

      alertsLoading[key] = true;
      try {
        const agentId = selectedAgent.value?.agent_id || selectedAgent.value?.id;
        if (!agentId) {
          relatedAlerts[key] = [];
          return;
        }

        const resp = await alertsClient.listAlerts({ agentId: String(agentId) });
        const responseObj = resp;
        const items = responseObj.itemsList || responseObj.items || [];

        // Filter alerts within ±30 min of the history entry
        const entryTime = new Date(row.time).getTime();
        const windowMs = 30 * 60 * 1000;

        relatedAlerts[key] = items
          .filter((item) => {
            const occurredAt = item.lastOccurredAt || item.last_occurred_at;
            if (!occurredAt) return false;
            const alertTime = new Date(occurredAt).getTime();
            if (Number.isNaN(alertTime)) return false;
            return Math.abs(alertTime - entryTime) <= windowMs;
          })
          .map((item) => {
            const alertId = Number(item.id) || 0;
            return {
              id: alertId,
              severity: Number(item.severity) || 0,
              status: Number(item.status) || 0,
              title: item.title || item.type || "Alert",
              message: item.message || "",
              lastOccurredAt: item.lastOccurredAt
                ? formatDateUtil(item.lastOccurredAt)
                : "—",
              takenBy: takenByMap[alertId] || null,
            };
          });
      } catch {
        relatedAlerts[key] = [];
      } finally {
        alertsLoading[key] = false;
      }
    }

    async function takeAlert(alertRow, timeKey) {
      try {
        await alertsClient.acknowledgeAlert(alertRow.id);
        const username = authStore.displayName || authStore.username || "Unknown";
        alertRow.status = alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED;
        alertRow.takenBy = username;
        takenByMap[alertRow.id] = username;
        $q.notify({ message: "Alert taken by " + username, color: "positive", icon: "check" });
      } catch (e) {
        $q.notify({ message: "Failed to take alert: " + (e?.message || e), color: "negative" });
      }
    }

    async function exportHistoryReport(format) {
      if (!history.value.length) {
        $q.notify({ message: "No data to export", color: "warning", icon: "warning" });
        return;
      }
      try {
        const agentHostname = selectedAgent.value?.hostname || selectedAgent.value?.agent_id || "agent";
        const timestamp = new Date().toISOString().slice(0, 10);
        // Count related alerts per history entry for the report
        const relatedAlertsCounts = {};
        for (const key of Object.keys(relatedAlerts)) {
          const count = relatedAlerts[key]?.length || 0;
          if (count > 0) relatedAlertsCounts[key] = count;
        }
        await exportHistory({
          history: history.value,
          format,
          filename: "agent-history-" + agentHostname + "-" + timestamp,
          agentHostname,
          relatedAlertsCounts,
        });
        $q.notify({ message: "Exported " + format.toUpperCase() + " successfully", color: "positive", icon: "check" });
      } catch (e) {
        $q.notify({ message: "Export failed: " + (e?.message || e), color: "negative" });
      }
    }

    watch(selectedAgent, (newValue) => {
      if (newValue) {
        getHistory();
      }
    });

    // quasar dialogs
    function showScriptOutput(output) {
      if (!output) {
        Notify.create({
          message: "No output is available yet",
          type: "negative",
        });
        return;
      }
      $q.dialog({
        component: ScriptOutput,
        componentProps: {
          scriptInfo: output,
        },
      });
    }

    function showCommandOutput(title, output) {
      $q.dialog({
        component: PreDialog,
        componentProps: {
          title: title,
          dialogStyle: "width: 70vw; max-width: 80vw",
          message: output,
        },
      });
    }

    // vue component hooks
    onMounted(() => {
      if (selectedAgent.value) getHistory();
    });

    return {
      // reactive
      history,
      loading,
      tabHeight,
      filter,
      expandedRows,
      relatedAlerts,
      alertsLoading,

      // non-reactive data
      columns,
      alertColumns,
      alertStatusOpen,

      // methods
      formatDate,
      showScriptOutput,
      showCommandOutput,
      getHistory,
      truncateText,
      isExpanded,
      toggleAlerts,
      takeAlert,
      exportHistoryReport,
      alertSeverityLabel,
      alertSeverityColor,
      alertStatusLabel,
      alertStatusColor,

      // computed
      selectedAgent,
    };
  },
};
</script>

<style scoped>
.related-alerts-table :deep(.q-table__top) {
  display: none;
}
</style>
