<template>
  <div v-if="agent?.id" class="column">
    <div class="row q-col-gutter-md q-mb-md items-end">
      <div class="col">
        <div class="text-h6">VHD</div>
        <div class="text-caption text-grey-7">
          Volumes on agent: {{ agent.hostname || agent.id }}
        </div>
      </div>
      <div class="col-auto row q-gutter-xs flex-wrap">
        <q-btn-dropdown
          flat
          dense
          round
          color="primary"
          icon="more_vert"
          dropdown-icon="none"
          aria-label="VHD actions"
        >
          <q-list dense style="min-width: 220px">
            <q-item v-close-popup clickable @click="openWorkspaceDialog">
              <q-item-section avatar>
                <q-icon name="add_box" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>Workspace</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="openUpdateWorkspaceDialog">
              <q-item-section avatar>
                <q-icon name="edit" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>Edit workspace</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="openLinkAgentDialog">
              <q-item-section avatar>
                <q-icon name="link" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>Link agent</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="openVolumeDialog">
              <q-item-section avatar>
                <q-icon name="layers" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>Volume</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <q-expansion-item
      v-model="workspacesExpanded"
      dense
      default-opened
      icon="folder_open"
      label="Workspaces"
      caption=""
      class="q-mb-sm rounded-borders"
      bordered
    >
      <div class="row items-center q-mb-sm q-gutter-xs q-px-sm">
        <q-btn
          flat
          dense
          color="primary"
          icon="refresh"
          label="Update the list"
          :loading="loadingWorkspaces"
          @click="loadWorkspaces"
        />
      </div>
      <q-banner
        v-if="workspacesError"
        dense
        rounded
        class="bg-negative text-white q-mb-sm q-mx-sm"
      >
        {{ workspacesError }}
      </q-banner>
      <q-table
        class="q-mx-sm q-mb-sm"
        dense
        flat
        bordered
        virtual-scroll
        :virtual-scroll-item-size="48"
        :rows="workspacesList"
        :columns="workspaceColumns"
        row-key="id"
        :loading="loadingWorkspaces"
        :pagination="{ rowsPerPage: 0 }"
        :rows-per-page-options="[0]"
        :style="{ maxHeight: 'min(45vh, 420px)' }"
        @row-click="onWorkspaceRowClick"
      >
        <template #no-data>
          <div class="text-grey-6 q-pa-sm">
            There is no data available. Click "Refresh the list».
          </div>
        </template>
        <template #body-cell-desiredState="props">
          <q-td :props="props">
            {{ workspaceDesiredLabel(props.row.desiredState) }}
          </q-td>
        </template>
        <template #body-cell-actualState="props">
          <q-td :props="props">
            <q-badge
              outline
              :color="workspaceActualColor(props.row.actualState)"
            >
              {{ workspaceActualLabel(props.row.actualState) }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-expansion-item>

    <div class="column q-gutter-y-xs q-mb-md">
      <div class="row q-col-gutter-sm items-center no-wrap">
        <q-input
          v-model="workspaceListId"
          class="col"
          dense
          outlined
          clearable
          hide-bottom-space
          label="Workspace ID (for list & defaults)"
        />
        <div class="col-auto">
          <q-btn
            outline
            dense
            color="primary"
            icon="sync"
            label="Load volumes"
            no-wrap
            :loading="loadingVolumes"
            @click="loadVolumes"
          />
        </div>
      </div>
      <div class="text-caption text-grey-7">
        Then click «Load volumes» to fetch the table below.
      </div>
    </div>

    <q-banner
      v-if="volumesError"
      dense
      rounded
      class="bg-negative text-white q-mb-md"
    >
      {{ volumesError }}
    </q-banner>

    <q-scroll-area
      class="full-width q-mt-sm"
      :style="{
        height: 'max(240px, min(560px, calc(100vh - 560px)))',
      }"
    >
      <q-table
        :rows="volumeRows"
        :columns="volumeColumns"
        :row-key="rowKey"
        flat
        bordered
        :loading="loadingVolumes"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-6">
            Enter Workspace ID and click «Load volumes».
          </div>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge outline color="grey-8">
              {{ props.row.status || "—" }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown
              flat
              dense
              color="primary"
              label="Actions"
              size="sm"
            >
              <q-list dense>
                <q-item
                  v-close-popup
                  clickable
                  @click="openVolumeDetails(props.row.name)"
                >
                  <q-item-section>Details</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="mountVolume(props.row.name)"
                >
                  <q-item-section>Mount</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="unmountVolume(props.row.name)"
                >
                  <q-item-section>Unmount</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="openResizeDialog(props.row.name)"
                >
                  <q-item-section>Resize</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  v-close-popup
                  clickable
                  class="text-negative"
                  @click="confirmDeleteVolume(props.row)"
                >
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-scroll-area>

    <q-dialog v-model="workspaceDialog">
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">Create workspace</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input
            v-model="workspaceForm.id"
            dense
            outlined
            label="Workspace ID"
          />
          <q-input v-model="workspaceForm.name" dense outlined label="Name" />
          <q-input
            v-model="workspaceForm.description"
            dense
            outlined
            label="Description"
            type="textarea"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="workspaceDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Create"
            :loading="workspaceSubmitting"
            @click="submitWorkspace"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateWorkspaceDialog">
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">Update workspace</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input
            v-model="updateWorkspaceForm.id"
            dense
            outlined
            label="Workspace ID"
          />
          <q-input
            v-model="updateWorkspaceForm.name"
            dense
            outlined
            label="Name"
          />
          <q-input
            v-model="updateWorkspaceForm.description"
            dense
            outlined
            label="Description"
            type="textarea"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="updateWorkspaceDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            :loading="updateWorkspaceSubmitting"
            @click="submitUpdateWorkspace"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="linkAgentDialog">
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">Link workstation agent</q-card-section>
        <q-card-section class="text-caption text-grey-7">
          Binds this agent (current Target) to the workspace via
          <code>SetWorkstaionAgent</code>.
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input
            v-model="linkAgentWorkspaceId"
            dense
            outlined
            label="Workspace ID"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="linkAgentDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Link"
            :loading="linkAgentSubmitting"
            @click="submitLinkAgent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="volumeDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">Create volume</q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="volumeForm.workspaceId"
            dense
            outlined
            label="Workspace ID"
          />
          <q-input
            v-model="volumeForm.name"
            dense
            outlined
            label="Volume name"
          />
          <q-input
            v-model="volumeForm.basePath"
            dense
            outlined
            label="Base path"
          />
          <q-input
            v-model="volumeForm.mountPoint"
            dense
            outlined
            label="Mount point"
          />
          <div class="row q-col-gutter-sm">
            <q-input
              v-model.number="volumeForm.blockSize"
              class="col-6"
              dense
              outlined
              type="number"
              label="Block size"
            />
            <q-input
              v-model.number="volumeForm.blocks"
              class="col-6"
              dense
              outlined
              type="number"
              label="Blocks"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="volumeDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Create"
            :loading="volumeSubmitting"
            @click="submitVolume"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="resizeDialog">
      <q-card style="min-width: 320px">
        <q-card-section class="text-h6">Resize volume</q-card-section>
        <q-card-section>
          <div class="text-body2 q-mb-sm">{{ resizeVolumeName }}</div>
          <q-input
            v-model.number="resizeBlocks"
            dense
            outlined
            type="number"
            label="New block count"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="resizeDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Resize"
            :loading="resizeSubmitting"
            @click="submitResize"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="volumeDetailsDialog">
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="text-h6">{{
          volumeDetailsTitle
        }}</q-card-section>
        <q-card-section>
          <pre
            v-if="volumeDetailsJson"
            class="text-body2 scroll"
            style="max-height: 50vh"
            >{{ volumeDetailsJson }}</pre
          >
          <div v-else class="text-grey-6">No data</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="volumeDetailsDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <div v-else class="text-grey-6 q-pa-md">No agent selected.</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar, type QTableColumn } from "quasar";
import { createAgentTarget } from "@/gpo/api/grpc-client";
import { operatorVhdClient } from "@/gpo/api/vhd-grpc";
import {
  WorkspaceActualState,
  WorkspaceDesiredState,
} from "@/generated/common/workspace_pb";
import type * as common_workspace_pb_types from "@/generated/common/workspace_pb";
import type * as operator_vhd_service_pb_types from "@/generated/operator/vhd_service_pb";
import { notifyError, notifyInfo, notifySuccess } from "@/utils/notify";

export interface GpoVhdAgentTabAgent {
  id: string;
  hostname?: string;
}

type WorkspaceVolumeRow =
  operator_vhd_service_pb_types.WorkspaceVolume.AsObject & {
    _kind?: "ws";
  };

const props = defineProps<{
  agent: GpoVhdAgentTabAgent | null;
  active: boolean;
}>();

const $q = useQuasar();

const workspaceListId = ref("");

const workspacesExpanded = ref(true);
const workspacesList = ref<common_workspace_pb_types.WorkspaceDto.AsObject[]>(
  [],
);

const loadingWorkspaces = ref(false);
const workspacesError = ref("");

const loadingVolumes = ref(false);
const volumesError = ref("");
const volumesListWs = ref<WorkspaceVolumeRow[]>([]);

const workspaceDialog = ref(false);
const workspaceSubmitting = ref(false);
const workspaceForm = ref({
  id: "",
  name: "",
  description: "",
});

const updateWorkspaceDialog = ref(false);
const updateWorkspaceSubmitting = ref(false);
const updateWorkspaceForm = ref({
  id: "",
  name: "",
  description: "",
});

const linkAgentDialog = ref(false);
const linkAgentSubmitting = ref(false);
const linkAgentWorkspaceId = ref("");

const volumeDialog = ref(false);
const volumeSubmitting = ref(false);
const volumeForm = ref({
  workspaceId: "",
  name: "",
  basePath: "",
  mountPoint: "",
  blockSize: 4096,
  blocks: 1024,
});

const resizeDialog = ref(false);
const resizeSubmitting = ref(false);
const resizeVolumeName = ref("");
const resizeBlocks = ref(1024);

const volumeDetailsDialog = ref(false);
const volumeDetailsTitle = ref("Volume");
const volumeDetailsJson = ref("");

const workspaceColumns: QTableColumn[] = [
  { name: "id", label: "ID", field: "id", align: "left" },
  { name: "name", label: "Name", field: "name", align: "left" },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    style: "max-width: 220px",
    classes: "ellipsis",
  },
  {
    name: "desiredState",
    label: "Desired",
    field: "desiredState",
    align: "left",
  },
  { name: "actualState", label: "Actual", field: "actualState", align: "left" },
];

