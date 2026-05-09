<!--
  Phase-3.c — WorkspaceUserPwdPolicyEditor.vue

  One-stop editor for every Phase-1/2/3 field on
  ``OrganizationWorkspace`` related to user-managed encrypted containers:

    • password_owner            (admin | user)
    • recovery_escrow_mode      (escrow | zero_knowledge)
    • escrow_shamir_threshold   (k)
    • escrow_shamir_total       (n)
    • require_tpm_binding
    • idle_lock_minutes
    • bruteforce_max_attempts
    • bruteforce_lockout_minutes
    • snapshot_interval_hours
    • snapshot_retention_count
    • watermark_enabled
    • watermark_template
    • require_windows_hello
    • geofence_enforcement      (off | audit | enforce)
    • geofence_polygons         (delegated to WorkspaceGeofenceEditor)

  The component is a leaf editor: it takes a ``modelValue`` object and
  emits ``update:modelValue`` whenever the user changes any input.

  Officer management (the WorkspaceEscrowOfficer rows) is intentionally
  NOT inlined here — that is a separate workflow (the operator console
  has its own officer-list page). The editor displays the officer count
  hint ("workspace expects N active officers") so the form author knows
  whether the n parameter aligns with reality.
-->
<template>
  <div class="workspace-userpwd-editor q-gutter-md">
    <div class="text-subtitle2">User-managed container password policy (Phase-1/2/3)</div>

    <q-select
      :model-value="model.password_owner"
      :options="passwordOwnerOptions"
      emit-value map-options outlined dense
      label="Password owner"
      :hint="passwordOwnerHint"
      @update:model-value="patch('password_owner', $event)" />

    <template v-if="model.password_owner === 'user'">
      <q-select
        :model-value="model.recovery_escrow_mode"
        :options="escrowModeOptions"
        emit-value map-options outlined dense
        label="Recovery key escrow"
        :hint="escrowModeHint"
        @update:model-value="patch('recovery_escrow_mode', $event)" />

      <div v-if="model.recovery_escrow_mode === 'escrow'" class="row q-gutter-md">
        <q-input
          :model-value="model.escrow_shamir_threshold"
          @update:model-value="patch('escrow_shamir_threshold', toInt($event, 1))"
          type="number" min="1" outlined dense
          label="Shamir threshold (k)"
          style="min-width: 180px"
          :hint="`Officers required to recover.`" />
        <q-input
          :model-value="model.escrow_shamir_total"
          @update:model-value="patch('escrow_shamir_total', toInt($event, 1))"
          type="number" min="1" outlined dense
          label="Shamir total shares (n)"
          style="min-width: 180px"
          :hint="totalHint" />
      </div>
    </template>

    <q-toggle
      :model-value="model.require_tpm_binding"
      label="Require TPM binding (DEK sealed to this device's TPM)"
      @update:model-value="patch('require_tpm_binding', !!$event)" />
    <q-toggle
      :model-value="model.require_windows_hello"
      label="Require Windows Hello as a second factor at mount"
      @update:model-value="patch('require_windows_hello', !!$event)" />

    <div class="text-subtitle2 q-mt-md">Idle lock + brute-force</div>
    <div class="row q-gutter-md">
      <q-input
        :model-value="model.idle_lock_minutes"
        @update:model-value="patch('idle_lock_minutes', toInt($event, 1, 1440))"
        type="number" min="1" max="1440" outlined dense
        label="Idle-lock timeout (minutes)"
        style="min-width: 200px"
        hint="Workspace floor; per-user / per-group overrides take precedence." />
      <q-input
        :model-value="model.bruteforce_max_attempts"
        @update:model-value="patch('bruteforce_max_attempts', toInt($event, 0, 99))"
        type="number" min="0" max="99" outlined dense
        label="Brute-force max attempts"
        style="min-width: 180px"
        hint="0 disables." />
      <q-input
        :model-value="model.bruteforce_lockout_minutes"
        @update:model-value="patch('bruteforce_lockout_minutes', toInt($event, 1, 1440))"
        type="number" min="1" max="1440" outlined dense
        label="Brute-force lockout (minutes)"
        style="min-width: 200px"
        hint="Time the container stays locked after exceeding max attempts." />
    </div>

    <div class="text-subtitle2 q-mt-md">Snapshot policy</div>
    <div class="row q-gutter-md">
      <q-input
        :model-value="model.snapshot_interval_hours"
        @update:model-value="patch('snapshot_interval_hours', toInt($event, 0, 720))"
        type="number" min="0" max="720" outlined dense
        label="Snapshot interval (hours)"
        style="min-width: 200px"
        hint="0 disables snapshots." />
      <q-input
        :model-value="model.snapshot_retention_count"
        @update:model-value="patch('snapshot_retention_count', toInt($event, 1, 100))"
        type="number" min="1" max="100" outlined dense
        label="Snapshot retention (count)"
        style="min-width: 200px"
        hint="Oldest snapshots beyond this count are pruned." />
    </div>

    <div class="text-subtitle2 q-mt-md">Watermark</div>
    <q-toggle
      :model-value="model.watermark_enabled"
      label="Enable on-screen watermark while container is mounted"
      @update:model-value="patch('watermark_enabled', !!$event)" />
    <q-input
      v-if="model.watermark_enabled"
      :model-value="model.watermark_template"
      outlined dense
      label="Watermark template"
      hint="Tokens: {{user}} {{timestamp}} {{label}} {{workspace}}"
      @update:model-value="patch('watermark_template', String($event ?? ''))" />
    <div v-if="model.watermark_enabled" class="text-caption text-grey-7">
      Preview: <code>{{ watermarkPreview }}</code>
    </div>

    <div class="text-subtitle2 q-mt-md">Geofence</div>
    <WorkspaceGeofenceEditor
      :model-value="(model.geofence_polygons || [])"
      :enforcement="model.geofence_enforcement || 'off'"
      @update:model-value="patch('geofence_polygons', $event)"
      @update:enforcement="patch('geofence_enforcement', $event)" />

    <template v-if="model.password_owner === 'user' && model.recovery_escrow_mode === 'escrow'">
      <q-separator class="q-my-md" />
      <WorkspaceEscrowOfficersEditor
        :workspace-id="workspaceId ?? null"
        :shamir-total="Number(model.escrow_shamir_total) || 0"
        :shamir-threshold="Number(model.escrow_shamir_threshold) || 0"
        @officers-changed="$emit('officers-changed', $event)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import WorkspaceGeofenceEditor from "./WorkspaceGeofenceEditor.vue";
