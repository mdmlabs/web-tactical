<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin mdm-dialog">
      <!-- Header -->
      <div class="mdm-header">
        <h1 class="mdm-header__title">Обновление агентов</h1>
        <button class="mdm-header__close" @click="onDialogHide">
          <q-icon name="close" size="20px" />
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="versionsLoading" class="mdm-loading">
        <q-spinner-dots size="40px" color="primary" />
        <div class="mdm-loading__text">Загрузка версий...</div>
      </div>

      <!-- Error state -->
      <div v-else-if="versionsError" class="mdm-error">
        <q-icon name="error_outline" size="24px" color="negative" />
        <span>{{ versionsError }}</span>
        <q-btn flat dense size="sm" label="Повторить" color="primary" @click="loadVersions" />
      </div>

      <!-- Nexus not configured -->
      <div v-else-if="versionsData && !versionsData.nexus_configured" class="mdm-warning">
        <q-icon name="warning" size="24px" color="warning" />
        <span>Nexus-репозиторий не настроен. Обновление невозможно.</span>
      </div>

      <!-- Main content -->
      <template v-else-if="versionsData">
        <!-- Two-column grid -->
        <div class="mdm-grid">
          <!-- Left: Version distribution chart -->
          <div class="mdm-panel mdm-panel--left">
            <h2 class="mdm-section-title">Распределение версий</h2>

            <div class="mdm-chart-area">
              <div class="mdm-donut">
                <svg viewBox="0 0 36 36" class="mdm-donut__svg">
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="var(--uk-border-default, #E2E8F0)" stroke-width="3" />
                  <circle
                    v-for="(seg, i) in chartSegments"
                    :key="i"
                    cx="18" cy="18" r="15.9"
                    fill="transparent"
                    :stroke="seg.color"
                    stroke-width="3"
                    :stroke-dasharray="seg.dash"
                    :stroke-dashoffset="seg.offset"
                    class="mdm-donut__segment"
                    @click="toggleChartFilter(seg.version)"
                  />
                </svg>
                <div class="mdm-donut__center">
                  <span class="mdm-donut__count">{{ targetAgents.length }}</span>
                  <span class="mdm-donut__label">Всего</span>
                </div>
              </div>

              <div class="mdm-legend">
                <div
                  v-for="v in versionStats"
                  :key="v.version"
                  class="mdm-legend__item"
                  :class="{
                    'mdm-legend__item--active': activeChartVersion === v.version,
                    'mdm-legend__item--dimmed': activeChartVersion && activeChartVersion !== v.version,
                  }"
                  @click="toggleChartFilter(v.version)"
                >
                  <span class="mdm-legend__dot" :style="{ backgroundColor: v.color }"></span>
                  <span class="mdm-legend__version">{{ v.version }}</span>
                  <span class="mdm-legend__count">({{ v.count }})</span>
                </div>
                <div v-if="versionStats.length === 0" class="mdm-legend__empty">Нет данных</div>
              </div>
            </div>

            <!-- Filtered agents by chart click -->
            <div class="mdm-chart-filter">
              <template v-if="activeChartVersion">
                <h3 class="mdm-chart-filter__title">Агенты на версии {{ activeChartVersion }}</h3>
                <div class="mdm-chart-filter__list">
                  <div v-for="a in filteredByChart" :key="a.agent_id" class="mdm-chart-filter__item">
                    <div class="mdm-status-dot" :class="a.status === 'online' ? 'mdm-status-dot--online' : 'mdm-status-dot--offline'"></div>
                    <span>{{ a.hostname }}</span>
                  </div>
                  <div v-if="filteredByChart.length === 0" class="mdm-chart-filter__empty">Нет агентов на этой версии</div>
                </div>
              </template>
              <p v-else class="mdm-chart-filter__hint">Нажмите на сегмент графика для фильтрации</p>
            </div>
          </div>

          <!-- Right: Target version selector (arch integrated) -->
          <div class="mdm-panel mdm-panel--right">
            <h2 class="mdm-section-title">Целевая версия для обновления</h2>
            <div class="mdm-version-list">
              <label
                v-for="v in versionRadioOptions"
                :key="v.value"
                class="mdm-version-option"
                :class="{ 'mdm-version-option--selected': state.version === v.value }"
              >
                <div class="mdm-version-option__top">
                  <div class="mdm-version-option__left">
                    <input
                      type="radio"
                      v-model="state.version"
                      :value="v.value"
                      class="mdm-version-option__radio"
                    />
                    <span class="mdm-version-option__label">{{ v.value }}</span>
                  </div>
                  <span v-if="v.recommended" class="mdm-badge mdm-badge--recommended">Рекомендовано</span>
                </div>
                <!-- Inline arch selector for selected version -->
                <div v-if="state.version === v.value" class="mdm-arch-row">
                  <span
                    v-for="opt in archOptions"
                    :key="opt.value"
                    class="mdm-arch-tag"
                    :class="{ 'mdm-arch-tag--active': state.arch === opt.value }"
                    @click.prevent="state.arch = opt.value"
                  >{{ opt.label }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Bottom: Agent list -->
        <div class="mdm-agents-section">
          <div class="mdm-agents-header">
            <h2 class="mdm-section-title">Список агентов</h2>
            <q-input
              v-model="searchFilter"
              dense
              outlined
              placeholder="Поиск..."
              style="width: 200px"
              clearable
            >
              <template #prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </div>

          <div v-if="targetAgents.length === 0" class="mdm-agents-empty">
            <q-icon name="devices" size="24px" />
            <span>Windows-агенты не найдены</span>
          </div>

          <div v-else class="mdm-agents-list">
            <div
              v-for="agent in filteredAgentsList"
              :key="agent.agent_id"
              class="mdm-agent-row"
            >
              <div class="mdm-agent-row__name">
                <div class="mdm-agent-row__icon">
                  <q-icon name="computer" size="16px" />
                </div>
                {{ agent.hostname }}
              </div>
              <div class="mdm-agent-row__version">
                <span class="mdm-agent-row__mono">{{ agent.version || 'N/A' }}</span>
              </div>
              <div class="mdm-agent-row__status">
                <div class="mdm-status-dot" :class="agent.status === 'online' ? 'mdm-status-dot--online' : 'mdm-status-dot--offline'"></div>
              </div>
              <div class="mdm-agent-row__arch">{{ state.arch }}</div>
              <button
                class="mdm-delete-btn"
                :disabled="deletingAgents[agent.agent_id]"
                @click="handleDelete(agent)"
              >
                <q-spinner v-if="deletingAgents[agent.agent_id]" size="14px" />
                <q-icon v-else name="delete_outline" size="14px" />
                Удалить
              </button>
              <button
                class="mdm-update-btn"
                :disabled="agent.version === state.version || updatingAgents[agent.agent_id]"
                @click="handleUpdate(agent.agent_id)"
              >
                <q-spinner v-if="updatingAgents[agent.agent_id]" size="14px" />
                <q-icon v-else name="refresh" size="14px" class="mdm-update-btn__icon" />
                Обновить
              </button>
            </div>
          </div>
        </div>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed, onMounted, defineComponent } from "vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useAgentsStore } from "@/stores/agents";
