import * as jspb from 'google-protobuf'

import * as common_user_pb from './common/user_pb'; // proto import: "common/user.proto"
import * as common_target_pb from './common/target_pb'; // proto import: "common/target.proto"
import * as common_export_pb from './common/export_pb'; // proto import: "common/export.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class ExportAllGroupRequest extends jspb.Message {
  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportAllGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportAllGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportAllGroupRequest): ExportAllGroupRequest.AsObject;
  static serializeBinaryToWriter(message: ExportAllGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportAllGroupRequest;
  static deserializeBinaryFromReader(message: ExportAllGroupRequest, reader: jspb.BinaryReader): ExportAllGroupRequest;
}

export namespace ExportAllGroupRequest {
  export type AsObject = {
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class ExportAllUsersRequest extends jspb.Message {
  getExportFormat(): common_export_pb.ExportFormat;
  setExportFormat(value: common_export_pb.ExportFormat): ExportAllUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportAllUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportAllUsersRequest): ExportAllUsersRequest.AsObject;
  static serializeBinaryToWriter(message: ExportAllUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportAllUsersRequest;
  static deserializeBinaryFromReader(message: ExportAllUsersRequest, reader: jspb.BinaryReader): ExportAllUsersRequest;
}

export namespace ExportAllUsersRequest {
  export type AsObject = {
    exportFormat: common_export_pb.ExportFormat;
  };
}

export class CreateUserRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): CreateUserRequest;
  hasTarget(): boolean;
  clearTarget(): CreateUserRequest;

  getUser(): common_user_pb.UserRequest | undefined;
  setUser(value?: common_user_pb.UserRequest): CreateUserRequest;
  hasUser(): boolean;
  clearUser(): CreateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserRequest): CreateUserRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserRequest;
  static deserializeBinaryFromReader(message: CreateUserRequest, reader: jspb.BinaryReader): CreateUserRequest;
}

export namespace CreateUserRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    user?: common_user_pb.UserRequest.AsObject;
  };
}

export class UpdateUserRequest extends jspb.Message {
  getUser(): UserIdentifier | undefined;
  setUser(value?: UserIdentifier): UpdateUserRequest;
  hasUser(): boolean;
  clearUser(): UpdateUserRequest;

  getData(): common_user_pb.UserRequest | undefined;
  setData(value?: common_user_pb.UserRequest): UpdateUserRequest;
  hasData(): boolean;
  clearData(): UpdateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserRequest): UpdateUserRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserRequest;
  static deserializeBinaryFromReader(message: UpdateUserRequest, reader: jspb.BinaryReader): UpdateUserRequest;
}

export namespace UpdateUserRequest {
  export type AsObject = {
    user?: UserIdentifier.AsObject;
    data?: common_user_pb.UserRequest.AsObject;
  };
}

export class EnableAllUsersRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): EnableAllUsersRequest;
  hasTarget(): boolean;
  clearTarget(): EnableAllUsersRequest;

  getEnable(): boolean;
  setEnable(value: boolean): EnableAllUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableAllUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnableAllUsersRequest): EnableAllUsersRequest.AsObject;
  static serializeBinaryToWriter(message: EnableAllUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableAllUsersRequest;
  static deserializeBinaryFromReader(message: EnableAllUsersRequest, reader: jspb.BinaryReader): EnableAllUsersRequest;
}

export namespace EnableAllUsersRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    enable: boolean;
  };
}

export class EnableUserRequest extends jspb.Message {
  getUser(): UserIdentifier | undefined;
  setUser(value?: UserIdentifier): EnableUserRequest;
  hasUser(): boolean;
  clearUser(): EnableUserRequest;

  getEnable(): boolean;
  setEnable(value: boolean): EnableUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnableUserRequest): EnableUserRequest.AsObject;
  static serializeBinaryToWriter(message: EnableUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableUserRequest;
  static deserializeBinaryFromReader(message: EnableUserRequest, reader: jspb.BinaryReader): EnableUserRequest;
}

export namespace EnableUserRequest {
  export type AsObject = {
    user?: UserIdentifier.AsObject;
    enable: boolean;
  };
}

export class SetUserPasswordRequest extends jspb.Message {
  getUser(): UserIdentifier | undefined;
  setUser(value?: UserIdentifier): SetUserPasswordRequest;
  hasUser(): boolean;
  clearUser(): SetUserPasswordRequest;

