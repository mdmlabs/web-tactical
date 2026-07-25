import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"


export class UserInfo extends jspb.Message {
  getName(): string;
  setName(value: string): UserInfo;

  getSamaccountname(): string;
  setSamaccountname(value: string): UserInfo;

  getSid(): string;
  setSid(value: string): UserInfo;

  getAccounttype(): UserAccountType;
  setAccounttype(value: UserAccountType): UserInfo;

  getIsenabled(): boolean;
  setIsenabled(value: boolean): UserInfo;

  getIslocked(): boolean;
  setIslocked(value: boolean): UserInfo;

  getPasswordexpired(): boolean;
  setPasswordexpired(value: boolean): UserInfo;

  getAccountexpirationdate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setAccountexpirationdate(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasAccountexpirationdate(): boolean;
  clearAccountexpirationdate(): UserInfo;

  getLastlogon(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastlogon(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasLastlogon(): boolean;
  clearLastlogon(): UserInfo;

  getPasswordlastset(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPasswordlastset(value?: google_protobuf_timestamp_pb.Timestamp): UserInfo;
  hasPasswordlastset(): boolean;
  clearPasswordlastset(): UserInfo;

  getDisplayname(): string;
  setDisplayname(value: string): UserInfo;
  hasDisplayname(): boolean;
  clearDisplayname(): UserInfo;

  getDescription(): string;
  setDescription(value: string): UserInfo;
  hasDescription(): boolean;
  clearDescription(): UserInfo;

  getGivenname(): string;
  setGivenname(value: string): UserInfo;
  hasGivenname(): boolean;
  clearGivenname(): UserInfo;

  getMiddlename(): string;
  setMiddlename(value: string): UserInfo;
  hasMiddlename(): boolean;
  clearMiddlename(): UserInfo;

  getSurname(): string;
  setSurname(value: string): UserInfo;
  hasSurname(): boolean;
  clearSurname(): UserInfo;

  getEmail(): string;
  setEmail(value: string): UserInfo;
  hasEmail(): boolean;
  clearEmail(): UserInfo;

  getTelephonenumber(): string;
  setTelephonenumber(value: string): UserInfo;
  hasTelephonenumber(): boolean;
  clearTelephonenumber(): UserInfo;

  getHomedirectory(): string;
  setHomedirectory(value: string): UserInfo;
  hasHomedirectory(): boolean;
  clearHomedirectory(): UserInfo;

  getScriptpath(): string;
  setScriptpath(value: string): UserInfo;
  hasScriptpath(): boolean;
  clearScriptpath(): UserInfo;

  getEmployeeid(): string;
  setEmployeeid(value: string): UserInfo;
  hasEmployeeid(): boolean;
  clearEmployeeid(): UserInfo;

  getMaxAgents(): number;
  setMaxAgents(value: number): UserInfo;

  getMaxPolicies(): number;
  setMaxPolicies(value: number): UserInfo;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): UserInfo;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): UserInfo;

  getGroupsList(): Array<GroupInfo>;
  setGroupsList(value: Array<GroupInfo>): UserInfo;
  clearGroupsList(): UserInfo;
  addGroups(value?: GroupInfo, index?: number): GroupInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserInfo.AsObject;
  static toObject(includeInstance: boolean, msg: UserInfo): UserInfo.AsObject;
  static serializeBinaryToWriter(message: UserInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserInfo;
  static deserializeBinaryFromReader(message: UserInfo, reader: jspb.BinaryReader): UserInfo;
}

export namespace UserInfo {
  export type AsObject = {
    name: string;
    samaccountname: string;
    sid: string;
    accounttype: UserAccountType;
    isenabled: boolean;
    islocked: boolean;
    passwordexpired: boolean;
    accountexpirationdate?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    lastlogon?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    passwordlastset?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    displayname?: string;
    description?: string;
    givenname?: string;
    middlename?: string;
    surname?: string;
    email?: string;
    telephonenumber?: string;
    homedirectory?: string;
    scriptpath?: string;
    employeeid?: string;
    maxAgents: number;
    maxPolicies: number;
    minimalOsVersion?: string;
    groupsList: Array<GroupInfo.AsObject>;
  };

  export enum DisplaynameCase {
    _DISPLAYNAME_NOT_SET = 0,
    DISPLAYNAME = 11,
  }

  export enum DescriptionCase {
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 12,
  }

  export enum GivennameCase {
    _GIVENNAME_NOT_SET = 0,
    GIVENNAME = 13,
  }

  export enum MiddlenameCase {
    _MIDDLENAME_NOT_SET = 0,
    MIDDLENAME = 14,
  }

  export enum SurnameCase {
    _SURNAME_NOT_SET = 0,
    SURNAME = 15,
  }

  export enum EmailCase {
    _EMAIL_NOT_SET = 0,
    EMAIL = 16,
  }

  export enum TelephonenumberCase {
    _TELEPHONENUMBER_NOT_SET = 0,
    TELEPHONENUMBER = 17,
  }

  export enum HomedirectoryCase {
    _HOMEDIRECTORY_NOT_SET = 0,
    HOMEDIRECTORY = 18,
  }

  export enum ScriptpathCase {
    _SCRIPTPATH_NOT_SET = 0,
    SCRIPTPATH = 19,
  }

  export enum EmployeeidCase {
    _EMPLOYEEID_NOT_SET = 0,
    EMPLOYEEID = 20,
  }

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 23,
  }
}

export class GroupInfo extends jspb.Message {
  getName(): string;
  setName(value: string): GroupInfo;
  hasName(): boolean;
  clearName(): GroupInfo;

  getDisplayname(): string;
  setDisplayname(value: string): GroupInfo;
  hasDisplayname(): boolean;
  clearDisplayname(): GroupInfo;

  getDistinguishedname(): string;
  setDistinguishedname(value: string): GroupInfo;
  hasDistinguishedname(): boolean;
  clearDistinguishedname(): GroupInfo;

  getSamaccountname(): string;
  setSamaccountname(value: string): GroupInfo;
  hasSamaccountname(): boolean;
  clearSamaccountname(): GroupInfo;

  getUserprincipalname(): string;
  setUserprincipalname(value: string): GroupInfo;
  hasUserprincipalname(): boolean;
  clearUserprincipalname(): GroupInfo;

  getDescription(): string;
  setDescription(value: string): GroupInfo;
  hasDescription(): boolean;
  clearDescription(): GroupInfo;

  getStructuralobjectclass(): string;
  setStructuralobjectclass(value: string): GroupInfo;
  hasStructuralobjectclass(): boolean;
  clearStructuralobjectclass(): GroupInfo;

  getSid(): string;
  setSid(value: string): GroupInfo;
  hasSid(): boolean;
  clearSid(): GroupInfo;

  getMaxAgents(): number;
  setMaxAgents(value: number): GroupInfo;
  hasMaxAgents(): boolean;
  clearMaxAgents(): GroupInfo;

  getMaxUsers(): number;
  setMaxUsers(value: number): GroupInfo;
  hasMaxUsers(): boolean;
  clearMaxUsers(): GroupInfo;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): GroupInfo;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): GroupInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupInfo.AsObject;
  static toObject(includeInstance: boolean, msg: GroupInfo): GroupInfo.AsObject;
  static serializeBinaryToWriter(message: GroupInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupInfo;
  static deserializeBinaryFromReader(message: GroupInfo, reader: jspb.BinaryReader): GroupInfo;
}

export namespace GroupInfo {
  export type AsObject = {
    name?: string;
    displayname?: string;
    distinguishedname?: string;
    samaccountname?: string;
    userprincipalname?: string;
    description?: string;
    structuralobjectclass?: string;
    sid?: string;
    maxAgents?: number;
    maxUsers?: number;
    minimalOsVersion?: string;
  };