import { fetchMdmVersions, updateMdmAgents, deleteMdmAgents } from "@/api/agents";
import { notifySuccess, notifyError } from "@/utils/notify";
import { AGENT_DISPLAY_NAME } from "@/constants/constants";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
];

const archOptions = [
  { label: "x64", value: "x64" },
  { label: "ARM64", value: "arm64" },
];

export default defineComponent({
  name: "UpdateMdmAgents",
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const $q = useQuasar();
    const agentsStore = useAgentsStore();

    const state = reactive({
      version: null,
      arch: "x64",
    });

    const versionsLoading = ref(true);
    const versionsData = ref(null);
    const versionsError = ref(null);
    const searchFilter = ref("");
    const activeChartVersion = ref(null);
    const updatingAgents = reactive({});
    const deletingAgents = reactive({});

    // All Windows agents from store
    const targetAgents = computed(() => {
      return agentsStore.agents.filter(
        (a) => a.plat === "windows" && a.windows_policy_status !== null,
      );
    });

    const filteredAgentsList = computed(() => {
      if (!searchFilter.value) return targetAgents.value;
      const q = searchFilter.value.toLowerCase();
      return targetAgents.value.filter(
        (a) =>
          a.hostname?.toLowerCase().includes(q) ||
          a.ancestors?.toLowerCase().includes(q) ||
          a.site_name?.toLowerCase().includes(q),
      );
    });

    // Version distribution from agents
    const versionStats = computed(() => {
      const counts = {};
      targetAgents.value.forEach((a) => {
        const v = a.version || "unknown";
        counts[v] = (counts[v] || 0) + 1;
      });
      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([version, count], i) => ({
          version,
          count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }));
    });

    const chartSegments = computed(() => {
      const total = targetAgents.value.length;
      if (total === 0) return [];
      const segments = [];
      let offset = 0;
      versionStats.value.forEach((stat) => {
        const pct = (stat.count / total) * 100;
        segments.push({
          version: stat.version,
          color: stat.color,
          dash: `${pct} ${100 - pct}`,
          offset: -offset,
        });
        offset += pct;
      });
      return segments;
    });

    const filteredByChart = computed(() => {
      if (!activeChartVersion.value) return [];
      return targetAgents.value.filter(
        (a) => (a.version || "unknown") === activeChartVersion.value,
      );
    });

    const versionRadioOptions = computed(() => {
      if (!versionsData.value?.versions) return [];
      return versionsData.value.versions.map((v, i) => ({
        value: v,
        recommended: i === 0,
      }));
    });

    function toggleChartFilter(version) {
      activeChartVersion.value =
        activeChartVersion.value === version ? null : version;
    }

    async function loadVersions() {
      versionsLoading.value = true;
      versionsError.value = null;
      try {
        const data = await fetchMdmVersions();
        versionsData.value = data;
        if (data.versions && data.versions.length > 0) {
          state.version = data.versions[0];
        }
      } catch (e) {
        versionsError.value = "Не удалось загрузить версии MDM";
        notifyError("Не удалось загрузить версии MDM");
      } finally {
        versionsLoading.value = false;
      }
    }

    async function handleUpdate(agentId) {
      if (!state.version) {
        notifyError("Выберите целевую версию");
        return;
      }
      updatingAgents[agentId] = true;
      try {
        const response = await updateMdmAgents({
          agent_ids: [agentId],
          version: state.version,
          arch: state.arch,
        });
        notifySuccess(response.message || "Обновление MDM агента запущено");
      } catch (error) {
        notifyError(
          error.response?.data?.error ||
            error.response?.data ||
            "Не удалось запустить обновление",
        );
      } finally {
        updatingAgents[agentId] = false;
      }
    }

    function handleDelete(agent) {
      $q.dialog({
        title: "Удаление MDM агента",
        message: `Вы уверены, что хотите удалить MDM агент с ${agent.hostname}? Это удалит ${AGENT_DISPLAY_NAME} и его данные с машины.`,
        cancel: true,
        persistent: true,
        ok: { label: "Удалить", color: "negative" },
      }).onOk(async () => {
        deletingAgents[agent.agent_id] = true;
        try {
          const response = await deleteMdmAgents({
            agent_ids: [agent.agent_id],
          });
          notifySuccess(response.message || "Удаление MDM агента запущено");
        } catch (error) {
          notifyError(
            error.response?.data?.error ||
              error.response?.data ||
              "Не удалось запустить удаление MDM агента",
          );
        } finally {
          deletingAgents[agent.agent_id] = false;
        }
      });
    }

    onMounted(() => {
      loadVersions();
    });

    return {
      dialogRef,
      onDialogHide,
      archOptions,
      state,
      versionsLoading,
      versionsData,
      versionsError,
      searchFilter,
      activeChartVersion,
      updatingAgents,
      targetAgents,
      filteredAgentsList,
      versionStats,
      chartSegments,
      filteredByChart,
      versionRadioOptions,
      toggleChartFilter,
      loadVersions,
      handleUpdate,
      deletingAgents,
      handleDelete,
    };
  },
});
</script>

