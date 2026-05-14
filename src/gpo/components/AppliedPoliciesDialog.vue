<template>
  <q-dialog
    v-model="dialogVisible"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="applied-policies-dialog">
      <q-card-section class="applied-policies-dialog__header">
        <div class="row items-center no-wrap">
          <q-icon name="devices" size="28px" color="primary" class="q-mr-sm" />
          <div>
            <div class="text-h6">Applied Policies</div>
            <div v-if="agent" class="text-caption text-grey-7">
              <q-icon name="computer" size="14px" class="q-mr-xs" />
              {{ agent.hostname }}
            </div>
          </div>
          <q-space />
          <q-btn
            v-if="agent"
            flat
            round
            dense
            icon="download"
            color="secondary"
            :loading="exportAgentStatusLoading"
            :disable="exportAgentStatusLoading"
            @click="openExportAgentStatusRangeDialog"
          >
            <q-tooltip>Export agent status</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="refresh"
            color="primary"
            :loading="loading"
            @click="refresh"
          >
            <q-tooltip>Refresh</q-tooltip>
          </q-btn>
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="dialogTab"
          inline-label
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
          class="applied-policies-dialog__tabs"
        >
          <q-tab name="assignments">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-icon name="assignment" size="20px" />
              <span>Assignments</span>
              <q-badge
                v-if="assignments.length > 0"
                color="primary"
                :label="assignments.length"
                rounded
                class="q-ml-xs"
              />
            </div>
          </q-tab>
          <q-tab name="effective">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-icon name="verified" size="20px" />
              <span>Effective Policies</span>
              <q-badge
                v-if="effectivePolicies.length > 0"
                color="teal"
                :label="effectivePolicies.length"
                rounded
                class="q-ml-xs"
              />
            </div>
          </q-tab>
          <q-tab name="connectivity">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-icon name="network_check" size="20px" />
              <span>Connectivity</span>
            </div>
          </q-tab>
        </q-tabs>
      </q-card-section>

      <q-separator />

      <q-card-section class="applied-policies-dialog__body">
        <q-tab-panels v-model="dialogTab" animated>
          <q-tab-panel name="assignments" class="q-pa-none">
            <div v-if="loading" class="applied-policies-dialog__empty">
              <q-spinner-dots color="primary" size="40px" />
              <div class="text-body2 text-grey-7 q-mt-md">
                Loading assignments...
              </div>
            </div>

            <template v-else>
              <div v-if="agent" class="row justify-end q-mb-md">
                <q-btn-dropdown
                  outline
                  color="primary"
                  icon="download"
                  label=""
                  :loading="exportAssignmentsLoading"
                  :disable="exportAssignmentsLoading"
                  no-caps
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="handleExportAssignments('csv')"
                    >
                      <q-item-section>CSV</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="handleExportAssignments('xlsx')"
                    >
                      <q-item-section>Excel (XLSX)</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>

              <div
                v-if="assignments.length === 0"
                class="applied-policies-dialog__empty"
              >
                <q-icon name="assignment_late" size="48px" color="grey-4" />
                <div class="text-body1 text-grey-6 q-mt-md">
                  No assignments found
                </div>
                <div class="text-caption text-grey-5 q-mt-xs">
                  Assign policies using the "Apply Policy" dialog
                </div>
              </div>

              <div v-else>
              <q-input
                :model-value="assignmentsSearch"
                dense
                outlined
                clearable
                placeholder="Search by policy name…"
                class="q-mb-md"
                @update:model-value="onAssignmentsSearchInput"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <div
                v-if="filteredAssignments.length === 0"
                class="applied-policies-dialog__empty
                  applied-policies-dialog__empty--compact"
              >
                <q-icon name="search_off" size="36px" color="grey-4" />
                <div class="text-body2 text-grey-6 q-mt-sm">
                  No policies match your search
                </div>
              </div>

              <q-table
                v-else
                :rows="filteredAssignments"
                :columns="assignmentColumns"
                row-key="id"
                flat
                bordered
                :loading="loading"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
                class="applied-policies-dialog__table"
              >
                <template v-slot:body-cell-policy="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">
                      {{
                        props.row.displayName ||
                        props.row.name ||
                        props.row.policyHash ||
                        props.row.policy_hash ||
                        props.row.id
                      }}
                    </div>
                    <q-expansion-item
                      v-if="props.row.explainText || props.row.description"
                      dense
                      dense-toggle
                      switch-toggle-side
                      header-class="effective-desc-toggle q-px-none"
                      class="q-mt-xs"
                    >
                      <template v-slot:header>
                        <q-item-section class="text-caption text-grey-7">
                          Description
                        </q-item-section>
                      </template>
                      <div
                        class="text-caption text-grey-8 q-pl-md q-pb-xs"
                        style="white-space: pre-wrap; line-height: 1.5"
                      >
                        {{ props.row.explainText || props.row.description }}
                      </div>
                    </q-expansion-item>
                  </q-td>
                </template>

                <template v-slot:body-cell-desired_state="props">
                  <q-td :props="props">
                    <q-badge
                      :color="desiredStateBadgeColor(props.row)"
                      :label="desiredStateLabel(props.row)"
                      outline
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-override="props">
                  <q-td :props="props">
                    <q-badge
                      v-if="props.row.override || props.row.overridden"
                      color="orange-8"
                      :label="formatOverride(props.row.override ?? props.row.overridden)"
                      outline
                    />
                    <q-badge
                      v-else
                      color="grey-5"
                      label="None"
                      outline
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-state="props">
                  <q-td :props="props">
                    <span
                      v-if="assignmentStateItems(props.row).length === 0"
                      class="text-grey-5"
                    >
                      {{
                        "No parameters"
                      }}
                    </span>
                    <div v-else class="assignment-values-block">
                      <q-expansion-item
                        dense
                        dense-toggle
                        switch-toggle-side
                        header-class="assignment-values-expansion-header effective-desc-toggle q-px-none"
                        class="assignment-values-expansion q-mt-xs"
                      >
                        <template v-slot:header>
                          <q-item-section
                            side
                            class="assignment-values-expansion__icon"
                          >
                            <q-icon name="subject" size="18px" class="text-grey-6" />
                          </q-item-section>
                          <q-item-section>
                            <div class="row items-center no-wrap q-gutter-x-sm">
                              <span
                                class="assignment-values-expansion__label text-caption text-grey-6"
                              >
                                Parameters
                              </span>
                              <q-badge
                                outline
                                color="grey-6"
                                :label="String(assignmentStateItems(props.row).length)"
                              />
                            </div>
                            <div class="assignment-values-summary text-caption text-grey-8 q-mt-xs">
                              {{ assignmentStateSummary(props.row) }}
                            </div>
                          </q-item-section>
                        </template>
                        <div class="assignment-values-panel">
                          <div
                            v-for="it in assignmentStateItems(props.row)"
                            :key="it.idName"
                            class="assignment-values-row"
                          >
                            <div class="assignment-values-key">
                              {{ it.idName }}
                            </div>
                            <div class="assignment-values-val">
                              {{ it.value || "—" }}
                            </div>
                          </div>
                        </div>
                      </q-expansion-item>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-target="props">
                  <q-td :props="props">
                    <q-badge
                      v-if="targetLabel(props.row)"
                      :color="targetBadgeColor(props.row)"
                      :label="targetLabel(props.row)"
                      outline
                    />
                    <span v-else class="text-grey-5">—</span>
                  </q-td>
                </template>

                <template v-slot:body-cell-user="props">
                  <q-td :props="props">
                    <div v-if="assignmentUserName(props.row)" class="text-weight-medium">
                      {{ assignmentUserName(props.row) }}
                    </div>
                    <span v-else class="text-grey-5">—</span>
                  </q-td>
                </template>

                <template v-slot:body-cell-scope="props">
                  <q-td :props="props">
                    <q-badge
                      :color="scopeBadgeColor(props.row)"
                      :label="scopeLabel(props.row)"
                      outline
                    />
                  </q-td>
                </template>

              </q-table>
              </div>
            </template>
          </q-tab-panel>

          <q-tab-panel name="effective" class="q-pa-none">
            <div v-if="loading" class="applied-policies-dialog__empty">
              <q-spinner-dots color="primary" size="40px" />
              <div class="text-body2 text-grey-7 q-mt-md">
                Loading effective policies...
              </div>
            </div>

            <template v-else>
              <div v-if="agent" class="row justify-end q-mb-md">
                <q-btn-dropdown
                  outline
                  color="teal"
                  icon="download"
                  label=""
                  :loading="exportEffectiveLoading"
                  :disable="exportEffectiveLoading"
                  no-caps
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="handleExportEffectivePolicies('csv')"
                    >
                      <q-item-section>CSV</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="handleExportEffectivePolicies('xlsx')"
                    >
                      <q-item-section>Excel (XLSX)</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>

              <div
                v-if="effectivePolicies.length === 0"
                class="applied-policies-dialog__empty"
              >
                <q-icon name="policy" size="48px" color="grey-4" />
                <div class="text-body1 text-grey-6 q-mt-md">
                  No effective policies
                </div>
                <div class="text-caption text-grey-5 q-mt-xs">
                  Effective policies appear after assignments are resolved
                </div>
              </div>

              <div v-else>
              <q-input
                :model-value="effectiveSearch"
                dense
                outlined
                clearable
                placeholder="Search by policy name…"
                class="q-mb-md"
                @update:model-value="onEffectiveSearchInput"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <div
                v-if="filteredEffectivePolicies.length === 0"
                class="applied-policies-dialog__empty
                  applied-policies-dialog__empty--compact"
              >
                <q-icon name="search_off" size="36px" color="grey-4" />
                <div class="text-body2 text-grey-6 q-mt-sm">
                  No policies match your search
                </div>
              </div>

              <q-table
                v-else
                :rows="filteredEffectivePolicies"
                :columns="effectiveColumns"
                :row-key="(row: Record<string, unknown>) => String(row.policyHash || row.policy_hash || row.id)"
                flat
                bordered
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
                class="applied-policies-dialog__table"
              >
                <template v-slot:body-cell-policy="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">
                      {{
                        props.row.displayName ||
                        props.row.name ||
                        props.row.policyHash ||
                        props.row.policy_hash
                      }}
                    </div>
                    <q-expansion-item
                      v-if="effectiveDescriptionText(props.row)"
                      dense
                      dense-toggle
                      switch-toggle-side
                      header-class="effective-desc-toggle q-px-none"
                      class="q-mt-xs"
                    >
                      <template v-slot:header>
                        <q-item-section class="text-caption text-grey-7">
                          Description
                        </q-item-section>
                      </template>
                      <div
                        class="text-caption text-grey-8 q-pl-md q-pb-xs"
                        style="white-space: pre-wrap; line-height: 1.5"
                      >
                        {{ effectiveDescriptionText(props.row) }}
                      </div>
                    </q-expansion-item>
                  </q-td>
                </template>

                <template v-slot:body-cell-source="props">
                  <q-td :props="props">
                    <q-badge
                      :color="sourceBadgeColor(props.row)"
                      :label="policySourceLabel(props.row)"
                      outline
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-user="props">
                  <q-td :props="props">
                    <span
                      v-if="effectiveUserColumnLabel(props.row)"
                      class="text-weight-medium"
                    >
                      {{ effectiveUserColumnLabel(props.row) }}
                    </span>
                    <span v-else class="text-grey-5">—</span>
                  </q-td>
                </template>

                <template v-slot:body-cell-scope="props">
                  <q-td :props="props">
                    <q-badge
                      :color="scopeBadgeColor(props.row)"
                      :label="effectiveScopeLabel(props.row)"
                      outline
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-values="props">
                  <q-td :props="props">
                    <span
                      v-if="
                        policySelectionToParamItems(
                          props.row.selection ?? props.row.Selection,
                        ).length === 0
                      "
                      class="text-grey-5"
                    >
                      No parameters
                    </span>
                    <div v-else class="assignment-values-block">
                      <q-expansion-item
                        dense
                        dense-toggle
                        switch-toggle-side
                        header-class="assignment-values-expansion-header effective-desc-toggle q-px-none"
                        class="assignment-values-expansion q-mt-xs"
                      >
                        <template v-slot:header>
                          <q-item-section
                            side
                            class="assignment-values-expansion__icon"
                          >
                            <q-icon name="subject" size="18px" class="text-grey-6" />
                          </q-item-section>
                          <q-item-section>
                            <div class="row items-center no-wrap q-gutter-x-sm">
                              <span
                                class="assignment-values-expansion__label text-caption text-grey-6"
                              >
                                Parameters
                              </span>
                              <q-badge
                                outline
                                color="grey-6"
                                :label="
                                  String(
                                    policySelectionToParamItems(
                                      props.row.selection ?? props.row.Selection,
                                    ).length,
                                  )
                                "
                              />
                            </div>
                            <div
                              class="assignment-values-summary text-caption text-grey-8 q-mt-xs"
                            >
                              {{ effectivePolicySelectionSummary(props.row) }}
                            </div>
                          </q-item-section>
                        </template>
                        <div class="assignment-values-panel">
                          <div
                            v-for="(it, effValIdx) in policySelectionToParamItems(
                              props.row.selection ?? props.row.Selection,
                            )"
                            :key="`eff-sel-${effValIdx}`"
                            class="assignment-values-row"
                          >
                            <div class="assignment-values-key">
                              {{ it.idName }}
                            </div>
                            <div class="assignment-values-val">
                              {{ it.value || "—" }}
                            </div>
                          </div>
                        </div>
                      </q-expansion-item>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" auto-width>
                    <q-btn
                      v-if="agent"
                      flat
                      dense
                      round
                      icon="delete_outline"
                      color="negative"
                      size="sm"
                      :loading="
                        removingPolicyHash ===
                        String(
                          props.row.policyHash || props.row.policy_hash || '',
                        )
                      "
                      :disable="!!removingPolicyHash"
                      @click="onRemoveEffectivePolicy(props.row)"
                    >
                      <q-tooltip>Remove policy</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
              </div>
            </template>
          </q-tab-panel>

          <q-tab-panel name="connectivity" class="q-pa-none">
            <ConnectivityPoliciesTab
              v-if="agent"
              compact
              :fixed-target="{ type: 'agent', agentId: agent.id }"
              @changed="refresh"
            />
            <div v-else class="applied-policies-dialog__empty">
              <q-icon name="info" size="40px" color="grey-5" />
              <div class="text-body2 text-grey-6 q-mt-sm">
                Select an agent to view connectivity policies
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn
          flat
          label="Close"
          color="grey-7"
          @click="dialogVisible = false"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ExportAgentStatusRangeDialog
    v-model="exportAgentStatusRangeOpen"
    @confirm="onExportAgentStatusRangeConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { QTableColumn } from "quasar";

