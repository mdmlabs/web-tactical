import * as jspb from 'google-protobuf'

import * as common_node_pb from './common/node_pb'; // proto import: "common/node.proto"
import * as common_policy_pb from './common/policy_pb'; // proto import: "common/policy.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class HeartbeatRequest extends jspb.Message {
  getNodeid(): string;
  setNodeid(value: string): HeartbeatRequest;

  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): HeartbeatRequest;
  hasTimestamp(): boolean;
  clearTimestamp(): HeartbeatRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeartbeatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HeartbeatRequest): HeartbeatRequest.AsObject;
  static serializeBinaryToWriter(message: HeartbeatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeartbeatRequest;
  static deserializeBinaryFromReader(message: HeartbeatRequest, reader: jspb.BinaryReader): HeartbeatRequest;
}

export namespace HeartbeatRequest {
  export type AsObject = {
    nodeid: string;
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class HeartbeatResponse extends jspb.Message {
  getServertime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setServertime(value?: google_protobuf_timestamp_pb.Timestamp): HeartbeatResponse;
  hasServertime(): boolean;
  clearServertime(): HeartbeatResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeartbeatResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HeartbeatResponse): HeartbeatResponse.AsObject;
  static serializeBinaryToWriter(message: HeartbeatResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeartbeatResponse;
  static deserializeBinaryFromReader(message: HeartbeatResponse, reader: jspb.BinaryReader): HeartbeatResponse;
}

export namespace HeartbeatResponse {
  export type AsObject = {
    servertime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class NodeInfoRequest extends jspb.Message {
  getNodeid(): string;
  setNodeid(value: string): NodeInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NodeInfoRequest): NodeInfoRequest.AsObject;
  static serializeBinaryToWriter(message: NodeInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeInfoRequest;
  static deserializeBinaryFromReader(message: NodeInfoRequest, reader: jspb.BinaryReader): NodeInfoRequest;
}

export namespace NodeInfoRequest {
  export type AsObject = {
    nodeid: string;
  };
}

export class NodeInfoResponse extends jspb.Message {
  getInfo(): common_node_pb.NodeFullInfo | undefined;
  setInfo(value?: common_node_pb.NodeFullInfo): NodeInfoResponse;
  hasInfo(): boolean;
  clearInfo(): NodeInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: NodeInfoResponse): NodeInfoResponse.AsObject;
  static serializeBinaryToWriter(message: NodeInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeInfoResponse;
  static deserializeBinaryFromReader(message: NodeInfoResponse, reader: jspb.BinaryReader): NodeInfoResponse;
}

export namespace NodeInfoResponse {
  export type AsObject = {
    info?: common_node_pb.NodeFullInfo.AsObject;
  };
}

export class PolicyElement extends jspb.Message {
  getIdName(): string;
  setIdName(value: string): PolicyElement;

  getType(): string;
  setType(value: string): PolicyElement;

  getValueName(): string;
  setValueName(value: string): PolicyElement;

  getMaxLength(): number;
  setMaxLength(value: number): PolicyElement;

  getRequired(): boolean;
  setRequired(value: boolean): PolicyElement;

  getClientExtension(): string;
  setClientExtension(value: string): PolicyElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyElement.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyElement): PolicyElement.AsObject;
  static serializeBinaryToWriter(message: PolicyElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyElement;
  static deserializeBinaryFromReader(message: PolicyElement, reader: jspb.BinaryReader): PolicyElement;
}

export namespace PolicyElement {
  export type AsObject = {
    idName: string;
    type: string;
    valueName: string;
    maxLength: number;
    required: boolean;
    clientExtension: string;
  };
}

export class PolicyDescriptor extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): PolicyDescriptor;

  getName(): string;
  setName(value: string): PolicyDescriptor;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): PolicyDescriptor;

  getRegistryKey(): string;
  setRegistryKey(value: string): PolicyDescriptor;

  getValueName(): string;
  setValueName(value: string): PolicyDescriptor;

  getEnabledValue(): string;
  setEnabledValue(value: string): PolicyDescriptor;

  getDisabledValue(): string;
  setDisabledValue(value: string): PolicyDescriptor;

  getSupportedOnRef(): string;
  setSupportedOnRef(value: string): PolicyDescriptor;

  getParentCategory(): string;
  setParentCategory(value: string): PolicyDescriptor;

  getElementsList(): Array<PolicyElement>;
  setElementsList(value: Array<PolicyElement>): PolicyDescriptor;
  clearElementsList(): PolicyDescriptor;
  addElements(value?: PolicyElement, index?: number): PolicyElement;

  getRequiredCapabilitiesList(): Array<string>;
  setRequiredCapabilitiesList(value: Array<string>): PolicyDescriptor;
  clearRequiredCapabilitiesList(): PolicyDescriptor;
  addRequiredCapabilities(value: string, index?: number): PolicyDescriptor;

  getRequiredHardwareList(): Array<string>;
  setRequiredHardwareList(value: Array<string>): PolicyDescriptor;
  clearRequiredHardwareList(): PolicyDescriptor;
  addRequiredHardware(value: string, index?: number): PolicyDescriptor;

  getAdmxFileHashesList(): Array<string>;
  setAdmxFileHashesList(value: Array<string>): PolicyDescriptor;
  clearAdmxFileHashesList(): PolicyDescriptor;
  addAdmxFileHashes(value: string, index?: number): PolicyDescriptor;

  getRevision(): number;
  setRevision(value: number): PolicyDescriptor;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyDescriptor.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyDescriptor): PolicyDescriptor.AsObject;
  static serializeBinaryToWriter(message: PolicyDescriptor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyDescriptor;
  static deserializeBinaryFromReader(message: PolicyDescriptor, reader: jspb.BinaryReader): PolicyDescriptor;
}

export namespace PolicyDescriptor {
  export type AsObject = {
    policyHash: string;
    name: string;
    scope: PolicyScope;
    registryKey: string;
    valueName: string;
    enabledValue: string;
    disabledValue: string;
    supportedOnRef: string;
    parentCategory: string;
    elementsList: Array<PolicyElement.AsObject>;
    requiredCapabilitiesList: Array<string>;
    requiredHardwareList: Array<string>;
    admxFileHashesList: Array<string>;
    revision: number;
  };
}

export class AdmxFileDescriptor extends jspb.Message {
  getFileHash(): string;
  setFileHash(value: string): AdmxFileDescriptor;

