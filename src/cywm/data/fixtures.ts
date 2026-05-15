import type { ConfigFile, DeployRecord, FileTemplate } from "@/cywm/types";

const RULES_LOCAL = `<group name="vulnerability-detector,cywm,">

  <!-- HIGH: CVSS 7.0-8.9 → auto-fix -->
  <rule id="100200" level="10">
    <if_group>vulnerability-detector</if_group>
    <field name="data.vulnerability.cvss3.base_score">^[78]\\.</field>
    <description>CYWM HIGH: CVSS $(data.vulnerability.cvss3.base_score) — TRIGGER auto-fix</description>
    <group>cywm_high,auto_fix_required,</group>
  </rule>

  <!-- CRITICAL: CVSS 9.0+ → auto-fix + restrict -->
  <rule id="100201" level="12">
    <if_group>vulnerability-detector</if_group>
    <field name="data.vulnerability.cvss3.base_score">^9\\.</field>
    <description>CYWM CRITICAL: CVSS $(data.vulnerability.cvss3.base_score)</description>
    <group>cywm_critical,auto_fix_required,</group>
  </rule>

  <!-- THRESHOLD: 5+ critical CVE/h → restrict access -->
  <rule id="100202" level="13" frequency="5" timeframe="3600">
    <if_matched_sid>100201</if_matched_sid>
    <same_source_ip />
    <description>CYWM THRESHOLD: RESTRICT ACCESS</description>
    <group>cywm_threshold,restrict_access,</group>
  </rule>

</group>
`;

const DECODER_LOCAL = `<decoder name="cywm-custom">
  <prematch>^CYWM:</prematch>
</decoder>

<decoder name="cywm-custom-fields">
  <parent>cywm-custom</parent>
  <regex>^CYWM: (\\S+) (\\S+) (.+)$</regex>
  <order>action,target,details</order>
</decoder>
`;

const VULN_SNIPPET = `<vulnerability-detection>
  <enabled>yes</enabled>
  <index-status>yes</index-status>
  <feed-update-interval>60m</feed-update-interval>
</vulnerability-detection>

<indexer>
  <enabled>yes</enabled>
  <hosts>
    <host>https://security-indexer:9200</host>
  </hosts>
</indexer>
`;

const ACTIVE_RESPONSE_SNIPPET = `<command>
  <name>cywm-winget-upgrade</name>
  <executable>winget-upgrade.cmd</executable>
  <timeout_allowed>yes</timeout_allowed>
</command>

<active-response>
  <command>cywm-winget-upgrade</command>
  <location>local</location>
  <rules_id>100200,100201</rules_id>
  <timeout>600</timeout>
</active-response>
`;

const HR_AGENT_CONF = `<agent_config>
  <vulnerability-detection>
    <enabled>yes</enabled>
  </vulnerability-detection>

  <syscheck>
    <frequency>43200</frequency>
    <directories check_all="yes" realtime="yes">C:\\Windows\\System32</directories>
    <directories check_all="yes" realtime="yes">C:\\Program Files</directories>
  </syscheck>

  <wodle name="syscollector">
    <disabled>no</disabled>
    <interval>1h</interval>
    <packages>yes</packages>
    <hotfixes>yes</hotfixes>
  </wodle>
</agent_config>
`;

const WINGET_CMD = `@echo off
REM CYWM Active Response — winget upgrade
set LOG=%ProgramFiles(x86)%\\ossec-agent\\active-response\\active-responses.log
echo %DATE% %TIME% cywm-winget-upgrade started >> %LOG%
powershell -ExecutionPolicy Bypass -File "%~dp0winget-upgrade.ps1"
echo %DATE% %TIME% cywm-winget-upgrade exit=%ERRORLEVEL% >> %LOG%
exit /b %ERRORLEVEL%
`;

const WINGET_PS1 = `# CYWM Active Response — upgrade vulnerable packages via winget
$ErrorActionPreference = "Stop"
$log = "$env:ProgramFiles(x86)\\ossec-agent\\active-response\\cywm.log"

try {
    $output = & winget upgrade --all --silent --accept-source-agreements --accept-package-agreements 2>&1
    Add-Content -Path $log -Value "$(Get-Date -Format o) winget upgrade ok: $output"
    exit 0
} catch {
    Add-Content -Path $log -Value "$(Get-Date -Format o) winget upgrade FAILED: $_"
    exit 1
}
`;

