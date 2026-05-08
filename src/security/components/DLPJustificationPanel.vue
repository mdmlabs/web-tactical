<template>
  <div>
    <!-- Filter bar -->
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn-toggle
        v-model="statusFilter"
        toggle-color="primary"
        :options="statusFilterOptions"
        dense unelevated
        @update:model-value="loadJustifications"
      />
      <q-space />
      <q-input v-model="agentFilter" :label="$t('security.components.DLPJustificationPanel.e6394b')" outlined dense clearable
        style="min-width: 200px;" @clear="loadJustifications" @keyup.enter="loadJustifications" />
      <q-btn flat round dense icon="refresh" :loading="loading" @click="loadJustifications" />
    </div>

    <!-- Pending badge -->
    <q-banner v-if="pendingCount > 0" dense class="bg-warning text-white q-mb-md rounded-borders">
      <template v-slot:avatar><q-icon name="warning" /></template>
      {{ pendingCount }} justification request{{ pendingCount !== 1 ? 's' : '' }} waiting for admin review.
    </q-banner>

    <!-- Table -->
    <q-table
      :rows="justifications"
      :columns="columns"
      dense flat row-key="id"
      :loading="loading"
      :rows-per-page-options="[20, 50, 100]"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip dense :color="statusColor(props.value)" text-color="white" size="sm">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-file_path="props">
        <q-td :props="props">
          <div style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            :title="props.value">
            {{ fileName(props.value) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-justification_text="props">
        <q-td :props="props">
          <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            :title="props.value">
            {{ props.value || '—' }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" auto-width>
          <template v-if="props.row.status === 'pending'">
            <q-btn flat dense round icon="check_circle" color="positive" size="sm"
              @click="review(props.row, 'approved')"
              :loading="reviewingId === props.row.id"
            >
              <q-tooltip>{{ $t('security.components.DLPJustificationPanel.7b2c7f') }}</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="cancel" color="negative" size="sm"
              @click="review(props.row, 'rejected')"
              :loading="reviewingId === props.row.id"
            >
              <q-tooltip>{{ $t('security.components.DLPJustificationPanel.2b03b5') }}</q-tooltip>
            </q-btn>
          </template>
          <q-btn flat dense round icon="info" color="primary" size="sm"
            @click="showDetail(props.row)">
            <q-tooltip>{{ $t('security.components.DLPJustificationPanel.dc3dec') }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Detail dialog -->
    <q-dialog v-model="detailOpen">
      <q-card style="min-width: 480px; max-width: 600px;">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('security.components.DLPJustificationPanel.29073a') }}</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="detailOpen = false" />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedRow">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.bae7d5') }}</q-item-label>
                <q-chip dense :color="statusColor(selectedRow.status)" text-color="white" size="sm">
                  {{ selectedRow.status }}
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.5ce2e6') }}</q-item-label>
                <q-item-label>{{ selectedRow.agent_id }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.9f8a23') }}</q-item-label>
                <q-item-label>{{ selectedRow.username || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.2c3caf') }}</q-item-label>
                <q-item-label>{{ selectedRow.file_path || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.b35abd') }}</q-item-label>
                <q-item-label>{{ selectedRow.action_type }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.73d305') }}</q-item-label>
                <q-item-label>{{ selectedRow.violation_type || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.abe002') }}</q-item-label>
                <q-item-label>{{ selectedRow.justification_text || '(no text provided)' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.c26bf6') }}</q-item-label>
                <q-item-label>{{ fmtDate(selectedRow.requested_at) }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.a99be3') }}</q-item-label>
                <q-item-label>{{ fmtDate(selectedRow.expires_at) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="selectedRow.reviewed_by_username">
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.3e5ca4') }}</q-item-label>
                <q-item-label>{{ selectedRow.reviewed_by_username }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ $t('security.components.DLPJustificationPanel.8fbff9') }}</q-item-label>
                <q-item-label>{{ selectedRow.review_note || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <template v-if="selectedRow.status === 'pending'">
            <q-separator class="q-my-md" />
            <div class="text-subtitle2 q-mb-sm">{{ $t('security.components.DLPJustificationPanel.cad94c') }}</div>
            <q-input v-model="reviewNote" outlined dense :label="$t('security.components.DLPJustificationPanel.8930d9')" />
            <div class="row q-gutter-sm q-mt-sm">
              <q-btn color="positive" :label="$t('security.components.DLPJustificationPanel.7b2c7f')" :loading="reviewingId === selectedRow.id"
                @click="review(selectedRow, 'approved'); detailOpen = false" />
              <q-btn color="negative" :label="$t('security.components.DLPJustificationPanel.2b03b5')" :loading="reviewingId === selectedRow.id"
                @click="review(selectedRow, 'rejected'); detailOpen = false" />
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const reviewingId = ref<number | null>(null)
const justifications = ref<any[]>([])
const statusFilter = ref('pending')
const agentFilter = ref('')
const detailOpen = ref(false)
const selectedRow = ref<any>(null)
const reviewNote = ref('')

const pendingCount = computed(() =>
  justifications.value.filter(j => j.status === 'pending').length
)

const statusFilterOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: '' },
]

const columns = [
  { name: 'requested_at', label: 'Time', field: 'requested_at', align: 'left' as const, sortable: true,
    format: (v: string) => v ? new Date(v).toLocaleString() : '—' },
  { name: 'agent_id', label: 'Agent', field: 'agent_id', align: 'left' as const },
  { name: 'username', label: 'User', field: 'username', align: 'left' as const },
  { name: 'action_type', label: 'Action', field: 'action_type', align: 'center' as const },
  { name: 'file_path', label: 'File', field: 'file_path', align: 'left' as const },
  { name: 'justification_text', label: 'Justification', field: 'justification_text', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'center' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'positive',
    rejected: 'negative',
    auto_approved: 'blue',
    timeout: 'grey',
  }
  return map[status] || 'grey'
}

function fileName(path: string): string {
  if (!path) return '—'
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1]
}

function fmtDate(d: string): string {
  return d ? new Date(d).toLocaleString() : '—'
}

function showDetail(row: any) {
  selectedRow.value = row
  reviewNote.value = ''
  detailOpen.value = true
}

async function loadJustifications() {
  loading.value = true
  try {
    const params: Record<string, string> = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (agentFilter.value) params.agent_id = agentFilter.value
    const resp = await axios.get('/security/dlp/justifications/', { params })
    justifications.value = resp.data
  } finally {
    loading.value = false
  }
}

async function review(row: any, decision: 'approved' | 'rejected') {
  reviewingId.value = row.id
  try {
    await axios.patch(`/security/dlp/justifications/${row.id}/`, {
      status: decision,
      review_note: reviewNote.value,
    })
    $q.notify({
      type: decision === 'approved' ? 'positive' : 'negative',
      message: `Justification ${decision}`,
    })
    await loadJustifications()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Review failed' })
  } finally {
    reviewingId.value = null
  }
}

onMounted(loadJustifications)
</script>
