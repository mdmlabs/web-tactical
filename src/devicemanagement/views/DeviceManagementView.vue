<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('devicemanagement.views.DeviceManagementView.32fc9a') }}</div>

    <q-tabs v-model="tab" dense class="q-mb-md" align="left">
      <q-tab name="workspace" :label="$t('devicemanagement.views.DeviceManagementView.4ca0a7')" icon="work" />
      <q-tab name="actions" :label="$t('devicemanagement.views.DeviceManagementView.d43b91')" icon="settings_remote" />
      <q-tab name="geolocation" :label="$t('devicemanagement.views.DeviceManagementView.2ee8f7')" icon="location_on" />
      <q-tab name="encryption" :label="$t('devicemanagement.views.DeviceManagementView.0af149')" icon="lock" />
      <q-tab name="inventory" :label="$t('devicemanagement.views.DeviceManagementView.414643')" icon="filter_list" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>

      <!-- Remote Actions -->
      <q-tab-panel name="actions">
        <div class="row q-gutter-sm q-mb-md items-center">
          <q-select v-model="actionFilter.status" :options="statusOptions" :label="$t('devicemanagement.views.DeviceManagementView.bae7d5')" dense outlined clearable emit-value map-options
            style="min-width:130px" @update:model-value="loadActions" />
          <q-select v-model="actionFilter.action_type" :options="actionTypeOptions" :label="$t('devicemanagement.views.DeviceManagementView.b35abd')" dense outlined clearable emit-value map-options
            style="min-width:160px" @update:model-value="loadActions" />
          <AgentPicker
            v-model="actionFilter.agent_id"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.5ce2e6')"
            dense outlined clearable
            style="min-width:260px"
            @update:model-value="loadActions"
          />
          <q-space />
          <q-btn flat dense round icon="refresh" color="primary" :loading="loadingActions"
            @click="loadActions" :title="$t('devicemanagement.views.DeviceManagementView.56e3ba')" />
          <q-toggle v-model="actionsAutoRefresh" :label="$t('devicemanagement.views.DeviceManagementView.c614ba')" dense
            @update:model-value="toggleActionsAutoRefresh" />
          <q-btn color="negative" icon="lock" :label="$t('devicemanagement.views.DeviceManagementView.7bdbd3')" @click="showActionDialog('lock')" />
          <q-btn-dropdown color="negative" icon="delete_forever" :label="$t('devicemanagement.views.DeviceManagementView.a0e027')">
            <q-list>
              <q-item clickable v-close-popup @click="showActionDialog('wipe_selective')">
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.5a2d14') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="showActionDialog('wipe_full')">
                <q-item-section class="text-negative">{{ $t('devicemanagement.views.DeviceManagementView.d8f5da') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown color="warning" icon="more_horiz" :label="$t('devicemanagement.views.DeviceManagementView.4bab2d')">
            <q-list dense>
              <q-item clickable v-close-popup @click="showActionDialog('unlock')"><q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.1526a1') }}</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('reset_password')"><q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.3fb75e') }}</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('block_access')"><q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.9ee317') }}</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('allow_access')"><q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.a8347d') }}</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('geolockmode')"><q-item-section class="text-warning">Lost Mode + Geolocation</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('remove_agent')"><q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.193a6f') }}</q-item-section></q-item>
              <q-item clickable v-close-popup @click="showActionDialog('createrestorepoint')">
                <q-item-section avatar><q-icon name="restore" /></q-item-section>
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.01edb6') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="showActionDialog('factory_reset')"><q-item-section class="text-negative">{{ $t('devicemanagement.views.DeviceManagementView.d13710') }}</q-item-section></q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <!-- Bulk action toolbar — appears when agents selected in the agent list -->
        <div class="row q-gutter-sm q-mb-md items-center" v-if="selectedAgentIds.length > 0">
          <q-chip color="primary" text-color="white" icon="check_box">
            {{ selectedAgentIds.length }} agent(s) selected
          </q-chip>
          <q-btn-dropdown color="negative" icon="bolt" :label="$t('devicemanagement.views.DeviceManagementView.d85906')" dense>
            <q-list>
              <q-item clickable v-close-popup @click="bulkAction('lock')">
                <q-item-section avatar><q-icon name="lock" /></q-item-section>
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.bd6d89') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="bulkAction('wipe_selective')">
                <q-item-section avatar><q-icon name="delete_sweep" /></q-item-section>
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.dea946') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="bulkAction('block_access')">
                <q-item-section avatar><q-icon name="block" /></q-item-section>
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.9ee317') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="bulkAction('allow_access')">
                <q-item-section avatar><q-icon name="check_circle" /></q-item-section>
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.a8347d') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="bulkAction('geolockmode')">
                <q-item-section avatar><q-icon name="travel_explore" /></q-item-section>
                <q-item-section>Lost Mode + Geolocation</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat dense :label="$t('devicemanagement.views.DeviceManagementView.247fd6')" @click="selectedAgentIds = []" />
        </div>

        <!-- Agent multi-select for bulk selection -->
        <div class="row q-gutter-sm q-mb-sm items-center">
          <AgentPicker
            v-model="selectedAgentIds"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.1e59e9')"
            multiple
            outlined dense
            style="min-width: 460px"
          />
        </div>

        <q-table
          :rows="actions"
          :columns="actionColumns"
          dense
          row-key="id"
          :loading="loadingActions"
          :rows-per-page-options="[20, 50, 100]"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip dense :color="actionStatusColor(props.value)" text-color="white">{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn v-if="props.row.status === 'pending'" flat dense round icon="cancel" size="sm" color="warning"
                @click="cancelAction(props.row)" :title="$t('devicemanagement.views.DeviceManagementView.77dfd2')" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Geolocation -->
      <q-tab-panel name="geolocation">
        <div class="row q-gutter-sm q-mb-md items-center">
          <q-btn-toggle
            v-model="geoMode"
            dense no-caps
            :options="[
              { label: 'Device',      value: 'agent',      icon: 'laptop_chromebook' },
              { label: 'Device group', value: 'site',       icon: 'apartment' },
              { label: 'User group',  value: 'user_group', icon: 'groups' },
              { label: 'User',        value: 'user',       icon: 'person' },
            ]"
            @update:model-value="onGeoModeChange" />

          <AgentPicker v-if="geoMode === 'agent'"
            v-model="geoAgentId"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.a5a74a')"
            dense outlined clearable
            style="min-width:260px"
            @update:model-value="onGeoTargetChange" />

          <q-select v-if="geoMode === 'site'"
            v-model="geoSiteId"
            :options="geoSiteOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.271a68')"
            dense outlined clearable
            emit-value map-options
            style="min-width:260px"
            @update:model-value="onGeoTargetChange" />

          <q-select v-if="geoMode === 'user_group'"
            v-model="geoUserGroupId"
            :options="geoUserGroupOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.9c7b54')"
            dense outlined clearable
            emit-value map-options
            style="min-width:260px"
            @update:model-value="onGeoTargetChange" />

          <q-select v-if="geoMode === 'user'"
            v-model="geoUsername"
            :options="geoUserOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.9f8a23')"
            dense outlined clearable
            emit-value map-options
            style="min-width:260px"
            @update:model-value="onGeoTargetChange" />

          <q-btn color="primary" icon="search" :label="$t('devicemanagement.views.DeviceManagementView.d97d1e')" @click="loadLocations" :loading="loadingLocations" />
          <q-btn color="secondary" icon="public" :label="$t('devicemanagement.views.DeviceManagementView.92c0fe')" @click="loadLatestLocations" :loading="loadingLocations" />
          <q-btn color="deep-orange" icon="bolt" :label="$t('devicemanagement.views.DeviceManagementView.a8c7b9')"
            :disable="geoMode !== 'agent' || !geoAgentId" :loading="geoProbing"
            @click="probeLocationNow"
            :title="$t('devicemanagement.views.DeviceManagementView.32ba5e')" />
          <q-btn-dropdown color="teal" icon="cloud_upload" :label="$t('devicemanagement.views.DeviceManagementView.615c77')">
            <q-list>
              <q-item clickable v-close-popup
                :disable="geoMode !== 'agent' || !geoAgentId"
                @click="deployScriptOne">
                <q-item-section>{{ $t('devicemanagement.views.DeviceManagementView.1c5f97') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="deployScriptAll">
                <q-item-section class="text-deep-orange">{{ $t('devicemanagement.views.DeviceManagementView.b94d6c') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-toggle v-model="geoAutoRefresh" :label="$t('devicemanagement.views.DeviceManagementView.c614ba')" dense
            @update:model-value="toggleGeoAutoRefresh" />
          <q-select v-if="geoAutoRefresh"
            v-model="geoRefreshSeconds"
            :options="[{label:'15s',value:15},{label:'30s',value:30},{label:'1m',value:60},{label:'5m',value:300}]"
            emit-value map-options dense outlined
            style="min-width:90px"
            @update:model-value="toggleGeoAutoRefresh" />
          <q-space />
          <!-- View toggle: map vs table -->
          <q-btn-toggle
            v-model="geoView"
            dense
            :options="[
              { label: 'Map', value: 'map', icon: 'map' },
              { label: 'Table', value: 'table', icon: 'table_chart' },
            ]"
          />
        </div>

        <!-- Zero-result banner: notify admin per spec #1.Result -->
        <q-banner v-if="geoLoadedOnce && locations.length === 0"
          dense rounded class="bg-warning text-white q-mb-md">
          <template v-slot:avatar><q-icon name="report" /></template>
          No geolocation data available for the selected {{ geoModeLabel() }}.
          Administrator has been notified.
        </q-banner>

        <!-- Map View -->
        <DeviceMap v-if="geoView === 'map'" :locations="locations" />

        <!-- Table View -->
        <q-table
          v-else
          :rows="locations"
          :columns="locationColumns"
          dense
          row-key="id"
          :loading="loadingLocations"
          :rows-per-page-options="[20, 50, 100]"
        >
          <template v-slot:body-cell-latitude="props">
            <q-td :props="props">{{ parseFloat(props.value).toFixed(6) }}</q-td>
          </template>
          <template v-slot:body-cell-longitude="props">
            <q-td :props="props">{{ parseFloat(props.value).toFixed(6) }}</q-td>
          </template>
          <template v-slot:body-cell-map_link="props">
            <q-td :props="props">
              <q-btn flat dense round icon="open_in_new" size="sm" color="primary"
                target="_blank" :title="$t('devicemanagement.views.DeviceManagementView.e567ae')" />
            </q-td>
          </template>
        </q-table>

        <div class="q-mt-sm text-caption text-grey">
          Location data collected by agent via Windows Location API, with IP-based fallback.
          Deploy script to agents to update the collector, or Probe now to force a fresh point.
        </div>
      </q-tab-panel>

      <!-- Encryption -->
      <q-tab-panel name="encryption">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('devicemanagement.views.DeviceManagementView.824750')" @click="showEncryptionDialog()" />
        </div>
        <q-table
          :rows="encryptionPolicies"
          :columns="encryptionColumns"
          dense
          row-key="id"
          :loading="loadingEncryption"
        >
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
                {{ props.value ? 'Active' : 'Disabled' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="send" size="sm" color="primary" @click="deployEncryption(props.row)" :title="$t('devicemanagement.views.DeviceManagementView.fb4192')" />
              <q-btn flat dense round icon="edit" size="sm" @click="showEncryptionDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteEncryption(props.row.id)" />
            </q-td>
          </template>
        </q-table>

        <!-- Deploy results (per-agent) -->
        <q-card v-if="encryptionDeployResults.length" flat bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2">Last deploy: {{ encryptionDeployPolicyName }}</div>
              <div class="text-caption text-grey-7">NATS func: <code>{{ encryptionDeployFunc }}</code></div>
            </div>
            <q-btn flat dense icon="close" @click="encryptionDeployResults = []" />
          </q-card-section>
          <q-table
            dense flat
            :rows="encryptionDeployResults"
            :columns="[
              {name:'label', label:'Agent', field:'label', align:'left'},
              {name:'status', label:'Status', field:'status', align:'center'},
              {name:'action_id', label:'Action ID', field:'action_id', align:'right'},
              {name:'summary', label:'Result', field:'summary', align:'left'},
              {name:'error', label:'Error', field:'error', align:'left'},
            ]"
            :rows-per-page-options="[10,25,0]"
            row-key="agent_id">
            <template v-slot:body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-chip dense size="sm"
                  :color="encryptionResultColor(props.value)"
                  text-color="white">{{ props.value }}</q-chip>
              </q-td>
            </template>
          </q-table>
        </q-card>

        <!-- BitLocker live status + key escrow controls -->
        <q-card flat bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2">BitLocker drive status</div>
              <div class="text-caption text-grey-7">
                Live read-only probe plus recovery-key escrow/rotation for system and removable drives.
              </div>
            </div>
            <div class="row q-gutter-sm items-center">
              <AgentPicker
                v-model="bitlockerAgentId"
                :options="agentOptions"
                label="Agent"
                dense outlined clearable
                style="min-width: 280px"
              />
              <q-input v-model="bitlockerDrive" label="Drive" dense outlined style="width: 90px" />
              <q-btn color="primary" icon="refresh" label="Status"
                :loading="bitlockerLoading" :disable="!bitlockerAgentId"
                @click="loadBitLockerStatus" />
              <q-btn color="secondary" icon="vpn_key" label="Escrow key"
                :loading="bitlockerEscrowLoading" :disable="!bitlockerAgentId"
                @click="escrowBitLockerKey" />
              <q-btn color="warning" icon="published_with_changes" label="Rotate key"
                :loading="bitlockerRotateLoading" :disable="!bitlockerAgentId"
                @click="rotateBitLockerKey" />
            </div>
          </q-card-section>
          <q-card-section v-if="bitlockerStatus">
            <div class="row q-gutter-sm q-mb-sm">
              <q-chip dense :color="bitlockerStatus?.status?.all_protected ? 'positive' : 'warning'" text-color="white">
                {{ bitlockerStatus?.status?.all_protected ? 'All protected' : 'Needs attention' }}
              </q-chip>
              <q-chip dense :color="bitlockerStatus?.status?.recovery_escrow ? 'positive' : 'warning'" text-color="white">
                {{ bitlockerStatus?.status?.recovery_escrow ? 'Recovery protector present' : 'No recovery protector' }}
              </q-chip>
              <q-chip dense color="grey-7" text-color="white">
                {{ bitlockerStatus?.recovery_keys?.length || 0 }} escrowed key(s)
              </q-chip>
            </div>
            <q-table
              dense flat
              :rows="bitlockerVolumes"
              :columns="bitlockerColumns"
              :rows-per-page-options="[0]"
              row-key="mount_point">
              <template v-slot:body-cell-protection_status="props">
                <q-td :props="props">
                  <q-chip dense size="sm" :color="props.value === 'On' ? 'positive' : 'negative'" text-color="white">
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-has_recovery_password="props">
                <q-td :props="props">
                  <q-icon :name="props.value ? 'check_circle' : 'warning'" :color="props.value ? 'positive' : 'warning'" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Phase-4: MKV256 crypto tooling (container spec #6/#7/#8) -->
        <q-card flat bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2">{{ $t('devicemanagement.views.DeviceManagementView.59e039') }}</div>
              <div class="text-caption text-grey-7">
                Server-side Argon2id + AES-256-GCM + Blake2b — replaces legacy Fernet
                for recovery-key escrow, device-cert backup and transport wrapping.
              </div>
            </div>
            <div class="row q-gutter-sm">
              <q-btn color="primary" icon="science" :label="$t('devicemanagement.views.DeviceManagementView.58949c')"
                :loading="mkvProbeLoading" @click="runMkvProbe" />
              <q-btn color="warning" icon="upgrade" :label="$t('devicemanagement.views.DeviceManagementView.a26811')"
                :loading="mkvMigrateLoading" @click="openMigrateDialog" />
            </div>
          </q-card-section>
          <q-card-section v-if="mkvProbeResult" class="q-pt-none">
            <q-banner dense rounded
              :class="mkvProbeResult.ok ? 'bg-positive text-white' : 'bg-negative text-white'">
              <template v-slot:avatar>
                <q-icon :name="mkvProbeResult.ok ? 'verified' : 'error'" />
              </template>
              Transport envelope {{ mkvProbeResult.ok ? "OK" : "FAIL" }}:
              <code>{{ mkvProbeResult.scheme }}</code> · KDF {{ mkvProbeResult.kdf }}
              · cipher {{ mkvProbeResult.cipher }}. Detail: {{ mkvProbeResult.detail }}
            </q-banner>
          </q-card-section>
          <q-card-section v-if="mkvMigrateResult" class="q-pt-none">
            <div class="text-subtitle2 q-mb-sm">
              Migration result ({{ mkvMigrateResult.dry_run ? "dry run" : "applied" }})
            </div>
            <div class="row q-gutter-md text-caption text-grey-8">
              <div>{{ $t('devicemanagement.views.DeviceManagementView.3c644b') }} <b>{{ mkvMigrateResult.scanned }}</b></div>
              <div>{{ $t('devicemanagement.views.DeviceManagementView.18df56') }} <b>{{ mkvMigrateResult.mkv_already }}</b></div>
              <div>{{ $t('devicemanagement.views.DeviceManagementView.28ce21') }} <b>{{ mkvMigrateResult.fernet_pending }}</b></div>
              <div>{{ $t('devicemanagement.views.DeviceManagementView.a98cc4') }} <b>{{ mkvMigrateResult.unknown_scheme }}</b></div>
              <div class="text-positive">{{ $t('devicemanagement.views.DeviceManagementView.0a2242') }} <b>{{ mkvMigrateResult.migrated }}</b></div>
              <div v-if="mkvMigrateResult.failed?.length" class="text-negative">
                {{ $t('devicemanagement.views.DeviceManagementView.f14f2b') }} <b>{{ mkvMigrateResult.failed.length }}</b>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Device certificate escrow (Phase-4 spec #6) -->
        <q-card flat bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2">{{ $t('devicemanagement.views.DeviceManagementView.cbe429') }}</div>
              <div class="text-caption text-grey-7">
                {{ $t('devicemanagement.views.DeviceManagementView.9518b8') }}
              </div>
            </div>
            <div class="row q-gutter-sm">
              <AgentPicker
                v-model="certBackupAgentFilter"
                :options="agentOptions"
                :label="$t('devicemanagement.views.DeviceManagementView.5ce2e6')" dense outlined clearable
                style="min-width: 260px"
                @update:model-value="loadCertBackups" />
              <q-btn flat dense round icon="refresh" @click="loadCertBackups" />
              <q-btn color="primary" icon="upload_file" :label="$t('devicemanagement.views.DeviceManagementView.c92b64')"
                @click="certUploadDialogOpen = true" />
            </div>
          </q-card-section>
          <q-table
            :rows="certBackups"
            :columns="certBackupColumns"
            dense row-key="id"
            :rows-per-page-options="[10,25]">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="visibility" size="sm" color="primary"
                  @click="revealCertBackup(props.row, false)" :title="$t('devicemanagement.views.DeviceManagementView.e24df3')" />
                <q-btn flat dense round icon="key" size="sm" color="warning"
                  @click="revealCertBackup(props.row, true)" :title="$t('devicemanagement.views.DeviceManagementView.f5b2aa')" />
                <q-btn flat dense round icon="delete" size="sm" color="negative"
                  @click="deleteCertBackup(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>

        <!-- Upload cert dialog -->
        <q-dialog v-model="certUploadDialogOpen" persistent>
          <q-card style="min-width: 520px">
            <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.7e7b64') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section class="q-gutter-sm">
              <AgentPicker v-model="certUploadForm.agent_id"
                :options="agentOptions" :label="$t('devicemanagement.views.DeviceManagementView.9a36d7')"
                dense outlined />
              <q-input v-model="certUploadForm.subject" :label="$t('devicemanagement.views.DeviceManagementView.8d183d')" outlined dense />
              <q-input v-model="certUploadForm.issuer" :label="$t('devicemanagement.views.DeviceManagementView.2587e4')" outlined dense />
              <q-input v-model="certUploadForm.cert_pem" :label="$t('devicemanagement.views.DeviceManagementView.896d89')"
                outlined dense type="textarea" rows="5"
                :placeholder="$t('devicemanagement.views.DeviceManagementView.262cef')" />
              <q-input v-model="certUploadForm.privkey_pem"
                :label="$t('devicemanagement.views.DeviceManagementView.3a837b')"
                outlined dense type="textarea" rows="4"
                :placeholder="$t('devicemanagement.views.DeviceManagementView.46b1d3')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
              <q-btn color="primary" icon="lock" :label="$t('devicemanagement.views.DeviceManagementView.1c15bf')"
                :disable="!certUploadForm.agent_id || !certUploadForm.cert_pem"
                :loading="certUploadLoading" @click="submitCertUpload" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Cert reveal dialog -->
        <q-dialog v-model="certRevealOpen">
          <q-card style="min-width: 600px; max-width: 80vw">
            <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.d91e0d') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section v-if="certRevealData">
              <div class="text-caption text-grey-7">
                Fingerprint: <code>{{ certRevealData.fingerprint_sha256 }}</code>
              </div>
              <q-input v-model="certRevealData.cert_pem" outlined dense
                type="textarea" rows="6" readonly class="q-mt-sm" />
              <q-input v-if="certRevealData.privkey_pem"
                v-model="certRevealData.privkey_pem"
                :label="$t('devicemanagement.views.DeviceManagementView.7b1acb')" outlined dense
                type="textarea" rows="4" readonly class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Migrate recovery-keys dialog -->
        <q-dialog v-model="mkvMigrateDialogOpen" persistent>
          <q-card style="min-width: 440px">
            <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.ead4f4') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
            <q-card-section>
              <div class="text-caption text-grey-8 q-mb-sm">
                Re-encrypts every Fernet-stored recovery key with MKV256
                (Argon2id + AES-256-GCM + Blake2b). Fully reversible while
                both schemes are supported.
              </div>
              <q-input v-model.number="mkvMigrateLimit" type="number"
                :label="$t('devicemanagement.views.DeviceManagementView.451057')" outlined dense />
              <q-toggle v-model="mkvMigrateApply" :label="$t('devicemanagement.views.DeviceManagementView.211a54')" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
              <q-btn :color="mkvMigrateApply ? 'warning' : 'primary'"
                :label="mkvMigrateApply ? 'Apply migration' : 'Run dry-run'"
                :loading="mkvMigrateLoading" @click="runMkvMigrate" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Recovery Keys Section -->
        <div class="q-mt-lg">
          <div class="text-subtitle1 q-mb-sm">{{ $t('devicemanagement.views.DeviceManagementView.cf5905') }}</div>
          <div class="row q-gutter-sm q-mb-md items-center">
            <AgentPicker
              v-model="recoveryAgentId"
              :options="agentOptions"
              :label="$t('devicemanagement.views.DeviceManagementView.5ce2e6')"
              dense outlined clearable
              style="min-width:260px"
            />
            <q-btn color="secondary" icon="search" :label="$t('devicemanagement.views.DeviceManagementView.5a6b87')" @click="loadRecoveryKeys" />
          </div>
          <q-table
            :rows="recoveryKeys"
            :columns="recoveryColumns"
            dense
            row-key="id"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  flat dense round
                  icon="vpn_key"
                  size="sm"
                  color="warning"
                  title="Reveal recovery key (audit-logged)"
                  @click="revealRecoveryKey(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Reveal-recovery-key dialog (audit-logged) -->
        <q-dialog v-model="revealKeyOpen" persistent>
          <q-card style="min-width: 460px">
            <q-bar>
              <q-icon name="vpn_key" class="q-mr-sm" />
              Reveal Recovery Key
              <q-space />
              <q-btn dense flat icon="close" v-close-popup @click="closeRevealDialog" />
            </q-bar>
            <q-card-section>
              <div class="text-body2 q-mb-sm">
                Agent: <code>{{ revealKeyTarget?.agent_id }}</code> /
                Volume <code>{{ revealKeyTarget?.volume_id || '—' }}</code>
              </div>
              <q-banner v-if="!revealKeyPlain" rounded class="bg-warning text-black q-mb-md">
                Revealing the key will write an audit-log entry visible to compliance officers.
                Provide a clear reason — this will appear in the WorkspaceRecoveryLog.
              </q-banner>
              <q-input
                v-if="!revealKeyPlain"
                v-model="revealKeyReason"
                label="Reason *"
                outlined dense
                type="textarea" rows="2"
                autofocus
              />
              <div v-if="revealKeyPlain" class="q-mt-md">
                <div class="text-caption text-grey">Recovery key (one-time view):</div>
                <q-input :model-value="revealKeyPlain" readonly outlined dense type="textarea" rows="2" />
                <div class="text-caption text-grey q-mt-xs">
                  Fingerprint: <code>{{ revealKeyFingerprint }}</code>
                </div>
                <div class="text-caption text-warning q-mt-sm">
                  This key is shown ONCE. Copy it now and treat it like any other secret.
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" @click="closeRevealDialog" />
              <q-btn
                v-if="!revealKeyPlain"
                color="warning"
                icon="visibility"
                label="Reveal"
                :disable="!revealKeyReason.trim()"
                :loading="revealKeyLoading"
                @click="confirmRevealRecoveryKey"
              />
              <q-btn
                v-else
                color="primary"
                icon="content_copy"
                label="Copy"
                @click="copyRevealedKey"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-tab-panel>

      <!-- Inventory Filters -->
      <q-tab-panel name="inventory">
        <div class="text-body2 q-mb-md text-grey">
          {{ $t('devicemanagement.views.DeviceManagementView.785a32') }}
        </div>
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('devicemanagement.views.DeviceManagementView.fa2579')" @click="showFilterDialog()" />
        </div>
        <q-table
          :rows="inventoryFilters"
          :columns="filterColumns"
          dense
          row-key="id"
          :loading="loadingFilters"
        >
          <template v-slot:body-cell-is_shared="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'primary' : 'grey'" text-color="white">
                {{ props.value ? 'Shared' : 'Private' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="play_arrow" size="sm" color="primary"
                @click="runSavedFilter(props.row)" :title="$t('devicemanagement.views.DeviceManagementView.7800a5')" />
              <q-btn flat dense round icon="delete" size="sm" color="negative"
                @click="deleteFilter(props.row.id)" :title="$t('devicemanagement.views.DeviceManagementView.07f977')" />
            </q-td>
          </template>
        </q-table>

        <!-- Filter results appear in the same table used by the builder -->
        <q-card v-if="filterBuilderResults.length" flat bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div class="text-subtitle2">
              Results: {{ filterBuilderResults.length }} device(s)
            </div>
            <q-btn flat dense icon="close" @click="filterBuilderResults = []" />
          </q-card-section>
          <q-table
            :rows="filterBuilderResults"
            :columns="[
              {name:'hostname', label:'Hostname', field:'hostname', align:'left'},
              {name:'plat', label:'OS', field:'plat', align:'left'},
              {name:'agent_id', label:'Agent ID', field:'agent_id', align:'left'},
              {name:'last_seen', label:'Last seen', field:'last_seen', align:'left'},
            ]"
            dense row-key="agent_id" :rows-per-page-options="[20,50,100]" />
        </q-card>
      </q-tab-panel>

      <!-- Workspace Management (#814, #817, #822-827) -->
      <q-tab-panel name="workspace">
        <q-banner v-if="workspaceApiError" rounded dense class="bg-negative text-white q-mb-md">
          {{ workspaceApiError }}
        </q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('devicemanagement.views.DeviceManagementView.61f8bb') }}</div>
            <div class="mdm-section-subtitle">{{ $t('devicemanagement.views.DeviceManagementView.954bc0') }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn flat color="primary" icon="feedback" :label="$t('devicemanagement.views.DeviceManagementView.c8d767')"
              @click="openFeedbackDialog" />
            <q-btn color="primary" icon="add" :label="$t('devicemanagement.views.DeviceManagementView.bf74fc')" @click="openCreateWorkspaceDialog" />
          </div>
        </div>

        <!-- Workspace profiles -->
        <div class="row q-gutter-md q-mb-lg">
          <q-card
            v-for="ws in workspaceProfiles"
            :key="ws.id"
            flat bordered class="col-12 col-md-3"
            :style="`border-left: 4px solid ${ws.color}`"
          >
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <q-icon :name="ws.icon" size="24px" :style="`color:${ws.color}`" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle2">{{ ws.name }}</div>
                  <div class="text-caption text-grey">{{ ws.devices_count }} devices</div>
                </div>
              </div>
              <q-list dense>
                <q-item v-for="feature in ws.features" :key="feature" dense>
                  <q-item-section avatar><q-icon name="check" color="positive" size="16px" /></q-item-section>
                  <q-item-section class="text-caption">{{ feature }}</q-item-section>
                </q-item>
              </q-list>
              <div v-if="ws.preinstalled_app_links?.length || ws.preinstalled_choco_packages?.length" class="q-mt-xs">
                <q-badge color="teal">{{ $t('devicemanagement.views.DeviceManagementView.c0769f') }}</q-badge>
                <span class="text-caption text-grey-7 q-ml-xs">
                  {{ (ws.preinstalled_app_links?.length || 0) + (ws.preinstalled_choco_packages?.length || 0) }} item(s)
                </span>
              </div>
              <div v-if="ws.disk_quota_mb" class="q-mt-xs">
                <q-badge color="purple">{{ $t('devicemanagement.views.DeviceManagementView.cfbceb') }}</q-badge>
                <span class="text-caption text-grey-7 q-ml-xs">{{ ws.disk_quota_mb }} MB</span>
              </div>
              <!-- Phase-4 DLP chips -->
              <div v-if="ws.encrypt_storage || (ws.export_behavior && ws.export_behavior !== 'free') || (ws.clipboard_behavior && ws.clipboard_behavior !== 'free')" class="q-mt-xs">
                <q-badge color="indigo">WIP analog</q-badge>
                <q-badge color="blue-grey" class="q-ml-xs">agent sync</q-badge>
              </div>
              <div v-if="ws.encrypt_storage" class="q-mt-xs">
                <q-badge color="deep-purple">at-rest encryption</q-badge>
              </div>
              <div v-if="ws.export_behavior && ws.export_behavior !== 'free'" class="q-mt-xs">
                <q-badge :color="ws.export_behavior === 'block' ? 'negative' : 'orange'">
                  Export: {{ ws.export_behavior }}
                </q-badge>
              </div>
              <div v-if="ws.clipboard_behavior && ws.clipboard_behavior !== 'free'" class="q-mt-xs">
                <q-badge :color="ws.clipboard_behavior === 'block' ? 'negative' : 'orange'">
                  Clipboard: {{ ws.clipboard_behavior }}
                </q-badge>
              </div>
              <!-- Phase-1/2/3 user-pwd policy badges -->
              <div v-if="ws.password_owner === 'user'" class="q-mt-xs">
                <q-badge color="indigo">user-managed</q-badge>
                <q-badge v-if="ws.require_tpm_binding" color="deep-purple" class="q-ml-xs">TPM</q-badge>
                <q-badge v-if="ws.require_windows_hello" color="blue" class="q-ml-xs">Hello</q-badge>
                <q-badge v-if="ws.recovery_escrow_mode === 'escrow'" color="teal" class="q-ml-xs">
                  Shamir {{ ws.escrow_shamir_threshold }}/{{ ws.escrow_shamir_total }}
                </q-badge>
                <q-badge v-else-if="ws.recovery_escrow_mode === 'zero_knowledge'" color="negative" class="q-ml-xs">
                  zero-knowledge
                </q-badge>
              </div>
              <div v-if="ws.geofence_enforcement && ws.geofence_enforcement !== 'off'" class="q-mt-xs">
                <q-badge :color="ws.geofence_enforcement === 'enforce' ? 'negative' : 'orange'">
                  geofence: {{ ws.geofence_enforcement }} ({{ (ws.geofence_polygons || []).length }})
                </q-badge>
              </div>
              <div v-if="ws.watermark_enabled || ws.snapshot_interval_hours > 0" class="q-mt-xs">
                <q-badge v-if="ws.watermark_enabled" color="brown">watermark</q-badge>
                <q-badge v-if="ws.snapshot_interval_hours > 0" color="green" class="q-ml-xs">
                  snap/{{ ws.snapshot_interval_hours }}h × {{ ws.snapshot_retention_count }}
                </q-badge>
              </div>

              <div class="row q-gutter-xs q-mt-sm">
                <q-btn dense flat color="primary" icon="edit" label="Edit" size="sm" @click="openEditWorkspace(ws)" />
                <q-btn dense flat color="primary" icon="link" :label="$t('devicemanagement.views.DeviceManagementView.1afff0')" size="sm" @click="attachWorkspace(ws)" />
                <q-btn dense flat color="primary" icon="groups" :label="$t('devicemanagement.views.DeviceManagementView.171a06')" size="sm"
                  @click="openGroupAssignDialog(ws)" />
                <q-btn dense flat color="primary" icon="shield" :label="$t('devicemanagement.views.DeviceManagementView.4fbcdf')" size="sm"
                  @click="openDlpEditDialog(ws)" />
                <q-btn dense flat color="negative" icon="link_off" :label="$t('devicemanagement.views.DeviceManagementView.3a095f')" size="sm" @click="detachWorkspace(ws)" />
                <q-btn dense flat color="negative" icon="delete" label="Delete" size="sm" @click="confirmDeleteWorkspace(ws)" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Workspace assignments table -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ $t('devicemanagement.views.DeviceManagementView.058e3e') }}</div>
            <q-table :rows="workspaceAssignments" :columns="workspaceColumns" dense row-key="id" :rows-per-page-options="[10,25]">
              <template v-slot:body-cell-workspace="props">
                <q-td :props="props">
                  <q-chip dense :color="props.row.workspace_color" text-color="white" size="sm">{{ props.value }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-state="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="assignmentStateColor(props.value)"
                    text-color="white"
                    size="sm"
                    :icon="assignmentStateIcon(props.value)"
                  >{{ props.value }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-encrypted="props">
                <q-td :props="props" class="text-center">
                  <q-icon :name="props.value ? 'lock' : 'lock_open'" :color="props.value ? 'positive' : 'grey'" />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat dense size="sm" color="warning" icon="pause_circle"
                    :disable="props.row.state !== 'active'"
                    @click="suspendAssignment(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.c8b3f7')" />
                  <q-btn
                    flat dense size="sm" color="positive" icon="play_circle"
                    :disable="props.row.state !== 'suspended'"
                    @click="resumeAssignment(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.9fa09b')" />
                  <q-btn
                    flat dense size="sm" color="info" icon="fact_check"
                    :disable="props.row.state === 'decommissioned'"
                    @click="checkCompliance(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.ba4ac0')" />
                  <q-btn
                    flat dense size="sm" color="deep-orange" icon="shield"
                    :disable="props.row.state !== 'active'"
                    @click="enforceAssignment(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.daf456')" />
                  <q-btn
                    flat dense size="sm" color="indigo" icon="campaign"
                    :disable="props.row.state === 'decommissioned'"
                    @click="notifyAssignment(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.9d5479')" />
                  <q-btn flat dense icon="swap_horiz" size="sm" color="primary" @click="changeWorkspace(props.row)" :title="$t('devicemanagement.views.DeviceManagementView.abbf4b')" />
                  <q-btn flat dense icon="key" size="sm" color="warning" @click="rotateKeys(props.row)" :title="$t('devicemanagement.views.DeviceManagementView.fa5d55')" />
                  <q-btn
                    flat dense size="sm" color="teal" icon="speed"
                    :disable="props.row.state === 'decommissioned'"
                    @click="openUsageDialog(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.d8954e')" />
                  <q-btn
                    flat dense size="sm" color="negative" icon="delete_forever"
                    :disable="props.row.state === 'decommissioned'"
                    @click="decommissionAssignment(props.row)"
                    :title="$t('devicemanagement.views.DeviceManagementView.e15ee5')" />
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-pa-md text-grey">{{ $t('devicemanagement.views.DeviceManagementView.1e2aba') }}</div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Feedback inbox (Phase-2) -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">{{ $t('devicemanagement.views.DeviceManagementView.1c1fe4') }}</div>
              <div class="row q-gutter-sm items-center">
                <q-select
                  v-model="feedbackInboxStatus"
                  :options="[
                    {label:'Open', value:'open'},
                    {label:'Triaged', value:'triaged'},
                    {label:'Resolved', value:'resolved'},
                    {label:'All', value:''},
                  ]"
                  emit-value map-options dense outlined
                  :label="$t('devicemanagement.views.DeviceManagementView.bae7d5')"
                  style="min-width: 140px"
                  @update:model-value="loadFeedbackInbox" />
                <q-btn flat dense round icon="refresh" color="primary"
                  @click="loadFeedbackInbox" :title="$t('devicemanagement.views.DeviceManagementView.7a385d')" />
              </div>
            </div>
            <q-table
              :rows="feedbackInboxRows"
              :columns="feedbackInboxColumns"
              dense row-key="id"
              :rows-per-page-options="[10,25]">
              <template v-slot:body-cell-severity="props">
                <q-td :props="props" class="text-center">
                  <q-chip dense size="sm"
                    :color="props.value === 'incident' ? 'negative' : props.value === 'bug' ? 'warning' : props.value === 'request' ? 'info' : 'grey'"
                    text-color="white">{{ props.value }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props" class="text-center">
                  <q-select
                    v-model="props.row.status"
                    :options="[
                      {label:'Open',value:'open'},
                      {label:'Triaged',value:'triaged'},
                      {label:'Resolved',value:'resolved'},
                    ]"
                    emit-value map-options dense borderless
                    @update:model-value="updateFeedbackStatus(props.row, $event)" />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn dense flat round icon="visibility" size="sm" color="primary"
                    @click="openFeedbackDetail(props.row)" />
                  <q-btn dense flat round icon="delete" size="sm" color="negative"
                    @click="deleteFeedback(props.row)" />
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-pa-md text-grey">{{ $t('devicemanagement.views.DeviceManagementView.102e7c') }}</div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Encrypted containers — real VHDX+BitLocker lifecycle, managed via REST -->
        <EncryptedContainersPanel
          :workspaces="workspaceProfiles"
          :agents="allAgents"
        />

        <!-- Portable encrypted file envelopes (Phase-C) -->
        <SecureFileTransferPanel :agents="allAgents" />

        <!-- Recovery & Key Rotation (#817) -->
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-md">{{ $t('devicemanagement.views.DeviceManagementView.6cb3c9') }}</div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-5">
                <AgentPicker
                  v-model="recoveryDeviceId"
                  :options="agentOptions"
                  :label="$t('devicemanagement.views.DeviceManagementView.a5a74a')"
                  outlined dense clearable class="q-mb-sm"
                />
                <q-select
                  v-model="recoveryAction"
                  :options="[
                    { label: 'Emergency Access (lock device)', value: 'Emergency Access' },
                    { label: 'Unlock Device', value: 'Unlock Device' },
                    { label: 'Rotate Local Admin (audit key)', value: 'Rotate Local Admin' },
                    { label: 'Selective Wipe (org data only)', value: 'Selective Wipe' },
                    { label: 'Full Wipe / Factory Reset', value: 'Factory Reset' },
                  ]"
                  emit-value map-options
                  :label="$t('devicemanagement.views.DeviceManagementView.1886eb')"
                  outlined dense class="q-mb-sm"
                  :hint="$t('devicemanagement.views.DeviceManagementView.428f57')" />
                <q-input v-model="recoveryReason" :label="$t('devicemanagement.views.DeviceManagementView.5116c3')" outlined dense type="textarea" rows="2" class="q-mb-sm" />
                <q-btn color="warning" :label="$t('devicemanagement.views.DeviceManagementView.c06eff')" icon="restore" @click="executeRecovery" />
              </div>
              <div class="col-12 col-md-5">
                <div class="text-caption text-grey q-mb-sm">{{ $t('devicemanagement.views.DeviceManagementView.57f3c5') }}</div>
                <q-list bordered separator dense>
                  <q-item v-for="log in recoveryLog" :key="log.id" dense>
                    <q-item-section>
                      <q-item-label>{{ log.action }}</q-item-label>
                      <q-item-label caption>{{ log.device }} · {{ log.timestamp }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip dense :color="recoveryStatusColor(log.status)" text-color="white" size="sm">{{ log.status }}</q-chip>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Compliance probe dialog -->
    <q-dialog v-model="complianceDialogOpen">
      <q-card style="min-width:480px;max-width:640px">
        <q-bar>
          <q-icon name="fact_check" class="q-mr-sm" />
          {{ $t('devicemanagement.views.DeviceManagementView.2060f3') }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <div v-if="complianceLoading" class="text-center q-pa-md">
            <q-spinner size="32px" color="primary" />
            <div class="q-mt-sm text-caption text-grey">{{ $t('devicemanagement.views.DeviceManagementView.c9edbb') }}</div>
          </div>
          <div v-else-if="complianceResult && complianceResult.error" class="text-negative">
            {{ complianceResult.error }}
          </div>
          <div v-else-if="complianceResult">
            <div class="q-mb-md">
              <div><strong>{{ $t('devicemanagement.views.DeviceManagementView.92b51a') }}</strong> {{ complianceResult.workspace }}</div>
              <div><strong>{{ $t('devicemanagement.views.DeviceManagementView.153f11') }}</strong> {{ complianceResult.agent_id }}</div>
              <div><strong>{{ $t('devicemanagement.views.DeviceManagementView.97d826') }}</strong>
                <q-chip dense size="sm" :color="assignmentStateColor(complianceResult.state)" text-color="white">
                  {{ complianceResult.state }}
                </q-chip>
              </div>
              <div class="text-caption text-grey">Probed at {{ complianceResult.probed_at || "—" }}</div>
            </div>
            <q-list bordered separator>
              <q-item v-for="(f, key) in complianceResult.findings" :key="key">
                <q-item-section>
                  <q-item-label>{{ key.replace(/_/g, " ") }}</q-item-label>
                  <q-item-label caption>
                    expected = {{ f.expected }} · observed = {{ f.observed }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    dense size="sm"
                    :color="f.compliant ? 'positive' : 'negative'"
                    text-color="white"
                  >{{ f.compliant ? "compliant" : "violation" }}</q-chip>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="q-mt-md row items-center q-gutter-sm">
              <q-chip
                dense
                :color="complianceResult.overall_compliant ? 'positive' : 'negative'"
                text-color="white"
                :icon="complianceResult.overall_compliant ? 'verified' : 'report'"
              >
                Overall: {{ complianceResult.overall_compliant ? "compliant" : "non-compliant" }}
              </q-chip>
              <q-chip dense color="grey-7" text-color="white" icon="update"
                      v-if="complianceResult.last_enforced_at">
                Last enforced {{ fmtRelativeTime(complianceResult.last_enforced_at) }}
              </q-chip>
            </div>

            <!-- Declarative quota from workspace profile -->
            <div v-if="complianceResult.quota && complianceResult.quota.has_quota" class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">{{ $t('devicemanagement.views.DeviceManagementView.d2a5be') }}</div>
              <div class="row q-gutter-sm">
                <q-chip v-if="complianceResult.quota.max_cpu_percent > 0"
                        dense color="deep-orange" text-color="white" icon="speed">
                  CPU cap: {{ complianceResult.quota.max_cpu_percent }}%
                </q-chip>
                <q-chip v-if="complianceResult.quota.max_memory_mb > 0"
                        dense color="deep-orange" text-color="white" icon="storage">
                  Memory cap: {{ complianceResult.quota.max_memory_mb }} MB
                </q-chip>
              </div>
            </div>

            <!-- B8-lite: endpoint resource usage snapshot -->
            <div v-if="complianceResult.resources && !complianceResult.resources.error" class="q-mt-lg">
              <div class="text-subtitle2 q-mb-sm">{{ $t('devicemanagement.views.DeviceManagementView.2932f2') }}</div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-chip dense color="primary" text-color="white" icon="memory">
                  CPU: {{ complianceResult.resources.cpu_percent }}%
                </q-chip>
                <q-chip dense color="primary" text-color="white" icon="storage">
                  RAM: {{ complianceResult.resources.memory?.used_mb }}&nbsp;/&nbsp;{{ complianceResult.resources.memory?.total_mb }} MB
                  ({{ complianceResult.resources.memory?.used_percent }}%)
                </q-chip>
              </div>
              <div class="text-caption text-grey q-mb-xs">{{ $t('devicemanagement.views.DeviceManagementView.d8cced') }}</div>
              <q-list bordered dense>
                <q-item v-for="p in complianceResult.resources.top_processes || []" :key="p.pid" dense>
                  <q-item-section>
                    <q-item-label>{{ p.name }}</q-item-label>
                    <q-item-label caption>PID {{ p.pid }} · CPU {{ p.cpu_s }}s</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip dense size="sm" color="grey-4" text-color="black">{{ p.ws_mb }} MB</q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div v-else-if="complianceResult.resources?.error" class="text-caption text-negative q-mt-md">
              Resource probe failed: {{ complianceResult.resources.error }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.bbfa77')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Remote Action Dialog -->
    <q-dialog v-model="actionDialogOpen" persistent>
      <q-card style="min-width:440px">
        <q-bar>
          <q-icon :name="actionTypeIcon(currentActionType)" class="q-mr-sm" />
          {{ actionTypeLabel(currentActionType) }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <AgentPicker
            v-model="actionForm.agent_id"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.9a36d7')"
            outlined dense clearable
          />
          <q-input v-model="actionForm.reason" :label="$t('devicemanagement.views.DeviceManagementView.f219cc')" outlined dense type="textarea" rows="2" />
          <div v-if="currentActionType === 'wipe_full'" class="text-negative text-weight-bold">
            {{ $t('devicemanagement.views.DeviceManagementView.892525') }}
          </div>
          <q-input
            v-if="currentActionType === 'wipe_selective'"
            v-model="actionForm.extra_paths"
            label="Corporate data paths"
            outlined dense type="textarea" rows="4"
            placeholder="D:\\CompanyVault&#10;C:\\Users\\%USERNAME%\\Company"
          />
          <div v-if="currentActionType === 'factory_reset'" class="text-negative text-weight-bold">
            {{ $t('devicemanagement.views.DeviceManagementView.b410c2') }}
          </div>
          <div v-if="currentActionType === 'geolockmode'" class="text-warning text-weight-bold">
            Device will be locked and asked to report geolocation for lost-mode tracking.
          </div>
          <template v-if="currentActionType === 'geolockmode'">
            <q-input v-model="actionForm.lost_message" label="Lost mode message" outlined dense type="textarea" rows="3" />
            <q-input v-model="actionForm.lost_contact" label="Return contact" outlined dense />
          </template>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn
            :color="actionSubmitColor(currentActionType)"
            :label="actionTypeLabel(currentActionType)"
            @click="submitAction"
            :loading="submittingAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Encryption Policy Dialog -->
    <q-dialog v-model="encryptionDialogOpen" persistent>
      <q-card style="min-width:460px">
        <q-bar>{{ editingEncryption ? 'Edit' : 'New' }} Encryption Policy<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="encryptionForm.name" :label="$t('devicemanagement.views.DeviceManagementView.d145bb')" outlined dense />
          <q-select v-model="encryptionForm.encryption_type"
            :options="[{label:'BitLocker',value:'bitlocker'},{label:'Custom Algorithm',value:'custom'},{label:'VeraCrypt',value:'veracrypt'}]"
            :label="$t('devicemanagement.views.DeviceManagementView.5af44e')" outlined dense emit-value map-options />
          <q-input v-model="encryptionForm.algorithm" :label="$t('devicemanagement.views.DeviceManagementView.b4715d')" outlined dense />
          <q-toggle v-model="encryptionForm.encrypt_system_drive" :label="$t('devicemanagement.views.DeviceManagementView.0f36e2')" />
          <q-toggle v-model="encryptionForm.encrypt_removable" :label="$t('devicemanagement.views.DeviceManagementView.b365d1')" />
          <q-toggle v-model="encryptionForm.escrow_keys" :label="$t('devicemanagement.views.DeviceManagementView.8d9548')" />
          <q-toggle v-model="encryptionForm.enabled" :label="$t('devicemanagement.views.DeviceManagementView.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingEncryption ? 'Save' : 'Create'" @click="saveEncryption" :loading="savingEncryption" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Deploy Encryption Dialog -->
    <q-dialog v-model="deployEncryptionOpen" persistent>
      <q-card style="min-width:440px">
        <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.639243') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-body2">{{ $t('devicemanagement.views.DeviceManagementView.d5a701') }} <strong>{{ deployEncryptionPolicy?.name }}</strong></div>
          <AgentPicker
            v-model="deployEncryptionAgents"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.a5ecfd')"
            multiple
            outlined dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.fb4192')" icon="send"
            @click="confirmDeployEncryption" :disable="!deployEncryptionAgents.length" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Attach Workspace Dialog -->
    <q-dialog v-model="attachWorkspaceOpen" persistent>
      <q-card style="min-width:420px">
        <q-bar>Attach {{ attachWorkspaceTarget?.name }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-md">
          <AgentPicker
            v-model="attachWorkspaceAgent"
            :options="agentOptions"
            :label="$t('devicemanagement.views.DeviceManagementView.e49c96')"
            outlined dense clearable
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.1afff0')" @click="confirmAttachWorkspace"
            :disable="!attachWorkspaceAgent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Inventory Filter Builder Dialog -->
    <q-dialog v-model="showFilterBuilder" persistent maximized>
      <q-card>
        <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.1dfcf0') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-sm">
          <div class="row q-gutter-sm q-mb-md">
            <q-input v-model="filterBuilderName" :label="$t('devicemanagement.views.DeviceManagementView.3391fa')" outlined dense style="min-width:200px" />
            <q-toggle v-model="filterBuilderShared" :label="$t('devicemanagement.views.DeviceManagementView.50d0d8')" />
            <q-input v-model="filterBuilderSchedule" :label="$t('devicemanagement.views.DeviceManagementView.dc5dc8')" outlined dense
              placeholder="0 * * * *" style="min-width:160px" />
          </div>
          <!-- Condition Groups -->
          <div v-for="(group, gi) in filterBuilderGroups" :key="gi" class="q-mb-md bordered q-pa-sm">
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-select v-model="group.op" :options="['AND','OR']" dense outlined style="width:80px" />
              <q-btn flat dense icon="remove_circle" color="negative" @click="removeFilterGroup(gi)"
                :disable="filterBuilderGroups.length === 1" />
              <span class="text-caption text-grey">Group {{ gi + 1 }}</span>
            </div>
            <div v-for="(cond, ci) in group.conditions" :key="ci" class="row q-gutter-xs q-mb-xs items-center">
              <q-select v-model="cond.field" :options="filterFieldOptions" emit-value map-options
                :label="$t('devicemanagement.views.DeviceManagementView.c326a4')" outlined dense style="min-width:160px" />
              <q-select v-model="cond.operator" :options="filterOperatorOptions" emit-value map-options
                :label="$t('devicemanagement.views.DeviceManagementView.d0e687')" outlined dense style="min-width:150px" />
              <q-input v-model="cond.value" :label="$t('devicemanagement.views.DeviceManagementView.8dce17')" outlined dense style="min-width:160px" />
              <q-btn flat dense icon="remove" color="negative" @click="removeCondition(group, ci)"
                :disable="group.conditions.length === 1" />
            </div>
            <q-btn flat dense icon="add" :label="$t('devicemanagement.views.DeviceManagementView.42fe69')" size="sm" @click="addCondition(group)" />
          </div>
          <q-btn flat icon="add_box" :label="$t('devicemanagement.views.DeviceManagementView.3a0619')" @click="addFilterGroup" />
        </q-card-section>
        <!-- Results preview -->
        <q-card-section v-if="filterBuilderResults.length">
          <div class="text-subtitle2">{{ filterBuilderResults.length }} matching device(s)</div>
          <q-list dense>
            <q-item v-for="d in filterBuilderResults.slice(0, 10)" :key="d.agent_id || d.id" dense>
              <q-item-section>{{ d.hostname }}</q-item-section>
              <q-item-section side>{{ d.agent_id }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn outline color="primary" :label="$t('devicemanagement.views.DeviceManagementView.ef8b3e')" icon="play_arrow"
            @click="runFilterBuilder" :loading="filterBuilderLoading" />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.243843')" icon="save"
            @click="saveFilterBuilder" :disable="!filterBuilderName" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Workspace Dialog -->
    <q-dialog v-model="showCreateWorkspace" persistent>
      <q-card style="min-width:560px;max-width:760px;max-height:90vh;overflow:auto">
        <q-bar>
          <span>{{ editingWorkspaceId ? `Edit Workspace #${editingWorkspaceId}` : $t('devicemanagement.views.DeviceManagementView.bf74fc') }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="newWorkspaceForm.name" :label="$t('devicemanagement.views.DeviceManagementView.d145bb')" outlined dense />
          <q-select v-model="newWorkspaceForm.type"
            :options="[{label:'Organization',value:'organization'},{label:'Personal',value:'personal'},{label:'Guest',value:'guest'}]"
            :label="$t('devicemanagement.views.DeviceManagementView.3deb74')" outlined dense emit-value map-options />
          <q-toggle v-model="newWorkspaceForm.encrypt_storage" :label="$t('devicemanagement.views.DeviceManagementView.a8e176')" />
          <q-toggle v-model="newWorkspaceForm.vpn_required" :label="$t('devicemanagement.views.DeviceManagementView.d9837c')" />
          <q-toggle v-model="newWorkspaceForm.screen_capture_disabled" :label="$t('devicemanagement.views.DeviceManagementView.f22cf3')" />
          <q-toggle v-model="newWorkspaceForm.network_isolation" :label="$t('devicemanagement.views.DeviceManagementView.f13f27')" />
          <q-input
            v-model.number="newWorkspaceForm.session_time_limit_hours"
            :label="$t('devicemanagement.views.DeviceManagementView.23dced')"
            type="number" min="0" max="168" outlined dense />
          <div class="text-caption text-grey-7 q-mt-sm">{{ $t('devicemanagement.views.DeviceManagementView.534291') }}</div>
          <q-input
            v-model.number="newWorkspaceForm.max_cpu_percent"
            :label="$t('devicemanagement.views.DeviceManagementView.7de129')"
            type="number" min="0" max="99" outlined dense />
          <q-input
            v-model.number="newWorkspaceForm.max_memory_mb"
            :label="$t('devicemanagement.views.DeviceManagementView.9af95e')"
            type="number" min="0" outlined dense />
          <div class="text-caption text-grey-7 q-mt-sm">{{ $t('devicemanagement.views.DeviceManagementView.d8c622') }}</div>
          <q-input
            v-model="newWorkspaceForm._sso_claim"
            label="OIDC claim name (e.g. 'groups', 'email_domain')"
            outlined dense />
          <q-input
            v-model="newWorkspaceForm._sso_match"
            :label="$t('devicemanagement.views.DeviceManagementView.8c9a68')"
            outlined dense
            :hint="$t('devicemanagement.views.DeviceManagementView.bc3a22')" />

          <div class="text-caption text-grey-7 q-mt-sm">{{ $t('devicemanagement.views.DeviceManagementView.603294') }}</div>
          <q-select
            v-model="newWorkspaceForm.preinstalled_app_links"
            :options="workspaceAppStoreLinks"
            option-label="name" option-value="id"
            emit-value map-options multiple use-chips outlined dense
            :label="$t('devicemanagement.views.DeviceManagementView.a1a37f')" />
          <q-input
            v-model="newWorkspaceForm._choco_packages_raw"
            :label="$t('devicemanagement.views.DeviceManagementView.cd4259')"
            outlined dense
            :hint="$t('devicemanagement.views.DeviceManagementView.759683')" />
          <q-input
            v-model.number="newWorkspaceForm.disk_quota_mb"
            :label="$t('devicemanagement.views.DeviceManagementView.d69e9f')"
            type="number" min="0" outlined dense />

          <div class="text-caption text-grey-7 q-mt-md">{{ $t('devicemanagement.views.DeviceManagementView.2bd655') }}</div>
          <q-select
            v-model="newWorkspaceForm.export_behavior"
            :options="[
              { label: 'Free — no restriction on outbound copy', value: 'free' },
              { label: 'Wrap — copy to Desktop / Downloads replaced with .lsc envelope', value: 'wrap' },
              { label: 'Block — outbound copy of vault files is deleted', value: 'block' },
            ]"
            emit-value map-options outlined dense
            :label="$t('devicemanagement.views.DeviceManagementView.f1f66f')"
            :hint="$t('devicemanagement.views.DeviceManagementView.de7491')" />
          <q-select
            v-model="newWorkspaceForm.clipboard_behavior"
            :options="[
              { label: 'Free — clipboard unrestricted', value: 'free' },
              { label: 'Wrap — seal text copied from vault readers', value: 'wrap' },
              { label: 'Block — empty the clipboard when source is tainted', value: 'block' },
            ]"
            emit-value map-options outlined dense
            :label="$t('devicemanagement.views.DeviceManagementView.34f0f2')"
            hint="A process is tainted after it reads any file from the mounted G:\\ — tracked by SC.exe's Dokan layer." />
          <q-input
            v-model="newWorkspaceForm._extra_paths_raw"
            :label="$t('devicemanagement.views.DeviceManagementView.df4021')"
            outlined dense
            hint="On top of Desktop / Documents / Downloads / Pictures / TEMP. E.g. D:\\Shared,C:\\Temp\\work" />

          <q-expansion-item
            class="q-mt-md"
            icon="vpn_key"
            label="User-managed password / Shamir / TPM / geofence / watermark / snapshot"
            caption="Phase-1/2/3 industrial container policy">
            <WorkspaceUserPwdPolicyEditor
              v-model="newWorkspaceForm"
              :active-officer-count="activeOfficerCount ?? undefined"
              :workspace-id="editingWorkspaceId"
              @officers-changed="activeOfficerCount = $event" />
          </q-expansion-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn
            color="primary"
            :label="editingWorkspaceId ? 'Save' : $t('devicemanagement.views.DeviceManagementView.6e157c')"
            @click="submitWorkspace"
            :disable="!newWorkspaceForm.name" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Workspace Feedback Dialog (Phase-2) -->
    <q-dialog v-model="feedbackDialogOpen" persistent>
      <q-card style="min-width:420px">
        <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.e2a481') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-sm">
          <q-select v-model="feedbackForm.workspace"
            :options="workspaceProfiles.map((w: any) => ({ label: w.name, value: w.id }))"
            emit-value map-options :label="$t('devicemanagement.views.DeviceManagementView.4ca0a7')" outlined dense />
          <q-select v-model="feedbackForm.severity"
            :options="[
              {label:'Info',value:'info'},
              {label:'Bug',value:'bug'},
              {label:'Feature request',value:'request'},
              {label:'Incident',value:'incident'},
            ]"
            emit-value map-options :label="$t('devicemanagement.views.DeviceManagementView.de314f')" outlined dense />
          <q-input v-model="feedbackForm.subject" :label="$t('devicemanagement.views.DeviceManagementView.e7c6a0')" outlined dense />
          <q-input v-model="feedbackForm.body" :label="$t('devicemanagement.views.DeviceManagementView.dc3dec')" type="textarea" rows="4" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.2dacf6')" :disable="!feedbackForm.subject"
            @click="submitFeedback" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Workspace Usage Dialog (Phase-2) -->
    <q-dialog v-model="usageDialogOpen">
      <q-card style="min-width: 520px; max-width: 720px">
        <q-bar>
          {{ $t('devicemanagement.views.DeviceManagementView.d8954e') }}
          <q-space />
          <q-btn dense flat icon="refresh" @click="reloadUsage" :loading="usageLoading" />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="usageRow">
          <div class="text-caption text-grey-7 q-mb-sm">
            Workspace #{{ usageRow.workspace_id }} → agent
            <code class="text-caption">{{ usageRow.agent_id }}</code> · state
            <q-badge :color="usageRow.state === 'active' ? 'positive' : 'grey'">{{ usageRow.state }}</q-badge>
            <span v-if="usageRow.cached" class="q-ml-sm text-caption text-grey">{{ $t('devicemanagement.views.DeviceManagementView.67dddc') }}</span>
          </div>
          <div v-if="usageRow.probe?.error" class="text-negative">
            Probe failed: {{ usageRow.probe.error }}
          </div>
          <div v-else>
            <div class="row q-gutter-md q-mb-md">
              <q-card flat bordered class="col">
                <q-card-section>
                  <div class="text-caption text-grey-7">{{ $t('devicemanagement.views.DeviceManagementView.01bd81') }}</div>
                  <div class="text-h5">{{ formatCpu(usageRow.probe?.cpu_percent) }}</div>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col">
                <q-card-section>
                  <div class="text-caption text-grey-7">{{ $t('devicemanagement.views.DeviceManagementView.953779') }}</div>
                  <div class="text-h5">
                    {{ usageRow.probe?.memory?.used_mb ?? "—" }} MB
                    <span v-if="usageRow.probe?.memory?.total_mb" class="text-caption text-grey-7">
                      / {{ usageRow.probe.memory.total_mb }} MB
                      ({{ usageRow.probe.memory.used_percent }}%)
                    </span>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="text-subtitle2 q-mb-xs">{{ $t('devicemanagement.views.DeviceManagementView.d900e5') }}</div>
            <q-table
              dense flat
              :rows="usageRow.probe?.top_processes || []"
              :columns="[
                {name:'name', label:'Name', field:'name', align:'left'},
                {name:'pid', label:'PID', field:'pid', align:'right'},
                {name:'cpu', label:'CPU (s)', field:'cpu_s', align:'right'},
                {name:'mem', label:'Mem (MB)', field:'ws_mb', align:'right'},
              ]"
              :rows-per-page-options="[0]" />
            <div class="text-caption text-grey-7 q-mt-sm">
              Last enforced: {{ fmtRelativeTime(usageRow.last_enforced_at) }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Feedback detail dialog (Phase-2) -->
    <q-dialog v-model="feedbackDetailOpen">
      <q-card style="min-width: 420px; max-width: 600px">
        <q-bar>
          Feedback #{{ feedbackDetailRow?.id }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="feedbackDetailRow" class="q-gutter-sm">
          <div class="row q-gutter-xs items-center">
            <q-chip dense size="sm"
              :color="feedbackDetailRow.severity === 'incident' ? 'negative' : feedbackDetailRow.severity === 'bug' ? 'warning' : 'grey'"
              text-color="white">{{ feedbackDetailRow.severity }}</q-chip>
            <q-badge :color="feedbackDetailRow.status === 'resolved' ? 'positive' : feedbackDetailRow.status === 'triaged' ? 'warning' : 'grey'">
              {{ feedbackDetailRow.status }}
            </q-badge>
            <span class="text-caption text-grey-7 q-ml-sm">
              {{ feedbackDetailRow.submitted_username || "—" }}
              · {{ fmtRelativeTime(feedbackDetailRow.created_at) }}
            </span>
          </div>
          <div class="text-subtitle1">{{ feedbackDetailRow.subject }}</div>
          <div class="text-body2" style="white-space: pre-wrap">{{ feedbackDetailRow.body || "(no body)" }}</div>
          <q-input
            v-model="feedbackDetailRow.admin_notes"
            :label="$t('devicemanagement.views.DeviceManagementView.dff73a')" type="textarea" rows="3" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.bbfa77')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.efc007')"
            @click="saveFeedbackNotes(feedbackDetailRow)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Phase-4: Edit DLP policy on an existing Workspace -->
    <q-dialog v-model="dlpEditOpen" persistent>
      <q-card style="min-width:460px">
        <q-bar>
          <q-icon name="shield" class="q-mr-sm" />
          DLP policy — {{ dlpEditWs?.name }}
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-caption text-grey-7">
            Enforced by the Windows agent WIP syncer and LaboratoGuard in the end-user desktop session.
            Changes apply on the next agent poll or manual <em>{{ $t('devicemanagement.views.DeviceManagementView.ab1e82') }}</em>.
          </div>
          <q-select
            v-model="dlpEditForm.export_behavior"
            :options="[
              { label: 'Free — no restriction on outbound copy', value: 'free' },
              { label: 'Wrap — copy to Desktop / Downloads replaced with .lsc envelope', value: 'wrap' },
              { label: 'Block — outbound copy of vault files is deleted', value: 'block' },
            ]"
            emit-value map-options outlined dense
            :label="$t('devicemanagement.views.DeviceManagementView.f1f66f')" />
          <q-select
            v-model="dlpEditForm.clipboard_behavior"
            :options="[
              { label: 'Free — clipboard unrestricted', value: 'free' },
              { label: 'Wrap — seal text copied from vault readers', value: 'wrap' },
              { label: 'Block — empty the clipboard when source is tainted', value: 'block' },
            ]"
            emit-value map-options outlined dense
            :label="$t('devicemanagement.views.DeviceManagementView.34f0f2')" />
          <q-input
            v-model="dlpEditForm.guard_extra_watch_paths_raw"
            :label="$t('devicemanagement.views.DeviceManagementView.be9453')"
            outlined dense
            :hint="$t('devicemanagement.views.DeviceManagementView.f7baad')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.efc007')" @click="submitDlpEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Workspace Group-assign Dialog (Phase-2) -->
    <q-dialog v-model="groupAssignDialogOpen" persistent>
      <q-card style="min-width:380px">
        <q-bar>{{ $t('devicemanagement.views.DeviceManagementView.024cff') }}<q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section class="q-gutter-sm">
          <div class="text-caption">{{ $t('devicemanagement.views.DeviceManagementView.92b51a') }} <b>{{ groupAssignTargetName }}</b></div>
          <q-select
            v-model="groupAssignSelectedId"
            :options="groupAssignOptions"
            option-label="name" option-value="id"
            emit-value map-options
            :label="$t('devicemanagement.views.DeviceManagementView.9c7b54')"
            outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('devicemanagement.views.DeviceManagementView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('devicemanagement.views.DeviceManagementView.244492')" :disable="!groupAssignSelectedId"
            @click="confirmGroupAssign" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import DeviceMap from "@/devicemanagement/components/DeviceMap.vue";
import EncryptedContainersPanel from "@/devicemanagement/components/EncryptedContainersPanel.vue";
import SecureFileTransferPanel from "@/devicemanagement/components/SecureFileTransferPanel.vue";
import AgentPicker from "@/devicemanagement/components/AgentPicker.vue";
import WorkspaceUserPwdPolicyEditor from "@/devicemanagement/components/WorkspaceUserPwdPolicyEditor.vue";
import { buildAgentOptions, type AgentOptionRich } from "@/devicemanagement/components/agentOptionHelpers";

const $q = useQuasar();
const tab = ref("workspace");

// ── Agent options for all dropdowns ──────────────────────────────────────
// Rich options carry hostname, shortId ("PZVpu…hhx"), online dot, and a
// "last_user · last_seen" caption so two agents with the same hostname can
// be told apart at a glance. See agentOptionHelpers.ts.
const agentOptions = ref<AgentOptionRich[]>([]);
// Raw agent list for child components that need full objects (hostname, os, …)
const allAgents = ref<any[]>([]);

async function loadAgentOptions() {
  try {
    const r = await axios.get("/agents/", { params: { detail: "false" } });
    const list = Array.isArray(r.data) ? r.data : (r.data?.agents ?? []);
    allAgents.value = list;
    agentOptions.value = buildAgentOptions(list);
  } catch (e: any) {
    agentOptions.value = [];
    allAgents.value = [];
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load agent list",
      color: "negative",
    });
  }
}

// Geolocation view mode: 'map' or 'table'
const geoView = ref<"map" | "table">("map");

// Bulk actions
const selectedAgentIds = ref<string[]>([]);
const bulkAgentInput = ref("");

function addBulkAgents() {
  const ids = bulkAgentInput.value.split(",").map((s) => s.trim()).filter(Boolean);
  const existing = new Set(selectedAgentIds.value);
  ids.forEach((id) => existing.add(id));
  selectedAgentIds.value = Array.from(existing);
  bulkAgentInput.value = "";
}

async function bulkAction(actionType: string) {
  if (selectedAgentIds.value.length === 0) return;

  const confirm = await new Promise<boolean>((resolve) => {
    $q.dialog({
      title: `Bulk ${actionType.replace("_", " ")}`,
      message: `Apply "${actionType}" to ${selectedAgentIds.value.length} agent(s)?`,
      cancel: true,
      ok: {
        label: "Confirm",
        color: ["wipe_full", "wipe_selective", "factory_reset"].includes(actionType)
          ? "negative"
          : "primary",
      },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });

  if (!confirm) return;

  try {
    const resp = await axios.post("/devicemanagement/actions/bulk/", {
      agent_ids: selectedAgentIds.value,
      action_type: actionType,
      reason: "Bulk action from admin UI",
    });
    $q.notify({
      message: `Bulk ${actionType} dispatched to ${resp.data.created} agent(s)`,
      color: "positive",
      icon: "bolt",
    });
    if (resp.data.errors?.length > 0) {
      $q.notify({
        message: `Could not reach ${resp.data.errors.length} agent(s): ${resp.data.errors.join(", ")}`,
        color: "warning",
      });
    }
    selectedAgentIds.value = [];
    await loadActions();
  } catch (e: any) {
    $q.notify({ message: "Bulk action failed", color: "negative" });
  }
}

const actions = ref<any[]>([]);
const locations = ref<any[]>([]);
const encryptionPolicies = ref<any[]>([]);
const recoveryKeys = ref<any[]>([]);
const inventoryFilters = ref<any[]>([]);

const loadingActions = ref(false);
const loadingLocations = ref(false);
const loadingEncryption = ref(false);
const loadingFilters = ref(false);

const actionFilter = ref({ status: null, action_type: null, agent_id: "" });
const geoAgentId = ref("");
const recoveryAgentId = ref("");
const bitlockerAgentId = ref("");
const bitlockerDrive = ref("all");
const bitlockerStatus = ref<any>(null);
const bitlockerVolumes = ref<any[]>([]);
const bitlockerLoading = ref(false);
const bitlockerEscrowLoading = ref(false);
const bitlockerRotateLoading = ref(false);

const actionDialogOpen = ref(false);
const encryptionDialogOpen = ref(false);
const currentActionType = ref("lock");
const submittingAction = ref(false);
const savingEncryption = ref(false);
const editingEncryption = ref<any>(null);

const actionForm = ref({ agent_id: "", reason: "", extra_paths: "" });
const encryptionForm = ref<any>({ name: "", encryption_type: "bitlocker", algorithm: "AES-256", encrypt_system_drive: true, encrypt_removable: false, escrow_keys: true, enabled: true });

const actionTypeOptions = [
  { label: "Lock", value: "lock" }, { label: "Unlock", value: "unlock" },
  { label: "Full Wipe", value: "wipe_full" }, { label: "Selective Wipe", value: "wipe_selective" },
  { label: "Reset Password", value: "reset_password" }, { label: "Block Access", value: "block_access" },
  { label: "Allow Access", value: "allow_access" }, { label: "Remove Agent", value: "remove_agent" },
  { label: "Factory Reset", value: "factory_reset" },
  { label: "Lost Mode + Geolocation", value: "geolockmode" },
];
const statusOptions = [
  { label: "Pending", value: "pending" }, { label: "Sent", value: "sent" },
  { label: "Completed", value: "completed" }, { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const actionColumns = [
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left", sortable: true },
  { name: "action_type", label: "Action", field: "action_type", align: "left" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "initiated_by_username", label: "Initiated By", field: "initiated_by_username", align: "left" },
  { name: "created_at", label: "Created", field: "created_at", align: "left", sortable: true },
  { name: "executed_at", label: "Executed", field: "executed_at", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const locationColumns = [
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left" as const, sortable: true },
  { name: "latitude", label: "Latitude", field: "latitude", align: "right" as const },
  { name: "longitude", label: "Longitude", field: "longitude", align: "right" as const },
  { name: "accuracy", label: "Accuracy (m)", field: "accuracy", align: "right" as const },
  { name: "source", label: "Source", field: "source", align: "center" as const },
  { name: "recorded_at", label: "Recorded", field: "recorded_at", align: "left" as const, sortable: true },
  { name: "map_link", label: "", field: "map_link", align: "center" as const },
];
const encryptionColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "encryption_type", label: "Type", field: "encryption_type", align: "center" },
  { name: "algorithm", label: "Algorithm", field: "algorithm", align: "center" },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const recoveryColumns = [
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left" },
  { name: "key_type", label: "Key Type", field: "key_type", align: "left" },
  { name: "volume_id", label: "Volume", field: "volume_id", align: "left" },
  { name: "created_at", label: "Created", field: "created_at", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const bitlockerColumns = [
  { name: "mount_point", label: "Drive", field: "mount_point", align: "left" as const },
  { name: "protection_status", label: "Protection", field: "protection_status", align: "center" as const },
  { name: "volume_status", label: "Volume status", field: "volume_status", align: "left" as const },
  { name: "encryption_method", label: "Method", field: "encryption_method", align: "left" as const },
  { name: "encryption_percentage", label: "%", field: "encryption_percentage", align: "right" as const },
  { name: "volume_type", label: "Type", field: "volume_type", align: "left" as const },
  { name: "key_protector_count", label: "Protectors", field: "key_protector_count", align: "right" as const },
  { name: "has_recovery_password", label: "Recovery", field: "has_recovery_password", align: "center" as const },
];
const filterColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "is_shared", label: "Visibility", field: "is_shared", align: "center" },
  { name: "created_by_username", label: "Created By", field: "created_by_username", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

function actionStatusColor(status: string) {
  return { pending: "warning", sent: "info", executing: "primary", completed: "positive", failed: "negative", cancelled: "grey" }[status] ?? "grey";
}
function actionTypeLabel(type: string) {
  return actionTypeOptions.find(o => o.value === type)?.label ?? type;
}
function actionTypeIcon(type: string) {
  return { lock: "lock", unlock: "lock_open", wipe_full: "delete_forever", wipe_selective: "delete", reset_password: "password", block_access: "block", allow_access: "check_circle", remove_agent: "remove_circle", factory_reset: "restart_alt", geolockmode: "travel_explore" }[type] ?? "settings_remote";
}
function actionSubmitColor(type: string) {
  if (["wipe_full", "factory_reset"].includes(type)) return "negative";
  if (type === "geolockmode") return "warning";
  return "primary";
}
// Colour mapping for the "Recent Recovery Actions" chip. Backend audit log
// emits lowercase statuses ("success", "failed") for container ops; the older
// remote-recovery endpoint used capitalised ones ("Success", "Failed"); and a
// handful of transient states ("pending", "running", "warning") may appear.
// Normalise case before lookup so every variant maps consistently.
function recoveryStatusColor(status: string | null | undefined): string {
  const s = (status || "").toLowerCase();
  if (s === "success" || s === "ok" || s === "completed" || s === "done") return "positive";
  if (s === "failed" || s === "failure" || s === "error" || s === "denied") return "negative";
  if (s === "warning" || s === "partial") return "warning";
  if (s === "pending" || s === "running" || s === "in_progress" || s === "queued") return "info";
  if (s === "cancelled" || s === "canceled" || s === "skipped") return "grey";
  return "grey";
}

// ── Auto-refresh toggles ────────────────────────────────────────────────
const actionsAutoRefresh = ref(false);
let actionsTimer: ReturnType<typeof setInterval> | null = null;
function toggleActionsAutoRefresh() {
  if (actionsTimer) { clearInterval(actionsTimer); actionsTimer = null; }
  if (actionsAutoRefresh.value) {
    actionsTimer = setInterval(() => loadActions(), 10000);
  }
}

const geoAutoRefresh = ref(false);
const geoRefreshSeconds = ref<number>(30);
let geoTimer: ReturnType<typeof setInterval> | null = null;
function toggleGeoAutoRefresh() {
  if (geoTimer) { clearInterval(geoTimer); geoTimer = null; }
  if (geoAutoRefresh.value) {
    const ms = Math.max(5, Number(geoRefreshSeconds.value) || 30) * 1000;
    geoTimer = setInterval(() => {
      if (geoAgentId.value) loadLocations();
      else loadLatestLocations();
    }, ms);
  }
}

// Clean up timers when the component unmounts or the user switches tab.
onUnmounted(() => {
  if (actionsTimer) clearInterval(actionsTimer);
  if (geoTimer) clearInterval(geoTimer);
});

watch(tab, (next) => {
  // Pause auto-refresh on inactive tabs so we don't spam the API.
  if (next !== "actions" && actionsTimer) {
    clearInterval(actionsTimer); actionsTimer = null;
  } else if (next === "actions" && actionsAutoRefresh.value && !actionsTimer) {
    toggleActionsAutoRefresh();
  }
  if (next !== "geolocation" && geoTimer) {
    clearInterval(geoTimer); geoTimer = null;
  } else if (next === "geolocation" && geoAutoRefresh.value && !geoTimer) {
    toggleGeoAutoRefresh();
  }
});

// ── Phase-4: MKV256 tooling (container spec #6/#7/#8) ───────────────────
const mkvProbeLoading = ref(false);
const mkvProbeResult = ref<any>(null);
async function runMkvProbe() {
  mkvProbeLoading.value = true;
  try {
    const { data } = await axios.get("/appmanagement/workspaces/transport-probe/");
    mkvProbeResult.value = data;
  } catch (e: any) {
    mkvProbeResult.value = { ok: false, detail: e?.response?.data?.error || e?.message };
  } finally {
    mkvProbeLoading.value = false;
  }
}

const mkvMigrateDialogOpen = ref(false);
const mkvMigrateLoading = ref(false);
const mkvMigrateLimit = ref(0);
const mkvMigrateApply = ref(false);
const mkvMigrateResult = ref<any>(null);
function openMigrateDialog() { mkvMigrateDialogOpen.value = true; }
async function runMkvMigrate() {
  mkvMigrateLoading.value = true;
  try {
    const { data } = await axios.post(
      "/appmanagement/workspaces/recovery-keys/migrate/",
      { apply: mkvMigrateApply.value, limit: mkvMigrateLimit.value || 0 },
    );
    mkvMigrateResult.value = data;
    $q.notify({
      message: data.dry_run
        ? `Dry run: would migrate ${data.fernet_pending} key(s)`
        : `Migrated ${data.migrated} key(s) (${data.fernet_pending} pending)`,
      color: data.failed?.length ? "warning" : "positive",
    });
    mkvMigrateDialogOpen.value = false;
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Migration failed",
      color: "negative",
    });
  } finally {
    mkvMigrateLoading.value = false;
  }
}

// Device certificate escrow
const certBackups = ref<any[]>([]);
const certBackupAgentFilter = ref<string | null>(null);
const certBackupColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "subject", label: "Subject", field: "subject", align: "left" },
  { name: "fingerprint_sha256", label: "Fingerprint", field: (r: any) => (r.fingerprint_sha256 || "").slice(0, 20) + "…", align: "left" },
  { name: "uploaded_at", label: "Uploaded", field: "uploaded_at", align: "left" },
  { name: "actions", label: "", field: "actions", align: "center" },
];
async function loadCertBackups() {
  try {
    const params: any = {};
    if (certBackupAgentFilter.value) params.agent_id = certBackupAgentFilter.value;
    const { data } = await axios.get("/appmanagement/workspaces/cert-backups/", { params });
    certBackups.value = Array.isArray(data) ? data : [];
  } catch {
    certBackups.value = [];
  }
}

const certUploadDialogOpen = ref(false);
const certUploadLoading = ref(false);
const certUploadForm = ref<{ agent_id: string; subject: string; issuer: string; cert_pem: string; privkey_pem: string }>({
  agent_id: "", subject: "", issuer: "", cert_pem: "", privkey_pem: "",
});
async function submitCertUpload() {
  certUploadLoading.value = true;
  try {
    await axios.post("/appmanagement/workspaces/cert-backups/", certUploadForm.value);
    certUploadDialogOpen.value = false;
    certUploadForm.value = { agent_id: "", subject: "", issuer: "", cert_pem: "", privkey_pem: "" };
    await loadCertBackups();
    $q.notify({ message: "Certificate sealed + stored", color: "positive" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Failed", color: "negative" });
  } finally {
    certUploadLoading.value = false;
  }
}

const certRevealOpen = ref(false);
const certRevealData = ref<any>(null);
async function revealCertBackup(row: any, includePrivkey: boolean) {
  try {
    const { data } = await axios.post(
      `/appmanagement/workspaces/cert-backups/${row.id}/reveal/`,
      { include_privkey: includePrivkey },
    );
    certRevealData.value = data;
    certRevealOpen.value = true;
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || e?.message || "Reveal failed", color: "negative" });
  }
}
async function deleteCertBackup(row: any) {
  $q.dialog({ title: "Delete cert backup?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/workspaces/cert-backups/${row.id}/`);
      await loadCertBackups();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Delete failed", color: "negative" });
    }
  });
}

// ── Geolocation: 4-mode filter (Device / Device group / User group / User) ─
const geoMode = ref<"agent" | "site" | "user_group" | "user">("agent");
const geoSiteId = ref<number | null>(null);
const geoUserGroupId = ref<number | null>(null);
const geoUsername = ref<string | null>(null);
const geoLoadedOnce = ref(false);

const geoSiteOptions = ref<{ label: string; value: number }[]>([]);
const geoUserGroupOptions = ref<{ label: string; value: number }[]>([]);
const geoUserOptions = ref<{ label: string; value: string }[]>([]);

function geoModeLabel() {
  return {
    agent: "device",
    site: "device group",
    user_group: "user group",
    user: "user",
  }[geoMode.value] || "target";
}

function onGeoModeChange() {
  // Reset sibling selectors so stale IDs don't leak into the request.
  if (geoMode.value !== "agent")      geoAgentId.value = "";
  if (geoMode.value !== "site")       geoSiteId.value = null;
  if (geoMode.value !== "user_group") geoUserGroupId.value = null;
  if (geoMode.value !== "user")       geoUsername.value = null;
  locations.value = [];
  geoLoadedOnce.value = false;
}

function onGeoTargetChange() {
  // Any selection change auto-fetches so the admin never sees a stale
  // empty map without feedback. If the user clears the picker we reset
  // to the pristine "before any query" state.
  const haveTarget =
    (geoMode.value === "agent"      && !!geoAgentId.value) ||
    (geoMode.value === "site"       && !!geoSiteId.value) ||
    (geoMode.value === "user_group" && !!geoUserGroupId.value) ||
    (geoMode.value === "user"       && !!geoUsername.value);
  if (haveTarget) {
    loadLocations();
  } else {
    locations.value = [];
    geoLoadedOnce.value = false;
  }
}

function geoRequestParams(): Record<string, string | number> {
  const p: Record<string, string | number> = {};
  if (geoMode.value === "agent" && geoAgentId.value) p.agent_id = geoAgentId.value;
  if (geoMode.value === "site" && geoSiteId.value) p.site_id = geoSiteId.value;
  if (geoMode.value === "user_group" && geoUserGroupId.value) p.user_group_id = geoUserGroupId.value;
  if (geoMode.value === "user" && geoUsername.value) p.username = geoUsername.value;
  return p;
}

async function loadGeoPickerOptions() {
  // Sites (device groups).
  try {
    const r = await axios.get("/clients/");
    const clients = Array.isArray(r.data) ? r.data : [];
    const sites: { label: string; value: number }[] = [];
    for (const c of clients) {
      for (const s of (c.sites || [])) {
        sites.push({ value: s.id, label: `${c.name} / ${s.name}` });
      }
    }
    // Fallback: direct /clients/sites/
    if (!sites.length) {
      try {
        const r2 = await axios.get("/clients/sites/");
        const list = Array.isArray(r2.data) ? r2.data : [];
        for (const s of list) sites.push({ value: s.id, label: s.name });
      } catch { /* ignore */ }
    }
    geoSiteOptions.value = sites;
  } catch {
    geoSiteOptions.value = [];
  }
  // User groups.
  try {
    const r = await axios.get("/accounts/user-groups/");
    const list = Array.isArray(r.data) ? r.data : r.data?.results ?? [];
    geoUserGroupOptions.value = list.map((g: any) => ({
      value: g.id,
      label: g.display_name || g.name || g.sam_account_name || `UG #${g.id}`,
    }));
  } catch {
    geoUserGroupOptions.value = [];
  }
  // Users.
  try {
    const r = await axios.get("/accounts/users/");
    const list = Array.isArray(r.data) ? r.data : r.data?.results ?? [];
    geoUserOptions.value = list.map((u: any) => ({
      value: u.username,
      label: u.display_name || u.username,
    }));
  } catch {
    geoUserOptions.value = [];
  }
}

// ── Geolocation helpers: probe-now + deploy-script ──────────────────────
const geoProbing = ref(false);
async function probeLocationNow() {
  if (!geoAgentId.value) return;
  geoProbing.value = true;
  try {
    const { data } = await axios.post("/devicemanagement/locations/probe/", {
      agent_id: geoAgentId.value,
    });
    $q.notify({
      message: `Probe saved: ${data.latitude}, ${data.longitude} (acc ${data.accuracy}m)`,
      color: "positive", icon: "my_location",
    });
    await loadLocations();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Probe failed",
      color: "negative",
    });
  } finally {
    geoProbing.value = false;
  }
}
async function deployScriptOne() {
  if (!geoAgentId.value) return;
  await _deployScriptCall([geoAgentId.value]);
}
async function deployScriptAll() {
  $q.dialog({
    title: "Deploy geolocation script to all agents?",
    message: "This overwrites any custom script already stored in the registry on every online agent.",
    cancel: true,
    ok: { color: "deep-orange", label: "Deploy" },
  }).onOk(() => _deployScriptCall([]));
}
async function _deployScriptCall(agent_ids: string[]) {
  try {
    const { data } = await axios.post(
      "/devicemanagement/locations/deploy-script/",
      { agent_ids },
    );
    const ok = Object.values(data.results || {}).filter((r: any) => r.status === "deployed").length;
    $q.notify({
      message: `Deployed to ${ok}/${data.count} agents`,
      color: "positive", icon: "check",
    });
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Deploy failed",
      color: "negative",
    });
  }
}

async function loadActions() {
  loadingActions.value = true;
  try {
    const params: any = {};
    if (actionFilter.value.status) params.status = actionFilter.value.status;
    if (actionFilter.value.action_type) params.action_type = actionFilter.value.action_type;
    if (actionFilter.value.agent_id) params.agent_id = actionFilter.value.agent_id;
    actions.value = (await axios.get("/devicemanagement/actions/", { params })).data;
  } finally { loadingActions.value = false; }
}
async function loadLocations() {
  loadingLocations.value = true;
  geoLoadedOnce.value = false;
  try {
    const params = geoRequestParams();
    const r = await axios.get("/devicemanagement/locations/", { params });
    locations.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    locations.value = [];
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load locations",
      color: "negative",
    });
  } finally {
    loadingLocations.value = false;
    geoLoadedOnce.value = true;
  }
}
async function loadLatestLocations() {
  loadingLocations.value = true;
  geoLoadedOnce.value = false;
  try {
    const params = geoRequestParams();
    const r = await axios.get("/devicemanagement/locations/latest/", { params });
    // Endpoint returns either a list (multi-target) or a single object (single-agent)
    const d = r.data;
    if (Array.isArray(d)) locations.value = d;
    else if (d && typeof d === "object") locations.value = [d];
    else locations.value = [];
  } catch (e: any) {
    locations.value = [];
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load latest locations",
      color: "negative",
    });
  } finally {
    loadingLocations.value = false;
    geoLoadedOnce.value = true;
  }
}
async function loadEncryption() {
  loadingEncryption.value = true;
  try { encryptionPolicies.value = (await axios.get("/devicemanagement/encryption/")).data; }
  finally { loadingEncryption.value = false; }
}
async function loadRecoveryKeys() {
  try {
    const params: any = {};
    if (recoveryAgentId.value) params.agent_id = recoveryAgentId.value;
    recoveryKeys.value = (await axios.get("/devicemanagement/recovery-keys/", { params })).data;
  } catch (e: any) {
    recoveryKeys.value = [];
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load recovery keys",
      color: "negative",
    });
  }
}

