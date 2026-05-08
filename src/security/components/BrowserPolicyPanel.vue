<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-sm">{{ $t('security.components.BrowserPolicyPanel.1c9bfc') }}</div>
    <div class="text-caption text-grey q-mb-lg">
      {{ $t('security.components.BrowserPolicyPanel.b2790f') }}
    </div>

    <!-- Browser selector -->
    <q-tabs v-model="browserTab" dense class="q-mb-md" align="left">
      <q-tab name="edge" :label="$t('security.components.BrowserPolicyPanel.070aca')" icon="language" />
      <q-tab name="ie" :label="$t('security.components.BrowserPolicyPanel.76d573')" icon="explore" />
    </q-tabs>

    <!-- Policy list -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2">{{ browserTab === 'edge' ? 'Edge' : 'IE' }} Policies ({{ policies.length }})</div>
              <q-space />
              <q-btn color="primary" icon="add" round dense size="sm" @click="showCreate" />
            </div>
            <q-list separator dense>
              <q-item
                v-for="p in policies" :key="p.id"
                clickable :active="selectedPolicy?.id === p.id"
                active-class="bg-primary-1"
                @click="selectPolicy(p)"
              >
                <q-item-section>
                  <q-item-label>{{ p.name }}</q-item-label>
                  <q-item-label caption>{{ p.browser }} · {{ p.scope }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="delete" size="xs" color="negative"
                    @click.stop="deletePolicy(p.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="policies.length === 0">
                <q-item-section class="text-grey text-center text-caption">{{ $t('security.components.BrowserPolicyPanel.c4b7a0') }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Editor -->
      <div class="col-12 col-md-8" v-if="selectedPolicy">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-md">{{ browserTab === 'edge' ? 'Edge' : 'IE' }}: {{ selectedPolicy.name }}</div>
            <q-form @submit.prevent="savePolicy" class="q-gutter-sm">

              <q-input v-model="form.name" :label="$t('security.components.BrowserPolicyPanel.7cf3cf')" outlined dense />
              <q-select v-model="form.scope" :options="scopeOptions" :label="$t('security.components.BrowserPolicyPanel.4651a3')" outlined dense emit-value map-options />

              <!-- Edge settings -->
              <template v-if="browserTab === 'edge'">
                <q-banner class="bg-blue-1 rounded" rounded>
                  <template v-slot:avatar><q-icon name="home" color="primary" /></template>
                  <strong>{{ $t('security.components.BrowserPolicyPanel.6681c3') }}</strong>
                </q-banner>
                <div class="row q-gutter-sm">
                  <q-input v-model="form.edge_homepage_url" :label="$t('security.components.BrowserPolicyPanel.bd8570')" outlined dense class="col-12" />
                  <q-input v-model="form.edge_new_tab_url" :label="$t('security.components.BrowserPolicyPanel.9ff722')" outlined dense class="col-12" />
                  <q-input v-model="form.edge_startup_page" :label="$t('security.components.BrowserPolicyPanel.15bf79')" outlined dense class="col-12" />
                  <q-input v-model="form.edge_default_search" :label="$t('security.components.BrowserPolicyPanel.e6fec9')" outlined dense class="col-12" />
                </div>

                <q-banner class="bg-blue-1 q-mt-sm rounded">
                  <template v-slot:avatar><q-icon name="security" color="primary" /></template>
                  <strong>{{ $t('security.components.BrowserPolicyPanel.6ee51f') }}</strong>
                </q-banner>
                <div class="row q-gutter-sm">
                  <q-toggle v-model="form.edge_block_popups" :label="$t('security.components.BrowserPolicyPanel.470bcb')" dense />
                  <q-toggle v-model="form.edge_smart_screen" :label="$t('security.components.BrowserPolicyPanel.b1e828')" dense />
                  <q-toggle v-model="form.edge_password_manager" :label="$t('security.components.BrowserPolicyPanel.170158')" dense />
                  <q-toggle v-model="form.edge_allow_devtools" :label="$t('security.components.BrowserPolicyPanel.96e660')" dense />
                  <q-toggle v-model="form.edge_allow_extensions" :label="$t('security.components.BrowserPolicyPanel.5a0517')" dense />
                  <q-toggle v-model="form.edge_block_inprivate" :label="$t('security.components.BrowserPolicyPanel.fbb42d')" dense />
                  <q-toggle v-model="form.edge_auto_update" :label="$t('security.components.BrowserPolicyPanel.6cbf96')" dense />
                </div>
              </template>

              <!-- IE settings -->
              <template v-if="browserTab === 'ie'">
                <q-banner class="bg-blue-1 rounded">
                  <template v-slot:avatar><q-icon name="security" color="primary" /></template>
                  <strong>{{ $t('security.components.BrowserPolicyPanel.869eec') }}</strong>
                </q-banner>
                <div class="row q-gutter-sm">
                  <q-toggle v-model="form.ie_protected_mode" :label="$t('security.components.BrowserPolicyPanel.291633')" dense />
                  <q-toggle v-model="form.ie_block_activex" :label="$t('security.components.BrowserPolicyPanel.0dbdb7')" dense />
                  <q-toggle v-model="form.ie_allow_only_approved_activex" :label="$t('security.components.BrowserPolicyPanel.a869d9')" dense />
                  <q-toggle v-model="form.ie_enhanced_protected_mode" :label="$t('security.components.BrowserPolicyPanel.4d71e3')" dense />
                  <q-toggle v-model="form.ie_tracking_protection" :label="$t('security.components.BrowserPolicyPanel.3fe16e')" dense />
                </div>
              </template>

              <!-- URL Lists -->
              <q-banner class="bg-blue-1 q-mt-sm rounded">
                <template v-slot:avatar><q-icon name="block" color="primary" /></template>
                <strong>{{ $t('security.components.BrowserPolicyPanel.10e45c') }}</strong>
              </q-banner>
              <q-input v-model="blockedUrlsText" :label="$t('security.components.BrowserPolicyPanel.43d389')" outlined dense type="textarea" rows="3"
                :hint="$t('security.components.BrowserPolicyPanel.395fd7')" />
              <q-input v-model="allowedUrlsText" :label="$t('security.components.BrowserPolicyPanel.2d2690')" outlined dense type="textarea" rows="2"
                :hint="$t('security.components.BrowserPolicyPanel.4b980d')" />

              <q-toggle v-model="form.enabled" :label="$t('security.components.BrowserPolicyPanel.48ff2e')" dense color="positive" />

              <q-btn type="submit" color="primary" :label="$t('security.components.BrowserPolicyPanel.de525b')" :loading="saving" class="q-mt-sm" />
              <q-btn type="button" color="teal" :label="$t('security.components.BrowserPolicyPanel.281560')" :loading="deploying" @click="deployPolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
              <q-btn type="button" color="warning" icon="undo" label="Revoke from devices" :loading="revoking" @click="revokePolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8" v-else>
        <q-banner class="bg-grey-1 rounded">
          <q-icon name="info" class="q-mr-sm" />{{ $t('security.components.BrowserPolicyPanel.b4fd64') }}
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const browserTab = ref<"edge" | "ie">("edge");
const policies = ref<any[]>([]);
const selectedPolicy = ref<any>(null);
const saving = ref(false);
const deploying = ref(false);
const revoking = ref(false);
const blockedUrlsText = ref("");
const allowedUrlsText = ref("");

const defaultForm = () => ({
  name: "", browser: "edge", scope: "global", enabled: true,
  edge_homepage_url: "", edge_new_tab_url: "", edge_startup_page: "",
  edge_default_search: "", edge_block_popups: true, edge_smart_screen: true,
  edge_password_manager: true, edge_allow_devtools: true, edge_allow_extensions: false,
  edge_block_inprivate: false, edge_auto_update: true,
  ie_protected_mode: true, ie_block_activex: false, ie_allow_only_approved_activex: false,
  ie_enhanced_protected_mode: false, ie_tracking_protection: true,
  blocked_urls: [] as string[], allowed_urls: [] as string[],
});

const form = reactive(defaultForm());

const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Device Group", value: "group" },
  { label: "User", value: "user" },
];

watch(browserTab, (b) => {
  form.browser = b;
  loadPolicies();
});

async function loadPolicies() {
  try {
    policies.value = (await axios.get(`/security/browser-policies/?browser=${browserTab.value}`)).data;
  } catch {
    $q.notify({ message: "Failed to load policies", color: "negative" });
  }
}

function selectPolicy(p: any) {
  selectedPolicy.value = p;
  Object.assign(form, defaultForm(), p);
  form.browser = p.browser || browserTab.value;
  blockedUrlsText.value = (p.blocked_urls || []).join("\n");
  allowedUrlsText.value = (p.allowed_urls || []).join("\n");
}

function showCreate() {
  selectedPolicy.value = { id: null };
  Object.assign(form, defaultForm(), { browser: browserTab.value });
  blockedUrlsText.value = "";
  allowedUrlsText.value = "";
}

async function savePolicy() {
  saving.value = true;
  try {
    const payload = {
      ...form,
      browser: browserTab.value,
      blocked_urls: blockedUrlsText.value.split("\n").filter((l) => l.trim()),
      allowed_urls: allowedUrlsText.value.split("\n").filter((l) => l.trim()),
    };
    if (selectedPolicy.value?.id) {
      await axios.put(`/security/browser-policies/${selectedPolicy.value.id}/`, payload);
    } else {
      const resp = await axios.post("/security/browser-policies/", payload);
      selectedPolicy.value = resp.data;
    }
    await loadPolicies();
    $q.notify({ message: "Policy saved", color: "positive", icon: "check" });
  } catch {
    $q.notify({ message: "Save failed", color: "negative" });
  } finally {
    saving.value = false;
  }
}

async function deployPolicy() {
  if (!selectedPolicy.value?.id) return;
  deploying.value = true;
  try {
    await axios.post(`/security/browser-policies/${selectedPolicy.value.id}/deploy/`);
    $q.notify({ message: "Deploy initiated", color: "positive", icon: "send" });
  } catch {
    $q.notify({ message: "Deploy failed", color: "negative" });
  } finally {
    deploying.value = false;
  }
}

async function revokePolicy() {
  if (!selectedPolicy.value?.id) return;
  $q.dialog({
    title: "Revoke browser policy?",
    message: "This will remove browser registry policy settings from matching Windows agents and disable this policy record.",
    cancel: true,
    ok: { color: "warning", label: "Revoke" },
  }).onOk(async () => {
    revoking.value = true;
    try {
      const resp = await axios.post(`/security/browser-policies/${selectedPolicy.value.id}/revoke/`, { wait: true });
      const count = resp.data?.agents_triggered ?? 0;
      $q.notify({ message: `Revoke sent to ${count} agent(s)`, color: "positive", icon: "undo" });
      await loadPolicies();
      const refreshed = policies.value.find((p) => p.id === selectedPolicy.value.id);
      if (refreshed) selectPolicy(refreshed);
    } catch {
      $q.notify({ message: "Revoke failed", color: "negative" });
    } finally {
      revoking.value = false;
    }
  });
}

async function deletePolicy(id: number) {
  await $q.dialog({
    title: "Delete Policy?", cancel: true, ok: { color: "negative", label: "Delete" },
  });
  await axios.delete(`/security/browser-policies/${id}/`);
  if (selectedPolicy.value?.id === id) selectedPolicy.value = null;
  await loadPolicies();
}

onMounted(loadPolicies);
</script>
