<template>
  <div class="wz-modal-overlay" @click.self="$emit('close')">
    <div class="wz-modal">
      <div class="wz-modal__header">
        <h3 class="wz-modal__title">Create channel</h3>
        <button class="wz-btn-icon" @click="$emit('close')">
          <q-icon name="close" size="20px" />
        </button>
      </div>

      <div class="wz-modal__body">
        <div class="wz-form-group">
          <label class="wz-label">Channel name</label>
          <input v-model="form.name" class="wz-input" placeholder="My Channel" />
        </div>

        <div class="wz-form-group">
          <label class="wz-label">Description (optional)</label>
          <input v-model="form.description" class="wz-input" placeholder="Channel description" />
        </div>

        <div class="wz-form-group">
          <label class="wz-label">Channel type</label>
          <select v-model="form.configType" class="wz-select wz-select--full">
            <option value="telegram">Telegram</option>
            <option value="slack">Slack</option>
            <option value="email">Email</option>
            <option value="webhook">Custom webhook</option>
            <option value="chime">Amazon Chime</option>
            <option value="sns">Amazon SNS</option>
            <option value="ses">Amazon SES</option>
            <option value="pagerduty">PagerDuty</option>
          </select>
        </div>

        <!-- Telegram config -->
        <template v-if="form.configType === 'telegram'">
          <div class="wz-callout">
            <div class="wz-callout__title">How to get Telegram credentials</div>
            <ol class="wz-callout__list">
              <li>Open <a href="https://t.me/BotFather" target="_blank" rel="noopener">@BotFather</a> → <code>/newbot</code> → copy the <strong>Bot token</strong>.</li>
              <li>Add the bot to your group/channel (or DM the bot first).</li>
              <li>Open <code>https://api.telegram.org/bot&lt;token&gt;/getUpdates</code> after sending a test message — copy <code>chat.id</code>.</li>
            </ol>
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Bot token</label>
            <input
              v-model.trim="form.telegramBotToken"
              class="wz-input"
              placeholder="123456789:AAH..."
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Chat ID</label>
            <input
              v-model.trim="form.telegramChatId"
              class="wz-input"
              placeholder="-1001234567890 or 123456789"
              autocomplete="off"
              spellcheck="false"
            />
            <small class="wz-hint">Negative for groups/channels, positive for private chats.</small>
          </div>
        </template>

        <!-- Slack config -->
        <template v-if="form.configType === 'slack'">
          <div class="wz-form-group">
            <label class="wz-label">Slack webhook URL</label>
            <input v-model="form.slackUrl" class="wz-input" placeholder="https://hooks.slack.com/services/..." />
          </div>
        </template>

        <!-- Webhook config -->
        <template v-if="form.configType === 'webhook'">
          <div class="wz-form-group">
            <label class="wz-label">Webhook URL</label>
            <input v-model="form.webhookUrl" class="wz-input" placeholder="https://..." />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Method</label>
            <select v-model="form.webhookMethod" class="wz-select wz-select--full">
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="GET">GET</option>
            </select>
          </div>
          <div class="wz-form-group">
            <div class="wz-form-group__header">
              <label class="wz-label">Headers</label>
              <button type="button" class="wz-btn wz-btn--sm wz-btn--outline" @click="addHeader">+ Add header</button>
            </div>
            <div v-for="(h, i) in form.webhookHeaders" :key="i" class="wz-kv-row">
              <input v-model="h.key" class="wz-input wz-input--kv" placeholder="Header name (e.g. Content-Type)" />
              <input v-model="h.value" class="wz-input wz-input--kv" placeholder="Value (e.g. application/json)" />
              <button type="button" class="wz-btn-icon" @click="form.webhookHeaders.splice(i, 1)">
                <q-icon name="delete_outline" size="16px" />
              </button>
            </div>
          </div>
          <div class="wz-form-group">
            <div class="wz-form-group__header">
              <label class="wz-label">Query parameters</label>
              <button type="button" class="wz-btn wz-btn--sm wz-btn--outline" @click="addQuery">+ Add parameter</button>
            </div>
            <div v-for="(q, i) in form.webhookQuery" :key="i" class="wz-kv-row">
              <input v-model="q.key" class="wz-input wz-input--kv" placeholder="Parameter name" />
              <input v-model="q.value" class="wz-input wz-input--kv" placeholder="Value" />
              <button type="button" class="wz-btn-icon" @click="form.webhookQuery.splice(i, 1)">
                <q-icon name="delete_outline" size="16px" />
              </button>
            </div>
          </div>
        </template>

        <!-- Email config -->
        <template v-if="form.configType === 'email'">
          <div class="wz-form-group">
            <label class="wz-label">Sender</label>
            <select v-model="form.emailSenderId" class="wz-select wz-select--full">
              <option value="">-- Select sender --</option>
              <option v-for="s in store.smtpSenders" :key="s.config_id" :value="s.config_id">
                {{ s.name }} ({{ s.from_address }})
              </option>
              <option v-for="s in store.sesSenders" :key="s.config_id" :value="s.config_id">
                {{ s.name }} (SES - {{ s.from_address }})
              </option>
            </select>
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Default recipients</label>
            <input v-model="form.emailRecipients" class="wz-input" placeholder="user@example.com, other@example.com" />
          </div>
        </template>

        <!-- PagerDuty config -->
        <template v-if="form.configType === 'pagerduty'">
          <div class="wz-form-group">
            <label class="wz-label">Integration key</label>
            <input v-model="form.pagerdutyKey" class="wz-input" placeholder="Integration key" />
          </div>
        </template>

        <!-- Chime config -->
        <template v-if="form.configType === 'chime'">
          <div class="wz-form-group">
            <label class="wz-label">Chime webhook URL</label>
            <input v-model="form.chimeUrl" class="wz-input" placeholder="https://hooks.chime.aws/..." />
          </div>
        </template>

        <!-- SNS config -->
        <template v-if="form.configType === 'sns'">
          <div class="wz-form-group">
            <label class="wz-label">SNS topic ARN</label>
            <input v-model="form.snsTopicArn" class="wz-input" placeholder="arn:aws:sns:..." />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">IAM role ARN</label>
            <input v-model="form.snsRoleArn" class="wz-input" placeholder="arn:aws:iam:..." />
          </div>
        </template>
      </div>

      <div class="wz-modal__footer">
        <button class="wz-btn wz-btn--outline" @click="$emit('close')">Cancel</button>
        <button class="wz-btn wz-btn--primary" :disabled="saveDisabled" @click="save">
          <q-spinner v-if="saving" size="14px" color="white" class="q-mr-sm" />
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import type { ChannelType } from "@/types/alerting";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const store = useAlertingStore();
const saving = ref(false);

