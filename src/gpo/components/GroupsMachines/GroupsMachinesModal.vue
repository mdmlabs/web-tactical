<template>
  <div class="groups-manager-layout groups-machines-layout">
    <div class="groups-manager-header">
      <q-toolbar>
        <q-btn
          v-if="standalonePage"
          flat
          round
          dense
          icon="arrow_back"
          color="primary"
          @click="goBack"
        />
        <q-icon name="dns" size="sm" class="q-mr-sm" color="primary" />
        <q-toolbar-title>Groups Machines</q-toolbar-title>

        <q-btn
          v-if="!standalonePage"
          flat
          round
          dense
          icon="close"
          color="primary"
          @click="$emit('close')"
        />
      </q-toolbar>
    </div>

    <div class="groups-manager-page">
      <div class="groups-manager-body">
        <div class="groups-left-panel">
          <div class="groups-left-header row items-center q-px-md q-py-sm">
            <div class="text-subtitle1 text-weight-medium">Categories</div>
            <q-space />
            <q-btn
              flat
              dense
              round
              icon="add"
              color="primary"
              title="Create category"
              @click="openCreateCategoryDialog"
            />
            <q-btn
              flat
              dense
              round
              icon="refresh"
              color="grey-7"
              title="Refresh"
              :loading="categoriesLoading"
              @click="loadCategories"
            />
          </div>

          <q-separator />

          <div class="q-px-md q-py-sm">
            <q-input
              v-model="categorySearch"
              dense
              outlined
              placeholder="Search..."
              clearable
              :input-style="{ paddingLeft: '6px' }"
              @clear="categorySearch = ''"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="xs" />
              </template>
            </q-input>
          </div>

          <div
            v-if="categoriesLoading"
            class="column items-center justify-center q-pa-xl"
          >
            <q-spinner color="primary" size="2em" />
            <div class="q-mt-sm text-caption">Loading categories...</div>
          </div>

          <div
            v-else-if="categoriesError"
            class="column items-center justify-center q-pa-lg text-negative"
          >
            <q-icon name="error" size="2rem" class="q-mb-sm" />
            <div class="text-caption">{{ categoriesError }}</div>
            <q-btn
              flat
              dense
              color="primary"
              label="Retry"
              class="q-mt-sm"
              @click="loadCategories"
            />
          </div>

          <q-scroll-area
            v-else-if="filteredCategoryTree.length > 0"
            class="groups-tree-scroll"
          >
            <q-tree
              :nodes="filteredCategoryTree"
              node-key="id"
              :selected="selectedCategoryIdKey"
              default-expand-all
              class="groups-tree q-pa-sm"
              @update:selected="selectCategory"
            >
              <template v-slot:default-header="prop">
                <div class="row items-center full-width groups-tree-item">
                  <q-icon
                    name="folder"
                    color="warning"
                    size="xs"
                    class="q-mr-xs"
                  />
                  <div class="col ellipsis text-body2">
                    {{ prop.node.label }}
                  </div>
                  <q-badge
                    v-if="prop.node.children?.length"
                    color="grey-4"
                    text-color="grey-8"
                    :label="prop.node.children.length"
                    class="q-ml-xs"
                  />
                </div>
              </template>
            </q-tree>
          </q-scroll-area>

          <div
            v-else
            class="column items-center justify-center q-pa-xl text-grey-6"
          >
            <q-icon name="folder_off" size="2rem" class="q-mb-sm" />
            <div class="text-caption">
              {{
                categorySearch
                  ? "No categories match the filter"
                  : "No categories found"
              }}
            </div>
          </div>
        </div>

        <q-separator vertical />

        <div class="groups-right-panel">
          <div
            v-if="selectedCategoryId == null"
            class="column items-center justify-center full-height text-grey-6"
          >
            <q-icon name="dns" size="3rem" class="q-mb-md" />
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
                dense
                color="primary"
                icon="edit"
                label="Edit"
                :loading="editLoading"
                @click="openEditCategoryDialog"
              />
              <q-btn
                flat
                dense
                color="secondary"
                icon="drive_file_move"
                label="Move to"
                :loading="moveLoading"
                @click="openMoveCategoryDialog"
              />
              <q-btn
                flat
                dense
                color="negative"
                icon="delete"
                label="Delete Category"
                :loading="deleteLoading"
                @click="confirmDeleteCategory"
              />
            </div>

            <q-separator />

            <q-tabs
              v-model="detailTab"
              dense
              inline-label
              class="text-grey bg-grey-1"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
              no-caps
            >
              <q-tab name="agents" icon="dns" label="Agents">
                <q-badge
                  v-if="categoryAgents.length"
                  color="primary"
                  :label="categoryAgents.length"
                  floating
                  rounded
                />
              </q-tab>
              <q-tab
                name="children"
                icon="account_tree"
                label="Child Categories"
              >
                <q-badge
                  v-if="categoryChildren.length"
                  color="primary"
                  :label="categoryChildren.length"
                  floating
                  rounded
                />
              </q-tab>
              <q-tab
                name="subtreeAgents"
                icon="account_tree"
                label="Agents in subtree"
              >
                <q-badge
                  v-if="subtreeAgents.length"
                  color="primary"
                  :label="subtreeAgents.length"
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
                  v-else-if="categoryAppliedCollections.length > 0"
                  color="primary"
                  :label="categoryAppliedCollections.length"
                  floating
                  rounded
                />
              </q-tab>
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="detailTab" class="groups-tab-panels">
              <q-tab-panel name="agents" class="q-pa-md">
                <div class="row items-center q-mb-md">
                  <div class="text-subtitle2">Agents in this category</div>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="secondary"
                    icon="edit"
                    label="Set all agents"
                    :disable="selectedCategoryId == null"
                    title="Replace the entire list of agents"
                    @click="openSetAgentsDialog"
                    class="q-mr-sm"
                  />
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label="Add agent"
                    :disable="selectedCategoryId == null"
                    title="Select a category first"
                    @click="showAddAgentPanel = true"
                  />
                </div>
                <div v-if="detailLoading" class="text-center q-pa-md">
                  <q-spinner color="primary" />
                </div>
                <div
                  v-else-if="categoryAgents.length === 0"
                  class="text-grey-6 text-caption"
                >
                  No agents in this category
                </div>
                <q-list v-else bordered separator>
                  <q-item
                    v-for="agentId in categoryAgents"
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
                        size="xs"
                        color="negative"
                        title="Remove from category"
                        @click="removeAgentFromCategory(agentId)"
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
                        @click="navigateToCategory(cellProps.row)"
                        >{{ cellProps.value }}</span
                      >
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="subtreeAgents" class="q-pa-md">
                <div class="text-subtitle2 q-mb-md">
                  Agents in this category and all descendant categories
                </div>
                <div v-if="detailLoading" class="text-center q-pa-md">
                  <q-spinner color="primary" />
                </div>
                <div
                  v-else-if="subtreeAgents.length === 0"
                  class="text-grey-6 text-caption"
                >
                  No agents in subtree
                </div>
                <q-list v-else bordered separator>
                  <q-item
                    v-for="agentId in subtreeAgents"
                    :key="agentId"
                    class="row items-center"
                  >
                    <q-item-section avatar>
                      <q-icon name="dns" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ agentId }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="collections" class="q-pa-md">
                <div class="row items-center q-mb-md">
                  <div class="text-subtitle2">
                    Policy collections for this category (machine scope)
                  </div>
                  <q-space />
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="add_circle_outline"
                    label="Apply collection"
                    :disable="selectedCategoryId == null"
                    @click="showApplyCollectionDialog = true"
                  />
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="remove_circle_outline"
                    label="Remove collection"
                    :disable="!canRemoveCategoryCollection"
                    title="Remove an applied collection from this category"
                    @click="showRemoveCollectionDialog = true"
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
                    <template v-else-if="categoryAppliedCollections.length">
                      <div class="text-caption text-grey-7 q-mb-sm">
                        Applied collections:
                      </div>
                      <div class="applied-collections-list">
                        <div
                          v-for="c in categoryAppliedCollections"
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
                      No policy collections applied to this category yet. Use
                      «Apply collection» to assign a collection (machine scope).
                    </div>
                  </template>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </div>
      </div>
    </div>

    <q-dialog v-model="showEditCategory" @show="loadCategoryForEdit">
      <q-card style="min-width: 360px; margin-bottom: 250px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Edit Category</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="editCategoryForm.name"
            label="Category Name *"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="editCategoryForm.description"
            label="Description"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save"
            :loading="editLoading"
            :disable="!editCategoryForm.name.trim()"
            @click="doUpdateCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showMoveCategory">
      <q-card style="min-width: 360px; margin-bottom: 250px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Move to Category</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            New parent for «{{ selectedCategory?.name }}»
          </div>
          <q-select
            v-model="moveCategoryForm.parentId"
            :options="moveParentOptions"
            option-value="categoryId"
            option-label="label"
            emit-value
            map-options
            label="Parent Category"
            outlined
            dense
            clearable
            class="q-mb-sm"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No parent (root)
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Move"
            :loading="moveLoading"
            @click="doSetCategoryParent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSetAgents" @show="prepareSetAgentsForm">
      <q-card style="min-width: 400px; margin-bottom: 250px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Set all agents</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            One agent ID per line. This replaces the current list.
          </div>
          <q-input
            v-model="setAgentsForm.agentIdsText"
            outlined
            dense
            type="textarea"
            rows="6"
            placeholder="agent-id-1&#10;agent-id-2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Set agents"
            :loading="setAgentsLoading"
            @click="doSetCategoryAgents"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCreateCategory">
      <q-card style="min-width: 360px; margin-bottom: 250px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Category</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="createCategoryForm.name"
            label="Category Name *"
            outlined
            dense
            class="q-mb-sm"
            autofocus
          />
          <q-select
            v-model="createCategoryForm.parentId"
            :options="parentCategoryOptions"
            option-value="categoryId"
            option-label="label"
            emit-value
            map-options
            label="Parent Category"
            outlined
            dense
            clearable
            class="q-mb-sm"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No parent (root category)
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            v-model="createCategoryForm.description"
            label="Description"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Create"
            :loading="createCategoryLoading"
            :disable="!createCategoryForm.name.trim()"
            @click="doCreateCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showApplyCollectionDialog"
      position="standard"
      @show="loadCollectionsForApply"
    >
      <q-card class="apply-collection-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Apply collection to category</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Category:
            <strong>{{ selectedCategory?.name ?? selectedCategoryId }}</strong>
          </div>
          <q-select
            v-model="applyCollectionSelectedId"
            :options="applyCollectionOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="Collection *"
            outlined
            dense
            :loading="applyCollectionLoading"
            :disable="applyCollectionLoading"
            clearable
            options-dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{
                    applyCollectionLoading
                      ? "Loading..."
                      : "No collections available"
                  }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Apply"
            :loading="applyCollectionApplying"
            :disable="!applyCollectionSelectedId"
            @click="confirmApplyCollectionToCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showRemoveCollectionDialog"
      position="standard"
      @show="prepareRemoveCollectionOptionsForCategory"
    >
      <q-card class="apply-collection-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Remove collection from category</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Category:
            <strong>{{ selectedCategory?.name ?? selectedCategoryId }}</strong>
          </div>
          <q-select
            v-model="removeCollectionSelectedId"
            :options="removeCollectionOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="Collection to remove *"
            outlined
            dense
            :loading="removeCollectionOptionsLoading"
            :disable="removeCollectionOptions.length === 0"
            clearable
            options-dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No collections to remove
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="negative"
            label="Remove"
            :loading="removeCollectionRemoving"
            :disable="removeCollectionSelectedId == null"
            @click="confirmRemoveCollectionFromCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <TargetSelectionDialog
      v-model="showAddAgentPanel"
      @select="handleAddAgentSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import {
  agentCategoryClient,
  getSingleAgentIdFromTarget,
  policyAssignmentClient,
  collectionsClient,
} from "@/gpo/api/grpc-client";
import operator_pb from "@/generated/operator_pb";
import type { TargetRef } from "@/gpo/composables/useTargetSelection";
import TargetSelectionDialog from "@/gpo/components/shared/TargetSelectionDialog.vue";
import { notifyError, notifySuccess } from "@/utils/notify";

