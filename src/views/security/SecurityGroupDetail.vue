<template>
  <div class="sgd">
    <!-- Header -->
    <div class="sgd-header">
      <div class="sgd-header__left">
        <q-btn flat dense round icon="arrow_back" @click="goBack" />
        <span class="sgd-header__title">{{ groupName }}</span>
      </div>
      <div class="sgd-header__right">
        <q-btn
          v-if="activeTab === 'agents'"
          flat no-caps icon="folder_shared"
          label="Manage agents"
          color="primary"
          @click="showManageAgents = true"
        />
        <q-btn
          v-if="activeTab === 'agents'"
          flat no-caps icon="picture_as_pdf"
          label="Export PDF"
          color="primary"
          @click="exportAgentsPDF"
        />
        <q-btn
          v-if="activeTab === 'files'"
          flat no-caps icon="edit"
          label="Edit group configuration"
          color="primary"
          @click="openConfigEditor('agent.conf')"
        />
        <q-btn
          v-if="activeTab === 'files'"
          flat no-caps icon="picture_as_pdf"
          label="Export PDF"
          color="primary"
          @click="exportFilesPDF"
        />
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="activeTab"
      dense
      inline-label
      active-color="primary"
      indicator-color="primary"
      align="left"
      class="sgd-tabs"
    >
      <q-tab name="agents" label="Agents" />
      <q-tab name="files" label="Files" />
    </q-tabs>

    <q-separator />

    <!-- Tab Panels -->
    <q-tab-panels v-model="activeTab" animated class="sgd-panels">
      <!-- ===== AGENTS TAB ===== -->
      <q-tab-panel name="agents" class="q-pa-none">
        <div class="sgd-section">
          <div class="sgd-section__header">
            <div>
              <div class="sgd-section__title">Agents ({{ wazuhStore.groupAgents.length }})</div>
              <div class="sgd-section__subtitle">From here you can list and manage your agents</div>
            </div>
            <div class="sgd-section__actions">
              <q-btn flat dense icon="refresh" color="grey-7" :loading="wazuhStore.groupAgentsLoading" @click="refreshAgents">
                <q-tooltip>Refresh</q-tooltip>
              </q-btn>
              <q-btn flat dense no-caps icon="download" label="Export formatted" color="grey-7" @click="exportAgentsCSV" />
            </div>
          </div>

          <!-- Search -->
          <div class="sgd-search-row">
            <q-input
              v-model="agentSearch"
              dense outlined
              placeholder="Search"
              class="sgd-search"
              clearable
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-badge outline color="primary" label="WQL" class="sgd-wql-badge" />
          </div>

          <!-- Agents Table -->
          <div class="sgd-card">
            <q-table
              :rows="filteredAgents"
              :columns="agentColumns"
              row-key="id"
              flat dense
              :loading="wazuhStore.groupAgentsLoading"
              :pagination="agentPagination"
              @update:pagination="agentPagination = $event"
              separator="horizontal"
              class="sgd-table"
              no-data-label="No agents in this group"
            >
              <template #body-cell-id="props">
                <q-td :props="props">
                  <span class="sgd-id-cell">{{ props.row.id }}</span>
                </q-td>
              </template>
              <template #body-cell-os="props">
                <q-td :props="props">
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-icon
                      :name="getOSIcon(props.row.os)"
                      size="16px"
                      class="text-grey-7"
                    />
                    <span>{{ getOSLabel(props.row.os) }}</span>
                  </div>
                </q-td>
              </template>
              <template #body-cell-status="props">
                <q-td :props="props">
                  <div class="row items-center no-wrap q-gutter-xs">
                    <div
                      class="sgd-status-dot"
                      :class="{
                        'sgd-status-dot--active': props.row.status === 'active',
                        'sgd-status-dot--disconnected': props.row.status === 'disconnected',
                        'sgd-status-dot--pending': props.row.status === 'pending',
                      }"
                    />
                    <span class="text-capitalize">{{ props.row.status }}</span>
                  </div>
                </q-td>
              </template>
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat round dense size="sm" icon="visibility" color="primary">
                    <q-tooltip>View agent</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>

      <!-- ===== FILES TAB ===== -->
      <q-tab-panel name="files" class="q-pa-none">
        <div class="sgd-section">
          <div class="sgd-section__header">
            <div>
              <div class="sgd-section__title">Files ({{ wazuhStore.groupFiles.length }})</div>
              <div class="sgd-section__subtitle">From here you can list and see your group files, also, you can edit the group configuration</div>
            </div>
            <div class="sgd-section__actions">
              <q-btn flat dense icon="refresh" color="grey-7" :loading="wazuhStore.groupFilesLoading" @click="refreshFiles">
                <q-tooltip>Refresh</q-tooltip>
              </q-btn>
              <q-btn flat dense no-caps icon="download" label="Export formatted" color="grey-7" @click="exportFilesCSV" />
            </div>
          </div>

          <!-- Search -->
          <div class="sgd-search-row">
            <q-input
              v-model="fileSearch"
              dense outlined
              placeholder="Search"
              class="sgd-search"
              clearable
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-badge outline color="primary" label="WQL" class="sgd-wql-badge" />
          </div>

          <!-- Files Table -->
          <div class="sgd-card">
            <q-table
              :rows="filteredFiles"
              :columns="fileColumns"
              row-key="filename"
              flat dense
              :loading="wazuhStore.groupFilesLoading"
              :pagination="filePagination"
              @update:pagination="filePagination = $event"
              separator="horizontal"
              class="sgd-table"
              no-data-label="No files in this group"
            >
              <template #body-cell-hash="props">
                <q-td :props="props">
                  <span class="sgd-mono text-grey-7">{{ props.row.hash || '-' }}</span>
                </q-td>
              </template>
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat round dense size="sm" icon="visibility" color="primary" @click="viewFileContent(props.row)">
                    <q-tooltip>See file content</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.filename === 'agent.conf'"
                    flat round dense size="sm" icon="edit" color="grey-7"
                    @click="openConfigEditor(props.row.filename)"
                  >
                    <q-tooltip>Edit file</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- ===== MANAGE AGENTS DIALOG ===== -->
    <q-dialog v-model="showManageAgents" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="sgd-manage-card">
        <q-card-section class="row items-center no-wrap q-pb-sm sgd-manage-header">
          <q-btn flat dense round icon="arrow_back" @click="cancelManageAgents" />
          <div class="text-h6 q-ml-sm">Manage agents of group {{ groupName }}</div>
          <q-space />
          <q-btn
            unelevated no-caps
            color="primary"
            label="Apply changes"
            :disable="pendingAdds.length === 0 && pendingRemoves.length === 0"
            :loading="applyingChanges"
            @click="applyAgentChanges"
          />
        </q-card-section>
        <q-separator />

        <q-card-section class="sgd-manage-body">
          <!-- Available agents (left) -->
          <div class="sgd-manage-panel">
            <div class="sgd-manage-panel__header">
              <span class="text-subtitle1 text-weight-bold">Available agents</span>
              <q-btn flat round dense size="sm" icon="refresh" :loading="loadingAllAgents" @click="refreshAllAgents">
                <q-tooltip>Refresh</q-tooltip>
              </q-btn>
            </div>
            <q-input
              v-model="availableFilter"
              dense outlined
              placeholder="Filter..."
              class="q-mb-sm"
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-scroll-area class="sgd-manage-list">
              <q-list dense>
                <q-item
                  v-for="agent in filteredAvailableAgents"
                  :key="agent.id"
                  clickable
                  :active="selectedAvailable.has(agent.id)"
                  active-class="bg-blue-1"
                  @click="toggleSelection(selectedAvailable, agent.id)"
                >
                  <q-item-section>{{ agent.id }} - {{ agent.name }}</q-item-section>
                </q-item>
                <q-item v-if="filteredAvailableAgents.length === 0">
                  <q-item-section class="text-grey text-center">No available agents</q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>

          <!-- Action buttons (center) -->
          <div class="sgd-manage-actions">
            <div class="sgd-manage-action-btn" @click="addAllItems">
              <q-icon name="fast_forward" size="24px" color="primary" />
              <span class="text-caption">Add all items</span>
            </div>
            <div class="sgd-manage-action-btn" @click="addSelectedItems">
              <q-icon name="chevron_right" size="24px" color="primary" />
              <span class="text-caption">Add selected items</span>
            </div>
            <div class="sgd-manage-action-btn" @click="removeSelectedItems">
              <q-icon name="chevron_left" size="24px" color="primary" />
              <span class="text-caption">Remove selected items</span>
            </div>
            <div class="sgd-manage-action-btn" @click="removeAllItems">
              <q-icon name="replay" size="24px" color="primary" />
              <span class="text-caption">Remove all items</span>
            </div>
          </div>

          <!-- Current agents (right) -->
          <div class="sgd-manage-panel">
            <div class="sgd-manage-panel__header">
              <span class="text-subtitle1 text-weight-bold">
                Current agents in the group ({{ currentGroupAgentsList.length }})
              </span>
              <div class="row q-gutter-xs">
                <q-badge color="green" :label="`Added: ${pendingAdds.length}`" />
                <q-badge color="red" :label="`Removed: ${pendingRemoves.length}`" />
              </div>
            </div>
            <q-input
              v-model="currentFilter"
              dense outlined
              placeholder="Filter..."
              class="q-mb-sm"
            >
              <template #prepend><q-icon name="search" size="18px" /></template>
            </q-input>
            <q-scroll-area class="sgd-manage-list">
              <q-list dense>
                <q-item
                  v-for="agent in filteredCurrentAgents"
                  :key="agent.id"
                  clickable
                  :active="selectedCurrent.has(agent.id)"
                  active-class="bg-blue-1"
                  @click="toggleSelection(selectedCurrent, agent.id)"
                >
                  <q-item-section>{{ agent.id }} - {{ agent.name }}</q-item-section>
                </q-item>
                <q-item v-if="filteredCurrentAgents.length === 0">
                  <q-item-section class="text-grey text-center">No agents in this group</q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ===== FILE CONTENT DIALOG ===== -->
    <q-dialog v-model="showFileContent" position="standard">
      <q-card style="min-width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center no-wrap q-pb-sm">
          <q-icon name="description" color="primary" size="24px" class="q-mr-sm" />
          <div>
            <div class="text-h6">{{ viewingFileName }} of {{ groupName }} group</div>
            <div v-if="viewingFileHash" class="text-caption text-grey-6 sgd-mono">
              Checksum: {{ viewingFileHash }}
            </div>
          </div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <div v-if="wazuhStore.groupFileContentLoading" class="column items-center justify-center q-pa-lg">
            <q-spinner color="primary" size="2em" />
            <div class="text-caption text-grey-6 q-mt-sm">Loading file content...</div>
          </div>
          <div v-else-if="fileContentError" class="column items-center justify-center q-pa-lg text-negative">
            <q-icon name="error" size="2rem" class="q-mb-sm" />
            <div class="text-caption">{{ fileContentError }}</div>
          </div>
          <div v-else-if="!wazuhStore.groupFileContent" class="column items-center justify-center q-pa-lg text-grey-6">
            <q-icon name="insert_drive_file" size="2rem" class="q-mb-sm" />
            <div class="text-caption">File is empty</div>
          </div>
          <pre v-else class="sgd-file-content">{{ wazuhStore.groupFileContent }}</pre>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ===== CONFIG EDITOR DIALOG ===== -->
    <q-dialog v-model="showConfigEditor" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="sgd-editor-card">
        <q-card-section class="row items-center no-wrap q-pb-sm sgd-editor-header">
          <q-btn flat dense round icon="arrow_back" @click="closeConfigEditor" />
          <div class="q-ml-sm">
            <div class="text-h6">Edit {{ editingFileName }} of {{ groupName }} group</div>
          </div>
          <q-space />
          <q-btn
            no-caps unelevated
            color="primary"
            label="Save"
            icon="save"
            :disable="!configChanged"
            :loading="savingConfig"
            @click="doSaveConfig"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none sgd-editor-body">
          <div v-if="editorLoading" class="column items-center justify-center q-pa-lg" style="height: 100%;">
            <q-spinner color="primary" size="2em" />
            <div class="text-caption text-grey-6 q-mt-sm">Loading configuration...</div>
          </div>
          <div v-else ref="monacoContainer" class="sgd-monaco-container" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, reactive, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import * as monaco from "monaco-editor";
