<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <!-- свитч для переключения темы -->
        <div class="theme-toggle-container">
          <label class="theme-switch">
            <input
              :checked="!isDarkMode"
              type="checkbox"
              @change="handleThemeChange"
            />
            <span class="slider">
              <div class="star star_1"></div>
              <div class="star star_2"></div>
              <div class="star star_3"></div>
              <svg viewBox="0 0 16 16" class="cloud_1 cloud">
                <path
                  transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                  fill="#fff"
                  d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                ></path>
              </svg>
            </span>
          </label>
        </div>

        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
          class="modern-card"
        >
          <q-card-section class="text-center q-pt-xl q-pb-md">
            <div style="text-align: center">
              <img
                :src="bcyLogo"
                :alt="`${$t('branding.systemName')} logo`"
                class="auth-logo"
              />
            </div>
            <div class="text-h4 text-weight-bold gradient-text q-mt-md">
              Sign In
            </div>
            <div class="system-name q-mt-sm">
              {{ $t("branding.systemName") }}
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <q-form ref="form" @submit.prevent="checkCreds" class="q-gutter-md">
              <q-input
                filled
                v-model="credentials.username"
                label="Username"
                lazy-rules
                class="modern-input"
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="credentials.password"
                filled
                :type="showPassword ? 'password' : 'text'"
                label="Password"
                lazy-rules
                class="modern-input"
                :rules="[
                  (val) => (val && val.length > 0) || 'This field is required',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <div class="row items-center justify-between q-mt-sm q-px-xs">
                <q-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  dense
                  color="primary"
                  class="text-caption"
                />
                <a
                  href="#"
                  class="forgot-link text-caption"
                  @click.prevent="showPasswordResetRequest = true"
                  >Forgot Password?</a
                >
              </div>

              <div class="q-mt-lg">
                <q-btn
                  label="Sign In"
                  type="submit"
                  class="gradient-button full-width"
                  size="lg"
                  no-caps
                />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section
            v-if="ssoProviders?.length > 0"
            class="q-px-lg q-pb-lg"
          >
            <div class="text-caption text-center text-grey-6 q-mb-md">
              Or Sign in with
            </div>

            <div class="row justify-center q-gutter-sm">
              <q-btn
                v-for="provider in ssoProviders"
                :key="provider.id"
                @click="openSSOProviderRedirect(provider.id)"
                round
                class="social-button"
                :icon="provider.icon ?? 'key'"
              />
            </div>
          </q-card-section>

          <q-card-section class="text-center q-py-md">
            <div class="text-caption text-grey-6">
              <q-icon name="shield" size="12px" /> Secure Enterprise Platform
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              © 2026 {{ $t("branding.systemName") }}. v{{ appVersion }}
            </div>
          </q-card-section>
        </q-card>

        <q-dialog v-model="showPasswordResetRequest">
          <q-card style="min-width: 360px; max-width: 92vw">
            <q-card-section>
              <div class="text-h6">Reset password</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Enter your username or email. If the account exists, a reset
                link will be sent.
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-model="passwordResetRequest.emailOrUsername"
                label="Username or email"
                filled
                autofocus
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                color="primary"
                label="Send reset link"
                :loading="passwordResetRequest.loading"
                @click="submitPasswordResetRequest"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showPasswordResetConfirm" persistent>
          <q-card style="min-width: 360px; max-width: 92vw">
            <q-card-section>
              <div class="text-h6">Set a new password</div>
            </q-card-section>
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="passwordResetConfirm.password"
                label="New password"
                type="password"
                filled
              />
              <q-input
                v-model="passwordResetConfirm.password2"
                label="Repeat new password"
                type="password"
                filled
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" @click="cancelPasswordResetConfirm" />
              <q-btn
                color="primary"
                label="Change password"
                :loading="passwordResetConfirm.loading"
                @click="submitPasswordResetConfirm"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.modern-card {
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 30px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 30px 30px -20px;
  overflow: hidden;
}

.auth-logo {
  width: 118px;
  max-width: 42vw;
  max-height: 132px;
  object-fit: contain;
}

.system-name {
  max-width: 26rem;
  margin-left: auto;
  margin-right: auto;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}

