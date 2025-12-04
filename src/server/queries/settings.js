import { proxyJSON } from "./_api";

export async function getAdmins(_ignored, { page = 1, perPage = 15 } = {}) {
  return proxyJSON("admins", { params: { page, limit: perPage } });
}

export async function createAdmin(_ignored, payload) {
  return proxyJSON("admins", { method: "POST", json: payload });
}

export async function deleteAdmin(_ignored, id) {
  return proxyJSON(`admins`, { method: "DELETE" });
}

export async function getProfile() {
  return proxyJSON("profile");
}

export async function updateProfile(_ignored, formData) {
  return proxyJSON("profile", { method: "POST", formData });
}

export async function changePassword(_ignored, payload) {
  return proxyJSON("password/change", { method: "POST", json: payload });
}
