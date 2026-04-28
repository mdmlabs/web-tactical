<template>
  <div class="ucr-shell">
    <div class="ucr-header">
      <h1 class="ucr-title">Detection Cases</h1>
      <p class="ucr-subtitle">
        Bundle a rule + active-response + demo attack into one repeatable
        deployment. Acceptance reviewers see configuration, detection and
        auto-response in a single timeline.
      </p>
    </div>

    <div class="ucr-grid">
      <!-- Library -->
      <q-card flat bordered class="ucr-card ucr-library">
        <q-card-section>
          <div class="ucr-card-title">
            <q-icon name="menu_book" />
            <span>Library</span>
            <q-space />
            <q-chip dense outline class="ucr-count">
              {{ manifests.length }}
            </q-chip>
          </div>
          <q-list dense separator>
            <q-item
              v-for="m in manifests"
              :key="m.id"
              clickable
              :active="selectedId === m.id"
              active-class="ucr-active"
              @click="selectedId = m.id"
            >
              <q-item-section>
                <q-item-label>{{ m.name }}</q-item-label>
                <q-item-label caption>
                  <span
                    v-for="tag in m.mitre"
                    :key="tag"
                    class="ucr-mitre-tag"
                  >
                    {{ tag }}
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!manifests.length">
              <q-item-section class="text-grey">
                No manifests in public/usecases/.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Detail card -->
      <q-card flat bordered class="ucr-card ucr-detail">
        <q-card-section v-if="selected">
          <div class="ucr-detail-header">
            <h2 class="ucr-detail-title">{{ selected.name }}</h2>
            <div class="ucr-detail-actions">
              <q-btn
                no-caps
                outline
                color="primary"
                icon="cloud_upload"
                label="Deploy"
                :disable="running"
                :loading="running && currentMode === 'deploy'"
                @click="onRun('deploy')"
              />
              <q-btn
                no-caps
                unelevated
                color="primary"
                icon="rocket_launch"
                label="Deploy &amp; Demo"
                :disable="running || !selected.demo_attack"
                :loading="running && currentMode === 'deploy_and_demo'"
                @click="onRun('deploy_and_demo')"
              />
            </div>
          </div>
          <p class="ucr-description">{{ selected.description }}</p>

          <div class="ucr-tags">
            <span v-for="tag in selected.mitre" :key="tag" class="ucr-mitre-tag">
              {{ tag }}
            </span>
          </div>

          <div class="ucr-detail-grid">
            <div class="ucr-block">
              <h3 class="ucr-block-title">Files</h3>
              <ul class="ucr-block-list">
                <li v-for="f in selected.files" :key="f.path">
                  <span class="ucr-target">{{ formatTarget(f) }}</span>
                  <code>{{ f.path }}</code>
                  <span v-if="f.mode" class="ucr-meta">mode {{ f.mode }}</span>
                  <span v-if="f.owner" class="ucr-meta">owner {{ f.owner }}</span>
                </li>
              </ul>
            </div>
            <div class="ucr-block">
              <h3 class="ucr-block-title">Restart</h3>
              <ul class="ucr-block-list">
                <li v-for="(t, i) in selected.restart" :key="i">
                  {{ formatRestartTarget(t) }}
                </li>
                <li v-if="!selected.restart.length" class="text-grey">
                  No restart configured.
                </li>
              </ul>
            </div>
            <div class="ucr-block">
              <h3 class="ucr-block-title">Demo &amp; verification</h3>
              <ul class="ucr-block-list">
                <li v-if="selected.demo_attack">
                  Run TRMM script #{{ selected.demo_attack.trmm_script_id }} on
                  {{ formatSelector(selected.demo_attack.target_selector) }}
                </li>
                <li v-else class="text-grey">No demo attack.</li>
                <li v-if="selected.verification">
                  Wait for rule
                  <code>#{{ selected.verification.rule_id }}</code> ≤
                  {{ selected.verification.wait_timeout_sec }}s
                </li>
                <li v-else class="text-grey">No verification.</li>
              </ul>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else class="ucr-empty">
          <q-icon name="rocket_launch" size="36px" />
          <p>Pick a case from the Library.</p>
        </q-card-section>
      </q-card>

      <!-- Timeline -->
      <q-card flat bordered class="ucr-card ucr-timeline-card">
        <q-card-section>
          <div class="ucr-card-title">
            <q-icon name="timeline" />
            <span>Timeline</span>
            <q-space />
            <q-chip
              v-if="succeeded === true"
              icon="check_circle"
              color="positive"
              text-color="white"
              dense
            >
              Verified
            </q-chip>
            <q-chip
              v-else-if="succeeded === false"
              icon="error"
              color="negative"
              text-color="white"
              dense
            >
              Failed
            </q-chip>
            <q-chip v-else-if="running" icon="autorenew" dense> Running </q-chip>
          </div>
          <q-timeline color="primary" layout="dense" class="ucr-timeline">
            <q-timeline-entry
              v-for="step in steps"
              :key="step.id"
              :icon="iconFor(step.status)"
              :color="colorFor(step.status)"
              :title="step.label"
              :subtitle="formatStepSubtitle(step)"
            >
              <details v-if="step.details || step.error">
                <summary>Diagnostics</summary>
                <pre class="ucr-step-pre">{{ formatDetails(step) }}</pre>
              </details>
            </q-timeline-entry>
            <q-timeline-entry
              v-if="!steps.length"
              title="Idle"
              subtitle="Pick a case and press Deploy."
              icon="hourglass_empty"
              color="grey"
            />
          </q-timeline>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

