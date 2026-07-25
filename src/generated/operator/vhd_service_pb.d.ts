import * as jspb from 'google-protobuf'

import * as common_target_pb from '../common/target_pb'; // proto import: "common/target.proto"
import * as common_workspace_pb from '../common/workspace_pb'; // proto import: "common/workspace.proto"


export class GetAllWorkspacesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllWorkspacesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllWorkspacesRequest): GetAllWorkspacesRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllWorkspacesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllWorkspacesRequest;
  static deserializeBinaryFromReader(message: GetAllWorkspacesRequest, reader: jspb.BinaryReader): GetAllWorkspacesRequest;
}

export namespace GetAllWorkspacesRequest {
  export type AsObject = {
  };
}

export class SetWorkstaionAgentRequest extends jspb.Message {
  getWorkspaceId(): string;
  setWorkspaceId(value: string): SetWorkstaionAgentRequest;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): SetWorkstaionAgentRequest;
  hasTarget(): boolean;
  clearTarget(): SetWorkstaionAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetWorkstaionAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetWorkstaionAgentRequest): SetWorkstaionAgentRequest.AsObject;
  static serializeBinaryToWriter(message: SetWorkstaionAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetWorkstaionAgentRequest;
  static deserializeBinaryFromReader(message: SetWorkstaionAgentRequest, reader: jspb.BinaryReader): SetWorkstaionAgentRequest;
}

export namespace SetWorkstaionAgentRequest {
  export type AsObject = {
    workspaceId: string;
    target?: common_target_pb.Target.AsObject;
  };
}

export class TargetRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): TargetRequest;
  hasTarget(): boolean;
  clearTarget(): TargetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TargetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TargetRequest): TargetRequest.AsObject;
  static serializeBinaryToWriter(message: TargetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TargetRequest;
  static deserializeBinaryFromReader(message: TargetRequest, reader: jspb.BinaryReader): TargetRequest;
}

export namespace TargetRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
  };
}

export class GetVolumesByWorkspaceRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetVolumesByWorkspaceRequest;
  hasTarget(): boolean;
  clearTarget(): GetVolumesByWorkspaceRequest;

  getWorkspaceId(): string;
  setWorkspaceId(value: string): GetVolumesByWorkspaceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumesByWorkspaceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumesByWorkspaceRequest): GetVolumesByWorkspaceRequest.AsObject;
  static serializeBinaryToWriter(message: GetVolumesByWorkspaceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumesByWorkspaceRequest;
  static deserializeBinaryFromReader(message: GetVolumesByWorkspaceRequest, reader: jspb.BinaryReader): GetVolumesByWorkspaceRequest;
}

export namespace GetVolumesByWorkspaceRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    workspaceId: string;
  };
}

export class NameRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): NameRequest;
  hasTarget(): boolean;
  clearTarget(): NameRequest;

  getName(): string;
  setName(value: string): NameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NameRequest): NameRequest.AsObject;
  static serializeBinaryToWriter(message: NameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NameRequest;
  static deserializeBinaryFromReader(message: NameRequest, reader: jspb.BinaryReader): NameRequest;
}

export namespace NameRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    name: string;
  };
}

export class DeleteVolumeRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): DeleteVolumeRequest;
  hasTarget(): boolean;
  clearTarget(): DeleteVolumeRequest;

  getName(): string;
  setName(value: string): DeleteVolumeRequest;

  getWorkspaceId(): string;
  setWorkspaceId(value: string): DeleteVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVolumeRequest): DeleteVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteVolumeRequest;
  static deserializeBinaryFromReader(message: DeleteVolumeRequest, reader: jspb.BinaryReader): DeleteVolumeRequest;
}

export namespace DeleteVolumeRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    name: string;
    workspaceId: string;
  };
}

export class GetVolumeRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetVolumeRequest;
  hasTarget(): boolean;
  clearTarget(): GetVolumeRequest;

  getName(): string;
  setName(value: string): GetVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumeRequest): GetVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: GetVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumeRequest;
  static deserializeBinaryFromReader(message: GetVolumeRequest, reader: jspb.BinaryReader): GetVolumeRequest;
}

export namespace GetVolumeRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    name: string;
  };
}

export class CreateWorkspaceRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): CreateWorkspaceRequest;
  hasTarget(): boolean;
  clearTarget(): CreateWorkspaceRequest;

  getId(): string;
  setId(value: string): CreateWorkspaceRequest;

  getName(): string;
  setName(value: string): CreateWorkspaceRequest;

  getDescription(): string;
  setDescription(value: string): CreateWorkspaceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateWorkspaceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateWorkspaceRequest): CreateWorkspaceRequest.AsObject;
  static serializeBinaryToWriter(message: CreateWorkspaceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateWorkspaceRequest;
  static deserializeBinaryFromReader(message: CreateWorkspaceRequest, reader: jspb.BinaryReader): CreateWorkspaceRequest;
}