  getNewPassword(): string;
  setNewPassword(value: string): SetUserPasswordRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetUserPasswordRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetUserPasswordRequest): SetUserPasswordRequest.AsObject;
  static serializeBinaryToWriter(message: SetUserPasswordRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetUserPasswordRequest;
  static deserializeBinaryFromReader(message: SetUserPasswordRequest, reader: jspb.BinaryReader): SetUserPasswordRequest;
}

export namespace SetUserPasswordRequest {
  export type AsObject = {
    user?: UserIdentifier.AsObject;
    newPassword: string;
  };
}

export class SetUserAccountExpirationRequest extends jspb.Message {
  getUser(): UserIdentifier | undefined;
  setUser(value?: UserIdentifier): SetUserAccountExpirationRequest;
  hasUser(): boolean;
  clearUser(): SetUserAccountExpirationRequest;

  getAccountExpirationDate(): google_protobuf_wrappers_pb.StringValue | undefined;
  setAccountExpirationDate(value?: google_protobuf_wrappers_pb.StringValue): SetUserAccountExpirationRequest;
  hasAccountExpirationDate(): boolean;
  clearAccountExpirationDate(): SetUserAccountExpirationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetUserAccountExpirationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetUserAccountExpirationRequest): SetUserAccountExpirationRequest.AsObject;
  static serializeBinaryToWriter(message: SetUserAccountExpirationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetUserAccountExpirationRequest;
  static deserializeBinaryFromReader(message: SetUserAccountExpirationRequest, reader: jspb.BinaryReader): SetUserAccountExpirationRequest;
}

export namespace SetUserAccountExpirationRequest {
  export type AsObject = {
    user?: UserIdentifier.AsObject;
    accountExpirationDate?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class UserIdentifier extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): UserIdentifier;
  hasTarget(): boolean;
  clearTarget(): UserIdentifier;

  getUserId(): string;
  setUserId(value: string): UserIdentifier;

  getSamId(): string;
  setSamId(value: string): UserIdentifier;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserIdentifier.AsObject;
  static toObject(includeInstance: boolean, msg: UserIdentifier): UserIdentifier.AsObject;
  static serializeBinaryToWriter(message: UserIdentifier, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserIdentifier;
  static deserializeBinaryFromReader(message: UserIdentifier, reader: jspb.BinaryReader): UserIdentifier;
}

export namespace UserIdentifier {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    userId: string;
    samId: string;
  };
}

export class UserIdRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): UserIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserIdRequest): UserIdRequest.AsObject;
  static serializeBinaryToWriter(message: UserIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserIdRequest;
  static deserializeBinaryFromReader(message: UserIdRequest, reader: jspb.BinaryReader): UserIdRequest;
}

export namespace UserIdRequest {
  export type AsObject = {
    userid: string;
  };
}

export class GroupIdRequest extends jspb.Message {
  getGroupid(): string;
  setGroupid(value: string): GroupIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GroupIdRequest): GroupIdRequest.AsObject;
  static serializeBinaryToWriter(message: GroupIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupIdRequest;
  static deserializeBinaryFromReader(message: GroupIdRequest, reader: jspb.BinaryReader): GroupIdRequest;
}

export namespace GroupIdRequest {
  export type AsObject = {
    groupid: string;
  };
}

export class SetGroupChildGroupsRequest extends jspb.Message {
  getGroup(): GroupIdRequest | undefined;
  setGroup(value?: GroupIdRequest): SetGroupChildGroupsRequest;
  hasGroup(): boolean;
  clearGroup(): SetGroupChildGroupsRequest;

  getChildGroupIdsList(): Array<string>;
  setChildGroupIdsList(value: Array<string>): SetGroupChildGroupsRequest;
  clearChildGroupIdsList(): SetGroupChildGroupsRequest;
  addChildGroupIds(value: string, index?: number): SetGroupChildGroupsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetGroupChildGroupsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetGroupChildGroupsRequest): SetGroupChildGroupsRequest.AsObject;
  static serializeBinaryToWriter(message: SetGroupChildGroupsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetGroupChildGroupsRequest;
  static deserializeBinaryFromReader(message: SetGroupChildGroupsRequest, reader: jspb.BinaryReader): SetGroupChildGroupsRequest;
}

export namespace SetGroupChildGroupsRequest {
  export type AsObject = {
    group?: GroupIdRequest.AsObject;
    childGroupIdsList: Array<string>;
  };
}

