# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Frontend for MDM-labs (Tactical RMM fork) — a Quasar 2 / Vue 3 SPA with a Vuex + Pinia mixed store, an Axios REST layer, a separate gRPC-Web layer for the GPO (Group Policy Operator) module, and a Wazuh-backed security suite. Targets ES2022 / Node 20.

## Commands

```bash
npm run serve         # quasar dev — dev server (uses .env, proxies /api, /api/grpc, /wazuh-dashboard)
npm run build         # quasar build — production bundle to dist/
npm run lint          # eslint ./ (CI runs with --max-warnings=0)
npm run format        # prettier --write across all source

# Regenerate gRPC-Web client + post-process for ES6 imports.
# Linux/CI uses proto:generate; on macOS use proto:generate:mac (adds /opt/homebrew/bin to PATH for protoc).
npm run proto:generate
npm run proto:generate:mac
```

There is no test runner configured. CI is GitHub Actions: `frontend-linting.yml` (format + lint on develop), `build-release.yml` (tag `v*.*.*` builds tarball), and `deploy-*.yml` for stage/prod.

`.env` (see `.env.example`) is loaded by `quasar.config.js` via `dotenv`. Useful keys: `DEV_URL` (REST backend), `DEV_GRPC_URL` (mesh gRPC-Web), `DEV_WAZUH_DASHBOARD_URL`/`USER`/`PASS` (OSD Alerting proxy), `DEV_HOST`/`DEV_PORT`, `USE_HTTPS`, `USE_PROXY` (default true → uses Vite proxy to bypass CORS), `USE_PROXY_INSECURE=true` (accept self-signed certs).

## Architecture

### Three independent backends, three dev proxies
The dev proxy table in `quasar.config.js` is the canonical reference for how the frontend reaches its backends:
- `/api` → REST (Tactical RMM Django backend). Axios `baseURL` is `/api` in dev (proxy) and `window._env_.PROD_URL` in prod.
- `/api/grpc` → gRPC-Web (mesh / GPO services). Content-Type forced to `application/grpc-web+proto` on both directions.
- `/wazuh-dashboard` → OpenSearch Dashboards (Wazuh Alerting). The proxy injects HTTP Basic Auth and the `osd-xsrf` header server-side; **never put OSD credentials into client code**.

### Runtime config injection (production)
There are no env vars in the bundle. `index.html` loads `env-config.js`, which is generated at container startup by `docker/containers/mdmlabs-frontend/entrypoint.sh` from `API_URL` / `GRPC_API_URL`, and read back via `window._env_.PROD_URL` in `src/boot/axios.js`. The build step just `touch`es the file so the import doesn't 404 — see `.github/workflows/build-release.yml`.

### Bootstrap order (`quasar.config.js` → `boot: [pinia, axios, monaco, integrations]`)
1. `boot/pinia.ts` registers Pinia.
2. `boot/axios.js` installs the request interceptor (inject `Authorization: Token <token>` from `useAuthStore`, set `baseURL`) and the response interceptor (401 → `router.push("/expired")`, 403/4xx → Quasar `Notify`, 423 silenced). Most API modules just `import axios from "axios"` and rely on this global config.
3. `boot/monaco.ts` registers Monaco editor.
4. `boot/integrations.ts` exposes `app.config.globalProperties.$integrations` slots (file bar / client / site / agent menus) — extension points for downstream forks; default arrays are empty.

### Stores: Vuex AND Pinia coexist
- `src/store/index.js` is the **legacy Vuex store** and is still load-bearing. It owns the client/site tree, the agent list, dashboard color settings, and global UI state (splitters, sidebar). When touching agents or the tree, expect Vuex commits/dispatches.
- `src/stores/*.ts` are **Pinia stores** for newer features: `auth`, `agents`, `clients`, the security suite (`alerting`, `discover`, `fim`, `sca`, `threatHunting`, `vulnerability`, `wazuh`, `savedSearches`), and compliance frameworks (`gdpr`, `hipaa`, `nist80053`, `pciDss`, `tsc`).
- New code should use Pinia. Don't migrate existing Vuex usage opportunistically — the tree/agent flows are deeply integrated.

### Routing & auth
`src/router/routes.js` defines a single `MainLayout` with all authenticated children. Auth gate is in `src/router/index.js` (`beforeEach`): routes with `meta.requireAuth` redirect to `/login` when `useAuthStore().loggedIn` is false; the token lives in localStorage via `@vueuse/core`'s `useStorage`. History mode is enabled (Nginx must fall back to `/index.html` — see `docker/containers/mdmlabs-frontend/nginx.conf`).

### GPO / gRPC-Web module (`src/gpo/`)
Self-contained subtree with its own `api/`, `components/`, `composables/`, `types/`, `views/`, plus `.proto` sources under `src/gpo/proto/`. The `proto:generate` script runs `protoc` + `grpc-web` plugin and then `scripts/post-process-proto.js` rewrites the generated files into ES6 modules with named exports (the raw output uses `goog.exportSymbol` and won't tree-shake). Output lands in **`src/generated/`** which is git-ignored and ESLint-ignored (`.eslintrc.js: ignorePatterns`). Always regenerate after editing `.proto` files; never hand-edit generated output. Specs: `docs/policies-backend-spec.md`, `docs/resources-backend-spec.md`.

### Security suite (`src/views/security/`, `src/api/wazuh*.ts`)
Backed by Wazuh (Manager API, Indexer, Dashboard/OSD Alerting, Reporting). Each backend has its own axios client with its own auth lifecycle (`tokenGetter` / `ensureAuthFn` / `onAuthFailFn`) — they are not the same as the main REST axios. The `ComplianceHub` view dispatches to per-framework views (GDPR/HIPAA/NIST80053/PCI-DSS/TSC), each with its own Pinia store hitting the indexer.

### Feature areas (top-level under `src/`)
Each area follows the same `views/ + components/ + composables/ + types/` shape: `agent-updates/`, `resources/`, `policies/`, `gpo/`, `reports/`, `ee/` (paid features under separate `LICENSE.md` — `ee/reporting`, `ee/sso`), plus the security suite under `views/security/`. The agent main UI lives at the root: `views/AgentView.vue`, `components/AgentTable.vue`, `views/DashboardView.vue`.

### Path aliases
`@/*` → `src/*` (configured in both `quasar.config.js` build alias and `tsconfig.json` paths). `tsconfig.json` also defines `components/*`, `layouts/*`, `boot/*`, `store/*`, `assets/*` shortcuts. JS and TS coexist freely; don't convert files just to convert them.

### Lint scope
`.eslintignore` and `.eslintrc.js` both exclude `src/generated/**/*`. Rules are TS recommended + `vue/vue3-essential` + Prettier. Quotes are double; `--max-warnings=0` in CI means warnings fail the build.

## Things to avoid

- Don't add credentials or secrets to anything that ships to the client; Wazuh Dashboard auth is handled server-side by the dev proxy and by Nginx in prod.
- Don't import from `src/generated/` paths that don't exist yet — run `proto:generate` first.
- Don't mix `process.env.PROD_API` and `window._env_.PROD_URL`; production always reads the latter (see `getBackendUrl` / `getBaseUrl` in `boot/axios.js`).
- The `xlsx` and `jspdf` dependencies are large; existing code lazy-loads `jspdf` (see recent commit `fix(build,deploy): lazy-load jspdf`). Match that pattern for new heavy deps.
