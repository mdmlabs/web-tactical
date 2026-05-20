<template>
  <div class="gpo-collections-table">
    <div class="gpo-content-header row items-center no-wrap">
      <div class="text-h6 q-pa-md">Collections</div>
      <q-space />
      <q-select
        v-model="scopeFilter"
        :options="scopeFilterOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        label="Scope"
        dense
        outlined
        class="scope-filter-select q-mr-md"
        style="min-width: 140px"
      />
      <q-btn
        flat
        dense
        color="secondary"
        icon="download"
        class="q-mr-sm"
        :loading="exportCollectionsLoading"
        :disable="loading"
      >
        <q-tooltip>Export collections</q-tooltip>
        <q-menu>
          <q-list dense>
            <q-item
              v-close-popup
              clickable
              :disable="exportCollectionsLoading"
              @click="runExportCollectionPolicies('csv')"
            >
              <q-item-section>CSV</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              :disable="exportCollectionsLoading"
              @click="runExportCollectionPolicies('xlsx')"
            >
              <q-item-section>XLSX</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label=""
        class="q-mr-md"
        @click="openCreateCollection"
      />
      <q-separator />
    </div>
    <q-scroll-area class="gpo-collections-table__scroll">
      <div class="q-pa-md">
        <q-table
          :rows="filteredCollectionsList"
          :columns="collectionsTableColumns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 20 }"
          :rows-per-page-options="[20, 50, 100]"
          flat
          bordered
          dense
          class="cursor-pointer"
          @row-click="onRowClick"
        >
        <template v-slot:body-cell-scope="props">
          <q-td :props="props">
            <div class="scope-cell" :class="scopeCellClass(props.row.scope)">
              <q-icon
                v-for="icon in scopeIcons(props.row.scope)"
                :key="icon"
                :name="icon"
                size="sm"
                class="q-mr-xs"
              />
              <span>{{ scopeLabel(props.row.scope) }}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="no-wrap justify-center q-gutter-xs">
              <q-btn
                icon="edit"
                size="s"
                flat
                dense
                round
                color="primary"
                @click.stop="openEditCollection(props.row)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                size="s"
                flat
                dense
                round
                color="negative"
                @click.stop="onDelete(props.row)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        </q-table>
      </div>
    </q-scroll-area>

    <q-dialog
      v-model="detailsDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="collection-details-dialog">
        <q-card-section class="collection-details-dialog__header">
          <div class="row items-center no-wrap">
            <q-icon
              name="library_books"
              size="28px"
              color="primary"
              class="q-mr-sm"
            />
            <div>
              <div class="text-h6">Collection details</div>
              <div v-if="detailsDialogRowName" class="text-caption text-grey-7">
                {{ detailsDialogRowName }}
              </div>
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section
          v-if="detailsLoading && !collectionDetails"
          class="collection-details-dialog__body collection-details-dialog__body--center"
        >
          <q-spinner-dots color="primary" size="40px" />
          <div class="text-body2 text-grey-7 q-mt-md">Loading collection…</div>
        </q-card-section>

        <q-card-section
          v-else-if="!collectionDetails"
          class="collection-details-dialog__body collection-details-dialog__empty"
        >
          <q-icon name="error_outline" size="48px" color="grey-4" />
          <div class="text-body1 text-grey-6 q-mt-md">
            Collection could not be loaded
          </div>
        </q-card-section>

        <template v-else>
          <q-card-section
            class="collection-details-dialog__body column no-wrap"
          >
            <div class="collection-details-dialog__body-top">
              <div class="q-gutter-md q-mb-md">
                <div>
                  <div class="text-caption text-grey-7 text-uppercase">
                    Name
                  </div>
                  <div class="text-body1">
                    {{ collectionDetails.name || "—" }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-grey-7 text-uppercase">
                    Description
                  </div>
                  <div
                    class="text-body2"
                    style="white-space: pre-wrap; line-height: 1.5"
                  >
                    {{
                      collectionDetails.explainText ??
                      collectionDetails.explain_text ??
                      "—"
                    }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-grey-7 text-uppercase">
                    Scope
                  </div>
                  <q-badge
                    :color="
                      collectionDetailScopeBadgeColor(
                        collectionDetails.scope ??
                          operator_pb.PolicyScope.POLICY_SCOPE_NONE,
                      )
                    "
                    :label="
                      scopeLabel(
                        collectionDetails.scope ??
                          operator_pb.PolicyScope.POLICY_SCOPE_NONE,
                      )
                    "
                    outline
                  />
                </div>
              </div>

              <q-separator class="q-mb-md" />

              <div class="row items-center no-wrap q-gutter-sm q-mb-sm">
                <div class="text-subtitle2">Policies</div>
                <q-badge
                  v-if="policiesForDisplay.length > 0"
                  color="primary"
                  :label="policiesForDisplay.length"
                  rounded
                />
              </div>

              <q-input
                v-if="policiesForDisplay.length"
                v-model="policyDetailsSearch"
                dense
                outlined
                clearable
                debounce="200"
                placeholder="Search by policy name…"
                class="q-mb-none"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="collection-details-dialog__table-scroll">
              <div
                v-if="policiesForDisplay.length === 0"
                class="collection-details-dialog__empty
                  collection-details-dialog__empty--compact"
              >
                <q-icon name="policy" size="48px" color="grey-4" />
                <div class="text-body1 text-grey-6 q-mt-md">
                  No policies in this collection
                </div>
              </div>

              <div
                v-else-if="filteredPoliciesForDisplay.length === 0"
                class="collection-details-dialog__empty
                  collection-details-dialog__empty--compact"
              >
                <q-icon name="search_off" size="36px" color="grey-4" />
                <div class="text-body2 text-grey-6 q-mt-sm">
                  No policies match your search
                </div>
              </div>

              <q-table
                v-else
                :rows="filteredPoliciesForDisplay"
                :columns="collectionPoliciesColumns"
                :row-key="collectionDetailPolicyRowKey"
                flat
                bordered
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
                class="collection-details-dialog__table"
              >
                <template v-slot:body-cell-policy="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">
                      {{
                        props.row.displayName ??
                        props.row.display_name ??
                        props.row.name ??
                        "—"
                      }}
                    </div>
                    <q-expansion-item
                      v-if="policyDescriptionText(props.row)"
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
                        {{ policyDescriptionText(props.row) }}
                      </div>
                    </q-expansion-item>
                  </q-td>
                </template>
                <template v-slot:body-cell-version="props">
                  <q-td :props="props" class="text-center">
                    {{ props.row.version ?? "—" }}
                  </q-td>
                </template>
                <template v-slot:body-cell-policyStatus="props">
                  <q-td :props="props" class="text-center">
                    <q-badge
                      v-if="props.row.policyStatus !== undefined"
                      :color="policyStatusColor(props.row.policyStatus)"
                      :label="policyStatusLabel(props.row.policyStatus)"
                    />
                    <span v-else class="text-grey-5">—</span>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-card-section>
        </template>

        <q-separator />

        <q-card-actions
          align="right"
          class="collection-details-dialog__actions q-px-md q-py-sm"
        >
          <q-btn
            flat
            label="Close"
            color="grey-7"
            no-caps
            @click="closeCollectionDetailsDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="createFormVisible" position="standard">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create collection</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="createName"
            label="Name"
            outlined
            dense
            :rules="[(v) => !!v?.trim() || 'Required']"
            hide-bottom-space
          />
          <q-input
            v-model="createDescription"
            label="Description"
            outlined
            dense
            type="textarea"
            autogrow
          />
          <q-select
            v-model="createScope"
            :options="scopeOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Scope"
            outlined
            dense
            class="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Create"
            :loading="createSubmitting"
            :disable="!createName?.trim()"
            @click="submitCreateCollection"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editFormVisible" position="standard">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit collection</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="editName"
            label="Name"
            outlined
            dense
            :rules="[(v) => !!v?.trim() || 'Required']"
            hide-bottom-space
          />
          <q-input
            v-model="editDescription"
            label="Description"
            outlined
            dense
            type="textarea"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            :loading="editSubmitting"
            :disable="!editName?.trim()"
            @click="submitEditCollection"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CollectionPolicyPickerDialog
      v-model="policyPickerVisible"
      :collection-id="createdCollectionId"
      :collection-name="createdCollectionName"
      :collection-scope="createdCollectionScope"
      @done="onPolicyPickerDone"
    />

    <ApplyCollectionTargetDialog
      v-model="applyTargetDialogVisible"
      :collection-id="applyTargetCollectionId"
      :collection-name="applyTargetCollectionName"
      :mode="applyTargetMode"
      @applied="loadCollections"
      @removed="loadCollections"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import {
  collectionsClient,
  // policyCatalogClient,
  operator_pb,
} from "../../api/grpc-client";
import export_pb from "@/generated/common/export_pb";
import { notifyError, notifySuccess } from "@/utils/notify";
import CollectionPolicyPickerDialog from "../CollectionsPolicies/CollectionPolicyPickerDialog.vue";
import ApplyCollectionTargetDialog from "../CollectionsPolicies/ApplyCollectionTargetDialog.vue";
import {
  policyStatusColor,
  policyStatusLabel,
} from "@/gpo/utils/policy-status";
import {
  extractPolicyMetaFromRecord,
  policyMetaSearchText,
} from "@/gpo/utils/policy-meta";

interface PolicyItem {
  id?: number | string;
  name?: string;
  display_name?: string;
  displayName?: string;
  explain_text?: string;
  explainText?: string;
  policyStatus?: number;
  version?: number;
}

interface CollectionDetailsData {
  id?: number | string;
  name?: string;
  explainText?: string;
  explain_text?: string;
  scope?: number;
  policies?: PolicyItem[];
  policiesList?: PolicyItem[];
}

interface CollectionRow {
  id: number;
  name: string;
  explain_text: string;
  scope: number;
  policiesCount: number;
}

function scopeLabel(scope: number): string {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return "User";
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return "Computer";
    case operator_pb.PolicyScope.POLICY_SCOPE_NONE:
      return "—";
    default:
      return "—";
  }
}

function scopeIcons(scope: number): string[] {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return ["person"];
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return ["laptop"];
    case operator_pb.PolicyScope.POLICY_SCOPE_NONE:
    default:
      return [];
  }
}