.gradient-text {
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modern-input :deep(.q-field__control) {
  border-radius: 20px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  background: white;
}

.modern-input :deep(.q-field__control):before {
  border: none;
}

.modern-input :deep(.q-field__control):focus-within {
  box-shadow:
    #12b1d1 0px 0px 0px 2px,
    #cff0ff 0px 10px 10px -5px;
}

.gradient-button {
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  font-weight: bold;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.878) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
  padding: 12px 24px;
}

.gradient-button:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 23px 10px -20px;
}

.gradient-button:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 15px 10px -10px;
}

.social-button {
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  border: 4px solid white;
  box-shadow: rgba(133, 189, 215, 0.878) 0px 12px 10px -8px;
  transition: all 0.2s ease-in-out;
  width: 45px;
  height: 45px;
}

.social-button :deep(.q-icon) {
  color: white;
}

.social-button:hover {
  transform: scale(1.15);
}

.social-button:active {
  transform: scale(0.9);
}

.gradient-icon {
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.forgot-link {
  color: #0099ff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.forgot-link:hover {
  color: rgb(16, 137, 211);
  text-decoration: underline;
}

.body--dark .modern-card {
  background: linear-gradient(0deg, rgb(30, 30, 30) 0%, rgb(40, 45, 55) 100%);
  border: 5px solid rgb(45, 45, 45);
}

.body--dark .modern-input :deep(.q-field__control) {
  background: rgb(35, 35, 35);
  box-shadow: rgba(18, 177, 209, 0.2) 0px 10px 10px -5px;
}

.body--dark .modern-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.7);
}

.body--dark .text-grey-7 {
  color: rgba(255, 255, 255, 0.6) !important;
}

.body--dark .text-grey-6 {
  color: rgba(255, 255, 255, 0.5) !important;
}

.body--dark .system-name {
  color: rgba(255, 255, 255, 0.72);
}

.body--dark .forgot-link {
  color: #12b1d1;
}

.body--dark .forgot-link:hover {
  color: rgb(18, 177, 209);
}

.body--light .modern-card {
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(250, 252, 255) 100%
  );
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.4) 0px 30px 30px -20px;
}

.body--light .modern-input :deep(.q-field__control) {
  background: white;
  box-shadow: rgba(16, 137, 211, 0.15) 0px 10px 10px -5px;
}

.body--light .modern-input :deep(.q-field__control):focus-within {
  box-shadow:
    #1089d3 0px 0px 0px 2px,
    rgba(16, 137, 211, 0.2) 0px 10px 10px -5px;
}

.body--light .text-grey-7 {
  color: rgba(0, 0, 0, 0.6) !important;
}

.body--light .text-grey-6 {
  color: rgba(0, 0, 0, 0.5) !important;
}

.theme-toggle-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 1.5em;
  border-radius: 30px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.body--light .theme-switch {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 2px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.3);
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1a1a2e;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-switch .slider:before {
  position: absolute;
  content: "";
  height: 0.7em;
  width: 0.7em;
  border-radius: 50%;
  left: 0.5em;
  bottom: 0.3em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  background: #fff;
  mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  -webkit-mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(255, 255, 255, 0.4);
}

.theme-switch input:checked + .slider {
  background-color: #0099ff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switch input:checked + .slider:before {
  transform: translateX(1.8em);
  mask: none;
  -webkit-mask: none;
  background: radial-gradient(circle, #ffcf48 0%, #ffcf48 100%);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.3) inset,
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 12px rgba(255, 207, 72, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.theme-switch input:checked ~ .slider .star {
  opacity: 0;
}

.theme-switch input:checked ~ .slider .cloud {
  opacity: 1;
}

.theme-switch .star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 6px;
  height: 6px;
  transition: all 0.4s;
  box-shadow:
    0 0 3px rgba(255, 255, 255, 0.8),
    0 0 6px rgba(255, 255, 255, 0.4);
}

.theme-switch .star_1 {
  left: 1.5em;
  top: 0.3em;
}

.theme-switch .star_2 {
  left: 2.3em;
  top: 0.5em;
}

.theme-switch .star_3 {
  left: 1.9em;
  top: 0.9em;
}

.theme-switch .cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { type QForm, useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import axios from "axios";
import {
  openSSOProviderRedirect,
  getSSOConfig,
  type SSOProviderConfig,
} from "@/ee/sso/api/sso";
import packageJson from "../../package.json";
import bcyLogo from "@/assets/bcy-logo.png";

// setup quasar
const $q = useQuasar();

// Управление темой входа
const THEME_STORAGE_KEY = "login-theme-preference";

const loadTheme = (): boolean => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved !== null) {
    return saved === "true";
  }

  return false;
};

const isDarkMode = ref(loadTheme());
$q.dark.set(isDarkMode.value);

const saveTheme = (dark: boolean) => {
  localStorage.setItem(THEME_STORAGE_KEY, dark.toString());
};

function handleThemeChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const newDarkMode = !target.checked;
  isDarkMode.value = newDarkMode;
  $q.dark.set(newDarkMode);
  saveTheme(newDarkMode);
}

