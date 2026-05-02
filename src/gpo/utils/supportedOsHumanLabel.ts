export const SUPPORTED_OS_HUMAN_OVERRIDES: Readonly<
  Partial<Record<string, string>>
> = {};

const VERSION_IN_PARENS = /\(([\d.-]+)\)\s*$/;

type ReplacerPair =
  | readonly [RegExp, string]
  | readonly [RegExp, (...args: string[]) => string];

function applyReplacers(s: string, pairs: ReadonlyArray<ReplacerPair>): string {
  return pairs.reduce((acc, [re, rep]) => {
    if (typeof rep === "function") {
      return acc.replace(re, rep);
    }
    return acc.replace(re, rep);
  }, s);
}

export function extractVersionTailFromCatalogLabel(
  catalogLabel: string,
): string | null {
  return VERSION_IN_PARENS.exec(catalogLabel)?.[1] ?? null;
}

export function isWildcardOsBuildTail(tail: string): boolean {
  return /\.-1\b/.test(tail) || tail === "-1";
}

function splitCaseBoundaries(raw: string): string {
  let t = raw;
  const RE_BOUNDARY = /([a-z0-9])([A-Z])/g;
  for (let i = 0; i < 64; i += 1) {
    const next = t.replace(RE_BOUNDARY, "$1 $2").replace(/\s+/g, " ");
    if (next === t) break;
    t = next.trim();
  }
  return t;
}


const GLUED_PREFIX_REPLACERS: ReadonlyArray<ReplacerPair> = [
  [/(\w+)(desktopexperienceorvista)$/gi, "$1 Desktopexperienceorvista"],
  [/(\w+)(desktopexperience)$/gi, "$1 Desktopexperience"],
  [
    /longhornserverdesktopexperienceorvista/gi,
    "Longhorn Server Desktop Experience or Vista",
  ],
  [/(\w)(until)(threshold)$/gi, "$1 Until Threshold"],
  [/\bWin(blue)(\w+)/gi, "Win Blue $2"],
];


const GLUED_SUFFIX_REPLACERS: ReadonlyArray<ReplacerPair> = [
  [
    /\b(orbi?ts)(\d+)\b/gi,
    (_full: string, _g1: string, digits: string) => `ORBIS ${digits}`,
  ],
  [/(\d)(orbit)(s)(\d+)/gi, "$1 ORBIS $4"],
  [
    /\b(bits)(\d+)\b/gi,
    (_full: string, _g1: string, digits: string) => `BITS ${digits}`,
  ],
  [/(\w)(sp)(\d+)/gi, "$1 SP$3"],
  [/(\w)(rs)(\d+)/gi, "$1 RS$3"],
  [/(\w)(ie)(\d+)/gi, "$1 IE$3"],
  [/\bNoarm\b/gi, "no ARM"],
  [/\bNoserver\b/gi, "no Server"],
];

const GLUED_TRAILING_SUFFIXES = [
  "exclusive",
  "education",
  "enterprise",
  "experience",
  "insights",
  "installer",
  "netserver",
  "netonly",
  "update2",
  "only",
] as const;

function splitGluedSuffixTerms(s: string): string {
  let x = s.replace(/\s+/g, " ").trim();

  x = applyReplacers(x, GLUED_PREFIX_REPLACERS);

  const trailing: ReadonlyArray<ReplacerPair> = GLUED_TRAILING_SUFFIXES.map(
    (suf) => [new RegExp(`(\\w+)(${suf})$`, "gi"), "$1 $2"],
  );
  x = applyReplacers(x, trailing);

  x = applyReplacers(x, GLUED_SUFFIX_REPLACERS);

  return x.replace(/\s+/g, " ").trim();
}

