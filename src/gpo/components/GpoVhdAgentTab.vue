<template>
  <div v-if="agent?.id" class="column full-height">
    <div class="row q-col-gutter-md q-mb-md items-end">
      <div class="col">
        <div class="text-h6">VHD</div>
        <div class="text-caption text-grey-7">
          Volumes on agent: {{ agent.hostname || agent.id }}
        </div>
      </div>
      <div class="col-auto row q-gutter-xs">
        <q-btn
          flat
          dense
          color="primary"
          icon="refresh"
          label="Refresh"
          :loading="loadingVolumes"
          @click="loadVolumes"
        />
        <q-btn
          outline
          dense
          color="primary"
          icon="add_box"
          label="Workspace"
          @click="openWorkspaceDialog"
        />
        <q-btn
          outline
          dense
          color="primary"
          icon="layers"
          label="Volume"
          @click="openVolumeDialog"
        />
      </div>
    </div>

    <q-banner v-if="volumesError" dense rounded class="bg-negative text-white q-mb-md">
      {{ volumesError }}
    </q-banner>

    <q-scroll-area class="agent-tab-table-scroll">
      <q-table
        :rows="volumeRows"
        :columns="volumeColumns"
        row-key="name"
        flat
        bordered
        :loading="loadingVolumes"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-6">
            No volumes yet. Refresh or create a workspace and volume.
          </div>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge outline :color="volumeStatusColor(props.row.status)">
              {{ volumeStatusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-healthy="props">
          <q-td :props="props">
            <q-icon
              :name="props.row.healthy ? 'check_circle' : 'cancel'"
              :color="props.row.healthy ? 'positive' : 'grey'"
              size="sm"
            />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown flat dense color="primary" label="Actions" size="sm">
              <q-list dense>
                <q-item v-close-popup clickable @click="mountVolume(props.row.name)">
                  <q-item-section>Mount</q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="unmountVolume(props.row.name)">
                  <q-item-section>Unmount</q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="openResizeDialog(props.row.name)">
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
          <q-input v-model="workspaceForm.id" dense outlined label="Workspace ID" />
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
          <q-btn flat label="Cancel" color="primary" @click="workspaceDialog = false" />
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

    <q-dialog v-model="volumeDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">Create volume</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="volumeForm.workspaceId" dense outlined label="Workspace ID" />
          <q-input v-model="volumeForm.name" dense outlined label="Volume name" />
          <q-input v-model="volumeForm.basePath" dense outlined label="Base path" />
          <q-input v-model="volumeForm.mountPoint" dense outlined label="Mount point" />
          <div class="row q-col-gutter-mg">
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
          <q-btn flat label="Cancel" color="primary" @click="volumeDialog = false" />
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
          <q-btn flat label="Cancel" color="primary" @click="resizeDialog = false" />
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
  </div>
  <div v-else class="text-grey-6 q-pa-md">No agent selected.</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar, type QTableColumn } from "quasar";
import { createAgentTarget } from "@/gpo/api/grpc-client";
import { operatorVhdClient } from "@/gpo/api/vhd-grpc";
import { VolumeStatus } from "@/generated/common/workspace_pb";
import type * as operator_vhd_service_pb_types from "@/generated/operator/vhd_service_pb";
import { notifyError, notifySuccess } from "@/utils/notify";

export interface GpoVhdAgentTabAgent {
  id: string;
  hostname?: string;
}

const props = defineProps<{
  agent: GpoVhdAgentTabAgent | null;
  active: boolean;
}>();

const $q = useQuasar();

const loadingVolumes = ref(false);
const volumesError = ref("");
const volumesList = ref<
  operator_vhd_service_pb_types.VolumesResponse.AsObject["volumesList"]
>([]);

const workspaceDialog = ref(false);
const workspaceSubmitting = ref(false);
const workspaceForm = ref({
  id: "",
  name: "",
  description: "",
});

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

const volumeRows = computed(() => volumesList.value);

const volumeColumns: QTableColumn[] = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "mountPoint", label: "Mount", field: "mountPoint", align: "left" },
  { name: "basePath", label: "Base path", field: "basePath", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "sizeMb", label: "Size MB", field: "sizeMb", align: "right" },
  { name: "usedMb", label: "Used MB", field: "usedMb", align: "right" },
  { name: "healthy", label: "OK", field: "healthy", align: "center" },
  { name: "actions", label: "", field: "name", align: "right" },
];

function volumeStatusLabel(status: number): string {
  switch (status) {
    case VolumeStatus.VOLUME_MOUNTED:
      return "Mounted";
    case VolumeStatus.VOLUME_UNMOUNTED:
      return "Unmounted";
    default:
      return "Unknown";
  }
}

function volumeStatusColor(status: number): string {
  switch (status) {
    case VolumeStatus.VOLUME_MOUNTED:
      return "positive";
    case VolumeStatus.VOLUME_UNMOUNTED:
      return "warning";
    default:
      return "grey";
  }
}

function vhdOk(
  resp: operator_vhd_service_pb_types.VhdOperationResponse.AsObject,
): boolean {
  return resp.status === operatorVhdClient.VhdOperatorStatus.OK;
}

async function loadVolumes(): Promise<void> {
  if (!props.agent?.id) return;
  volumesError.value = "";
  loadingVolumes.value = true;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.getVolumes(target);
    if (res.status !== operatorVhdClient.VhdOperatorStatus.OK) {
      volumesError.value =
        res.errorMessage?.trim() || "Failed to list volumes (operator status).";
      volumesList.value = [];
      return;
    }
    volumesList.value = res.volumesList ?? [];
  } catch (e: unknown) {
    volumesList.value = [];
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
    await loadVolumes();
  } catch (e: unknown) {
    notifyError(e instanceof Error ? e.message : String(e));
  } finally {
    workspaceSubmitting.value = false;
  }
}

function openVolumeDialog(): void {
  volumeForm.value = {
    workspaceId: "",
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

function confirmDeleteVolume(row: { name: string }): void {
  $q.dialog({
    title: "Delete volume",
    message: `Delete volume "${row.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void deleteVolume(row.name);
  });
}

async function deleteVolume(name: string): Promise<void> {
  if (!props.agent?.id || !name) return;
  try {
    const target = createAgentTarget(props.agent.id);
    const res = await operatorVhdClient.deleteVolume(target, name, "");
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
    }
  },
  { immediate: true },
);
</script>
