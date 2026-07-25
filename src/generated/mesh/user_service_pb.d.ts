import * as jspb from 'google-protobuf'

import * as common_user_pb from '../common/user_pb'; // proto import: "common/user.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class FeedbackEnableUserRequest extends jspb.Message {
  getSamAccountName(): string;
  setSamAccountName(value: string): FeedbackEnableUserRequest;

  getEnable(): boolean;
  setEnable(value: boolean): FeedbackEnableUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeedbackEnableUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FeedbackEnableUserRequest): FeedbackEnableUserRequest.AsObject;
  static serializeBinaryToWriter(message: FeedbackEnableUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeedbackEnableUserRequest;
  static deserializeBinaryFromReader(message: FeedbackEnableUserRequest, reader: jspb.BinaryReader): FeedbackEnableUserRequest;
}

export namespace FeedbackEnableUserRequest {
  export type AsObject = {
    samAccountName: string;
    enable: boolean;
  };
}

export class UserControlAgentMessage extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): UserControlAgentMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserControlAgentMessage.AsObject;
  static toObject(includeInstance: boolean, msg: UserControlAgentMessage): UserControlAgentMessage.AsObject;
  static serializeBinaryToWriter(message: UserControlAgentMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserControlAgentMessage;
  static deserializeBinaryFromReader(message: UserControlAgentMessage, reader: jspb.BinaryReader): UserControlAgentMessage;
}

export namespace UserControlAgentMessage {
  export type AsObject = {
    agentId: string;
  };
}

export class UserControlMasterMessage extends jspb.Message {
  getCreate(): UserCreateCommand | undefined;
  setCreate(value?: UserCreateCommand): UserControlMasterMessage;
  hasCreate(): boolean;
  clearCreate(): UserControlMasterMessage;

  getUpdate(): UserUpdateCommand | undefined;
  setUpdate(value?: UserUpdateCommand): UserControlMasterMessage;
  hasUpdate(): boolean;
  clearUpdate(): UserControlMasterMessage;

  getDelete(): UserDeleteCommand | undefined;
  setDelete(value?: UserDeleteCommand): UserControlMasterMessage;
  hasDelete(): boolean;
  clearDelete(): UserControlMasterMessage;

  getEnableDisable(): UserEnableCoomand | undefined;
  setEnableDisable(value?: UserEnableCoomand): UserControlMasterMessage;
  hasEnableDisable(): boolean;
  clearEnableDisable(): UserControlMasterMessage;

  getAllEnableDisable(): AllUsersEnableCoomand | undefined;
  setAllEnableDisable(value?: AllUsersEnableCoomand): UserControlMasterMessage;
  hasAllEnableDisable(): boolean;
  clearAllEnableDisable(): UserControlMasterMessage;

  getSetPassword(): UserSetPasswordCommand | undefined;
  setSetPassword(value?: UserSetPasswordCommand): UserControlMasterMessage;
  hasSetPassword(): boolean;
  clearSetPassword(): UserControlMasterMessage;

  getUnlock(): UserUnlockCommand | undefined;
  setUnlock(value?: UserUnlockCommand): UserControlMasterMessage;
  hasUnlock(): boolean;
  clearUnlock(): UserControlMasterMessage;

  getExpirePassword(): UserExpirePasswordCommand | undefined;
  setExpirePassword(value?: UserExpirePasswordCommand): UserControlMasterMessage;
  hasExpirePassword(): boolean;
  clearExpirePassword(): UserControlMasterMessage;

  getSetAccountExpiration(): UserSetAccountExpirationCommand | undefined;
  setSetAccountExpiration(value?: UserSetAccountExpirationCommand): UserControlMasterMessage;
  hasSetAccountExpiration(): boolean;
  clearSetAccountExpiration(): UserControlMasterMessage;

  getCreateGroup(): CreateGroupCommand | undefined;
  setCreateGroup(value?: CreateGroupCommand): UserControlMasterMessage;
  hasCreateGroup(): boolean;
  clearCreateGroup(): UserControlMasterMessage;

