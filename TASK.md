# Task: Reporting UI with feature parity to OpenSearch Dashboards Reports plugin

> **Self-contained brief for the next agent.** No prior chat context required.
> Read this file end-to-end before writing any code.

---

## 1. Project context

- **Repo:** `web-tactical` — Vue 3 + Quasar 2 + TypeScript + Pinia whitelabel UI
  replacing classic Wazuh Dashboard (OSD).
- **Working directory:** `/Users/nikitakrasovskij/prod/web-tactical/`
- **Active branch for this task:** `feat/discover-saved-search-reporting`.
  An earlier change on this branch added Discover Saved Search + on-demand
  CSV/XLSX/PDF export — **leave that code intact**, build the new feature
  alongside.
- **Backend stack:** TacticalRMM (Django) + gRPC services + direct access to
  OpenSearch (Wazuh Indexer) via nginx proxy.

**Goal:** recreate the UI and functionality of the OpenSearch Dashboards
Reports plugin (the "Reporting" section in Wazuh Dashboard) inside this
whitelabel app. The user only sees our UI; OSD is used **only** as a
scheduling/rendering engine via REST API.

Visual consistency is required — Quasar components, existing CSS variables
`--mdm-*`, our `notifySuccess` / `notifyError` helpers from
`src/utils/notify.ts`. The word "Wazuh", "OpenSearch Dashboards", "Kibana"
must not appear anywhere in the UI.

---

## 2. Architecture

```
[Our Vue UI: Security → Reporting]
       ↓ HTTP via /api/wazuh-dashboard/* (nginx proxy injects basic auth + osd-xsrf)
[OpenSearch Dashboards + Reports plugin]
       ↓ internal scheduler
       ↓ renders PDF / CSV / PNG
       ↓ delivers via OSD Notifications channel (email)
```

The user **never opens an iframe**. Everything is REST-driven through the
existing `/api/wazuh-dashboard/` proxy.

**Auth:** the proxy in `quasar.config.js` already injects
`Authorization: Basic ...` and `osd-xsrf: true` headers. Do not duplicate
auth on the client. Do not expose any indexer credentials in the bundle.

---

## 3. Files to read before coding

Internalize the patterns in these files first:

| File | Why |
|------|-----|
| `quasar.config.js` (proxy section ~line 100–200) | `/api/wazuh-dashboard/*` proxy with basic auth — already wired |
| `src/api/wazuhDashboard.ts` | Existing axios client to OSD; extend with new methods |
| `src/views/security/reporting/ReportsListView.vue` | Existing reports list (Wazuh plugin); to be wrapped or replaced |
| `src/components/security/reporting/GenerateReportButton.vue` | On-demand generation via Wazuh plugin — **separate flow, do not break** |
| `src/stores/savedSearches.ts` | Pinia + storage abstraction (Local + Indexer + Hybrid). Mirror this shape for `reportDefinitions` |
| `src/stores/discover.ts` | Pinia conventions, query building |
| `src/utils/notify.ts` | Use `notifySuccess` / `notifyError`, not `Notify.create` directly |
| `src/components/security/reporting/DiscoverExportModal.vue` | Quasar dialog/form template |
| `src/router/` | How routes are registered |
| `src/config/navigation.ts` (or analogue) | Sidebar entries |
| `app.sass` / any `.vue` file | Reference for `--mdm-*` CSS variables (colors, radii, shadows) |

---

## 4. Business feature breakdown — ship sequentially

Each feature stands alone — if delivery stops at feature N, the user still
gets value. **Ship 1 → 2 → 3 to close the original ask.** Features 4–6 are
improvements.

### Feature 1 — "I see my reports" (read-only history) · ~1 day

**User value:** see previously generated reports and download them.

**Scope:**
- Page `Security → Reporting → Reports`
- List from `GET /api/wazuh-dashboard/api/reporting/reports`
- Columns: Name, Source, Type, Creation time, State, Download
- Search input, Refresh button

**DoD:** someone generates a report directly via Wazuh UI on the test stand
→ it shows up and downloads correctly in our UI.

