<template>
  <q-dialog
    v-model="dialogVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="apply-policy-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Setting up Policies</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div v-if="agent" class="text-subtitle2 q-mb-md">
          Device: {{ agent.hostname }}
        </div>

        <q-tabs
          v-model="dialogTab"
          dense
          inline-label
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
        >
          <q-tab name="settings" icon="settings" label="Settings" />
          <q-tab name="users" icon="people" label="Users" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="dialogTab" class="q-mt-md">
          <q-tab-panel name="settings" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-card flat bordered style="height: calc(100vh - 250px)">
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-md">Categories</div>
                    <q-input
                      v-model="categorySearch"
                      dense
                      outlined
                      clearable
                      placeholder="Search categories..."
                      :input-style="{ paddingLeft: '6px' }"
                      @clear="categorySearch = ''"
                      class="q-mb-sm"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" size="xs" />
                      </template>
                    </q-input>
                    <div v-if="loadingCategories" class="text-center q-pa-lg">
                      <q-spinner color="primary" size="2em" />
                      <div class="q-mt-sm">Loading categories...</div>
                    </div>
                    <q-scroll-area
                      v-else-if="filteredCategories.length > 0"
                      :style="{ height: 'calc(100vh - 330px)' }"
                    >
                      <q-tree
                        :nodes="filteredCategories"
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
                    </q-scroll-area>
                    <div v-else class="text-center q-pa-lg text-grey-6">
                      <q-icon name="info" size="2em" />
                      <div class="q-mt-sm">Categories not found</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-3">
                <q-card flat bordered style="height: calc(100vh - 250px)">
                  <q-card-section class="policy-list-section">
                    <div class="row items-center q-mb-sm">
                      <div class="text-subtitle2 col">Policies</div>
                    </div>

                    <q-btn-toggle
                      v-model="policyViewMode"
                      no-caps
                      dense
                      spread
                      toggle-color="primary"
                      class="q-mb-sm"
                      :options="[
                        { label: 'By Category', value: 'byCategory' },
                        { label: 'All Policies', value: 'allPolicies' },
                      ]"
                    />

                    <template v-if="policyViewMode === 'byCategory'">
                      <div v-if="loadingPolicies" class="text-center q-pa-lg">
                        <q-spinner color="primary" size="2em" />
                        <div class="q-mt-sm">Loading policies...</div>
                      </div>
                      <q-scroll-area
                        v-else-if="filteredSelectedCategoryPolicies.length > 0"
                        class="policy-list-scroll"
                        :style="{ height: 'calc(100vh - 370px)' }"
                      >
                        <q-list separator>
                          <q-item
                            v-for="policy in filteredSelectedCategoryPolicies"
                            :key="policy.id"
                            clickable
                            v-ripple
                            :active="selectedPolicy?.id === policy.id"
                            @click="selectPolicy(policy)"
                            class="policy-item"
                          >
                            <q-item-section>
                              <q-item-label>{{
                                policy.displayName || policy.name
                              }}</q-item-label>
                            </q-item-section>
                            <q-item-section
                              v-if="policyIsSimple[policy.id] !== undefined && policyIsSimple[policy.id] !== false"
                              side
                              @click.stop
                            >
                              <q-spinner
                                v-if="policyIsSimple[policy.id] === null"
                                color="primary"
                                size="1.2em"
                              />
                              <q-toggle
                                v-else
                                :model-value="
                                  policyToggleStates[policy.id] ?? false
                                "
                                color="primary"
                                size="sm"
                                dense
                                @update:model-value="
                                  (val) => (policyToggleStates[policy.id] = val)
                                "
                              />
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-scroll-area>
                      <div
                        v-else-if="selectedCategory"
                        class="text-center q-pa-lg text-grey-6"
                      >
                        <q-icon name="info" size="2em" />
                        <div class="q-mt-sm">No policies in category</div>
                      </div>
                      <div v-else class="text-center q-pa-lg text-grey-6">
                        <q-icon name="info" size="2em" />
                        <div class="q-mt-sm">Select a category</div>
                      </div>
                    </template>

                    <template v-else>
                      <q-input
                        v-model="allPoliciesSearch"
                        dense
                        outlined
                        clearable
                        placeholder="Search policies..."
                        :input-style="{ paddingLeft: '6px' }"
                        class="q-mb-sm"
                        @clear="allPoliciesSearch = ''"
                      >
                        <template v-slot:prepend>
                          <q-icon name="search" size="xs" />
                        </template>
                      </q-input>

                      <div
                        v-if="loadingAllPolicies"
                        class="text-center q-pa-lg"
                      >
                        <q-spinner color="primary" size="2em" />
                        <div class="q-mt-sm">Loading all policies...</div>
                      </div>
                      <q-scroll-area
                        v-else-if="filteredAllPoliciesGrouped.length > 0"
                        class="policy-list-scroll"
                        :style="{ height: 'calc(100vh - 410px)' }"
                      >
                        <q-list separator>
                          <template
                            v-for="group in filteredAllPoliciesGrouped"
                            :key="group.scopeKey"
                          >
                            <q-item-label
                              header
                              class="text-weight-bold text-caption"
                            >
                              {{ group.scopeLabel }}
                              <q-badge
                                :label="group.policies.length"
                                color="grey-5"
                                text-color="white"
                                rounded
                                class="q-ml-xs"
                              />
                            </q-item-label>
                            <q-item
                              v-for="policy in group.policies"
                              :key="policy.id"
                              clickable
                              v-ripple
                              :active="selectedPolicy?.id === policy.id"
                              @click="selectAllPolicy(policy)"
                              class="policy-item"
                            >
                              <q-item-section>
                                <q-item-label>{{
                                  policy.displayName || policy.name
                                }}</q-item-label>
                              </q-item-section>
                              <q-item-section
                                v-if="
                                  policyIsSimple[policy.id] !== undefined &&
                                  policyIsSimple[policy.id] !== false
                                "
                                side
                                @click.stop
                              >
                                <q-spinner
                                  v-if="policyIsSimple[policy.id] === null"
                                  color="primary"
                                  size="1.2em"
                                />
                                <q-toggle
                                  v-else
                                  :model-value="
                                    policyToggleStates[policy.id] ?? false
                                  "
                                  color="primary"
                                  size="sm"
                                  dense
                                  @update:model-value="
                                    (val) => (policyToggleStates[policy.id] = val)
                                  "
                                />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-list>
                      </q-scroll-area>
                      <div
                        v-else-if="allPoliciesLoaded"
                        class="text-center q-pa-lg text-grey-6"
                      >
                        <q-icon name="search_off" size="2em" />
                        <div class="q-mt-sm">No policies found</div>
                      </div>
                    </template>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-6">
                <q-card flat bordered style="height: calc(100vh - 250px)">
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
                        label="Policy Settings"
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
                            <div class="q-mt-sm">Loading settings...</div>
                          </div>

                          <div
                            v-else-if="policyDetailsElements.length === 0"
                            class="text-center q-pa-lg text-grey-6"
                          >
                            <q-icon name="info" size="2em" />
                            <div class="q-mt-sm">No additional settings</div>
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
                                    {{
                                      element.display_name || element.element_id
                                    }}
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
                                      element.presentation_type ===
                                        'multiTextBox'
                                    "
                                    :model-value="
                                      String(
                                        policySettingsValues[
                                          element.element_id
                                        ] || '',
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
                                      element.presentation_type ===
                                        'multiTextBox'
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
                                      element.presentation_type ===
                                        'multiTextBox'
                                        ? 3
                                        : undefined
                                    "
                                    :hint="
                                      element.required ? 'Required field' : ''
                                    "
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
                                      element.presentation_type ===
                                        'decimalTextBox'
                                    "
                                    :model-value="
                                      Number(
                                        policySettingsValues[
                                          element.element_id
                                        ] || 0,
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
                                      element.presentation_type ===
                                        'decimalTextBox'
                                        ? 0.01
                                        : 1
                                    "
                                    :hint="
                                      element.required ? 'Required field' : ''
                                    "
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
                                      policySettingsValues[
                                        element.element_id
                                      ] ?? null
                                    "
                                    @update:model-value="
                                      policySettingsValues[element.element_id] =
                                        $event
                                    "
                                    :options="element.items"
                                    option-label="display_name"
                                    option-value="id"
                                    :hint="
                                      (element.required
                                        ? 'Required field'
                                        : '') +
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
                                      (!element.items ||
                                        element.items.length === 0)
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
                                      (element.required
                                        ? 'Required field'
                                        : '') +
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
                                      (element.required
                                        ? 'Required field'
                                        : '') +
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
                                        policySettingsValues[
                                          element.element_id
                                        ] || '',
                                      )
                                    "
                                    @update:model-value="
                                      policySettingsValues[element.element_id] =
                                        $event
                                    "
                                    :hint="`Type: ${element.type}${element.required ? ' (required)' : ''}`"
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
                            <div class="q-mt-sm">Loading description...</div>
                          </div>

                          <div
                            v-else-if="selectedPolicy"
                            class="policy-description"
                          >
                            <div class="q-pa-md">
                              <div class="text-h6 q-mb-md">
                                {{
                                  selectedPolicy.displayName ||
                                  selectedPolicy.name
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
                                Description not available
                              </div>
                            </div>
                          </div>
                        </q-tab-panel>
                      </q-tab-panels>
                    </q-scroll-area>
                  </q-card-section>

                  <q-card-section
                    v-else
                    class="text-center q-pa-lg text-grey-6"
                  >
                    <q-icon name="info" size="3em" />
                    <div class="q-mt-md">Select a policy to configure</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="users" class="q-pa-none">
            <div class="text-subtitle2 q-mb-md">Select users</div>
            <div class="q-mb-sm">
              <q-btn
                flat
                dense
                size="sm"
                label="Select All"
                @click="selectAllUsers"
                class="q-mr-sm"
              />
              <q-btn
                flat
                dense
                size="sm"
                label="Deselect All"
                @click="deselectAllUsers"
              />
            </div>
            <q-list separator>
              <q-item
                v-for="user in users"
                :key="user.sid"
                clickable
                v-ripple
                :active="selectedUsers.includes(user.sid)"
                @click="toggleUser(user.sid)"
              >
                <q-item-section avatar>
                  <q-checkbox
                    :model-value="selectedUsers.includes(user.sid)"
                    @update:model-value="() => toggleUser(user.sid)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ user.name }}</q-item-label>
                  <q-item-label caption>{{ user.sid }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge
                    :color="user.type === 'Local' ? 'primary' : 'secondary'"
                    :label="user.type"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div
              v-if="selectedUsers.length > 0"
              class="q-mt-md text-body2 text-primary"
            >
              Selected: {{ selectedUsers.length }}
              {{ selectedUsers.length === 1 ? "user" : "users" }}
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <div class="row items-center q-gutter-sm">
          <q-btn
            flat
            icon="check_circle"
            label=""
            color="primary"
            @click="applySelectedPolicy"
            :loading="applying"
            :disable="!selectedPolicy || selectedUsers.length === 0"
          />
          <q-btn
            flat
            icon="remove_circle_outline"
            label=""
            color="negative"
            @click="removePolicy"
            :loading="applying"
            :disable="!selectedPolicy || selectedUsers.length === 0"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  policyCatalogServiceClient,
  policyCatalogClient,
  createGrpcMetadata,
  operator_pb,
  policyAssignmentClient,
} from "../api/grpc-client";
import { PolicySelection } from "@/generated/common/policy_pb";
import { notifySuccess, notifyError } from "@/utils/notify";
import type { GPOPolicy } from "../types/gpo";
import { normalizePoliciesList } from "../api/policy-catalog-adapters";
import type { PolicyItem } from "../types/policy-catalog";
import MultiTextBox from "@/components/ui/MultiTextBox.vue";

interface Agent {
  id: string;
  hostname: string;
  status: string;
}

interface User {
  name: string;
  sid: string;
  type: string;
}

type PolicyRow = GPOPolicy & { scope?: number | string | null | undefined };

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
    value?: string;
  }>;
  display_name?: string;
  description?: string;
  presentation_type?: string;
}

interface PolicyDetail {
  settings: Record<string, unknown>;
  policy: Omit<Partial<GPOPolicy>, "id" | "name"> & {
    id: string | number;
    name: string;
    hash?: string;
    scope?: string;
  };
  hash?: string;
}

interface PolicyPresentationElement {
  id: number;
  type: string;
  ref_id: string;
  parent_element_id?: number;
  default_value?: string;
  text?: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent: Agent | null;
  users: User[];
  initialUserSid?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "applied"): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dialogTab = ref("settings");
const loadingCategories = ref(false);
const categories = ref<CategoryNode[]>([]);
const selectedCategoryId = ref<string | null>(null);
const selectedCategory = ref<{ id: string; categoryName: string } | null>(null);
const loadingPolicies = ref(false);
const selectedCategoryPolicies = ref<PolicyRow[]>([]);
const selectedPolicy = ref<PolicyRow | null>(null);
const loadingPolicyDetails = ref(false);
const policyDetailsElements = ref<PolicyDetailsElement[]>([]);
const policySettingsValues = ref<Record<string, unknown>>({});
const policyDetails = ref<Record<string, PolicyDetail>>({});
const policyDetailsElementsMap = ref<Record<string, PolicyDetailsElement[]>>(
  {},
);
const selectedUsers = ref<string[]>([]);
const applying = ref(false);
const settingsTab = ref("settings");
const presentationElements = ref<PolicyPresentationElement[]>([]);
const categorySearch = ref("");

const policyViewMode = ref<"byCategory" | "allPolicies">("byCategory");
const allPoliciesList = ref<PolicyItem[]>([]);
const allPoliciesSearch = ref("");
const loadingAllPolicies = ref(false);
const allPoliciesLoaded = ref(false);
let allPoliciesSearchDebounce: ReturnType<typeof setTimeout> | null = null;
let allPoliciesSearchRequestId = 0;

const policyToggleStates = ref<Record<string, boolean>>({});
const policyIsSimple = ref<Record<string, boolean | null>>({});

function normalizeScope(raw: unknown): number | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === "number")
    return Number.isFinite(raw) ? Math.floor(raw) : null;
  const s = String(raw).trim().toUpperCase();
  if (!s) return null;
  if (s === "POLICY_SCOPE_USER" || s === "USER" || s === "1") return 1;
  if (
    s === "POLICY_SCOPE_MACHINE" ||
    s === "MACHINE" ||
    s === "COMPUTER" ||
    s === "2"
  )
    return 2;
  if (s === "POLICY_SCOPE_BOTH" || s === "BOTH" || s === "3") return 3;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

