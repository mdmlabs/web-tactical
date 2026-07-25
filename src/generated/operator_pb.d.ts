import * as jspb from 'google-protobuf'

import * as common_user_pb from './common/user_pb'; // proto import: "common/user.proto"
import * as common_policy_pb from './common/policy_pb'; // proto import: "common/policy.proto"
import * as common_node_pb from './common/node_pb'; // proto import: "common/node.proto"
import * as common_target_pb from './common/target_pb'; // proto import: "common/target.proto"
import * as common_export_pb from './common/export_pb'; // proto import: "common/export.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class GetUniqueManufacturersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUniqueManufacturersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUniqueManufacturersRequest): GetUniqueManufacturersRequest.AsObject;
  static serializeBinaryToWriter(message: GetUniqueManufacturersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUniqueManufacturersRequest;
  static deserializeBinaryFromReader(message: GetUniqueManufacturersRequest, reader: jspb.BinaryReader): GetUniqueManufacturersRequest;
}

export namespace GetUniqueManufacturersRequest {
  export type AsObject = {
  };
}

export class GetUniqueManufacturersResponse extends jspb.Message {
  getManufacturersList(): Array<ManufacturerModels>;
  setManufacturersList(value: Array<ManufacturerModels>): GetUniqueManufacturersResponse;
  clearManufacturersList(): GetUniqueManufacturersResponse;
  addManufacturers(value?: ManufacturerModels, index?: number): ManufacturerModels;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUniqueManufacturersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUniqueManufacturersResponse): GetUniqueManufacturersResponse.AsObject;
  static serializeBinaryToWriter(message: GetUniqueManufacturersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUniqueManufacturersResponse;
  static deserializeBinaryFromReader(message: GetUniqueManufacturersResponse, reader: jspb.BinaryReader): GetUniqueManufacturersResponse;
}

export namespace GetUniqueManufacturersResponse {
  export type AsObject = {
    manufacturersList: Array<ManufacturerModels.AsObject>;
  };
}

export class ManufacturerModels extends jspb.Message {
  getName(): string;
  setName(value: string): ManufacturerModels;

  getModelsList(): Array<string>;
  setModelsList(value: Array<string>): ManufacturerModels;
  clearModelsList(): ManufacturerModels;
  addModels(value: string, index?: number): ManufacturerModels;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ManufacturerModels.AsObject;
  static toObject(includeInstance: boolean, msg: ManufacturerModels): ManufacturerModels.AsObject;
  static serializeBinaryToWriter(message: ManufacturerModels, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ManufacturerModels;
  static deserializeBinaryFromReader(message: ManufacturerModels, reader: jspb.BinaryReader): ManufacturerModels;
}

export namespace ManufacturerModels {
  export type AsObject = {
    name: string;
    modelsList: Array<string>;
  };
}

export class ExportAgentStatusRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ExportAgentStatusRequest;
  hasTarget(): boolean;
  clearTarget(): ExportAgentStatusRequest;

  getRequestedBy(): string;
  setRequestedBy(value: string): ExportAgentStatusRequest;

  getNote(): string;
  setNote(value: string): ExportAgentStatusRequest;

  getFromUtc(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFromUtc(value?: google_protobuf_timestamp_pb.Timestamp): ExportAgentStatusRequest;
  hasFromUtc(): boolean;
  clearFromUtc(): ExportAgentStatusRequest;

  getToUtc(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setToUtc(value?: google_protobuf_timestamp_pb.Timestamp): ExportAgentStatusRequest;
  hasToUtc(): boolean;
  clearToUtc(): ExportAgentStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportAgentStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportAgentStatusRequest): ExportAgentStatusRequest.AsObject;
  static serializeBinaryToWriter(message: ExportAgentStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportAgentStatusRequest;
  static deserializeBinaryFromReader(message: ExportAgentStatusRequest, reader: jspb.BinaryReader): ExportAgentStatusRequest;
}

export namespace ExportAgentStatusRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    requestedBy: string;
    note: string;
    fromUtc?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    toUtc?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };

  export enum FromUtcCase {
    _FROM_UTC_NOT_SET = 0,
    FROM_UTC = 4,
  }

  export enum ToUtcCase {
    _TO_UTC_NOT_SET = 0,
    TO_UTC = 5,
  }
}

export class UpdateAgentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateAgentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateAgentResponse): UpdateAgentResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateAgentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateAgentResponse;
  static deserializeBinaryFromReader(message: UpdateAgentResponse, reader: jspb.BinaryReader): UpdateAgentResponse;
}

export namespace UpdateAgentResponse {
  export type AsObject = {
  };
}

export class UpdateAgentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateAgentRequest;

  getDescription(): string;
  setDescription(value: string): UpdateAgentRequest;

  getMaxPolicies(): number;
  setMaxPolicies(value: number): UpdateAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateAgentRequest): UpdateAgentRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateAgentRequest;
  static deserializeBinaryFromReader(message: UpdateAgentRequest, reader: jspb.BinaryReader): UpdateAgentRequest;
}

export namespace UpdateAgentRequest {
  export type AsObject = {
    id: string;
    description: string;
    maxPolicies: number;
  };
}

export class ListAgentsRequest extends jspb.Message {
  getManufacturer(): string;
  setManufacturer(value: string): ListAgentsRequest;
  hasManufacturer(): boolean;
  clearManufacturer(): ListAgentsRequest;

  getModel(): string;
  setModel(value: string): ListAgentsRequest;
  hasModel(): boolean;
  clearModel(): ListAgentsRequest;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): ListAgentsRequest;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): ListAgentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAgentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAgentsRequest): ListAgentsRequest.AsObject;
  static serializeBinaryToWriter(message: ListAgentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAgentsRequest;
  static deserializeBinaryFromReader(message: ListAgentsRequest, reader: jspb.BinaryReader): ListAgentsRequest;
}

export namespace ListAgentsRequest {
  export type AsObject = {
    manufacturer?: string;
    model?: string;
    minimalOsVersion?: string;
  };

  export enum ManufacturerCase {
    _MANUFACTURER_NOT_SET = 0,
    MANUFACTURER = 1,
  }

  export enum ModelCase {
    _MODEL_NOT_SET = 0,
    MODEL = 2,
  }

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 3,
  }
}

export class GetAgentRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): GetAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAgentRequest): GetAgentRequest.AsObject;
  static serializeBinaryToWriter(message: GetAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAgentRequest;
  static deserializeBinaryFromReader(message: GetAgentRequest, reader: jspb.BinaryReader): GetAgentRequest;
}

export namespace GetAgentRequest {
  export type AsObject = {
    agentId: string;
  };
}

export class ListAgentsResponse extends jspb.Message {
  getAgentsList(): Array<AgentSummary>;
  setAgentsList(value: Array<AgentSummary>): ListAgentsResponse;
  clearAgentsList(): ListAgentsResponse;
  addAgents(value?: AgentSummary, index?: number): AgentSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAgentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListAgentsResponse): ListAgentsResponse.AsObject;
  static serializeBinaryToWriter(message: ListAgentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAgentsResponse;
  static deserializeBinaryFromReader(message: ListAgentsResponse, reader: jspb.BinaryReader): ListAgentsResponse;
}

export namespace ListAgentsResponse {
  export type AsObject = {
    agentsList: Array<AgentSummary.AsObject>;
  };
}

export class AgentSummary extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AgentSummary;

  getHostName(): string;
  setHostName(value: string): AgentSummary;

  getIpAddress(): string;
  setIpAddress(value: string): AgentSummary;

  getIsOnline(): boolean;
  setIsOnline(value: boolean): AgentSummary;

  getLastHeartbeatUnix(): number;
  setLastHeartbeatUnix(value: number): AgentSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentSummary.AsObject;
  static toObject(includeInstance: boolean, msg: AgentSummary): AgentSummary.AsObject;
  static serializeBinaryToWriter(message: AgentSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentSummary;
  static deserializeBinaryFromReader(message: AgentSummary, reader: jspb.BinaryReader): AgentSummary;
}

export namespace AgentSummary {
  export type AsObject = {
    agentId: string;
    hostName: string;
    ipAddress: string;
    isOnline: boolean;
    lastHeartbeatUnix: number;
  };
}

export class AgentDetails extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AgentDetails;

  getHostName(): string;
  setHostName(value: string): AgentDetails;

  getIpAddress(): string;
  setIpAddress(value: string): AgentDetails;

  getIsOnline(): boolean;
  setIsOnline(value: boolean): AgentDetails;

  getLastHeartbeatUnix(): number;
  setLastHeartbeatUnix(value: number): AgentDetails;

  getNodeInfo(): common_node_pb.NodeFullInfo | undefined;
  setNodeInfo(value?: common_node_pb.NodeFullInfo): AgentDetails;
  hasNodeInfo(): boolean;
  clearNodeInfo(): AgentDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentDetails.AsObject;
  static toObject(includeInstance: boolean, msg: AgentDetails): AgentDetails.AsObject;
  static serializeBinaryToWriter(message: AgentDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentDetails;
  static deserializeBinaryFromReader(message: AgentDetails, reader: jspb.BinaryReader): AgentDetails;
}

export namespace AgentDetails {
  export type AsObject = {
    agentId: string;
    hostName: string;
    ipAddress: string;
    isOnline: boolean;
    lastHeartbeatUnix: number;
    nodeInfo?: common_node_pb.NodeFullInfo.AsObject;
  };
}

export class ExportCollectionPoliciesRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): ExportCollectionPoliciesRequest;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): ExportCollectionPoliciesRequest;

  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportCollectionPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportCollectionPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportCollectionPoliciesRequest): ExportCollectionPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: ExportCollectionPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportCollectionPoliciesRequest;
  static deserializeBinaryFromReader(message: ExportCollectionPoliciesRequest, reader: jspb.BinaryReader): ExportCollectionPoliciesRequest;
}

export namespace ExportCollectionPoliciesRequest {
  export type AsObject = {
    langCode: string;
    scope: PolicyScope;
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class GetAppliedCollectionsByAgentCategoryRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): GetAppliedCollectionsByAgentCategoryRequest;

  getLangCode(): string;
  setLangCode(value: string): GetAppliedCollectionsByAgentCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAppliedCollectionsByAgentCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAppliedCollectionsByAgentCategoryRequest): GetAppliedCollectionsByAgentCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetAppliedCollectionsByAgentCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAppliedCollectionsByAgentCategoryRequest;
  static deserializeBinaryFromReader(message: GetAppliedCollectionsByAgentCategoryRequest, reader: jspb.BinaryReader): GetAppliedCollectionsByAgentCategoryRequest;
}

export namespace GetAppliedCollectionsByAgentCategoryRequest {
  export type AsObject = {
    categoryId: number;
    langCode: string;
  };
}

export class GetAppliedCollectionsByAgentRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): GetAppliedCollectionsByAgentRequest;

  getLangCode(): string;
  setLangCode(value: string): GetAppliedCollectionsByAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAppliedCollectionsByAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAppliedCollectionsByAgentRequest): GetAppliedCollectionsByAgentRequest.AsObject;
  static serializeBinaryToWriter(message: GetAppliedCollectionsByAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAppliedCollectionsByAgentRequest;
  static deserializeBinaryFromReader(message: GetAppliedCollectionsByAgentRequest, reader: jspb.BinaryReader): GetAppliedCollectionsByAgentRequest;
}

