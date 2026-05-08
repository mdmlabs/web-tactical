// Aggregate of all available locales. Each locale is a flat object keyed by
// dot-notation identifiers (e.g. "common.save"). Missing keys fall back to English.

import en from "./en";
import vi from "./vi";

export type LocaleCode = "en" | "vi";

export const SUPPORTED_LOCALES: Array<{
  code: LocaleCode;
  nativeName: string;
  englishName: string;
  quasarPack: string;
}> = [
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    quasarPack: "en-US",
  },
  {
    code: "vi",
    nativeName: "Tiếng Việt",
    englishName: "Vietnamese",
    quasarPack: "vi",
  },
];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const FALLBACK_LOCALE: LocaleCode = "en";

export default {
  en,
  vi,
};
