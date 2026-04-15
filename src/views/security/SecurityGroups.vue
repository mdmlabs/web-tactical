<template>
  <div class="security-groups">
    <!-- Unavailable banner -->
    <q-banner v-if="!wazuhStore.isAvailable" class="bg-warning text-dark q-mb-md" rounded>
      <template #avatar><q-icon name="warning" color="dark" /></template>
      Wazuh API is currently unavailable.
      <template #action><q-btn flat label="Retry" @click="loadGroups" /></template>
    </q-banner>

    <!-- ===== CONFIG EDITOR VIEW ===== -->
    <template v-if="editingGroup">
      <div class="sg-editor-header">
        <q-btn flat dense round icon="arrow_back" @click="closeEditor" />
        <span class="sg-editor-breadcrumb">
          agent.conf of <strong>{{ editingGroup }}</strong> group
        </span>
        <q-space />
        <q-btn
          no-caps
          unelevated
          color="primary"
          label="Save"
          icon="save"
          :disable="!configChanged"
          :loading="savingConfig"
          @click="doSaveConfig"
        />
      </div>
      <div ref="monacoContainer" class="sg-monaco-container" />
    </template>

    <!-- ===== MAIN TABLE VIEW ===== -->
    <template v-else>
      <!-- Header -->
      <div class="sg-header">
        <div>
          <div class="sg-header__title">Groups ({{ wazuhStore.groups.length }})</div>
          <div class="sg-header__subtitle">Manage agent groups, their configuration and assigned agents</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="sg-toolbar">
        <q-input
          v-model="searchText"
          dense
          outlined
          placeholder="Search groups..."
          class="sg-search"
          clearable
        >
          <template #prepend><q-icon name="search" size="18px" /></template>
        </q-input>
        <q-space />
        <q-btn flat dense no-caps icon="add" label="Add new group" color="primary" @click="showCreateDialog = true" />
        <q-btn flat dense icon="refresh" color="grey-7" :loading="wazuhStore.groupsLoading" @click="loadGroups">
          <q-tooltip>Refresh</q-tooltip>
        </q-btn>
        <q-btn-dropdown flat dense icon="download" color="grey-7" no-caps label="Export">
          <q-list dense>
            <q-item clickable v-close-popup @click="exportJSON">
              <q-item-section>JSON</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportCSV">
              <q-item-section>CSV</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <!-- Groups Table -->
      <div class="sg-card">
        <q-table
          :rows="filteredGroups"
          :columns="columns"
          row-key="name"
          flat
          dense
          :loading="wazuhStore.groupsLoading"
          :pagination="pagination"
          @update:pagination="pagination = $event"
          class="sg-table"
          separator="horizontal"
        >
          <!-- Name (clickable) -->
          <template #body-cell-name="props">
            <q-td :props="props">
              <span class="sg-name-link" @click="navigateToGroup(props.row.name)">
                {{ props.row.name }}
              </span>
            </q-td>
          </template>

          <!-- Agents count -->
          <template #body-cell-count="props">
            <q-td :props="props">
              <q-badge color="blue-grey-2" text-color="blue-grey-9" :label="String(props.row.count)" />
            </q-td>
          </template>

          <!-- Checksum -->
          <template #body-cell-configSum="props">
            <q-td :props="props">
              <span class="text-grey-7 sg-mono">{{ props.row.configSum || '—' }}</span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense size="sm" icon="visibility" color="primary" @click="navigateToGroup(props.row.name)">
                <q-tooltip>View group details</q-tooltip>
              </q-btn>
              <q-btn flat round dense size="sm" icon="edit" color="grey-7" @click="openConfigEditor(props.row.name)">
                <q-tooltip>Edit configuration</q-tooltip>
              </q-btn>
              <q-btn
                flat round dense size="sm" icon="delete" color="negative"
                :disable="props.row.name === 'default'"
                @click="confirmDeleteGroup(props.row.name)"
              >
                <q-tooltip>{{ props.row.name === 'default' ? 'Cannot delete default group' : 'Delete group' }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </template>

    <!-- ===== Agents Side Panel (Dialog) ===== -->
    <q-dialog v-model="showAgentsPanel" position="right" maximized>
      <q-card class="sg-agents-panel">
        <q-card-section class="row items-center no-wrap q-pb-sm">
          <q-icon name="folder" color="amber-8" size="24px" class="q-mr-sm" />
          <div class="text-h6">{{ panelGroupName }}</div>
          <q-space />
          <q-btn flat round dense icon="person_add" color="primary" @click="showAddAgentDialog = true">
            <q-tooltip>Add agent to group</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-table
            :rows="wazuhStore.groupAgents"
            :columns="agentColumns"
            row-key="id"
            flat
            dense
            :loading="wazuhStore.groupAgentsLoading"
            :pagination="{ rowsPerPage: 20 }"
            separator="horizontal"
            no-data-label="No agents in this group"
            class="sg-table"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.status === 'active' ? 'green' : props.row.status === 'disconnected' ? 'red' : 'grey'"
                  :label="props.row.status"
                  class="text-capitalize"
                />
              </q-td>
            </template>
            <template #body-cell-os="props">
              <q-td :props="props">
                {{ props.row.os?.name ?? 'Unknown' }}
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round dense size="sm" icon="person_remove" color="negative" @click="confirmRemoveAgent(props.row)">
                  <q-tooltip>Remove from group</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ===== Create Group Dialog ===== -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Create New Group</div></q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="newGroupName"
            dense outlined label="Group name" autofocus
            :rules="[
              (v: string) => !!v || 'Group name is required',
              (v: string) => /^[a-zA-Z0-9._-]+$/.test(v) || 'Only letters, numbers, dots, hyphens, underscores',
            ]"
            @keyup.enter="doCreateGroup"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create" color="primary" :loading="creatingGroup" :disable="!newGroupName.trim()" @click="doCreateGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Delete Confirm Dialog ===== -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Delete Group</div></q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to delete group <strong>"{{ groupToDelete }}"</strong>?
          All agents will be removed from this group.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" :loading="deletingGroup" @click="doDeleteGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Add Agent to Group Dialog ===== -->
    <q-dialog v-model="showAddAgentDialog">
      <q-card style="min-width: 450px">
        <q-card-section><div class="text-h6">Add Agent to "{{ panelGroupName }}"</div></q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            v-model="agentToAdd"
            :options="availableAgentsOptions"
            dense outlined use-input input-debounce="200"
            label="Select agent"
            option-label="label" option-value="value"
            emit-value map-options
            @filter="filterAvailableAgents"
          >
            <template #no-option>
              <q-item><q-item-section class="text-grey">No agents available</q-item-section></q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" :loading="addingAgent" :disable="!agentToAdd" @click="doAddAgent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Remove Agent Confirm Dialog ===== -->
    <q-dialog v-model="showRemoveAgentDialog">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Remove Agent from Group</div></q-card-section>
        <q-card-section class="q-pt-none">
          Remove agent <strong>"{{ agentToRemove?.name }}"</strong> (ID: {{ agentToRemove?.id }})
          from group <strong>"{{ panelGroupName }}"</strong>?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Remove" color="negative" :loading="removingAgent" @click="doRemoveAgent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import * as monaco from "monaco-editor";
