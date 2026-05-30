import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

type TranslateFn = (key: string) => string;

const textOriginals = new WeakMap<Text, string>();
const ATTRIBUTES = ["placeholder", "title", "aria-label"] as const;
const SEGMENT_KEYS = [
  "Pending installer",
  "Last seen",
  "Version:",
  "Latest:",
  "Requests",
  "Installed",
  "Failed",
  "Retirement:",
  "Target:",
  "Agent:",
  "Site:",
  "S/N:",
  "Enrolled",
  "available",
  "managed",
  "enrolled",
  "Enforced",
  "Advisory",
];

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateText(original: string, t: TranslateFn) {
  const trimmed = original.trim();
  if (!trimmed || !/[A-Za-z]/.test(trimmed)) return original;

  const exact = t(trimmed);
  if (exact !== trimmed) return preserveWhitespace(original, exact);

  let translated = trimmed;
  for (const key of SEGMENT_KEYS) {
    const replacement = t(key);
    if (replacement === key) continue;
    translated = translated.replace(
      new RegExp(escapeRegExp(key), "g"),
      replacement,
    );
  }
  return translated === trimmed
    ? original
    : preserveWhitespace(original, translated);
}

function localizeAttributes(
  root: ParentNode,
  t: TranslateFn,
  restore: boolean,
) {
  if (!(root instanceof Element)) return;
  const elements = [root, ...Array.from(root.querySelectorAll("*"))];
  for (const element of elements) {
    for (const attr of ATTRIBUTES) {
      const current = element.getAttribute(attr);
      if (!current) continue;
      const originalKey =
        attr === "aria-label"
          ? "i18nOriginalAriaLabel"
          : attr === "placeholder"
            ? "i18nOriginalPlaceholder"
            : "i18nOriginalTitle";
      const dataset = (element as HTMLElement).dataset;
      const original = dataset[originalKey] || current;
      dataset[originalKey] = original;
      element.setAttribute(
        attr,
        restore ? original : translateText(original, t),
      );
    }
  }
}

function localizeTextNodes(root: ParentNode, t: TranslateFn, restore: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  let node = walker.nextNode() as Text | null;
  while (node) {
    const original = textOriginals.get(node) || node.nodeValue || "";
    textOriginals.set(node, original);
    node.nodeValue = restore ? original : translateText(original, t);
    node = walker.nextNode() as Text | null;
  }
}

export function useDomI18n() {
  const { locale, t } = useI18n();
  let observer: MutationObserver | null = null;
  let scheduled = false;

  const apply = () => {
    if (scheduled) return;
    scheduled = true;
    void nextTick(() => {
      scheduled = false;
      const root = document.body;
      const restore = String(locale.value).startsWith("en");
      localizeTextNodes(root, t, restore);
      localizeAttributes(root, t, restore);
    });
  };

  onMounted(() => {
    observer = new MutationObserver(apply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES],
    });
    apply();
  });

  watch(locale, apply);

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
}
