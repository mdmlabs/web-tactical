import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class WslControlAgentMessage extends jspb.Message {
  getHello(): WslAgentHello | undefined;
  setHello(value?: WslAgentHello): WslControlAgentMessage;
  hasHello(): boolean;
  clearHello(): WslControlAgentMessage;

  getAccepted(): WslCommandAccepted | undefined;
  setAccepted(value?: WslCommandAccepted): WslControlAgentMessage;
  hasAccepted(): boolean;
  clearAccepted(): WslControlAgentMessage;

  getCompleted(): WslCommandCompleted | undefined;
  setCompleted(value?: WslCommandCompleted): WslControlAgentMessage;
  hasCompleted(): boolean;
  clearCompleted(): WslControlAgentMessage;

  getStatusResult(): WslStatusResult | undefined;
  setStatusResult(value?: WslStatusResult): WslControlAgentMessage;
  hasStatusResult(): boolean;
  clearStatusResult(): WslControlAgentMessage;

  getDistributionsResult(): WslDistributionsResult | undefined;
  setDistributionsResult(value?: WslDistributionsResult): WslControlAgentMessage;
  hasDistributionsResult(): boolean;
  clearDistributionsResult(): WslControlAgentMessage;

  getGlobalConfigResult(): WslGlobalConfigResult | undefined;
  setGlobalConfigResult(value?: WslGlobalConfigResult): WslControlAgentMessage;
  hasGlobalConfigResult(): boolean;
  clearGlobalConfigResult(): WslControlAgentMessage;

  getDistributionConfigResult(): WslDistributionConfigResult | undefined;
  setDistributionConfigResult(value?: WslDistributionConfigResult): WslControlAgentMessage;
  hasDistributionConfigResult(): boolean;
  clearDistributionConfigResult(): WslControlAgentMessage;

  getActivityLogResult(): WslActivityLogResult | undefined;
  setActivityLogResult(value?: WslActivityLogResult): WslControlAgentMessage;
  hasActivityLogResult(): boolean;
  clearActivityLogResult(): WslControlAgentMessage;

  getComplianceResult(): WslComplianceResult | undefined;
  setComplianceResult(value?: WslComplianceResult): WslControlAgentMessage;
  hasComplianceResult(): boolean;
  clearComplianceResult(): WslControlAgentMessage;

  getHeartbeat(): WslAgentHeartbeat | undefined;
  setHeartbeat(value?: WslAgentHeartbeat): WslControlAgentMessage;
  hasHeartbeat(): boolean;
  clearHeartbeat(): WslControlAgentMessage;

  getPayloadCase(): WslControlAgentMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslControlAgentMessage.AsObject;
  static toObject(includeInstance: boolean, msg: WslControlAgentMessage): WslControlAgentMessage.AsObject;
  static serializeBinaryToWriter(message: WslControlAgentMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslControlAgentMessage;
  static deserializeBinaryFromReader(message: WslControlAgentMessage, reader: jspb.BinaryReader): WslControlAgentMessage;
}

export namespace WslControlAgentMessage {
  export type AsObject = {
    hello?: WslAgentHello.AsObject;
    accepted?: WslCommandAccepted.AsObject;
    completed?: WslCommandCompleted.AsObject;
    statusResult?: WslStatusResult.AsObject;
    distributionsResult?: WslDistributionsResult.AsObject;
    globalConfigResult?: WslGlobalConfigResult.AsObject;
    distributionConfigResult?: WslDistributionConfigResult.AsObject;
    activityLogResult?: WslActivityLogResult.AsObject;
    complianceResult?: WslComplianceResult.AsObject;
    heartbeat?: WslAgentHeartbeat.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    HELLO = 1,
    ACCEPTED = 2,
    COMPLETED = 3,
    STATUS_RESULT = 4,
    DISTRIBUTIONS_RESULT = 5,
    GLOBAL_CONFIG_RESULT = 6,
    DISTRIBUTION_CONFIG_RESULT = 7,
    ACTIVITY_LOG_RESULT = 8,
    COMPLIANCE_RESULT = 9,
    HEARTBEAT = 10,
  }
}

export class WslControlMasterMessage extends jspb.Message {
  getImportDistribution(): ImportDistributionCommand | undefined;
  setImportDistribution(value?: ImportDistributionCommand): WslControlMasterMessage;
  hasImportDistribution(): boolean;
  clearImportDistribution(): WslControlMasterMessage;

  getUnregisterDistribution(): UnregisterDistributionCommand | undefined;
  setUnregisterDistribution(value?: UnregisterDistributionCommand): WslControlMasterMessage;
  hasUnregisterDistribution(): boolean;
  clearUnregisterDistribution(): WslControlMasterMessage;

  getTerminateDistribution(): TerminateDistributionCommand | undefined;
  setTerminateDistribution(value?: TerminateDistributionCommand): WslControlMasterMessage;
  hasTerminateDistribution(): boolean;
  clearTerminateDistribution(): WslControlMasterMessage;

  getShutdownWsl(): ShutdownWslCommand | undefined;
  setShutdownWsl(value?: ShutdownWslCommand): WslControlMasterMessage;
  hasShutdownWsl(): boolean;
  clearShutdownWsl(): WslControlMasterMessage;

  getUpdateWslEngine(): UpdateWslEngineCommand | undefined;
  setUpdateWslEngine(value?: UpdateWslEngineCommand): WslControlMasterMessage;
  hasUpdateWslEngine(): boolean;
  clearUpdateWslEngine(): WslControlMasterMessage;

  getUpdateDistributionPackages(): UpdateDistributionPackagesCommand | undefined;
  setUpdateDistributionPackages(value?: UpdateDistributionPackagesCommand): WslControlMasterMessage;
  hasUpdateDistributionPackages(): boolean;
  clearUpdateDistributionPackages(): WslControlMasterMessage;

  getApplyGlobalConfig(): ApplyGlobalConfigCommand | undefined;
  setApplyGlobalConfig(value?: ApplyGlobalConfigCommand): WslControlMasterMessage;
  hasApplyGlobalConfig(): boolean;
  clearApplyGlobalConfig(): WslControlMasterMessage;

  getApplyDistributionConfig(): ApplyDistributionConfigCommand | undefined;
  setApplyDistributionConfig(value?: ApplyDistributionConfigCommand): WslControlMasterMessage;
  hasApplyDistributionConfig(): boolean;
  clearApplyDistributionConfig(): WslControlMasterMessage;

  getGetWslStatus(): GetWslStatusCommand | undefined;
  setGetWslStatus(value?: GetWslStatusCommand): WslControlMasterMessage;
  hasGetWslStatus(): boolean;
  clearGetWslStatus(): WslControlMasterMessage;

  getGetDistributions(): GetDistributionsCommand | undefined;
  setGetDistributions(value?: GetDistributionsCommand): WslControlMasterMessage;
  hasGetDistributions(): boolean;
  clearGetDistributions(): WslControlMasterMessage;

  getGetGlobalConfig(): GetGlobalConfigCommand | undefined;
  setGetGlobalConfig(value?: GetGlobalConfigCommand): WslControlMasterMessage;
  hasGetGlobalConfig(): boolean;
  clearGetGlobalConfig(): WslControlMasterMessage;

  getGetDistributionConfig(): GetDistributionConfigCommand | undefined;
  setGetDistributionConfig(value?: GetDistributionConfigCommand): WslControlMasterMessage;
  hasGetDistributionConfig(): boolean;
  clearGetDistributionConfig(): WslControlMasterMessage;

  getGetActivityLog(): GetActivityLogCommand | undefined;
  setGetActivityLog(value?: GetActivityLogCommand): WslControlMasterMessage;
  hasGetActivityLog(): boolean;
  clearGetActivityLog(): WslControlMasterMessage;

  getGetCompliance(): GetComplianceCommand | undefined;
  setGetCompliance(value?: GetComplianceCommand): WslControlMasterMessage;
  hasGetCompliance(): boolean;
  clearGetCompliance(): WslControlMasterMessage;

  getPayloadCase(): WslControlMasterMessage.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslControlMasterMessage.AsObject;
  static toObject(includeInstance: boolean, msg: WslControlMasterMessage): WslControlMasterMessage.AsObject;
  static serializeBinaryToWriter(message: WslControlMasterMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslControlMasterMessage;
  static deserializeBinaryFromReader(message: WslControlMasterMessage, reader: jspb.BinaryReader): WslControlMasterMessage;
}

export namespace WslControlMasterMessage {
  export type AsObject = {
    importDistribution?: ImportDistributionCommand.AsObject;
    unregisterDistribution?: UnregisterDistributionCommand.AsObject;
    terminateDistribution?: TerminateDistributionCommand.AsObject;
    shutdownWsl?: ShutdownWslCommand.AsObject;
    updateWslEngine?: UpdateWslEngineCommand.AsObject;
    updateDistributionPackages?: UpdateDistributionPackagesCommand.AsObject;
    applyGlobalConfig?: ApplyGlobalConfigCommand.AsObject;
    applyDistributionConfig?: ApplyDistributionConfigCommand.AsObject;
    getWslStatus?: GetWslStatusCommand.AsObject;
    getDistributions?: GetDistributionsCommand.AsObject;
    getGlobalConfig?: GetGlobalConfigCommand.AsObject;
    getDistributionConfig?: GetDistributionConfigCommand.AsObject;
    getActivityLog?: GetActivityLogCommand.AsObject;
    getCompliance?: GetComplianceCommand.AsObject;
  };

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    IMPORT_DISTRIBUTION = 1,
    UNREGISTER_DISTRIBUTION = 2,
    TERMINATE_DISTRIBUTION = 3,
    SHUTDOWN_WSL = 4,
    UPDATE_WSL_ENGINE = 5,
    UPDATE_DISTRIBUTION_PACKAGES = 6,
    APPLY_GLOBAL_CONFIG = 7,
    APPLY_DISTRIBUTION_CONFIG = 8,
    GET_WSL_STATUS = 9,
    GET_DISTRIBUTIONS = 10,
    GET_GLOBAL_CONFIG = 11,
    GET_DISTRIBUTION_CONFIG = 12,
    GET_ACTIVITY_LOG = 13,
    GET_COMPLIANCE = 14,
  }
}

export class WslAgentHello extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): WslAgentHello;

  getHostName(): string;
  setHostName(value: string): WslAgentHello;

  getAgentVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
  setAgentVersion(value?: google_protobuf_wrappers_pb.StringValue): WslAgentHello;
  hasAgentVersion(): boolean;
  clearAgentVersion(): WslAgentHello;

  getOsVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
  setOsVersion(value?: google_protobuf_wrappers_pb.StringValue): WslAgentHello;
  hasOsVersion(): boolean;
  clearOsVersion(): WslAgentHello;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslAgentHello.AsObject;
  static toObject(includeInstance: boolean, msg: WslAgentHello): WslAgentHello.AsObject;
  static serializeBinaryToWriter(message: WslAgentHello, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslAgentHello;
  static deserializeBinaryFromReader(message: WslAgentHello, reader: jspb.BinaryReader): WslAgentHello;
}

