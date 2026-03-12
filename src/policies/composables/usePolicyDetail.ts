import { ref, computed, watch } from "vue";
import type { Policy, PolicyApp, PolicyScript, PolicyResource } from "../types/policies";
import { mockDevices } from "../mocks/policiesMockData";
import { usePolicies } from "./usePolicies";

export function usePolicyDetail(policyId: string) {
  const { getPolicy, updatePolicy } = usePolicies();

  const originalPolicy = ref<Policy | null>(null);
  const policy = ref<Policy | null>(null);
  const loading = ref(false);
  const hasChanges = ref(false);
  const activeSection = ref("summary");

  // Assigned devices for this policy
  const assignedDevices = computed(() => {
    if (!policy.value) return [];
    return mockDevices.filter(d => policy.value?.assignedDevices.includes(d.id));
  });

  // Summary counts
  const appCount = computed(() => policy.value?.apps.length ?? 0);
  const scriptCount = computed(() => policy.value?.scripts.length ?? 0);
  const resourceCount = computed(() => policy.value?.resources.length ?? 0);
  const applicationControlCount = computed(() => policy.value?.applicationControl?.tokens.length ?? 0);

  // Load policy
  function loadPolicy() {
    loading.value = true;
    const found = getPolicy(policyId);
    if (found) {
      originalPolicy.value = JSON.parse(JSON.stringify(found));
      policy.value = JSON.parse(JSON.stringify(found));
    }
    loading.value = false;
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

  // Save changes
  function saveChanges() {
    if (policy.value) {
      policy.value.version += 1;
      updatePolicy(policy.value.id, policy.value);
      originalPolicy.value = JSON.parse(JSON.stringify(policy.value));
      hasChanges.value = false;
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

  // Assign devices
  function assignDevices(deviceIds: string[]) {
    if (policy.value) {
      const existingIds = new Set(policy.value.assignedDevices);
      deviceIds.forEach(id => existingIds.add(id));
      policy.value.assignedDevices = Array.from(existingIds);
      policy.value.deviceCount = policy.value.assignedDevices.length;
    }
  }

  // Unassign device
  function unassignDevice(deviceId: string) {
    if (policy.value) {
      policy.value.assignedDevices = policy.value.assignedDevices.filter(id => id !== deviceId);
      policy.value.deviceCount = policy.value.assignedDevices.length;
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
  loadPolicy();

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
