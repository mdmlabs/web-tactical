<template>
  <q-dialog
    v-model="open"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ isEdit ? "Edit DLP Policy" : "New DLP Policy" }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('close')" />
      </q-card-section>

      <q-separator />

      <q-card-section
        class="q-pa-none"
        style="height: calc(100vh - 120px); overflow: auto"
      >
        <div class="row no-wrap" style="height: 100%">
          <!-- Sidebar tabs -->
          <q-tabs
            v-model="tab"
            vertical
            class="text-grey-8 q-pa-sm"
            style="min-width: 160px; border-right: 1px solid #e0e0e0"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab
              name="general"
              icon="policy"
              :label="$t('security.components.DLPPolicyDialog.9239ee')"
            />
            <q-tab
              name="detection"
              icon="search"
              :label="$t('security.components.DLPPolicyDialog.cce396')"
            />
            <q-tab
              name="paths"
              icon="folder"
              :label="$t('security.components.DLPPolicyDialog.13e7e1')"
            />
            <q-tab
              name="actions"
              icon="block"
              :label="$t('security.components.DLPPolicyDialog.c3cd63')"
            />
            <q-tab
              name="network"
              icon="wifi"
              :label="$t('security.components.DLPPolicyDialog.53ebc5')"
            />
            <q-tab
              name="email"
              icon="email"
              :label="$t('security.components.DLPPolicyDialog.84add5')"
            />
          </q-tabs>

          <!-- Tab panels -->
          <q-tab-panels v-model="tab" animated class="col q-pa-md">
            <!-- General -->
            <q-tab-panel name="general">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                {{ $t("security.components.DLPPolicyDialog.71dd22") }}
              </div>
              <q-banner
                dense
                class="bg-blue-1 text-blue-10 q-mb-md rounded-borders"
              >
                <template v-slot:avatar
                  ><q-icon name="info" color="primary"
                /></template>
                DLP records sensitive-data violations. For every file
                create/modify/delete event use FIM events.
              </q-banner>
              <div class="row q-gutter-md">
                <q-input
                  v-model="form.name"
                  :label="$t('security.components.DLPPolicyDialog.7cf3cf')"
                  outlined
                  dense
                  class="col-12"
                  :rules="[(v) => !!v || 'Name required']"
                />
                <q-select
                  v-model="form.scope"
                  :options="scopeOptions"
                  :label="$t('security.components.DLPPolicyDialog.4651a3')"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="col-12 col-sm-5"
                  @update:model-value="onScopeChange"
                />
                <q-select
                  v-if="form.scope === 'device'"
                  v-model="form.target_agent_id"
                  :options="scopeAgentOptions"
                  label="Target device"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="200"
                  class="col-12 col-sm-6"
                  @filter="filterScopeAgents"
                />
                <q-select
                  v-else-if="form.scope === 'device_group'"
                  v-model="form.target_device_group_id"
                  :options="scopeDeviceGroupOptions"
                  label="Target device group"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="200"
                  class="col-12 col-sm-6"
                  @filter="filterScopeDeviceGroups"
                />
                <q-select
                  v-else-if="form.scope === 'user'"
                  v-model="form.target_user_id"
                  :options="scopeUserOptions"
                  label="Target user"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="200"
                  class="col-12 col-sm-6"
                  @filter="filterScopeUsers"
                />
                <q-select
                  v-else-if="form.scope === 'user_group'"
                  v-model="form.target_user_group_id"
                  :options="scopeUserGroupOptions"
                  label="Target user group"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="200"
                  class="col-12 col-sm-6"
                  @filter="filterScopeUserGroups"
                />
                <q-input
                  v-else
                  label="Target"
                  model-value="All matching devices"
                  outlined
                  dense
                  readonly
                  class="col-12 col-sm-6"
                />
                <div class="col-12">
                  <q-toggle
                    v-model="form.enabled"
                    :label="$t('security.components.DLPPolicyDialog.4ac390')"
                    color="positive"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Detection -->
            <q-tab-panel name="detection">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                {{ $t("security.components.DLPPolicyDialog.fe9047") }}
              </div>

              <div class="q-mb-lg">
                <div class="text-caption text-grey-7 q-mb-sm">
                  {{ $t("security.components.DLPPolicyDialog.42b7d9") }}
                </div>
                <q-toggle
                  v-model="form.detect_pii"
                  color="primary"
                  :label="$t('security.components.DLPPolicyDialog.becc2a')"
                />
                <q-toggle
                  v-model="form.detect_credentials"
                  color="primary"
                  :label="$t('security.components.DLPPolicyDialog.816cdc')"
                />
              </div>

              <q-select
                v-model="form.classification_level"
                :options="classificationOptions"
                :label="$t('security.components.DLPPolicyDialog.f92765')"
                outlined
                dense
                emit-value
                map-options
                class="q-mb-md"
                hint="'Any' monitors all sensitive files. Higher levels require deep scan."
              />

              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-sm">
                  {{ $t("security.components.DLPPolicyDialog.a66b89") }}
                </div>
                <q-select
                  v-model="form.keywords"
                  :label="$t('security.components.DLPPolicyDialog.da4cc5')"
                  outlined
                  dense
                  use-input
                  use-chips
                  multiple
                  input-debounce="0"
                  @new-value="(val, done) => done(val.trim(), 'add-unique')"
                  :hint="$t('security.components.DLPPolicyDialog.d2eb37')"
                />
              </div>

              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-sm">
                  {{ $t("security.components.DLPPolicyDialog.10fd5c") }}
                </div>
                <div
                  v-for="(pat, i) in form.custom_patterns"
                  :key="i"
                  class="row q-gutter-xs q-mb-xs"
                >
                  <q-input
                    v-model="form.custom_patterns[i]"
                    outlined
                    dense
                    class="col"
                    :label="`Pattern ${i + 1}`"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    @click="form.custom_patterns.splice(i, 1)"
                  />
                </div>
                <q-btn
                  flat
                  dense
                  icon="add"
                  :label="$t('security.components.DLPPolicyDialog.cca239')"
                  color="primary"
                  @click="form.custom_patterns.push('')"
                />
              </div>
            </q-tab-panel>

            <!-- Paths -->
            <q-tab-panel name="paths">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                Folders and files to monitor
              </div>
              <q-banner
                dense
                class="bg-blue-1 text-blue-10 q-mb-md rounded-borders"
              >
                <template v-slot:avatar
                  ><q-icon name="folder_open" color="primary"
                /></template>
                Enter folders like C:\12 for recursive monitoring. A specific
                file path like C:\12\pass.txt is accepted; the agent watches its
                parent folder and matches that file.
              </q-banner>

              <q-toggle
                v-model="form.monitor_cloud_sync"
                color="primary"
                class="q-mb-md"
                :label="$t('security.components.DLPPolicyDialog.e6e638')"
              />

              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-sm">
                  Watched folders or files (empty = default user folders)
                </div>
                <div
                  v-for="(p, i) in form.monitored_paths"
                  :key="`mp-${i}`"
                  class="row q-gutter-xs q-mb-xs"
                >
                  <q-input
                    v-model="form.monitored_paths[i]"
                    outlined
                    dense
                    class="col"
                    :label="`Watch path ${i + 1}`"
                    placeholder="C:\12 or C:\12\pass.txt"
                    :hint="monitorPathHint(p)"
                    :color="looksLikeFilePath(p) ? 'warning' : 'primary'"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    @click="form.monitored_paths.splice(i, 1)"
                  />
                </div>
                <q-btn
                  flat
                  dense
                  icon="add"
                  :label="$t('security.components.DLPPolicyDialog.979ddc')"
                  color="primary"
                  @click="form.monitored_paths.push('')"
                />
              </div>

              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-sm">
                  {{ $t("security.components.DLPPolicyDialog.b2333a") }}
                </div>
                <div
                  v-for="(p, i) in form.excluded_paths"
                  :key="`ep-${i}`"
                  class="row q-gutter-xs q-mb-xs"
                >
                  <q-input
                    v-model="form.excluded_paths[i]"
                    outlined
                    dense
                    class="col"
                    :label="`Excluded ${i + 1}`"
                    placeholder="C:\12\temp or C:\12\ignore.txt"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    @click="form.excluded_paths.splice(i, 1)"
                  />
                </div>
                <q-btn
                  flat
                  dense
                  icon="add"
                  :label="$t('security.components.DLPPolicyDialog.690626')"
                  color="primary"
                  @click="form.excluded_paths.push('')"
                />
              </div>
            </q-tab-panel>

            <!-- Actions -->
            <q-tab-panel name="actions">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                {{ $t("security.components.DLPPolicyDialog.72c416") }}
              </div>

              <q-select
                v-model="form.block_mode"
                :options="blockModeOptions"
                :label="$t('security.components.DLPPolicyDialog.e119b0')"
                outlined
                dense
                emit-value
                map-options
                class="q-mb-lg"
              />

              <q-banner
                v-if="form.block_mode === 'block'"
                dense
                class="bg-orange-1 q-mb-md rounded-borders"
              >
                <template v-slot:avatar
                  ><q-icon name="warning" color="orange"
                /></template>
                {{ $t("security.components.DLPPolicyDialog.9f6e7f") }}
              </q-banner>

              <div class="column q-gutter-sm q-mb-lg">
                <q-toggle
                  v-model="form.justification_required"
                  color="warning"
                  :label="$t('security.components.DLPPolicyDialog.48f667')"
                />
                <q-toggle
                  v-model="form.alert_on_violation"
                  color="negative"
                  :label="$t('security.components.DLPPolicyDialog.c2fd18')"
                />
                <q-toggle
                  v-model="form.log_violations"
                  color="info"
                  :label="$t('security.components.DLPPolicyDialog.41bffc')"
                />
                <q-toggle
                  v-model="form.auto_encrypt"
                  color="secondary"
                  :label="$t('security.components.DLPPolicyDialog.86e0a6')"
                />
                <q-toggle
                  v-model="form.auto_quarantine"
                  color="negative"
                  :label="$t('security.components.DLPPolicyDialog.d346c4')"
                />
              </div>

              <div class="text-caption text-grey-7 q-mb-sm">
                {{ $t("security.components.DLPPolicyDialog.c525ff") }}
              </div>
              <div class="column q-gutter-sm">
                <q-toggle
                  v-model="form.block_usb_transfer"
                  color="negative"
                  :label="$t('security.components.DLPPolicyDialog.3d9549')"
                />
                <q-toggle
                  v-model="form.block_email_attachment"
                  color="negative"
                  :label="$t('security.components.DLPPolicyDialog.9b8e14')"
                />
                <q-toggle
                  v-model="form.block_cloud_upload"
                  color="negative"
                  :label="$t('security.components.DLPPolicyDialog.03eb1a')"
                />
              </div>
            </q-tab-panel>

            <!-- Network DLP -->
            <q-tab-panel name="network">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                {{ $t("security.components.DLPPolicyDialog.34d998") }}
              </div>

              <q-banner dense class="bg-blue-1 q-mb-md rounded-borders">
                <template v-slot:avatar
                  ><q-icon name="info" color="blue"
                /></template>
                Network DLP intercepts HTTPS uploads via mitmproxy proxy on the
                endpoint. Requires CA certificate deployment via GPO.
              </q-banner>

              <q-toggle
                v-model="form.network_dlp_enabled"
                color="primary"
                class="q-mb-md"
                :label="$t('security.components.DLPPolicyDialog.88b278')"
              />

              <template v-if="form.network_dlp_enabled">
                <q-toggle
                  v-model="form.network_fail_closed"
                  color="negative"
                  class="q-mb-sm"
                  label="Fail-closed if proxy is unavailable"
                />
                <div class="text-caption text-grey-7 q-mb-md">
                  Keep web traffic pinned to the local DLP proxy when Network DLP
                  cannot start or proxy settings are tampered with.
                </div>
                <div class="text-caption text-grey-7 q-mb-sm">
                  {{ $t("security.components.DLPPolicyDialog.4cb444") }}
                </div>
                <div
                  v-for="(d, i) in form.blocked_domains"
                  :key="`bd-${i}`"
                  class="row q-gutter-xs q-mb-xs"
                >
                  <q-input
                    v-model="form.blocked_domains[i]"
                    outlined
                    dense
                    class="col"
                    :label="`Domain ${i + 1}`"
                    :placeholder="
                      $t('security.components.DLPPolicyDialog.3df354')
                    "
                  />
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    @click="form.blocked_domains.splice(i, 1)"
                  />
                </div>
                <q-btn
                  flat
                  dense
                  icon="add"
                  :label="$t('security.components.DLPPolicyDialog.074977')"
                  color="primary"
                  @click="form.blocked_domains.push('')"
                />
              </template>
            </q-tab-panel>

            <!-- Email DLP -->
            <q-tab-panel name="email">
              <div class="text-subtitle1 q-mb-md text-weight-medium">
                {{ $t("security.components.DLPPolicyDialog.1f248b") }}
              </div>

              <q-banner dense class="bg-blue-1 q-mb-md rounded-borders">
                <template v-slot:avatar
                  ><q-icon name="info" color="blue"
                /></template>
                Email DLP uses the internal MDM scan flow for outgoing message
                bodies and attachments. No Microsoft Graph tenant is required
                for this policy mode.
              </q-banner>

              <q-toggle
                v-model="form.email_dlp_enabled"
                color="primary"
                class="q-mb-md"
                :label="$t('security.components.DLPPolicyDialog.0f52e4')"
              />

              <template v-if="form.email_dlp_enabled">
                <q-select
                  v-model="form.email_dlp_action"
                  :options="emailDLPActionOptions"
                  label="Delivery action"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="q-mb-md"
                />
                <q-toggle
                  v-model="form.email_external_only"
                  color="primary"
                  class="q-mb-md"
                  label="Apply only to external recipients"
                />
                <q-select
                  v-model="form.email_corporate_domains"
                  label="Corporate domains"
                  hint="Used to decide whether recipients are external"
                  outlined
                  dense
                  use-input
                  use-chips
                  multiple
                  input-debounce="0"
                  class="q-mb-md"
                  @new-value="(val, done) => done(normalizeDomain(val), 'add-unique')"
                />
                <q-select
                  v-model="form.email_quarantine_recipients"
                  label="Quarantine recipients"
                  hint="Messages are sent here when action is Quarantine"
                  outlined
                  dense
                  use-input
                  use-chips
                  multiple
                  input-debounce="0"
                  class="q-mb-md"
                  @new-value="(val, done) => done(val.trim(), 'add-unique')"
                />
                <q-separator class="q-my-md" />
                <div class="text-subtitle2 q-mb-sm">SMTP relay delivery</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-8">
                    <q-input
                      v-model="form.email_smtp_host"
                      label="SMTP host"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model.number="form.email_smtp_port"
                      label="SMTP port"
                      type="number"
                      outlined
                      dense
                      min="1"
                      max="65535"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.email_smtp_username"
                      label="SMTP username"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.email_smtp_password"
                      label="SMTP password"
                      type="password"
                      outlined
                      dense
                      :hint="
                        form.email_smtp_password_set
                          ? 'Password saved; leave blank to keep it'
                          : ''
                      "
                    />
                  </div>
                  <div class="col-12 col-md-8">
                    <q-input
                      v-model="form.email_smtp_from_email"
                      label="Envelope from"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-toggle
                      v-model="form.email_smtp_use_tls"
                      color="primary"
                      label="Use STARTTLS"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle
                      v-model="form.email_agent_relay_enabled"
                      color="primary"
                      label="Enable Windows agent relay"
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-input
                      v-model.number="form.email_agent_relay_port"
                      label="Agent relay port"
                      type="number"
                      outlined
                      dense
                      min="1"
                      max="65535"
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-toggle
                      v-model="form.email_block_direct_smtp"
                      color="negative"
                      label="Block direct SMTP"
                    />
                  </div>
                </div>
                <q-btn
                  outline
                  color="primary"
                  icon="science"
                  label="Open Email DLP test"
                  @click="$emit('open-email-test')"
                  class="q-mt-sm"
                />
              </template>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          :label="$t('security.components.DLPPolicyDialog.77dfd2')"
          @click="$emit('close')"
        />
        <q-btn
          color="primary"
          :label="isEdit ? 'Save Changes' : 'Create Policy'"
          :loading="saving"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const props = defineProps<{
  modelValue: boolean;
  item?: Record<string, any> | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
  (e: "open-email-test"): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: () => emit("close"),
});

