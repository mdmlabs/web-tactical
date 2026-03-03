<template>
  <div class="groups-right-panel">
    <div
      v-if="!selectedGroupSam"
      class="column items-center justify-center full-height text-grey-6"
    >
      <q-icon name="group" size="3rem" class="q-mb-md" />
      <div class="text-h6">Select a group</div>
      <div class="text-caption q-mt-xs">
        Click on a group in the tree to see its details
      </div>
    </div>

    <template v-else>
      <div class="groups-detail-header q-px-lg q-py-md row items-center">
        <div>
          <div class="text-h6 text-weight-medium">
            {{
              group?.displayname ||
              group?.name ||
              selectedGroupSam
            }}
          </div>
          <div class="text-caption text-grey-6">
            {{ group?.distinguishedname || selectedGroupSam }}
          </div>
        </div>
        <q-space />
        <q-btn
          flat
          dense
          color="negative"
          icon="delete"
          label="Delete Group"
          :loading="deleteLoading"
          @click="$emit('delete')"
        />
      </div>

      <q-separator />

      <div class="row q-gutter-sm q-px-lg q-py-md">
        <q-card flat bordered class="col-auto">
          <q-card-section
            class="q-pa-sm text-center"
            style="min-width: 120px"
          >
            <div class="text-caption text-grey-6">SAM Name</div>
            <div class="text-body2 text-weight-medium">
              {{ group?.samaccountname || "—" }}
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="col-auto">
          <q-card-section
            class="q-pa-sm text-center"
            style="min-width: 120px"
          >
            <div class="text-caption text-grey-6">SID</div>
            <div
              class="text-body2 text-weight-medium text-mono"
              style="font-size: 11px"
            >
              {{ group?.sid || "—" }}
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="col">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-6">Description</div>
            <div class="text-body2">
              {{ group?.description || "—" }}
            </div>
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
        @update:model-value="(v: string) => $emit('update:detailTab', v)"
      >
        <q-tab name="members" icon="people" label="Members">
          <q-badge
            v-if="groupUsers.length"
            color="primary"
            :label="groupUsers.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="children" icon="account_tree" label="Child Groups">
          <q-badge
            v-if="groupChildren.length"
            color="primary"
            :label="groupChildren.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="parents" icon="call_merge" label="Parent Groups">
          <q-badge
            v-if="groupParents.length"
            color="primary"
            :label="groupParents.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="agents" icon="dns" label="Agents">
          <q-badge
            v-if="groupAgents.length"
            color="primary"
            :label="groupAgents.length"
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
            v-if="groupAppliedCollectionsLoading"
            color="grey"
            label="..."
            floating
            rounded
          />
          <q-badge
            v-else-if="groupAppliedCollections.length > 0"
            color="primary"
            :label="groupAppliedCollections.length"
            floating
            rounded
          />
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels :model-value="detailTab" class="groups-tab-panels">
        <q-tab-panel name="members" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Group Members</div>
            <q-space />
            <q-btn
              flat
              dense
              color="primary"
              icon="person_add"
              label="Add User"
              :disable="!selectedGroupSam"
              @click="$emit('add-user')"
            />
          </div>

          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <q-table
            v-else
            :rows="groupUsers"
            :columns="usersColumns"
            row-key="samaccountname"
            flat
            bordered
            dense
            :rows-per-page-options="[15, 30, 50, 0]"
            :no-data-label="'No members in this group'"
          >
            <template v-slot:body-cell-actions="cellProps">
              <q-td :props="cellProps">
                <q-btn
                  flat
                  round
                  dense
                  icon="person_remove"
                  size="xs"
                  color="negative"
                  title="Remove from group"
                  @click="$emit('remove-user', cellProps.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="children" class="q-pa-md">
          <div class="text-subtitle2 q-mb-md">Child Groups</div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <q-table
            v-else
            :rows="groupChildren"
            :columns="groupsSubColumns"
            row-key="samaccountname"
            flat
            bordered
            dense
            :rows-per-page-options="[15, 30, 50, 0]"
            :no-data-label="'No child groups'"
          >
            <template v-slot:body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-group', cellProps.row)"
                >{{ cellProps.value }}</span>
                </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="parents" class="q-pa-md">
          <div class="text-subtitle2 q-mb-md">Parent Groups</div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <q-table
            v-else
            :rows="groupParents"
            :columns="groupsSubColumns"
            row-key="samaccountname"
            flat
            bordered
            dense
            :rows-per-page-options="[15, 30, 50, 0]"
            :no-data-label="'No parent groups'"
          >
            <template v-slot:body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-group', cellProps.row)"
                >{{ cellProps.value }}</span>
                </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="agents" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Agents linked to this group</div>
            <q-space />
            <q-btn
              flat
              dense
              color="primary"
              icon="add_circle_outline"
              label="Add agent"
              :disable="!selectedGroupId"
              title="Select a group first"
              @click="$emit('add-agent')"
            />
          </div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <div
            v-else-if="groupAgents.length === 0"
            class="text-grey-6 text-caption"
          >
            No agents linked
          </div>
          <q-list v-else bordered separator>
            <q-item
              v-for="agentId in groupAgents"
              :key="agentId"
              class="row items-center"
            >
              <q-item-section avatar>
                <q-icon name="dns" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ agentId }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="remove_circle_outline"
                  size="sm"
                  color="negative"
                  :loading="removingAgentId === agentId"
                  title="Remove agent"
                  @click="$emit('remove-agent', agentId)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="collections" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">
              Policy collections for this group
            </div>
            <q-space />
            <q-btn
              flat
              dense
              color="primary"
              icon="add_circle_outline"
              label="Apply collection"
              :disable="!selectedGroupId"
              @click="$emit('apply-collection')"
            />
            <q-btn
              flat
              dense
              color="negative"
              icon="remove_circle_outline"
              label="Remove collection"
              :disable="!canRemoveCollection"
              title="Remove an applied collection from this group"
              @click="$emit('remove-collection')"
            />
          </div>
          <div class="collections-tab-scroll">
            <div
              v-if="!selectedGroupId"
              class="text-grey-6 text-caption"
            >
              Select a group to apply policy collections.
            </div>
            <template v-else>
              <div
                v-if="groupAppliedCollectionsLoading"
                class="column items-center q-py-lg"
              >
                <q-spinner color="primary" size="2em" />
                <div class="text-caption text-grey-7 q-mt-sm">
                  Loading applied collections...
                </div>
              </div>
              <template v-else-if="groupAppliedCollections.length">
                <div class="text-caption text-grey-7 q-mb-sm">
                  Applied collections:
                </div>
                <div class="applied-collections-list">
                  <div
                    v-for="c in groupAppliedCollections"
                    :key="c.id"
                    class="applied-collection-block"
                  >
                    <div class="text-weight-medium">
                      {{ c.name || c.id }}
                    </div>
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
                      <ul
                        class="q-pl-md q-mt-xs q-mb-none text-caption text-grey-8"
                      >
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
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this group so that its
                policies apply to all members. Use the button above to
                choose a collection. No collections applied yet.
              </div>
            </template>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface GroupRow {
  name?: string;
  displayname?: string;
  distinguishedname?: string;
  samaccountname?: string;
  description?: string;
  sid?: string;
}