function scopeCellClass(scope: number): string {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return "scope-cell--user";
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return "scope-cell--machine";
    case operator_pb.PolicyScope.POLICY_SCOPE_NONE:
    default:
      return "";
  }
}

const $q = useQuasar();
const collectionsList = ref<CollectionRow[]>([]);
const loading = ref(false);
const exportCollectionsLoading = ref(false);
const detailsDialog = ref(false);
const detailsLoading = ref(false);
const detailsCollectionId = ref<number>(0);
const detailsDialogRowName = ref("");
const collectionDetails = ref<CollectionDetailsData | null>(null);
const policyStateInCollection = ref<Record<string, boolean>>({});
const policyDetailsSearch = ref("");

const createFormVisible = ref(false);
const createName = ref("");
const createDescription = ref("");
const createScope = ref<number>(operator_pb.PolicyScope.POLICY_SCOPE_BOTH);
const createSubmitting = ref(false);

const editFormVisible = ref(false);
const editId = ref<number | null>(null);
const editName = ref("");
const editDescription = ref("");
const editSubmitting = ref(false);

const scopeOptions = [
  { value: operator_pb.PolicyScope.POLICY_SCOPE_USER, label: "User" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_MACHINE, label: "Computer" },
  // { value: operator_pb.PolicyScope.POLICY_SCOPE_BOTH, label: "Both" },
];

