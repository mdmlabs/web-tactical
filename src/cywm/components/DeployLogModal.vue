<template>
  <q-dialog ref="dialogRef" :persistent="isDeploying" @hide="onDialogHide">
    <q-card class="cywm-deploy-modal">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          <span v-if="isDeploying">
            <q-spinner-dots color="primary" size="20px" /> Deploying
            {{ filename }}...
          </span>
          <span v-else-if="finalRecord">
            <q-icon
              :name="
                finalRecord.status === 'success' ? 'check_circle' : 'error'
              "
              :color="
                finalRecord.status === 'success' ? 'positive' : 'negative'
              "
              size="20px"
            />
            Deploy {{ finalRecord.status }}: {{ filename }}
          </span>
          <span v-else>
            <q-icon name="article" size="20px" />
            Deploy log
          </span>
        </div>
        <q-space />
        <q-btn
          v-if="!isDeploying"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <pre class="cywm-deploy-modal__log">{{ displayedLog }}</pre>
        <div v-if="finalRecord" class="cywm-deploy-modal__meta">
          <span
            >Target: <strong>{{ finalRecord.target }}</strong></span
          >
          <span
            >Duration:
            <strong
              >{{ (finalRecord.durationMs / 1000).toFixed(1) }}s</strong
            ></span
          >
          <span
            >By: <strong>{{ finalRecord.user }}</strong></span
          >
        </div>
      </q-card-section>

      <q-card-actions v-if="!isDeploying" align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useDeploy } from "@/cywm/composables/useDeploy";
import type { ConfigFile, DeployRecord, DeployRequest } from "@/cywm/types";

const props = defineProps<{
  // Mode A: start a new deploy for a file
  file?: ConfigFile;
  // Optional deploy body (agent_ids for windows-agent targets)
  deployBody?: DeployRequest;
  // Mode B: view an existing record (from history)
  existingRecord?: DeployRecord;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const { isDeploying, liveLog, finalRecord, runDeploy } = useDeploy();

const filename = computed(
  () => props.existingRecord?.filename ?? props.file?.filename ?? "",
);

const displayedLog = computed(() => {
  if (props.existingRecord) return props.existingRecord.log;
  if (finalRecord.value) return finalRecord.value.log;
  return liveLog.value || "Starting...";
});

onMounted(async () => {
  if (props.file) {
    try {
      const record = await runDeploy(props.file, props.deployBody);
      onDialogOK(record);
    } catch (e) {
      console.error("[cywm] deploy error:", e);
    }
  }
});
</script>

<style scoped>
.cywm-deploy-modal {
  min-width: 640px;
  max-width: 800px;
}

.cywm-deploy-modal__log {
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: "Menlo", "Monaco", "Consolas", monospace;
  font-size: 12px;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
  max-height: 360px;
  min-height: 120px;
  overflow: auto;
  white-space: pre-wrap;
}

.cywm-deploy-modal__meta {
  display: flex;
  gap: 24px;
  margin-top: 12px;
  font-size: 12px;
  color: #69707d;
}
</style>
