import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as common_workspace_pb from '../common/workspace_pb'; // proto import: "common/workspace.proto"


export class VhdAgentMessage extends jspb.Message {
  getHello(): VhdAgentHello | undefined;
  setHello(value?: VhdAgentHello): VhdAgentMessage;
  hasHello(): boolean;
  clearHello(): VhdAgentMessage;

  getAccepted(): VhdCommandAccepted | undefined;
  setAccepted(value?: VhdCommandAccepted): VhdAgentMessage;
  hasAccepted(): boolean;
  clearAccepted(): VhdAgentMessage;

  getCompleted(): VhdCommandCompleted | undefined;
  setCompleted(value?: VhdCommandCompleted): VhdAgentMessage;
  hasCompleted(): boolean;
  clearCompleted(): VhdAgentMessage;

  getVolumesResult(): VhdVolumesResult | undefined;
  setVolumesResult(value?: VhdVolumesResult): VhdAgentMessage;
  hasVolumesResult(): boolean;
  clearVolumesResult(): VhdAgentMessage;

  getVolumeResult(): VhdVolumeResult | undefined;
  setVolumeResult(value?: VhdVolumeResult): VhdAgentMessage;
  hasVolumeResult(): boolean;
  clearVolumeResult(): VhdAgentMessage;

  getHeartbeat(): VhdAgentHeartbeat | undefined;
  setHeartbeat(value?: VhdAgentHeartbeat): VhdAgentMessage;
  hasHeartbeat(): boolean;
  clearHeartbeat(): VhdAgentMessage;

  getPayloadCase(): VhdAgentMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdAgentMessage.AsObject;
  static toObject(includeInstance: boolean, msg: VhdAgentMessage): VhdAgentMessage.AsObject;
  static serializeBinaryToWriter(message: VhdAgentMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdAgentMessage;
  static deserializeBinaryFromReader(message: VhdAgentMessage, reader: jspb.BinaryReader): VhdAgentMessage;
}

export namespace VhdAgentMessage {
  export type AsObject = {
    hello?: VhdAgentHello.AsObject;
    accepted?: VhdCommandAccepted.AsObject;
    completed?: VhdCommandCompleted.AsObject;
    volumesResult?: VhdVolumesResult.AsObject;
    volumeResult?: VhdVolumeResult.AsObject;
    heartbeat?: VhdAgentHeartbeat.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    HELLO = 1,
    ACCEPTED = 2,
    COMPLETED = 3,
    VOLUMES_RESULT = 4,
    VOLUME_RESULT = 5,
    HEARTBEAT = 6,
  }
}

export class VhdMasterMessage extends jspb.Message {
  getCreate(): CreateVolumeCommand | undefined;
  setCreate(value?: CreateVolumeCommand): VhdMasterMessage;
  hasCreate(): boolean;
  clearCreate(): VhdMasterMessage;

  getMount(): MountVolumeCommand | undefined;
  setMount(value?: MountVolumeCommand): VhdMasterMessage;
  hasMount(): boolean;
  clearMount(): VhdMasterMessage;

  getUnmount(): UnmountVolumeCommand | undefined;
  setUnmount(value?: UnmountVolumeCommand): VhdMasterMessage;
  hasUnmount(): boolean;
  clearUnmount(): VhdMasterMessage;

  getDelete(): DeleteVolumeCommand | undefined;
  setDelete(value?: DeleteVolumeCommand): VhdMasterMessage;
  hasDelete(): boolean;
  clearDelete(): VhdMasterMessage;

  getResize(): ResizeVolumeCommand | undefined;
  setResize(value?: ResizeVolumeCommand): VhdMasterMessage;
  hasResize(): boolean;
  clearResize(): VhdMasterMessage;

  getGetVolumes(): GetVolumesCommand | undefined;
  setGetVolumes(value?: GetVolumesCommand): VhdMasterMessage;
  hasGetVolumes(): boolean;
  clearGetVolumes(): VhdMasterMessage;

  getGetVolume(): GetVolumeCommand | undefined;
  setGetVolume(value?: GetVolumeCommand): VhdMasterMessage;
  hasGetVolume(): boolean;
  clearGetVolume(): VhdMasterMessage;