const SCOPE_FILTER_ALL = null as number | null;
const scopeFilter = ref<number | null>(SCOPE_FILTER_ALL);
const scopeFilterOptions = [
  { value: SCOPE_FILTER_ALL, label: "All" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_USER, label: "User" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_MACHINE, label: "Computer" },
  // { value: operator_pb.PolicyScope.POLICY_SCOPE_BOTH, label: "Both" },
];

const filteredCollectionsList = computed(() => {
  const list = collectionsList.value;
  const scope = scopeFilter.value;
  if (scope === SCOPE_FILTER_ALL || scope === undefined) return list;
  return list.filter((row) => row.scope === scope);
});

const exportLangCode = computed(
  () => ($q.lang as { isoName?: string })?.isoName || "en-US",
);

function scopeFilterToPolicyScope(
  filter: number | null | undefined,
): number {
  if (filter === SCOPE_FILTER_ALL || filter === undefined || filter === null) {
    return operator_pb.PolicyScope.POLICY_SCOPE_NONE;
  }
  if (filter === operator_pb.PolicyScope.POLICY_SCOPE_USER) {
    return operator_pb.PolicyScope.POLICY_SCOPE_USER;
  }
  if (filter === operator_pb.PolicyScope.POLICY_SCOPE_MACHINE) {
    return operator_pb.PolicyScope.POLICY_SCOPE_MACHINE;
  }
  return operator_pb.PolicyScope.POLICY_SCOPE_NONE;
}