const filteredSelectedCategoryPolicies = computed(() => {
  const list = selectedCategoryPolicies.value.filter((p) => {
    const scope = normalizeScope(p.scope);
    return (
      scope === null ||
      scope === operator_pb.PolicyScope.POLICY_SCOPE_USER ||
      scope === operator_pb.PolicyScope.POLICY_SCOPE_BOTH
    );
  });
  return list;
});

function filterCategoryTree(
  nodes: CategoryNode[],
  query: string,
): CategoryNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const walk = (list: CategoryNode[]): CategoryNode[] => {
    const out: CategoryNode[] = [];
    for (const n of list) {
      const label = (n.label || "").toLowerCase();
      const name = (n.categoryName || "").toLowerCase();
      const selfMatch = label.includes(q) || name.includes(q);
      const children = Array.isArray(n.children) ? n.children : [];
      const filteredChildren = walk(children);

      if (selfMatch) {
        out.push({ ...n, children });
        continue;
      }
      if (filteredChildren.length > 0) {
        out.push({ ...n, children: filteredChildren });
      }
    }
    return out;
  };

  return walk(nodes);
}

const filteredCategories = computed(() =>
  filterCategoryTree(categories.value, categorySearch.value),
);

async function loadAllPolicies() {
  const requestId = ++allPoliciesSearchRequestId;
  loadingAllPolicies.value = true;
  try {
    const response = await policyCatalogClient.searchPolicyShort(
      allPoliciesSearch.value.trim(),
      "en-US",
    );
    if (requestId !== allPoliciesSearchRequestId) return;

    const responseObj = response as { policiesList?: unknown[]; policies?: unknown[] };
    const policiesList = responseObj.policiesList || responseObj.policies || [];
    allPoliciesList.value = normalizePoliciesList({ policiesList });
    allPoliciesLoaded.value = true;
  } catch {
    if (requestId !== allPoliciesSearchRequestId) return;
    notifyError("Error loading all policies");
  } finally {
    if (requestId === allPoliciesSearchRequestId) {
      loadingAllPolicies.value = false;
    }
  }
}

