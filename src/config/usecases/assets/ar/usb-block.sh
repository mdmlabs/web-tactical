#!/bin/bash
# Wazuh active response — block USB mass-storage devices module-wide.
# Triggered on rule 100400.

set -euo pipefail

LOG_FILE="/var/ossec/logs/active-responses.log"
ACTION="$(jq -r '.command // empty' || true)"

case "$ACTION" in
  add)
    modprobe -r usb_storage 2>/dev/null || true
    echo "blacklist usb_storage" > /etc/modprobe.d/99-disable-usbstor.conf
    echo "$(date '+%F %T') usb-block: usb_storage disabled" >> "$LOG_FILE"
    ;;
  delete)
    rm -f /etc/modprobe.d/99-disable-usbstor.conf
    modprobe usb_storage 2>/dev/null || true
    echo "$(date '+%F %T') usb-block: usb_storage re-enabled" >> "$LOG_FILE"
    ;;
esac