**Why first:** smoke-tests proxy + auth + data availability with minimal
code. If this doesn't work, the rest of the plan is dead — pivot to
backend-cron approach (see §10).

### Feature 2 — "I can generate a report on demand" · ~2 days

**User value:** pick a saved search → click Generate → 30 s later the PDF/CSV
is on disk.

**Scope:**
- "New report" button on the Reports page → modal
- Modal fields: Name, Source = Saved search only, dropdown of saved searches,
  Time range presets, Format (PDF/CSV), Trigger = On demand only
- POST to `/api/reporting/reportDefinitions` with `trigger_type: "On demand"`
- Immediately POST `/generateReport/{id}`, poll status, when `Shared` add
  the new row to the Reports table

**Out of scope:** Schedule, email, Dashboard/Visualization sources,
header/footer, edit/delete.

**DoD:** user creates a report in 4 clicks; PDF opens cleanly.

### Feature 3 — "I can schedule reports to email" (★ the original ask) · ~2 days

**User value:** "every Monday at 09:00 send me a CSV of syscheck alerts from
the last 7 days."

**Scope:**
- In the "New report" modal (Feature 2) add Trigger: radio On demand /
  Schedule
- When Schedule: presets (Hourly / Daily 09:00 / Weekly Mon 09:00 /
  Monthly 1st 09:00)
- Recipients dropdown — pulled from
  `GET /api/_plugins/_notifications/configs?config_type=email`
  (channels are created in OSD UI ahead of time; we only pick from the list)
- Start time + timezone

**Out of scope:** custom cron expressions (presets only), multiple channels
per report, header/footer, edit.

**DoD:** schedule fires and the email actually lands with PDF attachment.

**Stop here to close the original request.** Everything below is polish.

### Feature 4 — "I can manage schedules" · ~1 day

Edit, delete, Run now, toggle Active/Disabled — without recreating.

- Second page `Security → Reporting → Definitions`
- Lists `/api/reporting/reportDefinitions/_search`
- Actions: Edit (re-uses Feature 3 modal in edit mode), Delete (confirm),
  Run now, toggle status
- Edit pre-fill via `GET /api/reporting/reportDefinitions/{id}`

### Feature 5 — "Reports from dashboards / visualizations" · ~1.5 days

Add Dashboard and Visualization to the Source radio.
- `GET /api/saved_objects/_find?type=dashboard|visualization`
- Format becomes PDF/PNG (CSV removed — irrelevant)
- Payload uses `dashboard_id` / `visualization_id` instead of `saved_search_id`

Defer until users ask.

### Feature 6 — Polish · ~1 day

- Markdown header/footer (Write/Preview tabs, `marked` + DOMPurify)
- Custom cron string with `cron-parser` validation
- Type/State filters in tables
- Description field
- i18n if the project has the infra

---

## 5. New files to create

```
src/types/reportDefinition.ts          # types mirroring OSD plugin schema
src/api/reportingPlugin.ts             # axios wrapper for /api/wazuh-dashboard/api/reporting/*
src/api/savedObjects.ts                # GET /api/saved_objects/_find
src/api/notificationsPlugin.ts         # GET /_plugins/_notifications/configs

src/stores/reportDefinitions.ts        # Pinia: list / get / create / update / delete / runNow
src/stores/reportInstances.ts          # Pinia: history of generated reports

src/components/security/reporting/
  ReportDefinitionFormView.vue         # Create/Edit form (Feature 2-3)
  ReportDefinitionsTable.vue           # Definitions table (Feature 4)
  ReportInstancesTable.vue             # History table (Feature 1)
  ReportSourceSelector.vue             # Source-type-aware dropdown
  ReportScheduleEditor.vue             # Recurring / Cron section
  ReportHeaderFooterEditor.vue         # Markdown editor (Feature 6)
  ReportTimeRangeSelector.vue          # Presets + custom range

src/views/security/reporting/
  ReportDefinitionsListView.vue        # Page 2
  ReportingHubView.vue                 # Tab container: Reports | Definitions
```