  export enum NameCase {
    _NAME_NOT_SET = 0,
    NAME = 1,
  }

  export enum DisplaynameCase {
    _DISPLAYNAME_NOT_SET = 0,
    DISPLAYNAME = 2,
  }

  export enum DistinguishednameCase {
    _DISTINGUISHEDNAME_NOT_SET = 0,
    DISTINGUISHEDNAME = 3,
  }

  export enum SamaccountnameCase {
    _SAMACCOUNTNAME_NOT_SET = 0,
    SAMACCOUNTNAME = 4,
  }

  export enum UserprincipalnameCase {
    _USERPRINCIPALNAME_NOT_SET = 0,
    USERPRINCIPALNAME = 5,
  }

  export enum DescriptionCase {
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 6,
  }

  export enum StructuralobjectclassCase {
    _STRUCTURALOBJECTCLASS_NOT_SET = 0,
    STRUCTURALOBJECTCLASS = 7,
  }

  export enum SidCase {
    _SID_NOT_SET = 0,
    SID = 8,
  }

  export enum MaxAgentsCase {
    _MAX_AGENTS_NOT_SET = 0,
    MAX_AGENTS = 9,
  }

  export enum MaxUsersCase {
    _MAX_USERS_NOT_SET = 0,
    MAX_USERS = 10,
  }

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 11,
  }
}

export class UserRequest extends jspb.Message {
  getSamAccountName(): string;
  setSamAccountName(value: string): UserRequest;

  getPassword(): string;
  setPassword(value: string): UserRequest;

