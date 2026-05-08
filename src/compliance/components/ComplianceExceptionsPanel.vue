<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-subtitle1 text-weight-medium">{{ $t('compliance.components.ComplianceExceptionsPanel.b22219') }}</div>
        <div class="text-caption text-grey-7">{{ $t('compliance.components.ComplianceExceptionsPanel.844ece') }}</div>
      </div>
      <q-btn color="primary" icon="add" :label="$t('compliance.components.ComplianceExceptionsPanel.432178')" @click="openCreateDialog" />
    </div>

    <!-- Filter bar -->
    <div class="row q-gutter-sm q-mb-md">
      <q-toggle v-model="activeOnly" :label="$t('compliance.components.ComplianceExceptionsPanel.e5a176')" dense @update:model-value="loadExceptions" />
      <q-input v-model="agentFilter" :label="$t('compliance.components.ComplianceExceptionsPanel.e6394b')" outlined dense clearable style="min-width:200px"
        @update:model-value="loadExceptions" />
    </div>

    <q-table :rows="exceptions" :columns="columns" dense row-key="id" :loading="loading"
      :rows-per-page-options="[20, 50]">
      <template v-slot:body-cell-is_active="props">
        <q-td :props="props">
          <q-chip dense :color="props.value ? 'positive' : 'grey'" text-color="white" size="sm">
            {{ props.value ? 'Active' : 'Expired/Revoked' }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-expires_at="props">
        <q-td :props="props">
          <span :class="isExpiringSoon(props.value) ? 'text-warning text-weight-bold' : ''">
            {{ props.value ? new Date(props.value).toLocaleString() : '—' }}
          </span>
          <q-chip v-if="isExpiringSoon(props.value)" dense color="warning" text-color="white" size="xs" class="q-ml-xs">
            {{ $t('compliance.components.ComplianceExceptionsPanel.74bbe7') }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn v-if="props.row.is_active" flat dense round icon="block" size="sm" color="negative"
            @click="revokeException(props.row)" :title="$t('compliance.components.ComplianceExceptionsPanel.c4317c')">
            <q-tooltip>{{ $t('compliance.components.ComplianceExceptionsPanel.0be720') }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Create Exception Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width:500px">
        <q-bar class="bg-primary text-white">
          <q-icon name="shield" class="q-mr-sm" />
          <span>{{ $t('compliance.components.ComplianceExceptionsPanel.9c8786') }}</span>
          <q-space />
          <q-btn dense flat round icon="close" @click="dialogOpen = false" />
        </q-bar>
        <q-card-section class="q-gutter-sm">
          <q-select v-model="form.agent_id" :options="agentOptions" option-label="hostname" option-value="agent_id"
            emit-value map-options :label="$t('compliance.components.ComplianceExceptionsPanel.e49c96')" outlined dense use-input input-debounce="0" />
          <q-select v-model="form.requirement" :options="requirementOptions" option-label="name" option-value="id"
            emit-value map-options :label="$t('compliance.components.ComplianceExceptionsPanel.c2824e')" outlined dense use-input input-debounce="0" />
          <q-input v-model="form.reason" :label="$t('compliance.components.ComplianceExceptionsPanel.51851d')" outlined dense autogrow
            :hint="$t('compliance.components.ComplianceExceptionsPanel.8c4d51')" />
          <q-input v-model="form.expires_at" :label="$t('compliance.components.ComplianceExceptionsPanel.7556f6')" type="datetime-local" outlined dense />
          <q-input v-model="form.notes" :label="$t('compliance.components.ComplianceExceptionsPanel.704400')" outlined dense autogrow />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('compliance.components.ComplianceExceptionsPanel.77dfd2')" @click="dialogOpen = false" />
          <q-btn color="primary" :label="$t('compliance.components.ComplianceExceptionsPanel.5af505')" :loading="saving" @click="saveException" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const dialogOpen = ref(false)
const exceptions = ref<any[]>([])
const agentOptions = ref<any[]>([])
const requirementOptions = ref<any[]>([])
const activeOnly = ref(true)
const agentFilter = ref('')

const form = ref({ agent_id: '', requirement: null as number | null, reason: '', expires_at: '', notes: '' })

const columns = [
  { name: 'agent_id', label: 'Device', field: 'agent_id', align: 'left' as const, sortable: true },
  { name: 'requirement_name', label: 'Requirement', field: 'requirement_name', align: 'left' as const },
  { name: 'reason', label: 'Reason', field: 'reason', align: 'left' as const,
    format: (v: string) => v?.slice(0, 60) + (v?.length > 60 ? '…' : '') },
  { name: 'approved_by_username', label: 'Approved By', field: 'approved_by_username', align: 'left' as const },
  { name: 'expires_at', label: 'Expires', field: 'expires_at', align: 'left' as const, sortable: true },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'center' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

function isExpiringSoon(dateStr: string): boolean {
  if (!dateStr) return false
  const diff = new Date(dateStr).getTime() - Date.now()
  return diff > 0 && diff < 3 * 24 * 3600 * 1000 // within 3 days
}

async function loadExceptions() {
  loading.value = true
  try {
    const params: any = {}
    if (activeOnly.value) params.active_only = '1'
    if (agentFilter.value) params.agent_id = agentFilter.value
    exceptions.value = (await axios.get('/compliance/exceptions/', { params })).data
  } finally { loading.value = false }
}

async function loadAgents() {
  try {
    const r = await axios.get('/agents/')
    agentOptions.value = Array.isArray(r.data) ? r.data : r.data.agents ?? []
  } catch {}
}

async function loadRequirements() {
  try {
    // Flatten requirements from all levels
    const r = await axios.get('/compliance/levels/')
    const all: any[] = []
    for (const level of r.data ?? []) {
      for (const req of level.requirements ?? []) {
        all.push({ id: req.id, name: `[${level.name}] ${req.name}` })
      }
    }
    requirementOptions.value = all
  } catch {}
}

function openCreateDialog() {
  form.value = { agent_id: '', requirement: null, reason: '', expires_at: '', notes: '' }
  loadRequirements()
  dialogOpen.value = true
}

async function saveException() {
  if (!form.value.agent_id || !form.value.requirement || !form.value.reason || !form.value.expires_at) {
    $q.notify({ message: 'All required fields must be filled', color: 'warning' })
    return
  }
  saving.value = true
  try {
    await axios.post('/compliance/exceptions/', form.value)
    $q.notify({ message: 'Exception created', color: 'positive', icon: 'check' })
    dialogOpen.value = false
    await loadExceptions()
  } catch (e: any) {
    $q.notify({ message: `Failed: ${e?.message}`, color: 'negative' })
  } finally { saving.value = false }
}

async function revokeException(exc: any) {
  $q.dialog({ title: 'Revoke Exception?', message: `Revoke exception for "${exc.requirement_name}"?`,
    cancel: true, ok: { color: 'negative', label: 'Revoke' } })
    .onOk(async () => {
      await axios.post(`/compliance/exceptions/${exc.id}/revoke/`)
      $q.notify({ message: 'Exception revoked', color: 'positive' })
      await loadExceptions()
    })
}

onMounted(() => { loadExceptions(); loadAgents() })
</script>