The existing `ReportsListView.vue` is either extended or wrapped inside
`ReportingHubView` as one of the tabs.

---

## 6. Routes (Vue Router)

```ts
{ path: '/security/reporting', name: 'SecurityReporting', component: ReportingHubView }
{ path: '/security/reporting/definitions/new', name: 'ReportDefinitionCreate', component: ReportDefinitionFormView }
{ path: '/security/reporting/definitions/:id/edit', name: 'ReportDefinitionEdit', component: ReportDefinitionFormView, props: true }
```

History mode — make sure refreshing on a deep route still resolves (nginx
fallback to `index.html` should already be configured in the proxy).

---

## 7. OSD endpoints reference

All paths are prefixed with `/api/wazuh-dashboard` (the proxy strips it).

| Purpose | Method | Path |
|---|---|---|
| List report definitions | GET | `/api/reporting/reportDefinitions/_search` |
| Get one definition | GET | `/api/reporting/reportDefinitions/{id}` |
| Create definition | POST | `/api/reporting/reportDefinitions` |
| Update definition | PUT | `/api/reporting/reportDefinitions/{id}` |
| Delete definition | DELETE | `/api/reporting/reportDefinitions/{id}` |
| List report instances | GET | `/api/reporting/reports` |
| Run on-demand | POST | `/api/reporting/generateReport/{definitionId}` |
| Download instance | GET | `/api/reporting/reports/{id}/download` |
| Saved searches | GET | `/api/saved_objects/_find?type=search&perPage=1000` |
| Dashboards | GET | `/api/saved_objects/_find?type=dashboard&perPage=1000` |
| Visualizations | GET | `/api/saved_objects/_find?type=visualization&perPage=1000` |
| Notification channels | GET | `/api/_plugins/_notifications/configs?config_type=email` |

### Sample `POST /api/reporting/reportDefinitions` payload

Saved search + Schedule + email delivery:

```json
{
  "report_params": {
    "report_name": "Daily syscheck",
    "report_source": "Saved search",
    "description": "Daily file integrity report",
    "core_params": {
      "saved_search_id": "<uuid>",
      "report_format": "csv",
      "time_duration": "PT24H",
      "limit": 10000,
      "excel": true
    }
  },
  "trigger": {
    "trigger_type": "Schedule",
    "trigger_params": {
      "enabled": true,
      "enabled_time": 1745740800000,
      "schedule_type": "Recurring",
      "schedule": {
        "interval": {
          "period": 1,
          "unit": "Days",
          "start_time": 1745740800000
        }
      }
    }
  },
  "delivery": {
    "configIds": ["<email-channel-id>"],
    "title": "Your report is ready",
    "textDescription": "Daily syscheck report attached",
    "htmlDescription": "<p>Daily syscheck report attached</p>"
  },
  "time_created": 1745740800000,
  "last_updated": 1745740800000
}
```

For Dashboard / Visualization sources the `core_params` carries
`dashboard_id` or `visualization_id` instead of `saved_search_id`, and
`excel` is omitted.

---

## 8. Conventions and constraints

- **TypeScript strict** — match the rest of the codebase
- **Notifications** — use `notifySuccess` / `notifyError` from `src/utils/notify.ts`,
  not `Notify.create` directly
- **CSS variables** `--mdm-*` (colors, radii, shadows) — they're used
  everywhere; check `app.sass` and existing `.vue` files
- **No hardcoded URLs** — go through the axios clients
- **No credentials on the frontend** — the proxy handles auth
- **Whitelabel** — never write "Wazuh", "OpenSearch Dashboards", "Kibana"
  in user-visible strings. Module names: "Reporting", "Report definitions",
  "Reports".
- **Lint** — `npm run lint` must pass. `npm run build` must succeed without
  warnings on new files.

---

## 9. Important gotchas

1. **Reports plugin endpoints have no CORS issues** — same-origin via the proxy
2. **`osd-xsrf: true`** is already injected by the proxy — don't add it
   manually