import { useUseCaseRunner } from "@/composables/useUseCaseRunner";
import { notifyError, notifySuccess } from "@/utils/notify";
import type {
  UseCaseManifest,
  UseCaseRunMode,
  UseCaseRunStep,
  UseCaseRunStepStatus,
} from "@/types/wazuhOps";

const manifests = ref<UseCaseManifest[]>([]);
const selectedId = ref<string | null>(null);

const selected = computed<UseCaseManifest | undefined>(() =>
  manifests.value.find((m) => m.id === selectedId.value),
);

onMounted(async () => {
  const indexRes = await fetch("/usecases/index.json");
  if (!indexRes.ok) {
    notifyError(`Failed to load usecases index (HTTP ${indexRes.status})`);
    return;
  }
  const index = (await indexRes.json()) as { manifests: string[] };
  const loaded = await Promise.all(
    index.manifests.map(async (file) => {
      const res = await fetch(`/usecases/${file}`);
      if (!res.ok) {
        throw new Error(`Failed to load ${file} (HTTP ${res.status})`);
      }
      return (await res.json()) as UseCaseManifest;
    }),
  );
  manifests.value = loaded.sort((a, b) => a.name.localeCompare(b.name));
  selectedId.value = manifests.value[0]?.id ?? null;
});

const currentMode = ref<UseCaseRunMode | null>(null);

const { steps, running, succeeded, execute } = useUseCaseRunner({
  resolveAsset: async (contentRef: string) => {
    const res = await fetch(`/usecases/assets/${contentRef}`);
    if (!res.ok) {
      throw new Error(
        `Asset ${contentRef} not found (HTTP ${res.status})`,
      );
    }
    return await res.text();
  },
});

async function onRun(mode: UseCaseRunMode) {
  if (!selected.value) return;
  currentMode.value = mode;
  try {
    await execute(selected.value, mode);
    if (succeeded.value) {
      notifySuccess(`${selected.value.name} — verified`);
    } else {
      notifyError(`${selected.value.name} — failed (see timeline)`, 5000);
    }
  } finally {
    currentMode.value = null;
  }
}

// === formatters ===

function formatTarget(f: UseCaseManifest["files"][number]): string {
  if (f.target === "manager") return "manager";
  if (f.target === "agent_group") return `group:${f.group_id ?? "?"}`;
  if (f.target === "agent") return `agent:${f.agent_id ?? "?"}`;
  return f.target;
}

function formatRestartTarget(t: UseCaseManifest["restart"][number]): string {
  if (t === "manager") return "manager";
  if (typeof t === "object" && "agent_id" in t) return `agent ${t.agent_id}`;
  if (typeof t === "object" && "agent_group" in t) return `group ${t.agent_group}`;
  return JSON.stringify(t);
}

