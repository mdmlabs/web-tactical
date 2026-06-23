export type ResourceType = "all" | "script" | "app" | "book" | "image" | "certificate";

export type ScriptLanguage =
  | "PowerShell"
  | "Python"
  | "Bash"
  | "Batch"
  | "JavaScript";

export type AppPlatform = "Windows" | "macOS" | "Linux" | "Cross-Platform";

export interface BaseResource {
  id: string;
  name: string;
  description: string;
  segment: string;
  extension: string;
  createdTime: string;
  fileName?: string;
  fileSize?: number;
  resourceType?: ResourceType;
  s3Bucket?: string;
  s3Key?: string;
  fileHash?: string;
  size?: string;
  tags?: string[];
  version?: string;
  platform?: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedTime?: string;
}

export interface Script extends BaseResource {
  type: "script";
  language: ScriptLanguage;
}

export interface App extends BaseResource {
  type: "app";
  version: string;
  platform: AppPlatform;
}

export interface Book extends BaseResource {
  type: "book";
  size: string;
  author?: string;
}

export interface Image extends BaseResource {
  type: "image";
  size: string;
  dimensions: string;
  altText?: string;
}

export interface Certificate extends BaseResource {
  type: "certificate";
  expiryDate: string;
  issuedTo: string;
}

export type Resource = Script | App | Book | Image | Certificate;

export interface ResourceCategory {
  id: ResourceType;
  label: string;
  icon: string;
  createLabel: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: "all", label: "All Resources", icon: "folder", createLabel: "Create Resource" },
  {
    id: "script",
    label: "Scripts",
    icon: "code",
    createLabel: "Create Script",
  },
  { id: "app", label: "Apps", icon: "apps", createLabel: "Create App" },
  { id: "book", label: "Books", icon: "menu_book", createLabel: "Upload Book" },
  { id: "image", label: "Images", icon: "image", createLabel: "Upload Image" },
  {
    id: "certificate",
    label: "Certificates",
    icon: "vpn_key",
    createLabel: "Upload Certificate",
  },
];

export const SCRIPT_LANGUAGES: ScriptLanguage[] = [
  "PowerShell",
  "Python",
  "Bash",
  "Batch",
  "JavaScript",
];

export const APP_PLATFORMS: AppPlatform[] = [
  "Windows",
  "macOS",
  "Linux",
  "Cross-Platform",
];

export const SEGMENTS = [
  "Global",
  "Europe",
  "North America",
  "Asia Pacific",
  "Development",
  "Production",
];

export const SCRIPT_EXTENSIONS: Record<string, ScriptLanguage> = {
  ps1: "PowerShell",
  py: "Python",
  sh: "Bash",
  bat: "Batch",
  cmd: "Batch",
  js: "JavaScript",
};

export const ALLOWED_EXTENSIONS: Record<ResourceType, string[]> = {
  all: [], // 'all' is a virtual category, no direct uploads
  script: ["ps1", "py", "sh", "bat", "cmd", "js"],
  app: ["exe", "msi", "dmg", "pkg", "deb", "rpm", "appimage"],
  book: ["pdf", "epub", "mobi", "djvu"],
  image: ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"],
  certificate: ["p12", "pfx", "cer", "crt", "pem", "key"],
};

export const RESOURCE_SIZE_LIMITS: Record<ResourceType, number> = {
  all: 0, // 'all' is a virtual category, no direct uploads
  script: 10 * 1024 * 1024, // 10 MB
  app: 500 * 1024 * 1024, // 500 MB
  book: 100 * 1024 * 1024, // 100 MB
  image: 50 * 1024 * 1024, // 50 MB
  certificate: 5 * 1024 * 1024, // 5 MB
};

export interface UploadInitRequest {
  filename: string;
  file_size: number;
  content_type: string;
  folder?: string;
}

export interface UploadInitResponse {
  url: string;
  fields: Record<string, string>;
  s3_key: string;
  expires_in: number;
}

export interface UploadConfirmRequest {
  s3_key: string;
  file_hash: string;
  name: string;
  resource_type?: string;
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

export interface DownloadUrlResponse {
  downloadUrl: string;
  fileName: string;
  expiresIn: number;
}
