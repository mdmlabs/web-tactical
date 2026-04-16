<template>
  <div v-if="agentId" class="column full-height">
    <div class="row q-mb-sm items-center">
      <div class="text-h6">Alerts</div>
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        icon="filter_alt"
        label="Filters"
        class="q-mr-sm"
        @click="showFilters = true"
      />

      <q-btn
        flat
        dense
        color="primary"
        icon="refresh"
        label="Refresh"
        :loading="loading"
        @click="reload()"
      />
    </div>

    <div class="row items-center q-gutter-xs q-mb-md">
      <q-chip
        v-if="openOnly"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="
          () => {
            openOnly = false;
            reload();
          }
        "
      >
        Open only
      </q-chip>

      <q-chip
        v-if="typeFilter"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="
          () => {
            typeFilter = null;
            reload();
          }
        "
      >
        Type: {{ typeFilter }}
      </q-chip>

      <q-chip
        v-if="statusFilter !== null"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="
          () => {
            statusFilter = null;
            reload();
          }
        "
      >
        Status: {{ statusLabel(statusFilter) }}
      </q-chip>

      <q-chip
        v-if="userSidFilter && userDisplay"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="() => (userSidFilter = null)"
      >
        User: {{ userDisplay }}
      </q-chip>

      <q-chip
        v-if="groupSidFilter && groupDisplay"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="() => (groupSidFilter = null)"
      >
        Group: {{ groupDisplay }}
      </q-chip>

      <q-chip
        v-if="agentCategoryIdFilter && machineGroupDisplay"
        dense
        square
        color="grey-3"
        text-color="grey-9"
        removable
        @remove="
          () => {
            agentCategoryIdFilter = null;
            reload();
          }
        "
      >
        Machine group: {{ machineGroupDisplay }}
      </q-chip>

      <q-space />
      <q-btn
        v-if="hasAnyFilter"
        flat
        dense
        icon="backspace"
        label="Reset"
        @click="resetFilters"
      />
    </div>

    <q-scroll-area class="agent-tab-table-scroll">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 20 }"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="statusColor(props.row.status)"
              :label="statusLabel(props.row.status)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <q-tooltip v-if="props.row.message">
              {{ props.row.message }}
            </q-tooltip>
            <span>{{ props.row.title || "—" }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs no-wrap">
              <q-btn
                flat
                dense
                size="sm"
                color="primary"
                icon="done"
                :disable="props.row.status !== alertsClient.AlertStatus.ALERT_STATUS_OPEN"
                @click="ackAndReload(props.row.id)"
              >
                <q-tooltip>Acknowledge</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                size="sm"
                color="positive"
                icon="check_circle"
                :disable="
                  props.row.status ===
                    alertsClient.AlertStatus.ALERT_STATUS_RESOLVED ||
                  props.row.status === alertsClient.AlertStatus.ALERT_STATUS_CLOSED
                "
                @click="resolveAndReload(props.row.id)"
              >
                <q-tooltip>Resolve</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                size="sm"
                color="negative"
                icon="close"
                :disable="props.row.status === alertsClient.AlertStatus.ALERT_STATUS_CLOSED"
                @click="closeAndReload(props.row.id)"
              >
                <q-tooltip>Close</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-scroll-area>

    <FilterPickerDialog
      v-model="showUserPicker"
      title="Select user"
      :rows="users"
      :columns="userPickerColumns"
      row-key="sid"
      placeholder="Search by name / sam / sid..."
      @select="
        (row) => {
          const r = row as { sid?: string };
          userSidFilter = r.sid ?? null;
        }
      "
    />

    <FilterPickerDialog
      v-model="showGroupPicker"
      title="Select group"
      :rows="groups"
      :columns="groupPickerColumns"
      row-key="sid"
      placeholder="Search by name / sam / sid..."
      @select="
        (row) => {
          const r = row as { sid?: string };
          groupSidFilter = r.sid ?? null;
        }
      "
    />

    <FilterPickerDialog
      v-model="showMachineGroupPicker"
      title="Select machine group"
      :rows="machineGroupRows"
      :columns="machineGroupColumns"
      row-key="id"
      placeholder="Search by name / id..."
      @select="
        (row) => {
          const r = row as { id?: number };
          agentCategoryIdFilter = r.id ?? null;
          reload();
        }
      "
    />

    <q-dialog v-model="showFilters">
      <q-card class="alerts-filters-card">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6">Filters</div>
          <q-space />
          <q-btn flat dense icon="close" @click="showFilters = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="typeFilter"
                :options="typeOptions"
                dense
                clearable
                use-input
                fill-input
                hide-selected
                input-debounce="350"
                new-value-mode="add-unique"
                label="Type"
                @update:model-value="reload()"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="statusFilter"
                :options="statusOptions"
                dense
                emit-value
                map-options
                clearable
                label="Status"
                @update:model-value="reload()"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-md-6">
              <q-input dense label="User" :model-value="userDisplay" readonly>
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    round
                    icon="person_search"
                    :disable="usersLoading"
                    @click="showUserPicker = true"
                  />
                  <q-btn
                    v-if="userSidFilter"
                    flat
                    dense
                    round
                    icon="close"
                    @click="userSidFilter = null"
                  />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input dense label="Group" :model-value="groupDisplay" readonly>
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    round
                    icon="groups"
                    :disable="groupsLoading"
                    @click="showGroupPicker = true"
                  />
                  <q-btn
                    v-if="groupSidFilter"
                    flat
                    dense
                    round
                    icon="close"
                    @click="groupSidFilter = null"
                  />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-md-6">
              <q-input
                dense
                label="Machine group"
                :model-value="machineGroupDisplay"
                readonly
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    round
                    icon="devices"
                    @click="showMachineGroupPicker = true"
                  />
                  <q-btn
                    v-if="agentCategoryIdFilter"
                    flat
                    dense
                    round
                    icon="close"
                    @click="agentCategoryIdFilter = null"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-toggle
                v-model="openOnly"
                label="Open only"
                dense
                @update:model-value="reload()"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Reset" :disable="!hasAnyFilter" @click="resetFilters" />
          <q-btn flat label="Close" @click="showFilters = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { QTableColumn } from "quasar";
import { formatDate } from "@/utils/format";
import { notifyError, notifySuccess } from "@/utils/notify";
import FilterPickerDialog from "./FilterPickerDialog.vue";
import { agentCategoryClient, alertsClient } from "../api/grpc-client";

type UserRow = {
  name: string;
  sid: string;
  samAccountName: string;
};

type GroupRow = {
  name?: string;
  displayName?: string;
  samAccountName?: string;
  sid?: string;
};


const props = defineProps<{
  agentId: string | null;
  users: UserRow[];
  groups: GroupRow[];
  usersLoading: boolean;
  groupsLoading: boolean;
  active: boolean;
}>();

type AlertTimestamp = { seconds?: number | string; nanos?: number };
type AlertRow = {
  id: number;
  type: string;
  severity: number;
  status: number;
  policyId: number;
  deduplicationKey: string;
  title: string;
  message: string;
  occurrenceCount: number;
  firstOccurredAt?: string;
  lastOccurredAt?: string;
};

const loading = ref(false);
const openOnly = ref(true);
const typeFilter = ref<string | null>(null);
const typeOptions = ref<string[]>([]);
const statusFilter = ref<number | null>(null);
const statusOptions: Array<{ label: string; value: number | null }> = [
  { label: "All", value: null },
  { label: "Open", value: alertsClient.AlertStatus.ALERT_STATUS_OPEN },
  { label: "Acknowledged", value: alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED },
  { label: "Resolved", value: alertsClient.AlertStatus.ALERT_STATUS_RESOLVED },
  { label: "Closed", value: alertsClient.AlertStatus.ALERT_STATUS_CLOSED },
];

const userSidFilter = ref<string | null>(null);
const groupSidFilter = ref<string | null>(null);
const userIdBytes = ref<Uint8Array | null>(null);
const groupIdBytes = ref<Uint8Array | null>(null);
const agentCategoryIdFilter = ref<number | null>(null);

type AgentCategoryOption = { label: string; value: number };
const agentCategoryOptions = ref<AgentCategoryOption[]>([]);

const rows = ref<AlertRow[]>([]);
const loadedForAgentId = ref<string | null>(null);

const userDisplay = computed(() => {
  if (!userSidFilter.value) return "";
  const u = props.users.find((x) => x.sid === userSidFilter.value);
  if (!u) return "";
  return u.samAccountName ? `${u.name} (${u.samAccountName})` : u.name;
});

const groupDisplay = computed(() => {
  if (!groupSidFilter.value) return "";
  const g = props.groups.find((x) => x.sid === groupSidFilter.value);
  if (!g) return "";
  return String(g.name || g.displayName || g.samAccountName || "");
});

const machineGroupDisplay = computed(() => {
  if (!agentCategoryIdFilter.value) return "";
  const found = agentCategoryOptions.value.find((o) => o.value === agentCategoryIdFilter.value);
  return found?.label || "";
});

const showUserPicker = ref(false);
const showGroupPicker = ref(false);
const showMachineGroupPicker = ref(false);
const showFilters = ref(false);

const hasAnyFilter = computed(() => {
  return (
    !!typeFilter.value ||
    statusFilter.value !== null ||
    !!userSidFilter.value ||
    !!groupSidFilter.value ||
    !!agentCategoryIdFilter.value ||
    openOnly.value === false
  );
});

const userPickerColumns: QTableColumn[] = [
  { name: "name", label: "Name", align: "left", field: "name", sortable: true },
  { name: "samAccountName", label: "SAM", align: "left", field: "samAccountName", sortable: true },
  { name: "sid", label: "SID", align: "left", field: "sid", sortable: true },
];

const groupPickerColumns: QTableColumn[] = [
  { name: "name", label: "Name", align: "left", field: "name", sortable: true },
  { name: "displayName", label: "Display name", align: "left", field: "displayName", sortable: true },
  { name: "samAccountName", label: "SAM", align: "left", field: "samAccountName", sortable: true },
  { name: "sid", label: "SID", align: "left", field: "sid", sortable: true },
];

const machineGroupRows = computed(() =>
  agentCategoryOptions.value.map((o) => ({ id: o.value, name: o.label })),
);
const machineGroupColumns: QTableColumn[] = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  { name: "name", label: "Name", align: "left", field: "name", sortable: true },
];

