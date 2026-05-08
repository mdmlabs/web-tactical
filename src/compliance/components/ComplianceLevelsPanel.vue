<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="mdm-section-title">{{ $t('compliance.components.ComplianceLevelsPanel.6c9d69') }}</div>
        <div class="mdm-section-subtitle">{{ $t('compliance.components.ComplianceLevelsPanel.20ce17') }}</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn outline color="primary" icon="add" :label="$t('compliance.components.ComplianceLevelsPanel.e7a338')" @click="$emit('create-level')" />
        <q-btn color="primary" icon="save" :label="$t('compliance.components.ComplianceLevelsPanel.d17fea')" @click="$emit('save')" :loading="savingLevels" :disable="loadingLevels" />
      </div>
    </div>

    <div class="row q-gutter-md q-mb-lg">
      <q-card
        v-for="level in levels"
        :key="level.id"
        flat bordered class="col compliance-level-card"
        :style="`border-color: ${level.color}; border-width: 2px`"
      >
        <q-card-section>
          <div class="row items-center q-mb-sm">
            <div class="compliance-level-badge q-mr-sm" :style="`background: ${level.color}22; color: ${level.color}`">
              {{ level.rank }}
            </div>
            <div class="col">
              <div class="text-subtitle2">{{ level.name }}</div>
              <div class="text-caption text-grey">{{ level.description }}</div>
              <q-chip v-if="level.applies_to_enrollment && level.applies_to_enrollment !== 'all'"
                dense size="xs" color="teal" text-color="white" class="q-mt-xs">
                {{ level.applies_to_enrollment.toUpperCase() }} only
              </q-chip>
            </div>
            <q-btn flat dense round icon="edit" size="sm" color="primary" @click="$emit('edit-level', level)" :title="$t('compliance.components.ComplianceLevelsPanel.afeaa0')" />
            <q-btn flat dense round icon="delete" size="sm" color="negative" @click="$emit('delete-level', level)" :title="$t('compliance.components.ComplianceLevelsPanel.d4304a')" />
            <q-btn flat dense round icon="open_in_new" size="sm" @click="$emit('open-level', level.id)" :title="$t('compliance.components.ComplianceLevelsPanel.f9ede9')" />
          </div>

          <div class="row items-center q-gutter-sm q-mb-sm">
            <q-linear-progress
              :value="level.compliance_rate / 100"
              :color="level.compliance_rate >= 90 ? 'positive' : level.compliance_rate >= 70 ? 'warning' : 'negative'"
              rounded class="col"
              style="height: 10px"
            />
            <span class="text-weight-bold" :style="`color: ${level.color}`">{{ level.compliance_rate }}%</span>
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.df485c') }}</div>
              <div class="text-weight-medium">{{ level.device_count }}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.62b5f9') }}</div>
              <div class="text-weight-medium">{{ level.risk_score }}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.ab66e8') }}</div>
              <div class="text-weight-medium">{{ level.critical_violations_count }}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.22f4dc') }}</div>
              <div class="text-weight-medium">{{ level.failing_requirements_count }}</div>
            </div>
          </div>

          <div class="row items-center q-mb-xs">
            <div class="text-caption text-grey col">{{ $t('compliance.components.ComplianceLevelsPanel.475ffa') }}</div>
            <q-btn
              flat dense round icon="add_circle_outline" size="xs" color="primary"
              @click="$emit('add-requirement', level)"
              :title="$t('compliance.components.ComplianceLevelsPanel.8bcf66')"
            />
          </div>
          <q-chip
            v-for="req in level.requirements"
            :key="req.id"
            dense
            :color="severityColor(req.severity)"
            text-color="white"
            size="sm"
            class="q-ma-xs cursor-pointer"
            clickable
            @click="$emit('edit-requirement', { level, requirement: req })"
          >
            {{ req.name }}
            <q-tooltip>Click to edit · {{ req.source_type }}{{ req.source_key ? ` (${req.source_key})` : '' }}</q-tooltip>
          </q-chip>

          <div class="q-mt-sm">
            <q-select
              v-model="level.assigned_site_ids"
              multiple use-chips
              :options="siteOptions"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :label="$t('compliance.components.ComplianceLevelsPanel.364a4d')"
              outlined dense
              :loading="loadingLevels"
            />
          </div>

          <div class="q-mt-sm">
            <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.ComplianceLevelsPanel.b2cf75') }}</div>
            <q-chip
              v-for="item in level.top_failing_requirements || []"
              :key="`${level.id}-${item.requirement}`"
              dense color="negative" text-color="white" size="sm" class="q-ma-xs"
            >
              {{ item.requirement }} ({{ item.count }})
            </q-chip>
            <div v-if="!(level.top_failing_requirements || []).length" class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.843a5c') }}</div>
          </div>

          <div class="q-mt-sm">
            <div class="text-caption text-grey q-mb-xs">{{ $t('compliance.components.ComplianceLevelsPanel.b9ca1f') }}</div>
            <q-list dense bordered separator v-if="(level.affected_devices || []).length">
              <q-item
                v-for="device in (level.affected_devices || []).slice(0, 3)"
                :key="`${level.id}-${device.agent_id}`"
                clickable
                @click="$emit('open-device', device.agent_id)"
              >
                <q-item-section>
                  <q-item-label>{{ device.hostname }}</q-item-label>
                  <q-item-label caption>{{ device.site_name }} · {{ device.access_state }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip dense :color="statusColor(device.effective_status)" text-color="white" size="sm">
                    {{ device.effective_status }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-caption text-grey">{{ $t('compliance.components.ComplianceLevelsPanel.ee5377') }}</div>
          </div>

          <div class="row justify-between items-center q-mt-sm">
            <q-chip dense :color="healthStatusColor(level.health_status)" text-color="white" size="sm">
              {{ healthStatusLabel(level.health_status) }}
            </q-chip>
            <div class="text-caption text-grey">Last check: {{ level.last_checked || "n/a" }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">{{ $t('compliance.components.ComplianceLevelsPanel.11162d') }}</div>
        <q-table
          :rows="requirementsMatrix"
          :columns="matrixColumns"
          dense row-key="key"
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template v-slot:body-cell-requirement="props">
            <q-td :props="props">
              <div>{{ props.value }}</div>
              <div class="text-caption text-grey-6">{{ requirementSourceLabel(props.row) }}</div>
            </q-td>
          </template>
          <template v-for="col in matrixLevelColumnNames" :key="col" v-slot:[`body-cell-${col}`]="props">
            <q-td :key="col" :props="props" class="text-center">
              <q-icon :name="props.value ? 'check_circle' : 'radio_button_unchecked'" :color="props.value ? 'positive' : 'grey'" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  levels: any[];
  requirementsMatrix: any[];
  matrixColumns: any[];
  matrixLevelColumnNames: string[];
  siteOptions: any[];
  loadingLevels: boolean;
  savingLevels: boolean;
}>();

defineEmits<{
  (e: "save"): void;
  (e: "create-level"): void;
  (e: "edit-level", level: any): void;
  (e: "delete-level", level: any): void;
  (e: "add-requirement", level: any): void;
  (e: "edit-requirement", payload: { level: any; requirement: any }): void;
  (e: "open-level", levelId: number): void;
  (e: "open-device", agentId: string): void;
}>();

function healthStatusColor(status: string) {
  return { compliant: "positive", action_needed: "warning", review: "orange", no_devices: "grey-6" }[status] ?? "grey";
}

function healthStatusLabel(status: string) {
  return { compliant: "Compliant", action_needed: "Action Needed", review: "Needs Review", no_devices: "No Devices" }[status] ?? status;
}

function severityColor(severity: string) {
  return { low: "grey-7", medium: "primary", high: "warning", critical: "negative" }[severity] ?? "primary";
}

function statusColor(status: string) {
  return { compliant: "positive", non_compliant: "negative", pending: "warning", stale: "orange", unknown: "grey" }[status] ?? "grey";
}

function requirementSourceLabel(row: Record<string, any>) {
  const typeLabels: Record<string, string> = {
    manual: "Manual",
    compliance_check: "Compliance Check",
    security_task: "Security Task",
    security_baseline: "Security Baseline",
    external_integration: "External Integration",
  };
  const sourceType = typeLabels[row.source_type] ?? "Unknown Source";
  return row.source_key ? `${sourceType}: ${row.source_key}` : sourceType;
}
</script>