import {
  agentServiceClientWrapper,
  policyAssignmentClient,
  policyStateClient,
  policySelectionToParamItems,
  type PolicyTargetType,
  type PolicyTargetParams,
} from "../api/grpc-client";
import export_pb from "@/generated/common/export_pb";
import { notifySuccess, notifyError } from "@/utils/notify";
import ConnectivityPoliciesTab from "./ConnectivityPolicy/ConnectivityPoliciesTab.vue";
import ExportAgentStatusRangeDialog from "./ExportAgentStatusRangeDialog.vue";
import type { ExportAgentStatusRangePayload } from "./ExportAgentStatusRangeDialog.vue";

interface Agent {
  id: string;
  hostname: string;
  status: string;
}

interface DialogUser {
  sid: string;
  name?: string;
  displayName?: string;
  // samAccountName?: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent: Agent | null;
  assignments?: Array<Record<string, unknown>>;
  effectivePolicies?: Array<Record<string, unknown>>;
  users?: DialogUser[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}>();

const refresh = () => emit("refresh");

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dialogTab = ref("assignments");
const assignmentsSearch = ref("");
const effectiveSearch = ref("");
const removingPolicyHash = ref<string | null>(null);
const exportAssignmentsLoading = ref(false);
const exportEffectiveLoading = ref(false);
const exportAgentStatusLoading = ref(false);
const exportAgentStatusRangeOpen = ref(false);

function downloadBlob(
  content: Uint8Array | string,
  fileName: string,
  mimeType: string,
) {
  const bytes =
    typeof content === "string"
      ? new Uint8Array(
          Array.from(atob(content), (c) => c.codePointAt(0) ?? 0),
        )
      : new Uint8Array(content);
  const blob = new Blob([bytes.buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportFileBaseName(kind: "assignments" | "effective"): string {
  const host = props.agent
    ? String(props.agent.hostname || props.agent.id).replaceAll(
        /[^a-zA-Z0-9._-]+/g,
        "_",
      )
    : "agent";
  return `policy_${kind}_${host}`;
}

function exportMimeType(format: export_pb.ExportFormat | number | undefined): string {
  if (format === export_pb.ExportFormat.XLSX) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  return "text/csv";
}

function exportExtension(format: export_pb.ExportFormat | number | undefined): string {
  if (format === export_pb.ExportFormat.XLSX) {
    return "xlsx";
  }
  return "csv";
}

function openExportAgentStatusRangeDialog() {
  if (!props.agent) return;
  exportAgentStatusRangeOpen.value = true;
}

async function onExportAgentStatusRangeConfirm(
  range: ExportAgentStatusRangePayload,
) {
  if (!props.agent) return;
  exportAgentStatusLoading.value = true;
  try {
    const res = await agentServiceClientWrapper.exportAgentStatusFor(
      "agent",
      { agentId: props.agent.id },
      {
        fromUtc: range.fromUtc,
        toUtc: range.toUtc,
      },
    );
    const ext = exportExtension(res.exportFormat);
    const fallbackName = `agent_status_${String(
      props.agent.hostname || props.agent.id,
    ).replaceAll(/[^a-zA-Z0-9._-]+/g, "_")}.${ext}`;
    downloadBlob(
      res.content,
      res.fileName || fallbackName,
      exportMimeType(res.exportFormat),
    );
    notifySuccess(
      res.exportFormat === export_pb.ExportFormat.XLSX
        ? "Agent status exported as XLSX"
        : "Agent status exported as CSV",
    );
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to export agent status",
    );
  } finally {
    exportAgentStatusLoading.value = false;
  }
}

async function handleExportAssignments(format: "csv" | "xlsx") {
  if (!props.agent) return;
  exportAssignmentsLoading.value = true;
  try {
    const exportFormat =
      format === "xlsx"
        ? export_pb.ExportFormat.XLSX
        : export_pb.ExportFormat.CSV;
    const res = await policyStateClient.exportAssignmentsFor("agent", {
      agentId: props.agent.id,
      exportFormat,
    });
    const mimeType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
    const fallbackName = `${exportFileBaseName("assignments")}.${format}`;
    downloadBlob(res.content, res.fileName || fallbackName, mimeType);
    notifySuccess(
      format === "xlsx"
        ? "Assignments exported as XLSX"
        : "Assignments exported as CSV",
    );
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to export assignments",
    );
  } finally {
    exportAssignmentsLoading.value = false;
  }
}

async function handleExportEffectivePolicies(format: "csv" | "xlsx") {
  if (!props.agent) return;
  exportEffectiveLoading.value = true;
  try {
    const exportFormat =
      format === "xlsx"
        ? export_pb.ExportFormat.XLSX
        : export_pb.ExportFormat.CSV;
    const res = await policyStateClient.exportEffectivePoliciesFor("agent", {
      agentId: props.agent.id,
      exportFormat,
    });
    const mimeType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
    const fallbackName = `${exportFileBaseName("effective")}.${format}`;
    downloadBlob(res.content, res.fileName || fallbackName, mimeType);
    notifySuccess(
      format === "xlsx"
        ? "Effective policies exported as XLSX"
        : "Effective policies exported as CSV",
    );
  } catch (err) {
    notifyError(
      err instanceof Error
        ? err.message
        : "Failed to export effective policies",
    );
  } finally {
    exportEffectiveLoading.value = false;
  }
}

function onAssignmentsSearchInput(value: string | number | null | undefined) {
  assignmentsSearch.value = value == null ? "" : String(value);
}

function onEffectiveSearchInput(value: string | number | null | undefined) {
  effectiveSearch.value = value == null ? "" : String(value);
}

watch(dialogVisible, (open) => {
  if (!open) {
    assignmentsSearch.value = "";
    effectiveSearch.value = "";
  }
});

const loading = computed(() => !!props.loading);
const assignments = computed(() => props.assignments || []);
const effectivePolicies = computed(() => props.effectivePolicies || []);
const users = computed(() => props.users || []);
const usersBySid = computed(() => {
  const map = new Map<string, DialogUser>();
  for (const user of users.value) {
    const sid = String(user.sid || "").trim();
    if (sid) map.set(sid, user);
  }
  return map;
});

function assignmentPolicyName(row: Record<string, unknown>): string {
  return String(
    row["displayName"] ??
      row["display_name"] ??
      row["name"] ??
      row["policyHash"] ??
      row["policy_hash"] ??
      row["id"] ??
      "",
  ).toLowerCase();
}

function effectivePolicyName(p: Record<string, unknown>): string {
  return String(
    p["displayName"] ?? p["name"] ?? p["policyHash"] ?? p["policy_hash"] ?? "",
  ).toLowerCase();
}

function effectivePolicyRowSid(row: Record<string, unknown>): string {
  return String(
    row["userSid"] ?? row["user_sid"] ?? row["usersid"] ?? "",
  ).trim();
}

function effectiveSummaryObject(
  row: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const s = row["summary"];
  if (s && typeof s === "object" && !Array.isArray(s)) {
    return s as Record<string, unknown>;
  }
  return undefined;
}

function effectivePolicySearchBlob(row: Record<string, unknown>): string {
  const parts: string[] = [effectivePolicyName(row), effectivePolicyRowSid(row)];
  parts.push(scopeLabel(row).toLowerCase());
  const sum = effectiveSummaryObject(row);
  if (sum) {
    parts.push(
      String(sum["id"] ?? ""),
      String(sum["name"] ?? ""),
      String(sum["displayName"] ?? sum["display_name"] ?? ""),
    );
  }
  return parts.join(" ").toLowerCase();
}

function effectiveUserColumnLabel(row: Record<string, unknown>): string {
  const sid = effectivePolicyRowSid(row);
  if (!sid) return "";
  if (sid === "Machine") return "Machine";
  const user = usersBySid.value.get(sid);
  if (user) {
    const name = String(user.displayName || user.name || "").trim();
    if (name) return name;
  }
  return "User";
}

function assignmentUserName(row: Record<string, unknown>): string {
  const sid = assignmentSid(row);
  if (!sid) return "";
  if (sid === "Machine") return "Machine";
  const user = usersBySid.value.get(sid);
  if (!user) return "";
  return String(
    user.displayName || user.name  || user.sid || "",
  ).trim();
}

const filteredAssignments = computed(() => {
  const list = assignments.value;
  const q = assignmentsSearch.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((row) => {
    const userName = assignmentUserName(row).toLowerCase();
    const sid = assignmentSid(row).toLowerCase();
    return (
      assignmentPolicyName(row).includes(q) ||
      userName.includes(q) ||
      sid.includes(q)
    );
  });
});

const filteredEffectivePolicies = computed(() => {
  const list = effectivePolicies.value;
  const q = effectiveSearch.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    if (effectivePolicySearchBlob(p).includes(q)) return true;
    const items = policySelectionToParamItems(
      p["selection"] ?? p["Selection"],
    );
    for (const it of items) {
      if (
        it.idName.toLowerCase().includes(q) ||
        it.value.toLowerCase().includes(q)
      ) {
        return true;
      }
    }
    return false;
  });
});

