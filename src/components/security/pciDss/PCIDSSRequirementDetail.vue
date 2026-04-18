<template>
  <div class="pcidss-detail">
    <!-- Back button and header -->
    <div class="pcidss-detail-topbar">
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        label="Back to list"
        class="pcidss-back-btn"
        @click="$emit('back')"
      />
    </div>

    <!-- Requirement info -->
    <div class="pcidss-detail-info">
      <h5 class="pcidss-detail-reqname">Requirement {{ store.selectedRequirement }}</h5>
      <div v-if="store.selectedAgent" class="pcidss-detail-agent-badge">
        <q-icon name="devices" size="14px" />
        <span>Agent: {{ store.selectedAgent.name }} ({{ store.selectedAgent.id }})</span>
      </div>
      <div v-if="reqMeta" class="pcidss-detail-meta">
        <div class="pcidss-detail-meta-row">
          <q-icon name="category" size="16px" color="primary" />
          <span class="pcidss-detail-meta-label">Goals</span>
        </div>
        <p class="pcidss-detail-meta-value">{{ reqMeta.parentTitle ?? reqMeta.title }}</p>
        <div class="pcidss-detail-meta-row">
          <q-icon name="description" size="16px" color="primary" />
          <span class="pcidss-detail-meta-label">Requirement description</span>
        </div>
        <p class="pcidss-detail-meta-value">{{ reqMeta.description }}</p>
      </div>
    </div>

    <!-- Sub-tabs: Events / SCA -->
    <div class="pcidss-detail-subtabs">
      <q-tabs
        v-model="store.detailSubTab"
        dense
        no-caps
        inline-label
        indicator-color="primary"
        active-color="primary"
        class="pcidss-subtabs"
      >
        <q-tab name="events" label="Recent Events" />
        <q-tab name="sca" label="Configuration Checks (SCA)" />
      </q-tabs>
    </div>

    <!-- Events sub-tab -->
    <div v-if="store.detailSubTab === 'events'" class="pcidss-detail-events">
      <div class="pcidss-detail-events-info">
        <span class="pcidss-events-count">
          {{ store.detailEventsTotal.toLocaleString() }} hits
        </span>
      </div>

      <div v-if="store.detailEventsLoading" class="pcidss-center">
        <q-spinner-dots color="primary" size="36px" />
      </div>
      <div v-else-if="!store.detailEvents.length" class="pcidss-center">
        <q-icon name="info_outline" size="36px" color="grey-5" />
        <p class="q-mt-sm text-grey">No events found for this requirement in the selected period.</p>
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
          class="pcidss-detail-table"
          @row-click="onEventRowClick"
        >
          <template #body-cell-timestamp="props">
            <q-td :props="props">
              <span class="pcidss-ts">{{ formatTimestamp(props.row.timestamp) }}</span>
            </q-td>
          </template>
          <template #body-cell-level="props">
            <q-td :props="props">
              <q-badge :color="levelColor(props.row.level)" :label="String(props.row.level)" />
            </q-td>
          </template>
        </q-table>

        <div class="pcidss-detail-pagination">
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
    <div v-if="store.detailSubTab === 'sca'" class="pcidss-detail-sca">
      <div v-if="store.detailSCALoading" class="pcidss-center">
        <q-spinner-dots color="primary" size="36px" />
        <p class="q-mt-sm text-grey">Loading SCA checks for requirement {{ store.selectedRequirement }}...</p>
      </div>
      <div v-else-if="!store.detailSCAChecks.length" class="pcidss-center">
        <q-icon name="verified_user" size="36px" color="grey-5" />
        <p class="q-mt-sm text-grey">No SCA checks found for this requirement.</p>
      </div>
      <div v-else class="pcidss-sca-list">
        <q-card
          v-for="check in store.detailSCAChecks"
          :key="check.id"
          flat
          bordered
          class="pcidss-sca-card"
        >
          <q-card-section>
            <div class="pcidss-sca-header">
              <q-badge
                :color="scaResultColor(check.result)"
                :label="check.result"
                class="q-mr-sm"
              />
              <span class="pcidss-sca-id">#{{ check.id }}</span>
            </div>
            <div class="pcidss-sca-title">{{ check.title }}</div>
            <p v-if="check.description" class="pcidss-sca-desc">{{ check.description }}</p>
            <div v-if="check.rationale" class="pcidss-sca-section">
              <span class="pcidss-sca-section-label">Rationale:</span>
              {{ check.rationale }}
            </div>
            <div v-if="check.remediation" class="pcidss-sca-section">
              <span class="pcidss-sca-section-label">Remediation:</span>
              {{ check.remediation }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Document detail drawer (for clicked events) -->
    <DocumentDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePciDssStore } from "@/stores/pciDss";
