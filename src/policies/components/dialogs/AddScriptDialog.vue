<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="add-script-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <span class="dialog-title">Add Script</span>
        <q-btn icon="close" flat round dense @click="close" />
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="dialog-content">
        <p class="content-description">
          Select or upload a script to add to this policy
        </p>

        <!-- Script Selection -->
        <div class="script-selection">
          <q-select
            v-model="selectedScript"
            :options="scriptResources"
            option-label="name"
            option-value="id"
            outlined
            dense
            placeholder="Select a script"
            class="script-select"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.language }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <span class="or-text">or</span>

          <q-btn
            outline
            color="primary"
            label="Upload new script"
            class="upload-btn"
          />
        </div>

        <!-- Execution Settings -->
        <template v-if="selectedScript">
          <q-separator class="q-my-lg" />

          <div class="settings-section">
            <h4 class="section-title">Execution settings</h4>

            <q-input
              v-model.number="timeout"
              outlined
              dense
              label="Timeout (seconds)"
              type="number"
              style="max-width: 200px"
            />

            <q-checkbox
              v-model="runAsUser"
              label="Run as user"
              class="q-mt-md"
            />
          </div>
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
          label="Add"
          :disable="!canAdd"
          @click="addScript"
          class="action-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { PolicyScript } from '../../types/policies';
import { fetchResourceList } from '@/api/resources';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'add', script: PolicyScript): void;
}>();

const $q = useQuasar();

// Form state
const selectedScript = ref<number | null>(null);
const timeout = ref(300);
const runAsUser = ref(false);

// API data
const scriptResources = ref<Array<{ id: number; name: string; language?: string }>>([]);
const loading = ref(false);

const canAdd = computed(() => selectedScript.value !== null);

const selectedScriptData = computed(() => 
  scriptResources.value.find(s => s.id === selectedScript.value)
);

// Load scripts from API
async function loadScripts() {
  loading.value = true;
  try {
    const data = await fetchResourceList('script');
    scriptResources.value = Array.isArray(data) ? data : (data?.results ?? []);
  } catch (error) {
    console.error('Failed to load scripts:', error);
    $q.notify({
      message: 'Failed to load scripts',
      color: 'negative',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
}

// Reset form when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm();
    loadScripts();
  }
});

function resetForm() {
  selectedScript.value = null;
  timeout.value = 300;
  runAsUser.value = false;
}

function close() {
  emit('update:modelValue', false);
}

function addScript() {
  if (!canAdd.value || !selectedScriptData.value) return;

  const script: PolicyScript = {
    id: `script-${Date.now()}`,
    resourceId: selectedScript.value!,
    name: selectedScriptData.value.name,
    timeout: timeout.value,
    runAsUser: runAsUser.value,
  };

  emit('add', script);
  close();
}
</script>

<style scoped>
.add-script-dialog {
  width: 100%;
  max-width: 550px;
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
}

.content-description {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 20px 0;
}

.script-selection {
  display: flex;
  align-items: center;
  gap: 16px;
}

.script-select {
  flex: 1;
}

.or-text {
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
}

.upload-btn {
  text-transform: none;
  font-weight: 600;
}

.settings-section {
  margin-top: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0 0 16px 0;
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
.body--dark .add-script-dialog {
  --text-primary: #e4e6eb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3a;
}
</style>
