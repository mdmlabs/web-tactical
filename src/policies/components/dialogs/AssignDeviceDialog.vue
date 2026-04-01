<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="assign-device-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Assign policy to device</span>
        <q-btn icon="close" flat round dense @click="close" />
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <!-- Choose Target -->
        <div class="target-section">
          <p class="target-label">Choose Target</p>
          <q-option-group
            v-model="target"
            :options="targetOptions"
            color="primary"
            dense
            inline
            class="q-pl-sm"
          />
        </div>

        <div class="q-mt-md">
          <!-- Site -->
          <tactical-dropdown
            v-if="target === 'site'"
            v-model="selectedSite"
            :options="siteOptions"
            label="Select Category"
            outlined
            mapOptions
            filterable
            :rules="[(val: unknown) => !!val || '*Required']"
          />
          <!-- Selected Agents -->
          <tactical-dropdown
            v-else-if="target === 'agents'"
            v-model="selectedAgents"
            :options="agentOptions"
            label="Select Agents"
            filled
            multiple
            mapOptions
            filterable
            :rules="[(val: unknown) => !!val || '*Required']"
          />
          <!-- All — no additional selector needed -->
          <div v-else-if="target === 'all'" class="all-hint">
            <q-icon name="info" color="grey-6" size="18px" />
            <span>Policy will be assigned to all agents</span>
          </div>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="close" class="action-btn" />
        <q-btn
          unelevated
          color="primary"
          label="Deploy"
          :disable="!canAssign"
          :loading="loading"
          @click="deploy"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useAgentDropdown } from "@/composables/agents";
import { useSiteDropdown } from "@/composables/clients";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "deploy", deviceIds: number[]): void;
}>();

const $q = useQuasar();
const loading = ref(false);

// Target selector
const target = ref<"site" | "agents" | "all">("agents");

const targetOptions = [
  { label: "Category", value: "site" },
  { label: "Selected Agents", value: "agents" },
  { label: "All", value: "all" },
];

// Dropdowns
const { agents: selectedAgents, agentOptions, getAgentOptions } = useAgentDropdown();
const { site: selectedSite, siteOptions, getSiteOptions } = useSiteDropdown();

// All agents raw list (for resolving site/all → agent IDs)
const allAgentsRaw = ref<Array<{ id: number; hostname: string; site: string }>>([]);

const canAssign = computed(() => {
  if (target.value === "all") return true;
  if (target.value === "agents") return Array.isArray(selectedAgents.value) && selectedAgents.value.length > 0;
  if (target.value === "site") return !!selectedSite.value;
  return false;
});

// Reset selections when target changes
watch(target, () => {
  selectedAgents.value = [];
  selectedSite.value = null;
});

// Load data when dialog opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    resetForm();
    loading.value = true;
    try {
      await Promise.all([getAgentOptions(false, "id"), getSiteOptions()]);
      // Also keep a raw list for site/all resolution
      const { fetchAgents } = await import("@/api/agents");
      const raw = await fetchAgents({ detail: false });
      allAgentsRaw.value = raw.map((a: Record<string, unknown>) => ({
        id: Number(a.id),
        hostname: String(a.hostname),
        site: String(a.site),
      }));
    } catch (err) {
      console.error("[AssignDeviceDialog] failed to load options:", err);
      $q.notify({ message: "Failed to load agents", color: "negative", position: "top" });
    } finally {
      loading.value = false;
    }
  }
});

function resetForm() {
  target.value = "agents";
  selectedAgents.value = [];
  selectedSite.value = null;
}

function close() {
  emit("update:modelValue", false);
}

function resolveDeviceIds(): number[] {
  switch (target.value) {
    case "agents":
      return (selectedAgents.value as unknown as number[]) ?? [];
    case "all":
      return allAgentsRaw.value.map(a => a.id);
    case "site": {
      const opts = siteOptions.value as Array<{ value: unknown; label: string }>;
      const siteLabel = opts.find(o => o.value === selectedSite.value)?.label;
      return allAgentsRaw.value
        .filter(a => a.site === siteLabel)
        .map(a => a.id);
    }
    default:
      return [];
  }
}

function deploy() {
  if (!canAssign.value) return;

  const deviceIds = resolveDeviceIds();
  if (deviceIds.length === 0) {
    $q.notify({ message: "No agents found for selected target", color: "warning", position: "top" });
    return;
  }

  emit("deploy", deviceIds);
  close();
}
</script>

<style scoped>
.assign-device-dialog {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
}

.dialog-content {
  padding: 24px;
  min-height: 320px;
}

.target-section {
  margin-bottom: 4px;
}

.target-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
  margin-bottom: 8px;
}

.all-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
  padding: 12px 0;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  padding: 8px 24px;
  min-width: 100px;
}

/* Dark theme */
.body--dark .assign-device-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
}
</style>
