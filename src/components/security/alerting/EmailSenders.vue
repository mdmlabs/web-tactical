<template>
  <div class="wz-email-senders">
    <!-- SMTP Senders -->
    <div class="wz-panel">
      <div class="wz-panel__header">
        <h3 class="wz-panel__title">SMTP senders</h3>
        <button class="wz-btn wz-btn--primary" @click="showSmtpForm = !showSmtpForm">
          {{ showSmtpForm ? 'Cancel' : '+ Add SMTP sender' }}
        </button>
      </div>

      <!-- Inline create form -->
      <div v-if="showSmtpForm" class="wz-inline-form">
        <div class="wz-form-row">
          <div class="wz-form-group">
            <label class="wz-label">Sender name</label>
            <input v-model="smtpForm.name" class="wz-input" placeholder="My SMTP sender" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Email address</label>
            <input v-model="smtpForm.from_address" class="wz-input" placeholder="noreply@example.com" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Host</label>
            <input v-model="smtpForm.host" class="wz-input" placeholder="smtp.example.com" />
          </div>
          <div class="wz-form-group wz-form-group--sm">
            <label class="wz-label">Port</label>
            <input v-model.number="smtpForm.port" type="number" class="wz-input" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Encryption</label>
            <select v-model="smtpForm.method" class="wz-select">
              <option value="none">None</option>
              <option value="starttls">STARTTLS</option>
              <option value="ssl">SSL/TLS</option>
            </select>
          </div>
        </div>
        <button class="wz-btn wz-btn--primary" :disabled="smtpSaving || !smtpForm.name.trim()" @click="saveSmtp">
          <q-spinner v-if="smtpSaving" size="14px" color="white" class="q-mr-sm" />
          Save
        </button>
      </div>

      <!-- Table -->
      <table class="wz-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From address</th>
            <th>Host</th>
            <th>Port</th>
            <th>Encryption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.smtpSendersLoading">
            <td colspan="6" class="wz-table__loading">
              <q-spinner size="24px" color="primary" />
            </td>
          </tr>
          <tr v-else-if="store.smtpSenders.length === 0">
            <td colspan="6" class="wz-table__empty">No SMTP senders configured.</td>
          </tr>
          <tr v-for="s in store.smtpSenders" :key="s.config_id" v-else>
            <td>{{ s.name }}</td>
            <td>{{ s.from_address }}</td>
            <td>{{ s.host }}</td>
            <td>{{ s.port }}</td>
            <td>{{ s.method }}</td>
            <td>
              <button class="wz-btn-icon wz-btn-icon--danger" title="Delete" @click="store.removeSmtpSender(s.config_id)">
                <q-icon name="delete_outline" size="16px" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SES Senders -->
    <div class="wz-panel wz-mt">
      <div class="wz-panel__header">
        <h3 class="wz-panel__title">SES senders</h3>
        <button class="wz-btn wz-btn--primary" @click="showSesForm = !showSesForm">
          {{ showSesForm ? 'Cancel' : '+ Add SES sender' }}
        </button>
      </div>

      <!-- Inline create form -->
      <div v-if="showSesForm" class="wz-inline-form">
        <div class="wz-form-row">
          <div class="wz-form-group">
            <label class="wz-label">Sender name</label>
            <input v-model="sesForm.name" class="wz-input" placeholder="My SES sender" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">Email address</label>
            <input v-model="sesForm.from_address" class="wz-input" placeholder="noreply@example.com" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">AWS region</label>
            <input v-model="sesForm.aws_region" class="wz-input" placeholder="us-east-1" />
          </div>
          <div class="wz-form-group">
            <label class="wz-label">IAM Role ARN</label>
            <input v-model="sesForm.role_arn" class="wz-input" placeholder="arn:aws:iam::..." />
          </div>
        </div>
        <button class="wz-btn wz-btn--primary" :disabled="sesSaving || !sesForm.name.trim()" @click="saveSes">
          <q-spinner v-if="sesSaving" size="14px" color="white" class="q-mr-sm" />
          Save
        </button>
      </div>

      <!-- Table -->
      <table class="wz-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From address</th>
            <th>AWS Region</th>
            <th>Role ARN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.sesSendersLoading">
            <td colspan="5" class="wz-table__loading">
              <q-spinner size="24px" color="primary" />
            </td>
          </tr>
          <tr v-else-if="store.sesSenders.length === 0">
            <td colspan="5" class="wz-table__empty">No SES senders configured.</td>
          </tr>
          <tr v-for="s in store.sesSenders" :key="s.config_id" v-else>
            <td>{{ s.name }}</td>
            <td>{{ s.from_address }}</td>
            <td>{{ s.aws_region }}</td>
            <td class="wz-td-mono">{{ s.role_arn }}</td>
            <td>
              <button class="wz-btn-icon wz-btn-icon--danger" title="Delete" @click="store.removeSesSender(s.config_id)">
                <q-icon name="delete_outline" size="16px" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import type { EncryptionMethod } from "@/types/alerting";