async function loadBitLockerStatus() {
  if (!bitlockerAgentId.value) return;
  bitlockerLoading.value = true;
  try {
    const params: any = { drive: bitlockerDrive.value || "all", timeout: 60 };
    const r = await axios.get(`/devicemanagement/encryption/status/${bitlockerAgentId.value}/`, { params });
    bitlockerStatus.value = r.data;
    const status = r.data?.status;
    bitlockerVolumes.value = Array.isArray(status?.volumes) ? status.volumes : [];
  } catch (e: any) {
    bitlockerStatus.value = null;
    bitlockerVolumes.value = [];
    $q.notify({
      message: e?.response?.data?.error || e?.message || "Failed to load BitLocker status",
      color: "negative",
    });
  } finally {
    bitlockerLoading.value = false;
  }
}

async function escrowBitLockerKey() {
  if (!bitlockerAgentId.value) return;
  bitlockerEscrowLoading.value = true;
  try {
    await axios.post(`/devicemanagement/encryption/escrow/${bitlockerAgentId.value}/`, {
      drive: bitlockerDrive.value === "all" ? "C:" : bitlockerDrive.value,
      wait: true,
      timeout: 90,
    });
    $q.notify({ message: "Recovery key escrowed", color: "positive", icon: "vpn_key" });
    await loadBitLockerStatus();
    await loadRecoveryKeys();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "BitLocker escrow failed",
      color: "negative",
    });
  } finally {
    bitlockerEscrowLoading.value = false;
  }
}