const SCOPE_USER = 1;
const SCOPE_MACHINE = 2;
const SCOPE_BOTH = 3;
const SCOPE_NONE = 0;

function scopeLabelText(scope: number): string {
  if (scope === SCOPE_USER) return "User";
  if (scope === SCOPE_MACHINE) return "Computer";
  if (scope === SCOPE_BOTH) return "User & Computer";
  return "Other";
}

const filteredAllPoliciesGrouped = computed(() => {
  const list = allPoliciesList.value.filter((p) => {
    const scope = normalizeScope(p.scope);
    return (
      scope === operator_pb.PolicyScope.POLICY_SCOPE_USER ||
      scope === operator_pb.PolicyScope.POLICY_SCOPE_BOTH
    );
  });
  const byScope: Record<number, PolicyItem[]> = {};
  for (const p of list) {
    const key = p.scope ?? SCOPE_NONE;
    if (!byScope[key]) byScope[key] = [];
    byScope[key].push(p);
  }
  const order = [SCOPE_USER, SCOPE_BOTH];
  const groups: {
    scopeKey: number;
    scopeLabel: string;
    policies: PolicyItem[];
  }[] = [];
  for (const scope of order) {
    const policies = byScope[scope];
    if (policies && policies.length > 0) {
      groups.push({
        scopeKey: scope,
        scopeLabel: scopeLabelText(scope),
        policies,
      });
    }
  }
  return groups;
});

