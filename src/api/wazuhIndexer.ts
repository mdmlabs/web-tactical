import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { getBaseUrl } from "@/boot/axios";
import type { OpenSearchQueryBody, OpenSearchResponse } from "@/types/fim";

/**
 * Client for Wazuh Indexer (OpenSearch).
 * Sends native OpenSearch requests through nginx proxy:
 *   /api/wazuh-indexer/{index}/_search  ->  nginx strips prefix  ->  OpenSearch /{index}/_search
 */
class WazuhIndexerClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.NODE_ENV === "production"
        ? `${window._env_?.PROD_URL ?? ""}/api/wazuh-indexer`
        : `${getBaseUrl()}/api/wazuh-indexer`;

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
    });
  }

  /**
   * Generic GET request to any OpenSearch endpoint.
   * Sends: GET /api/wazuh-indexer{path}
   */
  async get<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.get<T>(path, config);
    return data;
  }

  /**
   * Generic POST request to any OpenSearch endpoint.
   * Sends: POST /api/wazuh-indexer{path}
   */
  async post<T = unknown>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.post<T>(path, body, config);
    return data;
  }

  /**
   * Generic PUT request to any OpenSearch endpoint.
   * Sends: PUT /api/wazuh-indexer{path}
   */
  async put<T = unknown>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.put<T>(path, body, config);
    return data;
  }

  /**
   * Generic DELETE request to any OpenSearch endpoint.
   * Sends: DELETE /api/wazuh-indexer{path}
   */
  async delete<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.delete<T>(path, config);
    return data;
  }

  /**
   * Execute a search query against the Wazuh Indexer (OpenSearch).
   * Sends: POST /api/wazuh-indexer/{indexPattern}/_search
   */
  async search<T = unknown>(
    indexPattern: string,
    body: OpenSearchQueryBody,
  ): Promise<OpenSearchResponse<T>> {
    const { data } = await this.client.post<OpenSearchResponse<T>>(
      `/${encodeURIComponent(indexPattern)}/_search`,
      body,
    );
    return data;
  }

  /**
   * Retrieve a single document by index and document ID.
   * Sends: GET /api/wazuh-indexer/{index}/_doc/{id}
   */
  async getDocument<T = unknown>(
    index: string,
    docId: string,
  ): Promise<{ _index: string; _id: string; _source: T; found: boolean }> {
    const { data } = await this.client.get<{
      _index: string;
      _id: string;
      _source: T;
      found: boolean;
    }>(`/${encodeURIComponent(index)}/_doc/${encodeURIComponent(docId)}`);
    return data;
  }

  /**
   * Execute multiple search queries in a single request.
   * Sends: POST /api/wazuh-indexer/_msearch
   */
  async msearch<T = unknown>(
    requests: { index: string; body: OpenSearchQueryBody }[],
  ): Promise<{ responses: OpenSearchResponse<T>[] }> {
    // OpenSearch _msearch expects NDJSON format
    const ndjson = requests
      .map((r) => `${JSON.stringify({ index: r.index })}\n${JSON.stringify(r.body)}`)
      .join("\n") + "\n";

    const { data } = await this.client.post<{
      responses: OpenSearchResponse<T>[];
    }>("/_msearch", ndjson, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
    return data;
  }
}

export const wazuhIndexerApi = new WazuhIndexerClient();
