<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin winupdate-logs-card">
      <q-bar>
        <q-icon name="terminal" class="q-mr-sm" />
        Logs — {{ hostname }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="winupdate-logs-body scroll">
        <div v-if="loading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="32px" />
        </div>

        <div v-else-if="error" class="text-negative q-pa-md">
          {{ error }}
        </div>

        <template v-else-if="historyItem">
          <div class="winupdate-logs-meta">
            <span v-if="historyItem.last_run">
              Last run: <code>{{ formatDate(historyItem.last_run) }}</code>
            </span>
            <span v-if="historyItem.execution_time != null">
              Run time: <code>{{ historyItem.execution_time }}s</code>
            </span>
            <span v-if="historyItem.retcode != null">
              Return code: <code>{{ historyItem.retcode }}</code>
            </span>
          </div>

          <div v-if="stdout">
            <div class="winupdate-logs-section-label">
              Standard Output
              <q-btn
                flat dense round
                icon="content_copy"
                size="xs"
                class="q-ml-xs"
                @click="copy(stdout)"
              />
            </div>
            <q-separator class="q-mb-xs" />
            <pre class="winupdate-logs-pre">{{ stdout }}</pre>
          </div>

          <div v-if="stderr" class="q-mt-md">
            <div class="winupdate-logs-section-label winupdate-logs-section-label--err">
              Standard Error
              <q-btn
                flat dense round
                icon="content_copy"
                size="xs"
                class="q-ml-xs"
                @click="copy(stderr)"
              />
            </div>
            <q-separator class="q-mb-xs" />
            <pre class="winupdate-logs-pre winupdate-logs-pre--err">{{ stderr }}</pre>
          </div>

          <div v-if="!stdout && !stderr" class="text-grey-6 q-pa-sm">
            No output recorded.
          </div>
        </template>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat dense no-caps label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDialogPluginComponent, useQuasar, copyToClipboard } from "quasar";
import { fetchAgentHistoryItem } from "@/api/winupdatePatches";

const props = defineProps<{
  agentId: string;
  historyId: number;
  hostname?: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar();

const loading = ref(false);
const error = ref<string | null>(null);
const historyItem = ref<any>(null);

const stdout = computed<string>(
  () => historyItem.value?.script_results?.stdout ?? "",
);
const stderr = computed<string>(
  () => historyItem.value?.script_results?.stderr ?? "",
);

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

async function copy(text: string) {
  try {
    await copyToClipboard(text);
    $q.notify({ message: "Copied to clipboard", color: "positive", timeout: 1200 });
  } catch {
    $q.notify({ message: "Copy failed", color: "negative" });
  }
}

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    historyItem.value = await fetchAgentHistoryItem(props.agentId, props.historyId);
  } catch (e: any) {
    error.value =
      e?.response?.data?.detail ??
      e?.response?.data?.error ??
      "Failed to load logs";
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.winupdate-logs-card {
  min-width: 65vw;
  max-width: 85vw;
}

.winupdate-logs-body {
  height: 65vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.winupdate-logs-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;

  code {
    background: #f4f5f7;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
  }
}

.winupdate-logs-section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  &--err {
    color: #c62828;
  }
}

.winupdate-logs-pre {
  background: #f9fafb;
  border: 1px solid #e5e8ec;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 12px;
  font-family: "Menlo", "Monaco", "Consolas", "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 250px;
  overflow: auto;

  &--err {
    background: #fff8f8;
    border-color: #ffd0d0;
    color: #c62828;
  }
}
</style>
