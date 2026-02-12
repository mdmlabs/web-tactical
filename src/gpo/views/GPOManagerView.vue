<template>
  <q-page class="gpo-manager-page">
    <div class="row gpo-main-row">
      <div
        v-if="mainTab !== 'library'"
        :key="`content-${mainTab}`"
        class="gpo-content col-12"
      >
        <div class="row gpo-content-row">
          <div
            :class="
              mainTab === 'dashboard'
                ? 'gpo-main-content col-9'
                : 'gpo-main-content col-12'
            "
          >
            <div
              v-if="mainTab === 'dashboard' && selectedAgent"
              :key="`dashboard-agent-${contentTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <div class="row items-center full-width">
                  <div class="col">
                    <q-tabs
                      v-model="contentTab"
                      dense
                      inline-label
                      class="text-grey"
                      active-color="primary"
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                      no-caps
                    >
                      <q-tab name="overview" icon="info" label="Overview" />
                      <q-tab
                        name="system"
                        icon="settings"
                        label="System Info"
                      />
                      <q-tab name="users" icon="people" label="Users" />
                      <q-tab name="groups" icon="group" label="Groups" />
                    </q-tabs>
                  </div>
                  <div class="col-auto q-pa-sm">
                    <q-btn
                      flat
                      dense
                      icon="arrow_back"
                      label="Back to the dashboard"
                      color="primary"
                      @click="clearAgentSelection"
                    />
                  </div>
                </div>
                <q-separator />
              </div>

              <q-tab-panels v-model="contentTab" class="gpo-content-panels">
                <q-tab-panel name="overview" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <q-card>
                      <q-card-section>
                        <div class="row q-gutter-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Hostname</div>
                            <div>
                              {{
                                agentDetails?.hostName ||
                                selectedAgent.hostname ||
                                "N/A"
                              }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Status</div>
                            <q-badge
                              :color="
                                getAgentStatusColor(
                                  agentDetails?.isOnline !== undefined
                                    ? agentDetails.isOnline
                                      ? 'online'
                                      : 'offline'
                                    : selectedAgent.status,
                                )
                              "
                              :label="
                                getAgentStatusLabel(
                                  agentDetails?.isOnline !== undefined
                                    ? agentDetails.isOnline
                                      ? 'online'
                                      : 'offline'
                                    : selectedAgent.status,
                                )
                              "
                            />
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Last answer
                            </div>
                            <div>
                              {{
                                agentDetails?.lastHeartbeatUnix
                                  ? formatDate(
                                      new Date(
                                        (typeof agentDetails.lastHeartbeatUnix ===
                                        "string"
                                          ? Number.parseInt(
                                              agentDetails.lastHeartbeatUnix,
                                              10,
                                            )
                                          : agentDetails.lastHeartbeatUnix) *
                                          1000,
                                      ).toISOString(),
                                    )
                                  : formatDate(selectedAgent.last_seen)
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Operating system
                            </div>
                            <div>
                              {{
                                agentDetails?.nodeInfo?.systemInfo?.osVersion ||
                                agentDetails?.nodeInfo?.systemInfo
                                  ?.os_version ||
                                selectedAgent.operating_system ||
                                "N/A"
                              }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Model</div>
                            <div>
                              {{ agentDetails?.nodeInfo?.model || "N/A" }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Firmware version
                            </div>
                            <div>
                              {{
                                agentDetails?.nodeInfo?.firmwareVersion ||
                                agentDetails?.nodeInfo?.firmware_version ||
                                "N/A"
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              In the domain
                            </div>
                            <div>
                              {{
                                (
                                  agentDetails?.nodeInfo?.isDomainJoined !==
                                  undefined
                                    ? agentDetails.nodeInfo.isDomainJoined
                                    : agentDetails?.nodeInfo
                                          ?.is_domain_joined !== undefined
                                      ? agentDetails.nodeInfo.is_domain_joined
                                      : false
                                )
                                  ? "Yes"
                                  : "No"
                              }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-actions>
                        <q-btn
                          color="primary"
                          icon="policy"
                          label="Apply Policy"
                          @click="openApplyPolicyDialog"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="secondary"
                          icon="visibility"
                          label="Applied policies"
                          @click="openAppliedPoliciesDialog"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="system" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">System information</div>
                    <q-card v-if="agentDetails?.nodeInfo">
                      <q-card-section>
                        <q-scroll-area style="height: 600px">
                          <q-list>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Hostname</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.hostName ||
                                  agentDetails.nodeInfo.systemInfo?.host_name ||
                                  agentDetails.hostName ||
                                  selectedAgent.hostname
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Operating system</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.osVersion ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.os_version ||
                                  selectedAgent.operating_system ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>CPU</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.cpu || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>RAM</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.ramGb ||
                                  agentDetails.nodeInfo.systemInfo?.ram_gb
                                    ? `${agentDetails.nodeInfo.systemInfo.ramGb || agentDetails.nodeInfo.systemInfo.ram_gb} GB`
                                    : "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Motherboard</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo
                                    ?.motherboard || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo?.disksList ||
                                  agentDetails.nodeInfo.systemInfo?.disks ||
                                  []
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>Disks</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(disk, index) in agentDetails
                                      .nodeInfo?.systemInfo?.disksList ||
                                    agentDetails.nodeInfo?.systemInfo?.disks ||
                                    []"
                                    :key="index"
                                  >
                                    {{ disk }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo?.gpuList ||
                                  agentDetails.nodeInfo.systemInfo?.gpu ||
                                  []
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>GPU</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(gpu, index) in agentDetails.nodeInfo
                                      ?.systemInfo?.gpuList ||
                                    agentDetails.nodeInfo?.systemInfo?.gpu ||
                                    []"
                                    :key="index"
                                  >
                                    {{ gpu }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo
                                    ?.ipAddressesList ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.ipAddresses ||
                                  agentDetails.nodeInfo.systemInfo?.ip_addresses
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>IP address</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(ip, index) in agentDetails.nodeInfo
                                      .systemInfo.ipAddressesList ||
                                    agentDetails.nodeInfo.systemInfo
                                      .ipAddresses ||
                                    agentDetails.nodeInfo.systemInfo
                                      .ip_addresses ||
                                    []"
                                    :key="index"
                                    class="q-mb-xs"
                                  >
                                    {{ ip }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo
                                    ?.macAddressesList ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.macAddresses ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.mac_addresses
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>MAC address</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(mac, index) in agentDetails.nodeInfo
                                      .systemInfo.macAddressesList ||
                                    agentDetails.nodeInfo.systemInfo
                                      .macAddresses ||
                                    agentDetails.nodeInfo.systemInfo
                                      .mac_addresses ||
                                    []"
                                    :key="index"
                                    class="q-mb-xs"
                                  >
                                    {{ mac || "" }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item>
                              <q-item-section>
                                <q-item-label>Manufacturer</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.manufacturer || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Model</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.model || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Firmware version</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.firmwareVersion ||
                                  agentDetails.nodeInfo.firmware_version ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Assembling ОС</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.osBuild ||
                                  agentDetails.nodeInfo.os_build ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Time zone</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.timeZone ||
                                  agentDetails.nodeInfo.time_zone ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>In the domain</q-item-label>
                                <q-item-label caption>{{
                                  (
                                    agentDetails.nodeInfo.isDomainJoined !==
                                    undefined
                                      ? agentDetails.nodeInfo.isDomainJoined
                                      : agentDetails.nodeInfo
                                            .is_domain_joined !== undefined
                                        ? agentDetails.nodeInfo.is_domain_joined
                                        : false
                                  )
                                    ? "Yes"
                                    : "No"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Antivirus status</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.antivirusStatus ||
                                  agentDetails.nodeInfo.antivirus_status ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Online status</q-item-label>
                                <q-item-label caption>{{
                                  (
                                    agentDetails.nodeInfo.isOnline !== undefined
                                      ? agentDetails.nodeInfo.isOnline
                                      : agentDetails.nodeInfo.is_online !==
                                          undefined
                                        ? agentDetails.nodeInfo.is_online
                                        : false
                                  )
                                    ? "Online"
                                    : "Offline"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Last download</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo?.lastBootTimeUnix ||
                                  agentDetails.nodeInfo?.last_boot_time_unix
                                    ? (() => {
                                        const bootTime =
                                          agentDetails.nodeInfo
                                            ?.lastBootTimeUnix ||
                                          agentDetails.nodeInfo
                                            ?.last_boot_time_unix;
                                        if (!bootTime) return "N/A";
                                        const bootTimeValue =
                                          typeof bootTime === "string"
                                            ? Number.parseInt(bootTime, 10)
                                            : bootTime;
                                        return formatDate(
                                          new Date(
                                            bootTimeValue * 1000,
                                          ).toISOString(),
                                        );
                                      })()
                                    : "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </q-card-section>
                    </q-card>
                    <q-card v-else>
                      <q-card-section>
                        <div class="text-center text-grey-6">
                          Loading system information...
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="users" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">Users</div>
                    <q-table
                      :rows="usersList"
                      :columns="usersColumns"
                      row-key="sid"
                      :loading="usersLoading"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-type="props">
                        <q-td :props="props">
                          <q-badge
                            :color="
                              props.value === 'Local' ? 'primary' : 'secondary'
                            "
                            :label="props.value"
                          />
                        </q-td>
                      </template>
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="policy"
                            color="primary"
                            @click="openApplyPolicyDialogForUser(props.row)"
                          >
                            <q-tooltip>Assign a policy</q-tooltip>
                          </q-btn>
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="groups" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">Groups</div>
                    <q-table
                      :rows="groupsList"
                      :columns="groupsColumns"
                      row-key="sid"
                      :loading="groupsLoading"
                      flat
                      bordered
                    >
                    </q-table>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'dashboard'"
              :key="`dashboard-${subTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="subTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab name="status" icon="info" label="General status" />
                  <q-tab name="events" icon="event" label="Recent events" />
                  <q-tab name="agents" icon="computer" label="Active agents" />
                  <q-tab name="errors" icon="error" label="Policy errors" />
                  <q-tab name="overview" icon="visibility" label="Review" />
                  <q-tab name="metrics" icon="bar_chart" label="Metrics" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="subTab" class="gpo-content-panels">
                <q-tab-panel name="status" class="q-pa-md">
                  <div class="text-h6 q-mb-md">General status</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6">{{ agentsList.length }}</div>
                        <div class="text-caption text-grey-7">
                          Total devices
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6 text-positive">
                          {{
                            agentsList.filter((a) => a.status === "online")
                              .length
                          }}
                        </div>
                        <div class="text-caption text-grey-7">Online</div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6 text-negative">
                          {{
                            agentsList.filter((a) => a.status === "overdue")
                              .length
                          }}
                        </div>
                        <div class="text-caption text-grey-7">Overdue</div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <q-card class="q-mt-md">
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">
                        Device statistics
                      </div>
                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-item-label>Total policy</q-item-label>
                            <q-item-label caption>
                              {{ policiesStore.policies.value.length }} policy
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>Active appointments</q-item-label>
                            <q-item-label caption>Loading...</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="events" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Recent events</div>
                  <q-card>
                    <q-card-section>
                      <q-timeline color="primary">
                        <q-timeline-entry
                          v-for="(event, index) in recentEvents"
                          :key="index"
                          :title="event.title"
                          :subtitle="event.date"
                          :icon="event.icon"
                          :color="event.color"
                        >
                          <div>{{ event.description }}</div>
                        </q-timeline-entry>
                        <q-timeline-entry
                          v-if="recentEvents.length === 0"
                          title="No events"
                          subtitle="No events"
                          icon="info"
                        >
                          <div>
                            Events will be displayed here after they appear.
                          </div>
                        </q-timeline-entry>
                      </q-timeline>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="agents" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Active agents</div>
                  <q-table
                    :rows="agentsList"
                    :columns="agentTableColumns"
                    row-key="id"
                    :loading="agentsLoading"
                    flat
                    bordered
                  >
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-badge
                          :color="getAgentStatusColor(props.value)"
                          :label="getAgentStatusLabel(props.value)"
                          rounded
                        >
                          <q-tooltip>
                            {{ getAgentStatusTooltip(props.value) }}
                          </q-tooltip>
                        </q-badge>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="errors" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Policy errors</div>
                  <q-card>
                    <q-card-section>
                      <div class="text-center q-pa-lg text-grey-6">
                        <q-icon
                          name="check_circle"
                          size="3em"
                          class="q-mb-md"
                        />
                        <div>No errors were found</div>
                        <div class="text-caption q-mt-sm">
                          All policies are applied correctly
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="overview" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Review</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-6">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">Devices</div>
                        <div class="text-h4">{{ agentsList.length }}</div>
                        <div class="text-caption text-grey-7">
                          Total devices in the system
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-6">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">Policies</div>
                        <div class="text-h4">
                          {{ policiesStore.policies.value.length }}
                        </div>
                        <div class="text-caption text-grey-7">
                          Available policies
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <q-card class="q-mt-md">
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">Quick access</div>
                      <div class="row q-gutter-sm">
                        <q-btn
                          color="primary"
                          label="Policy Library"
                          icon="library_books"
                          @click="mainTab = 'library'"
                        />
                        <q-btn
                          color="secondary"
                          label="Windows Policies"
                          icon="windows"
                          @click="mainTab = 'windows'"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="metrics" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Metrics</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-12">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">
                          Policy application statistics
                        </div>
                        <q-list>
                          <q-item>
                            <q-item-section>
                              <q-item-label>Policy applied</q-item-label>
                              <q-item-label caption
                                >Uploading data...</q-item-label
                              >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label
                                >Successful applications</q-item-label
                              >
                              <q-item-label caption
                                >Uploading data...</q-item-label
                              >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label>Application errors</q-item-label>
                              <q-item-label caption>0</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'network'"
              :key="`network-${networkTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="networkTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab name="agents" icon="computer" label="Agents" />
                  <q-tab name="management" icon="settings" label="Management" />
                  <q-tab name="network" icon="router" label="Network" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="networkTab" class="gpo-content-panels">
                <q-tab-panel name="agents" class="q-pa-md">
                  <div class="row q-mb-md items-center">
                    <div class="col-auto">
                      <div class="text-h6">Agents</div>
                    </div>
                    <q-space />
                    <div class="col-auto">
                      <q-btn-toggle
                        v-model="networkStatusFilter"
                        :options="[
                          { label: 'All', value: 'all' },
                          { label: 'Online', value: 'online' },
                          { label: 'Offline', value: 'offline' },
                        ]"
                        color="primary"
                        dense
                      />
                    </div>
                  </div>
                  <q-table
                    :rows="filteredNetworkAgents"
                    :columns="agentTableColumns"
                    row-key="id"
                    :loading="agentsLoading"
                    flat
                    bordered
                    @row-click="(evt, row) => selectAgent(row)"
                  >
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-badge
                          :color="getAgentStatusColor(props.value)"
                          :label="getAgentStatusLabel(props.value)"
                          rounded
                        >
                          <q-tooltip>
                            {{ getAgentStatusTooltip(props.value) }}
                          </q-tooltip>
                        </q-badge>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="management" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Management</div>
                  <div v-if="selectedAgent" class="q-mb-md">
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">
                          {{ selectedAgent.hostname }}
                        </div>
                        <div class="row q-gutter-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              General status
                            </div>
                            <q-badge
                              :color="getAgentStatusColor(selectedAgent.status)"
                              :label="getAgentStatusLabel(selectedAgent.status)"
                              class="q-mt-xs"
                            />
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Last answer
                            </div>
                            <div class="q-mt-xs">
                              {{ formatDate(selectedAgent.last_seen) }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">ОС</div>
                            <div class="q-mt-xs">
                              {{ selectedAgent.operating_system || "N/A" }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-actions>
                        <q-btn
                          color="primary"
                          icon="refresh"
                          label="Reboot"
                          @click="handleReboot"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="warning"
                          icon="power_settings_new"
                          label="Disable"
                          @click="handleShutdown"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="negative"
                          icon="delete"
                          label="Delete"
                          @click="handleDelete"
                          :loading="actionLoading"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Select an agent from the list to manage
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="network" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Network</div>
                  <div v-if="selectedAgent">
                    <q-card class="q-mb-md">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">
                          IP-configuration
                        </div>
                        <q-list>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="fas fa-network-wired" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>LAN IP</q-item-label>
                              <q-item-label caption>
                                {{ networkInfo.local_ips || "Loading..." }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="fas fa-globe-americas" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>Public IP</q-item-label>
                              <q-item-label caption>
                                {{ networkInfo.public_ip || "Loading..." }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">Ping</div>
                        <div class="row q-gutter-md items-center">
                          <div class="col-auto">
                            <q-btn
                              color="primary"
                              icon="network_check"
                              label="perform Ping"
                              @click="handlePing"
                              :loading="pingLoading"
                            />
                          </div>
                          <div class="col" v-if="pingResult">
                            <q-badge
                              :color="
                                pingResult.status === 'online'
                                  ? 'positive'
                                  : 'negative'
                              "
                              :label="
                                pingResult.status === 'online'
                                  ? 'Online'
                                  : 'Offline'
                              "
                            />
                            <div
                              class="text-caption q-mt-xs"
                              v-if="pingResult.message"
                            >
                              {{ pingResult.message }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Select an agent from the list to view network information.
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'collections'"
              key="collections"
              class="gpo-content-panels"
            >
              <GPOCollectionsTable />
            </div>

            <div
              v-else-if="mainTab === 'devices'"
              :key="`devices-${devicesTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="devicesTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab
                    name="assignment"
                    icon="assignment"
                    label="Appointment"
                  />
                  <q-tab name="history" icon="history" label="History" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="devicesTab" class="gpo-content-panels">
                <q-tab-panel name="assignment" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">
                      Assigning policies for {{ selectedAgent.hostname }}
                    </div>

                    <q-card class="q-mt-md">
                      <q-card-section>
                        <div class="text-subtitle2 q-mb-md">
                          Assigned policies
                        </div>
                        <q-scroll-area class="policy-assignment-scroll-area">
                          <q-table
                            :rows="assignedPolicies"
                            :columns="assignedPolicyColumns"
                            row-key="id"
                            flat
                            bordered
                            class="policy-assignment-table"
                          >
                            <template v-slot:body-cell-actions="props">
                              <q-td :props="props">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="delete"
                                  color="negative"
                                  size="sm"
                                  @click="removePolicyAssignment(props.row)"
                                >
                                  <q-tooltip>Delete an appointment</q-tooltip>
                                </q-btn>
                              </q-td>
                            </template>
                          </q-table>
                        </q-scroll-area>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Select the device to assign policies to
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="history" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">
                      History of actions for {{ selectedAgent.hostname }}
                    </div>
                    <q-card>
                      <q-card-section>
                        <div class="row q-gutter-md">
                          <q-btn
                            color="primary"
                            icon="refresh"
                            label="Apply again"
                            @click="reapplyPolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                          <q-btn
                            color="warning"
                            icon="undo"
                            label="Roll back"
                            @click="rollbackPolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                          <q-btn
                            color="secondary"
                            icon="sync"
                            label="Synchronize"
                            @click="synchronizePolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="q-mt-md">
                      <q-card-section>
                        <div class="text-subtitle2 q-mb-md">
                          History of actions
                        </div>
                        <q-timeline color="primary">
                          <q-timeline-entry
                            v-for="(action, index) in deviceActionHistory"
                            :key="index"
                            :title="action.title"
                            :subtitle="action.date"
                            :icon="action.icon"
                            :color="action.color"
                          >
                            <div class="row items-center no-wrap">
                              <div class="col">
                                {{ action.description }}
                              </div>
                              <div class="col-auto" v-if="action.policyHash">
                                <q-btn
                                  dense
                                  flat
                                  round
                                  size="sm"
                                  icon="policy"
                                  @click.stop="
                                    openPolicyDetails(action.policyHash)
                                  "
                                >
                                  <q-tooltip>Policy details</q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                          </q-timeline-entry>
                          <q-timeline-entry
                            v-if="deviceActionHistory.length === 0"
                            title="No action"
                            subtitle="The action history is empty"
                            icon="info"
                          >
                            <div>The action history will be displayed here</div>
                          </q-timeline-entry>
                        </q-timeline>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Select a device to view the activity history.
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'windows'"
              :key="`windows-${windowsTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="windowsTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab
                    v-for="group in admxGroups"
                    :key="group.group"
                    :name="`admx-${group.group}`"
                    :icon="getAdmxGroupIcon(group.group)"
                    :label="group.ui_name"
                  />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="windowsTab" class="gpo-content-panels">
                <q-tab-panel
                  v-for="group in admxGroups"
                  :key="`admx-${group.group}`"
                  :name="`admx-${group.group}`"
                  class="q-pa-none admx-tab-panel"
                >
                  <q-scroll-area class="admx-scroll-area">
                    <div class="q-pa-md">
                      <div class="text-h6 q-mb-md">{{ group.ui_name }}</div>
                      <div class="text-caption text-grey-7 q-mb-md">
                        {{ group.description }}
                      </div>

                      <div v-if="admxLoading" class="text-center q-pa-lg">
                        <q-spinner color="primary" size="3em" />
                        <div class="q-mt-md">Uploading policies...</div>
                      </div>

                      <div v-else>
                        <div
                          class="row q-col-gutter-md"
                          style="height: calc(100vh - 300px)"
                        >
                          <div
                            :class="
                              selectedAdmxFile &&
                              selectedAdmxFileGroup === group.group
                                ? 'col-3'
                                : 'col-12'
                            "
                          >
                            <q-card flat bordered class="full-height">
                              <q-card-section>
                                <!-- <div class="text-subtitle2 q-mb-md">
                                  ADMX file
                                </div> -->
                                <q-scroll-area
                                  :style="
                                    selectedAdmxFile &&
                                    selectedAdmxFileGroup === group.group
                                      ? 'height: calc(100vh - 400px)'
                                      : 'height: calc(100vh - 200px)'
                                  "
                                >
                                  <div class="q-gutter-sm">
                                    <q-card
                                      v-for="admxFile in group.admx_files"
                                      :key="admxFile.file"
                                      class="cursor-pointer"
                                      @click="
                                        onAdmxFileClick(
                                          admxFile.file,
                                          group.group,
                                        )
                                      "
                                      :class="{
                                        'bg-primary text-white':
                                          selectedAdmxFile === admxFile.file,
                                      }"
                                    >
                                      <q-card-section>
                                        <div class="text-subtitle2 q-mb-xs">
                                          {{ admxFile.ui_name }}
                                        </div>
                                        <div
                                          class="text-caption"
                                          :class="{
                                            'text-grey-3':
                                              selectedAdmxFile ===
                                              admxFile.file,
                                            'text-grey-7':
                                              selectedAdmxFile !==
                                              admxFile.file,
                                          }"
                                        >
                                          {{ admxFile.description }}
                                        </div>
                                      </q-card-section>
                                    </q-card>
                                  </div>
                                </q-scroll-area>
                              </q-card-section>
                            </q-card>
                          </div>

                          <div
                            v-if="
                              selectedAdmxFile &&
                              selectedAdmxFileGroup === group.group
                            "
                            class="col-9"
                          >
                            <div
                              v-if="loadingAdmxPolicies"
                              class="text-center q-pa-lg"
                            >
                              <q-spinner color="primary" size="2em" />
                              <div class="q-mt-sm">Uploading policies...</div>
                            </div>

                            <div
                              v-else-if="admxPoliciesError"
                              class="text-center q-pa-lg text-negative"
                            >
                              <q-icon name="error" size="2em" />
                              <div class="q-mt-sm">{{ admxPoliciesError }}</div>
                              <q-btn
                                flat
                                dense
                                color="primary"
                                label="Repeat"
                                @click="loadPoliciesByAdmx(selectedAdmxFile)"
                                class="q-mt-sm"
                              />
                            </div>

                            <div
                              v-else-if="admxPolicies.length === 0"
                              class="text-center q-pa-lg text-grey-6"
                            >
                              <q-icon name="info" size="2em" />
                              <div class="q-mt-sm">
                                There are no policies in this file
                              </div>
                            </div>

                            <div v-else class="row q-col-gutter-md full-height">
                              <div class="col-3">
                                <q-card flat bordered class="full-height">
                                  <q-card-section>
                                    <div class="text-subtitle2 q-mb-md">
                                      Policies
                                    </div>
                                    <q-scroll-area
                                      style="height: calc(100vh - 400px)"
                                    >
                                      <q-list separator>
                                        <q-item
                                          v-for="policy in admxPolicies"
                                          :key="policy.id"
                                          clickable
                                          v-ripple
                                          :active="
                                            selectedAdmxPolicy?.id === policy.id
                                          "
                                          @click="onAdmxPolicySelect(policy)"
                                          class="q-mb-xs"
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              class="text-weight-medium"
                                            >
                                              {{
                                                policy.display_name ||
                                                policy.name
                                              }}
                                            </q-item-label>
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-scroll-area>
                                  </q-card-section>
                                </q-card>
                              </div>

                              <div class="col-9">
                                <q-card flat bordered class="full-height">
                                  <q-card-section
                                    v-if="selectedAdmxPolicy"
                                    class="q-pa-none"
                                  >
                                    <q-tabs
                                      v-model="admxPolicySettingsTab"
                                      dense
                                      inline-label
                                      class="text-grey q-px-md q-pt-md"
                                      active-color="primary"
                                      indicator-color="primary"
                                      align="left"
                                      narrow-indicator
                                      no-caps
                                    >
                                      <q-tab
                                        name="settings"
                                        icon="settings"
                                        label="Setting up Policies"
                                      />
                                      <q-tab
                                        name="description"
                                        icon="description"
                                        label="Description"
                                      />
                                    </q-tabs>

                                    <q-separator class="q-mt-sm" />

                                    <q-tab-panels
                                      v-model="admxPolicySettingsTab"
                                      class="q-mt-md"
                                      style="
                                        height: calc(100vh - 500px);
                                        overflow-y: auto;
                                      "
                                    >
                                      <q-tab-panel
                                        name="settings"
                                        class="q-pa-md"
                                      >
                                        <div
                                          v-if="loadingAdmxPolicyDetails"
                                          class="text-center q-pa-lg"
                                        >
                                          <q-spinner
                                            color="primary"
                                            size="2em"
                                          />
                                          <div class="q-mt-sm">
                                            Loading the settings...
                                          </div>
                                        </div>

                                        <div
                                          v-else-if="
                                            admxPolicyDetailsElements.length ===
                                            0
                                          "
                                          class="text-center q-pa-lg text-grey-6"
                                        >
                                          <q-icon name="info" size="2em" />
                                          <div class="q-mt-sm">
                                            There are no additional settings
                                          </div>
                                        </div>

                                        <div
                                          v-else
                                          class="policy-settings-form"
                                        >
                                          <q-form>
                                            <div
                                              v-for="element in admxPolicyDetailsElements"
                                              :key="element.id"
                                              class="q-mb-md"
                                            >
                                              <div class="policy-element">
                                                <div
                                                  class="text-subtitle2 q-mb-xs"
                                                >
                                                  {{
                                                    element.display_name ||
                                                    element.element_id
                                                  }}
                                                </div>
                                                <div
                                                  v-if="element.description"
                                                  class="text-caption text-grey-7 q-mb-sm"
                                                >
                                                  {{ element.description }}
                                                </div>

                                                <q-toggle
                                                  v-if="
                                                    element.type ===
                                                      'CHECKBOX' ||
                                                    element.type === 'BOOL' ||
                                                    element.type ===
                                                      'boolean' ||
                                                    element.type ===
                                                      'checkBox' ||
                                                    element.presentation_type?.toLowerCase() ===
                                                      'checkbox' ||
                                                    element.presentation_type?.toLowerCase() ===
                                                      'check_box' ||
                                                    element.presentation_type ===
                                                      'checkBox'
                                                  "
                                                  :model-value="
                                                    (admxPolicySettingsValues[
                                                      element.element_id
                                                    ] as boolean) || false
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  color="primary"
                                                />

                                                <q-input
                                                  v-else-if="
                                                    element.type === 'TEXT' ||
                                                    element.type === 'STRING' ||
                                                    element.type === 'string' ||
                                                    element.type === 'text' ||
                                                    element.type ===
                                                      'multiTextbox' ||
                                                    element.type ===
                                                      'multiTextBox' ||
                                                    element.presentation_type?.toLowerCase() ===
                                                      'textbox' ||
                                                    element.presentation_type?.toLowerCase() ===
                                                      'text_box' ||
                                                    element.presentation_type?.toLowerCase() ===
                                                      'text' ||
                                                    element.presentation_type ===
                                                      'multiTextbox' ||
                                                    element.presentation_type ===
                                                      'multiTextBox'
                                                  "
                                                  :model-value="
                                                    String(
                                                      admxPolicySettingsValues[
                                                        element.element_id
                                                      ] || '',
                                                    )
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  :maxlength="
                                                    element.max_length
                                                  "
                                                  :type="
                                                    element.type ===
                                                      'multiTextbox' ||
                                                    element.type ===
                                                      'multiTextBox' ||
                                                    element.presentation_type ===
                                                      'multiTextbox' ||
                                                    element.presentation_type ===
                                                      'multiTextBox'
                                                      ? 'textarea'
                                                      : 'text'
                                                  "
                                                  :rows="
                                                    element.type ===
                                                      'multiTextbox' ||
                                                    element.type ===
                                                      'multiTextBox' ||
                                                    element.presentation_type ===
                                                      'multiTextbox' ||
                                                    element.presentation_type ===
                                                      'multiTextBox'
                                                      ? 3
                                                      : undefined
                                                  "
                                                  :hint="
                                                    element.required
                                                      ? 'Required field'
                                                      : ''
                                                  "
                                                  outlined
                                                  dense
                                                />

                                                <q-input
                                                  v-else-if="
                                                    element.type ===
                                                      'NUMERIC' ||
                                                    element.type === 'INT' ||
                                                    element.type === 'int' ||
                                                    element.type === 'number' ||
                                                    element.type ===
                                                      'decimalTextbox' ||
                                                    element.type ===
                                                      'decimalTextBox' ||
                                                    element.value_type ===
                                                      'decimal' ||
                                                    element.value_type ===
                                                      'int' ||
                                                    element.value_type ===
                                                      'integer' ||
                                                    element.presentation_type ===
                                                      'decimalTextbox' ||
                                                    element.presentation_type ===
                                                      'decimalTextBox'
                                                  "
                                                  :model-value="
                                                    Number(
                                                      admxPolicySettingsValues[
                                                        element.element_id
                                                      ] || 0,
                                                    )
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  type="number"
                                                  :min="element.min_value"
                                                  :max="element.max_value"
                                                  :step="
                                                    element.value_type ===
                                                      'decimal' ||
                                                    element.type ===
                                                      'decimalTextbox' ||
                                                    element.type ===
                                                      'decimalTextBox' ||
                                                    element.presentation_type ===
                                                      'decimalTextbox' ||
                                                    element.presentation_type ===
                                                      'decimalTextBox'
                                                      ? 0.01
                                                      : 1
                                                  "
                                                  :hint="
                                                    element.required
                                                      ? 'Required field'
                                                      : ''
                                                  "
                                                  outlined
                                                  dense
                                                />

                                                <MultiTextBox
                                                  v-else-if="
                                                    (element.type === 'list' ||
                                                      element.type === 'LIST' ||
                                                      element.type ===
                                                        'List') &&
                                                    (element.presentation_type?.toLowerCase() ===
                                                      'listbox' ||
                                                      element.presentation_type?.toLowerCase() ===
                                                        'list_box' ||
                                                      element.presentation_type?.toLowerCase() ===
                                                        'list' ||
                                                      element.presentation_type ===
                                                        'List') &&
                                                    (!element.items ||
                                                      element.items.length ===
                                                        0)
                                                  "
                                                  :model-value="
                                                    (admxPolicySettingsValues[
                                                      element.element_id
                                                    ] as string[]) || []
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  :hint="
                                                    (element.required
                                                      ? 'Required field'
                                                      : '') +
                                                    (element.value_type
                                                      ? ` (value type: ${element.value_type})`
                                                      : '')
                                                  "
                                                  :maxlength="
                                                    element.max_length
                                                  "
                                                />

                                                <q-select
                                                  v-else-if="
                                                    (element.type === 'LIST' ||
                                                      element.type === 'list' ||
                                                      element.type === 'List' ||
                                                      element.type === 'enum' ||
                                                      element.type ===
                                                        'dropdownList' ||
                                                      element.presentation_type?.toLowerCase() ===
                                                        'dropdownlist' ||
                                                      element.presentation_type?.toLowerCase() ===
                                                        'dropdown_list' ||
                                                      element.presentation_type ===
                                                        'dropdownList') &&
                                                    element.items &&
                                                    element.items.length > 0
                                                  "
                                                  :model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] ?? null
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  :options="element.items"
                                                  option-label="display_name"
                                                  option-value="id"
                                                  :hint="
                                                    (element.required
                                                      ? 'Required field'
                                                      : '') +
                                                    (element.value_type
                                                      ? ` (value type: ${element.value_type})`
                                                      : '')
                                                  "
                                                  outlined
                                                  dense
                                                  emit-value
                                                  map-options
                                                />

                                                <q-input
                                                  v-else
                                                  :model-value="
                                                    String(
                                                      admxPolicySettingsValues[
                                                        element.element_id
                                                      ] || '',
                                                    )
                                                  "
                                                  @update:model-value="
                                                    admxPolicySettingsValues[
                                                      element.element_id
                                                    ] = $event
                                                  "
                                                  :hint="`Type: ${element.type}${element.required ? ' (required)' : ''}`"
                                                  outlined
                                                  dense
                                                />
                                              </div>
                                            </div>
                                          </q-form>
                                        </div>
                                      </q-tab-panel>

                                      <q-tab-panel
                                        name="description"
                                        class="q-pa-md"
                                      >
                                        <div
                                          v-if="loadingAdmxPolicyDetails"
                                          class="text-center q-pa-lg"
                                        >
                                          <q-spinner
                                            color="primary"
                                            size="2em"
                                          />
                                          <div class="q-mt-sm">
                                            Uploading the description...
                                          </div>
                                        </div>

                                        <div
                                          v-else-if="selectedAdmxPolicy"
                                          class="policy-description"
                                        >
                                          <div class="text-h6 q-mb-md">
                                            {{
                                              selectedAdmxPolicy.display_name ||
                                              selectedAdmxPolicy.name
                                            }}
                                          </div>

                                          <div
                                            v-if="
                                              admxPolicyFullDescription ||
                                              selectedAdmxPolicy.explain_text
                                            "
                                            class="text-body2 text-grey-8 q-mb-md"
                                            style="
                                              white-space: normal;
                                              line-height: 1.6;
                                            "
                                          >
                                            {{
                                              admxPolicyFullDescription ||
                                              selectedAdmxPolicy.explain_text
                                            }}
                                          </div>
                                          <div
                                            v-else
                                            class="text-body2 text-grey-5 q-mb-md text-italic"
                                          >
                                            The description is missing
                                          </div>
                                        </div>
                                      </q-tab-panel>
                                    </q-tab-panels>
                                  </q-card-section>

                                  <q-card-section
                                    v-else
                                    class="text-center q-pa-lg text-grey-6"
                                  >
                                    <q-icon name="info" size="3em" />
                                    <div class="q-mt-md">
                                      Select a policy to configure
                                    </div>
                                  </q-card-section>

                                  <q-card-actions
                                    v-if="selectedAdmxPolicy"
                                    align="right"
                                    class="q-pa-md"
                                  >
                                    <q-btn
                                      flat
                                      label="Disable"
                                      color="negative"
                                      @click="disableAdmxPolicy"
                                      :disable="!selectedAdmxPolicy"
                                    />
                                    <q-btn
                                      flat
                                      label="Apply"
                                      color="positive"
                                      @click="applyAdmxPolicy"
                                      :disable="!selectedAdmxPolicy"
                                    />
                                  </q-card-actions>
                                </q-card>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="group.admx_files.length === 0"
                        class="text-center q-pa-lg text-grey-6"
                      >
                        <q-icon name="info" size="3em" class="q-mb-md" />
                        <div>
                          There are no ADMX files available in this group.
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>

          <div
            v-if="mainTab === 'devices' || mainTab === 'dashboard'"
            :key="`devices-${mainTab}`"
            class="gpo-devices-panel col-3"
          >
            <div class="gpo-devices-header">
              <div class="row items-center justify-between">
                <div class="text-subtitle2 text-weight-medium">
                  Devices
                  <q-badge
                    v-if="agentsList.length > 0"
                    color="primary"
                    :label="agentsList.length"
                    rounded
                    class="q-ml-sm"
                  />
                </div>
                <q-btn
                  round
                  dense
                  flat
                  icon="refresh"
                  :loading="agentsLoading"
                  @click="loadAgents"
                  size="sm"
                >
                  <q-tooltip>Update the list of agents</q-tooltip>
                </q-btn>
              </div>
            </div>
            <q-scroll-area class="gpo-devices-scroll">
              <div v-if="agentsLoading" class="text-center q-pa-md">
                <q-spinner color="primary" size="2em" />
                <div class="q-mt-sm text-caption">Loading devices...</div>
              </div>

              <div
                v-else-if="agentsError && agentsList.length === 0"
                class="text-center q-pa-md text-negative"
              >
                <q-icon name="error" size="2em" />
                <div class="q-mt-sm text-caption">Download error</div>
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Repeat"
                  @click="loadAgents"
                  class="q-mt-xs"
                />
              </div>

              <div
                v-else-if="!agentsLoading && agentsList.length === 0"
                class="text-center q-pa-md text-grey-6"
              >
                <q-icon name="devices_other" size="2em" />
                <div class="q-mt-sm text-caption">no agents</div>
              </div>

              <q-list
                v-else-if="!agentsLoading && agentsList.length > 0"
                dense
                class="gpo-agents-list-items"
              >
                <q-item
                  v-for="agent in agentsList"
                  :key="agent.id"
                  clickable
                  v-ripple
                  :active="selectedAgent?.id === agent.id"
                  @click="selectAgent(agent)"
                  class="gpo-agent-item"
                >
                  <q-item-section avatar>
                    <q-icon
                      name="computer"
                      :color="getAgentStatusColor(agent.status)"
                      size="24px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ agent.hostname }}</q-item-label>
                    <q-item-label caption>
                      {{ formatDate(agent.last_seen) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="getAgentStatusColor(agent.status)"
                      :label="getAgentStatusLabel(agent.status)"
                      rounded
                    >
                      <q-tooltip>
                        {{ getAgentStatusTooltip(agent.status) }}
                      </q-tooltip>
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>

      <div
        v-if="mainTab === 'library'"
        :key="`library-${libraryTab}`"
        class="gpo-content col-12 gpo-library-content"
      >
        <div class="gpo-content-header">
          <div class="text-h6 q-pa-md">Policy Library</div>
        </div>
        <div class="gpo-content-panels q-pa-md">
          <q-tabs
            v-model="libraryTab"
            dense
            inline-label
            class="text-grey q-mb-md"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
          >
            <q-tab name="policies" icon="rule" label="Policies" />
            <q-tab name="management" icon="settings" label="Management" />
          </q-tabs>

          <q-tab-panels v-model="libraryTab" class="gpo-library-panels">
            <q-tab-panel name="policies" class="q-pa-none">
              <q-tabs
                v-model="policiesSubTab"
                dense
                inline-label
                class="text-grey q-mb-md"
                active-color="primary"
                indicator-color="primary"
                align="left"
                narrow-indicator
                no-caps
              >
                <q-tab name="all" icon="list" label="All policies" />
                <q-tab name="templates" icon="description" label="Templates" />
                <q-tab name="archive" icon="archive" label="Archive" />
              </q-tabs>

              <q-tab-panels
                v-model="policiesSubTab"
                class="gpo-policies-sub-panels"
              >
                <q-tab-panel name="all" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Policy search..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Uploading policies...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Policy loading error
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Repeat"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('all')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="templates" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Search for templates..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Uploading templates...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Template loading error
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Repeat"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('templates')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="archive" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Search in the archive..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Uploading the archive...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Archive upload error
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Repeat"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('archive')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-tab-panel>

            <q-tab-panel name="management" class="q-pa-none">
              <q-scroll-area
                class="management-scroll-area"
                :style="{ height: 'calc(100vh - 200px)' }"
              >
                <div class="q-pa-md">
                  <div class="text-h6 q-mb-md">Policy management</div>
                  <q-card class="q-mb-md">
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-sm">
                        Import ADMX Files
                      </div>
                      <div class="text-caption text-grey-7 q-mb-md">
                        Upload a ZIP archive containing ADMX files (max 50MB)
                      </div>
                      <q-file
                        v-model="admxZipFile"
                        label="Select ZIP archive with ADMX files"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        outlined
                        dense
                        :clearable="!admxZipUploading"
                        :disable="admxZipUploading"
                        :error="!!fileError"
                        :error-message="fileError"
                        :hint="
                          admxZipFile ? formatFileSize(admxZipFile.size) : ''
                        "
                        class="q-mb-md"
                        @update:model-value="handleFileChange"
                      >
                        <template v-slot:prepend>
                          <q-icon name="archive" />
                        </template>
                      </q-file>
                      <q-linear-progress
                        v-if="admxZipUploading && uploadProgress > 0"
                        :value="uploadProgress / 100"
                        color="primary"
                        size="8px"
                        class="q-mb-md"
                      >
                        <div class="absolute-full flex flex-center">
                          <q-badge
                            color="white"
                            text-color="primary"
                            :label="`${uploadProgress}%`"
                          />
                        </div>
                      </q-linear-progress>
                      <div class="row q-gutter-sm">
                        <q-btn
                          color="primary"
                          icon="cloud_upload"
                          label="Import ADMX ZIP"
                          :loading="admxZipUploading"
                          :disable="!canUpload"
                          @click="handleImportAdmxZip"
                        />
                        <q-btn
                          v-if="admxZipUploading"
                          flat
                          color="negative"
                          icon="cancel"
                          label="Cancel"
                          @click="handleCancelUpload"
                        />
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card class="q-mb-md">
                    <q-card-section>
                      <div class="row items-center justify-between q-mb-md">
                        <div class="text-subtitle1">Loaded ADMX Files</div>
                        <q-btn
                          icon="refresh"
                          label="Refresh"
                          color="primary"
                          outline
                          dense
                          :loading="loadingAdmxFiles"
                          @click="loadAdmxFilesList"
                        />
                      </div>
                      <q-scroll-area
                        class="admx-files-table-scroll"
                        style="height: 400px"
                      >
                        <q-table
                          :rows="loadedAdmxFiles"
                          :columns="admxFilesColumns"
                          :loading="loadingAdmxFiles"
                          row-key="file_hash"
                          flat
                          :pagination="{ rowsPerPage: 0 }"
                          hide-pagination
                          no-data-label="No ADMX files loaded"
                        >
                          <template v-slot:body-cell-file_name="props">
                            <q-td :props="props">
                              <div class="text-weight-medium">
                                {{ props.value }}
                              </div>
                            </q-td>
                          </template>
                          <template v-slot:body-cell-file_hash="props">
                            <q-td :props="props">
                              <div
                                class="text-caption text-grey-7"
                                style="font-family: monospace"
                              >
                                {{ props.value }}
                              </div>
                            </q-td>
                          </template>
                          <template v-slot:body-cell-loaded_at_unix="props">
                            <q-td :props="props">
                              {{
                                formatAdmxFileDate(
                                  props.value as number | string,
                                )
                              }}
                            </q-td>
                          </template>
                        </q-table>
                      </q-scroll-area>
                    </q-card-section>
                  </q-card>

                  <q-separator class="q-my-md" />

                  <div class="row q-gutter-md q-mb-md">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="to Create"
                      @click="onCreatePolicy"
                      class="col-auto"
                    />
                    <q-btn
                      color="secondary"
                      icon="edit"
                      label="Edit"
                      @click="onEditSelectedPolicy"
                      :disable="!selectedPolicyForManagement"
                      class="col-auto"
                    />
                    <q-btn
                      color="accent"
                      icon="content_copy"
                      label="Clone"
                      @click="onClonePolicy"
                      :disable="!selectedPolicyForManagement"
                      class="col-auto"
                    />
                    <q-btn
                      color="negative"
                      icon="delete"
                      label="Delete"
                      @click="onDeleteSelectedPolicy"
                      :disable="!selectedPolicyForManagement"
                      class="col-auto"
                    />
                  </div>

                  <div class="q-mt-md">
                    <div class="text-subtitle2 q-mb-sm">
                      Select a policy to manage:
                    </div>
                    <q-scroll-area
                      class="policies-table-scroll"
                      style="height: 500px"
                    >
                      <q-table
                        :rows="filteredPolicies"
                        :columns="policyManagementColumns"
                        row-key="id"
                        :loading="policiesStore.isLoading.value"
                        flat
                        bordered
                        v-model:selected="selectedPoliciesForManagement"
                      >
                        <template v-slot:top>
                          <q-input
                            v-model="policyFilter"
                            placeholder="Policy search..."
                            dense
                            outlined
                            class="col-4"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </template>
                      </q-table>
                    </q-scroll-area>
                  </div>
                </div>
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <GPOPolicyForm
        v-model="showPolicyDialog"
        :policy="policyForForm"
        :is-loading="policiesStore.isLoading.value"
        @submit="onPolicyFormSubmit"
      />

      <GPOPolicySettingsDialog
        v-model="showApplyPolicyDialog"
        :agent="selectedAgent"
        @applied="onPolicySettingsApplied"
        @disabled="onPolicySettingsDisabled"
      />

      <AppliedPoliciesDialog
        v-model="showAppliedPoliciesDialog"
        :agent="selectedAgent"
        :assignments="appliedDialogAssignments"
        :effective-policies="appliedDialogEffective"
        :loading="showAppliedPoliciesLoading"
        @refresh="refreshAppliedPoliciesDialog"
      />

      <ApplyPolicyDialog
        v-model="showApplyPolicyDialogForUser"
        :agent="selectedAgent"
        :users="usersList"
        :initial-user-sid="initialUserSid"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/utils/format";
import { useGPOPolicies, useGPOPolicyTree } from "../api/gpo";
import {
  agentServiceClient,
  agentServiceClientWrapper,
  userServiceClient,
  createGrpcMetadata,
  operator_pb,
  policyAssignmentClient,
  policyCatalogClient,
  policyCatalogServiceClient,
  policyStateClient,
  admxServiceClientWrapper,
  AdmxUploadError,
} from "../api/grpc-client";
import { fetchAgents as fetchTacticalAgents } from "@/api/agents";
import GPOPolicyForm from "../components/GPOPolicyForm.vue";
import GPOPolicySettingsDialog from "../components/GPOPolicySettingsDialog.vue";
import AppliedPoliciesDialog from "../components/AppliedPoliciesDialog.vue";
import ApplyPolicyDialog from "../components/ApplyPolicyDialog.vue";
import GPOCollectionsTable from "../components/CollectionsPolicies/GPOCollectionsTable.vue";
import MultiTextBox from "@/components/ui/MultiTextBox.vue";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import {
  agentRebootNow,
  agentShutdown,
  sendAgentPing,
  removeAgent,
} from "@/api/agents";
import { useQuasar, QTableColumn } from "quasar";
import { notifySuccess, notifyError } from "@/utils/notify";
import DOMPurify from "dompurify";

interface Agent {
  id: string;
  hostname: string;
  last_seen: string;
  status: string;
  operating_system?: string;
  version?: string;
  ip_address?: string;
}

interface User {
  name: string;
  sid: string;
  type: string;
  lastLogon?: string;
  groups?: string;
}

interface AdmxFile {
  file: string;
  ui_name: string;
  description: string;
}

interface AdmxGroup {
  group: string;
  ui_name: string;
  description: string;
  admx_files: AdmxFile[];
}

const $q = useQuasar();
const route = useRoute();

const policiesStore = useGPOPolicies();
const treeStore = useGPOPolicyTree();

const mainTab = ref("dashboard");
const subTab = ref("status");
const contentTab = ref("overview");
const libraryTab = ref("policies");
const policiesSubTab = ref("all");
const networkTab = ref("agents");
const devicesTab = ref("assignment");
const windowsTab = ref<string>("");
const admxGroups = ref<AdmxGroup[]>([]);
const admxLoading = ref(false);
const selectedAdmxGroup = ref<string | null>(null);
const selectedAdmxFile = ref<string | null>(null);
const selectedAdmxFileGroup = ref<string | null>(null);

interface AdmxPolicy {
  id: string;
  name: string;
  display_name: string;
  explain_text: string;
}

const admxPolicies = ref<AdmxPolicy[]>([]);
const selectedAdmxPolicy = ref<AdmxPolicy | null>(null);
const loadingAdmxPolicies = ref(false);
const admxPoliciesError = ref<string | null>(null);
const admxPolicySettingsTab = ref("settings");
const loadingAdmxPolicyDetails = ref(false);

interface PolicyDetailsElement {
  id: number;
  element_id: string;
  type: string;
  display_name?: string;
  description?: string;
  presentation_type?: string;
  value_name?: string;
  registry_key?: string;
  required?: boolean;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  value_type?: string;
  items?: Array<{
    id: number;
    name: string;
    display_name?: string;
    value_type?: string;
  }>;
}

const admxPolicyDetailsElements = ref<PolicyDetailsElement[]>([]);
const admxPolicySettingsValues = ref<Record<string, unknown>>({});
const admxPolicyFullDescription = ref<string>("");
const admxZipFile = ref<File | null>(null);
const admxZipUploading = ref(false);
const uploadProgress = ref(0);
const uploadAbortController = ref<AbortController | null>(null);
const fileError = ref("");
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const canUpload = computed(() => {
  return admxZipFile.value && !fileError.value && !admxZipUploading.value;
});

interface LoadedAdmxFile {
  file_name: string;
  file_hash: string;
  loaded_at_unix: number | string;
}

const loadedAdmxFiles = ref<LoadedAdmxFile[]>([]);
const loadingAdmxFiles = ref(false);

const selectedAgent = ref<Agent | null>(null);
const usersLoading = ref(false);
const policyFilter = ref("");
const networkStatusFilter = ref<"all" | "online" | "offline">("all");
const selectedPolicyForManagement = ref<GPOPolicy | null>(null);
const selectedPoliciesForManagement = ref<GPOPolicy[]>([]);
const showPolicyDialog = ref(false);
const policyDialogMode = ref<"create" | "edit" | "clone">("create");
const policyToEdit = ref<GPOPolicy | null>(null);
const showApplyPolicyDialog = ref(false);
const showApplyPolicyDialogForUser = ref(false);
const initialUserSid = ref<string>("");
const showAppliedPoliciesDialog = ref(false);
const appliedDialogAssignments = ref<Array<Record<string, unknown>>>([]);
const appliedDialogEffective = ref<Array<Record<string, unknown>>>([]);
const showAppliedPoliciesLoading = ref(false);

const policyForForm = computed(() => {
  return policyToEdit.value || undefined;
});

const agentsLoading = ref(false);
const agentsError = ref(false);
const gpoAgents = ref<Agent[]>([]);

interface AssignedPolicy extends GPOPolicy {
  applied?: boolean;
  policyHash?: string;
  assignedDate?: string;
}
const assignedPolicies = ref<AssignedPolicy[]>([]);
const actionLoading = ref(false);

interface DeviceAction {
  title: string;
  date: string;
  icon: string;
  color: string;
  description: string;
}
interface DeviceAction {
  policyHash?: string;
  policyName?: string;
  actionType?: string;
  details?: string;
}

const deviceActionHistory = ref<DeviceAction[]>([]);

const agentsList = computed<Agent[]>(() => {
  return gpoAgents.value;
});

async function loadAdmxData() {
  admxLoading.value = true;
  try {
    const lang = "en";
    const fileName = `admx_full_grouped_${lang}.json`;
    const response = await fetch(`/${fileName}`);
    if (!response.ok) {
      const fallbackResponse = await fetch("/admx_full_grouped_en.json");
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load ADMX data: ${response.statusText}`);
      }
      const fallbackData = await fallbackResponse.json();
      admxGroups.value = fallbackData as AdmxGroup[];
    } else {
      const data = await response.json();
      admxGroups.value = data as AdmxGroup[];
    }

    if (admxGroups.value.length > 0 && !selectedAdmxGroup.value) {
      selectedAdmxGroup.value = admxGroups.value[0].group;
      if (
        !windowsTab.value ||
        windowsTab.value === "security" ||
        windowsTab.value === "system"
      ) {
        windowsTab.value = `admx-${admxGroups.value[0].group}`;
      }
    }
  } catch (error) {
    notifyError("Data loading error ADMX files");
  } finally {
    admxLoading.value = false;
  }
}

async function loadPoliciesByAdmx(admxFile: string) {
  loadingAdmxPolicies.value = true;
  admxPoliciesError.value = null;
  selectedAdmxPolicy.value = null;
  try {
    const langCode = "en-US";
    const response = await policyCatalogClient.getPoliciesByAdmx(
      admxFile,
      langCode,
    );

    const responseObj = response as {
      policiesList?: unknown[];
      policies?: unknown[];
    };
    const policiesList = responseObj.policiesList || responseObj.policies || [];

    admxPolicies.value = [];
    for (const policy of policiesList) {
      if (policy && typeof policy === "object") {
        const p = policy as {
          id?: number | string;
          name?: string;
          display_name?: string;
          displayName?: string;
          explain_text?: string;
          explainText?: string;
        };

        admxPolicies.value.push({
          id: String(p.id || ""),
          name: p.name || "",
          display_name: p.displayName || p.display_name || p.name || "",
          explain_text: p.explainText || p.explain_text || "",
        });
      }
    }
  } catch (error) {
    admxPoliciesError.value =
      error instanceof Error ? error.message : "Policy loading error";
    admxPolicies.value = [];
  } finally {
    loadingAdmxPolicies.value = false;
  }
}

function onAdmxFileClick(admxFile: string, groupName: string) {
  if (
    selectedAdmxFile.value !== admxFile ||
    selectedAdmxFileGroup.value !== groupName
  ) {
    selectedAdmxFile.value = admxFile;
    selectedAdmxFileGroup.value = groupName;
    selectedAdmxPolicy.value = null;
    admxPolicies.value = [];
    admxPolicyDetailsElements.value = [];
    admxPolicySettingsValues.value = {};
    admxPolicyFullDescription.value = "";
    loadPoliciesByAdmx(admxFile);
  }
}

async function onAdmxPolicySelect(policy: AdmxPolicy) {
  selectedAdmxPolicy.value = policy;
  admxPolicySettingsTab.value = "settings";
  await loadAdmxPolicyDetails(policy);
}

async function loadAdmxPolicyDetails(policy: AdmxPolicy) {
  if (!policy || !policy.id) {
    return;
  }

  loadingAdmxPolicyDetails.value = true;
  admxPolicyDetailsElements.value = [];
  admxPolicySettingsValues.value = {};
  admxPolicyFullDescription.value = "";

  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      throw new TypeError(`Invalid Policy ID: ${policy.id}`);
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("en-US");

    const response = await policyCatalogServiceClient.getPolicyDetails(
      request,
      metadata,
    );

    if (!response) {
      throw new Error("An empty response from the server");
    }

    admxPolicyFullDescription.value = policy.explain_text || "";

    const policyElementsList = response.getPolicyElementsList?.() || [];

    const extractWrapperValue = (
      value: unknown,
    ): string | number | boolean | undefined => {
      if (value === null || value === undefined) {
        return undefined;
      }
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return value;
      }
      if (typeof value === "object") {
        if (
          typeof (value as { getValue?: () => unknown }).getValue === "function"
        ) {
          const extracted = (value as { getValue: () => unknown }).getValue();
          return extracted as string | number | boolean | undefined;
        }
        if (
          "value" in value &&
          typeof (value as { value: unknown }).value !== "undefined"
        ) {
          return (value as { value: string | number | boolean }).value;
        }
      }
      return undefined;
    };

    const processedPolicyElements = policyElementsList
      .map((el: unknown) => {
        if (el && typeof el === "object") {
          const elem = el as {
            getId?: () => number;
            getElementId?: () => string;
            getType?: () => string;
            getValueName?: () => unknown;
            getRegistryKey?: () => unknown;
            getRequired?: () => unknown;
            getMaxLength?: () => unknown;
            getMinValue?: () => unknown;
            getMaxValue?: () => unknown;
            getItemsList?: () => unknown[];
          };

          const itemsList = elem.getItemsList?.() || [];
          const items = itemsList
            .map((item: unknown) => {
              if (item && typeof item === "object") {
                try {
                  const it = item as {
                    getId?: () => number;
                    getName?: () => string;
                    getParentType?: () => string;
                    getType?: () => string;
                    getValueType?: () => string;
                    getValueName?: () => string;
                    getRequired?: () => boolean;
                    getParentId?: () => number;
                    getDisplayName?: () => string;
                  };
                  return {
                    id: it.getId?.() || 0,
                    name: it.getName?.() || "",
                    display_name: (() => {
                      try {
                        const value = it.getDisplayName?.();
                        return extractWrapperValue(value) as string | undefined;
                      } catch {
                        return undefined;
                      }
                    })(),
                    value_type: it.getValueType?.() || "",
                  };
                } catch {
                  return null;
                }
              }
              return null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .filter((item, index, self) => {
              return (
                index ===
                self.findIndex((t) => t.display_name === item.display_name)
              );
            });

          return {
            id: elem.getId?.() || 0,
            element_id: elem.getElementId?.() || "",
            type: elem.getType?.() || "",
            value_name: (() => {
              try {
                const value = elem.getValueName?.();
                return extractWrapperValue(value) as string | undefined;
              } catch {
                return undefined;
              }
            })(),
            registry_key: (() => {
              try {
                const value = elem.getRegistryKey?.();
                return extractWrapperValue(value) as string | undefined;
              } catch {
                return undefined;
              }
            })(),
            required: (() => {
              try {
                const value = elem.getRequired?.();
                return extractWrapperValue(value) as boolean | undefined;
              } catch {
                return undefined;
              }
            })(),
            max_length: (() => {
              try {
                const value = elem.getMaxLength?.();
                return extractWrapperValue(value) as number | undefined;
              } catch {
                return undefined;
              }
            })(),
            min_value: (() => {
              try {
                const value = elem.getMinValue?.();
                return extractWrapperValue(value) as number | undefined;
              } catch {
                return undefined;
              }
            })(),
            max_value: (() => {
              try {
                const value = elem.getMaxValue?.();
                return extractWrapperValue(value) as number | undefined;
              } catch {
                return undefined;
              }
            })(),
            items: items,
          };
        }
        return null;
      })
      .filter((el): el is NonNullable<typeof el> => el !== null);

    const presentation = response.getPresentation?.();
    const presentationMap = new Map<string, { text?: string; type?: string }>();

    if (presentation) {
      const elementsList = presentation.getElementsList?.() || [];
      for (const presEl of elementsList) {
        if (presEl && typeof presEl === "object") {
          const p = presEl as {
            getRefId?: () => string;
            getText?: () => unknown;
            getType?: () => string;
          };
          const refId = p.getRefId?.() || "";
          if (refId) {
            const extractStringValue = (value: unknown): string | undefined => {
              if (value === null || value === undefined) {
                return undefined;
              }
              if (typeof value === "string") {
                return value;
              }
              if (typeof value === "object") {
                if (
                  "value" in value &&
                  typeof (value as { value: unknown }).value === "string"
                ) {
                  return (value as { value: string }).value;
                }
                if (
                  typeof (value as { getValue?: () => unknown }).getValue ===
                  "function"
                ) {
                  const extracted = (
                    value as { getValue: () => unknown }
                  ).getValue();
                  return typeof extracted === "string" ? extracted : undefined;
                }
              }
              return undefined;
            };
            presentationMap.set(refId, {
              text: extractStringValue(p.getText?.()),
              type: p.getType?.() || "",
            });
          }
        }
      }
    }

    admxPolicyDetailsElements.value = processedPolicyElements.map((el) => {
      const presentationEl = presentationMap.get(el.element_id);
      return {
        ...el,
        display_name: presentationEl?.text || el.element_id,
        presentation_type: presentationEl?.type || "",
        description: "",
      };
    });

    for (const element of admxPolicyDetailsElements.value) {
      if (!(element.element_id in admxPolicySettingsValues.value)) {
        if (
          (element.type === "list" ||
            element.type === "LIST" ||
            element.type === "List") &&
          (!element.items || element.items.length === 0)
        ) {
          admxPolicySettingsValues.value[element.element_id] = [];
        } else if (
          element.type === "CHECKBOX" ||
          element.type === "BOOL" ||
          element.type === "boolean"
        ) {
          admxPolicySettingsValues.value[element.element_id] = false;
        } else if (
          element.type === "TEXT" ||
          element.type === "STRING" ||
          element.type === "string"
        ) {
          admxPolicySettingsValues.value[element.element_id] = "";
        } else if (
          element.type === "NUMERIC" ||
          element.type === "INT" ||
          element.type === "int" ||
          element.type === "number"
        ) {
          admxPolicySettingsValues.value[element.element_id] =
            element.min_value || 0;
        }
      }
    }
  } catch (error) {
    notifyError("Error uploading policy details");
    console.error("Error loading policy details:", error);
  } finally {
    loadingAdmxPolicyDetails.value = false;
  }
}

async function applyAdmxPolicy() {
  if (!selectedAdmxPolicy.value) {
    return;
  }

  try {
    notifySuccess("Policy applied");
    // TODO: Реализовать применение политики через API
  } catch (error) {
    notifyError("Policy application error");
  }
}

async function disableAdmxPolicy() {
  if (!selectedAdmxPolicy.value) {
    return;
  }

  try {
    notifySuccess("Policy disabled");
    // TODO: Реализовать отключение политики через API
  } catch (error) {
    notifyError("Policy Deactivation error");
  }
}

function getAdmxGroupIcon(groupName: string): string {
  const iconMap: Record<string, string> = {
    Безопасность: "security",
    Аутентификация: "vpn_key",
    "Сеть и удалённый доступ": "router",
    Обновления: "system_update",
    Интерфейс: "desktop_windows",
    Приложения: "apps",
    Диагностика: "bug_report",
    Хранилище: "storage",
    Система: "computer",

    "Security and Threat Protection": "security",
    "Authentication and Identity": "vpn_key",
    "Networking and Remote Access": "router",
    "Windows Update and Servicing": "system_update",
    "User Interface and Shell": "desktop_windows",
    "Applications and Store": "apps",
    "Diagnostics and Telemetry": "bug_report",
    "Storage and File Systems": "storage",
    "System and Core Components": "computer",
  };

  return iconMap[groupName] || "policy";
}

async function loadAgents() {
  agentsLoading.value = true;
  agentsError.value = false;

  try {
    const tacticalAgents = await fetchTacticalAgents({ detail: false });

    const allowedAgentIds = Array.isArray(tacticalAgents)
      ? tacticalAgents.map((agent: { agent_id?: string }) => String(agent.agent_id))
      : [];

    const response = await agentServiceClientWrapper.listAgents(
      allowedAgentIds.length > 0 ? allowedAgentIds : undefined
    );

    let agents: Array<{
      agent_id?: string;
      agentId?: string;
      host_name?: string;
      hostName?: string;
      ip_address?: string;
      ipAddress?: string;
      is_online?: boolean;
      isOnline?: boolean;
      last_heartbeat_unix?: number | string;
      lastHeartbeatUnix?: number | string;
    }> = [];

    if (response && typeof response === "object") {
      agents = response.agentsList || [];
    }

    if (agents && agents.length > 0) {
      gpoAgents.value = agents.map((agent) => {
        const agentId = agent.agent_id || agent.agentId || "";
        const hostName = agent.host_name || agent.hostName || "Unknown";
        const ipAddress = agent.ip_address || agent.ipAddress || "";
        let isOnline = false;
        if (agent.is_online !== undefined) {
          isOnline = agent.is_online;
        } else if (agent.isOnline !== undefined) {
          isOnline = agent.isOnline;
        }
        let lastHeartbeatUnix: number | string | undefined;
        if (agent.last_heartbeat_unix !== undefined) {
          lastHeartbeatUnix = agent.last_heartbeat_unix;
        } else if (agent.lastHeartbeatUnix !== undefined) {
          lastHeartbeatUnix = agent.lastHeartbeatUnix;
        }

        return {
          id: agentId,
          hostname: hostName,
          last_seen: (() => {
            if (!lastHeartbeatUnix) return "";
            const timestamp =
              typeof lastHeartbeatUnix === "string"
                ? Number.parseInt(lastHeartbeatUnix, 10)
                : lastHeartbeatUnix;
            return new Date(timestamp * 1000).toISOString();
          })(),
          status: isOnline ? "online" : "offline",
          operating_system: undefined,
          version: undefined,
          ip_address: ipAddress || undefined,
        };
      });
    } else {
      gpoAgents.value = [];
    }

    if (selectedAgent.value?.id) {
      const agentId = selectedAgent.value.id;
      Promise.all([
        loadNetworkInfo(agentId),
        loadGroupsForAgent(agentId),
        loadUsersForAgent(agentId),
      ]).catch((error) => {
        console.error("Error refreshing agent data:", error);
      });
    }
  } catch (error) {
    agentsError.value = true;
    gpoAgents.value = [];
  } finally {
    agentsLoading.value = false;
  }
}

const usersList = ref<User[]>([]);

const groupsList = ref<
  Array<{
    name?: string;
    displayName?: string;
    distinguishedName?: string;
    samAccountName?: string;
    UserPrincipalName?: string;
    description?: string;
    structuralObjectClass?: string;
    sid?: string;
  }>
>([]);

const groupsLoading = ref(false);

const groupsColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "samAccountName",
    label: "SAM Account Name",
    align: "left",
    field: "samAccountName",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
    sortable: true,
  },
  {
    name: "sid",
    label: "SID",
    align: "left",
    field: "sid",
    sortable: true,
  },
];

const usersColumns: QTableColumn[] = [
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "sid",
    label: "SID",
    align: "left",
    field: "sid",
    sortable: true,
  },
  {
    name: "type",
    label: "Type",
    align: "center",
    field: "type",
    sortable: true,
  },
  {
    name: "lastLogon",
    label: "Last Logon",
    align: "left",
    field: "lastLogon",
    sortable: true,
  },
  {
    name: "groups",
    label: "Groups",
    align: "left",
    field: "groups",
  },
];

const agentTableColumns: QTableColumn[] = [
  {
    name: "hostname",
    required: true,
    label: "Device Name",
    align: "left",
    field: "hostname",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "last_seen",
    label: "Last answer",
    align: "left",
    field: "last_seen",
    format: (val: string) => formatDate(val),
    sortable: true,
  },
  {
    name: "operating_system",
    label: "ОС",
    align: "left",
    field: "operating_system",
    sortable: true,
  },
];

const recentEvents = ref<
  Array<{
    title: string;
    date: string;
    description: string;
    icon: string;
    color: string;
  }>
>([]);

const policyColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Display Name",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "path",
    label: "Path",
    align: "left",
    field: "path",
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

const policyManagementColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "DisplayName",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "path",
    label: "Path",
    align: "left",
    field: "path",
  },
  {
    name: "enabled",
    label: "Status",
    align: "center",
    field: "enabled",
    format: (val: boolean) => (val ? "Enabled" : "Disabled"),
  },
];

const filteredPolicies = computed(() => {
  if (!policyFilter.value) {
    return policiesStore.policies.value;
  }
  const filter = policyFilter.value.toLowerCase();
  return policiesStore.policies.value.filter(
    (policy) =>
      policy.name.toLowerCase().includes(filter) ||
      policy.displayName?.toLowerCase().includes(filter) ||
      policy.description?.toLowerCase().includes(filter),
  );
});

const filteredPoliciesByCategory = (
  category: "all" | "templates" | "archive",
) => {
  let policies = filteredPolicies.value;

  // фильтр по категориям пока по простому
  // TODO: добавить реальную логику определения шаблонов и архива
  if (category === "templates") {
    policies = policies.filter(
      (policy) =>
        policy.name.toLowerCase().includes("template") ||
        policy.path?.toLowerCase().includes("template") ||
        policy.displayName?.toLowerCase().includes("template"),
    );
  } else if (category === "archive") {
    policies = policies.filter(
      (policy) =>
        !policy.enabled ||
        policy.path?.toLowerCase().includes("archive") ||
        policy.path?.toLowerCase().includes("archive"),
    );
  }

  return policies;
};

const filteredNetworkAgents = computed(() => {
  if (networkStatusFilter.value === "all") {
    return agentsList.value;
  }
  return agentsList.value.filter(
    (agent) => agent.status === networkStatusFilter.value,
  );
});

const assignedPolicyColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Display Name",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "assignedDate",
    label: "Assigned Date",
    align: "left",
    field: "assignedDate",
    format: (val: string) => formatDate(val),
  },
  {
    name: "applied",
    label: "Applied",
    align: "center",
    field: (row: AssignedPolicy) => row.applied,
    format: (val: boolean) => (val ? "Yes" : "No"),
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

const admxFilesColumns: QTableColumn[] = [
  {
    name: "file_name",
    required: true,
    label: "File Name",
    align: "left",
    field: "file_name",
    sortable: true,
  },
  {
    name: "file_hash",
    label: "Hash",
    align: "left",
    field: "file_hash",
    sortable: true,
  },
  {
    name: "loaded_at_unix",
    label: "Loaded At",
    align: "left",
    field: "loaded_at_unix",
    sortable: true,
  },
];

const pingLoading = ref(false);
const networkInfo = ref<{
  local_ips?: string;
  public_ip?: string;
}>({});
const pingResult = ref<{
  status: string;
  message?: string;
} | null>(null);

interface AgentDetails {
  agentId?: string;
  hostName?: string;
  ipAddress?: string;
  isOnline?: boolean;
  lastHeartbeatUnix?: number | string;
  nodeInfo?: {
    systemInfo?: {
      hostName?: string;
      host_name?: string;
      osVersion?: string;
      os_version?: string;
      cpu?: string;
      ramGb?: number;
      ram_gb?: number;
      motherboard?: string;
      manufacturer?: string;
      model?: string;
      firmwareVersion?: string;
      firmware_version?: string;
      disks?: string[];
      disksList?: string[];
      gpu?: string[];
      gpuList?: string[];
      ipAddresses?: string[];
      ipAddressesList?: string[];
      ip_addresses?: string[];
      macAddresses?: string[];
      macAddressesList?: string[];
      mac_addresses?: string[];
    };
    lastBootTimeUnix?: number | string;
    last_boot_time_unix?: number | string;
    osBuild?: string;
    os_build?: string;
    isDomainJoined?: boolean;
    is_domain_joined?: boolean;
    antivirusStatus?: string;
    antivirus_status?: string;
    timeZone?: string;
    time_zone?: string;
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
    firmware_version?: string;
    isOnline?: boolean;
    is_online?: boolean;
  };
}

const agentDetails = ref<AgentDetails | null>(null);

async function loadUsersForAgent(agentId: string) {
  usersLoading.value = true;
  usersList.value = [];

  try {
    const metadata = createGrpcMetadata();

    if (!operator_pb.ListUsersForAgentRequest) {
      throw new Error(
        "ListUsersForAgentRequest class not found in operator_pb",
      );
    }

    const request = new operator_pb.ListUsersForAgentRequest();
    request.setAgentId(agentId);

    const response = await userServiceClient.listUsersForAgent(
      request,
      metadata,
    );

    type GroupInfo = {
      name?: string;
      displayName?: string;
      displayname?: string;
      distinguishedName?: string;
      distinguishedname?: string;
      samAccountName?: string;
      samaccountname?: string;
      UserPrincipalName?: string;
      userprincipalname?: string;
      description?: string;
      structuralObjectClass?: string;
      structuralobjectclass?: string;
      sid?: string;
    };

    let users: Array<{
      name?: string;
      userName?: string;
      sid?: string;
      account_type?: number;
      accountType?: number;
      is_enabled?: boolean;
      isEnabled?: boolean;
      last_logon_unix?: number | string;
      lastLogonUnix?: number | string;
      groups?: GroupInfo[] | string[];
      groupsList?: GroupInfo[] | string[];
    }> = [];

    if (response && typeof response === "object") {
      if (
        typeof (response as { getUsersList?: () => unknown[] }).getUsersList ===
        "function"
      ) {
        const usersList = (
          response as {
            getUsersList: () => Array<{
              getName?: () => string;
              getUserName?: () => string;
              getSid?: () => string;
              getAccountType?: () => number;
              getIsEnabled?: () => boolean;
              getLastLogonUnix?: () => number | string;
              getGroupsList?: () => GroupInfo[] | string[];
              toObject?: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => {
                name?: string;
                userName?: string;
                sid?: string;
                accountType?: number;
                isEnabled?: boolean;
                lastLogonUnix?: number | string;
                groups?: GroupInfo[] | string[];
                groupsList?: GroupInfo[] | string[];
              };
            }>;
          }
        ).getUsersList();

        users = usersList.map((user) => {
          if (user.toObject) {
            const userObj = user.toObject({
              longs: String,
              enums: String,
              bytes: String,
              defaults: true,
              arrays: true,
              objects: true,
              oneofs: true,
            });
            if (
              userObj.groups &&
              Array.isArray(userObj.groups) &&
              userObj.groups.length > 0
            )
              if (
                (userObj as { groupsList?: unknown[] }).groupsList &&
                Array.isArray(
                  (userObj as { groupsList: unknown[] }).groupsList,
                ) &&
                (userObj as { groupsList: unknown[] }).groupsList.length > 0
              ) {
              }
            return userObj;
          }

          let groups: GroupInfo[] | undefined;
          const groupsList = user.getGroupsList?.();
          if (groupsList && groupsList.length > 0) {
            groups = groupsList.map(
              (group: {
                toObject?: (options?: {
                  longs?: typeof String;
                  enums?: typeof String;
                  bytes?: typeof String;
                  defaults?: boolean;
                  arrays?: boolean;
                  objects?: boolean;
                  oneofs?: boolean;
                }) => GroupInfo;
                getName?: () => string;
                getDisplayName?: () => string;
                getSamAccountName?: () => string;
              }) => {
                if (group.toObject) {
                  return group.toObject({
                    longs: String,
                    enums: String,
                    bytes: String,
                    defaults: true,
                    arrays: true,
                    objects: true,
                    oneofs: true,
                  }) as GroupInfo;
                }

                return {
                  name: group.getName?.(),
                  displayName: group.getDisplayName?.(),
                  samAccountName: group.getSamAccountName?.(),
                } as GroupInfo;
              },
            );
          }

          const userData = {
            name: user.getName?.() || user.getUserName?.(),
            userName: user.getName?.() || user.getUserName?.(),
            sid: user.getSid?.(),
            accountType: user.getAccountType?.(),
            isEnabled: user.getIsEnabled?.(),
            lastLogonUnix: user.getLastLogonUnix?.(),
            groups,
          };

          return userData;
        });
      } else if (
        typeof (response as { toObject?: () => unknown }).toObject ===
        "function"
      ) {
        const obj = (
          response as {
            toObject: (options?: {
              longs?: typeof String;
              enums?: typeof String;
              bytes?: typeof String;
              defaults?: boolean;
              arrays?: boolean;
              objects?: boolean;
              oneofs?: boolean;
            }) => { users?: unknown[] };
          }
        ).toObject({
          longs: String,
          enums: String,
          bytes: String,
          defaults: true,
          arrays: true,
          objects: true,
          oneofs: true,
        });

        users = (obj.users || []) as Array<{
          name?: string;
          userName?: string;
          sid?: string;
          accountType?: number;
          account_type?: number;
          isEnabled?: boolean;
          is_enabled?: boolean;
          lastLogonUnix?: number | string;
          last_logon_unix?: number | string;
          groups?: GroupInfo[] | string[];
          groupsList?: GroupInfo[] | string[];
        }>;
      } else if ((response as { users?: unknown[] }).users) {
        const responseUsers = (
          response as {
            users?: Array<{
              name?: string;
              sid?: string;
              account_type?: number;
              is_enabled?: boolean;
              last_logon_unix?: number | string;
              groups?: GroupInfo[] | string[];
              groupsList?: GroupInfo[] | string[];
            }>;
          }
        ).users;
        if (responseUsers) {
          users = responseUsers.map((user) => {
            const mapped = {
              userName: user.name,
              sid: user.sid,
              accountType: user.account_type,
              isEnabled: user.is_enabled,
              lastLogonUnix: user.last_logon_unix,
              groups: user.groups,
            };

            return mapped;
          });
        }
      } else if (Array.isArray(response)) {
        users = response as Array<{
          name?: string;
          userName?: string;
          sid?: string;
          account_type?: number;
          accountType?: number;
          is_enabled?: boolean;
          isEnabled?: boolean;
          last_logon_unix?: number | string;
          lastLogonUnix?: number | string;
          groups?: GroupInfo[] | string[];
          groupsList?: GroupInfo[] | string[];
        }>;
      }
    }

    if (users && users.length > 0) {
      usersList.value = users.map((user) => {
        const userName = user.name || user.userName || "Unknown";
        let accountTypeNum = 0;
        if (user.account_type !== undefined) {
          accountTypeNum = user.account_type;
        } else if (user.accountType !== undefined) {
          accountTypeNum = user.accountType;
        }
        let lastLogonUnix: number | string | undefined;
        if (user.last_logon_unix !== undefined) {
          lastLogonUnix = user.last_logon_unix;
        } else if (user.lastLogonUnix !== undefined) {
          lastLogonUnix = user.lastLogonUnix;
        }

        let accountType = "Unknown";
        if (accountTypeNum === 1) {
          accountType = "Local";
        } else if (accountTypeNum === 2) {
          accountType = "System";
        }

        let groupsData: GroupInfo[] | string[] | undefined;

        if ((user as { groupsList?: unknown[] }).groupsList) {
          const groupsList = (user as { groupsList: unknown[] }).groupsList;

          if (Array.isArray(groupsList) && groupsList.length > 0) {
            groupsData = groupsList.map((group: unknown) => {
              const groupObj = group as {
                toObject?: (options?: {
                  longs?: typeof String;
                  enums?: typeof String;
                  bytes?: typeof String;
                  defaults?: boolean;
                  arrays?: boolean;
                  objects?: boolean;
                  oneofs?: boolean;
                }) => GroupInfo;
                name?: string;
                displayname?: string;
                samaccountname?: string;
              };
              if (groupObj && typeof groupObj === "object") {
                if (
                  groupObj.toObject &&
                  typeof groupObj.toObject === "function"
                ) {
                  return groupObj.toObject({
                    longs: String,
                    enums: String,
                    bytes: String,
                    defaults: true,
                    arrays: true,
                    objects: true,
                    oneofs: true,
                  }) as GroupInfo;
                }

                return groupObj as GroupInfo;
              }
              return groupObj as GroupInfo;
            });
          }
        } else if (user.groups && user.groups.length > 0) {
          groupsData = user.groups;
        }

        let groupsString: string | undefined;
        if (groupsData && groupsData.length > 0) {
          if (typeof groupsData[0] === "string") {
            groupsString = (groupsData as string[]).join(", ");
          } else {
            const groupNames = (groupsData as GroupInfo[])
              .map((group) => {
                const name =
                  group.name ||
                  (
                    group as {
                      name?: string;
                      displayname?: string;
                      samaccountname?: string;
                    }
                  ).displayname ||
                  group.displayName ||
                  (
                    group as {
                      name?: string;
                      displayname?: string;
                      samaccountname?: string;
                    }
                  ).samaccountname ||
                  group.samAccountName ||
                  "";

                return name;
              })
              .filter((name) => name !== "");
            groupsString = groupNames.join(", ");
          }
        } else {
        }

        let lastLogon: string | undefined;
        if (lastLogonUnix !== undefined && lastLogonUnix !== null) {
          let timestamp: number;
          if (typeof lastLogonUnix === "string") {
            timestamp = Number.parseInt(lastLogonUnix, 10);
          } else {
            timestamp = lastLogonUnix;
          }
          if (timestamp === 0 || Number.isNaN(timestamp)) {
            lastLogon = "Never";
          } else {
            lastLogon = formatDate(new Date(timestamp * 1000).toISOString());
          }
        }

        return {
          name: userName,
          sid: user.sid || "",
          type: accountType,
          lastLogon,
          groups: groupsString,
        };
      });
    } else {
    }
  } catch (error) {
    const errorMessage = (error as { message?: string })?.message || "";
    const is404 =
      (error as { response?: { status?: number } })?.response?.status === 404 ||
      errorMessage.includes("404");
    const isRpcError =
      errorMessage.includes("RpcError") ||
      errorMessage.includes("deserializing");

    if (is404) {
    } else if (isRpcError) {
    }
    usersList.value = [];
  } finally {
    usersLoading.value = false;
  }
}

async function loadGroupsForAgent(agentId: string) {
  groupsLoading.value = true;
  groupsList.value = [];

  try {
    const metadata = createGrpcMetadata();

    if (!operator_pb.ListUserGroupsForAgentRequest) {
      throw new Error(
        "ListUserGroupsForAgentRequest class not found in operator_pb",
      );
    }

    const request = new operator_pb.ListUserGroupsForAgentRequest();
    request.setAgentId(agentId);

    const response = await userServiceClient.listUserGroupsForAgent(
      request,
      metadata,
    );

    type GroupInfo = {
      name?: string;
      displayName?: string;
      displayname?: string;
      distinguishedName?: string;
      distinguishedname?: string;
      samAccountName?: string;
      samaccountname?: string;
      UserPrincipalName?: string;
      userprincipalname?: string;
      description?: string;
      structuralObjectClass?: string;
      structuralobjectclass?: string;
      sid?: string;
    };

    let groups: GroupInfo[] = [];

    if (response && typeof response === "object") {
      if (
        typeof (response as { getGroupsList?: () => unknown[] })
          .getGroupsList === "function"
      ) {
        const groupsList = (
          response as {
            getGroupsList: () => Array<{
              getName?: () => string;
              getDisplayName?: () => string;
              getDistinguishedName?: () => string;
              getSamAccountName?: () => string;
              getUserPrincipalName?: () => string;
              getDescription?: () => string;
              getStructuralObjectClass?: () => string;
              getSid?: () => string;
              toObject?: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => GroupInfo;
            }>;
          }
        ).getGroupsList();

        groups = groupsList.map((group) => {
          if (group.toObject) {
            const groupObj = group.toObject({
              longs: String,
              enums: String,
              bytes: String,
              defaults: true,
              arrays: true,
              objects: true,
              oneofs: true,
            }) as GroupInfo;
            return {
              name: groupObj.name || groupObj.displayname,
              displayName: groupObj.displayName || groupObj.displayname,
              distinguishedName:
                groupObj.distinguishedName || groupObj.distinguishedname,
              samAccountName:
                groupObj.samAccountName || groupObj.samaccountname,
              UserPrincipalName:
                groupObj.UserPrincipalName || groupObj.userprincipalname,
              description: groupObj.description,
              structuralObjectClass:
                groupObj.structuralObjectClass ||
                groupObj.structuralobjectclass,
              sid: groupObj.sid,
            };
          }

          return {
            name: group.getName?.(),
            displayName: group.getDisplayName?.(),
            distinguishedName: group.getDistinguishedName?.(),
            samAccountName: group.getSamAccountName?.(),
            UserPrincipalName: group.getUserPrincipalName?.(),
            description: group.getDescription?.(),
            structuralObjectClass: group.getStructuralObjectClass?.(),
            sid: group.getSid?.(),
          } as GroupInfo;
        });
      } else if (
        typeof (response as { toObject?: () => unknown }).toObject ===
        "function"
      ) {
        const responseObj = (
          response as {
            toObject: (options?: {
              longs?: typeof String;
              enums?: typeof String;
              bytes?: typeof String;
              defaults?: boolean;
              arrays?: boolean;
              objects?: boolean;
              oneofs?: boolean;
            }) => { groups?: GroupInfo[] };
          }
        ).toObject({
          longs: String,
          enums: String,
          bytes: String,
          defaults: true,
          arrays: true,
          objects: true,
          oneofs: true,
        });

        if (responseObj.groups && Array.isArray(responseObj.groups)) {
          groups = responseObj.groups.map((group) => ({
            name: group.name || group.displayname,
            displayName: group.displayName || group.displayname,
            distinguishedName:
              group.distinguishedName || group.distinguishedname,
            samAccountName: group.samAccountName || group.samaccountname,
            UserPrincipalName:
              group.UserPrincipalName || group.userprincipalname,
            description: group.description,
            structuralObjectClass:
              group.structuralObjectClass || group.structuralobjectclass,
            sid: group.sid,
          }));
        }
      }
    }

    groupsList.value = groups;
  } catch (error) {
    const errorMessage = (error as { message?: string })?.message || "";
    const is404 =
      (error as { response?: { status?: number } })?.response?.status === 404 ||
      errorMessage.includes("404");
    const isRpcError =
      errorMessage.includes("RpcError") ||
      errorMessage.includes("deserializing");

    if (is404) {
    } else if (isRpcError) {
    }
    groupsList.value = [];
  } finally {
    groupsLoading.value = false;
  }
}

const selectAgent = (agent: Agent) => {
  if (selectedAgent.value?.id === agent.id) {
    clearAgentSelection();
    return;
  }
  selectedAgent.value = agent;
  if (agent.id) {
    loadUsersForAgent(agent.id);
    loadGroupsForAgent(agent.id);
    loadNetworkInfo(agent.id);
  }
  pingResult.value = null;
};

const clearAgentSelection = () => {
  selectedAgent.value = null;
  usersList.value = [];
  groupsList.value = [];
  agentDetails.value = null;
  networkInfo.value = {};
  pingResult.value = null;
  assignedPolicies.value = [];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function loadAssignedPolicies(agentId: string) {
  try {
    assignedPolicies.value = [];

    const assignmentsResp = await policyStateClient.getAssignmentsFor("agent", {
      agentId,
    });

    const effectiveResp = await policyStateClient.getEffectivePoliciesFor(
      "agent",
      { agentId },
    );

    const assignmentsObj = assignmentsResp as unknown as Record<
      string,
      unknown
    >;
    const assignments = ((assignmentsObj["assignmentsList"] as unknown) ||
      (assignmentsObj["assignments"] as unknown) ||
      []) as Array<Record<string, unknown>>;

    const effectiveObj = effectiveResp as unknown as Record<string, unknown>;
    const effectivePolicies = ((effectiveObj["policiesList"] as unknown) ||
      (effectiveObj["policies"] as unknown) ||
      []) as Array<Record<string, unknown>>;

    const effectiveSet = new Set<string>(
      effectivePolicies.map((p: Record<string, unknown>) =>
        String(p["policyHash"] || p["policy_hash"] || ""),
      ),
    );

    for (const a of assignments as Array<Record<string, unknown>>) {
      const policyHash = String(a["policyHash"] || a["policy_hash"] || "");
      let name = policyHash;
      let displayName = policyHash;

      try {
        const pd = await policyCatalogClient.getPolicy(policyHash);
        const pdObj = pd as unknown as Record<string, unknown>;
        name = String(
          pdObj["name"] ||
            pdObj["policy_name"] ||
            pdObj["policy_hash"] ||
            policyHash,
        );
        displayName = String(
          pdObj["displayName"] ||
            pdObj["display_name"] ||
            pdObj["name"] ||
            name,
        );
      } catch (e) {
        // ignore
      }

      assignedPolicies.value.push({
        id: policyHash, // используем hash как id (удобно для удаления при отсутствии numeric id)
        name,
        displayName,
        path: "",
        enabled: true,
        description: "",
        assignedDate: new Date().toISOString(),
        applied: effectiveSet.has(policyHash),
        policyHash,
      } as AssignedPolicy);
    }
  } catch (error) {
    notifyError("Error loading assigned policies");
  }
}

async function removePolicyAssignment(policy: GPOPolicy) {
  if (!selectedAgent.value) {
    return;
  }

  $q.dialog({
    title: "Confirmation",
    message: `Delete a policy assignment"${policy.displayName || policy.name}" for the device ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      let policyHash: string | undefined;

      const parsedId = Number.parseInt(policy.id, 10);
      if (!Number.isNaN(parsedId)) {
        const policyDetails = await policyCatalogClient.getPolicyDetails(
          parsedId,
          "en-US",
        );
        policyHash = (policyDetails.policy?.hash as string) || undefined;
        if (!policyHash) {
          throw new Error(
            "Hash policy was not found. Couldn't get policy details.",
          );
        }
      } else if (
        "policyHash" in policy &&
        (policy as AssignedPolicy).policyHash
      ) {
        policyHash = (policy as AssignedPolicy).policyHash;
      } else {
        policyHash = policy.id;
      }

      if (!selectedAgent.value) {
        throw new Error("Agent is not selected");
      }

      if (!policyHash) {
        throw new Error("Policy hash is undefined");
      }

      await policyAssignmentClient.removePolicy(policyHash, "agent", {
        agentId: selectedAgent.value.id,
      });

      assignedPolicies.value = assignedPolicies.value.filter(
        (p) => p.id !== policy.id,
      );

      if (selectedAgent.value) {
        let policyNameForHistory =
          policy.displayName || policy.name || policyHash;
        try {
          const pd = await policyCatalogClient.getPolicy(policyHash);
          const pdObj = pd as unknown as Record<string, unknown>;
          policyNameForHistory = String(
            pdObj["displayName"] ||
              pdObj["display_name"] ||
              pdObj["name"] ||
              policyNameForHistory,
          );
        } catch (e) {
          // ignore
        }

        addActionToHistory({
          title: "Deleting an appointment",
          description: `Policy assignment removed "${policyNameForHistory}" for the device ${selectedAgent.value.hostname}`,
          icon: "delete",
          color: "negative",
          policyHash,
          policyName: policyNameForHistory,
          actionType: "remove",
        });
      }

      notifySuccess("Policy assignment removed");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown destination deletion error";
      notifyError(`Assignment deletion error: ${errorMessage}`);
    }
  });
}

async function reapplyPolicies() {
  if (!selectedAgent.value) {
    return;
  }

  actionLoading.value = true;
  try {
    // TODO: Реализовать повторное применение политик через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запроса

    addActionToHistory({
      title: "Re-applying policies",
      description: `Policies have been reapplied for the device ${selectedAgent.value.hostname}`,
      icon: "refresh",
      color: "primary",
    });

    notifySuccess("Policies have been applied repeatedly");
  } catch (error) {
    notifyError("Policy Reapplication error");
  } finally {
    actionLoading.value = false;
  }
}

async function rollbackPolicies() {
  if (!selectedAgent.value) {
    return;
  }

  $q.dialog({
    title: "Confirmation",
    message: `Roll back Device policies ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      // TODO: Реализовать откат политик через API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запрос

      if (selectedAgent.value) {
        addActionToHistory({
          title: "Rollback of policies",
          description: `Policies have been rolled out for the device ${selectedAgent.value.hostname}`,
          icon: "undo",
          color: "warning",
        });
      }

      notifySuccess("Policy have been pumped out");
    } catch (error) {
      notifyError("Policy Rollback error");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function synchronizePolicies() {
  if (!selectedAgent.value) {
    return;
  }

  actionLoading.value = true;
  try {
    // TODO: Реализовать синхронизацию политик через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запрос

    await loadAssignedPolicies(selectedAgent.value.id);

    addActionToHistory({
      title: "Policy synchronization",
      description: `Politics are synchronized for the device ${selectedAgent.value.hostname}`,
      icon: "sync",
      color: "secondary",
    });

    notifySuccess("Policies are synchronized");
  } catch (error) {
    notifyError("Policy synchronization error");
  } finally {
    actionLoading.value = false;
  }
}

function addActionToHistory(action: Omit<DeviceAction, "date">) {
  deviceActionHistory.value.unshift({
    ...action,
    date: formatDate(new Date().toISOString()),
  });

  if (deviceActionHistory.value.length > 50) {
    deviceActionHistory.value = deviceActionHistory.value.slice(0, 50);
  }
}

async function openPolicyDetails(policyHash: string) {
  if (!policyHash) {
    return;
  }

  try {
    const pd = await policyCatalogClient.getPolicy(policyHash);
    const pdObj = pd as unknown as Record<string, unknown>;
    const name = String(
      pdObj["displayName"] ||
        pdObj["display_name"] ||
        pdObj["name"] ||
        policyHash,
    );
    const description = String(
      pdObj["explain_text"] || pdObj["explainText"] || "",
    );

    $q.dialog({
      title: `Policy: ${name}`,
      message: `
        <div><strong>Hash:</strong> ${policyHash}</div>
        <div style="margin-top:8px;"><strong>Description:</strong> ${description}</div>
      `,
      html: true,
      ok: true,
    });
  } catch (error) {
    $q.dialog({
      title: "Policy details",
      message: `Could not load policy details for ${policyHash}`,
    });
  }
}

async function loadNetworkInfo(agentId: string) {
  try {
    if (selectedAgent.value && selectedAgent.value.id === agentId) {
      if (selectedAgent.value.ip_address) {
        networkInfo.value = {
          local_ips: selectedAgent.value.ip_address,
          public_ip: "N/A",
        };
        return;
      }
    }

    try {
      const metadata = createGrpcMetadata();

      if (!operator_pb.GetAgentRequest) {
        throw new Error("GetAgentRequest class not found in operator_pb");
      }

      const request = new operator_pb.GetAgentRequest();
      request.setAgentId(agentId);

      const response = await agentServiceClient.getAgent(request, metadata);

      let agentData: AgentDetails = {};

      if (response && typeof response === "object") {
        if (
          typeof (response as { toObject?: () => unknown }).toObject ===
          "function"
        ) {
          agentData = (
            response as {
              toObject: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => AgentDetails;
            }
          ).toObject({
            longs: String,
            enums: String,
            bytes: String,
            defaults: true,
            arrays: true,
            objects: true,
            oneofs: true,
          }) as AgentDetails;
        }
      }

      agentDetails.value = agentData;

      const nodeInfo = agentData.nodeInfo;
      const systemInfo = nodeInfo?.systemInfo;
      const ipAddresses =
        systemInfo?.ipAddressesList ||
        systemInfo?.ipAddresses ||
        systemInfo?.ip_addresses ||
        [];

      const localIps =
        ipAddresses
          .filter((ip) => {
            if (
              ip === "127.0.0.1" ||
              ip === "::1" ||
              ip.startsWith("fe80::") ||
              ip.startsWith("169.254.")
            ) {
              return false;
            }

            return /^\d+\.\d+\.\d+\.\d+$/.test(ip);
          })
          .join(", ") ||
        agentData.ipAddress ||
        "N/A";

      networkInfo.value = {
        local_ips: localIps,
        public_ip: "N/A",
      };
    } catch {
      agentDetails.value = null;
      networkInfo.value = {
        local_ips: "N/A",
        public_ip: "N/A",
      };
    }
  } catch {
    agentDetails.value = null;
    networkInfo.value = {
      local_ips: "N/A",
      public_ip: "N/A",
    };
  }
}

async function handleReboot() {
  if (!selectedAgent.value) return;

  $q.dialog({
    title: "Confirmation",
    message: `Reboot ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      await agentRebootNow(selectedAgent.value!.id);
      notifySuccess(`${selectedAgent.value!.hostname} will be rebooted`);
    } catch (error) {
      notifyError("Error when restarting the agent");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handleShutdown() {
  if (!selectedAgent.value) return;

  const clean = DOMPurify.sanitize(selectedAgent.value.hostname);
  $q.dialog({
    title: `Enter <code style="color:red">yes</code> o confirm the disable <span style="color:red">${clean}</span>.`,
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val.toLowerCase() === "yes",
    },
    cancel: true,
    ok: { label: "Disable", color: "negative" },
    persistent: true,
    html: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      await agentShutdown(selectedAgent.value!.id);
      notifySuccess(`${selectedAgent.value!.hostname} will be turned off`);
    } catch (error) {
      notifyError("Error when turning off the agent");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handleDelete() {
  if (!selectedAgent.value) return;

  const clean = DOMPurify.sanitize(selectedAgent.value.hostname);
  $q.dialog({
    title: `Enter <code style="color:red">yes</code> to confirm the deletion <span style="color:red">${clean}</span>.`,
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val.toLowerCase() === "yes",
    },
    cancel: true,
    ok: { label: "Delete", color: "negative" },
    persistent: true,
    html: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      const data = await removeAgent(selectedAgent.value!.id);
      notifySuccess(data);
      selectedAgent.value = null;
      await loadAgents();
    } catch (error) {
      notifyError("Error deleting the agent");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handlePing() {
  if (!selectedAgent.value) return;

  pingLoading.value = true;
  pingResult.value = null;
  try {
    const data = await sendAgentPing(selectedAgent.value.id);
    let message = "Unknown status";
    if (data.status === "online") {
      message = "Agent is available";
    } else if (data.status === "offline") {
      message = "Agent is unavailable";
    }
    pingResult.value = {
      status: data.status || "unknown",
      message,
    };
    if (data.status === "online") {
      notifySuccess("Ping successful: online agent");
    } else {
      notifyError("Ping unsuccessful: offline agent");
    }
  } catch (error) {
    pingResult.value = {
      status: "error",
      message: "Error during execution ping",
    };
    notifyError("Error during execution ping");
  } finally {
    pingLoading.value = false;
  }
}
function handleFileChange(file: File | null) {
  fileError.value = "";

  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".zip")) {
    fileError.value = "Please select a ZIP file";
    admxZipFile.value = null;
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    fileError.value = `File too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`;
    admxZipFile.value = null;
    return;
  }

  if (file.size === 0) {
    fileError.value = "File is empty";
    admxZipFile.value = null;
    return;
  }
}

async function handleImportAdmxZip() {
  if (!admxZipFile.value || !canUpload.value) return;
  uploadAbortController.value = new AbortController();
  admxZipUploading.value = true;
  uploadProgress.value = 0;

  try {
    const response = await admxServiceClientWrapper.importAdmxZip(
      admxZipFile.value,
      {
        signal: uploadAbortController.value.signal,
        maxFileSize: MAX_FILE_SIZE,
        onProgress: (progress) => {
          uploadProgress.value = Math.round(progress.percentage);
        },
      },
    );

    if (response.success) {
      notifySuccess(response.message || "ADMX files successfully imported");
      admxZipFile.value = null;
      uploadProgress.value = 0;
      fileError.value = "";
      await loadAdmxFilesList();
    } else {
      notifyError(response.message || "Failed to import ADMX files");
    }
  } catch (error) {
    handleUploadError(error);
  } finally {
    admxZipUploading.value = false;
    uploadAbortController.value = null;
  }
}

function handleCancelUpload() {
  if (uploadAbortController.value) {
    uploadAbortController.value.abort();
  }
}

function handleUploadError(error: unknown) {
  if (error instanceof AdmxUploadError) {
    switch (error.code) {
      case "CANCELLED":
        break;
      case "FILE_TOO_LARGE":
        notifyError(error.message);
        fileError.value = error.message;
        break;
      case "INVALID_FORMAT":
        notifyError(error.message);
        fileError.value = error.message;
        break;
      case "UPLOAD_FAILED":
        notifyError(error.message);
        console.error("ADMX upload failed:", error);
        break;
    }
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error during upload";
    notifyError(errorMessage);
    console.error("ADMX ZIP import error:", error);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

async function loadAdmxFilesList() {
  loadingAdmxFiles.value = true;
  try {
    const response = await admxServiceClientWrapper.listAdmxFiles();
    const filesList =
      response.filesList || (response as { files?: unknown[] }).files || [];
    loadedAdmxFiles.value = filesList.map((file: unknown) => {
      const f = file as {
        fileName?: string;
        file_name?: string;
        fileHash?: string;
        file_hash?: string;
        loadedAtUnix?: number | string;
        loaded_at_unix?: number | string;
      };
      return {
        file_name: f.fileName || f.file_name || "",
        file_hash: f.fileHash || f.file_hash || "",
        loaded_at_unix: f.loadedAtUnix || f.loaded_at_unix || 0,
      };
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading ADMX files list";
    notifyError(errorMessage);
    console.error("Error loading ADMX files list:", error);
    loadedAdmxFiles.value = [];
  } finally {
    loadingAdmxFiles.value = false;
  }
}

function formatAdmxFileDate(timestamp: number | string): string {
  if (!timestamp) return "-";
  const date = new Date(
    typeof timestamp === "string"
      ? Number.parseInt(timestamp, 10) * 1000
      : timestamp * 1000,
  );
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const onEditPolicy = (policy: unknown) => {
  policyToEdit.value = policy as GPOPolicy;
  policyDialogMode.value = "edit";
  showPolicyDialog.value = true;
};

const onDeletePolicy = (policy: unknown) => {
  const policyToDelete = policy as GPOPolicy;
  $q.dialog({
    title: "Delete a policy?",
    message: `Are you sure you want to delete the policy "${policyToDelete.displayName || policyToDelete.name}"?`,
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative" },
  }).onOk(async () => {
    try {
      await policiesStore.deletePolicy(policyToDelete.id);
      notifySuccess("Policy was successfully deleted");
      await policiesStore.fetchPolicies();
      await treeStore.fetchPolicyTree();
    } catch (error) {
      notifyError("Error deleting the policy");
    }
  });
};

const onCreatePolicy = () => {
  policyToEdit.value = null;
  policyDialogMode.value = "create";
  showPolicyDialog.value = true;
};

const onEditSelectedPolicy = () => {
  if (selectedPolicyForManagement.value) {
    onEditPolicy(selectedPolicyForManagement.value);
  }
};

const onClonePolicy = () => {
  if (selectedPolicyForManagement.value) {
    const policy = selectedPolicyForManagement.value;
    policyToEdit.value = {
      ...policy,
      name: `${policy.name}_copy`,
      displayName: `${policy.displayName || policy.name} (copy)`,
      id: "",
    } as GPOPolicy;
    policyDialogMode.value = "clone";
    showPolicyDialog.value = true;
  }
};

const onDeleteSelectedPolicy = () => {
  if (selectedPolicyForManagement.value) {
    onDeletePolicy(selectedPolicyForManagement.value);
  }
};

watch(selectedPoliciesForManagement, (newSelection) => {
  if (newSelection && newSelection.length > 0) {
    selectedPolicyForManagement.value = newSelection[0] as GPOPolicy;
  } else {
    selectedPolicyForManagement.value = null;
  }
});

watch(windowsTab, (newTab) => {
  if (newTab && newTab.startsWith("admx-")) {
    const groupName = newTab.replace("admx-", "");
    if (selectedAdmxFileGroup.value !== groupName) {
      selectedAdmxFile.value = null;
      selectedAdmxFileGroup.value = null;
      selectedAdmxPolicy.value = null;
      admxPolicies.value = [];
      admxPoliciesError.value = null;
    }
  }
});

const onPolicyFormSubmit = async (
  data: CreateGPOPolicyRequest | UpdateGPOPolicyRequest,
) => {
  try {
    if (policyDialogMode.value === "edit" && policyToEdit.value) {
      await policiesStore.updatePolicy(
        policyToEdit.value.id,
        data as UpdateGPOPolicyRequest,
      );
      notifySuccess("Policy has been successfully updated");
    } else if (policyDialogMode.value === "clone" && policyToEdit.value) {
      await policiesStore.createPolicy(data as CreateGPOPolicyRequest);
      notifySuccess("Policy has been successfully clone");
    } else {
      await policiesStore.createPolicy(data as CreateGPOPolicyRequest);
      notifySuccess("Policy was successfully created");
    }
    showPolicyDialog.value = false;
    policyToEdit.value = null;
    selectedPolicyForManagement.value = null;
    selectedPoliciesForManagement.value = [];
    await policiesStore.fetchPolicies();
    await treeStore.fetchPolicyTree();
  } catch (error) {
    notifyError("Error saving the policy");
  }
};

const getAgentStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "positive";
    case "offline":
      return "warning";
    case "overdue":
      return "negative";
    default:
      return "grey";
  }
};

const getAgentStatusLabel = (status: string) => {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    case "overdue":
      return "Overdue";
    default:
      return "Unknown";
  }
};

const getAgentStatusTooltip = (status: string) => {
  switch (status) {
    case "online":
      return "Device is active and sending heartbeat";
    case "offline":
      return "Device is unavailable";
    case "overdue":
      return "Device did not send heartbeat longer than the set time.";
    default:
      return "Status is unknown";
  }
};

watch(mainTab, (newTab) => {
  if (newTab === "library") {
    if (policiesStore.policies.value.length === 0) {
      policiesStore.fetchPolicies();
    }
    if (!treeStore.tree.value) {
      treeStore.fetchPolicyTree();
    }
  } else if (newTab === "windows") {
    if (
      admxGroups.value.length > 0 &&
      (!windowsTab.value || !windowsTab.value.startsWith("admx-"))
    ) {
      windowsTab.value = `admx-${admxGroups.value[0].group}`;
    }
  } else if (newTab === "management") {
    loadAdmxFilesList();
  }
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (
      newTab &&
      typeof newTab === "string" &&
      [
        "dashboard",
        "collections",
        "network",
        "library",
        "windows",
        "devices",
      ].includes(newTab)
    ) {
      mainTab.value = newTab;
    }
  },
);

const openApplyPolicyDialog = () => {
  showApplyPolicyDialog.value = true;
};

const openApplyPolicyDialogForUser = (user: { sid: string; name: string }) => {
  if (!selectedAgent.value) return;
  initialUserSid.value = user.sid;
  showApplyPolicyDialogForUser.value = true;
};

watch(showApplyPolicyDialogForUser, (newVal) => {
  if (!newVal) {
    initialUserSid.value = "";
  }
});

async function loadAppliedPoliciesDialogData(agentId: string): Promise<void> {
  const [assignmentsResp, effectiveResp] = await Promise.all([
    policyStateClient.getAssignmentsFor("agent", { agentId }),
    policyStateClient.getEffectivePoliciesFor("agent", { agentId }),
  ]);

  const assignmentsObj = assignmentsResp as unknown as Record<
    string,
    unknown
  >;
  const assignments = ((assignmentsObj["assignmentsList"] as unknown) ||
    (assignmentsObj["assignments"] as unknown) ||
    []) as Array<Record<string, unknown>>;

  const effectiveObj = effectiveResp as unknown as Record<string, unknown>;
  const effectivePolicies = ((effectiveObj["policiesList"] as unknown) ||
    (effectiveObj["policies"] as unknown) ||
    []) as Array<Record<string, unknown>>;

  appliedDialogAssignments.value = await Promise.all(
    assignments.map(async (a, index) => {
      const policyHash = String(a["policyHash"] || a["policy_hash"] || "");
      const summary = a["summary"] as Record<string, unknown> | undefined;
      let displayName =
        summary &&
        String(
          summary["displayName"] ||
            summary["display_name"] ||
            summary["name"] ||
            "",
        ).trim();
      if (!displayName) {
        try {
          const pdRes = (await policyCatalogClient.getPolicy(
            policyHash,
          )) as unknown as Record<string, unknown>;
          displayName =
            String(
              pdRes["displayName"] ||
                pdRes["display_name"] ||
                pdRes["name"] ||
                policyHash,
            ) || policyHash;
        } catch {
          // ignore
        }
      }
      if (!displayName) displayName = policyHash;
      const explainText =
        summary &&
        String(
          summary["explainText"] || summary["explain_text"] || "",
        ).trim();
      const scopeRaw = summary?.["scope"];
      const scope =
        scopeRaw !== undefined && scopeRaw !== null
          ? String(scopeRaw)
          : undefined;
      return {
        ...a,
        policyHash,
        id: `${policyHash}-${index}`,
        displayName,
        summary,
        explainText: explainText || undefined,
        description: explainText || undefined,
        scope: scope || undefined,
      };
    }),
  );

  appliedDialogEffective.value = effectivePolicies.map((p) => {
    const policyHash = String(p["policyHash"] || p["policy_hash"] || "");
    const summary = p["summary"] as Record<string, unknown> | undefined;
    const displayName = String(
      summary
        ? summary["displayName"] ||
            summary["display_name"] ||
            summary["name"] ||
            policyHash
        : p["displayName"] || p["display_name"] || p["name"] || policyHash,
    );
    const explainText = summary
      ? String(
          summary["explainText"] || summary["explain_text"] || "",
        ).trim()
      : String(p["explainText"] || p["explain_text"] || "").trim();
    return {
      ...p,
      policyHash,
      id: policyHash,
      displayName,
      summary,
      explainText: explainText || undefined,
      description: explainText || undefined,
    };
  });
}

const openAppliedPoliciesDialog = () => {
  if (!selectedAgent.value) return;
  showAppliedPoliciesLoading.value = true;
  appliedDialogAssignments.value = [];
  appliedDialogEffective.value = [];

  (async () => {
    try {
      await loadAppliedPoliciesDialogData(selectedAgent.value!.id);
      showAppliedPoliciesDialog.value = true;
    } catch (error) {
      notifyError("Error loading applied policies");
    } finally {
      showAppliedPoliciesLoading.value = false;
    }
  })();
};

async function refreshAppliedPoliciesDialog() {
  if (!selectedAgent.value) return;
  showAppliedPoliciesLoading.value = true;
  try {
    await loadAppliedPoliciesDialogData(selectedAgent.value.id);
  } catch (error) {
    notifyError("Error loading applied policies");
  } finally {
    showAppliedPoliciesLoading.value = false;
  }
}

function onPolicySettingsApplied(
  policyId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings: Record<string, unknown>,
) {
  if (selectedAgent.value) {
    loadAssignedPolicies(selectedAgent.value.id);

    (async () => {
      let policyName = String(policyId);
      try {
        const pd = await policyCatalogClient.getPolicy(String(policyId));
        const pdObj = pd as unknown as Record<string, unknown>;
        policyName = String(
          pdObj["displayName"] ||
            pdObj["display_name"] ||
            pdObj["name"] ||
            policyName,
        );
      } catch (e) {
        // ignore
      }

      addActionToHistory({
        title: "Policy application",
        description: `Policy ${policyName} applied`,
        icon: "policy",
        color: "positive",
        policyHash: String(policyId),
        policyName,
        actionType: "apply",
      });
    })();
  }
}

function onPolicySettingsDisabled(policyId: string) {
  if (selectedAgent.value) {
    loadAssignedPolicies(selectedAgent.value.id);

    (async () => {
      let policyName = String(policyId);
      try {
        const pd = await policyCatalogClient.getPolicy(String(policyId));
        const pdObj = pd as unknown as Record<string, unknown>;
        policyName = String(
          pdObj["displayName"] ||
            pdObj["display_name"] ||
            pdObj["name"] ||
            policyName,
        );
      } catch (e) {
        // ignore
      }

      addActionToHistory({
        title: "Disabling policy",
        description: `Policy ${policyName} disabled`,
        icon: "policy",
        color: "negative",
        policyHash: String(policyId),
        policyName,
        actionType: "disable",
      });
    })();
  }
}

onBeforeUnmount(() => {
  if (uploadAbortController.value) {
    uploadAbortController.value.abort();
  }
});

onMounted(async () => {
  await loadAgents();
  loadAdmxData();

  const tabFromQuery = route.query.tab as string | undefined;
  if (
    tabFromQuery &&
    [
      "dashboard",
      "collections",
      "network",
      "library",
      "windows",
      "devices",
    ].includes(tabFromQuery)
  ) {
    mainTab.value = tabFromQuery;
  }

  if (mainTab.value === "library") {
    policiesStore.fetchPolicies();
    treeStore.fetchPolicyTree();
  }
  const agentIdFromQuery = route.query.agent_id as string | undefined;
  if (agentIdFromQuery) {
    const agent = gpoAgents.value.find((a) => a.id === agentIdFromQuery);
    if (agent) {
      selectAgent(agent);
      mainTab.value = "dashboard";
    }
  }
});
</script>

<style scoped lang="sass">
.gpo-manager-page
  height: 100%
  min-height: 100%
  overflow: hidden
  display: flex
  flex-direction: column

.gpo-manager-page .gpo-main-row
  flex: 1
  min-height: 0
  display: flex
  align-items: stretch
  height: 100%

  transform: translateX(4px)

.gpo-devices-panel
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 251, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.2)
  display: flex
  flex-direction: column
  flex: 0 0 auto
  min-height: 0
  overflow: hidden

.gpo-devices-header
  background: rgba(255, 255, 255, 0.8)
  border-bottom: 2px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0
  padding: 12px 8px

.gpo-devices-scroll
  flex: 1
  height: 100%
  overflow-y: auto
  overflow-x: hidden

.gpo-main-content
  display: flex
  flex-direction: column
  flex: 1
  min-height: 0
  overflow: hidden

.gpo-agents-list-items
  padding: 4px 0

.gpo-agent-item
  border-radius: 6px
  margin: 2px 8px
  padding: 8px
  transition: all 0.2s ease
  cursor: pointer

.gpo-agent-item:hover
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.1) 0%, rgba(18, 177, 209, 0.15) 100%)
  transform: translateX(2px)

.gpo-agent-item.q-item--active
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.2) 0%, rgba(18, 177, 209, 0.25) 100%)
  border-left: 3px solid rgb(16, 137, 211)

.gpo-content
  display: flex
  flex-direction: column
  flex: 1
  min-height: 0
  overflow: hidden

.gpo-content > .gpo-content-row
  flex: 1
  min-height: 0
  display: flex
  align-items: stretch

.gpo-content-header
  background: white
  border-bottom: 1px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0

.gpo-content-header .q-tabs
  padding: 6px

.gpo-content-header .q-tabs__content
  padding: 0

.gpo-content-panels
  flex: 1
  overflow-y: auto
  min-height: 0
  display: flex
  flex-direction: column


.body--dark .gpo-content-header
  background: rgba(30, 30, 30, 0.98)
  border-bottom: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-panel
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 45, 55, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-header
  background: rgba(30, 30, 30, 0.8)
  border-bottom: 2px solid rgba(18, 177, 209, 0.3)

.gpo-library-content
  display: flex
  flex-direction: column
  width: 100%
  height: 100%

.gpo-library-content .gpo-content-header
  flex-shrink: 0

.gpo-library-content .gpo-content-panels
  flex: 1
  overflow-y: auto
  min-height: 0
  position: relative
  display: flex
  flex-direction: column

.gpo-library-panels
  flex: 1
  min-height: 400px
  overflow-y: auto
  position: relative

.gpo-policies-sub-panels
  min-height: 300px

.gpo-windows-sub-panels
  min-height: 300px

.admx-tab-panel
  height: 100%
  display: flex
  flex-direction: column
  overflow: hidden
  flex: 1
  min-height: 0

.admx-scroll-area
  flex: 1
  height: 100%
  min-height: 0
  width: 100%

.gpo-content-panels .q-tab-panel.admx-tab-panel
  height: 100%
  display: flex
  flex-direction: column
  min-height: 0
  overflow: hidden

.table-container
  max-height: 600px
  overflow-y: auto
  overflow-x: hidden

.policy-assignment-scroll-area
  height: 400px
  width: 100%

.policy-assignment-table
  width: 100%

.management-scroll-area
  width: 100%
  height: 100%

.admx-files-table-scroll
  width: 100%

.policies-table-scroll
  width: 100%
</style>