function titleCaseOsWords(s: string): string {
  const LOWER_IN_LINE = new Set([
    "and",
    "or",
    "to",
    "through",
    "until",
    "up",
    "of",
    "in",
    "no",
    "via",
  ]);
  const ACRONYMISH =
    /^(rs|sp|vb|ie|xp|ws|ui|arm|net|rtm|orbis|sp\d+|rs\d+|ie\d+|bits\d+|19h\d+|20h\d+|21h\d+)$/i;

  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      if (/^[\d.]+$/.test(w)) return w;
      if (ACRONYMISH.test(w)) return w.toUpperCase();
      const low = w.toLowerCase();
      if (LOWER_IN_LINE.has(low) && w.length <= 8) return low;
      if (/^→$/.test(w)) return w;
      if (w.includes("(") && w.includes(")")) {
        const inner = /^(.*?)(\([^)]*\))(.*)$/.exec(w);
        if (inner) {
          const [, a, b, c] = inner;
          const cap = (t: string) =>
            t
              ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
              : t;
          return `${cap(a)}${b}${cap(c)}`.trim();
        }
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

const UNDERSCORE_REPLACERS: ReadonlyArray<ReplacerPair> = [
  [/_Or_/gi, " / "],
  [/_And_/gi, " and "],
  [/_Through_/gi, " through "],
  [/_UpTo_/gi, " up to "],
  [/_To_/gi, " → "],
  [/_NOARM$/i, " (no ARM)"],
  [/_NOSERVER$/i, " (no Server)"],
  [/_ONLY$/i, " only"],
  [/_SERVER$/i, " Server"],
];

const WINDOWS_REPLACERS: ReadonlyArray<ReplacerPair> = [
  [/\bWindows(\d+)\b/gi, "Windows $1"],
  [/\bWs(\d+)\b/gi, "WS $1"],
  [/\bWin(\d+)\b/gi, "Win $1"],
  [/\bWindows\s+10\s+0\b/gi, "Windows 10"],
  [/\bWindows\s+6\s+3\b/gi, "Windows 8.1"],
  [/\bWindows\s+6\s+2\b/gi, "Windows 8"],
  [/\bWindows\s+6\s+1\b/gi, "Windows 7"],
  [/\bWindows\s+6\s+0\b/gi, "Windows Vista"],
  [/\bWindows\s+5\s+2\b/gi, "Windows Server 2003"],
  [/\bWindows\s+5\s+1\b/gi, "Windows XP"],
  [/\bWindows\s+5\s+0\b/gi, "Windows 2000"],
  [/\bWin2k\b/gi, "Windows 2000"],
  [/\bWin10\b/gi, "Windows 10"],
  [/\bWin8\b/gi, "Windows 8"],
  [/\bWin7\b/gi, "Windows 7"],
  [/\bWinBlue\b/gi, "Windows Blue (8.1)"],
  [/\bVista\b/gi, "Windows Vista"],
  [/\bXPSP(\d+)\b/gi, "XP SP$1"],
  [/\bWindows NET\b/gi, ".NET-era Windows"],
  [/\bBITS\s*(\d+)/gi, "BITS $1"],
  [/\brs(\d+)\b/gi, "RS$1"],
  [/\bWindows\s+Windows\b/gi, "Windows"],
];

export function humanizeSupportedOsCode(code: string): string {
  const key = code.trim();
  const up = key.toUpperCase();
  const ovr = SUPPORTED_OS_HUMAN_OVERRIDES[up];
  if (ovr) return ovr;

  let x = key.replace(/^(?:SUPPORTED_|SUPPORT_)/i, "");
  x = applyReplacers(x, UNDERSCORE_REPLACERS);
  x = x.replace(/_/g, " ");

  x = splitCaseBoundaries(x);
  x = splitGluedSuffixTerms(x);
  x = splitCaseBoundaries(x);

  x = applyReplacers(x, WINDOWS_REPLACERS);

  x = x.replace(/\s+/g, " ").trim();
  return titleCaseOsWords(x) || key;
}

export function buildHumanOperatingSystemDisplay(
  code: string,
  catalogLabel?: string | null,
): string {
  const up = code.trim().toUpperCase();
  const ovr = SUPPORTED_OS_HUMAN_OVERRIDES[up];
  if (ovr) return ovr;

  const base = humanizeSupportedOsCode(code);
  const tail = catalogLabel
    ? extractVersionTailFromCatalogLabel(catalogLabel)
    : null;

  if (!tail) return base;
  if (isWildcardOsBuildTail(tail)) {
    return `${base} (any build in this line)`;
  }
  return `${base} (build ${tail})`;
}
