import axios from "axios";
import { openURL } from "quasar";
import { router } from "@/router";

const baseUrl = "/agents";

export function runTakeControl(agent_id) {
  const url = router.resolve(`/takecontrol/${agent_id}`).href;
  openURL(url, null, {
    popup: true,
    scrollbars: false,
    location: false,
    status: false,
    toolbar: false,
    menubar: false,
    width: 1600,
    height: 900,
  });
}

export function runWebVNC(agent_id, port) {
  const url = router.resolve(`/webvnc/${agent_id}/${port}`).href;
  openURL(url, null, {
    popup: true,
    scrollbars: false,
    location: false,
    status: false,
    toolbar: false,
    menubar: false,
    width: 1600,
    height: 900,
  });
}

export function openAgentWindow(agent_id) {
  const url = router.resolve(`/agents/${agent_id}`).href;
  openURL(url, null, {
    popup: true,
    scrollbars: false,
    location: false,
    status: false,
    toolbar: false,
    menubar: false,
    width: 1600,
    height: 900,
  });
}

export function runRemoteBackground(agent_id, agentPlatform) {
  const url = router.resolve(
    `/remotebackground/${agent_id}?agentPlatform=${agentPlatform}`,
  ).href;
  openURL(url, null, {
    popup: true,
    scrollbars: false,
    location: false,
    status: false,
    toolbar: false,
    menubar: false,
    width: 1280,
    height: 900,
  });
}

export async function fetchAgents(params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/`, { params: params });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAgent(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function editAgent(agent_id, payload) {
  const { data } = await axios.put(`${baseUrl}/${agent_id}/`, payload);
  return data;
}

export async function removeAgent(agent_id) {
  const { data } = await axios.delete(`${baseUrl}/${agent_id}/`);
  return data;
}

export async function fetchAgentHistory(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/history/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAgentChecks(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/checks/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAgentTasks(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/tasks/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function sendAgentRecovery(agent_id, payload) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/recover/`, payload);
  return data;
}

export async function sendAgentCommand(agent_id, payload) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/cmd/`, payload);
  return data;
}

export async function refreshAgentWMI(agent_id) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/wmi/`);
  return data;
}

export async function runScript(agent_id, payload) {
  const { data } = await axios.post(
    `${baseUrl}/${agent_id}/runscript/`,
    payload,
  );
  return data;
}

export async function runBulkAction(payload) {
  const { data } = await axios.post(`${baseUrl}/actions/bulk/`, payload);
  return data;
}

export async function fetchAgentProcesses(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/processes/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function killAgentProcess(agent_id, pid, params = {}) {
  const { data } = await axios.delete(
    `${baseUrl}/${agent_id}/processes/${pid}/`,
    { params: params },
  );
  return data;
}

export async function fetchAgentEventLog(agent_id, logType, days, params = {}) {
  try {
    const { data } = await axios.get(
      `${baseUrl}/${agent_id}/eventlog/${logType}/${days}/`,
      { params: params },
    );
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAgentMeshCentralURLs(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/meshcentral/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAgentWebVNCUrl(agent_id, port) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/${port}/webvnc/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function scheduleAgentReboot(agent_id, payload) {
  const { data } = await axios.patch(`${baseUrl}/${agent_id}/reboot/`, payload);
  return data;
}

export async function agentRebootNow(agent_id) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/reboot/`);
  return data;
}

export async function agentShutdown(agent_id) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/shutdown/`);
  return data;
}

export async function sendAgentRecoverMesh(agent_id, params = {}) {
  const { data } = await axios.post(
    `${baseUrl}/${agent_id}/meshcentral/recover/`,
    { params: params },
  );
  return data;
}

export async function exitAgentKioskSession(agent_id) {
  const { data } = await axios.post(
    `${baseUrl}/${agent_id}/meshcentral/kiosk-exit/`,
  );
  return data;
}

export async function sendAgentPing(agent_id, params = {}) {
  const { data } = await axios.get(`${baseUrl}/${agent_id}/ping/`, {
    params: params,
  });
  return data;
}

// agent notes
export async function fetchAgentNotes(agent_id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/${agent_id}/notes/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function saveAgentNote(payload) {
  const { data } = await axios.post(`${baseUrl}/notes/`, payload);
  return data;
}

export async function editAgentNote(pk, payload) {
  const { data } = await axios.put(`${baseUrl}/notes/${pk}/`, payload);
  return data;
}

export async function removeAgentNote(pk) {
  const { data } = await axios.delete(`${baseUrl}/notes/${pk}/`);
  return data;
}

export async function wakeUpWOL(agent_id) {
  const { data } = await axios.post(`${baseUrl}/${agent_id}/wol/`);
  return data;
}

// agent versions
export async function fetchAgentVersions() {
  try {
    const { data } = await axios.get(`${baseUrl}/versions/`);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// update agents with optional version and downgrade parameters
export async function updateAgents(payload) {
  console.log("=== API updateAgents payload ===", payload);
  try {
    const { data } = await axios.post(`${baseUrl}/update/`, payload);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// MDM agent versions
export async function fetchMdmVersions() {
  try {
    const { data } = await axios.get(`${baseUrl}/mdm/versions/`);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// MDM agent update
export async function updateMdmAgents(payload) {
  try {
    const { data } = await axios.post(`${baseUrl}/mdm/update/`, payload);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// MDM agent delete
export async function deleteMdmAgents(payload) {
  try {
    const { data } = await axios.post(`${baseUrl}/mdm/delete/`, payload);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// geolocation
export async function fetchAgentsGeolocation() {
  try {
    const { data } = await axios.get(`${baseUrl}/geolocation/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchGeolocationBySite(siteId) {
  const { data } = await axios.get(`${baseUrl}/geolocation/site/${siteId}/`);
  return data;
}

export async function fetchGeolocationByUserGroup(groupId) {
  const { data } = await axios.get(
    `${baseUrl}/geolocation/user-group/${groupId}/`,
  );
  return data;
}

export async function fetchGeolocationByUser(userId) {
  const { data } = await axios.get(`${baseUrl}/geolocation/user/${userId}/`);
  return data;
}

export async function fetchAgentGeolocationHistory(agentId, params = {}) {
  try {
    const { data } = await axios.get(
      `${baseUrl}/${agentId}/geolocation/history/`,
      { params },
    );
    return data;
  } catch (e) {
    console.error(e);
  }
}
