<template>
  <q-btn-dropdown
    flat
    no-caps
    icon="picture_as_pdf"
    label="Generate Report"
    class="gen-report-btn"
    split
    @click="onGenerate"
  >
    <q-list>
      <q-item clickable v-close-popup @click="onGenerate">
        <q-item-section avatar>
          <q-icon name="note_add" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Create report…</q-item-label>
          <q-item-label caption>
            Uses the current page (agent / group / module)
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="onViewReports">
        <q-item-section avatar>
          <q-icon name="folder_open" />
        </q-item-section>
        <q-item-section>
          <q-item-label>My reports</q-item-label>
          <q-item-label caption>Browse, download, delete</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import GenerateReportDialog from "@/views/security/reporting/GenerateReportDialog.vue";

const $q = useQuasar();
const router = useRouter();

function onGenerate() {
  $q.dialog({ component: GenerateReportDialog });
}

function onViewReports() {
  router.push({ name: "SecurityReports" });
}
</script>

<style scoped>
.gen-report-btn {
  color: var(--mdm-text-primary, #1a1a1a);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: var(--mdm-radius, 6px);
}

.body--dark .gen-report-btn {
  color: var(--mdm-text-primary, #e8ecf4);
  border-color: var(--mdm-border, #1e293b);
}
</style>
