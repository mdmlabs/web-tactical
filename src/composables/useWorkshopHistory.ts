import { computed } from "vue";
import { useStorage } from "@vueuse/core";

import type { WazuhArtifactType } from "@/types/wazuhOps";

/**
 * Frontend-only history of Workshop saves.
 *
 * The full design (see TASK_WAZUH_OPS.md §5.5) calls for a TRMM-side
 * `wazuh_artifact_versions` table so snapshots survive across browsers
 * and operators. Until that backend lands, we store snapshots in
 * localStorage so a single operator can still diff and revert their
 * own work within a session.
 */

export interface WorkshopSnapshot {
  id: string;
  artifact_type: WazuhArtifactType;
  path: string;
  group_id?: string | null;
  content: string;
  created_at: string;
  comment?: string;
}

const STORAGE_KEY = "workshop.history.v1";
const MAX_SNAPSHOTS = 200;

const snapshots = useStorage<WorkshopSnapshot[]>(STORAGE_KEY, []);

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useWorkshopHistory() {
  function recordSnapshot(input: Omit<WorkshopSnapshot, "id" | "created_at">) {
    const snapshot: WorkshopSnapshot = {
      ...input,
      id: makeId(),
      created_at: new Date().toISOString(),
    };
    snapshots.value = [snapshot, ...snapshots.value].slice(0, MAX_SNAPSHOTS);
    return snapshot;
  }

  function getSnapshot(id: string): WorkshopSnapshot | undefined {
    return snapshots.value.find((s) => s.id === id);
  }

  function deleteSnapshot(id: string) {
    snapshots.value = snapshots.value.filter((s) => s.id !== id);
  }

  function clearAll() {
    snapshots.value = [];
  }

  const all = computed(() => snapshots.value);

  return {
    snapshots: all,
    recordSnapshot,
    getSnapshot,
    deleteSnapshot,
    clearAll,
  };
}
