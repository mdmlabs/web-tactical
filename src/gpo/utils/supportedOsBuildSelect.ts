import { policyCatalogClient } from "@/gpo/api/grpc-client";
import { buildHumanOperatingSystemDisplay } from "./supportedOsHumanLabel";

export function formatOsBuildLabel(entry: Record<string, unknown>): string {
  const os =
    typeof entry.os === "string" && entry.os.trim() ? entry.os.trim() : "";
  const verRaw = entry.osVersion ?? entry.os_version;
  if (!verRaw || typeof verRaw !== "object") {
    return os || "Unknown";
  }
  const v = verRaw as Record<string, unknown>;
  const parts = [v.major, v.minor, v.build].filter(
    (n): n is number => typeof n === "number" && Number.isFinite(n),
  );
  if (parts.length === 0) return os || "Unknown";
  const verStr = parts.join(".");
  if (os) return `${os} (${verStr})`;
  return verStr;
}


export async function fetchSupportedOsSelectOptions(): Promise<
  Array<{ label: string; value: string }>
> {
  const response = await policyCatalogClient.getAllSupportedOs();
  const raw = response as {
    osBuildsList?: unknown[];
    os_builds?: unknown[];
  };
  const list = raw.osBuildsList ?? raw.os_builds ?? [];
  const opts: Array<{ label: string; value: string }> = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const e = item as Record<string, unknown>;
    const value =
      typeof e.os === "string" && e.os.trim() ? e.os.trim() : "";
    if (!value) continue;
    const protoLabel = formatOsBuildLabel(e);
    const label = buildHumanOperatingSystemDisplay(value, protoLabel);
    opts.push({ label, value });
  }

  opts.sort((a, b) => a.label.localeCompare(b.label));
  return opts;
}
