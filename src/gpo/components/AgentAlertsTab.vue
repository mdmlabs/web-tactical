<template>
  <div v-if="hasAlertScope" class="column full-height">
    <div class="row q-col-gutter-md q-mb-md items-end">
      <div class="col-12 col-md-4">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          dense
          outlined
          emit-value
          map-options
          clearable
          label="Status"
          @update:model-value="reload()"
        />
      </div>

      <div class="col-auto">
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
    </div>

    <q-scroll-area class="agent-tab-table-scroll">
      <q-table
        :rows="filteredRows"
        :columns="tableColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 20 }"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-6">
            {{ emptyListMessage }}
          </div>
        </template>

        <template v-slot:body-cell-severity="props">
          <q-td :props="props">
            <q-badge :color="severityColor(props.row.severity)" outline>
              {{ severityLabel(props.row.severity) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="statusColor(props.row.status)"
              :label="statusLabel(props.row.status)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-target="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.targetLabel }}</div>
            <div v-if="props.row.targetValue" class="text-caption text-grey-7">
              {{ props.row.targetValue }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs q-mb-xs">
              <div class="text-weight-medium">{{ alertTitle(props.row) }}</div>
              <q-badge color="primary" outline>
                {{ alertTypeLabel(props.row.type) }}
              </q-badge>
            </div>
            <div
              v-if="props.row.message"
              class="text-caption text-grey-7 alert-message"
            >
              {{ props.row.message }}
            </div>
            <q-expansion-item
              v-if="hasAlertDetails(props.row)"
              dense
              dense-toggle
              switch-toggle-side
              header-class="alert-details-toggle q-px-none"
              class="q-mt-xs"
            >
              <template v-slot:header>
                <q-item-section class="text-caption text-grey-7">
                  Details
                </q-item-section>
              </template>

              <div class="q-pl-sm q-pb-xs column q-gutter-y-xs">
                <div
                  v-for="detail in alertDetails(props.row)"
                  :key="detail.label"
                  class="row items-start no-wrap q-gutter-sm"
                >
                  <div class="text-caption text-grey-6 alert-detail-label">
                    {{ detail.label }}
                  </div>
                  <div class="text-caption text-grey-8 alert-detail-value">
                    {{ detail.value }}
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-td>
        </template>

        <template v-slot:body-cell-activity="props">
          <q-td :props="props">
            <div class="column q-gutter-y-xs">
              <div class="row items-center q-gutter-xs">
                <q-badge color="blue-grey-7" outline>
                  {{ occurrenceLabel(props.row.occurrenceCount) }}
                </q-badge>
              </div>
              <div class="text-caption text-grey-7">
                First: {{ props.row.firstOccurredAt || "—" }}
              </div>
              <div class="text-caption text-grey-7">
                Last: {{ props.row.lastOccurredAt || "—" }}
              </div>
            </div>
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
                :disable="
                  props.row.status !==
                  alertsClient.AlertStatus.ALERT_STATUS_OPEN
                "
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
                  props.row.status ===
                    alertsClient.AlertStatus.ALERT_STATUS_CLOSED
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
                :disable="
                  props.row.status ===
                  alertsClient.AlertStatus.ALERT_STATUS_CLOSED
                "
                @click="closeAndReload(props.row.id)"
              >
                <q-tooltip>Close</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { QTableColumn } from "quasar";
import { formatDate } from "@/utils/format";
import { notifyError, notifySuccess } from "@/utils/notify";
import { connectivityBytesToGuidString } from "@/utils/guid-bytes";
import { alertsClient } from "../api/grpc-client";

const props = defineProps<{
  agentId?: string | null;
  userId?: string | null;
  groupId?: string | null;
  agentCategoryId?: number | null;
  active: boolean;
}>();

const emit = defineEmits<{
  "update:count": [count: number];
  "update:loading": [loading: boolean];
}>();

type AlertRow = {
  // id: number;
  type: string;
  severity: number;
  status: number;
  policyId: string;
  agentId: string;
  userId: string;
  groupId: string;
  agentCategoryId: string;
  targetLabel: string;
  targetValue: string;
  deduplicationKey: string;
  title: string;
  message: string;
  occurrenceCount: number;
  firstOccurredAt?: string;
  lastOccurredAt?: string;
};

const loading = ref(false);
const statusFilter = ref<number | null>(null);
const statusOptions: Array<{ label: string; value: number | null }> = [
  { label: "All", value: null },
  { label: "Open", value: alertsClient.AlertStatus.ALERT_STATUS_OPEN },
  {
    label: "Acknowledged",
    value: alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED,
  },
  { label: "Resolved", value: alertsClient.AlertStatus.ALERT_STATUS_RESOLVED },
  { label: "Closed", value: alertsClient.AlertStatus.ALERT_STATUS_CLOSED },
];

const rows = ref<AlertRow[]>([]);
const loadedForListKey = ref<string | null>(null);

const hasAlertScope = computed(() => {
  if (props.agentId) return true;
  if (props.userId != null && props.userId !== "") return true;
  if (props.groupId != null && props.groupId !== "") return true;
  if (props.agentCategoryId != null) return true;
  return false;
});

const hideTargetColumn = computed(
  () =>
    !props.agentId &&
    (Boolean(props.userId) ||
      Boolean(props.groupId) ||
      props.agentCategoryId != null),
);

const emptyListMessage = computed(() => {
  if (props.userId) return "No alerts for this user";
  if (props.groupId) return "No alerts for this group";
  if (props.agentCategoryId != null) return "No alerts for this machine group";
  return "Alerts not found for the selected agent";
});

const filteredRows = computed(() => {
  if (statusFilter.value === null) return rows.value;
  return rows.value.filter((row) => row.status === statusFilter.value);
});

const tableColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = [
    {
      name: "severity",
      label: "Severity",
      align: "left",
      field: "severity",
      sortable: true,
    },
    { name: "status", label: "Status", align: "left", field: "status" },
  ];
  if (!hideTargetColumn.value) {
    cols.push({
      name: "target",
      label: "Target",
      align: "left",
      field: "targetLabel",
      sortable: true,
    });
  }
  cols.push(
    { name: "title", label: "Alert", align: "left", field: "title" },
    {
      name: "activity",
      label: "Activity",
      align: "left",
      field: "occurrenceCount",
      sortable: true,
    },
    { name: "actions", label: "Actions", align: "center", field: "actions" },
  );
  return cols;
});