interface CategoryRow {
  categoryId: number;
  name: string;
  description?: string;
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const props = withDefaults(
  defineProps<{ open?: boolean; standalonePage?: boolean }>(),
  { open: false, standalonePage: false },
);
defineEmits<{ close: [] }>();
const router = useRouter();
const $q = useQuasar();

function goBack() {
  router.push({ path: "/gpo", query: { tab: "dashboard" } });
}

const categoriesLoading = ref(false);
const categoriesError = ref<string | null>(null);
const categorySearch = ref("");
const categoryTreeNodes = ref<TreeNode[]>([]);
const allCategoriesFlat = ref<CategoryRow[]>([]);

const selectedCategoryId = ref<number | null>(null);
const selectedCategoryIdKey = ref<string | null>(null);
const selectedCategory = ref<{ name: string; description?: string } | null>(
  null,
);
const detailTab = ref("agents");
const detailLoading = ref(false);

const categoryAgents = ref<string[]>([]);
const categoryChildren = ref<CategoryRow[]>([]);
const subtreeAgents = ref<string[]>([]);

const deleteLoading = ref(false);
const editLoading = ref(false);
const moveLoading = ref(false);

const showEditCategory = ref(false);
const showMoveCategory = ref(false);
const editCategoryForm = ref<{ name: string; description: string }>({
  name: "",
  description: "",
});
const moveCategoryForm = ref<{ parentId: number | null }>({ parentId: null });

const showCreateCategory = ref(false);
const createCategoryLoading = ref(false);
const createCategoryForm = ref<{
  name: string;
  description: string;
  parentId: number | null;
}>({
  name: "",
  description: "",
  parentId: null,
});

function collectCategoriesFromTree(
  nodes: TreeNode[],
  list: CategoryRow[],
): void {
  for (const n of nodes) {
    const id = Number(n.id);
    if (!Number.isNaN(id)) {
      const row = allCategoriesFlat.value.find((c) => c.categoryId === id);
      if (row) list.push(row);
    }
    if (n.children?.length) {
      collectCategoriesFromTree(n.children, list);
    }
  }
}

const parentCategoryOptions = computed(() => {
  const list: CategoryRow[] = [];
  collectCategoriesFromTree(categoryTreeNodes.value, list);
  return list.map((c) => ({
    categoryId: c.categoryId,
    label: c.name || String(c.categoryId),
  }));
});

function collectCategoryIdAndDescendants(
  nodeId: number,
  nodes: TreeNode[],
  out: Set<number>,
): void {
  for (const n of nodes) {
    const id = Number(n.id);
    if (Number.isNaN(id)) continue;
    if (id === nodeId) {
      out.add(id);
      (n.children ?? []).forEach((ch) => {
        const cid = Number(ch.id);
        if (!Number.isNaN(cid)) {
          out.add(cid);
          collectCategoryIdAndDescendants(cid, ch.children ?? [], out);
        }
      });
      return;
    }
    if (n.children?.length) {
      collectCategoryIdAndDescendants(nodeId, n.children, out);
    }
  }
}

const moveParentOptions = computed(() => {
  const list: CategoryRow[] = [];
  collectCategoriesFromTree(categoryTreeNodes.value, list);
  const currentId = selectedCategoryId.value;
  if (currentId == null) {
    return list.map((c) => ({
      categoryId: c.categoryId,
      label: c.name || String(c.categoryId),
    }));
  }
  const exclude = new Set<number>([currentId]);
  collectCategoryIdAndDescendants(currentId, categoryTreeNodes.value, exclude);
  return list
    .filter((c) => !exclude.has(c.categoryId))
    .map((c) => ({
      categoryId: c.categoryId,
      label: c.name || String(c.categoryId),
    }));
});

const showAddAgentPanel = ref(false);
const showSetAgents = ref(false);
const setAgentsLoading = ref(false);
const setAgentsForm = ref<{ agentIdsText: string }>({ agentIdsText: "" });

const showApplyCollectionDialog = ref(false);
const applyCollectionLoading = ref(false);
const applyCollectionApplying = ref(false);
const applyCollectionSelectedId = ref<number | null>(null);
const applyCollectionOptions = ref<{ id: number; label: string }[]>([]);

const categoryAppliedCollections = ref<
  {
    id: number;
    name: string;
    explainText?: string;
    policies?: { id: number; name: string }[];
  }[]
>([]);
const categoryAppliedCollectionsLoading = ref(false);

const canRemoveCategoryCollection = computed(
  () =>
    !!selectedCategoryId.value &&
    (categoryAppliedCollections.value?.length ?? 0) > 0,
);

const showRemoveCollectionDialog = ref(false);
const removeCollectionSelectedId = ref<number | null>(null);
const removeCollectionOptions = ref<{ id: number; label: string }[]>([]);
const removeCollectionOptionsLoading = ref(false);
const removeCollectionRemoving = ref(false);

const childrenColumns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left" as const,
  },
];

