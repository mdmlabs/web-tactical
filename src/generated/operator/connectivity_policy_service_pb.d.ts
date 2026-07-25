import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class ConnectivityPolicy extends jspb.Message {
  getId(): number;
  setId(value: number): ConnectivityPolicy;

  getTargetType(): ConnectivityTargetType;
  setTargetType(value: ConnectivityTargetType): ConnectivityPolicy;

  getAgentId(): string;
  setAgentId(value: string): ConnectivityPolicy;

  getAgentCategoryId(): number;
  setAgentCategoryId(value: number): ConnectivityPolicy;

  getUserId(): Uint8Array | string;
  getUserId_asU8(): Uint8Array;
  getUserId_asB64(): string;
  setUserId(value: Uint8Array | string): ConnectivityPolicy;

  getUserGroupId(): Uint8Array | string;
  getUserGroupId_asU8(): Uint8Array;
  getUserGroupId_asB64(): string;
  setUserGroupId(value: Uint8Array | string): ConnectivityPolicy;

  getIntervalSeconds(): number;
  setIntervalSeconds(value: number): ConnectivityPolicy;

  getGraceSeconds(): number;
  setGraceSeconds(value: number): ConnectivityPolicy;

  getIsEnabled(): boolean;
  setIsEnabled(value: boolean): ConnectivityPolicy;

  getSeverity(): number;
  setSeverity(value: number): ConnectivityPolicy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectivityPolicy.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectivityPolicy): ConnectivityPolicy.AsObject;
  static serializeBinaryToWriter(message: ConnectivityPolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectivityPolicy;
  static deserializeBinaryFromReader(message: ConnectivityPolicy, reader: jspb.BinaryReader): ConnectivityPolicy;
}

export namespace ConnectivityPolicy {
  export type AsObject = {
    id: number;
    targetType: ConnectivityTargetType;
    agentId: string;
    agentCategoryId: number;
    userId: Uint8Array | string;
    userGroupId: Uint8Array | string;
    intervalSeconds: number;
    graceSeconds: number;
    isEnabled: boolean;
    severity: number;
  };
}

export class GetConnectivityPolicyRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetConnectivityPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConnectivityPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetConnectivityPolicyRequest): GetConnectivityPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: GetConnectivityPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConnectivityPolicyRequest;
  static deserializeBinaryFromReader(message: GetConnectivityPolicyRequest, reader: jspb.BinaryReader): GetConnectivityPolicyRequest;
}

export namespace GetConnectivityPolicyRequest {
  export type AsObject = {
    id: number;
  };
}

export class ListConnectivityPoliciesRequest extends jspb.Message {
  getTargetType(): ConnectivityTargetType;
  setTargetType(value: ConnectivityTargetType): ListConnectivityPoliciesRequest;

  getAgentId(): string;
  setAgentId(value: string): ListConnectivityPoliciesRequest;

  getAgentCategoryId(): number;
  setAgentCategoryId(value: number): ListConnectivityPoliciesRequest;

  getUserId(): Uint8Array | string;
  getUserId_asU8(): Uint8Array;
  getUserId_asB64(): string;
  setUserId(value: Uint8Array | string): ListConnectivityPoliciesRequest;

  getUserGroupId(): Uint8Array | string;
  getUserGroupId_asU8(): Uint8Array;
  getUserGroupId_asB64(): string;
  setUserGroupId(value: Uint8Array | string): ListConnectivityPoliciesRequest;

  getEnabledOnly(): boolean;
  setEnabledOnly(value: boolean): ListConnectivityPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListConnectivityPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListConnectivityPoliciesRequest): ListConnectivityPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: ListConnectivityPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListConnectivityPoliciesRequest;
  static deserializeBinaryFromReader(message: ListConnectivityPoliciesRequest, reader: jspb.BinaryReader): ListConnectivityPoliciesRequest;
}

export namespace ListConnectivityPoliciesRequest {
  export type AsObject = {
    targetType: ConnectivityTargetType;
    agentId: string;
    agentCategoryId: number;
    userId: Uint8Array | string;
    userGroupId: Uint8Array | string;
    enabledOnly: boolean;
  };
}