const BLOCK_NETWORK_CMD = `@echo off
REM CYWM Active Response — restrict network access
set IP=%3
netsh advfirewall firewall add rule name="CYWM-block-%IP%" dir=in action=block remoteip=%IP%
exit /b 0
`;

const NOW = "2026-04-28T14:00:00Z";

export const fixtureFiles: ConfigFile[] = [
  {
    id: "f-local-rules",
    target: "manager",
    category: "rules",
    filename: "local_rules.xml",
    content: RULES_LOCAL,
    contentSaved: RULES_LOCAL,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-local-decoder",
    target: "manager",
    category: "decoders",
    filename: "local_decoder.xml",
    content: DECODER_LOCAL,
    contentSaved: DECODER_LOCAL,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-vuln-snippet",
    target: "manager",
    category: "ossec-snippets",
    filename: "10-vulnerability.xml",
    content: VULN_SNIPPET,
    contentSaved: VULN_SNIPPET,
    updatedAt: NOW,
    updatedBy: "alex",
  },
  {
    id: "f-ar-snippet",
    target: "manager",
    category: "ossec-snippets",
    filename: "20-active-response.xml",
    content: ACTIVE_RESPONSE_SNIPPET,
    contentSaved: ACTIVE_RESPONSE_SNIPPET,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-hr-agent-conf",
    target: "manager",
    category: "shared",
    filename: "cywm-high-risk/agent.conf",
    content: HR_AGENT_CONF,
    contentSaved: HR_AGENT_CONF,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-winget-cmd",
    target: "windows-agent",
    category: "active-response",
    filename: "winget-upgrade.cmd",
    content: WINGET_CMD,
    contentSaved: WINGET_CMD,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-winget-ps1",
    target: "windows-agent",
    category: "active-response",
    filename: "winget-upgrade.ps1",
    content: WINGET_PS1,
    contentSaved: WINGET_PS1,
    updatedAt: NOW,
    updatedBy: "admin",
  },
  {
    id: "f-block-network",
    target: "windows-agent",
    category: "active-response",
    filename: "block-network.cmd",
    content: BLOCK_NETWORK_CMD,
    contentSaved: BLOCK_NETWORK_CMD,
    updatedAt: NOW,
    updatedBy: "admin",
  },
];