export namespace WslAgentHello {
  export type AsObject = {
    agentId: string;
    hostName: string;
    agentVersion?: google_protobuf_wrappers_pb.StringValue.AsObject;
    osVersion?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslAgentHeartbeat extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): WslAgentHeartbeat;

  getUtcTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUtcTime(value?: google_protobuf_timestamp_pb.Timestamp): WslAgentHeartbeat;
  hasUtcTime(): boolean;
  clearUtcTime(): WslAgentHeartbeat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslAgentHeartbeat.AsObject;
  static toObject(includeInstance: boolean, msg: WslAgentHeartbeat): WslAgentHeartbeat.AsObject;
  static serializeBinaryToWriter(message: WslAgentHeartbeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslAgentHeartbeat;
  static deserializeBinaryFromReader(message: WslAgentHeartbeat, reader: jspb.BinaryReader): WslAgentHeartbeat;
}

export namespace WslAgentHeartbeat {
  export type AsObject = {
    agentId: string;
    utcTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class WslCommandAccepted extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslCommandAccepted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslCommandAccepted.AsObject;
  static toObject(includeInstance: boolean, msg: WslCommandAccepted): WslCommandAccepted.AsObject;
  static serializeBinaryToWriter(message: WslCommandAccepted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslCommandAccepted;
  static deserializeBinaryFromReader(message: WslCommandAccepted, reader: jspb.BinaryReader): WslCommandAccepted;
}

export namespace WslCommandAccepted {
  export type AsObject = {
    commandId: string;
  };
}

export class WslCommandCompleted extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslCommandCompleted;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslCommandCompleted;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslCommandCompleted;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslCommandCompleted;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslCommandCompleted.AsObject;
  static toObject(includeInstance: boolean, msg: WslCommandCompleted): WslCommandCompleted.AsObject;
  static serializeBinaryToWriter(message: WslCommandCompleted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslCommandCompleted;
  static deserializeBinaryFromReader(message: WslCommandCompleted, reader: jspb.BinaryReader): WslCommandCompleted;
}

export namespace WslCommandCompleted {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class ImportDistributionCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): ImportDistributionCommand;

  getDistributionName(): string;
  setDistributionName(value: string): ImportDistributionCommand;

  getInstallLocation(): string;
  setInstallLocation(value: string): ImportDistributionCommand;

  getPackagePath(): string;
  setPackagePath(value: string): ImportDistributionCommand;

  getVersion(): WslDistributionVersion;
  setVersion(value: WslDistributionVersion): ImportDistributionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportDistributionCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ImportDistributionCommand): ImportDistributionCommand.AsObject;
  static serializeBinaryToWriter(message: ImportDistributionCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportDistributionCommand;
  static deserializeBinaryFromReader(message: ImportDistributionCommand, reader: jspb.BinaryReader): ImportDistributionCommand;
}

export namespace ImportDistributionCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
    installLocation: string;
    packagePath: string;
    version: WslDistributionVersion;
  };
}