import { useWazuhStore } from "@/stores/wazuh";
import type { WazuhAgent, WazuhGroupFile } from "@/types/wazuh";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const wazuhStore = useWazuhStore();

const groupName = computed(() => route.params.groupName as string);
const activeTab = ref("agents");

// === Agent tab state ===
const agentSearch = ref("");
const agentPagination = ref({ rowsPerPage: 15, page: 1 });

const agentColumns = [
  { name: "id", label: "Id", field: "id", align: "left" as const, sortable: true, style: "width: 60px" },
  { name: "name", label: "Name", field: "name", align: "left" as const, sortable: true },
  { name: "ip", label: "IP address", field: "ip", align: "left" as const },
  { name: "os", label: "Operating system", field: "os", align: "left" as const },
  { name: "version", label: "Version", field: "version", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "left" as const, sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const, style: "width: 60px" },
];

const filteredAgents = computed(() => {
  if (!agentSearch.value) return wazuhStore.groupAgents;
  const q = agentSearch.value.toLowerCase();
  return wazuhStore.groupAgents.filter(
    (a) =>
      a.id.includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.ip.toLowerCase().includes(q) ||
      (a.os?.name ?? "").toLowerCase().includes(q),
  );
});

// === Files tab state ===
const fileSearch = ref("");
const filePagination = ref({ rowsPerPage: 15, page: 1 });

