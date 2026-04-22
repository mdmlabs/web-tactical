<template>
  <div class="uk-tree-panel">
    <div v-if="!clientsStore.treeReady" class="uk-tree-panel__loading">
      <q-spinner size="40px" color="primary" />
    </div>
    <div v-else class="uk-tree-panel__content uk-scrollbar">
      <q-list dense class="rounded-borders">
        <!-- Header row: All Categories + show/hide toggle -->
        <q-item
          clickable
          v-ripple
          :active="clientsStore.allClientsSelected"
          @click="clearTreeSelected"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>All Categories</q-item-section>
          <q-item-section side>
            <div class="row items-center no-wrap q-gutter-xs">
              <q-badge v-if="clStore.hiddenCount > 0" color="warning" class="q-mr-xs">
                {{ clStore.hiddenCount }}
              </q-badge>
              <q-btn
                v-if="clStore.hiddenCount > 0"
                flat dense round
                :icon="clStore.showHiddenMode ? 'visibility' : 'visibility_off'"
                size="xs"
                :color="clStore.showHiddenMode ? 'positive' : 'grey'"
                @click.stop="clStore.toggleShowHidden()"
              >
                <q-tooltip>{{ clStore.showHiddenMode ? 'Show active' : 'Show hidden' }}</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>

        <!-- Restore all bar (shown in hidden mode) -->
        <q-item v-if="clStore.showHiddenMode && clStore.hiddenCount > 0" dense class="bg-grey-2">
          <q-item-section class="text-center">
            <q-btn flat dense no-caps color="positive" icon="restart_alt" label="Restore all" size="sm" @click="clStore.showAll(); clStore.toggleShowHidden()" />
          </q-item-section>
        </q-item>

        <q-tree
            ref="tree"
            :nodes="clientsStore.filteredTree"
            node-key="raw"
            no-nodes-label="No Categories"
            selected-color="primary"
            v-model:selected="selectedTree"
            @update:selected="agentsStore.refreshDashboard()"
          >
          <template v-slot:default-header="props">
            <div class="row items-center no-wrap full-width tree-node-row">
              <q-icon
                :name="props.node.icon"
                :color="props.node.color"
                class="q-mr-sm"
              />
              <div class="ellipsis">
                {{ props.node.label }}
                <q-tooltip :delay="600">
                  ID: {{ props.node.id }}<br />
                  Agent Count:
                  {{ props.node.site.agent_count }}
                </q-tooltip>
              </div>

              <q-space />

              <!-- Hide / Restore button — always visible -->
              <q-btn
                v-if="!clStore.isHidden(props.node.raw)"
                flat dense round
                icon="visibility_off"
                size="xs"
                color="grey-5"
                class="tree-hide-btn"
                @click.stop="clStore.hideClient(props.node.raw)"
              >
                <q-tooltip>Hide this category</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                flat dense round
                icon="visibility"
                size="xs"
                color="positive"
                class="tree-hide-btn"
                @click.stop="clStore.showClient(props.node.raw)"
              >
                <q-tooltip>Restore this category</q-tooltip>
              </q-btn>

              <q-menu context-menu>
                <q-list dense style="min-width: 200px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="showEditModal(props.node)"
                  >
                    <q-item-section side><q-icon name="edit_note" /></q-item-section>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="showDeleteModal(props.node)"
                  >
                    <q-item-section side><q-icon name="delete_outline" /></q-item-section>
                    <q-item-section>Delete</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item
                    clickable
                    v-close-popup
                    @click="showAddSiteModal(props.node)"
                  >
                    <q-item-section side><q-icon name="add_circle_outline" /></q-item-section>
                    <q-item-section>Add Sub-Category</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="showToggleMaintenance(props.node)"
                  >
                    <q-item-section side><q-icon name="build_circle" /></q-item-section>
                    <q-item-section>
                      {{ props.node.color === "green" ? "Disable Maintenance Mode" : "Enable Maintenance Mode" }}
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="$emit('installAgent', props.node)"
                  >
                    <q-item-section side><q-icon name="download" /></q-item-section>
                    <q-item-section>Install Agent</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="showPolicyAdd(props.node)"
                  >
                    <q-item-section side><q-icon name="rule" /></q-item-section>
                    <q-item-section>Assign Automation Policy</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="showAlertTemplateAdd(props.node)"
                  >
                    <q-item-section side><q-icon name="warning_amber" /></q-item-section>
                    <q-item-section>Assign Alert Template</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="runChecks(props.node)"
                  >
                    <q-item-section side><q-icon name="check_circle_outline" /></q-item-section>
                    <q-item-section>Run Checks</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item
                    v-if="!clStore.isHidden(props.node.raw)"
                    clickable
                    v-close-popup
                    @click="clStore.hideClient(props.node.raw)"
                  >
                    <q-item-section side><q-icon name="visibility_off" color="warning" /></q-item-section>
                    <q-item-section>Hide</q-item-section>
                  </q-item>
                  <q-item
                    v-else
                    clickable
                    v-close-popup
                    @click="clStore.showClient(props.node.raw)"
                  >
                    <q-item-section side><q-icon name="visibility" color="positive" /></q-item-section>
                    <q-item-section>Restore</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup>
                    <q-item-section>Close</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </template>
        </q-tree>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { useClientsStore } from "@/stores/clients";