export class UnregisterDistributionCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): UnregisterDistributionCommand;

  getDistributionName(): string;
  setDistributionName(value: string): UnregisterDistributionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnregisterDistributionCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UnregisterDistributionCommand): UnregisterDistributionCommand.AsObject;
  static serializeBinaryToWriter(message: UnregisterDistributionCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnregisterDistributionCommand;
  static deserializeBinaryFromReader(message: UnregisterDistributionCommand, reader: jspb.BinaryReader): UnregisterDistributionCommand;
}

export namespace UnregisterDistributionCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
  };
}

export class TerminateDistributionCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): TerminateDistributionCommand;

  getDistributionName(): string;
  setDistributionName(value: string): TerminateDistributionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TerminateDistributionCommand.AsObject;
  static toObject(includeInstance: boolean, msg: TerminateDistributionCommand): TerminateDistributionCommand.AsObject;
  static serializeBinaryToWriter(message: TerminateDistributionCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TerminateDistributionCommand;
  static deserializeBinaryFromReader(message: TerminateDistributionCommand, reader: jspb.BinaryReader): TerminateDistributionCommand;
}

export namespace TerminateDistributionCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
  };
}

export class ShutdownWslCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): ShutdownWslCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShutdownWslCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ShutdownWslCommand): ShutdownWslCommand.AsObject;
  static serializeBinaryToWriter(message: ShutdownWslCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShutdownWslCommand;
  static deserializeBinaryFromReader(message: ShutdownWslCommand, reader: jspb.BinaryReader): ShutdownWslCommand;
}

