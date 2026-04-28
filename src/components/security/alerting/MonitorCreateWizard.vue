<template>
  <div class="wz-wizard-overlay">
    <div class="wz-wizard">
      <!-- Header -->
      <div class="wz-wizard__header">
        <h2 class="wz-wizard__title">{{ isEditing ? 'Edit monitor' : 'Create monitor' }}</h2>
        <button class="wz-btn-icon" @click="$emit('close')">
          <q-icon name="close" size="20px" />
        </button>
      </div>

      <!-- Steps indicator -->
      <div class="wz-wizard__steps">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="wz-step"
          :class="{
            'wz-step--active': currentStep === i,
            'wz-step--done': currentStep > i,
          }"
          @click="goToStep(i)"
        >
          <span class="wz-step__num">{{ i + 1 }}</span>
          <span class="wz-step__label">{{ step }}</span>
        </div>
      </div>

      <!-- Step content -->
      <div class="wz-wizard__body">
        <!-- Step 1: Monitor details -->
        <div v-if="currentStep === 0" class="wz-wizard__section">
          <h3 class="wz-form-title">Monitor details</h3>

          <div class="wz-form-group">
            <label class="wz-label">Monitor type</label>
            <div class="wz-radio-cards">
              <label
                v-for="opt in monitorTypeOptions"
                :key="opt.value"
                class="wz-radio-card"
                :class="{ 'wz-radio-card--selected': form.type === opt.value }"
              >
                <input type="radio" :value="opt.value" v-model="form.type" class="wz-radio-card__input" />
                <span class="wz-radio-card__title">{{ opt.label }}</span>
                <span class="wz-radio-card__desc">{{ opt.description }}</span>
              </label>
            </div>
          </div>

          <div class="wz-form-group">
            <label class="wz-label">Monitor name</label>
            <input v-model="form.name" class="wz-input" placeholder="e.g. High CPU Usage Monitor" />
          </div>

          <div class="wz-form-row">
            <div class="wz-form-group wz-form-group--half">
              <label class="wz-label">Frequency</label>
              <div class="wz-input-row">
                <input v-model.number="form.scheduleInterval" type="number" min="1" class="wz-input wz-input--sm" />
                <select v-model="form.scheduleUnit" class="wz-select">
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Data source -->
        <div v-if="currentStep === 1" class="wz-wizard__section">
          <h3 class="wz-form-title">Data source</h3>

          <div class="wz-form-group">
            <label class="wz-label">Define using</label>
            <select v-model="form.definitionMethod" class="wz-select wz-select--full">
              <option value="visual">Visual editor</option>
              <option value="extraction_query">Extraction query editor</option>
              <option value="anomaly_detector">Anomaly detector</option>
            </select>
          </div>

          <div class="wz-form-group">
            <label class="wz-label">Index</label>
            <input v-model="form.index" class="wz-input" placeholder="e.g. wazuh-alerts-*" />
          </div>

          <div class="wz-form-group">
            <label class="wz-label">Time field</label>
            <input v-model="form.timeField" class="wz-input" placeholder="e.g. timestamp" />
          </div>

          <div v-if="form.definitionMethod === 'extraction_query'" class="wz-form-group">
            <label class="wz-label">Query</label>
            <textarea
              v-model="form.queryString"
              class="wz-textarea"
              rows="8"
              placeholder='{ "query": { "match_all": {} } }'
            />
          </div>

          <div class="wz-form-group">
            <button class="wz-btn wz-btn--outline" @click="runTestQuery" :disabled="store.queryTestLoading">
              <q-spinner v-if="store.queryTestLoading" size="14px" color="primary" class="q-mr-sm" />
              Run query
            </button>
            <div v-if="store.queryTestResult" class="wz-test-result" :class="store.queryTestResult.success ? 'wz-test-result--ok' : 'wz-test-result--err'">
              <template v-if="store.queryTestResult.success">
                Query returned {{ store.queryTestResult.count }} document(s)
              </template>
              <template v-else>
                Error: {{ store.queryTestResult.error }}
              </template>
            </div>
          </div>
        </div>

        <!-- Step 3: Triggers -->
        <div v-if="currentStep === 2" class="wz-wizard__section">
          <h3 class="wz-form-title">Triggers</h3>

          <div v-for="(trigger, ti) in form.triggers" :key="ti" class="wz-trigger-card">
            <div class="wz-trigger-card__header">
              <span class="wz-trigger-card__title">Trigger {{ ti + 1 }}</span>
              <button class="wz-btn-icon" @click="removeTrigger(ti)">
                <q-icon name="delete_outline" size="18px" />
              </button>
            </div>
            <div class="wz-form-group">
              <label class="wz-label">Trigger name</label>
              <input v-model="trigger.name" class="wz-input" placeholder="e.g. High severity alert" />
            </div>
            <div class="wz-form-row">
              <div class="wz-form-group wz-form-group--half">
                <label class="wz-label">Severity level</label>
                <select v-model="trigger.severity" class="wz-select wz-select--full">
                  <option value="1">1 (Highest)</option>
                  <option value="2">2 (High)</option>
                  <option value="3">3 (Medium)</option>
                  <option value="4">4 (Low)</option>
                  <option value="5">5 (Lowest)</option>
                </select>
              </div>
            </div>
            <div class="wz-form-group">
              <label class="wz-label">Trigger condition</label>
              <textarea
                v-model="trigger.condition"
                class="wz-textarea"
                rows="3"
                placeholder="ctx.results[0].hits.total.value > 0"
              />
            </div>

            <!-- Actions in trigger -->
            <div class="wz-trigger-actions">
              <div class="wz-trigger-actions__header">
                <span class="wz-label">Actions</span>
                <button class="wz-btn wz-btn--sm wz-btn--outline" @click="addAction(ti)">+ Add action</button>
              </div>
              <div v-for="(action, ai) in trigger.actions" :key="ai" class="wz-action-item">
                <div class="wz-form-group">
                  <label class="wz-label">Action name</label>
                  <input v-model="action.name" class="wz-input" placeholder="e.g. Send Slack notification" />
                </div>
                <div class="wz-form-group">
                  <label class="wz-label">Notification channel</label>
                  <select
                    :value="action.channelId"
                    class="wz-select wz-select--full"
                    @change="onChannelChange(ti, ai, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="">-- Select channel --</option>
                    <option v-for="ch in store.channels" :key="ch.config_id" :value="ch.config_id">
                      {{ ch.name }} ({{ channelTypeLabel(ch.config_type) }})
                    </option>
                  </select>
                  <small v-if="actionChannelHint(action)" class="wz-hint">
                    {{ actionChannelHint(action) }}
                  </small>
                </div>
                <div class="wz-form-group">
                  <label class="wz-label">
                    Message template
                    <span v-if="isJsonChannel(action.channelId)" class="wz-tag">JSON body</span>
                  </label>
                  <textarea v-model="action.messageTemplate" class="wz-textarea" rows="4" :placeholder="messageTemplatePlaceholder(action.channelId)" />
                  <small class="wz-hint">
                    Mustache. Use
                    <code v-pre>{{ctx.monitor.name}}</code>,
                    <code v-pre>{{ctx.trigger.name}}</code>,
                    <code v-pre>{{ctx.trigger.severity}}</code>.
                  </small>
                </div>
                <button class="wz-btn wz-btn--sm wz-btn--text-danger" @click="removeAction(ti, ai)">Remove action</button>
              </div>
            </div>
          </div>

          <button class="wz-btn wz-btn--outline" @click="addTrigger">+ Add trigger</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="wz-wizard__footer">
        <button v-if="currentStep > 0" class="wz-btn wz-btn--outline" @click="currentStep--">Previous</button>
        <div class="wz-wizard__footer-right">
          <button class="wz-btn wz-btn--outline" @click="$emit('close')">Cancel</button>
          <button v-if="currentStep < steps.length - 1" class="wz-btn wz-btn--primary" @click="currentStep++">Next</button>
          <button v-else class="wz-btn wz-btn--primary" :disabled="saving" @click="saveMonitor">
            <q-spinner v-if="saving" size="14px" color="white" class="q-mr-sm" />
            {{ isEditing ? 'Update monitor' : 'Create monitor' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import {
  MONITOR_TYPE_OPTIONS,
  channelTypeLabel,
  DEFAULT_TELEGRAM_MESSAGE_TEMPLATE,
  DEFAULT_GENERIC_MESSAGE_TEMPLATE,
} from "@/types/alerting";
import type { Monitor, MonitorType, ScheduleUnit, MonitorDefiningMethod, NotificationChannel } from "@/types/alerting";

const props = defineProps<{
  editing: Monitor | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const store = useAlertingStore();

const isEditing = computed(() => !!props.editing);
const monitorTypeOptions = MONITOR_TYPE_OPTIONS;
const steps = ["Monitor details", "Data source", "Triggers"];
const currentStep = ref(0);
const saving = ref(false);

interface TriggerForm {
  name: string;
  severity: string;
  condition: string;
  actions: ActionForm[];
}

interface ActionForm {
  name: string;
  channelId: string;
  messageTemplate: string;
}

const form = reactive({
  name: "",
  type: "per_query" as MonitorType,
  definitionMethod: "visual" as MonitorDefiningMethod,
  scheduleInterval: 10,
  scheduleUnit: "minutes" as ScheduleUnit,
  index: "wazuh-alerts-*",
  timeField: "timestamp",
  queryString: '{ "query": { "match_all": {} } }',
  triggers: [] as TriggerForm[],
});

function initFromEditing() {
  if (props.editing) {
    form.name = props.editing.name;
    form.type = props.editing.type;
    form.definitionMethod = props.editing.definition_method;
    form.scheduleInterval = props.editing.schedule.period.interval;
    form.scheduleUnit = props.editing.schedule.period.unit;
    if (props.editing.inputs.length > 0) {
      form.index = props.editing.inputs[0].search.indices[0] || "wazuh-alerts-*";
    }
    form.triggers = props.editing.triggers.map((t) => ({
      name: t.name,
      severity: t.severity,
      condition: t.condition.script,
      actions: t.actions.map((a) => ({
        name: a.name,
        channelId: a.destination_id,
        messageTemplate: a.message_template,
      })),
    }));
  }
}

function addTrigger() {
  form.triggers.push({ name: "", severity: "3", condition: "", actions: [] });
}

function removeTrigger(index: number) {
  form.triggers.splice(index, 1);
}

function addAction(triggerIndex: number) {
  form.triggers[triggerIndex].actions.push({
    name: "",
    channelId: "",
    messageTemplate: DEFAULT_GENERIC_MESSAGE_TEMPLATE,
  });
}

function findChannel(id: string): NotificationChannel | undefined {
  return store.channels.find((c) => c.config_id === id);
}

function isJsonChannel(channelId: string): boolean {
  const ch = findChannel(channelId);
  return ch?.config_type === "telegram" || ch?.config_type === "webhook";
}

function defaultTemplateFor(channelId: string): string {
  const ch = findChannel(channelId);
  if (ch?.config_type === "telegram") return DEFAULT_TELEGRAM_MESSAGE_TEMPLATE;
  return DEFAULT_GENERIC_MESSAGE_TEMPLATE;
}

function messageTemplatePlaceholder(channelId: string): string {
  if (!channelId) return "Monitor {{ctx.monitor.name}} triggered...";
  const ch = findChannel(channelId);
  if (ch?.config_type === "telegram") {
    return '{"text":"Monitor {{ctx.monitor.name}} triggered","parse_mode":"HTML"}';
  }
  return "Monitor {{ctx.monitor.name}} triggered...";
}

function actionChannelHint(action: ActionForm): string {
  const ch = findChannel(action.channelId);
  if (!ch) return "";
  if (ch.config_type === "telegram") {
    const chat = ch.config.telegram?.chat_id || "—";
    return `Telegram chat ${chat}. Body must be valid JSON for Telegram Bot API.`;
  }
  if (ch.config_type === "webhook") {
    return "Custom webhook — body is sent verbatim with the configured Content-Type.";
  }
  return "";
}

function isDefaultTemplate(value: string): boolean {
  return (
    value.trim() === "" ||
    value.trim() === DEFAULT_GENERIC_MESSAGE_TEMPLATE.trim() ||
    value.trim() === DEFAULT_TELEGRAM_MESSAGE_TEMPLATE.trim() ||
    value.trim() === "Monitor {{ctx.monitor.name}} triggered!"
  );
}

function onChannelChange(triggerIndex: number, actionIndex: number, channelId: string) {
  const action = form.triggers[triggerIndex].actions[actionIndex];
  action.channelId = channelId;
  if (isDefaultTemplate(action.messageTemplate)) {
    action.messageTemplate = defaultTemplateFor(channelId);
  }
}

function removeAction(triggerIndex: number, actionIndex: number) {
  form.triggers[triggerIndex].actions.splice(actionIndex, 1);
}

function goToStep(index: number) {
  if (index <= currentStep.value) {
    currentStep.value = index;
  }
}

async function runTestQuery() {
  await store.testQuery(form.index, form.queryString);
}

async function saveMonitor() {
  saving.value = true;
  try {
    const payload: Partial<Monitor> = {
      name: form.name,
      type: form.type,
      definition_method: form.definitionMethod,
      schedule: { period: { interval: form.scheduleInterval, unit: form.scheduleUnit } },
      inputs: [{
        search: {
          indices: [form.index],
          query: form.definitionMethod === "extraction_query"
            ? JSON.parse(form.queryString || "{}")
            : { query: { match_all: {} } },
        },
      }],
      triggers: form.triggers.map((t) => ({
        name: t.name,
        severity: t.severity,
        condition: { script: t.condition },
        actions: t.actions.map((a) => ({
          name: a.name,
          destination_id: a.channelId,
          message_template: a.messageTemplate,
          throttle_enabled: false,
        })),
      })),
    };

    if (isEditing.value && props.editing) {
      await store.updateMonitor(props.editing.id, payload);
    } else {
      await store.createMonitor(payload);
    }
    emit("created");
  } catch (e) {
    console.error("[Alerting] Failed to save monitor:", e);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  initFromEditing();
  store.loadChannels();
});
</script>

<style scoped>
.wz-wizard-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 100;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 32px;
}

.wz-wizard {
  background: #fff;
  border-radius: 6px;
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}

.wz-wizard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #d3dae6;
}

.wz-wizard__title {
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  color: #1a1c21;
}

/* Steps */
.wz-wizard__steps {
  display: flex;
  gap: 0;
  padding: 0 24px;
  border-bottom: 1px solid #d3dae6;
}

.wz-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 14px;
  color: #69707d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.wz-step--active {
  color: #006bb4;
  border-bottom-color: #006bb4;
  font-weight: 600;
}