type ApiCategoryTreeNode = {
  categoryId: number;
  name: string;
  description: string;
  childrenList?: ApiCategoryTreeNode[];
};

function mapCategoryTreeNodeToTreeNode(
  node: ApiCategoryTreeNode,
  flatList: CategoryRow[],
): TreeNode {
  const id = node.categoryId;
  flatList.push({
    categoryId: id,
    name: node.name || "",
    description: node.description || "",
  });
  const children = (node.childrenList || []).map((child) =>
    mapCategoryTreeNodeToTreeNode(child, flatList),
  );
  return {
    id: String(id),
    label: node.name || String(id),
    children: children.length > 0 ? children : undefined,
  };
}

function filterCategoryTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const lower = q.toLowerCase();
  const result: TreeNode[] = [];
  for (const n of nodes) {
    const matches = n.label.toLowerCase().includes(lower);
    const filteredChildren = n.children?.length
      ? filterCategoryTree(n.children, q)
      : [];
    const childMatches = filteredChildren.length > 0;
    if (matches || childMatches) {
      result.push({
        ...n,
        children: filteredChildren.length > 0 ? filteredChildren : n.children,
      });
    }
  }
  return result;
}

const filteredCategoryTree = computed<TreeNode[]>(() => {
  const q = categorySearch.value.trim();
  if (!q) return categoryTreeNodes.value;
  return filterCategoryTree(categoryTreeNodes.value, q);
});

