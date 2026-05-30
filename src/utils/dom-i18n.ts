import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

type TranslateFn = (key: string) => string;
type RootResolver = ParentNode | string | (() => ParentNode | null);

interface DomI18nOptions {
  root?: RootResolver;
  skipSelector?: string;
  debounceMs?: number;
}

const textOriginals = new WeakMap<Text, string>();
const ATTRIBUTES = ["placeholder", "title", "aria-label"] as const;
const DEFAULT_SKIP_SELECTOR = [
  "script",
  "style",
  "pre",
  "code",
  ".language-switcher",
  "[data-no-dom-i18n]",
  "tbody",
].join(",");
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
  skipSelector: string,
) {
  if (!(root instanceof Element)) return;
  const elements = [root, ...Array.from(root.querySelectorAll("*"))];
  for (const element of elements) {
    if (element.matches(skipSelector) || element.closest(skipSelector)) {
      continue;
    }
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
      const next = restore ? original : translateText(original, t);
      if (next !== current) element.setAttribute(attr, next);
    }
  }
}

function localizeTextNodes(
  root: ParentNode,
  t: TranslateFn,
  restore: boolean,
  skipSelector: string,
) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest(skipSelector)) {
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
    const next = restore ? original : translateText(original, t);
    if (next !== node.nodeValue) node.nodeValue = next;
    node = walker.nextNode() as Text | null;
  }
}

function resolveRoot(root?: RootResolver): ParentNode | null {
  if (!root) return document.body;
  if (typeof root === "string") return document.querySelector(root);
  if (typeof root === "function") return root();
  return root;
}

export function useDomI18n(options: DomI18nOptions = {}) {
  const { locale, t } = useI18n();
  let observer: MutationObserver | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let scheduled = false;
  const debounceMs = options.debounceMs ?? 80;
  const skipSelector = [DEFAULT_SKIP_SELECTOR, options.skipSelector]
    .filter(Boolean)
    .join(",");

  const apply = () => {
    if (scheduled) return;
    scheduled = true;
    void nextTick(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        scheduled = false;
        const root = resolveRoot(options.root);
        if (!root) return;
        const restore = String(locale.value).startsWith("en");
        localizeTextNodes(root, t, restore, skipSelector);
        localizeAttributes(root, t, restore, skipSelector);
      }, debounceMs);
    });
  };

  onMounted(() => {
    const root = resolveRoot(options.root);
    if (!root) return;
    observer = new MutationObserver(apply);
    observer.observe(root, {
      childList: true,
      subtree: true,
    });
    apply();
  });

  watch(locale, apply);

  onBeforeUnmount(() => {
    if (timeout) clearTimeout(timeout);
    observer?.disconnect();
    observer = null;
  });
}
