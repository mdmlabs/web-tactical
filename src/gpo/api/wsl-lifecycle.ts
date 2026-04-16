import { OperatorWslControlServiceClient } from "@/generated/Wsl_lifecycle_serviceServiceClientPb";
import * as wsl_lifecycle_service_pb from "@/generated/wsl_lifecycle_service_pb";
import { createGrpcMetadata, getGrpcUrl } from "@/gpo/api/grpc-client";
import type { Target } from "@/generated/common/target_pb";
import * as wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb";

const {
  ApplyDistributionConfigRequest,
  ApplyGlobalConfigRequest,
  DistributionIdentifier,
  GetWslActivityRequest,
  GetWslComplianceRequest,
  ImportDistributionRequest,
  OperatorWslControlResponseStatus,
  TargetRequest,
  WslDistributionConfig,
  WslDistributionVersion,
  WslGlobalConfig,
  WslNetworkingMode,
} = wsl_lifecycle_service_pb;

type TargetRequestLike = InstanceType<typeof TargetRequest>;
type DistributionIdentifierLike = InstanceType<typeof DistributionIdentifier>;
type WslGlobalConfigMessageLike = InstanceType<typeof WslGlobalConfig>;
type WslDistributionConfigMessageLike = InstanceType<typeof WslDistributionConfig>;

export interface WslDistributionIdentifier {
  target: Target;
  distributionName: string;
}

export interface ImportDistributionInput extends WslDistributionIdentifier {
  installLocation: string;
  packagePath: string;
  version?: number;
}

export interface WslGlobalConfigInput {
  memory?: string | null;
  processors?: number | null;
  swap?: string | null;
  swapFile?: string | null;
  defaultVhdSize?: string | null;
  networkingMode?: number | null;
  firewall?: boolean | null;
  dnsTunneling?: boolean | null;
  autoProxy?: boolean | null;
}

export interface ApplyGlobalConfigInput {
  target: Target;
  config: WslGlobalConfigInput;
}

export interface WslDistributionConfigInput {
  disableWindowsInterop?: boolean | null;
  disableAppendWindowsPath?: boolean | null;
  disableAutoMountWindowsDrives?: boolean | null;
  mountFstab?: boolean | null;
  generateHosts?: boolean | null;
  generateResolvConf?: boolean | null;
}

export interface ApplyDistributionConfigInput extends WslDistributionIdentifier {
  config: WslDistributionConfigInput;
}

export interface GetWslActivityLogInput {
  target: Target;
  maxEvents?: number;
  logNameFilter?: string | null;
}

export interface GetWslComplianceReportInput {
  target: Target;
  distributionName?: string | null;
  expectedGlobalConfig?: WslGlobalConfigInput;
  expectedDistributionConfig?: WslDistributionConfigInput;
}

export interface WslControlResult {
  status: number;
  errorMessage?: string;
}

export interface WslStatusResult extends WslControlResult {
  rawText?: string;
}

export interface WslDistributionRecord {
  distributionName: string;
  state: string;
  version: number;
  isDefault: boolean;
}

export interface WslGlobalConfigRecord {
  memory?: string;
  processors?: number;
  swap?: string;
  swapFile?: string;
  defaultVhdSize?: string;
  networkingMode?: number;
  firewall?: boolean;
  dnsTunneling?: boolean;
  autoProxy?: boolean;
}

export interface WslDistributionConfigRecord {
  disableWindowsInterop?: boolean;
  disableAppendWindowsPath?: boolean;
  disableAutoMountWindowsDrives?: boolean;
  mountFstab?: boolean;
  generateHosts?: boolean;
  generateResolvConf?: boolean;
}

export interface WslGlobalConfigResult extends WslControlResult {
  rawText?: string;
  config: WslGlobalConfigRecord;
}

export interface WslDistributionConfigResult extends WslControlResult {
  rawText?: string;
  config: WslDistributionConfigRecord;
}

export interface WslActivityEventRecord {
  logName: string;
  providerName?: string;
  eventId: number;
  level?: string;
  timeCreated?: {
    seconds?: number;
    nanos?: number;
  };
  machineName?: string;
  message?: string;
}

export interface WslActivityLogResult extends WslControlResult {
  events: WslActivityEventRecord[];
  discoveredLogs: string[];
}

export interface MdeHealthcheckInfoRecord {
  available: boolean;
  exitCode: number;
  stdOut: string;
  stdErr: string;
}