async function loadCategories() {
  categoriesLoading.value = true;
  categoriesError.value = null;
  try {
    const res = await agentCategoryClient.getCategoryTree();
    if (res.status !== 0) {
      categoriesError.value = res.errorMessage ?? "Failed to load categories";
      return;
    }
    const roots = res.rootsList ?? [];
    const flatList: CategoryRow[] = [];
    categoryTreeNodes.value = (roots as ApiCategoryTreeNode[]).map((node) =>
      mapCategoryTreeNodeToTreeNode(node, flatList),
    );
    allCategoriesFlat.value = flatList;
  } catch (err) {
    categoriesError.value =
      err instanceof Error ? err.message : "Failed to load categories";
  } finally {
    categoriesLoading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!props.standalonePage && isOpen) loadCategories();
  },
  { immediate: true },
);

onMounted(() => {
  if (props.standalonePage) loadCategories();
});

function isMachineScope(raw: unknown): boolean {
  if (raw === undefined || raw === null) return false;
  if (typeof raw === "number") {
    const n = Math.floor(raw);
    return (
      n === operator_pb.PolicyScope.POLICY_SCOPE_MACHINE ||
      n === operator_pb.PolicyScope.POLICY_SCOPE_BOTH
    );
  }
  const s = String(raw).toUpperCase();
  return s === "MACHINE" || s === "BOTH" || s === "2" || s === "3";
}

