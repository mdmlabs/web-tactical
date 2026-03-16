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
        <q-btn
          flat
          round
          dense
          icon="more_vert"
          color="primary"
          :loading="actionLoading"
          :disable="!hasTarget"
          :title="!hasTarget ? 'Select target first' : ''"
        >
          <q-menu>
            <q-list dense style="min-width: 200px">
              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('update')"
              >
                <q-item-section avatar>
                  <q-icon name="edit" color="primary" />
                </q-item-section>
                <q-item-section>Update</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('toggle-enable')"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="user?.info?.isenabled !== false ? 'block' : 'check_circle'"
                    :color="user?.info?.isenabled !== false ? 'orange' : 'positive'"
                  />
                </q-item-section>
                <q-item-section>
                  {{ user?.info?.isenabled !== false ? 'Disable' : 'Enable' }}
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('set-password')"
              >
                <q-item-section avatar>
                  <q-icon name="lock" />
                </q-item-section>
                <q-item-section>Set Password</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('unlock')"
              >
                <q-item-section avatar>
                  <q-icon name="lock_open" />
                </q-item-section>
                <q-item-section>Unlock</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('expire-password')"
              >
                <q-item-section avatar>
                  <q-icon name="password" />
                </q-item-section>
                <q-item-section>Expire Password</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('set-expiration')"
              >
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>
                <q-item-section>Account Expiration</q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                :disable="!hasTarget"
                @click="$emit('delete')"
              >
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
              :removing-agent-id="removingAgentId"
              @add-agent="$emit('add-agent')"
              @remove-agent="$emit('remove-agent', $event)"
              @open-agent-dashboard="$emit('open-agent-dashboard', $event)"
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
                label=""
                :disable="!canApplyCollection"
                :title="
                  canApplyCollection
                    ? ''
                    : 'Select a single agent as target in the header'
                "
                @click="$emit('add-collection')"
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
                <q-table
                  :rows="appliedCollections"
                  :columns="collectionsColumns"
                  row-key="id"
                  flat
                  bordered
                  :rows-per-page-options="[0]"
                  hide-pagination
                  class="collections-table"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="name" :props="props">
                        <div
                          class="cursor-pointer text-primary row items-center no-wrap"
                          @click="openCollectionDetailsDialog(props.row)"
                        >
                          <q-icon
                            name="visibility"
                            size="xs"
                            class="q-mr-xs"
                          />
                          <span class="text-weight-medium">{{ props.row.name || props.row.id }}</span>
                        </div>
                      </q-td>
                      <q-td key="explainText" :props="props">
                        <div class="text-caption text-grey-7">
                          {{ props.row.explainText || '—' }}
                        </div>
                      </q-td>
                      <q-td key="policiesCount" :props="props">
                        <q-badge
                          v-if="props.row.policies?.length"
                          color="primary"
                          :label="props.row.policies.length"
                        />
                        <span v-else class="text-grey-5">0</span>
                      </q-td>
                      <q-td key="actions" :props="props">
                        <q-btn
                          flat
                          round
                          dense
                          icon="delete"
                          color="negative"
                          size="sm"
                          :title="`Remove collection ${props.row.name || props.row.id}`"
                          @click="$emit('remove-collection-by-id', props.row.id)"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
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

    <q-dialog v-model="showCollectionDetailsDialog" position="standard">
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="row items-center q-pb-sm">
          <q-icon name="collections_bookmark" color="primary" size="sm" class="q-mr-sm" />
          <div class="text-h6">{{ selectedCollection?.name || selectedCollection?.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedCollection?.explainText" class="q-pt-sm q-pb-sm">
          <div class="text-caption text-grey-7">{{ selectedCollection.explainText }}</div>
        </q-card-section>

        <q-separator v-if="selectedCollection?.explainText" />

        <q-card-section class="q-pt-sm">
          <div class="row items-center q-mb-sm">
            <q-space />
            <q-input
              v-model="policySearchQuery"
              dense
              outlined
              placeholder="Search policies..."
              style="max-width: 250px"
              clearable
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
                </q-item>
              </q-list>
            </template>
            <div v-else-if="policySearchQuery" class="text-center text-grey-6 q-pa-md">
              <q-icon name="search_off" size="md" class="q-mb-sm" />
              <div>No policies found matching "{{ policySearchQuery }}"</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { UserWithIdInfo } from "@/generated/user_service_pb";
import type { GroupRow, AgentRow } from "@/gpo/composables/useUserActions";
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
    agents: AgentRow[];
    agentsLoading: boolean;
    removingAgentId?: string | null;
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
  "remove-agent": [agentId: string];
  "add-collection": [];
  "remove-collection": [];
  "remove-collection-by-id": [collectionId: number];
  "update:detailTab": [value: string];
  "open-agent-dashboard": [agentId: string];
}>();

const collectionsColumns = [
  {
    name: "name",
    label: "Collection Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "explainText",
    label: "Description",
    field: "explainText",
    align: "left" as const,
    sortable: false,
  },
  {
    name: "policiesCount",
    label: "Policies",
    field: (row: { policies?: unknown[] }) => row.policies?.length || 0,
    align: "center" as const,
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
    sortable: false,
  },
];

type CollectionType = {
  id: number;
  name: string;
  explainText?: string;
  policies?: { id: number; name: string }[];
};

const showCollectionDetailsDialog = ref(false);
const selectedCollection = ref<CollectionType | null>(null);
const policySearchQuery = ref("");

const filteredPolicies = computed(() => {
  if (!selectedCollection.value?.policies) return [];
  if (!policySearchQuery.value) return selectedCollection.value.policies;

  const query = policySearchQuery.value.toLowerCase();
  return selectedCollection.value.policies.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
});

function openCollectionDetailsDialog(collection: CollectionType) {
  selectedCollection.value = collection;
  policySearchQuery.value = "";
  showCollectionDetailsDialog.value = true;
}
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

.collections-table
  :deep(.q-table__top)
    padding: 0

  :deep(.q-table tbody td)
    font-size: 13px

  :deep(.q-table thead th)
    font-weight: 600

.policies-list-container
  max-height: 60vh
  overflow-y: auto
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px

.policy-item
  transition: background-color 0.2s

  &:hover
    background-color: rgba(0, 0, 0, 0.02)

.text-mono
  font-family: monospace
</style>