  getDeleteGroup(): DeleteGroupCommand | undefined;
  setDeleteGroup(value?: DeleteGroupCommand): UserControlMasterMessage;
  hasDeleteGroup(): boolean;
  clearDeleteGroup(): UserControlMasterMessage;

  getAddUserToGroup(): AddUserToGroupCommand | undefined;
  setAddUserToGroup(value?: AddUserToGroupCommand): UserControlMasterMessage;
  hasAddUserToGroup(): boolean;
  clearAddUserToGroup(): UserControlMasterMessage;

  getRemoveUserFromGroup(): RemoveUserFromGroupCommand | undefined;
  setRemoveUserFromGroup(value?: RemoveUserFromGroupCommand): UserControlMasterMessage;
  hasRemoveUserFromGroup(): boolean;
  clearRemoveUserFromGroup(): UserControlMasterMessage;

  getUpdateGroup(): UpdateGroupCommand | undefined;
  setUpdateGroup(value?: UpdateGroupCommand): UserControlMasterMessage;
  hasUpdateGroup(): boolean;
  clearUpdateGroup(): UserControlMasterMessage;

  getPayloadCase(): UserControlMasterMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserControlMasterMessage.AsObject;
  static toObject(includeInstance: boolean, msg: UserControlMasterMessage): UserControlMasterMessage.AsObject;
  static serializeBinaryToWriter(message: UserControlMasterMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserControlMasterMessage;
  static deserializeBinaryFromReader(message: UserControlMasterMessage, reader: jspb.BinaryReader): UserControlMasterMessage;
}

export namespace UserControlMasterMessage {
  export type AsObject = {
    create?: UserCreateCommand.AsObject;
    update?: UserUpdateCommand.AsObject;
    pb_delete?: UserDeleteCommand.AsObject;
    enableDisable?: UserEnableCoomand.AsObject;
    allEnableDisable?: AllUsersEnableCoomand.AsObject;
    setPassword?: UserSetPasswordCommand.AsObject;
    unlock?: UserUnlockCommand.AsObject;
    expirePassword?: UserExpirePasswordCommand.AsObject;
    setAccountExpiration?: UserSetAccountExpirationCommand.AsObject;
    createGroup?: CreateGroupCommand.AsObject;
    deleteGroup?: DeleteGroupCommand.AsObject;
    addUserToGroup?: AddUserToGroupCommand.AsObject;
    removeUserFromGroup?: RemoveUserFromGroupCommand.AsObject;
    updateGroup?: UpdateGroupCommand.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    CREATE = 1,
    UPDATE = 2,
    DELETE = 3,
    ENABLE_DISABLE = 4,
    ALL_ENABLE_DISABLE = 5,
    SET_PASSWORD = 6,
    UNLOCK = 7,
    EXPIRE_PASSWORD = 8,
    SET_ACCOUNT_EXPIRATION = 9,
    CREATE_GROUP = 10,
    DELETE_GROUP = 11,
    ADD_USER_TO_GROUP = 12,
    REMOVE_USER_FROM_GROUP = 13,
    UPDATE_GROUP = 14,
  }
}

export class UserCreateCommand extends jspb.Message {
  getRequest(): common_user_pb.UserRequest | undefined;
  setRequest(value?: common_user_pb.UserRequest): UserCreateCommand;
  hasRequest(): boolean;
  clearRequest(): UserCreateCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserCreateCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserCreateCommand): UserCreateCommand.AsObject;
  static serializeBinaryToWriter(message: UserCreateCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserCreateCommand;
  static deserializeBinaryFromReader(message: UserCreateCommand, reader: jspb.BinaryReader): UserCreateCommand;
}

export namespace UserCreateCommand {
  export type AsObject = {
    request?: common_user_pb.UserRequest.AsObject;
  };
}

export class UserUpdateCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserUpdateCommand;

  getRequest(): common_user_pb.UserRequest | undefined;
  setRequest(value?: common_user_pb.UserRequest): UserUpdateCommand;
  hasRequest(): boolean;
  clearRequest(): UserUpdateCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserUpdateCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserUpdateCommand): UserUpdateCommand.AsObject;
  static serializeBinaryToWriter(message: UserUpdateCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserUpdateCommand;
  static deserializeBinaryFromReader(message: UserUpdateCommand, reader: jspb.BinaryReader): UserUpdateCommand;
}