async function rotateBitLockerKey() {
  if (!bitlockerAgentId.value) return;
  const drive = bitlockerDrive.value === "all" ? "C:" : bitlockerDrive.value;
  const confirm = await new Promise<boolean>((resolve) => {
    $q.dialog({
      title: "Rotate BitLocker recovery key",
      message: `Add and escrow a new recovery password for ${drive}, then remove older recovery protectors?`,
      cancel: true,
      ok: { color: "warning", label: "Rotate" },
    }).onOk(() => resolve(true)).onCancel(() => resolve(false));
  });
  if (!confirm) return;
  bitlockerRotateLoading.value = true;
  try {
    await axios.post(`/devicemanagement/encryption/rotate/${bitlockerAgentId.value}/`, {
      drive,
      wait: true,
      timeout: 150,
    });
    $q.notify({ message: "Recovery key rotated and escrowed", color: "positive", icon: "published_with_changes" });
    await loadBitLockerStatus();
    await loadRecoveryKeys();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.message || "BitLocker rotation failed",
      color: "negative",
    });
  } finally {
    bitlockerRotateLoading.value = false;
  }
}

// ── Reveal-recovery-key dialog state ───────────────────────────────────
// Backed by `POST /devicemanagement/recovery-keys/<id>/reveal/`. The
// backend writes a WorkspaceRecoveryLog entry on every call (success or
// failure) so compliance always sees who saw which key.
const revealKeyOpen = ref(false);
const revealKeyTarget = ref<any>(null);
const revealKeyReason = ref("");
const revealKeyPlain = ref("");
const revealKeyFingerprint = ref("");
const revealKeyLoading = ref(false);

