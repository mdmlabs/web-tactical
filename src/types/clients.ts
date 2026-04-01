export interface Site {
  id: number;
  name: string;
  description?: string;
  master_id?: number | null;
  parent?: number | null;
  ancestors?: string;
  agent_count?: number;
  maintenance_mode?: boolean;
  failing_checks?: { error: number; warning: number };
  server_policy?: number | null;
  workstation_policy?: number | null;
  block_policy_inheritance?: boolean;
  alert_template?: number | null;
  children?: SiteTreeNode[];
}

export interface SiteTreeNode extends Site {
  children?: SiteTreeNode[];
  agents?: unknown[];
}
