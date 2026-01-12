<template>
  <q-dialog
    v-model="dialogVisible"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="applied-policies-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Applied Policies</div>
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
          <q-tab name="all" icon="list" label="All Policies" />
          <q-tab name="users" icon="people" label="By Users" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="dialogTab" class="q-mt-md">
          <q-tab-panel name="all" class="q-pa-none">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Loading applied policies...</div>
            </div>

            <div
              v-else-if="appliedPolicies.length === 0"
              class="text-center q-pa-lg text-grey-6"
            >
              <q-icon name="info" size="3em" class="q-mb-md" />
              <div>No applied policies</div>
              <div class="text-caption q-mt-sm">
                Apply policies through the "Apply Policy" dialog
              </div>
            </div>

            <div v-else>
              <q-table
                :rows="appliedPolicies"
                :columns="policyColumns"
                row-key="id"
                flat
                bordered
                :loading="loading"
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.value ? 'positive' : 'negative'"
                      :label="props.value ? 'Enabled' : 'Disabled'"
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click="removePolicy(props.row)"
                    >
                      <q-tooltip>Remove application</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="users" class="q-pa-none">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Loading...</div>
            </div>

            <div v-else>
              <q-expansion-item
                v-for="(userPolicies, userId) in policiesByUser"
                :key="userId"
                :label="getUserName(userId)"
                :caption="`${userPolicies.length} policies`"
                icon="person"
                class="q-mb-sm"
              >
                <q-card flat bordered>
                  <q-card-section>
                    <q-list separator>
                      <q-item v-for="policy in userPolicies" :key="policy.id">
                        <q-item-section>
                          <q-item-label>{{
                            policy.displayName || policy.name
                          }}</q-item-label>
                          <q-item-label caption v-if="policy.description">
                            {{ policy.description }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-badge
                            :color="policy.enabled ? 'positive' : 'negative'"
                            :label="policy.enabled ? 'Enabled' : 'Disabled'"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <div
                v-if="Object.keys(policiesByUser).length === 0"
                class="text-center q-pa-lg text-grey-6"
              >
                <q-icon name="info" size="2em" />
                <div class="q-mt-sm">No policies by users</div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Close"
          color="primary"
          @click="dialogVisible = false"
        />
        <q-btn
          flat
          label="Refresh"
          color="primary"
          icon="refresh"
          @click="loadAppliedPolicies"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { notifySuccess, notifyError } from "@/utils/notify";
import { QTableColumn } from "quasar";
import type { GPOPolicy } from "../types/gpo";
import {
  policyAssignmentClient,
  policyCatalogClient,
} from "../api/grpc-client";

interface Agent {
  id: string;
  hostname: string;
  status: string;
}

interface AppliedPolicy extends GPOPolicy {
  appliedDate?: string;
  userId?: string;
  userName?: string;
  policyHash?: string;
}

const props = defineProps<{
  modelValue: boolean;
  agent: Agent | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dialogTab = ref("all");
const loading = ref(false);
const appliedPolicies = ref<AppliedPolicy[]>([]);

const policyColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Policy Name",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: "enabled",
    sortable: true,
  },
  {
    name: "appliedDate",
    label: "Applied Date",
    align: "left",
    field: "appliedDate",
    format: (val: string) =>
      val ? new Date(val).toLocaleString("en-US") : "N/A",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

const policiesByUser = computed(() => {
  const grouped: Record<string, AppliedPolicy[]> = {};
  for (const policy of appliedPolicies.value) {
    const userId = policy.userId || "all";
    if (!grouped[userId]) {
      grouped[userId] = [];
    }
    grouped[userId].push(policy);
  }
  return grouped;
});

watch(dialogVisible, (newVal) => {
  if (newVal && props.agent) {
    loadAppliedPolicies();
  }
});

function getUserName(userId: string): string {
  if (userId === "all") {
    return "All Users";
  }
  // TODO: Get user name from user list
  return userId;
}

async function loadAppliedPolicies() {
  if (!props.agent) return;

  loading.value = true;
  try {
    // TODO: implement API call GetEffectivePolicies or GetAssignments
    // using a stub for now
    // type of loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    // data stub
    appliedPolicies.value = [];

    console.log(
      "[AppliedPoliciesDialog] Loading applied policies for agent:",
      props.agent.id,
    );
  } catch (error) {
    console.error(
      "[AppliedPoliciesDialog] Error loading applied policies:",
      error,
    );
    notifyError("Error loading applied policies");
  } finally {
    loading.value = false;
  }
}

async function removePolicy(policy: AppliedPolicy) {
  if (!props.agent) return;

  try {
    let policyHash = policy.policyHash;

    if (!policyHash) {
      const policyId = Number.parseInt(policy.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Неверный ID политики: ${policy.id}`);
      }

      const policyDetails = await policyCatalogClient.getPolicyDetails(
        policyId,
        "en-US",
      );
      policyHash = (policyDetails.policy?.hash as string) || "";

      if (!policyHash) {
        throw new Error("Policy hash not found. Failed to get policy details.");
      }
    }

    const targetType = policy.userId ? "user" : "agent";
    const targetParams = policy.userId
      ? { agentId: props.agent.id, userSid: policy.userId }
      : { agentId: props.agent.id };

    await policyAssignmentClient.removePolicy(
      policyHash,
      targetType,
      targetParams,
    );

    appliedPolicies.value = appliedPolicies.value.filter(
      (p) => p.id !== policy.id,
    );

    notifySuccess("Policy application removed");
  } catch (error) {
    console.error(
      "[AppliedPoliciesDialog] Ошибка удаления применения политики:",
      error,
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error removing policy application";
    notifyError(`Error removing policy application: ${errorMessage}`);
  }
}
</script>

<style scoped lang="sass">
.applied-policies-dialog
  min-width: 800px
  max-width: 1200px
</style>
