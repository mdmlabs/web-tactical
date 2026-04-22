<template>
  <div>
    <div class="text-h6 q-mb-md">Dashboard Overview</div>

    <!-- Stats cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="ssp-stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="devices" size="40px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.devices.length }}</div>
              <div class="text-caption text-grey">My Devices</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="ssp-stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="apps" size="40px" color="positive" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.installedAppsForUser.length }}</div>
              <div class="text-caption text-grey">Installed Apps</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="ssp-stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="vpn_key" size="40px" color="warning" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.rights.length }}</div>
              <div class="text-caption text-grey">Access Rights</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="ssp-stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="update" size="40px" color="info" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.appsNeedingUpdate.length }}</div>
              <div class="text-caption text-grey">Updates Available</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Admin stats -->
    <div v-if="store.isAdmin" class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="ssp-stat-card bg-orange-1">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="pending_actions" size="40px" color="orange" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.pendingApprovals.length }}</div>
              <div class="text-caption text-grey">Pending Approvals</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="ssp-stat-card bg-red-1">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="block" size="40px" color="negative" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ blacklistedCount }}</div>
              <div class="text-caption text-grey">Blacklisted Apps</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="ssp-stat-card bg-purple-1">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="event" size="40px" color="purple" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ store.deprecatingApps.length }}</div>
              <div class="text-caption text-grey">Deprecating Apps</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent activity + quick actions -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Recent Installations</div>
            <q-list separator v-if="recentInstallations.length > 0">
              <q-item v-for="inst in recentInstallations" :key="inst.id">
                <q-item-section avatar>
                  <q-icon :name="getStatusIcon(inst.status)" :color="getStatusColor(inst.status)" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ inst.appName }}</q-item-label>
                  <q-item-label caption>{{ inst.deviceName }} - v{{ inst.version }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge :color="getStatusColor(inst.status)">{{ inst.status }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-grey text-center q-pa-md">No recent installations</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Apps Needing Updates</div>
            <q-list separator v-if="store.appsNeedingUpdate.length > 0">
              <q-item v-for="app in store.appsNeedingUpdate" :key="app.id">
                <q-item-section avatar>
                  <q-icon :name="app.icon" color="warning" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ app.name }}</q-item-label>
                  <q-item-label caption>{{ app.version }} -> {{ app.latestVersion }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="warning" text-color="dark">Update</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-grey text-center q-pa-md">All apps up to date</div>
          </q-card-section>
        </q-card>

        <!-- Deprecation warnings -->
        <q-card v-if="store.deprecatingApps.length > 0" flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm text-negative">Deprecation Warnings</div>
            <q-list separator>
              <q-item v-for="app in store.deprecatingApps" :key="app.id">
                <q-item-section avatar>
                  <q-icon name="warning" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ app.name }}</q-item-label>
                  <q-item-label caption>Scheduled removal: {{ app.deprecationDate }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge v-if="daysUntilDeprecation(app.deprecationDate) <= 7" color="red">
                    {{ daysUntilDeprecation(app.deprecationDate) }}d left
                  </q-badge>
                  <q-badge v-else color="orange" text-color="dark">
                    {{ daysUntilDeprecation(app.deprecationDate) }}d left
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSelfServiceStore } from "@/stores/selfService";

const store = useSelfServiceStore();

const blacklistedCount = computed(() => store.apps.filter((a) => a.blacklisted).length);

const recentInstallations = computed(() =>
  [...store.installations].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)).slice(0, 5),
);

function getStatusIcon(status: string) {
  const map: Record<string, string> = {
    pending: "hourglass_top",
    approved: "check_circle",
    installing: "downloading",
    installed: "check_circle",
    failed: "error",
    rejected: "cancel",
  };
  return map[status] || "help";
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: "orange",
    approved: "info",
    installing: "info",
    installed: "positive",
    failed: "negative",
    rejected: "negative",
  };
  return map[status] || "grey";
}

function daysUntilDeprecation(date: string | null) {
  if (!date) return 999;
  const now = new Date();
  const dep = new Date(date);
  return Math.max(0, Math.ceil((dep.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
</script>

<style scoped>
.ssp-stat-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ssp-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
