<template>
  <div class="connectivity-policies-tab">
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div v-if="!fixedTarget" class="col-12 col-md-3">
        <q-select
          v-model="selectedTargetType"
          :options="targetTypeOptions"
          emit-value
          map-options
          outlined
          dense
          label="Target type"
        />
      </div>

      <div
        v-if="!fixedTarget && selectedTargetType !== 'all'"
        class="col-12 col-md-4"
      >
        <q-select
          v-model="selectedTargetValue"
          :options="currentTargetOptions"
          emit-value
          map-options
          use-input
          fill-input
          input-debounce="0"
          outlined
          dense
          clearable
          label="Target"
        />
      </div>

      <div v-if="fixedTarget" class="col-12 col-md">
        <q-chip color="primary" text-color="white" icon="link">
          {{ fixedTargetLabel }}
        </q-chip>
      </div>

      <div class="col-12 col-md">
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          label="Search"
          placeholder="By target or values"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-auto">
        <q-toggle
          v-model="enabledOnly"
          label="Enabled only"
          color="primary"
        />
      </div>

      <div class="col-auto row q-gutter-sm">
        <q-btn
          flat
          dense
          icon="refresh"
          color="primary"
          :loading="loading"
          @click="loadPolicies"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Add"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <q-table
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :loading="loading"
      :pagination="{ rowsPerPage: compact ? 5 : 15 }"
      class="connectivity-policies-tab__table"
    >
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-lg text-grey-6">
          Connectivity policies not found
        </div>
      </template>

      <template v-slot:body-cell-target="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.targetLabel }}</div>
          <div class="text-caption text-grey-7">
            {{ targetTypeLabel(props.row.type) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-severity="props">
        <q-td :props="props">
          <q-badge color="orange-8" outline>
            {{ severityLabel(props.row.severity) }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-toggle
            :model-value="props.row.isEnabled"
            color="positive"
            @update:model-value="onToggleEnabled(props.row, $event)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            flat
            round
            dense
            icon="edit"
            color="primary"
            @click="openEditDialog(props.row)"
          />
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="removePolicy(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 520px; max-width: 92vw">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ editingPolicy ? "Edit connectivity policy" : "Create connectivity policy" }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div v-if="!fixedTarget" class="col-12 col-md-5">
              <q-select
                v-model="form.targetType"
                :options="targetFormOptions"
                emit-value
                map-options
                outlined
                dense
                label="Target type"
              />
            </div>

            <div v-if="!fixedTarget" class="col-12 col-md-7">
              <q-select
                v-model="form.targetValue"
                :options="formTargetOptions"
                emit-value
                map-options
                use-input
                fill-input
                input-debounce="0"
                outlined
                dense
                clearable
                label="Target"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.intervalSeconds"
                type="number"
                min="0"
                outlined
                dense
                label="Interval, sec"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.graceSeconds"
                type="number"
                min="0"
                outlined
                dense
                label="Grace, sec"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.severity"
                type="number"
                min="0"
                outlined
                dense
                label="Severity"
              />
            </div>

            <div class="col-12 col-md-6 flex items-center">
              <q-toggle v-model="form.isEnabled" color="primary" label="Enabled" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save"
            :loading="saving"
            @click="submitForm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import { notifyError, notifySuccess } from "@/utils/notify";
import {
  agentCategoryClient,
  agentServiceClientWrapper,
  userControlClient,
} from "@/gpo/api/grpc-client";
import {
  connectivityPolicyClient,
  type ConnectivityPolicyInput,
  type ConnectivityPolicyRecord,
  type ConnectivityPolicyTarget,
  type ConnectivityTargetKind,
} from "@/gpo/api/connectivity-policy";

interface TargetOption {
  label: string;
  value: string | number;
}

type TargetValue = string | number | null;

interface ConnectivityRow extends ConnectivityPolicyRecord {
  targetLabel: string;
}

const props = withDefaults(
  defineProps<{
    fixedTarget?: ConnectivityPolicyTarget | null;
    compact?: boolean;
  }>(),
  {
    fixedTarget: null,
    compact: false,
  },
);

const emit = defineEmits<{
  (e: "changed"): void;
}>();

const $q = useQuasar();
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const editingPolicy = ref<ConnectivityRow | null>(null);
const rows = ref<ConnectivityRow[]>([]);
const enabledOnly = ref(false);
const search = ref("");
const selectedTargetType = ref<"all" | ConnectivityTargetKind>(
  props.fixedTarget?.type ?? "all",
);
const selectedTargetValue = ref<TargetValue>(null);

const allAgents = ref<TargetOption[]>([]);
const allCategories = ref<TargetOption[]>([]);
const allUsers = ref<TargetOption[]>([]);
const allGroups = ref<TargetOption[]>([]);

const form = reactive({
  targetType: (props.fixedTarget?.type ?? "agent") as ConnectivityTargetKind,
  targetValue: null as TargetValue,
  intervalSeconds: 60,
  graceSeconds: 300,
  severity: 1,
  isEnabled: true,
});

const targetTypeOptions = [
  { label: "All targets", value: "all" },
  { label: "Agent", value: "agent" },
  { label: "Agent category", value: "agentCategory" },
  { label: "User", value: "user" },
  { label: "User group", value: "userGroup" },
];

const targetFormOptions = targetTypeOptions.filter((option) => option.value !== "all");

const columns: QTableColumn[] = [
  {
    name: "target",
    label: "Target",
    align: "left",
    field: "targetLabel",
    sortable: true,
  },
  {
    name: "interval",
    label: "Interval",
    align: "center",
    field: (row: ConnectivityRow) => row.intervalSeconds,
    sortable: true,
  },
  {
    name: "grace",
    label: "Grace",
    align: "center",
    field: (row: ConnectivityRow) => row.graceSeconds,
    sortable: true,
  },
  {
    name: "severity",
    label: "Severity",
    align: "center",
    field: (row: ConnectivityRow) => row.severity,
    sortable: true,
  },
  {
    name: "status",
    label: "Enabled",
    align: "center",
    field: (row: ConnectivityRow) => row.isEnabled,
    sortable: true,
  },
  {
    name: "actions",
    label: "",
    align: "right",
    field: () => "",
  },
];

const optionsByType = computed<Record<ConnectivityTargetKind, TargetOption[]>>(() => ({
  agent: allAgents.value,
  agentCategory: allCategories.value,
  user: allUsers.value,
  userGroup: allGroups.value,
}));

const currentTargetOptions = computed(() => {
  if (selectedTargetType.value === "all") return [];
  return optionsByType.value[selectedTargetType.value];
});

const formTargetOptions = computed(() => optionsByType.value[form.targetType] ?? []);

const fixedTargetLabel = computed(() =>
  props.fixedTarget ? formatTargetLabel(props.fixedTarget) : "",
);

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  return rows.value.filter((row) => {
    if (enabledOnly.value && !row.isEnabled) {
      return false;
    }

    if (!q) {
      return true;
    }

    return (
      row.targetLabel.toLowerCase().includes(q) ||
      String(row.intervalSeconds).includes(q) ||
      String(row.graceSeconds).includes(q) ||
      String(row.severity).includes(q)
    );
  });
});