interface KV {
  key: string;
  value: string;
}

const form = reactive({
  name: "",
  description: "",
  configType: "telegram" as ChannelType,
  telegramBotToken: "",
  telegramChatId: "",
  slackUrl: "",
  webhookUrl: "",
  webhookMethod: "POST",
  webhookHeaders: [] as KV[],
  webhookQuery: [] as KV[],
  emailSenderId: "",
  emailRecipients: "",
  pagerdutyKey: "",
  chimeUrl: "",
  snsTopicArn: "",
  snsRoleArn: "",
});

function addHeader() {
  form.webhookHeaders.push({ key: "", value: "" });
}

function addQuery() {
  form.webhookQuery.push({ key: "", value: "" });
}

function kvToRecord(list: KV[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { key, value } of list) {
    const k = key.trim();
    if (k) out[k] = value;
  }
  return out;
}

function buildConfig(): Record<string, unknown> {
  switch (form.configType) {
    case "telegram":
      return {
        telegram: {
          bot_token: form.telegramBotToken,
          chat_id: form.telegramChatId,
        },
      };
    case "slack":
      return { slack: { url: form.slackUrl } };
    case "webhook":
      return {
        webhook: {
          url: form.webhookUrl,
          method: form.webhookMethod,
          header_params: kvToRecord(form.webhookHeaders),
          query_params: kvToRecord(form.webhookQuery),
        },
      };
    case "email":
      return {
        email: {
          sender_id: form.emailSenderId,
          recipients: form.emailRecipients.split(",").map((r) => r.trim()).filter(Boolean),
        },
      };
    case "pagerduty":
      return { pagerduty: { integration_key: form.pagerdutyKey } };
    case "chime":
      return { chime: { url: form.chimeUrl } };
    case "sns":
      return { sns: { topic_arn: form.snsTopicArn, role_arn: form.snsRoleArn } };
    default:
      return {};
  }
}

