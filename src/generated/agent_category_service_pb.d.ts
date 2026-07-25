import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as common_export_pb from './common/export_pb'; // proto import: "common/export.proto"


export class ExportCategoriesRequest extends jspb.Message {
  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportCategoriesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportCategoriesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportCategoriesRequest): ExportCategoriesRequest.AsObject;
  static serializeBinaryToWriter(message: ExportCategoriesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportCategoriesRequest;
  static deserializeBinaryFromReader(message: ExportCategoriesRequest, reader: jspb.BinaryReader): ExportCategoriesRequest;
}

export namespace ExportCategoriesRequest {
  export type AsObject = {
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class AgentCategoryIdRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): AgentCategoryIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryIdRequest): AgentCategoryIdRequest.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryIdRequest;
  static deserializeBinaryFromReader(message: AgentCategoryIdRequest, reader: jspb.BinaryReader): AgentCategoryIdRequest;
}

export namespace AgentCategoryIdRequest {
  export type AsObject = {
    categoryId: number;
  };
}

export class GetAgentCategoryRequest extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): GetAgentCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAgentCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAgentCategoryRequest): GetAgentCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetAgentCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAgentCategoryRequest;
  static deserializeBinaryFromReader(message: GetAgentCategoryRequest, reader: jspb.BinaryReader): GetAgentCategoryRequest;
}

export namespace GetAgentCategoryRequest {
  export type AsObject = {
    agentId: string;
  };
}

export class GetAgentCategoryResponse extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): GetAgentCategoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAgentCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAgentCategoryResponse): GetAgentCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetAgentCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAgentCategoryResponse;
  static deserializeBinaryFromReader(message: GetAgentCategoryResponse, reader: jspb.BinaryReader): GetAgentCategoryResponse;
}

export namespace GetAgentCategoryResponse {
  export type AsObject = {
    categoryId: number;
  };
}

export class CreateAgentCategoryRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateAgentCategoryRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): CreateAgentCategoryRequest;
  hasDescription(): boolean;
  clearDescription(): CreateAgentCategoryRequest;

  getParentId(): number;
  setParentId(value: number): CreateAgentCategoryRequest;
  hasParentId(): boolean;
  clearParentId(): CreateAgentCategoryRequest;

  getMaxAgents(): number;
  setMaxAgents(value: number): CreateAgentCategoryRequest;

  getOsVersion(): string;
  setOsVersion(value: string): CreateAgentCategoryRequest;
  hasOsVersion(): boolean;
  clearOsVersion(): CreateAgentCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAgentCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAgentCategoryRequest): CreateAgentCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: CreateAgentCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAgentCategoryRequest;
  static deserializeBinaryFromReader(message: CreateAgentCategoryRequest, reader: jspb.BinaryReader): CreateAgentCategoryRequest;
}

export namespace CreateAgentCategoryRequest {
  export type AsObject = {
    name: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    parentId?: number;
    maxAgents: number;
    osVersion?: string;
  };

  export enum ParentIdCase {
    _PARENT_ID_NOT_SET = 0,
    PARENT_ID = 3,
  }

  export enum OsVersionCase {
    _OS_VERSION_NOT_SET = 0,
    OS_VERSION = 5,
  }
}

export class UpdateAgentCategoryRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): UpdateAgentCategoryRequest;

  getName(): string;
  setName(value: string): UpdateAgentCategoryRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UpdateAgentCategoryRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateAgentCategoryRequest;

  getMaxAgents(): number;
  setMaxAgents(value: number): UpdateAgentCategoryRequest;

  getOsVersion(): string;
  setOsVersion(value: string): UpdateAgentCategoryRequest;
  hasOsVersion(): boolean;
  clearOsVersion(): UpdateAgentCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateAgentCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateAgentCategoryRequest): UpdateAgentCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateAgentCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateAgentCategoryRequest;
  static deserializeBinaryFromReader(message: UpdateAgentCategoryRequest, reader: jspb.BinaryReader): UpdateAgentCategoryRequest;
}

export namespace UpdateAgentCategoryRequest {
  export type AsObject = {
    categoryId: number;
    name: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    maxAgents: number;
    osVersion?: string;
  };

  export enum OsVersionCase {
    _OS_VERSION_NOT_SET = 0,
    OS_VERSION = 5,
  }
}

export class SetCategoryParentRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): SetCategoryParentRequest;

  getParentId(): number;
  setParentId(value: number): SetCategoryParentRequest;
  hasParentId(): boolean;
  clearParentId(): SetCategoryParentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetCategoryParentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetCategoryParentRequest): SetCategoryParentRequest.AsObject;
  static serializeBinaryToWriter(message: SetCategoryParentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetCategoryParentRequest;
  static deserializeBinaryFromReader(message: SetCategoryParentRequest, reader: jspb.BinaryReader): SetCategoryParentRequest;
}

export namespace SetCategoryParentRequest {
  export type AsObject = {
    categoryId: number;
    parentId?: number;
  };