3. **Notification channel must be created in OSD UI in advance.** The UI for
   creating channels is **out of scope**; pick from existing list. If the
   list is empty, surface a clear error message: "No email channels
   configured. Ask your admin to create one."
4. **Saved searches must live in OSD's `.kibana` index** for Reports plugin
   to use them. The custom `mdm-saved-searches` index used by our Discover
   feature is **a separate store** — it's not visible to the Reports plugin.
   This is a known architectural limit. UI tooltip: "Saved searches managed
   in the dashboards module."
5. **Cron expressions** — OSD expects Quartz cron (6 fields), not Unix cron.
   Use `cron-parser` for validation/human-readable rendering.
6. **Time zones** — OSD uses Java TZ format (e.g. `America/Los_Angeles`).
   Provide a dropdown from `Intl.supportedValuesOf("timeZone")`.

---

## 10. Risk checks before starting

If any of these fail, the plan is not viable — pivot to a backend-cron
approach (Django + Celery, mirrored OpenSearch query, server-side render).

| Risk | When to verify | How |
|---|---|---|
| OSD Reports plugin unreachable through the proxy | Before Feature 1 | `curl /api/wazuh-dashboard/api/reporting/reports` from DevTools network tab |
| No email channel / SMTP not configured | Before Feature 3 | Wazuh Dashboard → Notifications → Channels — at least one Active |
| No saved searches in `.kibana` | Before Feature 2 | Wazuh Dashboard → Discover → Save → object exists |
| Reports plugin version mismatch | Before Feature 2 | `GET /api/_plugins/_notifications/configs` — sanity-check shape |

**Recommended first step:** ship Feature 1 as a 4-hour PoC. It exercises
proxy, auth, and data availability simultaneously. If it lands, proceed
with confidence.

---

## 11. Open questions to confirm with the requester

Before starting Feature 3 (the form):

1. **Markdown in header/footer** — full (`marked` + DOMPurify) or MVP plain
   textarea?
2. **Notebook source** — keep in the radio or hide? (depends on whether
   Notebook plugin is in the OSD stack)
3. **Default notification channel** — hardcode a default ID, or always pick
   from the list?
4. **Deploy state** — is the Saved Search feature live on prod? If not,
   priority is to fix the deploy first. Known issue: `npm run build` was
   OOM'ing at the Node 2 GB heap limit; fix is `NODE_OPTIONS=--max-old-space-size=4096`
   plus `set -euo pipefail` in `.github/workflows/deploy-*.yml` (already
   committed in `bde394c` on this branch).

---

## 12. Definition of Done

- [ ] All three pages plus the form work through the proxy
- [ ] Creating a Schedule definition with email delivery → the report
      actually arrives in the inbox after 5 minutes (or on cron)
- [ ] Run-now generates an instance that appears in the Reports tab
- [ ] Edit pre-fills the form correctly
- [ ] Delete asks for confirmation and removes the row
- [ ] Source dropdowns load the right `saved_objects` per type
- [ ] Lint + typecheck clean on new files
- [ ] No "Wazuh" / "OSD" / "Kibana" strings in any user-visible text
- [ ] Routes survive an F5 refresh (history mode)
- [ ] PR opened against `feat/discover-saved-search-reporting` (or new
      branch `feat/reporting-ui-parity`)

---

## 13. Suggested phasing for a single developer

```
Day 0 (½ day) — Risk check (Feature 1 PoC)
Day 1         — Feature 1 finished + Feature 2 form skeleton
Day 2-3       — Feature 2 (on-demand)
Day 4-5       — Feature 3 (scheduling + email) ★ ship and call it done
Day 6         — Feature 4 (manage schedules) — optional
Day 7-8       — Feature 5 (dashboards) — optional
Day 9         — Feature 6 (polish) — optional
```

For two developers in parallel: dev A does 1 → 2 → 3, dev B starts 4 after
1 lands.

---

**Begin with §10 risk check, then Feature 1. Read §3 before writing any
code.**
