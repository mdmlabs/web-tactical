<template>
  <div :key="`windows-${windowsTab}`" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
    <div class="gpo-content-header">
      <q-tabs
        v-model="windowsTab"
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
          v-for="group in admxGroups"
          :key="group.group"
          :name="`admx-${group.group}`"
          :icon="getAdmxGroupIcon(group.group)"
          :label="group.ui_name"
        />
      </q-tabs>
      <q-separator />
    </div>

    <q-tab-panels v-model="windowsTab" style="flex: 1; overflow: hidden;">
      <q-tab-panel
        v-for="group in admxGroups"
        :key="`admx-${group.group}`"
        :name="`admx-${group.group}`"
        class="q-pa-none"
        style="height: 100%; display: flex; flex-direction: column; overflow: hidden;"
      >
        <q-scroll-area style="flex: 1; height: 100%;">
          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">{{ group.ui_name }}</div>
            <div class="text-caption text-grey-7 q-mb-md">
              {{ group.description }}
            </div>

            <div v-if="admxLoading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Uploading policies...</div>
            </div>

            <div v-else>
              <div
                class="admx-grid-layout"
                :class="{
                  'admx-grid-expanded': !(selectedAdmxFile && selectedAdmxFileGroup === group.group)
                }"
                style="height: calc(100vh - 300px)"
              >
                <div class="admx-files-panel">
                  <q-card flat bordered class="full-height">
                    <q-card-section>
                      <q-scroll-area
                        :style="
                          selectedAdmxFile && selectedAdmxFileGroup === group.group
                            ? 'height: calc(100vh - 400px)'
                            : 'height: calc(100vh - 200px)'
                        "
                      >
                        <div
                          class="admx-files-grid"
                          :class="{
                            'admx-files-grid-compact': selectedAdmxFile && selectedAdmxFileGroup === group.group
                          }"
                        >
                          <q-card
                            v-for="admxFile in group.admx_files"
                            :key="admxFile.file"
                            class="cursor-pointer admx-file-card"
                            @click="onAdmxFileClick(admxFile.file, group.group)"
                            :class="{
                              'bg-primary text-white':
                                selectedAdmxFile === admxFile.file,
                            }"
                          >
                            <q-card-section>
                              <div class="text-subtitle2 q-mb-xs">
                                {{ admxFile.ui_name }}
                              </div>
                              <div
                                class="text-caption"
                                :class="{
                                  'text-grey-3': selectedAdmxFile === admxFile.file,
                                  'text-grey-7': selectedAdmxFile !== admxFile.file,
                                }"
                              >
                                {{ admxFile.description }}
                              </div>
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-scroll-area>
                    </q-card-section>
                  </q-card>
                </div>

                <div
                  v-if="selectedAdmxFile && selectedAdmxFileGroup === group.group"
                  class="admx-policies-panel"
                >
                  <div v-if="loadingAdmxPolicies" class="text-center q-pa-lg">
                    <q-spinner color="primary" size="2em" />
                    <div class="q-mt-sm">Uploading policies...</div>
                  </div>

                  <div
                    v-else-if="admxPoliciesError"
                    class="text-center q-pa-lg text-negative"
                  >
                    <q-icon name="error" size="2em" />
                    <div class="q-mt-sm">{{ admxPoliciesError }}</div>
                    <q-btn
                      flat
                      dense
                      color="primary"
                      label="Repeat"
                      @click="loadPoliciesByAdmx(selectedAdmxFile)"
                      class="q-mt-sm"
                    />
                  </div>

                  <div
                    v-else-if="admxPolicies.length === 0"
                    class="text-center q-pa-lg text-grey-6"
                  >
                    <q-icon name="info" size="2em" />
                    <div class="q-mt-sm">There are no policies in this file</div>
                  </div>

                  <div v-else class="admx-policies-grid full-height">
                    <div class="admx-policies-list">
                      <q-card flat bordered class="full-height">
                        <q-card-section>
                          <div class="text-subtitle2 q-mb-md">Policies</div>
                          <q-scroll-area style="height: calc(100vh - 400px)">
                            <q-list separator>
                              <q-item
                                v-for="policy in admxPolicies"
                                :key="policy.id"
                                clickable
                                v-ripple
                                :active="selectedAdmxPolicy?.id === policy.id"
                                @click="onAdmxPolicySelect(policy)"
                                class="q-mb-xs"
                              >
                                <q-item-section>
                                  <q-item-label class="text-weight-medium">
                                    {{ policy.display_name || policy.name }}
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-scroll-area>
                        </q-card-section>
                      </q-card>
                    </div>

                    <div class="admx-policy-details">
                      <q-card flat bordered class="full-height">
                        <q-card-section
                          v-if="selectedAdmxPolicy"
                          class="q-pa-none"
                        >
                          <q-tabs
                            v-model="admxPolicySettingsTab"
                            dense
                            inline-label
                            class="text-grey q-px-md q-pt-md"
                            active-color="primary"
                            indicator-color="primary"
                            align="left"
                            narrow-indicator
                            no-caps
                          >
                            <q-tab
                              name="description"
                              icon="description"
                              label="Description"
                            />
                          </q-tabs>

                          <q-separator class="q-mt-sm" />

                          <q-tab-panels
                            v-model="admxPolicySettingsTab"
                            class="q-mt-md"
                            style="height: calc(100vh - 500px); overflow-y: auto"
                          >
                            <q-tab-panel name="description" class="q-pa-md">
                              <div
                                v-if="loadingAdmxPolicyDetails"
                                class="text-center q-pa-lg"
                              >
                                <q-spinner color="primary" size="2em" />
                                <div class="q-mt-sm">Uploading the description...</div>
                              </div>

                              <div
                                v-else-if="selectedAdmxPolicy"
                                class="policy-description"
                              >
                                <div class="text-h6 q-mb-md">
                                  {{
                                    selectedAdmxPolicy.display_name ||
                                    selectedAdmxPolicy.name
                                  }}
                                </div>

                                <div
                                  v-if="
                                    admxPolicyFullDescription ||
                                    selectedAdmxPolicy.explain_text
                                  "
                                  class="text-body2 text-grey-8 q-mb-md"
                                  style="white-space: normal; line-height: 1.6"
                                >
                                  {{
                                    admxPolicyFullDescription ||
                                    selectedAdmxPolicy.explain_text
                                  }}
                                </div>
                                <div
                                  v-else
                                  class="text-body2 text-grey-5 q-mb-md text-italic"
                                >
                                  The description is missing
                                </div>
                              </div>
                            </q-tab-panel>
                          </q-tab-panels>
                        </q-card-section>

                        <q-card-section v-else class="text-center q-pa-lg text-grey-6">
                          <q-icon name="info" size="3em" />
                          <div class="q-mt-md">Select a policy to configure</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="group.admx_files.length === 0"
              class="text-center q-pa-lg text-grey-6"
            >
              <q-icon name="info" size="3em" class="q-mb-md" />
              <div>There are no ADMX files available in this group.</div>
            </div>
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { notifyError } from "@/utils/notify";
import {
  createGrpcMetadata,
  operator_pb,
  policyCatalogClient,
  policyCatalogServiceClient,
} from "../../api/grpc-client";

