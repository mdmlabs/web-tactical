  # Policies Module - Backend Technical Specification

## 1. Overview

The Policies module manages file delivery policies for Windows devices. Each policy is a configuration container that groups **Apps**, **Scripts**, **Resources** (books, certificates, images), **Application Control** settings, and **Device assignments**. The frontend is fully implemented with mock data and needs a real REST API backend.

**Frontend location:** `src/policies/`

**Existing backend patterns in the project:**
- REST API via Axios (`/agents/`, `/accounts/`, `/clients/`, etc.) - Django-style URL trailing slashes
- gRPC Web API for GPO policies (`operator.proto`, `PolicyCatalogService`, etc.)
- Bearer token authentication (`Authorization: Bearer <token>`)

The Policies module should use the **REST API** approach (Axios), consistent with the majority of the platform's modules.

---

## 2. Data Model

### 2.1 Policy

| Field                | Type            | Description                                            | Constraints                      |
|----------------------|-----------------|--------------------------------------------------------|----------------------------------|
| `id`                 | UUID (string)   | Unique identifier                                      | Auto-generated, PK               |
| `name`               | string          | Policy name                                            | Required, max 255 chars           |
| `platform`           | enum            | Target platform                                        | `windows` \| `apple` \| `android` |
| `version`            | integer         | Policy version, auto-increments on save                | Default: 1, read-only            |
| `segment`            | string          | Segment/region scope                                   | One of: `Global`, `Europe`, `North America`, `Asia Pacific`, `Development`, `Production` |
| `device_count`       | integer         | Count of assigned devices (computed)                   | Read-only                        |
| `summary`            | string          | Auto-generated text summary, e.g. "1 app, 2 scripts"  | Read-only                        |
| `created`            | datetime (ISO)  | Creation timestamp                                     | Auto, read-only                  |
| `updated`            | datetime (ISO)  | Last modification timestamp                            | Auto on save                     |

### 2.2 PolicyApp (nested under Policy)

| Field            | Type         | Description                                   | Constraints         |
|------------------|-------------|-----------------------------------------------|---------------------|
| `id`             | UUID         | Unique identifier                              | Auto-generated, PK  |
| `policy_id`      | UUID (FK)    | Parent policy                                  | Required             |
| `resource_id`    | UUID (FK)    | Reference to Resource (app type)               | Required             |
| `name`           | string       | Display name (copied from Resource at creation)| Required             |
| `version`        | string       | App version (copied from Resource)             | Required             |
| `silent_install`  | boolean      | Install silently                               | Default: true        |
| `arguments`      | string       | Installation CLI arguments                     | Optional, default: "" |
| `timeout`        | integer      | Timeout in seconds                             | Default: 900         |
| `run_as_user`    | boolean      | Run installation as user context               | Default: false       |
| `verification`   | JSON object  | Verification configuration (see 2.2.1)         | Required             |

#### 2.2.1 Verification Config (JSON field or sub-model)

```json
{
  "method": "registry" | "file_exists" | "script",
  "registry_path": "HKLM\\SOFTWARE\\...",   // only if method=registry
  "registry_key": "Version",                 // only if method=registry, optional
  "file_path": "C:\\Program Files\\...",     // only if method=file_exists
  "script_id": "<uuid>"                      // only if method=script
}
```

### 2.3 PolicyScript (nested under Policy)

| Field          | Type       | Description                           | Constraints         |
|----------------|-----------|---------------------------------------|---------------------|
| `id`           | UUID       | Unique identifier                      | Auto-generated, PK  |
| `policy_id`    | UUID (FK)  | Parent policy                          | Required             |
| `resource_id`  | UUID (FK)  | Reference to Resource (script type)    | Required             |
| `name`         | string     | Display name (copied from Resource)    | Required             |
| `timeout`      | integer    | Execution timeout in seconds           | Default: 300         |
| `run_as_user`  | boolean    | Run as user context                    | Default: false       |

### 2.4 PolicyResource (nested under Policy)

