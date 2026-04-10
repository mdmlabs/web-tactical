<template>
  <div class="mdm-card">
    <div class="mdm-card__header">
      <span>Agents</span>
    </div>
    <div style="padding: 0">
      <!-- Tabs + Search row -->
      <div class="row q-pb-xs no-wrap q-px-md q-pt-sm">
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
                      <q-item-label>Show Offline for over 30 days</q-item-label>
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
      <!-- Agent Table -->
      <div style="min-height: 300px">
        <AgentTable
          :agents="filteredAgents"
          :columns="columns"
          :search="search"
          :visibleColumns="visibleColumns"
          :showAlertColumns="showAlertColumns"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AgentTable from "@/components/AgentTable.vue";

export default {
  name: "DashboardAgentsSection",
  components: {
    AgentTable,
  },
  provide() {
    return {
      refreshDashboard: (clearTreeSelected) => {
        this.$store.dispatch("refreshDashboard", clearTreeSelected);
      },
    };
  },
  data() {
    return {
      search: this.$route?.query?.search || "",
      filterTextLength: 0,
      filterAvailability: "all",
      filterPatchesPending: false,
      filterActionsPending: false,
      filterChecksFailing: false,
      filterRebootNeeded: false,
      showAlertColumns: false,
      columns: [
        { name: "smsalert", align: "left" },
        { name: "emailalert", align: "left" },
        { name: "dashboardalert", align: "left" },
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
        { name: "italic", field: "italic" },
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
      if (
        this.filterAvailability === "all" &&
        (this.search.includes("is:online") ||
          this.search.includes("is:offline") ||
          this.search.includes("is:expired") ||
          this.search.includes("is:overdue"))
      )
        this.clearFilter();
      if (!this.isFilteringTable) return;
      let filterText = "";
      if (this.filterPatchesPending) filterText += "is:patchespending ";
      if (this.filterActionsPending) filterText += "is:actionspending ";
      if (this.filterChecksFailing) filterText += "is:checksfailing ";
      if (this.filterRebootNeeded) filterText += "is:rebootneeded ";
      if (this.filterAvailability !== "all") {
        if (this.filterAvailability === "online") filterText += "is:online ";
        else if (this.filterAvailability === "offline")
          filterText += "is:offline ";
        else if (this.filterAvailability === "offline_30days")
          filterText += "is:expired ";
        else if (this.filterAvailability === "overdue")
          filterText += "is:overdue ";
      }
      this.search = filterText;
      this.filterTextLength = filterText.length - 1;
    },
  },
  computed: {
    ...mapState({
      clearSearchWhenSwitching: (state) => state.clearSearchWhenSwitching,
      agents: (state) => state.agents,
      selectedTree: (state) => state.selectedTree,
    }),
    tab: {
      get() {
        return this.$store.state.defaultAgentTblTab;
      },
      set(newVal) {
        this.$store.commit("SET_DEFAULT_AGENT_TBL_TAB", newVal);
      },
    },
    filteredAgents() {
      if (this.tab === "mixed") return this.agents;
      return this.agents.filter((k) => k.monitoring_type === this.tab);
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
    const tableHeight = this.$q.screen.height - 50 - 40 - 80;
    this.$store.commit("setTableHeight", `${tableHeight}px`);
  },
};
</script>