const volumeRows = computed<WorkspaceVolumeRow[]>(() => volumesListWs.value);

const volumeColumns: QTableColumn[] = [
  { name: "id", label: "Id", field: "id", align: "left" },
  {
    name: "workspaceId",
    label: "Workspace",
    field: "workspaceId",
    align: "left",
  },
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "mountPoint", label: "Mount", field: "mountPoint", align: "left" },
  {
    name: "desiredSizeMb",
    label: "Desired MB",
    field: "desiredSizeMb",
    align: "right",
  },
  {
    name: "actualSizeMb",
    label: "Actual MB",
    field: "actualSizeMb",
    align: "right",
  },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "actions", label: "", field: "name", align: "right" },
];

function rowKey(row: WorkspaceVolumeRow): string {
  return `ws:${row.workspaceId}:${row.name}:${row.id}`;
}

function vhdOk(
  resp: operator_vhd_service_pb_types.VhdOperationResponse.AsObject,
): boolean {
  return resp.status === operatorVhdClient.VhdOperatorStatus.OK;
}

function workspaceDesiredLabel(v: number): string {
  switch (v) {
    case WorkspaceDesiredState.WORKSPACE_DESIRED_STOPPED:
      return "Stopped";
    case WorkspaceDesiredState.WORKSPACE_DESIRED_RUNNING:
      return "Running";
    default:
      return "Unknown";
  }
}