export namespace ShutdownWslCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class UpdateWslEngineCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): UpdateWslEngineCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateWslEngineCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateWslEngineCommand): UpdateWslEngineCommand.AsObject;
  static serializeBinaryToWriter(message: UpdateWslEngineCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateWslEngineCommand;
  static deserializeBinaryFromReader(message: UpdateWslEngineCommand, reader: jspb.BinaryReader): UpdateWslEngineCommand;
}

export namespace UpdateWslEngineCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class UpdateDistributionPackagesCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): UpdateDistributionPackagesCommand;

  getDistributionName(): string;
  setDistributionName(value: string): UpdateDistributionPackagesCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateDistributionPackagesCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateDistributionPackagesCommand): UpdateDistributionPackagesCommand.AsObject;
  static serializeBinaryToWriter(message: UpdateDistributionPackagesCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateDistributionPackagesCommand;
  static deserializeBinaryFromReader(message: UpdateDistributionPackagesCommand, reader: jspb.BinaryReader): UpdateDistributionPackagesCommand;
}

export namespace UpdateDistributionPackagesCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
  };
}

export class ApplyGlobalConfigCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): ApplyGlobalConfigCommand;

  getConfig(): WslGlobalConfig | undefined;
  setConfig(value?: WslGlobalConfig): ApplyGlobalConfigCommand;
  hasConfig(): boolean;
  clearConfig(): ApplyGlobalConfigCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyGlobalConfigCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyGlobalConfigCommand): ApplyGlobalConfigCommand.AsObject;
  static serializeBinaryToWriter(message: ApplyGlobalConfigCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyGlobalConfigCommand;
  static deserializeBinaryFromReader(message: ApplyGlobalConfigCommand, reader: jspb.BinaryReader): ApplyGlobalConfigCommand;
}

