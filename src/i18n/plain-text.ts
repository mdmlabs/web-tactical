export function createPlainTextTranslations(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
) {
  const translations: Record<string, string> = {};

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    if (typeof sourceValue !== "string" || typeof targetValue !== "string") {
      continue;
    }

    const visibleText = sourceValue.trim();
    if (!visibleText || !/[A-Za-z]/.test(visibleText)) {
      continue;
    }

    translations[visibleText] = targetValue;
  }

  return translations;
}

export function createIdentityTranslationsFromKeys(
  ...sources: Array<Record<string, unknown>>
) {
  const translations: Record<string, string> = {};

  for (const source of sources) {
    for (const key of Object.keys(source)) {
      translations[key] = key;
    }
  }

  return translations;
}