| Field          | Type          | Description                        | Constraints                     |
|----------------|--------------|------------------------------------|---------------------------------|
| `id`           | UUID          | Unique identifier                   | Auto-generated, PK              |
| `policy_id`    | UUID (FK)     | Parent policy                       | Required                         |
| `resource_id`  | UUID (FK)     | Reference to Resource               | Required                         |
| `name`         | string        | Display name (copied from Resource) | Required                         |
| `type`         | enum          | Resource type                       | `book` \| `certificate` \| `image` |
| `scope`        | enum          | Deployment scope                    | `primary_user` \| `all_users` \| `system` |
| `locations`    | string[]      | Array of file system paths          | At least one path recommended    |

### 2.5 ApplicationControl (embedded in Policy or separate table)

| Field          | Type       | Description                          | Constraints          |
|----------------|-----------|--------------------------------------|----------------------|
| `policy_id`    | UUID (FK)  | Parent policy                        | Required, unique      |
| `tokens`       | string[]   | Application control token IDs        | Optional              |

### 2.6 Device (already exists in the system)

The frontend expects these fields from the devices endpoint:

| Field             | Type       | Description              |
|-------------------|-----------|--------------------------|
| `id`              | UUID       | Device identifier         |
| `name`            | string     | Device hostname           |
| `segment`         | string     | Segment                   |
| `battery`         | integer    | Battery level (0-100)     |
| `employee`        | string     | Assigned employee name    |
| `policies_count`  | integer    | Number of assigned policies |
| `updated`         | datetime   | Last seen/updated         |

### 2.7 DeviceGroup (already exists in the system)

| Field          | Type     | Description            |
|----------------|---------|------------------------|
| `id`           | UUID     | Group identifier        |
| `name`         | string   | Group name              |
| `device_count` | integer  | Number of devices       |

---

## 3. API Endpoints

Base URL: `/policies/`

Authentication: `Authorization: Bearer <token>` (same as all other REST endpoints).

### 3.1 Policies CRUD

#### `GET /policies/`

List all policies with filtering.

**Query Parameters:**

| Param      | Type    | Description                                |
|------------|--------|--------------------------------------------|
| `platform` | string  | Filter by platform (e.g. `windows`)        |
| `segment`  | string  | Filter by segment (e.g. `Global`)          |
| `search`   | string  | Search by name or summary (case-insensitive) |
| `page`     | integer | Page number (default: 1)                    |
| `per_page` | integer | Items per page (default: 20)                |

**Response: `200 OK`**

```json
{
  "count": 42,
  "results": [
    {
      "id": "uuid",
      "name": "eyble3",
      "platform": "windows",
      "version": 2,
      "segment": "Global",
      "device_count": 0,
      "summary": "1 app",
      "created": "2026-02-28T10:00:00Z",
      "updated": "2026-02-28T18:00:00Z"
    }
  ]
}
```

**Notes:** The list endpoint does NOT need to return nested apps/scripts/resources. Only summary data.

---

#### `POST /policies/`

Create a new policy.

**Request Body:**

```json
{
  "name": "My Policy",
  "platform": "windows"
}
```

**Response: `201 Created`**

```json
{
  "id": "uuid",
  "name": "My Policy",
  "platform": "windows",
  "version": 1,
  "segment": "Global",
  "device_count": 0,
  "summary": "",
  "created": "2026-03-05T12:00:00Z",
  "updated": "2026-03-05T12:00:00Z",
  "apps": [],
  "scripts": [],
  "resources": [],
  "application_control": { "tokens": [] },
  "assigned_devices": []
}
```

---

#### `GET /policies/{id}/`

Get full policy detail with all nested data.

**Response: `200 OK`**

