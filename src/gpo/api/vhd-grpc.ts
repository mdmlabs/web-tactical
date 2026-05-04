import { OperatorVhdServiceClient } from "@/generated/operator/Vhd_serviceServiceClientPb";
import { VolumeServiceClient } from "@/generated/internal/VhdServiceClientPb";
import * as operator_vhd_service_pb from "@/generated/operator/vhd_service_pb";
import type * as operator_vhd_service_pb_types from "@/generated/operator/vhd_service_pb";
import * as internal_vhd_pb from "@/generated/internal/vhd_pb";
import type * as internal_vhd_pb_types from "@/generated/internal/vhd_pb";
import type * as common_workspace_pb_types from "@/generated/common/workspace_pb";
import type { Target } from "@/generated/common/target_pb";
import { createClient, createGrpcMetadata } from "@/gpo/api/grpc-client";

const operatorVhdServiceClient = createClient(OperatorVhdServiceClient);
const internalVolumeServiceClient = createClient(VolumeServiceClient);

function grpcMeta() {
  return createGrpcMetadata();
}

function applyTarget<T extends { setTarget: (value: Target) => unknown }>(
  req: T,
  target: Target,
): void {
  req.setTarget(target);
}

export const operatorVhdClient = {
  VhdOperatorStatus: operator_vhd_service_pb.VhdOperatorStatus,

  async createWorkspace(
    target: Target,
    input: { id: string; name: string; description: string },
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.CreateWorkspaceRequest();
    applyTarget(req, target);
    req.setId(input.id);
    req.setName(input.name);
    req.setDescription(input.description);
    const resp = await operatorVhdServiceClient.createWorkspace(
      req,
      grpcMeta(),
    );
    return resp.toObject();
  },

  async updateWorkspace(
    target: Target,
    input: { id: string; name: string; description: string },
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.UpdateWorkspaceRequest();
    applyTarget(req, target);
    req.setId(input.id);
    req.setName(input.name);
    req.setDescription(input.description);
    const resp = await operatorVhdServiceClient.updateWorkspace(
      req,
      grpcMeta(),
    );
    return resp.toObject();
  },

  async createVolume(
    target: Target,
    input: {
      workspaceId: string;
      name: string;
      basePath: string;
      mountPoint: string;
      blockSize: number;
      blocks: number;
    },
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.CreateVolumeRequest();
    applyTarget(req, target);
    req.setWorkspaceId(input.workspaceId);
    req.setName(input.name);
    req.setBasePath(input.basePath);
    req.setMountPoint(input.mountPoint);
    req.setBlockSize(input.blockSize);
    req.setBlocks(input.blocks);
    const resp = await operatorVhdServiceClient.createVolume(req, grpcMeta());
    return resp.toObject();
  },

  async mountVolume(
    target: Target,
    name: string,
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.NameRequest();
    applyTarget(req, target);
    req.setName(name);
    const resp = await operatorVhdServiceClient.mountVolume(req, grpcMeta());
    return resp.toObject();
  },

  async unmountVolume(
    target: Target,
    name: string,
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.NameRequest();
    applyTarget(req, target);
    req.setName(name);
    const resp = await operatorVhdServiceClient.unmountVolume(req, grpcMeta());
    return resp.toObject();
  },

  async deleteVolume(
    target: Target,
    name: string,
    workspaceId = "",
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.DeleteVolumeRequest();
    applyTarget(req, target);
    req.setName(name);
    req.setWorkspaceId(workspaceId);
    const resp = await operatorVhdServiceClient.deleteVolume(req, grpcMeta());
    return resp.toObject();
  },

  async resizeVolume(
    target: Target,
    name: string,
    blocks: number,
  ): Promise<operator_vhd_service_pb_types.VhdOperationResponse.AsObject> {
    const req = new operator_vhd_service_pb.ResizeVolumeRequest();
    applyTarget(req, target);
    req.setName(name);
    req.setBlocks(blocks);
    const resp = await operatorVhdServiceClient.resizeVolume(req, grpcMeta());
    return resp.toObject();
  },

  async getVolumes(
    target: Target,
  ): Promise<operator_vhd_service_pb_types.VolumesResponse.AsObject> {
    const req = new operator_vhd_service_pb.TargetRequest();
    applyTarget(req, target);
    const resp = await operatorVhdServiceClient.getVolumes(req, grpcMeta());
    return resp.toObject();
  },

  async getVolume(
    target: Target,
    name: string,
  ): Promise<operator_vhd_service_pb_types.VolumeResponse.AsObject> {
    const req = new operator_vhd_service_pb.GetVolumeRequest();
    applyTarget(req, target);
    req.setName(name);
    const resp = await operatorVhdServiceClient.getVolume(req, grpcMeta());
    return resp.toObject();
  },
};

export const internalVolumeClient = {
  OperationStatus: internal_vhd_pb.OperationStatus,

  async getVolumes(
    onlyMounted = false,
  ): Promise<internal_vhd_pb_types.VolumeList.AsObject> {
    const req = new internal_vhd_pb.GetVolumesRequest();
    req.setOnlyMounted(onlyMounted);
    const resp = await internalVolumeServiceClient.getVolumes(req, grpcMeta());
    return resp.toObject();
  },

  async getVolume(
    name: string,
  ): Promise<common_workspace_pb_types.VolumeDto.AsObject> {
    const req = new internal_vhd_pb.NameRequest();
    req.setName(name);
    const resp = await internalVolumeServiceClient.getVolume(req, grpcMeta());
    return resp.toObject();
  },

  async createVolume(input: {
    name: string;
    basePath: string;
    mountPoint: string;
    blockSize: number;
    blocks: number;
    overwrite?: boolean;
  }): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.CreateVolumeRequest();
    req.setName(input.name);
    req.setBasepath(input.basePath);
    req.setMountpoint(input.mountPoint);
    req.setBlocksize(input.blockSize);
    req.setBlocks(input.blocks);
    req.setOverwrite(Boolean(input.overwrite));
    const resp = await internalVolumeServiceClient.createVolume(req, grpcMeta());
    return resp.toObject();
  },

  async mountVolume(
    name: string,
  ): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.NameRequest();
    req.setName(name);
    const resp = await internalVolumeServiceClient.mountVolume(req, grpcMeta());
    return resp.toObject();
  },

  async unmountVolume(
    name: string,
  ): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.NameRequest();
    req.setName(name);
    const resp = await internalVolumeServiceClient.unmountVolume(
      req,
      grpcMeta(),
    );
    return resp.toObject();
  },

  async deleteVolume(
    name: string,
  ): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.NameRequest();
    req.setName(name);
    const resp = await internalVolumeServiceClient.deleteVolume(req, grpcMeta());
    return resp.toObject();
  },

  async resizeVolume(
    name: string,
    mode: { newBlocks: number } | { newSizeMb: number },
  ): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.ResizeRequest();
    req.setName(name);
    if ("newBlocks" in mode) {
      req.setNewBlocks(mode.newBlocks);
    } else {
      req.setNewSizeMb(mode.newSizeMb);
    }
    const resp = await internalVolumeServiceClient.resizeVolume(req, grpcMeta());
    return resp.toObject();
  },

  async updateVolume(
    name: string,
    mountPoint: string,
  ): Promise<internal_vhd_pb_types.OperationResult.AsObject> {
    const req = new internal_vhd_pb.UpdateRequest();
    req.setName(name);
    req.setMountpoint(mountPoint);
    const resp = await internalVolumeServiceClient.updateVolume(req, grpcMeta());
    return resp.toObject();
  },
};
