<template>
  <div class="cywm-scope winupdate-page">
    <!-- Top bar -->
    <div class="cywm-topbar">
      <div class="cywm-breadcrumb">
        <span class="cywm-breadcrumb__link">Tools</span>
        <span class="cywm-breadcrumb__sep">/</span>
        <span>Patch Management</span>
      </div>
    </div>

    <div class="cywm-page__body">
      <!-- Deployment detail -->
      <template v-if="selectedDeploymentId !== null">
        <q-btn
          flat
          dense
          no-caps
          icon="arrow_back"
          label="Back to list"
          class="q-mb-md winupdate-back-btn"
          @click="selectedDeploymentId = null"
        />
        <DeploymentDetail :deployment-id="selectedDeploymentId" />
      </template>

      <!-- Main view: upload + deployments -->
      <template v-else>
        <!-- Section 1: Upload Patches -->
        <div class="winupdate-card">
          <div class="winupdate-card__header">
            <q-icon name="cloud_upload" size="20px" class="q-mr-sm" />
            Upload Patches
          </div>

          <div class="winupdate-patch-rows">
            <div
              v-for="(row, i) in patchRows"
              :key="i"
              class="winupdate-patch-row"
            >
              <q-file
                v-model="row.file"
                accept=".msu"
                dense
                outlined
                label="Select .msu file"
                class="winupdate-patch-row__file"
                bg-color="white"
              >
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <q-input
                v-model="row.buildId"
                dense
                outlined
                label="Build ID"
                placeholder="e.g. 22631"
                class="winupdate-patch-row__build"
                bg-color="white"
              />

              <q-select
                v-model="row.arch"
                :options="archOptions"
                dense
                outlined
                label="Arch"
                emit-value
                map-options
                class="winupdate-patch-row__arch"
                bg-color="white"
              />

              <q-btn
                flat
                dense
                round
                icon="delete_outline"
                color="negative"
                :disable="patchRows.length === 1"
                @click="removeRow(i)"
              />
            </div>
          </div>

          <div class="winupdate-card__actions">
            <q-btn
              outline
              dense
              no-caps
              icon="add"
              label="Add patch"
              @click="addRow"
            />
            <q-btn
              color="primary"
              dense
              no-caps
              icon="cloud_upload"
              label="Upload"
              :loading="uploading"
              :disable="!canUpload"
              @click="doUpload"
            />
          </div>

          <q-linear-progress
            v-if="uploading"
            :value="uploadProgress / 100"
            color="primary"
            class="q-mt-sm"
            rounded
          />

          <!-- Upload result -->
          <div v-if="uploadResult" class="q-mt-md winupdate-upload-result">
            <div
              v-if="uploadResult.uploaded.length"
              class="winupdate-result-row winupdate-result-row--ok"
            >
              <q-icon name="check_circle_outline" />
              <span>
                Uploaded:
                {{ uploadResult.uploaded.map((u) => u.filename).join(", ") }}
              </span>
            </div>
            <div
              v-for="e in uploadResult.errors"
              :key="e.filename"
              class="winupdate-result-row winupdate-result-row--err"
            >
              <q-icon name="error_outline" />
              <span><strong>{{ e.filename }}</strong>: {{ e.error }}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Deployments -->
        <div class="winupdate-card">
          <div class="winupdate-card__header">
            <q-icon name="rocket_launch" size="20px" class="q-mr-sm" />
            Deployments
          </div>

          <!-- Apply patch form -->
          <div class="winupdate-apply-form">
            <div class="winupdate-apply-form__label">Apply Patch</div>
            <div class="winupdate-apply-grid">
              <AgentPicker
                v-model="selectedAgentIds"
                :options="agentOptions"
                multiple
                outlined
                dense
                label="Select agents"
              />
              <SiteTreeSelect
                v-model="selectedSiteIds"
                :sites="sitesFlat"
              />
              <q-btn
                color="primary"
                dense
                no-caps
                label="Apply Patch"
                :loading="applying"
                :disable="!canApply"
                @click="doApply"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Deployments table -->
          <q-table
            :rows="deployments"
            :columns="deploymentColumns"
            :loading="loadingDeployments"
            row-key="id"
            dense
            flat
            class="winupdate-table"
            @row-click="(_, row) => (selectedDeploymentId = row.id)"
          >
            <template #loading>
              <q-inner-loading showing color="primary" />
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <UkBadge :variant="deploymentStatusVariant(props.value)">
                  {{ props.value }}
                </UkBadge>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn
                  flat
                  dense
                  no-caps
                  size="sm"
                  icon="open_in_new"
                  label="View"
                  @click.stop="selectedDeploymentId = props.row.id"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";