export namespace UserUpdateCommand {
  export type AsObject = {
    samId: string;
    request?: common_user_pb.UserRequest.AsObject;
  };
}

export class UserDeleteCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserDeleteCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserDeleteCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserDeleteCommand): UserDeleteCommand.AsObject;
  static serializeBinaryToWriter(message: UserDeleteCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserDeleteCommand;
  static deserializeBinaryFromReader(message: UserDeleteCommand, reader: jspb.BinaryReader): UserDeleteCommand;
}

export namespace UserDeleteCommand {
  export type AsObject = {
    samId: string;
  };
}

export class UserEnableCoomand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserEnableCoomand;

  getEnable(): boolean;
  setEnable(value: boolean): UserEnableCoomand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserEnableCoomand.AsObject;
  static toObject(includeInstance: boolean, msg: UserEnableCoomand): UserEnableCoomand.AsObject;
  static serializeBinaryToWriter(message: UserEnableCoomand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserEnableCoomand;
  static deserializeBinaryFromReader(message: UserEnableCoomand, reader: jspb.BinaryReader): UserEnableCoomand;
}

export namespace UserEnableCoomand {
  export type AsObject = {
    samId: string;
    enable: boolean;
  };
}

export class AllUsersEnableCoomand extends jspb.Message {
  getEnable(): boolean;
  setEnable(value: boolean): AllUsersEnableCoomand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllUsersEnableCoomand.AsObject;
  static toObject(includeInstance: boolean, msg: AllUsersEnableCoomand): AllUsersEnableCoomand.AsObject;
  static serializeBinaryToWriter(message: AllUsersEnableCoomand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllUsersEnableCoomand;
  static deserializeBinaryFromReader(message: AllUsersEnableCoomand, reader: jspb.BinaryReader): AllUsersEnableCoomand;
}

export namespace AllUsersEnableCoomand {
  export type AsObject = {
    enable: boolean;
  };
}

export class UserSetPasswordCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserSetPasswordCommand;

  getNewPassword(): string;
  setNewPassword(value: string): UserSetPasswordCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserSetPasswordCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserSetPasswordCommand): UserSetPasswordCommand.AsObject;
  static serializeBinaryToWriter(message: UserSetPasswordCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserSetPasswordCommand;
  static deserializeBinaryFromReader(message: UserSetPasswordCommand, reader: jspb.BinaryReader): UserSetPasswordCommand;
}

export namespace UserSetPasswordCommand {
  export type AsObject = {
    samId: string;
    newPassword: string;
  };
}

export class UserUnlockCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserUnlockCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserUnlockCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserUnlockCommand): UserUnlockCommand.AsObject;
  static serializeBinaryToWriter(message: UserUnlockCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserUnlockCommand;
  static deserializeBinaryFromReader(message: UserUnlockCommand, reader: jspb.BinaryReader): UserUnlockCommand;
}

export namespace UserUnlockCommand {
  export type AsObject = {
    samId: string;
  };
}

export class UserExpirePasswordCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserExpirePasswordCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserExpirePasswordCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserExpirePasswordCommand): UserExpirePasswordCommand.AsObject;
  static serializeBinaryToWriter(message: UserExpirePasswordCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserExpirePasswordCommand;
  static deserializeBinaryFromReader(message: UserExpirePasswordCommand, reader: jspb.BinaryReader): UserExpirePasswordCommand;
}

export namespace UserExpirePasswordCommand {
  export type AsObject = {
    samId: string;
  };
}

export class UserSetAccountExpirationCommand extends jspb.Message {
  getSamId(): string;
  setSamId(value: string): UserSetAccountExpirationCommand;

