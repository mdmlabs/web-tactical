<template>
  <q-card flat bordered class="column" style="height: calc(100vh - 220px)">
    <q-card-section class="policy-list-section">
      <div class="row items-center q-mb-md">
        <div class="text-subtitle2">Policies</div>
        <q-space />
        <q-select
          :model-value="scopeFilter"
          :options="scopeFilterOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 140px"
          @update:model-value="$emit('update:scopeFilter', $event)"
        />
      </div>
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
                  @update:model-value="$emit('togglePolicySelection', policy.id)"
                  @click.stop
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ policy.displayName || policy.name }}</q-item-label>
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
      <EmptyState
        v-else
        icon="info"
        message="Select a category"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
import type { PolicyItem } from "../types/policy-catalog";

defineProps<{
  filteredGroupedPolicies: { scopeKey: string; scopeLabel: string; policies: PolicyItem[] }[];
  loading: boolean;
  error?: string | null;
  selectedPolicy: PolicyItem | null;
  selectedPolicies: Record<string, boolean>;
  selectedCount: number;
  scopeFilter: string;
  scopeFilterOptions: { label: string; value: string }[];
  hasCategory: boolean;
}>();

defineEmits<{
  (e: "update:scopeFilter", value: string): void;
  (e: "selectPolicy", policy: PolicyItem): void;
  (e: "togglePolicySelection", policyId: string): void;
  (e: "retry"): void;
}>();
</script>

<style scoped lang="sass">
.policy-list-scroll
  min-height: 200px
</style>