export const fixtureHistory: DeployRecord[] = [
  {
    id: "d-001",
    startedAt: "2026-04-28T14:23:00Z",
    target: "MDM Security manager",
    filename: "local_rules.xml",
    category: "rules",
    user: "admin",
    status: "success",
    durationMs: 3400,
    wazuhGroup: null,
    log: "[14:23:00] Validating syntax... ok\n[14:23:01] Backing up current version... ok\n[14:23:02] Uploading new version to /var/ossec/etc/rules/local_rules.xml... ok\n[14:23:03] Setting permissions (ossec:ossec, 0640)... ok\n[14:23:03] Restarting mdm-security-manager... ok\n[14:23:04] Deploy completed successfully.",
  },
  {
    id: "d-002",
    startedAt: "2026-04-28T14:18:00Z",
    target: "WIN11-DEMO (009)",
    filename: "winget-upgrade.ps1",
    category: "active-response",
    user: "admin",
    status: "success",
    durationMs: 2100,
    wazuhGroup: null,
    log: "[14:18:00] Connecting to agent WIN11-DEMO... ok\n[14:18:00] Transferring file (2.4 KB)... ok\n[14:18:01] Setting ACL via icacls... ok\n[14:18:02] Deploy completed successfully.",
  },
  {
    id: "d-003",
    startedAt: "2026-04-28T14:18:00Z",
    target: "WIN11-DEMO (009)",
    filename: "winget-upgrade.cmd",
    category: "active-response",
    user: "admin",
    status: "success",
    durationMs: 1800,
    wazuhGroup: null,
    log: "[14:18:00] Connecting to agent WIN11-DEMO... ok\n[14:18:00] Transferring file (0.5 KB)... ok\n[14:18:01] Setting ACL via icacls... ok\n[14:18:01] Deploy completed successfully.",
  },
  {
    id: "d-004",
    startedAt: "2026-04-28T13:55:00Z",
    target: "MDM Security manager",
    filename: "20-active-response.xml",
    category: "ossec-snippets",
    user: "admin",
    status: "failed",
    durationMs: 1200,
    wazuhGroup: null,
    log: "[13:55:00] Validating syntax... FAILED\n[13:55:01] /var/ossec/bin/mdm-control configtest:\n  ERROR: (1226): Error parsing file '/var/ossec/etc/ossec.conf' line 47.\n  ERROR: (1202): Configuration error at '/var/ossec/etc/ossec.conf'.\n[13:55:01] Aborting deploy. Manager configuration NOT changed.",
  },
  {
    id: "d-005",
    startedAt: "2026-04-28T13:45:00Z",
    target: "cywm-high-risk group",
    filename: "agent.conf",
    category: "shared",
    user: "admin",
    status: "success",
    durationMs: 800,
    wazuhGroup: "cywm-high-risk",
    log: "[13:45:00] Validating XML syntax... ok\n[13:45:00] Uploading to /var/ossec/etc/shared/cywm-high-risk/agent.conf... ok\n[13:45:00] Setting permissions... ok\n[13:45:01] Group config will be auto-synced to agents (no restart needed).",
  },
  {
    id: "d-006",
    startedAt: "2026-04-28T12:30:00Z",
    target: "MDM Security manager",
    filename: "10-vulnerability.xml",
    category: "ossec-snippets",
    user: "alex",
    status: "success",
    durationMs: 4200,
    wazuhGroup: null,
    log: "[12:30:00] Validating syntax... ok\n[12:30:01] Backing up... ok\n[12:30:02] Uploading... ok\n[12:30:03] Restarting mdm-security-manager... ok\n[12:30:04] Deploy completed successfully.",
  },
  {
    id: "d-007",
    startedAt: "2026-04-28T11:42:00Z",
    target: "MDM Security manager",
    filename: "local_decoder.xml",
    category: "decoders",
    user: "alex",
    status: "success",
    durationMs: 3100,
    wazuhGroup: null,
    log: "[11:42:00] Validating syntax... ok\n[11:42:01] Backing up... ok\n[11:42:02] Uploading... ok\n[11:42:03] Restarting mdm-security-manager... ok\n[11:42:03] Deploy completed successfully.",
  },
  {
    id: "d-008",
    startedAt: "2026-04-28T10:15:00Z",
    target: "MDM Security manager",
    filename: "local_rules.xml",
    category: "rules",
    user: "admin",
    status: "failed",
    durationMs: 900,
    wazuhGroup: null,
    log: "[10:15:00] Validating syntax... FAILED\n[10:15:00] /var/ossec/bin/mdm-control configtest:\n  ERROR: (1226): Error parsing file '/var/ossec/etc/rules/local_rules.xml' line 12.\n  ERROR: Unclosed tag <rule>.\n[10:15:00] Aborting deploy.",
  },
];

export const fileTemplates: FileTemplate[] = [
  {
    id: "tpl-empty-rule",
    label: "Empty rule",
    target: "manager",
    category: "rules",
    filenameSuggestion: "custom_rules.xml",
    content: `<group name="custom,">

  <rule id="100300" level="5">
    <decoded_as>json</decoded_as>
    <description>Custom rule description</description>
  </rule>

</group>
`,
  },
  {
    id: "tpl-empty-decoder",
    label: "Empty decoder",
    target: "manager",
    category: "decoders",
    filenameSuggestion: "custom_decoder.xml",
    content: `<decoder name="custom-app">
  <prematch>^MyApp:</prematch>
</decoder>
`,
  },
  {
    id: "tpl-vuln-snippet",
    label: "vulnerability-detection snippet",
    target: "manager",
    category: "ossec-snippets",
    filenameSuggestion: "30-vuln.xml",
    content: VULN_SNIPPET,
  },
  {
    id: "tpl-ar-cmd",
    label: "Active Response (.cmd)",
    target: "windows-agent",
    category: "active-response",
    filenameSuggestion: "my-response.cmd",
    content: `@echo off
REM CYWM Active Response — TODO: describe what this script does
set LOG=%ProgramFiles(x86)%\\ossec-agent\\active-response\\active-responses.log
echo %DATE% %TIME% my-response started >> %LOG%
REM TODO: your logic here
exit /b 0
`,
  },
  {
    id: "tpl-ar-ps1",
    label: "Active Response (.ps1)",
    target: "windows-agent",
    category: "active-response",
    filenameSuggestion: "my-response.ps1",
    content: `# CYWM Active Response — TODO: describe what this script does
$ErrorActionPreference = "Stop"
try {
    # TODO: your logic here
    exit 0
} catch {
    Write-Error $_
    exit 1
}
`,
  },
  {
    id: "tpl-agent-conf",
    label: "Group agent.conf",
    target: "manager",
    category: "shared",
    filenameSuggestion: "",
    content: "",
  },
];
