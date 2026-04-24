<template>
  <div class="saved-search-bar">
    <!-- Open Search dropdown -->
    <q-btn-dropdown
      flat
      dense
      no-caps
      icon="folder_open"
      :label="openLabel"
      class="bar-btn"
      content-class="saved-search-menu"
    >
      <div class="menu-wrap">
        <div class="menu-header">
          <q-input
            v-model="filter"
            dense
            outlined
            clearable
            placeholder="Filter saved searches..."
            autofocus
          >
            <template #prepend><q-icon name="search" size="xs" /></template>
          </q-input>
        </div>
        <q-list separator class="menu-list">
          <q-item v-if="filtered.length === 0" class="text-grey">
            <q-item-section>
              <q-item-label caption>No saved searches yet.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="s in filtered"
            :key="s.id"
            v-close-popup
            clickable
            :active="s.id === store.activeId"
            @click="onOpen(s.id)"
          >
            <q-item-section>
              <q-item-label>{{ s.attributes.title }}</q-item-label>
              <q-item-label caption class="ellipsis">
                {{ s.attributes.query || "(no query)" }} · {{ s.attributes.timeRange }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                dense
                round
                icon="delete_outline"
                size="sm"
                color="grey-7"
                @click.stop.prevent="onDelete(s)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-btn-dropdown>

    <!-- Save / Save As -->
    <q-btn
      flat
      dense
      no-caps
      icon="save"
      :label="saveBtnLabel"
      class="bar-btn"
      :disable="!canSaveUpdate"
      @click="onSave"
    >
      <q-tooltip>{{ saveTooltip }}</q-tooltip>
    </q-btn>
    <q-btn
      flat
      dense
      no-caps
      icon="save_as"
      label="Save As..."
      class="bar-btn"
      @click="openSaveAs()"
    />

    <q-chip
      v-if="store.storageDegraded"
      dense
      square
      size="sm"
      color="warning"
      text-color="black"
      icon="warning"
      class="degraded-chip"
    >
      Local-only
      <q-tooltip>
        Indexer storage is unavailable — saved searches are kept in this
        browser only and will not sync to other users or machines.
      </q-tooltip>
    </q-chip>

    <!-- Save dialog -->
    <q-dialog v-model="saveDialog" persistent>
      <q-card class="save-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ saveDialogTitle }}</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="dialogTitle"
            label="Title"
            outlined
            dense
            autofocus
            :rules="[(v: string) => !!v?.trim() || 'Title is required']"
            class="q-mb-md"
          />
          <q-input
            v-model="dialogDescription"
            label="Description (optional)"
            outlined
            dense
            type="textarea"
            autogrow
            class="q-mb-md"
          />
          <div class="summary">
            <div class="summary-row">
              <span class="summary-key">Index:</span>
              <span>{{ discover.indexPattern }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-key">Query:</span>
              <code>{{ discover.searchQuery || "(none)" }}</code>
            </div>
            <div class="summary-row">
              <span class="summary-key">Time range:</span>
              <span>{{ discover.timeRange }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-key">Columns:</span>
              <span>{{ discover.selectedFields.join(", ") || "(default)" }}</span>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup flat no-caps label="Cancel" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Save"
            :loading="saving"
            :disable="!dialogTitle.trim()"
            @click="submitSave"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useDiscoverStore } from "@/stores/discover";
import { useSavedSearchesStore } from "@/stores/savedSearches";
import { notifyError, notifySuccess } from "@/utils/notify";
import type { SavedSearch } from "@/types/savedSearch";

const discover = useDiscoverStore();
const store = useSavedSearchesStore();
const $q = useQuasar();

const filter = ref("");
const saveDialog = ref(false);
const saveMode = ref<"save" | "saveAs">("saveAs");
const dialogTitle = ref("");
const dialogDescription = ref("");
const saving = ref(false);

const filtered = computed(() => {
  const q = filter.value.trim().toLowerCase();
  if (!q) return store.items;
  return store.items.filter((s) =>
    s.attributes.title.toLowerCase().includes(q),
  );
});

const openLabel = computed(() =>
  store.active ? store.active.attributes.title : "Open Search...",
);
const canSaveUpdate = computed(() => store.active !== null);
const saveBtnLabel = computed(() => (store.active ? "Save" : "Save"));
const saveTooltip = computed(() =>
  store.active
    ? `Update "${store.active.attributes.title}" with current query`
    : "Open a saved search first, or use Save As...",
);
const saveDialogTitle = computed(() =>
  saveMode.value === "save" ? "Update Saved Search" : "Save Search As",
);

onMounted(() => {
  void store.reload();
});

function onOpen(id: string) {
  const item = store.items.find((s) => s.id === id);
  if (!item) return;
  store.setActive(id);
  discover.applySavedSearch(item.attributes);
  notifySuccess(`Opened "${item.attributes.title}"`);
}

async function onDelete(s: SavedSearch) {
  $q.dialog({
    title: "Delete saved search",
    message: `Delete "${s.attributes.title}"? This cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", noCaps: true, flat: false },
  }).onOk(async () => {
    try {
      await store.remove(s.id);
      notifySuccess("Saved search deleted");
    } catch (e) {
      notifyError(`Delete failed: ${(e as Error).message}`);
    }
  });
}

function onSave() {
  if (!store.active) return;
  saveMode.value = "save";
  dialogTitle.value = store.active.attributes.title;
  dialogDescription.value = store.active.attributes.description ?? "";
  saveDialog.value = true;
}

function openSaveAs() {
  saveMode.value = "saveAs";
  dialogTitle.value = "";
  dialogDescription.value = "";
  saveDialog.value = true;
}

async function submitSave() {
  const title = dialogTitle.value.trim();
  if (!title) return;
  saving.value = true;
  try {
    const attributes = {
      title,
      description: dialogDescription.value.trim() || undefined,
      indexPattern: discover.indexPattern,
      query: discover.searchQuery,
      timeRange: discover.timeRange,
      columns: [...discover.selectedFields],
    };
    if (saveMode.value === "save" && store.active) {
      await store.update(store.active.id, attributes);
      notifySuccess(`Updated "${title}"`);
    } else {
      await store.create(attributes);
      notifySuccess(`Saved "${title}"`);
    }
    saveDialog.value = false;
  } catch (e) {
    notifyError(`Save failed: ${(e as Error).message}`);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.saved-search-bar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bar-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
  min-height: 32px;
  padding: 0 10px;
}

.body--dark .bar-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}

.degraded-chip {
  margin-left: 4px;
  font-weight: 500;
}

.menu-wrap {
  min-width: 340px;
  max-width: 440px;
}

.menu-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.menu-list {
  max-height: 320px;
  overflow-y: auto;
}

.save-dialog {
  min-width: 480px;
  max-width: 560px;
}

.summary {
  background: var(--mdm-bg-sidebar, #fafafa);
  border: 1px solid var(--mdm-border-light, #f0f0f0);
  border-radius: var(--mdm-radius, 6px);
  padding: 10px 12px;
  font-size: 12px;
}

.summary-row {
  margin-bottom: 4px;
  line-height: 1.4;
}

.summary-key {
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  margin-right: 6px;
}

.summary code {
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
