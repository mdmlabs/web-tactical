<template>
  <div class="nist-detail">
    <!-- Back button and header -->
    <div class="nist-detail-topbar">
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        label="Back to list"
        class="nist-back-btn"
        @click="$emit('back')"
      />
    </div>

    <!-- Control info -->
    <div class="nist-detail-info">
      <h5 class="nist-detail-controlname">Control {{ store.selectedControl }}</h5>
      <div v-if="store.selectedAgent" class="nist-detail-agent-badge">
        <q-icon name="devices" size="14px" />
        <span>Agent: {{ store.selectedAgent.name }} ({{ store.selectedAgent.id }})</span>
      </div>
      <div v-if="controlMeta" class="nist-detail-meta">
        <div class="nist-detail-meta-row">
          <q-icon name="category" size="16px" color="primary" />
          <span class="nist-detail-meta-label">Family</span>
        </div>
        <p class="nist-detail-meta-value">{{ controlMeta.parentTitle ?? controlMeta.title }}</p>
        <div class="nist-detail-meta-row">
          <q-icon name="description" size="16px" color="primary" />
          <span class="nist-detail-meta-label">Control description</span>
        </div>
        <p class="nist-detail-meta-value">{{ controlMeta.description }}</p>
      </div>
    </div>

    <!-- Sub-tabs: Events / SCA -->
    <div class="nist-detail-subtabs">
      <q-tabs
        v-model="store.detailSubTab"
        dense
        no-caps
        inline-label
        indicator-color="primary"
        active-color="primary"
        class="nist-subtabs"
      >
        <q-tab name="events" label="Recent Events" />
        <q-tab name="sca" label="Configuration Checks (SCA)" />
      </q-tabs>
    </div>

    <!-- Events sub-tab -->
    <div v-if="store.detailSubTab === 'events'" class="nist-detail-events">
      <div class="nist-detail-events-info">
        <span class="nist-events-count">
          {{ store.detailEventsTotal.toLocaleString() }} hits
        </span>
      </div>

      <div v-if="store.detailEventsLoading" class="nist-center">
        <q-spinner-dots color="primary" size="36px" />
      </div>
      <div v-else-if="!store.detailEvents.length" class="nist-center">
        <q-icon name="info_outline" size="36px" color="grey-5" />
        <p class="q-mt-sm text-grey">No events found for this control in the selected period.</p>
      </div>
      <div v-else>
        <q-table
          :rows="eventRows"
          :columns="eventColumns"
          row-key="_id"
          flat
          bordered
          dense
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          class="nist-detail-table"
          @row-click="onEventRowClick"
        >
          <template #body-cell-timestamp="props">
            <q-td :props="props">
              <span class="nist-ts">{{ formatTimestamp(props.row.timestamp) }}</span>
            </q-td>
          </template>
          <template #body-cell-level="props">
            <q-td :props="props">
              <q-badge :color="levelColor(props.row.level)" :label="String(props.row.level)" />
            </q-td>
          </template>
        </q-table>

        <div class="nist-detail-pagination">
          <q-pagination
            :model-value="store.detailEventsPagination.page"
            :max="Math.ceil(store.detailEventsTotal / store.detailEventsPagination.rowsPerPage) || 1"
            :max-pages="7"
            direction-links
            boundary-links
            @update:model-value="(v: number) => store.setDetailEventsPage(v)"
          />
        </div>
      </div>
    </div>

    <!-- SCA sub-tab -->
    <div v-if="store.detailSubTab === 'sca'" class="nist-detail-sca">
      <div v-if="store.detailSCALoading" class="nist-center">
        <q-spinner-dots color="primary" size="36px" />
        <p class="q-mt-sm text-grey">Loading SCA checks for control {{ store.selectedControl }}...</p>
      </div>
      <div v-else-if="!store.detailSCAChecks.length" class="nist-center">
        <q-icon name="verified_user" size="36px" color="grey-5" />
        <p class="q-mt-sm text-grey">No SCA checks found for this control.</p>
      </div>
      <div v-else class="nist-sca-list">
        <q-card
          v-for="check in store.detailSCAChecks"
          :key="check.id"
          flat
          bordered
          class="nist-sca-card"
        >
          <q-card-section>
            <div class="nist-sca-header">
              <q-badge
                :color="scaResultColor(check.result)"
                :label="check.result"
                class="q-mr-sm"
              />
              <span class="nist-sca-id">#{{ check.id }}</span>
            </div>
            <div class="nist-sca-title">{{ check.title }}</div>
            <p v-if="check.description" class="nist-sca-desc">{{ check.description }}</p>
            <div v-if="check.rationale" class="nist-sca-section">
              <span class="nist-sca-section-label">Rationale:</span>
              {{ check.rationale }}
            </div>
            <div v-if="check.remediation" class="nist-sca-section">
              <span class="nist-sca-section-label">Remediation:</span>
              {{ check.remediation }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Document detail drawer (for clicked events) -->
    <NIST80053DocumentDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNist80053Store } from "@/stores/nist80053";