const store = useAlertingStore();

// SMTP
const showSmtpForm = ref(false);
const smtpSaving = ref(false);
const smtpForm = reactive({
  name: "",
  from_address: "",
  host: "",
  port: 587,
  method: "starttls" as EncryptionMethod,
});

async function saveSmtp() {
  smtpSaving.value = true;
  try {
    await store.createSmtpSender({ ...smtpForm });
    showSmtpForm.value = false;
    smtpForm.name = "";
    smtpForm.from_address = "";
    smtpForm.host = "";
    smtpForm.port = 587;
    smtpForm.method = "starttls";
  } catch (e) {
    console.error("[Alerting] Failed to create SMTP sender:", e);
  } finally {
    smtpSaving.value = false;
  }
}

// SES
const showSesForm = ref(false);
const sesSaving = ref(false);
const sesForm = reactive({
  name: "",
  from_address: "",
  aws_region: "us-east-1",
  role_arn: "",
});

async function saveSes() {
  sesSaving.value = true;
  try {
    await store.createSesSender({ ...sesForm });
    showSesForm.value = false;
    sesForm.name = "";
    sesForm.from_address = "";
    sesForm.aws_region = "us-east-1";
    sesForm.role_arn = "";
  } catch (e) {
    console.error("[Alerting] Failed to create SES sender:", e);
  } finally {
    sesSaving.value = false;
  }
}
</script>

<style scoped>
.wz-mt { margin-top: 20px; }

.wz-panel {
  background: #fff;
  border: 1px solid #d3dae6;
  border-radius: 4px;
}

.wz-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.wz-panel__title {
  font-size: 18px;
  font-weight: 400;
  color: #1a1c21;
  margin: 0;
}

.wz-inline-form {
  padding: 16px 24px;
  border-bottom: 1px solid #d3dae6;
  background: #f5f7fa;
}

.wz-form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.wz-form-group { flex: 1; min-width: 140px; }
.wz-form-group--sm { flex: 0 0 80px; min-width: 80px; }

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
  background: #fff;
}

.wz-input:focus { outline: none; border-color: #006bb4; }

.wz-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fff;
  appearance: auto;
}

.wz-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.wz-table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  color: #69707d;
  font-size: 12px;
  border-bottom: 1px solid #d3dae6;
  background: #f5f7fa;
}

.wz-table td {
  padding: 8px 12px;
  color: #343741;
  border-bottom: 1px solid #eef1f5;
}

.wz-table__empty { text-align: center; padding: 32px !important; color: #69707d; }
.wz-table__loading { text-align: center; padding: 32px !important; }

.wz-td-mono {
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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

.wz-btn-icon--danger:hover { color: #bd271e; }

/* Dark mode */
.body--dark .wz-panel { background: #1d1e24; border-color: #343741; }
.body--dark .wz-panel__title { color: #dfe5ef; }
.body--dark .wz-inline-form { background: #25262b; border-color: #343741; }
.body--dark .wz-input { background: #1d1e24; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-select { background: #1d1e24; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-btn-icon { color: #98a2b3; }
</style>
