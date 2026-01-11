<template>
  <q-dialog
    v-model="dialogVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="apply-policy-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Применить политику</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div v-if="agent" class="text-subtitle2 q-mb-md">
          Устройство: {{ agent.hostname }}
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
          <q-tab name="policies" icon="policy" label="Политики" />
          <q-tab name="users" icon="people" label="Пользователи" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="dialogTab" class="q-mt-md">
          <q-tab-panel name="policies" class="q-pa-none">
            <div
              class="row q-col-gutter-md"
              style="height: calc(100vh - 250px)"
            >
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
                    <div
                      v-if="loadingPolicyDetails"
                      class="text-center q-pa-lg"
                    >
                      <q-spinner color="primary" size="2em" />
                      <div class="q-mt-sm">Загрузка настроек...</div>
                    </div>

                    <div v-else class="policy-details-container">
                      <div class="text-h6 q-mb-md">
                        {{ selectedPolicy.displayName || selectedPolicy.name }}
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
                        v-if="policyDetailsElements.length > 0"
                        class="policy-settings-form q-mt-lg"
                      >
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
                                  element.presentation_type?.toLowerCase() ===
                                    'checkbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'check_box'
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
                                  element.presentation_type?.toLowerCase() ===
                                    'textbox' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'text_box' ||
                                  element.presentation_type?.toLowerCase() ===
                                    'text'
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
                                  element.value_type === 'decimal' ||
                                  element.value_type === 'int' ||
                                  element.value_type === 'integer'
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
                                :label="
                                  element.display_name || element.element_id
                                "
                                type="number"
                                :min="element.min_value"
                                :max="element.max_value"
                                :step="
                                  element.value_type === 'decimal' ? 0.01 : 1
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
                                    element.type === 'enum' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'dropdownlist' ||
                                    element.presentation_type?.toLowerCase() ===
                                      'dropdown_list') &&
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
                                :label="
                                  element.display_name || element.element_id
                                "
                                :options="element.items"
                                option-label="display_name"
                                option-value="id"
                                :hint="
                                  (element.required
                                    ? 'Обязательное поле'
                                    : '') +
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

                      <div v-else class="text-center q-pa-lg text-grey-6">
                        <q-icon name="info" size="2em" />
                        <div class="q-mt-sm">Нет дополнительных настроек</div>
                      </div>

                      <div class="row q-mt-md q-gutter-sm">
                        <q-btn
                          flat
                          :label="isPolicySelected ? 'Отключить' : 'Применить'"
                          :color="isPolicySelected ? 'negative' : 'positive'"
                          @click="togglePolicySelection"
                          :disable="!selectedPolicy"
                        />
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section
                    v-else
                    class="text-center q-pa-lg text-grey-6"
                  >
                    <q-icon name="info" size="3em" />
                    <div class="q-mt-md">Выберите политику для настройки</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="users" class="q-pa-none">
            <div class="text-subtitle2 q-mb-md">
              Выберите пользователя для применения политик
            </div>
            <q-radio
              v-model="selectedUser"
              val=""
              label="Применить ко всем пользователям устройства"
              class="q-mb-md"
            />
            <q-separator class="q-mb-md" />
            <q-list separator>
              <q-item
                v-for="user in users"
                :key="user.sid"
                clickable
                v-ripple
                :active="selectedUser === user.sid"
                @click="selectedUser = user.sid"
              >
                <q-item-section avatar>
                  <q-radio v-model="selectedUser" :val="user.sid" />
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
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Отмена"
          color="primary"
          @click="dialogVisible = false"
        />
        <q-btn
          flat
          label="Применить"
          color="primary"
          @click="applyPolicies"
          :loading="applying"
          :disable="!hasSelectedPolicies"
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
} from "../api/grpc-client";
import { notifySuccess, notifyError } from "@/utils/notify";
import type { GPOPolicy } from "../types/gpo";

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

const props = defineProps<{
  modelValue: boolean;
  agent: Agent | null;
  users: User[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "applied"): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dialogTab = ref("policies");
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
const selectedPolicies = ref<Record<string, boolean>>({});
const policyDetails = ref<Record<string, Record<string, unknown>>>({});
const selectedUser = ref("");
const applying = ref(false);

const hasSelectedPolicies = computed(() => {
  return Object.values(selectedPolicies).includes(true);
});

const isPolicySelected = computed(() => {
  if (!selectedPolicy.value) return false;
  return selectedPolicies.value[selectedPolicy.value.id] || false;
});

watch(dialogVisible, (newVal) => {
  if (newVal && props.agent) {
    loadCategories();
  } else {
    selectedPolicies.value = {};
    policyDetails.value = {};
    selectedUser.value = "";
    selectedCategoryId.value = null;
    selectedCategory.value = null;
    selectedCategoryPolicies.value = [];
    selectedPolicy.value = null;
    policyDetailsElements.value = [];
    policySettingsValues.value = {};
  }
});

async function loadCategories() {
  if (!props.agent) return;

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
      "[ApplyPolicyDialog] Загружено категорий:",
      convertedCategories.length,
    );
  } catch (error) {
    console.error("[ApplyPolicyDialog] Ошибка загрузки категорий:", error);
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
      "[ApplyPolicyDialog] Загружено политик для категории:",
      policies.length,
    );
  } catch (error) {
    console.error(
      "[ApplyPolicyDialog] Ошибка загрузки политик по категории:",
      error,
    );
    notifyError("Ошибка загрузки политик");
  } finally {
    loadingPolicies.value = false;
  }
}

function selectPolicy(policy: GPOPolicy) {
  selectedPolicy.value = policy;
  loadPolicyDetails(policy);
}