export namespace GetAppliedCollectionsByAgentRequest {
  export type AsObject = {
    agentId: string;
    langCode: string;
  };
}

export class GetAppliedCollectionsByUserRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetAppliedCollectionsByUserRequest;

  getLangCode(): string;
  setLangCode(value: string): GetAppliedCollectionsByUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAppliedCollectionsByUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAppliedCollectionsByUserRequest): GetAppliedCollectionsByUserRequest.AsObject;
  static serializeBinaryToWriter(message: GetAppliedCollectionsByUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAppliedCollectionsByUserRequest;
  static deserializeBinaryFromReader(message: GetAppliedCollectionsByUserRequest, reader: jspb.BinaryReader): GetAppliedCollectionsByUserRequest;
}

export namespace GetAppliedCollectionsByUserRequest {
  export type AsObject = {
    userId: string;
    langCode: string;
  };
}

export class GetAppliedCollectionsByGroupRequest extends jspb.Message {
  getGroupId(): string;
  setGroupId(value: string): GetAppliedCollectionsByGroupRequest;

  getLangCode(): string;
  setLangCode(value: string): GetAppliedCollectionsByGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAppliedCollectionsByGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAppliedCollectionsByGroupRequest): GetAppliedCollectionsByGroupRequest.AsObject;
  static serializeBinaryToWriter(message: GetAppliedCollectionsByGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAppliedCollectionsByGroupRequest;
  static deserializeBinaryFromReader(message: GetAppliedCollectionsByGroupRequest, reader: jspb.BinaryReader): GetAppliedCollectionsByGroupRequest;
}

export namespace GetAppliedCollectionsByGroupRequest {
  export type AsObject = {
    groupId: string;
    langCode: string;
  };
}

export class GetAppliedCollectionsResponse extends jspb.Message {
  getCollectionsList(): Array<CollectionsSummary>;
  setCollectionsList(value: Array<CollectionsSummary>): GetAppliedCollectionsResponse;
  clearCollectionsList(): GetAppliedCollectionsResponse;
  addCollections(value?: CollectionsSummary, index?: number): CollectionsSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAppliedCollectionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAppliedCollectionsResponse): GetAppliedCollectionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAppliedCollectionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAppliedCollectionsResponse;
  static deserializeBinaryFromReader(message: GetAppliedCollectionsResponse, reader: jspb.BinaryReader): GetAppliedCollectionsResponse;
}

export namespace GetAppliedCollectionsResponse {
  export type AsObject = {
    collectionsList: Array<CollectionsSummary.AsObject>;
  };
}

export class CreateCollectionsPoliciesRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): CreateCollectionsPoliciesRequest;

  getPoliciesList(): Array<PolicyConfigureModel>;
  setPoliciesList(value: Array<PolicyConfigureModel>): CreateCollectionsPoliciesRequest;
  clearPoliciesList(): CreateCollectionsPoliciesRequest;
  addPolicies(value?: PolicyConfigureModel, index?: number): PolicyConfigureModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCollectionsPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCollectionsPoliciesRequest): CreateCollectionsPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: CreateCollectionsPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCollectionsPoliciesRequest;
  static deserializeBinaryFromReader(message: CreateCollectionsPoliciesRequest, reader: jspb.BinaryReader): CreateCollectionsPoliciesRequest;
}

export namespace CreateCollectionsPoliciesRequest {
  export type AsObject = {
    collectionId: number;
    policiesList: Array<PolicyConfigureModel.AsObject>;
  };
}

export class PolicyConfigureModel extends jspb.Message {
  getHash(): string;
  setHash(value: string): PolicyConfigureModel;

  getState(): boolean;
  setState(value: boolean): PolicyConfigureModel;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): PolicyConfigureModel;
  hasSelection(): boolean;
  clearSelection(): PolicyConfigureModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyConfigureModel.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyConfigureModel): PolicyConfigureModel.AsObject;
  static serializeBinaryToWriter(message: PolicyConfigureModel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyConfigureModel;
  static deserializeBinaryFromReader(message: PolicyConfigureModel, reader: jspb.BinaryReader): PolicyConfigureModel;
}

export namespace PolicyConfigureModel {
  export type AsObject = {
    hash: string;
    state: boolean;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class CreateCollectionsPoliciesResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateCollectionsPoliciesResponse;

  getMessage(): string;
  setMessage(value: string): CreateCollectionsPoliciesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCollectionsPoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCollectionsPoliciesResponse): CreateCollectionsPoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: CreateCollectionsPoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCollectionsPoliciesResponse;
  static deserializeBinaryFromReader(message: CreateCollectionsPoliciesResponse, reader: jspb.BinaryReader): CreateCollectionsPoliciesResponse;
}

export namespace CreateCollectionsPoliciesResponse {
  export type AsObject = {
    success: boolean;
    message: string;
  };
}

export class GetAllCollectionsRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetAllCollectionsRequest;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): GetAllCollectionsRequest;
  hasScope(): boolean;
  clearScope(): GetAllCollectionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllCollectionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllCollectionsRequest): GetAllCollectionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllCollectionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllCollectionsRequest;
  static deserializeBinaryFromReader(message: GetAllCollectionsRequest, reader: jspb.BinaryReader): GetAllCollectionsRequest;
}

export namespace GetAllCollectionsRequest {
  export type AsObject = {
    langCode: string;
    scope?: PolicyScope;
  };

  export enum ScopeCase {
    _SCOPE_NOT_SET = 0,
    SCOPE = 2,
  }
}

export class GetAllCollectionsResponse extends jspb.Message {
  getCollectionsList(): Array<CollectionsSummary>;
  setCollectionsList(value: Array<CollectionsSummary>): GetAllCollectionsResponse;
  clearCollectionsList(): GetAllCollectionsResponse;
  addCollections(value?: CollectionsSummary, index?: number): CollectionsSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllCollectionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllCollectionsResponse): GetAllCollectionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllCollectionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllCollectionsResponse;
  static deserializeBinaryFromReader(message: GetAllCollectionsResponse, reader: jspb.BinaryReader): GetAllCollectionsResponse;
}

export namespace GetAllCollectionsResponse {
  export type AsObject = {
    collectionsList: Array<CollectionsSummary.AsObject>;
  };
}

export class GetCollectionByIdRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): GetCollectionByIdRequest;

  getLangCode(): string;
  setLangCode(value: string): GetCollectionByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCollectionByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCollectionByIdRequest): GetCollectionByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetCollectionByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCollectionByIdRequest;
  static deserializeBinaryFromReader(message: GetCollectionByIdRequest, reader: jspb.BinaryReader): GetCollectionByIdRequest;
}

export namespace GetCollectionByIdRequest {
  export type AsObject = {
    collectionId: number;
    langCode: string;
  };
}

export class CollectionDetailsResponse extends jspb.Message {
  getCollection(): CollectionsSummary | undefined;
  setCollection(value?: CollectionsSummary): CollectionDetailsResponse;
  hasCollection(): boolean;
  clearCollection(): CollectionDetailsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectionDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CollectionDetailsResponse): CollectionDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: CollectionDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectionDetailsResponse;
  static deserializeBinaryFromReader(message: CollectionDetailsResponse, reader: jspb.BinaryReader): CollectionDetailsResponse;
}

export namespace CollectionDetailsResponse {
  export type AsObject = {
    collection?: CollectionsSummary.AsObject;
  };
}

export class CollectionsSummary extends jspb.Message {
  getId(): number;
  setId(value: number): CollectionsSummary;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): CollectionsSummary;

  getName(): string;
  setName(value: string): CollectionsSummary;

  getExplainText(): string;
  setExplainText(value: string): CollectionsSummary;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): CollectionsSummary;
  clearPoliciesList(): CollectionsSummary;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectionsSummary.AsObject;
  static toObject(includeInstance: boolean, msg: CollectionsSummary): CollectionsSummary.AsObject;
  static serializeBinaryToWriter(message: CollectionsSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectionsSummary;
  static deserializeBinaryFromReader(message: CollectionsSummary, reader: jspb.BinaryReader): CollectionsSummary;
}

export namespace CollectionsSummary {
  export type AsObject = {
    id: number;
    scope: PolicyScope;
    name: string;
    explainText: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class CreateCollectionRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateCollectionRequest;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): CreateCollectionRequest;

  getExplainText(): string;
  setExplainText(value: string): CreateCollectionRequest;

  getTranslationsList(): Array<CollectionTranslation>;
  setTranslationsList(value: Array<CollectionTranslation>): CreateCollectionRequest;
  clearTranslationsList(): CreateCollectionRequest;
  addTranslations(value?: CollectionTranslation, index?: number): CollectionTranslation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCollectionRequest): CreateCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: CreateCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCollectionRequest;
  static deserializeBinaryFromReader(message: CreateCollectionRequest, reader: jspb.BinaryReader): CreateCollectionRequest;
}

export namespace CreateCollectionRequest {
  export type AsObject = {
    name: string;
    scope: PolicyScope;
    explainText: string;
    translationsList: Array<CollectionTranslation.AsObject>;
  };
}

export class UpdateCollectionRequest extends jspb.Message {
  getId(): number;
  setId(value: number): UpdateCollectionRequest;

  getName(): string;
  setName(value: string): UpdateCollectionRequest;

  getExplainText(): string;
  setExplainText(value: string): UpdateCollectionRequest;

  getTranslationsList(): Array<CollectionTranslation>;
  setTranslationsList(value: Array<CollectionTranslation>): UpdateCollectionRequest;
  clearTranslationsList(): UpdateCollectionRequest;
  addTranslations(value?: CollectionTranslation, index?: number): CollectionTranslation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCollectionRequest): UpdateCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCollectionRequest;
  static deserializeBinaryFromReader(message: UpdateCollectionRequest, reader: jspb.BinaryReader): UpdateCollectionRequest;
}

export namespace UpdateCollectionRequest {
  export type AsObject = {
    id: number;
    name: string;
    explainText: string;
    translationsList: Array<CollectionTranslation.AsObject>;
  };
}

export class CollectionTranslation extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): CollectionTranslation;

  getName(): string;
  setName(value: string): CollectionTranslation;

  getExplainText(): string;
  setExplainText(value: string): CollectionTranslation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectionTranslation.AsObject;
  static toObject(includeInstance: boolean, msg: CollectionTranslation): CollectionTranslation.AsObject;
  static serializeBinaryToWriter(message: CollectionTranslation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectionTranslation;
  static deserializeBinaryFromReader(message: CollectionTranslation, reader: jspb.BinaryReader): CollectionTranslation;
}

export namespace CollectionTranslation {
  export type AsObject = {
    langCode: string;
    name: string;
    explainText: string;
  };
}

export class DeleteCollectionRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): DeleteCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteCollectionRequest): DeleteCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteCollectionRequest;
  static deserializeBinaryFromReader(message: DeleteCollectionRequest, reader: jspb.BinaryReader): DeleteCollectionRequest;
}

