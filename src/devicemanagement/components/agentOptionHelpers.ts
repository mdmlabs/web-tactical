/**
 * Shared helpers to produce rich AgentPicker options from a raw agent list.
 * Used by DeviceManagementView, EncryptedContainersPanel, SecureFileTransferPanel.
 */

export interface AgentOptionRich {
  label: string;          // searchable display string (hostname + shortId)
  value: string;          // full agent_id
  hostname?: string;      // hostname as reported by the agent
  shortId?: string;       // compact agent_id: first 5 + '…' + last 3
  subline?: string;       // "last_user · last_seen" caption
  online?: boolean;       // green/grey dot in option row
}

/** "PZVpuZWa...RNHcohhx" -> "PZVpu…hhx" */
export function shortenAgentId(agentId?: string | null): string {
  if (!agentId) return "";
  const id = String(agentId);
  if (id.length <= 10) return id;
  return `${id.slice(0, 5)}…${id.slice(-3)}`;
}

function humanAge(iso?: string | null): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const deltaSec = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (deltaSec < 60) return `${deltaSec}s ago`;
  const m = Math.floor(deltaSec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/**
 * Build a rich option list from raw agent objects. The resulting items work
 * with a vanilla <q-select :options emit-value map-options> AND with the
 * <AgentPicker> component — they include extra fields that the custom slots
 * consume but q-select gracefully ignores.
 */
export function buildAgentOptions(agents: any[] | null | undefined): AgentOptionRich[] {
  if (!Array.isArray(agents)) return [];
  return agents.map((a) => {
    const agentId = String(a?.agent_id || "");
    const hostname = String(a?.hostname || agentId || "").trim();
    const shortId = shortenAgentId(agentId);
    const lastUser = String(a?.last_logged_in_user || a?.logged_in_username || "").trim();
    const lastSeen = humanAge(a?.last_seen);
    const sublineParts = [lastUser, lastSeen].filter(Boolean);
    const online = typeof a?.status === "string" ? a.status === "online" : undefined;
    // Keep `label` searchable — input filter matches against it by default.
    const label = shortId ? `${hostname} · ${shortId}` : hostname;
    return {
      label,
      value: agentId,
      hostname,
      shortId,
      subline: sublineParts.join(" · "),
      online,
    };
  });
}