export interface WslComplianceReportRecord {
  wslCommandAvailable: boolean;
  statusText: string;
  distributions: WslDistributionRecord[];
  actualGlobalConfig: WslGlobalConfigRecord;
  actualDistributionConfig: WslDistributionConfigRecord;
  actualGlobalConfigRaw?: string;
  actualDistributionConfigRaw?: string;
  globalConfigMatchesExpected: boolean;
  distributionConfigMatchesExpected: boolean;
  mdeHealthcheck?: MdeHealthcheckInfoRecord;
  issues: string[];
}

export interface WslComplianceReportResult extends WslControlResult {
  report: WslComplianceReportRecord;
}

const wslControlServiceClient = new OperatorWslControlServiceClient(
  getGrpcUrl(),
  null,
  {},
);

function setStringWrapper(
  setter: ((value: wrappers_pb.StringValue) => unknown) | undefined,
  value: string | null | undefined,
): void {
  if (!setter || value == null || value === "") return;
  const wrapper = new wrappers_pb.StringValue();
  wrapper.setValue(value);
  setter(wrapper);
}

function setBoolWrapper(
  setter: ((value: wrappers_pb.BoolValue) => unknown) | undefined,
  value: boolean | null | undefined,
): void {
  if (!setter || value == null) return;
  const wrapper = new wrappers_pb.BoolValue();
  wrapper.setValue(value);
  setter(wrapper);
}

