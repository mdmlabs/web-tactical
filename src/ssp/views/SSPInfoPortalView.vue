<template>
  <q-page class="q-pa-md" style="max-width: 900px; margin: 0 auto">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">{{ $t('ssp.views.SSPInfoPortalView.f56300') }}</div>
      <q-input v-model="globalSearch" dense outlined :placeholder="$t('ssp.views.SSPInfoPortalView.5e13ed')" style="width:280px" clearable>
        <template v-slot:prepend><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-sm">
              <q-icon name="support_agent" class="q-mr-xs" />
              Support
            </div>
            <q-list dense>
              <q-item v-if="settings.support_email">
                <q-item-section avatar><q-icon name="email" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label>{{ settings.support_email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="settings.support_phone">
                <q-item-section avatar><q-icon name="phone" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Phone</q-item-label>
                  <q-item-label>{{ settings.support_phone }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="settings.support_url">
                <q-item-section avatar><q-icon name="link" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Help URL</q-item-label>
                  <q-item-label class="ellipsis">{{ settings.support_url }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="row q-gutter-xs q-mt-sm">
              <q-btn
                v-if="settings.support_email"
                dense outline color="primary" icon="email" label="Email"
                :href="`mailto:${settings.support_email}`"
              />
              <q-btn
                v-if="settings.support_phone"
                dense outline color="primary" icon="phone" label="Call"
                :href="`tel:${settings.support_phone}`"
              />
              <q-btn
                v-if="settings.support_url"
                dense flat color="primary" icon="open_in_new" label="Open help"
                :href="settings.support_url" target="_blank"
              />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-sm">
              <q-icon name="hub" class="q-mr-xs" />
              Portal
            </div>
            <q-list dense>
              <q-item>
                <q-item-section avatar><q-icon name="language" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Portal URL</q-item-label>
                  <q-item-label class="ellipsis">{{ settings.portal_url || "-" }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="dns" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Backend</q-item-label>
                  <q-item-label class="ellipsis">{{ settings.backend_url || "-" }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="storage" /></q-item-section>
                <q-item-section>
                  <q-item-label caption>Database</q-item-label>
                  <q-item-label>{{ settings.database_label || "-" }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-sm">
              <q-icon name="privacy_tip" class="q-mr-xs" />
              Privacy Terms
            </div>
            <div class="privacy-box">{{ settings.privacy_terms || "Privacy terms are not configured." }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Info categories (#558-569) -->
    <div class="row q-gutter-md q-mb-md">
      <q-card
        v-for="cat in categories"
        :key="cat.id"
        flat bordered clickable class="col kpi-card"
        :class="{ 'border-primary': activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <q-card-section class="text-center q-pa-sm">
          <q-icon :name="cat.icon" :color="activeCategory === cat.id ? 'primary' : 'grey'" size="28px" />
          <div class="text-caption q-mt-xs" :class="activeCategory === cat.id ? 'text-primary text-weight-bold' : ''">{{ cat.label }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Content list -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <q-expansion-item
          v-for="item in filteredItems"
          :key="item.id"
          :label="item.title"
          :icon="item.icon"
          :caption="item.category"
          expand-separator
          class="q-mb-xs"
        >
          <q-card>
            <q-card-section class="text-body2" v-html="item.content" />
            <q-card-actions v-if="item.link">
              <q-btn flat color="primary" :label="item.linkLabel || 'Read More'" :href="item.link" target="_blank" icon="open_in_new" />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
        <div v-if="!filteredItems.length" class="text-center q-pa-md text-grey">
          No articles found for "{{ globalSearch }}". Try different keywords.
        </div>
      </q-card-section>
    </q-card>

    <!-- Feedback form (#569) -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">
          <q-icon name="feedback" class="q-mr-xs" />
          {{ $t('ssp.views.SSPInfoPortalView.50332d') }}
        </div>
        <div class="row q-gutter-md">
          <div class="col-12 col-md-5">
            <q-select v-model="feedback.type" :options="['Question', 'Policy Clarification', 'Technical Issue', 'Feature Request', 'Other']"
              :label="$t('ssp.views.SSPInfoPortalView.0a6900')" outlined dense class="q-mb-sm" />
            <q-input v-model="feedback.subject" :label="$t('ssp.views.SSPInfoPortalView.e7c6a0')" outlined dense class="q-mb-sm" />
            <q-input v-model="feedback.message" :label="$t('ssp.views.SSPInfoPortalView.8addb8')" outlined dense type="textarea" rows="4" />
          </div>
          <div class="col-12 col-md-5 q-pt-md">
            <div class="text-caption text-grey q-mb-sm">{{ $t('ssp.views.SSPInfoPortalView.c1a900') }}</div>
            <q-btn color="primary" :label="$t('ssp.views.SSPInfoPortalView.d00157')" icon="send" @click="submitFeedback" :loading="submittingFeedback" class="q-mb-sm" />
            <q-banner v-if="feedbackSent" inline-actions class="bg-positive text-white rounded-borders">
              <template v-slot:avatar><q-icon name="check_circle" /></template>
              Request submitted! Reference: #{{ feedbackRef }}
            </q-banner>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const globalSearch = ref("");
const activeCategory = ref("all");
const submittingFeedback = ref(false);
const feedbackSent = ref(false);
const feedbackRef = ref("");
const feedback = ref({ type: "Question", subject: "", message: "" });
const settings = ref<any>({});

const categories = ref<any[]>([
  { id: "all", label: "All", icon: "apps" },
]);

const articles = ref<any[]>([
  { id: 1, category: "faq", title: "How do I enroll my device?", icon: "devices", content: "To enroll your device, go to <b>My Devices</b> tab and click <b>Enroll New Device</b>. Fill in the device name, type, and OS version. Your IT administrator will review and approve the enrollment." },
  { id: 2, category: "faq", title: "What happens if I lose my device?", icon: "report_problem", content: "Immediately report the loss using the <b>Report Lost Device</b> tab. You can remotely lock or wipe the device. Contact IT Security at ext. 555 for urgent assistance." },
  { id: 3, category: "guides", title: "Setting up VPN on Windows", icon: "vpn_lock", content: "1. Go to Settings > Network > VPN\n2. Click Add a VPN connection\n3. Use the credentials provided by IT\n4. Connect to 'Corporate VPN'\n\nFor issues, contact helpdesk@company.com" },
  { id: 4, category: "guides", title: "Installing approved software", icon: "install_desktop", content: "Browse the <b>App Catalog</b> to find approved applications. Click Install and follow the prompts. Unauthorized software installation is prohibited per IT Policy." },
  { id: 5, category: "compliance", title: "GDPR Data Handling Requirements", icon: "privacy_tip", content: "All personal data must be handled in accordance with GDPR. Do not store personal data on personal devices. Encrypt sensitive files. Report data breaches within 72 hours." },
  { id: 6, category: "compliance", title: "Password Policy Requirements", icon: "lock", content: "Minimum 8 characters, must include uppercase, lowercase, numbers and special characters. Change every 90 days. Do not reuse last 5 passwords. Enable MFA for remote access." },
  { id: 7, category: "roles", title: "Standard User Permissions", icon: "person", content: "Standard users can install pre-approved software, access corporate resources, use VPN. Cannot install unapproved software, change system settings or access restricted shares." },
  { id: 8, category: "roles", title: "Administrator Permissions", icon: "admin_panel_settings", content: "IT Administrators have full device management capabilities. Administrator access is audited and logged. Any changes must comply with Change Management Policy." },
  { id: 9, category: "policy", title: "BYOD Policy Summary", icon: "phone_android", content: "Personal devices used for work must be enrolled in MDM. Minimum OS versions required. Corporate data may be remotely wiped if device is lost or employment ends." },
  { id: 10, category: "policy", title: "Acceptable Use Policy", icon: "gavel", content: "Corporate devices are for business use. Personal use must not interfere with work. Prohibited: piracy, inappropriate content, unauthorized access. Violations may result in disciplinary action." },
]);

const filteredItems = computed(() => {
  return articles.value.filter((a) => {
    const matchCat = activeCategory.value === "all" || a.category === activeCategory.value;
    const matchSearch = !globalSearch.value ||
      a.title.toLowerCase().includes(globalSearch.value.toLowerCase()) ||
      a.content.toLowerCase().includes(globalSearch.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

async function submitFeedback() {
  if (!feedback.value.subject || !feedback.value.message) {
    $q.notify({ type: "warning", message: "Please fill in subject and message" });
    return;
  }
  submittingFeedback.value = true;
  try {
    const r = await axios.post("/appmanagement/ssp/feedback/", feedback.value);
    feedbackRef.value = r.data?.id || Math.floor(Math.random() * 90000) + 10000;
    feedbackSent.value = true;
    feedback.value = { type: "Question", subject: "", message: "" };
    $q.notify({ type: "positive", message: "Feedback submitted successfully" });
  } finally { submittingFeedback.value = false; }
}

async function loadInfoPortal() {
  try {
    const r = await axios.get("/appmanagement/ssp/info/");
    settings.value = r.data?.settings || {};
    const backendCategories = r.data?.categories || [];
    categories.value = [{ id: "all", label: "All", icon: "apps" }, ...backendCategories];
    articles.value = r.data?.articles || articles.value;
  } catch {
    // Keep built-in fallback content when backend content is not available.
  }
}

onMounted(loadInfoPortal);
</script>

<style scoped>
.border-primary {
  border-color: var(--mdm-primary, #2563EB) !important;
  border-width: 2px !important;
}
.kpi-card {
  min-width: 80px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.kpi-card:hover {
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.1);
}
.privacy-box {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
  max-height: 132px;
  overflow: auto;
  padding: 10px;
  white-space: pre-wrap;
}
</style>