  getFileName(): string;
  setFileName(value: string): AdmxFileDescriptor;

  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): AdmxFileDescriptor;

  getRevision(): number;
  setRevision(value: number): AdmxFileDescriptor;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdmxFileDescriptor.AsObject;
  static toObject(includeInstance: boolean, msg: AdmxFileDescriptor): AdmxFileDescriptor.AsObject;
  static serializeBinaryToWriter(message: AdmxFileDescriptor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdmxFileDescriptor;
  static deserializeBinaryFromReader(message: AdmxFileDescriptor, reader: jspb.BinaryReader): AdmxFileDescriptor;
}

export namespace AdmxFileDescriptor {
  export type AsObject = {
    fileHash: string;
    fileName: string;
    content: Uint8Array | string;
    revision: number;
  };
}

export class PolicyStateReportRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): PolicyStateReportRequest;

  getRevision(): number;
  setRevision(value: number): PolicyStateReportRequest;

  getItemsList(): Array<PolicyStateItem>;
  setItemsList(value: Array<PolicyStateItem>): PolicyStateReportRequest;
  clearItemsList(): PolicyStateReportRequest;
  addItems(value?: PolicyStateItem, index?: number): PolicyStateItem;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): PolicyStateReportRequest;
  hasSelection(): boolean;
  clearSelection(): PolicyStateReportRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyStateReportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyStateReportRequest): PolicyStateReportRequest.AsObject;
  static serializeBinaryToWriter(message: PolicyStateReportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyStateReportRequest;
  static deserializeBinaryFromReader(message: PolicyStateReportRequest, reader: jspb.BinaryReader): PolicyStateReportRequest;
}

