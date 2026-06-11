<template>
  <div class="dlp-dashboard">
    <!-- Period selector -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-subtitle1 text-weight-medium">
        {{ $t("security.components.DLPDashboard.086f6b") }}
      </div>
      <q-space />
      <q-btn-toggle
        v-model="period"
        toggle-color="primary"
        :options="periodOptions"
        dense
        unelevated
        @update:model-value="loadReport"
      />
      <q-btn
        flat
        round
        dense
        icon="refresh"
        :loading="loading"
        @click="loadReport"
      />
      <q-btn
        flat
        icon="download"
        :label="$t('security.components.DLPDashboard.328118')"
        dense
        color="primary"
        @click="exportCSV"
      />
    </div>

    <!-- Report filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.violation_type"
              :options="violationTypeOptions"
              :label="$t('Violation type')"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadReport"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.action_taken"
              :options="actionOptions"
              :label="$t('Action')"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadReport"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.policy"
              :options="policyOptions"
              :label="$t('Policy')"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadReport"
            />
          </div>
          <div class="col-12 col-md">
            <q-input
              v-model="filters.agent_id"
              :label="$t('Agent ID')"
              outlined
              dense
              clearable
              debounce="500"
              @update:model-value="loadReport"
            />
          </div>
          <div class="col-auto">
            <q-btn
              flat
              dense
              icon="filter_alt_off"
              :disable="activeFiltersCount === 0"
              @click="resetFilters"
            >
              <q-tooltip>{{ $t("Clear report filters") }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Summary cards -->
    <div class="row q-gutter-md q-mb-lg">
      <q-card
        class="col-12 col-sm-5 col-md-2 cursor-pointer"
        flat
        bordered
        @click="$emit('go-tab', 'violations')"
      >
        <q-card-section class="text-center q-pa-md">
          <q-icon name="security" size="2rem" color="negative" />
          <div class="text-h4 text-weight-bold text-negative q-mt-xs">
            {{ report.total_violations }}
          </div>
          <div class="text-caption text-grey-7">
            {{ $t("security.components.DLPDashboard.297cad") }}
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="col-12 col-sm-5 col-md-2 cursor-pointer"
        flat
        bordered
        @click="$emit('go-tab', 'quarantine')"
      >
        <q-card-section class="text-center q-pa-md">
          <q-icon name="folder_off" size="2rem" color="orange" />
          <div class="text-h4 text-weight-bold text-orange q-mt-xs">
            {{ report.quarantine?.active || 0 }}
          </div>
          <div class="text-caption text-grey-7">
            {{ $t("security.components.DLPDashboard.cb417b") }}
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="col-12 col-sm-5 col-md-2 cursor-pointer"
        flat
        bordered
        @click="$emit('go-tab', 'justifications')"
      >
        <q-card-section class="text-center q-pa-md">
          <q-icon name="pending_actions" size="2rem" color="warning" />
          <div class="text-h4 text-weight-bold text-warning q-mt-xs">
            {{ report.justifications?.pending || 0 }}
          </div>
          <div class="text-caption text-grey-7">
            {{ $t("security.components.DLPDashboard.12014f") }}
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-sm-5 col-md-2" flat bordered>
        <q-card-section class="text-center q-pa-md">
          <q-icon name="policy" size="2rem" color="positive" />
          <div class="text-h4 text-weight-bold text-positive q-mt-xs">
            {{ report.active_policies || 0 }}
          </div>
          <div class="text-caption text-grey-7">
            {{ $t("security.components.DLPDashboard.d46615") }}
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="col-12 col-sm-5 col-md-2 cursor-pointer"
        flat
        bordered
        @click="$emit('go-tab', 'violations')"
      >
        <q-card-section class="text-center q-pa-md">
          <q-icon name="report_problem" size="2rem" color="negative" />
          <div class="text-h4 text-weight-bold text-negative q-mt-xs">
            {{ report.open_violations || 0 }}
          </div>
          <div class="text-caption text-grey-7">
            {{ $t("Open Violations") }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-banner
      v-if="coverage.unprotected_agents > 0"
      dense
      rounded
      class="bg-orange-1 text-orange-10 q-mb-md"
    >
      <template #avatar>
        <q-icon name="warning" color="orange-8" />
      </template>
      <div class="text-weight-medium">
        {{ $t("Some Windows devices have no effective DLP policy") }}
      </div>
      <div class="text-caption">
        {{
          $t(
            "Assign a DLP policy before running customer validation on those devices.",
          )
        }}
      </div>
      <template #action>
        <q-btn
          flat
          dense
          color="orange-10"
          :label="$t('Open policies')"
          @click="$emit('go-tab', 'policies')"
        />
      </template>
    </q-banner>

    <q-card flat bordered class="q-mb-lg dlp-coverage-card">
      <q-card-section>
        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col-12 col-md">
            <div class="text-subtitle2">{{ $t("DLP coverage") }}</div>
            <div class="text-caption text-grey-7">
              {{ $t("Effective enabled DLP policies on Windows endpoints") }}
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <q-chip
              dense
              square
              :color="coverageColor"
              text-color="white"
              :label="`${coverage.protected_percent || 0}% ${$t('protected')}`"
            />
          </div>
        </div>

        <q-linear-progress
          :value="coverageRatio"
          :color="coverageColor"
          track-color="grey-3"
          class="q-mb-md"
          size="10px"
          rounded
        />

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="computer" color="primary" size="22px" />
              <div>
                <div class="metric-value">
                  {{ coverage.windows_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Windows devices") }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="verified_user" color="positive" size="22px" />
              <div>
                <div class="metric-value text-positive">
                  {{ coverage.protected_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Protected") }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="shield" color="warning" size="22px" />
              <div>
                <div class="metric-value text-warning">
                  {{ coverage.unprotected_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Unprotected") }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="wifi_tethering" color="purple" size="22px" />
              <div>
                <div class="metric-value">
                  {{ coverage.network_dlp_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Network DLP") }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="email" color="teal" size="22px" />
              <div>
                <div class="metric-value">
                  {{ coverage.email_dlp_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Email DLP") }}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-2">
            <div class="coverage-metric">
              <q-icon name="schedule" color="grey-7" size="22px" />
              <div>
                <div class="metric-value">
                  {{ coverage.online_agents || 0 }}
                </div>
                <div class="metric-label">{{ $t("Online now") }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="coverage.network_dlp_agents > 0"
          class="network-runtime q-mb-md"
        >
          <div class="text-caption text-grey-7 q-mb-xs">
            {{ $t("Network DLP runtime") }}
          </div>
          <div class="row q-gutter-sm">
            <q-chip
              v-for="item in networkRuntimeItems"
              :key="item.key"
              dense
              square
              :color="item.color"
              text-color="white"
              :icon="item.icon"
              :label="`${item.label}: ${item.value}`"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-lg-5">
            <div class="text-subtitle2 q-mb-sm">
              {{ $t("Devices without DLP policy") }}
            </div>
            <q-table
              :rows="uncoveredRows"
              :columns="uncoveredColumns"
              dense
              flat
              hide-bottom
              :rows-per-page-options="[0]"
              class="coverage-table"
            >
              <template #body-cell-last_seen="props">
                <q-td :props="props">{{ formatLastSeen(props.value) }}</q-td>
              </template>
              <template #body-cell-reason="props">
                <q-td :props="props">{{ $t(props.value) }}</q-td>
              </template>
              <template #no-data>
                <div class="full-width text-positive text-center q-py-md">
                  {{ $t("Every Windows device has an effective DLP policy") }}
                </div>
              </template>
            </q-table>
          </div>

          <div class="col-12 col-lg-7">
            <div class="text-subtitle2 q-mb-sm">
              {{ $t("Protected device sample") }}
            </div>
            <q-table
              :rows="coveredRows"
              :columns="coveredColumns"
              dense
              flat
              hide-bottom
              :rows-per-page-options="[0]"
              class="coverage-table"
            >
              <template #body-cell-policies="props">
                <q-td :props="props">
                  <div
                    class="ellipsis"
                    :title="(props.row.policies || []).join(', ')"
                  >
                    {{ (props.row.policies || []).join(", ") || "-" }}
                  </div>
                </q-td>
              </template>
              <template #body-cell-channels="props">
                <q-td :props="props">
                  <q-chip
                    v-for="channel in props.value"
                    :key="channel"
                    dense
                    square
                    size="sm"
                    :color="channelColor(channel)"
                    text-color="white"
                    :label="$t(channel)"
                  />
                </q-td>
              </template>
              <template #body-cell-network_dlp="props">
                <q-td :props="props">
                  <q-chip
                    v-if="props.value?.state"
                    dense
                    square
                    size="sm"
                    :color="networkStateColor(props.value.state)"
                    text-color="white"
                    :icon="networkStateIcon(props.value.state)"
                    :label="networkStateLabel(props.value.state)"
                  >
                    <q-tooltip>
                      {{ networkHealthTooltip(props.value) }}
                    </q-tooltip>
                  </q-chip>
                  <span v-else class="text-grey-5">-</span>
                </q-td>
              </template>
              <template #no-data>
                <div class="full-width text-grey-5 text-center q-py-md">
                  {{ $t("No protected Windows devices yet") }}
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Charts row -->
    <div class="row q-gutter-md q-mb-lg">
      <!-- Timeline chart -->
      <q-card class="col-12 col-md-7" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">
            {{ $t("security.components.DLPDashboard.d19bd7") }}
          </div>
          <div v-if="timelineData.length > 0" class="timeline-chart">
            <div
              class="row items-end q-gutter-xs"
              style="height: 80px; align-items: flex-end"
            >
              <template v-for="(point, i) in timelineData" :key="i">
                <div
                  class="column items-center"
                  style="flex: 1; min-width: 20px"
                >
                  <q-tooltip>{{ point.date }}: {{ point.count }}</q-tooltip>
                  <div
                    :style="{
                      height: barHeight(point.count) + 'px',
                      'background-color':
                        point.count > 5
                          ? '#e53935'
                          : point.count > 2
                            ? '#fb8c00'
                            : '#43a047',
                      'min-height': point.count > 0 ? '4px' : '0',
                      width: '100%',
                      'border-radius': '2px 2px 0 0',
                    }"
                  />
                  <div
                    v-if="timelineData.length <= 14"
                    class="text-caption"
                    style="
                      font-size: 9px;
                      transform: rotate(-45deg);
                      transform-origin: center;
                    "
                  >
                    {{ point.date.slice(5) }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-else class="text-grey-5 text-center q-py-lg">
            {{ $t("security.components.DLPDashboard.b56f8f") }}
          </div>
        </q-card-section>
      </q-card>

      <!-- By type pie -->
      <q-card class="col-12 col-md-4" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">
            {{ $t("security.components.DLPDashboard.28bc71") }}
          </div>
          <div v-if="violationTypes.length > 0">
            <div
              v-for="item in violationTypes"
              :key="item.type"
              class="q-mb-xs"
            >
              <div class="row items-center q-gutter-xs">
                <q-badge
                  :color="typeColor(item.type)"
                  :label="item.type"
                  class="col-auto"
                />
                <q-linear-progress
                  :value="item.count / (report.total_violations || 1)"
                  :color="typeColor(item.type)"
                  class="col"
                  style="height: 12px; border-radius: 4px"
                />
                <div class="col-auto text-caption">{{ item.count }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-grey-5 text-center q-py-lg">
            {{ $t("security.components.DLPDashboard.d802d2") }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Top violators -->
    <div class="row q-gutter-md q-mb-lg">
      <q-card class="col-12 col-md-6" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">
            {{ $t("security.components.DLPDashboard.7b9751") }}
          </div>
          <q-table
            :rows="topAgents"
            :columns="agentColumns"
            dense
            flat
            hide-bottom
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-count="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.value > 10
                      ? 'negative'
                      : props.value > 3
                        ? 'warning'
                        : 'grey'
                  "
                >
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Policies with live violations -->
      <q-card class="col-12 col-md-5" flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">
            {{ $t("Policies with Violations") }}
          </div>
          <q-table
            :rows="policyRows"
            :columns="policyColumns"
            dense
            flat
            hide-bottom
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-count="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.value > 10
                      ? 'negative'
                      : props.value > 3
                        ? 'warning'
                        : 'grey'
                  "
                >
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="full-width text-grey-5 text-center q-py-md">
                {{ $t("No policy violations for selected filters") }}
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Actions summary -->
    <q-card v-if="actionRows.length > 0" flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ $t("Actions Taken") }}</div>
        <div class="row q-gutter-sm">
          <q-chip
            v-for="item in actionRows"
            :key="item.action"
            :color="actionColor(item.action)"
            text-color="white"
            dense
            :label="`${item.action}: ${item.count}`"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Justification summary -->
    <q-card
      v-if="report.justifications?.total > 0"
      flat
      bordered
      class="q-mb-md"
    >
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          {{ $t("security.components.DLPDashboard.c4af9a") }}
        </div>
        <div class="row q-gutter-sm">
          <q-chip
            v-for="(count, status) in report.justifications"
            :key="status"
            :color="justifColor(status)"
            text-color="white"
            dense
            :label="`${status}: ${count}`"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  (e: "go-tab", tab: string): void;
}>();

const { t } = useI18n();
const period = ref("7d");
const loading = ref(false);
const report = ref<any>({
  total_violations: 0,
  violations_by_type: {},
  violations_by_action: {},
  violations_by_policy: {},
  violations_by_agent: [],
  violations_timeline: [],
  recent_violations: [],
  justifications: {},
  quarantine: {},
  active_policies: 0,
  open_violations: 0,
  resolved_violations: 0,
  filter_options: {},
  policy_summary: {},
  coverage: {
    windows_agents: 0,
    online_agents: 0,
    stale_agents: 0,
    protected_agents: 0,
    unprotected_agents: 0,
    protected_percent: 0,
    file_dlp_agents: 0,
    network_dlp_agents: 0,
    email_dlp_agents: 0,
    network_runtime: {
      ready: 0,
      degraded: 0,
      fail_closed: 0,
      unknown: 0,
    },
    covered_agents: [],
    uncovered_agents: [],
  },
});

const filters = reactive({
  violation_type: null as string | null,
  action_taken: null as string | null,
  policy: null as string | null,
  agent_id: "",
});

const periodOptions = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

const timelineData = computed(() =>
  (report.value.violations_timeline || []).map((p: any) => ({
    date: p.date,
    count: p.count,
  })),
);

const violationTypes = computed(() =>
  Object.entries(report.value.violations_by_type || {})
    .map(([type, count]) => ({ type, count: count as number }))
    .sort((a, b) => b.count - a.count),
);

const topAgents = computed(() =>
  (report.value.violations_by_agent || []).slice(0, 10),
);

const policyRows = computed(() =>
  Object.entries(report.value.violations_by_policy || {})
    .map(([policy, count]) => ({ policy, count: count as number }))
    .sort((a, b) => b.count - a.count),
);

const actionRows = computed(() =>
  Object.entries(report.value.violations_by_action || {})
    .map(([action, count]) => ({ action, count: count as number }))
    .sort((a, b) => b.count - a.count),
);

const coverage = computed(() => report.value.coverage || {});
const networkRuntime = computed(() => coverage.value.network_runtime || {});

const networkRuntimeItems = computed(() => [
  {
    key: "ready",
    label: t("Ready"),
    value: Number(networkRuntime.value.ready || 0),
    color: "positive",
    icon: "check_circle",
  },
  {
    key: "degraded",
    label: t("Degraded"),
    value: Number(networkRuntime.value.degraded || 0),
    color: "warning",
    icon: "warning",
  },
  {
    key: "fail_closed",
    label: t("Fail-closed"),
    value: Number(networkRuntime.value.fail_closed || 0),
    color: "negative",
    icon: "lock",
  },
  {
    key: "unknown",
    label: t("Unknown"),
    value: Number(networkRuntime.value.unknown || 0),
    color: "grey",
    icon: "help",
  },
]);

const coverageRatio = computed(() =>
  Math.max(0, Math.min(1, Number(coverage.value.protected_percent || 0) / 100)),
);

const coverageColor = computed(() => {
  if (!coverage.value.windows_agents) return "grey";
  if (coverage.value.unprotected_agents > 0) return "warning";
  return "positive";
});

const uncoveredRows = computed(() =>
  (coverage.value.uncovered_agents || []).slice(0, 10),
);

const coveredRows = computed(() =>
  (coverage.value.covered_agents || []).slice(0, 10),
);

const activeFiltersCount = computed(
  () => Object.values(filters).filter((v) => String(v || "").trim()).length,
);

const violationTypeOptions = computed(() =>
  optionList(
    report.value.filter_options?.violation_types || [],
    filters.violation_type,
  ),
);
const actionOptions = computed(() =>
  optionList(report.value.filter_options?.actions || [], filters.action_taken),
);
const policyOptions = computed(() =>
  optionList(report.value.filter_options?.policies || [], filters.policy),
);

const agentColumns = computed(() => [
  {
    name: "agent_id",
    label: t("Agent ID"),
    field: "agent_id",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "count",
    label: t("Violations"),
    field: "count",
    align: "center" as const,
    sortable: true,
  },
]);

const policyColumns = computed(() => [
  {
    name: "policy",
    label: t("Policy"),
    field: "policy",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "count",
    label: t("Violations"),
    field: "count",
    align: "center" as const,
    sortable: true,
  },
]);

const uncoveredColumns = computed(() => [
  {
    name: "hostname",
    label: t("Device"),
    field: (row: any) => row.hostname || row.agent_id,
    align: "left" as const,
    sortable: true,
  },
  {
    name: "agent_id",
    label: t("Agent ID"),
    field: "agent_id",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "last_seen",
    label: t("Last seen"),
    field: "last_seen",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "reason",
    label: t("Reason"),
    field: "reason",
    align: "left" as const,
  },
]);

const coveredColumns = computed(() => [
  {
    name: "hostname",
    label: t("Device"),
    field: (row: any) => row.hostname || row.agent_id,
    align: "left" as const,
    sortable: true,
  },
  {
    name: "policy_count",
    label: t("Policies"),
    field: "policy_count",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "policies",
    label: t("Policy names"),
    field: "policies",
    align: "left" as const,
  },
  {
    name: "channels",
    label: t("Channels"),
    field: "channels",
    align: "left" as const,
  },
  {
    name: "network_dlp",
    label: t("Network runtime"),
    field: "network_dlp",
    align: "left" as const,
  },
]);

function barHeight(count: number): number {
  const maxCount = Math.max(...timelineData.value.map((p: any) => p.count), 1);
  return Math.max(2, (count / maxCount) * 70);
}

function typeColor(type: string): string {
  const map: Record<string, string> = {
    usb_transfer: "deep-orange",
    pii_detected: "red",
    network_upload: "purple",
    cloud_sync: "blue",
    keyword_match: "orange",
    credential: "red-10",
    credential_detected: "red-10",
    email_body: "teal",
    custom_pattern_match: "indigo",
    email_dlp: "teal",
    network_content_dlp: "purple-8",
    network_dlp_health: "blue-grey",
    auto_encrypt: "grey",
  };
  return map[type] || "grey";
}

function actionColor(action: string): string {
  if (action.includes("block")) return "negative";
  if (action.includes("quarantine")) return "orange";
  if (action.includes("justified") || action.includes("allow"))
    return "positive";
  if (action.includes("encrypt")) return "blue-grey";
  return "grey";
}

function justifColor(status: string): string {
  const map: Record<string, string> = {
    pending: "warning",
    approved: "positive",
    rejected: "negative",
    auto_approved: "blue",
    timeout: "grey",
    total: "primary",
  };
  return map[status] || "grey";
}

function channelColor(channel: string): string {
  const map: Record<string, string> = {
    File: "blue-grey",
    Network: "purple",
    Email: "teal",
    USB: "deep-orange",
    Quarantine: "orange",
    Encryption: "indigo",
  };
  return map[channel] || "grey";
}

function networkStateColor(state: string): string {
  const normalized = String(state || "").toLowerCase();
  if (["ready", "running"].includes(normalized)) return "positive";
  if (normalized === "fail_closed") return "negative";
  if (["degraded", "error", "exited", "starting"].includes(normalized))
    return "warning";
  if (normalized === "disabled") return "grey-6";
  return "grey";
}

function networkStateIcon(state: string): string {
  const normalized = String(state || "").toLowerCase();
  if (["ready", "running"].includes(normalized)) return "check_circle";
  if (normalized === "fail_closed") return "lock";
  if (["degraded", "error", "exited"].includes(normalized)) return "warning";
  if (normalized === "starting") return "sync";
  return "help";
}

function networkStateLabel(state: string): string {
  const normalized = String(state || "unknown").toLowerCase();
  if (normalized === "fail_closed") return "Fail-closed";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function networkHealthTooltip(health: any): string {
  const parts = [
    health?.detail,
    health?.rules_loaded ? "Rules loaded" : "Rules not loaded",
    health?.proxy_configured ? "Proxy configured" : "Proxy not configured",
    health?.port_listening ? "Port listening" : "Port not listening",
  ].filter(Boolean);
  if (health?.reported_at) parts.push(`Reported: ${formatLastSeen(health.reported_at)}`);
  return parts.join(" · ");
}

function formatLastSeen(value: string): string {
  if (!value) return t("Never");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function optionList(values: string[], current?: string | null) {
  const set = new Set(values.filter(Boolean));
  if (current) set.add(current);
  return Array.from(set)
    .sort()
    .map((value) => ({ label: value, value }));
}

function reportParams(extra: Record<string, any> = {}) {
  const params: Record<string, any> = { period: period.value, ...extra };
  Object.entries(filters).forEach(([key, value]) => {
    const normalized = String(value || "").trim();
    if (normalized) params[key] = normalized;
  });
  return params;
}

function resetFilters() {
  filters.violation_type = null;
  filters.action_taken = null;
  filters.policy = null;
  filters.agent_id = "";
  loadReport();
}

async function loadReport() {
  loading.value = true;
  try {
    const resp = await axios.get("/security/dlp/report/", {
      params: reportParams(),
    });
    report.value = resp.data;
  } catch (e) {
    console.error("DLP report load error", e);
  } finally {
    loading.value = false;
  }
}

async function exportCSV() {
  const resp = await axios.get("/security/dlp/report/", {
    params: reportParams({ fmt: "csv" }),
    responseType: "blob",
  });
  const disposition = String(resp.headers?.["content-disposition"] || "");
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const blob = new Blob([resp.data], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = match?.[1] || `dlp_report_${period.value}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

onMounted(loadReport);
</script>

<style scoped>
.timeline-chart {
  overflow: hidden;
}

.dlp-coverage-card {
  border-radius: 8px;
}

.coverage-metric {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
}

.network-runtime {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 10px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.metric-label {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.2;
}

.coverage-table {
  max-height: 280px;
}
</style>