watch(policyViewMode, (mode) => {
  if (mode === "allPolicies") {
    loadAllPolicies();
  }
  selectedPolicy.value = null;
});

watch(allPoliciesSearch, () => {
  if (policyViewMode.value !== "allPolicies") return;
  if (allPoliciesSearchDebounce) clearTimeout(allPoliciesSearchDebounce);
  allPoliciesSearchDebounce = setTimeout(() => {
    loadAllPolicies();
  }, 300);
});

watch(dialogVisible, (newVal) => {
  if (newVal && props.agent) {
    loadCategories();
    if (props.initialUserSid) {
      selectedUsers.value = [props.initialUserSid];
      dialogTab.value = "settings";
    } else {
      dialogTab.value = "users";
    }
  } else {
    policyDetails.value = {};
    policyDetailsElementsMap.value = {};
    selectedUsers.value = [];
    selectedCategoryId.value = null;
    selectedCategory.value = null;
    selectedCategoryPolicies.value = [];
    selectedPolicy.value = null;
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
    settingsTab.value = "settings";
    dialogTab.value = "settings";
    policyViewMode.value = "byCategory";
    allPoliciesList.value = [];
    allPoliciesSearch.value = "";
    allPoliciesLoaded.value = false;
    policyToggleStates.value = {};
    policyIsSimple.value = {};
  }
});

