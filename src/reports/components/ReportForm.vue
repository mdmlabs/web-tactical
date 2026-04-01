<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 50vw">
      <q-bar>
        {{ isEdit ? "Edit Report" : "Create Report" }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-form @submit="onSubmit">
        <q-card-section class="q-pa-md">
          <q-input
            v-model="localReport.name"
            label="Report name"
            outlined
            :rules="[(val) => !!val || '*Required']"
          />
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="text-h6 q-mb-sm">Source Type</div>
          <q-option-group
            v-model="sourceTypeOption"
            :options="sourceTypeOptions"
            color="primary"
            inline
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Fields</div>
          <div class="q-gutter-y-sm">
            <q-checkbox
              v-for="field in reportFields"
              :key="`create-report-form-report-field-${field.field}`"
              v-model="localReportFields[field.field]"
              :label="field.label"
              color="primary"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Access Mode</div>
          <div class="q-gutter-y-sm">
            <q-option-group
              v-model="accessModeOption"
              :options="accessModeOptions"
              color="primary"
              inline
            />
            <div v-if="accessModeOption === 'RESTRICTED_ROLES'">
              <q-checkbox
                v-for="role in systemRolesList"
                :key="`create-report-form-role-${role.name}`"
                v-model="localRolesList[role.id]"
                :label="role.name"
                color="primary"
              />
              <div
                v-if="validateRolesResult !== true"
                class="text-negative q-mt-xs text-caption"
              >
                {{ validateRolesResult }}
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn-dropdown
            v-on:show="getSites"
            label="Filters"
            class="q-pa-md"
            unelevated
            dropdown-icon="filter_alt"
          >
            <q-list style="max-width: 360px">
              <q-item>
                <div>
                  <div class="text-h6 q-mb-sm">Filters</div>
                  <div class="q-gutter-y-sm">
                    <q-input
                      filled
                      v-model="filters.date_from"
                      placeholder="YYYY-MM-DD"
                      label="Date From"
                      clearable
                      mask="####-##-##"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="filters.date_from"
                              mask="YYYY-MM-DD"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input
                      filled
                      v-model="filters.date_to"
                      label="Date to"
                      placeholder="YYYY-MM-DD"
                      clearable
                      mask="####-##-##"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="filters.date_to" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-item>
              <q-item>
                <q-select
                  clearable
                  outlined
                  v-model="filters.site_id"
                  :options="sitesList"
                  :label="filterSiteSelectLabel"
                  option-value="id"
                  :option-label="(site) => `[${site.id}] ${site.name}`"
                  style="width: 100%; display: block"
                  emit-value
                  map-options
                />
              </q-item>
              <q-item>
                <q-select
                  :disable="!filters.site_id || agentsBySite.length === 0"
                  clearable
                  outlined
                  v-model="filters.agent_ids"
                  :options="agentsBySite"
                  :label="filterAgentsSelectLabel"
                  multiple
                  option-value="agent_id"
                  :option-label="
                    (agent) => `[${agent.agent_id}] ${agent.hostname}`
                  "
                  emit-value
                  map-options
                  style="width: 100%; display: block"
                />
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :loading="loading"
            :disable="validateRolesResult !== true"
            dense
            flat
            push
            label="Save"
            color="primary"
            type="submit"
          />
          <q-btn dense flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import { fetchRoles } from "@/api/accounts";
import { fetchAgents } from "@/api/agents";
import { fetchSitesFlat } from "@/api/clients";
import {
  createReport,
  fetchReportFieldsBySourceType,
  patchReportById,
} from "@/api/reports";
import { notifyError, notifySuccess } from "@/utils/notify";
import { useDialogPluginComponent } from "quasar";
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  computed,
  reactive,
} from "vue";

