<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('winadvanced.views.WindowsAdvancedView.83154d') }}</div>

    <q-tabs v-model="tab" dense class="q-mb-md" align="left" :breakpoint="0">
      <q-tab name="vuln" :label="$t('winadvanced.views.WindowsAdvancedView.bd97c9')" icon="bug_report" />
      <q-tab name="eventlogs" :label="$t('winadvanced.views.WindowsAdvancedView.a4ebd2')" icon="event_note" />
      <q-tab name="autopilot" :label="$t('winadvanced.views.WindowsAdvancedView.5d4734')" icon="rocket_launch" />
      <q-tab name="wsl" :label="$t('winadvanced.views.WindowsAdvancedView.a1d947')" icon="terminal" />
      <q-tab name="windows-hello" label="Windows Hello" icon="fingerprint" />
      <q-tab name="wdac" :label="$t('winadvanced.views.WindowsAdvancedView.19276e')" icon="verified_user" />
      <q-tab name="baselines" :label="$t('winadvanced.views.WindowsAdvancedView.323cf9')" icon="security" />
      <q-tab name="update-rings" :label="$t('winadvanced.views.WindowsAdvancedView.71778e')" icon="update" />
      <q-tab name="maintenance" :label="$t('winadvanced.views.WindowsAdvancedView.94de30')" icon="engineering" />
      <q-tab name="reboot" :label="$t('winadvanced.views.WindowsAdvancedView.6af4f5')" icon="restart_alt" />
      <q-tab name="credential-guard" :label="$t('winadvanced.views.WindowsAdvancedView.1e0d3f')" icon="shield" />
      <q-tab name="tpm" :label="$t('winadvanced.views.WindowsAdvancedView.72fdaa')" icon="hardware" />
      <q-tab name="kiosk-analytics" :label="$t('winadvanced.views.WindowsAdvancedView.1e9010')" icon="analytics" />
      <q-tab name="kiosk" :label="$t('winadvanced.views.WindowsAdvancedView.122c6d')" icon="monitor" />
      <q-tab name="insider" :label="$t('winadvanced.views.WindowsAdvancedView.c66579')" icon="science" />
      <q-tab name="analytics" :label="$t('winadvanced.views.WindowsAdvancedView.3f8ebe')" icon="analytics" />
      <q-tab name="feature-pack" :label="$t('winadvanced.views.WindowsAdvancedView.e651d1')" icon="extension" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>

      <!-- Vulnerability Scanning -->
      <q-tab-panel name="vuln">
        <div class="row q-gutter-md q-mb-md">
          <q-card v-for="(count, sev) in vulnSummary.open_by_severity" :key="sev" class="col-auto">
            <q-card-section class="text-center q-pa-sm">
              <div class="text-h5 " :class="`text-${vulnSevColor(sev)}`">{{ count }}</div>
              <div class="text-caption">{{ sev }}</div>
            </q-card-section>
          </q-card>
        </div>
        <q-tabs v-model="vulnTab" dense class="q-mb-sm" align="left">
          <q-tab name="scans" :label="$t('winadvanced.views.WindowsAdvancedView.b4d22e')" />
          <q-tab name="policies" :label="$t('winadvanced.views.WindowsAdvancedView.c380d7')" />
        </q-tabs>
        <q-tab-panels v-model="vulnTab">
          <q-tab-panel name="scans">
            <div class="row q-gutter-sm q-mb-md items-center">
              <q-select v-model="vulnFilter.severity" :options="sevOptions" :label="$t('winadvanced.views.WindowsAdvancedView.de314f')" dense outlined clearable emit-value map-options style="min-width:120px" @update:model-value="loadVulnScans" />
              <q-select v-model="vulnFilter.status" :options="vulnStatusOptions" :label="$t('winadvanced.views.WindowsAdvancedView.bae7d5')" dense outlined clearable emit-value map-options style="min-width:130px" @update:model-value="loadVulnScans" />
              <q-input v-model="vulnFilter.agent_id" :label="$t('winadvanced.views.WindowsAdvancedView.9f2c11')" dense outlined clearable style="min-width:180px" @update:model-value="loadVulnScans" />
            </div>
            <q-table :rows="vulnScans" :columns="vulnColumns" dense row-key="id" :loading="loadingVuln">
              <template v-slot:body-cell-severity="props">
                <q-td :props="props"><q-chip dense :color="vulnSevColor(props.value)" text-color="white">{{ props.value }}</q-chip></q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props"><q-chip dense :color="props.value === 'open' ? 'negative' : 'positive'" text-color="white">{{ props.value }}</q-chip></q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-dropdown dense flat icon="more_vert" size="sm">
                    <q-list dense>
                      <q-item clickable v-close-popup @click="updateVulnStatus(props.row.id, 'remediated')"><q-item-section>{{ $t('winadvanced.views.WindowsAdvancedView.25036c') }}</q-item-section></q-item>
                      <q-item clickable v-close-popup @click="updateVulnStatus(props.row.id, 'accepted')"><q-item-section>{{ $t('winadvanced.views.WindowsAdvancedView.40b8b7') }}</q-item-section></q-item>
                      <q-item clickable v-close-popup @click="updateVulnStatus(props.row.id, 'false_positive')"><q-item-section>{{ $t('winadvanced.views.WindowsAdvancedView.16f64d') }}</q-item-section></q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="policies">
            <div class="row q-gutter-sm q-mb-md">
              <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.547745')" @click="showVulnPolicyDialog()" />
            </div>
            <q-table :rows="vulnPolicies" :columns="vulnPolicyColumns" dense row-key="id">
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="play_arrow" size="sm" color="primary" @click="runVulnScan(props.row)" :title="$t('winadvanced.views.WindowsAdvancedView.4df579')" />
                  <q-btn flat dense round icon="edit" size="sm" @click="showVulnPolicyDialog(props.row)" />
                  <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteVulnPolicy(props.row.id)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>

      <!-- Event Logs -->
      <q-tab-panel name="eventlogs">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row q-col-gutter-md items-end">
            <div class="col-12 col-md">
              <div class="text-subtitle2">Custom event channel</div>
              <div class="text-caption text-grey-7">Create a Windows Event Log channel/source on selected devices and write a probe event for verification.</div>
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="customEventLogName" label="Log name" placeholder="MDMCustom" dense outlined />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="customEventSource" label="Source" placeholder="MDMCustom" dense outlined />
            </div>
            <div class="col-auto">
              <q-btn color="primary" icon="add" label="Create Channel" :loading="customEventBusy" @click="createCustomEventChannel" />
            </div>
          </q-card-section>
        </q-card>
        <div class="row q-gutter-sm q-mb-md items-center">
          <q-input v-model="logFilter.agent_id" :label="$t('winadvanced.views.WindowsAdvancedView.9f2c11')" dense outlined style="min-width:180px" />
          <q-select v-model="logFilter.level" :options="logLevelOptions" :label="$t('winadvanced.views.WindowsAdvancedView.7c7f5d')" dense outlined clearable emit-value map-options style="min-width:130px" />
          <q-input v-model="logFilter.source" :label="$t('winadvanced.views.WindowsAdvancedView.6da13a')" dense outlined clearable style="min-width:160px" />
          <q-input v-model="logFilter.event_id" :label="$t('winadvanced.views.WindowsAdvancedView.894b1c')" dense outlined clearable type="number" style="min-width:110px" />
          <q-input v-model="logFilter.date_from" :label="$t('winadvanced.views.WindowsAdvancedView.3f6605')" dense outlined type="date" style="min-width:140px" />
          <q-input v-model="logFilter.date_to" :label="$t('winadvanced.views.WindowsAdvancedView.ae79ea')" dense outlined type="date" style="min-width:140px" />
          <q-btn color="primary" icon="search" @click="loadEventLogs" />
        </div>
        <q-table :rows="eventLogs" :columns="logColumns" dense row-key="id" :loading="loadingLogs"
          :rows-per-page-options="[50, 100, 200]">
          <template v-slot:body-cell-level="props">
            <q-td :props="props"><q-chip dense :color="logLevelColor(props.value)" text-color="white" size="sm">{{ props.value }}</q-chip></q-td>
          </template>
        </q-table>
        <div class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">{{ $t('winadvanced.views.WindowsAdvancedView.67398c') }}</div>
          <q-btn dense flat color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.c6222c')" @click="showRetentionDialog()" />
          <q-table :rows="retentionPolicies" :columns="retentionColumns" dense row-key="id" class="q-mt-sm" />
        </div>
        <q-card flat bordered class="q-mt-md">
          <q-card-section class="row items-center q-col-gutter-md">
            <div class="col">
              <div class="text-subtitle2">Event correlation</div>
              <div class="text-caption text-grey-7">Detect related Windows events across devices by time window, event IDs, logs, levels, and source.</div>
            </div>
            <div class="col-auto">
              <q-btn flat color="primary" icon="add" label="New Rule" @click="showCorrelationRuleDialog()" />
              <q-btn color="primary" icon="analytics" label="Run Analysis" :loading="correlationBusy" @click="runCorrelation()" />
            </div>
          </q-card-section>
          <q-card-section>
            <q-table :rows="correlationRules" :columns="correlationRuleColumns" dense row-key="id" :loading="loadingCorrelation">
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="play_arrow" color="primary" @click="runCorrelation(props.row)" />
                  <q-btn flat dense round icon="edit" @click="showCorrelationRuleDialog(props.row)" />
                  <q-btn flat dense round icon="delete" color="negative" @click="deleteCorrelationRule(props.row.id)" />
                </q-td>
              </template>
            </q-table>
            <q-table :rows="correlationMatches" :columns="correlationMatchColumns" dense row-key="id" class="q-mt-md" title="Recent matches" />
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Autopilot -->
      <q-tab-panel name="autopilot">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.8cd266')" @click="showAutopilotDialog()" />
        </div>
        <q-table :rows="autopilotProfiles" :columns="autopilotColumns" dense row-key="id" :loading="loadingAutopilot">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">{{ props.value ? 'Active' : 'Off' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showAutopilotDialog(props.row)" />
              <q-btn flat dense round icon="fact_check" size="sm" color="info" @click="deployAutopilot(props.row, true)">
                <q-tooltip>Preview naming/domain payload on devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="send" size="sm" color="primary" @click="deployAutopilot(props.row, false)">
                <q-tooltip>Deploy Autopilot/domain join profile</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('autopilot', props.row)">
                <q-tooltip>Revoke Autopilot hints from devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('autopilot', props.row, loadAutopilot)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- WSL -->
      <q-tab-panel name="wsl">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row q-col-gutter-md items-end">
            <div class="col-12 col-md">
              <div class="text-subtitle2">Linux distributions</div>
              <div class="text-caption text-grey-7">Deploy an approved WSL distribution or trigger package index updates on selected Windows devices.</div>
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="wslDistroName" label="Distribution name" placeholder="Ubuntu" dense outlined />
            </div>
            <div class="col-auto">
              <q-btn color="primary" icon="download" label="Deploy" :loading="wslDistroBusy" @click="runWSLDistroAction('deploy')" />
            </div>
            <div class="col-auto">
              <q-btn color="secondary" icon="system_update_alt" label="Update" :loading="wslDistroBusy" @click="runWSLDistroAction('update')" />
            </div>
          </q-card-section>
        </q-card>
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.94fc74')" @click="showWSLDialog()" />
        </div>
        <q-table :rows="wslPolicies" :columns="wslColumns" dense row-key="id" :loading="loadingWSL">
          <template v-slot:body-cell-wsl_enabled="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'positive' : 'negative'" text-color="white">{{ props.value ? 'Enabled' : 'Disabled' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showWSLDialog(props.row)" />
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('wsl', props.row)">
                <q-tooltip>Revoke WSL restrictions without uninstalling WSL</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('wsl', props.row, loadWSL)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Windows Hello for Business + PIN -->
      <q-tab-panel name="windows-hello">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row q-col-gutter-md items-center">
            <div class="col">
              <div class="text-subtitle2">Windows Hello for Business</div>
              <div class="text-caption text-grey-7">Configure Passport for Work and PIN complexity, then apply or revoke it on selected Windows devices.</div>
            </div>
            <div class="col-auto">
              <q-btn color="primary" icon="add" label="New Policy" @click="showWindowsHelloDialog()" />
            </div>
          </q-card-section>
        </q-card>
        <q-table :rows="windowsHelloPolicies" :columns="windowsHelloColumns" dense row-key="id" :loading="loadingWindowsHello">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">{{ props.value ? 'Active' : 'Off' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-require_tpm="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'warning' : 'grey'" text-color="white">{{ props.value ? 'TPM required' : 'TPM optional' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-use_security_key_for_signin="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'primary' : 'grey'" text-color="white">{{ props.value ? 'Security keys' : 'Off' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="send" size="sm" color="primary" @click="deployWindowsHello(props.row)">
                <q-tooltip>Apply to selected devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('windows_hello', props.row)">
                <q-tooltip>Revoke Windows Hello/PIN policy from devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="edit" size="sm" @click="showWindowsHelloDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('windows_hello', props.row, loadWindowsHello)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- WDAC -->
      <q-tab-panel name="wdac">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.67cb0e')" @click="showWDACDialog()" />
        </div>
        <q-table :rows="wdacPolicies" :columns="wdacColumns" dense row-key="id" :loading="loadingWDAC">
          <template v-slot:body-cell-mode="props">
            <q-td :props="props"><q-chip dense :color="props.value === 'enforcement' ? 'negative' : 'warning'" text-color="white">{{ props.value }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showWDACDialog(props.row)" />
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('wdac', props.row)">
                <q-tooltip>Disable WDAC policy on devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('wdac', props.row, loadWDAC)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Security Baselines -->
      <q-tab-panel name="baselines">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.5654ed')" @click="showBaselineDialog()" />
        </div>
        <q-table :rows="baselines" :columns="baselineColumns" dense row-key="id" :loading="loadingBaselines">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">{{ props.value ? 'Active' : 'Off' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="send" size="sm" color="primary" @click="deployBaseline(props.row)" :title="$t('winadvanced.views.WindowsAdvancedView.fb4192')" />
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('baseline', props.row)">
                <q-tooltip>Revoke baseline settings from devices</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="edit" size="sm" @click="showBaselineDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('baseline', props.row, loadBaselines)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Maintenance Windows (func #677-683) -->
      <q-tab-panel name="maintenance">
        <MaintenanceWindowsPanel />
      </q-tab-panel>

      <!-- Reboot Policy (func #889) -->
      <q-tab-panel name="reboot">
        <RebootPolicyPanel />
      </q-tab-panel>

      <!-- Windows Insider (#866) -->
      <q-tab-panel name="insider">
        <q-banner v-if="insiderLoadError" rounded dense class="bg-negative text-white q-mb-md">{{ insiderLoadError }}</q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.96b186') }}</div>
            <div class="mdm-section-subtitle">{{ $t('winadvanced.views.WindowsAdvancedView.0795ab') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn outline color="warning" icon="undo" label="Revoke" @click="revokeInsiderConfig" />
            <q-btn color="primary" icon="save" :label="$t('winadvanced.views.WindowsAdvancedView.237e04')" @click="applyInsiderConfig" />
          </div>
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-md">{{ $t('winadvanced.views.WindowsAdvancedView.794ef4') }}</div>
            <div class="row q-gutter-lg">
              <q-radio v-model="insiderChannel" val="dev" :label="$t('winadvanced.views.WindowsAdvancedView.4dab1a')" color="negative" />
              <q-radio v-model="insiderChannel" val="beta" :label="$t('winadvanced.views.WindowsAdvancedView.b7199d')" color="warning" />
              <q-radio v-model="insiderChannel" val="release-preview" :label="$t('winadvanced.views.WindowsAdvancedView.ac1e31')" color="positive" />
              <q-radio v-model="insiderChannel" val="none" :label="$t('winadvanced.views.WindowsAdvancedView.de36bd')" color="grey" />
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">{{ $t('winadvanced.views.WindowsAdvancedView.011e47') }}</div>
            <q-select
              v-model="insiderDevices"
              multiple use-chips
              :options="insiderDeviceOptions"
              :label="$t('winadvanced.views.WindowsAdvancedView.24ff2d')"
              outlined dense class="q-mb-md"
              emit-value map-options
            />
            <q-toggle v-model="insiderAutoUpdate" :label="$t('winadvanced.views.WindowsAdvancedView.573c3b')" />
            <q-toggle v-model="insiderDiagnostic" :label="$t('winadvanced.views.WindowsAdvancedView.13b4c3')" class="q-mt-sm" />
          </q-card-section>
        </q-card>

        <!-- Current enrollment status -->
        <q-table :rows="insiderStatus" :columns="insiderColumns" dense row-key="agent_id" :rows-per-page-options="[10,25]" flat bordered>
          <template v-slot:body-cell-channel="props">
            <q-td :props="props">
              <q-chip dense :color="props.value === 'Dev' ? 'negative' : props.value === 'Beta' ? 'warning' : props.value === 'Release Preview' ? 'positive' : 'grey'" text-color="white" size="sm">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="text-center q-pa-md text-grey">{{ $t('winadvanced.views.WindowsAdvancedView.5c0f8f') }}</div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Desktop Analytics (#886-888) -->
      <q-tab-panel name="analytics">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.b0474c') }}</div>
            <div class="mdm-section-subtitle">{{ $t('winadvanced.views.WindowsAdvancedView.796632') }}</div>
          </div>
          <q-btn outline color="primary" icon="open_in_new" :label="$t('winadvanced.views.WindowsAdvancedView.515383')" href="https://portal.azure.com" target="_blank" />
        </div>

        <!-- Readiness overview (#886) -->
        <div class="row q-gutter-md q-mb-md">
          <q-card v-for="stat in analyticsStats" :key="stat.label" flat bordered class="col">
            <q-card-section class="text-center">
              <q-icon :name="stat.icon" :color="stat.color" size="2rem" />
              <div class="text-h4 q-mt-xs">{{ stat.value }}</div>
              <div class="text-caption">{{ stat.label }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Update readiness table (#887) -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ $t('winadvanced.views.WindowsAdvancedView.5cac8d') }}</div>
            <q-table :rows="updateReadiness" :columns="readinessColumns" dense row-key="device" :rows-per-page-options="[10,25]">
              <template v-slot:body-cell-readiness="props">
                <q-td :props="props">
                  <q-chip dense :color="props.value === 'Ready' ? 'positive' : props.value === 'In Progress' ? 'warning' : 'negative'" text-color="white" size="sm">{{ props.value }}</q-chip>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Update statistics (#888) -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ $t('winadvanced.views.WindowsAdvancedView.156e09') }}</div>
            <div class="row q-gutter-md">
              <div v-for="stat in deploymentStats" :key="stat.update" class="col-12 col-md-5">
                <div class="row items-center q-mb-xs">
                  <span class="text-body2 col">{{ stat.update }}</span>
                  <span class="text-caption text-grey">{{ stat.installed }}/{{ stat.total }}</span>
                </div>
                <q-linear-progress :value="stat.installed / stat.total" color="primary" rounded style="height:8px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Feature Experience Pack (#890) -->
      <q-tab-panel name="feature-pack">
        <q-banner v-if="featurePackLoadError" rounded dense class="bg-warning text-dark q-mb-md">{{ featurePackLoadError }}</q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.1375b4') }}</div>
            <div class="mdm-section-subtitle">{{ $t('winadvanced.views.WindowsAdvancedView.eff98f') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn outline color="warning" icon="undo" label="Revoke" @click="revokeFeaturePack" />
            <q-btn outline color="primary" :label="$t('winadvanced.views.WindowsAdvancedView.44a04c')" @click="applyFeaturePack" />
            <q-btn color="primary" icon="save" :label="$t('winadvanced.views.WindowsAdvancedView.c6606c')" @click="saveFeaturePackConfig" />
          </div>
        </div>

        <div class="row q-gutter-md">
          <div v-for="category in featureCategories" :key="category.name" class="col-12 col-md-5">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">{{ category.name }}</div>
                <q-list dense>
                  <q-item v-for="feature in category.features" :key="feature.id" dense>
                    <q-item-section avatar>
                      <q-icon :name="feature.icon" size="20px" :color="feature.enabled ? 'primary' : 'grey'" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ feature.name }}</q-item-label>
                      <q-item-label caption>{{ feature.description }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle v-model="feature.enabled" dense color="primary" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- Update Rings (#862-864) -->
      <q-tab-panel name="update-rings">
        <div class="row items-center justify-between q-mb-md">
          <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.89bac9') }}</div>
          <q-btn color="primary" icon="add" :label="$t('winadvanced.views.WindowsAdvancedView.66c41a')" @click="showUpdateRingDialog()" />
        </div>
        <q-table :rows="updateRings" :columns="updateRingColumns" dense row-key="id" :loading="loadingUpdateRings">
          <template v-slot:body-cell-ring="props">
            <q-td :props="props">
              <q-chip dense :color="{ pilot: 'deep-orange', broad: 'primary', critical: 'grey' }[props.value] ?? 'grey'" text-color="white">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props"><q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">{{ props.value ? 'Active' : 'Off' }}</q-chip></q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="rocket_launch" size="sm" color="primary" @click="deployUpdateRing(props.row)"><q-tooltip>{{ $t('winadvanced.views.WindowsAdvancedView.a7effe') }}</q-tooltip></q-btn>
              <q-btn flat dense round icon="undo" size="sm" color="warning" @click="revokeWinAdvancedPolicy('update_ring', props.row)"><q-tooltip>Revoke Update Ring from devices</q-tooltip></q-btn>
              <q-btn flat dense round icon="edit" size="sm" @click="showUpdateRingDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteWinAdvancedPolicy('update_ring', props.row, loadUpdateRings)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Kiosk Analytics (#881) -->
      <q-tab-panel name="kiosk-analytics">
        <div class="row items-center justify-between q-mb-md">
          <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.1e9010') }}</div>
          <q-btn flat round icon="refresh" :loading="loadingKioskAnalytics" @click="loadKioskAnalytics" />
        </div>
        <q-table
          :rows="kioskAnalyticsData"
          :columns="kioskAnalyticsColumns"
          dense row-key="agent_id"
          :loading="loadingKioskAnalytics"
          :no-data-label="$t('winadvanced.views.WindowsAdvancedView.241cf6')"
        >
          <template v-slot:body-cell-app_crashes="props">
            <q-td :props="props">
              <q-badge :color="props.value > 0 ? 'negative' : 'positive'" :label="props.value" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="refresh" size="sm" @click="refreshKioskAnalytics(props.row.agent_id)">
                <q-tooltip>{{ $t('winadvanced.views.WindowsAdvancedView.fd2f95') }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Kiosk Mode Policy (func #896-898) -->
      <q-tab-panel name="kiosk">
        <KioskModePolicyPanel />
      </q-tab-panel>

      <!-- Credential Guard (#896-900) -->
      <q-tab-panel name="credential-guard">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.1e0d3f') }}</div>
            <div class="mdm-section-subtitle">{{ $t('winadvanced.views.WindowsAdvancedView.5975ce') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn flat round icon="refresh" :loading="loadingCredGuard" @click="loadCredentialGuard" />
            <q-btn color="positive" icon="lock" :label="$t('winadvanced.views.WindowsAdvancedView.5193d0')" @click="bulkCredGuard('enable')" />
            <q-btn color="negative" icon="lock_open" :label="$t('winadvanced.views.WindowsAdvancedView.6ce769')" @click="bulkCredGuard('disable')" />
          </div>
        </div>
        <q-table :rows="credGuardData" :columns="credGuardColumns" dense row-key="agent_id" :loading="loadingCredGuard"
          :no-data-label="$t('winadvanced.views.WindowsAdvancedView.3f0f90')">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value === true ? 'positive' : props.value === false ? 'negative' : 'grey'" text-color="white">
                {{ props.value === true ? 'Enabled' : props.value === false ? 'Disabled' : 'Unknown' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-running="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'check_circle' : 'cancel'" :color="props.value ? 'positive' : 'grey'" />
            </q-td>
          </template>
          <template v-slot:body-cell-secure_boot="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'verified' : 'block'" :color="props.value ? 'positive' : 'warning'" />
            </q-td>
          </template>
          <template v-slot:body-cell-tpm_present="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'check' : 'close'" :color="props.value ? 'positive' : 'negative'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="refresh" size="sm" @click="refreshCredGuard(props.row.agent_id)">
                <q-tooltip>{{ $t('winadvanced.views.WindowsAdvancedView.ade15a') }}</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="vpn_key" size="sm" color="primary" @click="checkCredentialUsage(props.row.agent_id)">
                <q-tooltip>Check credential usage</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="lock" size="sm" color="positive" @click="toggleCredGuard(props.row.agent_id, 'enable')">
                <q-tooltip>{{ $t('winadvanced.views.WindowsAdvancedView.a6eade') }}</q-tooltip>
              </q-btn>
              <q-btn flat dense round icon="lock_open" size="sm" color="warning" @click="toggleCredGuard(props.row.agent_id, 'disable')">
                <q-tooltip>{{ $t('winadvanced.views.WindowsAdvancedView.1d46b1') }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- TPM / Secure Boot (#905) -->
      <q-tab-panel name="tpm">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('winadvanced.views.WindowsAdvancedView.5adfd8') }}</div>
            <div class="mdm-section-subtitle">{{ $t('winadvanced.views.WindowsAdvancedView.48f02f') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn flat round icon="refresh" :loading="loadingTPM" @click="loadTPM" />
            <q-btn outline color="primary" icon="security_update_good" :label="$t('winadvanced.views.WindowsAdvancedView.fab254')" @click="checkAllTPM" />
          </div>
        </div>

        <!-- Summary cards -->
        <div class="row q-gutter-md q-mb-md">
          <q-card flat bordered class="col-auto">
            <q-card-section class="text-center q-pa-sm">
              <q-icon name="memory" size="2rem" color="primary" />
              <div class="text-h4 text-weight-bold">{{ tpmData.filter(d => d.tpm_present).length }}</div>
              <div class="text-caption">{{ $t('winadvanced.views.WindowsAdvancedView.bd4cdb') }}</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col-auto">
            <q-card-section class="text-center q-pa-sm">
              <q-icon name="verified" size="2rem" color="positive" />
              <div class="text-h4 text-weight-bold">{{ tpmData.filter(d => d.secure_boot_enabled).length }}</div>
              <div class="text-caption">{{ $t('winadvanced.views.WindowsAdvancedView.9dadc0') }}</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col-auto">
            <q-card-section class="text-center q-pa-sm">
              <q-icon name="warning" size="2rem" color="warning" />
              <div class="text-h4 text-weight-bold">{{ tpmData.filter(d => !d.tpm_present || !d.secure_boot_enabled).length }}</div>
              <div class="text-caption">{{ $t('winadvanced.views.WindowsAdvancedView.30ce4c') }}</div>
            </q-card-section>
          </q-card>
        </div>

        <q-table :rows="tpmData" :columns="tpmColumns" dense row-key="agent_id" :loading="loadingTPM"
          no-data-label="No data — click 'Check All' to trigger a status report from agents">
          <template v-slot:body-cell-tpm_present="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'check_circle' : 'cancel'" :color="props.value ? 'positive' : 'negative'" />
            </q-td>
          </template>
          <template v-slot:body-cell-tpm_enabled="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'check' : 'close'" :color="props.value ? 'positive' : 'grey'" />
            </q-td>
          </template>
          <template v-slot:body-cell-secure_boot_enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'negative'" text-color="white">
                {{ props.value ? 'On' : 'Off' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-uefi_firmware="props">
            <q-td :props="props">
              <q-icon :name="props.value ? 'verified' : 'block'" :color="props.value ? 'positive' : 'warning'" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

    </q-tab-panels>

    <!-- Agent Picker Dialog -->
    <q-dialog v-model="agentPickerOpen" persistent>
      <q-card style="min-width: 520px; max-width: 640px; max-height: 90vh; display: flex; flex-direction: column;">
        <q-bar class="bg-primary text-white">
          <q-icon name="devices" class="q-mr-sm" />
          <span class="text-weight-medium">{{ agentPickerTitle }}</span>
          <q-space />
          <q-btn dense flat round icon="close" @click="agentPickerOpen = false" />
        </q-bar>

        <q-card-section class="q-pb-xs">
          <div class="text-caption text-grey-7 q-mb-sm">{{ agentPickerSubtitle }}</div>
          <q-input
            v-model="agentPickerFilter"
            :placeholder="$t('winadvanced.views.WindowsAdvancedView.580d45')"
            dense outlined clearable
            :loading="agentPickerLoading"
          >
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </q-card-section>

        <!-- Select all row -->
        <q-card-section class="q-pt-xs q-pb-xs" v-if="agentPickerList.length > 0">
          <div class="row items-center">
            <q-checkbox
              :model-value="agentPickerAllSelected"
              :indeterminate="agentPickerSelected.length > 0 && !agentPickerAllSelected"
              @update:model-value="agentPickerToggleAll"
              :label="$t('winadvanced.views.WindowsAdvancedView.70a647')"
              color="primary"
              dense
            />
            <q-space />
            <q-badge color="primary" :label="`${agentPickerSelected.length} / ${agentPickerList.length} selected`" />
          </div>
          <q-separator class="q-mt-xs" />
        </q-card-section>

        <!-- Agents list -->
        <q-card-section class="q-pa-sm" style="overflow-y: auto; flex: 1; max-height: 380px;">
          <div v-if="agentPickerLoading" class="text-center q-pa-lg">
            <q-spinner-dots size="40px" color="primary" />
            <div class="text-caption q-mt-sm">{{ $t('winadvanced.views.WindowsAdvancedView.92fa6a') }}</div>
          </div>
          <div v-else-if="agentPickerFiltered.length === 0" class="text-center text-grey-5 q-pa-lg">
            <q-icon name="devices_other" size="2rem" />
            <div class="q-mt-sm">{{ agentPickerFilter ? "No devices match filter" : "No Windows devices found" }}</div>
          </div>
          <q-list v-else dense separator>
            <q-item
              v-for="agent in agentPickerFiltered"
              :key="agent.value"
              clickable
              :active="agentPickerSelected.includes(agent.value)"
              active-class="bg-blue-1"
              @click="agentPickerSelected.includes(agent.value)
                ? agentPickerSelected.splice(agentPickerSelected.indexOf(agent.value), 1)
                : agentPickerSelected.push(agent.value)"
            >
              <q-item-section side>
                <q-checkbox
                  :model-value="agentPickerSelected.includes(agent.value)"
                  @update:model-value="(v) => v ? agentPickerSelected.push(agent.value) : agentPickerSelected.splice(agentPickerSelected.indexOf(agent.value), 1)"
                  dense color="primary"
                  @click.stop
                />
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="computer" :color="agentPickerSelected.includes(agent.value) ? 'primary' : 'grey-5'" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ agent.label }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ agent.sublabel || agent.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat :label="$t('winadvanced.views.WindowsAdvancedView.77dfd2')" @click="agentPickerOpen = false" />
          <q-btn
            color="primary"
            :label="agentPickerSelected.length === 0 ? 'Run on all devices' : `Run on ${agentPickerSelected.length} device(s)`"
            :icon="agentPickerSelected.length === 0 ? 'devices' : 'play_arrow'"
            @click="agentPickerConfirm"
            :disable="agentPickerLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Generic Policy Dialog (simplified) -->
    <q-dialog v-model="genericDialogOpen" persistent>
      <q-card style="min-width:500px">
        <q-bar>{{ genericDialogTitle }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="genericForm.name" :label="$t('winadvanced.views.WindowsAdvancedView.d145bb')" outlined dense />
          <q-toggle v-if="'enabled' in genericForm" v-model="genericForm.enabled" :label="$t('winadvanced.views.WindowsAdvancedView.df174a')" />
          <component :is="'div'" v-if="extraFields.length > 0">
            <template v-for="field in extraFields" :key="field.key">
              <div v-if="shouldShowGenericField(field)" class="q-mb-sm">
                <q-input v-if="field.type === 'text'" v-model="genericForm[field.key]" :label="field.label" outlined dense />
                <q-input v-else-if="field.type === 'number'" v-model.number="genericForm[field.key]" :label="field.label" outlined dense type="number" />
                <q-input v-else-if="field.type === 'textarea'" v-model="genericForm[field.key]" :label="field.label" outlined dense type="textarea" autogrow />
                <q-select
                  v-else-if="field.type === 'select'"
                  v-model="genericForm[field.key]"
                  :options="field.options"
                  :label="field.label"
                  outlined dense emit-value map-options
                  @update:model-value="handleGenericFieldUpdate(field.key)"
                />
                <q-select
                  v-else-if="field.type === 'agent-select'"
                  v-model="genericForm[field.key]"
                  :options="genericAgentOptions"
                  :label="field.label"
                  outlined dense emit-value map-options clearable
                />
                <q-select
                  v-else-if="field.type === 'site-select'"
                  v-model="genericForm[field.key]"
                  :options="genericSiteOptions"
                  :label="field.label"
                  outlined dense emit-value map-options clearable
                />
                <q-toggle v-else-if="field.type === 'toggle'" v-model="genericForm[field.key]" :label="field.label" />
              </div>
            </template>
          </component>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('winadvanced.views.WindowsAdvancedView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingGeneric ? 'Save' : 'Create'" @click="saveGeneric" :loading="savingGeneric" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const MaintenanceWindowsPanel = defineAsyncComponent(
  () => import("@/winadvanced/components/MaintenanceWindowsPanel.vue")
);
const RebootPolicyPanel = defineAsyncComponent(
  () => import("@/winadvanced/components/RebootPolicyPanel.vue")
);
const KioskModePolicyPanel = defineAsyncComponent(
  () => import("@/winadvanced/components/KioskModePolicyPanel.vue")
);

const $q = useQuasar();

async function optionalGet(url: string) {
  return axios.get(url, {
    validateStatus: (status) => status === 200 || status === 404,
  });
}
const tab = ref("vuln");
const vulnTab = ref("scans");

const vulnScans = ref<any[]>([]);
const vulnPolicies = ref<any[]>([]);
const vulnSummary = ref<any>({ open_by_severity: {} });
const eventLogs = ref<any[]>([]);
const retentionPolicies = ref<any[]>([]);
const correlationRules = ref<any[]>([]);
const correlationMatches = ref<any[]>([]);
const autopilotProfiles = ref<any[]>([]);
const wslPolicies = ref<any[]>([]);
const windowsHelloPolicies = ref<any[]>([]);
const wdacPolicies = ref<any[]>([]);
const baselines = ref<any[]>([]);
const customEventLogName = ref("MDMCustom");
const customEventSource = ref("MDMCustom");
const customEventBusy = ref(false);
const wslDistroName = ref("Ubuntu");
const wslDistroBusy = ref(false);

const loadingVuln = ref(false);
const loadingLogs = ref(false);
const loadingCorrelation = ref(false);
const correlationBusy = ref(false);
const loadingAutopilot = ref(false);
const loadingWSL = ref(false);
const loadingWindowsHello = ref(false);
const loadingWDAC = ref(false);
const loadingBaselines = ref(false);

const vulnFilter = ref({ severity: null, status: null, agent_id: "" });
const logFilter = ref({ agent_id: "", level: null, source: "", event_id: "", date_from: "", date_to: "" });

// Generic Dialog
const genericDialogOpen = ref(false);
const genericDialogTitle = ref("");
const editingGeneric = ref<any>(null);
const savingGeneric = ref(false);
const genericForm = ref<any>({ name: "", enabled: true });
const extraFields = ref<any[]>([]);
const currentEndpoint = ref("");
const genericAgentOptions = ref<{ label: string; value: string }[]>([]);
const genericSiteOptions = ref<{ label: string; value: number }[]>([]);

function vulnSevColor(sev: string) { return { critical: "negative", high: "deep-orange", medium: "warning", low: "info", info: "grey" }[sev] ?? "grey"; }
function logLevelColor(level: string) { return { critical: "negative", error: "negative", warning: "warning", information: "info", verbose: "grey" }[level] ?? "grey"; }

const sevOptions = [{ label: "Critical", value: "critical" }, { label: "High", value: "high" }, { label: "Medium", value: "medium" }, { label: "Low", value: "low" }];
const vulnStatusOptions = [{ label: "Open", value: "open" }, { label: "Remediated", value: "remediated" }, { label: "Accepted", value: "accepted" }, { label: "False Positive", value: "false_positive" }];
const logLevelOptions = [{ label: "Critical", value: "critical" }, { label: "Error", value: "error" }, { label: "Warning", value: "warning" }, { label: "Information", value: "information" }, { label: "Verbose", value: "verbose" }];

const vulnColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left", sortable: true },
  { name: "cve_id", label: "CVE", field: "cve_id", align: "left" },
  { name: "title", label: "Title", field: "title", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "cvss_score", label: "CVSS", field: "cvss_score", align: "center" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const vulnPolicyColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const logColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "event_id", label: "Event ID", field: "event_id", align: "center" },
  { name: "source", label: "Source", field: "source", align: "left" },
  { name: "level", label: "Level", field: "level", align: "center" },
  { name: "message", label: "Message", field: "message", align: "left", classes: "ellipsis", style: "max-width:300px" },
  { name: "occurred_at", label: "Occurred", field: "occurred_at", align: "left", sortable: true },
];
const retentionColumns = [
  { name: "log_name", label: "Log Name", field: "log_name", align: "left" },
  { name: "retention_days", label: "Days", field: "retention_days", align: "center" },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
];
const correlationRuleColumns = [
  { name: "name", label: "Rule", field: "name", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "window_minutes", label: "Window", field: "window_minutes", align: "center" },
  { name: "threshold", label: "Threshold", field: "threshold", align: "center" },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const correlationMatchColumns = [
  { name: "created_at", label: "Detected", field: "created_at", align: "left", sortable: true },
  { name: "rule_name", label: "Rule", field: "rule_name", align: "left" },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "matched_event_count", label: "Events", field: "matched_event_count", align: "center" },
  { name: "matched_event_ids", label: "Event IDs", field: (r: any) => (r.matched_event_ids || []).join(", "), align: "left" },
];
const autopilotColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "oobe_type", label: "OOBE Type", field: "oobe_type", align: "center" },
  { name: "domain_join_type", label: "Domain Join", field: "domain_join_type", align: "center" },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const wslColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "wsl_enabled", label: "WSL", field: "wsl_enabled", align: "center" },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const wdacColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "mode", label: "Mode", field: "mode", align: "center" },
  { name: "signed", label: "Signed", field: (row: any) => row.signing_required || row.signed, align: "center" },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const windowsHelloColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "use_passport_for_work", label: "WHfB", field: "use_passport_for_work", align: "center" },
  { name: "use_security_key_for_signin", label: "FIDO2", field: "use_security_key_for_signin", align: "center" },
  { name: "require_tpm", label: "TPM", field: "require_tpm", align: "center" },
  { name: "min_pin_length", label: "Min PIN", field: "min_pin_length", align: "center" },
  { name: "max_pin_length", label: "Max PIN", field: "max_pin_length", align: "center" },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const baselineColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "baseline_type", label: "Type", field: "baseline_type", align: "center" },
  { name: "version", label: "Version", field: "version", align: "center" },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

async function loadVulnScans() {
  loadingVuln.value = true;
  try {
    const params: any = {};
    if (vulnFilter.value.severity) params.severity = vulnFilter.value.severity;
    if (vulnFilter.value.status) params.status = vulnFilter.value.status;
    if (vulnFilter.value.agent_id) params.agent_id = vulnFilter.value.agent_id;
    vulnScans.value = (await axios.get("/winadvanced/vuln/scans/", { params })).data.results ?? [];
    vulnSummary.value = (await axios.get("/winadvanced/vuln/summary/")).data;
  } finally { loadingVuln.value = false; }
}
async function loadVulnPolicies() {
  vulnPolicies.value = (await axios.get("/winadvanced/vuln/policies/")).data;
}
async function loadEventLogs() {
  loadingLogs.value = true;
  try {
    const params: any = {};
    if (logFilter.value.agent_id) params.agent_id = logFilter.value.agent_id;
    if (logFilter.value.level) params.level = logFilter.value.level;
    if (logFilter.value.source) params.source = logFilter.value.source;
    if (logFilter.value.event_id) params.event_id = logFilter.value.event_id;
    if (logFilter.value.date_from) params.date_from = logFilter.value.date_from;
    if (logFilter.value.date_to) params.date_to = logFilter.value.date_to;
    const res = await axios.get("/winadvanced/eventlogs/", { params });
    eventLogs.value = res.data.results ?? res.data;
  } finally { loadingLogs.value = false; }
}
async function loadRetention() {
  retentionPolicies.value = (await axios.get("/winadvanced/eventlogs/retention/")).data;
}
async function loadCorrelation() {
  loadingCorrelation.value = true;
  try {
    correlationRules.value = (await axios.get("/winadvanced/eventlogs/correlation/rules/")).data;
    const matches = await axios.get("/winadvanced/eventlogs/correlation/matches/");
    correlationMatches.value = matches.data.results ?? matches.data;
  } finally { loadingCorrelation.value = false; }
}
async function loadAutopilot() {
  loadingAutopilot.value = true;
  try { autopilotProfiles.value = (await axios.get("/winadvanced/autopilot/")).data; }
  finally { loadingAutopilot.value = false; }
}
async function loadWSL() {
  loadingWSL.value = true;
  try { wslPolicies.value = (await axios.get("/winadvanced/wsl/")).data; }
  finally { loadingWSL.value = false; }
}
async function loadWindowsHello() {
  loadingWindowsHello.value = true;
  try { windowsHelloPolicies.value = (await axios.get("/winadvanced/windows-hello/")).data; }
  finally { loadingWindowsHello.value = false; }
}
async function loadWDAC() {
  loadingWDAC.value = true;
  try { wdacPolicies.value = (await axios.get("/winadvanced/wdac/")).data; }
  finally { loadingWDAC.value = false; }
}
async function loadBaselines() {
  loadingBaselines.value = true;
  try { baselines.value = (await axios.get("/winadvanced/baselines/")).data; }
  finally { loadingBaselines.value = false; }
}

async function updateVulnStatus(id: number, status: string) {
  await axios.patch(`/winadvanced/vuln/scans/${id}/`, { status });
  $q.notify({ message: `Marked as ${status}`, color: "positive", icon: "check" });
  await loadVulnScans();
}

// Generic dialog functions
function openDialog(title: string, endpoint: string, item: any | null, form: any, fields: any[]) {
  genericDialogTitle.value = title;
  currentEndpoint.value = endpoint;
  editingGeneric.value = item;
  genericForm.value = item ? { ...item } : { ...form };
  extraFields.value = fields;
  if (fields.some((field) => field.type === "agent-select" || field.type === "site-select")) {
    loadGenericTargetOptions();
  }
  genericDialogOpen.value = true;
}

function shouldShowGenericField(field: any) {
  if (!field.showWhen) return true;
  return genericForm.value[field.showWhen.key] === field.showWhen.value;
}

function handleGenericFieldUpdate(key: string) {
  if (key !== "scope") return;
  if (genericForm.value.scope !== "device") genericForm.value.target_agent_id = "";
  if (genericForm.value.scope !== "device_group") genericForm.value.target_device_group_id = null;
}

async function loadGenericTargetOptions() {
  const [agentsResp, sitesResp] = await Promise.allSettled([
    axios.get("/agents/", { params: { detail: "false" } }),
    axios.get("/clients/sites/?leaf=true"),
  ]);
  if (agentsResp.status === "fulfilled") {
    const list = Array.isArray(agentsResp.value.data) ? agentsResp.value.data : (agentsResp.value.data?.results ?? []);
    genericAgentOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        value: agent.agent_id,
        label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
      }));
  }
  if (sitesResp.status === "fulfilled") {
    const list = Array.isArray(sitesResp.value.data) ? sitesResp.value.data : (sitesResp.value.data?.results ?? []);
    genericSiteOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
      }));
  }
}

async function saveGeneric() {
  savingGeneric.value = true;
  try {
    const payload: Record<string, any> = { ...genericForm.value };
    if (currentEndpoint.value.includes("baselines") && Object.prototype.hasOwnProperty.call(payload, "settings_json")) {
      try {
        payload.settings = payload.settings_json ? JSON.parse(payload.settings_json) : {};
      } catch (err: any) {
        $q.notify({ message: `Settings JSON is invalid: ${err?.message || err}`, color: "negative", icon: "error" });
        return;
      }
      delete payload.settings_json;
    }
    if (currentEndpoint.value.includes("wdac") && Object.prototype.hasOwnProperty.call(payload, "custom_rules_json")) {
      try {
        payload.custom_rules = payload.custom_rules_json ? JSON.parse(payload.custom_rules_json) : [];
      } catch (err: any) {
        $q.notify({ message: `Custom rules JSON is invalid: ${err?.message || err}`, color: "negative", icon: "error" });
        return;
      }
      payload.signed = !!payload.signing_required;
      delete payload.custom_rules_json;
    }
    if (currentEndpoint.value.includes("correlation/rules")) {
      const splitCsv = (value: any) => String(value || "").split(",").map((item: string) => item.trim()).filter(Boolean);
      payload.event_ids = splitCsv(payload.event_ids_csv).map((item: string) => parseInt(item, 10)).filter((item: number) => Number.isFinite(item));
      payload.sources = splitCsv(payload.sources_csv);
      payload.log_names = splitCsv(payload.log_names_csv);
      payload.levels = splitCsv(payload.levels_csv).map((item: string) => item.toLowerCase());
      delete payload.event_ids_csv;
      delete payload.sources_csv;
      delete payload.log_names_csv;
      delete payload.levels_csv;
    }
    if (Object.prototype.hasOwnProperty.call(payload, "scope")) {
      if (payload.scope !== "device") payload.target_agent_id = "";
      if (payload.scope !== "device_group") payload.target_device_group_id = null;
    }
    if (editingGeneric.value) {
      await axios.put(`${currentEndpoint.value}${editingGeneric.value.id}/`, payload);
    } else {
      await axios.post(currentEndpoint.value, payload);
    }
    genericDialogOpen.value = false;
    $q.notify({ message: "Saved", color: "positive", icon: "check" });
    // Reload relevant list
    if (currentEndpoint.value.includes("vuln")) await loadVulnPolicies();
    else if (currentEndpoint.value.includes("autopilot")) await loadAutopilot();
    else if (currentEndpoint.value.includes("wsl")) await loadWSL();
    else if (currentEndpoint.value.includes("windows-hello")) await loadWindowsHello();
    else if (currentEndpoint.value.includes("wdac")) await loadWDAC();
    else if (currentEndpoint.value.includes("baselines")) await loadBaselines();
    else if (currentEndpoint.value.includes("correlation/rules")) await loadCorrelation();
  } finally { savingGeneric.value = false; }
}

function showVulnPolicyDialog(item?: any) {
  openDialog(item ? "Edit Scan Policy" : "New Scan Policy", "/winadvanced/vuln/policies/", item || null,
    { name: "", enabled: true, scope: "global" },
    [{ key: "scope", label: "Scope", type: "select", options: [{ label: "Global", value: "global" }] }]
  );
}
function showCorrelationRuleDialog(item?: any) {
  const model = item
    ? {
        ...item,
        event_ids_csv: (item.event_ids || []).join(", "),
        sources_csv: (item.sources || []).join(", "),
        log_names_csv: (item.log_names || []).join(", "),
        levels_csv: (item.levels || []).join(", "),
      }
    : {
        name: "",
        description: "",
        enabled: true,
        event_ids_csv: "",
        sources_csv: "",
        log_names_csv: "Security",
        levels_csv: "error, warning",
        agent_id: "",
        window_minutes: 60,
        threshold: 1,
        require_distinct_event_ids: false,
        severity: "medium",
      };
  openDialog(item ? "Edit Correlation Rule" : "New Correlation Rule", "/winadvanced/eventlogs/correlation/rules/", item ? model : null,
    model,
    [
      { key: "description", label: "Description", type: "textarea" },
      { key: "event_ids_csv", label: "Event IDs (comma-separated)", type: "text" },
      { key: "sources_csv", label: "Sources (comma-separated, optional)", type: "text" },
      { key: "log_names_csv", label: "Log names (comma-separated)", type: "text" },
      { key: "levels_csv", label: "Levels (comma-separated)", type: "text" },
      { key: "agent_id", label: "Agent ID (optional)", type: "text" },
      { key: "window_minutes", label: "Window minutes", type: "number" },
      { key: "threshold", label: "Event threshold", type: "number" },
      { key: "require_distinct_event_ids", label: "Require all Event IDs", type: "toggle" },
      { key: "severity", label: "Severity", type: "select", options: sevOptions },
    ]
  );
}
async function runCorrelation(rule?: any) {
  correlationBusy.value = true;
  try {
    const body = rule?.id ? { rule_id: rule.id } : {};
    const res = await axios.post("/winadvanced/eventlogs/correlation/run/", body);
    $q.notify({ message: `Correlation complete: ${res.data.matches_created || 0} match(es)`, color: "positive", icon: "analytics" });
    await loadCorrelation();
  } finally { correlationBusy.value = false; }
}
async function deleteCorrelationRule(id: number) {
  $q.dialog({ title: "Delete correlation rule?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/winadvanced/eventlogs/correlation/rules/${id}/`);
    await loadCorrelation();
  });
}
function showAutopilotDialog(item?: any) {
  openDialog(item ? "Edit Autopilot" : "New Autopilot Profile", "/winadvanced/autopilot/", item || null,
    { name: "", enabled: true, oobe_type: "user_driven", domain_join_type: "azure_ad",
      domain_name: "", domain_user: "", domain_password: "", ou_path: "", device_naming_template: "", unjoin_allowed: false },
    [
      { key: "oobe_type", label: "OOBE Type", type: "select", options: [{ label: "User Driven", value: "user_driven" }, { label: "Self Deploying", value: "self_deploying" }, { label: "White Glove", value: "white_glove" }] },
      { key: "domain_join_type", label: "Domain Join", type: "select", options: [{ label: "Azure AD", value: "azure_ad" }, { label: "Hybrid AD Join", value: "hybrid" }, { label: "None", value: "none" }] },
      { key: "device_naming_template", label: "Device naming template (%HOSTNAME%, %SERIAL%, %RANDOM%)", type: "text" },
      { key: "domain_name", label: "Domain Name (e.g. lab.internal)", type: "text" },
      { key: "domain_user", label: "Domain Admin Username", type: "text" },
      { key: "domain_password", label: "Domain Admin Password", type: "text" },
      { key: "ou_path", label: "OU Path (e.g. CN=Computers,DC=lab,DC=internal)", type: "text" },
      { key: "unjoin_allowed", label: "Allow Unjoin from Domain", type: "toggle" },
    ]
  );
}
function showWSLDialog(item?: any) {
  openDialog(item ? "Edit WSL Policy" : "New WSL Policy", "/winadvanced/wsl/", item || null,
    { name: "", enabled: true, wsl_enabled: true },
    [{ key: "wsl_enabled", label: "WSL Enabled", type: "toggle" }]
  );
}
function showWindowsHelloDialog(item?: any) {
  openDialog(item ? "Edit Windows Hello Policy" : "New Windows Hello Policy", "/winadvanced/windows-hello/", item || null,
    {
      name: "",
      enabled: true,
      use_passport_for_work: true,
      require_tpm: false,
      use_certificate_for_on_prem_auth: false,
      use_biometrics: true,
      use_security_key_for_signin: false,
      fido2_allowed_aaguids: [],
      min_pin_length: 6,
      max_pin_length: 127,
      require_digits: true,
      require_lowercase: false,
      require_uppercase: false,
      require_special: false,
      expiration_days: 0,
      history: 0,
      scope: "global",
    },
    [
      { key: "scope", label: "Scope", type: "select", options: [{ label: "Global", value: "global" }, { label: "Device", value: "device" }, { label: "Device Group", value: "device_group" }] },
      { key: "use_passport_for_work", label: "Enable Windows Hello for Business", type: "toggle" },
      { key: "require_tpm", label: "Require TPM security device", type: "toggle" },
      { key: "use_certificate_for_on_prem_auth", label: "Use certificate for on-prem authentication", type: "toggle" },
      { key: "use_biometrics", label: "Allow biometrics", type: "toggle" },
      { key: "use_security_key_for_signin", label: "Allow FIDO2 security keys for Windows sign-in", type: "toggle" },
      { key: "min_pin_length", label: "Minimum PIN length", type: "number" },
      { key: "max_pin_length", label: "Maximum PIN length", type: "number" },
      { key: "require_digits", label: "Require digits", type: "toggle" },
      { key: "require_lowercase", label: "Require lowercase letters", type: "toggle" },
      { key: "require_uppercase", label: "Require uppercase letters", type: "toggle" },
      { key: "require_special", label: "Require special characters", type: "toggle" },
      { key: "expiration_days", label: "PIN expiration days (0 = never)", type: "number" },
      { key: "history", label: "PIN history count", type: "number" },
    ]
  );
}
function showWDACDialog(item?: any) {
  const wdacItem = item ? {
    ...item,
    signing_required: item.signing_required || item.signed || false,
    custom_rules_json: JSON.stringify(item.custom_rules || [], null, 2),
  } : null;
  openDialog(item ? "Edit WDAC Policy" : "New WDAC Policy", "/winadvanced/wdac/", wdacItem,
    wdacItem || {
      name: "",
      enabled: true,
      mode: "audit",
      allow_microsoft_signed: true,
      allow_store_apps: true,
      signed: false,
      signing_required: false,
      signing_cert_thumbprint: "",
      timestamp_url: "",
      policy_xml: "",
      custom_rules_json: "[]",
      scope: "global",
    },
    [
      { key: "mode", label: "Mode", type: "select", options: [{ label: "Audit", value: "audit" }, { label: "Enforcement", value: "enforcement" }] },
      { key: "scope", label: "Scope", type: "select", options: [{ label: "Global", value: "global" }, { label: "Device", value: "device" }, { label: "Device Group", value: "device_group" }] },
      { key: "allow_microsoft_signed", label: "Allow Microsoft-signed binaries", type: "toggle" },
      { key: "allow_store_apps", label: "Allow Microsoft Store apps", type: "toggle" },
      { key: "signing_required", label: "Require signed WDAC policy", type: "toggle" },
      { key: "signing_cert_thumbprint", label: "Signing certificate thumbprint", type: "text" },
      { key: "timestamp_url", label: "Timestamp server URL (optional)", type: "text" },
      { key: "policy_xml", label: "Custom WDAC policy XML (optional)", type: "textarea" },
      { key: "custom_rules_json", label: "Custom rules JSON", type: "textarea" },
    ]
  );
}
function showBaselineDialog(item?: any) {
  const baselineItem = item ? { ...item, settings_json: JSON.stringify(item.settings || {}, null, 2) } : null;
  openDialog(item ? "Edit Baseline" : "New Security Baseline", "/winadvanced/baselines/", baselineItem,
    baselineItem || {
      name: "",
      enabled: true,
      baseline_type: "microsoft",
      version: "1.0",
      scope: "global",
      settings_json: JSON.stringify({
        "HKLM\\SOFTWARE\\RMADM\\Baselines\\Microsoft:Enabled": 1,
        "HKLM\\SOFTWARE\\RMADM\\Baselines\\Microsoft:Version": "1.0"
      }, null, 2),
    },
    [
      { key: "baseline_type", label: "Type", type: "select", options: [{ label: "Microsoft", value: "microsoft" }, { label: "CIS Benchmark", value: "cis" }, { label: "NIST", value: "nist" }, { label: "Custom", value: "custom" }] },
      { key: "scope", label: "Scope", type: "select", options: [{ label: "Global", value: "global" }, { label: "Device", value: "device" }, { label: "Device Group", value: "device_group" }] },
      { key: "version", label: "Version", type: "text" },
      { key: "settings_json", label: "Settings JSON", type: "textarea" },
    ]
  );
}
function showRetentionDialog() {
  $q.dialog({
    title: "Add Retention Policy",
    message: "Retention days:",
    prompt: { model: "90", type: "number", label: "Days" },
    cancel: true,
  }).onOk(async (days: string) => {
    await axios.post("/winadvanced/eventlogs/retention/", { retention_days: parseInt(days), enabled: true });
    await loadRetention();
    $q.notify({ message: "Retention policy added", color: "positive", icon: "check" });
  });
}
async function createCustomEventChannel() {
  const logName = customEventLogName.value.trim() || "MDMCustom";
  const source = customEventSource.value.trim() || logName;
  await openAgentPicker(
    `Create Event Channel — ${logName}`,
    "Select Windows devices. Leave all unchecked to run on all listed devices.",
    async (ids: string[]) => {
      const targets = ids.length > 0 ? ids : agentPickerList.value.map((a) => a.value);
      if (targets.length === 0) {
        $q.notify({ message: "No Windows devices selected.", color: "warning", icon: "warning" });
        return;
      }
      customEventBusy.value = true;
      try {
        const resp = await axios.post("/winadvanced/eventlogs/custom-channel/", {
          agent_ids: targets,
          log_name: logName,
          source,
          wait: true,
          timeout: 120,
        });
        const results = resp.data?.results || [];
        const okCount = results.filter((r: any) => r.result?.ok === true || r.result?.stdout?.includes('"ok":true')).length;
        $q.notify({
          message: `Custom channel created on ${okCount || resp.data?.agents_triggered || 0}/${targets.length} device(s).`,
          color: okCount === targets.length ? "positive" : "warning",
          icon: okCount === targets.length ? "check" : "warning",
        });
      } finally {
        customEventBusy.value = false;
      }
    }
  );
}

// ===== Universal Agent Picker =====
const agentPickerOpen = ref(false);
const agentPickerTitle = ref("");
const agentPickerSubtitle = ref("");
const agentPickerSelected = ref<string[]>([]);
const agentPickerCallback = ref<((ids: string[]) => void) | null>(null);
const agentPickerLoading = ref(false);
const agentPickerList = ref<{ label: string; value: string; sublabel: string }[]>([]);
const agentPickerFilter = ref("");

const agentPickerFiltered = computed(() => {
  const q = agentPickerFilter.value.toLowerCase().trim();
  if (!q) return agentPickerList.value;
  return agentPickerList.value.filter(a =>
    a.label.toLowerCase().includes(q) || a.value.toLowerCase().includes(q) || a.sublabel.toLowerCase().includes(q)
  );
});

const agentPickerAllSelected = computed(() =>
  agentPickerList.value.length > 0 && agentPickerSelected.value.length === agentPickerList.value.length
);

async function openAgentPicker(title: string, subtitle: string, callback: (ids: string[]) => void) {
  agentPickerTitle.value = title;
  agentPickerSubtitle.value = subtitle;
  agentPickerSelected.value = [];
  agentPickerFilter.value = "";
  agentPickerCallback.value = callback;
  agentPickerOpen.value = true;
  agentPickerLoading.value = true;
  try {
    const resp = await axios.get("/agents/");
    const raw = Array.isArray(resp.data) ? resp.data : resp.data.agents ?? resp.data.results ?? [];
    agentPickerList.value = raw
      .filter((a: any) => !a.plat || a.plat === "windows")
      .map((a: any) => ({
        label: a.hostname || a.agent_id,
        value: a.agent_id,
        sublabel: [a.operating_system, a.site_name ?? a.site].filter(Boolean).join(" — "),
      }));
  } catch {
    agentPickerList.value = [];
    $q.notify({ message: "Could not load agents list", color: "warning" });
  } finally {
    agentPickerLoading.value = false;
  }
}

function agentPickerToggleAll() {
  agentPickerSelected.value = agentPickerAllSelected.value
    ? []
    : agentPickerList.value.map(a => a.value);
}

function agentPickerConfirm() {
  agentPickerOpen.value = false;
  if (agentPickerCallback.value) {
    agentPickerCallback.value(agentPickerSelected.value);
  }
}
// ========================================

async function runVulnScan(policy: any) {
  await openAgentPicker(
    `Run Scan — ${policy.name}`,
    "Select devices to scan. Leave all unchecked to run on all devices in policy scope.",
    async (ids: string[]) => {
      const resp = await axios.post(`/winadvanced/vuln/policies/${policy.id}/scan/`, { agent_ids: ids });
      $q.notify({
        message: `Scan started on ${(resp.data.agents_triggered ?? ids.length) || "all"} device(s)`,
        color: "positive", icon: "play_arrow",
      });
    }
  );
}
async function deleteVulnPolicy(id: number) { $q.dialog({ title: "Delete?", cancel: true, ok: { color: "negative" } }).onOk(async () => { await axios.delete(`/winadvanced/vuln/policies/${id}/`); await loadVulnPolicies(); }); }
async function deployAutopilot(profile: any, dryRun = true) {
  await openAgentPicker(
    `${dryRun ? "Preview" : "Deploy"} Autopilot — ${profile.name}`,
    dryRun
      ? "Select devices to validate naming/domain payload without changing the endpoint."
      : "Select devices to deploy. Domain join and rename can require a reboot.",
    async (ids: string[]) => {
      const resp = await axios.post(`/winadvanced/autopilot/${profile.id}/deploy/`, {
        agent_ids: ids,
        wait: true,
        timeout: 120,
        dry_run: dryRun,
      });
      const okCount = (resp.data.results || []).filter((r: any) => !r.error).length;
      $q.notify({
        message: `${dryRun ? "Preview" : "Deploy"} completed on ${okCount}/${resp.data.results?.length || resp.data.agents_triggered || 0} device(s)`,
        color: dryRun ? "info" : "positive",
        icon: dryRun ? "fact_check" : "send",
      });
    }
  );
}
async function deployWindowsHello(policy: any) {
  await openAgentPicker(
    `Deploy Windows Hello — ${policy.name}`,
    `PIN length ${policy.min_pin_length}-${policy.max_pin_length}; FIDO2 security keys ${policy.use_security_key_for_signin ? "enabled" : "disabled"}. Select devices to apply this policy.`,
    async (ids: string[]) => {
      const resp = await axios.post(`/winadvanced/windows-hello/${policy.id}/deploy/`, { agent_ids: ids, wait: true, timeout: 120 });
      $q.notify({
        message: `Windows Hello policy applied to ${resp.data.agents_triggered ?? 0} device(s)`,
        color: "positive",
        icon: "fingerprint",
      });
    }
  );
}
async function runWSLDistroAction(action: "deploy" | "update") {
  const distro = wslDistroName.value.trim();
  if (action === "deploy" && !distro) {
    $q.notify({ message: "Distribution name is required for deploy.", color: "negative", icon: "error" });
    return;
  }
  await openAgentPicker(
    `${action === "deploy" ? "Deploy" : "Update"} WSL Distribution`,
    "Select Windows devices. Leave all unchecked to run on all listed devices.",
    async (ids: string[]) => {
      const targets = ids.length > 0 ? ids : agentPickerList.value.map((a) => a.value);
      if (targets.length === 0) {
        $q.notify({ message: "No Windows devices selected.", color: "warning", icon: "warning" });
        return;
      }
      wslDistroBusy.value = true;
      try {
        const results = await Promise.all(targets.map((agentId) =>
          axios.post(`/winadvanced/wsl/${agentId}/distro/`, { action, distro, timeout: 900 })
            .then((resp) => ({ agentId, ok: resp.data?.result?.ok !== false, resp: resp.data }))
            .catch((err) => ({ agentId, ok: false, resp: err?.response?.data || err?.message }))
        ));
        const okCount = results.filter((r) => r.ok).length;
        $q.notify({
          message: `${action === "deploy" ? "Deploy" : "Update"} completed on ${okCount}/${results.length} device(s).`,
          color: okCount === results.length ? "positive" : "warning",
          icon: okCount === results.length ? "check" : "warning",
        });
      } finally {
        wslDistroBusy.value = false;
      }
    }
  );
}
async function deployBaseline(baseline: any) {
  await openAgentPicker(
    `Deploy Baseline — ${baseline.name}`,
    "Select devices to deploy this security baseline to.",
    async (ids: string[]) => {
      const resp = await axios.post(`/winadvanced/baselines/${baseline.id}/deploy/`, { agent_ids: ids, wait: true, timeout: 120 });
      const results = resp.data?.results || [];
      const okCount = results.filter((r: any) => Array.isArray(r.result) ? r.result.every((x: any) => x.status === "applied") : !r.error).length;
      $q.notify({
        message: `Baseline applied on ${okCount}/${results.length || resp.data.agents_triggered || ids.length} device(s)`,
        color: okCount === (results.length || okCount) ? "positive" : "warning",
        icon: okCount === (results.length || okCount) ? "security" : "warning",
      });
    }
  );
}

async function revokeWinAdvancedPolicy(kind: string, row?: any, extraPayload: Record<string, any> = {}) {
  const label = row?.name || kind.replace(/_/g, " ");
  await openAgentPicker(
    `Revoke Policy — ${label}`,
    "Select devices to revoke this policy from. Leave all unchecked to use the policy scope or all Windows devices.",
    async (ids: string[]) => {
      const resp = await axios.post("/winadvanced/policies/revoke/", {
        kind,
        id: row?.id || 0,
        agent_ids: ids,
        disable_record: true,
        wait: true,
        timeout: 120,
        ...extraPayload,
      });
      $q.notify({
        message: `Revoke sent to ${resp.data.agents_triggered ?? 0} device(s)`,
        color: "warning",
        icon: "undo",
      });
      if (kind === "autopilot") await loadAutopilot();
      else if (kind === "wsl") await loadWSL();
      else if (kind === "windows_hello" || kind === "whfb" || kind === "pin") await loadWindowsHello();
      else if (kind === "wdac") await loadWDAC();
      else if (kind === "baseline" || kind === "security_baseline") await loadBaselines();
      else if (kind === "update_ring") await loadUpdateRings();
    }
  );
}

async function deleteWinAdvancedPolicy(kind: string, row: any, reload: () => Promise<void>, extraPayload: Record<string, any> = {}) {
  const label = row?.name || kind.replace(/_/g, " ");
  await openAgentPicker(
    `Delete Policy — ${label}`,
    "Select devices to revoke this policy from before deleting the record. Leave all unchecked to use the policy scope or all Windows devices.",
    async (ids: string[]) => {
      $q.dialog({
        title: "Revoke and delete policy?",
        message: "This first sends a rollback command to endpoints, then removes the policy record from the server.",
        cancel: true,
        ok: { color: "negative", label: "Revoke and delete" },
      }).onOk(async () => {
        const resp = await axios.post("/winadvanced/policies/revoke/", {
          kind,
          id: row?.id || 0,
          agent_ids: ids,
          disable_record: true,
          delete_policy: true,
          wait: true,
          timeout: 180,
          ...extraPayload,
        });
        const errors = (resp.data?.results || []).filter((r: any) => r.error);
        $q.notify({
          message: errors.length
            ? `Policy deleted, but ${errors.length} device rollback(s) reported errors`
            : `Policy revoked and deleted on ${resp.data.agents_triggered ?? 0} device(s)`,
          color: errors.length ? "warning" : "positive",
          icon: errors.length ? "warning" : "delete",
        });
        await reload();
      });
    }
  );
}

// ===== Update Rings (#862-864) =====
const updateRings = ref<any[]>([]);
const loadingUpdateRings = ref(false);
const updateRingColumns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "ring", label: "Ring", field: "ring", align: "center" as const },
  { name: "defer_feature_update_days", label: "Feature Defer (days)", field: "defer_feature_update_days", align: "center" as const },
  { name: "defer_quality_update_days", label: "Quality Defer (days)", field: "defer_quality_update_days", align: "center" as const },
  { name: "include_driver_updates", label: "Drivers", field: "include_driver_updates", align: "center" as const },
  { name: "scope", label: "Scope", field: "scope", align: "center" as const },
  { name: "target", label: "Target", field: updateRingTargetLabel, align: "left" as const },
  { name: "enabled", label: "Status", field: "enabled", align: "center" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];
function updateRingTargetLabel(row: any) {
  if (row.scope === "device") {
    return genericAgentOptions.value.find((option) => option.value === row.target_agent_id)?.label || row.target_agent_id || "No device";
  }
  if (row.scope === "device_group") {
    return genericSiteOptions.value.find((option) => option.value === row.target_device_group_id)?.label || `Device group #${row.target_device_group_id || "-"}`;
  }
  return "All matching Windows devices";
}
async function loadUpdateRings() {
  loadingUpdateRings.value = true;
  try {
    await loadGenericTargetOptions();
    updateRings.value = (await axios.get("/winadvanced/update-rings/")).data;
  }
  finally { loadingUpdateRings.value = false; }
}
function showUpdateRingDialog(item?: any) {
  openDialog(
    item ? "Edit Update Ring" : "New Update Ring",
    "/winadvanced/update-rings/",
    item || null,
    {
      name: "",
      ring: "broad",
      defer_feature_update_days: 0,
      defer_quality_update_days: 0,
      include_driver_updates: true,
      enabled: true,
      scope: "global",
      target_agent_id: "",
      target_device_group_id: null,
    },
    [
      { key: "ring", label: "Ring Type", type: "select", options: [
        { label: "Pilot (Fast)", value: "pilot" },
        { label: "Broad (General)", value: "broad" },
        { label: "Critical (Slow)", value: "critical" },
      ]},
      { key: "scope", label: "Scope", type: "select", options: [
        { label: "Global", value: "global" },
        { label: "Specific Device", value: "device" },
        { label: "Device Group", value: "device_group" },
      ]},
      { key: "target_agent_id", label: "Target device", type: "agent-select", showWhen: { key: "scope", value: "device" } },
      { key: "target_device_group_id", label: "Target device group", type: "site-select", showWhen: { key: "scope", value: "device_group" } },
      { key: "defer_feature_update_days", label: "Feature update defer days", type: "number" },
      { key: "defer_quality_update_days", label: "Quality update defer days", type: "number" },
      { key: "include_driver_updates", label: "Include driver updates", type: "toggle" },
    ],
  );
}
async function deployUpdateRing(ring: any) {
  await openAgentPicker(
    `Deploy Update Ring — ${ring.name}`,
    `Ring: ${ring.ring} | Feature defer: ${ring.defer_feature_update_days}d | Quality defer: ${ring.defer_quality_update_days}d`,
    async (ids: string[]) => {
      const resp = await axios.post(`/winadvanced/update-rings/${ring.id}/deploy/`, { agent_ids: ids });
      $q.notify({
        message: `Update Ring deployed to ${(resp.data.triggered ?? ids.length) || "all"} device(s)`,
        color: "positive", icon: "rocket_launch",
      });
    }
  );
}
async function deleteUpdateRing(id: number) {
  $q.dialog({ title: "Delete ring?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/winadvanced/update-rings/${id}/`);
    await loadUpdateRings();
  });
}

// ===== Credential Guard (#896-900) =====
const credGuardData = ref<any[]>([]);
const loadingCredGuard = ref(false);
const credGuardColumns = [
  { name: "hostname", label: "Host", field: "hostname", align: "left" as const, sortable: true },
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left" as const },
  { name: "enabled", label: "CG Enabled", field: "enabled", align: "center" as const },
  { name: "running", label: "Running", field: "running", align: "center" as const },
  { name: "secure_boot", label: "Secure Boot", field: "secure_boot", align: "center" as const },
  { name: "tpm_present", label: "TPM", field: "tpm_present", align: "center" as const },
  { name: "tpm_version", label: "TPM Ver", field: "tpm_version", align: "center" as const },
  { name: "last_reported", label: "Reported", field: "last_reported", align: "left" as const,
    format: (v: string) => v ? new Date(v).toLocaleString() : "—" },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];
async function loadCredentialGuard() {
  loadingCredGuard.value = true;
  try {
    const r = await optionalGet("/winadvanced/credential-guard/");
    credGuardData.value = r.status === 200 && Array.isArray(r.data) ? r.data : [];
  } finally { loadingCredGuard.value = false; }
}
async function refreshCredGuard(agentId: string) {
  const resp = await axios.post(`/winadvanced/credential-guard/${agentId}/refresh/`, { wait: true, timeout: 30 });
  $q.notify({ message: resp.data?.status === "refresh_completed" ? "Credential Guard status refreshed" : "Refresh requested", color: "info" });
  await loadCredentialGuard();
}
async function checkCredentialUsage(agentId: string) {
  const resp = await axios.post(`/winadvanced/credential-guard/${agentId}/usage/`, { wait: true, timeout: 60 });
  const status = resp.data?.result?.status || "checked";
  const eventCount = resp.data?.result?.event_count ?? "—";
  $q.notify({
    message: `Credential usage ${status}; events in last hour: ${eventCount}`,
    color: status === "suspicious" ? "warning" : "positive",
    icon: status === "suspicious" ? "warning" : "vpn_key",
  });
}
async function toggleCredGuard(agentId: string, action: "enable" | "disable") {
  const resp = await axios.post("/winadvanced/credential-guard/", { action, agent_ids: [agentId], wait: true, timeout: 120 });
  const okCount = (resp.data?.results || []).filter((r: any) => !r.error).length;
  $q.notify({ message: `${action} completed on ${okCount}/${resp.data.agents_triggered || 0} agent(s)`, color: action === "enable" ? "positive" : "warning" });
  await loadCredentialGuard();
}
async function bulkCredGuard(action: "enable" | "disable") {
  $q.dialog({ title: `${action === "enable" ? "Enable" : "Disable"} Credential Guard`, message: "Apply to ALL Windows devices?", cancel: true, ok: { color: action === "enable" ? "positive" : "negative" } })
    .onOk(async () => {
      const resp = await axios.post("/winadvanced/credential-guard/", { action, wait: true, timeout: 120 });
      const okCount = (resp.data?.results || []).filter((r: any) => !r.error).length;
      $q.notify({ message: `${action} completed on ${okCount}/${resp.data.agents_triggered || 0} agent(s)`, color: "info" });
      await loadCredentialGuard();
    });
}

// ===== TPM / Secure Boot (#905) =====
const tpmData = ref<any[]>([]);
const loadingTPM = ref(false);
const tpmColumns = [
  { name: "hostname", label: "Host", field: "hostname", align: "left" as const, sortable: true },
  { name: "tpm_present", label: "TPM", field: "tpm_present", align: "center" as const },
  { name: "tpm_enabled", label: "Enabled", field: "tpm_enabled", align: "center" as const },
  { name: "tpm_version", label: "Version", field: "tpm_version", align: "center" as const },
  { name: "tpm_manufacturer", label: "Manufacturer", field: "tpm_manufacturer", align: "left" as const },
  { name: "secure_boot_enabled", label: "Secure Boot", field: "secure_boot_enabled", align: "center" as const },
  { name: "uefi_firmware", label: "UEFI", field: "uefi_firmware", align: "center" as const },
  { name: "last_reported", label: "Reported", field: "last_reported", align: "left" as const,
    format: (v: string) => v ? new Date(v).toLocaleString() : "—" },
];
async function loadTPM() {
  loadingTPM.value = true;
  try {
    const r = await optionalGet("/winadvanced/tpm/");
    tpmData.value = r.status === 200 && Array.isArray(r.data) ? r.data : [];
  } finally { loadingTPM.value = false; }
}
async function checkAllTPM() {
  loadingTPM.value = true;
  try {
    const resp = await axios.post("/winadvanced/tpm/", { wait: true, timeout: 45 });
    const okCount = (resp.data?.results || []).filter((r: any) => !r.error).length;
    $q.notify({ message: `TPM check completed on ${okCount}/${resp.data.agents_triggered || 0} agent(s)`, color: "info" });
    await loadTPM();
  } finally { loadingTPM.value = false; }
}

// ===== Windows Insider (#866) =====
const insiderChannel = ref("release-preview");
const insiderDevices = ref([]);
const insiderAutoUpdate = ref(true);
const insiderDiagnostic = ref(true);
const insiderDeviceOptions = ref<{ label: string; value: string }[]>([]);
const insiderStatus = ref<any[]>([]);
const insiderColumns = [
  { name: "device", label: "Device", field: "device", align: "left" },
  { name: "user", label: "User", field: "user", align: "left" },
  { name: "channel", label: "Channel", field: "channel", align: "left" },
  { name: "build", label: "Build", field: "build", align: "left" },
  { name: "enrolled", label: "Enrolled", field: "enrolled", align: "left" },
];

// ===== Windows Insider — connect to the real API (#866) =====
async function applyInsiderConfig() {
  try {
    const resp = await axios.post("/winadvanced/insider/apply/", {
      channel: insiderChannel.value,
      devices: insiderDevices.value,
      auto_update: insiderAutoUpdate.value,
      diagnostic_data: insiderDiagnostic.value,
    });
    $q.notify({ message: `Insider '${insiderChannel.value}' applied to ${resp.data.agents_triggered} agents`, color: "positive" });
    await loadInsiderStatus();
  } catch {
    $q.notify({ message: "Failed to apply Insider config", color: "negative" });
  }
}
async function revokeInsiderConfig() {
  await revokeWinAdvancedPolicy("insider", { id: 0, name: "Windows Insider" }, { disable_record: false });
  await loadInsiderStatus();
}
const insiderLoadError = ref("");
async function loadInsiderStatus() {
  insiderLoadError.value = "";
  try {
    const r = await axios.get("/winadvanced/insider/status/");
    const raw = Array.isArray(r.data) ? r.data : [];
    insiderStatus.value = raw.map((row: any, i: number) => ({
      agent_id: row.agent_id || `row-${i}`,
      device: row.hostname || row.agent_id || `device-${i}`,
      user: row.user || "—",
      channel: row.channel,
      build: row.build,
      enrolled: row.enrolled || row.enrolled_at,
    }));
  } catch (e: any) {
    insiderStatus.value = [];
    insiderLoadError.value = e?.response?.data?.error || e?.message || "Failed to load Insider status.";
    $q.notify({ message: insiderLoadError.value, color: "negative" });
  }
}

// ===== Feature Pack — connect to the real API (#890) =====
async function applyFeaturePack() {
  const config = featureCategories.value.flatMap((c) => c.features.map((f: any) => ({ id: f.id, enabled: f.enabled })));
  try {
    const resp = await axios.post("/winadvanced/feature-pack/apply/", { features: config, wait: true, timeout: 120 });
    const first = resp.data?.results?.[0]?.result;
    $q.notify({ message: first || `Feature pack applied to ${resp.data.agents_triggered} agents`, color: "positive" });
  } catch {
    $q.notify({ message: "Failed to apply feature pack", color: "negative" });
  }
}
async function revokeFeaturePack() {
  await revokeWinAdvancedPolicy("feature_pack", { id: 0, name: "Feature Experience Pack" }, { disable_record: false });
}
async function saveFeaturePackConfig() {
  const config = featureCategories.value.flatMap((c) => c.features.map((f: any) => ({ id: f.id, enabled: f.enabled })));
  try {
    await axios.post("/winadvanced/feature-pack/save/", { features: config });
    $q.notify({ message: "Feature pack configuration saved", color: "positive" });
  } catch {
    $q.notify({ message: "Save failed", color: "negative" });
  }
}
const featurePackLoadError = ref("");
async function loadFeaturePackConfig() {
  featurePackLoadError.value = "";
  try {
    const r = await axios.get("/winadvanced/feature-pack/config/");
    if (r.data.features?.length) {
      const savedMap = Object.fromEntries(r.data.features.map((f: any) => [f.id, f.enabled]));
      featureCategories.value.forEach(cat => {
        cat.features.forEach((f: any) => {
          if (f.id in savedMap) f.enabled = savedMap[f.id];
        });
      });
    }
  } catch (e: any) {
    featurePackLoadError.value =
      e?.response?.data?.error || e?.message || "Failed to load the saved feature pack configuration.";
    $q.notify({ message: featurePackLoadError.value, color: "warning" });
  }
}

async function loadInsiderDeviceOptions() {
  try {
    const r = await axios.get("/agents/", { params: { detail: "false" } });
    const data = Array.isArray(r.data) ? r.data : r.data?.results ?? [];
    insiderDeviceOptions.value = data
      .filter((a: any) => a.plat === "windows" || !a.plat)
      .map((a: any) => ({
        label: `${a.hostname || a.agent_id} (${a.agent_id})`,
        value: a.agent_id,
      }));
  } catch {
    insiderDeviceOptions.value = [];
  }
}

onMounted(() => {
  loadVulnScans(); loadVulnPolicies(); loadRetention(); loadCorrelation(); loadAutopilot();
  loadWSL(); loadWindowsHello(); loadWDAC(); loadBaselines();
  loadUpdateRings(); loadKioskAnalytics(); loadCredentialGuard(); loadTPM();
  loadInsiderDeviceOptions();
  loadInsiderStatus(); loadFeaturePackConfig(); loadAnalytics();
});

// ===== Desktop Analytics (#886-888) =====
const loadingAnalytics = ref(false);
const analyticsStats = ref<any[]>([
  { label: "Ready for Update", value: 0, icon: "check_circle", color: "positive" },
  { label: "In Progress", value: 0, icon: "sync", color: "warning" },
  { label: "Issues Detected", value: 0, icon: "error", color: "negative" },
  { label: "Not Started", value: 0, icon: "hourglass_empty", color: "grey" },
]);
const updateReadiness = ref<any[]>([]);
const deploymentStats = ref<any[]>([]);

const readinessColumns = [
  { name: "agent_id", label: "Device", field: (r: any) => r.agent_id || r.device, align: "left" },
  { name: "os", label: "Current OS", field: (r: any) => r.operating_system || r.os, align: "left" },
  { name: "target", label: "Target Version", field: (r: any) => r.target_version || r.target, align: "left" },
  { name: "readiness", label: "Readiness", field: (r: any) => r.readiness || r.update_status, align: "left" },
  { name: "issues", label: "Issues", field: (r: any) => r.issues_count ?? r.issues ?? 0, align: "center" },
];

async function loadAnalytics() {
  loadingAnalytics.value = true;
  try {
    const [statsResp, readinessResp, patchResp] = await Promise.all([
      axios.get("/winadvanced/analytics/stats/").catch(() => null),
      axios.get("/winadvanced/analytics/readiness/").catch(() => null),
      optionalGet("/winupdate/patching/deployment-stats/").catch(() => null),
    ]);
    if (statsResp?.data) {
      const d = statsResp.data;
      analyticsStats.value = [
        { label: "Ready for Update", value: d.ready ?? 0, icon: "check_circle", color: "positive" },
        { label: "In Progress", value: d.in_progress ?? 0, icon: "sync", color: "warning" },
        { label: "Issues Detected", value: d.issues ?? 0, icon: "error", color: "negative" },
        { label: "Not Started", value: d.not_started ?? 0, icon: "hourglass_empty", color: "grey" },
      ];
    }
    if (readinessResp?.data) updateReadiness.value = readinessResp.data;
    deploymentStats.value =
      patchResp?.status === 200 && Array.isArray(patchResp.data)
        ? patchResp.data
        : [];
  } finally {
    loadingAnalytics.value = false;
  }
}

// ===== Kiosk Analytics (#881) =====
const loadingKioskAnalytics = ref(false);
const kioskAnalyticsData = ref<any[]>([]);
const kioskAnalyticsColumns = [
  { name: "agent_id", label: "Device", field: "agent_id", align: "left" },
  { name: "kiosk_user", label: "Kiosk User", field: "kiosk_user", align: "left" },
  { name: "session_count", label: "Sessions", field: "session_count", align: "center" },
  { name: "uptime_hours", label: "Uptime (h)", field: "uptime_hours", align: "center" },
  { name: "last_restart", label: "Last Restart", field: "last_restart", align: "left" },
  { name: "app_crashes", label: "Crashes", field: "app_crashes", align: "center" },
  { name: "reported_at", label: "Reported", field: "reported_at", align: "left" },
];

async function loadKioskAnalytics() {
  loadingKioskAnalytics.value = true;
  try {
    const r = await axios.get("/winadvanced/kiosk/analytics/").catch(() => null);
    if (r?.data) kioskAnalyticsData.value = r.data;
  } finally {
    loadingKioskAnalytics.value = false;
  }
}

async function refreshKioskAnalytics(agentId: string) {
  try {
    await axios.post(`/winadvanced/kiosk/${agentId}/refresh-analytics/`);
    $q.notify({ message: "Analytics refresh requested", color: "info" });
    setTimeout(loadKioskAnalytics, 3000);
  } catch {
    $q.notify({ message: "Refresh failed", color: "negative" });
  }
}

// ===== Feature Experience Pack (#890) =====
const featureCategories = ref([
  {
    name: "UI & Shell Features",
    features: [
      { id: "snap_layouts", name: "Snap Layouts", description: "Multitasking with snap zones", icon: "view_quilt", enabled: true },
      { id: "widgets", name: "Widgets Panel", description: "News, weather and personal widgets", icon: "widgets", enabled: false },
      { id: "tabs_explorer", name: "File Explorer Tabs", description: "Tabbed browsing in Explorer", icon: "tab", enabled: true },
      { id: "taskbar_overflow", name: "Taskbar Overflow", description: "App overflow menu in taskbar", icon: "more_horiz", enabled: true },
    ],
  },
  {
    name: "Security Features",
    features: [
      { id: "smart_app_control", name: "Smart App Control", description: "Block untrusted and unsigned apps", icon: "verified_user", enabled: true },
      { id: "enhanced_phishing", name: "Enhanced Phishing Protection", description: "Warn when passwords entered on risky sites", icon: "phishing", enabled: true },
      { id: "device_encryption", name: "Device Encryption", description: "Automatic device encryption for consumer SKUs", icon: "lock", enabled: true },
      { id: "passkey_support", name: "Passkey Support", description: "FIDO2 passkey authentication", icon: "fingerprint", enabled: false },
    ],
  },
  {
    name: "Connectivity",
    features: [
      { id: "wifi7", name: "Wi-Fi 7 Support", description: "IEEE 802.11be protocol", icon: "wifi", enabled: false },
      { id: "bluetooth_le", name: "Bluetooth LE Audio", description: "Low energy audio profiles", icon: "bluetooth_audio", enabled: true },
      { id: "usb4", name: "USB4 Bandwidth", description: "Full USB4 v2 bandwidth support", icon: "usb", enabled: true },
    ],
  },
  {
    name: "AI & Productivity",
    features: [
      { id: "copilot", name: "Windows Copilot", description: "AI assistant integration", icon: "psychology", enabled: false },
      { id: "live_captions", name: "Live Captions", description: "Real-time audio captioning", icon: "subtitles", enabled: true },
      { id: "voice_access", name: "Voice Access", description: "Control PC with voice commands", icon: "mic", enabled: false },
    ],
  },
]);

// applyFeaturePack and saveFeaturePackConfig are defined below (async versions with real API)
</script>

<!-- Maintenance + Reboot panels are added as tab-panels below the existing ones -->
