import * as jspb from 'google-protobuf'

import * as common_target_pb from './common/target_pb'; // proto import: "common/target.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class TargetRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): TargetRequest;
  hasTarget(): boolean;
  clearTarget(): TargetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TargetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TargetRequest): TargetRequest.AsObject;
  static serializeBinaryToWriter(message: TargetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TargetRequest;
  static deserializeBinaryFromReader(message: TargetRequest, reader: jspb.BinaryReader): TargetRequest;
}

export namespace TargetRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
  };
}

export class DistributionIdentifier extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): DistributionIdentifier;
  hasTarget(): boolean;
  clearTarget(): DistributionIdentifier;

  getDistributionName(): string;
  setDistributionName(value: string): DistributionIdentifier;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistributionIdentifier.AsObject;
  static toObject(includeInstance: boolean, msg: DistributionIdentifier): DistributionIdentifier.AsObject;
  static serializeBinaryToWriter(message: DistributionIdentifier, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistributionIdentifier;
  static deserializeBinaryFromReader(message: DistributionIdentifier, reader: jspb.BinaryReader): DistributionIdentifier;
}

export namespace DistributionIdentifier {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    distributionName: string;
  };
}

export class ImportDistributionRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ImportDistributionRequest;
  hasTarget(): boolean;
  clearTarget(): ImportDistributionRequest;

  getDistributionName(): string;
  setDistributionName(value: string): ImportDistributionRequest;

  getInstallLocation(): string;
  setInstallLocation(value: string): ImportDistributionRequest;

  getPackagePath(): string;
  setPackagePath(value: string): ImportDistributionRequest;

  getVersion(): WslDistributionVersion;
  setVersion(value: WslDistributionVersion): ImportDistributionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportDistributionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImportDistributionRequest): ImportDistributionRequest.AsObject;
  static serializeBinaryToWriter(message: ImportDistributionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportDistributionRequest;
  static deserializeBinaryFromReader(message: ImportDistributionRequest, reader: jspb.BinaryReader): ImportDistributionRequest;
}

export namespace ImportDistributionRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    distributionName: string;
    installLocation: string;
    packagePath: string;
    version: WslDistributionVersion;
  };
}

export class ApplyGlobalConfigRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ApplyGlobalConfigRequest;
  hasTarget(): boolean;
  clearTarget(): ApplyGlobalConfigRequest;

  getConfig(): WslGlobalConfig | undefined;
  setConfig(value?: WslGlobalConfig): ApplyGlobalConfigRequest;
  hasConfig(): boolean;
  clearConfig(): ApplyGlobalConfigRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyGlobalConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyGlobalConfigRequest): ApplyGlobalConfigRequest.AsObject;
  static serializeBinaryToWriter(message: ApplyGlobalConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyGlobalConfigRequest;
  static deserializeBinaryFromReader(message: ApplyGlobalConfigRequest, reader: jspb.BinaryReader): ApplyGlobalConfigRequest;
}

export namespace ApplyGlobalConfigRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    config?: WslGlobalConfig.AsObject;
  };
}

export class ApplyDistributionConfigRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): ApplyDistributionConfigRequest;
  hasTarget(): boolean;
  clearTarget(): ApplyDistributionConfigRequest;

  getDistributionName(): string;
  setDistributionName(value: string): ApplyDistributionConfigRequest;

  getConfig(): WslDistributionConfig | undefined;
  setConfig(value?: WslDistributionConfig): ApplyDistributionConfigRequest;
  hasConfig(): boolean;
  clearConfig(): ApplyDistributionConfigRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyDistributionConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyDistributionConfigRequest): ApplyDistributionConfigRequest.AsObject;
  static serializeBinaryToWriter(message: ApplyDistributionConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyDistributionConfigRequest;
  static deserializeBinaryFromReader(message: ApplyDistributionConfigRequest, reader: jspb.BinaryReader): ApplyDistributionConfigRequest;
}

export namespace ApplyDistributionConfigRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    distributionName: string;
    config?: WslDistributionConfig.AsObject;
  };
}