function revealRecoveryKey(row: any) {
  revealKeyTarget.value = row;
  revealKeyReason.value = "";
  revealKeyPlain.value = "";
  revealKeyFingerprint.value = "";
  revealKeyOpen.value = true;
}

function closeRevealDialog() {
  revealKeyOpen.value = false;
  // Defer wipe so the user can copy first if dialog is closed late.
  setTimeout(() => {
    revealKeyPlain.value = "";
    revealKeyReason.value = "";
    revealKeyFingerprint.value = "";
    revealKeyTarget.value = null;
  }, 100);
}

async function confirmRevealRecoveryKey() {
  if (!revealKeyTarget.value || !revealKeyReason.value.trim()) return;
  revealKeyLoading.value = true;
  try {
    const r = await axios.post(
      `/devicemanagement/recovery-keys/${revealKeyTarget.value.id}/reveal/`,
      { reason: revealKeyReason.value.trim() },
    );
    revealKeyPlain.value = r.data?.key_value || "";
    revealKeyFingerprint.value = r.data?.fingerprint || "";
    if (r.data?.warning) {
      $q.notify({ message: r.data.warning, color: "warning", timeout: 6000 });
    }
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.detail || e?.response?.data?.error || "Failed to reveal recovery key",
      color: "negative",
      timeout: 6000,
    });
  } finally {
    revealKeyLoading.value = false;
  }
}

