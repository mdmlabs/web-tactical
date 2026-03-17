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
        unelevated
        color="primary"
        icon="add"
        label="Create collection"
        class="q-mr-md"
        @click="openCreateCollection"
      />
      <q-separator />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="filteredCollectionsList"
        :columns="collectionsTableColumns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 20 }"
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
              <!--
              <q-btn
                icon="play_arrow"
                size="s"
                flat
                dense
                round
                color="primary"
                @click.stop="onApplyCollection(props.row)"
              >
                <q-tooltip>Apply collection</q-tooltip>
              </q-btn>
              <q-btn
                icon="remove_circle_outline"
                size="s"
                flat
                dense
                round
                color="negative"
                @click.stop="onRemoveCollection(props.row)"
              >
                <q-tooltip>Remove collection from target</q-tooltip>
              </q-btn>
              -->
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

    <q-dialog v-model="detailsDialog" position="right" full-height>
      <q-card class="collection-details-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Collection details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="detailsLoading" class="flex flex-center">
          <q-spinner size="lg" />
        </q-card-section>
        <q-card-section v-else-if="collectionDetails" class="col column">
          <div class="text-subtitle1 q-mb-sm">
            <strong>Name:</strong> {{ collectionDetails.name || "—" }}
          </div>
          <div class="text-body2 q-mb-md">
            <strong>Description:</strong>
            {{
              collectionDetails.explainText ??
              collectionDetails.explain_text ??
              "—"
            }}
            <div class="text-subtitle2 q-mb-sm">
              <strong>Scope:</strong>
              {{
                scopeLabel(
                  collectionDetails.scope ??
                    operator_pb.PolicyScope.POLICY_SCOPE_NONE,
                )
              }}
            </div>
          </div>
          <div class="text-subtitle2 q-mb-sm">
            Policies ({{
              collectionDetails.policiesList?.length ??
              collectionDetails.policies?.length ??
              0
            }})
          </div>
          <q-list
            v-if="policiesForDisplay.length"
            bordered
            separator
            class="rounded-borders"
          >
            <q-item
              v-for="(p, idx) in policiesForDisplay"
              :key="policyKey(p, idx)"
            >
              <q-item-section>
                <q-item-label>
                  {{ p.displayName ?? p.display_name ?? "—" }}
                </q-item-label>
                <q-item-label
                  caption
                  v-if="p.explainText ?? p.explain_text"
                  class="ellipsis-2-lines"
                >
                  {{ p.explainText ?? p.explain_text }}
                </q-item-label>
              </q-item-section>
              <!-- <q-item-section side>
                <q-toggle
                  :model-value="getPolicyState(p, idx) !== false"
                  color="primary"
                  :label="getPolicyState(p, idx) !== false ? 'Enabled' : 'Disabled'"
                  @update:model-value="(v) => setPolicyStateInCollection(p, idx, !!v)"
                />
              </q-item-section> -->
            </q-item>
          </q-list>
          <!-- <q-btn
            v-if="policiesForDisplay.length"
            flat
            dense
            color="primary"
            label="Save policy states"
            :loading="savingPolicyStates"
            class="q-mt-sm"
            @click="savePolicyStates"
          /> -->
          <div v-else class="text-grey-7 text-body2">
            No policies in this collection.
          </div>
        </q-card-section>
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
import { ref, computed, onMounted } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import {
  collectionsClient,
  // policyCatalogClient,
  operator_pb,
} from "../../api/grpc-client";
import { notifyError, notifySuccess } from "@/utils/notify";
import CollectionPolicyPickerDialog from "../CollectionsPolicies/CollectionPolicyPickerDialog.vue";
import ApplyCollectionTargetDialog from "../CollectionsPolicies/ApplyCollectionTargetDialog.vue";

interface PolicyItem {
  id?: number | string;
  name?: string;
  display_name?: string;
  displayName?: string;
  explain_text?: string;
  explainText?: string;
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
const detailsDialog = ref(false);
const detailsLoading = ref(false);
const detailsCollectionId = ref<number>(0);
const collectionDetails = ref<CollectionDetailsData | null>(null);
const policyStateInCollection = ref<Record<string, boolean>>({});
// const savingPolicyStates = ref(false);

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
];

