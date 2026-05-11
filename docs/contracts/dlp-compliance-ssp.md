# DLP, Compliance and SSP Contracts

Version: 2026-05-09

This document records the payloads shared by the Windows agent, backend and
frontend for the DLP, Compliance and SSP/Workspace/Container integration. Keep
field names stable across all three repositories unless the corresponding PRs
are updated together.

## Common Rules

- `agent_id` is the canonical device identifier.
- Timestamps are ISO-8601 strings in UTC.
- `details` is a JSON object for feature-specific data and must be safe to log.
- Do not send or store raw passwords, recovery keys, API tokens or private keys.
- File hashes use SHA-256. USB serials and other hardware identifiers should be
  hashed before they are placed in violation details.
- Agent-facing endpoints use the existing agent authentication path. Admin UI
  endpoints use the existing authenticated frontend session.

## Endpoint Map

- DLP policy CRUD: `GET/POST /security/dlp/`, `GET/PATCH /security/dlp/<id>/`
- Effective DLP policies for agent: `GET /security/dlp/?resolve=effective&target_agent_id=<agent_id>`
- Content classification: `POST /security/dlp/classify/`
- DLP report: `GET /security/dlp/report/?period=7d&format=json|csv`
- DLP justification admin queue: `GET/POST /security/dlp/justifications/`
- DLP justification agent flow:
  - `POST /api/v3/dlp/justification/request/`
  - `POST /api/v3/dlp/justification/<id>/resolve/`
  - `GET /api/v3/dlp/justification/<id>/poll/`
- Network DLP config: `GET /api/v3/dlp/network-config/?agent_id=<agent_id>`
- Network DLP health: `POST /security/dlp/network/health/`
- Device health: `GET/POST /security/health/`
- Security incidents and DLP violations: `GET/POST /security/incidents/`
- Compliance policy and status: `/compliance/*`
- Workspace and container operations: `/appmanagement/workspaces/*`
- Container operations: `/appmanagement/workspaces/containers/*`

## DLP Policy

```json
{
  "id": 1,
  "name": "Engineering DLP",
  "enabled": true,
  "file_patterns": ["*.docx", "*.xlsx"],
  "monitored_paths": ["C:\\Users\\*\\Documents"],
  "sensitive_keywords": ["confidential"],
  "regex_patterns": [],
  "block_mode": "monitor|warn|block",
  "alert_on_violation": true,
  "log_violations": true,
  "justification_required": false,
  "network_dlp_enabled": false,
  "email_dlp_enabled": false,
  "blocked_domains": []
}
```

The agent caches effective policy sections in `policy_cache.json` so enforcement
can continue during temporary backend outages. Backend responses should remain
backward-compatible with unknown fields ignored by older agents.

## Compliance Status

```json
{
  "agent_id": "agent-uuid",
  "source_key": "security.bitlocker",
  "status": "compliant|non_compliant|unknown",
  "severity": "low|medium|high|critical",
  "message": "BitLocker is enabled",
  "details": {
    "drive": "C:",
    "encrypted": true
  },
  "checked_at": "2026-05-09T10:00:00Z"
}
```

Agents post check results to `/compliance/checks/`. Backend computes effective
access state through `/compliance/access/<agent_id>/` and effective policy
through `/compliance/effective/<agent_id>/`.

## Agent Command

```json
{
  "func": "force_compliance_sync",
  "timeout": 30,
  "id": 0,
  "payload": {
    "reason": "manual"
  }
}
```

Supported command names for this integration include:

- `force_compliance_sync`
- `restricted_mode_on`
- `restricted_mode_off`
- `unmount_container`
- `revoke_ephemeral_key`
- `applyusbpolicy`
- `revokeusbpolicy`
- `clearpolicies`
- `dlp_quarantine_file`
- `dlp_restore_quarantine`
- `dlp_destroy_quarantine`
- `dlp_justification_required`
- `start_network_dlp`
- `stop_network_dlp`
- `getbitlockerstatus`
- `enablebitlocker`
- `disablebitlocker`
- `escrowbitlockerkey`
- `rotatebitlockerkey`

## Telemetry Event

```json
{
  "agent_id": "agent-uuid",
  "hostname": "WIN-001",
  "health_status": "healthy|partial|broken|offline",
  "cpu_usage": 12.5,
  "memory_usage": 48.0,
  "disk_encrypted": true,
  "details": {
    "dlp_network": {
      "enabled": true,
      "proxy_port": 8877
    }
  },
  "reported_at": "2026-05-09T10:00:00Z"
}
```

## Violation Event

```json
{
  "agent_id": "agent-uuid",
  "incident_type": "dlp_violation|compliance_breach",
  "severity": "low|medium|high|critical",
  "title": "DLP violation",
  "description": "Sensitive content matched a DLP rule",
  "status": "open",
  "details": {
    "violation_type": "keyword_match|pii_detected|usb_transfer|cloud_sync|network_dlp",
    "policy_id": 1,
    "policy_name": "Engineering DLP",
    "file_path": "C:\\Users\\Alice\\Documents\\plan.docx",
    "file_hash": "sha256-hex",
    "action_taken": "logged|warned|blocked|quarantined|justified"
  }
}
```

## SSP, Workspace and Container Command

```json
{
  "container_id": 42,
  "workspace_id": 7,
  "agent_id": "agent-uuid",
  "action": "mount|unmount|rotate_key|backup_key|wipe_files|recover",
  "vhdx_path": "C:\\ProgramData\\LabMDM\\container.vhdx",
  "drive_letter": "G:",
  "paths": ["G:\\CorpData\\file.docx"],
  "reason": "admin_requested"
}
```

Password and recovery material must not be logged. Backend responses should
return operation status, audit identifiers and sanitized error messages only.

## Device Status

```json
{
  "agent_id": "agent-uuid",
  "hostname": "WIN-001",
  "online": true,
  "health_status": "healthy|partial|broken|offline",
  "compliance": {
    "effective_status": "compliant|non_compliant|stale|unknown",
    "access_state": "allowed|grace_period|blocked|quarantined|review",
    "open_violations": 0
  },
  "workspace": {
    "container_state": "mounted|unmounted|error|unknown",
    "restricted_mode": false
  }
}
```