export namespace PolicyStateReportRequest {
  export type AsObject = {
    agentId: string;
    revision: number;
    itemsList: Array<PolicyStateItem.AsObject>;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class PolicyStateItem extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): PolicyStateItem;

  getUserSid(): string;
  setUserSid(value: string): PolicyStateItem;

  getChildsList(): Array<PolicyStateItem>;
  setChildsList(value: Array<PolicyStateItem>): PolicyStateItem;
  clearChildsList(): PolicyStateItem;
  addChilds(value?: PolicyStateItem, index?: number): PolicyStateItem;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): PolicyStateItem;
  hasSelection(): boolean;
  clearSelection(): PolicyStateItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyStateItem.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyStateItem): PolicyStateItem.AsObject;
  static serializeBinaryToWriter(message: PolicyStateItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyStateItem;
  static deserializeBinaryFromReader(message: PolicyStateItem, reader: jspb.BinaryReader): PolicyStateItem;
}

export namespace PolicyStateItem {
  export type AsObject = {
    policyHash: string;
    userSid: string;
    childsList: Array<PolicyStateItem.AsObject>;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class PolicySyncRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): PolicySyncRequest;

  getLastKnownRevision(): number;
  setLastKnownRevision(value: number): PolicySyncRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicySyncRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PolicySyncRequest): PolicySyncRequest.AsObject;
  static serializeBinaryToWriter(message: PolicySyncRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicySyncRequest;
  static deserializeBinaryFromReader(message: PolicySyncRequest, reader: jspb.BinaryReader): PolicySyncRequest;
}

export namespace PolicySyncRequest {
  export type AsObject = {
    agentId: string;
    lastKnownRevision: number;
  };
}

export class PolicySyncInit extends jspb.Message {
  getMode(): PolicySyncMode;
  setMode(value: PolicySyncMode): PolicySyncInit;

  getMasterRevision(): number;
  setMasterRevision(value: number): PolicySyncInit;

  getSha256(): string;
  setSha256(value: string): PolicySyncInit;

  getPayloadSize(): number;
  setPayloadSize(value: number): PolicySyncInit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicySyncInit.AsObject;
  static toObject(includeInstance: boolean, msg: PolicySyncInit): PolicySyncInit.AsObject;
  static serializeBinaryToWriter(message: PolicySyncInit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicySyncInit;
  static deserializeBinaryFromReader(message: PolicySyncInit, reader: jspb.BinaryReader): PolicySyncInit;
}

export namespace PolicySyncInit {
  export type AsObject = {
    mode: PolicySyncMode;
    masterRevision: number;
    sha256: string;
    payloadSize: number;
  };
}

export class PolicySyncChunk extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): PolicySyncChunk;

  getLast(): boolean;
  setLast(value: boolean): PolicySyncChunk;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicySyncChunk.AsObject;
  static toObject(includeInstance: boolean, msg: PolicySyncChunk): PolicySyncChunk.AsObject;
  static serializeBinaryToWriter(message: PolicySyncChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicySyncChunk;
  static deserializeBinaryFromReader(message: PolicySyncChunk, reader: jspb.BinaryReader): PolicySyncChunk;
}

export namespace PolicySyncChunk {
  export type AsObject = {
    data: Uint8Array | string;
    last: boolean;
  };
}

export class AssigmentsRequestMessage extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AssigmentsRequestMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssigmentsRequestMessage.AsObject;
  static toObject(includeInstance: boolean, msg: AssigmentsRequestMessage): AssigmentsRequestMessage.AsObject;
  static serializeBinaryToWriter(message: AssigmentsRequestMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssigmentsRequestMessage;
  static deserializeBinaryFromReader(message: AssigmentsRequestMessage, reader: jspb.BinaryReader): AssigmentsRequestMessage;
}

