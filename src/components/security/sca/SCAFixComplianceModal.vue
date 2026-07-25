<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    @keydown.esc="onDialogHide"
    :maximized="maximized"
  >
    <q-card class="sca-fix-dialog" :style="!maximized ? 'min-width: 640px; max-width: 820px' : ''">
      <q-bar class="sca-fix-bar">
        <q-icon name="build" size="18px" />
        <span class="sca-fix-bar__title">Fix Compliance — {{ check.title }}</span>
        <q-space />
        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximized = false"
          :disable="!maximized"
        >
          <q-tooltip v-if="maximized" class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximized = true"
          :disable="maximized"
        >
          <q-tooltip v-if="!maximized" class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <!-- Check info summary -->
      <q-card-section class="sca-fix-info">
        <div class="sca-fix-info__row">
          <div class="sca-fix-info__label">Check:</div>
          <div class="sca-fix-info__value">
            <q-badge color="red" label="failed" class="q-mr-sm" />
            {{ check.title }}
          </div>
        </div>
        <div v-if="check.remediation" class="sca-fix-info__row">
          <div class="sca-fix-info__label">Recommended fix:</div>
          <div class="sca-fix-info__value sca-fix-info__remediation">
            {{ check.remediation }}
          </div>
        </div>
        <div v-if="getTarget(check)" class="sca-fix-info__row">
          <div class="sca-fix-info__label">Target:</div>
          <div class="sca-fix-info__value sca-fix-info__mono">{{ getTarget(check) }}</div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Mode selector: Script vs Command -->
      <q-tabs
        v-model="mode"
        dense
        no-caps
        inline-label
        indicator-color="primary"
        active-color="primary"
        class="sca-fix-tabs"
      >
        <q-tab name="script" icon="description" label="Script" />
        <q-tab name="command" icon="terminal" label="Command" />
      </q-tabs>
      <q-separator />

      <!-- Form -->
      <q-form @submit.prevent="executeRemediation">
        <!-- Script mode -->
        <template v-if="mode === 'script'">
          <q-card-section>
            <div class="sca-fix-section-title">Remediation Script</div>
            <p class="sca-fix-section-desc">
              Select a script from Script Manager to run on the agent for remediation.
            </p>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <tactical-dropdown
              :rules="[(val: number) => !!val || '*Required']"
              v-model="scriptState.script"
              :options="filterByPlatformOptions"
              label="Select script"
              outlined
              mapOptions
              filterable
            >
              <template v-slot:after>
                <q-btn
                  size="sm"
                  round
                  dense
                  flat
                  icon="open_in_new"
                  @click="openScriptManager"
                >
                  <q-tooltip class="bg-white text-primary text-body2">
                    Open Script Manager
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-if="syntax"
                  size="sm"
                  round
                  dense
                  flat
                  icon="info"
                  @click="openScriptURL"
                >
                  <q-tooltip class="bg-white text-primary text-body2">
                    {{ syntax }}
                  </q-tooltip>
                </q-btn>
              </template>
            </tactical-dropdown>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <tactical-dropdown
              v-model="scriptState.args"
              label="Script Arguments (press Enter after typing each argument)"
              filled
              use-input
              multiple
              hide-dropdown-icon
              input-debounce="0"
              new-value-mode="add"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <tactical-dropdown
              v-model="scriptState.env_vars"
              :label="envVarsLabel"
              filled
              use-input
              multiple
              hide-dropdown-icon
              input-debounce="0"
              new-value-mode="add"
            />
          </q-card-section>
        </template>

        <!-- Command mode -->
        <template v-if="mode === 'command'">
          <q-card-section>
            <div class="sca-fix-section-title">Run Command</div>
            <p class="sca-fix-section-desc">
              Execute a command directly on the agent.
            </p>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <p class="sca-fix-shell-label">Shell</p>
            <div class="q-gutter-sm">
              <q-radio
                v-if="agentPlatform === 'windows'"
                dense
                v-model="cmdState.shell"
                val="cmd"
                label="CMD"
              />
              <q-radio
                v-if="agentPlatform === 'windows'"
                dense
                v-model="cmdState.shell"
                val="powershell"
                label="Powershell"
              />
              <q-radio
                v-if="agentPlatform !== 'windows'"
                dense
                v-model="cmdState.shell"
                val="/bin/bash"
                label="Bash"
              />
              <q-radio
                v-if="agentPlatform !== 'windows'"
                dense
                v-model="cmdState.shell"
                val="custom"
                label="Custom"
              />
            </div>
          </q-card-section>

          <q-card-section v-if="cmdState.shell === 'custom'" class="q-pt-none">
            <q-input
              v-model="cmdState.custom_shell"
              outlined
              dense
              label="Custom shell"
              stack-label
              placeholder="/usr/bin/python3"
              :rules="[(val) => !!val || '*Required']"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="cmdState.cmd"
              outlined
              label="Command"
              stack-label
              :placeholder="cmdPlaceholder"
              :rules="[(val) => !!val || '*Required']"
              autogrow
            />
          </q-card-section>
        </template>

        <!-- Shared options -->
        <q-card-section class="q-pt-none">
          <q-option-group
            v-model="outputMode"
            :options="outputOptions"
            color="primary"
            inline
            dense
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model.number="timeout"
            dense
            outlined
            type="number"
            style="max-width: 150px"
            label="Timeout (seconds)"
            stack-label
            :rules="[
              (val) => !!val || '*Required',
              (val) => val >= 5 || 'Minimum is 5 seconds',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md">
          <q-btn label="Cancel" flat no-caps v-close-popup />
          <q-btn
            :loading="loading"
            :disabled="loading"
            label="Run Remediation"
            color="primary"
            no-caps
            unelevated
            type="submit"
            icon="play_arrow"
          />
        </q-card-actions>

        <!-- Execution results -->
        <q-card-section
          v-if="executionResult !== null"
          class="sca-fix-results q-mx-md q-mb-md"
        >
          <div class="sca-fix-results__header">
            <q-icon
              :name="executionResult.retcode === 0 ? 'check_circle' : 'error'"
              :color="executionResult.retcode === 0 ? 'green' : 'red'"
              size="20px"
            />
            <span class="sca-fix-results__title">
              {{ executionResult.retcode === 0 ? 'Executed successfully' : 'Execution failed' }}
            </span>
            <q-space />
            <span class="sca-fix-results__meta">
              Exit code: <code>{{ executionResult.retcode }}</code>
              <template v-if="executionResult.execution_time">
                &middot; Time: <code>{{ executionResult.execution_time }}s</code>
              </template>
            </span>
          </div>

          <div v-if="executionResult.stdout" class="sca-fix-results__block">
            <div class="sca-fix-results__label">
              Standard Output
              <q-btn
                flat
                dense
                size="xs"
                icon="content_copy"
                @click="copyToClipboard(executionResult.stdout)"
              >
                <q-tooltip>Copy</q-tooltip>
              </q-btn>
            </div>
            <pre class="sca-fix-results__pre">{{ executionResult.stdout }}</pre>
          </div>

          <div v-if="executionResult.stderr" class="sca-fix-results__block">
            <div class="sca-fix-results__label sca-fix-results__label--error">
              Standard Error
              <q-btn
                flat
                dense
                size="xs"
                icon="content_copy"
                @click="copyToClipboard(executionResult.stderr)"
              >
                <q-tooltip>Copy</q-tooltip>
              </q-btn>
            </div>
            <pre class="sca-fix-results__pre sca-fix-results__pre--error">{{ executionResult.stderr }}</pre>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDialogPluginComponent, useQuasar, copyToClipboard } from "quasar";
