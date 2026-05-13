<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('appmanagement.views.AppManagementView.d38453') }}</div>

    <q-tabs v-model="tab" dense class="q-mb-md" align="left">
      <q-tab name="apps" :label="$t('appmanagement.views.AppManagementView.054982')" icon="apps" />
      <q-tab name="websites" :label="$t('appmanagement.views.AppManagementView.9028fa')" icon="language" />
      <q-tab name="wlan" :label="$t('appmanagement.views.AppManagementView.170de0')" icon="wifi" />
      <q-tab name="vpn" :label="$t('appmanagement.views.AppManagementView.f05fa4')" icon="vpn_key" />
      <q-tab name="ssp" :label="$t('appmanagement.views.AppManagementView.8a1bb5')" icon="person" />
      <q-tab name="user-groups" :label="$t('appmanagement.views.AppManagementView.a34ff8')" icon="group" />
      <q-tab name="app-store" :label="$t('appmanagement.views.AppManagementView.bd9900')" icon="store" />
      <q-tab name="distribution" label="Distribution" icon="system_update_alt" />
      <q-tab name="containers" :label="$t('appmanagement.views.AppManagementView.5f55ba')" icon="inventory_2" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>

      <!-- App Policies -->
      <q-tab-panel name="apps">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">Application Control</div>
            <div class="mdm-section-subtitle">Installed software inventory, install catalog, and launch/install allowlist and blocklist enforcement.</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn outline color="primary" icon="refresh" label="Refresh" :loading="loadingAppInventory || loadingApps" @click="refreshAppManagement" />
            <q-btn color="negative" icon="block" label="New blocklist" @click="showAppDialog('blacklist')" />
            <q-btn color="positive" icon="check_circle" label="New allowlist" @click="showAppDialog('whitelist')" />
          </div>
        </div>

        <div class="appmgmt-summary q-mb-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7">Installed on device</div>
              <div class="text-h5">{{ installedAppRows.length }}</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7">Available apps</div>
              <div class="text-h5">{{ availableAppRows.length }}</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7">Block rules</div>
              <div class="text-h5 text-negative">{{ activeBlockPolicies.length }}</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7">Allow rules</div>
              <div class="text-h5 text-positive">{{ activeAllowPolicies.length }}</div>
            </q-card-section>
          </q-card>
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row q-col-gutter-md items-end">
              <div class="col-12 col-lg-5">
                <q-select
                  v-model="selectedAppAgentId"
                  :options="appAgentOptions"
                  label="Device"
                  outlined dense clearable use-input hide-selected fill-input input-debounce="200"
                  emit-value map-options
                  @filter="filterAppAgents"
                  @update:model-value="loadAppInventory"
                >
                  <template v-slot:prepend><q-icon name="devices" /></template>
                </q-select>
              </div>
              <div class="col-12 col-lg-4">
                <q-input v-model="appInventorySearch" label="Search applications" outlined dense clearable>
                  <template v-slot:prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-12 col-lg-3 row q-gutter-sm">
                <q-btn class="col" color="primary" icon="sync" label="Refresh device inventory" no-caps :disable="!selectedAppAgentId" :loading="refreshingInstalledApps" @click="refreshInstalledApps" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-xl-7">
            <q-card flat bordered class="fit">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div>
                    <div class="text-subtitle2">Installed Applications</div>
                    <div class="text-caption text-grey-7">Software currently reported by the selected endpoint.</div>
                  </div>
                  <div class="row q-gutter-sm">
                    <q-btn outline color="negative" icon="block" label="Block selected" no-caps :disable="selectedInstalledApps.length === 0" @click="quickPolicyFromSelected('blacklist')" />
                    <q-btn outline color="positive" icon="check_circle" label="Allow selected" no-caps :disable="selectedInstalledApps.length === 0" @click="quickPolicyFromSelected('whitelist')" />
                  </div>
                </div>
                <q-table
                  v-model:selected="selectedInstalledApps"
                  :rows="installedAppRows"
                  :columns="installedAppColumns"
                  row-key="row_key"
                  selection="multiple"
                  dense
                  flat
                  bordered
                  :loading="loadingAppInventory"
                  :rows-per-page-options="[10,25,50,100]"
                >
                  <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                      <div class="text-weight-medium">{{ props.row.name }}</div>
                      <div class="text-caption text-grey-7">{{ props.row.publisher || 'Unknown publisher' }}</div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-policy_state="props">
                    <q-td :props="props">
                      <q-chip dense :color="props.row.policy_color" text-color="white">
                        {{ props.row.policy_state }}
                      </q-chip>
                      <div v-if="props.row.policy_reason" class="text-caption text-grey-7 q-mt-xs">
                        {{ props.row.policy_reason }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn flat dense round icon="block" color="negative" @click="quickPolicyFromRows('blacklist', [props.row])">
                        <q-tooltip>Block launch and installation</q-tooltip>
                      </q-btn>
                      <q-btn flat dense round icon="check_circle" color="positive" @click="quickPolicyFromRows('whitelist', [props.row])">
                        <q-tooltip>Add to allowlist</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                  <template v-slot:no-data>
                    <div class="full-width text-center q-pa-lg text-grey">
                      Select a device and refresh inventory to see installed applications.
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-xl-5">
            <q-card flat bordered class="fit">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div>
                    <div class="text-subtitle2">Available Applications</div>
                    <div class="text-caption text-grey-7">Internal apps, app-store links and reusable install policies.</div>
                  </div>
                  <q-btn color="primary" icon="system_update_alt" label="Install selected" no-caps :disable="selectedAvailableApps.length === 0 || !selectedAppAgentId" :loading="installingSelectedApps" @click="installSelectedApps" />
                </div>
                <q-table
                  v-model:selected="selectedAvailableApps"
                  :rows="availableAppRows"
                  :columns="availableAppColumns"
                  row-key="catalog_id"
                  selection="multiple"
                  dense
                  flat
                  bordered
                  :rows-per-page-options="[10,25,50]"
                >
                  <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                      <div class="text-weight-medium">{{ props.row.name }}</div>
                      <div class="text-caption text-grey-7">
                        {{ props.row.category || props.row.source }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-source="props">
                    <q-td :props="props">
                      <q-chip dense color="blue-grey-6" text-color="white">{{ props.row.source }}</q-chip>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-install_state="props">
                    <q-td :props="props">
                      <q-chip dense :color="availableInstallState(props.row).color" text-color="white">
                        {{ availableInstallState(props.row).label }}
                      </q-chip>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn flat dense round icon="system_update_alt" color="primary" :disable="!selectedAppAgentId || !props.row.installable || availableInstallState(props.row).blocked" @click="installAvailableApp(props.row)">
                        <q-tooltip>Install on selected device</q-tooltip>
                      </q-btn>
                      <q-btn flat dense round icon="block" color="negative" @click="quickPolicyFromRows('blacklist', [props.row])">
                        <q-tooltip>Block launch and installation</q-tooltip>
                      </q-btn>
                      <q-btn flat dense round icon="check_circle" color="positive" @click="quickPolicyFromRows('whitelist', [props.row])">
                        <q-tooltip>Add to allowlist</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="row q-gutter-sm q-mb-md items-center">
              <div>
                <div class="text-subtitle2">Application Control Lists</div>
                <div class="text-caption text-grey-7">Blocklist denies launch/install. Allowlist means only listed applications are allowed for matching devices.</div>
              </div>
              <q-space />
              <q-select v-model="appFilter.list_type" :options="[{label:'All',value:''},{label:'Blocklist',value:'blacklist'},{label:'Allowlist',value:'whitelist'}]"
                label="Type" dense outlined emit-value map-options style="min-width:140px" @update:model-value="loadApps" />
            </div>
            <q-table :rows="appPolicies" :columns="appColumns" dense row-key="id" :loading="loadingApps" :rows-per-page-options="[10,25,50]">
          <template v-slot:body-cell-list_type="props">
            <q-td :props="props">
              <q-chip dense :color="props.value === 'blacklist' ? 'negative' : 'positive'" text-color="white">{{ props.value === 'blacklist' ? 'blocklist' : 'allowlist' }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-app_names="props">
            <q-td :props="props">
              <div class="policy-entry-list">
                <q-chip v-for="name in (props.row.app_names || []).slice(0, 4)" :key="name" dense>{{ name }}</q-chip>
                <q-chip v-if="(props.row.app_names || []).length > 4" dense color="grey-4">+{{ (props.row.app_names || []).length - 4 }}</q-chip>
              </div>
              <div v-if="(props.row.app_publishers || []).length" class="text-caption text-grey-7">
                Publishers: {{ props.row.app_publishers.join(', ') }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showAppDialog(props.row.list_type, props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('apps', props.row.id)" />
            </q-td>
          </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- App Distribution Policies (STT 432-439) -->
      <q-tab-panel name="distribution">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">App Distribution</div>
            <div class="mdm-section-subtitle">Scoped install and uninstall policies for managed endpoints.</div>
          </div>
          <q-btn color="primary" icon="add" label="Add distribution" @click="showDistributionDialog()" />
        </div>

        <q-table :rows="appDistributions" :columns="distributionColumns" dense row-key="id" :loading="loadingDistributions">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
                {{ props.value ? 'Enabled' : 'Disabled' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-dry_run="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'warning' : 'primary'" text-color="white">
                {{ props.value ? 'Dry run' : 'Live' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="sync" size="sm" color="teal" @click="refreshDistribution(props.row)" title="Dispatch now" />
              <q-btn flat dense round :icon="props.row.enabled ? 'pause_circle' : 'play_circle'" size="sm" color="primary" @click="toggleDistribution(props.row)" :title="props.row.enabled ? 'Disable' : 'Enable'" />
              <q-btn flat dense round icon="edit" size="sm" @click="showDistributionDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('distribution', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Website Policies -->
      <q-tab-panel name="websites">
        <q-banner v-if="websiteLoadError" rounded dense class="bg-negative text-white q-mb-md">
          {{ websiteLoadError }}
        </q-banner>
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="negative" icon="block" :label="$t('appmanagement.views.AppManagementView.3c0f9c')" @click="showWebsiteDialog('blacklist')" />
          <q-btn color="positive" icon="check_circle" :label="$t('appmanagement.views.AppManagementView.a3b45a')" @click="showWebsiteDialog('whitelist')" />
        </div>
        <q-table :rows="websitePolicies" :columns="websiteColumns" dense row-key="id" :loading="loadingWebsites">
          <template v-slot:body-cell-list_type="props">
            <q-td :props="props">
              <q-chip dense :color="props.value === 'blacklist' ? 'negative' : 'positive'" text-color="white">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showWebsiteDialog(props.row.list_type, props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('websites', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- WLAN -->
      <q-tab-panel name="wlan">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('appmanagement.views.AppManagementView.cd575e')" @click="showWlanDialog()" />
        </div>
        <q-table :rows="wlanProfiles" :columns="wlanColumns" dense row-key="id" :loading="loadingWlan">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="send" size="sm" color="teal" @click="deployWlan(props.row)" :title="$t('appmanagement.views.AppManagementView.5e861b')" />
              <q-btn flat dense round icon="edit" size="sm" @click="showWlanDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('wlan', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- VPN -->
      <q-tab-panel name="vpn">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('appmanagement.views.AppManagementView.1cfec7')" @click="showVpnDialog()" />
        </div>
        <q-table :rows="vpnProfiles" :columns="vpnColumns" dense row-key="id" :loading="loadingVpn">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showVpnDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('vpn', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- SSP -->
      <q-tab-panel name="ssp">
        <div class="text-subtitle1 q-mb-md">{{ $t('appmanagement.views.AppManagementView.81ac96') }}</div>
        <div class="text-caption text-grey q-mb-md">
          {{ $t('appmanagement.views.AppManagementView.4ddc3a') }}
        </div>

        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Portal settings</div>
                <div class="text-caption text-grey">Production URLs, support contacts, privacy terms, and enrollment safety defaults.</div>
              </div>
              <q-btn color="primary" icon="save" label="Save settings" :loading="savingSspSettings" @click="saveSspSettings" />
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.portal_url" label="Portal URL" outlined dense /></div>
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.backend_url" label="Backend URL" outlined dense /></div>
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.support_url" label="Support URL" outlined dense /></div>
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.support_email" label="Support email" outlined dense /></div>
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.support_phone" label="Support phone" outlined dense /></div>
              <div class="col-12 col-md-4"><q-input v-model.number="sspSettings.default_max_devices" label="Default max devices" type="number" outlined dense clearable /></div>
              <div class="col-12 col-md-4"><q-input v-model="sspSettings.database_label" label="Database label" outlined dense /></div>
              <div class="col-12 col-md-8"><q-input v-model="sspSettings.database_host" label="Database host / DSN label" outlined dense /></div>
              <div class="col-12 col-md-4"><q-toggle v-model="sspSettings.allow_self_enrollment" label="Allow self-enrollment" /></div>
              <div class="col-12 col-md-4"><q-toggle v-model="sspSettings.require_privacy_acceptance" label="Require privacy acceptance" /></div>
              <div class="col-12 col-md-4"><q-toggle v-model="sspSettings.allow_full_wipe" label="Allow full wipe from SSP" color="negative" /></div>
              <div class="col-12 col-md-6"><q-input v-model="sspSettings.privacy_terms" label="Privacy terms" outlined dense type="textarea" rows="4" /></div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-sm">
                  <div class="text-subtitle2 q-mb-xs">Connection declarations</div>
                  <div class="text-caption text-grey q-mb-sm">Saved in SSP extra profiles without changing database schema.</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-6"><q-input v-model="sspSettings.extra_profiles.database.host" label="DB host" outlined dense /></div>
                    <div class="col-12 col-md-3"><q-input v-model.number="sspSettings.extra_profiles.database.port" label="DB port" type="number" outlined dense /></div>
                    <div class="col-12 col-md-3"><q-input v-model="sspSettings.extra_profiles.database.ssl_mode" label="SSL mode" outlined dense /></div>
                    <div class="col-12 col-md-6"><q-input v-model="sspSettings.extra_profiles.database.name" label="DB name" outlined dense /></div>
                    <div class="col-12 col-md-6"><q-input v-model="sspSettings.extra_profiles.database.username" label="DB user" outlined dense /></div>
                    <div class="col-12"><q-input v-model="sspSettings.extra_profiles.database.secret_ref" label="Password / secret reference" outlined dense /></div>
                    <div class="col-12 col-md-8"><q-input v-model="sspSettings.extra_profiles.backend.health_path" label="Backend health path" outlined dense /></div>
                    <div class="col-12 col-md-4"><q-input v-model.number="sspSettings.extra_profiles.backend.timeout_seconds" label="Timeout sec" type="number" outlined dense /></div>
                    <div class="col-12"><q-btn outline color="primary" icon="fact_check" label="Validate declarations" @click="validateSspDeclarations" /></div>
                  </div>
                </q-card>
              </div>
              <div class="col-12">
                <q-card flat bordered class="q-pa-sm">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <div class="text-subtitle2">Zero Touch profile</div>
                      <div class="text-caption text-grey q-mb-sm">Pre-registration, auto-configuration, required apps, compliance check, and handoff defaults.</div>
                      <q-toggle v-model="sspSettings.extra_profiles.zero_touch.enabled" label="Enable Zero Touch flow" />
                      <q-toggle v-model="sspSettings.extra_profiles.zero_touch.require_serial" label="Require serial/device ID pre-registration" />
                      <q-input v-model="sspSettings.extra_profiles.zero_touch.required_apps" label="Required app IDs/packages" outlined dense autogrow type="textarea" />
                      <q-input v-model.number="sspSettings.extra_profiles.zero_touch.compliance_interval_minutes" label="Compliance interval minutes" type="number" outlined dense />
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="text-subtitle2">BYOD profile</div>
                      <div class="text-caption text-grey q-mb-sm">Personal-device privacy acceptance, organization container, app catalog, compliance and unsubscribe defaults.</div>
                      <q-toggle v-model="sspSettings.extra_profiles.byod.enabled" label="Enable BYOD enrollment" />
                      <q-toggle v-model="sspSettings.extra_profiles.byod.require_privacy_acceptance" label="Require privacy acceptance" />
                      <q-toggle v-model="sspSettings.extra_profiles.byod.container_required" label="Require organization container" />
                      <q-toggle v-model="sspSettings.extra_profiles.byod.allow_unsubscribe" label="Allow selective deletion / unsubscribe" />
                      <q-input v-model="sspSettings.extra_profiles.byod.container_name" label="Container name" outlined dense />
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12"><q-expansion-item icon="data_object" label="Advanced profile JSON"><q-input v-model="sspExtraProfilesText" outlined dense type="textarea" rows="8" /></q-expansion-item></div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Portal login users</div>
                <div class="text-caption text-grey">
                  Real employee credentials for ssp.mdmlab.ru. GPO/Windows users are managed separately.
                </div>
              </div>
              <q-btn color="primary" icon="person_add" label="Add SSP user" @click="showPortalUserDialog()" />
            </div>
            <q-table :rows="sspPortalUsers" :columns="sspPortalUserColumns" dense row-key="id" :loading="loadingPortalUsers">
              <template v-slot:body-cell-is_active="props">
                <q-td :props="props">
                  <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
                    {{ props.value ? 'Active' : 'Disabled' }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-login="props">
                <q-td :props="props">
                  <div class="text-weight-medium">{{ props.row.username }}</div>
                  <div class="text-caption text-grey">SSP only</div>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="edit" size="sm" @click="showPortalUserDialog(props.row)" />
                  <q-btn
                    flat dense round icon="person_off" size="sm" color="negative"
                    :disable="!props.row.is_active"
                    @click="deactivatePortalUser(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Device registry</div>
                <div class="text-caption text-grey">Employee SSP device records, installer state, and managed agent links.</div>
              </div>
              <q-btn flat color="primary" icon="refresh" label="Refresh" @click="loadSsp" />
            </div>
            <q-table :rows="sspDevices" :columns="sspColumns" dense row-key="id" :loading="loadingSsp">
              <template v-slot:body-cell-is_active="props">
                <q-td :props="props">
                  <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
                    {{ props.value ? 'Active' : 'Inactive' }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-enrollment_status="props">
                <q-td :props="props">
                  <q-chip dense :color="props.row.agent_id ? 'positive' : 'warning'" text-color="white">
                    {{ props.row.agent_id ? 'managed' : props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteItem('ssp', props.row.id)" :title="$t('appmanagement.views.AppManagementView.479e24')" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Enrollment policies</div>
                <div class="text-caption text-grey">Device limits and approved-device lists for SSP enrollment.</div>
              </div>
              <q-btn color="primary" icon="add" label="Add policy" @click="showEnrollmentPolicyDialog()" />
            </div>
            <q-table :rows="sspEnrollmentPolicies" :columns="sspEnrollmentColumns" dense row-key="id" :loading="loadingEnrollmentPolicies">
              <template v-slot:body-cell-enabled="props">
                <q-td :props="props">
                  <q-toggle :model-value="props.row.enabled" dense @update:model-value="(v) => patchEnrollmentPolicy(props.row, { enabled: v })" />
                </q-td>
              </template>
              <template v-slot:body-cell-target="props">
                <q-td :props="props">
                  {{ enrollmentTargetLabel(props.row) }}
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="edit" size="sm" @click="showEnrollmentPolicyDialog(props.row)" />
                  <q-btn flat dense round icon="delete" size="sm" color="negative" @click="removeEnrollmentPolicy(props.row.id)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">App install requests</div>
                <div class="text-caption text-grey">Approve or deny employee SSP app requests. Approval dispatches the install policy to the selected managed device.</div>
              </div>
              <q-btn flat color="primary" icon="refresh" label="Refresh" @click="loadSspInstallRequests" />
            </div>
            <q-table :rows="sspInstallRequests" :columns="sspInstallRequestColumns" dense row-key="id" :loading="loadingSspInstallRequests">
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip dense :color="installRequestStatusColor(props.row.status)" text-color="white">
                    {{ props.row.status }}
                  </q-chip>
                  <div v-if="props.row.last_error" class="text-caption text-negative q-mt-xs">{{ props.row.last_error }}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="info" color="primary" @click="openSspRequestDetails('install', props.row)">
                    <q-tooltip>Show full request details</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat dense round icon="check" color="positive"
                    :disable="props.row.status !== 'pending'"
                    @click="reviewSspInstallRequest(props.row, 'approved')"
                  />
                  <q-btn
                    flat dense round icon="close" color="negative"
                    :disable="props.row.status !== 'pending'"
                    @click="reviewSspInstallRequest(props.row, 'denied')"
                  />
                  <q-btn
                    flat dense round icon="done_all" color="primary"
                    :disable="!['approved', 'installing'].includes(props.row.status)"
                    @click="reviewSspInstallRequest(
                      props.row,
                      props.row.request_type === 'uninstall' ? 'removed' : 'installed'
                    )"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Right and policy requests</div>
                <div class="text-caption text-grey">Review employee requests for access rights, policy exceptions, apps, network, and workspace access.</div>
              </div>
              <q-btn flat color="primary" icon="refresh" label="Refresh" @click="loadSspRightRequests" />
            </div>
            <q-table :rows="sspRightRequests" :columns="sspRightRequestColumns" dense row-key="id" :loading="loadingSspRights">
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip dense :color="rightRequestStatusColor(props.row.status)" text-color="white">{{ props.row.status }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-user="props">
                <q-td :props="props">
                  <div>{{ props.row.user_display_name || props.row.username || `User #${props.row.user_id}` }}</div>
                  <div class="text-caption text-grey">{{ props.row.username }}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="info" color="primary" @click="openSspRequestDetails('right', props.row)">
                    <q-tooltip>Show full request details</q-tooltip>
                  </q-btn>
                  <q-btn flat dense round icon="check" color="positive" :disable="props.row.status !== 'pending'" @click="reviewSspRightRequest(props.row, 'approved')" />
                  <q-btn flat dense round icon="close" color="negative" :disable="props.row.status !== 'pending'" @click="reviewSspRightRequest(props.row, 'denied')" />
                  <q-btn flat dense round icon="remove_circle" color="grey-8" :disable="!['approved', 'pending'].includes(props.row.status)" @click="reviewSspRightRequest(props.row, 'revoked')" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Device action audit</div>
                <div class="text-caption text-grey">Audited SSP lock, reset password, selective wipe, uninstall, unenroll, and lost-device actions.</div>
              </div>
              <q-btn flat color="primary" icon="refresh" label="Refresh" @click="loadSspActions" />
            </div>
            <q-table :rows="sspActions" :columns="sspActionColumns" dense row-key="id" :loading="loadingSspActions">
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip dense :color="sspActionStatusColor(props.row.status)" text-color="white">{{ props.row.status }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-result="props">
                <q-td :props="props">
                  <div class="text-caption ellipsis" style="max-width: 320px">{{ stringify(props.row.result) }}</div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-lg">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle2">Info Portal CMS</div>
                <div class="text-caption text-grey">Manage employee knowledge-base categories and articles shown in the SSP Info Portal.</div>
              </div>
              <div class="q-gutter-sm">
                <q-btn color="primary" icon="category" label="Add category" @click="showInfoCategoryDialog()" />
                <q-btn color="primary" icon="article" label="Add article" @click="showInfoArticleDialog()" />
              </div>
            </div>
            <q-input v-model="sspInfoSearch" dense outlined clearable label="Find information" class="q-mb-md">
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-5">
                <q-table title="Categories" :rows="filteredSspInfoCategories" :columns="sspInfoCategoryColumns" dense row-key="id" :loading="loadingSspInfo">
                  <template v-slot:body-cell-is_active="props">
                    <q-td :props="props"><q-toggle dense :model-value="props.row.is_active" @update:model-value="(v) => patchInfoCategory(props.row, { is_active: v })" /></q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn flat dense round icon="edit" size="sm" @click="showInfoCategoryDialog(props.row)" />
                      <q-btn flat dense round icon="delete" size="sm" color="negative" @click="removeInfoCategory(props.row.id)" />
                    </q-td>
                  </template>
                </q-table>
              </div>
              <div class="col-12 col-md-7">
                <q-table title="Articles" :rows="filteredSspInfoArticles" :columns="sspInfoArticleColumns" dense row-key="id" :loading="loadingSspInfo">
                  <template v-slot:body-cell-is_published="props">
                    <q-td :props="props"><q-toggle dense :model-value="props.row.is_published" @update:model-value="(v) => patchInfoArticle(props.row, { is_published: v })" /></q-td>
                  </template>
                  <template v-slot:body-cell-category="props">
                    <q-td :props="props">{{ infoCategoryLabel(props.row.category) }}</q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn flat dense round icon="edit" size="sm" @click="showInfoArticleDialog(props.row)" />
                      <q-btn flat dense round icon="delete" size="sm" color="negative" @click="removeInfoArticle(props.row.id)" />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-dialog v-model="enrollmentPolicyDialogOpen" persistent>
          <q-card style="min-width: 560px">
            <q-bar>{{ editingEnrollmentPolicy ? 'Edit enrollment policy' : 'Add enrollment policy' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <q-input v-model="enrollmentPolicyForm.name" label="Name" outlined dense />
              <q-toggle v-model="enrollmentPolicyForm.enabled" label="Enabled" />
              <q-select v-model="enrollmentPolicyForm.scope" :options="enrollmentScopeOptions" label="Scope" outlined dense emit-value map-options />
              <q-select
                v-if="enrollmentPolicyForm.scope === 'user'"
                v-model="enrollmentPolicyForm.target_user_id"
                :options="scopeUserOptions"
                label="Target user"
                outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
                @filter="filterScopeUsers"
              />
              <q-select
                v-if="enrollmentPolicyForm.scope === 'user_group'"
                v-model="enrollmentPolicyForm.user_group"
                :options="scopeUserGroupOptions"
                label="Target user group"
                outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
                @filter="filterScopeUserGroups"
              />
              <q-input v-model.number="enrollmentPolicyForm.max_devices" label="Max devices (empty = no limit)" type="number" outlined dense clearable />
              <q-input v-model="enrollmentPolicyForm.approved_agent_ids_text" label="Approved agent IDs" outlined dense type="textarea" autogrow />
              <q-input v-model="enrollmentPolicyForm.approved_serial_numbers_text" label="Approved serial numbers" outlined dense type="textarea" autogrow />
              <q-input v-model="enrollmentPolicyForm.approved_device_names_text" label="Approved device names" outlined dense type="textarea" autogrow />
              <q-input v-model="enrollmentPolicyForm.notes" label="Notes" outlined dense type="textarea" autogrow />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" :loading="savingEnrollmentPolicy" @click="saveEnrollmentPolicy" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="portalUserDialogOpen" persistent>
          <q-card style="min-width: 620px">
            <q-bar>{{ editingPortalUser ? 'Edit SSP login user' : 'Add SSP login user' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <div class="text-caption text-grey q-mb-sm">
                This creates a real portal login for https://ssp.mdmlab.ru and blocks access to the admin dashboard.
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.username" label="Username" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="portalUserForm.password"
                    :label="editingPortalUser ? 'New password (leave blank to keep)' : 'Temporary password'"
                    type="password"
                    outlined dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.first_name" label="First name" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.last_name" label="Last name" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.email" label="Email" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.phone" label="Phone" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.department" label="Department" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.location" label="Location / Office" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.manager" label="Manager" outlined dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.trim="portalUserForm.employee_id" label="Employee ID" outlined dense />
                </div>
              </div>
              <q-toggle v-model="portalUserForm.is_active" label="Active" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" :loading="savingPortalUser" @click="savePortalUser" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="infoCategoryDialogOpen" persistent>
          <q-card style="min-width: 460px">
            <q-bar>{{ editingInfoCategory ? 'Edit category' : 'Add category' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <q-input v-model="infoCategoryForm.title" label="Title" outlined dense />
              <q-input v-model="infoCategoryForm.slug" label="Slug" outlined dense />
              <q-input v-model="infoCategoryForm.icon" label="Icon" outlined dense />
              <q-input v-model.number="infoCategoryForm.sort_order" label="Sort order" type="number" outlined dense />
              <q-toggle v-model="infoCategoryForm.is_active" label="Active" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" :loading="savingSspInfo" @click="saveInfoCategory" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="infoArticleDialogOpen" persistent>
          <q-card style="min-width: 680px">
            <q-bar>{{ editingInfoArticle ? 'Edit article' : 'Add article' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <q-select v-model="infoArticleForm.category" :options="infoCategoryOptions" label="Category" outlined dense emit-value map-options />
              <q-input v-model="infoArticleForm.title" label="Title" outlined dense />
              <q-input v-model="infoArticleForm.icon" label="Icon" outlined dense />
              <q-input v-model.number="infoArticleForm.sort_order" label="Sort order" type="number" outlined dense />
              <q-input v-model="infoArticleForm.body" label="Body" outlined dense type="textarea" rows="8" />
              <q-input v-model="infoArticleForm.link" label="Link" outlined dense />
              <q-input v-model="infoArticleForm.link_label" label="Link label" outlined dense />
              <q-toggle v-model="infoArticleForm.is_published" label="Published" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" :loading="savingSspInfo" @click="saveInfoArticle" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-tab-panel>

      <!-- User Group App Configuration (#410) -->
      <q-tab-panel name="user-groups">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('appmanagement.views.AppManagementView.c8f95f') }}</div>
            <div class="mdm-section-subtitle">{{ $t('appmanagement.views.AppManagementView.4e0352') }}</div>
          </div>
          <q-btn color="primary" icon="save" :label="$t('appmanagement.views.AppManagementView.d17fea')" @click="saveGroupAppAssignments" />
        </div>

        <div class="row q-gutter-md">
          <!-- Group tree -->
          <div class="col-12 col-md-3">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">{{ $t('appmanagement.views.AppManagementView.3056b1') }}</div>
                <q-banner v-if="userGroupsLoadError" dense class="bg-warning text-dark q-mb-sm">{{ userGroupsLoadError }}</q-banner>
                <q-list dense>
                  <q-item
                    v-for="group in userGroups"
                    :key="group.id"
                    clickable v-ripple dense
                    :active="selectedGroup?.id === group.id"
                    active-class="bg-primary text-white"
                    @click="selectedGroup = group"
                  >
                    <q-item-section avatar><q-icon name="group" size="18px" /></q-item-section>
                    <q-item-section>{{ group.display_name || group.name || ('Group #' + group.id) }}</q-item-section>
                    <q-item-section side><q-badge :label="group.site_count" color="grey" /></q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- App assignments for selected group -->
          <div class="col">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t('appmanagement.views.AppManagementView.71fb91') }} <strong>{{ selectedGroup?.name || "Select a group" }}</strong>
                </div>
                <q-table v-if="selectedGroup" :rows="groupAppAssignments" :columns="groupAppColumns" dense row-key="id" :rows-per-page-options="[10,25]">
                  <template v-slot:body-cell-assigned="props">
                    <q-td :props="props">
                      <q-toggle v-model="props.row.assigned" dense @update:model-value="toggleAppForGroup(props.row)" />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-mandatory="props">
                    <q-td :props="props">
                      <q-toggle v-model="props.row.mandatory" dense :disable="!props.row.assigned" />
                    </q-td>
                  </template>
                </q-table>
                <div v-else class="text-center q-pa-lg text-grey">{{ $t('appmanagement.views.AppManagementView.e12a36') }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- App Store Links (#447) -->
      <q-tab-panel name="app-store">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('appmanagement.views.AppManagementView.b3dd80') }}</div>
            <div class="mdm-section-subtitle">{{ $t('appmanagement.views.AppManagementView.7360a7') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn color="primary" icon="upload_file" label="Add internal app" @click="showInternalAppDialog()" />
            <q-btn color="secondary" icon="add_link" :label="$t('appmanagement.views.AppManagementView.05a6cd')" @click="showAddAppStore = true" />
          </div>
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col-12 col-md-4">
                <div class="text-subtitle2">SSP category visibility</div>
                <div class="text-caption text-grey">Enable or hide whole catalog categories for Self-Service users.</div>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="catalogCategoryForToggle"
                  :options="catalogCategoryOptions"
                  dense outlined
                  label="Category"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-toggle v-model="catalogCategoryVisible" label="Visible" />
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  color="primary"
                  icon="visibility"
                  label="Apply"
                  :disable="!catalogCategoryForToggle"
                  :loading="savingCatalogCategory"
                  @click="applyCatalogCategoryVisibility"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Internal app files</div>
            <q-table
              :rows="internalCatalogApps"
              :columns="internalCatalogColumns"
              dense
              row-key="id"
              :loading="loadingInternalCatalog"
              :rows-per-page-options="[5,10,25]"
            >
              <template v-slot:body-cell-visible_in_ssp="props">
                <q-td :props="props">
                  <q-toggle
                    :model-value="props.row.visible_in_ssp"
                    dense
                    @update:model-value="(v) => patchInternalCatalogApp(props.row, { visible_in_ssp: v })"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat dense round icon="edit" size="sm" @click="showInternalAppDialog(props.row)" />
                  <q-btn flat dense round icon="delete" size="sm" color="negative" @click="removeInternalCatalogApp(props.row.id)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <div class="text-subtitle2 q-mb-sm">External app links</div>
        <div class="row q-gutter-md">
          <q-card
            v-for="store in appStoreLinks"
            :key="store.id"
            flat bordered class="col-12 col-md-3"
          >
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <q-avatar size="40px" :color="store.color" text-color="white" class="q-mr-sm">
                  <q-icon :name="store.icon" />
                </q-avatar>
                <div>
                  <div class="text-subtitle2">{{ store.name }}</div>
                  <div class="text-caption text-grey">{{ store.category }}</div>
                </div>
                <q-space />
                <q-btn flat dense icon="delete" color="negative" size="sm" @click="removeAppStore(store.id)" />
              </div>
              <div class="text-caption text-grey q-mb-sm">{{ store.description }}</div>
              <q-btn
                flat dense color="primary" icon="open_in_new" :label="$t('appmanagement.views.AppManagementView.cf9b77')"
                :href="store.url" target="_blank" size="sm"
              />
              <q-toggle
                :model-value="store.visible_in_ssp"
                @update:model-value="(v) => patchAppStoreVisibility(store, v)"
                :label="$t('appmanagement.views.AppManagementView.53f214')"
                dense
                class="q-ml-sm"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Add dialog -->
        <q-dialog v-model="showAddAppStore" persistent>
          <q-card style="min-width: 400px">
            <q-bar>{{ $t('appmanagement.views.AppManagementView.f21eb7') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <q-input v-model="newStore.name" :label="$t('appmanagement.views.AppManagementView.6efb6b')" outlined dense />
              <q-input v-model="newStore.url" :label="$t('appmanagement.views.AppManagementView.dea4fd')" outlined dense placeholder="https://..." type="url" />
              <q-input v-model="newStore.description" :label="$t('appmanagement.views.AppManagementView.55f8eb')" outlined dense />
              <q-select v-model="newStore.category" :options="['Enterprise Software', 'Security Tools', 'Productivity', 'Developer Tools', 'Other']" :label="$t('appmanagement.views.AppManagementView.a3c686')" outlined dense />
              <q-toggle v-model="newStore.visible_in_ssp" :label="$t('appmanagement.views.AppManagementView.fb8abe')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat :label="$t('appmanagement.views.AppManagementView.77dfd2')" v-close-popup />
              <q-btn color="primary" :label="$t('appmanagement.views.AppManagementView.61cc55')" @click="addAppStoreLink" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="internalCatalogDialogOpen" persistent>
          <q-card style="width:820px; max-width:95vw">
            <q-bar>{{ editingInternalCatalogApp ? 'Edit internal app' : 'Add internal app' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <q-input v-model="internalCatalogForm.name" label="Name" outlined dense />
              <q-input v-model="internalCatalogForm.description" label="Description" outlined dense />
              <q-input v-model="internalCatalogForm.category" label="Category" outlined dense />
              <div class="row q-col-gutter-sm">
                <div class="col-6"><q-input v-model="internalCatalogForm.version" label="Version" outlined dense /></div>
                <div class="col-6"><q-input v-model="internalCatalogForm.latest_version" label="Latest version" outlined dense /></div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6"><q-input v-model="internalCatalogForm.platform" label="Platform" outlined dense /></div>
                <div class="col-6"><q-input v-model="internalCatalogForm.retirement_date" label="Retirement date" outlined dense type="date" /></div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="internalCatalogForm.installer"
                    :options="distributionInstallerOptions"
                    label="Installer"
                    outlined
                    dense
                    emit-value
                    map-options
                    @update:model-value="onInternalCatalogInstallerChanged"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="internalCatalogForm.package_id"
                    :label="internalCatalogForm.installer === 'choco' ? 'Selected Chocolatey package ID' : 'Package ID'"
                    outlined
                    dense
                  >
                    <template v-if="internalCatalogForm.installer === 'choco'" v-slot:append>
                      <q-btn
                        flat
                        round
                        dense
                        icon="open_in_new"
                        :disable="!internalCatalogForm.package_id"
                        @click.stop="openChocolateyPackage(internalCatalogForm.package_id)"
                      >
                        <q-tooltip>Open Chocolatey package page</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </div>
              </div>
              <q-card v-if="internalCatalogForm.installer === 'choco'" flat bordered class="distribution-choco-picker">
                <q-card-section class="row items-center q-col-gutter-sm q-pb-sm">
                  <div class="col-12 col-md-8">
                    <q-input v-model="distributionChocoSearch" outlined dense clearable label="Search Chocolatey packages">
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-4 text-right">
                    <q-btn
                      flat
                      color="primary"
                      icon="refresh"
                      label="Refresh"
                      :loading="loadingDistributionChocoPackages"
                      @click="loadDistributionChocoPackages(true)"
                    />
                  </div>
                </q-card-section>
                <q-table
                  class="distribution-choco-table"
                  dense
                  flat
                  virtual-scroll
                  row-key="name"
                  :rows="filteredDistributionChocoPackages"
                  :columns="distributionChocoColumns"
                  :loading="loadingDistributionChocoPackages"
                  v-model:pagination="distributionChocoPagination"
                  :rows-per-page-options="[0]"
                  hide-bottom
                  binary-state-sort
                >
                  <template v-slot:body="props">
                    <q-tr
                      :props="props"
                      :class="{ 'bg-blue-1': props.row.name === internalCatalogForm.package_id }"
                    >
                      <q-td auto-width>
                        <q-btn
                          dense
                          flat
                          round
                          color="primary"
                          icon="add"
                          @click="selectInternalCatalogChocolateyPackage(props.row)"
                        >
                          <q-tooltip>Add package to internal app</q-tooltip>
                        </q-btn>
                      </q-td>
                      <q-td key="name" :props="props">
                        <span
                          class="text-primary text-weight-medium cursor-pointer"
                          @click="selectInternalCatalogChocolateyPackage(props.row)"
                        >
                          {{ props.row.name }}
                        </span>
                      </q-td>
                      <q-td key="version" :props="props">{{ props.row.version || "-" }}</q-td>
                      <q-td key="description" :props="props" class="distribution-choco-description">
                        {{ props.row.description || "-" }}
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-gutter-sm text-grey-7 q-pa-md">
                      <q-icon name="info" />
                      <span>No Chocolatey packages found</span>
                    </div>
                  </template>
                </q-table>
              </q-card>
              <q-input v-model="internalCatalogForm.file_name" label="File name" outlined dense />
              <q-toggle v-model="internalCatalogForm.visible_in_ssp" label="Visible in SSP catalog" />
              <q-toggle v-model="internalCatalogForm.approval_required" label="Requires approval before install/update/uninstall" />
              <q-toggle v-model="internalCatalogForm.force_update_required" label="Upgrade required when latest version is newer" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" :loading="savingInternalCatalog" @click="saveInternalCatalogApp" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-tab-panel>

      <!-- Container File Sharing (#521-522) -->
      <q-tab-panel name="containers">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('appmanagement.views.AppManagementView.cdfaaa') }}</div>
            <div class="mdm-section-subtitle">{{ $t('appmanagement.views.AppManagementView.2c4fe7') }}</div>
          </div>
        </div>

        <div class="row q-gutter-md">
          <!-- Import to Container (#521) -->
          <div class="col-12 col-md-5">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="upload" class="q-mr-xs" color="primary" />
                  {{ $t('appmanagement.views.AppManagementView.9a5d70') }}
                </div>
                <q-select
                  v-model="containerImport.device"
                  :options="agentSelectOptions"
                  :label="$t('appmanagement.views.AppManagementView.0e98ca')"
                  outlined dense class="q-mb-sm"
                  emit-value map-options
                  @update:model-value="loadContainersForDevice"
                />
                <q-select
                  v-model="containerImport.containerId"
                  :options="containerOptions"
                  :label="$t('appmanagement.views.AppManagementView.d18baf')"
                  outlined dense class="q-mb-sm"
                  emit-value map-options
                  :loading="loadingContainers"
                />
                <q-input v-model="containerImport.targetPath" label="Path inside container" outlined dense class="q-mb-sm" placeholder="\\" />
                <q-file v-model="containerImport.file" :label="$t('appmanagement.views.AppManagementView.5c0c87')" outlined dense class="q-mb-sm" accept="*/*">
                  <template v-slot:prepend><q-icon name="attach_file" /></template>
                </q-file>
                <q-btn color="primary" icon="upload" :label="$t('appmanagement.views.AppManagementView.468ebe')" class="full-width" :loading="importingFile" @click="importToContainer" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Extract from Container (#522) -->
          <div class="col-12 col-md-5">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="download" class="q-mr-xs" color="secondary" />
                  {{ $t('appmanagement.views.AppManagementView.d206b7') }}
                </div>
                <q-select
                  v-model="containerExport.device"
                  :options="agentSelectOptions"
                  :label="$t('appmanagement.views.AppManagementView.8e5c94')"
                  outlined dense class="q-mb-sm"
                  emit-value map-options
                  @update:model-value="loadContainersForDevice"
                />
                <q-select
                  v-model="containerExport.containerId"
                  :options="containerOptions"
                  :label="$t('appmanagement.views.AppManagementView.143984')"
                  outlined dense class="q-mb-sm"
                  emit-value map-options
                  :loading="loadingContainers"
                />
                <q-input v-model="containerExport.path" :label="$t('appmanagement.views.AppManagementView.34b0a5')" outlined dense class="q-mb-sm" placeholder="/documents/report.pdf" />
                <q-btn color="secondary" icon="download" :label="$t('appmanagement.views.AppManagementView.04a093')" class="full-width" :loading="exportingFile" @click="extractFromContainer" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Transfer log -->
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">{{ $t('appmanagement.views.AppManagementView.be5aad') }}</div>
                <q-table :rows="containerTransferLog" :columns="containerLogColumns" dense row-key="id" :rows-per-page-options="[10,25]">
                  <template v-slot:body-cell-direction="props">
                    <q-td :props="props">
                      <q-icon :name="props.value === 'import' ? 'upload' : 'download'" :color="props.value === 'import' ? 'primary' : 'secondary'" />
                      {{ props.value }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                      <q-chip dense :color="['Completed','success'].includes(props.value) ? 'positive' : props.value === 'In Progress' ? 'warning' : 'negative'" text-color="white" size="sm">{{ props.value }}</q-chip>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn v-if="props.row.download_url" dense flat color="primary" icon="download" :href="props.row.download_url" target="_blank" />
                    </q-td>
                  </template>
                  <template v-slot:no-data>
                    <div class="text-center q-pa-md text-grey">{{ $t('appmanagement.views.AppManagementView.41560d') }}</div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

    </q-tab-panels>

    <!-- App Policy Dialog -->
    <q-dialog v-model="appDialogOpen" persistent>
      <q-card style="min-width:720px">
        <q-bar>{{ editingApp ? 'Edit' : 'New' }} {{ appDialogType === 'blacklist' ? 'Blocklist' : 'Allowlist' }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="appForm.name" label="Policy name" outlined dense />
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="appForm.scope"
                :options="scopeOptions"
                label="Scope"
                outlined dense emit-value map-options
                @update:model-value="(scope) => resetScopedTarget(appForm, scope)"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-if="appForm.scope === 'device'"
                v-model="appForm.target_agent_id"
                :options="scopeAgentOptions"
                label="Target device"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeAgents"
              />
              <q-select
                v-else-if="appForm.scope === 'device_group'"
                v-model="appForm.target_device_group_id"
                :options="scopeDeviceGroupOptions"
                label="Target device group"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeDeviceGroups"
              />
              <q-select
                v-else-if="appForm.scope === 'user'"
                v-model="appForm.target_user_id"
                :options="scopeUserOptions"
                label="Target user"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeUsers"
              />
              <q-select
                v-else-if="appForm.scope === 'user_group'"
                v-model="appForm.target_user_group_id"
                :options="scopeUserGroupOptions"
                label="Target user group"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeUserGroups"
              />
              <q-input v-else label="Target" model-value="All matching devices" outlined dense readonly />
            </div>
          </div>
          <q-input v-model="appNamesInput" label="Application names / executable names" outlined dense type="textarea" autogrow
            hint="One per line or comma-separated. Examples: chrome.exe, Google Chrome, C:\\Tools\\app.exe"
            @update:model-value="appForm.app_names = textToList(String(appNamesInput || ''))" />
          <q-input v-model="appPublishersInput" label="Publishers" outlined dense type="textarea" autogrow
            hint="Optional. Used for inventory matching and future publisher rules."
            @update:model-value="appForm.app_publishers = textToList(String(appPublishersInput || ''))" />
          <q-input v-model="appHashesInput" label="SHA256 hashes" outlined dense type="textarea" autogrow
            hint="Optional. Used for inventory matching and future hash rules."
            @update:model-value="appForm.app_hashes = textToList(String(appHashesInput || ''))" />
          <div class="row q-gutter-md">
            <q-toggle v-model="appForm.block_app_store" label="Block Microsoft Store" />
            <q-toggle v-model="appForm.enabled" label="Enabled" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="editingApp ? 'Save' : 'Create'" @click="saveApp" :loading="savingApp" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- App Distribution Dialog -->
    <q-dialog v-model="distributionDialogOpen" persistent>
      <q-card style="width:760px; max-width:95vw">
        <q-bar>{{ editingDistribution ? 'Edit' : 'New' }} App Distribution<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="distributionForm.name" label="Name" outlined dense />
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="distributionForm.installer"
                :options="distributionInstallerOptions"
                label="Installer"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="onDistributionInstallerChanged"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select v-model="distributionForm.action" :options="distributionActionOptions" label="Action" outlined dense emit-value map-options />
            </div>
          </div>
          <q-input
            v-if="distributionForm.installer !== 'rawcmd'"
            v-model="distributionForm.package_id"
            :label="distributionForm.installer === 'choco' ? 'Selected Chocolatey package ID' : 'Package ID'"
            outlined
            dense
          >
            <template v-if="distributionForm.installer === 'choco'" v-slot:append>
              <q-btn
                flat
                round
                dense
                icon="open_in_new"
                :disable="!distributionForm.package_id"
                @click.stop="openChocolateyPackage(distributionForm.package_id)"
              >
                <q-tooltip>Open Chocolatey package page</q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <q-card v-if="distributionForm.installer === 'choco'" flat bordered class="distribution-choco-picker">
            <q-card-section class="row items-center q-col-gutter-sm q-pb-sm">
              <div class="col-12 col-md-8">
                <q-input v-model="distributionChocoSearch" outlined dense clearable label="Search Chocolatey packages">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4 text-right">
                <q-btn
                  flat
                  color="primary"
                  icon="refresh"
                  label="Refresh"
                  :loading="loadingDistributionChocoPackages"
                  @click="loadDistributionChocoPackages(true)"
                />
              </div>
            </q-card-section>
            <q-table
              class="distribution-choco-table"
              dense
              flat
              virtual-scroll
              row-key="name"
              :rows="filteredDistributionChocoPackages"
              :columns="distributionChocoColumns"
              :loading="loadingDistributionChocoPackages"
              v-model:pagination="distributionChocoPagination"
              :rows-per-page-options="[0]"
              hide-bottom
              binary-state-sort
            >
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  :class="{ 'bg-blue-1': props.row.name === distributionForm.package_id }"
                >
                  <q-td auto-width>
                    <q-btn
                      dense
                      flat
                      round
                      color="primary"
                      icon="add"
                      @click="selectDistributionChocolateyPackage(props.row)"
                    >
                      <q-tooltip>Add package to distribution</q-tooltip>
                    </q-btn>
                  </q-td>
                  <q-td key="name" :props="props">
                    <span
                      class="text-primary text-weight-medium cursor-pointer"
                      @click="selectDistributionChocolateyPackage(props.row)"
                    >
                      {{ props.row.name }}
                    </span>
                  </q-td>
                  <q-td key="version" :props="props">{{ props.row.version || "-" }}</q-td>
                  <q-td key="description" :props="props" class="distribution-choco-description">
                    {{ props.row.description || "-" }}
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:no-data>
                <div class="full-width row flex-center q-gutter-sm text-grey-7 q-pa-md">
                  <q-icon name="info" />
                  <span>No Chocolatey packages found</span>
                </div>
              </template>
            </q-table>
          </q-card>
          <q-input v-if="distributionForm.installer !== 'rawcmd'" v-model="distributionForm.package_version" label="Package version" outlined dense placeholder="Optional" />
          <q-input v-if="distributionForm.installer === 'rawcmd'" v-model="distributionForm.command" label="PowerShell command" outlined dense type="textarea" autogrow />
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="distributionForm.scope"
                :options="scopeOptions"
                label="Scope"
                outlined dense emit-value map-options
                @update:model-value="(scope) => resetScopedTarget(distributionForm, scope)"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-if="distributionForm.scope === 'device'"
                v-model="distributionForm.target_agent_id"
                :options="scopeAgentOptions"
                label="Target device"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeAgents"
              />
              <q-select
                v-else-if="distributionForm.scope === 'device_group'"
                v-model="distributionForm.target_device_group_id"
                :options="scopeDeviceGroupOptions"
                label="Target device group"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeDeviceGroups"
              />
              <q-select
                v-else-if="distributionForm.scope === 'user'"
                v-model="distributionForm.target_user_id"
                :options="scopeUserOptions"
                label="Target user"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeUsers"
              />
              <q-select
                v-else-if="distributionForm.scope === 'user_group'"
                v-model="distributionForm.target_user_group_id"
                :options="scopeUserGroupOptions"
                label="Target user group"
                outlined dense emit-value map-options use-input hide-selected fill-input input-debounce="200"
                clearable
                @filter="filterScopeUserGroups"
              />
              <q-input v-else label="Target" model-value="All matching agents" outlined dense readonly />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input v-model.number="distributionForm.min_os_build" label="Minimum OS build" outlined dense type="number" clearable />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model.number="distributionForm.max_os_build" label="Maximum OS build" outlined dense type="number" clearable />
            </div>
          </div>
          <q-select
            v-model="distributionForm.required_app_policy_ids"
            :options="appPolicySelectorOptions"
            label="Required application policies"
            outlined dense emit-value map-options multiple use-chips clearable
          />
          <div class="row q-gutter-md">
            <q-toggle v-model="distributionForm.enabled" label="Enabled" />
            <q-toggle v-model="distributionForm.dry_run" label="Dry run" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="editingDistribution ? 'Save' : 'Create'" @click="saveDistribution" :loading="savingDistribution" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- WLAN Dialog -->
    <q-dialog v-model="wlanDialogOpen" persistent>
      <q-card style="min-width:560px">
        <q-bar>{{ editingWlan ? 'Edit' : 'New' }} WLAN Profile<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="wlanForm.name" :label="$t('appmanagement.views.AppManagementView.bc038e')" outlined dense />
          <q-input v-model="wlanForm.ssid" :label="$t('appmanagement.views.AppManagementView.e7e4ea')" outlined dense />
          <q-select v-model="wlanForm.security_type" :options="[{label:'Open',value:'open'},{label:'WPA2',value:'wpa2'},{label:'WPA3',value:'wpa3'},{label:'WPA2 Enterprise',value:'wpa2_enterprise'}]"
            :label="$t('appmanagement.views.AppManagementView.f25ce1')" outlined dense emit-value map-options />
          <q-input v-model="wlanForm.password" :label="$t('appmanagement.views.AppManagementView.8be3c9')" outlined dense type="password" v-if="wlanForm.security_type !== 'open'" />
          <q-toggle v-model="wlanForm.auto_connect" :label="$t('appmanagement.views.AppManagementView.64bcdb')" />
          <q-toggle v-model="wlanForm.hidden_network" :label="$t('appmanagement.views.AppManagementView.dea3c3')" />
          <q-select
            v-model="wlanForm.scope"
            :options="scopeOptions"
            :label="$t('appmanagement.views.AppManagementView.4651a3')"
            outlined dense emit-value map-options
            @update:model-value="(scope) => resetScopedTarget(wlanForm, scope)"
          />
          <q-select
            v-if="wlanForm.scope === 'device'"
            v-model="wlanForm.target_agent_id"
            :options="scopeAgentOptions"
            label="Target device"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeAgents"
          />
          <q-select
            v-else-if="wlanForm.scope === 'device_group'"
            v-model="wlanForm.target_device_group_id"
            :options="scopeDeviceGroupOptions"
            label="Target device group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeDeviceGroups"
          />
          <q-select
            v-else-if="wlanForm.scope === 'user'"
            v-model="wlanForm.target_user_id"
            :options="scopeUserOptions"
            label="Target user"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUsers"
          />
          <q-select
            v-else-if="wlanForm.scope === 'user_group'"
            v-model="wlanForm.target_user_group_id"
            :options="scopeUserGroupOptions"
            label="Target user group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUserGroups"
          />
          <q-input v-else label="Target" model-value="All matching devices" outlined dense readonly />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('appmanagement.views.AppManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingWlan ? 'Save' : 'Create'" @click="saveWlan" :loading="savingWlan" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- VPN Dialog -->
    <q-dialog v-model="vpnDialogOpen" persistent>
      <q-card style="min-width:560px">
        <q-bar>{{ editingVpn ? 'Edit' : 'New' }} VPN Profile<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="vpnForm.name" :label="$t('appmanagement.views.AppManagementView.d145bb')" outlined dense />
          <q-select v-model="vpnForm.vpn_type" :options="[{label:'OpenVPN',value:'openvpn'},{label:'WireGuard',value:'wireguard'},{label:'IPSec/IKEv2',value:'ipsec'},{label:'L2TP',value:'l2tp'},{label:'SSTP',value:'sstp'}]"
            :label="$t('appmanagement.views.AppManagementView.9df2df')" outlined dense emit-value map-options />
          <q-input v-model="vpnForm.server" :label="$t('appmanagement.views.AppManagementView.cb0cb1')" outlined dense />
          <q-input v-model.number="vpnForm.port" :label="$t('appmanagement.views.AppManagementView.fe0351')" outlined dense type="number" />
          <q-select
            v-model="vpnForm.scope"
            :options="scopeOptions"
            :label="$t('appmanagement.views.AppManagementView.4651a3')"
            outlined dense emit-value map-options
            @update:model-value="(scope) => resetScopedTarget(vpnForm, scope)"
          />
          <q-select
            v-if="vpnForm.scope === 'device'"
            v-model="vpnForm.target_agent_id"
            :options="scopeAgentOptions"
            label="Target device"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeAgents"
          />
          <q-select
            v-else-if="vpnForm.scope === 'device_group'"
            v-model="vpnForm.target_device_group_id"
            :options="scopeDeviceGroupOptions"
            label="Target device group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeDeviceGroups"
          />
          <q-select
            v-else-if="vpnForm.scope === 'user'"
            v-model="vpnForm.target_user_id"
            :options="scopeUserOptions"
            label="Target user"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUsers"
          />
          <q-select
            v-else-if="vpnForm.scope === 'user_group'"
            v-model="vpnForm.target_user_group_id"
            :options="scopeUserGroupOptions"
            label="Target user group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUserGroups"
          />
          <q-input v-else label="Target" model-value="All matching devices" outlined dense readonly />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('appmanagement.views.AppManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingVpn ? 'Save' : 'Create'" @click="saveVpn" :loading="savingVpn" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Website Policy Dialog -->
    <q-dialog v-model="websiteDialogOpen" persistent>
      <q-card style="min-width:560px">
        <q-bar>{{ editingWebsite ? 'Edit' : 'New' }} Website Policy ({{ websiteDialogType }})<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="websiteForm.name" :label="$t('appmanagement.views.AppManagementView.d145bb')" outlined dense />
          <q-select
            v-model="websiteForm.scope"
            :options="scopeOptions"
            :label="$t('appmanagement.views.AppManagementView.4651a3')"
            outlined dense emit-value map-options
            @update:model-value="(scope) => resetScopedTarget(websiteForm, scope)"
          />
          <q-select
            v-if="websiteForm.scope === 'device'"
            v-model="websiteForm.target_agent_id"
            :options="scopeAgentOptions"
            label="Target device"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeAgents"
          />
          <q-select
            v-else-if="websiteForm.scope === 'device_group'"
            v-model="websiteForm.target_device_group_id"
            :options="scopeDeviceGroupOptions"
            label="Target device group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeDeviceGroups"
          />
          <q-select
            v-else-if="websiteForm.scope === 'user'"
            v-model="websiteForm.target_user_id"
            :options="scopeUserOptions"
            label="Target user"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUsers"
          />
          <q-select
            v-else-if="websiteForm.scope === 'user_group'"
            v-model="websiteForm.target_user_group_id"
            :options="scopeUserGroupOptions"
            label="Target user group"
            outlined dense emit-value map-options clearable use-input hide-selected fill-input input-debounce="200"
            @filter="filterScopeUserGroups"
          />
          <q-input v-else label="Target" model-value="All matching devices" outlined dense readonly />
          <q-input v-model="websiteUrlsInput" :label="$t('appmanagement.views.AppManagementView.af0158')" outlined dense
            :hint="$t('appmanagement.views.AppManagementView.d5ac33')"
            @update:model-value="websiteForm.urls = websiteUrlsInput.split(',').map(s=>s.trim()).filter(Boolean)" />
          <q-toggle v-model="websiteForm.enabled" :label="$t('appmanagement.views.AppManagementView.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('appmanagement.views.AppManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingWebsite ? 'Save' : 'Create'" @click="saveWebsite" :loading="savingWebsite" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sspRequestDetailsOpen">
      <q-card style="width: 820px; max-width: 95vw">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6">{{ sspRequestDetailsTitle }}</div>
            <div class="text-caption text-grey-7">Full SSP request payload and admin-visible fields.</div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-markup-table flat bordered dense wrap-cells>
            <tbody>
              <tr v-for="item in sspRequestDetailsRows" :key="item.label">
                <td class="text-weight-medium ssp-request-detail-label">{{ item.label }}</td>
                <td class="ssp-request-detail-value">{{ item.value || "-" }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Raw JSON</div>
          <pre class="ssp-request-raw-json">{{ sspRequestDetailsRaw }}</pre>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { fetchChocosSoftware } from "@/api/software";

const $q = useQuasar();
const tab = ref("apps");

const appPolicies = ref<any[]>([]);
const appInventory = ref<any>({ installed: [], available: [], agents: [], summary: {} });
const appDistributions = ref<any[]>([]);
const websitePolicies = ref<any[]>([]);
const wlanProfiles = ref<any[]>([]);
const vpnProfiles = ref<any[]>([]);
const sspDevices = ref<any[]>([]);
const sspPortalUsers = ref<any[]>([]);
const sspEnrollmentPolicies = ref<any[]>([]);
const sspInstallRequests = ref<any[]>([]);
const sspSettings = ref<any>(defaultSspSettings());
const sspExtraProfilesText = ref("{}");
const sspRightRequests = ref<any[]>([]);
const sspActions = ref<any[]>([]);
const sspInfoCategories = ref<any[]>([]);
const sspInfoArticles = ref<any[]>([]);
const sspInfoSearch = ref("");
const sspRequestDetailsOpen = ref(false);
const sspRequestDetailsTitle = ref("");
const sspRequestDetailsRows = ref<{ label: string; value: string }[]>([]);
const sspRequestDetailsRaw = ref("");

const loadingApps = ref(false);
const loadingAppInventory = ref(false);
const refreshingInstalledApps = ref(false);
const installingSelectedApps = ref(false);
const loadingDistributions = ref(false);
const loadingDistributionChocoPackages = ref(false);
const loadingWebsites = ref(false);
const loadingWlan = ref(false);
const loadingVpn = ref(false);
const loadingSsp = ref(false);
const loadingPortalUsers = ref(false);
const loadingEnrollmentPolicies = ref(false);
const loadingSspInstallRequests = ref(false);
const savingSspSettings = ref(false);
const loadingSspRights = ref(false);
const loadingSspActions = ref(false);
const loadingSspInfo = ref(false);
const savingSspInfo = ref(false);

const appFilter = ref({ list_type: "" });
const selectedAppAgentId = ref("");
const appInventorySearch = ref("");
const selectedInstalledApps = ref<any[]>([]);
const selectedAvailableApps = ref<any[]>([]);
const appAgentNeedle = ref("");

const appDialogOpen = ref(false);
const appDialogType = ref("blacklist");
const distributionDialogOpen = ref(false);
const wlanDialogOpen = ref(false);
const vpnDialogOpen = ref(false);
const websiteDialogOpen = ref(false);
const websiteDialogType = ref("blacklist");
const editingWebsite = ref<any>(null);
const savingWebsite = ref(false);
const websiteLoadError = ref("");
const websiteUrlsInput = ref("");
const websiteForm = ref<any>({
  name: "",
  scope: "global",
  list_type: "blacklist",
  urls: [],
  target_agent_id: "",
  target_device_group_id: null,
  target_user_id: null,
  target_user_group_id: null,
  enabled: true,
});

const editingApp = ref<any>(null);
const editingDistribution = ref<any>(null);
const editingWlan = ref<any>(null);
const editingVpn = ref<any>(null);
const editingPortalUser = ref<any | null>(null);
const editingEnrollmentPolicy = ref<any | null>(null);

const savingApp = ref(false);
const savingDistribution = ref(false);
const savingWlan = ref(false);
const savingVpn = ref(false);
const savingPortalUser = ref(false);
const savingEnrollmentPolicy = ref(false);

const appNamesInput = ref("");
const appPublishersInput = ref("");
const appHashesInput = ref("");
const distributionChocoPackages = ref<any[]>([]);
const distributionChocoSearch = ref("");
const distributionChocoPagination = ref({
  rowsPerPage: 0,
  sortBy: "name",
  descending: false,
});
const emptyScopedTargets = {
  target_agent_id: "",
  target_device_group_id: null,
  target_user_id: null,
  target_user_group_id: null,
};
const appForm = ref<any>({
  name: "",
  scope: "global",
  list_type: "blacklist",
  app_names: [],
  app_publishers: [],
  app_hashes: [],
  ...emptyScopedTargets,
  enabled: true,
  block_app_store: false,
});
const distributionForm = ref<any>({
  name: "",
  installer: "choco",
  action: "install",
  package_id: "",
  package_version: "",
  command: "",
  scope: "global",
  ...emptyScopedTargets,
  min_os_build: null,
  max_os_build: null,
  required_app_policy_ids: [],
  enabled: true,
  dry_run: false,
});
const wlanForm = ref<any>({ name: "", ssid: "", security_type: "wpa2", password: "", auto_connect: true, hidden_network: false, scope: "global", ...emptyScopedTargets, enabled: true });
const vpnForm = ref<any>({ name: "", vpn_type: "openvpn", server: "", port: 1194, scope: "global", ...emptyScopedTargets, enabled: true });
const portalUserDialogOpen = ref(false);
const portalUserForm = ref<any>(defaultPortalUserForm());
const enrollmentPolicyDialogOpen = ref(false);
const enrollmentPolicyForm = ref<any>(defaultEnrollmentPolicyForm());
const infoCategoryDialogOpen = ref(false);
const infoArticleDialogOpen = ref(false);
const editingInfoCategory = ref<any | null>(null);
const editingInfoArticle = ref<any | null>(null);
const infoCategoryForm = ref<any>(defaultInfoCategoryForm());
const infoArticleForm = ref<any>(defaultInfoArticleForm());

const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Specific Device", value: "device" },
  { label: "Device Group (existing or new)", value: "device_group" },
  { label: "Specific User", value: "user" },
  { label: "User Group (existing or new)", value: "user_group" },
];
const distributionInstallerOptions = [
  { label: "Chocolatey", value: "choco" },
  { label: "Windows Package Manager", value: "winget" },
  { label: "Microsoft Store", value: "msstore" },
  { label: "PowerShell command", value: "rawcmd" },
];
const distributionActionOptions = [
  { label: "Install", value: "install" },
  { label: "Upgrade", value: "upgrade" },
  { label: "Uninstall", value: "uninstall" },
];
const enrollmentScopeOptions = [
  { label: "All users", value: "global" },
  { label: "User group", value: "user_group" },
  { label: "Specific user", value: "user" },
];

const scopeAgentAllOptions = ref<{ label: string; value: string }[]>([]);
const scopeDeviceGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeAgentNeedle = ref("");
const scopeDeviceGroupNeedle = ref("");
const scopeUserNeedle = ref("");
const scopeUserGroupNeedle = ref("");

function filteredTargetOptions<T extends { label: string; value: string | number }>(rows: T[], needle: string): T[] {
  const q = String(needle || "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => String(row.label).toLowerCase().includes(q) || String(row.value).toLowerCase().includes(q));
}

const scopeAgentOptions = computed(() => filteredTargetOptions(scopeAgentAllOptions.value, scopeAgentNeedle.value));
const scopeDeviceGroupOptions = computed(() => filteredTargetOptions(scopeDeviceGroupAllOptions.value, scopeDeviceGroupNeedle.value));
const scopeUserOptions = computed(() => filteredTargetOptions(scopeUserAllOptions.value, scopeUserNeedle.value));
const scopeUserGroupOptions = computed(() => filteredTargetOptions(scopeUserGroupAllOptions.value, scopeUserGroupNeedle.value));
const infoCategoryOptions = computed(() => sspInfoCategories.value.map((cat: any) => ({
  label: cat.title || cat.slug || `Category #${cat.id}`,
  value: cat.id,
})));
const filteredSspInfoCategories = computed(() => {
  const q = sspInfoSearch.value.trim().toLowerCase();
  if (!q) return sspInfoCategories.value;
  return sspInfoCategories.value.filter((cat: any) =>
    [cat.title, cat.slug, cat.icon].some((value) => String(value || "").toLowerCase().includes(q))
  );
});
const filteredSspInfoArticles = computed(() => {
  const q = sspInfoSearch.value.trim().toLowerCase();
  if (!q) return sspInfoArticles.value;
  return sspInfoArticles.value.filter((article: any) =>
    [article.title, article.body, article.link, article.link_label, infoCategoryLabel(article.category)]
      .some((value) => String(value || "").toLowerCase().includes(q))
  );
});
const filteredDistributionChocoPackages = computed(() => {
  const q = distributionChocoSearch.value.trim().toLowerCase();
  if (!q) return distributionChocoPackages.value;
  return distributionChocoPackages.value.filter((row: any) =>
    [row.name, row.version, row.description]
      .some((value) => String(value || "").toLowerCase().includes(q))
  );
});

function normalizeChocolateyPackage(row: any) {
  const name = typeof row === "string"
    ? row
    : row?.name || row?.id || row?.package_id || row?.packageId || row?.title || "";
  const version = typeof row === "string"
    ? ""
    : row?.version || row?.latest_version || row?.latestVersion || row?.package_version || "";
  const description = typeof row === "string"
    ? ""
    : row?.description || row?.summary || row?.title || "";
  return {
    ...(typeof row === "object" && row ? row : {}),
    name: String(name || "").trim(),
    version: String(version || "").trim(),
    description: String(description || "").trim(),
  };
}

function filterScopeAgents(value: string, update: (fn: () => void) => void) {
  update(() => { scopeAgentNeedle.value = value || ""; });
}

function filterScopeDeviceGroups(value: string, update: (fn: () => void) => void) {
  update(() => { scopeDeviceGroupNeedle.value = value || ""; });
}

function filterScopeUsers(value: string, update: (fn: () => void) => void) {
  update(() => { scopeUserNeedle.value = value || ""; });
}

function filterScopeUserGroups(value: string, update: (fn: () => void) => void) {
  update(() => { scopeUserGroupNeedle.value = value || ""; });
}

function resetScopedTarget(form: any, scope: string) {
  form.scope = scope || "global";
  form.target_agent_id = "";
  form.target_device_group_id = null;
  form.target_user_id = null;
  form.target_user_group_id = null;
}

function scopeLabel(scope: string) {
  const match = scopeOptions.find((item) => item.value === (scope || "global"));
  return match?.label || scope || "Global";
}

function lookupTargetLabel(options: { label: string; value: string | number }[], value: any, fallback: string) {
  if (value === undefined || value === null || value === "") return "Not selected";
  return options.find((item) => String(item.value) === String(value))?.label || fallback;
}

function scopeTargetLabel(row: any) {
  const scope = (row?.scope || "global").toLowerCase();
  if (scope === "device") {
    return lookupTargetLabel(scopeAgentAllOptions.value, row?.target_agent_id, row?.target_agent_id || "Device not selected");
  }
  if (scope === "device_group") {
    return lookupTargetLabel(scopeDeviceGroupAllOptions.value, row?.target_device_group_id, `Device group #${row?.target_device_group_id || "?"}`);
  }
  if (scope === "user") {
    return lookupTargetLabel(scopeUserAllOptions.value, row?.target_user_id, `User #${row?.target_user_id || "?"}`);
  }
  if (scope === "user_group") {
    return lookupTargetLabel(scopeUserGroupAllOptions.value, row?.target_user_group_id, `User group #${row?.target_user_group_id || "?"}`);
  }
  return "All matching devices";
}

function enrollmentTargetLabel(row: any) {
  if (row?.scope === "user") {
    return lookupTargetLabel(scopeUserAllOptions.value, row?.target_user_id, `User #${row?.target_user_id || "?"}`);
  }
  if (row?.scope === "user_group") {
    return lookupTargetLabel(scopeUserGroupAllOptions.value, row?.user_group, `User group #${row?.user_group || "?"}`);
  }
  return "All users";
}

const installedAppColumns = [
  { name: "name", label: "Application", field: "name", align: "left", sortable: true },
  { name: "version", label: "Version", field: "version", align: "left", sortable: true },
  { name: "install_date", label: "Installed", field: "install_date", align: "left", sortable: true },
  { name: "policy_state", label: "Policy", field: "policy_state", align: "left", sortable: true },
  { name: "location", label: "Location", field: "location", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const availableAppColumns = [
  { name: "name", label: "Application", field: "name", align: "left", sortable: true },
  { name: "source", label: "Source", field: "source", align: "center", sortable: true },
  { name: "installer", label: "Installer", field: "installer", align: "left", sortable: true },
  { name: "package_id", label: "Package", field: "package_id", align: "left", sortable: true },
  { name: "install_state", label: "Install", field: "install_state", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const appColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "list_type", label: "Type", field: "list_type", align: "center" },
  { name: "app_names", label: "Entries", field: "app_names", align: "left" },
  { name: "scope", label: "Scope", field: (row: any) => scopeLabel(row.scope), align: "left" },
  { name: "target", label: "Target", field: (row: any) => scopeTargetLabel(row), align: "left" },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const distributionColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "installer", label: "Installer", field: "installer", align: "left", sortable: true },
  { name: "action", label: "Action", field: "action", align: "left", sortable: true },
  { name: "package_id", label: "Package", field: "package_id", align: "left", sortable: true },
  { name: "package_version", label: "Version", field: "package_version", align: "left" },
  { name: "scope", label: "Scope", field: (row: any) => scopeLabel(row.scope), align: "left", sortable: true },
  { name: "target", label: "Target", field: (row: any) => scopeTargetLabel(row), align: "left" },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
  { name: "dry_run", label: "Mode", field: "dry_run", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const distributionChocoColumns = [
  { name: "select", label: "Add", field: "select", align: "left", sortable: false },
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "version", label: "Version", field: "version", align: "left", sortable: true },
  { name: "description", label: "Description", field: "description", align: "left", sortable: false },
];
const websiteColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "list_type", label: "Type", field: "list_type", align: "center" },
  { name: "scope", label: "Scope", field: (row: any) => scopeLabel(row.scope), align: "left" },
  { name: "target", label: "Target", field: (row: any) => scopeTargetLabel(row), align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const wlanColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "ssid", label: "SSID", field: "ssid", align: "left" },
  { name: "security_type", label: "Security", field: "security_type", align: "center" },
  { name: "scope", label: "Scope", field: (row: any) => scopeLabel(row.scope), align: "left" },
  { name: "target", label: "Target", field: (row: any) => scopeTargetLabel(row), align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const vpnColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "vpn_type", label: "Type", field: "vpn_type", align: "center" },
  { name: "server", label: "Server", field: "server", align: "left" },
  { name: "scope", label: "Scope", field: (row: any) => scopeLabel(row.scope), align: "left" },
  { name: "target", label: "Target", field: (row: any) => scopeTargetLabel(row), align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspPortalUserColumns = [
  { name: "login", label: "Login", field: "username", align: "left", sortable: true },
  { name: "full_name", label: "Name", field: "full_name", align: "left", sortable: true },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "department", label: "Department", field: "department", align: "left" },
  { name: "device_count", label: "Devices", field: "device_count", align: "center", sortable: true },
  { name: "is_active", label: "Status", field: "is_active", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspColumns = [
  { name: "user", label: "User", field: (row: any) => row.user_display_name || row.username || row.user_id, align: "left", sortable: true },
  { name: "device_name", label: "Device Name", field: "device_name", align: "left", sortable: true },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "device_type", label: "Type", field: "device_type", align: "left" },
  { name: "os_info", label: "OS", field: "os_info", align: "left" },
  { name: "enrollment_status", label: "Enrollment", field: "enrollment_status", align: "center" },
  { name: "is_active", label: "Status", field: "is_active", align: "center" },
  { name: "enrolled_at", label: "Enrolled", field: "enrolled_at", align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspEnrollmentColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "enabled", label: "Enabled", field: "enabled", align: "center" },
  { name: "scope", label: "Scope", field: "scope", align: "left" },
  { name: "target", label: "Target", field: (row: any) => enrollmentTargetLabel(row), align: "left" },
  { name: "max_devices", label: "Max devices", field: "max_devices", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspInstallRequestColumns = [
  { name: "app_name", label: "App", field: "app_name", align: "left", sortable: true },
  { name: "device_name", label: "Device", field: "device_name", align: "left", sortable: true },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "user_id", label: "User ID", field: "user_id", align: "center" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspRightRequestColumns = [
  { name: "title", label: "Request", field: "title", align: "left", sortable: true },
  { name: "category", label: "Category", field: "category", align: "left", sortable: true },
  { name: "user", label: "User", field: "user", align: "left", sortable: true },
  { name: "device_name", label: "Device", field: "device_name", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left", sortable: true },
  { name: "admin_notes", label: "Admin notes", field: "admin_notes", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspActionColumns = [
  { name: "action_type", label: "Action", field: "action_type", align: "left", sortable: true },
  { name: "device_name", label: "Device", field: "device_name", align: "left", sortable: true },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "username", label: "User", field: "username", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "reason", label: "Reason", field: "reason", align: "left" },
  { name: "requested_at", label: "Requested", field: "requested_at", align: "left", sortable: true },
  { name: "result", label: "Result", field: "result", align: "left" },
];
const sspInfoCategoryColumns = [
  { name: "title", label: "Title", field: "title", align: "left", sortable: true },
  { name: "slug", label: "Slug", field: "slug", align: "left" },
  { name: "sort_order", label: "Sort", field: "sort_order", align: "center" },
  { name: "is_active", label: "Active", field: "is_active", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const sspInfoArticleColumns = [
  { name: "title", label: "Title", field: "title", align: "left", sortable: true },
  { name: "category", label: "Category", field: "category", align: "left" },
  { name: "sort_order", label: "Sort", field: "sort_order", align: "center" },
  { name: "is_published", label: "Published", field: "is_published", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const activeBlockPolicies = computed(() => appPolicies.value.filter((p) => p.enabled && p.list_type === "blacklist"));
const activeAllowPolicies = computed(() => appPolicies.value.filter((p) => p.enabled && p.list_type === "whitelist"));
const appPolicySelectorOptions = computed(() => appPolicies.value.map((policy: any) => ({
  label: `${policy.name || `Policy #${policy.id}`} (${policy.list_type || "policy"})`,
  value: policy.id,
})));

const appAgentOptions = computed(() => {
  const fromInventory = (appInventory.value.agents || []).map((a: any) => ({
    label: `${a.hostname || a.agent_id} (${a.agent_id})`,
    value: a.agent_id,
  }));
  const seen = new Set<string>();
  return fromInventory.filter((item: any) => {
    if (!item.value || seen.has(item.value)) return false;
    seen.add(item.value);
    const q = appAgentNeedle.value.trim().toLowerCase();
    if (!q) return true;
    return String(item.label).toLowerCase().includes(q) || String(item.value).toLowerCase().includes(q);
  });
});

function filterAppAgents(value: string, update: (fn: () => void) => void) {
  update(() => {
    appAgentNeedle.value = value || "";
  });
}

function appEntryTokens(row: any): string[] {
  return [
    row?.name,
    row?.package_id,
    row?.file_name,
    row?.catalog_id,
    row?.publisher,
    row?.installer,
  ]
    .map((v) => String(v || "").trim())
    .filter(Boolean);
}

function normaliseAppName(value: any): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/^.*\//, "")
    .replace(/\.exe$/i, "")
    .replace(/[^a-z0-9]+/g, "");
}

function rawAppText(value: any): string {
  return String(value || "").trim().toLowerCase();
}

function appPolicyMatches(policy: any, row: any): boolean {
  const entries = [
    ...(policy.app_names || []),
    ...(policy.app_publishers || []),
    ...(policy.app_hashes || []),
  ].map((v: any) => String(v || "").trim()).filter(Boolean);
  if (entries.length === 0) return false;

  const tokens = appEntryTokens(row);
  const rawTokens = tokens.map(rawAppText);
  const compactTokens = tokens.map(normaliseAppName).filter(Boolean);
  return entries.some((entry: string) => {
    const rawEntry = rawAppText(entry);
    const compactEntry = normaliseAppName(entry);
    return rawTokens.some((token) => token && (token === rawEntry || token.includes(rawEntry) || rawEntry.includes(token)))
      || compactTokens.some((token) => token && compactEntry && (token === compactEntry || token.includes(compactEntry) || compactEntry.includes(token)));
  });
}

function appPolicyState(row: any) {
  const block = activeBlockPolicies.value.find((p) => appPolicyMatches(p, row));
  if (block) {
    return { state: "Blocked", color: "negative", reason: block.name || "Blocklist" };
  }
  if (activeAllowPolicies.value.length > 0) {
    const allow = activeAllowPolicies.value.find((p) => appPolicyMatches(p, row));
    if (allow) {
      return { state: "Allowed", color: "positive", reason: allow.name || "Allowlist" };
    }
    return { state: "Not allowed", color: "warning", reason: "No allowlist match" };
  }
  return { state: "Allowed", color: "positive", reason: "No restrictive allowlist" };
}

const installedAppRows = computed(() => {
  const q = appInventorySearch.value.trim().toLowerCase();
  return ((appInventory.value.installed || []) as any[])
    .map((row, idx) => {
      const state = appPolicyState(row);
      return {
        ...row,
        row_key: `${row.name || "app"}-${row.version || ""}-${idx}`,
        policy_state: state.state,
        policy_color: state.color,
        policy_reason: state.reason,
      };
    })
    .filter((row) => {
      if (!q) return true;
      return [row.name, row.version, row.publisher, row.location, row.policy_state]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
});

const availableAppRows = computed(() => {
  const q = appInventorySearch.value.trim().toLowerCase();
  return ((appInventory.value.available || []) as any[])
    .filter((row) => {
      if (!q) return true;
      return [row.name, row.description, row.category, row.source, row.package_id, row.installer]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
});

function availableInstallState(row: any) {
  const state = appPolicyState(row);
  if (state.state === "Blocked" || state.state === "Not allowed") {
    return { label: state.state, color: state.color, blocked: true };
  }
  if (!row.installable) {
    return { label: "Link only", color: "grey-6", blocked: true };
  }
  return { label: "Installable", color: "primary", blocked: false };
}

async function loadApps() {
  loadingApps.value = true;
  try {
    const params: any = {};
    if (appFilter.value.list_type) params.list_type = appFilter.value.list_type;
    appPolicies.value = (await axios.get("/appmanagement/apps/", { params })).data;
  } catch (e: any) {
    appPolicies.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load app policies", color: "negative" });
  } finally { loadingApps.value = false; }
}

async function loadAppInventory() {
  loadingAppInventory.value = true;
  selectedInstalledApps.value = [];
  selectedAvailableApps.value = [];
  try {
    const params: any = { agent_limit: 500 };
    if (selectedAppAgentId.value) params.agent_id = selectedAppAgentId.value;
    const data = (await axios.get("/appmanagement/app-inventory/", { params })).data || {};
    appInventory.value = {
      installed: data.installed || [],
      available: data.available || [],
      agents: data.agents || [],
      summary: data.summary || {},
    };
    if (!selectedAppAgentId.value && appInventory.value.agents?.length) {
      selectedAppAgentId.value = appInventory.value.agents[0].agent_id;
      await loadAppInventory();
    }
  } catch (e: any) {
    appInventory.value = { installed: [], available: [], agents: [], summary: {} };
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load application inventory", color: "negative" });
  } finally {
    loadingAppInventory.value = false;
  }
}

async function refreshAppManagement() {
  await Promise.all([loadApps(), loadAppInventory(), loadAppDistributions(), loadInternalCatalogApps(), loadAppStoreLinks()]);
}

async function refreshInstalledApps() {
  if (!selectedAppAgentId.value) {
    $q.notify({ message: "Select a device first", color: "warning" });
    return;
  }
  refreshingInstalledApps.value = true;
  try {
    const data = (await axios.post("/appmanagement/app-inventory/", { agent_id: selectedAppAgentId.value })).data || {};
    appInventory.value = { ...appInventory.value, installed: data.installed || [] };
    $q.notify({ message: `Inventory refreshed: ${(data.installed || []).length} app(s)`, color: "positive", icon: "check" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Inventory refresh failed", color: "negative" });
  } finally {
    refreshingInstalledApps.value = false;
  }
}
async function loadAppDistributions() {
  loadingDistributions.value = true;
  try {
    const data = (await axios.get("/appmanagement/app-distributions/")).data;
    appDistributions.value = Array.isArray(data) ? data : data?.results ?? [];
  } catch (e: any) {
    appDistributions.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load app distributions", color: "negative" });
  } finally { loadingDistributions.value = false; }
}
async function loadWebsites() {
  loadingWebsites.value = true;
  websiteLoadError.value = "";
  try {
    websitePolicies.value = (await axios.get("/appmanagement/websites/")).data;
  } catch (e: any) {
    websitePolicies.value = [];
    websiteLoadError.value = e?.response?.data?.error || e?.message || "Could not load website policies.";
    $q.notify({ message: websiteLoadError.value, color: "negative" });
  } finally { loadingWebsites.value = false; }
}
async function loadWlan() {
  loadingWlan.value = true;
  try {
    wlanProfiles.value = (await axios.get("/appmanagement/wlan/")).data;
  } catch (e: any) {
    wlanProfiles.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load WLAN profiles", color: "negative" });
  } finally { loadingWlan.value = false; }
}
async function loadVpn() {
  loadingVpn.value = true;
  try {
    vpnProfiles.value = (await axios.get("/appmanagement/vpn/")).data;
  } catch (e: any) {
    vpnProfiles.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load VPN profiles", color: "negative" });
  } finally { loadingVpn.value = false; }
}
async function loadSsp() {
  loadingSsp.value = true;
  try {
    sspDevices.value = (await axios.get("/appmanagement/ssp/devices/", { params: { scope: "all" } })).data;
  } catch (e: any) {
    sspDevices.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load SSP devices", color: "negative" });
  } finally { loadingSsp.value = false; }
}

async function loadPortalUsers() {
  loadingPortalUsers.value = true;
  try {
    sspPortalUsers.value = (await axios.get("/appmanagement/ssp/portal-users/")).data || [];
  } catch (e: any) {
    sspPortalUsers.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load SSP portal users", color: "negative" });
  } finally {
    loadingPortalUsers.value = false;
  }
}

async function loadEnrollmentPolicies() {
  loadingEnrollmentPolicies.value = true;
  try {
    sspEnrollmentPolicies.value = (await axios.get("/appmanagement/ssp/enrollment-policies/")).data || [];
  } catch (e: any) {
    sspEnrollmentPolicies.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load enrollment policies", color: "negative" });
  } finally { loadingEnrollmentPolicies.value = false; }
}

async function loadSspInstallRequests() {
  loadingSspInstallRequests.value = true;
  try {
    sspInstallRequests.value = (await axios.get("/appmanagement/ssp/install-requests/admin/")).data || [];
  } catch (e: any) {
    sspInstallRequests.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load SSP install requests", color: "negative" });
  } finally { loadingSspInstallRequests.value = false; }
}

function defaultSspExtraProfiles() {
  return {
    database: {
      host: "",
      port: 5432,
      name: "",
      username: "",
      secret_ref: "",
      ssl_mode: "prefer",
    },
    backend: {
      health_path: "/api/v3/version/",
      timeout_seconds: 10,
    },
    zero_touch: {
      enabled: true,
      require_serial: true,
      required_apps: "",
      compliance_interval_minutes: 240,
    },
    byod: {
      enabled: true,
      require_privacy_acceptance: true,
      container_required: true,
      allow_unsubscribe: true,
      container_name: "Organization Data",
    },
  };
}

function normaliseSspExtraProfiles(value: any = {}) {
  const defaults = defaultSspExtraProfiles();
  return {
    ...defaults,
    ...value,
    database: { ...defaults.database, ...(value?.ssp_database || {}), ...(value?.database || {}) },
    backend: { ...defaults.backend, ...(value?.cywm_backend || {}), ...(value?.backend || {}) },
    zero_touch: { ...defaults.zero_touch, ...(value?.zero_touch || {}) },
    byod: { ...defaults.byod, ...(value?.byod || {}) },
  };
}

function defaultSspSettings() {
  return {
    portal_url: "https://ssp.mdmlab.ru/ssp/devices",
    backend_url: "https://api.mdmlab.ru",
    database_label: "Primary CYWM database",
    database_host: "",
    support_email: "support@mdmlab.ru",
    support_phone: "",
    support_url: "https://ssp.mdmlab.ru/ssp/info",
    privacy_terms: "",
    allow_self_enrollment: true,
    require_privacy_acceptance: true,
    allow_full_wipe: false,
    default_max_devices: null,
    extra_profiles: defaultSspExtraProfiles(),
  };
}

async function loadSspSettings() {
  try {
    const data = (await axios.get("/appmanagement/ssp/settings/")).data || {};
    sspSettings.value = { ...defaultSspSettings(), ...data, extra_profiles: normaliseSspExtraProfiles(data.extra_profiles || {}) };
    sspExtraProfilesText.value = JSON.stringify(sspSettings.value.extra_profiles || {}, null, 2);
  } catch (e: any) {
    sspSettings.value = defaultSspSettings();
    sspExtraProfilesText.value = "{}";
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load SSP settings", color: "negative" });
  }
}

async function saveSspSettings() {
  savingSspSettings.value = true;
  try {
    let extraProfiles = {};
    try {
      extraProfiles = sspExtraProfilesText.value.trim() ? JSON.parse(sspExtraProfilesText.value) : {};
    } catch {
      $q.notify({ message: "Profile settings JSON is invalid", color: "warning" });
      return;
    }
    const payload = { ...sspSettings.value, extra_profiles: normaliseSspExtraProfiles({ ...extraProfiles, ...(sspSettings.value.extra_profiles || {}) }) };
    const data = (await axios.patch("/appmanagement/ssp/settings/", payload)).data || {};
    sspSettings.value = { ...defaultSspSettings(), ...data, extra_profiles: normaliseSspExtraProfiles(data.extra_profiles || {}) };
    sspExtraProfilesText.value = JSON.stringify(sspSettings.value.extra_profiles || {}, null, 2);
    $q.notify({ message: "SSP settings saved", color: "positive", icon: "check" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to save SSP settings", color: "negative" });
  } finally {
    savingSspSettings.value = false;
  }
}

function validateSspDeclarations() {
  const errors = [];
  if (!sspSettings.value.portal_url) errors.push("Portal URL");
  if (!sspSettings.value.backend_url) errors.push("Backend URL");
  if (!sspSettings.value.extra_profiles?.database?.host && !sspSettings.value.database_host) errors.push("DB host");
  if (!sspSettings.value.extra_profiles?.database?.name && !sspSettings.value.database_label) errors.push("DB name/label");
  if (errors.length) {
    $q.notify({ message: `Missing declaration fields: ${errors.join(", ")}`, color: "warning" });
    return;
  }
  $q.notify({ message: "SSP declaration fields are complete and ready to save", color: "positive", icon: "fact_check" });
}

async function loadSspRightRequests() {
  loadingSspRights.value = true;
  try {
    sspRightRequests.value = (await axios.get("/appmanagement/ssp/rights/", { params: { scope: "all" } })).data || [];
  } catch (e: any) {
    sspRightRequests.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load right requests", color: "negative" });
  } finally {
    loadingSspRights.value = false;
  }
}

async function loadSspActions() {
  loadingSspActions.value = true;
  try {
    sspActions.value = (await axios.get("/appmanagement/ssp/actions/", { params: { scope: "all" } })).data || [];
  } catch (e: any) {
    sspActions.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load SSP action audit", color: "negative" });
  } finally {
    loadingSspActions.value = false;
  }
}

function installRequestStatusColor(status: string) {
  return {
    pending: "warning",
    approved: "info",
    installing: "primary",
    denied: "negative",
    installed: "positive",
    failed: "negative",
  }[status] || "grey";
}

function rightRequestStatusColor(status: string) {
  return {
    pending: "warning",
    approved: "positive",
    denied: "negative",
    revoked: "grey",
    cancelled: "grey",
  }[status] || "grey";
}

function sspActionStatusColor(status: string) {
  return {
    queued: "grey",
    sent: "info",
    succeeded: "positive",
    failed: "negative",
    cancelled: "grey",
  }[status] || "grey";
}

function stringify(value: any) {
  if (!value) return "";
  try {
    return typeof value === "string" ? value : JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function sspDetailValue(value: any) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function openSspRequestDetails(kind: "install" | "right", row: any) {
  const fields = kind === "install"
    ? [
        ["ID", row.id],
        ["App ID", row.app_id],
        ["App name", row.app_name],
        ["Catalog ID", row.catalog_id],
        ["Source", row.source],
        ["Installer", row.installer],
        ["Package ID", row.package_id],
        ["Package version", row.package_version],
        ["Install command", row.command],
        ["Device ID", row.device_id],
        ["Device name", row.device_name],
        ["Agent ID", row.agent_id],
        ["User ID", row.user_id],
        ["Distribution policy ID", row.distribution_policy_id],
        ["Status", row.status],
        ["Last error", row.last_error],
        ["Requested at", row.requested_at],
        ["Reviewed at", row.reviewed_at],
        ["Reviewed by ID", row.reviewed_by_id],
        ["Installed at", row.installed_at],
      ]
    : [
        ["ID", row.id],
        ["Title", row.title],
        ["Category", row.category],
        ["Description", row.description],
        ["Justification", row.justification],
        ["User ID", row.user_id],
        ["Username", row.username],
        ["User display name", row.user_display_name],
        ["Target device ID", row.target_device],
        ["Device name", row.device_name],
        ["Target Agent ID", row.target_agent_id],
        ["Status", row.status],
        ["Admin notes", row.admin_notes],
        ["Requested at", row.requested_at],
        ["Updated at", row.updated_at],
        ["Reviewed at", row.reviewed_at],
        ["Reviewed by ID", row.reviewed_by_id],
      ];
  sspRequestDetailsTitle.value = kind === "install"
    ? `App install request #${row.id || ""}`
    : `Right/policy request #${row.id || ""}`;
  sspRequestDetailsRows.value = fields.map(([label, value]) => ({
    label: String(label),
    value: sspDetailValue(value),
  }));
  sspRequestDetailsRaw.value = sspDetailValue(row);
  sspRequestDetailsOpen.value = true;
}

async function reviewSspInstallRequest(row: any, status: string) {
  try {
    const resp = await axios.patch(`/appmanagement/ssp/install-requests/${row.id}/`, { status });
    Object.assign(row, resp.data || {});
    $q.notify({ message: `SSP request ${status}`, color: status === "denied" ? "warning" : "positive" });
    await loadSspInstallRequests();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Review failed", color: "negative" });
  }
}

async function reviewSspRightRequest(row: any, status: string) {
  $q.dialog({
    title: `Mark request ${status}?`,
    message: row.title || "Review SSP request",
    prompt: { model: row.admin_notes || "", label: "Admin notes (optional)", type: "textarea" },
    cancel: true,
    ok: { color: status === "denied" || status === "revoked" ? "negative" : "positive", label: status },
  }).onOk(async (adminNotes: string) => {
    try {
      const resp = await axios.patch(`/appmanagement/ssp/rights/${row.id}/`, {
        status,
        admin_notes: adminNotes || "",
      });
      Object.assign(row, resp.data || {});
      $q.notify({ message: `Request ${status}`, color: status === "approved" ? "positive" : "warning" });
      await loadSspRightRequests();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Review failed", color: "negative" });
    }
  });
}

async function loadScopeTargetOptions() {
  const [agentsResp, sitesResp, usersResp, groupsResp] = await Promise.allSettled([
    axios.get("/agents/", { params: { detail: "false" } }),
    axios.get("/clients/sites/?leaf=true"),
    axios.get("/accounts/users/"),
    axios.get("/accounts/user-groups/"),
  ]);

  if (agentsResp.status === "fulfilled") {
    const list = Array.isArray(agentsResp.value.data) ? agentsResp.value.data : agentsResp.value.data?.results ?? [];
    scopeAgentAllOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        value: agent.agent_id,
        label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
      }));
  } else {
    scopeAgentAllOptions.value = [];
  }

  if (sitesResp.status === "fulfilled") {
    const list = Array.isArray(sitesResp.value.data) ? sitesResp.value.data : sitesResp.value.data?.results ?? [];
    scopeDeviceGroupAllOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
      }));
  } else {
    scopeDeviceGroupAllOptions.value = [];
  }

  if (usersResp.status === "fulfilled") {
    const list = Array.isArray(usersResp.value.data) ? usersResp.value.data : usersResp.value.data?.results ?? [];
    scopeUserAllOptions.value = list
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        value: user.id,
        label: user.display_name || user.full_name || user.username || user.sam_account_name || user.email || `User #${user.id}`,
      }));
  } else {
    scopeUserAllOptions.value = [];
  }

  if (groupsResp.status === "fulfilled") {
    const list = Array.isArray(groupsResp.value.data) ? groupsResp.value.data : groupsResp.value.data?.results ?? [];
    scopeUserGroupAllOptions.value = list
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        value: group.id,
        label: group.display_name || group.name || group.sam_account_name || `User group #${group.id}`,
      }));
  } else {
    scopeUserGroupAllOptions.value = [];
  }
}

function defaultEnrollmentPolicyForm() {
  return {
    name: "",
    enabled: true,
    scope: "global",
    target_user_id: null,
    user_group: null,
    max_devices: null,
    approved_agent_ids_text: "",
    approved_serial_numbers_text: "",
    approved_device_names_text: "",
    notes: "",
  };
}

function listToText(value: any) {
  return Array.isArray(value) ? value.join("\n") : (value || "");
}

function textToList(value: string) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .replace(/,/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeScopedPayload(form: any) {
  const payload = { ...form };
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  if (payload.scope !== "user") payload.target_user_id = null;
  if (payload.scope !== "user_group") payload.target_user_group_id = null;
  for (const key of ["target_device_group_id", "target_user_id", "target_user_group_id"]) {
    if (payload[key] === "" || payload[key] === undefined) payload[key] = null;
  }
  return payload;
}

function scopedTargetError(form: any) {
  if (form.scope === "device" && !form.target_agent_id) return "Select a target device";
  if (form.scope === "device_group" && !form.target_device_group_id) return "Select a target device group";
  if (form.scope === "user" && !form.target_user_id) return "Select a target user";
  if (form.scope === "user_group" && !form.target_user_group_id) return "Select a target user group";
  return "";
}

function validateScopedTarget(form: any) {
  const error = scopedTargetError(form);
  if (!error) return true;
  $q.notify({ message: error, color: "warning" });
  return false;
}

function distributionTriggerCount(data: any) {
  const value = data?._triggered ?? data?.triggered ?? 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function notifyDistributionResult(data: any, message: string, icon = "check") {
  const triggered = distributionTriggerCount(data);
  if (triggered > 0) {
    $q.notify({ message: `${message}; dispatched to ${triggered} device(s)`, color: "positive", icon });
    return;
  }
  $q.notify({ message: `${message}; no matching agents found yet`, color: "warning", icon: "warning" });
}

function apiErrorMessage(error: any, fallback: string) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.error) return data.error;
  if (data && typeof data === "object") {
    const [key, value] = Object.entries(data)[0] || [];
    if (key) {
      const details = Array.isArray(value) ? value.join(", ") : String(value || "");
      return details ? `${key}: ${details}` : key;
    }
  }
  return error?.message || fallback;
}

function defaultPortalUserForm() {
  return {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    location: "",
    manager: "",
    employee_id: "",
    role: "Standard User",
    is_active: true,
  };
}

function defaultAppPolicyForm(type = "blacklist") {
  return {
    name: "",
    scope: selectedAppAgentId.value ? "device" : "global",
    list_type: type,
    app_names: [],
    app_publishers: [],
    app_hashes: [],
    ...emptyScopedTargets,
    target_agent_id: selectedAppAgentId.value || "",
    enabled: true,
    block_app_store: false,
  };
}

function showEnrollmentPolicyDialog(row?: any) {
  editingEnrollmentPolicy.value = row || null;
  enrollmentPolicyForm.value = row
    ? {
        ...defaultEnrollmentPolicyForm(),
        ...row,
        approved_agent_ids_text: listToText(row.approved_agent_ids),
        approved_serial_numbers_text: listToText(row.approved_serial_numbers),
        approved_device_names_text: listToText(row.approved_device_names),
      }
    : defaultEnrollmentPolicyForm();
  enrollmentPolicyDialogOpen.value = true;
}

function enrollmentPolicyPayload() {
  const f = enrollmentPolicyForm.value;
  return {
    name: f.name,
    enabled: !!f.enabled,
    scope: f.scope,
    target_user_id: f.scope === "user" ? f.target_user_id || null : null,
    user_group: f.scope === "user_group" ? f.user_group || null : null,
    max_devices: f.max_devices === "" ? null : f.max_devices,
    approved_agent_ids: textToList(f.approved_agent_ids_text),
    approved_serial_numbers: textToList(f.approved_serial_numbers_text),
    approved_device_names: textToList(f.approved_device_names_text),
    notes: f.notes || "",
  };
}

async function saveEnrollmentPolicy() {
  if (!enrollmentPolicyForm.value.name) {
    $q.notify({ message: "Name required", color: "warning" });
    return;
  }
  if (enrollmentPolicyForm.value.scope === "user" && !enrollmentPolicyForm.value.target_user_id) {
    $q.notify({ message: "Select a target user", color: "warning" });
    return;
  }
  if (enrollmentPolicyForm.value.scope === "user_group" && !enrollmentPolicyForm.value.user_group) {
    $q.notify({ message: "Select a target user group", color: "warning" });
    return;
  }
  savingEnrollmentPolicy.value = true;
  try {
    const payload = enrollmentPolicyPayload();
    if (editingEnrollmentPolicy.value?.id) {
      await axios.patch(`/appmanagement/ssp/enrollment-policies/${editingEnrollmentPolicy.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/ssp/enrollment-policies/", payload);
    }
    enrollmentPolicyDialogOpen.value = false;
    $q.notify({ message: "Enrollment policy saved", color: "positive", icon: "check" });
    await loadEnrollmentPolicies();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingEnrollmentPolicy.value = false;
  }
}

async function patchEnrollmentPolicy(row: any, patch: Record<string, any>) {
  const prev = { ...row };
  Object.assign(row, patch);
  try {
    await axios.patch(`/appmanagement/ssp/enrollment-policies/${row.id}/`, patch);
  } catch (e: any) {
    Object.assign(row, prev);
    $q.notify({ message: e?.response?.data?.error || e?.message || "Update failed", color: "negative" });
  }
}

async function removeEnrollmentPolicy(id: number) {
  $q.dialog({ title: "Remove enrollment policy?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/enrollment-policies/${id}/`);
      await loadEnrollmentPolicies();
      $q.notify({ message: "Removed", color: "positive" });
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

function showAppDialog(type: string, item?: any) {
  appDialogType.value = type;
  editingApp.value = item || null;
  appForm.value = item ? { ...defaultAppPolicyForm(type), ...item } : defaultAppPolicyForm(type);
  appNamesInput.value = listToText(appForm.value.app_names);
  appPublishersInput.value = listToText(appForm.value.app_publishers);
  appHashesInput.value = listToText(appForm.value.app_hashes);
  appDialogOpen.value = true;
}
function defaultDistributionForm() {
  return {
    name: "",
    installer: "choco",
    action: "install",
    package_id: "",
    package_version: "",
    command: "",
    scope: "global",
    ...emptyScopedTargets,
    min_os_build: null,
    max_os_build: null,
    required_app_policy_ids: [],
    enabled: true,
    dry_run: false,
  };
}
async function loadDistributionChocoPackages(force = false) {
  if (loadingDistributionChocoPackages.value) return;
  if (!force && distributionChocoPackages.value.length) return;
  loadingDistributionChocoPackages.value = true;
  try {
    const data = await fetchChocosSoftware();
    const rows = Array.isArray(data) ? data : data?.software || data?.results || [];
    distributionChocoPackages.value = rows
      .map((row: any) => normalizeChocolateyPackage(row))
      .filter((row: any) => row.name);
  } catch (e: any) {
    distributionChocoPackages.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load Chocolatey packages", color: "negative" });
  } finally {
    loadingDistributionChocoPackages.value = false;
  }
}

function distributionActionLabel(action: string) {
  return distributionActionOptions.find((option) => option.value === action)?.label || "Install";
}

function selectDistributionChocolateyPackage(row: any) {
  const pkg = normalizeChocolateyPackage(row);
  if (!pkg.name) return;
  distributionForm.value.package_id = pkg.name;
  if (!distributionForm.value.name) {
    distributionForm.value.name = `${distributionActionLabel(distributionForm.value.action)} ${pkg.name}`;
  }
}

function selectInternalCatalogChocolateyPackage(row: any) {
  const pkg = normalizeChocolateyPackage(row);
  if (!pkg.name) return;
  internalCatalogForm.value.installer = "choco";
  internalCatalogForm.value.package_id = pkg.name;
  if (!internalCatalogForm.value.name) internalCatalogForm.value.name = pkg.name;
  if (!internalCatalogForm.value.description && pkg.description) {
    internalCatalogForm.value.description = pkg.description;
  }
  if (!internalCatalogForm.value.version && pkg.version) {
    internalCatalogForm.value.version = pkg.version;
  }
}

function openChocolateyPackage(packageId: string) {
  if (!packageId) return;
  window.open(`https://chocolatey.org/packages/${encodeURIComponent(packageId)}`, "_blank");
}

function onDistributionInstallerChanged(installer: string) {
  if (installer === "choco") {
    void loadDistributionChocoPackages();
  }
  if (installer === "rawcmd") {
    distributionForm.value.package_id = "";
    distributionForm.value.package_version = "";
  } else {
    distributionForm.value.command = "";
  }
}

function onInternalCatalogInstallerChanged(installer: string) {
  if (installer === "choco") {
    void loadDistributionChocoPackages();
  }
}

function showDistributionDialog(item?: any) {
  editingDistribution.value = item || null;
  distributionForm.value = item ? { ...defaultDistributionForm(), ...item } : defaultDistributionForm();
  distributionForm.value.required_app_policy_ids = (distributionForm.value.required_app_policy_ids || [])
    .map((id: any) => Number(id))
    .filter((id: number) => Number.isInteger(id) && id > 0);
  distributionChocoSearch.value = "";
  distributionDialogOpen.value = true;
  if (distributionForm.value.installer === "choco") {
    void loadDistributionChocoPackages();
  }
}
function showWebsiteDialog(type: string, item?: any) {
  websiteDialogType.value = type;
  editingWebsite.value = item || null;
  websiteForm.value = item
    ? { ...emptyScopedTargets, ...item, list_type: item.list_type || type }
    : { name: "", scope: "global", list_type: type, urls: [], ...emptyScopedTargets, enabled: true };
  websiteUrlsInput.value = (websiteForm.value.urls || []).join(", ");
  websiteDialogOpen.value = true;
}
function showWlanDialog(item?: any) {
  editingWlan.value = item || null;
  wlanForm.value = item
    ? { ...emptyScopedTargets, ...item, password: "" }
    : { name: "", ssid: "", security_type: "wpa2", password: "", auto_connect: true, hidden_network: false, scope: "global", ...emptyScopedTargets, enabled: true };
  wlanDialogOpen.value = true;
}
function showVpnDialog(item?: any) {
  editingVpn.value = item || null;
  vpnForm.value = item ? { ...emptyScopedTargets, ...item } : { name: "", vpn_type: "openvpn", server: "", port: 1194, scope: "global", ...emptyScopedTargets, enabled: true };
  vpnDialogOpen.value = true;
}

function showPortalUserDialog(row?: any) {
  editingPortalUser.value = row || null;
  portalUserForm.value = row
    ? { ...defaultPortalUserForm(), ...row, password: "" }
    : defaultPortalUserForm();
  portalUserDialogOpen.value = true;
}

function portalUserPayload() {
  return {
    username: portalUserForm.value.username,
    password: portalUserForm.value.password,
    first_name: portalUserForm.value.first_name,
    last_name: portalUserForm.value.last_name,
    email: portalUserForm.value.email,
    phone: portalUserForm.value.phone,
    department: portalUserForm.value.department,
    location: portalUserForm.value.location,
    manager: portalUserForm.value.manager,
    employee_id: portalUserForm.value.employee_id,
    role: portalUserForm.value.role || "Standard User",
    is_active: !!portalUserForm.value.is_active,
  };
}

async function savePortalUser() {
  if (!portalUserForm.value.username) {
    $q.notify({ message: "Username required", color: "warning" });
    return;
  }
  if (!editingPortalUser.value?.id && !portalUserForm.value.password) {
    $q.notify({ message: "Temporary password required", color: "warning" });
    return;
  }
  savingPortalUser.value = true;
  try {
    const payload = portalUserPayload();
    if (editingPortalUser.value?.id) {
      await axios.patch(`/appmanagement/ssp/portal-users/${editingPortalUser.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/ssp/portal-users/", payload);
    }
    portalUserDialogOpen.value = false;
    $q.notify({ message: "SSP login user saved", color: "positive", icon: "check" });
    await Promise.all([loadPortalUsers(), loadScopeTargetOptions()]);
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingPortalUser.value = false;
  }
}

async function deactivatePortalUser(row: any) {
  $q.dialog({
    title: "Disable SSP user?",
    message: `Disable portal login for ${row.username}?`,
    cancel: true,
    ok: { color: "negative", label: "Disable" },
  }).onOk(async () => {
    try {
      const resp = await axios.delete(`/appmanagement/ssp/portal-users/${row.id}/`);
      Object.assign(row, resp.data || {}, { is_active: false });
      $q.notify({ message: "SSP user disabled", color: "positive" });
      await loadPortalUsers();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Disable failed", color: "negative" });
    }
  });
}

function defaultInfoCategoryForm() {
  return {
    title: "",
    slug: "",
    icon: "article",
    sort_order: 100,
    is_active: true,
  };
}

function defaultInfoArticleForm() {
  return {
    category: null,
    title: "",
    body: "",
    icon: "article",
    link: "",
    link_label: "",
    is_published: true,
    sort_order: 100,
  };
}

async function loadSspInfoPortalAdmin() {
  loadingSspInfo.value = true;
  try {
    const [categoriesResp, articlesResp] = await Promise.all([
      axios.get("/appmanagement/ssp/info/categories/"),
      axios.get("/appmanagement/ssp/info/articles/"),
    ]);
    sspInfoCategories.value = categoriesResp.data || [];
    sspInfoArticles.value = articlesResp.data || [];
  } catch (e: any) {
    sspInfoCategories.value = [];
    sspInfoArticles.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load Info Portal CMS", color: "negative" });
  } finally {
    loadingSspInfo.value = false;
  }
}

function infoCategoryLabel(id: number) {
  const row = sspInfoCategories.value.find((cat: any) => String(cat.id) === String(id));
  return row?.title || `Category #${id || "?"}`;
}

function showInfoCategoryDialog(row?: any) {
  editingInfoCategory.value = row || null;
  infoCategoryForm.value = row ? { ...defaultInfoCategoryForm(), ...row } : defaultInfoCategoryForm();
  infoCategoryDialogOpen.value = true;
}

function showInfoArticleDialog(row?: any) {
  editingInfoArticle.value = row || null;
  infoArticleForm.value = row
    ? { ...defaultInfoArticleForm(), ...row }
    : { ...defaultInfoArticleForm(), category: sspInfoCategories.value[0]?.id || null };
  infoArticleDialogOpen.value = true;
}

async function saveInfoCategory() {
  if (!infoCategoryForm.value.title) {
    $q.notify({ message: "Category title required", color: "warning" });
    return;
  }
  savingSspInfo.value = true;
  try {
    if (editingInfoCategory.value?.id) {
      await axios.patch(`/appmanagement/ssp/info/categories/${editingInfoCategory.value.id}/`, infoCategoryForm.value);
    } else {
      await axios.post("/appmanagement/ssp/info/categories/", infoCategoryForm.value);
    }
    infoCategoryDialogOpen.value = false;
    $q.notify({ message: "Category saved", color: "positive", icon: "check" });
    await loadSspInfoPortalAdmin();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingSspInfo.value = false;
  }
}

async function saveInfoArticle() {
  if (!infoArticleForm.value.category || !infoArticleForm.value.title) {
    $q.notify({ message: "Article category and title are required", color: "warning" });
    return;
  }
  savingSspInfo.value = true;
  try {
    if (editingInfoArticle.value?.id) {
      await axios.patch(`/appmanagement/ssp/info/articles/${editingInfoArticle.value.id}/`, infoArticleForm.value);
    } else {
      await axios.post("/appmanagement/ssp/info/articles/", infoArticleForm.value);
    }
    infoArticleDialogOpen.value = false;
    $q.notify({ message: "Article saved", color: "positive", icon: "check" });
    await loadSspInfoPortalAdmin();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingSspInfo.value = false;
  }
}

async function patchInfoCategory(row: any, patch: Record<string, any>) {
  const prev = { ...row };
  Object.assign(row, patch);
  try {
    await axios.patch(`/appmanagement/ssp/info/categories/${row.id}/`, patch);
  } catch (e: any) {
    Object.assign(row, prev);
    $q.notify({ message: e?.response?.data?.error || e?.message || "Update failed", color: "negative" });
  }
}

async function patchInfoArticle(row: any, patch: Record<string, any>) {
  const prev = { ...row };
  Object.assign(row, patch);
  try {
    await axios.patch(`/appmanagement/ssp/info/articles/${row.id}/`, patch);
  } catch (e: any) {
    Object.assign(row, prev);
    $q.notify({ message: e?.response?.data?.error || e?.message || "Update failed", color: "negative" });
  }
}

async function removeInfoCategory(id: number) {
  $q.dialog({ title: "Remove category?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/info/categories/${id}/`);
      await loadSspInfoPortalAdmin();
      $q.notify({ message: "Removed", color: "positive" });
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

async function removeInfoArticle(id: number) {
  $q.dialog({ title: "Remove article?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/info/articles/${id}/`);
      await loadSspInfoPortalAdmin();
      $q.notify({ message: "Removed", color: "positive" });
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

async function saveApp() {
  if (!validateScopedTarget(appForm.value)) return;
  savingApp.value = true;
  try {
    const payload = {
      ...normalizeScopedPayload(appForm.value),
      app_names: textToList(appNamesInput.value),
      app_publishers: textToList(appPublishersInput.value),
      app_hashes: textToList(appHashesInput.value),
      list_type: appDialogType.value,
    };
    if (editingApp.value) {
      await axios.put(`/appmanagement/apps/${editingApp.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/apps/", payload);
    }
    appDialogOpen.value = false;
    $q.notify({ message: "App policy saved", color: "positive", icon: "check" });
    await loadApps();
    await loadAppInventory();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally { savingApp.value = false; }
}

function appNameForPolicy(row: any): string {
  return String(row.name || row.package_id || row.file_name || "").trim();
}

function quickPolicyFromSelected(type: "blacklist" | "whitelist") {
  void quickPolicyFromRows(type, selectedInstalledApps.value);
}

async function quickPolicyFromRows(type: "blacklist" | "whitelist", rows: any[]) {
  const appNames = rows.map(appNameForPolicy).filter(Boolean);
  if (appNames.length === 0) {
    $q.notify({ message: "No application names selected", color: "warning" });
    return;
  }
  const scope = selectedAppAgentId.value ? "device" : "global";
  const payload = {
    ...defaultAppPolicyForm(type),
    name: `${type === "blacklist" ? "Block" : "Allow"} ${appNames.slice(0, 3).join(", ")}${appNames.length > 3 ? ` +${appNames.length - 3}` : ""}`,
    scope,
    target_agent_id: scope === "device" ? selectedAppAgentId.value : "",
    app_names: appNames,
    block_app_store: type === "blacklist",
  };
  try {
    await axios.post("/appmanagement/apps/", payload);
    $q.notify({ message: `${type === "blacklist" ? "Blocklist" : "Allowlist"} rule created`, color: "positive", icon: "check" });
    selectedInstalledApps.value = [];
    selectedAvailableApps.value = [];
    await loadApps();
    await loadAppInventory();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Policy create failed", color: "negative" });
  }
}

function distributionPayloadForApp(row: any) {
  const installer = row.installer || "choco";
  const packageId = row.package_id || row.name;
  return {
    name: `Install ${row.name || packageId}`,
    installer,
    action: "install",
    package_id: packageId,
    package_version: row.version || "",
    command: row.command || "",
    scope: "device",
    target_agent_id: selectedAppAgentId.value,
    enabled: true,
    dry_run: false,
  };
}

async function installAvailableApp(row: any) {
  if (!selectedAppAgentId.value) {
    $q.notify({ message: "Select a device first", color: "warning" });
    return;
  }
  const state = availableInstallState(row);
  if (state.blocked) {
    $q.notify({ message: `${row.name} cannot be installed: ${state.label}`, color: "warning" });
    return;
  }
  try {
    const response = await axios.post("/appmanagement/app-distributions/", distributionPayloadForApp(row));
    notifyDistributionResult(response.data, `Install request saved for ${row.name}`, "system_update_alt");
    await loadAppDistributions();
    await loadAppInventory();
  } catch (e: any) {
    $q.notify({ message: apiErrorMessage(e, "Install dispatch failed"), color: "negative" });
  }
}

async function installSelectedApps() {
  const rows = selectedAvailableApps.value.filter((row) => row.installable && !availableInstallState(row).blocked);
  if (!rows.length) {
    $q.notify({ message: "Selected apps are not installable or are blocked by policy", color: "warning" });
    return;
  }
  installingSelectedApps.value = true;
  try {
    let triggered = 0;
    for (const row of rows) {
      const response = await axios.post("/appmanagement/app-distributions/", distributionPayloadForApp(row));
      triggered += distributionTriggerCount(response.data);
    }
    if (triggered > 0) {
      $q.notify({ message: `${rows.length} install request(s) saved; dispatched to ${triggered} device(s)`, color: "positive", icon: "system_update_alt" });
    } else {
      $q.notify({ message: `${rows.length} install request(s) saved; no matching agents found yet`, color: "warning", icon: "warning" });
    }
    selectedAvailableApps.value = [];
    await loadAppDistributions();
    await loadAppInventory();
  } catch (e: any) {
    $q.notify({ message: apiErrorMessage(e, "Install dispatch failed"), color: "negative" });
  } finally {
    installingSelectedApps.value = false;
  }
}

function normalizeDistributionPayload() {
  const payload = normalizeScopedPayload(distributionForm.value);
  payload.required_app_policy_ids = (payload.required_app_policy_ids || [])
    .map((id: any) => Number(id))
    .filter((id: number) => Number.isInteger(id) && id > 0);
  for (const key of ["min_os_build", "max_os_build"]) {
    if (payload[key] === "" || payload[key] === undefined) payload[key] = null;
  }
  if (payload.installer !== "rawcmd") payload.command = "";
  if (payload.installer === "rawcmd") {
    payload.package_id = payload.package_id || "rawcmd";
    payload.package_version = "";
  }
  return payload;
}
async function saveDistribution() {
  if (!validateScopedTarget(distributionForm.value)) return;
  savingDistribution.value = true;
  try {
    const payload = normalizeDistributionPayload();
    if (editingDistribution.value) {
      const response = await axios.patch(`/appmanagement/app-distributions/${editingDistribution.value.id}/`, payload);
      notifyDistributionResult(response.data, "App distribution saved");
    } else {
      const response = await axios.post("/appmanagement/app-distributions/", payload);
      notifyDistributionResult(response.data, "App distribution saved");
    }
    distributionDialogOpen.value = false;
    await loadAppDistributions();
  } catch (e: any) {
    $q.notify({ message: apiErrorMessage(e, "Save failed"), color: "negative" });
  } finally {
    savingDistribution.value = false;
  }
}
async function toggleDistribution(row: any) {
  try {
    const response = await axios.patch(`/appmanagement/app-distributions/${row.id}/`, { enabled: !row.enabled });
    notifyDistributionResult(response.data, response.data?.enabled ? "Distribution enabled" : "Distribution disabled");
    await loadAppDistributions();
  } catch (e: any) {
    $q.notify({ message: apiErrorMessage(e, "Update failed"), color: "negative" });
  }
}
async function refreshDistribution(row: any) {
  try {
    const response = await axios.patch(`/appmanagement/app-distributions/${row.id}/`, {});
    notifyDistributionResult(response.data, "Distribution dispatch requested", "sync");
    await loadAppDistributions();
  } catch (e: any) {
    $q.notify({ message: apiErrorMessage(e, "Dispatch failed"), color: "negative" });
  }
}

async function saveWebsite() {
  if (!validateScopedTarget(websiteForm.value)) return;
  savingWebsite.value = true;
  try {
    const payload = {
      ...normalizeScopedPayload(websiteForm.value),
      list_type: editingWebsite.value?.list_type ?? websiteDialogType.value,
    };
    if (editingWebsite.value) {
      await axios.put(`/appmanagement/websites/${editingWebsite.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/websites/", payload);
    }
    websiteDialogOpen.value = false;
    $q.notify({ message: "Website policy saved", color: "positive", icon: "check" });
    await loadWebsites();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingWebsite.value = false;
  }
}
async function saveWlan() {
  if (!validateScopedTarget(wlanForm.value)) return;
  savingWlan.value = true;
  try {
    const payload = normalizeScopedPayload(wlanForm.value);
    if (editingWlan.value) {
      await axios.put(`/appmanagement/wlan/${editingWlan.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/wlan/", payload);
    }
    wlanDialogOpen.value = false;
    $q.notify({ message: "WLAN profile saved", color: "positive", icon: "check" });
    await loadWlan();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally { savingWlan.value = false; }
}
async function saveVpn() {
  if (!validateScopedTarget(vpnForm.value)) return;
  savingVpn.value = true;
  try {
    const payload = normalizeScopedPayload(vpnForm.value);
    if (editingVpn.value) {
      await axios.put(`/appmanagement/vpn/${editingVpn.value.id}/`, payload);
    } else {
      await axios.post("/appmanagement/vpn/", payload);
    }
    vpnDialogOpen.value = false;
    $q.notify({ message: "VPN profile saved", color: "positive", icon: "check" });
    await loadVpn();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally { savingVpn.value = false; }
}

async function deployWlan(profile: any) {
  $q.dialog({
    title: "Deploy WLAN Profile",
    message: "Enter Agent ID:",
    prompt: { model: "", label: "Agent ID" },
    cancel: true,
  }).onOk(async (agentId: string) => {
    if (!agentId) return;
    await axios.post(`/appmanagement/wlan/${profile.id}/deploy/`, { agent_id: agentId });
    $q.notify({ message: "WLAN deploy initiated", color: "info", icon: "wifi" });
  });
}

async function deleteItem(type: string, id: number) {
  const urls: Record<string, string> = {
    apps: "/appmanagement/apps/",
    distribution: "/appmanagement/app-distributions/",
    websites: "/appmanagement/websites/",
    wlan: "/appmanagement/wlan/",
    vpn: "/appmanagement/vpn/",
    ssp: "/appmanagement/ssp/devices/",
  };
  $q.dialog({ title: "Delete?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`${urls[type]}${id}/`);
      $q.notify({ message: "Deleted", color: "positive", icon: "check" });
      if (type === "apps") await loadApps();
      else if (type === "distribution") await loadAppDistributions();
      else if (type === "websites") await loadWebsites();
      else if (type === "wlan") await loadWlan();
      else if (type === "vpn") await loadVpn();
      else await loadSsp();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

onMounted(() => {
  loadApps();
  loadAppInventory();
  loadAppDistributions();
  loadWebsites();
  loadWlan();
  loadVpn();
  loadSsp();
  loadSspSettings();
  loadPortalUsers();
  loadEnrollmentPolicies();
  loadSspInstallRequests();
  loadSspRightRequests();
  loadSspActions();
  loadSspInfoPortalAdmin();
  loadScopeTargetOptions();
  loadUserGroups();
  loadInternalCatalogApps();
  loadAppStoreLinks();
  loadContainerTransfers();
  loadAgentsForContainers();
});

// ===== User Group Apps (#410) =====
const selectedGroup = ref<any>(null);
const userGroups = ref<any[]>([]);
const userGroupsLoadError = ref("");
const groupAppAssignments = ref<any[]>([]);

async function loadUserGroups() {
  userGroupsLoadError.value = "";
  try {
    const r = await axios.get("/accounts/user-groups/");
    const data = Array.isArray(r.data) ? r.data : r.data?.results ?? [];
    userGroups.value = data.map((g: any) => ({
      ...g,
      site_count: Array.isArray(g.sites) ? g.sites.length : 0,
    }));
  } catch (e: any) {
    userGroups.value = [];
    userGroupsLoadError.value = e?.response?.data?.error || e?.message || "Could not load user groups.";
    $q.notify({ message: userGroupsLoadError.value, color: "negative" });
  }
}

async function loadGroupAssignmentsForSelected() {
  const g = selectedGroup.value;
  if (!g?.id) {
    groupAppAssignments.value = [];
    return;
  }
  try {
    groupAppAssignments.value = (
      await axios.get("/appmanagement/group-assignments/", { params: { group_id: g.id } })
    ).data;
  } catch (e: any) {
    groupAppAssignments.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load assignments", color: "negative" });
  }
}

watch(selectedGroup, () => {
  void loadGroupAssignmentsForSelected();
});

const groupAppColumns = [
  { name: "app", label: "Application", field: "app", align: "left" },
  { name: "category", label: "Category", field: "category", align: "left" },
  { name: "assigned", label: "Assigned", field: "assigned", align: "center" },
  { name: "mandatory", label: "Mandatory Install", field: "mandatory", align: "center" },
];
function toggleAppForGroup(app: any) {
  if (!app.assigned) app.mandatory = false;
}
async function saveGroupAppAssignments() {
  if (!selectedGroup.value?.id) {
    $q.notify({ message: "Select a user group first", color: "warning" });
    return;
  }
  try {
    await axios.post("/appmanagement/group-assignments/", {
      group_id: selectedGroup.value.id,
      assignments: groupAppAssignments.value,
    });
    $q.notify({
      message: "App assignments saved for " + (selectedGroup.value.display_name || selectedGroup.value.name),
      color: "positive",
    });
    await loadGroupAssignmentsForSelected();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  }
}

// ===== App Store Links (#447) =====
const internalCatalogApps = ref<any[]>([]);
const loadingInternalCatalog = ref(false);
const internalCatalogDialogOpen = ref(false);
const editingInternalCatalogApp = ref<any | null>(null);
const savingInternalCatalog = ref(false);
const internalCatalogForm = ref<any>(defaultInternalCatalogForm());
const showAddAppStore = ref(false);
const newStore = ref({ name: "", url: "", description: "", category: "Other", visible_in_ssp: true });
const appStoreLinks = ref<any[]>([]);
const catalogCategoryForToggle = ref("");
const catalogCategoryVisible = ref(true);
const savingCatalogCategory = ref(false);

const internalCatalogColumns = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "category", label: "Category", field: "category", align: "left" },
  { name: "version", label: "Version", field: "version", align: "left" },
  { name: "latest_version", label: "Latest", field: "latest_version", align: "left" },
  { name: "installer", label: "Installer", field: "installer", align: "left" },
  { name: "package_id", label: "Package ID", field: "package_id", align: "left" },
  { name: "approval_required", label: "Approval", field: (row: any) => row.approval_required ? "Required" : "Auto", align: "center" },
  { name: "visible_in_ssp", label: "SSP", field: "visible_in_ssp", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "right" },
];

const catalogCategoryOptions = computed(() => {
  const values = [
    ...internalCatalogApps.value.map((row) => row.category || "Enterprise Software"),
    ...appStoreLinks.value.map((row) => row.category || "Other"),
  ];
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
});

function defaultInternalCatalogForm() {
  return {
    name: "",
    description: "",
    category: "Enterprise Software",
    version: "",
    platform: "windows",
    installer: "",
    package_id: "",
    file_name: "",
    visible_in_ssp: true,
    approval_required: true,
    latest_version: "",
    force_update_required: false,
    retirement_date: "",
  };
}

async function loadInternalCatalogApps() {
  loadingInternalCatalog.value = true;
  try {
    internalCatalogApps.value = (await axios.get("/appmanagement/ssp/catalog/internal-files/")).data || [];
  } catch (e: any) {
    internalCatalogApps.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load internal app catalog", color: "negative" });
  } finally {
    loadingInternalCatalog.value = false;
  }
}

function showInternalAppDialog(row?: any) {
  editingInternalCatalogApp.value = row || null;
  internalCatalogForm.value = row ? { ...defaultInternalCatalogForm(), ...row } : defaultInternalCatalogForm();
  distributionChocoSearch.value = "";
  if (internalCatalogForm.value.installer === "choco") {
    void loadDistributionChocoPackages();
  }
  internalCatalogDialogOpen.value = true;
}

async function saveInternalCatalogApp() {
  if (!internalCatalogForm.value.name) {
    $q.notify({ message: "Name required", color: "warning" });
    return;
  }
  savingInternalCatalog.value = true;
  try {
    if (editingInternalCatalogApp.value?.id) {
      await axios.patch(`/appmanagement/ssp/catalog/internal-files/${editingInternalCatalogApp.value.id}/`, internalCatalogForm.value);
    } else {
      await axios.post("/appmanagement/ssp/catalog/internal-files/", internalCatalogForm.value);
    }
    internalCatalogDialogOpen.value = false;
    $q.notify({ message: "Internal app saved", color: "positive", icon: "check" });
    await loadInternalCatalogApps();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Save failed", color: "negative" });
  } finally {
    savingInternalCatalog.value = false;
  }
}

async function patchInternalCatalogApp(row: any, patch: Record<string, any>) {
  const prev = { ...row };
  Object.assign(row, patch);
  try {
    await axios.patch(`/appmanagement/ssp/catalog/internal-files/${row.id}/`, patch);
  } catch (e: any) {
    Object.assign(row, prev);
    $q.notify({ message: e?.response?.data?.error || e?.message || "Update failed", color: "negative" });
  }
}

async function removeInternalCatalogApp(id: number) {
  $q.dialog({ title: "Remove internal app?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/ssp/catalog/internal-files/${id}/`);
      await loadInternalCatalogApps();
      $q.notify({ message: "Removed", color: "positive" });
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

async function loadAppStoreLinks() {
  try {
    appStoreLinks.value = (await axios.get("/appmanagement/app-store-links/")).data;
  } catch (e: any) {
    appStoreLinks.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load app store links", color: "negative" });
  }
}

async function addAppStoreLink() {
  if (!newStore.value.name || !newStore.value.url) {
    $q.notify({ message: "Name and URL required", color: "warning" });
    return;
  }
  try {
    await axios.post("/appmanagement/app-store-links/", {
      ...newStore.value,
      icon: "store",
      color: "primary",
    });
    $q.notify({ message: "App store link added", color: "positive" });
    showAddAppStore.value = false;
    newStore.value = { name: "", url: "", description: "", category: "Other", visible_in_ssp: true };
    await loadAppStoreLinks();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to add link", color: "negative" });
  }
}

async function patchAppStoreVisibility(store: any, visible: boolean) {
  const prev = store.visible_in_ssp;
  store.visible_in_ssp = visible;
  try {
    await axios.patch(`/appmanagement/app-store-links/${store.id}/`, { visible_in_ssp: visible });
  } catch (e: any) {
    store.visible_in_ssp = prev;
    $q.notify({ message: e?.response?.data?.error || e?.message || "Update failed", color: "negative" });
  }
}

async function applyCatalogCategoryVisibility() {
  if (!catalogCategoryForToggle.value) {
    $q.notify({ message: "Choose category", color: "warning" });
    return;
  }
  savingCatalogCategory.value = true;
  try {
    const resp = await axios.post("/appmanagement/ssp/catalog/category/toggle/", {
      category: catalogCategoryForToggle.value,
      visible: catalogCategoryVisible.value,
    });
    await Promise.all([loadInternalCatalogApps(), loadAppStoreLinks()]);
    $q.notify({
      message: `Category updated (${resp.data?.external_updated || 0} links, ${resp.data?.internal_updated || 0} internal apps)`,
      color: "positive",
      icon: "check",
    });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Category update failed", color: "negative" });
  } finally {
    savingCatalogCategory.value = false;
  }
}

async function removeAppStore(id: number) {
  $q.dialog({ title: "Remove link?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/app-store-links/${id}/`);
      await loadAppStoreLinks();
      $q.notify({ message: "Removed", color: "positive" });
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

// ===== Container File Sharing (#521-522) =====
const agentSelectOptions = ref<{ label: string; value: string }[]>([]);
const containerOptions = ref<{ label: string; value: number; state: string; drive: string }[]>([]);
const loadingContainers = ref(false);
const importingFile = ref(false);
const exportingFile = ref(false);
const containerImport = ref({ device: "", containerId: null as number | null, targetPath: "\\", file: null as any });
const containerExport = ref({ device: "", containerId: null as number | null, path: "" });
const containerTransferLog = ref<any[]>([]);

const containerLogColumns = [
  { name: "timestamp", label: "Time", field: "timestamp", align: "left" },
  { name: "direction", label: "Direction", field: "direction", align: "left" },
  { name: "device", label: "Device", field: "device", align: "left" },
  { name: "file", label: "File", field: "file", align: "left" },
  { name: "size", label: "Size", field: "size", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

function mapTransferRow(r: any) {
  return {
    id: r.id,
    timestamp: r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    direction: r.direction,
    device: r.device_label,
    file: r.file_name,
    size: r.size_label || "—",
    status: r.status,
    download_url: r.details?.download_url || "",
  };
}

async function loadAgentsForContainers() {
  try {
    const r = await axios.get("/agents/", { params: { detail: "false" } });
    const data = Array.isArray(r.data) ? r.data : r.data?.results ?? [];
    agentSelectOptions.value = data.map((a: any) => ({
      label: `${a.hostname || a.agent_id} (${a.agent_id})`,
      value: a.agent_id,
    }));
    const first = agentSelectOptions.value[0]?.value || "";
    if (!containerImport.value.device) containerImport.value.device = first;
    if (!containerExport.value.device) containerExport.value.device = first;
    if (first) await loadContainersForDevice(first);
  } catch {
    agentSelectOptions.value = [];
  }
}

async function loadContainerTransfers() {
  try {
    const agentId = containerImport.value.device || containerExport.value.device || "";
    const rows = (await axios.get("/appmanagement/container-transfers/", { params: agentId ? { agent_id: agentId } : {} })).data;
    containerTransferLog.value = Array.isArray(rows) ? rows.map(mapTransferRow) : [];
  } catch (e: any) {
    containerTransferLog.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load transfer log", color: "negative" });
  }
}

async function loadContainersForDevice(agentId?: string) {
  const id = agentId || containerImport.value.device || containerExport.value.device;
  if (!id) {
    containerOptions.value = [];
    return;
  }
  loadingContainers.value = true;
  try {
    const r = await axios.get("/appmanagement/workspaces/containers/", { params: { agent_id: id } });
    const rows = Array.isArray(r.data?.items) ? r.data.items : [];
    containerOptions.value = rows.map((c: any) => ({
      label: `${c.label || c.workspace_name || `Container #${c.id}`} · ${c.state || "unknown"}${c.drive_letter ? ` · ${c.drive_letter}` : ""}`,
      value: c.id,
      state: c.state || "",
      drive: c.drive_letter || "",
    }));
    const firstMounted = containerOptions.value.find((c) => c.state === "mounted") || containerOptions.value[0];
    const hasImport = containerOptions.value.some((c) => c.value === containerImport.value.containerId);
    const hasExport = containerOptions.value.some((c) => c.value === containerExport.value.containerId);
    if ((!containerImport.value.containerId || !hasImport) && firstMounted) containerImport.value.containerId = firstMounted.value;
    if ((!containerExport.value.containerId || !hasExport) && firstMounted) containerExport.value.containerId = firstMounted.value;
  } catch (e: any) {
    containerOptions.value = [];
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to load containers", color: "negative" });
  } finally {
    loadingContainers.value = false;
  }
}

async function importToContainer() {
  if (!containerImport.value.device || !containerImport.value.containerId || !containerImport.value.file) {
    $q.notify({ message: "Device, container and file required", color: "warning" });
    return;
  }
  importingFile.value = true;
  try {
    const body = new FormData();
    body.append("direction", "import");
    body.append("agent_id", containerImport.value.device);
    body.append("container_id", String(containerImport.value.containerId));
    body.append("target_path", containerImport.value.targetPath || "\\");
    body.append("file", containerImport.value.file);
    const resp = await axios.post("/appmanagement/container-transfers/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    containerImport.value.file = null;
    $q.notify({ message: `File copied to ${resp.data?.details?.target_path || "container"}`, color: "positive" });
    await loadContainerTransfers();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Request failed", color: "negative" });
  } finally {
    importingFile.value = false;
  }
}

async function extractFromContainer() {
  if (!containerExport.value.device || !containerExport.value.containerId || !containerExport.value.path) {
    $q.notify({ message: "Device, container and file path required", color: "warning" });
    return;
  }
  exportingFile.value = true;
  try {
    const resp = await axios.post("/appmanagement/container-transfers/", {
      direction: "export",
      agent_id: containerExport.value.device,
      container_id: containerExport.value.containerId,
      source_path: containerExport.value.path,
    });
    containerExport.value.path = "";
    $q.notify({ message: "File exported from container", color: "positive" });
    const url = resp.data?.details?.download_url;
    if (url) window.open(url, "_blank");
    await loadContainerTransfers();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Request failed", color: "negative" });
  } finally {
    exportingFile.value = false;
  }
}
</script>

<style scoped lang="sass">
.appmgmt-summary
  display: grid
  grid-template-columns: repeat(4, minmax(160px, 1fr))
  gap: 12px

.policy-entry-list
  display: flex
  flex-wrap: wrap
  gap: 4px
  max-width: 520px

.distribution-choco-picker
  max-height: 360px
  overflow: hidden

.distribution-choco-table
  max-height: 250px

.distribution-choco-description
  max-width: 300px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.ssp-request-detail-label
  width: 190px
  vertical-align: top
  color: #4b5563

.ssp-request-detail-value
  white-space: pre-wrap
  word-break: break-word
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace

.ssp-request-raw-json
  max-height: 280px
  overflow: auto
  white-space: pre-wrap
  word-break: break-word
  margin: 0
  padding: 12px
  border: 1px solid #e5e7eb
  border-radius: 6px
  background: #f9fafb
  font-size: 12px

@media (max-width: 1100px)
  .appmgmt-summary
    grid-template-columns: repeat(2, minmax(160px, 1fr))

@media (max-width: 640px)
  .appmgmt-summary
    grid-template-columns: 1fr
</style>
