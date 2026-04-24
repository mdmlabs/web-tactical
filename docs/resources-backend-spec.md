# Resources Module - Backend Technical Specification

## 1. Overview

The Resources module is a centralized file/asset repository for managing 5 types of resources: **Scripts**, **Apps** (application installers), **Books** (documents), **Images**, and **Certificates**. Resources are uploaded via the frontend, stored on the backend, and referenced by the Policies module when configuring device delivery.

**Frontend location:** `src/resources/`

**Key frontend operations:**
- Browse resources by category (sidebar navigation)
- Filter by segment, search by name/description
- Create/upload new resources (dedicated form pages per type)
- Download resource files
- Edit resource metadata
- Delete resources

**API style:** REST via Axios, consistent with existing platform endpoints (`/agents/`, `/accounts/`, etc.). Django-style trailing slashes. Bearer token auth.

---

## 2. Data Model

All resource types share a common base set of fields, with type-specific extensions.

### 2.1 Base Fields (common to all types)

| Field         | Type          | Description                           | Constraints                        |
|---------------|--------------|---------------------------------------|------------------------------------|
| `id`          | UUID (string) | Unique identifier                     | Auto-generated, PK                 |
| `type`        | enum          | Resource category                     | `script` \| `app` \| `book` \| `image` \| `certificate` |
| `name`        | string        | Display name                          | Required, max 255 chars             |
| `description` | string        | Free-text description                 | Optional, max 2000 chars            |
| `segment`     | string        | Segment/region scope                  | One of: `Global`, `Europe`, `North America`, `Asia Pacific`, `Development`, `Production` |
| `extension`   | string        | File extension (uppercase)            | Derived from uploaded file, e.g. `PS1`, `MSI`, `PDF` |
| `created`     | datetime (ISO)| Upload timestamp                      | Auto, read-only                     |
| `file_name`   | string        | Original uploaded file name           | Set from upload, read-only          |
| `file_size`   | integer       | File size in bytes                    | Set from upload, read-only          |

### 2.2 Script (type = `script`)

| Field      | Type   | Description           | Constraints                                       |
|------------|-------|-----------------------|---------------------------------------------------|
| `language` | enum   | Scripting language    | `PowerShell` \| `Python` \| `Bash` \| `Batch` \| `JavaScript` |

**Allowed extensions:** `ps1`, `py`, `sh`, `bat`, `cmd`, `js`

**Auto-detection:** Backend should auto-detect `language` from extension if not explicitly provided:

| Extension | Language    |
|-----------|-------------|
| `ps1`     | PowerShell  |
| `py`      | Python      |
| `sh`      | Bash        |
| `bat`     | Batch       |
| `cmd`     | Batch       |
| `js`      | JavaScript  |

### 2.3 App (type = `app`)

| Field      | Type   | Description                 | Constraints                                       |
|------------|-------|-----------------------------|----------------------------------------------------|
| `version`  | string | Application version         | Required, e.g. `1.0.0`, `122.0.6261.69`           |
| `platform` | enum   | Target platform             | `Windows` \| `macOS` \| `Linux` \| `Cross-Platform` |

**Allowed extensions:** `exe`, `msi`, `dmg`, `pkg`, `deb`, `rpm`, `appimage`

**Auto-detection:** Backend may auto-detect `platform` from extension:

| Extension      | Platform |
|----------------|----------|
| `exe`, `msi`   | Windows  |
| `dmg`, `pkg`   | macOS    |
| `deb`, `rpm`, `appimage` | Linux |

### 2.4 Book (type = `book`)

| Field    | Type    | Description                    | Constraints     |
|----------|--------|--------------------------------|-----------------|
| `size`   | string  | Human-readable file size       | Computed from `file_size`, e.g. `35.8 KB`, `4.2 MB` |
| `author` | string  | Author name                    | Optional         |

**Allowed extensions:** `pdf`, `epub`, `mobi`, `djvu`

### 2.5 Image (type = `image`)

| Field        | Type   | Description                    | Constraints       |
|--------------|-------|--------------------------------|--------------------|
| `size`       | string | Human-readable file size       | Computed from `file_size` |
| `dimensions` | string | Image dimensions               | `{width} x {height}`, e.g. `1920 x 1080` |
| `alt_text`   | string | Accessibility alt text         | Optional           |

**Allowed extensions:** `jpg`, `jpeg`, `png`, `gif`, `svg`, `webp`, `ico`

