#!/bin/bash
# Wazuh active response — notify operators on unauthorized sudo and
# write a marker file the SOC dashboard can pick up.
# Triggered on rule 100500.

set -euo pipefail

LOG_FILE="/var/ossec/logs/active-responses.log"
SRCUSER="$(jq -r '.parameters.alert.data.srcuser // "unknown"')"
COMMAND="$(jq -r '.parameters.alert.data.command // "unknown"')"

logger -t wazuh-escalate "Unauthorized sudo by ${SRCUSER}: ${COMMAND}"
mkdir -p /var/ossec/queue/escalations
echo "$(date -u +%FT%TZ) ${SRCUSER} ${COMMAND}" \
  >> /var/ossec/queue/escalations/sudo-incidents.log
echo "$(date '+%F %T') notify-escalate: logged sudo incident for ${SRCUSER}" \
  >> "$LOG_FILE"
