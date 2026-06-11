export type PolicyAgentStatus = "online" | "overdue" | "offline" | "unknown";

export const POLICY_AGENT_ONLINE_WINDOW_SECONDS = 10 * 60;
export const POLICY_AGENT_OVERDUE_WINDOW_SECONDS = 60 * 60;

export function parseUnixSeconds(
  value: number | string | null | undefined,
): number | null {
  if (value === undefined || value === null || value === "") return null;
  const timestamp =
    typeof value === "string" ? Number.parseInt(value, 10) : Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;
  return timestamp;
}

export function unixSecondsToIso(
  value: number | string | null | undefined,
): string | null {
  const timestamp = parseUnixSeconds(value);
  if (timestamp === null) return null;
  return new Date(timestamp * 1000).toISOString();
}

export function getHeartbeatAgeSeconds(
  value: number | string | null | undefined,
  nowMs = Date.now(),
): number | null {
  const timestamp = parseUnixSeconds(value);
  if (timestamp === null) return null;
  return Math.max(0, Math.floor(nowMs / 1000 - timestamp));
}

export function derivePolicyAgentStatus(
  isOnline: boolean | null | undefined,
  lastHeartbeatUnix: number | string | null | undefined,
  nowMs = Date.now(),
): PolicyAgentStatus {
  if (isOnline === true) return "online";

  const heartbeatAgeSeconds = getHeartbeatAgeSeconds(
    lastHeartbeatUnix,
    nowMs,
  );
  if (heartbeatAgeSeconds === null) {
    return isOnline === false ? "offline" : "unknown";
  }

  if (heartbeatAgeSeconds <= POLICY_AGENT_ONLINE_WINDOW_SECONDS) {
    return "online";
  }
  if (heartbeatAgeSeconds <= POLICY_AGENT_OVERDUE_WINDOW_SECONDS) {
    return "overdue";
  }
  return "offline";
}

export function formatHeartbeatAge(seconds: number | null): string {
  if (seconds === null) return "No heartbeat";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