  getAccountExpirationDate(): google_protobuf_wrappers_pb.StringValue | undefined;
  setAccountExpirationDate(value?: google_protobuf_wrappers_pb.StringValue): UserSetAccountExpirationCommand;
  hasAccountExpirationDate(): boolean;
  clearAccountExpirationDate(): UserSetAccountExpirationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserSetAccountExpirationCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UserSetAccountExpirationCommand): UserSetAccountExpirationCommand.AsObject;
  static serializeBinaryToWriter(message: UserSetAccountExpirationCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserSetAccountExpirationCommand;
  static deserializeBinaryFromReader(message: UserSetAccountExpirationCommand, reader: jspb.BinaryReader): UserSetAccountExpirationCommand;
}

export namespace UserSetAccountExpirationCommand {
  export type AsObject = {
    samId: string;
    accountExpirationDate?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class CreateGroupCommand extends jspb.Message {
  getSamGroupName(): string;
  setSamGroupName(value: string): CreateGroupCommand;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): CreateGroupCommand;
  hasDescription(): boolean;
  clearDescription(): CreateGroupCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGroupCommand.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGroupCommand): CreateGroupCommand.AsObject;
  static serializeBinaryToWriter(message: CreateGroupCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGroupCommand;
  static deserializeBinaryFromReader(message: CreateGroupCommand, reader: jspb.BinaryReader): CreateGroupCommand;
}

export namespace CreateGroupCommand {
  export type AsObject = {
    samGroupName: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class UpdateGroupCommand extends jspb.Message {
  getCurrentSamGroupName(): string;
  setCurrentSamGroupName(value: string): UpdateGroupCommand;

  getNewSamGroupName(): string;
  setNewSamGroupName(value: string): UpdateGroupCommand;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UpdateGroupCommand;
  hasDescription(): boolean;
  clearDescription(): UpdateGroupCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGroupCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGroupCommand): UpdateGroupCommand.AsObject;
  static serializeBinaryToWriter(message: UpdateGroupCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGroupCommand;
  static deserializeBinaryFromReader(message: UpdateGroupCommand, reader: jspb.BinaryReader): UpdateGroupCommand;
}

export namespace UpdateGroupCommand {
  export type AsObject = {
    currentSamGroupName: string;
    newSamGroupName: string;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class DeleteGroupCommand extends jspb.Message {
  getSamGroupName(): string;
  setSamGroupName(value: string): DeleteGroupCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteGroupCommand.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteGroupCommand): DeleteGroupCommand.AsObject;
  static serializeBinaryToWriter(message: DeleteGroupCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteGroupCommand;
  static deserializeBinaryFromReader(message: DeleteGroupCommand, reader: jspb.BinaryReader): DeleteGroupCommand;
}

export namespace DeleteGroupCommand {
  export type AsObject = {
    samGroupName: string;
  };
}

export class AddUserToGroupCommand extends jspb.Message {
  getSamGroupName(): string;
  setSamGroupName(value: string): AddUserToGroupCommand;

  getSamAccountName(): string;
  setSamAccountName(value: string): AddUserToGroupCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddUserToGroupCommand.AsObject;
  static toObject(includeInstance: boolean, msg: AddUserToGroupCommand): AddUserToGroupCommand.AsObject;
  static serializeBinaryToWriter(message: AddUserToGroupCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddUserToGroupCommand;
  static deserializeBinaryFromReader(message: AddUserToGroupCommand, reader: jspb.BinaryReader): AddUserToGroupCommand;
}

export namespace AddUserToGroupCommand {
  export type AsObject = {
    samGroupName: string;
    samAccountName: string;
  };
}

export class RemoveUserFromGroupCommand extends jspb.Message {
  getSamGroupName(): string;
  setSamGroupName(value: string): RemoveUserFromGroupCommand;

  getSamAccountName(): string;
  setSamAccountName(value: string): RemoveUserFromGroupCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveUserFromGroupCommand.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveUserFromGroupCommand): RemoveUserFromGroupCommand.AsObject;
  static serializeBinaryToWriter(message: RemoveUserFromGroupCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveUserFromGroupCommand;
  static deserializeBinaryFromReader(message: RemoveUserFromGroupCommand, reader: jspb.BinaryReader): RemoveUserFromGroupCommand;
}

export namespace RemoveUserFromGroupCommand {
  export type AsObject = {
    samGroupName: string;
    samAccountName: string;
  };
}

