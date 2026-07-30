<template>
  <q-page class="compliance-center q-pa-md">
    <div class="cc-topbar">
      <div>
        <div class="text-h5 text-weight-bold">Compliance Center</div>
        <div class="text-caption text-grey-7">
          Risk, policy evidence, Cyber Secure posture, remediation and access decisions.
        </div>
      </div>
      <div class="cc-actions">
        <q-input
          v-model="search"
          dense
          outlined
          clearable
          debounce="250"
          class="cc-search"
          label="Search devices, rules, users"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-model="statusFilter"
          dense
          outlined
          clearable
          emit-value
          map-options
          :options="statusOptions"
          label="Status"
          class="cc-filter"
        />
        <q-btn
          color="primary"
          icon="refresh"
          label="Refresh"
          :loading="loading"
          @click="refreshComplianceCenter"
        />
        <q-btn
          outline
          color="primary"
          icon="fact_check"
          label="Run Scoped Check"
          @click="openScopeCheckDialog()"
        />
        <q-btn flat icon="rule" label="Legacy" @click="$router.push({ name: 'Compliance' })" />
      </div>
    </div>

    <div class="cc-kpi-grid q-mt-md">
      <section class="cc-kpi cc-score">
        <div class="cc-kpi-title">Compliance Score</div>
        <div class="row items-center no-wrap q-gutter-md">
          <q-circular-progress
            show-value
            :value="complianceScore"
            size="86px"
            :thickness="0.18"
            :color="scoreColor"
            track-color="grey-3"
          >
            <span class="text-subtitle1 text-weight-bold">{{ complianceScore }}%</span>
          </q-circular-progress>
          <div class="col">
            <div class="text-caption text-grey-7">Fleet state</div>
            <div class="text-subtitle2">
              {{
                t("complianceCenter.devicesCompliant", {
                  compliant: compliantDevices,
                  total: totalDevices,
                })
              }}
            </div>
            <q-linear-progress
              class="q-mt-sm"
              rounded
              size="8px"
              :value="complianceScore / 100"
              :color="scoreColor"
            />
          </div>
        </div>
      </section>

      <section v-for="card in kpiCards" :key="card.key" class="cc-kpi">
        <div class="row items-start justify-between no-wrap">
          <div>
            <div class="cc-kpi-title">{{ card.label }}</div>
            <div class="cc-kpi-value">{{ card.value }}</div>
          </div>
          <q-icon :name="card.icon" :color="card.color" size="28px" />
        </div>
        <div class="cc-kpi-caption">{{ card.caption }}</div>
      </section>
    </div>

    <div class="cc-source-strip q-mt-md">
      <div v-for="source in sourceHealth" :key="source.key" class="cc-source">
        <div class="row items-center no-wrap q-gutter-sm">
          <q-icon :name="source.icon" :color="source.color" size="20px" />
          <div class="text-weight-medium">{{ source.label }}</div>
          <q-space />
          <q-chip dense :color="source.color" text-color="white">{{ source.state }}</q-chip>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">{{ source.caption }}</div>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      outside-arrows
      mobile-arrows
      align="left"
      class="cc-tabs q-mt-md"
    >
      <q-tab v-for="item in tabs" :key="item.name" :name="item.name" :label="item.label" :icon="item.icon" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="cc-panels">
      <q-tab-panel name="cockpit">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-xl-5">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">Fleet Status</div>
                  <div class="text-caption text-grey-7">Effective policy result after stale-data checks.</div>
                </div>
              </div>
              <div class="cc-status-stack q-mt-sm">
                <div v-for="item in statusBreakdown" :key="item.status" class="cc-status-row">
                  <div class="row items-center no-wrap q-gutter-sm">
                    <q-icon :name="item.icon" :color="item.color" size="18px" />
                    <div class="cc-status-label">{{ item.label }}</div>
                    <q-space />
                    <div class="text-weight-bold">{{ item.count }}</div>
                  </div>
                  <q-linear-progress rounded size="7px" :value="item.percent / 100" :color="item.color" />
                </div>
              </div>
            </section>
          </div>

          <div class="col-12 col-xl-7">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">Risk Heatmap</div>
                  <div class="text-caption text-grey-7">Grouped by site/profile with dominant failure reason.</div>
                </div>
              </div>
              <q-table
                flat
                dense
                row-key="key"
                :rows="riskHeatmap"
                :columns="heatmapColumns"
                :rows-per-page-options="[6, 12]"
              >
                <template #body-cell-risk="props">
                  <q-td :props="props">
                    <q-chip dense :color="riskColor(props.row.risk)" text-color="white">
                      {{ t(props.row.risk) }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>

          <div class="col-12 col-lg-6">
            <section class="cc-panel">
              <div class="cc-panel-title">Top Violations</div>
              <q-list separator dense class="q-mt-sm">
                <q-item v-for="item in topViolations" :key="item.requirement">
                  <q-item-section>
                    <q-item-label>{{ item.requirement }}</q-item-label>
                    <q-item-label caption>{{ item.count }} affected devices</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="negative">{{ item.count }}</q-badge>
                  </q-item-section>
                </q-item>
                <q-item v-if="topViolations.length === 0">
                  <q-item-section class="text-grey-7">No open compliance violations in the current dataset.</q-item-section>
                </q-item>
              </q-list>
            </section>
          </div>

          <div class="col-12 col-lg-6">
            <section class="cc-panel">
              <div class="cc-panel-title">Critical Events</div>
              <q-list separator dense class="q-mt-sm">
                <q-item v-for="event in criticalEvents" :key="event.id || `${event.agent_id}-${event.source_key}`">
                  <q-item-section avatar>
                    <q-icon :name="eventIcon(event)" :color="severityColor(event.severity)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ event.requirement_name || event.source_key || event.source_type }}</q-item-label>
                    <q-item-label caption>{{ event.agent_hostname || event.agent_id }} | {{ formatDate(event.last_seen_at || event.first_seen_at) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip dense :color="severityColor(event.severity)" text-color="white">{{ event.severity || "open" }}</q-chip>
                  </q-item-section>
                </q-item>
                <q-item v-if="criticalEvents.length === 0">
                  <q-item-section class="text-grey-7">No critical open events.</q-item-section>
                </q-item>
              </q-list>
            </section>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="matrix">
        <section class="cc-panel">
          <div class="cc-panel-head">
            <div>
              <div class="cc-panel-title">Compliance Matrix</div>
              <div class="text-caption text-grey-7">Device status across MDM, Cyber Secure, BitLocker, Defender, Firewall, DLP and Workspace signals.</div>
            </div>
            <q-btn color="primary" icon="published_with_changes" label="Run SCA Sync" :loading="syncingSca" @click="syncCyberSecure" />
          </div>
          <q-table
            flat
            dense
            row-key="agent_id"
            :rows="filteredMatrixRows"
            :columns="matrixColumns"
            :loading="loading"
            :rows-per-page-options="[10, 25, 50, 100]"
          >
            <template #body-cell-hostname="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.hostname }}</div>
                <div class="text-caption text-grey-7">{{ props.row.agent_id }}</div>
              </q-td>
            </template>
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="statusColor(props.row.status)" text-color="white">
                  {{ statusLabel(props.row.status) }}
                </q-chip>
              </q-td>
            </template>
            <template
              v-for="column in signalColumnNames"
              :key="column"
              #[`body-cell-${column}`]="props"
            >
              <q-td :props="props">
                <q-icon :name="signalIcon(props.row[column])" :color="signalColor(props.row[column])" size="20px">
                  <q-tooltip>{{ signalTooltip(props.row[column]) }}</q-tooltip>
                </q-icon>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="fact_check" color="primary" @click="recheckDevice(props.row.agent_id)">
                  <q-tooltip>Recheck now</q-tooltip>
                </q-btn>
                <q-btn flat dense round icon="travel_explore" color="teal" @click="openEffectivePolicy(props.row.agent_id)">
                  <q-tooltip>Effective policy</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </section>
      </q-tab-panel>

      <q-tab-panel name="policies">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">Scoped Compliance Policies</div>
                  <div class="text-caption text-grey-7">Assign compliance level and enforcement actions to a device, device group, user group, user or the whole fleet.</div>
                </div>
                <div class="row q-gutter-sm">
                  <q-select
                    v-model="policyCheckType"
                    dense
                    outlined
                    emit-value
                    map-options
                    :options="policyCheckTypeOptions"
                    style="min-width: 210px"
                  />
                  <q-btn color="primary" icon="add" label="Create Policy" @click="openCompliancePolicyDialog()" />
                </div>
              </div>

              <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-12 col-md-5 col-lg-4">
                  <q-select
                    v-model="policyPreviewAgentId"
                    dense
                    outlined
                    clearable
                    emit-value
                    map-options
                    label="Agent ID for effective preview"
                    :options="scopeAgentOptions"
                  />
                </div>
                <div class="col-12 col-md-auto">
                  <q-btn
                    outline
                    color="teal"
                    icon="travel_explore"
                    label="Preview Effective Policy"
                    :disable="!policyPreviewAgentId"
                    @click="openEffectivePolicy(policyPreviewAgentId)"
                  />
                </div>
              </div>

              <q-table
                flat
                dense
                row-key="id"
                :rows="scopedPolicies"
                :columns="scopedPolicyColumns"
                :loading="loading"
                :rows-per-page-options="[10, 20, 50]"
              >
                <template #body-cell-scope="props">
                  <q-td :props="props">
                    <q-chip dense color="blue-grey-1" text-color="blue-grey-10">{{ complianceScopeLabel(props.row.scope) }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-target="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">{{ complianceTargetLabel(props.row) }}</div>
                    <div class="text-caption text-grey-7">{{ props.row.effective_agent_count || 0 }} matching devices</div>
                  </q-td>
                </template>
                <template #body-cell-level="props">
                  <q-td :props="props">
                    <q-chip dense :color="compliancePolicyLevelColor(props.row.level)" text-color="white">
                      {{ compliancePolicyLevelLabel(props.row.level) }}
                    </q-chip>
                  </q-td>
                </template>
                <template #body-cell-os_family="props">
                  <q-td :props="props">{{ osFamilyLabel(props.row.os_family) }}</q-td>
                </template>
                <template #body-cell-actions_state="props">
                  <q-td :props="props">
                    <div class="q-gutter-xs">
                      <q-chip dense :color="props.row.action_notify_admin ? 'positive' : 'grey-3'" :text-color="props.row.action_notify_admin ? 'white' : 'grey-8'">Notify</q-chip>
                      <q-chip dense :color="props.row.action_block_access ? 'negative' : 'grey-3'" :text-color="props.row.action_block_access ? 'white' : 'grey-8'">Block</q-chip>
                      <q-chip dense :color="props.row.action_wipe_device ? 'deep-orange' : 'grey-3'" :text-color="props.row.action_wipe_device ? 'white' : 'grey-8'">Wipe</q-chip>
                      <q-chip dense :color="props.row.auto_remediate ? 'teal' : 'grey-3'" :text-color="props.row.auto_remediate ? 'white' : 'grey-8'">Auto</q-chip>
                    </div>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      round
                      icon="published_with_changes"
                      color="primary"
                      :loading="applyingCompliancePolicyId === props.row.id"
                      @click="applyCompliancePolicy(props.row)"
                    >
                      <q-tooltip>Apply policy and recheck matching agents</q-tooltip>
                    </q-btn>
                    <q-btn flat dense round icon="edit" color="grey-8" @click="openCompliancePolicyDialog(props.row)">
                      <q-tooltip>Edit policy</q-tooltip>
                    </q-btn>
                    <q-btn flat dense round icon="delete" color="negative" @click="deleteCompliancePolicy(props.row)">
                      <q-tooltip>Delete policy</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>

          <div class="col-12 col-xl-5">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">Custom Rule Sets</div>
                  <div class="text-caption text-grey-7">Profiles that decide device status, risk and workspace access.</div>
                </div>
                <q-btn color="primary" icon="add" label="Create Rule Set" @click="openRuleSetDialog()" />
              </div>
              <q-list separator dense>
                <q-item
                  v-for="level in complianceLevels"
                  :key="level.id"
                  clickable
                  :active="selectedRuleSetId === level.id"
                  active-class="cc-active-item"
                  @click="selectedRuleSetId = level.id"
                >
                  <q-item-section avatar>
                    <q-icon name="rule" :style="{ color: level.color || '#2563eb' }" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ level.name }}</q-item-label>
                    <q-item-label caption>{{ level.description || "No description" }}</q-item-label>
                    <div class="q-gutter-xs q-mt-xs">
                      <q-chip dense color="grey-2" text-color="grey-9">{{ level.requirements?.length || 0 }} rules</q-chip>
                      <q-chip dense color="grey-2" text-color="grey-9">{{ level.applies_to_enrollment || "all" }}</q-chip>
                      <q-chip dense :color="level.block_access ? 'negative' : 'grey-2'" :text-color="level.block_access ? 'white' : 'grey-9'">
                        {{ level.block_access ? "blocks access" : "monitor only" }}
                      </q-chip>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <div class="row no-wrap q-gutter-xs">
                      <q-btn flat dense round icon="add_task" color="primary" @click.stop="openRuleDialog(null, level)">
                        <q-tooltip>Add rule</q-tooltip>
                      </q-btn>
                      <q-btn flat dense round icon="edit" color="grey-8" @click.stop="openRuleSetDialog(level)">
                        <q-tooltip>Edit rule set</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item v-if="complianceLevels.length === 0">
                  <q-item-section class="text-grey-7">No custom rule sets yet.</q-item-section>
                </q-item>
              </q-list>
            </section>
          </div>

          <div class="col-12 col-xl-7">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">Rules in Selected Set</div>
                  <div class="text-caption text-grey-7">{{ selectedRuleSet?.name || "Select or create a rule set" }}</div>
                </div>
                <q-btn
                  color="primary"
                  icon="add_task"
                  label="Add Rule"
                  :disable="!selectedRuleSet"
                  @click="openRuleDialog(null, selectedRuleSet)"
                />
              </div>
              <q-table
                flat
                dense
                row-key="id"
                :rows="selectedRules"
                :columns="customRuleColumns"
                :rows-per-page-options="[10, 20]"
              >
                <template #body-cell-name="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-7">{{ ruleConditionLabel(props.row) }}</div>
                  </q-td>
                </template>
                <template #body-cell-severity="props">
                  <q-td :props="props">
                    <q-chip dense :color="severityColor(props.value)" text-color="white">{{ props.value }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-source_type="props">
                  <q-td :props="props">
                    <q-chip dense color="blue-grey-1" text-color="blue-grey-10">{{ sourceTypeLabel(props.value) }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn flat dense round icon="edit" color="primary" @click="openRuleDialog(props.row, selectedRuleSet)">
                      <q-tooltip>Edit rule</q-tooltip>
                    </q-btn>
                    <q-btn flat dense round icon="delete" color="negative" @click="deleteRule(props.row)">
                      <q-tooltip>Delete rule</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>

          <div class="col-12">
            <section class="cc-panel">
              <div class="cc-panel-title">Rule Templates</div>
              <q-table
                flat
                dense
                row-key="id"
                :rows="ruleCatalog"
                :columns="ruleColumns"
                :rows-per-page-options="[7, 14]"
              >
                <template #body-cell-severity="props">
                  <q-td :props="props">
                    <q-chip dense :color="severityColor(props.value)" text-color="white">{{ props.value }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-source="props">
                  <q-td :props="props">
                    <q-chip dense color="blue-grey-1" text-color="blue-grey-10">{{ props.value }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn flat dense round icon="add" color="primary" :disable="!selectedRuleSet" @click="createRuleFromTemplate(props.row)">
                      <q-tooltip>Add to selected set</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="incidents">
        <section class="cc-panel">
          <div class="cc-panel-head">
            <div>
              <div class="cc-panel-title">Incidents and Violations</div>
              <div class="text-caption text-grey-7">Evidence-backed failures with acknowledgement and exception handoff.</div>
            </div>
          </div>
          <q-table
            flat
            dense
            row-key="id"
            :rows="filteredViolations"
            :columns="violationColumns"
            :loading="loading"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-severity="props">
              <q-td :props="props">
                <q-chip dense :color="severityColor(props.value)" text-color="white">{{ props.value }}</q-chip>
              </q-td>
            </template>
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="violationStatusColor(props.value)" text-color="white">{{ props.value }}</q-chip>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="info" color="grey-8" @click="showEvidence(props.row)">
                  <q-tooltip>Evidence</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="check"
                  color="positive"
                  :disable="props.row.status !== 'open'"
                  @click="acknowledgeViolation(props.row)"
                >
                  <q-tooltip>Acknowledge</q-tooltip>
                </q-btn>
                <q-btn flat dense round icon="shield" color="orange" @click="openExceptionDialog(props.row)">
                  <q-tooltip>Create exception</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="build_circle"
                  color="teal"
                  :loading="remediatingViolationId === props.row.id"
                  :disable="props.row.status !== 'open'"
                  @click="remediateViolation(props.row)"
                >
                  <q-tooltip>Apply effective policy and recheck</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </section>
      </q-tab-panel>

      <q-tab-panel name="remediation">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-xl-7">
            <section class="cc-panel">
              <div class="cc-panel-head">
                <div>
                  <div class="cc-panel-title">One-Click Remediation Queue</div>
                  <div class="text-caption text-grey-7">Active remediation incidents from the existing security workflow engine.</div>
                </div>
                <q-btn flat icon="open_in_new" label="Security workflows" @click="$router.push({ name: 'SecurityCenter' })" />
              </div>
              <q-table
                flat
                dense
                row-key="id"
                :rows="remediationIncidents"
                :columns="remediationIncidentColumns"
                :rows-per-page-options="[10, 25]"
              >
                <template #body-cell-stage="props">
                  <q-td :props="props">
                    <q-chip dense :color="remediationStageColor(props.value)" text-color="white">{{ props.value }}</q-chip>
                  </q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn flat dense round icon="done_all" color="positive" @click="resolveRemediation(props.row)">
                      <q-tooltip>Mark resolved</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>
          <div class="col-12 col-xl-5">
            <section class="cc-panel">
              <div class="cc-panel-title">Remediation Playbooks</div>
              <q-list separator dense class="q-mt-sm">
                <q-item v-for="playbook in remediationPlaybooks" :key="playbook.name">
                  <q-item-section avatar>
                    <q-icon :name="playbook.icon" :color="playbook.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ playbook.name }}</q-item-label>
                    <q-item-label caption>{{ playbook.action }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip dense :color="playbook.mode === 'Executable' ? 'positive' : 'warning'" text-color="white">
                      {{ playbook.mode }}
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </section>
          </div>
          <div class="col-12">
            <section class="cc-panel">
              <div class="cc-panel-title">Workflow Registry</div>
              <q-table
                flat
                dense
                row-key="id"
                :rows="remediationWorkflows"
                :columns="workflowColumns"
                :rows-per-page-options="[10, 25]"
              />
            </section>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="exceptions">
        <section class="cc-panel">
          <div class="cc-panel-head">
            <div>
              <div class="cc-panel-title">Exceptions and Temporary Risk Acceptance</div>
              <div class="text-caption text-grey-7">TTL, approver, reason, compensating control and audit trail.</div>
            </div>
          </div>
          <q-table
            flat
            dense
            row-key="id"
            :rows="exceptions"
            :columns="exceptionColumns"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-is_active="props">
              <q-td :props="props">
                <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white">
                  {{ props.value ? "Active" : "Inactive" }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="cancel"
                  color="negative"
                  :disable="!props.row.is_active"
                  @click="revokeException(props.row)"
                >
                  <q-tooltip>Revoke</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </section>
      </q-tab-panel>

      <q-tab-panel name="reports">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-lg-5">
            <section class="cc-panel">
              <div class="cc-panel-title">Reports</div>
              <q-list separator dense class="q-mt-sm">
                <q-item v-for="report in reportTemplates" :key="report.name">
                  <q-item-section avatar>
                    <q-icon :name="report.icon" :color="report.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ report.name }}</q-item-label>
                    <q-item-label caption>{{ report.scope }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat dense round icon="download" @click.stop="downloadReport(report)">
                      <q-tooltip>Export from current summary</q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </section>
          </div>
          <div class="col-12 col-lg-7">
            <section class="cc-panel">
              <div class="cc-panel-title">Audit Freshness</div>
              <q-table
                flat
                dense
                row-key="agent_id"
                :rows="freshnessRows"
                :columns="freshnessColumns"
                :rows-per-page-options="[10, 25]"
              >
                <template #body-cell-freshness="props">
                  <q-td :props="props">
                    <q-chip dense :color="freshnessColor(props.row)" text-color="white">{{ props.value }}</q-chip>
                  </q-td>
                </template>
              </q-table>
            </section>
          </div>
        </div>
      </q-tab-panel>

    </q-tab-panels>

    <q-dialog v-model="scopeCheckDialog">
      <q-card class="cc-dialog cc-wide-dialog">
        <q-bar>
          <span>Run Scoped Compliance Check</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="scopeCheckForm.scope"
                outlined
                emit-value
                map-options
                label="Scope"
                :options="complianceScopeOptions"
                @update:model-value="onScopedTargetScopeChange(scopeCheckForm)"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="scopeCheckForm.check_type"
                outlined
                emit-value
                map-options
                label="Check type"
                :options="policyCheckTypeOptions"
              />
            </div>

            <div v-if="scopeCheckForm.scope === 'device'" class="col-12">
              <q-select
                v-model="scopeCheckForm.target_agent_id"
                outlined
                clearable
                emit-value
                map-options
                label="Specific Device / Agent ID"
                :options="scopeAgentOptions"
              />
            </div>
            <div v-if="scopeCheckForm.scope === 'device_group'" class="col-12">
              <q-select
                v-model="scopeCheckForm.target_device_group_id"
                outlined
                clearable
                emit-value
                map-options
                label="Device Group"
                :options="scopeDeviceGroupOptions"
              />
            </div>
            <div v-if="scopeCheckForm.scope === 'user' || scopeCheckForm.scope === 'user_group'" class="col-12">
              <div class="row q-col-gutter-sm items-end">
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="scopeCheckForm.identity_source_scope"
                    outlined
                    dense
                    emit-value
                    map-options
                    label="Identity source"
                    :options="identitySourceScopeOptions"
                    @update:model-value="onIdentitySourceChange(scopeCheckForm)"
                  />
                </div>
                <div v-if="scopeCheckForm.identity_source_scope === 'device'" class="col-12 col-md-5">
                  <q-select
                    v-model="scopeCheckForm.source_agent_id"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    label="Source Device"
                    :options="scopeAgentOptions"
                    @update:model-value="onIdentitySourceChange(scopeCheckForm)"
                  />
                </div>
                <div v-else class="col-12 col-md-5">
                  <q-select
                    v-model="scopeCheckForm.source_device_group_id"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    label="Source Device Group"
                    :options="scopeDeviceGroupOptions"
                    @update:model-value="onIdentitySourceChange(scopeCheckForm)"
                  />
                </div>
                <div class="col-12 col-md-auto">
                  <q-btn
                    outline
                    color="primary"
                    icon="sync"
                    :loading="identityTargetLoading"
                    :label="scopeCheckForm.scope === 'user' ? 'Load Users' : 'Load Groups'"
                    @click="loadIdentityTargetOptions(scopeCheckForm)"
                  />
                </div>
              </div>
              <div v-if="identityTargetNotice" class="text-caption text-grey-7 q-mt-xs">{{ identityTargetNotice }}</div>
            </div>
            <div v-if="scopeCheckForm.scope === 'user_group'" class="col-12">
              <q-select
                v-model="scopeCheckForm.target_user_group_id"
                outlined
                clearable
                emit-value
                map-options
                label="User Group"
                :options="scopeUserGroupOptions"
              />
            </div>
            <div v-if="scopeCheckForm.scope === 'user'" class="col-12">
              <q-select
                v-model="scopeCheckForm.target_user_id"
                outlined
                clearable
                emit-value
                map-options
                label="Specific User"
                :options="scopeUserOptions"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" icon="fact_check" label="Run Check" :loading="scopeCheckLoading" @click="runScopedCheck" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="compliancePolicyDialog">
      <q-card class="cc-dialog cc-wide-dialog">
        <q-bar>
          <span>{{ editingCompliancePolicy ? "Edit Compliance Policy" : "Create Compliance Policy" }}</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="compliancePolicyForm.scope"
                outlined
                emit-value
                map-options
                label="Scope"
                :options="complianceScopeOptions"
                @update:model-value="onCompliancePolicyScopeChange"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="compliancePolicyForm.level"
                outlined
                emit-value
                map-options
                label="Compliance level"
                :options="compliancePolicyLevelOptions"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="compliancePolicyForm.os_family"
                outlined
                emit-value
                map-options
                label="OS family"
                :options="osFamilyOptions"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="compliancePolicyForm.rule_set"
                outlined
                clearable
                emit-value
                map-options
                label="Rule Set"
                :options="ruleSetOptions"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="compliancePolicyForm.check_type"
                outlined
                emit-value
                map-options
                label="Check type"
                :options="policyCheckTypeOptions"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="compliancePolicyForm.check_interval_minutes"
                outlined
                type="number"
                min="5"
                label="Check interval minutes"
              />
            </div>

            <div v-if="compliancePolicyForm.scope === 'device'" class="col-12">
              <q-select
                v-model="compliancePolicyForm.target_agent_id"
                outlined
                clearable
                emit-value
                map-options
                label="Specific Device / Agent ID"
                :options="scopeAgentOptions"
              />
            </div>
            <div v-if="compliancePolicyForm.scope === 'device_group'" class="col-12">
              <q-select
                v-model="compliancePolicyForm.target_device_group_id"
                outlined
                clearable
                emit-value
                map-options
                label="Device Group"
                :options="scopeDeviceGroupOptions"
              />
            </div>
            <div v-if="compliancePolicyForm.scope === 'user' || compliancePolicyForm.scope === 'user_group'" class="col-12">
              <q-banner rounded class="bg-blue-1 text-blue-10 q-mb-sm">
                <template #avatar><q-icon name="manage_accounts" color="primary" /></template>
                Load endpoint-local users or groups from a device/source group before selecting the target.
              </q-banner>
              <div class="row q-col-gutter-sm items-end">
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="compliancePolicyForm.identity_source_scope"
                    outlined
                    dense
                    emit-value
                    map-options
                    label="Identity source"
                    :options="identitySourceScopeOptions"
                    @update:model-value="onIdentitySourceChange(compliancePolicyForm)"
                  />
                </div>
                <div v-if="compliancePolicyForm.identity_source_scope === 'device'" class="col-12 col-md-5">
                  <q-select
                    v-model="compliancePolicyForm.source_agent_id"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    label="Source Device"
                    :options="scopeAgentOptions"
                    @update:model-value="onIdentitySourceChange(compliancePolicyForm)"
                  />
                </div>
                <div v-else class="col-12 col-md-5">
                  <q-select
                    v-model="compliancePolicyForm.source_device_group_id"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    label="Source Device Group"
                    :options="scopeDeviceGroupOptions"
                    @update:model-value="onIdentitySourceChange(compliancePolicyForm)"
                  />
                </div>
                <div class="col-12 col-md-auto">
                  <q-btn
                    outline
                    color="primary"
                    icon="sync"
                    :loading="identityTargetLoading"
                    :label="compliancePolicyForm.scope === 'user' ? 'Load Users' : 'Load Groups'"
                    @click="loadIdentityTargetOptions(compliancePolicyForm)"
                  />
                </div>
              </div>
              <div v-if="identityTargetNotice" class="text-caption text-grey-7 q-mt-xs">{{ identityTargetNotice }}</div>
            </div>
            <div v-if="compliancePolicyForm.scope === 'user_group'" class="col-12">
              <q-select
                v-model="compliancePolicyForm.target_user_group_id"
                outlined
                clearable
                emit-value
                map-options
                label="User Group"
                :options="scopeUserGroupOptions"
              />
            </div>
            <div v-if="compliancePolicyForm.scope === 'user'" class="col-12">
              <q-select
                v-model="compliancePolicyForm.target_user_id"
                outlined
                clearable
                emit-value
                map-options
                label="Specific User"
                :options="scopeUserOptions"
              />
            </div>

            <div class="col-12">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-4">
                  <q-toggle v-model="compliancePolicyForm.action_notify_admin" color="positive" label="Notify administrator" />
                </div>
                <div class="col-12 col-md-4">
                  <q-toggle v-model="compliancePolicyForm.action_block_access" color="negative" label="Block access on failure" />
                </div>
                <div class="col-12 col-md-4">
                  <q-toggle v-model="compliancePolicyForm.action_wipe_device" color="deep-orange" label="Wipe device on failure" />
                </div>
                <div class="col-12 col-md-4">
                  <q-toggle v-model="compliancePolicyForm.auto_remediate" color="teal" label="Auto remediate on interval" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" icon="save" label="Save Policy" :loading="savingCompliancePolicy" @click="saveCompliancePolicy" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ruleSetDialog">
      <q-card class="cc-dialog">
        <q-bar>
          <span>{{ editingRuleSet ? "Edit Rule Set" : "Create Rule Set" }}</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input v-model.number="ruleSetForm.rank" dense outlined type="number" label="Priority" />
            </div>
            <div class="col-8">
              <q-input v-model="ruleSetForm.name" dense outlined label="Name" />
            </div>
          </div>
          <q-input v-model="ruleSetForm.description" dense outlined type="textarea" rows="2" label="Description" />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model="ruleSetForm.applies_to_enrollment"
                dense
                outlined
                emit-value
                map-options
                :options="enrollmentOptions"
                label="Applies to"
              />
            </div>
            <div class="col-6">
              <q-input v-model="ruleSetForm.color" dense outlined label="Color" />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model.number="ruleSetForm.stale_after_minutes" dense outlined type="number" label="Stale after minutes" />
            </div>
            <div class="col-6">
              <q-input v-model.number="ruleSetForm.grace_period_minutes" dense outlined type="number" label="Grace period minutes" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <q-toggle v-model="ruleSetForm.notify_user" dense label="Notify user" />
            <q-toggle v-model="ruleSetForm.notify_admin" dense label="Notify admin" />
            <q-toggle v-model="ruleSetForm.block_access" dense color="negative" label="Block workspace access" />
            <q-toggle v-model="ruleSetForm.is_active" dense color="positive" label="Active" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" icon="save" label="Save" :loading="savingRuleSet" @click="saveRuleSet" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ruleDialog">
      <q-card class="cc-dialog cc-wide-dialog">
        <q-bar>
          <span>{{ editingRule ? "Edit Compliance Rule" : "Create Compliance Rule" }}</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-7">
              <q-input v-model="ruleForm.name" dense outlined label="Rule name" />
            </div>
            <div class="col-12 col-md-5">
              <q-select
                v-model="ruleForm.mode"
                dense
                outlined
                emit-value
                map-options
                :options="ruleModeOptions"
                label="Rule mode"
                @update:model-value="onRuleModeChange"
              />
            </div>
          </div>
          <q-input v-model="ruleForm.description" dense outlined label="Description" />
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-4">
              <q-input v-model="ruleForm.category" dense outlined label="Category" />
            </div>
            <div class="col-12 col-md-4">
              <q-select v-model="ruleForm.severity" dense outlined emit-value map-options :options="severityOptions" label="Severity" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model.number="ruleForm.sort_order" dense outlined type="number" label="Sort order" />
            </div>
          </div>

          <template v-if="ruleForm.mode === 'field_condition'">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-4">
                <q-select v-model="ruleForm.condition_source" dense outlined emit-value map-options :options="conditionSourceOptions" label="Signal source" />
              </div>
              <div class="col-12 col-md-4" v-if="ruleForm.condition_source !== 'device_health'">
                <q-select v-model="ruleForm.check_type" dense outlined emit-value map-options :options="checkTypeOptions" label="Check type" />
              </div>
              <div class="col-12 col-md-4" v-if="ruleForm.condition_source !== 'device_health'">
                <q-input v-model="ruleForm.feature" dense outlined label="Feature key" />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-4">
                <q-select
                  v-if="ruleForm.condition_source === 'device_health'"
                  v-model="ruleForm.field"
                  dense
                  outlined
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="0"
                  emit-value
                  map-options
                  new-value-mode="add-unique"
                  :options="deviceHealthFieldOptions"
                  label="Field"
                />
                <q-input v-else v-model="ruleForm.field" dense outlined label="Details field / status" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="ruleForm.operator" dense outlined emit-value map-options :options="operatorOptions" label="Operator" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="ruleForm.value_type" dense outlined emit-value map-options :options="valueTypeOptions" label="Value type" />
              </div>
            </div>
            <q-input v-model="ruleForm.expected_value" dense outlined label="Expected value" />
          </template>

          <template v-else-if="ruleForm.mode === 'custom_script'">
            <q-input v-model="ruleForm.source_key" dense outlined label="Script key" />
            <q-input v-model="ruleForm.script_command" dense outlined type="textarea" rows="4" label="PowerShell / cmd command" />
            <div class="row q-col-gutter-sm">
              <div class="col-8">
                <q-input v-model="ruleForm.expected_value" dense outlined label="Expected output" />
              </div>
              <div class="col-4">
                <q-input v-model.number="ruleForm.timeout_seconds" dense outlined type="number" label="Timeout seconds" />
              </div>
            </div>
          </template>

          <template v-else-if="ruleForm.mode === 'app_inventory'">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-select v-model="ruleForm.app_rule_mode" dense outlined emit-value map-options :options="appRuleModeOptions" label="Application rule" />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="ruleForm.app_match" dense outlined emit-value map-options :options="appMatchOptions" label="Match by" />
              </div>
            </div>
            <q-input
              v-model="ruleForm.app_list"
              dense
              outlined
              type="textarea"
              rows="5"
              label="Application names"
            />
          </template>

          <template v-else-if="ruleForm.mode === 'cyber_secure_sca'">
            <q-input v-model="ruleForm.source_key" dense outlined label="Cyber Secure policy ID" />
            <q-input v-model.number="ruleForm.required_pass_rate_percent" dense outlined type="number" min="0" max="100" label="Required pass rate %" />
          </template>

          <template v-else>
            <q-input v-model="ruleForm.source_key" dense outlined label="Manual / external key" />
          </template>

          <q-input v-model="ruleForm.remediation_hint" dense outlined type="textarea" rows="2" label="Remediation hint" />
          <q-toggle v-model="ruleForm.inherits_lower_levels" dense label="Inherit lower level failures" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" icon="save" label="Save Rule" :loading="savingRule" @click="saveRule" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="evidenceDialog">
      <q-card class="cc-dialog">
        <q-bar>
          <span>Compliance Evidence</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section v-if="selectedViolation">
          <div class="text-subtitle2">{{ selectedViolation.requirement_name || selectedViolation.source_key }}</div>
          <div class="text-caption text-grey-7 q-mb-md">{{ selectedViolation.agent_hostname || selectedViolation.agent_id }}</div>
          <div class="cc-json-label">Expected</div>
          <pre>{{ stringify(selectedViolation.expected_value) }}</pre>
          <div class="cc-json-label">Observed</div>
          <pre>{{ stringify(selectedViolation.observed_value) }}</pre>
          <div class="cc-json-label">Evidence</div>
          <pre>{{ stringify(selectedViolation.evidence) }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="exceptionDialog">
      <q-card class="cc-dialog">
        <q-bar>
          <span>Create Exception</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-input v-model="exceptionForm.agent_hostname" dense outlined label="Device" readonly />
          <q-input v-model="exceptionForm.reason" dense outlined type="textarea" rows="3" label="Reason" />
          <q-input v-model="exceptionForm.notes" dense outlined type="textarea" rows="2" label="Compensating control / notes" />
          <q-input v-model="exceptionForm.expires_at" dense outlined type="datetime-local" label="Expires at" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" icon="shield" label="Create" :loading="savingException" @click="createException" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="effectivePolicyDialog">
      <q-card class="cc-dialog cc-wide-dialog">
        <q-bar>
          <span>Effective Policy</span>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section>
          <pre>{{ stringify(effectivePolicy) }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import axios from "axios";

type AnyRecord = Record<string, any>;

const $q = useQuasar();
const { t } = useI18n();

const tab = ref("cockpit");
const search = ref("");
const statusFilter = ref<string | null>(null);
const loading = ref(false);
const syncingSca = ref(false);
const savingException = ref(false);
const savingCompliancePolicy = ref(false);
const applyingCompliancePolicyId = ref<number | null>(null);
const remediatingViolationId = ref<number | null>(null);
const scopeCheckLoading = ref(false);
const identityTargetLoading = ref(false);
const savingRuleSet = ref(false);
const savingRule = ref(false);
const evidenceDialog = ref(false);
const exceptionDialog = ref(false);
const compliancePolicyDialog = ref(false);
const scopeCheckDialog = ref(false);
const effectivePolicyDialog = ref(false);
const ruleSetDialog = ref(false);
const ruleDialog = ref(false);
const selectedViolation = ref<AnyRecord | null>(null);
const effectivePolicy = ref<AnyRecord | null>(null);
const editingCompliancePolicy = ref<AnyRecord | null>(null);
const editingRuleSet = ref<AnyRecord | null>(null);
const editingRule = ref<AnyRecord | null>(null);

const reportSummary = ref<AnyRecord | null>(null);
const devices = ref<AnyRecord[]>([]);
const violations = ref<AnyRecord[]>([]);
const exceptions = ref<AnyRecord[]>([]);
const complianceLevels = ref<AnyRecord[]>([]);
const scopedPolicies = ref<AnyRecord[]>([]);
const selectedRuleSetId = ref<number | null>(null);
const cyberSummary = ref<AnyRecord | null>(null);
const scaResults = ref<AnyRecord>({ summary: {}, items: [] });
const remediationWorkflows = ref<AnyRecord[]>([]);
const remediationIncidents = ref<AnyRecord[]>([]);
const scopeAgentOptions = ref<AnyRecord[]>([]);
const scopeDeviceGroupOptions = ref<AnyRecord[]>([]);
const scopeUserOptions = ref<AnyRecord[]>([]);
const scopeUserGroupOptions = ref<AnyRecord[]>([]);
const policyPreviewAgentId = ref("");
const policyCheckType = ref("general");
const identityTargetNotice = ref("");

const exceptionForm = ref({
  agent_id: "",
  agent_hostname: "",
  requirement: null as number | null,
  reason: "",
  notes: "",
  expires_at: "",
});

const defaultRuleSetForm = () => ({
  rank: Math.max(1, ...complianceLevels.value.map((level) => Number(level.rank || 0) + 1)),
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

const defaultRuleForm = () => ({
  mode: "field_condition",
  name: "",
  description: "",
  category: "Security",
  severity: "high",
  sort_order: 0,
  source_key: "",
  condition_source: "device_health",
  check_type: "general",
  feature: "",
  field: "firewall_enabled",
  operator: "eq",
  value_type: "boolean",
  expected_value: "true",
  script_command: "",
  timeout_seconds: 30,
  app_rule_mode: "required_installed",
  app_match: "contains",
  app_list: "",
  required_pass_rate_percent: 90,
  remediation_hint: "",
  inherits_lower_levels: false,
});

const defaultCompliancePolicyForm = () => ({
  scope: "device",
  level: "medium",
  rule_set: selectedRuleSetId.value as number | null,
  check_type: policyCheckType.value || "general",
  check_interval_minutes: 30,
  auto_remediate: false,
  os_family: "",
  action_block_access: false,
  action_notify_admin: true,
  action_wipe_device: false,
  target_user_id: null as number | null,
  target_user_group_id: null as number | null,
  target_device_group_id: null as number | null,
  target_agent_id: "",
  identity_source_scope: "device",
  source_agent_id: "",
  source_device_group_id: null as number | null,
});

const defaultScopeCheckForm = () => ({
  scope: "device",
  check_type: policyCheckType.value || "general",
  target_user_id: null as number | null,
  target_user_group_id: null as number | null,
  target_device_group_id: null as number | null,
  target_agent_id: "",
  identity_source_scope: "device",
  source_agent_id: "",
  source_device_group_id: null as number | null,
});

const ruleSetForm = ref(defaultRuleSetForm());
const ruleForm = ref(defaultRuleForm());
const compliancePolicyForm = ref(defaultCompliancePolicyForm());
const scopeCheckForm = ref(defaultScopeCheckForm());

const tabs = [
  { name: "cockpit", label: "Cockpit", icon: "dashboard" },
  { name: "matrix", label: "Matrix", icon: "grid_on" },
  { name: "policies", label: "Policies", icon: "rule" },
  { name: "incidents", label: "Incidents", icon: "warning" },
  { name: "remediation", label: "Remediation", icon: "healing" },
  { name: "exceptions", label: "Exceptions", icon: "shield" },
  { name: "reports", label: "Reports", icon: "assessment" },
];

const statusOptions = [
  { label: "Compliant", value: "compliant" },
  { label: "Warning / Pending", value: "pending" },
  { label: "Non-Compliant", value: "non_compliant" },
  { label: "Stale", value: "stale" },
  { label: "Unknown", value: "unknown" },
];

const complianceScopeOptions = [
  { label: "Specific Device", value: "device" },
  { label: "Device Group", value: "device_group" },
  { label: "User Group", value: "user_group" },
  { label: "Specific User", value: "user" },
  { label: "Global", value: "global" },
];

const identitySourceScopeOptions = [
  { label: "Source Device", value: "device" },
  { label: "Source Device Group", value: "device_group" },
];

const compliancePolicyLevelOptions = [
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "None", value: "none" },
];

const osFamilyOptions = [
  { label: "All / any OS", value: "" },
  { label: "Windows", value: "windows" },
  { label: "macOS", value: "mac" },
  { label: "Linux", value: "linux" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
];

const policyCheckTypeOptions = [
  { label: "General compliance", value: "general" },
  { label: "App policy compliance", value: "app" },
  { label: "Hardware compliance", value: "hardware" },
  { label: "OS version compliance", value: "os_version" },
  { label: "Custom script compliance", value: "custom" },
];

const signalColumnNames = ["mdm", "cyber", "bitlocker", "defender", "firewall", "dlp", "workspace"];

const matrixColumns = [
  { name: "hostname", label: "Device", field: "hostname", align: "left", sortable: true },
  { name: "status", label: "Status", field: "status", align: "left", sortable: true },
  { name: "risk", label: "Risk", field: "risk", align: "center", sortable: true },
  { name: "mdm", label: "MDM", field: "mdm", align: "center" },
  { name: "cyber", label: "Cyber Secure", field: "cyber", align: "center" },
  { name: "bitlocker", label: "BitLocker", field: "bitlocker", align: "center" },
  { name: "defender", label: "Defender", field: "defender", align: "center" },
  { name: "firewall", label: "Firewall", field: "firewall", align: "center" },
  { name: "dlp", label: "DLP", field: "dlp", align: "center" },
  { name: "workspace", label: "Workspace", field: "workspace", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const heatmapColumns = [
  { name: "group", label: "Group / Profile", field: "group", align: "left", sortable: true },
  { name: "devices", label: "Devices", field: "devices", align: "center", sortable: true },
  { name: "score", label: "Score", field: "score", align: "center", sortable: true },
  { name: "risk", label: "Risk", field: "risk", align: "center", sortable: true },
  { name: "mainReason", label: "Main Reason", field: "mainReason", align: "left" },
];

const violationColumns = [
  { name: "agent_hostname", label: "Device", field: "agent_hostname", align: "left", sortable: true },
  { name: "level_name", label: "Policy", field: "level_name", align: "left", sortable: true },
  { name: "requirement_name", label: "Rule", field: "requirement_name", align: "left", sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "center", sortable: true },
  { name: "source_key", label: "Signal", field: "source_key", align: "left", sortable: true },
  { name: "status", label: "Status", field: "status", align: "center", sortable: true },
  { name: "last_seen_at", label: "Last Seen", field: (row: AnyRecord) => formatDate(row.last_seen_at), align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const remediationIncidentColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left", sortable: true },
  { name: "workflow_name", label: "Workflow", field: (row: AnyRecord) => row.workflow_name || row.workflow?.name || row.workflow || "", align: "left" },
  { name: "stage", label: "Stage", field: "stage", align: "center", sortable: true },
  { name: "description", label: "Description", field: "description", align: "left" },
  { name: "updated_at", label: "Updated", field: (row: AnyRecord) => formatDate(row.updated_at || row.created_at), align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const workflowColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "trigger_type", label: "Trigger", field: "trigger_type", align: "left", sortable: true },
  { name: "auto_action", label: "Action", field: "auto_action", align: "left", sortable: true },
  { name: "action_target", label: "Target", field: "action_target", align: "left" },
  { name: "enabled", label: "Enabled", field: (row: AnyRecord) => (row.enabled ? "yes" : "no"), align: "center", sortable: true },
];

const exceptionColumns = [
  { name: "agent_hostname", label: "Device", field: "agent_hostname", align: "left", sortable: true },
  { name: "requirement", label: "Rule ID", field: "requirement", align: "center", sortable: true },
  { name: "reason", label: "Reason", field: "reason", align: "left" },
  { name: "expires_at", label: "Expires", field: (row: AnyRecord) => formatDate(row.expires_at), align: "left", sortable: true },
  { name: "is_active", label: "Status", field: "is_active", align: "center", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const freshnessColumns = [
  { name: "hostname", label: "Device", field: "hostname", align: "left", sortable: true },
  { name: "last_check", label: "Last Check", field: "last_check", align: "left", sortable: true },
  { name: "last_eval", label: "Last Evaluated", field: "last_eval", align: "left", sortable: true },
  { name: "freshness", label: "Freshness", field: "freshness", align: "center", sortable: true },
];

const scopedPolicyColumns = [
  { name: "scope", label: "Scope", field: "scope", align: "left", sortable: true },
  { name: "target", label: "Target", field: "target_label", align: "left", sortable: true },
  { name: "rule_set", label: "Rule Set", field: "rule_set_name", align: "left", sortable: true },
  { name: "check_type", label: "Check", field: "check_type", align: "center", sortable: true },
  { name: "level", label: "Level", field: "level", align: "center", sortable: true },
  { name: "os_family", label: "OS", field: "os_family", align: "center", sortable: true },
  { name: "actions_state", label: "Enforcement", field: "actions_state", align: "left" },
  { name: "updated_at", label: "Updated", field: (row: AnyRecord) => formatDate(row.updated_at), align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const ruleColumns = [
  { name: "id", label: "ID", field: "id", align: "left", sortable: true },
  { name: "category", label: "Category", field: "category", align: "left", sortable: true },
  { name: "condition", label: "Condition", field: "condition", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center", sortable: true },
  { name: "source", label: "Source", field: "source", align: "center", sortable: true },
  { name: "action", label: "Default Action", field: "action", align: "left" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const customRuleColumns = [
  { name: "name", label: "Rule", field: "name", align: "left", sortable: true },
  { name: "severity", label: "Severity", field: "severity", align: "center", sortable: true },
  { name: "source_type", label: "Source", field: "source_type", align: "center", sortable: true },
  { name: "source_key", label: "Key", field: "source_key", align: "left", sortable: true },
  { name: "actions", label: "", field: "actions", align: "right" },
];

const severityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const enrollmentOptions = [
  { label: "All devices", value: "all" },
  { label: "Corporate", value: "corporate" },
  { label: "BYOD", value: "byod" },
  { label: "COPE", value: "cope" },
];

const ruleModeOptions = [
  { label: "Field condition", value: "field_condition" },
  { label: "Application inventory", value: "app_inventory" },
  { label: "Custom script output", value: "custom_script" },
  { label: "Cyber Secure SCA", value: "cyber_secure_sca" },
  { label: "Manual / external", value: "manual" },
];

const appRuleModeOptions = [
  { label: "Required apps must be installed", value: "required_installed" },
  { label: "Forbidden apps must be absent", value: "forbidden_absent" },
  { label: "Only allowlisted apps may be installed", value: "allowlist_only" },
];

const appMatchOptions = [
  { label: "Name contains", value: "contains" },
  { label: "Exact name", value: "exact" },
  { label: "Regex", value: "regex" },
];

const conditionSourceOptions = [
  { label: "Device health state", value: "device_health" },
  { label: "Latest agent check details", value: "latest_check" },
];

const checkTypeOptions = [
  { label: "General", value: "general" },
  { label: "Hardware", value: "hardware" },
  { label: "OS version", value: "os_version" },
  { label: "Custom", value: "custom" },
];

const deviceHealthFieldOptions = [
  { label: "Antivirus enabled", value: "antivirus_enabled" },
  { label: "Disk encrypted", value: "disk_encrypted" },
  { label: "Firewall enabled", value: "firewall_enabled" },
  { label: "OS updates pending", value: "os_updates_pending" },
  { label: "DLP active", value: "dlp_active" },
  { label: "Workspace mounted", value: "workspace_mounted" },
  { label: "Agent healthy", value: "agent_healthy" },
];

const operatorOptions = [
  { label: "Equals", value: "eq" },
  { label: "Not equals", value: "ne" },
  { label: "Greater than", value: "gt" },
  { label: "Greater or equal", value: "gte" },
  { label: "Less than", value: "lt" },
  { label: "Less or equal", value: "lte" },
  { label: "Contains", value: "contains" },
  { label: "Does not contain", value: "not_contains" },
  { label: "In list", value: "in" },
  { label: "Not in list", value: "not_in" },
  { label: "Regex match", value: "regex" },
  { label: "Exists", value: "exists" },
  { label: "Does not exist", value: "not_exists" },
];

const valueTypeOptions = [
  { label: "Boolean", value: "boolean" },
  { label: "Text", value: "string" },
  { label: "Number", value: "number" },
  { label: "Comma-separated list", value: "list" },
];

const ruleCatalog = [
  { id: "WIN-BL-001", category: "Encryption", condition: "disk_encrypted = true", severity: "critical", source: "BitLocker", action: "Block workspace and create incident", field: "disk_encrypted", operator: "eq", value_type: "boolean", expected_value: "true" },
  { id: "WIN-AV-001", category: "Antivirus", condition: "antivirus_enabled = true", severity: "critical", source: "Defender", action: "Run remediation workflow", field: "antivirus_enabled", operator: "eq", value_type: "boolean", expected_value: "true" },
  { id: "WIN-FW-001", category: "Network", condition: "firewall_enabled = true", severity: "high", source: "MDM", action: "Enable Firewall", field: "firewall_enabled", operator: "eq", value_type: "boolean", expected_value: "true" },
  { id: "WIN-UPD-001", category: "Updates", condition: "os_updates_pending <= 0", severity: "medium", source: "MDM", action: "Start update remediation", field: "os_updates_pending", operator: "lte", value_type: "number", expected_value: "0" },
  { id: "APP-REQ-001", category: "Applications", condition: "Required apps installed", severity: "high", source: "App inventory", action: "Apply app policy and recheck", mode: "app_inventory", app_rule_mode: "required_installed", app_list: "Microsoft Edge" },
  { id: "APP-BLOCK-001", category: "Applications", condition: "Forbidden apps absent", severity: "high", source: "App inventory", action: "Apply app policy and recheck", mode: "app_inventory", app_rule_mode: "forbidden_absent", app_list: "Discord" },
  { id: "DLP-001", category: "Data Protection", condition: "dlp_active = true", severity: "critical", source: "DLP", action: "Switch to strict mode", field: "dlp_active", operator: "eq", value_type: "boolean", expected_value: "true" },
  { id: "WS-001", category: "Workspace", condition: "workspace_mounted = true", severity: "critical", source: "Workspace", action: "Unmount on critical status", field: "workspace_mounted", operator: "eq", value_type: "boolean", expected_value: "true" },
  { id: "SCA-CIS-001", category: "Security Baseline", condition: "Cyber Secure SCA pass rate >= 90%", severity: "medium", source: "Cyber Secure", action: "Open SCA fix playbook", mode: "cyber_secure_sca" },
];

const remediationPlaybooks = [
  { name: "Restart MDM Agent", action: "Restart service, verify heartbeat and module health", mode: "Executable", icon: "restart_alt", color: "primary" },
  { name: "Enable Firewall", action: "Apply Windows Firewall profiles and recheck", mode: "Executable", icon: "local_fire_department", color: "orange" },
  { name: "Enable Defender", action: "Start Defender services and validate real-time protection", mode: "Planned", icon: "health_and_safety", color: "positive" },
  { name: "Block Workspace Access", action: "Revoke workspace/container access for critical devices", mode: "Planned", icon: "folder_off", color: "negative" },
  { name: "Cyber Secure SCA Fix", action: "Run mapped fix script for failed SCA check", mode: "Planned", icon: "gpp_good", color: "teal" },
];

const reportTemplates = [
  { name: "Company Compliance Summary", scope: "Fleet score, severity, groups and policy status", icon: "summarize", color: "primary" },
  { name: "Critical Violations", scope: "Critical and high incidents with SLA status", icon: "report", color: "negative" },
  { name: "BitLocker and Recovery Keys", scope: "Encryption status, escrow evidence and exceptions", icon: "enhanced_encryption", color: "teal" },
  { name: "Cyber Secure SCA", scope: "CIS baseline pass/fail/not-applicable state", icon: "verified_user", color: "green" },
  { name: "Exceptions Audit", scope: "TTL, approver, reason and compensating controls", icon: "shield", color: "orange" },
];

const totalDevices = computed(() => {
  const summaryTotal = reportSummary.value?.device_summary?.total_devices;
  return Number.isFinite(summaryTotal) ? summaryTotal : devices.value.length;
});

const statusCounts = computed(() => {
  const fromSummary = reportSummary.value?.device_summary?.status_counts || {};
  if (Object.keys(fromSummary).length) return fromSummary;
  return devices.value.reduce((acc: AnyRecord, device) => {
    const status = device.effective_status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
});

const compliantDevices = computed(() => statusCounts.value.compliant || 0);
const openViolations = computed(() => violations.value.filter((item) => item.status === "open").length);
const criticalOpenViolations = computed(() => violations.value.filter((item) => item.status === "open" && item.severity === "critical").length);
const blockedDevices = computed(() => devices.value.filter((item) => ["blocked", "quarantined"].includes(item.access_state)).length);
const staleDevices = computed(() => devices.value.filter((item) => item.stale || item.effective_status === "stale").length);

const complianceScore = computed(() => {
  if (!totalDevices.value) return 0;
  return Math.round((compliantDevices.value / totalDevices.value) * 100);
});

const scoreColor = computed(() => {
  if (complianceScore.value >= 90) return "positive";
  if (complianceScore.value >= 70) return "warning";
  return "negative";
});

const kpiCards = computed(() => [
  { key: "critical", label: "Critical", value: criticalOpenViolations.value, caption: "Open critical incidents", icon: "priority_high", color: "negative" },
  { key: "violations", label: "Open Violations", value: openViolations.value, caption: "Unresolved compliance failures", icon: "warning", color: "orange" },
  { key: "blocked", label: "Blocked Access", value: blockedDevices.value, caption: "Workspace or data access blocked", icon: "block", color: "negative" },
  { key: "stale", label: "Stale Data", value: staleDevices.value, caption: "Degraded by missing telemetry", icon: "schedule", color: "grey-8" },
  { key: "sca", label: "Cyber Secure Failed", value: scaResults.value?.summary?.failed || cyberSummary.value?.results_failed || 0, caption: "Failed SCA checks", icon: "gpp_bad", color: "deep-orange" },
]);

const statusBreakdown = computed(() => {
  const keys = ["compliant", "pending", "non_compliant", "stale", "unknown"];
  return keys.map((status) => {
    const count = statusCounts.value[status] || 0;
    return {
      status,
      count,
      percent: totalDevices.value ? Math.round((count / totalDevices.value) * 100) : 0,
      label: statusLabel(status),
      color: statusColor(status),
      icon: statusIcon(status),
    };
  });
});

const sourceHealth = computed(() => [
  {
    key: "mdm",
    label: "MDM",
    state: totalDevices.value ? "Active" : "No data",
    color: totalDevices.value ? "positive" : "grey",
    icon: "devices",
    caption: t("complianceCenter.devicesInStateTable", {
      count: totalDevices.value,
    }),
  },
  {
    key: "gpo",
    label: "GPO / Collections",
    state: devices.value.some((item) => item.level_name || item.level__name) ? "Mapped" : "Pending",
    color: devices.value.some((item) => item.level_name || item.level__name) ? "positive" : "warning",
    icon: "account_tree",
    caption: "Effective policy scope: device > group > user > global",
  },
  {
    key: "cyber",
    label: "Cyber Secure",
    state: cyberSummary.value?.sca_enabled ? "Connected" : "Degraded",
    color: cyberSummary.value?.sca_enabled ? "positive" : "warning",
    icon: "verified_user",
    caption: t("complianceCenter.mappedAgents", {
      agents: cyberSummary.value?.mapped_agents || 0,
      results: cyberSummary.value?.results_total || 0,
    }),
  },
  {
    key: "workspace",
    label: "Workspace / DLP",
    state: blockedDevices.value || openViolations.value ? "Enforcing" : "Ready",
    color: blockedDevices.value || openViolations.value ? "orange" : "positive",
    icon: "folder_special",
    caption: "Compliance status feeds access and data-protection decisions",
  },
]);

const topViolations = computed(() => reportSummary.value?.top_failing_requirements || []);

const selectedRuleSet = computed(() =>
  complianceLevels.value.find((level) => level.id === selectedRuleSetId.value) || complianceLevels.value[0] || null
);

const ruleSetOptions = computed(() =>
  complianceLevels.value.map((level) => ({
    value: level.id,
    label: `${level.name} (${level.requirements?.length || 0} rules)`,
  }))
);

const selectedRules = computed(() => selectedRuleSet.value?.requirements || []);

const criticalEvents = computed(() =>
  violations.value
    .filter((item) => item.status === "open" && ["critical", "high"].includes(item.severity))
    .slice(0, 8)
);

const riskHeatmap = computed(() => {
  const groups: AnyRecord = {};
  devices.value.forEach((device) => {
    const group = device.site_name || device.site__name || device.level_name || device.level__name || "Unassigned";
    if (!groups[group]) groups[group] = { key: group, group, devices: 0, scoreTotal: 0, reasons: [] as string[] };
    groups[group].devices += 1;
    groups[group].scoreTotal += Number(device.risk_score || 0);
    if (Array.isArray(device.top_failing_requirements)) groups[group].reasons.push(...device.top_failing_requirements);
  });
  return Object.values(groups).map((group: any) => {
    const avgRisk = group.devices ? Math.round(group.scoreTotal / group.devices) : 0;
    return {
      ...group,
      score: Math.max(0, 100 - avgRisk),
      risk: riskLevel(avgRisk),
      mainReason:
        mostCommon(group.reasons) ||
        t("complianceCenter.noDominantFailure"),
    };
  });
});

const matrixRows = computed(() =>
  devices.value.map((device) => {
    const failures = normalizeFailures(device);
    return {
      agent_id: device.agent_id,
      hostname: device.agent_hostname || device.hostname || device.agent_id,
      status: device.effective_status || "unknown",
      risk: device.risk_score || 0,
      mdm: device.stale ? "warning" : "pass",
      cyber: cyberSignal(device.agent_id),
      bitlocker: inferSignal(failures, ["bitlocker", "encryption", "recovery key"]),
      defender: inferSignal(failures, ["defender", "antivirus", "edr"]),
      firewall: inferSignal(failures, ["firewall"]),
      dlp: inferSignal(failures, ["dlp", "clipboard", "print", "usb"]),
      workspace: inferSignal(failures, ["workspace", "container", "cywm"]),
    };
  })
);

const filteredMatrixRows = computed(() =>
  matrixRows.value.filter((row) => {
    if (statusFilter.value && row.status !== statusFilter.value) return false;
    const needle = search.value.toLowerCase().trim();
    if (!needle) return true;
    return [row.hostname, row.agent_id, row.status].some((value) => String(value || "").toLowerCase().includes(needle));
  })
);

const filteredViolations = computed(() =>
  violations.value.filter((row) => {
    const needle = search.value.toLowerCase().trim();
    if (!needle) return true;
    return [
      row.agent_hostname,
      row.agent_id,
      row.requirement_name,
      row.source_key,
      row.level_name,
      row.severity,
    ].some((value) => String(value || "").toLowerCase().includes(needle));
  })
);

const freshnessRows = computed(() =>
  devices.value.map((device) => {
    const lastCheck = device.last_check_at || device.last_evaluated_at;
    return {
      agent_id: device.agent_id,
      hostname: device.agent_hostname || device.agent_id,
      last_check: formatDate(lastCheck),
      last_eval: formatDate(device.last_evaluated_at),
      freshness: freshnessLabel(lastCheck, device.stale),
      stale: device.stale,
    };
  })
);

async function refreshComplianceCenter() {
  loading.value = true;
  try {
    const [
      summaryResponse,
      devicesResponse,
      violationsResponse,
      exceptionsResponse,
      scaResponse,
      workflowsResponse,
      incidentsResponse,
      levelsResponse,
      scopedPoliciesResponse,
      agentsResponse,
      sitesResponse,
      usersResponse,
      userGroupsResponse,
    ] = await Promise.allSettled([
      axios.get("/compliance/reports/summary/"),
      axios.get("/compliance/devices/"),
      axios.get("/compliance/violations/"),
      axios.get("/compliance/exceptions/"),
      axios.get("/compliance/integrations/wazuh/results/?limit=100&ordering=-fetched_at"),
      axios.get("/security/remediation/workflows/"),
      axios.get("/security/remediation/incidents/"),
      axios.get("/compliance/levels/"),
      axios.get("/policies/compliance/"),
      axios.get("/agents/", { params: { detail: "false" } }),
      axios.get("/clients/sites/?leaf=true"),
      axios.get("/accounts/users/"),
      axios.get("/accounts/user-groups/"),
    ]);

    reportSummary.value = settledData(summaryResponse, null);
    devices.value = ensureArray(settledData(devicesResponse, reportSummary.value?.device_rows || []));
    violations.value = ensureArray(settledData(violationsResponse, reportSummary.value?.open_violations || []));
    exceptions.value = ensureArray(settledData(exceptionsResponse, []));
    scaResults.value = settledData(scaResponse, { summary: {}, items: [] }) || { summary: {}, items: [] };
    const scaItems = ensureArray(scaResults.value?.items);
    const scaSummary = scaResults.value?.summary || {};
    cyberSummary.value = {
      sca_enabled: Boolean(scaItems.length || scaSummary.total),
      mapped_agents: new Set(scaItems.map((item: AnyRecord) => item.agent_id).filter(Boolean)).size,
      results_total: scaSummary.total || 0,
      results_failed: scaSummary.failed || 0,
    };
    remediationWorkflows.value = ensureArray(settledData(workflowsResponse, []));
    remediationIncidents.value = ensureArray(settledData(incidentsResponse, []));
    complianceLevels.value = ensureArray(settledData(levelsResponse, []));
    scopedPolicies.value = ensureArray(settledData(scopedPoliciesResponse, []));
    scopeAgentOptions.value = ensureArray(settledData(agentsResponse, [])).filter((agent: AnyRecord) => agent?.agent_id).map((agent: AnyRecord) => ({
      value: agent.agent_id,
      label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
    }));
    scopeDeviceGroupOptions.value = ensureArray(settledData(sitesResponse, [])).filter((site: AnyRecord) => site?.id !== undefined && site?.id !== null).map((site: AnyRecord) => ({
      value: site.id,
      label: site.ancestors ? `${site.ancestors} / ${site.name}` : site.name || `Device group #${site.id}`,
    }));
    scopeUserOptions.value = ensureArray(settledData(usersResponse, [])).filter((user: AnyRecord) => user?.id !== undefined && user?.id !== null).map((user: AnyRecord) => ({
      value: user.id,
      label: user.display_name || user.full_name || user.username || user.sam_account_name || user.email || `User #${user.id}`,
    }));
    scopeUserGroupOptions.value = ensureArray(settledData(userGroupsResponse, [])).filter((group: AnyRecord) => group?.id !== undefined && group?.id !== null).map((group: AnyRecord) => ({
      value: group.id,
      label: group.display_name || group.name || group.sam_account_name || `User group #${group.id}`,
    }));
    if (!selectedRuleSetId.value && complianceLevels.value.length) {
      selectedRuleSetId.value = complianceLevels.value[0].id;
    }
  } finally {
    loading.value = false;
  }
}

function resetScopedTargets(form: AnyRecord) {
  if (form.scope !== "device") form.target_agent_id = "";
  if (form.scope !== "device_group") form.target_device_group_id = null;
  if (form.scope !== "user") form.target_user_id = null;
  if (form.scope !== "user_group") form.target_user_group_id = null;
  if (form.scope !== "user" && form.scope !== "user_group") {
    form.identity_source_scope = "device";
    form.source_agent_id = "";
    form.source_device_group_id = null;
    identityTargetNotice.value = "";
  }
}

function onScopedTargetScopeChange(form: AnyRecord) {
  resetScopedTargets(form);
}

function onIdentitySourceChange(form: AnyRecord) {
  if (form.scope === "user") form.target_user_id = null;
  if (form.scope === "user_group") form.target_user_group_id = null;
  identityTargetNotice.value = "Load endpoint identities from the selected source.";
}

function normalizeScopedTargetPayload(form: AnyRecord) {
  const payload = { ...form };
  resetScopedTargets(payload);
  for (const key of ["target_device_group_id", "target_user_id", "target_user_group_id", "source_device_group_id"]) {
    if (payload[key] !== null && payload[key] !== "") payload[key] = Number(payload[key]);
  }
  delete payload.identity_source_scope;
  delete payload.source_agent_id;
  delete payload.source_device_group_id;
  return payload;
}

function validateScopedTargetForm(form: AnyRecord) {
  if (form.scope === "device" && !form.target_agent_id) return "Select the Agent ID for Specific Device scope";
  if (form.scope === "device_group" && !form.target_device_group_id) return "Select the device group";
  if (form.scope === "user_group" && !form.target_user_group_id) return "Select the user group";
  if (form.scope === "user" && !form.target_user_id) return "Select the user";
  return "";
}

async function loadIdentityTargetOptions(form: AnyRecord) {
  if (!form || (form.scope !== "user" && form.scope !== "user_group")) return;
  const sourceScope = form.identity_source_scope || "device";
  if (sourceScope === "device" && !form.source_agent_id) {
    $q.notify({ color: "warning", icon: "warning", message: "Select a source device first" });
    return;
  }
  if (sourceScope === "device_group" && !form.source_device_group_id) {
    $q.notify({ color: "warning", icon: "warning", message: "Select a source device group first" });
    return;
  }

  identityTargetLoading.value = true;
  identityTargetNotice.value = "Reading endpoint identities...";
  try {
    const response = await axios.post("/compliance/identity-targets/", {
      source_scope: sourceScope,
      source_agent_id: form.source_agent_id,
      source_device_group_id: form.source_device_group_id,
      kind: form.scope === "user" ? "users" : "groups",
    });
    const data = response.data || {};
    const users = ensureArray(data.users).map((item: AnyRecord) => ({
      value: item.value,
      label: item.label,
      caption: item.sid ? `Endpoint user SID: ${item.sid}` : "Endpoint user",
    }));
    const groups = ensureArray(data.groups).map((item: AnyRecord) => ({
      value: item.value,
      label: item.label,
      caption: item.sid ? `Endpoint group SID: ${item.sid}` : "Endpoint group",
    }));
    if (users.length) scopeUserOptions.value = mergeOptions(scopeUserOptions.value, users);
    if (groups.length) scopeUserGroupOptions.value = mergeOptions(scopeUserGroupOptions.value, groups);
    const count = form.scope === "user" ? users.length : groups.length;
    const suffix = data.truncated ? ` from latest ${data.source_limit} agents` : "";
    identityTargetNotice.value = `Loaded ${count} ${form.scope === "user" ? "users" : "groups"}${suffix}.`;
    if (Array.isArray(data.errors) && data.errors.length) {
      $q.notify({ color: "warning", icon: "warning", message: data.errors[0] });
    }
  } catch (err: any) {
    identityTargetNotice.value = "";
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    identityTargetLoading.value = false;
  }
}

function openScopeCheckDialog(scope = "device") {
  scopeCheckForm.value = {
    ...defaultScopeCheckForm(),
    scope,
    check_type: policyCheckType.value || "general",
  };
  identityTargetNotice.value = "";
  scopeCheckDialog.value = true;
}

async function runScopedCheck() {
  const validation = validateScopedTargetForm(scopeCheckForm.value);
  if (validation) {
    $q.notify({ color: "warning", icon: "warning", message: validation });
    return;
  }
  scopeCheckLoading.value = true;
  try {
    const payload = normalizeScopedTargetPayload(scopeCheckForm.value);
    await axios.post("/compliance/checks/run/", {
      ...payload,
      check_type: payload.check_type || "general",
      force: true,
    });
    scopeCheckDialog.value = false;
    $q.notify({ color: "positive", icon: "fact_check", message: "Scoped compliance check requested" });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    scopeCheckLoading.value = false;
  }
}

function openCompliancePolicyDialog(policy: AnyRecord | null = null) {
  editingCompliancePolicy.value = policy;
  compliancePolicyForm.value = policy
    ? {
        ...defaultCompliancePolicyForm(),
        scope: policy.scope || "device",
        level: policy.level || "medium",
        rule_set: policy.rule_set || selectedRuleSetId.value || null,
        check_type: policy.check_type || policyCheckType.value || "general",
        check_interval_minutes: policy.check_interval_minutes || 30,
        auto_remediate: policy.auto_remediate ?? false,
        os_family: policy.os_family || "",
        action_block_access: policy.action_block_access ?? false,
        action_notify_admin: policy.action_notify_admin ?? true,
        action_wipe_device: policy.action_wipe_device ?? false,
        target_user_id: policy.target_user_id ?? null,
        target_user_group_id: policy.target_user_group_id ?? null,
        target_device_group_id: policy.target_device_group_id ?? null,
        target_agent_id: policy.target_agent_id || "",
      }
    : defaultCompliancePolicyForm();
  identityTargetNotice.value = "";
  compliancePolicyDialog.value = true;
}

function onCompliancePolicyScopeChange() {
  onScopedTargetScopeChange(compliancePolicyForm.value);
}

function normalizeCompliancePolicyPayload(form: AnyRecord) {
  return normalizeScopedTargetPayload(form);
}

function validateCompliancePolicyForm() {
  const scoped = validateScopedTargetForm(compliancePolicyForm.value);
  if (scoped) return scoped;
  if (!compliancePolicyForm.value.rule_set) return "Select the compliance Rule Set";
  return "";
}

async function saveCompliancePolicy() {
  const validation = validateCompliancePolicyForm();
  if (validation) {
    $q.notify({ color: "warning", icon: "warning", message: validation });
    return;
  }
  savingCompliancePolicy.value = true;
  try {
    const payload = normalizeCompliancePolicyPayload(compliancePolicyForm.value);
    if (editingCompliancePolicy.value?.id) {
      await axios.put(`/policies/compliance/${editingCompliancePolicy.value.id}/`, payload);
    } else {
      await axios.post("/policies/compliance/", payload);
    }
    compliancePolicyDialog.value = false;
    $q.notify({ color: "positive", icon: "save", message: "Compliance policy saved" });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    savingCompliancePolicy.value = false;
  }
}

async function applyCompliancePolicy(policy: AnyRecord) {
  if (!policy?.id) return;
  applyingCompliancePolicyId.value = policy.id;
  try {
    const response = await axios.post(`/policies/compliance/${policy.id}/apply/`, {
      check_type: policy.check_type || policyCheckType.value,
    });
    const triggered = response.data?.triggered ?? 0;
    $q.notify({
      color: "positive",
      icon: "published_with_changes",
      message: `Compliance policy applied to ${triggered} agent(s)`,
    });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    applyingCompliancePolicyId.value = null;
  }
}

async function remediateViolation(row: AnyRecord) {
  if (!row?.id) return;
  remediatingViolationId.value = row.id;
  try {
    await axios.post(`/compliance/violations/${row.id}/remediate/`, {
      check_type: row.source_key?.startsWith?.("app_inventory.") ? "app" : undefined,
    });
    $q.notify({ color: "positive", icon: "build_circle", message: "Remediation requested" });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    remediatingViolationId.value = null;
  }
}

function deleteCompliancePolicy(policy: AnyRecord) {
  if (!policy?.id) return;
  $q.dialog({
    title: "Delete compliance policy?",
    message: `${complianceScopeLabel(policy.scope)}: ${complianceTargetLabel(policy)}`,
    cancel: true,
    ok: { label: "Delete", color: "negative" },
  }).onOk(async () => {
    await axios.delete(`/policies/compliance/${policy.id}/`);
    $q.notify({ color: "positive", icon: "delete", message: "Compliance policy deleted" });
    await refreshComplianceCenter();
  });
}

function openRuleSetDialog(level: AnyRecord | null = null) {
  editingRuleSet.value = level;
  ruleSetForm.value = level
    ? {
        rank: level.rank,
        name: level.name,
        description: level.description || "",
        color: level.color || "#2563EB",
        is_active: level.is_active ?? true,
        platform: level.platform || "windows",
        applies_to_enrollment: level.applies_to_enrollment || "all",
        stale_after_minutes: level.stale_after_minutes || 1440,
        grace_period_minutes: level.grace_period_minutes || 240,
        notify_user: level.notify_user ?? true,
        notify_admin: level.notify_admin ?? true,
        block_access: level.block_access ?? false,
        lock_device_action: level.lock_device_action ?? false,
        selective_wipe_action: level.selective_wipe_action ?? false,
        full_wipe_action: level.full_wipe_action ?? false,
      }
    : defaultRuleSetForm();
  ruleSetDialog.value = true;
}

async function saveRuleSet() {
  if (!ruleSetForm.value.name.trim()) {
    $q.notify({ color: "warning", icon: "warning", message: "Rule set name is required" });
    return;
  }
  savingRuleSet.value = true;
  try {
    const payload = { ...ruleSetForm.value };
    const response = editingRuleSet.value
      ? await axios.put(`/compliance/levels/${editingRuleSet.value.id}/`, payload)
      : await axios.post("/compliance/levels/", payload);
    selectedRuleSetId.value = response.data?.id || editingRuleSet.value?.id || selectedRuleSetId.value;
    ruleSetDialog.value = false;
    $q.notify({ color: "positive", icon: "save", message: "Rule set saved" });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    savingRuleSet.value = false;
  }
}

function openRuleDialog(rule: AnyRecord | null = null, level: AnyRecord | null = selectedRuleSet.value) {
  if (!level) return;
  selectedRuleSetId.value = level.id;
  editingRule.value = rule;
  ruleForm.value = rule ? formFromRule(rule) : defaultRuleForm();
  ruleDialog.value = true;
}

function formFromRule(rule: AnyRecord) {
  const definition = rule.rule_definition || {};
  const mode = definition.kind === "custom_script"
    ? "custom_script"
    : definition.kind === "wazuh_sca"
      ? "cyber_secure_sca"
      : definition.kind === "app_inventory"
        ? "app_inventory"
      : definition.kind === "field_condition"
        ? "field_condition"
        : "manual";
  return {
    ...defaultRuleForm(),
    mode,
    name: rule.name || "",
    description: rule.description || "",
    category: definition.category || "Security",
    severity: rule.severity || "high",
    sort_order: rule.sort_order || 0,
    source_key: rule.source_key || definition.policy_id || "",
    condition_source: definition.source || "device_health",
    check_type: definition.check_type || "general",
    feature: definition.feature || "",
    field: definition.field || definition.parameter || "firewall_enabled",
    operator: definition.operator || "eq",
    value_type: definition.value_type || "boolean",
    expected_value: String(definition.expected ?? definition.expected_output ?? ""),
    script_command: definition.script_command || "",
    timeout_seconds: definition.timeout_seconds || 30,
    app_rule_mode: definition.mode || "required_installed",
    app_match: definition.match || "contains",
    app_list: ensureArray(definition.apps || definition.expected_apps).join("\n"),
    required_pass_rate_percent: Math.round(Number(definition.required_pass_rate ?? 0.9) * 100),
    remediation_hint: rule.remediation_hint || "",
    inherits_lower_levels: rule.inherits_lower_levels || false,
  };
}

function onRuleModeChange() {
  if (ruleForm.value.mode === "custom_script" && !ruleForm.value.source_key) {
    ruleForm.value.source_key = `script.${Date.now()}`;
  }
  if (ruleForm.value.mode === "cyber_secure_sca") {
    ruleForm.value.source_key = ruleForm.value.source_key || "cis_win11_enterprise";
  }
  if (ruleForm.value.mode === "app_inventory") {
    ruleForm.value.category = ruleForm.value.category || "Applications";
    ruleForm.value.source_key = ruleForm.value.source_key || `app_inventory.${Date.now()}`;
  }
}

async function saveRule() {
  const level = selectedRuleSet.value;
  if (!level) return;
  if (!ruleForm.value.name.trim()) {
    $q.notify({ color: "warning", icon: "warning", message: "Rule name is required" });
    return;
  }
  if (ruleForm.value.mode === "app_inventory" && parseAppList(ruleForm.value.app_list).length === 0) {
    $q.notify({ color: "warning", icon: "warning", message: "Application names are required" });
    return;
  }
  savingRule.value = true;
  try {
    const payload = buildRulePayload(level);
    if (editingRule.value?.id) {
      await axios.patch(`/compliance/levels/${level.id}/requirements/${editingRule.value.id}/`, payload);
    } else {
      await axios.post(`/compliance/levels/${level.id}/requirements/`, payload);
    }
    ruleDialog.value = false;
    $q.notify({ color: "positive", icon: "save", message: "Rule saved" });
    await refreshComplianceCenter();
  } catch (err: any) {
    $q.notify({ color: "negative", icon: "error", message: errorMessage(err) });
  } finally {
    savingRule.value = false;
  }
}

function buildRulePayload(level: AnyRecord) {
  const form = ruleForm.value;
  let source_type = "manual";
  let source_key = form.source_key || `custom.${form.field || form.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}`;
  let rule_definition: AnyRecord = { kind: "manual", category: form.category };

  if (form.mode === "field_condition") {
    source_type = form.condition_source === "device_health" ? "security_baseline" : "compliance_check";
    rule_definition = {
      kind: "field_condition",
      category: form.category,
      source: form.condition_source,
      check_type: form.check_type,
      feature: form.feature,
      field: form.field,
      operator: form.operator,
      value_type: form.value_type,
      expected: form.expected_value,
    };
  } else if (form.mode === "custom_script") {
    source_type = "custom_script";
    source_key = form.source_key || `script.${form.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}`;
    rule_definition = {
      kind: "custom_script",
      category: form.category,
      script_command: form.script_command,
      expected_output: form.expected_value || "compliant",
      timeout_seconds: Number(form.timeout_seconds || 30),
    };
  } else if (form.mode === "app_inventory") {
    source_type = "compliance_check";
    const apps = parseAppList(form.app_list);
    source_key = form.source_key || `app_inventory.${form.app_rule_mode}.${form.name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}`;
    rule_definition = {
      kind: "app_inventory",
      category: form.category || "Applications",
      mode: form.app_rule_mode || "required_installed",
      match: form.app_match || "contains",
      check_type: "app",
      apps,
    };
  } else if (form.mode === "cyber_secure_sca") {
    source_type = "wazuh_sca";
    source_key = form.source_key;
    rule_definition = {
      kind: "wazuh_sca",
      category: form.category,
      policy_id: form.source_key,
      required_pass_rate: Math.min(1, Math.max(0, Number(form.required_pass_rate_percent || 90) / 100)),
    };
  }

  return {
    level: level.id,
    name: form.name,
    description: form.description,
    sort_order: Number(form.sort_order || 0),
    severity: form.severity,
    source_type,
    source_key,
    inherits_lower_levels: form.inherits_lower_levels,
    remediation_hint: form.remediation_hint,
    rule_definition,
  };
}

async function deleteRule(rule: AnyRecord) {
  const level = selectedRuleSet.value;
  if (!level || !rule?.id) return;
  $q.dialog({
    title: `Delete "${rule.name}"?`,
    message: "This removes the rule from this compliance rule set.",
    cancel: true,
    ok: { label: "Delete", color: "negative" },
  }).onOk(async () => {
    await axios.delete(`/compliance/levels/${level.id}/requirements/${rule.id}/`);
    $q.notify({ color: "positive", icon: "delete", message: "Rule deleted" });
    await refreshComplianceCenter();
  });
}

async function createRuleFromTemplate(template: AnyRecord) {
  const level = selectedRuleSet.value;
  if (!level) return;
  ruleForm.value = {
    ...defaultRuleForm(),
    mode: template.mode || "field_condition",
    name: template.id,
    description: template.condition,
    category: template.category,
    severity: template.severity,
    source_key: template.mode === "cyber_secure_sca" ? "cis_win11_enterprise" : `template.${template.id.toLowerCase()}`,
    field: template.field || "firewall_enabled",
    operator: template.operator || "eq",
    value_type: template.value_type || "boolean",
    expected_value: template.expected_value || "true",
    app_rule_mode: template.app_rule_mode || "required_installed",
    app_match: template.app_match || "contains",
    app_list: template.app_list || "",
    remediation_hint: template.action,
  };
  editingRule.value = null;
  await saveRule();
}

async function syncCyberSecure() {
  syncingSca.value = true;
  try {
    await axios.post("/compliance/integrations/wazuh/sync/");
    $q.notify({ color: "positive", icon: "published_with_changes", message: "Cyber Secure SCA sync started" });
    await refreshComplianceCenter();
  } finally {
    syncingSca.value = false;
  }
}

async function recheckDevice(agentId: string) {
  if (!agentId) return;
  await axios.post("/compliance/checks/run/", {
    scope: "device",
    target_agent_id: agentId,
    check_type: policyCheckType.value || "general",
    force: true,
  });
  $q.notify({ color: "positive", icon: "fact_check", message: "Device recheck requested" });
  await refreshComplianceCenter();
}

async function acknowledgeViolation(row: AnyRecord) {
  if (!row?.id) return;
  await axios.post(`/compliance/violations/${row.id}/acknowledge/`);
  $q.notify({ color: "positive", icon: "check", message: "Violation acknowledged" });
  await refreshComplianceCenter();
}

async function resolveRemediation(row: AnyRecord) {
  if (!row?.id) return;
  await axios.patch(`/security/remediation/incidents/${row.id}/`, { stage: "resolved" });
  $q.notify({ color: "positive", icon: "done_all", message: "Remediation marked resolved" });
  await refreshComplianceCenter();
}

async function revokeException(row: AnyRecord) {
  if (!row?.id) return;
  await axios.post(`/compliance/exceptions/${row.id}/revoke/`, { notes: "Revoked from Compliance Center" });
  $q.notify({ color: "positive", icon: "cancel", message: "Exception revoked" });
  await refreshComplianceCenter();
}

async function openEffectivePolicy(agentId: string) {
  effectivePolicy.value = null;
  effectivePolicyDialog.value = true;
  const response = await axios.get(`/compliance/effective/${agentId}/`);
  effectivePolicy.value = response.data;
}

function showEvidence(row: AnyRecord) {
  selectedViolation.value = row;
  evidenceDialog.value = true;
}

function openExceptionDialog(row: AnyRecord) {
  selectedViolation.value = row;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  exceptionForm.value = {
    agent_id: row.agent_id || "",
    agent_hostname: row.agent_hostname || row.agent_id || "",
    requirement: row.requirement || null,
    reason: "",
    notes: "",
    expires_at: toDatetimeLocal(expires),
  };
  exceptionDialog.value = true;
}

async function createException() {
  if (!exceptionForm.value.requirement) {
    $q.notify({ color: "warning", icon: "warning", message: "This violation has no linked rule ID for exception creation" });
    return;
  }
  savingException.value = true;
  try {
    await axios.post("/compliance/exceptions/", {
      agent_id: exceptionForm.value.agent_id,
      agent_hostname: exceptionForm.value.agent_hostname,
      requirement: exceptionForm.value.requirement,
      reason: exceptionForm.value.reason,
      notes: exceptionForm.value.notes,
      expires_at: new Date(exceptionForm.value.expires_at).toISOString(),
    });
    $q.notify({ color: "positive", icon: "shield", message: "Exception created" });
    exceptionDialog.value = false;
    await refreshComplianceCenter();
  } finally {
    savingException.value = false;
  }
}

function optionLabelByValue(options: AnyRecord[], value: any) {
  return options.find((option) => String(option.value) === String(value))?.label || "";
}

function mergeOptions(current: AnyRecord[], incoming: AnyRecord[]) {
  const byValue = new Map(current.map((item) => [String(item.value), item]));
  incoming.forEach((item) => byValue.set(String(item.value), item));
  return Array.from(byValue.values()).sort((a: AnyRecord, b: AnyRecord) =>
    String(a.label || "").localeCompare(String(b.label || ""))
  );
}

function complianceScopeLabel(scope: string) {
  return complianceScopeOptions.find((option) => option.value === scope)?.label || scope || "Unknown";
}

function compliancePolicyLevelLabel(level: string) {
  return compliancePolicyLevelOptions.find((option) => option.value === level)?.label || level || "Unknown";
}

function compliancePolicyLevelColor(level: string) {
  return {
    critical: "negative",
    high: "deep-orange",
    medium: "warning",
    low: "positive",
    none: "grey",
  }[level] || "grey";
}

function osFamilyLabel(value: string) {
  return osFamilyOptions.find((option) => option.value === (value || ""))?.label || value || "All / any OS";
}

function complianceTargetLabel(policy: AnyRecord) {
  if (policy.target_label) return policy.target_label;
  if (policy.scope === "device") {
    return optionLabelByValue(scopeAgentOptions.value, policy.target_agent_id) || policy.target_agent_id || "Specific device";
  }
  if (policy.scope === "device_group") {
    return optionLabelByValue(scopeDeviceGroupOptions.value, policy.target_device_group_id) || `Device group #${policy.target_device_group_id}`;
  }
  if (policy.scope === "user_group") {
    return optionLabelByValue(scopeUserGroupOptions.value, policy.target_user_group_id) || `User group #${policy.target_user_group_id}`;
  }
  if (policy.scope === "user") {
    return optionLabelByValue(scopeUserOptions.value, policy.target_user_id) || `User #${policy.target_user_id}`;
  }
  return "All devices";
}

function settledData(result: PromiseSettledResult<any>, fallback: any) {
  return result.status === "fulfilled" ? result.value.data : fallback;
}

function reportKey(report: AnyRecord) {
  return String(report.name || "compliance-report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function exportStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function csvValue(value: any) {
  const text = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: AnyRecord[]) {
  if (!rows.length) return "No records\n";
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return [
    headers.map(csvValue).join(","),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(",")),
  ].join("\n");
}

function saveTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function reportRows(report: AnyRecord) {
  const key = reportKey(report);
  if (key.includes("critical-violations")) {
    return violations.value
      .filter((item) => item.status === "open" && ["critical", "high"].includes(item.severity))
      .map((item) => ({
        device: item.agent_hostname || item.agent_id,
        agent_id: item.agent_id,
        requirement: item.requirement_name,
        level: item.level_name,
        severity: item.severity,
        status: item.status,
        first_seen: formatDate(item.first_seen_at),
        last_seen: formatDate(item.last_seen_at),
      }));
  }
  if (key.includes("bitlocker")) {
    return devices.value.map((device) => ({
      device: device.agent_hostname || device.hostname || device.agent_id,
      agent_id: device.agent_id,
      status: device.effective_status,
      risk_score: device.risk_score,
      access_state: device.access_state,
      encryption_signal: inferSignal(normalizeFailures(device), ["bitlocker", "disk", "encrypt", "recovery key"]),
      top_failures: ensureArray(device.top_failing_requirements).join("; "),
      last_check: formatDate(device.last_check_at || device.last_evaluated_at),
    }));
  }
  if (key.includes("cyber-secure")) {
    return ensureArray(scaResults.value?.items).map((item) => ({
      agent_id: item.agent_id,
      hostname: item.hostname || item.agent_hostname,
      policy: item.policy_name || item.policy_id,
      check: item.check_title || item.check_id,
      result: item.result,
      severity: item.severity,
      fetched_at: formatDate(item.fetched_at),
    }));
  }
  if (key.includes("exceptions")) {
    return exceptions.value.map((item) => ({
      device: item.agent_hostname || item.agent_id,
      agent_id: item.agent_id,
      requirement: item.requirement_name,
      reason: item.reason,
      status: item.is_active ? "active" : "inactive",
      expires_at: formatDate(item.expires_at),
      created_at: formatDate(item.created_at),
      approved_by: item.created_by || item.approved_by,
    }));
  }
  return [
    { metric: "Compliance score", value: `${complianceScore.value}%` },
    { metric: "Total devices", value: totalDevices.value },
    { metric: "Compliant devices", value: compliantDevices.value },
    { metric: "Open violations", value: openViolations.value },
    { metric: "Critical open violations", value: criticalOpenViolations.value },
    { metric: "Blocked access", value: blockedDevices.value },
    { metric: "Stale devices", value: staleDevices.value },
    ...sourceHealth.value.map((source) => ({
      metric: `Source: ${source.name}`,
      value: source.status,
      details: source.detail,
    })),
  ];
}

function downloadReport(report: AnyRecord) {
  const key = reportKey(report);
  const stamp = exportStamp();
  if (key.includes("company-compliance-summary")) {
    saveTextFile(
      `${key}-${stamp}.json`,
      JSON.stringify({
        generated_at: new Date().toISOString(),
        compliance_score: complianceScore.value,
        device_summary: reportSummary.value?.device_summary || statusCounts.value,
        source_health: sourceHealth.value,
        top_violations: topViolations.value,
      }, null, 2),
      "application/json;charset=utf-8",
    );
  } else {
    saveTextFile(`${key}-${stamp}.csv`, rowsToCsv(reportRows(report)), "text/csv;charset=utf-8");
  }
  $q.notify({ color: "positive", icon: "download", message: `${report.name} exported` });
}

function ensureArray(value: any) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function parseAppList(value: string) {
  return String(value || "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFailures(device: AnyRecord) {
  const values = [
    ...(Array.isArray(device.top_failing_requirements) ? device.top_failing_requirements : []),
    ...(Array.isArray(device.evidence_summary) ? device.evidence_summary.map((item: any) => JSON.stringify(item)) : []),
  ];
  return values.map((item) => String(item || "").toLowerCase());
}

function inferSignal(failures: string[], keys: string[]) {
  if (!failures.length) return "pass";
  return failures.some((item) => keys.some((key) => item.includes(key))) ? "fail" : "unknown";
}

function cyberSignal(agentId: string) {
  const failed = ensureArray(scaResults.value?.items).some((item) => item.agent_id === agentId && item.result === "failed");
  if (failed) return "fail";
  if ((cyberSummary.value?.results_total || 0) > 0) return "pass";
  return "unknown";
}

function mostCommon(items: string[]) {
  const counts = items.reduce((acc: AnyRecord, item) => {
    const key = String(item || "").trim();
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "";
}

function riskLevel(score: number) {
  if (score >= 80) return "Critical";
  if (score >= 51) return "High";
  if (score >= 21) return "Medium";
  return "Low";
}

function riskColor(risk: string) {
  return { Critical: "negative", High: "deep-orange", Medium: "warning", Low: "positive" }[risk] || "grey";
}

function statusLabel(status: string) {
  return {
    compliant: "Compliant",
    pending: "Warning",
    non_compliant: "Non-Compliant",
    stale: "Stale",
    unknown: "Unknown",
  }[status] || status || "Unknown";
}

function statusColor(status: string) {
  return {
    compliant: "positive",
    pending: "warning",
    non_compliant: "negative",
    stale: "orange",
    unknown: "grey",
  }[status] || "grey";
}

function statusIcon(status: string) {
  return {
    compliant: "check_circle",
    pending: "error",
    non_compliant: "cancel",
    stale: "schedule",
    unknown: "help",
  }[status] || "help";
}

function severityColor(severity: string) {
  return { critical: "negative", high: "deep-orange", medium: "warning", low: "grey-7" }[severity] || "grey";
}

function violationStatusColor(status: string) {
  return { open: "negative", acknowledged: "orange", resolved: "positive" }[status] || "grey";
}

function remediationStageColor(stage: string) {
  return { detected: "orange", acting: "primary", escalated: "negative", verifying: "teal", resolved: "positive", failed: "negative" }[stage] || "grey";
}

function signalIcon(value: string) {
  return { pass: "check_circle", fail: "cancel", warning: "error", unknown: "help" }[value] || "help";
}

function signalColor(value: string) {
  return { pass: "positive", fail: "negative", warning: "warning", unknown: "grey" }[value] || "grey";
}

function signalTooltip(value: string) {
  return { pass: "Passed or no active failure", fail: "Failed signal detected", warning: "Degraded or stale", unknown: "No fresh evidence" }[value] || "No data";
}

function sourceTypeLabel(sourceType: string) {
  return {
    compliance_check: "Agent check",
    security_baseline: "Device health",
    custom_script: "Custom script",
    wazuh_sca: "Cyber Secure",
    external_integration: "External",
    manual: "Manual",
  }[sourceType] || sourceType || "Manual";
}

function ruleConditionLabel(rule: AnyRecord) {
  const definition = rule.rule_definition || {};
  if (definition.kind === "app_inventory") {
    const apps = ensureArray(definition.apps || definition.expected_apps).join(", ");
    const mode = appRuleModeOptions.find((option) => option.value === definition.mode)?.label || "Application inventory";
    return `${mode}: ${apps || "no apps"}`;
  }
  if (definition.kind === "field_condition") {
    return `${definition.source || "device_health"}:${definition.field} ${definition.operator || "eq"} ${definition.expected}`;
  }
  if (definition.kind === "custom_script") {
    return `${rule.source_key || "script"} output = ${definition.expected_output || "compliant"}`;
  }
  if (definition.kind === "wazuh_sca") {
    return `Cyber Secure ${definition.policy_id || rule.source_key || "policy"} pass rate >= ${Math.round(Number(definition.required_pass_rate || 0.9) * 100)}%`;
  }
  return rule.description || rule.source_key || "Manual requirement";
}

function eventIcon(event: AnyRecord) {
  if (event.source_type === "wazuh_sca" || event.source_key?.includes("sca")) return "verified_user";
  if (event.source_key?.toLowerCase().includes("bitlocker")) return "enhanced_encryption";
  if (event.source_key?.toLowerCase().includes("dlp")) return "policy";
  return "warning";
}

function freshnessLabel(value: string, stale: boolean) {
  if (stale) return "Stale";
  if (!value) return "Unknown";
  const ageHours = (Date.now() - new Date(value).getTime()) / 36e5;
  if (ageHours > 24) return "Stale";
  if (ageHours > 4) return "Aging";
  return "Fresh";
}

function freshnessColor(row: AnyRecord) {
  return { Fresh: "positive", Aging: "warning", Stale: "negative", Unknown: "grey" }[row.freshness] || "grey";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function stringify(value: any) {
  return JSON.stringify(value ?? {}, null, 2);
}

function errorMessage(err: any) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Request failed";
  if (typeof data === "string") return data;
  const first = Object.values(data)[0];
  return Array.isArray(first) ? String(first[0]) : String(first || "Request failed");
}

function toDatetimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

onMounted(refreshComplianceCenter);
</script>

<style scoped>
.compliance-center {
  background: #f7f8fa;
  min-height: 100%;
}

.cc-topbar {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.cc-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.cc-search {
  min-width: 280px;
}

.cc-filter {
  min-width: 170px;
}

.cc-kpi-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(280px, 1.2fr) repeat(5, minmax(150px, 1fr));
}

.cc-kpi,
.cc-panel,
.cc-source {
  background: #fff;
  border: 1px solid #dfe4ea;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.cc-kpi {
  min-height: 126px;
  padding: 16px;
}

.cc-score {
  grid-column: span 1;
}

.cc-kpi-title {
  color: #667085;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.cc-kpi-value {
  color: #17202a;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 8px;
}

.cc-kpi-caption {
  color: #667085;
  font-size: 12px;
  margin-top: 14px;
}

.cc-source-strip {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
}

.cc-source {
  min-height: 78px;
  padding: 12px 14px;
}

.cc-tabs {
  background: #fff;
  border: 1px solid #dfe4ea;
  border-radius: 8px 8px 0 0;
  padding: 0 8px;
}

.cc-panels {
  background: transparent;
}

.cc-panel {
  min-height: 100%;
  padding: 16px;
}

.cc-panel-head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cc-panel-title {
  color: #17202a;
  font-size: 16px;
  font-weight: 700;
}

.cc-status-stack {
  display: grid;
  gap: 14px;
}

.cc-status-row {
  display: grid;
  gap: 6px;
}

.cc-status-label {
  color: #344054;
  font-weight: 600;
}

.cc-dialog {
  min-width: 560px;
  max-width: 760px;
}

.cc-wide-dialog {
  width: 80vw;
  max-width: 980px;
}

.cc-json-label {
  color: #667085;
  font-size: 12px;
  font-weight: 700;
  margin-top: 12px;
  text-transform: uppercase;
}

.cc-readiness-number {
  color: #17202a;
  font-size: 46px;
  font-weight: 800;
  line-height: 1;
  margin: 12px 0;
}

pre {
  background: #f2f4f7;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  font-size: 12px;
  max-height: 280px;
  overflow: auto;
  padding: 10px;
  white-space: pre-wrap;
}

@media (max-width: 1320px) {
  .cc-kpi-grid {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  .cc-source-strip {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 720px) {
  .cc-topbar {
    display: block;
  }

  .cc-actions {
    justify-content: stretch;
    margin-top: 12px;
  }

  .cc-actions > * {
    flex: 1 1 100%;
  }

  .cc-kpi-grid,
  .cc-source-strip {
    grid-template-columns: 1fr;
  }

  .cc-search,
  .cc-filter {
    min-width: 0;
  }

  .cc-dialog,
  .cc-wide-dialog {
    min-width: 0;
    width: 94vw;
  }
}
</style>
