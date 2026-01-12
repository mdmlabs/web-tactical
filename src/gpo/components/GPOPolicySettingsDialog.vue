<template>
  <q-dialog
    v-model="dialogVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="policy-settings-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Настройка политик</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md" style="height: calc(100vh - 200px)">
          <div class="col-3">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-subtitle2 q-mb-md">Категории</div>
                <div v-if="loadingCategories" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="2em" />
                  <div class="q-mt-sm">Загрузка категорий...</div>
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
                  <div class="q-mt-sm">Категории не найдены</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-3">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-subtitle2 q-mb-md">Политики</div>
                <div v-if="loadingPolicies" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="2em" />
                  <div class="q-mt-sm">Загрузка политик...</div>
                </div>
                <q-list
                  v-else-if="selectedCategoryPolicies.length > 0"
                  separator
                >
                  <q-item
                    v-for="policy in selectedCategoryPolicies"
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
                  </q-item>
                </q-list>
                <div
                  v-else-if="selectedCategory"
                  class="text-center q-pa-lg text-grey-6"
                >
                  <q-icon name="info" size="2em" />
                  <div class="q-mt-sm">В категории нет политик</div>
                </div>
                <div v-else class="text-center q-pa-lg text-grey-6">
                  <q-icon name="info" size="2em" />
                  <div class="q-mt-sm">Выберите категорию</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-6">
            <q-card flat bordered class="full-height">
              <q-card-section v-if="selectedPolicy">
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
                    label="Настройка политик"
                  />
                  <q-tab
                    name="description"
                    icon="description"
                    label="Описание"
                  />
                </q-tabs>

                <q-separator class="q-mt-sm" />

                <q-tab-panels
                  v-model="settingsTab"
                  class="q-mt-md"
                  style="height: calc(100% - 100px); overflow-y: auto"
                >
                  <q-tab-panel name="settings" class="q-pa-none">
                    <div
                      v-if="loadingPolicyDetails"
                      class="text-center q-pa-lg"
                    >
                      <q-spinner color="primary" size="2em" />
                      <div class="q-mt-sm">Загрузка настроек...</div>
                    </div>

                    <div
                      v-else-if="policyDetailsElements.length === 0"
                      class="text-center q-pa-lg text-grey-6"
                    >
                      <q-icon name="info" size="2em" />
                      <div class="q-mt-sm">Нет дополнительных настроек</div>
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
                              :label="
                                element.display_name || element.element_id
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
                                element.presentation_type === 'multiTextbox' ||
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
                              :label="
                                element.display_name || element.element_id
                              "
                              :maxlength="element.max_length"
                              :type="
                                element.type === 'multiTextbox' ||
                                element.type === 'multiTextBox' ||
                                element.presentation_type === 'multiTextbox' ||
                                element.presentation_type === 'multiTextBox'
                                  ? 'textarea'
                                  : 'text'
                              "
                              :rows="
                                element.type === 'multiTextbox' ||
                                element.type === 'multiTextBox' ||
                                element.presentation_type === 'multiTextbox' ||
                                element.presentation_type === 'multiTextBox'
                                  ? 3
                                  : undefined
                              "
                              :hint="
                                element.required ? 'Обязательное поле' : ''
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
                                element.presentation_type === 'decimalTextBox'
                              "
                              :model-value="
                                Number(
                                  policySettingsValues[element.element_id] || 0,
                                )
                              "
                              @update:model-value="
                                policySettingsValues[element.element_id] =
                                  $event
                              "
                              :label="
                                element.display_name || element.element_id
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
                              :hint="
                                element.required ? 'Обязательное поле' : ''
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
                                  element.presentation_type ===
                                    'dropdownList') &&
                                element.items &&
                                element.items.length > 0
                              "
                              :model-value="
                                policySettingsValues[element.element_id] ?? null
                              "
                              @update:model-value="
                                policySettingsValues[element.element_id] =
                                  $event
                              "
                              :label="
                                element.display_name || element.element_id
                              "
                              :options="element.items"
                              option-label="display_name"
                              option-value="id"
                              :hint="
                                (element.required ? 'Обязательное поле' : '') +
                                (element.value_type
                                  ? ` (тип значения: ${element.value_type})`
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
                                      `Значение ${scope.opt.id}`
                                    }}</q-item-label>
                                    <q-item-label
                                      v-if="scope.opt.value_type"
                                      caption
                                      class="text-grey-6"
                                    >
                                      ID: {{ scope.opt.id }}, тип:
                                      {{ scope.opt.value_type }}
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>

                            <q-select
                              v-else-if="
                                element.type === 'List' ||
                                element.presentation_type?.toLowerCase() ===
                                  'multibox' ||
                                element.presentation_type?.toLowerCase() ===
                                  'multi_box' ||
                                element.presentation_type === 'List' ||
                                (element.type === 'LIST' &&
                                  element.items &&
                                  element.items.length > 0 &&
                                  element.presentation_type?.toLowerCase() ===
                                    'listbox')
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
                              :label="
                                element.display_name || element.element_id
                              "
                              :options="element.items"
                              option-label="display_name"
                              option-value="id"
                              multiple
                              use-chips
                              :hint="
                                (element.required ? 'Обязательное поле' : '') +
                                (element.value_type
                                  ? ` (тип значения: ${element.value_type})`
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
                                      `Значение ${scope.opt.id}`
                                    }}</q-item-label>
                                    <q-item-label
                                      v-if="scope.opt.value_type"
                                      caption
                                      class="text-grey-6"
                                    >
                                      ID: {{ scope.opt.id }}, тип:
                                      {{ scope.opt.value_type }}
                                    </q-item-label>
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
                              :label="
                                element.display_name || element.element_id
                              "
                              :hint="`Тип: ${element.type}${element.required ? ' (обязательное)' : ''}`"
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
                      <div class="q-mt-sm">Загрузка описания...</div>
                    </div>

                    <div v-else-if="selectedPolicy" class="policy-description">
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
                          Описание отсутствует
                        </div>

                        <div
                          v-if="presentationElements.length > 0"
                          class="q-mt-lg"
                        >
                          <div class="text-subtitle2 q-mb-md">
                            Элементы представления
                          </div>
                          <q-list separator>
                            <q-item
                              v-for="presEl in presentationElements"
                              :key="presEl.id"
                              class="presentation-item"
                            >
                              <q-item-section>
                                <q-item-label class="text-weight-medium">
                                  {{ presEl.text || presEl.ref_id }}
                                </q-item-label>
                                <q-item-label caption>
                                  Тип: {{ presEl.type || "Не указан" }}
                                </q-item-label>
                                <q-item-label
                                  v-if="presEl.default_value"
                                  caption
                                  class="text-grey-7"
                                >
                                  Значение по умолчанию:
                                  {{ presEl.default_value }}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                        <div v-else class="text-center q-pa-lg text-grey-6">
                          <q-icon name="info" size="2em" />
                          <div class="q-mt-sm">Нет элементов представления</div>
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>

              <q-card-section v-else class="text-center q-pa-lg text-grey-6">
                <q-icon name="info" size="3em" />
                <div class="q-mt-md">Выберите политику для настройки</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Отключить"
          color="negative"
          @click="disablePolicy"
          :disable="!selectedPolicy || !isPolicyEnabled"
        />
        <q-btn
          flat
          label="Применить"
          color="positive"
          @click="applyPolicy"
          :disable="!selectedPolicy"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  policyCatalogServiceClient,
  createGrpcMetadata,
  operator_pb,
  policyAssignmentClient,
} from "../api/grpc-client";
import { notifySuccess, notifyError } from "@/utils/notify";
import type { GPOPolicy } from "../types/gpo";

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
const policyHashes = ref<Record<string, string>>({}); // Кеш для hash политик