  export enum ParentIdCase {
    _PARENT_ID_NOT_SET = 0,
    PARENT_ID = 2,
  }
}

export class SetCategoryAgentsRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): SetCategoryAgentsRequest;

  getAgentIdsList(): Array<string>;
  setAgentIdsList(value: Array<string>): SetCategoryAgentsRequest;
  clearAgentIdsList(): SetCategoryAgentsRequest;
  addAgentIds(value: string, index?: number): SetCategoryAgentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetCategoryAgentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetCategoryAgentsRequest): SetCategoryAgentsRequest.AsObject;
  static serializeBinaryToWriter(message: SetCategoryAgentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetCategoryAgentsRequest;
  static deserializeBinaryFromReader(message: SetCategoryAgentsRequest, reader: jspb.BinaryReader): SetCategoryAgentsRequest;
}

export namespace SetCategoryAgentsRequest {
  export type AsObject = {
    categoryId: number;
    agentIdsList: Array<string>;
  };
}

export class AddAgentToCategoryRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): AddAgentToCategoryRequest;

  getAgentId(): string;
  setAgentId(value: string): AddAgentToCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddAgentToCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddAgentToCategoryRequest): AddAgentToCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: AddAgentToCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddAgentToCategoryRequest;
  static deserializeBinaryFromReader(message: AddAgentToCategoryRequest, reader: jspb.BinaryReader): AddAgentToCategoryRequest;
}

export namespace AddAgentToCategoryRequest {
  export type AsObject = {
    categoryId: number;
    agentId: string;
  };
}

export class RemoveAgentFromCategoryRequest extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): RemoveAgentFromCategoryRequest;

  getAgentId(): string;
  setAgentId(value: string): RemoveAgentFromCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveAgentFromCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveAgentFromCategoryRequest): RemoveAgentFromCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveAgentFromCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveAgentFromCategoryRequest;
  static deserializeBinaryFromReader(message: RemoveAgentFromCategoryRequest, reader: jspb.BinaryReader): RemoveAgentFromCategoryRequest;
}

export namespace RemoveAgentFromCategoryRequest {
  export type AsObject = {
    categoryId: number;
    agentId: string;
  };
}

export class AgentCategoryControlResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): AgentCategoryControlResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentCategoryControlResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentCategoryControlResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryControlResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryControlResponse): AgentCategoryControlResponse.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryControlResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryControlResponse;
  static deserializeBinaryFromReader(message: AgentCategoryControlResponse, reader: jspb.BinaryReader): AgentCategoryControlResponse;
}

export namespace AgentCategoryControlResponse {
  export type AsObject = {
    status: ACResponseStatus;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }
}

export class CreateAgentCategoryResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): CreateAgentCategoryResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): CreateAgentCategoryResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): CreateAgentCategoryResponse;

  getCategoryId(): number;
  setCategoryId(value: number): CreateAgentCategoryResponse;
  hasCategoryId(): boolean;
  clearCategoryId(): CreateAgentCategoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAgentCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAgentCategoryResponse): CreateAgentCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: CreateAgentCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAgentCategoryResponse;
  static deserializeBinaryFromReader(message: CreateAgentCategoryResponse, reader: jspb.BinaryReader): CreateAgentCategoryResponse;
}

export namespace CreateAgentCategoryResponse {
  export type AsObject = {
    status: ACResponseStatus;
    errorMessage?: string;
    categoryId?: number;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }

  export enum CategoryIdCase {
    _CATEGORY_ID_NOT_SET = 0,
    CATEGORY_ID = 3,
  }
}

export class AgentCategoryResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): AgentCategoryResponse;

  getCategory(): AgentCategoryWithIdInfo | undefined;
  setCategory(value?: AgentCategoryWithIdInfo): AgentCategoryResponse;
  hasCategory(): boolean;
  clearCategory(): AgentCategoryResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentCategoryResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentCategoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryResponse): AgentCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryResponse;
  static deserializeBinaryFromReader(message: AgentCategoryResponse, reader: jspb.BinaryReader): AgentCategoryResponse;
}

export namespace AgentCategoryResponse {
  export type AsObject = {
    status: ACResponseStatus;
    category?: AgentCategoryWithIdInfo.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class AgentCategoriesResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): AgentCategoriesResponse;

  getCategoriesList(): Array<AgentCategoryWithIdInfo>;
  setCategoriesList(value: Array<AgentCategoryWithIdInfo>): AgentCategoriesResponse;
  clearCategoriesList(): AgentCategoriesResponse;
  addCategories(value?: AgentCategoryWithIdInfo, index?: number): AgentCategoryWithIdInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentCategoriesResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentCategoriesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoriesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoriesResponse): AgentCategoriesResponse.AsObject;
  static serializeBinaryToWriter(message: AgentCategoriesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoriesResponse;
  static deserializeBinaryFromReader(message: AgentCategoriesResponse, reader: jspb.BinaryReader): AgentCategoriesResponse;
}