const isEdit = computed(() => !!props.item?.id);
const tab = ref("general");
const saving = ref(false);

const defaultForm = () => ({
  name: "",
  enabled: true,
  scope: "global",
  target_agent_id: "",
  target_device_group_id: null,
  target_user_id: null,
  target_user_group_id: null,
  // Detection
  detect_pii: true,
  detect_credentials: true,
  keywords: [] as string[],
  custom_patterns: [] as string[],
  classification_level: "any",
  // Paths
  monitored_paths: [] as string[],
  excluded_paths: [] as string[],
  monitor_cloud_sync: true,
  // Actions
  block_mode: "monitor",
  justification_required: false,
  alert_on_violation: true,
  log_violations: true,
  auto_encrypt: false,
  auto_quarantine: false,
  block_usb_transfer: false,
  block_email_attachment: false,
  block_cloud_upload: false,
  // Network
  network_dlp_enabled: false,
  network_fail_closed: false,
  blocked_domains: [] as string[],
  // Email
  email_dlp_enabled: false,
  email_dlp_action: "inherit",
  email_external_only: true,
  email_corporate_domains: [] as string[],
  email_quarantine_recipients: [] as string[],
  email_smtp_host: "",
  email_smtp_port: 587,
  email_smtp_username: "",
  email_smtp_password: "",
  email_smtp_password_set: false,
  email_smtp_from_email: "",
  email_smtp_use_tls: true,
  email_agent_relay_enabled: false,
  email_agent_relay_port: 2525,
  email_block_direct_smtp: false,
});