import { lookupPCIDSSRequirement } from "@/constants/pciDssRequirements";
import type { PCIDSSEvent } from "@/types/pciDss";
import DocumentDrawer from "./DocumentDrawer.vue";

defineEmits<{ (e: "back"): void }>();

const store = usePciDssStore();

const reqMeta = computed(() => {
  if (!store.selectedRequirement) return null;
  return lookupPCIDSSRequirement(store.selectedRequirement);
});

const eventColumns = [
  { name: "timestamp", label: "Time", field: "timestamp", align: "left" as const },
  { name: "agent_name", label: "Agent", field: "agent_name", align: "left" as const },
  { name: "agent_id", label: "Agent ID", field: "agent_id", align: "center" as const },
  { name: "requirement", label: "Requirement", field: "requirement", align: "center" as const },
  { name: "description", label: "Description", field: "description", align: "left" as const },
  { name: "level", label: "Level", field: "level", align: "center" as const },
  { name: "rule_id", label: "Rule ID", field: "rule_id", align: "center" as const },
];

interface EventRow {
  _id: string;
  timestamp: string;
  agent_name: string;
  agent_id: string;
  requirement: string | null;
  description: string;
  level: number;
  rule_id: string;
  _event: PCIDSSEvent;
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
      requirement: store.selectedRequirement,
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
.pcidss-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.pcidss-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.pcidss-detail-topbar {
  padding: 8px 16px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.pcidss-back-btn {
  font-size: 13px;
  color: var(--mdm-primary, #2563eb);
}

.pcidss-detail-info {
  padding: 20px;
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.pcidss-detail-reqname {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-detail-agent-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--mdm-primary, #2563eb);
  margin-bottom: 12px;
}

.pcidss-detail-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.pcidss-detail-meta-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-detail-meta-value {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  margin: 0 0 12px;
  line-height: 1.5;
}

.pcidss-detail-subtabs {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
  padding: 0 16px;
}

.pcidss-subtabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 40px;
}

/* Events sub-tab */
.pcidss-detail-events {
  flex: 1;
  padding: 0 16px 16px;
}

.pcidss-detail-events-info {
  padding: 8px 0;
}

.pcidss-events-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.pcidss-detail-table {
  margin-top: 8px;
}

.pcidss-detail-table :deep(tbody tr) {
  cursor: pointer;
}

.pcidss-detail-table :deep(tbody tr:hover) {
  background: rgba(37, 99, 235, 0.04);
}

.pcidss-ts {
  font-size: 12px;
  font-family: monospace;
  white-space: nowrap;
}

.pcidss-detail-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

/* SCA sub-tab */
.pcidss-detail-sca {
  flex: 1;
  padding: 16px;
}

.pcidss-sca-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pcidss-sca-card {
  border-radius: var(--mdm-radius-lg, 8px);
  background: var(--mdm-bg-card, #fff);
}

.pcidss-sca-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.pcidss-sca-id {
  font-size: 12px;
  color: var(--mdm-text-secondary, #888);
}

.pcidss-sca-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 6px;
}

.pcidss-sca-desc {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  line-height: 1.5;
  margin: 0 0 8px;
}

.pcidss-sca-section {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  margin-bottom: 4px;
  line-height: 1.4;
}

.pcidss-sca-section-label {
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

/* Dark mode */
.body--dark .pcidss-detail-topbar,
.body--dark .pcidss-detail-info,
.body--dark .pcidss-detail-subtabs {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
}

.body--dark .pcidss-detail-reqname,
.body--dark .pcidss-detail-meta-label,
.body--dark .pcidss-events-count,
.body--dark .pcidss-sca-title,
.body--dark .pcidss-sca-section-label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .pcidss-sca-card {
  background: var(--mdm-bg-card, #111827);
  border-color: var(--mdm-border, #1e293b);
}
</style>