export namespace DeleteCollectionRequest {
  export type AsObject = {
    collectionId: number;
  };
}

export class DeleteCollectionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteCollectionResponse;

  getMessage(): string;
  setMessage(value: string): DeleteCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteCollectionResponse): DeleteCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteCollectionResponse;
  static deserializeBinaryFromReader(message: DeleteCollectionResponse, reader: jspb.BinaryReader): DeleteCollectionResponse;
}

export namespace DeleteCollectionResponse {
  export type AsObject = {
    success: boolean;
    message: string;
  };
}

export class GetPoliciesInCollectionRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): GetPoliciesInCollectionRequest;

  getLangCode(): string;
  setLangCode(value: string): GetPoliciesInCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesInCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesInCollectionRequest): GetPoliciesInCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesInCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesInCollectionRequest;
  static deserializeBinaryFromReader(message: GetPoliciesInCollectionRequest, reader: jspb.BinaryReader): GetPoliciesInCollectionRequest;
}

export namespace GetPoliciesInCollectionRequest {
  export type AsObject = {
    collectionId: number;
    langCode: string;
  };
}

export class GetPoliciesInCollectionResponse extends jspb.Message {
  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): GetPoliciesInCollectionResponse;
  clearPoliciesList(): GetPoliciesInCollectionResponse;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesInCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesInCollectionResponse): GetPoliciesInCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesInCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesInCollectionResponse;
  static deserializeBinaryFromReader(message: GetPoliciesInCollectionResponse, reader: jspb.BinaryReader): GetPoliciesInCollectionResponse;
}

export namespace GetPoliciesInCollectionResponse {
  export type AsObject = {
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class RemovePoliciesFromCollectionRequest extends jspb.Message {
  getCollectionid(): number;
  setCollectionid(value: number): RemovePoliciesFromCollectionRequest;

  getPoliciesList(): Array<string>;
  setPoliciesList(value: Array<string>): RemovePoliciesFromCollectionRequest;
  clearPoliciesList(): RemovePoliciesFromCollectionRequest;
  addPolicies(value: string, index?: number): RemovePoliciesFromCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePoliciesFromCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePoliciesFromCollectionRequest): RemovePoliciesFromCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: RemovePoliciesFromCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePoliciesFromCollectionRequest;
  static deserializeBinaryFromReader(message: RemovePoliciesFromCollectionRequest, reader: jspb.BinaryReader): RemovePoliciesFromCollectionRequest;
}

export namespace RemovePoliciesFromCollectionRequest {
  export type AsObject = {
    collectionid: number;
    policiesList: Array<string>;
  };
}

export class ListUsersForAgentRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): ListUsersForAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersForAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersForAgentRequest): ListUsersForAgentRequest.AsObject;
  static serializeBinaryToWriter(message: ListUsersForAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersForAgentRequest;
  static deserializeBinaryFromReader(message: ListUsersForAgentRequest, reader: jspb.BinaryReader): ListUsersForAgentRequest;
}

export namespace ListUsersForAgentRequest {
  export type AsObject = {
    agentId: string;
  };
}

export class ListUsersForAgentResponse extends jspb.Message {
  getUsersList(): Array<common_user_pb.UserInfo>;
  setUsersList(value: Array<common_user_pb.UserInfo>): ListUsersForAgentResponse;
  clearUsersList(): ListUsersForAgentResponse;
  addUsers(value?: common_user_pb.UserInfo, index?: number): common_user_pb.UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersForAgentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersForAgentResponse): ListUsersForAgentResponse.AsObject;
  static serializeBinaryToWriter(message: ListUsersForAgentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersForAgentResponse;
  static deserializeBinaryFromReader(message: ListUsersForAgentResponse, reader: jspb.BinaryReader): ListUsersForAgentResponse;
}

export namespace ListUsersForAgentResponse {
  export type AsObject = {
    usersList: Array<common_user_pb.UserInfo.AsObject>;
  };
}

export class ListUserGroupsForAgentRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): ListUserGroupsForAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserGroupsForAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserGroupsForAgentRequest): ListUserGroupsForAgentRequest.AsObject;
  static serializeBinaryToWriter(message: ListUserGroupsForAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserGroupsForAgentRequest;
  static deserializeBinaryFromReader(message: ListUserGroupsForAgentRequest, reader: jspb.BinaryReader): ListUserGroupsForAgentRequest;
}

export namespace ListUserGroupsForAgentRequest {
  export type AsObject = {
    agentId: string;
  };
}

export class ListUserGroupsForAgentResponse extends jspb.Message {
  getGroupsList(): Array<common_user_pb.GroupInfo>;
  setGroupsList(value: Array<common_user_pb.GroupInfo>): ListUserGroupsForAgentResponse;
  clearGroupsList(): ListUserGroupsForAgentResponse;
  addGroups(value?: common_user_pb.GroupInfo, index?: number): common_user_pb.GroupInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserGroupsForAgentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserGroupsForAgentResponse): ListUserGroupsForAgentResponse.AsObject;
  static serializeBinaryToWriter(message: ListUserGroupsForAgentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserGroupsForAgentResponse;
  static deserializeBinaryFromReader(message: ListUserGroupsForAgentResponse, reader: jspb.BinaryReader): ListUserGroupsForAgentResponse;
}

export namespace ListUserGroupsForAgentResponse {
  export type AsObject = {
    groupsList: Array<common_user_pb.GroupInfo.AsObject>;
  };
}

export class ImportAdmxZipRequest extends jspb.Message {
  getZipContent(): Uint8Array | string;
  getZipContent_asU8(): Uint8Array;
  getZipContent_asB64(): string;
  setZipContent(value: Uint8Array | string): ImportAdmxZipRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportAdmxZipRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImportAdmxZipRequest): ImportAdmxZipRequest.AsObject;
  static serializeBinaryToWriter(message: ImportAdmxZipRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportAdmxZipRequest;
  static deserializeBinaryFromReader(message: ImportAdmxZipRequest, reader: jspb.BinaryReader): ImportAdmxZipRequest;
}

export namespace ImportAdmxZipRequest {
  export type AsObject = {
    zipContent: Uint8Array | string;
  };
}

export class ImportAdmxFileRequest extends jspb.Message {
  getFileContent(): Uint8Array | string;
  getFileContent_asU8(): Uint8Array;
  getFileContent_asB64(): string;
  setFileContent(value: Uint8Array | string): ImportAdmxFileRequest;

  getFileName(): string;
  setFileName(value: string): ImportAdmxFileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportAdmxFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImportAdmxFileRequest): ImportAdmxFileRequest.AsObject;
  static serializeBinaryToWriter(message: ImportAdmxFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportAdmxFileRequest;
  static deserializeBinaryFromReader(message: ImportAdmxFileRequest, reader: jspb.BinaryReader): ImportAdmxFileRequest;
}

export namespace ImportAdmxFileRequest {
  export type AsObject = {
    fileContent: Uint8Array | string;
    fileName: string;
  };
}

export class ImportAdmxResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): ImportAdmxResponse;

  getMessage(): string;
  setMessage(value: string): ImportAdmxResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportAdmxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ImportAdmxResponse): ImportAdmxResponse.AsObject;
  static serializeBinaryToWriter(message: ImportAdmxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportAdmxResponse;
  static deserializeBinaryFromReader(message: ImportAdmxResponse, reader: jspb.BinaryReader): ImportAdmxResponse;
}

export namespace ImportAdmxResponse {
  export type AsObject = {
    success: boolean;
    message: string;
  };
}

export class ListAdmxFilesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAdmxFilesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAdmxFilesRequest): ListAdmxFilesRequest.AsObject;
  static serializeBinaryToWriter(message: ListAdmxFilesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAdmxFilesRequest;
  static deserializeBinaryFromReader(message: ListAdmxFilesRequest, reader: jspb.BinaryReader): ListAdmxFilesRequest;
}

export namespace ListAdmxFilesRequest {
  export type AsObject = {
  };
}

export class ListAdmxFilesResponse extends jspb.Message {
  getFilesList(): Array<AdmxFile>;
  setFilesList(value: Array<AdmxFile>): ListAdmxFilesResponse;
  clearFilesList(): ListAdmxFilesResponse;
  addFiles(value?: AdmxFile, index?: number): AdmxFile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAdmxFilesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListAdmxFilesResponse): ListAdmxFilesResponse.AsObject;
  static serializeBinaryToWriter(message: ListAdmxFilesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAdmxFilesResponse;
  static deserializeBinaryFromReader(message: ListAdmxFilesResponse, reader: jspb.BinaryReader): ListAdmxFilesResponse;
}

export namespace ListAdmxFilesResponse {
  export type AsObject = {
    filesList: Array<AdmxFile.AsObject>;
  };
}

export class GetAdmxSnapshotRequest extends jspb.Message {
  getFileHash(): string;
  setFileHash(value: string): GetAdmxSnapshotRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAdmxSnapshotRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAdmxSnapshotRequest): GetAdmxSnapshotRequest.AsObject;
  static serializeBinaryToWriter(message: GetAdmxSnapshotRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAdmxSnapshotRequest;
  static deserializeBinaryFromReader(message: GetAdmxSnapshotRequest, reader: jspb.BinaryReader): GetAdmxSnapshotRequest;
}

export namespace GetAdmxSnapshotRequest {
  export type AsObject = {
    fileHash: string;
  };
}

export class AdmxFile extends jspb.Message {
  getFileName(): string;
  setFileName(value: string): AdmxFile;

  getFileHash(): string;
  setFileHash(value: string): AdmxFile;

  getLoadedAtUnix(): number;
  setLoadedAtUnix(value: number): AdmxFile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdmxFile.AsObject;
  static toObject(includeInstance: boolean, msg: AdmxFile): AdmxFile.AsObject;
  static serializeBinaryToWriter(message: AdmxFile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdmxFile;
  static deserializeBinaryFromReader(message: AdmxFile, reader: jspb.BinaryReader): AdmxFile;
}

export namespace AdmxFile {
  export type AsObject = {
    fileName: string;
    fileHash: string;
    loadedAtUnix: number;
  };
}

export class PolicyCategory extends jspb.Message {
  getName(): string;
  setName(value: string): PolicyCategory;

  getDisplayName(): string;
  setDisplayName(value: string): PolicyCategory;

  getExplainText(): string;
  setExplainText(value: string): PolicyCategory;

  getParentCategoryName(): string;
  setParentCategoryName(value: string): PolicyCategory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyCategory.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyCategory): PolicyCategory.AsObject;
  static serializeBinaryToWriter(message: PolicyCategory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyCategory;
  static deserializeBinaryFromReader(message: PolicyCategory, reader: jspb.BinaryReader): PolicyCategory;
}

export namespace PolicyCategory {
  export type AsObject = {
    name: string;
    displayName: string;
    explainText: string;
    parentCategoryName: string;
  };
}

export class PolicyNamespace extends jspb.Message {
  getPrefix(): string;
  setPrefix(value: string): PolicyNamespace;