function targetTypeLabel(type: ConnectivityTargetKind): string {
  if (type === "agentCategory") return "Agent category";
  if (type === "userGroup") return "User group";
  if (type === "user") return "User";
  return "Agent";
}

function severityLabel(severity: number): string {
  if (severity <= 1) return `Low (${severity})`;
  if (severity === 2) return `Medium (${severity})`;
  if (severity >= 3) return `High (${severity})`;
  return String(severity);
}

function formatTargetLabel(target: Partial<ConnectivityPolicyTarget>): string {
  if (target.type === "agent") {
    return lookupLabel(allAgents.value, target.agentId) || target.agentId || "Agent";
  }
  if (target.type === "agentCategory") {
    return (
      lookupLabel(allCategories.value, target.categoryId) ||
      `Category ${target.categoryId ?? ""}`
    );
  }
  if (target.type === "user") {
    return lookupLabel(allUsers.value, target.userId) || target.userId || "User";
  }
  return (
    lookupLabel(allGroups.value, target.userGroupId) ||
    target.userGroupId ||
    "User group"
  );
}

function lookupLabel(
  options: TargetOption[],
  value: string | number | undefined,
): string {
  if (value == null || value === "") return "";
  return (
    options.find((option) => String(option.value) === String(value))?.label || ""
  );
}