export default defineComponent({
  name: "ReportForm",
  emits: [...useDialogPluginComponent.emits],
  props: {
    report: Object,
  },
  setup(props) {
    const isEdit = computed(() => !!props.report?.id);
    const initializing = ref(true);

    const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

    const filterSiteSelectLabel = computed(() => {
      if (sitesList.value.length > 0) return "Category";
      else return "No categories in system";
    });

    const filterAgentsSelectLabel = computed(() => {
      if (!filters.site_id) return "Choose category first";
      return agentsBySite.value.length === 0 ? "No agents found" : "Agents";
    });

    const sourceTypeOption = ref(props.report?.source_type || "HEALTH");
    const accessModeOption = ref(props.report?.access_mode || "ALL_ADMINS");

    const reportFields = ref([]);
    const localReportFields = ref({});

    const systemRolesList = ref([]);
    const localRolesList = ref({});

    const sitesList = ref([]);
    const agentsBySite = ref([]);

    const reportPropSelectedFields = ref(props.report?.selected_fields || []);

    const filters = reactive({
      site_id: null,
      agent_ids: [],
      date_from: null,
      date_to: null,
    });

    const cleanFilters = computed(() => {
      const clean = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          (Array.isArray(value) ? value.length > 0 : true)
        ) {
          clean[key] = value;
        }
      });

      return clean;
    });

    const localReport = ref({
      name: props.report?.name || "",
      report_type: props.report?.report_type || sourceTypeOption.value,
      source_type: props.report?.source_type || sourceTypeOption.value,
      selected_fields: props.report?.selected_fields || [],
      access_mode: props.report?.access_mode || accessModeOption.value,
    });

    const sourceTypeOptions = [
      {
        label: "HEALTH",
        value: "HEALTH",
      },
      {
        label: "APPLIED_POLICIES",
        value: "APPLIED_POLICIES",
      },
    ];

    const accessModeOptions = [
      {
        label: "ALL_ADMINS",
        value: "ALL_ADMINS",
      },
      {
        label: "RESTRICTED_ROLES",
        value: "RESTRICTED_ROLES",
      },
    ];

    const loading = ref(false);

    async function onSubmit() {
      loading.value = true;
      try {
        const payload = {
          ...localReport.value,
          allowed_roles:
            accessModeOption.value === "RESTRICTED_ROLES"
              ? Object.keys(localRolesList.value)
                  .filter((id) => localRolesList.value[id])
                  .map(Number)
              : undefined,
          filters: cleanFilters.value,
        };
        let data;
        if (isEdit.value) {
          data = await patchReportById(props.report.id, payload);
        } else {
          data = await createReport(payload);
        }
        if (data) {
          notifySuccess("Report successfully created!");
          onDialogOK();
        }
      } catch (e) {
        console.error(e);
        notifyError("Report wasn't created. Error occured.");
      } finally {
        loading.value = false;
      }
    }
    const loadFieldsByType = (type) => {
      fetchReportFieldsBySourceType({ source_type: type })
        .then((fields) => {
          reportFields.value = fields;

          const selectedSet = new Set(reportPropSelectedFields.value);
          const map = {};

          fields.forEach((f) => {
            if (isEdit.value) {
              map[f.field] = selectedSet.has(f.field);
            } else {
              map[f.field] = true;
            }
          });

          localReportFields.value = map;

          updateSelectedFieldsAndType();
        })
        .catch((e) => {
          console.error(e);
          notifyError("Error while loading fields for type ", type);
        });
    };

    function updateSelectedFieldsAndType() {
      const selected = reportFields.value
        .filter((f) => localReportFields.value[f.field])
        .map((f) => f.field);

      localReport.value.selected_fields = selected;

      const allSelected = selected.length === reportFields.value.length;

      localReport.value.report_type = allSelected
        ? sourceTypeOption.value
        : "CUSTOM";
      localReport.value.source_type = sourceTypeOption.value;
    }

    async function loadRoles() {
      if (accessModeOption.value !== "RESTRICTED_ROLES") return;
      loading.value = true;

      try {
        const data = await fetchRoles();

        systemRolesList.value = data || [];

        const allowedRolesIds = isEdit.value
          ? new Set(props.report?.allowed_roles || [])
          : new Set();

        data.forEach((role) => {
          localRolesList.value[role.id] = isEdit.value
            ? allowedRolesIds.has(role.id)
            : true;
        });
      } catch (e) {
        console.error("Error while fetching roles", e);

        notifyError("Something went wrong while fetching roles.");
      } finally {
        loading.value = false;
      }
    }

    async function getSites() {
      loading.value = true;
      try {
        const data = await fetchSitesFlat();
        sitesList.value = data || [];
      } catch (e) {
        console.error(e);
        notifyError("Something went wrong while fetching sites.");
      } finally {
        loading.value = false;
      }
    }

    async function fetchAgentsBySiteId(siteId) {
      loading.value = true;
      try {
        const data = await fetchAgents({ site: siteId });
        agentsBySite.value = data || [];
      } catch (e) {
        notifyError("Error while fetching agents by site");
        console.error(e);
      } finally {
        loading.value = false;
      }
    }

    const validateRolesResult = computed(() => {
      if (accessModeOption.value !== "RESTRICTED_ROLES") return true;
      const hasRoles = Object.values(localRolesList.value).some(Boolean);

      return hasRoles || "Choose atleast 1 role.";
    });

    watch(sourceTypeOption, (newVal) => {
      loadFieldsByType(newVal);
    });

    watch(accessModeOption, (newVal) => {
      localReport.value.access_mode = newVal;

      if (newVal === "RESTRICTED_ROLES") {
        loadRoles();
      }
    });

    watch(
      reportFields.value,
      (newFields) => {
        newFields.forEach((field) => {
          if (localReportFields.value[field.label] === undefined) {
            localReportFields.value[field.label] = field.checked;
          }
        });
      },
      { deep: true },
    );

    watch(
      localReportFields,
      () => {
        updateSelectedFieldsAndType();
      },
      { deep: true },
    );

    watch(
      () => filters.site_id,
      (newVal) => {
        filters.agent_ids = [];
        if (newVal) {
          fetchAgentsBySiteId(newVal);
        }
      },
    );

    onMounted(async () => {
      await getSites();
      loadFieldsByType(sourceTypeOption.value);
      loadRoles();

      if (isEdit.value && props.report?.filters) {
        const savedFilters = props.report.filters;

        filters.site_id = savedFilters.site_id || null;

        if (filters.site_id) {
          await fetchAgentsBySiteId(filters.site_id);
          filters.agent_ids = savedFilters.agent_ids || [];
        }

        filters.date_from = savedFilters.date_from || null;
        filters.date_to = savedFilters.date_to || null;
      }
      initializing.value = false;
    });

    return {
      isEdit,
      loading,
      localReport,
      sourceTypeOption,
      sourceTypeOptions,
      accessModeOptions,
      accessModeOption,
      validateRolesResult,
      reportFields,
      localReportFields,
      systemRolesList,
      localRolesList,
      filters,
      sitesList,
      agentsBySite,

      filterAgentsSelectLabel,
      filterSiteSelectLabel,

      onSubmit,
      getSites,
      fetchAgentsBySiteId,

      dialogRef,
      onDialogHide,
    };
  },
});
</script>