.wz-step--done { color: #017d73; }

.wz-step__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  background: #d3dae6;
  color: #69707d;
}

.wz-step--active .wz-step__num { background: #006bb4; color: #fff; }
.wz-step--done .wz-step__num { background: #017d73; color: #fff; }

/* Body */
.wz-wizard__body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
}

.wz-wizard__section {}

.wz-form-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1c21;
  margin: 0 0 20px;
}

/* Form elements */
.wz-form-group { margin-bottom: 16px; }
.wz-form-group--half { flex: 1; }

.wz-form-row {
  display: flex;
  gap: 16px;
}

.wz-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #69707d;
  margin-bottom: 4px;
}

.wz-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
}

.wz-input:focus { outline: none; border-color: #006bb4; }
.wz-input--sm { width: 80px; }

.wz-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.wz-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 13px;
  font-family: "Roboto Mono", monospace;
  color: #343741;
  background: #fbfcfd;
  resize: vertical;
}

.wz-textarea:focus { outline: none; border-color: #006bb4; }

.wz-select {
  padding: 8px 28px 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
  appearance: auto;
}

.wz-select--full { width: 100%; }

/* Radio cards */
.wz-radio-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wz-radio-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.wz-radio-card:hover { background: #f5f7fa; }

.wz-radio-card--selected {
  border-color: #006bb4;
  background: #e6f2fb;
}

.wz-radio-card__input { display: none; }

.wz-radio-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1c21;
}

.wz-radio-card__desc {
  font-size: 12px;
  color: #69707d;
}

/* Trigger card */
.wz-trigger-card {
  border: 1px solid #d3dae6;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.wz-trigger-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.wz-trigger-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1c21;
}

/* Actions in trigger */
.wz-trigger-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef1f5;
}

