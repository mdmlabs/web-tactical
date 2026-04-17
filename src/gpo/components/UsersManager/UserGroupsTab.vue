<template>
  <div>
    <div v-if="!compact" class="row items-center q-mb-md">
      <div class="text-subtitle2">User groups</div>
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        icon="group_add"
        label=""
        :disable="!hasTarget"
        :title="!hasTarget ? 'Select target first (click badge in header)' : ''"
        @click="$emit('add-to-group')"
      />
    </div>
    <div v-if="showSearch" class="q-mb-sm">
      <q-input
        v-model="search"
        dense
        outlined
        clearable
        placeholder="Search groups..."
        :disable="loading"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" />
    </div>
    <q-scroll-area v-if="compact && !loading" class="groups-compact-scroll">
      <q-table
        :rows="filteredGroups"
        :columns="columns"
        row-key="samaccountname"
        flat
        :bordered="false"
        dense
        :rows-per-page-options="[10, 25, 50]"
        :no-data-label="'No groups'"
      />
    </q-scroll-area>
    <q-table
      v-else-if="!loading"
      :rows="filteredGroups"
      :columns="columns"
      row-key="samaccountname"
      flat
      :bordered="!compact"
      dense
      :rows-per-page-options="[10, 25, 50, 0]"
      :no-data-label="'No groups'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { GroupRow } from "@/gpo/composables/useUserActions";

const props = defineProps<{
  groups: GroupRow[];
  loading: boolean;
  hasTarget: boolean;
  compact?: boolean;
  searchable?: boolean;
  compactHeightPx?: number;
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

const search = ref("");
const showSearch = computed(() => {
  if (props.searchable === false) return false;
  return props.compact === true;
});

const compactHeight = computed(() => `${Math.max(150, Math.floor(props.compactHeightPx ?? 260))}px`);

const filteredGroups = computed(() => {
  const q = (search.value ?? "").trim().toLowerCase();
  if (!q) return props.groups;
  return (props.groups ?? []).filter((g) => {
    const name = String(g.displayname || g.name || "").toLowerCase();
    const sam = String(g.samaccountname || "").toLowerCase();
    const desc = String(g.description || "").toLowerCase();
    return name.includes(q) || sam.includes(q) || desc.includes(q);
  });
});
</script>

<style scoped lang="sass">
.groups-compact-scroll
  height: v-bind(compactHeight)
</style>