import WorkspaceEscrowOfficersEditor from "./WorkspaceEscrowOfficersEditor.vue";

interface PolicyModel {
  password_owner?: "admin" | "user";
  recovery_escrow_mode?: "escrow" | "zero_knowledge";
  escrow_shamir_threshold?: number;
  escrow_shamir_total?: number;
  require_tpm_binding?: boolean;
  idle_lock_minutes?: number;
  bruteforce_max_attempts?: number;
  bruteforce_lockout_minutes?: number;
  snapshot_interval_hours?: number;
  snapshot_retention_count?: number;
  watermark_enabled?: boolean;
  watermark_template?: string;
  require_windows_hello?: boolean;
  geofence_enforcement?: "off" | "audit" | "enforce";
  geofence_polygons?: { name: string; polygon: [number, number][] }[];
}

const props = defineProps<{
  modelValue: PolicyModel;
  activeOfficerCount?: number;
  /** When set, the embedded officers editor renders against this workspace. */
  workspaceId?: number | null;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", v: PolicyModel): void;
  (e: "officers-changed", count: number): void;
}>();

const model = computed(() => props.modelValue || {});

const passwordOwnerOptions = [
  { label: "Admin (legacy — recovery key stored server-side)", value: "admin" },
  { label: "User (industrial — Shamir / TPM / brute-force / etc)", value: "user" },
];
const passwordOwnerHint = computed(() =>
  model.value.password_owner === "user"
    ? "Container password is set by the end-user; the server never sees it. All Phase-1/2 protections become available."
    : "Container password is generated server-side; recovery key escrowed server-side."
);

const escrowModeOptions = [
  { label: "Escrow — k-of-n officer Shamir shares (recommended)", value: "escrow" },
  { label: "Zero-knowledge — data is lost if user forgets password", value: "zero_knowledge" },
];
const escrowModeHint = computed(() =>
  model.value.recovery_escrow_mode === "zero_knowledge"
    ? "No recovery is possible. Officer break-glass is disabled."
    : "Officers offline-decrypt their shares to break-glass-recover the user's data."
);

const totalHint = computed(() => {
  const n = model.value.escrow_shamir_total ?? 0;
  const active = props.activeOfficerCount;
  if (typeof active === "number") {
    return active === n
      ? `Workspace currently has ${active} active officer(s) — matches.`
      : `Workspace currently has ${active} active officer(s); ` +
        `init-password will refuse until exactly n = ${n} are configured.`;
  }
  return "Each officer holds one Shamir share; n must equal active officer count.";
});

const watermarkPreview = computed(() => {
  const tpl = model.value.watermark_template || "{{user}} · {{timestamp}} · {{label}}";
  return tpl
    .replaceAll("{{user}}", "alice")
    .replaceAll("{{timestamp}}", new Date().toISOString().slice(0, 19).replace("T", " "))
    .replaceAll("{{label}}", "Personal")
    .replaceAll("{{workspace}}", "Engineering");
});

function patch<K extends keyof PolicyModel>(key: K, value: PolicyModel[K]) {
  emit("update:modelValue", { ...model.value, [key]: value });
}

function toInt(v: any, min: number, max?: number): number {
  let n = Number(v);
  if (!Number.isFinite(n)) n = min;
  n = Math.floor(n);
  if (n < min) n = min;
  if (max !== undefined && n > max) n = max;
  return n;
}
</script>