```json
{
  "id": "uuid",
  "name": "eyble3",
  "platform": "windows",
  "version": 2,
  "segment": "Global",
  "device_count": 0,
  "summary": "1 app",
  "created": "2026-02-28T10:00:00Z",
  "updated": "2026-02-28T18:00:00Z",
  "apps": [
    {
      "id": "uuid",
      "resource_id": "uuid",
      "name": "Google Chrome",
      "version": "122.0.6261.69",
      "silent_install": true,
      "arguments": "/silent /install",
      "timeout": 900,
      "run_as_user": false,
      "verification": {
        "method": "registry",
        "registry_path": "HKLM\\SOFTWARE\\Google\\Chrome",
        "registry_key": "Version"
      }
    }
  ],
  "scripts": [],
  "resources": [],
  "application_control": {
    "tokens": []
  },
  "assigned_devices": ["device-uuid-1", "device-uuid-2"]
}
```

---

#### `PUT /policies/{id}/`

Full update of policy. Auto-increments `version`. Updates `updated` timestamp.

**Request Body:** Same structure as GET response (without read-only fields `id`, `created`, `version`, `device_count`).

```json
{
  "name": "eyble3-updated",
  "segment": "Europe",
  "apps": [ ... ],
  "scripts": [ ... ],
  "resources": [ ... ],
  "application_control": { "tokens": ["token-1"] },
  "assigned_devices": ["device-uuid-1"]
}
```

**Response: `200 OK`** - Returns full updated policy.

**Backend logic:**
- Increment `version` by 1
- Set `updated` to current time
- Recalculate `summary` (e.g. "1 app, 2 scripts")
- Recalculate `device_count` from `assigned_devices` length
- Replace nested collections: the frontend sends the complete lists of apps/scripts/resources; the backend should diff and update accordingly (or simply replace)

---

#### `DELETE /policies/{id}/`

Delete a policy and all its nested data.

**Response: `204 No Content`**

---

### 3.2 Policy Apps (nested operations)

These endpoints provide item-level operations for granular use (the frontend currently sends the full policy via PUT, but these endpoints allow future optimization).

#### `POST /policies/{id}/apps/`

Add an app to a policy.

**Request Body:**

```json
{
  "resource_id": "uuid",
  "silent_install": true,
  "arguments": "/silent /install",
  "timeout": 900,
  "run_as_user": false,
  "verification": {
    "method": "registry",
    "registry_path": "HKLM\\SOFTWARE\\Google\\Chrome",
    "registry_key": "Version"
  }
}
```

**Backend logic:**
- Look up the Resource by `resource_id` to get `name` and `version`
- Create the PolicyApp record
- Recalculate policy `summary`

**Response: `201 Created`** - Returns the created PolicyApp object.

---

#### `DELETE /policies/{id}/apps/{app_id}/`

Remove an app from a policy.

**Response: `204 No Content`**

---

### 3.3 Policy Scripts (nested operations)

#### `POST /policies/{id}/scripts/`

**Request Body:**

```json
{
  "resource_id": "uuid",
  "timeout": 300,
  "run_as_user": false
}
```

**Backend logic:** Look up Resource by `resource_id` to get `name`.

**Response: `201 Created`**

---

#### `DELETE /policies/{id}/scripts/{script_id}/`

**Response: `204 No Content`**

---

### 3.4 Policy Resources (nested operations)

#### `POST /policies/{id}/resources/`

**Request Body:**

```json
{
  "resource_id": "uuid",
  "type": "book",
  "scope": "primary_user",
  "locations": ["/path/to/destination"]
}
```

**Backend logic:** Look up Resource by `resource_id` to get `name`.

**Response: `201 Created`**

---

#### `DELETE /policies/{id}/resources/{resource_id}/`

**Response: `204 No Content`**

---

### 3.5 Device Assignment

#### `POST /policies/{id}/assign/`

Assign devices to a policy.

**Request Body:**

```json
{
  "device_ids": ["device-uuid-1", "device-uuid-2"]
}
```

**Backend logic:**
- Add device IDs to the policy's assigned devices (merge, don't duplicate)
- Update `device_count`

**Response: `200 OK`** - Returns updated `assigned_devices` list and `device_count`.

---

#### `POST /policies/{id}/unassign/`

Remove a device from a policy.

**Request Body:**

```json
{
  "device_id": "device-uuid-1"
}
```

**Response: `200 OK`**

---

### 3.6 Available Resources (for dropdown selectors)

