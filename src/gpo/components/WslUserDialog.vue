<template>
  <q-dialog :model-value="modelValue" persistent maximized @update:model-value="onModelChange">
    <q-card class="column">
      <q-card-section class="row items-start q-col-gutter-md">
        <div class="col">
          <div class="text-h6">WSL</div>
          <div class="text-caption text-grey-7">
            Agent: {{ agent?.hostname || "-" }}
          </div>
          <div v-if="user" class="text-caption text-grey-7">
            User: {{ user.name || user.samAccountName }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md scroll" style="max-height: calc(100vh - 140px)">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-lg-4">
            <q-card bordered flat>
              <q-card-section>
                <div class="text-subtitle1">Actions</div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  Fast WSL operations on the selected agent.
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="column q-gutter-sm">
                  <q-btn
                    unelevated
                    color="primary"
                    icon="refresh"
                    label="Refresh All"
                    :loading="loading.status || loading.distributions || loading.globalConfig"
                    @click="loadOverview"
                  />
                  <q-btn
                    outline
                    color="primary"
                    icon="power_settings_new"
                    label="Shutdown WSL"
                    :loading="loading.shutdown"
                    @click="shutdownWsl"
                  />
                  <q-btn
                    outline
                    color="primary"
                    icon="fact_check"
                    label="Compliance Report"
                    :loading="loading.compliance"
                    @click="loadComplianceReport"
                  />
                  <q-btn
                    outline
                    color="primary"
                    icon="history"
                    label="Activity Log"
                    :loading="loading.activity"
                    @click="loadActivityLog"
                  />
                </div>
              </q-card-section>
            </q-card>

            <q-card bordered flat class="q-mt-md">
              <q-card-section>
                <div class="text-subtitle1">Import Distribution</div>
              </q-card-section>
              <q-card-section class="q-pt-none q-gutter-sm">
                <q-input
                  v-model="importForm.distributionName"
                  dense
                  outlined
                  label="Distribution Name"
                />
                <q-input
                  v-model="importForm.installLocation"
                  dense
                  outlined
                  label="Install Location"
                />
                <q-input
                  v-model="importForm.packagePath"
                  dense
                  outlined
                  label="Package Path"
                />
                <q-select
                  v-model="importForm.version"
                  :options="versionOptions"
                  emit-value
                  map-options
                  dense
                  outlined
                  label="Version"
                />
                <q-btn
                  unelevated
                  color="primary"
                  icon="download"
                  label="Import"
                  :loading="loading.importDistribution"
                  :disable="
                    !importForm.distributionName.trim() ||
                    !importForm.installLocation.trim() ||
                    !importForm.packagePath.trim()
                  "
                  @click="submitImportDistribution"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-8">
            <q-card bordered flat>
              <q-card-section class="row items-center q-col-gutter-md">
                <div class="col">
                  <div class="text-subtitle1">Status</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="refresh"
                    :loading="loading.status"
                    @click="loadStatus"
                  />
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-banner dense rounded class="bg-grey-2 text-grey-9">
                  {{ statusText }}
                </q-banner>
              </q-card-section>
            </q-card>

            <q-card bordered flat class="q-mt-md">
              <q-card-section class="row items-center q-col-gutter-md">
                <div class="col">
                  <div class="text-subtitle1">Distributions</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="refresh"
                    :loading="loading.distributions"
                    @click="loadDistributions"
                  />
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-table
                  flat
                  bordered
                  dense
                  :rows="distributions"
                  :columns="distributionColumns"
                  row-key="distributionName"
                  selection="single"
                  v-model:selected="selectedDistributionRows"
                  :pagination="{ rowsPerPage: 5 }"
                />
                <div class="row q-col-gutter-sm q-mt-md">
                  <div class="col">
                    <q-select
                      v-model="selectedDistributionName"
                      :options="distributionNameOptions"
                      emit-value
                      map-options
                      dense
                      outlined
                      clearable
                      label="Selected Distribution"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      outline
                      color="primary"
                      icon="settings"
                      label="Get Distribution Config"
                      :loading="loading.distributionConfig"
                      :disable="!selectedDistributionName"
                      @click="loadDistributionConfig"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-xl-6">
                <q-card bordered flat class="full-height">
                  <q-card-section class="row items-center q-col-gutter-md">
                    <div class="col">
                      <div class="text-subtitle1">Global Config</div>
                    </div>
                    <div class="col-auto">
                      <q-btn
                        flat
                        dense
                        color="primary"
                        icon="refresh"
                        :loading="loading.globalConfig"
                        @click="loadGlobalConfig"
                      />
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <pre class="wsl-pre">{{ formatJson(globalConfig) }}</pre>
                    <q-input
                      :model-value="globalConfigRaw"
                      type="textarea"
                      readonly
                      autogrow
                      outlined
                      dense
                      label="Raw"
                      class="q-mt-md"
                    />
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-xl-6">
                <q-card bordered flat class="full-height">
                  <q-card-section>
                    <div class="text-subtitle1">Distribution Config</div>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      {{ selectedDistributionName || "Distribution is not selected" }}
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <pre class="wsl-pre">{{ formatJson(distributionConfig) }}</pre>
                    <q-input
                      :model-value="distributionConfigRaw"
                      type="textarea"
                      readonly
                      autogrow
                      outlined
                      dense
                      label="Raw"
                      class="q-mt-md"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-xl-6">
                <q-card bordered flat class="full-height">
                  <q-card-section>
                    <div class="text-subtitle1">Compliance Report</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <pre class="wsl-pre">{{ formatJson(complianceReport) }}</pre>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-xl-6">
                <q-card bordered flat class="full-height">
                  <q-card-section class="row items-center q-col-gutter-md">
                    <div class="col">
                      <div class="text-subtitle1">Activity Log</div>
                    </div>
                    <div class="col-auto">
                      <q-input
                        v-model.number="activityMaxEvents"
                        type="number"
                        dense
                        outlined
                        label="Max"
                        style="width: 100px"
                      />
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input
                      v-model="activityLogNameFilter"
                      dense
                      outlined
                      clearable
                      label="Log Name Filter"
                      class="q-mb-md"
                    />
                    <pre class="wsl-pre">{{ formatJson(activityLog) }}</pre>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { QTableColumn } from "quasar";
import { notifyError, notifySuccess } from "@/utils/notify";
import { createAgentTarget } from "@/gpo/api/grpc-client";
import {
  type WslActivityLogResult,
  type WslComplianceReportResult,
  type WslDistributionConfigRecord,
  type WslDistributionRecord,
  type WslGlobalConfigRecord,
  type WslStatusResult,
  wslLifecycleClient,
} from "@/gpo/api/wsl-lifecycle";

interface AgentLike {
  id: string;
  hostname?: string;
}

interface UserLike {
  name?: string;
  samAccountName?: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent: AgentLike | null;
  user: UserLike | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const distributionColumns: QTableColumn[] = [
  {
    name: "distributionName",
    label: "Name",
    align: "left",
    field: "distributionName",
    sortable: true,
  },
  {
    name: "state",
    label: "State",
    align: "left",
    field: "state",
    sortable: true,
  },
  {
    name: "version",
    label: "Version",
    align: "center",
    field: "version",
    sortable: true,
  },
  {
    name: "isDefault",
    label: "Default",
    align: "center",
    field: "isDefault",
    format: (val: boolean) => (val ? "Yes" : "No"),
    sortable: true,
  },
];

const versionOptions = [
  {
    label: "WSL 1",
    value: wslLifecycleClient.WslDistributionVersion.WSL_DISTRIBUTION_VERSION_1,
  },
  {
    label: "WSL 2",
    value: wslLifecycleClient.WslDistributionVersion.WSL_DISTRIBUTION_VERSION_2,
  },
];

const loading = reactive({
  status: false,
  distributions: false,
  globalConfig: false,
  distributionConfig: false,
  compliance: false,
  activity: false,
  shutdown: false,
  importDistribution: false,
});

const status = ref<WslStatusResult | null>(null);
const distributions = ref<WslDistributionRecord[]>([]);
const selectedDistributionRows = ref<WslDistributionRecord[]>([]);
const selectedDistributionName = ref("");
const globalConfig = ref<WslGlobalConfigRecord>({});
const globalConfigRaw = ref("");
const distributionConfig = ref<WslDistributionConfigRecord>({});
const distributionConfigRaw = ref("");
const complianceReport = ref<WslComplianceReportResult["report"] | null>(null);
const activityLog = ref<WslActivityLogResult | null>(null);
const activityMaxEvents = ref(100);
const activityLogNameFilter = ref("");
const importForm = reactive({
  distributionName: "",
  installLocation: "",
  packagePath: "",
  version: wslLifecycleClient.WslDistributionVersion.WSL_DISTRIBUTION_VERSION_2,
});

const distributionNameOptions = computed(() =>
  distributions.value.map((item) => ({
    label: item.distributionName,
    value: item.distributionName,
  })),
);

const statusText = computed(() => {
  if (!status.value) return "WSL status has not been loaded yet.";
  return status.value.rawText || status.value.errorMessage || "No status data";
});

watch(selectedDistributionRows, (rows) => {
  selectedDistributionName.value = rows[0]?.distributionName || "";
});

watch(
  () => props.modelValue,
  async (opened) => {
    if (!opened || !props.agent?.id) return;
    await loadOverview();
  },
);

function onModelChange(value: boolean) {
  emit("update:modelValue", value);
}

function closeDialog() {
  emit("update:modelValue", false);
}

function getTarget() {
  if (!props.agent?.id) {
    throw new Error("Agent is not selected");
  }
  return createAgentTarget(props.agent.id);
}

function formatJson(value: unknown) {
  if (value == null) return "No data";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function loadOverview() {
  await Promise.all([loadStatus(), loadDistributions(), loadGlobalConfig()]);
}

async function loadStatus() {
  loading.status = true;
  try {
    status.value = await wslLifecycleClient.getWslStatus(getTarget());
  } catch (error) {
    notifyError((error as Error)?.message || "Failed to load WSL status");
  } finally {
    loading.status = false;
  }
}

async function loadDistributions() {
  loading.distributions = true;
  try {
    distributions.value = await wslLifecycleClient.getDistributions(getTarget());
    if (
      !selectedDistributionName.value &&
      distributions.value.length > 0
    ) {
      selectedDistributionName.value = distributions.value[0].distributionName;
    }
  } catch (error) {
    notifyError((error as Error)?.message || "Failed to load distributions");
  } finally {
    loading.distributions = false;
  }
}

async function loadGlobalConfig() {
  loading.globalConfig = true;
  try {
    const result = await wslLifecycleClient.getGlobalConfig(getTarget());
    globalConfig.value = result.config;
    globalConfigRaw.value = result.rawText || "";
  } catch (error) {
    notifyError((error as Error)?.message || "Failed to load global config");
  } finally {
    loading.globalConfig = false;
  }
}

async function loadDistributionConfig() {
  if (!selectedDistributionName.value) {
    notifyError("Select a distribution");
    return;
  }
  loading.distributionConfig = true;
  try {
    const result = await wslLifecycleClient.getDistributionConfig({
      target: getTarget(),
      distributionName: selectedDistributionName.value,
    });
    distributionConfig.value = result.config;
    distributionConfigRaw.value = result.rawText || "";
  } catch (error) {
    notifyError(
      (error as Error)?.message || "Failed to load distribution config",
    );
  } finally {
    loading.distributionConfig = false;
  }
}

async function loadComplianceReport() {
  loading.compliance = true;
  try {
    const result = await wslLifecycleClient.getComplianceReport({
      target: getTarget(),
      distributionName: selectedDistributionName.value || undefined,
    });
    complianceReport.value = result.report;
  } catch (error) {
    notifyError(
      (error as Error)?.message || "Failed to load compliance report",
    );
  } finally {
    loading.compliance = false;
  }
}

async function loadActivityLog() {
  loading.activity = true;
  try {
    activityLog.value = await wslLifecycleClient.getActivityLog({
      target: getTarget(),
      maxEvents: activityMaxEvents.value,
      logNameFilter: activityLogNameFilter.value || undefined,
    });
  } catch (error) {
    notifyError((error as Error)?.message || "Failed to load activity log");
  } finally {
    loading.activity = false;
  }
}

async function shutdownWsl() {
  loading.shutdown = true;
  try {
    const result = await wslLifecycleClient.shutdownWsl(getTarget());
    if (
      result.status !==
      wslLifecycleClient.OperatorWslControlResponseStatus.OPERATOR_WSL_CONTROL_RESPONSE_STATUS_OK
    ) {
      throw new Error(result.errorMessage || "WSL shutdown failed");
    }
    notifySuccess("WSL shutdown command sent");
    await loadStatus();
  } catch (error) {
    notifyError((error as Error)?.message || "Failed to shutdown WSL");
  } finally {
    loading.shutdown = false;
  }
}

async function submitImportDistribution() {
  loading.importDistribution = true;
  try {
    const result = await wslLifecycleClient.importDistribution({
      target: getTarget(),
      distributionName: importForm.distributionName.trim(),
      installLocation: importForm.installLocation.trim(),
      packagePath: importForm.packagePath.trim(),
      version: importForm.version,
    });
    if (
      result.status !==
      wslLifecycleClient.OperatorWslControlResponseStatus.OPERATOR_WSL_CONTROL_RESPONSE_STATUS_OK
    ) {
      throw new Error(result.errorMessage || "Import failed");
    }
    notifySuccess("Distribution import command sent");
    importForm.distributionName = "";
    importForm.installLocation = "";
    importForm.packagePath = "";
    importForm.version =
      wslLifecycleClient.WslDistributionVersion.WSL_DISTRIBUTION_VERSION_2;
    await loadDistributions();
  } catch (error) {
    notifyError(
      (error as Error)?.message || "Failed to import distribution",
    );
  } finally {
    loading.importDistribution = false;
  }
}
</script>

<style scoped>
.wsl-pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.4;
}
</style>