const form = ref(defaultForm());

watch(
  () => props.item,
  (item) => {
    if (item) {
      form.value = {
        ...defaultForm(),
        ...item,
        custom_patterns: Array.isArray(item.custom_patterns)
          ? [...item.custom_patterns]
          : [],
        keywords: Array.isArray(item.keywords) ? [...item.keywords] : [],
        monitored_paths: Array.isArray(item.monitored_paths)
          ? [...item.monitored_paths]
          : [],
        excluded_paths: Array.isArray(item.excluded_paths)
          ? [...item.excluded_paths]
          : [],
        blocked_domains: Array.isArray(item.blocked_domains)
          ? [...item.blocked_domains]
          : [],
        email_corporate_domains: Array.isArray(item.email_corporate_domains)
          ? [...item.email_corporate_domains]
          : [],
        email_quarantine_recipients: Array.isArray(
          item.email_quarantine_recipients,
        )
          ? [...item.email_quarantine_recipients]
          : [],
        email_smtp_password: "",
        email_smtp_password_set: Boolean(item.email_smtp_password_set),
      };
    } else {
      form.value = defaultForm();
    }
    tab.value = "general";
  },
  { immediate: true },
);

async function save() {
  if (!form.value.name.trim()) {
    $q.notify({ type: "negative", message: "Policy name is required" });
    return;
  }
  const scopeError = scopedTargetError(form.value);
  if (scopeError) {
    $q.notify({ type: "warning", message: scopeError });
    return;
  }
  saving.value = true;
  try {
    // Clean empty strings from arrays
    const payload: any = {
      ...form.value,
      custom_patterns: form.value.custom_patterns
        .map((p) => p.trim())
        .filter(Boolean),
      monitored_paths: form.value.monitored_paths
        .map((p) => p.trim())
        .filter(Boolean),
      excluded_paths: form.value.excluded_paths
        .map((p) => p.trim())
        .filter(Boolean),
      blocked_domains: form.value.blocked_domains
        .map((d) => d.trim())
        .filter(Boolean),
      email_corporate_domains: form.value.email_corporate_domains
        .map((d) => normalizeDomain(d))
        .filter(Boolean),
      email_quarantine_recipients: form.value.email_quarantine_recipients
        .map((d) => d.trim())
        .filter(Boolean),
      email_smtp_host: form.value.email_smtp_host.trim(),
      email_smtp_port: Number(form.value.email_smtp_port || 587),
      email_smtp_username: form.value.email_smtp_username.trim(),
      email_smtp_password: form.value.email_smtp_password,
      email_smtp_from_email: form.value.email_smtp_from_email.trim(),
      email_smtp_use_tls: Boolean(form.value.email_smtp_use_tls),
      network_fail_closed: Boolean(form.value.network_fail_closed),
      email_agent_relay_enabled: Boolean(form.value.email_agent_relay_enabled),
      email_agent_relay_port: Number(form.value.email_agent_relay_port || 2525),
      email_block_direct_smtp: Boolean(form.value.email_block_direct_smtp),
    };
    if (!payload.email_smtp_password) {
      delete payload.email_smtp_password;
    }
    normalizeScopedPayload(payload);
    const filePathCount = payload.monitored_paths.filter((p: string) =>
      looksLikeFilePath(p),
    ).length;
    if (isEdit.value) {
      await axios.put(`/security/dlp/${props.item!.id}/`, payload);
      $q.notify({
        type: "positive",
        message: dlpSaveMessage("updated", filePathCount),
      });
    } else {
      await axios.post("/security/dlp/", payload);
      $q.notify({
        type: "positive",
        message: dlpSaveMessage("created", filePathCount),
      });
    }
    emit("saved");
    emit("close");
  } catch (e: any) {
    $q.notify({
      type: "negative",
      message: `Save failed: ${e?.response?.data?.non_field_errors?.[0] || e.message}`,
    });
  } finally {
    saving.value = false;
  }
}

