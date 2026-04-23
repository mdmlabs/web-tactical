<template>
  <div>
    <div class="text-h6 q-mb-md">Approval Queue</div>

    <q-tabs v-model="tab" dense class="q-mb-md" active-color="primary" indicator-color="primary" align="left">
      <q-tab name="pending" label="Pending" :badge="store.pendingApprovals.length > 0 ? store.pendingApprovals.length : undefined" />
      <q-tab name="history" label="History" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="pending">
        <div v-if="store.pendingApprovals.length === 0" class="text-center text-grey q-pa-xl">
          <q-icon name="check_circle" size="64px" color="positive" />
          <div class="text-h6 q-mt-md">No pending requests</div>
        </div>
        <q-list v-else separator bordered>
          <q-item v-for="req in store.pendingApprovals" :key="req.id" class="q-py-md">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ req.userName }}</q-item-label>
              <q-item-label caption>
                Requests <strong>{{ req.appName }}</strong> for <strong>{{ req.deviceName }}</strong>
              </q-item-label>
              <q-item-label caption class="q-mt-xs">
                <q-icon name="schedule" size="xs" /> {{ req.requestedAt }}
                <span class="q-ml-sm">{{ req.reason }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row q-gutter-sm">
                <q-btn color="positive" icon="check" label="Approve" dense @click="approve(req.id)" />
                <q-btn color="negative" icon="close" label="Reject" dense outline @click="reject(req.id)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="history">
        <q-table
          flat
          bordered
          :rows="historyItems"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'approved' ? 'positive' : 'negative'">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();
const tab = ref("pending");

const historyItems = computed(() =>
  store.approvalQueue.filter((r) => r.status !== "pending"),
);

const columns = [
  { name: "userName", label: "User", field: "userName", align: "left" as const, sortable: true },
  { name: "appName", label: "Application", field: "appName", align: "left" as const, sortable: true },
  { name: "deviceName", label: "Device", field: "deviceName", align: "left" as const },
  { name: "requestedAt", label: "Requested", field: "requestedAt", align: "left" as const, sortable: true },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "reason", label: "Reason", field: "reason", align: "left" as const },
];

function approve(id: string) {
  store.approveRequest(id);
  $q.notify({ type: "positive", message: "Request approved. Auto-installation initiated." });
}

function reject(id: string) {
  $q.dialog({
    title: "Reject Request",
    message: "Are you sure you want to reject this installation request?",
    cancel: true,
  }).onOk(() => {
    store.rejectRequest(id);
    $q.notify({ type: "warning", message: "Request rejected" });
  });
}
</script>