The frontend needs endpoints to list available resources that can be added to a policy. These may already exist in the Resources module backend. The frontend currently expects:

#### `GET /resources/apps/`

```json
[
  { "id": "uuid", "name": "Google Chrome", "version": "122.0.6261.69", "extension": "msi" }
]
```

#### `GET /resources/scripts/`

```json
[
  { "id": "uuid", "name": "Cleanup Temp Files", "language": "PowerShell" }
]
```

#### `GET /resources/books/`

```json
[
  { "id": "uuid", "name": "Employee Handbook 2026", "extension": "pdf" }
]
```

#### `GET /resources/images/`

```json
[
  { "id": "uuid", "name": "Company Logo", "extension": "png" }
]
```

#### `GET /resources/certificates/`

```json
[
  { "id": "uuid", "name": "Root CA Certificate", "extension": "cer" }
]
```

If these already exist, the frontend dialog components will use them directly. If not, they need to be created.

---

### 3.7 Devices (for assignment dialog)

#### `GET /devices/`

List devices available for assignment. May already exist.

```json
[
  {
    "id": "uuid",
    "name": "DESKTOP-ABC123",
    "segment": "Global",
    "battery": 85,
    "employee": "John Doe",
    "policies_count": 2,
    "updated": "2026-02-28T16:30:00Z"
  }
]
```

#### `GET /device-groups/`

List device groups.

```json
[
  { "id": "uuid", "name": "All devices", "device_count": 150 }
]
```

---

## 4. Frontend-Backend Field Mapping

The frontend uses camelCase; the REST API should use snake_case. The frontend API layer will handle the conversion.

| Frontend (camelCase)     | Backend (snake_case)        |
|--------------------------|-----------------------------|
| `deviceCount`            | `device_count`              |
| `silentInstall`          | `silent_install`            |
| `runAsUser`              | `run_as_user`               |
| `assignedDevices`        | `assigned_devices`          |
| `applicationControl`     | `application_control`       |
| `resourceId`             | `resource_id`               |
| `policyId`               | `policy_id`                 |
| `registryPath`           | `registry_path`             |
| `registryKey`            | `registry_key`              |
| `filePath`               | `file_path`                 |
| `scriptId`               | `script_id`                 |
| `policiesCount`          | `policies_count`            |

---

## 5. Business Logic Requirements

### 5.1 Summary Auto-generation

When apps/scripts/resources change, recalculate `summary`:
```
parts = []
if apps.count > 0: parts.append(f"{apps.count} app{'s' if apps.count > 1 else ''}")
if scripts.count > 0: parts.append(f"{scripts.count} script{'s' if scripts.count > 1 else ''}")
if resources.count > 0: parts.append(f"{resources.count} resource{'s' if resources.count > 1 else ''}")
summary = ", ".join(parts) or "Empty"
```

### 5.2 Version Increment

Every successful save (`PUT /policies/{id}/`) increments `version` by 1.

### 5.3 Device Count

`device_count` is always the length of `assigned_devices`. Recalculate on assignment/unassignment.

### 5.4 Cascading Delete

Deleting a policy removes all associated PolicyApps, PolicyScripts, PolicyResources, ApplicationControl, and device assignments.

### 5.5 Platform Filtering

The list endpoint should respect `platform` filter. Currently only `windows` is enabled on the frontend.

### 5.6 Resource Validation

When adding an app/script/resource to a policy:
- Validate that `resource_id` exists and is of the correct type
- Prevent duplicate resources within the same policy (same `resource_id`)

---

## 6. Error Responses

Standard REST error format consistent with the rest of the platform:

```json
{
  "error": "Policy not found",
  "detail": "No policy with id 'abc-123' exists"
}
```

| Status | Usage                                     |
|--------|-------------------------------------------|
| 400    | Validation error (missing fields, bad enum values) |
| 401    | Not authenticated                          |
| 403    | Forbidden (insufficient permissions)       |
| 404    | Policy/resource/device not found           |
| 409    | Conflict (e.g. duplicate resource in policy) |
| 500    | Internal server error                      |

