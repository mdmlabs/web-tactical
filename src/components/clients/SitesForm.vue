<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 60vw">
      <q-bar>
        {{ !!site ? `Editing ${site.name}` : "Adding Category" }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-form @submit="submit">
        <q-card-section>
          <q-input
            :rules="[(val) => !!val || 'Name is required']"
            outlined
            dense
            v-model="state.name"
            label="Name"
            autofocus
          />
        </q-card-section>
        <q-card-section>
          <tactical-dropdown
            v-model="state.parent"
            label="Parent Category"
            :options="parentSiteOptions"
            outlined
            mapOptions
            clearable
            filterable
            hint="Leave empty for root-level category"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            dense
            v-model="state.description"
            label="Description"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            dense
            type="number"
            v-model.number="state.max_agents"
            label="Max Agents"
            :min="0"
          />
        </q-card-section>
        <q-card-section>
          <OsVersionSelect
            v-model="state.os_version"
          />
        </q-card-section>

        <div class="q-pl-sm text-h6" v-if="customFields.length > 0">
          Custom Fields
        </div>
        <q-card-section v-for="field in customFields" :key="field.id">
          <CustomField v-model="custom_fields[field.name]" :field="field" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn dense flat push label="Cancel" v-close-popup />
          <q-btn
            :loading="loading"
            dense
            flat
            push
            label="Save"
            color="primary"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
// composition imports
import { ref, onMounted } from "vue";
import { useQuasar, useDialogPluginComponent } from "quasar";
import { useParentSiteDropdown } from "@/composables/clients";
import { fetchSite, saveSite, editSite } from "@/api/clients";
import { fetchCustomFields } from "@/api/core";
import { formatCustomFields } from "@/utils/format";
import { notifySuccess } from "@/utils/notify";

// ui imports
import CustomField from "@/components/ui/CustomField.vue";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";
import OsVersionSelect from "@/components/ui/OsVersionSelect.vue";

export default {
  name: "SitesForm",
  emits: [...useDialogPluginComponent.emits],
  components: {
    CustomField,
    TacticalDropdown,
    OsVersionSelect,
  },
  props: {
    site: Object,
    parent: Number,
  },
  setup(props) {
    // setup quasar dialog
    const $q = useQuasar();
    const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

    // setup dropdowns
    const { parentSiteOptions } = useParentSiteDropdown(true);

    // sites for logic
    const state = !!props.site
      ? ref(Object.assign({ max_agents: 0, os_version: "" }, props.site))
      : ref({
          parent: props.parent || null,
          name: "",
          description: "",
          max_agents: 0,
          os_version: "",
        });
    const custom_fields = ref({});
    const customFields = ref([]);
    const loading = ref(false);

    async function submit() {
      loading.value = true;
      const parentOption =
        parentSiteOptions.value.find((o) => o.value === state.value.parent) ||
        parentSiteOptions.value.find((o) => o.id === state.value.parent);
      const data = {
        site: {
          name: state.value.name,
          description: state.value.description || "",
          parent: parentOption?.value ?? null,
          max_agents: state.value.max_agents ?? 0,
          os_version: (state.value.os_version ?? "").trim() || null,
        },
        custom_fields: formatCustomFields(
          customFields.value,
          custom_fields.value,
        ),
      };
      try {
        const result = !!props.site
          ? await editSite(props.site.master_id, data)
          : await saveSite(data);
        notifySuccess(result);
        onDialogOK();
      } catch (e) {
        console.error(e);
      }
      loading.value = false;
    }

    async function getSiteCustomFieldValues() {
      loading.value = true;
      const data = await fetchSite(props.site.master_id);
      if (data.name != null) state.value.name = data.name;
      if (data.description != null) state.value.description = data.description;
      if (data.parent != null) state.value.parent = data.parent;
      if (data.max_agents != null) state.value.max_agents = data.max_agents;
      state.value.os_version = data.os_version ?? "";

      for (let field of customFields.value) {
        const value = data.custom_fields.find(
          (value) => value.field === field.id,
        );

        if (field.type === "multiple") {
          if (value) custom_fields.value[field.name] = value.value;
          else custom_fields.value[field.name] = [];
        } else if (field.type === "checkbox") {
          if (value) custom_fields.value[field.name] = value.value;
          else custom_fields.value[field.name] = false;
        } else {
          if (value) custom_fields.value[field.name] = value.value;
          else custom_fields.value[field.name] = "";
        }
      }
      loading.value = false;
    }

    onMounted(async () => {
      $q.loading.show();
      try {
        const fields = await fetchCustomFields({ model: "site" });
        customFields.value = fields.filter((field) => !field.hide_in_ui);
        if (props.site) getSiteCustomFieldValues();
      } catch (e) {
        console.error(e);
      }
      $q.loading.hide();
    });

    return {
      // reactive data
      state,
      loading,
      custom_fields,
      customFields,
      parentSiteOptions,

      // methods
      submit,

      // quasar dialog
      dialogRef,
      onDialogHide,
    };
  },
};
</script>
