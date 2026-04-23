<template>
  <div class="wz-channels">
    <div class="wz-panel">
      <!-- Header -->
      <div class="wz-panel__header">
        <h3 class="wz-panel__title">Channels</h3>
        <button class="wz-btn wz-btn--primary" @click="showCreate = true">+ Create channel</button>
      </div>

      <!-- Search -->
      <div class="wz-filter-bar">
        <div class="wz-search-wrap">
          <q-icon name="search" size="18px" class="wz-search-icon" />
          <input v-model="search" class="wz-search-input" placeholder="Search" />
        </div>
      </div>

      <!-- Table -->
      <table class="wz-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Last updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.channelsLoading">
            <td colspan="5" class="wz-table__loading">
              <q-spinner size="24px" color="primary" />
            </td>
          </tr>
          <tr v-else-if="filtered.length === 0">
            <td colspan="5" class="wz-table__empty">
              <p>No channels found. Create a channel to configure notifications.</p>
              <button class="wz-btn wz-btn--primary" @click="showCreate = true">Create channel</button>
            </td>
          </tr>
          <tr v-for="ch in filtered" :key="ch.config_id" v-else>
            <td>{{ ch.name }}</td>
            <td>
              <span class="wz-type-badge">{{ ch.config_type }}</span>
            </td>
            <td>{{ ch.description || '-' }}</td>
            <td>{{ formatDate(ch.last_updated_time_ms) }}</td>
            <td>
              <button class="wz-btn-icon" title="Send test message" @click="store.sendTestMessage(ch.config_id)">
                <q-icon name="send" size="16px" />
              </button>
              <button class="wz-btn-icon wz-btn-icon--danger" title="Delete" @click="store.removeChannel(ch.config_id)">
                <q-icon name="delete_outline" size="16px" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create modal -->
    <CreateChannelModal v-if="showCreate" @close="showCreate = false" @created="onCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import CreateChannelModal from "./CreateChannelModal.vue";

const store = useAlertingStore();
const search = ref("");
const showCreate = ref(false);

const filtered = computed(() => {
  if (!search.value.trim()) return store.channels;
  const q = search.value.toLowerCase().trim();
  return store.channels.filter((c) =>
    c.name.toLowerCase().includes(q) || c.config_type.toLowerCase().includes(q)
  );
});

function formatDate(ms?: number): string {
  if (!ms) return "-";
  try { return new Date(ms).toLocaleString(); } catch { return "-"; }
}

function onCreated() {
  showCreate.value = false;
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

.wz-filter-bar { padding: 0 24px 12px; }

.wz-search-wrap { position: relative; }

.wz-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #69707d;
}

.wz-search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  font-size: 14px;
  color: #343741;
  background: #fbfcfd;
}

.wz-search-input:focus { outline: none; border-color: #006bb4; }

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

.wz-table__empty {
  text-align: center;
  padding: 40px 24px !important;
  color: #69707d;
}

.wz-table__empty p {
  margin-bottom: 16px;
  font-size: 14px;
}

.wz-table__loading { text-align: center; padding: 40px !important; }

.wz-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  background: #e6f2fb;
  color: #006bb4;
  text-transform: capitalize;
}

.wz-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.wz-btn--primary {
  background: #006bb4;
  color: #fff;
  border: 1px solid #006bb4;
}

.wz-btn--primary:hover { background: #005a9e; }

.wz-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #69707d;
}

.wz-btn-icon:hover { color: #343741; }
.wz-btn-icon--danger:hover { color: #bd271e; }

/* Dark mode */
.body--dark .wz-panel { background: #1d1e24; border-color: #343741; }
.body--dark .wz-panel__title { color: #dfe5ef; }
.body--dark .wz-search-input { background: #25262b; border-color: #343741; color: #dfe5ef; }
.body--dark .wz-table th { background: #25262b; color: #98a2b3; border-color: #343741; }
.body--dark .wz-table td { color: #dfe5ef; border-color: #2a2b32; }
.body--dark .wz-type-badge { background: #0a2d4d; color: #36a2ef; }
.body--dark .wz-btn-icon { color: #98a2b3; }
</style>
