<template>
  <q-dialog ref="dialog" @hide="onHide">
    <q-card class="q-dialog-plugin" style="width: 90vw; max-width: 90vw">
      <q-bar>
        <q-btn
          @click="getPolicyTree"
          class="q-mr-sm"
          dense
          flat
          push
          icon="refresh"
        />Policy Overview
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-splitter v-model="splitterModel" style="height: 600px">
        <template v-slot:before>
          <div class="q-pa-md">
            <q-tree
              ref="tree"
              :nodes="siteTree"
              node-key="key"
              selected-color="primary"
              v-model:selected="selectedPolicyId"
            ></q-tree>
          </div>
        </template>

        <template v-slot:after>
          <q-tabs
            v-model="selectedTab"
            dense
            inline-label
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
          >
            <q-tab name="checks" icon="fas fa-check-double" label="Checks" />
            <q-tab name="tasks" icon="fas fa-tasks" label="Tasks" />
          </q-tabs>
          <q-tab-panels
            v-model="selectedTab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="checks">
              <PolicyChecksTab
                v-if="!!selectedPolicyId"
                :selectedPolicy="$refs.tree.getNodeByKey(selectedPolicyId).id"
              />
            </q-tab-panel>
            <q-tab-panel name="tasks">
              <PolicyAutomatedTasksTab
                v-if="!!selectedPolicyId"
                :selectedPolicy="$refs.tree.getNodeByKey(selectedPolicyId).id"
              />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script>
import mixins from "@/mixins/mixins";
import PolicyChecksTab from "@/components/automation/PolicyChecksTab.vue";
import PolicyAutomatedTasksTab from "@/components/automation/PolicyAutomatedTasksTab.vue";

export default {
  name: "PolicyOverview",
  emits: ["hide", "ok", "cancel"],
  components: {
    PolicyAutomatedTasksTab,
    PolicyChecksTab,
  },
  mixins: [mixins],
  data() {
    return {
      splitterModel: 25,
      selectedPolicyId: null,
      selectedTab: "checks",
      siteTree: [],
    };
  },
  methods: {
    getPolicyTree() {
      this.$q.loading.show();
      this.$axios
        .get("/automation/policies/overview/")
        .then((r) => {
          this.processTreeDataFromApi(r.data);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    processTreeDataFromApi(data) {
      var result = [];
      let unique_id = 0;

      for (let site of data) {
        var site_temp = {};
        site_temp["label"] = site.name;
        site_temp["id"] = unique_id;
        site_temp["icon"] = "apartment";
        site_temp["selectable"] = false;
        site_temp["children"] = [];
        site_temp["key"] = `${unique_id}${site.name}`;

        unique_id--;

        // Add any server policies assigned to site
        if (!!site.server_policy) {
          let disabled = "";
          if (!site.server_policy.active) {
            disabled = " (disabled)";
          }
          const label = site.server_policy.name + " (Servers)" + disabled;
          site_temp["children"].push({
            label: label,
            icon: "policy",
            id: site.server_policy.id,
            key: `${site.server_policy.id}${label}`,
          });
        }

        // Add any workstation policies assigned to site
        if (!!site.workstation_policy) {
          let disabled = "";
          if (!site.workstation_policy.active) {
            disabled = " (disabled)";
          }
          const label =
            site.workstation_policy.name + " (Workstations)" + disabled;
          site_temp["children"].push({
            label: label,
            icon: "policy",
            id: site.workstation_policy.id,
            key: `${site.workstation_policy.id}${label}`,
          });
        }

        result.push(site_temp);
      }

      this.siteTree = result;
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onHide() {
      this.$emit("hide");
    },
  },
  mounted() {
    this.getPolicyTree();
  },
};
</script>