import { useRouter } from "vue-router";
import { useScriptDropdown } from "@/composables/scripts";
import { runScript, sendAgentCommand } from "@/api/agents";
import { notifySuccess } from "@/utils/notify";
import { envVarsLabel } from "@/constants/constants";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";
import type { WazuhSCACheck } from "@/types/wazuh";
import type { AgentPlatformType } from "@/types/agents";

// Props
const props = defineProps<{
  check: WazuhSCACheck;
  agentId: string; // compatibility agent_id
  agentHostname: string;
  agentPlatform: AgentPlatformType;
}>();

// Emits
defineEmits([...useDialogPluginComponent.emits]);

// Dialog setup
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const $q = useQuasar();
const router = useRouter();

// Mode: "script" or "command"
const mode = ref<"script" | "command">("script");

// Script dropdown composable
const {
  script,
  filterByPlatformOptions,
  defaultTimeout,
  defaultArgs,
  defaultEnvVars,
  syntax,
  link,
} = useScriptDropdown({
  plat: props.agentPlatform,
  onMount: true,
});

// Output options
const outputOptions = [
  { label: "Wait for Output", value: "wait" },
  { label: "Fire and Forget", value: "forget" },
];

// Shared state
const outputMode = ref("wait");
const timeout = ref(30);
const loading = ref(false);
const maximized = ref(false);
const executionResult = ref<{
  stdout: string;
  stderr: string;
  retcode: number;
  execution_time?: number;
} | null>(null);

