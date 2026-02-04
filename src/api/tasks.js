import axios from "axios";

const baseUrl = "/tasks";

export async function fetchTasks(params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/`, { params: params });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function saveTask(payload) {
  const { data } = await axios.post(`${baseUrl}/`, payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await axios.put(`${baseUrl}/${id}/`, payload);
  return data;
}

export async function removeTask(id) {
  const { data } = await axios.delete(`${baseUrl}/${id}/`);
  return data;
}

export async function runTask(id, payload) {
  const { data } = await axios.post(`${baseUrl}/${id}/run/`, payload);
  return data;
}

export async function fetchTemplates(params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/templates/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchTemplate(id, params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/templates/${id}/`, {
      params: params,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function createTemplate(payload) {
  const { data } = await axios.post(`${baseUrl}/templates/`, payload);
  return data;
}

export async function updateTemplate(id, payload) {
  const { data } = await axios.put(`${baseUrl}/templates/${id}/`, payload);
  return data;
}

export async function patchTemplate(id, payload) {
  const { data } = await axios.patch(`${baseUrl}/templates/${id}/`, payload);
  return data;
}

export async function deleteTemplate(id) {
  const { data } = await axios.delete(`${baseUrl}/templates/${id}/`);
  return data;
}

export async function runTemplate(id) {
  const { data } = await axios.post(`${baseUrl}/templates/${id}/apply/`);
  return data;
}