export class GetWslActivityRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetWslActivityRequest;
  hasTarget(): boolean;
  clearTarget(): GetWslActivityRequest;

  getMaxEvents(): number;
  setMaxEvents(value: number): GetWslActivityRequest;

  getLogNameFilter(): google_protobuf_wrappers_pb.StringValue | undefined;
  setLogNameFilter(value?: google_protobuf_wrappers_pb.StringValue): GetWslActivityRequest;
  hasLogNameFilter(): boolean;
  clearLogNameFilter(): GetWslActivityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetWslActivityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetWslActivityRequest): GetWslActivityRequest.AsObject;
  static serializeBinaryToWriter(message: GetWslActivityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetWslActivityRequest;
  static deserializeBinaryFromReader(message: GetWslActivityRequest, reader: jspb.BinaryReader): GetWslActivityRequest;
}

export namespace GetWslActivityRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    maxEvents: number;
    logNameFilter?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class GetWslComplianceRequest extends jspb.Message {
  getTarget(): common_target_pb.Target | undefined;
  setTarget(value?: common_target_pb.Target): GetWslComplianceRequest;
  hasTarget(): boolean;
  clearTarget(): GetWslComplianceRequest;

  getDistributionName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDistributionName(value?: google_protobuf_wrappers_pb.StringValue): GetWslComplianceRequest;
  hasDistributionName(): boolean;
  clearDistributionName(): GetWslComplianceRequest;

  getExpectedGlobalConfig(): WslGlobalConfig | undefined;
  setExpectedGlobalConfig(value?: WslGlobalConfig): GetWslComplianceRequest;
  hasExpectedGlobalConfig(): boolean;
  clearExpectedGlobalConfig(): GetWslComplianceRequest;

  getExpectedDistributionConfig(): WslDistributionConfig | undefined;
  setExpectedDistributionConfig(value?: WslDistributionConfig): GetWslComplianceRequest;
  hasExpectedDistributionConfig(): boolean;
  clearExpectedDistributionConfig(): GetWslComplianceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetWslComplianceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetWslComplianceRequest): GetWslComplianceRequest.AsObject;
  static serializeBinaryToWriter(message: GetWslComplianceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetWslComplianceRequest;
  static deserializeBinaryFromReader(message: GetWslComplianceRequest, reader: jspb.BinaryReader): GetWslComplianceRequest;
}

export namespace GetWslComplianceRequest {
  export type AsObject = {
    target?: common_target_pb.Target.AsObject;
    distributionName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    expectedGlobalConfig?: WslGlobalConfig.AsObject;
    expectedDistributionConfig?: WslDistributionConfig.AsObject;
  };
}

export class WslControlResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): WslControlResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): WslControlResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslControlResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslControlResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WslControlResponse): WslControlResponse.AsObject;
  static serializeBinaryToWriter(message: WslControlResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslControlResponse;
  static deserializeBinaryFromReader(message: WslControlResponse, reader: jspb.BinaryReader): WslControlResponse;
}

export namespace WslControlResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 2,
  }
}

export class WslStatusResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): WslStatusResponse;

  getInfo(): WslStatusInfo | undefined;
  setInfo(value?: WslStatusInfo): WslStatusResponse;
  hasInfo(): boolean;
  clearInfo(): WslStatusResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): WslStatusResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WslStatusResponse): WslStatusResponse.AsObject;
  static serializeBinaryToWriter(message: WslStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslStatusResponse;
  static deserializeBinaryFromReader(message: WslStatusResponse, reader: jspb.BinaryReader): WslStatusResponse;
}

export namespace WslStatusResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    info?: WslStatusInfo.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class DistributionsResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): DistributionsResponse;

  getDistributionsList(): Array<WslDistributionInfo>;
  setDistributionsList(value: Array<WslDistributionInfo>): DistributionsResponse;
  clearDistributionsList(): DistributionsResponse;
  addDistributions(value?: WslDistributionInfo, index?: number): WslDistributionInfo;

  getErrorMessage(): string;
  setErrorMessage(value: string): DistributionsResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): DistributionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistributionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DistributionsResponse): DistributionsResponse.AsObject;
  static serializeBinaryToWriter(message: DistributionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistributionsResponse;
  static deserializeBinaryFromReader(message: DistributionsResponse, reader: jspb.BinaryReader): DistributionsResponse;
}