watch(selectedUsers, () => {
  if (selectedCategory.value) {
    loadPoliciesByCategory(selectedCategory.value.categoryName);
  }
});

watch(dialogTab, (newTab) => {
  if (newTab === "settings" && props.agent) {
    if (categories.value.length === 0) {
      loadCategories();
    }
  }
});

async function loadCategories() {
  if (!props.agent) return;

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
    notifyError("Error loading categories");
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

    const policies: PolicyRow[] = [];
    for (const policy of policiesList) {
      if (policy && typeof policy === "object") {
        const p = policy as {
          id?: number;
          name?: string;
          display_name?: string;
          displayName?: string;
          explain_text?: string;
          explainText?: string;
          scope?: number | string;
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

        const policyName = p.name || "";
        policies.push({
          id: String(p.id || ""),
          name: policyName,
          displayName: p.display_name || p.displayName || policyName || "",
          path: `CN={${p.id}},CN=Policies,CN=System`,
          enabled: true,
          description: description,
          scope: p.scope,
        });
      }
    }

    selectedCategoryPolicies.value = policies;
  } catch (error) {
    notifyError("Error loading policies");
  } finally {
    loadingPolicies.value = false;
  }
}

function selectPolicy(policy: PolicyRow) {
  selectedPolicy.value = policy;
  if (!(policy.id in policyIsSimple.value)) {
    policyIsSimple.value[policy.id] = null;
  }
  loadPolicyDetails(policy);
}

function selectAllPolicy(policy: PolicyItem) {
  const row: PolicyRow = {
    id: policy.id,
    name: policy.name,
    displayName: policy.displayName,
    description: policy.description,
    path: "",
    enabled: true,
    scope: policy.scope,
  };
  selectPolicy(row);
}