const columns: QTableColumn[] = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  { name: "severity", label: "Severity", align: "left", field: "severity", sortable: true },
  { name: "status", label: "Status", align: "left", field: "status" },
  { name: "type", label: "Type", align: "left", field: "type", sortable: true },
  { name: "policyId", label: "Policy", align: "left", field: "policyId", sortable: true },
  { name: "title", label: "Title", align: "left", field: "title" },
  { name: "occurrenceCount", label: "Count", align: "right", field: "occurrenceCount", sortable: true },
  { name: "firstOccurredAt", label: "First seen", align: "left", field: "firstOccurredAt", sortable: true },
  { name: "lastOccurredAt", label: "Last seen", align: "left", field: "lastOccurredAt", sortable: true },
  { name: "deduplicationKey", label: "Dedup key", align: "left", field: "deduplicationKey" },
  { name: "actions", label: "Actions", align: "center", field: "actions" },
];

function utf8Bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

watch(userSidFilter, (sid) => {
  userIdBytes.value = sid ? utf8Bytes(sid) : null;
  if (props.agentId) void reload();
});

watch(groupSidFilter, (sid) => {
  groupIdBytes.value = sid ? utf8Bytes(sid) : null;
  if (props.agentId) void reload();
});

function tsToIso(ts?: AlertTimestamp): string | undefined {
  if (!ts?.seconds && ts?.seconds !== 0) return undefined;
  const sec = typeof ts.seconds === "string" ? Number.parseInt(ts.seconds, 10) : ts.seconds;
  if (!Number.isFinite(sec) || sec <= 0) return undefined;
  return new Date(sec * 1000).toISOString();
}

