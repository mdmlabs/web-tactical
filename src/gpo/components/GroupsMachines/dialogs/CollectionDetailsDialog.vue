<template>
  <q-dialog
    :model-value="modelValue"
    position="standard"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="row items-center q-pb-sm">
        <q-icon
          name="collections_bookmark"
          color="primary"
          size="sm"
          class="q-mr-sm"
        />
        <div class="text-h6">
          {{ collection?.name || collection?.id }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="collection?.explainText" class="q-pt-sm q-pb-sm">
        <div class="text-caption text-grey-7">
          {{ collection.explainText }}
        </div>
      </q-card-section>

      <q-separator v-if="collection?.explainText" />

      <q-card-section class="q-pt-sm">
        <div class="row items-center q-mb-sm">
          <q-space />
          <q-input
            :model-value="policySearchQuery"
            dense
            outlined
            placeholder="Search policies..."
            clearable
            @update:model-value="
              $emit('update:policySearchQuery', String($event ?? ''))
            "
            @clear="$emit('update:policySearchQuery', '')"
            style="max-width: 250px"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="policies-list-container">
          <template v-if="filteredPoliciesWithCompliance.length">
            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(p, index) in filteredPoliciesWithCompliance"
                :key="p.id"
                class="policy-item"
              >
                <q-item-section avatar>
                  <div class="text-caption text-grey-6">{{ index + 1 }}</div>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="policy" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ p.name }}</q-item-label>
                </q-item-section>
                <q-item-section side class="policy-compliance-section">
                  <div v-if="p.compliance?.loading" class="compliance-loading-mini">
                    <q-spinner size="xs" color="grey-6" />
                  </div>
                  <div v-else-if="p.compliance && p.compliance.totalAgents > 0" class="policy-compliance-wrapper">
                    <q-badge
                      :color="getPolicyStatusColor(p.compliance)"
                      :label="getPolicyStatusLabel(p.compliance)"
                      class="q-mb-xs"
                    >
                      <q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[0, 8]"
                      >
                        <div class="policy-compliance-tooltip">
                          <div class="tooltip-row">
                            <span class="tooltip-icon success">✓</span>
                            <span>Applied: {{ p.compliance.appliedAgents }} agents</span>
                          </div>
                          <div v-if="p.compliance.pendingAgents > 0" class="tooltip-row">
                            <span class="tooltip-icon pending">⏳</span>
                            <span>Pending: {{ p.compliance.pendingAgents }} agents</span>
                          </div>
                          <div v-if="p.compliance.notAssignedAgents > 0" class="tooltip-row">
                            <span class="tooltip-icon error">✗</span>
                            <span>Not Assigned: {{ p.compliance.notAssignedAgents }} agents</span>
                          </div>
                        </div>
                      </q-tooltip>
                    </q-badge>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      {{ p.compliance.appliedAgents }}/{{ p.compliance.totalAgents }} agents
                    </div>
                  </div>
                  <div v-else class="text-caption text-grey-5">—</div>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          <div
            v-else-if="policySearchQuery"
            class="text-center text-grey-6 q-pa-md"
          >
            <q-icon name="search_off" size="md" class="q-mb-sm" />
            <div>No policies found matching \"{{ policySearchQuery }}\"</div>
          </div>
          <div v-else class="text-center text-grey-6 q-pa-md">
            <q-icon name="info" size="md" class="q-mb-sm" />
            <div>No policies in this collection</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  policyStateClient,
  createAgentTarget,
} from "@/gpo/api/grpc-client";

interface AgentRow {
  id: string;
  name: string;
}

interface PolicyWithCompliance {
  id: number;
  name: string;
  compliance?: {
    appliedAgents: number;
    pendingAgents: number;
    notAssignedAgents: number;
    totalAgents: number;
    loading: boolean;
  };
}

const props = defineProps<{
  modelValue: boolean;
  collection: {
    id?: number;
    name?: string;
    explainText?: string;
    policies?: Array<{ id?: number; name?: string }>;
  } | null;
  policySearchQuery: string;
  categoryAgents: AgentRow[];
  selectedCategoryId: number | null;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  "update:policySearchQuery": [value: string];
}>();