  getNamespace(): string;
  setNamespace(value: string): PolicyNamespace;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyNamespace.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyNamespace): PolicyNamespace.AsObject;
  static serializeBinaryToWriter(message: PolicyNamespace, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyNamespace;
  static deserializeBinaryFromReader(message: PolicyNamespace, reader: jspb.BinaryReader): PolicyNamespace;
}

export namespace PolicyNamespace {
  export type AsObject = {
    prefix: string;
    namespace: string;
  };
}

export class AdmxSnapshot extends jspb.Message {
  getFile(): AdmxFile | undefined;
  setFile(value?: AdmxFile): AdmxSnapshot;
  hasFile(): boolean;
  clearFile(): AdmxSnapshot;

  getPoliciesList(): Array<PolicyDescriptor>;
  setPoliciesList(value: Array<PolicyDescriptor>): AdmxSnapshot;
  clearPoliciesList(): AdmxSnapshot;
  addPolicies(value?: PolicyDescriptor, index?: number): PolicyDescriptor;

  getCategoriesList(): Array<PolicyCategory>;
  setCategoriesList(value: Array<PolicyCategory>): AdmxSnapshot;
  clearCategoriesList(): AdmxSnapshot;
  addCategories(value?: PolicyCategory, index?: number): PolicyCategory;

  getNamespacesList(): Array<PolicyNamespace>;
  setNamespacesList(value: Array<PolicyNamespace>): AdmxSnapshot;
  clearNamespacesList(): AdmxSnapshot;
  addNamespaces(value?: PolicyNamespace, index?: number): PolicyNamespace;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdmxSnapshot.AsObject;
  static toObject(includeInstance: boolean, msg: AdmxSnapshot): AdmxSnapshot.AsObject;
  static serializeBinaryToWriter(message: AdmxSnapshot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdmxSnapshot;
  static deserializeBinaryFromReader(message: AdmxSnapshot, reader: jspb.BinaryReader): AdmxSnapshot;
}

export namespace AdmxSnapshot {
  export type AsObject = {
    file?: AdmxFile.AsObject;
    policiesList: Array<PolicyDescriptor.AsObject>;
    categoriesList: Array<PolicyCategory.AsObject>;
    namespacesList: Array<PolicyNamespace.AsObject>;
  };
}

export class UpdatePoliciesByHashAndVersionRequest extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): UpdatePoliciesByHashAndVersionRequest;

  getVersion(): number;
  setVersion(value: number): UpdatePoliciesByHashAndVersionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePoliciesByHashAndVersionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePoliciesByHashAndVersionRequest): UpdatePoliciesByHashAndVersionRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePoliciesByHashAndVersionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePoliciesByHashAndVersionRequest;
  static deserializeBinaryFromReader(message: UpdatePoliciesByHashAndVersionRequest, reader: jspb.BinaryReader): UpdatePoliciesByHashAndVersionRequest;
}

export namespace UpdatePoliciesByHashAndVersionRequest {
  export type AsObject = {
    policyHash: string;
    version: number;
  };
}

export class GetAllVersionByHashRequast extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): GetAllVersionByHashRequast;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllVersionByHashRequast.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllVersionByHashRequast): GetAllVersionByHashRequast.AsObject;
  static serializeBinaryToWriter(message: GetAllVersionByHashRequast, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllVersionByHashRequast;
  static deserializeBinaryFromReader(message: GetAllVersionByHashRequast, reader: jspb.BinaryReader): GetAllVersionByHashRequast;
}

export namespace GetAllVersionByHashRequast {
  export type AsObject = {
    policyHash: string;
  };
}

export class GetAllVersionByHashResponse extends jspb.Message {
  getVersionsList(): Array<PolicyVersion>;
  setVersionsList(value: Array<PolicyVersion>): GetAllVersionByHashResponse;
  clearVersionsList(): GetAllVersionByHashResponse;
  addVersions(value?: PolicyVersion, index?: number): PolicyVersion;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllVersionByHashResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllVersionByHashResponse): GetAllVersionByHashResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllVersionByHashResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllVersionByHashResponse;
  static deserializeBinaryFromReader(message: GetAllVersionByHashResponse, reader: jspb.BinaryReader): GetAllVersionByHashResponse;
}

export namespace GetAllVersionByHashResponse {
  export type AsObject = {
    versionsList: Array<PolicyVersion.AsObject>;
  };
}

export class PolicyVersion extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): PolicyVersion;

  getPolicy(): PolicyDescriptor | undefined;
  setPolicy(value?: PolicyDescriptor): PolicyVersion;
  hasPolicy(): boolean;
  clearPolicy(): PolicyVersion;

  getVersion(): number;
  setVersion(value: number): PolicyVersion;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyVersion.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyVersion): PolicyVersion.AsObject;
  static serializeBinaryToWriter(message: PolicyVersion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyVersion;
  static deserializeBinaryFromReader(message: PolicyVersion, reader: jspb.BinaryReader): PolicyVersion;
}

export namespace PolicyVersion {
  export type AsObject = {
    policyHash: string;
    policy?: PolicyDescriptor.AsObject;
    version: number;
  };
}

export class UpdatePoliciesByHashRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): UpdatePoliciesByHashRequest;

  getName(): string;
  setName(value: string): UpdatePoliciesByHashRequest;
  hasName(): boolean;
  clearName(): UpdatePoliciesByHashRequest;

  getDisplayname(): string;
  setDisplayname(value: string): UpdatePoliciesByHashRequest;
  hasDisplayname(): boolean;
  clearDisplayname(): UpdatePoliciesByHashRequest;

  getExplaintext(): string;
  setExplaintext(value: string): UpdatePoliciesByHashRequest;
  hasExplaintext(): boolean;
  clearExplaintext(): UpdatePoliciesByHashRequest;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): UpdatePoliciesByHashRequest;
  hasScope(): boolean;
  clearScope(): UpdatePoliciesByHashRequest;

  getRegistrykey(): string;
  setRegistrykey(value: string): UpdatePoliciesByHashRequest;
  hasRegistrykey(): boolean;
  clearRegistrykey(): UpdatePoliciesByHashRequest;

  getValuename(): string;
  setValuename(value: string): UpdatePoliciesByHashRequest;
  hasValuename(): boolean;
  clearValuename(): UpdatePoliciesByHashRequest;

  getEnabledvalue(): string;
  setEnabledvalue(value: string): UpdatePoliciesByHashRequest;
  hasEnabledvalue(): boolean;
  clearEnabledvalue(): UpdatePoliciesByHashRequest;

  getDisabledvalue(): string;
  setDisabledvalue(value: string): UpdatePoliciesByHashRequest;
  hasDisabledvalue(): boolean;
  clearDisabledvalue(): UpdatePoliciesByHashRequest;

  getSupportedonref(): string;
  setSupportedonref(value: string): UpdatePoliciesByHashRequest;
  hasSupportedonref(): boolean;
  clearSupportedonref(): UpdatePoliciesByHashRequest;

  getParentcategoryref(): string;
  setParentcategoryref(value: string): UpdatePoliciesByHashRequest;
  hasParentcategoryref(): boolean;
  clearParentcategoryref(): UpdatePoliciesByHashRequest;

  getPresentationref(): string;
  setPresentationref(value: string): UpdatePoliciesByHashRequest;
  hasPresentationref(): boolean;
  clearPresentationref(): UpdatePoliciesByHashRequest;

  getClientextension(): string;
  setClientextension(value: string): UpdatePoliciesByHashRequest;
  hasClientextension(): boolean;
  clearClientextension(): UpdatePoliciesByHashRequest;

  getPolicystatus(): PolicyStatus;
  setPolicystatus(value: PolicyStatus): UpdatePoliciesByHashRequest;
  hasPolicystatus(): boolean;
  clearPolicystatus(): UpdatePoliciesByHashRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePoliciesByHashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePoliciesByHashRequest): UpdatePoliciesByHashRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePoliciesByHashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePoliciesByHashRequest;
  static deserializeBinaryFromReader(message: UpdatePoliciesByHashRequest, reader: jspb.BinaryReader): UpdatePoliciesByHashRequest;
}

export namespace UpdatePoliciesByHashRequest {
  export type AsObject = {
    hash: string;
    name?: string;
    displayname?: string;
    explaintext?: string;
    scope?: PolicyScope;
    registrykey?: string;
    valuename?: string;
    enabledvalue?: string;
    disabledvalue?: string;
    supportedonref?: string;
    parentcategoryref?: string;
    presentationref?: string;
    clientextension?: string;
    policystatus?: PolicyStatus;
  };

  export enum NameCase {
    _NAME_NOT_SET = 0,
    NAME = 2,
  }

  export enum DisplaynameCase {
    _DISPLAYNAME_NOT_SET = 0,
    DISPLAYNAME = 3,
  }

  export enum ExplaintextCase {
    _EXPLAINTEXT_NOT_SET = 0,
    EXPLAINTEXT = 4,
  }

  export enum ScopeCase {
    _SCOPE_NOT_SET = 0,
    SCOPE = 5,
  }

  export enum RegistrykeyCase {
    _REGISTRYKEY_NOT_SET = 0,
    REGISTRYKEY = 6,
  }

  export enum ValuenameCase {
    _VALUENAME_NOT_SET = 0,
    VALUENAME = 7,
  }

  export enum EnabledvalueCase {
    _ENABLEDVALUE_NOT_SET = 0,
    ENABLEDVALUE = 8,
  }

  export enum DisabledvalueCase {
    _DISABLEDVALUE_NOT_SET = 0,
    DISABLEDVALUE = 9,
  }

  export enum SupportedonrefCase {
    _SUPPORTEDONREF_NOT_SET = 0,
    SUPPORTEDONREF = 10,
  }

  export enum ParentcategoryrefCase {
    _PARENTCATEGORYREF_NOT_SET = 0,
    PARENTCATEGORYREF = 11,
  }

  export enum PresentationrefCase {
    _PRESENTATIONREF_NOT_SET = 0,
    PRESENTATIONREF = 12,
  }

  export enum ClientextensionCase {
    _CLIENTEXTENSION_NOT_SET = 0,
    CLIENTEXTENSION = 13,
  }

  export enum PolicystatusCase {
    _POLICYSTATUS_NOT_SET = 0,
    POLICYSTATUS = 14,
  }
}

export class UpdatePoliciesResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdatePoliciesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePoliciesResponse): UpdatePoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: UpdatePoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePoliciesResponse;
  static deserializeBinaryFromReader(message: UpdatePoliciesResponse, reader: jspb.BinaryReader): UpdatePoliciesResponse;
}

export namespace UpdatePoliciesResponse {
  export type AsObject = {
    success: boolean;
  };
}

export class UpdateStatusPoliciesRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): UpdateStatusPoliciesRequest;

  getPolicyStatus(): PolicyStatus;
  setPolicyStatus(value: PolicyStatus): UpdateStatusPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStatusPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStatusPoliciesRequest): UpdateStatusPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateStatusPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStatusPoliciesRequest;
  static deserializeBinaryFromReader(message: UpdateStatusPoliciesRequest, reader: jspb.BinaryReader): UpdateStatusPoliciesRequest;
}

