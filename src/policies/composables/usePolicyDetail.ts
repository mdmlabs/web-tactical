import { ref, computed, watch } from "vue";
import type { Policy, PolicyApp, PolicyScript, PolicyResource, Device } from "../types/policies";
import {
  fetchPolicy as fetchPolicyApi,
  assignDevices as assignDevicesApi,
  unassignDevice as unassignDeviceApi,
  updatePolicy as updatePolicyApi,
} from "@/api/policies";

export function usePolicyDetail(policyId: string) {
  const originalPolicy = ref<Policy | null>(null);
  const policy = ref<Policy | null>(null);
  const loading = ref(false);
  const hasChanges = ref(false);
  const activeSection = ref("summary");
  const assignedDeviceObjects = ref<Device[]>([]);

  // Assigned devices (Device objects, not just IDs)
  const assignedDevices = computed(() => assignedDeviceObjects.value);

  // Summary counts
  const appCount = computed(() => policy.value?.apps.length ?? 0);
  const scriptCount = computed(() => policy.value?.scripts.length ?? 0);
  const resourceCount = computed(() => policy.value?.resources.length ?? 0);
  const applicationControlCount = computed(() => policy.value?.applicationControl?.tokens.length ?? 0);

  // Load policy from API
  async function loadPolicy() {
    loading.value = true;
    try {
      const found = await fetchPolicyApi(policyId);
      originalPolicy.value = JSON.parse(JSON.stringify(found));
      policy.value = JSON.parse(JSON.stringify(found));
    } catch (err) {
      console.error('[usePolicyDetail] loadPolicy error:', err);
    } finally {
      loading.value = false;
    }
  }

  // Check for changes
  watch(
    policy,
    () => {
      if (originalPolicy.value && policy.value) {
        hasChanges.value = JSON.stringify(originalPolicy.value) !== JSON.stringify(policy.value);
      }
    },
    { deep: true }
  );

  // Save changes via API
  async function saveChanges() {
    if (policy.value) {
      try {
        const updated = await updatePolicyApi(policy.value.id, policy.value);
        policy.value = JSON.parse(JSON.stringify(updated));
        originalPolicy.value = JSON.parse(JSON.stringify(updated));
        hasChanges.value = false;
      } catch (err) {
        console.error('[usePolicyDetail] saveChanges error:', err);
        throw err;
      }
    }
  }

  // Discard changes
  function discardChanges() {
    if (originalPolicy.value) {
      policy.value = JSON.parse(JSON.stringify(originalPolicy.value));
      hasChanges.value = false;
    }
  }

  // Update policy name
  function updateName(name: string) {
    if (policy.value) {
      policy.value.name = name;
    }
  }

  // Update segment
  function updateSegment(segment: string) {
    if (policy.value) {
      policy.value.segment = segment;
    }
  }

  // Add app
  function addApp(app: PolicyApp) {
    if (policy.value) {
      policy.value.apps.push(app);
      updateSummary();
    }
  }

  // Remove app
  function removeApp(appId: string) {
    if (policy.value) {
      policy.value.apps = policy.value.apps.filter(a => a.id !== appId);
      updateSummary();
    }
  }

  // Add script
  function addScript(script: PolicyScript) {
    if (policy.value) {
      policy.value.scripts.push(script);
      updateSummary();
    }
  }

  // Remove script
  function removeScript(scriptId: string) {
    if (policy.value) {
      policy.value.scripts = policy.value.scripts.filter(s => s.id !== scriptId);
      updateSummary();
    }
  }

  // Add resource
  function addResource(resource: PolicyResource) {
    if (policy.value) {
      policy.value.resources.push(resource);
      updateSummary();
    }
  }

  // Remove resource
  function removeResource(resourceId: string) {
    if (policy.value) {
      policy.value.resources = policy.value.resources.filter(r => r.id !== resourceId);
      updateSummary();
    }
  }

  // Assign devices via API
  async function assignDevices(deviceIds: number[]) {
    if (policy.value) {
      try {
        const result = await assignDevicesApi(policy.value.id, deviceIds);
        policy.value.assignedDevices = result.assignedDevices;
        policy.value.deviceCount = result.deviceCount;
      } catch (err) {
        console.error('[usePolicyDetail] assignDevices error:', err);
        throw err;
      }
    }
  }

  // Unassign device via API
  async function unassignDevice(deviceId: number) {
    if (policy.value) {
      try {
        const result = await unassignDeviceApi(policy.value.id, deviceId);
        policy.value.assignedDevices = result.assignedDevices;
        policy.value.deviceCount = result.deviceCount;
      } catch (err) {
        console.error('[usePolicyDetail] unassignDevice error:', err);
        throw err;
      }
    }
  }

  // Update application control tokens
  function updateApplicationControl(tokens: string[]) {
    if (policy.value) {
      if (!policy.value.applicationControl) {
        policy.value.applicationControl = { tokens: [] };
      }
      policy.value.applicationControl.tokens = tokens;
    }
  }

  // Update summary text
  function updateSummary() {
    if (policy.value) {
      const parts: string[] = [];
      if (policy.value.apps.length > 0) {
        parts.push(`${policy.value.apps.length} app${policy.value.apps.length > 1 ? "s" : ""}`);
      }
      if (policy.value.scripts.length > 0) {
        parts.push(`${policy.value.scripts.length} script${policy.value.scripts.length > 1 ? "s" : ""}`);
      }
      if (policy.value.resources.length > 0) {
        parts.push(`${policy.value.resources.length} resource${policy.value.resources.length > 1 ? "s" : ""}`);
      }
      policy.value.summary = parts.length > 0 ? parts.join(", ") : "Empty";
    }
  }

  // Set active section
  function setActiveSection(section: string) {
    activeSection.value = section;
  }

  // Initialize
  void loadPolicy();

  return {
    policy,
    loading,
    hasChanges,
    activeSection,
    assignedDevices,
    appCount,
    scriptCount,
    resourceCount,
    applicationControlCount,
    saveChanges,
    discardChanges,
    updateName,
    updateSegment,
    addApp,
    removeApp,
    addScript,
    removeScript,
    addResource,
    removeResource,
    assignDevices,
    unassignDevice,
    updateApplicationControl,
    setActiveSection,
    loadPolicy,
  };
}
