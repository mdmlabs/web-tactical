<template>
  <div>
    <div class="text-h6 q-mb-md">Identity & Parameter Management</div>

    <!-- Organization selector -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Organization</div>
        <q-select
          v-model="store.selectedOrganization"
          :options="store.organizations"
          label="Select Organization"
          outlined
          dense
          style="max-width: 400px"
        />
      </q-card-section>
    </q-card>

    <!-- Portal Parameters -->
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bold">Portal Parameters</div>
          <q-btn color="primary" icon="add" label="Add Parameter" dense @click="showAddDialog = true" />
        </div>

        <q-table
          flat
          bordered
          :rows="store.orgParams"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-value="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.value"
                dense
                borderless
                class="inline-edit"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense icon="save" color="primary" size="sm" @click="saveParam(props.row)">
                <q-tooltip>Save</q-tooltip>
              </q-btn>
              <q-btn flat dense icon="delete" color="negative" size="sm" @click="deleteParam(props.row.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add Parameter Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Parameter</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newParam.key" label="Parameter Key" outlined dense class="q-mb-sm" />
          <q-input v-model="newParam.value" label="Parameter Value" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showAddDialog = false" />
          <q-btn color="primary" label="Add" @click="addParam" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const showAddDialog = ref(false);
const newParam = reactive({ key: "", value: "" });

const columns = [
  { name: "key", label: "Parameter Key", field: "key", align: "left" as const, sortable: true },
  { name: "value", label: "Value", field: "value", align: "left" as const },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];

function saveParam(param: { id: string; key: string; value: string }) {
  store.updateOrgParam(param.id, param.key, param.value);
  $q.notify({ type: "positive", message: "Parameter saved" });
}

function deleteParam(id: string) {
  store.removeOrgParam(id);
  $q.notify({ type: "positive", message: "Parameter deleted" });
}

function addParam() {
  if (!newParam.key) {
    $q.notify({ type: "negative", message: "Parameter key is required" });
    return;
  }
  store.addOrgParam(newParam.key, newParam.value);
  newParam.key = "";
  newParam.value = "";
  showAddDialog.value = false;
  $q.notify({ type: "positive", message: "Parameter saved" });
}
</script>

<style scoped>
.inline-edit {
  min-width: 150px;
}
</style>