const SCOPE_FILTER_ALL = null as number | null;
const scopeFilter = ref<number | null>(SCOPE_FILTER_ALL);
const scopeFilterOptions = [
  { value: SCOPE_FILTER_ALL, label: "All" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_USER, label: "User" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_MACHINE, label: "Computer" },
];

const filteredCollectionsList = computed(() => {
  const list = collectionsList.value;
  const scope = scopeFilter.value;
  if (scope === SCOPE_FILTER_ALL || scope === undefined) return list;
  return list.filter((row) => row.scope === scope);
});

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
const policyPickerVisible = ref(false);
const applyTargetDialogVisible = ref(false);
const applyTargetCollectionId = ref<number>(0);
const applyTargetCollectionName = ref("");
const applyTargetMode = ref<"apply" | "remove">("apply");

const policiesForDisplay = computed(() => {
  const c = collectionDetails.value;
  if (!c) return [];
  const arr =
    (c as Record<string, unknown>).policiesList ??
    (c as Record<string, unknown>).policies;
  return Array.isArray(arr) ? arr : [];
});

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

// function onApplyCollection(row: CollectionRow) {
//   const payload = { mode: "apply" as const, collectionId: row.id, collectionName: row.name ?? "" };
//   console.log("[GPOCollectionsTable] Open target dialog — apply collection:", payload);
//   applyTargetMode.value = "apply";
//   applyTargetCollectionId.value = row.id;
//   applyTargetCollectionName.value = row.name ?? "";
//   applyTargetDialogVisible.value = true;
// }

// function onRemoveCollection(row: CollectionRow) {
//   const payload = { mode: "remove" as const, collectionId: row.id, collectionName: row.name ?? "" };
//   console.log("[GPOCollectionsTable] Open target dialog — remove collection:", payload);
//   applyTargetMode.value = "remove";
//   applyTargetCollectionId.value = row.id;
//   applyTargetCollectionName.value = row.name ?? "";
//   applyTargetDialogVisible.value = true;
// }

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

// function getPolicyState(p: PolicyItem, idx: number): boolean {
//   const id = policyKey(p, idx);
//   return policyStateInCollection.value[id] !== false;
// }

// function setPolicyStateInCollection(p: PolicyItem, idx: number, enabled: boolean) {
//   const id = policyKey(p, idx);
//   policyStateInCollection.value = {
//     ...policyStateInCollection.value,
//     [id]: enabled,
//   };
// }

// async function savePolicyStates() {
//   const cid = detailsCollectionId.value;
//   if (!cid || cid <= 0) return;
//   const list = policiesForDisplay.value;
//   if (list.length === 0) return;
//   savingPolicyStates.value = true;
//   try {
//     const policiesWithState: Array<{ hash: string; state: boolean }> = [];
//     for (let idx = 0; idx < list.length; idx++) {
//       const p = list[idx];
//       const id =
//         typeof p.id === "number" ? p.id : Number.parseInt(String(p.id ?? ""), 10);
//       if (Number.isNaN(id)) continue;
//       let hash: string | null = null;
//       try {
//         const resp = await policyCatalogClient.getPolicyDetails(id, "en-US");
//         const policy = (resp as { policy?: { hash?: string } }).policy;
//         hash = policy?.hash ?? null;
//       } catch {
//         continue;
//       }
//       if (hash) {
//         const key = policyKey(p, idx);
//         policiesWithState.push({
//           hash,
//           state: policyStateInCollection.value[key] !== false,
//         });
//       }
//     }
//     if (policiesWithState.length === 0) {
//       notifyError("Could not get policy hashes");
//       return;
//     }
//     await collectionsClient.createCollectionsPolicies(cid, policiesWithState);
//     notifySuccess("Policy states saved");
//   } catch (e) {
//     const msg = e instanceof Error ? e.message : "Error saving policy states";
//     notifyError(msg);
//   } finally {
//     savingPolicyStates.value = false;
//   }
// }

onMounted(() => {
  loadCollections();
});
</script>

<style scoped lang="sass">
.gpo-collections-table
  display: flex
  flex-direction: column
  flex: 1
  min-height: 0
  overflow: hidden

.gpo-content-header
  background: white
  border-bottom: 1px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0

.collection-details-card
  min-width: 400px
  max-width: 500px
  display: flex
  flex-direction: column

.policies-scroll
  height: min(900px)
  min-height: 400px

.policies-list
  min-height: min-content

.ellipsis-2-lines
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

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
</style>