**Backend note:** The backend should extract image dimensions from the uploaded file using an image processing library (e.g. Pillow for Python, sharp for Node.js).

### 2.6 Certificate (type = `certificate`)

| Field        | Type   | Description               | Constraints       |
|--------------|-------|---------------------------|--------------------|
| `expiry_date`| date   | Certificate expiry date   | Required, `YYYY-MM-DD` |
| `issued_to`  | string | Certificate subject/CN    | Required            |
| `password`   | string | Certificate password      | Optional, write-only (never returned in GET), stored encrypted |

**Allowed extensions:** `p12`, `pfx`, `cer`, `crt`, `pem`, `key`

---

## 3. File Storage

Each resource has an associated file uploaded by the user. The backend must handle:

1. **File upload** -- Accept `multipart/form-data` with the file + metadata fields
2. **File storage** -- Store files in a persistent storage (local filesystem, S3, Azure Blob, etc.)
3. **File download** -- Serve the file with proper `Content-Disposition` and `Content-Type` headers
4. **File deletion** -- Remove the stored file when the resource is deleted

**Security considerations:**
- Validate file extensions against the allowed list per resource type
- Validate file size (set a max, e.g. 500 MB for apps, 50 MB for others)
- Scan uploaded files if antivirus integration is available
- Never serve files with executable MIME types directly; use `Content-Disposition: attachment`

---

## 4. API Endpoints

Base URL: `/resources/`

Authentication: `Authorization: Bearer <token>`

### 4.1 List Resources

#### `GET /resources/`

List resources with filtering by type, segment, and search.

**Query Parameters:**

| Param     | Type    | Description                                        |
|-----------|--------|----------------------------------------------------|
| `type`    | string  | Filter by type: `script`, `app`, `book`, `image`, `certificate` |
| `segment` | string  | Filter by segment (e.g. `Global`)                  |
| `search`  | string  | Search by name or description (case-insensitive)   |
| `page`    | integer | Page number (default: 1)                            |
| `per_page`| integer | Items per page (default: 20)                        |
| `sort_by` | string  | Sort field: `name`, `created`, `segment`, `language`, `version`, `expiry_date` |
| `sort_dir`| string  | Sort direction: `asc` \| `desc` (default: `desc`)  |

**Response: `200 OK`**

```json
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "type": "script",
      "name": "con_script",
      "description": "Connection test script",
      "segment": "Global",
      "language": "PowerShell",
      "extension": "PS1",
      "created": "2026-03-05T10:00:00Z",
      "file_name": "con_script.ps1",
      "file_size": 2048
    }
  ]
}
```

**Notes:** The response includes type-specific fields based on the resource type. Each item in results will have only the fields relevant to its `type`.

---

#### `GET /resources/counts/`

Get count of resources per category. Used by the sidebar.

**Response: `200 OK`**

```json
{
  "script": 5,
  "app": 4,
  "book": 4,
  "image": 3,
  "certificate": 4
}
```

---

### 4.2 Get Single Resource

#### `GET /resources/{id}/`

**Response: `200 OK`**

Returns the full resource object including all type-specific fields. Same format as list item.

---

### 4.3 Create Resource (with file upload)

Each resource type has the same endpoint but different required fields. The file and metadata are sent together as `multipart/form-data`.

#### `POST /resources/`

**Content-Type:** `multipart/form-data`

**Common fields:**

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| `file`        | file   | Yes      | The resource file           |
| `type`        | string | Yes      | Resource type               |
| `name`        | string | Yes      | Display name                |
| `description` | string | No       | Description                 |
| `segment`     | string | Yes      | Segment                     |

**Type-specific fields:**

**Script:**

| Field      | Type   | Required | Description       |
|------------|--------|----------|-------------------|
| `language` | string | Yes*     | Scripting language (auto-detected from extension if omitted) |

**App:**

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `version`  | string | Yes      | Application version  |
| `platform` | string | Yes*     | Target platform (auto-detected from extension if omitted) |

**Book:**

| Field    | Type   | Required | Description   |
|----------|--------|----------|---------------|
| `author` | string | No       | Author name   |

**Image:**

| Field      | Type   | Required | Description     |
|------------|--------|----------|-----------------|
| `alt_text` | string | No       | Alt text        |

**Note:** `dimensions` is extracted automatically from the image file on the backend.