const assignmentColumns: QTableColumn[] = [
  {
    name: "policy",
    required: true,
    label: "Policy",
    align: "left",
    field: (row: Record<string, unknown>) =>
      String(
        row["displayName"] ||
          row["display_name"] ||
          row["name"] ||
          row["policyHash"] ||
          row["policy_hash"] ||
          row["id"] ||
          "",
      ),
    sortable: true,
    style: "min-width: 260px",
  },

  {
    name: "override",
    label: "Override",
    align: "center",
    field: (row: Record<string, unknown>) =>
      row["override"] ?? row["overridden"] ?? false,
  },
  {
    name: "state",
    label: "Values",
    align: "left",
    field: (row: Record<string, unknown>) => assignmentStateItems(row).length,
    sortable: true,
    style: "min-width: 240px",
  },
  {
    name: "target",
    label: "Target",
    align: "center",
    field: (row: Record<string, unknown>) =>
      String(
        row["target"] ||
          row["targetName"] ||
          row["userId"] ||
          row["userSid"] ||
          "",
      ),
  },
  {
    name: "user",
    label: "User",
    align: "left",
    field: (row: Record<string, unknown>) =>
      assignmentUserName(row) || assignmentSid(row),
    sortable: true,
    style: "max-width: 120px",
  },
  {
    name: "scope",
    label: "Scope",
    align: "center",
    field: (row: Record<string, unknown>) =>
      String(
        row["scope"] ??
          (row["summary"] as Record<string, unknown> | undefined)?.["scope"] ??
          "",
      ),
  },
];