import {
  uploadPatches,
  applyPatch,
  fetchDeployments,
  type DeploymentRecord,
  type UploadPatchesResponse,
  type DeploymentStatus,
} from "@/api/winupdatePatches";
import { fetchAgents } from "@/api/agents";
import { fetchSitesFlat } from "@/api/clients";
import {
  buildAgentOptions,
  type AgentOptionRich,
} from "@/devicemanagement/components/agentOptionHelpers";
import AgentPicker from "@/devicemanagement/components/AgentPicker.vue";
import UkBadge from "@/uikit/components/UkBadge.vue";
import DeploymentDetail from "@/winupdate/components/DeploymentDetail.vue";
import SiteTreeSelect from "@/winupdate/components/SiteTreeSelect.vue";

const $q = useQuasar();

// --- Upload section ---

interface PatchRow {
  file: File | null;
  buildId: string;
  arch: string;
}

const archOptions = [
  { label: "x64", value: "x64" },
  { label: "x86", value: "x86" },
  { label: "arm64", value: "arm64" },
];

const patchRows = ref<PatchRow[]>([{ file: null, buildId: "", arch: "x64" }]);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadResult = ref<UploadPatchesResponse | null>(null);

const canUpload = computed(() =>
  patchRows.value.every(
    (r) => r.file !== null && r.buildId.trim() !== "" && r.arch !== "",
  ),
);

function addRow() {
  patchRows.value.push({ file: null, buildId: "", arch: "x64" });
}

function removeRow(i: number) {
  patchRows.value.splice(i, 1);
}

async function doUpload() {
  uploading.value = true;
  uploadProgress.value = 0;
  uploadResult.value = null;
  try {
    const result = await uploadPatches(
      patchRows.value.map((r) => r.file!),
      patchRows.value.map((r) => r.buildId.trim()),
      patchRows.value.map((r) => r.arch),
      (p) => {
        uploadProgress.value = p;
      },
    );
    uploadResult.value = result;
    if (result.errors.length === 0) {
      $q.notify({
        message: `${result.uploaded.length} patch(es) uploaded successfully`,
        color: "positive",
        icon: "check_circle",
      });
      patchRows.value = [{ file: null, buildId: "", arch: "x64" }];
    } else if (result.uploaded.length > 0) {
      $q.notify({
        message: `${result.uploaded.length} uploaded, ${result.errors.length} failed`,
        color: "warning",
        icon: "warning",
      });
    } else {
      $q.notify({
        message: "All uploads failed",
        color: "negative",
        icon: "error",
      });
    }
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error ?? "Upload failed",
      color: "negative",
      icon: "error",
    });
  } finally {
    uploading.value = false;
  }
}

// --- Apply section ---

const agentOptions = ref<AgentOptionRich[]>([]);
const sitesFlat = ref<{ id: number; name: string; ancestors?: string | null }[]>([]);
const selectedAgentIds = ref<string[]>([]);
const selectedSiteIds = ref<number[]>([]);
const applying = ref(false);

const canApply = computed(
  () => selectedAgentIds.value.length > 0 || selectedSiteIds.value.length > 0,
);

async function loadApplyFormData() {
  const [agents, sites] = await Promise.all([fetchAgents(), fetchSitesFlat()]);
  agentOptions.value = buildAgentOptions(agents ?? []);
  sitesFlat.value = sites ?? [];
}