export namespace CreateWorkspaceRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    id: string;
    name: string;
    description: string;
  };
}

export class UpdateWorkspaceRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): UpdateWorkspaceRequest;
  hasTarget(): boolean;
  clearTarget(): UpdateWorkspaceRequest;

  getId(): string;
  setId(value: string): UpdateWorkspaceRequest;

  getName(): string;
  setName(value: string): UpdateWorkspaceRequest;

  getDescription(): string;
  setDescription(value: string): UpdateWorkspaceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateWorkspaceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateWorkspaceRequest): UpdateWorkspaceRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateWorkspaceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateWorkspaceRequest;
  static deserializeBinaryFromReader(message: UpdateWorkspaceRequest, reader: jspb.BinaryReader): UpdateWorkspaceRequest;
}

export namespace UpdateWorkspaceRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    id: string;
    name: string;
    description: string;
  };
}

export class WorkspacesResponse extends jspb.Message {
  getWorkspacesList(): Array<common_workspace_pb.WorkspaceDto>;
  setWorkspacesList(value: Array<common_workspace_pb.WorkspaceDto>): WorkspacesResponse;
  clearWorkspacesList(): WorkspacesResponse;
  addWorkspaces(value?: common_workspace_pb.WorkspaceDto, index?: number): common_workspace_pb.WorkspaceDto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspacesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspacesResponse): WorkspacesResponse.AsObject;
  static serializeBinaryToWriter(message: WorkspacesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspacesResponse;
  static deserializeBinaryFromReader(message: WorkspacesResponse, reader: jspb.BinaryReader): WorkspacesResponse;
}

export namespace WorkspacesResponse {
  export type AsObject = {
    workspacesList: Array<common_workspace_pb.WorkspaceDto.AsObject>;
  };
}

export class CreateVolumeRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): CreateVolumeRequest;
  hasTarget(): boolean;
  clearTarget(): CreateVolumeRequest;

  getWorkspaceId(): string;
  setWorkspaceId(value: string): CreateVolumeRequest;

  getName(): string;
  setName(value: string): CreateVolumeRequest;

  getBasePath(): string;
  setBasePath(value: string): CreateVolumeRequest;

  getMountPoint(): string;
  setMountPoint(value: string): CreateVolumeRequest;

  getBlockSize(): number;
  setBlockSize(value: number): CreateVolumeRequest;

  getBlocks(): number;
  setBlocks(value: number): CreateVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateVolumeRequest): CreateVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: CreateVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateVolumeRequest;
  static deserializeBinaryFromReader(message: CreateVolumeRequest, reader: jspb.BinaryReader): CreateVolumeRequest;
}

export namespace CreateVolumeRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    workspaceId: string;
    name: string;
    basePath: string;
    mountPoint: string;
    blockSize: number;
    blocks: number;
  };
}

export class ResizeVolumeRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ResizeVolumeRequest;
  hasTarget(): boolean;
  clearTarget(): ResizeVolumeRequest;

  getName(): string;
  setName(value: string): ResizeVolumeRequest;

  getBlocks(): number;
  setBlocks(value: number): ResizeVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResizeVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResizeVolumeRequest): ResizeVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: ResizeVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResizeVolumeRequest;
  static deserializeBinaryFromReader(message: ResizeVolumeRequest, reader: jspb.BinaryReader): ResizeVolumeRequest;
}

export namespace ResizeVolumeRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    name: string;
    blocks: number;
  };
}

export class GetVolumesByWorkspaceResponse extends jspb.Message {
  getStatus(): VhdOperatorStatus;
  setStatus(value: VhdOperatorStatus): GetVolumesByWorkspaceResponse;

  getVolumesList(): Array<WorkspaceVolume>;
  setVolumesList(value: Array<WorkspaceVolume>): GetVolumesByWorkspaceResponse;
  clearVolumesList(): GetVolumesByWorkspaceResponse;
  addVolumes(value?: WorkspaceVolume, index?: number): WorkspaceVolume;

  getErrorMessage(): string;
  setErrorMessage(value: string): GetVolumesByWorkspaceResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GetVolumesByWorkspaceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumesByWorkspaceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumesByWorkspaceResponse): GetVolumesByWorkspaceResponse.AsObject;
  static serializeBinaryToWriter(message: GetVolumesByWorkspaceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumesByWorkspaceResponse;
  static deserializeBinaryFromReader(message: GetVolumesByWorkspaceResponse, reader: jspb.BinaryReader): GetVolumesByWorkspaceResponse;
}