import { useWazuhStore } from "@/stores/wazuh";
import type { WazuhAgent } from "@/types/wazuh";

const $q = useQuasar();
const router = useRouter();
const wazuhStore = useWazuhStore();

// === Table state ===
const searchText = ref("");
const pagination = ref({ rowsPerPage: 15, page: 1 });

const columns = [
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "count", label: "Agents", field: "count", align: "center" as const, sortable: true },
  { name: "configSum", label: "Configuration checksum", field: "configSum", align: "left" as const },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const, style: "width: 140px" },
];

const agentColumns = [
  { name: "id", label: "ID", field: "id", align: "left" as const, sortable: true, style: "width: 60px" },
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "ip", label: "IP", field: "ip", align: "left" as const },
  { name: "os", label: "OS", field: "os", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const, sortable: true },
  { name: "version", label: "Version", field: "version", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "center" as const, style: "width: 50px" },
];

// === Filtered groups ===
const filteredGroups = computed(() => {
  if (!searchText.value) return wazuhStore.groups;
  const q = searchText.value.toLowerCase();
  return wazuhStore.groups.filter((g) => g.name.toLowerCase().includes(q));
});

// === Navigate to group detail ===
function navigateToGroup(groupName: string) {
  router.push({ name: "SecurityGroupDetail", params: { groupName } });
}