async function loadCollectionsForApply() {
  applyCollectionLoading.value = true;
  applyCollectionSelectedId.value = null;
  applyCollectionOptions.value = [];
  try {
    const response = await collectionsClient.getAllCollections("en-US");
    const list =
      (
        response as {
          collectionsList?: Array<{
            id?: number | string;
            name?: string;
            scope?: number | string;
          }>;
        }
      ).collectionsList ??
      (
        response as {
          collections?: Array<{
            id?: number | string;
            name?: string;
            scope?: number | string;
          }>;
        }
      ).collections ??
      [];
    applyCollectionOptions.value = list
      .map((c) => {
        const rawId = c.id;
        let id = 0;
        if (rawId !== undefined && rawId !== null) {
          id =
            typeof rawId === "string"
              ? Number.parseInt(rawId, 10) || 0
              : Number(rawId);
        }
        return {
          id,
          label: (c.name as string) || String(rawId ?? ""),
          scope: c.scope,
        };
      })
      .filter(
        (o) =>
          o.id > 0 && isMachineScope(o.scope as number | string | undefined),
      )
      .map((o) => ({ id: o.id, label: o.label }));
  } catch {
    applyCollectionOptions.value = [];
  } finally {
    applyCollectionLoading.value = false;
  }
}

function confirmApplyCollectionToCategory() {
  const collectionId = applyCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    applyCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Apply collection",
    message: `Do you really want to apply the collection «${collectionLabel}» to this category?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    doApplyCollectionToCategory();
  });
}

async function doApplyCollectionToCategory() {
  const categoryId = selectedCategoryId.value;
  const collectionId = applyCollectionSelectedId.value;
  if (categoryId == null || collectionId == null) return;
  applyCollectionApplying.value = true;
  try {
    await policyAssignmentClient.assignPolicyCollection(
      collectionId,
      "agentCategory",
      { categoryId },
    );
    notifySuccess(
      `Collection applied to category "${selectedCategory.value?.name ?? categoryId}"`,
    );
    showApplyCollectionDialog.value = false;
    await loadCategoryAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to apply collection",
    );
  } finally {
    applyCollectionApplying.value = false;
  }
}

function prepareRemoveCollectionOptionsForCategory() {
  removeCollectionSelectedId.value = null;
  removeCollectionOptionsLoading.value = false;
  removeCollectionOptions.value = (categoryAppliedCollections.value ?? []).map(
    (c) => ({
      id: c.id,
      label: c.name || String(c.id),
    }),
  );
}

function confirmRemoveCollectionFromCategory() {
  const collectionId = removeCollectionSelectedId.value;
  if (collectionId == null) return;
  const collectionLabel =
    removeCollectionOptions.value.find((o) => o.id === collectionId)?.label ??
    String(collectionId);
  $q.dialog({
    title: "Remove collection",
    message: `Do you really want to remove the collection «${collectionLabel}» from this category?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(() => {
    doRemoveCollectionFromCategory();
  });
}

