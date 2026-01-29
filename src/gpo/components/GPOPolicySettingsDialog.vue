<template>
  <q-dialog
    v-model="dialogVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="policy-settings-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Setting up Policies</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="agent" class="q-pt-none">
        <div class="text-subtitle2 q-mb-md">Device: {{ agent.hostname }}</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md" style="height: calc(100vh - 200px)">
          <div class="col-3">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-subtitle2 q-mb-md">Categories</div>
                <div v-if="loadingCategories" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="2em" />
                  <div class="q-mt-sm">Loading categories...</div>
                </div>
                <q-tree
                  v-else-if="categories.length > 0"
                  :nodes="categories"
                  node-key="id"
                  v-model:selected="selectedCategoryId"
                  @update:selected="onCategorySelected"
                  default-expand-all
                  class="category-tree"
                >
                  <template v-slot:default-header="prop">
                    <div class="row items-center full-width">
                      <q-icon
                        :name="prop.node.icon || 'folder'"
                        class="q-mr-sm"
                      />
                      <div class="col">
                        <div class="text-weight-medium">
                          {{ prop.node.label }}
                        </div>
                      </div>
                    </div>
                  </template>
                </q-tree>
                <div v-else class="text-center q-pa-lg text-grey-6">
                  <q-icon name="info" size="2em" />
                  <div class="q-mt-sm">Categories not found</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-3">
            <q-card flat bordered class="full-height">
              <q-card-section class="policy-list-section">
                <div class="text-subtitle2 q-mb-md">Policies</div>
                <div v-if="loadingPolicies" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="2em" />
                  <div class="q-mt-sm">Uploading policies...</div>
                </div>
                <q-scroll-area
                  v-else-if="selectedCategoryPolicies.length > 0"
                  class="policy-list-scroll"
                  :style="{ height: 'calc(100vh - 320px)' }"
                >
                  <q-list separator>
                    <q-item
                      v-for="policy in selectedCategoryPolicies"
                      :key="policy.id"
                      clickable
                      v-ripple
                      :active="selectedPolicy?.id === policy.id"
                      @click="selectPolicy(policy)"
                      class="policy-item"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          :model-value="selectedPolicies[policy.id] || false"
                          @update:model-value="togglePolicySelection(policy.id)"
                          @click.stop
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          policy.displayName || policy.name
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div
                    v-if="
                      Object.keys(selectedPolicies).filter(
                        (id) => selectedPolicies[id],
                      ).length > 0
                    "
                    class="q-pa-sm q-mt-sm bg-primary text-white rounded-borders"
                  >
                    <div class="text-caption">
                      Selected:
                      {{
                        Object.keys(selectedPolicies).filter(
                          (id) => selectedPolicies[id],
                        ).length
                      }}
                      policy(ies)
                    </div>
                  </div>
                </q-scroll-area>
                <div
                  v-else-if="selectedCategory"
                  class="text-center q-pa-lg text-grey-6"
                >
                  <q-icon name="info" size="2em" />
                  <div class="q-mt-sm">
                    There are no policies in the category
                  </div>
                </div>
                <div v-else class="text-center q-pa-lg text-grey-6">
                  <q-icon name="info" size="2em" />
                  <div class="q-mt-sm">Select a category</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-6">
            <q-card flat bordered class="full-height">
              <q-card-section
                v-if="selectedPolicy"
                class="policy-settings-section"
              >
                <q-tabs
                  v-model="settingsTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab
                    name="settings"
                    icon="settings"
                    label="Setting up Policies"
                  />
                  <q-tab
                    name="description"
                    icon="description"
                    label="Description"
                  />
                </q-tabs>

                <q-separator class="q-mt-sm" />

                <q-scroll-area
                  class="policy-tab-panels-scroll"
                  :style="{ height: 'calc(100vh - 370px)' }"
                >
                  <q-tab-panels v-model="settingsTab" class="q-mt-md">
                    <q-tab-panel name="settings" class="q-pa-none">
                      <div
                        v-if="loadingPolicyDetails"
                        class="text-center q-pa-lg"
                      >
                        <q-spinner color="primary" size="2em" />
                        <div class="q-mt-sm">Loading the settings...</div>
                      </div>

                      <div
                        v-else-if="policyDetailsElements.length === 0"
                        class="text-center q-pa-lg text-grey-6"
                      >
                        <q-icon name="info" size="2em" />
                        <div class="q-mt-sm">
                          There are no additional settings
                        </div>
                      </div>

                      <div v-else class="policy-settings-form">
                        <q-form>
                          <div
                            v-for="element in policyDetailsElements"
                            :key="element.id"
                            class="q-mb-md"
                          >
                            <div class="policy-element">
                              <div class="text-subtitle2 q-mb-xs">
                                {{ element.display_name || element.element_id }}
                              </div>
                              <div
                                v-if="element.description"
                                class="text-caption text-grey-7 q-mb-sm"
                              >
                                {{ element.description }}
                              </div>

                              <q-toggle
                                v-if="
                                  element.type === 'CHECKBOX' ||
                                  element.type === 'BOOL' ||
                                  element.type === 'boolean' ||
                                  element.type === 'checkBox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'checkbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'check_box' ||
                                  element.presentation_type === 'checkBox'
                                "
                                :model-value="
                                  (policySettingsValues[
                                    element.element_id
                                  ] as boolean) || false
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                color="primary"
                              />

                              <q-input
                                v-else-if="
                                  element.type === 'TEXT' ||
                                  element.type === 'STRING' ||
                                  element.type === 'string' ||
                                  element.type === 'text' ||
                                  element.type === 'multiTextbox' ||
                                  element.type === 'multiTextBox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'textbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'text_box' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'text' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multitextbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multi_textbox' ||
                                  element.presentation_type ===
                                    'multiTextbox' ||
                                  element.presentation_type === 'multiTextBox'
                                "
                                :model-value="
                                  String(
                                    policySettingsValues[element.element_id] ||
                                      '',
                                  )
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                :maxlength="element.max_length"
                                :type="
                                  element.type === 'multiTextbox' ||
                                  element.type === 'multiTextBox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multitextbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multi_textbox' ||
                                  element.presentation_type ===
                                    'multiTextbox' ||
                                  element.presentation_type === 'multiTextBox'
                                    ? 'textarea'
                                    : 'text'
                                "
                                :rows="
                                  element.type === 'multiTextbox' ||
                                  element.type === 'multiTextBox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multitextbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multi_textbox' ||
                                  element.presentation_type ===
                                    'multiTextbox' ||
                                  element.presentation_type === 'multiTextBox'
                                    ? 3
                                    : undefined
                                "
                                :hint="element.required ? 'Required field' : ''"
                                outlined
                                dense
                              />

                              <q-input
                                v-else-if="
                                  element.type === 'NUMERIC' ||
                                  element.type === 'INT' ||
                                  element.type === 'int' ||
                                  element.type === 'number' ||
                                  element.type === 'decimalTextbox' ||
                                  element.type === 'decimalTextBox' ||
                                  element.value_type === 'decimal' ||
                                  element.value_type === 'int' ||
                                  element.value_type === 'integer' ||
                                  element.presentation_type ===
                                    'decimalTextbox' ||
                                  element.presentation_type === 'decimalTextBox'
                                "
                                :model-value="
                                  Number(
                                    policySettingsValues[element.element_id] ||
                                      0,
                                  )
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                type="number"
                                :min="element.min_value"
                                :max="element.max_value"
                                :step="
                                  element.value_type === 'decimal' ||
                                  element.type === 'decimalTextbox' ||
                                  element.type === 'decimalTextBox' ||
                                  element.presentation_type ===
                                    'decimalTextbox' ||
                                  element.presentation_type === 'decimalTextBox'
                                    ? 0.01
                                    : 1
                                "
                                :hint="element.required ? 'Required field' : ''"
                                outlined
                                dense
                              />

                              <q-select
                                v-else-if="
                                  (element.type === 'LIST' ||
                                    element.type === 'list' ||
                                    element.type === 'List' ||
                                    element.type === 'enum' ||
                                    element.type === 'dropdownList' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'dropdownlist' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'dropdown_list' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'dropdown' ||
                                    element.presentation_type ===
                                      'dropdownList') &&
                                  element.items &&
                                  element.items.length > 0
                                "
                                :model-value="
                                  policySettingsValues[element.element_id] ??
                                  null
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                :options="element.items"
                                option-label="display_name"
                                option-value="id"
                                :hint="
                                  (element.required ? 'Required field' : '') +
                                  (element.value_type
                                    ? ` (value type: ${element.value_type})`
                                    : '')
                                "
                                outlined
                                dense
                                emit-value
                                map-options
                              >
                                <template v-slot:option="scope">
                                  <q-item v-bind="scope.itemProps">
                                    <q-item-section>
                                      <q-item-label>{{
                                        scope.opt.display_name ||
                                        scope.opt.name ||
                                        `Value ${scope.opt.id}`
                                      }}</q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </template>
                              </q-select>

                              <MultiTextBox
                                v-else-if="
                                  (element.type === 'list' ||
                                    element.type === 'LIST' ||
                                    element.type === 'List') &&
                                  (element.presentation_type?.toLowerCase() ===
                                    'listbox' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'list_box' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'list' ||
                                    element.presentation_type === 'List') &&
                                  (!element.items || element.items.length === 0)
                                "
                                :model-value="
                                  (policySettingsValues[
                                    element.element_id
                                  ] as string[]) || []
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                :hint="
                                  (element.required ? 'Required field' : '') +
                                  (element.value_type
                                    ? ` (value type: ${element.value_type})`
                                    : '')
                                "
                                :maxlength="element.max_length"
                              />

                              <q-select
                                v-else-if="
                                  element.type === 'List' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multibox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'multi_box' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'listbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'list_box' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'list' ||
                                  element.presentation_type === 'List' ||
                                  (element.type === 'LIST' &&
                                    element.items &&
                                    element.items.length > 0 &&
                                    (element.presentation_type?.toLowerCase() ===
                                      'listbox' ||
                                      element.presentation_type?.toLowerCase() ===
                                        'list'))
                                "
                                :model-value="
                                  (policySettingsValues[
                                    element.element_id
                                  ] as unknown[]) || []
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                :options="element.items || []"
                                option-label="display_name"
                                option-value="id"
                                multiple
                                use-chips
                                use-input
                                hide-dropdown-icon
                                input-debounce="0"
                                new-value-mode="add"
                                :hint="
                                  (element.required ? 'Required field' : '') +
                                  (element.value_type
                                    ? ` (value type: ${element.value_type})`
                                    : '')
                                "
                                outlined
                                dense
                                emit-value
                                map-options
                              >
                                <template v-slot:option="scope">
                                  <q-item v-bind="scope.itemProps">
                                    <q-item-section>
                                      <q-item-label>{{
                                        scope.opt.display_name ||
                                        scope.opt.name ||
                                        `Value ${scope.opt.id}`
                                      }}</q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </template>
                              </q-select>

                              <q-input
                                v-else
                                :model-value="
                                  String(
                                    policySettingsValues[element.element_id] ||
                                      '',
                                  )
                                "
                                @update:model-value="
                                  policySettingsValues[element.element_id] =
                                    $event
                                "
                                :hint="`Тип: ${element.type}${element.required ? ' (required)' : ''}`"
                                outlined
                                dense
                              />
                            </div>
                          </div>
                        </q-form>
                      </div>
                    </q-tab-panel>

                    <q-tab-panel name="description" class="q-pa-none">
                      <div
                        v-if="loadingPolicyDetails"
                        class="text-center q-pa-lg"
                      >
                        <q-spinner color="primary" size="2em" />
                        <div class="q-mt-sm">Uploading the description...</div>
                      </div>

                      <div
                        v-else-if="selectedPolicy"
                        class="policy-description"
                      >
                        <div class="q-pa-md">
                          <div class="text-h6 q-mb-md">
                            {{
                              selectedPolicy.displayName || selectedPolicy.name
                            }}
                          </div>

                          <div
                            v-if="
                              selectedPolicy.description &&
                              selectedPolicy.description.trim()
                            "
                            class="text-body2 text-grey-8 q-mb-md"
                            style="white-space: normal; line-height: 1.6"
                          >
                            {{ selectedPolicy.description }}
                          </div>
                          <div
                            v-else
                            class="text-body2 text-grey-5 q-mb-md text-italic"
                          >
                            The description is missing
                          </div>
                        </div>
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-scroll-area>
              </q-card-section>

              <q-card-section v-else class="text-center q-pa-lg text-grey-6">
                <q-icon name="info" size="3em" />
                <div class="q-mt-md">Select a policy to configure</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <div class="row items-center q-gutter-sm full-width justify-end">
          <template v-if="agent">
            <q-select
              v-model="selectedCollectionId"
              :options="collectionsOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
              label="Collection"
              style="min-width: 200px"
              :loading="loadingCollections"
              clearable
              @update:model-value="onCollectionSelected"
              @popup-show="isSelectOpen = true"
              @popup-hide="isSelectOpen = false"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No collections available
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div
              v-if="selectedCollectionId && collectionPolicies.length > 0"
              class="q-pa-sm bg-grey-2 rounded-borders"
            >
              <div class="text-caption text-weight-medium q-mb-xs">
                In collection ({{ collectionPolicies.length }}):
              </div>
              <div class="text-caption text-grey-7">
                <div
                  v-for="(policy, index) in collectionPolicies.slice(0, 3)"
                  :key="index"
                >
                  • {{ policy }}
                </div>
                <div v-if="collectionPolicies.length > 3" class="q-mt-xs">
                  ... and {{ collectionPolicies.length - 3 }} more
                </div>
              </div>
            </div>

            <q-btn
              flat
              color="positive"
              icon="play_arrow"
              label="Apply Collection"
              :loading="applying"
              :disable="!selectedCollectionId"
              @click="applyCollection"
            />
            <q-btn
              flat
              icon="more_vert"
              round
              dense
              @click.stop="openOverflowMenu"
            />
            <q-popup-proxy
              ref="overflowPopupRef"
              anchor="bottom right"
              self="top right"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-list>
                <q-item clickable @click="showCreateCollectionDialog = true">
                  <q-item-section>New Collection</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :disable="!hasSelectedPolicies || !selectedCollectionId"
                  @click="addPoliciesToCollection"
                >
                  <q-item-section>Add to Collection</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :disable="!selectedCollectionId"
                  @click="deleteSelectedCollection"
                >
                  <q-item-section>Delete Collection</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  :disable="!selectedCollectionId"
                  @click="removeCollectionAssignments"
                >
                  <q-item-section>Disabled Collection</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :disable="!selectedPolicy"
                  @click="removeSelectedPolicy"
                >
                  <q-item-section>Disabled Selected Policy</q-item-section>
                </q-item>
              </q-list>
            </q-popup-proxy>
          </template>

          <q-btn
            flat
            label="Disable"
            color="negative"
            @click="disablePolicy"
            :disable="!selectedPolicy || !isPolicyEnabled"
          />
          <q-btn
            flat
            label="Apply"
            color="positive"
            @click="applyPolicy"
            :disable="!selectedPolicy"
          />
        </div>
      </q-card-actions>

      <q-dialog v-model="showCreateCollectionDialog">
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Create New Collection</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="newCollectionName"
              label="Collection Name"
              outlined
              dense
              :rules="[(val) => !!val || 'Name is required']"
            />
            <q-input
              v-model="newCollectionDescription"
              label="Description (optional)"
              outlined
              dense
              type="textarea"
              rows="3"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="negative"
              v-close-popup
              @click="resetNewCollectionForm"
            />
            <q-btn
              flat
              label="Create"
              color="primary"
              @click="createNewCollection"
              :disable="!newCollectionName"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";