  getPayloadCase(): VhdMasterMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdMasterMessage.AsObject;
  static toObject(includeInstance: boolean, msg: VhdMasterMessage): VhdMasterMessage.AsObject;
  static serializeBinaryToWriter(message: VhdMasterMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdMasterMessage;
  static deserializeBinaryFromReader(message: VhdMasterMessage, reader: jspb.BinaryReader): VhdMasterMessage;
}

export namespace VhdMasterMessage {
  export type AsObject = {
    create?: CreateVolumeCommand.AsObject;
    mount?: MountVolumeCommand.AsObject;
    unmount?: UnmountVolumeCommand.AsObject;
    pb_delete?: DeleteVolumeCommand.AsObject;
    resize?: ResizeVolumeCommand.AsObject;
    getVolumes?: GetVolumesCommand.AsObject;
    getVolume?: GetVolumeCommand.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    CREATE = 1,
    MOUNT = 2,
    UNMOUNT = 3,
    DELETE = 4,
    RESIZE = 5,
    GET_VOLUMES = 6,
    GET_VOLUME = 7,
  }
}

export class CreateVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): CreateVolumeCommand;

  getName(): string;
  setName(value: string): CreateVolumeCommand;

  getBasePath(): string;
  setBasePath(value: string): CreateVolumeCommand;

  getMountPoint(): string;
  setMountPoint(value: string): CreateVolumeCommand;

  getBlockSize(): number;
  setBlockSize(value: number): CreateVolumeCommand;

  getBlocks(): number;
  setBlocks(value: number): CreateVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: CreateVolumeCommand): CreateVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: CreateVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateVolumeCommand;
  static deserializeBinaryFromReader(message: CreateVolumeCommand, reader: jspb.BinaryReader): CreateVolumeCommand;
}

export namespace CreateVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
    basePath: string;
    mountPoint: string;
    blockSize: number;
    blocks: number;
  };
}

export class MountVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): MountVolumeCommand;

  getName(): string;
  setName(value: string): MountVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MountVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: MountVolumeCommand): MountVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: MountVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MountVolumeCommand;
  static deserializeBinaryFromReader(message: MountVolumeCommand, reader: jspb.BinaryReader): MountVolumeCommand;
}

export namespace MountVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
  };
}

export class UnmountVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): UnmountVolumeCommand;

  getName(): string;
  setName(value: string): UnmountVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnmountVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UnmountVolumeCommand): UnmountVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: UnmountVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnmountVolumeCommand;
  static deserializeBinaryFromReader(message: UnmountVolumeCommand, reader: jspb.BinaryReader): UnmountVolumeCommand;
}

export namespace UnmountVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
  };
}

export class DeleteVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): DeleteVolumeCommand;

  getName(): string;
  setName(value: string): DeleteVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteVolumeCommand): DeleteVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: DeleteVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteVolumeCommand;
  static deserializeBinaryFromReader(message: DeleteVolumeCommand, reader: jspb.BinaryReader): DeleteVolumeCommand;
}

export namespace DeleteVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
  };
}

export class ResizeVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): ResizeVolumeCommand;

  getName(): string;
  setName(value: string): ResizeVolumeCommand;

  getBlocks(): number;
  setBlocks(value: number): ResizeVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResizeVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ResizeVolumeCommand): ResizeVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: ResizeVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResizeVolumeCommand;
  static deserializeBinaryFromReader(message: ResizeVolumeCommand, reader: jspb.BinaryReader): ResizeVolumeCommand;
}

export namespace ResizeVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
    blocks: number;
  };
}

export class GetVolumesCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetVolumesCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumesCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumesCommand): GetVolumesCommand.AsObject;
  static serializeBinaryToWriter(message: GetVolumesCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumesCommand;
  static deserializeBinaryFromReader(message: GetVolumesCommand, reader: jspb.BinaryReader): GetVolumesCommand;
}

export namespace GetVolumesCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class GetVolumeCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetVolumeCommand;

  getName(): string;
  setName(value: string): GetVolumeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetVolumeCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetVolumeCommand): GetVolumeCommand.AsObject;
  static serializeBinaryToWriter(message: GetVolumeCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetVolumeCommand;
  static deserializeBinaryFromReader(message: GetVolumeCommand, reader: jspb.BinaryReader): GetVolumeCommand;
}

export namespace GetVolumeCommand {
  export type AsObject = {
    commandId: string;
    name: string;
  };
}

export class VhdCommandAccepted extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): VhdCommandAccepted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdCommandAccepted.AsObject;
  static toObject(includeInstance: boolean, msg: VhdCommandAccepted): VhdCommandAccepted.AsObject;
  static serializeBinaryToWriter(message: VhdCommandAccepted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdCommandAccepted;
  static deserializeBinaryFromReader(message: VhdCommandAccepted, reader: jspb.BinaryReader): VhdCommandAccepted;
}

export namespace VhdCommandAccepted {
  export type AsObject = {
    commandId: string;
  };
}

