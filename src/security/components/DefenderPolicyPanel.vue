<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-sm">{{ $t('security.components.DefenderPolicyPanel.deff6c') }}</div>
    <div class="text-caption text-grey q-mb-lg">
      {{ $t('security.components.DefenderPolicyPanel.284fd1') }}
    </div>

    <!-- Policy list + form -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2">Policies ({{ policies.length }})</div>
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
                  <q-item-label caption>
                    {{ p.realtime_protection ? '🛡 RT ON' : '○ RT OFF' }}
                    · {{ p.scope }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="delete" size="xs" color="negative"
                    @click.stop="deletePolicy(p.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="policies.length === 0">
                <q-item-section class="text-grey text-center text-caption">{{ $t('security.components.DefenderPolicyPanel.7e20a6') }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Editor -->
      <div class="col-12 col-md-8" v-if="selectedPolicy">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-md">Edit: {{ selectedPolicy.name }}</div>

            <q-form @submit.prevent="savePolicy" class="q-gutter-sm">

              <!-- Basic info -->
              <q-input v-model="form.name" :label="$t('security.components.DefenderPolicyPanel.7cf3cf')" outlined dense />
              <q-select v-model="form.scope" :options="scopeOptions" :label="$t('security.components.DefenderPolicyPanel.4651a3')" outlined dense emit-value map-options />

              <!-- Real-time -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="shield" color="primary" /></template>
                <strong>{{ $t('security.components.DefenderPolicyPanel.babea5') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.realtime_protection" :label="$t('security.components.DefenderPolicyPanel.ba3cee')" dense />
                <q-toggle v-model="form.cloud_delivered" :label="$t('security.components.DefenderPolicyPanel.3c6074')" dense />
                <q-toggle v-model="form.block_pua" :label="$t('security.components.DefenderPolicyPanel.2b213c')" dense />
                <q-toggle v-model="form.behavior_monitoring" :label="$t('security.components.DefenderPolicyPanel.0b77fc')" dense />
                <q-toggle v-model="form.script_scan" :label="$t('security.components.DefenderPolicyPanel.bf98e7')" dense />
                <q-toggle v-model="form.controlled_folder_access" :label="$t('security.components.DefenderPolicyPanel.341f54')" dense />
              </div>

              <!-- Exploit Guard -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="security" color="primary" /></template>
                <strong>Exploit Guard</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-select v-model="form.network_protection_mode" :options="networkProtectionOptions" label="Network protection" outlined dense emit-value map-options style="min-width:180px" />
                <q-input v-model="form.asr_rules_text" label="Attack Surface Reduction rules" outlined dense type="textarea" rows="3"
                  class="col"
                  hint="One rule per line: GUID=disabled|audit|warn|block. Use audit for safe acceptance tests." />
              </div>

              <!-- Firewall -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="local_fire_department" color="primary" /></template>
                <strong>Windows Firewall</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.firewall_domain_enabled" label="Domain profile" dense />
                <q-toggle v-model="form.firewall_private_enabled" label="Private profile" dense />
                <q-toggle v-model="form.firewall_public_enabled" label="Public profile" dense />
                <q-select v-model="form.firewall_default_inbound" :options="firewallDefaultOptions" label="Default inbound" outlined dense emit-value map-options style="min-width:150px" />
                <q-select v-model="form.firewall_default_outbound" :options="firewallDefaultOptions" label="Default outbound" outlined dense emit-value map-options style="min-width:150px" />
              </div>
              <q-input v-model="form.firewall_rules_text" label="Managed firewall rules" outlined dense type="textarea" rows="3"
                hint="One JSON object per line: {&quot;name&quot;:&quot;Test&quot;,&quot;direction&quot;:&quot;inbound&quot;,&quot;action&quot;:&quot;block&quot;,&quot;protocol&quot;:&quot;TCP&quot;,&quot;local_port&quot;:&quot;65534&quot;,&quot;enabled&quot;:true}" />

              <!-- Scan -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="radar" color="primary" /></template>
                <strong>{{ $t('security.components.DefenderPolicyPanel.e230f6') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-select v-model="form.quick_scan_schedule" :options="scanOptions" :label="$t('security.components.DefenderPolicyPanel.081824')" outlined dense emit-value map-options style="min-width:140px" />
                <q-select v-model="form.full_scan_schedule" :options="scanOptions" :label="$t('security.components.DefenderPolicyPanel.089fc1')" outlined dense emit-value map-options style="min-width:140px" />
                <q-toggle v-model="form.scan_removable_drive" :label="$t('security.components.DefenderPolicyPanel.e7b61b')" dense />
                <q-toggle v-model="form.scan_network_drives" :label="$t('security.components.DefenderPolicyPanel.1f9025')" dense />
              </div>

              <!-- Exclusions -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="folder_open" color="primary" /></template>
                <strong>{{ $t('security.components.DefenderPolicyPanel.54a8d5') }}</strong>
              </q-banner>
              <q-input v-model="form.path_exclusions" :label="$t('security.components.DefenderPolicyPanel.773055')" outlined dense type="textarea" rows="2"
                :hint="$t('security.components.DefenderPolicyPanel.d58833')" />
              <q-input v-model="form.extension_exclusions" :label="$t('security.components.DefenderPolicyPanel.97be98')" outlined dense type="textarea" rows="1" />
              <q-input v-model="form.process_exclusions" :label="$t('security.components.DefenderPolicyPanel.35eead')" outlined dense type="textarea" rows="1" />

              <!-- Updates -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="update" color="primary" /></template>
                <strong>{{ $t('security.components.DefenderPolicyPanel.344d4f') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.disable_signature_update" :label="$t('security.components.DefenderPolicyPanel.e74575')" dense />
                <q-input v-model.number="form.signature_update_hours" :label="$t('security.components.DefenderPolicyPanel.885cbf')" type="number" outlined dense style="width:160px" :disable="form.disable_signature_update" />
              </div>

              <!-- Notifications -->
              <q-banner class="bg-blue-1 q-mt-sm" rounded>
                <template v-slot:avatar><q-icon name="email" color="primary" /></template>
                <strong>{{ $t('security.components.DefenderPolicyPanel.d0efe0') }}</strong>
              </q-banner>
              <div class="row q-gutter-sm">
                <q-toggle v-model="form.email_alert_on_detection" :label="$t('security.components.DefenderPolicyPanel.c71117')" dense />
                <q-input v-model="form.admin_email" :label="$t('security.components.DefenderPolicyPanel.f0fee7')" outlined dense style="min-width:200px" />
              </div>

              <q-toggle v-model="form.enabled" :label="$t('security.components.DefenderPolicyPanel.48ff2e')" dense color="positive" />

              <q-btn type="submit" color="primary" :label="$t('security.components.DefenderPolicyPanel.de525b')" :loading="saving" class="q-mt-sm" />
              <q-btn type="button" color="teal" :label="$t('security.components.DefenderPolicyPanel.281560')" :loading="deploying" @click="deployPolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
              <q-btn type="button" color="warning" icon="undo" label="Revoke from devices" :loading="revoking" @click="revokePolicy"
                v-if="selectedPolicy.id" class="q-mt-sm q-ml-sm" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8" v-else>
        <q-banner class="bg-grey-1" rounded>
          <q-icon name="info" class="q-mr-sm" />{{ $t('security.components.DefenderPolicyPanel.78d0a3') }}
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const policies = ref<any[]>([]);
const selectedPolicy = ref<any>(null);
const saving = ref(false);
const deploying = ref(false);
const revoking = ref(false);

const defaultForm = () => ({
  name: "", description: "", scope: "global",
  realtime_protection: true, cloud_delivered: true, block_pua: true,
  behavior_monitoring: true, script_scan: true, controlled_folder_access: false,
  network_protection_mode: "audit", asr_rules: [] as any[], asr_rules_text: "",
  firewall_domain_enabled: true, firewall_private_enabled: true, firewall_public_enabled: true,
  firewall_default_inbound: "block", firewall_default_outbound: "allow",
  firewall_rules: [] as any[], firewall_rules_text: "",
  quick_scan_schedule: "weekly", full_scan_schedule: "weekly",
  scan_removable_drive: true, scan_network_drives: false,
  path_exclusions: "", extension_exclusions: "", process_exclusions: "",
  disable_signature_update: false, signature_update_hours: 8,
  email_alert_on_detection: true, admin_email: "",
  enabled: true,
});

const form = reactive(defaultForm());

const scopeOptions = [
  { label: "Global", value: "global" },
  { label: "Device Group", value: "group" },
  { label: "User", value: "user" },
];

const scanOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Disabled", value: "disabled" },
];

const networkProtectionOptions = [
  { label: "Disabled", value: "disabled" },
  { label: "Audit", value: "audit" },
  { label: "Enabled", value: "enabled" },
];

const firewallDefaultOptions = [
  { label: "Allow", value: "allow" },
  { label: "Block", value: "block" },
];

async function loadPolicies() {
  try {
    policies.value = (await axios.get("/security/defender-policies/")).data;
  } catch (e) {
    $q.notify({ message: "Failed to load policies", color: "negative" });
  }
}

function selectPolicy(p: any) {
  selectedPolicy.value = p;
  Object.assign(form, defaultForm(), p);
  // Parse JSON fields back to text lines
  if (form.path_exclusions && Array.isArray(form.path_exclusions))
    form.path_exclusions = (form.path_exclusions as string[]).join("\n");
  if (form.extension_exclusions && Array.isArray(form.extension_exclusions))
    form.extension_exclusions = (form.extension_exclusions as string[]).join("\n");
  if (form.process_exclusions && Array.isArray(form.process_exclusions))
    form.process_exclusions = (form.process_exclusions as string[]).join("\n");
  form.asr_rules_text = Array.isArray(p.asr_rules)
    ? p.asr_rules.map((r: any) => `${r.id || ""}=${r.action || "audit"}`).join("\n")
    : "";
  form.firewall_rules_text = Array.isArray(p.firewall_rules)
    ? p.firewall_rules.map((r: any) => JSON.stringify(r)).join("\n")
    : "";
}

function showCreate() {
  selectedPolicy.value = { id: null };
  Object.assign(form, defaultForm());
}

async function savePolicy() {
  saving.value = true;
  try {
    const payload = { ...form };
    // Convert text lines back to JSON arrays
    payload.path_exclusions = form.path_exclusions ? form.path_exclusions.split("\n").filter((l: string) => l.trim()) : [];
    payload.extension_exclusions = form.extension_exclusions ? form.extension_exclusions.split("\n").filter((l: string) => l.trim()) : [];
    payload.process_exclusions = form.process_exclusions ? form.process_exclusions.split("\n").filter((l: string) => l.trim()) : [];
    payload.asr_rules = form.asr_rules_text
      ? form.asr_rules_text.split("\n").map((line: string) => {
          const [id, action = "audit"] = line.split("=");
          return { id: id.trim(), action: action.trim().toLowerCase() };
        }).filter((r: any) => r.id)
      : [];
    payload.firewall_rules = form.firewall_rules_text
      ? form.firewall_rules_text.split("\n").map((line: string) => JSON.parse(line)).filter((r: any) => r.name)
      : [];
    delete payload.asr_rules_text;
    delete payload.firewall_rules_text;

    if (selectedPolicy.value?.id) {
      await axios.put(`/security/defender-policies/${selectedPolicy.value.id}/`, payload);
    } else {
      const resp = await axios.post("/security/defender-policies/", payload);
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
    await axios.post(`/security/defender-policies/${selectedPolicy.value.id}/deploy/`);
    $q.notify({ message: "Deploy initiated — agents will receive policy", color: "positive", icon: "send" });
  } catch {
    $q.notify({ message: "Deploy failed", color: "negative" });
  } finally {
    deploying.value = false;
  }
}

async function revokePolicy() {
  if (!selectedPolicy.value?.id) return;
  $q.dialog({
    title: "Revoke Defender policy?",
    message: "This will remove the Defender policy from matching Windows agents and disable this policy record.",
    cancel: true,
    ok: { color: "warning", label: "Revoke" },
  }).onOk(async () => {
    revoking.value = true;
    try {
      const resp = await axios.post(`/security/defender-policies/${selectedPolicy.value.id}/revoke/`, { wait: true });
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
    title: "Delete Policy?", message: "This cannot be undone.",
    cancel: true, ok: { color: "negative", label: "Delete" },
  });
  await axios.delete(`/security/defender-policies/${id}/`);
  if (selectedPolicy.value?.id === id) selectedPolicy.value = null;
  await loadPolicies();
}

onMounted(loadPolicies);
</script>
