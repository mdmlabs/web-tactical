<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 70vw; max-height: 90vh">
      <q-bar>
        {{ isEdit ? "Edit Template" : "Create Template" }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-form @submit.prevent="submit">
        <q-card-section style="max-height: 70vh" class="scroll">
          <q-expansion-item
            v-model="expanded.basic"
            icon="info"
            label="Basic Information"
            header-class="bg-primary text-white"
            expand-icon-class="text-white"
            default-opened
          >
            <q-card>
              <q-card-section>
                <q-input
                  v-model="state.name"
                  label="Template Name"
                  outlined
                  :rules="[(val) => !!val || '*Required']"
                  class="q-mb-md"
                />
                <q-input
                  v-model="state.description"
                  label="Description"
                  outlined
                  type="textarea"
                  rows="3"
                  class="q-mb-md"
                />
                <div class="row q-gutter-md">
                  <q-checkbox
                    v-model="state.enabled"
                    label="Enabled"
                    color="primary"
                  />
                  <q-checkbox
                    v-model="state.continue_on_error"
                    label="Continue on Error"
                    color="primary"
                  />
                  <q-checkbox
                    v-model="state.collector_all_output"
                    label="Collect All Output"
                    color="primary"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-model="expanded.target"
            icon="gps_fixed"
            label="Target Settings"
            header-class="bg-primary text-white"
            expand-icon-class="text-white"
            class="q-mt-md"
          >
            <q-card>
              <q-card-section>
                <p class="text-subtitle2">Choose Target</p>
                <q-option-group
                  v-model="state.target"
                  :options="targetOptions"
                  color="primary"
                  dense
                  inline
                  class="q-pl-sm q-mb-md"
                />

                <tactical-dropdown
                  v-if="state.target === 'client'"
                  :rules="[(val) => !!val || '*Required']"
                  v-model="state.client"
                  :options="clientOptions"
                  label="Select Client"
                  outlined
                  mapOptions
                  filterable
                  class="q-mb-md"
                />
                <tactical-dropdown
                  v-else-if="state.target === 'site'"
                  :rules="[(val) => !!val || '*Required']"
                  v-model="state.site"
                  :options="siteOptions"
                  label="Select Site"
                  outlined
                  mapOptions
                  filterable
                  class="q-mb-md"
                />
                <tactical-dropdown
                  v-else-if="state.target === 'agents'"
                  :rules="[(val) => !!val || '*Required']"
                  v-model="state.agents"
                  :options="agentOptions"
                  label="Select Agents"
                  filled
                  multiple
                  mapOptions
                  filterable
                  class="q-mb-md"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-model="expanded.commands"
            icon="terminal"
            label="Commands"
            header-class="bg-blue text-white"
            expand-icon-class="text-white"
            class="q-mt-md"
          >
            <q-card>
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col text-subtitle2">Command Actions</div>
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Add Command"
                      size="sm"
                      @click="addCommand"
                    />
                  </div>
                </div>

                <div
                  v-for="(cmd, index) in state.actions.commands"
                  :key="'cmd-' + index"
                  class="q-mb-md q-pa-md"
                  style="border: 1px solid #e0e0e0; border-radius: 4px"
                >
                  <div class="row items-center q-mb-sm">
                    <q-checkbox
                      v-model="cmd.enabled"
                      label="Enabled"
                      color="primary"
                    />
                    <q-space />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="removeCommand(index)"
                    >
                      <q-tooltip>Remove</q-tooltip>
                    </q-btn>
                  </div>

                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-select
                        v-model="cmd.shell"
                        :options="shellOptions"
                        label="Shell"
                        outlined
                        dense
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="col-6" v-if="cmd.shell === 'custom'">
                      <q-input
                        v-model="cmd.custom_shell"
                        label="Custom Shell"
                        outlined
                        dense
                        placeholder="/usr/bin/python3"
                      />
                    </div>
                  </div>

                  <q-input
                    v-model="cmd.cmd"
                    label="Command"
                    outlined
                    dense
                    class="q-mt-sm"
                    :placeholder="cmdPlaceholder(cmd.shell)"
                  />

                  <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-6">
                      <q-input
                        v-model.number="cmd.timeout"
                        label="Timeout (seconds)"
                        outlined
                        dense
                        type="number"
                        :rules="[(val) => val >= 5 || 'Min 5 seconds']"
                      />
                    </div>
                    <div class="col-6">
                      <q-checkbox
                        v-model="cmd.run_as_user"
                        label="Run As User"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-if="
                    !state.actions.commands ||
                    state.actions.commands.length === 0
                  "
                  class="text-center text-grey-7 q-pa-md"
                >
                  No commands added yet
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-model="expanded.scripts"
            icon="article"
            label="Scripts"
            header-class="bg-green text-white"
            expand-icon-class="text-white"
            class="q-mt-md"
          >
            <q-card>
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col text-subtitle2">Script Actions</div>
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Add Script"
                      size="sm"
                      @click="addScript"
                    />
                  </div>
                </div>

                <div
                  v-for="(script, index) in state.actions.scripts"
                  :key="'script-' + index"
                  class="q-mb-md q-pa-md"
                  style="border: 1px solid #e0e0e0; border-radius: 4px"
                >
                  <div class="row items-center q-mb-sm">
                    <q-checkbox
                      v-model="script.enabled"
                      label="Enabled"
                      color="primary"
                    />
                    <q-space />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="removeScript(index)"
                    >
                      <q-tooltip>Remove</q-tooltip>
                    </q-btn>
                  </div>

                  <tactical-dropdown
                    v-model="script.script"
                    :options="scriptOptions"
                    label="Select Script"
                    outlined
                    mapOptions
                    filterable
                    class="q-mb-sm"
                  />

                  <tactical-dropdown
                    v-model="script.args"
                    label="Script Arguments (press Enter after typing)"
                    filled
                    use-input
                    multiple
                    hide-dropdown-icon
                    input-debounce="0"
                    new-value-mode="add"
                    class="q-mb-sm"
                  />

                  <tactical-dropdown
                    v-model="script.env_vars"
                    label="Environment Variables (KEY=value)"
                    filled
                    use-input
                    multiple
                    hide-dropdown-icon
                    input-debounce="0"
                    new-value-mode="add"
                    class="q-mb-sm"
                  />

                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-input
                        v-model.number="script.timeout"
                        label="Timeout (seconds)"
                        outlined
                        dense
                        type="number"
                        :rules="[(val) => val >= 5 || 'Min 5 seconds']"
                      />
                    </div>
                    <div class="col-6">
                      <q-checkbox
                        v-model="script.run_as_user"
                        label="Run As User"
                        color="primary"
                      />
                    </div>
                  </div>

                  <div class="q-mt-sm">
                    <q-checkbox
                      v-model="script.save_to_custom_field"
                      label="Save to Custom Field"
                      color="primary"
                    />
                    <q-checkbox
                      v-model="script.save_to_agent_note"
                      label="Save to Agent Note"
                      color="primary"
                      class="q-ml-md"
                    />
                  </div>

                  <tactical-dropdown
                    v-if="script.save_to_custom_field"
                    v-model="script.custom_field"
                    :options="customFieldOptions"
                    label="Select Custom Field"
                    outlined
                    mapOptions
                    filterable
                    class="q-mt-sm"
                  />

                  <q-checkbox
                    v-if="script.save_to_custom_field"
                    v-model="script.collector_all_output"
                    label="Collect All Output"
                    color="primary"
                    class="q-mt-sm"
                  />
                </div>

                <div
                  v-if="
                    !state.actions.scripts || state.actions.scripts.length === 0
                  "
                  class="text-center text-grey-7 q-pa-md"
                >
                  No scripts added yet
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            v-model="expanded.software"
            icon="apps"
            label="Software"
            header-class="bg-orange text-white"
            expand-icon-class="text-white"
            class="q-mt-md"
          >
            <q-card>
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col text-subtitle2">Software Installation</div>
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Add Software"
                      size="sm"
                      @click="addSoftware"
                    />
                  </div>
                </div>

                <div
                  v-for="(soft, index) in state.actions.software"
                  :key="'soft-' + index"
                  class="q-mb-md q-pa-md"
                  style="border: 1px solid #e0e0e0; border-radius: 4px"
                >
                  <div class="row items-center q-mb-sm">
                    <q-checkbox
                      v-model="soft.enabled"
                      label="Enabled"
                      color="primary"
                    />
                    <q-space />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="removeSoftware(index)"
                    >
                      <q-tooltip>Remove</q-tooltip>
                    </q-btn>
                  </div>

                  <tactical-dropdown
                    v-model="soft.software"
                    :options="softwareOptions"
                    label="Select Software Packages"
                    outlined
                    multiple
                    mapOptions
                    filterable
                  />
                </div>

                <div
                  v-if="
                    !state.actions.software ||
                    state.actions.software.length === 0
                  "
                  class="text-center text-grey-7 q-pa-md"
                >
                  No software packages added yet
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancel" v-close-popup />
          <q-btn
            label="Save Template"
            color="primary"
            type="submit"
            :loading="loading"
            :disable="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed, onMounted, defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useScriptDropdown } from "@/composables/scripts";
import { useAgentDropdown, cmdPlaceholder } from "@/composables/agents";
import { useClientDropdown, useSiteDropdown } from "@/composables/clients";
import { useCustomFieldDropdown } from "@/composables/core";
import { createTemplate, updateTemplate } from "@/api/tasks";
import { fetchChocosSoftware } from "@/api/software";
import { notifySuccess, notifyError } from "@/utils/notify";
import TacticalDropdown from "@/components/ui/TacticalDropdown.vue";

const targetOptions = [
  { label: "Client", value: "client" },
  { label: "Site", value: "site" },
  { label: "Selected Agents", value: "agents" },
  { label: "All", value: "all" },
];

const shellOptions = [
  { label: "CMD", value: "cmd" },
  { label: "Powershell", value: "powershell" },
];

export default defineComponent({
  name: "TemplateForm",
  components: { TacticalDropdown },
  props: {
    template: Object,
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    const isEdit = computed(() => !!props.template?.id);

    const expanded = reactive({
      basic: true,
      target: false,
      commands: false,
      scripts: false,
      software: false,
    });

    function parseActionsFromBackend(actions) {
      const result = {
        commands: [],
        scripts: [],
        software: [],
      };

      if (!actions || !Array.isArray(actions)) {
        return result;
      }

      actions.forEach((action) => {
        if (action.type === "cmd") {
          result.commands.push({
            enabled: true,
            osType: "windows",
            shell: action.shell || "cmd",
            custom_shell: action.custom_shell || null,
            cmd: action.command || "",
            timeout: action.timeout || 120,
            run_as_user: action.run_as_user || false,
          });
        } else if (action.type === "script") {
          result.scripts.push({
            enabled: true,
            script: action.script,
            args: action.script_args || [],
            env_vars: action.env_vars || [],
            timeout: action.timeout || 300,
            run_as_user: action.run_as_user || false,
            save_to_custom_field: action.save_to_custom_field || false,
            custom_field: action.custom_field || null,
            collector_all_output: action.collector_all_output || false,
            save_to_agent_note: action.save_to_agent_note || false,
          });
        } else if (action.type === "software") {
          const existingSoft = result.software.find((s) => s.enabled);
          if (existingSoft) {
            if (action.choco_prog_name) {
              existingSoft.software.push(action.choco_prog_name);
            }
          } else {
            result.software.push({
              enabled: true,
              software: action.choco_prog_name ? [action.choco_prog_name] : [],
            });
          }
        }
      });

      return result;
    }

    function determineTarget(template) {
      if (!template) return "client";

      if (template.agents && template.agents.length > 0) {
        return "agents";
      }
      if (template.client) {
        return "client";
      }
      if (template.site || (template.sites && template.sites.length > 0)) {
        return "site";
      }
      return "all";
    }

    const state = reactive({
      name: props.template?.name || "",
      description: props.template?.description || "",
      enabled: props.template?.enabled ?? true,
      continue_on_error: props.template?.continue_on_error ?? false,
      collector_all_output: props.template?.collector_all_output ?? false,
      task_supported_platforms: "windows",
      target: determineTarget(props.template),
      client: props.template?.client || null,
      site: props.template?.site || props.template?.sites?.[0] || null,
      agents: props.template?.agents || [],
      actions: parseActionsFromBackend(props.template?.actions),
    });

    const loading = ref(false);
    const softwareOptions = ref([]);

    const { scriptOptions, getScriptOptions } = useScriptDropdown();
    const { agentOptions, getAgentOptions } = useAgentDropdown();
    const { siteOptions, getSiteOptions } = useSiteDropdown();
    const { clientOptions, getClientOptions } = useClientDropdown();
    const { customFieldOptions } = useCustomFieldDropdown({ onMount: true });

    function addCommand() {
      state.actions.commands.push({
        enabled: true,
        osType: "windows",
        shell: "cmd",
        custom_shell: null,
        cmd: "",
        timeout: 120,
        run_as_user: false,
      });
      expanded.commands = true;
    }

    function removeCommand(index) {
      state.actions.commands.splice(index, 1);
    }

    function addScript() {
      state.actions.scripts.push({
        enabled: true,
        script: null,
        args: [],
        env_vars: [],
        timeout: 300,
        run_as_user: false,
        save_to_custom_field: false,
        custom_field: null,
        collector_all_output: false,
        save_to_agent_note: false,
      });
      expanded.scripts = true;
    }

    function removeScript(index) {
      state.actions.scripts.splice(index, 1);
    }

    function addSoftware() {
      state.actions.software.push({
        enabled: true,
        software: [],
      });
      expanded.software = true;
    }

    function removeSoftware(index) {
      state.actions.software.splice(index, 1);
    }

    async function submit() {
      const hasEnabledAction =
        state.actions.commands.some((c) => c.enabled) ||
        state.actions.scripts.some((s) => s.enabled) ||
        state.actions.software.some((s) => s.enabled);

      if (!hasEnabledAction) {
        notifyError(
          "Please enable at least one action (command, script, or software)",
        );
        return;
      }

      loading.value = true;
      try {
        const actions = [];

        state.actions.commands?.forEach((cmd) => {
          if (cmd.enabled) {
            actions.push({
              type: "cmd",
              name: `Command: ${cmd.cmd.substring(0, 50)}`,
              command: cmd.cmd,
              shell: cmd.shell,
              custom_shell: cmd.custom_shell,
              timeout: cmd.timeout,
              run_as_user: cmd.run_as_user,
            });
          }
        });

        state.actions.scripts?.forEach((script) => {
          if (script.enabled) {
            actions.push({
              type: "script",
              name: `Script: ${script.script}`,
              script: script.script,
              script_args: script.args,
              env_vars: script.env_vars,
              timeout: script.timeout,
              run_as_user: script.run_as_user,
              save_to_custom_field: script.save_to_custom_field,
              custom_field: script.custom_field,
              collector_all_output: script.collector_all_output,
              save_to_agent_note: script.save_to_agent_note,
            });
          }
        });

        state.actions.software?.forEach((soft) => {
          if (soft.enabled && soft.software.length > 0) {
            soft.software.forEach((pkg) => {
              actions.push({
                type: "software",
                name: `Software: ${pkg}`,
                func: "install",
                choco_prog_name: pkg,
              });
            });
          }
        });

        const agentIds =
          state.target === "agents"
            ? state.agents
                .map((id) =>
                  typeof id === "string" ? Number.parseInt(id) : id,
                )
                .filter((id) => !Number.isNaN(id))
            : [];

        const siteIds =
          state.target === "site" && state.site
            ? [
                typeof state.site === "string"
                  ? Number.parseInt(state.site)
                  : state.site,
              ].filter((id) => !Number.isNaN(id))
            : [];

        const payload = {
          name: state.name,
          description: state.description,
          enabled: state.enabled,
          continue_on_error: state.continue_on_error,
          collector_all_output: state.collector_all_output,
          task_supported_platforms: state.task_supported_platforms,
          actions: actions,
          agents: agentIds,
          sites: siteIds,
        };

        if (state.target === "client" && state.client) {
          payload.client =
            typeof state.client === "string"
              ? Number.parseInt(state.client)
              : state.client;
        }
        if (state.target === "site" && state.site) {
          payload.site =
            typeof state.site === "string"
              ? Number.parseInt(state.site)
              : state.site;
        }

        if (isEdit.value) {
          await updateTemplate(props.template.id, payload);
          notifySuccess("Template updated successfully");
        } else {
          await createTemplate(payload);
          notifySuccess("Template created successfully");
        }

        onDialogOK();
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(async () => {
      getScriptOptions();
      getAgentOptions(false, "id");
      getSiteOptions();
      getClientOptions();

      const packages = await fetchChocosSoftware();
      softwareOptions.value = packages.map((pkg) => ({
        label: pkg.name,
        value: pkg.name,
      }));
    });

    return {
      dialogRef,
      onDialogHide,
      isEdit,
      expanded,
      state,
      loading,
      targetOptions,
      shellOptions,
      scriptOptions,
      agentOptions,
      siteOptions,
      clientOptions,
      customFieldOptions,
      softwareOptions,
      addCommand,
      removeCommand,
      addScript,
      removeScript,
      addSoftware,
      removeSoftware,
      submit,
      cmdPlaceholder,
    };
  },
});
</script>