async function loadPolicyDetails(policy: PolicyRow) {
  loadingPolicyDetails.value = true;
  policyDetailsElements.value = [];
  policySettingsValues.value = {};
  presentationElements.value = [];

  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      throw new TypeError(`Invalid policy ID: ${policy.id}`);
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("en-US");

    const response = await policyCatalogServiceClient.getPolicyDetails(
      request,
      metadata,
    );

    let responseObj: Record<string, unknown> = {};

    try {
      const policyData = response.getPolicy?.();
      const presentation = response.getPresentation?.();
      const policyElementsList = response.getPolicyElementsList?.() || [];

      if (policyData) {
        responseObj.policy = {
          id: policyData.getId?.() || 0,
          name: policyData.getName?.() || "",
          hash: policyData.getHash?.() || "",
          scope: policyData.getScope?.() || "",
          parent_category_ref: policyData.getParentCategoryRef?.() || undefined,
          supported_on_ref: policyData.getSupportedOnRef?.() || undefined,
        };
      }

      if (presentation) {
        const elementsList = presentation.getElementsList?.() || [];
        const presentationElementsList = elementsList.map((el: unknown) => {
          if (el && typeof el === "object" && "toObject" in el) {
            try {
              return (el as { toObject: () => unknown }).toObject();
            } catch {
              const elem = el as {
                getId?: () => number;
                getType?: () => string;
                getRefId?: () => string;
                getParentElementId?: () => unknown;
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
                    typeof (value as { getValue?: () => unknown }).getValue ===
                    "function"
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
                id: elem.getId?.() || 0,
                type: elem.getType?.() || "",
                ref_id: elem.getRefId?.() || "",
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
            }
          }
          return el;
        });

        presentationElements.value =
          (presentationElementsList as PolicyPresentationElement[]) || [];

        responseObj.presentation = {
          id: presentation.getId?.() || 0,
          presentation_id: presentation.getPresentationId?.() || "",
          adml_file: presentation.getAdmlFile?.() || "",
          elements: presentationElementsList,
        };
      } else {
        presentationElements.value = [];
      }

      responseObj.policy_elements = policyElementsList.map((el: unknown) => {
        if (el && typeof el === "object") {
          if ("toObject" in el) {
            try {
              return (el as { toObject: () => unknown }).toObject();
            } catch {}
          }

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

          const itemsList = elem.getItemsList?.() || [];
          const items = itemsList.map((item: unknown) => {
            if (item && typeof item === "object" && "toObject" in item) {
              try {
                return (item as { toObject: () => unknown }).toObject();
              } catch {
                const it = item as {
                  getId?: () => number;
                  getName?: () => string;
                  getParentType?: () => string;
                  getType?: () => string;
                  getValueType?: () => string;
                  getValueName?: () => unknown;
                  getRequired?: () => unknown;
                  getParentId?: () => unknown;
                  getDisplayName?: () => unknown;
                };
                return {
                  id: it.getId?.() || 0,
                  name: it.getName?.() || "",
                  parent_type: it.getParentType?.() || "",
                  type: it.getType?.() || "",
                  value_type: it.getValueType?.() || "",
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
              }
            }
            return item;
          });

          return {
            id: elem.getId?.() || 0,
            element_id: elem.getElementId?.() || "",
            type: elem.getType?.() || "",
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
    } catch {
      try {
        if (response && typeof response.toObject === "function") {
          try {
            responseObj = (
              response.toObject as () => Record<string, unknown>
            )();
          } catch {
            responseObj =
              (response as unknown as Record<string, unknown>) || {};
          }
        } else {
          responseObj = (response as unknown as Record<string, unknown>) || {};
        }
      } catch {
        responseObj = (response as unknown as Record<string, unknown>) || {};
      }
    }

    const policyElements =
      (responseObj as { policyElementsList?: unknown[] }).policyElementsList ||
      (responseObj as { policy_elements?: unknown[] }).policy_elements ||
      [];

    const presentation = (
      responseObj as { presentation?: Record<string, unknown> }
    ).presentation;

    const presentationElementsList =
      presentation && typeof presentation === "object"
        ? (presentation as { elementsList?: unknown[] }).elementsList ||
          (presentation as { elements?: unknown[] }).elements ||
          []
        : [];

    const presentationMap = new Map<
      string,
      { type: string; text?: string; default_value?: string }
    >();
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
              type: p.type || "",
              text: extractStringValue(p.text),
              default_value: extractStringValue(
                p.defaultValue || p.default_value,
              ),
            });
          }
        }
      }
    }

    const policyInfo = (responseObj as { policy?: Record<string, unknown> })
      .policy;
    if (policyInfo && typeof policyInfo === "object") {
      const policyHash = (policyInfo.hash as string) || "";
      if (policyHash) {
        const policyIdFromApi = String(policyInfo.id || policy.id);
        const policyId = policyIdFromApi || policy.id;

        if (!policyDetails.value[policyId]) {
          policyDetails.value[policyId] = {
            settings: {},
            policy: policyInfo as {
              id: number | string;
              name: string;
              hash: string;
              scope?: string;
            },
            hash: policyHash,
          };
        } else {
          policyDetails.value[policyId].policy = policyInfo as {
            id: number | string;
            name: string;
            hash: string;
            scope?: string;
          };
          policyDetails.value[policyId].hash = policyHash;
        }
      }
    }

    if (!presentation) {
      policyDetailsElements.value = [];
      if (selectedPolicy.value) {
        policyIsSimple.value[selectedPolicy.value.id] = true;
      }
    } else {
      const elements: PolicyDetailsElement[] = [];
      if (Array.isArray(policyElements)) {
        for (const element of policyElements) {
          if (element && typeof element === "object") {
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
                  "array" in value &&
                  Array.isArray((value as { array?: unknown[] }).array)
                ) {
                  const arr = (value as { array: unknown[] }).array;
                  if (arr.length > 0) {
                    const first = arr[0];
                    if (
                      typeof first === "string" ||
                      typeof first === "number" ||
                      typeof first === "boolean"
                    ) {
                      return first;
                    }
                  }
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
                normalizedPresentationType === "textbox" ||
                normalizedPresentationType === "text_box"
              ) {
                finalType = "TEXT";
              } else if (
                normalizedPresentationType === "checkbox" ||
                normalizedPresentationType === "check_box"
              ) {
                finalType = "CHECKBOX";
              } else if (
                normalizedPresentationType === "decimaltextbox" ||
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
              items: Array.isArray(items)
                ? items
                    .filter(
                      (item): item is Record<string, unknown> =>
                        item !== null && typeof item === "object",
                    )
                    .map((item) => {
                      const itemId = (item.id as number) || 0;
                      const itemName = (item.name as string) || "";
                      const itemDisplayNameRaw =
                        (item.displayName as unknown) ||
                        (item.display_name as unknown) ||
                        "";
                      const itemDisplayName = extractWrapperValueFromObject(
                        itemDisplayNameRaw,
                      ) as string | undefined;
                      const itemValueType =
                        (item.valueType as string) ||
                        (item.value_type as string) ||
                        elementValueType ||
                        "";

                      const itemValue = (item.value as string) || "";

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
                        value: itemValue,
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
                : [],
            });
          }
        }
      }

      policyDetailsElements.value = elements;

      if (selectedPolicy.value) {
        const policyId = selectedPolicy.value.id;
        policyDetailsElementsMap.value[policyId] = elements;
        policyIsSimple.value[policyId] = elements.length === 0;
      }

      for (const element of elements) {
        if (!(element.element_id in policySettingsValues.value)) {
          const presentationEl = presentationMap.get(element.element_id);
          const defaultValue = presentationEl?.default_value;
          if (defaultValue !== undefined) {
            policySettingsValues.value[element.element_id] = defaultValue;
          } else {
            policySettingsValues.value[element.element_id] =
              getDefaultValue(element);
          }
        }
      }

      const policyInfo = (responseObj as { policy?: Record<string, unknown> })
        .policy;
      if (policyInfo && typeof policyInfo === "object") {
        const policyHash = (policyInfo.hash as string) || "";
        if (policyHash) {
          const policyIdFromApi = String(policyInfo.id || policy.id);
          const policyId = policyIdFromApi || policy.id;

          if (!policyDetails.value[policyId]) {
            policyDetails.value[policyId] = {
              settings: {},
              policy: policyInfo as {
                id: number | string;
                name: string;
                hash: string;
                scope?: string;
              },
              hash: policyHash,
            };
          } else {
            policyDetails.value[policyId].policy = policyInfo as {
              id: number | string;
              name: string;
              hash: string;
              scope?: string;
            };
            policyDetails.value[policyId].hash = policyHash;
          }
        }
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
        `Error deserializing server response for policy "${policy.displayName || policy.name}" (ID: ${policy.id}). ` +
        "The policy data may contain invalid fields. " +
        "Try another policy or contact the administrator.";
    } else if (
      errorMessageStr.includes("Exception was thrown by handler") ||
      errorMessageStr.includes("RpcError")
    ) {
      errorMessage = "Policy does not exist";
    } else if (error instanceof Error) {
      if (error.message.includes("Error deserializing")) {
        errorMessage = error.message;
      } else {
        errorMessage = "Policy does not exist";
      }
    }

    notifyError(errorMessage);
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
    delete policyIsSimple.value[policy.id];
  } finally {
    loadingPolicyDetails.value = false;
  }
}

