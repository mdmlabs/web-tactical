<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="text-subtitle2">User groups</div>
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        icon="group_add"
        label="Add to group"
        :disable="!hasTarget"
        :title="!hasTarget ? 'Select target first (click badge in header)' : ''"
        @click="$emit('add-to-group')"
      />
    </div>
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" />
    </div>
    <q-table
      v-else
      :rows="groups"
      :columns="columns"
      row-key="samaccountname"
      flat
      bordered
      dense
      :rows-per-page-options="[10, 25, 50, 0]"
      :no-data-label="'No groups'"
    />
  </div>
</template>

<script setup lang="ts">
import type { GroupRow } from "@/gpo/composables/useUserActions";

defineProps<{
  groups: GroupRow[];
  loading: boolean;
  hasTarget: boolean;
}>();

defineEmits<{ "add-to-group": [] }>();

const columns = [
  {
    name: "name",
    label: "Name",
    field: (r: GroupRow) => r.displayname || r.name || r.samaccountname,
    align: "left" as const,
  },
  {
    name: "samaccountname",
    label: "SAM Name",
    field: "samaccountname",
    align: "left" as const,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
  },
];
</script>