export namespace ApplyGlobalConfigCommand {
  export type AsObject = {
    commandId: string;
    config?: WslGlobalConfig.AsObject;
  };
}

export class ApplyDistributionConfigCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): ApplyDistributionConfigCommand;

  getDistributionName(): string;
  setDistributionName(value: string): ApplyDistributionConfigCommand;

  getConfig(): WslDistributionConfig | undefined;
  setConfig(value?: WslDistributionConfig): ApplyDistributionConfigCommand;
  hasConfig(): boolean;
  clearConfig(): ApplyDistributionConfigCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyDistributionConfigCommand.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyDistributionConfigCommand): ApplyDistributionConfigCommand.AsObject;
  static serializeBinaryToWriter(message: ApplyDistributionConfigCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyDistributionConfigCommand;
  static deserializeBinaryFromReader(message: ApplyDistributionConfigCommand, reader: jspb.BinaryReader): ApplyDistributionConfigCommand;
}

export namespace ApplyDistributionConfigCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
    config?: WslDistributionConfig.AsObject;
  };
}

export class GetWslStatusCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetWslStatusCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetWslStatusCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetWslStatusCommand): GetWslStatusCommand.AsObject;
  static serializeBinaryToWriter(message: GetWslStatusCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetWslStatusCommand;
  static deserializeBinaryFromReader(message: GetWslStatusCommand, reader: jspb.BinaryReader): GetWslStatusCommand;
}

export namespace GetWslStatusCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class GetDistributionsCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetDistributionsCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDistributionsCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetDistributionsCommand): GetDistributionsCommand.AsObject;
  static serializeBinaryToWriter(message: GetDistributionsCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDistributionsCommand;
  static deserializeBinaryFromReader(message: GetDistributionsCommand, reader: jspb.BinaryReader): GetDistributionsCommand;
}

export namespace GetDistributionsCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class GetGlobalConfigCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetGlobalConfigCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGlobalConfigCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetGlobalConfigCommand): GetGlobalConfigCommand.AsObject;
  static serializeBinaryToWriter(message: GetGlobalConfigCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGlobalConfigCommand;
  static deserializeBinaryFromReader(message: GetGlobalConfigCommand, reader: jspb.BinaryReader): GetGlobalConfigCommand;
}

export namespace GetGlobalConfigCommand {
  export type AsObject = {
    commandId: string;
  };
}

export class GetDistributionConfigCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetDistributionConfigCommand;

  getDistributionName(): string;
  setDistributionName(value: string): GetDistributionConfigCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDistributionConfigCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetDistributionConfigCommand): GetDistributionConfigCommand.AsObject;
  static serializeBinaryToWriter(message: GetDistributionConfigCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDistributionConfigCommand;
  static deserializeBinaryFromReader(message: GetDistributionConfigCommand, reader: jspb.BinaryReader): GetDistributionConfigCommand;
}

export namespace GetDistributionConfigCommand {
  export type AsObject = {
    commandId: string;
    distributionName: string;
  };
}

export class GetActivityLogCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetActivityLogCommand;

  getMaxEvents(): number;
  setMaxEvents(value: number): GetActivityLogCommand;

  getLogNameFilter(): google_protobuf_wrappers_pb.StringValue | undefined;
  setLogNameFilter(value?: google_protobuf_wrappers_pb.StringValue): GetActivityLogCommand;
  hasLogNameFilter(): boolean;
  clearLogNameFilter(): GetActivityLogCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetActivityLogCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetActivityLogCommand): GetActivityLogCommand.AsObject;
  static serializeBinaryToWriter(message: GetActivityLogCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetActivityLogCommand;
  static deserializeBinaryFromReader(message: GetActivityLogCommand, reader: jspb.BinaryReader): GetActivityLogCommand;
}

export namespace GetActivityLogCommand {
  export type AsObject = {
    commandId: string;
    maxEvents: number;
    logNameFilter?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class GetComplianceCommand extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): GetComplianceCommand;

  getDistributionName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDistributionName(value?: google_protobuf_wrappers_pb.StringValue): GetComplianceCommand;
  hasDistributionName(): boolean;
  clearDistributionName(): GetComplianceCommand;

