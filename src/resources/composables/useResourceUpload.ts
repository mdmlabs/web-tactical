import { ref } from "vue";
import type { UploadConfirmRequest } from "../types/resources";
import { RESOURCE_SIZE_LIMITS } from "../types/resources";
import type { ResourceType } from "../types/resources";
import { initUpload, confirmUpload, abortUpload } from "@/api/resources";

type UploadPhase = "idle" | "hashing" | "uploading" | "confirming";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function uploadToMinIO(
  file: File,
  presignedUrl: string,
  fields: Record<string, string>,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // Fields MUST come before the file
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", presignedUrl);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 204) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

export interface UploadMetadata {
  name: string;
  resource_type: ResourceType;
  segment?: string;
  description?: string;
  version?: string;
  platform?: string;
  tags?: string[];
  language?: string;
  author?: string;
  alt_text?: string;
  expiry_date?: string | null;
  issued_to?: string;
  password?: string;
  install_config?: Record<string, unknown> | null;
  verification_config?: Record<string, unknown> | null;
  msi_metadata?: Record<string, unknown> | null;
}

export function useResourceUpload() {
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const uploadPhase = ref<UploadPhase>("idle");

  async function uploadResource(
    file: File,
    metadata: UploadMetadata,
  ): Promise<Record<string, unknown>> {
    // 1. Validate file size
    const resourceType = metadata.resource_type;
    const sizeLimit = RESOURCE_SIZE_LIMITS[resourceType];
    if (sizeLimit && file.size > sizeLimit) {
      throw new Error(
        `File too large. Maximum size for ${resourceType}: ${formatFileSize(sizeLimit)}`,
      );
    }

    uploading.value = true;
    uploadProgress.value = 0;
    uploadPhase.value = "hashing";

    let s3Key: string | null = null;

    try {
      // 2. Compute SHA-256 and request presigned URL in parallel
      const [fileHash, presigned] = await Promise.all([
        computeSHA256(file),
        initUpload({
          filename: file.name,
          file_size: file.size,
          content_type: file.type || "application/octet-stream",
        }),
      ]);

      s3Key = presigned.s3_key;

      // 3. Upload to MinIO directly
      uploadPhase.value = "uploading";
      await uploadToMinIO(file, presigned.url, presigned.fields, (percent) => {
        uploadProgress.value = percent;
      });

      // 4. Confirm upload
      uploadPhase.value = "confirming";
      const confirmPayload: UploadConfirmRequest = {
        s3_key: presigned.s3_key,
        file_hash: fileHash,
        name: metadata.name,
        resource_type: metadata.resource_type,
        segment: metadata.segment,
        description: metadata.description,
        version: metadata.version,
        platform: metadata.platform,
        tags: metadata.tags,
        language: metadata.language,
        author: metadata.author,
        alt_text: metadata.alt_text,
        expiry_date: metadata.expiry_date,
        issued_to: metadata.issued_to,
        password: metadata.password,
        install_config: metadata.install_config,
        verification_config: metadata.verification_config,
        msi_metadata: metadata.msi_metadata,
      };

      const resource = await confirmUpload(confirmPayload);

      uploadPhase.value = "idle";
      return resource;
    } catch (error) {
      // Clean up S3 on failure if we got past init
      if (s3Key) {
        try {
          await abortUpload(s3Key);
        } catch {
          // Abort is best-effort
        }
      }
      throw error;
    } finally {
      uploading.value = false;
      uploadProgress.value = 0;
      uploadPhase.value = "idle";
    }
  }

  return {
    uploading,
    uploadProgress,
    uploadPhase,
    uploadResource,
  };
}