function getDefaultValue(element: PolicyDetailsElement): unknown {
  switch (element.type) {
    case "CHECKBOX":
    case "BOOL":
    case "boolean":
      return false;
    case "TEXT":
    case "STRING":
    case "string":
      return "";
    case "NUMERIC":
    case "INT":
    case "int":
    case "number":
      return element.min_value || 0;
    case "LIST":
    case "list":
      return [];
    default:
      return null;
  }
}

function toggleUser(userSid: string) {
  const index = selectedUsers.value.indexOf(userSid);
  if (index === -1) {
    selectedUsers.value.push(userSid);
  } else {
    selectedUsers.value.splice(index, 1);
  }
}

function selectAllUsers() {
  selectedUsers.value = props.users.map((u) => u.sid);
}

function deselectAllUsers() {
  selectedUsers.value = [];
}

async function applySelectedPolicy() {
  if (!selectedPolicy.value || !props.agent) {
    return;
  }

  if (selectedUsers.value.length === 0) {
    notifyError("Please select users");
    return;
  }

  applying.value = true;
  try {
    const policyId = Number.parseInt(selectedPolicy.value.id, 10);
    if (Number.isNaN(policyId)) {
      throw new Error(`Invalid policy ID: ${selectedPolicy.value.id}`);
    }

    let policyHash: string | undefined;

    const policyDetail = policyDetails.value[selectedPolicy.value.id];
    if (policyDetail?.hash) {
      policyHash = policyDetail.hash;
    } else {
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
      }
    }

    if (!policyHash) {
      throw new Error(
        "Could not get policy hash. Please try selecting the policy again.",
      );
    }

    const usersToApply: User[] =
      selectedUsers.value.length > 0
        ? props.users.filter((u) => selectedUsers.value.includes(u.sid))
        : [];

    const applyPromises: Promise<unknown>[] = [];

    if (policyIsSimple.value[selectedPolicy.value.id] === true) {
      const toggleEnabled =
        policyToggleStates.value[selectedPolicy.value.id] ?? false;
      const simpleSelection = new PolicySelection();
      simpleSelection.setValue(toggleEnabled ? "1" : "0");

      for (const user of usersToApply) {
        applyPromises.push(
          policyAssignmentClient.assignPolicy(
            policyHash,
            "user_on_agent",
            {
              agentId: String(props.agent.id),
              userSid: String(user.sid),
            },
            simpleSelection,
          ),
        );
      }
    } else {
      let processedSettings: Record<string, unknown> = {};
      if (
        policySettingsValues.value &&
        Object.keys(policySettingsValues.value).length > 0
      ) {
        processedSettings = { ...policySettingsValues.value };
      } else if (policyDetail?.settings) {
        processedSettings = policyDetail.settings;
      }

      for (const user of usersToApply) {
        applyPromises.push(
          policyAssignmentClient.assignPolicy(
            policyHash,
            "user_on_agent",
            {
              agentId: String(props.agent.id),
              userSid: String(user.sid),
            },
            processedSettings,
            policyDetailsElements.value,
          ),
        );
      }
    }

    await Promise.all(applyPromises);

    const policyName =
      selectedPolicy.value.displayName || selectedPolicy.value.name;
    const usersCount = selectedUsers.value.length;
    const targetText = ` to ${usersCount} ${usersCount === 1 ? "user" : "users"} on ${props.agent.hostname}`;

    notifySuccess(`Policy "${policyName}" successfully applied${targetText}`);

    emit("applied");
    dialogVisible.value = false;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error applying policy";
    notifyError(`Error applying policy: ${errorMessage}`);
  } finally {
    applying.value = false;
  }
}