export class SetUserAgentRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): SetUserAgentRequest;
  hasTarget(): boolean;
  clearTarget(): SetUserAgentRequest;

  getUserId(): string;
  setUserId(value: string): SetUserAgentRequest;

  getPassword(): string;
  setPassword(value: string): SetUserAgentRequest;

  getPasswordNotRequired(): boolean;
  setPasswordNotRequired(value: boolean): SetUserAgentRequest;

  getUserCannotChangePassword(): boolean;
  setUserCannotChangePassword(value: boolean): SetUserAgentRequest;

  getSmartcardLogonRequired(): boolean;
  setSmartcardLogonRequired(value: boolean): SetUserAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetUserAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetUserAgentRequest): SetUserAgentRequest.AsObject;
  static serializeBinaryToWriter(message: SetUserAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetUserAgentRequest;
  static deserializeBinaryFromReader(message: SetUserAgentRequest, reader: jspb.BinaryReader): SetUserAgentRequest;
}

export namespace SetUserAgentRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    userId: string;
    password: string;
    passwordNotRequired: boolean;
    userCannotChangePassword: boolean;
    smartcardLogonRequired: boolean;
  };
}

export class SetGroupAgentRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): SetGroupAgentRequest;
  hasTarget(): boolean;
  clearTarget(): SetGroupAgentRequest;

  getGroupId(): string;
  setGroupId(value: string): SetGroupAgentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetGroupAgentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetGroupAgentRequest): SetGroupAgentRequest.AsObject;
  static serializeBinaryToWriter(message: SetGroupAgentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetGroupAgentRequest;
  static deserializeBinaryFromReader(message: SetGroupAgentRequest, reader: jspb.BinaryReader): SetGroupAgentRequest;
}

export namespace SetGroupAgentRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    groupId: string;
  };
}

export class UserControlResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): UserControlResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): UserControlResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): UserControlResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserControlResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserControlResponse): UserControlResponse.AsObject;
  static serializeBinaryToWriter(message: UserControlResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserControlResponse;
  static deserializeBinaryFromReader(message: UserControlResponse, reader: jspb.BinaryReader): UserControlResponse;
}

export namespace UserControlResponse {
  export type AsObject = {
    status: ResponseStatus;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }
}

export class CreateUserResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): CreateUserResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): CreateUserResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): CreateUserResponse;

  getUserId(): string;
  setUserId(value: string): CreateUserResponse;
  hasUserId(): boolean;
  clearUserId(): CreateUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserResponse): CreateUserResponse.AsObject;
  static serializeBinaryToWriter(message: CreateUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserResponse;
  static deserializeBinaryFromReader(message: CreateUserResponse, reader: jspb.BinaryReader): CreateUserResponse;
}

export namespace CreateUserResponse {
  export type AsObject = {
    status: ResponseStatus;
    errorMessage?: string;
    userId?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }

  export enum UserIdCase {
    _USER_ID_NOT_SET = 0,
    USER_ID = 3,
  }
}

export class CreateGroupResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): CreateGroupResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): CreateGroupResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): CreateGroupResponse;

  getGroupId(): string;
  setGroupId(value: string): CreateGroupResponse;
  hasGroupId(): boolean;
  clearGroupId(): CreateGroupResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGroupResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGroupResponse): CreateGroupResponse.AsObject;
  static serializeBinaryToWriter(message: CreateGroupResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGroupResponse;
  static deserializeBinaryFromReader(message: CreateGroupResponse, reader: jspb.BinaryReader): CreateGroupResponse;
}

export namespace CreateGroupResponse {
  export type AsObject = {
    status: ResponseStatus;
    errorMessage?: string;
    groupId?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }

  export enum GroupIdCase {
    _GROUP_ID_NOT_SET = 0,
    GROUP_ID = 3,
  }
}

export class UserAgentsResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): UserAgentsResponse;

  getAgentIdsList(): Array<string>;
  setAgentIdsList(value: Array<string>): UserAgentsResponse;
  clearAgentIdsList(): UserAgentsResponse;
  addAgentIds(value: string, index?: number): UserAgentsResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): UserAgentsResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): UserAgentsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserAgentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserAgentsResponse): UserAgentsResponse.AsObject;
  static serializeBinaryToWriter(message: UserAgentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserAgentsResponse;
  static deserializeBinaryFromReader(message: UserAgentsResponse, reader: jspb.BinaryReader): UserAgentsResponse;
}

