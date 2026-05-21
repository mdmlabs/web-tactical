<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 720px; max-width: 95vw">
      <q-card-section class="row items-start q-gutter-sm no-wrap">
        <div class="col">
          <div class="text-h6">Policy versions</div>
          <div v-if="policy" class="text-caption text-grey-7 q-mt-xs">
            {{ policy.displayName || policy.name }}
            <span v-if="currentVersion !== undefined">
              · Current: v{{ currentVersion }}
            </span>
          </div>
        </div>

        <q-btn
          flat
          dense
          round
          icon="refresh"
          aria-label="Refresh versions"
          :disable="isLoading"
          @click="onRefresh"
        >
          <q-tooltip>Refresh</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="close" v-close-popup aria-label="Close" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-sm">
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Search by version, name, key..."
          clearable
          debounce="200"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div v-if="isLoading" class="text-center q-pa-lg">
          <q-spinner color="primary" size="2.5em" />
          <div class="q-mt-sm text-caption">Loading version history...</div>
        </div>

        <div v-else-if="isError" class="text-center q-pa-lg">
          <q-icon name="error" color="negative" size="2.5em" />
          <div class="q-mt-sm text-negative">
            {{ errorMessage || "Failed to load policy versions" }}
          </div>
          <q-btn
            flat
            color="primary"
            label="Retry"
            class="q-mt-md"
            @click="onRefresh"
          />
        </div>

        <div v-else-if="!filteredVersions.length" class="text-center q-pa-lg">
          <q-icon name="history_toggle_off" color="grey" size="2.5em" />
          <div class="q-mt-sm text-grey-7">
            {{
              search
                ? "No versions match your search"
                : "No history available for this policy"
            }}
          </div>
        </div>

        <q-table
          v-else
          :rows="filteredVersions"
          :columns="columns"
          row-key="version"
          :pagination="{ rowsPerPage: 10 }"
          flat
          bordered
          dense
        >
          <template v-slot:body-cell-version="props">
            <q-td :props="props" class="text-center">
              <div class="row items-center justify-center q-gutter-xs">
                <span class="text-weight-medium">v{{ props.row.version }}</span>
                <q-badge
                  v-if="isCurrent(props.row.version)"
                  color="primary"
                  label="Current"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-displayName="props">
            <q-td :props="props">
              <div class="ellipsis" :title="props.row.displayName">
                {{ props.row.displayName || props.row.name || "—" }}
              </div>
              <div
                v-if="props.row.explainText"
                class="text-caption text-grey-7 ellipsis"
                :title="props.row.explainText"
              >
                {{ truncate(props.row.explainText, 80) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-scope="props">
            <q-td :props="props" class="text-center">
              {{ scopeLabel(props.row.scope) }}
            </q-td>
          </template>

          <template v-slot:body-cell-policyStatus="props">
            <q-td :props="props" class="text-center">
              <q-badge
                v-if="props.row.policyStatus !== undefined"
                :color="policyStatusColor(props.row.policyStatus)"
                :label="policyStatusLabel(props.row.policyStatus)"
              />
              <span v-else>—</span>
            </q-td>
          </template>

          <template v-slot:body-cell-registry="props">
            <q-td :props="props">
              <div
                class="ellipsis text-caption"
                :title="`${props.row.registryKey} \\ ${props.row.valueName}`"
              >
                {{ props.row.registryKey || "—" }}
              </div>
              <div
                v-if="props.row.valueName"
                class="ellipsis text-caption text-grey-7"
                :title="props.row.valueName"
              >
                {{ props.row.valueName }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn
                flat
                dense
                size="sm"
                icon="restore"
                color="primary"
                label="Restore"
                :disable="isCurrent(props.row.version) || isRestoring"
                :loading="restoringVersion === props.row.version"
                @click="confirmRestore(props.row)"
              >
                <q-tooltip v-if="!isCurrent(props.row.version)">
                  Set this version as current
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import type { QTableProps } from "quasar";
import type { GPOPolicy } from "../../types/gpo";
import type { PolicyVersionRow } from "../../utils/policy-version";
import {
  policyStatusColor,
  policyStatusLabel,
} from "../../utils/policy-status";
import { POLICY_SCOPE_OPTIONS } from "../../utils/policy-descriptor";

interface Props {
  modelValue: boolean;
  policy?: GPOPolicy | null;
  versions: PolicyVersionRow[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
  (e: "restore", payload: { version: number; row: PolicyVersionRow }): void;
}

const props = withDefaults(defineProps<Props>(), {
  policy: null,
  errorMessage: null,
});
const emit = defineEmits<Emits>();
const $q = useQuasar();

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const search = ref("");
const restoringVersion = ref<number | null>(null);
const isRestoring = computed(() => restoringVersion.value !== null);

const currentVersion = computed<number | undefined>(() => {
  const v = props.policy?.version;
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
});

function isCurrent(version: number): boolean {
  return currentVersion.value === version;
}

function truncate(value: string, max: number): string {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function scopeLabel(scope: number | undefined): string {
  if (scope === undefined) return "—";
  const option = POLICY_SCOPE_OPTIONS.find((o) => o.value === scope);
  return option?.label ?? String(scope);
}

const filteredVersions = computed<PolicyVersionRow[]>(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.versions;
  return props.versions.filter((row) => {
    const haystack = [
      `v${row.version}`,
      String(row.version),
      row.name,
      row.displayName,
      row.registryKey,
      row.valueName,
      row.explainText,
      policyStatusLabel(row.policyStatus),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const columns: QTableProps["columns"] = [
  {
    name: "version",
    label: "Version",
    align: "center",
    field: (row: PolicyVersionRow) => row.version,
    sortable: true,
  },
  {
    name: "displayName",
    label: "Display name",
    align: "left",
    field: (row: PolicyVersionRow) => row.displayName || row.name,
    sortable: true,
  },
  {
    name: "scope",
    label: "Scope",
    align: "center",
    field: (row: PolicyVersionRow) => row.scope ?? -1,
    sortable: true,
  },
  {
    name: "policyStatus",
    label: "Status",
    align: "center",
    field: (row: PolicyVersionRow) => row.policyStatus ?? -1,
    sortable: true,
  },
  {
    name: "registry",
    label: "Registry",
    align: "left",
    field: (row: PolicyVersionRow) => row.registryKey,
  },
  {
    name: "actions",
    label: "",
    align: "right",
    field: () => "",
  },
];

function onRefresh(): void {
  emit("refresh");
}

function confirmRestore(row: PolicyVersionRow): void {
  if (isCurrent(row.version)) return;

  $q.dialog({
    title: "Restore policy version",
    message: `Set version <b>v${row.version}</b> as current for "${
      props.policy?.displayName ?? props.policy?.name ?? "policy"
    }"?`,
    html: true,
    cancel: true,
    persistent: true,
    ok: { label: "Restore", color: "primary", icon: "restore" },
  }).onOk(() => {
    restoringVersion.value = row.version;
    emit("restore", { version: row.version, row });
  });
}

watch(
  () => props.isLoading,
  (loading) => {
    if (!loading) restoringVersion.value = null;
  },
);

watch(showDialog, (open) => {
  if (!open) {
    search.value = "";
    restoringVersion.value = null;
  }
});
</script>
