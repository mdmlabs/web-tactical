<template>
  <div class="users-left-panel">
    <div class="users-left-header row items-center q-px-md q-py-sm">
      <div class="row items-center no-wrap q-gutter-x-sm">
        <div class="text-subtitle1 text-weight-medium">Users</div>
        <q-badge
          v-if="!loading && !error && users.length > 0"
          color="grey-3"
          text-color="grey-8"
          :label="users.length"
          rounded
          class="users-count-badge"
        />
      </div>
      <q-space />
      <q-btn
        flat
        dense
        round
        icon="add"
        color="primary"
        title="Create user"
        :disable="!canCreate"
        @click="$emit('create')"
      />
      <q-btn
        flat
        dense
        round
        icon="filter_alt"
        :color="hasActiveFilters ? 'primary' : 'grey-7'"
        title="Filter users"
        @click="$emit('open-filter')"
      >
        <q-badge
          v-if="activeFiltersCount > 0"
          color="primary"
          floating
          transparent
        >
          {{ activeFiltersCount }}
        </q-badge>
      </q-btn>
      <q-btn
        flat
        dense
        round
        icon="refresh"
        color="grey-7"
        title="Refresh"
        :loading="loading"
        @click="$emit('refresh')"
      />
    </div>

    <q-separator />

    <div
      v-if="hasActiveFilters"
      class="q-px-md q-pt-sm row items-center q-gutter-xs"
    >
      <q-chip
        v-if="filterManufacturer"
        dense
        removable
        color="primary"
        text-color="white"
        @remove="$emit('clear-filter', 'manufacturer')"
      >
        {{ filterManufacturer }}
      </q-chip>
      <q-chip
        v-if="filterModel"
        dense
        removable
        color="primary"
        text-color="white"
        @remove="$emit('clear-filter', 'model')"
      >
        {{ filterModel }}
      </q-chip>
      <q-chip
        v-if="filterMinimalOsVersion"
        dense
        removable
        color="primary"
        text-color="white"
        @remove="$emit('clear-filter', 'minimalOsVersion')"
      >
        {{ filterMinimalOsLabel }}
      </q-chip>
    </div>

    <div class="q-px-md q-py-sm">
      <q-input
        :model-value="search"
        dense
        outlined
        placeholder="Search..."
        clearable
        :input-style="{ paddingLeft: '6px' }"
        @update:model-value="(val) => $emit('update:search', String(val ?? ''))"
        @clear="$emit('update:search', '')"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="xs" />
        </template>
      </q-input>
    </div>

    <div v-if="loading" class="column items-center justify-center q-pa-xl">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm text-caption">Loading users...</div>
    </div>

    <div
      v-else-if="error"
      class="column items-center justify-center q-pa-lg text-negative"
    >
      <q-icon name="error" size="2rem" class="q-mb-sm" />
      <div class="text-caption">{{ error }}</div>
      <q-btn
        flat
        dense
        color="primary"
        label="Retry"
        class="q-mt-sm"
        @click="$emit('refresh')"
      />
    </div>

    <q-virtual-scroll
      v-else-if="users.length > 0"
      class="users-list-virtual"
      :items="users"
      :virtual-scroll-item-size="56"
      :virtual-scroll-slice-size="10"
      separator
    >
      <template #default="{ item: u }">
        <q-item
          :key="u.userid"
          dense
          clickable
          v-ripple
          class="users-list-item"
          :active="selectedId === u.userid"
          active-class="users-list-item-active"
          @click="$emit('select', u)"
        >
          <q-item-section avatar class="users-list-avatar-wrap">
            <div
              class="users-list-avatar"
              :class="{
                'users-list-avatar--inactive': u.info?.isenabled === false,
              }"
            >
              <q-icon name="person" size="18px" class="users-list-avatar-icon" />
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label class="users-list-title ellipsis" lines="1">{{
              u.info?.displayname || u.info?.samaccountname || u.userid
            }}</q-item-label>
            <q-item-label caption class="users-list-sub ellipsis" lines="1">{{
              u.info?.samaccountname || u.userid
            }}</q-item-label>
          </q-item-section>
          <q-item-section side class="users-list-side">
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-icon
                v-if="u.info?.passwordexpired"
                name="schedule"
                color="warning"
                size="16px"
              >
                <q-tooltip>Password expired</q-tooltip>
              </q-icon>
              <q-icon
                :name="u.info?.islocked ? 'lock' : 'lock_open'"
                :color="u.info?.islocked ? 'negative' : 'grey-6'"
                size="18px"
              >
                <q-tooltip>
                  {{ u.info?.islocked ? "Locked" : "Not locked" }}
                </q-tooltip>
              </q-icon>
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>

    <div v-else class="column items-center justify-center q-pa-xl text-grey-6">
      <q-icon name="person_off" size="2rem" class="q-mb-sm" />
      <div class="text-caption">
        {{ search ? "No users match the filter" : "No users found" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserWithIdInfo } from "@/generated/user_service_pb";

import type { AgentListFilterField } from "@/gpo/composables/useAgentListFilters";

defineProps<{
  users: UserWithIdInfo.AsObject[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  search: string;
  canCreate: boolean;
  hasActiveFilters?: boolean;
  activeFiltersCount?: number;
  filterManufacturer?: string;
  filterModel?: string;
  filterMinimalOsVersion?: string;
  filterMinimalOsLabel?: string;
}>();

defineEmits<{
  select: [user: UserWithIdInfo.AsObject];
  refresh: [];
  create: [];
  "update:search": [value: string];
  "open-filter": [];
  "clear-filter": [field: AgentListFilterField];
}>();
</script>

<style scoped lang="sass">
.users-left-panel
  width: 200px
  min-width: 240px
  max-width: 360px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0,0,0,.12)


.users-left-header
  flex-shrink: 0

.users-count-badge
  font-weight: 600
  font-size: 11px
  padding: 2px 8px
  letter-spacing: 0.02em

.users-list-virtual
  flex: 1 1 0
  min-height: 0
  height: 100%
  padding: 4px 0

.users-list-virtual :deep(.q-item)
  border-left: 3px solid transparent
  transition: background-color 0.15s ease, border-left-color 0.15s ease

.users-list-virtual :deep(.q-item:not(.users-list-item-active):hover)
  background: rgba(0, 0, 0, 0.04)

.users-list-item-active
  background: rgba(25, 118, 210, 0.08)
  border-left-color: #1976d2 !important

.users-list-avatar-wrap
  min-width: 40px

.users-list-avatar
  width: 32px
  height: 32px
  border-radius: 8px
  display: flex
  align-items: center
  justify-content: center
  color: #0d47a1
  background: #e3f2fd
  border: 1px solid rgb(144, 202, 249)

.users-list-avatar-icon
  opacity: 0.9

.users-list-avatar--inactive
  color: #424242
  background: #f5f5f5
  border-color: #e0e0e0

.users-list-title
  font-size: 13px
  font-weight: 600
  line-height: 1.25

.users-list-sub
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
  font-size: 11px
  opacity: 0.85

.users-list-side
  padding-left: 4px

.body--dark .users-left-panel
  border-right-color: rgba(255, 255, 255, 0.12)

.body--dark .users-list-virtual :deep(.q-item:not(.users-list-item-active):hover)
  background: rgba(255, 255, 255, 0.06)

.body--dark .users-list-item-active
  background: rgba(25, 118, 210, 0.22)

.body--dark .users-list-avatar
  color: #e3f2fd
  background: #1565c0
  border: 1px solid rgb(66, 165, 245)

.body--dark .users-list-avatar-icon
  opacity: 0.95

.body--dark .users-list-avatar--inactive
  color: #eeeeee
  background: #424242
  border-color: #616161

.body--dark .users-count-badge
  background: rgba(255, 255, 255, 0.12) !important
</style>
