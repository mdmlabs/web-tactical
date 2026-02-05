<template>
  <div class="gpo-collections-table">
    <div class="gpo-content-header">
      <div class="text-h6 q-pa-md">Collections</div>
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
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="no-wrap justify-center q-gutter-xs">
            <q-btn
            icon="edit"
            size="sm"
            flat
            dense
            round
            color="primary"
            @click.stop="onEdit(props.row)"
            >
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
          <q-btn
          icon="delete"
          size="sm"
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
            {{ collectionDetails.explain_text || "—" }}
          </div>
          <div class="text-subtitle2 q-mb-sm">Policies ({{ collectionDetails.policiesList?.length ?? collectionDetails.policies?.length ?? 0 }})</div>
          <q-list v-if="policiesForDisplay.length" bordered separator class="rounded-borders">
            <q-item v-for="(p, idx) in policiesForDisplay" :key="idx">
              <q-item-section>
                <q-item-label>
                  {{ p.displayName ?? p.display_name ?? p.name ?? "—" }}
                </q-item-label>
                <q-item-label caption v-if="p.name && (p.displayName ?? p.display_name)">
                  {{ p.name }}
                </q-item-label>
                <q-item-label caption v-if="p.explainText ?? p.explain_text" class="ellipsis-2-lines">
                  {{ p.explainText ?? p.explain_text }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey-7 text-body2">No policies in this collection.</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import { collectionsClient } from "../api/grpc-client";
import { notifyError } from "@/utils/notify";


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
  explain_text?: string;
  policies?: PolicyItem[];
  policiesList?: PolicyItem[];
}

interface CollectionRow {
  id: number;
  name: string;
  explain_text: string;
  policiesCount: number;
}

const $q = useQuasar()
const collectionsList = ref<CollectionRow[]>([]);
const loading = ref(false);
const detailsDialog = ref(false);
const detailsLoading = ref(false);
const collectionDetails = ref<CollectionDetailsData | null>(null);

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
  }
];

const onEdit = (row: CollectionRow) => {
  console.log("Edit collection:", row);
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
    }
  }).onOk(() => {
    console.log("Delete collection:", row);
  })
}

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
      return {
        id,
        name: c.name ?? "",
        explain_text: c.explainText ?? c.explain_text ?? "",
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
      (response as { collection?: CollectionDetailsData; collectionList?: CollectionDetailsData[] })
        .collection ??
      (response as { collection?: CollectionDetailsData; collectionList?: CollectionDetailsData[] })
        .collectionList?.[0];
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
</style>