function buildListKey(): string | null {
  if (props.agentId) return `a:${props.agentId}`;
  if (props.userId) return `u:${props.userId}`;
  if (props.groupId) return `g:${props.groupId}`;
  if (props.agentCategoryId != null) return `c:${props.agentCategoryId}`;
  return null;
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function alertBytesFieldToString(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Uint8Array) {
    return connectivityBytesToGuidString(value);
  }
  if (typeof value === "string") {
    return connectivityBytesToGuidString(value) || value.trim();
  }
  return String(value).trim();
}

function normalizeNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseAlertDate(value: unknown): string | undefined {
  if (!value) return undefined;

  if (typeof value === "string") {
    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toISOString();
    }
    return undefined;
  }

  if (typeof value === "object") {
    const raw = value as { seconds?: number | string };
    if (raw.seconds === undefined || raw.seconds === null) return undefined;
    const seconds =
      typeof raw.seconds === "string"
        ? Number.parseInt(raw.seconds, 10)
        : raw.seconds;
    if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
    return new Date(seconds * 1000).toISOString();
  }

  return undefined;
}

function normalizeStatus(value: unknown): number {
  if (typeof value === "number") return value;
  const normalized = normalizeString(value).toUpperCase();
  switch (normalized) {
    case "ALERT_STATUS_OPEN":
    case "OPEN":
      return alertsClient.AlertStatus.ALERT_STATUS_OPEN;
    case "ALERT_STATUS_ACKNOWLEDGED":
    case "ACKNOWLEDGED":
      return alertsClient.AlertStatus.ALERT_STATUS_ACKNOWLEDGED;
    case "ALERT_STATUS_RESOLVED":
    case "RESOLVED":
      return alertsClient.AlertStatus.ALERT_STATUS_RESOLVED;
    case "ALERT_STATUS_CLOSED":
    case "CLOSED":
      return alertsClient.AlertStatus.ALERT_STATUS_CLOSED;
    default:
      return normalizeNumber(value);
  }
}

