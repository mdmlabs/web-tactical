<template>
  <q-dialog
    v-model="dialogVisible"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="applied-policies-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Applied Policies</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="applied-policies-dialog__body">
        <div v-if="agent" class="text-subtitle2 q-mb-md">
          Device: {{ agent.hostname }}
        </div>

        <q-tabs
          v-model="dialogTab"
          dense
          inline-label
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
        >
          <q-tab name="assignments" icon="assignment" label="Assignments" />
          <q-tab name="effective" icon="policy" label="Effective Policies" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="dialogTab" class="q-mt-md">
          <q-tab-panel name="assignments" class="q-pa-none">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Loading assignments...</div>
            </div>

            <div
              v-else-if="assignments.length === 0"
              class="text-center q-pa-lg text-grey-6"
            >
              <q-icon name="info" size="3em" class="q-mb-md" />
              <div>No assignments</div>
              <div class="text-caption q-mt-sm">
                Assign policies using the "Apply Policy" dialog
              </div>
            </div>

            <div v-else>
              <q-table
                :rows="assignments"
                :columns="assignmentColumns"
                row-key="id"
                flat
                bordered
                :loading="loading"
              >
                <template v-slot:body-cell-policy="props">
                  <q-td :props="props">
                    <div>
                      {{
                        props.row.displayName ||
                        props.row.name ||
                        props.row.policyHash ||
                        props.row.policy_hash ||
                        props.row.id
                      }}
                    </div>
                    <div
                      v-if="props.row.explainText || props.row.description"
                      class="text-caption text-grey-7 q-mt-xs assignment-description"
                    >
                      {{
                        truncateDescription(
                          props.row.explainText || props.row.description || "",
                        )
                      }}
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-desired_state="props">
                  <q-td :props="props">{{ desiredStateLabel(props.row) }}</q-td>
                </template>

                <template v-slot:body-cell-override="props">
                  <q-td :props="props">
                    <div v-if="props.row.override || props.row.overridden">
                      {{
                        formatOverride(
                          props.row.override ?? props.row.overridden,
                        )
                      }}
                    </div>
                    <div v-else>—</div>
                  </q-td>
                </template>

                <template v-slot:body-cell-target="props">
                  <q-td :props="props">
                    {{ targetLabel(props.row) }}
                  </q-td>
                </template>

                <template v-slot:body-cell-scope="props">
                  <q-td :props="props">
                    {{ scopeLabel(props.row) }}
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
          <q-tab-panel name="effective" class="q-pa-none">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Loading effective policies...</div>
            </div>

            <div
              v-else-if="effectivePolicies.length === 0"
              class="text-center q-pa-lg text-grey-6"
            >
              <q-icon name="info" size="3em" class="q-mb-md" />
              <div>No effective policies</div>
            </div>

            <div v-else class="q-pa-sm">
              <q-list bordered separator>
                <q-item
                  v-for="p in effectivePolicies"
                  :key="String(p.policyHash || p.policy_hash || p.id)"
                >
                  <q-item-section>
                    <q-item-label>
                      {{
                        p.displayName || p.name || p.policyHash || p.policy_hash
                      }}
                    </q-item-label>
                    <q-item-label caption v-if="p.explainText || p.description">
                      {{ p.explainText || p.description || "" }}
                    </q-item-label>
                    <div class="text-caption q-mt-xs">
                      <strong>Source:</strong> {{ policySourceLabel(p) }}
                      <span v-if="p.userId || p.userSid">
                        • <strong>User:</strong>
                        {{ p.userId || p.userSid }}</span
                      >
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="primary" :label="'Applied'" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Close"
          color="primary"
          @click="dialogVisible = false"
        />
        <q-btn
          flat
          label="Refresh"
          color="primary"
          icon="refresh"
          @click="refresh"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { QTableColumn } from "quasar";

interface Agent {
  id: string;
  hostname: string;
  status: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent: Agent | null;
  assignments?: Array<Record<string, unknown>>;
  effectivePolicies?: Array<Record<string, unknown>>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}>();

const refresh = () => emit("refresh");

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dialogTab = ref("assignments");
const loading = computed(() => !!props.loading);
const assignments = computed(() => props.assignments || []);
const effectivePolicies = computed(() => props.effectivePolicies || []);

