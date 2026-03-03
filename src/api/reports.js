import axios from "axios";

const baseUrl = "/reports";

export async function fetchReports() {
  const { data } = await axios.get(`${baseUrl}/`);
  return data;
}

export async function fetchReportFieldsBySourceType(params = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}/fields/`, { params: params });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function downloadReportById(id) {
  try {
    const { data } = await axios.get(`${baseUrl}/${id}/download/`, {
      responseType: "blob",
    });
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function createReport(report) {
  try {
    const { data } = await axios.post(`${baseUrl}/`, report);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function patchReportById(id, payload) {
  try {
    const { data } = await axios.patch(`${baseUrl}/${id}/`, payload);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function closeReportById(id) {
  try {
    const { data } = await axios.post(`${baseUrl}/${id}/close/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function deleteReportById(id) {
  try {
    const { data } = await axios.delete(`${baseUrl}/${id}/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function getReportById(id) {
  try {
    const { data } = await axios.get(`${baseUrl}/${id}/`);
    return data;
  } catch (e) {
    console.error(e);
  }
}