async function copyRevealedKey() {
  if (!revealKeyPlain.value) return;
  try {
    await navigator.clipboard.writeText(revealKeyPlain.value);
    $q.notify({ message: "Recovery key copied to clipboard", color: "positive", icon: "check" });
  } catch {
    $q.notify({ message: "Could not access clipboard — copy manually", color: "warning" });
  }
}
async function loadInventoryFilters() {
  loadingFilters.value = true;
  try { inventoryFilters.value = (await axios.get("/devicemanagement/inventory-filters/")).data; }
  finally { loadingFilters.value = false; }
}

function showActionDialog(type: string) {
  currentActionType.value = type;
  actionForm.value = {
    agent_id: "",
    reason: "",
    extra_paths: "",
    lost_message: "This device is in Lost Mode. Please contact the organization.",
    lost_contact: "",
  };
  actionDialogOpen.value = true;
}

async function submitAction() {
  if (!actionForm.value.agent_id) { $q.notify({ message: "Agent ID required", color: "warning" }); return; }
  submittingAction.value = true;
  try {
    const params: any = {};
    if (currentActionType.value === "wipe_selective") {
      params.extra_paths = actionForm.value.extra_paths
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (currentActionType.value === "geolockmode") {
      params.lost_message = actionForm.value.lost_message;
      params.lost_contact = actionForm.value.lost_contact;
    }
    await axios.post("/devicemanagement/actions/", {
      agent_id: actionForm.value.agent_id,
      action_type: currentActionType.value,
      reason: actionForm.value.reason,
      params,
    });
    actionDialogOpen.value = false;
    $q.notify({ message: `${actionTypeLabel(currentActionType.value)} initiated`, color: "positive", icon: "check" });
    await loadActions();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Error", color: "negative" });
  } finally { submittingAction.value = false; }
}

async function cancelAction(action: any) {
  await axios.delete(`/devicemanagement/actions/${action.id}/`);
  $q.notify({ message: "Action cancelled", color: "positive", icon: "check" });
  await loadActions();
}

function showEncryptionDialog(item?: any) {
  editingEncryption.value = item || null;
  encryptionForm.value = item ? { ...item } : { name: "", encryption_type: "bitlocker", algorithm: "AES-256", encrypt_system_drive: true, encrypt_removable: false, escrow_keys: true, enabled: true };
  encryptionDialogOpen.value = true;
}

async function saveEncryption() {
  savingEncryption.value = true;
  try {
    if (editingEncryption.value) {
      await axios.put(`/devicemanagement/encryption/${editingEncryption.value.id}/`, encryptionForm.value);
    } else {
      await axios.post("/devicemanagement/encryption/", encryptionForm.value);
    }
    encryptionDialogOpen.value = false;
    $q.notify({ message: "Policy saved", color: "positive", icon: "check" });
    await loadEncryption();
  } finally { savingEncryption.value = false; }
}

// ── Deploy Encryption dialog state ───────────────────────────────────────
const deployEncryptionOpen = ref(false);
const deployEncryptionPolicy = ref<any>(null);
const deployEncryptionAgents = ref<string[]>([]);

function deployEncryption(policy: any) {
  deployEncryptionPolicy.value = policy;
  deployEncryptionAgents.value = [];
  deployEncryptionOpen.value = true;
}

async function confirmDeployEncryption() {
  try {
    const resp = await axios.post(
      `/devicemanagement/encryption/${deployEncryptionPolicy.value.id}/deploy/`,
      { agent_ids: deployEncryptionAgents.value, wait: true, timeout: 240 }
    );
    // Build per-agent rows for the results panel.
    const results = resp.data?.results || {};
    encryptionDeployResults.value = Object.entries(results).map(([aid, info]: [string, any]) => ({
      agent_id: aid,
      label: agentOptions.value.find((o: any) => o.value === aid)?.label || aid,
      status: info.status,
      action_id: encryptionActionIds(info).join(", "),
      summary: encryptionStepSummary(info),
      error: info.error,
    }));
    encryptionDeployPolicyName.value = resp.data?.policy || deployEncryptionPolicy.value?.name || "";
    encryptionDeployFunc.value = resp.data?.func || "";
    deployEncryptionOpen.value = false;
    $q.notify({
      message: `Deploy completed: ${encryptionDeployResults.value.filter((r: any) => ["completed", "ok"].includes(r.status)).length}/${encryptionDeployResults.value.length} ok`,
      color: "info", icon: "lock",
    });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error ?? "Deploy failed", color: "negative" });
  }
}

