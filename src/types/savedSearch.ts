/**
 * Saved Search objects persist a Discover query (DQL + filters + time range +
 * visible columns) under a user-chosen name, mirroring the behaviour of
 * OpenSearch Dashboards' savedObjectsClient.
 *
 * Storage is abstracted behind {@link SavedSearchStorage} so the localStorage
 * implementation can be swapped for a backend REST endpoint or an OpenSearch
 * system index (`.mdm-saved-searches`) without touching callers.
 */

export type SavedSearchTimePreset = "15m" | "1h" | "24h" | "7d" | "30d";

export interface SavedSearchAttributes {
  /** Human-readable title shown in the "Open Search" dropdown. */
  title: string;
  /** Target index pattern, e.g. `ossec-alerts-*`. */
  indexPattern: string;
  /** Raw DQL / query_string expression (e.g. `agent.name: foo AND rule.groups: syscheck`). */
  query: string;
  /** Time window the search was saved with. */
  timeRange: SavedSearchTimePreset;
  /** Columns visible in the Discover table at save time (dotted field paths). */
  columns: string[];
  /** Optional user-provided description. */
  description?: string;
}

export interface SavedSearch {
  id: string;
  attributes: SavedSearchAttributes;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * Options accepted by {@link SavedSearchStorage.find}. Mirrors the subset of
 * OpenSearch Dashboards' savedObjectsClient.find() that the UI actually uses.
 */
export interface SavedSearchFindOptions {
  /** Substring matched against `attributes.title` (case-insensitive). */
  search?: string;
  /** Sort field — currently only `updatedAt` and `title` are supported. */
  sortField?: "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface SavedSearchStorage {
  find(options?: SavedSearchFindOptions): Promise<SavedSearch[]>;
  get(id: string): Promise<SavedSearch | null>;
  create(attributes: SavedSearchAttributes): Promise<SavedSearch>;
  update(id: string, attributes: Partial<SavedSearchAttributes>): Promise<SavedSearch>;
  delete(id: string): Promise<void>;
}