export namespace AgentCategoriesResponse {
  export type AsObject = {
    status: ACResponseStatus;
    categoriesList: Array<AgentCategoryWithIdInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class AgentCategoryTreeResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): AgentCategoryTreeResponse;

  getRootsList(): Array<AgentCategoryTreeNode>;
  setRootsList(value: Array<AgentCategoryTreeNode>): AgentCategoryTreeResponse;
  clearRootsList(): AgentCategoryTreeResponse;
  addRoots(value?: AgentCategoryTreeNode, index?: number): AgentCategoryTreeNode;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentCategoryTreeResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentCategoryTreeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryTreeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryTreeResponse): AgentCategoryTreeResponse.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryTreeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryTreeResponse;
  static deserializeBinaryFromReader(message: AgentCategoryTreeResponse, reader: jspb.BinaryReader): AgentCategoryTreeResponse;
}

export namespace AgentCategoryTreeResponse {
  export type AsObject = {
    status: ACResponseStatus;
    rootsList: Array<AgentCategoryTreeNode.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class AgentCategoryWithIdInfo extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): AgentCategoryWithIdInfo;

  getInfo(): AgentCategoryInfo | undefined;
  setInfo(value?: AgentCategoryInfo): AgentCategoryWithIdInfo;
  hasInfo(): boolean;
  clearInfo(): AgentCategoryWithIdInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryWithIdInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryWithIdInfo): AgentCategoryWithIdInfo.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryWithIdInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryWithIdInfo;
  static deserializeBinaryFromReader(message: AgentCategoryWithIdInfo, reader: jspb.BinaryReader): AgentCategoryWithIdInfo;
}

export namespace AgentCategoryWithIdInfo {
  export type AsObject = {
    categoryId: number;
    info?: AgentCategoryInfo.AsObject;
  };
}

export class AgentCategoryTreeNode extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): AgentCategoryTreeNode;

  getName(): string;
  setName(value: string): AgentCategoryTreeNode;

  getDescription(): string;
  setDescription(value: string): AgentCategoryTreeNode;

  getChildrenList(): Array<AgentCategoryTreeNode>;
  setChildrenList(value: Array<AgentCategoryTreeNode>): AgentCategoryTreeNode;
  clearChildrenList(): AgentCategoryTreeNode;
  addChildren(value?: AgentCategoryTreeNode, index?: number): AgentCategoryTreeNode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryTreeNode.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryTreeNode): AgentCategoryTreeNode.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryTreeNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryTreeNode;
  static deserializeBinaryFromReader(message: AgentCategoryTreeNode, reader: jspb.BinaryReader): AgentCategoryTreeNode;
}

export namespace AgentCategoryTreeNode {
  export type AsObject = {
    categoryId: number;
    name: string;
    description: string;
    childrenList: Array<AgentCategoryTreeNode.AsObject>;
  };
}

export class AgentCategoryInfo extends jspb.Message {
  getName(): string;
  setName(value: string): AgentCategoryInfo;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): AgentCategoryInfo;
  hasDescription(): boolean;
  clearDescription(): AgentCategoryInfo;

  getParentId(): google_protobuf_wrappers_pb.Int64Value | undefined;
  setParentId(value?: google_protobuf_wrappers_pb.Int64Value): AgentCategoryInfo;
  hasParentId(): boolean;
  clearParentId(): AgentCategoryInfo;

  getMaxAgents(): number;
  setMaxAgents(value: number): AgentCategoryInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryInfo): AgentCategoryInfo.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryInfo;
  static deserializeBinaryFromReader(message: AgentCategoryInfo, reader: jspb.BinaryReader): AgentCategoryInfo;
}

export namespace AgentCategoryInfo {
  export type AsObject = {
    name: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    parentId?: google_protobuf_wrappers_pb.Int64Value.AsObject;
    maxAgents: number;
  };

  export enum ParentIdCase {
    _PARENT_ID_NOT_SET = 0,
    PARENT_ID = 3,
  }
}

export class AgentsListResponse extends jspb.Message {
  getStatus(): ACResponseStatus;
  setStatus(value: ACResponseStatus): AgentsListResponse;

  getAgentIdsList(): Array<string>;
  setAgentIdsList(value: Array<string>): AgentsListResponse;
  clearAgentIdsList(): AgentsListResponse;
  addAgentIds(value: string, index?: number): AgentsListResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentsListResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentsListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentsListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentsListResponse): AgentsListResponse.AsObject;
  static serializeBinaryToWriter(message: AgentsListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentsListResponse;
  static deserializeBinaryFromReader(message: AgentsListResponse, reader: jspb.BinaryReader): AgentsListResponse;
}

export namespace AgentsListResponse {
  export type AsObject = {
    status: ACResponseStatus;
    agentIdsList: Array<string>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export enum ACResponseStatus {
  AC_RESPONSE_STATUS_OK = 0,
  AC_RESPONSE_STATUS_ERROR = 1,
}
