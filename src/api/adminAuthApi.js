import { apiGet, apiPost } from './apiClient.js';

export function loginAdmin({ email, password }) {
  return apiPost('/auth/admin/login', { email, password });
}

export function logoutAdmin() {
  return apiPost('/auth/admin/logout');
}

export function getCurrentAdmin() {
  return apiGet('/auth/admin/me');
}

export function getAdminCsrfToken() {
  return apiGet('/auth/admin/csrf');
}

export function changeAdminPassword(payload, csrfToken) {
  return apiPost('/auth/admin/change-password', payload, {
    headers: { 'X-CSRF-TOKEN': csrfToken },
  });
}

export const adminAuthApi = {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getAdminCsrfToken,
  changeAdminPassword,
};