function buildTargetFromSelection(
  targetType: ConnectivityTargetKind,
  targetValue: string | number | null,
): ConnectivityPolicyTarget {
  if (targetType === "agent") {
    if (!targetValue) throw new Error("Select an agent");
    return { type: "agent", agentId: String(targetValue) };
  }
  if (targetType === "agentCategory") {
    if (targetValue == null || targetValue === "") {
      throw new Error("Select an agent category");
    }
    return { type: "agentCategory", categoryId: Number(targetValue) };
  }
  if (targetType === "user") {
    if (!targetValue) throw new Error("Select a user");
    return { type: "user", userId: String(targetValue) };
  }
  if (!targetValue) throw new Error("Select a user group");
  return { type: "userGroup", userGroupId: String(targetValue) };
}

function getFormTarget(): ConnectivityPolicyTarget {
  if (props.fixedTarget) return props.fixedTarget;
  return buildTargetFromSelection(form.targetType, form.targetValue);
}

function resetForm(): void {
  editingPolicy.value = null;
  form.targetType = props.fixedTarget?.type ?? "agent";
  form.targetValue = null;
  form.intervalSeconds = 60;
  form.graceSeconds = 300;
  form.severity = 1;
  form.isEnabled = true;
}

function openCreateDialog(): void {
  resetForm();
  showDialog.value = true;
}

function openEditDialog(row: ConnectivityRow): void {
  editingPolicy.value = row;
  form.targetType = row.type;
  let targetValue: TargetValue = null;
  if (row.type === "agent") {
    targetValue = row.agentId ?? null;
  } else if (row.type === "agentCategory") {
    targetValue = row.categoryId ?? null;
  } else if (row.type === "user") {
    targetValue = row.userId ?? null;
  } else {
    targetValue = row.userGroupId ?? null;
  }
  form.targetValue = targetValue;
  form.intervalSeconds = row.intervalSeconds;
  form.graceSeconds = row.graceSeconds;
  form.severity = row.severity;
  form.isEnabled = row.isEnabled;
  showDialog.value = true;
}

async function loadTargetOptions(): Promise<void> {
  const [agentsRes, categoriesRes, usersRes, groupsRes] = await Promise.all([
    agentServiceClientWrapper.listAgents().catch(() => ({ agentsList: [] })),
    agentCategoryClient.getAllCategories().catch(() => ({ categoriesList: [] })),
    userControlClient.getAllUsers().catch(() => ({ usersList: [] })),
    userControlClient.getAllGroups().catch(() => ({ groupsList: [] })),
  ]);

  allAgents.value = (agentsRes.agentsList || [])
    .map((agent) => ({
      label: agent.hostName || agent.host_name || agent.agentId || agent.agent_id || "Agent",
      value: agent.agentId || agent.agent_id || "",
    }))
    .filter((option) => option.value);

  allCategories.value = (categoriesRes.categoriesList || [])
    .map((category) => ({
      label: category.info?.name || `Category ${category.categoryId}`,
      value: category.categoryId,
    }))
    .filter((option) => Number(option.value) > 0);

  allUsers.value = ((usersRes.usersList as Array<Record<string, unknown>>) || [])
    .map((user) => {
      const info = (user.info as Record<string, unknown> | undefined) || {};
      const value = String(user.userid || user.userId || "").trim();
      const label = String(
        info.displayname || info.name || info.samaccountname || value || "User",
      ).trim();
      return { label, value };
    })
    .filter((option) => option.value);

  allGroups.value = ((groupsRes.groupsList as Array<Record<string, unknown>>) || [])
    .map((group) => {
      const info = (group.info as Record<string, unknown> | undefined) || {};
      const value = String(group.groupid || group.groupId || "").trim();
      const label = String(
        info.displayname || info.name || info.samaccountname || value || "Group",
      ).trim();
      return { label, value };
    })
    .filter((option) => option.value);
}