function downloadCollectionExportBlob(
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

async function runExportCollectionPolicies(format: "csv" | "xlsx") {
  exportCollectionsLoading.value = true;
  try {
    const exportFormat =
      format === "xlsx"
        ? export_pb.ExportFormat.XLSX
        : export_pb.ExportFormat.CSV;
    const res = await collectionsClient.exportCollectionPolicies(
      exportLangCode.value,
      scopeFilterToPolicyScope(scopeFilter.value),
      exportFormat,
    );
    const mimeType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv; charset=utf-8";
    const fallbackName = `policy_collections.${
      format === "xlsx" ? "xlsx" : "csv"
    }`;
    downloadCollectionExportBlob(
      res.content,
      res.fileName || fallbackName,
      mimeType,
    );
    notifySuccess(
      format === "xlsx"
        ? "Collections exported (XLSX)"
        : "Collections exported (CSV)",
    );
  } catch (err) {
    notifyError(
      err instanceof Error
        ? err.message
        : "Failed to export policy collections",
    );
  } finally {
    exportCollectionsLoading.value = false;
  }
}

function normalizeScope(raw: number | string | undefined | null): number {
  if (raw === undefined || raw === null) {
    return operator_pb.PolicyScope.POLICY_SCOPE_NONE;
  }
  if (typeof raw === "number") {
    const n = Math.floor(raw);
    if (n >= 0 && n <= 3) return n;
    return operator_pb.PolicyScope.POLICY_SCOPE_NONE;
  }
  const s = String(raw).toUpperCase();
  switch (s) {
    case "USER":
    case "1":
      return operator_pb.PolicyScope.POLICY_SCOPE_USER;
    case "COMPUTER":
    case "2":
      return operator_pb.PolicyScope.POLICY_SCOPE_MACHINE;
    case "NONE":
    case "0":
    default:
      return operator_pb.PolicyScope.POLICY_SCOPE_NONE;
  }
}

const collectionScopeCache = ref<Record<number, number>>({});
const createdCollectionId = ref<number | null>(null);
const createdCollectionName = ref("");
const createdCollectionScope = ref<number>(operator_pb.PolicyScope.POLICY_SCOPE_USER);
const policyPickerVisible = ref(false);
const applyTargetDialogVisible = ref(false);
const applyTargetCollectionId = ref<number>(0);
const applyTargetCollectionName = ref("");
const applyTargetMode = ref<"apply" | "remove">("apply");

const policiesForDisplay = computed((): PolicyItem[] => {
  const c = collectionDetails.value;
  if (!c) return [];
  const arr =
    (c as Record<string, unknown>).policiesList ??
    (c as Record<string, unknown>).policies;
  if (!Array.isArray(arr)) return [];
  return arr.map((raw) => {
    const p = raw as Record<string, unknown>;
    const meta = extractPolicyMetaFromRecord(p);
    return {
      id: p.id as number | string | undefined,
      name: p.name as string | undefined,
      display_name: p.display_name as string | undefined,
      displayName: p.displayName as string | undefined,
      explain_text: p.explain_text as string | undefined,
      explainText: p.explainText as string | undefined,
      ...meta,
    };
  });
});

const filteredPoliciesForDisplay = computed(() => {
  const q = policyDetailsSearch.value?.trim().toLowerCase() ?? "";
  const list = policiesForDisplay.value;
  if (!q) return list;
  return list.filter((p) => {
    const title = String(
      p.displayName ?? p.display_name ?? p.name ?? "",
    ).toLowerCase();
    const desc = String(
      p.explainText ?? p.explain_text ?? "",
    ).toLowerCase();
    return (
      title.includes(q) ||
      desc.includes(q) ||
      policyMetaSearchText(p).includes(q)
    );
  });
});

const collectionPoliciesColumns: QTableColumn[] = [
  {
    name: "policy",
    label: "Policy",
    field: (row: PolicyItem) =>
      row.displayName ?? row.display_name ?? row.name ?? "—",
    align: "left",
  },
  {
    name: "version",
    label: "Version",
    field: (row: PolicyItem) => row.version ?? "",
    align: "center",
  },
  {
    name: "policyStatus",
    label: "Status",
    field: (row: PolicyItem) => row.policyStatus ?? "",
    align: "center",
  },
];

watch(detailsDialog, (open) => {
  if (!open) {
    policyDetailsSearch.value = "";
  }
});

function collectionDetailPolicyRowKey(row: PolicyItem): string {
  if (row.id !== undefined && row.id !== null) {
    return `id-${row.id}`;
  }
  const idx = policiesForDisplay.value.indexOf(row);
  return `idx-${idx >= 0 ? idx : "unknown"}`;
}

function policyDescriptionText(p: PolicyItem): string {
  return String(p.explainText ?? p.explain_text ?? "");
}

function collectionDetailScopeBadgeColor(scope: number): string {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return "purple-7";
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return "blue-7";
    default:
      return "grey-6";
  }
}