// Script mode state
const scriptState = ref({
  script,
  args: defaultArgs,
  env_vars: defaultEnvVars,
});

// Command mode state
const cmdState = ref({
  shell: props.agentPlatform === "windows" ? "cmd" : "/bin/bash",
  cmd: "",
  custom_shell: null as string | null,
  run_as_user: false,
});

// Command placeholder based on shell/platform
const cmdPlaceholder = computed(() => {
  switch (cmdState.value.shell) {
    case "cmd":
      return "e.g. ipconfig /all";
    case "powershell":
      return "e.g. Get-Service | Where-Object {$_.Status -eq 'Running'}";
    case "/bin/bash":
      return "e.g. ls -la /etc/";
    default:
      return "Enter command...";
  }
});

// Helpers
function getTarget(check: WazuhSCACheck): string {
  return check.registry || check.file || check.directory || check.process || check.command || "";
}

function openScriptURL() {
  if (link.value) {
    window.open(link.value, "_blank");
  }
}

function openScriptManager() {
  const route = router.resolve({ name: "Resources" });
  if (route) {
    window.open(route.href, "_blank");
  }
}

// Execute remediation (script or command)
async function executeRemediation() {
  executionResult.value = null;
  loading.value = true;

  try {
    if (mode.value === "script") {
      await executeScript();
    } else {
      await executeCommand();
    }
  } catch (err: unknown) {
    console.error("[SCA Fix] Execution error:", err);
    $q.notify({
      type: "negative",
      message: `Failed to execute remediation ${mode.value}`,
      timeout: 4000,
    });
  } finally {
    loading.value = false;
  }
}

async function executeScript() {
  const payload = {
    script: scriptState.value.script,
    args: scriptState.value.args,
    env_vars: scriptState.value.env_vars,
    output: outputMode.value,
    timeout: timeout.value,
    run_as_user: false,
    run_on_server: false,
  };

  const result = await runScript(props.agentId, payload);

  if (outputMode.value === "forget") {
    if (result) notifySuccess(result);
    onDialogOK({ success: true, output: "forget" });
  } else {
    executionResult.value = result;
    if (result.retcode === 0) {
      notifySuccess("Remediation script completed successfully");
    }
  }
}

async function executeCommand() {
  const payload = {
    shell: cmdState.value.shell === "custom" ? cmdState.value.custom_shell : cmdState.value.shell,
    cmd: cmdState.value.cmd,
    timeout: timeout.value,
    run_as_user: cmdState.value.run_as_user,
  };

  const result = await sendAgentCommand(props.agentId, payload);

  if (outputMode.value === "forget") {
    if (result) notifySuccess("Command sent successfully");
    onDialogOK({ success: true, output: "forget" });
  } else {
    // sendAgentCommand returns raw output string or structured result
    if (typeof result === "string") {
      executionResult.value = {
        stdout: result,
        stderr: "",
        retcode: 0,
      };
    } else {
      executionResult.value = {
        stdout: result.stdout ?? result,
        stderr: result.stderr ?? "",
        retcode: result.retcode ?? 0,
        execution_time: result.execution_time,
      };
    }
    notifySuccess("Command executed successfully");
  }
}
</script>

