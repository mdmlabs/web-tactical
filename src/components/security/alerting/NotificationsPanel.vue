<template>
  <div class="wz-notifications-page">
    <div class="wz-notifications-layout">
      <!-- Sidebar -->
      <nav class="wz-notif-sidebar">
        <button
          v-for="item in sidebarItems"
          :key="item.value"
          class="wz-notif-sidebar__item"
          :class="{ 'wz-notif-sidebar__item--active': activeSection === item.value }"
          @click="activeSection = item.value"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Content -->
      <div class="wz-notif-content">
        <ChannelsList v-if="activeSection === 'channels'" />
        <EmailSenders v-else-if="activeSection === 'email'" />
        <RecipientGroups v-else-if="activeSection === 'recipients'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAlertingStore } from "@/stores/alerting";
import ChannelsList from "./ChannelsList.vue";
import EmailSenders from "./EmailSenders.vue";
import RecipientGroups from "./RecipientGroups.vue";

const store = useAlertingStore();
const activeSection = ref<"channels" | "email" | "recipients">("channels");

const sidebarItems = [
  { label: "Channels", value: "channels" as const },
  { label: "Email senders", value: "email" as const },
  { label: "Email recipient groups", value: "recipients" as const },
];

onMounted(() => {
  store.loadChannels();
  store.loadSmtpSenders();
  store.loadSesSenders();
  store.loadRecipientGroups();
});
</script>

<style scoped>
.wz-notifications-page { padding: 24px; }

.wz-notifications-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.wz-notif-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #d3dae6;
  border-radius: 4px;
  overflow: hidden;
}

.wz-notif-sidebar__item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  cursor: pointer;
  color: #343741;
  transition: background 0.12s, color 0.12s;
}

.wz-notif-sidebar__item:hover { background: #f5f7fa; }

.wz-notif-sidebar__item--active {
  color: #006bb4;
  font-weight: 600;
  background: #e6f2fb;
  border-left-color: #006bb4;
}

.wz-notif-content { flex: 1; min-width: 0; }

/* Dark mode */
.body--dark .wz-notif-sidebar { background: #1d1e24; border-color: #343741; }
.body--dark .wz-notif-sidebar__item { color: #dfe5ef; }
.body--dark .wz-notif-sidebar__item:hover { background: #25262b; }
.body--dark .wz-notif-sidebar__item--active { color: #36a2ef; background: #0a2d4d; border-left-color: #36a2ef; }
</style>
