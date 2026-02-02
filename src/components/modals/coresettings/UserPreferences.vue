<template>
  <q-dialog ref="dialog" @hide="onHide">
    <q-card class="q-dialog-plugin" style="min-width: 60vw">
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs dense v-model="tab" vertical class="text-primary">
            <q-tab name="ui" label="User Interface" />
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-form @submit.prevent="editUserPrefs">
            <q-card-section class="row items-center">
              <div class="text-h6">Preferences</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <!-- UI -->
              <q-tab-panel name="ui">
                <div class="text-subtitle2">User Interface</div>
                <q-separator />
                <q-card-section class="row items-center">
                  <div class="col-6">Theme:</div>
                  <div class="col-2"></div>
                  <div class="col-4">
                    <label class="theme-switch" aria-label="Theme toggle">
                      <input
                        :checked="!darkMode"
                        type="checkbox"
                        @change="handleThemeChange"
                        aria-label="Switch between light and dark theme"
                      />
                      <span class="slider">
                        <div class="star star_1"></div>
                        <div class="star star_2"></div>
                        <div class="star star_3"></div>
                        <svg viewBox="0 0 16 16" class="cloud_1 cloud">
                          <path
                            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                            fill="#fff"
                            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                          ></path>
                        </svg>
                      </span>
                    </label>
                  </div>
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-6">Agent double-click action:</div>
                  <div class="col-2"></div>
                  <q-select
                    map-options
                    emit-value
                    outlined
                    dense
                    options-dense
                    v-model="agentDblClickAction"
                    :options="agentDblClickOptions"
                    class="col-4"
                    @update:model-value="url_action = null"
                  />
                </q-card-section>
                <q-card-section
                  class="row"
                  v-if="agentDblClickAction === 'urlaction'"
                >
                  <div class="col-6">URL Action:</div>
                  <div class="col-2"></div>
                  <q-select
                    map-options
                    emit-value
                    outlined
                    dense
                    options-dense
                    v-model="url_action"
                    :options="urlActions"
                    class="col-4"
                  />
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-6">Agent table default tab:</div>
                  <div class="col-2"></div>
                  <q-select
                    map-options
                    emit-value
                    outlined
                    dense
                    options-dense
                    v-model="defaultAgentTblTab"
                    :options="defaultAgentTblTabOptions"
                    class="col-4"
                  />
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-4">Loading Bar Color:</div>
                  <div class="col-4"></div>
                  <q-select
                    outlined
                    dense
                    options-dense
                    v-model="loading_bar_color"
                    :options="loadingBarColors"
                    class="col-4"
                  />
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Dashboard Info Color:</div>
                  <div class="col-2"></div>
                  <q-input
                    outlined
                    dense
                    v-model="dash_info_color"
                    class="col-8"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        size="sm"
                        icon="info"
                        @click="openURL(quasar_color_url)"
                      >
                        <q-tooltip>Click to see color options</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Dashboard Positive Color:</div>
                  <div class="col-2"></div>
                  <q-input
                    outlined
                    dense
                    v-model="dash_positive_color"
                    class="col-8"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        size="sm"
                        icon="info"
                        @click="openURL(quasar_color_url)"
                      >
                        <q-tooltip>Click to see color options</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Dashboard Negative Color:</div>
                  <div class="col-2"></div>
                  <q-input
                    outlined
                    dense
                    v-model="dash_negative_color"
                    class="col-8"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        size="sm"
                        icon="info"
                        @click="openURL(quasar_color_url)"
                      >
                        <q-tooltip>Click to see color options</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Dashboard Warning Color:</div>
                  <div class="col-2"></div>
                  <q-input
                    outlined
                    dense
                    v-model="dash_warning_color"
                    class="col-8"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        size="sm"
                        icon="info"
                        @click="openURL(quasar_color_url)"
                      >
                        <q-tooltip>Click to see color options</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Client Sort:</div>
                  <div class="col-2"></div>
                  <q-select
                    map-options
                    emit-value
                    outlined
                    dense
                    options-dense
                    v-model="clientTreeSort"
                    :options="clientTreeSortOptions"
                    class="col-8"
                  />
                </q-card-section>
                <q-card-section class="row">
                  <div class="col-2">Date Format:</div>
                  <div class="col-2"></div>
                  <q-input outlined dense v-model="date_format" class="col-8">
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        size="sm"
                        icon="info"
                        @click="
                          openURL(
                            'https://quasar.dev/quasar-utils/date-utils#format-for-display',
                          )
                        "
                      >
                        <q-tooltip>Click to see formatting options</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="row">
                  <q-checkbox
                    v-model="clear_search_when_switching"
                    label="Clear search field when switching client/site"
                  />
                </q-card-section>
              </q-tab-panel>
            </q-tab-panels>

            <q-card-section class="row items-center">
              <q-btn label="Save" color="primary" type="submit" />
            </q-card-section>
          </q-form>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script>
import { openURL } from "quasar";
import { loadingBarColors } from "@/mixins/data";
import mixins from "@/mixins/mixins";

