<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">{{ $t('security.components.HealthPolicyPanel.efeebd') }}</div>
    <div class="text-caption text-grey q-mb-lg">
      {{ $t('security.components.HealthPolicyPanel.7c475d') }}
    </div>

    <q-form @submit="saveThresholds" class="q-gutter-md" style="max-width:600px">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">{{ $t('security.components.HealthPolicyPanel.42878c') }}</div>
          <div class="row items-center q-gutter-md">
            <q-input v-model.number="form.cpu_warn" :label="$t('security.components.HealthPolicyPanel.e1ba97')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-input v-model.number="form.cpu_crit" :label="$t('security.components.HealthPolicyPanel.557e15')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-select v-model="form.cpu_action" :options="actionOptions" :label="$t('security.components.HealthPolicyPanel.97c89a')" outlined dense emit-value map-options class="col-12" />
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">{{ $t('security.components.HealthPolicyPanel.03a68b') }}</div>
          <div class="row items-center q-gutter-md">
            <q-input v-model.number="form.mem_warn" :label="$t('security.components.HealthPolicyPanel.e1ba97')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-input v-model.number="form.mem_crit" :label="$t('security.components.HealthPolicyPanel.557e15')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-select v-model="form.mem_action" :options="actionOptions" :label="$t('security.components.HealthPolicyPanel.97c89a')" outlined dense emit-value map-options class="col-12" />
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">{{ $t('security.components.HealthPolicyPanel.fb0a3e') }}</div>
          <div class="row items-center q-gutter-md">
            <q-input v-model.number="form.disk_warn" :label="$t('security.components.HealthPolicyPanel.e1ba97')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-input v-model.number="form.disk_crit" :label="$t('security.components.HealthPolicyPanel.557e15')" outlined dense type="number" :min="0" :max="100" class="col" />
            <q-select v-model="form.disk_action" :options="actionOptions" :label="$t('security.components.HealthPolicyPanel.97c89a')" outlined dense emit-value map-options class="col-12" />
          </div>
        </q-card-section>
      </q-card>

      <q-btn type="submit" color="primary" :label="$t('security.components.HealthPolicyPanel.213172')" :loading="saving" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const saving = ref(false);
const form = ref({
  cpu_warn: 85, cpu_crit: 95, cpu_action: "notify",
  mem_warn: 85, mem_crit: 95, mem_action: "kill_top_process",
  disk_warn: 85, disk_crit: 95, disk_action: "clear_temp",
});

const actionOptions = [
  { label: "Notify Only", value: "notify" },
  { label: "Kill Top Process", value: "kill_top_process" },
  { label: "Restart Service", value: "restart_service" },
  { label: "Clear Temp Files", value: "clear_temp" },
];

async function loadPolicy() {
  try {
    const resp = await axios.get("/security/health/thresholds/");
    if (resp.data) Object.assign(form.value, resp.data);
  } catch {}
}

async function saveThresholds() {
  saving.value = true;
  try {
    await axios.post("/security/health/thresholds/", form.value);
    $q.notify({ message: "Health policy saved", color: "positive", icon: "check" });
  } catch {
    $q.notify({ message: "Save failed", color: "negative" });
  } finally { saving.value = false; }
}

onMounted(loadPolicy);
</script>