const effectiveColumns: QTableColumn[] = [
  {
    name: "policy",
    required: true,
    label: "Policy",
    align: "left",
    field: (row: Record<string, unknown>) =>
      String(
        row["displayName"] || row["name"] || row["policyHash"] || row["policy_hash"] || "",
      ),
    sortable: true,
    style: "min-width: 260px",
  },
  {
    name: "source",
    label: "Source",
    align: "center",
    field: (row: Record<string, unknown>) =>
      String(row["policySource"] ?? row["policy_source"] ?? row["source"] ?? ""),
  },
  {
    name: "values",
    label: "Values",
    align: "left",
    field: (row: Record<string, unknown>) =>
      policySelectionToParamItems(
        row["selection"] ?? row["Selection"],
      ).length,
    sortable: true,
    style: "min-width: 240px",
  },
  
  {
    name: "user",
    label: "User",
    align: "left",
    field: (row: Record<string, unknown>) =>
      effectiveUserColumnLabel(row) || "—",
    sortable: true,
    style: "max-width: 200px",
  },
  {
    name: "scope",
    label: "Scope",
    align: "center",
    field: (row: Record<string, unknown>) => scopeLabel(row),
  },

  {
    name: "actions",
    label: "",
    align: "right",
    field: () => "",
  },
];