// Per-agent deploy results (rendered under the encryption policies table)
const encryptionDeployResults = ref<any[]>([]);
const encryptionDeployPolicyName = ref("");
const encryptionDeployFunc = ref("");

function encryptionActionIds(info: any): any[] {
  if (Array.isArray(info?.steps)) return info.steps.map((s: any) => s.action_id).filter(Boolean);
  return info?.action_id ? [info.action_id] : [];
}

function encryptionStepSummary(info: any): string {
  if (!Array.isArray(info?.steps)) return "";
  return info.steps.map((step: any) => {
    const result = step.result || {};
    if (result.drives_found !== undefined) {
      return `${step.verb}: ${result.status} (${result.drives_found} removable, ${result.encrypted_count || 0} encrypted, ${result.error_count || 0} errors)`;
    }
    return `${step.verb}: ${step.status}`;
  }).join("; ");
}
function encryptionResultColor(s: string) {
  if (s === "sent") return "positive";
  if (s === "failed") return "negative";
  return "grey";
}

async function deleteEncryption(id: number) {
  $q.dialog({ title: "Delete policy?", cancel: true, ok: { color: "negative" } }).onOk(async () => {
    await axios.delete(`/devicemanagement/encryption/${id}/`);
    await loadEncryption();
    $q.notify({ message: "Deleted", color: "positive", icon: "check" });
  });
}

// ===== Query Builder state (STT 603-607) =====
const showFilterBuilder = ref(false);
const filterBuilderName = ref("");
const filterBuilderShared = ref(false);
const filterBuilderSchedule = ref("");
const filterBuilderGroups = ref<any[]>([
  { op: "AND", conditions: [{ field: "hostname", operator: "contains", value: "" }] },
]);
const filterBuilderResults = ref<any[]>([]);
const filterBuilderLoading = ref(false);
const advancedSearchResults = ref<any[]>([]);
const advancedSearchLoading = ref(false);

const filterFieldOptions = [
  { value: "hostname", label: "Hostname" },
  { value: "os", label: "Operating System" },
  { value: "platform", label: "Platform" },
  { value: "user", label: "Logged User" },
  { value: "software", label: "Software Name" },
  { value: "client", label: "Client" },
  { value: "site", label: "Site" },
  { value: "ip", label: "IP Address" },
  { value: "version", label: "Agent Version" },
];

const filterOperatorOptions = [
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "equals", label: "Equals" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
];

function addFilterGroup() {
  filterBuilderGroups.value.push({ op: "AND", conditions: [{ field: "hostname", operator: "contains", value: "" }] });
}

function removeFilterGroup(gi: number) {
  filterBuilderGroups.value.splice(gi, 1);
}

function addCondition(group: any) {
  group.conditions.push({ field: "hostname", operator: "contains", value: "" });
}

function removeCondition(group: any, ci: number) {
  group.conditions.splice(ci, 1);
}

async function runFilterBuilder() {
  filterBuilderLoading.value = true;
  try {
    const params = { groups: filterBuilderGroups.value };
    const r = await axios.post("/devicemanagement/search/", params).catch(() =>
      axios.get("/devicemanagement/search/", { params: { groups: JSON.stringify(params.groups) } })
    );
    filterBuilderResults.value = r?.data || [];
  } finally {
    filterBuilderLoading.value = false;
  }
}

async function saveFilterBuilder() {
  const params = { groups: filterBuilderGroups.value };
  await axios.post("/devicemanagement/inventory-filters/", {
    name: filterBuilderName.value || "Unnamed Filter",
    filter_params: params,
    is_shared: filterBuilderShared.value,
    schedule_cron: filterBuilderSchedule.value,
  });
  $q.notify({ message: "Filter saved", color: "positive", icon: "check" });
  showFilterBuilder.value = false;
  await loadInventoryFilters();
}

async function runSavedFilter(filt: any) {
  filterBuilderLoading.value = true;
  try {
    const r = await axios.get(`/devicemanagement/inventory-filters/${filt.id}/run/`);
    filterBuilderResults.value = r?.data || [];
    $q.notify({ message: `Filter "${filt.name}": ${filterBuilderResults.value.length} result(s)`, color: "info" });
  } finally {
    filterBuilderLoading.value = false;
  }
}