async function doRemoveCollectionFromCategory() {
  const categoryId = selectedCategoryId.value;
  const collectionId = removeCollectionSelectedId.value;
  const categoryLabel = selectedCategory.value?.name ?? categoryId;
  if (categoryId == null || collectionId == null) return;
  removeCollectionRemoving.value = true;
  try {
    await policyAssignmentClient.removePolicyCollection(
      collectionId,
      "agentCategory",
      { categoryId },
    );
    notifySuccess(`Collection removed from category "${categoryLabel}"`);
    showRemoveCollectionDialog.value = false;
    await loadCategoryAppliedCollections();
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to remove collection",
    );
  } finally {
    removeCollectionRemoving.value = false;
  }
}

async function loadCategoryAppliedCollections() {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) {
    categoryAppliedCollections.value = [];
    return;
  }
  categoryAppliedCollectionsLoading.value = true;
  categoryAppliedCollections.value = [];
  try {
    const response =
      await collectionsClient.getAppliedCollectionsByAgentCategory(
        categoryId,
        "en-US",
      );
    type CollectionItem = {
      id?: number;
      name?: string;
      explainText?: string;
      explain_text?: string;
      policiesList?: Array<{
        id?: number;
        name?: string;
        displayName?: string;
        display_name?: string;
      }>;
      policies?: Array<{
        id?: number;
        name?: string;
        displayName?: string;
        display_name?: string;
      }>;
    };
    const raw =
      (response as { collectionsList?: CollectionItem[] }).collectionsList ??
      (response as { collections?: CollectionItem[] }).collections;
    const list = Array.isArray(raw) ? raw : [];
    categoryAppliedCollections.value = list.map((c) => {
      const rawPolicies = c.policiesList ?? c.policies ?? [];
      return {
        id: c.id ?? 0,
        name: c.name ?? String(c.id ?? ""),
        explainText:
          (c.explainText ?? c.explain_text ?? "").trim() || undefined,
        policies: rawPolicies.map((p) => ({
          id: p.id ?? 0,
          name: p.displayName ?? p.display_name ?? p.name ?? String(p.id ?? ""),
        })),
      };
    });
  } catch {
    categoryAppliedCollections.value = [];
  } finally {
    categoryAppliedCollectionsLoading.value = false;
  }
}

function selectCategory(nodeId: string | null) {
  if (!nodeId) return;
  const id = Number(nodeId);
  if (Number.isNaN(id)) return;
  const found = allCategoriesFlat.value.find((c) => c.categoryId === id);
  if (!found) return;

  selectedCategoryId.value = found.categoryId;
  selectedCategoryIdKey.value = nodeId;
  selectedCategory.value = {
    name: found.name,
    description: found.description,
  };
  detailTab.value = "agents";
  loadCategoryDetails(found.categoryId);
}