export namespace DistributionsResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    distributionsList: Array<WslDistributionInfo.AsObject>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class GlobalConfigResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): GlobalConfigResponse;

  getConfig(): WslGlobalConfig | undefined;
  setConfig(value?: WslGlobalConfig): GlobalConfigResponse;
  hasConfig(): boolean;
  clearConfig(): GlobalConfigResponse;

  getRawText(): string;
  setRawText(value: string): GlobalConfigResponse;
  hasRawText(): boolean;
  clearRawText(): GlobalConfigResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): GlobalConfigResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): GlobalConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GlobalConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GlobalConfigResponse): GlobalConfigResponse.AsObject;
  static serializeBinaryToWriter(message: GlobalConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GlobalConfigResponse;
  static deserializeBinaryFromReader(message: GlobalConfigResponse, reader: jspb.BinaryReader): GlobalConfigResponse;
}

export namespace GlobalConfigResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    config?: WslGlobalConfig.AsObject;
    rawText?: string;
    errorMessage?: string;
  };

  export enum RawTextCase {
    _RAW_TEXT_NOT_SET = 0,
    RAW_TEXT = 3,
  }

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 4,
  }
}

export class DistributionConfigResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): DistributionConfigResponse;

  getConfig(): WslDistributionConfig | undefined;
  setConfig(value?: WslDistributionConfig): DistributionConfigResponse;
  hasConfig(): boolean;
  clearConfig(): DistributionConfigResponse;

  getRawText(): string;
  setRawText(value: string): DistributionConfigResponse;
  hasRawText(): boolean;
  clearRawText(): DistributionConfigResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): DistributionConfigResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): DistributionConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistributionConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DistributionConfigResponse): DistributionConfigResponse.AsObject;
  static serializeBinaryToWriter(message: DistributionConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistributionConfigResponse;
  static deserializeBinaryFromReader(message: DistributionConfigResponse, reader: jspb.BinaryReader): DistributionConfigResponse;
}

export namespace DistributionConfigResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    config?: WslDistributionConfig.AsObject;
    rawText?: string;
    errorMessage?: string;
  };

  export enum RawTextCase {
    _RAW_TEXT_NOT_SET = 0,
    RAW_TEXT = 3,
  }

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 4,
  }
}

export class WslActivityResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): WslActivityResponse;

  getEventsList(): Array<WslActivityEvent>;
  setEventsList(value: Array<WslActivityEvent>): WslActivityResponse;
  clearEventsList(): WslActivityResponse;
  addEvents(value?: WslActivityEvent, index?: number): WslActivityEvent;

  getDiscoveredLogsList(): Array<string>;
  setDiscoveredLogsList(value: Array<string>): WslActivityResponse;
  clearDiscoveredLogsList(): WslActivityResponse;
  addDiscoveredLogs(value: string, index?: number): WslActivityResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): WslActivityResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslActivityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslActivityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WslActivityResponse): WslActivityResponse.AsObject;
  static serializeBinaryToWriter(message: WslActivityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslActivityResponse;
  static deserializeBinaryFromReader(message: WslActivityResponse, reader: jspb.BinaryReader): WslActivityResponse;
}

export namespace WslActivityResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    eventsList: Array<WslActivityEvent.AsObject>;
    discoveredLogsList: Array<string>;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 4,
  }
}

export class WslComplianceResponse extends jspb.Message {
  getStatus(): OperatorWslControlResponseStatus;
  setStatus(value: OperatorWslControlResponseStatus): WslComplianceResponse;

  getReport(): WslComplianceReport | undefined;
  setReport(value?: WslComplianceReport): WslComplianceResponse;
  hasReport(): boolean;
  clearReport(): WslComplianceResponse;

  getErrorMessage(): string;
  setErrorMessage(value: string): WslComplianceResponse;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslComplianceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslComplianceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WslComplianceResponse): WslComplianceResponse.AsObject;
  static serializeBinaryToWriter(message: WslComplianceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslComplianceResponse;
  static deserializeBinaryFromReader(message: WslComplianceResponse, reader: jspb.BinaryReader): WslComplianceResponse;
}

export namespace WslComplianceResponse {
  export type AsObject = {
    status: OperatorWslControlResponseStatus;
    report?: WslComplianceReport.AsObject;
    errorMessage?: string;
  };

  export enum ErrorMessageCase {
    _ERROR_MESSAGE_NOT_SET = 0,
    ERROR_MESSAGE = 3,
  }
}

export class WslStatusInfo extends jspb.Message {
  getRawText(): string;
  setRawText(value: string): WslStatusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslStatusInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WslStatusInfo): WslStatusInfo.AsObject;
  static serializeBinaryToWriter(message: WslStatusInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslStatusInfo;
  static deserializeBinaryFromReader(message: WslStatusInfo, reader: jspb.BinaryReader): WslStatusInfo;
}

