import axios from "axios";

const baseUrl = "/clients";

// tree endpoint
export async function fetchTree() {
  try {
    const { data } = await axios.get("/apiv3/tree/");
    return data;
  } catch (e) {
    console.error(e);
  }
}

// flat site list for dropdowns
export async function fetchSitesFlat() {
  try {
    const { data } = await axios.get(`${baseUrl}/sites/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

// sync endpoints
export async function syncSiteTree() {
  const { data } = await axios.post(`${baseUrl}/sites/sync/`);
  return data;
}

export async function syncAgents() {
  const { data } = await axios.post(`${baseUrl}/sites/sync-agents/`);
  return data;
}

// site endpoints
export async function fetchSites() {
  try {
    const { data } = await axios.get(`${baseUrl}/sites/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchSite(id) {
  try {
    const { data } = await axios.get(`${baseUrl}/sites/${id}/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function saveSite(payload) {
  const { data } = await axios.post(`${baseUrl}/sites/`, payload);
  return data;
}

export async function editSite(id, payload) {
  const { data } = await axios.put(`${baseUrl}/sites/${id}/`, payload);
  return data;
}

export async function removeSite(id, params = {}) {
  const { data } = await axios.delete(`${baseUrl}/sites/${id}/`, {
    params: params,
  });
  return data;
}

// deployment endpoints
export async function fetchDeployments() {
  try {
    const { data } = await axios.get(`${baseUrl}/deployments/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function saveDeployment(payload) {
  const { data } = await axios.post(`${baseUrl}/deployments/`, payload);
  return data;
}

export async function removeDeployment(id, params = {}) {
  const { data } = await axios.delete(`${baseUrl}/deployments/${id}/`, {
    params: params,
  });
  return data;
}