const fileColumns = [
  { name: "filename", label: "File", field: "filename", align: "left" as const, sortable: true },
  { name: "hash", label: "Checksum", field: "hash", align: "left" as const },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const, style: "width: 100px" },
];

const filteredFiles = computed(() => {
  if (!fileSearch.value) return wazuhStore.groupFiles;
  const q = fileSearch.value.toLowerCase();
  return wazuhStore.groupFiles.filter((f) => f.filename.toLowerCase().includes(q));
});

// === File content viewer ===
const showFileContent = ref(false);
const viewingFileName = ref("");
const viewingFileHash = ref("");
const fileContentError = ref("");

function viewFileContent(file: WazuhGroupFile) {
  viewingFileName.value = file.filename;
  viewingFileHash.value = file.hash || "";
  fileContentError.value = "";
  showFileContent.value = true;

  wazuhStore.fetchGroupFileContent(groupName.value, file.filename).catch((err: Error) => {
    fileContentError.value = err?.message || `Failed to load content for "${file.filename}"`;
  });
}

// === Config editor (Monaco) ===
const showConfigEditor = ref(false);
const editingFileName = ref("");
const monacoContainer = ref<HTMLElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
const configChanged = ref(false);
const savingConfig = ref(false);
const editorLoading = ref(false);
let originalConfigText = "";