export namespace WslStatusInfo {
  export type AsObject = {
    rawText: string;
  };
}

export class WslDistributionInfo extends jspb.Message {
  getDistributionName(): string;
  setDistributionName(value: string): WslDistributionInfo;

  getState(): string;
  setState(value: string): WslDistributionInfo;

  getVersion(): number;
  setVersion(value: number): WslDistributionInfo;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): WslDistributionInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslDistributionInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WslDistributionInfo): WslDistributionInfo.AsObject;
  static serializeBinaryToWriter(message: WslDistributionInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslDistributionInfo;
  static deserializeBinaryFromReader(message: WslDistributionInfo, reader: jspb.BinaryReader): WslDistributionInfo;
}

export namespace WslDistributionInfo {
  export type AsObject = {
    distributionName: string;
    state: string;
    version: number;
    isDefault: boolean;
  };
}

export class WslGlobalConfig extends jspb.Message {
  getMemory(): google_protobuf_wrappers_pb.StringValue | undefined;
  setMemory(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfig;
  hasMemory(): boolean;
  clearMemory(): WslGlobalConfig;

  getProcessors(): google_protobuf_wrappers_pb.UInt32Value | undefined;
  setProcessors(value?: google_protobuf_wrappers_pb.UInt32Value): WslGlobalConfig;
  hasProcessors(): boolean;
  clearProcessors(): WslGlobalConfig;

  getSwap(): google_protobuf_wrappers_pb.StringValue | undefined;
  setSwap(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfig;
  hasSwap(): boolean;
  clearSwap(): WslGlobalConfig;

  getSwapFile(): google_protobuf_wrappers_pb.StringValue | undefined;
  setSwapFile(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfig;
  hasSwapFile(): boolean;
  clearSwapFile(): WslGlobalConfig;

  getDefaultVhdSize(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDefaultVhdSize(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfig;
  hasDefaultVhdSize(): boolean;
  clearDefaultVhdSize(): WslGlobalConfig;

  getNetworkingMode(): WslNetworkingMode;
  setNetworkingMode(value: WslNetworkingMode): WslGlobalConfig;

  getFirewall(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setFirewall(value?: google_protobuf_wrappers_pb.BoolValue): WslGlobalConfig;
  hasFirewall(): boolean;
  clearFirewall(): WslGlobalConfig;

  getDnsTunneling(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setDnsTunneling(value?: google_protobuf_wrappers_pb.BoolValue): WslGlobalConfig;
  hasDnsTunneling(): boolean;
  clearDnsTunneling(): WslGlobalConfig;

  getAutoProxy(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setAutoProxy(value?: google_protobuf_wrappers_pb.BoolValue): WslGlobalConfig;
  hasAutoProxy(): boolean;
  clearAutoProxy(): WslGlobalConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslGlobalConfig.AsObject;
  static toObject(includeInstance: boolean, msg: WslGlobalConfig): WslGlobalConfig.AsObject;
  static serializeBinaryToWriter(message: WslGlobalConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslGlobalConfig;
  static deserializeBinaryFromReader(message: WslGlobalConfig, reader: jspb.BinaryReader): WslGlobalConfig;
}

export namespace WslGlobalConfig {
  export type AsObject = {
    memory?: google_protobuf_wrappers_pb.StringValue.AsObject;
    processors?: google_protobuf_wrappers_pb.UInt32Value.AsObject;
    swap?: google_protobuf_wrappers_pb.StringValue.AsObject;
    swapFile?: google_protobuf_wrappers_pb.StringValue.AsObject;
    defaultVhdSize?: google_protobuf_wrappers_pb.StringValue.AsObject;
    networkingMode: WslNetworkingMode;
    firewall?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    dnsTunneling?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    autoProxy?: google_protobuf_wrappers_pb.BoolValue.AsObject;
  };
}

export class WslDistributionConfig extends jspb.Message {
  getDisableWindowsInterop(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setDisableWindowsInterop(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasDisableWindowsInterop(): boolean;
  clearDisableWindowsInterop(): WslDistributionConfig;

  getDisableAppendWindowsPath(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setDisableAppendWindowsPath(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasDisableAppendWindowsPath(): boolean;
  clearDisableAppendWindowsPath(): WslDistributionConfig;

  getDisableAutoMountWindowsDrives(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setDisableAutoMountWindowsDrives(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasDisableAutoMountWindowsDrives(): boolean;
  clearDisableAutoMountWindowsDrives(): WslDistributionConfig;

  getMountFstab(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setMountFstab(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasMountFstab(): boolean;
  clearMountFstab(): WslDistributionConfig;

  getGenerateHosts(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setGenerateHosts(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasGenerateHosts(): boolean;
  clearGenerateHosts(): WslDistributionConfig;

  getGenerateResolvConf(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setGenerateResolvConf(value?: google_protobuf_wrappers_pb.BoolValue): WslDistributionConfig;
  hasGenerateResolvConf(): boolean;
  clearGenerateResolvConf(): WslDistributionConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslDistributionConfig.AsObject;
  static toObject(includeInstance: boolean, msg: WslDistributionConfig): WslDistributionConfig.AsObject;
  static serializeBinaryToWriter(message: WslDistributionConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslDistributionConfig;
  static deserializeBinaryFromReader(message: WslDistributionConfig, reader: jspb.BinaryReader): WslDistributionConfig;
}

export namespace WslDistributionConfig {
  export type AsObject = {
    disableWindowsInterop?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    disableAppendWindowsPath?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    disableAutoMountWindowsDrives?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    mountFstab?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    generateHosts?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    generateResolvConf?: google_protobuf_wrappers_pb.BoolValue.AsObject;
  };
}

export class WslActivityEvent extends jspb.Message {
  getLogName(): string;
  setLogName(value: string): WslActivityEvent;

  getProviderName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setProviderName(value?: google_protobuf_wrappers_pb.StringValue): WslActivityEvent;
  hasProviderName(): boolean;
  clearProviderName(): WslActivityEvent;

  getEventId(): number;
  setEventId(value: number): WslActivityEvent;

  getLevel(): google_protobuf_wrappers_pb.StringValue | undefined;
  setLevel(value?: google_protobuf_wrappers_pb.StringValue): WslActivityEvent;
  hasLevel(): boolean;
  clearLevel(): WslActivityEvent;

  getTimeCreated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimeCreated(value?: google_protobuf_timestamp_pb.Timestamp): WslActivityEvent;
  hasTimeCreated(): boolean;
  clearTimeCreated(): WslActivityEvent;

  getMachineName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setMachineName(value?: google_protobuf_wrappers_pb.StringValue): WslActivityEvent;
  hasMachineName(): boolean;
  clearMachineName(): WslActivityEvent;

  getMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setMessage(value?: google_protobuf_wrappers_pb.StringValue): WslActivityEvent;
  hasMessage(): boolean;
  clearMessage(): WslActivityEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslActivityEvent.AsObject;
  static toObject(includeInstance: boolean, msg: WslActivityEvent): WslActivityEvent.AsObject;
  static serializeBinaryToWriter(message: WslActivityEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslActivityEvent;
  static deserializeBinaryFromReader(message: WslActivityEvent, reader: jspb.BinaryReader): WslActivityEvent;
}

export namespace WslActivityEvent {
  export type AsObject = {
    logName: string;
    providerName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    eventId: number;
    level?: google_protobuf_wrappers_pb.StringValue.AsObject;
    timeCreated?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    machineName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    message?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslComplianceReport extends jspb.Message {
  getWslCommandAvailable(): boolean;
  setWslCommandAvailable(value: boolean): WslComplianceReport;

  getStatusText(): string;
  setStatusText(value: string): WslComplianceReport;

  getDistributionsList(): Array<WslDistributionInfo>;
  setDistributionsList(value: Array<WslDistributionInfo>): WslComplianceReport;
  clearDistributionsList(): WslComplianceReport;
  addDistributions(value?: WslDistributionInfo, index?: number): WslDistributionInfo;

  getActualGlobalConfig(): WslGlobalConfig | undefined;
  setActualGlobalConfig(value?: WslGlobalConfig): WslComplianceReport;
  hasActualGlobalConfig(): boolean;
  clearActualGlobalConfig(): WslComplianceReport;

  getActualDistributionConfig(): WslDistributionConfig | undefined;
  setActualDistributionConfig(value?: WslDistributionConfig): WslComplianceReport;
  hasActualDistributionConfig(): boolean;
  clearActualDistributionConfig(): WslComplianceReport;

  getActualGlobalConfigRaw(): google_protobuf_wrappers_pb.StringValue | undefined;
  setActualGlobalConfigRaw(value?: google_protobuf_wrappers_pb.StringValue): WslComplianceReport;
  hasActualGlobalConfigRaw(): boolean;
  clearActualGlobalConfigRaw(): WslComplianceReport;

  getActualDistributionConfigRaw(): google_protobuf_wrappers_pb.StringValue | undefined;
  setActualDistributionConfigRaw(value?: google_protobuf_wrappers_pb.StringValue): WslComplianceReport;
  hasActualDistributionConfigRaw(): boolean;
  clearActualDistributionConfigRaw(): WslComplianceReport;

  getGlobalConfigMatchesExpected(): boolean;
  setGlobalConfigMatchesExpected(value: boolean): WslComplianceReport;

  getDistributionConfigMatchesExpected(): boolean;
  setDistributionConfigMatchesExpected(value: boolean): WslComplianceReport;

  getMdeHealthcheck(): MdeHealthcheckInfo | undefined;
  setMdeHealthcheck(value?: MdeHealthcheckInfo): WslComplianceReport;
  hasMdeHealthcheck(): boolean;
  clearMdeHealthcheck(): WslComplianceReport;

  getIssuesList(): Array<string>;
  setIssuesList(value: Array<string>): WslComplianceReport;
  clearIssuesList(): WslComplianceReport;
  addIssues(value: string, index?: number): WslComplianceReport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslComplianceReport.AsObject;
  static toObject(includeInstance: boolean, msg: WslComplianceReport): WslComplianceReport.AsObject;
  static serializeBinaryToWriter(message: WslComplianceReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslComplianceReport;
  static deserializeBinaryFromReader(message: WslComplianceReport, reader: jspb.BinaryReader): WslComplianceReport;
}

export namespace WslComplianceReport {
  export type AsObject = {
    wslCommandAvailable: boolean;
    statusText: string;
    distributionsList: Array<WslDistributionInfo.AsObject>;
    actualGlobalConfig?: WslGlobalConfig.AsObject;
    actualDistributionConfig?: WslDistributionConfig.AsObject;
    actualGlobalConfigRaw?: google_protobuf_wrappers_pb.StringValue.AsObject;
    actualDistributionConfigRaw?: google_protobuf_wrappers_pb.StringValue.AsObject;
    globalConfigMatchesExpected: boolean;
    distributionConfigMatchesExpected: boolean;
    mdeHealthcheck?: MdeHealthcheckInfo.AsObject;
    issuesList: Array<string>;
  };
}

export class MdeHealthcheckInfo extends jspb.Message {
  getAvailable(): boolean;
  setAvailable(value: boolean): MdeHealthcheckInfo;

  getExitCode(): number;
  setExitCode(value: number): MdeHealthcheckInfo;

  getStdOut(): string;
  setStdOut(value: string): MdeHealthcheckInfo;

  getStdErr(): string;
  setStdErr(value: string): MdeHealthcheckInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MdeHealthcheckInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MdeHealthcheckInfo): MdeHealthcheckInfo.AsObject;
  static serializeBinaryToWriter(message: MdeHealthcheckInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MdeHealthcheckInfo;
  static deserializeBinaryFromReader(message: MdeHealthcheckInfo, reader: jspb.BinaryReader): MdeHealthcheckInfo;
}

export namespace MdeHealthcheckInfo {
  export type AsObject = {
    available: boolean;
    exitCode: number;
    stdOut: string;
    stdErr: string;
  };
}

export enum OperatorWslControlResponseStatus {
  OPERATOR_WSL_CONTROL_RESPONSE_STATUS_OK = 0,
  OPERATOR_WSL_CONTROL_RESPONSE_STATUS_ERROR = 1,
}
export enum WslDistributionVersion {
  WSL_DISTRIBUTION_VERSION_UNSPECIFIED = 0,
  WSL_DISTRIBUTION_VERSION_1 = 1,
  WSL_DISTRIBUTION_VERSION_2 = 2,
}
export enum WslNetworkingMode {
  WSL_NETWORKING_MODE_UNSPECIFIED = 0,
  WSL_NETWORKING_MODE_NONE = 1,
  WSL_NETWORKING_MODE_NAT = 2,
  WSL_NETWORKING_MODE_MIRRORED = 3,
  WSL_NETWORKING_MODE_VIRTIO_PROXY = 4,
}