function closeCollectionDetailsDialog() {
  detailsDialog.value = false;
}

const collectionsTableColumns: QTableColumn[] = [
  { name: "name", label: "Name", field: "name", align: "left", sortable: true },
  {
    name: "scope",
    label: "Scope",
    field: "scope",
    align: "left",
    sortable: true,
    format: (val: number) => scopeLabel(val),
  },
  {
    name: "explain_text",
    label: "Description",
    field: "explain_text",
    align: "left",
    sortable: true,
  },
  {
    name: "policiesCount",
    label: "Policies",
    field: "policiesCount",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center",
  },
];

function openEditCollection(row: CollectionRow) {
  editId.value = row.id;
  editName.value = row.name ?? "";
  editDescription.value = row.explain_text ?? "";
  editFormVisible.value = true;
}

async function submitEditCollection() {
  const id = editId.value;
  const name = editName.value?.trim();
  if (id == null || id <= 0 || !name) return;
  editSubmitting.value = true;
  try {
    await collectionsClient.updateCollection(
      id,
      name,
      editDescription.value?.trim() ?? "",
      [],
    );
    editFormVisible.value = false;
    notifySuccess("Collection updated");
    loadCollections();
    if (collectionDetails.value?.id === id) {
      const response = await collectionsClient.getCollectionById(id, "en-US");
      const coll =
        (
          response as {
            collection?: CollectionDetailsData;
            collectionList?: CollectionDetailsData[];
          }
        ).collection ??
        (
          response as {
            collection?: CollectionDetailsData;
            collectionList?: CollectionDetailsData[];
          }
        ).collectionList?.[0];
      collectionDetails.value = coll ?? null;
    }
  } catch {
    notifyError("Error updating collection");
  } finally {
    editSubmitting.value = false;
  }
}

function openCreateCollection() {
  createName.value = "";
  createDescription.value = "";
  createScope.value = operator_pb.PolicyScope.POLICY_SCOPE_USER;
  createFormVisible.value = true;
}