export namespace UserAgentsResponse {
  export type AsObject = {
    status: ResponseStatus;
    agentIdsList: Array<string>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GetAllUsersRequest extends jspb.Message {
  getManufacturer(): string;
  setManufacturer(value: string): GetAllUsersRequest;
  hasManufacturer(): boolean;
  clearManufacturer(): GetAllUsersRequest;

  getModel(): string;
  setModel(value: string): GetAllUsersRequest;
  hasModel(): boolean;
  clearModel(): GetAllUsersRequest;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): GetAllUsersRequest;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): GetAllUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllUsersRequest): GetAllUsersRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllUsersRequest;
  static deserializeBinaryFromReader(message: GetAllUsersRequest, reader: jspb.BinaryReader): GetAllUsersRequest;
}

export namespace GetAllUsersRequest {
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

export class UserResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): UserResponse;

  getUser(): UserWithIdInfo | undefined;
  setUser(value?: UserWithIdInfo): UserResponse;
  hasUser(): boolean;
  clearUser(): UserResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): UserResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): UserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserResponse): UserResponse.AsObject;
  static serializeBinaryToWriter(message: UserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserResponse;
  static deserializeBinaryFromReader(message: UserResponse, reader: jspb.BinaryReader): UserResponse;
}

export namespace UserResponse {
  export type AsObject = {
    status: ResponseStatus;
    user?: UserWithIdInfo.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class UsersResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): UsersResponse;

  getUsersList(): Array<UserWithIdInfo>;
  setUsersList(value: Array<UserWithIdInfo>): UsersResponse;
  clearUsersList(): UsersResponse;
  addUsers(value?: UserWithIdInfo, index?: number): UserWithIdInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): UsersResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): UsersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UsersResponse): UsersResponse.AsObject;
  static serializeBinaryToWriter(message: UsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsersResponse;
  static deserializeBinaryFromReader(message: UsersResponse, reader: jspb.BinaryReader): UsersResponse;
}

export namespace UsersResponse {
  export type AsObject = {
    status: ResponseStatus;
    usersList: Array<UserWithIdInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class UserWithIdInfo extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): UserWithIdInfo;

  getInfo(): common_user_pb.UserInfo | undefined;
  setInfo(value?: common_user_pb.UserInfo): UserWithIdInfo;
  hasInfo(): boolean;
  clearInfo(): UserWithIdInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserWithIdInfo.AsObject;
  static toObject(includeInstance: boolean, msg: UserWithIdInfo): UserWithIdInfo.AsObject;
  static serializeBinaryToWriter(message: UserWithIdInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserWithIdInfo;
  static deserializeBinaryFromReader(message: UserWithIdInfo, reader: jspb.BinaryReader): UserWithIdInfo;
}

export namespace UserWithIdInfo {
  export type AsObject = {
    userid: string;
    info?: common_user_pb.UserInfo.AsObject;
  };
}

export class GroupResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): GroupResponse;

  getGroup(): GroupWithIdInfo | undefined;
  setGroup(value?: GroupWithIdInfo): GroupResponse;
  hasGroup(): boolean;
  clearGroup(): GroupResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): GroupResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GroupResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GroupResponse): GroupResponse.AsObject;
  static serializeBinaryToWriter(message: GroupResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupResponse;
  static deserializeBinaryFromReader(message: GroupResponse, reader: jspb.BinaryReader): GroupResponse;
}

export namespace GroupResponse {
  export type AsObject = {
    status: ResponseStatus;
    group?: GroupWithIdInfo.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GroupsResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): GroupsResponse;

  getGroupsList(): Array<GroupWithIdInfo>;
  setGroupsList(value: Array<GroupWithIdInfo>): GroupsResponse;
  clearGroupsList(): GroupsResponse;
  addGroups(value?: GroupWithIdInfo, index?: number): GroupWithIdInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): GroupsResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GroupsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GroupsResponse): GroupsResponse.AsObject;
  static serializeBinaryToWriter(message: GroupsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupsResponse;
  static deserializeBinaryFromReader(message: GroupsResponse, reader: jspb.BinaryReader): GroupsResponse;
}

export namespace GroupsResponse {
  export type AsObject = {
    status: ResponseStatus;
    groupsList: Array<GroupWithIdInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GroupListResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): GroupListResponse;