export namespace UpdateStatusPoliciesRequest {
  export type AsObject = {
    hash: string;
    policyStatus: PolicyStatus;
  };
}

export class UpdateStatusPoliciesResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateStatusPoliciesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStatusPoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStatusPoliciesResponse): UpdateStatusPoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateStatusPoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStatusPoliciesResponse;
  static deserializeBinaryFromReader(message: UpdateStatusPoliciesResponse, reader: jspb.BinaryReader): UpdateStatusPoliciesResponse;
}

export namespace UpdateStatusPoliciesResponse {
  export type AsObject = {
    success: boolean;
  };
}

export class GetPoliciesBySupportedOsRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesBySupportedOsRequest;

  getSupportedOs(): string;
  setSupportedOs(value: string): GetPoliciesBySupportedOsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesBySupportedOsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesBySupportedOsRequest): GetPoliciesBySupportedOsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesBySupportedOsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesBySupportedOsRequest;
  static deserializeBinaryFromReader(message: GetPoliciesBySupportedOsRequest, reader: jspb.BinaryReader): GetPoliciesBySupportedOsRequest;
}

export namespace GetPoliciesBySupportedOsRequest {
  export type AsObject = {
    langCode: string;
    supportedOs: string;
  };
}

export class GetPoliciesBySupportedOsResponse extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesBySupportedOsResponse;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): GetPoliciesBySupportedOsResponse;
  clearPoliciesList(): GetPoliciesBySupportedOsResponse;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesBySupportedOsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesBySupportedOsResponse): GetPoliciesBySupportedOsResponse.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesBySupportedOsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesBySupportedOsResponse;
  static deserializeBinaryFromReader(message: GetPoliciesBySupportedOsResponse, reader: jspb.BinaryReader): GetPoliciesBySupportedOsResponse;
}

export namespace GetPoliciesBySupportedOsResponse {
  export type AsObject = {
    langCode: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class GetAllSupportedOsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllSupportedOsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllSupportedOsRequest): GetAllSupportedOsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllSupportedOsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllSupportedOsRequest;
  static deserializeBinaryFromReader(message: GetAllSupportedOsRequest, reader: jspb.BinaryReader): GetAllSupportedOsRequest;
}

export namespace GetAllSupportedOsRequest {
  export type AsObject = {
  };
}

export class GetAllSupportedOsResponse extends jspb.Message {
  getOsBuildsList(): Array<common_node_pb.OsBuild>;
  setOsBuildsList(value: Array<common_node_pb.OsBuild>): GetAllSupportedOsResponse;
  clearOsBuildsList(): GetAllSupportedOsResponse;
  addOsBuilds(value?: common_node_pb.OsBuild, index?: number): common_node_pb.OsBuild;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllSupportedOsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllSupportedOsResponse): GetAllSupportedOsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllSupportedOsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllSupportedOsResponse;
  static deserializeBinaryFromReader(message: GetAllSupportedOsResponse, reader: jspb.BinaryReader): GetAllSupportedOsResponse;
}

export namespace GetAllSupportedOsResponse {
  export type AsObject = {
    osBuildsList: Array<common_node_pb.OsBuild.AsObject>;
  };
}

export class SearchPolicyShortRequest extends jspb.Message {
  getSearch(): string;
  setSearch(value: string): SearchPolicyShortRequest;

  getLangCode(): string;
  setLangCode(value: string): SearchPolicyShortRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPolicyShortRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPolicyShortRequest): SearchPolicyShortRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPolicyShortRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPolicyShortRequest;
  static deserializeBinaryFromReader(message: SearchPolicyShortRequest, reader: jspb.BinaryReader): SearchPolicyShortRequest;
}

export namespace SearchPolicyShortRequest {
  export type AsObject = {
    search: string;
    langCode: string;
  };
}

export class SearchPolicyShortResponse extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): SearchPolicyShortResponse;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): SearchPolicyShortResponse;
  clearPoliciesList(): SearchPolicyShortResponse;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPolicyShortResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPolicyShortResponse): SearchPolicyShortResponse.AsObject;
  static serializeBinaryToWriter(message: SearchPolicyShortResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPolicyShortResponse;
  static deserializeBinaryFromReader(message: SearchPolicyShortResponse, reader: jspb.BinaryReader): SearchPolicyShortResponse;
}

export namespace SearchPolicyShortResponse {
  export type AsObject = {
    langCode: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class ExportAllPoliciesRequest extends jspb.Message {
  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportAllPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportAllPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportAllPoliciesRequest): ExportAllPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: ExportAllPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportAllPoliciesRequest;
  static deserializeBinaryFromReader(message: ExportAllPoliciesRequest, reader: jspb.BinaryReader): ExportAllPoliciesRequest;
}

export namespace ExportAllPoliciesRequest {
  export type AsObject = {
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class GetPoliciesByAdmxRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesByAdmxRequest;

  getAdmxFile(): string;
  setAdmxFile(value: string): GetPoliciesByAdmxRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesByAdmxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesByAdmxRequest): GetPoliciesByAdmxRequest.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesByAdmxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesByAdmxRequest;
  static deserializeBinaryFromReader(message: GetPoliciesByAdmxRequest, reader: jspb.BinaryReader): GetPoliciesByAdmxRequest;
}

export namespace GetPoliciesByAdmxRequest {
  export type AsObject = {
    langCode: string;
    admxFile: string;
  };
}

export class GetPoliciesByAdmxResponse extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesByAdmxResponse;

  getAdmxFile(): string;
  setAdmxFile(value: string): GetPoliciesByAdmxResponse;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): GetPoliciesByAdmxResponse;
  clearPoliciesList(): GetPoliciesByAdmxResponse;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesByAdmxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesByAdmxResponse): GetPoliciesByAdmxResponse.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesByAdmxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesByAdmxResponse;
  static deserializeBinaryFromReader(message: GetPoliciesByAdmxResponse, reader: jspb.BinaryReader): GetPoliciesByAdmxResponse;
}

export namespace GetPoliciesByAdmxResponse {
  export type AsObject = {
    langCode: string;
    admxFile: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class GetPoliciesByCategoryRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesByCategoryRequest;

  getCategory(): string;
  setCategory(value: string): GetPoliciesByCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesByCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesByCategoryRequest): GetPoliciesByCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesByCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesByCategoryRequest;
  static deserializeBinaryFromReader(message: GetPoliciesByCategoryRequest, reader: jspb.BinaryReader): GetPoliciesByCategoryRequest;
}

export namespace GetPoliciesByCategoryRequest {
  export type AsObject = {
    langCode: string;
    category: string;
  };
}

export class GetPoliciesByCategoryResponse extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetPoliciesByCategoryResponse;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): GetPoliciesByCategoryResponse;
  clearPoliciesList(): GetPoliciesByCategoryResponse;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPoliciesByCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPoliciesByCategoryResponse): GetPoliciesByCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetPoliciesByCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPoliciesByCategoryResponse;
  static deserializeBinaryFromReader(message: GetPoliciesByCategoryResponse, reader: jspb.BinaryReader): GetPoliciesByCategoryResponse;
}

export namespace GetPoliciesByCategoryResponse {
  export type AsObject = {
    langCode: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class GetCategoryTreeRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetCategoryTreeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCategoryTreeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCategoryTreeRequest): GetCategoryTreeRequest.AsObject;
  static serializeBinaryToWriter(message: GetCategoryTreeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCategoryTreeRequest;
  static deserializeBinaryFromReader(message: GetCategoryTreeRequest, reader: jspb.BinaryReader): GetCategoryTreeRequest;
}

export namespace GetCategoryTreeRequest {
  export type AsObject = {
    langCode: string;
  };
}

export class GetCategoryTreeResponse extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): GetCategoryTreeResponse;

  getCategoriesList(): Array<CategoryView>;
  setCategoriesList(value: Array<CategoryView>): GetCategoryTreeResponse;
  clearCategoriesList(): GetCategoryTreeResponse;
  addCategories(value?: CategoryView, index?: number): CategoryView;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCategoryTreeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCategoryTreeResponse): GetCategoryTreeResponse.AsObject;
  static serializeBinaryToWriter(message: GetCategoryTreeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCategoryTreeResponse;
  static deserializeBinaryFromReader(message: GetCategoryTreeResponse, reader: jspb.BinaryReader): GetCategoryTreeResponse;
}

export namespace GetCategoryTreeResponse {
  export type AsObject = {
    langCode: string;
    categoriesList: Array<CategoryView.AsObject>;
  };
}

export class CategoryView extends jspb.Message {
  getId(): number;
  setId(value: number): CategoryView;

  getCategoryName(): string;
  setCategoryName(value: string): CategoryView;

  getDisplayName(): string;
  setDisplayName(value: string): CategoryView;

  getChildsList(): Array<CategoryView>;
  setChildsList(value: Array<CategoryView>): CategoryView;
  clearChildsList(): CategoryView;
  addChilds(value?: CategoryView, index?: number): CategoryView;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryView.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryView): CategoryView.AsObject;
  static serializeBinaryToWriter(message: CategoryView, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryView;
  static deserializeBinaryFromReader(message: CategoryView, reader: jspb.BinaryReader): CategoryView;
}

export namespace CategoryView {
  export type AsObject = {
    id: number;
    categoryName: string;
    displayName: string;
    childsList: Array<CategoryView.AsObject>;
  };
}

export class ListPoliciesRequest extends jspb.Message {
  getAdmxFileHash(): string;
  setAdmxFileHash(value: string): ListPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListPoliciesRequest): ListPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: ListPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPoliciesRequest;
  static deserializeBinaryFromReader(message: ListPoliciesRequest, reader: jspb.BinaryReader): ListPoliciesRequest;
}

export namespace ListPoliciesRequest {
  export type AsObject = {
    admxFileHash: string;
  };
}

export class ListPoliciesResponse extends jspb.Message {
  getPoliciesList(): Array<PolicyDescriptor>;
  setPoliciesList(value: Array<PolicyDescriptor>): ListPoliciesResponse;
  clearPoliciesList(): ListPoliciesResponse;
  addPolicies(value?: PolicyDescriptor, index?: number): PolicyDescriptor;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListPoliciesResponse): ListPoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: ListPoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPoliciesResponse;
  static deserializeBinaryFromReader(message: ListPoliciesResponse, reader: jspb.BinaryReader): ListPoliciesResponse;
}

export namespace ListPoliciesResponse {
  export type AsObject = {
    policiesList: Array<PolicyDescriptor.AsObject>;
  };
}

export class GetPolicyRequest extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): GetPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPolicyRequest): GetPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: GetPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPolicyRequest;
  static deserializeBinaryFromReader(message: GetPolicyRequest, reader: jspb.BinaryReader): GetPolicyRequest;
}

export namespace GetPolicyRequest {
  export type AsObject = {
    policyHash: string;
  };
}

export class ListPoliciesGroupedByScopeRequest extends jspb.Message {
  getLangCode(): string;
  setLangCode(value: string): ListPoliciesGroupedByScopeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPoliciesGroupedByScopeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListPoliciesGroupedByScopeRequest): ListPoliciesGroupedByScopeRequest.AsObject;
  static serializeBinaryToWriter(message: ListPoliciesGroupedByScopeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPoliciesGroupedByScopeRequest;
  static deserializeBinaryFromReader(message: ListPoliciesGroupedByScopeRequest, reader: jspb.BinaryReader): ListPoliciesGroupedByScopeRequest;
}