export namespace GetVolumesByWorkspaceResponse {
  export type AsObject = {
    status: VhdOperatorStatus;
    volumesList: Array<WorkspaceVolume.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GetVolumeByWorkspaceResponse extends jspb.Message {
  getStatus(): VhdOperatorStatus;
  setStatus(value: VhdOperatorStatus): GetVolumeByWorkspaceResponse;

  getVolume(): WorkspaceVolume | undefined;
  setVolume(value?: WorkspaceVolume): GetVolumeByWorkspaceResponse;
  hasVolume(): boolean;
  clearVolume(): GetVolumeByWorkspaceResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): GetVolumeByWorkspaceResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GetVolumeByWorkspaceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumeByWorkspaceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumeByWorkspaceResponse): GetVolumeByWorkspaceResponse.AsObject;
  static serializeBinaryToWriter(message: GetVolumeByWorkspaceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumeByWorkspaceResponse;
  static deserializeBinaryFromReader(message: GetVolumeByWorkspaceResponse, reader: jspb.BinaryReader): GetVolumeByWorkspaceResponse;
}

export namespace GetVolumeByWorkspaceResponse {
  export type AsObject = {
    status: VhdOperatorStatus;
    volume?: WorkspaceVolume.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class VhdOperationResponse extends jspb.Message {
  getStatus(): VhdOperatorStatus;
  setStatus(value: VhdOperatorStatus): VhdOperationResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): VhdOperationResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): VhdOperationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdOperationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VhdOperationResponse): VhdOperationResponse.AsObject;
  static serializeBinaryToWriter(message: VhdOperationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdOperationResponse;
  static deserializeBinaryFromReader(message: VhdOperationResponse, reader: jspb.BinaryReader): VhdOperationResponse;
}

export namespace VhdOperationResponse {
  export type AsObject = {
    status: VhdOperatorStatus;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }
}

export class VolumesResponse extends jspb.Message {
  getStatus(): VhdOperatorStatus;
  setStatus(value: VhdOperatorStatus): VolumesResponse;

  getVolumesList(): Array<common_workspace_pb.VolumeDto>;
  setVolumesList(value: Array<common_workspace_pb.VolumeDto>): VolumesResponse;
  clearVolumesList(): VolumesResponse;
  addVolumes(value?: common_workspace_pb.VolumeDto, index?: number): common_workspace_pb.VolumeDto;

  getErrorMessage(): string;
  setErrorMessage(value: string): VolumesResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): VolumesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VolumesResponse): VolumesResponse.AsObject;
  static serializeBinaryToWriter(message: VolumesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumesResponse;
  static deserializeBinaryFromReader(message: VolumesResponse, reader: jspb.BinaryReader): VolumesResponse;
}

export namespace VolumesResponse {
  export type AsObject = {
    status: VhdOperatorStatus;
    volumesList: Array<common_workspace_pb.VolumeDto.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class VolumeResponse extends jspb.Message {
  getStatus(): VhdOperatorStatus;
  setStatus(value: VhdOperatorStatus): VolumeResponse;

  getVolume(): common_workspace_pb.VolumeDto | undefined;
  setVolume(value?: common_workspace_pb.VolumeDto): VolumeResponse;
  hasVolume(): boolean;
  clearVolume(): VolumeResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): VolumeResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): VolumeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VolumeResponse): VolumeResponse.AsObject;
  static serializeBinaryToWriter(message: VolumeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumeResponse;
  static deserializeBinaryFromReader(message: VolumeResponse, reader: jspb.BinaryReader): VolumeResponse;
}

export namespace VolumeResponse {
  export type AsObject = {
    status: VhdOperatorStatus;
    volume?: common_workspace_pb.VolumeDto.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class WorkspaceVolume extends jspb.Message {
  getId(): string;
  setId(value: string): WorkspaceVolume;

  getWorkspaceId(): string;
  setWorkspaceId(value: string): WorkspaceVolume;

  getName(): string;
  setName(value: string): WorkspaceVolume;

  getMountPoint(): string;
  setMountPoint(value: string): WorkspaceVolume;

  getDesiredSizeMb(): number;
  setDesiredSizeMb(value: number): WorkspaceVolume;

  getActualSizeMb(): number;
  setActualSizeMb(value: number): WorkspaceVolume;

  getStatus(): string;
  setStatus(value: string): WorkspaceVolume;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceVolume.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceVolume): WorkspaceVolume.AsObject;
  static serializeBinaryToWriter(message: WorkspaceVolume, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceVolume;
  static deserializeBinaryFromReader(message: WorkspaceVolume, reader: jspb.BinaryReader): WorkspaceVolume;
}

export namespace WorkspaceVolume {
  export type AsObject = {
    id: string;
    workspaceId: string;
    name: string;
    mountPoint: string;
    desiredSizeMb: number;
    actualSizeMb: number;
    status: string;
  };
}

export enum VhdOperatorStatus {
  OK = 0,
  ERROR = 1,
}