const scopeOptions = [
  { label: "Global (all devices)", value: "global" },
  { label: "Device", value: "device" },
  { label: "Device Group", value: "device_group" },
  { label: "Specific User", value: "user" },
  { label: "User Group", value: "user_group" },
];

const scopeAgentAllOptions = ref<{ label: string; value: string }[]>([]);
const scopeDeviceGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeUserGroupAllOptions = ref<{ label: string; value: number }[]>([]);
const scopeAgentNeedle = ref("");
const scopeDeviceGroupNeedle = ref("");
const scopeUserNeedle = ref("");
const scopeUserGroupNeedle = ref("");

function filteredTargetOptions<
  T extends { label: string; value: string | number },
>(rows: T[], needle: string): T[] {
  const q = String(needle || "")
    .trim()
    .toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (row) =>
      String(row.label).toLowerCase().includes(q) ||
      String(row.value).toLowerCase().includes(q),
  );
}

const scopeAgentOptions = computed(() =>
  filteredTargetOptions(scopeAgentAllOptions.value, scopeAgentNeedle.value),
);
const scopeDeviceGroupOptions = computed(() =>
  filteredTargetOptions(
    scopeDeviceGroupAllOptions.value,
    scopeDeviceGroupNeedle.value,
  ),
);
const scopeUserOptions = computed(() =>
  filteredTargetOptions(scopeUserAllOptions.value, scopeUserNeedle.value),
);
const scopeUserGroupOptions = computed(() =>
  filteredTargetOptions(
    scopeUserGroupAllOptions.value,
    scopeUserGroupNeedle.value,
  ),
);