function navigateToCategory(row: CategoryRow) {
  selectedCategoryId.value = row.categoryId;
  selectedCategoryIdKey.value = String(row.categoryId);
  selectedCategory.value = {
    name: row.name,
    description: row.description,
  };
  loadCategoryDetails(row.categoryId);
}

async function loadCategoryDetails(categoryId: number) {
  detailLoading.value = true;
  categoryAgents.value = [];
  categoryChildren.value = [];
  subtreeAgents.value = [];

  try {
    const [agentsRes, childrenRes, subtreeRes] = await Promise.allSettled([
      agentCategoryClient.getCategoryAgents(categoryId),
      agentCategoryClient.getCategoryChildren(categoryId),
      agentCategoryClient.getAgentsInSubtree(categoryId),
    ]);

    if (agentsRes.status === "fulfilled") {
      const r = agentsRes.value;
      if (r.status === 0) {
        categoryAgents.value = r.agentIdsList ?? [];
      }
    }
    if (childrenRes.status === "fulfilled") {
      const r = childrenRes.value;
      if (r.status === 0) {
        const list = r.categoriesList ?? [];
        categoryChildren.value = list.map(
          (c: {
            categoryId: number;
            info?: { name?: string; description?: { value?: string } };
          }) => ({
            categoryId: c.categoryId,
            name: c.info?.name ?? String(c.categoryId),
            description: c.info?.description?.value ?? "",
          }),
        );
      }
    }
    if (subtreeRes.status === "fulfilled") {
      const r = subtreeRes.value;
      if (r.status === 0) {
        subtreeAgents.value = r.agentIdsList ?? [];
      }
    }
  } finally {
    detailLoading.value = false;
    loadCategoryAppliedCollections();
  }
}