export namespace ListPoliciesGroupedByScopeRequest {
  export type AsObject = {
    langCode: string;
  };
}

export class GetPolicyDetailsRequest extends jspb.Message {
  getPolicyId(): number;
  setPolicyId(value: number): GetPolicyDetailsRequest;

  getLangCode(): string;
  setLangCode(value: string): GetPolicyDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPolicyDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPolicyDetailsRequest): GetPolicyDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPolicyDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPolicyDetailsRequest;
  static deserializeBinaryFromReader(message: GetPolicyDetailsRequest, reader: jspb.BinaryReader): GetPolicyDetailsRequest;
}

export namespace GetPolicyDetailsRequest {
  export type AsObject = {
    policyId: number;
    langCode: string;
  };
}

export class PolicyDetails extends jspb.Message {
  getPolicy(): PolicyDetailsPolicy | undefined;
  setPolicy(value?: PolicyDetailsPolicy): PolicyDetails;
  hasPolicy(): boolean;
  clearPolicy(): PolicyDetails;

  getPresentation(): PolicyPresentation | undefined;
  setPresentation(value?: PolicyPresentation): PolicyDetails;
  hasPresentation(): boolean;
  clearPresentation(): PolicyDetails;

  getPolicyElementsList(): Array<PolicyDetailsElement>;
  setPolicyElementsList(value: Array<PolicyDetailsElement>): PolicyDetails;
  clearPolicyElementsList(): PolicyDetails;
  addPolicyElements(value?: PolicyDetailsElement, index?: number): PolicyDetailsElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyDetails.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyDetails): PolicyDetails.AsObject;
  static serializeBinaryToWriter(message: PolicyDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyDetails;
  static deserializeBinaryFromReader(message: PolicyDetails, reader: jspb.BinaryReader): PolicyDetails;
}

export namespace PolicyDetails {
  export type AsObject = {
    policy?: PolicyDetailsPolicy.AsObject;
    presentation?: PolicyPresentation.AsObject;
    policyElementsList: Array<PolicyDetailsElement.AsObject>;
  };
}

export class PolicyDetailsPolicy extends jspb.Message {
  getId(): number;
  setId(value: number): PolicyDetailsPolicy;

  getName(): string;
  setName(value: string): PolicyDetailsPolicy;

  getHash(): string;
  setHash(value: string): PolicyDetailsPolicy;

  getScope(): string;
  setScope(value: string): PolicyDetailsPolicy;

  getPolicyStatus(): string;
  setPolicyStatus(value: string): PolicyDetailsPolicy;

  getVersion(): number;
  setVersion(value: number): PolicyDetailsPolicy;

  getParentCategoryRef(): string;
  setParentCategoryRef(value: string): PolicyDetailsPolicy;
  hasParentCategoryRef(): boolean;
  clearParentCategoryRef(): PolicyDetailsPolicy;

  getSupportedOnRef(): string;
  setSupportedOnRef(value: string): PolicyDetailsPolicy;
  hasSupportedOnRef(): boolean;
  clearSupportedOnRef(): PolicyDetailsPolicy;

  getClientExtension(): google_protobuf_wrappers_pb.StringValue | undefined;
  setClientExtension(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsPolicy;
  hasClientExtension(): boolean;
  clearClientExtension(): PolicyDetailsPolicy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyDetailsPolicy.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyDetailsPolicy): PolicyDetailsPolicy.AsObject;
  static serializeBinaryToWriter(message: PolicyDetailsPolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyDetailsPolicy;
  static deserializeBinaryFromReader(message: PolicyDetailsPolicy, reader: jspb.BinaryReader): PolicyDetailsPolicy;
}

export namespace PolicyDetailsPolicy {
  export type AsObject = {
    id: number;
    name: string;
    hash: string;
    scope: string;
    policyStatus: string;
    version: number;
    parentCategoryRef?: string;
    supportedOnRef?: string;
    clientExtension?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };

  export enum ParentCategoryRefCase {
    _PARENT_CATEGORY_REF_NOT_SET = 0,
    PARENT_CATEGORY_REF = 7,
  }

  export enum SupportedOnRefCase {
    _SUPPORTED_ON_REF_NOT_SET = 0,
    SUPPORTED_ON_REF = 8,
  }

  export enum ClientExtensionCase {
    _CLIENT_EXTENSION_NOT_SET = 0,
    CLIENT_EXTENSION = 9,
  }
}

export class PolicyPresentation extends jspb.Message {
  getId(): number;
  setId(value: number): PolicyPresentation;

  getPresentationId(): string;
  setPresentationId(value: string): PolicyPresentation;

  getAdmlFile(): string;
  setAdmlFile(value: string): PolicyPresentation;

  getElementsList(): Array<PolicyPresentationElement>;
  setElementsList(value: Array<PolicyPresentationElement>): PolicyPresentation;
  clearElementsList(): PolicyPresentation;
  addElements(value?: PolicyPresentationElement, index?: number): PolicyPresentationElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyPresentation.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyPresentation): PolicyPresentation.AsObject;
  static serializeBinaryToWriter(message: PolicyPresentation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyPresentation;
  static deserializeBinaryFromReader(message: PolicyPresentation, reader: jspb.BinaryReader): PolicyPresentation;
}

export namespace PolicyPresentation {
  export type AsObject = {
    id: number;
    presentationId: string;
    admlFile: string;
    elementsList: Array<PolicyPresentationElement.AsObject>;
  };
}

export class PolicyPresentationElement extends jspb.Message {
  getId(): number;
  setId(value: number): PolicyPresentationElement;

  getType(): string;
  setType(value: string): PolicyPresentationElement;

  getRefId(): string;
  setRefId(value: string): PolicyPresentationElement;

