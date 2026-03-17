<template>
  <div class="groups-right-panel">
    <div
      v-if="selectedCategoryId == null"
      class="column items-center justify-center full-height text-grey-6"
    >
      <q-icon name="laptop" size="3rem" class="q-mb-md" />
      <div class="text-h6">Select a category</div>
      <div class="text-caption q-mt-xs">
        Click on a category in the tree to see its details
      </div>
    </div>

    <template v-else>
      <div class="groups-detail-header q-px-lg q-py-md row items-center">
        <div>
          <div class="text-h6 text-weight-medium">
            {{ selectedCategory?.name ?? "—" }}
          </div>
          <div
            v-if="selectedCategory?.description"
            class="text-caption text-grey-6"
          >
            {{ selectedCategory.description }}
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
        >
          <q-menu>
            <q-list dense style="min-width: 200px">
              <q-item clickable v-close-popup @click="$emit('edit')">
                <q-item-section avatar>
                  <q-icon name="edit" color="primary" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="$emit('move')">
                <q-item-section avatar>
                  <q-icon name="drive_file_move" color="secondary" />
                </q-item-section>
                <q-item-section>Move to</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="$emit('delete')">
                <q-item-section avatar>
                  <q-icon name="delete" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative"
                  >Delete Category</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
        @update:model-value="$emit('update:detailTab', String($event))"
      >
        <q-tab name="agents" icon="dns" label="Agents">
          <q-badge
            v-if="(categoryAgents?.length ?? 0) > 0"
            color="primary"
            :label="categoryAgents.length"
            floating
            rounded
          />
        </q-tab>
        <q-tab name="children" icon="account_tree" label="Child Categories">
          <q-badge
            v-if="(categoryChildren?.length ?? 0) > 0"
            color="primary"
            :label="categoryChildren.length"
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
            v-if="categoryAppliedCollectionsLoading"
            color="grey"
            label="..."
            floating
            rounded
          />
          <q-badge
            v-else-if="(categoryAppliedCollections?.length ?? 0) > 0"
            color="primary"
            :label="categoryAppliedCollections.length"
            floating
            rounded
          />
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels :model-value="detailTab" class="groups-tab-panels">
        <q-tab-panel name="agents" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">Agents in this category</div>
            <q-space />
            <q-btn
              flat
              dense
              color="secondary"
              icon="open_in_new"
              label=""
              :disable="selectedCategoryId == null"
              title="Replace the entire list of agents"
              class="q-mr-sm"
              @click="$emit('set-agents')"
            />
            <q-btn
              flat
              dense
              color="primary"
              icon="add_circle_outline"
              label=""
              :disable="selectedCategoryId == null"
              title="Select a category first"
              @click="$emit('add-agent')"
            />
          </div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <div
            v-else-if="(categoryAgents?.length ?? 0) === 0"
            class="text-grey-6 text-caption"
          >
            No agents in this category
          </div>
          <q-list v-else bordered separator>
            <q-item
              v-for="agent in categoryAgents"
              :key="agent.id"
              class="row items-center cursor-pointer"
              clickable
              @click="$emit('open-agent-dashboard', agent.id)"
            >
              <q-item-section avatar>
                <q-icon name="laptop" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ agent.name }}</q-item-label>
                <q-item-label
                  v-if="agent.name !== agent.id"
                  caption
                  class="text-grey-6"
                >
                  {{ agent.id }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="remove_circle_outline"
                  size="xs"
                  color="negative"
                  title="Remove from category"
                  @click.stop="$emit('remove-agent', agent.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="children" class="q-pa-md">
          <div class="text-subtitle2 q-mb-md">Child Categories</div>
          <div v-if="detailLoading" class="text-center q-pa-md">
            <q-spinner color="primary" />
          </div>
          <q-table
            v-else
            :rows="categoryChildren"
            :columns="childrenColumns"
            row-key="categoryId"
            flat
            bordered
            dense
            :rows-per-page-options="[15, 30, 50, 0]"
            :no-data-label="'No child categories'"
          >
            <template v-slot:body-cell-name="cellProps">
              <q-td :props="cellProps">
                <span
                  class="text-primary cursor-pointer"
                  @click="$emit('navigate-to-category', cellProps.row)"
                  >{{ cellProps.value }}</span
                >
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="collections" class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle2">
              Policy collections for this category
            </div>
            <q-space />
            <q-btn
              flat
              dense
              color="primary"
              icon="add_circle_outline"
              label=""
              :disable="selectedCategoryId == null"
              @click="$emit('apply-collection')"
            />
          </div>
          <div class="collections-tab-scroll">
            <div
              v-if="selectedCategoryId == null"
              class="text-grey-6 text-caption"
            >
              Select a category to apply policy collections.
            </div>
            <template v-else>
              <div
                v-if="categoryAppliedCollectionsLoading"
                class="column items-center q-py-lg"
              >
                <q-spinner color="primary" size="2em" />
                <div class="text-caption text-grey-7 q-mt-sm">
                  Loading applied collections...
                </div>
              </div>
              <template
                v-else-if="(categoryAppliedCollections?.length ?? 0) > 0"
              >
                <q-table
                  :rows="categoryAppliedCollections"
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
                          @click="$emit('open-collection-details', props.row)"
                        >
                          <q-icon name="visibility" size="xs" class="q-mr-xs" />
                          <span class="text-weight-medium">{{
                            props.row.name || props.row.id
                          }}</span>
                        </div>
                      </q-td>
                      <q-td key="explainText" :props="props">
                        <div class="text-caption text-grey-7">
                          {{ props.row.explainText || "—" }}
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
                          @click="
                            $emit('remove-collection-by-id', props.row.id)
                          "
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </template>
              <div v-else class="text-body2 text-grey-7">
                Apply a policy collection to this category so that its policies
                apply to all machines. Use the button above to choose a
                collection. No collections applied yet.
              </div>
            </template>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from "quasar";

defineProps<{
  selectedCategoryId: number | null;
  selectedCategory: { name: string; description?: string } | null;
  detailTab: string;
  detailLoading: boolean;
  actionLoading: boolean;
  categoryAgents: Array<{ id: string; name: string }>;
  categoryChildren: unknown[];
  childrenColumns: QTableColumn[];
  categoryAppliedCollections: unknown[];
  categoryAppliedCollectionsLoading: boolean;
  collectionsColumns: QTableColumn[];
}>();

defineEmits<{
  edit: [];
  move: [];
  delete: [];
  "update:detailTab": [value: string];
  "add-agent": [];
  "set-agents": [];
  "remove-agent": [agentId: string];
  "open-agent-dashboard": [agentId: string];
  "navigate-to-category": [row: unknown];
  "apply-collection": [];
  "remove-collection-by-id": [collectionId: number];
  "open-collection-details": [row: unknown];
}>();
</script>
