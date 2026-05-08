<template>
  <div>
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-select v-model="agentId" :options="agentOptions" option-label="hostname" option-value="agent_id"
        emit-value map-options :label="$t('compliance.components.ComplianceTimelinePanel.87a475')" outlined dense use-input input-debounce="0"
        style="min-width:240px" @update:model-value="loadTimeline">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section><q-item-label>{{ scope.opt.hostname }}</q-item-label>
              <q-item-label caption>{{ scope.opt.agent_id }}</q-item-label></q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn-toggle v-model="days" toggle-color="primary"
        :options="[{label:'7d',value:7},{label:'30d',value:30},{label:'90d',value:90}]"
        dense unelevated @update:model-value="loadTimeline" />
      <q-btn flat round dense icon="refresh" :loading="loading" @click="loadTimeline" />
    </div>

    <div v-if="!agentId" class="text-center text-grey-5 q-pa-xl">
      <q-icon name="timeline" size="3rem" />
      <div class="q-mt-sm">{{ $t('compliance.components.ComplianceTimelinePanel.a2c810') }}</div>
    </div>

    <div v-else-if="timeline.length === 0 && !loading" class="text-center text-grey-5 q-pa-xl">
      <q-icon name="history" size="3rem" />
      <div class="q-mt-sm">{{ $t('compliance.components.ComplianceTimelinePanel.7768df') }}</div>
    </div>

    <div v-else>
      <!-- Status change chart (simple bar representation) -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ $t('compliance.components.ComplianceTimelinePanel.e08168') }}</div>
          <div class="row items-end q-gutter-xs" style="height:60px">
            <div v-for="(entry, i) in timelineChart" :key="i"
              class="col" style="min-width:8px; border-radius:2px 2px 0 0;"
              :style="`background:${statusColor(entry.effective_status)}; height:${entry.height}%`"
              :title="`${entry.effective_status} — ${entry.recorded_at}`"
            />
          </div>
          <div class="row text-caption text-grey-6 q-mt-xs justify-between">
            <span>{{ timeline[timeline.length - 1]?.recorded_at?.slice(0, 10) }}</span>
            <span>{{ timeline[0]?.recorded_at?.slice(0, 10) }}</span>
          </div>
        </q-card-section>
      </q-card>

      <!-- Timeline list -->
      <q-timeline color="primary" class="q-px-sm">
        <q-timeline-entry
          v-for="entry in timeline.slice(0, 100)"
          :key="entry.id"
          :subtitle="new Date(entry.recorded_at).toLocaleString()"
          :color="statusColor(entry.effective_status)"
          :icon="statusIcon(entry.effective_status)"
        >
          <template v-slot:title>
            <span class="text-weight-medium">{{ entry.effective_status }}</span>
            <q-chip dense :color="accessColor(entry.access_state)" text-color="white" size="xs" class="q-ml-xs">
              {{ entry.access_state }}
            </q-chip>
            <q-chip v-if="entry.level_name" dense color="grey-6" text-color="white" size="xs" class="q-ml-xs">
              {{ entry.level_name }}
            </q-chip>
          </template>

          <div class="text-body2">
            {{ $t('compliance.components.ComplianceTimelinePanel.951174') }} <strong>{{ entry.risk_score }}</strong>
            {{ $t('compliance.components.ComplianceTimelinePanel.ae8956') }} <strong>{{ entry.failing_requirements_count }}</strong>
            {{ $t('compliance.components.ComplianceTimelinePanel.d1cd24') }} <strong>{{ entry.critical_violations_count }}</strong>
            <span v-if="entry.triggered_by" class="text-caption text-grey-6"> &nbsp;({{ entry.triggered_by }})</span>
          </div>
          <div v-if="entry.evidence_snapshot?.length" class="q-mt-xs">
            <q-chip v-for="ev in entry.evidence_snapshot.slice(0, 5)" :key="ev.requirement"
              dense :color="severityColor(ev.severity)" text-color="white" size="xs" class="q-mr-xs">
              {{ ev.requirement }}
            </q-chip>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const agentId = ref('')
const days = ref(30)
const loading = ref(false)
const timeline = ref<any[]>([])
const agentOptions = ref<any[]>([])

const timelineChart = computed(() => {
  if (!timeline.value.length) return []
  const items = [...timeline.value].reverse().slice(-60)
  return items.map(e => ({
    ...e,
    height: e.risk_score > 0 ? Math.max(20, e.risk_score) : 5,
  }))
})

function statusColor(s: string): string {
  return { compliant: '#21ba45', non_compliant: '#c10015', warn: '#f2c037',
    error: '#6c2c91', grace: '#ff9800', stale: '#9e9e9e', unknown: '#bdbdbd' }[s] ?? '#bdbdbd'
}
function statusIcon(s: string): string {
  return { compliant: 'check_circle', non_compliant: 'cancel', warn: 'warning',
    error: 'error', grace: 'hourglass_empty', stale: 'update', unknown: 'help' }[s] ?? 'circle'
}
function accessColor(s: string): string {
  return { allowed: 'positive', grace_period: 'warning', blocked: 'negative',
    quarantined: 'deep-purple', review: 'orange' }[s] ?? 'grey'
}
function severityColor(s: string): string {
  return { low: 'grey-7', medium: 'primary', high: 'warning', critical: 'negative' }[s] ?? 'primary'
}

async function loadTimeline() {
  if (!agentId.value) return
  loading.value = true
  try {
    timeline.value = (await axios.get(`/compliance/history/${agentId.value}/`, { params: { days: days.value } })).data
  } finally { loading.value = false }
}

async function loadAgents() {
  try {
    const r = await axios.get('/agents/')
    agentOptions.value = Array.isArray(r.data) ? r.data : r.data.agents ?? r.data.results ?? []
  } catch {}
}

onMounted(loadAgents)
</script>
