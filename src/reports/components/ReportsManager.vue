<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 85vw; max-height: 90vh">
      <q-bar>
        Reports Manager
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-input
          v-model.number="searchId"
          label="Search by id"
          debounce="500"
          filled
          min="1"
          dense
          bordered
          clearable
          :loading="loading"
          @update:model-value="findReport"
          @clear="onSearchClear"
        />
      </q-card-section>
      <q-table
        :rows="reports"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top>
          <q-btn
            label="New"
            dense
            flat
            push
            no-caps
            icon="add"
            @click="showReportForm"
          />
        </template>
        <template v-slot:body-cell-filters_agent_ids="props">
          <q-td :props="props">
            <q-tooltip v-if="props.row.filters?.agent_ids?.length > 0">
              {{ props.row.filters?.agent_ids?.join(", ") || "—" }}
            </q-tooltip>
            <div
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 250px;
              "
            >
              {{ getAgentIdsDisplay(props.row.filters?.agent_ids) }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="download"
              flat
              round
              dense
              color="primary"
              @click="downloadReport(props.row.id)"
              size="sm"
            >
              <q-tooltip>Download</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status !== 'CLOSED'"
              icon="close"
              flat
              round
              dense
              color="primary"
              @click="closeReport(props.row.id)"
              size="sm"
            >
              <q-tooltip>Close</q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              flat
              round
              dense
              color="primary"
              @click="deleteReport(props.row.id)"
              size="sm"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status !== 'CLOSED'"
              icon="edit"
              flat
              round
              dense
              color="primary"
              size="sm"
              @click="showReportForm(props.row)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import {
  closeReportById,
  deleteReportById,
  downloadReportById,
  fetchReports,
  getReportById,
} from "@/api/reports";
import { useDialogPluginComponent, useQuasar } from "quasar";
import ReportForm from "./ReportForm.vue";
import { exportDataToCSV } from "../utils/exportDataToCSV";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notify";

export default defineComponent({
  name: "ReportsManager",
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const searchId = ref("");
    const loading = ref(false);
    const reports = ref([]);
    const $q = useQuasar();
    const columns = [
      {
        name: "id",
        label: "Id",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
      },
      {
        name: "report_type",
        label: "Report Type",
        field: "report_type",
        align: "left",
      },
      {
        name: "source_type",
        label: "Source Type",
        field: "source_type",
        align: "left",
      },
      {
        name: "status",
        label: "Status",
        field: "status",
        align: "left",
      },
      {
        name: "filters_client_id",
        label: "Client ID",
        field: (row) => row.filters?.client_id || "—",
        align: "left",
      },
      {
        name: "filters_site_id",
        label: "Site ID",
        field: (row) => row.filters?.site_id || "—",
        align: "left",
      },
      {
        name: "filters_agent_ids",
        label: "Agent IDs",
        align: "left",
        sortable: false,
      },
      {
        name: "filters_date_from",
        label: "Date From",
        field: (row) => row.filters?.date_from || "—",
        align: "left",
      },
      {
        name: "filters_date_to",
        label: "Date To",
        field: (row) => row.filters?.date_to || "—",
        align: "left",
      },
      {
        name: "generated_at",
        label: "Generated At",
        field: "generated_at",
        align: "left",
      },
      {
        name: "closed_at",
        label: "Closed At",
        field: (row) => row?.closed_at || "—",
        align: "left",
      },
      {
        name: "created_time",
        label: "Created Time",
        field: "created_time",
        align: "left",
      },
      {
        name: "modified_time",
        label: "Modified Time",
        field: "modified_time",
        align: "left",
      },
      { name: "actions", label: "Actions", align: "right", field: "" },
    ];

    async function loadReports() {
      searchId.value = "";
      loading.value = true;
      try {
        const data = await fetchReports();
        reports.value = data || [];
      } catch (e) {
        notifyError("Failed to load reports");
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      loadReports();
    });

    function showReportForm(report) {
      $q.dialog({
        component: ReportForm,
        componentProps: {
          report: report,
        },
      })
        .onOk(() => {
          searchId.value = "";
          loadReports();
        })
        .onDismiss(() => {
          if (searchId.value) {
            loadReports();
          }
        })
        .onCancel(() => {
          if (searchId.value) {
            loadReports();
          }
        });
    }
    async function downloadReport(id) {
      try {
        const data = await downloadReportById(id);
        exportDataToCSV(data, `exported-report-${id}`);
        notifySuccess(`Successfully downloaded report ${id}`);
      } catch (e) {
        notifyError(`Failed to download report ${id}`);
        console.error(`Failed to download report ${id}`);
      }
    }

    async function closeReport(id) {
      try {
        await closeReportById(id);
        notifySuccess(`Successfully closed report ${id}`);
        loadReports();
      } catch (e) {
        notifyError(`Failed to close report ${id}`);
        console.error(`Failed to close report ${id}`);
      }
    }

    async function deleteReport(id) {
      try {
        await deleteReportById(id);
        notifySuccess(`Successfully deleted report ${id}`);
        loadReports();
      } catch (e) {
        notifyError(`Failed to delete report ${id}`);
        console.error(`Failed to delete report ${id}`);
      }
    }
    async function findReport() {
      if (!searchId.value) {
        await loadReports();

        return;
      }
      if (searchId.value <= 0 || isNaN(searchId.value)) {
        notifyWarning("Only positive and integer numbers allowed.");
        searchId.value = 0;
        return;
      }
      loading.value = true;

      try {
        const data = await getReportById(searchId.value);
        if (data) {
          reports.value = [data];
          notifySuccess("Successfully fetched report ", searchId.value);
        } else {
          reports.value = [];
        }
      } catch (e) {
        notifyError(`Failed to fetch report ${searchId.value}`);
        console.error(`Failed to fetch report ${searchId.value}`);
      } finally {
        loading.value = false;
      }
    }

    async function onSearchClear() {
      await loadReports();
    }

    const getAgentIdsDisplay = (agentIds) => {
      if (!Array.isArray(agentIds) || agentIds.length === 0) return "—";
      if (agentIds.length <= 2) return agentIds.join(", ");
      return `${agentIds.slice(0, 2).join(", ")} ...`;
    };

    return {
      loading,
      searchId,
      columns,
      reports,
      onSearchClear,
      findReport,
      showReportForm,
      downloadReport,
      closeReport,
      deleteReport,
      getAgentIdsDisplay,

      dialogRef,
      onDialogHide,
    };
  },
});
</script>
