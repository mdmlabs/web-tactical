<template>
  <q-page class="dashboard-page">
    <q-splitter
      v-model="clientTreeSplitter"
      unit="%"
      :limits="[15, 40]"
      :style="{ height: `${$q.screen.height - 50 - 40}px` }"
    >
      <template v-slot:before>
        <div
          v-if="!treeReady"
          class="q-pa-sm q-gutter-sm text-center"
          style="height: 30vh"
        >
          <q-spinner size="40px" color="primary" />
        </div>
        <div
          v-else
          class="q-pa-sm q-gutter-sm scroll"
          style="height: 85vh; overflow: initial"
        >
          <q-list dense class="rounded-borders">
            <q-item
              clickable
              v-ripple
              :active="allClientsActive"
              @click="clearTreeSelected"
            >
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>All Clients</q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="add"
                  size="sm"
                  @click.stop="openCreateSiteDialog"
                >
                  <q-tooltip>Create Site</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-tree
              ref="tree"
              :nodes="clientsTree"
              node-key="raw"
              no-nodes-label="No Clients"
              selected-color="primary"
              v-model:selected="selectedTree"
              :expanded="expandedNodes"
              @update:expanded="onExpandedUpdate"
              @update:selected="$store.dispatch('refreshDashboard')"
            >
              <template v-slot:default-header="props">
                <div class="row items-center">
                  <!-- Agent node: show status dot -->
                  <template v-if="props.node.raw && String(props.node.raw).startsWith('Agent|')">
                    <span
                      class="status-dot"
                      :class="props.node.color === 'positive' ? 'status-dot--online' : 'status-dot--offline'"
                    ></span>
                    <span class="q-ml-xs">{{ props.node.label }}</span>
                    <q-tooltip :delay="600">
                      Agent ID: {{ String(props.node.raw).split('|')[1] }}<br />
                      Status: {{ props.node.color === 'positive' ? 'online' : 'offline' }}
                    </q-tooltip>
                  </template>
                  <!-- Site/Client node: show icon -->
                  <template v-else>
                    <q-icon
                      :name="props.node.icon"
                      :color="props.node.color"
                      class="q-mr-sm"
                    />
                    <div>
                      {{ props.node.label }}
                      <q-badge
                        v-if="props.node.site?.agent_count > 0"
                        color="grey-4"
                        text-color="grey-8"
                        :label="props.node.site.agent_count"
                        class="q-ml-xs agent-count-badge"
                        rounded
                        clickable
                        @click.stop="toggleExpand(props.node.raw)"
                      >
                        <q-tooltip>Click to show/hide agents</q-tooltip>
                      </q-badge>
                      <q-tooltip :delay="600">
                        ID: {{ props.node.id }}<br />
                        Agent Count:
                        {{ props.node.site?.agent_count ?? 0 }}
                      </q-tooltip>
                    </div>

                    <q-menu context-menu>
                      <q-list dense style="min-width: 200px">
                        <q-item
                          clickable
                          v-close-popup
                          @click="showEditModal(props.node)"
                        >
                          <q-item-section side>
                            <q-icon name="edit_note" />
                          </q-item-section>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="showDeleteModal(props.node)"
                        >
                          <q-item-section side>
                            <q-icon name="delete_outline" />
                          </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>

                      <q-separator></q-separator>

                      <q-item
                        clickable
                        v-close-popup
                        @click="showAddSiteModal(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="add_circle_outline" />
                        </q-item-section>
                        <q-item-section>Add Child Site</q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="showToggleMaintenance(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="build_circle" />
                        </q-item-section>
                        <q-item-section>{{
                          props.node.color === "green"
                            ? "Disable Maintenance Mode"
                            : "Enable Maintenance Mode"
                        }}</q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="showInstallAgent(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="download" />
                        </q-item-section>
                        <q-item-section>Install Agent</q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="showPolicyAdd(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="rule" />
                        </q-item-section>
                        <q-item-section
                          >Assign Automation Policy</q-item-section
                        >
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="showAlertTemplateAdd(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="warning_amber" />
                        </q-item-section>
                        <q-item-section>Assign Alert Template</q-item-section>
                      </q-item>

                      <q-item clickable v-ripple @click="getURLActions">
                        <q-item-section side>
                          <q-icon name="launch" />
                        </q-item-section>
                        <q-item-section>Run URL Action</q-item-section>
                        <q-item-section side>
                          <q-icon name="chevron_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top end" self="top start">
                          <q-list>
                            <q-item
                              v-for="action in urlActions"
                              :key="action.id"
                              dense
                              clickable
                              v-close-popup
                              @click="
                                runURLAction(
                                  props.node.id,
                                  action.id,
                                  'site',
                                )
                              "
                            >
                              {{ action.name }}
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>

                      <!-- Bulk Run Checks -->
                      <q-item
                        clickable
                        v-close-popup
                        @click="runChecks(props.node)"
                      >
                        <q-item-section side>
                          <q-icon name="check_circle_outline" />
                        </q-item-section>
                        <q-item-section>Run Checks</q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-if="
                          $integrations?.siteMenuIntegrations?.length > 0
                        "
                      >
                        <q-item-section side>
                          <q-icon name="assessment" />
                        </q-item-section>
                        <q-item-section>Reporting</q-item-section>
                        <q-item-section side>
                          <q-icon name="chevron_right" />
                        </q-item-section>
                        <integrations-context-menu
                          type="site"
                          :id="props.node.id"
                        />
                      </q-item>

                      <q-separator></q-separator>

                      <q-item clickable v-close-popup>
                        <q-item-section>Close</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  </template>
                </div>
              </template>
            </q-tree>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <div class="column full-height" style="overflow: auto">
          <!-- Stats Section -->
          <div class="q-px-md q-pt-sm q-pb-xs">
            <div class="row q-col-gutter-md items-stretch">
              <!-- Stat cards -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="stat-card">
                  <q-card-section class="row items-center no-wrap q-pa-md">
                    <div class="col">
                      <div class="text-caption text-grey-7 text-uppercase">
                        TOTAL AGENTS
                      </div>
                      <div class="text-h4 text-weight-bold">
                        {{ agents.length }}
                      </div>
                    </div>
                    <q-icon
                      name="mdi-monitor-multiple"
                      size="2.5em"
                      color="primary"
                    />
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="stat-card">
                  <q-card-section class="row items-center no-wrap q-pa-md">
                    <div class="col">
                      <div class="text-caption text-grey-7 text-uppercase">
                        ONLINE AGENTS
                      </div>
                      <div class="text-h4 text-weight-bold">
                        {{ onlineAgentCount }}
                      </div>
                    </div>
                    <q-icon name="wifi" size="2.5em" color="positive" />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Agents section card -->
          <div class="q-px-md q-pt-sm q-pb-xs">
          <div class="agents-card">
            <div class="agents-card__header">
              <span class="text-subtitle1 text-weight-bold">Agents</span>
              <span class="text-caption text-grey-7">{{ paginationLabel }}</span>
            </div>

          <div class="row q-pb-xs no-wrap q-px-md">
            <q-tabs
              v-model="tab"
              dense
              no-caps
              inline-label
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
            >
              <q-tab name="server" icon="dns" label="Servers" />
              <q-tab name="workstation" icon="laptop" label="Workstations" />
              <q-tab name="mixed" icon="view_module" label="Mixed" />
            </q-tabs>
            <q-space />
            <q-btn
              round
              dense
              flat
              :icon="showAlertColumns ? 'visibility' : 'visibility_off'"
              :color="showAlertColumns ? 'primary' : 'grey'"
              @click="showAlertColumns = !showAlertColumns"
              class="q-mr-sm"
            >
              <q-tooltip>
                {{
                  showAlertColumns
                    ? "Hide notification columns"
                    : "Show notification columns"
                }}
              </q-tooltip>
            </q-btn>
            <q-input
              v-model="search"
              style="width: 450px"
              label="Search"
              dense
              outlined
              clearable
              @clear="clearFilter"
              class="q-pr-md q-pb-xs"
            >
              <template v-slot:prepend>
                <q-icon name="manage_search" color="primary" />
              </template>
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="tune"
                  :color="isFilteringTable ? 'green' : ''"
                >
                  <q-menu>
                    <q-list dense>
                      <q-item-label header>Filter Agent Table</q-item-label>

                      <q-item>
                        <q-item-section side>
                          <q-checkbox v-model="filterChecksFailing" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Checks Failing</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-checkbox v-model="filterPatchesPending" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Patches Pending</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-checkbox v-model="filterActionsPending" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Actions Pending</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-checkbox v-model="filterRebootNeeded" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Reboot Needed</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item-label header>Availability</q-item-label>

                      <q-item>
                        <q-item-section side>
                          <q-radio val="all" v-model="filterAvailability" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Show All Agents</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-radio val="online" v-model="filterAvailability" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Show Online Only</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-radio val="offline" v-model="filterAvailability" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Show Offline Only</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-radio val="overdue" v-model="filterAvailability" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Show Overdue Only</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section side>
                          <q-radio
                            val="offline_30days"
                            v-model="filterAvailability"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label
                            >Show Offline for over 30 days</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <div class="row no-wrap q-pa-md">
                      <div class="column">
                        <q-btn
                          v-close-popup
                          label="Apply"
                          color="primary"
                          @click="applyFilter"
                        />
                      </div>
                      <q-space />
                      <div class="column">
                        <q-btn label="Clear" @click="clearFilter" />
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
              </template>
            </q-input>
          </div>
          <div
            class="col"
            style="flex: 1 1 auto; min-height: 0; overflow: hidden"
          >
            <AgentTable
              :agents="filteredAgents"
              :columns="columns"
              :search="search"
              :visibleColumns="visibleColumns"
              :showAlertColumns="showAlertColumns"
            />
          </div>
          </div><!-- /.agents-card -->
          </div><!-- /.q-px-md wrapper -->
        </div>
      </template>
    </q-splitter>

    <!-- install agent modal -->
    <q-dialog v-model="showInstallAgentModal" @hide="closeInstallAgent">
      <InstallAgent @close="closeInstallAgent" :sitepk="parseInt(sitePk)" />
    </q-dialog>

    <!-- create site dialog -->
    <q-dialog v-model="showCreateSiteDialog">
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Site</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="createSiteForm.name"
            label="Site Name *"
            outlined
            dense
            class="q-mb-sm"
            autofocus
          />
          <q-select
            v-model="createSiteForm.parent_id"
            :options="siteParentOptions"
            option-value="master_id"
            option-label="name"
            emit-value
            map-options
            label="Parent Site"
            outlined
            dense
            clearable
            class="q-mb-sm"
          />
          <q-input
            v-model="createSiteForm.description"
            label="Description"
            outlined
            dense
            type="textarea"
            rows="2"
            class="q-mb-sm"
          />
          <q-input
            v-model.number="createSiteForm.max_agents"
            label="Max Agents"
            type="number"
            outlined
            dense
            class="q-mb-sm"
            :min="0"
          />
          <OsVersionSelect
            v-model="createSiteForm.os_version"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Create"
            :loading="createSiteLoading"
            :disable="!createSiteForm.name.trim()"
            @click="doCreateSite"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import mixins from "@/mixins/mixins";