const policiesWithCompliance = ref<PolicyWithCompliance[]>([]);
const policyComplianceCache = new Map<string, { appliedAgents: number; pendingAgents: number; notAssignedAgents: number; totalAgents: number; timestamp: number }>();
const POLICY_COMPLIANCE_CACHE_TTL = 5 * 60 * 1000;

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function calculatePolicyCompliance(
  categoryId: number,
  policyId: number,
  agentsInCategory: AgentRow[],
): Promise<{ appliedAgents: number; pendingAgents: number; notAssignedAgents: number; totalAgents: number }> {
  const totalAgents = agentsInCategory.length;
  
  if (totalAgents === 0) {
    return { appliedAgents: 0, pendingAgents: 0, notAssignedAgents: 0, totalAgents: 0 };
  }

  const cacheKey = `${categoryId}_${policyId}_${totalAgents}`;
  const cached = policyComplianceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < POLICY_COMPLIANCE_CACHE_TTL) {
    return {
      appliedAgents: cached.appliedAgents,
      pendingAgents: cached.pendingAgents,
      notAssignedAgents: cached.notAssignedAgents,
      totalAgents: cached.totalAgents,
    };
  }

  try {
    const results = await mapWithConcurrency(
      agentsInCategory,
      3,
      async (agent: AgentRow) => {
        try {
          const target = createAgentTarget(agent.id);
          if (!target) {
            return { isAssigned: false, isApplied: false };
          }

          const [assignmentsResponse, effectivePoliciesResponse] = await Promise.all([
            policyStateClient.getAssignments(target, "en-US").catch(() => ({ assignmentsList: [] })),
            policyStateClient.getEffectivePolicies(target, "en-US").catch(() => ({ policiesList: [] })),
          ]);

          const policyIdStr = String(policyId);
          const policyHashVariant = `policy_${policyIdStr}`;

          const isAssigned = (assignmentsResponse.assignmentsList || []).some(
            (a) =>
              a.summary?.id === policyId ||
              String(a.summary?.id) === policyIdStr ||
              a.policyHash === policyHashVariant,
          );

          const isApplied = (effectivePoliciesResponse.policiesList || []).some(
            (p) =>
              p.summary?.id === policyId ||
              String(p.summary?.id) === policyIdStr ||
              p.policyHash === policyHashVariant,
          );

          return { isAssigned, isApplied };
        } catch {
          return { isAssigned: false, isApplied: false };
        }
      },
    );

    let appliedAgents = 0;
    let pendingAgents = 0;
    let notAssignedAgents = 0;

    for (const result of results) {
      if (result.isAssigned && result.isApplied) {
        appliedAgents++;
      } else if (result.isAssigned && !result.isApplied) {
        pendingAgents++;
      } else {
        notAssignedAgents++;
      }
    }

    const complianceResult = { appliedAgents, pendingAgents, notAssignedAgents, totalAgents };
    policyComplianceCache.set(cacheKey, { ...complianceResult, timestamp: Date.now() });
    return complianceResult;
  } catch (err) {
    console.error("Error calculating policy compliance:", err);
    return { appliedAgents: 0, pendingAgents: 0, notAssignedAgents: 0, totalAgents };
  }
}

function getPolicyStatusColor(compliance: PolicyWithCompliance["compliance"]): string {
  if (!compliance) return "grey";
  const { appliedAgents, pendingAgents, totalAgents } = compliance;
  
  if (appliedAgents === totalAgents) return "positive";
  if (appliedAgents > 0 || pendingAgents > 0) return "warning";
  return "negative";
}

function getPolicyStatusLabel(compliance: PolicyWithCompliance["compliance"]): string {
  if (!compliance) return "Unknown";
  const { appliedAgents, pendingAgents, totalAgents } = compliance;
  
  if (appliedAgents === totalAgents) return "Applied";
  if (appliedAgents > 0 || pendingAgents > 0) return "Pending";
  return "Not Applied";
}

const filteredPoliciesWithCompliance = computed(() => {
  if (!policiesWithCompliance.value.length) return [];
  if (!props.policySearchQuery) return policiesWithCompliance.value;

  const query = props.policySearchQuery.toLowerCase();
  return policiesWithCompliance.value.filter((p) =>
    p.name.toLowerCase().includes(query),
  );
});

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) {
      policiesWithCompliance.value = [];
      return;
    }

    const collection = props.collection;
    if (!collection?.policies || !props.selectedCategoryId || !props.categoryAgents.length) {
      policiesWithCompliance.value = collection?.policies?.map(p => ({
        id: p.id ?? 0,
        name: p.name ?? "",
        compliance: {
          appliedAgents: 0,
          pendingAgents: 0,
          notAssignedAgents: 0,
          totalAgents: 0,
          loading: false,
        }
      })) || [];
      return;
    }

    policiesWithCompliance.value = collection.policies.map(p => ({
      id: p.id ?? 0,
      name: p.name ?? "",
      compliance: {
        appliedAgents: 0,
        pendingAgents: 0,
        notAssignedAgents: 0,
        totalAgents: props.categoryAgents.length,
        loading: true,
      }
    }));

    await mapWithConcurrency(
      policiesWithCompliance.value,
      3,
      async (policy) => {
        try {
          const result = await calculatePolicyCompliance(
            props.selectedCategoryId!,
            policy.id,
            props.categoryAgents,
          );
          policy.compliance = {
            appliedAgents: result.appliedAgents,
            pendingAgents: result.pendingAgents,
            notAssignedAgents: result.notAssignedAgents,
            totalAgents: result.totalAgents,
            loading: false,
          };
        } catch {
          if (policy.compliance) {
            policy.compliance.loading = false;
          }
        }
      },
    );
  },
  { immediate: true },
);
</script>

<style scoped lang="sass">
.policies-list-container
  max-height: 60vh
  overflow-y: auto
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px

.policy-item
  transition: background-color 0.2s

  &:hover
    background-color: rgba(0, 0, 0, 0.02)

.policy-compliance-section
  min-width: 150px
  max-width: 150px

.policy-compliance-wrapper
  display: flex
  flex-direction: column
  align-items: flex-end
  gap: 4px

.compliance-loading-mini
  display: flex
  align-items: center
  justify-content: flex-end

.policy-compliance-tooltip
  padding: 8px
  font-size: 12px

.tooltip-row
  display: flex
  align-items: center
  gap: 8px
  padding: 4px 0

.tooltip-icon
  font-size: 14px
  
  &.success
    color: #4caf50
  
  &.pending
    color: #ff9800
  
  &.error
    color: #f44336

.body--dark .policies-list-container
  border-color: rgba(255, 255, 255, 0.12)

.body--dark .policy-item:hover
  background-color: rgba(255, 255, 255, 0.06)
</style>