async function removePolicy() {
  if (!selectedPolicy.value || !props.agent) {
    return;
  }

  if (selectedUsers.value.length === 0) {
    notifyError("Please select users");
    return;
  }

  applying.value = true;
  try {
    const policyId = Number.parseInt(selectedPolicy.value.id, 10);
    if (Number.isNaN(policyId)) {
      throw new Error(`Invalid policy ID: ${selectedPolicy.value.id}`);
    }

    let policyHash: string | undefined;

    const policyDetail = policyDetails.value[selectedPolicy.value.id];
    if (policyDetail?.hash) {
      policyHash = policyDetail.hash;
    } else {
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
      }
    }

    if (!policyHash) {
      throw new Error(
        "Could not get policy hash. Please try selecting the policy again.",
      );
    }

    const removePromises: Promise<unknown>[] = [];

    const usersToRemove: User[] =
      selectedUsers.value.length > 0
        ? props.users.filter((u) => selectedUsers.value.includes(u.sid))
        : [];

    for (const user of usersToRemove) {
      removePromises.push(
        policyAssignmentClient.removePolicy(policyHash, "user_on_agent", {
          agentId: String(props.agent.id),
          userSid: String(user.sid),
        }),
      );
    }

    await Promise.all(removePromises);

    const policyName =
      selectedPolicy.value.displayName || selectedPolicy.value.name;
    const usersCount = selectedUsers.value.length;
    const targetText = ` from ${usersCount} ${usersCount === 1 ? "user" : "users"} on ${props.agent.hostname}`;

    notifySuccess(`Policy "${policyName}" successfully removed${targetText}`);

    emit("applied");
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
.apply-policy-dialog
  min-width: 1200px

.category-tree
  overflow-y: auto

.policy-list-section
  display: flex
  flex-direction: column
  height: 100%

.policy-list-scroll
  margin-top: 8px

.policy-item
  padding: 8px 16px
  border-radius: 4px

.policy-item:hover
  background-color: rgba(0, 0, 0, 0.04)

.policy-details-container
  max-height: calc(100vh - 300px)
  overflow-y: auto

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

.body--dark .policy-item:hover
  background-color: rgba(255, 255, 255, 0.06)

.body--dark .policy-element
  border-color: rgba(255, 255, 255, 0.12)
  background: rgba(255, 255, 255, 0.04)

.body--dark .policy-element:hover
  background: rgba(255, 255, 255, 0.08)
  border-color: rgba(255, 255, 255, 0.2)
</style>
