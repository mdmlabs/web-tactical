export const LIGHT_CAPABILITIES = [
  "portal.login",
  "portal.administration",
  "devices.lock",
  "devices.reboot",
  "devices.shutdown",
  "policies.bluetooth_block",
  "policies.camera_block",
  "policies.microphone_block",
  "policies.usb_control",
  "policies.usb_allowlist",
  "compliance.check",
  "kiosk.browser",
  "applications.install",
  "applications.uninstall",
  "applications.block",
  "applications.allow_deny_list",
  "container.create_lock_recovery_key",
  "container.mount_unmount",
  "container.resize",
  "container.password_change_recovery",
  "container.portal_policy_monitoring",
  "container.data_loss_prevention",
] as const;

export const BUILD_PRODUCT_EDITION =
  String(process.env.PRODUCT_EDITION || "full").toLowerCase() === "light"
    ? "light"
    : "full";

export const BUILD_PRODUCT_NAME =
  String(process.env.PRODUCT_DISPLAY_NAME || "").trim() ||
  (BUILD_PRODUCT_EDITION === "light"
    ? "Laborato MDM Light"
    : "Laborato MDM");

const LIGHT_ALLOWED_EXACT_PATHS = new Set([
  "/",
  "/login",
  "/reset-password",
  "/expired",
  "/app-management",
  "/compliance",
  "/compliance-center",
  "/light/devices",
  "/light/kiosk",
]);

const LIGHT_ALLOWED_PATH_PREFIXES = [
  "/agents/",
  "/takecontrol/",
  "/security-center",
  "/settings",
];

export function lightRouteIsAllowed(path: string): boolean {
  if (LIGHT_ALLOWED_EXACT_PATHS.has(path)) return true;
  return LIGHT_ALLOWED_PATH_PREFIXES.some((prefix) =>
    path.startsWith(prefix),
  );
}
