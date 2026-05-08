<template>
  <div>
    <div class="text-h6 q-mb-md">System Administration & Configuration</div>

    <div class="row q-col-gutter-md">
      <!-- Self-service toggle -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="q-mr-md">
              <div class="text-subtitle1 text-weight-bold">Self-Service Module</div>
              <div class="text-caption text-grey">Enable or disable the self-service portal for users</div>
            </div>
            <q-space />
            <q-toggle v-model="store.selfServiceEnabled" color="primary" size="lg" @update:model-value="onToggle" />
          </q-card-section>
        </q-card>
      </div>

      <!-- DB Connection -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Database Connection</div>
            <q-input v-model="dbForm.host" label="Host" outlined dense class="q-mb-sm" />
            <q-input v-model.number="dbForm.port" label="Port" outlined dense class="q-mb-sm" type="number" />
            <q-input v-model="dbForm.database" label="Database Name" outlined dense class="q-mb-sm" />
            <q-input v-model="dbForm.username" label="Username" outlined dense class="q-mb-sm" />
            <q-input v-model="dbForm.password" label="Password" outlined dense class="q-mb-md" type="password" />
            <q-btn color="primary" label="Save Connection" icon="save" @click="saveDbConfig" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Config Profiles -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-weight-bold">Configuration Profiles</div>
              <q-btn color="primary" icon="add" dense label="Add" @click="showAddProfile = true" />
            </div>

            <q-list separator bordered>
              <q-item v-for="profile in store.configProfiles" :key="profile.id">
                <q-item-section avatar>
                  <q-icon :name="profile.active ? 'radio_button_checked' : 'radio_button_unchecked'" :color="profile.active ? 'positive' : 'grey'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ profile.name }}</q-item-label>
                  <q-item-label caption>{{ profile.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-xs">
                    <q-btn flat dense icon="edit" size="sm" @click="editProfile(profile)" />
                    <q-btn flat dense icon="delete" size="sm" color="negative" @click="deleteProfile(profile.id)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add/Edit Profile Dialog -->
    <q-dialog v-model="showAddProfile" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingProfile ? 'Edit Profile' : 'Add Profile' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="profileForm.name" label="Profile Name" outlined dense class="q-mb-sm" />
          <q-input v-model="profileForm.description" label="Description" outlined dense class="q-mb-sm" />
          <q-toggle v-model="profileForm.active" label="Active" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeProfileDialog" />
          <q-btn color="primary" :label="editingProfile ? 'Save' : 'Add'" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore, type SspConfigProfile } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const dbForm = reactive({ ...store.dbConfig });
const showAddProfile = ref(false);
const editingProfile = ref<SspConfigProfile | null>(null);
const profileForm = reactive({ name: "", description: "", active: false });

function onToggle(val: boolean) {
  $q.notify({ type: "positive", message: `Self-Service module ${val ? "enabled" : "disabled"}` });
}

function saveDbConfig() {
  store.dbConfig.host = dbForm.host;
  store.dbConfig.port = dbForm.port;
  store.dbConfig.database = dbForm.database;
  store.dbConfig.username = dbForm.username;
  store.dbConfig.password = dbForm.password;
  $q.notify({ type: "positive", message: "Database connection saved successfully" });
}

function editProfile(profile: SspConfigProfile) {
  editingProfile.value = profile;
  profileForm.name = profile.name;
  profileForm.description = profile.description;
  profileForm.active = profile.active;
  showAddProfile.value = true;
}

function closeProfileDialog() {
  showAddProfile.value = false;
  editingProfile.value = null;
  profileForm.name = "";
  profileForm.description = "";
  profileForm.active = false;
}

function saveProfile() {
  if (!profileForm.name) {
    $q.notify({ type: "negative", message: "Profile name is required" });
    return;
  }
  if (editingProfile.value) {
    store.updateConfigProfile(editingProfile.value.id, {
      name: profileForm.name,
      description: profileForm.description,
      active: profileForm.active,
    });
    $q.notify({ type: "positive", message: "Profile updated" });
  } else {
    store.addConfigProfile({
      name: profileForm.name,
      description: profileForm.description,
      active: profileForm.active,
    });
    $q.notify({ type: "positive", message: "Profile added" });
  }
  closeProfileDialog();
}

function deleteProfile(id: string) {
  $q.dialog({
    title: "Delete Profile",
    message: "Are you sure you want to delete this configuration profile?",
    cancel: true,
  }).onOk(() => {
    store.removeConfigProfile(id);
    $q.notify({ type: "positive", message: "Profile deleted" });
  });
}
</script>
