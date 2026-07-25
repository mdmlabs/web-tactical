import * as jspb from 'google-protobuf'

import * as common_user_pb from '../common/user_pb'; // proto import: "common/user.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class NodeSystemInfo extends jspb.Message {
  getNodeid(): string;
  setNodeid(value: string): NodeSystemInfo;

  getHostname(): string;
  setHostname(value: string): NodeSystemInfo;

  getOsversion(): string;
  setOsversion(value: string): NodeSystemInfo;

  getCpu(): string;
  setCpu(value: string): NodeSystemInfo;

  getRamgb(): number;
  setRamgb(value: number): NodeSystemInfo;

  getDisksList(): Array<string>;
  setDisksList(value: Array<string>): NodeSystemInfo;
  clearDisksList(): NodeSystemInfo;
  addDisks(value: string, index?: number): NodeSystemInfo;

  getGpuList(): Array<string>;
  setGpuList(value: Array<string>): NodeSystemInfo;
  clearGpuList(): NodeSystemInfo;
  addGpu(value: string, index?: number): NodeSystemInfo;

  getIpaddressesList(): Array<string>;
  setIpaddressesList(value: Array<string>): NodeSystemInfo;
  clearIpaddressesList(): NodeSystemInfo;
  addIpaddresses(value: string, index?: number): NodeSystemInfo;

  getMacaddressesList(): Array<string>;
  setMacaddressesList(value: Array<string>): NodeSystemInfo;
  clearMacaddressesList(): NodeSystemInfo;
  addMacaddresses(value: string, index?: number): NodeSystemInfo;

  getMotherboard(): string;
  setMotherboard(value: string): NodeSystemInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeSystemInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NodeSystemInfo): NodeSystemInfo.AsObject;
  static serializeBinaryToWriter(message: NodeSystemInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeSystemInfo;
  static deserializeBinaryFromReader(message: NodeSystemInfo, reader: jspb.BinaryReader): NodeSystemInfo;
}

export namespace NodeSystemInfo {
  export type AsObject = {
    nodeid: string;
    hostname: string;
    osversion: string;
    cpu: string;
    ramgb: number;
    disksList: Array<string>;
    gpuList: Array<string>;
    ipaddressesList: Array<string>;
    macaddressesList: Array<string>;
    motherboard: string;
  };
}

export class NodeFullInfo extends jspb.Message {
  getSysteminfo(): NodeSystemInfo | undefined;
  setSysteminfo(value?: NodeSystemInfo): NodeFullInfo;
  hasSysteminfo(): boolean;
  clearSysteminfo(): NodeFullInfo;

  getUsersList(): Array<common_user_pb.UserInfo>;
  setUsersList(value: Array<common_user_pb.UserInfo>): NodeFullInfo;
  clearUsersList(): NodeFullInfo;
  addUsers(value?: common_user_pb.UserInfo, index?: number): common_user_pb.UserInfo;

  getGroupsList(): Array<common_user_pb.GroupInfo>;
  setGroupsList(value: Array<common_user_pb.GroupInfo>): NodeFullInfo;
  clearGroupsList(): NodeFullInfo;
  addGroups(value?: common_user_pb.GroupInfo, index?: number): common_user_pb.GroupInfo;

  getLastboottime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastboottime(value?: google_protobuf_timestamp_pb.Timestamp): NodeFullInfo;
  hasLastboottime(): boolean;
  clearLastboottime(): NodeFullInfo;

  getManufacturer(): string;
  setManufacturer(value: string): NodeFullInfo;

  getModel(): string;
  setModel(value: string): NodeFullInfo;

  getFirmwareversion(): string;
  setFirmwareversion(value: string): NodeFullInfo;

  getTimezone(): string;
  setTimezone(value: string): NodeFullInfo;

  getIsdomainjoined(): boolean;
  setIsdomainjoined(value: boolean): NodeFullInfo;

  getNodeId(): string;
  setNodeId(value: string): NodeFullInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeFullInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NodeFullInfo): NodeFullInfo.AsObject;
  static serializeBinaryToWriter(message: NodeFullInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeFullInfo;
  static deserializeBinaryFromReader(message: NodeFullInfo, reader: jspb.BinaryReader): NodeFullInfo;
}

export namespace NodeFullInfo {
  export type AsObject = {
    systeminfo?: NodeSystemInfo.AsObject;
    usersList: Array<common_user_pb.UserInfo.AsObject>;
    groupsList: Array<common_user_pb.GroupInfo.AsObject>;
    lastboottime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    manufacturer: string;
    model: string;
    firmwareversion: string;
    timezone: string;
    isdomainjoined: boolean;
    nodeId: string;
  };
}

export class OsBuild extends jspb.Message {
  getOs(): string;
  setOs(value: string): OsBuild;

  getOsVersion(): OsVersion | undefined;
  setOsVersion(value?: OsVersion): OsBuild;
  hasOsVersion(): boolean;
  clearOsVersion(): OsBuild;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OsBuild.AsObject;
  static toObject(includeInstance: boolean, msg: OsBuild): OsBuild.AsObject;
  static serializeBinaryToWriter(message: OsBuild, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OsBuild;
  static deserializeBinaryFromReader(message: OsBuild, reader: jspb.BinaryReader): OsBuild;
}

export namespace OsBuild {
  export type AsObject = {
    os: string;
    osVersion?: OsVersion.AsObject;
  };
}

export class OsVersion extends jspb.Message {
  getMajor(): number;
  setMajor(value: number): OsVersion;

  getMinor(): number;
  setMinor(value: number): OsVersion;

  getBuild(): number;
  setBuild(value: number): OsVersion;

  getRevision(): number;
  setRevision(value: number): OsVersion;

  getMajorRevision(): number;
  setMajorRevision(value: number): OsVersion;

  getMinRevision(): number;
  setMinRevision(value: number): OsVersion;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OsVersion.AsObject;
  static toObject(includeInstance: boolean, msg: OsVersion): OsVersion.AsObject;
  static serializeBinaryToWriter(message: OsVersion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OsVersion;
  static deserializeBinaryFromReader(message: OsVersion, reader: jspb.BinaryReader): OsVersion;
}

export namespace OsVersion {
  export type AsObject = {
    major: number;
    minor: number;
    build: number;
    revision: number;
    majorRevision: number;
    minRevision: number;
  };
}