function formatOverride(o: unknown): string {
  if (o === undefined || o === null) return "—";

  if (typeof o === "string" || typeof o === "number" || typeof o === "boolean")
    return String(o);

  if (typeof o === "object") {
    const obj = o as Record<string, unknown>;
    const keysPrefer = [
      "stringValue",
      "string_value",
      "value",
      "dword",
      "int32",
      "int64",
    ];
    for (const k of keysPrefer) {
      if (k in obj && obj[k] !== undefined && obj[k] !== null) {
        const v = obj[k];
        if (
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
        )
          return String(v);
        try {
          return JSON.stringify(v);
        } catch {
          return "—";
        }
      }
    }

    for (const [, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue;
      if (typeof v === "object") continue;
      return String(v);
    }

    try {
      return JSON.stringify(obj);
    } catch {
      return "—";
    }
  }

  return String(o);
}

function policySourceLabel(p: Record<string, unknown>): string {
  const src =
    (p && (p["policySource"] ?? p["policy_source"] ?? p["source"])) ?? null;
  if (src === null || src === undefined) return "Unspecified";

  const num = Number(src);
  if (!Number.isNaN(num)) {
    switch (num) {
      case 0:
        return "Unspecified ";
      case 1:
        return "Global";
      case 2:
        return "Agent";
      case 3:
        return "User";
      default:
        return String(src);
    }
  }

  const s = String(src).toUpperCase();
  if (s.includes("GLOBAL")) return "Global";
  if (s.includes("AGENT")) return "Agent";
  if (s.includes("USER")) return "User";
  return String(src);
}

function targetLabel(row: Record<string, unknown>): string {
  if (!row) return "";
  const t =
    row["target"] ??
    row["targetObject"] ??
    row["target_obj"] ??
    row["target"] ??
    null;
  if (!t) {
    if (row["userId"] || row["userSid"] || row["user_sid"]) return "User";
    return "";
  }

  if (typeof t === "string") {
    return t;
  }

  if (typeof t === "object") {
    const obj = t as Record<string, unknown>;
    if ("agent" in obj) return "Agent";
    if ("user" in obj) return "User";

    for (const k of ["agentId", "agent_id"]) {
      if (k in obj) return "Agent";
    }
    return JSON.stringify(obj);
  }

  return String(t);
}

function assignmentSid(row: Record<string, unknown>): string {
  return String(row["sid"] ?? row["userSid"] ?? row["user_sid"] ?? "").trim();
}

function effectivePolicySelectionSummary(row: Record<string, unknown>): string {
  const items = policySelectionToParamItems(
    row["selection"] ?? row["Selection"],
  );
  const n = items.length;
  if (n === 0) return "No parameters";
  const first = items[0];
  const firstText = first.value
    ? `${first.idName}: ${first.value}`
    : first.idName;
  if (n === 1) return firstText;
  return `${firstText} +${n - 1}`;
}

function assignmentStateItems(
  row: Record<string, unknown>,
): Array<{ idName: string; value: string }> {
  function normalizeStateValue(raw: unknown): string {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "string") return raw.trim();
    if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
    if (typeof raw !== "object") return String(raw);

    const obj = raw as Record<string, unknown>;
    const keysPrefer = [
      "value",
      "stringValue",
      "string_value",
      "dword",
      "int32",
      "int64",
      "numberValue",
      "number_value",
      "boolValue",
      "bool_value",
    ];
    for (const k of keysPrefer) {
      const v = obj[k];
      if (v === null || v === undefined) continue;
      if (typeof v === "string") return v.trim();
      if (typeof v === "number" || typeof v === "boolean") return String(v);
    }
    return "";
  }

  const raw =
    row["state"] ??
    row["stateList"] ??
    row["state_list"] ??
    row["states"] ??
    null;

  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((it) => {
      if (!it || typeof it !== "object") return null;
      const obj = it as Record<string, unknown>;
      const idName = String(obj["idName"] ?? obj["id_name"] ?? "").trim();
      const value = normalizeStateValue(obj["value"]);
      if (!idName) return null;
      return { idName, value };
    })
    .filter((v): v is { idName: string; value: string } => v !== null);
}

