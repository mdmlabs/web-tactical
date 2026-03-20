import { ref, computed, watch } from "vue";
import type { Policy, PolicyApp, PolicyScript, PolicyResource, Device } from "../types/policies";
import {
  fetchPolicy as fetchPolicyApi,
  // assignDevices as assignDevicesApi,  // TODO: will be re-enabled later
  unassignDevice as unassignDeviceApi,
  updatePolicy as updatePolicyApi,
  fetchDevices,
  deployPolicy as deployPolicyApi,
} from "@/api/policies";

export function usePolicyDetail(policyId: string) {
  const originalPolicy = ref<Policy | null>(null);
  const policy = ref<Policy | null>(null);
  const loading = ref(false);
  const hasChanges = ref(false);
  const activeSection = ref("summary");
  const assignedDeviceObjects = ref<Device[]>([]);
  const lastDeliveryJobs = ref<number[]>([]);
  const deployLoading = ref(false);
  const deployError = ref<string | null>(null);

  // Assigned devices (Device objects, not just IDs)
  const assignedDevices = computed(() => assignedDeviceObjects.value);

  // Summary counts
  const appCount = computed(() => policy.value?.apps.length ?? 0);
  const scriptCount = computed(() => policy.value?.scripts.length ?? 0);
  const resourceCount = computed(() => policy.value?.resources.length ?? 0);
  const applicationControlCount = computed(
    () => policy.value?.applicationControl?.tokens.length ?? 0,
  );

  // Load all agents once and keep for lookup
  const allAgents = ref<Device[]>([]);

  async function loadAllAgents() {
    if (allAgents.value.length === 0) {
      allAgents.value = await fetchDevices();
    }
  }

  // Build Device objects from assigned IDs
  function syncAssignedDeviceObjects(ids: number[]) {
    assignedDeviceObjects.value = ids
      .map(id => allAgents.value.find(a => a.id === id))
      .filter((d): d is Device => d !== undefined);
  }

  // Load policy from API
  async function loadPolicy() {
    loading.value = true;
    try {
      await loadAllAgents();
      const found = await fetchPolicyApi(policyId);
      originalPolicy.value = JSON.parse(JSON.stringify(found));
      policy.value = JSON.parse(JSON.stringify(found));
      syncAssignedDeviceObjects(found.assignedDevices);
    } catch (err) {
      console.error("[usePolicyDetail] loadPolicy error:", err);
    } finally {
      loading.value = false;
    }
  }

  // Check for changes
  watch(
    policy,
    () => {
      if (originalPolicy.value && policy.value) {
        hasChanges.value =
          JSON.stringify(originalPolicy.value) !== JSON.stringify(policy.value);
      }
    },
    { deep: true },
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
        console.error("[usePolicyDetail] saveChanges error:", err);
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
      policy.value.apps = policy.value.apps.filter((a) => a.id !== appId);
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
      policy.value.scripts = policy.value.scripts.filter(
        (s) => s.id !== scriptId,
      );
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
      policy.value.resources = policy.value.resources.filter(
        (r) => r.id !== resourceId,
      );
      updateSummary();
    }
  }

  // TODO: assignDevices - will be re-enabled later
  // async function assignDevices(deviceIds: number[]) {
  //   if (policy.value) {
  //     try {
  //       const result = await assignDevicesApi(policy.value.id, deviceIds);
  //       policy.value.assignedDevices = result.assignedDevices;
  //       policy.value.deviceCount = result.deviceCount;
  //       syncAssignedDeviceObjects(result.assignedDevices);
  //       return result;
  //     } catch (err) {
  //       console.error('[usePolicyDetail] assignDevices error:', err);
  //       throw err;
  //     }
  //   }
  // }

  // Deploy policy to devices - assigns devices AND creates delivery jobs for all resources
  async function deployToDevices(deviceIds: number[]) {
    if (policy.value) {
      try {
        deployLoading.value = true;
        deployError.value = null;

        const result = await deployPolicyApi(policy.value.id, deviceIds);
        policy.value.assignedDevices = result.assignedDevices;
        policy.value.deviceCount = result.deviceCount;
        syncAssignedDeviceObjects(result.assignedDevices);
        lastDeliveryJobs.value = result.deliveryJobsCreated;

        return result;
      } catch (err) {
        console.error("[usePolicyDetail] deployToDevices error:", err);
        deployError.value = "Failed to deploy policy";
        throw err;
      } finally {
        deployLoading.value = false;
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
        syncAssignedDeviceObjects(result.assignedDevices);
      } catch (err) {
        console.error("[usePolicyDetail] unassignDevice error:", err);
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
        parts.push(
          `${policy.value.apps.length} app${policy.value.apps.length > 1 ? "s" : ""}`,
        );
      }
      if (policy.value.scripts.length > 0) {
        parts.push(
          `${policy.value.scripts.length} script${policy.value.scripts.length > 1 ? "s" : ""}`,
        );
      }
      if (policy.value.resources.length > 0) {
        parts.push(
          `${policy.value.resources.length} resource${policy.value.resources.length > 1 ? "s" : ""}`,
        );
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

  // Preview items (first 3 for summary cards)
  const appPreviewItems = computed(() =>
    policy.value?.apps.slice(0, 3).map(app => ({ name: app.name, type: "app" })) || []
  );

  const scriptPreviewItems = computed(() =>
    policy.value?.scripts.slice(0, 3).map(script => ({ name: script.name, type: "script" })) || []
  );

  const resourcePreviewItems = computed(() =>
    policy.value?.resources.slice(0, 3).map(resource => ({ name: resource.name, type: resource.type })) || []
  );

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
    appPreviewItems,
    scriptPreviewItems,
    resourcePreviewItems,
    lastDeliveryJobs,
    deployLoading,
    deployError,
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
    // assignDevices,  // TODO: will be re-enabled later
    deployToDevices,
    unassignDevice,
    updateApplicationControl,
    setActiveSection,
    loadPolicy,
  };
}
