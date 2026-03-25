import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { Dark, LoadingBar } from "quasar";

export const useAppStore = defineStore("app", () => {
  const needrefresh = ref(false);
  const currentVersion = ref<string | null>(null);
  const latestVersion = ref<string | null>(null);
  const tokenExpired = ref(false);
  const hosted = ref(false);
  const dateFormat = ref("MMM-DD-YYYY - HH:mm");
  const showCommunityScripts = ref(false);
  const agentDblClickAction = ref("");
  const agentUrlAction = ref<unknown>(null);
  const clearSearchWhenSwitching = ref(false);
  const runCmdPlaceholderText = ref({
    cmd: "rmdir /S /Q C:\\Windows\\System32",
    powershell: "Remove-Item -Recurse -Force C:\\Windows\\System32",
    shell: "rm -rf --no-preserve-root /",
  });
  const serverScriptsEnabled = ref(true);
  const webTerminalEnabled = ref(true);
  const ssoEnabled = ref(false);
  const blockLocalUserLogon = ref(false);
  const openAIIntegrationEnabled = ref(false);
  const dashInfoColor = ref("info");
  const dashPositiveColor = ref("positive");
  const dashNegativeColor = ref("negative");
  const dashWarningColor = ref("warning");

  const updateAvailable = computed(() => {
    if (
      latestVersion.value === "error" ||
      hosted.value ||
      currentVersion.value?.includes("-dev")
    )
      return false;
    return currentVersion.value !== latestVersion.value;
  });

  async function getDashInfo(edited = true) {
    const { data } = await axios.get("/core/dashinfo/");
    dashInfoColor.value = data.dash_info_color;
    dashPositiveColor.value = data.dash_positive_color;
    dashNegativeColor.value = data.dash_negative_color;
    dashWarningColor.value = data.dash_warning_color;

    if (edited) {
      LoadingBar.setDefaults({ color: data.loading_bar_color });
      clearSearchWhenSwitching.value = data.clear_search_when_switching;
    }

    Dark.set(data.dark_mode);
    currentVersion.value = data.trmm_version;
    latestVersion.value = data.latest_trmm_ver;
    agentDblClickAction.value = data.dbl_click_action;
    agentUrlAction.value = data.url_action;
    showCommunityScripts.value = data.show_community_scripts;
    hosted.value = data.hosted;
    tokenExpired.value = data.token_is_expired;
    openAIIntegrationEnabled.value = data.open_ai_integration_enabled;
    runCmdPlaceholderText.value = data.run_cmd_placeholder_text;
    serverScriptsEnabled.value = data.server_scripts_enabled;
    webTerminalEnabled.value = data.web_terminal_enabled;
    blockLocalUserLogon.value = data.block_local_user_logon;

    if (data?.date_format !== "") dateFormat.value = data.date_format;
    else dateFormat.value = data.default_date_format;
  }

  async function checkVer() {
    try {
      const { data: version } = await axios.get("/core/version/");
      if (localStorage.getItem("rmmver")) {
        if (localStorage.getItem("rmmver") === version) return;
        else {
          localStorage.setItem("rmmver", "0.0.1");
          needrefresh.value = true;
        }
      } else {
        localStorage.setItem("rmmver", version);
      }
    } catch {
      // ignore
    }
  }

  function reload() {
    localStorage.removeItem("rmmver");
    location.reload();
  }

  return {
    needrefresh,
    currentVersion,
    latestVersion,
    tokenExpired,
    hosted,
    dateFormat,
    showCommunityScripts,
    agentDblClickAction,
    agentUrlAction,
    clearSearchWhenSwitching,
    runCmdPlaceholderText,
    serverScriptsEnabled,
    webTerminalEnabled,
    ssoEnabled,
    blockLocalUserLogon,
    openAIIntegrationEnabled,
    dashInfoColor,
    dashPositiveColor,
    dashNegativeColor,
    dashWarningColor,
    updateAvailable,
    getDashInfo,
    checkVer,
    reload,
  };
});
