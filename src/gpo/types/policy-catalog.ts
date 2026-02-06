export interface PolicyDetailsElementItem {
  id: number;
  name: string;
  displayName: string;
  valueType?: string;
}

export interface PolicyDetailsElement {
  id: number;
  elementId: string;
  type: string;
  valueName?: string;
  valueType?: string;
  registryKey?: string;
  required?: boolean;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  displayName?: string;
  description?: string;
  presentationType?: string;
  items?: PolicyDetailsElementItem[];
}

export interface CategoryNode {
  id: string;
  label: string;
  icon?: string;
  categoryName: string;
  children?: CategoryNode[];
}

export interface PolicyItem {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  scope: number;
}
