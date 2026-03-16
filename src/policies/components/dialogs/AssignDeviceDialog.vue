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

      <!-- Tabs -->
      <div class="tabs-container">
        <q-tabs
          v-model="activeTab"
          dense
          class="assign-tabs"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
        >
          <q-tab name="devices" label="Devices" />
          <q-tab name="groups" label="Groups" />
        </q-tabs>
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <div v-if="loadingDevices" class="flex flex-center q-pa-md">
          <q-spinner color="primary" size="32px" />
        </div>
        <template v-else>
          <!-- Devices Tab -->
          <template v-if="activeTab === 'devices'">
          <label class="input-label">Device</label>
          <q-select
            v-model="selectedDevices"
            :options="availableDevices"
            option-label="name"
            option-value="id"
            outlined
            dense
            multiple
            use-chips
            placeholder="Select a device"
            class="device-select"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section side>
                  <q-checkbox
                    :model-value="scope.selected"
                    @update:model-value="scope.toggleOption(scope.opt)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.segment }} - {{ scope.opt.employee }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          </template>

          <!-- Groups Tab -->
          <template v-if="activeTab === 'groups'">
          <label class="input-label">Device Group</label>
          <q-list class="groups-list">
            <q-item
              v-for="group in deviceGroups"
              :key="group.id"
              clickable
              @click="toggleGroup(group.id)"
              :class="['group-item', { 'group-item--selected': selectedGroups.includes(group.id) }]"
            >
              <q-item-section side>
                <q-checkbox
                  :model-value="selectedGroups.includes(group.id)"
                  @update:model-value="toggleGroup(group.id)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ group.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :label="`${group.deviceCount} devices`" color="grey-6" />
              </q-item-section>
            </q-item>
          </q-list>
          </template>
        </template>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="dialog-actions">
        <q-btn
          flat
          label="Cancel"
          @click="close"
          class="action-btn"
        />
        <q-btn
          unelevated
          color="primary"
          label="Assign"
          :disable="!canAssign"
          @click="assign"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { Device, DeviceGroup } from '../../types/policies';
import { fetchDevices, fetchDeviceGroups } from '@/api/policies';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'assign', deviceIds: number[]): void;
}>();

const $q = useQuasar();

// Form state
const activeTab = ref('devices');
const selectedDevices = ref<number[]>([]);
const selectedGroups = ref<string[]>([]);
const availableDevices = ref<Device[]>([]);
const deviceGroups = ref<DeviceGroup[]>([]);
const loadingDevices = ref(false);

// Load devices and groups from API
async function loadDevicesAndGroups() {
  loadingDevices.value = true;
  try {
    const [devs, groups] = await Promise.all([fetchDevices(), fetchDeviceGroups()]);
    availableDevices.value = devs;
    deviceGroups.value = groups;
  } catch (err) {
    console.error('[AssignDeviceDialog] failed to load devices:', err);
    $q.notify({
      message: 'Failed to load devices and groups',
      color: 'negative',
      position: 'top',
    });
  } finally {
    loadingDevices.value = false;
  }
}

const canAssign = computed(() => {
  if (activeTab.value === 'devices') {
    return selectedDevices.value.length > 0;
  }
  return selectedGroups.value.length > 0;
});

// Reset form and load data when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm();
    loadDevicesAndGroups();
  }
});

function resetForm() {
  activeTab.value = 'devices';
  selectedDevices.value = [];
  selectedGroups.value = [];
}

function toggleGroup(groupId: string) {
  const index = selectedGroups.value.indexOf(groupId);
  if (index === -1) {
    selectedGroups.value.push(groupId);
  } else {
    selectedGroups.value.splice(index, 1);
  }
}

function close() {
  emit('update:modelValue', false);
}

function assign() {
  if (!canAssign.value) return;

  let deviceIds: number[] = [];

  if (activeTab.value === 'devices') {
    deviceIds = [...selectedDevices.value];
  } else {
    // For groups - assign all devices from selected groups
    if (selectedGroups.value.length > 0) {
      deviceIds = availableDevices.value.map(device => device.id);
    }
  }

  emit('assign', deviceIds);
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

.tabs-container {
  padding: 0 20px;
}

.assign-tabs :deep(.q-tab) {
  text-transform: none;
  font-weight: 500;
}

.dialog-content {
  padding: 24px;
  min-height: 200px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1a1a2e);
  margin-bottom: 8px;
}

.device-select {
  width: 100%;
}

.groups-list {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.group-item {
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.group-item:last-child {
  border-bottom: none;
}

.group-item--selected {
  background: var(--selected-bg, #eef6fc);
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
  --selected-bg: #1a3a5c;
}
</style>