import { lookupNIST80053Control } from "@/constants/nist80053Requirements";
import type { NIST80053Event } from "@/types/nist80053";
import NIST80053DocumentDrawer from "./NIST80053DocumentDrawer.vue";

defineEmits<{ (e: "back"): void }>();

const store = useNist80053Store();

const controlMeta = computed(() => {
  if (!store.selectedControl) return null;
  return lookupNIST80053Control(store.selectedControl);
});

const eventColumns = [
  { name: "timestamp", label: "Time", field: "timestamp", align: "left" as const },
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const },
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "center" as const },
  { name: "control", label: "Control", field: "control", align: "center" as const },
  { name: "description", label: "Description", field: "description", align: "left" as const },
  { name: "level", label: "Level", field: "level", align: "center" as const },
  { name: "rule_id", label: "Rule ID", field: "rule_id", align: "center" as const },
];

interface EventRow {
  _id: string;
  timestamp: string;
  agent_name: string;
  agent_id: string;
  control: string | null;
  description: string;
  level: number;
  rule_id: string;
  _event: NIST80053Event;
}

const eventRows = computed<EventRow[]>(() =>
  store.detailEvents.map((e) => {
    const src = e._source as Record<string, unknown>;
    const rule = src.rule as Record<string, unknown> | undefined;
    const agent = src.agent as Record<string, unknown> | undefined;
    return {
      _id: e._id,
      timestamp: (src["@timestamp"] as string) ?? (src["timestamp"] as string) ?? "",
      agent_name: (agent?.name as string) ?? "",
      agent_id: (agent?.id as string) ?? "",
      control: store.selectedControl,
      description: (rule?.description as string) ?? "",
      level: (rule?.level as number) ?? 0,
      rule_id: String(rule?.id ?? ""),
      _event: e,
    };
  }),
);

function onEventRowClick(_evt: Event, row: EventRow) {
  store.inspectDocument(row._event);
}

function formatTimestamp(ts: string): string {
  if (!ts) return "-";
  try {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " @ " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    );
  } catch {
    return ts;
  }
}

function levelColor(level: number): string {
  if (level >= 12) return "red";
  if (level >= 7) return "orange";
  if (level >= 4) return "amber";
  return "grey";
}

function scaResultColor(result: string): string {
  if (result === "passed") return "green";
  if (result === "failed") return "red";
  return "grey";
}
</script>

<style scoped>
.nist-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.nist-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.nist-detail-topbar {
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.nist-back-btn {
  font-size: 13px;
  color: var(--mdm-primary, #2563eb);
}

.nist-detail-info {
  padding: 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.nist-detail-controlname {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.nist-detail-agent-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--mdm-primary, #2563eb);
  margin-bottom: 12px;
}

.nist-detail-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.nist-detail-meta-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.nist-detail-meta-value {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  margin: 0 0 12px;
  line-height: 1.5;
}

.nist-detail-subtabs {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  padding: 0 16px;
}

.nist-subtabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 40px;
}

/* Events sub-tab */
.nist-detail-events {
  flex: 1;
  padding: 0 16px 16px;
}

.nist-detail-events-info {
  padding: 8px 0;
}

.nist-events-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.nist-detail-table {
  margin-top: 8px;
}

.nist-detail-table :deep(tbody tr) {
  cursor: pointer;
}

.nist-detail-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.04);
}

.nist-ts {
  font-size: 12px;
  font-family: monospace;
  white-space: nowrap;
}

.nist-detail-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

/* SCA sub-tab */
.nist-detail-sca {
  flex: 1;
  padding: 16px;
}

.nist-sca-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nist-sca-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.nist-sca-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.nist-sca-id {
  font-size: 12px;
  color: var(--mdm-text-secondary, #888);
}

.nist-sca-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 6px;
}

.nist-sca-desc {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.5;
  margin: 0 0 8px;
}

.nist-sca-section {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  margin-bottom: 4px;
  line-height: 1.4;
}

.nist-sca-section-label {
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Dark mode */
.body--dark .nist-detail-topbar,
.body--dark .nist-detail-info,
.body--dark .nist-detail-subtabs {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .nist-detail-controlname,
.body--dark .nist-detail-meta-label,
.body--dark .nist-events-count,
.body--dark .nist-sca-title,
.body--dark .nist-sca-section-label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .nist-sca-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
