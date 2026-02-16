export interface PolicyElementLike {
  type?: string;
  element_id?: string;
  elementId?: string;
  presentation_type?: string;
  presentationType?: string;
  value_type?: string;
  valueType?: string;
  min_value?: number;
  minValue?: number;
  max_value?: number;
  maxValue?: number;
  max_length?: number;
  maxLength?: number;
  required?: boolean;
  items?: unknown[];
}

export function getElementKey(el: PolicyElementLike): string {
  return el.elementId ?? el.element_id ?? "";
}

function normalizedType(el: PolicyElementLike): string {
  const raw = el.presentationType ?? el.presentation_type ?? el.type ?? "";
  return String(raw).toLowerCase().replaceAll("-", "_");
}

export function isCheckboxType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  return ["checkbox", "check_box", "bool", "boolean"].includes(n);
}

export function isTextType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  return (
    ["text", "textbox", "text_box", "string"].includes(n) ||
    [
      "TEXT",
      "STRING",
      "string",
      "text",
      "multiTextbox",
      "multiTextBox",
    ].includes(type)
  );
}

export function isMultitextType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  return (
    ["multitextbox", "multi_textbox", "multitext"].includes(n) ||
    ["multiTextbox", "multiTextBox"].includes(type)
  );
}

export function isNumericType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  const vt = (el.valueType ?? el.value_type ?? "").toString().toLowerCase();
  return (
    ["numeric", "int", "number", "decimaltextbox", "decimal_textbox"].includes(
      n,
    ) ||
    [
      "NUMERIC",
      "INT",
      "int",
      "number",
      "decimalTextbox",
      "decimalTextBox",
    ].includes(type) ||
    ["decimal", "int", "integer"].includes(vt)
  );
}

export function isDecimalNumeric(el: PolicyElementLike): boolean {
  const vt = (el.valueType ?? el.value_type ?? "").toString().toLowerCase();
  const n = normalizedType(el);
  return (
    vt === "decimal" ||
    ["decimaltextbox", "decimal_textbox"].includes(n) ||
    ["decimalTextbox", "decimalTextBox"].includes(el.type ?? "")
  );
}

export function isDropdownListType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  const hasItems = Array.isArray(el.items) && el.items.length > 0;
  return (
    hasItems &&
    (["list", "enum", "dropdownlist", "dropdown_list", "dropdown"].includes(
      n,
    ) ||
      ["LIST", "List", "list", "enum", "dropdownList"].includes(type))
  );
}

export function isListboxEmptyType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  const noItems = !Array.isArray(el.items) || el.items.length === 0;
  return (
    noItems &&
    (["list", "listbox", "list_box"].includes(n) ||
      el.presentation_type === "List") &&
    ["list", "LIST", "List"].includes(type)
  );
}

export function isMultiSelectType(el: PolicyElementLike): boolean {
  const n = normalizedType(el);
  const type = el.type ?? "";
  return (
    ["multibox", "multi_box", "listbox", "list_box", "list"].includes(n) ||
    type === "List" ||
    (type === "LIST" &&
      Array.isArray(el.items) &&
      el.items.length > 0 &&
      ["listbox", "list_box", "list"].includes(normalizedType(el)))
  );
}

export function getDefaultValueForElement(el: PolicyElementLike): unknown {
  if (isCheckboxType(el)) return false;
  if (isTextType(el) || isMultitextType(el)) return "";
  if (isNumericType(el)) return safeNum(el.minValue ?? el.min_value, 0);
  if (
    ["LIST", "list", "List"].includes(el.type ?? "") ||
    normalizedType(el) === "list"
  )
    return [];
  return null;
}

function safeNum(val: unknown, fallback: number): number {
  if (val === null || val === undefined) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}
