<template>
  <UIKitLayout>
    <div class="uk-device-detail uk-theme-dark">
      <!-- Back + Device Header -->
      <div class="uk-device-header">
        <button class="uk-back-btn" @click="$router.back()">
          <q-icon name="arrow_back" size="18px" />
          <span>Back to Agents</span>
        </button>

        <div class="uk-device-header__main">
          <div class="uk-device-header__info">
            <div class="uk-device-header__title-row">
              <span :class="['uk-status-dot', `uk-status-dot--${agent.status}`]"></span>
              <h1 class="uk-device-header__hostname">{{ agent.hostname }}</h1>
              <span :class="['uk-badge', `uk-badge--${statusBadge}`]">{{ agent.status }}</span>
              <span v-for="tag in agent.tags" :key="tag" class="uk-badge uk-badge--neutral">{{ tag }}</span>
            </div>
            <div class="uk-device-header__meta">
              <span>{{ agent.os }}</span>
              <span class="uk-meta-sep">|</span>
              <span>{{ agent.clientName }} / {{ agent.siteName }}</span>
              <span class="uk-meta-sep">|</span>
              <span>{{ agent.ipAddress }}</span>
              <span class="uk-meta-sep">|</span>
              <span>Agent v{{ agent.agentVersion }}</span>
            </div>
          </div>

          <div class="uk-device-header__actions">
            <button class="uk-btn uk-btn--secondary uk-btn--sm">
              <q-icon name="terminal" size="16px" />
              Terminal
            </button>
            <button class="uk-btn uk-btn--secondary uk-btn--sm">
              <q-icon name="desktop_windows" size="16px" />
              Remote
            </button>
            <button class="uk-btn uk-btn--primary uk-btn--sm">
              <q-icon name="send" size="16px" />
              Run Script
            </button>
            <button class="uk-btn uk-btn--secondary uk-btn--sm">
              <q-icon name="more_horiz" size="16px" />
            </button>
          </div>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div class="uk-metrics-row">
        <div class="uk-metric-card">
          <div class="uk-metric-card__label">CPU</div>
          <div class="uk-metric-card__value">
            <span :class="['uk-metric-card__number', cpuClass]">{{ agent.cpuUsage }}%</span>
          </div>
          <div class="uk-metric-card__bar">
            <div
              class="uk-metric-card__bar-fill"
              :style="{ width: agent.cpuUsage + '%', background: getMetricColor(agent.cpuUsage) }"
            ></div>
          </div>
        </div>

        <div class="uk-metric-card">
          <div class="uk-metric-card__label">Memory</div>
          <div class="uk-metric-card__value">
            <span :class="['uk-metric-card__number', memClass]">{{ agent.memoryUsage }}%</span>
          </div>
          <div class="uk-metric-card__bar">
            <div
              class="uk-metric-card__bar-fill"
              :style="{ width: agent.memoryUsage + '%', background: getMetricColor(agent.memoryUsage) }"
            ></div>
          </div>
        </div>

        <div class="uk-metric-card">
          <div class="uk-metric-card__label">Disk</div>
          <div class="uk-metric-card__value">
            <span :class="['uk-metric-card__number', diskClass]">{{ agent.diskUsage }}%</span>
          </div>
          <div class="uk-metric-card__bar">
            <div
              class="uk-metric-card__bar-fill"
              :style="{ width: agent.diskUsage + '%', background: getMetricColor(agent.diskUsage) }"
            ></div>
          </div>
        </div>

        <div class="uk-metric-card">
          <div class="uk-metric-card__label">Uptime</div>
          <div class="uk-metric-card__value">
            <span class="uk-metric-card__number">{{ agent.uptime }}</span>
          </div>
          <div class="uk-metric-card__sub">Boot: {{ agent.bootTime }}</div>
        </div>

        <div class="uk-metric-card">
          <div class="uk-metric-card__label">Checks</div>
          <div class="uk-metric-card__checks">
            <span class="uk-metric-card__check uk-metric-card__check--pass">{{ agent.checksPassing }}</span>
            <span class="uk-metric-card__check uk-metric-card__check--warn">{{ agent.checksWarning }}</span>
            <span class="uk-metric-card__check uk-metric-card__check--fail">{{ agent.checksFailing }}</span>
          </div>
          <div class="uk-metric-card__sub">{{ agent.checksPassing + agent.checksWarning + agent.checksFailing }} total</div>
        </div>

        <div class="uk-metric-card">
          <div class="uk-metric-card__label">Policy</div>
          <div class="uk-metric-card__value">
            <span :class="['uk-badge', `uk-badge--${policyBadge}`]">{{ agent.policyStatus }}</span>
          </div>
          <div class="uk-metric-card__sub" v-if="agent.needsReboot">
            <span class="uk-badge uk-badge--warning">Reboot needed</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="uk-detail-tabs">
        <button
          v-for="tab in detailTabs"
          :key="tab.id"
          :class="['uk-detail-tab', { 'uk-detail-tab--active': activeDetailTab === tab.id }]"
          @click="activeDetailTab = tab.id"
        >
          <q-icon :name="tab.icon" size="16px" />
          {{ tab.label }}
          <span v-if="tab.badge" :class="['uk-detail-tab__badge', `uk-detail-tab__badge--${tab.badgeType || 'default'}`]">
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="uk-detail-content">
        <!-- Overview Tab -->
        <div v-if="activeDetailTab === 'overview'" class="uk-detail-panel">
          <div class="uk-detail-grid">
            <!-- System Info -->
            <div class="uk-info-section">
              <h3 class="uk-info-section__title">System Information</h3>
              <div class="uk-info-list">
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Operating System</span>
                  <span class="uk-info-row__value">{{ agent.os }} ({{ agent.osVersion }})</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Manufacturer</span>
                  <span class="uk-info-row__value">{{ agent.manufacturer }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Model</span>
                  <span class="uk-info-row__value">{{ agent.model }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Serial Number</span>
                  <span class="uk-info-row__value uk-info-row__value--mono">{{ agent.serialNumber }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Total RAM</span>
                  <span class="uk-info-row__value">{{ agent.totalRam }}</span>
                </div>
              </div>
            </div>

            <!-- Network Info -->
            <div class="uk-info-section">
              <h3 class="uk-info-section__title">Network</h3>
              <div class="uk-info-list">
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Private IP</span>
                  <span class="uk-info-row__value uk-info-row__value--mono">{{ agent.ipAddress }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Public IP</span>
                  <span class="uk-info-row__value uk-info-row__value--mono">{{ agent.publicIp }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Logged User</span>
                  <span class="uk-info-row__value">{{ agent.loggedUser }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Last Seen</span>
                  <span class="uk-info-row__value">{{ agent.lastSeen }}</span>
                </div>
              </div>
            </div>

            <!-- Agent Info -->
            <div class="uk-info-section">
              <h3 class="uk-info-section__title">Agent</h3>
              <div class="uk-info-list">
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Agent Version</span>
                  <span class="uk-info-row__value">v{{ agent.agentVersion }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Agent ID</span>
                  <span class="uk-info-row__value uk-info-row__value--mono">{{ agent.id }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Monitoring Type</span>
                  <span class="uk-info-row__value">{{ agent.monitoringType }}</span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Pending Actions</span>
                  <span class="uk-info-row__value">
                    <span v-if="agent.pendingActions > 0" class="uk-badge uk-badge--warning">{{ agent.pendingActions }}</span>
                    <span v-else>0</span>
                  </span>
                </div>
                <div class="uk-info-row">
                  <span class="uk-info-row__label">Patches Pending</span>
                  <span class="uk-info-row__value">
                    <span v-if="agent.patchesPending > 0" class="uk-badge uk-badge--warning">{{ agent.patchesPending }}</span>
                    <span v-else>0</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checks Tab -->
        <div v-if="activeDetailTab === 'checks'" class="uk-detail-panel">
          <div class="uk-checks-list">
            <div v-for="check in mockChecks" :key="check.name" class="uk-check-row">
              <q-icon :name="check.icon" size="18px" :style="{ color: getCheckColor(check.status) }" />
              <div class="uk-check-row__info">
                <div class="uk-check-row__name">{{ check.name }}</div>
                <div class="uk-check-row__desc">{{ check.desc }}</div>
              </div>
              <span :class="['uk-badge', `uk-badge--${check.status}`]">{{ check.status }}</span>
              <span class="uk-check-row__time">{{ check.lastRun }}</span>
            </div>
          </div>
        </div>

        <!-- Software Tab -->
        <div v-if="activeDetailTab === 'software'" class="uk-detail-panel">
          <div class="uk-software-list">
            <div class="uk-table-container uk-scrollbar">
              <table class="uk-table">
                <thead>
                  <tr>
                    <th class="uk-table__th">Software</th>
                    <th class="uk-table__th">Version</th>
                    <th class="uk-table__th">Publisher</th>
                    <th class="uk-table__th">Install Date</th>
                    <th class="uk-table__th">Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sw in mockSoftware" :key="sw.name" class="uk-table__row">
                    <td class="uk-table__td uk-text-primary-val">{{ sw.name }}</td>
                    <td class="uk-table__td uk-text-secondary-val">{{ sw.version }}</td>
                    <td class="uk-table__td uk-text-secondary-val">{{ sw.publisher }}</td>
                    <td class="uk-table__td uk-text-secondary-val">{{ sw.installDate }}</td>
                    <td class="uk-table__td uk-text-secondary-val">{{ sw.size }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Patches Tab -->
        <div v-if="activeDetailTab === 'patches'" class="uk-detail-panel">
          <div class="uk-patches-summary">
            <div class="uk-patches-stat">
              <div class="uk-patches-stat__value">{{ agent.patchesPending }}</div>
              <div class="uk-patches-stat__label">Pending</div>
            </div>
            <div class="uk-patches-stat uk-patches-stat--installed">
              <div class="uk-patches-stat__value">48</div>
              <div class="uk-patches-stat__label">Installed</div>
            </div>
            <div class="uk-patches-stat uk-patches-stat--failed">
              <div class="uk-patches-stat__value">1</div>
              <div class="uk-patches-stat__label">Failed</div>
            </div>
          </div>
          <div class="uk-table-container uk-scrollbar">
            <table class="uk-table">
              <thead>
                <tr>
                  <th class="uk-table__th">KB</th>
                  <th class="uk-table__th">Title</th>
                  <th class="uk-table__th">Severity</th>
                  <th class="uk-table__th">Status</th>
                  <th class="uk-table__th">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patch in mockPatches" :key="patch.kb" class="uk-table__row">
                  <td class="uk-table__td"><span class="uk-text-mono">{{ patch.kb }}</span></td>
                  <td class="uk-table__td uk-text-primary-val">{{ patch.title }}</td>
                  <td class="uk-table__td">
                    <span :class="['uk-badge', `uk-badge--${patch.severityType}`]">{{ patch.severity }}</span>
                  </td>
                  <td class="uk-table__td">
                    <span :class="['uk-badge', `uk-badge--${patch.statusType}`]">{{ patch.status }}</span>
                  </td>
                  <td class="uk-table__td uk-text-secondary-val">{{ patch.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- History Tab -->
        <div v-if="activeDetailTab === 'history'" class="uk-detail-panel">
          <div class="uk-timeline">
            <div v-for="event in mockHistory" :key="event.id" class="uk-timeline__item">
              <div :class="['uk-timeline__dot', `uk-timeline__dot--${event.type}`]"></div>
              <div class="uk-timeline__content">
                <div class="uk-timeline__header">
                  <span class="uk-timeline__action">{{ event.action }}</span>
                  <span class="uk-timeline__time">{{ event.time }}</span>
                </div>
                <div class="uk-timeline__detail">{{ event.detail }}</div>
                <div v-if="event.user" class="uk-timeline__user">by {{ event.user }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UIKitLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UIKitLayout from "../components/UIKitLayout.vue";
import { mockAgents } from "../mockData";
import "../tokens.css";

// Use the Exchange Server (AGT-007) for a more interesting demo
const agent = mockAgents[6]; // PROD-EXCH01 with errors

const statusBadge = computed(() => {
  const map: Record<string, string> = { online: "success", offline: "neutral", warning: "warning", error: "error", overdue: "error" };
  return map[agent.status] || "neutral";
});

const policyBadge = computed(() => {
  const map: Record<string, string> = { compliant: "success", "non-compliant": "error", pending: "warning", unknown: "neutral" };
  return map[agent.policyStatus] || "neutral";
});

function getMetricColor(value: number): string {
  if (value > 85) return "var(--uk-error)";
  if (value > 65) return "var(--uk-warning)";
  return "var(--uk-success)";
}

const cpuClass = computed(() => agent.cpuUsage > 85 ? "uk-metric--danger" : agent.cpuUsage > 65 ? "uk-metric--warn" : "uk-metric--ok");
const memClass = computed(() => agent.memoryUsage > 85 ? "uk-metric--danger" : agent.memoryUsage > 65 ? "uk-metric--warn" : "uk-metric--ok");
const diskClass = computed(() => agent.diskUsage > 85 ? "uk-metric--danger" : agent.diskUsage > 65 ? "uk-metric--warn" : "uk-metric--ok");

// Tabs
const detailTabs = [
  { id: "overview", label: "Overview", icon: "info" },
  { id: "checks", label: "Checks", icon: "fact_check", badge: 6, badgeType: agent.checksFailing > 0 ? "error" : "default" },
  { id: "software", label: "Software", icon: "apps" },
  { id: "patches", label: "Patches", icon: "system_update", badge: agent.patchesPending, badgeType: "warning" },
  { id: "history", label: "History", icon: "history" },
];
const activeDetailTab = ref("overview");

// Mock Checks
const mockChecks = [
  { name: "CPU Load Check", desc: "Alerts when CPU exceeds 90% for 5 min", icon: "memory", status: "error", lastRun: "5 min ago" },
  { name: "Memory Check", desc: "Alerts when memory exceeds 85%", icon: "storage", status: "error", lastRun: "5 min ago" },
  { name: "Disk Space (C:)", desc: "Alerts when C: drive > 85%", icon: "disc_full", status: "warning", lastRun: "10 min ago" },
  { name: "Disk Space (D:)", desc: "Alerts when D: drive > 85%", icon: "disc_full", status: "warning", lastRun: "10 min ago" },
  { name: "Service: MSExchangeIS", desc: "Monitors Exchange Information Store", icon: "settings_suggest", status: "error", lastRun: "5 min ago" },
  { name: "Service: MSExchangeTransport", desc: "Monitors Transport service", icon: "settings_suggest", status: "error", lastRun: "5 min ago" },
  { name: "Ping Check", desc: "ICMP ping to 8.8.8.8", icon: "wifi", status: "success", lastRun: "2 min ago" },
  { name: "Event Log Errors", desc: "Check for critical events in System log", icon: "article", status: "success", lastRun: "15 min ago" },
  { name: "SSL Certificate Expiry", desc: "Mail.example.com certificate", icon: "vpn_key", status: "success", lastRun: "1 hour ago" },
  { name: "SMTP Send Test", desc: "Sends test email every 30 min", icon: "email", status: "success", lastRun: "25 min ago" },
  { name: "Windows Update Status", desc: "Checks for pending updates", icon: "update", status: "warning", lastRun: "6 hours ago" },
];

function getCheckColor(status: string): string {
  const map: Record<string, string> = { success: "var(--uk-success)", warning: "var(--uk-warning)", error: "var(--uk-error)" };
  return map[status] || "var(--uk-text-tertiary)";
}

// Mock Software
const mockSoftware = [
  { name: "Microsoft Exchange Server 2022", version: "15.2.1544.4", publisher: "Microsoft", installDate: "2024-01-15", size: "4.2 GB" },
  { name: "Microsoft .NET Framework 4.8", version: "4.8.04084", publisher: "Microsoft", installDate: "2024-01-15", size: "68 MB" },
  { name: "Microsoft Visual C++ 2019 Redistributable", version: "14.28.29913", publisher: "Microsoft", installDate: "2024-01-15", size: "24 MB" },
  { name: "BCY Agent", version: "2.8.1", publisher: "BCY", installDate: "2024-03-01", size: "12 MB" },
  { name: "7-Zip", version: "24.01", publisher: "Igor Pavlov", installDate: "2024-02-10", size: "5 MB" },
  { name: "Notepad++", version: "8.6.4", publisher: "Notepad++ Team", installDate: "2024-02-15", size: "8 MB" },
];

// Mock Patches
const mockPatches = [
  { kb: "KB5034763", title: "2024-03 Cumulative Update for Windows Server 2022", severity: "Critical", severityType: "error", status: "Pending", statusType: "warning", date: "2024-03-12" },
  { kb: "KB5034439", title: "Windows Recovery Environment Update", severity: "Important", severityType: "warning", status: "Pending", statusType: "warning", date: "2024-03-12" },
  { kb: "KB5034612", title: ".NET Framework 4.8 Security Update", severity: "Important", severityType: "warning", status: "Pending", statusType: "warning", date: "2024-03-12" },
  { kb: "KB5033904", title: "Exchange Server 2022 CU14", severity: "Critical", severityType: "error", status: "Pending", statusType: "warning", date: "2024-03-12" },
  { kb: "KB5032198", title: "2024-02 Cumulative Update", severity: "Important", severityType: "warning", status: "Installed", statusType: "success", date: "2024-02-20" },
  { kb: "KB5031364", title: "2024-01 Security Update", severity: "Critical", severityType: "error", status: "Installed", statusType: "success", date: "2024-01-15" },
  { kb: "KB5030216", title: "Servicing Stack Update", severity: "Moderate", severityType: "info", status: "Installed", statusType: "success", date: "2024-01-10" },
  { kb: "KB5028171", title: "2023-12 Cumulative Update", severity: "Important", severityType: "warning", status: "Installed", statusType: "success", date: "2023-12-18" },
  { kb: "KB5020630", title: "Exchange CU13", severity: "Critical", severityType: "error", status: "Failed", statusType: "error", date: "2024-02-15" },
];

// Mock History
const mockHistory = [
  { id: 1, action: "CPU Alert Triggered", detail: "CPU usage exceeded 90% threshold for 5 minutes", type: "error", time: "15 min ago", user: "" },
  { id: 2, action: "Memory Alert Triggered", detail: "Memory usage at 92%", type: "error", time: "15 min ago", user: "" },
  { id: 3, action: "Script Executed", detail: "Get-ExchangeServerHealth.ps1 completed with exit code 1", type: "warning", time: "30 min ago", user: "admin" },
  { id: 4, action: "Patch Installation Failed", detail: "KB5020630 - Exchange CU13 failed with error 0x80070005", type: "error", time: "5 hours ago", user: "SYSTEM" },
  { id: 5, action: "Agent Updated", detail: "Agent updated from v2.8.0 to v2.8.1", type: "success", time: "1 day ago", user: "admin" },
  { id: 6, action: "Policy Applied", detail: "Windows Updates - Monthly policy applied", type: "info", time: "2 days ago", user: "admin" },
  { id: 7, action: "Service Restarted", detail: "MSExchangeIS service restarted", type: "success", time: "3 days ago", user: "admin" },
  { id: 8, action: "Reboot Completed", detail: "System rebooted after updates", type: "info", time: "5 days ago", user: "SYSTEM" },
];
</script>

<style scoped>
/* ============================================================
   DEVICE HEADER
   ============================================================ */
.uk-back-btn {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  background: none;
  border: none;
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-family: var(--uk-font-family);
  cursor: pointer;
  padding: 0;
  margin-bottom: var(--uk-space-4);
  transition: color var(--uk-transition-fast);
}

.uk-back-btn:hover {
  color: var(--uk-text-primary);
}

.uk-device-header__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--uk-space-6);
}

.uk-device-header__title-row {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  margin-bottom: var(--uk-space-2);
  flex-wrap: wrap;
}

.uk-device-header__hostname {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.uk-device-header__meta {
  display: flex;
  align-items: center;
  gap: var(--uk-space-2);
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
  flex-wrap: wrap;
}

.uk-meta-sep {
  color: var(--uk-text-tertiary);
}

.uk-device-header__actions {
  display: flex;
  gap: var(--uk-space-2);
  flex-shrink: 0;
}

/* ============================================================
   METRICS ROW
   ============================================================ */
.uk-metrics-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--uk-space-3);
  margin-bottom: var(--uk-space-6);
}

.uk-metric-card {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
}

.uk-metric-card__label {
  font-size: var(--uk-text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--uk-text-tertiary);
  margin-bottom: var(--uk-space-2);
}

.uk-metric-card__value {
  margin-bottom: var(--uk-space-2);
}

.uk-metric-card__number {
  font-size: var(--uk-text-xl);
  font-weight: 700;
  color: var(--uk-text-primary);
}

.uk-metric--ok { color: var(--uk-success) !important; }
.uk-metric--warn { color: var(--uk-warning) !important; }
.uk-metric--danger { color: var(--uk-error) !important; }

.uk-metric-card__bar {
  height: 4px;
  border-radius: 2px;
  background: var(--uk-bg-overlay);
  overflow: hidden;
}

.uk-metric-card__bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.uk-metric-card__sub {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: var(--uk-space-1);
}

.uk-metric-card__checks {
  display: flex;
  gap: var(--uk-space-2);
}

.uk-metric-card__check {
  font-size: var(--uk-text-xl);
  font-weight: 700;
}

.uk-metric-card__check--pass { color: var(--uk-success); }
.uk-metric-card__check--warn { color: var(--uk-warning); }
.uk-metric-card__check--fail { color: var(--uk-error); }

/* ============================================================
   DETAIL TABS
   ============================================================ */
.uk-detail-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--uk-border-default);
  margin-bottom: var(--uk-space-5);
}

.uk-detail-tab {
  display: flex;
  align-items: center;
  gap: var(--uk-space-1);
  padding: var(--uk-space-3) var(--uk-space-4);
  border: none;
  background: transparent;
  color: var(--uk-text-secondary);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--uk-transition-fast);
}

.uk-detail-tab:hover {
  color: var(--uk-text-primary);
}

.uk-detail-tab--active {
  color: var(--uk-primary);
  border-bottom-color: var(--uk-primary);
}

.uk-detail-tab__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: var(--uk-radius-full);
  background: var(--uk-bg-overlay);
  color: var(--uk-text-secondary);
}

.uk-detail-tab__badge--error { background: var(--uk-error-soft); color: var(--uk-error-text); }
.uk-detail-tab__badge--warning { background: var(--uk-warning-soft); color: var(--uk-warning-text); }

/* ============================================================
   DETAIL CONTENT
   ============================================================ */
.uk-detail-panel {
  animation: uk-fade-in 0.2s ease;
}

@keyframes uk-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Overview Grid */
.uk-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--uk-space-4);
}

.uk-info-section {
  padding: var(--uk-space-4);
  background: var(--uk-bg-surface);
  border: 1px solid var(--uk-border-default);
  border-radius: var(--uk-radius-lg);
}

.uk-info-section__title {
  font-size: var(--uk-text-sm);
  font-weight: 600;
  color: var(--uk-text-primary);
  margin: 0 0 var(--uk-space-4);
  padding-bottom: var(--uk-space-2);
  border-bottom: 1px solid var(--uk-border-default);
}

.uk-info-list {
  display: flex;
  flex-direction: column;
  gap: var(--uk-space-3);
}

.uk-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uk-info-row__label {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-info-row__value {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-primary);
  font-weight: 500;
}

.uk-info-row__value--mono {
  font-family: var(--uk-font-mono);
  font-size: var(--uk-text-xs);
}

/* Checks List */
.uk-checks-list {
  display: flex;
  flex-direction: column;
}

.uk-check-row {
  display: flex;
  align-items: center;
  gap: var(--uk-space-3);
  padding: var(--uk-space-3) var(--uk-space-4);
  border-bottom: 1px solid var(--uk-border-subtle);
  transition: background var(--uk-transition-fast);
}

.uk-check-row:hover {
  background: var(--uk-bg-hover);
}

.uk-check-row:last-child {
  border-bottom: none;
}

.uk-check-row__info {
  flex: 1;
}

.uk-check-row__name {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

.uk-check-row__desc {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: 2px;
}

.uk-check-row__time {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
}

/* Patches Summary */
.uk-patches-summary {
  display: flex;
  gap: var(--uk-space-4);
  margin-bottom: var(--uk-space-4);
}

.uk-patches-stat {
  padding: var(--uk-space-3) var(--uk-space-5);
  background: var(--uk-warning-soft);
  border-radius: var(--uk-radius-md);
  text-align: center;
}

.uk-patches-stat--installed {
  background: var(--uk-success-soft);
}

.uk-patches-stat--failed {
  background: var(--uk-error-soft);
}

.uk-patches-stat__value {
  font-size: var(--uk-text-2xl);
  font-weight: 700;
  color: var(--uk-text-primary);
}

.uk-patches-stat__label {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-secondary);
}

.uk-text-mono {
  font-family: var(--uk-font-mono);
  font-size: var(--uk-text-xs);
  color: var(--uk-text-link);
}

/* ============================================================
   TIMELINE
   ============================================================ */
.uk-timeline {
  position: relative;
  padding-left: var(--uk-space-6);
}

.uk-timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--uk-border-default);
}

.uk-timeline__item {
  position: relative;
  padding-bottom: var(--uk-space-5);
}

.uk-timeline__item:last-child {
  padding-bottom: 0;
}

.uk-timeline__dot {
  position: absolute;
  left: calc(-1 * var(--uk-space-6) + 3px);
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--uk-text-tertiary);
  border: 2px solid var(--uk-bg-base);
  z-index: 1;
}