function workspaceActualLabel(v: number): string {
  switch (v) {
    case WorkspaceActualState.WORKSPACE_ACTUAL_STOPPED:
      return "Stopped";
    case WorkspaceActualState.WORKSPACE_ACTUAL_RUNNING:
      return "Running";
    case WorkspaceActualState.WORKSPACE_ACTUAL_ERROR:
      return "Error";
    default:
      return "Unknown";
  }
}

function workspaceActualColor(v: number): string {
  switch (v) {
    case WorkspaceActualState.WORKSPACE_ACTUAL_RUNNING:
      return "positive";
    case WorkspaceActualState.WORKSPACE_ACTUAL_ERROR:
      return "negative";
    case WorkspaceActualState.WORKSPACE_ACTUAL_STOPPED:
      return "warning";
    default:
      return "grey";
  }
}

function onWorkspaceRowClick(
  _evt: unknown,
  row: common_workspace_pb_types.WorkspaceDto.AsObject,
): void {
  if (row.id) {
    workspaceListId.value = row.id;
    notifyInfo(`Workspace ID: ${row.id}`);
  }
}

async function loadWorkspaces(): Promise<void> {
  if (!props.agent?.id) return;
  workspacesError.value = "";
  loadingWorkspaces.value = true;
  try {
    const res = await operatorVhdClient.getAllWorkspaces();
    workspacesList.value = res.workspacesList ?? [];
  } catch (e: unknown) {
    workspacesList.value = [];
    const msg = e instanceof Error ? e.message : String(e);
    workspacesError.value = msg;
    notifyError(msg);
  } finally {
    loadingWorkspaces.value = false;
  }
}