function assignmentStateSummary(row: Record<string, unknown>): string {
  const items = assignmentStateItems(row);
  const n = items.length;
  if (n === 0) return "No parameters";
  const first = items[0];
  const firstText = first.value ? `${first.idName}: ${first.value}` : first.idName;
  if (n === 1) return firstText;
  return `${firstText} +${n - 1}`;
}

function policyScopeEnumLabel(scope: unknown): string | null {
  if (scope === null || scope === undefined) return null;
  if (
    typeof scope === "number" ||
    (typeof scope === "string" && /^\d+$/.test(scope))
  ) {
    const num = Number(scope);
    switch (num) {
      case 0:
        return "None";
      case 1:
        return "User";
      case 2:
        return "Machine";
      case 3:
        return "Both";
      default:
        return null;
    }
  }
  return null;
}

function scopeLabel(row: Record<string, unknown>): string {
  const scope =
    row["scope"] ??
    (row["summary"] as Record<string, unknown> | undefined)?.["scope"];
  if (scope === null || scope === undefined) return "—";
  const fromEnum = policyScopeEnumLabel(scope);
  if (fromEnum) return fromEnum;
  const s = String(scope).toUpperCase();
  if (s.includes("USER") && s.includes("MACHINE")) return "Both";
  if (s.includes("USER")) return "User";
  if (s.includes("MACHINE")) return "Machine";
  if (s.includes("BOTH")) return "Both";
  if (s.includes("NONE")) return "None";
  return String(scope);
}