async function loadPolicies(): Promise<void> {
  loading.value = true;
  try {
    let target: ConnectivityPolicyTarget | undefined;
    if (props.fixedTarget) {
      target = props.fixedTarget;
    } else if (selectedTargetType.value !== "all") {
      target = buildTargetFromSelection(
        selectedTargetType.value,
        selectedTargetValue.value,
      );
    }

    const items = await connectivityPolicyClient.listPolicies({
      target,
      enabledOnly: enabledOnly.value,
    });
    rows.value = items.map((item) => ({
      ...item,
      targetLabel: formatTargetLabel(item),
    }));
  } catch (error) {
    notifyError(
      error instanceof Error
        ? error.message
        : "Failed to load connectivity policies",
    );
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

async function submitForm(): Promise<void> {
  saving.value = true;
  try {
    const target = getFormTarget();
    const payload: ConnectivityPolicyInput = {
      ...target,
      intervalSeconds: Number(form.intervalSeconds),
      graceSeconds: Number(form.graceSeconds),
      severity: Number(form.severity),
      isEnabled: Boolean(form.isEnabled),
    };

    if (editingPolicy.value) {
      await connectivityPolicyClient.updatePolicy(editingPolicy.value.id, payload);
      notifySuccess("Connectivity policy updated");
    } else {
      await connectivityPolicyClient.createPolicy(payload);
      notifySuccess("Connectivity policy created");
    }

    showDialog.value = false;
    emit("changed");
    await loadPolicies();
  } catch (error) {
    notifyError(
      error instanceof Error ? error.message : "Failed to save connectivity policy",
    );
  } finally {
    saving.value = false;
  }
}

async function onToggleEnabled(
  row: ConnectivityRow,
  value: boolean,
): Promise<void> {
  try {
    await connectivityPolicyClient.setPolicyEnabled(row.id, value);
    row.isEnabled = value;
    notifySuccess(value ? "Policy enabled" : "Policy disabled");
    emit("changed");
  } catch (error) {
    notifyError(
      error instanceof Error ? error.message : "Failed to change policy status",
    );
  }
}

function removePolicy(row: ConnectivityRow): void {
  $q.dialog({
    title: "Delete connectivity policy",
    message: `Delete policy for "${row.targetLabel}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await connectivityPolicyClient.deletePolicy(row.id);
      notifySuccess("Connectivity policy deleted");
      emit("changed");
      await loadPolicies();
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "Failed to delete policy",
      );
    }
  });
}

watch(
  () => selectedTargetType.value,
  (value) => {
    if (value === "all") {
      selectedTargetValue.value = null;
      return;
    }
    if (currentTargetOptions.value.length > 0 && selectedTargetValue.value == null) {
      selectedTargetValue.value = currentTargetOptions.value[0]?.value ?? null;
    }
  },
  { immediate: true },
);

watch(
  () => form.targetType,
  (value) => {
    if (props.fixedTarget) return;
    if (
      formTargetOptions.value.length > 0 &&
      !formTargetOptions.value.some(
        (option) => String(option.value) === String(form.targetValue),
      )
    ) {
      form.targetValue = formTargetOptions.value[0]?.value ?? null;
    }
    form.targetType = value;
  },
);

watch(enabledOnly, () => {
  loadPolicies();
});

onMounted(async () => {
  await loadTargetOptions();

  if (!props.fixedTarget && selectedTargetType.value !== "all") {
    selectedTargetValue.value = currentTargetOptions.value[0]?.value ?? null;
  }

  await loadPolicies();
});
</script>

<style scoped lang="sass">
.connectivity-policies-tab__table
  min-height: 240px
</style>