**Certificate:**

| Field        | Type   | Required | Description          |
|--------------|--------|----------|----------------------|
| `issued_to`  | string | Yes      | Certificate subject  |
| `expiry_date`| string | Yes      | Expiry date (YYYY-MM-DD) |
| `password`   | string | No       | Certificate password (for P12/PFX) |

**Response: `201 Created`**

Returns the created resource object (without `password`).

**Backend logic:**
- Validate file extension against `ALLOWED_EXTENSIONS[type]`
- Set `extension` from uploaded file (uppercase)
- Set `file_name` from uploaded file
- Set `file_size` from uploaded file
- For scripts: auto-detect `language` from extension if not provided
- For apps: auto-detect `platform` from extension if not provided
- For books: compute `size` from `file_size` (human-readable)
- For images: extract `dimensions` from the image, compute `size` from `file_size`
- For certificates: store `password` encrypted, never return it in responses
- Store the file in persistent storage

---

### 4.4 Update Resource

#### `PUT /resources/{id}/`

Update resource metadata. File cannot be replaced (delete and re-create).

**Content-Type:** `application/json`

**Request Body:** Only the metadata fields that can be changed:

```json
{
  "name": "Updated name",
  "description": "Updated description",
  "segment": "Europe"
}
```

**Type-specific updatable fields:**

| Type        | Updatable fields                          |
|-------------|-------------------------------------------|
| Script      | `name`, `description`, `segment`, `language` |
| App         | `name`, `description`, `segment`, `version`, `platform` |
| Book        | `name`, `description`, `segment`, `author` |
| Image       | `name`, `description`, `segment`, `alt_text` |
| Certificate | `name`, `description`, `segment`, `issued_to`, `expiry_date`, `password` |

**Response: `200 OK`** - Returns updated resource.

**Note:** `type`, `extension`, `file_name`, `file_size`, `created` are immutable.

---

### 4.5 Delete Resource

#### `DELETE /resources/{id}/`

Deletes the resource record and the associated file from storage.

**Response: `204 No Content`**

**Backend logic:**
- Remove file from storage
- Delete database record
- Check if this resource is referenced by any policy (PolicyApp, PolicyScript, PolicyResource). If so, either:
  - Option A: Block deletion and return `409 Conflict` with message listing the policies that reference it
  - Option B: Allow deletion and cascade-remove the references from policies (simpler but more destructive)
  - **Recommended:** Option A (block and notify)

---

### 4.6 Download Resource File

#### `GET /resources/{id}/download/`

Serves the actual file for download.

**Response: `200 OK`**

