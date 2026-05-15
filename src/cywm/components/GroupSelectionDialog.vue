<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="cywm-scope cywm-group-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Deploy: {{ filename }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="cywm-group-dialog__label">Select target Wazuh group:</div>

        <q-input
          v-model="searchQuery"
          dense
          outlined
          placeholder="Search groups..."
          debounce="300"
          class="q-mb-sm"
          clearable
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div v-if="loading" class="cywm-group-dialog__loading">
          <q-spinner-dots color="primary" size="24px" />
          <span>Loading Wazuh groups...</span>
        </div>

        <div v-else-if="loadError" class="cywm-group-dialog__error">
          <div class="cywm-group-dialog__error-text">
            <q-icon name="warning" color="negative" size="16px" />
            <span>Failed to load Wazuh groups. Check Wazuh Manager connectivity.</span>
          </div>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            label="Retry"
            color="primary"
            @click="loadGroups"
          />
        </div>

        <div
          v-else-if="groups.length === 0"
          class="cywm-group-dialog__empty"
        >
          No Wazuh groups found. Check Wazuh Manager configuration.
        </div>

        <q-list v-else dense class="cywm-group-dialog__list">
          <q-item
            v-for="group in filteredGroups"
            :key="group.name"
            tag="label"
            clickable
            dense
          >
            <q-item-section side>
              <q-radio
                v-model="selectedGroup"
                :val="group.name"
                dense
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ group.name }}</q-item-label>
            </q-item-section>
            <q-item-section side class="cywm-group-dialog__count">
              {{ group.count }} agents
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="selectedGroup" class="cywm-group-dialog__path">
          <span class="cywm-group-dialog__path-label">Target path:</span>
          <code class="cywm-group-dialog__path-value">
            /var/ossec/etc/shared/{{ selectedGroup }}/{{ filename }}
          </code>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat no-caps label="Cancel" v-close-popup />
        <q-btn
          unelevated
          no-caps
          label="Deploy to group"
          color="primary"
          icon-right="rocket_launch"
          :disable="!selectedGroup"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useWazuhStore } from "@/stores/wazuh";
import type { DeployRequest } from "@/cywm/types";

defineProps<{
  filename: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const wazuhStore = useWazuhStore();

const selectedGroup = ref<string | null>(null);
const searchQuery = ref("");
const loading = ref(false);
const loadError = ref<string | null>(null);

const groups = computed(() => wazuhStore.groups);

const sortedGroups = computed(() => {
  const sorted = [...groups.value];
  sorted.sort((a, b) => {
    if (a.name === "default") return -1;
    if (b.name === "default") return 1;
    return a.name.localeCompare(b.name);
  });
  return sorted;
});

const filteredGroups = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return sortedGroups.value;
  return sortedGroups.value.filter((g) =>
    g.name.toLowerCase().includes(q),
  );
});

async function loadGroups() {
  loading.value = true;
  loadError.value = null;
  try {
    await wazuhStore.fetchGroups();
    // Auto-select "default" if present
    const hasDefault = groups.value.some((g) => g.name === "default");
    if (hasDefault) {
      selectedGroup.value = "default";
    }
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

function onConfirm() {
  if (!selectedGroup.value) return;
  const body: DeployRequest = { group: selectedGroup.value };
  onDialogOK(body);
}

onMounted(loadGroups);
</script>

<style lang="scss" scoped>
@import "@/css/cywm.scss";

.cywm-group-dialog {
  min-width: 480px;
  max-width: 600px;
}

.cywm-group-dialog__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--cywm-text-secondary);
  margin-bottom: 8px;
}

.cywm-group-dialog__list {
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
}

.cywm-group-dialog__count {
  font-size: 12px;
  color: var(--cywm-text-secondary);
}

.cywm-group-dialog__path {
  margin-top: 12px;
}

.cywm-group-dialog__path-label {
  font-size: 12px;
  color: var(--cywm-text-secondary);
  display: block;
  margin-bottom: 4px;
}

.cywm-group-dialog__path-value {
  display: block;
  font-family: var(--cywm-mono);
  font-size: 12px;
  background: var(--cywm-bg-page);
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
  padding: 6px 10px;
}

.cywm-group-dialog__loading,
.cywm-group-dialog__error,
.cywm-group-dialog__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 13px;
  color: var(--cywm-text-secondary);
  border: 1px solid var(--cywm-border);
  border-radius: 4px;
  justify-content: center;
}

.cywm-group-dialog__error {
  color: var(--cywm-danger);
}

.cywm-group-dialog__error-text {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