function resolveTargetLabel(item: Record<string, unknown>): {
  targetLabel: string;
  targetValue: string;
} {
  const agentId = normalizeString(item.agentId ?? item.agent_id);
  const userId = alertBytesFieldToString(item.userId ?? item.user_id);
  const groupId = alertBytesFieldToString(item.groupId ?? item.group_id);
  const agentCategoryId = normalizeString(
    item.agentCategoryId ?? item.agent_category_id,
  );

  if (userId) {
    return { targetLabel: "User", targetValue: userId };
  }
  if (groupId) {
    return { targetLabel: "Group", targetValue: groupId };
  }
  if (agentCategoryId && agentCategoryId !== "0") {
    return { targetLabel: "Machine group", targetValue: agentCategoryId };
  }
  if (agentId) {
    return { targetLabel: "Agent", targetValue: agentId };
  }
  return { targetLabel: "Target", targetValue: "—" };
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

function severityLabel(severity: number): string {
  if (severity <= 1) return `Low (${severity})`;
  if (severity === 2) return `Medium (${severity})`;
  return `High (${severity})`;
}

function severityColor(severity: number): string {
  if (severity <= 1) return "grey-7";
  if (severity === 2) return "orange-8";
  return "negative";
}

function humanizeToken(value: string): string {
  return value
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
}

function alertTypeLabel(type: string): string {
  const normalized = normalizeString(type);
  return normalized ? humanizeToken(normalized) : "Alert";
}

function alertTitle(row: AlertRow): string {
  return row.title || alertTypeLabel(row.type) || "Alert";
}

function occurrenceLabel(count: number): string {
  if (count <= 1) return "1 occurrence";
  return `${count} occurrences`;
}

function hasAlertDetails(row: AlertRow): boolean {
  return Boolean(row.policyId || row.deduplicationKey || row.type);
}

function alertDetails(row: AlertRow): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  if (row.policyId) {
    details.push({ label: "Policy", value: row.policyId });
  }

  if (row.type) {
    details.push({ label: "Type", value: row.type });
  }

  if (row.deduplicationKey) {
    details.push({ label: "Dedup key", value: row.deduplicationKey });
  }

  return details;
}

async function reload() {
  const listKey = buildListKey();
  if (!listKey) return;
  loading.value = true;
  emit("update:loading", true);
  try {
    const req: Parameters<typeof alertsClient.listAlerts>[0] = {};
    if (props.agentId) req.agentId = props.agentId;
    else if (props.userId) req.userId = props.userId;
    else if (props.groupId) req.groupId = props.groupId;
    else if (props.agentCategoryId != null)
      req.agentCategoryId = props.agentCategoryId;
    if (statusFilter.value !== null) req.status = statusFilter.value;

    const resp = await alertsClient.listAlerts(req);

    const responseObj = resp as unknown as {
      itemsList?: Array<Record<string, unknown>>;
      items?: Array<Record<string, unknown>>;
    };
    const items = responseObj.itemsList ?? responseObj.items ?? [];
    rows.value = items.map((it) => {
      const firstIso = parseAlertDate(
        it.firstOccurredAt ?? it.first_occurred_at,
      );
      const lastIso = parseAlertDate(it.lastOccurredAt ?? it.last_occurred_at);
      const { targetLabel, targetValue } = resolveTargetLabel(it);

      return {
        id: normalizeNumber(it.id),
        type: normalizeString(it.type),
        severity: normalizeNumber(it.severity),
        status: normalizeStatus(it.status),
        policyId: normalizeString(it.policyId ?? it.policy_id),
        agentId: normalizeString(it.agentId ?? it.agent_id),
        userId: alertBytesFieldToString(it.userId ?? it.user_id),
        groupId: alertBytesFieldToString(it.groupId ?? it.group_id),
        agentCategoryId: normalizeString(
          it.agentCategoryId ?? it.agent_category_id,
        ),
        targetLabel,
        targetValue,
        deduplicationKey: normalizeString(
          it.deduplicationKey ?? it.deduplication_key,
        ),
        title: normalizeString(it.title),
        message: normalizeString(it.message),
        occurrenceCount: normalizeNumber(
          it.occurrenceCount ?? it.occurrence_count,
        ),
        firstOccurredAt: firstIso ? formatDate(firstIso) : undefined,
        lastOccurredAt: lastIso ? formatDate(lastIso) : undefined,
      };
    });

    loadedForListKey.value = listKey;
    emit("update:count", rows.value.length);
  } catch (e) {
    rows.value = [];
    loadedForListKey.value = null;
    emit("update:count", 0);
    notifyError(
      e instanceof Error ? e.message : "Alerts could not be uploaded",
    );
  } finally {
    loading.value = false;
    emit("update:loading", false);
  }
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
    notifyError(
      e instanceof Error ? e.message : "Couldn't close alert as resolved",
    );
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

watch(
  () => [props.active, buildListKey()] as const,
  ([active, listKey]) => {
    if (!active || !listKey) return;
    if (loadedForListKey.value === listKey) return;
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

.alert-message
  white-space: pre-wrap
  line-height: 1.35

.alert-detail-label
  min-width: 72px

.alert-detail-value
  white-space: pre-wrap
  word-break: break-word
</style>