const assignmentColumns: QTableColumn[] = [
  {
    name: "policy",
    required: true,
    label: "Policy",
    align: "left",
    field: (row: Record<string, unknown>) =>
      String(
        row["displayName"] ||
          row["display_name"] ||
          row["name"] ||
          row["policyHash"] ||
          row["policy_hash"] ||
          row["id"] ||
          "",
      ),
    sortable: true,
  },
  {
    name: "desired_state",
    label: "Desired state",
    align: "left",
    field: (row: Record<string, unknown>) =>
      String(row["desiredState"] || row["desired_state"] || ""),
  },
  {
    name: "override",
    label: "Override",
    align: "center",
    field: (row: Record<string, unknown>) =>
      row["override"] ?? row["overridden"] ?? false,
  },
  {
    name: "target",
    label: "Target",
    align: "left",
    field: (row: Record<string, unknown>) =>
      String(
        row["target"] ||
          row["targetName"] ||
          row["userId"] ||
          row["userSid"] ||
          "",
      ),
  },
  // {
  //   name: "scope",
  //   label: "Scope",
  //   align: "left",
  //   field: (row: Record<string, unknown>) =>
  //     String(
  //       row["scope"] ??
  //         (row["summary"] as Record<string, unknown> | undefined)?.["scope"] ??
  //         "",
  //     ),
  // },
];

function formatOverride(o: unknown): string {
  if (o === undefined || o === null) return "—";

  if (typeof o === "string" || typeof o === "number" || typeof o === "boolean")
    return String(o);

  if (typeof o === "object") {
    const obj = o as Record<string, unknown>;
    const keysPrefer = [
      "stringValue",
      "string_value",
      "value",
      "dword",
      "int32",
      "int64",
    ];
    for (const k of keysPrefer) {
      if (k in obj && obj[k] !== undefined && obj[k] !== null) {
        const v = obj[k];
        if (
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
        )
          return String(v);
        try {
          return JSON.stringify(v);
        } catch {
          return "—";
        }
      }
    }

    for (const [, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue;
      if (typeof v === "object") continue;
      return String(v);
    }

    try {
      return JSON.stringify(obj);
    } catch {
      return "—";
    }
  }

  return String(o);
}

function policySourceLabel(p: Record<string, unknown>): string {
  const src =
    (p && (p["policySource"] ?? p["policy_source"] ?? p["source"])) ?? null;
  if (src === null || src === undefined) return "Unspecified";

  const num = Number(src);
  if (!Number.isNaN(num)) {
    switch (num) {
      case 0:
        return "Unspecified ";
      case 1:
        return "Global";
      case 2:
        return "Agent";
      case 3:
        return "User";
      default:
        return String(src);
    }
  }

  const s = String(src).toUpperCase();
  if (s.includes("GLOBAL")) return "Global";
  if (s.includes("AGENT")) return "Agent";
  if (s.includes("USER")) return "User";
  return String(src);
}

function targetLabel(row: Record<string, unknown>): string {
  if (!row) return "";
  const t =
    row["target"] ??
    row["targetObject"] ??
    row["target_obj"] ??
    row["target"] ??
    null;
  if (!t) {
    if (row["userId"] || row["userSid"] || row["user_sid"]) return "User";
    return "";
  }

  if (typeof t === "string") {
    return t;
  }

  if (typeof t === "object") {
    const obj = t as Record<string, unknown>;
    if ("agent" in obj) return "Agent";
    if ("user" in obj) return "User";

    for (const k of ["agentId", "agent_id"]) {
      if (k in obj) return "Agent";
    }
    return JSON.stringify(obj);
  }

  return String(t);
}

const ASSIGNMENT_DESCRIPTION_MAX_LEN = 120;

function truncateDescription(
  text: string,
  maxLen = ASSIGNMENT_DESCRIPTION_MAX_LEN,
): string {
  const s = String(text).trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen).trim() + "…";
}

function scopeLabel(row: Record<string, unknown>): string {
  const scope =
    row["scope"] ??
    (row["summary"] as Record<string, unknown> | undefined)?.["scope"];
  if (scope === null || scope === undefined) return "—";
  const s = String(scope).toUpperCase();
  if (s.includes("USER") && s.includes("MACHINE")) return "Both";
  if (s.includes("USER")) return "User";
  if (s.includes("MACHINE")) return "Machine";
  if (s.includes("BOTH")) return "Both";
  return String(scope);
}

function desiredStateLabel(row: Record<string, unknown>): string {
  const raw = row["desiredState"] ?? row["desired_state"] ?? null;
  if (raw === null || raw === undefined) return "Unspecified";

  const num = Number(raw);
  if (!Number.isNaN(num)) {
    switch (num) {
      case 0:
        return "Unspecified";
      case 1:
        return "Enabled";
      case 2:
        return "Disabled";
      default:
        return String(raw);
    }
  }

  const s = String(raw).toUpperCase();
  if (s.includes("ENABLED")) return "Enabled";
  if (s.includes("DISABLED")) return "Disabled";
  if (s.includes("UNSPECIFIED")) return "Unspecified";
  return String(raw);
}
</script>

<style scoped lang="sass">
.applied-policies-dialog
  min-width: 800px
  max-width: 1200px
  max-height: 85vh
  display: flex
  flex-direction: column

.applied-policies-dialog__body
  overflow: auto
  flex: 1
  min-height: 0
</style>