async function loadPolicyDetails(policy: GPOPolicy) {
  loadingPolicyDetails.value = true;
  policyDetailsElements.value = [];
  policySettingsValues.value = {};

  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      throw new TypeError(`Неверный ID политики: ${policy.id}`);
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("ru-RU");

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
        responseObj.presentation = {
          id: presentation.getId?.() || 0,
          presentation_id: presentation.getPresentationId?.() || "",
          adml_file: presentation.getAdmlFile?.() || "",
          elements: elementsList.map((el: unknown) => {
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
                return {
                  id: elem.getId?.() || 0,
                  type: elem.getType?.() || "",
                  ref_id: elem.getRefId?.() || "",
                  parent_element_id: elem.getParentElementId?.() || undefined,
                  default_value: elem.getDefaultValue?.() || undefined,
                  text: elem.getText?.() || undefined,
                };
              }
            }
            return el;
          }),
        };
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
                  value_name: it.getValueName?.() || undefined,
                  required: it.getRequired?.() || undefined,
                  parent_id: it.getParentId?.() || undefined,
                  display_name: it.getDisplayName?.() || undefined,
                };
              }
            }
            return item;
          });

          return {
            id: elem.getId?.() || 0,
            element_id: elem.getElementId?.() || "",
            type: elem.getType?.() || "",
            value_name: elem.getValueName?.() || undefined,
            registry_key: elem.getRegistryKey?.() || undefined,
            required: elem.getRequired?.() || undefined,
            max_length: elem.getMaxLength?.() || undefined,
            min_value: elem.getMinValue?.() || undefined,
            max_value: elem.getMaxValue?.() || undefined,
            items: items,
          };
        }
        return el;
      });
    } catch (manualParseError) {
      console.warn(
        "[ApplyPolicyDialog] Ошибка ручного парсинга:",
        manualParseError,
      );
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
      } catch (toObjectError) {
        console.error(
          "[ApplyPolicyDialog] Ошибка при вызове toObject():",
          toObjectError,
        );
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
            defaultValue?: string;
            default_value?: string;
            text?: string;
          };
          const refId = p.refId || p.ref_id || "";
          if (refId) {
            presentationMap.set(refId, {
              type: p.type || "",
              text: p.text,
              default_value: p.defaultValue || p.default_value,
            });
          }
        }
      }
    }

    const policyInfo = (responseObj as { policy?: Record<string, unknown> })
      .policy;
    if (policyInfo && typeof policyInfo === "object") {
      if (presentation && presentationMap.size > 0) {
      }
    }

    if (!presentation) {
      policyDetailsElements.value = [];
      console.log(
        "[ApplyPolicyDialog] Политика не имеет presentation, настроек нет",
      );
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
            if (isDropdownList && finalType !== "enum") {
              finalType = "enum";
            }

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
              items: Array.isArray(items)
                ? items
                    .filter(
                      (item): item is Record<string, unknown> =>
                        item !== null && typeof item === "object",
                    )
                    .map((item) => {
                      const itemId = (item.id as number) || 0;
                      const itemName = (item.name as string) || "";
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
                : [],
            });
          }
        }
      }

      policyDetailsElements.value = elements;

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
    }
  } catch (error) {
    console.error(
      "[ApplyPolicyDialog] Ошибка загрузки деталей политики:",
      error,
    );
    notifyError("Ошибка загрузки настроек политики");
    policyDetailsElements.value = [];
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

function togglePolicySelection() {
  if (!selectedPolicy.value) return;

  const policyId = selectedPolicy.value.id;
  const isSelected = selectedPolicies.value[policyId] || false;

  if (isSelected) {
    selectedPolicies.value[policyId] = false;
    delete policyDetails.value[policyId];
  } else {
    selectedPolicies.value[policyId] = true;
    policyDetails.value[policyId] = {
      settings: { ...policySettingsValues.value },
      policy: selectedPolicy.value,
    };
  }
}

async function applyPolicies() {
  if (!props.agent || !hasSelectedPolicies.value) return;

  applying.value = true;
  try {
    // TODO: Реализовать вызов API AssignPolicy
    // Пока используем заглушку
    const selectedPolicyIds = Object.keys(selectedPolicies.value).filter(
      (id) => selectedPolicies.value[id],
    );

    console.log("[ApplyPolicyDialog] Применение политик:", {
      agentId: props.agent.id,
      userId: selectedUser.value || "all",
      policyIds: selectedPolicyIds,
      policyDetails: policyDetails.value,
    });

    // типа запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userName = selectedUser.value
      ? props.users.find((u) => u.sid === selectedUser.value)?.name
      : null;
    const userText = userName ? ` (пользователь: ${userName})` : "";
    notifySuccess(
      `Политики успешно применены для ${props.agent.hostname}${userText}`,
    );

    emit("applied");
    dialogVisible.value = false;
  } catch (error) {
    console.error("[ApplyPolicyDialog] Ошибка применения политик:", error);
    notifyError("Ошибка применения политик");
  } finally {
    applying.value = false;
  }
}
</script>

<style scoped lang="sass">
.apply-policy-dialog
  min-width: 800px
  max-width: 1200px

.category-tree
  max-height: calc(100vh - 300px)
  overflow-y: auto

.policy-item
  padding: 8px 16px
  border-radius: 4px

.policy-item:hover
  background-color: rgba(0, 0, 0, 0.04)

.policy-details-container
  max-height: calc(100vh - 300px)
  overflow-y: auto

.policy-settings-form
  max-height: 500px
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
</style>