  getGroupsList(): Array<GroupWithIdInfo>;
  setGroupsList(value: Array<GroupWithIdInfo>): GroupListResponse;
  clearGroupsList(): GroupListResponse;
  addGroups(value?: GroupWithIdInfo, index?: number): GroupWithIdInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): GroupListResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GroupListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GroupListResponse): GroupListResponse.AsObject;
  static serializeBinaryToWriter(message: GroupListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupListResponse;
  static deserializeBinaryFromReader(message: GroupListResponse, reader: jspb.BinaryReader): GroupListResponse;
}

export namespace GroupListResponse {
  export type AsObject = {
    status: ResponseStatus;
    groupsList: Array<GroupWithIdInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GroupWithIdInfo extends jspb.Message {
  getGroupid(): string;
  setGroupid(value: string): GroupWithIdInfo;

  getInfo(): common_user_pb.GroupInfo | undefined;
  setInfo(value?: common_user_pb.GroupInfo): GroupWithIdInfo;
  hasInfo(): boolean;
  clearInfo(): GroupWithIdInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupWithIdInfo.AsObject;
  static toObject(includeInstance: boolean, msg: GroupWithIdInfo): GroupWithIdInfo.AsObject;
  static serializeBinaryToWriter(message: GroupWithIdInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupWithIdInfo;
  static deserializeBinaryFromReader(message: GroupWithIdInfo, reader: jspb.BinaryReader): GroupWithIdInfo;
}

export namespace GroupWithIdInfo {
  export type AsObject = {
    groupid: string;
    info?: common_user_pb.GroupInfo.AsObject;
  };
}

export class GroupTreeResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): GroupTreeResponse;

  getRootsList(): Array<GroupTreeNode>;
  setRootsList(value: Array<GroupTreeNode>): GroupTreeResponse;
  clearRootsList(): GroupTreeResponse;
  addRoots(value?: GroupTreeNode, index?: number): GroupTreeNode;

  getErrorMessage(): string;
  setErrorMessage(value: string): GroupTreeResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GroupTreeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupTreeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GroupTreeResponse): GroupTreeResponse.AsObject;
  static serializeBinaryToWriter(message: GroupTreeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupTreeResponse;
  static deserializeBinaryFromReader(message: GroupTreeResponse, reader: jspb.BinaryReader): GroupTreeResponse;
}

export namespace GroupTreeResponse {
  export type AsObject = {
    status: ResponseStatus;
    rootsList: Array<GroupTreeNode.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GroupTreeNode extends jspb.Message {
  getGroupid(): string;
  setGroupid(value: string): GroupTreeNode;

  getInfo(): common_user_pb.GroupInfo | undefined;
  setInfo(value?: common_user_pb.GroupInfo): GroupTreeNode;
  hasInfo(): boolean;
  clearInfo(): GroupTreeNode;

  getChildrenList(): Array<GroupTreeNode>;
  setChildrenList(value: Array<GroupTreeNode>): GroupTreeNode;
  clearChildrenList(): GroupTreeNode;
  addChildren(value?: GroupTreeNode, index?: number): GroupTreeNode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupTreeNode.AsObject;
  static toObject(includeInstance: boolean, msg: GroupTreeNode): GroupTreeNode.AsObject;
  static serializeBinaryToWriter(message: GroupTreeNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupTreeNode;
  static deserializeBinaryFromReader(message: GroupTreeNode, reader: jspb.BinaryReader): GroupTreeNode;
}

export namespace GroupTreeNode {
  export type AsObject = {
    groupid: string;
    info?: common_user_pb.GroupInfo.AsObject;
    childrenList: Array<GroupTreeNode.AsObject>;
  };
}

export class UserListResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): UserListResponse;

  getUsersList(): Array<UserWithIdInfo>;
  setUsersList(value: Array<UserWithIdInfo>): UserListResponse;
  clearUsersList(): UserListResponse;
  addUsers(value?: UserWithIdInfo, index?: number): UserWithIdInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): UserListResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): UserListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserListResponse): UserListResponse.AsObject;
  static serializeBinaryToWriter(message: UserListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserListResponse;
  static deserializeBinaryFromReader(message: UserListResponse, reader: jspb.BinaryReader): UserListResponse;
}