function effectiveScopeLabel(p: Record<string, unknown>): string {
  return scopeLabel(p);
}

function effectiveDescriptionText(p: Record<string, unknown>): string {
  const t = String(p["explainText"] || p["description"] || "").trim();
  return t;
}

function removeTargetForEffective(
  p: Record<string, unknown>,
  agentId: string,
): { targetType: PolicyTargetType; params: PolicyTargetParams } {
  const userSid = effectivePolicyRowSid(p);
  if (userSid) {
    return {
      targetType: "user_on_agent",
      params: { agentId, userSid },
    };
  }
  return {
    targetType: "agent",
    params: { agentId },
  };
}

async function onRemoveEffectivePolicy(p: Record<string, unknown>) {
  if (!props.agent) return;
  const policyHash = String(p["policyHash"] || p["policy_hash"] || "").trim();
  if (!policyHash) {
    notifyError("Policy hash is missing");
    return;
  }
  removingPolicyHash.value = policyHash;
  try {
    const { targetType, params } = removeTargetForEffective(
      p,
      String(props.agent.id),
    );
    await policyAssignmentClient.removePolicy(policyHash, targetType, params);
    notifySuccess("Policy removed");
    refresh();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error removing policy";
    notifyError(`Error removing policy: ${errorMessage}`);
  } finally {
    removingPolicyHash.value = null;
  }
}

