<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Rights Management</div>
      <q-btn color="primary" icon="add" label="Add Right" @click="showAddDialog = true" />
    </div>

    <!-- Privacy Mode Toggle -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center">
        <q-toggle v-model="showPrivacyConcerns" label="Show Privacy Concerns" color="warning" />
        <q-space />
        <q-btn flat icon="contact_support" label="Support Contact" color="primary" @click="showSupportInfo = true" />
      </q-card-section>
    </q-card>

    <q-table
      flat
      bordered
      :rows="store.rights"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-accessLevel="props">
        <q-td :props="props">
          <q-badge :color="getLevelColor(props.row.accessLevel)">
            {{ props.row.accessLevel }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-privacyConcern="props">
        <q-td :props="props">
          <template v-if="showPrivacyConcerns">
            <q-icon
              v-if="props.row.privacyConcern"
              name="warning"
              color="warning"
              size="sm"
            >
              <q-tooltip>This right may give admin access to your device data</q-tooltip>
            </q-icon>
            <q-icon v-else name="check_circle" color="positive" size="sm">
              <q-tooltip>No privacy concerns</q-tooltip>
            </q-icon>
          </template>
          <span v-else class="text-grey">--</span>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" color="primary" size="sm" @click="editRight(props.row)">
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingRight ? 'Edit Right' : 'Add New Right' }}</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="form.system"
            :options="store.availableRights"
            label="System"
            outlined
            dense
            class="q-mb-sm"
            :disable="!!editingRight"
          />
          <q-select
            v-model="form.accessLevel"
            :options="accessLevels"
            label="Access Level"
            outlined
            dense
            emit-value
            map-options
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeDialog" />
          <q-btn color="primary" :label="editingRight ? 'Save' : 'Add'" @click="saveRight" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Support Contact Dialog -->
    <q-dialog v-model="showSupportInfo">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Support Contact</div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section avatar><q-icon name="email" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>support@company.com</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="phone" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Phone</q-item-label>
                <q-item-label caption>+1 (555) 000-1234</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="schedule" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Hours</q-item-label>
                <q-item-label caption>Mon-Fri, 9:00 AM - 6:00 PM</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="text-caption text-grey q-mt-sm">
            For rights and device access issues, please include your user ID and device serial number when contacting support.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore, type SspRight } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const showAddDialog = ref(false);
const showSupportInfo = ref(false);
const showPrivacyConcerns = ref(false);
const editingRight = ref<SspRight | null>(null);

const form = reactive({
  system: "",
  accessLevel: "read" as SspRight["accessLevel"],
  privacyConcern: false,
});

const accessLevels = [
  { label: "Read", value: "read" },
  { label: "Write", value: "write" },
  { label: "Admin", value: "admin" },
];

const columns = [
  { name: "system", label: "System", field: "system", align: "left" as const, sortable: true },
  { name: "accessLevel", label: "Access Level", field: "accessLevel", align: "center" as const, sortable: true },
  { name: "grantedAt", label: "Granted", field: "grantedAt", align: "left" as const, sortable: true },
  { name: "privacyConcern", label: "Privacy", field: "privacyConcern", align: "center" as const },
  { name: "actions", label: "Actions", field: "actions", align: "center" as const },
];

function getLevelColor(level: string) {
  return level === "admin" ? "negative" : level === "write" ? "warning" : "primary";
}

function editRight(right: SspRight) {
  editingRight.value = right;
  form.system = right.system;
  form.accessLevel = right.accessLevel;
  form.privacyConcern = right.privacyConcern;
  showAddDialog.value = true;
}

function closeDialog() {
  showAddDialog.value = false;
  editingRight.value = null;
  form.system = "";
  form.accessLevel = "read";
  form.privacyConcern = false;
}

function saveRight() {
  if (!form.system) {
    $q.notify({ type: "negative", message: "Please select a system" });
    return;
  }
  if (editingRight.value) {
    store.updateRight(editingRight.value.id, {
      accessLevel: form.accessLevel,
    });
    $q.notify({ type: "positive", message: "Right updated successfully" });
  } else {
    store.addRight({
      system: form.system,
      accessLevel: form.accessLevel,
      privacyConcern: form.accessLevel === "admin",
    });
    $q.notify({ type: "positive", message: "Right added successfully" });
  }
  closeDialog();
}
</script>