.wz-trigger-actions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.wz-action-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.wz-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #69707d;
}

.wz-hint code {
  background: rgba(0, 107, 180, 0.08);
  padding: 0 4px;
  border-radius: 3px;
  font-size: 11px;
}

.wz-tag {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-radius: 3px;
  background: #e0f2fe;
  color: #0369a1;
}

/* Test result */
.wz-test-result {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
}

.wz-test-result--ok { background: #e6f9f7; color: #017d73; }
.wz-test-result--err { background: #fef0ef; color: #bd271e; }

/* Buttons */
.wz-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wz-btn--sm { padding: 4px 12px; font-size: 13px; }
.wz-btn--outline { background: #fff; border: 1px solid #d3dae6; color: #343741; }
.wz-btn--outline:hover { background: #f5f7fa; }
.wz-btn--outline:disabled { opacity: 0.5; cursor: default; }
.wz-btn--primary { background: #006bb4; color: #fff; border: 1px solid #006bb4; }
.wz-btn--primary:hover { background: #005a9e; }
.wz-btn--primary:disabled { opacity: 0.6; cursor: default; }
.wz-btn--text-danger { background: none; border: none; color: #bd271e; padding: 4px 0; font-size: 13px; }
.wz-btn--text-danger:hover { text-decoration: underline; }

.wz-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #69707d;
}

.wz-btn-icon:hover { color: #343741; }

/* Footer */
.wz-wizard__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #d3dae6;
}

.wz-wizard__footer-right { display: flex; gap: 8px; margin-left: auto; }

/* Dark mode */
.body--dark .wz-wizard { background: #1d1e24; }
.body--dark .wz-wizard__header { border-color: #343741; }
.body--dark .wz-wizard__title { color: #dfe5ef; }
.body--dark .wz-wizard__steps { border-color: #343741; }
.body--dark .wz-step { color: #98a2b3; }
.body--dark .wz-step--active { color: #36a2ef; border-bottom-color: #36a2ef; }
.body--dark .wz-step__num { background: #343741; color: #98a2b3; }
.body--dark .wz-step--active .wz-step__num { background: #36a2ef; color: #fff; }
.body--dark .wz-form-title { color: #dfe5ef; }
.body--dark .wz-label { color: #98a2b3; }
.body--dark .wz-input { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-textarea { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-select { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-radio-card { border-color: #343741; }
.body--dark .wz-radio-card:hover { background: #25262b; }
.body--dark .wz-radio-card--selected { border-color: #36a2ef; background: #0a2d4d; }
.body--dark .wz-radio-card__title { color: #dfe5ef; }
.body--dark .wz-radio-card__desc { color: #98a2b3; }
.body--dark .wz-trigger-card { border-color: #343741; }
.body--dark .wz-trigger-card__title { color: #dfe5ef; }
.body--dark .wz-trigger-actions { border-color: #343741; }
.body--dark .wz-action-item { background: #25262b; }
.body--dark .wz-hint { color: #98a2b3; }
.body--dark .wz-hint code { background: rgba(54, 162, 239, 0.16); color: #cbe2f3; }
.body--dark .wz-tag { background: #082f49; color: #38bdf8; }
.body--dark .wz-btn--outline { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-wizard__footer { border-color: #343741; }
</style>
