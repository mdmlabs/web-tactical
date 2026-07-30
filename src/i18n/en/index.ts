import extracted from "./extracted";
import legacyAdminKeys from "../vi/admin-static";
import lightStaticKeys from "../vi/light-static";
import legacySspKeys from "../vi/ssp-static";
import {
  createIdentityTranslationsFromKeys,
  createPlainTextTranslations,
} from "../plain-text";

const extractedPlainText = createPlainTextTranslations(extracted, extracted);
const legacyPlainText = createIdentityTranslationsFromKeys(
  legacyAdminKeys,
  lightStaticKeys,
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
    systemTitle: "Laborato MDM Light",
  },
  complianceCenter: {
    devicesCompliant:
      "{compliant} of {total} devices compliant",
    devicesInStateTable:
      "{count} devices in compliance state table",
    mappedAgents:
      "{agents} mapped agents, {results} SCA results",
    noDominantFailure: "No dominant failure",
  },
  auth: {
    signInTitle: "Sign In",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    signInAction: "Sign In",
    securePlatform: "Secure Enterprise Platform",
  },
  dataGuard: {
    tabLabel: "Secure Container",
    policyTitle: "Secure Container data protection",
    policyDescription:
      "DataGuard prevents plaintext writes before they reach local disks, network shares, cloud folders, or USB storage. Protected Export remains available as an encrypted .lsc package.",
    enableEnforcement: "Enable DataGuard enforcement",
    enforcementMode: "Enforcement mode",
    auditWarning:
      "Audit mode records attempted exports but does not prevent them.",
    failClosed: "Fail closed if Broker or driver is unavailable",
    failClosedHelp:
      "Recommended for production. Protected editors will not start without active kernel enforcement.",
    minutes: "minutes",
    maximumSession: "Maximum editor session",
    approvedEditors: "Approved external editors",
    approvedEditorsHelp:
      "Leave empty to allow only the built-in viewer and editor.",
    addEditorPreset: "Add editor preset",
    addCustomEditor: "Add a custom approved editor",
    editorIntegrityRequired:
      "Every approved editor requires a signer subject or SHA-256 pin.",
    executablePath: "Executable path",
    signerSubject: "Required signer subject",
    sha256Optional: "SHA-256 (optional)",
    launchArguments: "Isolated launch argument tokens",
    workspaceRoots: "Protected workspace roots",
    workspaceRootsHelp:
      "Advanced: policy intersections keep only roots shared by every policy",
    absoluteWindowsPath: "Absolute Windows path",
    addWorkspaceRoot: "Add workspace root",
    workspaceRootRequired:
      "DataGuard enforcement requires a protected workspace root.",
    modeAudit: "Audit only",
    modeBlockPlaintext: "Block plaintext export",
    modeProtectedExport: "Protected export only",
    editorWord: "Microsoft Word (signed)",
    editorLibreOffice: "LibreOffice Writer (signed)",
    editorNotepad: "Windows Notepad (signed)",
    argumentValidation:
      "Use exactly one {document}; optional: {workspace}, {workspaceUri}",
    healthTab: "DataGuard",
    healthTitle: "Secure Container enforcement",
    healthDescription:
      "Live Broker and minifilter health reported by Windows endpoints.",
    noHealthReported:
      "No endpoint has reported DataGuard health yet. Protected external editor sessions remain unavailable until Broker and driver are healthy.",
    protected: "Protected",
    unknown: "Unknown",
    columnAgent: "Agent",
    columnProtection: "Protection",
    columnDriver: "Driver",
    columnBroker: "Broker",
    columnProtocol: "Protocol",
    columnSessions: "Sessions",
    columnQueued: "Queued",
    columnDetail: "Detail",
    columnReported: "Reported",
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