// === Agents side panel ===
const showAgentsPanel = ref(false);
const panelGroupName = ref("");

// === Config editor (Monaco) ===
const editingGroup = ref<string | null>(null);
const monacoContainer = ref<HTMLElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
const configChanged = ref(false);
const savingConfig = ref(false);
let originalConfigText = "";

async function openConfigEditor(groupName: string) {
  editingGroup.value = groupName;

  // Fetch raw XML content of agent.conf via the file endpoint
  let xmlText = "<agent_config>\n  \n</agent_config>";
  try {
    await wazuhStore.fetchGroupFileContent(groupName, "agent.conf");
    const raw = wazuhStore.groupFileContent;
    if (raw && typeof raw === "string" && raw.trim().length > 0) {
      xmlText = raw;
    }
  } catch {
    // If file endpoint fails, try the configuration endpoint as fallback
    try {
      await wazuhStore.fetchGroupConfig(groupName);
      const configData = wazuhStore.groupConfig;
      if (typeof configData === "string") {
        xmlText = configData;
      }
    } catch {
      // Use default empty template
    }
  }

  await nextTick();

  if (!monacoContainer.value) return;

  originalConfigText = xmlText;
  configChanged.value = false;

  const isDark = $q.dark.isActive;

  editorInstance = monaco.editor.create(monacoContainer.value, {
    value: xmlText,
    language: "xml",
    theme: isDark ? "vs-dark" : "vs",
    lineNumbers: "on",
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    tabSize: 2,
  });

  editorInstance.onDidChangeModelContent(() => {
    configChanged.value = editorInstance!.getValue() !== originalConfigText;
  });
}

function closeEditor() {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
  editingGroup.value = null;
  configChanged.value = false;
}

async function doSaveConfig() {
  if (!editingGroup.value || !editorInstance) return;
  savingConfig.value = true;
  const ok = await wazuhStore.saveGroupConfig(editingGroup.value, editorInstance.getValue());
  savingConfig.value = false;
  if (ok) {
    originalConfigText = editorInstance.getValue();
    configChanged.value = false;
  }
}

// Watch dark mode changes for editor theme
watch(() => $q.dark.isActive, (dark) => {
  if (editorInstance) {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs");
  }
});

// === Create group ===
const showCreateDialog = ref(false);
const newGroupName = ref("");
const creatingGroup = ref(false);

async function doCreateGroup() {
  if (!newGroupName.value.trim()) return;
  creatingGroup.value = true;
  const ok = await wazuhStore.createGroup(newGroupName.value.trim());
  creatingGroup.value = false;
  if (ok) {
    showCreateDialog.value = false;
    newGroupName.value = "";
  }
}

// === Delete group ===
const showDeleteDialog = ref(false);
const groupToDelete = ref("");
const deletingGroup = ref(false);

function confirmDeleteGroup(name: string) {
  groupToDelete.value = name;
  showDeleteDialog.value = true;
}

async function doDeleteGroup() {
  deletingGroup.value = true;
  await wazuhStore.deleteGroup(groupToDelete.value);
  deletingGroup.value = false;
  showDeleteDialog.value = false;
}

// === Add agent ===
const showAddAgentDialog = ref(false);
const agentToAdd = ref<string | null>(null);
const addingAgent = ref(false);
const availableAgentsOptions = ref<{ label: string; value: string }[]>([]);