export interface AppliedCollection {
  id: number;
  name: string;
  explainText?: string;
  policies?: { id: number; name: string }[];
}

const usersColumns = [
  {
    name: "displayname",
    label: "Display Name",
    field: "displayname",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "samaccountname",
    label: "SAM Name",
    field: "samaccountname",
    align: "left" as const,
    sortable: true,
  },
  { name: "sid", label: "SID", field: "sid", align: "left" as const },
  {
    name: "actions",
    label: "",
    field: "actions",
    align: "center" as const,
    style: "width: 48px",
  },
];

const groupsSubColumns = [
  {
    name: "name",
    label: "Name",
    field: (r: GroupRow) => r.displayname || r.name || r.samaccountname,
    align: "left" as const,
    sortable: true,
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

defineProps<{
  selectedGroupSam: string | null;
  selectedGroupId: string | null;
  group: GroupRow | null;
  detailTab: string;
  detailLoading: boolean;
  deleteLoading: boolean;
  groupUsers: GroupRow[];
  groupChildren: GroupRow[];
  groupParents: GroupRow[];
  groupAgents: string[];
  removingAgentId?: string | null;
  groupAppliedCollections: AppliedCollection[];
  groupAppliedCollectionsLoading: boolean;
  canRemoveCollection: boolean;
}>();

defineEmits<{
  delete: [];
  "update:detailTab": [value: string];
  "add-user": [];
  "remove-user": [user: GroupRow];
  "navigate-to-group": [row: GroupRow];
  "add-agent": [];
  "remove-agent": [agentId: string];
  "apply-collection": [];
  "remove-collection": [];
}>();
</script>

<style scoped lang="sass">
.groups-right-panel
  flex: 1
  display: flex
  flex-direction: column
  overflow: hidden

.groups-detail-header
  flex-shrink: 0

.groups-tab-panels
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