function showFilterDialog() {
  showFilterBuilder.value = true;
}

async function deleteFilter(id: number) {
  await axios.delete(`/devicemanagement/inventory-filters/${id}/`);
  await loadInventoryFilters();
}

onMounted(() => {
  loadAgentOptions();
  loadActions();
  loadEncryption();
  loadInventoryFilters();
  loadWorkspaces();
  loadWorkspaceAppStoreLinks();
  loadFeedbackInbox();
  loadGeoPickerOptions();
  loadCertBackups();
});

// ===== Workspace Management (#822-827) =====
const showCreateWorkspace = ref(false);
const loadingWorkspaces = ref(false);
const workspaceApiError = ref("");
const recoveryDeviceId = ref("");
const recoveryAction = ref("Recover Workspace");
const recoveryReason = ref("");

const workspaceProfiles = ref<any[]>([]);
const workspaceAssignments = ref<any[]>([]);
const recoveryLog = ref<any[]>([]);

const newWorkspaceForm = ref({
  name: "",
  type: "organization",
  vpn_required: false,
  screen_capture_disabled: false,
  network_isolation: false,
  encrypt_storage: true,
  session_time_limit_hours: 0,
  max_cpu_percent: 0,
  max_memory_mb: 0,
  features: [] as string[],
  // UI-only fields; folded into sso_claim_filter on save.
  _sso_claim: "",
  _sso_match: "",
  // Phase-2 additions
  preinstalled_app_links: [] as number[],
  _choco_packages_raw: "",
  disk_quota_mb: 0,
  // Phase-4: LaboratoGuard DLP policy
  export_behavior: "free",
  clipboard_behavior: "free",
  _extra_paths_raw: "",
  // Phase-1/2/3 user-managed container password policy
  password_owner: "admin",
  recovery_escrow_mode: "escrow",
  escrow_shamir_threshold: 2,
  escrow_shamir_total: 3,
  require_tpm_binding: false,
  idle_lock_minutes: 15,
  bruteforce_max_attempts: 5,
  bruteforce_lockout_minutes: 30,
  snapshot_interval_hours: 0,
  snapshot_retention_count: 7,
  watermark_enabled: false,
  watermark_template: "{{user}} · {{timestamp}} · {{label}}",
  require_windows_hello: false,
  geofence_enforcement: "off",
  geofence_polygons: [] as { name: string; polygon: [number, number][] }[],
});

// Phase-3.c — workspace-edit dialog reuses the same form. When set, the
// dialog title flips to "Edit" and the submit button calls PATCH instead
// of POST.
const editingWorkspaceId = ref<number | null>(null);
const activeOfficerCount = ref<number | null>(null);

// Phase-2 catalogue + dialog state.
const workspaceAppStoreLinks = ref<{ id: number; name: string }[]>([]);

const feedbackDialogOpen = ref(false);
const feedbackForm = ref<{
  workspace: number | null;
  severity: "info" | "bug" | "request" | "incident";
  subject: string;
  body: string;
}>({ workspace: null, severity: "info", subject: "", body: "" });

const groupAssignDialogOpen = ref(false);
const groupAssignTargetId = ref<number | null>(null);
const groupAssignTargetName = ref("");
const groupAssignSelectedId = ref<number | null>(null);
const groupAssignOptions = ref<{ id: number; name: string }[]>([]);

// ── Resources / usage polling ────────────────────────────────────────────
const usageDialogOpen = ref(false);
const usageLoading = ref(false);
const usageRow = ref<any>(null);

async function openUsageDialog(row: any) {
  usageRow.value = { assignment_id: row.id, workspace_id: row.workspace, agent_id: row.agent_id, state: row.state, probe: null };
  usageDialogOpen.value = true;
  await reloadUsage();
}

async function reloadUsage() {
  if (!usageRow.value?.assignment_id) return;
  usageLoading.value = true;
  try {
    const { data } = await axios.get(
      `/appmanagement/workspaces/assignments/${usageRow.value.assignment_id}/usage/`
    );
    usageRow.value = data;
  } catch (e: any) {
    usageRow.value = {
      ...usageRow.value,
      probe: { ok: false, error: e?.response?.data?.error || e?.message || "fetch failed" },
    };
  } finally {
    usageLoading.value = false;
  }
}

function formatCpu(raw: any): string {
  if (raw == null) return "—";
  if (typeof raw === "number") return `${Math.round(raw)}%`;
  return String(raw);
}

// ── Feedback inbox (Phase-2) ────────────────────────────────────────────
const feedbackInboxStatus = ref("open");
const feedbackInboxRows = ref<any[]>([]);
const feedbackInboxColumns = [
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "subject", label: "Subject", field: "subject", align: "left" },
  { name: "submitted", label: "From", field: (r: any) => r.submitted_username || "—", align: "left" },
  { name: "created_at", label: "Age", field: (r: any) => fmtRelativeTime(r.created_at), align: "left" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "actions", label: "", field: "actions", align: "center" },
];
const feedbackDetailOpen = ref(false);
const feedbackDetailRow = ref<any>(null);

async function loadFeedbackInbox() {
  try {
    const qs = feedbackInboxStatus.value
      ? `?status=${encodeURIComponent(feedbackInboxStatus.value)}`
      : "";
    const { data } = await axios.get(`/appmanagement/workspaces/feedback/${qs}`);
    feedbackInboxRows.value = Array.isArray(data) ? data : [];
  } catch {
    feedbackInboxRows.value = [];
  }
}

function openFeedbackDetail(row: any) {
  feedbackDetailRow.value = { ...row };
  feedbackDetailOpen.value = true;
}

async function updateFeedbackStatus(row: any, newStatus: string) {
  try {
    await axios.patch(`/appmanagement/workspaces/feedback/${row.id}/`, { status: newStatus });
    $q.notify({ message: "Status updated", color: "positive" });
    row.status = newStatus;
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Update failed", color: "negative" });
  }
}

async function saveFeedbackNotes(row: any) {
  try {
    await axios.patch(`/appmanagement/workspaces/feedback/${row.id}/`, {
      admin_notes: row.admin_notes,
    });
    feedbackDetailOpen.value = false;
    await loadFeedbackInbox();
    $q.notify({ message: "Notes saved", color: "positive" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Save failed", color: "negative" });
  }
}

async function deleteFeedback(row: any) {
  $q.dialog({
    title: "Delete feedback entry?", cancel: true,
    ok: { color: "negative", label: "Delete" },
  }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/workspaces/feedback/${row.id}/`);
      await loadFeedbackInbox();
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || "Delete failed", color: "negative" });
    }
  });
}

async function loadWorkspaceAppStoreLinks() {
  try {
    const { data } = await axios.get("/appmanagement/app-store-links/");
    workspaceAppStoreLinks.value = (Array.isArray(data) ? data : []).map((d: any) => ({
      id: d.id, name: d.name,
    }));
  } catch {
    workspaceAppStoreLinks.value = [];
  }
}

function openFeedbackDialog() {
  feedbackForm.value = {
    workspace: workspaceProfiles.value[0]?.id ?? null,
    severity: "info",
    subject: "",
    body: "",
  };
  feedbackDialogOpen.value = true;
}

async function submitFeedback() {
  try {
    await axios.post("/appmanagement/workspaces/feedback/", feedbackForm.value);
    feedbackDialogOpen.value = false;
    $q.notify({ message: "Feedback submitted — thank you", color: "positive" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Submit failed", color: "negative" });
  }
}

async function openGroupAssignDialog(ws: any) {
  groupAssignTargetId.value = ws.id;
  groupAssignTargetName.value = ws.name;
  groupAssignSelectedId.value = null;
  try {
    const { data } = await axios.get("/accounts/user-groups/");
    const rows = Array.isArray(data) ? data : data?.results ?? [];
    groupAssignOptions.value = rows.map((r: any) => ({
      id: r.id,
      name: r.display_name || r.name || r.sam_account_name || `Group #${r.id}`,
    }));
  } catch {
    groupAssignOptions.value = [];
  }
  groupAssignDialogOpen.value = true;
}

async function confirmGroupAssign() {
  if (!groupAssignTargetId.value || !groupAssignSelectedId.value) return;
  try {
    await axios.post("/appmanagement/workspaces/group-assignments/", {
      workspace: groupAssignTargetId.value,
      user_group: groupAssignSelectedId.value,
    });
    groupAssignDialogOpen.value = false;
    $q.notify({
      message: "Workspace assigned to group — devices will be provisioned in background",
      color: "positive",
    });
    await loadWorkspaces();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Group assign failed", color: "negative" });
  }
}

function fmtRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const t = new Date(iso).getTime();
    const now = Date.now();
    const delta = Math.floor((now - t) / 1000);
    if (delta < 0) return iso;
    if (delta < 60) return `${delta}s ago`;
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
  } catch {
    return iso;
  }
}

const workspaceColumns = [
  { name: "agent_id", label: "Device", field: (r: any) => r.agent_id || r.device, align: "left" },
  { name: "user", label: "User", field: (r: any) => r.user || r.assigned_user || "—", align: "left" },
  { name: "workspace", label: "Workspace", field: (r: any) => r.workspace_name || r.workspace, align: "left" },
  { name: "state", label: "State", field: (r: any) => r.state || (r.is_active ? "active" : "inactive"), align: "left" },
  { name: "encrypted", label: "Encrypted", field: "encrypt_storage", align: "center" },
  { name: "last_enforced", label: "Last enforced",
    field: (r: any) => fmtRelativeTime(r.last_enforced_at), align: "left" },
  { name: "assigned_at", label: "Assigned", field: (r: any) => r.assigned_at || r.assigned, align: "left" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

function assignmentStateColor(state: string | null | undefined): string {
  const s = (state || "").toLowerCase();
  if (s === "active")         return "positive";
  if (s === "suspended")      return "warning";
  if (s === "decommissioned") return "grey";
  return "info";
}
function assignmentStateIcon(state: string | null | undefined): string {
  const s = (state || "").toLowerCase();
  if (s === "active")         return "play_arrow";
  if (s === "suspended")      return "pause";
  if (s === "decommissioned") return "block";
  return "help_outline";
}

// ----- Workspace lifecycle actions (suspend / resume / decommission / compliance)
async function suspendAssignment(row: any) {
  try {
    const reason = await new Promise<string>((resolve) => {
      $q.dialog({
        title: `Suspend workspace "${row.workspace_name || row.workspace}"`,
        message: "Reason (optional) — stored in the audit log:",
        prompt: { model: "", type: "text" },
        cancel: true,
      }).onOk((v: string) => resolve(v || "")).onCancel(() => resolve("__CANCEL__"));
    });
    if (reason === "__CANCEL__") return;
    const resp = await axios.post(
      `/appmanagement/workspaces/assignments/${row.id}/suspend/`,
      { reason },
      { timeout: 2 * 60 * 1000 },
    );
    $q.notify({ color: "positive", message: `Workspace suspended (state=${resp.data.state})`, icon: "pause" });
    await loadWorkspaces();
  } catch (error: any) {
    $q.notify({ color: "negative", message: error?.response?.data?.detail || "Suspend failed" });
  }
}

async function resumeAssignment(row: any) {
  try {
    const resp = await axios.post(
      `/appmanagement/workspaces/assignments/${row.id}/resume/`,
      {},
      { timeout: 60 * 1000 },
    );
    $q.notify({ color: "positive", message: `Workspace resumed (state=${resp.data.state})`, icon: "play_arrow" });
    await loadWorkspaces();
  } catch (error: any) {
    $q.notify({ color: "negative", message: error?.response?.data?.detail || "Resume failed" });
  }
}

async function decommissionAssignment(row: any) {
  $q.dialog({
    title: `Decommission "${row.workspace_name || row.workspace}"?`,
    message: "This permanently deletes every encrypted container for this workspace on the device. "
             + "The operation is irreversible — there is no restore. Enter a reason to continue:",
    prompt: { model: "", type: "text" },
    persistent: true,
    ok: { label: "Decommission", color: "negative" },
    cancel: true,
  }).onOk(async (reason: string) => {
    if (!reason || !reason.trim()) {
      $q.notify({ color: "negative", message: "A reason is required for decommission (audit)." });
      return;
    }
    try {
      const resp = await axios.post(
        `/appmanagement/workspaces/assignments/${row.id}/decommission/`,
        { reason: reason.trim() },
        { timeout: 5 * 60 * 1000 },
      );
      const removed = resp.data.containers_removed ?? 0;
      $q.notify({
        color: "positive",
        message: `Workspace decommissioned — ${removed} container(s) removed.`,
        icon: "delete_forever",
      });
      await loadWorkspaces();
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Decommission failed" });
    }
  });
}

const complianceDialogOpen = ref(false);
const complianceResult = ref<any>(null);
const complianceLoading = ref(false);

async function checkCompliance(row: any) {
  complianceResult.value = null;
  complianceDialogOpen.value = true;
  complianceLoading.value = true;
  try {
    const resp = await axios.get(
      `/appmanagement/workspaces/assignments/${row.id}/compliance/`,
      { timeout: 90 * 1000 },
    );
    complianceResult.value = resp.data;
  } catch (error: any) {
    complianceResult.value = { error: error?.response?.data?.detail || "Compliance probe failed" };
  } finally {
    complianceLoading.value = false;
  }
}

// Manual re-enforcement: asks the backend to re-apply the workspace's
// declarative policy (firewall rules, registry, scheduled tasks). Useful
// when policy drifts — a user deleted the firewall rule, etc.
async function enforceAssignment(row: any) {
  try {
    const resp = await axios.post(
      `/appmanagement/workspaces/assignments/${row.id}/enforce/`,
      { reason: "manual re-enforce from UI" },
      { timeout: 2 * 60 * 1000 },
    );
    const actions = (resp.data.report?.actions || []).length;
    $q.notify({ color: "positive", message: `Policy re-applied (${actions} field(s))`, icon: "shield" });
  } catch (error: any) {
    $q.notify({ color: "negative", message: error?.response?.data?.detail || "Enforce failed" });
  }
}

// Ad-hoc notification (admin -> end user on the endpoint).
async function notifyAssignment(row: any) {
  $q.dialog({
    title: `Send message to device ${row.agent_id || row.device}`,
    message: "This will show a MessageBox on the user's screen.",
    prompt: { model: "Enter message…", type: "text" },
    cancel: true,
  }).onOk(async (message: string) => {
    if (!message || !message.trim()) return;
    try {
      const resp = await axios.post(
        `/appmanagement/workspaces/assignments/${row.id}/notify/`,
        {
          title: `Message from ${row.workspace_name || row.workspace}`,
          message: message.trim(),
          severity: "info",
        },
        { timeout: 60 * 1000 },
      );
      const rep = resp.data.report || {};
      if (rep.ok) {
        $q.notify({ color: "positive",
          message: `Notification delivered via ${rep.method} to ${rep.active_user || "endpoint"}`,
          icon: "campaign" });
      } else {
        $q.notify({ color: "warning",
          message: `Notification logged only (${rep.method}). ${rep.error || ""}`,
          icon: "warning" });
      }
    } catch (error: any) {
      $q.notify({ color: "negative", message: error?.response?.data?.detail || "Notify failed" });
    }
  });
}

async function loadWorkspaces() {
  loadingWorkspaces.value = true;
  workspaceApiError.value = "";
  const errs: string[] = [];
  try {
    let profilesResp: any;
    let assignmentsResp: any;
    let recoveryResp: any;
    try {
      profilesResp = await axios.get("/appmanagement/workspaces/");
    } catch (e: any) {
      errs.push("profiles: " + (e?.response?.data?.error || e?.message || "error"));
      profilesResp = null;
    }
    try {
      assignmentsResp = await axios.get("/appmanagement/workspaces/assignments/");
    } catch (e: any) {
      errs.push("assignments: " + (e?.response?.data?.error || e?.message || "error"));
      assignmentsResp = null;
    }
    try {
      recoveryResp = await axios.get("/appmanagement/workspaces/recovery-log/");
    } catch (e: any) {
      errs.push("recovery log: " + (e?.response?.data?.error || e?.message || "error"));
      recoveryResp = null;
    }
    if (profilesResp?.data) workspaceProfiles.value = profilesResp.data;
    else workspaceProfiles.value = [];
    if (assignmentsResp?.data) workspaceAssignments.value = assignmentsResp.data;
    else workspaceAssignments.value = [];
    if (recoveryResp?.data) recoveryLog.value = recoveryResp.data;
    else recoveryLog.value = [];
    if (errs.length) {
      workspaceApiError.value =
        "Some workspace data did not load: " + errs.join("; ") + ". Check API access and permissions.";
      $q.notify({ message: workspaceApiError.value, color: "negative", timeout: 8000 });
    }
  } finally {
    loadingWorkspaces.value = false;
  }
}

function buildWorkspacePayload(f: any) {
  return {
    name: f.name,
    workspace_type: f.type,
    vpn_required: f.vpn_required,
    screen_capture_disabled: f.screen_capture_disabled,
    network_isolation: f.network_isolation,
    encrypt_storage: f.encrypt_storage,
    session_time_limit_hours: f.session_time_limit_hours || null,
    max_cpu_percent: Math.max(0, Math.min(99, Number(f.max_cpu_percent) || 0)),
    max_memory_mb:   Math.max(0, Number(f.max_memory_mb) || 0),
    features: f.features || [],
    sso_claim_filter: (f._sso_claim && f._sso_match)
      ? { claim: f._sso_claim.trim(), match: f._sso_match.trim() }
      : {},
    // Phase-2 additions
    preinstalled_app_links: f.preinstalled_app_links || [],
    preinstalled_choco_packages: (f._choco_packages_raw || "")
      .split(",").map((s: string) => s.trim()).filter(Boolean),
    disk_quota_mb: Math.max(0, Number(f.disk_quota_mb) || 0),
    // Phase-4: LaboratoGuard DLP policy
    export_behavior: f.export_behavior || "free",
    clipboard_behavior: f.clipboard_behavior || "free",
    guard_extra_watch_paths: (f._extra_paths_raw || "")
      .split(",").map((s: string) => s.trim()).filter(Boolean),
    // Phase-1/2/3 user-managed container password policy
    password_owner: f.password_owner || "admin",
    recovery_escrow_mode: f.recovery_escrow_mode || "escrow",
    escrow_shamir_threshold: Math.max(1, Number(f.escrow_shamir_threshold) || 1),
    escrow_shamir_total: Math.max(1, Number(f.escrow_shamir_total) || 1),
    require_tpm_binding: !!f.require_tpm_binding,
    idle_lock_minutes: Math.max(1, Number(f.idle_lock_minutes) || 15),
    bruteforce_max_attempts: Math.max(0, Number(f.bruteforce_max_attempts) || 0),
    bruteforce_lockout_minutes: Math.max(1, Number(f.bruteforce_lockout_minutes) || 30),
    snapshot_interval_hours: Math.max(0, Number(f.snapshot_interval_hours) || 0),
    snapshot_retention_count: Math.max(1, Number(f.snapshot_retention_count) || 7),
    watermark_enabled: !!f.watermark_enabled,
    watermark_template: String(f.watermark_template || ""),
    require_windows_hello: !!f.require_windows_hello,
    geofence_enforcement: f.geofence_enforcement || "off",
    geofence_polygons: Array.isArray(f.geofence_polygons) ? f.geofence_polygons : [],
  };
}

function resetWorkspaceForm() {
  editingWorkspaceId.value = null;
  activeOfficerCount.value = null;
  newWorkspaceForm.value = {
    name: "", type: "organization",
    vpn_required: false, screen_capture_disabled: false,
    network_isolation: false, encrypt_storage: true,
    session_time_limit_hours: 0, max_cpu_percent: 0, max_memory_mb: 0,
    features: [], _sso_claim: "", _sso_match: "",
    preinstalled_app_links: [], _choco_packages_raw: "", disk_quota_mb: 0,
    export_behavior: "free", clipboard_behavior: "free", _extra_paths_raw: "",
    password_owner: "admin", recovery_escrow_mode: "escrow",
    escrow_shamir_threshold: 2, escrow_shamir_total: 3,
    require_tpm_binding: false, idle_lock_minutes: 15,
    bruteforce_max_attempts: 5, bruteforce_lockout_minutes: 30,
    snapshot_interval_hours: 0, snapshot_retention_count: 7,
    watermark_enabled: false, watermark_template: "{{user}} · {{timestamp}} · {{label}}",
    require_windows_hello: false, geofence_enforcement: "off",
    geofence_polygons: [],
  };
}

function openCreateWorkspaceDialog() {
  resetWorkspaceForm();
  showCreateWorkspace.value = true;
}

async function openEditWorkspace(ws: any) {
  editingWorkspaceId.value = ws.id;
  newWorkspaceForm.value = {
    name: ws.name || "",
    type: ws.workspace_type || "organization",
    vpn_required: !!ws.vpn_required,
    screen_capture_disabled: !!ws.screen_capture_disabled,
    network_isolation: !!ws.network_isolation,
    encrypt_storage: ws.encrypt_storage !== false,
    session_time_limit_hours: ws.session_time_limit_hours || 0,
    max_cpu_percent: ws.max_cpu_percent || 0,
    max_memory_mb: ws.max_memory_mb || 0,
    features: ws.features || [],
    _sso_claim: ws.sso_claim_filter?.claim || "",
    _sso_match: ws.sso_claim_filter?.match || "",
    preinstalled_app_links: ws.preinstalled_app_links || [],
    _choco_packages_raw: (ws.preinstalled_choco_packages || []).join(","),
    disk_quota_mb: ws.disk_quota_mb || 0,
    export_behavior: ws.export_behavior || "free",
    clipboard_behavior: ws.clipboard_behavior || "free",
    _extra_paths_raw: (ws.guard_extra_watch_paths || []).join(","),
    password_owner: ws.password_owner || "admin",
    recovery_escrow_mode: ws.recovery_escrow_mode || "escrow",
    escrow_shamir_threshold: ws.escrow_shamir_threshold ?? 2,
    escrow_shamir_total: ws.escrow_shamir_total ?? 3,
    require_tpm_binding: !!ws.require_tpm_binding,
    idle_lock_minutes: ws.idle_lock_minutes ?? 15,
    bruteforce_max_attempts: ws.bruteforce_max_attempts ?? 5,
    bruteforce_lockout_minutes: ws.bruteforce_lockout_minutes ?? 30,
    snapshot_interval_hours: ws.snapshot_interval_hours ?? 0,
    snapshot_retention_count: ws.snapshot_retention_count ?? 7,
    watermark_enabled: !!ws.watermark_enabled,
    watermark_template: ws.watermark_template || "{{user}} · {{timestamp}} · {{label}}",
    require_windows_hello: !!ws.require_windows_hello,
    geofence_enforcement: ws.geofence_enforcement || "off",
    geofence_polygons: ws.geofence_polygons || [],
  };
  // Best-effort officer count for the n-vs-active hint.
  activeOfficerCount.value = null;
  try {
    const { data } = await axios.get(`/appmanagement/workspaces/${ws.id}/escrow-officers/`);
    const items = (data?.items || data || []) as any[];
    activeOfficerCount.value = items.filter((o: any) => o.is_active).length;
  } catch {
    activeOfficerCount.value = null;
  }
  showCreateWorkspace.value = true;
}

async function submitWorkspace() {
  try {
    const f = newWorkspaceForm.value;
    const payload = buildWorkspacePayload(f);
    if (editingWorkspaceId.value) {
      await axios.patch(`/appmanagement/workspaces/${editingWorkspaceId.value}/`, payload);
      $q.notify({ message: "Workspace updated", color: "positive", icon: "check" });
    } else {
      await axios.post("/appmanagement/workspaces/", payload);
      $q.notify({ message: "Workspace created", color: "positive", icon: "check" });
    }
    showCreateWorkspace.value = false;
    resetWorkspaceForm();
    await loadWorkspaces();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || e?.response?.data?.detail || "Failed to save workspace",
      color: "negative",
    });
  }
}

