import { apiDelete, apiGet, apiPost, apiPut } from './apiClient.js';

export function getAdminCategories() {
  return apiGet('/admin/categories');
}

export function getAdminCategoryById(id) {
  return apiGet(`/admin/categories/${encodeURIComponent(id)}`);
}

function csrfHeaders(csrfToken) {
  return { headers: { 'X-CSRF-TOKEN': csrfToken } };
}

export function createAdminCategory(payload, csrfToken) {
  return apiPost('/admin/categories', payload, csrfHeaders(csrfToken));
}

export function updateAdminCategory(id, payload, csrfToken) {
  return apiPut(
    `/admin/categories/${encodeURIComponent(id)}`,
    payload,
    csrfHeaders(csrfToken),
  );
}

export function deleteAdminCategory(id, csrfToken) {
  return apiDelete(
    `/admin/categories/${encodeURIComponent(id)}`,
    csrfHeaders(csrfToken),
  );
}

export const adminCategoriesApi = {
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