  getExpectedGlobalConfig(): WslGlobalConfig | undefined;
  setExpectedGlobalConfig(value?: WslGlobalConfig): GetComplianceCommand;
  hasExpectedGlobalConfig(): boolean;
  clearExpectedGlobalConfig(): GetComplianceCommand;

  getExpectedDistributionConfig(): WslDistributionConfig | undefined;
  setExpectedDistributionConfig(value?: WslDistributionConfig): GetComplianceCommand;
  hasExpectedDistributionConfig(): boolean;
  clearExpectedDistributionConfig(): GetComplianceCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetComplianceCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GetComplianceCommand): GetComplianceCommand.AsObject;
  static serializeBinaryToWriter(message: GetComplianceCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetComplianceCommand;
  static deserializeBinaryFromReader(message: GetComplianceCommand, reader: jspb.BinaryReader): GetComplianceCommand;
}

export namespace GetComplianceCommand {
  export type AsObject = {
    commandId: string;
    distributionName?: google_protobuf_wrappers_pb.StringValue.AsObject;
    expectedGlobalConfig?: WslGlobalConfig.AsObject;
    expectedDistributionConfig?: WslDistributionConfig.AsObject;
  };
}

export class WslStatusResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslStatusResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslStatusResult;

  getInfo(): WslStatusInfo | undefined;
  setInfo(value?: WslStatusInfo): WslStatusResult;
  hasInfo(): boolean;
  clearInfo(): WslStatusResult;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslStatusResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslStatusResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslStatusResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslStatusResult): WslStatusResult.AsObject;
  static serializeBinaryToWriter(message: WslStatusResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslStatusResult;
  static deserializeBinaryFromReader(message: WslStatusResult, reader: jspb.BinaryReader): WslStatusResult;
}

export namespace WslStatusResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    info?: WslStatusInfo.AsObject;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslDistributionsResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslDistributionsResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslDistributionsResult;

  getDistributionsList(): Array<WslDistributionInfo>;
  setDistributionsList(value: Array<WslDistributionInfo>): WslDistributionsResult;
  clearDistributionsList(): WslDistributionsResult;
  addDistributions(value?: WslDistributionInfo, index?: number): WslDistributionInfo;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslDistributionsResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslDistributionsResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslDistributionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslDistributionsResult): WslDistributionsResult.AsObject;
  static serializeBinaryToWriter(message: WslDistributionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslDistributionsResult;
  static deserializeBinaryFromReader(message: WslDistributionsResult, reader: jspb.BinaryReader): WslDistributionsResult;
}

export namespace WslDistributionsResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    distributionsList: Array<WslDistributionInfo.AsObject>;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslGlobalConfigResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslGlobalConfigResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslGlobalConfigResult;

  getConfig(): WslGlobalConfig | undefined;
  setConfig(value?: WslGlobalConfig): WslGlobalConfigResult;
  hasConfig(): boolean;
  clearConfig(): WslGlobalConfigResult;

  getRawText(): google_protobuf_wrappers_pb.StringValue | undefined;
  setRawText(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfigResult;
  hasRawText(): boolean;
  clearRawText(): WslGlobalConfigResult;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslGlobalConfigResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslGlobalConfigResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslGlobalConfigResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslGlobalConfigResult): WslGlobalConfigResult.AsObject;
  static serializeBinaryToWriter(message: WslGlobalConfigResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslGlobalConfigResult;
  static deserializeBinaryFromReader(message: WslGlobalConfigResult, reader: jspb.BinaryReader): WslGlobalConfigResult;
}

export namespace WslGlobalConfigResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    config?: WslGlobalConfig.AsObject;
    rawText?: google_protobuf_wrappers_pb.StringValue.AsObject;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslDistributionConfigResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslDistributionConfigResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslDistributionConfigResult;

  getConfig(): WslDistributionConfig | undefined;
  setConfig(value?: WslDistributionConfig): WslDistributionConfigResult;
  hasConfig(): boolean;
  clearConfig(): WslDistributionConfigResult;

  getRawText(): google_protobuf_wrappers_pb.StringValue | undefined;
  setRawText(value?: google_protobuf_wrappers_pb.StringValue): WslDistributionConfigResult;
  hasRawText(): boolean;
  clearRawText(): WslDistributionConfigResult;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslDistributionConfigResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslDistributionConfigResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslDistributionConfigResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslDistributionConfigResult): WslDistributionConfigResult.AsObject;
  static serializeBinaryToWriter(message: WslDistributionConfigResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslDistributionConfigResult;
  static deserializeBinaryFromReader(message: WslDistributionConfigResult, reader: jspb.BinaryReader): WslDistributionConfigResult;
}