async function loadVolumes(): Promise<void> {
  if (!props.agent?.id) return;
  volumesError.value = "";
  loadingVolumes.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const wid = workspaceListId.value.trim();
    if (!wid) {
      volumesListWs.value = [];
      volumesError.value = "Enter Workspace ID for the volumes list.";
      return;
    }
    const res = await operatorVhdClient.getVolumesByWorkspace(target, wid);
    if (res.status !== operatorVhdClient.VhdOperatorStatus.OK) {
      volumesError.value =
        res.errorMessage?.trim() ||
        "Failed to list volumes by workspace (operator status).";
      volumesListWs.value = [];
      return;
    }
    volumesListWs.value = (res.volumesList ?? []) as WorkspaceVolumeRow[];
  } catch (e: unknown) {
    volumesListWs.value = [];
    const msg = e instanceof Error ? e.message : String(e);
    volumesError.value = msg;
    notifyError(msg);
  } finally {
    loadingVolumes.value = false;
  }
}

function openWorkspaceDialog(): void {
  workspaceForm.value = { id: "", name: "", description: "" };
  workspaceDialog.value = true;
}

function openUpdateWorkspaceDialog(): void {
  updateWorkspaceForm.value = {
    id: workspaceListId.value.trim() || "",
    name: "",
    description: "",
  };
  updateWorkspaceDialog.value = true;
}

async function submitUpdateWorkspace(): Promise<void> {
  if (!props.agent?.id) return;
  const { id, name, description } = updateWorkspaceForm.value;
  if (!id.trim() || !name.trim()) {
    notifyError("Workspace ID and name are required.");
    return;
  }
  updateWorkspaceSubmitting.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.updateWorkspace(target, {
      id: id.trim(),
      name: name.trim(),
      description: description.trim(),
    });
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Update workspace failed.");
      return;
    }
    notifySuccess("Workspace updated.");
    updateWorkspaceDialog.value = false;
    await Promise.all([loadWorkspaces(), loadVolumes()]);
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    updateWorkspaceSubmitting.value = false;
  }
}

function openLinkAgentDialog(): void {
  linkAgentWorkspaceId.value = workspaceListId.value.trim();
  linkAgentDialog.value = true;
}

async function submitLinkAgent(): Promise<void> {
  if (!props.agent?.id) return;
  const wid = linkAgentWorkspaceId.value.trim();
  if (!wid) {
    notifyError("Workspace ID is required.");
    return;
  }
  linkAgentSubmitting.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.setWorkstaionAgent(target, wid);
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Link agent failed.");
      return;
    }
    notifySuccess("Workstation agent linked.");
    linkAgentDialog.value = false;
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    linkAgentSubmitting.value = false;
  }
}

async function submitWorkspace(): Promise<void> {
  if (!props.agent?.id) return;
  const { id, name, description } = workspaceForm.value;
  if (!id.trim() || !name.trim()) {
    notifyError("Workspace ID and name are required.");
    return;
  }
  workspaceSubmitting.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.createWorkspace(target, {
      id: id.trim(),
      name: name.trim(),
      description: description.trim(),
    });
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Create workspace failed.");
      return;
    }
    notifySuccess("Workspace created.");
    workspaceDialog.value = false;
    workspaceListId.value = id.trim();
    await Promise.all([loadWorkspaces(), loadVolumes()]);
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    workspaceSubmitting.value = false;
  }
}