import {
  policyCatalogServiceClient,
  createGrpcMetadata,
  operator_pb,
  policyAssignmentClient,
  collectionsClient,
} from "../api/grpc-client";
import { notifySuccess, notifyError } from "@/utils/notify";

const $q = useQuasar();
import type { GPOPolicy } from "../types/gpo";
import MultiTextBox from "@/components/ui/MultiTextBox.vue";

interface CategoryNode {
  id: string;
  label: string;
  icon?: string;
  categoryName: string;
  children?: CategoryNode[];
}

interface PolicyDetailsElement {
  id: number;
  element_id: string;
  type: string;
  value_name?: string;
  registry_key?: string;
  required?: boolean;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  value_type?: string;
  items?: Array<{
    id: number;
    name: string;
    display_name?: string;
    value_type?: string;
  }>;
  display_name?: string;
  description?: string;
  presentation_type?: string;
}

interface PolicyPresentationElement {
  id: number;
  type: string;
  ref_id: string;
  parent_element_id?: number;
  default_value?: string;
  text?: string;
}

interface Agent {
  id: string;
  hostname: string;
  status: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent?: Agent | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved", policyId: string, settings: Record<string, unknown>): void;
  (e: "applied", policyId: string, settings: Record<string, unknown>): void;
  (e: "disabled", policyId: string): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loadingCategories = ref(false);
const categories = ref<CategoryNode[]>([]);
const selectedCategoryId = ref<string | null>(null);
const selectedCategory = ref<{ id: string; categoryName: string } | null>(null);
const loadingPolicies = ref(false);
const selectedCategoryPolicies = ref<GPOPolicy[]>([]);
const selectedPolicy = ref<GPOPolicy | null>(null);
const loadingPolicyDetails = ref(false);
const policyDetailsElements = ref<PolicyDetailsElement[]>([]);
const policySettingsValues = ref<Record<string, unknown>>({});
const presentationElements = ref<PolicyPresentationElement[]>([]);
const settingsTab = ref("settings");
const policyEnabled = ref<Record<string, boolean>>({});
const policyHashes = ref<Record<string, string>>({});

const selectedPolicies = ref<Record<string, boolean>>({});
const selectedCollectionId = ref<number | null>(null);
const collectionsOptions = ref<Array<{ label: string; value: number }>>([]);
const loadingCollections = ref(false);
const showCreateCollectionDialog = ref(false);
const newCollectionName = ref("");
const newCollectionDescription = ref("");
const collectionPolicies = ref<string[]>([]);
const applying = ref(false);
const isSelectOpen = ref(false);
const overflowPopupRef = ref<{ show?: () => void } | null>(null);

const isPolicyEnabled = computed(() => {
  if (!selectedPolicy.value) return false;
  return policyEnabled.value[selectedPolicy.value.id] ?? false;
});

const hasSelectedPolicies = computed(() =>
  Object.values(selectedPolicies.value).some(Boolean),
);

function togglePolicySelection(policyId: string) {
  selectedPolicies.value[policyId] = !selectedPolicies.value[policyId];
  selectedPolicies.value = { ...selectedPolicies.value };
}

function openOverflowMenu() {
  if (!isSelectOpen.value) {
    overflowPopupRef.value?.show?.();
  }
}

watch(dialogVisible, (newVal) => {
  if (newVal) {
    loadCategories();
    if (props.agent) {
      loadCollections();
    }
  } else {
    selectedCategoryId.value = null;
    selectedCategory.value = null;
    selectedCategoryPolicies.value = [];
    selectedPolicy.value = null;
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
    settingsTab.value = "settings";
    selectedPolicies.value = {};
    selectedCollectionId.value = null;
    newCollectionName.value = "";
    newCollectionDescription.value = "";
    showCreateCollectionDialog.value = false;
    collectionPolicies.value = [];
  }
});

watch(selectedPolicy, (newPolicy) => {
  if (newPolicy) {
    loadPolicyDetails(newPolicy);
    if (newPolicy.enabled !== undefined) {
      policyEnabled.value[newPolicy.id] = newPolicy.enabled;
    }
  } else {
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
  }
});

async function loadCategories() {
  loadingCategories.value = true;
  try {
    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetCategoryTreeRequest();
    request.setLangCode("en-US");

    const response = await policyCatalogServiceClient.getCategoryTree(
      request,
      metadata,
    );

    const responseObj = response.toObject
      ? response.toObject()
      : (response as unknown as { categoriesList?: unknown[] });

    const categoriesList =
      (responseObj as { categoriesList?: unknown[] }).categoriesList || [];

    const convertCategory = (category: unknown): CategoryNode | null => {
      if (!category || typeof category !== "object") return null;

      const cat = category as {
        id?: number;
        categoryName?: string;
        category_name?: string;
        displayName?: string;
        display_name?: string;
        childsList?: unknown[];
        childs?: unknown[];
      };

      const categoryName = cat.categoryName || cat.category_name || "";
      const displayName = cat.displayName || cat.display_name || categoryName;
      const id = `category-${cat.id || ""}`;
      const childsList = cat.childsList || cat.childs || [];

      const node: CategoryNode = {
        id: id,
        label: displayName,
        icon: "folder",
        categoryName: categoryName,
        children: [],
      };

      if (Array.isArray(childsList) && childsList.length > 0) {
        node.children = childsList
          .map((child) => convertCategory(child))
          .filter((n): n is CategoryNode => n !== null);
      }

      return node;
    };

    const convertedCategories = categoriesList
      .map((cat) => convertCategory(cat))
      .filter((n): n is CategoryNode => n !== null);

    categories.value = convertedCategories;
  } catch (error) {
    notifyError("Category loading error");
  } finally {
    loadingCategories.value = false;
  }
}

async function onCategorySelected(categoryId: string | null) {
  if (!categoryId) {
    selectedCategory.value = null;
    selectedCategoryPolicies.value = [];
    selectedPolicy.value = null;
    return;
  }

  const findCategory = (
    nodes: CategoryNode[],
    id: string,
  ): CategoryNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findCategory(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const category = findCategory(categories.value, categoryId);
  if (!category) return;

  selectedCategory.value = {
    id: category.id,
    categoryName: category.categoryName,
  };

  await loadPoliciesByCategory(category.categoryName);
}

async function loadPoliciesByCategory(categoryName: string) {
  loadingPolicies.value = true;
  selectedCategoryPolicies.value = [];
  selectedPolicy.value = null;

  try {
    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPoliciesByCategoryRequest();
    request.setLangCode("en-US");
    request.setCategory(categoryName);

    const response = await policyCatalogServiceClient.getPoliciesByCategory(
      request,
      metadata,
    );

    const responseObj = response.toObject
      ? response.toObject()
      : (response as unknown as { policiesList?: unknown[] });

    const policiesList =
      (responseObj as { policiesList?: unknown[] }).policiesList || [];

    const policies: GPOPolicy[] = [];
    for (const policy of policiesList) {
      if (policy && typeof policy === "object") {
        const p = policy as {
          id?: number;
          name?: string;
          display_name?: string;
          displayName?: string;
          explain_text?: string;
          explainText?: string;
        };

        const explainText = p.explain_text || p.explainText;

        const isLocalizationKey =
          explainText &&
          (explainText.endsWith("_Help") ||
            explainText.endsWith("_Explain") ||
            explainText.includes("_Help_") ||
            explainText.includes("_Explain_"));

        const description =
          explainText && explainText.trim() && !isLocalizationKey
            ? explainText.trim()
            : undefined;

        policies.push({
          id: String(p.id || ""),
          name: p.name || "",
          displayName: p.display_name || p.displayName || p.name || "",
          path: `CN={${p.id}},CN=Policies,CN=System`,
          enabled: true,
          description: description,
        });
      }
    }

    selectedCategoryPolicies.value = policies;
  } catch (error) {
    notifyError("Error when uploading policies");
  } finally {
    loadingPolicies.value = false;
  }
}

function selectPolicy(policy: GPOPolicy) {
  selectedPolicy.value = policy;
}

async function loadPolicyDetails(policy: GPOPolicy) {
  loadingPolicyDetails.value = true;
  policyDetailsElements.value = [];
  policySettingsValues.value = {};
  presentationElements.value = [];

  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      throw new TypeError(`Invalid Policy ID: ${policy.id}`);
    }

    if (policyId <= 0) {
      throw new Error(
        `Invalid Policy ID: ${policyId}. ID must be a positive number.`,
      );
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("en-US");

    let response;
    let responseObj: Record<string, unknown> | null = null;

    try {
      response = await policyCatalogServiceClient.getPolicyDetails(
        request,
        metadata,
      );
    } catch (grpcError) {
      throw grpcError;
    }

    if (!responseObj) {
      if (!response) {
        throw new Error("An empty response from the server");
      }

      try {
        if (typeof response.toObject === "function") {
          responseObj = response.toObject() as Record<string, unknown>;
        } else {
          responseObj = {};
        }
      } catch {
        responseObj = {};
      }
    }

    if (!responseObj) {
      throw new Error("Response data could not be received");
    }

    try {
      const policyData = response.getPolicy?.();
      if (policyData) {
        let policyHash = "";
        try {
          policyHash = policyData.getHash?.() || "";
        } catch (_) {}

        if (policyHash && policy.id) {
          policyHashes.value[policy.id] = policyHash;
        }

        responseObj.policy = {
          id: (() => {
            try {
              return policyData.getId?.() || 0;
            } catch {
              return 0;
            }
          })(),
          name: (() => {
            try {
              return policyData.getName?.() || "";
            } catch {
              return "";
            }
          })(),
          hash: policyHash,
          scope: (() => {
            try {
              return policyData.getScope?.() || "";
            } catch {
              return "";
            }
          })(),
          parent_category_ref: (() => {
            try {
              return policyData.getParentCategoryRef?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          supported_on_ref: (() => {
            try {
              return policyData.getSupportedOnRef?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
        };
      }
    } catch (_) {}

    try {
      const presentation = response.getPresentation?.();
      if (presentation) {
        const elementsList = (() => {
          try {
            return presentation.getElementsList?.() || [];
          } catch {
            return [];
          }
        })();

        const elements = elementsList
          .map((el: unknown) => {
            if (el && typeof el === "object") {
              try {
                const elem = el as {
                  getId?: () => number;
                  getType?: () => string;
                  getRefId?: () => string;
                  getParentElementId?: () => number | unknown;
                  getDefaultValue?: () => unknown;
                  getText?: () => unknown;
                };

                const extractValue = (
                  value: unknown,
                ): string | number | undefined => {
                  if (value === null || value === undefined) {
                    return undefined;
                  }
                  if (typeof value === "string" || typeof value === "number") {
                    return value;
                  }
                  if (typeof value === "object") {
                    if (
                      typeof (value as { getValue?: () => unknown })
                        .getValue === "function"
                    ) {
                      const extracted = (
                        value as { getValue: () => unknown }
                      ).getValue();
                      return extracted as string | number | undefined;
                    }

                    if (
                      "value" in value &&
                      typeof (value as { value: unknown }).value !== "undefined"
                    ) {
                      return (value as { value: string | number }).value;
                    }
                  }
                  return undefined;
                };

                return {
                  id: (() => {
                    try {
                      return elem.getId?.() || 0;
                    } catch {
                      return 0;
                    }
                  })(),
                  type: (() => {
                    try {
                      return elem.getType?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  ref_id: (() => {
                    try {
                      return elem.getRefId?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  parent_element_id: (() => {
                    try {
                      const value = elem.getParentElementId?.();
                      return extractValue(value) as number | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  default_value: (() => {
                    try {
                      const value = elem.getDefaultValue?.();
                      return extractValue(value) as string | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  text: (() => {
                    try {
                      const value = elem.getText?.();
                      return extractValue(value) as string | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                };
              } catch {
                return null;
              }
            }
            return null;
          })
          .filter((el): el is NonNullable<typeof el> => el !== null);

        responseObj.presentation = {
          id: (() => {
            try {
              return presentation.getId?.() || 0;
            } catch {
              return 0;
            }
          })(),
          presentation_id: (() => {
            try {
              return presentation.getPresentationId?.() || "";
            } catch {
              return "";
            }
          })(),
          adml_file: (() => {
            try {
              return presentation.getAdmlFile?.() || "";
            } catch {
              return "";
            }
          })(),
          elements: elements,
        };
      }
    } catch (_) {}

    const policyElementsList = (() => {
      try {
        return response.getPolicyElementsList?.() || [];
      } catch {
        return [];
      }
    })();

    responseObj.policy_elements = policyElementsList.map((el: unknown) => {
      if (el && typeof el === "object") {
        const elem = el as {
          getId?: () => number;
          getElementId?: () => string;
          getType?: () => string;
          getValueName?: () => unknown;
          getRegistryKey?: () => unknown;
          getRequired?: () => unknown;
          getMaxLength?: () => unknown;
          getMinValue?: () => unknown;
          getMaxValue?: () => unknown;
          getItemsList?: () => unknown[];
        };

        const extractWrapperValue = (
          value: unknown,
        ): string | number | boolean | undefined => {
          if (value === null || value === undefined) {
            return undefined;
          }
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            return value;
          }
          if (typeof value === "object") {
            if (
              typeof (value as { getValue?: () => unknown }).getValue ===
              "function"
            ) {
              const extracted = (
                value as { getValue: () => unknown }
              ).getValue();
              return extracted as string | number | boolean | undefined;
            }
            if (
              "value" in value &&
              typeof (value as { value: unknown }).value !== "undefined"
            ) {
              return (value as { value: string | number | boolean }).value;
            }
          }
          return undefined;
        };

        const itemsList = (() => {
          try {
            return elem.getItemsList?.() || [];
          } catch {
            return [];
          }
        })();

        const items = itemsList
          .map((item: unknown) => {
            if (item && typeof item === "object") {
              try {
                const it = item as {
                  getId?: () => number;
                  getName?: () => string;
                  getParentType?: () => string;
                  getType?: () => string;
                  getValueType?: () => string;
                  getValueName?: () => string;
                  getRequired?: () => boolean;
                  getParentId?: () => number;
                  getDisplayName?: () => string;
                };
                return {
                  id: (() => {
                    try {
                      return it.getId?.() || 0;
                    } catch {
                      return 0;
                    }
                  })(),
                  name: (() => {
                    try {
                      return it.getName?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  parent_type: (() => {
                    try {
                      return it.getParentType?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  type: (() => {
                    try {
                      return it.getType?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  value_type: (() => {
                    try {
                      return it.getValueType?.() || "";
                    } catch {
                      return "";
                    }
                  })(),
                  value_name: (() => {
                    try {
                      const value = it.getValueName?.();
                      return extractWrapperValue(value) as string | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  required: (() => {
                    try {
                      const value = it.getRequired?.();
                      return extractWrapperValue(value) as boolean | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  parent_id: (() => {
                    try {
                      const value = it.getParentId?.();
                      return extractWrapperValue(value) as number | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  display_name: (() => {
                    try {
                      const value = it.getDisplayName?.();
                      return extractWrapperValue(value) as string | undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                };
              } catch {
                return null;
              }
            }
            return null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        return {
          id: (() => {
            try {
              return elem.getId?.() || 0;
            } catch {
              return 0;
            }
          })(),
          element_id: (() => {
            try {
              return elem.getElementId?.() || "";
            } catch {
              return "";
            }
          })(),
          type: (() => {
            try {
              return elem.getType?.() || "";
            } catch {
              return "";
            }
          })(),
          value_name: (() => {
            try {
              const value = elem.getValueName?.();
              return extractWrapperValue(value) as string | undefined;
            } catch {
              return undefined;
            }
          })(),
          registry_key: (() => {
            try {
              const value = elem.getRegistryKey?.();
              return extractWrapperValue(value) as string | undefined;
            } catch {
              return undefined;
            }
          })(),
          required: (() => {
            try {
              const value = elem.getRequired?.();
              return extractWrapperValue(value) as boolean | undefined;
            } catch {
              return undefined;
            }
          })(),
          max_length: (() => {
            try {
              const value = elem.getMaxLength?.();
              return extractWrapperValue(value) as number | undefined;
            } catch {
              return undefined;
            }
          })(),
          min_value: (() => {
            try {
              const value = elem.getMinValue?.();
              return extractWrapperValue(value) as number | undefined;
            } catch {
              return undefined;
            }
          })(),
          max_value: (() => {
            try {
              const value = elem.getMaxValue?.();
              return extractWrapperValue(value) as number | undefined;
            } catch {
              return undefined;
            }
          })(),
          items: items,
        };
      }
      return el;
    });

    const policyElements =
      (responseObj as { policyElementsList?: unknown[] }).policyElementsList ||
      (responseObj as { policy_elements?: unknown[] }).policy_elements ||
      [];

    const presentationData = (
      responseObj as { presentation?: Record<string, unknown> }
    ).presentation;

    const presentationElementsList =
      presentationData && typeof presentationData === "object"
        ? (presentationData as { elementsList?: unknown[] }).elementsList ||
          (presentationData as { elements?: unknown[] }).elements ||
          []
        : [];

    const presentationMap = new Map<string, PolicyPresentationElement>();
    if (Array.isArray(presentationElementsList)) {
      for (const presEl of presentationElementsList) {
        if (presEl && typeof presEl === "object") {
          const p = presEl as {
            id?: number;
            type?: string;
            refId?: string;
            ref_id?: string;
            parentElementId?: number;
            parent_element_id?: number;
            defaultValue?: string | { value?: string } | unknown;
            default_value?: string | { value?: string } | unknown;
            text?: string | { value?: string } | unknown;
          };

          const extractStringValue = (value: unknown): string | undefined => {
            if (value === null || value === undefined) {
              return undefined;
            }
            if (typeof value === "string") {
              return value;
            }
            if (typeof value === "object") {
              if (
                "value" in value &&
                typeof (value as { value: unknown }).value === "string"
              ) {
                return (value as { value: string }).value;
              }
              if (
                "array" in value &&
                Array.isArray((value as { array?: unknown[] }).array)
              ) {
                const arr = (value as { array: unknown[] }).array;
                if (arr.length > 0 && typeof arr[0] === "string") {
                  return arr[0];
                }
              }
              if (
                typeof (value as { getValue?: () => unknown }).getValue ===
                "function"
              ) {
                const extracted = (
                  value as { getValue: () => unknown }
                ).getValue();
                return typeof extracted === "string" ? extracted : undefined;
              }
            }
            return undefined;
          };

          const refId = p.refId || p.ref_id || "";
          if (refId) {
            presentationMap.set(refId, {
              id: p.id || 0,
              type: p.type || "",
              ref_id: refId,
              parent_element_id: p.parentElementId || p.parent_element_id,
              default_value: extractStringValue(
                p.defaultValue || p.default_value,
              ),
              text: extractStringValue(p.text),
            });
          }
        }
      }
    }

    presentationElements.value = Array.from(presentationMap.values());

    const policyInfo = (responseObj as { policy?: Record<string, unknown> })
      .policy;
    if (policyInfo && typeof policyInfo === "object") {
      const policyData = policyInfo as {
        explain_text?: string;
        explainText?: string;
        description?: string;
        display_name?: string;
        displayName?: string;
      };
      const explainText =
        policyData.explain_text ||
        policyData.explainText ||
        policyData.description;
      if (explainText && explainText.trim()) {
        const isLocalizationKey =
          explainText.endsWith("_Help") ||
          explainText.endsWith("_Explain") ||
          explainText.includes("_Help_") ||
          explainText.includes("_Explain_");
        if (!isLocalizationKey && selectedPolicy.value) {
          selectedPolicy.value.description = explainText.trim();
        }
      }
    }

    if (!presentationData) {
      policyDetailsElements.value = [];
      return;
    }

    const elements: PolicyDetailsElement[] = [];
    if (Array.isArray(policyElements)) {
      for (const element of policyElements) {
        if (element && typeof element === "object") {
          try {
            const el = element as {
              id?: number;
              elementId?: string;
              element_id?: string;
              type?: string;
              valueName?: string;
              value_name?: string;
              valueType?: string;
              value_type?: string;
              registryKey?: string;
              registry_key?: string;
              required?: boolean;
              maxLength?: number;
              max_length?: number;
              minValue?: number;
              min_value?: number;
              maxValue?: number;
              max_value?: number;
              itemsList?: unknown[];
              items?: unknown[];
            };

            const elementId = el.elementId || el.element_id || "";

            const presentationEl = presentationMap.get(elementId);

            if (!presentationEl) {
              continue;
            }

            const displayName = presentationEl.text || elementId;
            const presentationType = presentationEl.type || "";

            const normalizedPresentationType = presentationType.toLowerCase();
            const isDropdownList =
              normalizedPresentationType === "dropdownlist" ||
              normalizedPresentationType === "dropdown_list" ||
              normalizedPresentationType === "dropdown";

            const items = el.itemsList || el.items || [];
            const elementValueType = el.valueType || el.value_type || "";

            const extractWrapperValueFromObject = (
              value: unknown,
            ): string | number | boolean | undefined => {
              if (value === null || value === undefined) {
                return undefined;
              }
              if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
              ) {
                return value;
              }
              if (typeof value === "object") {
                if (
                  "value" in value &&
                  typeof (value as { value: unknown }).value !== "undefined"
                ) {
                  return (value as { value: string | number | boolean }).value;
                }
                if (
                  typeof (value as { getValue?: () => unknown }).getValue ===
                  "function"
                ) {
                  const extracted = (
                    value as { getValue: () => unknown }
                  ).getValue();
                  return extracted as string | number | boolean | undefined;
                }
              }
              return undefined;
            };

            let finalType = el.type || "";

            if (presentationType) {
              if (isDropdownList) {
                finalType = "enum";
              } else if (
                normalizedPresentationType === "textBox" ||
                normalizedPresentationType === "text_box"
              ) {
                finalType = "TEXT";
              } else if (
                normalizedPresentationType === "checkBox" ||
                normalizedPresentationType === "check_box"
              ) {
                finalType = "CHECKBOX";
              } else if (
                normalizedPresentationType === "decimalTextBox" ||
                normalizedPresentationType === "decimal_textbox"
              ) {
                finalType = "NUMERIC";
              } else if (
                normalizedPresentationType === "listbox" ||
                normalizedPresentationType === "list_box" ||
                normalizedPresentationType === "list"
              ) {
                finalType = "LIST";
              } else if (
                normalizedPresentationType === "multitextbox" ||
                normalizedPresentationType === "multi_textbox" ||
                normalizedPresentationType === "multitext"
              ) {
                finalType = "multiTextBox";
              }
            } else if (isDropdownList && finalType !== "enum") {
              finalType = "enum";
            }

            const extractDisplayName = (displayName: unknown): string => {
              if (displayName === null || displayName === undefined) {
                return "";
              }
              if (typeof displayName === "string") {
                return displayName;
              }
              if (typeof displayName === "object") {
                if (
                  "value" in displayName &&
                  typeof (displayName as { value: unknown }).value === "string"
                ) {
                  return (displayName as { value: string }).value;
                }
                if (
                  "array" in displayName &&
                  Array.isArray((displayName as { array?: unknown[] }).array)
                ) {
                  const arr = (displayName as { array: unknown[] }).array;
                  if (arr.length > 0 && typeof arr[0] === "string") {
                    return arr[0];
                  }
                }
                if (
                  typeof (displayName as { getValue?: () => unknown })
                    .getValue === "function"
                ) {
                  const extracted = (
                    displayName as { getValue: () => unknown }
                  ).getValue();
                  return typeof extracted === "string" ? extracted : "";
                }
              }
              return "";
            };

            const processedItems = Array.isArray(items)
              ? items
                  .filter(
                    (item): item is Record<string, unknown> =>
                      item !== null && typeof item === "object",
                  )
                  .map((item) => {
                    const itemId = (item.id as number) || 0;
                    let itemName = (item.name as string) || "";

                    if (!itemName && itemId) {
                      itemName = String(itemId);
                    }

                    const itemDisplayNameRaw =
                      item.displayName || item.display_name;
                    const itemDisplayName =
                      extractDisplayName(itemDisplayNameRaw);

                    const itemValueType =
                      (item.valueType as string) ||
                      (item.value_type as string) ||
                      elementValueType ||
                      "";

                    const finalDisplayName =
                      itemDisplayName ||
                      itemName ||
                      (itemValueType
                        ? `Value ${itemId} (${itemValueType})`
                        : `Value ${itemId}`);

                    return {
                      id: itemId,
                      name: itemName,
                      display_name: finalDisplayName,
                      value_type: itemValueType,
                    };
                  })
                  .filter((item, index, self) => {
                    return (
                      index ===
                      self.findIndex(
                        (t) => t.display_name === item.display_name,
                      )
                    );
                  })
              : [];

            elements.push({
              id: el.id || 0,
              element_id: elementId,
              type: finalType,
              value_name: (() => {
                const value = el.valueName || el.value_name;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "string" ? extracted : undefined;
              })(),
              value_type: elementValueType,
              registry_key: (() => {
                const value = el.registryKey || el.registry_key;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "string" ? extracted : undefined;
              })(),
              required: (() => {
                const value = el.required;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "boolean" ? extracted : undefined;
              })(),
              max_length: (() => {
                const value = el.maxLength || el.max_length;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "number" ? extracted : undefined;
              })(),
              min_value: (() => {
                const value = el.minValue || el.min_value;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "number" ? extracted : undefined;
              })(),
              max_value: (() => {
                const value = el.maxValue || el.max_value;
                const extracted = extractWrapperValueFromObject(value);
                return typeof extracted === "number" ? extracted : undefined;
              })(),
              display_name: displayName,
              presentation_type: presentationType,
              items: processedItems,
            });
          } catch (_) {}
        }
      }
    }

    policyDetailsElements.value = elements;

    for (const element of elements) {
      if (!(element.element_id in policySettingsValues.value)) {
        policySettingsValues.value[element.element_id] =
          getDefaultValue(element);
      }
    }
  } catch (error) {
    let errorMessage = "Error loading policy settings";
    const errorStr = String(error);
    const errorMessageStr = error instanceof Error ? error.message : errorStr;

    if (
      errorMessageStr.includes("Cannot read properties of undefined") ||
      errorMessageStr.includes("protobuf") ||
      errorMessageStr.includes("deserializing") ||
      errorMessageStr.includes("Error when deserializing")
    ) {
      errorMessage =
        `Error deserializing the server response for the policy "${policy.displayName || policy.name}" (ID: ${policy.id}). ` +
        "The problem is related to the client_extension field (OneOf->stringValue), which cannot be processed correctly. " +
        "This is a known problem with some policies. Try to choose a different policy or contact your administrator to update protobuf definitions.";
    } else if (
      errorMessageStr.includes("Exception was thrown by handler") ||
      errorMessageStr.includes("RpcError")
    ) {
      errorMessage = "The policy does not exist";
    } else if (error instanceof Error) {
      if (error.message.includes("Deserialization error")) {
        errorMessage = error.message;
      } else {
        errorMessage = "The policy does not exist";
      }
    }

    notifyError(errorMessage);
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
  } finally {
    loadingPolicyDetails.value = false;
  }
}

function getDefaultValue(element: PolicyDetailsElement): unknown {
  switch (element.type) {
    case "CHECKBOX":
    case "BOOL":
      return false;
    case "TEXT":
    case "STRING":
      return "";
    case "NUMERIC":
    case "INT":
      return element.min_value || 0;
    case "LIST":
      return [];
    default:
      return null;
  }
}

function processPolicySettings(
  settings: Record<string, unknown>,
  elements: PolicyDetailsElement[],
): Record<string, unknown> {
  const processed: Record<string, unknown> = { ...settings };

  for (const element of elements) {
    const elementId = element.element_id;
    const value = settings[elementId];

    // Обработка для MultiTextBox (list с пустым items) - массив строк
    if (
      (!element.items || element.items.length === 0) &&
      (element.type === "list" ||
        element.type === "LIST" ||
        element.type === "List") &&
      Array.isArray(value) &&
      value.every((v) => typeof v === "string")
    ) {
      // Для list с пустым items просто передаем массив строк как есть
      processed[elementId] = value;
      continue;
    }

    if (element.items && element.items.length > 0 && value !== undefined) {
      if (typeof value === "number" || typeof value === "string") {
        const itemId =
          typeof value === "string" ? Number.parseInt(value, 10) : value;
        type ItemType = { id: number; name?: string; value_type?: string };
        const itemsArray = element.items as ItemType[];
        const foundItem = itemsArray.find((it) => it.id === itemId);
        if (foundItem) {
          const itemKey = foundItem.name || String(foundItem.id);

          let itemValue: string;
          if (
            foundItem.value_type === "decimal" ||
            foundItem.value_type === "int"
          ) {
            itemValue = String(itemId);
          } else {
            itemValue = "1";
          }

          if (itemKey) {
            processed[elementId] = { [itemKey]: itemValue };
          }
        }
      } else if (Array.isArray(value)) {
        const itemsObject: Record<string, string> = {};
        type ItemType = { id: number; name?: string; value_type?: string };
        const itemsArray = element.items as ItemType[];
        for (const itemId of value) {
          const foundItem = itemsArray.find((it) => it.id === itemId);
          if (foundItem) {
            const itemKey = foundItem.name || String(foundItem.id);

            let itemValue: string;
            if (
              foundItem.value_type === "decimal" ||
              foundItem.value_type === "int"
            ) {
              itemValue = String(itemId);
            } else {
              itemValue = "1";
            }

            if (itemKey) {
              itemsObject[itemKey] = itemValue;
            }
          }
        }
        if (Object.keys(itemsObject).length > 0) {
          processed[elementId] = itemsObject;
        }
      }
    }
  }

  return processed;
}

async function applyPolicy() {
  if (!selectedPolicy.value) return;

  if (!props.agent) {
    policyEnabled.value[selectedPolicy.value.id] = true;
    emit("applied", selectedPolicy.value.id, policySettingsValues.value);
    notifySuccess("Policy applied");
    return;
  }

  try {
    let policyHash = policyHashes.value[selectedPolicy.value.id];

    if (!policyHash) {
      const policyId = Number.parseInt(selectedPolicy.value.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Invalid Policy ID: ${selectedPolicy.value.id}`);
      }

      const metadata = createGrpcMetadata();
      const request = new operator_pb.GetPolicyDetailsRequest();
      request.setPolicyId(policyId);
      request.setLangCode("en-US");

      const response = await policyCatalogServiceClient.getPolicyDetails(
        request,
        metadata,
      );

      const policyData = response.getPolicy?.();
      if (policyData) {
        policyHash = policyData.getHash?.() || "";

        if (policyHash) {
          policyHashes.value[selectedPolicy.value.id] = policyHash;
        }
      }

      if (!policyHash) {
        throw new Error(
          "The hash of the policy was not found. Couldn't get policy details.",
        );
      }
    }

    const processedSettings = processPolicySettings(
      policySettingsValues.value,
      policyDetailsElements.value,
    );

    await policyAssignmentClient.assignPolicy(
      policyHash,
      "agent",
      { agentId: String(props.agent.id) },
      processedSettings,
    );

    policyEnabled.value[selectedPolicy.value.id] = true;
    emit("applied", selectedPolicy.value.id, policySettingsValues.value);
    notifySuccess("Policy has been successfully applied");
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown policy application error";
    notifyError(`Policy application error: ${errorMessage}`);
  }
}

async function disablePolicy() {
  if (!selectedPolicy.value) return;

  if (!props.agent) {
    policyEnabled.value[selectedPolicy.value.id] = false;
    emit("disabled", selectedPolicy.value.id);
    notifySuccess("Policy is disabled");
    return;
  }

  try {
    let policyHash = policyHashes.value[selectedPolicy.value.id];

    if (!policyHash) {
      const policyId = Number.parseInt(selectedPolicy.value.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Invalid Policy ID: ${selectedPolicy.value.id}`);
      }

      const metadata = createGrpcMetadata();
      const request = new operator_pb.GetPolicyDetailsRequest();
      request.setPolicyId(policyId);
      request.setLangCode("en-US");

      const response = await policyCatalogServiceClient.getPolicyDetails(
        request,
        metadata,
      );

      const policyData = response.getPolicy?.();
      if (policyData) {
        policyHash = policyData.getHash?.() || "";

        if (policyHash) {
          policyHashes.value[selectedPolicy.value.id] = policyHash;
        }
      }

      if (!policyHash) {
        throw new Error(
          "Hash of the policy was not found. Couldn't get policy details.",
        );
      }
    }

    await policyAssignmentClient.removePolicy(policyHash, "agent", {
      agentId: String(props.agent.id),
    });

    policyEnabled.value[selectedPolicy.value.id] = false;
    emit("disabled", selectedPolicy.value.id);
    notifySuccess("Policy has been successfully disabled");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown policy disabling error";
    notifyError(`Policy Deactivation error: ${errorMessage}`);
  }
}

async function loadCollections() {
  loadingCollections.value = true;
  try {
    const response = await collectionsClient.getAllCollections("en-US");
    const collectionsList =
      (response as { collectionsList?: unknown[]; collections?: unknown[] })
        .collectionsList ||
      (response as { collectionsList?: unknown[]; collections?: unknown[] })
        .collections ||
      [];
    collectionsOptions.value = collectionsList.map((col: unknown) => {
      const c = col as { id?: number; name?: string };
      return {
        label: c.name || `Collection ${c.id || ""}`,
        value: c.id || 0,
      };
    });
  } catch (error) {
    notifyError("Error loading collections");
  } finally {
    loadingCollections.value = false;
  }
}

async function onCollectionSelected(collectionId: number | null) {
  selectedCollectionId.value = collectionId;
  collectionPolicies.value = [];

  if (collectionId) {
    try {
      const response = await collectionsClient.getPoliciesInCollection(
        collectionId,
        "en-US",
      );

      const policiesList =
        (response as { policiesList?: unknown[]; policies?: unknown[] })
          .policiesList ||
        (response as { policiesList?: unknown[]; policies?: unknown[] })
          .policies ||
        [];

      collectionPolicies.value = policiesList.map((p: unknown) => {
        const policy = p as {
          name?: string;
          displayName?: string;
          display_name?: string;
        };
        return (
          policy.displayName ||
          policy.display_name ||
          policy.name ||
          "Unknown policy"
        );
      });
    } catch (error) {
      try {
        const response = await collectionsClient.getCollectionById(
          collectionId,
          "en-US",
        );
        const collection = response.collection;
        if (collection) {
          const policiesList =
            (collection as { policiesList?: unknown[]; policies?: unknown[] })
              .policiesList ||
            (collection as { policiesList?: unknown[]; policies?: unknown[] })
              .policies ||
            [];

          collectionPolicies.value = policiesList.map((p: unknown) => {
            const policy = p as {
              name?: string;
              displayName?: string;
              display_name?: string;
            };
            return (
              policy.displayName ||
              policy.display_name ||
              policy.name ||
              "Unknown policy"
            );
          });
        }
      } catch (fallbackError) {
        // Fallback failed, ignore
      }
    }
  }
}

function resetNewCollectionForm() {
  newCollectionName.value = "";
  newCollectionDescription.value = "";
}

async function createNewCollection() {
  if (!newCollectionName.value.trim()) {
    notifyError("Collection name is required");
    return;
  }

  applying.value = true;
  try {
    const response = await collectionsClient.createCollection(
      newCollectionName.value.trim(),
      newCollectionDescription.value.trim(),
    );

    const collection = response.collection;
    if (collection && collection.id) {
      collectionsOptions.value.push({
        label: collection.name || newCollectionName.value,
        value: collection.id,
      });
      selectedCollectionId.value = collection.id;
      showCreateCollectionDialog.value = false;
      resetNewCollectionForm();
      await onCollectionSelected(collection.id);
      notifySuccess("Collection created successfully");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error creating collection";
    notifyError(`Error creating collection: ${errorMessage}`);
  } finally {
    applying.value = false;
  }
}

async function deleteSelectedCollection() {
  if (!selectedCollectionId.value) {
    return;
  }

  const collectionName =
    collectionsOptions.value.find((c) => c.value === selectedCollectionId.value)
      ?.label || "Collection";

  $q.dialog({
    title: "Confirm the deletion",
    message: `Are you sure you want to delete the collection "${collectionName}"? This action cannot be undone..`,
    cancel: {
      label: "Cancel",
      color: "grey",
      flat: true,
    },
    ok: {
      label: "Delete",
      color: "negative",
      flat: true,
    },
    persistent: true,
  })
    .onOk(async () => {
      applying.value = true;
      try {
        await collectionsClient.deleteCollection(selectedCollectionId.value!);
        collectionsOptions.value = collectionsOptions.value.filter(
          (c) => c.value !== selectedCollectionId.value,
        );
        selectedCollectionId.value = null;
        collectionPolicies.value = [];

        notifySuccess(`Collection "${collectionName}" successfully deleted`);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown error deleting collection";
        notifyError(`Error when deleting a collection: ${errorMessage}`);
      } finally {
        applying.value = false;
      }
    })
    .onCancel(() => {});
}

async function addPoliciesToCollection() {
  if (!selectedCollectionId.value) {
    notifyError("Please select a collection first");
    return;
  }

  const selectedPolicyIds = Object.keys(selectedPolicies.value).filter(
    (id) => selectedPolicies.value[id] === true,
  );

  if (selectedPolicyIds.length === 0) {
    notifyError("Please select at least one policy");
    return;
  }

  applying.value = true;
  try {
    const policyHashesToAdd: string[] = [];
    for (const policyId of selectedPolicyIds) {
      let policyHash = policyHashes.value[policyId];

      if (!policyHash) {
        const policy = selectedCategoryPolicies.value.find(
          (p) => p.id === policyId,
        );
        if (policy) {
          await loadPolicyDetails(policy);
          policyHash = policyHashes.value[policyId];
        }

        if (!policyHash) {
          const policyIdNum = Number.parseInt(policyId, 10);
          if (!Number.isNaN(policyIdNum)) {
            try {
              const policyDetailsResponse =
                await policyCatalogServiceClient.getPolicyDetails(
                  new operator_pb.GetPolicyDetailsRequest()
                    .setPolicyId(policyIdNum)
                    .setLangCode("en-US"),
                  createGrpcMetadata(),
                );
              const policyData = policyDetailsResponse.getPolicy?.();
              if (policyData) {
                policyHash = policyData.getHash?.() || "";
                if (policyHash) {
                  policyHashes.value[policyId] = policyHash;
                }
              }
            } catch (_) {
              // ignore
            }
          }
        }
      }

      if (policyHash && policyHash.length > 0) {
        policyHashesToAdd.push(policyHash);
      }
    }

    if (policyHashesToAdd.length === 0) {
      throw new Error(
        `Could not get policy hashes for ${selectedPolicyIds.length} selected policy(ies). ` +
          "Please make sure policies are loaded and try selecting them again.",
      );
    }

    await collectionsClient.createCollectionsPolicies(
      selectedCollectionId.value,
      policyHashesToAdd,
    );

    await onCollectionSelected(selectedCollectionId.value);

    const policiesCount = policyHashesToAdd.length;
    const policiesText =
      policiesCount === 1
        ? "Policy added to collection"
        : `${policiesCount} policies added to collection`;

    notifySuccess(policiesText);
  } catch (error) {
    let errorMessage = "Unknown error adding policies to collection";
    if (error instanceof Error) {
      errorMessage = error.message;

      if (errorMessage.includes("Exception was thrown by handler")) {
        errorMessage =
          "Server error: The collection or policies may not exist, or there was a problem processing the request. " +
          "Please check that the collection exists and policy hashes are correct.";
      } else if (errorMessage.includes("Invalid collection ID")) {
        errorMessage = "Please select a valid collection";
      } else if (
        errorMessage.includes("No policy names") ||
        errorMessage.includes("No policy hashes")
      ) {
        errorMessage =
          "No valid policy hashes found. Please select policies again.";
      }
    }

    notifyError(`Error adding policies: ${errorMessage}`);
  } finally {
    applying.value = false;
  }
}

async function applyCollection() {
  if (!selectedCollectionId.value || !props.agent) {
    return;
  }

  const collectionName =
    collectionsOptions.value.find((c) => c.value === selectedCollectionId.value)
      ?.label || "Collection";

  $q.dialog({
    title: "Confirm apply collection",
    message: `Apply collection "${collectionName}" to device ${props.agent.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    applying.value = true;
    try {
      await policyAssignmentClient.assignPolicyCollection(
        selectedCollectionId.value,
        "agent",
        { agentId: String(props.agent!.id) },
        {},
      );

      notifySuccess(
        `Collection "${collectionName}" successfully applied to ${props.agent.hostname}`,
      );

      emit("applied", "", {});
      dialogVisible.value = false;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error applying collection";
      notifyError(`Error applying collection: ${errorMessage}`);
    } finally {
      applying.value = false;
    }
  });
}

async function removeCollectionAssignments() {
  if (!selectedCollectionId.value || !props.agent) {
    return;
  }

  const collectionName =
    collectionsOptions.value.find((c) => c.value === selectedCollectionId.value)
      ?.label || "Collection";

  $q.dialog({
    title: "Confirm remove collection",
    message: `Remove collection "${collectionName}" from device ${props.agent.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    applying.value = true;
    try {
      await policyAssignmentClient.removePolicyCollection(
        selectedCollectionId.value,
        "agent",
        { agentId: String(props.agent!.id) },
      );

      notifySuccess(
        `Collection "${collectionName}" successfully removed from ${props.agent.hostname}`,
      );

      emit("applied", "", {});
      dialogVisible.value = false;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error removing collection";
      notifyError(`Error removing collection: ${errorMessage}`);
    } finally {
      applying.value = false;
    }
  });
}

async function removeSelectedPolicy() {
  if (!selectedPolicy.value || !props.agent) {
    return;
  }

  applying.value = true;
  try {
    let policyHash = policyHashes.value[selectedPolicy.value.id];

    if (!policyHash) {
      const policyId = Number.parseInt(selectedPolicy.value.id, 10);
      if (!Number.isNaN(policyId)) {
        const policyDetailsResponse =
          await policyCatalogServiceClient.getPolicyDetails(
            new operator_pb.GetPolicyDetailsRequest()
              .setPolicyId(policyId)
              .setLangCode("en-US"),
            createGrpcMetadata(),
          );

        const policyData = policyDetailsResponse.getPolicy?.();
        if (policyData) {
          policyHash = policyData.getHash?.() || "";
          if (policyHash) {
            policyHashes.value[selectedPolicy.value.id] = policyHash;
          }
        }
      }
    }

    if (!policyHash) {
      throw new Error(
        "Could not get policy hash. Please try selecting the policy again.",
      );
    }

    await policyAssignmentClient.removePolicy(policyHash, "agent", {
      agentId: String(props.agent.id),
    });

    policyEnabled.value[selectedPolicy.value.id] = false;
    const policyName =
      selectedPolicy.value.displayName || selectedPolicy.value.name;
    notifySuccess(
      `Policy "${policyName}" successfully removed from ${props.agent.hostname}`,
    );

    emit("applied", "", {});
    dialogVisible.value = false;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error removing policy";
    notifyError(`Error removing policy: ${errorMessage}`);
  } finally {
    applying.value = false;
  }
}
</script>

<style scoped lang="sass">
.policy-settings-dialog
  min-width: 1200px

.category-tree
  max-height: calc(100vh - 300px)
  overflow-y: auto

.policy-item
  padding: 8px 16px
  border-radius: 4px

.policy-item:hover
  background-color: rgba(0, 0, 0, 0.04)

.policy-list-section
  display: flex
  flex-direction: column
  height: 100%

.policy-list-scroll
  margin-top: 8px

.policy-settings-section
  display: flex
  flex-direction: column
  height: 100%

.policy-tab-panels-scroll
  margin-top: 16px

.policy-settings-form
  padding: 8px 0

.policy-element
  padding: 12px
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px
  margin-bottom: 16px
  background: rgba(0, 0, 0, 0.02)

.policy-element:hover
  background: rgba(0, 0, 0, 0.04)
  border-color: rgba(0, 0, 0, 0.2)
</style>
