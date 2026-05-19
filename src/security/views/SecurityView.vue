<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">
      {{ $t("security.views.SecurityView.fd1b86") }}
    </div>

    <!-- DLP Policy Dialog -->
    <DLPPolicyDialog
      v-if="dlpDialogOpen"
      :model-value="dlpDialogOpen"
      :item="editingDLP"
      @close="
        dlpDialogOpen = false;
        editingDLP = null;
      "
      @saved="loadDLP"
      @open-email-test="openEmailDLPTest"
    />

    <q-tabs
      v-model="tab"
      dense
      no-caps
      outside-arrows
      mobile-arrows
      class="q-mb-md"
      align="left"
      :breakpoint="0"
    >
      <q-tab
        name="health"
        :label="$t('security.views.SecurityView.767b92')"
        icon="monitor_heart"
      />
      <q-tab
        name="health-policy"
        :label="$t('security.views.SecurityView.a7eaf8')"
        icon="tune"
      />
      <q-tab
        name="incidents"
        :label="$t('security.views.SecurityView.5e326b')"
        icon="warning"
      />
      <q-tab
        name="fim"
        :label="$t('security.views.SecurityView.9ddccd')"
        icon="file_present"
      />
      <q-tab
        name="usb"
        :label="$t('security.views.SecurityView.4cbfd6')"
        icon="usb"
      />
      <q-tab
        name="dlp"
        :label="$t('security.views.SecurityView.4fbcdf')"
        icon="security"
      />
      <q-tab
        name="peripheral-requests"
        :label="$t('security.views.SecurityView.0d5cdf')"
        icon="pending_actions"
      />
      <q-tab
        name="remediation"
        :label="$t('security.views.SecurityView.55f522')"
        icon="build_circle"
      />
      <q-tab
        name="forensics"
        :label="$t('security.views.SecurityView.9c7ab2')"
        icon="search"
      />
      <q-tab
        name="ueba"
        :label="$t('security.views.SecurityView.037b6f')"
        icon="psychology"
      />
      <q-tab
        name="threat-intel"
        :label="$t('security.views.SecurityView.7e2a18')"
        icon="radar"
      />
      <q-tab
        name="mic-control"
        :label="$t('security.views.SecurityView.365edb')"
        icon="mic_off"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Device Health -->
      <q-tab-panel name="health">
        <!-- Summary cards -->
        <div class="row q-gutter-md q-mb-md">
          <q-card
            v-for="(count, status) in healthSummary"
            :key="status"
            class="col-12 col-sm-5 col-md-2"
          >
            <q-card-section class="text-center">
              <q-icon
                :name="healthIcon(status)"
                :color="healthColor(status)"
                size="2rem"
              />
              <div class="text-h4 q-mt-xs">{{ count }}</div>
              <div class="text-caption">{{ status }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Aggregate performance charts for selected device -->
        <div class="q-mb-md">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <div class="text-subtitle1">
              {{ $t("security.views.SecurityView.6cb9fd") }}
            </div>
            <q-input
              v-model="chartAgentId"
              :label="$t('security.views.SecurityView.b51973')"
              dense
              outlined
              clearable
              style="min-width: 220px"
              @update:model-value="loadAgentHealthHistory"
            />
            <q-btn
              color="primary"
              dense
              icon="refresh"
              @click="loadAgentHealthHistory"
            />
          </div>
          <div class="row q-gutter-md" v-if="agentHealthHistory.length > 0">
            <div class="col-12 col-sm-5 col-md-3">
              <HealthChart
                :title="$t('security.views.SecurityView.decb09')"
                :data="agentHealthHistory.map((h) => h.cpu_usage || 0)"
              />
            </div>
            <div class="col-12 col-sm-5 col-md-3">
              <HealthChart
                :title="$t('security.views.SecurityView.78d3a7')"
                :data="agentHealthHistory.map((h) => h.memory_usage || 0)"
              />
            </div>
            <div class="col-12 col-sm-5 col-md-3">
              <HealthChart
                :title="$t('security.views.SecurityView.20876c')"
                :data="agentHealthHistory.map((h) => h.disk_usage || 0)"
                :warnThreshold="80"
                :critThreshold="90"
              />
            </div>
          </div>
          <div v-else-if="chartAgentId" class="text-caption text-grey">
            {{ $t("security.views.SecurityView.49910e") }}
          </div>
        </div>

        <!-- Devices table -->
        <q-table
          :rows="devices"
          :columns="healthColumns"
          dense
          row-key="agent_id"
          :loading="loadingHealth"
          :rows-per-page-options="[20, 50, 100]"
          @row-click="
            (_, row) => {
              chartAgentId = row.agent_id;
              loadAgentHealthHistory();
            }
          "
        >
          <template v-slot:body-cell-overall_status="props">
            <q-td :props="props">
              <q-chip
                dense
                :color="healthColor(props.value)"
                text-color="white"
                >{{ props.value }}</q-chip
              >
            </q-td>
          </template>
          <template v-slot:body-cell-cpu_usage="props">
            <q-td :props="props">
              <q-linear-progress
                :value="(props.value || 0) / 100"
                :color="
                  (props.value || 0) > 85
                    ? 'negative'
                    : (props.value || 0) > 70
                      ? 'warning'
                      : 'positive'
                "
                style="
                  width: 80px;
                  display: inline-block;
                  vertical-align: middle;
                "
                class="q-mr-xs"
              />
              {{ Math.round(props.value || 0) }}%
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Incidents -->
      <!-- Health Policy Configuration (func #636-641) -->
      <q-tab-panel name="health-policy">
        <HealthPolicyPanel />
      </q-tab-panel>

      <q-tab-panel name="incidents">
        <div class="row q-gutter-md q-mb-md">
          <q-card
            v-for="(count, sev) in incidentSummary.incidents_by_severity"
            :key="sev"
            class="col-auto"
          >
            <q-card-section class="text-center q-pa-sm">
              <div class="text-h5">{{ count }}</div>
              <div class="text-caption" :class="`text-${severityColor(sev)}`">
                {{ sev }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="row q-gutter-sm q-mb-md items-center">
          <q-select
            v-model="incidentFilter.status"
            :options="incidentStatusOptions"
            :label="$t('security.views.SecurityView.bae7d5')"
            dense
            outlined
            clearable
            emit-value
            map-options
            style="min-width: 140px"
            @update:model-value="loadIncidents"
          />
          <q-select
            v-model="incidentFilter.severity"
            :options="severityOptions"
            :label="$t('security.views.SecurityView.de314f')"
            dense
            outlined
            clearable
            emit-value
            map-options
            style="min-width: 130px"
            @update:model-value="loadIncidents"
          />
          <q-btn
            color="negative"
            icon="add"
            :label="$t('security.views.SecurityView.38bd21')"
            @click="showIncidentDialog()"
          />
          <q-btn
            v-if="selectedIncidents.length > 0"
            color="negative"
            icon="delete_sweep"
            :label="`Mass wipe selected (${selectedIncidents.length})`"
            @click="massWipeSelectedIncidents"
          />
        </div>
        <q-table
          v-model:selected="selectedIncidents"
          :rows="incidents"
          :columns="incidentColumns"
          selection="multiple"
          dense
          row-key="id"
          :loading="loadingIncidents"
        >
          <template v-slot:body-cell-severity="props">
            <q-td :props="props">
              <q-chip
                dense
                :color="severityColor(props.value)"
                text-color="white"
                >{{ props.value }}</q-chip
              >
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                :color="incidentStatusColor(props.value)"
                text-color="white"
                >{{ props.value }}</q-chip
              >
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="edit"
                size="sm"
                @click="showIncidentDialog(props.row)"
              />
              <q-btn
                v-if="
                  props.row.severity === 'critical' ||
                  props.row.incident_type === 'malware'
                "
                flat
                dense
                round
                icon="delete_forever"
                size="sm"
                color="negative"
                @click="massWipeIncident(props.row)"
                :title="$t('security.views.SecurityView.bef365')"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- FIM -->
      <q-tab-panel name="fim">
        <q-tabs v-model="fimTab" dense class="q-mb-md" align="left">
          <q-tab
            name="policies"
            :label="$t('security.views.SecurityView.8d6118')"
            icon="policy"
          />
          <q-tab
            name="events"
            :label="$t('security.views.SecurityView.c5497b')"
            icon="event"
          />
          <q-tab
            name="baseline"
            :label="$t('security.views.SecurityView.e6ab79')"
            icon="compare"
          />
        </q-tabs>
        <q-tab-panels v-model="fimTab">
          <q-tab-panel name="baseline">
            <FIMBaselinePanel />
          </q-tab-panel>

          <q-tab-panel name="policies">
            <div class="row q-gutter-sm q-mb-md">
              <q-btn
                color="primary"
                icon="add"
                :label="$t('security.views.SecurityView.3b5141')"
                @click="showFIMPolicyDialog()"
              />
            </div>
            <q-table
              :rows="fimPolicies"
              :columns="fimPolicyColumns"
              dense
              row-key="id"
              :loading="loadingFIM"
            >
              <template v-slot:body-cell-enabled="props">
                <q-td :props="props"
                  ><q-chip
                    dense
                    :color="props.value ? 'positive' : 'grey'"
                    text-color="white"
                    >{{ props.value ? "Active" : "Off" }}</q-chip
                  ></q-td
                >
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    round
                    icon="send"
                    size="sm"
                    color="primary"
                    @click="deployFIM(props.row)"
                    :title="$t('security.views.SecurityView.fb4192')"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="deleteFIM(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="events">
            <div class="row q-gutter-sm q-mb-md items-center">
              <q-select
                v-model="fimEventFilter.event_type"
                :options="fimEventTypeOptions"
                :label="$t('security.views.SecurityView.2e1d8f')"
                dense
                outlined
                clearable
                emit-value
                map-options
                style="min-width: 130px"
                @update:model-value="loadFIMEvents"
              />
              <q-toggle
                v-model="showUnremediated"
                :label="$t('security.views.SecurityView.aa2f8e')"
                @update:model-value="loadFIMEvents"
              />
            </div>
            <q-table
              :rows="fimEvents"
              :columns="fimEventColumns"
              dense
              row-key="id"
              :loading="loadingFIMEvents"
            >
              <template v-slot:body-cell-remediated="props">
                <q-td :props="props"
                  ><q-chip
                    dense
                    :color="props.value ? 'positive' : 'negative'"
                    text-color="white"
                    >{{ props.value ? "Fixed" : "Open" }}</q-chip
                  ></q-td
                >
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="!props.row.remediated"
                    flat
                    dense
                    round
                    icon="check"
                    size="sm"
                    color="positive"
                    @click="remediateFIMEvent(props.row.id)"
                    :title="$t('security.views.SecurityView.25036c')"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>

      <!-- USB -->
      <q-tab-panel name="usb">
        <div class="row q-gutter-sm q-mb-md">
          <q-btn
            color="primary"
            icon="add"
            :label="$t('security.views.SecurityView.78d02f')"
            @click="showUSBDialog()"
          />
          <q-btn
            color="negative"
            outline
            icon="emergency"
            label="Emergency block storage"
            @click="emergencyUSB"
          />
          <q-btn
            color="primary"
            outline
            icon="schedule"
            label="USB schedules"
            @click="tab = 'peripheral-requests'"
          />
          <q-btn
            flat
            round
            dense
            icon="refresh"
            @click="
              loadUSB();
              loadUSBEvents();
            "
          />
        </div>
        <q-table
          :rows="usbPolicies"
          :columns="usbColumns"
          dense
          row-key="id"
          :loading="loadingUSB"
        >
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props"
              ><q-chip
                dense
                :color="props.value ? 'positive' : 'grey'"
                text-color="white"
                >{{ props.value ? "Active" : "Off" }}</q-chip
              ></q-td
            >
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="edit"
                size="sm"
                @click="showUSBDialog(props.row)"
              />
              <q-btn
                flat
                dense
                round
                icon="send"
                size="sm"
                color="primary"
                @click="deployUSB(props.row)"
                title="Deploy now"
              />
              <q-btn
                flat
                dense
                round
                icon="undo"
                size="sm"
                color="warning"
                @click="revokeUSB(props.row)"
                title="Revoke from devices"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                size="sm"
                color="negative"
                @click="deleteUSB(props.row.id)"
              />
            </q-td>
              </template>
              <template v-slot:body-cell-device_classes="props">
                <q-td :props="props">
                  <q-chip
                    v-for="cls in props.value"
                    :key="cls"
                    dense
                    size="sm"
                    color="blue-grey"
                    text-color="white"
                    class="q-mr-xs"
                  >
                    {{ cls }}
                  </q-chip>
                  <span v-if="!props.value?.length">—</span>
                </q-td>
              </template>
              <template v-slot:body-cell-encrypt_required="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    size="sm"
                    :color="props.value ? 'warning' : 'grey'"
                    text-color="white"
                  >
                    {{ props.value ? "BitLocker required" : "Optional" }}
                  </q-chip>
                </q-td>
              </template>
        </q-table>

        <q-separator class="q-my-md" />

        <div class="row q-gutter-sm q-mb-sm items-center">
          <div class="text-subtitle2">USB usage alerts</div>
          <q-space />
          <q-select
            v-model="usbEventAgentFilter"
            :options="agentOptions"
            label="Agent"
            dense
            outlined
            clearable
            emit-value
            map-options
            style="min-width: 260px"
            @update:model-value="loadUSBEvents"
          />
          <q-btn flat round dense icon="refresh" @click="loadUSBEvents" />
        </div>
        <q-table
          :rows="usbEvents"
          :columns="usbEventColumns"
          dense
          row-key="id"
          :loading="loadingUSBEvents"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template v-slot:body-cell-severity="props">
            <q-td :props="props">
              <q-chip
                dense
                size="sm"
                :color="severityColor(props.value)"
                text-color="white"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                size="sm"
                :color="incidentStatusColor(props.value)"
                text-color="white"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- DLP — full sub-tabbed panel (#842-851) -->
      <q-tab-panel name="dlp">
        <q-tabs
          v-model="dlpSubTab"
          dense
          align="left"
          class="q-mb-md text-grey-8"
          active-color="primary"
          indicator-color="primary"
          :breakpoint="0"
        >
          <q-tab
            name="overview"
            icon="dashboard"
            :label="$t('security.views.SecurityView.0efc2e')"
          />
          <q-tab
            name="policies"
            icon="policy"
            :label="$t('security.views.SecurityView.8d6118')"
          />
          <q-tab name="email" icon="email" label="Email DLP" />
          <q-tab
            name="violations"
            icon="warning"
            :label="$t('security.views.SecurityView.198274')"
          />
          <q-tab
            name="justifications"
            icon="pending_actions"
            :label="$t('security.views.SecurityView.cd3c12')"
            :alert="dlpPendingJustif > 0 ? 'warning' : false"
          />
          <q-tab
            name="quarantine"
            icon="folder_off"
            :label="$t('security.views.SecurityView.7f983c')"
          />
        </q-tabs>

        <q-tab-panels v-model="dlpSubTab" animated>
          <!-- Overview dashboard -->
          <q-tab-panel name="overview" class="q-pa-none">
            <DLPDashboard @go-tab="dlpSubTab = $event" />
          </q-tab-panel>

          <!-- Policies CRUD -->
          <q-tab-panel name="policies">
            <div class="row q-gutter-sm q-mb-md">
              <q-btn
                color="primary"
                icon="add"
                :label="$t('security.views.SecurityView.aeaf69')"
                @click="showDLPDialog()"
              />
            </div>
            <q-table
              :rows="dlpPolicies"
              :columns="dlpColumns"
              dense
              row-key="id"
              :loading="loadingDLP"
            >
              <template v-slot:body-cell-enabled="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="props.value ? 'positive' : 'grey'"
                    text-color="white"
                  >
                    {{ props.value ? "Active" : "Off" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-target="props">
                <q-td :props="props">
                  <div class="ellipsis" style="max-width: 260px">
                    {{ props.value }}
                  </div>
                  <q-tooltip>{{ props.value }}</q-tooltip>
                </q-td>
              </template>
              <template v-slot:body-cell-paths="props">
                <q-td :props="props">
                  <div class="ellipsis" style="max-width: 320px">
                    {{ props.value }}
                  </div>
                  <q-tooltip>{{ props.value }}</q-tooltip>
                </q-td>
              </template>
              <template v-slot:body-cell-block_mode="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="
                      props.value === 'block'
                        ? 'negative'
                        : props.value === 'warn'
                          ? 'warning'
                          : 'grey'
                    "
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value || "monitor" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    round
                    icon="edit"
                    size="sm"
                    @click="showDLPDialog(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="deleteDLP(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Internal Email DLP analog -->
          <q-tab-panel name="email">
            <q-banner
              dense
              class="bg-blue-1 text-blue-10 q-mb-md rounded-borders"
            >
              <template v-slot:avatar>
                <q-icon name="email" color="primary" />
              </template>
              Internal Email DLP scans message bodies and attachments through the
              same DLP classification pipeline used by Windows agents. Use this
              panel to verify policy behavior without Microsoft Graph.
            </q-banner>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-lg-5">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-md">
                      Email sample
                    </div>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <q-input
                          v-model="emailDLPForm.sender"
                          label="Sender"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="emailDLPForm.recipients"
                          label="Recipients"
                          hint="Comma-separated"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="emailDLPForm.subject"
                          label="Subject"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="emailDLPForm.body"
                          label="Message body"
                          type="textarea"
                          rows="4"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-5">
                        <q-input
                          v-model="emailDLPForm.attachment_name"
                          label="Attachment name"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-12 col-md-7">
                        <q-input
                          v-model="emailDLPForm.attachment_content"
                          label="Attachment text"
                          outlined
                          dense
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn
                      color="primary"
                      icon="science"
                      label="Run scan only"
                      :loading="emailDLPTesting"
                      @click="runInternalEmailDLPTest(false)"
                    />
                    <q-btn
                      color="negative"
                      outline
                      icon="outgoing_mail"
                      label="Send live SMTP test"
                      :loading="emailDLPLiveSending"
                      @click="runInternalEmailDLPTest(true)"
                    />
                  </q-card-actions>
                </q-card>
              </div>

              <div class="col-12 col-lg-7">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row items-center q-mb-md">
                      <div class="text-subtitle2">Scan result</div>
                      <q-space />
                      <q-chip
                        v-if="emailDLPResult"
                        dense
                        :color="emailDLPResult.allowed ? 'positive' : 'negative'"
                        text-color="white"
                      >
                        {{ emailDLPResult.allowed ? "Allowed" : "Blocked" }}
                      </q-chip>
                    </div>

                    <div v-if="!emailDLPResult" class="text-grey-7">
                      Run a sample message to see policy match, action, severity,
                      and the created DLP incident.
                    </div>

                    <template v-else>
                      <q-list dense separator>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Action</q-item-label>
                            <q-item-label>
                              <q-chip
                                dense
                                :color="dlpActionColor(emailDLPResult.action)"
                                text-color="white"
                                size="sm"
                              >
                                {{ emailDLPResult.action }}
                              </q-chip>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Policies evaluated</q-item-label>
                            <q-item-label>{{
                              emailDLPResult.policies_evaluated
                            }}</q-item-label>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>Incident</q-item-label>
                            <q-item-label>{{
                              emailDLPResult.incident_id || "—"
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Message</q-item-label>
                            <q-item-label>{{
                              emailDLPResult.message || "—"
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="emailDLPResult.delivery">
                          <q-item-section>
                            <q-item-label caption>SMTP delivery</q-item-label>
                            <q-item-label>
                              {{ emailDLPResult.delivery.delivery || "—" }}
                              <span v-if="emailDLPResult.delivery.recipients">
                                to {{ emailDLPResult.delivery.recipients.join(", ") }}
                              </span>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <q-table
                        class="q-mt-md"
                        :rows="emailDLPResult.violations || []"
                        :columns="emailDLPViolationColumns"
                        dense
                        flat
                        row-key="source"
                        :rows-per-page-options="[5, 10]"
                      >
                        <template v-slot:body-cell-action_taken="props">
                          <q-td :props="props">
                            <q-chip
                              dense
                              :color="dlpActionColor(props.value)"
                              text-color="white"
                              size="sm"
                            >
                              {{ props.value }}
                            </q-chip>
                          </q-td>
                        </template>
                      </q-table>

                      <div class="q-mt-md">
                        <q-btn
                          v-if="emailDLPResult.incident_id"
                          outline
                          color="primary"
                          icon="warning"
                          label="Open DLP violations"
                          @click="
                            dlpViolationFilter = 'email_dlp';
                            dlpSubTab = 'violations';
                            loadDLPViolations();
                          "
                        />
                      </div>
                    </template>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Violations (DLP incidents) -->
          <q-tab-panel name="violations">
            <q-banner
              dense
              class="bg-blue-1 text-blue-10 q-mb-md rounded-borders"
            >
              <template v-slot:avatar
                ><q-icon name="info" color="primary"
              /></template>
              DLP shows sensitive-data policy violations. Use FIM events when
              you need every file create, edit, rename, or delete event.
              <template v-slot:action>
                <q-btn
                  flat
                  dense
                  color="primary"
                  label="Open FIM"
                  @click="
                    tab = 'fim';
                    fimTab = 'events';
                  "
                />
              </template>
            </q-banner>
            <div class="row q-gutter-sm q-mb-md items-center">
              <q-select
                v-model="dlpViolationFilter"
                :options="dlpViolationTypeOptions"
                label="Violation type"
                outlined
                dense
                clearable
                emit-value
                map-options
                style="min-width: 210px"
                @update:model-value="loadDLPViolations"
              />
              <q-select
                v-model="dlpViolationAgentFilter"
                :options="agentOptions"
                label="Agent"
                outlined
                dense
                clearable
                emit-value
                map-options
                style="min-width: 260px"
                @update:model-value="loadDLPViolations"
              />
              <q-input
                v-model="dlpViolationSearch"
                label="Search file, keyword, policy"
                outlined
                dense
                clearable
                style="min-width: 280px"
              >
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
              <q-btn
                flat
                round
                dense
                icon="refresh"
                @click="loadDLPViolations"
              />
              <q-btn
                color="primary"
                outline
                icon="science"
                label="Test DLP"
                @click="openDLPTestDialog"
              />
              <q-chip
                v-if="dlpTestWatching"
                dense
                color="info"
                text-color="white"
                icon="visibility"
              >
                Watching test events
              </q-chip>
              <q-btn
                v-if="dlpTestWatching"
                flat
                dense
                icon="stop"
                label="Stop"
                @click="stopDLPTestWatch"
              />
            </div>
            <q-table
              :rows="filteredDLPViolations"
              :columns="violationColumns"
              dense
              row-key="id"
              :loading="loadingDLPViolations"
              :rows-per-page-options="[20, 50, 100]"
              wrap-cells
            >
              <template v-slot:body-cell-file_path="props">
                <q-td :props="props">
                  <div class="ellipsis" style="max-width: 340px">
                    {{ props.value || "—" }}
                  </div>
                  <q-tooltip v-if="props.value">{{ props.value }}</q-tooltip>
                </q-td>
              </template>
              <template v-slot:body-cell-violation_type="props">
                <q-td :props="props">
                  <q-chip dense color="blue-grey" text-color="white" size="sm">
                    {{ props.value || "—" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-severity="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="severityColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="incidentStatusColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-action_taken="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="dlpActionColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value || "logged" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    round
                    icon="visibility"
                    size="sm"
                    @click="showDLPIncidentDetails(props.row)"
                  >
                    <q-tooltip>Open event details</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- User Justifications -->
          <q-tab-panel name="justifications" class="q-pa-none q-pt-sm">
            <DLPJustificationPanel
              @update:pending="dlpPendingJustif = $event"
            />
          </q-tab-panel>

          <!-- Quarantine -->
          <q-tab-panel name="quarantine">
            <div class="row q-gutter-sm q-mb-md">
              <q-toggle
                v-model="quarantineActiveOnly"
                :label="$t('security.views.SecurityView.e5a176')"
                @update:model-value="loadDLPQuarantine"
              />
              <q-btn
                flat
                round
                dense
                icon="refresh"
                @click="loadDLPQuarantine"
              />
            </div>
            <q-table
              :rows="dlpQuarantine"
              :columns="quarantineColumns"
              dense
              row-key="id"
              :loading="loadingDLPQuarantine"
              :rows-per-page-options="[20, 50, 100]"
            >
              <template v-slot:body-cell-restored="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="props.value ? 'positive' : 'warning'"
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value ? "Restored" : "Quarantined" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="!props.row.restored"
                    flat
                    dense
                    round
                    icon="restore"
                    size="sm"
                    color="positive"
                    @click="remediateQuarantine(props.row, 'release')"
                  >
                    <q-tooltip>{{
                      $t("security.views.SecurityView.7aabe4")
                    }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="!props.row.restored"
                    flat
                    dense
                    round
                    icon="delete_forever"
                    size="sm"
                    color="negative"
                    @click="remediateQuarantine(props.row, 'destroy')"
                  >
                    <q-tooltip>Destroy quarantined payload</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="!props.row.restored"
                    flat
                    dense
                    round
                    icon="rule"
                    size="sm"
                    color="warning"
                    @click="
                      remediateQuarantine(props.row, 'require_justification')
                    "
                  >
                    <q-tooltip>Require user justification</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    round
                    icon="notifications"
                    size="sm"
                    color="primary"
                    @click="remediateQuarantine(props.row, 'notify_user')"
                  >
                    <q-tooltip>Notify user</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>

      <!-- Peripheral Access Requests (func #702, #709, #721) -->
      <q-tab-panel name="peripheral-requests">
        <PeripheralRequestsPanel />
      </q-tab-panel>

      <!-- Remediation Workflows (func #670-676) -->
      <q-tab-panel name="remediation">
        <RemediationPanel />
      </q-tab-panel>

      <!-- Forensics & IR (func #782-791) -->
      <q-tab-panel name="forensics">
        <q-banner
          v-if="forensicsError"
          class="bg-negative text-white q-mb-md"
          rounded
          dense
        >
          {{ forensicsError }}
        </q-banner>
        <q-banner
          v-if="forensicsAuditError"
          class="bg-warning text-dark q-mb-md"
          rounded
          dense
        >
          {{ forensicsAuditError }}
        </q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">
              {{ $t("security.views.SecurityView.f0b81f") }}
            </div>
            <div class="mdm-section-subtitle">
              {{ $t("security.views.SecurityView.9a102e") }}
            </div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="negative"
              icon="block"
              :label="$t('security.views.SecurityView.85ae03')"
              @click="promptIsolateDevice"
            />
            <q-btn
              color="deep-orange"
              outline
              icon="rule"
              label="Non-compliance carve"
              @click="showNonComplianceForensicWizard"
            />
            <q-btn
              color="warning"
              icon="collecting_bag"
              :label="$t('security.views.SecurityView.4d9904')"
              @click="openForensicJobDialog"
            />
            <q-btn
              color="primary"
              icon="schedule"
              label="File carving policy"
              @click="openForensicPolicyDialog()"
            />
            <q-btn
              outline
              color="primary"
              icon="settings"
              label="Forensics settings"
              @click="openForensicSettingsDialog"
            />
            <q-btn
              outline
              color="primary"
              icon="picture_as_pdf"
              label="Export PDF"
              :disable="!forensicsReport"
              @click="exportForensicsPdf"
            />
          </div>
        </div>

        <div
          v-if="forensicsReport?.stats && !forensicsError"
          class="row q-gutter-md q-mb-md"
        >
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">{{ forensicsReport.stats.total ?? 0 }}</div>
              <div class="text-caption">
                {{ $t("security.views.SecurityView.fa5c52") }}
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">
                {{ forensicsReport.stats.running ?? 0 }}
              </div>
              <div class="text-caption">
                {{ $t("security.views.SecurityView.73989d") }}
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">
                {{ forensicsReport.stats.completed ?? 0 }}
              </div>
              <div class="text-caption">
                {{ $t("security.views.SecurityView.1798b3") }}
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">{{ forensicsReport.stats.failed ?? 0 }}</div>
              <div class="text-caption">
                {{ $t("security.views.SecurityView.09fef5") }}
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">
                {{ forensicsReport.stats.evidence_bundles ?? 0 }}
              </div>
              <div class="text-caption">Evidence bundles</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col">
            <q-card-section class="text-center">
              <div class="text-h5">
                {{ forensicsReport.stats.encrypted_bundles ?? 0 }}
              </div>
              <div class="text-caption">Encrypted</div>
            </q-card-section>
          </q-card>
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div>
                <div class="text-subtitle2">File carving policies</div>
                <div class="text-caption text-grey">
                  Scoped and scheduled forensic collection policies.
                </div>
              </div>
              <q-btn
                flat
                color="primary"
                icon="refresh"
                label="Refresh"
                @click="loadForensicPolicies"
              />
            </div>
            <q-table
              :rows="forensicPolicies"
              :columns="forensicPolicyColumns"
              dense
              row-key="id"
              :loading="loadingForensicPolicies"
              :rows-per-page-options="[5, 10, 25]"
            >
              <template v-slot:body-cell-enabled="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="props.value ? 'positive' : 'grey'"
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value ? "Enabled" : "Disabled" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    icon="edit"
                    size="sm"
                    @click="openForensicPolicyDialog(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="deleteForensicPolicy(props.row)"
                  />
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-pa-md text-grey">
                  No file carving policies configured.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- IR Timeline -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">
              {{ $t("security.views.SecurityView.2965ee") }}
            </div>
            <q-table
              :rows="forensicCases"
              :columns="forensicColumns"
              dense
              row-key="id"
              :loading="loadingForensics"
              :rows-per-page-options="[10, 25]"
            >
              <template v-slot:body-cell-severity="props">
                <q-td :props="props">
                  <span :class="`severity-${props.value.toLowerCase()}`">{{
                    props.value
                  }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    :color="forensicStatusColor(props.value)"
                    text-color="white"
                    size="sm"
                    >{{ props.value }}</q-chip
                  >
                </q-td>
              </template>
              <template v-slot:body-cell-only_non_compliant="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    size="sm"
                    :color="props.value ? 'deep-orange' : 'grey'"
                    text-color="white"
                  >
                    {{ props.value ? "Non-compliant only" : "Any status" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-artifact_count="props">
                <q-td :props="props">
                  {{ forensicArtifactCount(props.row) }}
                </q-td>
              </template>
              <template v-slot:body-cell-manifest_sha256="props">
                <q-td :props="props">
                  <span v-if="props.value">
                    {{ props.value.slice(0, 12) }}...
                    <q-tooltip>{{ props.value }}</q-tooltip>
                  </span>
                  <span v-else>—</span>
                </q-td>
              </template>
              <template v-slot:body-cell-evidence_bundle_encrypted="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    size="sm"
                    :color="props.value ? 'positive' : 'grey'"
                    text-color="white"
                  >
                    {{ props.value ? "Encrypted" : "Plain" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-av_scan_status="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    size="sm"
                    :color="forensicAvColor(props.value)"
                    text-color="white"
                  >
                    {{ props.value || "not scanned" }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    icon="search"
                    size="sm"
                    @click="openIRCase(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    icon="download"
                    size="sm"
                    color="primary"
                    @click="downloadForensicToolExport(props.row, 'generic')"
                  >
                    <q-tooltip>Download tool export manifest</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="archive"
                    size="sm"
                    color="primary"
                    :disable="!props.row.evidence_bundle_path"
                    @click="downloadForensicEvidence(props.row)"
                  >
                    <q-tooltip>Download evidence ZIP</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="biotech"
                    size="sm"
                    color="secondary"
                    @click="downloadForensicToolExport(props.row, 'autopsy')"
                  >
                    <q-tooltip>Download Autopsy manifest</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="verified_user"
                    size="sm"
                    color="positive"
                    @click="downloadForensicToolExport(props.row, 'chain_of_custody')"
                  >
                    <q-tooltip>Download chain-of-custody manifest</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="arrow_upward"
                    size="sm"
                    color="warning"
                    @click="escalateCase(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    icon="restore"
                    size="sm"
                    color="positive"
                    @click="recoverCase(props.row)"
                  />
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-pa-md text-grey">
                  {{ $t("security.views.SecurityView.28d588") }}
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">
              {{ $t("security.views.SecurityView.e01eac") }}
            </div>
            <q-table
              :rows="forensicAuditTrail"
              :columns="forensicAuditColumns"
              dense
              row-key="id"
              :loading="loadingForensicsAudit"
              :rows-per-page-options="[10, 25, 50]"
            >
              <template v-slot:body-cell-job="props">
                <q-td :props="props">
                  {{ props.row.job || props.row.job_id || "—" }}
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-pa-md text-grey">
                  {{ $t("security.views.SecurityView.e132e0") }}
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Last Resort Block -->
        <q-card flat bordered class="q-mb-md" style="border-color: #dc2626">
          <q-card-section>
            <div class="row items-center q-gutter-sm">
              <q-icon name="dangerous" color="negative" size="24px" />
              <div>
                <div class="text-subtitle2 text-negative">
                  {{ $t("security.views.SecurityView.85f4ee") }}
                </div>
                <div class="text-caption text-grey">
                  {{ $t("security.views.SecurityView.02047b") }}
                </div>
              </div>
              <q-space />
              <q-btn
                color="negative"
                :label="$t('security.views.SecurityView.844269')"
                icon="emergency"
                @click="lastResortBlock"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- UEBA / Continuous Scanning (func #802-811) -->
      <q-tab-panel name="ueba">
        <q-banner
          v-if="uebaError"
          class="bg-negative text-white q-mb-md"
          rounded
          dense
        >
          {{ uebaError }}
        </q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">
              {{ $t("security.views.SecurityView.10ccef") }}
            </div>
            <div class="mdm-section-subtitle">
              {{ $t("security.views.SecurityView.15677e") }}
            </div>
          </div>
          <q-btn
            color="primary"
            icon="download"
            :label="$t('security.views.SecurityView.2e7b10')"
            @click="showSiemExport = true"
          />
        </div>

        <!-- Anomaly overview -->
        <div class="row q-gutter-md q-mb-md">
          <q-card
            v-for="s in uebaStats"
            :key="s.label"
            flat
            bordered
            class="col"
          >
            <q-card-section class="text-center">
              <q-icon :name="s.icon" :color="s.color" size="2rem" />
              <div class="text-h4 q-mt-xs">{{ s.value }}</div>
              <div class="text-caption">{{ s.label }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Anomaly table -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center q-gutter-sm q-mb-sm">
              <div class="text-subtitle2">
                {{ $t("security.views.SecurityView.5f1ac1") }}
              </div>
              <q-space />
              <q-input
                v-model="uebaSearch"
                dense
                outlined
                :placeholder="$t('security.views.SecurityView.6d7a30')"
                style="width: 200px"
                clearable
              />
              <q-select
                v-model="uebaRiskFilter"
                :options="['All', 'Critical', 'High', 'Medium', 'Low']"
                dense
                outlined
                :label="$t('security.views.SecurityView.5a8f23')"
                style="width: 100px"
              />
            </div>
            <q-table
              :rows="filteredAnomalies"
              :columns="uebaColumns"
              dense
              row-key="id"
              :loading="loadingUEBA"
              :rows-per-page-options="[10, 25, 50]"
            >
              <template v-slot:body-cell-risk_score="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-xs">
                    <q-linear-progress
                      :value="props.value / 100"
                      :color="
                        props.value > 75
                          ? 'negative'
                          : props.value > 50
                            ? 'warning'
                            : 'positive'
                      "
                      style="width: 60px"
                    />
                    <span class="text-weight-bold">{{ props.value }}</span>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-pattern="props">
                <q-td :props="props">
                  <q-badge color="primary" :label="props.value" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Continuous Scan Policy -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">
              {{ $t("security.views.SecurityView.27a9cd") }}
            </div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-5">
                <q-toggle
                  v-model="scanPolicy.enabled"
                  :label="$t('security.views.SecurityView.262b2d')"
                />
                <q-select
                  v-model="scanPolicy.interval"
                  :options="['5 minutes', '15 minutes', '30 minutes', '1 hour']"
                  :label="$t('security.views.SecurityView.e9e2e4')"
                  outlined
                  dense
                  class="q-mt-sm"
                />
                <q-select
                  v-model="scanPolicy.artifacts"
                  multiple
                  :options="[
                    'Processes',
                    'Network Connections',
                    'Registry',
                    'File System',
                    'USB Devices',
                  ]"
                  :label="$t('security.views.SecurityView.bf8054')"
                  outlined
                  dense
                  class="q-mt-sm"
                  use-chips
                />
                <q-input
                  v-model.number="scanPolicy.threshold"
                  type="number"
                  :label="$t('security.views.SecurityView.34fa7f')"
                  outlined
                  dense
                  class="q-mt-sm"
                  :min="0"
                  :max="100"
                />
              </div>
              <div class="col-12 col-md-5">
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.a2c0fa") }}
                </div>
                <q-toggle
                  v-model="scanPolicy.autoIsolate"
                  :label="$t('security.views.SecurityView.4c2ce8')"
                  color="negative"
                />
                <q-toggle
                  v-model="scanPolicy.autoAlert"
                  :label="$t('security.views.SecurityView.98fa0c')"
                  class="q-mt-xs"
                />
                <q-toggle
                  v-model="scanPolicy.autoBlock"
                  :label="$t('security.views.SecurityView.651344')"
                  class="q-mt-xs"
                />
                <div class="q-mt-md">
                  <q-btn
                    color="primary"
                    :label="$t('security.views.SecurityView.9292a8')"
                    @click="saveScanPolicy"
                  />
                </div>
                <q-separator class="q-my-md" />
                <div class="text-subtitle2 q-mb-sm">
                  Credential breach response
                </div>
                <q-select
                  v-model="credentialRiskForm.agent_id"
                  :options="agentOptions"
                  emit-value
                  map-options
                  label="Device"
                  outlined
                  dense
                />
                <q-input
                  v-model="credentialRiskForm.username"
                  label="User"
                  outlined
                  dense
                  class="q-mt-sm"
                />
                <q-input
                  v-model.number="credentialRiskForm.risk_score"
                  type="number"
                  min="0"
                  max="100"
                  label="Risk score"
                  outlined
                  dense
                  class="q-mt-sm"
                />
                <q-select
                  v-model="credentialRiskForm.response_action"
                  :options="credentialRiskActionOptions"
                  emit-value
                  map-options
                  label="Response"
                  outlined
                  dense
                  class="q-mt-sm"
                />
                <q-btn
                  color="negative"
                  icon="lock"
                  label="Send credential risk event"
                  class="q-mt-sm"
                  :disable="!credentialRiskForm.agent_id"
                  @click="sendCredentialRiskEvent"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Threat Intelligence (func #763, #790) -->
      <q-tab-panel name="threat-intel">
        <q-banner
          v-if="threatIntelError"
          class="bg-negative text-white q-mb-md"
          rounded
          dense
        >
          {{ threatIntelError }}
        </q-banner>
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">
              {{ $t("security.views.SecurityView.9ee56c") }}
            </div>
            <div class="mdm-section-subtitle">
              {{ $t("security.views.SecurityView.f5ac29") }}
            </div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="primary"
              icon="add"
              :label="$t('security.views.SecurityView.70f259')"
              @click="showAddIOC = true"
            />
            <q-btn
              outline
              color="primary"
              icon="sync"
              :label="$t('security.views.SecurityView.195748')"
              @click="syncThreatFeed"
            />
          </div>
        </div>

        <div class="row q-gutter-md">
          <!-- IOC List -->
          <div class="col-12 col-md-7">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.b381bd") }}
                </div>
                <q-input
                  v-model="iocSearch"
                  dense
                  outlined
                  :placeholder="$t('security.views.SecurityView.54467c')"
                  class="q-mb-sm"
                  clearable
                />
                <q-table
                  :rows="iocList"
                  :columns="iocColumns"
                  dense
                  row-key="id"
                  :rows-per-page-options="[10, 25]"
                >
                  <template v-slot:body-cell-type="props">
                    <q-td :props="props"
                      ><q-badge
                        :color="iocTypeColor(props.value)"
                        :label="props.value"
                    /></q-td>
                  </template>
                  <template v-slot:body-cell-severity="props">
                    <q-td :props="props"
                      ><span :class="`severity-${props.value.toLowerCase()}`">{{
                        props.value
                      }}</span></q-td
                    >
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        dense
                        icon="delete"
                        color="negative"
                        size="sm"
                        @click="removeIOC(props.row.id)"
                      />
                    </q-td>
                  </template>
                  <template v-slot:no-data>
                    <div class="text-center q-pa-md text-grey">
                      {{ $t("security.views.SecurityView.71f01e") }}
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>

          <!-- MITRE ATT&CK -->
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.74e6ef") }}
                </div>
                <div class="text-caption text-grey q-mb-sm">
                  {{
                    mitreCoverageNote ||
                    "Estimated from IOCs and open incidents (not a full ATT&CK mapping)."
                  }}
                </div>
                <div
                  v-if="mitreTactics.length === 0"
                  class="text-caption text-grey"
                >
                  {{ $t("security.views.SecurityView.371750") }}
                </div>
                <div
                  v-for="tactic in mitreTactics"
                  :key="tactic.id"
                  class="q-mb-sm"
                >
                  <div class="row items-center q-gutter-xs">
                    <q-icon
                      :name="
                        tactic.covered
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="tactic.covered ? 'positive' : 'grey'"
                      size="16px"
                    />
                    <span class="text-body2">{{ tactic.name }}</span>
                    <q-space />
                    <q-badge
                      :color="tactic.covered ? 'positive' : 'grey'"
                      :label="`${tactic.techniques} techniques`"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Threat Feed Status -->
            <q-card flat bordered class="q-mt-md">
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.f67f19") }}
                </div>
                <q-item v-for="feed in threatFeeds" :key="feed.name" dense>
                  <q-item-section avatar
                    ><q-icon
                      :name="feed.enabled ? 'check_circle' : 'cancel'"
                      :color="feed.enabled ? 'positive' : 'negative'"
                  /></q-item-section>
                  <q-item-section
                    >{{ feed.name }}<br /><span class="text-caption text-grey"
                      >Updated: {{ feed.last_synced || "Never" }}</span
                    ></q-item-section
                  >
                  <q-item-section side
                    ><q-toggle v-model="feed.enabled" dense disable
                  /></q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- Microphone Control (func #705, #710-712) -->
      <q-tab-panel name="mic-control">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="mdm-section-title">
              {{ $t("security.views.SecurityView.203f11") }}
            </div>
            <div class="mdm-section-subtitle">
              {{ $t("security.views.SecurityView.34b3dc") }}
            </div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="warning"
              icon="mic_off"
              :label="$t('security.views.SecurityView.bc8b3e')"
              @click="muteMeetingMode"
            />
            <q-btn
              color="negative"
              icon="emergency"
              :label="$t('security.views.SecurityView.59d4d1')"
              @click="emergencyMicAccess"
            />
          </div>
        </div>

        <div class="row q-gutter-md">
          <!-- App-specific restrictions -->
          <div class="col-12 col-md-7">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.1bee67") }}
                </div>
                <div class="text-caption text-grey q-mb-sm">
                  {{ $t("security.views.SecurityView.6673ea") }}
                </div>
                <q-table
                  :rows="micAppRules"
                  :columns="micAppColumns"
                  dense
                  row-key="id"
                  :rows-per-page-options="[10, 25]"
                >
                  <template v-slot:body-cell-allowed="props">
                    <q-td :props="props">
                      <q-toggle
                        v-model="props.row.allowed"
                        dense
                        @update:model-value="updateMicRule(props.row)"
                      />
                    </q-td>
                  </template>
                  <template v-slot:top>
                    <q-btn
                      color="primary"
                      icon="add"
                      :label="$t('security.views.SecurityView.c220f6')"
                      dense
                      @click="showAddMicRule = true"
                    />
                  </template>
                </q-table>
              </q-card-section>
            </q-card>

            <!-- Microphone Event Log (#710) -->
            <q-card flat bordered class="q-mt-md">
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="text-subtitle2">
                    {{ $t("security.views.SecurityView.431477") }}
                  </div>
                  <q-space />
                  <q-toggle
                    v-model="micLoggingEnabled"
                    :label="$t('security.views.SecurityView.bd49c8')"
                    dense
                    @update:model-value="toggleMicLogging"
                  />
                </div>
                <q-table
                  :rows="micEvents"
                  :columns="micEventColumns"
                  dense
                  row-key="id"
                  :rows-per-page-options="[10, 25]"
                >
                  <template v-slot:no-data>
                    <div class="text-center q-pa-md text-grey">
                      {{ $t("security.views.SecurityView.515aea") }}
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>

          <!-- Mass management & Emergency -->
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  {{ $t("security.views.SecurityView.0dce1c") }}
                </div>
                <div class="text-caption text-grey q-mb-sm">
                  {{ $t("security.views.SecurityView.71bdac") }}
                </div>
                <q-select
                  v-model="micMeetingDevices"
                  multiple
                  use-chips
                  :options="deviceOptions"
                  :label="$t('security.views.SecurityView.2e5e7b')"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-select
                  v-model="micMeetingDuration"
                  :options="[
                    '30 min',
                    '1 hour',
                    '2 hours',
                    'Until Manually Released',
                  ]"
                  :label="$t('security.views.SecurityView.137000')"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-input
                  v-model="micMeetingReason"
                  label="Meeting / incident reason"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-btn
                  color="warning"
                  :label="$t('security.views.SecurityView.0ae271')"
                  class="full-width"
                  @click="applyMeetingMode"
                />
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mt-md" style="border-color: #059669">
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm text-positive">
                  {{ $t("security.views.SecurityView.00a153") }}
                </div>
                <div class="text-caption text-grey q-mb-sm">
                  {{ $t("security.views.SecurityView.599454") }}
                </div>
                <q-select
                  v-model="emergencyMicDevice"
                  :options="deviceOptions"
                  :label="$t('security.views.SecurityView.a5a74a')"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-input
                  v-model="emergencyMicReason"
                  :label="$t('security.views.SecurityView.0c76fd')"
                  outlined
                  dense
                  class="q-mb-sm"
                />
                <q-btn
                  color="positive"
                  :label="$t('security.views.SecurityView.025611')"
                  class="full-width"
                  @click="grantEmergencyMic"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Incident Dialog -->
    <q-dialog v-model="incidentDialogOpen" persistent>
      <q-card style="min-width: 500px">
        <q-bar
          >{{ editingIncident ? "Update" : "Report" }} Security Incident<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="incidentForm.agent_id"
            :label="$t('security.views.SecurityView.779675')"
            outlined
            dense
          />
          <q-input
            v-model="incidentForm.title"
            :label="$t('security.views.SecurityView.961697')"
            outlined
            dense
          />
          <q-select
            v-model="incidentForm.incident_type"
            :options="incidentTypeOptions"
            :label="$t('security.views.SecurityView.3deb74')"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-model="incidentForm.severity"
            :options="severityOptions"
            :label="$t('security.views.SecurityView.de314f')"
            outlined
            dense
            emit-value
            map-options
          />
          <q-select
            v-model="incidentForm.status"
            :options="incidentStatusOptions"
            :label="$t('security.views.SecurityView.bae7d5')"
            outlined
            dense
            emit-value
            map-options
          />
          <q-input
            v-model="incidentForm.description"
            :label="$t('security.views.SecurityView.55f8eb')"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="negative"
            :label="editingIncident ? 'Update' : 'Report'"
            @click="saveIncident"
            :loading="savingIncident"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- USB Policy Dialog -->
    <q-dialog v-model="usbDialogOpen" persistent>
      <q-card style="min-width: 620px; max-width: 92vw">
        <q-bar
          >{{ editingUSB ? "Edit" : "New" }} USB Policy<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="usbForm.name"
            :label="$t('security.views.SecurityView.d145bb')"
            outlined
            dense
          />
          <q-select
            v-model="usbForm.policy_type"
            :options="[
              { label: 'Block All', value: 'block_all' },
              { label: 'Read-Only', value: 'read_only' },
              { label: 'Whitelist', value: 'whitelist' },
              { label: 'Blacklist', value: 'blacklist' },
              { label: 'Allow All', value: 'allow_all' },
            ]"
            :label="$t('security.views.SecurityView.80b88f')"
            outlined
            dense
            emit-value
            map-options
          />
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-5">
              <q-select
                v-model="usbForm.scope"
                :options="usbScopeOptions"
                label="Scope"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="onUSBScopeChanged"
              />
            </div>
            <div class="col-12 col-sm-7">
              <q-select
                v-if="usbForm.scope === 'device'"
                v-model="usbForm.target_agent_id"
                :options="agentOptions"
                label="Target device"
                outlined
                dense
                clearable
                emit-value
                map-options
                use-input
                input-debounce="200"
              />
              <q-select
                v-else-if="usbForm.scope === 'device_group'"
                v-model="usbForm.target_device_group_id"
                :options="forensicDeviceGroupOptions"
                label="Target device group"
                outlined
                dense
                clearable
                emit-value
                map-options
                use-input
                input-debounce="200"
              />
              <q-select
                v-else-if="usbForm.scope === 'user'"
                v-model="usbForm.target_user_id"
                :options="usbUserOptions"
                label="Target user"
                outlined
                dense
                clearable
                emit-value
                map-options
                use-input
                input-debounce="200"
              />
              <q-select
                v-else-if="usbForm.scope === 'user_group'"
                v-model="usbForm.target_user_group_id"
                :options="usbUserGroupOptions"
                label="Target user group"
                outlined
                dense
                clearable
                emit-value
                map-options
                use-input
                input-debounce="200"
              />
              <q-field v-else outlined dense label="Target" stack-label>
                <template #control>
                  <div class="self-center text-grey-7">All Windows devices</div>
                </template>
              </q-field>
            </div>
          </div>
          <q-select
            v-model="usbForm.blocked_device_classes"
            :options="usbClassOptions"
            label="Blocked device classes"
            outlined
            dense
            multiple
            use-chips
            emit-value
            map-options
          />
          <q-select
            v-model="usbForm.allowed_device_classes"
            :options="usbClassOptions"
            label="Allowed device classes"
            outlined
            dense
            multiple
            use-chips
            emit-value
            map-options
          />
          <q-input
            v-model="usbAllowedIdsInput"
            label="Allowed USB IDs"
            hint="One VID/PID, hardware ID, or instance prefix per line"
            type="textarea"
            rows="2"
            outlined
            dense
          />
          <q-input
            v-model="usbBlockedIdsInput"
            label="Blocked USB IDs"
            hint="One VID/PID, hardware ID, or instance prefix per line"
            type="textarea"
            rows="2"
            outlined
            dense
          />
          <q-toggle
            v-model="usbForm.encrypt_required"
            :label="$t('security.views.SecurityView.273ef9')"
          />
          <q-toggle
            v-model="usbForm.emergency_mode"
            label="Emergency policy"
          />
          <q-input
            v-if="usbForm.emergency_mode"
            v-model="usbForm.emergency_reason"
            label="Emergency reason"
            outlined
            dense
          />
          <q-toggle
            v-model="usbForm.log_usage"
            :label="$t('security.views.SecurityView.25e802')"
          />
          <q-toggle
            v-model="usbForm.alert_on_connect"
            :label="$t('security.views.SecurityView.d166b1')"
          />
          <q-toggle
            v-model="usbForm.enabled"
            :label="$t('security.views.SecurityView.df174a')"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="primary"
            :label="editingUSB ? 'Save' : 'Create'"
            @click="saveUSB"
            :loading="savingUSB"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- FIM Policy Dialog -->
    <q-dialog v-model="fimDialogOpen" persistent>
      <q-card style="min-width: 700px; max-width: 92vw">
        <q-bar
          >{{ editingFIM ? "Edit" : "New" }} FIM Policy<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="fimForm.name"
            :label="$t('security.views.SecurityView.d145bb')"
            outlined
            dense
          />
          <q-input
            v-model="monitoredPathsInput"
            :label="$t('security.views.SecurityView.8572ae')"
            outlined
            dense
            @update:model-value="
              fimForm.monitored_paths = monitoredPathsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="excludedPathsInput"
            :label="$t('security.views.SecurityView.0796c1')"
            outlined
            dense
            @update:model-value="
              fimForm.excluded_paths = excludedPathsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="excludedExtensionsInput"
            :label="$t('security.views.SecurityView.ce94f9')"
            outlined
            dense
            @update:model-value="
              fimForm.excluded_extensions = excludedExtensionsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="ignorePatternsInput"
            :label="$t('security.views.SecurityView.71356c')"
            outlined
            dense
            @update:model-value="
              fimForm.file_ignore_patterns = ignorePatternsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="registryPathsInput"
            :label="$t('security.views.SecurityView.f83a70')"
            outlined
            dense
            @update:model-value="
              fimForm.monitored_registry_paths = registryPathsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="registryIgnoreInput"
            :label="$t('security.views.SecurityView.78e29d')"
            outlined
            dense
            @update:model-value="
              fimForm.registry_ignore = registryIgnoreInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            "
          />
          <q-input
            v-model="fimForm.scan_schedule_cron"
            :label="$t('security.views.SecurityView.d49088')"
            outlined
            dense
          />
          <q-input
            v-model.number="fimForm.diff_size_limit_mb"
            :label="$t('security.views.SecurityView.7a533c')"
            type="number"
            min="1"
            outlined
            dense
          />
          <q-toggle
            v-model="fimForm.realtime_monitoring"
            :label="$t('security.views.SecurityView.56ef57')"
          />
          <q-toggle
            v-model="fimForm.whodata_monitoring"
            :label="$t('security.views.SecurityView.03f3c2')"
          />
          <q-toggle
            v-model="fimForm.report_changes"
            :label="$t('security.views.SecurityView.088645')"
          />
          <q-toggle
            v-model="fimForm.scan_on_start"
            :label="$t('security.views.SecurityView.2c454f')"
          />
          <q-toggle
            v-model="fimForm.check_md5sum"
            :label="$t('security.views.SecurityView.60b2a7')"
          />
          <q-toggle
            v-model="fimForm.check_sha1sum"
            :label="$t('security.views.SecurityView.53e6bd')"
          />
          <q-toggle
            v-model="fimForm.check_sha256sum"
            :label="$t('security.views.SecurityView.30e5df')"
          />
          <q-toggle
            v-model="fimForm.alert_on_change"
            :label="$t('security.views.SecurityView.20e14d')"
          />
          <q-toggle
            v-model="fimForm.alert_on_delete"
            :label="$t('security.views.SecurityView.e52edd')"
          />
          <q-toggle
            v-model="fimForm.alert_on_create"
            :label="$t('security.views.SecurityView.afb927')"
          />
          <q-toggle
            v-model="fimForm.enabled"
            :label="$t('security.views.SecurityView.df174a')"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="primary"
            :label="editingFIM ? 'Save' : 'Create'"
            @click="saveFIM"
            :loading="savingFIM"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddIOC" persistent>
      <q-card style="min-width: 460px">
        <q-bar
          >{{ $t("security.views.SecurityView.70f259") }}<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="newIOCForm.indicator"
            :label="$t('security.views.SecurityView.c4d194')"
            outlined
            dense
          />
          <q-select
            v-model="newIOCForm.ioc_type"
            :options="['IP', 'Domain', 'URL', 'Hash', 'CVE', 'Email']"
            :label="$t('security.views.SecurityView.3deb74')"
            outlined
            dense
          />
          <q-select
            v-model="newIOCForm.severity"
            :options="['Low', 'Medium', 'High', 'Critical']"
            :label="$t('security.views.SecurityView.de314f')"
            outlined
            dense
          />
          <q-input
            v-model="newIOCForm.source"
            :label="$t('security.views.SecurityView.6da13a')"
            outlined
            dense
          />
          <q-input
            v-model="newIOCForm.description"
            :label="$t('security.views.SecurityView.55f8eb')"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="primary"
            :label="$t('security.views.SecurityView.61cc55')"
            @click="addIOC"
            :loading="loadingIOC"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showForensicWizard" persistent>
      <q-card style="min-width: 680px; max-width: 92vw">
        <q-bar
          >{{ $t("security.views.SecurityView.4d9904") }}<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="forensicWizardForm.agent_id"
                :options="agentOptions"
                emit-value
                map-options
                :label="$t('security.views.SecurityView.9a36d7')"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="forensicWizardForm.title"
                :label="$t('security.views.SecurityView.961697')"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="forensicWizardForm.reason"
                :label="$t('security.views.SecurityView.f219cc')"
                outlined
                dense
                type="textarea"
                rows="2"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="forensicWizardForm.job_types"
                multiple
                use-chips
                :options="forensicJobTypeOptions"
                emit-value
                map-options
                :label="$t('security.views.SecurityView.46c4fc')"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="forensicWizardForm.approval_status"
                :options="[
                  { label: 'No approval required', value: 'not_required' },
                  { label: 'Approved now', value: 'approved' },
                  { label: 'Draft / needs approval', value: 'pending' },
                ]"
                emit-value
                map-options
                :label="$t('security.views.SecurityView.8cc047')"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="forensicKeywordsInput"
                :label="$t('security.views.SecurityView.4772c3')"
                outlined
                dense
                @update:model-value="updateForensicKeywords"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="forensicPathGlobsInput"
                :label="$t('security.views.SecurityView.9473c2')"
                outlined
                dense
                @update:model-value="updateForensicPathGlobs"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="forensicWizardForm.min_size_bytes"
                :label="$t('security.views.SecurityView.4d3b4d')"
                type="number"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="forensicWizardForm.max_size_bytes"
                :label="$t('security.views.SecurityView.57ce27')"
                type="number"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="forensicWizardForm.engine"
                :options="forensicEngineOptions"
                emit-value
                map-options
                :label="$t('security.views.SecurityView.c1f65d')"
                outlined
                dense
              />
            </div>

            <div class="col-12" v-if="forensicWizardForm.engine !== 'builtin'">
              <q-input
                v-model="forensicWizardForm.external_ref"
                label="External case / flow reference"
                outlined
                dense
               />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="forensicWizardForm.modified_after"
                label="Modified after"
                type="datetime-local"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="forensicWizardForm.modified_before"
                label="Modified before"
                type="datetime-local"

                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-toggle
                v-model="forensicWizardForm.only_non_compliant"
                :label="$t('security.views.SecurityView.f6b2b7')"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="warning"
            :label="$t('security.views.SecurityView.abcceb')"
            @click="submitForensicJob"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showForensicPolicyDialog" persistent>
      <q-card style="min-width: 760px; max-width: 94vw">
        <q-bar
          >{{
            editingForensicPolicy
              ? "Edit file carving policy"
              : "New file carving policy"
          }}<q-space /><q-btn dense flat icon="close" v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-input
                v-model="forensicPolicyForm.name"
                label="Policy name"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-toggle v-model="forensicPolicyForm.enabled" label="Enabled" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="forensicPolicyForm.scope"
                :options="forensicScopeOptions"
                emit-value
                map-options
                label="Scope"
                outlined
                dense
              />
            </div>
            <div
              class="col-12 col-md-6"
              v-if="forensicPolicyForm.scope === 'device'"
            >
              <q-select
                v-model="forensicPolicyForm.target_agent_id"
                :options="agentOptions"
                emit-value
                map-options
                label="Target device"
                outlined
                dense
                clearable
              />
            </div>
            <div
              class="col-12 col-md-6"
              v-else-if="forensicPolicyForm.scope === 'device_group'"
            >
              <q-select
                v-model="forensicPolicyForm.target_device_group_id"
                :options="forensicDeviceGroupOptions"
                emit-value
                map-options
                label="Target device group"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="forensicPolicyForm.job_types"
                multiple
                use-chips
                emit-value
                map-options
                :options="forensicJobTypeOptions"
                label="Collectors"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="forensicPolicyKeywordsInput"
                label="Keywords, comma-separated"
                outlined
                dense
                @update:model-value="updateForensicPolicyKeywords"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="forensicPolicyPathGlobsInput"
                label="Path globs, comma-separated"
                outlined
                dense
                @update:model-value="updateForensicPolicyPathGlobs"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model.number="forensicPolicyForm.min_size_bytes"
                label="Min size bytes"
                type="number"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model.number="forensicPolicyForm.max_size_bytes"
                label="Max size bytes"
                type="number"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="forensicPolicyForm.modified_after"
                label="Modified after"
                type="datetime-local"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="forensicPolicyForm.modified_before"
                label="Modified before"
                type="datetime-local"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="forensicPolicyForm.schedule_cron"
                label="Schedule cron"
                hint="Leave empty for manual-only. Example: */30 * * * *"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="forensicPolicyForm.engine"
                :options="['builtin', 'velociraptor']"
                label="Engine"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-toggle
                v-model="forensicPolicyForm.only_non_compliant"
                label="Only non-compliant"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            :label="editingForensicPolicy ? 'Save policy' : 'Create policy'"
            @click="submitForensicPolicy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showForensicSettingsDialog" persistent>
      <q-card style="min-width: 760px; max-width: 94vw">
        <q-bar>
          Forensics settings
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-toggle
            v-model="forensicSettingsForm.evidence_encryption_enabled"
            label="Encrypt evidence bundles before upload"
          />
          <q-input
            v-model="forensicSettingsForm.evidence_public_key_pem"
            label="Corporate public key or certificate PEM"
            hint="Paste an RSA public key or certificate. The Windows agent encrypts the ZIP with AES-256-GCM and wraps the key with RSA-OAEP."
            outlined
            dense
            type="textarea"
            rows="8"
          />
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-toggle
                v-model="forensicSettingsForm.velociraptor_enabled"
                label="Velociraptor sync"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="forensicSettingsForm.velociraptor_api_url"
                label="Velociraptor API URL"
                outlined
                dense
              />
            </div>
          </div>
          <q-input
            v-model="forensicSettingsForm.notes"
            label="Notes"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save settings"
            :loading="savingForensicSettings"
            @click="saveForensicSettings"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSiemExport" persistent>
      <q-card style="min-width: 460px">
        <q-bar
          >{{ $t("security.views.SecurityView.2e7b10") }}<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <div class="text-body2">
            {{ $t("security.views.SecurityView.4fb0a1") }}
          </div>
          <q-input
            v-model="siemExportFilename"
            :label="$t('security.views.SecurityView.a3cbb9')"
            outlined
            dense
          />
          <div class="text-caption text-grey">
            Records to export: {{ filteredAnomalies.length }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="primary"
            :label="$t('security.views.SecurityView.5755f9')"
            @click="exportUebaToCsv"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddMicRule" persistent>
      <q-card style="min-width: 460px">
        <q-bar
          >{{ $t("security.views.SecurityView.c220f6") }}<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="newMicRule.app"
            :label="$t('security.views.SecurityView.e1c180')"
            outlined
            dense
          />
          <q-input
            v-model="newMicRule.exe"
            :label="$t('security.views.SecurityView.c9c5f8')"
            outlined
            dense
          />
          <q-toggle
            v-model="newMicRule.allowed"
            :label="$t('security.views.SecurityView.bf8f96')"
          />
          <div class="text-caption text-grey">
            {{ $t("security.views.SecurityView.39f8d0") }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('security.views.SecurityView.77dfd2')"
            v-close-popup
          />
          <q-btn
            color="primary"
            :label="$t('security.views.SecurityView.05c412')"
            @click="addMicRule"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dlpTestDialogOpen" persistent>
      <q-card style="min-width: 720px; max-width: 92vw">
        <q-bar
          >DLP policy test<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section class="q-gutter-md">
          <q-banner dense class="bg-blue-1 text-blue-10 rounded-borders">
            <template v-slot:avatar
              ><q-icon name="science" color="primary"
            /></template>
            Use this to generate a sensitive file on the endpoint, then watch
            DLP violations in real time.
          </q-banner>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="dlpTestForm.agent_id"
                :options="agentOptions"
                emit-value
                map-options
                clearable
                label="Target agent"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="dlpTestForm.folder_path"
                label="Folder to watch"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                v-model="dlpTestForm.file_name"
                label="File name"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="dlpTestForm.content"
                label="Sensitive sample content"
                outlined
                dense
                type="textarea"
                rows="2"
              />
            </div>
            <div class="col-12">
              <q-input
                :model-value="dlpTestPowerShell"
                label="PowerShell to run on the agent"
                outlined
                dense
                readonly
                type="textarea"
                rows="5"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            outline
            color="primary"
            icon="content_copy"
            label="Copy PowerShell"
            @click="copyDLPTestCommand"
          />
          <q-btn
            color="primary"
            icon="visibility"
            label="Watch Events"
            @click="startDLPTestWatch"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dlpIncidentDetailsOpen">
      <q-card style="min-width: 720px; max-width: 92vw">
        <q-bar
          >DLP event details<q-space /><q-btn
            dense
            flat
            icon="close"
            v-close-popup
        /></q-bar>
        <q-card-section>
          <q-list dense separator>
            <q-item>
              <q-item-section
                ><q-item-label caption>File path</q-item-label
                ><q-item-label>{{
                  selectedDLPIncident?.file_path ||
                  selectedDLPIncident?.details?.file_path ||
                  "—"
                }}</q-item-label></q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section
                ><q-item-label caption>Violation</q-item-label
                ><q-item-label>{{
                  selectedDLPIncident?.violation_type ||
                  selectedDLPIncident?.details?.violation_type ||
                  "—"
                }}</q-item-label></q-item-section
              >
              <q-item-section
                ><q-item-label caption>Matched keyword</q-item-label
                ><q-item-label>{{
                  selectedDLPIncident?.matched_keyword ||
                  selectedDLPIncident?.details?.matched_keyword ||
                  "—"
                }}</q-item-label></q-item-section
              >
              <q-item-section
                ><q-item-label caption>Action</q-item-label
                ><q-item-label>{{
                  selectedDLPIncident?.action_taken ||
                  selectedDLPIncident?.details?.action_taken ||
                  "—"
                }}</q-item-label></q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section
                ><q-item-label caption>Policy</q-item-label
                ><q-item-label>{{
                  selectedDLPIncident?.policy_name ||
                  selectedDLPIncident?.details?.policy_name ||
                  selectedDLPIncident?.policy_id ||
                  selectedDLPIncident?.details?.policy_id ||
                  "—"
                }}</q-item-label></q-item-section
              >
              <q-item-section
                ><q-item-label caption>Hash</q-item-label
                ><q-item-label class="ellipsis">{{
                  selectedDLPIncident?.file_hash ||
                  selectedDLPIncident?.details?.file_hash ||
                  "—"
                }}</q-item-label></q-item-section
              >
            </q-item>
          </q-list>
          <q-input
            class="q-mt-md"
            :model-value="
              JSON.stringify(selectedDLPIncident?.details || {}, null, 2)
            "
            label="Raw details"
            outlined
            readonly
            type="textarea"
            rows="8"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useQuasar, copyToClipboard, exportFile } from "quasar";
import { useRoute } from "vue-router";
import axios from "axios";
import HealthChart from "@/security/components/HealthChart.vue";
import FIMBaselinePanel from "@/security/components/FIMBaselinePanel.vue";
import HealthPolicyPanel from "@/security/components/HealthPolicyPanel.vue";
import PeripheralRequestsPanel from "@/security/components/PeripheralRequestsPanel.vue";
import DLPPolicyDialog from "@/security/components/DLPPolicyDialog.vue";
import DLPDashboard from "@/security/components/DLPDashboard.vue";
import DLPJustificationPanel from "@/security/components/DLPJustificationPanel.vue";
import { exportDataToCSV } from "@/reports/utils/exportDataToCSV";
import { defineAsyncComponent } from "vue";
const RemediationPanel = defineAsyncComponent(
  () => import("@/security/components/RemediationPanel.vue"),
);

const $q = useQuasar();
const route = useRoute();
const tab = ref("health");
const fimTab = ref("policies");
const tabByRouteName: Record<string, string> = {
  SecurityCenter: "health",
  SecurityEmailDLP: "dlp",
  SecurityPeripheralControls: "peripheral-requests",
  SecurityPeripheralRequests: "peripheral-requests",
  SecurityUsbControls: "usb",
  SecurityMicrophoneControls: "mic-control",
  Forensics: "forensics",
  UEBA: "ueba",
};

// Performance chart data
const chartAgentId = ref("");
const agentHealthHistory = ref<any[]>([]);
const agentOptions = ref<{ label: string; value: string }[]>([]);

async function loadAgentHealthHistory() {
  if (!chartAgentId.value) {
    agentHealthHistory.value = [];
    return;
  }
  try {
    const resp = await axios.get(`/security/health/${chartAgentId.value}/`);
    if (resp.data) {
      agentHealthHistory.value = [resp.data];
    }
  } catch (e: any) {
    agentHealthHistory.value = [];
    $q.notify({
      message: _apiErrMessage(e, "Failed to load health history"),
      color: "negative",
    });
  }
}

async function loadAgentOptions() {
  try {
    const response = await axios.get("/agents/", {
      params: { detail: "false" },
    });
    const list = Array.isArray(response.data)
      ? response.data
      : (response.data?.agents ?? []);
    agentOptions.value = list.map((agent: any) => ({
      label: agent.hostname ?? agent.agent_id,
      value: agent.agent_id,
    }));
  } catch (e: any) {
    agentOptions.value = [];
    $q.notify({
      message: _apiErrMessage(e, "Failed to load agent list"),
      color: "negative",
    });
  }
}

async function loadUSBScopeOptions() {
  const [usersResp, groupsResp] = await Promise.allSettled([
    axios.get("/accounts/users/"),
    axios.get("/accounts/user-groups/"),
  ]);

  if (usersResp.status === "fulfilled") {
    const list = Array.isArray(usersResp.value.data)
      ? usersResp.value.data
      : (usersResp.value.data?.results ?? []);
    usbUserOptions.value = list
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        value: user.id,
        label:
          user.display_name ||
          user.full_name ||
          user.username ||
          user.sam_account_name ||
          user.email ||
          `User #${user.id}`,
      }));
  } else {
    usbUserOptions.value = [];
  }

  if (groupsResp.status === "fulfilled") {
    const list = Array.isArray(groupsResp.value.data)
      ? groupsResp.value.data
      : (groupsResp.value.data?.results ?? []);
    usbUserGroupOptions.value = list
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        value: group.id,
        label:
          group.display_name ||
          group.name ||
          group.sam_account_name ||
          `User group #${group.id}`,
      }));
  } else {
    usbUserGroupOptions.value = [];
  }
}

function syncTabFromRoute() {
  const routeName = String(route.name ?? "");
  if (tabByRouteName[routeName]) {
    tab.value = tabByRouteName[routeName];
    if (routeName === "SecurityEmailDLP") {
      dlpSubTab.value = "email";
    }
    return;
  }

  const queryTab = route.query.tab;
  if (typeof queryTab === "string" && queryTab) {
    tab.value = queryTab;
  }
  const queryDlpTab = route.query.dlp;
  if (typeof queryDlpTab === "string" && queryDlpTab) {
    dlpSubTab.value = queryDlpTab;
  }
}

const devices = ref<any[]>([]);
const incidents = ref<any[]>([]);
const selectedIncidents = ref<any[]>([]);
const fimPolicies = ref<any[]>([]);
const fimEvents = ref<any[]>([]);
const usbPolicies = ref<any[]>([]);
const usbEvents = ref<any[]>([]);
const usbEventAgentFilter = ref<string | null>(null);
const dlpPolicies = ref<any[]>([]);
const healthSummary = ref<Record<string, number>>({});
const incidentSummary = ref<any>({
  incidents_by_severity: {},
  incidents_by_status: {},
  fim_unremediated: 0,
});

const loadingHealth = ref(false);
const loadingIncidents = ref(false);
const loadingFIM = ref(false);
const loadingFIMEvents = ref(false);
const loadingUSB = ref(false);
const loadingUSBEvents = ref(false);
const loadingDLP = ref(false);
const dlpDialogOpen = ref(false);
const editingDLP = ref<any>(null);
// DLP sub-tabs
const dlpSubTab = ref("overview");
const dlpPendingJustif = ref(0);
// DLP Violations tab
const dlpViolations = ref<any[]>([]);
const loadingDLPViolations = ref(false);
const dlpViolationFilter = ref<string | null>(null);
const dlpViolationAgentFilter = ref<string | null>(null);
const dlpViolationSearch = ref("");
const dlpTestDialogOpen = ref(false);
const dlpTestWatching = ref(false);
const dlpIncidentDetailsOpen = ref(false);
const selectedDLPIncident = ref<any>(null);
let dlpTestPollTimer: ReturnType<typeof setInterval> | null = null;
const dlpTestForm = ref({
  agent_id: "",
  folder_path: "C:\\12",
  file_name: "pass.txt",
  content: "password=Secret123!",
});
// DLP Quarantine tab
const dlpQuarantine = ref<any[]>([]);
const loadingDLPQuarantine = ref(false);
const quarantineActiveOnly = ref(true);
const emailDLPTesting = ref(false);
const emailDLPLiveSending = ref(false);
const emailDLPResult = ref<any>(null);
const emailDLPForm = ref({
  sender: "noreply@it-laborato.ru",
  recipients: "",
  subject: "Secret export",
  body: "password=Secret123!",
  attachment_name: "secret.txt",
  attachment_content: "api_key=ABCDEFGHIJKLMNOP123456",
});

const dlpViolationTypeOptions = [
  { label: "All violations", value: "All" },
  { label: "PII detected", value: "pii_detected" },
  { label: "Keyword match", value: "keyword_match" },
  { label: "Custom pattern match", value: "custom_pattern_match" },
  { label: "Credential", value: "credential" },
  { label: "Cloud sync", value: "cloud_sync" },
  { label: "Network upload", value: "network_upload" },
  { label: "USB transfer", value: "usb_transfer" },
  { label: "Email DLP", value: "email_dlp" },
  { label: "Auto encrypt", value: "auto_encrypt" },
  { label: "Network DLP health", value: "network_dlp_health" },
];
const emailDLPViolationColumns = [
  { name: "source", label: "Source", field: "source", align: "left" as const },
  { name: "policy_name", label: "Policy", field: "policy_name", align: "left" as const },
  { name: "level", label: "Level", field: "level", align: "center" as const },
  { name: "score", label: "Score", field: "score", align: "center" as const },
  {
    name: "action_taken",
    label: "Action",
    field: "action_taken",
    align: "center" as const,
  },
];
const violationColumns = [
  {
    name: "occurred_at",
    label: "Time",
    field: "occurred_at",
    align: "left" as const,
    sortable: true,
    format: (v: string) => (v ? new Date(v).toLocaleString() : "—"),
  },
  {
    name: "agent_id",
    label: "Agent",
    field: "agent_id",
    align: "left" as const,
  },
  {
    name: "file_path",
    label: "File path",
    field: (row: any) => dlpDetail(row, "file_path"),
    align: "left" as const,
  },
  {
    name: "violation_type",
    label: "Type",
    field: (row: any) => dlpDetail(row, "violation_type"),
    align: "center" as const,
  },
  {
    name: "matched_keyword",
    label: "Match",
    field: (row: any) => dlpDetail(row, "matched_keyword"),
    align: "left" as const,
  },
  {
    name: "policy_name",
    label: "Policy",
    field: (row: any) =>
      dlpDetail(row, "policy_name") || dlpDetail(row, "policy_id"),
    align: "left" as const,
  },
  {
    name: "action_taken",
    label: "Action",
    field: (row: any) => dlpDetail(row, "action_taken"),
    align: "center" as const,
  },
  {
    name: "severity",
    label: "Severity",
    field: "severity",
    align: "center" as const,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];
const quarantineColumns = [
  {
    name: "quarantined_at",
    label: "Time",
    field: "quarantined_at",
    align: "left" as const,
    sortable: true,
    format: (v: string) => (v ? new Date(v).toLocaleString() : "—"),
  },
  {
    name: "agent_id",
    label: "Agent",
    field: "agent_id",
    align: "left" as const,
  },
  {
    name: "original_path",
    label: "File",
    field: "original_path",
    align: "left" as const,
    format: (v: string) => (v ? v.split(/[\\/]/).pop() : "—"),
  },
  {
    name: "violation_type",
    label: "Reason",
    field: "violation_type",
    align: "center" as const,
  },
  {
    name: "restored",
    label: "Status",
    field: "restored",
    align: "center" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

const incidentFilter = ref({ status: null, severity: null });
const fimEventFilter = ref({ event_type: null });
const showUnremediated = ref(false);

const incidentDialogOpen = ref(false);
const usbDialogOpen = ref(false);
const fimDialogOpen = ref(false);
const editingIncident = ref<any>(null);
const editingUSB = ref<any>(null);
const editingFIM = ref<any>(null);
const savingIncident = ref(false);
const savingUSB = ref(false);
const savingFIM = ref(false);
const usbAllowedIdsInput = ref("");
const usbBlockedIdsInput = ref("");

const monitoredPathsInput = ref("");
const excludedPathsInput = ref("");
const excludedExtensionsInput = ref("");
const ignorePatternsInput = ref("");
const registryPathsInput = ref("");
const registryIgnoreInput = ref("");
const incidentForm = ref<any>({
  agent_id: "",
  title: "",
  incident_type: "other",
  severity: "medium",
  status: "open",
  description: "",
});
const usbForm = ref<any>({
  name: "",
  policy_type: "read_only",
  allowed_device_ids: [],
  blocked_device_ids: [],
  allowed_device_classes: [],
  blocked_device_classes: [],
  scope: "global",
  target_agent_id: "",
  target_device_group_id: null,
  target_user_id: null,
  target_user_group_id: null,
  encrypt_required: false,
  log_usage: true,
  alert_on_connect: false,
  emergency_mode: false,
  emergency_reason: "",
  enabled: true,
});
const fimForm = ref<any>({
  name: "",
  monitored_paths: [],
  excluded_paths: [],
  excluded_extensions: [],
  file_ignore_patterns: [],
  monitored_registry_paths: [],
  registry_ignore: [],
  scan_schedule_cron: "0 * * * *",
  realtime_monitoring: true,
  whodata_monitoring: false,
  report_changes: false,
  scan_on_start: false,
  check_md5sum: true,
  check_sha1sum: true,
  check_sha256sum: true,
  diff_size_limit_mb: 5,
  alert_on_change: true,
  alert_on_delete: true,
  alert_on_create: true,
  enabled: true,
});

const severityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];
const incidentStatusOptions = [
  { label: "Open", value: "open" },
  { label: "Investigating", value: "investigating" },
  { label: "Resolved", value: "resolved" },
  { label: "False Positive", value: "false_positive" },
];
const incidentTypeOptions = [
  { label: "Malware", value: "malware" },
  { label: "Unauthorized USB", value: "unauthorized_usb" },
  { label: "FIM Violation", value: "fim_violation" },
  { label: "Compliance Breach", value: "compliance_breach" },
  { label: "DLP Violation", value: "dlp_violation" },
  { label: "Brute Force", value: "brute_force" },
  { label: "Other", value: "other" },
];
const usbClassOptions = [
  { label: "Mass storage", value: "mass_storage" },
  { label: "HID keyboard/mouse", value: "hid" },
  { label: "Printer", value: "printer" },
  { label: "Imaging / camera", value: "imaging" },
  { label: "Audio", value: "audio" },
  { label: "Smart card", value: "smart_card" },
  { label: "MTP / portable device", value: "mtp" },
  { label: "Network adapter", value: "network" },
  { label: "Serial / modem", value: "serial" },
];
const usbScopeOptions = [
  { label: "Global (all devices)", value: "global" },
  { label: "Specific device", value: "device" },
  { label: "Device group", value: "device_group" },
  { label: "Specific user", value: "user" },
  { label: "User group", value: "user_group" },
];
const usbUserOptions = ref<{ label: string; value: number }[]>([]);
const usbUserGroupOptions = ref<{ label: string; value: number }[]>([]);
const fimEventTypeOptions = [
  { label: "Created", value: "created" },
  { label: "Modified", value: "modified" },
  { label: "Deleted", value: "deleted" },
  { label: "Renamed", value: "renamed" },
];

function healthColor(s: string) {
  return (
    {
      healthy: "positive",
      warning: "warning",
      critical: "negative",
      unknown: "grey",
    }[s] ?? "grey"
  );
}
function healthIcon(s: string) {
  return (
    {
      healthy: "check_circle",
      warning: "warning",
      critical: "error",
      unknown: "help",
    }[s] ?? "device_unknown"
  );
}
function severityColor(s: string) {
  return (
    { low: "info", medium: "warning", high: "orange", critical: "negative" }[
      s
    ] ?? "grey"
  );
}
function incidentStatusColor(s: string) {
  return (
    {
      open: "negative",
      investigating: "warning",
      resolved: "positive",
      false_positive: "grey",
    }[s] ?? "grey"
  );
}
function dlpActionColor(action: string) {
  return (
    {
      logged: "info",
      warned: "warning",
      blocked: "negative",
      blocked_justification_denied: "negative",
      justified: "positive",
      encrypted_efs: "secondary",
      quarantined: "negative",
    }[action] ?? "grey"
  );
}

function dlpDetail(row: any, key: string) {
  return row?.[key] ?? row?.details?.[key] ?? "";
}

function dlpSearchText(row: any) {
  return [
    row.title,
    row.agent_id,
    row.description,
    dlpDetail(row, "file_path"),
    dlpDetail(row, "file_hash"),
    dlpDetail(row, "violation_type"),
    dlpDetail(row, "matched_keyword"),
    dlpDetail(row, "policy_name"),
    dlpDetail(row, "policy_id"),
    dlpDetail(row, "action_taken"),
    dlpDetail(row, "sender"),
    dlpDetail(row, "subject"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const filteredDLPViolations = computed(() => {
  const query = dlpViolationSearch.value.trim().toLowerCase();
  if (!query) return dlpViolations.value;
  return dlpViolations.value.filter((row) =>
    dlpSearchText(row).includes(query),
  );
});

const dlpTestPowerShell = computed(() => {
  const folder = dlpTestForm.value.folder_path || "C:\\12";
  const file = dlpTestForm.value.file_name || "pass.txt";
  const content = (dlpTestForm.value.content || "password=Secret123!").replace(
    /'/g,
    "''",
  );
  return [
    `$folder = '${folder.replace(/'/g, "''")}'`,
    `$file = Join-Path $folder '${file.replace(/'/g, "''")}'`,
    "New-Item -ItemType Directory -Force $folder | Out-Null",
    `Set-Content -Path $file -Value '${content}' -Encoding UTF8`,
    "Add-Content -Path $file -Value 'api_key=ABCDEFGHIJKLMNOP123456'",
    "Get-Item $file | Select-Object FullName,Length,LastWriteTime",
  ].join("\n");
});

const healthColumns = [
  {
    name: "agent_id",
    label: "Agent ID",
    field: "agent_id",
    align: "left",
    sortable: true,
  },
  {
    name: "overall_status",
    label: "Status",
    field: "overall_status",
    align: "center",
  },
  { name: "cpu_usage", label: "CPU", field: "cpu_usage", align: "center" },
  {
    name: "memory_usage",
    label: "RAM %",
    field: "memory_usage",
    align: "center",
    format: (v: number) => (v ? `${Math.round(v)}%` : "—"),
  },
  {
    name: "disk_usage",
    label: "Disk %",
    field: "disk_usage",
    align: "center",
    format: (v: number) => (v ? `${Math.round(v)}%` : "—"),
  },
  {
    name: "antivirus_enabled",
    label: "AV",
    field: "antivirus_enabled",
    align: "center",
    format: (v: boolean | null) => (v === null ? "?" : v ? "✓" : "✗"),
  },
  {
    name: "firewall_enabled",
    label: "FW",
    field: "firewall_enabled",
    align: "center",
    format: (v: boolean | null) => (v === null ? "?" : v ? "✓" : "✗"),
  },
  {
    name: "os_updates_pending",
    label: "Pending Updates",
    field: "os_updates_pending",
    align: "center",
  },
  {
    name: "updated_at",
    label: "Updated",
    field: "updated_at",
    align: "left",
    sortable: true,
  },
];
const incidentColumns = [
  {
    name: "title",
    label: "Title",
    field: "title",
    align: "left",
    sortable: true,
  },
  {
    name: "incident_type",
    label: "Type",
    field: "incident_type",
    align: "left",
  },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  {
    name: "occurred_at",
    label: "Occurred",
    field: "occurred_at",
    align: "left",
    sortable: true,
  },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const fimPolicyColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  {
    name: "realtime_monitoring",
    label: "Real-time",
    field: "realtime_monitoring",
    align: "center",
    format: (v: boolean) => (v ? "✓" : "✗"),
  },
  {
    name: "whodata_monitoring",
    label: "Who-data",
    field: "whodata_monitoring",
    align: "center",
    format: (v: boolean) => (v ? "✓" : "✗"),
  },
  {
    name: "report_changes",
    label: "Diffs",
    field: "report_changes",
    align: "center",
    format: (v: boolean) => (v ? "✓" : "✗"),
  },
  {
    name: "monitored_registry_paths",
    label: "Registry",
    field: "monitored_registry_paths",
    align: "center",
    format: (v: any[]) => (Array.isArray(v) ? v.length : 0),
  },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const fimEventColumns = [
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "event_type", label: "Event", field: "event_type", align: "center" },
  { name: "file_path", label: "File Path", field: "file_path", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  { name: "remediated", label: "Status", field: "remediated", align: "center" },
  {
    name: "occurred_at",
    label: "Occurred",
    field: "occurred_at",
    align: "left",
  },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const usbColumns = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  { name: "policy_type", label: "Type", field: "policy_type", align: "center" },
  {
    name: "device_classes",
    label: "Classes",
    field: (row: any) => [
      ...(row.blocked_device_classes || []).map((c: string) => `block:${c}`),
      ...(row.allowed_device_classes || []).map((c: string) => `allow:${c}`),
    ],
    align: "left",
  },
  {
    name: "encrypt_required",
    label: "Encryption",
    field: "encrypt_required",
    align: "center",
  },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  {
    name: "target",
    label: "Target",
    field: (row: any) => formatUSBPolicyTarget(row),
    align: "left",
  },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];
const usbEventColumns = [
  { name: "occurred_at", label: "Occurred", field: "occurred_at", align: "left" },
  { name: "agent_id", label: "Agent", field: "agent_id", align: "left" },
  { name: "severity", label: "Severity", field: "severity", align: "center" },
  {
    name: "violation_type",
    label: "Violation",
    field: (row: any) => row.details?.violation_type || "usb_usage",
    align: "center",
  },
  {
    name: "device_class",
    label: "Class",
    field: (row: any) => row.details?.device_class || row.details?.pnp_class || "—",
    align: "center",
  },
  { name: "title", label: "Title", field: "title", align: "left" },
  { name: "status", label: "Status", field: "status", align: "center" },
];
const dlpColumns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  { name: "scope", label: "Scope", field: "scope", align: "center" as const },
  {
    name: "target",
    label: "Target",
    field: (row: any) => formatDLPPolicyTarget(row),
    align: "left" as const,
  },
  {
    name: "paths",
    label: "Watched paths",
    field: (row: any) => formatDLPPolicyPaths(row),
    align: "left" as const,
  },
  {
    name: "block_mode",
    label: "Mode",
    field: "block_mode",
    align: "center" as const,
  },
  {
    name: "enabled",
    label: "Status",
    field: "enabled",
    align: "center" as const,
  },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

function formatDLPPolicyTarget(row: any) {
  if (row.scope === "device")
    return row.target_agent_id || "No device selected";
  if (row.scope === "device_group") {
    return row.target_device_group_id
      ? `Device group #${row.target_device_group_id}`
      : "No device group selected";
  }
  if (row.scope === "user")
    return row.target_user_id
      ? `User #${row.target_user_id}`
      : "No user selected";
  if (row.scope === "user_group") {
    return row.target_user_group_id
      ? `User group #${row.target_user_group_id}`
      : "No user group selected";
  }
  return "All devices";
}

function optionLabelByValue(
  options: { label: string; value: string | number | null }[],
  value: string | number | null,
) {
  return options.find((option) => option.value === value)?.label || "";
}

function formatUSBPolicyTarget(row: any) {
  if (row.scope === "device") {
    return (
      optionLabelByValue(agentOptions.value, row.target_agent_id) ||
      row.target_agent_id ||
      "No device selected"
    );
  }
  if (row.scope === "device_group") {
    return (
      optionLabelByValue(forensicDeviceGroupOptions.value, row.target_device_group_id) ||
      (row.target_device_group_id
        ? `Device group #${row.target_device_group_id}`
        : "No device group selected")
    );
  }
  if (row.scope === "user") {
    return (
      optionLabelByValue(usbUserOptions.value, row.target_user_id) ||
      (row.target_user_id ? `User #${row.target_user_id}` : "No user selected")
    );
  }
  if (row.scope === "user_group") {
    return (
      optionLabelByValue(usbUserGroupOptions.value, row.target_user_group_id) ||
      (row.target_user_group_id
        ? `User group #${row.target_user_group_id}`
        : "No user group selected")
    );
  }
  return "All Windows devices";
}

function formatDLPPolicyPaths(row: any) {
  const paths = Array.isArray(row.monitored_paths)
    ? row.monitored_paths.filter(Boolean)
    : [];
  return paths.length ? paths.join(", ") : "Default user folders";
}

async function loadHealth() {
  loadingHealth.value = true;
  try {
    devices.value = (await axios.get("/security/health/")).data;
    healthSummary.value = (await axios.get("/security/health/summary/")).data;
  } finally {
    loadingHealth.value = false;
  }
}
async function loadIncidents() {
  loadingIncidents.value = true;
  try {
    const params: any = {};
    if (incidentFilter.value.status)
      params.status = incidentFilter.value.status;
    if (incidentFilter.value.severity)
      params.severity = incidentFilter.value.severity;
    incidents.value = (
      await axios.get("/security/incidents/", { params })
    ).data;
    incidentSummary.value = (
      await axios.get("/security/incidents/summary/")
    ).data;
  } finally {
    loadingIncidents.value = false;
  }
}
async function loadFIMPolicies() {
  loadingFIM.value = true;
  try {
    fimPolicies.value = (await axios.get("/security/fim/policies/")).data;
  } finally {
    loadingFIM.value = false;
  }
}
async function loadFIMEvents() {
  loadingFIMEvents.value = true;
  try {
    const params: any = {};
    if (fimEventFilter.value.event_type)
      params.event_type = fimEventFilter.value.event_type;
    if (showUnremediated.value) params.remediated = "false";
    fimEvents.value = (
      await axios.get("/security/fim/events/", { params })
    ).data;
  } finally {
    loadingFIMEvents.value = false;
  }
}
async function loadUSB() {
  loadingUSB.value = true;
  try {
    usbPolicies.value = (await axios.get("/security/usb/")).data;
  } finally {
    loadingUSB.value = false;
  }
}
async function loadUSBEvents() {
  loadingUSBEvents.value = true;
  try {
    const params: Record<string, string> = { incident_type: "unauthorized_usb" };
    if (usbEventAgentFilter.value) {
      params.agent_id = usbEventAgentFilter.value;
    }
    usbEvents.value = (await axios.get("/security/incidents/", { params })).data || [];
  } finally {
    loadingUSBEvents.value = false;
  }
}
async function loadDLP() {
  loadingDLP.value = true;
  try {
    dlpPolicies.value = (await axios.get("/security/dlp/")).data;
  } finally {
    loadingDLP.value = false;
  }
}

async function loadDLPViolations() {
  loadingDLPViolations.value = true;
  try {
    const params: any = { incident_type: "dlp_violation" };
    if (dlpViolationFilter.value && dlpViolationFilter.value !== "All") {
      params.violation_type = dlpViolationFilter.value;
    }
    if (dlpViolationAgentFilter.value) {
      params.agent_id = dlpViolationAgentFilter.value;
    }
    dlpViolations.value = (
      await axios.get("/security/incidents/", { params })
    ).data;
  } finally {
    loadingDLPViolations.value = false;
  }
}

async function loadDLPQuarantine() {
  loadingDLPQuarantine.value = true;
  try {
    const params: any = {};
    if (quarantineActiveOnly.value) params.active_only = "1";
    dlpQuarantine.value = (
      await axios.get("/security/dlp/quarantine/", { params })
    ).data;
  } finally {
    loadingDLPQuarantine.value = false;
  }
}

async function remediateQuarantine(
  row: any,
  action: "release" | "destroy" | "notify_user" | "require_justification",
) {
  const labels: Record<string, string> = {
    release: "Restore quarantined file",
    destroy: "Destroy quarantined payload",
    notify_user: "Notify user",
    require_justification: "Require user justification",
  };
  $q.dialog({
    title: `${labels[action]}?`,
    message: `${labels[action]} for "${row.original_path}" on ${row.agent_id}?`,
    prompt: {
      model: "",
      type: "text",
      label: "Reason / note",
    },
    cancel: true,
    ok: {
      color: action === "destroy" ? "negative" : "primary",
      label: "Confirm",
    },
  }).onOk(async (reason: string) => {
    await axios.post(`/security/dlp/quarantine/${row.id}/remediate/`, {
      action,
      reason: reason || "",
    });
    $q.notify({ type: "positive", message: "DLP remediation dispatched" });
    await loadDLPQuarantine();
    await loadDLPViolations();
  });
}

function openEmailDLPTest() {
  dlpDialogOpen.value = false;
  editingDLP.value = null;
  tab.value = "dlp";
  dlpSubTab.value = "email";
}

function emailDLPRecipients() {
  return emailDLPForm.value.recipients
    .split(",")
    .map((value: string) => value.trim())
    .filter(Boolean);
}

function emailDLPPayload() {
  const attachmentContent = emailDLPForm.value.attachment_content.trim();
  const attachments = attachmentContent
    ? [
        {
          name: emailDLPForm.value.attachment_name || "attachment.txt",
          content: attachmentContent,
        },
      ]
    : [];
  return {
    sender: emailDLPForm.value.sender,
    recipients: emailDLPRecipients(),
    subject: emailDLPForm.value.subject,
    body: emailDLPForm.value.body,
    attachments,
  };
}

async function runInternalEmailDLPTest(live = false) {
  if (live && !emailDLPRecipients().length) {
    $q.notify({ type: "warning", message: "Recipient is required for live SMTP test" });
    return;
  }
  emailDLPTesting.value = !live;
  emailDLPLiveSending.value = live;
  try {
    const endpoint = live
      ? "/security/dlp/email/live-test/"
      : "/security/dlp/email/internal-test/";
    emailDLPResult.value = (
      await axios.post(endpoint, emailDLPPayload())
    ).data;
    $q.notify({
      color: emailDLPResult.value.allowed ? "positive" : "negative",
      icon: emailDLPResult.value.allowed ? "check" : "block",
      message: emailDLPResult.value.message || "Email DLP scan finished",
    });
    await loadDLPViolations();
  } finally {
    emailDLPTesting.value = false;
    emailDLPLiveSending.value = false;
  }
}

function showIncidentDialog(item?: any) {
  editingIncident.value = item || null;
  incidentForm.value = item
    ? { ...item }
    : {
        agent_id: "",
        title: "",
        incident_type: "other",
        severity: "medium",
        status: "open",
        description: "",
      };
  incidentDialogOpen.value = true;
}
async function saveIncident() {
  savingIncident.value = true;
  try {
    if (editingIncident.value) {
      await axios.patch(
        `/security/incidents/${editingIncident.value.id}/`,
        incidentForm.value,
      );
    } else {
      await axios.post("/security/incidents/", incidentForm.value);
    }
    incidentDialogOpen.value = false;
    $q.notify({ message: "Incident saved", color: "positive", icon: "check" });
    await loadIncidents();
  } finally {
    savingIncident.value = false;
  }
}

function showFIMPolicyDialog(item?: any) {
  editingFIM.value = item || null;
  fimForm.value = item
    ? { ...item }
    : {
        name: "",
        monitored_paths: [],
        excluded_paths: [],
        excluded_extensions: [],
        file_ignore_patterns: [],
        monitored_registry_paths: [],
        registry_ignore: [],
        scan_schedule_cron: "0 * * * *",
        realtime_monitoring: true,
        whodata_monitoring: false,
        report_changes: false,
        scan_on_start: false,
        check_md5sum: true,
        check_sha1sum: true,
        check_sha256sum: true,
        diff_size_limit_mb: 5,
        alert_on_change: true,
        alert_on_delete: true,
        alert_on_create: true,
        enabled: true,
      };
  monitoredPathsInput.value = (fimForm.value.monitored_paths || []).join(", ");
  excludedPathsInput.value = (fimForm.value.excluded_paths || []).join(", ");
  excludedExtensionsInput.value = (
    fimForm.value.excluded_extensions || []
  ).join(", ");
  ignorePatternsInput.value = (fimForm.value.file_ignore_patterns || []).join(
    ", ",
  );
  registryPathsInput.value = (
    fimForm.value.monitored_registry_paths || []
  ).join(", ");
  registryIgnoreInput.value = (fimForm.value.registry_ignore || []).join(", ");
  fimDialogOpen.value = true;
}
async function saveFIM() {
  savingFIM.value = true;
  try {
    if (editingFIM.value) {
      await axios.put(
        `/security/fim/policies/${editingFIM.value.id}/`,
        fimForm.value,
      );
    } else {
      await axios.post("/security/fim/policies/", fimForm.value);
    }
    fimDialogOpen.value = false;
    $q.notify({
      message: "FIM policy saved",
      color: "positive",
      icon: "check",
    });
    await loadFIMPolicies();
  } finally {
    savingFIM.value = false;
  }
}
async function deployFIM(policy: any) {
  $q.dialog({
    title: "Deploy FIM Policy",
    message: "Enter Agent IDs (comma-separated):",
    prompt: { model: "", label: "Agent IDs" },
    cancel: true,
  }).onOk(async (input: string) => {
    const agentIds = input
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    await axios.post(`/security/fim/policies/${policy.id}/deploy/`, {
      agent_ids: agentIds,
    });
    $q.notify({ message: "FIM deploy initiated", color: "info" });
  });
}
async function deleteFIM(id: number) {
  $q.dialog({
    title: "Delete FIM policy?",
    cancel: true,
    ok: { color: "negative" },
  }).onOk(async () => {
    await axios.delete(`/security/fim/policies/${id}/`);
    await loadFIMPolicies();
  });
}
async function remediateFIMEvent(id: number) {
  await axios.patch(`/security/fim/events/${id}/`, { remediated: true });
  $q.notify({
    message: "Marked as remediated",
    color: "positive",
    icon: "check",
  });
  await loadFIMEvents();
}

function showUSBDialog(item?: any) {
  editingUSB.value = item || null;
  const defaults = {
    name: "",
    policy_type: "read_only",
    allowed_device_ids: [],
    blocked_device_ids: [],
    allowed_device_classes: [],
    blocked_device_classes: [],
    scope: "global",
    target_agent_id: "",
    target_device_group_id: null,
    target_user_id: null,
    target_user_group_id: null,
    encrypt_required: false,
    log_usage: true,
    alert_on_connect: false,
    emergency_mode: false,
    emergency_reason: "",
    enabled: true,
  };
  usbForm.value = item ? { ...defaults, ...item } : defaults;
  usbAllowedIdsInput.value = (usbForm.value.allowed_device_ids || []).join("\n");
  usbBlockedIdsInput.value = (usbForm.value.blocked_device_ids || []).join("\n");
  usbDialogOpen.value = true;
}

function splitLines(value: string) {
  return (value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function onUSBScopeChanged(scope: string) {
  usbForm.value.scope = scope || "global";
  usbForm.value.target_agent_id = "";
  usbForm.value.target_device_group_id = null;
  usbForm.value.target_user_id = null;
  usbForm.value.target_user_group_id = null;
}

function normalizeUSBPayload(payload: any) {
  const normalized = { ...payload };
  normalized.scope = normalized.scope || "global";
  if (normalized.scope !== "device") normalized.target_agent_id = "";
  if (normalized.scope !== "device_group")
    normalized.target_device_group_id = null;
  if (normalized.scope !== "user") normalized.target_user_id = null;
  if (normalized.scope !== "user_group") normalized.target_user_group_id = null;
  for (const key of [
    "target_device_group_id",
    "target_user_id",
    "target_user_group_id",
  ]) {
    if (normalized[key] === "" || normalized[key] === undefined)
      normalized[key] = null;
  }
  return normalized;
}

function validateUSBPayload(payload: any) {
  if (payload.scope === "device" && !payload.target_agent_id)
    return "Select target device";
  if (payload.scope === "device_group" && !payload.target_device_group_id)
    return "Select target device group";
  if (payload.scope === "user" && !payload.target_user_id)
    return "Select target user";
  if (payload.scope === "user_group" && !payload.target_user_group_id)
    return "Select target user group";
  return "";
}

async function saveUSB() {
  savingUSB.value = true;
  try {
    usbForm.value.allowed_device_ids = splitLines(usbAllowedIdsInput.value);
    usbForm.value.blocked_device_ids = splitLines(usbBlockedIdsInput.value);
    const payload = normalizeUSBPayload(usbForm.value);
    const validation = validateUSBPayload(payload);
    if (validation) {
      $q.notify({ message: validation, color: "warning" });
      return;
    }
    if (editingUSB.value) {
      await axios.put(`/security/usb/${editingUSB.value.id}/`, payload);
    } else {
      await axios.post("/security/usb/", payload);
    }
    usbDialogOpen.value = false;
    $q.notify({
      message: "USB policy saved",
      color: "positive",
      icon: "check",
    });
    await loadUSB();
  } finally {
    savingUSB.value = false;
  }
}
async function deployUSB(policy: any) {
  try {
    const resp = await axios.post(`/security/usb/${policy.id}/deploy/`, {
      wait: true,
    });
    const count = resp.data?.agents_triggered ?? 0;
    $q.notify({
      message: `USB policy deployed to ${count} agent(s)`,
      color: "positive",
      icon: "send",
    });
    await loadUSBEvents();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "USB deploy failed"),
      color: "negative",
    });
  }
}
async function deleteUSB(id: number) {
  $q.dialog({
    title: "Delete USB policy?",
    cancel: true,
    ok: { color: "negative" },
  }).onOk(async () => {
    await axios.delete(`/security/usb/${id}/`);
    await loadUSB();
  });
}
function emergencyUSB() {
  $q.dialog({
    title: "Emergency USB block",
    message: "Block USB mass-storage class on all matching Windows agents now.",
    prompt: {
      model: "Incident response emergency",
      type: "text",
      label: "Reason",
    },
    cancel: true,
    ok: { color: "negative", label: "Dispatch" },
  }).onOk(async (reason: string) => {
    try {
      const resp = await axios.post("/security/usb/emergency/", {
        reason,
        policy_type: "block_all",
        blocked_device_classes: ["mass_storage"],
        wait: true,
      });
      const count = resp.data?.agents_triggered ?? 0;
      $q.notify({
        message: `Emergency USB block sent to ${count} agent(s)`,
        color: "negative",
        icon: "emergency",
      });
      await loadUSB();
      await loadUSBEvents();
    } catch (e: any) {
      $q.notify({
        message: _apiErrMessage(e, "Emergency USB dispatch failed"),
        color: "negative",
      });
    }
  });
}
async function revokeUSB(policy: any) {
  $q.dialog({
    title: "Revoke USB policy?",
    message: `Remove "${policy.name}" from matching Windows agents and re-enable default USB storage behavior.`,
    cancel: true,
    ok: { color: "warning", label: "Revoke" },
  }).onOk(async () => {
    try {
      const resp = await axios.post(`/security/usb/${policy.id}/revoke/`, {
        wait: true,
      });
      const count = resp.data?.agents_triggered ?? 0;
      $q.notify({
        message: `USB revoke sent to ${count} agent(s)`,
        color: "positive",
        icon: "undo",
      });
      await loadUSB();
    } catch {
      $q.notify({ message: "USB revoke failed", color: "negative" });
    }
  });
}

function openDLPTestDialog() {
  if (!dlpTestForm.value.agent_id && agentOptions.value.length === 1) {
    dlpTestForm.value.agent_id = agentOptions.value[0].value;
  }
  dlpTestDialogOpen.value = true;
}

function copyDLPTestCommand() {
  copyToClipboard(dlpTestPowerShell.value)
    .then(() => {
      $q.notify({ type: "positive", message: "PowerShell copied" });
    })
    .catch(() => {
      $q.notify({ type: "negative", message: "Could not copy PowerShell" });
    });
}

function startDLPTestWatch() {
  if (dlpTestForm.value.agent_id) {
    dlpViolationAgentFilter.value = dlpTestForm.value.agent_id;
  }
  dlpViolationSearch.value = dlpTestForm.value.file_name || "pass.txt";
  dlpViolationFilter.value = null;
  dlpSubTab.value = "violations";
  dlpTestDialogOpen.value = false;
  dlpTestWatching.value = true;
  loadDLPViolations();
  if (dlpTestPollTimer) clearInterval(dlpTestPollTimer);
  dlpTestPollTimer = setInterval(loadDLPViolations, 5000);
  window.setTimeout(() => {
    if (dlpTestWatching.value) stopDLPTestWatch();
  }, 120000);
}

function stopDLPTestWatch() {
  dlpTestWatching.value = false;
  if (dlpTestPollTimer) {
    clearInterval(dlpTestPollTimer);
    dlpTestPollTimer = null;
  }
}

function showDLPIncidentDetails(row: any) {
  selectedDLPIncident.value = row;
  dlpIncidentDetailsOpen.value = true;
}

function showDLPDialog(item?: any) {
  editingDLP.value = item || null;
  dlpDialogOpen.value = true;
}
async function deleteDLP(id: number) {
  $q.dialog({
    title: "Delete DLP policy?",
    cancel: true,
    ok: { color: "negative" },
  }).onOk(async () => {
    await axios.delete(`/security/dlp/${id}/`);
    await loadDLP();
  });
}

async function massWipeIncident(incident: any) {
  $q.dialog({
    title: "Mass Wipe Affected Devices?",
    message: `Send selective wipe to devices affected by "${incident.title}". Removes org data.`,
    cancel: true,
    ok: { label: "Wipe Affected", color: "negative" },
  }).onOk(async () => {
    try {
      const resp = await axios.post(
        `/security/incidents/${incident.id}/mass-wipe/`,
        {
          incident_ids: [incident.id],
          agent_ids: [incident.agent_id],
        },
      );
      $q.notify({
        message: `Wipe sent to ${resp.data.triggered} device(s)`,
        color: "positive",
        icon: "check",
      });
    } catch {
      $q.notify({ message: "Mass wipe failed", color: "negative" });
    }
  });
}

async function massWipeSelectedIncidents() {
  const incidentIds = Array.from(new Set(selectedIncidents.value.map((row) => row.id).filter(Boolean)));
  const agentIds = Array.from(new Set(selectedIncidents.value.map((row) => row.agent_id).filter(Boolean)));
  if (!incidentIds.length || !agentIds.length) {
    $q.notify({ message: "Select incidents with linked agents first", color: "warning" });
    return;
  }

  $q.dialog({
    title: "Mass Wipe Selected Incidents?",
    message: `Send selective wipe to ${agentIds.length} unique device(s) from ${incidentIds.length} selected incident(s).`,
    cancel: true,
    ok: { label: "Wipe Selected", color: "negative" },
  }).onOk(async () => {
    try {
      const resp = await axios.post(
        `/security/incidents/${incidentIds[0]}/mass-wipe/`,
        {
          incident_ids: incidentIds,
          agent_ids: agentIds,
        },
      );
      $q.notify({
        message: `Wipe sent to ${resp.data.triggered} device(s)`,
        color: "positive",
        icon: "check",
      });
      selectedIncidents.value = [];
      await loadIncidents();
    } catch {
      $q.notify({ message: "Mass wipe failed", color: "negative" });
    }
  });
}

onMounted(() => {
  loadHealth();
  loadIncidents();
  loadFIMPolicies();
  loadFIMEvents();
  loadUSB();
  loadUSBEvents();
  loadDLP();
  loadDLPViolations();
  loadDLPQuarantine();
  loadForensicJobTypes();
  loadForensicPolicies();
  loadForensicDeviceGroups();
  loadForensicSettings();
  loadForensics();
  loadForensicsAudit();
  loadUEBA();
  loadScanPolicy();
  refreshThreatIntelAll();
  loadThreatIntelStats();
  loadAgentOptions();
  loadUSBScopeOptions();
  loadMicControlAll();
});

onUnmounted(() => {
  stopDLPTestWatch();
});

watch(() => route.fullPath, syncTabFromRoute, { immediate: true });

// ===== Forensics & IR (func #765-773, #782-791) =====
const showIsolateDialog = ref(false);
const showForensicWizard = ref(false);
const showForensicPolicyDialog = ref(false);
const showForensicSettingsDialog = ref(false);
const loadingForensics = ref(false);
const loadingForensicsAudit = ref(false);
const loadingForensicPolicies = ref(false);
const savingForensicSettings = ref(false);
const forensicCases = ref<any[]>([]);
const forensicPolicies = ref<any[]>([]);
const forensicAuditTrail = ref<any[]>([]);
const forensicsReport = ref<any>(null);
const forensicsError = ref("");
const forensicsAuditError = ref("");
const uebaError = ref("");
const threatIntelError = ref("");
const editingForensicPolicy = ref<any | null>(null);

function defaultForensicSettingsForm() {
  return {
    label: "default",
    evidence_encryption_enabled: false,
    evidence_public_key_pem: "",
    velociraptor_enabled: false,
    velociraptor_api_url: "",
    velociraptor_ca_cert_pem: "",
    notes: "",
  };
}

const defaultForensicJobTypeOptions = [
  { label: "Extract files by path", value: "file_collection" },
  { label: "Crash dumps / memory dumps", value: "crash_dumps" },
  { label: "Keyword file carving", value: "keyword_carve" },
  { label: "Event logs", value: "event_log" },
  { label: "Prefetch files", value: "prefetch" },
  { label: "MFT / filesystem timeline", value: "mft" },
  { label: "Registry hives", value: "registry" },
  { label: "Lite memory process dump", value: "memory_lite" },
  { label: "YARA scan", value: "yara" },
  { label: "Triage bundle", value: "triage_bundle" },
];
const forensicJobTypeOptions = ref(defaultForensicJobTypeOptions);
const forensicDeviceGroupOptions = ref<{ label: string; value: number }[]>([]);
const forensicScopeOptions = [
  { label: "Global", value: "global" },
  { label: "Specific device", value: "device" },
  { label: "Device group", value: "device_group" },
];
const dumpCollectorsRequireMaxSize = new Set([
  "crash_dumps",
  "memory_dump",
  "memory_lite",
  "triage_bundle",
]);

function forensicDumpCollectorsNeedMaxSize(jobTypes: string[]) {
  return jobTypes.some((jobType) => dumpCollectorsRequireMaxSize.has(jobType));
}

function hasPositiveForensicMaxSize(value: number | null) {
  return Number(value || 0) > 0;
}

function defaultForensicWizardForm() {
  return {
    agent_id: "",
    title: "",
    reason: "",
    job_types: [] as string[],
    keywords: [] as string[],
    path_globs: [] as string[],
    min_size_bytes: null as number | null,
    max_size_bytes: null as number | null,
    modified_after: "",
    modified_before: "",
    external_ref: "", 
    engine: "builtin",
    approval_status: "not_required",
    only_non_compliant: false,
  };
}

function defaultForensicPolicyForm() {
  return {
    name: "",
    enabled: true,
    scope: "global",
    target_agent_id: "",
    target_device_group_id: null as number | null,
    job_types: ["file_collection"] as string[],
    keywords: [] as string[],
    path_globs: [] as string[],
    min_size_bytes: null as number | null,
    max_size_bytes: null as number | null,
    modified_after: "",
    modified_before: "",
    schedule_cron: "",
    engine: "builtin",
    only_non_compliant: false,
  };
}

// Wizard form state

const forensicEngineOptions = [
  { label: "Built-in collectors", value: "builtin" },
  { label: "Velociraptor handoff", value: "velociraptor" },
  { label: "Bulk Extractor handoff", value: "bulk_extractor" },
];

const forensicWizardForm = ref(defaultForensicWizardForm());
const forensicPolicyForm = ref(defaultForensicPolicyForm());
const forensicSettingsForm = ref(defaultForensicSettingsForm());
const forensicKeywordsInput = ref("");
const forensicPathGlobsInput = ref("");
const forensicPolicyKeywordsInput = ref("");
const forensicPolicyPathGlobsInput = ref("");


const forensicColumns = [
  { name: "agent_id", label: "Device", field: "agent_id", align: "left" },
  { name: "title", label: "Title", field: "title", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  {
    name: "approval_status",
    label: "Approval",
    field: "approval_status",
    align: "left",
  },
  {
    name: "only_non_compliant",
    label: "Trigger",
    field: "only_non_compliant",
    align: "center",
  },
  {
    name: "artifact_count",
    label: "Artifacts",
    field: (row: any) => forensicArtifactCount(row),
    align: "center",
  },
  {
    name: "evidence_bundle_size",
    label: "Bundle",
    field: (row: any) => formatBytes(row.evidence_bundle_size),
    align: "right",
  },
  {
    name: "evidence_bundle_encrypted",
    label: "Encryption",
    field: "evidence_bundle_encrypted",
    align: "center",
  },
  {
    name: "av_scan_status",
    label: "AV",
    field: "av_scan_status",
    align: "center",
  },
  {
    name: "manifest_sha256",
    label: "Manifest SHA-256",
    field: "manifest_sha256",
    align: "left",
  },
  { name: "created_at", label: "Created", field: "created_at", align: "left" },
  {
    name: "completed_at",
    label: "Completed",
    field: "completed_at",
    align: "left",
  },
  { name: "actions", label: "", field: "actions", align: "center" },
];

const forensicAuditColumns = [
  { name: "created_at", label: "Time", field: "created_at", align: "left" },
  { name: "action", label: "Action", field: "action", align: "left" },
  {
    name: "actor",
    label: "Actor",
    field: (r: any) => r.actor ?? "system",
    align: "left",
  },
  { name: "job", label: "Job ID", field: "job", align: "left" },
];

const forensicPolicyColumns = [
  { name: "name", label: "Policy", field: "name", align: "left" },
  { name: "scope", label: "Scope", field: "scope", align: "center" },
  {
    name: "target",
    label: "Target",
    field: (row: any) => formatForensicPolicyTarget(row),
    align: "left",
  },
  {
    name: "job_types",
    label: "Collectors",
    field: (row: any) => formatForensicJobTypes(row),
    align: "left",
  },
  {
    name: "schedule_cron",
    label: "Schedule",
    field: (row: any) => row.schedule_cron || "Manual only",
    align: "left",
  },
  { name: "enabled", label: "Status", field: "enabled", align: "center" },
  { name: "actions", label: "", field: "actions", align: "right" },
];

function _apiErrMessage(e: any, fallback: string) {
  const d = e?.response?.data;
  if (typeof d === "string") return d;
  if (typeof d?.detail === "string") return d.detail;
  if (typeof d?.error === "string") return d.error;
  if (Array.isArray(d?.detail) && d.detail[0]) return String(d.detail[0]);
  return fallback;
}

async function loadForensicJobTypes() {
  try {
    const r = await axios.get("/security/forensics/job-types/");
    const groups = Array.isArray(r.data?.groups) ? r.data.groups : [];
    forensicJobTypeOptions.value = groups.length
      ? groups.map((row: any) => ({
          label: row.label || row.kind,
          value: row.kind,
        }))
      : defaultForensicJobTypeOptions;
  } catch {
    forensicJobTypeOptions.value = defaultForensicJobTypeOptions;
  }
}

async function loadForensicDeviceGroups() {
  try {
    const r = await axios.get("/clients/sites/?leaf=true");
    const list = Array.isArray(r.data) ? r.data : (r.data?.results ?? []);
    forensicDeviceGroupOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors
          ? `${site.ancestors} / ${site.name}`
          : site.name || `Device group #${site.id}`,
      }));
  } catch {
    forensicDeviceGroupOptions.value = [];
  }
}

async function loadForensicPolicies() {
  loadingForensicPolicies.value = true;
  try {
    const r = await axios.get("/security/forensics/policies/");
    forensicPolicies.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    forensicPolicies.value = [];
    $q.notify({
      message: _apiErrMessage(e, "Failed to load file carving policies"),
      color: "negative",
    });
  } finally {
    loadingForensicPolicies.value = false;
  }
}

async function loadForensicSettings() {
  try {
    const r = await axios.get("/security/forensics/settings/");
    forensicSettingsForm.value = {
      ...defaultForensicSettingsForm(),
      ...(r.data || {}),
    };
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to load forensics settings"),
      color: "negative",
    });
  }
}

async function openForensicSettingsDialog() {
  await loadForensicSettings();
  showForensicSettingsDialog.value = true;
}

async function saveForensicSettings() {
  savingForensicSettings.value = true;
  try {
    await axios.put("/security/forensics/settings/", forensicSettingsForm.value);
    $q.notify({
      message: "Forensics settings saved",
      color: "positive",
      icon: "check",
    });
    showForensicSettingsDialog.value = false;
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to save forensics settings"),
      color: "negative",
    });
  } finally {
    savingForensicSettings.value = false;
  }
}

async function loadForensics() {
  loadingForensics.value = true;
  forensicsError.value = "";
  const parts: string[] = [];
  try {
    const jobsResp = await axios.get("/security/forensics/jobs/");
    forensicCases.value = Array.isArray(jobsResp.data) ? jobsResp.data : [];
  } catch (e: any) {
    forensicCases.value = [];
    parts.push(_apiErrMessage(e, "jobs"));
  }
  try {
    const reportResp = await axios.get("/security/forensics/report/");
    forensicsReport.value = reportResp.data;
  } catch (e: any) {
    forensicsReport.value = null;
    parts.push(_apiErrMessage(e, "report"));
  }
  if (parts.length) {
    forensicsError.value = `Failed to load forensics: ${parts.join("; ")}.`;
  }
  loadingForensics.value = false;
}

async function loadForensicsAudit() {
  loadingForensicsAudit.value = true;
  forensicsAuditError.value = "";
  try {
    const r = await axios.get("/security/forensics/audit/");
    forensicAuditTrail.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    forensicAuditTrail.value = [];
    forensicsAuditError.value = _apiErrMessage(
      e,
      "Failed to load forensics audit trail.",
    );
  } finally {
    loadingForensicsAudit.value = false;
  }
}


function showNonComplianceForensicWizard() {
  forensicWizardForm.value = {
    agent_id: agentOptions.value.length === 1 ? agentOptions.value[0].value : "",
    title: "Non-compliance forensic carve",
    reason: "Automatic collection gated to non-compliant devices",
    job_types: ["keyword_carve", "crash_dumps", "tool_export"],
    keywords: ["password", "secret", "token", "credential"],
    path_globs: ["C:\\Users\\**\\Documents\\*", "C:\\Users\\**\\Desktop\\*"],
    min_size_bytes: null,
    max_size_bytes: 268435456,
    engine: "builtin",
    external_ref: "",
    approval_status: "not_required",
    only_non_compliant: true,
  };
  forensicKeywordsInput.value = forensicWizardForm.value.keywords.join(", ");
  forensicPathGlobsInput.value = forensicWizardForm.value.path_globs.join(", ");
  showForensicWizard.value = true;
}


async function exportForensicsPdf() {
  if (!forensicsReport.value) {
    $q.notify({ message: "Forensics report is not loaded", color: "warning" });
    return;
  }

  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 36;
  const generatedAt = new Date().toISOString();
  const stats = forensicsReport.value.stats || {};
  const jobs = Array.isArray(forensicsReport.value.recent_jobs)
    ? forensicsReport.value.recent_jobs
    : [];
  const audit = Array.isArray(forensicsReport.value.recent_audit)
    ? forensicsReport.value.recent_audit
    : [];

  doc.setFontSize(16);
  doc.text("File Carving / Forensics Report", margin, 42);
  doc.setFontSize(9);
  doc.text(`Generated: ${generatedAt}`, margin, 58);

  autoTable(doc, {
    startY: 76,
    head: [["Metric", "Value"]],
    body: Object.entries(stats).map(([key, value]) => [
      key,
      String(value ?? 0),
    ]),
    theme: "grid",
    styles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [
      [
        "ID",
        "Device",
        "Title",
        "Status",
        "Collectors",
        "Artifacts",
        "Bundle",
        "Encrypted",
        "AV",
        "SHA256",
        "Updated",
      ],
    ],
    body: jobs.map((row: any) => [
      row.id,
      row.agent_id,
      row.title,
      row.status,
      Array.isArray(row.job_types) ? row.job_types.join(", ") : "",
      forensicArtifactCount(row),
      formatBytes(row.evidence_bundle_size),
      row.evidence_bundle_encrypted ? "yes" : "no",
      row.av_scan_status || "-",
      row.manifest_sha256 || "-",
      row.updated_at || "",
    ]),
    theme: "striped",
    styles: { fontSize: 7 },
    margin: { left: margin, right: margin },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [["Time", "Action", "Actor", "Job", "Details"]],
    body: audit.map((row: any) => [
      row.created_at || "",
      row.action || "",
      row.actor || "-",
      row.job || "-",
      row.details ? JSON.stringify(row.details).slice(0, 120) : "",
    ]),
    theme: "striped",
    styles: { fontSize: 7 },
    margin: { left: margin, right: margin },
  });

  doc.save(`file-carving-report-${generatedAt.slice(0, 10)}.pdf`);
}

function formatForensicPolicyTarget(row: any) {
  if (row.scope === "device") {
    const found = agentOptions.value.find(
      (agent) => agent.value === row.target_agent_id,
    );
    return found?.label || row.target_agent_id || "No device selected";
  }
  if (row.scope === "device_group") {
    const found = forensicDeviceGroupOptions.value.find(
      (group) => group.value === row.target_device_group_id,
    );
    return (
      found?.label ||
      (row.target_device_group_id
        ? `Device group #${row.target_device_group_id}`
        : "No device group selected")
    );
  }
  return "All devices";
}

function formatForensicJobTypes(row: any) {
  const jobTypes = Array.isArray(row.job_types) ? row.job_types : [];
  if (!jobTypes.length) return "No collectors selected";
  const labels = jobTypes.map((value: string) => {
    const found = forensicJobTypeOptions.value.find(
      (option) => option.value === value,
    );
    return found?.label || value;
  });
  return labels.join(", ");
}

function formatBytes(value: any) {
  const bytes = Number(value || 0);
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let idx = 0;
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024;
    idx += 1;
  }
  return `${size.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function forensicAvColor(status: string) {
  if (status === "clean") return "positive";
  if (status === "detected") return "negative";
  if (status === "error") return "warning";
  if (status === "unavailable") return "grey";
  return "grey";
}

function forensicStatusColor(status: string) {
  if (status === "failed") return "negative";
  if (status === "partial") return "warning";
  if (status === "running" || status === "queued") return "primary";
  if (status === "skipped" || status === "cancelled") return "grey";
  if (status === "completed") return "positive";
  return "grey";
}

function isForensicSystemManifest(artifact: any) {
  const logicalName = String(artifact?.logical_name || "").toLowerCase();
  return logicalName.includes("crashdump_manifest_");
}

function forensicArtifactCount(row: any) {
  if (!Array.isArray(row?.artifacts)) return 0;
  return row.artifacts.filter((artifact: any) => !isForensicSystemManifest(artifact)).length;
}

function openForensicJobDialog() {
  forensicWizardForm.value = defaultForensicWizardForm();
  forensicKeywordsInput.value = "";
  forensicPathGlobsInput.value = "";
  showForensicWizard.value = true;
}

function openForensicPolicyDialog(row: any | null = null) {
  editingForensicPolicy.value = row;
  forensicPolicyForm.value = row
    ? {
        ...defaultForensicPolicyForm(),
        ...row,
        modified_after: row.modified_after
          ? String(row.modified_after).slice(0, 16)
          : "",
        modified_before: row.modified_before
          ? String(row.modified_before).slice(0, 16)
          : "",
      }
    : defaultForensicPolicyForm();
  forensicPolicyKeywordsInput.value = (
    forensicPolicyForm.value.keywords || []
  ).join(", ");
  forensicPolicyPathGlobsInput.value = (
    forensicPolicyForm.value.path_globs || []
  ).join(", ");
  showForensicPolicyDialog.value = true;
}

function normalizeForensicPayload(payload: any) {
  const normalized = { ...payload };
  if (normalized.scope !== "device") normalized.target_agent_id = "";
  if (normalized.scope !== "device_group")
    normalized.target_device_group_id = null;
  for (const key of [
    "min_size_bytes",
    "max_size_bytes",
    "target_device_group_id",
  ]) {
    if (normalized[key] === "") normalized[key] = null;
  }
  for (const key of ["modified_after", "modified_before"]) {
    if (!normalized[key]) normalized[key] = null;
  }
  return normalized;
}


async function submitForensicJob() {
  try {
    if (!forensicWizardForm.value.agent_id) {
      $q.notify({ message: "Select a target device", color: "warning" });
      return;
    }
    if (!forensicWizardForm.value.job_types.length) {
      $q.notify({ message: "Select at least one collector", color: "warning" });
      return;
    }
    if (
      forensicDumpCollectorsNeedMaxSize(forensicWizardForm.value.job_types) &&
      !hasPositiveForensicMaxSize(forensicWizardForm.value.max_size_bytes)
    ) {
      $q.notify({
        message: "Enter Max size bytes for crash or memory dump collectors",
        color: "warning",
      });
      return;
    }
    const payload = normalizeForensicPayload({ ...forensicWizardForm.value });
    await axios.post("/security/forensics/jobs/", payload);
    $q.notify({
      message: "Forensic job created successfully",
      color: "positive",
      icon: "check",
    });
    showForensicWizard.value = false;

    forensicWizardForm.value = defaultForensicWizardForm();

    forensicKeywordsInput.value = "";
    forensicPathGlobsInput.value = "";
    await loadForensics();
    await loadForensicsAudit();
  } catch (e: any) {
    $q.notify({
      message: e?.response?.data?.error || "Failed to create forensic job",
      color: "negative",
    });
  }
}

async function submitForensicPolicy() {
  if (!forensicPolicyForm.value.name.trim()) {
    $q.notify({ message: "Policy name is required", color: "warning" });
    return;
  }
  if (!forensicPolicyForm.value.job_types.length) {
    $q.notify({ message: "Select at least one collector", color: "warning" });
    return;
  }
  if (
    forensicDumpCollectorsNeedMaxSize(forensicPolicyForm.value.job_types) &&
    !hasPositiveForensicMaxSize(forensicPolicyForm.value.max_size_bytes)
  ) {
    $q.notify({
      message: "Enter Max size bytes for crash or memory dump collectors",
      color: "warning",
    });
    return;
  }
  if (
    forensicPolicyForm.value.scope === "device" &&
    !forensicPolicyForm.value.target_agent_id
  ) {
    $q.notify({ message: "Select a target device", color: "warning" });
    return;
  }
  if (
    forensicPolicyForm.value.scope === "device_group" &&
    !forensicPolicyForm.value.target_device_group_id
  ) {
    $q.notify({ message: "Select a target device group", color: "warning" });
    return;
  }

  const payload = normalizeForensicPayload({ ...forensicPolicyForm.value });
  try {
    if (editingForensicPolicy.value?.id) {
      await axios.put(
        `/security/forensics/policies/${editingForensicPolicy.value.id}/`,
        payload,
      );
    } else {
      await axios.post("/security/forensics/policies/", payload);
    }
    $q.notify({
      message: editingForensicPolicy.value
        ? "File carving policy saved"
        : "File carving policy created",
      color: "positive",
      icon: "check",
    });
    showForensicPolicyDialog.value = false;
    editingForensicPolicy.value = null;
    forensicPolicyForm.value = defaultForensicPolicyForm();
    await loadForensicPolicies();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to save file carving policy"),
      color: "negative",
    });
  }
}

function updateForensicKeywords(value: string) {
  forensicWizardForm.value.keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateForensicPathGlobs(value: string) {
  forensicWizardForm.value.path_globs = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateForensicPolicyKeywords(value: string) {
  forensicPolicyForm.value.keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateForensicPolicyPathGlobs(value: string) {
  forensicPolicyForm.value.path_globs = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function deleteForensicPolicy(row: any) {
  $q.dialog({
    title: "Delete File Carving Policy",
    message: `Delete policy "${row.name}"?`,
    cancel: true,
    ok: { color: "negative", label: "Delete" },
  }).onOk(async () => {
    try {
      await axios.delete(`/security/forensics/policies/${row.id}/`);
      $q.notify({ message: "File carving policy deleted", color: "warning" });
      await loadForensicPolicies();
    } catch (e: any) {
      $q.notify({
        message: _apiErrMessage(e, "Failed to delete file carving policy"),
        color: "negative",
      });
    }
  });
}

async function approveForensicJob(row: any) {
  try {
    await axios.patch(`/security/forensics/jobs/${row.id}/`, {
      approval_status: "approved",
    });
    $q.notify({ message: "Job approved and queued", color: "positive" });
    await loadForensics();
  } catch {
    $q.notify({ message: "Approval failed", color: "negative" });
  }
}

async function cancelForensicJob(row: any) {
  $q.dialog({
    title: "Cancel Job",
    message: `Cancel forensic job "${row.title}"?`,
    cancel: true,
    ok: { color: "negative", label: "Cancel Job" },
  }).onOk(async () => {
    try {
      await axios.delete(`/security/forensics/jobs/${row.id}/`);
      $q.notify({ message: "Job cancelled", color: "warning" });
      await loadForensics();
    } catch {
      $q.notify({ message: "Failed to cancel", color: "negative" });
    }
  });
}

function openIRCase(row: any) {
  $q.dialog({
    title: `Forensic Job: ${row.title}`,
    message: [
      `Agent: ${row.agent_id}`,
      `Status: ${row.status}`,
      `Artifacts: ${forensicArtifactCount(row)}`,
      `Evidence bundle: ${row.evidence_bundle_name || "not uploaded"}`,
      `Bundle SHA-256: ${row.evidence_bundle_sha256 || row.manifest_sha256 || "—"}`,
      `Encrypted: ${row.evidence_bundle_encrypted ? "yes" : "no"}`,
      `AV scan: ${row.av_scan_status || "not scanned"}`,
    ].join("\n"),
    ok: true,
  });
}

async function downloadForensicToolExport(row: any, format = "generic") {
  try {
    const r = await axios.get(`/security/forensics/jobs/${row.id}/tool-export/`, {
      params: { tool: format },
    });
    const payload = JSON.stringify(r.data, null, 2);
    const filename = `forensics-${row.id}-${format}-manifest.json`;
    const status = exportFile(filename, payload, "application/json");
    if (status !== true) {
      throw new Error("browser blocked file export");
    }
    $q.notify({
      message: `Forensic ${format} manifest exported`,
      color: "positive",
      icon: "download",
    });
    await loadForensicsAudit();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to export forensic manifest"),
      color: "negative",
    });
  }
}

async function downloadForensicEvidence(row: any) {
  try {
    const r = await axios.get(`/security/forensics/jobs/${row.id}/evidence/`, {
      responseType: "blob",
    });
    const disposition = String(r.headers?.["content-disposition"] || "");
    const match = disposition.match(/filename="?([^";]+)"?/i);
    const filename =
      match?.[1] ||
      row.evidence_bundle_name ||
      `forensics-${row.id}-evidence.zip`;
    const blob = new Blob([r.data], {
      type: r.headers?.["content-type"] || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    $q.notify({
      message: "Evidence bundle download started",
      color: "positive",
      icon: "archive",
    });
    await loadForensicsAudit();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to download evidence bundle"),
      color: "negative",
    });
  }
}

function escalateCase(row: any) {
  $q.dialog({
    title: "Escalate Case",
    message: `Escalate job "${row.title}" to SOC approval?`,
    cancel: true,
    ok: { color: "warning", label: "Escalate" },
  }).onOk(async () => {
    try {
      await axios.patch(`/security/forensics/jobs/${row.id}/`, {
        approval_status: "pending",
      });
      $q.notify({ message: "Case escalated to SOC", color: "warning" });
      await loadForensics();
    } catch {
      $q.notify({ message: "Escalation failed", color: "negative" });
    }
  });
}

function recoverCase(row: any) {
  $q.dialog({
    title: "Mark as Recovered",
    message: `Mark job "${row.title}" as completed/recovered?`,
    cancel: true,
    ok: { color: "positive", label: "Recover" },
  }).onOk(async () => {
    try {
      await axios.patch(`/security/forensics/jobs/${row.id}/`, {
        status: "completed",
      });
      await loadForensics();
      $q.notify({ message: "Job marked as recovered", color: "positive" });
    } catch {
      $q.notify({ message: "Failed to update", color: "negative" });
    }
  });
}

async function isolateDevice(agentId: string) {
  try {
    await axios.post("/devicemanagement/actions/", {
      agent_id: agentId,
      action_type: "lock",
    });
    $q.notify({
      message: `Device ${agentId} isolation command sent`,
      color: "negative",
      icon: "lock",
    });
  } catch {
    $q.notify({ message: "Isolation command failed", color: "negative" });
  }
}

function promptIsolateDevice() {
  $q.dialog({
    title: "Isolate Device",
    message: "Enter the agent ID to isolate:",
    prompt: {
      model: "",
      label: "Agent ID",
      isValid: (value: string) => Boolean(value.trim()),
    },
    cancel: true,
    ok: { color: "negative", label: "Isolate" },
  }).onOk(async (agentId: string) => {
    await isolateDevice(agentId.trim());
  });
}
function lastResortBlock() {
  $q.dialog({
    title: "⚠ EMERGENCY BLOCK",
    message:
      "Applies block_access to all devices with open high/critical incidents (see server docs). Staff-only. Logged in audit. Continue?",
    cancel: { label: "Cancel" },
    ok: { color: "negative", label: "CONFIRM EMERGENCY BLOCK" },
  }).onOk(() => {
    $q.dialog({
      title: "Second Confirmation Required",
      message: "Type CONFIRM to proceed:",
      prompt: { model: "", label: "Type CONFIRM" },
      cancel: true,
      ok: { color: "negative", label: "Execute" },
    }).onOk(async (val: string) => {
      if (val !== "CONFIRM") {
        $q.notify({ message: "Cancelled — text did not match", color: "info" });
        return;
      }
      try {
        const { data } = await axios.post(
          "/security/forensics/emergency-block/",
          {
            confirmed: true,
            scope: "flagged",
            action_type: "block_access",
          },
        );
        const n = data?.affected_agents ?? 0;
        const c = data?.remote_actions_created ?? 0;
        $q.notify({
          message: `Emergency block: ${n} device(s), ${c} remote action(s) queued.`,
          color: "negative",
          icon: "block",
        });
        await loadForensics();
        await loadForensicsAudit();
      } catch (e: any) {
        $q.notify({
          message: _apiErrMessage(e, "Emergency block failed"),
          color: "negative",
          icon: "error",
        });
      }
    });
  });
}

// ===== UEBA (func #593, #802-811) =====
const loadingUEBA = ref(false);
const uebaSearch = ref("");
const uebaRiskFilter = ref("All");
const showSiemExport = ref(false);
const siemExportFilename = ref("ueba-anomalies.csv");
const uebaStats = ref<any[]>([]);
const anomalies = ref<any[]>([]);

const filteredAnomalies = computed(() =>
  anomalies.value.filter((a) => {
    const q = uebaSearch.value.toLowerCase();
    const matchSearch =
      !q ||
      (a.user || "").toLowerCase().includes(q) ||
      (a.agent_id || "").toLowerCase().includes(q) ||
      (a.device || "").toLowerCase().includes(q);
    const score = a.risk_score ?? 0;
    const matchRisk =
      uebaRiskFilter.value === "All" ||
      (uebaRiskFilter.value === "Critical" && score >= 90) ||
      (uebaRiskFilter.value === "High" && score >= 70 && score < 90) ||
      (uebaRiskFilter.value === "Medium" && score >= 40 && score < 70) ||
      (uebaRiskFilter.value === "Low" && score < 40);
    return matchSearch && matchRisk;
  }),
);

const uebaColumns = [
  {
    name: "user",
    label: "User",
    field: (r: any) => r.user || r.username || "—",
    align: "left",
  },
  {
    name: "device",
    label: "Device",
    field: (r: any) => r.device || r.agent_id || "—",
    align: "left",
  },
  {
    name: "pattern",
    label: "Behavior Pattern",
    field: (r: any) => r.pattern || r.event_type || "—",
    align: "left",
  },
  {
    name: "risk_score",
    label: "Risk Score",
    field: "risk_score",
    align: "left",
  },
  {
    name: "timestamp",
    label: "Timestamp",
    field: (r: any) => r.timestamp || r.occurred_at || "—",
    align: "left",
  },
  {
    name: "action",
    label: "Action Taken",
    field: (r: any) => r.action || r.remediation_action || "Logged",
    align: "left",
  },
];

const scanPolicy = ref({
  enabled: true,
  interval: "15 minutes",
  artifacts: ["Processes", "Network Connections", "USB Devices"],
  threshold: 75,
  autoIsolate: true,
  autoAlert: true,
  autoBlock: false,
});
const credentialRiskForm = ref({
  agent_id: "",
  username: "",
  risk_score: 95,
  response_action: "lock",
});
const credentialRiskActionOptions = [
  { label: "Monitor only", value: "monitor" },
  { label: "Lock device", value: "lock" },
  { label: "Block org access", value: "block_access" },
  { label: "Selective wipe", value: "wipe_selective" },
  { label: "Full wipe", value: "wipe_full" },
];

async function loadUEBA() {
  loadingUEBA.value = true;
  uebaError.value = "";
  const parts: string[] = [];
  try {
    const statsResp = await axios.get("/security/ueba/stats/");
    const d = statsResp.data;
    uebaStats.value = [
      {
        label: "Anomalies Detected",
        value: d.total_anomalies ?? 0,
        icon: "psychology",
        color: "negative",
      },
      {
        label: "High Risk Users",
        value: d.high_risk_users ?? 0,
        icon: "person_alert",
        color: "warning",
      },
      {
        label: "Devices Monitored",
        value: d.devices_monitored ?? 0,
        icon: "devices",
        color: "primary",
      },
      {
        label: "Avg Risk Score",
        value: d.avg_risk_score ?? 0,
        icon: "assessment",
        color: "info",
      },
    ];
  } catch (e: any) {
    uebaStats.value = [];
    parts.push(_apiErrMessage(e, "stats"));
  }
  try {
    const anomaliesResp = await axios.get("/security/ueba/anomalies/");
    anomalies.value = Array.isArray(anomaliesResp.data)
      ? anomaliesResp.data
      : [];
  } catch (e: any) {
    anomalies.value = [];
    parts.push(_apiErrMessage(e, "anomalies"));
  }
  if (parts.length) {
    uebaError.value = `Failed to load UEBA: ${parts.join("; ")}.`;
  }
  loadingUEBA.value = false;
}

async function loadScanPolicy() {
  try {
    const response = await axios.get("/security/ueba/scan-policy/");
    if (!response?.data) return;
    scanPolicy.value = {
      ...scanPolicy.value,
      ...response.data,
      artifacts: Array.isArray(response.data.artifacts)
        ? response.data.artifacts
        : scanPolicy.value.artifacts,
    };
  } catch {
    // Keep defaults if scan policy is not configured yet.
  }
}

async function saveScanPolicy() {
  try {
    await axios.post("/security/ueba/scan-policy/", scanPolicy.value);
    $q.notify({
      message: "Scan policy saved",
      color: "positive",
      icon: "check",
    });
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to save scan policy"),
      color: "negative",
    });
  }
}

async function sendCredentialRiskEvent() {
  try {
    const response = await axios.post("/security/credential-risk/events/", {
      ...credentialRiskForm.value,
      source: "admin_live_test",
      event_count: 1,
      window: "manual",
    });
    $q.notify({
      message: `Credential risk handled: ${response.data.action}`,
      color: response.data.dispatched ? "positive" : "warning",
      icon: response.data.dispatched ? "lock" : "visibility",
    });
    await loadIncidents();
    await loadUEBA();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to send credential risk event"),
      color: "negative",
    });
  }
}

function exportUebaToCsv() {
  const rows = filteredAnomalies.value.map((item) => ({
    user: item.user || item.username || "",
    device: item.device || item.agent_id || "",
    pattern: item.pattern || item.event_type || "",
    risk_score: item.risk_score ?? "",
    timestamp: item.timestamp || item.occurred_at || "",
    action: item.action || item.remediation_action || "Logged",
  }));

  const header = [
    "user",
    "device",
    "pattern",
    "risk_score",
    "timestamp",
    "action",
  ];
  const csv = [
    header.join(","),
    ...rows.map((row) =>
      header
        .map(
          (key) =>
            `"${String(row[key as keyof typeof row] ?? "").replace(/"/g, '""')}"`,
        )
        .join(","),
    ),
  ].join("\n");

  exportDataToCSV(csv, siemExportFilename.value || "ueba-anomalies.csv");
  showSiemExport.value = false;
  $q.notify({
    message: "UEBA anomalies exported",
    color: "positive",
    icon: "download",
  });
}

// ===== Threat Intel (func #763, #790) =====
const showAddIOC = ref(false);
const loadingIOC = ref(false);
const syncingFeeds = ref(false);
const iocSearch = ref("");
const iocList = ref<any[]>([]);
const threatFeeds = ref<any[]>([]);
const mitreTactics = ref<any[]>([]);
const mitreCoverageNote = ref("");
const newIOCForm = ref({
  indicator: "",
  ioc_type: "IP",
  severity: "Medium",
  source: "Manual",
  description: "",
});
const iocColumns = [
  {
    name: "indicator",
    label: "Indicator",
    field: "indicator",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "ioc_type",
    label: "Type",
    field: "ioc_type",
    align: "center" as const,
  },
  {
    name: "severity",
    label: "Severity",
    field: "severity",
    align: "center" as const,
  },
  { name: "source", label: "Source", field: "source", align: "left" as const },
  {
    name: "first_seen",
    label: "Added",
    field: "first_seen",
    align: "left" as const,
    format: (v: string) => (v ? new Date(v).toLocaleDateString() : "—"),
  },
  { name: "actions", label: "", field: "actions", align: "center" as const },
];

async function loadIOCs() {
  loadingIOC.value = true;
  try {
    const r = await axios.get("/security/threat-intel/iocs/", {
      params: iocSearch.value ? { search: iocSearch.value } : {},
    });
    iocList.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    iocList.value = [];
    threatIntelError.value = _apiErrMessage(e, "Failed to load IOCs.");
  } finally {
    loadingIOC.value = false;
  }
}

async function loadThreatFeeds() {
  try {
    const r = await axios.get("/security/threat-intel/feeds/");
    threatFeeds.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    threatFeeds.value = [];
    const msg = _apiErrMessage(e, "Failed to load threat feeds.");
    threatIntelError.value = threatIntelError.value
      ? `${threatIntelError.value} ${msg}`
      : msg;
  }
}

async function refreshThreatIntelAll() {
  threatIntelError.value = "";
  await loadIOCs();
  await loadThreatFeeds();
}

async function loadThreatIntelStats() {
  try {
    const r = await axios.get("/security/threat-intel/stats/");
    mitreTactics.value = Array.isArray(r.data?.mitre_tactics)
      ? r.data.mitre_tactics
      : [];
    mitreCoverageNote.value =
      typeof r.data?.mitre_coverage_note === "string"
        ? r.data.mitre_coverage_note
        : "";
  } catch {
    mitreTactics.value = [];
    mitreCoverageNote.value = "";
  }
}

async function addIOC() {
  if (!newIOCForm.value.indicator.trim()) {
    $q.notify({ message: "Indicator is required", color: "warning" });
    return;
  }
  try {
    await axios.post("/security/threat-intel/iocs/", newIOCForm.value);
    $q.notify({
      message: `IOC added: ${newIOCForm.value.indicator}`,
      color: "positive",
      icon: "check",
    });
    showAddIOC.value = false;
    newIOCForm.value = {
      indicator: "",
      ioc_type: "IP",
      severity: "Medium",
      source: "Manual",
      description: "",
    };
    await loadIOCs();
  } catch {
    $q.notify({ message: "Failed to add IOC", color: "negative" });
  }
}

function iocTypeColor(type: string) {
  return (
    {
      Hash: "negative",
      IP: "warning",
      Domain: "primary",
      URL: "orange",
      CVE: "deep-orange",
      Email: "teal",
    }[type] ?? "grey"
  );
}

async function removeIOC(id: number) {
  try {
    await axios.delete(`/security/threat-intel/iocs/${id}/`);
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to remove IOC"),
      color: "negative",
      icon: "error",
    });
    return;
  }
  iocList.value = iocList.value.filter((i) => i.id !== id);
  $q.notify({
    message: "IOC removed",
    color: "positive",
    icon: "delete",
    timeout: 1500,
  });
}

async function syncThreatFeed() {
  syncingFeeds.value = true;
  $q.notify({
    message: "Syncing threat feeds...",
    color: "info",
    icon: "sync",
  });
  try {
    const r = await axios.post("/security/threat-intel/sync/");
    $q.notify({
      message: `Sync complete — ${r.data.imported_iocs ?? 0} IOCs imported from ${r.data.synced_feeds} feed(s)`,
      color: "positive",
      icon: "check",
    });
    await refreshThreatIntelAll();
    await loadThreatIntelStats();
  } catch {
    $q.notify({ message: "Feed sync failed", color: "negative" });
  } finally {
    syncingFeeds.value = false;
  }
}

// ===== Microphone Control (func #705, #710-712) =====
const showAddMicRule = ref(false);
const micLoggingEnabled = ref(false);
const micMeetingDevices = ref([]);
const micMeetingDuration = ref("1 hour");
const micMeetingReason = ref("Confidential meeting");
const emergencyMicDevice = ref("");
const emergencyMicReason = ref("");
const deviceOptions = computed(() =>
  agentOptions.value.map((agent) => agent.value),
);
const micAppRules = ref<any[]>([]);
const newMicRule = ref({ app: "", exe: "", allowed: true });
const micAppColumns = [
  { name: "app_name", label: "Application", field: "app_name", align: "left" },
  {
    name: "exe_pattern",
    label: "Executable",
    field: "exe_pattern",
    align: "left",
  },
  { name: "allowed", label: "Mic Allowed", field: "allowed", align: "center" },
];
const micEvents = ref<any[]>([]);
const micEventColumns = [
  { name: "timestamp", label: "Time", field: "timestamp", align: "left" },
  { name: "device", label: "Device", field: "agent_id", align: "left" },
  { name: "app", label: "Application", field: "app", align: "left" },
  { name: "action", label: "Action", field: "action", align: "left" },
  {
    name: "source",
    label: "Source",
    field: (row: any) => row.details?.source || "server",
    align: "left",
  },
];

async function loadMicRulesFromServer() {
  try {
    let { data } = await axios.get("/security/mic-control/rules/");
    if (
      Array.isArray(data) &&
      data.length === 0 &&
      typeof window !== "undefined"
    ) {
      const raw = window.localStorage.getItem("security-mic-rules");
      if (raw) {
        try {
          const local = JSON.parse(raw) as {
            app: string;
            exe: string;
            allowed?: boolean;
          }[];
          for (const row of local) {
            if (!row.app?.trim() || !row.exe?.trim()) continue;
            await axios.post("/security/mic-control/rules/", {
              app_name: row.app.trim(),
              exe_pattern: row.exe.trim(),
              allowed: row.allowed !== false,
              agent_id: "",
            });
          }
          window.localStorage.removeItem("security-mic-rules");
          const r2 = await axios.get("/security/mic-control/rules/");
          data = r2.data;
        } catch {
          /* ignore migration errors */
        }
      }
    }
    micAppRules.value = Array.isArray(data) ? data : [];
  } catch {
    micAppRules.value = [];
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("security-mic-rules");
        micAppRules.value = raw
          ? (JSON.parse(raw) as any[]).map((row) => ({
              id: row.id,
              app_name: row.app,
              exe_pattern: row.exe,
              allowed: row.allowed,
            }))
          : [];
      } catch {
        micAppRules.value = [];
      }
    }
  }
}

async function loadMicLoggingState() {
  try {
    const { data } = await axios.get("/security/mic-control/logging/");
    micLoggingEnabled.value = !!data?.enabled;
  } catch {
    /* keep previous */
  }
}

async function loadMicEvents() {
  try {
    const { data } = await axios.get("/security/mic-control/events/");
    micEvents.value = Array.isArray(data) ? data : [];
  } catch {
    micEvents.value = [];
  }
}

async function loadMicControlAll() {
  await loadMicRulesFromServer();
  await loadMicLoggingState();
  await loadMicEvents();
}

async function updateMicRule(rule: any) {
  if (rule?.id == null) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "security-mic-rules",
        JSON.stringify(micAppRules.value),
      );
    }
    return;
  }
  try {
    await axios.patch(`/security/mic-control/rules/${rule.id}/`, {
      allowed: rule.allowed,
    });
    $q.notify({ message: "Rule updated", color: "positive", timeout: 1200 });
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to update rule"),
      color: "negative",
    });
  }
}

async function toggleMicLogging(val: boolean) {
  try {
    await axios.post("/security/mic-control/logging/", { enabled: val });
    $q.notify({
      message: val ? "Mic logging enabled" : "Mic logging disabled",
      color: val ? "positive" : "info",
    });
    await loadMicEvents();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to update logging setting"),
      color: "negative",
    });
  }
}

async function applyMeetingMode() {
  if (!micMeetingDevices.value.length) {
    $q.notify({ message: "Select at least one device", color: "warning" });
    return;
  }
  try {
    const { data } = await axios.post("/security/mic-control/meeting-mode/", {
      devices: micMeetingDevices.value,
      duration: micMeetingDuration.value,
      reason: micMeetingReason.value,
    });
    $q.notify({
      message: `Meeting mode sent to ${data?.dispatched ?? micMeetingDevices.value.length} device(s).`,
      color: "positive",
    });
    await loadMicEvents();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Meeting mode request failed"),
      color: "negative",
    });
  }
}