import { useAgentsStore } from "@/stores/agents";
import { useClientListStore } from "@/stores/clientList";
import { useNotification } from "@/composables/useNotification";

import SitesForm from "@/components/clients/SitesForm.vue";
import DeleteClient from "@/components/clients/DeleteClient.vue";
import PolicyAdd from "@/components/automation/modals/PolicyAdd.vue";
import AlertTemplateAdd from "@/components/modals/alerts/AlertTemplateAdd.vue";

interface TreeNode {
  id: number;
  label: string;
  raw: string;
  color?: string;
  children?: TreeNode[];
  site?: Record<string, unknown>;
  [key: string]: unknown;
}

defineEmits<{
  installAgent: [node: TreeNode];
}>();

const $q = useQuasar();
const clientsStore = useClientsStore();
const agentsStore = useAgentsStore();
const clStore = useClientListStore();
const { notifySuccess } = useNotification();

const selectedTree = computed({
  get: () => clientsStore.selectedTree,
  set: (val: string) => clientsStore.setSelectedTree(val),
});

function clearTreeSelected() {
  agentsStore.refreshDashboard(true);
}

function showEditModal(node: TreeNode) {
  $q.dialog({
    component: SitesForm,
    componentProps: { site: node.site },
  }).onOk(() => clientsStore.loadTree());
}

function showDeleteModal(node: TreeNode) {
  if (node.site.agent_count > 0) {
    $q.dialog({
      component: DeleteClient,
      componentProps: {
        object: node.site,
        type: "site",
      },
    }).onOk(clearTreeSelected);
  } else {
    $q.dialog({
      title: "Are you sure?",
      message: `Delete category: ${node.label}.`,
      cancel: true,
      ok: { label: "Delete", color: "negative" },
    }).onOk(async () => {
      $q.loading.show();
      try {
        const { data } = await axios.delete(`/clients/sites/${node.master_id}/`);
        notifySuccess(data);
        clearTreeSelected();
      } catch (e) {
        console.error(e);
      }
      $q.loading.hide();
    });
  }
}

function showAddSiteModal(node: TreeNode) {
  $q.dialog({
    component: SitesForm,
    componentProps: { parent: node.id },
  }).onOk(() => clientsStore.loadTree());
}

function showPolicyAdd(node: TreeNode) {
  $q.dialog({
    component: PolicyAdd,
    componentProps: {
      type: "site",
      object: node.site,
    },
  }).onOk(() => clientsStore.loadTree());
}

function showAlertTemplateAdd(node: TreeNode) {
  $q.dialog({
    component: AlertTemplateAdd,
    componentProps: {
      type: "site",
      object: node.site,
    },
  }).onOk(() => agentsStore.refreshDashboard());
}

function showToggleMaintenance(node: TreeNode) {
  const data = {
    id: node.id,
    type: node.raw.split("|")[0],
    action: node.color !== "green",
  };

  axios
    .post("/agents/maintenance/bulk/", data)
    .then((r) => {
      notifySuccess(r.data);
      agentsStore.refreshDashboard();
    })
    .catch(console.error);
}

function runChecks(node: TreeNode) {
  axios
    .post(`/checks/site/${node.id}/csbulkrun/`)
    .then((r) => notifySuccess(r.data))
    .catch(console.error);
}
</script>

<style scoped>
.uk-tree-panel {
  height: 100%;
}

.uk-tree-panel__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
}

.uk-tree-panel__content {
  height: 100%;
  overflow-y: auto;
  padding: var(--uk-space-2);
}

/* Hide button appears on hover, always visible in hidden mode */
.tree-hide-btn {
  opacity: 0.3;
  transition: opacity 0.15s ease;
}

.tree-node-row:hover .tree-hide-btn {
  opacity: 1;
}
</style>
