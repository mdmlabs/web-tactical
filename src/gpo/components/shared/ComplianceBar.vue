<template>
  <div class="compliance-bar-container">
    <div v-if="loading" class="compliance-loading">
      <q-spinner size="xs" color="grey-6" />
      <span class="text-caption text-grey-6 q-ml-xs">Loading...</span>
    </div>
    <div v-else-if="total > 0" class="compliance-bar-wrapper">
      <q-tooltip
        class="compliance-tooltip"
        anchor="top middle"
        self="bottom middle"
        :offset="[0, 8]"
      >
        <div class="compliance-details">
          <div class="detail-header">Compliance Details</div>
          <div class="detail-row">
            <span class="detail-icon success">✓</span>
            <span class="detail-label">Assigned & Applied:</span>
            <span class="detail-value">{{ assignedAndApplied }} ({{ appliedPercent }}%)</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon warning">⚠</span>
            <span class="detail-label">Assigned but Pending:</span>
            <span class="detail-value">{{ assignedNotApplied }} ({{ pendingPercent }}%)</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon error">✗</span>
            <span class="detail-label">Not Assigned:</span>
            <span class="detail-value">{{ notAssigned }} ({{ notAssignedPercent }}%)</span>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-total">Total policies: {{ total }}</div>
        </div>
      </q-tooltip>
      <div class="compliance-bar">
        <template v-if="isAllNotAssigned">
          <div class="compliance-segment not-assigned" style="width: 100%">
            <span class="segment-label">0%</span>
          </div>
        </template>
        <template v-else>
          <div
            v-if="appliedPercent > 0"
            class="compliance-segment applied"
            :style="{ width: `${appliedPercent}%` }"
          >
            <span v-if="appliedPercent >= 12" class="segment-label">
              {{ appliedPercent }}%
            </span>
          </div>
          <div
            v-if="pendingPercent > 0"
            class="compliance-segment pending"
            :style="{ width: `${pendingPercent}%` }"
          >
            <span v-if="pendingPercent >= 12" class="segment-label">
              {{ pendingPercent }}%
            </span>
          </div>
          <div
            v-if="notAssignedPercent > 0"
            class="compliance-segment not-assigned"
            :style="{ width: `${notAssignedPercent}%` }"
          >
            <span v-if="notAssignedPercent >= 12" class="segment-label">
              {{ notAssignedPercent }}%
            </span>
          </div>
        </template>
      </div>
      <div class="compliance-legend">
        <span class="legend-item">
          <span class="legend-dot applied-dot"></span>
          {{ assignedAndApplied }}
        </span>
        <span class="legend-item">
          <span class="legend-dot pending-dot"></span>
          {{ assignedNotApplied }}
        </span>
        <span class="legend-item">
          <span class="legend-dot not-assigned-dot"></span>
          {{ notAssigned }}
        </span>
      </div>
    </div>
    <div v-else class="text-caption text-grey-5">—</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    assignedAndApplied?: number;
    assignedNotApplied?: number;
    notAssigned?: number;
    loading?: boolean;
  }>(),
  {
    assignedAndApplied: 0,
    assignedNotApplied: 0,
    notAssigned: 0,
    loading: false,
  },
);

const total = computed(() => props.assignedAndApplied + props.assignedNotApplied + props.notAssigned);

const isAllNotAssigned = computed(() => {
  return total.value > 0 && props.assignedAndApplied === 0 && props.assignedNotApplied === 0 && props.notAssigned === total.value;
});

const appliedPercent = computed(() => {
  if (total.value === 0) return 0;
  return Math.round((props.assignedAndApplied / total.value) * 100);
});

const pendingPercent = computed(() => {
  if (total.value === 0) return 0;
  return Math.round((props.assignedNotApplied / total.value) * 100);
});

const notAssignedPercent = computed(() => {
  if (total.value === 0) return 0;
  return Math.round((props.notAssigned / total.value) * 100);
});
</script>

<style scoped lang="sass">
.compliance-bar-container
  min-width: 180px
  display: flex
  flex-direction: column
  gap: 4px

.compliance-loading
  display: flex
  align-items: center
  gap: 4px

.compliance-bar-wrapper
  display: flex
  flex-direction: column
  gap: 4px
  cursor: help

.compliance-bar
  display: flex
  height: 24px
  border-radius: 4px
  overflow: hidden
  background: rgba(0, 0, 0, 0.05)
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1)

.compliance-segment
  display: flex
  align-items: center
  justify-content: center
  transition: width 0.3s ease
  position: relative

  &.applied
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)

  &.pending
    background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)

  &.not-assigned
    background: linear-gradient(135deg, #f44336 0%, #ef5350 100%)

.segment-label
  color: white
  font-size: 11px
  font-weight: 600
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)
  white-space: nowrap

.compliance-legend
  display: flex
  gap: 12px
  font-size: 11px
  color: rgba(0, 0, 0, 0.6)

.legend-item
  display: flex
  align-items: center
  gap: 4px

.legend-dot
  width: 8px
  height: 8px
  border-radius: 50%

  &.applied-dot
    background: #4caf50

  &.pending-dot
    background: #ff9800

  &.not-assigned-dot
    background: #f44336

.compliance-details
  padding: 8px 12px
  min-width: 280px

.detail-header
  font-weight: 600
  font-size: 13px
  margin-bottom: 8px
  color: white

.detail-row
  display: flex
  align-items: center
  gap: 8px
  padding: 4px 0
  font-size: 12px
  color: rgba(255, 255, 255, 0.95)

.detail-icon
  font-size: 14px
  width: 16px
  text-align: center

  &.success
    color: #4caf50

  &.warning
    color: #ff9800

  &.error
    color: #f44336

.detail-label
  flex: 1
  min-width: 140px

.detail-value
  font-weight: 600
  text-align: right

.detail-divider
  height: 1px
  background: rgba(255, 255, 255, 0.2)
  margin: 8px 0

.detail-total
  font-size: 12px
  color: rgba(255, 255, 255, 0.8)
  text-align: center
</style>