function openVolumeDialog(): void {
  volumeForm.value = {
    workspaceId: workspaceListId.value.trim(),
    name: "",
    basePath: "",
    mountPoint: "",
    blockSize: 4096,
    blocks: 1024,
  };
  volumeDialog.value = true;
}

async function submitVolume(): Promise<void> {
  if (!props.agent?.id) return;
  const f = volumeForm.value;
  if (
    !f.workspaceId.trim() ||
    !f.name.trim() ||
    !f.basePath.trim() ||
    !f.mountPoint.trim()
  ) {
    notifyError("Workspace ID, name, base path and mount point are required.");
    return;
  }
  if (!Number.isFinite(f.blockSize) || f.blockSize <= 0) {
    notifyError("Block size must be a positive number.");
    return;
  }
  if (!Number.isFinite(f.blocks) || f.blocks <= 0) {
    notifyError("Blocks must be a positive number.");
    return;
  }
  volumeSubmitting.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.createVolume(target, {
      workspaceId: f.workspaceId.trim(),
      name: f.name.trim(),
      basePath: f.basePath.trim(),
      mountPoint: f.mountPoint.trim(),
      blockSize: Math.trunc(f.blockSize),
      blocks: Math.trunc(f.blocks),
    });
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Create volume failed.");
      return;
    }
    notifySuccess("Volume created.");
    volumeDialog.value = false;
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    volumeSubmitting.value = false;
  }
}

async function openVolumeDetails(name: string): Promise<void> {
  if (!props.agent?.id || !name) return;
  volumeDetailsJson.value = "";
  volumeDetailsTitle.value = "Volume — GetVolumeByWorkspace";
  volumeDetailsDialog.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.getVolumeByWorkspace(target, name);
    if (res.status !== operatorVhdClient.VhdOperatorStatus.OK) {
      const msg =
        res.errorMessage?.trim() ||
        "GetVolumeByWorkspace failed (operator status).";
      volumeDetailsJson.value = msg;
      notifyError(msg);
      return;
    }
    volumeDetailsJson.value = JSON.stringify(res, null, 2);
  } catch (e: unknown) {
    volumeDetailsJson.value = e instanceof Error ? e.message : String(e);
    notifyError(volumeDetailsJson.value);
  }
}

async function mountVolume(name: string): Promise<void> {
  if (!props.agent?.id || !name) return;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.mountVolume(target, name);
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Mount failed.");
      return;
    }
    notifySuccess("Mount requested.");
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  }
}

async function unmountVolume(name: string): Promise<void> {
  if (!props.agent?.id || !name) return;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.unmountVolume(target, name);
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Unmount failed.");
      return;
    }
    notifySuccess("Unmount requested.");
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  }
}

function openResizeDialog(name: string): void {
  resizeVolumeName.value = name;
  resizeBlocks.value = 1024;
  resizeDialog.value = true;
}

async function submitResize(): Promise<void> {
  if (!props.agent?.id || !resizeVolumeName.value) return;
  const blocks = Math.trunc(Number(resizeBlocks.value));
  if (!Number.isFinite(blocks) || blocks <= 0) {
    notifyError("Blocks must be a positive number.");
    return;
  }
  resizeSubmitting.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.resizeVolume(
      target,
      resizeVolumeName.value,
      blocks,
    );
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Resize failed.");
      return;
    }
    notifySuccess("Resize requested.");
    resizeDialog.value = false;
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    resizeSubmitting.value = false;
  }
}

function deleteWorkspaceIdForRow(row: WorkspaceVolumeRow): string {
  return row.workspaceId?.trim() ?? "";
}

function confirmDeleteVolume(row: WorkspaceVolumeRow): void {
  $q.dialog({
    title: "Delete volume",
    message: `Delete volume "${row.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void deleteVolume(row.name, deleteWorkspaceIdForRow(row));
  });
}

async function deleteVolume(name: string, workspaceId: string): Promise<void> {
  if (!props.agent?.id || !name) return;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.deleteVolume(target, name, workspaceId);
    if (!vhdOk(res)) {
      notifyError(res.errorMessage?.trim() || "Delete failed.");
      return;
    }
    notifySuccess("Volume deleted.");
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  }
}

watch(
  () => [props.active, props.agent?.id] as const,
  ([active, id]) => {
    if (active && id) {
      void loadVolumes();
      void loadWorkspaces();
    }
  },
  { immediate: true },
);
</script>