export namespace AssigmentsRequestMessage {
  export type AsObject = {
    agentId: string;
  };
}

export class AssigmentsResponse extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AssigmentsResponse;

  getApplyCommandsList(): Array<ApplyPolicyCommand>;
  setApplyCommandsList(value: Array<ApplyPolicyCommand>): AssigmentsResponse;
  clearApplyCommandsList(): AssigmentsResponse;
  addApplyCommands(value?: ApplyPolicyCommand, index?: number): ApplyPolicyCommand;

  getRemoveCommandsList(): Array<RemovePolicyCommand>;
  setRemoveCommandsList(value: Array<RemovePolicyCommand>): AssigmentsResponse;
  clearRemoveCommandsList(): AssigmentsResponse;
  addRemoveCommands(value?: RemovePolicyCommand, index?: number): RemovePolicyCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssigmentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AssigmentsResponse): AssigmentsResponse.AsObject;
  static serializeBinaryToWriter(message: AssigmentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssigmentsResponse;
  static deserializeBinaryFromReader(message: AssigmentsResponse, reader: jspb.BinaryReader): AssigmentsResponse;
}

export namespace AssigmentsResponse {
  export type AsObject = {
    agentId: string;
    applyCommandsList: Array<ApplyPolicyCommand.AsObject>;
    removeCommandsList: Array<RemovePolicyCommand.AsObject>;
  };
}

export class AgentMessage extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AgentMessage;

  getHello(): common_node_pb.NodeFullInfo | undefined;
  setHello(value?: common_node_pb.NodeFullInfo): AgentMessage;
  hasHello(): boolean;
  clearHello(): AgentMessage;

  getStateReport(): PolicyStateReportRequest | undefined;
  setStateReport(value?: PolicyStateReportRequest): AgentMessage;
  hasStateReport(): boolean;
  clearStateReport(): AgentMessage;

  getHeartbeat(): HeartbeatRequest | undefined;
  setHeartbeat(value?: HeartbeatRequest): AgentMessage;
  hasHeartbeat(): boolean;
  clearHeartbeat(): AgentMessage;

  getPayloadCase(): AgentMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentMessage.AsObject;
  static toObject(includeInstance: boolean, msg: AgentMessage): AgentMessage.AsObject;
  static serializeBinaryToWriter(message: AgentMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentMessage;
  static deserializeBinaryFromReader(message: AgentMessage, reader: jspb.BinaryReader): AgentMessage;
}

export namespace AgentMessage {
  export type AsObject = {
    agentId: string;
    hello?: common_node_pb.NodeFullInfo.AsObject;
    stateReport?: PolicyStateReportRequest.AsObject;
    heartbeat?: HeartbeatRequest.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    HELLO = 2,
    STATE_REPORT = 3,
    HEARTBEAT = 4,
  }
}

export class MasterMessage extends jspb.Message {
  getApply(): ApplyPolicyCommand | undefined;
  setApply(value?: ApplyPolicyCommand): MasterMessage;
  hasApply(): boolean;
  clearApply(): MasterMessage;

  getRemove(): RemovePolicyCommand | undefined;
  setRemove(value?: RemovePolicyCommand): MasterMessage;
  hasRemove(): boolean;
  clearRemove(): MasterMessage;

  getSync(): SyncRequired | undefined;
  setSync(value?: SyncRequired): MasterMessage;
  hasSync(): boolean;
  clearSync(): MasterMessage;

