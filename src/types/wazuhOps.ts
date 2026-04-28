// === Logtest (Wazuh ruleset testing) ===

export interface LogtestRuleHit {
  id: number;
  level: number;
  description: string;
  groups?: string[];
  firedtimes?: number;
  mail?: boolean;
}

export interface LogtestDecoderHit {
  name: string;
  parent?: string;
}

export interface LogtestOutput {
  timestamp: string;
  rule?: LogtestRuleHit;
  decoder?: LogtestDecoderHit;
  full_log: string;
  location: string;
  predecoder?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface LogtestResult {
  token: string;
  output: LogtestOutput;
  messages: string[];
  alert?: boolean;
}

// === Use Case Runner manifests ===

export type UseCaseFileTarget = "manager" | "agent" | "agent_group";

export interface UseCaseFile {
  target: UseCaseFileTarget;
  agent_id?: string;
  group_id?: string;
  path: string;
  content_ref: string;
  mode?: string;
  owner?: string;
}

export type UseCaseRestartTarget =
  | "manager"
  | { agent_id: string }
  | { agent_group: string };

export type UseCaseTargetSelector =
  | { type: "agent"; agent_id: string }
  | { type: "agent_group"; group_id: string };

export interface UseCaseDemoAttack {
  trmm_script_id: number;
  target_selector: UseCaseTargetSelector;
  params: Record<string, unknown>;
}

export interface UseCaseVerification {
  rule_id: number;
  wait_timeout_sec: number;
  expected_ar_command?: string;
}

export interface UseCaseManifest {
  id: string;
  name: string;
  description: string;
  mitre: string[];
  files: UseCaseFile[];
  restart: UseCaseRestartTarget[];
  demo_attack?: UseCaseDemoAttack;
  verification?: UseCaseVerification;
}

// === Use Case Runner timeline ===

export type UseCaseRunStepStatus =
  | "pending"
  | "running"
  | "ok"
  | "failed"
  | "skipped";

export interface UseCaseRunStep {
  id: string;
  label: string;
  status: UseCaseRunStepStatus;
  started_at?: string;
  finished_at?: string;
  details?: unknown;
  error?: string;
}

export type UseCaseRunMode = "deploy" | "deploy_and_demo";

export interface UseCaseRunContext {
  manifest: UseCaseManifest;
  mode: UseCaseRunMode;
  steps: UseCaseRunStep[];
  started_at: string;
  finished_at?: string;
  succeeded?: boolean;
}

// === SCA remediation registry ===

export type ScaRemediationType = "trmm_script" | "use_case" | "file_delivery";

export interface ScaRemediation {
  type: ScaRemediationType;
  script_id?: number;
  use_case_id?: string;
  file_template?: string;
  path?: string;
  post_action?: string;
  comment?: string;
}

export type ScaRemediationRegistry = Record<
  string, // policy_id e.g. "cis_centos8_linux"
  Record<string, ScaRemediation> // check id (string form) → remediation
>;

// === Workshop history / versions ===

export type WazuhArtifactType =
  | "manager_file"
  | "group_file"
  | "trmm_script"
  | "sca_policy";

export interface WazuhArtifactVersion {
  id: number;
  artifact_type: WazuhArtifactType;
  path: string;
  group_id?: string | null;
  content: string;
  author_id: number | null;
  author_username?: string;
  created_at: string;
  comment?: string;
}

// === Active Response trigger payload ===

export interface ActiveResponseTriggerPayload {
  command: string;
  arguments?: string[];
  alert?: Record<string, unknown>;
  custom?: boolean;
}