// setup auth store
const auth = useAuthStore();

// setup router
const router = useRouter();
const route = useRoute();

const form = ref<QForm | null>(null);

// login logic
const credentials = reactive({ username: "", password: "" });
const showPassword = ref(true);
const rememberMe = ref(false);
const appVersion = ref(packageJson.version);
const ssoProviders = ref([] as SSOProviderConfig[]);
const showPasswordResetRequest = ref(false);
const showPasswordResetConfirm = ref(false);
const passwordResetRequest = reactive({
  emailOrUsername: "",
  loading: false,
});
const passwordResetConfirm = reactive({
  uid: "",
  token: "",
  password: "",
  password2: "",
  loading: false,
});

async function navigateAfterLogin(target: RouteLocationRaw) {
  const href = router.resolve(target).href || "/";
  sessionStorage.setItem("mdm_login_redirect_reload_once", "1");
  window.setTimeout(() => window.location.replace(href), 3000);
}

async function checkCreds() {
  let redirectTarget: RouteLocationRaw | null = null;
  try {
    await auth.checkCredentials(credentials, rememberMe.value);
    await auth.login(credentials, rememberMe.value);
    if (auth.isSspOnly) {
      redirectTarget =
        auth.next && auth.next.startsWith("/ssp") ? auth.next : "/ssp/devices";
      auth.next = null;
    } else if (auth.next) {
      redirectTarget = auth.next;
      auth.next = null;
    } else {
      redirectTarget = { name: "Dashboard" };
    }
  } catch (err) {
    console.error(err);
  } finally {
    form.value?.reset();
  }

  if (redirectTarget) {
    await navigateAfterLogin(redirectTarget);
  }
}

async function submitPasswordResetRequest() {
  passwordResetRequest.loading = true;
  try {
    await axios.post("/accounts/password-reset/request/", {
      email_or_username: passwordResetRequest.emailOrUsername,
      origin: window.location.origin,
    });
    showPasswordResetRequest.value = false;
    passwordResetRequest.emailOrUsername = "";
    $q.notify({
      color: "positive",
      message:
        "If the account exists, password reset instructions have been sent.",
    });
  } finally {
    passwordResetRequest.loading = false;
  }
}

function cancelPasswordResetConfirm() {
  showPasswordResetConfirm.value = false;
  router.replace({ name: "Login" });
}

async function submitPasswordResetConfirm() {
  if (passwordResetConfirm.password !== passwordResetConfirm.password2) {
    $q.notify({ color: "negative", message: "Passwords do not match" });
    return;
  }

  passwordResetConfirm.loading = true;
  try {
    await axios.post("/accounts/password-reset/confirm/", {
      uid: passwordResetConfirm.uid,
      token: passwordResetConfirm.token,
      password: passwordResetConfirm.password,
    });
    showPasswordResetConfirm.value = false;
    passwordResetConfirm.password = "";
    passwordResetConfirm.password2 = "";
    $q.notify({
      color: "positive",
      message: "Password was reset. You can now sign in.",
    });
    router.replace({ name: "Login" });
  } finally {
    passwordResetConfirm.loading = false;
  }
}

onMounted(async () => {
  const uid = typeof route.query.uid === "string" ? route.query.uid : "";
  const token = typeof route.query.token === "string" ? route.query.token : "";
  if (uid && token) {
    passwordResetConfirm.uid = uid;
    passwordResetConfirm.token = token;
    showPasswordResetConfirm.value = true;
  }

  try {
    const result = await getSSOConfig();
    ssoProviders.value = result.data.socialaccount.providers;
  } catch (e) {
    console.error(e);
  }
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0.06)
    ),
    url("@/assets/bcy-background.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: background-image 0.4s ease;
}

.body--light .bg-image {
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.12)
    ),
    url("@/assets/bcy-background.jpg");
}
</style>
