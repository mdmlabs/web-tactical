<template>
  <q-dialog v-model="open" persistent>
    <q-card style="min-width: 560px; max-width: 90vw">
      <q-bar>
        <span>{{ editingReq ? "Edit Requirement" : "New Requirement" }} — {{ level?.name }}</span>
        <q-space /><q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <q-card-section class="q-gutter-md">
        <q-input v-model="form.name" :label="$t('compliance.components.RequirementsEditorDialog.d145bb')" outlined dense />
        <q-input v-model="form.description" :label="$t('compliance.components.RequirementsEditorDialog.55f8eb')" outlined dense />
        <div class="row q-col-gutter-sm">
          <q-select
            v-model="form.severity"
            :options="severityOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.de314f')"
            outlined dense emit-value map-options
            class="col-6"
          />
          <q-select
            v-model="form.source_type"
            :options="sourceTypeOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.f7d8c9')"
            outlined dense emit-value map-options
            class="col-6"
            @update:model-value="onSourceTypeChange"
          />
        </div>

        <!-- source_key based on source_type -->
        <template v-if="form.source_type === 'compliance_check'">
          <q-select
            v-model="form.source_key"
            :options="complianceCheckKeyOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.2a4c8a')"
            outlined dense emit-value map-options
          />
        </template>
        <template v-else-if="form.source_type === 'security_baseline'">
          <q-select
            v-model="form.source_key"
            :options="baselineKeyOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.48ce34')"
            outlined dense emit-value map-options
          />
        </template>
        <template v-else-if="form.source_type === 'security_task'">
          <q-select
            v-model="form.source_key"
            :options="securityTaskOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.af3bb3')"
            outlined dense emit-value map-options
          />
        </template>
        <template v-else-if="form.source_type === 'custom_script'">
          <q-input v-model="form.source_key" :label="$t('compliance.components.RequirementsEditorDialog.fee7a3')" outlined dense />
          <q-separator />
          <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.RequirementsEditorDialog.e866ef') }}</div>
          <q-input
            v-model="ruleDefinitionText"
            type="textarea"
            outlined dense
            :rows="4"
            placeholder='{"kind": "custom_script", "expected_output": "compliant", "script_args": []}'
          />
        </template>
        <template v-else-if="form.source_type === 'wazuh_sca'">
          <q-banner
            v-if="wazuhPolicyBanner"
            dense
            rounded
            class="bg-grey-2 text-dark q-mb-sm"
          >
            {{ wazuhPolicyBanner }}
          </q-banner>
          <q-select
            v-model="wazuhRule.policy_id"
            :options="wazuhPolicyOptions"
            :label="$t('compliance.components.RequirementsEditorDialog.34df5d')"
            outlined dense emit-value map-options use-input input-debounce="0"
            :loading="loadingWazuhPolicies"
            @focus="loadWazuhPolicies"
            @new-value="handleNewWazuhPolicy"
          />
          <q-input
            v-model.number="wazuhRule.required_pass_rate_percent"
            :label="$t('compliance.components.RequirementsEditorDialog.838ef7')"
            type="number"
            min="0"
            max="100"
            outlined dense
          />
          <div class="text-caption text-grey">
            {{ $t('compliance.components.RequirementsEditorDialog.a325b5') }}
          </div>
        </template>
        <template v-else>
          <q-input v-model="form.source_key" :label="$t('compliance.components.RequirementsEditorDialog.64d406')" outlined dense clearable />
        </template>

        <q-toggle v-model="form.inherits_lower_levels" :label="$t('compliance.components.RequirementsEditorDialog.a3622e')" />
        <q-input
          v-model.number="form.sort_order"
          :label="$t('compliance.components.RequirementsEditorDialog.5b5417')"
          outlined dense type="number" min="0"
          style="max-width: 140px"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="$t('compliance.components.RequirementsEditorDialog.77dfd2')" v-close-popup />
        <q-btn color="primary" :label="editingReq ? 'Save' : 'Create'" @click="save" :loading="saving" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const props = defineProps<{
  modelValue: boolean;
  level: any | null;
  requirement: any | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "saved"): void;
}>();

const $q = useQuasar();
const saving = ref(false);
const ruleDefinitionText = ref("{}");
const loadingWazuhPolicies = ref(false);
const wazuhPolicies = ref<any[]>([]);
const wazuhPolicySyncState = ref({
  connector_configured: false,
  connector_enabled: false,
  has_synced_results: false,
  results_count: 0,
  visible_agent_count: 0,
  allow_manual_entry: true,
});
const wazuhRule = ref({
  policy_id: "",
  required_pass_rate_percent: 90,
});

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const editingReq = computed(() => props.requirement?.id);

const defaultForm = () => ({
  name: "",
  description: "",
  severity: "medium",
  source_type: "compliance_check",
  source_key: "",
  inherits_lower_levels: false,
  sort_order: 0,
});

const form = ref<any>(defaultForm());

watch(
  () => [props.modelValue, props.requirement],
  ([open, req]) => {
    if (open) {
      const nextForm = req ? { ...req } : defaultForm();
      const nextRuleDefinition = req?.rule_definition || {};
      if (nextRuleDefinition.kind === "wazuh_sca" && nextForm.source_type !== "wazuh_sca") {
        nextForm.source_type = "wazuh_sca";
      }
      form.value = nextForm;
      ruleDefinitionText.value = req?.rule_definition
        ? JSON.stringify(req.rule_definition, null, 2)
        : "{}";
      wazuhRule.value = {
        policy_id: String(nextRuleDefinition.policy_id || nextForm.source_key || ""),
        required_pass_rate_percent: Math.round(Number(nextRuleDefinition.required_pass_rate ?? 0.9) * 100),
      };
      if (nextForm.source_type === "wazuh_sca") {
        loadWazuhPolicies();
      }
    }
  },
  { immediate: true }
);