function filterAvailableAgents(val: string, update: (fn: () => void) => void) {
  update(() => {
    const agents = wazuhStore.wazuhAgents.filter((a) => a.id !== "000");
    const groupAgentIds = new Set(wazuhStore.groupAgents.map((a) => a.id));
    let filtered = agents.filter((a) => !groupAgentIds.has(a.id));
    if (val) {
      const s = val.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(s) || a.id.includes(s));
    }
    availableAgentsOptions.value = filtered.map((a) => ({
      label: `${a.id} — ${a.name} (${a.ip})`,
      value: a.id,
    }));
  });
}

async function doAddAgent() {
  if (!agentToAdd.value || !panelGroupName.value) return;
  addingAgent.value = true;
  const ok = await wazuhStore.addAgentToGroup(agentToAdd.value, panelGroupName.value);
  addingAgent.value = false;
  if (ok) {
    showAddAgentDialog.value = false;
    agentToAdd.value = null;
    wazuhStore.fetchGroups();
  }
}

// === Remove agent ===
const showRemoveAgentDialog = ref(false);
const agentToRemove = ref<WazuhAgent | null>(null);
const removingAgent = ref(false);

function confirmRemoveAgent(agent: WazuhAgent) {
  agentToRemove.value = agent;
  showRemoveAgentDialog.value = true;
}

async function doRemoveAgent() {
  if (!agentToRemove.value || !panelGroupName.value) return;
  removingAgent.value = true;
  const ok = await wazuhStore.removeAgentFromGroup(agentToRemove.value.id, panelGroupName.value);
  removingAgent.value = false;
  if (ok) {
    showRemoveAgentDialog.value = false;
    agentToRemove.value = null;
    wazuhStore.fetchGroups();
  }
}

// === Export ===
function exportJSON() {
  const data = JSON.stringify(wazuhStore.groups, null, 2);
  downloadFile(data, "wazuh_groups.json", "application/json");
}

function exportCSV() {
  const header = ["Name", "Agents", "Configuration checksum"];
  const rows = wazuhStore.groups.map((g) => [g.name, String(g.count), g.configSum || ""]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  downloadFile(csv, "wazuh_groups.csv", "text/csv");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// === Helpers ===
async function loadGroups() {
  await wazuhStore.fetchGroups();
  if (wazuhStore.wazuhAgents.length === 0) {
    await wazuhStore.fetchAgents();
  }
}

onMounted(() => loadGroups());

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
});
</script>

<style scoped>
.security-groups {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* ===== Header ===== */
.sg-header {
  margin-bottom: 12px;
}

.sg-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sg-header__subtitle {
  font-size: 13px;
  color: var(--mdm-text-secondary, #69707d);
  margin-top: 2px;
}

/* ===== Toolbar ===== */
.sg-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sg-search {
  width: 300px;
}

/* ===== Card ===== */
.sg-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  overflow: hidden;
}

/* ===== Table ===== */
.sg-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 10px 14px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.sg-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 14px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sg-name-link {
  color: var(--mdm-primary, #2563eb);
  cursor: pointer;
  font-weight: 600;
}

.sg-name-link:hover {
  text-decoration: underline;
}

.sg-mono {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 11px;
}

/* ===== Config Editor ===== */
.sg-editor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
}

.sg-editor-breadcrumb {
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sg-monaco-container {
  height: calc(100vh - 200px);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  overflow: hidden;
}

/* ===== Agents Side Panel ===== */
.sg-agents-panel {
  width: 700px;
  max-width: 90vw;
  height: 100vh;
}
</style>

<style>
/* ===== Dark mode ===== */
.body--dark .sg-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sg-editor-header {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sg-monaco-container {
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sg-table .q-table th {
  background: var(--mdm-bg-sidebar, #0f1729);
}

.body--dark .sg-agents-panel {
  background: var(--mdm-bg-card, #111827);
}
</style>
