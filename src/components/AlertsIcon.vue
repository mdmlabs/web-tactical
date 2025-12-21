<template>
  <q-btn flat dense class="alerts-button" no-caps no-wrap>
    <svg viewBox="0 0 448 512" class="bell">
      <path
        d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
      ></path>
    </svg>
    <q-badge
      v-if="alertsCount > 0"
      :color="badgeColor"
      floating
      transparent
      class="alerts-badge"
      >{{ alertsCountText() }}</q-badge
    >
    <q-menu
      :style="{ 'max-height': `${$q.screen.height - 100}px` }"
      anchor="bottom middle"
      self="top middle"
    >
      <q-list separator>
        <q-item v-if="alertsCount === 0">No New Alerts</q-item>
        <q-item v-for="alert in topAlerts" :key="alert.id">
          <q-item-section>
            <q-item-label overline
              ><router-link :to="`/agents/${alert.agent_id}`"
                >{{ alert.client }} - {{ alert.site }} -
                {{ alert.hostname }}</router-link
              ></q-item-label
            >
            <q-item-label lines="1">
              <q-icon
                size="xs"
                :class="`text-${alertIconColor(alert.severity)}`"
                :name="alert.severity"
              ></q-icon>
              {{ alert.message }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{
              getTimeLapse(alert.alert_time)
            }}</q-item-label>
            <q-item-label>
              <q-icon
                name="snooze"
                size="xs"
                class="cursor-pointer"
                @click="snoozeAlert(alert)"
                v-close-popup
              >
                <q-tooltip>Snooze alert</q-tooltip>
              </q-icon>
              <q-icon
                name="flag"
                size="xs"
                class="cursor-pointer"
                @click="resolveAlert(alert)"
                v-close-popup
              >
                <q-tooltip>Resolve alert</q-tooltip>
              </q-icon>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="showOverview"
          >View All Alerts ({{ alertsCount }})</q-item
        >
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapState } from "vuex";
import mixins from "@/mixins/mixins";
import AlertsOverview from "@/components/modals/alerts/AlertsOverview.vue";
import { getTimeLapse } from "@/utils/format";

export default {
  name: "AlertsIcon",
  mixins: [mixins],
  setup() {
    return {
      getTimeLapse,
    };
  },
  data() {
    return {
      alertsCount: 0,
      topAlerts: [],
      poll: null,
    };
  },
  computed: {
    ...mapState([
      "dash_info_color",
      "dash_warning_color",
      "dash_negative_color",
    ]),
    badgeColor() {
      const severities = this.topAlerts.map((alert) => alert.severity);

      if (severities.includes("error")) return this.dash_negative_color;
      else if (severities.includes("warning")) return this.dash_warning_color;
      else return this.dash_info_color;
    },
  },
  methods: {
    getAlerts() {
      this.$axios.patch("alerts/", { top: 10 }).then((r) => {
        this.alertsCount = r.data.alerts_count;
        this.topAlerts = r.data.alerts;
      });
    },
    showOverview() {
      this.$q
        .dialog({
          component: AlertsOverview,
        })
        .onDismiss(() => {
          this.getAlerts();
        });
    },
    snoozeAlert(alert) {
      this.$q
        .dialog({
          title: "Snooze Alert",
          message: "How many days to snooze alert?",
          prompt: {
            model: "",
            type: "number",
            isValid: (val) => !!val && val > 0 && val < 9999,
          },
          cancel: true,
        })
        .onOk((days) => {
          this.$q.loading.show();

          const data = {
            id: alert.id,
            type: "snooze",
            snooze_days: days,
          };

          this.$axios
            .put(`alerts/${alert.id}/`, data)
            .then(() => {
              this.getAlerts();
              this.$q.loading.hide();
              this.notifySuccess(`The alert has been snoozed for ${days} days`);
            })
            .catch(() => {
              this.$q.loading.hide();
            });
        });
    },
    resolveAlert(alert) {
      this.$q.loading.show();

      const data = {
        id: alert.id,
        type: "resolve",
      };

      this.$axios
        .put(`alerts/${alert.id}/`, data)
        .then(() => {
          this.getAlerts();
          this.$q.loading.hide();
          this.notifySuccess("The alert has been resolved");
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    alertIconColor(severity) {
      if (severity === "error") return this.dash_negative_color;
      else if (severity === "warning") return this.dash_warning_color;
      else return this.dash_info_color;
    },
    alertsCountText() {
      if (this.alertsCount > 99) return "99+";
      else return this.alertsCount;
    },
    pollAlerts() {
      this.poll = setInterval(
        () => {
          this.getAlerts();
        },
        60 * 1 * 1000,
      );
    },
  },
  mounted() {
    this.getAlerts();
    this.pollAlerts();
  },
  beforeUnmount() {
    clearInterval(this.poll);
  },
};
</script>

<style scoped>
.alerts-button {
  width: 30px;
  height: 30px;
  min-width: 30px;
  padding: 0 !important;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 50% !important;
  transition-duration: 0.3s;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  margin: 0 8px;
}

.alerts-button :deep(.q-btn__content) {
  padding: 0 !important;
  min-height: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bell {
  width: 18px;
}

.bell path {
  fill: white;
}

.alerts-button:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.alerts-button:hover .bell {
  animation: bellRing 0.9s both;
}

@keyframes bellRing {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-10deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-5deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}

.alerts-button:active {
  transform: scale(0.9);
}

.alerts-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 1;
  pointer-events: none;
}


.body--dark .alerts-button {
  background-color: rgba(50, 55, 60, 0.3) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
}

.body--dark .alerts-button:hover {
  background-color: rgba(50, 55, 60, 0.5) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.6),
    0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}
</style>
