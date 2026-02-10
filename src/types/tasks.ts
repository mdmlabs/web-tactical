import { type CustomField } from "@/types/core/customfields";
import { type AlertSeverity } from "@/types/alerts";

export interface TaskResult {
  task: number;
  agent?: number;
  retcode: number;
  stdout: string;
  stderr: string;
  execution_time: number;
  last_run: string;
  status: string;
  sync_status: string;
}

export type AutomatedTaskCommandActionShellType = "powershell" | "cmd" | "bash";

export interface AutomatedTaskScriptAction {
  type: "script";
  name: string;
  script: number;
  timeout: number;
  script_args?: string[];
  env_vars?: string[];
}

export interface AutomatedTaskCommandAction {
  type: "cmd";
  command: string;
  timeout: number;
  shell: AutomatedTaskCommandActionShellType;
}

export type AutomatedTaskAction =
  | AutomatedTaskCommandAction
  | AutomatedTaskScriptAction;

export type AgentTaskType =
  | "daily"
  | "weekly"
  | "monthly"
  | "runonce"
  | "checkfailure"
  | "onboarding"
  | "manual"
  | "monthlydow";

export type ServerTaskType = "daily" | "weekly" | "monthly" | "runonce";

export interface AutomatedTaskBase {
  id: number;
  custom_field?: CustomField;
  actions: AutomatedTaskAction[];
  assigned_check?: number;
  name: string;
  collector_all_output: boolean;
  continue_on_error: boolean;
  alert_severity: AlertSeverity;
  email_alert?: boolean;
  text_alert?: boolean;
  dashboard_alert?: boolean;
  win_task_name?: string;
  run_time_date: string;
  expire_date?: string;
  daily_interval?: number;
  weekly_interval?: number;
  task_repetition_duration?: string;
  task_repetition_interval?: string;
  stop_task_at_duration_end?: boolean;
  random_task_delay?: string;
  remove_if_not_scheduled?: boolean;
  run_asap_after_missed?: boolean;
  task_instance_policy?: number;
  crontab_schedule?: string;
  task_result?: TaskResult;
}

export interface AutomatedTaskForUIBase extends AutomatedTaskBase {
  run_time_bit_weekdays: number[];
  monthly_days_of_month: number[];
  monthly_months_of_year: number[];
  monthly_weeks_of_month: number[];
}

export interface AutomatedTaskPolicy extends AutomatedTaskForUIBase {
  policy: number;
  task_type: AgentTaskType;
  server_task: false;
}

export interface AutomatedTaskAgent extends AutomatedTaskForUIBase {
  agent: number;
  task_type: AgentTaskType;
  server_task: false;
}

export interface AutomatedTaskServer extends AutomatedTaskForUIBase {
  task_type: ServerTaskType;
  server_task: true;
}

export type AutomatedTask =
  | AutomatedTaskAgent
  | AutomatedTaskPolicy
  | AutomatedTaskServer;

export interface AutomatedTaskForDBBase extends AutomatedTaskBase {
  run_time_bit_weekdays: number;
  monthly_days_of_month: number;
  monthly_months_of_year: number;
  monthly_weeks_of_month: number;
}

export interface AutomatedTaskPolicyForDB extends AutomatedTaskForDBBase {
  policy: number;
  task_type: AgentTaskType;
  server_task: false;
}

export interface AutomatedTaskAgentForDB extends AutomatedTaskForDBBase {
  agent: number;
  task_type: AgentTaskType;
  server_task: false;
}

export interface AutomatedTaskServerForDB extends AutomatedTaskForDBBase {
  task_type: ServerTaskType;
  server_task: true;
}

export type AutomatedTaskForDB =
  | AutomatedTaskAgentForDB
  | AutomatedTaskPolicyForDB
  | AutomatedTaskServerForDB;

export interface TemplateCommandAction {
  enabled: boolean;
  osType: "windows";
  shell: "cmd" | "powershell";
  custom_shell?: string | null;
  cmd: string;
  timeout: number;
  run_as_user: boolean;
}

export interface TemplateScriptAction {
  enabled: boolean;
  script: number;
  args?: string[];
  env_vars?: string[];
  timeout: number;
  run_as_user: boolean;
  save_to_custom_field: boolean;
  custom_field?: number | null;
  collector_all_output: boolean;
  save_to_agent_note: boolean;
}

export interface TemplateSoftwareAction {
  enabled: boolean;
  software: string[];
}

export interface TemplateActions {
  commands?: TemplateCommandAction[];
  scripts?: TemplateScriptAction[];
  software?: TemplateSoftwareAction[];
}

export type TemplateTargetType = "client" | "site" | "agents" | "all";

export interface TemplateCommandActionBackend {
  type: "cmd";
  name: string;
  command: string;
  shell: "cmd" | "powershell";
  custom_shell?: string | null;
  timeout: number;
  run_as_user: boolean;
}

export interface TemplateScriptActionBackend {
  type: "script";
  name: string;
  script: number;
  script_args?: string[];
  env_vars?: string[];
  timeout: number;
  run_as_user: boolean;
  save_to_custom_field: boolean;
  custom_field?: number | null;
  collector_all_output: boolean;
  save_to_agent_note: boolean;
}

export interface TemplateSoftwareActionBackend {
  type: "software";
  name: string;
  func: "install";
  choco_prog_name: string;
}

export type TemplateActionBackend =
  | TemplateCommandActionBackend
  | TemplateScriptActionBackend
  | TemplateSoftwareActionBackend;

export interface TaskTemplate {
  id?: number;
  created_by?: string;
  modified_by?: string;
  name: string;
  description: string;
  actions: TemplateActionBackend[];
  continue_on_error: boolean;
  collector_all_output: boolean;
  enabled: boolean;
  task_supported_platforms: string;
  agents: number[];
  sites: number[];
  clients?: number[];
  target?: TemplateTargetType;
  client?: number | null;
  site?: number | null;
}
