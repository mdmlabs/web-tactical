<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 50vw">
      <q-bar>
        Run Template: {{ template.name }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6 q-mb-md">{{ template.name }}</div>
        <div class="text-body2 text-grey-7 q-mb-md">
          {{ template.description }}
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle2 q-mb-sm">Actions to Execute:</div>

        <div v-if="enabledCommands.length > 0">
          <div class="text-weight-bold q-mb-xs">
            <q-icon name="terminal" color="blue" />
            Commands ({{ enabledCommands.length }})
          </div>
          <q-list dense bordered class="q-mb-md">
            <q-item
              v-for="(cmd, index) in enabledCommands"
              :key="'cmd-' + index"
            >
              <q-item-section avatar>
                <q-icon name="chevron_right" color="blue" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ cmd.cmd }}</q-item-label>
                <q-item-label caption>
                  Shell: {{ cmd.shell }} | Timeout: {{ cmd.timeout }}s
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-if="enabledScripts.length > 0">
          <div class="text-weight-bold q-mb-xs">
            <q-icon name="article" color="green" />
            Scripts ({{ enabledScripts.length }})
          </div>
          <q-list dense bordered class="q-mb-md">
            <q-item
              v-for="(script, index) in enabledScripts"
              :key="'script-' + index"
            >
              <q-item-section avatar>
                <q-icon name="chevron_right" color="green" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Script ID: {{ script.script }}</q-item-label>
                <q-item-label caption>
                  Timeout: {{ script.timeout }}s
                  <span v-if="script.args && script.args.length > 0">
                    | Args: {{ script.args.join(", ") }}
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-if="enabledSoftware.length > 0">
          <div class="text-weight-bold q-mb-xs">
            <q-icon name="apps" color="orange" />
            Software ({{ enabledSoftware.length }})
          </div>
          <q-list dense bordered class="q-mb-md">
            <q-item
              v-for="(soft, index) in enabledSoftware"
              :key="'soft-' + index"
            >
              <q-item-section avatar>
                <q-icon name="chevron_right" color="orange" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ soft.software.join(", ") }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle2 q-mb-sm">Target Override (Optional):</div>

        <q-option-group
          v-model="runTarget"
          :options="targetOptions"
          color="primary"
          dense
          inline
          class="q-pl-sm q-mb-md"
        />

        <tactical-dropdown
          v-if="runTarget === 'client'"
          v-model="selectedClient"
          :options="clientOptions"
          label="Select Client"
          outlined
          mapOptions
          filterable
          class="q-mb-md"
        />
        <tactical-dropdown
          v-else-if="runTarget === 'site'"
          v-model="selectedSite"
          :options="siteOptions"
          label="Select Site"
          outlined
          mapOptions
          filterable
          class="q-mb-md"
        />
        <tactical-dropdown
          v-else-if="runTarget === 'agents'"
          v-model="selectedAgents"
          :options="agentOptions"
          label="Select Agents"
          filled
          multiple
          mapOptions
          filterable
          class="q-mb-md"
        />

        <div class="text-caption text-grey-7">
          Leave default to use template's original target settings
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" v-close-popup />
        <q-btn
          label="Run Template"
          color="primary"
          icon="play_arrow"
          @click="run"
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useAgentDropdown } from "@/composables/agents";
import { useClientDropdown, useSiteDropdown } from "@/composables/clients";
import { runTemplate } from "@/api/tasks";
import { notifySuccess } from "@/utils/notify";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";

const targetOptions = [
  { label: "Use Template Default", value: "default" },
  { label: "Client", value: "client" },
  { label: "Site", value: "site" },
  { label: "Selected Agents", value: "agents" },
  { label: "All", value: "all" },
];

export default defineComponent({
  name: "TemplateRunner",
  components: { TacticalDropdown },
  props: {
    template: {
      type: Object,
      required: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    const loading = ref(false);
    const runTarget = ref("default");
    const selectedClient = ref(null);
    const selectedSite = ref(null);
    const selectedAgents = ref([]);

    const { agentOptions, getAgentOptions } = useAgentDropdown();
    const { siteOptions, getSiteOptions } = useSiteDropdown();
    const { clientOptions, getClientOptions } = useClientDropdown();

    const enabledCommands = computed(() => {
      return props.template.actions?.commands?.filter((c) => c.enabled) || [];
    });

    const enabledScripts = computed(() => {
      return props.template.actions?.scripts?.filter((s) => s.enabled) || [];
    });

    const enabledSoftware = computed(() => {
      return props.template.actions?.software?.filter((s) => s.enabled) || [];
    });

    async function run() {
      loading.value = true;
      try {
        const payload = {};

        if (runTarget.value !== "default") {
          payload.target = runTarget.value;

          if (runTarget.value === "client" && selectedClient.value) {
            payload.client = selectedClient.value;
          } else if (runTarget.value === "site" && selectedSite.value) {
            payload.site = selectedSite.value;
          } else if (
            runTarget.value === "agents" &&
            selectedAgents.value.length > 0
          ) {
            payload.agents = selectedAgents.value;
          }
        }

        await runTemplate(props.template.id, payload);
        notifySuccess(`Template "${props.template.name}" is running`);
        onDialogOK();
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      getAgentOptions();
      getSiteOptions();
      getClientOptions();
    });

    return {
      dialogRef,
      onDialogHide,
      loading,
      runTarget,
      selectedClient,
      selectedSite,
      selectedAgents,
      targetOptions,
      agentOptions,
      siteOptions,
      clientOptions,
      enabledCommands,
      enabledScripts,
      enabledSoftware,
      run,
    };
  },
});
</script>
