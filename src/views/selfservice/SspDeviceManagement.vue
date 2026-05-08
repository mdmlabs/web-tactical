<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Device Management</div>
      <q-btn color="primary" icon="add" label="Add Device" @click="showAddDialog = true" />
    </div>

    <q-table
      flat
      bordered
      :rows="store.devices"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'active' ? 'positive' : 'grey'">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <q-icon :name="getTypeIcon(props.row.type)" size="sm" class="q-mr-xs" />
          {{ props.row.type }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" color="primary" size="sm" @click="editDevice(props.row)">
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
          <q-btn flat dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingDevice ? 'Edit Device' : 'Add New Device' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.name" label="Device Name" outlined dense class="q-mb-sm" :rules="[val => !!val || 'Required']" />
          <q-select v-model="form.type" :options="deviceTypes" label="Device Type" outlined dense class="q-mb-sm" emit-value map-options />
          <q-input v-model="form.serialNumber" label="Serial Number" outlined dense :rules="[val => !!val || 'Required']" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeDialog" />
          <q-btn color="primary" :label="editingDevice ? 'Save' : 'Add'" @click="saveDevice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore, type SspDevice } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const showAddDialog = ref(false);
const editingDevice = ref<SspDevice | null>(null);

const form = reactive({
  name: "",
  type: "laptop" as SspDevice["type"],
  serialNumber: "",
});

const deviceTypes = [
  { label: "Laptop", value: "laptop" },
  { label: "Desktop", value: "desktop" },
  { label: "Mobile", value: "mobile" },
  { label: "Tablet", value: "tablet" },
];

const columns = [
  { name: "name", label: "Device Name", field: "name", align: "left" as const, sortable: true },
  { name: "type", label: "Type", field: "type", align: "left" as const, sortable: true },
  { name: "serialNumber", label: "Serial Number", field: "serialNumber", align: "left" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "addedAt", label: "Added", field: "addedAt", align: "left" as const, sortable: true },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];

function getTypeIcon(type: string) {
  const map: Record<string, string> = { laptop: "laptop", desktop: "desktop_windows", mobile: "smartphone", tablet: "tablet" };
  return map[type] || "devices";
}

function editDevice(device: SspDevice) {
  editingDevice.value = device;
  form.name = device.name;
  form.type = device.type;
  form.serialNumber = device.serialNumber;
  showAddDialog.value = true;
}

function closeDialog() {
  showAddDialog.value = false;
  editingDevice.value = null;
  form.name = "";
  form.type = "laptop";
  form.serialNumber = "";
}

function saveDevice() {
  if (!form.name || !form.serialNumber) {
    $q.notify({ type: "negative", message: "Please fill all required fields" });
    return;
  }
  if (editingDevice.value) {
    store.updateDevice(editingDevice.value.id, {
      name: form.name,
      type: form.type,
      serialNumber: form.serialNumber,
    });
    $q.notify({ type: "positive", message: "Device updated successfully" });
  } else {
    store.addDevice({ name: form.name, type: form.type, serialNumber: form.serialNumber });
    $q.notify({ type: "positive", message: "Device added successfully" });
  }
  closeDialog();
}

function confirmDelete(device: SspDevice) {
  $q.dialog({
    title: "Delete Device",
    message: `Are you sure you want to delete "${device.name}"? All associated installations will also be removed.`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    store.removeDevice(device.id);
    $q.notify({ type: "positive", message: "Device deleted successfully" });
  });
}
</script>