---

## 7. Frontend Integration Points

Files that need to be modified on the frontend to switch from mock data to real API:

| File                                      | Change needed                                          |
|-------------------------------------------|--------------------------------------------------------|
| `src/policies/composables/usePolicies.ts` | Replace `mockPolicies` with API calls to `GET/POST/PUT/DELETE /policies/` |
| `src/policies/composables/usePolicyDetail.ts` | Replace `getPolicy()` with `GET /policies/{id}/`, save via `PUT /policies/{id}/`, device assignment via POST endpoints |
| `src/policies/components/dialogs/AddAppDialog.vue` | Replace `mockAppResources` and `mockScriptResources` with `GET /resources/apps/` and `GET /resources/scripts/` |
| `src/policies/components/dialogs/AddScriptDialog.vue` | Replace `mockScriptResources` with `GET /resources/scripts/` |
| `src/policies/components/dialogs/AddResourceDialog.vue` | Replace `mockBookResources`, `mockImageResources`, `mockCertificateResources` with `GET /resources/books/`, `GET /resources/images/`, `GET /resources/certificates/` |
| `src/policies/components/dialogs/AssignDeviceDialog.vue` | Replace `mockDevices` and `mockDeviceGroups` with `GET /devices/` and `GET /device-groups/` |

A new API module should be created: `src/api/policies.ts` (or `.js` to match existing convention), following the pattern of `src/api/agents.js`.

---

## 8. Recommended API Module (Frontend)

```typescript
// src/api/policies.ts
import axios from "axios";

const baseUrl = "/policies";

// List
export async function fetchPolicies(params = {}) {
  const { data } = await axios.get(`${baseUrl}/`, { params });
  return data;
}

// Detail
export async function fetchPolicy(id: string) {
  const { data } = await axios.get(`${baseUrl}/${id}/`);
  return data;
}

// Create
export async function createPolicy(payload: { name: string; platform: string }) {
  const { data } = await axios.post(`${baseUrl}/`, payload);
  return data;
}

// Update (full save)
export async function updatePolicy(id: string, payload: object) {
  const { data } = await axios.put(`${baseUrl}/${id}/`, payload);
  return data;
}

// Delete
export async function deletePolicy(id: string) {
  await axios.delete(`${baseUrl}/${id}/`);
}

// Add app
export async function addPolicyApp(policyId: string, payload: object) {
  const { data } = await axios.post(`${baseUrl}/${policyId}/apps/`, payload);
  return data;
}

// Remove app
export async function removePolicyApp(policyId: string, appId: string) {
  await axios.delete(`${baseUrl}/${policyId}/apps/${appId}/`);
}

// Add script
export async function addPolicyScript(policyId: string, payload: object) {
  const { data } = await axios.post(`${baseUrl}/${policyId}/scripts/`, payload);
  return data;
}

// Remove script
export async function removePolicyScript(policyId: string, scriptId: string) {
  await axios.delete(`${baseUrl}/${policyId}/scripts/${scriptId}/`);
}

// Add resource
export async function addPolicyResource(policyId: string, payload: object) {
  const { data } = await axios.post(`${baseUrl}/${policyId}/resources/`, payload);
  return data;
}

// Remove resource
export async function removePolicyResource(policyId: string, resourceId: string) {
  await axios.delete(`${baseUrl}/${policyId}/resources/${resourceId}/`);
}

// Assign devices
export async function assignDevices(policyId: string, deviceIds: string[]) {
  const { data } = await axios.post(`${baseUrl}/${policyId}/assign/`, { device_ids: deviceIds });
  return data;
}

// Unassign device
export async function unassignDevice(policyId: string, deviceId: string) {
  const { data } = await axios.post(`${baseUrl}/${policyId}/unassign/`, { device_id: deviceId });
  return data;
}
```

---

## 9. Database Schema (Reference)

