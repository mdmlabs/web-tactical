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
          <template v-if="filteredPolicies.length">
            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(p, index) in filteredPolicies"
                :key="(p as any).id"
                class="policy-item"
              >
                <q-item-section avatar>
                  <div class="text-caption text-grey-6">{{ index + 1 }}</div>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="policy" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ (p as any).name }}</q-item-label>
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
defineProps<{
  modelValue: boolean;
  collection: {
    id?: number;
    name?: string;
    explainText?: string;
    policies?: Array<{ id?: number; name?: string }>;
  } | null;
  policySearchQuery: string;
  filteredPolicies: unknown[];
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  "update:policySearchQuery": [value: string];
}>();
</script>