async function submitCreateCollection() {
  const name = createName.value?.trim();
  if (!name) return;
  createSubmitting.value = true;
  try {
    const response = await collectionsClient.createCollection(
      name,
      createDescription.value?.trim() ?? "",
      [],
      createScope.value,
    );
    const coll =
      (
        response as {
          collection?: { id?: number; name?: string; scope?: number };
          collectionList?: unknown[];
        }
      ).collection ??
      (
        response as {
          collection?: { id?: number; name?: string; scope?: number };
        }
      ).collection;
    const rawId = coll?.id;
    const id = rawId !== undefined && rawId !== null ? Number(rawId) : null;
    const displayName = coll?.name ?? name;
    const scopeFromResponse = coll?.scope;
    if (id !== null && id > 0) {
      if (
        scopeFromResponse !== undefined &&
        scopeFromResponse !== null &&
        scopeFromResponse !== operator_pb.PolicyScope.POLICY_SCOPE_NONE
      ) {
        collectionScopeCache.value = {
          ...collectionScopeCache.value,
          [id]: normalizeScope(scopeFromResponse),
        };
      } else {
        collectionScopeCache.value = {
          ...collectionScopeCache.value,
          [id]: createScope.value,
        };
      }
      createdCollectionId.value = id;
      createdCollectionName.value = displayName;
      createdCollectionScope.value = createScope.value;
      createFormVisible.value = false;
      policyPickerVisible.value = true;
      notifySuccess("Collection created. Add policies.");
    } else {
      notifyError("Created collection ID not returned");
    }
  } catch {
    notifyError("Error creating collection");
  } finally {
    createSubmitting.value = false;
  }
}

function onPolicyPickerDone() {
  policyPickerVisible.value = false;
  createdCollectionId.value = null;
  createdCollectionName.value = "";
  loadCollections();
}

const onDelete = (row: CollectionRow) => {
  $q.dialog({
    title: "Confirm deletion",
    message: `Are you sure you want to delete collection "${row.name}"?`,
    cancel: true,
    persistent: true,
    ok: {
      label: "Delete",
      color: "negative",
      unelevated: true,
      push: true,
    },
  }).onOk(async () => {
    try {
      await collectionsClient.deleteCollection(row.id);
      notifySuccess("Collection deleted");
      loadCollections();
    } catch {
      notifyError("Error deleting collection");
    }
  });
};

async function loadCollections() {
  loading.value = true;
  try {
    const response = await collectionsClient.getAllCollections("");
    const list =
      (response as { collectionsList?: unknown[]; collections?: unknown[] })
        .collectionsList ||
      (response as { collectionsList?: unknown[]; collections?: unknown[] })
        .collections ||
      [];
    collectionsList.value = list.map((col: unknown) => {
      const c = col as Record<string, unknown> & {
        id?: number | string;
        name?: string;
        explainText?: string;
        explain_text?: string;
        scope?: number | string;
      };
      let id = 0;
      if (c.id !== undefined && c.id !== null) {
        id =
          typeof c.id === "string"
            ? Number.parseInt(c.id, 10) || 0
            : Number(c.id);
      }
      const policiesArr =
        (c.policies as unknown[] | undefined) ??
        (c.policiesList as unknown[] | undefined);
      const policiesCount = Array.isArray(policiesArr) ? policiesArr.length : 0;
      const apiScope = normalizeScope(c.scope as number | string | undefined);
      const scope = collectionScopeCache.value[id] ?? apiScope;
      return {
        id,
        name: c.name ?? "",
        explain_text: c.explainText ?? c.explain_text ?? "",
        scope,
        policiesCount,
      };
    });
  } catch {
    notifyError("Error loading collections");
    collectionsList.value = [];
  } finally {
    loading.value = false;
  }
}