```sql
-- Main policy table
CREATE TABLE policies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    platform    VARCHAR(20) NOT NULL CHECK (platform IN ('windows', 'apple', 'android')),
    version     INTEGER NOT NULL DEFAULT 1,
    segment     VARCHAR(50) NOT NULL DEFAULT 'Global',
    summary     VARCHAR(500) DEFAULT '',
    created     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apps attached to a policy
CREATE TABLE policy_apps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    resource_id     UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    version         VARCHAR(100) NOT NULL,
    silent_install  BOOLEAN DEFAULT TRUE,
    arguments       TEXT DEFAULT '',
    timeout         INTEGER DEFAULT 900,
    run_as_user     BOOLEAN DEFAULT FALSE,
    verification    JSONB NOT NULL DEFAULT '{}',
    UNIQUE (policy_id, resource_id)
);

-- Scripts attached to a policy
CREATE TABLE policy_scripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    resource_id     UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    timeout         INTEGER DEFAULT 300,
    run_as_user     BOOLEAN DEFAULT FALSE,
    UNIQUE (policy_id, resource_id)
);

-- Resources (books, certificates, images) attached to a policy
CREATE TABLE policy_resources (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    resource_id     UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('book', 'certificate', 'image')),
    scope           VARCHAR(20) NOT NULL CHECK (scope IN ('primary_user', 'all_users', 'system')),
    locations       JSONB DEFAULT '[]',
    UNIQUE (policy_id, resource_id)
);

-- Application control config
CREATE TABLE policy_application_control (
    policy_id   UUID PRIMARY KEY REFERENCES policies(id) ON DELETE CASCADE,
    tokens      JSONB DEFAULT '[]'
);

-- Device assignments (many-to-many)
CREATE TABLE policy_device_assignments (
    policy_id   UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    device_id   UUID NOT NULL,
    PRIMARY KEY (policy_id, device_id)
);

-- Index for fast lookups
CREATE INDEX idx_policies_platform ON policies(platform);
CREATE INDEX idx_policies_segment ON policies(segment);
CREATE INDEX idx_policy_apps_policy ON policy_apps(policy_id);
CREATE INDEX idx_policy_scripts_policy ON policy_scripts(policy_id);
CREATE INDEX idx_policy_resources_policy ON policy_resources(policy_id);
CREATE INDEX idx_policy_device_assignments_policy ON policy_device_assignments(policy_id);
CREATE INDEX idx_policy_device_assignments_device ON policy_device_assignments(device_id);
```

---

## 10. Summary of Required Endpoints

| Method   | Endpoint                              | Description                           |
|----------|---------------------------------------|---------------------------------------|
| `GET`    | `/policies/`                          | List policies (filtered, paginated)   |
| `POST`   | `/policies/`                          | Create policy                         |
| `GET`    | `/policies/{id}/`                     | Get policy with all nested data       |
| `PUT`    | `/policies/{id}/`                     | Full update (save) of policy          |
| `DELETE` | `/policies/{id}/`                     | Delete policy                         |
| `POST`   | `/policies/{id}/apps/`                | Add app to policy                     |
| `DELETE` | `/policies/{id}/apps/{app_id}/`       | Remove app from policy                |
| `POST`   | `/policies/{id}/scripts/`             | Add script to policy                  |
| `DELETE` | `/policies/{id}/scripts/{script_id}/` | Remove script from policy             |
| `POST`   | `/policies/{id}/resources/`           | Add resource to policy                |
| `DELETE` | `/policies/{id}/resources/{res_id}/`  | Remove resource from policy           |
| `POST`   | `/policies/{id}/assign/`              | Assign devices to policy              |
| `POST`   | `/policies/{id}/unassign/`            | Unassign a device from policy         |

**Dependencies (may already exist):**

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| `GET`  | `/resources/apps/`        | List available app resources  |
| `GET`  | `/resources/scripts/`     | List available scripts        |
| `GET`  | `/resources/books/`       | List available books          |
| `GET`  | `/resources/images/`      | List available images         |
| `GET`  | `/resources/certificates/`| List available certificates   |
| `GET`  | `/devices/`               | List devices                  |
| `GET`  | `/device-groups/`         | List device groups            |