export default {
  name: "UserPreferences",
  emits: ["hide", "ok", "cancel"],
  mixins: [mixins],
  data() {
    return {
      loadingBarColors,
      agentDblClickAction: "",
      defaultAgentTblTab: "",
      clientTreeSort: "",
      url_action: null,
      tab: "ui",
      splitterModel: 20,
      loading_bar_color: "",
      dash_info_color: "",
      dash_positive_color: "",
      dash_negative_color: "",
      dash_warning_color: "",
      urlActions: [],
      clear_search_when_switching: true,
      date_format: "",
      quasar_color_url: "https://quasar.dev/style/color-palette",
      clientTreeSortOptions: [
        {
          label: "Sort alphabetically, moving failing clients to the top",
          value: "alphafail",
        },
        {
          label: "Sort alphabetically only",
          value: "alpha",
        },
      ],
      agentDblClickOptions: [
        {
          label: "Edit Agent",
          value: "editagent",
        },
        {
          label: "Take Control",
          value: "takecontrol",
        },
        {
          label: "Remote Background",
          value: "remotebg",
        },
        {
          label: "Run URL Action",
          value: "urlaction",
        },
      ],
      defaultAgentTblTabOptions: [
        {
          label: "Servers",
          value: "server",
        },
        {
          label: "Workstations",
          value: "workstation",
        },
        {
          label: "Mixed",
          value: "mixed",
        },
      ],
    };
  },
  watch: {
    agentDblClickAction(new_value) {
      if (new_value === "urlaction") {
        this.getURLActions();
      }
    },
  },
  methods: {
    handleThemeChange(event) {
      const checked = event.target.checked;
      const newDarkMode = !checked;
      this.darkMode = newDarkMode;
      this.$axios
        .patch("/accounts/users/ui/", { dark_mode: newDarkMode })
        .catch((error) => {
          this.darkMode = !newDarkMode;
          console.error("Failed to save dark mode preference:", error);
          this.notifyError("Failed to save theme preference");
        });
    },
    openURL(url) {
      openURL(url);
    },
    getURLActions() {
      this.$axios.get("/core/urlaction/").then((r) => {
        this.urlActions = r.data
          .filter((action) => action.action_type === "web")
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((action) => ({
            label: action.name,
            value: action.id,
          }));

        if (this.urlActions.length === 0) {
          this.notifyWarning(
            "No URL Actions configured. Go to Settings > Global Settings > URL Actions",
          );
        }
      });
    },
    getUserPrefs() {
      this.$axios.get("/core/dashinfo/").then((r) => {
        this.agentDblClickAction = r.data.dbl_click_action;
        this.url_action = r.data.url_action;
        this.defaultAgentTblTab = r.data.default_agent_tbl_tab;
        this.clientTreeSort = r.data.client_tree_sort;
        this.loading_bar_color = r.data.loading_bar_color;
        this.dash_info_color = r.data.dash_info_color;
        this.dash_positive_color = r.data.dash_positive_color;
        this.dash_negative_color = r.data.dash_negative_color;
        this.dash_warning_color = r.data.dash_warning_color;
        this.clear_search_when_switching = r.data.clear_search_when_switching;
        this.date_format = r.data.date_format;
      });
    },
    editUserPrefs() {
      if (
        this.agentDblClickAction === "urlaction" &&
        this.url_action === null
      ) {
        this.notifyError("Select a URL Action");
        return;
      }
      const data = {
        agent_dblclick_action: this.agentDblClickAction,
        url_action: this.url_action,
        default_agent_tbl_tab: this.defaultAgentTblTab,
        client_tree_sort: this.clientTreeSort,
        loading_bar_color: this.loading_bar_color,
        dash_info_color: this.dash_info_color,
        dash_positive_color: this.dash_positive_color,
        dash_negative_color: this.dash_negative_color,
        dash_warning_color: this.dash_warning_color,
        clear_search_when_switching: this.clear_search_when_switching,
        date_format: this.date_format,
      };
      this.$axios.patch("/accounts/users/ui/", data).then(() => {
        this.notifySuccess("Preferences were saved!");
        this.$store.dispatch("loadTree");
        this.onOk();
      });
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onHide() {
      this.$emit("hide");
    },
    onOk() {
      this.$emit("ok");
      this.hide();
    },
  },
  computed: {
    darkMode: {
      get() {
        return this.$q.dark.isActive;
      },
      set(value) {
        this.$q.dark.set(value);
      },
    },
  },
  mounted() {
    this.getUserPrefs();
  },
};
</script>

<style scoped>
.theme-switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 1.5em;
  border-radius: 30px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1a1a2e;
  transition: 0.4s;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-switch .slider:before {
  position: absolute;
  content: "";
  height: 0.7em;
  width: 0.7em;
  border-radius: 50%;
  left: 0.5em;
  bottom: 0.3em;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.81, -0.04, 0.38, 1.5);
  background: #fff;
  mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  -webkit-mask: radial-gradient(circle at 30% 50%, transparent 35%, white 35%);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(255, 255, 255, 0.4);
}

.theme-switch input:checked + .slider {
  background-color: #0099ff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switch input:checked + .slider:before {
  transform: translateX(1.8em);
  mask: none;
  -webkit-mask: none;
  background: radial-gradient(circle, #ffcf48 0%, #ffcf48 100%);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.3) inset,
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 12px rgba(255, 207, 72, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.theme-switch input:checked ~ .slider .star {
  opacity: 0;
}

.theme-switch input:checked ~ .slider .cloud {
  opacity: 1;
}

.theme-switch .star {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  width: 6px;
  height: 6px;
  transition: all 0.4s;
  box-shadow:
    0 0 3px rgba(255, 255, 255, 0.8),
    0 0 6px rgba(255, 255, 255, 0.4);
}

.theme-switch .star_1 {
  left: 1.5em;
  top: 0.3em;
}

.theme-switch .star_2 {
  left: 2.3em;
  top: 0.5em;
}

.theme-switch .star_3 {
  left: 1.9em;
  top: 0.9em;
}

.theme-switch .cloud {
  width: 3.5em;
  position: absolute;
  bottom: -1.4em;
  left: -1.1em;
  opacity: 0;
  transition: all 0.4s;
}

.body--dark .theme-switch {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.body--light .theme-switch {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
</style>
