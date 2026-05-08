import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import { Quasar } from "quasar";
import quasarEnUS from "quasar/lang/en-US";
import quasarVi from "quasar/lang/vi";
import axios from "axios";
import messages, {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  SUPPORTED_LOCALES,
  type LocaleCode,
} from "@/i18n";

const STORAGE_KEY = "mdm.locale";
const QUASAR_LANG_PACKS: Record<string, unknown> = {
  "en-US": quasarEnUS,
  vi: quasarVi,
};

function resolveInitialLocale(): LocaleCode {
  const stored = (
    typeof window !== "undefined"
      ? window.localStorage?.getItem(STORAGE_KEY)
      : null
  ) as LocaleCode | null;
  if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
    return stored;
  }
  const navLang = (
    typeof navigator !== "undefined" ? navigator.language : ""
  ).toLowerCase();
  const match = SUPPORTED_LOCALES.find((l) => navLang.startsWith(l.code));
  return match?.code ?? DEFAULT_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  missingWarn: false,
  fallbackWarn: false,
});

async function loadQuasarLangPack(code: LocaleCode) {
  const pack = SUPPORTED_LOCALES.find((l) => l.code === code)?.quasarPack;
  if (!pack) return;
  const langPack = QUASAR_LANG_PACKS[pack];
  if (langPack) Quasar.lang.set(langPack);
}

export async function setLocale(code: LocaleCode, persistRemote = false) {
  i18n.global.locale.value = code;
  if (typeof window !== "undefined") {
    window.localStorage?.setItem(STORAGE_KEY, code);
  }
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", code);
  }
  await loadQuasarLangPack(code);

  if (persistRemote) {
    // Fire-and-forget: unauthenticated users (login page) just use local state.
    try {
      await axios.patch("/accounts/users/ui/", { preferred_language: code });
    } catch {
      // Silently ignore — PATCH fails if not logged in; local state still applied.
    }
  }
}

export default boot(async ({ app }) => {
  app.use(i18n);
  await setLocale(i18n.global.locale.value as LocaleCode);
});