  getDisplayName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDisplayName(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasDisplayName(): boolean;
  clearDisplayName(): UserRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasDescription(): boolean;
  clearDescription(): UserRequest;

  getEnabled(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setEnabled(value?: google_protobuf_wrappers_pb.BoolValue): UserRequest;
  hasEnabled(): boolean;
  clearEnabled(): UserRequest;

  getPasswordNotRequired(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setPasswordNotRequired(value?: google_protobuf_wrappers_pb.BoolValue): UserRequest;
  hasPasswordNotRequired(): boolean;
  clearPasswordNotRequired(): UserRequest;

  getUserCannotChangePassword(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setUserCannotChangePassword(value?: google_protobuf_wrappers_pb.BoolValue): UserRequest;
  hasUserCannotChangePassword(): boolean;
  clearUserCannotChangePassword(): UserRequest;

  getSmartcardLogonRequired(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setSmartcardLogonRequired(value?: google_protobuf_wrappers_pb.BoolValue): UserRequest;
  hasSmartcardLogonRequired(): boolean;
  clearSmartcardLogonRequired(): UserRequest;

  getAccountExpirationDate(): google_protobuf_wrappers_pb.StringValue | undefined;
  setAccountExpirationDate(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasAccountExpirationDate(): boolean;
  clearAccountExpirationDate(): UserRequest;

  getName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setName(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasName(): boolean;
  clearName(): UserRequest;

  getMiddleName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setMiddleName(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasMiddleName(): boolean;
  clearMiddleName(): UserRequest;

  getSurname(): google_protobuf_wrappers_pb.StringValue | undefined;
  setSurname(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasSurname(): boolean;
  clearSurname(): UserRequest;

  getEmail(): google_protobuf_wrappers_pb.StringValue | undefined;
  setEmail(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasEmail(): boolean;
  clearEmail(): UserRequest;

  getHomeDirectory(): google_protobuf_wrappers_pb.StringValue | undefined;
  setHomeDirectory(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasHomeDirectory(): boolean;
  clearHomeDirectory(): UserRequest;

  getScriptPath(): google_protobuf_wrappers_pb.StringValue | undefined;
  setScriptPath(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasScriptPath(): boolean;
  clearScriptPath(): UserRequest;

  getTelephoneNumber(): google_protobuf_wrappers_pb.StringValue | undefined;
  setTelephoneNumber(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasTelephoneNumber(): boolean;
  clearTelephoneNumber(): UserRequest;

  getEmployeeId(): google_protobuf_wrappers_pb.StringValue | undefined;
  setEmployeeId(value?: google_protobuf_wrappers_pb.StringValue): UserRequest;
  hasEmployeeId(): boolean;
  clearEmployeeId(): UserRequest;

  getMaxAgents(): number;
  setMaxAgents(value: number): UserRequest;

  getMaxPolicies(): number;
  setMaxPolicies(value: number): UserRequest;

  getMinimalOsVersion(): string;
  setMinimalOsVersion(value: string): UserRequest;
  hasMinimalOsVersion(): boolean;
  clearMinimalOsVersion(): UserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UserRequest): UserRequest.AsObject;
  static serializeBinaryToWriter(message: UserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserRequest;
  static deserializeBinaryFromReader(message: UserRequest, reader: jspb.BinaryReader): UserRequest;
}

export namespace UserRequest {
  export type AsObject = {
    samAccountName: string;
    password: string;
    displayName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    description?: google_protobuf_wrappers_pb.StringValue.AsObject;
    enabled?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    passwordNotRequired?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    userCannotChangePassword?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    smartcardLogonRequired?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    accountExpirationDate?: google_protobuf_wrappers_pb.StringValue.AsObject;
    name?: google_protobuf_wrappers_pb.StringValue.AsObject;
    middleName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    surname?: google_protobuf_wrappers_pb.StringValue.AsObject;
    email?: google_protobuf_wrappers_pb.StringValue.AsObject;
    homeDirectory?: google_protobuf_wrappers_pb.StringValue.AsObject;
    scriptPath?: google_protobuf_wrappers_pb.StringValue.AsObject;
    telephoneNumber?: google_protobuf_wrappers_pb.StringValue.AsObject;
    employeeId?: google_protobuf_wrappers_pb.StringValue.AsObject;
    maxAgents: number;
    maxPolicies: number;
    minimalOsVersion?: string;
  };

  export enum MinimalOsVersionCase {
    _MINIMAL_OS_VERSION_NOT_SET = 0,
    MINIMAL_OS_VERSION = 20,
  }
}

export class UserResponse extends jspb.Message {
  getUserInfo(): UserInfo | undefined;
  setUserInfo(value?: UserInfo): UserResponse;
  hasUserInfo(): boolean;
  clearUserInfo(): UserResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): UserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UserResponse): UserResponse.AsObject;
  static serializeBinaryToWriter(message: UserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserResponse;
  static deserializeBinaryFromReader(message: UserResponse, reader: jspb.BinaryReader): UserResponse;
}

export namespace UserResponse {
  export type AsObject = {
    userInfo?: UserInfo.AsObject;
    errorMessage: string;
  };
}

export enum UserAccountType {
  USER_ACCOUNT_TYPE_UNSPECIFIED = 0,
  USER_ACCOUNT_TYPE_LOCAL = 1,
  USER_ACCOUNT_TYPE_SYSTEM = 2,
}