function onSourceTypeChange() {
  form.value.source_key = "";
  if (form.value.source_type === "wazuh_sca") {
    wazuhRule.value = {
      policy_id: "",
      required_pass_rate_percent: 90,
    };
    loadWazuhPolicies();
  }
}

const severityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const sourceTypeOptions = [
  { label: "Compliance Check", value: "compliance_check" },
  { label: "Security Baseline", value: "security_baseline" },
  { label: "Security Task", value: "security_task" },
  { label: "External Integration", value: "external_integration" },
  { label: "Posture SCA", value: "wazuh_sca" },
  { label: "Custom Script", value: "custom_script" },
  { label: "Manual", value: "manual" },
];

const wazuhPolicyOptions = computed(() =>
  wazuhPolicies.value.map((item) => ({
    label: item.policy_name ? `${item.policy_name} (${item.policy_id})` : item.policy_id,
    value: item.policy_id,
  }))
);

const wazuhPolicyBanner = computed(() => {
  if (!wazuhPolicySyncState.value.connector_configured) {
    return "Configure the posture connector first, or enter a policy ID manually.";
  }
  if (!wazuhPolicySyncState.value.connector_enabled) {
    return "The posture connector is disabled. Enable it or enter a policy ID manually.";
  }
  if (!wazuhPolicySyncState.value.has_synced_results) {
    return "No synchronized posture policies yet. Run a posture sync or enter a policy ID manually.";
  }
  return "";
});

const complianceCheckKeyOptions = [
  { label: "Antivirus Active", value: "general.antivirus" },
  { label: "Screen Lock", value: "general.screen_lock" },
  { label: "OS Updates", value: "os_version.os_updates" },
  { label: "OS Version Minimum", value: "os_version.min_version" },
  { label: "MDM Enrolled", value: "general.mdm_enrolled" },
];

const baselineKeyOptions = [
  { label: "Disk Encryption (BitLocker)", value: "baseline.disk_encryption" },
  { label: "Password Policy", value: "baseline.password_policy" },
  { label: "Firewall Enabled", value: "baseline.firewall" },
  { label: "USB Restriction", value: "baseline.usb_restriction" },
  { label: "WDAC Application Control", value: "baseline.wdac" },
  { label: "Audit Logging", value: "baseline.audit_logging" },
  { label: "SMBv1 Disabled", value: "baseline.smb1_disabled" },
  { label: "RDP NLA Required", value: "baseline.rdp_nla" },
];

const securityTaskOptions = [
  { label: "Credential Guard", value: "security.credential_guard" },
  { label: "FIM Enabled", value: "security.fim" },
];

async function loadWazuhPolicies() {
  if (loadingWazuhPolicies.value) return;
  loadingWazuhPolicies.value = true;
  try {
    const { data } = await axios.get("/compliance/integrations/wazuh/policies/");
    wazuhPolicies.value = data?.items || [];
    wazuhPolicySyncState.value = {
      ...wazuhPolicySyncState.value,
      ...(data?.sync_state || {}),
    };
  } catch (err: any) {
    $q.notify({
      message: err?.response?.data?.detail || err?.message || "Unable to load posture policies",
      color: "warning",
    });
  } finally {
    loadingWazuhPolicies.value = false;
  }
}

function handleNewWazuhPolicy(val: string, done: (value?: string, mode?: string) => void) {
  const normalized = (val || "").trim();
  if (!normalized) {
    done();
    return;
  }
  if (!wazuhPolicies.value.some((item) => item.policy_id === normalized)) {
    wazuhPolicies.value = [...wazuhPolicies.value, { policy_id: normalized, policy_name: "" }];
  }
  done(normalized, "add-unique");
}

async function save() {
  if (!form.value.name.trim()) {
    $q.notify({ message: "Name is required", color: "warning" });
    return;
  }
  saving.value = true;
  try {
    let rule_definition = {};
    if (form.value.source_type === "wazuh_sca") {
      if (!wazuhRule.value.policy_id) {
        $q.notify({ message: "Select a posture policy", color: "warning" });
        return;
      }
      const requiredPassRate = Number(wazuhRule.value.required_pass_rate_percent || 0) / 100;
      rule_definition = {
        kind: "wazuh_sca",
        policy_id: wazuhRule.value.policy_id,
        required_pass_rate: Math.min(1, Math.max(0, requiredPassRate)),
      };
      form.value.source_key = wazuhRule.value.policy_id;
    } else {
      try { rule_definition = JSON.parse(ruleDefinitionText.value || "{}"); } catch {}
    }

    const payload = { ...form.value, rule_definition };

    if (editingReq.value) {
      await axios.patch(`/compliance/levels/${props.level.id}/requirements/${editingReq.value}/`, payload);
      $q.notify({ message: "Requirement updated", color: "positive", icon: "check" });
    } else {
      await axios.post(`/compliance/levels/${props.level.id}/requirements/`, payload);
      $q.notify({ message: "Requirement created", color: "positive", icon: "check" });
    }
    open.value = false;
    emit("saved");
  } catch (err: any) {
    const data = err?.response?.data;
    const msg = typeof data === "string" ? data : (data && Object.values(data)[0]) || "Error saving";
    $q.notify({ message: String(msg), color: "negative" });
  } finally {
    saving.value = false;
  }
}
</script>