  getParentElementId(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setParentElementId(value?: google_protobuf_wrappers_pb.Int32Value): PolicyPresentationElement;
  hasParentElementId(): boolean;
  clearParentElementId(): PolicyPresentationElement;

  getDefaultValue(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDefaultValue(value?: google_protobuf_wrappers_pb.StringValue): PolicyPresentationElement;
  hasDefaultValue(): boolean;
  clearDefaultValue(): PolicyPresentationElement;

  getText(): google_protobuf_wrappers_pb.StringValue | undefined;
  setText(value?: google_protobuf_wrappers_pb.StringValue): PolicyPresentationElement;
  hasText(): boolean;
  clearText(): PolicyPresentationElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyPresentationElement.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyPresentationElement): PolicyPresentationElement.AsObject;
  static serializeBinaryToWriter(message: PolicyPresentationElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyPresentationElement;
  static deserializeBinaryFromReader(message: PolicyPresentationElement, reader: jspb.BinaryReader): PolicyPresentationElement;
}

export namespace PolicyPresentationElement {
  export type AsObject = {
    id: number;
    type: string;
    refId: string;
    parentElementId?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    defaultValue?: google_protobuf_wrappers_pb.StringValue.AsObject;
    text?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };

  export enum ParentElementIdCase {
    _PARENT_ELEMENT_ID_NOT_SET = 0,
    PARENT_ELEMENT_ID = 4,
  }

  export enum DefaultValueCase {
    _DEFAULT_VALUE_NOT_SET = 0,
    DEFAULT_VALUE = 5,
  }

  export enum TextCase {
    _TEXT_NOT_SET = 0,
    TEXT = 6,
  }
}

export class PolicyDetailsElement extends jspb.Message {
  getId(): number;
  setId(value: number): PolicyDetailsElement;

  getElementId(): string;
  setElementId(value: string): PolicyDetailsElement;

  getType(): string;
  setType(value: string): PolicyDetailsElement;

  getValueName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setValueName(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElement;
  hasValueName(): boolean;
  clearValueName(): PolicyDetailsElement;

  getRegistryKey(): google_protobuf_wrappers_pb.StringValue | undefined;
  setRegistryKey(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElement;
  hasRegistryKey(): boolean;
  clearRegistryKey(): PolicyDetailsElement;

  getRequired(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setRequired(value?: google_protobuf_wrappers_pb.BoolValue): PolicyDetailsElement;
  hasRequired(): boolean;
  clearRequired(): PolicyDetailsElement;

  getMaxLength(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setMaxLength(value?: google_protobuf_wrappers_pb.Int32Value): PolicyDetailsElement;
  hasMaxLength(): boolean;
  clearMaxLength(): PolicyDetailsElement;

  getMaxStrings(): google_protobuf_wrappers_pb.StringValue | undefined;
  setMaxStrings(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElement;
  hasMaxStrings(): boolean;
  clearMaxStrings(): PolicyDetailsElement;

  getExpandable(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setExpandable(value?: google_protobuf_wrappers_pb.BoolValue): PolicyDetailsElement;
  hasExpandable(): boolean;
  clearExpandable(): PolicyDetailsElement;

  getMinValue(): google_protobuf_wrappers_pb.Int64Value | undefined;
  setMinValue(value?: google_protobuf_wrappers_pb.Int64Value): PolicyDetailsElement;
  hasMinValue(): boolean;
  clearMinValue(): PolicyDetailsElement;

  getMaxValue(): google_protobuf_wrappers_pb.Int64Value | undefined;
  setMaxValue(value?: google_protobuf_wrappers_pb.Int64Value): PolicyDetailsElement;
  hasMaxValue(): boolean;
  clearMaxValue(): PolicyDetailsElement;

  getValuePrefix(): google_protobuf_wrappers_pb.StringValue | undefined;
  setValuePrefix(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElement;
  hasValuePrefix(): boolean;
  clearValuePrefix(): PolicyDetailsElement;

  getExplicitValue(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setExplicitValue(value?: google_protobuf_wrappers_pb.BoolValue): PolicyDetailsElement;
  hasExplicitValue(): boolean;
  clearExplicitValue(): PolicyDetailsElement;

  getAdditive(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setAdditive(value?: google_protobuf_wrappers_pb.BoolValue): PolicyDetailsElement;
  hasAdditive(): boolean;
  clearAdditive(): PolicyDetailsElement;

  getItemsList(): Array<PolicyDetailsElementItem>;
  setItemsList(value: Array<PolicyDetailsElementItem>): PolicyDetailsElement;
  clearItemsList(): PolicyDetailsElement;
  addItems(value?: PolicyDetailsElementItem, index?: number): PolicyDetailsElementItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyDetailsElement.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyDetailsElement): PolicyDetailsElement.AsObject;
  static serializeBinaryToWriter(message: PolicyDetailsElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyDetailsElement;
  static deserializeBinaryFromReader(message: PolicyDetailsElement, reader: jspb.BinaryReader): PolicyDetailsElement;
}

export namespace PolicyDetailsElement {
  export type AsObject = {
    id: number;
    elementId: string;
    type: string;
    valueName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    registryKey?: google_protobuf_wrappers_pb.StringValue.AsObject;
    required?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    maxLength?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    maxStrings?: google_protobuf_wrappers_pb.StringValue.AsObject;
    expandable?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    minValue?: google_protobuf_wrappers_pb.Int64Value.AsObject;
    maxValue?: google_protobuf_wrappers_pb.Int64Value.AsObject;
    valuePrefix?: google_protobuf_wrappers_pb.StringValue.AsObject;
    explicitValue?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    additive?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    itemsList: Array<PolicyDetailsElementItem.AsObject>;
  };

  export enum ValueNameCase {
    _VALUE_NAME_NOT_SET = 0,
    VALUE_NAME = 4,
  }

  export enum RegistryKeyCase {
    _REGISTRY_KEY_NOT_SET = 0,
    REGISTRY_KEY = 5,
  }

  export enum RequiredCase {
    _REQUIRED_NOT_SET = 0,
    REQUIRED = 6,
  }

  export enum MaxLengthCase {
    _MAX_LENGTH_NOT_SET = 0,
    MAX_LENGTH = 7,
  }

  export enum MaxStringsCase {
    _MAX_STRINGS_NOT_SET = 0,
    MAX_STRINGS = 8,
  }

  export enum ExpandableCase {
    _EXPANDABLE_NOT_SET = 0,
    EXPANDABLE = 9,
  }

  export enum MinValueCase {
    _MIN_VALUE_NOT_SET = 0,
    MIN_VALUE = 10,
  }

  export enum MaxValueCase {
    _MAX_VALUE_NOT_SET = 0,
    MAX_VALUE = 11,
  }

  export enum ValuePrefixCase {
    _VALUE_PREFIX_NOT_SET = 0,
    VALUE_PREFIX = 12,
  }

  export enum ExplicitValueCase {
    _EXPLICIT_VALUE_NOT_SET = 0,
    EXPLICIT_VALUE = 13,
  }

  export enum AdditiveCase {
    _ADDITIVE_NOT_SET = 0,
    ADDITIVE = 14,
  }
}

export class PolicyDetailsElementItem extends jspb.Message {
  getId(): number;
  setId(value: number): PolicyDetailsElementItem;

  getName(): string;
  setName(value: string): PolicyDetailsElementItem;

  getParentType(): string;
  setParentType(value: string): PolicyDetailsElementItem;

  getType(): string;
  setType(value: string): PolicyDetailsElementItem;

  getValueType(): string;
  setValueType(value: string): PolicyDetailsElementItem;

  getValueName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setValueName(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElementItem;
  hasValueName(): boolean;
  clearValueName(): PolicyDetailsElementItem;

  getRequired(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setRequired(value?: google_protobuf_wrappers_pb.BoolValue): PolicyDetailsElementItem;
  hasRequired(): boolean;
  clearRequired(): PolicyDetailsElementItem;

  getParentId(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setParentId(value?: google_protobuf_wrappers_pb.Int32Value): PolicyDetailsElementItem;
  hasParentId(): boolean;
  clearParentId(): PolicyDetailsElementItem;

  getDisplayName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDisplayName(value?: google_protobuf_wrappers_pb.StringValue): PolicyDetailsElementItem;
  hasDisplayName(): boolean;
  clearDisplayName(): PolicyDetailsElementItem;

  getValue(): string;
  setValue(value: string): PolicyDetailsElementItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyDetailsElementItem.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyDetailsElementItem): PolicyDetailsElementItem.AsObject;
  static serializeBinaryToWriter(message: PolicyDetailsElementItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyDetailsElementItem;
  static deserializeBinaryFromReader(message: PolicyDetailsElementItem, reader: jspb.BinaryReader): PolicyDetailsElementItem;
}

export namespace PolicyDetailsElementItem {
  export type AsObject = {
    id: number;
    name: string;
    parentType: string;
    type: string;
    valueType: string;
    valueName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    required?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    parentId?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    displayName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    value: string;
  };

  export enum ValueNameCase {
    _VALUE_NAME_NOT_SET = 0,
    VALUE_NAME = 6,
  }

  export enum RequiredCase {
    _REQUIRED_NOT_SET = 0,
    REQUIRED = 7,
  }

  export enum ParentIdCase {
    _PARENT_ID_NOT_SET = 0,
    PARENT_ID = 8,
  }

  export enum DisplayNameCase {
    _DISPLAY_NAME_NOT_SET = 0,
    DISPLAY_NAME = 9,
  }
}

export class ListPoliciesGroupedByScopeResponse extends jspb.Message {
  getGroupsList(): Array<PolicyGroup>;
  setGroupsList(value: Array<PolicyGroup>): ListPoliciesGroupedByScopeResponse;
  clearGroupsList(): ListPoliciesGroupedByScopeResponse;
  addGroups(value?: PolicyGroup, index?: number): PolicyGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPoliciesGroupedByScopeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListPoliciesGroupedByScopeResponse): ListPoliciesGroupedByScopeResponse.AsObject;
  static serializeBinaryToWriter(message: ListPoliciesGroupedByScopeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPoliciesGroupedByScopeResponse;
  static deserializeBinaryFromReader(message: ListPoliciesGroupedByScopeResponse, reader: jspb.BinaryReader): ListPoliciesGroupedByScopeResponse;
}

export namespace ListPoliciesGroupedByScopeResponse {
  export type AsObject = {
    groupsList: Array<PolicyGroup.AsObject>;
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

  getPresentationRef(): string;
  setPresentationRef(value: string): PolicyDescriptor;

  getPolicyStatus(): PolicyStatus;
  setPolicyStatus(value: PolicyStatus): PolicyDescriptor;

  getVersion(): number;
  setVersion(value: number): PolicyDescriptor;

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

  getExplainText(): string;
  setExplainText(value: string): PolicyDescriptor;

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
    presentationRef: string;
    policyStatus: PolicyStatus;
    version: number;
    elementsList: Array<PolicyElement.AsObject>;
    requiredCapabilitiesList: Array<string>;
    requiredHardwareList: Array<string>;
    admxFileHashesList: Array<string>;
    explainText: string;
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

export class PolicyGroup extends jspb.Message {
  getScope(): string;
  setScope(value: string): PolicyGroup;

  getPoliciesList(): Array<PolicySummary>;
  setPoliciesList(value: Array<PolicySummary>): PolicyGroup;
  clearPoliciesList(): PolicyGroup;
  addPolicies(value?: PolicySummary, index?: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyGroup.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyGroup): PolicyGroup.AsObject;
  static serializeBinaryToWriter(message: PolicyGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyGroup;
  static deserializeBinaryFromReader(message: PolicyGroup, reader: jspb.BinaryReader): PolicyGroup;
}

export namespace PolicyGroup {
  export type AsObject = {
    scope: string;
    policiesList: Array<PolicySummary.AsObject>;
  };
}

export class PolicySummary extends jspb.Message {
  getId(): number;
  setId(value: number): PolicySummary;

  getName(): string;
  setName(value: string): PolicySummary;

  getDisplayName(): string;
  setDisplayName(value: string): PolicySummary;

  getExplainText(): string;
  setExplainText(value: string): PolicySummary;

  getScope(): PolicyScope;
  setScope(value: PolicyScope): PolicySummary;

  getPolicyStatus(): PolicyStatus;
  setPolicyStatus(value: PolicyStatus): PolicySummary;

  getVersion(): number;
  setVersion(value: number): PolicySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicySummary.AsObject;
  static toObject(includeInstance: boolean, msg: PolicySummary): PolicySummary.AsObject;
  static serializeBinaryToWriter(message: PolicySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicySummary;
  static deserializeBinaryFromReader(message: PolicySummary, reader: jspb.BinaryReader): PolicySummary;
}

export namespace PolicySummary {
  export type AsObject = {
    id: number;
    name: string;
    displayName: string;
    explainText: string;
    scope: PolicyScope;
    policyStatus: PolicyStatus;
    version: number;
  };
}

export class RestoreAllPoliciesRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): RestoreAllPoliciesRequest;
  hasTarget(): boolean;
  clearTarget(): RestoreAllPoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreAllPoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreAllPoliciesRequest): RestoreAllPoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: RestoreAllPoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreAllPoliciesRequest;
  static deserializeBinaryFromReader(message: RestoreAllPoliciesRequest, reader: jspb.BinaryReader): RestoreAllPoliciesRequest;
}

export namespace RestoreAllPoliciesRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
  };
}

export class RestoreAllPoliciesResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): RestoreAllPoliciesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreAllPoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreAllPoliciesResponse): RestoreAllPoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: RestoreAllPoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreAllPoliciesResponse;
  static deserializeBinaryFromReader(message: RestoreAllPoliciesResponse, reader: jspb.BinaryReader): RestoreAllPoliciesResponse;
}

export namespace RestoreAllPoliciesResponse {
  export type AsObject = {
    status: ACResponseStatus;
  };
}

export class AssignPolicyCollectionRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): AssignPolicyCollectionRequest;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): AssignPolicyCollectionRequest;
  hasTarget(): boolean;
  clearTarget(): AssignPolicyCollectionRequest;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): AssignPolicyCollectionRequest;
  hasSelection(): boolean;
  clearSelection(): AssignPolicyCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssignPolicyCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AssignPolicyCollectionRequest): AssignPolicyCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: AssignPolicyCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssignPolicyCollectionRequest;
  static deserializeBinaryFromReader(message: AssignPolicyCollectionRequest, reader: jspb.BinaryReader): AssignPolicyCollectionRequest;
}

export namespace AssignPolicyCollectionRequest {
  export type AsObject = {
    collectionId: number;
    target?: common_target_pb.Target.AsObject;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class AssignPolicyCollectionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssignPolicyCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AssignPolicyCollectionResponse): AssignPolicyCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: AssignPolicyCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssignPolicyCollectionResponse;
  static deserializeBinaryFromReader(message: AssignPolicyCollectionResponse, reader: jspb.BinaryReader): AssignPolicyCollectionResponse;
}

export namespace AssignPolicyCollectionResponse {
  export type AsObject = {
  };
}

export class RemovePolicyCollectionRequest extends jspb.Message {
  getCollectionId(): number;
  setCollectionId(value: number): RemovePolicyCollectionRequest;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): RemovePolicyCollectionRequest;
  hasTarget(): boolean;
  clearTarget(): RemovePolicyCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePolicyCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePolicyCollectionRequest): RemovePolicyCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: RemovePolicyCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePolicyCollectionRequest;
  static deserializeBinaryFromReader(message: RemovePolicyCollectionRequest, reader: jspb.BinaryReader): RemovePolicyCollectionRequest;
}

export namespace RemovePolicyCollectionRequest {
  export type AsObject = {
    collectionId: number;
    target?: common_target_pb.Target.AsObject;
  };
}

export class RemovePolicyCollectionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePolicyCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePolicyCollectionResponse): RemovePolicyCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: RemovePolicyCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePolicyCollectionResponse;
  static deserializeBinaryFromReader(message: RemovePolicyCollectionResponse, reader: jspb.BinaryReader): RemovePolicyCollectionResponse;
}

export namespace RemovePolicyCollectionResponse {
  export type AsObject = {
  };
}

export class AssignPolicyRequest extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): AssignPolicyRequest;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): AssignPolicyRequest;
  hasTarget(): boolean;
  clearTarget(): AssignPolicyRequest;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): AssignPolicyRequest;
  hasSelection(): boolean;
  clearSelection(): AssignPolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssignPolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AssignPolicyRequest): AssignPolicyRequest.AsObject;
  static serializeBinaryToWriter(message: AssignPolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssignPolicyRequest;
  static deserializeBinaryFromReader(message: AssignPolicyRequest, reader: jspb.BinaryReader): AssignPolicyRequest;
}

