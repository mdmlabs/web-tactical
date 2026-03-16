import axios from "axios";
import type {
  UploadInitRequest,
  UploadInitResponse,
  UploadConfirmRequest,
  DownloadUrlResponse,
} from "@/resources/types/resources";

const baseUrl = "/files/resources";
const uploadBaseUrl = "/files/upload";

// snake_case -> camelCase field mapping for API responses
function mapFromApi(data: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case "file_name":
        mapped["fileName"] = value;
        break;
      case "file_size":
        mapped["fileSize"] = value;
        break;
      case "expiry_date":
        mapped["expiryDate"] = value;
        break;
      case "issued_to":
        mapped["issuedTo"] = value;
        break;
      case "alt_text":
        mapped["altText"] = value;
        break;
      case "resource_type":
        mapped["resourceType"] = value;
        break;
      case "created_time":
        mapped["createdTime"] = value;
        break;
      case "s3_bucket":
        mapped["s3Bucket"] = value;
        break;
      case "s3_key":
        mapped["s3Key"] = value;
        break;
      case "file_hash":
        mapped["fileHash"] = value;
        break;
      case "created_by":
        mapped["createdBy"] = value;
        break;
      case "modified_by":
        mapped["modifiedBy"] = value;
        break;
      case "modified_time":
        mapped["modifiedTime"] = value;
        break;
      case "download_url":
        mapped["downloadUrl"] = value;
        break;
      default:
        mapped[key] = value;
    }
  }
  return mapped;
}

function mapResultsFromApi(
  results: Record<string, unknown>[],
): Record<string, unknown>[] {
  return results.map(mapFromApi);
}

interface FetchResourcesParams {
  type?: string;
  segment?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  per_page?: number;
}

export async function fetchResources(params: FetchResourcesParams = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/`, { params });
    return {
      count: data.count,
      results: mapResultsFromApi(data.results),
    };
  } catch (e) {
    console.error(e);
  }
}

export async function fetchResourceCounts() {
  try {
    const { data } = await axios.get(`${baseUrl}/counts/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchResource(id: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/${id}/`);
    return mapFromApi(data);
  } catch (e) {
    console.error(e);
  }
}

export async function updateResource(
  id: string,
  payload: Record<string, unknown>,
) {
  const { data } = await axios.put(`${baseUrl}/${id}/`, payload);
  return mapFromApi(data);
}

export async function deleteResource(id: string) {
  await axios.delete(`${baseUrl}/${id}/`);
}

export async function downloadResource(
  id: string,
): Promise<DownloadUrlResponse> {
  const { data } = await axios.get(`${baseUrl}/${id}/download/`);
  return mapFromApi(data) as unknown as DownloadUrlResponse;
}

export async function fetchResourceList(type: string) {
  try {
    const { data } = await axios.get(`/resources/${type}s/list/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

// --- Upload flow (3-step presigned) ---

export async function initUpload(
  params: UploadInitRequest,
): Promise<UploadInitResponse> {
  const { data } = await axios.post(`${uploadBaseUrl}/init/`, params);
  return data;
}

export async function confirmUpload(
  params: UploadConfirmRequest,
): Promise<Record<string, unknown>> {
  const { data } = await axios.post(`${uploadBaseUrl}/confirm/`, params);
  return mapFromApi(data);
}

export async function abortUpload(s3Key: string): Promise<void> {
  await axios.post(`${uploadBaseUrl}/abort/`, { s3_key: s3Key });
}