export namespace WslDistributionConfigResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    config?: WslDistributionConfig.AsObject;
    rawText?: google_protobuf_wrappers_pb.StringValue.AsObject;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslActivityLogResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslActivityLogResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslActivityLogResult;

  getEventsList(): Array<WslActivityEvent>;
  setEventsList(value: Array<WslActivityEvent>): WslActivityLogResult;
  clearEventsList(): WslActivityLogResult;
  addEvents(value?: WslActivityEvent, index?: number): WslActivityEvent;

  getDiscoveredLogsList(): Array<string>;
  setDiscoveredLogsList(value: Array<string>): WslActivityLogResult;
  clearDiscoveredLogsList(): WslActivityLogResult;
  addDiscoveredLogs(value: string, index?: number): WslActivityLogResult;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslActivityLogResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslActivityLogResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslActivityLogResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslActivityLogResult): WslActivityLogResult.AsObject;
  static serializeBinaryToWriter(message: WslActivityLogResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslActivityLogResult;
  static deserializeBinaryFromReader(message: WslActivityLogResult, reader: jspb.BinaryReader): WslActivityLogResult;
}

export namespace WslActivityLogResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    eventsList: Array<WslActivityEvent.AsObject>;
    discoveredLogsList: Array<string>;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
}

export class WslComplianceResult extends jspb.Message {
  getCommandId(): string;
  setCommandId(value: string): WslComplianceResult;

  getStatus(): WslResponseStatus;
  setStatus(value: WslResponseStatus): WslComplianceResult;

  getReport(): WslComplianceReport | undefined;
  setReport(value?: WslComplianceReport): WslComplianceResult;
  hasReport(): boolean;
  clearReport(): WslComplianceResult;

  getErrorMessage(): google_protobuf_wrappers_pb.StringValue | undefined;
  setErrorMessage(value?: google_protobuf_wrappers_pb.StringValue): WslComplianceResult;
  hasErrorMessage(): boolean;
  clearErrorMessage(): WslComplianceResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslComplianceResult.AsObject;
  static toObject(includeInstance: boolean, msg: WslComplianceResult): WslComplianceResult.AsObject;
  static serializeBinaryToWriter(message: WslComplianceResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslComplianceResult;
  static deserializeBinaryFromReader(message: WslComplianceResult, reader: jspb.BinaryReader): WslComplianceResult;
}

export namespace WslComplianceResult {
  export type AsObject = {
    commandId: string;
    status: WslResponseStatus;
    report?: WslComplianceReport.AsObject;
    errorMessage?: google_protobuf_wrappers_pb.StringValue.AsObject;
  };
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

  getMdeHealthcheck(): WslMdeHealthcheckInfo | undefined;
  setMdeHealthcheck(value?: WslMdeHealthcheckInfo): WslComplianceReport;
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
    mdeHealthcheck?: WslMdeHealthcheckInfo.AsObject;
    issuesList: Array<string>;
  };
}

export class WslMdeHealthcheckInfo extends jspb.Message {
  getAvailable(): boolean;
  setAvailable(value: boolean): WslMdeHealthcheckInfo;

  getExitCode(): number;
  setExitCode(value: number): WslMdeHealthcheckInfo;

  getStdOut(): string;
  setStdOut(value: string): WslMdeHealthcheckInfo;

  getStdErr(): string;
  setStdErr(value: string): WslMdeHealthcheckInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WslMdeHealthcheckInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WslMdeHealthcheckInfo): WslMdeHealthcheckInfo.AsObject;
  static serializeBinaryToWriter(message: WslMdeHealthcheckInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WslMdeHealthcheckInfo;
  static deserializeBinaryFromReader(message: WslMdeHealthcheckInfo, reader: jspb.BinaryReader): WslMdeHealthcheckInfo;
}

export namespace WslMdeHealthcheckInfo {
  export type AsObject = {
    available: boolean;
    exitCode: number;
    stdOut: string;
    stdErr: string;
  };
}

export enum WslResponseStatus {
  WSL_RESPONSE_STATUS_OK = 0,
  WSL_RESPONSE_STATUS_ERROR = 1,
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