export namespace AssignPolicyRequest {
  export type AsObject = {
    policyHash: string;
    target?: common_target_pb.Target.AsObject;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class AssignPolicyResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssignPolicyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AssignPolicyResponse): AssignPolicyResponse.AsObject;
  static serializeBinaryToWriter(message: AssignPolicyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssignPolicyResponse;
  static deserializeBinaryFromReader(message: AssignPolicyResponse, reader: jspb.BinaryReader): AssignPolicyResponse;
}

export namespace AssignPolicyResponse {
  export type AsObject = {
  };
}

export class RemovePolicyRequest extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): RemovePolicyRequest;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): RemovePolicyRequest;
  hasTarget(): boolean;
  clearTarget(): RemovePolicyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePolicyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePolicyRequest): RemovePolicyRequest.AsObject;
  static serializeBinaryToWriter(message: RemovePolicyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePolicyRequest;
  static deserializeBinaryFromReader(message: RemovePolicyRequest, reader: jspb.BinaryReader): RemovePolicyRequest;
}

export namespace RemovePolicyRequest {
  export type AsObject = {
    policyHash: string;
    target?: common_target_pb.Target.AsObject;
  };
}

export class RemovePolicyResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePolicyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePolicyResponse): RemovePolicyResponse.AsObject;
  static serializeBinaryToWriter(message: RemovePolicyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePolicyResponse;
  static deserializeBinaryFromReader(message: RemovePolicyResponse, reader: jspb.BinaryReader): RemovePolicyResponse;
}

export namespace RemovePolicyResponse {
  export type AsObject = {
  };
}

export class PolicyValueOverride extends jspb.Message {
  getDword(): number;
  setDword(value: number): PolicyValueOverride;
  hasDword(): boolean;
  clearDword(): PolicyValueOverride;

  getStringValue(): string;
  setStringValue(value: string): PolicyValueOverride;
  hasStringValue(): boolean;
  clearStringValue(): PolicyValueOverride;

  getValueCase(): PolicyValueOverride.ValueCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyValueOverride.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyValueOverride): PolicyValueOverride.AsObject;
  static serializeBinaryToWriter(message: PolicyValueOverride, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyValueOverride;
  static deserializeBinaryFromReader(message: PolicyValueOverride, reader: jspb.BinaryReader): PolicyValueOverride;
}

export namespace PolicyValueOverride {
  export type AsObject = {
    dword?: number;
    stringValue?: string;
  };

  export enum ValueCase {
    VALUE_NOT_SET = 0,
    DWORD = 1,
    STRING_VALUE = 2,
  }
}

export class ExportPolicyStateRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ExportPolicyStateRequest;
  hasTarget(): boolean;
  clearTarget(): ExportPolicyStateRequest;

  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportPolicyStateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportPolicyStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportPolicyStateRequest): ExportPolicyStateRequest.AsObject;
  static serializeBinaryToWriter(message: ExportPolicyStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportPolicyStateRequest;
  static deserializeBinaryFromReader(message: ExportPolicyStateRequest, reader: jspb.BinaryReader): ExportPolicyStateRequest;
}

export namespace ExportPolicyStateRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class GetEffectivePoliciesRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetEffectivePoliciesRequest;
  hasTarget(): boolean;
  clearTarget(): GetEffectivePoliciesRequest;

  getLangCode(): string;
  setLangCode(value: string): GetEffectivePoliciesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEffectivePoliciesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEffectivePoliciesRequest): GetEffectivePoliciesRequest.AsObject;
  static serializeBinaryToWriter(message: GetEffectivePoliciesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEffectivePoliciesRequest;
  static deserializeBinaryFromReader(message: GetEffectivePoliciesRequest, reader: jspb.BinaryReader): GetEffectivePoliciesRequest;
}

export namespace GetEffectivePoliciesRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    langCode: string;
  };
}

export class GetEffectivePoliciesResponse extends jspb.Message {
  getPoliciesList(): Array<EffectivePolicy>;
  setPoliciesList(value: Array<EffectivePolicy>): GetEffectivePoliciesResponse;
  clearPoliciesList(): GetEffectivePoliciesResponse;
  addPolicies(value?: EffectivePolicy, index?: number): EffectivePolicy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEffectivePoliciesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEffectivePoliciesResponse): GetEffectivePoliciesResponse.AsObject;
  static serializeBinaryToWriter(message: GetEffectivePoliciesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEffectivePoliciesResponse;
  static deserializeBinaryFromReader(message: GetEffectivePoliciesResponse, reader: jspb.BinaryReader): GetEffectivePoliciesResponse;
}

export namespace GetEffectivePoliciesResponse {
  export type AsObject = {
    policiesList: Array<EffectivePolicy.AsObject>;
  };
}

export class EffectivePolicy extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): EffectivePolicy;

  getSource(): PolicySource;
  setSource(value: PolicySource): EffectivePolicy;

  getUsersid(): string;
  setUsersid(value: string): EffectivePolicy;

  getSummary(): PolicySummary | undefined;
  setSummary(value?: PolicySummary): EffectivePolicy;
  hasSummary(): boolean;
  clearSummary(): EffectivePolicy;

  getSelection(): common_policy_pb.PolicySelection | undefined;
  setSelection(value?: common_policy_pb.PolicySelection): EffectivePolicy;
  hasSelection(): boolean;
  clearSelection(): EffectivePolicy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EffectivePolicy.AsObject;
  static toObject(includeInstance: boolean, msg: EffectivePolicy): EffectivePolicy.AsObject;
  static serializeBinaryToWriter(message: EffectivePolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EffectivePolicy;
  static deserializeBinaryFromReader(message: EffectivePolicy, reader: jspb.BinaryReader): EffectivePolicy;
}

export namespace EffectivePolicy {
  export type AsObject = {
    policyHash: string;
    source: PolicySource;
    usersid: string;
    summary?: PolicySummary.AsObject;
    selection?: common_policy_pb.PolicySelection.AsObject;
  };
}

export class GetAssignmentsRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetAssignmentsRequest;
  hasTarget(): boolean;
  clearTarget(): GetAssignmentsRequest;

  getLangCode(): string;
  setLangCode(value: string): GetAssignmentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAssignmentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAssignmentsRequest): GetAssignmentsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAssignmentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAssignmentsRequest;
  static deserializeBinaryFromReader(message: GetAssignmentsRequest, reader: jspb.BinaryReader): GetAssignmentsRequest;
}

export namespace GetAssignmentsRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    langCode: string;
  };
}

export class GetAssignmentsResponse extends jspb.Message {
  getAssignmentsList(): Array<PolicyAssignment>;
  setAssignmentsList(value: Array<PolicyAssignment>): GetAssignmentsResponse;
  clearAssignmentsList(): GetAssignmentsResponse;
  addAssignments(value?: PolicyAssignment, index?: number): PolicyAssignment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAssignmentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAssignmentsResponse): GetAssignmentsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAssignmentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAssignmentsResponse;
  static deserializeBinaryFromReader(message: GetAssignmentsResponse, reader: jspb.BinaryReader): GetAssignmentsResponse;
}

export namespace GetAssignmentsResponse {
  export type AsObject = {
    assignmentsList: Array<PolicyAssignment.AsObject>;
  };
}

export class PolicyAssignment extends jspb.Message {
  getPolicyHash(): string;
  setPolicyHash(value: string): PolicyAssignment;

  getDesiredState(): PolicyDesiredState;
  setDesiredState(value: PolicyDesiredState): PolicyAssignment;

  getOverride(): PolicyValueOverride | undefined;
  setOverride(value?: PolicyValueOverride): PolicyAssignment;
  hasOverride(): boolean;
  clearOverride(): PolicyAssignment;

  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): PolicyAssignment;
  hasTarget(): boolean;
  clearTarget(): PolicyAssignment;

  getSid(): string;
  setSid(value: string): PolicyAssignment;

  getSummary(): PolicySummary | undefined;
  setSummary(value?: PolicySummary): PolicyAssignment;
  hasSummary(): boolean;
  clearSummary(): PolicyAssignment;

  getStateList(): Array<PolicyAssigmentsState>;
  setStateList(value: Array<PolicyAssigmentsState>): PolicyAssignment;
  clearStateList(): PolicyAssignment;
  addState(value?: PolicyAssigmentsState, index?: number): PolicyAssigmentsState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyAssignment.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyAssignment): PolicyAssignment.AsObject;
  static serializeBinaryToWriter(message: PolicyAssignment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyAssignment;
  static deserializeBinaryFromReader(message: PolicyAssignment, reader: jspb.BinaryReader): PolicyAssignment;
}

export namespace PolicyAssignment {
  export type AsObject = {
    policyHash: string;
    desiredState: PolicyDesiredState;
    override?: PolicyValueOverride.AsObject;
    target?: common_target_pb.Target.AsObject;
    sid: string;
    summary?: PolicySummary.AsObject;
    stateList: Array<PolicyAssigmentsState.AsObject>;
  };
}

export class PolicyAssigmentsState extends jspb.Message {
  getIdName(): string;
  setIdName(value: string): PolicyAssigmentsState;

  getValue(): string;
  setValue(value: string): PolicyAssigmentsState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyAssigmentsState.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyAssigmentsState): PolicyAssigmentsState.AsObject;
  static serializeBinaryToWriter(message: PolicyAssigmentsState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyAssigmentsState;
  static deserializeBinaryFromReader(message: PolicyAssigmentsState, reader: jspb.BinaryReader): PolicyAssigmentsState;
}

export namespace PolicyAssigmentsState {
  export type AsObject = {
    idName: string;
    value: string;
  };
}

export enum PolicyScope {
  POLICY_SCOPE_NONE = 0,
  POLICY_SCOPE_USER = 1,
  POLICY_SCOPE_MACHINE = 2,
  POLICY_SCOPE_BOTH = 3,
}
export enum PolicyDesiredState {
  POLICY_DESIRED_STATE_UNSPECIFIED = 0,
  POLICY_DESIRED_STATE_ENABLED = 1,
  POLICY_DESIRED_STATE_DISABLED = 2,
}
export enum PolicySource {
  POLICY_SOURCE_UNSPECIFIED = 0,
  POLICY_SOURCE_GLOBAL = 1,
  POLICY_SOURCE_AGENT = 2,
  POLICY_SOURCE_USER = 3,
}
export enum PolicyStatus {
  DRAFT = 0,
  APPROVE = 1,
  REJECTED = 2,
  OBSOLETE = 3,
}
export enum ACResponseStatus {
  RESPONSE_STATUS_OK = 0,
  RESPONSE_STATUS_ERROR = 1,
}