function filterScopeAgents(value: string, update: (fn: () => void) => void) {
  update(() => {
    scopeAgentNeedle.value = value || "";
  });
}

function filterScopeDeviceGroups(
  value: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    scopeDeviceGroupNeedle.value = value || "";
  });
}

function filterScopeUsers(value: string, update: (fn: () => void) => void) {
  update(() => {
    scopeUserNeedle.value = value || "";
  });
}

function filterScopeUserGroups(
  value: string,
  update: (fn: () => void) => void,
) {
  update(() => {
    scopeUserGroupNeedle.value = value || "";
  });
}

function normalizeScopedPayload(payload: any) {
  if (payload.scope !== "device") payload.target_agent_id = "";
  if (payload.scope !== "device_group") payload.target_device_group_id = null;
  if (payload.scope !== "user") payload.target_user_id = null;
  if (payload.scope !== "user_group") payload.target_user_group_id = null;
  for (const key of [
    "target_device_group_id",
    "target_user_id",
    "target_user_group_id",
  ]) {
    if (payload[key] === "" || payload[key] === undefined) payload[key] = null;
  }
}

function scopedTargetError(row: any) {
  if (row.scope === "device" && !row.target_agent_id)
    return "Select a target device";
  if (row.scope === "device_group" && !row.target_device_group_id)
    return "Select a target device group";
  if (row.scope === "user" && !row.target_user_id)
    return "Select a target user";
  if (row.scope === "user_group" && !row.target_user_group_id)
    return "Select a target user group";
  return "";
}

