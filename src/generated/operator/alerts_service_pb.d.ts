import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class AlertItem extends jspb.Message {
  getId(): number;
  setId(value: number): AlertItem;

  getType(): string;
  setType(value: string): AlertItem;

  getSeverity(): number;
  setSeverity(value: number): AlertItem;

  getStatus(): AlertStatus;
  setStatus(value: AlertStatus): AlertItem;

  getAgentId(): string;
  setAgentId(value: string): AlertItem;

  getUserId(): Uint8Array | string;
  getUserId_asU8(): Uint8Array;
  getUserId_asB64(): string;
  setUserId(value: Uint8Array | string): AlertItem;

  getGroupId(): Uint8Array | string;
  getGroupId_asU8(): Uint8Array;
  getGroupId_asB64(): string;
  setGroupId(value: Uint8Array | string): AlertItem;

  getAgentCategoryId(): number;
  setAgentCategoryId(value: number): AlertItem;

  getPolicyId(): number;
  setPolicyId(value: number): AlertItem;

  getTitle(): string;
  setTitle(value: string): AlertItem;

  getMessage(): string;
  setMessage(value: string): AlertItem;

  getFirstOccurredAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFirstOccurredAt(value?: google_protobuf_timestamp_pb.Timestamp): AlertItem;
  hasFirstOccurredAt(): boolean;
  clearFirstOccurredAt(): AlertItem;

  getLastOccurredAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastOccurredAt(value?: google_protobuf_timestamp_pb.Timestamp): AlertItem;
  hasLastOccurredAt(): boolean;
  clearLastOccurredAt(): AlertItem;

  getOccurrenceCount(): number;
  setOccurrenceCount(value: number): AlertItem;

  getDeduplicationKey(): string;
  setDeduplicationKey(value: string): AlertItem;

  getMetadataJson(): string;
  setMetadataJson(value: string): AlertItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlertItem.AsObject;
  static toObject(includeInstance: boolean, msg: AlertItem): AlertItem.AsObject;
  static serializeBinaryToWriter(message: AlertItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlertItem;
  static deserializeBinaryFromReader(message: AlertItem, reader: jspb.BinaryReader): AlertItem;
}

export namespace AlertItem {
  export type AsObject = {
    id: number;
    type: string;
    severity: number;
    status: AlertStatus;
    agentId: string;
    userId: Uint8Array | string;
    groupId: Uint8Array | string;
    agentCategoryId: number;
    policyId: number;
    title: string;
    message: string;
    firstOccurredAt?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    lastOccurredAt?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    occurrenceCount: number;
    deduplicationKey: string;
    metadataJson: string;
  };
}

export class GetAlertRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetAlertRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAlertRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAlertRequest): GetAlertRequest.AsObject;
  static serializeBinaryToWriter(message: GetAlertRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAlertRequest;
  static deserializeBinaryFromReader(message: GetAlertRequest, reader: jspb.BinaryReader): GetAlertRequest;
}

export namespace GetAlertRequest {
  export type AsObject = {
    id: number;
  };
}

export class ListAlertsRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): ListAlertsRequest;

  getUserId(): Uint8Array | string;
  getUserId_asU8(): Uint8Array;
  getUserId_asB64(): string;
  setUserId(value: Uint8Array | string): ListAlertsRequest;

  getGroupId(): Uint8Array | string;
  getGroupId_asU8(): Uint8Array;
  getGroupId_asB64(): string;
  setGroupId(value: Uint8Array | string): ListAlertsRequest;

  getAgentCategoryId(): number;
  setAgentCategoryId(value: number): ListAlertsRequest;

  getType(): string;
  setType(value: string): ListAlertsRequest;

  getStatus(): AlertStatus;
  setStatus(value: AlertStatus): ListAlertsRequest;

  getOpenOnly(): boolean;
  setOpenOnly(value: boolean): ListAlertsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAlertsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAlertsRequest): ListAlertsRequest.AsObject;
  static serializeBinaryToWriter(message: ListAlertsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAlertsRequest;
  static deserializeBinaryFromReader(message: ListAlertsRequest, reader: jspb.BinaryReader): ListAlertsRequest;
}

export namespace ListAlertsRequest {
  export type AsObject = {
    agentId: string;
    userId: Uint8Array | string;
    groupId: Uint8Array | string;
    agentCategoryId: number;
    type: string;
    status: AlertStatus;
    openOnly: boolean;
  };
}

export class ListAlertsResponse extends jspb.Message {
  getItemsList(): Array<AlertItem>;
  setItemsList(value: Array<AlertItem>): ListAlertsResponse;
  clearItemsList(): ListAlertsResponse;
  addItems(value?: AlertItem, index?: number): AlertItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAlertsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListAlertsResponse): ListAlertsResponse.AsObject;
  static serializeBinaryToWriter(message: ListAlertsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAlertsResponse;
  static deserializeBinaryFromReader(message: ListAlertsResponse, reader: jspb.BinaryReader): ListAlertsResponse;
}

export namespace ListAlertsResponse {
  export type AsObject = {
    itemsList: Array<AlertItem.AsObject>;
  };
}

export class AcknowledgeAlertRequest extends jspb.Message {
  getId(): number;
  setId(value: number): AcknowledgeAlertRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AcknowledgeAlertRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AcknowledgeAlertRequest): AcknowledgeAlertRequest.AsObject;
  static serializeBinaryToWriter(message: AcknowledgeAlertRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AcknowledgeAlertRequest;
  static deserializeBinaryFromReader(message: AcknowledgeAlertRequest, reader: jspb.BinaryReader): AcknowledgeAlertRequest;
}

export namespace AcknowledgeAlertRequest {
  export type AsObject = {
    id: number;
  };
}

export class ResolveAlertRequest extends jspb.Message {
  getId(): number;
  setId(value: number): ResolveAlertRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveAlertRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveAlertRequest): ResolveAlertRequest.AsObject;
  static serializeBinaryToWriter(message: ResolveAlertRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveAlertRequest;
  static deserializeBinaryFromReader(message: ResolveAlertRequest, reader: jspb.BinaryReader): ResolveAlertRequest;
}

export namespace ResolveAlertRequest {
  export type AsObject = {
    id: number;
  };
}

export class CloseAlertRequest extends jspb.Message {
  getId(): number;
  setId(value: number): CloseAlertRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloseAlertRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CloseAlertRequest): CloseAlertRequest.AsObject;
  static serializeBinaryToWriter(message: CloseAlertRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloseAlertRequest;
  static deserializeBinaryFromReader(message: CloseAlertRequest, reader: jspb.BinaryReader): CloseAlertRequest;
}

export namespace CloseAlertRequest {
  export type AsObject = {
    id: number;
  };
}

export enum AlertStatus {
  ALERT_STATUS_UNSPECIFIED = 0,
  ALERT_STATUS_OPEN = 1,
  ALERT_STATUS_ACKNOWLEDGED = 2,
  ALERT_STATUS_RESOLVED = 3,
  ALERT_STATUS_CLOSED = 4,
}
