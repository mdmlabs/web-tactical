export interface GPOPolicy {
  id: string;
  name: string;
  displayName: string;
  path: string;
  enabled: boolean;
  description?: string;
  hash?: string;
  scope?: number;
  policyStatus?: number;
  version?: number;
  modified?: string;
  created?: string;
}

export interface GPOPolicyTree {
  id: string;
  name: string;
  path: string;
  children?: GPOPolicyTree[];
  policies?: GPOPolicy[];
}

export interface GPOPolicySetting {
  id: string;
  name: string;
  path: string;
  value: unknown;
  type: string;
  description?: string;
}

export interface GPOPolicyDetails extends GPOPolicy {
  settings: GPOPolicySetting[];
  appliedTo?: string[];
  links?: GPOLink[];
}

export interface GPOLink {
  id: string;
  target: string;
  enabled: boolean;
  enforced: boolean;
  order: number;
}

export interface CreateGPOPolicyRequest {
  name: string;
  displayName?: string;
  description?: string;
  path?: string;
}

export interface UpdateGPOPolicyRequest {
  hash: string;
  name?: string;
  displayName?: string;

  description?: string;
  explainText?: string;
  scope?: number;
  registryKey?: string;
  valueName?: string;
  enabledValue?: string;
  disabledValue?: string;
  supportedOnRef?: string;
  parentCategoryRef?: string;
  presentationRef?: string;
  clientExtension?: string;
  policyStatus?: number;
}

export interface ApplyPolicyRequest {
  policyId: string;
  target: string;
  enabled: boolean;
  enforced?: boolean;
  order?: number;
}

export interface GPOServiceConfig {
  url: string;
  timeout?: number;
}
