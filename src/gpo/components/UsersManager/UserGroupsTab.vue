<template>
  <div>
    <div class="text-subtitle2 q-mb-md">User groups (GetUserGroups)</div>
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
}>();

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
