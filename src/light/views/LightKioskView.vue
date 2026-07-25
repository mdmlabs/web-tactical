<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Browser kiosk</div>
    <div class="text-caption text-grey-7 q-mb-md">
      Configure and deploy the browser-only kiosk policy included in Laborato MDM Light.
    </div>
    <KioskModePolicyPanel />
  </q-page>
</template>

<script setup lang="ts">
import KioskModePolicyPanel from "@/winadvanced/components/KioskModePolicyPanel.vue";
</script>
