#!/usr/bin/env bash
# Refresh the daily JWT for the Wazuh MCP server and update the local
# Claude Code MCP registration.
#
# JWT TTL is hardcoded to 24h in gensecaihq/Wazuh-MCP-Server (see
# TASK-wazuh-mcp.md §12.1), so this needs to run roughly once per day.
# Wire to launchd/cron, or run by hand. Safe to re-run.
#
# The MCP_API_KEY is read on the staging server (mode-600 bootstrap env),
# never crosses the network in plaintext, and never lands on the dev box.

set -euo pipefail

STAGING_HOST="${WAZUH_MCP_STAGING:-root@95.142.35.174}"
BOOTSTRAP_ENV="${WAZUH_MCP_BOOTSTRAP_ENV:-/root/.wazuh-mcp-bootstrap.env}"
MCP_NAME="${WAZUH_MCP_NAME:-wazuh}"
MCP_URL="${WAZUH_MCP_URL:-http://localhost:3001/mcp}"
MCP_AUTH_URL="${WAZUH_MCP_AUTH_URL:-http://127.0.0.1:3001/auth/token}"

command -v claude >/dev/null || { echo "!! claude CLI not on PATH" >&2; exit 2; }
command -v ssh    >/dev/null || { echo "!! ssh not on PATH"    >&2; exit 2; }

echo ">> Fetching JWT from $STAGING_HOST"
NEW_JWT=$(ssh -o ClearAllForwardings=yes "$STAGING_HOST" "
  set -e
  . '$BOOTSTRAP_ENV'
  curl -fsS -X POST '$MCP_AUTH_URL' \
    -H 'Content-Type: application/json' \
    -d \"{\\\"api_key\\\":\\\"\$MCP_API_KEY\\\"}\" \
  | jq -r .access_token
")

if [[ -z "$NEW_JWT" || "$NEW_JWT" == "null" ]]; then
  echo "!! Failed to obtain JWT (empty or null response)" >&2
  exit 1
fi

echo ">> Updating local Claude Code MCP registration ($MCP_NAME)"
claude mcp remove "$MCP_NAME" >/dev/null 2>&1 || true
claude mcp add --transport http "$MCP_NAME" "$MCP_URL" \
  --header "Authorization: Bearer $NEW_JWT" >/dev/null

echo ">> Done. JWT installed (length=${#NEW_JWT}). Restart Claude Code to load MCP tools into the session."
