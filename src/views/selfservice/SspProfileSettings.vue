<template>
  <div>
    <div class="text-h6 q-mb-md">Profile & Password Management</div>

    <div class="row q-col-gutter-md">
      <!-- Personal Information -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Personal Information</div>
            <q-input v-model="profileForm.name" label="Full Name" outlined dense class="q-mb-sm" />
            <q-input v-model="profileForm.email" label="Email" outlined dense class="q-mb-sm" type="email" />
            <q-input v-model="profileForm.phone" label="Phone" outlined dense class="q-mb-sm" />
            <q-input v-model="profileForm.position" label="Position" outlined dense class="q-mb-md" />
            <q-btn color="primary" label="Save Changes" icon="save" @click="saveProfile" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Password Management -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Change Password</div>
            <q-input
              v-model="passwordForm.oldPassword"
              label="Current Password"
              outlined
              dense
              class="q-mb-sm"
              :type="showOld ? 'text' : 'password'"
            >
              <template v-slot:append>
                <q-icon :name="showOld ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showOld = !showOld" />
              </template>
            </q-input>
            <q-input
              v-model="passwordForm.newPassword"
              label="New Password"
              outlined
              dense
              class="q-mb-sm"
              :type="showNew ? 'text' : 'password'"
              :rules="[val => val.length >= 8 || 'Minimum 8 characters']"
            >
              <template v-slot:append>
                <q-icon :name="showNew ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showNew = !showNew" />
              </template>
            </q-input>
            <q-input
              v-model="passwordForm.confirmPassword"
              label="Confirm Password"
              outlined
              dense
              class="q-mb-md"
              :type="showConfirm ? 'text' : 'password'"
              :rules="[val => val === passwordForm.newPassword || 'Passwords do not match']"
            >
              <template v-slot:append>
                <q-icon :name="showConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showConfirm = !showConfirm" />
              </template>
            </q-input>
            <q-btn color="primary" label="Change Password" icon="lock" @click="changePassword" />
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Reset Password</div>
            <div class="text-body2 text-grey q-mb-md">
              Forgot your password? Click below to receive a password reset link at your registered email address.
            </div>
            <q-btn color="warning" text-color="dark" label="Send Reset Link" icon="mail" @click="resetPassword" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useSelfServiceStore } from "@/stores/selfService";

const $q = useQuasar();
const store = useSelfServiceStore();

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const profileForm = reactive({
  name: store.currentUser.name,
  email: store.currentUser.email,
  phone: store.currentUser.phone,
  position: store.currentUser.position,
});

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

function saveProfile() {
  store.currentUser.name = profileForm.name;
  store.currentUser.email = profileForm.email;
  store.currentUser.phone = profileForm.phone;
  store.currentUser.position = profileForm.position;
  $q.notify({ type: "positive", message: "Personal information updated successfully" });
}

function changePassword() {
  if (!passwordForm.oldPassword) {
    $q.notify({ type: "negative", message: "Please enter your current password" });
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    $q.notify({ type: "negative", message: "New password must be at least 8 characters" });
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    $q.notify({ type: "negative", message: "Passwords do not match" });
    return;
  }
  // Mock: simulate password change
  passwordForm.oldPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  $q.notify({ type: "positive", message: "Password changed successfully" });
}

function resetPassword() {
  $q.dialog({
    title: "Reset Password",
    message: `A password reset link will be sent to ${store.currentUser.email}. Continue?`,
    cancel: true,
  }).onOk(() => {
    $q.notify({ type: "positive", message: `Password reset link sent to ${store.currentUser.email}` });
  });
}
</script>