// kept as a thin alias for any pre-existing call sites
async function createWorkspace() { await submitWorkspace(); }

async function deleteWorkspace(id: number) {
  // Kept for any pre-existing call sites — UI now uses confirmDeleteWorkspace().
  await confirmDeleteWorkspace(workspaceProfiles.value.find((w: any) => w.id === id) || { id });
}

/** First-stage dialog: human confirmation before we even hit the API. */
async function confirmDeleteWorkspace(ws: any) {
  if (!ws || !ws.id) return;
  const wsName = ws.name || `#${ws.id}`;

  // Pre-compute usage from already-loaded data so the user knows what they're
  // about to delete *before* the API call. The backend re-validates.
  const activeAssignments = workspaceAssignments.value.filter(
    (a: any) => a.is_active && (a.workspace === ws.id || a.workspace_name === ws.name),
  );
  const activeCount = activeAssignments.length;

  if (activeCount > 0) {
    $q.dialog({
      title: `Delete "${wsName}"?`,
      message:
        `This workspace is still attached to <b>${activeCount}</b> device(s). `
        + "Recommended path: use <b>Decommission</b> on every assignment first "
        + "(that wipes the on-device encrypted containers cleanly), then come "
        + "back and delete the workspace.<br/><br/>"
        + "If the devices are unreachable and you need a DR cleanup, choose "
        + "<b>Force delete</b> on the next screen — it drops every DB row but "
        + "leaves any <code>.vhdx</code> files orphaned on disk.",
      html: true,
      cancel: { label: "Cancel" },
      ok: { color: "negative", label: "Continue…" },
    }).onOk(() => doDeleteWorkspaceRequest(ws, /*force*/ false));
    return;
  }

  $q.dialog({
    title: `Delete "${wsName}"?`,
    message:
      "This permanently removes the workspace profile and every related "
      + "policy / DLP / escrow / SSO record. This action cannot be undone.",
    cancel: true,
    ok: { color: "negative", label: "Delete" },
  }).onOk(() => doDeleteWorkspaceRequest(ws, /*force*/ false));
}

/**
 * Second stage: actually call the API. The backend may still refuse with
 * HTTP 409 if it spots usages we don't know about (e.g. decommissioned
 * assignments with lingering containers). In that case we offer a typed-name
 * force-delete escape hatch.
 */
async function doDeleteWorkspaceRequest(ws: any, force: boolean) {
  const wsName = ws.name || `#${ws.id}`;
  try {
    const url = force
      ? `/appmanagement/workspaces/${ws.id}/?force=true`
      : `/appmanagement/workspaces/${ws.id}/`;
    await axios.delete(url);
    await loadWorkspaces();
    $q.notify({
      message: force
        ? `Workspace "${wsName}" force-deleted.`
        : `Workspace "${wsName}" deleted.`,
      color: force ? "warning" : "positive",
      icon: force ? "warning" : "delete",
    });
  } catch (e: any) {
    if (e?.response?.status === 409) {
      const data = e.response.data || {};
      const activeCount = Number(data.active_assignments || 0);
      const containerCount = Number(data.containers || 0);
      $q.dialog({
        title: `"${wsName}" still has data`,
        message:
          `Backend still sees <b>${activeCount}</b> active assignment(s) and `
          + `<b>${containerCount}</b> encrypted container(s).<br/><br/>`
          + "Type the workspace name below to confirm a <b>force delete</b>. "
          + "DB rows for assignments / containers will be wiped but on-device "
          + "<code>.vhdx</code> files will remain orphaned. DR-use only.",
        html: true,
        prompt: { model: "", type: "text", label: "Type workspace name to confirm" },
        persistent: true,
        cancel: { label: "Cancel" },
        ok: { color: "negative", label: "Force delete" },
      }).onOk(async (typed: string) => {
        if ((typed || "").trim() !== wsName) {
          $q.notify({
            message: `Confirmation text "${typed}" does not match — aborted.`,
            color: "negative",
          });
          return;
        }
        await doDeleteWorkspaceRequest(ws, /*force*/ true);
      });
      return;
    }
    $q.notify({
      message:
        e?.response?.data?.detail
        || e?.response?.data?.error
        || `Failed to delete "${wsName}"`,
      color: "negative",
    });
  }
}

// ── Attach Workspace dialog state ─────────────────────────────────────────
const attachWorkspaceOpen = ref(false);
const attachWorkspaceTarget = ref<any>(null);
const attachWorkspaceAgent = ref<string>("");

function attachWorkspace(ws: any) {
  attachWorkspaceTarget.value = ws;
  attachWorkspaceAgent.value = "";
  attachWorkspaceOpen.value = true;
}

// ── Phase-4 DLP edit (export / clipboard behavior) ───────────────────────
const dlpEditOpen = ref(false);
const dlpEditWs = ref<any>(null);
const dlpEditForm = ref({
  export_behavior: "free",
  clipboard_behavior: "free",
  guard_extra_watch_paths_raw: "",
});

function openDlpEditDialog(ws: any) {
  dlpEditWs.value = ws;
  dlpEditForm.value = {
    export_behavior: ws.export_behavior || "free",
    clipboard_behavior: ws.clipboard_behavior || "free",
    guard_extra_watch_paths_raw: (ws.guard_extra_watch_paths || []).join(", "),
  };
  dlpEditOpen.value = true;
}

async function submitDlpEdit() {
  const ws = dlpEditWs.value;
  if (!ws) return;
  try {
    await axios.patch(`/appmanagement/workspaces/${ws.id}/`, {
      export_behavior: dlpEditForm.value.export_behavior,
      clipboard_behavior: dlpEditForm.value.clipboard_behavior,
      guard_extra_watch_paths: dlpEditForm.value.guard_extra_watch_paths_raw
        .split(",").map((s: string) => s.trim()).filter(Boolean),
    });
    $q.notify({ message: "DLP policy saved — re-enforce any assignment to push to endpoint.", color: "positive" });
    dlpEditOpen.value = false;
    await loadWorkspaces();
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Save failed", color: "negative" });
  }
}

async function confirmAttachWorkspace() {
  try {
    await axios.post("/appmanagement/workspaces/assignments/", {
      workspace: attachWorkspaceTarget.value.id,
      agent_id: attachWorkspaceAgent.value,
    });
    attachWorkspaceOpen.value = false;
    await loadWorkspaces();
    $q.notify({ message: `Workspace attached to ${attachWorkspaceAgent.value}`, color: "positive" });
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error ?? "Failed to attach", color: "negative" });
  }
}

async function detachWorkspace(ws: any) {
  // Called from workspace card — ws is the workspace profile object, not an assignment.
  const assignments = workspaceAssignments.value.filter(
    (a: any) => a.workspace === ws.id || a.workspace_name === ws.name
  );
  if (!assignments.length) {
    $q.notify({ message: "No active assignments for this workspace", color: "info" });
    return;
  }
  $q.dialog({
    title: "Detach Workspace",
    message: `Detach "${ws.name}" from ${assignments.length} device(s)?`,
    cancel: true,
    ok: { color: "negative", label: "Detach" },
  }).onOk(async () => {
    try {
      const results = await Promise.allSettled(
        assignments.map((a: any) =>
          axios.delete(`/appmanagement/workspaces/assignments/${a.id}/`)
        )
      );
      const failed = results.filter((r) => r.status === "rejected");
      await loadWorkspaces();
      if (failed.length) {
        const firstErr: any = (failed[0] as PromiseRejectedResult).reason;
        $q.notify({
          message: `Detached ${assignments.length - failed.length}/${assignments.length}; ${failed.length} failed: ${firstErr?.response?.data?.error || firstErr?.message || "error"}`,
          color: failed.length === assignments.length ? "negative" : "warning",
          icon: "warning",
        });
      } else {
        $q.notify({ message: `Workspace "${ws.name}" detached`, color: "warning" });
      }
    } catch (e: any) {
      $q.notify({ message: e?.response?.data?.error || e?.message || "Failed to detach", color: "negative" });
    }
  });
}

async function changeWorkspace(row: any) {
  $q.dialog({
    title: "Change Workspace", message: "Enter new Workspace ID:", prompt: { model: "", label: "Workspace ID" }, cancel: true
  }).onOk(async (wsId: string) => {
    try {
      await axios.patch(`/appmanagement/workspaces/assignments/${row.id}/`, { workspace: parseInt(wsId) });
      await loadWorkspaces();
      $q.notify({ message: "Workspace changed", color: "info" });
    } catch {
      $q.notify({ message: "Failed to change workspace", color: "negative" });
    }
  });
}

async function rotateKeys(row: any) {
  $q.dialog({ title: "Rotate Keys", message: `Rotate encryption keys for ${row.agent_id || row.device}?`, cancel: true, ok: { color: "warning", label: "Rotate" } })
    .onOk(async () => {
      try {
        await axios.post("/appmanagement/workspaces/recovery/", {
          agent_id: row.agent_id || row.device,
          action: "rotate_keys",
          reason: "Rotate workspace encryption keys from Device Management UI",
        });
        await loadWorkspaces();
        $q.notify({ message: "Keys rotated successfully", color: "positive" });
      } catch (e: any) {
        $q.notify({
          message: e?.response?.data?.error || "Key rotation failed",
          color: "negative",
        });
      }
    });
}

async function executeRecovery() {
  if (!recoveryDeviceId.value || !recoveryReason.value) {
    $q.notify({ message: "Device ID and reason required", color: "warning" });
    return;
  }
  try {
    await axios.post("/appmanagement/workspaces/recovery/", {
      agent_id: recoveryDeviceId.value,
      action: recoveryAction.value,
      reason: recoveryReason.value,
    });
    await loadWorkspaces();
    $q.notify({ message: `Recovery action executed on ${recoveryDeviceId.value}`, color: "positive" });
    recoveryDeviceId.value = "";
    recoveryReason.value = "";
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.error || "Recovery failed", color: "negative" });
  }
}
</script>
