import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class WorkspaceDto extends jspb.Message {
  getId(): string;
  setId(value: string): WorkspaceDto;

  getName(): string;
  setName(value: string): WorkspaceDto;

  getDescription(): string;
  setDescription(value: string): WorkspaceDto;

  getDesiredState(): WorkspaceDesiredState;
  setDesiredState(value: WorkspaceDesiredState): WorkspaceDto;

  getActualState(): WorkspaceActualState;
  setActualState(value: WorkspaceActualState): WorkspaceDto;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): WorkspaceDto;
  hasCreatedAt(): boolean;
  clearCreatedAt(): WorkspaceDto;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): WorkspaceDto;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): WorkspaceDto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceDto.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceDto): WorkspaceDto.AsObject;
  static serializeBinaryToWriter(message: WorkspaceDto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceDto;
  static deserializeBinaryFromReader(message: WorkspaceDto, reader: jspb.BinaryReader): WorkspaceDto;
}

export namespace WorkspaceDto {
  export type AsObject = {
    id: string;
    name: string;
    description: string;
    desiredState: WorkspaceDesiredState;
    actualState: WorkspaceActualState;
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class VolumeDto extends jspb.Message {
  getName(): string;
  setName(value: string): VolumeDto;

  getBasePath(): string;
  setBasePath(value: string): VolumeDto;

  getMountPoint(): string;
  setMountPoint(value: string): VolumeDto;

  getSizeMb(): number;
  setSizeMb(value: number): VolumeDto;

  getUsedMb(): number;
  setUsedMb(value: number): VolumeDto;

  getFreeMb(): number;
  setFreeMb(value: number): VolumeDto;

  getStatus(): VolumeStatus;
  setStatus(value: VolumeStatus): VolumeDto;

  getExistsOnDisk(): boolean;
  setExistsOnDisk(value: boolean): VolumeDto;

  getHealthy(): boolean;
  setHealthy(value: boolean): VolumeDto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumeDto.AsObject;
  static toObject(includeInstance: boolean, msg: VolumeDto): VolumeDto.AsObject;
  static serializeBinaryToWriter(message: VolumeDto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumeDto;
  static deserializeBinaryFromReader(message: VolumeDto, reader: jspb.BinaryReader): VolumeDto;
}

export namespace VolumeDto {
  export type AsObject = {
    name: string;
    basePath: string;
    mountPoint: string;
    sizeMb: number;
    usedMb: number;
    freeMb: number;
    status: VolumeStatus;
    existsOnDisk: boolean;
    healthy: boolean;
  };
}

export enum WorkspaceDesiredState {
  WORKSPACE_DESIRED_UNKNOWN = 0,
  WORKSPACE_DESIRED_STOPPED = 1,
  WORKSPACE_DESIRED_RUNNING = 2,
}
export enum WorkspaceActualState {
  WORKSPACE_ACTUAL_UNKNOWN = 0,
  WORKSPACE_ACTUAL_STOPPED = 1,
  WORKSPACE_ACTUAL_RUNNING = 2,
  WORKSPACE_ACTUAL_ERROR = 3,
}
export enum VolumeStatus {
  VOLUME_UNKNOWN = 0,
  VOLUME_MOUNTED = 1,
  VOLUME_UNMOUNTED = 2,
}