function formatSelector(s: NonNullable<UseCaseManifest["demo_attack"]>["target_selector"]): string {
  if (s.type === "agent" && s.agent_id) return `agent ${s.agent_id}`;
  if (s.type === "agent_group" && s.group_id) return `group ${s.group_id}`;
  return JSON.stringify(s);
}

function iconFor(s: UseCaseRunStepStatus): string {
  switch (s) {
    case "ok":
      return "check_circle";
    case "failed":
      return "error";
    case "running":
      return "autorenew";
    case "skipped":
      return "skip_next";
    default:
      return "radio_button_unchecked";
  }
}

function colorFor(s: UseCaseRunStepStatus): string {
  switch (s) {
    case "ok":
      return "positive";
    case "failed":
      return "negative";
    case "running":
      return "primary";
    case "skipped":
      return "grey";
    default:
      return "grey";
  }
}

function formatStepSubtitle(step: UseCaseRunStep): string {
  if (step.status === "pending") return "pending";
  if (step.status === "running") return "running…";
  const dur = computeDuration(step);
  return `${step.status}${dur ? ` · ${dur}` : ""}`;
}

function computeDuration(step: UseCaseRunStep): string {
  if (!step.started_at || !step.finished_at) return "";
  const ms = new Date(step.finished_at).getTime() - new Date(step.started_at).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDetails(step: UseCaseRunStep): string {
  if (step.error) return step.error;
  if (step.details === undefined) return "";
  return JSON.stringify(step.details, null, 2);
}
</script>

<style scoped>
.ucr-shell {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 24px;
  gap: 12px;
}

.ucr-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ucr-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.ucr-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--mdm-text-secondary, #6b7280);
}

.ucr-grid {
  display: grid;
  grid-template-columns: 280px 1fr 360px;
  gap: 12px;
  align-items: start;
}

@media (max-width: 1280px) {
  .ucr-grid {
    grid-template-columns: 1fr;
  }
}

.ucr-card {
  border-radius: var(--mdm-radius, 6px);
}

.ucr-library q-list {
  max-height: 540px;
  overflow: auto;
}

.ucr-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
  margin-bottom: 8px;
}

.ucr-active {
  background: rgba(37, 99, 235, 0.08);
}

.ucr-mitre-tag {
  display: inline-block;
  margin-right: 4px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--mdm-bg, #eef2ff);
  color: var(--mdm-primary-dark, #3730a3);
  font-size: 11px;
  font-family: monospace;
}

.ucr-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ucr-detail-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--mdm-text-primary, #1a1a1a);
}

.ucr-detail-actions {
  display: flex;
  gap: 6px;
}

.ucr-description {
  margin: 6px 0 8px;
  font-size: 13px;
  color: var(--mdm-text-secondary, #4b5563);
}

.ucr-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.ucr-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ucr-block {
  background: var(--mdm-bg, #f9fafb);
  border-radius: var(--mdm-radius, 6px);
  padding: 10px 12px;
}

.ucr-block-title {
  margin: 0 0 6px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mdm-text-secondary, #6b7280);
  font-weight: 600;
}

.ucr-block-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.ucr-block-list code {
  font-family: monospace;
  background: var(--mdm-bg-card, #fff);
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid var(--mdm-border, #e5e5e5);
}

.ucr-target {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--mdm-primary-soft, rgba(37, 99, 235, 0.1));
  color: var(--mdm-primary, #2563eb);
  font-size: 11px;
  margin-right: 4px;
}

.ucr-meta {
  font-size: 11px;
  color: var(--mdm-text-secondary, #6b7280);
  margin-left: 4px;
}

.ucr-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px 16px;
  color: var(--mdm-text-secondary, #6b7280);
}

.ucr-timeline-card {
  position: sticky;
  top: 16px;
}

.ucr-timeline {
  max-height: 540px;
  overflow: auto;
}

.ucr-step-pre {
  margin: 6px 0 0;
  padding: 6px 8px;
  background: var(--mdm-bg-card, #fff);
  border: 1px solid var(--mdm-border, #e5e5e5);
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
}

.ucr-count {
  font-size: 11px;
}
</style>