import { openURL } from "quasar";
import { mapState } from "vuex";
import AgentTable from "@/components/AgentTable.vue";
import PolicyAdd from "@/components/automation/modals/PolicyAdd.vue";
import SitesForm from "@/components/clients/SitesForm.vue";
import DeleteClient from "@/components/clients/DeleteClient.vue";
import InstallAgent from "@/components/modals/agents/InstallAgent.vue";
import AlertTemplateAdd from "@/components/modals/alerts/AlertTemplateAdd.vue";
import IntegrationsContextMenu from "@/components/ui/IntegrationsContextMenu.vue";
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";

import { removeSite } from "@/api/clients";

export default {
  name: "DashboardView",
  components: {
    AgentTable,
    InstallAgent,
    IntegrationsContextMenu,
    OsVersionSelect,
  },
  // allow child components to refresh table
  provide() {
    return {
      refreshDashboard: (clearTreeSelected) => {
        this.$store.dispatch("refreshDashboard", clearTreeSelected);
      },
    };
  },
  mixins: [mixins],
  data() {
    return {
      showInstallAgentModal: false,
      sitePk: null,
      showCreateSiteDialog: false,
      createSiteLoading: false,
      createSiteForm: {
        name: "",
        description: "",
        parent_id: null,
        max_agents: 0,
        os_version: "",
      },
      siteParentOptions: [],
      search: this.$route.query.search ? this.$route.query.search : "",
      filterTextLength: 0,
      filterAvailability: "all",
      filterPatchesPending: false,
      filterActionsPending: false,
      filterChecksFailing: false,
      filterRebootNeeded: false,
      urlActions: [],
      showAlertColumns: false,
      expandedNodes: [],
      columns: [
        {
          name: "smsalert",
          align: "left",
        },
        {
          name: "emailalert",
          align: "left",
        },
        {
          name: "dashboardalert",
          align: "left",
        },
        {
          name: "plat",
          label: "",
          field: "plat",
          sortable: true,
          align: "left",
        },
        {
          name: "mon-type",
          label: "",
          field: "monitoring_type",
          sortable: true,
          align: "left",
        },
        {
          name: "checks-status",
          align: "left",
          field: "checks",
          sortable: true,
          sort: (a, b) =>
            parseInt(b.failing) - parseInt(a.failing) ||
            parseInt(b.warning) - parseInt(a.warning) ||
            parseInt(b.info) - parseInt(a.info),
        },
        {
          name: "ancestors",
          label: "Path",
          field: "ancestors",
          sortable: true,
          align: "left",
        },
        {
          name: "site_name",
          label: "Category",
          field: "site_name",
          sortable: true,
          align: "left",
        },
        {
          name: "hostname",
          label: "Hostname",
          field: "hostname",
          sortable: true,
          align: "left",
        },
        {
          name: "description",
          label: "Description",
          field: "description",
          sortable: true,
          align: "left",
        },
        {
          name: "user",
          label: "User",
          field: "logged_username",
          sortable: true,
          align: "left",
        },
        {
          name: "italic",
          field: "italic",
        },
        {
          name: "patchespending",
          field: "has_patches_pending",
          align: "left",
          sortable: true,
        },
        {
          name: "pendingactions",
          field: "pending_actions_count",
          align: "left",
          sortable: true,
        },
        {
          name: "needs_reboot",
          field: "needs_reboot",
          align: "left",
          sortable: true,
        },
        {
          name: "agentstatus",
          field: "status",
          align: "left",
          sortable: true,
        },
        {
          name: "last_seen",
          label: "Last Response",
          field: "last_seen",
          sortable: true,
          align: "left",
        },
        {
          name: "windows_policy_status",
          label: "Windows Policy Status",
          field: "windows_policy_status",
          style: "width: 80px;",
          sortable: true,
          align: "left",
        },
        {
          name: "windows_policy_last_seen",
          label: "Windows Policy Last Seen",
          field: "windows_policy_last_seen",
          style: "width: 80px;",
          sortable: true,
          align: "left",
        },
        {
          name: "boot_time",
          label: "Boot Time",
          field: "boot_time",
          sortable: true,
          align: "left",
        },
        {
          name: "geolocation",
          field: "last_geolocation",
          align: "left",
          sortable: true,
          sort: (a, b) => {
            if (a && !b) return -1;
            if (!a && b) return 1;
            return 0;
          },
        },
      ],
      visibleColumns: [
        "smsalert",
        "plat",
        "mon-type",
        "emailalert",
        "dashboardalert",
        "checks-status",
        "ancestors",
        "site_name",
        "hostname",
        "description",
        "user",
        "patchespending",
        "pendingactions",
        "agentstatus",
        "needs_reboot",
        "last_seen",
        "windows_policy_status",
        "windows_policy_last_seen",
        "boot_time",
        "geolocation",
      ],
    };
  },
  watch: {
    search(newVal) {
      if (newVal === "") this.clearFilter();
      else if (newVal.length < this.filterTextLength) this.clearFilter();
    },
    selectedTree() {
      if (this.clearSearchWhenSwitching) this.clearFilter();
    },
    tab() {
      this.$store.dispatch("loadAgents");
    },
  },
  methods: {
    async openCreateSiteDialog() {
      const { data } = await this.$axios.get("/clients/sites/");
      this.siteParentOptions = data;
      this.createSiteForm = {
        name: "",
        description: "",
        parent_id: null,
        max_agents: 0,
        os_version: "",
      };
      this.showCreateSiteDialog = true;
    },
    async doCreateSite() {
      this.createSiteLoading = true;
      try {
        await this.$axios.post("/clients/sites/", {
          site: {
            name: this.createSiteForm.name.trim(),
            description: this.createSiteForm.description.trim() || "",
            parent: this.createSiteForm.parent_id ?? null,
            max_agents: this.createSiteForm.max_agents ?? 0,
            os_version: (this.createSiteForm.os_version || "").trim() || null,
          },
          custom_fields: [],
        });
        this.notifySuccess("Site created");
        this.showCreateSiteDialog = false;
        this.$store.dispatch("loadTree");
      } catch (e) {
        console.error(e);
      }
      this.createSiteLoading = false;
    },
    onExpandedUpdate(expanded) {
      this.expandedNodes = [...expanded];
    },
    toggleExpand(nodeRaw) {
      console.log("Toggle expand for:", nodeRaw);
      const index = this.expandedNodes.indexOf(nodeRaw);
      if (index === -1) {
        this.expandedNodes.push(nodeRaw);
      } else {
        this.expandedNodes.splice(index, 1);
      }
      this.expandedNodes = [...this.expandedNodes];
      console.log("Expanded nodes:", this.expandedNodes);
    },
    getTree() {
      this.$store.dispatch("loadTree");
    },
    clearTreeSelected() {
      if (this.clearSearchWhenSwitching) this.clearFilter();
      this.$store.dispatch("refreshDashboard", true);
    },
    showPolicyAdd(node) {
      this.$q
        .dialog({
          component: PolicyAdd,
          componentProps: {
            type: "site",
            object: node.site,
          },
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    showAddSiteModal(node) {
      this.$q
        .dialog({
          component: SitesForm,
          componentProps: {
            parent: node.id,
          },
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    showEditModal(node) {
      this.$q
        .dialog({
          component: SitesForm,
          componentProps: { site: node.site },
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    subtreeHasAgents(nodes) {
      for (const n of nodes ?? []) {
        if (n.site?.agent_count > 0) return true;
        if (n.children?.length && this.subtreeHasAgents(n.children)) return true;
      }
      return false;
    },
    subtreeAgentCount(nodes) {
      let count = 0;
      for (const n of nodes ?? []) {
        count += n.site?.agent_count ?? 0;
        if (n.children?.length) count += this.subtreeAgentCount(n.children);
      }
      return count;
    },
    showDeleteModal(node) {
      const totalAgentCount =
        (node.site?.agent_count ?? 0) + this.subtreeAgentCount(node.children);
      const hasAgents = totalAgentCount > 0;
      if (hasAgents) {
        this.$q
          .dialog({
            component: DeleteClient,
            componentProps: {
              object: node.site,
              totalAgentCount,
            },
          })
          .onOk(this.clearTreeSelected);
      } else {
        this.$q
          .dialog({
            title: "Are you sure?",
            message: `Delete site: ${node.label}.`,
            cancel: true,
            ok: { label: "Delete", color: "negative" },
          })
          .onOk(async () => {
            this.$q.loading.show();
            try {
              const result = await removeSite(node.master_id);
              this.notifySuccess(result);
              this.clearTreeSelected();
            } catch (e) {
              console.error(e);
            }
            this.$q.loading.hide();
          });
      }
    },
    showInstallAgent(node) {
      this.sitePk = node.id;
      this.showInstallAgentModal = true;
    },
    closeInstallAgent() {
      this.showInstallAgentModal = false;
      this.sitePk = null;
    },
    showAlertTemplateAdd(node) {
      this.$q
        .dialog({
          component: AlertTemplateAdd,
          componentProps: {
            type: "site",
            object: node.site,
          },
        })
        .onOk(() => this.$store.dispatch("refreshDashboard"));
    },
    runChecks(node) {
      this.$axios
        .post(`/checks/site/${node.id}/csbulkrun/`)
        .then((r) => {
          this.notifySuccess(r.data);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    showToggleMaintenance(node) {
      let data = {
        id: node.id,
        type: node.raw.split("|")[0],
        action: node.color === "green" ? false : true,
      };

      this.$axios
        .post("/agents/maintenance/bulk/", data)
        .then((r) => {
          this.notifySuccess(r.data);
          this.$store.dispatch("refreshDashboard");
          this.$store.commit("setRefreshSummaryTab", true);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    clearFilter() {
      this.filterTextLength = 0;
      this.filterPatchesPending = false;
      this.filterRebootNeeded = false;
      this.filterChecksFailing = false;
      this.filterActionsPending = false;
      this.filterAvailability = "all";
      this.search = "";
    },
    applyFilter() {
      // clear search if availability changes to all
      if (
        this.filterAvailability === "all" &&
        (this.search.includes("is:online") ||
          this.search.includes("is:offline") ||
          this.search.includes("is:expired") ||
          this.search.includes("is:overdue"))
      )
        this.clearFilter();

      // don't apply filter if nothing is being filtered
      if (!this.isFilteringTable) return;

      let filterText = "";

      if (this.filterPatchesPending) {
        filterText += "is:patchespending ";
      }

      if (this.filterActionsPending) {
        filterText += "is:actionspending ";
      }

      if (this.filterChecksFailing) {
        filterText += "is:checksfailing ";
      }

      if (this.filterRebootNeeded) {
        filterText += "is:rebootneeded ";
      }

      if (this.filterAvailability !== "all") {
        if (this.filterAvailability === "online") {
          filterText += "is:online ";
        } else if (this.filterAvailability === "offline") {
          filterText += "is:offline ";
        } else if (this.filterAvailability === "offline_30days") {
          filterText += "is:expired ";
        } else if (this.filterAvailability === "overdue") {
          filterText += "is:overdue ";
        }
      }

      this.search = filterText;
      this.filterTextLength = filterText.length - 1;
    },
    getURLActions() {
      this.$axios.get("/core/urlaction/").then((r) => {
        this.urlActions = r.data
          .filter((action) => action.action_type === "web")
          .sort((a, b) => a.name.localeCompare(b.name));
        if (this.urlActions.length === 0) {
          this.notifyWarning(
            "No URL Actions configured. Go to Settings > Global Settings > URL Actions",
          );
        }
      });
    },
    runURLAction(id, action, model) {
      const data = {
        [model]: id,
        action: action,
      };
      this.$axios.patch("/core/urlaction/run/", data).then((r) => {
        openURL(r.data);
      });
    },
  },
  computed: {
    ...mapState({
      clientsTree: (state) => state.tree,
      treeReady: (state) => state.treeReady,
      clearSearchWhenSwitching: (state) => state.clearSearchWhenSwitching,
      agents: (state) => state.agents,
    }),
    clientTreeSplitter: {
      get() {
        return this.$store.state.clientTreeSplitter;
      },
      set(newVal) {
        this.$store.dispatch("setClientTreeSplitter", newVal);
      },
    },
    tab: {
      get() {
        return this.$store.state.defaultAgentTblTab;
      },
      set(newVal) {
        this.$store.commit("SET_DEFAULT_AGENT_TBL_TAB", newVal);
      },
    },
    selectedTree: {
      get() {
        return this.$store.state.selectedTree;
      },
      set(newVal) {
        this.$store.commit("setSelectedTree", newVal);
      },
    },
    allClientsActive() {
      return this.selectedTree === "";
    },
    onlineAgentCount() {
      return this.agents.filter((a) => a.status === "online").length;
    },
    filteredAgents() {
      if (this.tab === "mixed") return this.agents;
      else return this.agents.filter((k) => k.monitoring_type === this.tab);
    },
    paginationLabel() {
      const total = this.filteredAgents.length;
      if (total === 0) return "0 of 0";
      return `1-${total} of ${total}`;
    },
    isFilteringTable() {
      return (
        this.filterPatchesPending ||
        this.filterActionsPending ||
        this.filterChecksFailing ||
        this.filterRebootNeeded ||
        this.filterAvailability !== "all"
      );
    },
  },
  mounted() {
    this.$store.dispatch("refreshDashboard");

    const tableHeight = this.$q.screen.height - 50 - 40 - 80;
    this.$store.commit("setTableHeight", `${tableHeight}px`);

    // Force q-layout / q-splitter to recompute container offsets after the
    // view mounts. Without this, returning to the dashboard after a viewport
    // change (e.g. opening/closing DevTools) can leave the splitter "before"
    // panel clipped under the FileBar drawer.
    this.$nextTick(() => window.dispatchEvent(new Event("resize")));
  },
};
</script>

<style scoped>
/* Dashboard Background - matching FileBar style */
.dashboard-page {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.05) 0%,
    rgba(18, 177, 209, 0.08) 100%
  );
  min-height: 100vh;
  padding-top: 5px;
}

/* Dark theme support */
.body--dark .dashboard-page {
  background: linear-gradient(
    135deg,
    rgba(25, 35, 45, 0.3) 0%,
    rgba(30, 40, 50, 0.4) 100%
  );
}

.my-menu-link {
  color: white;
  background: lightgray;
}

.dashboard-page .row,
.dashboard-page .column {
  flex-wrap: nowrap !important;
}

/* Agent status dot */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot--online {
  background: #059669;
  box-shadow: 0 0 6px rgba(5, 150, 105, 0.4);
}

.status-dot--offline {
  background: #9ca3af;
}

/* Clickable agent count badge */
.agent-count-badge {
  cursor: pointer;
  transition: opacity 0.2s;
}

.agent-count-badge:hover {
  opacity: 0.8;
}

.stat-card {
  border-radius: 8px;
  height: 100%;
}

/* Agents section card */
.agents-card {
  background: var(--mdm-bg-card, #fff);
  border-radius: var(--mdm-radius-lg, 8px);
  box-shadow: var(--mdm-shadow, 0 1px 3px 0 rgb(0 0 0 / 0.1));
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  overflow: hidden;
}

.agents-card__header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
