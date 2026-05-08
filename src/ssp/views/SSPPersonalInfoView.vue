<template>
  <q-page class="q-pa-md" style="max-width: 800px; margin: 0 auto">
    <div class="text-h6 q-mb-lg">{{ $t('ssp.views.SSPPersonalInfoView.9ba8d3') }}</div>

    <!-- Profile Card (#553) -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center q-gutter-md q-mb-md">
          <q-avatar size="80px" color="primary" text-color="white" class="text-h4">
            {{ initials }}
          </q-avatar>
          <div>
            <div class="text-h6">{{ profile.full_name || auth.displayName }}</div>
            <div class="text-caption text-grey">{{ profile.department }} · {{ profile.role }}</div>
            <q-chip dense :color="profile.active ? 'positive' : 'negative'" text-color="white" size="sm">
              {{ profile.active ? "Active" : "Inactive" }}
            </q-chip>
          </div>
          <q-space />
          <q-btn v-if="!editing" flat color="primary" icon="edit" :label="$t('ssp.views.SSPPersonalInfoView.cd280a')" @click="editing = true" />
          <div v-else class="row q-gutter-sm">
            <q-btn color="primary" :label="$t('ssp.views.SSPPersonalInfoView.efc007')" :loading="saving" @click="saveProfile" />
            <q-btn flat :label="$t('ssp.views.SSPPersonalInfoView.77dfd2')" @click="cancelEdit" />
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <div class="row q-gutter-md">
          <div class="col-12 col-md-5">
            <q-input v-model="profile.full_name" :label="$t('ssp.views.SSPPersonalInfoView.64346b')" outlined dense :readonly="!editing" />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="profile.email" :label="$t('ssp.views.SSPPersonalInfoView.84add5')" outlined dense :readonly="!editing" type="email" />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="profile.phone" :label="$t('ssp.views.SSPPersonalInfoView.77064d')" outlined dense :readonly="!editing" />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="profile.department" :label="$t('ssp.views.SSPPersonalInfoView.db4010')" outlined dense :readonly="!editing" />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="profile.location" :label="$t('ssp.views.SSPPersonalInfoView.47a09a')" outlined dense :readonly="!editing" />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="profile.manager" :label="$t('ssp.views.SSPPersonalInfoView.babe30')" outlined dense readonly />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Applied Policies Search (#554) -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          <q-icon name="policy" class="q-mr-xs" />
          {{ $t('ssp.views.SSPPersonalInfoView.71746a') }}
        </div>
        <q-input v-model="policySearch" dense outlined :placeholder="$t('ssp.views.SSPPersonalInfoView.96f04a')" clearable class="q-mb-sm">
          <template v-slot:prepend><q-icon name="search" /></template>
        </q-input>
        <q-list bordered separator>
          <q-item v-for="pol in filteredPolicies" :key="pol.id" dense>
            <q-item-section avatar>
              <q-icon :name="pol.icon" :color="pol.color" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ pol.name }}</q-item-label>
              <q-item-label caption>{{ pol.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip dense :color="pol.enforced ? 'primary' : 'grey'" text-color="white" size="sm">
                {{ pol.enforced ? "Enforced" : "Advisory" }}
              </q-chip>
            </q-item-section>
          </q-item>
          <q-item v-if="!filteredPolicies.length">
            <q-item-section class="text-grey text-center">{{ $t('ssp.views.SSPPersonalInfoView.c47492') }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";

const $q = useQuasar();
const auth = useAuthStore();

const editing = ref(false);
const saving = ref(false);
const policySearch = ref("");

const profile = ref({
  full_name: auth.displayName || "Current User",
  email: "user@company.com",
  phone: "",
  department: "IT Department",
  location: "Main Office",
  manager: "IT Manager",
  role: "Standard User",
  active: true,
});
const profileBackup = ref({ ...profile.value });

const initials = computed(() => {
  const name = profile.value.full_name || "";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
});

const policies = ref<any[]>([]);

const filteredPolicies = computed(() =>
  policies.value.filter((p) =>
    !policySearch.value || p.name.toLowerCase().includes(policySearch.value.toLowerCase()) || p.description.toLowerCase().includes(policySearch.value.toLowerCase())
  )
);

async function saveProfile() {
  saving.value = true;
  try {
    const r = await axios.patch("/appmanagement/ssp/me/", profile.value);
    applyProfileResponse(r.data);
    $q.notify({ type: "positive", message: "Profile updated successfully" });
    profileBackup.value = { ...profile.value };
    editing.value = false;
  } catch {
    $q.notify({ type: "negative", message: "Failed to update profile" });
  } finally { saving.value = false; }
}

function cancelEdit() {
  profile.value = { ...profileBackup.value };
  editing.value = false;
}

function applyProfileResponse(data: any) {
  Object.assign(profile.value, data?.profile || {});
  policies.value = data?.applied_policies || [];
  profileBackup.value = { ...profile.value };
}

onMounted(async () => {
  try {
    const r = await axios.get("/appmanagement/ssp/me/");
    applyProfileResponse(r.data);
  } catch { /* use defaults */ }
});
</script>