function confirmDeleteCategory() {
  if (selectedCategoryId.value == null) return;
  $q.dialog({
    title: "Delete Category",
    message: `Are you sure you want to delete category "${selectedCategory.value?.name ?? selectedCategoryId.value}"?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(doDeleteCategory);
}

async function doDeleteCategory() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  deleteLoading.value = true;
  try {
    const res = await agentCategoryClient.deleteCategory(id);
    if (res.status === 0) {
      notifySuccess("Category deleted");
      selectedCategoryId.value = null;
      selectedCategoryIdKey.value = null;
      selectedCategory.value = null;
      await loadCategories();
    } else {
      notifyError(res.errorMessage ?? "Delete failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Delete failed");
  } finally {
    deleteLoading.value = false;
  }
}

function openCreateCategoryDialog() {
  createCategoryForm.value = {
    name: "",
    description: "",
    parentId: selectedCategoryId.value ?? null,
  };
  showCreateCategory.value = true;
}

async function loadCategoryForEdit() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  editLoading.value = true;
  try {
    const res = await agentCategoryClient.getCategory(id);
    if (res.status === 0 && res.category?.info) {
      const info = res.category.info;
      editCategoryForm.value = {
        name: info.name ?? selectedCategory.value?.name ?? "",
        description:
          info.description?.value ?? selectedCategory.value?.description ?? "",
      };
    }
  } finally {
    editLoading.value = false;
  }
}

function openEditCategoryDialog() {
  if (selectedCategoryId.value != null && selectedCategory.value) {
    editCategoryForm.value = {
      name: selectedCategory.value.name,
      description: selectedCategory.value.description ?? "",
    };
  }
  showEditCategory.value = true;
}

async function doUpdateCategory() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  editLoading.value = true;
  try {
    const res = await agentCategoryClient.updateCategory({
      categoryId: id,
      name: editCategoryForm.value.name.trim(),
      description: editCategoryForm.value.description.trim() || undefined,
    });
    if (res.status === 0) {
      notifySuccess("Category updated");
      showEditCategory.value = false;
      selectedCategory.value = {
        name: editCategoryForm.value.name,
        description: editCategoryForm.value.description || undefined,
      };
      await loadCategories();
      await loadCategoryDetails(id);
    } else {
      notifyError(res.errorMessage ?? "Update failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Update failed");
  } finally {
    editLoading.value = false;
  }
}

function openMoveCategoryDialog() {
  moveCategoryForm.value = {
    parentId: null,
  };
  showMoveCategory.value = true;
}

async function doSetCategoryParent() {
  const id = selectedCategoryId.value;
  if (id == null) return;
  moveLoading.value = true;
  try {
    const res = await agentCategoryClient.setCategoryParent({
      categoryId: id,
      parentId: moveCategoryForm.value.parentId ?? null,
    });
    if (res.status === 0) {
      notifySuccess("Category moved");
      showMoveCategory.value = false;
      await loadCategories();
      selectedCategoryIdKey.value = String(id);
      await loadCategoryDetails(id);
    } else {
      notifyError(res.errorMessage ?? "Move failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Move failed");
  } finally {
    moveLoading.value = false;
  }
}

async function doCreateCategory() {
  createCategoryLoading.value = true;
  try {
    const res = await agentCategoryClient.createCategory({
      name: createCategoryForm.value.name.trim(),
      description: createCategoryForm.value.description.trim() || undefined,
      parentId: createCategoryForm.value.parentId ?? undefined,
    });
    if (res.status === 0) {
      notifySuccess(`Category "${createCategoryForm.value.name}" created`);
      showCreateCategory.value = false;
      await loadCategories();
    } else {
      notifyError(res.errorMessage ?? "Create failed");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Create failed");
  } finally {
    createCategoryLoading.value = false;
  }
}

async function handleAddAgentSelect(ref: TargetRef) {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  showAddAgentPanel.value = false;
  const agentId = getSingleAgentIdFromTarget(ref.target);
  if (!agentId) {
    notifyError("Please select an agent (device) in the tree");
    return;
  }
  try {
    const res = await agentCategoryClient.addAgentToCategory({
      categoryId,
      agentId,
    });
    if (res.status === 0) {
      notifySuccess("Agent added to category");
      await loadCategoryDetails(categoryId);
    } else {
      notifyError(res.errorMessage ?? "Failed to add agent");
    }
  } catch (err) {
    notifyError(
      err instanceof Error ? err.message : "Failed to add agent to category",
    );
  }
}

async function removeAgentFromCategory(agentId: string) {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  try {
    const res = await agentCategoryClient.removeAgentFromCategory({
      categoryId,
      agentId,
    });
    if (res.status === 0) {
      notifySuccess("Agent removed from category");
      await loadCategoryDetails(categoryId);
    } else {
      notifyError(res.errorMessage ?? "Failed to remove agent");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Failed to remove agent");
  }
}

function prepareSetAgentsForm() {
  setAgentsForm.value = {
    agentIdsText: categoryAgents.value.join("\n"),
  };
}

function openSetAgentsDialog() {
  showSetAgents.value = true;
}

async function doSetCategoryAgents() {
  const categoryId = selectedCategoryId.value;
  if (categoryId == null) return;
  const agentIds = setAgentsForm.value.agentIdsText
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  setAgentsLoading.value = true;
  try {
    const res = await agentCategoryClient.setCategoryAgents({
      categoryId,
      agentIds,
    });
    if (res.status === 0) {
      notifySuccess("Agents list updated");
      showSetAgents.value = false;
      await loadCategoryDetails(categoryId);
    } else {
      notifyError(res.errorMessage ?? "Failed to set agents");
    }
  } catch (err) {
    notifyError(err instanceof Error ? err.message : "Failed to set agents");
  } finally {
    setAgentsLoading.value = false;
  }
}
</script>

<style scoped lang="sass">
.groups-machines-layout
  height: 100%
  display: flex
  flex-direction: column

.groups-manager-page
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  overflow: hidden

.groups-manager-body
  flex: 1
  min-height: 0
  display: flex
  overflow: hidden

.groups-left-panel
  height: 100%
  min-height: 0
  width: 380px
  min-width: 280px
  display: flex
  flex-direction: column
  border-right: 1px solid rgba(0, 0, 0, 0.08)
  overflow: hidden

.groups-left-header
  flex-shrink: 0

.groups-tree-scroll
  flex: 1 1 0
  min-height: 0
  overflow: hidden

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

.groups-tree .q-tree__node--selected > .q-tree__node-header
  background: rgba(25, 118, 210, 0.1)
  border-radius: 4px

.groups-tree-item
  padding: 1px 0

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
</style>
