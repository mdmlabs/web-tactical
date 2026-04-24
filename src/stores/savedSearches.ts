import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import type {
  SavedSearch,
  SavedSearchAttributes,
  SavedSearchFindOptions,
  SavedSearchStorage,
} from "@/types/savedSearch";

/**
 * Persistence layer for Discover Saved Searches.
 *
 * Two implementations are provided:
 *   - {@link LocalSavedSearchStorage} — browser `localStorage`, per-user,
 *     offline, no privileges required. Always available.
 *   - {@link IndexerSavedSearchStorage} — OpenSearch system index
 *     `mdm-saved-searches` reached through the existing `/api/wazuh-indexer`
 *     nginx proxy. Shared across users and tabs; mirrors the semantics of
 *     OSD's `savedObjectsClient` for our subset of operations.
 *
 * {@link HybridSavedSearchStorage} composes both: it prefers the indexer and
 * degrades to local on any network / permission error, so the UI works even
 * when the user lacks `indices:admin/create` on the cluster.
 */

const LOCAL_STORAGE_KEY = "mdm:discover:savedSearches:v1";
const SAVED_SEARCH_INDEX = "mdm-saved-searches";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ss_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

class LocalSavedSearchStorage implements SavedSearchStorage {
  private readAll(): SavedSearch[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as SavedSearch[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(items: SavedSearch[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  async find(options: SavedSearchFindOptions = {}): Promise<SavedSearch[]> {
    let items = this.readAll();
    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter((i) =>
        i.attributes.title.toLowerCase().includes(q),
      );
    }
    const field = options.sortField ?? "updatedAt";
    const order = options.sortOrder ?? "desc";
    items.sort((a, b) => {
      const av = field === "title" ? a.attributes.title : a.updatedAt;
      const bv = field === "title" ? b.attributes.title : b.updatedAt;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return order === "asc" ? cmp : -cmp;
    });
    return items;
  }

  async get(id: string): Promise<SavedSearch | null> {
    return this.readAll().find((i) => i.id === id) ?? null;
  }

  async create(attributes: SavedSearchAttributes): Promise<SavedSearch> {
    const now = new Date().toISOString();
    const item: SavedSearch = {
      id: newId(),
      attributes,
      createdAt: now,
      updatedAt: now,
    };
    const items = this.readAll();
    items.push(item);
    this.writeAll(items);
    return item;
  }

  async update(
    id: string,
    attributes: Partial<SavedSearchAttributes>,
  ): Promise<SavedSearch> {
    const items = this.readAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error(`Saved search ${id} not found`);
    const updated: SavedSearch = {
      ...items[idx],
      attributes: { ...items[idx].attributes, ...attributes },
      updatedAt: new Date().toISOString(),
    };
    items[idx] = updated;
    this.writeAll(items);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const items = this.readAll().filter((i) => i.id !== id);
    this.writeAll(items);
  }
}

/** Document shape stored in the OpenSearch index. */
interface SavedSearchDoc {
  attributes: SavedSearchAttributes;
  createdAt: string;
  updatedAt: string;
}

interface IndexerSearchHit {
  _id: string;
  _source: SavedSearchDoc;
}

interface IndexerSearchResp {
  hits: { total: { value: number }; hits: IndexerSearchHit[] };
}

/**
 * Persists saved searches to a dedicated OpenSearch index. Uses the same
 * `/api/wazuh-indexer` proxy that Discover queries go through, so no extra
 * credentials leak to the browser.
 */
class IndexerSavedSearchStorage implements SavedSearchStorage {
  private ensurePromise: Promise<void> | null = null;

  private async ensureIndex(): Promise<void> {
    if (this.ensurePromise) return this.ensurePromise;
    this.ensurePromise = (async () => {
      try {
        // HEAD is lightest, but the generic client only exposes GET; a GET on
        // the index returns 200 if it exists, 404 otherwise.
        await wazuhIndexerApi.get(`/${SAVED_SEARCH_INDEX}`);
        return;
      } catch (e: unknown) {
        const status = (e as { response?: { status: number } }).response?.status;
        if (status !== 404) throw e;
      }
      await wazuhIndexerApi.put(`/${SAVED_SEARCH_INDEX}`, {
        mappings: {
          properties: {
            attributes: {
              properties: {
                title: {
                  type: "text",
                  fields: { keyword: { type: "keyword", ignore_above: 256 } },
                },
                indexPattern: { type: "keyword" },
                query: { type: "text" },
                timeRange: { type: "keyword" },
                columns: { type: "keyword" },
                description: { type: "text" },
              },
            },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      });
    })();
    return this.ensurePromise;
  }

  async find(options: SavedSearchFindOptions = {}): Promise<SavedSearch[]> {
    await this.ensureIndex();
    const sortField = options.sortField ?? "updatedAt";
    const sortOrder = options.sortOrder ?? "desc";
    const sortKey =
      sortField === "title" ? "attributes.title.keyword" : sortField;

    const must: Record<string, unknown>[] = [];
    if (options.search) {
      must.push({
        wildcard: {
          "attributes.title.keyword": {
            value: `*${options.search}*`,
            case_insensitive: true,
          },
        },
      });
    }

    const resp = await wazuhIndexerApi.post<IndexerSearchResp>(
      `/${SAVED_SEARCH_INDEX}/_search`,
      {
        size: 500,
        query: must.length > 0 ? { bool: { must } } : { match_all: {} },
        sort: [{ [sortKey]: { order: sortOrder } }],
      },
    );

    return resp.hits.hits.map((h) => ({
      id: h._id,
      attributes: h._source.attributes,
      createdAt: h._source.createdAt,
      updatedAt: h._source.updatedAt,
    }));
  }

  async get(id: string): Promise<SavedSearch | null> {
    await this.ensureIndex();
    try {
      const doc = await wazuhIndexerApi.getDocument<SavedSearchDoc>(
        SAVED_SEARCH_INDEX,
        id,
      );
      if (!doc.found) return null;
      return {
        id: doc._id,
        attributes: doc._source.attributes,
        createdAt: doc._source.createdAt,
        updatedAt: doc._source.updatedAt,
      };
    } catch (e: unknown) {
      if ((e as { response?: { status: number } }).response?.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async create(attributes: SavedSearchAttributes): Promise<SavedSearch> {
    await this.ensureIndex();
    const now = new Date().toISOString();
    const id = newId();
    const doc: SavedSearchDoc = { attributes, createdAt: now, updatedAt: now };
    await wazuhIndexerApi.put(
      `/${SAVED_SEARCH_INDEX}/_doc/${encodeURIComponent(id)}?refresh=wait_for`,
      doc,
    );
    return { id, ...doc };
  }

  async update(
    id: string,
    attributes: Partial<SavedSearchAttributes>,
  ): Promise<SavedSearch> {
    await this.ensureIndex();
    const existing = await this.get(id);
    if (!existing) throw new Error(`Saved search ${id} not found`);
    const merged: SavedSearchDoc = {
      attributes: { ...existing.attributes, ...attributes },
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    await wazuhIndexerApi.put(
      `/${SAVED_SEARCH_INDEX}/_doc/${encodeURIComponent(id)}?refresh=wait_for`,
      merged,
    );
    return { id, ...merged };
  }

  async delete(id: string): Promise<void> {
    await this.ensureIndex();
    try {
      await wazuhIndexerApi.delete(
        `/${SAVED_SEARCH_INDEX}/_doc/${encodeURIComponent(id)}?refresh=wait_for`,
      );
    } catch (e: unknown) {
      // Deleting a non-existent doc is a no-op.
      if ((e as { response?: { status: number } }).response?.status === 404) return;
      throw e;
    }
  }
}

/**
 * Composite storage: indexer first, local on failure. The decision is sticky
 * for the session — once we degrade to local we don't keep hammering the
 * indexer for every operation.
 */
class HybridSavedSearchStorage implements SavedSearchStorage {
  private readonly remote = new IndexerSavedSearchStorage();
  private readonly local = new LocalSavedSearchStorage();
  private degraded = false;
  private _degradedAt: string | null = null;

  get isDegraded(): boolean {
    return this.degraded;
  }

  get degradedAt(): string | null {
    return this._degradedAt;
  }

  private async run<T>(op: (s: SavedSearchStorage) => Promise<T>): Promise<T> {
    if (this.degraded) return op(this.local);
    try {
      return await op(this.remote);
    } catch (e) {
      console.warn(
        "[SavedSearches] Indexer storage unavailable, falling back to localStorage:",
        e,
      );
      this.degraded = true;
      this._degradedAt = new Date().toISOString();
      return op(this.local);
    }
  }

  find(options?: SavedSearchFindOptions) {
    return this.run((s) => s.find(options));
  }
  get(id: string) {
    return this.run((s) => s.get(id));
  }
  create(attributes: SavedSearchAttributes) {
    return this.run((s) => s.create(attributes));
  }
  update(id: string, attributes: Partial<SavedSearchAttributes>) {
    return this.run((s) => s.update(id, attributes));
  }
  delete(id: string) {
    return this.run((s) => s.delete(id));
  }
}

const hybridStorage = new HybridSavedSearchStorage();

export const savedSearchStorage: SavedSearchStorage = hybridStorage;

export const useSavedSearchesStore = defineStore("savedSearches", () => {
  const items = ref<SavedSearch[]>([]);
  const loading = ref(false);
  const activeId = ref<string | null>(null);
  const storageDegraded = ref(false);

  const active = computed<SavedSearch | null>(
    () => items.value.find((i) => i.id === activeId.value) ?? null,
  );

  async function reload(search?: string) {
    loading.value = true;
    try {
      items.value = await savedSearchStorage.find({
        search,
        sortField: "updatedAt",
        sortOrder: "desc",
      });
    } finally {
      storageDegraded.value = hybridStorage.isDegraded;
      loading.value = false;
    }
  }

  async function create(attributes: SavedSearchAttributes) {
    const created = await savedSearchStorage.create(attributes);
    activeId.value = created.id;
    await reload();
    return created;
  }

  async function update(id: string, attributes: Partial<SavedSearchAttributes>) {
    const updated = await savedSearchStorage.update(id, attributes);
    await reload();
    return updated;
  }

  async function remove(id: string) {
    await savedSearchStorage.delete(id);
    if (activeId.value === id) activeId.value = null;
    await reload();
  }

  function setActive(id: string | null) {
    activeId.value = id;
  }

  return {
    items,
    loading,
    activeId,
    active,
    storageDegraded,
    reload,
    create,
    update,
    remove,
    setActive,
  };
});