async function doApply() {
  applying.value = true;
  try {
    const result = await applyPatch({
      agent_ids:
        selectedAgentIds.value.length > 0 ? selectedAgentIds.value : undefined,
      site_ids:
        selectedSiteIds.value.length > 0 ? selectedSiteIds.value : undefined,
    });
    $q.notify({
      message: `Deployment #${result.deployment_id} started for ${result.total_agents} agents`,
      color: "positive",
      icon: "rocket_launch",
    });
    selectedAgentIds.value = [];
    selectedSiteIds.value = [];
    await loadDeployments();
    selectedDeploymentId.value = result.deployment_id;
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error ?? "Failed to start deployment",
      color: "negative",
      icon: "error",
    });
  } finally {
    applying.value = false;
  }
}

// --- Deployments list ---

const deployments = ref<DeploymentRecord[]>([]);
const loadingDeployments = ref(false);
const selectedDeploymentId = ref<number | null>(null);

const deploymentColumns = [
  { name: "id", label: "ID", field: "id", sortable: true, align: "left" as const },
  { name: "created_by", label: "Created by", field: "created_by", sortable: true, align: "left" as const },
  {
    name: "created_at",
    label: "Date",
    field: "created_at",
    sortable: true,
    align: "left" as const,
    format: (v: string) => new Date(v).toLocaleString(),
  },
  { name: "status", label: "Status", field: "status", sortable: true, align: "left" as const },
  { name: "total_agents", label: "Total", field: "total_agents", sortable: true, align: "right" as const },
  { name: "dispatched_count", label: "Dispatched", field: "dispatched_count", sortable: true, align: "right" as const },
  { name: "failed_count", label: "Failed", field: "failed_count", sortable: true, align: "right" as const },
  { name: "actions", label: "", field: "id", align: "right" as const },
];

function deploymentStatusVariant(
  status: DeploymentStatus,
): "neutral" | "primary" | "success" {
  if (status === "completed") return "success";
  if (status === "running") return "primary";
  return "neutral";
}

async function loadDeployments() {
  loadingDeployments.value = true;
  try {
    deployments.value = await fetchDeployments();
  } catch {
    // silently ignore — boot interceptor handles 401/4xx notifications
  } finally {
    loadingDeployments.value = false;
  }
}

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (!uploading.value) return;
  e.preventDefault();
  // eslint-disable-next-line no-param-reassign
  e.returnValue = ""; // required for Chrome <119 and Firefox
}

onBeforeRouteLeave(() => {
  if (uploading.value) {
    return window.confirm("Upload in progress. Leave and cancel it?");
  }
});

onMounted(async () => {
  window.addEventListener("beforeunload", onBeforeUnload);
  await Promise.all([loadDeployments(), loadApplyFormData()]);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", onBeforeUnload);
});
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.winupdate-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--cywm-bg-page);
  color: var(--cywm-text-primary);
  font-family: var(--cywm-sans);
  font-size: 14px;
}

.cywm-topbar {
  background: var(--cywm-bg-card);
  border-bottom: 1px solid var(--cywm-border);
  padding: 0 24px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  flex-shrink: 0;
}

.cywm-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--cywm-text-secondary);
}

.cywm-breadcrumb__link {
  color: var(--cywm-accent);
}

.cywm-breadcrumb__sep {
  color: var(--cywm-text-muted);
}

.cywm-page__body {
  flex: 1;
  padding: 20px 24px 24px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.winupdate-back-btn {
  color: var(--cywm-accent);
  align-self: flex-start;
}

.winupdate-card {
  background: var(--cywm-bg-card);
  border: 1px solid var(--cywm-border);
  border-radius: 6px;
  padding: 20px;
}

.winupdate-card__header {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--cywm-text-primary);
  margin-bottom: 16px;
}

.winupdate-card__actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.winupdate-patch-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.winupdate-patch-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &__file {
    flex: 2 1 0;
    min-width: 0;
  }

  &__build {
    flex: 1 1 0;
    min-width: 100px;
  }

  &__arch {
    flex: 0 0 110px;
  }
}

.winupdate-upload-result {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.winupdate-result-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 4px;

  &--ok {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &--err {
    background: #ffebee;
    color: #c62828;
  }
}

.winupdate-apply-form {
  margin-bottom: 4px;
}

.winupdate-apply-form__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cywm-text-secondary);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.winupdate-apply-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: flex-end;
}

.winupdate-table {
  :deep(tr) {
    cursor: pointer;
  }
}
</style>