  getPayloadCase(): MasterMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MasterMessage.AsObject;
  static toObject(includeInstance: boolean, msg: MasterMessage): MasterMessage.AsObject;
  static serializeBinaryToWriter(message: MasterMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MasterMessage;
  static deserializeBinaryFromReader(message: MasterMessage, reader: jspb.BinaryReader): MasterMessage;
}

export namespace MasterMessage {
  export type AsObject = {
    apply?: ApplyPolicyCommand.AsObject;
    remove?: RemovePolicyCommand.AsObject;
    sync?: SyncRequired.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    APPLY = 1,
    REMOVE = 2,
    SYNC = 3,
  }
}

export class ApplyPolicyCommand extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): ApplyPolicyCommand;

  getRevision(): number;
  setRevision(value: number): ApplyPolicyCommand;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): ApplyPolicyCommand;
  hasSelection(): boolean;
  clearSelection(): ApplyPolicyCommand;

  getUserSid(): string;
  setUserSid(value: string): ApplyPolicyCommand;
  hasUserSid(): boolean;
  clearUserSid(): ApplyPolicyCommand;

  getMachineScope(): boolean;
  setMachineScope(value: boolean): ApplyPolicyCommand;
  hasMachineScope(): boolean;
  clearMachineScope(): ApplyPolicyCommand;

  getTargetCase(): ApplyPolicyCommand.TargetCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyPolicyCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyPolicyCommand): ApplyPolicyCommand.AsObject;
  static serializeBinaryToWriter(message: ApplyPolicyCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyPolicyCommand;
  static deserializeBinaryFromReader(message: ApplyPolicyCommand, reader: jspb.BinaryReader): ApplyPolicyCommand;
}

export namespace ApplyPolicyCommand {
  export type AsObject = {
    policyHash: string;
    revision: number;
    selection?: common_policy_pb.PolicySelection.AsObject;
    userSid?: string;
    machineScope?: boolean;
  };

  export enum TargetCase {
    TARGET_NOT_SET = 0,
    USER_SID = 4,
    MACHINE_SCOPE = 5,
  }
}

export class RemovePolicyCommand extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): RemovePolicyCommand;

  getRevision(): number;
  setRevision(value: number): RemovePolicyCommand;

  getUserSid(): string;
  setUserSid(value: string): RemovePolicyCommand;
  hasUserSid(): boolean;
  clearUserSid(): RemovePolicyCommand;

  getMachineScope(): boolean;
  setMachineScope(value: boolean): RemovePolicyCommand;
  hasMachineScope(): boolean;
  clearMachineScope(): RemovePolicyCommand;

  getTargetCase(): RemovePolicyCommand.TargetCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePolicyCommand.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePolicyCommand): RemovePolicyCommand.AsObject;
  static serializeBinaryToWriter(message: RemovePolicyCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePolicyCommand;
  static deserializeBinaryFromReader(message: RemovePolicyCommand, reader: jspb.BinaryReader): RemovePolicyCommand;
}

export namespace RemovePolicyCommand {
  export type AsObject = {
    policyHash: string;
    revision: number;
    userSid?: string;
    machineScope?: boolean;
  };

  export enum TargetCase {
    TARGET_NOT_SET = 0,
    USER_SID = 3,
    MACHINE_SCOPE = 4,
  }
}

export class SyncRequired extends jspb.Message {
  getMasterRevision(): number;
  setMasterRevision(value: number): SyncRequired;

  getReason(): string;
  setReason(value: string): SyncRequired;
  hasReason(): boolean;
  clearReason(): SyncRequired;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncRequired.AsObject;
  static toObject(includeInstance: boolean, msg: SyncRequired): SyncRequired.AsObject;
  static serializeBinaryToWriter(message: SyncRequired, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncRequired;
  static deserializeBinaryFromReader(message: SyncRequired, reader: jspb.BinaryReader): SyncRequired;
}

export namespace SyncRequired {
  export type AsObject = {
    masterRevision: number;
    reason?: string;
  };

  export enum ReasonCase {
    _REASON_NOT_SET = 0,
    REASON = 2,
  }
}

export enum PolicyScope {
  POLICY_SCOPE_NONE = 0,
  POLICY_SCOPE_USER = 1,
  POLICY_SCOPE_MACHINE = 2,
  POLICY_SCOPE_BOTH = 3,
}
export enum PolicySyncMode {
  SYNC_MODE_NONE = 0,
  SYNC_MODE_SNAPSHOT = 1,
  SYNC_MODE_DIFF = 2,
}
