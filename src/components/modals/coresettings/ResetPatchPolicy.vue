<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 40vw">
      <q-bar>
        Reset Agent Patch Policy
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="text-subtitle3">
        Reset the patch policies for agents in a specific site. You
        can also leave the site blank to reset the patch policy for
        all agents. (This might take a while)
      </q-card-section>

      <q-card-section>
        <q-option-group
          v-model="target"
          :options="targetOptions"
          color="primary"
          inline
          dense
        />
      </q-card-section>

      <q-form @submit="submit">
        <q-card-section v-if="target == 'site'">
          <tactical-dropdown
            :rules="[(val) => !!val || '*Required']"
            label="Sites"
            mapOptions
            filterable
            clearable
            outlined
            v-model="state.site"
            :options="siteOptions"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat push dense label="Cancel" v-close-popup />
          <q-btn
            :loading="loading"
            flat
            dense
            push
            :label="
              target == 'all'
                ? 'Clear Policies for ALL Agents'
                : 'Clear Policies'
            "
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
import { ref, watch } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useSiteDropdown } from "@/composables/clients";
import { sendPatchPolicyReset } from "@/api/automation";
import { notifySuccess } from "@/utils/notify";

//ui imports
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";

// static data
const targetOptions = [
  { label: "All", value: "all" },
  { label: "Site", value: "site" },
];

export default {
  name: "ResetPatchPolicy",
  components: {
    TacticalDropdown,
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    // setup quasar dialog plugin
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    // setup dropdowns
    const { site, siteOptions } = useSiteDropdown(true);

    // reset patch policy logic
    const state = ref({
      site: site,
    });

    const target = ref("all");
    const loading = ref(false);

    watch(target, () => {
      state.value.site = null;
    });

    async function submit() {
      loading.value = true;
      try {
        const data = {};
        if (target.value === "site") data.site = state.value.site;

        const result = await sendPatchPolicyReset(data);
        notifySuccess(result);
        onDialogOK();
      } catch (e) {
        console.error(e);
      }
      loading.value = false;
    }

    return {
      // reactive data
      state,
      target,
      loading,

      // non-reactive data
      targetOptions,
      siteOptions,

      // methods
      submit,

      // quasar dialog
      dialogRef,
      onDialogHide,
    };
  },
};
</script>
