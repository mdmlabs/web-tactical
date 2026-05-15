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
                ? 'gpo-main-content col-10'
                : 'gpo-main-content col-12'
            "
          >
            <div
              v-if="mainTab === 'dashboard' && selectedAgent"
              :key="`dashboard-agent-${contentTab}`"
              class="gpo-content-panels-wrap"
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
                      <q-tab name="alerts" icon="warning" label="Alerts" />
                      <q-tab name="vhd" icon="storage" label="VHD" />
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

              <q-tab-panels v-model="contentTab" class="gpo-content-tab-panels">
                <q-tab-panel name="overview" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">Overview</div>
                    <q-card>
                      <q-card-section>
                        <div class="system-info-wrap">
                          <div class="system-info-summary">
                            <div class="row q-col-gutter-md">
                              <div class="col-12 col-md-6">
                                <div class="system-info-kv">
                                  <div class="system-info-k">Hostname</div>
                                  <div class="system-info-v">
                                    {{ agentSystemHostname }}
                                  </div>
                                </div>
                                <div class="system-info-kv">
                                  <div class="system-info-k">Status</div>
                                  <div class="system-info-v">
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
                                </div>
                                <div class="system-info-kv">
                                  <div class="system-info-k">Last answer</div>
                                  <div class="system-info-v">
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
                                <div class="system-info-kv">
                                  <div class="system-info-k">
                                    Operating system
                                  </div>
                                  <div class="system-info-v">
                                    {{ agentOsVersion }}
                                  </div>
                                </div>
                              </div>

                              <div class="col-12 col-md-6">
                                <div class="system-info-kv">
                                  <div class="system-info-k">OS build</div>
                                  <div class="system-info-v">
                                    {{
                                      agentDetails?.nodeInfo?.osbuild || "N/A"
                                    }}
                                  </div>
                                </div>
                                <div class="system-info-kv">
                                  <div class="system-info-k">Model</div>
                                  <div class="system-info-v">
                                    {{ agentDetails?.nodeInfo?.model || "N/A" }}
                                  </div>
                                </div>
                                <div class="system-info-kv">
                                  <div class="system-info-k">
                                    Firmware version
                                  </div>
                                  <div class="system-info-v">
                                    {{
                                      agentDetails?.nodeInfo?.firmwareversion ||
                                      "N/A"
                                    }}
                                  </div>
                                </div>
                                <div class="system-info-kv">
                                  <div class="system-info-k">In the domain</div>
                                  <div class="system-info-v">
                                    {{
                                      agentDetails?.nodeInfo?.isdomainjoined
                                        ? "Yes"
                                        : "No"
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>

                      <q-separator />

                      <q-card-actions>
                        <q-btn
                          color="primary"
                          icon="policy"
                          label="Apply Policy"
                          @click="openApplyPolicyDialog"
                        />
                        <q-btn
                          color="secondary"
                          icon="visibility"
                          label="Applied policies"
                          @click="openAppliedPoliciesDialog"
                        />
                        <q-btn
                          color="negative"
                          outline
                          icon="restore"
                          label="Restore policies"
                          :loading="restorePoliciesLoading"
                          @click="confirmRestoreAllPoliciesForAgent"
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
                        <q-scroll-area class="system-info-scroll">
                          <div class="system-info-wrap">
                            <div class="system-info-summary q-mb-md">
                              <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-6">
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Hostname</div>
                                    <div class="system-info-v">
                                      {{ agentSystemHostname }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">
                                      Operating system
                                    </div>
                                    <div class="system-info-v">
                                      {{ agentOsVersion }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">OS build</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.osbuild || "N/A"
                                      }}
                                    </div>
                                  </div>
                                </div>
                                <div class="col-12 col-md-6">
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Online</div>
                                    <div class="system-info-v">
                                      <q-badge
                                        :color="
                                          agentDetails.isOnline
                                            ? 'positive'
                                            : 'negative'
                                        "
                                        :label="
                                          agentDetails.isOnline
                                            ? 'Online'
                                            : 'Offline'
                                        "
                                      />
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">
                                      In the domain
                                    </div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.isdomainjoined
                                          ? "Yes"
                                          : "No"
                                      }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Last boot</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo?.lastboottime
                                          ?.seconds
                                          ? formatDate(
                                              new Date(
                                                agentDetails.nodeInfo
                                                  .lastboottime.seconds * 1000,
                                              ).toISOString(),
                                            )
                                          : "N/A"
                                      }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <q-list
                              bordered
                              separator
                              dense
                              class="system-info-accordion"
                            >
                              <q-expansion-item
                                default-opened
                                expand-separator
                                dense
                                icon="memory"
                                label="Hardware"
                              >
                                <div class="q-pa-sm">
                                  <div class="system-info-kv">
                                    <div class="system-info-k">CPU</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.systeminfo?.cpu ||
                                        "N/A"
                                      }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">RAM</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.systeminfo?.ramgb
                                          ? `${agentDetails.nodeInfo.systeminfo.ramgb} GB`
                                          : "N/A"
                                      }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Motherboard</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.systeminfo
                                          ?.motherboard || "N/A"
                                      }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">
                                      Manufacturer
                                    </div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.manufacturer ||
                                        "N/A"
                                      }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Model</div>
                                    <div class="system-info-v">
                                      {{ agentDetails.nodeInfo.model || "N/A" }}
                                    </div>
                                  </div>
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Firmware</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.firmwareversion ||
                                        "N/A"
                                      }}
                                    </div>
                                  </div>
                                </div>
                              </q-expansion-item>

                              <q-expansion-item
                                expand-separator
                                dense
                                icon="lan"
                                label="Network"
                              >
                                <div class="q-pa-sm">
                                  <div class="system-info-kv">
                                    <div class="system-info-k">Time zone</div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.timezone || "N/A"
                                      }}
                                    </div>
                                  </div>

                                  <div
                                    v-if="agentSystemIpAddresses.length"
                                    class="q-mt-sm"
                                  >
                                    <div class="system-info-k q-mb-xs">
                                      IP addresses
                                    </div>
                                    <div class="row q-col-gutter-xs">
                                      <div
                                        v-for="(
                                          ip, index
                                        ) in agentSystemIpAddresses"
                                        :key="`ip-${index}`"
                                        class="col-auto"
                                      >
                                        <q-chip dense square color="grey-3">
                                          {{ ip }}
                                        </q-chip>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    v-if="agentSystemMacAddresses.length"
                                    class="q-mt-sm"
                                  >
                                    <div class="system-info-k q-mb-xs">
                                      MAC addresses
                                    </div>
                                    <div class="row q-col-gutter-xs">
                                      <div
                                        v-for="(
                                          mac, index
                                        ) in agentSystemMacAddresses"
                                        :key="`mac-${index}`"
                                        class="col-auto"
                                      >
                                        <q-chip dense square color="grey-3">
                                          {{ mac || "" }}
                                        </q-chip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </q-expansion-item>

                              <q-expansion-item
                                v-if="
                                  agentDetails.nodeInfo.systeminfo?.disksList
                                    ?.length
                                "
                                expand-separator
                                dense
                                icon="storage"
                                label="Storage"
                              >
                                <q-list dense padding>
                                  <q-item
                                    v-for="(disk, index) in agentDetails
                                      .nodeInfo?.systeminfo?.disksList || []"
                                    :key="`disk-${index}`"
                                    class="system-info-list-item"
                                  >
                                    <q-item-section>
                                      <q-item-label class="system-info-v">
                                        {{ disk }}
                                      </q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </q-list>
                              </q-expansion-item>

                              <q-expansion-item
                                v-if="
                                  agentDetails.nodeInfo.systeminfo?.gpuList
                                    ?.length
                                "
                                expand-separator
                                dense
                                icon="graphic_eq"
                                label="Graphics"
                              >
                                <q-list dense padding>
                                  <q-item
                                    v-for="(gpu, index) in agentDetails.nodeInfo
                                      ?.systeminfo?.gpuList || []"
                                    :key="`gpu-${index}`"
                                    class="system-info-list-item"
                                  >
                                    <q-item-section>
                                      <q-item-label class="system-info-v">
                                        {{ gpu }}
                                      </q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </q-list>
                              </q-expansion-item>

                              <q-expansion-item
                                expand-separator
                                dense
                                icon="shield"
                                label="Security & status"
                              >
                                <div class="q-pa-sm">
                                  <div class="system-info-kv">
                                    <div class="system-info-k">
                                      Antivirus status
                                    </div>
                                    <div class="system-info-v">
                                      {{
                                        agentDetails.nodeInfo.antivirusstatus ||
                                        "N/A"
                                      }}
                                    </div>
                                  </div>
                                </div>
                              </q-expansion-item>
                            </q-list>
                          </div>
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
                  <div v-if="selectedAgent" class="column full-height">
                    <div class="row q-mb-md items-center">
                      <div class="text-h6">Users</div>
                      <q-space />
                      <q-btn-dropdown
                        flat
                        dense
                        icon="groups"
                        color="primary"
                        title="Bulk account state on this agent"
                        class="q-mr-sm"
                        :loading="userControlLoading"
                        no-caps
                      >
                        <q-list dense>
                          <q-item
                            clickable
                            v-close-popup
                            @click="confirmEnableAllUsersForAgent(true)"
                          >
                            <q-item-section>Enable all users</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="confirmEnableAllUsersForAgent(false)"
                          >
                            <q-item-section class="text-negative">
                              Disable all users
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <q-btn
                        flat
                        dense
                        color="primary"
                        icon="link"
                        label="Add User"
                        class="q-mr-sm"
                        @click="openAddUserDialog"
                      />
                      <q-btn
                        flat
                        dense
                        color="primary"
                        icon="person_add"
                        label="Create User"
                        @click="openCreateUserDialog"
                      />
                    </div>
                    <q-scroll-area class="agent-tab-table-scroll">
                      <q-table
                        :rows="usersList"
                        :columns="usersColumns"
                        row-key="sid"
                        :pagination="{ rowsPerPage: 20 }"
                        :loading="usersLoading"
                        flat
                        bordered
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-menu context-menu>
                              <q-list dense style="min-width: 220px">
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="openEditUserDialog(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="edit" size="xs" />
                                  </q-item-section>
                                  <q-item-section>Edit</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="openSetPasswordDialog(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="lock" size="xs" />
                                  </q-item-section>
                                  <q-item-section>Set Password</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="toggleUserEnabled(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="toggle_on" size="xs" />
                                  </q-item-section>
                                  <q-item-section>{{
                                    props.row.isEnabled !== false
                                      ? "Disable"
                                      : "Enable"
                                  }}</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    props.row.isLocked
                                      ? unlockUserConfirm(props.row)
                                      : $q.notify({
                                          message: 'User is not locked',
                                          type: 'info',
                                        })
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon
                                      :name="
                                        props.row.isLocked
                                          ? 'lock_open'
                                          : 'lock'
                                      "
                                      size="xs"
                                    />
                                  </q-item-section>
                                  <q-item-section>{{
                                    props.row.isLocked ? "Unlock" : "lock"
                                  }}</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="expirePasswordConfirm(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="schedule" size="xs" />
                                  </q-item-section>
                                  <q-item-section
                                    >Expire Password</q-item-section
                                  >
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    openSetAccountExpirationDialog(props.row)
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon name="event" size="xs" />
                                  </q-item-section>
                                  <q-item-section
                                    >Set Account Expiration</q-item-section
                                  >
                                </q-item>
                                <q-separator />
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="openAddUserToGroupDialog(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="group_add" size="xs" />
                                  </q-item-section>
                                  <q-item-section>Add to Group</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    openRemoveUserFromGroupDialog(props.row)
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon name="group_remove" size="xs" />
                                  </q-item-section>
                                  <q-item-section
                                    >Remove from Group</q-item-section
                                  >
                                </q-item>
                                <q-separator />
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    openApplyPolicyDialogForUser(props.row)
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon name="policy" size="xs" />
                                  </q-item-section>
                                  <q-item-section>Assign policy</q-item-section>
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="openWslDialog(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon name="terminal" size="xs" />
                                  </q-item-section>
                                  <q-item-section>WSL</q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="deleteUserConfirm(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon
                                      name="delete"
                                      size="xs"
                                      color="negative"
                                    />
                                  </q-item-section>
                                  <q-item-section class="text-negative"
                                    >Delete</q-item-section
                                  >
                                </q-item>
                                <q-item clickable v-close-popup>
                                  <q-item-section>Close</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                            <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >
                              <template v-if="col.name === 'actions'">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="policy"
                                  color="primary"
                                  @click.stop="
                                    openApplyPolicyDialogForUser(props.row)
                                  "
                                >
                                  <q-tooltip>Assign a policy</q-tooltip>
                                </q-btn>
                              </template>
                              <template v-else-if="col.name === 'type'">
                                <q-badge
                                  :color="
                                    props.row.type === 'Local'
                                      ? 'primary'
                                      : 'secondary'
                                  "
                                  :label="props.row.type"
                                />
                              </template>
                              <template v-else-if="col.name === 'description'">
                                <q-tooltip v-if="col.value">
                                  {{ col.value }}
                                </q-tooltip>
                                <span>
                                  {{
                                    typeof col.value === "string" &&
                                    col.value.length > 40
                                      ? col.value.slice(0, 40) + "..."
                                      : (col.value ?? "")
                                  }}
                                </span>
                              </template>
                              <template v-else>
                                {{ col.value }}
                              </template>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-scroll-area>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="groups" class="q-pa-md">
                  <div v-if="selectedAgent" class="column full-height">
                    <div class="row q-mb-md items-center">
                      <div class="text-h6">Groups</div>
                      <q-space />
                      <q-btn
                        flat
                        dense
                        color="primary"
                        icon="group_add"
                        label="Create Group"
                        @click="openCreateGroupDialog"
                      />
                    </div>
                    <q-scroll-area class="agent-tab-table-scroll">
                      <q-table
                        :rows="groupsList"
                        :columns="groupsColumns"
                        row-key="sid"
                        :pagination="{ rowsPerPage: 20 }"
                        :loading="groupsLoading"
                        flat
                        bordered
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-menu context-menu>
                              <q-list dense style="min-width: 220px">
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    openAddUserToGroupFromGroupRow(props.row)
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon name="person_add" size="xs" />
                                  </q-item-section>
                                  <q-item-section
                                    >Add User to Group</q-item-section
                                  >
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="
                                    openRemoveUserFromGroupFromGroupRow(
                                      props.row,
                                    )
                                  "
                                >
                                  <q-item-section side>
                                    <q-icon name="person_remove" size="xs" />
                                  </q-item-section>
                                  <q-item-section
                                    >Remove User from Group</q-item-section
                                  >
                                </q-item>
                                <q-separator />
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="deleteGroupConfirm(props.row)"
                                >
                                  <q-item-section side>
                                    <q-icon
                                      name="delete"
                                      size="xs"
                                      color="negative"
                                    />
                                  </q-item-section>
                                  <q-item-section class="text-negative"
                                    >Delete Group</q-item-section
                                  >
                                </q-item>
                                <q-item clickable v-close-popup>
                                  <q-item-section>Close</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                            <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >
                              <template v-if="col.name === 'description'">
                                <q-tooltip v-if="col.value">
                                  {{ col.value }}
                                </q-tooltip>
                                <span>
                                  {{
                                    typeof col.value === "string" &&
                                    col.value.length > 40
                                      ? col.value.slice(0, 40) + "..."
                                      : (col.value ?? "")
                                  }}
                                </span>
                              </template>
                              <template v-else>
                                {{ col.value }}
                              </template>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-scroll-area>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="alerts" class="q-pa-md">
                  <AgentAlertsTab
                    :agent-id="selectedAgent?.id ?? null"
                    :active="contentTab === 'alerts'"
                  />
                </q-tab-panel>

                <q-tab-panel name="vhd" class="q-pa-md">
                  <GpoVhdAgentTab
                    :agent="selectedAgent"
                    :active="contentTab === 'vhd'"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'dashboard'"
              :key="`dashboard-${subTab}`"
              class="gpo-content-panels-wrap"
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
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="subTab" class="gpo-content-tab-panels">
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
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'collections'"
              key="collections"
              class="gpo-content-panels gpo-content-panels--collections"
            >
              <GPOCollectionsTable />
            </div>

            <div
              v-else-if="mainTab === 'users'"
              key="users"
              class="gpo-content-panels gpo-standalone-page-wrap"
            >
              <UsersManagerModal standalone-page />
            </div>
            <div
              v-else-if="mainTab === 'groups'"
              key="groups"
              class="gpo-content-panels gpo-standalone-page-wrap"
            >
              <GroupsManagerModal standalone-page />
            </div>
            <div
              v-else-if="mainTab === 'groupsMachines'"
              key="groupsMachines"
              class="gpo-content-panels gpo-standalone-page-wrap"
            >
              <GroupsMachinesModal standalone-page />
            </div>
          </div>

          <div
            v-if="mainTab === 'dashboard'"
            :key="`devices-${mainTab}`"
            class="gpo-devices-panel col-2"
          >
            <div class="gpo-devices-header">
              <div class="gpo-devices-header-top">
                <div class="row items-center justify-between">
                  <div class="text-subtitle2 text-weight-medium">
                    Devices
                    <q-badge
                      v-if="agentsList.length > 0"
                      color="primary"
                      :label="
                        agentSearchTrimmed
                          ? `${filteredAgentsList.length}/${agentsList.length}`
                          : agentsList.length
                      "
                      rounded
                      class="q-ml-sm"
                    />
                  </div>
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn
                      round
                      dense
                      flat
                      icon="filter_alt"
                      size="sm"
                      :color="hasActiveAgentFilters ? 'primary' : undefined"
                      @click="openAgentFilterDialog"
                    >
                      <q-badge
                        v-if="activeAgentFiltersCount > 0"
                        color="primary"
                        floating
                        transparent
                      >
                        {{ activeAgentFiltersCount }}
                      </q-badge>
                      <q-tooltip>Filter devices</q-tooltip>
                    </q-btn>
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
              </div>
              <div
                v-if="hasActiveAgentFilters"
                class="q-mt-xs row items-center q-gutter-xs"
              >
                <q-chip
                  v-if="agentListFilters.manufacturer"
                  dense
                  removable
                  color="primary"
                  text-color="white"
                  @remove="clearAgentFilterField('manufacturer')"
                >
                  {{ agentListFilters.manufacturer }}
                </q-chip>
                <q-chip
                  v-if="agentListFilters.model"
                  dense
                  removable
                  color="primary"
                  text-color="white"
                  @remove="clearAgentFilterField('model')"
                >
                  {{ agentListFilters.model }}
                </q-chip>
                <q-chip
                  v-if="agentListFilters.minimalOsVersion"
                  dense
                  removable
                  color="primary"
                  text-color="white"
                  @remove="clearAgentFilterField('minimalOsVersion')"
                >
                  {{ agentListFiltersOsLabel }}
                </q-chip>
              </div>
              <div class="q-mt-sm">
                <q-input
                  v-model="agentSearch"
                  dense
                  outlined
                  :debounce="300"
                  clearable
                  placeholder="Search devices..."
                  class="gpo-devices-search"
                  :disable="agentsLoading"
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="gpo-devices-scroll">
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

              <q-virtual-scroll
                v-else-if="!agentsLoading && filteredAgentsList.length > 0"
                class="gpo-agents-list-items"
                :items="filteredAgentsList"
                :virtual-scroll-item-size="56"
                :virtual-scroll-slice-size="10"
              >
                <template #default="{ item: agent }">
                  <q-item
                    :key="agent.id"
                    clickable
                    v-ripple
                    dense
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
                </template>
              </q-virtual-scroll>

              <div
                v-else-if="!agentsLoading && agentsList.length > 0"
                class="text-center q-pa-md text-grey-6"
              >
                <q-icon name="search_off" size="2em" />
                <div class="q-mt-sm text-caption">No matches</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="mainTab === 'library'"
        :key="`library-${libraryNav}`"
        class="gpo-content col-12 gpo-library-content"
      >
        <div class="gpo-content-header">
          <div class="text-h6 q-pa-md">Policy Library</div>
        </div>
        <div class="gpo-content-panels q-pa-md">
          <q-tabs
            v-model="libraryNav"
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
            <q-tab name="management" icon="settings" label="Management" />
          </q-tabs>

          <q-tab-panels v-model="libraryNav" class="gpo-library-panels">
            <q-tab-panel name="all" class="q-pa-none">
              <div class="row q-mb-md items-center">
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
                <q-space />
                <q-btn
                  flat
                  dense
                  color="secondary"
                  icon="download"
                  label=""
                  :disable="!filteredPoliciesByCategory('all').length"
                >
                  <q-menu>
                    <q-list dense style="min-width: 120px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="exportPolicies('all', 'csv')"
                      >
                        <q-item-section avatar>
                          <q-icon name="table_chart" color="primary" />
                        </q-item-section>
                        <q-item-section>CSV</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="exportPolicies('all', 'xlsx')"
                      >
                        <q-item-section avatar>
                          <q-icon name="description" color="green" />
                        </q-item-section>
                        <q-item-section>XLSX</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
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
                <div class="q-mt-md text-negative">Policy loading error</div>
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
                  :pagination="{ rowsPerPage: 20 }"
                  :loading="policiesStore.isLoading.value"
                  flat
                  bordered
                >
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-tooltip v-if="props.row.description">
                        {{ props.row.description }}
                      </q-tooltip>
                      <span>
                        {{
                          props.row.description &&
                          props.row.description.length > 40
                            ? props.row.description.slice(0, 40) + "..."
                            : props.row.description || ""
                        }}
                      </span>
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
              <div class="row q-mb-md items-center">
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
                <q-space />
                <q-btn
                  flat
                  dense
                  color="secondary"
                  icon="download"
                  label=""
                  :disable="!filteredPoliciesByCategory('templates').length"
                >
                  <q-menu>
                    <q-list dense style="min-width: 120px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="exportPolicies('templates', 'csv')"
                      >
                        <q-item-section avatar>
                          <q-icon name="table_chart" color="primary" />
                        </q-item-section>
                        <q-item-section>CSV</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="exportPolicies('templates', 'xlsx')"
                      >
                        <q-item-section avatar>
                          <q-icon name="description" color="green" />
                        </q-item-section>
                        <q-item-section>XLSX</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
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
                <div class="q-mt-md text-negative">Template loading error</div>
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
                  :pagination="{ rowsPerPage: 20 }"
                  :loading="policiesStore.isLoading.value"
                  flat
                  bordered
                >
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-tooltip v-if="props.row.description">
                        {{ props.row.description }}
                      </q-tooltip>
                      <span>
                        {{
                          props.row.description &&
                          props.row.description.length > 40
                            ? props.row.description.slice(0, 40) + "..."
                            : props.row.description || ""
                        }}
                      </span>
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

            <q-tab-panel name="management" class="q-pa-none">
              <AdmxManagementTab />
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
      />

      <AppliedPoliciesDialog
        v-model="showAppliedPoliciesDialog"
        :agent="selectedAgent"
        :assignments="appliedDialogAssignments"
        :effective-policies="appliedDialogEffective"
        :users="usersList"
        :loading="showAppliedPoliciesLoading"
        @refresh="refreshAppliedPoliciesDialog"
      />

      <q-dialog v-model="showAddUserDialog" persistent>
        <q-card style="min-width: 420px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Add User</div>
            <div v-if="selectedAgent" class="text-caption text-grey-7 q-mt-xs">
              Link existing user to device: {{ selectedAgent.hostname }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none q-gutter-sm">
            <q-select
              v-model="addUserForm.userId"
              :options="addUserOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="User *"
              dense
              outlined
              use-input
              input-debounce="200"
              :loading="addUserLoading && addUserOptions.length === 0"
              :disable="addUserLoading"
              clearable
              class="q-mb-sm"
            />
            <q-input
              v-model="addUserForm.password"
              type="password"
              label="Password (optional)"
              outlined
              dense
              class="q-mb-sm"
            />
            <q-checkbox
              v-model="addUserForm.passwordNotRequired"
              label="Password not required"
            />
            <q-checkbox
              v-model="addUserForm.userCannotChangePassword"
              label="User cannot change password"
            />
            <q-checkbox
              v-model="addUserForm.smartcardLogonRequired"
              label="Smartcard logon required"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              unelevated
              color="primary"
              label="Add"
              :loading="addUserLoading"
              :disable="!addUserForm.userId?.trim()"
              @click="addUserSubmit"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showCreateUserDialog" persistent>
        <q-card style="min-width: 480px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Create User</div>
          </q-card-section>
          <q-card-section
            class="q-pt-none q-gutter-sm"
            style="max-height: 70vh; overflow-y: auto"
          >
            <div class="text-subtitle2 text-grey-7">Required</div>
            <q-input
              v-model="createUserForm.samAccountName"
              label="Account Name *"
              dense
              outlined
              class="q-mb-sm"
              :rules="[(v) => !!v?.trim() || 'Required']"
            />
            <q-input
              v-model="createUserForm.password"
              label="Password *"
              type="password"
              dense
              outlined
              class="q-mb-sm"
              :rules="[(v) => !!v?.trim() || 'Required']"
            />
            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-grey-7">
              Display and description
            </div>
            <q-input
              v-model="createUserForm.displayName"
              label="Display Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.description"
              label="Description"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-grey-7">Account options</div>
            <q-checkbox v-model="createUserForm.enabled" label="Enabled" />
            <q-checkbox
              v-model="createUserForm.passwordNotRequired"
              label="Password not required"
            />
            <q-checkbox
              v-model="createUserForm.userCannotChangePassword"
              label="User cannot change password"
            />
            <q-checkbox
              v-model="createUserForm.smartcardLogonRequired"
              label="Smartcard logon required"
            />
            <q-input
              v-model="createUserForm.accountExpirationDate"
              label="Account expiration date (ISO 8601)"
              dense
              outlined
              class="q-mb-sm"
              placeholder="YYYY-MM-DD or empty"
            />
            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-grey-7">
              Supported local attributes
            </div>
            <q-input
              v-model="createUserForm.name"
              label="Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.middleName"
              label="Middle Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.surname"
              label="Surname"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.email"
              label="Email"
              dense
              outlined
              type="email"
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.homeDirectory"
              label="Home Directory"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.scriptPath"
              label="Script Path"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.telephoneNumber"
              label="Telephone Number"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createUserForm.employeeId"
              label="Employee ID"
              dense
              outlined
              class="q-mb-sm"
            />
            <OsVersionSelect
              v-model="createUserForm.minimalOsVersion"
              label="Minimal OS version"
              class="q-mt-sm"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Create"
              color="primary"
              :loading="userControlLoading"
              @click="createUser"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showEditUserDialog" persistent>
        <q-card style="min-width: 480px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Edit User</div>
            <div v-if="editUserRow" class="text-caption text-grey-7 q-mt-xs">
              {{ editUserRow.samAccountName }}
            </div>
          </q-card-section>
          <q-card-section
            class="q-pt-none q-gutter-sm"
            style="max-height: 70vh; overflow-y: auto"
          >
            <div class="text-subtitle2 text-grey-7">
              Display and description
            </div>
            <q-input
              v-model="editUserForm.displayName"
              label="Display Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.description"
              label="Description"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-grey-7">Account options</div>
            <q-checkbox v-model="editUserForm.enabled" label="Enabled" />
            <q-checkbox
              v-model="editUserForm.passwordNotRequired"
              label="Password not required"
            />
            <q-checkbox
              v-model="editUserForm.userCannotChangePassword"
              label="User cannot change password"
            />
            <q-checkbox
              v-model="editUserForm.smartcardLogonRequired"
              label="Smartcard logon required"
            />
            <q-input
              v-model="editUserForm.accountExpirationDate"
              label="Account expiration date (ISO 8601)"
              dense
              outlined
              class="q-mb-sm"
              placeholder="YYYY-MM-DD or empty"
            />
            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-grey-7">
              Supported local attributes
            </div>
            <q-input
              v-model="editUserForm.name"
              label="Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.middleName"
              label="Middle Name"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.surname"
              label="Surname"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.email"
              label="Email"
              dense
              outlined
              type="email"
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.homeDirectory"
              label="Home Directory"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.scriptPath"
              label="Script Path"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.telephoneNumber"
              label="Telephone Number"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="editUserForm.employeeId"
              label="Employee ID"
              dense
              outlined
              class="q-mb-sm"
            />
            <OsVersionSelect
              v-model="editUserForm.minimalOsVersion"
              label="Minimal OS version"
              class="q-mt-sm"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Save"
              color="primary"
              :loading="userControlLoading"
              @click="updateUser"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showSetPasswordDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Set Password</div>
            <div v-if="setPasswordUser" class="text-caption text-grey">
              {{ setPasswordUser.name }} ({{ setPasswordUser.samAccountName }})
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              v-model="setPasswordValue"
              label="New password"
              type="password"
              dense
              outlined
              autofocus
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Set"
              color="primary"
              :loading="userControlLoading"
              :disable="!setPasswordValue"
              @click="setPassword"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showSetAccountExpirationDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Set Account Expiration</div>
            <div v-if="accountExpirationUser" class="text-caption text-grey">
              {{ accountExpirationUser.name }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-sm">
              <div class="col-7">
                <q-input
                  v-model="gpoExpirationDate"
                  label="Date"
                  outlined
                  dense
                  readonly
                  clearable
                  class="cursor-pointer"
                  @clear="gpoExpirationDate = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="gpoExpirationDate" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-input>
              </div>
              <div class="col-5">
                <q-input
                  v-model="gpoExpirationTime"
                  label="Time"
                  outlined
                  dense
                  readonly
                  clearable
                  class="cursor-pointer"
                  @clear="gpoExpirationTime = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="access_time" />
                  </template>
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="gpoExpirationTime" mask="HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Clear"
              color="orange"
              @click="
                gpoExpirationDate = '';
                gpoExpirationTime = '';
              "
            />
            <q-btn
              unelevated
              label="Save"
              color="primary"
              :loading="userControlLoading"
              @click="setAccountExpiration"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAddToGroupDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Add to Group</div>
            <div v-if="addToGroupUser" class="text-caption text-grey">
              User: {{ addToGroupUser.name }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select
              v-model="addToGroupSelectedGroup"
              :options="
                groupsList.map((g) => ({
                  label: g.samAccountName || g.name || g.sid,
                  value: g.samAccountName || '',
                }))
              "
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Group"
              dense
              outlined
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Add"
              color="primary"
              :loading="userControlLoading"
              :disable="!addToGroupSelectedGroup"
              @click="addUserToGroup"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showRemoveFromGroupDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Remove from Group</div>
            <div v-if="removeFromGroupUser" class="text-caption text-grey">
              User: {{ removeFromGroupUser.name }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select
              v-model="removeFromGroupSelectedGroup"
              :options="
                groupsList.map((g) => ({
                  label: g.samAccountName || g.name || g.sid,
                  value: g.samAccountName || '',
                }))
              "
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Group"
              dense
              outlined
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Remove"
              color="primary"
              :loading="userControlLoading"
              :disable="!removeFromGroupSelectedGroup"
              @click="removeUserFromGroup"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showCreateGroupDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Create Group</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              v-model="createGroupForm.samGroupName"
              label="Group Name *"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="createGroupForm.description"
              label="Description"
              dense
              outlined
            />
            <OsVersionSelect
              v-model="createGroupForm.minimalOsVersion"
              label="Minimal OS version"
              class="q-mt-sm"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Create"
              color="primary"
              :loading="userControlLoading"
              @click="createGroup"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAddUserToGroupFromGroupDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Add User to Group</div>
            <div v-if="addUserToGroupGroupRow" class="text-caption text-grey">
              Group:
              {{
                addUserToGroupGroupRow.samAccountName ||
                addUserToGroupGroupRow.name
              }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select
              v-model="addUserToGroupSelectedUser"
              :options="
                usersList.map((u) => ({
                  label: u.name || u.samAccountName,
                  value: u.samAccountName,
                }))
              "
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="User"
              dense
              outlined
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Add"
              color="primary"
              :loading="userControlLoading"
              :disable="!addUserToGroupSelectedUser"
              @click="addUserToGroupFromGroupSubmit"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showRemoveUserFromGroupFromGroupDialog" persistent>
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Remove User from Group</div>
            <div
              v-if="removeUserFromGroupGroupRow"
              class="text-caption text-grey"
            >
              Group:
              {{
                removeUserFromGroupGroupRow.samAccountName ||
                removeUserFromGroupGroupRow.name
              }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select
              v-model="removeUserFromGroupSelectedUser"
              :options="
                usersList.map((u) => ({
                  label: u.name || u.samAccountName,
                  value: u.samAccountName,
                }))
              "
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="User"
              dense
              outlined
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Remove"
              color="primary"
              :loading="userControlLoading"
              :disable="!removeUserFromGroupSelectedUser"
              @click="removeUserFromGroupFromGroupSubmit"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <ApplyPolicyDialog
        v-model="showApplyPolicyDialogForUser"
        :agent="selectedAgent"
        :users="usersList"
        :initial-user-sid="initialUserSid"
      />
      <WslUserDialog
        v-model="showWslDialog"
        :agent="selectedAgent"
        :user="wslDialogUser"
      />

      <q-dialog v-model="showAgentFilterDialog" persistent>
        <q-card style="min-width: 400px; max-width: 95vw">
          <q-card-section>
            <div class="text-h6">Filter devices</div>
          </q-card-section>
          <q-card-section class="q-pt-none q-gutter-sm">
            <q-select
              v-model="agentListFiltersDraft.manufacturer"
              :options="manufacturerFilterOptions"
              label="Manufacturer"
              dense
              outlined
              clearable
              emit-value
              map-options
              :loading="agentFilterOptionsLoading"
              :disable="agentFilterOptionsLoading"
            />
            <q-select
              v-model="agentListFiltersDraft.model"
              :options="modelFilterOptionsForDraft"
              label="Model"
              dense
              outlined
              clearable
              emit-value
              map-options
              :disable="!agentListFiltersDraft.manufacturer"
              :loading="agentFilterOptionsLoading"
            />
            <OsVersionSelect
              v-model="agentListFiltersDraft.minimalOsVersion"
              label="Minimum OS version"
            />
          </q-card-section>
          <q-card-actions align="between">
            <q-btn
              flat
              label="Clear all"
              color="negative"
              :disable="agentFilterOptionsLoading"
              @click="resetAgentFiltersDraft"
            />
            <div>
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                unelevated
                label="Apply"
                color="primary"
                :loading="agentsLoading"
                @click="applyAgentListFilters"
              />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "@/utils/format";
import { exportTableToCSV, exportTableToXLSX } from "@/utils/csv";
import { useGPOPolicies, useGPOPolicyTree } from "../api/gpo";
import {
  // agentServiceClient,
  agentServiceClientWrapper,
  userClient,
  userControlClient,
  createUserGroupTargetForAgent,
  createAgentTarget,
  // userServiceClient,
  policyCatalogClient,
  policyAssignmentClient,
  policyStateClient,
  type ListAgentsFilters,
} from "../api/grpc-client";
import { fetchAgents as fetchTacticalAgents } from "@/api/agents";
import GPOPolicyForm from "../components/GPOPolicyForm.vue";
import GPOPolicySettingsDialog from "../components/GPOPolicySettingsDialog.vue";
import AppliedPoliciesDialog from "../components/AppliedPoliciesDialog.vue";
import ApplyPolicyDialog from "../components/ApplyPolicyDialog.vue";
import GPOCollectionsTable from "../components/CollectionsPolicies/GPOCollectionsTable.vue";
import UsersManagerModal from "../components/UsersManager/UsersManagerModal.vue";
import GroupsManagerModal from "../components/GroupsManager/GroupsManagerModal.vue";
import GroupsMachinesModal from "../components/GroupsMachines/GroupsMachinesModal.vue";
import AdmxManagementTab from "../components/PolicyLibrary/AdmxManagementTab.vue";
import AgentAlertsTab from "../components/AgentAlertsTab.vue";
import GpoVhdAgentTab from "../components/GpoVhdAgentTab.vue";
import WslUserDialog from "../components/WslUserDialog.vue";
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";
import { buildHumanOperatingSystemDisplay } from "../utils/supportedOsHumanLabel";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import { useQuasar, QTableColumn } from "quasar";
import { notifySuccess, notifyError } from "@/utils/notify";

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
  samAccountName: string;
  type: string;
  lastLogon?: string;
  groups?: string;
  isEnabled?: boolean;
  isLocked?: boolean;
  passwordExpired?: boolean;
  passwordLastSet?: string;
  accountExpirationDate?: string;
  displayName?: string;
  description?: string;
  givenName?: string;
  middleName?: string;
  surname?: string;
  email?: string;
  homeDirectory?: string;
  scriptPath?: string;
  telephoneNumber?: string;
  employeeId?: string;
  minimalOsVersion?: string;
}

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const GPO_MAIN_TAB_QUERY_SET = new Set([
  "dashboard",
  "collections",
  "library",
  "devices",
  "users",
  "groups",
  "groupsMachines",
]);

const policiesStore = useGPOPolicies();
const treeStore = useGPOPolicyTree();

const mainTab = ref("dashboard");
const subTab = ref("status");
const contentTab = ref("overview");
const libraryTab = ref("policies");
const policiesSubTab = ref("all");

type LibraryNav = "all" | "templates" | "management";

const libraryNav = computed<LibraryNav>({
  get() {
    if (libraryTab.value === "management") return "management";
    return policiesSubTab.value === "templates" ? "templates" : "all";
  },
  set(next) {
    if (next === "management") {
      libraryTab.value = "management";
      return;
    }
    libraryTab.value = "policies";
    policiesSubTab.value = next;
  },
});

const selectedAgent = ref<Agent | null>(null);
const usersLoading = ref(false);
const policyFilter = ref("");
const selectedPolicyForManagement = ref<GPOPolicy | null>(null);
const selectedPoliciesForManagement = ref<GPOPolicy[]>([]);
const showPolicyDialog = ref(false);
const policyDialogMode = ref<"create" | "edit" | "clone">("create");
const policyToEdit = ref<GPOPolicy | null>(null);
const showApplyPolicyDialog = ref(false);
const showApplyPolicyDialogForUser = ref(false);
const initialUserSid = ref<string>("");
const showAppliedPoliciesDialog = ref(false);
const showWslDialog = ref(false);
const wslDialogUser = ref<User | null>(null);

const showCreateUserDialog = ref(false);
const showAddUserDialog = ref(false);
const addUserOptions = ref<Array<{ value: string; label: string }>>([]);
const addUserForm = ref({
  userId: "",
  password: "",
  passwordNotRequired: false,
  userCannotChangePassword: false,
  smartcardLogonRequired: false,
});
const addUserLoading = ref(false);
const createUserForm = ref({
  target: { agentId: "" as string },
  samAccountName: "",
  password: "",
  displayName: "",
  description: "",
  enabled: true,
  passwordNotRequired: false,
  userCannotChangePassword: false,
  smartcardLogonRequired: false,
  accountExpirationDate: "",
  name: "",
  middleName: "",
  surname: "",
  email: "",
  homeDirectory: "",
  scriptPath: "",
  telephoneNumber: "",
  employeeId: "",
  minimalOsVersion: "",
});
const showEditUserDialog = ref(false);
const editUserRow = ref<User | null>(null);
const editUserMinimalOsBaseline = ref("");
const editUserForm = ref({
  displayName: "",
  description: "",
  enabled: true,
  passwordNotRequired: false,
  userCannotChangePassword: false,
  smartcardLogonRequired: false,
  accountExpirationDate: "",
  name: "",
  middleName: "",
  surname: "",
  email: "",
  homeDirectory: "",
  scriptPath: "",
  telephoneNumber: "",
  employeeId: "",
  minimalOsVersion: "",
});
const showSetPasswordDialog = ref(false);
const setPasswordUser = ref<User | null>(null);
const setPasswordValue = ref("");
const showSetAccountExpirationDialog = ref(false);
const accountExpirationUser = ref<User | null>(null);
const gpoExpirationDate = ref("");
const gpoExpirationTime = ref("");
const accountExpirationDate = computed(() => {
  if (!gpoExpirationDate.value) return undefined;
  const time = gpoExpirationTime.value || "00:00";
  return `${gpoExpirationDate.value}T${time}:00.000Z`;
});
const showAddToGroupDialog = ref(false);
const addToGroupUser = ref<User | null>(null);
const addToGroupSelectedGroup = ref("");
const showRemoveFromGroupDialog = ref(false);
const removeFromGroupUser = ref<User | null>(null);
const removeFromGroupSelectedGroup = ref("");
const userControlLoading = ref(false);

const showCreateGroupDialog = ref(false);
const createGroupForm = ref({
  target: { agentId: "" as string },
  samGroupName: "",
  description: "",
  minimalOsVersion: "",
});
const showAddUserToGroupFromGroupDialog = ref(false);
const addUserToGroupGroupRow = ref<{
  samAccountName?: string;
  name?: string;
} | null>(null);
const addUserToGroupSelectedUser = ref("");
const showRemoveUserFromGroupFromGroupDialog = ref(false);
const removeUserFromGroupGroupRow = ref<{
  samAccountName?: string;
  name?: string;
} | null>(null);
const removeUserFromGroupSelectedUser = ref("");
const appliedDialogAssignments = ref<Array<Record<string, unknown>>>([]);
const appliedDialogEffective = ref<Array<Record<string, unknown>>>([]);
const showAppliedPoliciesLoading = ref(false);
const restorePoliciesLoading = ref(false);

const policyForForm = computed(() => {
  return policyToEdit.value || undefined;
});

const agentsLoading = ref(false);
const agentsError = ref(false);
const gpoAgents = ref<Agent[]>([]);
const agentSearch = ref("");

type AgentListFilterField = "manufacturer" | "model" | "minimalOsVersion";

interface AgentListFilters {
  manufacturer: string;
  model: string;
  minimalOsVersion: string;
}

function emptyAgentListFilters(): AgentListFilters {
  return { manufacturer: "", model: "", minimalOsVersion: "" };
}

const agentListFilters = reactive<AgentListFilters>(emptyAgentListFilters());
const agentListFiltersDraft = reactive<AgentListFilters>(emptyAgentListFilters());
const showAgentFilterDialog = ref(false);
const agentFilterOptionsLoading = ref(false);
const manufacturerCatalog = ref<Array<{ name: string; models: string[] }>>([]);
const manufacturerFilterOptions = ref<Array<{ label: string; value: string }>>(
  [],
);
const hasActiveAgentFilters = computed(
  () =>
    !!agentListFilters.manufacturer.trim() ||
    !!agentListFilters.model.trim() ||
    !!agentListFilters.minimalOsVersion.trim(),
);

const activeAgentFiltersCount = computed(() => {
  let count = 0;
  if (agentListFilters.manufacturer.trim()) count += 1;
  if (agentListFilters.model.trim()) count += 1;
  if (agentListFilters.minimalOsVersion.trim()) count += 1;
  return count;
});

const agentListFiltersOsLabel = computed(() => {
  const value = agentListFilters.minimalOsVersion.trim();
  if (!value) return "";
  return buildHumanOperatingSystemDisplay(value);
});

const modelFilterOptionsForDraft = computed(() => {
  const mfr = agentListFiltersDraft.manufacturer.trim();
  if (!mfr) return [];
  const entry = manufacturerCatalog.value.find((m) => m.name === mfr);
  return (entry?.models ?? []).map((model) => ({ label: model, value: model }));
});

watch(
  () => agentListFiltersDraft.manufacturer,
  (mfr) => {
    const models =
      manufacturerCatalog.value.find((m) => m.name === mfr.trim())?.models ?? [];
    if (
      agentListFiltersDraft.model &&
      !models.includes(agentListFiltersDraft.model)
    ) {
      agentListFiltersDraft.model = "";
    }
  },
);

const agentsList = computed<Agent[]>(() => {
  return gpoAgents.value;
});

const agentSearchTrimmed = computed(() => (agentSearch.value ?? "").trim());

const filteredAgentsList = computed<Agent[]>(() => {
  const q = agentSearchTrimmed.value.toLowerCase();
  if (!q) return agentsList.value;
  return agentsList.value.filter((a) => {
    const hostname = (a.hostname ?? "").toLowerCase();
    const id = (a.id ?? "").toLowerCase();
    return hostname.includes(q) || id.includes(q);
  });
});

function buildListAgentsFilters(): ListAgentsFilters | undefined {
  const manufacturer = agentListFilters.manufacturer.trim();
  const model = agentListFilters.model.trim();
  const minimalOsVersion = agentListFilters.minimalOsVersion.trim();
  if (!manufacturer && !model && !minimalOsVersion) return undefined;
  return {
    manufacturer: manufacturer || undefined,
    model: model || undefined,
    minimalOsVersion: minimalOsVersion || undefined,
  };
}

async function loadAgentFilterOptions(): Promise<void> {
  agentFilterOptionsLoading.value = true;
  try {
    const mfrRes = await agentServiceClientWrapper.getUniqueManufacturers();
    const raw = mfrRes as {
      manufacturersList?: Array<{
        name?: string;
        modelsList?: string[];
        models?: string[];
      }>;
      manufacturers?: Array<{
        name?: string;
        modelsList?: string[];
        models?: string[];
      }>;
    };
    const list = raw.manufacturersList ?? raw.manufacturers ?? [];
    const catalog: Array<{ name: string; models: string[] }> = [];
    for (const item of list) {
      const name = String(item?.name ?? "").trim();
      if (!name) continue;
      const models = (item.modelsList ?? item.models ?? [])
        .map((m) => String(m ?? "").trim())
        .filter(Boolean);
      catalog.push({ name, models });
    }
    catalog.sort((a, b) => a.name.localeCompare(b.name));
    manufacturerCatalog.value = catalog;
    manufacturerFilterOptions.value = catalog.map((m) => ({
      label: m.name,
      value: m.name,
    }));
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(`Failed to load filter options: ${msg}`);
  } finally {
    agentFilterOptionsLoading.value = false;
  }
}

function openAgentFilterDialog(): void {
  Object.assign(agentListFiltersDraft, agentListFilters);
  showAgentFilterDialog.value = true;
  if (!manufacturerCatalog.value.length) {
    void loadAgentFilterOptions();
  }
}

function resetAgentFiltersDraft(): void {
  Object.assign(agentListFiltersDraft, emptyAgentListFilters());
}

async function applyAgentListFilters(): Promise<void> {
  Object.assign(agentListFilters, agentListFiltersDraft);
  showAgentFilterDialog.value = false;
  await loadAgents();
}

async function clearAgentFilterField(field: AgentListFilterField): Promise<void> {
  agentListFilters[field] = "";
  if (field === "manufacturer") {
    agentListFilters.model = "";
  }
  await loadAgents();
}

async function loadAgents() {
  agentsLoading.value = true;
  agentsError.value = false;

  try {
    const tacticalAgents = await fetchTacticalAgents({ detail: false });

    const allowedAgentIds = Array.isArray(tacticalAgents)
      ? tacticalAgents.map((agent: { agent_id?: string }) =>
          String(agent.agent_id),
        )
      : [];

    const response = await agentServiceClientWrapper.listAgents(
      allowedAgentIds.length > 0 ? allowedAgentIds : undefined,
      buildListAgentsFilters(),
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
    label: "Account Name",
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
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
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
    name: "isEnabled",
    label: "Enabled",
    align: "center",
    field: "isEnabled",
    format: (val: boolean) => (val === false ? "No" : "Yes"),
    sortable: true,
  },
  {
    name: "isLocked",
    label: "Locked",
    align: "center",
    field: "isLocked",
    format: (val: boolean) => (val ? "Yes" : "No"),
    sortable: true,
  },
  {
    name: "passwordExpired",
    label: "Password Expired",
    align: "center",
    field: "passwordExpired",
    format: (val: boolean) => (val ? "Yes" : "No"),
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
    name: "passwordLastSet",
    label: "Password Last Set",
    align: "left",
    field: "passwordLastSet",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
    sortable: true,
  },
];

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

const filteredPoliciesByCategory = (category: "all" | "templates") => {
  const allPolicies = policiesStore.policies.value;
  const filter = policyFilter.value?.toLowerCase() ?? "";

  let policies = !filter
    ? allPolicies
    : allPolicies.filter((policy) => {
        const name = policy.name.toLowerCase();
        const path = policy.path?.toLowerCase() ?? "";
        const displayName = policy.displayName?.toLowerCase() ?? "";
        const description = policy.description?.toLowerCase() ?? "";
        return (
          name.includes(filter) ||
          path.includes(filter) ||
          displayName.includes(filter) ||
          description.includes(filter)
        );
      });

  if (category === "templates") {
    policies = policies.filter((policy) => {
      const name = policy.name.toLowerCase();
      const path = policy.path?.toLowerCase() ?? "";
      const displayName = policy.displayName?.toLowerCase() ?? "";
      return (
        name.includes("template") ||
        path.includes("template") ||
        displayName.includes("template")
      );
    });
  }

  return policies;
};

interface AgentDetails {
  agentId?: string;
  hostName?: string;
  ipAddress?: string;
  isOnline?: boolean;
  lastHeartbeatUnix?: number | string;
  nodeInfo?: {
    systeminfo?: {
      nodeid?: string;
      hostname?: string;
      osversion?: string;
      cpu?: string;
      ramgb?: number;
      disksList?: string[];
      gpuList?: string[];
      ipaddressesList?: string[];
      macaddressesList?: string[];
      motherboard?: string;
    };
    manufacturer?: string;
    model?: string;
    firmwareversion?: string;
    osbuild?: string;
    timezone?: string;
    isdomainjoined?: boolean;
    antivirusstatus?: string;
    lastboottime?: {
      seconds?: number;
      nanos?: number;
    };
    nodeId?: string;
  };
}

const agentDetails = ref<AgentDetails | null>(null);

const agentOsVersion = computed(() => {
  const details = agentDetails.value;
  return (
    details?.nodeInfo?.systeminfo?.osversion ||
    selectedAgent.value?.operating_system ||
    "N/A"
  );
});

const agentSystemHostname = computed(() => {
  const details = agentDetails.value;
  return (
    details?.nodeInfo?.systeminfo?.hostname ||
    details?.hostName ||
    selectedAgent.value?.hostname ||
    "N/A"
  );
});

const agentSystemIpAddresses = computed(() => {
  return agentDetails.value?.nodeInfo?.systeminfo?.ipaddressesList || [];
});

const agentSystemMacAddresses = computed(() => {
  return agentDetails.value?.nodeInfo?.systeminfo?.macaddressesList || [];
});

async function loadUsersForAgent(agentId: string) {
  usersLoading.value = true;
  usersList.value = [];

  try {
    const users = await userClient.listUsersForAgent(agentId);

    if (users && users.length > 0) {
      usersList.value = users.map((user) => {
        const userName =
          user.displayname || user.name || user.samaccountname || "Unknown";
        const accountTypeNum = user.accounttype ?? 0;

        let accountType = "Unknown";
        if (accountTypeNum === 1) {
          accountType = "Local";
        } else if (accountTypeNum === 2) {
          accountType = "System";
        }

        let groupsString: string | undefined;
        if (user.groupsList && user.groupsList.length > 0) {
          const groupNames = user.groupsList
            .map(
              (group) =>
                group.displayname || group.name || group.samaccountname || "",
            )
            .filter((name) => name !== "");
          groupsString = groupNames.join(", ");
        }

        let lastLogon: string | undefined;
        if (user.lastlogon?.seconds != null) {
          const timestamp =
            typeof user.lastlogon.seconds === "string"
              ? Number.parseInt(user.lastlogon.seconds, 10)
              : user.lastlogon.seconds;
          if (timestamp === 0) {
            lastLogon = "Never";
          } else {
            lastLogon = formatDate(new Date(timestamp * 1000).toISOString());
          }
        }

        let accountExpirationDate: string | undefined;
        const exp = user.accountexpirationdate;
        if (exp?.seconds != null) {
          const sec =
            typeof exp.seconds === "string"
              ? Number.parseInt(exp.seconds, 10)
              : exp.seconds;
          accountExpirationDate = new Date(sec * 1000)
            .toISOString()
            .slice(0, 10);
        }

        const uStr = user as unknown as Record<string, string | undefined>;
        const getStr = (a: string, b?: string) =>
          uStr[a] || (b ? uStr[b] : undefined) || "";

        let passwordLastSet: string | undefined;
        const pls = user.passwordlastset;
        if (pls?.seconds != null) {
          const sec =
            typeof pls.seconds === "string"
              ? Number.parseInt(pls.seconds, 10)
              : pls.seconds;
          passwordLastSet = new Date(sec * 1000).toISOString().slice(0, 10);
        }

        return {
          name: userName,
          sid: user.sid || "",
          samAccountName: user.samaccountname || user.name || "",
          type: accountType,
          lastLogon,
          groups: groupsString,
          isEnabled: user.isenabled ?? true,
          isLocked: user.islocked ?? false,
          passwordExpired: user.passwordexpired ?? false,
          passwordLastSet,
          accountExpirationDate,
          displayName: getStr("displayname", "displayName"),
          description: getStr("description"),
          givenName: getStr("givenname", "givenName"),
          middleName: getStr("middlename", "middleName"),
          surname: getStr("surname"),
          email: getStr("email"),
          homeDirectory: getStr("homedirectory", "homeDirectory"),
          scriptPath: getStr("scriptpath", "scriptPath"),
          telephoneNumber: getStr("telephonenumber", "telephoneNumber"),
          employeeId: getStr("employeeid", "employeeId"),
          minimalOsVersion: getStr("minimalosversion", "minimalOsVersion"),
        };
      });
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
      console.warn("User list endpoint not found (404)");
    } else if (isRpcError) {
      console.error("RPC error loading users:", errorMessage);
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
    const groups = await userClient.listUserGroupsForAgent(agentId);
    groupsList.value = groups.map((group) => ({
      name: group.name || "",
      displayName: group.displayname || "",
      distinguishedName: group.distinguishedname || "",
      samAccountName: group.samaccountname || "",
      UserPrincipalName: group.userprincipalname || "",
      description: group.description || "",
      structuralObjectClass: group.structuralobjectclass || "",
      sid: group.sid || "",
    }));
  } catch (error) {
    const errorMessage = (error as { message?: string })?.message || "";
    const is404 =
      (error as { response?: { status?: number } })?.response?.status === 404 ||
      errorMessage.includes("404");
    const isRpcError =
      errorMessage.includes("RpcError") ||
      errorMessage.includes("deserializing");

    if (is404) {
      console.warn("Groups list endpoint not found (404)");
    } else if (isRpcError) {
      console.error("RPC error loading groups:", errorMessage);
    }
    groupsList.value = [];
  } finally {
    groupsLoading.value = false;
  }
}

const selectAgent = async (
  agent: Agent,
  options?: { skipToggle?: boolean },
) => {
  const same = selectedAgent.value?.id === agent.id;
  if (!options?.skipToggle && same) {
    clearAgentSelection();
    return;
  }
  if (options?.skipToggle && same) {
    return;
  }
  selectedAgent.value = agent;
  if (agent.id) {
    loadUsersForAgent(agent.id);
    loadGroupsForAgent(agent.id);
    loadAgentDetails(agent.id);
  }
};

async function syncAgentSelectionFromRouteQuery() {
  const agentIdFromQuery = route.query.agent_id as string | undefined;
  if (!agentIdFromQuery) {
    return;
  }
  let agent = gpoAgents.value.find((a) => a.id === agentIdFromQuery);
  if (!agent) {
    await loadAgents();
    agent = gpoAgents.value.find((a) => a.id === agentIdFromQuery);
  }
  if (agent) {
    await selectAgent(agent, { skipToggle: true });
    mainTab.value = "dashboard";
  }
}

const loadAgentDetails = async (agentId: string) => {
  try {
    const details = await agentServiceClientWrapper.getAgent(agentId);
    agentDetails.value = details;
  } catch (error) {
    console.error("Error loading agent details:", error);
    agentDetails.value = null;
  }
};

const clearAgentSelection = () => {
  selectedAgent.value = null;
  usersList.value = [];
  groupsList.value = [];
  agentDetails.value = null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function openPolicyDetails(policyHash: string) {
//   if (!policyHash) {
//     return;
//   }

//   try {
//     const pd = await policyCatalogClient.getPolicy(policyHash);
//     const pdObj = pd as unknown as Record<string, unknown>;
//     const name = String(
//       pdObj["displayName"] ||
//         pdObj["display_name"] ||
//         pdObj["name"] ||
//         policyHash,
//     );
//     const description = String(
//       pdObj["explain_text"] || pdObj["explainText"] || "",
//     );

//     $q.dialog({
//       title: `Policy: ${name}`,
//       message: `
//         <div><strong>Hash:</strong> ${policyHash}</div>
//         <div style="margin-top:8px;"><strong>Description:</strong> ${description}</div>
//       `,
//       html: true,
//       ok: true,
//     });
//   } catch (error) {
//     $q.dialog({
//       title: "Policy details",
//       message: `Could not load policy details for ${policyHash}`,
//     });
//   }
// }

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
  }
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === "windows") {
      router
        .replace({
          path: route.path,
          query: { ...route.query, tab: "dashboard" },
        })
        .catch(() => {});
      return;
    }
    if (
      newTab &&
      typeof newTab === "string" &&
      GPO_MAIN_TAB_QUERY_SET.has(newTab)
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

const openWslDialog = (user: User) => {
  if (!selectedAgent.value) return;
  wslDialogUser.value = user;
  showWslDialog.value = true;
};

watch(showApplyPolicyDialogForUser, (newVal) => {
  if (!newVal) {
    initialUserSid.value = "";
  }
});

watch(showWslDialog, (newVal) => {
  if (!newVal) {
    wslDialogUser.value = null;
  }
});

function getAgentId(): string {
  const id = selectedAgent.value?.id;
  if (!id) {
    notifyError("No agent selected");
    throw new Error("No agent selected");
  }
  return id;
}

async function refreshUsersAndGroups() {
  const id = selectedAgent.value?.id;
  if (id) {
    await loadUsersForAgent(id);
    await loadGroupsForAgent(id);
  }
}

async function openAddUserDialog() {
  if (!selectedAgent.value) return;
  addUserForm.value = {
    userId: "",
    password: "",
    passwordNotRequired: false,
    userCannotChangePassword: false,
    smartcardLogonRequired: false,
  };
  addUserOptions.value = [];
  showAddUserDialog.value = true;
  addUserLoading.value = true;
  try {
    const res = await userControlClient.getAllUsers();
    const list =
      res?.usersList ??
      (
        res as {
          users?: Array<{
            userid?: string;
            info?: { samaccountname?: string };
          }>;
        }
      )?.users ??
      [];
    addUserOptions.value = list
      .map(
        (u: {
          userid?: string;
          userId?: string;
          info?: { samaccountname?: string };
        }) => {
          const uid = u.userid ?? u.userId ?? "";
          const label = (u.info?.samaccountname ?? uid) || "—";
          return { value: uid, label };
        },
      )
      .filter((o) => o.value);
  } catch {
    notifyError("Failed to load users list");
  } finally {
    addUserLoading.value = false;
  }
}

async function addUserSubmit() {
  const agentId = selectedAgent.value?.id;
  const userId = addUserForm.value.userId?.trim();
  if (!agentId || !userId) {
    notifyError("Select a user");
    return;
  }
  addUserLoading.value = true;
  try {
    const target = createAgentTarget(agentId);
    const res = await userControlClient.setUserAgent(target, userId, {
      password: addUserForm.value.password?.trim() || undefined,
      passwordNotRequired: addUserForm.value.passwordNotRequired,
      userCannotChangePassword: addUserForm.value.userCannotChangePassword,
      smartcardLogonRequired: addUserForm.value.smartcardLogonRequired,
    });
    if (res.status === 0) {
      notifySuccess("User linked to device");
      showAddUserDialog.value = false;
      await refreshUsersAndGroups();
    } else {
      notifyError(res.errorMessage ?? "Failed to link user to device");
    }
  } catch (e) {
    const msg = (e as { message?: string })?.message ?? String(e);
    notifyError(msg);
  } finally {
    addUserLoading.value = false;
  }
}

function openCreateUserDialog() {
  const agentId = getAgentId();
  createUserForm.value = {
    target: { agentId },
    samAccountName: "",
    password: "",
    displayName: "",
    description: "",
    enabled: true,
    passwordNotRequired: false,
    userCannotChangePassword: false,
    smartcardLogonRequired: false,
    accountExpirationDate: "",
    name: "",
    middleName: "",
    surname: "",
    email: "",
    homeDirectory: "",
    scriptPath: "",
    telephoneNumber: "",
    employeeId: "",
    minimalOsVersion: "",
  };
  showCreateUserDialog.value = true;
}

async function createUser() {
  const f = createUserForm.value;
  let targetAgentId: string;
  try {
    targetAgentId = (f.target?.agentId?.trim() || getAgentId()) ?? "";
  } catch {
    notifyError("No agent selected");
    return;
  }
  if (!targetAgentId) {
    notifyError("No agent selected");
    return;
  }
  const sam = (f.samAccountName ?? "").trim();
  const pwd = (f.password ?? "").trim();
  if (!sam) {
    notifyError("Account Name is required");
    return;
  }
  if (!pwd) {
    notifyError("Password is required");
    return;
  }
  userControlLoading.value = true;
  const userPayload = {
    samAccountName: f.samAccountName.trim(),
    password: f.password.trim(),
    displayName: f.displayName.trim() || "",
    description: f.description.trim() || "",
    enabled: f.enabled,
    passwordNotRequired: f.passwordNotRequired || false,
    userCannotChangePassword: f.userCannotChangePassword || false,
    smartcardLogonRequired: f.smartcardLogonRequired || false,
    accountExpirationDate: f.accountExpirationDate.trim() || "",
    name: f.name.trim() || "",
    middleName: f.middleName.trim() || "",
    surname: f.surname.trim() || "",
    email: f.email.trim() || "",
    homeDirectory: f.homeDirectory.trim() || "",
    scriptPath: f.scriptPath.trim() || "",
    telephoneNumber: f.telephoneNumber.trim() || "",
    employeeId: f.employeeId.trim() || "",
    minimalOsVersion: f.minimalOsVersion?.trim() || undefined,
  };
  console.log("[CreateUser] target:", { agentId: targetAgentId });
  console.log("[CreateUser] payload:", {
    ...userPayload,
    password: userPayload.password ? "***" : undefined,
  });
  try {
    await userControlClient.createUser(
      createUserGroupTargetForAgent(targetAgentId),
      userPayload,
    );
    notifySuccess("User created");
    showCreateUserDialog.value = false;
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function openEditUserDialog(row: User) {
  editUserRow.value = row;
  editUserMinimalOsBaseline.value = (row.minimalOsVersion ?? "").trim();
  editUserForm.value = {
    displayName: row.displayName ?? "",
    description: row.description ?? "",
    enabled: row.isEnabled !== false,
    passwordNotRequired: false,
    userCannotChangePassword: false,
    smartcardLogonRequired: false,
    accountExpirationDate: row.accountExpirationDate ?? "",
    name: row.givenName ?? "",
    middleName: row.middleName ?? "",
    surname: row.surname ?? "",
    email: row.email ?? "",
    homeDirectory: row.homeDirectory ?? "",
    scriptPath: row.scriptPath ?? "",
    telephoneNumber: row.telephoneNumber ?? "",
    employeeId: row.employeeId ?? "",
    minimalOsVersion: row.minimalOsVersion ?? "",
  };
  showEditUserDialog.value = true;
}

async function updateUser() {
  const targetAgentId = getAgentId();
  const row = editUserRow.value;
  if (!row) return;
  const f = editUserForm.value;
  const nextOs = (f.minimalOsVersion ?? "").trim();
  const baseOs = (editUserMinimalOsBaseline.value ?? "").trim();
  let minimalOsPayload: { minimalOsVersion: string } | undefined;
  if (nextOs !== baseOs) {
    minimalOsPayload = { minimalOsVersion: nextOs };
  }
  userControlLoading.value = true;
  try {
    await userControlClient.updateUser(
      createUserGroupTargetForAgent(targetAgentId),
      row.samAccountName,
      {
        displayName: f.displayName.trim() || undefined,
        description: f.description.trim() || undefined,
        enabled: f.enabled,
        passwordNotRequired: f.passwordNotRequired,
        userCannotChangePassword: f.userCannotChangePassword,
        smartcardLogonRequired: f.smartcardLogonRequired,
        accountExpirationDate: f.accountExpirationDate.trim() || undefined,
        name: f.name.trim() || undefined,
        middleName: f.middleName.trim() || undefined,
        surname: f.surname.trim() || undefined,
        email: f.email.trim() || undefined,
        homeDirectory: f.homeDirectory.trim() || undefined,
        scriptPath: f.scriptPath.trim() || undefined,
        telephoneNumber: f.telephoneNumber.trim() || undefined,
        employeeId: f.employeeId.trim() || undefined,
        ...minimalOsPayload,
      },
    );
    notifySuccess("User updated");
    showEditUserDialog.value = false;
    editUserRow.value = null;
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function openSetPasswordDialog(row: User) {
  setPasswordUser.value = row;
  setPasswordValue.value = "";
  showSetPasswordDialog.value = true;
}

async function setPassword() {
  const targetAgentId = getAgentId();
  const row = setPasswordUser.value;
  if (!row || !setPasswordValue.value) {
    notifyError("Password is required");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.setUserPassword(
      createUserGroupTargetForAgent(targetAgentId),
      row.samAccountName,
      setPasswordValue.value,
    );
    notifySuccess("Password set");
    showSetPasswordDialog.value = false;
    setPasswordUser.value = null;
    setPasswordValue.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

async function toggleUserEnabled(row: User) {
  const targetAgentId = getAgentId();
  const enable = row.isEnabled === false;
  userControlLoading.value = true;
  try {
    await userControlClient.enableUser(
      createUserGroupTargetForAgent(targetAgentId),
      row.samAccountName,
      enable,
    );
    notifySuccess(enable ? "User enabled" : "User disabled");
    const u = usersList.value.find(
      (x) => x.samAccountName === row.samAccountName,
    );
    if (u) u.isEnabled = enable;
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function confirmEnableAllUsersForAgent(enable: boolean) {
  if (!selectedAgent.value?.id) {
    notifyError("No agent selected");
    return;
  }
  $q.dialog({
    title: enable ? "Enable all users" : "Disable all users",
    message: enable
      ? "Enable every user account in directory scope for this agent?"
      : "Disable every user account in directory scope for this agent? Users will not be able to sign in until re-enabled.",
    cancel: true,
    persistent: true,
    color: enable ? "primary" : "negative",
  }).onOk(() => runEnableAllUsersForAgent(enable));
}

async function runEnableAllUsersForAgent(enable: boolean) {
  let targetAgentId: string;
  try {
    targetAgentId = getAgentId();
  } catch {
    return;
  }
  userControlLoading.value = true;
  try {
    const res = await userControlClient.enableAllUsers(
      createUserGroupTargetForAgent(targetAgentId),
      enable,
    );
    if (res.status !== 0) {
      notifyError(res.errorMessage || "Operation failed");
      return;
    }
    notifySuccess(enable ? "All users enabled" : "All users disabled");
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function unlockUserConfirm(row: User) {
  $q.dialog({
    title: "Unlock user",
    message: `Unlock user ${row.name} (${row.samAccountName})?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const targetAgentId = getAgentId();
    userControlLoading.value = true;
    try {
      await userControlClient.unlockUser(
        createUserGroupTargetForAgent(targetAgentId),
        row.samAccountName,
      );
      notifySuccess("User unlocked");
      await refreshUsersAndGroups();
    } catch (e) {
      const msg = (e as { message?: string })?.message || String(e);
      notifyError(msg);
    } finally {
      userControlLoading.value = false;
    }
  });
}

function expirePasswordConfirm(row: User) {
  $q.dialog({
    title: "Expire password",
    message: `Force password change at next logon for ${row.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const targetAgentId = getAgentId();
    userControlLoading.value = true;
    try {
      await userControlClient.expireUserPassword(
        createUserGroupTargetForAgent(targetAgentId),
        row.samAccountName,
      );
      notifySuccess("Password expired");
      await refreshUsersAndGroups();
    } catch (e) {
      const msg = (e as { message?: string })?.message || String(e);
      notifyError(msg);
    } finally {
      userControlLoading.value = false;
    }
  });
}

function openSetAccountExpirationDialog(row: User) {
  accountExpirationUser.value = row;
  gpoExpirationDate.value = "";
  gpoExpirationTime.value = "";
  showSetAccountExpirationDialog.value = true;
}

async function setAccountExpiration() {
  const targetAgentId = getAgentId();
  const row = accountExpirationUser.value;
  if (!row) return;
  userControlLoading.value = true;
  try {
    await userControlClient.setUserAccountExpiration(
      createUserGroupTargetForAgent(targetAgentId),
      row.samAccountName,
      accountExpirationDate.value,
    );
    notifySuccess("Account expiration updated");
    showSetAccountExpirationDialog.value = false;
    accountExpirationUser.value = null;
    gpoExpirationDate.value = "";
    gpoExpirationTime.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function openAddUserToGroupDialog(row: User) {
  addToGroupUser.value = row;
  addToGroupSelectedGroup.value = groupsList.value[0]?.samAccountName ?? "";
  showAddToGroupDialog.value = true;
}

async function addUserToGroup() {
  const targetAgentId = getAgentId();
  const row = addToGroupUser.value;
  if (!row || !addToGroupSelectedGroup.value) {
    notifyError("Select a group");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.addUserToGroup(
      createUserGroupTargetForAgent(targetAgentId),
      addToGroupSelectedGroup.value,
      row.samAccountName,
    );
    notifySuccess("User added to group");
    showAddToGroupDialog.value = false;
    addToGroupUser.value = null;
    addToGroupSelectedGroup.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function openRemoveUserFromGroupDialog(row: User) {
  removeFromGroupUser.value = row;
  removeFromGroupSelectedGroup.value =
    groupsList.value[0]?.samAccountName ?? "";
  showRemoveFromGroupDialog.value = true;
}

async function removeUserFromGroup() {
  const targetAgentId = getAgentId();
  const row = removeFromGroupUser.value;
  if (!row || !removeFromGroupSelectedGroup.value) {
    notifyError("Select a group");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.removeUserFromGroup(
      createUserGroupTargetForAgent(targetAgentId),
      removeFromGroupSelectedGroup.value,
      row.samAccountName,
    );
    notifySuccess("User removed from group");
    showRemoveFromGroupDialog.value = false;
    removeFromGroupUser.value = null;
    removeFromGroupSelectedGroup.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function deleteUserConfirm(row: User) {
  $q.dialog({
    title: "Delete user",
    message: `Delete user ${row.name} (${row.samAccountName})? This cannot be undone.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const targetAgentId = getAgentId();
    userControlLoading.value = true;
    try {
      await userControlClient.deleteUser(
        createUserGroupTargetForAgent(targetAgentId),
        row.samAccountName,
      );
      notifySuccess("User deleted");
      await refreshUsersAndGroups();
    } catch (e) {
      const msg = (e as { message?: string })?.message || String(e);
      notifyError(msg);
    } finally {
      userControlLoading.value = false;
    }
  });
}

function openCreateGroupDialog() {
  const agentId = getAgentId();
  createGroupForm.value = {
    target: { agentId },
    samGroupName: "",
    description: "",
    minimalOsVersion: "",
  };
  showCreateGroupDialog.value = true;
}

async function createGroup() {
  const f = createGroupForm.value;
  const targetAgentId = f.target?.agentId || getAgentId();
  if (!f.samGroupName.trim()) {
    notifyError("Group name is required");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.createGroup(
      createUserGroupTargetForAgent(targetAgentId),
      f.samGroupName.trim(),
      {
        description: f.description.trim() || undefined,
        minimalOsVersion: (f.minimalOsVersion ?? "").trim() || undefined,
      },
    );
    notifySuccess("Group created");
    showCreateGroupDialog.value = false;
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function deleteGroupConfirm(row: { samAccountName?: string; name?: string }) {
  const name = row.samAccountName || row.name || "this group";
  $q.dialog({
    title: "Delete group",
    message: `Delete group ${name}? This cannot be undone.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const targetAgentId = getAgentId();
    const samGroupName = row.samAccountName || row.name || "";
    if (!samGroupName) return;
    userControlLoading.value = true;
    try {
      await userControlClient.deleteGroup(
        createUserGroupTargetForAgent(targetAgentId),
        samGroupName,
      );
      notifySuccess("Group deleted");
      await refreshUsersAndGroups();
    } catch (e) {
      const msg = (e as { message?: string })?.message || String(e);
      notifyError(msg);
    } finally {
      userControlLoading.value = false;
    }
  });
}

function openAddUserToGroupFromGroupRow(row: {
  samAccountName?: string;
  name?: string;
}) {
  addUserToGroupGroupRow.value = row;
  addUserToGroupSelectedUser.value = usersList.value[0]?.samAccountName ?? "";
  showAddUserToGroupFromGroupDialog.value = true;
}

async function addUserToGroupFromGroupSubmit() {
  const targetAgentId = getAgentId();
  const groupRow = addUserToGroupGroupRow.value;
  if (!groupRow?.samAccountName || !addUserToGroupSelectedUser.value) {
    notifyError("Select a user");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.addUserToGroup(
      createUserGroupTargetForAgent(targetAgentId),
      groupRow.samAccountName,
      addUserToGroupSelectedUser.value,
    );
    notifySuccess("User added to group");
    showAddUserToGroupFromGroupDialog.value = false;
    addUserToGroupGroupRow.value = null;
    addUserToGroupSelectedUser.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function openRemoveUserFromGroupFromGroupRow(row: {
  samAccountName?: string;
  name?: string;
}) {
  removeUserFromGroupGroupRow.value = row;
  removeUserFromGroupSelectedUser.value =
    usersList.value[0]?.samAccountName ?? "";
  showRemoveUserFromGroupFromGroupDialog.value = true;
}

async function removeUserFromGroupFromGroupSubmit() {
  const targetAgentId = getAgentId();
  const groupRow = removeUserFromGroupGroupRow.value;
  if (!groupRow?.samAccountName || !removeUserFromGroupSelectedUser.value) {
    notifyError("Select a user");
    return;
  }
  userControlLoading.value = true;
  try {
    await userControlClient.removeUserFromGroup(
      createUserGroupTargetForAgent(targetAgentId),
      groupRow.samAccountName,
      removeUserFromGroupSelectedUser.value,
    );
    notifySuccess("User removed from group");
    showRemoveUserFromGroupFromGroupDialog.value = false;
    removeUserFromGroupGroupRow.value = null;
    removeUserFromGroupSelectedUser.value = "";
    await refreshUsersAndGroups();
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    userControlLoading.value = false;
  }
}

function describeLoadAppliedPoliciesError(reason: unknown): string {
  if (reason === null || reason === undefined) return "Unknown error";
  if (typeof reason === "string") return reason;
  if (typeof reason === "object") {
    const r = reason as Record<string, unknown>;
    const msg =
      (typeof r.message === "string" && r.message) ||
      (typeof r["Message"] === "string" && r["Message"]) ||
      "";
    const code = r.code;
    if (msg && code !== undefined && code !== null) {
      return `${msg} (gRPC ${String(code)})`;
    }
    if (msg) return msg;
  }
  try {
    return String(reason);
  } catch {
    return "Unknown error";
  }
}

async function loadAppliedPoliciesDialogData(agentId: string): Promise<void> {
  const [assignmentsOutcome, effectiveOutcome] = await Promise.allSettled([
    policyStateClient.getAssignmentsFor("agent", { agentId }),
    policyStateClient.getEffectivePoliciesFor("agent", { agentId }),
  ]);

  if (assignmentsOutcome.status === "rejected") {
    throw assignmentsOutcome.reason;
  }
  const assignmentsResp = assignmentsOutcome.value;

  let effectiveResp: Record<string, unknown> = { policiesList: [] };
  if (effectiveOutcome.status === "fulfilled") {
    effectiveResp = effectiveOutcome.value as unknown as Record<
      string,
      unknown
    >;
  } else {
    const msg = describeLoadAppliedPoliciesError(effectiveOutcome.reason);
    notifyError(`Could not load effective policies: ${msg}`);
  }

  const assignmentsObj = assignmentsResp as unknown as Record<string, unknown>;
  const assignments = ((assignmentsObj["assignmentsList"] as unknown) ||
    (assignmentsObj["assignments"] as unknown) ||
    []) as Array<Record<string, unknown>>;

  const effectivePolicies = ((effectiveResp["policiesList"] as unknown) ||
    (effectiveResp["policies"] as unknown) ||
    []) as Array<Record<string, unknown>>;

  appliedDialogAssignments.value = await Promise.all(
    assignments.map(async (a, index) => {
      const policyHash = String(a["policyHash"] || "");
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
          // игнор
        }
      }
      if (!displayName) displayName = policyHash;
      const explainText =
        summary &&
        String(
          summary["explainText"] ||
            summary["explain_text"] ||
            summary["policy_hash"] ||
            "",
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
    const userSid = String(
      p["userSid"] ?? p["usersid"] ?? p["user_sid"] ?? "",
    ).trim();
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
      ? String(summary["explainText"] || summary["explain_text"] || "").trim()
      : String(p["explainText"] || p["explain_text"] || "").trim();
    const scopeRaw = summary?.["scope"];
    const scope =
      scopeRaw !== undefined && scopeRaw !== null
        ? String(scopeRaw)
        : undefined;
    return {
      ...p,
      policyHash,
      id: policyHash,
      userSid,
      displayName,
      summary,
      explainText: explainText || undefined,
      description: explainText || undefined,
      scope: scope || undefined,
    };
  });
}

function confirmRestoreAllPoliciesForAgent() {
  if (!selectedAgent.value?.id) {
    notifyError("No agent selected");
    return;
  }
  const hostname =
    selectedAgent.value.hostname || selectedAgent.value.id || "this agent";
  $q.dialog({
    title: "Restore all policies",
    message: `Restore all Group Policy assignments on "${hostname}" to their default state? All current policy overrides on this agent will be removed.`,
    cancel: { label: "Cancel", flat: true },
    ok: { label: "Restore", color: "negative", unelevated: true },
    persistent: true,
    focus: "cancel",
  }).onOk(() => {
    void runRestoreAllPoliciesForAgent();
  });
}

async function runRestoreAllPoliciesForAgent() {
  let agentId: string;
  try {
    agentId = getAgentId();
  } catch {
    return;
  }
  restorePoliciesLoading.value = true;
  try {
    const res = await policyAssignmentClient.restoreAllPolicies("agent", {
      agentId,
    });
    if (res.status !== 0) {
      notifyError("Failed to restore policies on this agent");
      return;
    }
    notifySuccess("All policies restored to default state");
    if (showAppliedPoliciesDialog.value) {
      await refreshAppliedPoliciesDialog();
    }
  } catch (e) {
    const msg = (e as { message?: string })?.message || String(e);
    notifyError(msg);
  } finally {
    restorePoliciesLoading.value = false;
  }
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
      notifyError(
        `Error loading applied policies: ${describeLoadAppliedPoliciesError(error)}`,
      );
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
    notifyError(
      `Error loading applied policies: ${describeLoadAppliedPoliciesError(error)}`,
    );
  } finally {
    showAppliedPoliciesLoading.value = false;
  }
}

onMounted(async () => {
  await loadAgents();

  const tabFromQuery = route.query.tab as string | undefined;
  if (tabFromQuery === "windows") {
    router
      .replace({
        path: route.path,
        query: { ...route.query, tab: "dashboard" },
      })
      .catch(() => {});
    mainTab.value = "dashboard";
  } else if (tabFromQuery && GPO_MAIN_TAB_QUERY_SET.has(tabFromQuery)) {
    mainTab.value = tabFromQuery;
  }

  if (mainTab.value === "library") {
    policiesStore.fetchPolicies();
    treeStore.fetchPolicyTree();
  }
  await syncAgentSelectionFromRouteQuery();
});

watch(
  () => route.query.agent_id,
  () => {
    void syncAgentSelectionFromRouteQuery();
  },
);

function exportPolicies(category: "all" | "templates", format: "csv" | "xlsx") {
  const policies = filteredPoliciesByCategory(category);
  const timestamp = new Date()
    .toISOString()
    .replaceAll(/[:.]/g, "-")
    .slice(0, -5);
  const filename = `policies-${category}-${timestamp}.${format}`;

  const columns = [
    { name: "name", label: "Name", field: "name" },
    { name: "displayName", label: "Display Name", field: "displayName" },
    { name: "description", label: "Description", field: "description" },
    { name: "path", label: "Path", field: "path" },
    { name: "scope", label: "Scope", field: "scope" },
    {
      name: "enabled",
      label: "Enabled",
      field: (row: GPOPolicy) => (row.enabled ? "Yes" : "No"),
    },
  ];

  if (format === "xlsx") {
    exportTableToXLSX(policies, columns, filename);
  } else {
    exportTableToCSV(policies, columns, filename);
  }
}
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
  flex-shrink: 0
  padding: 12px 0px

.gpo-devices-header-top
  padding-bottom: 12px
  border-bottom: 2px solid rgba(18, 177, 209, 0.2)

.gpo-devices-search
  :deep(.q-field__control)
    background: rgba(255, 255, 255, 0.92)

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
  height: 80vh

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

.body--dark .gpo-agent-item:hover
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.18) 0%, rgba(18, 177, 209, 0.22) 100%)

.body--dark .gpo-agent-item.q-item--active
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.28) 0%, rgba(18, 177, 209, 0.32) 100%)

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


.gpo-content-panels--collections
  flex: 1 1 0%
  min-height: 0
  overflow: hidden

  > *
    flex: 1 1 0%
    min-height: 0
    overflow: hidden

.gpo-content-panels-wrap
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.gpo-content-tab-panels
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow-y: auto
  overflow-x: hidden
  :deep(.q-panel),
  :deep(.q-panel > div)
    height: auto
    min-height: 0

.gpo-standalone-page-wrap
  display: flex
  flex-direction: column
  min-height: 0
  overflow: hidden
  padding: 0

.gpo-standalone-page-wrap :deep(.users-manager-layout),
.gpo-standalone-page-wrap :deep(.groups-manager-layout),
.gpo-standalone-page-wrap :deep(.groups-machines-layout)
  height: 100%
  min-height: 0
  flex: 1

.gpo-standalone-page-wrap :deep(.users-manager-page),
.gpo-standalone-page-wrap :deep(.groups-manager-page)
  flex: 1
  min-height: 0

.body--dark .gpo-content-header
  background: rgba(30, 30, 30, 0.98)
  border-bottom: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-panel
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 45, 55, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-header
  background: rgba(30, 30, 30, 0.8)

.body--dark .gpo-devices-header-top
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
  //overflow-y: auto
  position: relative
  :deep(.q-panel),
  :deep(.q-panel > div)
    height: auto
    min-height: 0

.gpo-policies-sub-panels
  min-height: 300px
  :deep(.q-panel),
  :deep(.q-panel > div)
    height: auto
    min-height: 0

.table-container
  max-height: 600px
  overflow-y: auto
  overflow-x: hidden

.policy-assignment-scroll-area
  height: 400px
  width: 100%

.agent-tab-table-scroll
  height: calc(100vh - 320px)
  min-height: 300px
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

.system-info-scroll
  height: calc(100vh - 260px)
  min-height: 700px
  width: 100%

.system-info-wrap
  padding: 4px

.system-info-summary
  background: rgba(16, 137, 211, 0.04)
  border: 1px solid rgba(18, 177, 209, 0.18)
  border-radius: 10px
  padding: 8px 12px

.body--dark .system-info-summary
  background: rgba(18, 177, 209, 0.06)
  border: 1px solid rgba(18, 177, 209, 0.28)

.system-info-accordion
  border-radius: 10px
  overflow: hidden

.system-info-kv
  display: flex
  gap: 10px
  padding: 6px 0

.system-info-kv + .system-info-kv
  border-top: 1px dashed rgba(18, 177, 209, 0.18)

.system-info-k
  min-width: 140px
  color: rgba(0, 0, 0, 0.55)
  font-size: 12px
  line-height: 16px

.body--dark .system-info-k
  color: rgba(255, 255, 255, 0.65)

.system-info-v
  flex: 1
  min-width: 0
  color: rgba(0, 0, 0, 0.88)
  font-size: 13px
  line-height: 18px
  word-break: break-word

.body--dark .system-info-v
  color: rgba(255, 255, 255, 0.88)

.system-info-list-item
  padding-left: 10px
  padding-right: 0
</style>
