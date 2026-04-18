<template>
  <div class="users-left-panel">
    <div class="users-left-header row items-center q-px-md q-py-sm">
      <div class="text-subtitle1 text-weight-medium">Users</div>
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
        icon="refresh"
        color="grey-7"
        title="Refresh"
        :loading="loading"
        @click="$emit('refresh')"
      />
    </div>

    <q-separator />

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

    <q-list v-else-if="users.length > 0" class="users-list" separator>
      <q-item
        v-for="u in users"
        :key="u.userid"
        clickable
        v-ripple
        :active="selectedId === u.userid"
        active-class="users-list-item-active"
        @click="$emit('select', u)"
      >
        <q-item-section avatar>
          <q-icon
            name="person"
            :color="u.info?.isenabled !== false ? 'primary' : 'grey'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{
            u.info?.displayname || u.info?.samaccountname || u.userid
          }}</q-item-label>
          <q-item-label caption>{{
            u.info?.samaccountname || u.userid
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

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

defineProps<{
  users: UserWithIdInfo.AsObject[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  search: string;
  canCreate: boolean;
}>();

defineEmits<{
  select: [user: UserWithIdInfo.AsObject];
  refresh: [];
  create: [];
  "update:search": [value: string];
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

.users-list
  flex: 1 1 0
  overflow: auto
  min-height: 0

.users-list-item-active
  background: rgba(25, 118, 210, .1)

.body--dark .users-left-panel
  border-right-color: rgba(255, 255, 255, 0.12)

.body--dark .users-list-item-active
  background: rgba(25, 118, 210, 0.25)
</style>
