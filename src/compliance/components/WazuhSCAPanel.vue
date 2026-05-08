<template>
  <div>
    <!-- Config Card -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2">{{ $t('compliance.components.WazuhSCAPanel.84453c') }}</div>
          <div class="row q-gutter-sm">
            <q-btn flat color="primary" icon="settings" :label="$t('compliance.components.WazuhSCAPanel.d1e319')" @click="openConnectorSettings" />
            <q-btn outline color="primary" icon="sync" :label="$t('compliance.components.WazuhSCAPanel.c91134')" :loading="syncing" @click="triggerSync" />
            <q-btn color="primary" icon="save" :label="$t('compliance.components.WazuhSCAPanel.c6606c')" :loading="savingConfig" @click="saveConfig" />
          </div>
        </div>

        <q-banner v-if="!config.enabled" dense class="bg-grey-2 q-mb-sm rounded-borders">
          <template v-slot:avatar><q-icon name="info" color="grey-7" /></template>
          {{ $t('compliance.components.WazuhSCAPanel.d2acf6') }}
        </q-banner>

        <div class="row q-gutter-md">
          <q-input v-model="config.wazuh_api_url" :label="$t('compliance.components.WazuhSCAPanel.97adce')"
            hint="https://security-manager:55000" outlined dense class="col-12 col-md-5" />
          <q-input v-model="config.wazuh_user" :label="$t('compliance.components.WazuhSCAPanel.be80e1')"
            hint='Default service account' outlined dense class="col-12 col-md-3" />
          <q-input v-model="config.wazuh_password" :label="$t('compliance.components.WazuhSCAPanel.c75e21')"
            type="password" outlined dense class="col-12 col-md-3" />
        </div>

        <div class="row q-gutter-md q-mt-sm">
          <q-input v-model.number="config.poll_interval_minutes" :label="$t('compliance.components.WazuhSCAPanel.d125d9')"
            type="number" outlined dense style="max-width:180px" :hint="syncIntervalHint" />
          <div class="col">
            <div class="text-caption text-grey-7 q-mb-xs">{{ $t('compliance.components.WazuhSCAPanel.0e8e92') }}</div>
            <q-select v-model="config.sca_policy_filter" :label="$t('compliance.components.WazuhSCAPanel.995589')"
              outlined dense use-input use-chips multiple
              :options="availablePolicies" emit-value
              input-debounce="0"
              @new-value="(val, done) => done(val.trim(), 'add-unique')"
              :hint="$t('compliance.components.WazuhSCAPanel.3b07be')"
            />
          </div>
          <q-toggle v-model="config.enabled" :label="$t('compliance.components.WazuhSCAPanel.d746c0')" color="positive" class="self-center" />
        </div>

        <div class="q-mt-sm">
          <div class="text-caption text-grey-7 q-mb-xs">{{ $t('compliance.components.WazuhSCAPanel.987ee0') }}</div>
          <div v-for="(wazuhId, mdmId) in config.agent_id_mapping" :key="mdmId" class="row q-gutter-xs q-mb-xs">
            <q-input :model-value="mdmId" :label="$t('compliance.components.WazuhSCAPanel.d9e5e4')" outlined dense class="col"
              @update:model-value="(v) => updateMappingKey(mdmId, v)" />
            <q-icon name="arrow_forward" class="self-center" />
            <q-input :model-value="wazuhId" :label="$t('compliance.components.WazuhSCAPanel.44fbe3')" outlined dense class="col"
              @update:model-value="(v) => updateMappingValue(mdmId, v)" />
            <q-btn flat dense round icon="delete" color="negative"
              @click="deleteMapping(mdmId)" />
          </div>
          <q-btn flat dense icon="add" :label="$t('compliance.components.WazuhSCAPanel.7830de')" color="primary" @click="addMapping" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Results Table -->
    <div class="row items-center q-gutter-sm q-mb-sm">
      <div class="text-subtitle2 col">{{ $t('compliance.components.WazuhSCAPanel.ca29ad') }}</div>
      <q-select v-model="resultsFilter.policy_id" :options="availablePolicies" :label="$t('compliance.components.WazuhSCAPanel.bb9cf1')"
        outlined dense clearable emit-value style="min-width:220px" @update:model-value="applyFilters" />
      <q-select v-model="resultsFilter.result"
        :options="[{label:'Passed',value:'passed'},{label:'Failed',value:'failed'},{label:'N/A',value:'not_applicable'}]"
        :label="$t('compliance.components.WazuhSCAPanel.5faa59')" outlined dense clearable emit-value style="min-width:130px"
        @update:model-value="applyFilters" />
      <q-input v-model="resultsFilter.agent_id" :label="$t('compliance.components.WazuhSCAPanel.9f2c11')" outlined dense clearable
        style="min-width:180px" @update:model-value="applyFilters" />
    </div>

    <!-- Summary chips -->
    <div class="row q-gutter-sm q-mb-md" v-if="hasResultsSummary">
      <q-chip icon="check_circle" color="positive" text-color="white" dense>{{ resultsSummary.passed }} Passed</q-chip>
      <q-chip icon="cancel" color="negative" text-color="white" dense>{{ resultsSummary.failed }} Failed</q-chip>
      <q-chip icon="remove_circle" color="grey" text-color="white" dense>{{ resultsSummary.na }} N/A</q-chip>
      <q-chip v-if="resultsSummary.total > 0" color="primary" text-color="white" dense>
        Pass rate: {{ Math.round((resultsSummary.passed / (resultsSummary.passed + resultsSummary.failed || 1)) * 100) }}%
      </q-chip>
    </div>

    <q-table
      :rows="results"
      :columns="columns"
      dense row-key="id"
      :loading="loadingResults"
      v-model:pagination="pagination"
      :rows-per-page-options="[50, 100, 200]"
      @request="onResultsRequest"
    >
      <template v-slot:body-cell-result="props">
        <q-td :props="props">
          <q-chip dense
            :color="{ passed: 'positive', failed: 'negative', not_applicable: 'grey' }[props.value] ?? 'grey'"
            text-color="white" size="sm">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-check_title="props">
        <q-td :props="props">
          <div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis"
            :title="props.value">{{ props.value }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-remediation="props">
        <q-td :props="props">
          <q-btn v-if="props.value" flat dense round icon="info" size="sm" color="primary">
            <q-tooltip max-width="300px">{{ props.value }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const config = ref<any>({
  label: 'default',
  wazuh_api_url: '',
  wazuh_user: 'wazuh-wui',
  wazuh_password: '',
  enabled: false,
  poll_interval_minutes: 30,
  sca_policy_filter: [],
  agent_id_mapping: {},
})

const savingConfig = ref(false)
const syncing = ref(false)
const loadingResults = ref(false)
const results = ref<any[]>([])
const resultsFilter = ref({ agent_id: '', policy_id: '', result: '' })
const resultsSummary = ref({ passed: 0, failed: 0, na: 0, total: 0 })
const schedulerSummary = ref({
  configured_poll_interval_minutes: 30,
  scheduler_tick_minutes: 5,
  effective_poll_interval_minutes: 30,
})
const pagination = ref({
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
  sortBy: 'fetched_at',
  descending: true,
})

const availablePolicies = ref<string[]>([])

const columns = [
  { name: 'agent_id', label: 'Agent', field: 'agent_id', align: 'left' as const, sortable: true },
  { name: 'policy_id', label: 'Policy', field: 'policy_id', align: 'left' as const },
  { name: 'check_id', label: 'ID', field: 'check_id', align: 'center' as const },
  { name: 'check_title', label: 'Check', field: 'check_title', align: 'left' as const },
  { name: 'result', label: 'Result', field: 'result', align: 'center' as const },
  { name: 'remediation', label: 'Fix', field: 'remediation', align: 'center' as const },
  { name: 'fetched_at', label: 'Fetched', field: 'fetched_at', align: 'left' as const,
    format: (v: string) => v ? new Date(v).toLocaleString() : '—' },
]

const hasResultsSummary = computed(() => resultsSummary.value.total > 0)
const syncIntervalHint = computed(() =>
  `Worker wakes every ${schedulerSummary.value.scheduler_tick_minutes} min; effective cadence ${schedulerSummary.value.effective_poll_interval_minutes} min`
)

async function loadConfig() {
  try {
    const r = await axios.get('/compliance/integrations/wazuh/')
    if (r.data?.length) {
      config.value = { ...config.value, ...r.data[0] }
      mergePolicies(config.value.sca_policy_filter || [])
    }
  } catch { /* no config yet */ }
}

async function loadConnectorSummary() {
  try {
    const { data } = await axios.get('/compliance/integrations/cyber-defense/summary/')
    schedulerSummary.value = {
      configured_poll_interval_minutes: data?.configured_poll_interval_minutes ?? schedulerSummary.value.configured_poll_interval_minutes,
      scheduler_tick_minutes: data?.scheduler_tick_minutes ?? schedulerSummary.value.scheduler_tick_minutes,
      effective_poll_interval_minutes: data?.effective_poll_interval_minutes ?? schedulerSummary.value.effective_poll_interval_minutes,
    }
  } catch { /* optional */ }
}

async function loadPolicies() {
  try {
    const { data } = await axios.get('/compliance/integrations/wazuh/policies/')
    mergePolicies([
      ...(data?.items || []).map((item: any) => item.policy_id).filter(Boolean),
      ...((data?.configured_filter || []).filter(Boolean)),
    ])
  } catch { /* optional */ }
}

async function saveConfig() {
  savingConfig.value = true
  try {
    const payload = { ...config.value }
    if (payload.wazuh_password === '***') delete payload.wazuh_password
    if (config.value?.id) {
      await axios.patch('/compliance/integrations/wazuh/', payload)
    } else {
      await axios.post('/compliance/integrations/wazuh/', payload)
    }
    $q.notify({ message: 'Cyber Defense posture config saved', color: 'positive', icon: 'check' })
    await Promise.all([loadConfig(), loadPolicies(), loadConnectorSummary()])
  } catch (e: any) {
    $q.notify({ message: `Save failed: ${e?.message}`, color: 'negative' })
  } finally { savingConfig.value = false }
}

async function triggerSync() {
  syncing.value = true
  try {
    await axios.post('/compliance/integrations/wazuh/sync/')
    $q.notify({ message: 'SCA sync triggered — results will appear in ~30s', color: 'info', icon: 'sync' })
    setTimeout(() => {
      loadResults()
      loadConnectorSummary()
    }, 10000)
  } catch (e: any) {
    $q.notify({ message: `Sync failed: ${e?.message}`, color: 'negative' })
  } finally { syncing.value = false }
}

async function loadResults(nextPagination = pagination.value) {
  loadingResults.value = true
  try {
    const params: any = {}
    if (resultsFilter.value.agent_id) params.agent_id = resultsFilter.value.agent_id
    if (resultsFilter.value.policy_id) params.policy_id = resultsFilter.value.policy_id
    if (resultsFilter.value.result) params.result = resultsFilter.value.result
    params.limit = nextPagination.rowsPerPage
    params.offset = (nextPagination.page - 1) * nextPagination.rowsPerPage
    params.ordering = `${nextPagination.descending ? '-' : ''}${nextPagination.sortBy || 'fetched_at'}`
    const data = (await axios.get('/compliance/integrations/wazuh/results/', { params })).data || {}
    results.value = data.items || []
    resultsSummary.value = {
      passed: data.summary?.passed || 0,
      failed: data.summary?.failed || 0,
      na: data.summary?.not_applicable || 0,
      total: data.count || 0,
    }
    pagination.value = {
      ...pagination.value,
      ...nextPagination,
      rowsNumber: data.count || 0,
    }
    mergePolicies(results.value.map((item: any) => item.policy_id).filter(Boolean))
  } finally { loadingResults.value = false }
}

function onResultsRequest(props: any) {
  loadResults(props.pagination)
}

function applyFilters() {
  loadResults({ ...pagination.value, page: 1 })
}

function mergePolicies(values: string[]) {
  const merged = new Set([
    ...availablePolicies.value,
    ...values,
  ].filter(Boolean))
  availablePolicies.value = Array.from(merged).sort()
}

function addMapping() {
  config.value.agent_id_mapping = { ...config.value.agent_id_mapping, '': '' }
}

function updateMappingKey(oldKey: string, newKey: string) {
  const val = config.value.agent_id_mapping[oldKey]
  const m = { ...config.value.agent_id_mapping }
  delete m[oldKey]
  m[newKey] = val
  config.value.agent_id_mapping = m
}

function updateMappingValue(key: string, val: string) {
  config.value.agent_id_mapping = { ...config.value.agent_id_mapping, [key]: val }
}

function deleteMapping(key: string) {
  const m = { ...config.value.agent_id_mapping }
  delete m[key]
  config.value.agent_id_mapping = m
}

function openConnectorSettings() {
  router.push({ path: '/cyber-defense', query: { tab: 'administration' } })
}

onMounted(() => {
  loadConfig()
  loadPolicies()
  loadConnectorSummary()
  applyFilters()
})
</script>
