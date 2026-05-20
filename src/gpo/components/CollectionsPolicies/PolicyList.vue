<template>
  <q-card flat bordered class="column" style="height: calc(100vh - 220px)">
    <q-card-section class="policy-list-section">
      <div class="text-subtitle2 q-mb-md">Policies</div>
      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner color="primary" size="2em" />
        <div class="q-mt-sm">Loading...</div>
      </div>
      <EmptyState
        v-else-if="error"
        icon="error"
        :message="error"
        error
        retry-label="Retry"
        @retry="$emit('retry')"
      />
      <q-scroll-area
        v-else-if="filteredGroupedPolicies.length > 0"
        class="policy-list-scroll"
        :style="{ height: 'calc(100vh - 340px)' }"
      >
        <div
          v-for="group in filteredGroupedPolicies"
          :key="group.scopeKey"
          class="q-mb-md"
        >
          <div
            class="text-caption text-weight-medium text-grey-7 q-mb-xs q-px-sm"
          >
            {{ group.scopeLabel }}
          </div>
          <q-list separator>
            <q-item
              v-for="policy in group.policies"
              :key="policy.id"
              clickable
              v-ripple
              :active="selectedPolicy?.id === policy.id"
              class="policy-item"
              @click="$emit('selectPolicy', policy)"
            >
              <q-item-section avatar>
                <q-checkbox
                  :model-value="selectedPolicies[policy.id] || false"
                  @update:model-value="
                    $emit('togglePolicySelection', policy.id)
                  "
                  @click.stop
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  policy.displayName || policy.name
                }}</q-item-label>
                <q-item-label caption class="q-mt-xs">
                  <PolicyMetaChips
                    :version="policy.version"
                    :policy-status="policy.policyStatus"
                  />
                </q-item-label>
              </q-item-section>
              <q-item-section
                v-if="selectedPolicies[policy.id]"
                side
                class="q-pl-sm"
              >
                <q-toggle
                  :model-value="policyState[policy.id] !== false"
                  color="primary"
                  dense
                  :label="policyState[policy.id] !== false ? 'On' : 'Off'"
                  @update:model-value="
                    $emit('updatePolicyState', policy.id, $event)
                  "
                  @click.stop
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div
          v-if="selectedCount > 0"
          class="q-pa-sm q-mt-sm bg-primary text-white rounded-borders"
        >
          <div class="text-caption">
            Selected: {{ selectedCount }} policy(ies)
          </div>
        </div>
      </q-scroll-area>
      <EmptyState
        v-else-if="hasCategory"
        icon="info"
        message="No policies in category"
      />
      <EmptyState v-else icon="info" message="Select a category" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import { PolicyItem } from "@/gpo/types/policy-catalog";
import PolicyMetaChips from "@/gpo/components/shared/PolicyMetaChips.vue";

defineProps<{
  filteredGroupedPolicies: {
    scopeKey: string;
    scopeLabel: string;
    policies: PolicyItem[];
  }[];
  loading: boolean;
  error?: string | null;
  selectedPolicy: PolicyItem | null;
  selectedPolicies: Record<string, boolean>;
  selectedCount: number;
  hasCategory: boolean;
  policyState: Record<string, boolean>;
}>();

defineEmits<{
  (e: "selectPolicy", policy: PolicyItem): void;
  (e: "togglePolicySelection", policyId: string): void;
  (e: "updatePolicyState", policyId: string, enabled: boolean): void;
  (e: "retry"): void;
}>();
</script>

<style scoped lang="sass">
.policy-list-scroll
  min-height: 200px
</style>
