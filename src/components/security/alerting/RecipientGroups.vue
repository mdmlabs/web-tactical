<template>
  <div class="wz-recipient-groups">
    <div class="wz-panel">
      <div class="wz-panel__header">
        <h3 class="wz-panel__title">Email recipient groups</h3>
        <button class="wz-btn wz-btn--primary" @click="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ Create recipient group' }}
        </button>
      </div>

      <!-- Inline create form -->
      <div v-if="showForm" class="wz-inline-form">
        <div class="wz-form-group">
          <label class="wz-label">Group name</label>
          <input v-model="form.name" class="wz-input" placeholder="e.g. Engineering Team" />
        </div>
        <div class="wz-form-group">
          <label class="wz-label">Description (optional)</label>
          <input v-model="form.description" class="wz-input" placeholder="Group description" />
        </div>
        <div class="wz-form-group">
          <label class="wz-label">Email addresses (comma-separated)</label>
          <textarea v-model="form.emails" class="wz-textarea" rows="3" placeholder="user1@example.com, user2@example.com" />
        </div>
        <button class="wz-btn wz-btn--primary" :disabled="saving || !form.name.trim()" @click="saveGroup">
          <q-spinner v-if="saving" size="14px" color="white" class="q-mr-sm" />
          Create group
        </button>
      </div>

      <!-- Table -->
      <table class="wz-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Email addresses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.recipientGroupsLoading">
            <td colspan="4" class="wz-table__loading">
              <q-spinner size="24px" color="primary" />
            </td>
          </tr>
          <tr v-else-if="store.recipientGroups.length === 0">
            <td colspan="4" class="wz-table__empty">No recipient groups configured.</td>
          </tr>
          <tr v-for="g in store.recipientGroups" :key="g.config_id" v-else>
            <td>{{ g.name }}</td>
            <td>{{ g.description || '-' }}</td>
            <td>{{ formatEmails(g) }}</td>
            <td>
              <button class="wz-btn-icon wz-btn-icon--danger" title="Delete" @click="store.removeRecipientGroup(g.config_id)">
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
import type { RecipientGroup } from "@/types/alerting";

const store = useAlertingStore();
const showForm = ref(false);
const saving = ref(false);

const form = reactive({
  name: "",
  description: "",
  emails: "",
});

function formatEmails(group: RecipientGroup): string {
  if (!group.email_group?.recipient) return "-";
  return group.email_group.recipient.map((r) => r.recipient).join(", ") || "-";
}

async function saveGroup() {
  saving.value = true;
  try {
    const recipients = form.emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)
      .map((e) => ({ recipient: e }));

    await store.createRecipientGroup({
      name: form.name,
      description: form.description,
      email_group: { recipient: recipients },
    });
    showForm.value = false;
    form.name = "";
    form.description = "";
    form.emails = "";
  } catch (e) {
    console.error("[Alerting] Failed to create recipient group:", e);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
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

.wz-form-group { margin-bottom: 12px; }

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

.wz-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fff;
  resize: vertical;
}

.wz-textarea:focus { outline: none; border-color: #006bb4; }

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
.body--dark .wz-textarea { background: #1d1e24; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-btn-icon { color: #98a2b3; }
</style>