function setUInt32Wrapper(
  setter: ((value: unknown) => unknown) | undefined,
  value: number | null | undefined,
  fieldName: string,
): void {
  if (!setter || value == null) return;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative number`);
  }
  const UInt32ValueCtor = (wrappers_pb as unknown as { UInt32Value: new () => {
    setValue(value: number): void;
  } }).UInt32Value;
  const wrapper = new UInt32ValueCtor();
  wrapper.setValue(Math.trunc(parsed));
  setter(wrapper);
}

function createTargetRequest(target: Target): TargetRequestLike {
  const request = new TargetRequest();
  request.setTarget(target);
  return request;
}

function createDistributionIdentifier(
  input: WslDistributionIdentifier,
): DistributionIdentifierLike {
  const request = new DistributionIdentifier();
  request.setTarget(input.target);
  request.setDistributionName(input.distributionName);
  return request;
}

function normalizeErrorMessage(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function normalizeControlResult(raw: Record<string, unknown>): WslControlResult {
  return {
    status:
      (raw.status as number) ??
      OperatorWslControlResponseStatus.OPERATOR_WSL_CONTROL_RESPONSE_STATUS_OK,
    errorMessage: normalizeErrorMessage(raw.errorMessage ?? raw.error_message),
  };
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function normalizeTimestamp(
  raw: Record<string, unknown> | undefined,
): { seconds?: number; nanos?: number } | undefined {
  if (!raw) return undefined;
  return {
    seconds: toOptionalNumber(raw.seconds),
    nanos: toOptionalNumber(raw.nanos),
  };
}

function normalizeGlobalConfig(
  raw: Record<string, unknown> | undefined,
): WslGlobalConfigRecord {
  if (!raw) return {};
  return {
    memory:
      (raw.memory as string | undefined) ??
      (raw.memory?.["valueOf"]?.() as string | undefined),
    processors: toOptionalNumber(raw.processors),
    swap: raw.swap as string | undefined,
    swapFile: (raw.swapFile ?? raw.swap_file) as string | undefined,
    defaultVhdSize:
      (raw.defaultVhdSize ?? raw.default_vhd_size) as string | undefined,
    networkingMode: toOptionalNumber(
      raw.networkingMode ?? raw.networking_mode,
    ),
    firewall: typeof raw.firewall === "boolean" ? raw.firewall : undefined,
    dnsTunneling:
      typeof (raw.dnsTunneling ?? raw.dns_tunneling) === "boolean"
        ? Boolean(raw.dnsTunneling ?? raw.dns_tunneling)
        : undefined,
    autoProxy:
      typeof (raw.autoProxy ?? raw.auto_proxy) === "boolean"
        ? Boolean(raw.autoProxy ?? raw.auto_proxy)
        : undefined,
  };
}

function normalizeDistributionConfig(
  raw: Record<string, unknown> | undefined,
): WslDistributionConfigRecord {
  if (!raw) return {};
  return {
    disableWindowsInterop:
      typeof (raw.disableWindowsInterop ?? raw.disable_windows_interop) ===
      "boolean"
        ? Boolean(raw.disableWindowsInterop ?? raw.disable_windows_interop)
        : undefined,
    disableAppendWindowsPath:
      typeof (
        raw.disableAppendWindowsPath ?? raw.disable_append_windows_path
      ) === "boolean"
        ? Boolean(
            raw.disableAppendWindowsPath ?? raw.disable_append_windows_path,
          )
        : undefined,
    disableAutoMountWindowsDrives:
      typeof (
        raw.disableAutoMountWindowsDrives ??
        raw.disable_auto_mount_windows_drives
      ) === "boolean"
        ? Boolean(
            raw.disableAutoMountWindowsDrives ??
              raw.disable_auto_mount_windows_drives,
          )
        : undefined,
    mountFstab:
      typeof (raw.mountFstab ?? raw.mount_fstab) === "boolean"
        ? Boolean(raw.mountFstab ?? raw.mount_fstab)
        : undefined,
    generateHosts:
      typeof (raw.generateHosts ?? raw.generate_hosts) === "boolean"
        ? Boolean(raw.generateHosts ?? raw.generate_hosts)
        : undefined,
    generateResolvConf:
      typeof (raw.generateResolvConf ?? raw.generate_resolv_conf) === "boolean"
        ? Boolean(raw.generateResolvConf ?? raw.generate_resolv_conf)
        : undefined,
  };
}

function applyGlobalConfig(
  config: WslGlobalConfigInput | undefined,
  setter: (value: WslGlobalConfigMessageLike) => void,
): void {
  if (!config) return;
  const message = new WslGlobalConfig();

  setStringWrapper(message.setMemory?.bind(message), config.memory);
  setUInt32Wrapper(
    message.setProcessors?.bind(message),
    config.processors,
    "processors",
  );
  setStringWrapper(message.setSwap?.bind(message), config.swap);
  setStringWrapper(message.setSwapFile?.bind(message), config.swapFile);
  setStringWrapper(
    message.setDefaultVhdSize?.bind(message),
    config.defaultVhdSize,
  );
  if (config.networkingMode != null) {
    message.setNetworkingMode?.(config.networkingMode);
  }
  setBoolWrapper(message.setFirewall?.bind(message), config.firewall);
  setBoolWrapper(
    message.setDnsTunneling?.bind(message),
    config.dnsTunneling,
  );
  setBoolWrapper(message.setAutoProxy?.bind(message), config.autoProxy);

  setter(message);
}

function applyDistributionConfig(
  config: WslDistributionConfigInput | undefined,
  setter: (value: WslDistributionConfigMessageLike) => void,
): void {
  if (!config) return;
  const message = new WslDistributionConfig();

  setBoolWrapper(
    message.setDisableWindowsInterop?.bind(message),
    config.disableWindowsInterop,
  );
  setBoolWrapper(
    message.setDisableAppendWindowsPath?.bind(message),
    config.disableAppendWindowsPath,
  );
  setBoolWrapper(
    message.setDisableAutoMountWindowsDrives?.bind(message),
    config.disableAutoMountWindowsDrives,
  );
  setBoolWrapper(message.setMountFstab?.bind(message), config.mountFstab);
  setBoolWrapper(message.setGenerateHosts?.bind(message), config.generateHosts);
  setBoolWrapper(
    message.setGenerateResolvConf?.bind(message),
    config.generateResolvConf,
  );

  setter(message);
}

export const wslLifecycleClient = {
  OperatorWslControlResponseStatus,
  WslDistributionVersion,
  WslNetworkingMode,

  async importDistribution(
    input: ImportDistributionInput,
  ): Promise<WslControlResult> {
    const request = new ImportDistributionRequest();
    request.setTarget(input.target);
    request.setDistributionName(input.distributionName);
    request.setInstallLocation(input.installLocation);
    request.setPackagePath(input.packagePath);
    request.setVersion(
      input.version ??
        WslDistributionVersion.WSL_DISTRIBUTION_VERSION_UNSPECIFIED,
    );

    const response = await wslControlServiceClient.importDistribution(
      request,
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async unregisterDistribution(
    input: WslDistributionIdentifier,
  ): Promise<WslControlResult> {
    const response = await wslControlServiceClient.unregisterDistribution(
      createDistributionIdentifier(input),
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async terminateDistribution(
    input: WslDistributionIdentifier,
  ): Promise<WslControlResult> {
    const response = await wslControlServiceClient.terminateDistribution(
      createDistributionIdentifier(input),
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async shutdownWsl(target: Target): Promise<WslControlResult> {
    const response = await wslControlServiceClient.shutdownWsl(
      createTargetRequest(target),
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async updateWslEngine(target: Target): Promise<WslControlResult> {
    const response = await wslControlServiceClient.updateWslEngine(
      createTargetRequest(target),
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async updateDistributionPackages(
    input: WslDistributionIdentifier,
  ): Promise<WslControlResult> {
    const response = await wslControlServiceClient.updateDistributionPackages(
      createDistributionIdentifier(input),
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async applyGlobalConfig(
    input: ApplyGlobalConfigInput,
  ): Promise<WslControlResult> {
    const request = new ApplyGlobalConfigRequest();
    request.setTarget(input.target);
    applyGlobalConfig(input.config, request.setConfig.bind(request));

    const response = await wslControlServiceClient.applyGlobalConfig(
      request,
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async applyDistributionConfig(
    input: ApplyDistributionConfigInput,
  ): Promise<WslControlResult> {
    const request = new ApplyDistributionConfigRequest();
    request.setTarget(input.target);
    request.setDistributionName(input.distributionName);
    applyDistributionConfig(input.config, request.setConfig.bind(request));

    const response = await wslControlServiceClient.applyDistributionConfig(
      request,
      createGrpcMetadata(),
    );
    return normalizeControlResult(
      response.toObject() as unknown as Record<string, unknown>,
    );
  },

  async getWslStatus(target: Target): Promise<WslStatusResult> {
    const response = await wslControlServiceClient.getWslStatus(
      createTargetRequest(target),
      createGrpcMetadata(),
    );
    const raw = response.toObject() as unknown as Record<string, unknown>;
    const info = (raw.info as Record<string, unknown> | undefined) ?? {};

    return {
      ...normalizeControlResult(raw),
      rawText: (info.rawText ?? info.raw_text) as string | undefined,
    };
  },

  async getDistributions(target: Target): Promise<WslDistributionRecord[]> {
    const response = await wslControlServiceClient.getDistributions(
      createTargetRequest(target),
      createGrpcMetadata(),
    );
    const raw = response.toObject() as unknown as {
      distributionsList?: Array<Record<string, unknown>>;
      distributions?: Array<Record<string, unknown>>;
    };
    const items = raw.distributionsList ?? raw.distributions ?? [];

    return items.map((item) => ({
      distributionName:
        (item.distributionName ?? item.distribution_name) as string,
      state: (item.state as string) ?? "",
      version: toOptionalNumber(item.version) ?? 0,
      isDefault: Boolean(item.isDefault ?? item.is_default),
    }));
  },

  async getGlobalConfig(target: Target): Promise<WslGlobalConfigResult> {
    const response = await wslControlServiceClient.getGlobalConfig(
      createTargetRequest(target),
      createGrpcMetadata(),
    );
    const raw =
      response.toObject() as unknown as Record<string, unknown>;

    return {
      ...normalizeControlResult(raw),
      rawText: normalizeErrorMessage(raw.rawText),
      config: normalizeGlobalConfig(
        raw.config as Record<string, unknown> | undefined,
      ),
    };
  },

  async getDistributionConfig(
    input: WslDistributionIdentifier,
  ): Promise<WslDistributionConfigResult> {
    const response = await wslControlServiceClient.getDistributionConfig(
      createDistributionIdentifier(input),
      createGrpcMetadata(),
    );
    const raw = response.toObject() as unknown as Record<string, unknown>;

    return {
      ...normalizeControlResult(raw),
      rawText: normalizeErrorMessage(raw.rawText ?? raw.raw_text),
      config: normalizeDistributionConfig(
        raw.config as Record<string, unknown> | undefined,
      ),
    };
  },

  async getActivityLog(
    input: GetWslActivityLogInput,
  ): Promise<WslActivityLogResult> {
    const request = new GetWslActivityRequest();
    request.setTarget(input.target);
    if (input.maxEvents != null) {
      const parsed = Number(input.maxEvents);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error("maxEvents must be a non-negative number");
      }
      request.setMaxEvents(Math.trunc(parsed));
    }
    setStringWrapper(
      request.setLogNameFilter?.bind(request),
      input.logNameFilter,
    );

    const response = await wslControlServiceClient.getActivityLog(
      request,
      createGrpcMetadata(),
    );
    const raw = response.toObject() as unknown as {
      status?: number;
      eventsList?: Array<Record<string, unknown>>;
      events?: Array<Record<string, unknown>>;
      discoveredLogsList?: string[];
      discoveredLogs?: string[];
      errorMessage?: string;
      error_message?: string;
    };
    const events = raw.eventsList ?? raw.events ?? [];

    return {
      ...normalizeControlResult(raw),
      discoveredLogs: raw.discoveredLogsList ?? raw.discoveredLogs ?? [],
      events: events.map((event) => ({
        logName: (event.logName ?? event.log_name) as string,
        providerName: normalizeErrorMessage(
          event.providerName ?? event.provider_name,
        ),
        eventId: toOptionalNumber(event.eventId ?? event.event_id) ?? 0,
        level: normalizeErrorMessage(event.level),
        timeCreated: normalizeTimestamp(
          (event.timeCreated ?? event.time_created) as
            | Record<string, unknown>
            | undefined,
        ),
        machineName: normalizeErrorMessage(
          event.machineName ?? event.machine_name,
        ),
        message: normalizeErrorMessage(event.message),
      })),
    };
  },

  async getComplianceReport(
    input: GetWslComplianceReportInput,
  ): Promise<WslComplianceReportResult> {
    const request = new GetWslComplianceRequest();
    request.setTarget(input.target);
    setStringWrapper(
      request.setDistributionName?.bind(request),
      input.distributionName,
    );
    applyGlobalConfig(
      input.expectedGlobalConfig,
      request.setExpectedGlobalConfig.bind(request),
    );
    applyDistributionConfig(
      input.expectedDistributionConfig,
      request.setExpectedDistributionConfig.bind(request),
    );

    const response = await wslControlServiceClient.getComplianceReport(
      request,
      createGrpcMetadata(),
    );
    const raw = response.toObject() as unknown as Record<string, unknown>;
    const report = (raw.report as Record<string, unknown> | undefined) ?? {};
    const distributions =
      (report.distributionsList ?? report.distributions) as
        | Array<Record<string, unknown>>
        | undefined;
    const mdeHealthcheck = (report.mdeHealthcheck ??
      report.mde_healthcheck) as Record<string, unknown> | undefined;

    return {
      ...normalizeControlResult(raw),
      report: {
        wslCommandAvailable: Boolean(
          report.wslCommandAvailable ?? report.wsl_command_available,
        ),
        statusText: (report.statusText ?? report.status_text) as string,
        distributions: (distributions ?? []).map((item) => ({
          distributionName:
            (item.distributionName ?? item.distribution_name) as string,
          state: (item.state as string) ?? "",
          version: toOptionalNumber(item.version) ?? 0,
          isDefault: Boolean(item.isDefault ?? item.is_default),
        })),
        actualGlobalConfig: normalizeGlobalConfig(
          (report.actualGlobalConfig ?? report.actual_global_config) as
            | Record<string, unknown>
            | undefined,
        ),
        actualDistributionConfig: normalizeDistributionConfig(
          (report.actualDistributionConfig ??
            report.actual_distribution_config) as
            | Record<string, unknown>
            | undefined,
        ),
        actualGlobalConfigRaw: normalizeErrorMessage(
          report.actualGlobalConfigRaw ?? report.actual_global_config_raw,
        ),
        actualDistributionConfigRaw: normalizeErrorMessage(
          report.actualDistributionConfigRaw ??
            report.actual_distribution_config_raw,
        ),
        globalConfigMatchesExpected: Boolean(
          report.globalConfigMatchesExpected ??
            report.global_config_matches_expected,
        ),
        distributionConfigMatchesExpected: Boolean(
          report.distributionConfigMatchesExpected ??
            report.distribution_config_matches_expected,
        ),
        mdeHealthcheck: mdeHealthcheck
          ? {
              available: Boolean(mdeHealthcheck.available),
              exitCode: toOptionalNumber(mdeHealthcheck.exitCode) ?? 0,
              stdOut: (mdeHealthcheck.stdOut ?? mdeHealthcheck.std_out) as string,
              stdErr: (mdeHealthcheck.stdErr ?? mdeHealthcheck.std_err) as string,
            }
          : undefined,
        issues: (report.issuesList ?? report.issues ?? []) as string[],
      },
    };
  },
};

export const WslLifecycleResponseStatus = OperatorWslControlResponseStatus;
export const WslLifecycleDistributionVersion = WslDistributionVersion;
export const WslLifecycleNetworkingMode = WslNetworkingMode;