const saveDisabled = computed(() => {
  if (saving.value) return true;
  if (!form.name.trim()) return true;
  switch (form.configType) {
    case "telegram":
      return !form.telegramBotToken.trim() || !form.telegramChatId.trim();
    case "slack":
      return !form.slackUrl.trim();
    case "webhook":
      return !form.webhookUrl.trim();
    case "email":
      return !form.emailSenderId || !form.emailRecipients.trim();
    case "chime":
      return !form.chimeUrl.trim();
    case "pagerduty":
      return !form.pagerdutyKey.trim();
    case "sns":
      return !form.snsTopicArn.trim();
    default:
      return false;
  }
});

async function save() {
  saving.value = true;
  try {
    await store.createChannel({
      name: form.name,
      description: form.description,
      config_type: form.configType,
      is_enabled: true,
      config: buildConfig(),
    });
    emit("created");
  } catch (e) {
    console.error("[Alerting] Failed to create channel:", e);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.wz-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 110;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wz-modal {
  background: #fff;
  border-radius: 6px;
  width: 540px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}

.wz-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #d3dae6;
}

.wz-modal__title {
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  color: #1a1c21;
}

.wz-modal__body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.wz-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #d3dae6;
}

.wz-form-group { margin-bottom: 16px; }

.wz-form-group__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.wz-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #69707d;
}

.wz-callout {
  background: #f0f7ff;
  border: 1px solid #c8def0;
  border-radius: 4px;
  padding: 12px 14px;
  margin-bottom: 16px;
  color: #0a3d72;
  font-size: 13px;
}

.wz-callout__title {
  font-weight: 600;
  margin-bottom: 6px;
}

.wz-callout__list {
  margin: 0;
  padding-left: 18px;
  line-height: 1.5;
}

.wz-callout__list code {
  background: rgba(0, 107, 180, 0.08);
  padding: 0 4px;
  border-radius: 3px;
  font-size: 12px;
}

.wz-callout a { color: #006bb4; text-decoration: underline; }

.wz-kv-row {
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 6px;
  margin-bottom: 6px;
}

.wz-input--kv { font-size: 13px; padding: 6px 10px; }

.wz-btn--sm { padding: 4px 10px; font-size: 12px; }

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

.wz-btn--outline { background: #fff; border: 1px solid #d3dae6; color: #343741; }
.wz-btn--outline:hover { background: #f5f7fa; }
.wz-btn--primary { background: #006bb4; color: #fff; border: 1px solid #006bb4; }
.wz-btn--primary:hover { background: #005a9e; }
.wz-btn--primary:disabled { opacity: 0.6; cursor: default; }

.wz-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #69707d;
}

.wz-btn-icon:hover { color: #343741; }

/* Dark mode */
.body--dark .wz-modal { background: #1d1e24; }
.body--dark .wz-modal__header { border-color: #343741; }
.body--dark .wz-modal__title { color: #dfe5ef; }
.body--dark .wz-modal__footer { border-color: #343741; }
.body--dark .wz-label { color: #98a2b3; }
.body--dark .wz-input { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-select { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-btn--outline { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-callout { background: #0a2238; border-color: #163d61; color: #cbe2f3; }
.body--dark .wz-callout a { color: #36a2ef; }
.body--dark .wz-callout__list code { background: rgba(54, 162, 239, 0.16); }
.body--dark .wz-hint { color: #98a2b3; }
</style>
