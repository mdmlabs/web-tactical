<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="mdm-stat-card">
        <div class="mdm-stat-card__icon mdm-stat-card__icon--primary">
          <q-icon name="devices" size="24px" />
        </div>
        <div class="mdm-stat-card__value">{{ totalAgents }}</div>
        <div class="mdm-stat-card__label">Total Agents</div>
      </div>
    </div>
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="mdm-stat-card">
        <div class="mdm-stat-card__icon mdm-stat-card__icon--success">
          <q-icon name="wifi" size="24px" />
        </div>
        <div class="mdm-stat-card__value">{{ onlineAgents }}</div>
        <div class="mdm-stat-card__label">Online Agents</div>
      </div>
    </div>
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="mdm-stat-card">
        <div class="mdm-stat-card__icon mdm-stat-card__icon--danger">
          <q-icon name="warning" size="24px" />
        </div>
        <div class="mdm-stat-card__value">{{ criticalAlerts }}</div>
        <div class="mdm-stat-card__label">Critical Alerts</div>
      </div>
    </div>
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="mdm-stat-card">
        <div class="mdm-stat-card__icon mdm-stat-card__icon--warning">
          <q-icon name="shield" size="24px" />
        </div>
        <div class="mdm-stat-card__value">{{ offlineAgents }}</div>
        <div class="mdm-stat-card__label">Offline Agents</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const agents = computed(() => store.state.agents || []);
const totalAgents = computed(() => agents.value.length);
const onlineAgents = computed(
  () => agents.value.filter((a) => a.status === "online").length,
);
const offlineAgents = computed(
  () =>
    agents.value.filter(
      (a) => a.status === "offline" || a.status === "overdue",
    ).length,
);
const criticalAlerts = computed(() => {
  return agents.value.filter(
    (a) => a.checks && a.checks.failing && parseInt(a.checks.failing) > 0,
  ).length;
});
</script>
