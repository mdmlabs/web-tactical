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
          <!-- Client -->
          <tactical-dropdown
            v-if="target === 'client'"
            v-model="selectedClient"
            :options="clientOptions"
            label="Select Client"
            outlined
            mapOptions
            filterable
            :rules="[(val: unknown) => !!val || '*Required']"
          />
          <!-- Site -->
          <tactical-dropdown
            v-else-if="target === 'site'"
            v-model="selectedSite"
            :options="siteOptions"
            label="Select Site"
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
        <!-- TODO: Assign button - will be re-enabled later -->
        <!-- <q-btn
          flat
          color="primary"
          label="Assign"
          :disable="!canAssign"
          :loading="loading"
          @click="assign"
          class="action-btn"
        /> -->
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
import { useClientDropdown, useSiteDropdown } from "@/composables/clients";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  // (e: 'assign', deviceIds: number[]): void;  // TODO: will be re-enabled later
  (e: "deploy", deviceIds: number[]): void;
}>();

const $q = useQuasar();
const loading = ref(false);

// Target selector
const target = ref<"client" | "site" | "agents" | "all">("agents");

const targetOptions = [
  { label: "Client", value: "client" },
  { label: "Site", value: "site" },
  { label: "Selected Agents", value: "agents" },
  { label: "All", value: "all" },
];

// Dropdowns
const { agents: selectedAgents, agentOptions, getAgentOptions } = useAgentDropdown();
const { client: selectedClient, clientOptions, getClientOptions } = useClientDropdown();
const { site: selectedSite, siteOptions, getSiteOptions } = useSiteDropdown();

// All agents raw list (for resolving client/site/all → agent IDs)
const allAgentsRaw = ref<Array<{ id: number; hostname: string; client: string; site: string }>>([]);

const canAssign = computed(() => {
  if (target.value === "all") return true;
  if (target.value === "agents") return Array.isArray(selectedAgents.value) && selectedAgents.value.length > 0;
  if (target.value === "client") return !!selectedClient.value;
  if (target.value === "site") return !!selectedSite.value;
  return false;
});

// Reset selections when target changes
watch(target, () => {
  selectedAgents.value = [];
  selectedClient.value = null;
  selectedSite.value = null;
});

// Load data when dialog opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    resetForm();
    loading.value = true;
    try {
      await Promise.all([getAgentOptions(false, "id"), getClientOptions(), getSiteOptions()]);
      // Also keep a raw list for client/site/all resolution
      const { fetchAgents } = await import("@/api/agents");
      const raw = await fetchAgents({ detail: false });
      allAgentsRaw.value = raw.map((a: Record<string, unknown>) => ({
        id: Number(a.id),
        hostname: String(a.hostname),
        client: String(a.client),
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
  selectedClient.value = null;
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
    case "client": {
      const opts = clientOptions.value as Array<{ value: unknown; label: string }>;
      const clientLabel = opts.find(o => o.value === selectedClient.value)?.label;
      return allAgentsRaw.value
        .filter(a => a.client === clientLabel)
        .map(a => a.id);
    }
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

// TODO: assign function - will be re-enabled later
// function assign() {
//   if (!canAssign.value) return;
//
//   const deviceIds = resolveDeviceIds();
//   if (deviceIds.length === 0) {
//     $q.notify({ message: 'No agents found for selected target', color: 'warning', position: 'top' });
//     return;
//   }
//
//   emit('assign', deviceIds);
//   close();
// }

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