<style scoped>
.sca-fix-dialog {
  border-radius: var(--mdm-radius-lg, 8px);
  overflow: hidden;
}

.sca-fix-bar {
  background: var(--mdm-bg-card, #fff);
  border-bottom: 1px solid var(--mdm-border-light, #e0e4ea);
  color: var(--mdm-text-primary, #1a1a1a);
  font-weight: 500;
  font-size: 13px;
}

.sca-fix-bar__title {
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
}

/* Check info section */
.sca-fix-info {
  background: var(--mdm-bg-subtle, #f8f9fc);
  padding: 16px 20px;
}

.sca-fix-info__row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  align-items: flex-start;
}

.sca-fix-info__row:last-child {
  margin-bottom: 0;
}

.sca-fix-info__label {
  font-weight: 600;
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  min-width: 120px;
  padding-top: 2px;
}

.sca-fix-info__value {
  font-size: 13px;
  line-height: 1.5;
  color: var(--mdm-text-primary, #1a1a1a);
  flex: 1;
}

.sca-fix-info__remediation {
  background: var(--mdm-bg-code, #eef1f6);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.sca-fix-info__mono {
  font-family: monospace;
  font-size: 12px;
  background: var(--mdm-bg-code, #eef1f6);
  padding: 4px 8px;
  border-radius: 4px;
}

/* Tabs */
.sca-fix-tabs {
  background: var(--mdm-bg-card, #fff);
}

.sca-fix-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
  min-height: 40px;
}

/* Section titles */
.sca-fix-section-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 4px;
}

.sca-fix-section-desc {
  font-size: 13px;
  color: var(--mdm-text-secondary, #666);
  margin: 0;
}

.sca-fix-shell-label {
  font-weight: 500;
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  margin: 0 0 8px 0;
}

/* Results section */
.sca-fix-results {
  background: var(--mdm-bg-subtle, #f8f9fc);
  border-radius: var(--mdm-radius-lg, 8px);
  border: 1px solid var(--mdm-border-light, #e0e4ea);
  padding: 16px;
}

.sca-fix-results__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sca-fix-results__title {
  font-weight: 600;
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-fix-results__meta {
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
}

.sca-fix-results__meta code {
  background: var(--mdm-bg-code, #eef1f6);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
}

.sca-fix-results__block {
  margin-top: 8px;
}

.sca-fix-results__label {
  font-weight: 600;
  font-size: 12px;
  color: var(--mdm-text-secondary, #666);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sca-fix-results__label--error {
  color: #d32f2f;
}

.sca-fix-results__pre {
  background: var(--mdm-bg-code, #eef1f6);
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 300px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  color: var(--mdm-text-primary, #1a1a1a);
}

.sca-fix-results__pre--error {
  background: #fef2f2;
  color: #991b1b;
}

/* Dark mode */
.body--dark .sca-fix-bar {
  background: var(--mdm-bg-card, #111827);
  border-bottom-color: var(--mdm-border, #1e293b);
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-info {
  background: var(--mdm-bg-subtle, #0d1421);
}

.body--dark .sca-fix-info__label {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .sca-fix-info__value {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-info__remediation {
  background: var(--mdm-bg-code, #1a2332);
}

.body--dark .sca-fix-info__mono {
  background: var(--mdm-bg-code, #1a2332);
}

.body--dark .sca-fix-tabs {
  background: var(--mdm-bg-card, #111827);
}

.body--dark .sca-fix-section-title {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-section-desc {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .sca-fix-shell-label {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-results {
  background: var(--mdm-bg-subtle, #0d1421);
  border-color: var(--mdm-border, #1e293b);
}

.body--dark .sca-fix-results__title {
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-results__meta {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .sca-fix-results__meta code {
  background: var(--mdm-bg-code, #1a2332);
}

.body--dark .sca-fix-results__label {
  color: var(--mdm-text-secondary, #94a3b8);
}

.body--dark .sca-fix-results__pre {
  background: var(--mdm-bg-code, #1a2332);
  color: var(--mdm-text-primary, #e8ecf4);
}

.body--dark .sca-fix-results__pre--error {
  background: #2d1b1b;
  color: #fca5a5;
}
</style>
