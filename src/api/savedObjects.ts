import { wazuhDashboardApi } from "@/api/wazuhDashboard";

/**
 * Thin client over OpenSearch Dashboards' `/api/saved_objects/_find`.
 * Used to populate the Source dropdown in the report-definition form
 * (saved searches, dashboards, visualizations).
 *
 * Note: the dashboards-server's saved-objects index (`.kibana`) is a
 * **different store** from the custom `mdm-saved-searches` index used by
 * our Discover module. The Reports plugin only sees `.kibana`-resident
 * objects, so the Source dropdown necessarily reflects that store.
 */

export type SavedObjectType = "search" | "dashboard" | "visualization";

export interface SavedObjectAttributes {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SavedObject {
  id: string;
  type: SavedObjectType | string;
  attributes: SavedObjectAttributes;
  updated_at?: string;
}

interface FindResponse {
  total?: number;
  saved_objects?: SavedObject[];
}

export async function findSavedObjects(
  type: SavedObjectType,
  perPage = 1000,
): Promise<SavedObject[]> {
  const data = await wazuhDashboardApi.get<FindResponse>(
    "/api/saved_objects/_find",
    { type, per_page: perPage },
  );
  return data?.saved_objects ?? [];
}

export const findSavedSearches = (): Promise<SavedObject[]> =>
  findSavedObjects("search");