const isPolicyEnabled = computed(() => {
  if (!selectedPolicy.value) return false;
  return policyEnabled.value[selectedPolicy.value.id] ?? false;
});

watch(dialogVisible, (newVal) => {
  if (newVal) {
    loadCategories();
  } else {
    selectedCategoryId.value = null;
    selectedCategory.value = null;
    selectedCategoryPolicies.value = [];
    selectedPolicy.value = null;
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
    presentationElements.value = [];
    settingsTab.value = "settings";
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
    request.setLangCode("ru-RU");

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
    console.log(
      "[GPOPolicySettingsDialog] Загружено категорий:",
      convertedCategories.length,
    );
  } catch (error) {
    console.error(
      "[GPOPolicySettingsDialog] Ошибка загрузки категорий:",
      error,
    );
    notifyError("Ошибка загрузки категорий");
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
    request.setLangCode("ru-RU");
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
    console.log(
      "[GPOPolicySettingsDialog] Загружено политик для категории:",
      policies.length,
    );
  } catch (error) {
    console.error(
      "[GPOPolicySettingsDialog] Ошибка загрузки политик по категории:",
      error,
    );
    notifyError("Ошибка загрузки политик");
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
      throw new TypeError(`Неверный ID политики: ${policy.id}`);
    }

    if (policyId <= 0) {
      throw new Error(
        `Неверный ID политики: ${policyId}. ID должен быть положительным числом.`,
      );
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("ru-RU");

    const response = await policyCatalogServiceClient.getPolicyDetails(
      request,
      metadata,
    );

    if (!response) {
      throw new Error("Пустой ответ от сервера");
    }

    const responseObj: Record<string, unknown> = {};

    try {
      const policyData = response.getPolicy?.();
      if (policyData) {
        let policyHash = "";
        try {
          policyHash = policyData.getHash?.() || "";
        } catch (e) {
          console.warn("[GPOPolicySettingsDialog] Ошибка получения hash:", e);
        }

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
    } catch (error) {
      console.error(
        "[GPOPolicySettingsDialog] Ошибка обработки policy:",
        error,
      );
    }

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
                  getParentElementId?: () => number;
                  getDefaultValue?: () => string;
                  getText?: () => string;
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
                      return elem.getParentElementId?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  default_value: (() => {
                    try {
                      return elem.getDefaultValue?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  text: (() => {
                    try {
                      return elem.getText?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                };
              } catch (error) {
                console.warn(
                  "[GPOPolicySettingsDialog] Ошибка обработки presentation element:",
                  error,
                );
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
    } catch (error) {
      console.error(
        "[GPOPolicySettingsDialog] Ошибка обработки presentation:",
        error,
      );
    }

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
          getValueName?: () => string;
          getRegistryKey?: () => string;
          getRequired?: () => boolean;
          getMaxLength?: () => number;
          getMinValue?: () => number;
          getMaxValue?: () => number;
          getItemsList?: () => unknown[];
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
                      return it.getValueName?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  required: (() => {
                    try {
                      return it.getRequired?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  parent_id: (() => {
                    try {
                      return it.getParentId?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                  display_name: (() => {
                    try {
                      return it.getDisplayName?.() || undefined;
                    } catch {
                      return undefined;
                    }
                  })(),
                };
              } catch (error) {
                console.warn(
                  "[GPOPolicySettingsDialog] Ошибка обработки item:",
                  error,
                );
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
              return elem.getValueName?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          registry_key: (() => {
            try {
              return elem.getRegistryKey?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          required: (() => {
            try {
              return elem.getRequired?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          max_length: (() => {
            try {
              return elem.getMaxLength?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          min_value: (() => {
            try {
              return elem.getMinValue?.() || undefined;
            } catch {
              return undefined;
            }
          })(),
          max_value: (() => {
            try {
              return elem.getMaxValue?.() || undefined;
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
            defaultValue?: string;
            default_value?: string;
            text?: string;
          };
          const refId = p.refId || p.ref_id || "";
          if (refId) {
            presentationMap.set(refId, {
              id: p.id || 0,
              type: p.type || "",
              ref_id: refId,
              parent_element_id: p.parentElementId || p.parent_element_id,
              default_value: p.defaultValue || p.default_value,
              text: p.text,
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
          const displayName = presentationEl?.text || elementId;
          const presentationType = presentationEl?.type || "";

          const normalizedPresentationType = presentationType.toLowerCase();
          const isDropdownList =
            normalizedPresentationType === "dropdownlist" ||
            normalizedPresentationType === "dropdown_list" ||
            normalizedPresentationType === "dropdown";

          const items = el.itemsList || el.items || [];
          const elementValueType = el.valueType || el.value_type || "";

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
              normalizedPresentationType === "list_box"
            ) {
              finalType = "LIST";
            }
          } else if (isDropdownList && finalType !== "enum") {
            finalType = "enum";
          }

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

                  const itemDisplayName =
                    (item.displayName as string) ||
                    (item.display_name as string) ||
                    "";
                  const itemValueType =
                    (item.valueType as string) ||
                    (item.value_type as string) ||
                    elementValueType ||
                    "";

                  const finalDisplayName =
                    itemDisplayName ||
                    itemName ||
                    (itemValueType
                      ? `Значение ${itemId} (${itemValueType})`
                      : `Значение ${itemId}`);

                  return {
                    id: itemId,
                    name: itemName,
                    display_name: finalDisplayName,
                    value_type: itemValueType,
                  };
                })
            : [];

          elements.push({
            id: el.id || 0,
            element_id: elementId,
            type: finalType,
            value_name: el.valueName || el.value_name,
            value_type: elementValueType,
            registry_key: el.registryKey || el.registry_key,
            required: el.required,
            max_length: el.maxLength || el.max_length,
            min_value: el.minValue || el.min_value,
            max_value: el.maxValue || el.max_value,
            display_name: displayName,
            presentation_type: presentationType,
            items: processedItems,
          });
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
    console.error(
      "[GPOPolicySettingsDialog] Ошибка загрузки деталей политики:",
      error,
    );

    let errorMessage = "Ошибка загрузки настроек политики";
    const errorStr = String(error);
    const errorMessageStr = error instanceof Error ? error.message : errorStr;

    if (
      errorMessageStr.includes("Cannot read properties of undefined") ||
      errorMessageStr.includes("protobuf") ||
      errorMessageStr.includes("deserializing") ||
      errorMessageStr.includes("Error when deserializing")
    ) {
      errorMessage =
        `Ошибка десериализации ответа сервера для политики ${policy.id}. ` +
        "Возможно, данные политики содержат некорректные поля (например, client_extension). " +
        "Это проблема на стороне сервера или в protobuf определении. " +
        "Попробуйте другую политику или обратитесь к администратору для исправления данных политики.";
    } else if (
      errorMessageStr.includes("Exception was thrown by handler") ||
      errorMessageStr.includes("RpcError")
    ) {
      errorMessage =
        `Ошибка на сервере при загрузке деталей политики (ID: ${policy.id}). ` +
        "Возможно, политика не существует или произошла ошибка на сервере. Проверьте логи сервера.";
    } else if (error instanceof Error) {
      if (error.message.includes("Ошибка десериализации")) {
        errorMessage = error.message;
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }
    }

    notifyError(errorMessage);
    policyDetailsElements.value = [];
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
    notifySuccess("Политика применена");
    return;
  }

  try {
    let policyHash = policyHashes.value[selectedPolicy.value.id];

    if (!policyHash) {
      const policyId = Number.parseInt(selectedPolicy.value.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Неверный ID политики: ${selectedPolicy.value.id}`);
      }

      const metadata = createGrpcMetadata();
      const request = new operator_pb.GetPolicyDetailsRequest();
      request.setPolicyId(policyId);
      request.setLangCode("ru-RU");

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
          "Hash политики не найден. Не удалось получить детали политики.",
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
      { agentId: props.agent.id },
      processedSettings,
    );

    policyEnabled.value[selectedPolicy.value.id] = true;
    emit("applied", selectedPolicy.value.id, policySettingsValues.value);
    notifySuccess("Политика успешно применена");
  } catch (error) {
    console.error(
      "[GPOPolicySettingsDialog] Ошибка применения политики:",
      error,
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Неизвестная ошибка применения политики";
    notifyError(`Ошибка применения политики: ${errorMessage}`);
  }
}

async function disablePolicy() {
  if (!selectedPolicy.value) return;

  if (!props.agent) {
    policyEnabled.value[selectedPolicy.value.id] = false;
    emit("disabled", selectedPolicy.value.id);
    notifySuccess("Политика отключена");
    return;
  }

  try {
    let policyHash = policyHashes.value[selectedPolicy.value.id];

    if (!policyHash) {
      const policyId = Number.parseInt(selectedPolicy.value.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Неверный ID политики: ${selectedPolicy.value.id}`);
      }

      const metadata = createGrpcMetadata();
      const request = new operator_pb.GetPolicyDetailsRequest();
      request.setPolicyId(policyId);
      request.setLangCode("ru-RU");

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
          "Hash политики не найден. Не удалось получить детали политики.",
        );
      }
    }

    await policyAssignmentClient.removePolicy(policyHash, "agent", {
      agentId: props.agent.id,
    });

    policyEnabled.value[selectedPolicy.value.id] = false;
    emit("disabled", selectedPolicy.value.id);
    notifySuccess("Политика успешно отключена");
  } catch (error) {
    console.error(
      "[GPOPolicySettingsDialog] Ошибка отключения политики:",
      error,
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Неизвестная ошибка отключения политики";
    notifyError(`Ошибка отключения политики: ${errorMessage}`);
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

.policy-settings-form
  max-height: calc(100vh - 400px)
  overflow-y: auto

.policy-element
  padding: 12px
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px
  margin-bottom: 16px
  background: rgba(0, 0, 0, 0.02)

.policy-element:hover
  background: rgba(0, 0, 0, 0.04)
  border-color: rgba(0, 0, 0, 0.2)

.policy-description
  max-height: calc(100vh - 400px)
  overflow-y: auto

.presentation-item
  padding: 12px
  border-radius: 4px
  margin-bottom: 8px
  background: rgba(0, 0, 0, 0.02)

.presentation-item:hover
  background: rgba(0, 0, 0, 0.04)
</style>
