<template>
  <div class="gpo-collections-table">
    <div class="gpo-content-header row items-center no-wrap">
      <div class="text-h6 q-pa-md">Collections</div>
      <q-space />
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
        :rows="collectionsList"
        :columns="collectionsTableColumns"
        row-key="id"
        :loading="loading"
        flat
        bordered
        dense
        class="cursor-pointer"
        @row-click="onRowClick"
      >
        <template v-slot:body-cell-scope="props">
          <q-td :props="props">
            <div
              class="scope-cell"
              :class="scopeCellClass(props.row.scope)"
            >
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
            <q-item v-for="(p, idx) in policiesForDisplay" :key="idx">
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
            </q-item>
          </q-list>
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
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import { collectionsClient, operator_pb } from "../../api/grpc-client";
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
      return "Machine";
    case operator_pb.PolicyScope.POLICY_SCOPE_BOTH:
      return "User & Machine";
    default:
      return "User";
  }
}

function scopeIcons(scope: number): string[] {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return ["person"];
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return ["laptop"];
    case operator_pb.PolicyScope.POLICY_SCOPE_BOTH:
      return ["person", "laptop"];
    default:
      return ["person"];
  }
}

function scopeCellClass(scope: number): string {
  switch (scope) {
    case operator_pb.PolicyScope.POLICY_SCOPE_USER:
      return "scope-cell--user";
    case operator_pb.PolicyScope.POLICY_SCOPE_MACHINE:
      return "scope-cell--machine";
    case operator_pb.PolicyScope.POLICY_SCOPE_BOTH:
      return "scope-cell--both";
    default:
      return "scope-cell--user";
  }
}

const $q = useQuasar();
const collectionsList = ref<CollectionRow[]>([]);
const loading = ref(false);
const detailsDialog = ref(false);
const detailsLoading = ref(false);
const collectionDetails = ref<CollectionDetailsData | null>(null);

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
  { value: operator_pb.PolicyScope.POLICY_SCOPE_MACHINE, label: "Machine" },
  { value: operator_pb.PolicyScope.POLICY_SCOPE_BOTH, label: "User & Machine" },
];
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

function onApplyCollection(row: CollectionRow) {
  applyTargetMode.value = "apply";
  applyTargetCollectionId.value = row.id;
  applyTargetCollectionName.value = row.name;
  applyTargetDialogVisible.value = true;
}

function onRemoveCollection(row: CollectionRow) {
  applyTargetMode.value = "remove";
  applyTargetCollectionId.value = row.id;
  applyTargetCollectionName.value = row.name;
  applyTargetDialogVisible.value = true;
}

function openCreateCollection() {
  createName.value = "";
  createDescription.value = "";
  createScope.value = operator_pb.PolicyScope.POLICY_SCOPE_BOTH;
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
          collection?: { id?: number; name?: string };
          collectionList?: unknown[];
        }
      ).collection ??
      (response as { collection?: { id?: number; name?: string } }).collection;
    const rawId = coll?.id;
    const id = rawId !== undefined && rawId !== null ? Number(rawId) : null;
    const displayName = coll?.name ?? name;
    if (id !== null && id > 0) {
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
    const response = await collectionsClient.getAllCollections("en-US");
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
      const scope =
        (c.scope as number | undefined) ??
        operator_pb.PolicyScope.POLICY_SCOPE_NONE;
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
  collectionDetails.value = null;
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
  } catch {
    notifyError("Error loading collection details");
    collectionDetails.value = null;
  } finally {
    detailsLoading.value = false;
  }
}

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
