<template>
  <q-drawer
    v-model="drawerOpen"
    :width="272"
    :breakpoint="1024"
    bordered
    show-if-above
    class="light-sidebar"
  >
    <div class="q-pa-md light-sidebar__brand">
      <div class="text-subtitle1 text-weight-bold">{{ productName }}</div>
      <div class="text-caption">Windows device management</div>
    </div>
    <q-separator />

    <q-list padding>
      <q-item clickable v-ripple to="/" exact>
        <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
        <q-item-section>Dashboard</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/light/devices">
        <q-item-section avatar><q-icon name="devices" /></q-item-section>
        <q-item-section>Device control</q-item-section>
      </q-item>
      <q-item clickable v-ripple :to="{ path: '/settings', query: { tab: 'agents' } }">
        <q-item-section avatar><q-icon name="download_for_offline" /></q-item-section>
        <q-item-section>Agent installation and removal</q-item-section>
      </q-item>

      <q-item-label header>Policies</q-item-label>
      <q-item clickable v-ripple to="/security-center/peripheral-controls">
        <q-item-section avatar><q-icon name="devices_other" /></q-item-section>
        <q-item-section>Camera, microphone, Bluetooth</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/security-center/usb">
        <q-item-section avatar><q-icon name="usb" /></q-item-section>
        <q-item-section>USB control</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/compliance-center">
        <q-item-section avatar><q-icon name="fact_check" /></q-item-section>
        <q-item-section>Compliance</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/light/kiosk">
        <q-item-section avatar><q-icon name="web_asset" /></q-item-section>
        <q-item-section>Browser kiosk</q-item-section>
      </q-item>

      <q-item-label header>Applications and data</q-item-label>
      <q-item clickable v-ripple :to="{ path: '/app-management', query: { tab: 'apps' } }">
        <q-item-section avatar><q-icon name="apps" /></q-item-section>
        <q-item-section>Applications</q-item-section>
      </q-item>
      <q-item clickable v-ripple :to="{ path: '/app-management', query: { tab: 'distribution' } }">
        <q-item-section avatar><q-icon name="system_update_alt" /></q-item-section>
        <q-item-section>Installation and removal</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/light/container">
        <q-item-section avatar><q-icon name="enhanced_encryption" /></q-item-section>
        <q-item-section>Secure Container</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/security-center/dlp">
        <q-item-section avatar><q-icon name="shield" /></q-item-section>
        <q-item-section>Data loss prevention</q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item clickable v-ripple :to="{ path: '/settings', query: { tab: 'users' } }">
        <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
        <q-item-section>Administration</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { storeToRefs } from "pinia";

import { useProductEditionStore } from "@/stores/productEdition";

const store = useStore();
const { productName } = storeToRefs(useProductEditionStore());

const drawerOpen = computed({
  get: () => Boolean(store.state.fileBarDrawerOpen),
  set: (value: boolean) => store.commit("SET_FILEBAR_DRAWER", value),
});
</script>

<style scoped>
.light-sidebar {
  background: #f8fbfd;
}

.light-sidebar__brand {
  color: #0b5277;
}
</style>
