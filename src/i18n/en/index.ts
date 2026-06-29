import extracted from "./extracted";
import legacyAdminKeys from "../vi/admin-static";
import legacySspKeys from "../vi/ssp-static";
import {
  createIdentityTranslationsFromKeys,
  createPlainTextTranslations,
} from "../plain-text";

const extractedPlainText = createPlainTextTranslations(extracted, extracted);
const legacyPlainText = createIdentityTranslationsFromKeys(
  legacyAdminKeys,
  legacySspKeys,
);

const runtimePlainText = {
  "*Required": "*Required",
  "{count} device(s)": "{count} device(s)",
  "{count} managed device(s)": "{count} managed device(s)",
  "{username} Password Reset": "{username} Password Reset",
  "Command failed": "Command failed",
  "Connected Social Accounts for {username}":
    "Connected Social Accounts for {username}",
  Disconnect: "Disconnect",
  "Disconnect all sessions for {username}?":
    "Disconnect all sessions for {username}?",
  "Disconnect session for {username}?": "Disconnect session for {username}?",
  "Disconnect social account: {display}?":
    "Disconnect social account: {display}?",
  "Email identifier verified for {username}":
    "Email identifier verified for {username}",
  "Failed to link device": "Failed to link device",
  "Failed to unenroll": "Failed to unenroll",
  "Failed to update device": "Failed to update device",
  "Installer generation failed": "Installer generation failed",
  "Login session deleted successfully": "Login session deleted successfully",
  "Login sessions deleted successfully": "Login sessions deleted successfully",
  "No roles have been created. Create some from Settings > Permissions Manager":
    "No roles have been created. Create some from Settings > Permissions Manager",
  "Requested from Self-Service Portal": "Requested from Self-Service Portal",
  "Run {action}?": "Run {action}?",
  "Social account disconnected successfully":
    "Social account disconnected successfully",
  "This user will be signed out immediately.":
    "This user will be signed out immediately.",
  'Unenroll "{device}"?': 'Unenroll "{device}"?',
  "Use this if the agent is already visible in the admin console but was not linked automatically.":
    "Use this if the agent is already visible in the admin console but was not linked automatically.",
  "User Password Reset!": "User Password Reset!",
  "User Sessions for {username}": "User Sessions for {username}",
  "User disabled successfully": "User disabled successfully",
  "User edited!": "User edited!",
  "User enabled successfully": "User enabled successfully",
  "User list exported": "User list exported",
  "User {username} was added!": "User {username} was added!",
  "User {username} was deleted!": "User {username} was deleted!",
  "Verify Email Identifier": "Verify Email Identifier",
};

export default {
  // Flat auto-extracted keys (from scripts/i18n-extract.py). Reviewed and
  // curated keys live under the structured namespaces below.
  ...extractedPlainText,
  ...legacyPlainText,
  ...extracted,
  ...runtimePlainText,
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    refresh: "Refresh",
    loading: "Loading...",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    search: "Search",
  },
  language: {
    label: "Language",
    english: "English",
    russian: "Russian",
    vietnamese: "Tiếng Việt",
  },
  branding: {
    systemName: "Hệ thống quản lý nghiệp vụ Cơ yếu trên nền tảng Windows",
  },
  devicemanagement: {
    bulkActions: {
      fullWipeAll: "Full Wipe All",
    },
  },
  layout: {
    outdatedBanner: "You are viewing an outdated version of this page.",
    licenseInactive:
      "Your license is currently inactive, usually due to a payment issue.",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToDashboard: "Back to Dashboard",
    refreshDashboard: "Refresh Dashboard",
    documentation: "Documentation",
    preferences: "Preferences",
    account: "Account",
    resetPassword: "Reset Password",
    logout: "Logout",
  },
};