function statusLabel(status: number): string {
  switch (status) {
    case alertsClient.AlertStatus.ALERT_STATUS_OPEN:
      return "Open";
    case alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED:
      return "Acknowledged";
    case alertsClient.AlertStatus.ALERT_STATUS_RESOLVED:
      return "Resolved";
    case alertsClient.AlertStatus.ALERT_STATUS_CLOSED:
      return "Closed";
    default:
      return "Unknown";
  }
}

function statusColor(status: number): string {
  switch (status) {
    case alertsClient.AlertStatus.ALERT_STATUS_OPEN:
      return "negative";
    case alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED:
      return "warning";
    case alertsClient.AlertStatus.ALERT_STATUS_RESOLVED:
      return "positive";
    case alertsClient.AlertStatus.ALERT_STATUS_CLOSED:
      return "grey";
    default:
      return "grey-7";
  }
}

async function reload() {
  if (!props.agentId) return;
  loading.value = true;
  try {
    const resp = await alertsClient.listAlerts({
      agentId: props.agentId,
      openOnly: openOnly.value,
      type: typeFilter.value?.trim() || undefined,
      status: statusFilter.value ?? undefined,
      userId: userIdBytes.value ?? undefined,
      groupId: groupIdBytes.value ?? undefined,
      agentCategoryId: agentCategoryIdFilter.value ?? undefined,
    });

    const items = resp.itemsList || [];
    for (const it of items) {
      const t = (it.type ?? "").trim();
      if (!t) continue;
      if (!typeOptions.value.includes(t)) typeOptions.value = [...typeOptions.value, t].sort();
    }

    rows.value = items.map((it) => {
      const firstIso = tsToIso(it.firstOccurredAt as AlertTimestamp | undefined);
      const lastIso = tsToIso(it.lastOccurredAt as AlertTimestamp | undefined);
      return {
        id: it.id ?? 0,
        type: it.type ?? "",
        severity: it.severity ?? 0,
        status: (it.status ?? 0) as number,
        policyId: it.policyId ?? 0,
        deduplicationKey: it.deduplicationKey ?? "",
        title: it.title ?? "",
        message: it.message ?? "",
        occurrenceCount: it.occurrenceCount ?? 0,
        firstOccurredAt: firstIso ? formatDate(firstIso) : undefined,
        lastOccurredAt: lastIso ? formatDate(lastIso) : undefined,
      };
    });

    loadedForAgentId.value = props.agentId;
  } catch (e) {
    rows.value = [];
    loadedForAgentId.value = null;
    notifyError(e instanceof Error ? e.message : "Alerts could not be uploaded");
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  typeFilter.value = null;
  statusFilter.value = null;
  userSidFilter.value = null;
  groupSidFilter.value = null;
  agentCategoryIdFilter.value = null;
  openOnly.value = true;
  void reload();
}

async function ackAndReload(id: number) {
  try {
    await alertsClient.acknowledgeAlert(id);
    notifySuccess("Alert acknowledged");
    await reload();
  } catch (e) {
    notifyError(e instanceof Error ? e.message : "Couldn't confirm alert");
  }
}

async function resolveAndReload(id: number) {
  try {
    await alertsClient.resolveAlert(id);
    notifySuccess("Alert resolved");
    await reload();
  } catch (e) {
    notifyError(e instanceof Error ? e.message : "Couldn't close alert as resolved");
  }
}

async function closeAndReload(id: number) {
  try {
    await alertsClient.closeAlert(id);
    notifySuccess("Alert closed");
    await reload();
  } catch (e) {
    notifyError(e instanceof Error ? e.message : "Couldn't close the alert");
  }
}

onMounted(async () => {
  try {
    const cats = await agentCategoryClient.getAllCategories();
    const categories = cats.categoriesList || [];
    agentCategoryOptions.value = categories
      .map((c) => ({ label: c.info?.name || `Category ${c.categoryId}`, value: c.categoryId }))
      .filter((o) => o.value > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    agentCategoryOptions.value = [];
  }
});

watch(
  () => [props.active, props.agentId] as const,
  ([active, agentId]) => {
    if (!active || !agentId) return;
    if (loadedForAgentId.value === agentId) return;
    void reload();
  },
  { immediate: true },
);
</script>

<style scoped lang="sass">
.agent-tab-table-scroll
  height: calc(100vh - 320px)
  min-height: 300px
  width: 100%

.alerts-filters-card
  min-width: 760px
  max-width: 95vw
</style>