interface AdmxFile {
  file: string;
  ui_name: string;
  description: string;
}

interface AdmxGroup {
  group: string;
  ui_name: string;
  description: string;
  admx_files: AdmxFile[];
}

const windowsTab = ref<string>("");
const admxGroups = ref<AdmxGroup[]>([]);
const admxLoading = ref(false);
const selectedAdmxGroup = ref<string | null>(null);
const selectedAdmxFile = ref<string | null>(null);
const selectedAdmxFileGroup = ref<string | null>(null);

interface AdmxPolicy {
  id: string;
  name: string;
  display_name: string;
  explain_text: string;
}

const admxPolicies = ref<AdmxPolicy[]>([]);
const selectedAdmxPolicy = ref<AdmxPolicy | null>(null);
const loadingAdmxPolicies = ref(false);
const admxPoliciesError = ref<string | null>(null);
const admxPolicySettingsTab = ref("description");
const loadingAdmxPolicyDetails = ref(false);

interface PolicyDetailsElement {
  id: number;
  element_id: string;
  type: string;
  display_name?: string;
  description?: string;
  presentation_type?: string;
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
}

const admxPolicyDetailsElements = ref<PolicyDetailsElement[]>([]);
const admxPolicySettingsValues = ref<Record<string, unknown>>({});
const admxPolicyFullDescription = ref<string>("");