Headers:
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="original_filename.ext"
Content-Length: <file_size>
```

Returns the raw file bytes.

---

### 4.7 Lightweight List Endpoints (for Policies module dropdowns)

These endpoints return minimal data for populating select dropdowns in the Policies module. They are simpler/faster than the full list endpoint.

#### `GET /resources/apps/list/`

```json
[
  { "id": "uuid", "name": "Google Chrome", "version": "122.0.6261.69", "extension": "MSI" }
]
```

#### `GET /resources/scripts/list/`

```json
[
  { "id": "uuid", "name": "Cleanup Temp Files", "language": "PowerShell" }
]
```

#### `GET /resources/books/list/`

```json
[
  { "id": "uuid", "name": "Employee Handbook 2026", "extension": "PDF" }
]
```

#### `GET /resources/images/list/`

```json
[
  { "id": "uuid", "name": "Company Logo", "extension": "PNG" }
]
```

#### `GET /resources/certificates/list/`

```json
[
  { "id": "uuid", "name": "Root CA Certificate", "extension": "CER" }
]
```

**Note:** These endpoints return **all** resources of the given type (no pagination, no filtering) since they're used for select dropdowns. If the dataset grows large, add optional `search` and `limit` params.

---

## 5. Frontend-Backend Field Mapping

| Frontend (camelCase) | Backend (snake_case) |
|----------------------|----------------------|
| `fileName`           | `file_name`          |
| `fileSize`           | `file_size`          |
| `expiryDate`         | `expiry_date`        |
| `issuedTo`           | `issued_to`          |
| `altText`            | `alt_text`           |

All other field names are the same in both cases (`name`, `type`, `segment`, `language`, `version`, `platform`, `extension`, `description`, `created`, `author`, `size`, `dimensions`, `password`).

---

## 6. Validation Rules

### 6.1 File Extension Validation

```python
ALLOWED_EXTENSIONS = {
    "script":      ["ps1", "py", "sh", "bat", "cmd", "js"],
    "app":         ["exe", "msi", "dmg", "pkg", "deb", "rpm", "appimage"],
    "book":        ["pdf", "epub", "mobi", "djvu"],
    "image":       ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"],
    "certificate": ["p12", "pfx", "cer", "crt", "pem", "key"],
}
```

If the uploaded file extension is not in the allowed list for the given `type`, return `400 Bad Request`:

```json
{
  "error": "Invalid file extension",
  "detail": "Extension '.docx' is not allowed for type 'script'. Allowed: ps1, py, sh, bat, cmd, js"
}
```

### 6.2 Required Fields per Type

| Type        | Required                                        |
|-------------|--------------------------------------------------|
| script      | `file`, `name`, `segment`, `language`*           |
| app         | `file`, `name`, `segment`, `version`, `platform`* |
| book        | `file`, `name`, `segment`                         |
| image       | `file`, `name`, `segment`                         |
| certificate | `file`, `name`, `segment`, `issued_to`, `expiry_date` |

\* = can be auto-detected from file extension

### 6.3 File Size Limits (recommended)

| Type        | Max size |
|-------------|----------|
| script      | 10 MB    |
| app         | 500 MB   |
| book        | 100 MB   |
| image       | 50 MB    |
| certificate | 5 MB     |

---

## 7. Error Responses

```json
{
  "error": "Short error description",
  "detail": "Detailed error message for debugging"
}
```

| Status | Usage                                                   |
|--------|---------------------------------------------------------|
| 400    | Validation error (bad extension, missing required field) |
| 401    | Not authenticated                                        |
| 403    | Forbidden (insufficient permissions)                     |
| 404    | Resource not found                                       |
| 409    | Conflict (resource is referenced by policies)            |
| 413    | File too large                                           |
| 500    | Internal server error                                    |

---

## 8. Database Schema (Reference)

```sql
CREATE TABLE resources (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        VARCHAR(20) NOT NULL CHECK (type IN ('script', 'app', 'book', 'image', 'certificate')),
    name        VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    segment     VARCHAR(50) NOT NULL DEFAULT 'Global',
    extension   VARCHAR(20) NOT NULL,
    created     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    file_name   VARCHAR(500) NOT NULL,
    file_size   BIGINT NOT NULL DEFAULT 0,
    file_path   VARCHAR(1000) NOT NULL,  -- internal storage path, never exposed to frontend

    -- Script fields
    language    VARCHAR(20),  -- NULL for non-scripts

    -- App fields
    version     VARCHAR(100), -- NULL for non-apps
    platform    VARCHAR(20),  -- NULL for non-apps

    -- Book fields
    size        VARCHAR(20),  -- human-readable, NULL for non-books
    author      VARCHAR(255), -- NULL for non-books

    -- Image fields
    dimensions  VARCHAR(20),  -- e.g. '1920 x 1080', NULL for non-images
    alt_text    VARCHAR(500), -- NULL for non-images

    -- Certificate fields
    expiry_date DATE,                -- NULL for non-certificates
    issued_to   VARCHAR(255),        -- NULL for non-certificates
    password    VARCHAR(500)         -- encrypted, NULL for non-certificates
);

-- Indexes
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_segment ON resources(segment);
CREATE INDEX idx_resources_type_segment ON resources(type, segment);
CREATE INDEX idx_resources_name ON resources(name);
CREATE INDEX idx_resources_created ON resources(created DESC);
```

**Alternative approach:** Use separate tables per type (scripts, apps, books, images, certificates) instead of a single polymorphic table. This is cleaner from a database normalization perspective, but the single-table approach is simpler for the API layer and matches the frontend's unified `Resource` type.

---

## 9. Frontend Integration Points

Files that need to be modified to switch from mock data to real API:

| File                                             | Change needed                                          |
|--------------------------------------------------|--------------------------------------------------------|
| `src/resources/composables/useResources.ts`      | Replace all mock data imports with API calls; fetch on mount, handle loading/error states |
| `src/resources/views/CreateScriptView.vue`        | Replace `addResource()` with `POST /resources/` (multipart upload) |
| `src/resources/views/CreateAppView.vue`           | Replace `addResource()` with `POST /resources/` (multipart upload) |
| `src/resources/views/CreateBookView.vue`          | Replace `addResource()` with `POST /resources/` (multipart upload) |
| `src/resources/views/CreateImageView.vue`         | Replace `addResource()` with `POST /resources/` (multipart upload) |
| `src/resources/views/CreateCertificateView.vue`   | Replace `addResource()` with `POST /resources/` (multipart upload) |
| `src/resources/views/ResourcesView.vue`           | Wire download handler to `GET /resources/{id}/download/` |

A new API module should be created: `src/api/resources.ts`

---

## 10. Recommended API Module (Frontend)

```typescript
// src/api/resources.ts
import axios from "axios";