async function onRowClick(_evt: Event, row: CollectionRow) {
  detailsDialog.value = true;
  detailsCollectionId.value = row.id;
  detailsDialogRowName.value = row.name ?? "";
  policyDetailsSearch.value = "";
  collectionDetails.value = null;
  policyStateInCollection.value = {};
  detailsLoading.value = true;
  try {
    const response = await collectionsClient.getCollectionById(row.id, "en-US");
    const coll =
      (
        response as {
          collection?: CollectionDetailsData;
          collectionList?: CollectionDetailsData[];
        }
      ).collection ??
      (
        response as {
          collection?: CollectionDetailsData;
          collectionList?: CollectionDetailsData[];
        }
      ).collectionList?.[0];
    collectionDetails.value = coll ?? null;
    const raw = (coll ?? {}) as Record<string, unknown>;
    const list = (raw.policiesList ?? raw.policies ?? []) as PolicyItem[];
    const next: Record<string, boolean> = {};
    list.forEach((p, idx) => {
      next[policyKey(p, idx)] = true;
    });
    policyStateInCollection.value = next;
    const detailScope = raw.scope;
    if (
      row.id &&
      detailScope !== undefined &&
      detailScope !== null &&
      detailScope !== operator_pb.PolicyScope.POLICY_SCOPE_NONE
    ) {
      collectionScopeCache.value = {
        ...collectionScopeCache.value,
        [row.id]: normalizeScope(detailScope as number | string),
      };
      const idx = collectionsList.value.findIndex((r) => r.id === row.id);
      if (idx >= 0) {
        const nextList = [...collectionsList.value];
        nextList[idx] = {
          ...nextList[idx],
          scope: normalizeScope(detailScope as number | string),
        };
        collectionsList.value = nextList;
      }
    }
  } catch {
    notifyError("Error loading collection details");
    collectionDetails.value = null;
  } finally {
    detailsLoading.value = false;
  }
}

function policyKey(p: PolicyItem, idx: number): string {
  if (p.id !== undefined && p.id !== null) return String(p.id);
  return `idx-${idx}`;
}

function closeAllDialogs() {
  detailsDialog.value = false;
  createFormVisible.value = false;
  editFormVisible.value = false;
  policyPickerVisible.value = false;
  applyTargetDialogVisible.value = false;
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    closeAllDialogs();
  }
}

onMounted(() => {
  loadCollections();
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  closeAllDialogs();
});
</script>

<style scoped lang="sass">
.gpo-collections-table
  display: flex
  flex-direction: column
  flex: 1 1 0
  min-height: 0
  width: 100%
  height: 100%
  overflow: hidden

.gpo-collections-table__scroll
  flex: 1 1 0
  min-height: 0
  overflow: hidden

.gpo-content-header
  background: white
  border-bottom: 1px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0

.collection-details-dialog
  width: min(1200px, 96vw)
  max-width: 96vw
  max-height: 85vh
  display: flex
  flex-direction: column
  overflow: hidden

.collection-details-dialog__header
  flex-shrink: 0
  padding: 16px 20px

.collection-details-dialog__actions
  flex-shrink: 0

.collection-details-dialog > .q-separator
  flex-shrink: 0

.collection-details-dialog__body
  display: flex
  flex-direction: column
  flex: 1 1 0
  min-height:600px
  overflow: hidden
  padding: 16px 20px

.collection-details-dialog__body-top
  flex-shrink: 0

.collection-details-dialog__table-scroll
  flex: 1 1 0
  min-height: 0
  margin-top: 12px
  overflow: auto
  -webkit-overflow-scrolling: touch

.collection-details-dialog__body--center
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 200px

.collection-details-dialog__table
  :deep(thead th)
    font-weight: 600
    font-size: 12px
    text-transform: uppercase
    letter-spacing: 0.5px
    color: var(--q-grey-7)
  :deep(tbody td)
    padding-top: 10px
    padding-bottom: 10px

.collection-details-dialog__empty
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 48px 24px
  text-align: center

.collection-details-dialog__empty--compact
  padding: 24px 16px

.effective-desc-toggle
  min-height: 28px !important
  padding-top: 0
  padding-bottom: 0

.scope-cell
  display: inline-flex
  align-items: center
  padding: 4px 10px
  border-radius: 6px
  font-size: 0.8rem
  white-space: nowrap

.scope-cell--user
  background: #bbdefb
  color: #0d47a1

.scope-cell--machine
  background: #c8e6c9
  color: #1b5e20

.scope-cell--both
  background: #e1bee7
  color: #4a148c

.body--dark .gpo-content-header
  background: rgba(30, 30, 30, 0.98)
  border-bottom: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .scope-cell--user
  background: rgba(13, 71, 161, 0.65)
  color: #bbdefb

.body--dark .scope-cell--machine
  background: rgba(27, 94, 32, 0.65)
  color: #c8e6c9

.body--dark .scope-cell--both
  background: rgba(156, 39, 176, 0.35)
  color: #f3e5f5
</style>
