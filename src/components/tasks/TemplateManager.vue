<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 90vw; min-height: 80vh">
      <q-bar>
        Templates Manager
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="row q-mb-md">
          <div class="col">
            <q-input
              v-model="filter"
              dense
              outlined
              placeholder="Search templates..."
              debounce="300"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-auto q-ml-md">
            <q-btn
              color="primary"
              icon="add"
              label="Create Template"
              @click="showTemplateForm(null)"
            />
          </div>
        </div>

        <q-table
          :rows="filteredTemplates"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="text-weight-bold">{{ props.row.name }}</div>
              <div class="text-caption text-grey-7">
                {{ props.row.description }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.enabled"
                color="green"
                @update:model-value="toggleEnabled(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions_count="props">
            <q-td :props="props">
              <q-badge
                v-if="getActionsCount(props.row, 'commands') > 0"
                color="blue"
                class="q-mr-xs"
              >
                <q-icon name="terminal" size="xs" class="q-mr-xs" />
                {{ getActionsCount(props.row, "commands") }}
              </q-badge>
              <q-badge
                v-if="getActionsCount(props.row, 'scripts') > 0"
                color="green"
                class="q-mr-xs"
              >
                <q-icon name="article" size="xs" class="q-mr-xs" />
                {{ getActionsCount(props.row, "scripts") }}
              </q-badge>
              <q-badge
                v-if="getActionsCount(props.row, 'software') > 0"
                color="orange"
              >
                <q-icon name="apps" size="xs" class="q-mr-xs" />
                {{ getActionsCount(props.row, "software") }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-created_by="props">
            <q-td :props="props">
              <div>{{ props.row.created_by || "N/A" }}</div>
              <div class="text-caption text-grey-7">
                {{
                  props.row.modified_by
                    ? `Modified: ${props.row.modified_by}`
                    : ""
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="play_arrow"
                color="primary"
                @click="runTemplate(props.row)"
              >
                <q-tooltip>Run Template</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="showTemplateForm(props.row)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="content_copy"
                color="primary"
                @click="cloneTemplate(props.row)"
              >
                <q-tooltip>Clone</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from "vue";
import { useQuasar, useDialogPluginComponent } from "quasar";
import { fetchTemplates, deleteTemplate, patchTemplate } from "@/api/tasks";
import { notifySuccess, notifyError } from "@/utils/notify";
import TemplateForm from "./TemplateForm.vue";
import TemplateRunner from "./TemplateRunner.vue";

export default defineComponent({
  name: "TemplateManager",
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const $q = useQuasar();
    const templates = ref([]);
    const filter = ref("");
    const loading = ref(false);

    const columns = [
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
        sortable: true,
      },
      {
        name: "enabled",
        label: "Enabled",
        field: "enabled",
        align: "center",
        sortable: true,
      },
      {
        name: "actions_count",
        label: "Actions",
        align: "center",
      },
      {
        name: "created_by",
        label: "Created By",
        field: "created_by",
        align: "left",
        sortable: true,
      },
      {
        name: "actions",
        label: "Actions",
        align: "center",
      },
    ];

    const filteredTemplates = computed(() => {
      if (!filter.value) return templates.value;
      const searchLower = filter.value.toLowerCase();
      return templates.value.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower)),
      );
    });

    async function loadTemplates() {
      loading.value = true;
      try {
        const data = await fetchTemplates();
        templates.value = data || [];
      } catch (e) {
        notifyError("Failed to load templates");
      } finally {
        loading.value = false;
      }
    }

    function getActionsCount(template, type) {
      if (!template.actions || !template.actions[type]) return 0;
      return template.actions[type].filter((a) => a.enabled).length;
    }

    async function toggleEnabled(template) {
      try {
        await patchTemplate(template.id, { enabled: template.enabled });
        notifySuccess(`Template ${template.enabled ? "enabled" : "disabled"}`);
      } catch (e) {
        template.enabled = !template.enabled;
        notifyError("Failed to update template");
      }
    }

    function showTemplateForm(template) {
      $q.dialog({
        component: TemplateForm,
        componentProps: {
          template: template,
        },
      }).onOk(() => {
        loadTemplates();
      });
    }

    function runTemplate(template) {
      $q.dialog({
        component: TemplateRunner,
        componentProps: {
          template: template,
        },
      });
    }

    function cloneTemplate(template) {
      const cloned = {
        ...template,
        id: undefined,
        name: `${template.name} (Copy)`,
        created_by: undefined,
        modified_by: undefined,
      };
      showTemplateForm(cloned);
    }

    function confirmDelete(template) {
      $q.dialog({
        title: "Confirm Delete",
        message: `Are you sure you want to delete template "${template.name}"?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await deleteTemplate(template.id);
          notifySuccess("Template deleted successfully");
          loadTemplates();
        } catch (e) {
          notifyError("Failed to delete template");
        }
      });
    }

    onMounted(() => {
      loadTemplates();
    });

    return {
      dialogRef,
      onDialogHide,
      templates,
      filter,
      loading,
      columns,
      filteredTemplates,
      getActionsCount,
      toggleEnabled,
      showTemplateForm,
      runTemplate,
      cloneTemplate,
      confirmDelete,
    };
  },
});
</script>

