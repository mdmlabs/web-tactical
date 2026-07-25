import * as jspb from 'google-protobuf'

import * as common_workspace_pb from '../common/workspace_pb'; // proto import: "common/workspace.proto"


export class GetVolumesRequest extends jspb.Message {
  getOnlyMounted(): boolean;
  setOnlyMounted(value: boolean): GetVolumesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumesRequest): GetVolumesRequest.AsObject;
  static serializeBinaryToWriter(message: GetVolumesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumesRequest;
  static deserializeBinaryFromReader(message: GetVolumesRequest, reader: jspb.BinaryReader): GetVolumesRequest;
}

export namespace GetVolumesRequest {
  export type AsObject = {
    onlyMounted: boolean;
  };
}

export class NameRequest extends jspb.Message {
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
    name: string;
  };
}

export class CreateVolumeRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateVolumeRequest;

  getBasepath(): string;
  setBasepath(value: string): CreateVolumeRequest;

  getMountpoint(): string;
  setMountpoint(value: string): CreateVolumeRequest;

  getBlocksize(): number;
  setBlocksize(value: number): CreateVolumeRequest;

  getBlocks(): number;
  setBlocks(value: number): CreateVolumeRequest;

  getOverwrite(): boolean;
  setOverwrite(value: boolean): CreateVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateVolumeRequest): CreateVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: CreateVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateVolumeRequest;
  static deserializeBinaryFromReader(message: CreateVolumeRequest, reader: jspb.BinaryReader): CreateVolumeRequest;
}

export namespace CreateVolumeRequest {
  export type AsObject = {
    name: string;
    basepath: string;
    mountpoint: string;
    blocksize: number;
    blocks: number;
    overwrite: boolean;
  };
}

export class ResizeRequest extends jspb.Message {
  getName(): string;
  setName(value: string): ResizeRequest;

  getNewBlocks(): number;
  setNewBlocks(value: number): ResizeRequest;
  hasNewBlocks(): boolean;
  clearNewBlocks(): ResizeRequest;

  getNewSizeMb(): number;
  setNewSizeMb(value: number): ResizeRequest;
  hasNewSizeMb(): boolean;
  clearNewSizeMb(): ResizeRequest;

  getModeCase(): ResizeRequest.ModeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResizeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResizeRequest): ResizeRequest.AsObject;
  static serializeBinaryToWriter(message: ResizeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResizeRequest;
  static deserializeBinaryFromReader(message: ResizeRequest, reader: jspb.BinaryReader): ResizeRequest;
}

export namespace ResizeRequest {
  export type AsObject = {
    name: string;
    newBlocks?: number;
    newSizeMb?: number;
  };

  export enum ModeCase {
    MODE_NOT_SET = 0,
    NEW_BLOCKS = 2,
    NEW_SIZE_MB = 3,
  }
}

export class UpdateRequest extends jspb.Message {
  getName(): string;
  setName(value: string): UpdateRequest;

  getMountpoint(): string;
  setMountpoint(value: string): UpdateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRequest): UpdateRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRequest;
  static deserializeBinaryFromReader(message: UpdateRequest, reader: jspb.BinaryReader): UpdateRequest;
}

export namespace UpdateRequest {
  export type AsObject = {
    name: string;
    mountpoint: string;
  };
}

export class OperationResult extends jspb.Message {
  getStatus(): OperationStatus;
  setStatus(value: OperationStatus): OperationResult;

  getError(): string;
  setError(value: string): OperationResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationResult.AsObject;
  static toObject(includeInstance: boolean, msg: OperationResult): OperationResult.AsObject;
  static serializeBinaryToWriter(message: OperationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationResult;
  static deserializeBinaryFromReader(message: OperationResult, reader: jspb.BinaryReader): OperationResult;
}

export namespace OperationResult {
  export type AsObject = {
    status: OperationStatus;
    error: string;
  };
}

export class VolumeList extends jspb.Message {
  getVolumesList(): Array<common_workspace_pb.VolumeDto>;
  setVolumesList(value: Array<common_workspace_pb.VolumeDto>): VolumeList;
  clearVolumesList(): VolumeList;
  addVolumes(value?: common_workspace_pb.VolumeDto, index?: number): common_workspace_pb.VolumeDto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VolumeList.AsObject;
  static toObject(includeInstance: boolean, msg: VolumeList): VolumeList.AsObject;
  static serializeBinaryToWriter(message: VolumeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VolumeList;
  static deserializeBinaryFromReader(message: VolumeList, reader: jspb.BinaryReader): VolumeList;
}

export namespace VolumeList {
  export type AsObject = {
    volumesList: Array<common_workspace_pb.VolumeDto.AsObject>;
  };
}

export enum OperationStatus {
  OK = 0,
  NOT_FOUND = 1,
  ALREADY_EXISTS = 2,
  INVALID_ARGUMENT = 3,
  FAILED_PRECONDITION = 4,
  INTERNAL_ERROR = 5,
}
