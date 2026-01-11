<template>
  <div class="gpo-policies-manager">
    <q-card>
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">Управление политиками GPO</div>
          <q-btn
            color="primary"
            icon="add"
            label="Создать политику"
            @click="showCreateDialog = true"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-tabs v-model="activeTab" class="text-primary">
          <q-tab name="tree" label="Дерево политик" icon="account_tree" />
          <q-tab name="list" label="Список политик" icon="list" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tree">
            <div v-if="treeStore.isLoading.value" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md">Загрузка дерева политик...</div>
            </div>
            <div v-else-if="treeStore.isError.value" class="text-center q-pa-lg">
              <q-icon name="error" color="negative" size="3em" />
              <div class="q-mt-md text-negative">
                Ошибка загрузки дерева политик
              </div>
              <div v-if="treeStore.errorMessage.value" class="q-mt-sm text-caption">
                {{ treeStore.errorMessage.value }}
              </div>
              <q-btn
                flat
                color="primary"
                label="Повторить"
                @click="treeStore.fetchPolicyTree()"
                class="q-mt-md"
              />
            </div>
            <GPOPolicyTree
              v-else-if="treeStore.tree.value"
              :tree="treeStore.tree.value"
              @edit-policy="onEditPolicy"
              @delete-policy="onDeletePolicy"
            />
            <div v-else class="text-center q-pa-lg text-grey-6">
              Дерево политик пусто
            </div>
          </q-tab-panel>

          <q-tab-panel name="list">
            <div class="table-container">
              <q-table
                :rows="policiesStore.policies.value"
                :columns="columns"
                row-key="id"
                :loading="policiesStore.isLoading.value"
                :filter="filter"
                @request="onRequest"
              >
                <template v-slot:top>
                  <q-input
                    v-model="filter"
                    placeholder="Поиск..."
                    dense
                    outlined
                    class="col-4"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      round
                      icon="edit"
                      @click="onEditPolicy(props.row)"
                      class="q-mr-xs"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="onDeletePolicy(props.row)"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-enabled="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.value ? 'positive' : 'negative'"
                      :label="props.value ? 'Включена' : 'Отключена'"
                    />
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>


    <GPOPolicyForm
      v-model="showCreateDialog"
      :policy="selectedPolicy"
      :is-loading="policiesStore.isLoading.value"
      @submit="onSubmitPolicy"
    />


    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Удалить политику?</span>
        </q-card-section>

        <q-card-section v-if="selectedPolicy">
          Политика:
          <strong>{{
            selectedPolicy.displayName || selectedPolicy.name
          }}</strong>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn
            flat
            label="Удалить"
            color="negative"
            @click="confirmDelete"
            :loading="policiesStore.isLoading.value"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { QTableColumn } from "quasar";
import { useGPOPolicies, useGPOPolicyTree } from "../api/gpo";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import GPOPolicyTree from "./GPOPolicyTree.vue";
import GPOPolicyForm from "./GPOPolicyForm.vue";

const policiesStore = useGPOPolicies();
const treeStore = useGPOPolicyTree();

const activeTab = ref("tree");
const filter = ref("");
const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedPolicy = ref<GPOPolicy | undefined>(undefined);

const columns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Отображаемое имя",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "path",
    label: "Путь",
    align: "left",
    field: "path",
  },
  {
    name: "enabled",
    label: "Статус",
    align: "center",
    field: "enabled",
  },
  {
    name: "actions",
    label: "Действия",
    align: "center",
    field: "actions",
  },
];

onMounted(async () => {
  try {
    await Promise.all([
      policiesStore.fetchPolicies(),
      treeStore.fetchPolicyTree(),
    ]);
  } catch (error) {
    console.error("Failed to load GPO data:", error);
  }
});

const onRequest = async () => {
  await policiesStore.fetchPolicies();
};

const onEditPolicy = (policy: GPOPolicy) => {
  selectedPolicy.value = policy;
  showCreateDialog.value = true;
};

const onDeletePolicy = (policy: GPOPolicy) => {
  selectedPolicy.value = policy;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!selectedPolicy.value) return;

  try {
    await policiesStore.deletePolicy(selectedPolicy.value.id);
    showDeleteDialog.value = false;
    selectedPolicy.value = undefined;
    await treeStore.fetchPolicyTree();
  } catch (error) {
    console.error("Failed to delete policy:", error);
  }
};

const onSubmitPolicy = async (
  data: CreateGPOPolicyRequest | UpdateGPOPolicyRequest,
) => {
  try {
    if (selectedPolicy.value) {
      await policiesStore.updatePolicy(selectedPolicy.value.id, data);
    } else {
      await policiesStore.createPolicy(data as CreateGPOPolicyRequest);
    }
    showCreateDialog.value = false;
    selectedPolicy.value = undefined;
    await treeStore.fetchPolicyTree();
  } catch (error) {
    console.error("Failed to save policy:", error);
  }
};
</script>

<style scoped lang="sass">
.gpo-policies-manager
  padding: 16px

.table-container
  max-height: 600px
  overflow-y: auto
  overflow-x: hidden
</style>