export class VhdCommandCompleted extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): VhdCommandCompleted;

  getStatus(): VhdResponseStatus;
  setStatus(value: VhdResponseStatus): VhdCommandCompleted;

  getErrorMessage(): string;
  setErrorMessage(value: string): VhdCommandCompleted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdCommandCompleted.AsObject;
  static toObject(includeInstance: boolean, msg: VhdCommandCompleted): VhdCommandCompleted.AsObject;
  static serializeBinaryToWriter(message: VhdCommandCompleted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdCommandCompleted;
  static deserializeBinaryFromReader(message: VhdCommandCompleted, reader: jspb.BinaryReader): VhdCommandCompleted;
}

export namespace VhdCommandCompleted {
  export type AsObject = {
    commandId: string;
    status: VhdResponseStatus;
    errorMessage: string;
  };
}

export class VhdVolumesResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): VhdVolumesResult;

  getStatus(): VhdResponseStatus;
  setStatus(value: VhdResponseStatus): VhdVolumesResult;

  getVolumesList(): Array<common_workspace_pb.VolumeDto>;
  setVolumesList(value: Array<common_workspace_pb.VolumeDto>): VhdVolumesResult;
  clearVolumesList(): VhdVolumesResult;
  addVolumes(value?: common_workspace_pb.VolumeDto, index?: number): common_workspace_pb.VolumeDto;

  getErrorMessage(): string;
  setErrorMessage(value: string): VhdVolumesResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdVolumesResult.AsObject;
  static toObject(includeInstance: boolean, msg: VhdVolumesResult): VhdVolumesResult.AsObject;
  static serializeBinaryToWriter(message: VhdVolumesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdVolumesResult;
  static deserializeBinaryFromReader(message: VhdVolumesResult, reader: jspb.BinaryReader): VhdVolumesResult;
}

export namespace VhdVolumesResult {
  export type AsObject = {
    commandId: string;
    status: VhdResponseStatus;
    volumesList: Array<common_workspace_pb.VolumeDto.AsObject>;
    errorMessage: string;
  };
}

export class VhdVolumeResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): VhdVolumeResult;

  getStatus(): VhdResponseStatus;
  setStatus(value: VhdResponseStatus): VhdVolumeResult;

  getVolume(): common_workspace_pb.VolumeDto | undefined;
  setVolume(value?: common_workspace_pb.VolumeDto): VhdVolumeResult;
  hasVolume(): boolean;
  clearVolume(): VhdVolumeResult;

  getErrorMessage(): string;
  setErrorMessage(value: string): VhdVolumeResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdVolumeResult.AsObject;
  static toObject(includeInstance: boolean, msg: VhdVolumeResult): VhdVolumeResult.AsObject;
  static serializeBinaryToWriter(message: VhdVolumeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdVolumeResult;
  static deserializeBinaryFromReader(message: VhdVolumeResult, reader: jspb.BinaryReader): VhdVolumeResult;
}

export namespace VhdVolumeResult {
  export type AsObject = {
    commandId: string;
    status: VhdResponseStatus;
    volume?: common_workspace_pb.VolumeDto.AsObject;
    errorMessage: string;
  };
}

export class VhdAgentHello extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): VhdAgentHello;

  getHostName(): string;
  setHostName(value: string): VhdAgentHello;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdAgentHello.AsObject;
  static toObject(includeInstance: boolean, msg: VhdAgentHello): VhdAgentHello.AsObject;
  static serializeBinaryToWriter(message: VhdAgentHello, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdAgentHello;
  static deserializeBinaryFromReader(message: VhdAgentHello, reader: jspb.BinaryReader): VhdAgentHello;
}

export namespace VhdAgentHello {
  export type AsObject = {
    agentId: string;
    hostName: string;
  };
}

export class VhdAgentHeartbeat extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): VhdAgentHeartbeat;

  getUtcTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUtcTime(value?: google_protobuf_timestamp_pb.Timestamp): VhdAgentHeartbeat;
  hasUtcTime(): boolean;
  clearUtcTime(): VhdAgentHeartbeat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VhdAgentHeartbeat.AsObject;
  static toObject(includeInstance: boolean, msg: VhdAgentHeartbeat): VhdAgentHeartbeat.AsObject;
  static serializeBinaryToWriter(message: VhdAgentHeartbeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VhdAgentHeartbeat;
  static deserializeBinaryFromReader(message: VhdAgentHeartbeat, reader: jspb.BinaryReader): VhdAgentHeartbeat;
}

export namespace VhdAgentHeartbeat {
  export type AsObject = {
    agentId: string;
    utcTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export enum VhdResponseStatus {
  OK = 0,
  ERROR = 1,
}