const baseUrl = "/resources";

// List with filters
export async function fetchResources(params: {
  type?: string;
  segment?: string;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: string;
} = {}) {
  const { data } = await axios.get(`${baseUrl}/`, { params });
  return data;
}

// Category counts
export async function fetchResourceCounts() {
  const { data } = await axios.get(`${baseUrl}/counts/`);
  return data;
}

// Single resource
export async function fetchResource(id: string) {
  const { data } = await axios.get(`${baseUrl}/${id}/`);
  return data;
}

// Create (with file upload)
export async function createResource(formData: FormData) {
  const { data } = await axios.post(`${baseUrl}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// Update metadata
export async function updateResource(id: string, payload: object) {
  const { data } = await axios.put(`${baseUrl}/${id}/`, payload);
  return data;
}

// Delete
export async function deleteResource(id: string) {
  await axios.delete(`${baseUrl}/${id}/`);
}

// Download file
export async function downloadResource(id: string): Promise<Blob> {
  const { data } = await axios.get(`${baseUrl}/${id}/download/`, {
    responseType: "blob",
  });
  return data;
}

// Lightweight lists for Policies module dropdowns
export async function fetchAppsList() {
  const { data } = await axios.get(`${baseUrl}/apps/list/`);
  return data;
}

export async function fetchScriptsList() {
  const { data } = await axios.get(`${baseUrl}/scripts/list/`);
  return data;
}

export async function fetchBooksList() {
  const { data } = await axios.get(`${baseUrl}/books/list/`);
  return data;
}

export async function fetchImagesList() {
  const { data } = await axios.get(`${baseUrl}/images/list/`);
  return data;
}

export async function fetchCertificatesList() {
  const { data } = await axios.get(`${baseUrl}/certificates/list/`);
  return data;
}
```

---

## 11. Summary of Required Endpoints

| Method   | Endpoint                         | Content-Type           | Description                              |
|----------|----------------------------------|------------------------|------------------------------------------|
| `GET`    | `/resources/`                    | -                      | List resources (filtered, paginated)     |
| `GET`    | `/resources/counts/`             | -                      | Category counts for sidebar              |
| `GET`    | `/resources/{id}/`               | -                      | Get single resource                      |
| `POST`   | `/resources/`                    | `multipart/form-data`  | Create resource with file upload         |
| `PUT`    | `/resources/{id}/`               | `application/json`     | Update resource metadata                 |
| `DELETE` | `/resources/{id}/`               | -                      | Delete resource and file                 |
| `GET`    | `/resources/{id}/download/`      | -                      | Download resource file                   |
| `GET`    | `/resources/apps/list/`          | -                      | Lightweight app list (for dropdowns)     |
| `GET`    | `/resources/scripts/list/`       | -                      | Lightweight script list (for dropdowns)  |
| `GET`    | `/resources/books/list/`         | -                      | Lightweight book list (for dropdowns)    |
| `GET`    | `/resources/images/list/`        | -                      | Lightweight image list (for dropdowns)   |
| `GET`    | `/resources/certificates/list/`  | -                      | Lightweight cert list (for dropdowns)    |

---

## 12. Cross-Module Dependencies

The Resources module is referenced by the **Policies** module:

- `PolicyApp.resource_id` -> `resources.id` (type = `app`)
- `PolicyScript.resource_id` -> `resources.id` (type = `script`)
- `PolicyResource.resource_id` -> `resources.id` (type = `book` | `image` | `certificate`)

When deleting a resource, the backend should check for active references in the policies tables and either block deletion (`409`) or warn the user.

The lightweight list endpoints (`/resources/apps/list/`, etc.) are consumed by the Policies module's Add App / Add Script / Add Resource dialogs.
