<template>
  <div class="users-right-panel">
    <div
      v-if="!selectedId"
      class="column items-center justify-center full-height text-grey-6"
    >
      <q-icon name="person" size="3rem" class="q-mb-md" />
      <div class="text-h6">Select a user</div>
      <div class="text-caption q-mt-xs">
        Click on a user in the list or create a new one
      </div>
    </div>

    <template v-else>
      <div class="users-detail-header q-px-lg q-py-md row items-center">
        <div>
          <div class="text-h6 text-weight-medium">
            {{
              user?.info?.displayname ||
              user?.info?.samaccountname ||
              selectedId
            }}
          </div>
          <div class="text-caption text-grey-6">
            {{ user?.info?.samaccountname || selectedId }}
            <span
              v-if="user?.info?.sid"
              class="q-ml-sm text-mono"
              style="font-size: 11px"
              >{{ user.info.sid }}</span
            >
          </div>
        </div>
        <q-space />
        <div class="row q-gutter-xs">
          <q-btn
            flat
            dense
            color="primary"
            icon="edit"
            label="Update"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('update')"
          />
          <q-btn
            flat
            dense
            :color="user?.info?.isenabled !== false ? 'orange' : 'positive'"
            :icon="user?.info?.isenabled !== false ? 'block' : 'check_circle'"
            :label="user?.info?.isenabled !== false ? 'Disable' : 'Enable'"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="
              !hasTarget ? 'Select target first (click badge in header)' : ''
            "
            @click="$emit('toggle-enable')"
          />
          <q-btn
            flat
            dense
            icon="lock"
            label="Set Password"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('set-password')"
          />
          <q-btn
            flat
            dense
            icon="lock_open"
            label="Unlock"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('unlock')"
          />
          <q-btn
            flat
            dense
            icon="password"
            label="Expire Password"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('expire-password')"
          />
          <q-btn
            flat
            dense
            icon="event"
            label="Account Expiration"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('set-expiration')"
          />
          <q-btn
            flat
            dense
            color="negative"
            icon="delete"
            label="Delete"
            :loading="actionLoading"
            :disable="!hasTarget"
            :title="!hasTarget ? 'Select target first' : ''"
            @click="$emit('delete')"
          />
        </div>
      </div>

      <q-separator />

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="2em" />
      </div>

      <template v-else-if="user">
        <div class="row q-gutter-sm q-px-lg q-py-md">
          <q-card flat bordered class="col-auto">
            <q-card-section
              class="q-pa-sm text-center"
              style="min-width: 100px"
            >
              <div class="text-caption text-grey-6">Enabled</div>
              <q-icon
                :name="
                  user.info?.isenabled !== false ? 'check_circle' : 'block'
                "
                :color="
                  user.info?.isenabled !== false ? 'positive' : 'negative'
                "
                size="sm"
              />
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col-auto">
            <q-card-section
              class="q-pa-sm text-center"
              style="min-width: 100px"
            >
              <div class="text-caption text-grey-6">Locked</div>
              <q-icon
                :name="user.info?.islocked ? 'lock' : 'lock_open'"
                :color="user.info?.islocked ? 'negative' : 'grey'"
                size="sm"
              />
            </q-card-section>
          </q-card>
          <q-card flat bordered class="col-auto">
            <q-card-section
              class="q-pa-sm text-center"
              style="min-width: 100px"
            >
              <div class="text-caption text-grey-6">Password expired</div>
              <q-icon
                :name="user.info?.passwordexpired ? 'warning' : 'check_circle'"
                :color="user.info?.passwordexpired ? 'orange' : 'grey'"
                size="sm"
              />
            </q-card-section>
          </q-card>
        </div>

        <q-separator />

        <q-tabs
          :model-value="detailTab"
          dense
          inline-label
          class="text-grey bg-grey-1"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
          @update:model-value="$emit('update:detailTab', $event)"
        >
          <q-tab name="info" icon="info" label="Info" />
          <q-tab name="groups" icon="group" label="Groups">
            <q-badge
              v-if="groups.length"
              color="primary"
              :label="groups.length"
              floating
              rounded
            />
          </q-tab>
          <q-tab name="agents" icon="dns" label="Agents">
            <q-badge
              v-if="agents.length"
              color="primary"
              :label="agents.length"
              floating
              rounded
            />
          </q-tab>
          <q-tab
            name="collections"
            icon="collections_bookmark"
            label="Policy collections"
          >
            <q-badge
              v-if="appliedCollectionsLoading"
              color="grey"
              label="..."
              floating
              rounded
            />
            <q-badge
              v-else-if="(appliedCollections?.length ?? 0) > 0"
              color="primary"
              :label="appliedCollections?.length ?? 0"
              floating
              rounded
            />
          </q-tab>
        </q-tabs>

        <q-separator />

        <q-tab-panels :model-value="detailTab" class="users-tab-panels">
          <q-tab-panel name="info" class="q-pa-md">
            <UserInfoTab :user="user" />
          </q-tab-panel>
          <q-tab-panel name="groups" class="q-pa-md">
            <UserGroupsTab
              :groups="groups"
              :loading="groupsLoading"
              :has-target="hasTarget"
              @add-to-group="$emit('add-to-group')"
            />
          </q-tab-panel>
          <q-tab-panel name="agents" class="q-pa-md">
            <UserAgentsTab
              :agents="agents"
              :loading="agentsLoading"
              :has-target="hasTarget"
              @add-agent="$emit('add-agent')"
            />
          </q-tab-panel>
          <q-tab-panel name="collections" class="q-pa-md">
            <div class="row items-center q-mb-md">
              <div class="text-subtitle2">Policy collections for this user</div>
              <q-space />
              <q-btn
                flat
                dense
                color="primary"
                icon="add_circle_outline"
                label="Apply collection"
                :disable="!canApplyCollection"
                :title="
                  canApplyCollection
                    ? ''
                    : 'Select a single agent as target in the header'
                "
                @click="$emit('add-collection')"
              />
              <q-btn
                flat
                dense
                color="negative"
                icon="remove_circle_outline"
                label="Remove collection"
                :disable="!canRemoveCollection"
                :title="
                  canRemoveCollection
                    ? 'Remove an applied collection from the selected agent'
                    : 'Select a single agent and ensure user has applied collections'
                "
                @click="$emit('remove-collection')"
              />
            </div>
            <div class="collections-tab-scroll">
              <div
                v-if="appliedCollectionsLoading"
                class="column items-center q-py-lg"
              >
                <q-spinner color="primary" size="2em" />
                <div class="text-caption text-grey-7 q-mt-sm">
                  Loading applied collections...
                </div>
              </div>
              <template v-else-if="appliedCollections.length">
                <div class="text-caption text-grey-7 q-mb-sm">
                  Applied collections:
                </div>
                <div class="applied-collections-list">
                  <div
                    v-for="c in appliedCollections"
                    :key="c.id"
                    class="applied-collection-block"
                  >
                    <div class="text-weight-medium">{{ c.name || c.id }}</div>
                    <div
                      v-if="c.explainText"
                      class="text-caption text-grey-7 q-mt-xs"
                    >
                      {{ c.explainText }}
                    </div>
                    <template v-if="c.policies?.length">
                      <div class="text-caption text-grey-7 q-mt-sm">
                        Policies in collection:
                      </div>
                      <ul class="q-pl-md q-mt-xs q-mb-none text-caption text-grey-8">
                        <li
                          v-for="p in c.policies"
                          :key="p.id"
                          class="q-py-xs"
                        >
                          {{ p.name }}
                        </li>
                      </ul>
                    </template>
                  </div>
                </div>
              </template>
              <div
                v-else-if="!canApplyCollection"
                class="text-grey-6 text-caption"
              >
                Select a single agent as target (click the badge in the header)
                to apply policy collections to this user.
              </div>
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this user on the selected agent.
                Use the button above to choose a collection. No collections
                applied yet.
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UserWithIdInfo } from "@/generated/user_service_pb";
import type { GroupRow } from "@/gpo/composables/useUserActions";
import UserInfoTab from "./UserInfoTab.vue";
import UserGroupsTab from "./UserGroupsTab.vue";
import UserAgentsTab from "./UserAgentsTab.vue";