<style scoped>
.mdm-dialog {
  width: 860px;
  max-width: 90vw;
  border-radius: var(--uk-radius-lg, 8px);
  overflow: hidden;
  color: var(--uk-text-primary, #0F172A);
  font-family: var(--uk-font-family, inherit);
}

/* ── Header ── */
.mdm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid var(--uk-border-default, #E2E8F0);
}

.mdm-header__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.mdm-header__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--uk-text-tertiary, #94A3B8);
  cursor: pointer;
  transition: all 0.12s;
}

.mdm-header__close:hover {
  color: var(--uk-text-primary, #0F172A);
  background: var(--uk-bg-hover, rgba(59,130,246,0.06));
}

/* ── States ── */
.mdm-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 24px;
}

.mdm-loading__text {
  font-size: 13px;
  color: var(--uk-text-tertiary, #94A3B8);
}

.mdm-error,
.mdm-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  margin: 20px;
  border-radius: 8px;
  font-size: 13px;
}

.mdm-error {
  background: var(--uk-error-soft, rgba(220,38,38,0.08));
  color: var(--uk-error-text, #991B1B);
}

.mdm-warning {
  background: var(--uk-warning-soft, rgba(217,119,6,0.08));
  color: var(--uk-warning-text, #92400E);
}

/* ── Grid ── */
.mdm-grid {
  display: grid;
  grid-template-columns: 7fr 5fr;
  border-bottom: 1px solid var(--uk-border-default, #E2E8F0);
}

.mdm-panel {
  padding: 24px;
}

.mdm-panel--left {
  padding-right: 20px;
}

.mdm-panel--right {
  border-left: 1px solid var(--uk-border-default, #E2E8F0);
  padding-left: 20px;
}

.mdm-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--uk-text-tertiary, #94A3B8);
  margin: 0 0 16px;
}

/* ── Donut ── */
.mdm-chart-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mdm-donut {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.mdm-donut__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.mdm-donut__segment {
  cursor: pointer;
  transition: opacity 0.2s;
}

.mdm-donut__segment:hover {
  opacity: 0.7;
}

.mdm-donut__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.mdm-donut__count {
  font-size: 22px;
  font-weight: 700;
}

.mdm-donut__label {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--uk-text-tertiary, #94A3B8);
}

/* ── Legend ── */
.mdm-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mdm-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.12s, opacity 0.12s;
}

.mdm-legend__item:hover {
  transform: translateX(2px);
}

.mdm-legend__item--active {
  font-weight: 700;
}

.mdm-legend__item--dimmed {
  opacity: 0.35;
}

.mdm-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mdm-legend__version {
  color: var(--uk-text-secondary, #64748B);
}

.mdm-legend__count {
  color: var(--uk-text-tertiary, #94A3B8);
}

.mdm-legend__empty {
  font-size: 13px;
  color: var(--uk-text-tertiary, #94A3B8);
  font-style: italic;
}

/* ── Chart filter ── */
.mdm-chart-filter {
  margin-top: 20px;
  min-height: 50px;
}

.mdm-chart-filter__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--uk-text-tertiary, #94A3B8);
  margin: 0 0 8px;
}

.mdm-chart-filter__list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 120px;
  overflow-y: auto;
}

.mdm-chart-filter__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding-left: 10px;
  border-left: 2px solid var(--uk-border-default, #E2E8F0);
  color: var(--uk-text-secondary, #64748B);
}

.mdm-chart-filter__empty {
  font-size: 13px;
  color: var(--uk-text-tertiary, #94A3B8);
  font-style: italic;
}

.mdm-chart-filter__hint {
  font-size: 12px;
  color: var(--uk-text-tertiary, #94A3B8);
  font-style: italic;
  margin: 0;
}

/* ── Version list with integrated arch ── */
.mdm-version-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mdm-version-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid var(--uk-border-default, #E2E8F0);
  cursor: pointer;
  transition: all 0.12s;
}

.mdm-version-option:hover {
  border-color: var(--uk-border-strong, #CBD5E1);
}

.mdm-version-option--selected {
  border-color: var(--uk-primary, #3B82F6);
  background: var(--uk-primary-soft, rgba(59,130,246,0.08));
}

.mdm-version-option__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mdm-version-option__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mdm-version-option__radio {
  width: 16px;
  height: 16px;
  accent-color: var(--uk-primary, #3B82F6);
  cursor: pointer;
  margin: 0;
}

.mdm-version-option__label {
  font-size: 14px;
  font-weight: 500;
}

.mdm-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
}

.mdm-badge--recommended {
  background: var(--uk-primary-soft, rgba(59,130,246,0.08));
  color: var(--uk-primary-text, #1E40AF);
}

/* Arch toggle row inside selected version */
.mdm-arch-row {
  display: flex;
  gap: 6px;
  padding-left: 26px;
}

.mdm-arch-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.12s;
  background: var(--uk-bg-overlay, #F8FAFC);
  color: var(--uk-text-tertiary, #94A3B8);
  border: 1px solid transparent;
}

.mdm-arch-tag:hover {
  color: var(--uk-text-secondary, #64748B);
}

.mdm-arch-tag--active {
  background: var(--uk-primary, #3B82F6);
  color: #fff;
}

/* ── Agent section ── */
.mdm-agents-section {
  padding: 20px 24px 24px;
}

.mdm-agents-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mdm-agents-header .mdm-section-title {
  margin: 0;
}

.mdm-agents-empty {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: var(--uk-text-tertiary, #94A3B8);
  font-size: 13px;
}

.mdm-agents-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 220px;
  overflow-y: auto;
}

/* Table-like row */
.mdm-agent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--uk-border-subtle, #F1F5F9);
  transition: background 0.1s;
}

.mdm-agent-row:last-child {
  border-bottom: none;
}

.mdm-agent-row:hover {
  background: var(--uk-bg-hover, rgba(59,130,246,0.04));
}

.mdm-agent-row__name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 2;
  font-size: 13px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mdm-agent-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--uk-bg-overlay, #F8FAFC);
  color: var(--uk-text-tertiary, #94A3B8);
  flex-shrink: 0;
}

.mdm-agent-row__version {
  flex: 1;
  font-size: 13px;
  color: var(--uk-text-secondary, #64748B);
}

.mdm-agent-row__mono {
  font-family: var(--uk-font-mono, monospace);
}

.mdm-agent-row__status {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mdm-agent-row__arch {
  width: 40px;
  font-size: 11px;
  font-weight: 600;
  color: var(--uk-text-tertiary, #94A3B8);
  text-align: center;
  flex-shrink: 0;
}

/* ── Status dot ── */
.mdm-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mdm-status-dot--online {
  background: var(--uk-success, #059669);
  box-shadow: 0 0 6px var(--uk-success, #059669);
}

.mdm-status-dot--offline {
  background: var(--uk-offline, #94A3B8);
}

/* ── Delete button ── */
.mdm-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--uk-border-default, #E2E8F0);
  background: transparent;
  color: var(--uk-text-tertiary, #94A3B8);
  cursor: pointer;
  transition: all 0.12s;
  white-space: nowrap;
  flex-shrink: 0;
}

.mdm-delete-btn:hover:not(:disabled) {
  border-color: #EF4444;
  color: #EF4444;
}

.mdm-delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Update button ── */
.mdm-update-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--uk-border-default, #E2E8F0);
  background: transparent;
  color: var(--uk-text-primary, #0F172A);
  cursor: pointer;
  transition: all 0.12s;
  white-space: nowrap;
  flex-shrink: 0;
}

.mdm-update-btn:hover:not(:disabled) {
  border-color: var(--uk-primary, #3B82F6);
  color: var(--uk-primary, #3B82F6);
}

.mdm-update-btn__icon {
  transition: transform 0.4s ease;
}

.mdm-update-btn:hover:not(:disabled) .mdm-update-btn__icon {
  transform: rotate(180deg);
}

.mdm-update-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