export class ListConnectivityPoliciesResponse extends jspb.Message {
  getItemsList(): Array<ConnectivityPolicy>;
  setItemsList(value: Array<ConnectivityPolicy>): ListConnectivityPoliciesResponse;
  clearItemsList(): ListConnectivityPoliciesResponse;
  addItems(value?: ConnectivityPolicy, index?: number): ConnectivityPolicy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListConnectivityPoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListConnectivityPoliciesResponse): ListConnectivityPoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: ListConnectivityPoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListConnectivityPoliciesResponse;
  static deserializeBinaryFromReader(message: ListConnectivityPoliciesResponse, reader: jspb.BinaryReader): ListConnectivityPoliciesResponse;
}

export namespace ListConnectivityPoliciesResponse {
  export type AsObject = {
    itemsList: Array<ConnectivityPolicy.AsObject>;
  };
}

export class CreateConnectivityPolicyRequest extends jspb.Message {
  getItem(): ConnectivityPolicy | undefined;
  setItem(value?: ConnectivityPolicy): CreateConnectivityPolicyRequest;
  hasItem(): boolean;
  clearItem(): CreateConnectivityPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateConnectivityPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateConnectivityPolicyRequest): CreateConnectivityPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: CreateConnectivityPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateConnectivityPolicyRequest;
  static deserializeBinaryFromReader(message: CreateConnectivityPolicyRequest, reader: jspb.BinaryReader): CreateConnectivityPolicyRequest;
}

export namespace CreateConnectivityPolicyRequest {
  export type AsObject = {
    item?: ConnectivityPolicy.AsObject;
  };
}

export class UpdateConnectivityPolicyRequest extends jspb.Message {
  getItem(): ConnectivityPolicy | undefined;
  setItem(value?: ConnectivityPolicy): UpdateConnectivityPolicyRequest;
  hasItem(): boolean;
  clearItem(): UpdateConnectivityPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateConnectivityPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateConnectivityPolicyRequest): UpdateConnectivityPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateConnectivityPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateConnectivityPolicyRequest;
  static deserializeBinaryFromReader(message: UpdateConnectivityPolicyRequest, reader: jspb.BinaryReader): UpdateConnectivityPolicyRequest;
}

export namespace UpdateConnectivityPolicyRequest {
  export type AsObject = {
    item?: ConnectivityPolicy.AsObject;
  };
}

export class DeleteConnectivityPolicyRequest extends jspb.Message {
  getId(): number;
  setId(value: number): DeleteConnectivityPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteConnectivityPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteConnectivityPolicyRequest): DeleteConnectivityPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteConnectivityPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteConnectivityPolicyRequest;
  static deserializeBinaryFromReader(message: DeleteConnectivityPolicyRequest, reader: jspb.BinaryReader): DeleteConnectivityPolicyRequest;
}

export namespace DeleteConnectivityPolicyRequest {
  export type AsObject = {
    id: number;
  };
}

export class SetConnectivityPolicyEnabledRequest extends jspb.Message {
  getId(): number;
  setId(value: number): SetConnectivityPolicyEnabledRequest;

  getIsEnabled(): boolean;
  setIsEnabled(value: boolean): SetConnectivityPolicyEnabledRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetConnectivityPolicyEnabledRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetConnectivityPolicyEnabledRequest): SetConnectivityPolicyEnabledRequest.AsObject;
  static serializeBinaryToWriter(message: SetConnectivityPolicyEnabledRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetConnectivityPolicyEnabledRequest;
  static deserializeBinaryFromReader(message: SetConnectivityPolicyEnabledRequest, reader: jspb.BinaryReader): SetConnectivityPolicyEnabledRequest;
}

export namespace SetConnectivityPolicyEnabledRequest {
  export type AsObject = {
    id: number;
    isEnabled: boolean;
  };
}

export enum ConnectivityTargetType {
  CONNECTIVITY_TARGET_TYPE_UNSPECIFIED = 0,
  CONNECTIVITY_TARGET_TYPE_AGENT = 1,
  CONNECTIVITY_TARGET_TYPE_AGENT_CATEGORY = 2,
  CONNECTIVITY_TARGET_TYPE_USER = 3,
  CONNECTIVITY_TARGET_TYPE_USER_GROUP = 4,
}