withDefaults(
  defineProps<{
    selectedId: string | null;
    user: UserWithIdInfo.AsObject | null;
    loading: boolean;
    hasTarget: boolean;
    actionLoading: boolean;
    detailTab: string;
    groups: GroupRow[];
    groupsLoading: boolean;
    agents: string[];
    agentsLoading: boolean;
    appliedCollections?: {
      id: number;
      name: string;
      explainText?: string;
      policies?: { id: number; name: string }[];
    }[];
    appliedCollectionsLoading?: boolean;
    canApplyCollection: boolean;
    canRemoveCollection: boolean;
  }>(),
  {
    appliedCollections: () => [],
    appliedCollectionsLoading: false,
    canRemoveCollection: false,
  },
);

defineEmits<{
  update: [];
  delete: [];
  "toggle-enable": [];
  "set-password": [];
  unlock: [];
  "expire-password": [];
  "set-expiration": [];
  "add-to-group": [];
  "add-agent": [];
  "add-collection": [];
  "remove-collection": [];
  "update:detailTab": [value: string];
}>();
</script>

<style scoped lang="sass">
.users-right-panel
  flex: 1
  display: flex
  flex-direction: column
  overflow: hidden

.users-detail-header
  flex-shrink: 0

.users-tab-panels
  flex: 1
  overflow: auto

.collections-tab-scroll
  max-height: 50vh
  overflow-y: auto

.applied-collections-list
  display: flex
  flex-direction: column
  gap: 12px

.applied-collection-block
  padding: 12px
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px
  background: rgba(0, 0, 0, 0.02)

.text-mono
  font-family: monospace
</style>