function desiredStateBadgeColor(row: Record<string, unknown>): string {
  const label = desiredStateLabel(row);
  if (label === "Enabled") return "positive";
  if (label === "Disabled") return "negative";
  return "grey-6";
}

function targetBadgeColor(row: Record<string, unknown>): string {
  const label = targetLabel(row);
  if (label === "Agent") return "blue-7";
  if (label === "User") return "purple-7";
  return "grey-6";
}

function scopeBadgeColor(row: Record<string, unknown>): string {
  const label = scopeLabel(row);
  if (label === "Machine") return "blue-7";
  if (label === "User") return "purple-7";
  if (label === "Both") return "teal-7";
  return "grey-6";
}

function sourceBadgeColor(row: Record<string, unknown>): string {
  const label = policySourceLabel(row);
  if (label === "Global") return "deep-purple-6";
  if (label === "Agent") return "blue-7";
  if (label === "User") return "purple-7";
  return "grey-6";
}

function desiredStateLabel(row: Record<string, unknown>): string {
  const raw = row["desiredState"] ?? row["desired_state"] ?? null;
  if (raw === null || raw === undefined) return "Unspecified";

  const num = Number(raw);
  if (!Number.isNaN(num)) {
    switch (num) {
      case 0:
        return "Unspecified";
      case 1:
        return "Enabled";
      case 2:
        return "Disabled";
      default:
        return String(raw);
    }
  }

  const s = String(raw).toUpperCase();
  if (s.includes("ENABLED")) return "Enabled";
  if (s.includes("DISABLED")) return "Disabled";
  if (s.includes("UNSPECIFIED")) return "Unspecified";
  return String(raw);
}
</script>

<style scoped lang="sass">
.applied-policies-dialog
  min-width: 1200px
  max-width: 1200px
  max-height: 85vh
  display: flex
  flex-direction: column

.applied-policies-dialog__header
  padding: 16px 20px

.applied-policies-dialog__tabs
  :deep(.q-tab)
    padding: 8px 20px
    min-height: 48px

.applied-policies-dialog__body
  overflow: auto
  flex: 1
  min-height: 0
  padding: 16px 20px

.applied-policies-dialog__table
  :deep(thead th)
    font-weight: 600
    font-size: 12px
    text-transform: uppercase
    letter-spacing: 0.5px
    color: var(--q-grey-7)
  :deep(tbody td)
    padding-top: 10px
    padding-bottom: 10px

.applied-policies-dialog__empty
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 48px 24px
  text-align: center

.applied-policies-dialog__empty--compact
  padding: 24px 16px

.assignment-description
  max-width: 400px
  line-height: 1.4

.effective-desc-toggle
  min-height: 28px !important
  padding-top: 0
  padding-bottom: 0

.assignment-values-block
  border-left: 2px solid rgba(0, 0, 0, 0.1)
  padding-left: 12px
  margin-left: 2px

.assignment-values-expansion
  background: transparent

.assignment-values-expansion-header
  align-items: flex-start !important

.assignment-values-expansion__icon
  min-width: 32px
  padding-right: 4px

.assignment-values-expansion__label
  font-weight: 600
  letter-spacing: 0.06em
  text-transform: uppercase
  font-size: 10px

.assignment-values-summary
  max-width: 320px
  line-height: 1.35
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  word-break: break-word

.assignment-values-panel
  padding: 6px 0 4px
  margin-top: 2px
  border-top: 1px solid rgba(0, 0, 0, 0.06)

.assignment-values-row
  padding: 10px 0
  border-bottom: 1px solid rgba(0, 0, 0, 0.05)
  &:last-child
    border-bottom: none
    padding-bottom: 2px

.assignment-values-key
  font-size: 11px
  font-weight: 600
  letter-spacing: 0.04em
  text-transform: uppercase
  color: var(--q-grey-6)
  margin-bottom: 6px
  word-break: break-word

.assignment-values-val
  font-size: 13px
  line-height: 1.45
  color: var(--q-grey-9)
  padding: 7px 10px
  background: rgba(0, 0, 0, 0.02)
  border: 1px solid rgba(0, 0, 0, 0.09)
  border-radius: 4px
  font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace
  white-space: pre-wrap
  word-break: break-word
</style>