async function openConfigEditor(filename: string) {
  editingFileName.value = filename;
  editorLoading.value = true;
  showConfigEditor.value = true;

  let content = "";
  try {
    await wazuhStore.fetchGroupFileContent(groupName.value, filename);
    content = wazuhStore.groupFileContent || "";
  } catch {
    // Ignore error, will use empty template
  }

  if (!content) {
    content = "<agent_config>\n  \n</agent_config>";
  }

  originalConfigText = content;
  configChanged.value = false;
  editorLoading.value = false;

  await nextTick();

  if (!monacoContainer.value) return;

  const isDark = $q.dark.isActive;

  editorInstance = monaco.editor.create(monacoContainer.value, {
    value: content,
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

function closeConfigEditor() {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
  showConfigEditor.value = false;
  editingFileName.value = "";
  configChanged.value = false;
}

async function doSaveConfig() {
  if (!editingFileName.value || !editorInstance) return;
  savingConfig.value = true;
  const ok = await wazuhStore.saveGroupConfig(groupName.value, editorInstance.getValue());
  savingConfig.value = false;
  if (ok) {
    originalConfigText = editorInstance.getValue();
    configChanged.value = false;
    // Refresh files list to update checksums
    await wazuhStore.fetchGroupFiles(groupName.value);
  }
}

// === Manage agents ===
const showManageAgents = ref(false);
const availableFilter = ref("");
const currentFilter = ref("");
const selectedAvailable = reactive(new Set<string>());
const selectedCurrent = reactive(new Set<string>());
const loadingAllAgents = ref(false);
const applyingChanges = ref(false);

// Track pending changes (agent IDs to add/remove)
const pendingAdds = ref<string[]>([]);
const pendingRemoves = ref<string[]>([]);

// Snapshot of the original group agents at the time the dialog opened
const originalGroupAgentIds = ref<Set<string>>(new Set());
// Working set: current agent IDs in the group (including pending changes)
const workingGroupAgentIds = ref<Set<string>>(new Set());

// All agents not in working group
const availableAgentsList = computed(() => {
  return wazuhStore.wazuhAgents.filter(
    (a) => a.id !== "000" && !workingGroupAgentIds.value.has(a.id),
  );
});

// All agents in working group
const currentGroupAgentsList = computed((): { id: string; name: string }[] => {
  const ids = workingGroupAgentIds.value;
  const agentMap = new Map(wazuhStore.wazuhAgents.map((a) => [a.id, a]));
  return [...ids]
    .map((id) => {
      const agent = agentMap.get(id);
      return { id, name: agent?.name ?? "Unknown" };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
});

const filteredAvailableAgents = computed(() => {
  if (!availableFilter.value) return availableAgentsList.value;
  const q = availableFilter.value.toLowerCase();
  return availableAgentsList.value.filter(
    (a) => a.id.includes(q) || a.name.toLowerCase().includes(q),
  );
});

const filteredCurrentAgents = computed(() => {
  if (!currentFilter.value) return currentGroupAgentsList.value;
  const q = currentFilter.value.toLowerCase();
  return currentGroupAgentsList.value.filter(
    (a) => a.id.includes(q) || a.name.toLowerCase().includes(q),
  );
});

function toggleSelection(set: Set<string>, id: string) {
  if (set.has(id)) set.delete(id);
  else set.add(id);
}

function recalcPending() {
  const adds: string[] = [];
  const removes: string[] = [];
  for (const id of workingGroupAgentIds.value) {
    if (!originalGroupAgentIds.value.has(id)) adds.push(id);
  }
  for (const id of originalGroupAgentIds.value) {
    if (!workingGroupAgentIds.value.has(id)) removes.push(id);
  }
  pendingAdds.value = adds;
  pendingRemoves.value = removes;
}

function addSelectedItems() {
  for (const id of selectedAvailable) {
    workingGroupAgentIds.value.add(id);
  }
  selectedAvailable.clear();
  recalcPending();
}

function addAllItems() {
  for (const agent of availableAgentsList.value) {
    workingGroupAgentIds.value.add(agent.id);
  }
  selectedAvailable.clear();
  recalcPending();
}

function removeSelectedItems() {
  for (const id of selectedCurrent) {
    workingGroupAgentIds.value.delete(id);
  }
  selectedCurrent.clear();
  recalcPending();
}

function removeAllItems() {
  workingGroupAgentIds.value.clear();
  selectedCurrent.clear();
  recalcPending();
}

function cancelManageAgents() {
  showManageAgents.value = false;
  resetManageState();
}

function resetManageState() {
  selectedAvailable.clear();
  selectedCurrent.clear();
  availableFilter.value = "";
  currentFilter.value = "";
  pendingAdds.value = [];
  pendingRemoves.value = [];
}

async function refreshAllAgents() {
  loadingAllAgents.value = true;
  await wazuhStore.fetchAgents();
  loadingAllAgents.value = false;
}

// Open manage agents: snapshot current state
function openManageAgents() {
  const ids = new Set(wazuhStore.groupAgents.map((a) => a.id));
  originalGroupAgentIds.value = new Set(ids);
  workingGroupAgentIds.value = new Set(ids);
  resetManageState();
}

async function applyAgentChanges() {
  applyingChanges.value = true;
  const gName = groupName.value;

  // Add agents
  for (const id of pendingAdds.value) {
    await wazuhStore.addAgentToGroup(id, gName);
  }
  // Remove agents
  for (const id of pendingRemoves.value) {
    await wazuhStore.removeAgentFromGroup(id, gName);
  }

  applyingChanges.value = false;
  showManageAgents.value = false;
  resetManageState();

  // Refresh
  await Promise.all([
    wazuhStore.fetchGroupAgents(gName),
    wazuhStore.fetchGroups(),
  ]);
}

// Watch dialog open
watch(showManageAgents, (val) => {
  if (val) openManageAgents();
});

// Watch dark mode changes for editor theme
watch(() => $q.dark.isActive, (dark) => {
  if (editorInstance) {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs");
  }
});

// === Helpers ===
function getOSIcon(os: WazuhAgent["os"]): string {
  if (!os?.platform) return "devices";
  const p = os.platform.toLowerCase();
  if (p.includes("windows") || os.name?.toLowerCase().includes("windows")) return "fa-brands fa-windows";
  if (p.includes("linux") || p.includes("ubuntu") || p.includes("centos") || p.includes("amazon")) return "fa-brands fa-linux";
  if (p.includes("darwin") || p.includes("macos")) return "fa-brands fa-apple";
  return "devices";
}

function getOSLabel(os: WazuhAgent["os"]): string {
  if (!os) return "Unknown";
  const parts = [os.name, os.version].filter(Boolean);
  return parts.join(" ") || "Unknown";
}

function goBack() {
  router.push({ name: "SecurityGroups" });
}

function refreshAgents() {
  wazuhStore.fetchGroupAgents(groupName.value);
}

function refreshFiles() {
  wazuhStore.fetchGroupFiles(groupName.value);
}

// === Export helpers ===
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportAgentsCSV() {
  const header = ["Id", "Name", "IP address", "Operating system", "Version", "Status"];
  const rows = wazuhStore.groupAgents.map((a) => [
    a.id, a.name, a.ip, getOSLabel(a.os), a.version, a.status,
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  downloadFile(csv, `group_${groupName.value}_agents.csv`, "text/csv");
}

function exportFilesCSV() {
  const header = ["File", "Checksum"];
  const rows = wazuhStore.groupFiles.map((f) => [f.filename, f.hash || ""]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  downloadFile(csv, `group_${groupName.value}_files.csv`, "text/csv");
}

function exportAgentsPDF() {
  // Fallback to CSV export
  exportAgentsCSV();
}

function exportFilesPDF() {
  // Fallback to CSV export
  exportFilesCSV();
}

// === Lifecycle ===
async function loadData() {
  const gName = groupName.value;
  if (!gName) return;
  await Promise.all([
    wazuhStore.fetchGroupAgents(gName),
    wazuhStore.fetchGroupFiles(gName),
  ]);
  if (wazuhStore.wazuhAgents.length === 0) {
    await wazuhStore.fetchAgents();
  }
}

onMounted(() => loadData());

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
    editorInstance = null;
  }
});

defineExpose({ loadData });
</script>

<style scoped>
.sgd {
  padding: 16px;
  background: var(--mdm-bg, #f5f5f5);
  min-height: 100%;
}

/* Header */
.sgd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.sgd-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sgd-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sgd-header__right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Tabs */
.sgd-tabs {
  margin-bottom: 0;
}

.sgd-panels {
  background: transparent;
}

/* Section */
.sgd-section {
  padding-top: 16px;
}

.sgd-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sgd-section__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sgd-section__subtitle {
  font-size: 13px;
  color: var(--mdm-text-secondary, #69707d);
  margin-top: 2px;
}

.sgd-section__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Search row */
.sgd-search-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sgd-search {
  flex: 1;
}

.sgd-wql-badge {
  cursor: pointer;
  font-size: 11px;
  padding: 4px 8px;
}

/* Card */
.sgd-card {
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  overflow: hidden;
}

/* Table */
.sgd-table :deep(.q-table th) {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: var(--mdm-text-secondary, #69707d);
  text-transform: uppercase;
  padding: 10px 14px;
  background: var(--mdm-bg-sidebar, #fafbfc);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.sgd-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 10px 14px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.sgd-id-cell {
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sgd-mono {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 11px;
}

/* Status dot */
.sgd-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9e9e9e;
}

.sgd-status-dot--active {
  background: #4caf50;
}

.sgd-status-dot--disconnected {
  background: #f44336;
}

.sgd-status-dot--pending {
  background: #ff9800;
}

/* File content viewer */
.sgd-file-content {
  margin: 0;
  padding: 16px;
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 12px;
  line-height: 1.6;
  background: var(--mdm-bg-sidebar, #fafbfc);
  color: var(--mdm-text-primary, #1a1a1a);
  max-height: 60vh;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ===== Config editor dialog ===== */
.sgd-editor-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sgd-editor-header {
  background: var(--mdm-bg-card, #fff);
}

.sgd-editor-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.sgd-monaco-container {
  width: 100%;
  height: 100%;
}

/* ===== Manage agents dialog ===== */
.sgd-manage-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sgd-manage-header {
  background: var(--mdm-bg-card, #fff);
}

.sgd-manage-body {
  flex: 1;
  display: flex;
  gap: 0;
  overflow: hidden;
  padding: 16px;
}

.sgd-manage-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--mdm-border-light, #e8ecf0);
  border-radius: 10px;
  padding: 12px;
  background: var(--mdm-bg-card, #fff);
}

.sgd-manage-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sgd-manage-list {
  flex: 1;
  min-height: 0;
}

.sgd-manage-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 16px;
  min-width: 120px;
}

.sgd-manage-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.sgd-manage-action-btn:hover {
  background: var(--mdm-bg-hover, #f0f4ff);
}

.sgd-manage-action-btn .text-caption {
  color: var(--mdm-text-secondary, #69707d);
  font-size: 11px;
  text-align: center;
}
</style>

<style>
/* Dark mode */
.body--dark .sgd {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .sgd-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sgd-table .q-table th {
  background: var(--mdm-bg-sidebar, #0f1729);
}

.body--dark .sgd-file-content {
  background: var(--mdm-bg-sidebar, #0f1729);
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sgd-manage-card {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .sgd-manage-header {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .sgd-manage-panel {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sgd-manage-action-btn:hover {
  background: rgba(37, 99, 235, 0.1);
}

.body--dark .sgd-editor-card {
  background: var(--mdm-bg, #0b0e14);
}

.body--dark .sgd-editor-header {
  background: var(--mdm-bg-card, #111827);
}
</style>