function looksLikeFilePath(path: string) {
  const value = String(path || "")
    .trim()
    .replace(/[\\/]+$/, "");
  if (!value) return false;
  const name = value.split(/[\\/]/).pop() || "";
  return /\.[A-Za-z0-9]{1,12}$/.test(name);
}

function monitorPathHint(path: string) {
  if (looksLikeFilePath(path)) {
    return "Specific file: the agent watches the parent folder and matches this file.";
  }
  return "Folder is watched recursively. Example: C:\\12";
}

function dlpSaveMessage(action: "created" | "updated", filePathCount: number) {
  const fileNote = filePathCount
    ? ` ${filePathCount} file path(s) will be watched through parent folders.`
    : "";
  return `DLP policy ${action}. Agents refresh watcher paths automatically within about 60 seconds.${fileNote}`;
}

function onScopeChange(scope: string) {
  const nextScope = scope || "global";
  form.value.scope = nextScope;
  const payload = form.value as any;
  payload.target_agent_id = "";
  payload.target_device_group_id = null;
  payload.target_user_id = null;
  payload.target_user_group_id = null;
}

async function loadScopeTargetOptions() {
  const [agentsResp, sitesResp, usersResp, groupsResp] =
    await Promise.allSettled([
      axios.get("/agents/", { params: { detail: "false" } }),
      axios.get("/clients/sites/?leaf=true"),
      axios.get("/accounts/users/"),
      axios.get("/accounts/user-groups/"),
    ]);

  if (agentsResp.status === "fulfilled") {
    const list = Array.isArray(agentsResp.value.data)
      ? agentsResp.value.data
      : (agentsResp.value.data?.results ?? []);
    scopeAgentAllOptions.value = list
      .filter((agent: any) => agent?.agent_id)
      .map((agent: any) => ({
        value: agent.agent_id,
        label: `${agent.hostname || agent.description || agent.agent_id} (${agent.agent_id})`,
      }));
  }

  if (sitesResp.status === "fulfilled") {
    const list = Array.isArray(sitesResp.value.data)
      ? sitesResp.value.data
      : (sitesResp.value.data?.results ?? []);
    scopeDeviceGroupAllOptions.value = list
      .filter((site: any) => site?.id !== undefined && site?.id !== null)
      .map((site: any) => ({
        value: site.id,
        label: site.ancestors
          ? `${site.ancestors} / ${site.name}`
          : site.name || `Device group #${site.id}`,
      }));
  }

  if (usersResp.status === "fulfilled") {
    const list = Array.isArray(usersResp.value.data)
      ? usersResp.value.data
      : (usersResp.value.data?.results ?? []);
    scopeUserAllOptions.value = list
      .filter((user: any) => user?.id !== undefined && user?.id !== null)
      .map((user: any) => ({
        value: user.id,
        label:
          user.display_name ||
          user.full_name ||
          user.username ||
          user.sam_account_name ||
          user.email ||
          `User #${user.id}`,
      }));
  }

  if (groupsResp.status === "fulfilled") {
    const list = Array.isArray(groupsResp.value.data)
      ? groupsResp.value.data
      : (groupsResp.value.data?.results ?? []);
    scopeUserGroupAllOptions.value = list
      .filter((group: any) => group?.id !== undefined && group?.id !== null)
      .map((group: any) => ({
        value: group.id,
        label:
          group.display_name ||
          group.name ||
          group.sam_account_name ||
          `User group #${group.id}`,
      }));
  }
}

watch(
  open,
  (value) => {
    if (
      value &&
      (!scopeAgentAllOptions.value.length ||
        !scopeDeviceGroupAllOptions.value.length)
    ) {
      loadScopeTargetOptions().catch(() => {
        $q.notify({
          type: "warning",
          message: "Could not load DLP target selectors",
        });
      });
    }
  },
  { immediate: true },
);

const classificationOptions = [
  { label: "Any (monitor all sensitive files)", value: "any" },
  { label: "Confidential", value: "confidential" },
  { label: "Secret (deep scan required)", value: "secret" },
];

const blockModeOptions = [
  { label: "Monitor only (log + alert, no blocking)", value: "monitor" },
  { label: "Warn + Allow (alert user, action proceeds)", value: "warn" },
  { label: "Block (deny action or require justification)", value: "block" },
];

const emailDLPActionOptions = [
  { label: "Use policy action", value: "inherit" },
  { label: "Monitor only", value: "monitor" },
  { label: "Block delivery", value: "block" },
  { label: "Quarantine", value: "quarantine" },
];

function normalizeDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^@+/, "");
}
</script>
