import extracted from "./extracted";

export default {
  // Flat auto-extracted keys (from scripts/i18n-extract.py). Reviewed and
  // curated keys live under the structured namespaces below.
  ...extracted,
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
