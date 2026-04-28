#!/bin/bash
# Wazuh active response — drop the offending source IP via iptables.
# Invoked by the manager via stdin JSON.
#
# Triggered on rule 100100 (SSH brute-force).
# Adds an iptables INPUT DROP rule, removable on `delete`.

set -euo pipefail

LOG_FILE="/var/ossec/logs/active-responses.log"
ACTION="$(jq -r '.command // empty' || true)"
SRCIP="$(jq -r '.parameters.alert.data.srcip // empty')"

if [[ -z "${SRCIP:-}" ]]; then
  echo "$(date '+%F %T') firewall-drop: no srcip in alert" >> "$LOG_FILE"
  exit 1
fi

case "$ACTION" in
  add)
    iptables -I INPUT -s "$SRCIP" -j DROP
    echo "$(date '+%F %T') firewall-drop: blocked $SRCIP" >> "$LOG_FILE"
    ;;
  delete)
    iptables -D INPUT -s "$SRCIP" -j DROP || true
    echo "$(date '+%F %T') firewall-drop: unblocked $SRCIP" >> "$LOG_FILE"
    ;;
esac