function muteMeetingMode() {
  const all = [...deviceOptions.value];
  if (!all.length) {
    $q.notify({
      message: "No devices in list — load agents first.",
      color: "warning",
    });
    return;
  }
  $q.dialog({
    title: "Meeting mode — all devices",
    message: `Mute microphones on ${all.length} agent(s)?`,
    cancel: true,
    ok: { color: "warning", label: "Record" },
  }).onOk(async () => {
    try {
      const { data } = await axios.post("/security/mic-control/meeting-mode/", {
        devices: all,
        duration: micMeetingDuration.value,
        reason: micMeetingReason.value,
      });
      $q.notify({
        message: `Meeting mode sent to ${data?.dispatched ?? all.length} devices.`,
        color: "warning",
        icon: "mic_off",
      });
      await loadMicEvents();
    } catch (e: any) {
      $q.notify({
        message: _apiErrMessage(e, "Request failed"),
        color: "negative",
      });
    }
  });
}

function emergencyMicAccess() {
  $q.notify({
    message:
      "Use the Emergency mic access form below — it is logged on the server.",
    color: "info",
    icon: "info",
  });
}

async function grantEmergencyMic() {
  if (!emergencyMicDevice.value || !emergencyMicReason.value) {
    $q.notify({ message: "Device and reason required", color: "warning" });
    return;
  }
  try {
    await axios.post("/security/mic-control/emergency/", {
      device: emergencyMicDevice.value,
      reason: emergencyMicReason.value,
    });
    $q.notify({
      message: `Emergency mic access sent to ${emergencyMicDevice.value}.`,
      color: "positive",
    });
    emergencyMicDevice.value = "";
    emergencyMicReason.value = "";
    await loadMicEvents();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to record emergency access"),
      color: "negative",
    });
  }
}

async function addMicRule() {
  if (!newMicRule.value.app.trim() || !newMicRule.value.exe.trim()) {
    $q.notify({
      message: "Application and executable are required",
      color: "warning",
    });
    return;
  }
  try {
    await axios.post("/security/mic-control/rules/", {
      app_name: newMicRule.value.app.trim(),
      exe_pattern: newMicRule.value.exe.trim(),
      allowed: newMicRule.value.allowed,
      agent_id: "",
    });
    newMicRule.value = { app: "", exe: "", allowed: true };
    showAddMicRule.value = false;
    $q.notify({ message: "Mic rule saved", color: "positive", icon: "check" });
    await loadMicRulesFromServer();
  } catch (e: any) {
    $q.notify({
      message: _apiErrMessage(e, "Failed to save rule"),
      color: "negative",
    });
  }
}
</script>
