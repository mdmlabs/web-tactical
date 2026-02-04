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
                <q-item-label>{{ cmd.command }}</q-item-label>
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
                  <span
                    v-if="script.script_args && script.script_args.length > 0"
                  >
                    | Args: {{ script.script_args.join(", ") }}
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
                <q-item-label>{{ soft.choco_prog_name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
import { ref, computed, defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";
import { runTemplate } from "@/api/tasks";
import { notifySuccess, notifyError } from "@/utils/notify";

export default defineComponent({
  name: "TemplateRunner",
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

    const enabledCommands = computed(() => {
      if (!props.template.actions || !Array.isArray(props.template.actions)) {
        return [];
      }
      return props.template.actions.filter((a) => a.type === "cmd");
    });

    const enabledScripts = computed(() => {
      if (!props.template.actions || !Array.isArray(props.template.actions)) {
        return [];
      }
      return props.template.actions.filter((a) => a.type === "script");
    });

    const enabledSoftware = computed(() => {
      if (!props.template.actions || !Array.isArray(props.template.actions)) {
        return [];
      }
      return props.template.actions.filter((a) => a.type === "software");
    });

    async function run() {
      loading.value = true;
      try {
        await runTemplate(props.template.id);
        notifySuccess(`Template "${props.template.name}" is running`);
        onDialogOK();
      } catch (e) {
        console.error(e);
        notifyError(e?.response?.data?.detail || "Failed to run template");
      } finally {
        loading.value = false;
      }
    }

    return {
      dialogRef,
      onDialogHide,
      loading,
      enabledCommands,
      enabledScripts,
      enabledSoftware,
      run,
    };
  },
});
</script>
