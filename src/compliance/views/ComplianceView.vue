<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('compliance.views.ComplianceView.e161a7') }}</div>

    <q-tabs v-model="tab" dense class="q-mb-md" align="left">
      <q-tab name="overview" :label="$t('compliance.views.ComplianceView.0efc2e')" icon="dashboard" />
      <q-tab name="checks" :label="$t('compliance.views.ComplianceView.06b84f')" icon="fact_check" />
      <q-tab name="lockout" :label="$t('compliance.views.ComplianceView.39fef9')" icon="lock" />
      <q-tab name="wipe" :label="$t('compliance.views.ComplianceView.38032a')" icon="delete_forever" />
      <q-tab name="cywm" :label="$t('compliance.views.ComplianceView.c7fe2d')" icon="sync" />
      <q-tab name="levels" :label="$t('compliance.views.ComplianceView.9ea2ba')" icon="bar_chart" />
      <q-tab name="devices" :label="$t('compliance.views.ComplianceView.df485c')" icon="devices" />
      <q-tab name="violations" :label="$t('compliance.views.ComplianceView.198274')" icon="warning" />
      <q-tab name="remediation" :label="$t('compliance.views.ComplianceView.55f522')" icon="healing" />
      <q-tab name="reports" :label="$t('compliance.views.ComplianceView.88bc3f')" icon="assessment" />
      <q-tab name="zero-trust" :label="$t('compliance.views.ComplianceView.466d89')" icon="security" />
      <q-tab name="exceptions" :label="$t('compliance.views.ComplianceView.cd3dfb')" icon="shield" />
      <q-tab name="timeline" :label="$t('compliance.views.ComplianceView.018514')" icon="timeline" />
      <q-tab name="wazuh-sca" :label="$t('compliance.views.ComplianceView.c01bcb')" icon="verified_user" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Overview Dashboard -->
      <q-tab-panel name="overview">
        <ComplianceOverviewPanel
          :summary="summary"
          :non-compliant-checks="nonCompliantChecks"
          :device-summary="reportSummary?.device_summary"
        />
      </q-tab-panel>

      <!-- Compliance Checks -->
      <q-tab-panel name="checks">
        <div class="row q-gutter-sm q-mb-md items-center">
          <q-select
            v-model="checkFilter.status"
            :options="statusOptions"
            :label="$t('compliance.views.ComplianceView.bae7d5')"
            dense outlined clearable emit-value map-options style="min-width: 140px"
            @update:model-value="loadChecks"
          />
          <q-select
            v-model="checkFilter.check_type"
            :options="checkTypeOptions"
            :label="$t('compliance.views.ComplianceView.3deb74')"
            dense outlined clearable emit-value map-options style="min-width: 140px"
            @update:model-value="loadChecks"
          />
          <q-select
            v-model="checkFilter.agent_id"
            :options="agentOptions"
            option-label="hostname"
            option-value="agent_id"
            emit-value
            map-options
            :label="$t('compliance.views.ComplianceView.a5a74a')"
            dense outlined clearable use-input
            input-debounce="0"
            style="min-width: 220px"
            @update:model-value="loadChecks"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.hostname }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.agent_id }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn color="primary" icon="add" :label="$t('compliance.views.ComplianceView.ac4ae0')" @click="showCreateCheckDialog" />
        </div>
        <q-table
          :rows="checks"
          :columns="checkColumns"
          dense
          row-key="id"
          :loading="loadingChecks"
          :rows-per-page-options="[20, 50, 100]"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip dense :color="statusColor(props.value)" text-color="white">
                {{ statusLabel(props.value) }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Lockout Policies -->
      <q-tab-panel name="lockout">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="primary" icon="add" :label="$t('compliance.views.ComplianceView.4d8b7a')" @click="showPolicyDialog('lockout')" />
        </div>
        <q-table
          :rows="lockoutPolicies"
          :columns="lockoutColumns"
          dense
          row-key="id"
          :loading="loadingLockout"
        >
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'grey'">
                {{ props.value ? 'Enabled' : 'Disabled' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showPolicyDialog('lockout', props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deletePolicy('lockout', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Wipe Policies -->
      <q-tab-panel name="wipe">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="negative" icon="add" :label="$t('compliance.views.ComplianceView.b39b9a')" @click="showPolicyDialog('wipe')" />
        </div>
        <q-table
          :rows="wipePolicies"
          :columns="wipeColumns"
          dense
          row-key="id"
          :loading="loadingWipe"
        >
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'negative' : 'grey'">
                {{ props.value ? 'Active' : 'Disabled' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showPolicyDialog('wipe', props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deletePolicy('wipe', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- CYWM Intervals -->
      <q-tab-panel name="cywm">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn color="teal" icon="add" :label="$t('compliance.views.ComplianceView.c371ab')" @click="showPolicyDialog('cywm')" />
        </div>
        <q-table
          :rows="cywmIntervals"
          :columns="cywmColumns"
          dense
          row-key="id"
          :loading="loadingCywm"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="edit" size="sm" @click="showPolicyDialog('cywm', props.row)" />
              <q-btn flat dense round icon="wifi_tethering" size="sm" color="teal" @click="testConnection(props.row)" :title="$t('compliance.views.ComplianceView.580f6a')" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deletePolicy('cywm', props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Compliance Levels (#532-537) -->
      <q-tab-panel name="levels">
        <ComplianceLevelsPanel
          :levels="complianceLevels"
          :requirements-matrix="requirementsMatrix"
          :matrix-columns="matrixColumns"
          :matrix-level-column-names="matrixLevelColumnNames"
          :site-options="siteOptions"
          :loading-levels="loadingLevels"
          :saving-levels="savingLevels"
          @save="saveLevelAssignments"
          @create-level="openCreateLevel"
          @edit-level="openEditLevel"
          @delete-level="confirmDeleteLevel"
          @open-level="openLevelDetail"
          @open-device="openDeviceDetail"
          @add-requirement="(level) => { requirementEditorLevel = level; requirementEditorReq = null; requirementEditorOpen = true; }"
          @edit-requirement="({ level, requirement }) => { requirementEditorLevel = level; requirementEditorReq = requirement; requirementEditorOpen = true; }"
        />
      </q-tab-panel>

      <q-tab-panel name="devices">
        <ComplianceDevicesPanel
          :rows="deviceStatuses"
          :loading="loadingDeviceStatuses"
          @select-device="openDeviceDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="violations">
        <ComplianceViolationsPanel
          :rows="violations"
          :loading="loadingViolations"
          @select-device="openDeviceDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="remediation">
        <RemediationPanel />
      </q-tab-panel>

      <q-tab-panel name="reports">
        <q-inner-loading :showing="loadingReportSummary">
          <q-spinner color="primary" size="42px" />
        </q-inner-loading>
        <ComplianceReportsPanel :summary="reportSummary" v-if="!loadingReportSummary" />
      </q-tab-panel>

      <q-tab-panel name="zero-trust">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">{{ $t('compliance.views.ComplianceView.aa81ba') }}</div>
            <div class="mdm-section-subtitle">{{ $t('compliance.views.ComplianceView.f69f77') }}</div>
          </div>
          <q-btn color="primary" icon="add" :label="$t('compliance.views.ComplianceView.278f55')" @click="showZeroTrustDialog()" />
        </div>

        <q-table :rows="zeroTrustConfigs" :columns="ztColumns" dense row-key="id" :loading="loadingZeroTrust">
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white" size="sm">
                {{ props.value ? 'Active' : 'Disabled' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense round icon="send" size="sm" color="teal" @click="testZeroTrustWebhook(props.row)" :title="$t('compliance.views.ComplianceView.01c8ad')" />
              <q-btn flat dense round icon="edit" size="sm" @click="showZeroTrustDialog(props.row)" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" @click="deleteZeroTrustConfig(props.row.id)" />
            </q-td>
          </template>
        </q-table>

        <q-separator class="q-mt-lg q-mb-md" />
        <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.views.ComplianceView.fa7233') }}</div>
        <q-card flat bordered>
          <q-card-section>
            <pre class="text-caption" style="background:#f5f5f5; padding:12px; border-radius:4px">{{JSON.stringify({agent_id:"string",hostname:"string",access_state:"allowed|grace_period|blocked|quarantined|review",effective_status:"compliant|non_compliant|stale|unknown",risk_score:0,open_violations:0,is_compliant:true,access_allowed:true},null,2)}}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Phase 3: Compliance Exceptions -->
      <q-tab-panel name="exceptions">
        <ComplianceExceptionsPanel />
      </q-tab-panel>

      <!-- Phase 3: Device Compliance Timeline -->
      <q-tab-panel name="timeline">
        <ComplianceTimelinePanel />
      </q-tab-panel>

      <!-- Phase 4: Wazuh SCA Integration -->
      <q-tab-panel name="wazuh-sca">
        <q-banner rounded class="bg-blue-1 q-mb-md">
          <template #avatar><q-icon name="shield" color="primary" /></template>
          {{ $t('compliance.views.ComplianceView.1aa8e5') }}
          <q-btn
            flat
            color="primary"
            :label="$t('compliance.views.ComplianceView.bf908e')"
            class="q-ml-sm"
            @click="$router.push('/cyber-defense')"
          />
        </q-banner>
        <WazuhSCAPanel />
      </q-tab-panel>

    </q-tab-panels>

    <q-dialog v-model="levelDetailOpen" maximized>
      <q-card>
        <q-bar>
          <span>{{ selectedLevelDetail?.name || "Compliance Level Detail" }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="selectedLevelDetail">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.0c1dcd') }}</div>
                  <div class="text-h5">{{ selectedLevelDetail.compliance_rate }}%</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.62b5f9') }}</div>
                  <div class="text-h5">{{ selectedLevelDetail.risk_score }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.ab66e8') }}</div>
                  <div class="text-h5">{{ selectedLevelDetail.critical_violations_count }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.22f4dc') }}</div>
                  <div class="text-h5">{{ selectedLevelDetail.failing_requirements_count }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.views.ComplianceView.46e64d') }}</div>
          <q-table
            :rows="selectedLevelDetail.devices || []"
            :columns="levelDeviceColumns"
            dense
            row-key="agent_id"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="visibility" size="sm" color="primary" @click="openDeviceDetail(props.row.agent_id)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deviceDetailOpen" maximized>
      <q-card>
        <q-bar>
          <span>{{ selectedDeviceDetail?.hostname || selectedDeviceDetail?.agent_id || "Device Compliance Detail" }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="selectedDeviceDetail">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.b931a9') }}</div>
                  <div class="text-h6">{{ selectedDeviceDetail.effective_status }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.33d60e') }}</div>
                  <div class="text-h6">{{ selectedDeviceDetail.access_state }}</div>
                  <div class="text-caption text-grey">{{ selectedDeviceDetail.access_reason }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.62b5f9') }}</div>
                  <div class="text-h6">{{ selectedDeviceDetail.risk_score }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.5f1237') }}</div>
                  <div class="text-body2">{{ selectedDeviceDetail.last_checked || "n/a" }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Requirements pass/fail matrix per device -->
          <div v-if="(selectedDeviceDetail.requirement_results || []).length" class="q-mb-lg">
            <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.views.ComplianceView.6fabe2') }}</div>
            <q-table
              :rows="selectedDeviceDetail.requirement_results"
              :columns="requirementResultColumns"
              dense row-key="requirement_id"
              :rows-per-page-options="[0]"
              hide-pagination
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props" class="text-center">
                  <q-icon
                    :name="props.value === 'compliant' ? 'check_circle' : props.value === 'non_compliant' ? 'cancel' : 'help_outline'"
                    :color="props.value === 'compliant' ? 'positive' : props.value === 'non_compliant' ? 'negative' : 'grey'"
                    size="sm"
                  />
                  <span class="q-ml-xs text-caption">{{ props.value }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-severity="props">
                <q-td :props="props">
                  <q-chip dense :color="{ low: 'grey-7', medium: 'primary', high: 'warning', critical: 'negative' }[props.value] ?? 'primary'" text-color="white" size="xs">{{ props.value }}</q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-evidence="props">
                <q-td :props="props">
                  <q-btn flat dense size="xs" icon="info" color="grey-7" @click="selectedEvidenceRow = props.row; evidenceRowOpen = true" />
                </q-td>
              </template>
            </q-table>
          </div>

          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.views.ComplianceView.ac2098') }}</div>
          <q-table
            :rows="selectedDeviceDetail.violations || []"
            :columns="deviceViolationColumns"
            dense row-key="id"
            :rows-per-page-options="[10, 20, 50]"
            class="q-mb-lg"
          />

          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.views.ComplianceView.35bc65') }}</div>
          <q-table
            :rows="selectedDeviceDetail.compliance_checks || []"
            :columns="checkColumns"
            dense row-key="id"
            :rows-per-page-options="[10, 20, 50]"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Zero Trust Webhook Dialog -->
    <q-dialog v-model="ztDialogOpen" persistent>
      <q-card style="min-width: 520px">
        <q-bar>
          <span>{{ ztEditingConfig ? "Edit" : "New" }} Zero Trust Webhook</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="ztForm.name" :label="$t('compliance.views.ComplianceView.d145bb')" outlined dense />
          <q-input v-model="ztForm.webhook_url" :label="$t('compliance.views.ComplianceView.87e72b')" outlined dense placeholder="https://..." />
          <div class="row q-col-gutter-sm">
            <q-input v-model="ztForm.auth_header_name" :label="$t('compliance.views.ComplianceView.c7f63a')" outlined dense class="col-6" :placeholder="$t('compliance.views.ComplianceView.5e25ce')" />
            <q-input v-model="ztForm.auth_header_value" :label="$t('compliance.views.ComplianceView.0e7867')" outlined dense class="col-6" :placeholder="$t('compliance.views.ComplianceView.d201e6')" type="password" />
          </div>
          <div class="text-caption text-grey">{{ $t('compliance.views.ComplianceView.4d1233') }}</div>
          <div class="row q-col-gutter-sm">
            <q-toggle v-model="ztForm.notify_on_blocked" :label="$t('compliance.views.ComplianceView.99613c')" class="col-6" />
            <q-toggle v-model="ztForm.notify_on_quarantined" :label="$t('compliance.views.ComplianceView.15f4df')" class="col-6" />
            <q-toggle v-model="ztForm.notify_on_grace_period" :label="$t('compliance.views.ComplianceView.4cb1c6')" class="col-6" />
            <q-toggle v-model="ztForm.notify_on_compliant" :label="$t('compliance.views.ComplianceView.522bd2')" class="col-6" />
          </div>
          <q-toggle v-model="ztForm.enabled" :label="$t('compliance.views.ComplianceView.df174a')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('compliance.views.ComplianceView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('compliance.views.ComplianceView.efc007')" @click="saveZeroTrustConfig" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Evidence detail dialog -->
    <q-dialog v-model="evidenceRowOpen">
      <q-card style="min-width: 480px">
        <q-bar><span>Evidence — {{ selectedEvidenceRow?.name }}</span><q-space /><q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section v-if="selectedEvidenceRow">
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.views.ComplianceView.bae7d5') }}</div>
          <div class="text-body2 q-mb-md">{{ selectedEvidenceRow.status }} · {{ selectedEvidenceRow.severity }}</div>
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.views.ComplianceView.6ac87f') }}</div>
          <pre class="text-caption q-mb-sm" style="overflow:auto; background:#f5f5f5; padding:8px; border-radius:4px">{{ JSON.stringify(selectedEvidenceRow.expected_value, null, 2) }}</pre>
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.views.ComplianceView.2e159b') }}</div>
          <pre class="text-caption q-mb-sm" style="overflow:auto; background:#f5f5f5; padding:8px; border-radius:4px">{{ JSON.stringify(selectedEvidenceRow.observed_value, null, 2) }}</pre>
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.views.ComplianceView.7ea014') }}</div>
          <pre class="text-caption" style="overflow:auto; background:#f5f5f5; padding:8px; border-radius:4px">{{ JSON.stringify(selectedEvidenceRow.evidence, null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Requirements Editor Dialog -->
    <RequirementsEditorDialog
      v-model="requirementEditorOpen"
      :level="requirementEditorLevel"
      :requirement="requirementEditorReq"
      @saved="loadLevels"
    />

    <!-- Create / Edit Compliance Level Dialog -->
    <q-dialog v-model="levelDialogOpen" persistent>
      <q-card style="min-width: 520px; max-width: 640px;">
        <q-bar class="bg-primary text-white">
          <q-icon name="bar_chart" class="q-mr-sm" />
          <span class="text-weight-medium">{{ editingLevel ? `Edit Level — ${editingLevel.name}` : 'New Compliance Level' }}</span>
          <q-space />
          <q-btn dense flat round icon="close" @click="levelDialogOpen = false" />
        </q-bar>
        <q-card-section class="q-gutter-sm">
          <div class="row q-gutter-sm">
            <q-input v-model.number="levelForm.rank" :label="$t('compliance.views.ComplianceView.d778af')" type="number" outlined dense class="col-2"
              :hint="$t('compliance.views.ComplianceView.bcd40d')" />
            <q-input v-model="levelForm.name" :label="$t('compliance.views.ComplianceView.787f27')" outlined dense class="col"
              :hint="$t('compliance.views.ComplianceView.d55afb')" />
          </div>
          <q-input v-model="levelForm.description" :label="$t('compliance.views.ComplianceView.55f8eb')" outlined dense autogrow />

          <div class="row q-gutter-sm items-center">
            <div class="col-3">
              <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.views.ComplianceView.1d0c83') }}</div>
              <div class="row items-center q-gutter-xs">
                <div :style="`width:32px;height:32px;border-radius:6px;background:${levelForm.color};border:1px solid #ccc`" />
                <q-input v-model="levelForm.color" outlined dense style="max-width:110px" placeholder="#2563EB" />
              </div>
            </div>
            <q-select v-model="levelForm.applies_to_enrollment"
              :options="[{label:'All devices',value:'all'},{label:'Corporate',value:'corporate'},{label:'BYOD',value:'byod'},{label:'COPE',value:'cope'}]"
              :label="$t('compliance.views.ComplianceView.0c9d31')" outlined dense emit-value map-options class="col" />
          </div>

          <div class="row q-gutter-sm">
            <q-input v-model.number="levelForm.stale_after_minutes" :label="$t('compliance.views.ComplianceView.08e908')" type="number" outlined dense class="col"
              :hint="$t('compliance.views.ComplianceView.16e785')" />
            <q-input v-model.number="levelForm.grace_period_minutes" :label="$t('compliance.views.ComplianceView.f6e7c8')" type="number" outlined dense class="col"
              :hint="$t('compliance.views.ComplianceView.aab1c3')" />
          </div>

          <div class="text-caption text-grey q-mb-xs q-mt-sm">{{ $t('compliance.views.ComplianceView.11d0f3') }}</div>
          <div class="row q-gutter-sm wrap">
            <q-toggle v-model="levelForm.notify_user" :label="$t('compliance.views.ComplianceView.50b68f')" dense color="warning" />
            <q-toggle v-model="levelForm.notify_admin" :label="$t('compliance.views.ComplianceView.657007')" dense color="warning" />
            <q-toggle v-model="levelForm.block_access" :label="$t('compliance.views.ComplianceView.23503f')" dense color="negative" />
            <q-toggle v-model="levelForm.lock_device_action" :label="$t('compliance.views.ComplianceView.fca06d')" dense color="negative" />
            <q-toggle v-model="levelForm.selective_wipe_action" :label="$t('compliance.views.ComplianceView.64a187')" dense color="deep-orange" />
            <q-toggle v-model="levelForm.full_wipe_action" :label="$t('compliance.views.ComplianceView.5ec4c0')" dense color="negative" />
          </div>

          <q-toggle v-model="levelForm.is_active" :label="$t('compliance.views.ComplianceView.22c731')" dense color="positive" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat :label="$t('compliance.views.ComplianceView.77dfd2')" @click="levelDialogOpen = false" />
          <q-btn color="primary"
            :label="editingLevel ? 'Save Changes' : 'Create Level'"
            :loading="savingLevel"
            @click="saveLevel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Record Compliance Check Dialog -->
    <q-dialog v-model="createCheckDialogOpen" persistent>
      <q-card style="min-width: 460px">
        <q-bar>
          <span>{{ $t('compliance.views.ComplianceView.3fac3f') }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="createCheckForm.agent_id"
            :options="agentOptions"
            option-label="hostname"
            option-value="agent_id"
            emit-value
            map-options
            :label="$t('compliance.views.ComplianceView.e49c96')"
            outlined dense use-input input-debounce="0"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.hostname }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.agent_id }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item><q-item-section class="text-grey text-caption">{{ $t('compliance.views.ComplianceView.aa7297') }}</q-item-section></q-item>
            </template>
          </q-select>
          <q-select
            v-model="createCheckForm.check_type"
            :options="checkTypeOptions"
            :label="$t('compliance.views.ComplianceView.ae23a5')"
            outlined dense emit-value map-options
          />
          <q-select
            v-model="createCheckForm.status"
            :options="statusOptions"
            :label="$t('compliance.views.ComplianceView.bae7d5')"
            outlined dense emit-value map-options
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('compliance.views.ComplianceView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="$t('compliance.views.ComplianceView.1c5413')" @click="submitCreateCheck" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Policy Dialog -->
    <q-dialog v-model="policyDialogOpen" persistent>
      <q-card style="min-width: 440px">
        <q-bar>
          <span>{{ policyDialogTitle }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="policyForm.scope"
            :options="scopeOptions"
            :label="$t('compliance.views.ComplianceView.4651a3')" outlined dense emit-value map-options
            @update:model-value="handlePolicyScopeChange"
          />
          <template v-if="currentPolicyType === 'lockout'">
            <q-input v-model.number="policyForm.max_failed_logins" :label="$t('compliance.views.ComplianceView.c0805e')" outlined dense type="number" min="1" />
            <q-input v-model.number="policyForm.lockout_duration_minutes" :label="$t('compliance.views.ComplianceView.656ead')" outlined dense type="number" min="0" />
          </template>
          <template v-else-if="currentPolicyType === 'wipe'">
            <q-input v-model.number="policyForm.max_failed_logins_before_wipe" :label="$t('compliance.views.ComplianceView.f44a99')" outlined dense type="number" min="1" />
            <q-select
              v-model="policyForm.wipe_type"
              :options="[{label:'Full Wipe',value:'full'},{label:'Selective Wipe',value:'selective'}]"
              :label="$t('compliance.views.ComplianceView.45f344')" outlined dense emit-value map-options
            />
          </template>
          <template v-else-if="currentPolicyType === 'cywm'">
            <q-input v-model.number="policyForm.interval_minutes" :label="$t('compliance.views.ComplianceView.5656d8')" outlined dense type="number" min="1" />
          </template>
          <q-toggle v-model="policyForm.enabled" :label="$t('compliance.views.ComplianceView.df174a')" />
          <q-select
            v-if="policyForm.scope === 'device'"
            v-model="policyForm.target_agent_id"
            :options="agentOptions"
            option-label="hostname"
            option-value="agent_id"
            emit-value
            map-options
            label="Target Device"
            outlined dense clearable use-input
            input-debounce="0"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.hostname }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.agent_id }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item><q-item-section class="text-grey text-caption">{{ $t('compliance.views.ComplianceView.aa7297') }}</q-item-section></q-item>
            </template>
          </q-select>
          <q-select
            v-else-if="policyForm.scope === 'device_group'"
            v-model="policyForm.target_device_group_id"
            :options="deviceGroupOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Target Device Group"
            outlined dense clearable use-input
            input-debounce="0"
          >
            <template v-slot:no-option>
              <q-item><q-item-section class="text-grey text-caption">No device groups found</q-item-section></q-item>
            </template>
          </q-select>
          <template v-else-if="policyForm.scope === 'user' || policyForm.scope === 'user_group'">
            <q-select
              v-model="policyForm.identity_source_scope"
              :options="identitySourceScopeOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Identity source"
              outlined dense
              @update:model-value="handleIdentitySourceChange"
            />
            <q-select
              v-if="policyForm.identity_source_scope === 'device'"
              v-model="policyForm.source_agent_id"
              :options="agentOptions"
              option-label="hostname"
              option-value="agent_id"
              emit-value
              map-options
              label="Source Device"
              outlined dense clearable use-input
              input-debounce="0"
              @update:model-value="handleIdentitySourceChange"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.hostname }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.agent_id }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item><q-item-section class="text-grey text-caption">No devices found</q-item-section></q-item>
              </template>
            </q-select>
            <q-select
              v-else
              v-model="policyForm.source_device_group_id"
              :options="deviceGroupOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Source Device Group"
              outlined dense clearable use-input
              input-debounce="0"
              @update:model-value="handleIdentitySourceChange"
            >
              <template v-slot:no-option>
                <q-item><q-item-section class="text-grey text-caption">No device groups found</q-item-section></q-item>
              </template>
            </q-select>
            <div class="row items-center q-gutter-sm">
              <q-btn
                outline
                color="primary"
                icon="sync"
                :loading="identityTargetLoading"
                :label="policyForm.scope === 'user' ? 'Load users' : 'Load groups'"
                @click="loadIdentityTargetOptions"
              />
              <span class="text-caption text-grey-7">{{ identityTargetNotice }}</span>
            </div>
            <q-select
              v-if="policyForm.scope === 'user'"
              v-model="policyForm.target_user_id"
              :options="userOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Target User"
              outlined dense clearable use-input
              input-debounce="0"
              :loading="identityTargetLoading"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label v-if="scope.opt.caption" caption>{{ scope.opt.caption }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item><q-item-section class="text-grey text-caption">Select a source and load endpoint users</q-item-section></q-item>
              </template>
            </q-select>
            <q-select
              v-else
              v-model="policyForm.target_user_group_id"
              :options="userGroupOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Target User Group"
              outlined dense clearable use-input
              input-debounce="0"
              :loading="identityTargetLoading"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label v-if="scope.opt.caption" caption>{{ scope.opt.caption }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item><q-item-section class="text-grey text-caption">Select a source and load endpoint groups</q-item-section></q-item>
              </template>
            </q-select>
          </template>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('compliance.views.ComplianceView.77dfd2')" v-close-popup />
          <q-btn color="primary" :label="editingPolicy ? 'Save' : 'Create'" @click="savePolicy" :loading="savingPolicy" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import ComplianceOverviewPanel from "@/compliance/components/ComplianceOverviewPanel.vue";
import ComplianceLevelsPanel from "@/compliance/components/ComplianceLevelsPanel.vue";
import ComplianceDevicesPanel from "@/compliance/components/ComplianceDevicesPanel.vue";
import ComplianceViolationsPanel from "@/compliance/components/ComplianceViolationsPanel.vue";
import ComplianceReportsPanel from "@/compliance/components/ComplianceReportsPanel.vue";
import RequirementsEditorDialog from "@/compliance/components/RequirementsEditorDialog.vue";
import RemediationPanel from "@/security/components/RemediationPanel.vue";
// Phase 3-4: New compliance panels
import ComplianceExceptionsPanel from "@/compliance/components/ComplianceExceptionsPanel.vue";
import ComplianceTimelinePanel from "@/compliance/components/ComplianceTimelinePanel.vue";
import WazuhSCAPanel from "@/compliance/components/WazuhSCAPanel.vue";

type ComplianceLevelRequirement = {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  severity: string;
  source_type: string;
  source_key: string;
  inherits_lower_levels?: boolean;
  rule_definition?: Record<string, any>;
};

type ComplianceLevel = {
  id: number;
  rank: number;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  assigned_site_ids: number[];
  requirements: ComplianceLevelRequirement[];
  device_count: number;
  compliant_device_count: number;
  non_compliant_device_count: number;
  pending_device_count: number;
  unknown_device_count: number;
  compliance_rate: number;
  health_status: string;
  last_checked: string | null;
  stale_device_count?: number;
  risk_score?: number;
  critical_violations_count?: number;
  failing_requirements_count?: number;
  top_failing_requirements?: { requirement: string; count: number }[];
  affected_devices?: any[];
};

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const tab = ref("overview");

const summary = ref<Record<string, number>>({});
const checks = ref<any[]>([]);
const lockoutPolicies = ref<any[]>([]);
const wipePolicies = ref<any[]>([]);
const cywmIntervals = ref<any[]>([]);
const complianceLevels = ref<ComplianceLevel[]>([]);
const requirementsMatrix = ref<any[]>([]);
const siteOptions = ref<any[]>([]);
const deviceStatuses = ref<any[]>([]);
const violations = ref<any[]>([]);
const reportSummary = ref<any | null>(null);
const levelDetailOpen = ref(false);
const selectedLevelDetail = ref<any | null>(null);
const deviceDetailOpen = ref(false);
const selectedDeviceDetail = ref<any | null>(null);
const requirementEditorOpen = ref(false);
const requirementEditorLevel = ref<any | null>(null);
const requirementEditorReq = ref<any | null>(null);
const evidenceRowOpen = ref(false);
const selectedEvidenceRow = ref<any | null>(null);
const createCheckDialogOpen = ref(false);
const createCheckForm = ref<any>({ agent_id: null, check_type: "general", status: "pending" });
const agentOptions = ref<{ agent_id: string; hostname: string }[]>([]);
const deviceGroupOptions = ref<{ label: string; value: number }[]>([]);
const userOptions = ref<{ label: string; value: number; caption?: string }[]>([]);
const userGroupOptions = ref<{ label: string; value: number; caption?: string }[]>([]);
const identityTargetLoading = ref(false);
const identityTargetNotice = ref("");
const zeroTrustConfigs = ref<any[]>([]);
const loadingZeroTrust = ref(false);
const ztDialogOpen = ref(false);
const ztEditingConfig = ref<any | null>(null);
const ztForm = ref<any>({ name: "", webhook_url: "", auth_header_name: "Authorization", auth_header_value: "", notify_on_blocked: true, notify_on_quarantined: true, notify_on_grace_period: false, notify_on_compliant: false, enabled: true });

const ztColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "webhook_url", label: "Webhook URL", field: "webhook_url", align: "left", sortable: true },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const loadingChecks = ref(false);
const loadingLockout = ref(false);
const loadingWipe = ref(false);
const loadingCywm = ref(false);
const loadingLevels = ref(false);
const savingLevels = ref(false);
const loadingDeviceStatuses = ref(false);
const loadingViolations = ref(false);
const loadingReportSummary = ref(false);

const checkFilter = ref({ status: null, check_type: null, agent_id: "" });
const policyDialogOpen = ref(false);
const currentPolicyType = ref("lockout");
const editingPolicy = ref<any | null>(null);
const savingPolicy = ref(false);
const defaultPolicyForm = () => ({
  scope: "global", enabled: true, max_failed_logins: 5, lockout_duration_minutes: 30,
  max_failed_logins_before_wipe: 10, wipe_type: "selective", interval_minutes: 60,
  target_agent_id: "", target_device_group_id: null, target_user_id: null, target_user_group_id: null,
  identity_source_scope: "device", source_agent_id: "", source_device_group_id: null,
});
const policyForm = ref<any>(defaultPolicyForm());

const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Specific Device", value: "device" },
  { label: "Device Group", value: "device_group" },
  { label: "Specific User", value: "user" },
  { label: "User Group", value: "user_group" },
];
const identitySourceScopeOptions = [
  { label: "Source Device", value: "device" },
  { label: "Source Device Group", value: "device_group" },
];
const statusOptions = [
  { label: "Compliant", value: "compliant" },
  { label: "Non-Compliant", value: "non_compliant" },
  { label: "Pending", value: "pending" },
  { label: "Unknown", value: "unknown" },
];
const checkTypeOptions = [
  { label: "Hardware", value: "hardware" },
  { label: "Application", value: "app" },
  { label: "Geolocation", value: "geolocation" },
  { label: "OS Version", value: "os_version" },
  { label: "General", value: "general" },
];

const checkColumns = [
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "left", sortable: true },
  { name: "agent_hostname", label: "Hostname", field: "agent_hostname", align: "left", sortable: true },
  { name: "check_type", label: "Check Type", field: "check_type", align: "left", sortable: true },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "checked_at", label: "Checked At", field: "checked_at", align: "left", sortable: true },
];
const lockoutColumns = [
  { name: "scope", label: "Scope", field: "scope", align: "left", sortable: true },
  { name: "target", label: "Target", field: (row: any) => policyTargetLabel(row), align: "left", sortable: true },
  { name: "max_failed_logins", label: "Max Failures", field: "max_failed_logins", align: "center" },
  { name: "lockout_duration_minutes", label: "Duration (min)", field: "lockout_duration_minutes", align: "center" },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const wipeColumns = [
  { name: "scope", label: "Scope", field: "scope", align: "left", sortable: true },
  { name: "target", label: "Target", field: (row: any) => policyTargetLabel(row), align: "left", sortable: true },
  { name: "max_failed_logins_before_wipe", label: "Max Failures", field: "max_failed_logins_before_wipe", align: "center" },
  { name: "wipe_type", label: "Wipe Type", field: "wipe_type", align: "center" },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const cywmColumns = [
  { name: "scope", label: "Scope", field: "scope", align: "left", sortable: true },
  { name: "target", label: "Target", field: (row: any) => policyTargetLabel(row), align: "left", sortable: true },
  { name: "interval_minutes", label: "Interval (min)", field: "interval_minutes", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const levelDeviceColumns = [
  { name: "hostname", label: "Hostname", field: "hostname", align: "left", sortable: true },
  { name: "site_name", label: "Site", field: "site_name", align: "left", sortable: true },
  { name: "effective_status", label: "Status", field: "effective_status", align: "left", sortable: true },
  { name: "access_state", label: "Access", field: "access_state", align: "left", sortable: true },
  { name: "risk_score", label: "Risk", field: "risk_score", align: "center", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const deviceViolationColumns = [
  { name: "requirement_name", label: "Requirement", field: "requirement_name", align: "left", sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "left", sortable: true },
  { name: "source_key", label: "Signal", field: "source_key", align: "left", sortable: true },
  { name: "last_seen_at", label: "Last Seen", field: "last_seen_at", align: "left", sortable: true },
];

const requirementResultColumns = [
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "name", label: "Requirement", field: "name", align: "left", sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "left", sortable: true },
  { name: "source_key", label: "Signal", field: "source_key", align: "left", sortable: true },
  { name: "evidence", label: "Evidence", field: "evidence", align: "center" },
];

const nonCompliantChecks = computed(() =>
  checks.value.filter((c) => c.status === "non_compliant").slice(0, 10)
);

const policyDialogTitle = computed(() => {
  const names: Record<string, string> = { lockout: "Lockout Policy", wipe: "Wipe Policy", cywm: "CYWM Interval" };
  return `${editingPolicy.value ? "Edit" : "New"} ${names[currentPolicyType.value]}`;
});

function statusLabel(s: string) {
  return { compliant: "Compliant", non_compliant: "Non-Compliant", pending: "Pending", unknown: "Unknown" }[s] ?? s;
}

function extractErrorMessage(error: any) {
  const data = error?.response?.data;
  if (!data) return "Request failed";
  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;
  const firstValue = Array.isArray(data) ? data[0] : Object.values(data)[0];
  if (Array.isArray(firstValue)) return String(firstValue[0]);
  if (typeof firstValue === "string") return firstValue;
  return "Request failed";
}

function optionLabel(options: Array<{ label: string; value: any }>, value: any) {
  if (value === null || value === undefined || value === "") return "";
  const found = options.find((item) => String(item.value) === String(value));
  return found?.label || String(value);
}

function mergeOptions<T extends { value: any }>(current: T[], incoming: T[]) {
  const byValue = new Map(current.map((item) => [String(item.value), item]));
  incoming.forEach((item) => byValue.set(String(item.value), item));
  return Array.from(byValue.values()).sort((a: any, b: any) =>
    String(a.label || "").localeCompare(String(b.label || ""))
  );
}

function policyTargetLabel(policy: any) {
  if (!policy || policy.scope === "global") return "All";
  if (policy.scope === "device") {
    return agentOptions.value.find((a) => a.agent_id === policy.target_agent_id)?.hostname || policy.target_agent_id || "-";
  }
  if (policy.scope === "device_group") {
    return optionLabel(deviceGroupOptions.value, policy.target_device_group_id) || "-";
  }
  if (policy.scope === "user") {
    return optionLabel(userOptions.value, policy.target_user_id) || "-";
  }
  if (policy.scope === "user_group") {
    return optionLabel(userGroupOptions.value, policy.target_user_group_id) || "-";
  }
  return "-";
}

function resetPolicyTargetsForScope(scope: string) {
  if (scope !== "device") policyForm.value.target_agent_id = "";
  if (scope !== "device_group") policyForm.value.target_device_group_id = null;
  if (scope !== "user") policyForm.value.target_user_id = null;
  if (scope !== "user_group") policyForm.value.target_user_group_id = null;
  if (scope !== "user" && scope !== "user_group") {
    policyForm.value.identity_source_scope = "device";
    policyForm.value.source_agent_id = "";
    policyForm.value.source_device_group_id = null;
    identityTargetNotice.value = "";
  }
}

function handlePolicyScopeChange(scope: string) {
  resetPolicyTargetsForScope(scope);
}

function handleIdentitySourceChange() {
  if (policyForm.value.scope === "user") policyForm.value.target_user_id = null;
  if (policyForm.value.scope === "user_group") policyForm.value.target_user_group_id = null;
  identityTargetNotice.value = "Load endpoint identities from the selected source.";
}

function normalizedPolicyPayload() {
  const payload = { ...policyForm.value };
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  if (payload.scope !== "user") payload.target_user_id = null;
  if (payload.scope !== "user_group") payload.target_user_group_id = null;
  delete payload.identity_source_scope;
  delete payload.source_agent_id;
  delete payload.source_device_group_id;
  return payload;
}

function missingTargetMessage(payload: any) {
  if (payload.scope === "device" && !payload.target_agent_id) return "Please select a target device";
  if (payload.scope === "device_group" && !payload.target_device_group_id) return "Please select a target device group";
  if (payload.scope === "user" && !payload.target_user_id) return "Please select a target user";
  if (payload.scope === "user_group" && !payload.target_user_group_id) return "Please select a target user group";
  return "";
}

async function loadSummary() {
  try {
    summary.value = (await axios.get("/compliance/checks/summary/")).data;
  } catch (error: any) {
    summary.value = {};
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
}
async function loadChecks() {
  loadingChecks.value = true;
  try {
    const params: any = {};
    if (checkFilter.value.status) params.status = checkFilter.value.status;
    if (checkFilter.value.check_type) params.check_type = checkFilter.value.check_type;
    if (checkFilter.value.agent_id) params.agent_id = checkFilter.value.agent_id;
    checks.value = (await axios.get("/compliance/checks/", { params })).data;
  } finally { loadingChecks.value = false; }
}
async function loadLockout() {
  loadingLockout.value = true;
  try { lockoutPolicies.value = (await axios.get("/compliance/lockout/")).data; }
  finally { loadingLockout.value = false; }
}
async function loadWipe() {
  loadingWipe.value = true;
  try { wipePolicies.value = (await axios.get("/compliance/wipe-policy/")).data; }
  finally { loadingWipe.value = false; }
}
async function loadCywm() {
  loadingCywm.value = true;
  try { cywmIntervals.value = (await axios.get("/compliance/cywm-interval/")).data; }
  finally { loadingCywm.value = false; }
}
async function loadSites() {
  try {
    siteOptions.value = (await axios.get("/clients/sites/")).data;
  } catch (error: any) {
    siteOptions.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
}
async function loadLevels() {
  loadingLevels.value = true;
  try {
    const data = (await axios.get("/compliance/levels/summary/")).data;
    complianceLevels.value = data.levels ?? [];
    requirementsMatrix.value = data.requirements_matrix ?? [];
    violations.value = data.open_violations ?? violations.value;
  } catch (error: any) {
    complianceLevels.value = [];
    requirementsMatrix.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    loadingLevels.value = false;
  }
}
async function loadDeviceStatuses() {
  loadingDeviceStatuses.value = true;
  try {
    deviceStatuses.value = (await axios.get("/compliance/devices/")).data;
  } catch (error: any) {
    deviceStatuses.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    loadingDeviceStatuses.value = false;
  }
}
async function loadViolations() {
  loadingViolations.value = true;
  try {
    violations.value = (await axios.get("/compliance/violations/", { params: { status: "open" } })).data;
  } catch (error: any) {
    violations.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    loadingViolations.value = false;
  }
}
async function loadReportSummary() {
  loadingReportSummary.value = true;
  try {
    reportSummary.value = (await axios.get("/compliance/reports/summary/")).data;
  } catch (error: any) {
    reportSummary.value = null;
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    loadingReportSummary.value = false;
  }
}

async function openLevelDetail(levelId: number) {
  levelDetailOpen.value = true;
  selectedLevelDetail.value = null;
  try {
    selectedLevelDetail.value = (await axios.get(`/compliance/levels/${levelId}/`)).data;
  } catch (error: any) {
    levelDetailOpen.value = false;
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
}

async function openDeviceDetail(agentId: string) {
  deviceDetailOpen.value = true;
  selectedDeviceDetail.value = null;
  try {
    const [checkResp, reqResp] = await Promise.allSettled([
      axios.get(`/compliance/check/${agentId}/`),
      axios.get(`/compliance/device-requirements/${agentId}/`),
    ]);
    const checkData = checkResp.status === "fulfilled" ? checkResp.value.data : {};
    const reqData = reqResp.status === "fulfilled" ? reqResp.value.data : {};
    selectedDeviceDetail.value = {
      ...checkData,
      ...checkData.device_status,
      requirement_results: reqData.requirement_results ?? [],
    };
  } catch (error: any) {
    deviceDetailOpen.value = false;
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
}

function showPolicyDialog(type: string, policy?: any) {
  currentPolicyType.value = type;
  editingPolicy.value = policy || null;
  policyForm.value = policy
    ? { ...defaultPolicyForm(), ...policy }
    : defaultPolicyForm();
  policyDialogOpen.value = true;
}

function showCreateCheckDialog() {
  createCheckDialogOpen.value = true;
  createCheckForm.value = { agent_id: null, check_type: "general", status: "pending" };
}

async function submitCreateCheck() {
  if (!createCheckForm.value.agent_id) {
    $q.notify({ message: "Please select a device", color: "warning" });
    return;
  }
  try {
    await axios.post("/compliance/checks/", {
      agent_id: createCheckForm.value.agent_id,
      check_type: createCheckForm.value.check_type,
      status: createCheckForm.value.status,
    });
    createCheckDialogOpen.value = false;
    await loadChecks();
    $q.notify({ message: "Check recorded", color: "positive", icon: "check" });
  } catch (err: any) {
    $q.notify({ message: extractErrorMessage(err), color: "negative" });
  }
}

async function savePolicy() {
  const payload = normalizedPolicyPayload();
  const targetError = missingTargetMessage(payload);
  if (targetError) {
    $q.notify({ message: targetError, color: "warning", icon: "warning" });
    return;
  }
  savingPolicy.value = true;
  const urls: Record<string, string> = { lockout: "/compliance/lockout/", wipe: "/compliance/wipe-policy/", cywm: "/compliance/cywm-interval/" };
  try {
    if (editingPolicy.value) {
      await axios.put(`${urls[currentPolicyType.value]}${editingPolicy.value.id}/`, payload);
    } else {
      await axios.post(urls[currentPolicyType.value], payload);
    }
    policyDialogOpen.value = false;
    $q.notify({ message: "Policy saved", color: "positive", icon: "check" });
    if (currentPolicyType.value === "lockout") await loadLockout();
    else if (currentPolicyType.value === "wipe") await loadWipe();
    else await loadCywm();
  } catch (e: any) {
    $q.notify({ message: "Error saving policy", color: "negative" });
  } finally { savingPolicy.value = false; }
}

async function deletePolicy(type: string, id: number) {
  const urls: Record<string, string> = { lockout: "/compliance/lockout/", wipe: "/compliance/wipe-policy/", cywm: "/compliance/cywm-interval/" };
  $q.dialog({ title: "Delete?", message: "This action cannot be undone.", cancel: true, ok: { color: "negative" } })
    .onOk(async () => {
      await axios.delete(`${urls[type]}${id}/`);
      $q.notify({ message: "Deleted", color: "positive", icon: "check" });
      if (type === "lockout") await loadLockout();
      else if (type === "wipe") await loadWipe();
      else await loadCywm();
    });
}

async function testConnection(interval: any) {
  try {
    await axios.post(`/compliance/cywm-interval/${interval.id}/`);
    $q.notify({ message: "Connection test initiated", color: "info", icon: "wifi_tethering" });
  } catch (error: any) {
    $q.notify({ message: extractErrorMessage(error), color: "negative" });
  }
}

async function loadAgents() {
  try {
    const data = (await axios.get("/agents/?detail=false")).data;
    agentOptions.value = (data || []).map((a: any) => ({
      agent_id: a.agent_id,
      hostname: a.hostname,
    }));
  } catch (error: any) {
    agentOptions.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
}

async function loadPolicyTargetOptions() {
  const [siteResp, userResp, userGroupResp] = await Promise.allSettled([
    axios.get("/clients/sites/?leaf=true"),
    axios.get("/accounts/users/"),
    axios.get("/accounts/user-groups/"),
  ]);

  if (siteResp.status === "fulfilled") {
    const list = Array.isArray(siteResp.value.data) ? siteResp.value.data : siteResp.value.data?.results ?? [];
    deviceGroupOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
      }));
  } else {
    deviceGroupOptions.value = [];
  }

  if (userResp.status === "fulfilled") {
    const list = Array.isArray(userResp.value.data) ? userResp.value.data : userResp.value.data?.results ?? [];
    userOptions.value = list
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        value: user.id,
        label: user.display_name || user.full_name || user.username || user.name || `User #${user.id}`,
        caption: user.sam_account_name ? `Managed identity: ${user.sam_account_name}` : "Managed identity",
      }));
  } else {
    userOptions.value = [];
  }

  if (userGroupResp.status === "fulfilled") {
    const list = Array.isArray(userGroupResp.value.data) ? userGroupResp.value.data : userGroupResp.value.data?.results ?? [];
    userGroupOptions.value = list
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        value: group.id,
        label: group.display_name || group.name || group.sam_account_name || `User group #${group.id}`,
        caption: group.sam_account_name ? `Managed group: ${group.sam_account_name}` : "Managed group",
      }));
  } else {
    userGroupOptions.value = [];
  }
}

async function loadIdentityTargetOptions() {
  if (policyForm.value.scope !== "user" && policyForm.value.scope !== "user_group") return;
  const sourceScope = policyForm.value.identity_source_scope || "device";
  if (sourceScope === "device" && !policyForm.value.source_agent_id) {
    $q.notify({ message: "Select a source device first", color: "warning", icon: "warning" });
    return;
  }
  if (sourceScope === "device_group" && !policyForm.value.source_device_group_id) {
    $q.notify({ message: "Select a source device group first", color: "warning", icon: "warning" });
    return;
  }

  identityTargetLoading.value = true;
  identityTargetNotice.value = "Reading endpoint identities...";
  try {
    const resp = await axios.post("/compliance/identity-targets/", {
      source_scope: sourceScope,
      source_agent_id: policyForm.value.source_agent_id,
      source_device_group_id: policyForm.value.source_device_group_id,
      kind: policyForm.value.scope === "user" ? "users" : "groups",
    });
    const data = resp.data || {};
    const users = (data.users || []).map((item: any) => ({
      value: item.value,
      label: item.label,
      caption: item.sid ? `Endpoint user SID: ${item.sid}` : "Endpoint user",
    }));
    const groups = (data.groups || []).map((item: any) => ({
      value: item.value,
      label: item.label,
      caption: item.sid ? `Endpoint group SID: ${item.sid}` : "Endpoint group",
    }));
    if (users.length) userOptions.value = mergeOptions(userOptions.value, users);
    if (groups.length) userGroupOptions.value = mergeOptions(userGroupOptions.value, groups);
    const count = policyForm.value.scope === "user" ? users.length : groups.length;
    const suffix = data.truncated ? ` from latest ${data.source_limit} agents` : "";
    identityTargetNotice.value = `Loaded ${count} ${policyForm.value.scope === "user" ? "users" : "groups"}${suffix}.`;
    if (Array.isArray(data.errors) && data.errors.length) {
      $q.notify({ message: data.errors[0], color: "warning", icon: "warning" });
    }
  } catch (error: any) {
    identityTargetNotice.value = "";
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    identityTargetLoading.value = false;
  }
}

async function loadZeroTrust() {
  loadingZeroTrust.value = true;
  try {
    zeroTrustConfigs.value = (await axios.get("/compliance/zero-trust/")).data;
  } catch (error: any) {
    zeroTrustConfigs.value = [];
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  }
  finally { loadingZeroTrust.value = false; }
}

function showZeroTrustDialog(config?: any) {
  ztEditingConfig.value = config || null;
  ztForm.value = config
    ? { ...config }
    : { name: "", webhook_url: "", auth_header_name: "Authorization", auth_header_value: "", notify_on_blocked: true, notify_on_quarantined: true, notify_on_grace_period: false, notify_on_compliant: false, enabled: true };
  ztDialogOpen.value = true;
}

async function saveZeroTrustConfig() {
  try {
    if (ztEditingConfig.value) {
      await axios.patch(`/compliance/zero-trust/${ztEditingConfig.value.id}/`, ztForm.value);
    } else {
      await axios.post("/compliance/zero-trust/", ztForm.value);
    }
    ztDialogOpen.value = false;
    $q.notify({ message: "Webhook configuration saved", color: "positive", icon: "check" });
    await loadZeroTrust();
  } catch (err: any) {
    $q.notify({ message: extractErrorMessage(err), color: "negative" });
  }
}

async function deleteZeroTrustConfig(id: number) {
  await axios.delete(`/compliance/zero-trust/${id}/`);
  $q.notify({ message: "Webhook removed", color: "positive", icon: "check" });
  await loadZeroTrust();
}

async function testZeroTrustWebhook(config: any) {
  try {
    await axios.post(`/compliance/zero-trust/${config.id}/test/`);
    $q.notify({ message: "Test signal sent to webhook", color: "info", icon: "send" });
  } catch (err: any) {
    $q.notify({ message: extractErrorMessage(err), color: "negative" });
  }
}

watch(tab, async (value) => {
  if (route.query.tab !== value) {
    await router.replace({ query: { ...route.query, tab: value } });
  }
});

watch(
  () => route.query.tab,
  (value) => {
    const nextTab = typeof value === "string" && value ? value : "overview";
    if (tab.value !== nextTab) {
      tab.value = nextTab;
    }
  },
  { immediate: true }
);

onMounted(() => {
  tab.value = typeof route.query.tab === "string" && route.query.tab ? route.query.tab : "overview";
  loadSummary();
  loadChecks();
  loadLockout();
  loadWipe();
  loadCywm();
  loadSites();
  loadLevels();
  loadDeviceStatuses();
  loadViolations();
  loadReportSummary();
  loadZeroTrust();
  loadAgents();
  loadPolicyTargetOptions();
});

// ===== Compliance Levels (#532-537) =====
const matrixLevelColumnNames = computed(() => complianceLevels.value.map((level) => `l${level.rank}`));

const matrixColumns = computed(() => [
  { name: "requirement", label: "Requirement", field: "requirement", align: "left" },
  ...complianceLevels.value.map((level) => ({
    name: `l${level.rank}`,
    label: `L${level.rank} ${level.name.replace(/^Level\s*\d+\s*[—-]\s*/i, "")}`,
    field: `l${level.rank}`,
    align: "center",
  })),
]);

async function saveLevelAssignments() {
  savingLevels.value = true;
  try {
    const payload = {
      levels: complianceLevels.value.map((level) => ({
        id: level.id,
        assigned_site_ids: level.assigned_site_ids ?? [],
      })),
    };
    const data = (await axios.post("/compliance/levels/assign/", payload)).data;
    complianceLevels.value = data.levels ?? complianceLevels.value;
    requirementsMatrix.value = data.requirements_matrix ?? requirementsMatrix.value;
    await Promise.all([loadDeviceStatuses(), loadViolations(), loadReportSummary()]);
    $q.notify({ message: "Compliance level assignments saved", color: "positive", icon: "check" });
  } catch (error: any) {
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    savingLevels.value = false;
  }
}

// ── Compliance Level CRUD ──────────────────────────────────────────────────

const levelDialogOpen = ref(false);
const editingLevel = ref<any | null>(null);
const savingLevel = ref(false);

const defaultLevelForm = () => ({
  rank: (complianceLevels.value.length + 1),
  name: "",
  description: "",
  color: "#2563EB",
  is_active: true,
  platform: "windows",
  applies_to_enrollment: "all",
  stale_after_minutes: 1440,
  grace_period_minutes: 240,
  notify_user: true,
  notify_admin: true,
  block_access: false,
  lock_device_action: false,
  selective_wipe_action: false,
  full_wipe_action: false,
});

const levelForm = ref(defaultLevelForm());

function openCreateLevel() {
  editingLevel.value = null;
  levelForm.value = defaultLevelForm();
  levelDialogOpen.value = true;
}

function openEditLevel(level: any) {
  editingLevel.value = level;
  levelForm.value = {
    rank: level.rank,
    name: level.name,
    description: level.description ?? "",
    color: level.color ?? "#2563EB",
    is_active: level.is_active ?? true,
    platform: level.platform ?? "windows",
    applies_to_enrollment: level.applies_to_enrollment ?? "all",
    stale_after_minutes: level.stale_after_minutes ?? 1440,
    grace_period_minutes: level.grace_period_minutes ?? 240,
    notify_user: level.notify_user ?? true,
    notify_admin: level.notify_admin ?? true,
    block_access: level.block_access ?? false,
    lock_device_action: level.lock_device_action ?? false,
    selective_wipe_action: level.selective_wipe_action ?? false,
    full_wipe_action: level.full_wipe_action ?? false,
  };
  levelDialogOpen.value = true;
}

async function saveLevel() {
  if (!levelForm.value.name.trim()) {
    $q.notify({ message: "Level name is required", color: "warning" });
    return;
  }
  savingLevel.value = true;
  try {
    if (editingLevel.value) {
      await axios.put(`/compliance/levels/${editingLevel.value.id}/`, levelForm.value);
      $q.notify({ message: `Level "${levelForm.value.name}" updated`, color: "positive", icon: "check" });
    } else {
      await axios.post("/compliance/levels/", levelForm.value);
      $q.notify({ message: `Level "${levelForm.value.name}" created`, color: "positive", icon: "add" });
    }
    levelDialogOpen.value = false;
    await loadLevels();
  } catch (error: any) {
    $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
  } finally {
    savingLevel.value = false;
  }
}

function confirmDeleteLevel(level: any) {
  $q.dialog({
    title: `Delete "${level.name}"?`,
    message: `This will permanently delete the compliance level and all its requirements. Devices assigned to this level will lose their compliance status.`,
    cancel: { label: "Cancel", flat: true },
    ok: { label: "Delete", color: "negative" },
    persistent: true,
  }).onOk(async () => {
    try {
      await axios.delete(`/compliance/levels/${level.id}/`);
      $q.notify({ message: `Level "${level.name}" deleted`, color: "positive", icon: "delete" });
      await loadLevels();
    } catch (error: any) {
      $q.notify({ message: extractErrorMessage(error), color: "negative", icon: "error" });
    }
  });
}
</script>
