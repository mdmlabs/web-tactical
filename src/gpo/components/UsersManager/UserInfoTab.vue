<template>
  <div class="row q-col-gutter-xs">
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Display Name</div>
      <div class="text-body2">
        {{ user?.info?.displayname || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Description</div>
      <div class="text-body2">
        {{ user?.info?.description || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Name</div>
      <div class="text-body2">
        {{ user?.info?.givenname || user?.info?.name || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Middle Name</div>
      <div class="text-body2">
        {{ user?.info?.middlename || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Surname</div>
      <div class="text-body2">
        {{ user?.info?.surname || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Email</div>
      <div class="text-body2">
        {{ user?.info?.email || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Telephone</div>
      <div class="text-body2">
        {{ user?.info?.telephonenumber || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Home Directory</div>
      <div class="text-body2 text-mono" style="font-size: 12px">
        {{ user?.info?.homedirectory || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Script Path</div>
      <div class="text-body2 text-mono" style="font-size: 12px">
        {{ user?.info?.scriptpath || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Employee ID</div>
      <div class="text-body2">
        {{ user?.info?.employeeid || "—" }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Account Expiration</div>
      <div class="text-body2">
        {{ formatTimestamp(user?.info?.accountexpirationdate) }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Password Last Set</div>
      <div class="text-body2">
        {{ formatTimestamp(user?.info?.passwordlastset) }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Last Logon</div>
      <div class="text-body2">
        {{ formatTimestamp(user?.info?.lastlogon) }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Agents (linked / max)</div>
      <div class="text-body2">
        {{ agentsQuotaLine }}
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="text-caption text-grey-6">Policies (collections / max)</div>
      <div class="text-body2">
        {{ policiesQuotaLine }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { UserWithIdInfo } from "@/generated/user_service_pb";

const props = withDefaults(
  defineProps<{
    user: UserWithIdInfo.AsObject | null;
    agentsCount?: number;
    appliedCollectionsCount?: number;
  }>(),
  {
    agentsCount: 0,
    appliedCollectionsCount: 0,
  },
);

function pickNumericField(
  info: Record<string, unknown> | undefined,
  camel: string,
  snake: string,
): number | undefined {
  if (!info) return undefined;
  const v = info[camel] ?? info[snake];
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function formatCountVsLimit(
  count: number,
  max: number | undefined | null,
): string {
  const c = Number.isFinite(count) ? count : 0;
  if (max === undefined || max === null || Number.isNaN(Number(max))) {
    return String(c);
  }
  return `${c} / ${max}`;
}

const agentsQuotaLine = computed(() => {
  const info = props.user?.info as Record<string, unknown> | undefined;
  const max = pickNumericField(info, "maxAgents", "max_agents");
  return formatCountVsLimit(props.agentsCount ?? 0, max);
});

const policiesQuotaLine = computed(() => {
  const info = props.user?.info as Record<string, unknown> | undefined;
  const max = pickNumericField(info, "maxPolicies", "max_policies");
  return formatCountVsLimit(props.appliedCollectionsCount ?? 0, max);
});

function formatTimestamp(ts: unknown): string {
  if (!ts) return "—";
  if (typeof ts === "string") return ts || "—";
  const obj = ts as { seconds?: number; nanos?: number };
  if (typeof obj.seconds === "number") {
    const date = new Date(obj.seconds * 1000);
    return date.toLocaleString();
  }
  return "—";
}
</script>

<style scoped lang="sass">
.text-mono
  font-family: monospace
</style>