async function loadAdmxData() {
  admxLoading.value = true;
  try {
    const lang = "en";
    const fileName = `admx_full_grouped_${lang}.json`;
    const response = await fetch(`/${fileName}`);
    if (!response.ok) {
      const fallbackResponse = await fetch("/admx_full_grouped_en.json");
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load ADMX data: ${response.statusText}`);
      }
      const fallbackData = await fallbackResponse.json();
      admxGroups.value = fallbackData as AdmxGroup[];
    } else {
      const data = await response.json();
      admxGroups.value = data as AdmxGroup[];
    }

    const firstGroupName = admxGroups.value[0]?.group || "";
    if (firstGroupName && !selectedAdmxGroup.value) {
      selectedAdmxGroup.value = firstGroupName;
    }

    if (!windowsTab.value || !windowsTab.value.startsWith("admx-")) {
      if (firstGroupName) {
        windowsTab.value = `admx-${firstGroupName}`;
      }
    }
  } catch {
    notifyError("Data loading error ADMX files");
  } finally {
    admxLoading.value = false;
  }
}

async function loadPoliciesByAdmx(admxFile: string) {
  loadingAdmxPolicies.value = true;
  admxPoliciesError.value = null;
  selectedAdmxPolicy.value = null;
  try {
    const langCode = "en-US";
    const response = await policyCatalogClient.getPoliciesByAdmx(admxFile, langCode);

    const responseObj = response as {
      policiesList?: unknown[];
      policies?: unknown[];
    };
    const policiesList = responseObj.policiesList || responseObj.policies || [];

    admxPolicies.value = [];
    for (const policy of policiesList) {
      if (policy && typeof policy === "object") {
        const p = policy as {
          id?: number | string;
          name?: string;
          display_name?: string;
          displayName?: string;
          explain_text?: string;
          explainText?: string;
        };

        admxPolicies.value.push({
          id: String(p.id || ""),
          name: p.name || "",
          display_name: p.displayName || p.display_name || p.name || "",
          explain_text: p.explainText || p.explain_text || "",
        });
      }
    }
  } catch (error) {
    admxPoliciesError.value = error instanceof Error ? error.message : "Policy loading error";
    admxPolicies.value = [];
  } finally {
    loadingAdmxPolicies.value = false;
  }
}

function onAdmxFileClick(admxFile: string, groupName: string) {
  if (selectedAdmxFile.value !== admxFile || selectedAdmxFileGroup.value !== groupName) {
    selectedAdmxFile.value = admxFile;
    selectedAdmxFileGroup.value = groupName;
    selectedAdmxPolicy.value = null;
    admxPolicies.value = [];
    admxPolicyDetailsElements.value = [];
    admxPolicySettingsValues.value = {};
    admxPolicyFullDescription.value = "";
    loadPoliciesByAdmx(admxFile);
  }
}

async function onAdmxPolicySelect(policy: AdmxPolicy) {
  selectedAdmxPolicy.value = policy;
  admxPolicySettingsTab.value = "description";
  await loadAdmxPolicyDetails(policy);
}

async function loadAdmxPolicyDetails(policy: AdmxPolicy) {
  if (!policy || !policy.id) {
    return;
  }

  loadingAdmxPolicyDetails.value = true;
  admxPolicyDetailsElements.value = [];
  admxPolicySettingsValues.value = {};
  admxPolicyFullDescription.value = "";

  try {
    const policyId = Number.parseInt(policy.id, 10);
    if (Number.isNaN(policyId)) {
      throw new TypeError(`Invalid Policy ID: ${policy.id}`);
    }

    const metadata = createGrpcMetadata();
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode("en-US");

    const response = await policyCatalogServiceClient.getPolicyDetails(
      request,
      metadata,
    );

    if (!response) {
      throw new Error("An empty response from the server");
    }

    admxPolicyFullDescription.value = policy.explain_text || "";

    const policyElementsList = response.getPolicyElementsList?.() || [];

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
          typeof (value as { getValue?: () => unknown }).getValue === "function"
        ) {
          const extracted = (value as { getValue: () => unknown }).getValue();
          return extracted as string | number | boolean | undefined;
        }
        if ("value" in value && (value as { value?: unknown }).value !== undefined) {
          return (value as { value: string | number | boolean }).value;
        }
      }
      return undefined;
    };

    const processedPolicyElements = policyElementsList
      .map((el: unknown) => {
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

          const itemsList = elem.getItemsList?.() || [];
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
                    id: it.getId?.() || 0,
                    name: it.getName?.() || "",
                    display_name: (() => {
                      try {
                        const value = it.getDisplayName?.();
                        return extractWrapperValue(value) as string | undefined;
                      } catch {
                        return undefined;
                      }
                    })(),
                    value_type: it.getValueType?.() || "",
                  };
                } catch {
                  return null;
                }
              }
              return null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .filter((item, index, self) => {
              return (
                index ===
                self.findIndex((t) => t.display_name === item.display_name)
              );
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
        return null;
      })
      .filter((el): el is NonNullable<typeof el> => el !== null);

    const presentation = response.getPresentation?.();
    const presentationMap = new Map<string, { text?: string; type?: string }>();

    if (presentation) {
      const elementsList = presentation.getElementsList?.() || [];
      for (const presEl of elementsList) {
        if (presEl && typeof presEl === "object") {
          const p = presEl as {
            getRefId?: () => string;
            getText?: () => unknown;
            getType?: () => string;
          };
          const refId = p.getRefId?.() || "";
          if (refId) {
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
            presentationMap.set(refId, {
              text: extractStringValue(p.getText?.()),
              type: p.getType?.() || "",
            });
          }
        }
      }
    }

    admxPolicyDetailsElements.value = processedPolicyElements.map((el) => {
      const presentationEl = presentationMap.get(el.element_id);
      return {
        ...el,
        display_name: presentationEl?.text || el.element_id,
        presentation_type: presentationEl?.type || "",
        description: "",
      };
    });

    for (const element of admxPolicyDetailsElements.value) {
      if (!(element.element_id in admxPolicySettingsValues.value)) {
        if (
          (element.type === "list" ||
            element.type === "LIST" ||
            element.type === "List") &&
          (!element.items || element.items.length === 0)
        ) {
          admxPolicySettingsValues.value[element.element_id] = [];
        } else if (
          element.type === "CHECKBOX" ||
          element.type === "BOOL" ||
          element.type === "boolean"
        ) {
          admxPolicySettingsValues.value[element.element_id] = false;
        } else if (
          element.type === "TEXT" ||
          element.type === "STRING" ||
          element.type === "string"
        ) {
          admxPolicySettingsValues.value[element.element_id] = "";
        } else if (
          element.type === "NUMERIC" ||
          element.type === "INT" ||
          element.type === "int" ||
          element.type === "number"
        ) {
          admxPolicySettingsValues.value[element.element_id] =
            element.min_value || 0;
        }
      }
    }
  } catch (error) {
    notifyError("Error uploading policy details");
    console.error("Error loading policy details:", error);
  } finally {
    loadingAdmxPolicyDetails.value = false;
  }
}

function getAdmxGroupIcon(groupName: string): string {
  const iconMap: Record<string, string> = {
    Безопасность: "security",
    Аутентификация: "vpn_key",
    "Сеть и удалённый доступ": "router",
    Обновления: "system_update",
    Интерфейс: "desktop_windows",
    Приложения: "apps",
    Диагностика: "bug_report",
    Хранилище: "storage",
    Система: "computer",

    "Security and Threat Protection": "security",
    "Authentication and Identity": "vpn_key",
    "Networking and Remote Access": "router",
    "Windows Update and Servicing": "system_update",
    "User Interface and Shell": "desktop_windows",
    "Applications and Store": "apps",
    "Diagnostics and Telemetry": "bug_report",
    "Storage and File Systems": "storage",
    "System and Core Components": "computer",
  };

  return iconMap[groupName] || "policy";
}

watch(windowsTab, (newTab) => {
  if (newTab && newTab.startsWith("admx-")) {
    const groupName = newTab.replace("admx-", "");
    if (selectedAdmxFileGroup.value !== groupName) {
      selectedAdmxFile.value = null;
      selectedAdmxFileGroup.value = null;
      selectedAdmxPolicy.value = null;
      admxPolicies.value = [];
      admxPoliciesError.value = null;
    }
  }
});

onMounted(() => {
  loadAdmxData();
});
</script>

<style scoped lang="sass">
.admx-grid-layout
  display: grid
  grid-template-columns: 1fr 2fr
  gap: 16px
  transition: grid-template-columns 0.3s ease

.admx-grid-layout.admx-grid-expanded
  grid-template-columns: 1fr

.admx-files-panel
  min-width: 0

.admx-policies-panel
  min-width: 0

.admx-files-grid
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 12px

.admx-files-grid.admx-files-grid-compact
  grid-template-columns: 1fr

.admx-file-card
  transition: transform 0.2s ease, box-shadow 0.2s ease

.admx-file-card:hover
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.admx-policies-grid
  display: grid
  grid-template-columns: 300px 1fr
  gap: 16px
  height: 100%

.admx-policies-list
  min-width: 0

.admx-policy-details
  min-width: 0
</style>