export namespace UserListResponse {
  export type AsObject = {
    status: ResponseStatus;
    usersList: Array<UserWithIdInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class AgentListResponse extends jspb.Message {
  getStatus(): ResponseStatus;
  setStatus(value: ResponseStatus): AgentListResponse;

  getAgentIdsList(): Array<string>;
  setAgentIdsList(value: Array<string>): AgentListResponse;
  clearAgentIdsList(): AgentListResponse;
  addAgentIds(value: string, index?: number): AgentListResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): AgentListResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): AgentListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AgentListResponse): AgentListResponse.AsObject;
  static serializeBinaryToWriter(message: AgentListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentListResponse;
  static deserializeBinaryFromReader(message: AgentListResponse, reader: jspb.BinaryReader): AgentListResponse;
}

export namespace AgentListResponse {
  export type AsObject = {
    status: ResponseStatus;
    agentIdsList: Array<string>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class CreateUserGroupRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): CreateUserGroupRequest;
  hasTarget(): boolean;
  clearTarget(): CreateUserGroupRequest;

  getSamGroupName(): string;
  setSamGroupName(value: string): CreateUserGroupRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): CreateUserGroupRequest;
  hasDescription(): boolean;
  clearDescription(): CreateUserGroupRequest;

  getParentId(): string;
  setParentId(value: string): CreateUserGroupRequest;
  hasParentId(): boolean;
  clearParentId(): CreateUserGroupRequest;

  getMaxUsers(): number;
  setMaxUsers(value: number): CreateUserGroupRequest;

  getMaxAgent(): number;
  setMaxAgent(value: number): CreateUserGroupRequest;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): CreateUserGroupRequest;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): CreateUserGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserGroupRequest): CreateUserGroupRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserGroupRequest;
  static deserializeBinaryFromReader(message: CreateUserGroupRequest, reader: jspb.BinaryReader): CreateUserGroupRequest;
}

export namespace CreateUserGroupRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    samGroupName: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    parentId?: string;
    maxUsers: number;
    maxAgent: number;
    minimalOsVersion?: string;
  };

  export enum ParentIdCase {
    _PARENT_ID_NOT_SET = 0,
    PARENT_ID = 4,
  }

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 7,
  }
}

export class UpdateGroupRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): UpdateGroupRequest;
  hasTarget(): boolean;
  clearTarget(): UpdateGroupRequest;

  getGroupId(): string;
  setGroupId(value: string): UpdateGroupRequest;

  getCurrentSamGroupName(): string;
  setCurrentSamGroupName(value: string): UpdateGroupRequest;

  getNewSamGroupName(): string;
  setNewSamGroupName(value: string): UpdateGroupRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UpdateGroupRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateGroupRequest;

  getMaxUsers(): number;
  setMaxUsers(value: number): UpdateGroupRequest;

  getMaxAgent(): number;
  setMaxAgent(value: number): UpdateGroupRequest;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): UpdateGroupRequest;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): UpdateGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGroupRequest): UpdateGroupRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGroupRequest;
  static deserializeBinaryFromReader(message: UpdateGroupRequest, reader: jspb.BinaryReader): UpdateGroupRequest;
}

export namespace UpdateGroupRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    groupId: string;
    currentSamGroupName: string;
    newSamGroupName: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    maxUsers: number;
    maxAgent: number;
    minimalOsVersion?: string;
  };

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 8,
  }
}

export class GroupRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GroupRequest;
  hasTarget(): boolean;
  clearTarget(): GroupRequest;

  getSamGroupName(): string;
  setSamGroupName(value: string): GroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GroupRequest): GroupRequest.AsObject;
  static serializeBinaryToWriter(message: GroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupRequest;
  static deserializeBinaryFromReader(message: GroupRequest, reader: jspb.BinaryReader): GroupRequest;
}

export namespace GroupRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    samGroupName: string;
  };
}

export class UserGroupRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): UserGroupRequest;
  hasTarget(): boolean;
  clearTarget(): UserGroupRequest;

  getSamGroupName(): string;
  setSamGroupName(value: string): UserGroupRequest;

  getSamAccountName(): string;
  setSamAccountName(value: string): UserGroupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGroupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserGroupRequest): UserGroupRequest.AsObject;
  static serializeBinaryToWriter(message: UserGroupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGroupRequest;
  static deserializeBinaryFromReader(message: UserGroupRequest, reader: jspb.BinaryReader): UserGroupRequest;
}

export namespace UserGroupRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    samGroupName: string;
    samAccountName: string;
  };
}

export enum ResponseStatus {
  RESPONSE_STATUS_OK = 0,
  RESPONSE_STATUS_ERROR = 1,
}