.uk-timeline__dot--success { background: var(--uk-success); }
.uk-timeline__dot--warning { background: var(--uk-warning); }
.uk-timeline__dot--error { background: var(--uk-error); }
.uk-timeline__dot--info { background: var(--uk-info); }

.uk-timeline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--uk-space-1);
}

.uk-timeline__action {
  font-size: var(--uk-text-sm);
  font-weight: 500;
  color: var(--uk-text-primary);
}

.uk-timeline__time {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
}

.uk-timeline__detail {
  font-size: var(--uk-text-sm);
  color: var(--uk-text-secondary);
}

.uk-timeline__user {
  font-size: var(--uk-text-xs);
  color: var(--uk-text-tertiary);
  margin-top: 4px;
}

/* ============================================================
   REUSED STYLES (duplicated for scoped isolation)
   ============================================================ */
.uk-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--uk-space-2);
  padding: var(--uk-space-2) var(--uk-space-4);
  border-radius: var(--uk-radius-md);
  font-size: var(--uk-text-sm);
  font-weight: 500;
  font-family: var(--uk-font-family);
  cursor: pointer;
  border: none;
  transition: all var(--uk-transition-fast);
  white-space: nowrap;
}

.uk-btn--primary { background: var(--uk-primary); color: #fff; }
.uk-btn--primary:hover { background: var(--uk-primary-hover); }
.uk-btn--secondary { background: var(--uk-bg-elevated); color: var(--uk-text-primary); border: 1px solid var(--uk-border-default); }
.uk-btn--secondary:hover { background: var(--uk-bg-overlay); border-color: var(--uk-border-strong); }
.uk-btn--sm { padding: var(--uk-space-1) var(--uk-space-3); font-size: var(--uk-text-xs); }

/* Table (reused) */
.uk-table-container { overflow-x: auto; border: 1px solid var(--uk-border-default); border-radius: var(--uk-radius-lg); background: var(--uk-bg-surface); }
.uk-table { width: 100%; border-collapse: collapse; font-size: var(--uk-text-sm); }
.uk-table__th { padding: var(--uk-space-2) var(--uk-space-3); text-align: left; font-size: var(--uk-text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--uk-text-tertiary); background: var(--uk-table-header-bg); border-bottom: 1px solid var(--uk-border-default); }
.uk-table__row { border-bottom: 1px solid var(--uk-border-subtle); transition: background var(--uk-transition-fast); }
.uk-table__row:hover { background: var(--uk-table-row-hover); }
.uk-table__td { padding: var(--uk-space-2) var(--uk-space-3); white-space: nowrap; }
.uk-text-primary-val { color: var(--uk-text-primary); font-weight: 500; }
.uk-text-secondary-val { color: var(--uk-text-secondary); }

/* Responsive */
@media (max-width: 1400px) {
  .uk-metrics-row { grid-template-columns: repeat(3, 1fr); }
  .uk-detail-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1200px) {
  .uk-metrics-row { grid-template-columns: repeat(2, 1fr); }
  .uk-detail-grid { grid-template-columns: 1fr; }
}
</style>
