<template>
  <q-page class="q-pa-md" style="max-width: 700px; margin: 0 auto">
    <div class="text-h6 q-mb-lg">{{ $t('ssp.views.SSPPasswordView.c188f4') }}</div>

    <!-- Change Password (#551) -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">
          <q-icon name="lock" class="q-mr-xs" />
          {{ $t('ssp.views.SSPPasswordView.49289d') }}
        </div>
        <q-form @submit.prevent="changePassword" class="q-gutter-sm">
          <q-input
            v-model="changeForm.current"
            :label="$t('ssp.views.SSPPasswordView.913a9f')"
            outlined dense
            :type="showCurrent ? 'text' : 'password'"
          >
            <template v-slot:append>
              <q-icon :name="showCurrent ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showCurrent = !showCurrent" />
            </template>
          </q-input>
          <q-input
            v-model="changeForm.newPass"
            :label="$t('ssp.views.SSPPasswordView.154709')"
            outlined dense
            :type="showNew ? 'text' : 'password'"
            :rules="[val => val.length >= 8 || 'Minimum 8 characters']"
          >
            <template v-slot:append>
              <q-icon :name="showNew ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showNew = !showNew" />
            </template>
          </q-input>
          <q-linear-progress :value="passwordStrength / 4" :color="strengthColor" size="6px" class="q-mt-xs" />
          <div class="text-caption" :class="`text-${strengthColor}`">Password strength: {{ strengthLabel }}</div>
          <q-input
            v-model="changeForm.confirm"
            :label="$t('ssp.views.SSPPasswordView.1abe03')"
            outlined dense
            type="password"
            :rules="[val => val === changeForm.newPass || 'Passwords do not match']"
          />
          <q-btn type="submit" color="primary" :label="$t('ssp.views.SSPPasswordView.49289d')" :loading="changingPass" />
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Reset Portal Password (#552) -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">
          <q-icon name="email" class="q-mr-xs" />
          {{ $t('ssp.views.SSPPasswordView.11edc6') }}
        </div>
        <p class="text-caption text-grey q-mb-md">If you've forgotten your password, enter your email to receive a reset link.</p>
        <div class="row q-gutter-sm items-start">
          <q-input
            v-model="resetEmail"
            :label="$t('ssp.views.SSPPasswordView.09ba55')"
            outlined dense type="email"
            class="col"
            :rules="[val => /.+@.+\..+/.test(val) || 'Enter valid email']"
          />
          <q-btn color="secondary" :label="$t('ssp.views.SSPPasswordView.987be4')" :loading="sendingReset" @click="sendResetLink" />
        </div>
        <q-banner v-if="resetSent" inline-actions class="q-mt-sm bg-positive text-white rounded-borders">
          <template v-slot:avatar><q-icon name="check_circle" /></template>
          Reset link sent to {{ resetEmail }}. Check your inbox.
        </q-banner>
      </q-card-section>
    </q-card>

    <!-- MFA Status (mock) -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">
          <q-icon name="security" class="q-mr-xs" />
          {{ $t('ssp.views.SSPPasswordView.995b5b') }}
        </div>
        <div class="row items-center q-gutter-md">
          <div class="col">
            <div class="text-body2">{{ $t('ssp.views.SSPPasswordView.fbd0a5') }}</div>
            <div class="text-caption text-grey">{{ $t('ssp.views.SSPPasswordView.406d82') }}</div>
          </div>
          <q-chip :color="mfaEnabled ? 'positive' : 'grey'" text-color="white" :icon="mfaEnabled ? 'check_circle' : 'radio_button_unchecked'">
            {{ mfaEnabled ? "Enabled" : "Disabled" }}
          </q-chip>
          <q-btn v-if="!mfaEnabled" color="primary" :label="$t('ssp.views.SSPPasswordView.590a06')" :loading="mfaLoading" @click="enableMFA" />
          <q-btn v-else flat color="negative" :label="$t('ssp.views.SSPPasswordView.9a7d4e')" @click="disableMFA" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import QRCode from "qrcode";

const $q = useQuasar();

// Change password
const showCurrent = ref(false);
const showNew = ref(false);
const changingPass = ref(false);
const changeForm = ref({ current: "", newPass: "", confirm: "" });

const passwordStrength = computed(() => {
  const p = changeForm.value.newPass;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});
const strengthColor = computed(() => ["negative", "warning", "info", "positive", "positive"][passwordStrength.value]);
const strengthLabel = computed(() => ["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength.value]);

async function changePassword() {
  changingPass.value = true;
  try {
    await axios.put("/accounts/resetpw/", { old_password: changeForm.value.current, password: changeForm.value.newPass });
    $q.notify({ type: "positive", message: "Password changed successfully" });
    changeForm.value = { current: "", newPass: "", confirm: "" };
  } catch (e: any) {
    $q.notify({ type: "negative", message: e?.response?.data?.error || e?.response?.data?.detail || "Failed to change password" });
  } finally { changingPass.value = false; }
}

// Reset by email
const resetEmail = ref("");
const sendingReset = ref(false);
const resetSent = ref(false);

async function sendResetLink() {
  sendingReset.value = true;
  try {
    await axios.post("/accounts/forgot-password/", { email: resetEmail.value });
    resetSent.value = true;
  } catch {
    $q.notify({ type: "negative", message: "Could not send reset email. Contact your administrator." });
  } finally { sendingReset.value = false; }
}

// MFA (STT 551)
const mfaEnabled = ref(false);
const mfaQRCode = ref("");
const mfaSecret = ref("");
const mfaSetupStep = ref<"idle" | "scan" | "verify">("idle");
const mfaVerifyCode = ref("");
const mfaLoading = ref(false);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

async function checkMFAStatus() {
  try {
    const r = await axios.get("/accounts/mfa/status/");
    mfaEnabled.value = r.data.mfa_enabled ?? false;
  } catch {
    mfaEnabled.value = false;
  }
}

async function enableMFA() {
  mfaLoading.value = true;
  try {
    const r = await axios.post("/accounts/mfa/setup/");
    const provisioningUri = r.data.provisioning_uri || "";
    mfaQRCode.value = r.data.qr_code || (provisioningUri ? await QRCode.toDataURL(provisioningUri, { width: 192, margin: 1 }) : "");
    mfaSecret.value = r.data.secret || "";
    mfaSetupStep.value = "scan";

    const qrHtml = mfaQRCode.value
      ? `<div style="text-align:center;margin:12px 0"><img src="${mfaQRCode.value}" alt="TOTP QR code" style="width:192px;height:192px" /></div>`
      : "";
    const secretHtml = mfaSecret.value
      ? `<div style="margin-top:8px"><strong>Manual setup key:</strong><br><code style="word-break:break-all">${escapeHtml(mfaSecret.value)}</code></div>`
      : "";

    $q.dialog({
      title: "Enable TOTP MFA",
      message: `<div>Scan this code with your authenticator app, then enter the 6-digit code to confirm.</div>${qrHtml}${secretHtml}`,
      html: true,
      persistent: true,
      ok: { label: "Enter Code", color: "primary" },
      cancel: true,
    }).onOk(async () => {
      mfaSetupStep.value = "verify";
      $q.dialog({
        title: "Verify MFA Code",
        prompt: { model: "", label: "6-digit code from authenticator", type: "text", maxlength: 6 },
        cancel: true,
        ok: { label: "Verify", color: "positive" },
      }).onOk(async (code: string) => {
        try {
          await axios.post("/accounts/mfa/verify/", { code });
          mfaEnabled.value = true;
          mfaSetupStep.value = "idle";
          $q.notify({ type: "positive", message: "MFA enabled successfully" });
        } catch (e: any) {
          $q.notify({ type: "negative", message: e?.response?.data?.error || "Invalid code" });
        }
      });
    });
  } catch (e: any) {
    $q.notify({ type: "negative", message: e?.response?.data?.error || "Failed to setup MFA" });
  } finally {
    mfaLoading.value = false;
  }
}

function disableMFA() {
  $q.dialog({
    title: "Disable MFA",
    message: "Enter your password to confirm disabling MFA.",
    prompt: { model: "", label: "Password", type: "password" },
    cancel: true,
    ok: { color: "negative", label: "Disable MFA" },
  }).onOk(async (password: string) => {
    try {
      await axios.post("/accounts/mfa/disable/", { password });
      mfaEnabled.value = false;
      $q.notify({ type: "warning", message: "MFA has been disabled" });
    } catch (e: any) {
      $q.notify({ type: "negative", message: e?.response?.data?.error || "Failed to disable MFA" });
    }
  });
}

checkMFAStatus();
</script>
